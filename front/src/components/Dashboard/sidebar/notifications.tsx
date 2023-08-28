import Cookies from "js-cookie";
import { useEffect, useState } from "react"
import { Socket, io } from "socket.io-client";


const Notifications = () => {
    const [notification, setnotification] = useState(false)
    const [socket, setSocket] = useState<Socket | null>(null);
    const token = Cookies.get('token')


    useEffect(() => {
        const socket: Socket = io(`${process.env.NEXT_PUBLIC_SOCKET_URL}/notification`, {
            auth: {
                token: `${token}`
            }
        });
        setSocket(socket);

        // const messageSocket: messageSocket = {
        //     roomId: roomid,
        //     messageContent: message
        // }
        // // if (message) {

        // socket && socket.emit("sendMessage", messageSocket, () => setmessages(""));



        return () => {
            socket && socket.disconnect();
        };
    }, [])

    socket && socket.on('notification', (data: { status: boolean, token: string }) => {
        // console.log("notification :", data)
        if (data.token === token)
            setnotification(data.status)
    })
    if (!notification) {
        return null
    }
    return <span className=' absolute right-0 top-0 bg-[#ED6C03] py-1 px-1 rounded-full text-white font-semibold text-[.6rem]'></span>
}

export default Notifications