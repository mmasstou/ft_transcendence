'use client';
import { membersType, userType } from '@/types/types';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import React, { createContext, useContext, useState } from 'react';
import { toast } from 'react-hot-toast';
import { Socket, io } from 'socket.io-client';

export const ChanneLContext = createContext({});

// const useDashboardState = () => useContext(DashboardStateContext);

const userId = Cookies.get('_id')
const token: any = Cookies.get('token');
export const ChanneLSettingsUserProvider = ({ children }: { children: React.ReactNode }) => {
    const [UserSocket, setUserSocket] = useState<Socket | null>(null);
    const router = useRouter();

    if (!token) {
        toast.error('Please login first > channeL provider');
        router.push('/');
    }


    return (
        <ChanneLContext.Provider
            value={{ UserSocket }}>
            {children}
        </ChanneLContext.Provider>
    );
};