'use client';

import React, { useEffect, useState } from 'react'
import { VscSend } from 'react-icons/vsc';
import Cookies from 'js-cookie';
import Image from "next/image";
import { SlOptionsVertical } from 'react-icons/sl';
import { Socket, io } from 'socket.io-client';
import CustumBtn from '../components/custumBtn';
import ConversationMsg from '../components/conversationMsg';
import { conversationData } from '../page';



const token = Cookies.get('token');
const currentId = Cookies.get('_id');

function ConversationBody({ params }: { params: { dmid: string } }) {

    const [msgContent, setMsgContent] = useState<string>('');
    const [socket, setSocket] = useState<Socket | null>(null);
    const [convBody, setConvBody] = useState<conversationData | null>(null);
    const [messages, setMsgs] = useState<any>([]);
    

    const handleEnterClick = (e: any) => {
        if (e.key === 'Enter')
            console.log(`Message : ${msgContent}`);
    }

    const handleSendMsg = () => {
        console.log(`Message : ${msgContent}`);
        const obj = {conversationId: convBody?.id ,senderId: currentId, content: msgContent};
        socket?.emit('message', obj);
        setMsgContent('');
    }

    useEffect(() => {

        socket?.on('message', (data) => {
            console.log('Received message from server:', data);
            setMsgs([...messages, data])
        });
        
        console.log(convBody);
        console.log(convBody?.messages);


    }, [convBody, messages])

    async function getConversation() {
        const response = await(await fetch(`${process.env.NEXT_PUBLIC_API_URL}/conversations/${params.dmid}`, {
			method: 'GET',
			headers: {
			  'Content-Type': 'application/json',
			  Authorization: `Bearer ${token}`,
			},
		  })).json();

          setConvBody(response);
          setMsgs(response.messages);
    }

    useEffect(() => {
        
        getConversation();
        const socket: Socket = io(`${process.env.NEXT_PUBLIC_SOCKET_URL}`, {
            auth : {
                id: convBody?.id,
            }
        });

        setSocket(socket);
        socket.emit('handshake', params.dmid);

        socket.on('acknowledge', (data) => {
            console.log("Recieved from server: ", data);
        });

        return () => {
            socket.disconnect();
        }
    }, [])

    return (
        <div className='w-full'>
            {convBody ? 
            <section className='flex flex-col justify-between content-between h-full'>
                <div className='text-[#1EF0AE] flex gap-8 items-center bg-[#243230] py-2 px-5'>
                    <Image src={convBody.users[0].id !== currentId ? convBody.users[0].avatar : convBody.users[1].avatar} alt={'avatar'} width={55} height={55} className='rounded-[50%]'/>
                    <section className='flex justify-between w-full'>
                        <p>{convBody.users[0].id !== currentId ? convBody.users[0].login : convBody.users[1].login}</p>
                        <CustumBtn icon={SlOptionsVertical} onClick={() => console.log("Option Modal ...")} size={15} />
                    </section>
                </div>
                <ConversationMsg msgs={messages}/>
                <div className='text-[#1EF0AE] flex gap-4 justify-center w-full py-2 bg-[#243230]'>
                    <input type='text' placeholder='  Type a message' value={msgContent} onChange={(e) => setMsgContent(e.target.value)} onFocus={(e) => handleEnterClick(e)} className='max-h-[100px] h-[50px] overflow-auto w-[75%] py-2 px-5 bg-primary rounded-[25px] focus:border-[#1EF0AE] focus:outline-none text-sm'/>
                    <section className='w-[50px] h-[50px] bg-primary flex justify-center items-center rounded-[50%]'>
                        <CustumBtn icon={VscSend} onClick={() => handleSendMsg()} size={24}/>
                    </section>
                </div>
            </section>
            :
            <div className="flex flex-col justify-center items-center h-full w-full">
                <Image src="/no_conversations.svg" width={600} height={600} alt={""} />
            </div>}
        </div>
    )
}

export default ConversationBody