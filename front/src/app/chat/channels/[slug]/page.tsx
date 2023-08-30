"use client"

import React from 'react'
import Dashboard from '@/app/Dashboard';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Cookies from 'js-cookie';
import { Socket, io } from 'socket.io-client';
import { toast } from 'react-hot-toast';
import MemberHasPermissionToAccess from '../actions/MemberHasPermissionToAccess';
import { RoomsType, membersType, userType } from '@/types/types';
import ChanneLIndex from '../components/channel.index';
import FindOneBySLug from '../actions/Channel/findOneBySlug';
import Loading from '../components/loading';
import Conversations from '../components/channel.conversations';
import RightsideModaL from '../modaLs/RightsideModal';
import ChanneLsmembersItem from '../components/channel.membersItem';
import getChannelMembersWithId from '../actions/getChannelmembers';
import getUserWithId from '../actions/getUserWithId';
import LefttsideModaL from '../modaLs/LeftsideModal';
import getChannels from '../actions/getChanneLs';
import ChanneLSidebarItem from '../components/channel.sidebar.item';
import ChanneLConfirmActionHook from '../hooks/channel.confirm.action';
import ChanneLsettingsHook from '../hooks/channel.settings';
import { ChanneLContext, ChanneLProvider } from '../providers/channel.provider';
import { set } from 'date-fns';
import getMemberWithId from '../actions/getMemberWithId';
const metadata = {
    title: 'Transcendence',
    description: 'ft_transcendence',
};

export default function page() {
    const router = useRouter();
    // get query params
    const query = useParams();
    const slug: string = typeof query.slug === 'string' ? query.slug : query.slug[0];
    const [ChanneLInfo, setChanneLInfo] = React.useState<RoomsType | null>(null);
    const [ChanneLs, setChannel] = React.useState<RoomsType[] | null>(null)
    const [LoggedUser, setLoggedUser] = React.useState<userType | null>(null);
    const [ChanneLsmembers, setChanneLsmembers] = React.useState<membersType[] | null>(null);
    const [socket, setSocket] = React.useState<Socket | null>(null);
    const [IsMounted, setIsMounted] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(true);

    // create context :
    /*
    
    {
        User: userType | null,
        UserSocket: Socket | null,
        socket: Socket | null,
        ChanneLdata: {
            channeLInfo: RoomsType | null,
            member: membersType | null
        }
    } | {}
    
    
    **/
    const ChanneLContextee: any = React.useContext(ChanneLContext)
    console.log('+++>>ChanneLContext', ChanneLContextee)

    // hooks :
    const confirmAction = ChanneLConfirmActionHook()
    const settings = ChanneLsettingsHook()
    const token = Cookies.get('token');
    const userId = Cookies.get('_id');
    if (!token || !userId) return




    React.useEffect(() => {
        // if (!IsMounted) return

        setSocket(ChanneLContextee.socket);
        
        (async () => {
            const channeL: RoomsType = await FindOneBySLug(slug, token);
            if (!channeL) {
                router.push('/chat/channels/');
                toast.error('channel not found');
                return;
            }
            const channels = await getChannels(token)
            if (!channels) return
            setChannel(channels)
            // ChanneLContextee.setChanneLdata(channels)

            const User: userType | null = await getUserWithId(userId, token);
            if (!User) return
            const member: membersType | null = channeL && userId && await getMemberWithId(User.id, channeL.id, token)
            if (!member) return
            ChanneLContextee.setChanneLdata({ channeLInfo: channeL, member: member })
            setLoggedUser(User)
            setChanneLInfo(channeL);
            // get all members for this channel :
            const members = await getChannelMembersWithId(channeL.id, token)
            if (!members) return
            setChanneLsmembers(members)
            toast.success('channel found');
            setIsLoading(false);
        })();
        // ChanneLContextee.socket?.on('accessToroomResponse', (resp: { channeL: RoomsType, LogedUser: userType }) => {
        //     if (resp === null) {
        //         toast.error(`dont have permission to access this channel`);
        //         router.push('/chat/channels/');
        //         return;
        //     }

        // });

        // check for channels :
        // leave the channeLs :
        ChanneLContextee.socket?.on(
            `${process.env.NEXT_PUBLIC_SOCKET_EVENT_RESPONSE_CHAT_UPDATE}`,
            (data: any) => {
                (async () => {
                    if (!slug) return;
                    const channeL: RoomsType = await FindOneBySLug(slug, token);
                    if (!channeL) return;
                    // check if the channel is deleted :
                    await MemberHasPermissionToAccess(token, channeL.id, userId).then((res) => {
                        if (!res) {
                            router.push('/chat/channels/');
                            confirmAction.onClose()
                            settings.onClose()
                            return;
                        }
                        ChanneLContextee.socket?.emit('accessToroom', ChanneLInfo);
                    })
                    // update channels :
                    const ChanneLs = await getChannels(token)
                    if (!ChanneLs) return
                    setChannel(ChanneLs)
                })();
            })
        setIsMounted(true);
    }, [])


    React.useEffect(() => {
        // if (!IsMounted) return
        // check if user has permission to access this channel
        if (!ChanneLInfo) return;
        socket?.emit('accessToroom', ChanneLInfo);
        (async () => {
            // setIsLoading(true);
            console.log('channelId', slug);
            // get channels info :

            // check if user has permission to access this channel
            await MemberHasPermissionToAccess(token, ChanneLInfo.id, userId).then((res) => {
                if (!res) {
                    router.push('/chat/channels/');
                    toast.error('You dont have permission to access this channel');
                    return;
                }
            })
            // setIsLoading(false);
        })();

    }, [slug])

    if (!IsMounted) return
    document.title = `chat : ${ChanneLInfo?.name}` || metadata.title;
    return <>
        <LefttsideModaL>
            {
                ChanneLs && ChanneLs.map((room: RoomsType) => (
                    <ChanneLSidebarItem key={room.id} room={room} viewd={8} active={room.slug === slug} />
                ))
            }
        </LefttsideModaL>
        <Conversations socket={socket} />
    </>

}
