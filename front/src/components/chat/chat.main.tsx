'use client'

import { useEffect, useState } from "react"
import OnlineUsers from "@/hooks/OnlineUsers"
import DirectOLdMessages from "./chat.directmessages.oldmessage"
import Messages from "./chat.messages"
import NoMessageToShow from "./chat.nomessage"
import OLdMessages from "@/hooks/OLdMessages"
import { useSearchParams } from "next/navigation"
import qs from 'query-string'
import {Message as MessageType} from "@/types/types"

const ChatMain = () => {
    const [messages, setmessages] : MessageType[] | any[] = useState([])
    const [isMounted, setisMounted] = useState(false)
    const [_w, setW] = useState(0)
    const onLineUser = OnlineUsers()
    const oLdMessages = OLdMessages()
    const params = useSearchParams()
    let currentQuery: string | null = ''
    if (params) {
        currentQuery = params?.get('room')
    }

    isMounted && window.addEventListener('resize', () => setW(window.innerWidth))
    console.log("currentQuery :", currentQuery)
    // useEffect(() => {
    //     const { query } = router;

    //     // Access specific query parameters
    //     const id = query.message as string;
    // }, [router])
    useEffect(() => {
       
    }, [currentQuery])

    useEffect(() => {
        setisMounted(true)
    }, [])

    if (!isMounted)
        return null

    return <div className={`border border-orange-300 h-full ${onLineUser.IsOpen ? 'hidden' : ''} sm:flex`}>
        <DirectOLdMessages />
        {currentQuery  && <Messages roomid={currentQuery} />}
    </div>
}

export default ChatMain