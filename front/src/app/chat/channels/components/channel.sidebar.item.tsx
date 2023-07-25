import { RoomsType } from "@/types/types"
import { useRouter } from "next/navigation"

interface ChanneLSidebarItemProps {
    room: RoomsType,
    active?: boolean,
    onClick?: () => void
}
const ChanneLSidebarItem = ({ room, active, onClick } : ChanneLSidebarItemProps) => {
    const router = useRouter()
    return  <button onClick={() => {
        console.log('room btn clicked room.id : ', room.name)
        router.push(`/chat/channels?r=${room.id}`)
      }} className={`
      flex flex-row gap-3 justify-start items-center
      ${active ? ' text-secondary' : 'text-white'}
      `}>
        <span className={` text-2xl `}>#</span>
        <h2>{room.name}</h2>
      </button>
}

export default ChanneLSidebarItem