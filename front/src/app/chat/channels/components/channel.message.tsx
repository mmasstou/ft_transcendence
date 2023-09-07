import { messagesType, userType } from "@/types/types";
import Cookies from "js-cookie";
import React, { FC, useEffect, useState } from "react";
import { AiOutlineFieldTime } from "react-icons/ai";
import { IoLocation } from "react-icons/io5";
import getUserWithId from "../actions/getUserWithId";
import TimeAgo from "./TimeAgo";
import { UserAvatar } from "./channel.userAvater";



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
    }, []);
    // let counter = 0;



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
                    <UserAvatar size={32} image={senderInfo?.avatar} User={senderInfo} />
                    <h3 className="text-base font-light text-secondary">{senderInfo?.login}</h3>
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
                        <p className="body p-1 text-base text-white  ">{message.content}</p>
                    </div>
                </div>
            </div>
            <span className={`text-[.5rem]  ${!isForOwner ? 'text-start' : 'text-end'} text-[#D9D9D9] min-w-max flex items-center gap-1`}>
                <AiOutlineFieldTime />
                <TimeAgo timestamp={message.created_at} />
            </span>
        </div>
    </section>
}

export default Message