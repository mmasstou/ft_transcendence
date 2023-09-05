import React, { useEffect } from 'react'
import { messageData } from '../page'

function ConversationMsg({ msgs }: {msgs: any[]}) {
	

	return (
		<div className='h-full p-4 '>
			<section className='text-white h-full bg-[#243230] overflow-auto rounded-[10px] p-5'>
				{msgs && msgs.length ? msgs.map((msg) => (
					<div>{msg.content}</div>
				))
				: <></>}
			</section>
		</div>
	)
}

export default ConversationMsg