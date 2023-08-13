'use client'
import { FormEvent, ReactNode, useState } from "react";


interface ConversationsMessagesInterface{
    Content : ReactNode
}

export default function ConversationsMessages( {Content} : ConversationsMessagesInterface ) {
    return <div className="ConversationsMessages relative h-[74vh] md:h-[74vh] p-4 overflow-y-scroll gap-2" >
       {Content}
    </div>
}