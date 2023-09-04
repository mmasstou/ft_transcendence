import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie';
import Image from "next/image";
import Link from 'next/link';
import { conversationData } from '../page';


const token = Cookies.get('token');
const currentId = Cookies.get('_id');

function ConversationList({ user }) {

	const [convList, setConvList] = useState<conversationData[] | null>(null);

	async function getAllConversations() {
		const res = await (await fetch(`${process.env.NEXT_PUBLIC_API_URL}/conversations`, {
			method: 'GET',
			headers: {
			  'Content-Type': 'application/json',
			  Authorization: `Bearer ${token}`,
			},
		  })).json();
		  setConvList(res);
		  console.log(res);
		//   setConvList([...res, ...res, ...res, ...res, ...res, ...res]);
	}

	useEffect(() => {
		getAllConversations();
	}, [])

	return (
		<div className='flex flex-col h-full max-h-full overflow-y-auto border-r border-primary'>
			<div className='bg-[#243230]'>
				<div className='flex items-center gap-4 border-b border-primary py-2 px-5'>
					<Image src={user.avatar} alt='userAvatar' width={55} height={55} className='rounded-[50%]'/>
					<h2 className='text-white'>Conversations :</h2>
				</div>
			</div>
			<div className='py-2 px-3 max-h-full overflow-auto'>
				{convList && convList.length !== 0 ? convList.map((conv) => (
					<Link className='flex justify-start items-center bg-primary rounded-[30px] cursor-pointer py-[8px] px-[10px] mb-[5px] gap-4' href={`/chat/directmessage/${conv.id}`}>
						<Image src={conv.users[0].id !== currentId ? conv.users[0].avatar : conv.users[1].avatar} alt={'avatar'} width={40} height={40} className='rounded-[50%]'/>
						<div className='flex justify-between items-center w-full'>
							<section className='flex flex-col'>
								<span className='text-white'>{conv.users[0].id !== currentId ? conv.users[0].login : conv.users[1].login}</span>
								<span className='text-[10px] text-[#3E504D]'>{conv.content}</span>
							</section>
							{/* <span className={`${conv.users[0].status === 'online' ? "text-[#1EF0AE]" : "text-gray-900"}`}>.</span> */}
							<span className='text-xs text-[#1EF0AE]'>{conv.users[0].id !== currentId ? conv.users[0].status : conv.users[1].status}</span>
						</div>
					</Link>
				)) : <div className='flex justify-center'>No Conversations</div>}
			</div>
		</div>
	)
}

export default ConversationList