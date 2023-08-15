import { RoomsType, membersType, userType } from "@/types/types"
import Image from "next/image"

interface props {
    LogedMember: membersType | undefined
    User: userType | undefined
    room: RoomsType | undefined
}
export default function BanMember(
    props: props
) {
    return <div className="w-full flex justify-center items-center h-full flex-col">
        <div className="flex flex-col justify-center items-center gap-3">
            <Image src="/reject.svg" width={200} height={200} alt={""} />
            <h2 className=" capitalize font-extrabold text-white">You are Baned From this ChanneL</h2>
        </div>
    </div>
}