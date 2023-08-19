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

    const token: any = Cookies.get('token');
    const UserId: any = Cookies.get('_id');
    if (!token || !UserId)
        return;

    useEffect(() => {
        (async () => {
            const channeLinfo = await FindOneBySLug(slug, token)
            if (!channeLinfo) return
            const userInfo = await getUserWithId(UserId, token)
            const memberInfo = await getMemberWithId(UserId, channeLinfo.id, token)
            setUserInfo(userInfo)
            setMemberInfo(memberInfo)
            setChanneLInfo(channeLinfo)
        })();
        setMounted(true)
    }, [slug])

    const { setValue, watch, reset, } = useForm<FieldValues>({
        defaultValues: {
            channeLtype: "ChatInfo"
        },
    });

    const _channeLtype = watch('channeLtype')


    const setcustomvalue = (key: any, value: any) => {
        setValue(key, value, { shouldValidate: true, shouldDirty: true, shouldTouch: true })
    }

    const bodyContent = (
        <div className=" w-full p-2 md:p-6 pt-0 md:pt-0 flex flex-col min-h-[40rem] h-full">
            <div className=" w-full flex flex-row h-max justify-around items-center mb-5 text-white ">
                <Button
                    icon={TbInfoSquareRoundedFilled}
                    label={"ChanneL Info"}
                    outline
                    responsive
                    IsActive={_channeLtype === "ChatInfo"}
                    onClick={() => { setcustomvalue("channeLtype", "ChatInfo") }}
                /><Button
                    icon={FaUsersCog}
                    label={"User Settings"}
                    outline
                    responsive
                    IsActive={_channeLtype === "UserSettings"}
                    onClick={() => { setcustomvalue("channeLtype", "UserSettings") }}
                />
                <Button
                    icon={RiChatSettingsLine}
                    label={"ChanneL Settings"}
                    outline
                    responsive
                    IsActive={_channeLtype === "ChatSettings"}
                    onClick={() => { setcustomvalue("channeLtype", "ChatSettings") }}
                />
            </div>

            <div className={`body flex flex-col gap-4 h-full w-full min-h-[38rem]`}>
                {
                    _channeLtype === "UserSettings"
                        ? <ChanneLUserSettings
                            socket={socket}
                            room={ChanneLInfo}
                            User={UserInfo}
                            member={MemberInfo}
                        />
                        : _channeLtype === "ChatSettings"
                            ? <ChanneLChatSettings socket={socket} />
                            : ChanneLInfo && <ChanneLSettingsInfo
                                socket={socket}
                                room={ChanneLInfo}
                                User={UserInfo}
                                member={MemberInfo}
                            />}
            </div>
        </div>
    )
    return <ChanneLModal IsOpen={IsOpen} title={` ${ChanneLInfo?.name} settings`} children={bodyContent} onClose={() => {
        onClose()
        reset()
    }} />

}
export default ChanneLSettingsModaL