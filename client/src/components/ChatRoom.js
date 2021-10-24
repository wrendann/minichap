import React, {useState, useEffect} from 'react'

const ChatRoom = ({name, roomId, socket}) => {

  const [message, setMessage] = useState('')
  const [chats, setChats] = useState([])

  useEffect(() => {
    socket.on('chat message', (msg) => {
      if(msg)
      {
        setChats([...chats, msg])
      }
    })

    socket.on('joined room', (msg) => {
      console.log('Joined Room')
      console.log(socket.id)
    })
  }, )

  const newMessageSent = (e) => {
    e.preventDefault();
    if (message && name) {
      setChats([...chats, {'message': message, 'name': 'You'}])
      const msgObject = {'message': message, 'name': name}
      socket.emit('chat message', msgObject);
      setMessage('');
    }
  }

  return (
    <div>
      <h2>{roomId}</h2>
      <div>
        {chats.map((c) => <div>{c.name}: {c.message}</div>)}
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
    </div>
  )
}

export default ChatRoom