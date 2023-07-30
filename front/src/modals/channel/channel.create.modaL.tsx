"use client"
<<<<<<< HEAD
import {FieldValues, useForm, SubmitHandler } from "react-hook-form"
=======
import ContactHook from "@/hooks/contactHook"
import { TiArrowMinimise } from "react-icons/ti"
import { RegisterOptions, FieldValues, UseFormRegisterReturn, useForm, SubmitHandler, useFieldArray } from "react-hook-form"
>>>>>>> 83667b2c2c6fcadfdbeb783afabb311e9d36e57c
import { useEffect, useState } from "react"
import { userType } from "@/types/types"
import Cookies from "js-cookie"
import { useRouter } from "next/navigation"
<<<<<<< HEAD
import Modal from "../channel.modaL"
import ChanneLcreatemodaLHook from "@/hooks/channel.create.hook"
import ChanneLAddFriendsHookHook from "@/hooks/channel.add.friends.hook"
import Select from "../Select"
import ChanneLmodaLheader from "@/app/chat/channels/components/channel.modal.header"
import Input from "@/components/Input"
=======
import Input from "@/components/chat/Input"
import Friend from "@/components/chat/Friend"
import Modal from "../channel.modaL"
import ChanneLcreatemodaLHook from "@/hooks/channel.create.hook"
import { IoMdCloseCircle } from "react-icons/io"
import { AiFillPlusCircle } from "react-icons/ai"
import ChanneLAddFriendsHookHook from "@/hooks/channel.add.friends.hook"
import ChanneLAddFriendsItem from "@/components/chat/channel/channel.add.friends.friendItem"
import ChanneLmodaLheader from "@/components/chat/channel.modal.header"
import Select from "../Select"
>>>>>>> 83667b2c2c6fcadfdbeb783afabb311e9d36e57c

const ChanneLCreateModaL = () => {
    const channeLcreatemodaLHook = ChanneLcreatemodaLHook()
    const channeLAddFriendsHookHook = ChanneLAddFriendsHookHook()
    const route = useRouter()
    const token: any = Cookies.get('token')
    const [aLLfriends, setfriends] = useState<any[] | null>(null)
    const [userId, setuserId] = useState<userType | null>(null)
    const [InputValue, setInputValue] = useState("")

    let users: any[] = []
    useEffect(() => {
        const token: any = Cookies.get('token');
<<<<<<< HEAD
     // console.log("token :", token)
        if (!token)
            return;
        (async function getFriends() {
            await fetch('${process.env.NEXT_PUBLIC_API_URL}/users', {
                headers: { Authorization: `Bearer ${token}`, },
            }).then((resp) => resp.json()).then(data => {

=======
        console.log("token :", token)
        if (!token)
            return;
        (async function getFriends() {
            await fetch('http://127.0.0.1/api/users', {
                headers: { Authorization: `Bearer ${token}`, },
            }).then((resp) => resp.json()).then(data => {
                console.log("++++++++++*****data :", data)
>>>>>>> 83667b2c2c6fcadfdbeb783afabb311e9d36e57c
                setfriends(data)
            })
        })();
    }, [])


    type formValues = {
        channel_name: string,
        friends: userType[]
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
            channel_name: 'dsdsds',
            friends: [],
        },
    });


    if (channeLcreatemodaLHook.selectedFriends && channeLcreatemodaLHook.selectedFriends.length && !watch('friends').length) {
<<<<<<< HEAD
     // console.log("channeLcreatemodaLHook.selectedFriends :", channeLcreatemodaLHook.selectedFriends)
=======
        console.log("channeLcreatemodaLHook.selectedFriends :", channeLcreatemodaLHook.selectedFriends)
>>>>>>> 83667b2c2c6fcadfdbeb783afabb311e9d36e57c
        setValue('friends', channeLcreatemodaLHook.selectedFriends)
    }
    const friends = watch('friends')
    const _channel_name = watch('channel_name')


    // Argument of type 'string' is not assignable to parameter of type '"channel_name" | "friends" | `friends.${number}` | `friends.${number}.id` | `friends.${number}.login` | `friends.${number}.email` | `friends.${number}.password` | `friends.${number}.first_name` | `friends.${number}.last_name` | `friends.${number}.kind` | `friends.${number}.image` | `friends.${number}.is_active`
    const setcustomvalue = (key: any, value: any) => {
        setValue(key, value, { shouldValidate: true, shouldDirty: true, shouldTouch: true })
    }



    const onSubmit: SubmitHandler<FieldValues> = async (UserId: any) => {
        // create private room :
<<<<<<< HEAD
     // console.log("+onSubmit+ +> UserId :", UserId)
=======
        console.log("+onSubmit+ +> UserId :", UserId)
>>>>>>> 83667b2c2c6fcadfdbeb783afabb311e9d36e57c
        reset();
        setInputValue("");

    }

    const bodyContent = (
        <div className=" max-w-[598px] w-full md:min-w-[420px] bg-[#243230] min-h-[34rem] rounded-[8px] p-4 md:p-6 flex flex-col justify-between">
            <ChanneLmodaLheader label={"create channel"}
                OnClose={function (): void { channeLcreatemodaLHook.onClose() }} />
            <div className="body flex flex-col gap-4">
                <div className="body flex flex-col gap-2">
                    <h1 className="text-slate-600 text-xl font-bold capitalize">channel name </h1>
                    <Input
                        onChange={(e) => { setcustomvalue(_channel_name, e.target.value) }}
                        id={"channel_name"} lable={"channel name"}
                        register={register}
                        errors={errors} />
                </div>
                {aLLfriends !== null && <Select
                    disabled={false}
                    lable={"Select Friends"}
                    options={aLLfriends.map((friend) => ({
                        value: friend.id,
                        label: friend.login,
                    }))}
                    value={friends}
                    onChange={(value: any) => {
                        setValue('friends', value,
                            { shouldValidate: true })
                    }}
                />}
            </div>
            <div>
                <button onClick={handleSubmit(onSubmit)} className="text-white text-sm font-bold capitalize px-7 py-3 rounded-[12px] bg-zinc-900 w-full">
                    Create
                </button>
            </div>
        </div>
    )
<<<<<<< HEAD
 // console.log("-----              --friends :", friends)
=======
    console.log("-----              --friends :", friends)
>>>>>>> 83667b2c2c6fcadfdbeb783afabb311e9d36e57c
    return <Modal
        IsOpen={channeLcreatemodaLHook.IsOpen}
        body={bodyContent} />
}
export default ChanneLCreateModaL