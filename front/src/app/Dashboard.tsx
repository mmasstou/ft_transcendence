'use client';
import Header from '@/components/Dashboard/Header/Header';
import Sidebar from '@/components/Dashboard/sidebar/Sidebar';
import Login from '@/components/auth/modaLs/Login';
import MyToast from '@/components/ui/Toast/MyToast';
import { userType } from '@/types/types';
import Cookies from 'js-cookie';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { createContext, useEffect, ReactNode } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { Socket, io } from 'socket.io-client';
import StartGame from './chat/channels/actions/startgame';
import ChanneLsettingsHook from './chat/channels/hooks/channel.settings';
import ChanneLaccessDeniedModaL from './chat/channels/modaLs/channel.access.denied.modaL';
import ChanneLPasswordAccessModaL from './chat/channels/modaLs/channel.access.password.modaL';
import ChanneLConfirmActionModaL from './chat/channels/modaLs/channel.confirm.action';
import ChanneLCreateModaL from './chat/channels/modaLs/channel.create.modaL';
import ChanneLFindRoommodaL from './chat/channels/modaLs/channel.find.room.modaL';
import ChanneLSettingsModaL from './chat/channels/modaLs/channel.settings.modaL';
import './dashboard.css';
import Lottie from 'react-lottie-player';
import data from '@/../public/lotties/pong.json';

interface Props {
  children: React.ReactNode;
}

interface SocketContextType {
  message: string;
  children: ReactNode;
}

export const socketContext = createContext<SocketContextType | undefined>(
  undefined
);

const jwtSecret = process.env.NEXT_PUBLIC_JWT_SECRET;

const SocketProvider: React.FC<SocketContextType> = ({ message, children }) => {
  return (
    <socketContext.Provider value={{ message, children }}>
      {children}
    </socketContext.Provider>
  );
};

const Dashboard = ({ children }: Props) => {
  const router = useRouter();
  const [authenticated, setAuthenticated] = React.useState<boolean>();
  const [socket, setSocket] = React.useState<Socket | null>(null);
  const [chatSocket, setchatSocket] = React.useState<Socket | null>(null);
  const params = useSearchParams();
  const [Notifications, setNotifications] = React.useState<any>(null);
  const channeLsettingsHook = ChanneLsettingsHook();
  const userId = Cookies.get('_id');
  const token: any = Cookies.get('token');
  const [notifUpdate, setnotifUpdate] = React.useState<boolean>(false);

  const [pendingRequests, setPendingRequests] = React.useState<any>([]);
  const [requestBackUp, setRequestBackUp] = React.useState<any>([]);
  const [message, setMessage] = React.useState<string>('');

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/verifyUser`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
        if (res.status === 200) {
          setAuthenticated(true);
        }
        if (res.status === 401) {
          setAuthenticated(false);
          console.clear();
        }
      } catch (error) {
        setAuthenticated(false);
        console.clear();
      }
    })();
  }, [token, userId]);

  React.useEffect(() => {
    socket?.on(
      'GameNotificationResponse',
      (data: {
        message: string;
        sender: userType;
        senderSocketId: string;
        mode: string;
      }) => {
        setNotifications(data);

        return () => {
          setNotifications(null);
        };
      }
    );
  }, [socket]);

  useEffect(() => {
    const socket: Socket = io(`${process.env.NEXT_PUBLIC_SOCKET_URL}/User`, {
      auth: {
        token: `${token}`,
        id: `${Cookies.get('_id')}`,
      },
    });

    const chatSocket = io(`${process.env.NEXT_PUBLIC_SOCKET_URL}/chat`, {
      transports: ['websocket'],
      auth: {
        token: token,
      },
    });
    setSocket(socket);
    setchatSocket(chatSocket);
    socket && socket.on('connected', (data) => {});
    return () => {
      socket && socket.disconnect();
      chatSocket && chatSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (notifUpdate === false) return;
    setPendingRequests(requestBackUp[requestBackUp.length - 1]);
    setnotifUpdate(false);
  }, [notifUpdate]);

  useEffect(() => {
    socket?.on('notification', (request: any) => {
      setPendingRequests((prevRequests: any) => [...prevRequests, request]);
      setRequestBackUp((prevRequests: any) => [...prevRequests, request]);
      setnotifUpdate(true);
      setMessage(request);
      toast(request, { icon: '🤗' });
    });

    socket?.on('GameResponse', (data: any) => {
      if (data.response === 'Accept') {
        if (data.sender.id === userId) {
          (async () => {
            if (!token) return;
            const body = {
              player2Id: data.sender.id,
              player1Id: data.userId,
              mode: data.mode,
            };
            const g = await StartGame(body, token);
            if (!g) return;
            channeLsettingsHook.onClose();
            router.push(`/game/${data.mode}/friend`);
          })();
        }
        if (data.userId === userId) {
          channeLsettingsHook.onClose();
          router.push(`/game/${data.mode}/friend`);
        }
      }
      if (data.response === 'Deny') {
        if (data.userId === userId) {
          toast('You denied your friend invitation', { icon: '🏓' });
        }
        if (data.sender.id === userId) {
          toast('Your friend denied your invitation', { icon: '🏓' });
        }
      }
    });
  }, [socket]);

  return (
    <>
      {authenticated ? (
        <>
          <Login />
          <ChanneLConfirmActionModaL />
          <ChanneLPasswordAccessModaL />
          <ChanneLCreateModaL />
          <ChanneLSettingsModaL />
          <ChanneLFindRoommodaL />
          <ChanneLaccessDeniedModaL />
          <ChanneLPasswordAccessModaL />
          {Notifications && (
            <MyToast
              OnAccept={() => {
                if (!params) return;
                socket?.emit('AcceptGame', {
                  userId: userId,
                  sender: Notifications.sender,
                  senderSocketId: Notifications.senderSocketId,
                  mode: Notifications.mode,
                });
                chatSocket?.emit('GameResponseToChat', {
                  response: 'Accept',
                  sendTo: Notifications.sender,
                  mode: Notifications.mode,
                });
                setNotifications(null);
              }}
              OnDeny={() => {
                socket?.emit('DenyGame', {
                  userId: userId,
                  sender: Notifications.sender,
                  mode: Notifications.mode,
                });
                chatSocket?.emit('GameResponseToChat', {
                  response: 'Deny',
                  sendTo: Notifications.sender,
                  mode: Notifications.mode,
                });
                setNotifications(null);
              }}
              isOpen
              user={Notifications.sender.login}
              message={Notifications.message}
            />
          )}
          <SocketProvider message={message}>
            <div className="dashboard bg-primary overflow-y-auto">
              <header className="bg-transparent flex items-center justify-between px-5 ">
                <Header socket={socket} pendingRequests={pendingRequests} />
              </header>

              <main className="">{children}</main>

              <div id="Sidebar" className="">
                <Sidebar />
              </div>
            </div>
          </SocketProvider>
        </>
      ) : authenticated === false ? (
        <div className="bg-primary h-screen w-full overflow-y-scrol flex justify-center items-center">
          <div
            className="bg-[#3E867C] w-4/ sm:w-1/2 min-h-[35vh] rounded-lg
            flex flex-col justify-center items-center gap-4 py-4"
          >
            <h1 className="text-[#D9D9D9] text-2xl font-bold">
              You are not authenticated
            </h1>
            <button
              onClick={() => {
                router.replace('/');
              }}
              className="bg-[#D9D9D9] text-[#3E867C] px-4 py-2 rounded-lg"
            >
              Go back
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-primary h-screen w-full overflow-y-scrol flex justify-center items-center">
          <h1 className="text-[#D9D9D9] text-2xl font-bold">
            <Lottie
              loop
              animationData={data}
              play
              style={{ height: 300, width: 300 }}
            />{' '}
          </h1>
        </div>
      )}
      <Toaster />
    </>
  );
};

export default Dashboard;
