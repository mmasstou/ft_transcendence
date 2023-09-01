import Button from "../../../../components/Button";
import { UserAvatar } from "../../channel.userAvater";


// icons :
import { TbDeviceGamepad2, TbUserX } from "react-icons/tb";
import { SlBan, SlOptionsVertical } from "react-icons/sl";
import { FaChessQueen, FaUserPlus, FaUserShield, FaVolumeMute, FaVolumeUp, FaBan } from "react-icons/fa";
import { UserTypeEnum, membersType, updatememberEnum, updatememberType, userType } from "@/types/types";
import React, { ReactNode } from "react";
import Cookies from "js-cookie";
import getUserWithId from "../../../actions/getUserWithId";
import { GrUserAdmin } from "react-icons/gr";
import { MdAdminPanelSettings } from "react-icons/md";
import { Socket } from "socket.io-client";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import getMemberWithId from "../../../actions/getMemberWithId";
import ChanneLsettingsHook from "../../../hooks/channel.settings";
import Image from "next/image";
import ChannelSettingsUserMemberItemOption from "../../channel.settings.user.memberItem.option";
import MuteTime from "../../channel.settings.user.mutetime";
import ChanneLSettingsUserMemberItemActions from "./channel.settings.user.memberItem.actions";
import { VscPersonAdd } from "react-icons/vsc";
import { AiFillDelete, AiOutlineUserAdd } from "react-icons/ai";
import { IoLogOut } from "react-icons/io5";
import FindOneBySLug from "../../../actions/Channel/findOneBySlug";


interface IChannelSettingsUserMemberItemProps {
    member: membersType;
    socket: Socket | null;
    OnClick: (data: { updateType?: updatememberEnum, member: membersType }) => void;
    UserJoin?: boolean
    UserOwne?: boolean
    UserBan?: boolean
    UserProfile?: boolean
}
export default function ChannelSettingsUserMemberItem(
    { member, socket, UserJoin, OnClick, UserOwne, UserBan, UserProfile }: IChannelSettingsUserMemberItemProps) {
    const query = useParams();
    const slug: string = typeof query.slug === 'string' ? query.slug : '';
    const [IsMounted, setIsMounted] = React.useState(false)
    const [UserInfo, setUserInfo] = React.useState<userType | null>(null)
    const router = useRouter()
    const params = useSearchParams()
    const UserId = Cookies.get('_id')

    const channeLsettingsHook = ChanneLsettingsHook()
    const [CanEdit, setCanEdit] = React.useState<boolean>(false)
    const [LogedMember, setLogedMember] = React.useState<membersType | null>(null)
    const [Join_At, setJoin_At] = React.useState<string>("")

    if (!UserId) return;
    React.useEffect(() => {
        setIsMounted(true)
    }, [])

    React.useEffect(() => {
        (async () => {
            const token: any = Cookies.get('token');
            const response = await getUserWithId(member.userId, token)
            setUserInfo(response)

            // get loged member :
            const channeLLid = await FindOneBySLug(slug, token)
            if (!channeLLid)
                return;

            const channeLLMembers = UserId && await getMemberWithId(UserId, channeLLid.id, token)
            if (channeLLMembers) {
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
        // console.log("               *-> LogedMember.type :", LogedMember.type)
        if (LogedMember.type === 'OWNER') {
            // console.log("OWNER -> LogedMember :", LogedMember)
            setCanEdit(true)
        }
        if (LogedMember.type === 'ADMIN') {
            // console.log("ADMIN -> LogedMember :", LogedMember)
            setCanEdit(true)
        }
    }, [channeLsettingsHook.IsOpen, LogedMember])

    if (!IsMounted)
        return null
    // CanEdit && console.log("CanEdit :", CanEdit)
    return <div className="flex flex-col w-full">
        <div
            className="flex flex-col justify-between items-center gap-4  p-3 md:p-4 w-full rounded-[4px] ">
            <div className="flex flex-row justify-between items-center w-full ">
                <div className='flex justify-center items-center text-white gap-2'>
                    {/* <div className={`image  min-w-[24px] hidden sm:block rounded overflow-hidden`}>
                        <Image src={UserInfo ? UserInfo?.avatar : '/avatar.png'} alt="avatar" width={24} height={24} />
                    </div> */}
                    <div className=" hidden sm:flex">
                        <UserAvatar User={UserInfo ? UserInfo : undefined} size={42} showsatatus={UserProfile && false} image={UserInfo ? UserInfo?.avatar : '/avatar.png'} />

                    </div>
                    <div>
                        <div>
                            <h2 className={`text-white  ${member.type === 'OWNER' && 'md:text-white text-[#FFBF00]'} font-semibold capitalize`}>
                                {UserInfo?.name}

                            </h2>
                            {/* <MdAdminPanelSettings size={16} fill="#1EF0AE" /> */}

                        </div>
                        <div className="flex justify-start items-center gap-2">
                            <span className="text-[#b6b6b6e3] text-xs font-thin">{UserInfo?.login}{member.userId === UserId && <small className="text-[6px] px-1">[you]</small>}</span>
                            <>
                                {member.type === UserTypeEnum.OWNER && <FaChessQueen size={14} fill="#FFBF00" />}
                                {member.type === UserTypeEnum.ADMIN && <MdAdminPanelSettings size={14} fill="#FFBF00" />}
                                {member.ismute && <FaVolumeMute size={14} fill="#FFCC00" />}
                                {member.isban && <FaBan size={14} fill="#ED6C03" />}
                            </>
                        </div>
                    </div>
                </div>
                <div className="flex flex-row gap-3 justify-center items-center">
                    {!UserJoin && !UserOwne && !UserBan && !UserProfile
                        && <>

                            {<ChanneLSettingsUserMemberItemActions
                                hasPermissions={
                                    LogedMember?.type !== UserTypeEnum.USER
                                }
                                member={member}
                                OnClick={(data) => OnClick(data)} type={""}
                            />}
                            {member.userId !== UserId
                                && <ChannelSettingsUserMemberItemOption
                                    icon={TbDeviceGamepad2}
                                    size={24}
                                    label="play game"
                                    background
                                    Onclick={() => {
                                        OnClick({ updateType: updatememberEnum.PLAYGAME, member: member })
                                    }}
                                />}
                        </>
                    }
                    {UserJoin && <ChannelSettingsUserMemberItemOption
                        icon={AiOutlineUserAdd}
                        label={`add member`}
                        size={24}
                        Onclick={() => { OnClick({ member }) }}
                    />}
                    {UserBan && <ChannelSettingsUserMemberItemOption
                        icon={SlBan}
                        size={24}
                        label="ban member"
                        disabled={member.type === UserTypeEnum.OWNER}
                        IsActivate={member.isban}
                        background
                        Onclick={() => {

                            OnClick({ updateType: updatememberEnum.BANMEMBER, member: member })
                        }}
                    />}
                    {UserOwne && <ChannelSettingsUserMemberItemOption
                        icon={FaChessQueen}
                        size={24}
                        IsActivate={member.type === UserTypeEnum.OWNER}
                        label={`${member.type === UserTypeEnum.OWNER ? 'remove as Owner' : 'set as Owner'}`}
                        background
                        Onclick={() => {
                            OnClick({ updateType: updatememberEnum.SETOWNER, member: member })
                        }}
                    />}
                    {UserProfile && !member.isban && <>
                        <ChannelSettingsUserMemberItemOption
                            icon={IoLogOut}
                            size={21}
                            label={`Leave`}
                            background
                            Onclick={() => {
                                OnClick({ updateType: updatememberEnum.LEAVECHANNEL, member: member })
                            }} />
                        {member.type === UserTypeEnum.OWNER && <ChannelSettingsUserMemberItemOption
                            icon={AiFillDelete}
                            size={21}
                            label={'Delete'}
                            background
                            Onclick={() => {
                                OnClick({ updateType: updatememberEnum.DELETECHANNEL, member: member })
                            }} />}
                    </>}

                </div>
            </div>

        </div>
    </div>

}

