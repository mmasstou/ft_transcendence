"use client"
import React, { MouseEvent, useEffect, useState } from "react"
import Loading from "../components/settings/CanneLSettingsLoading"

interface SettingsProviderProps {
    children: React.ReactNode,
}
export default function SettingsProvider({ children }: SettingsProviderProps) {
    const [Ismounted, setIsmounted] = useState<boolean>(false)
    const [IsLoading, setLoading] = React.useState<boolean>(true)

    useEffect(() => {
        setIsmounted(true)
        setTimeout(() => {
            setLoading(false)
        }, 400)
    }, [])
    if (!Ismounted) return null
    return <div className='flex flex-col gap-4'>{
        IsLoading ? <Loading /> : children}</div>

}
// Compare this snippet from front/src/app/chat/channels/components/settings/User/channel.settings.user.edit.tsx: