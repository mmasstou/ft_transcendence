import { IoChevronBackOutline } from "react-icons/io5";
import { Socket } from "socket.io-client";
import Button from "../../components/Button";
import { membersType, updatememberEnum } from "@/types/types";
import ChannelSettingsUserMemberItem from "./channel.settings.user.memberItem";
import Image from "next/image";
import { FieldValues, useForm } from "react-hook-form";
import Input from "@/components/Input";
import { GoEyeClosed } from "react-icons/go";
import { BsArrowRightShort } from "react-icons/bs";
import { HiLockClosed, HiLockOpen } from "react-icons/hi";
interface ChanneLUserSettingsProps {
    socket: Socket | null;
    OnBack: () => void;
    LogedMember: membersType | null;
    members: membersType[] | null;
    setUpdate: (data: boolean) => void
}



export default function ChanneLSettingsChanneLChangeType(
    { socket, OnBack, LogedMember, members, setUpdate }: ChanneLUserSettingsProps) {

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

    const handlOnclick = (data: any) => {
        console.log("handlOnclick :", data)
        socket?.emit('updatemember', data)

    }

    socket?.on('updatememberResponseEvent', (data) => {
        console.log("updatememberResponseEvent :", data)
        console.log("updatememberResponseEvent :", members)
        setUpdate(true)
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

                <div className="overflow-y-scroll max-h-[34rem] flex flex-col w-full p-6">
                    <div className="flex flex-col gap-4 ">
                        <button
                            onClick={() => {
                                console.log("private")
                            }}
                            className="flex flex-row justify-between items-center shadow p-2 rounded">
                            <div className='flex justify-center items-center p-3 rounded bg-secondary text-white'>
                                <GoEyeClosed size={28} />
                            </div>
                            <div>
                                <h2 className='text-white'>Private</h2>
                            </div>
                            <div className='text-white'>
                                <BsArrowRightShort size={24} />
                            </div>
                        </button>
                        <button
                            onClick={() => {
                                console.log("protected")
                            }}
                            className="flex flex-row justify-between items-center shadow p-2 rounded">
                            <div className='flex justify-center items-center p-3 rounded bg-secondary text-white'>
                                <HiLockClosed size={28} />
                            </div>
                            <div>
                                <h2 className='text-white'>Protected</h2>
                            </div>
                            <div className='text-white'>
                                <BsArrowRightShort size={24} />
                            </div>
                        </button>
                        <button
                            onClick={() => {
                                console.log("public")
                            }}
                            className="flex flex-row justify-between items-center shadow p-2 rounded">
                            <div className='flex justify-center items-center p-3 rounded bg-secondary text-white'>
                                <HiLockOpen size={28} />
                            </div>
                            <div>
                                <h2 className='text-white'>Public</h2>
                            </div>
                            <div className='text-white'>
                                <BsArrowRightShort size={24} />
                            </div>
                        </button>
                    </div>
                </div>
            </div>
            <div className='flex flex-row justify-between items-center
               '>
                <Button
                    label={"Save Changes"}
                    outline
                    onClick={() => { () => { } }}
                />
            </div>
        </div>
    )
}
