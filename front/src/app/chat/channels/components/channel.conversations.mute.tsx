import { de } from "date-fns/locale";
import { CiVolumeMute } from "react-icons/ci";


export default function ChannelConversationsMute({IsActive}: {IsActive: boolean}) {
    if(!IsActive) return null;
    return <div className=" absolute top-0 left-0 w-full h-[83vh] md:h-[88vh]">
    <div className="relative flex justify-center items-center h-full w-full bg-[#24323083] z-[48] ">
        <div className=" absolute w-full h-[83vh] md:h-[88vh] flex justify-center items-center z-[49] ">
        </div>
        <div className="flex flex-col">
            <span className=" text-9xl">🤫</span>
            {/* <CiVolumeMute className=" text-secondary" size={120} /> */}
            {/* <p className="text-white">you Are Muted</p> */}
        </div>
    </div>
</div>
}