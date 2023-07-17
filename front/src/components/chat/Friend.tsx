
import Image from "next/image"
import { useEffect, useState } from "react"
import { AiFillDelete } from "react-icons/ai"
import { BsFillTrashFill,  } from "react-icons/bs"
import { BiPlus } from "react-icons/bi"
interface FriendProp {
    onClick: (item: any) => void,
    onDelete?: (item: any) => void,
    onAdd?: (item: any) => void,
    name: string,
    image: string,
    id: string
}
const Friend: React.FC<FriendProp> = ({ onClick, name, image, id, onDelete, onAdd }) => {
    return (
        <div className=" relative max-w-[70px] flex flex-col items-center cursor-pointer" onClick={() => {
            console.log("add friend")
            onClick(id)
        }}>
            <div className="flex flex-col gap-4">
                <Image className=" block rounded-full  -2  -[#1EF0AE]" src={image} height={65} width={65} alt="" />
                <h4 className="text-[12px] text-center">{name}</h4>
            </div>
            <div className=" absolute right-0 bottom-4 ">

                {onDelete && <div className="w-8 h-8 relative flex-col justify-start items-start inline-flex">
                    <button className="w-8 h-8 bg-[#243230] rounded-full   flex justify-center items-center">
                        <BsFillTrashFill size={18} fill="#FF0000" />
                    </button>
                </div>}
                {onAdd && <div className="w-8 h-8 relative flex-col justify-start items-start inline-flex">
                    <button className="w-8 h-8 bg-[#243230] rounded-full   flex justify-center items-center">
                        <BiPlus size={18} fill="#FF0000" />
                    </button>
                </div>}
            </div>
        </div>
    )
}

export default Friend