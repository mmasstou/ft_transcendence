import { Socket } from "socket.io-client";
import Button from "../../components/Button";
import { IoChevronBackOutline } from "react-icons/io5";
import { UserTypeEnum, membersType, updatememberEnum } from "@/types/types";
import ChannelSettingsUserMemberItem from "./settings/User/channel.settings.user.memberItem";
import Image from "next/image";
import ChanneLSettingsBody from "./settings/channel.settings.body";
import ChanneLConfirmActionHook from "../hooks/channel.confirm.action";
import getmessage from "../actions/member.action.message";
import { useEffect } from "react";
interface ChanneLsettingsChanneLsetOwnerProps {
    socket: Socket | null;
    OnBack: () => void;
    LogedMember: membersType | null;
    members: membersType[] | null;
    setUpdate: (data: boolean) => void
}

export default function ChanneLsettingsChanneLsetOwner(
    { socket, OnBack, LogedMember, members, setUpdate }: ChanneLsettingsChanneLsetOwnerProps) {
    const channeLConfirmActionHook = ChanneLConfirmActionHook()

    useEffect(() => {
        socket?.on(`${process.env.NEXT_PUBLIC_SOCKET_EVENT_RESPONSE_CHAT_MEMBER_UPDATE}`, (data) => {
            // const channeLLMembers = __userId && await getMemberWithId(__userId, channeLLid, token)
            // if (channeLLMembers && channeLLMembers.statusCode !== 200) {
            //     setLogedMember(channeLLMembers)
            // }
            channeLConfirmActionHook.onClose()
        })
    }, [socket])
    const handlOnclick = (data: any) => {

        const __message = 'are ypu sure you whon to set this member  as Owner';
        __message && channeLConfirmActionHook.onOpen(
            <button
                onClick={() => {
                    socket?.emit(`${process.env.NEXT_PUBLIC_SOCKET_EVENT_CHAT_MEMBER_UPDATE}`, data)
                }}
                className="text-balck hover:text-danger  border border-secondary bg-secondary text-sm font-bold lowercase  px-7 py-3 rounded-[12px]  w-full">
                {data.updateType === updatememberEnum.SETOWNER
                    && data.member.type === UserTypeEnum.OWNER ? 'remove as Owner' : 'set as admin'
                }
            </button>
            , __message
        )

    }

    socket?.on(`${process.env.NEXT_PUBLIC_SOCKET_EVENT_RESPONSE_CHAT_MEMBER_UPDATE}`, (data) => {

        setUpdate(true)
    })
    return (
        <ChanneLSettingsBody 
        title={"set Owner"} 
        HasPermission={LogedMember?.type !== UserTypeEnum.OWNER}
        OnBack={OnBack}>
            
            <div className="overflow-y-scroll max-h-[34rem] flex flex-col w-full">
                {(LogedMember?.isban === false && (LogedMember?.type === "OWNER")) ?
                    members && members.map((member, index) => (
                        <ChannelSettingsUserMemberItem
                            key={index}
                            member={member}
                            socket={socket}
                            UserJoin={false}
                            UserOwne
                            OnClick={(data) => {
                                handlOnclick({ updateType: updatememberEnum.SETOWNER, member: member })
                            }} />

                    ))
                    : <div className="flex h-full w-full justify-center items-center min-h-[34rem] ">
                        <div className="flex flex-col justify-center items-center gap-3">
                            <Image src="/access_denied.svg" width={200} height={200} alt={""} />
                            <h2 className=" capitalize font-extrabold text-white">permission denied</h2>
                        </div>
                    </div>
                }
            </div>
        </ChanneLSettingsBody>
    )
}