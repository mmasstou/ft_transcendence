import { RoomTypeEnum, RoomsType, UpdateChanneLSendData, UpdateChanneLSendEnum, UserTypeEnum, membersType } from "@/types/types";
import Cookies from "js-cookie";
import { useParams, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { GoEyeClosed } from "react-icons/go";
import { HiLockClosed, HiLockOpen } from "react-icons/hi";
import { TbLockCheck } from "react-icons/tb";
import { Socket } from "socket.io-client";
import FindOneBySLug from "../../../actions/findOneBySlug";
import ChanneLConfirmActionHook from "../../../hooks/channel.confirm.action";
import ChanneLSettingsAlert from "../../channel.settings.alerts";
import ChanneLSettingsBody from "../channel.settings.body";
import ChanneLSettingsOptionItem from "./channel.settings.channel.Item";
interface ChanneLUserSettingsProps {
    socket: Socket | null;
    OnBack: () => void;
    LogedMember: membersType | null;
    members: membersType[] | null;
    setUpdate: (data: boolean) => void
}

export default function ChanneLSettingsChanneLChangeType(
    { socket, OnBack, LogedMember, members, setUpdate }: ChanneLUserSettingsProps) {
    const [ChanneLinfo, setChanneLinfo] = React.useState<RoomsType | null>(null)
    const [IsLoading, setLoading] = React.useState<boolean>(false)
    const [passwordPopup, setPasswordPopup] = React.useState<boolean>(false)
    const channeLConfirmActionHook = ChanneLConfirmActionHook()
    const query = useParams();
    const slug: string = typeof query.slug === 'string' ? query.slug : '';
    const params = useSearchParams()
    const token: any = Cookies.get('token');
    if (!token) return;

    React.useEffect(() => {
        if (!slug) return;
        (async () => {
            const ChanneLinfo = await FindOneBySLug(slug, token)
            if (ChanneLinfo) {
                setChanneLinfo(ChanneLinfo)
            }
        })();
    }, [slug])

    const {
        register,
        setValue,
        watch,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FieldValues>({
        defaultValues: {
            newChanneLpassword: "",
            confirmChanneLpassword: "",
            channeLtype: ""
        },
    });

    const _newChanneLpassword = watch('newChanneLpassword')
    const _confirmChanneLpassword = watch('confirmChanneLpassword')

    const onSubmit = (data: UpdateChanneLSendData) => {
        // chack if  password is not empty and if password is not equal to confirm password
        console.log("send data :", data)
        if (data.roomtype === RoomTypeEnum.PROTECTED && (data.password !== "" && data.password !== data.confirmpassword)) {
            return
        }
        // check if selected type is not equal to current type
        if (data.roomtype === ChanneLinfo?.type) {
            return
        }
        // send data to server
        // socket?.emit(`SOCKET_EVENT_CHAT_UPDATE`, data)
        // change channel type :
        const __message = `are you sure you whon to change channel type to ${data.roomtype}`;
        __message && channeLConfirmActionHook.onOpen(
            <button
                onClick={() => {
                    socket?.emit(`SOCKET_EVENT_CHAT_UPDATE`, data)
                }}
                className="text-balck hover:text-danger  border border-secondary bg-secondary text-sm font-bold lowercase  px-7 py-3 rounded-[12px]  w-full">
                save
            </button>
            , __message)
        //   reset data for password
        reset()
        if (data.roomtype === RoomTypeEnum.PROTECTED) {
            setPasswordPopup(false)
        }
    }

    const _OnSubmit: SubmitHandler<FieldValues> = (data: any) => {
        if (!ChanneLinfo) return;
        if (data.channeLtype === RoomTypeEnum.PRIVATE) {
            onSubmit({
                roomtype: RoomTypeEnum.PRIVATE,
                room: ChanneLinfo,
                Updatetype: UpdateChanneLSendEnum.CHANGETYPE,
                password: '',
                confirmpassword: '',
                accesspassword: ''
            });
        }
        if (data.channeLtype === RoomTypeEnum.PUBLIC) {
            onSubmit({
                roomtype: RoomTypeEnum.PUBLIC,
                room: ChanneLinfo,
                Updatetype: UpdateChanneLSendEnum.CHANGETYPE,
                password: '',
                confirmpassword: '',
                accesspassword: ''
            });
        }
        // check if selected type is not equal to current type
        if (data.channeLtype === RoomTypeEnum.PROTECTED) {
            toast(`OnSubmit`);
            onSubmit({
                roomtype: RoomTypeEnum.PROTECTED,
                room: ChanneLinfo,
                Updatetype: UpdateChanneLSendEnum.CHANGETYPE,
                password: data.newChanneLpassword,
                confirmpassword: data.confirmChanneLpassword,
                accesspassword: ''
            });
        }
    }

    useEffect(() => {

        socket?.on(`SOCKET_EVENT_RESPONSE_CHAT_CHANGE_TYPE`, (res) => {
            if (!slug || !res) return;
            if (res.OK) {
                OnBack();
                channeLConfirmActionHook.onClose()
                return toast.success('type changed successfully')
            }
            if (!res.OK) {
                channeLConfirmActionHook.onClose()
                return toast.error(res.message)
            }
            (async () => {
                const ChanneLinfo = await FindOneBySLug(slug, token)
                if (ChanneLinfo) setChanneLinfo(ChanneLinfo);
            })();
            channeLConfirmActionHook.onClose()
        })
        socket?.on(`SOCKET_EVENT_RESPONSE_CHAT_UPDATE`, (data) => {
            if (!slug) return;
            (async () => {
                const ChanneLinfo = await FindOneBySLug(slug, token)
                if (ChanneLinfo) setChanneLinfo(ChanneLinfo);
            })();
        })
    }, [socket])

    return (
        <ChanneLSettingsBody title={"Change Type"} OnBack={OnBack} >
            {LogedMember?.type === UserTypeEnum.OWNER ? <div className="overflow-y-scroll max-h-[34rem] flex flex-col w-full">
                <div className="flex flex-col gap-4 w-full ">
                    <ChanneLSettingsOptionItem
                        onClick={function (): void {
                            setPasswordPopup(false)
                            setValue('channeLtype', RoomTypeEnum.PRIVATE)
                            handleSubmit(_OnSubmit)()
                        }}
                        icon={GoEyeClosed}
                        label={"Private"}
                        IsActive={ChanneLinfo?.type === RoomTypeEnum.PRIVATE}
                    />
                    <ChanneLSettingsOptionItem
                        onClick={() => {
                            if (ChanneLinfo?.type !== RoomTypeEnum.PROTECTED)
                                setPasswordPopup(true)
                        }}
                        icon={HiLockClosed}
                        label={"protected"}

                        IsActive={ChanneLinfo?.type === RoomTypeEnum.PROTECTED} />

                    {/* if you whon to change channel type to protacted */}
                    {
                        passwordPopup && <div className="flex flex-col gap-3 w-full relative">
                            <div className=" relative w-full">
                                <input
                                    onFocus={() => { reset({ errors: {} }); }}
                                    id={'newChanneLpassword'}
                                    {...register('newChanneLpassword', { required: true })}
                                    placeholder=" "
                                    type={'password'}
                                    value={_newChanneLpassword}
                                    onChange={(e) => setValue('newChanneLpassword', e.target.value)}
                                    disabled={IsLoading}
                                    className={` text-white peer w-full p-1 pt-5 text-xl bg-transparent text-[var(--white)] focus:bg-transparent font-light border rounded-md outline-none transition disabled:opacity-70 disabled:cursor-not-allowed ${errors['newChanneLpassword'] ? 'border-rose-500 focus:border-secondary' : 'border-neutral-300 focus:border-secondary'}`}
                                />
                                <label htmlFor="" className={`capitalize text-[var(--white)] absolute text-md duration-150 transform -translate-x-3 top-5 z-10 origin-[0] left-7 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 ${(_newChanneLpassword && _newChanneLpassword.length !== 0 || !_newChanneLpassword) ? 'scale-75 -translate-y-4' : ''} text-zinc-500 `}>password</label>
                            </div>
                            <div className=" relative w-full">
                                <input
                                    onFocus={() => { reset({ errors: {} }); }}
                                    id={'confirmChanneLpassword'}
                                    {...register('confirmChanneLpassword', { required: true })}
                                    placeholder=" "
                                    type={'password'}
                                    value={_confirmChanneLpassword}
                                    onChange={(e) => setValue('confirmChanneLpassword', e.target.value)}
                                    disabled={IsLoading}
                                    className={` text-white peer w-full p-1 pt-5 text-xl bg-transparent text-[var(--white)] focus:bg-transparent font-light border rounded-md outline-none transition disabled:opacity-70 disabled:cursor-not-allowed ${errors['confirmChanneLpassword'] ? 'border-rose-500 focus:border-secondary' : 'border-neutral-300 focus:border-secondary'}`}
                                />
                                <label htmlFor="" className={`capitalize text-[var(--white)] absolute text-md duration-150 transform -translate-x-3 top-5 z-10 origin-[0] left-7 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 ${(_confirmChanneLpassword && _confirmChanneLpassword.length !== 0 || !_confirmChanneLpassword) ? 'scale-75 -translate-y-4' : ''} text-zinc-500`}>confirm password</label>
                            </div>
                            <div className=" relative w-full flex justify-center items-center">
                                <button
                                    type={'submit'}
                                    onClick={() => {
                                        setValue('channeLtype', RoomTypeEnum.PROTECTED)
                                        handleSubmit(_OnSubmit)()
                                    }
                                    }
                                    className={` relative flex gap-2 disabled:opacity-70 disabled:cursor-not-allowed rounded-lg hover:opacity-80 capitalize transition items-center w-full px-10 z-10 py-3 font-light text-sm bg-secondary`}>
                                    <TbLockCheck />
                                    save</button>
                            </div>
                        </div>
                    }
                    <ChanneLSettingsOptionItem
                        onClick={function (): void {
                            setPasswordPopup(false)
                            setValue('channeLtype', RoomTypeEnum.PUBLIC)
                            handleSubmit(_OnSubmit)()
                        }}
                        icon={HiLockOpen}
                        label={"public"}
                        IsActive={ChanneLinfo?.type === RoomTypeEnum.PUBLIC}
                    />
                </div>
            </div>
                : <ChanneLSettingsAlert message={'you are not the owner'} />
            }
        </ChanneLSettingsBody >

    )
}
