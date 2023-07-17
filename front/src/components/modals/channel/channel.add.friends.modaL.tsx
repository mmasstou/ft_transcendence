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
import { IoMdCloseCircle } from "react-icons/io"
import { AiFillPlusCircle } from "react-icons/ai"
import ChanneLAddFriendsHookHook from "@/hooks/channel.add.friends.hook"
import ChanneLcreatemodaLHook from "@/hooks/channel.create.hook"

const ChanneLAddFriendsModaL = () => {
    const channeLAddFriendsHookHook = ChanneLAddFriendsHookHook()
    const channeLcreatemodaLHook = ChanneLcreatemodaLHook()
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
            searchValue: '',
        },
    });

    const handlCloseModaL = () => {
        aLLfriends !== null && channeLAddFriendsHookHook.selectedFriends.push(...aLLfriends)
        const data = channeLAddFriendsHookHook.onClose()
        channeLcreatemodaLHook.onOpen(data)
        console.log("friends data :", data)
    }


  



    // Argument of type 'string' is not assignable to parameter of type '"channel_name" | "friends" | `friends.${number}` | `friends.${number}.id` | `friends.${number}.login` | `friends.${number}.email` | `friends.${number}.password` | `friends.${number}.first_name` | `friends.${number}.last_name` | `friends.${number}.kind` | `friends.${number}.image` | `friends.${number}.is_active`
    const setcustomvalue = (key: any, value: any) => {
        setValue(key, value, { shouldValidate: true, shouldDirty: true, shouldTouch: true })
    }
    const bodyContent = (
        <div className=" max-w-[598px] w-full md:min-w-[420px] bg-[#243230] min-h-[34rem] rounded-[8px] p-4 md:p-6 flex flex-col gap-5">
            <div className="header w-full flex flex-row justify-between items-center">
                <h2 className=" capitalize text-white">select Friends :  </h2>
                <button onClick={() => {
                    handlCloseModaL()
                }}><IoMdCloseCircle size={21} fill="#1EF0AE" /></button>
            </div>
           <div className="flex flex-col gap-4 h-full justify-between">
           <div className="body flex flex-col gap-4">
                <div className="body flex flex-col gap-2">
                    <div className="text-slate-600 text-2xl font-bold capitalize">Find Friend </div>
                    <Input onChange={(e) => { setInputValue(e.target.value) }} id={"searchValue"} lable={"Find Friend"} register={register} errors={errors} />
                </div>
                <div>
                <Friend  onClick={(e) => { }} name={item.login} image={'/avatar.jpg'} id={'dfdfdfdfd'} />
                </div>
            </div>
            <div>
                <button className="text-white text-sm font-bold capitalize px-7 py-3 rounded-[12px] bg-zinc-900">
                    Save
                </button>
            </div>
           </div>

        </div>
    )
    return <Modal IsOpen={channeLAddFriendsHookHook.isOpen} body={bodyContent} />
}
export default ChanneLAddFriendsModaL