'use client'

import { useEffect, useState } from "react"
import OnlineUsers from "@/hooks/RightSidebarHook"
import DirectOLdMessages from "./chat.directmessages.oldmessage"
import Messages from "./chat.messages"
import NoMessageToShow from "./chat.nomessage"
import OLdMessages from "@/hooks/LeftSidebarHook"
import { useSearchParams } from "next/navigation"
import qs from 'query-string'
import { Message as MessageType } from "@/types/types"
import { Socket, io } from "socket.io-client"
import Cookies from "js-cookie"

const ChatMain = () => {
    const [messages, setmessages]: MessageType[] | any[] = useState([])
    const [isMounted, setisMounted] = useState(false)
    const [_w, setW] = useState(0)
    const onLineUser = OnlineUsers()
    const oLdMessages = OLdMessages()
    const params = useSearchParams()
    const token = Cookies.get('token')
    const [socket, setSocket] = useState<Socket | null>(null);

    let currentQuery: string | null = ''
    if (params) {
        currentQuery = params?.get('room')
    }

    isMounted && window.addEventListener('resize', () => setW(window.innerWidth))
    // console.log("currentQuery :", currentQuery)
    // useEffect(() => {
    //     const { query } = router;

    //     // Access specific query parameters
    //     const id = query.message as string;
    // }, [router])
    useEffect(() => {
        const socket: Socket = io("http://localhost:80/chat", {
            auth: {
                token: `${token}`
            }
        });
        setSocket(socket);

        // const messageSocket: messageSocket = {
        //     roomId: roomid,
        //     messageContent: message
        // }
        // // if (message) {

        // socket && socket.emit("sendMessage", messageSocket, () => setmessages(""));



        return () => {
            socket && socket.disconnect();
        };
    }, [])

    useEffect(() => {
        setisMounted(true)
    }, [])

    if (!isMounted)
        return null

    return <div className={`border border-orange-300 h-full ${onLineUser.IsOpen ? 'hidden' : ''} sm:flex`}>
        {socket && <DirectOLdMessages socket={socket} />}
        {(currentQuery && socket) && <Messages roomid={currentQuery} socket={socket} />}
    </div>
}

export default ChatMain