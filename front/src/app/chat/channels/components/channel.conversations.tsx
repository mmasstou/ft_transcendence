"use client"
// imports :
import React from "react";

// components :

// hooks :
import { Socket } from "socket.io-client";

import { RoomsType, membersType, messagesType } from "@/types/types";
import Cookies from "js-cookie";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { IoSend } from "react-icons/io5";
import Button from "../../components/Button";
import FindOneBySLug from "../actions/Channel/findOneBySlug";
import getChanneLMessages from "../actions/getChanneLMessages";
import getMemberWithId from "../actions/getMemberWithId";
import ConversationsTitlebar from "./channel.conversations.titlebar";
import Message from "./channel.message";
import BanMember from "./channel.settings.banmember";
import { CiVolumeMute } from "react-icons/ci";
import { is, ro, tr } from "date-fns/locale";
import { ChanneLContext } from "../providers/channel.provider";
import ChannelConversationsMute from "./channel.conversations.mute";

const token: string | undefined = Cookies.get('token')
const UserId: string | undefined = Cookies.get('_id')
export default function Conversations({ socket, slug }: { socket: Socket | null, slug: string }) {
    // const query = useParams();
    // const slug: string = typeof query.slug === 'string' ? query.slug : query.slug[0];
    const chatContainerRef = React.useRef<HTMLDivElement | null>(null);
    const [IsMounted, setIsMounted] = React.useState(false)
    const [messages, setMessages] = React.useState<messagesType[]>([])
    const [channeLinfo, setChanneLinfo] = React.useState<RoomsType | null>(null)
    const [message, setMessage] = React.useState("")
    const [InputValue, setInputValue] = React.useState("")
    const [LogedMember, setLogedMember] = React.useState<membersType | null>(null)

    if (!token || !UserId) return
    const InputRef = React.useRef<HTMLInputElement | null>(null);
    const [LoadingMessages, setLoadingMessages] = React.useState<boolean>(true)
    const [SendingMessage, setSendingMessage] = React.useState<boolean>(false)
    const [IsInputFocused, setIsInputFocused] = React.useState<boolean>(false)
    const ChanneLContextee: any = React.useContext(ChanneLContext)
    const router = useRouter()

    const UpdateData = () => {
        // get logged member :
        (async () => {
            const channeL: RoomsType | null = await FindOneBySLug(slug, token)
            if (!channeL) {
                toast.error('no channeL')
                return
            }
            setChanneLinfo(channeL)
            const member: membersType | null = await getMemberWithId(UserId, channeL?.id, token)
            if (member) { setLogedMember(member); }
        })();
    }
    const FocusedOnSendMessageInput = () => {
        setTimeout(() => {
            if (InputRef.current) {
                InputRef.current.focus();
            }
        }, 100); // sleep .1s ; waiting search input to mounted in focus on it
    }
    // show this last message in the screan :
    React.useEffect(() => {
        setTimeout(() => {
            if (chatContainerRef.current) {
                chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
            }
        }, 700); // sleep .7s waiting all old messages to show and scroll to the last one
    }, [messages, socket, InputValue, message])

    React.useEffect(() => {
        if (LogedMember?.userId !== UserId) return
        UpdateData()
        FocusedOnSendMessageInput()
    }, [slug])

    React.useEffect(() => {
        slug && (async () => {
            const _roomInfo: RoomsType = await FindOneBySLug(slug, token)
            if (!_roomInfo) {
                return;
            }
            // make sure that the user connected to room socket
            socket?.emit('accessToroom', _roomInfo)
            setIsMounted(true)
            // scroll to the buttom of the page :
            setChanneLinfo(_roomInfo)
            const channeLLMembers = UserId && await getMemberWithId(UserId, _roomInfo.id, token)
            if (channeLLMembers && channeLLMembers.statusCode !== 200) {
                setLogedMember(channeLLMembers)
            }

            // get messages :
            const response = await getChanneLMessages(_roomInfo.id, token)
            if (!response) return
            setMessages(response)
            setTimeout(() => {
                setLoadingMessages(false);
                FocusedOnSendMessageInput()
            }, 900);
        })();


    }, [])
    // // listen to message event and send the incomming message to client
    React.useEffect(() => {
        if (!IsMounted || !channeLinfo) return
        socket?.on('newmessage', (newMessage: messagesType) => {
            if (newMessage.roomsId !== channeLinfo?.id) return
            setMessages((prev) => [...prev, newMessage])
            FocusedOnSendMessageInput()
            setSendingMessage(false);
            if (newMessage.senderId === UserId) {
                setInputValue('')
                setMessage('')
            }
        })
    }, [IsMounted])

    // listen to message event and send the incomming message to client and update the member or channel info
    React.useEffect(() => {
        socket?.on(
            `${process.env.NEXT_PUBLIC_SOCKET_EVENT_RESPONSE_CHAT_MEMBER_UPDATE}`,
            (data) => { if (data.OK) { return UpdateData(); } });

        socket?.on(
            `${process.env.NEXT_PUBLIC_SOCKET_EVENT_RESPONSE_CHAT_UPDATE}`,
            (data) => { if (data.OK) { return UpdateData(); } });
        socket?.on(
            `${process.env.NEXT_PUBLIC_SOCKET_EVENT_RESPONSE_CHAT_MEMBER_KICK}`,
            (data: { OK: boolean, member: membersType }) => {
                if (data.OK) {
                    if (data.member.userId === UserId) {
                        toast.error(`you are kicked from this channel`)
                        return router.push('/chat/channels')
                    }
                }
            })
        socket?.on('sendMessageResponse', (res: { OK: boolean, message: string }) => {
            if (!res.OK) {
                toast.error(res.message)
                setLoadingMessages(false);
                return
            }
        })

        return () => {
            socket?.off(`${process.env.NEXT_PUBLIC_SOCKET_EVENT_RESPONSE_CHAT_MEMBER_UPDATE}`)
            socket?.off(`${process.env.NEXT_PUBLIC_SOCKET_EVENT_RESPONSE_CHAT_UPDATE}`)
            socket?.off(`${process.env.NEXT_PUBLIC_SOCKET_EVENT_RESPONSE_CHAT_MEMBER_KICK}`)
            socket?.off('sendMessageResponse')
        }

    }, [])

    const OnSubmit = () => {
        const sendMesage = message.trim()
        if (!sendMesage) {
            toast.error("prompt message empty")
            setInputValue('')
            return
        }
        if (!channeLinfo) {
            setInputValue('')
            toast.error("no channeLinfo")
            return
        }
        // send message to server using socket :
        socket?.emit('sendMessage', {
            content: message,
            senderId: Cookies.get('_id'),
            roomsId: channeLinfo.id
        })
        setInputValue('')
        setMessage('')
        setSendingMessage(true)

    }

    const checkLimitCharacters = (input: string) => {
        if (input.length > 512) return toast.error("you can't send more than 512 characters")
        setInputValue(input);
    }

    if (!IsMounted) return null

    return <div className=" relative flex flex-col items-center w-full">
        <ChannelConversationsMute IsActive={LogedMember?.ismute ? true : false} />
        {channeLinfo
            ? <div className={`Conversations relative w-full  h-[83vh] md:h-[88vh] flex flex-col sm:flex`}>
                <ConversationsTitlebar
                    LogedMember={LogedMember}
                    socket={socket}
                    channeLId={channeLinfo.id}
                    messageTo={channeLinfo.name}
                    OnSubmit={function (event: React.FormEvent<HTMLInputElement>): void { }}
                />
                {!LogedMember?.isban ?

                    <div className="flex flex-col justify-between  h-[78vh] md:h-[83vh] pb-5 ">
                        <div ref={chatContainerRef} className="ConversationsMessages relative p-4 overflow-y-scroll flex flex-col gap-3" >
                            {
                                !LoadingMessages ? messages && messages.length ?
                                    messages.map((message, index) => (
                                        <Message
                                            key={index}
                                            message={message}
                                            isForOwner={message.senderId === Cookies.get('_id')}
                                            userid={message.senderId}
                                        />
                                    ))
                                    : <div>no messages</div>
                                    : <div>Loading geting OLd messages ...</div>
                            }
                        </div>
                        {<div className="w-full relative px-6">

                            {SendingMessage && <div className=" text-secondary text-[10px] capitalize absolute -top-4 left-4 bg-[#161F1E] ">sending ....</div>}
                            <div className="ConversationsInput w-full h-[54px] bg-[#24323044] text-[#ffffff]  text-[16px]  rounded-[12px] flex justify-end items-center">
                                <input
                                    ref={InputRef}
                                    onFocus={() => setIsInputFocused(true)}
                                    onBlur={() => setIsInputFocused(false)}
                                    disabled={SendingMessage || LogedMember?.ismute}
                                    className="focus:outline-none placeholder:text-[#b6b6b6e3] placeholder:text-base placeholder:font-thin w-full py-1 px-4 bg-transparent"
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
                                        checkLimitCharacters(event.target.value)

                                        setMessage(event.target.value);
                                    }}
                                    value={InputValue}
                                    placeholder={`${!LogedMember?.ismute ? `Message to @${channeLinfo.name}` : 'you  dont have permission to send message in this channel'}`}
                                    type="search"
                                    name=""
                                    id="" />
                                {InputValue.length !== 0 && <div className="flex gap-1">
                                    <span className=" text-[8px] text-center max-w-max flex w-full">{InputValue.length} / 512</span>
                                    <Button icon={IoSend} disabled={SendingMessage} outline small onClick={OnSubmit} />
                                </div>}
                            </div>
                        </div>

                        }
                    </div>
                    : <BanMember LogedMember={LogedMember} User={undefined} room={channeLinfo} />
                }
            </div >
            : <div className="flex flex-col justify-center items-center h-full w-full">
                <Image src="/no_conversations.svg" width={600} height={600} alt={""} />
            </div>
        }
    </div >
}