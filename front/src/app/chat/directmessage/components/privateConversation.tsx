import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react'
import ConversationList from './conversationList';
import FriendList from './friendList';
import SearchModal from './searchModal';



const token = Cookies.get('token');
const currentId = Cookies.get('_id');

function PrivateConversation({ isOpen, openFriendList, setFriendList }: {isOpen: boolean}) {

	const [convBody, setConvBody] = useState<string | null>(null);
	const [open, setOpen] = useState(false);
	const [createConversation, setConvCreation] = useState(false);
	const [users, setUsers] = useState([]);

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
	}, )

  return (
	<div className='flex h-full w-full'>
		{isOpen ? <div className=' bg-[#243230] h-full w-[20%] min-w-[200px] max-w-[350px] relative'>
			<ConversationList />
		</div> : <></>}
		<div className='flex justify-center min-w-2/3 w-full border-[1px] border-[#243230]'>
			<p className='text-white'>Conversation Body</p>
		</div>
		{openFriendList ? <div className=' bg-[#243230] h-full w-[20%] min-w-[200px] max-w-[350px] '>
			<FriendList />
		</div> : <></> }
		<SearchModal open={createConversation}  onClose={() => setConvCreation(false)} users={users}/>
	</div>
  )
}

export default PrivateConversation;