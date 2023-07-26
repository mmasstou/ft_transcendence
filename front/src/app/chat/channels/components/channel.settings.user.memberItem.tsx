import Button from "../../components/Button";
import { UserAvatar } from "./channel.userAvater";


// icons :
import { TbDeviceGamepad2, TbUserX } from "react-icons/tb";
import { SlBan } from "react-icons/sl";
import { FaChessQueen, FaVolumeMute } from "react-icons/fa";
import { membersType, updatememberType, userType } from "@/types/types";
import React from "react";
import Cookies from "js-cookie";
import getUserWithId from "../actions/getUserWithId";
import { GrUserAdmin } from "react-icons/gr";
import { MdAdminPanelSettings } from "react-icons/md";
import { Socket } from "socket.io-client";
import { useRouter, useSearchParams } from "next/navigation";
import getMemberWithId from "../actions/getMemberWithId";
import ChanneLsettingsHook from "../hooks/channel.settings";
import Image from "next/image";
import ChannelSettingsUserMemberItemOption from "./channel.settings.user.memberItem.option";

enum updatememberEnum {
    SETADMIN = 'SETADMIN',
    BANMEMBER = 'BANMEMBER',
    KIKMEMBER = 'KIKMEMBER',
    MUTEMEMBER = 'MUTEMEMBER'
}

interface IChannelSettingsUserMemberItemProps {
    member: any;
    socket: Socket | null;
    OnClick: (data: any) => void;
}
export default function ChannelSettingsUserMemberItem({ member, socket, OnClick }: IChannelSettingsUserMemberItemProps) {
    const [IsMounted, setIsMounted] = React.useState(false)
    const [UserInfo, setUserInfo] = React.useState<userType | null>(null)
    const router = useRouter()
    const params = useSearchParams()
    const __userId = Cookies.get('_id')
    const channeLsettingsHook = ChanneLsettingsHook()
    const [CanEdit, setCanEdit] = React.useState<boolean>(false)
    const [LogedMember, setLogedMember] = React.useState<membersType | null>(null)
    const [Join_At, setJoin_At] = React.useState<string>("")

    React.useEffect(() => {
        setIsMounted(true)
        member.CanEdit = false
    }, [])
    React.useEffect(() => {
        (async () => {
            const token: any = Cookies.get('token');
            const response = await getUserWithId(member.userId, token)
            setUserInfo(response)

            // get loged member :
            const channeLLid = params.get('r')
            if (!channeLLid)
                return;

            const channeLLMembers = __userId && await getMemberWithId(__userId, channeLLid, token)
            if (channeLLMembers && channeLLMembers.statusCode !== 200) {
                setLogedMember(channeLLMembers)
            }
        })();

    }, [member])


    React.useEffect(() => {
        if (!channeLsettingsHook.IsOpen)
            return
        if (!LogedMember)
            return
        const date = new Date(member.created_at);

        setJoin_At(date.toLocaleString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
        }))
        // set user pirmision :
        console.log("               *-> LogedMember.type :", LogedMember.type)
        if (LogedMember.type === 'OWNER') {
            console.log("OWNER -> LogedMember :", LogedMember)
            setCanEdit(true)
            member.CanEdit = true

        }
        if (LogedMember.type === 'ADMIN') {
            console.log("ADMIN -> LogedMember :", LogedMember)
            setCanEdit(true)
            member.CanEdit = true
        }
    }, [channeLsettingsHook.IsOpen, LogedMember])

    if (!IsMounted)
        return null
    CanEdit && console.log("CanEdit :", CanEdit)
    return <div className="flex flex-col w-full">
        <div
            className="flex flex-col justify-between items-center gap-4 shadow p-4 w-full rounded">
            <div className="flex flex-row justify-between items-center w-full ">
                <div className='flex justify-center items-center text-white gap-2'>
                    <div className={`image  min-w-[24px] rounded overflow-hidden`}>
                        <Image src="/avatar.jpg" alt="avatar" width={24} height={24} />
                    </div>
                    <h2 className='text-white font-semibold capitalize'>
                        {UserInfo?.login}
                        {member.userId === __userId && <small className="text-[6px] px-1">[you]</small>}
                    </h2>
                    <MdAdminPanelSettings size={16} fill="#1EF0AE" />
                    {member.type === 'OWNER' && <FaChessQueen size={16} fill="#FFBF00" />}
                </div>
                {member.CanEdit 
                ? <div className="flex flex-row gap-3 justify-center items-center">
                    {/* <h4 className="text-[10px] text-secondary font-medium">Joined {Join_At}</h4> */}
                    <ChannelSettingsUserMemberItemOption 
                        icon={MdAdminPanelSettings}
                        size={24}
                        IsActivate={member.type === 'ADMIN'}
                        Onclick={() => {
                            console.log("set admin")
                            OnClick({ type: updatememberEnum.SETADMIN, member: member })
                        }}
                    />
                     <ChannelSettingsUserMemberItemOption 
                        icon={TbUserX}
                        size={24}
                        IsActivate={member.type === 'BANNED'}
                        Onclick={() => {
                            console.log("set admin")
                            OnClick({ type: updatememberEnum.KIKMEMBER, member: member })
                        }}
                    />
                     <ChannelSettingsUserMemberItemOption 
                        icon={SlBan}
                        size={24}
                        IsActivate={member.type === 'BANNED'}
                        Onclick={() => {
                            console.log("set admin")
                            OnClick({ type: updatememberEnum.BANMEMBER, member: member })
                        }}
                    />
                     <ChannelSettingsUserMemberItemOption 
                        icon={FaVolumeMute}
                        size={24}
                        IsActivate={member.type === 'MUTED'}
                        Onclick={() => {
                            console.log("set admin")
                            OnClick({ type: updatememberEnum.MUTEMEMBER, member: member })
                        }}
                    />
                </div>
                : <div className="flex flex-row gap-3 justify-center items-center">
                    <h4 className="text-[10px] text-secondary font-medium">Joined {Join_At}</h4>
                    </div>}
            </div>

        </div>
    </div>

}