'use client'
import { useSearchParams } from "next/navigation"
import OnlineUsers from "@/hooks/OnlineUsers"
import { useEffect, useState } from "react"
import OLdMessages from "@/hooks/OLdMessages"
import { messagesType } from "@/types/types"
import Message from "./chat.message"
import Cookies from "js-cookie"
import { Socket, io } from 'socket.io-client';

interface MessagesProps {
    roomid: string
}

const Messages: React.FC<MessagesProps> = ({ roomid }) => {
    const onLineUser = OnlineUsers()
    const oLdMessages = OLdMessages()

    const params = useSearchParams()
    const [isMounted, setisMounted] = useState(false)
    const [_messages, setmessages]: any = useState([])
    const [socket, setSocket] = useState<Socket | null>(null);

    let currentQuery: string | null = ''
    if (params) {
        currentQuery = params?.get('room')
    }
    currentQuery && console.log("currentQuery :", currentQuery)
    // useEffect(() => {
    //     const { query } = router;

    //     // Access specific query parameters
    //     const id = query.message as string;
    // }, [router])

    useEffect(() => {
        setisMounted(true)
        const socket: Socket = io("http://localhost:80/chat");
        setSocket(socket);

        socket && socket.emit("message", 'hello from client side');
       
        

        return () => {
            socket && socket.disconnect();
        };

    }, [])

    const token = Cookies.get('token')
    useEffect(() => {
        (async function getOLdMessages() {
            const _OLd_rooms = await fetch(`http://127.0.0.1/rooms/messages/${roomid}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }).then(res => res.json())
            console.log("_OLd_rooms :", _OLd_rooms.messages)
            setmessages(_OLd_rooms.messages)
        })();

    }, [roomid, token])

    if (!isMounted)
        return null

    console.log("_messages :", _messages)
    socket && console.log("Socket :", socket.id)
    return <div className={`relative flex flex-col border-2 w-full m-auto   h-full `}>
        <div className=" relative flex flex-col gap-2 p-2 md:p-5 md:pb-0 m-2 max-h-[81vh] md:max-h-[85vh] overflow-x-scroll">
            {_messages && _messages.length && _messages.map((item: messagesType, index: number) => (
                <Message key={index} content={item.content} id={item.id} senderId={item.senderId} roomsId={item.roomsId} created_at={item.created_at} updated_at={item.updated_at} />
            ))
            }
        </div>
        <div className="absolute bottom-3 md:bottom-1 sm:bottom-0 left-0 w-full ">
            <input className=" w-full h-[42px] text-white text-base  font-semibold px-2 outline bg-[#243230] border-transparent focus:border-transparent rounded" placeholder={`Message @'mmasstou'`} type="search" name="" id="" />
        </div>
    </div>
}
export default Messages