const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const cors = require('cors')
const { Server } = require("socket.io")
const io = new Server(server)

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}))

io.on('connection', (socket) => {
    socket.on('chat message', (msg) => {
      io.emit('chat message', msg)
    })
  })

server.listen(8080, () => {
  console.log('listening on *:8080')
})