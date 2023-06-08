import { Icon } from 'next/dist/lib/metadata/types/metadata-types';
import Link from 'next/link'
import React from 'react'
import { IconType } from 'react-icons';

interface Props {
    isActive?: boolean;
    icon: IconType;
    href: string;
}

const MenuItem : React.FC<Props> = ({isActive, icon: Icon, href}) => {
  return  <li className='md:py-5 lg:py-5 xl:py-5 2xl:py-5'>
        <Link href={href}>
            <div className= {`relative ${isActive ? 'text-secondary border-2 border-secondary rounded-lg p-[5px] ' : 'text-white'} `} >
                <Icon className={`w-[42px] h-[42px]  xl:w-[46px] xl:h-[46px] 2xl:w-[46px] 2xl:h-[46px]
                    
                `}/>
            </div>
        </Link>
    </li>
  
}

export default MenuItem
