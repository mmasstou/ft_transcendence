import React, { useEffect, useState } from 'react'
import { conversationData } from './privateConversation'
import ConversationMsg from './conversationMsg'
import CustumBtn from './custumBtn';
import { VscSend } from 'react-icons/vsc';
import Cookies from 'js-cookie';
import Image from "next/image";


const token = Cookies.get('token');
const currentId = Cookies.get('_id');

function ConversationBody({ convBody }: { convBody: conversationData | null}) {

	const [msgContent, setMsgContent] = useState<string>('');
	let user;

	const handleEnterClick = (e) => {
		if (e.key === 'Enter')
			console.log(`Message : ${msgContent}`);
	}

	const handleSendMsg = () => {
		console.log(`Message : ${msgContent}`);
		setMsgContent('');
	}

	useEffect(() => {

	}, [convBody])

	return (
		<div className='w-full'>
			{convBody ? 
			<section className='flex flex-col justify-between content-between h-full'>
				<div className='text-[#1EF0AE] flex gap-10 items-center bg-[#3E504D] py-2 px-5'>
					<Image src={convBody.users[0].id !== currentId ? convBody.users[0].avatar : convBody.users[1].avatar} alt={'avatar'} width={55} height={55} className='rounded-[50%]'/>
					<p>{convBody.users[0].id !== currentId ? convBody.users[0].login : convBody.users[1].login}</p>
				</div>
				<ConversationMsg msgs={convBody.content}/>
				<div className='text-white self-center flex justify-evenly w-full py-2'>
					<input type='text' placeholder='message' value={msgContent} onChange={(e) => setMsgContent(e.target.value)} onFocus={(e) => handleEnterClick(e)} className='w-[75%] py-2 px-5 bg-[#3E504D] rounded-[25px] focus:border-[#1EF0AE] focus:outline-none'/>
					<CustumBtn icon={VscSend} onClick={() => handleSendMsg()} size={24}/>
				</div>
			</section>
			:
			<section>No Content</section>}
		</div>
	)
}

export default ConversationBody