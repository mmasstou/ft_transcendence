"use client"
import ContactHook from "@/hooks/contactHook"
import { TiArrowMinimise } from "react-icons/ti"
import { RegisterOptions, FieldValues, UseFormRegisterReturn, useForm, SubmitHandler, useFieldArray } from "react-hook-form"
import { useEffect, useState } from "react"
import { userType } from "@/types/types"
import Cookies from "js-cookie"
import { useRouter } from "next/navigation"


import ChanneLModal from "./channel.modal"
import Select from "../../components/Select"
import ChanneLcreatemodaLHook from "../hooks/channel.create.hook"
import ChanneLmodaLheader from "../components/channel.modal.header"
import Input from "@/components/Input"

const ChanneLCreateModaL = () => {
    const channeLcreatemodaLHook = ChanneLcreatemodaLHook()
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
            channel_name: '',
            friends: [],
        },
    });


    if (channeLcreatemodaLHook.selectedFriends && channeLcreatemodaLHook.selectedFriends.length && !watch('friends').length) {
        console.log("channeLcreatemodaLHook.selectedFriends :", channeLcreatemodaLHook.selectedFriends)
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
        console.log("+onSubmit+ +> UserId :", UserId)
        reset();
        setInputValue("");

    }

    const bodyContent = (
        <div className="  w-full p-4 md:p-6 flex flex-col justify-between min-h-[34rem]">
          
            <div className="body flex flex-col gap-4">
                <div className="body flex flex-col gap-2 py-4">
                    <h1 className=" text-[#ffffffb9] text-xl font-bold capitalize">channel name </h1>
                    <Input
                        onChange={(e :any) => { setcustomvalue(_channel_name, e.target.value) }}
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
            <div className="">
                <button onClick={handleSubmit(onSubmit)} className="text-white hover:text-black border border-secondary hover:bg-secondary text-sm font-bold capitalize px-7 py-3 rounded-[12px]  w-max">
                    Create
                </button>
            </div>
        </div>
    )
    // console.log("-----              --friends :", friends)
    return <ChanneLModal IsOpen={channeLcreatemodaLHook.IsOpen} title={"create channel"} children={bodyContent} onClose={channeLcreatemodaLHook.onClose} />
        // IsOpen={channeLcreatemodaLHook.IsOpen}
        // body={bodyContent} />
}
export default ChanneLCreateModaL