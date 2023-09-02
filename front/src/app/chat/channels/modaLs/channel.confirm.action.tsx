"use client"
import ContactHook from "@/hooks/contactHook"
import { TiArrowMinimise } from "react-icons/ti"
import { RegisterOptions, FieldValues, UseFormRegisterReturn, useForm, SubmitHandler, useFieldArray, set } from "react-hook-form"
import { MouseEvent, useCallback, useEffect, useRef, useState } from "react"
import { RoomsType, userType } from "@/types/types"
import Cookies from "js-cookie"
import { useRouter } from "next/navigation"
import ChanneLModal from "./channel.modal"
import ChanneLConfirmActionHook from "../hooks/channel.confirm.action"
import Button from "../../components/Button"
import { AiFillCloseCircle } from "react-icons/ai"
// Are you sure you want to permanently erase the items in the Trash?
const ChanneLConfirmActionModaL = () => {
    const [IsMounted, setIsMounted] = useState<boolean>(false)
    const channeLConfirmActionHook = ChanneLConfirmActionHook()


    useEffect(() => { setIsMounted(true) }, [])
    if (!IsMounted || !channeLConfirmActionHook.IsOpen) return

    return <div className={`absolute top-0 bg-[#2632389e] w-full h-full  flex justify-center items-center z-[47]`}>
    <div className=" w-full max-w-xl bg-[#2B504B] m-3 rounded">
        <div className="flex justify-end items-center p-2 w-full mb-2">
            {/* <h1 className=" text-white capitalize pl-6">Delete modal</h1> */}
            <Button
                icon={AiFillCloseCircle}
                small
                outline
                onClick={channeLConfirmActionHook.onClose}
            />
        </div>
        <div className="flex flex-col p-2">
        <div className="  w-full p-4 md:p-2 flex flex-col justify-between min-h-[7rem]">
            <div className="body flex flex-col gap-4">
                <div className="body flex flex-col gap-2 py-4">
                    <div className=" relative w-full flex flex-col justify-center items-center text-white">
                        <h2 className=" text-xl text-center">{channeLConfirmActionHook.message}</h2>
                        <span className=" text-xs">You can’t undo this action.</span>

                    </div>
                </div>
            </div>
            <div className="w-full flex flex-row gap-4">
                <button
                    onClick={channeLConfirmActionHook.onClose}
                    className="text-white hover:text-secondary border hover:border-secondary text-sm font-bold capitalize px-7 py-3 rounded-[12px]  w-full">
                    deny
                </button>
                {/* <button
                    onClick={}
                    className="text-balck hover:text-danger  border border-secondary bg-secondary text-sm font-bold capitalize px-7 py-3 rounded-[12px]  w-full">
                    confirm
                </button> */}
                {channeLConfirmActionHook.ConfirmBtn}
            </div>
        </div>
        </div>
    </div>
</div>

}
export default ChanneLConfirmActionModaL