import React, { useEffect } from 'react'
import { AiFillCloseCircle } from 'react-icons/ai';

function modal({ open, onClose, children }) {

	useEffect(() => {
		const handleEscBtn = (ev) => {
			if (ev.key === 'Escape')
				onClose();
		}

		if (open) {
			window.addEventListener('keydown', handleEscBtn);
		}
	
		return () => {
			window.removeEventListener('keydown', handleEscBtn);
		};
	})

  return (
    <div onClick={onClose} className={`fixed inset-0 flex justify-center items-center transition-colors ${open ? "visible bg-black/20" : "invisible"}`} >
        <div onClick={e => e.stopPropagation()} className={`bg-[#243230] rounded-xl shadow p-6 transition-all ${open ? "scale-100 opacity-100" : "scale-125 opacity-0"} max-w-[500px] w-[80%] max-h-[500px] min-h-[200px] h-[70%]`}>
            <button onClick={onClose} className='absolute top-2 right-2 p-3 rounded-lg text-white'>
                <AiFillCloseCircle />
            </button>
            {children}
        </div>
    </div>
  )
}

export default modal