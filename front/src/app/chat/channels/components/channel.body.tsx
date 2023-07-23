import React, { use, useEffect } from "react";
import LefttsideModaL from "../modaLs/LeftsideModal";
import ChanneLSidebarItem from "./channel.sidebar.item";
import { RoomsType, membersType, messagesType } from "@/types/types";
import { useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import getChannels from "@/actions/channels/getChanneLs";
import { Socket } from "socket.io-client";
import RightsideModaL from "../modaLs/RightsideModal";
import getChannelWithId from "../actions/getChannelmembers";
import ChanneLsmembersItem from "./channel.membersItem";

export default function ChanneLbody({ children, socket }: { children: React.ReactNode; socket: Socket | null }) {
    const [IsMounted, setIsMounted] = React.useState(false)
    const [ChanneLs, setChannel] = React.useState<RoomsType[] | null>(null)
    const [ChanneLsActiveID, setChanneLsActive] = React.useState<string | null>(null)
    const [ChanneLsmembers, setchanneLsmembers] = React.useState<membersType[] | null>(null)
    const [viewed, setviewed] = React.useState<number>(0)
    const params = useSearchParams()
    // console.log("ChannelBody socket :", socket?.id )


    useEffect(() => {
        const token: any = Cookies.get('token');


        (async () => {
            if (!token)
                return;
            const resp = await getChannels(token)
            if (resp && resp.ok) {
                const data = await resp.json()
                console.log("getChannels data :", data)
                setChannel(data.Rooms);
            }
            // console.log("resp :", resp)
        }
        )();
    }, [])

    useEffect(() => {
        if (params) {
            setChanneLsActive(params.get('r'));
            (async () => {
                const channeLLid = params.get('r')
                const token: any = Cookies.get('token');
                if (!channeLLid)
                    return;
                const channeLLMembers = await getChannelWithId(channeLLid, token)
                if (channeLLMembers && channeLLMembers.statusCode !== 200){
                    setchanneLsmembers(channeLLMembers)
                } 

            })();
        }
    }, [params])

    // const LeftsideContent = ChanneLs && ChanneLs.map((room: RoomsType, key) => (
    //     <ChanneLSidebarItem key={key} room={room} socket={socket} viewd={8} active={room.id === ChanneLsActiveID} />
    // ))

    // const RightsideContent = ChanneLsmembers && ChanneLsmembers.map((member: membersType, key: number) => (
    //     <ChanneLsmembersItem key={key} member={member} />
    // ))
    console.log("ChanneLsmembers :", ChanneLsmembers)


    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!IsMounted)
        return null
    return (
        <div className="channeLbody h-[90vh] md:h-[94vh] border border-green-600 flex ">
            <LefttsideModaL>
                {
                    ChanneLs && ChanneLs.map((room: RoomsType, key) => (
                        <ChanneLSidebarItem key={key} room={room} socket={socket} viewd={8} active={room.id === ChanneLsActiveID} />
                    ))
                }
            </LefttsideModaL>
            {children}
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