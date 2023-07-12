'use client'

import ChatMain from "./chat.main"
import ChatNavbar from "./chat.navbar"
import OnlineUsersModaL from "@/components/modals/OnlineUsersModaL"

const ChatBody = () => <div className=" relative  h-full flex flex-col gap-2">
   

    <div className="flex flex-row justify-between h-full w-full">
        <div className=" w-full h-full "><ChatMain /></div>
        <div className="flex justify-end items-end h-full"><OnlineUsersModaL /></div>
    </div>

</div>
export default ChatBody