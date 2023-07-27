import { IoChevronBackOutline } from "react-icons/io5";
import { Socket } from "socket.io-client";
import Button from "../../components/Button";
import { membersType, updatememberEnum } from "@/types/types";
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
}



export default function ChanneLSettingsChanneLAccessPassword(
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
                    <Input id="newChanneLpassword" lable="new password" type="password" register={register} errors={errors} onChange={() => { }} />
                    <Input id="confirmChanneLpassword" lable="confirm password" type="password" register={register} errors={errors} onChange={() => { }} />
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
