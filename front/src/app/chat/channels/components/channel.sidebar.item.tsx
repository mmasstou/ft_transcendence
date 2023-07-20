import { RoomsType } from "@/types/types"
import { useRouter } from "next/navigation"
import { use, useCallback, useEffect } from "react"
import { Socket } from "socket.io-client"

interface ChanneLSidebarItemProps {
  room: RoomsType,
  active?: boolean,
  onClick?: () => void,
  socket: Socket | null
}
const ChanneLSidebarItem = ({ room, active, onClick, socket }: ChanneLSidebarItemProps) => {
  const router = useRouter()

  const onClickHandler = useCallback(() => {
    console.log('ChanneLSidebarItem socket : ', socket?.id)
    socket?.emit('joinroom', room, (response: any) => {
      console.log('join response : ', response)
    })

  }, [socket])
  return <button
    onClick={() => {
      console.log('room btn clicked room.id : ', room.name)
      router.push(`/chat/channels?r=${room.id}`)
      onClickHandler();
    }}
    className={`flex flex-row gap-3 justify-start items-center ${active ? ' text-secondary' : 'text-white'}`}>
    <span className={` text-2xl `}>#</span>
    <h2>{room.name}</h2>
  </button>
}

export default ChanneLSidebarItem