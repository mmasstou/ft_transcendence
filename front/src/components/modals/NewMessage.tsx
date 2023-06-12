"use client"
import ContactHook from "@/hooks/contactHook"
import Modal from "./modaL copy"
import { TiArrowMinimise } from "react-icons/ti"
import Input from "../chat/Input"
import { RegisterOptions, FieldValues, UseFormRegisterReturn, useForm, SubmitHandler } from "react-hook-form"
import Friend from "../chat/Friend"
import { useEffect, useState } from "react"
import { userType } from "@/types/types"
import Cookies from "js-cookie"

const NewMessage = () => {
    const contacthook = ContactHook()

    const token = Cookies.get('token')
    const [friends, setfriends] = useState<userType[] | null>(null)
    const [userId, setuserId] = useState<any | null>(null)
    const [InputValue, setInputValue] = useState("")



    useEffect(() => {
        fetch('http://10.12.9.12/users', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).then((resp) => resp.json()).then(data => setfriends(data))
    }, [])

    useEffect(() => {
        const filterData = friends && friends.filter((item : userType )=> {
            const _login: string = item.login.toLowerCase()
            return _login.includes(InputValue.toLowerCase())
        });
        setfriends(filterData);
    }, [InputValue])
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: {
            errors,
        }
    } = useForm<FieldValues>({
        defaultValues: {
            friend: 'gdfggf',
        }
    });

    const onSubmit: SubmitHandler<FieldValues> = async (data: any) => {
        console.log("+> ", data)
    }
    console.log("data :", userId)
    const bodyContent = (
        <div className=" max-w-[798px] w-full md:min-w-[420px] bg-[#243230] max-h-[867px] rounded-sm p-4 flex flex-col gap-4">
            <div className="header w-full flex flex-row justify-between items-center">
                <h2>Nouveau message </h2>
                <button onClick={() => contacthook.onClose()}><TiArrowMinimise size={21} /></button>
            </div>
            <div className="body">
                <Input onChange={(e) => { setInputValue(e.target.value) }} id={"friend"} lable={"A"} register={register} errors={errors} />
            </div>

            <div className="friends w-full flex flex-row flex-wrap gap-5  items-center">
                {friends && friends.length && friends.map((item: userType, index: number) => (
                    <Friend key={index} onClick={(e) => {
                        handleSubmit(onSubmit)
                        setuserId(e)
                    }} name={item.login} image={'/avatar.jpg'} id={item.id} />
                ))}
            </div>

        </div>
    )


    console.log("friends :", friends)
    return <Modal IsOpen={contacthook.IsOpen} body={bodyContent} />
}
export default NewMessage