import { usePathname, useRouter } from "next/navigation";
import ChanneLaccessDeniedHook from "../hooks/ChanneL.access.denied.hook";
import ChanneLModal from "./channel.modal";
import Image from "next/image"
interface ChanneLaccessDeniedProp {

}
export default function ChanneLaccessDeniedModaL(
    { }: ChanneLaccessDeniedProp
) {
    const channeLaccessDeniedHook = ChanneLaccessDeniedHook()
    const uri = usePathname()
    const router = useRouter()
    const bodyContent = (
        <div className=" w-full p-2 md:p-6 pt-0 md:pt-0 flex flex-col min-h-[34rem] h-full">
            <div className={`body flex flex-col gap-4 h-full w-full min-h-[28rem] `}>
                <div className="flex h-full w-full justify-center items-center min-h-[24rem] ">
                    <div className="flex flex-col justify-center items-center gap-3">
                        <Image src="/access_denied.svg" width={200} height={200} alt={""} />
                        <h2 className=" capitalize font-extrabold text-white">Access denied</h2>
                    </div>
                </div>
            </div>
        </div>
    )
    return <ChanneLModal
        IsOpen={channeLaccessDeniedHook.IsOpen}
        children={bodyContent}
        onClose={function (): void { 
            channeLaccessDeniedHook.onClose()
            router.push(uri)
         }} title={""} />
}