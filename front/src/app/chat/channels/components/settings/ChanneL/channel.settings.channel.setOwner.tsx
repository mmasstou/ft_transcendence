import { Socket } from "socket.io-client";
import Button from "../../../../components/Button";
import { IoChevronBackOutline } from "react-icons/io5";
import { RoomsType, UserTypeEnum, membersType, updatememberEnum } from "@/types/types";
import ChannelSettingsUserMemberItem from "../User/channel.settings.user.memberItem";
import Image from "next/image";
import ChanneLSettingsBody from "../channel.settings.body";
import ChanneLConfirmActionHook from "../../../hooks/channel.confirm.action";
import getmessage from "../../../actions/member.action.message";
import { useEffect } from "react";
import ChanneLsettingsProvider from "./channel.settings.chnnel.provider";
import React from "react";
import { useParams } from "next/navigation";
import Cookies from "js-cookie";
import FindOneBySLug from "../../../actions/Channel/findOneBySlug";
import getMemberWithId from "../../../actions/getMemberWithId";
import { toast } from "react-hot-toast";
import getChannelMembersWithId from "../../../actions/getChannelmembers";
interface ChanneLsettingsChanneLsetOwnerProps {
    socket: Socket | null;
    OnBack: () => void;
    LogedMember: membersType | null;
    members: membersType[] | null;
    setUpdate: (data: boolean) => void
}

const UserId: string | undefined = Cookies.get('_id')
const token: string | undefined = Cookies.get('token')
export default function ChanneLsettingsChanneLsetOwner(
    { socket, OnBack, LogedMember, members, setUpdate }: ChanneLsettingsChanneLsetOwnerProps) {
    const [IsMounted, setMounted] = React.useState<boolean>(false)
    const [LoggedMember, setLoggedMember] = React.useState<membersType | null>(null)
    const [Members, setMembers] = React.useState<membersType[] | null>([])
    const [ChanneLinfo, setChanneLinfo] = React.useState<RoomsType | null>(null)
    const channeLConfirmActionHook = ChanneLConfirmActionHook()
    const query = useParams();
    const slug: string = typeof query.slug === 'string' ? query.slug : query.slug[0];

    const UpdateData = async () => {
        if (!UserId || !slug || !token) return;
        const channeL: RoomsType | null = await FindOneBySLug(slug, token)
        if (!channeL) return;
        setChanneLinfo(channeL);
        const member: membersType | null = await getMemberWithId(UserId, channeL.id, token)
        if (!member) return;
        setLoggedMember(member);
        const members: membersType[] | null = await getChannelMembersWithId(channeL.id, token);
        if (!members) return;
        setMembers(members?.filter((member) => member.userId !== UserId && !member.isban));
    }

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

    React.useEffect(() => {
        socket?.on(`${process.env.NEXT_PUBLIC_SOCKET_EVENT_RESPONSE_CHAT_MEMBER_UPDATE}`, (data) => {
            if (!data) return
            UpdateData();
            channeLConfirmActionHook.onClose()
        });
        socket?.on(`${process.env.NEXT_PUBLIC_SOCKET_EVENT_RESPONSE_CHAT_CHANNEL_UPDATE}`, (data) => {
            if (!data) return
            UpdateData();
        });
    }, [socket])


    React.useEffect(() => {
        if (!UserId || !slug || !token) return;
        (async () => {
            const channeL: RoomsType | null = await FindOneBySLug(slug, token)
            if (!channeL) return;
            setChanneLinfo(channeL);
        })();
        if (!members) return
        setMembers(members?.filter((member) => !member.isban))
        setLoggedMember(LogedMember)

    }, [])

    return <ChanneLsettingsProvider socket={socket} label={`set Owner`} OnBack={OnBack}>
        <div className="overflow-y-scroll max-h-[34rem] flex flex-col w-full">
            {Members && Members.map((member, index) => (
                <ChannelSettingsUserMemberItem
                    key={index}
                    member={member}
                    socket={socket}
                    UserJoin={false}
                    UserOwne
                    OnClick={(data) => {
                        handlOnclick({ updateType: updatememberEnum.SETOWNER, member: member })
                    }} />))
            }
        </div>
    </ChanneLsettingsProvider>

}