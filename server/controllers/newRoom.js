const bcrypt = require('bcrypt')
const newRoomRouter = require('express').Router()
const RoomModel = require('../models/roomModel')

newRoomRouter.post('/', async (request, response) => {
  const body = request.body

  if(body.password.length < 3)
  {
    throw { name: 'ValidationError', message: 'Password must contain at least 3 characters!' }
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  const room = new RoomModel({
    roomId: body.roomId,
    passwordHash,
    users: [],
  })

  const savedRoom = await room.save()

  response.json(savedRoom)
})


module.exports = newRoomRouter