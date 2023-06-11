'use client'
import { useState } from "react";
import Cookies from 'js-cookie';
import Input from "../components/Input";
import Modal from "./modaL"
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

import { HiOutlineLogin } from "react-icons/hi"
import LoginHook from "../hooks/login";
import { useRouter } from "next/navigation";



const Login = () => {
    const [isLoading, setIsLoading] = useState(false);
    const loginHook = LoginHook()
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

    const onSubmit: SubmitHandler<FieldValues> = async (data) => {


        // console.log("Data :", data)
        const API_PATH = process.env.API_URL
        // console.log("API_PATH :", API_PATH)
        const token = await fetch(`http://10.12.10.15/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Connection: "keep-alive",
            },
            body: JSON.stringify(data),
        })
        if (token.status === 200){
            loginHook.onClose()
            const user_token = await token.json()
            Cookies.set("token", user_token.access_token)
        }
    }
    const bodyContent = (
        <div className="flex flex-col gap-4 w-full sm:w-[440px]  sm:h-[260px] bg-[#243230] p-4">
            <div className="flex flex-col gap-4">
                <Input
                    id='username'
                    lable="username"
                    disabled={isLoading}
                    register={register}
                    errors={errors}
                    required
                />
                <Input
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
    return <Modal IsOpen={loginHook.IsOpen} body={bodyContent} />
}

export default Login