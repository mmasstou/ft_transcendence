import { useEffect, useState } from "react"
import { messagesType } from "../types/types"


const Message = (props :messagesType)  => {
    // const [senderInfo, setsenderInfo] = useState({})
    // const [senderInfo, setsenderInfo] = useState({})
    // console.log("props :", props)


    // useEffect(() => {
    //     (async function getsenderInfo() {
    //         const _OLd_rooms = await fetch(`http://127.0.0.1/users//${props.senderId}`, {
    //             headers: {
    //                 Authorization: `Bearer ${token}`,
    //             },
    //         }).then(res => res.json())
    //         console.log("_OLd_rooms :", _OLd_rooms.messages)
    //         setmessages(_OLd_rooms.messages)
    //     })();
    //     (async function getsenderInfo() {
    //         const _OLd_rooms = await fetch(`http://127.0.0.1/users//${props.roomsId}`, {
    //             headers: {
    //                 Authorization: `Bearer ${token}`,
    //             },
    //         }).then(res => res.json())
    //         console.log("_OLd_rooms :", _OLd_rooms.messages)
    //         setmessages(_OLd_rooms.messages)
    //     })();
    // }, [])
return <h1>{props.content}</h1>
}

export default Message