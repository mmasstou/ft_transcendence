import React from 'react'
import UserCard from '../ui/user/UserCard';

const Friend = () => {
  return (
    <div className='bg-[#243230] rounded-md text-white max-h-[80vh]
            flex flex-col overflow-auto p-3 lg:p-5'>
              <UserCard username='Mehdi' addRequest />
              <UserCard username='Mehdi' online />
              <UserCard username='Mehdi' inGame />
              <UserCard username='Mehdi' />
    </div>
  )
}

export default Friend