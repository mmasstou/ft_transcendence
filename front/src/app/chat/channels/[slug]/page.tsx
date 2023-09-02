"use client"

import { RoomsType, membersType, userType } from '@/types/types';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import React from 'react';
import { toast } from 'react-hot-toast';
import { Socket } from 'socket.io-client';
import FindOneBySLug from '../actions/Channel/findOneBySlug';
import MemberHasPermissionToAccess from '../actions/MemberHasPermissionToAccess';
import getChannels from '../actions/getChanneLs';
import getChannelMembersWithId from '../actions/getChannelmembers';
import getMemberWithId from '../actions/getMemberWithId';
import getUserWithId from '../actions/getUserWithId';
import Conversations from '../components/channel.conversations';
import ChanneLSidebarItem from '../components/channel.sidebar.item';
import ChanneLConfirmActionHook from '../hooks/channel.confirm.action';
import ChanneLsettingsHook from '../hooks/channel.settings';
import LefttsideModaL from '../modaLs/LeftsideModal';
import { ChanneLContext } from '../providers/channel.provider';
const metadata = {
    title: 'Transcendence',
    description: 'ft_transcendence',
};
const token = Cookies.get('token');
const userId = Cookies.get('_id');
export default function page({ params }: { params: { slug: string } }) {
    const router = useRouter();
    // get query params
    const [ChanneLInfo, setChanneLInfo] = React.useState<RoomsType | null>(null);
    const [ChanneLs, setChannel] = React.useState<RoomsType[] | null>(null)
    const [socket, setSocket] = React.useState<Socket | null>(null);
    const [IsMounted, setIsMounted] = React.useState(false);
    // hooks :
    const confirmAction = ChanneLConfirmActionHook()
    const settings = ChanneLsettingsHook()
    const ChanneLContextee: any = React.useContext(ChanneLContext)

    React.useEffect(() => {
        if (!token || !userId) return router.push('/');
        if (!params.slug) return;

        setSocket(ChanneLContextee.socket);

        (async () => {
            const channeL: RoomsType = await FindOneBySLug(params.slug, token);
            if (!channeL) {
                router.push('/chat/channels/');
                toast.error('channel not found');
                return;
            }
            await MemberHasPermissionToAccess(token, channeL.id, userId).then((res) => {
                if (!res) {
                    router.push('/chat/channels/');
                    return toast.error('You dont have permission to access this channel');
                }
            })
            const channels = await getChannels(token)
            if (!channels) return
            setChannel(channels)
            // ChanneLContextee.setChanneLdata(channels)

            const User: userType | null = await getUserWithId(userId, token);
            if (!User) return
            const member: membersType | null = channeL && userId && await getMemberWithId(User.id, channeL.id, token)
            if (!member) return
            ChanneLContextee.setChanneLdata({ channeLInfo: channeL, member: member })
            setChanneLInfo(channeL);
            // get all members for this channel :
            const members = await getChannelMembersWithId(channeL.id, token)
            if (!members) return toast('no channel found');
        })();

        ChanneLContextee.socket?.emit('accessToroom', ChanneLInfo);
        ChanneLContextee.socket?.on(
            `SOCKET_EVENT_RESPONSE_CHAT_UPDATE`,
            (data: any) => {
                (async () => {
                    if (!params.slug) return;
                    const channeL: RoomsType = await FindOneBySLug(params.slug, token);
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
        return () => {
            ChanneLContextee.socket?.off(`SOCKET_EVENT_RESPONSE_CHAT_UPDATE`);
        }
    }, [])

    if (!IsMounted) return
    document.title = `Transcendence/chat: ${ChanneLInfo?.name}` || metadata.title;
    return <>
        <LefttsideModaL>
            {
                ChanneLs && ChanneLs.map((room: RoomsType, key: number) => (
                    <ChanneLSidebarItem key={key} room={room} active={room.slug === params.slug} />
                ))
            }
        </LefttsideModaL>
        <Conversations socket={socket} slug={params.slug} />
    </>

}
