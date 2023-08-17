"use client"
// imports :
import React from "react";

// components :
import ConversationsInput from "./channel.conversations.input";
import ConversationsMessages from "./channel.conversations.messages";

// hooks :
import { Socket } from "socket.io-client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
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
import { toast } from "react-hot-toast";
import BanMember from "./channel.settings.banmember";
import MemberHasPermissionToAccess from "../actions/MemberHasPermissionToAccess";
import FindOneBySLug from "../actions/Channel/findOneBySlug";


export default function Conversations({ socket }: { socket: Socket | null }) {

    const query = useParams();
    const slug: string = typeof query.slug === 'string' ? query.slug : query.slug[0];
    const chatContainerRef = React.useRef<HTMLDivElement | null>(null);
    const [IsMounted, setIsMounted] = React.useState(false)
    const [messages, setMessages] = React.useState<any[]>([])
    const [channeLinfo, setChanneLinfo] = React.useState<RoomsType | null>(null)
    const [message, setMessage] = React.useState("")
    const [InputValue, setInputValue] = React.useState("")
    const [scrollmessage, setscrollmessage] = React.useState(false)
    const [LogedMember, setLogedMember] = React.useState<membersType | null>(null)
    const params = useSearchParams()
    const token = Cookies.get('token')
    const __userId = Cookies.get('_id')
    if (!token || !__userId) return
    const router = useRouter()

    // console.log("Conversations socket :", socket?.id)
    // show this last message in the screan :
    React.useEffect(() => {
        setTimeout(() => {
            if (chatContainerRef.current) {
                chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
            }
        }, 100);
    }, [messages, socket, InputValue, message])

    React.useEffect(() => {
        const token: any = slug && Cookies.get('token');
        slug && (async () => {
            const _roomInfo: RoomsType = await FindOneBySLug(slug, token)
            if (!_roomInfo) {
                return;
            }
            setIsMounted(true)
            // scroll to the buttom of the page :
            toast.success(`Welcome to ${_roomInfo.name}`)
            setChanneLinfo(_roomInfo)
            const response = await getChanneLMessages(_roomInfo.id, token)
            if (!response) return
            setMessages(response.messages)

            const channeLLMembers = __userId && await getMemberWithId(__userId, _roomInfo.id, token)
            if (channeLLMembers && channeLLMembers.statusCode !== 200) {
                setLogedMember(channeLLMembers)
            }

            // get channeLLid data :
        })();
    }, [])

    React.useEffect(() => {
        socket?.on('message', (message: any) => {
            console.table("messages 1:", messages)
            const List = [...messages, message]
            console.table("message :", List)
            setMessages(List)
        })
        socket?.on(
            `${process.env.NEXT_PUBLIC_SOCKET_EVENT_RESPONSE_CHAT_MEMBER_UPDATE}`,
            (data: {
                message: string,
                status: any,
                data: RoomsType,
            }) => {
                (async () => {
                    if (!channeLinfo)
                        return;
                    const channeLLMembers = __userId && await getMemberWithId(__userId, channeLinfo.id, token)
                    if (channeLLMembers) {
                        setLogedMember(channeLLMembers)
                    }
                })();
            }
        );
    }, [InputValue, socket])


    const OnSubmit = () => {
        if (!message) {
            toast.error("no message to send")
            return
        }
        if (!channeLinfo || !message) return
        setInputValue('')
        // send message to server using socket :
        socket?.emit('sendMessage', {
            content: message,
            senderId: Cookies.get('_id'),
            roomsId: channeLinfo.id
        })

    }



    if (!IsMounted) return null

    return <div className="flex flex-col items-center border-2 w-full">
        {channeLinfo
            ? <div className={`Conversations relative w-full  h-[83vh] md:h-[88vh] flex flex-col border border-orange-300 sm:flex`}>
                <ConversationsTitlebar
                    LogedMember={LogedMember}
                    socket={socket}
                    channeLId={channeLinfo.id}
                    messageTo={channeLinfo.name}
                    OnSubmit={function (event: React.FormEvent<HTMLInputElement>): void { }}
                />
                {!LogedMember?.isban ?
                    <>
                        <div ref={chatContainerRef} className="ConversationsMessages relative p-4 overflow-y-scroll border-2 border-danger mb-2  flex flex-col gap-3" >
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
                        <div className="w-full relative">
                            <input
                                className="ConversationsInput w-full h-[54px] text-white text-base  font-semibold px-2 outline bg-[#243230] border-transparent focus:border-transparent rounded"
                                onSubmit={(event: any) => {
                                    setMessage(event.target.value);

                                    OnSubmit()
                                    // onClickHandler(event)
                                }
                                }
                                onKeyDown={(event) =>
                                    event.key === "Enter" ? OnSubmit() : null
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
                    : <BanMember LogedMember={LogedMember} User={undefined} room={channeLinfo} />
                }
            </div>
            : <div className="flex flex-col justify-center items-center h-full w-full">
                <Image src="/no_conversations.svg" width={600} height={600} alt={""} />
            </div>
        }
    </div>
}