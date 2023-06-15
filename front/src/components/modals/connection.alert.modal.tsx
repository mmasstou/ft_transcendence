"use client"
import ConnectionHook from "@/hooks/connection.alert.hook"
import Modal from "./modaL copy"


const ConnectionAlert = ()=>{
    const connectionhook = ConnectionHook()

    const bodyContent = (
        <div className=" absolute top-[12rem] right-[12rem] h-[8rem] w-[16rem] bg-slate-500">
            hello
        </div>
    )
return <Modal overlay IsOpen={connectionhook.IsOpen} body={bodyContent} />
}

export default ConnectionAlert