'use client'
import Image from "next/image"
import OLdMessages from "@/hooks/LeftSidebarHook";
import {OLdMessages as OLdMessagesType, RoomsType} from "@/types/types"
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Socket } from "socket.io-client";

interface DirectOLdMessagesItemProps {
    name: string;
    lastmessgae: string
    time: string;
    image: string;
    active?: boolean
    OnClick: (value : string)=> void;
    socket : Socket
}
const DirectOLdMessagesItem = (props : {data : RoomsType , isActive : boolean,  OnClick: (value : string)=> void , image : string, socket : Socket}) => {
    const route = useRouter()
    const params = usePathname()
    
    return (
        <div onClick={() => {
            route.push(`${params}?room=${props.data.id}`) 
            props.data && props.OnClick(props.data.id)
            props.socket && props.socket.emit("joinroom", {roomId :props.data.id}, () => {});
        }} className={`DirectOLdMessagesItem cursor-pointer flex flex-row  w-full items-center gap-2 p-2 m-1 
        ${props.isActive && 'bg-gradient-to-r from-[#243230ab] via-[#24323098] to-transparent rounded-xl '}`}>
            <div className="image rounded-full border border-red-600  overflow-hidden h-[45px] min-w-[45px] flex justify-center items-center">
                <Image src={props.image} alt={"avatar"} width={45} height={45} />
            </div>
            <div className={`content flex flex-col  w-full`}>
                <div className="heading flex flex-row  justify-between items-center">
                    <h2>{props.data.name}</h2>
                    {/* <span className="text-[10px]">{props.data.created_at}</span> */}
                </div>
                <div className="Last.Message  text-[12px] text-[#C4C4C4]">{props.data.messages && props.data.messages.length && props.data.messages[props.data.messages.length - 1].content} </div>
            </div>
        </div>
    )
}

export default DirectOLdMessagesItem