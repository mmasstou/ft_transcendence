'use client'
import Button from "@/app/chat/components/Button";
import { RoomsType, UserTypeEnum, membersType } from "@/types/types";
import React from "react";
import { IoChevronBackOutline } from "react-icons/io5";
import { Socket } from "socket.io-client";
import getMemberWithId from "../../../actions/getMemberWithId";
import Cookies from "js-cookie";
import FindOneBySLug from "../../../actions/Channel/findOneBySlug";
import { useParams } from "next/navigation";
import PermissionDenied from "../../channel.settings.permissiondenied";
import { toast } from "react-hot-toast";
import { tr } from "date-fns/locale";
import Settings from "@/components/Dashboard/Header/Settings";
import SettingsProvider from "../../../providers/channel.settings.provider";
import Loading from "../../loading";

interface props {
    children: React.ReactNode;
    socket: Socket | null;
    OnBack?: () => void;
    label?: string;
}
const UserId: string | undefined = Cookies.get('_id')
const token: string | undefined = Cookies.get('token')

export default function ChanneLsettingsProvider(props: props) {
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
    return <SettingsProvider socket={null}>
        {LoggedMember?.type === UserTypeEnum.OWNER
            ? <div className="flex flex-col justify-start">
                <div className=" flex flex-row items-center justify-start gap-3">
                    {props.OnBack && <Button
                        icon={IoChevronBackOutline}
                        outline
                        size={21}
                        labelsize={8}
                        onClick={props.OnBack}
                    />}
                    {props.label && <h3 className="capitalize text-md text-[#FFFFFF] font-semibold"> {props.label} </h3>}
                </div>
                <div className="overflow-y-scroll max-h-[38rem] flex flex-col w-full">
                    <div className="flex flex-col h-full w-full justify-start gap-6 items-center p-4">
                        {props.children}
                    </div>
                </div>
            </div>
            : <PermissionDenied />}
    </SettingsProvider>
}