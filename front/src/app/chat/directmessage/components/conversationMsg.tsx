import React from 'react'

function ConversationMsg({ msgs }) {
	
	return (
		<div className='h-full p-4 '>
			<section className='text-white h-full bg-[#243230] rounded-[10px] p-5'>
				{msgs}
			</section>
		</div>
	)
}

export default ConversationMsg