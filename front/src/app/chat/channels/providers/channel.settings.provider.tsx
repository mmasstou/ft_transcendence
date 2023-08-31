'use client'
import { RoomsType, membersType } from "@/types/types";
import Cookies from "js-cookie";
import { useParams } from "next/navigation";
import React, { createContext } from "react";
import { Socket } from "socket.io-client";
import FindOneBySLug from "../actions/Channel/findOneBySlug";
import getMemberWithId from "../actions/getMemberWithId";
import Loading from "../components/loading";
import { ChanneLContext } from "./channel.provider";
export const ChanneLsettingsContext = createContext({});
interface props {
    children: React.ReactNode;
    socket?: Socket | null;
    OnBack?: () => void;
    label?: string;
    channeLId?: string;
}
const UserId: string | undefined = Cookies.get('_id')
const token: string | undefined = Cookies.get('token')

export default function SettingsProvider({ children }: { children: React.ReactNode }) {
    const [IsMounted, setMounted] = React.useState<boolean>(false)
    const [LoggedMember, setLoggedMember] = React.useState<membersType | null>(null)
    const [socket, setSocket] = React.useState<Socket | null>(null)
    const [ChanneLinfo, setChanneLinfo] = React.useState<RoomsType | null>(null)
    const [IsLoading, setLoading] = React.useState<boolean>(true)
    const query = useParams();
    const slug: string | undefined = typeof query.slug === 'string' ? query.slug : undefined;
    // create channel conetxt :
    const ChanneLContextee: any = React.useContext(ChanneLContext)

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
        setSocket(ChanneLContextee.socket)
        setTimeout(() => {
            setLoading(false)
        }, 400)

    }, [])

    React.useEffect(() => {
        socket?.on(`${process.env.NEXT_PUBLIC_SOCKET_EVENT_RESPONSE_CHAT_MEMBER_UPDATE}`, (data) => {
            if (!data) return
            UpdateData();
        });
        socket?.on(`${process.env.NEXT_PUBLIC_SOCKET_EVENT_RESPONSE_CHAT_UPDATE}`, (data) => {
            if (!data) return
            UpdateData();
        });
    }, [socket])

    if (!IsMounted) return;
    if (!ChanneLinfo || !LoggedMember || IsLoading) return <Loading message="Loading settings ..." />
    return <div className="flex flex-col justify-between max-h-[32rem]">
        <ChanneLsettingsContext.Provider value={{ channeL: ChanneLinfo, member: LoggedMember, socket: socket }}>
            {children}
        </ChanneLsettingsContext.Provider>
    </div>
}