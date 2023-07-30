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
<<<<<<< HEAD
import getMemberWithId from "../actions/getMemberWithId";
import { membersType } from "@/types/types";
import ChanneLsettingsHook from "../hooks/channel.settings";


export default function Conversations({ socket }: { socket: Socket | null }) {

    const leftSidebar = LeftSidebarHook()
=======


export default function Conversations({ children }: { children?: React.ReactNode }) {

    const leftSidebar = LeftSidebarHook()
    const [socket, setsocket] = useState<Socket | undefined>(undefined)
>>>>>>> 83667b2c2c6fcadfdbeb783afabb311e9d36e57c
    const [IsMounted, setIsMounted] = useState(false)
    const [IsLoading, setIsLoading] = useState(false)
    const [messages, setMessages] = useState<any[]>([])
    const [hasparam, sethasparam] = useState(false)
    const [channeLinfo, setChanneLinfo] = useState<any>(null)
<<<<<<< HEAD
    const [message, setMessage] = useState("")
    const [InputValue, setInputValue] = useState("")
    const [viewed, setviewed] = useState<number>(0)
    const [LogedMember, setLogedMember] = useState<membersType | null>(null)
    const params = useSearchParams()
    const room = params.get('r')
    const __userId = Cookies.get('_id')
    const channeLsettingsHook = ChanneLsettingsHook()

    // console.log("Conversations socket :", socket?.id)
    useEffect(() => { setIsMounted(true) }, [])
    useEffect(() => {
        room ? sethasparam(true) : sethasparam(false)
=======
    const params = useSearchParams()
    const room = params.get('r')
    console.log("               +> room : ", room)


    useEffect(() => { setIsMounted(true) }, [])
    useEffect(() => {
        room ? sethasparam(true) : sethasparam(false)
        console.log("               +> room : ", room);
>>>>>>> 83667b2c2c6fcadfdbeb783afabb311e9d36e57c
        const token: any = room && Cookies.get('token');
        room && (async () => {
            const response = await getChanneLMessages(room, token)
            if (response && response.ok) {
                const data = await response.json()
<<<<<<< HEAD
=======
                console.log("---------*****data :", data)
>>>>>>> 83667b2c2c6fcadfdbeb783afabb311e9d36e57c
                setMessages(data.messages)
            }

            // get room data :
<<<<<<< HEAD
            const response2 = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rooms/${room}`, {
=======
            const response2 = await fetch(`http://127.0.0.1/api/rooms/${room}`, {
>>>>>>> 83667b2c2c6fcadfdbeb783afabb311e9d36e57c
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
<<<<<<< HEAD
=======
            console.log("_roomInfo :", _roomInfo.name)
>>>>>>> 83667b2c2c6fcadfdbeb783afabb311e9d36e57c
            setChanneLinfo(_roomInfo)
        })();


    }, [room])

<<<<<<< HEAD
    useEffect(() => {
        setInputValue("")
    }, [hasparam, room])
    useEffect(() => {
        socket?.on('message', (message: any) => {

            setMessages([...messages, message])
        })
    }, [messages, InputValue])


    useEffect(() => {
        (async () => {
            const token: any = Cookies.get('token');
            const channeLLid = params.get('r')
            if (!channeLLid)
                return;

            const channeLLMembers = __userId && await getMemberWithId(__userId, channeLLid, token)
            if (channeLLMembers && channeLLMembers.statusCode !== 200) {
                setLogedMember(channeLLMembers)
            }
        })();

    }, [socket, channeLsettingsHook])
=======


>>>>>>> 83667b2c2c6fcadfdbeb783afabb311e9d36e57c

    const content = (
        <div className="flex flex-col gap-3">

            {/* <Message content={"We're GitHub, the company behind the npm Registry and npm CLI. We offer those to the community for free, but our day job is building and selling useful tools for developers like you."} id={'dcae3d31-948a-49de-bad4-de35875bda7b'} senderId={"dcae3d31-948a-49de-bad4-de35875bda7b"} roomsId={""} created_at={"2023-07-11T08:57:44.492Z"} updated_at={"2023-07-11T08:57:44.492Z"} /> */}
            {
                messages.length ?
                    messages.map((message, index) => (
                        <Message
                            key={index}
<<<<<<< HEAD
                            message={message}
                            isForOwner={message.senderId === Cookies.get('_id')}
                            userid={message.sender}
=======
                            content={message.content}
                            id={message.id}
                            senderId={message.senderId}
                            roomsId={message.roomsId}
                            created_at={message.created_at}
                            updated_at={message.updated_at}
>>>>>>> 83667b2c2c6fcadfdbeb783afabb311e9d36e57c
                        />
                    ))
                    : <div>no messages</div>
            }
        </div>
    )
<<<<<<< HEAD

    const onClickHandler = (event: FormEvent<HTMLInputElement>) => {

    }

    const OnSubmit = (event: FormEvent<HTMLInputElement>) => {
        setInputValue("")

        // send message to server using socket :
        socket?.emit('sendMessage', {
            content: message,
            senderId: Cookies.get('_id'),
            roomsId: room
        }, (response: any) => {
        })
    }


    if (!IsMounted) return null

    return <>

        {(hasparam && channeLinfo) ? <div className={`
    Conversations 
    relative 
    w-full 
    h-full
    flex flex-col
    border-orange-300
    sm:flex`}>
            <ConversationsTitlebar LogedMember={LogedMember} socket={socket} channeLId={room} messageTo={channeLinfo.name} OnSubmit={function (event: FormEvent<HTMLInputElement>): void { }} />
            <ConversationsMessages Content={content} />
            <div className="w-full absolute bottom-4 left-0">
                <input
                    className="ConversationsInput w-full h-[54px] text-white text-base  font-semibold px-2 outline bg-[#243230] border-transparent focus:border-transparent rounded"
                    onSubmit={(event: any) => {
                        setMessage(event.target.value);
                        OnSubmit(event)
                        // onClickHandler(event)
                    }
                    }
                    onKeyDown={(event) =>
                        event.key === "Enter" ? OnSubmit(event) : null
                    }
                    onChange={(event) => {
                        setInputValue(event.target.value);
                        setMessage(event.target.value);
                    }}
                    value={InputValue}
                    placeholder={`Message to @'${channeLinfo.name}'`}
                    type="search"
                    name=""
                    id="" />
            </div>
        </div>
            : <div className="flex flex-col justify-center items-center h-full w-full">
                <Image src="/no_conversations.svg" width={600} height={600} alt={""} />
            </div>
        }
    </>
=======
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
>>>>>>> 83667b2c2c6fcadfdbeb783afabb311e9d36e57c
}