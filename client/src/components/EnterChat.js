import React, {useState} from 'react'
import { v4 as uuIDv4 } from 'uuid';
import hostService from '../services/hostRoom'
import joinService from '../services/joinRoom'

const EnterChat = ({name, setName, setChatConnected, roomId, setRoomId, socket, setAdmin}) => 
{
	const [joinState, setJoinState] = useState(0)

	const [password, setPassword] = useState('')
	const [showPassword, setShowPassword] = useState(false)

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
		const token = await joinService.join(newCredObject)
		socket.emit('join room', {roomId: roomId, token: token, name: name, adminStatus: false})
		setAdmin(false)
		setChatConnected(true)
	}

	return(
		<div>
			<form>
				<input
					type='text'
					value={name}
					name='name'
					onChange={({target}) => setName(target.value)}
				/>
			</form>
			{joinState === 0 ?
				<div>
					<button onClick={() => setJoinState(1)}>Host</button>
					<button onClick={() => setJoinState(2)}>Join</button>
				</div>:
				<div></div>
			}
			{joinState === 1 ?
				<div>
					<form>
						password 
						<input
							type={showPassword? 'text' : 'password'}
							value={password}
							name='password'
							onChange={({target}) => setPassword(target.value)}
						/>
						<button onClick={(e) => {
							e.preventDefault()
							setShowPassword(!showPassword)
							}}>
							{showPassword? 'Hide' : 'Show'}
						</button>
						<br></br>
						<button onClick={HostNewRoom}>Host</button>
						<button onClick={() => setJoinState(0)}>Back</button>
					</form>
				</div>:
				<div></div>
			}
			{joinState === 2 ?
				<div>
					<form>
						RoomID
						<input
							type='text'
							size='40'
							value={roomId}
							name='roomId'
							onChange={({target}) => setRoomId(target.value)}
						/>
						<br></br>
						password 
						<input
							type={showPassword? 'text' : 'password'}
							value={password}
							name='password'
							onChange={({target}) => setPassword(target.value)}
						/>
						<button onClick={(e) => {
							e.preventDefault()
							setShowPassword(!showPassword)
							}}>
							{showPassword? 'Hide' : 'Show'}
						</button>
						<br></br>
						<button onClick={JoinNewRoom}>Join</button>
						<button onClick={() => setJoinState(0)}>Back</button>
					</form>
				</div>:
				<div></div>
			}
		</div>
	)
}

export default EnterChat