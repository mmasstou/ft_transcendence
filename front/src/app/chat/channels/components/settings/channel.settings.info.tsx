import { RiRadioButtonLine } from "react-icons/ri";
import ChanneLSidebarItem from "../channel.sidebar.item";
import { PiGameControllerFill } from "react-icons/pi";
import { IoLogOut } from "react-icons/io5";
import { AiFillDelete, AiOutlineUsergroupAdd } from "react-icons/ai";
import { MdNotificationsActive } from "react-icons/md";
import Button from "../../../components/Button";
import { MouseEvent, use } from "react";
import { ImUserCheck } from "react-icons/im";
import { CgClose } from "react-icons/cg";
import { Avatar } from "@radix-ui/react-avatar";
import { UserAvatar } from "../channel.userAvater";
import { FaChessQueen } from "react-icons/fa";
import React from "react";
import { RoomsType, UserTypeEnum, membersType, userType } from "@/types/types";
import { Socket } from "socket.io-client";
import Cookies from "js-cookie";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import getChanneLOwners from "../../actions/getChannelOwner";
import getUserWithId from "../../actions/getUserWithId";
import { space } from "postcss/lib/list";
import getChannelMembersWithId from "../../actions/getChannelmembers";
import getChanneLNotifications from "../../actions/getChanneLNotifications";
import ChanneLSettingsInfonotifications from "../channel.settings.info.notifications";
import ChanneLConfirmActionHook from "../../hooks/channel.confirm.action";
import ChanneLConfirmActionBtn from "../channel.confirm.action.Btn";
import { toast } from "react-hot-toast";
import ChanneLsettingsHook from "../../hooks/channel.settings";
import ChanneLSettingsBody from "../channel.settings.body";
import PermissionDenied from "../channel.settings.permissiondenied";
import getMemberWithId from "../../actions/getMemberWithId";
import FindOneBySLug from "../../actions/Channel/findOneBySlug";

interface Props {
    room: RoomsType;
    member: membersType | null
    User: userType | null
    socket: Socket | null
}
export default function ChanneLSettingsInfo(
    { room, socket, User, member }: Props
) {

    const query = useParams();
    const slug: string = typeof query.slug === 'string' ? query.slug : query.slug[0];
    const [Isloading, setLoading] = React.useState<boolean>(true)
    const [ownersList, setownersList] = React.useState<userType[] | null>(null)
    const [aLLMembersList, setaLLMembersList] = React.useState<membersType[] | null>(null)
    const [LogedMember, setLogedMember] = React.useState<membersType | null>(null)
    const [ownerUserList, setownerUserList] = React.useState<userType[]>([])
    const [ChanneLNotifications, setChanneLNotifications] = React.useState<any>(null)
    const [updaterequestNotification, setupdaterequestNotification] = React.useState<boolean>(false)
    const [onLineMembers, setonLineMembers] = React.useState<number>(0)
    const [onGameMembers, setonGameMembers] = React.useState<number>(0)
    const channeLConfirmActionHook = ChanneLConfirmActionHook()
    const channeLsettingsHook = ChanneLsettingsHook()
    const route = useRouter()
    const params = useSearchParams()
    const token: any = Cookies.get('token');
    const userId: any = Cookies.get('_id');
    if (!token || !userId) return

    React.useEffect(() => {

        (async () => {
            const channeLInfo = await FindOneBySLug(slug, token)
            if (!channeLInfo) return;
            // get channel owners
            const OwnersList = await getChanneLOwners(channeLInfo.id, token)
            if (!OwnersList) return
            setownersList(OwnersList)

            // get Logged Member :
            const member = await getMemberWithId(userId, channeLInfo.id, token)
            member && setLogedMember(member)


            // get channel members
            const aLLMembersList = await getChannelMembersWithId(channeLInfo.id, token)
            if (!aLLMembersList) return
            setaLLMembersList(aLLMembersList)
            const ListUser: userType[] = []
            // get User data for every member  :
            for (let index = 0; index < aLLMembersList.length; index++) {
                const member: membersType = aLLMembersList[index];
                const user = await getUserWithId(member.userId, token)
                user && ListUser.push(user)
            }

            // count OnLine members :
            let _onLineMembers = 0;
            let _onGameMembers = 0;
            for (let index = 0; index < ListUser.length; index++) {
                const _user = ListUser[index];
                // check if status is online :
                if (_user.status === 'online')
                    _onLineMembers++;
                // check if status is onGame
                if (_user.status === 'ongame')
                    _onGameMembers++;

            }
            setonGameMembers(_onGameMembers)
            setonLineMembers(_onLineMembers)


        })();
    }, [slug])

    React.useEffect(() => {
        (async () => {
            const token: any = Cookies.get('token');
            const ChanneLId: string | null = params ? params.get('r') : null
            if (!token || !ChanneLId) return
            // get channel notifications
            const channeLNotifications = await getChanneLNotifications(ChanneLId, token)

            if (!channeLNotifications) return
            console.log("channeLNotifications :", channeLNotifications)
            setChanneLNotifications(channeLNotifications)
        })();
    }, [updaterequestNotification])

    React.useEffect(() => {
        const ChanneLId: string | null = params ? params.get('r') : null
        if(!ChanneLId) return;
        socket?.on(
            `${process.env.NEXT_PUBLIC_SOCKET_EVENT_RESPONSE_CHAT_MEMBER_UPDATE}`,
            (data: {
                message: string,
                status: any,
                data: RoomsType,
            }) => {
                (async () => {
                    // get channel owners
                    const OwnersList = await getChanneLOwners(ChanneLId, token)
                    if (!OwnersList) return
                    setownersList(OwnersList)

                    // get Logged Member :
                    const member = await getMemberWithId(userId, ChanneLId, token)
                    member && setLogedMember(member)


                    // get channel members
                    const aLLMembersList = await getChannelMembersWithId(ChanneLId, token)
                    if (!aLLMembersList) return
                    setaLLMembersList(aLLMembersList)
                    const ListUser: userType[] = []
                    // get User data for every member  :
                    for (let index = 0; index < aLLMembersList.length; index++) {
                        const member: membersType = aLLMembersList[index];
                        const user = await getUserWithId(member.userId, token)
                        user && ListUser.push(user)
                    }

                    // count OnLine members :
                    let _onLineMembers = 0;
                    let _onGameMembers = 0;
                    for (let index = 0; index < ListUser.length; index++) {
                        const _user = ListUser[index];
                        // check if status is online :
                        _onLineMembers++;
                        // check if status is onGame
                        _onGameMembers++;

                    }
                    setonGameMembers(_onGameMembers)
                    setonLineMembers(_onLineMembers)


                })();
            })
        socket?.on(
            `${process.env.NEXT_PUBLIC_SOCKET_EVENT_RESPONSE_CHAT_DELETE}`,
            (data: {
                message: string,
                status: any,
                data: RoomsType,
            }) => {
                if (data.data) {

                    // toast.success(data.message)
                    channeLConfirmActionHook.onClose()
                    channeLsettingsHook.onClose()
                    route.push(`/chat/channels`)
                    route.refresh();

                    return
                }
                // console.log("+++++++++++++++++++++++++++++++++data :", data)
                // toast.error("can't delete this channel")
                channeLConfirmActionHook.onClose()
            }
        );
        socket?.on(
            `${process.env.NEXT_PUBLIC_SOCKET_EVENT_RESPONSE_CHAT_MEMBER_LEAVE}`,
            (data: {
                message: string,
                status: any,
                data: RoomsType,
            }) => {
                if (data.data) {

                    // toast.success(data.message)
                    channeLConfirmActionHook.onClose()
                    channeLsettingsHook.onClose()
                    route.push(`/chat/channels`)
                    route.refresh();
                    return
                }
                channeLConfirmActionHook.onClose()
            }
        );
        route.refresh();
    }, [socket])

    React.useEffect(() => setLoading(false))


    if (Isloading) return
    console.log("ownerUserList :", ownerUserList)
    console.log("ownersList :", ownersList)


    return <div className="flex flex-col justify-between min-h-[39rem]">
        {!LogedMember?.isban ?
            <>
                <div className="ChanneL flex flex-col gap-9">
                    <div className="ChanneLInfo flex flex-col gap-4 p-4">
                        <div className="flex flex-row justify-start gap-3 items-center text-white">
                            <span className={` text-3xl `}>#</span>
                            <div className="flex flex-row items-center justify-between w-full">
                                <div className=" flex items-center gap-2">
                                    <h2 className="text-xl">{room.name}</h2>
                                    <span className=" text-secondary text-sm font-medium">{room.type}</span>
                                </div>
                                <div className=" text-base flex flex-row gap-2 justify-center items-center">
                                    <FaChessQueen size={14} fill="#FFBF00" />
                                    <h4 className="flex flex-row gap-1 items-center justify-center">
                                        {ownersList && ownersList.map((item: userType, index: number) => (
                                            <span key={index}>{item.login}</span>
                                        ))}</h4>
                                </div>
                            </div>
                        </div>
                        <div className="MembersInfo flex flex-row gap-6">
                            <span className=" text-white">{aLLMembersList?.length} Members</span>
                            <div className="flex flex-row items-center gap-2 fill-secondary text-secondary"><RiRadioButtonLine size={12} /> <span className=" text-white">{onLineMembers} Online</span></div>
                            <div className="flex flex-row items-center gap-2 fill-danger text-danger"><PiGameControllerFill /> <span className=" text-white">{onGameMembers} on game</span></div>
                        </div>

                    </div>
                    {member?.type === UserTypeEnum.OWNER && ChanneLNotifications && <div className="ChanneLInvitaionsBox flex flex-col gap-2">
                        <h2 className="flex flex-row items-center text-white gap-2 text-xl font-semibold lowercase"><MdNotificationsActive size={21} />Notifications</h2>
                        <div className="ChanneLInvitaions flex flex-col gap-2 max-h-[44vh] overflow-y-scroll py-2 px-1">
                            {
                                ChanneLNotifications.map((item: any, index: number) => (
                                    <ChanneLSettingsInfonotifications key={index} notification={item} socket={socket} />
                                ))
                            }
                        </div>
                    </div>}
                </div>
                <div className="channeLActions flex flex-row items-center gap-6 justify-start w-full">
                    {User && <ChanneLConfirmActionBtn
                        socket={socket}
                        message={`Are you sure you want to permanently leave '${room.name}' ?`}
                        event={`${process.env.NEXT_PUBLIC_SOCKET_EVENT_CHAT_MEMBER_LEAVE}`}
                        label={"Leave"}
                        data={{
                            roomId: room.id
                        }} />}
                    {User && <ChanneLConfirmActionBtn
                        socket={socket}
                        message={`Are you sure you want to permanently delete ${room.name} ?`}
                        event={`${process.env.NEXT_PUBLIC_SOCKET_EVENT_DELETE_CHAT}`}
                        label={"Delete"}
                        data={{
                            userId: User?.id,
                            roomId: room.id
                        }} />}
                </div>
            </>
            : <PermissionDenied />
        }
    </div>
}