import { IoChevronBackOutline } from "react-icons/io5";
import { Socket } from "socket.io-client";
import Button from "../../components/Button";
import { UserTypeEnum, membersType, updatememberEnum } from "@/types/types";
import ChannelSettingsUserMemberItem from "./channel.settings.user.memberItem";
import Image from "next/image";
import ChanneLSettingsBody from "./channel.settings.body";
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

    socket?.on('updatememberResponseEvent', (data) => {
        setUpdate(true)
    })
    return (
        <ChanneLSettingsBody
            title={"Baned Members"}
            OnBack={OnBack}
            HasPermission={LogedMember?.isban || LogedMember?.type === UserTypeEnum.OWNER || LogedMember?.type === UserTypeEnum.ADMIN}>
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
