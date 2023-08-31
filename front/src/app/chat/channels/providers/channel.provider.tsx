'use client';
import { RoomsType, membersType, userType } from '@/types/types';
import Cookies from 'js-cookie';
import { useParams, useRouter } from 'next/navigation';
import React, { createContext, useContext, useState } from 'react';
import { toast } from 'react-hot-toast';
import { Socket, io } from 'socket.io-client';
import FindOneBySLug from '../actions/Channel/findOneBySlug';
import getMemberWithId from '../actions/getMemberWithId';
import getUserWithId from '../actions/getUserWithId';
import { sl } from 'date-fns/locale';

export const ChanneLContext = createContext({});

// const useDashboardState = () => useContext(DashboardStateContext);

const userId = Cookies.get('_id')
const token: any = Cookies.get('token');
export const ChanneLProvider = ({ children }: { children: React.ReactNode }) => {
    const [UserSocket, setUserSocket] = useState<Socket | null>(null);
    const [ChanneLdata, setChanneLdata] = useState<{ channeLInfo: RoomsType | null, member: membersType | null }>({ channeLInfo: null, member: null })
    const [ChatSocket, setChatSocket] = useState<Socket | null>(null);
    const [User, setUser] = useState<userType | null>(null);
    const query = useParams();
    const slug: string | undefined = typeof query.slug === 'string' ? query.slug : undefined;
    const router = useRouter();


    const UpdateData = async () => {
        if (!slug) return null;
        const channeL: RoomsType = await FindOneBySLug(slug, token);
        const member: membersType | null = channeL && userId && await getMemberWithId(userId, channeL.id, token)

        if (!channeL || !member) return null;
        setChanneLdata({ channeLInfo: channeL, member: member })
        return channeL;
    }
    React.useEffect(() => {
        if (!token || !userId || userId === undefined) {
            toast.error('Please login first > channeL provider');
            router.push('/');
        }
        const Clientsocket = io(`${process.env.NEXT_PUBLIC_SOCKET_URL}/chat`, {
            auth: {
                token, // Pass the token as an authentication parameter
            },
        });
        (async () => {
            // get User data using userId :
            const User: userType | null = userId ? await getUserWithId(userId, token) : null;
            if (!User) {
                if (!token || !userId) {
                    toast.error('you are not logged in Or your session has expired');
                    router.push('/');
                }
            }
            setUser(User);
            toast(slug === undefined ? 'undefined' : slug)
            const channeL = await UpdateData();
            channeL && ChatSocket?.emit('accessToroom', channeL);
        })();
        setChatSocket(Clientsocket);
        return () => { Clientsocket.disconnect() }
    }, [])

    React.useEffect(() => {
        ChatSocket?.on(`ref`, (data) => {
            if (!token || !userId) {
                toast.error('Please login first > channeL provider');
                router.push('/');
            }

            // if (!data) return
            // window.location.reload()
            // toast.success("connected to channel ChanneLProvider");
        });

    }, [])

    React.useEffect(() => {
        ChatSocket?.on(
            `${process.env.NEXT_PUBLIC_SOCKET_EVENT_RESPONSE_CHAT_MEMBER_UPDATE}`,
            (data: { OK: true, message?: string }) => {
                if (!data.OK) return
                toast.success('member updated');
                UpdateData();
            });
        ChatSocket?.on(
            `${process.env.NEXT_PUBLIC_SOCKET_EVENT_RESPONSE_CHAT_UPDATE}`,
            (data: { OK: true, message?: string }) => {
                if (!data.OK) return
                toast.success('member updated');
                UpdateData();
            });
    }, [ChatSocket])

    if (!ChatSocket) return null

    return (
        <ChanneLContext.Provider
            value={{ User: User, UserSocket: UserSocket, socket: ChatSocket, ChanneLdata: ChanneLdata, setChanneLdata: setChanneLdata }}>
            {children}
        </ChanneLContext.Provider>
    );
};