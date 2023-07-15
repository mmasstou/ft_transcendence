import LeftSidebarHook from "@/hooks/LeftSidebarHook"
import RightSidebarHook from "@/hooks/RightSidebarHook"
import React, { ReactNode } from "react"

interface RightsideModalInterface {
    childern ?: ReactNode
}
const RightsideModal : React.FC<RightsideModalInterface> = ({childern}) => {

    const rightSidebar = RightSidebarHook()
    const leftSidebar = LeftSidebarHook()

 


    if (!leftSidebar.IsOpen)
        return null
    return <div className={` relative flex justify-center   h-full w-full  border border-green-500 overflow-y-scroll 
        ${leftSidebar.IsOpen ? ' max-w-full lg:max-w-[320px]' : 'max-w-full md:max-w-[320px]'}
    
        `}>
        <div className="w-full">
           
            {childern ? childern : <div>No contacts</div>}
        </div>
    </div>
}

export default RightsideModal