"use client"
import { BsJournalMinus, BsJournalPlus, BsLayoutSidebarInset, BsReverseLayoutSidebarInsetReverse } from "react-icons/bs"
import { FiUsers } from "react-icons/fi"
import { HiChatBubbleLeftRight } from "react-icons/hi2"

// hooks :
import ContactHook from "@/hooks/contactHook"
// typs :
import { OLdMessages as OLdMessagesType } from "@/types/type.OLdMessages"
import ChatNavbarLink from "../chat.navbar.link"
import { FaUsers } from "react-icons/fa"
import { useParams, usePathname, useSearchParams } from "next/navigation"
import RightSidebarHook from "@/hooks/RightSidebarHook"
import LeftSidebarHook from "@/hooks/LeftSidebarHook"
import ChatNavbar from "../chat.navbar"

// icons :
import { GrChannel } from "react-icons/gr"
import { TiContacts } from "react-icons/ti"
import { IoCreateOutline } from "react-icons/io5"
import ChanneLcreatemodaLHook from "@/hooks/channel.create.hook"
const ChanneLNavbar = () => {
    const rightSidebar = RightSidebarHook()
    const leftSidebar = LeftSidebarHook()
    const contacthook = ContactHook()
    const channeLcreatemodaLHook = ChanneLcreatemodaLHook()
    const router = usePathname();

    let InitOLdMessages: OLdMessagesType[] = [{ name: '', LastMessage: '', create_At: '', image: '' }]
    const data = [
        {
            id: '0db1da9c-1a55-4dee-9e99-1f0d36a4c7a3',
            login: 'mmasstou',
            status: 'ADMIN'
        }
    ]

    return <ChatNavbar>
        <div className="ChanneLNavbar text-white" >
            {leftSidebar.IsOpen
                ? <BsReverseLayoutSidebarInsetReverse onClick={() => {
                    // console.log('leftSidebar.onClose()') 
                    leftSidebar.onClose()
                }} className="flex" size={24} />
                : <BsLayoutSidebarInset onClick={() => {
                    // console.log("btn clicked !")
                    leftSidebar.onOpen(InitOLdMessages)
                    rightSidebar.IsOpen && rightSidebar.onClose()
                }} className="flex z-10" size={24} />
            }
        </div>
        <div className="flex flex-row justify-around gap-4">
            <ChatNavbarLink
                to="/chat/directmessage"
                label="direct Message"
                icon={HiChatBubbleLeftRight}
                active={router.includes('directmessage')}
            />
            <ChatNavbarLink
                to="/chat/channels"
                label="channeL"
                icon={FaUsers}
                active={router.includes('channels')}
            />
        </div>
        <div className=" text-white flex gap-1 ">
            {/* <IoCreateOutline className="cursor-pointer" onClick={() => {}} size={24} /> */}
            {/* <GrChannel className="cursor-pointer" onClick={() => {}} size={21} /> */}
            <BsJournalPlus className="cursor-pointer" onClick={() => channeLcreatemodaLHook.onOpen()} size={21} />
            <FiUsers className="cursor-pointer" onClick={() => {
                !rightSidebar.IsOpen ? rightSidebar.onOpen(data) : rightSidebar.onClose()
            }} size={24} />
            
        </div>
    </ChatNavbar>

}
export default ChanneLNavbar;