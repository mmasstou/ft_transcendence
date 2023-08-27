import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image';
import Cookies from 'js-cookie';
import Button from '../../components/Button';
import { CgProfile } from 'react-icons/cg';
import { BiMessageAdd } from 'react-icons/bi';
import { AiOutlineMessage } from 'react-icons/ai';


const token = Cookies.get('token');
const currentId = Cookies.get('_id');

function SearchList({ setConvCreation, users }) {

	const [list, setList] = useState([]);
	const [searchedLogin, setLogin] = useState<string>('');
	const inputRef = useRef(null);

	const clickUserProfile = (user) => {
		console.log(`Redirect to ${user.login} Profile`);
		setConvCreation(false);
	}

	const openConversation = (user) => {
		console.log(`Open Conversation between ${user.id} : ${currentId}`);
		setConvCreation(false);
	}

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
		{
			setList(users.filter((user) => {
				const partLogin = user.login.substring(0, searchedLogin.length);
				return (partLogin !== '' && partLogin === searchedLogin);
			}))
			// setList([...users, ...users, ...users, ...users, ...users, ...users]);
		}
		else
			setList([])
	}

	useEffect(() => {
		if (inputRef.current)
			inputRef.current.focus();
		formatList();
	}, [searchedLogin]);

  return (
	<div className='flex flex-col  h-[500px] w-[500px]'>
		<input type='text' placeholder='login' ref={inputRef} value={searchedLogin} onChange={(e) => {setLogin(e.target.value);}} 
			className='bg-[#3E504D] text-white rounded-lg py-[10px] px-[15px] border focus:border-[#1EF0AE] outline-none'/>
		<ul className='mt-[10px] max-h-[100%] overflow-auto'>
			{list.length ? list.map((user) => (
				<li key={user.id} className='mt-[2px] mb-[6px] text-white  flex justify-around p-[5px]'>
					<section className='flex items-center gap-10 p-2'>
						<Image src={user.avatar} alt='avatar' width={40} height={40} className='rounded-[50%]'/>
						<p>{user.login}</p>
					</section>
					<section className='flex'>
						<Button icon={AiOutlineMessage} outline small onClick={() => {openConversation(user)}}/>
						<Button icon={CgProfile} outline small onClick={() => {clickUserProfile(user)}}/>
					</section>
				</li>
			)) : searchedLogin.length ? <li className='m-[2px] text-[#1EF0AE] font-thin flex justify-around items-center p-[5px] rounded-lg'>No User</li> : <></>}
		</ul>
	</div>
  )
}

export default SearchList;