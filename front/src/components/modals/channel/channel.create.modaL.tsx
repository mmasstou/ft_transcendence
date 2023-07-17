"use client"
import ContactHook from "@/hooks/contactHook"
import { TiArrowMinimise } from "react-icons/ti"
import { RegisterOptions, FieldValues, UseFormRegisterReturn, useForm, SubmitHandler, useFieldArray } from "react-hook-form"
import { useEffect, useState } from "react"
import { userType } from "@/types/types"
import Cookies from "js-cookie"
import { useRouter } from "next/navigation"
import Input from "@/components/chat/Input"
import Friend from "@/components/chat/Friend"
import Modal from "../channel.modaL"
import ChanneLcreatemodaLHook from "@/hooks/channel.create.hook"
import { IoMdCloseCircle } from "react-icons/io"
import { AiFillPlusCircle } from "react-icons/ai"
import ChanneLAddFriendsHookHook from "@/hooks/channel.add.friends.hook"

const ChanneLCreateModaL = () => {
    const channeLcreatemodaLHook = ChanneLcreatemodaLHook()
    const channeLAddFriendsHookHook = ChanneLAddFriendsHookHook()
    const route = useRouter()
    const token: any = Cookies.get('token')
    const [aLLfriends, setfriends] = useState<userType[] | null>(null)
    const [userId, setuserId] = useState<any | null>(null)
    const [InputValue, setInputValue] = useState("")

    useEffect(() => {
        (async function getFriends() {
            await fetch('http://127.0.0.1/api/users', {
                headers: { Authorization: `Bearer ${token}`, },
            }).then((resp) => resp.json()).then(data => setfriends(data))
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
            channel_name: '',
            friends: channeLcreatemodaLHook.selectedFriends,
        },
    });


    if (channeLcreatemodaLHook.selectedFriends && channeLcreatemodaLHook.selectedFriends.length && !watch('friends').length) {
        console.log("channeLcreatemodaLHook.selectedFriends :", channeLcreatemodaLHook.selectedFriends)
        setValue('friends', channeLcreatemodaLHook.selectedFriends)
    }
    const _friends = watch('friends')

    const _channel_name = watch('channel_name')

    useEffect(() => {
        console.log("_friends :", _friends)
        console.log("_channel_name :", _channel_name)
    }, [_friends])
    // Argument of type 'string' is not assignable to parameter of type '"channel_name" | "friends" | `friends.${number}` | `friends.${number}.id` | `friends.${number}.login` | `friends.${number}.email` | `friends.${number}.password` | `friends.${number}.first_name` | `friends.${number}.last_name` | `friends.${number}.kind` | `friends.${number}.image` | `friends.${number}.is_active`
    const setcustomvalue = (key: any, value: any) => {
        setValue(key, value, { shouldValidate: true, shouldDirty: true, shouldTouch: true })
    }

    const onSubmit: SubmitHandler<FieldValues> = async (UserId: any) => {
        // create private room :
        console.log("+onSubmit+ +> UserId :", UserId)
        try {
            const resp = await fetch('/api/directMessage', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: UserId,
                    token: `Bearer ${token}`
                })
            })
            if (resp.ok) {
                const __data = await resp.json()
                console.log("__data :", __data)
                route.push(`/chat?direct-message=${__data.id}`)
                channeLcreatemodaLHook.onClose()
            }
        } catch (error) {
            console.error('Error creating room:', error);
        }
    }
    console.log("                       +> _friends :", _friends)
    console.log("                       +> _friends :", _friends.length)
    if (_friends && _friends.length) {
        console.log("                       +> _friends :", _friends)
    }
    const bodyContent = (
        <div className=" max-w-[598px] w-full md:min-w-[420px] bg-[#243230] min-h-[34rem] rounded-[8px] p-4 md:p-6 flex flex-col justify-between">
            <div className="header w-full flex flex-row justify-between items-center">
                <h2 className=" capitalize text-white">create channel :  </h2>
                <button onClick={() => channeLcreatemodaLHook.onClose()}><IoMdCloseCircle size={21} fill="#1EF0AE" /></button>
            </div>
            <div className="body flex flex-col gap-4">
                <div className="body flex flex-col gap-2">
                    <div className="text-slate-600 text-2xl font-bold capitalize">channel name </div>
                    <Input onChange={(e) => { setInputValue(e.target.value) }} id={"channel_name"} lable={"channel name"} register={register} errors={errors} />
                </div>
                <div>
                    <div className="text-slate-600 text-2xl font-bold capitalize">add Users </div>
                    <div className="friends w-full flex flex-row flex-wrap gap-5  items-center p-2 ">
                        {
                        (aLLfriends && aLLfriends.length)
                            ? aLLfriends.map((item: userType, index: number) => (
                                <Friend key={index} onClick={(e) => {
                                    onSubmit(e)
                                    setuserId(e)
                                }} name={item.login} image={'/avatar.jpg'} id={item.id} />
                            ))
                            : <div></div>
                        }
                        <div className="max-w-[70px] flex flex-col items-center cursor-pointer" onClick={() => {
                            console.log("add friend")
                            channeLcreatemodaLHook.onClose();
                            channeLAddFriendsHookHook.onOpen();
                        }}>
                            <AiFillPlusCircle size={65} />
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <button className="text-white text-sm font-bold capitalize px-7 py-3 rounded-[12px] bg-zinc-900">
                    Create
                </button>
            </div>

        </div>
    )
    console.log("-----              --friends :", _friends)
    return <Modal IsOpen={channeLcreatemodaLHook.IsOpen} body={bodyContent} />
}
export default ChanneLCreateModaL