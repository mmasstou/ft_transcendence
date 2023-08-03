import { IoChevronBackOutline } from "react-icons/io5";
import { Socket } from "socket.io-client";
import Button from "../../components/Button";
import { RoomTypeEnum, RoomsType, UpdateChanneLSendData, UpdateChanneLSendEnum, membersType, updatememberEnum } from "@/types/types";
import ChannelSettingsUserMemberItem from "./channel.settings.user.memberItem";
import Image from "next/image";
import { FieldValues, useForm } from "react-hook-form";
import Input from "@/components/Input";
interface ChanneLUserSettingsProps {
    socket: Socket | null;
    OnBack: () => void;
    LogedMember: membersType | null;
    members: membersType[] | null;
    setUpdate: (data: boolean) => void
    room: RoomsType | null
}



export default function ChanneLSettingsChanneLAccessPassword(
    { socket, OnBack, LogedMember, members, room, setUpdate }: ChanneLUserSettingsProps) {

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
            newChanneLpassword: "",
            confirmChanneLpassword: "",
        },
    });

    const _newChanneLpassword = watch('newChanneLpassword')
    const _confirmChanneLpassword = watch('confirmChanneLpassword')

    socket?.on('updatememberResponseEvent', (data) => {
        setUpdate(true)
    })
    const onSubmit = (data: UpdateChanneLSendData) => {
        // chack if  password is not empty and if password is not equal to confirm password
        console.log("set access password :", data)
        if (data.password !== data.confirmpassword) {
            return
        }
        // set access password
        data.accesspassword = data.password
        data.password = ''
        data.confirmpassword = ''
        // send data to server
        socket?.emit('updateChanneL', data)
        //   reset data for password
        reset()
    }
    return (
        <div className="flex flex-col justify-between min-h-[34rem]">
            <div>
                <Button
                    icon={IoChevronBackOutline}
                    label={"Back"}
                    outline
                    onClick={OnBack}
                />

                <div className="overflow-y-scroll max-h-[34rem] flex flex-col w-full p-6">
                    <div className="flex flex-col gap-4 ">
                        <Input id="newChanneLpassword" lable="new password" type="password" register={register} errors={errors} onChange={(e) => {
                                    setValue('newChanneLpassword', e.target.value)
                                }} />
                        <Input id="confirmChanneLpassword" lable="confirm password" type="password" register={register} errors={errors} onChange={(e) => {
                                    setValue('confirmChanneLpassword', e.target.value)
                                }} />
                    </div>
                </div>
            </div>
            <div className='flex flex-row justify-between items-center
               '>
                <Button
                    label={"Save Changes"}
                    outline
                    onClick={() => {
                        room && onSubmit(
                            {
                                Updatetype: UpdateChanneLSendEnum.SETACCESSEPASSWORD,
                                room: room,
                                roomtype: room?.type === RoomTypeEnum.PUBLIC
                                    ? RoomTypeEnum.PUBLIC
                                    : room?.type === RoomTypeEnum.PROTECTED
                                        ? RoomTypeEnum.PROTECTED
                                        : RoomTypeEnum.PRIVATE,
                                password: _newChanneLpassword,
                                confirmpassword: _confirmChanneLpassword,
                                accesspassword: '',
                            }
                        )
                    }}
                />
            </div>
        </div>
    )
}
