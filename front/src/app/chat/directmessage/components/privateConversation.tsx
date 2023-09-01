import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react'
import ConversationList from './conversationList';
import FriendList from './friendList';
import SearchModal from './searchModal';
import ConversationBody from './conversationBody';



const token = Cookies.get('token');
const currentId = Cookies.get('_id');

export interface conversationData {
	id: string,
	content: string,
	createdAt: Date,
	updatedAt: Date,
	users: any[],
}

function PrivateConversation({ isOpen, openFriendList, setFriendList, openSeachList, setSeachOpening }: {isOpen: boolean}) {

	const [convBody, setConvBody] = useState<conversationData | null>(null);
	const [convList, setConvList] = useState<conversationData[] | null>(null);
	const [open, setOpen] = useState(false);
	const [currentUser, setCurrent] = useState(null);
	
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
		setCurrent(res.filter((us) => us.id === currentId)[0]);
	}

	async function getAllConversations() {
		const res = await (await fetch(`${process.env.NEXT_PUBLIC_API_URL}/conversations`, {
			method: 'GET',
			headers: {
			  'Content-Type': 'application/json',
			  Authorization: `Bearer ${token}`,
			},
		  })).json();
		  setConvList(res);
		//   setConvList([...res, ...res, ...res, ...res, ...res, ...res]);
	}

	useEffect(() => {
		getUsers();
		getAllConversations();
		console.log('-----ues', currentUser);
	}, [convBody])

  return (
	<div className='flex h-[95.5%] w-full border-[1px] border-[#243230]'>
		{isOpen ? <div className=' bg-[#243230] h-full w-[320px] min-w-[320px] max-w-[320px] relative'>
			<ConversationList user={currentUser} convList={convList} setConvBody={setConvBody} />
		</div> : <></>}
		<div className='flex justify-center min-w-2/3 w-full'>
			<ConversationBody convBody={convBody} />
		</div>
		{openFriendList ? <div className=' bg-[#243230] h-full w-[20%] min-w-[200px] max-w-[350px] '>
			<FriendList />
		</div> : <></> }
		<SearchModal open={openSeachList} setConversation={setConvBody} onClose={() => setSeachOpening(false)} users={users}/>
	</div>
  )
}

export default PrivateConversation;