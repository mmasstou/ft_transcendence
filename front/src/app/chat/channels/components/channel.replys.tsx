import { AiFillMessage } from "react-icons/ai";
<<<<<<< HEAD
import { CgOptions } from "react-icons/cg";
import { HiArrowUturnLeft } from "react-icons/hi2";
import Button from "../../components/Button";
=======
import { HiArrowUturnLeft } from "react-icons/hi2";
>>>>>>> 83667b2c2c6fcadfdbeb783afabb311e9d36e57c


export function ChannelReplys({ replys }: { replys ?: any[] }) {
    return  <div className=" absolute bottom-0 right-11 flex flex-row gap-4 ">
<<<<<<< HEAD
    {/* <button className="rounded-full flex flex-row bg-primary shadow gap-1 p-1 items-center justify-between text-[#65656B] ">
        <CgOptions size={10} fill="#65656B" className="" />
    </button> */}
   
    {/* <button className="rounded-full flex flex-row bg-primary shadow gap-1 p-1 items-center justify-between text-[#65656B] ">
        <HiArrowUturnLeft size={10} fill="#65656B" className="" />
        <span className=" text-[.6rem]">reply</span>
    </button> */}
=======
    <button className="rounded-full flex flex-row bg-primary shadow gap-1 p-1 items-center justify-between text-[#65656B] ">
        <AiFillMessage size={10} fill="#65656B" className="" />
        <span className=" text-[.6rem]">12</span>
    </button>
    <button className="rounded-full flex flex-row bg-primary shadow gap-1 p-1 items-center justify-between text-[#65656B] ">
        <HiArrowUturnLeft size={10} fill="#65656B" className="" />
        <span className=" text-[.6rem]">reply</span>
    </button>
>>>>>>> 83667b2c2c6fcadfdbeb783afabb311e9d36e57c
</div>
}