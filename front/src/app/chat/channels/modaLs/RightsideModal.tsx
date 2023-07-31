import React, { ReactNode } from "react"
import RightsidebarHook from "../hooks/RightSidebarHook"


export default function RightsideModaL({children} :{children ?: ReactNode} ) {

    const rightsidebar = RightsidebarHook()

 


    if (!rightsidebar.IsOpen)
        return null
    return <div className={`relative flex justify-center h-full w-full border-r border-black overflow-y-scroll  bg-[#24323044] max-w-full md:max-w-[320px]`}>
        <div className="w-full p-4 mt-8">
            {children ? children : <div>No contacts</div>}
        </div>
    </div>
}

