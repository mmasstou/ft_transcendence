import React from 'react'
import MyAvatar from './MyAvatar'

const HistoriqueCard = () => {
  return (
    <div className='bg-[#3E504D]  w-full h-[47px] flex justify-between mx-2 my-2 rounded-md' >
        <div className='flex flex-col overflow-hidden items-center justify-center'>
            <div className='w-[28px] h-[28px] mx-2'>
                <MyAvatar/>
            </div>
            <span className='text-[10px] font-semibold text-white mx-2' >azouhadou</span>
        </div>

        <div className='flex items-center cursor-default'>
          <div className={`bg-transparen text-secondary text-[16px] w-[96px] h-[28px] md:text-[16px] sm:w-[80px]
                px-2 border rounded-full border-secondary flex justify-center items-center gap-2`}>
                <span className='font-semibold'>7</span> <span className='font-semibold'>VS</span> <span className='font-semibold'>4</span>
          </div>
        </div>

        <div className='flex flex-col overflow-hidden items-center justify-center'>
            <div className='w-[28px] h-[28px] mx-2'>
                <MyAvatar/>
            </div>
            <span className='text-[10px] font-semibold text-white mx-2' >azouhadou</span>
        </div>
    </div>
  )
}

export default HistoriqueCard