import React, { useEffect } from "react";
import ChannelSettingsUserMemberItem from "./channel.settings.user.memberItem";
import { RoomsType, USERSETTINGSTEPS, UserTypeEnum, membersType, updatememberEnum, userType } from "@/types/types";
import ChanneLsettingsHook from "../../../hooks/channel.settings";
import Cookies from "js-cookie";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import getChannelMembersWithId from "../../../actions/getChannelmembers";
import { Socket } from "socket.io-client";
import getUserWithId from "../../../actions/getUserWithId";
import getMemberWithId from "../../../actions/getMemberWithId";
import Image from "next/image";
import ChanneLUserSettingsModaL from "../../../modaLs/channel.user.settings.modal";
import Button from "../../../../components/Button";
import { TbUserPlus } from "react-icons/tb";
import ChanneLSettingsMemberJoinModaL from "./channel.settings.user.addmember";
import { IoChevronBackOutline } from "react-icons/io5";
import { BsArrowRightShort } from "react-icons/bs";
import { MdOutlineScoreboard } from "react-icons/md";
import { TfiTimer } from "react-icons/tfi";
import ChanneLConfirmActionBtn from "../../channel.confirm.action.Btn";
import ChanneLConfirmActionHook from "../../../hooks/channel.confirm.action";
import getmessage from "../../../actions/member.action.message";
import axios from "axios";
import { toast } from "react-hot-toast";
import StartGame from "../../../actions/startgame";
import ChanneLsettingsPlayGame from "../../channel.settings.playgame";
import { steps } from "framer-motion";
import ChanneLSettingsEditModaL from "../../../modaLs/channel.settings.edit.modal";
import getLable from "../../../actions/getLable";
import { tr } from "date-fns/esm/locale";
import { set } from "date-fns";

interface ChanneLUserSettingsProps {
    room: RoomsType | null;
    member: membersType | null
    User: userType | null
    socket: Socket | null
}



export default function ChanneLUserSettings({ socket, member, User, room }: ChanneLUserSettingsProps) {

    const query = useParams();
    const slug: string = typeof query.slug === 'string' ? query.slug : query.slug[0];
    const [IsMounted, setIsMounted] = React.useState(false)
    const [members, setMembers] = React.useState<membersType[]>([])
    const [LogedMember, setLogedMember] = React.useState<membersType | null>(null)
    const [step, setStep] = React.useState<USERSETTINGSTEPS>(USERSETTINGSTEPS.INDEX)
    const [PlayGameWith, setPlayGameWith] = React.useState<membersType | null>(null)
    const channeLConfirmActionHook = ChanneLConfirmActionHook()
    const [update, setUpdate] = React.useState<boolean>(false)
    const channeLsettingsHook = ChanneLsettingsHook()
    const params = useSearchParams()
    const __userId = Cookies.get('_id')
    const router = useRouter()
    const token: any = Cookies.get('token');

    const updatemembers = (itemId: string, updateMemberData: membersType) => {
        console.log("members :", members)
        console.log("updateMemberData :", updateMemberData)
        console.log("itemId :", itemId)
        members && toast(members?.length.toString())
        let found: boolean = false;
        const updatedItems = members && members.map(item => {
            if (item.id === itemId) {
                found = true;
                return { ...updateMemberData }
            }
            else return item
        }
        );
        if (updatedItems && !found) setMembers([...members, updateMemberData]);
        else setMembers(updatedItems);
        updatedItems && toast(updatedItems?.length.toString())

    };

    React.useEffect(() => {
        setIsMounted(true);
        (async () => {
            const _members = room && await getChannelMembersWithId(room?.id, token)
            if (_members) setMembers(_members)
        })();
        member && setLogedMember(member)
    }, [])

    // check for rooms socket events :
    React.useEffect(() => {
        socket?.on(`${process.env.NEXT_PUBLIC_SOCKET_EVENT_RESPONSE_CHAT_MEMBER_UPDATE}`,
            (response: {
                status: any, message: any, data: any
            }) => {
                channeLConfirmActionHook.onClose()
                if (response.status === "SUCCESS") {
                    // updatemembers(response.data.id, response.data)
                    // toast(response.data.id)
                    setMembers([...members, response.data])
                    // (async () => {
                    //     const _members = room && await getChannelMembersWithId(room?.id, token)
                    //     if (_members) setMembers(_members)
                    // })();
                }
                if (response.status === "ERROR") { }


            })

        socket?.on(`${process.env.NEXT_PUBLIC_SOCKET_EVENT_RESPONSE_CHAT_UPDATE}`, (data) => {

        })

        socket?.on('notificationEvent', (data) => {
            (async () => {
                const body = {       ///////////////////////////////////////////////////////// body
                    player1Id: PlayGameWith?.userId,
                    player2Id: LogedMember?.userId,
                    mode: "time"
                }
                // await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/game/BotGame`, body).then((result) => {
                //     console.log("await axios.post(`${process.env.NEXT_PUBLIC :", result)
                //     router.push('/game/score/robot')
                // }).catch(() => {
                //     toast.error("error")
                // })

                const token: any = Cookies.get('token');
                if (!token) return;
                const g = await StartGame(body, token);
                if (!g) return;
                router.push('/game/time/friend')
            })();
        })
    }, [socket])

    React.useEffect(() => {

        (async () => {
            if (!room)
                return;
            const channeLLMembers = await getChannelMembersWithId(room.id, token)
            if (channeLLMembers) {
                // const __filterMembers = channeLLMembers.filter((member: membersType) => member.userId !== __userId)
                // filter if member is ban or member userId === loged userId
                const filterdmembers = channeLLMembers.filter((member: membersType) => member.isban !== true)
                setMembers(filterdmembers.filter((member: membersType) => member.userId !== __userId))
            }

        })();
        setUpdate(false);

        (async () => {
            const token: any = Cookies.get('token');
            // get loged member :
            const channeLLid = params.get('r')
            if (!channeLLid)
                return;
            const channeLLMembers = __userId && await getMemberWithId(__userId, channeLLid, token)
            if (channeLLMembers && channeLLMembers.statusCode !== 200) {
                setLogedMember(channeLLMembers)
            }
        })();
    }, [update])




    const handlOnclick = (data: { updateType?: updatememberEnum, member: membersType }) => {
        console.log("ana hanananananan")
        if (!data) return;
        if (data.updateType === "PLAYGAME") {
            setStep(USERSETTINGSTEPS.PLAYGAME)
            setPlayGameWith(data.member)
            return;
        }
        if (data.updateType === updatememberEnum.ADDMEMBER) {
            return
        }
        // handlOnclick(data)
        const __message = data.updateType ? getmessage(data.updateType) : ''
        console.log("const __message = getmessage(data.updateType) :", __message)
        console.log("const __message = getmessage(data.updateType) :", data.updateType)
        __message && channeLConfirmActionHook.onOpen(
            <button
                onClick={() => {
                    socket?.emit(`${process.env.NEXT_PUBLIC_SOCKET_EVENT_CHAT_MEMBER_UPDATE}`, data)
                }}
                className="text-balck hover:text-danger  border border-secondary bg-secondary text-sm font-bold lowercase  px-7 py-3 rounded-[12px]  w-full">
                {data.updateType && getLable(data.updateType, data.member)}
            </button>
            , __message
        )


    }




    if (!IsMounted)
        return <div className="Members flex p-4">
            <div className="flex flex-row items-center p-1 gap-1">
                <h3 className="text-base font-light text-[#FFFFFF]">Loading...</h3>
            </div>
        </div>

    let bodyContent = (
        <>
            {LogedMember?.type !== UserTypeEnum.USER && <div className="flex flex-row justify-start items-center gap-2">
                <Button
                    icon={TbUserPlus}
                    label={"Add member"}
                    outline
                    size={21}
                    labelsize={8}
                    onClick={() => {
                        setStep(USERSETTINGSTEPS.MEMBERJOIN)
                    }}
                />
            </div>}




            <div className="overflow-y-scroll max-h-[34rem] flex flex-col w-full gap-4">
                {members && members.map((member: membersType, index) => (
                    <ChannelSettingsUserMemberItem
                        key={index}
                        member={member}
                        socket={socket}
                        UserJoin={false}
                        UserOwne={false}
                        OnClick={handlOnclick} />

                ))
                }
            </div>

        </>
    )
    if (step === USERSETTINGSTEPS.PLAYGAME) {
        bodyContent = <ChanneLsettingsPlayGame Onback={() => { setStep(USERSETTINGSTEPS.INDEX) }}
            onClick={function (mode: any): void {

                // send initaion to player 02
                socket?.emit('sendNotification', {
                    userId: PlayGameWith?.userId,
                    senderId: LogedMember?.userId,
                    mode: mode
                })

            }} player1Id={PlayGameWith?.userId} player2Id={LogedMember?.userId} />
    }
    if (step === USERSETTINGSTEPS.MEMBERJOIN) {
        bodyContent = <ChanneLSettingsMemberJoinModaL OnClick={() => { setStep(USERSETTINGSTEPS.INDEX) }} socket={socket} OnBack={() => {
            setStep(USERSETTINGSTEPS.INDEX)
        }} />
    }

    return <ChanneLSettingsEditModaL >
        {bodyContent}
    </ChanneLSettingsEditModaL>
}