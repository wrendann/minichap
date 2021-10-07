import React, {useState, useEffect} from 'react'
import io from 'socket.io-client'

const socket = io('http://localhost:8080/', { transports : ['websocket'] })

const App = () => {

  const userNumber = Math.ceil(50*Math.random())

  const [message, setMessage] = useState('')
  const [name, setName] = useState('User' + userNumber)
  const [chats, setChats] = useState([])

  useEffect(() => {
    socket.on('chat message', (msg) => {
      if(msg)
      {
        setChats([...chats, msg])
      }
    })
  }, )

  const newMessageSent = (e) => {

    e.preventDefault();
    if (message && name) {
      socket.emit('chat message', {'message': message, 'name': name});
      setMessage('');
    }
  }

  return (
    <div>
      <form>
        <input
          type = 'text'
          value = {name}
          name = 'name'
          onChange = {({target}) => setName(target.value)}
        />
      </form>
      <div>
        {chats.map((c) => <div>{c.name}: {c.message}</div>)}
      </div>
      <form>
        <input 
          type = 'text'
          value = {message}
          name = 'message'
          onChange = {({ target }) => setMessage(target.value)}
        />
        <button onClick = {newMessageSent}>Send</button>
      </form>
    </div>
  )

}

export default App
