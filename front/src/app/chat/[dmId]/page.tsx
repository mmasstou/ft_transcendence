"use client"

import { messagesType } from '@/types/types';
import Cookies from 'js-cookie';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';
import toast from 'react-hot-toast';
import { IoSend } from 'react-icons/io5';
import { TbMessageX } from 'react-icons/tb';
import { Socket } from 'socket.io-client';
import FindDm from '../channels/actions/FindDm';
import findAlldmsForLoginUser from '../channels/actions/findAlldmsForLoginUser';
import Message from '../channels/components/channel.message';
import LeftSidebarHook from '../channels/hooks/LeftSidebarHook';
import LefttsideModaL from '../channels/modaLs/LeftsideModal';
import { ChanneLContext } from '../channels/providers/channel.provider';
import Button from '../components/Button';
import Conversation from '../components/Conversation';
const metadata = {
    title: 'Transcendence',
    description: 'ft_transcendence',
};
const token = Cookies.get('token');
const UserId = Cookies.get('_id');
export default function page({ params }: { params: { dmId: string } }) {
    const router = useRouter();
    // get query params
    const [socket, setSocket] = React.useState<Socket | null>(null);
    const [ConversationList, setConversationList] = React.useState<any>(null);
    const [ConversationInfo, setConversationInfo] = React.useState<any>(null);
    const chatContainerRef = React.useRef<HTMLDivElement | null>(null);
    const [IsMounted, setIsMounted] = React.useState(false);
    const InputRef = React.useRef<HTMLInputElement | null>(null);
    const [LoadingMessages, setLoadingMessages] = React.useState<boolean>(true)
    const [SendingMessage, setSendingMessage] = React.useState<boolean>(false)
    const ChanneLContextee: any = React.useContext(ChanneLContext)
    const [messages, setMessages] = React.useState<messagesType[]>([])
    const [IsInputFocused, setIsInputFocused] = React.useState<boolean>(false)
    const [message, setMessage] = React.useState("")
    const [reload, setReload] = React.useState<boolean>(false)
    const leftSidebarHook = LeftSidebarHook()



    const [InputValue, setInputValue] = React.useState("")

    const [IsOffLine, setOffLine] = React.useState<boolean>(false)
    const FocusedOnSendMessageInput = () => {
        setTimeout(() => {
            if (InputRef.current) {
                InputRef.current.focus();
            }
        }, 100); // sleep .1s ; waiting search input to mounted in focus on it
    }

    React.useEffect(() => {
        setTimeout(() => {
            if (chatContainerRef.current) {
                chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
            }
        }, 700); // sleep .7s waiting all old messages to show and scroll to the last one
    }, [messages, socket, InputValue, message])


    const UpdateData = async () => {
        if (!token) return;
        const res = await findAlldmsForLoginUser(token)
        if (res) setConversationList(res);
        const dm: any = await FindDm(params.dmId, token)
        if (!dm) return;
        setConversationInfo(dm)
        setMessages(dm.Messages)
        setTimeout(() => {
            setLoadingMessages(false);
            FocusedOnSendMessageInput()
        }, 900);
    }

    React.useEffect(() => { UpdateData() }, [reload])


    React.useEffect(() => {
        if (!IsMounted || !ConversationInfo) return
        socket?.on('message', (newMessage: messagesType) => {
            if (newMessage.dmId !== ConversationInfo?.id) return
            setMessages((prev) => [...prev, newMessage])
            FocusedOnSendMessageInput()
            setSendingMessage(false);
            if (newMessage.senderId === UserId) {
                setInputValue('')
                setMessage('')
            }
        })

        socket?.on('createDm', (payload: { senderId: string; receiverId: string }) => {
            setReload(prev => !prev);
            socket.emit('accessToDm', payload);

        })
        socket?.on('deleteDm', (payload: { senderId: string; receiverId: string }) => {
            if (payload.receiverId !== UserId && payload.senderId !== UserId) return
            setReload(prev => !prev);
            router.replace('/chat');
            toast("You have been removed from this conversation", { icon: '🚫' });
        })
        return () => {
            socket?.off('message');
            socket?.off('createDm');
            socket?.off('deleteDm');
        }
    }, [ConversationInfo])

    React.useEffect(() => {
        leftSidebarHook.onClose()
        UpdateData();
        setIsMounted(true);
    }, [])

    React.useEffect(() => {
        setSocket(ChanneLContextee.DmSocket)
    }, [ChanneLContextee])

    const OnSubmit = () => {
        const sendMesage = message.trim()
        if (!sendMesage) {
            toast.error("prompt message empty")
            setInputValue('')
            return
        }
        if (!ConversationInfo) {
            setInputValue('')
            toast.error("no ConversationInfo")
            return
        }
        // send message to server using socket :
        if (!socket?.connected) {
            toast("you are offline", { icon: '🟠' })
            setOffLine(true)
            return
        }
        socket?.emit('message', {
            content: message,
            senderId: Cookies.get('_id'),
            dmId: ConversationInfo.id
        })
        setInputValue('')
        setMessage('')
        setSendingMessage(true)

    }
    const checkLimitCharacters = (input: string) => {
        if (input.length > 512) return toast.error("you can't send more than 512 characters")
        setInputValue(input);
    }


    if (!IsMounted) return
    document.title = `Transcendence/ dm` || metadata.title;
    return <>
        <LefttsideModaL>
            {
                ConversationList && ConversationList.map((md: any, key: number) => (
                    <Conversation md={md} />
                ))
            }
        </LefttsideModaL>
        {/* <Conversations socket={socket} slug={params.dmId} /> */}
        <div className=" relative flex flex-col items-center w-full">

            {ConversationInfo
                ? <div className={`Conversations relative w-full  h-[83vh] md:h-[88vh] flex flex-col sm:flex`}>
                    {/* <ConversationsTitlebar
                    LogedMember={LogedMember}
                    socket={socket}
                    channeLId={ConversationInfo.id}
                    messageTo={ConversationInfo.name}
                    OnSubmit={function (event: React.FormEvent<HTMLInputElement>): void { }}
                /> */}
                    {<div className="flex flex-col justify-between  h-[78vh] md:h-[83vh] pb-5 ">
                        <div ref={chatContainerRef} className="ConversationsMessages relative p-4 overflow-y-scroll flex flex-col gap-3" >
                            {
                                !LoadingMessages
                                    ? messages && messages.length
                                        ? messages.map((message, index) => (
                                            <Message
                                                key={index}
                                                message={message}
                                                isForOwner={message.senderId === Cookies.get('_id')}
                                                userid={message.senderId}
                                            />
                                        ))
                                        : <div className="w-full  flex justify-center items-center  h-[78vh] md:h-[83vh]">
                                            <TbMessageX className=" text-[#F5F5F5]" size={120} />
                                        </div>
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
                                    disabled={SendingMessage}
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
                                    placeholder={`Message to @${ConversationInfo.id}`}
                                    type="search"
                                    name=""
                                    id="" />
                                {InputValue.length !== 0 && <div className="flex gap-1">
                                    <span className=" text-[8px] text-center max-w-max flex w-full">{InputValue.length} / 512</span>
                                    <Button icon={IoSend} disabled={SendingMessage} outline small onClick={OnSubmit} />
                                </div>}
                            </div>
                        </div>}
                    </div>
                    }
                </div >
                : <div className="flex flex-col justify-center items-center h-full w-full">
                    <Image src="/no_conversations.svg" width={600} height={600} alt={""} />
                </div>
            }
        </div >
    </>

}
