'use client'
import Input from "@/components/Input"
import { FieldValues, RegisterOptions, UseFormRegisterReturn, useForm } from "react-hook-form";
import Button from "../../components/Button";
import { IoChevronBackOutline } from "react-icons/io5";
import ChannelSettingsUserMemberItem from "../components/channel.settings.user.memberItem";
import React from "react";
import { membersType, userType } from "@/types/types";
import Cookies from "js-cookie";
import getUsers from "../actions/getUsers";
import Image from "next/image";
import getChannelMembersWithId from "../actions/getChannelmembers";
import { useRouter, useSearchParams } from "next/navigation";
import { Socket } from "socket.io-client";
import LeftSidebarHook from "../hooks/LeftSidebarHook";
import ChanneLsettingsHook from "../hooks/channel.settings";

interface IChannelSettingsMemberJoinModalProps {
    OnClick: () => void,
    socket: Socket | null
}
export default function ChanneLSettingsMemberJoinModaL(
    { OnClick, socket }: IChannelSettingsMemberJoinModalProps
) {
    const [IsMounted, setIsMounted] = React.useState(false)
    const [users, setUsers] = React.useState<userType[] | null>(null)
    const [searchInput, setsearchInput] = React.useState<string>("")
    const [channelMembers, setchannelMembers] = React.useState<membersType[] | null>(null)
    const [update, setUpdate] = React.useState<boolean>(false)
    const LogedUser = Cookies.get('_id')
    const params = useSearchParams()
    const router = useRouter()
    const channeLsettingsHook = ChanneLsettingsHook()
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
            searchInput: '',

        },
    });
    React.useEffect(() => { setIsMounted(true) }, [])
    React.useEffect(() => {
        (async () => {
            // get channel members :
            const token: any = Cookies.get('token');
            if (!token)
                return;
            const channeLId = params.get('r')
            if (!channeLId)
                return;
            const response = await getChannelMembersWithId(channeLId, token)
            setchannelMembers(response)

        })();
    }, [users])
    React.useEffect(() => {
        if (!searchInput) {
            setUsers(null)
            return;
        }
        (async () => {
            const token: any = Cookies.get('token');
            if (!token)
                return;
            if (!channelMembers) return;
            const response = await getUsers(token)
            setUsers(response.filter((user: userType) => {
                if (user.login.includes(searchInput)) {
                    if (user.id === LogedUser)
                        return false;
                    if (channelMembers && channelMembers.length > 0) {
                        const _member = channelMembers.find((member: membersType) => member.userId === user.id)
                        if (_member)
                            return false;
                    }
                    return true;
                }
            }))
        })();
    }, [searchInput, update])

    const handlOnclick = (data: {userid : string, roomid : string}) => {

        socket?.emit('joinmember', data)

    }

    socket?.on('joinmemberResponseEvent', (data) => {

        setUpdate(true)
        router.refresh()
        channeLsettingsHook.onClose()
    })
    if (!IsMounted) return null
    return (
        <div className="flex flex-col w-full">
        <Button
            icon={IoChevronBackOutline}
            label={"Back"}
            outline
            onClick={OnClick}
        />
        <div className=" p-5 flex flex-col">

            <div className=" relative w-full">
                <input
                    id={'searchInput'}
                    {...register('searchInput', { required: false })}
                    placeholder=" "
                    type="search"
                    value={searchInput}
                    onChange={(e) => {
                        e.preventDefault()
                        setsearchInput(e.target.value)
                    }}
                    className={`
             peer w-full pl-3 pt-6 text-xl bg-transparent text-white border text-[var(--white)] focus:bg-transparent font-light   rounded-md outline-none transition disabled:opacity-70 disabled:cursor-not-allowed
             ${errors['searchInput'] ? ' border-rose-500 focus:border-rose-500' : ' border-ç focus:border-teal-500'}`}
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
                ${(searchInput.length !== 0 || !searchInput) ? 'scale-75 -translate-y-4' : ''}
                ${errors['searchInput'] ? 'text-rose-500' : 'text-zinc-500'}
                `}>
                    find member
                </label>
            </div>
        </div>
        <div className=" p-5 overflow-y-scroll max-h-[28rem] flex flex-col w-full">

            {(users && users.length > 0)
                ? users.map((user, index) => (
                    <ChannelSettingsUserMemberItem
                        key={index}
                        member={
                            {
                                id: "",
                                type: "",
                                userId: user.id,
                                isban: false,
                                ismute: false,
                                roomsId: "",
                                directmessageId: "",
                                created_at: "",
                                updated_at: "",
                                CanEdit: false
                            }
                        }
                        UserJoin={true}
                        socket={null}
                        OnClick={(data) => {
                            const channeLId = params.get('r')
                            if (!channeLId)
                                return;
                            handlOnclick({
                                userid : user.id,
                                roomid : channeLId
                            })
                        }} />

                ))
                : <div className="flex flex-col w-full justify-center items-center h-auto">
                    <Image src={"/not_found.svg"} width={200} height={200} alt={"not_found"} />
                    <h2 className=" capitalize font-extrabold text-white">no result</h2>
                </div>}
        </div>
    </div>
    )
}