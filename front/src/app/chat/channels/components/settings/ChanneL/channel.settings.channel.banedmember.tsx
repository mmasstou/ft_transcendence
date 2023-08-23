import { IoChevronBackOutline } from "react-icons/io5";
import { Socket } from "socket.io-client";
import Button from "../../../../components/Button";
import { UserTypeEnum, membersType, updatememberEnum, userType } from "@/types/types";
import ChannelSettingsUserMemberItem from "../User/channel.settings.user.memberItem";
import Image from "next/image";
import ChanneLSettingsBody from "../channel.settings.body";
import React, { useEffect } from "react";
import getUserWithId from "../../../actions/getUserWithId";
import Cookies from "js-cookie";
import ChanneLConfirmActionHook from "../../../hooks/channel.confirm.action";
import ChanneLsettingsProvider from "./channel.settings.chnnel.provider";
interface ChanneLUserSettingsProps {
    socket: Socket | null;
    OnBack: () => void;
    LogedMember: membersType | null;
    members: membersType[] | null;
    setUpdate: (data: boolean) => void
}


export default function ChanneLSettingsChanneLBanedMember(
    { socket, OnBack, LogedMember, members, setUpdate }: ChanneLUserSettingsProps) {
    const channeLConfirmActionHook = ChanneLConfirmActionHook()
    const handlOnclick = (data: any) => {
        const __message = 'are you sure you won to unban this member';
        __message && channeLConfirmActionHook.onOpen(
            <button
                onClick={() => {
                    socket?.emit(`${process.env.NEXT_PUBLIC_SOCKET_EVENT_CHAT_MEMBER_UPDATE}`, data)
                }}
                className="text-balck hover:text-danger  border border-secondary bg-secondary text-sm font-bold lowercase  px-7 py-3 rounded-[12px]  w-full">
                UnBan
            </button>
            , __message
        )
        socket?.emit('updatemember', data)

    }
    useEffect(() => {

        socket?.on(`${process.env.NEXT_PUBLIC_SOCKET_EVENT_RESPONSE_CHAT_MEMBER_UPDATE}`, (data) => {
            if (!data) return
            channeLConfirmActionHook.onClose()
        })
    }, [socket])

    const [User, setUser] = React.useState<userType | null>(null)

    React.useEffect(() => {
        if (LogedMember) {
            (async () => {
                const token = Cookies.get('token')
                if (!token) return  // if no token found, do nothing
                const res = await getUserWithId(LogedMember.userId, token)
                if (res) setUser(res)

            })();
        }
    })
    socket?.on(`${process.env.NEXT_PUBLIC_SOCKET_EVENT_RESPONSE_CHAT_MEMBER_UPDATE}`, (data) => {
        setUpdate(true)
    })
    return <ChanneLsettingsProvider socket={socket} label={`Baned Members :${User?.login}`} OnBack={OnBack}>
        <div className="overflow-y-scroll max-h-[34rem] flex flex-col w-full">
            {members && members.map((member, index) => (
                <ChannelSettingsUserMemberItem
                    key={index}
                    member={member}
                    socket={socket}
                    UserJoin={false}
                    UserOwne={false}
                    UserBan
                    OnClick={(data) => {
                        console.log("ChanneLSettingsChanneLBanedMember :", data)
                        handlOnclick({ updateType: updatememberEnum.BANMEMBER, member: member })
                    }} />
            ))
            }
        </div>
    </ChanneLsettingsProvider>
}
