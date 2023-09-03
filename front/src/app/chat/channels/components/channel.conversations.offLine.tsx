import { CiVolumeMute } from "react-icons/ci"
import { RiSignalWifiOffLine } from "react-icons/ri"

interface ConversationsOffLineInterface {
    IsOffLine?: boolean
}
export default function ConversationsOffLine({ IsOffLine }: ConversationsOffLineInterface) {
    if (!IsOffLine)
        return null
    return <div className=" absolute top-0 left-0 w-full h-[83vh] md:h-[88vh]">
        <div className="relative flex justify-center items-center h-full w-full bg-[#24323083] z-[48] ">
            <div className=" absolute w-full h-[83vh] md:h-[88vh] flex justify-center items-center z-[49] ">
            </div>
            <div className="flex flex-col">
                <RiSignalWifiOffLine className=" text-secondary font-thin" size={120} />
            </div>
        </div>
    </div>
}