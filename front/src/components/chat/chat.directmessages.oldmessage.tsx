'use client'

import { useEffect, useState } from "react"
import DirectOLdMessagesItem from "./DirectOLdMessagesItem"
import Cookies from "js-cookie"
import { useSearchParams } from "next/navigation"
import OnlineUsers from "@/hooks/OnlineUsers"
import OLdMessages from "@/hooks/OLdMessages"
import { RoomsType } from "@/types/types"
import { Socket } from "socket.io-client"

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

const DirectOLdMessages = (props: { socket: Socket }) => {
    const [isMounted, setisMounted] = useState(false)
    const [WindowsSize, setWindowsSize] = useState(0)
    const [OLdrooms, setOLdRooms] = useState([])
    const params = useSearchParams()
    let currentQuery: string | null = ''
    if (params) {
        currentQuery = params?.get('room')
    }
    const onLineUser = OnlineUsers()
    const oLdMessages = OLdMessages()
    const handleClick = (value: string) => {
        const __windowsSize: number = window.innerWidth
        // console.log("value :", __windowsSize)
        if (__windowsSize <= 768) {
            oLdMessages.onClose()
        }
    }

    const token = Cookies.get('token')
    useEffect(() => {
        (async function getOLdMessages() {
                console.log("Ana Hna !")
                const response = await fetch(`http://10.12.9.12/users/direct-messages`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                if (response.ok) {
                    const _OLd_rooms = await response.json()
                    console.log("_OLd_rooms :", _OLd_rooms)
                    setOLdRooms(_OLd_rooms.DirectMessage)
                }
                else {
                    console.log("Can't fetch data")
                }
            })();
    }, [token, currentQuery])

    useEffect(() => {
        setisMounted(true);

    }, [])

    if (!oLdMessages.IsOpen)
        return null
    // console.log("+++currentQuery :", currentQuery)
    return <div className={`flex justify-center   h-full w-full  border border-green-500 overflow-y-scroll 
    ${onLineUser.IsOpen ? ' max-w-full lg:max-w-[320px]' : 'max-w-full md:max-w-[320px]'}

    `}>
        <div className="w-full">
            {OLdrooms.length
                ? OLdrooms.map((item: RoomsType, index) => (
                    <DirectOLdMessagesItem key={index} OnClick={handleClick} isActive={currentQuery === item.id} image={"/avatar.jpg"} data={item} socket={props.socket} />
                ))
                : <div>No contacts</div>
            }

        </div>
    </div>
}

export default DirectOLdMessages