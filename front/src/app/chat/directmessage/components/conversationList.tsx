import React from 'react'
import Cookies from 'js-cookie';

const token = Cookies.get('token');

function ConversationList({ users, setConvCreation }) {

	async function getConversation (userLogin: string) {
		console.log(`fetch User ${userLogin} Conversation`)
		const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/conversations`,  {
			method: 'GET',
			headers: {
			  'Content-Type': 'application/json',
			  Authorization: `Bearer ${token}`,
			},
		  });
	}

  return (
	<ul>
		{users.map((user) => (
			<li key={user.id} className='text-white border-2 text-center p-[5px] cursor-pointer' onClick={() => {
				setConvCreation(false);
				getConversation(user.login);
			}}>{user.login}</li>
		))}
	</ul>
  )
}

export default ConversationList