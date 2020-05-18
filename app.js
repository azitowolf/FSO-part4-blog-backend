const express = require('express')
const app = express()
require('express-async-errors')
const config = require('./utils/config')
const middleware = require('./utils/middleware')
const cors = require('cors')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

const mongoose = require('mongoose')

const mongoUrl = process.env.NODE_ENV === 'test' ? config.MONGODB_TEST_URI : config.MONGODB_URI
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true,  useFindAndModify: false, useCreateIndex: true })

app.use(cors())
app.use(express.json())

app.use(middleware.tokenExtractor)
app.use(middleware.requestLogger)

app.use(blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app