'use client'
import { useEffect, useState } from "react";
import Cookies from 'js-cookie';
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

import { HiOutlineLogin } from "react-icons/hi"
import { useRouter } from "next/navigation";
import { Socket, io } from "socket.io-client";
import Modal from "./Modal";
import Input from "@/components/Input";
import LoginHook from "@/hooks/auth/login";


const Login = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [socket, setSocket] = useState<Socket | null>(null);
    const loginHook = LoginHook()
    const token = Cookies.get("token")
    const router = useRouter()
    const {
        register,
        handleSubmit,
        watch,
        reset,
        setValue,
        formState: {
            errors,
        }
    } = useForm<FieldValues>({
        defaultValues: {
            username: '',
            password: ''
        }
    });

    useEffect(() => {

        const socket: Socket = io("http://localhost:80/User", {
            auth: {
                token: `${token}`,
                id: `${Cookies.get("_id")}`
            }
        });
        setSocket(socket);

        // const messageSocket: messageSocket = {
        //     roomId: roomid,
        //     messageContent: message
        // }
        // // if (message) {

        // socket && socket.emit("sendMessage", messageSocket, () => setmessages(""));
        socket && socket.on("connected", (data) => {
         // console.log("data :", data)
        })


        return () => {
            socket && socket.disconnect();
        };
       
    }, [])

    const onSubmit: SubmitHandler<FieldValues> = async (data: any) => {


     // console.log("Data :", data)
        const API_PATH = process.env.API_URL
        // console.log("API_PATH :", API_PATH)
        const token = await fetch(`http://127.0.0.1/api/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Connection: "keep-alive",
            },
            body: JSON.stringify(data),
        })
        if (token.status === 200) {
            loginHook.onClose()
            const user_token = await token.json()
            Cookies.set("token", user_token.access_token)
            Cookies.set("_id", user_token._id)
        }
    }
    const bodyContent = (
        <div className="flex flex-col gap-4 w-full sm:w-[440px]  sm:h-[260px] bg-[#243230] p-4">
            <div className="flex flex-col gap-4">
                <Input
                    onChange={() => { }}
                    id='username'
                    lable="username"
                    disabled={isLoading}
                    register={register}
                    errors={errors}
                    required
                />
                <Input
                    onChange={() => { }}
                    id='password'
                    lable="password"
                    type="password"
                    disabled={isLoading}
                    register={register}
                    errors={errors}
                    required
                />

            </div>
            <div className="w-full flex justify-center items-center">
                <button onClick={handleSubmit(onSubmit)} className=" btn  px-4 py-1 rounded bg-[#161F1E] flex justify-center items-center text-white " type="submit"><HiOutlineLogin />login</button>
            </div>
        </div>

    );
    return <Modal isVisible={loginHook.IsOpen} onClose={function (isOpen: boolean): void {} } children={bodyContent}  />
}

export default Login