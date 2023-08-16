"use client"

import React from 'react'
import Dashboard from '@/app/Dashboard';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Cookies from 'js-cookie';
import { Socket } from 'socket.io-client';
import { toast } from 'react-hot-toast';
import MemberHasPermissionToAccess from '../actions/MemberHasPermissionToAccess';
import { RoomsType } from '@/types/types';
import ChanneLIndex from '../components/channel.index';
import FindOneBySLug from '../actions/Channel/findOneBySlug';
import InitSocket from '../actions/InitSocket';
import Loading from '../components/loading';
import Conversations from '../components/channel.conversations';
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
    const [socket, setSocket] = React.useState<Socket | null>(null);
    const [IsMounted, setIsMounted] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(true);
    const token = Cookies.get('token');
    const userId = Cookies.get('_id');
    if (!token || !userId) return


    React.useEffect(() => {
        setIsMounted(true);
        setSocket(InitSocket(token))
        // set a title for this page using next head 
        setTimeout(() => {
            setIsLoading(false);
        }, 2000); // Replace with actual data fetching logic

    }, [])


    React.useEffect(() => {
        // if (!IsMounted) return
        // check if user has permission to access this channel
        (async () => {
            // setIsLoading(true);
            console.log('channelId', slug);
            // get channels info :
            const channeL: RoomsType = await FindOneBySLug(slug, token);
            if (!channeL) {
                router.push('/chat/channels/');
                toast.error('channel not found');
                return;
            }
            setChanneLInfo(channeL);
            // check if user has permission to access this channel
            await MemberHasPermissionToAccess(token, channeL.id, userId).then((res) => {
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
    return <Conversations socket={socket} />
}
