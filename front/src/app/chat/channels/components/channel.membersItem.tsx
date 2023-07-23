import { membersType, userType } from "@/types/types";
import React from "react";
import getUserWithId from "../actions/getUserWithId";
import Cookies from "js-cookie";
import { set } from "react-hook-form";
import { FaChessQueen } from "react-icons/fa";
import { UserAvatar } from "./channel.userAvater";
import { useSearchParams } from "next/navigation";



interface IChannelMembersItemProps {
    member : membersType;
}
export default function ChanneLsmembersItem( {member} : IChannelMembersItemProps) {
    const [IsMounted, setIsMounted] = React.useState(false)
    const [UserInfo, setUserInfo] = React.useState< userType | null>(null)
    const params = useSearchParams()

    React.useEffect(() => {
        setIsMounted(true)
    }, [])


    React.useEffect(() => {
        (async () => {
            const token: any = Cookies.get('token');
            const response = await getUserWithId(member.userId, token)
            setUserInfo(response)
        })();
    }, [params.get('r')])

    return <div className="flex flex-row gap-3 items-center">

<div className="MessagesenderInfo w-full boredr-2  -green-500 flex flex-row items-center p-1 gap-4">
                <div className="flex flex-row items-center p-1 gap-1">
                <UserAvatar size={18} image={"/avatar.jpg"} />
                <h3 className="text-base font-light text-[#FFFFFF]">{UserInfo?.login}</h3>
                </div>
                {member.type === 'OWNER' && <FaChessQueen fill="#FFBF00" />}
            </div>
    </div>
}