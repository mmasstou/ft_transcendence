import React, { useState } from 'react'
import { conversationData } from './privateConversation'
import ConversationMsg from './conversationMsg'
import CustumBtn from './custumBtn';
import { VscSend } from 'react-icons/vsc';
import Cookies from 'js-cookie';

const token = Cookies.get('token');
const currentId = Cookies.get('_id');

function ConversationBody({ convBody }: { convBody: conversationData | null}) {

	const [msgContent, setMsgContent] = useState<string>('');

	const handleEnterClick = (e) => {
		if (e.key === 'Enter')
			console.log(`Message : ${msgContent}`);
	}

	const handleSendMsg = () => {
		console.log(`Message : ${msgContent}`);
		setMsgContent('');
	}

	return (
		<div className='border w-full'>
			{convBody ? 
				<div className='flex flex-col'>
				<section>
					<div className='flex justify-between border p-5'>
						<p>{convBody.users[0].login}</p>
						<p>{convBody.users[1].login}</p>
					</div>
					<ConversationMsg msgs={convBody.content}/>
					<input type='text' placeholder='message' value={msgContent} onChange={(e) => setMsgContent(e.target.value)} onFocus={(e) => handleEnterClick(e)}/>
					<CustumBtn icon={VscSend} onClick={() => handleSendMsg()}/>
				</section>
				</div>
				:
				<section>No Content</section>}
		</div>
	)
}

export default ConversationBody