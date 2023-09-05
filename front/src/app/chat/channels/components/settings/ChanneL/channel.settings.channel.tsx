
"use client"
import { RoomsType, UpdateChanneLSendData, UpdateChanneLSendEnum, membersType } from '@/types/types';
import Cookies from 'js-cookie';
import { useParams, useSearchParams } from 'next/navigation';
import React from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Socket } from 'socket.io-client';
import FindOneBySLug from '../../../actions/Channel/findOneBySlug';
import getChannelMembersWithId from '../../../actions/getChannelmembers';
import getMemberWithId from '../../../actions/getMemberWithId';
import ChanneLConfirmActionHook from '../../../hooks/channel.confirm.action';
import ChanneLaccessDeniedModaL from '../../../modaLs/channel.access.denied.modaL';
import SettingsProvider from '../../../providers/channel.settings.provider';
import ChanneLSettingsChanneLAccessPassword from '../../channel.settings.channel.accesspassword';
import ChanneLSettingsChanneLDeleteChannel from '../../channel.settings.channel.deletechannel';
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

    const DeleteAccessPassword = async () => {
        if (!ChanneLinfo) return;

        const data: UpdateChanneLSendData = {
            Updatetype: UpdateChanneLSendEnum.REMOVEACCESSEPASSWORD,
            room: ChanneLinfo,
        }
        // chack if  password is not empty and if password is not equal to confirm password
        const __message = 'are you sure you whon to access password`s for this channel';
        __message && channeLConfirmActionHook.onOpen(
            <button
                onClick={() => {
                    socket?.emit(`SOCKET_EVENT_CHAT_UPDATE`, data)
                }}
                className="text-balck hover:text-danger  border border-secondary bg-secondary text-sm font-bold lowercase  px-7 py-3 rounded-[12px]  w-full">
                remove Access password
            </button>
            , __message
        )
        // send data to server
        // socket?.emit(`SOCKET_EVENT_CHAT_UPDATE`, data)
        //   reset data for password
        // reset()
    }

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


    const {
        control,
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors },
    } = useForm<FieldValues>({
        defaultValues: {
            ChanneLpassword: "",
            newChanneLpassword: "",
            confirmChanneLpassword: "",
            channeLtype: ""
        },
    });
    const _channeLpassword = watch('ChanneLpassword')
    const _newChanneLpassword = watch('newChanneLpassword')
    const _confirmChanneLpassword = watch('confirmChanneLpassword')
    const _channeLtype = watch('channeLtype')
    const setcustomvalue = (key: any, value: any) => {
        setValue(key, value, { shouldValidate: true, shouldDirty: true, shouldTouch: true })
    }
    const OnEditPassword = () => {
        setStep(SETTINGSTEPS.EDITPASSWORD)
    }
    const OnChangeChannel = () => {
        setStep(SETTINGSTEPS.CHANGECHANNEL)
    }
    const OnBanedMembers = () => {
        setStep(SETTINGSTEPS.BANEDMEMBERS)
    }
    const OnSetOwner = () => {
        setStep(SETTINGSTEPS.SETOWNER)
    }
    const OnBack = () => {
        setStep(SETTINGSTEPS.CHOICE)
    }
    const OnEditAccessPassword = () => {
        setStep(SETTINGSTEPS.EDITACCESSPASSWORD)
    }
    const OnAccessPassword = () => {
        setStep(SETTINGSTEPS.ACCESSPASSWORD)
    }
    const OnRemoveAccessPassword = () => { }
    const OnLeave = () => { }
    const OnDeleteChannel = () => { setStep(SETTINGSTEPS.DELETECHANNEL) }



    // let _body = (
    //     <div className="flex h-full flex-col justify-between items-start min-h-[34rem] ">
    //         <div className="flex flex-col gap-2 w-full">
    //             {ChanneLinfo && ChanneLinfo.type == RoomTypeEnum.PROTECTED &&
    //                 <ChanneLSettingsOptionItem
    //                     onClick={function (): void { OnEditPassword(); }}
    //                     icon={GoEyeClosed}
    //                     label={"Change password"}
    //                 />
    //             }
    //             <ChanneLSettingsOptionItem
    //                 onClick={OnChangeChannel}
    //                 icon={CgEditFlipH}
    //                 label={"Change Type"}
    //             />
    //             <ChanneLSettingsOptionItem
    //                 onClick={OnBanedMembers}
    //                 icon={FaUserTimes}
    //                 label={"Baned members"}
    //             />
    //             <ChanneLSettingsOptionItem
    //                 onClick={OnSetOwner}
    //                 icon={FaChessQueen}
    //                 label={"set owner"}
    //             />
    //             {!ChanneLinfo?.hasAccess &&
    //                 <ChanneLSettingsOptionItem
    //                     onClick={OnAccessPassword}
    //                     icon={TbPassword}
    //                     label={"set access password"}
    //                 />}
    //             {ChanneLinfo?.hasAccess &&
    //                 <ChanneLSettingsOptionItem
    //                     onClick={OnEditAccessPassword}
    //                     icon={PiPasswordBold}
    //                     label={"set access password"}
    //                 />}
    //             {ChanneLinfo?.hasAccess &&
    //                 <ChanneLSettingsOptionItem
    //                     onClick={DeleteAccessPassword}
    //                     icon={IoBagRemove}
    //                     label={"remove access password"}
    //                 />}
    //         </div>
    //     </div>
    // )
    let _body = <ChanneLsettingsIndex socket={socket} onClick={(data: { to: SETTINGSTEPS }) => {
        setStep(data.to)
    }} />

    // if (LogedMember?.type !== UserTypeEnum.OWNER) {
    //     _body = (<PermissionDenied />)
    // }

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
    if (step === SETTINGSTEPS.ACCESSPASSWORD && !ChanneLinfo?.hasAccess) {
        _body = <ChanneLSettingsChanneLAccessPassword

            setUpdate={setUpdate}
            socket={socket}
            OnBack={OnBack}
            LogedMember={LogedMember}
            members={members}
        />
    }
    if (step === SETTINGSTEPS.EDITACCESSPASSWORD && ChanneLinfo?.hasAccess) {
        _body = <ChanneLSettingsChanneLAccessPassword
            setUpdate={setUpdate}
            socket={socket}
            title="Edit Access Password"
            OnBack={OnBack}
            LogedMember={LogedMember}
            members={members}
        />
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
    if (step === SETTINGSTEPS.DELETECHANNEL) {
        _body = <ChanneLSettingsChanneLDeleteChannel room={ChanneLinfo} OnBack={OnBack} socket={socket} />
    }
    return <SettingsProvider >
        {_body}
    </SettingsProvider>
}