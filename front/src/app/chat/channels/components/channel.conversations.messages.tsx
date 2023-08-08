'use client'
import { FormEvent, ReactNode, useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";


interface ConversationsMessagesInterface {
    Content: ReactNode;
    socket: Socket | null
}

export default function ConversationsMessages({ Content, socket }: ConversationsMessagesInterface) {
    const chatContainerRef = useRef<HTMLDivElement | null>(null);


    useEffect(() => {
        socket?.on('message', (message: any) => {
            if (chatContainerRef.current) {
                chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight ;
                chatContainerRef.current.scrollTop + 600
                console.log("chatContainerRef.current.scrollTop :",chatContainerRef.current.scrollTop)
                console.log("chatContainerRef.current.scrollHeight :",chatContainerRef.current.scrollHeight)
            }
        })
    }, [socket])

    // Scroll to the last message when new messages are added

    return <div ref={chatContainerRef} className="ConversationsMessages relative h-[71vh] md:h-[71vh] p-4 overflow-y-scroll gap-2" >
        {Content}
    </div>
}