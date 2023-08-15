import React, { use, useEffect } from "react";
import LefttsideModaL from "../modaLs/LeftsideModal";
import ChanneLSidebarItem from "./channel.sidebar.item";
import { RoomsType, membersType, messagesType, userType } from "@/types/types";
import { useRouter, useSearchParams } from "next/navigation";
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
    const [IsMounted, setIsMounted] = React.useState(false)
    const [ChanneLs, setChannel] = React.useState<RoomsType[] | null>(null)
    const [ChanneLsActiveID, setChanneLsActive] = React.useState<string | null>(null)
    const [ChanneLsmembers, setchanneLsmembers] = React.useState<membersType[] | null>(null)
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



    socket?.on('notificationEvent', (data) => {
        console.log("notificationEvent data :", data)
        setNotifications([...Notifications, data])
    })

    useEffect(() => {
        (async () => {
            const resp: RoomsType[] | null = await getChannels(token)
            if (!resp) return;
            setChannel(sorteChanneLsWithName(resp));
        }
        )();
    }, [loginHook])


    useEffect(() => {
        // global socket event response :
        socket?.on(
            `${process.env.NEXT_PUBLIC_SOCKET_EVENT_RESPONSE_CHAT_UPDATE}`,
            (data: {
                message: string,
                status: any,
                data: RoomsType,
            }) => {
                if (data.data) {
                    (async () => {
                        const resp: RoomsType[] | null = await getChannels(token)
                        if (resp) {
                            setChannel(sorteChanneLsWithName(resp));
                        }
                        if (!ChanneLsActiveID) return;
                        const hptaresponse = await MemberHasPermissionToAccess(token, ChanneLsActiveID, userId)
                        if (!hptaresponse) router.push('/chat/channels')
                        const channeLLMembers = await getChannelWithId(ChanneLsActiveID, token)
                        if (channeLLMembers){
                             setchanneLsmembers(channeLLMembers)
                             router.refresh();
                            }
                    }
                    )();
                    return
                }
            }
        );
        // listen to chat response update member event :
        socket?.on(
            `${process.env.NEXT_PUBLIC_SOCKET_EVENT_RESPONSE_CHAT_MEMBER_UPDATE}`,
            (data: {
                message: string,
                status: any,
                data: RoomsType,
            }) => {
                if (data.data) {
                    (async () => {
                        if (!ChanneLsActiveID) return;
                        const channeLLMembers = await getChannelWithId(ChanneLsActiveID, token)
                        if (channeLLMembers) {
                            setchanneLsmembers(channeLLMembers)
                        }
                    }
                    )();
                    return
                }
            }
        );
        socket?.on(
            `${process.env.NEXT_PUBLIC_SOCKET_EVENT_RESPONSE_CHAT_MEMBER_KICK}`,
            (data: {
                message: string,
                status: any,
                data: RoomsType,
            }) => {
                if (data.data) {
                    (async () => {
                        const resp: RoomsType[] | null = await getChannels(token)
                        if (resp) {
                            setChannel(sorteChanneLsWithName(resp));
                        }
                    }
                    )();
                    return
                }
            }
        );

    }, [socket])

    useEffect(() => {
        if (ChanneLsActiveID) {
            (async () => {
                const channeLLMembers = await getChannelWithId(ChanneLsActiveID, token)
                if (channeLLMembers) {
                    setchanneLsmembers(channeLLMembers)
                }

            })();
        }
    }, [ChanneLsActiveID, rightsidebar, channelsettingsHook])


    useEffect(() => {
        const channeLid = params.get('r')
        if (channeLid) {
            setChanneLsActive(channeLid);
        }
    }, [params])


    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!IsMounted)
        return null
    return (
        <div className="channeLbody relative h-full flex ">
            <LefttsideModaL>
                {
                    ChanneLs && ChanneLs.map((room: RoomsType, key) => (
                        <ChanneLSidebarItem key={key} room={room} socket={socket} viewd={8} active={room.id === ChanneLsActiveID} />
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