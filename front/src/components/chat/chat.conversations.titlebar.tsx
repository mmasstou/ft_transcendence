'use client'
import Image from "next/image";
import { FormEvent, useState } from "react";
import { RiSettingsLine } from "react-icons/ri";
import { UserAvatar } from "./chat.userAvater";


interface ConversationsTitlebarInterface{
    messageTo: string;
    OnSubmit : (event : FormEvent<HTMLInputElement>) => void;
}

export default function ConversationsTitlebar( {messageTo, OnSubmit} : {messageTo : string ,OnSubmit : (event : any) => void } ) {
    const [input, setInputValue] = useState("")
    const [message, setMessage] = useState("");
    return <div className="w-full  h-11 bg-primary shadow flex flex-row justify-between items-center p-2">
       <div className="left flex flex-row gap-1">
            <span className="text-base font-bold text-[#FFFFFF]">{messageTo}</span>
       </div>
       <div className="rigth">
       <button className="">
              <RiSettingsLine
                size={21}
                color='#E0E0E0'
              />
            </button>
       </div>
    </div>
}
