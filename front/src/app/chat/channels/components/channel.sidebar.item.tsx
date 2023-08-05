import { RoomTypeEnum, RoomsType } from "@/types/types"
import Cookies from "js-cookie"
import { useRouter, useSearchParams } from "next/navigation"
import { use, useCallback, useEffect, useState } from "react"
import { Socket } from "socket.io-client"
import LeftSidebarHook from "../hooks/LeftSidebarHook"
import ChanneLPasswordAccessHook from "../hooks/Channel.Access.Password.hook"

interface ChanneLSidebarItemProps {
  room: RoomsType,
  active?: boolean,
  onClick?: () => void,
  socket: Socket | null
  viewd?: number
}
const ChanneLSidebarItem = ({ room, active, onClick, socket, viewd }: ChanneLSidebarItemProps) => {
  const [isMobile, setIsMobile] = useState(false);
  const [selectedchanneL, setSelectedchanneL] = useState<RoomsType | null>(null)
  const leftSidebar = LeftSidebarHook()
  const router = useRouter()
  const params = useSearchParams()
  const userId = Cookies.get('_id')

  const channeLPasswordAccessHook = ChanneLPasswordAccessHook()
  let JoinData: any = room
  if (userId) {
    JoinData.loginUser = userId
  }


  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      setIsMobile(screenWidth <= 767);
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    // if (selectedchanneL) {
    //   if (selectedchanneL.hasAccess === true && selectedchanneL.id !== params.get('r')) {
    //     console.log("selectedchanneL  :%s cliecked and hasAccessPassrod : ", selectedchanneL.name, selectedchanneL.hasAccess)
    //     channeLPasswordAccessHook.onOpen(selectedchanneL, socket)
    //   }
    //   else if (selectedchanneL.hasAccess === false) {
    //     console.log("selectedchanneL  :%s cliecked and hasAccessPassrod : ", selectedchanneL.name, selectedchanneL.hasAccess)
    //     selectedchanneL && socket?.emit('joinroom', selectedchanneL, (response: any) => { })
    //     router.push(`/chat/channels?r=${selectedchanneL.id}`)
    //   }
    // }
    if (!selectedchanneL) return
    selectedchanneL && socket?.emit('joinroom', selectedchanneL, (response: any) => { })
    router.push(`/chat/channels?r=${selectedchanneL.id}`)
    if (isMobile) leftSidebar.onClose()
  }, [selectedchanneL])


  socket?.on('joinroomResponseEvent', (data) => {
    console.log("joinroomResponseEvent :", data)

  })

  useEffect(() => {
    if (params) {
      if (params.get('r') === room.id) {
        room && socket?.emit('joinroom', room, (response: any) => {
          router.push(`/chat/channels?r=${params.get('r')}`)
        })
      }
    }
  }, [params])



  return <button
    onClick={() => setSelectedchanneL(room)}
    className={`flex flex-row gap-3 justify-between px-1 items-center w-full  ${active ? ' text-secondary' : 'text-white'}`}>
    <div className="flex flex-row justify-start gap-3 items-center">
      <span className={` text-2xl `}>#</span>
      <h2>{room.name} </h2>
    </div>
    <span className=" text-secondary">{room.type}</span>
  </button>
}

export default ChanneLSidebarItem