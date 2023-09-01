"use client"
import { RoomsType, membersType, updatememberEnum, userType } from "@/types/types"
import Cookies from "js-cookie"
import { useParams, useRouter } from "next/navigation"
import React, { useEffect, useState } from "react"
import { FieldValues, useForm } from "react-hook-form"


import Button from "../../components/Button"
import getUserWithId from "../actions/getUserWithId"
import ChanneLModal from "./channel.modal"

import toast from "react-hot-toast"
import { FaUsersCog } from "react-icons/fa"
import { RiChatSettingsLine } from "react-icons/ri"
import FindOneBySLug from "../actions/Channel/findOneBySlug"
import getChannelMembersWithId from "../actions/getChannelmembers"
import getMemberWithId from "../actions/getMemberWithId"
import ChanneLChatSettings from "../components/settings/ChanneL/channel.settings.channel"
import ChanneLUserSettings from "../components/settings/User/channel.settings.user"
import ChannelSettingsUserMemberItem from "../components/settings/User/channel.settings.user.memberItem"
import ChanneLConfirmActionHook from "../hooks/channel.confirm.action"
import ChanneLsettingsHook from "../hooks/channel.settings"
enum RoomType {
    PUBLIC = 'PUBLIC',
    PRIVATE = 'PRIVATE',
}
const ChanneLSettingsModaL = () => {
    const query = useParams();
    const slug: string = typeof query.slug === 'string' ? query.slug : '';
    const [IsMounted, setMounted] = useState<boolean>(false)
    const { IsOpen, onClose, onOpen, selectedchanneL, socket } = ChanneLsettingsHook()
    const [ChanneLInfo, setChanneLInfo] = useState<RoomsType | null>(null)
    const [UserInfo, setUserInfo] = useState<userType | null>(null)
    const [MemberInfo, setMemberInfo] = useState<membersType | null>(null)
    const [aLLMembersList, setaLLMembersList] = React.useState<membersType[] | null>(null)
    const [IsLoading, setLoading] = React.useState<boolean>(true)
    const channeLConfirmActionHook = ChanneLConfirmActionHook()
    const channeLsettingsHook = ChanneLsettingsHook()
    const route = useRouter()
    const token: any = Cookies.get('token');
    const UserId: any = Cookies.get('_id');
    if (!token || !UserId)
        return;



    const UpdateData = async () => {
        if (!UserId || !slug || !token) return;
        const channeL: RoomsType | null = await FindOneBySLug(slug, token)
        if (!channeL) return;
        setChanneLInfo(channeL);
        const member: membersType | null = await getMemberWithId(UserId, channeL.id, token)
        if (!member) return;
        setMemberInfo(member);
        setTimeout(() => {
            setLoading(false)
        }, 400);
    }
    React.useEffect(() => {

        setMounted(true)
        UpdateData();

    }, [])

    React.useEffect(() => {
        socket?.on(`${process.env.NEXT_PUBLIC_SOCKET_EVENT_RESPONSE_CHAT_MEMBER_UPDATE}`, (data) => {
            if (!data.OK) return
            UpdateData();
        });
        socket?.on(`${process.env.NEXT_PUBLIC_SOCKET_EVENT_RESPONSE_CHAT_UPDATE}`, (data) => {
            if (!data.OK) return
            UpdateData();
        });
        socket?.on(
            `${process.env.NEXT_PUBLIC_SOCKET_EVENT_RESPONSE_CHAT_DELETE}`,
            (data: { Ok: boolean }) => {

                if (data.Ok) {
                    toast.success('delete successfully')
                    channeLConfirmActionHook.onClose()
                    channeLsettingsHook.onClose()
                    route.push(`/chat/channels`)
                    route.refresh();
                    return
                }
                else {
                    toast.error("can't delete this channel")
                    channeLConfirmActionHook.onClose()
                }
            }
        );
        socket?.on(
            `${process.env.NEXT_PUBLIC_SOCKET_EVENT_RESPONSE_CHAT_MEMBER_LEAVE}`,
            (data: { Ok: boolean, message: string, member: membersType }) => {

                if (!data.Ok) {
                    channeLConfirmActionHook.onClose()
                    return toast.error("can't leave this channel")
                }
                if (data.member.userId === UserId) {
                    channeLConfirmActionHook.onClose()
                    channeLsettingsHook.onClose()
                    route.push(`/chat/channels`)
                    route.refresh();
                }
            }
        );
        return () => {
            socket?.off(`${process.env.NEXT_PUBLIC_SOCKET_EVENT_RESPONSE_CHAT_MEMBER_UPDATE}`)
            socket?.off(`${process.env.NEXT_PUBLIC_SOCKET_EVENT_RESPONSE_CHAT_UPDATE}`)
            socket?.off(`${process.env.NEXT_PUBLIC_SOCKET_EVENT_RESPONSE_CHAT_DELETE}`)
            socket?.off(`${process.env.NEXT_PUBLIC_SOCKET_EVENT_RESPONSE_CHAT_MEMBER_LEAVE}`)
        }
    }, [socket])

    useEffect(() => {
        (async () => {
            const channeLinfo = await FindOneBySLug(slug, token)
            if (!channeLinfo) return
            const userInfo = await getUserWithId(UserId, token)
            const memberInfo = await getMemberWithId(UserId, channeLinfo.id, token)
            const aLLMembersList = await getChannelMembersWithId(channeLinfo.id, token)
            if (!aLLMembersList) return
            setaLLMembersList(aLLMembersList)
            userInfo && setUserInfo(userInfo)
            memberInfo && setMemberInfo(memberInfo)
            setChanneLInfo(channeLinfo)
        })();
        setMounted(true)
    }, [slug])

    const { setValue, watch, reset, } = useForm<FieldValues>({
        defaultValues: {
            channeLtype: "UserSettings"
        },
    });

    const _channeLtype = watch('channeLtype')


    const setcustomvalue = (key: any, value: any) => {
        setValue(key, value, { shouldValidate: true, shouldDirty: true, shouldTouch: true })
    }

    const handlOnclick = (data: any) => {
        console.log("const handlOnclick = (data: any)", data)
        const __message = data.updateType === updatememberEnum.LEAVECHANNEL
            ? 'are ypu sure you whon to leave channel ?'
            : data.updateType === updatememberEnum.DELETECHANNEL
            && 'are ypu sure you whon to delete channel ?'
        __message && channeLConfirmActionHook.onOpen(
            <button
                onClick={() => {
                    if (data.updateType === updatememberEnum.LEAVECHANNEL) {
                        console.log("data.updateType === updatememberEnum.LEAVECHANNEL", data.updateType === updatememberEnum.LEAVECHANNEL)
                        socket?.emit(
                            `${process.env.NEXT_PUBLIC_SOCKET_EVENT_CHAT_MEMBER_LEAVE}`,
                            { roomId: ChanneLInfo?.id }
                        )
                    }
                    if (data.updateType === updatememberEnum.DELETECHANNEL) {
                        socket?.emit(
                            `${process.env.NEXT_PUBLIC_SOCKET_EVENT_DELETE_CHAT}`,
                            { roomId: ChanneLInfo?.id, userId: UserId }
                        )
                    }
                }}
                className="text-balck hover:text-danger  border border-secondary bg-secondary text-sm font-bold lowercase  px-7 py-3 rounded-[12px]  w-full">
                {data.updateType === updatememberEnum.LEAVECHANNEL && 'Leave Channel'}
                {data.updateType === updatememberEnum.DELETECHANNEL && 'Delete Channel'}
            </button>
            , __message
        )

    }
    if (!IsMounted) return null;

    let bodyContent = (
        <div className=" w-full p-2 md:p-6 pt-0 md:pt-0 flex flex-col h-[43rem]">
            <div className="flex flex-row justify-start gap-3 items-center text-white">
                <span className={` text-3xl `}>#</span>
                <div className="flex flex-row items-center justify-between w-full">
                    <div className=" flex items-center gap-2">
                        <h2 className="text-xl">{ChanneLInfo?.name}</h2>
                        <span className=" text-secondary text-sm font-medium">{ChanneLInfo?.type}</span>
                        <span className="text-xs font-medium">[ {aLLMembersList?.length} members ]</span>

                    </div>
                </div>
            </div>
            {MemberInfo && <ChannelSettingsUserMemberItem
                member={MemberInfo}
                socket={socket}
                UserJoin={false}
                UserOwne={false}
                UserProfile
                OnClick={handlOnclick} />}

            {!MemberInfo?.isban
                ? <>
                    <div className={`body flex flex-col gap-4 h-full w-full min-h-[32rem]`}>
                        {
                            _channeLtype === "UserSettings"
                                ? <ChanneLUserSettings
                                    socket={socket}
                                    room={ChanneLInfo}
                                    User={UserInfo}
                                    member={MemberInfo}
                                />
                                : _channeLtype === "ChatSettings"
                                && <ChanneLChatSettings socket={socket} />

                        }
                    </div>
                    <div className=" w-full flex flex-row h-max justify-around items-center mb-5 text-white ">
                        <Button
                            icon={FaUsersCog}
                            label={"User Settings"}
                            outline
                            responsive
                            showLabeL
                            IsActive={_channeLtype === "UserSettings"}
                            onClick={() => { setcustomvalue("channeLtype", "UserSettings") }}
                        />
                        <Button
                            icon={RiChatSettingsLine}
                            label={"ChanneL Settings"}
                            outline
                            showLabeL
                            responsive
                            IsActive={_channeLtype === "ChatSettings"}
                            onClick={() => { setcustomvalue("channeLtype", "ChatSettings") }}
                        />
                    </div>
                </>
                : <div className="body flex flex-col gap-4 h-full w-full min-h-[32rem]">You Are baneed from this channel</div>}

        </div>
    )
    return <ChanneLModal
        IsOpen={IsOpen}
        title={` ${ChanneLInfo?.name} settings`}
        children={bodyContent}
        onClose={() => {
            onClose()
            reset()
        }} />

}
export default ChanneLSettingsModaL