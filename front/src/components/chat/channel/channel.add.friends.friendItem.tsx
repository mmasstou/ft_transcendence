"use client"

import Image from "next/image"


const ChanneLAddFriendsItem = () => {
   
    return (
        <div className="flex flex-row gap-3 ">
            <Image src="/avatar.jpg" width="21" height="21" className="rounded-full" alt={""} />
            <h3 className="text-base">mohamed Masstour</h3>
        </div>
    )
       
}
export default ChanneLAddFriendsItem