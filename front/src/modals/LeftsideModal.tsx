import LeftSidebarHook from "@/hooks/LeftSidebarHook"
import RightSidebarHook from "@/hooks/RightSidebarHook"
import React, { ReactNode } from "react"

export default function LefttsideModa({childern} :{childern ?: ReactNode} ) {

    const rightSidebar = RightSidebarHook()
    const leftSidebar = LeftSidebarHook()

 


    if (!leftSidebar.IsOpen)
        return null
    return <div className={` relative flex justify-center   h-full w-full border-r  border-black overflow-y-scroll  bg-[#24323044]
        ${rightSidebar.IsOpen ? ' max-w-full lg:max-w-[320px]' : 'max-w-full md:max-w-[320px]'}
    
        `}>
        <div className="w-full">
           
            {childern ? childern : <div>No contacts</div>}
        </div>
    </div>
}

