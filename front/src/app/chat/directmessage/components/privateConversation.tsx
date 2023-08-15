import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react'
import Button from '../../components/Button';
import { AiFillCloseCircle } from 'react-icons/ai';

function PrivateConversation({ isOpen, createConversation, setConvCreation }: {isOpen: boolean, createConversation: boolean, setConvCreation: any}) {

	const [users, setUsers] = useState([]);

	async function getUsers() {
		const res = await (await fetch('http://localhost:80/api/users')).json();
		const filtredUsers = res.filter((user) => user.login != 'mbenbajj')
		setUsers(filtredUsers);
	}

	useEffect(() => {
		getUsers();
	}, [])

	// const jwtToken = Cookies.get('token');
	// console.log("toekn of chat", jwtToken);

  return (
	<div className='flex h-full w-full'>
		{isOpen ? <div className=' bg-[#243230] h-full w-[350px] relative'>Conversation List</div> : <></>}
		<div className=''>Conversation Body</div>
		{createConversation ? 
		<div className='bg-[#243230] h-[250px] w-[250px] flex flex-col justify-center gap-1'>
			<Button 
				icon={AiFillCloseCircle}
				outline
				onClick={() => setConvCreation(false)}
				/>
			<ul>
				{users.map((user) => (
						<li key={user.login} className='text-white border-2 text-center p-[5px]'>{user.login}</li>
				))}
			</ul>

		</div> : <></>}
	</div>
  )
}

export default PrivateConversation