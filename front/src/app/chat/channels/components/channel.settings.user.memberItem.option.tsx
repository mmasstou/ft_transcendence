import { IconType } from "react-icons"

interface IChannelSettingsUserMemberItemProps {
    icon : IconType,
    size : number
    IsActivate ?: boolean
    Onclick : () => void
}
export default function ChannelSettingsUserMemberItemOption({icon :Icon , size, IsActivate, Onclick}: IChannelSettingsUserMemberItemProps) {
    return  <button onClick={Onclick} className={`p-2 rounded-md bg-[#24323051] ${IsActivate ? 'text-danger' : 'text-white'}`}>
    <Icon size={size} />
</button>
}