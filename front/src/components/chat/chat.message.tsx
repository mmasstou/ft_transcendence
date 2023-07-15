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
             await fetch(`http://127.0.0.1/api/users/${props.senderId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }).then(res => res.json()).then((data : userType) => setsenderInfo(data))
            // // console.log("props.senderId :", _OLd_rooms.messages)
            // setmessages(_OLd_rooms.messages)
        })();
        // (async function getsenderInfo() {
        //      await fetch(`http://127.0.0.1/api/users/${props.roomsId}`, {
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
    return <div className=" relative">
        <div className="flex flex-col gap-1 bg-[#24323044] p-3 rounded mb-4">
        <div className="message-body flex flex-row items-center gap-4">
            <div className="image  min-w-[28px] rounded-full overflow-hidden "> <Image src={"/avatar.jpg"} alt={"avatar"} width={28} height={28} /></div>
            <div className="message-box flex flex-col gap-1">
                <div className="header flex flex-row justify-between">
                    <div className="User-info flex flex-row gap-4 items-center">
                        <h1 className="text-base font-bold text-[#FFFFFF]">{senderInfo && senderInfo.login}</h1>
                        <span className="text-sm text-end text-[#D9D9D9]">{create_At}</span>
                    </div>
                    {/* <div><BsCheck2All /></div> */}
                </div>
                <div className="body  text-[1.1rem] text-[#65656B]">{props.content}</div>
            </div>
        </div>
        
        {/* <div className="reaction flex justify-end w-full gap-2 text-[#1EF0AE]">
            <BsEmojiLaughing size={18} fill="#65656B" className="" />
            <BsEmojiWink size={18} fill="#65656B" />
            <BsEmojiDizzy size={18} fill="#65656B" />
            <BsEmojiSmile size={18}  />
        </div> */}
    </div>
    <div className=" absolute bottom-0 left-11 rounded-full"> <BsEmojiLaughing size={18} fill="#65656B" className="" /></div>
    </div>
}

export default Message