'use client'
import { FormEvent, useState } from "react";


interface ConversationsTitlebarInterface{
    messageTo: string;
    OnSubmit : (event : FormEvent<HTMLInputElement>) => void;
}

export default function ConversationsTitlebar( {messageTo, OnSubmit} : ConversationsTitlebarInterface ) {
    const [input, setInputValue] = useState("")
    const [message, setMessage] = useState("");
    return <div className="w-full  h-11 bg-primary">
       {messageTo}
    </div>
}