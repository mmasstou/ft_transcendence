import { RoomTypeEnum, RoomsType } from "@/types/types";
import ChanneLsettingsProvider from "./channel.settings.chnnel.provider";
import React from "react";
import { SETTINGSTEPS } from "./channel.settings.channel";
import { GoEyeClosed } from "react-icons/go";
import Cookies from "js-cookie";
import ChanneLaccessDeniedModaL from "../../../modaLs/channel.access.denied.modaL";
import { useParams } from "next/navigation";
import FindOneBySLug from "../../../actions/Channel/findOneBySlug";
import ChanneLSettingsItem from "./channel.settings.channel.Item";
import { FaChessQueen, FaUserTimes } from "react-icons/fa";
import { Socket } from "socket.io-client";

interface props {
    onClick: (data: { to: SETTINGSTEPS }) => void;
    socket: Socket | null;
}
export default function ChanneLsettingsIndex(props: props) {
    const [ChanneLinfo, setChanneLinfo] = React.useState<RoomsType | null>(null)
    const __userId = Cookies.get('_id')
    const token: any = Cookies.get('token');
    if (!token || !__userId) return <ChanneLaccessDeniedModaL />
    const query = useParams();
    const slug: string = typeof query.slug === 'string' ? query.slug : query.slug[0];
    React.useEffect(() => {
        if (!slug) return;
        (async () => {
            const channeL: RoomsType = await FindOneBySLug(slug, token)
            if (!channeL) return;
            setChanneLinfo(channeL);
        })();
    }, [])
    return <ChanneLsettingsProvider socket={props.socket}  >
        <div className="flex h-full flex-col justify-between items-start min-h-[34rem] w-full">
            <div className="flex flex-col gap-2 w-full">
                {ChanneLinfo && ChanneLinfo.type == RoomTypeEnum.PROTECTED &&
                    <ChanneLSettingsItem
                        onClick={() => {
                            props.onClick({ to: SETTINGSTEPS.EDITPASSWORD })
                        }}
                        icon={GoEyeClosed}
                        label={"Change password"}
                    />
                }
                <ChanneLSettingsItem
                    onClick={() => {
                        props.onClick({ to: SETTINGSTEPS.BANEDMEMBERS })
                    }}
                    icon={FaUserTimes}
                    label={"Baned members"}
                />
                <ChanneLSettingsItem
                    onClick={() => {
                        props.onClick({ to: SETTINGSTEPS.SETOWNER })
                    }}
                    icon={FaChessQueen}
                    label={"set owner"}
                />
                {/* <ChanneLSettingsOptionItem
                    onClick={OnChangeChannel}
                    icon={CgEditFlipH}
                    label={"Change Type"}
                />
                <ChanneLSettingsOptionItem
                    onClick={OnBanedMembers}
                    icon={FaUserTimes}
                    label={"Baned members"}
                />
                <ChanneLSettingsOptionItem
                    onClick={OnSetOwner}
                    icon={FaChessQueen}
                    label={"set owner"}
                />
                {!ChanneLinfo?.hasAccess &&
                    <ChanneLSettingsOptionItem
                        onClick={OnAccessPassword}
                        icon={TbPassword}
                        label={"set access password"}
                    />}
                {ChanneLinfo?.hasAccess &&
                    <ChanneLSettingsOptionItem
                        onClick={OnEditAccessPassword}
                        icon={PiPasswordBold}
                        label={"set access password"}
                    />}
                {ChanneLinfo?.hasAccess &&
                    <ChanneLSettingsOptionItem
                        onClick={DeleteAccessPassword}
                        icon={IoBagRemove}
                        label={"remove access password"}
                    />} */}
            </div>
        </div>
    </ChanneLsettingsProvider>
}