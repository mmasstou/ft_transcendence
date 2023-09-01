import React from 'react'
import { conversationData } from './privateConversation'
import Cookies from 'js-cookie';
import Image from "next/image";


const token = Cookies.get('token');
const currentId = Cookies.get('_id');

function ConversationList({ user, convList, setConvBody }: {convList: conversationData[]}) {


	return (
		<div className='flex flex-col h-full max-h-full border-r border-primary'>
			<div className='flex items-center gap-4 bg-[#3E504D] py-2 px-5'>
				<Image src={user.avatar} alt='userAvatar' width={55} height={55} className='rounded-[50%]'/>
				<h2 className='text-white'>Conversations :</h2>
			</div>
			<div className='py-2 px-3 max-h-full overflow-auto'>
				{convList && convList.length !== 0 ? convList.map((conv) => (
					<div className='flex justify-start items-center bg-[#3E504D] rounded-[30px] cursor-pointer py-[8px] px-[10px] mb-[5px] gap-4' key={conv.id} onClick={() => setConvBody(conv)}>
						<Image src={conv.users[0].id !== currentId ? conv.users[0].avatar : conv.users[1].avatar} alt={'avatar'} width={40} height={40} className='rounded-[50%]'/>
						<div className='flex justify-between items-center w-full'>
							<section className='flex flex-col'>
								<span className='text-white'>{conv.users[0].id !== currentId ? conv.users[0].login : conv.users[1].login}</span>
								<span className='text-[10px] text-primary'>{conv.content}</span>
							</section>
							{/* <span className={`${conv.users[0].status === 'online' ? "text-[#1EF0AE]" : "text-gray-900"}`}>.</span> */}
							<span className='text-xs text-[#1EF0AE]'>{conv.users[0].id !== currentId ? conv.users[0].status : conv.users[1].status}</span>
						</div>
					</div>
				)) : <div className='flex justify-center'>No Conversations</div>}
			</div>
		</div>
	)
}

export default ConversationList