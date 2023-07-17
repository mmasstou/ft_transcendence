'use client'

import RightSidebarHook from "@/hooks/RightSidebarHook"

const RightsideModal = () => {
    const onLineUser = RightSidebarHook()
    return <>{
        onLineUser.IsOpen
        && <div className=" flex justify-center items-center h-full shadow w-[95vw] sm:max-w-[280px]  border-l ml-2 border-black ">Right side ModaL</div>
    }</>
}

export default RightsideModal