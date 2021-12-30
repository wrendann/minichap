require('dotenv').config()
const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const joinRoomRouter = require('./controllers/joinRoom')
const newRoomRouter = require('./controllers/newRoom')
const mongoose = require('mongoose')

console.log('connecting to', process.env.MONGODB_URI)

app.use(cors({
    credentials: true,
  }))

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

app.use(express.static('build'))
app.use(express.json())

app.use('/api/join', joinRoomRouter)
app.use('/api/host', newRoomRouter)

module.exports = app