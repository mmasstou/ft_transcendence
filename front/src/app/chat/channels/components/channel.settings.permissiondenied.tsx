import Image from 'next/image'
interface props {

}

export default function PermissionDenied(
    { }: props
) {
    return <div className="flex h-full w-full justify-center items-center min-h-[34rem] ">
        <div className="flex flex-col justify-center items-center gap-3">
            <Image src="/access_denied.svg" width={200} height={200} alt={""} />
            <h2 className=" capitalize font-extrabold text-white">permission denied</h2>
        </div>
    </div>
}