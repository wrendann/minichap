import React, { useState } from 'react'
import io from 'socket.io-client'

const socket = io(
  'http://localhost:8080/',
  { 
    transports : ['websocket']})
import ChatRoom from './components/ChatRoom'
import EnterChat from './components/EnterChat'

const App = () => {

  const userNumber = Math.ceil(9999*Math.random())
  const [roomId, setRoomId] = useState('')
  const [name, setName] = useState('User' + userNumber)
  const [chatConnected, setChatConnected] = useState(false)

  return (
    <div>
      {
        !chatConnected || !socket ? 
        <EnterChat name={name} setName={setName} setChatConnected={setChatConnected} roomId={roomId} setRoomId={setRoomId} socket={socket}/>:
        <ChatRoom name={name} roomId={roomId}  socket={socket}/>
      }
    </div>
  )

}

export default App
