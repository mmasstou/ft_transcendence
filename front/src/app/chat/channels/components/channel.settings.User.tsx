import React from "react";
import ChannelSettingsUserMemberItem from "./channel.settings.user.memberItem";
import { membersType } from "@/types/types";
import ChanneLsettingsHook from "../hooks/channel.settings";
import Cookies from "js-cookie";
import { useSearchParams } from "next/navigation";
import getChannelMembersWithId from "../actions/getChannelmembers";
import { Socket } from "socket.io-client";
import getUserWithId from "../actions/getUserWithId";
import getMemberWithId from "../actions/getMemberWithId";
import Image from "next/image";
import ChanneLUserSettingsModaL from "../modaLs/channel.user.settings.modal";


interface ChanneLUserSettingsProps {
    socket: Socket | null
}

enum USERSETTINGSTEPS {
    INDEX = 0,
    USERINFO = 1,
}

export default function ChanneLUserSettings({ socket }: ChanneLUserSettingsProps) {

    const [IsMounted, setIsMounted] = React.useState(false)
    const [members, setMembers] = React.useState<membersType[] | null>(null)
    const [LogedMember, setLogedMember] = React.useState<membersType | null>(null)
    const [step, setStep] = React.useState<USERSETTINGSTEPS>(USERSETTINGSTEPS.INDEX)
    const [update, setUpdate] = React.useState<boolean>(false)
    const channeLsettingsHook = ChanneLsettingsHook()
    const params = useSearchParams()
    const channeLLid = params.get('r')
    const __userId = Cookies.get('_id')

    React.useEffect(() => { setIsMounted(true) }, [])


    React.useEffect(() => {

        (async () => {
            const channeLLid = params.get('r')
            const token: any = Cookies.get('token');
            if (!channeLLid)
                return;
            const channeLLMembers = await getChannelMembersWithId(channeLLid, token)
            if (channeLLMembers && channeLLMembers.statusCode !== 200) {
                console.log("channeLLMembers :", channeLLMembers)
                // const __filterMembers = channeLLMembers.filter((member: membersType) => member.userId !== __userId)
                setMembers(channeLLMembers)
            }

        })();
        setUpdate(false);

        (async () => {
            const token: any = Cookies.get('token');
            // get loged member :
            const channeLLid = params.get('r')
            if (!channeLLid)
                return;
            const channeLLMembers = __userId && await getMemberWithId(__userId, channeLLid, token)
            if (channeLLMembers && channeLLMembers.statusCode !== 200) {
                setLogedMember(channeLLMembers)
            }
        })();
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

    let bodyContent = (
       <>
        {(LogedMember?.type === "ADMIN" || LogedMember?.type === "OWNER") ?
            members && members.map((member, index) => (
                <ChannelSettingsUserMemberItem
                    key={index}
                    member={member}
                    socket={socket}
                    OnClick={(data) => {
                        console.log("OnClick :", data)
                        handlOnclick(data)
                        setStep(USERSETTINGSTEPS.USERINFO)
                    }} />

            ))
            : <div className="flex h-full w-full justify-center items-center min-h-[34rem] ">
                <div className="flex flex-col justify-center items-center gap-3">
                    <Image src="/access_denied.svg" width={200} height={200} alt={""} />
                    <h2 className=" capitalize font-extrabold text-white">permission denied</h2>
                </div>
            </div>
        }
       </>
    )
    if (step === USERSETTINGSTEPS.USERINFO) {
        bodyContent = (
            <div>
                <h1>USERINFO</h1>
                <button onClick={() => {
                    setStep(USERSETTINGSTEPS.INDEX)
                }}>back</button>
            </div>
        )
    }

return <ChanneLUserSettingsModaL>
    {bodyContent}
</ChanneLUserSettingsModaL>
}