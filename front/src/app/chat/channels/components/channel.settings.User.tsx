import React from "react";
import ChannelSettingsUserMemberItem from "./channel.settings.user.memberItem";
import { membersType } from "@/types/types";
import ChanneLsettingsHook from "../hooks/channel.settings";
import Cookies from "js-cookie";
import { useSearchParams } from "next/navigation";
import getChannelMembersWithId from "../actions/getChannelmembers";
import { Socket } from "socket.io-client";


interface ChanneLUserSettingsProps {
    socket : Socket | null
}
export default function ChanneLUserSettings( {socket} : ChanneLUserSettingsProps) {

    const [IsMounted, setIsMounted] = React.useState(false)
    const [members, setMembers] = React.useState<membersType[] | null>(null)
    const [update, setUpdate] = React.useState<boolean>(false)
    const channeLsettingsHook = ChanneLsettingsHook()
    const params = useSearchParams()
    const channeLLid = params.get('r')

    React.useEffect(() => { setIsMounted(true) }, [])


    React.useEffect(() => {

        (async () => {
            const channeLLid = params.get('r')
            const token: any = Cookies.get('token');
            if (!channeLLid)
                return;
            const channeLLMembers = await getChannelMembersWithId(channeLLid, token)
            if (channeLLMembers && channeLLMembers.statusCode !== 200){
                console.log("channeLLMembers :", channeLLMembers)
                setMembers(channeLLMembers)
            } 

        })();
        setUpdate(false)
    }, [update])

    const handlOnclick = (data: any) => {
        console.log("handlOnclick :", data)
        socket?.emit('updatemember', data)
       
    }

    socket?.on('updatememberResponseEvent', (data) => {
        console.log("updatememberResponseEvent :", data)
        console.log("updatememberResponseEvent :", members)
        setUpdate(true)
    })

    if (!IsMounted)
        return <div className="Members flex p-4">
            <div className="flex flex-row items-center p-1 gap-1">
                <h3 className="text-base font-light text-[#FFFFFF]">Loading...</h3>
            </div>
        </div>

    return <div className="Members flex p-4 mt-3 sm:mt-0 sm:p-1 flex-col items-start gap-3 overflow-y-scroll max-h-[28rem]">
        {
            members && members.map((member, index) => (
                <ChannelSettingsUserMemberItem 
                key={index} 
                member={member} 
                socket={socket}  
                OnClick={(data) => {
                    console.log("OnClick :", data)
                    handlOnclick(data)
                }} />

            ))
        }
    </div>
}