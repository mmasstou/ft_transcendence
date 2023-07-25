import { useEffect, useState } from "react"
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




const Message = (props: messagesType) => {
    const [senderInfo, setsenderInfo] = useState({
        id: "",
        login: "",
        email: "",
        password: "",
        first_name: "",
        last_name: "",
        kind: "",
        image: "",
        is_active: false,
        created_at: "",
        updated_at: ""
    })
    // const [reciverInfo, setreciverInfo] = useState({
    //     id: "",
    //     login: "",
    //     email: "",
    //     password: "",
    //     first_name: "",
    //     last_name: "",
    //     kind: "",
    //     image: "",
    //     is_active: false,
    //     created_at: "",
    //     updated_at: ""
    // })
    const [create_At, setcreate_At] = useState("")
    // // console.log("props :", props)


    useEffect(() => {
        const token = Cookies.get("token");
        (async function getsenderInfo() {
            if (props.senderId !== undefined && props.senderId !== null && props.senderId !== "") {
                console.log("props.senderId :", props.senderId)
                console.log("props :", props)
                const response = await fetch(`http://127.0.0.1/api/users/${props.senderId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                if (!response.ok) {
                    return
                }
                const _userInfo = await response.json()
                setsenderInfo(_userInfo);
            }
        })();

        const date = new Date(props.created_at);

        setcreate_At(date.toLocaleString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
        }))

    }, [props])
    return <div className=" relative flex flex-col ">
        <div className="flex flex-row justify-between  items-center">
            <div className="MessagesenderInfo w-full boredr-2  -green-500 flex flex-row items-center p-1 gap-1">
                <UserAvatar size={18} image={"/avatar.jpg"} />
                <h3 className="text-base font-light text-[#FFFFFF]">{senderInfo.login}</h3>
            </div>
            <span className="text-[.5rem] text-end text-[#D9D9D9] min-w-max">{create_At}</span>
        </div>
        <div className="flex flex-col gap-1 bg-[#24323044] rounded-bl-[21px] rounded-r-[21px] p-2  mb-4">
            <div className="message-body flex flex-row items-center gap-4">
                <div className="message-box flex flex-col gap-1 w-full">
                    {/* <div className="header flex flex-row justify-end ">
                        <div><BsCheck2All /></div>
                    </div> */}
                    <div className="body p-1 text-base text-[#65656B]">{props.content}</div>
                </div>
            </div>
        </div>
        {/* <ChannelReactions />
        <ChannelReplys /> */}
    </div>
}

export default Message