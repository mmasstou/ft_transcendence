'use client'

import OnlineUsers from "../hooks/OnlineUsers"
<<<<<<< HEAD
import Modal from "./modaL"
=======
>>>>>>> ca81945040519bd4e8cfdd364a46e2a1065fd456

const OnlineUsersModaL = () => {
    const onLineUser = OnlineUsers()
    return <>{
        onLineUser.IsOpen
        && <div className=" flex justify-center items-center h-[80vh] w-[95vw] sm:max-w-[280px] border border-red-500 ">OnLineUser ModaL</div>
    }</>
}

export default OnlineUsersModaL