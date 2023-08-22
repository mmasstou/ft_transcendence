import { RoomsType } from "@/types/types";
import React from "react";
import { Socket } from "socket.io-client";
import ChanneLSettingsBody from "../channel.settings.body";

interface IProps {
    OnBack: () => void;
    OnClick: (data: any) => void
    socket: Socket | null
}
export default function ChanneLSettingsMemberFindModaL(
    { OnBack, OnClick, socket }: IProps
) {
    const [ChanneLInfo, setChanneLInfo] = React.useState<RoomsType | null>(null)

    return <ChanneLSettingsBody
    title={`find membes from ${ChanneLInfo?.name}`}
    OnBack={OnBack}
    HasPermission={false} >
<div>
    <h1>Comming soon</h1>
</div>
    </ChanneLSettingsBody>
}