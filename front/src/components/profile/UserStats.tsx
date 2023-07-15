import React, { FC } from 'react'

interface Props {
    title: string,
    total: number,
    line: boolean,
}

const Stat: FC<Props> = (info): JSX.Element => {
  return (
    <div className='flex gap-[1.375rem]'>
            <div className='flex flex-col items-center'>
                <h3 className='text-[#E0E0E0] font-normal text-[1em]'>{info.title}</h3>
                <h2 className='font-bold text-[1em]'>{info.total}</h2>
            </div>
            { info.line &&
                <div className='border-r-[1px] h-[51px] left-4'></div>
            }
    </div>
  )
}


export const UserStats = () => {
  return (
    <div className='text-white flex items-center justify-evenly py-8'>
        <Stat title="Total game" total={125} line={true} />
        <Stat title='Wins' total={75} line={true} />
        <Stat title='Loses' total={50} line={true} />
        <Stat title='Rank' total={15} line={false} />
    </div>
  )
}
