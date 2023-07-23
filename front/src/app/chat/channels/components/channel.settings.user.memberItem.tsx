import Button from "../../components/Button";
import { UserAvatar } from "./channel.userAvater";


// icons :
import { TbUserX } from "react-icons/tb";
import { SlBan } from "react-icons/sl";
import { FaChessQueen, FaVolumeMute } from "react-icons/fa";
import { membersType, updatememberType, userType } from "@/types/types";
import React from "react";
import Cookies from "js-cookie";
import getUserWithId from "../actions/getUserWithId";
import { GrUserAdmin } from "react-icons/gr";
import { MdAdminPanelSettings } from "react-icons/md";
import { Socket } from "socket.io-client";
import { useRouter } from "next/navigation";
import getMemberWithId from "../actions/getMemberWithId";

enum updatememberEnum {
    SETADMIN = 'SETADMIN',
    BANMEMBER = 'BANMEMBER',
    KIKMEMBER = 'KIKMEMBER',
    MUTEMEMBER = 'MUTEMEMBER'
}
interface IChannelSettingsUserMemberItemProps {
    member: membersType;
    socket: Socket | null;
    OnClick: (data: any) => void;
}
export default function ChannelSettingsUserMemberItem({ member, socket, OnClick }: IChannelSettingsUserMemberItemProps) {
    const [IsMounted, setIsMounted] = React.useState(false)
    const [UserInfo, setUserInfo] = React.useState<userType | null>(null)
    const router = useRouter()
    React.useEffect(() => { setIsMounted(true) }, [])
    React.useEffect(() => {
        (async () => {
            const token: any = Cookies.get('token');
            const response = await getUserWithId(member.userId, token)
            setUserInfo(response)
        })();
    }, [member])

    if (!IsMounted )
        return null

    return <div className="Member flex flex-col items-start w-full">
        <div className="flex flex-row justify-between  items-center w-full">
            <div className="MemberAvatar flex justify-center items-center">
                <div className="flex flex-row items-center p-1 gap-1">
                    <UserAvatar size={24} image={"/avatar.jpg"} />
                    <h3 className=" text-lg font-light text-[#FFFFFF]">{UserInfo?.login}</h3>
                </div>
                <span>
                    {member.type === 'OWNER' && <FaChessQueen size={16} fill="#FFBF00" />}
                </span>
            </div>
            <div className="Actions flex flex-row gap-1 items-center">
              { !member.isban &&  <Button
                    icon={MdAdminPanelSettings}
                    small
                    label={`set ${member.type === 'ADMIN' ? 'user' : 'admin'}`}
                    outline
                    IsActive={member.type === 'ADMIN'}
                    disabled={member.type === 'OWNER'}
                    size={18}
                    onClick={() => {
                        OnClick({
                            member: member,
                            updateType: updatememberEnum.SETADMIN
                        })
                    }}
                />}
                <Button
                    icon={TbUserX}
                    small
                    label="kick"
                    outline
                    IsActive
                    disabled={member.type === 'OWNER'}
                    size={18}
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
                    label={member.isban ? "unban" : "ban"}
                    outline
                    disabled={member.type === 'OWNER'}
                    size={18}
                    onClick={() => { 
                        OnClick({
                            member: member,
                            updateType: updatememberEnum.BANMEMBER
                        })
                     }}
                />
                {!member.isban &&<Button
                    icon={FaVolumeMute}
                    small
                    label={`${member.ismute ? 'unmute' : 'mute'}`}
                    outline
                    disabled={member.type === 'OWNER'}
                    size={18}
                    onClick={() => {
                        OnClick({
                            member: member,
                            updateType: updatememberEnum.MUTEMEMBER
                        })
                     }}
                />}
            </div>
        </div>
        <div className="flex justify-between items-center">
            {(member.type === 'OWNER' || member.type === 'ADMIN') && <h4 className=" pl-6 text-[10px] text-secondary font-medium">groupe Admin</h4>}
        </div>
    </div>
}