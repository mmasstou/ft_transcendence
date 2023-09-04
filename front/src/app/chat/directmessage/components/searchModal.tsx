import React, { useEffect, useState } from 'react'
import Modal from './Modal'
import SearchList from './searchList'
import Cookies from 'js-cookie';


const token = Cookies.get('token');
const currentId = Cookies.get('_id');

function SearchModal({ open, onClose }) {

	const [users, setUsers] = useState([]);
	const [currenUser, setCurrent] = useState(null);

	async function getUsers() {
		const res = await (await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
			method: 'GET',
			headers: {
			  'Content-Type': 'application/json',
			  Authorization: `Bearer ${token}`,
			},
		  })).json();
		const filtredUsers = res.filter((user: any) => user.id != currentId)
		setUsers(filtredUsers);
		setCurrent(res.filter((us: any) => us.id === currentId)[0]);
	}

	useEffect(() => {
		getUsers();
	}, [])


	return (
		<Modal open={open} onClose={onClose}>
		<section>
			<div className='text-white text-center my-[20px]'>Seach Users</div>
			<SearchList setConvCreation={onClose} users={users}/>
		</section>
		</Modal>
	)
}

export default SearchModal