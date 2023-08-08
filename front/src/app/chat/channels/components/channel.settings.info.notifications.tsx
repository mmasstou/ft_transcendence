import { ImUserCheck } from "react-icons/im";
import { UserAvatar } from "./channel.userAvater";
import Button from "../../components/Button";
import { CgClose } from "react-icons/cg";
import { Socket } from "socket.io-client";

interface Props {
    notification: any;
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
        <div className="flex flex-row justify-start gap-3 items-center text-white">
            {/* <MdNotificationsActive size={24} /> */}
            <UserAvatar size={24} image={'/avatar.jpg'} />
            <h2 className=" text-md capitalize">aouhadou ask to join</h2>

        </div>
        <div className="flex flex-row items-center justify-center">
            <Button small outline icon={ImUserCheck} onClick={OnAceept} />
            <Button small outline icon={CgClose} onClick={OnDeny} />
        </div>
    </div>
}