"use client"
import ContactHook from "@/hooks/contactHook"
import { TiArrowMinimise } from "react-icons/ti"
import { RegisterOptions, FieldValues, UseFormRegisterReturn, useForm, SubmitHandler, useFieldArray, set } from "react-hook-form"
import React, { MouseEvent, useEffect, useState } from "react"
import { RoomsType, membersType, userType } from "@/types/types"
import Cookies from "js-cookie"
import { useRouter, useSearchParams } from "next/navigation"


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
import ChanneLUserSettings from "../components/channel.settings.User"
import { TbInfoSquareRoundedFilled } from "react-icons/tb"
import getChannelWithId from "../actions/getChannelWithId"
enum RoomType {
    PUBLIC = 'PUBLIC',
    PRIVATE = 'PRIVATE',
}
const ChanneLSettingsModaL = () => {
    const [Ismounted, setIsmounted] = useState<boolean>(false)
    const { IsOpen, onClose, onOpen, selectedchanneL, socket } = ChanneLsettingsHook()
    const [selectedUser, setselectedUser] = useState<userType | null>(null)
    const [memberselected, setmemberselected] = useState<membersType[]>([])
    const [roomquery, setroomquery] = useState<string | null>(null)
    const [userCookieId, setuserCookieId] = useState<string | undefined>(undefined)
    const [roomInfo, setroomInfo] = useState<RoomsType | null>(null)
    const [tokenCookie, settokenCookie] = useState<string | undefined>(undefined)
    const params = useSearchParams()
    const roomId = params.get('r')

    useEffect(() => {
        let roomquery: string | null = null
        const token: any = Cookies.get('token');
        setuserCookieId(Cookies.get('_id'))
        settokenCookie(token)

        if (params) {
            roomquery = params.get('r')
            setroomquery(roomquery)
        }
        if (!token || !roomquery)
            return;
        setIsmounted(true)
    }, [])

    React.useEffect(() => {
        (async () => {
            const token: any = Cookies.get('token');
            if (!token)
                return;
            const response =roomId &&  await getChannelWithId(roomId, token)
            console.log("+++> response :", response)
            setroomInfo(response)
        })();
    }, [roomId])

    React.useEffect(() => {
        (async () => {
            const token: any = Cookies.get('token');
            if (!tokenCookie || !userCookieId)
                return;
            const response = await getUserWithId(userCookieId, tokenCookie)
            const _member = roomquery && await getMemberWithId(userCookieId, roomquery, tokenCookie)
            setselectedUser(response)
            setmemberselected(_member)
        })();
    }, [tokenCookie, userCookieId])

    type formValues = {
        channel_name: string,
        friends: userType[],
        ChanneLpassword: string,
        channeLtype: string
    }

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
            channel_name: '',
            friends: [],
            ChanneLpassword: "",
            channeLtype: "ChatInfo"
        },
    });

    const friends = watch('friends')
    const _channel_name = watch('channel_name')
    const _channeLpassword = watch('ChanneLpassword')
    const _channeLtype = watch('channeLtype')


    const setcustomvalue = (key: any, value: any) => {
        setValue(key, value, { shouldValidate: true, shouldDirty: true, shouldTouch: true })
    }



    const onSubmit: SubmitHandler<FieldValues> = async (UserId: any) => {
        // create private room : createroom

    }

    const bodyContent = (
        <div className=" w-full p-2 md:p-6 pt-0 md:pt-0 flex flex-col min-h-[34rem] h-full">
            <div className=" w-full flex flex-row h-max justify-around items-center mb-5 text-white ">
                <Button
                    icon={TbInfoSquareRoundedFilled}
                    label={"ChanneL Info"}
                    outline
                    IsActive={_channeLtype === "ChatInfo"}
                    onClick={() => { setcustomvalue("channeLtype", "ChatInfo") }}
                /><Button
                    icon={FaUsersCog}
                    label={"User Settings"}
                    outline
                    IsActive={_channeLtype === "UserSettings"}
                    onClick={() => { setcustomvalue("channeLtype", "UserSettings") }}
                />
                <Button
                    icon={RiChatSettingsLine}
                    label={"ChanneL Settings"}
                    outline
                    IsActive={_channeLtype === "ChatSettings"}
                    onClick={() => { setcustomvalue("channeLtype", "ChatSettings") }}
                />
            </div>
            <div className={`body flex flex-col gap-4 h-full w-full min-h-[28rem] 
            ${(_channeLtype !== "UserSettings" && _channeLtype !== "ChatSettings") ? ' justify-center items-center' : ''} `}>
                {
                _channeLtype === "UserSettings" 
                ? <ChanneLUserSettings /> 
                : _channeLtype === "ChatSettings" 
                    ? <div>Chat settings</div> 
                    : <Image
                    className="flex justify-center items-center"
                    src="/channelsettings.svg"
                    alt="avatar"
                    width={160}
                    height={160} />}
            </div>
        </div>
    )
    return <ChanneLModal IsOpen={IsOpen} title={` ${roomInfo?.name} settings`} children={bodyContent} onClose={() => {
        onClose()
        reset()
    }} />

}
export default ChanneLSettingsModaL