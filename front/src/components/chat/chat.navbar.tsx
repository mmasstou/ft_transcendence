'use client'
import Link from "next/link"


// icons

import { FiUsers } from "react-icons/fi"
import { FaUsers } from "react-icons/fa"
import { HiChatBubbleLeftRight } from "react-icons/hi2"
import { MdOutlineKeyboardArrowLeft } from "react-icons/md"
import { TiContacts } from "react-icons/ti"
// components :
import ChatNavbarLink from "./chat.navbar.link"
import OnlineUsers from "@/hooks/RightSidebarHook"
import OLdMessages from "@/hooks/LeftSidebarHook"
import { BsLayoutSidebarInset, BsReverseLayoutSidebarInsetReverse, BsJournalMinus } from "react-icons/bs"
import { useEffect } from "react"
import { OLdMessages as OLdMessagesType } from "@/types/type.OLdMessages"
import ContactHook from "@/hooks/contactHook"


export default function ChatNavbar({ children }: { children: React.ReactNode; }) {
    return <div className="navbar.box border border-white max-h-[3vh] w-full flex items-center justify-between sm:px-2 py-1">
        <div className="navbar.content flex justify-between items-center w-full">
            {children}
        </div>
    </div>
}

