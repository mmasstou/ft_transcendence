import { IconType } from "react-icons"

interface IChannelSettingsUserMemberItemProps {
    icon : IconType,
    size : number
    IsActivate ?: boolean
    Onclick : () => void
    disabled ?: boolean
    IsLoading ?: boolean
    background ?: boolean
}
export default function ChannelSettingsUserMemberItemOption(
    {icon :Icon , size, IsActivate, disabled, IsLoading, background, Onclick}: IChannelSettingsUserMemberItemProps) {
    return  <button
    disabled={disabled || IsLoading} 
    onClick={Onclick} 
    className={`p-2 rounded-md ${background && 'bg-[#24323051]'} hover:text-secondary ${IsActivate ? 'text-danger' : 'text-white'}`}>
    <Icon size={size} />
</button>
}