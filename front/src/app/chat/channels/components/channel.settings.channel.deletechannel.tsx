import { IoChevronBackOutline } from "react-icons/io5"
import Button from "../../components/Button"
import Image from "next/image"
import { MdOutlineCancel, MdOutlineScoreboard } from "react-icons/md"
import { Socket } from "socket.io-client"
import { AiOutlineDelete } from "react-icons/ai"
import Cookies from "js-cookie"
import { RoomsType } from "@/types/types"
import ChanneLsettingsHook from "../hooks/channel.settings"
import { useRouter } from "next/navigation"
interface ChanneLUserSettingsProps {
    OnBack: () => void;
    socket: Socket | null
    room : RoomsType | null
}
export default function ChanneLSettingsChanneLDeleteChannel(
    { OnBack, socket, room }: ChanneLUserSettingsProps) {
        const channeLsettingsHook = ChanneLsettingsHook()
        const router = useRouter()
        socket?.on("deleteChannelResponseEvent", (data) => {
            if (data){
                channeLsettingsHook.onClose()
                router.push("/chat/channels");
                // router.refresh()
            }
        })
    return <div className="flex flex-col justify-start">
        <div className=" grid grid-cols-3 items-center">
            <Button
                icon={IoChevronBackOutline}
                label={"back"}
                outline
                size={21}
                labelsize={8}
                onClick={OnBack}
            />
            <Button
                label={"Delete Channel"}
                outline
                responsive
                onClick={() => { }}
            />
        </div>
        <div className="overflow-y-scroll max-h-[34rem] flex flex-col w-full">
            <div className="flex flex-col h-full w-full justify-around gap-6 items-center min-h-[34rem] ">
                <div className="flex flex-col justify-center items-center gap-3">
                    <Image src="/delete.svg" width={150} height={150} alt={""} />
                    {/* <h2 className=" capitalize font-extrabold text-white">permission denied</h2> */}
                </div>
                <div className="flex flex-row justify-between gap-4 w-full px-6">
                    <button
                        onClick={() => {
                            socket?.emit("deleteChannel", { room: room })
                        }}
                        className="flex flex-row w-full justify-around items-center shadow border border-danger  rounded hover:border-danger hover:border">
                        <div className='flex justify-center items-center p-3 rounded  text-white'>
                            <AiOutlineDelete className=" " size={28} />
                        </div>
                        <div>
                            <h2 className='text-white'>Delete</h2>
                        </div>
                        {/* <div className='text-white'>
                            <BsArrowRightShort size={24} />
                        </div> */}
                    </button>
                    <button
                        onClick={OnBack}
                        className="flex flex-row w-full justify-around items-center shadow border border-secondary rounded hover:border-secondary hover:border">
                        <div className='flex justify-center items-center p-3 rounded  text-white'>
                            <MdOutlineCancel fill="#FFFFFF" size={28} />
                        </div>
                        <div>
                            <h2 className='text-white'>Cancel</h2>
                        </div>
                        {/* <div className='text-white'>
                            <BsArrowRightShort size={24} />
                        </div> */}
                    </button>

                </div>
            </div>
        </div>

    </div>
}