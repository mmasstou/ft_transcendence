import React, { use, useEffect } from "react";
import LefttsideModaL from "../modaLs/LeftsideModal";
import ChanneLSidebarItem from "./channel.sidebar.item";
import { RoomsType, membersType, messagesType, userType } from "@/types/types";
import { useSearchParams } from "next/navigation";
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

    socket?.on('notificationEvent', (data) => {
        console.log("notificationEvent data :", data)
        setNotifications([...Notifications, data])
    })

    useEffect(() => {
        const token: any = Cookies.get('token');
        (async () => {
            if (!token)
                return;
            const resp = await getChannels(token)
            if (resp) {

                console.log("getChannels data :", resp)
                setChannel(resp);
            }
            // console.log("resp :", resp)
        }
        )();
        setUpdate(false)

    }, [loginHook, update])


    useEffect(() => {
        socket?.on(`${process.env.NEXT_PUBLIC_SOCKET_EVENT_RESPONSE_CHAT_UPDATE}`, () => {
            setUpdate(update ? false : true)
        })

    }, [socket])
    useEffect(() => {

        if (params) {
            setChanneLsActive(params.get('r'));
            (async () => {
                const channeLLid = params.get('r')
                const token: any = Cookies.get('token');
                if (!channeLLid)
                    return;
                const channeLLMembers = await getChannelWithId(channeLLid, token)
                if (channeLLMembers && channeLLMembers.statusCode !== 200) {
                    setchanneLsmembers(channeLLMembers)
                }

            })();
        }
    }, [params, rightsidebar, channelsettingsHook])

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!IsMounted)
        return null
    return (
        <div className="channeLbody relative h-full flex ">
            {
                Notifications.map((notification: {
                    message: string, User: userType,
                    member: membersType,
                    sendedUser: userType
                }, index) => {
                    return (
                        // <Notification key={index} avatar={notification.sendedUser.avatar} name={notification.sendedUser.login} message={notification.message} />
                        <MyToast
                            key={index}
                            isOpen={true}
                            user={notification.sendedUser.login}
                            message={notification.message} />
                    )
                }
                )
            }
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