import React, {useState, useEffect} from 'react'
import User from './User'

const ChatRoom = ({name, roomId, socket, setChatConnected, admin, setAdmin}) => {

  const [message, setMessage] = useState('')
  const [chats, setChats] = useState([])
  const [userList, setUserList] = useState([])
  const [listCss, setListCss] = useState('false')

  useEffect(() => {
    socket.on('chat message', (msg) => {
      if(msg)
      {
        setChats([msg, ...chats])
      }
    })

    socket.on('joined room', (name) => {
      if(name)
      {
        setChats([{'type': 'join', 'name': name}, ...chats])
      }
    })

    socket.on('left room', (name) => {

      if(name)
      {
        setChats([{'type': 'leave', 'name': name}, ...chats])
      }
    })

    socket.on('kicked user', (obj) => {
      if(obj)
      {
        if(obj.removedUser && obj.requestUser)
        {
          setChats([{'type': 'kick', 'kicker': obj.requestUser, 'kicked': obj.removedUser}, ...chats])
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
      setChats([{'type': 'msg', 'message': message, 'name': 'You'}, ...chats])
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

  const toggleUserList = (e) => {
    e.preventDefault()
    setListCss(!listCss)
  }

  return (
    <div>
      <div className='roomIdDiv'>{roomId}</div>
      <button onClick={leaveRoom} className='leaveRoomBtn'>leave</button>
      <div className={listCss ? 'chatDisplayPart' : 'chatDisplayFull'}>
        {chats.map((c) => 
        {
          if(c.type === 'msg')
            return <div className='chatMsg'>{c.name}: {c.message}</div>
          else if(c.type === 'join')
            return <div className='chatJoin'>{c.name} has joined the room.</div>
          else if(c.type === 'leave')
            return <div className='chatLeave'>{c.name} has left the room.</div>
          else if(c.type === 'kick')
            return <div className='chatKick'>{c.kicked.name} was kicked out by {c.kicker.name}.</div>
          return null
        })}
      </div>
      <form className='chatBoxForm'>
        <input className='chatBox' 
          type='text'
          value={message}
          name='message'
          onChange={({ target }) => setMessage(target.value)}
        />
        <button className='sendMsgBtn' onClick={newMessageSent}>Send</button>
      </form>
      <button onClick={toggleUserList} className='toggleListBtn' title={listCss ? 'Close User List' : 'Open User List'}>
        <svg className='btnSVG' fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5.78168 19.25H13.2183C13.7828 19.25 14.227 18.7817 14.1145 18.2285C13.804 16.7012 12.7897 14 9.5 14C6.21031 14 5.19605 16.7012 4.88549 18.2285C4.773 18.7817 5.21718 19.25 5.78168 19.25Z"/>
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15.75 14C17.8288 14 18.6802 16.1479 19.0239 17.696C19.2095 18.532 18.5333 19.25 17.6769 19.25H16.75"/>
          <circle cx="9.5" cy="7.5" r="2.75" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/>
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M14.75 10.25C16.2688 10.25 17.25 9.01878 17.25 7.5C17.25 5.98122 16.2688 4.75 14.75 4.75"/>
        </svg>
      </button>
      <div className={listCss ? 'userListDivOpen' : 'userListDivClosed'}>
        <div className='userListHead'>User List</div>
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