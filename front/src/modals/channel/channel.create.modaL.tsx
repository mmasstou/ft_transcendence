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
import ChanneLAddFriendsItem from "@/components/chat/channel/channel.add.friends.friendItem"
import ChanneLmodaLheader from "@/components/chat/channel.modal.header"
import Select from "../Select"

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
     // console.log("token :", token)
        if (!token)
            return;
        (async function getFriends() {
            await fetch('http://127.0.0.1/api/users', {
                headers: { Authorization: `Bearer ${token}`, },
            }).then((resp) => resp.json()).then(data => {
             // console.log("++++++++++*****data :", data)
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
     // console.log("channeLcreatemodaLHook.selectedFriends :", channeLcreatemodaLHook.selectedFriends)
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
     // console.log("+onSubmit+ +> UserId :", UserId)
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
 // console.log("-----              --friends :", friends)
    return <Modal
        IsOpen={channeLcreatemodaLHook.IsOpen}
        body={bodyContent} />
}
export default ChanneLCreateModaL