import React, {useState, useEffect} from 'react'
import User from './User'

const ChatRoom = ({name, roomId, socket, setChatConnected, admin, setAdmin}) => {

  const [message, setMessage] = useState('')
  const [chats, setChats] = useState([])
  const [userList, setUserList] = useState([])

  useEffect(() => {
    socket.on('chat message', (msg) => {
      if(msg)
      {
        setChats([...chats, msg])
      }
    })

    socket.on('joined room', (name) => {
      if(name)
      {
        setChats([...chats, {'type': 'join', 'name': name}])
      }
    })

    socket.on('left room', (name) => {

      if(name)
      {
        setChats([...chats, {'type': 'leave', 'name': name}])
      }
    })

    socket.on('kicked user', (obj) => {
      if(obj)
      {
        if(obj.removedUser && obj.requestUser)
        {
          setChats([...chats, {'type': 'kick', 'kicker': obj.requestUser, 'kicked': obj.removedUser}])
        }
      }
    })

    socket.on('user was kicked', () => {
      setChatConnected(false)
    })
    
    socket.on('user list', (list) => {
      if(list)
      {
        setUserList(list)
        const thisUser = list.find((u) => u.socketId === socket.id)
        if(thisUser){
          if(thisUser.admin !== admin)
            setAdmin(thisUser.admin)
        }
      }
    })
  }, )

  const newMessageSent = (e) => {
    e.preventDefault()
    if (message && name) {
      setChats([...chats, {'type': 'msg', 'message': message, 'name': 'You'}])
      const msgObject = {'type': 'msg', 'message': message, 'name': name}
      socket.emit('chat message', msgObject)
      setMessage('')
    }
  }

  const leaveRoom = (e) => {
    e.preventDefault()
    socket.emit('leave room')
    setChatConnected(false)
  }

  return (
    <div>
      <h2>{roomId}</h2>
      <button onClick={leaveRoom}>leave</button>
      <div>
        {chats.map((c) => 
        {
          if(c.type === 'msg')
            return <div>{c.name}: {c.message}</div>
          else if(c.type === 'join')
            return <div>{c.name} has joined the room.</div>
          else if(c.type === 'leave')
            return <div>{c.name} has left the room.</div>
          else if(c.type === 'kick')
            return <div>{c.kicked.name} was kicked out by {c.kicker.name}.</div>
        })}
      </div>
      <form>
        <input 
          type='text'
          value={message}
          name='message'
          onChange={({ target }) => setMessage(target.value)}
        />
        <button onClick={newMessageSent}>Send</button>
      </form>
      <div>
        <h3>User List</h3>
        <div>
          {
            userList.map((u) => {
              return (<User socket={socket} user={u} admin={admin}/>)
            })
          }
        </div>
      </div>
    </div>
  )
}

export default ChatRoom