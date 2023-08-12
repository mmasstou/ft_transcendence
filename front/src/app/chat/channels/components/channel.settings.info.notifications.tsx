import { ImUserCheck } from "react-icons/im";
import { UserAvatar } from "./channel.userAvater";
import Button from "../../components/Button";
import { CgClose } from "react-icons/cg";
import { Socket } from "socket.io-client";
import { MdNotificationsActive } from "react-icons/md";
import { BsInfoLg } from "react-icons/bs";
import { ChanneLnotificationType } from "@/types/types";
import TimeAgo from "./TimeAgo";

interface Props {
    notification: ChanneLnotificationType;
    socket : Socket | null;
}
export default function ChanneLSettingsInfonotifications(
    { notification, socket}: Props
) {
    const OnAceept = () => {
        console.log("OnAceept ")
    }
    const OnDeny = () => {
        console.log("OnDeny ")
    }
    return <div className="ChanneLInvitaion flex flex-row justify-between items-center">
        <div className="flex flex-row justify-start gap-3 items-center text-[#929190]">
            <BsInfoLg  size={18} />
            {/* <UserAvatar size={24} image={'/avatar.jpg'} /> */}
            <h2 className=" text-sm capitalize">{notification.content}</h2>

        </div>
        <TimeAgo timestamp={notification.created_at} />
        {/* <div className="flex flex-row items-center justify-center">
            <Button small outline icon={ImUserCheck} onClick={OnAceept} />
            <Button small outline icon={CgClose} onClick={OnDeny} />
        </div> */}
    </div>
}