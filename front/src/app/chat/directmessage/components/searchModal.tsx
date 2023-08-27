import React, { useEffect } from 'react'
import Modal from './Modal'
import SearchList from './searchList'

function SearchModal({ open, onClose, users }) {

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