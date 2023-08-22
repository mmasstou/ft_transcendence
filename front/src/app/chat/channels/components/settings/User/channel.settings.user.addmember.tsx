'use client'
import Input from "@/components/Input"
import { FieldValues, RegisterOptions, UseFormRegisterReturn, useForm } from "react-hook-form";
import Button from "../../../../components/Button";
import { IoChevronBackOutline, IoSend } from "react-icons/io5";
import ChannelSettingsUserMemberItem from "./channel.settings.user.memberItem";
import React, { useEffect, useState } from "react";
import { RoomsType, membersType, updatememberEnum, userType } from "@/types/types";
import Cookies from "js-cookie";
import getUsers from "../../../actions/getUsers";
import Image from "next/image";
import getChannelMembersWithId from "../../../actions/getChannelmembers";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Socket, io } from "socket.io-client";
import LeftSidebarHook from "../../../hooks/LeftSidebarHook";
import ChanneLsettingsHook from "../../../hooks/channel.settings";
import getChannelWithId from "../../../actions/getChannelWithId";
import { RiSearchLine } from "react-icons/ri";
import ChanneLSettingsBody from "../../channel.settings.body";
import { toast } from "react-hot-toast";
import Loading from "../../CanneLSettingsLoading";
import FindOneBySLug from "../../../actions/Channel/findOneBySlug";
import getMemberWithId from "../../../actions/getMemberWithId";

interface IChannelSettingsMemberJoinModalProps {
    OnBack: () => void;
    OnClick: (data: any) => void
    socket: Socket | null
}
export default function ChanneLSettingsMemberJoinModaL(
    { OnBack, OnClick, socket }: IChannelSettingsMemberJoinModalProps
) {
    const query = useParams();
    const slug: string = typeof query.slug === 'string' ? query.slug : query.slug[0];
    const [IsMounted, setIsMounted] = React.useState(false)
    const [users, setUsers] = React.useState<userType[] | null>(null)
    const [searchInput, setInputValue] = React.useState<string>("")
    const [update, setUpdate] = React.useState<boolean>(false)
    const params = useSearchParams()
    const router = useRouter()
    const channeLsettingsHook = ChanneLsettingsHook()
    const InputRef = React.useRef<HTMLInputElement | null>(null);
    const [Friends, setFriends] = React.useState<userType[] | null>(null)
    const [Usersocket, setUsersocket] = React.useState<Socket | null>(null);
    const [IsLoading, setLoading] = React.useState(true)
    const [ChanneLInfo, setChanneLInfo] = React.useState<RoomsType | null>(null)
    const User = Cookies.get('_id')
    const token: any = Cookies.get('token');
    if (!User || !token) return


    React.useEffect(() => {
        setIsMounted(true);
        const _socket = io(`${process.env.NEXT_PUBLIC_USERSOCKET_URL_WS}`, {
            auth: {
                token, // Pass the token as an authentication parameter
            },
        });
        toast('NEXT_PUBLIC_USERSOCKET_URL_WS addmember')
        setUsersocket(_socket);
        (async () => {
            const ChanneL = await FindOneBySLug(slug, token);
            if (!ChanneL) return;
            setChanneLInfo(ChanneL)
        })();
        setTimeout(() => {
            setLoading(false);
        }, 200);


        return () => { _socket.disconnect() }
    }, [])

    // focus on search :
    React.useEffect(() => {
        // handlFriendToAddToChanneL()
        if (!IsLoading) {
            setTimeout(() => {
                if (InputRef.current) {
                    InputRef.current.focus();
                }
            }, 100); // sleep .1s ; waiting search input to mounted in focus on it
        }

    }, [IsLoading])

    React.useEffect(() => {
        (async () => {

            if (!ChanneLInfo) return;
            Usersocket?.emit('FriendToAddToChanneL', {
                channeL: ChanneLInfo,
                searchquery: searchInput
            })
        })()
    }, [searchInput])


    const handlFriendToAddToChanneL = () => {
        // if (!searchInput) return
        (async () => {
            const ChanneL = await FindOneBySLug(slug, token);
            if (!ChanneL) return;
            Usersocket?.emit('FriendToAddToChanneL', {
                channeL: ChanneL,
                searchquery: searchInput
            })
        })()
    }

    React.useEffect(() => {
        Usersocket?.on('FriendToAddToChanneLResponse', (Friends: userType[]) => {
            setFriends(Friends)
        })
    }, [Usersocket])


    if (!IsMounted) return null
    return <ChanneLSettingsBody
        title={`Add Friends`}
        OnBack={OnBack}
        HasPermission={false} >
        <div className="hjhjhjhj flex flex-col min-h-[24rem] w-full gap-4">

            <div className=" flex flex-col">

                <div className=" relative w-full">
                    <div className="ConversationsInput w-full h-[54px] bg-[#24323044] text-[#ffffff]  text-[16px]  rounded-[12px] flex justify-end items-center p-2">
                        {/* <RiSearchLine size={24} fill="#FFFFFF" /> */}
                        <input
                            ref={InputRef}
                            disabled={IsLoading}
                            onKeyDown={(event) =>
                                event.key === "Enter" ? handlFriendToAddToChanneL() : null
                            }
                            className="focus:outline-none placeholder:text-[#b6b6b6e3] placeholder:text-base placeholder:font-thin w-full py-1 px-4 bg-transparent"
                            onChange={(event) => { setInputValue(event.target.value) }}
                            value={searchInput}
                            placeholder={`Fiend friend`}
                            type="search"
                            name=""
                            id="" />
                        <Button outline small icon={RiSearchLine} onClick={handlFriendToAddToChanneL} />
                    </div>

                </div>
            </div>
            <div className="overflow-y-scroll max-h-[28rem] flex flex-col w-full gap-2">

                {IsLoading ? <Loading /> : (Friends && Friends.length > 0)
                    ? Friends.map((Friend: userType, index: number) => (
                        <ChannelSettingsUserMemberItem
                            key={index}
                            member={
                                {
                                    id: "sss",
                                    type: "",
                                    userId: Friend.id,
                                    isban: false,
                                    ismute: false,
                                    roomsId: "",
                                    directmessageId: "",
                                    created_at: "",
                                    updated_at: "",
                                    mute_at: ''
                                }
                            }
                            UserJoin={true}
                            socket={null}
                            OnClick={(data) => {
                                if (!ChanneLInfo)
                                    return;
                                socket?.emit(
                                    `${process.env.NEXT_PUBLIC_SOCKET_EVENT_JOIN_MEMBER}`,
                                    {
                                        userid: Friend.id,
                                        roomid: ChanneLInfo.id
                                    });
                                OnClick(() => {
                                    (async () => {
                                        const member = await getMemberWithId(Friend.id, ChanneLInfo.id, token)
                                        if (!member) return
                                        return { updateType: updatememberEnum.MUTEMEMBER, member: member }
                                    })();
                                })
                            }} />

                    ))
                    : <div className="flex flex-col w-full justify-center items-center h-auto">
                        <Image src={"/not_found.svg"} width={200} height={200} alt={"not_found"} />
                        <h2 className=" capitalize font-extrabold text-white">no result</h2>
                    </div>}
            </div>
        </div>
    </ChanneLSettingsBody >
}