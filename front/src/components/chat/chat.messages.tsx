'use client'
import { useSearchParams } from "next/navigation"
import OnlineUsers from "@/hooks/OnlineUsers"
import { useEffect, useRef, useState } from "react"
import OLdMessages from "@/hooks/OLdMessages"
import { messagesType } from "@/types/types"
import Message from "./chat.message"
import Cookies from "js-cookie"
import { Socket, io } from 'socket.io-client';
import { messageSocket } from "@/types/types"
interface MessagesProps {
    roomid: string;
    socket: Socket
}

const Messages: React.FC<MessagesProps> = ({ roomid, socket}) => {
    const onLineUser = OnlineUsers()
    const oLdMessages = OLdMessages()

    const params = useSearchParams()
    const [isMounted, setisMounted] = useState(false)
    const [userId, setuserId] = useState("")
    const [input, setInputValue] = useState("")
    const [_messages, setmessages]: any = useState([])
    const [message, setMessage] = useState("");

    const token = Cookies.get('token')
    const scrollRef = useRef<HTMLDivElement>(null);

    let currentQuery: string | null = ''
    if (params) {
        currentQuery = params?.get('room')
    }
    // currentQuery &&  console.log("currentQuery :", currentQuery)
    // useEffect(() => {
    //     const { query } = router;

    //     // Access specific query parameters
    //     const id = query.message as string;
    // }, [router])

    useEffect(() => {
        setisMounted(true);
    }, [])



    useEffect(() => {
        (async function getOLdMessages() {
            const _OLd_rooms = await fetch(`http://10.12.9.12/users/direct-message/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            if (_OLd_rooms.status === 200){
                const _rroms = await _OLd_rooms.json()
                _rroms.messages.length && setmessages(_rroms.messages)
            }
            // console.log("_OLd_rooms :", _OLd_rooms.messages)
        })();



    }, [roomid, token])

    // useEffect(() => {
    //     // console.log("socket.on")
        
    // }, [socket, _messages, message])

    const handleSubmit = (e: any) => {
        e.preventDefault();

        if (message) {
            const messageSocket: messageSocket = {
                roomId: roomid,
                messageContent: message
            }
            // if (message) {
                console.log("sendMessage :", messageSocket)

            socket && socket.emit("sendMessage", messageSocket, () => setMessage(""));
            // }
            // console.log(`Message sended .. |${e.target.value}`)
            setInputValue("");
        }
    };

    useEffect(() => {
        if (scrollRef.current) {
          const scrollableContent = scrollRef.current;
          scrollableContent.scrollTop = (scrollableContent.scrollHeight - scrollableContent.clientHeight);
          console.log("scrollableContent.scrollTop :", scrollableContent.scrollTop)
          console.log("scrollableContent.scrollHeight :", scrollableContent.scrollHeight)
          console.log("scrollableContent.clientHeight :", scrollableContent.clientHeight)
        }
      }, [_messages]);

    if (!isMounted)
        return null

    // console.log("_messages :", _messages)
    // socket && console.log("Socket :", socket.id)
    console.log("+>| message :", message)
    console.log("+>| message :", message)

    socket && socket.on('message', (data: any) => {
        console.log("socket.on('message', (data : any) => :", [data])
        setmessages([..._messages, data])
    })
    return <div className={`relative flex flex-col border-2 w-full m-auto   h-full `}>
        <div 
        ref={scrollRef}
        className="relative flex flex-col gap-2 p-2 md:p-5 md:pb-2 m-2 h-[81vh] md:h-[85vh] overflow-x-scroll overflow-y-auto" >
            {_messages && _messages.length 
            ? _messages.map((item: messagesType, index: number) => (
                <Message key={index} content={item.content} id={item.id} senderId={item.senderId} roomsId={item.roomsId} created_at={item.created_at} updated_at={item.updated_at} />
            ))
            : <div>No Data</div>
            }
        </div>
        <div className="absolute bottom-3 md:bottom-1 sm:bottom-0 left-0 w-full ">
            <input
                className=" w-full h-[42px] text-white text-base  font-semibold px-2 outline bg-[#243230] border-transparent focus:border-transparent rounded"
                onSubmit={(event : any) => {
                    handleSubmit(event)
                    setMessage(event.target.value);
                    // setMessage((event.target.value)
                }
                }
                onKeyDown={(event) =>
                    event.key === "Enter" ? handleSubmit(event) : null

                }
                onChange={(event) => {
                    setInputValue(event.target.value);
                    setMessage(event.target.value);
                }}
                value={input}
                placeholder={`Message @'mmasstou'`}
                type="search"
                name=""
                id="" />
        </div>
    </div>
}
export default Messages