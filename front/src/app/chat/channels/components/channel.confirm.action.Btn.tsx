import { Socket } from "socket.io-client"
import ChanneLConfirmActionHook from "../hooks/channel.confirm.action"
import { RoomsType, userType } from "@/types/types";
import { IoLogOut } from "react-icons/io5";

interface ChanneLConfirmActionBtnProps { 
    socket: Socket | null ;
    data : {userId?: string, roomId?: string} | null
    message : string;
    event : string;
    label: string;
}
export default function ChanneLConfirmActionBtn(
    {socket, data, message, label, event}: ChanneLConfirmActionBtnProps
) {
    const channeLConfirmActionHook = ChanneLConfirmActionHook()
    if (!data) return
    return <button
        onClick={() => {
            channeLConfirmActionHook.onOpen(
                <button
                    onClick={() => {
                        socket?.emit(event, data)
                    }}
                    className="text-balck hover:text-danger  border border-secondary bg-secondary text-sm font-bold capitalize px-7 py-3 rounded-[12px]  w-full">
                    confirm
                </button>

                // <ChanneLConfirmActionBtn 
                // onClick={() => {
                //     socket?.emit(`${process.env.NEXT_PUBLIC_SOCKET_EVENT_CHAT_MEMBER_LEAVE}`, {
                //         roomId: room.id
                //     },)
                // }} 
                // />
                , message
            )
        }}
        className="btn btn-primary flex flex-col w-full bg-[#161f1e54] p-3 justify-center items-center rounded text-white">
        <IoLogOut />
        <span>{label}</span>
    </button>
}