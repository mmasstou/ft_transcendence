import { IoChevronBackOutline } from "react-icons/io5";
import { Socket } from "socket.io-client";
import Button from "../../components/Button";
import { UserTypeEnum, membersType, updatememberEnum, userType } from "@/types/types";
import ChannelSettingsUserMemberItem from "./channel.settings.user.memberItem";
import Image from "next/image";
import ChanneLSettingsBody from "./channel.settings.body";
import React from "react";
import getUserWithId from "../actions/getUserWithId";
import Cookies from "js-cookie";
interface ChanneLUserSettingsProps {
    socket: Socket | null;
    OnBack: () => void;
    LogedMember: membersType | null;
    members: membersType[] | null;
    setUpdate: (data: boolean) => void
}


export default function ChanneLSettingsChanneLBanedMember(
    { socket, OnBack, LogedMember, members, setUpdate }: ChanneLUserSettingsProps) {
    const handlOnclick = (data: any) => {
        socket?.emit('updatemember', data)

    }

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
    return (
        <ChanneLSettingsBody
            title={`Baned Members Memeber :${User?.login}`}
            OnBack={OnBack}
            HasPermission={LogedMember?.type === UserTypeEnum.OWNER || LogedMember?.type === UserTypeEnum.ADMIN}>
            <div className="overflow-y-scroll max-h-[34rem] flex flex-col w-full">
                {members && members.map((member, index) => (
                    <ChannelSettingsUserMemberItem
                        key={index}
                        member={member}
                        socket={socket}
                        UserJoin={false}
                        UserOwne={false}
                        OnClick={(data) => {
                            handlOnclick({ updateType: updatememberEnum.BANMEMBER, member: member })
                        }} />
                ))
                }
            </div>
        </ChanneLSettingsBody>
    )
}
