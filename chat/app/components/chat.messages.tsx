'use client'
import { useSearchParams } from "next/navigation"
import OnlineUsers from "../hooks/OnlineUsers"
import { useEffect, useState } from "react"
import OLdMessages from "../hooks/OLdMessages"


interface MessagesProps {
    message: string
}

const Messages: React.FC<MessagesProps> = ({ message }) => {
    const onLineUser = OnlineUsers()
    const oLdMessages = OLdMessages()

    const params = useSearchParams()
    const [isMounted, setisMounted] = useState(false)

    let currentQuery: string | null = ''
    if (params) {
        currentQuery = params?.get('message')
    }
    currentQuery && console.log("currentQuery :", currentQuery)
    // useEffect(() => {
    //     const { query } = router;

    //     // Access specific query parameters
    //     const id = query.message as string;
    // }, [router])

    useEffect(() => {
        setisMounted(true)
    }, [])

    if (!isMounted)
        return null


    return <div className={` flex flex-col border-2 w-full m-auto h-full ${oLdMessages.IsOpen ? ' hidden md:flex' : ''}` }>
       <div>
        messages
       </div>
        <div className="flex h-full items-end w-full">
            <input className="m-2 w-full h-[42px] text-white text-base  font-semibold px-2 outline bg-[#243230] border-transparent focus:border-transparent rounded" placeholder="Message @'mmasstou" type="search" name="" id="" />
        </div>
    </div>
}
export default Messages