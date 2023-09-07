import { RoomTypeEnum, RoomsType } from "@/types/types";
import Cookies from "js-cookie";
import { useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import ChanneLPasswordAccessHook from "../../../hooks/Channel.Access.Password.hook";

interface ChannelFindRoomItemProps {
    room: RoomsType;
    onClick: (data: { room: RoomsType }) => void
    socket: Socket | null
}
export default function
    ChannelFindRoomItem({ room, onClick, socket }: ChannelFindRoomItemProps) {
    const [joinBtn, setJoinBtn] = useState(false)
    const [passwordInput, setPasswordInput] = useState(false)
    const inputRef = useRef<HTMLInputElement | null>(null);
    const channeLPasswordAccessHook = ChanneLPasswordAccessHook()
    const UserId = Cookies.get('_id')


    useEffect(() => {
        // Focus the input field when the component is rendered
        if (inputRef.current) {
            inputRef.current.focus();

        }
    }, [passwordInput]);

    useEffect(() => {
        setPasswordInput(false)
    }, [joinBtn])


    return <div className={`flex flex-col gap-3 justify-between px-1 items-center w-full`}>
        <div className={`flex flex-row gap-3 justify-between px-1 items-center w-full`}>
            <div className="flex flex-row justify-start gap-3 items-center text-white">
                <span className={` text-2xl `}>#</span>
                <h2 className=" text-lg">{room.name} </h2>
            </div>
            <button
                onClick={() => {
                    setJoinBtn(true)
                    if (room.type === RoomTypeEnum.PROTECTED) {
                        channeLPasswordAccessHook.onOpen(
                            room,
                            socket,
                            `SOCKET_EVENT_JOIN_MEMBER`,
                            { userid: UserId, roomid: room.id },
                            "JOIN")
                    } else {
                        socket?.emit(
                            `SOCKET_EVENT_JOIN_MEMBER`,
                            { userid: UserId, roomid: room.id }
                        )
                    }
                    onClick({ room })
                }}
                className=" text-[#6CCCFE] border rounded-[15px] border-[#6CCCFE] p-1 min-w-[120px]">Join
            </button>
        </div>
    </div>
}