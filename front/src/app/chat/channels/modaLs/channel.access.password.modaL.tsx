"use client"
import { userType } from "@/types/types"
import Cookies from "js-cookie"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"


import ChanneLPasswordAccessHook from "../hooks/Channel.Access.Password.hook"
import ChanneLModal from "./channel.modal"
enum RoomType {
    PUBLIC = 'PUBLIC',
    PRIVATE = 'PRIVATE',
}
const ChanneLPasswordAccessModaL = () => {
    const { IsOpen, onClose, onOpen, socket, room, OnSave, password, event, accesstype, data } = ChanneLPasswordAccessHook()
    const route = useRouter()
    const [aLLfriends, setfriends] = useState<any[] | null>(null)
    const [userId, setuserId] = useState<userType | null>(null)
    const [InputValue, setInputValue] = useState("")
    const [IsMounted, setIsMounted] = useState<boolean>(false)
    const InputRef = useRef<HTMLInputElement | null>(null);

    const UserId = Cookies.get('_id')

    let users: any[] = []
    useEffect(() => { setIsMounted(true) }, [])
    useEffect(() => {
        if (InputRef.current) {
            InputRef.current.focus();
        }
    }, [IsOpen])
    const onSubmit = () => {
        if (!UserId || !room) return;
        // create private room : createroom
        // check if passaword is room password
        const evenData = {
            password: InputValue,
            ...data
        }
        console.log("the password is match you can acces now!")
        socket?.emit(event, evenData);
        setInputValue("")
        onClose()
    }

    if (!IsMounted) return

    const bodyContent = (
        <div className="  w-full p-4 md:p-2 flex flex-col justify-between min-h-[5rem]">
            <div className="body flex flex-col gap-4">
                <div className="body flex flex-col gap-2 py-4">
                    <div className=" relative w-full">
                        <input
                            ref={InputRef}
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

    return <ChanneLModal IsOpen={IsOpen} title={`Join To ${room?.name}`} children={bodyContent} onClose={onClose} />

}
export default ChanneLPasswordAccessModaL