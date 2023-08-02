import ChanneLFindRoommodaLHook from "../hooks/channel.find.room.hook"
import { use, useEffect, useState } from "react"
import { RoomsType } from "@/types/types"
import Cookies from "js-cookie"
import ChanneLModal from "./channel.modal"
import ChannelFindRoomItem from "../components/channel.find.roomItem"
import getPublicProtactedChannels from "../actions/getPublicProtactedChannels"
import Image from "next/image"
import { sync } from "framer-motion"

export default function ChanneLFindRoommodaL() {
    const { IsOpen, onClose, onOpen, socket } = ChanneLFindRoommodaLHook()
    const [rooms, setrooms] = useState<RoomsType[] | null>(null)
    const [roomsFiltered, setroomsFiltered] = useState<RoomsType[] | null>(null)
    const [InputValue, setInputValue] = useState("")
    const UserId = Cookies.get("_id")
    useEffect(() => {
        (async () => {
            const token: any = Cookies.get('token');
            if (!token) return
            const response = await getPublicProtactedChannels(token)
            if (!response) return
            console.log("response :", response)
            setrooms(response)
        })();
    }, [])

    useEffect(() => {
        if (!rooms) return
        if (!InputValue) return setroomsFiltered(null)
        setroomsFiltered(rooms.filter((room: RoomsType) => room.name.toLowerCase().includes(InputValue.toLowerCase())))
    }, [InputValue])

    const bodyContent = (
        <div className="  w-full p-4 md:p-6 flex flex-col justify-between min-h-[34rem]">

            <div className="body flex flex-col gap-4">

                <div className="body flex flex-col gap-2 py-4">
                    <input
                        className="p-3 focus:outline-none rounded-[15px] bg-transparent border border-[#fdfdfd] text-[#ffffff] placeholder:text-white"
                        onSubmit={(event: any) => { }
                        }
                        onKeyDown={(event) => { }}
                        onChange={(event) => {
                            setInputValue(event.target.value);
                        }}
                        placeholder="Type the name of channel"
                        type="search"
                        name=""
                        id="" />
                </div>
                <div className="flex flex-col gap-3 max-h-[50vh] overflow-y-scroll justify-center items-center">

                    {
                        roomsFiltered ? roomsFiltered.map((room: RoomsType, index: number) => {
                            return <ChannelFindRoomItem key={index} room={room} onClick={(room: RoomsType) => { 
                                socket?.emit("sendNotification", {userId : UserId, room : room})
                                console.log("selected room :", room.name) 
                            }} />
                        }
                        )
                            : <Image src="/searching.svg" alt={"searching"} height={230} width={230} />
                    }
                </div>
            </div>

        </div>
    )
    return <ChanneLModal IsOpen={IsOpen} title={"find channel"} children={bodyContent} onClose={onClose} />

}