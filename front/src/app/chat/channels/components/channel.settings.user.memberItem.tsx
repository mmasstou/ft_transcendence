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
    return <div className="Member flex flex-col items-start w-full shadow-sm">
        <div className="flex flex-row justify-between  items-center w-full">
            <div className="MemberAvatar flex justify-center items-center">
                <button className="flex flex-row items-center p-1 gap-1" onClick={() => {
                    console.log("btn clicked :", member.userId)
                }}>
                    <UserAvatar size={24} image={"/avatar.jpg"} />
                    <h3 className=" text-lg font-light text-[#FFFFFF]">
                        {UserInfo?.login}
                        {member.userId === __userId && <small className="text-[6px] px-1">[you]</small>}
                    </h3>
                </button>
                <span>
                    {member.type === 'OWNER' && <FaChessQueen size={16} fill="#FFBF00" />}
                </span>
            </div>
            {member.CanEdit
                ? <div className="Actions flex flex-row gap-1 items-center">
                    {!member.isban && <Button
                        icon={MdAdminPanelSettings}
                        small
                        outline
                        IsActive={member.type === 'ADMIN'}
                        disabled={member.type === 'OWNER'}
                        size={24}
                        onClick={() => {
                            OnClick({
                                member: member,
                                updateType: updatememberEnum.SETADMIN
                            })
                        }}
                    />}
                     <Button
                        icon={TbDeviceGamepad2}
                        small
                        outline
                        size={24}
                        onClick={() => {}}
                    />
                    <Button
                        icon={TbUserX}
                        small
                        outline
                        disabled={member.type === 'OWNER' || member.userId === __userId}
                        size={24}
                        onClick={() => {
                            OnClick({
                                member: member,
                                updateType: updatememberEnum.KIKMEMBER
                            })
                        }}
                    />
                    <Button
                        icon={SlBan}
                        small
                        outline
                        disabled={member.type === 'OWNER' || member.userId === __userId}
                        size={24}
                        IsBan={member.isban}
                        onClick={() => {
                            OnClick({
                                member: member,
                                updateType: updatememberEnum.BANMEMBER
                            })
                        }}
                    />
                    {!member.isban && <Button
                        icon={FaVolumeMute}
                        small
                        outline
                        IsBan={member.ismute}
                        disabled={member.type === 'OWNER' || member.userId === __userId}
                        size={24}
                        onClick={() => {
                            OnClick({
                                member: member,
                                updateType: updatememberEnum.MUTEMEMBER
                            })
                        }}
                    />}
                </div>
                : <div className="Actions flex flex-row gap-1 items-center">
                    <span>
                        Join At :
                        <strong>{Join_At}</strong>
                    </span>
                </div>
            }
        </div>
        <div className="flex justify-between items-center">
            {(member.type === 'OWNER' || member.type === 'ADMIN') && <h4 className=" pl-6 text-[10px] text-secondary font-medium">groupe Admin</h4>}
        </div>
    </div>
}