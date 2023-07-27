import React, { use, useEffect } from "react";
import LefttsideModaL from "../modaLs/LeftsideModal";
import ChanneLSidebarItem from "./channel.sidebar.item";
import { RoomsType } from "@/types/types";
import { useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import getChannels from "@/actions/channels/getChanneLs";


export default function ChanneLbody({ children }: { children: React.ReactNode; }) {
    const [IsMounted, setIsMounted] = React.useState(false)
    const [ChanneLs, setChannel] = React.useState<RoomsType[] | null>(null)
    const [ChanneLsActiveID, setChanneLsActive] = React.useState<string | null>(null)
    const params = useSearchParams()


    useEffect(() => {
        const token: any = Cookies.get('token');
       

        (async () => {
            if (!token)
                return;
            const resp = await getChannels(token)
            if (resp && resp.ok) {
                const data = await resp.json()
                // console.log("data :", data)
                setChannel(data);
            }
            console.log("resp :", resp)
        }
        )();
    }, [])

    useEffect(() => { if (params) {
        setChanneLsActive(params.get('r'))
    }}, [params])
    const LeftsideContent = ChanneLs?.map((room) => (
        <ChanneLSidebarItem room={room} active={room.id === ChanneLsActiveID} />
    ))

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!IsMounted)
        return null
    return (
        <div className="channeLbody h-[90vh] md:h-[94vh] border border-green-600 flex ">
            <LefttsideModaL>
                {LeftsideContent}
            </LefttsideModaL>
            {children}
        </div>
    )
}