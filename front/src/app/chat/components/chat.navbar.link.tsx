'use client'

import Link from "next/link"
import React from "react"
import { IconType } from "react-icons"



interface chatNavbarLinkProps {
    to: string,
    icon?: IconType,
    label: string,
    active?: boolean
}
const ChatNavbarLink: React.FC<chatNavbarLinkProps> = ({ to, icon: Icon, label, active }) => {
    return <Link className={`items-center justify-center ${Icon && 'flex flex-row gap-1'} ${active ? 'text-[#1EF0AE]' : 'text-white '}`} href={to}>
        {Icon && <Icon size={24} />}
        <h3 className=" hidden sm:block">{label}</h3>
        </Link>
}

export default ChatNavbarLink