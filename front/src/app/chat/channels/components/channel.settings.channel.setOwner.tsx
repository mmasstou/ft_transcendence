import { Socket } from "socket.io-client";
import Button from "../../components/Button";
import { IoChevronBackOutline } from "react-icons/io5";
import { membersType, updatememberEnum } from "@/types/types";
import ChannelSettingsUserMemberItem from "./channel.settings.user.memberItem";
import Image from "next/image";
import ChanneLSettingsBody from "./channel.settings.body";
interface ChanneLsettingsChanneLsetOwnerProps {
    socket: Socket | null;
    OnBack: () => void;
    LogedMember: membersType | null;
    members: membersType[] | null;
    setUpdate: (data: boolean) => void
}

export default function ChanneLsettingsChanneLsetOwner(
    { socket, OnBack, LogedMember, members, setUpdate }: ChanneLsettingsChanneLsetOwnerProps) {
    const handlOnclick = (data: any) => {

        socket?.emit('updatemember', data)

    }

    socket?.on(`${process.env.NEXT_PUBLIC_SOCKET_EVENT_RESPONSE_CHAT_MEMBER_UPDATE}`, (data) => {

        setUpdate(true)
    })
    return (
        <ChanneLSettingsBody title={"set Owner"} OnBack={OnBack}>
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