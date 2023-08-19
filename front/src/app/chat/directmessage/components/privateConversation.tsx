import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react'
import Button from '../../components/Button';
import { AiFillCloseCircle } from 'react-icons/ai';
import SearchList from './searchList';
import ConversationList from './conversationList';
import FriendList from './friendList';


const token = Cookies.get('token');
const currentId = Cookies.get('_id');

function PrivateConversation({ isOpen, openFriendList, createConversation, setFriendList, setConvCreation }: {isOpen: boolean, createConversation: boolean, setConvCreation: any}) {

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
		{isOpen ? <div className=' bg-[#243230] h-full w-[15%] min-w-[200px] max-w-[350px] relative'>
			<ConversationList />
		</div> : <></>}
		<div className='flex justify-center min-w-2/3 w-full border-[1px] border-[#243230]'>
			<div className=''>Conversation Body</div>
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
		{openFriendList ? <div className=' bg-[#243230] h-full w-[15%] min-w-[200px] max-w-[350px] '>
			<FriendList />
		</div> : <></> }
	</div>
  )
}

export default PrivateConversation;