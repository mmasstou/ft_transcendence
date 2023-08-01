import { FC, useEffect, useState } from "react"
import { messagesType, userType } from "@/types/types"
import Cookies from "js-cookie";
import Image from "next/image"
import { BsCheck2All, BsEmojiDizzy, BsEmojiFrownFill, BsEmojiLaughing, BsEmojiSmile, BsEmojiWink } from "react-icons/bs";
import { UserAvatar } from "./channel.userAvater";
import { HiArrowUturnLeft } from "react-icons/hi2";
import { MdAddReaction } from "react-icons/md";
import { AiFillMessage } from "react-icons/ai";
import { ChannelReactions } from "./channel.reaction";
import { ChannelReplys } from "./channel.replys";
import getUserWithId from "../actions/getUserWithId";
import { CgOptions } from "react-icons/cg";
import Button from "../../components/Button";



interface Imessage {
    message: messagesType
    userid: string
    isForOwner ?: boolean
}
const Message: FC<Imessage> = ({ message, userid ,isForOwner}) => {
    const [create_At, setcreate_At] = useState("")
    const [senderInfo, setsenderInfo] = useState<userType | null>(null)

    useEffect(() => {

        const token = Cookies.get("token");
        if (!token) return;
        (async function getsenderInfo(userid: string, token: string) {
            const _userInfo = await getUserWithId(userid, token)
            setsenderInfo(_userInfo);
        })(message.senderId, token);


        const date = new Date(message.created_at);

        setcreate_At(date.toLocaleString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
        }))

    }, [message, userid])

    if (!senderInfo)
        return
    return <div className=" relative flex flex-col ">
        <div className="flex flex-row justify-between  items-center">
            <div className="MessagesenderInfo w-full boredr-2  -green-500 flex flex-row items-center p-1 gap-2">
                <UserAvatar size={32} image={senderInfo?.avatar} />
                <h3 className="text-base font-light text-[#FFFFFF]">{senderInfo?.login}</h3>
            </div>
            <span className="text-[.5rem] text-end text-[#D9D9D9] min-w-max">{create_At}</span>
        </div>
        <div className="flex flex-col gap-1 bg-[#24323044] rounded-bl-[21px] rounded-r-[21px] p-2  mb-4">
            <div className="message-body flex flex-row items-center gap-4">
                <div className="message-box flex flex-col gap-1 w-full">
                    {/* <div className="header flex flex-row justify-end ">
                        <div><BsCheck2All /></div>
                    </div> */}
                   {/* {isForOwner && <div className="header flex flex-row justify-end ">
                        <Button
                            icon={CgOptions}
                            small
                            outline
                            onClick={() => { }}
                        />
                    </div>} */}
                    <div className="body p-1 text-base text-[#65656B]">{message.content}</div>
                </div>
            </div>
        </div>
        {/* <ChannelReactions />
        <ChannelReplys /> */}
    </div>
}

export default Message