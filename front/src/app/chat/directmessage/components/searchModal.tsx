import React from 'react'
import Modal from './Modal'
import SearchList from './searchList'

function SearchModal({ open, onClose, users }) {
  return (
    <Modal open={open} onClose={onClose}>
        <div>Search Modal</div>
		<SearchList setConvCreation={onClose} users={users}/>

    </Modal>
  )
}

export default SearchModal