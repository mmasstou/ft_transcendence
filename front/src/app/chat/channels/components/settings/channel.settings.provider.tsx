'use client'
import Button from "@/app/chat/components/Button";
import { RoomsType, UserTypeEnum, membersType } from "@/types/types";
import React from "react";
import { IoChevronBackOutline } from "react-icons/io5";
import { Socket } from "socket.io-client";
import Cookies from "js-cookie";
import { useParams } from "next/navigation";
import { toast } from "react-hot-toast";
import { tr } from "date-fns/locale";
import Loading from "./CanneLSettingsLoading";
import PermissionDenied from "../channel.settings.permissiondenied";
import FindOneBySLug from "../../actions/Channel/findOneBySlug";
import getMemberWithId from "../../actions/getMemberWithId";

interface props {
    children: React.ReactNode;
    socket: Socket | null;
    OnBack?: () => void;
    label?: string;
}
const UserId: string | undefined = Cookies.get('_id')
const token: string | undefined = Cookies.get('token')

export default function SettingsProvider(props: props) {
    const [IsMounted, setMounted] = React.useState<boolean>(false)
    const [LoggedMember, setLoggedMember] = React.useState<membersType | null>(null)
    const [ChanneLinfo, setChanneLinfo] = React.useState<RoomsType | null>(null)
    const [IsLoading, setLoading] = React.useState<boolean>(true)
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
        setTimeout(() => {
            setLoading(false)
        }, 400);
    }
    React.useEffect(() => {

        setMounted(true)
        UpdateData();
        setTimeout(() => {
            setLoading(false)
        }, 400)

    }, [])

    React.useEffect(() => {
        props.socket?.on(`${process.env.NEXT_PUBLIC_SOCKET_EVENT_RESPONSE_CHAT_MEMBER_UPDATE}`, (data) => {
            if (!data) return
            UpdateData();
        });
        props.socket?.on(`${process.env.NEXT_PUBLIC_SOCKET_EVENT_RESPONSE_CHAT_CHANNEL_UPDATE}`, (data) => {
            if (!data) return
            UpdateData();
        });
    }, [props.socket])

    if (!IsMounted) return;
    if (IsLoading) return <Loading />
    return <div className="flex flex-col justify-between max-h-[32rem]">
      
        {props.children}
    </div>
}