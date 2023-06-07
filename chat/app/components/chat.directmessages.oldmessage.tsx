'use client'

import { useEffect, useState } from "react"
import OLdMessages from "../hooks/OLdMessages"
import OnlineUsers from "../hooks/OnlineUsers"
import DirectOLdMessagesItem from "./DirectOLdMessagesItem"

const OldMessages = [
    {
        name: "user 01",
        lastmessgae: "Administration when is the next tournament , i like eveything ! ",
        time: "34m",
        image: "/avatar.jpg",
        active: true
    },
    {
        name: "mmasstou",
        lastmessgae: "Administration when is the next tournament , i like eveything ! ",
        time: "34m",
        image: "/avatar.jpg",
        active: false
    }
]

const DirectOLdMessages = () => {
    const [isMounted, setisMounted] = useState(false)
    const [WindowsSize, setWindowsSize] = useState(0)

    const onLineUser = OnlineUsers()
    const oLdMessages = OLdMessages()
    isMounted && window.addEventListener('resize', () => setWindowsSize(window.innerWidth))
    const handleClick = (value : string) => {
        console.log("value :", WindowsSize)
        if (WindowsSize <= 768){
            oLdMessages.onClose()
        }
    }

    useEffect(() => {
        setisMounted(true)
    }, [])
    if (!oLdMessages.IsOpen)
        return null
    
    return <div className={`flex justify-center   h-full w-full  border border-green-500 overflow-y-scroll 
    ${onLineUser.IsOpen ? ' max-w-full lg:max-w-[320px]' : 'max-w-full md:max-w-[320px]'}

    `}>
        <div className="w-full">
            {OldMessages.map((item, index) =>(
                <DirectOLdMessagesItem key={index} OnClick={handleClick} active={item.active} name={item.name} lastmessgae={item.lastmessgae} time={item.time} image={item.image}  />

            ))}
            
        </div>
    </div>
}

export default DirectOLdMessages