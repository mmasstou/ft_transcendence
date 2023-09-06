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
import { de, sl } from 'date-fns/locale';

export const ChanneLContext = createContext({});

// const useDashboardState = () => useContext(DashboardStateContext);

export const ChanneLProvider = ({ children }: { children: React.ReactNode }) => {
    const [DmSocket, setDmSocket] = useState<Socket | null>(null);
    const [UserSocket, setUserSocket] = useState<Socket | null>(null);
    const [ChanneLdata, setChanneLdata] = useState<{ channeLInfo: RoomsType | null, member: membersType | null }>({ channeLInfo: null, member: null })
    const [ChatSocket, setChatSocket] = useState<Socket | null>(null);
    const [User, setUser] = useState<userType | null>(null);
    const userId = Cookies.get('_id')
    const token: any = Cookies.get('token');
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
        const socket = io(`${process.env.NEXT_PUBLIC_SOCKET_URL}/dm`, {
            auth: {
                token, // Pass the token as an authentication parameter
            },
        });
        // socket?.on('createDm', () => {
        //     console.log('--------------------- event createDm');
        //     // socket?.emit('createDm', null);
        // });
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
            const channeL = await UpdateData();
            channeL && ChatSocket?.emit('accessToroom', channeL);
        })();
        setDmSocket(socket);
        setChatSocket(Clientsocket);
        return () => {

            Clientsocket.disconnect()
            socket.disconnect()
        }
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



        return () => {
            ChatSocket?.off(`ref`);
            DmSocket?.off('createDm');
        }
    }, [])

    React.useEffect(() => {
        ChatSocket?.on(
            `SOCKET_EVENT_RESPONSE_CHAT_MEMBER_UPDATE`,
            (data: { OK: true, message?: string }) => {
                if (!data.OK) return
                UpdateData();
            });
        ChatSocket?.on(
            `SOCKET_EVENT_RESPONSE_CHAT_UPDATE`,
            (data: { OK: true, message?: string }) => {
                if (!data.OK) return
                UpdateData();
            });
        ChatSocket?.on('offline-connection', () => {
            let desiredString = window.location.href.match(/\/chat\/channels\/(.+)/);
            let channelName;
            if (desiredString)
                channelName = desiredString[1];
            if (channelName) {
                ChatSocket?.emit('offline-connection', channelName);
            }
        });


        return () => {
            ChatSocket?.off('offline-connection');
            ChatSocket?.off(`SOCKET_EVENT_RESPONSE_CHAT_MEMBER_UPDATE`);
            ChatSocket?.off(`SOCKET_EVENT_RESPONSE_CHAT_UPDATE`);
        }
    }, [ChatSocket])

    if (!ChatSocket) return null

    return (
        <ChanneLContext.Provider
            value={{ User: User, UserSocket: UserSocket, socket: ChatSocket, ChanneLdata: ChanneLdata, setChanneLdata: setChanneLdata, DmSocket: DmSocket }}>
            {children}
        </ChanneLContext.Provider>
    );
};