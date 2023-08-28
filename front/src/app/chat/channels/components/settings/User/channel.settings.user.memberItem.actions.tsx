import { UserTypeEnum, updatememberEnum } from "@/types/types";
import ChannelSettingsUserMemberItemOption from "../../channel.settings.user.memberItem.option";
// icons :
import { MdAdminPanelSettings } from "react-icons/md";
import { TbDeviceGamepad2, TbUserX } from "react-icons/tb";
import { SlBan } from "react-icons/sl";
import { FaVolumeMute } from "react-icons/fa";
interface props {
    hasPermissions?: boolean;
    member: any;
    OnClick: (data: any) => void;
    type : '';
}
export default function ChanneLSettingsUserMemberItemActions(
    { hasPermissions, member, OnClick }: props
) {
    if (!hasPermissions) return null;
    return <div className="flex flex-row gap-3 justify-center items-center">
        {/* <h4 className="text-[10px] text-secondary font-medium">Joined {Join_At}</h4> */}
        {<ChannelSettingsUserMemberItemOption
            icon={MdAdminPanelSettings}
            size={24}
            label="set as Admin"
            disabled={member.type === UserTypeEnum.OWNER}
            IsActivate={member.type === UserTypeEnum.ADMIN}
            Onclick={() => {
                OnClick({ updateType: updatememberEnum.SETADMIN, member: member })
            }}
        />}
        {<ChannelSettingsUserMemberItemOption
            icon={TbUserX}
            label={`kik member`}
            size={24}
            disabled={member.type === UserTypeEnum.OWNER}
            Onclick={() => {
                OnClick({ updateType: updatememberEnum.KIKMEMBER, member: member })
            }}
        />}
        {<ChannelSettingsUserMemberItemOption
            icon={SlBan}
            size={24}
            label="ban member"
            disabled={member.type === UserTypeEnum.OWNER}
            IsActivate={member.isban}
            Onclick={() => {

                OnClick({ updateType: updatememberEnum.BANMEMBER, member: member })
            }}
        />}
        {<ChannelSettingsUserMemberItemOption
            icon={FaVolumeMute}
            size={24}
            label="mute member"
            disabled={member.type === UserTypeEnum.OWNER}
            IsActivate={member.ismute}
            Onclick={() => {
                OnClick({ updateType: updatememberEnum.MUTEMEMBER, member: member })
            }}
        />}
        {/* {member.ismute && <MuteTime member={member} socket={socket} />} */}
    </div>
}