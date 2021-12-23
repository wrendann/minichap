const { request } = require('../app')
const { remove } = require('../models/roomModel')
const RoomModel = require('../models/roomModel')

const addUser = async (roomId, name, socketId, adminStatus) => {

    const oldRooms = await RoomModel.find({roomId: roomId})
    const oldRoom = oldRooms[0]
    const newUser = {name: name, socketId: socketId, admin: adminStatus}
    const room = {
      roomId: roomId,
      passwordHash: oldRoom.passwordHash,
      users: [...oldRoom.users, newUser]
    }
    const updatedRoom = await RoomModel.findByIdAndUpdate(oldRoom.id, room, { new: true })
    return updatedRoom
}

const removeUser = async (roomId, socketId) => {

    const oldRooms = await RoomModel.find({roomId: roomId})
    if(oldRooms.length === 0)
        return
    const oldRoom = oldRooms[0]
    const room = {
      roomId: roomId,
      passwordHash: oldRoom.passwordHash,
      users: oldRoom.users.filter((u) => u.socketId != socketId)
    }

    const removedUser = oldRoom.users.find((u) => u.socketId === socketId)

    if (room.users.length > 0)
    {
        const updatedRoom = await RoomModel.findByIdAndUpdate(oldRoom.id, room, { new: true })
        const obj = {updatedRoom: updatedRoom, removedUser: removedUser}
        return obj
    }
    else
    {
        await RoomModel.findByIdAndRemove(oldRoom.id)
        const obj = {updatedRoom: null, removedUser: removedUser}
        return obj
    }

}

const makeAdmin = async (roomId, requestId, newId) => {
    const rooms = await RoomModel.find({roomId: roomId})
    if(rooms.length === 0)
        return null
    const room = rooms[0]
    const requestUser = room.users.find((u) => u.socketId === requestId)
    const newUser = room.users.find((u) => u.socketId === newId)
    if(!requestUser.admin)
        return null
    const user = {name: newUser.name, socketId: newUser.socketId, admin: true}
    const newRoom = {
        roomId: roomId,
        passwordHash: room.passwordHash,
        users: room.users.map((u) => {
        if(u.socketId === user.socketId)
            return user
        return u
    })}
    const updatedRoom = await RoomModel.findByIdAndUpdate(room.id, newRoom, { new: true })
    return updatedRoom
}

const kickUser = async (roomId, requestId, newId) => {
    const rooms = await RoomModel.find({roomId: roomId})
    if(rooms.length === 0)
        return null
    const room = rooms[0]
    const requestUser = room.users.find((u) => u.socketId === requestId)
    if(!requestUser.admin)
        return null
    const removedUser = room.users.find((u) => u.socketId === newId)
    const newRoom = 
    {
        roomId: roomId,
        passwordHash: room.passwordHash,
        users: room.users.filter((u) => u.socketId !== newId)
    }
    const updatedRoom = await RoomModel.findByIdAndUpdate(room.id, newRoom, { new: true })
    return {updatedRoom: updatedRoom, removedUser: removedUser, requestUser: requestUser}
}

module.exports = {addUser, removeUser, makeAdmin, kickUser}