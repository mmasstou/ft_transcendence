import React, { useEffect } from 'react'
import { messageData } from '../page'
import Cookies from 'js-cookie';

const currentId = Cookies.get('_id');

function ConversationMsg({ msgs }: {msgs: any[]}) {
	

	return (
		<div className='h-full p-4'>
			<section className=' flex flex-col gap-2 text-white h-full w-full border bg-[#243230] overflow-auto rounded-[10px] p-5'>
				{msgs && msgs.length ? msgs.map((msg) => (
					<div className={`${msg.senderId === currentId ? "self-end" : "self-start"} max-h-full bg-primary p-4 rounded-[10px] overflow-auto`} key={msg.id}>
						<section className='max-w-[320px] break-words'>{msg.content}</section>
					</div>
				))
				: <></>}
			</section>
		</div>
	)
}

export default ConversationMsg