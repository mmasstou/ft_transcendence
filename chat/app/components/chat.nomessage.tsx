'use client'
import OnlineUsers from "../hooks/OnlineUsers"


const NoMessageToShow = () => {
    const onLineUser = OnlineUsers()

    return <div className={`justify-center items-center w-full capitalize text-xl flex ${onLineUser.IsOpen && 'hidden lg:flex'}`} >No message to Show</div>
}

export default NoMessageToShow