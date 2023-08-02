"use client"
import ContactHook from "@/hooks/contactHook"
import { TiArrowMinimise } from "react-icons/ti"
import { RegisterOptions, FieldValues, UseFormRegisterReturn, useForm, SubmitHandler, useFieldArray, set } from "react-hook-form"
import { MouseEvent, useEffect, useState } from "react"
import { userType } from "@/types/types"
import Cookies from "js-cookie"
import { useRouter } from "next/navigation"


import ChanneLModal from "./channel.modal"
import Select from "../../components/Select"
import ChanneLcreatemodaLHook from "../hooks/channel.create.hook"
import ChanneLmodaLheader from "../components/channel.modal.header"
import Input from "@/components/Input"
import getUserWithId from "../actions/getUserWithId"
import Button from "../../components/Button"
import { RiGitRepositoryPrivateFill } from "react-icons/ri"
import { MdOutlinePublic } from "react-icons/md"
import { GrSecure, GrInsecure } from "react-icons/gr"
import { GoEyeClosed } from "react-icons/go"
import { HiLockClosed, HiLockOpen } from "react-icons/hi"
import getUsers from "../actions/getUsers"
import ChanneLPasswordAccessHook from "../hooks/Channel.Access.Password.hook"
enum RoomType {
    PUBLIC = 'PUBLIC',
    PRIVATE = 'PRIVATE',
}
const ChanneLPasswordAccessModaL = () => {
    const { IsOpen, onClose, onOpen } = ChanneLPasswordAccessHook()
    const route = useRouter()
    const [aLLfriends, setfriends] = useState<any[] | null>(null)
    const [userId, setuserId] = useState<userType | null>(null)
    const [InputValue, setInputValue] = useState("")

    let users: any[] = []
    useEffect(() => {}, [])


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
            ChanneLpassword: "",
        },
    });
    
    const _channeLpassword = watch('ChanneLpassword')


    // Argument of type 'string' is not assignable to parameter of type '"channel_name" | "friends" | `friends.${number}` | `friends.${number}.id` | `friends.${number}.login` | `friends.${number}.email` | `friends.${number}.password` | `friends.${number}.first_name` | `friends.${number}.last_name` | `friends.${number}.kind` | `friends.${number}.image` | `friends.${number}.is_active`
    const setcustomvalue = (key: any, value: any) => {
        setValue(key, value, { shouldValidate: true, shouldDirty: true, shouldTouch: true })
    }



    const onSubmit: SubmitHandler<FieldValues> = async (UserId: any) => {
        // create private room : createroom
        reset();
        setInputValue("");
        const token: any = Cookies.get('token');
        const User_ID: string | undefined = Cookies.get('_id');
    }

    const bodyContent = (
        <div className="  w-full p-4 md:p-6 flex flex-col justify-between min-h-[9rem]">

            <div className="body flex flex-col gap-4">

                <div className="body flex flex-col gap-2 py-4">
                    {/* <h1 className=" text-[#ffffffb9] text-xl font-bold capitalize">channel name </h1> */}
                    <Input
                        onChange={(e: any) => { setcustomvalue(_channeLpassword, e.target.value) }}
                        id={"ChanneLpassword"} lable={"ChanneL password"}
                        register={register}

                        errors={errors} />
                </div>
            </div>
            <div className="w-full">
                <button onClick={handleSubmit(onSubmit)} className="text-white hover:text-black border border-secondary hover:bg-secondary text-sm font-bold capitalize px-7 py-3 rounded-[12px]  w-max">
                    Access to room
                </button>
            </div>
        </div>
    )

    return <ChanneLModal IsOpen={IsOpen} title={"Access ChanneL password"} children={bodyContent} onClose={onClose} />

}
export default ChanneLPasswordAccessModaL