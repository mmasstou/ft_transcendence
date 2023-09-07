'use client'
import React, { useState } from "react"
import { IconType } from "react-icons"
import Button from "../../components/Button"

interface IChannelSettingsUserMemberItemProps {
    icon: IconType,
    size: number
    IsActivate?: boolean
    Onclick: () => void
    disabled?: boolean
    IsLoading?: boolean
    background?: boolean
    label: string
    showLabeL?: boolean
}
export default function ChannelSettingsUserMemberItemOption(
    { icon: Icon, size, IsActivate, disabled, IsLoading, background, Onclick, label, showLabeL }: IChannelSettingsUserMemberItemProps) {
    const [Ismounted, setIsmounted] = useState<boolean>(false)

    React.useEffect(() => setIsmounted(true))
    if (!Ismounted) return;
    return <Button
        disabled={disabled || IsLoading}
        onClick={Onclick}
        icon={Icon}
        size={size}
        outline
        showLabeL={showLabeL}
        IsActive={IsActivate}
        label={label}
        responsive
    />
}

/*

 (<button
    disabled={disabled || IsLoading} 
    onClick={Onclick} 
    className={`p-2 rounded-md ${background && 'bg-[#24323051]'} hover:text-secondary ${IsActivate ? 'text-danger' : 'text-white'}`}>
    <Icon size={size} />
</button>)

**/ 