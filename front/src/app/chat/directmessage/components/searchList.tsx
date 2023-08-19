import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image';
import Cookies from 'js-cookie';

const token = Cookies.get('token');

function SearchList({ setConvCreation, users }) {

	const [list, setList] = useState([]);
	const [searchedLogin, setLogin] = useState<string>('');
	const inputRef = useRef(null);

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

	function formatList () {
		if (searchedLogin !== '')
			setList(users.filter((user) => {
				const partLogin = user.login.substring(0, searchedLogin.length);
				return (partLogin !== '' && partLogin === searchedLogin);
			}))
		else
			setList([])
	}

	useEffect(() => {
		if (inputRef.current)
			inputRef.current.focus()
		formatList();
	}, [searchedLogin]);

  return (
	<div className='flex flex-col justify-center'>
		<input type='text' placeholder='login' ref={inputRef} value={searchedLogin} onChange={(e) => {setLogin(e.target.value);}}/>
		<ul className='mt-[5px]'>
			{list.map((user) => (
				<li key={user.id} className='m-[2px] text-white border-2 flex justify-around items-center p-[5px] cursor-pointer' 
				onClick={() => {
					console.log(`Fetch Conversation Data of ${user.login} and Current User`);
					setConvCreation(false)
				}}>
					<Image src={user.avatar} alt='avatar' width={40} height={40} className='rounded-[50%]'/>
					<p>{user.login}</p>
				</li>
			))}
		</ul>
	</div>
  )
}

export default SearchList;