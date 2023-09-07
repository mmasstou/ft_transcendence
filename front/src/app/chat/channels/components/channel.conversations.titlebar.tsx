'use client'
import { membersType } from "@/types/types";
import Cookies from "js-cookie";
import React, { FormEvent, useState } from "react";
import { RiSettingsLine } from "react-icons/ri";
import { Socket } from "socket.io-client";
import Button from "../../components/Button";
import getMemberWithId from "../actions/getMemberWithId";
import ChanneLsettingsHook from "../hooks/channel.settings";


interface ConversationsTitlebarInterface {
  messageTo: string;
  OnSubmit: (event: FormEvent<HTMLInputElement>) => void;
  socket: Socket | null;
  channeLId: string | null;
  LogedMember: membersType | null
}

export default function ConversationsTitlebar({ messageTo, OnSubmit, socket, channeLId, LogedMember }: ConversationsTitlebarInterface) {
  const [input, setInputValue] = useState("")
  const [message, setMessage] = useState("");
  const channeLsettingsHook = ChanneLsettingsHook()
  const [update, setUpdate] = React.useState<boolean>(false)
  const [LogedMemberInfo, setLogedMemberInfo] = React.useState<membersType | null>(LogedMember)

  socket?.on(`SOCKET_EVENT_RESPONSE_CHAT_MEMBER_UPDATE`, (data) => {
    setUpdate(true)
  })

  React.useEffect(() => {
    if (!channeLId)
      channeLsettingsHook.onClose()
  }, [channeLId])

  React.useEffect(() => {
    const token: string | undefined = Cookies.get('token');
    // update member :
    if (LogedMember && token) {
      (async () => {
        const response = await getMemberWithId(LogedMember?.userId, LogedMember?.roomsId, token)
        setUpdate(false)
        setLogedMemberInfo(response)
      })()
    }
  }, [update])

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
        disabled={LogedMemberInfo?.isban}
        onClick={() => { channeLsettingsHook.onOpen(channeLId, socket) }}
      />

    </div>
  </div>
}
