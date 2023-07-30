'use client'
import { FormEvent, ReactNode, useState } from "react";


interface ConversationsMessagesInterface{
    Content : ReactNode
}

export default function ConversationsMessages( {Content} : ConversationsMessagesInterface ) {
<<<<<<< HEAD
    return <div className="ConversationsMessages relative h-[74vh] md:h-[74vh] p-4 overflow-y-scroll gap-2" >
=======
    return <div className="ConversationsMessages relative h-[85vh] p-4 overflow-y-scroll gap-2" >
>>>>>>> 83667b2c2c6fcadfdbeb783afabb311e9d36e57c
       {Content}
    </div>
}