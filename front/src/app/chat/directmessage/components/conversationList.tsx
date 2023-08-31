import React from 'react'
import { conversationData } from './privateConversation'
import Cookies from 'js-cookie';
import Image from "next/image";


const token = Cookies.get('token');
const currentId = Cookies.get('_id');

function ConversationList({ convList, setConvBody }: {convList: conversationData[]}) {




	return (
		<div className='flex flex-col p-5'>
			<h2 className='text-[#1EF0AE]'>Conversations :</h2>
			<div className='py-2 px-5 border'>
				{convList && convList.length !== 0 ? convList.map((conv) => (
					<div className='flex justify-evenly items-center border cursor-pointer' key={conv.id} onClick={() => setConvBody(conv)}>
						<Image src={conv.users[0].id !== currentId ? conv.users[0].avatar : conv.users[1].avatar} alt={'avatar'} width={40} height={40} className='rounded-[50%]'/>
						<div>
							<span>{conv.users[0].id !== currentId ? conv.users[0].login : conv.users[1].login}</span>
						</div>
					</div>
				)) : <div>No Conversations</div>}
			</div>
		</div>
	)
}

export default ConversationList