import { Icon } from 'next/dist/lib/metadata/types/metadata-types';
import Link from 'next/link'
import React from 'react'
import { IconType } from 'react-icons';
import { CgProfile } from 'react-icons/cg'

interface Props {
    isActive?: boolean;
    icon: IconType;
    href: string;
}

const MenuItem : React.FC<Props> = ({isActive, icon: Icon, href}) => {
  return  <li>
        <Link href={href}>
            <Icon className={`w-[42px] h-[42px] 
            ${isActive ? 'text-secondary  ' : 'text-white'}
                
            `}/>
        </Link>
    </li>
  
}

export default MenuItem
