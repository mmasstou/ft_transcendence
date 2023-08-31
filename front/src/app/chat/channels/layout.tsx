'use client';
import Dashboard from '@/app/Dashboard';
import '@/app/globals.css';
import Cookies from 'js-cookie';
import { Changa } from 'next/font/google';
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation';
import React from 'react';
import { AiOutlineUsergroupAdd } from 'react-icons/ai';
import { BsLayoutSidebarInset, BsReverseLayoutSidebarInsetReverse } from 'react-icons/bs';
import { FaUsers } from 'react-icons/fa';
import { FiUsers } from 'react-icons/fi';
import { HiChatBubbleLeftRight } from 'react-icons/hi2';
import { RiSearchLine } from 'react-icons/ri';
import 'react-tooltip/dist/react-tooltip.css';
import { Socket, io } from 'socket.io-client';
import Button from '../components/Button';
import ChatNavbarLink from '../components/chat.navbar.link';
import Loading from './components/loading';
import LeftSidebarHook from './hooks/LeftSidebarHook';
import RightsidebarHook from './hooks/RightSidebarHook';
import ChanneLcreatemodaLHook from './hooks/channel.create.hook';
import ChanneLFindRoommodaLHook from './hooks/channel.find.room.hook';
import { ChanneLProvider } from './providers/channel.provider';
const changa = Changa({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-changa',
});

const UserId: any = Cookies.get('_id');
const token = Cookies.get('token');
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [IsMounted, setIsMounted] = React.useState(false)
  const [createRoomSocket, setcreateRoomSocket] = React.useState<Socket | null>(null)
  const params = useSearchParams()
  const pathname = usePathname()
  const [isLoading, setIsLoading] = React.useState(true);


  const leftSidebarHook = LeftSidebarHook();
  const channeLcreatemodaLHook = ChanneLcreatemodaLHook()
  const rightsidebarHook = RightsidebarHook()
  const channeLFindRoommodaLHook = ChanneLFindRoommodaLHook()
  const query = useParams();
  const slug: string | undefined = typeof query.slug === 'string' ? query.slug : undefined
  const router = useRouter();


  React.useEffect(() => {
    if (!token || !UserId) return router.push('/');
    if (!pathname.includes('chat')) setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    const Clientsocket = io(`${process.env.NEXT_PUBLIC_SOCKET_URL}/chat`, {
      auth: {
        token, // Pass the token as an authentication parameter
      },
    });
    setcreateRoomSocket(Clientsocket)
    setIsMounted(true)
    return () => { Clientsocket.disconnect() }
  }, [])

  if (!IsMounted) return

  return (
    <html lang="en">
      <body className={`${changa.className}`} suppressHydrationWarning={true}>
        {isLoading
          ? < Loading background message="Channels router loading ..." />
          : <Dashboard>
            <div className="--channeL relative h-full flex flex-col border-4 border-[#24323044] ">
              {/* nav bar */}

              <div className="channeLnavbar grid grid-flow-row-dense grid-cols-4 justify-between items-center text-white px-2 py-1">
                <div>
                  {leftSidebarHook.IsOpen
                    ? <Button
                      icon={BsReverseLayoutSidebarInsetReverse}
                      small
                      outline
                      onClick={() => { leftSidebarHook.onClose() }}
                    />
                    : <Button
                      icon={BsLayoutSidebarInset}
                      small
                      outline
                      onClick={() => {
                        leftSidebarHook.onOpen([])
                      }}
                    />
                  }
                </div>
                <div className="channeLnavbarmenu col-span-2 flex justify-center  sm:justify-around gap-4 w-full ">
                  <ChatNavbarLink
                    to="/chat/directmessage"
                    label="direct Message"
                    icon={HiChatBubbleLeftRight}
                    active={pathname.includes('directmessage')}
                  />
                  <ChatNavbarLink
                    to="/chat/channels"
                    label="channeL"
                    icon={FaUsers}
                    active={pathname.includes('channels')}
                  />
                </div>
                <div className="flex justify-end items-center gap-2">
                  <Button
                    icon={RiSearchLine}
                    small
                    outline
                    onClick={() => { channeLFindRoommodaLHook.onOpen(createRoomSocket) }}
                  />
                  <Button
                    icon={AiOutlineUsergroupAdd}
                    small
                    outline
                    onClick={() => { channeLcreatemodaLHook.onOpen([], createRoomSocket) }}
                  />
                </div>
              </div>
              <div className="channeLbody relative h-full flex ">
                <ChanneLProvider>
                  {children}
                </ChanneLProvider>
              </div>

            </div>
          </Dashboard>}
      </body>
    </html>
  );
}
