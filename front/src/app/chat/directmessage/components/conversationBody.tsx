import React, { useEffect, useState } from 'react'
import { conversationData } from './privateConversation'
import ConversationMsg from './conversationMsg'
import CustumBtn from './custumBtn';
import { VscSend } from 'react-icons/vsc';
import Cookies from 'js-cookie';
import Image from "next/image";
import { SlOptionsVertical } from 'react-icons/sl';


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
				<div className='text-[#1EF0AE] flex gap-8 items-center bg-[#3E504D] py-2 px-5'>
					<Image src={convBody.users[0].id !== currentId ? convBody.users[0].avatar : convBody.users[1].avatar} alt={'avatar'} width={55} height={55} className='rounded-[50%]'/>
					<section className='flex justify-between w-full'>
						<p>{convBody.users[0].id !== currentId ? convBody.users[0].login : convBody.users[1].login}</p>
						<CustumBtn icon={SlOptionsVertical} onClick={() => console.log("Option Modal ...")} size={15} />
					</section>
				</div>
				<ConversationMsg msgs={convBody.content}/>
				<div className='text-[#1EF0AE] flex gap-4 justify-center w-full py-2 bg-[#3E504D]'>
					<input type='text' placeholder='  Type a message' value={msgContent} onChange={(e) => setMsgContent(e.target.value)} onFocus={(e) => handleEnterClick(e)} className='max-h-[100px] h-[50px] overflow-auto w-[75%] py-2 px-5 bg-primary rounded-[25px] focus:border-[#1EF0AE] focus:outline-none text-sm'/>
					<section className='w-[50px] h-[50px] bg-primary flex justify-center items-center rounded-[50%]'>
						<CustumBtn icon={VscSend} onClick={() => handleSendMsg()} size={24}/>
					</section>
				</div>
			</section>
			:
			<section>No Content</section>}
		</div>
	)
}

export default ConversationBody