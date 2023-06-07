'use client'
import Image from "next/image"
import OLdMessages from "../hooks/OLdMessages";
import {OLdMessages as OLdMessagesType, RoomsType} from "../types/types"
import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface DirectOLdMessagesItemProps {
    name: string;
    lastmessgae: string
    time: string;
    image: string;
    active?: boolean
    OnClick: (value : string)=> void
}
const DirectOLdMessagesItem = (props : {data : RoomsType , isActive : boolean,  OnClick: (value : string)=> void , image : string}) => {
    const route = useRouter()
    
    return (
        <div onClick={() => {
            route.push(`?room=${props.data.id}`) 
            props.OnClick(props.data.id)
        }} className={`DirectOLdMessagesItem cursor-pointer flex flex-row  w-full items-center gap-2 p-2 m-1 
        ${props.isActive && 'bg-gradient-to-r from-[#243230ab] via-[#24323098] to-transparent rounded-xl '}`}>
            <div className="image rounded-full border border-red-600  overflow-hidden h-[45px] min-w-[45px] flex justify-center items-center">
                <Image src={props.image} alt={"avatar"} width={45} height={45} />
            </div>
            <div className={`content flex flex-col  w-full`}>
                <div className="heading flex flex-row  justify-between items-center">
                    <h2>{props.data.name}</h2>
                    <span className="text-[10px]">{props.data.created_at}</span>
                </div>
                <div className="Last.Message  text-[12px] text-[#C4C4C4]">{props.data.messages.length && props.data.messages[props.data.messages.length - 1].content} </div>
            </div>
        </div>
    )
}

export default DirectOLdMessagesItem