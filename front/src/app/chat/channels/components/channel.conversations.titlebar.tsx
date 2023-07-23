'use client'
import Image from "next/image";
import React, { FormEvent, useState } from "react";
import { RiSettingsLine } from "react-icons/ri";
import { UserAvatar } from "./channel.userAvater";
import Button from "../../components/Button";
import ChanneLsettingsHook from "../hooks/channel.settings";
import { Socket } from "socket.io-client";


interface ConversationsTitlebarInterface {
  messageTo: string;
  OnSubmit: (event: FormEvent<HTMLInputElement>) => void;
  socket: Socket | null;
  channeLId: string | null;
}

export default function ConversationsTitlebar({ messageTo, OnSubmit, socket, channeLId }: ConversationsTitlebarInterface) {
  const [input, setInputValue] = useState("")
  const [message, setMessage] = useState("");
  const channeLsettingsHook = ChanneLsettingsHook()
  React.useEffect(() => {
    if (!channeLId)
      channeLsettingsHook.onClose()
  }, [channeLId])
  
  if (!channeLId)
    return null
  return <div className="w-full  h-11  bg-[#24323044] shadow flex flex-row justify-between items-center p-2">
    <div className="left flex flex-row gap-1">
      <span className="text-base font-bold text-[#FFFFFF]">{messageTo}</span>
    </div>
    <div className="rigth">
      <Button
        icon={RiSettingsLine}
        small
        outline
        onClick={() => { channeLsettingsHook.onOpen(channeLId, socket) }}
      />

    </div>
  </div>
}
