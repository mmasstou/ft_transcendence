// 
import { IoChevronBackOutline } from "react-icons/io5";
import { Socket } from "socket.io-client";
import Button from "../../components/Button";
import { RoomTypeEnum, RoomsType, UpdateChanneLSendData, UpdateChanneLSendEnum, UserTypeEnum, membersType, updatememberEnum, userType } from "@/types/types";
import ChannelSettingsUserMemberItem from "./settings/User/channel.settings.user.memberItem";
import Image from "next/image";
import ChanneLSettingsBody from "./settings/channel.settings.body";
import React, { useEffect, useState } from "react";
import getUserWithId from "../actions/getUserWithId";
import Cookies from "js-cookie";
import Input from "@/components/Input";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useSearchParams } from "next/navigation";
import getChannelWithId from "../actions/getChannelWithId";
import ChanneLConfirmActionHook from "../hooks/channel.confirm.action";
import { TbLockCheck } from "react-icons/tb";
interface ChanneLUserSettingsProps {
    socket: Socket | null;
    OnBack: () => void;
    LogedMember: membersType | null;
    members: membersType[] | null;
    setUpdate: (data: boolean) => void;
    title?: string
}


export default function ChanneLSettingsChanneLAccessPassword(
    { socket, OnBack, LogedMember, members, setUpdate, title }: ChanneLUserSettingsProps) {
    const handlOnclick = (data: any) => {
        socket?.emit('updatemember', data)

    }


    const [User, setUser] = React.useState<userType | null>(null)
    const [ChanneLpasswordInput, setChanneLpasswordInput] = useState('')
    const [confirmChanneLpasswordInput, setconfirmChanneLpasswordInput] = useState('')
    const [channeLInfo, setchanneLInfo] = useState<RoomsType | null>(null)
    const params = useSearchParams()
    const channeLId = params && params.get('r')
    const channeLConfirmActionHook = ChanneLConfirmActionHook()
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
        },
    });

    const setcustomvalue = (key: any, value: any) => {
        setValue(key, value, { shouldValidate: true, shouldDirty: true, shouldTouch: true })
    }
    React.useEffect(() => {
        if (LogedMember) {
            (async () => {
                const token = Cookies.get('token')
                if (!token) return  // if no token found, do nothing
                const res = await getUserWithId(LogedMember.userId, token)
                if (res) setUser(res);


                if (!channeLId) return  // if no token found, do nothing
                const channeLInfo = await getChannelWithId(channeLId, token)
                if (!channeLInfo) return;
                setchanneLInfo(channeLInfo);
            })();
        }
    }, [])

    // React.useEffect(() => {

    // }, [channeLId])

    const onSubmit : SubmitHandler<FieldValues> = async (resp: any) =>  {
        if (!channeLInfo) return;
        const data: UpdateChanneLSendData = {
            Updatetype: UpdateChanneLSendEnum.SETACCESSEPASSWORD,
            room: channeLInfo,
            password: ChanneLpasswordInput,
            confirmpassword: confirmChanneLpasswordInput
        }
        // chack if  password is not empty and if password is not equal to confirm password
      
        const __message = 'are you sure you whon to set this channel access password';
        __message && channeLConfirmActionHook.onOpen(
            <button
                onClick={() => {
                    socket?.emit(`${process.env.NEXT_PUBLIC_SOCKET_EVENT_CHAT_UPDATE}`, data)
                }}
                className="text-balck hover:text-danger  border border-secondary bg-secondary text-sm font-bold lowercase  px-7 py-3 rounded-[12px]  w-full">
                set password
            </button>
            , __message
        )
        // send data to server
        // socket?.emit(`${process.env.NEXT_PUBLIC_SOCKET_EVENT_CHAT_UPDATE}`, data)
        //   reset data for password
        reset()
    }

    useEffect(() => {

        socket?.on(`${process.env.NEXT_PUBLIC_SOCKET_EVENT_RESPONSE_CHAT_UPDATE}`, (data) => {
            setChanneLpasswordInput('')
            setconfirmChanneLpasswordInput('')
            if (!data) return
            channeLConfirmActionHook.onClose()
            setchanneLInfo(data)

        })
    }, [socket])

    return (
        <ChanneLSettingsBody
            title={` ${title ? title : `set access password :${User?.login} - ${LogedMember?.type}`}`}
            OnBack={OnBack}
            HasPermission={LogedMember?.type !== UserTypeEnum.OWNER && LogedMember?.type !== UserTypeEnum.ADMIN}
        >
            <div className="flex flex-col justify-between min-h-[24rem] w-full">
                <form className='flex flex-col min-h-[24rem] h-full justify-between'>
                   <div className="flex flex-col gap-5 p-4">
                   <div className=" relative w-full">
                        <input
                            id={'ChanneLpassword'}
                            {...register('ChanneLpassword', { required: true })}
                            placeholder=" "
                            type='password'
                            value={ChanneLpasswordInput}
                            onChange={(e) => {
                                setChanneLpasswordInput(e.target.value)
                                // onChange(e)
                            }}
                            required
                            className={`peer w-full pl-3 pt-6 text-xl bg-transparent text-white border text-[var(--white)] focus:bg-transparent font-light   rounded-md outline-none transition disabled:opacity-70 disabled:cursor-not-allowed
                                    ${errors['ChanneLpassword'] ? ' border-rose-500 focus:border-rose-500' : ' border-ç focus:border-teal-500'}`} />
                        <label htmlFor="ChanneLpassword"
                            className={`text-[var(--white)] absolute text-md duration-150 transform -translate-x-3 top-5 z-10 origin-[0] left-7 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 ${(ChanneLpasswordInput.length !== 0 || !ChanneLpasswordInput) ? 'scale-75 -translate-y-4' : ''} ${errors['ChanneLpassword'] ? 'text-rose-500' : 'text-zinc-500'} `}> password
                        </label>
                    </div>
                    {/* <Input id="ChanneLpassword" lable="password" type="password" register={register} errors={errors} onChange={(event) => { setcustomvalue('ChanneLpassword', event.target.value) }} /> */}
                  <div className=" relative w-full">
                        <input
                            id={'confirmChanneLpassword'}
                            {...register('confirmChanneLpassword', { required: true })}
                            placeholder=" "
                            type='password'
                            value={confirmChanneLpasswordInput}
                            onChange={(e) => {
                                setconfirmChanneLpasswordInput(e.target.value)
                                // onChange(e)
                            }}
                            required
                            className={`peer w-full pl-3 pt-6 text-xl bg-transparent text-white border text-[var(--white)] focus:bg-transparent font-light   rounded-md outline-none transition disabled:opacity-70 disabled:cursor-not-allowed
                                    ${errors['confirmChanneLpassword'] ? ' border-rose-500 focus:border-rose-500' : ' border-ç focus:border-teal-500'}`} />
                        <label htmlFor="confirmChanneLpassword"
                            className={`text-[var(--white)] absolute text-md duration-150 transform -translate-x-3 top-5 z-10 origin-[0] left-7 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 ${(ChanneLpasswordInput.length !== 0 || !ChanneLpasswordInput) ? 'scale-75 -translate-y-4' : ''} ${errors['confirmChanneLpassword'] ? 'text-rose-500' : 'text-zinc-500'} `}> confirm password
                        </label>
                    </div>
                   </div>
                    <div className=" relative w-full flex justify-center items-center">
                                <button
                                    type={'submit'}
                                    onClick={() => {
                                        handleSubmit(onSubmit)()
                                    }
                                    }
                                    className={` relative flex gap-2 disabled:opacity-70 disabled:cursor-not-allowed rounded-lg hover:opacity-80 capitalize transition items-center w-full px-10 z-10 py-3 font-light text-sm bg-secondary`}>
                                    <TbLockCheck />
                                    save</button>
                            </div>


                    {/* <Input id="confirmChanneLpassword" lable="confirm password" type="password" register={register} errors={errors} onChange={(event) => { setcustomvalue('confirmChanneLpassword', event.target.value) }} /> */}
                </form>
            </div>

        </ChanneLSettingsBody >
    )
}
