"use client"
// imports :
import { FormEvent, useState } from "react";

// components :
import ConversationsInput from "./chat.conversations.input";
import ConversationsMessages from "./chat.conversations.messages";

// hooks :
import RightSidebarHook from "@/hooks/RightSidebarHook";
import LeftSidebarHook from "@/hooks/LeftSidebarHook";
import { Socket } from "socket.io-client";
import RightsideModal from "../modals/LeftsideModal";
import Message from "./chat.message";
import ConversationsTitlebar from "./chat.conversations.titlebar";


export default function Conversations({ children }: { children: React.ReactNode }) {

    const rightSidebar = RightSidebarHook()
    const leftSidebar = LeftSidebarHook()
    const [socket, setsocket] = useState<Socket | undefined>(undefined)

    const content = (
       <div className="flex flex-col gap-3">
       
       <Message content={"oooooooohello"} id={'dcae3d31-948a-49de-bad4-de35875bda7b'} senderId={"dcae3d31-948a-49de-bad4-de35875bda7b"} roomsId={""} created_at={"2023-07-11T08:57:44.492Z"} updated_at={"2023-07-11T08:57:44.492Z"} />
       <Message content={"hello"} id={""} senderId={""} roomsId={""} created_at={""} updated_at={""} />
       <Message content={"hello"} id={""} senderId={""} roomsId={""} created_at={""} updated_at={""} />
       <Message content={"hello"} id={""} senderId={""} roomsId={""} created_at={""} updated_at={""} />
       <Message content={"hello"} id={""} senderId={""} roomsId={""} created_at={""} updated_at={""} />
       <Message content={"hello"} id={""} senderId={""} roomsId={""} created_at={""} updated_at={""} />
       <Message content={"hello"} id={""} senderId={""} roomsId={""} created_at={""} updated_at={""} />
       <Message content={"hello"} id={""} senderId={""} roomsId={""} created_at={""} updated_at={""} />
       <Message content={"hello"} id={""} senderId={""} roomsId={""} created_at={""} updated_at={""} />
       <Message content={"hello"} id={""} senderId={""} roomsId={""} created_at={""} updated_at={""} />
       <Message content={"hello"} id={""} senderId={""} roomsId={""} created_at={""} updated_at={""} />
       <Message content={"hello"} id={""} senderId={""} roomsId={""} created_at={""} updated_at={""} />
       <Message content={"hello"} id={""} senderId={""} roomsId={""} created_at={""} updated_at={""} />
       <Message content={"hello"} id={""} senderId={""} roomsId={""} created_at={""} updated_at={""} />
       <Message content={"hello"} id={""} senderId={""} roomsId={""} created_at={""} updated_at={""} />
       <Message content={"hello"} id={""} senderId={""} roomsId={""} created_at={""} updated_at={""} />
       <Message content={"hello"} id={""} senderId={""} roomsId={""} created_at={""} updated_at={""} />
       <Message content={"hello"} id={""} senderId={""} roomsId={""} created_at={""} updated_at={""} />
       <Message content={"hello"} id={""} senderId={""} roomsId={""} created_at={""} updated_at={""} />
       <Message content={"hello"} id={""} senderId={""} roomsId={""} created_at={""} updated_at={""} />
       <Message content={"hello"} id={""} senderId={""} roomsId={""} created_at={""} updated_at={""} />
       <Message content={"hello"} id={""} senderId={""} roomsId={""} created_at={""} updated_at={""} />
       <Message content={"hello"} id={""} senderId={""} roomsId={""} created_at={""} updated_at={""} />
       <Message content={"hello"} id={""} senderId={""} roomsId={""} created_at={""} updated_at={""} />
       <Message content={"hello"} id={""} senderId={""} roomsId={""} created_at={""} updated_at={""} />
       <Message content={"hello"} id={""} senderId={""} roomsId={""} created_at={""} updated_at={""} />
       <Message content={"hello"} id={""} senderId={""} roomsId={""} created_at={""} updated_at={""} />
       <Message content={"hello"} id={""} senderId={""} roomsId={""} created_at={""} updated_at={""} />
       <Message content={"hello"} id={""} senderId={""} roomsId={""} created_at={""} updated_at={""} />
       <Message content={"hello"} id={""} senderId={""} roomsId={""} created_at={""} updated_at={""} />
       <Message content={"hello"} id={""} senderId={""} roomsId={""} created_at={""} updated_at={""} />
       <Message content={"hello"} id={""} senderId={""} roomsId={""} created_at={""} updated_at={""} />
       <Message content={"hello"} id={""} senderId={""} roomsId={""} created_at={""} updated_at={""} />
       <Message content={"hello"} id={""} senderId={""} roomsId={""} created_at={""} updated_at={""} />
       <Message content={"hello"} id={""} senderId={""} roomsId={""} created_at={""} updated_at={""} />
       <Message content={"hello"} id={""} senderId={""} roomsId={""} created_at={""} updated_at={""} />
       <Message content={"hello"} id={""} senderId={""} roomsId={""} created_at={""} updated_at={""} />
       <Message content={"hello"} id={""} senderId={""} roomsId={""} created_at={""} updated_at={""} />
       <Message content={"hello"} id={""} senderId={""} roomsId={""} created_at={""} updated_at={""} />
       <Message content={"hello"} id={""} senderId={""} roomsId={""} created_at={""} updated_at={""} />
       <Message content={"hello"} id={""} senderId={""} roomsId={""} created_at={""} updated_at={""} />
       <Message content={"hello"} id={""} senderId={""} roomsId={""} created_at={""} updated_at={""} />
       <Message content={"hello"} id={""} senderId={""} roomsId={""} created_at={""} updated_at={""} />
       <Message content={"hello"} id={""} senderId={""} roomsId={""} created_at={""} updated_at={""} />
       <Message content={"hello"} id={""} senderId={""} roomsId={""} created_at={""} updated_at={""} />
       <Message content={"hello"} id={""} senderId={""} roomsId={""} created_at={""} updated_at={""} />
       <Message content={"hello"} id={""} senderId={""} roomsId={""} created_at={""} updated_at={""} />
       <Message content={"hello"} id={""} senderId={""} roomsId={""} created_at={""} updated_at={""} />
       <Message content={"hello"} id={""} senderId={""} roomsId={""} created_at={""} updated_at={""} />
       <Message content={"hello"} id={""} senderId={""} roomsId={""} created_at={""} updated_at={""} />
       <Message content={"hello"} id={""} senderId={""} roomsId={""} created_at={""} updated_at={""} />
       <Message content={"hello"} id={""} senderId={""} roomsId={""} created_at={""} updated_at={""} />
       <Message content={"hello"} id={""} senderId={""} roomsId={""} created_at={""} updated_at={""} />
       <Message content={"hello"} id={""} senderId={""} roomsId={""} created_at={""} updated_at={""} />
       <Message content={"hello"} id={""} senderId={""} roomsId={""} created_at={""} updated_at={""} />
       <Message content={"hello"} id={""} senderId={""} roomsId={""} created_at={""} updated_at={""} />
       <Message content={"hello"} id={""} senderId={""} roomsId={""} created_at={""} updated_at={""} />
       <Message content={"hello"} id={""} senderId={""} roomsId={""} created_at={""} updated_at={""} />
       <Message content={"hello"} id={""} senderId={""} roomsId={""} created_at={""} updated_at={""} />
       <Message content={"hello"} id={""} senderId={""} roomsId={""} created_at={""} updated_at={""} />
       <Message content={"hello"} id={""} senderId={""} roomsId={""} created_at={""} updated_at={""} />
       <Message content={"hello"} id={""} senderId={""} roomsId={""} created_at={""} updated_at={""} />
       <Message content={"hello"} id={""} senderId={""} roomsId={""} created_at={""} updated_at={""} />
       </div>
    )

    return <div className={`
    Conversations 
    relative 
    h-[89.3vh] 
    w-full 
    flex flex-col
    border 
    border-orange-300
    ${rightSidebar.IsOpen ? 'hidden' : ''} 
    sm:flex`}>
        <ConversationsTitlebar messageTo={"mmasstou"} OnSubmit={function (event: FormEvent<HTMLInputElement>): void {
            throw new Error("Function not implemented.");
        } } />
        <ConversationsMessages Content={content} />
        <ConversationsInput
            messageTo={"mmasstou"}
            OnSubmit={function (event: FormEvent<HTMLInputElement>): void {
                throw new Error("Function not implemented.");
            }}
        />
    </div>
}