'use client';
import Cookies from 'js-cookie';
import Image from 'next/image';
import React from 'react';
import findAlldmsForLoginUser from './channels/actions/findAlldmsForLoginUser';
import LeftSidebarHook from './channels/hooks/LeftSidebarHook';
import LefttsideModaL from './channels/modaLs/LeftsideModal';
import Conversation from './components/Conversation';

export default function page() {
  const [ConversationList, setConversationList] = React.useState<any>(null);
  const [IsMounted, setIsMounted] = React.useState(false);
  const leftSidebarHook = LeftSidebarHook();
  const token = Cookies.get('token');

  const UpdateData = async () => {
    if (!token) return;
    const res = await findAlldmsForLoginUser(token)
    if (res) setConversationList(res);
  }
  React.useEffect(() => {
    UpdateData()
    setIsMounted(true)
  }, []);
  if (!IsMounted) return
  return (
    <>
      <LefttsideModaL>
        {
          ConversationList && ConversationList.map((md: any, key: number) => (
            <Conversation md={md} />
          ))
        }
      </LefttsideModaL>
      <div className={`${(leftSidebarHook.IsOpen) && 'hidden md:flex'} w-full`}>
        <div className="flex flex-col justify-center items-center h-full w-full">
          <Image src="/no_conversations.svg" width={600} height={600} alt={""} />
        </div>
      </div>
    </>

  )
}
