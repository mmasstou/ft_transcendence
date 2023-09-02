import { IoChevronBackOutline } from "react-icons/io5";
import { Socket } from "socket.io-client";
import Button from "../../../../components/Button";
import { RoomsType, UserTypeEnum, membersType, updatememberEnum, userType } from "@/types/types";
import ChannelSettingsUserMemberItem from "../User/channel.settings.user.memberItem";
import Image from "next/image";
import ChanneLSettingsBody from "../channel.settings.body";
import React, { useEffect } from "react";
import getUserWithId from "../../../actions/getUserWithId";
import Cookies from "js-cookie";
import ChanneLConfirmActionHook from "../../../hooks/channel.confirm.action";
import ChanneLsettingsProvider from "./channel.settings.chnnel.provider";
import { useParams } from "next/navigation";
import FindOneBySLug from "../../../actions/Channel/findOneBySlug";
import getChannelMembersWithId from "../../../actions/getChannelmembers";
import { toast } from "react-hot-toast";
interface ChanneLUserSettingsProps {
    socket: Socket | null;
    OnBack: () => void;
    LogedMember: membersType | null;
    members: membersType[] | null;
    setUpdate: (data: boolean) => void
}
const UserId: string | undefined = Cookies.get('_id')
const token: string | undefined = Cookies.get('token')

export default function ChanneLSettingsChanneLBanedMember(
    { socket, OnBack, LogedMember, members, setUpdate }: ChanneLUserSettingsProps) {
    const channeLConfirmActionHook = ChanneLConfirmActionHook()
    const query = useParams();
    const slug: string = typeof query.slug === 'string' ? query.slug : query.slug[0];

    const [Members, setMembers] = React.useState<membersType[] | null>(null)

    const handlOnclick = (data: any) => {
        const __message = 'are you sure you won to unban this member';
        __message && channeLConfirmActionHook.onOpen(
            <button
                onClick={() => {
                    socket?.emit(`SOCKET_EVENT_CHAT_MEMBER_UPDATE`, data)
                }}
                className="text-balck hover:text-danger  border border-secondary bg-secondary text-sm font-bold lowercase  px-7 py-3 rounded-[12px]  w-full">
                UnBan
            </button>
            , __message
        )
        socket?.emit('updatemember', data)

    }


    const UpdateData = async () => {
        if (!UserId || !slug || !token) return;
        const channeL: RoomsType | null = await FindOneBySLug(slug, token)
        if (!channeL) return;
        const members: membersType[] | null = await getChannelMembersWithId(channeL.id, token);
        if (!members) return;
        setMembers(members?.filter((member) => member.isban));
    }

    const [User, setUser] = React.useState<userType | null>(null)

    React.useEffect(() => {
        UpdateData();
    }, [])

    React.useEffect(() => {
        if (!Members) return
        if (Members && Members.length === 0) OnBack();
    }, [Members])

    React.useEffect(() => {
        socket?.on(`SOCKET_EVENT_RESPONSE_CHAT_MEMBER_UPDATE`, (data) => {
            if (!data) return
            channeLConfirmActionHook.onClose()
            UpdateData();
        });
        socket?.on(`SOCKET_EVENT_RESPONSE_CHAT_UPDATE`, (data) => {
            if (!data) return
            UpdateData();
        });
    }, [socket])

    return <ChanneLsettingsProvider
        socket={socket}
        label={`Baned Members :${User?.login}`}
        OnBack={OnBack}
    >
        <div className="overflow-y-scroll max-h-[34rem] flex flex-col w-full">
            {Members && Members.map((member, index) => (
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
