'use client'
import { ReactNode, useEffect, useState } from "react"

import Cookies from "js-cookie"
import OLdMessages from "@/hooks/LeftSidebarHook"
import OnlineUsers from "@/hooks/RightSidebarHook"
import LoginHook from "@/hooks/login"
import {OLdMessages as OLdMessagesType} from "@/types/types"
import ChatNavbar from "./chat.navbar"

interface ChatInter {
    children : ReactNode
}
const Chat : React.FC<ChatInter> = ({children}) => {
    const oLdMessages = OLdMessages()
    const onLineUser = OnlineUsers()
    const loginHook  = LoginHook()

    const [onLineUserStats, setonLineUserStats] = useState(false)
    const [windowresize, setwindowresize] = useState(0)
    const [isMounted, setisMounted] = useState(false)
    isMounted && window.addEventListener('resize', () => setwindowresize(window.innerWidth))
    useEffect(() => {
        let InitOLdMessages: OLdMessagesType[] = [
            {
                name: '',
                LastMessage: '',
                create_At: '',
                image: ''
            }
        ]
        // // console.log("window.innerWidth :", windowresize)
        if (windowresize >= 1158 && !oLdMessages.default && !oLdMessages.IsOpen) {
            oLdMessages.onOpen(InitOLdMessages)
            oLdMessages.setDefault(!oLdMessages.default)
        }
        if (windowresize <= 1020 && oLdMessages.IsOpen && onLineUser.IsOpen && !onLineUserStats) {
            onLineUser.onClose()
            setonLineUserStats(true)
        }
    }, [windowresize, oLdMessages, onLineUser, onLineUserStats])

    // useEffect(() => {
    //     setonLineUserStats(false)
    // }, [windowresize])

    useEffect(() => {

        //  if (windowresize <= 1158 && oLdMessages.IsOpen)
        //     oLdMessages.onClose()
        // const token = Cookies.get('token')
        (Cookies.get('token') !==  undefined  ) ? (loginHook.IsOpen && loginHook.onClose()) : loginHook.onOpen()
        setwindowresize(window.innerWidth)
        setisMounted(true)
    }, [])
    
    return <div className="Chat relative chat-box border border-orange-600 h-full max-h-[94rem] w-full flex flex-col gap-4">
        {children}
    </div>
}

export default Chat