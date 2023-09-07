import { RoomsType, USERSETTINGSTEPS, UserTypeEnum, membersType, updatememberEnum, userType } from "@/types/types";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import React from "react";
import { TbUserPlus } from "react-icons/tb";
import { Socket } from "socket.io-client";
import Button from "../../../../components/Button";
import FilterMembers_IsBan_NotLoggedUser from "../../../actions/filterMembers_IsBan_NotLoggedUser";
import getLable from "../../../actions/getLable";
import getMemberWithId from "../../../actions/getMemberWithId";
import getmessage from "../../../actions/member.action.message";
import StartGame from "../../../actions/startgame";
import ChanneLConfirmActionHook from "../../../hooks/channel.confirm.action";
import SettingsProvider from "../../../providers/channel.settings.provider";
import ChanneLsettingsPlayGame from "./channel.settings.playgame";
import ChanneLSettingsMemberJoinModaL from "./channel.settings.user.addmember";
import ChannelSettingsUserMemberItem from "./channel.settings.user.memberItem";

interface ChanneLUserSettingsProps {
    room: RoomsType | null;
    member: membersType | null
    User: userType | null
    socket: Socket | null
}



export default function ChanneLUserSettings({ socket, member, User, room }: ChanneLUserSettingsProps) {
    const [IsMounted, setIsMounted] = React.useState(false)
    const [members, setMembers] = React.useState<membersType[]>([])
    const [LogedMember, setLogedMember] = React.useState<membersType | null>(null)
    const [step, setStep] = React.useState<USERSETTINGSTEPS>(USERSETTINGSTEPS.INDEX)
    const [PlayGameWith, setPlayGameWith] = React.useState<membersType | null>(null)
    const channeLConfirmActionHook = ChanneLConfirmActionHook()
    const UserId = Cookies.get('_id')
    const router = useRouter()
    const token: any = Cookies.get('token');
    if (!token || !UserId || !room) return;



    const UpdateData = async () => {
        const channeLLMembers = await FilterMembers_IsBan_NotLoggedUser(room.id, token, UserId)
        if (channeLLMembers) setMembers(channeLLMembers)
        const channeLLMember = await getMemberWithId(UserId, room.id, token)
        if (!channeLLMember) return;
        setLogedMember(channeLLMember)
    }
    React.useEffect(() => {
        setIsMounted(true);
        (async () => {
            const channeLLMembers = await FilterMembers_IsBan_NotLoggedUser(room.id, token, UserId)
            if (channeLLMembers) setMembers(channeLLMembers)
        })();
        member && setLogedMember(member)
    }, [])

    // check for rooms socket events :
    React.useEffect(() => {
        socket?.on(
            `SOCKET_EVENT_RESPONSE_CHAT_ADD_MEMBER`,
            (data: any) => {
                UpdateData()
            });
        socket?.on(`SOCKET_EVENT_RESPONSE_CHAT_MEMBER_UPDATE`,
            (response: { OK: boolean }) => {
                channeLConfirmActionHook.onClose()
                if (response.OK) {
                    UpdateData()
                }
                if (!response.OK) { }


            })

        socket?.on(`SOCKET_EVENT_RESPONSE_CHAT_UPDATE`, (data) => {
            (async () => {
                const channeLLMembers = await getMemberWithId(UserId, room.id, token)
                if (!channeLLMembers) return;
                setLogedMember(channeLLMembers)
            })();
        })

        socket?.on('GameNotificationResponse', (data) => {
            (async () => {
                const body = {       ///////////////////////////////////////////////////////// body
                    player1Id: PlayGameWith?.userId,
                    player2Id: LogedMember?.userId,
                    mode: "time"
                }
                const token: any = Cookies.get('token');
                if (!token) return;
                const g = await StartGame(body, token);
                if (!g) return;
                router.push('/game/time/friend')
            })();
        })

        return () => {
            socket?.off(`SOCKET_EVENT_RESPONSE_CHAT_ADD_MEMBER`)
            socket?.off(`SOCKET_EVENT_RESPONSE_CHAT_MEMBER_UPDATE`)
            socket?.off(`SOCKET_EVENT_RESPONSE_CHAT_UPDATE`)
            socket?.off('GameNotificationResponse')
        }

    }, [])


    const handlOnclick = (data: { updateType?: updatememberEnum, member: membersType }) => {
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
        __message && channeLConfirmActionHook.onOpen(
            <button
                onClick={() => {
                    socket?.emit(`SOCKET_EVENT_CHAT_MEMBER_UPDATE`, data)
                }}
                className="text-balck hover:text-danger  border border-secondary bg-secondary text-sm font-bold lowercase  px-7 py-3 rounded-[12px]  w-full">
                {data.updateType && getLable(data.updateType, data.member)}
            </button>
            , __message
        )
    }

    if (!IsMounted) return null;

    let bodyContent = (
        <>
            <div className="flex flex-row justify-end items-center gap-2">
                {LogedMember?.type !== UserTypeEnum.USER &&
                    <Button
                        icon={TbUserPlus}
                        label={"Add member"}
                        outline
                        responsive
                        size={24}
                        labelsize={8}
                        onClick={() => {
                            setStep(USERSETTINGSTEPS.MEMBERJOIN)
                        }}
                    />
                }
            </div>
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
        bodyContent = <ChanneLsettingsPlayGame
            socket={socket}
            Onback={() => { setStep(USERSETTINGSTEPS.INDEX) }}
            onClick={function (mode: any): void {
                // send initaion to player 02
                socket?.emit('sendGameNotification', {
                    userId: PlayGameWith?.userId,
                    senderId: LogedMember?.userId,
                    mode: mode
                })

            }}
            player1Id={PlayGameWith?.userId}
            player2Id={LogedMember?.userId} />
    }
    if (step === USERSETTINGSTEPS.MEMBERJOIN) {
        bodyContent = <ChanneLSettingsMemberJoinModaL OnClick={() => { setStep(USERSETTINGSTEPS.INDEX) }} socket={socket} OnBack={() => {
            setStep(USERSETTINGSTEPS.INDEX)
        }} />
    }

    return <SettingsProvider  >
        {bodyContent}
    </SettingsProvider>
}