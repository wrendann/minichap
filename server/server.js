const app = require('./app')
const http = require('http')
const jwt = require('jsonwebtoken')
const manager = require('./management/manager')

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
    socket.join(roomId)
    
    const updatedRoom = await manager.addUser(roomId, obj.name, socket.id, obj.adminStatus)

    io.to(roomId).emit('user list', updatedRoom.users)
    socket.to(roomId).emit('joined room', obj.name)

  })

  socket.on('chat message', (msg) => {
    socket.to(Array.from(socket.rooms)).emit('chat message', msg)
  })

  socket.on('disconnecting', async () => {
    socket.leave(Array.from(socket.rooms))
    Array.from(socket.rooms).forEach(async (roomId) => {
      const obj = await manager.removeUser(roomId, socket.id)
      if(obj)
      {
        if(obj.updatedRoom)
        {
          socket.to(roomId).emit('user list', obj.updatedRoom.users)
          socket.to(roomId).emit('left room', obj.removedUser.name)
        }
      }
    })
  })

  socket.on('leave room', async () => {
    socket.leave(Array.from(socket.rooms))
    Array.from(socket.rooms).forEach(async (roomId) => {
      const obj = await manager.removeUser(roomId, socket.id)
      if(obj)
      {
        if(obj.updatedRoom)
        {
          socket.to(roomId).emit('user list', obj.updatedRoom.users)
          socket.to(roomId).emit('left room', obj.removedUser.name)
        }
      }
    })
  })

  socket.on('make admin', async (obj) => {
    const socketId = obj.socketId
    Array.from(socket.rooms).forEach(async (roomId) => {
      const result = await manager.makeAdmin(roomId, socket.id, socketId)
      if(result)
      {
        io.to(roomId).emit('user list', result.users)
      }
    })
  })

  socket.on('kick user', async (obj) => {
    const socketId = obj.socketId
    Array.from(socket.rooms).forEach(async (roomId) => {
      const result = await manager.kickUser(roomId, socket.id, socketId)
      if(result)
      {
        const kickedSocket = io.sockets.sockets.get(socketId)
        kickedSocket.leave(roomId)
        if(result.updatedRoom)
          io.to(roomId).emit('user list', result.updatedRoom.users)
        if(result.removedUser && result.requestUser)
          io.to(roomId).emit('kicked user', {removedUser: result.removedUser, requestUser: result.requestUser})
          socket.to(socketId).emit('user was kicked')
      }
    })
  })

  })

server.listen(8080, () => {
  console.log('listening on *:8080')
})