import React, { useEffect, useState } from 'react'
import { conversationData } from './privateConversation'
import ConversationMsg from './conversationMsg'
import CustumBtn from './custumBtn';
import { VscSend } from 'react-icons/vsc';
import Cookies from 'js-cookie';
import Image from "next/image";
import { SlOptionsVertical } from 'react-icons/sl';
import { Socket, io } from 'socket.io-client';



const token = Cookies.get('token');
const currentId = Cookies.get('_id');

function ConversationBody({ convBody }: { convBody: conversationData | null}) {

	const [msgContent, setMsgContent] = useState<string>('');
	const [socket, setSocket] = useState<Socket | null>(null);
	

	const handleEnterClick = (e: any) => {
		if (e.key === 'Enter')
			console.log(`Message : ${msgContent}`);
	}

	const handleSendMsg = () => {
		console.log(`Message : ${msgContent}`);
		const obj = {convId: convBody?.id ,userId: currentId, msg: msgContent};
		socket?.emit('message', obj);
		setMsgContent('');
	}

	useEffect(() => {

		socket?.on('message', (data) => {
			console.log('Received message from server:', data);
		  });
		
		return 

	}, [convBody])

	useEffect(() => {
		const socket: Socket = io(`${process.env.NEXT_PUBLIC_SOCKET_URL}`);
		setSocket(socket);
		
		return () => {
			socket.disconnect();
		}
	}, [])

	return (
		<div className='w-full'>
			{convBody ? 
			<section className='flex flex-col justify-between content-between h-full'>
				<div className='text-[#1EF0AE] flex gap-8 items-center bg-[#243230] py-2 px-5'>
					<Image src={convBody.users[0].id !== currentId ? convBody.users[0].avatar : convBody.users[1].avatar} alt={'avatar'} width={55} height={55} className='rounded-[50%]'/>
					<section className='flex justify-between w-full'>
						<p>{convBody.users[0].id !== currentId ? convBody.users[0].login : convBody.users[1].login}</p>
						<CustumBtn icon={SlOptionsVertical} onClick={() => console.log("Option Modal ...")} size={15} />
					</section>
				</div>
				<ConversationMsg msgs={convBody.id}/>
				<div className='text-[#1EF0AE] flex gap-4 justify-center w-full py-2 bg-[#243230]'>
					<input type='text' placeholder='  Type a message' value={msgContent} onChange={(e) => setMsgContent(e.target.value)} onFocus={(e) => handleEnterClick(e)} className='max-h-[100px] h-[50px] overflow-auto w-[75%] py-2 px-5 bg-primary rounded-[25px] focus:border-[#1EF0AE] focus:outline-none text-sm'/>
					<section className='w-[50px] h-[50px] bg-primary flex justify-center items-center rounded-[50%]'>
						<CustumBtn icon={VscSend} onClick={() => handleSendMsg()} size={24}/>
					</section>
				</div>
			</section>
			:
			<div className="flex flex-col justify-center items-center h-full w-full">
        		<Image src="/no_conversations.svg" width={600} height={600} alt={""} />
        	</div>}
		</div>
	)
}

export default ConversationBody