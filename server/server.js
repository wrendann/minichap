const app = require('./app')
const http = require('http')
const jwt = require('jsonwebtoken')

const server = http.createServer(app)
const { Server } = require("socket.io")
const io = new Server(server)

io.on('connection', (socket) => {

  socket.on('join room', async (obj) => {
    const roomId = obj.roomId
    const token = obj.token
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if(decodedToken.roomId !== roomId)
    {
      console.log('Unauthorized socket')
      const err = new Error("Not authorized")
      next(err)
    }
    await socket.join(roomId)
    console.log(socket.id)
    socket.emit('joined room', 'yeah, really')
  })

    socket.on('chat message', (msg) => {
      socket.to(Array.from(socket.rooms)).emit('chat message', msg)
    })
  })

server.listen(8080, () => {
  console.log('listening on *:8080')
})