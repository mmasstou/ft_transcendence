import React from 'react'

function PrivateConversation({ isOpen: openConvList }: {isOpen: boolean, openConvList: boolean}) {
  return (
	<div className='flex '>
		{openConvList ? <div className='text-white'>Conversation List</div> : <></>}
		<div>Conversation Body</div>
	</div>
  )
}

export default PrivateConversation