import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react'
import Button from '../../components/Button';
import { AiFillCloseCircle } from 'react-icons/ai';
import SearchList from './searchList';
import ConversationList from './conversationList';
import FriendList from './friendList';


const token = Cookies.get('token');
const currentId = Cookies.get('_id');

function PrivateConversation({ isOpen, openFriendList, setFriendList }: {isOpen: boolean}) {

	const [convBody, setConvBody] = useState<string | null>(null);
	const [open, setOpen] = useState(false);

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
	</div>
  )
}

export default PrivateConversation;