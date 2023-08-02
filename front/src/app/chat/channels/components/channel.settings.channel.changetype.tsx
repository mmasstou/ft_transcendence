import { IoChevronBackOutline } from "react-icons/io5";
import { Socket } from "socket.io-client";
import { RoomTypeEnum, RoomsType, UserTypeEnum, membersType, updatememberEnum } from "@/types/types";
import ChannelSettingsUserMemberItem from "./channel.settings.user.memberItem";
import Image from "next/image";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import Input from "@/components/Input";
import { GoEyeClosed } from "react-icons/go";
import { BsArrowRightShort, BsSaveFill } from "react-icons/bs";
import { HiLockClosed, HiLockOpen } from "react-icons/hi";
import ChanneLSettingsOptionItem from "./channel.settings.optionItem";
import { IconBaseProps } from "react-icons";
import React, { use, useCallback } from "react";
import Cookies from "js-cookie";
import { useSearchParams } from "next/navigation";
import getChannelWithId from "../actions/getChannelWithId";
import ChanneLSettingsAlert from "./channel.settings.alerts";
import { setConstantValue } from "typescript";
import Button from "../../components/Button";
interface ChanneLUserSettingsProps {
    socket: Socket | null;
    OnBack: () => void;
    LogedMember: membersType | null;
    members: membersType[] | null;
    setUpdate: (data: boolean) => void
}

export enum UpdateChanneLSendType {
    CHANGETYPE = 'CHANGETYPE',
    SETACCESSEPASSWORD = 'SETACCESSEPASSWORD',
}
export type UpdateChanneLSendData =  {
    Updatetype: UpdateChanneLSendType,
    accesspassword?: string,
    roomtype?: RoomTypeEnum,
    room : RoomsType
}
export default function ChanneLSettingsChanneLChangeType(
    { socket, OnBack, LogedMember, members, setUpdate }: ChanneLUserSettingsProps) {
    const [ChanneLinfo, setChanneLinfo] = React.useState<membersType | null>(null)
    const [passwordPopup, setPasswordPopup] = React.useState<boolean>(false)
    const params = useSearchParams()
    const channeLLid = params.get('r')

    React.useEffect(() => {
        const token: any = Cookies.get('token');
        if (!channeLLid) return;
        if (!token) return;
        (async () => {
            const ChanneLinfo = await getChannelWithId(channeLLid, token)
            if (ChanneLinfo && ChanneLinfo.statusCode !== 200) {
                setChanneLinfo(ChanneLinfo)
            }
        })();
    }, [channeLLid])

    const {
        register,
        setValue,
        watch,
        reset,
        formState: { errors },
    } = useForm<FieldValues>({
        defaultValues: {
            newChanneLpassword: "",
            confirmChanneLpassword: "",
        },
    });

    const _newChanneLpassword = watch('newChanneLpassword')
    const _confirmChanneLpassword = watch('confirmChanneLpassword')

    const onSubmit = (data: {
        type: RoomTypeEnum,
        id: string,
        password?: string,
        confirmpassword?: string
    }) => {
        // chack if  password is not empty and if password is not equal to confirm password
        if (data.type === RoomTypeEnum.PROTECTED && (data.password !== "" && data.password !== data.confirmpassword)) {
            return
        }
        // check if selected type is not equal to current type
        if (data.type === ChanneLinfo?.type) {
            return
        }
        // send data to server
        socket?.emit('updateChanneL', data)
        //   reset data for password
        reset()
        if (data.type === RoomTypeEnum.PROTECTED) {
            setPasswordPopup(false)
        }
    }

    socket?.on('updateChanneLResponseEvent', (data) => {
        const token: any = Cookies.get('token');
        if (!channeLLid) return;
        if (!token) return;
        (async () => {
            const ChanneLinfo = await getChannelWithId(channeLLid, token)
            if (ChanneLinfo && ChanneLinfo.statusCode !== 200) {
                setChanneLinfo(ChanneLinfo)
            }
        })();
    })

    return (
        <div className="flex flex-col justify-between min-h-[34rem]">
            <div>
                <Button
                    icon={IoChevronBackOutline}
                    label={"Back"}
                    outline
                    onClick={OnBack}
                />
                {LogedMember?.type === UserTypeEnum.OWNER ? <div className="overflow-y-scroll max-h-[34rem] flex flex-col w-full p-6">
                    <div className="flex flex-col gap-4 ">
                        <ChanneLSettingsOptionItem
                            onClick={function (): void {
                                channeLLid && onSubmit({ id: channeLLid, type: RoomTypeEnum.PRIVATE });
                            }}
                            icon={GoEyeClosed}
                            label={"Private"}
                            IsActive={ChanneLinfo?.type === RoomTypeEnum.PRIVATE}
                        />
                        <ChanneLSettingsOptionItem
                            onClick={() => {
                                setPasswordPopup(true)
                            }}
                            icon={HiLockClosed}
                            label={"protected"}

                            IsActive={ChanneLinfo?.type === RoomTypeEnum.PROTECTED} />

                        {/* if you whon to change channel type to protacted */}
                        {
                            passwordPopup && <div className="flex flex-col gap-3 w-full relative">
                                <Input id="newChanneLpassword" lable="password" type="password" register={register} errors={errors} onChange={(e) => { 
                                    setValue('confirmChanneLpassword', e.target.value)
                                 }} />
                                <Input id="confirmChanneLpassword" lable="confirm password" type="password" register={register} errors={errors} onChange={(e) => { 
                                    setValue('confirmChanneLpassword', e.target.value)
                                 }} />
                                <div className=" relative w-full flex justify-center items-center">
                                    <Button
                                        icon={BsSaveFill}
                                        label={"save"}
                                        outline
                                        responsive
                                        size={18}
                                        onClick={() => {
                                            channeLLid && onSubmit({
                                                id: channeLLid,
                                                type: RoomTypeEnum.PROTECTED,
                                                password: _newChanneLpassword,
                                                confirmpassword: _confirmChanneLpassword
                                            });
                                        }}
                                    />
                                </div>
                            </div>
                        }
                        <ChanneLSettingsOptionItem
                            onClick={function (): void {
                                channeLLid && onSubmit({
                                    id: channeLLid,
                                    type: RoomTypeEnum.PUBLIC
                                });
                            }}
                            icon={HiLockOpen}
                            label={"public"}
                            IsActive={ChanneLinfo?.type === RoomTypeEnum.PUBLIC}
                        />
                    </div>
                </div>
                    : <ChanneLSettingsAlert message={'you are not the owner'} />}
            </div>
        </div>
    )
}
