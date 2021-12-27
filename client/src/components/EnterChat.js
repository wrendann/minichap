import React, {useState} from 'react'
import { v4 as uuIDv4 } from 'uuid';
import hostService from '../services/hostRoom'
import joinService from '../services/joinRoom'

import github from '../images/github.png'
import linkedin from '../images/linkedin.png'

const EnterChat = ({name, setName, setChatConnected, roomId, setRoomId, socket, setAdmin}) => 
{
	const [joinState, setJoinState] = useState(0)
	const [password, setPassword] = useState('')
	const [errorMessage, setErrorMessage] = useState('')

	const HostNewRoom = async (e) =>
	{
		e.preventDefault();
		const rID = uuIDv4()
		setRoomId(rID)
		const credObject = {roomId: rID, password: password}
		await hostService.host(credObject)
		const newCredObject = {name: name, roomId: rID, password: password}
		const token = await joinService.join(newCredObject)
		
		socket.emit('join room', {roomId: rID, token: token, name: name, adminStatus: true})
		setAdmin(true)
		setChatConnected(true)
	}

	const JoinNewRoom = async (e) =>
	{
		e.preventDefault();
		const newCredObject = {name: name, roomId: roomId, password: password}
		try
		{
			const token = await joinService.join(newCredObject)
			socket.emit('join room', {roomId: roomId, token: token, name: name, adminStatus: false})
			setAdmin(false)
			setChatConnected(true)
		}
		catch(e)
		{
			setErrorMessage('username or password incorrect. please try again.')
			setTimeout(() => {setErrorMessage('')}, 3000)
			return
		}
	}

	return(
		<div>
			<div className='minichapSub'>an extemely minimalist chat app</div>
			<form className='userNameForm'>
				<input
					className='userNameBox'
					type='text'
					value={name}
					name='name'
					onChange={({target}) => setName(target.value)}
					placeholder='username'
				/>
			</form>
			{!name? <div className='userNameWarning'>username field should not be left empty</div>: null}
			{joinState === 0 ?
				<div className='hostJoinDiv'>
					<button className='hostBtn' onClick={() => setJoinState(1)}>Host</button>
					<button className='joinBtn' onClick={() => setJoinState(2)}>Join</button>
				</div>:
				<div></div>
			}
			{joinState === 1 ?
				<div>
					<form className='hostForm'>  
						<input
							className='hostPassword'
							type='password'
							value={password}
							name='password'
							onChange={({target}) => setPassword(target.value)}
							placeholder='password'
						/>
						<br></br>
						<button className='hostRoomBtn' onClick={HostNewRoom}
							disabled={name? false: true}
						>Host</button>
						<button className='backHostBtn' onClick={() => setJoinState(0)}>Back</button>
					</form>
				</div>:
				<div></div>
			}
			{joinState === 2 ?
				<div>
					<form className='joinForm'>
						<input
							className='joinRoomId'
							type='text'
							size='40'
							value={roomId}
							name='roomId'
							onChange={({target}) => setRoomId(target.value)}
							placeholder='roomID'
						/>
						<br></br> 
						<input
							className='joinPassword'
							type='password'
							value={password}
							name='password'
							onChange={({target}) => setPassword(target.value)}
							placeholder='password'
						/>
						{errorMessage === '' ? null : <div className='joinRoomError'>{errorMessage}</div>}
						<br></br>
						<button className='joinRoomBtn' onClick={JoinNewRoom}
							disabled={name? false: true}
						>Join</button>
						<button className='backJoinBtn' onClick={() => setJoinState(0)}>Back</button>
					</form>
				</div>:
				<div></div>
			}

			<div className='endCredits'>
				created by Mohammed Ziyad K
				<a href='https://github.com/wrendann/'><img src={github} alt='Github' width='20px' height='20px' style={{marginLeft: 20}}/></a>
				<a href='https://www.linkedin.com/in/mohammed-ziyad-5058b820b/'><img src={linkedin} alt='LinkedIn' width='20px' height='20px' style={{marginLeft: 20}}/></a>
			</div>
		</div>
	)
}

export default EnterChat