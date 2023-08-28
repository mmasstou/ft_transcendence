import React, { use, useEffect } from "react";
import LefttsideModaL from "../modaLs/LeftsideModal";
import ChanneLSidebarItem from "./channel.sidebar.item";
import { RoomsType, membersType, messagesType, userType } from "@/types/types";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import { Socket } from "socket.io-client";
import RightsideModaL from "../modaLs/RightsideModal";
import getChannelWithId from "../actions/getChannelmembers";
import ChanneLsmembersItem from "./channel.membersItem";
import LeftSidebarHook from "../hooks/LeftSidebarHook";
import RightsidebarHook from "../hooks/RightSidebarHook";
import ChanneLsettingsHook from "../hooks/channel.settings";
import LoginHook from "@/hooks/auth/login";
import getChannels from "../actions/getChanneLs";
import MyToast from "@/components/ui/Toast/MyToast";
import sorteChanneLsWithName from "../actions/sorteChanneLsWithName";
import MemberHasPermissionToAccess from "../actions/MemberHasPermissionToAccess";

export default function ChanneLbody({ children, socket }: { children: React.ReactNode; socket: Socket | null }) {
    const query = useParams();
    const [IsMounted, setIsMounted] = React.useState(false)
    const [ChanneLs, setChannel] = React.useState<RoomsType[] | null>(null)
    const [ChanneLsActiveID, setChanneLsActive] = React.useState<string | null>(null)
    const [ChanneLsmembers, setchanneLsmembers] = React.useState<membersType[] | null>(null)
    const slug: string = query.slug && typeof query.slug === 'string' ? query.slug : query.slug[0];
    const [viewed, setviewed] = React.useState<number>(0)
    const [update, setUpdate] = React.useState<boolean>(false)
    const params = useSearchParams()
    const leftSidebar = LeftSidebarHook()
    const channelsettingsHook = ChanneLsettingsHook()
    const rightsidebar = RightsidebarHook()
    const loginHook = LoginHook()
    const [Notifications, setNotifications] = React.useState<any[]>([])
    const token: any = Cookies.get('token');
    const userId: any = Cookies.get('_id');
    const router = useRouter()

    if (!token || !userId)
        return;





    useEffect(() => {
        setIsMounted(true);
        (async () => {
            const ChanneLs = await getChannels(token)
            if(!ChanneLs) return
            setChannel(ChanneLs);
        })();
    }, [])

    if (!IsMounted)
        return null
    return (
        <div className="channeLbody relative h-full flex ">
            <LefttsideModaL>
                {
                    ChanneLs && ChanneLs.map((room: RoomsType, key) => (
                        <ChanneLSidebarItem key={key} room={room}  viewd={8} active={room.slug === slug} />
                    ))
                }
            </LefttsideModaL>
            <div className={`${(leftSidebar.IsOpen || rightsidebar.IsOpen) && 'hidden md:flex'} w-full`}>
                {children}
            </div>
            <RightsideModaL>
                {
                    ChanneLsmembers && ChanneLsmembers.map((member: membersType, key: number) => (
                        <ChanneLsmembersItem key={key} member={member} />
                    ))
                }
            </RightsideModaL>
        </div>
    )
}