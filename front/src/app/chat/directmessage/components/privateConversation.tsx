import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react'
import Button from '../../components/Button';
import { AiFillCloseCircle } from 'react-icons/ai';
import SearchList from './searchList';


const token = Cookies.get('token');
const currentId = Cookies.get('_id');

function PrivateConversation({ isOpen, createConversation, setConvCreation }: {isOpen: boolean, createConversation: boolean, setConvCreation: any}) {

	const [users, setUsers] = useState([]);
	const [convBody, setConvBody] = useState<string | null>(null);

	async function getUsers() {
		const res = await (await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
			method: 'GET',
			headers: {
			  'Content-Type': 'application/json',
			  Authorization: `Bearer ${token}`,
			},
		  })).json();
		const filtredUsers = res.filter((user) => user.id != currentId)
		setUsers(filtredUsers);
	}

	useEffect(() => {
		getUsers();
	}, [])

  return (
	<div className='flex h-full w-full'>
		{isOpen ? <div className=' bg-[#243230] h-full w-[350px] relative'>Conversation List</div> : <></>}
		<div className='flex justify-center'>
			<div className='z-0'>Conversation Body</div>
			{createConversation ?
			<div className='bg-[#243230] h-[250px] w-[250px] flex flex-col justify-center gap-1 z-10'>
				<Button
					icon={AiFillCloseCircle}
					outline
					onClick={() => setConvCreation(false)}
					/>
				<SearchList setConvCreation={setConvCreation} users={users}/>
			</div> : <></>}
		</div>
	</div>
  )
}

export default PrivateConversation;