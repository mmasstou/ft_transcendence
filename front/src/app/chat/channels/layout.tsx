'use client';
import Dashboard from '@/app/Dashboard';
import '@/app/globals.css';
import { Changa, Lato } from 'next/font/google';
import React from 'react';
import LeftSidebarHook from './hooks/LeftSidebarHook';
import ChanneLcreatemodaLHook from './hooks/channel.create.hook';
import RightsidebarHook from './hooks/RightSidebarHook';
import ChanneLFindRoommodaLHook from './hooks/channel.find.room.hook';
import { BsLayoutSidebarInset, BsReverseLayoutSidebarInsetReverse } from 'react-icons/bs';
import Button from '../components/Button';
import ChatNavbarLink from '../components/chat.navbar.link';
import { HiChatBubbleLeftRight } from 'react-icons/hi2';
import { FaUsers } from 'react-icons/fa';
import { RiSearchLine } from 'react-icons/ri';
import { AiOutlineUsergroupAdd } from 'react-icons/ai';
import { FiUsers } from 'react-icons/fi';
import LefttsideModaL from './modaLs/LeftsideModal';
import { RoomsType } from '@/types/types';
import ChanneLSidebarItem from './components/channel.sidebar.item';
import Image from 'next/image';
import { useParams, usePathname, useSearchParams } from 'next/navigation';
import Cookies from 'js-cookie';
import { Socket } from 'socket.io-client';
import FindOneBySLug from './actions/Channel/findOneBySlug';
import getChannels from './actions/getChanneLs';
import { set } from 'date-fns';
import Loading from './components/loading';
const changa = Changa({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-changa',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [IsMounted, setIsMounted] = React.useState(false)
  const [ChanneLs, setChannel] = React.useState<RoomsType[] | null>(null)
  const [createRoomSocket, setcreateRoomSocket] = React.useState<Socket | null>(null)
  const params = useSearchParams()
  const pathname = usePathname()
  const [isLoading, setIsLoading] = React.useState(true);

  const UserId: any = Cookies.get('_id');
  const token = Cookies.get('token');
  if (!UserId || !token) return;
  const leftSidebarHook = LeftSidebarHook();
  const channeLcreatemodaLHook = ChanneLcreatemodaLHook()
  const rightsidebarHook = RightsidebarHook()
  const channeLFindRoommodaLHook = ChanneLFindRoommodaLHook()
  const query = useParams();
  const slug: string | undefined = query.slug ? typeof query.slug === 'string' ? query.slug : query.slug[0] : undefined
  React.useEffect(() => {
    setTimeout(() => {
      setIsLoading(false)
    }, 2000)
    setIsMounted(true)
  }, [])



  React.useEffect(() => {
    if(!IsMounted) return;
    (async () => {
      const ChanneLs = await getChannels(token)
      if (!ChanneLs) return
      setChannel(ChanneLs)
      // setIsLoading(false)
    })();

  }, [IsMounted]);



  if (!IsMounted) return

  return (
    <html lang="en">
      <body className={`${changa.className}`} suppressHydrationWarning={true}>
        {isLoading ? < Loading /> : <Dashboard>
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
                {slug && <Button
                  icon={FiUsers}
                  small
                  outline
                  onClick={() => { rightsidebarHook.IsOpen ? rightsidebarHook.onClose() : rightsidebarHook.onOpen([]) }}
                />}

              </div>
            </div>

            <div className="channeLbody relative h-full flex ">
              <LefttsideModaL>
                {
                  ChanneLs && ChanneLs.map((room: RoomsType, key) => (
                    <ChanneLSidebarItem key={key} room={room} viewd={8} active={room.slug === slug} />
                  ))
                }
              </LefttsideModaL>
              {children}
            </div>

          </div>

        </Dashboard>}
      </body>
    </html>
  );
}