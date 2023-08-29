import { useEffect, useState } from "react"
import useCountdown from "./useCountdown"
import { Socket } from "socket.io-client"

interface props {
    member: any
    socket: Socket | null
}
export default function MuteTime(
    { member, socket }: props
) {
    const [secondsLeft, setsecondsLeft] = useState(10000)
    useEffect(() => {
        if (secondsLeft <= 0) return;
        const timeout = setTimeout(() => { setsecondsLeft(secondsLeft - 1) }, 1000)
        return clearTimeout(timeout)
    }, [secondsLeft])


    // useEffect(() => {
    //     socket?.on(`${process.env.NEXT_PUBLIC_SOCKET_EVENT_RESPONSE_CHAT_MEMBER_UPDATE}`, (data) => {
    //         // const channeLLMembers = __userId && await getMemberWithId(__userId, channeLLid, token)
    //         // if (channeLLMembers && channeLLMembers.statusCode !== 200) {
    //         //     setLogedMember(channeLLMembers)
    //         // }

    //         const startTime = 10000;
    //         setsecondsLeft(10000)
    //         console.log("klkjlkjlNEXT_PUBLIC_SOCKET_EVENT_RESPONSE_CHAT_MEMBER_UPDATE :", data)
    //     })
    // }, [socket])
    return <div className=" text-base text-yellow-50">
        <span>{secondsLeft}</span>
    </div>
}