import React, { useState, useEffect } from 'react'
import io from 'socket.io-client'

const socket = io(
  'http://localhost:8080/',
  { 
    transports : ['websocket'],
    'sync disconnect on unload' : true,
  })
import ChatRoom from './components/ChatRoom'
import EnterChat from './components/EnterChat'

const App = () => {

  const userNumber = Math.ceil(9999*Math.random())
  const [roomId, setRoomId] = useState('')
  const [name, setName] = useState('User' + userNumber)
  const [chatConnected, setChatConnected] = useState(false)
  const [admin, setAdmin] = useState(false)

  useEffect(() => {
    document.title = 'minichap'
  }, [])

  return (
    <div className='mainDiv'>
    <div className={chatConnected? 'minichapRoom' : 'minichapEnter'}>minichap</div>
      {
        !chatConnected || !socket ? 
        <EnterChat name={name} setName={setName} setChatConnected={setChatConnected} roomId={roomId} setRoomId={setRoomId} socket={socket} setAdmin={setAdmin}/>:
        <ChatRoom name={name} roomId={roomId} socket={socket} setChatConnected={setChatConnected} admin={admin} setAdmin={setAdmin}/>
      }
    </div>
  )

}

export default App
