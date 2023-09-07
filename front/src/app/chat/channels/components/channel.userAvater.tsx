import { userType } from "@/types/types";
import * as Avatar from '@radix-ui/react-avatar';
import { useRouter } from "next/navigation";
import React from "react";
import { IconType } from "react-icons";
import { PiGameControllerFill } from "react-icons/pi";
import { RiRadioButtonLine } from "react-icons/ri";

export function UserAvatar(
    { image, size, User, showsatatus = true }:
        { image: string; size?: number; User?: userType, showsatatus?: boolean }) {
    if (!User) return;
    const [IsMounted, setIsMounted] = React.useState(false)
    const [IsLoading, setIsLoading] = React.useState(true)
    const [imageUrl, setImageUrl] = React.useState<string>('/avatar.png')
    const router = useRouter()
    const _size = size ? size : 28
    const _color = User && User.status !== 'online' ? User.status === 'offline' ? 'danger' : 'yellow-500' : 'secondary'
    const Icon: IconType = User && User.status === 'online' ? RiRadioButtonLine : PiGameControllerFill

    React.useEffect(() => {
        setIsLoading(true);
        (async () => {
            try {
                const response = await fetch(image);
                if (!response.ok) {
                    return;
                }
                setImageUrl(image)

            } catch (error: any) {
                console.error("An error occurred while fetching the image:", error.message);
            }
            setIsMounted(true)

        })();
        setIsLoading(false);
    }, [])

    return <div className="cursor-pointer w-[32px] h-[32px]">
        <Avatar.Root
            className={`flex justify-center items-center flex-inline align-middle overflow-hidden select-none
            rounded-full w-full h-full`}
        >
            <Avatar.Image
                className="w-full h-full object-cover border-secondary rounded-full"
                src={User?.avatar}
                sizes="100%"
                alt="User Avatar"
            />
        </Avatar.Root>

        {/* {User && <MyAvatar User={User} />} */}
    </div>
}