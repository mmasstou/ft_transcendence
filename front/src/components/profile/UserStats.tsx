import React, { FC } from 'react'

interface Props {
    title: string,
    total: number,
    line: boolean,
    style: string,
}

export const Statis: FC<Props> = (info): JSX.Element => {
  return (
    <>
      <div className='flex flex-col items-center'>
                  <h3 className={`text-[#E0E0E0] font-normal ${info.style}`}>{info.title}</h3>
                  <h2 className={`font-bold ${info.style}`}>{info.total}</h2>
      </div>
      { info.line && <div className='border-r-[1px] h-[51px] left-4 border-[#3D4042]'></div>}
    </>
  )
}


export const UserStats = () => {
  return (
    <div className='text-white flex items-center justify-evenly py-8 overflow-hidden'>
        <Statis title="Total game" total={122} line={true} style="text-[1em]" />
        <Statis title='Wins' total={75} line={true} style="text-[1em]" />
        <Statis title='Loses' total={464} line={true} style="text-[1em]" />
        <Statis title='Rank' total={14} line={false} style="text-[1em]" />
    </div>
  )
}
