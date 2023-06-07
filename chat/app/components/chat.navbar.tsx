'use client'
import Link from "next/link"


// icons

import { FiUsers } from "react-icons/fi"
import { FaUsers } from "react-icons/fa"
import { HiChatBubbleLeftRight } from "react-icons/hi2"
import { MdOutlineKeyboardArrowLeft } from "react-icons/md"
// components :
import ChatNavbarLink from "./chat.navbar.link"
import OnlineUsers from "../hooks/OnlineUsers"
import OLdMessages from "../hooks/OLdMessages"
import { BsLayoutSidebarInset, BsReverseLayoutSidebarInsetReverse } from "react-icons/bs"
import { useEffect } from "react"
import { OLdMessages as OLdMessagesType } from "../types/type.OLdMessages"

const ChatNavbar = () => {
    const onLineUser = OnlineUsers()
    const oLdMessages = OLdMessages()
    let InitOLdMessages: OLdMessagesType[] = [{name: '', LastMessage: '', create_At: '', image: ''}]
    const data = [
        {
            id: '0db1da9c-1a55-4dee-9e99-1f0d36a4c7a3',
            login: 'mmasstou',
            status: 'ADMIN'
        }
    ]
  

    return <div className="navbar.box border border-white max-h-[3vh] w-full flex items-center justify-between sm:px-2 py-1">
        <div className="navbar.content flex justify-between w-full">
            <div  >
                {oLdMessages.IsOpen
                    ? <BsReverseLayoutSidebarInsetReverse onClick={()=>{
                        console.log('oLdMessages.onClose()')
                        oLdMessages.onClose()
                    }} className="flex" size={24} />
                    : <BsLayoutSidebarInset onClick={() => {
                        console.log("btn clicked !")
                        oLdMessages.onOpen(InitOLdMessages)
                        onLineUser.IsOpen && onLineUser.onClose()
                    }} className="flex z-10" size={24} />
                }
            </div>
            <div className="flex flex-row justify-around gap-4">
                <ChatNavbarLink to="/" label="direct Message" icon={HiChatBubbleLeftRight} active />
                <ChatNavbarLink to="/channel" label="channeL" icon={FaUsers} />
            </div>
            <div onClick={() => {
                !onLineUser.IsOpen ? onLineUser.onOpen(data) : onLineUser.onClose()
            }} className=" text-white cursor-pointer"><FiUsers size={24} /></div>
        </div>

    </div>
}

export default ChatNavbar