import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form"
import { IconType } from "react-icons"
import { BsArrowRightShort } from "react-icons/bs"

interface ChanneLSettingsOptionItemProps {
    onClick : () => void
    icon : IconType
    label : string
    color ?: string
    IsActive ?: boolean,
}
export default function ChanneLSettingsItem(
    {
        onClick,
        icon : Icon,
        label,
        IsActive,
        color,
    }: ChanneLSettingsOptionItemProps
) {
    return <button
    onClick={() => {
        console.log(`ChanneLSettingsOptionItem : ${label}`)
        onClick()
    }}
    className={`flex flex-row justify-between items-center shadow p-2 rounded border
    ${color ? 'hover:border-'+ color : 'hover:border-secondary'}  
    ${IsActive ? ' border-IsActive' : 'border-transparent'}
    `}>
    <div className={`flex justify-center items-center p-3 rounded ${color ? 'bg-'+ color : 'bg-secondary'} text-white`}>
        <Icon size={28} />
    </div>
    <div>
        <h2 className='text-white font-semibold'>{label}</h2>
    </div>
    <div className='text-white'>
        <BsArrowRightShort size={24} />
    </div>
</button>
}