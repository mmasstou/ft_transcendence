'use client'
import ChanneLFindRoommodaLHook from "../hooks/channel.find.room.hook"
import { useEffect, useRef, useState } from "react"
import { RoomTypeEnum, RoomsType } from "@/types/types"
import Cookies from "js-cookie"
import ChanneLModal from "./channel.modal"
import ChannelFindRoomItem from "../components/channel.find.roomItem"
import getPublicProtactedChannels from "../actions/getPublicProtactedChannels"
import Image from "next/image"
import { toast } from "react-hot-toast"
import { useRouter } from "next/navigation"
import { env } from "process"

export default function ChanneLFindRoommodaL() {
    const { IsOpen, onClose, onOpen, socket } = ChanneLFindRoommodaLHook()
    const [rooms, setrooms] = useState<RoomsType[] | null>(null)
    const [roomsFiltered, setroomsFiltered] = useState<RoomsType[] | null>(null)
    const [InputValue, setInputValue] = useState("")
    const [Update, setUpdate] = useState<boolean>(false)
    const searchInputRef = useRef<HTMLInputElement | null>(null);
    const UserId = Cookies.get("_id")
    const route = useRouter()

    const token: any = Cookies.get('token');
    if (!token || !UserId) return

    useEffect(() => {
        if (searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [])
    useEffect(() => {
        if (!rooms) return
        if (!InputValue) return setroomsFiltered(null)
        setroomsFiltered(
            rooms.filter((room: RoomsType) => {
                return room.name.toLowerCase().includes(InputValue.toLowerCase())
            }))
    }, [InputValue, rooms])

    const OnJion = (param: { room: RoomsType }) => {
        // check if room is protacted :
        const { room } = param
        if (room.type === RoomTypeEnum.PROTECTED) return
        // channel is public
        socket?.emit(
            `${process.env.NEXT_PUBLIC_SOCKET_EVENT_JOIN_MEMBER}`,
            { userid: UserId, roomid: room.id })
    }

    // listen to socket event :
    useEffect(() => { }, [socket])

    const bodyContent = (
        <div className="  w-full p-4 md:p-6 flex flex-col justify-between min-h-[34rem]">

            <div className="body flex flex-col gap-4">

                <div className="body flex flex-col gap-2 py-4">
                    <input
                        ref={searchInputRef}
                        className="p-3 focus:outline-none rounded-[15px] bg-transparent border border-[#fdfdfd] text-[#ffffff] placeholder:text-white"
                        onChange={(event) => { setInputValue(event.target.value); }}
                        placeholder="Type the name of channel"
                        type="search"
                        name=""
                        id="" />
                </div>
                <div className="flex flex-col gap-3 max-h-[50vh] overflow-y-scroll justify-center items-center">
                    {
                        roomsFiltered && roomsFiltered.length
                            ? roomsFiltered.map((room: RoomsType, index: number) => {
                                return <ChannelFindRoomItem
                                    key={index}
                                    room={room}
                                    socket={socket}
                                    onClick={(param: { room: RoomsType }) => {
                                        const { room } = param
                                        OnJion({ room })
                                    }} />
                            })
                            : <Image src="/searching.svg" alt={"searching"} height={230} width={230} />
                    }
                </div>
            </div>

        </div>
    )
    return <ChanneLModal IsOpen={IsOpen} title={"find channel"} children={bodyContent} onClose={onClose} />

}