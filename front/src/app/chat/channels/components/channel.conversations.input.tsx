'use client'
import { FormEvent, useState } from "react";


interface ConversationsInputInterface{
    messageTo: string;
<<<<<<< HEAD
    value : string;
    setInputValue : (value : string) => void;
    onChange : (event : FormEvent<HTMLInputElement>) => void;
    OnSubmit : (event : FormEvent<HTMLInputElement>) => void;
}

export default function ConversationsInput( {messageTo, value, OnSubmit, onChange, setInputValue} : ConversationsInputInterface ) {
   
=======
    OnSubmit : (event : FormEvent<HTMLInputElement>) => void;
}

export default function ConversationsInput( {messageTo, OnSubmit} : ConversationsInputInterface ) {
    const [input, setInputValue] = useState("")
>>>>>>> 83667b2c2c6fcadfdbeb783afabb311e9d36e57c
    const [message, setMessage] = useState("");
    return <div className="w-full m-[2px]">
        <input
            className="ConversationsInput w-full h-[4vh]  text-white text-base  font-semibold px-2 outline bg-[#243230] border-transparent focus:border-transparent rounded"
            onSubmit={(event : any) => {
                OnSubmit(event)
                setMessage(event.target.value);
            }
            }
            onKeyDown={(event) =>
                event.key === "Enter" ? OnSubmit(event) : null
            }
            onChange={(event) => {
                setInputValue(event.target.value);
                setMessage(event.target.value);
            }}
<<<<<<< HEAD
            value={value}
=======
            value={input}
>>>>>>> 83667b2c2c6fcadfdbeb783afabb311e9d36e57c
            placeholder={`Message @'${messageTo}'`}
            type="search"
            name=""
            id="" />
    </div>
}