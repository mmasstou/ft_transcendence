"use client"
// imports :
import { FormEvent, use, useEffect, useRef, useState } from "react";

// components :
import ConversationsInput from "./channel.conversations.input";
import ConversationsMessages from "./channel.conversations.messages";

// hooks :
import { Socket } from "socket.io-client";

import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Message from "./channel.message";
import LeftSidebarHook from "../hooks/LeftSidebarHook";
import ConversationsTitlebar from "./channel.conversations.titlebar";
import getChanneLMessages from "../actions/getChanneLMessages";
import Cookies from "js-cookie";
import getMemberWithId from "../actions/getMemberWithId";
import { RoomsType, membersType } from "@/types/types";
import ChanneLsettingsHook from "../hooks/channel.settings";
import getChannelWithId from "../actions/getChannelWithId";


export default function Conversations({ socket }: { socket: Socket | null }) {

    const leftSidebar = LeftSidebarHook()
    const [IsMounted, setIsMounted] = useState(false)
    const [IsLoading, setIsLoading] = useState(false)
    const [messages, setMessages] = useState<any[]>([])
    const [hasparam, sethasparam] = useState(false)
    const [channeLinfo, setChanneLinfo] = useState<any>(null)
    const [message, setMessage] = useState("")
    const [InputValue, setInputValue] = useState("")
    const [viewed, setviewed] = useState<number>(0)
    const [scrollmessage, setscrollmessage] = useState(false)
    const [reload, setreload] = useState<boolean>(false)
    const [LogedMember, setLogedMember] = useState<membersType | null>(null)
    const params = useSearchParams()
    const room = params.get('r')
    const __userId = Cookies.get('_id')
    const router = useRouter()
    const channeLsettingsHook = ChanneLsettingsHook()

    // console.log("Conversations socket :", socket?.id)
    useEffect(() => { setIsMounted(true) }, [])
    useEffect(() => {
        room ? sethasparam(true) : sethasparam(false)
        const token: any = room && Cookies.get('token');
        room && (async () => {
            const response = await getChanneLMessages(room, token)
            if (!response) return
            console.log("= await getChanneLMessage :", response)
            setMessages(response.messages)

            // get room data :
            const _roomInfo = await getChannelWithId(room, token)
            setChanneLinfo(_roomInfo)
        })();


    }, [room])

    useEffect(() => {
        setInputValue("")
    }, [hasparam, room])

    useEffect(() => {
        socket?.on('message', (message: any) => {
            setscrollmessage(!scrollmessage)
            setMessages([...messages, message])
        })
        setscrollmessage(!scrollmessage)
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

    useEffect(() => {

        socket?.on(
            `${process.env.NEXT_PUBLIC_SOCKET_EVENT_RESPONSE_CHAT_UPDATE}`,
            (data: {
                message: string,
                status: any,
                data: RoomsType,
            }) => {
                (async () => {
                    const token = Cookies.get('token')
                    if (!token || !room) return
                    const checkExistRoom = getChannelWithId(room, token)
                    if (!checkExistRoom) router.push('chat/channels')
                })
            }
        );
    }, [socket])
    // chack if remove channle is sended :
    useEffect(() => {
        socket?.on("removeChannelResponseEvent", (data) => {
            setreload(reload ? false : true)
        })
    }, [socket, channeLsettingsHook])



    const content = (
        <div className="flex flex-col gap-3">

            {/* <Message content={"We're GitHub, the company behind the npm Registry and npm CLI. We offer those to the community for free, but our day job is building and selling useful tools for developers like you."} id={'dcae3d31-948a-49de-bad4-de35875bda7b'} senderId={"dcae3d31-948a-49de-bad4-de35875bda7b"} roomsId={""} created_at={"2023-07-11T08:57:44.492Z"} updated_at={"2023-07-11T08:57:44.492Z"} /> */}
            {
                messages && messages.length ?
                    messages.map((message, index) => (
                        <Message
                            key={index}
                            message={message}
                            isForOwner={message.senderId === Cookies.get('_id')}
                            userid={message.sender}
                        />
                    ))
                    : <div>no messages</div>
            }
        </div>
    )

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
            {!LogedMember?.isban ?
                <>
                    <ConversationsMessages socket={socket} Content={content} />
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
                    </div></>
                : <div>
                    you are baned from this channel {LogedMember?.userId} -  {__userId}
                </div>
            }
        </div>
            : <div className="flex flex-col justify-center items-center h-full w-full">
                <Image src="/no_conversations.svg" width={600} height={600} alt={""} />
            </div>
        }
    </>
}