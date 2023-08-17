'use client'
import ChanneLFindRoommodaLHook from "../hooks/channel.find.room.hook"
import { useEffect, useRef, useState } from "react"
import { RoomsType } from "@/types/types"
import Cookies from "js-cookie"
import ChanneLModal from "./channel.modal"
import ChannelFindRoomItem from "../components/channel.find.roomItem"
import getPublicProtactedChannels from "../actions/getPublicProtactedChannels"
import { useRouter } from "next/navigation"
import { RiSearchLine } from "react-icons/ri"
import Loading from "../components/CanneLSettingsLoading"
import React from "react"

export default function ChanneLFindRoommodaL() {
    const { IsOpen, onClose, onOpen, socket } = ChanneLFindRoommodaLHook()
    const [InputValue, setInputValue] = useState("")
    const searchInputRef = useRef<HTMLInputElement | null>(null);
    const [IsLoading, setIsLoading] = useState(false)
    const [isInputFocused, setIsInputFocused] = useState(false);
    const [ChanneLs, setChanneLs] = React.useState<RoomsType[] | null | undefined>(null)
    const UserId = Cookies.get("_id")
    const token: any = Cookies.get('token');
    if (!token || !UserId) return

    useEffect(() => {
        if (IsOpen) {
            if (searchInputRef.current) {
                searchInputRef.current.focus();
            }
        }
    }, [IsOpen])

    // get data from backend :
    React.useEffect(() => {
        (async () => {
            if (InputValue.length === 0) return;
            const ChanneLs: RoomsType[] | null = await getPublicProtactedChannels(token)
            if (!ChanneLs) return setChanneLs(null);
            const ChanneLsFilter: RoomsType[] = ChanneLs.filter((channL) => channL.name.includes(InputValue))
            setChanneLs(ChanneLsFilter.length === 0 ? null : ChanneLsFilter)
        })();
    }, [InputValue])

    React.useEffect(() => {
        if (ChanneLs) setIsLoading(false)
    }, [ChanneLs])


    React.useEffect(() => {
        if (isInputFocused && InputValue.length === 0) {
            setIsLoading(true)
            return
        }
        if (!isInputFocused && InputValue.length === 0 && !ChanneLs) {
            setIsLoading(false)
            setChanneLs(null)
            return
        }
        setIsLoading(false)
    }, [isInputFocused, InputValue])


    const bodyContent = (
        <div className=" w-full p-2 md:p-6 pt-0 md:pt-0 flex flex-col min-h-[40rem] h-full">
            <div className="body flex flex-col gap-6">
                <div className="body flex flex-row justify-center items-center gap-2 p-2 w-full rounded-[4px] bg-[#161F1E]">
                    <RiSearchLine size={28} fill="#b6b6b6" />
                    <input
                        ref={searchInputRef}
                        onFocus={() => setIsInputFocused(true)}
                        onBlur={() => setIsInputFocused(false)}
                        className="py-1 w-full focus:outline-none  bg-transparent text-[#ffffff] placeholder:text-[#b6b6b6] placeholder:text-xs text-[16px] placeholder:font-thin"
                        onChange={(event) => { setInputValue(event.target.value); }}
                        placeholder="Type the name of channel"
                        type="search"
                        name=""
                        id="" />
                </div>
                {IsLoading ? <Loading /> : <div className="flex flex-col gap-3 max-h-[50vh] overflow-y-scroll justify-center items-center">
                    {ChanneLs
                        ? ChanneLs.map((room: RoomsType, index: number) => {
                            return <ChannelFindRoomItem
                                key={index}
                                room={room}
                                socket={socket}
                                onClick={(param: { room: RoomsType }) => {
                                    const { room } = param
                                }} />
                        })
                        : <h2 className=" capitalize">not found</h2>
                    }
                </div>}
            </div>
        </div>
    )
    return <ChanneLModal IsOpen={IsOpen} title={`Find channel`} children={bodyContent} onClose={onClose} />

}