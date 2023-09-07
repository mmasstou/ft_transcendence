
"use client"
import { RoomsType, membersType } from '@/types/types';
import Cookies from 'js-cookie';
import { useParams, useSearchParams } from 'next/navigation';
import React from 'react';
import { Socket } from 'socket.io-client';
import FindOneBySLug from '../../../actions/findOneBySlug';
import getChannelMembersWithId from '../../../actions/getChannelmembers';
import getMemberWithId from '../../../actions/getMemberWithId';
import ChanneLConfirmActionHook from '../../../hooks/channel.confirm.action';
import ChanneLaccessDeniedModaL from '../../../modaLs/channel.access.denied.modaL';
import SettingsProvider from '../../../providers/channel.settings.provider';
import ChanneLsettingsIndex from './channel.settings.channel.Index';
import ChanneLSettingsChanneLBanedMember from './channel.settings.channel.banedmember';
import ChanneLSettingsChanneLChangePassword from './channel.settings.channel.changepassword';
import ChanneLSettingsChanneLChangeType from './channel.settings.channel.changetype';
import ChanneLsettingsChanneLsetOwner from './channel.settings.channel.setOwner';
interface ChanneLChatSettingsProps {
    socket: Socket | null
}

// create enum for channel type
export enum SETTINGSTEPS {
    CHOICE = 0,
    EDITPASSWORD = 1,
    CHANGECHANNEL = 2,
    BANEDMEMBERS = 3,
    SETOWNER = 4,
    LEAVECHANNEL = 5,
    ACCESSPASSWORD = 6,
    REMOVEACCESSPASSWORD = 7,
    DELETECHANNEL = 8,
    EDITACCESSPASSWORD = 9
}


export default function ChanneLChatSettings({ socket }: ChanneLChatSettingsProps) {
    const [step, setStep] = React.useState<SETTINGSTEPS>(SETTINGSTEPS.CHOICE)
    const [update, setUpdate] = React.useState<boolean>(false)
    const [members, setMembers] = React.useState<membersType[] | null>(null)
    const [LogedMember, setLogedMember] = React.useState<membersType | null>(null)
    const [ChanneLinfo, setChanneLinfo] = React.useState<RoomsType | null>(null)
    const channeLConfirmActionHook = ChanneLConfirmActionHook()
    const params = useSearchParams()
    const __userId = Cookies.get('_id')
    const token: any = Cookies.get('token');
    if (!token || !__userId) return <ChanneLaccessDeniedModaL />
    const query = useParams();
    const slug: string = typeof query.slug === 'string' ? query.slug : query.slug[0];

    React.useEffect(() => {

        (async () => {
            const ChanneLinfo = await FindOneBySLug(slug, token)
            if (!ChanneLinfo)
                return;
            setChanneLinfo(ChanneLinfo)
            const channeLLMembers = await getChannelMembersWithId(ChanneLinfo.id, token)
            if (!channeLLMembers) return;
            setMembers(channeLLMembers.filter((member: membersType) => member.userId !== __userId))
            const channeLLMember: membersType = __userId && await getMemberWithId(__userId, ChanneLinfo.id, token)
            if (!channeLLMember) return;
            setLogedMember(channeLLMember)

        })();
    }, [])

    React.useEffect(() => {
        // get channel info :
        const token: any = Cookies.get('token');
        if (!token) return;
        (async () => {
            const ChanneLinfo = await FindOneBySLug(slug, token)
            if (ChanneLinfo) {
                setChanneLinfo(ChanneLinfo)
            }
        })();
    }, [step])

    React.useEffect(() => {

        // listen to channels actions response events :

        // change channel password :
        socket?.on(`SOCKET_EVENT_RESPONSE_CHAT_CHANGE_PROTACTED_PASSWORD`, (data) => {

        })
        // change type :
        socket?.on(`SOCKET_EVENT_RESPONSE_CHAT_CHANGE_TYPE`, (data) => {

        })
        // set access password :
        socket?.on(`SOCKET_EVENT_RESPONSE_CHAT_SET_ACCESS_PASSWORD`, (data) => {

        })
        // remove access password :
        socket?.on(`SOCKET_EVENT_RESPONSE_CHAT_REMOVE_ACCESS_PASSWORD`, (data) => {
            if (!data) return
            channeLConfirmActionHook.onClose()
            setChanneLinfo(data);
            OnBack()
        })

        socket?.on(`SOCKET_EVENT_RESPONSE_CHAT_UPDATE`, (data) => {

        })
    }, [socket])


    const OnBack = () => {
        setStep(SETTINGSTEPS.CHOICE)
    }


    let _body = <ChanneLsettingsIndex socket={socket} onClick={(data: { to: SETTINGSTEPS }) => {
        setStep(data.to)
    }} />

    if (step === SETTINGSTEPS.BANEDMEMBERS) {
        _body = members
            ? <ChanneLSettingsChanneLBanedMember
                setUpdate={setUpdate}
                socket={socket}
                OnBack={OnBack} LogedMember={LogedMember} members={members.filter((member: membersType) => member.isban === true)}
            />
            : (<div> no member is baned </div>)
    }
    if (step === SETTINGSTEPS.SETOWNER) {
        _body = members ? <ChanneLsettingsChanneLsetOwner
            setUpdate={setUpdate}
            socket={socket}
            OnBack={OnBack} LogedMember={LogedMember} members={members}
        /> : (<div></div >)
    }

    if (step === SETTINGSTEPS.CHANGECHANNEL) {
        _body = <ChanneLSettingsChanneLChangeType
            setUpdate={setUpdate}
            socket={socket}
            OnBack={OnBack}
            LogedMember={LogedMember}
            members={members}
        />
    }
    if (step === SETTINGSTEPS.EDITPASSWORD) {
        _body = <ChanneLSettingsChanneLChangePassword
            setUpdate={setUpdate}
            socket={socket}
            OnBack={OnBack}
            LogedMember={LogedMember}
            members={members}
        />

    }

    return <SettingsProvider >
        {_body}
    </SettingsProvider>
}