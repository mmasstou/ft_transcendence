import { FC, useEffect, useRef, useState } from "react"
import { messagesType, userType } from "@/types/types"
import Cookies from "js-cookie";
import Image from "next/image"
import { BsCheck2All, BsEmojiDizzy, BsEmojiFrownFill, BsEmojiLaughing, BsEmojiSmile, BsEmojiWink } from "react-icons/bs";
import { UserAvatar } from "./channel.userAvater";
import { HiArrowUturnLeft } from "react-icons/hi2";
import { MdAddReaction } from "react-icons/md";
import { AiFillMessage, AiOutlineFieldTime } from "react-icons/ai";
import { ChannelReactions } from "./channel.reaction";
import { ChannelReplys } from "./channel.replys";
import getUserWithId from "../actions/getUserWithId";
import { CgOptions } from "react-icons/cg";
import Button from "../../components/Button";
import { toast } from "react-hot-toast";
import TimeAgo from "./TimeAgo";
import { IoLocation } from "react-icons/io5";
import React from "react";



interface Imessage {
    message: messagesType
    userid: string
    isForOwner?: boolean
}
const Message: FC<Imessage> = ({ message, userid, isForOwner }) => {
    const [senderInfo, setsenderInfo] = useState<userType | null>(null)
    const [IsMounted, setIsMounted] = useState(false)
    const userId = Cookies.get("_id");
    const token = Cookies.get("token");

    if (!userId || !token) return


    React.useEffect(() => {
        setIsMounted(true)
    }, [])

    useEffect(() => {
        (async function getsenderInfo(userid: string, token: string) {
            const _userInfo = await getUserWithId(userid, token)
            if (!_userInfo) {
                setIsMounted(false)
                return;
            }
            setsenderInfo(_userInfo);
        })(message.senderId, token);
    }, [message, userid])

    if (!IsMounted || !senderInfo)
        return
    return <section className={`ffffffff  relative flex w-full  ${isForOwner ? 'justify-end' : ' justify-start'}`}>
        <div className={`ffffffff  relative flex flex-col min-w-[220px]  max-w-[340px] sm:max-w-[600px] lg:max-w-[700px]   break-words  ${!isForOwner ? 'justify-end' : ' justify-start'}`}>
            <div className={`flex ${!isForOwner ? 'flex-row' : ' flex-row-reverse '} justify-between`}>
                <div className={`MessagesenderInfo flex ${!isForOwner ? 'flex-row' : ' flex-row-reverse '} items-center p-1 gap-2`}>
                    <UserAvatar size={32} image={senderInfo?.avatar} />
                    <h3 className="text-base font-light text-[#FFFFFF]">{senderInfo?.login}</h3>
                </div>
                <div className={`flex ${!isForOwner ? 'flex-row' : ' flex-row-reverse '} gap-2 justify-center items-center`}>
                    <span className="text-[.5rem] text-end text-[#D9D9D9] min-w-max flex flex-row items-center justify-center gap-1">
                        <IoLocation />
                        {senderInfo.location}
                    </span>

                </div>
            </div>
            <div className={`flex flex-col gap-1 bg-[#24323044]  p-2  mb-1 ${!isForOwner ? 'rounded-bl-[21px] rounded-r-[21px]' : 'rounded-br-[21px] rounded-l-[21px]'}`}>
                <div className="message-body flex flex-row items-center gap-4">
                    <div className="message-box flex flex-col gap-1 w-full">
                        <div className="body p-1 text-base text-[#65656B]  ">{message.content}</div>
                    </div>
                </div>
            </div>
            <span className={`text-[.5rem]  ${!isForOwner ? 'text-start' : 'text-end'} text-[#D9D9D9] min-w-max flex items-center gap-1`}>
                <AiOutlineFieldTime />
                <TimeAgo timestamp={message.created_at} />
            </span>
        </div>
        {/* <ChannelReactions />
        <ChannelReplys /> */}
    </section>
}

export default Message