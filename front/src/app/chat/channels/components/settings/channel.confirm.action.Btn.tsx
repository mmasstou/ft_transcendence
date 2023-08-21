import { Socket } from "socket.io-client"
import ChanneLConfirmActionHook from "../../hooks/channel.confirm.action"
import { RoomsType, userType } from "@/types/types";
import { IoLogOut } from "react-icons/io5";
import React from "react";
import getChanneLOwners from "../../actions/getChannelOwner";
import Cookies from "js-cookie";
import FindOneBySLug from "../../actions/Channel/findOneBySlug";
import { toast } from "react-hot-toast";
import { useParams } from "next/navigation";
import LeaveChanneL from "../../actions/LeaveChanneL";

interface ChanneLConfirmActionBtnProps {
    socket: Socket | null;
    data: { userId?: string, roomId?: string } | null
    message: string;
    event: string;
    label: string;
}
export default function ChanneLConfirmActionBtn(
    { socket, data, message, label, event }: ChanneLConfirmActionBtnProps
) {
    const channeLConfirmActionHook = ChanneLConfirmActionHook()
    const [ChanneLinfo, setChanneLinfo] = React.useState<RoomsType | null>(null)
    const [ExecuteAction, setExecuteAction] = React.useState<boolean>(true)
    const token = Cookies.get('token')
    const userId = Cookies.get('_id')
    const query = useParams();
    const slug: string | undefined = typeof query.slug === 'string' ? query.slug : undefined;
    if (!data || !token || !userId) return

    React.useEffect(() => {


        (async () => {
            const CanLeave = await LeaveChanneL(userId, slug, token, event)
            if (CanLeave) setExecuteAction(false)
        })();
    }, [])
    return <button
        onClick={() => {
            channeLConfirmActionHook.onOpen(
                <button
                    onClick={() => {
                        if (ExecuteAction) {
                            socket?.emit(event, data)
                        } else {
                            toast.error('you can\'t leave this channel with out set a Owner because you are the only owner')
                            channeLConfirmActionHook.onClose()
                        }
                        // ExecuteAction ? socket?.emit(event, data) : toast.error('you can\'t leave this channel with out set a Owner because you are the only owner')
                    }}
                    className="text-balck hover:text-danger  border border-secondary bg-secondary text-sm font-bold capitalize px-7 py-3 rounded-[12px]  w-full">
                    confirm
                </button>
                , message
            )
        }}
        className="btn btn-primary flex flex-col w-full bg-[#161f1e54] p-3 justify-center items-center rounded text-white">
        <IoLogOut />
        <span>{label}</span>
    </button>
}