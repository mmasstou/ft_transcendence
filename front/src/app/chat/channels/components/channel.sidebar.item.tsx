import { RoomTypeEnum, RoomsType } from "@/types/types"
import Cookies from "js-cookie"
import { useRouter, useSearchParams } from "next/navigation"
import { use, useCallback, useEffect, useState } from "react"
import { Socket } from "socket.io-client"
import LeftSidebarHook from "../hooks/LeftSidebarHook"
import ChanneLPasswordAccessHook from "../hooks/Channel.Access.Password.hook"
import Link from "next/link"
import { ro } from "date-fns/locale"
import React from "react"
import getChannelWithId from "../actions/getChannelWithId"

interface ChanneLSidebarItemProps {
  room: RoomsType,
  active?: boolean,
  onClick?: () => void,
  viewd?: number
}
const ChanneLSidebarItem = ({ room, active, onClick, viewd }: ChanneLSidebarItemProps) => {
  const [isMobile, setIsMobile] = useState(false);
  const [selectedchanneL, setSelectedchanneL] = useState<RoomsType | null>(null)
  const leftSidebar = LeftSidebarHook()
  const router = useRouter()
  const params = useSearchParams()
  const userId = Cookies.get('_id')
  const token = Cookies.get('token')
  if (!token || !userId) return;

  const channeLPasswordAccessHook = ChanneLPasswordAccessHook()
  let JoinData: any = room
  if (userId) {
    JoinData.loginUser = userId
  }

  useEffect(() => {
    window.addEventListener('resize', () => {
      const screenWidth = window.innerWidth;
      setIsMobile(screenWidth <= 767);
    });

    return () => {
      window.removeEventListener('resize', () => {
        const screenWidth = window.innerWidth;
        setIsMobile(screenWidth <= 767);
      });
    };
  }, []);

  useEffect(() => {
    if (isMobile) leftSidebar.onClose()
  }, [selectedchanneL])




  return <Link href={`/chat/channels/${room.slug}`}
    onClick={() => setSelectedchanneL(room)}
    className={`flex flex-row gap-3 justify-between px-1 items-center w-full  ${active ? ' text-secondary' : 'text-white'}`}>
    <div className="flex flex-row justify-start gap-3 items-center">
      <span className={` text-2xl `}>#</span>
      <h2>{room.name} </h2>
    </div>
    <span className=" text-secondary">{room.type}</span>
  </Link >
}

export default ChanneLSidebarItem