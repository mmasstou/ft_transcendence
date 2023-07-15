'use client'

import RightSidebarHook from "@/hooks/RightSidebarHook"

const RightsideModal = () => {
    const onLineUser = RightSidebarHook()
    return <>{
        onLineUser.IsOpen
        && <div className=" flex justify-center items-center h-[80vh] w-[95vw] sm:max-w-[280px] border border-red-500 ">OnLineUser ModaL</div>
    }</>
}

export default RightsideModal