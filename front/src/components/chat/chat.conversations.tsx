"use client"
// imports :
import { FormEvent, use, useEffect, useState } from "react";

// components :
import ConversationsInput from "./chat.conversations.input";
import ConversationsMessages from "./chat.conversations.messages";

// hooks :
import RightSidebarHook from "@/hooks/RightSidebarHook";
import LeftSidebarHook from "@/hooks/LeftSidebarHook";
import { Socket } from "socket.io-client";
import RightsideModal from "../../modals/LeftsideModal";
import Message from "./chat.message";
import ConversationsTitlebar from "./chat.conversations.titlebar";
import { useSearchParams } from "next/navigation";
import Image from "next/image";


export default function Conversations({ children }: { children?: React.ReactNode }) {

    const rightSidebar = RightSidebarHook()
    const leftSidebar = LeftSidebarHook()
    const [socket, setsocket] = useState<Socket | undefined>(undefined)
    const [hasparam, sethasparam] = useState(false)
    const params = useSearchParams()
    const room = params.get('r')
    console.log("               +> room : ", room)

    useEffect(() => {
        room ? sethasparam(true) : sethasparam(false)
        console.log("               +> room : ", room)
    }, [room])

    const content = (
        <div className="flex flex-col gap-3">
            <Message content={"We're GitHub, the company behind the npm Registry and npm CLI. We offer those to the community for free, but our day job is building and selling useful tools for developers like you."} id={'dcae3d31-948a-49de-bad4-de35875bda7b'} senderId={"dcae3d31-948a-49de-bad4-de35875bda7b"} roomsId={""} created_at={"2023-07-11T08:57:44.492Z"} updated_at={"2023-07-11T08:57:44.492Z"} />
        </div>
    )
    return <div className={`
    Conversations 
    relative 
    h-[86vh]
    md:h-[90vh]
    w-full 
    flex flex-col
     -orange-300
    ${rightSidebar.IsOpen ? 'hidden' : ''} 
    sm:flex`}>
        {
            hasparam ? <>
                <ConversationsTitlebar messageTo={"mmasstou"} OnSubmit={function (event: FormEvent<HTMLInputElement>): void {
                    throw new Error("Function not implemented.");
                }} />
                <ConversationsMessages Content={content} />
                <ConversationsInput
                    messageTo={"mmasstou"}
                    OnSubmit={function (event: FormEvent<HTMLInputElement>): void {
                        console.log("event :", event)
                    }}
                />
            </>
                : <div className="flex flex-col justify-center items-center h-full w-full">
                    <Image src="/no_conversations.svg" width={600} height={600} alt={""} />
                </div>}
    </div>
}