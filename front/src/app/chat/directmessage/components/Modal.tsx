import React from 'react'
import { AiFillCloseCircle } from 'react-icons/ai';

function modal({ open, onClose, children }) {
  return (
    <div onClick={onClose} className={`fixed inset-0 flex justify-center items-center transition-colors ${open ? "visible bg-black/20" : "invisible"}`} >
        <div onClick={e => e.stopPropagation()} className={`bg-[#243230] rounded-xl shadow p-6 transition-all ${open ? "scale-100 opacity-100" : "scale-125 opacity-0"}`}>
            <button onClick={onClose} className='absolute top-2 right-2 p-1 rounded-lg text-white'>
                <AiFillCloseCircle />
            </button>
            {children}
        </div>
    </div>
  )
}

export default modal