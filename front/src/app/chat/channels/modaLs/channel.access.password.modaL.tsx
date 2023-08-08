"use client"
import ContactHook from "@/hooks/contactHook"
import { TiArrowMinimise } from "react-icons/ti"
import { RegisterOptions, FieldValues, UseFormRegisterReturn, useForm, SubmitHandler, useFieldArray, set } from "react-hook-form"
import { MouseEvent, useCallback, useEffect, useState } from "react"
import { RoomsType, userType } from "@/types/types"
import Cookies from "js-cookie"
import { useRouter } from "next/navigation"


import ChanneLModal from "./channel.modal"
import Select from "../../components/Select"
import ChanneLcreatemodaLHook from "../hooks/channel.create.hook"
import ChanneLmodaLheader from "../components/channel.modal.header"
import Input from "@/components/Input"
import getUserWithId from "../actions/getUserWithId"
import Button from "../../components/Button"
import { RiGitRepositoryPrivateFill } from "react-icons/ri"
import { MdOutlinePublic } from "react-icons/md"
import { GrSecure, GrInsecure } from "react-icons/gr"
import { GoEyeClosed } from "react-icons/go"
import { HiLockClosed, HiLockOpen } from "react-icons/hi"
import getUsers from "../actions/getUsers"
import ChanneLPasswordAccessHook from "../hooks/Channel.Access.Password.hook"
import { toast } from "react-hot-toast"
enum RoomType {
    PUBLIC = 'PUBLIC',
    PRIVATE = 'PRIVATE',
}
const ChanneLPasswordAccessModaL = () => {
    const { IsOpen, onClose, onOpen, socket, room, OnSave, password } = ChanneLPasswordAccessHook()
    const route = useRouter()
    const [aLLfriends, setfriends] = useState<any[] | null>(null)
    const [userId, setuserId] = useState<userType | null>(null)
    const [InputValue, setInputValue] = useState("")
    const [IsMounted, setIsMounted] = useState<boolean>(false)
    const UserId = Cookies.get('_id')

    let users: any[] = []
    useEffect(() => { setIsMounted(true) }, [])
    const onSubmit = () => {
        if (!UserId) return;
        // create private room : createroom
        // check if passaword is room password
        console.log("Acces password :", room?.password)
        console.log("InputValue :", InputValue)
        if (InputValue !== room?.password) {
            toast.error('the password not match');
            setInputValue('')
            return
        }
        console.log("the password is match you can acces now!")
        socket?.emit(
            `${process.env.NEXT_PUBLIC_SOCKET_EVENT_JOIN_MEMBER}`,
            { userId: UserId, roomId: room.id });
        onClose()
    }

    // useEffect(() => {
    //     socket?.on(
    //         `${process.env.NEXT_PUBLIC_SOCKET_EVENT_RESPONSE_CHAT_MEMBER_UPDATE}`,
    //         (data: {
    //             message: string,
    //             status: any,
    //             data: RoomsType,
    //         }) => {
    //             console.log("RESPONSE_CHAT_MEMBER_UPDATE :", data)
    //             if (!data) {
    //                 toast.error('error')
    //             }
    //             if (data) {
    //                 toast.success(data.message)
    //                 route.push(`/chat/channels?r=${data.data.id}`)
    //                 onClose()
    //             }
    //         });
    // }, [socket])

    if (!IsMounted) return

    const bodyContent = (
        <div className="  w-full p-4 md:p-2 flex flex-col justify-between min-h-[5rem]">
            <div className="body flex flex-col gap-4">
                <div className="body flex flex-col gap-2 py-4">
                    <div className=" relative w-full">
                        <input
                            id={room?.id}
                            placeholder=" "
                            type='password'
                            value={InputValue}
                            onKeyDown={(event) => event.key === "Enter" ? onSubmit() : null}
                            onChange={(e) => { setInputValue(e.target.value) }}
                            className={`
             peer w-full pl-3 pt-6 text-xl bg-transparent text-white border text-[var(--white)] focus:bg-transparent font-light   rounded-md outline-none transition disabled:opacity-70 disabled:cursor-not-allowed
              border-ç focus:border-teal-500`}
                        />
                        <label htmlFor=""
                            className={`
                text-[var(--white)]
                absolute
                text-md
                duration-150
                transform
                -translate-x-3
                top-5
                z-10
                origin-[0]
                left-7
                peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0
                peer-focus:scale-75 peer-focus:-translate-y-4
                ${(InputValue.length !== 0 || !InputValue) ? 'scale-75 -translate-y-4' : ''}
                text-zinc-500`}>
                            type Password
                        </label>
                    </div>
                </div>
            </div>
            <div className="w-full">
                <button
                    onClick={() => {
                        onSubmit()
                    }}
                    className="text-white hover:text-black border border-secondary hover:bg-secondary text-sm font-bold capitalize px-7 py-3 rounded-[12px]  w-full">
                    Join
                </button>
            </div>
        </div>
    )

    return <ChanneLModal IsOpen={IsOpen} title={`Toin To ${room?.name}`} children={bodyContent} onClose={onClose} />

}
export default ChanneLPasswordAccessModaL