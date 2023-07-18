import { RoomsType } from "@/types/types";
import { useRouter } from "next/navigation";

export default function ChanneLroom(
  { is_active, room }: { is_active?: boolean, room: RoomsType}
  ) {
  const router = useRouter()

  return <button onClick={() => {
    console.log('room btn clicked room.id : ', room.name)
    router.push(`/chat/channels?r=${room.id.substring(0, 8)}`)
  }} className={`
  flex flex-row gap-3 justify-start items-center
  ${is_active ? ' text-white' : ''}
  `}>
    <span className={` text-2xl `}>#</span>
    <h2>{room.name}</h2>
  </button>
}