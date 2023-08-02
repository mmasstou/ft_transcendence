import { RoomsType } from "@/types/types"
import { on } from "events";

interface ChannelFindRoomItemProps {
    room: RoomsType;
    onClick: (room : RoomsType) => void
}
export default function ChannelFindRoomItem({ room, onClick }: ChannelFindRoomItemProps) {
    return <div

        className={`flex flex-row gap-3 justify-between px-1 items-center w-full`}>
        <div className="flex flex-row justify-start gap-3 items-center text-white">
            <span className={` text-2xl `}>#</span>
            <h2 className=" text-lg">{room.name} </h2>
        </div>
        <button
            onClick={() => onClick(room)}
            className=" text-[#6CCCFE] border rounded-[15px] border-[#6CCCFE] p-1 min-w-[120px]">Join</button>
    </div>
}