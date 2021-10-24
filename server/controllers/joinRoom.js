const bcrypt = require('bcrypt')
const joinRoomRouter = require('express').Router()
const RoomModel = require('../models/roomModel')
const jwt = require('jsonwebtoken')

joinRoomRouter.post('/', async (request, response) => {
  const body = request.body

  const room = await RoomModel.findOne({ roomId: body.roomId })
  const passwordCorrect = room === null
    ? false
    : await bcrypt.compare(body.password, room.passwordHash)

  if (!(room && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid roomId or password'
    })
  }

  const roomForToken = {
    roomId: body.roomId
  }

  const token = jwt.sign(roomForToken, process.env.SECRET)

  response
    .status(200)
    .send(token)
})

module.exports = joinRoomRouter