import React, { ReactNode } from "react"
import LeftSidebarHook from "../hooks/LeftSidebarHook"


export default function LefttsideModaL({children} :{children ?: ReactNode} ) {

    const leftSidebar = LeftSidebarHook()

 


    if (!leftSidebar.IsOpen)
        return null
    return <div className={` relative flex justify-center h-full w-full border-r border-black overflow-y-scroll  bg-[#24323044] max-w-full md:max-w-[320px]`}>
        <div className="w-full p-4">
            {children ? children : <div>No contacts</div>}
        </div>
    </div>
}

