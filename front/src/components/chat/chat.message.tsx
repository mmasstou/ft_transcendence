import { useEffect, useState } from "react"
import { messagesType, userType } from "@/types/types"
import Cookies from "js-cookie";
import Image from "next/image"
import { BsCheck2All, BsEmojiDizzy, BsEmojiLaughing, BsEmojiSmile, BsEmojiWink } from "react-icons/bs";

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
            // console.log("props.senderId :", props.senderId)
             await fetch(`http://10.12.9.7/users/${props.senderId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }).then(res => res.json()).then((data : userType) => setsenderInfo(data))
            // // console.log("props.senderId :", _OLd_rooms.messages)
            // setmessages(_OLd_rooms.messages)
        })();
        // (async function getsenderInfo() {
        //      await fetch(`http://10.12.9.7/users/${props.roomsId}`, {
        //         headers: {
        //             Authorization: `Bearer ${token}`,
        //         },
        //     }).then(res => res.json()).then((data : userType) => setreciverInfo(data))
        // })();
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
    return <div className="flex flex-col gap-1 bg-[#24323044] p-3 rounded">
        <div className="message-body flex flex-row items-center gap-4">
            <div className="image  min-w-[32px] rounded-full overflow-hidden "> <Image src={"/avatar.jpg"} alt={"avatar"} width={32} height={32} /></div>
            <div className="message-box flex flex-col gap-1">
                <div className="header flex flex-row justify-between">
                    <div className="User-info flex flex-row gap-4 items-center">
                        <h1 className="text-[1.3rem] font-bold text-[#FFFFFF]">{senderInfo && senderInfo.login}</h1>
                        <span className="text-[.75rem] text-end text-[#D9D9D9]">{create_At}</span>
                    </div>
                    {/* <div><BsCheck2All /></div> */}
                </div>
                <div className="body  text-[1.1rem] text-[#65656B]">{props.content}</div>
            </div>
        </div>
        {/* <div className="reaction flex justify-start w-full gap-2 text-[#1EF0AE]">
            <BsEmojiLaughing size={21} fill="#65656B" className="" />
            <BsEmojiWink size={21} fill="#65656B" />
            <BsEmojiDizzy size={21} fill="#65656B" />
            <BsEmojiSmile size={21}  />
        </div> */}
    </div>
}

export default Message