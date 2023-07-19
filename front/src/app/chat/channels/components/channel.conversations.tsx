"use client"
// imports :
import { FormEvent, use, useEffect, useState } from "react";

// components :
import ConversationsInput from "./channel.conversations.input";
import ConversationsMessages from "./channel.conversations.messages";

// hooks :
import { Socket } from "socket.io-client";

import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Message from "./channel.message";
import LeftSidebarHook from "../hooks/LeftSidebarHook";
import ConversationsTitlebar from "./channel.conversations.titlebar";
import getChanneLMessages from "../actions/getChanneLMessages";
import Cookies from "js-cookie";


export default function Conversations({ children }: { children?: React.ReactNode }) {

    const leftSidebar = LeftSidebarHook()
    const [socket, setsocket] = useState<Socket | undefined>(undefined)
    const [IsMounted, setIsMounted] = useState(false)
    const [IsLoading, setIsLoading] = useState(false)
    const [messages, setMessages] = useState<any[]>([])
    const [hasparam, sethasparam] = useState(false)
    const [channeLinfo, setChanneLinfo] = useState<any>(null)
    const params = useSearchParams()
    const room = params.get('r')
    console.log("               +> room : ", room)


    useEffect(() => { setIsMounted(true) }, [])
    useEffect(() => {
        room ? sethasparam(true) : sethasparam(false)
        console.log("               +> room : ", room);
        const token: any = room && Cookies.get('token');
        room && (async () => {
            const response = await getChanneLMessages(room, token)
            if (response && response.ok) {
                const data = await response.json()
                console.log("---------*****data :", data)
                setMessages(data.messages)
            }

            // get room data :
            const response2 = await fetch(`http://127.0.0.1/api/rooms/${room}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            })
            if (!response2.ok) {
                return
            }
            const _roomInfo = await response2.json()
            console.log("_roomInfo :", _roomInfo.name)
            setChanneLinfo(_roomInfo)
        })();


    }, [room])




    const content = (
        <div className="flex flex-col gap-3">

            {/* <Message content={"We're GitHub, the company behind the npm Registry and npm CLI. We offer those to the community for free, but our day job is building and selling useful tools for developers like you."} id={'dcae3d31-948a-49de-bad4-de35875bda7b'} senderId={"dcae3d31-948a-49de-bad4-de35875bda7b"} roomsId={""} created_at={"2023-07-11T08:57:44.492Z"} updated_at={"2023-07-11T08:57:44.492Z"} /> */}
            {
                messages.length ?
                    messages.map((message, index) => (
                        <Message
                            key={index}
                            content={message.content}
                            id={message.id}
                            senderId={message.senderId}
                            roomsId={message.roomsId}
                            created_at={message.created_at}
                            updated_at={message.updated_at}
                        />
                    ))
                    : <div>no messages</div>
            }
        </div>
    )
    if (!IsMounted) return null
    return <div className={`
    Conversations 
    relative 
    h-[86vh]
    md:h-[90vh]
    w-full 
    flex flex-col
    border-orange-300
    sm:flex`}>
        {
            (hasparam && channeLinfo) ? <>
                <ConversationsTitlebar messageTo={channeLinfo.name} OnSubmit={function (event: FormEvent<HTMLInputElement>): void { }} />
                <ConversationsMessages Content={content} />
                <ConversationsInput
                    messageTo={channeLinfo.name}
                    OnSubmit={function (event: FormEvent<HTMLInputElement>): void {
                        console.log("event :", event)
                    }}
                />
            </>
                : <div className="flex flex-col justify-center items-center h-full w-full">
                    <Image src="/no_conversations.svg" width={600} height={600} alt={""} />
                </div>}
    </div>
}