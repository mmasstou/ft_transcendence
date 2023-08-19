import { userType } from "@/types/types";
import Image from "next/image"
import { IconType } from "react-icons";
import { PiGameControllerFill } from "react-icons/pi";
import { RiRadioButtonFill, RiRadioButtonLine } from "react-icons/ri";

export function UserAvatar({ image, size, User }: { image: string; size?: number;User ?: userType }) {
    const _size = size ? size : 28
    const _color = User && User.status !== 'online' ? 'danger' : 'secondary'
    const Icon : IconType = User && User.status === 'online' ? RiRadioButtonLine : PiGameControllerFill 
    return <div className={`relative min-w-[${_size}px]`}>
        {User && <div className={`absolute right-0 bottom-0 z-10 flex flex-row items-center gap-2 fill-${_color} text-${_color} bg-[#243230e0] rounded-full p-[1px]`}><Icon size={_size / 3} /></div>}
        <div className={`image  min-w-[${_size}px] rounded-full overflow-hidden relative z-[9]`}>
            {/* <div className="flex flex-row items-center gap-2 fill-secondary text-secondary"><RiRadioButtonLine size={12} /></div> */}
            <Image className="" src={image} alt={"avatar"} width={_size} height={_size} />
        </div>
    </div>
}