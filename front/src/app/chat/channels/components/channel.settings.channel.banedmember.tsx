import { IoChevronBackOutline } from "react-icons/io5";
import { Socket } from "socket.io-client";
import Button from "../../components/Button";
import { membersType, updatememberEnum } from "@/types/types";
import ChannelSettingsUserMemberItem from "./channel.settings.user.memberItem";
import Image from "next/image";
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
    //    console.log("handlOnclick :", data)
        socket?.emit('updatemember', data)

    }

    socket?.on('updatememberResponseEvent', (data) => {
    //    console.log("updatememberResponseEvent :", data)
    //    console.log("updatememberResponseEvent :", members)
        setUpdate(true)
    })
    return (
        <div className="flex flex-col justify-between min-h-[34rem]">
            <div>
                <Button
                    icon={IoChevronBackOutline}
                    label={"Back"}
                    outline
                    onClick={OnBack}
                />

                <div className="overflow-y-scroll max-h-[34rem] flex flex-col w-full">
                    {(LogedMember?.isban === false && (LogedMember?.type === "OWNER" || LogedMember?.type === "ADMIN")) ?
                        members && members.map((member, index) => (
                            <ChannelSettingsUserMemberItem
                                key={index}
                                member={member}
                                socket={socket}
                                UserJoin={false}
                                UserOwne={false}
                                OnClick={(data) => {
                                //    console.log("OnClick :", data)
                                    handlOnclick({ updateType: updatememberEnum.BANMEMBER, member: member })
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
            </div>
        </div>
    )
}
