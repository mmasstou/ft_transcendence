"use client"
import ContactHook from "@/hooks/contactHook"
import { TiArrowMinimise } from "react-icons/ti"
import { RegisterOptions, FieldValues, UseFormRegisterReturn, useForm, SubmitHandler, useFieldArray, set } from "react-hook-form"
import React, { MouseEvent, useEffect, useState } from "react"
import { RoomsType, membersType, userType } from "@/types/types"
import Cookies from "js-cookie"
import { useParams, useRouter, useSearchParams } from "next/navigation"


import ChanneLModal from "./channel.modal"
import Select from "../../components/Select"
import ChanneLcreatemodaLHook from "../hooks/channel.create.hook"
import ChanneLmodaLheader from "../components/channel.modal.header"
import Input from "@/components/Input"
import getUserWithId from "../actions/getUserWithId"
import Button from "../../components/Button"

import ChanneLsettingsHook from "../hooks/channel.settings"
import getMemberWithId from "../actions/getMemberWithId"
import { GoEyeClosed } from "react-icons/go"
import { HiLockClosed, HiLockOpen } from "react-icons/hi"
import { GrUserSettings } from "react-icons/gr"
import { RiChatSettingsLine } from "react-icons/ri"
import { FaUsersCog } from "react-icons/fa"
import Image from "next/image"
import { TbInfoSquareRoundedFilled, TbUserPlus } from "react-icons/tb"
import getChannelWithId from "../actions/getChannelWithId"
import ChanneLChatSettings from "../components/settings/ChanneL/channel.settings.channel"
import ChanneLSettingsInfo from "../components/settings/channel.settings.info"
import FindOneBySLug from "../actions/Channel/findOneBySlug"
import ChanneLUserSettings from "../components/settings/User/channel.settings.user"
import ChannelSettingsUserMemberItem from "../components/settings/User/channel.settings.user.memberItem"
import SettingsProvider from "../components/settings/channel.settings.provider"
import getChannelMembersWithId from "../actions/getChannelmembers"
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
            if (!data) return
            UpdateData();
        });
        socket?.on(`${process.env.NEXT_PUBLIC_SOCKET_EVENT_RESPONSE_CHAT_CHANNEL_UPDATE}`, (data) => {
            if (!data) return
            UpdateData();
        });
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
            setUserInfo(userInfo)
            setMemberInfo(memberInfo)
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


    let bodyContent = (
        <div className=" w-full p-2 md:p-6 pt-0 md:pt-0 flex flex-col min-h-[40rem] h-full">
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
                OnClick={() => { }} />}

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
                    // : ChanneLInfo && <ChanneLSettingsInfo
                    //     socket={socket}
                    //     room={ChanneLInfo}
                    //     User={UserInfo}
                    //     member={MemberInfo}
                    // />
                }
            </div>
            <div className=" w-full flex flex-row h-max justify-around items-center mb-5 text-white ">
                {/* <Button
                    icon={TbInfoSquareRoundedFilled}
                    label={"ChanneL Info"}
                    outline
                    responsive
                    showLabeL
                    IsActive={_channeLtype === "ChatInfo"}
                    onClick={() => { setcustomvalue("channeLtype", "ChatInfo") }}
                /> */}
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
        </div>
    )
    if (MemberInfo?.isban)
        bodyContent = (<div>You Are Baned </div>)


    return <ChanneLModal IsOpen={IsOpen} title={` ${ChanneLInfo?.name} settings`} children={bodyContent} onClose={() => {
        onClose()
        reset()
    }} />

}
export default ChanneLSettingsModaL