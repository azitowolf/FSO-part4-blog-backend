const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

const initialBlogs = [
  { title:'Why Conspiracy theories are so appealing',
    author:'hans jerasdfbsadf',
    url:'fake.endpoint.com',
    likes:'15' }
]

beforeEach(async () => {
  await Blog.deleteMany({})

  let noteObject = new Blog(initialBlogs[0])
  await noteObject.save()

})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(initialBlogs.length)
})

test('objects have id property formatted correctly', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body[0].id).toBeDefined()
})

test('new blog can be created', async () => {
  const newBlog = {
    author:'Aziz Ansari',
    title:'Modern romance',
    url:'fake.endpoint.com',
    likes:'12'
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(initialBlogs.length + 1)
})

test('new blog without likes defined defaults to 0', async () => {
  const newBlogWithoutLikes = {
    author:'Neuroses',
    title:'karen Horney',
    url:'fake.endpoint.com'
  }

  const postedBlog = await api
    .post('/api/blogs')
    .send(newBlogWithoutLikes)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  expect(postedBlog.body).toBeTruthy()
  expect(postedBlog.body.likes).toEqual(0)

})

test('POST new blog without title or url returns 400', async () => {
  const newBlog = {
    author:'Aziz Ansari',
    likes:'12'
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

})

test('blog can be deleted', async () => {

  await api
    .delete('/api/blogs/5ebd7bd8abf1619a25191c69')
    .expect(204)

})

afterAll(() => {
  mongoose.connection.close()
})