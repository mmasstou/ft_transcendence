import { AiFillMessage } from "react-icons/ai";
import { HiArrowUturnLeft } from "react-icons/hi2";


export function ChannelReplys({ replys }: { replys ?: any[] }) {
    return  <div className=" absolute bottom-0 right-11 flex flex-row gap-4 ">
    <button className="rounded-full flex flex-row bg-primary shadow gap-1 p-1 items-center justify-between text-[#65656B] ">
        <AiFillMessage size={10} fill="#65656B" className="" />
        <span className=" text-[.6rem]">12</span>
    </button>
    <button className="rounded-full flex flex-row bg-primary shadow gap-1 p-1 items-center justify-between text-[#65656B] ">
        <HiArrowUturnLeft size={10} fill="#65656B" className="" />
        <span className=" text-[.6rem]">reply</span>
    </button>
</div>
}