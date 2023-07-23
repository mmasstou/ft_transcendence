import Button from "../../components/Button";
import { UserAvatar } from "./channel.userAvater";


// icons :
import { TbUserX } from "react-icons/tb";
import { SlBan } from "react-icons/sl";
import { FaChessQueen, FaVolumeMute } from "react-icons/fa";
import { membersType, userType } from "@/types/types";
import React from "react";
import Cookies from "js-cookie";
import getUserWithId from "../actions/getUserWithId";
import { GrUserAdmin } from "react-icons/gr";
import { MdAdminPanelSettings } from "react-icons/md";

interface IChannelSettingsUserMemberItemProps {
    member: membersType;
}
export default function ChannelSettingsUserMemberItem({ member }: IChannelSettingsUserMemberItemProps) {
    const [IsMounted, setIsMounted] = React.useState(false)
    const [UserInfo, setUserInfo] = React.useState<userType | null>(null)

    React.useEffect(() => { setIsMounted(true) }, [])
    React.useEffect(() => {
        (async () => {
            const token: any = Cookies.get('token');
            const response = await getUserWithId(member.userId, token)
            setUserInfo(response)
        })();
    }, [member])
    if (!IsMounted)
        return null
    return <div className="Member flex flex-col items-start w-full">
        <div className="flex flex-row justify-between  items-center w-full">
            <div className="MemberAvatar flex justify-center items-center">
                <div className="flex flex-row items-center p-1 gap-1">
                    <UserAvatar size={24} image={"/avatar.jpg"} />
                    <h3 className=" text-lg font-light text-[#FFFFFF]">{UserInfo?.login}</h3>
                </div>
                <span>
                    {member.type === 'ADMIN' ? <GrUserAdmin size={16} fill="#FFBF00" /> : member.type === 'OWNER' && <FaChessQueen size={16} fill="#FFBF00" />}
                </span>
            </div>
            <div className="Actions flex flex-row gap-1 items-center">
                <Button
                    icon={MdAdminPanelSettings}
                    small
                    label="set Admin"
                    outline
                    disabled={member.type === 'OWNER'}
                    size={18}
                    onClick={() => { }}
                />
                 <Button
                    icon={TbUserX}
                    small
                    label="kick"
                    outline
                    IsActive
                    disabled={member.type === 'OWNER'}
                    size={18}
                    onClick={() => { }}
                />
                <Button 
                    icon={SlBan}
                    small
                    label="ban"
                    outline
                    disabled={member.type === 'OWNER'}
                    size={18}
                    onClick={() => { }}
                />
                <Button
                    icon={FaVolumeMute}
                    small
                    label="Mute"
                    outline
                    disabled={member.type === 'OWNER'}
                    size={18}
                    onClick={() => { }}
                />
            </div>
        </div>
        {(member.type === 'OWNER' || member.type === 'ADMIN') && <h4 className=" pl-6 text-xs text-secondary font-medium">groupe Admin</h4>}
    </div>
}