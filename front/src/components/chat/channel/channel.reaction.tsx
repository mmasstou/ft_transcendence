import { BsEmojiFrownFill } from "react-icons/bs";
import { MdAddReaction } from "react-icons/md";

export function ChannelReactions({ reactions }: { reactions ?: any[] }) {
    return <div className=" absolute bottom-0 left-11 rounded-full flex flex-row gap-3 items-center        ">
    <div className="flex flex-row justify-center items-center gap-1  bg-primary shadow  -[.03rem] rounded-full p-1">
        <span className="text-[.6rem] text-white">3</span>
        <BsEmojiFrownFill size={14} fill="#65656B" className="" />
    </div>
     <div className="flex flex-row justify-center items-center gap-1  bg-primary shadow  -[.03rem]  -secondary rounded-full p-1">
        <span className="text-[.6rem] text-white">3</span>
        <BsEmojiFrownFill size={14} fill="#fcba03" className="" />
    </div>
    <MdAddReaction size={18} fill="#65656B" className="" />
</div>
}