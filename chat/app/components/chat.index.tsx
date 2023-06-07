'use client'
import ChatBody from "./chat.body"
import { OLdMessages as OLdMessagesType } from "../types/types"
import OLdMessages from "../hooks/OLdMessages"
import { useEffect, useState } from "react"
import OnlineUsers from "../hooks/OnlineUsers"

const Chat = () => {
    const oLdMessages = OLdMessages()
    const onLineUser = OnlineUsers()
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
        // console.log("window.innerWidth :", windowresize)
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
        setwindowresize(window.innerWidth)
        setisMounted(true)
    }, [])
    return <div className=" relative chat-box border border-orange-600 h-full max-h-[98vh] w-full max-w flex flex-col gap-4">
        <ChatBody />
    </div>
}

export default Chat