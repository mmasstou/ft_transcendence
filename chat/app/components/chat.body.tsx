'use client'

import OnlineUsersModaL from "../modaL/OnlineUsersModaL"
import ChatMain from "./chat.main"
import ChatNavbar from "./chat.navbar"


const ChatBody = () => {

return <div className=" relative  h-[95vh] flex flex-col gap-2">
        <ChatNavbar />
      
        <div className="flex flex-row justify-between h-full w-full">
            <div className=" w-full h-full "><ChatMain /></div>
            <div className="flex justify-end items-end h-full"><OnlineUsersModaL /></div>
        </div>
   
    </div>
}
export default ChatBody