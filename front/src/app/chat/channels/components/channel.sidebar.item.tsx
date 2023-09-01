import { RoomsType } from "@/types/types"
import Cookies from "js-cookie"
import Link from "next/link"
import LeftSidebarHook from "../hooks/LeftSidebarHook"

interface ChanneLSidebarItemProps {
  room: RoomsType,
  active?: boolean,
}

const ChanneLSidebarItem = ({ room, active }: ChanneLSidebarItemProps) => {
  const leftSidebar = LeftSidebarHook()
  const userId = Cookies.get('_id')
  const token = Cookies.get('token')
  if (!token || !userId) return;

  return <Link href={`/chat/channels/${room.slug}`}
    onClick={() => {
      leftSidebar.onClose()
    }}
    className={`flex flex-row gap-3 justify-between px-1 items-center w-full  ${active ? ' text-secondary' : 'text-white'}`}>
    <div className="flex flex-row justify-start gap-3 items-center">
      <span className={` text-2xl `}>#</span>
      <h2>{room.name} </h2>
    </div>
    <span className=" text-secondary">{room.type}</span>
  </Link >
}

export default ChanneLSidebarItem