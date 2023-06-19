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
import { useRouter } from "next/navigation"

const NewMessage = () => {
    const contacthook = ContactHook()
    const route = useRouter()
    const token = Cookies.get('token')
    const [friends, setfriends] = useState<userType[] | null>(null)
    const [userId, setuserId] = useState<any | null>(null)
    const [InputValue, setInputValue] = useState("")

    useEffect(() => {
        fetch('http://127.0.0.1/users', {
            headers: { Authorization: `Bearer ${token}`, },
        }).then((resp) => resp.json()).then(data => setfriends(data))
    }, [])

    useEffect(() => {
        const filterData = friends && friends.filter((item: userType) => {
            const _login: string = item.login.toLowerCase()
            return _login.includes(InputValue.toLowerCase())
        });
        setfriends(filterData);
    }, [InputValue])


    const { register, handleSubmit, formState: { errors } } = useForm<FieldValues>({
        defaultValues: {
            friend: '',
        }
    });

    const onSubmit: SubmitHandler<FieldValues> = async (UserId: any) => {

        
        // create private room :


        try {
            const resp = await fetch('/api/rooms', {
                method : 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId : UserId,
                    token:`Bearer ${token}`
                })
            })
            if (resp.ok){
                const __data = await resp.json()
                console.log("__data :", __data)
                route.push(`/chat?room=${__data.id}`)
                contacthook.onClose()
            }
        } catch (error) {
            console.error('Error creating room:', error);
        }
        // console.log("ana Hana!")
        // try {
        //     console.log("+> ", UserId)
        //     const response = await fetch(`http://127.0.0.1/users/${UserId}`, {
        //         method: 'GET',
        //         headers: {
        //             Authorization: `Bearer ${token}`,
        //             'Content-Type': 'application/json',
        //         }
        //     });

        //     if (response.ok) {
        //         console.log('Room created successfully!');
        //         const userdata = await response.json()
        //         console.log("userdata :", userdata)
        //     } else {
        //         console.error('Failed to create room.');
        //     }
        // } catch (error) {
        //     console.error('Error creating room:', error);
        // }


    }
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
                        onSubmit(e)
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