import Image from "next/image"

export function UserAvatar({ image, size }: { image: string; size?: number; }) {
    const _size = size ? size : 28
    return <div className={`image  min-w-[${_size}px] rounded-full overflow-hidden`}>
        <Image src={image} alt={"avatar"} width={_size} height={_size} />
    </div>
}