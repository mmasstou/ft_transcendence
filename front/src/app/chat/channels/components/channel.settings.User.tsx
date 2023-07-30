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
import Button from "../../components/Button";
import { TbUserPlus } from "react-icons/tb";
import ChanneLSettingsMemberJoinModaL from "../modaLs/channel.settings.member.join.modal";
import { IoChevronBackOutline } from "react-icons/io5";
import { PiPassword } from "react-icons/pi";
import { BsArrowRightShort } from "react-icons/bs";
import { MdOutlineScoreboard } from "react-icons/md";
import { TfiTimer } from "react-icons/tfi";
import { channel } from "diagnostics_channel";

interface ChanneLUserSettingsProps {
    socket: Socket | null
}

enum USERSETTINGSTEPS {
    INDEX = 0,
    PLAYGAME = 1,
    MEMBERJOIN = 2,
}

export default function ChanneLUserSettings({ socket }: ChanneLUserSettingsProps) {

    const [IsMounted, setIsMounted] = React.useState(false)
    const [members, setMembers] = React.useState<membersType[] | null>(null)
    const [LogedMember, setLogedMember] = React.useState<membersType | null>(null)
    const [step, setStep] = React.useState<USERSETTINGSTEPS>(USERSETTINGSTEPS.INDEX)
    const [PlayGameWith, setPlayGameWith] = React.useState<membersType | null>(null)
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
                // filter if member is ban or member userId === loged userId
                const filterdmembers = channeLLMembers.filter((member: membersType) => member.isban !== true)
                setMembers(filterdmembers.filter((member: membersType) => member.userId !== __userId))
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
            <div className="flex flex-row justify-center items-center gap-2">
                <Button
                    icon={TbUserPlus}
                    label={"Add member"}
                    outline
                    size={21}
                    labelsize={8}
                    onClick={() => {
                        setStep(USERSETTINGSTEPS.MEMBERJOIN)
                    }}
                />
            </div>




            <div className="overflow-y-scroll max-h-[34rem] flex flex-col w-full">
                {(LogedMember?.type === "ADMIN" || LogedMember?.type === "OWNER") ?
                    members && members.map((member, index) => (
                        <ChannelSettingsUserMemberItem
                            key={index}
                            member={member}
                            socket={socket}
                            UserJoin={false}
                            UserOwne={false}
                            OnClick={(data) => {
                                console.log("OnClick :", data)
                                if (data.updateType === "PLAYGAME") {
                                    setStep(USERSETTINGSTEPS.PLAYGAME)
                                    setPlayGameWith(data.member)
                                    return;
                                }
                                handlOnclick(data)
                            }} />

                    ))
                    : <div className="flex h-full w-full justify-center items-center min-h-[34rem] ">
                        <div className="flex flex-col justify-center items-center gap-3">
                            <Image src="/access_denied.svg" width={200} height={200} alt={""} />
                            <h2 className=" capitalize font-extrabold text-white">permission denied</h2>
                        </div>
                    </div>
                }
            </div>

        </>
    )
    if (step === USERSETTINGSTEPS.PLAYGAME) {
        bodyContent = (
            <>
                <div className="flex flex-row justify-center items-center gap-2">
                    <Button
                        icon={IoChevronBackOutline}
                        label={"back"}
                        outline
                        size={21}
                        labelsize={8}
                        onClick={() => {
                            setStep(USERSETTINGSTEPS.INDEX)
                        }}
                    />
                </div>
                <div className="overflow-y-scroll max-h-[34rem] flex flex-col w-full">
                    <div className="flex flex-col h-full w-full justify-start gap-4 items-center min-h-[34rem] ">
                        <div className="flex flex-col justify-center items-center gap-3">
                            <Image src="/game-mode.svg" width={200} height={200} alt={""} />
                            {/* <h2 className=" capitalize font-extrabold text-white">permission denied</h2> */}
                        </div>
                        <div className="flex flex-col gap-3  w-full">
                            <button
                                onClick={() => {
                                    console.log("Time Mode")
                                }}
                                className="flex flex-row justify-between items-center shadow p-2 rounded hover:border-[#FFCC00] hover:border">
                                <div className='flex justify-center items-center p-3 rounded bg-[#FFCC00] text-white'>
                                    <TfiTimer size={28} />
                                </div>
                                <div>
                                    <h2 className='text-white'>Time Mode</h2>
                                </div>
                                <div className='text-white'>
                                    <BsArrowRightShort size={24} />
                                </div>
                            </button>
                            <button
                                onClick={() => {
                                    console.log("Score Mode")
                                }}
                                className="flex flex-row justify-between items-center shadow p-2 rounded hover:border-secondary hover:border">
                                <div className='flex justify-center items-center p-3 rounded bg-secondary text-white'>
                                    <MdOutlineScoreboard size={28} />
                                </div>
                                <div>
                                    <h2 className='text-white'>Score Mode</h2>
                                </div>
                                <div className='text-white'>
                                    <BsArrowRightShort size={24} />
                                </div>
                            </button>

                        </div>
                    </div>
                </div>

            </>
        )
    }
    if (step === USERSETTINGSTEPS.MEMBERJOIN) {
        bodyContent = (<ChanneLSettingsMemberJoinModaL socket={socket} OnClick={() => {
            setStep(USERSETTINGSTEPS.INDEX)
        }} />)
    }

    return <ChanneLUserSettingsModaL>
        {bodyContent}
    </ChanneLUserSettingsModaL>
}