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
    const [inputValue, setInputValue] = useState("")
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

   

    const onSubmit: SubmitHandler<FieldValues> = async (data: any) => {


    //    console.log("Data :", data)
        const API_PATH = process.env.API_URL
        // console.log("API_PATH :", API_PATH)
        // router.push(`${process.env.NEXT_PUBLIC_API_URL}/auth/callback`)
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
    return <Modal isVisible={loginHook.IsOpen} onClose={function (isOpen: boolean): void { }} children={bodyContent} />
}

export default Login