import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image';
import Cookies from 'js-cookie';
import Button from '../../components/Button';
import { CgProfile } from 'react-icons/cg';
import { BiMessageAdd } from 'react-icons/bi';
import { AiOutlineMessage } from 'react-icons/ai';
import { RiPingPongFill, RiPingPongLine } from 'react-icons/ri';
import { TbPingPong } from 'react-icons/tb';
import CustumBtn from './custumBtn';


const token = Cookies.get('token');
const currentId = Cookies.get('_id');

function SearchList({ setConversation, setConvCreation, users }) {

	const [list, setList] = useState([]);
	const [searchedLogin, setLogin] = useState<string>('');
	const inputRef = useRef(null);
	const [windowSize, setWindowSize] = useState({
		width: window.innerWidth,
		height: window.innerHeight,
	  });
	const [iconSize, setIconSize] = useState(window.innerWidth <= 640 ? 18 : 22)
	
	useEffect(() => {
		const handleResize = () => {
			setWindowSize({
			width: window.innerWidth,
			height: window.innerHeight,
		});
		  
		if (windowSize.width <= 640)
			setIconSize(18);
		else
		  	setIconSize(22);

		};
	
		window.addEventListener('resize', handleResize);
	
		// Cleanup function to remove the event listener
		return () => {
		  window.removeEventListener('resize', handleResize);
		};
	}, [windowSize, iconSize]);

	function updateConvCreation() {
		setConvCreation(false);
		setLogin('');
	}

	const clickUserProfile = (user) => {
		console.log(`Redirect to ${user.login} Profile`);
		updateConvCreation();
	}

	async function openConversation (user) {
		console.log(`Open Conversation between ${user.id} : ${currentId}`);
		updateConvCreation();
		const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/conversations/single`,  {
			method: 'POST',
			headers: {
			  'Content-Type': 'application/json',
			  Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({usersId: [currentId, user.id]})
		});

		const res = await response.json();

		setConversation(res);

		console.log(res);
	}

	const invateToGame = (user) => {
		console.log(`Invite ${user.login} to the game`);
		updateConvCreation();
	}

	function formatList () {
		if (searchedLogin !== '')
		{
			setList(users.filter((user) => {
				const partLogin = user.login.substring(0, searchedLogin.length);
				return (partLogin !== '' && partLogin === searchedLogin);
			}))
			setList([...users, ...users, ...users, ...users]);
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
	<div className='flex flex-col  max-w-[500px] w-full max-h-[400px] h-[50%]'>
		<input type='text' placeholder='login' ref={inputRef} value={searchedLogin} onChange={(e) => {setLogin(e.target.value);}} 
			className='bg-[#3E504D] text-white rounded-lg py-[10px] px-[15px] border focus:border-[#1EF0AE] outline-none'/>
		<ul className='mt-[10px] max-h-full overflow-auto'>
			{list.length ? list.map((user) => (
				<li key={user.id} className='mt-[2px] mb-[6px] text-white  flex justify-around p-[5px]'>
					<section className='flex items-center gap-4 md:gap-10 p-2'>
						<Image src={user.avatar} alt='avatar' width={40} height={40} className='rounded-[50%]'/>
						<p>{user.login}</p>
					</section>
					<section className='flex gap-1 sm:gap-2 md:gap-4'>
						<CustumBtn icon={AiOutlineMessage} onClick={() => openConversation(user)} size={iconSize} />
						<CustumBtn icon={CgProfile} onClick={() => clickUserProfile(user)} size={iconSize} />
						<CustumBtn icon={TbPingPong} onClick={() => invateToGame(user)} size={iconSize} />
					</section>
				</li>
			)) : searchedLogin.length ? <li className='m-[2px] text-[#1EF0AE] font-thin flex justify-around items-center p-[5px] rounded-lg'>No User</li> : <></>}
		</ul>
	</div>
  )
}

export default SearchList;