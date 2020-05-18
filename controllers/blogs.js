const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')


blogsRouter.get('/api/blogs', async (request, response) => {
  const blogs = await Blog.find({}).populate( { path : 'author' }) // Add the user information to response
  response.json(blogs.map(blog => blog.toJSON()))
})

// TODO should be auth token restricted
blogsRouter.get('api/blogs/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog.toJSON())
  } else {
    response.status(404).end()
  }
})

blogsRouter.post('/api/blogs', async (request, response) => {
  const body = request.body

  if (body.url === undefined || body.title === undefined) {
    response.status(400).end()
  }

  const token = request.token // will return NULL if none given or not proper format
  const decodedToken = jwt.verify(token, process.env.SECRET) // returns a user object { username: 'example', name: 'example' }
  if (!token || !decodedToken.id) { // no token, or the object decoded from the token does not contain the users identity
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const user = await User.findById(decodedToken.id)

  const blog = new Blog({
    title: body.title,
    author: user._id,
    url: body.url,
    likes: body.likes || 0
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.json(savedBlog.toJSON())
})

blogsRouter.delete('/api/blogs/:id', async (request, response) => {

  const token = request.token // will return NULL if none given or not proper format
  const decodedToken = jwt.verify(token, process.env.SECRET) // returns a user object { username: 'example', name: 'example' }
  if (!token || !decodedToken.id) { // no token, or the object decoded from the token does not contain the users identity
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const blog = await Blog.findById(request.params.id)
  const user = await User.findById(decodedToken.id)

  if (user.id.toString() === blog.author.toString()) {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  }
  response.status(401).end()
})

// TODO should be auth token restricted
blogsRouter.put('/:id', async (request, response) => {
  const body = request.body

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0
  })

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  response.json(updatedBlog.toJSON())
})

module.exports = blogsRouter