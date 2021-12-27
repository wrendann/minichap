import React from 'react'

const User = ({socket, user, admin}) => {

    const makeAdmin = (e) =>
	{
		e.preventDefault()
        socket.emit('make admin', {socketId: user.socketId})
	}

    const kickUser = (e) =>
    {
        e.preventDefault()
        socket.emit('kick user', {socketId: user.socketId})
    }

    return (<div className='userDiv' key={user.socketId}>{user.name} {(user.admin) ? <b>- Admin </b> : null}
        {(admin && user.socketId !== socket.id && !user.admin) ? <button onClick={makeAdmin} className='makeAdminBtn'>Make Admin</button> : null}
        {(admin && user.socketId !== socket.id && !user.admin) ? <br></br> : null}
        {(admin && user.socketId !== socket.id && !user.admin) ? <button onClick={kickUser} className='kickUserBtn'>Kick User</button> : null}
        </div>)
}

export default User