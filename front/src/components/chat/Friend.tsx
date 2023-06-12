
import Image from "next/image"
import { useEffect, useState } from "react"
interface FriendProp {
    onClick: (item: any) => void,
    name: string,
    image: string,
    id: string
}
const Friend: React.FC<FriendProp> = ({ onClick, name, image, id }) => {
    return (
        <div className="max-w-[70px] flex flex-col items-center cursor-pointer" onClick={() => {
            console.log("add friend")
            onClick(id)
        }}>
            <Image className=" block rounded-full border-2 border-[#1EF0AE]" src={image} height={65} width={65} alt="" />
            <h4 className="text-[12px] text-center">{name}</h4>
        </div>
    )
}

export default Friend