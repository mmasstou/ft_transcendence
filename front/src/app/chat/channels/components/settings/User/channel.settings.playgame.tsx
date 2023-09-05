import { userType } from "@/types/types";
import Cookies from "js-cookie";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import toast from "react-hot-toast";
import { BsArrowRightShort } from "react-icons/bs";
import { IoChevronBackOutline } from "react-icons/io5";
import { MdOutlineScoreboard } from "react-icons/md";
import { TfiTimer } from "react-icons/tfi";
import { Socket } from "socket.io-client";
import Button from "../../../../components/Button";
import getUserWithId from "../../../actions/getUserWithId";
import StartGame from "../../../actions/startgame";
import ChanneLsettingsHook from "../../../hooks/channel.settings";
import SettingsProvider from "../../../providers/channel.settings.provider";
import Loading from "../../loading";
interface props {
    onClick: (data: any) => void;
    Onback: () => void;
    player1Id: string | undefined;
    player2Id: string | undefined;
    socket: Socket | null
}
/*
{
  Response: false,
  User: {
    id: 'd7cef41c-c2bb-4151-a9c3-8b77b10bd5ac',
    login: 'aboulhaj',
  },
  sender: {
    id: 'c2f11a8c-0fa0-4def-94d1-ca881a4cbc15',
    login: 'aouhadou',
  },
  mode: 'time'
}
**/
export default function ChanneLsettingsPlayGame(
    { onClick, player1Id, player2Id, Onback, socket }: props
) {
    const router = useRouter()
    const [LoadingGame, setLoadingGame] = React.useState<boolean>(false)
    const [PLayer01, setPLayer01] = React.useState<userType | null>(null)
    const [PLayer02, setPLayer02] = React.useState<userType | null>(null)
    const [gamemode, setgamemode] = React.useState<string>('')
    const channeLsettingsHook = ChanneLsettingsHook()
    const UserId = Cookies.get('_id')
    const token: any = Cookies.get('token');
    if (!UserId || !token) return;


    React.useEffect(() => {
        (async () => {
            const p1 = player1Id && await getUserWithId(player1Id, token)
            const p2 = player2Id && await getUserWithId(player2Id, token)
            if (!p1 || !p2) return;
            setPLayer01(p1)
            setPLayer02(p2)
        })();
    }, []);

    React.useEffect(() => {
        socket?.on('GameResponseToChatToUser', (resp: {
            User: userType
            sender: userType
            Response: boolean
            mode: string
        }) => {
            setLoadingGame(false)
        })
        socket?.on('GameResponse', (data: any) => {
            (async () => {
                if (!token) return;
                const body = {       ///////////////////////////////////////////////////////// body
                    player2Id: data.sender.id,
                    player1Id: data.userId,
                    mode: data.mode
                }
                const g = await StartGame(body, token);
                if (!g) return;
                channeLsettingsHook.onClose()
                router.push(`/game/${data.mode}/friend`)
            })();
        }
        )
        socket?.on('UserSendToStatus', (data: any) => {
            console.log('PLayer01', data);
            if (data.id === player1Id) {
                setPLayer01(data)
            }
            if (data.id === player2Id) {
                setPLayer02(data)
            }
        })
        return () => {
            socket?.off('GameResponseToChatToUser')
            socket?.off('GameResponse')
            socket?.off('UserSendToStatus')
        }
    }, [socket]);

    React.useEffect(() => {

        (async () => {
            const p1 = player1Id && await getUserWithId(player1Id, token)
            const p2 = player2Id && await getUserWithId(player2Id, token)
            if (!p1 || !p2) return;
            setPLayer01(p1)
            setPLayer02(p2)

        })();
    }, [PLayer01, PLayer02]);

    return <SettingsProvider
    >
        <div className=" flex flex-row items-center justify-start gap-3">
            {<Button
                icon={IoChevronBackOutline}
                outline
                size={21}
                labelsize={8}
                onClick={Onback}
            />}
            <h3 className="capitalize text-md text-[#FFFFFF] font-semibold"> {`Play with ${PLayer01?.login}`} </h3>
        </div>
        {LoadingGame ? <div>
            < Loading chat mode={gamemode} message={` Waiting for ${PLayer01?.login}  to accept the invitation ...`} />
        </div> : <div className="overflow-y-scroll max-h-[34rem] flex flex-col w-full">
            <div className="flex flex-col h-full w-full justify-start gap-4 items-center min-h-[34rem] ">
                <div className="flex flex-col justify-center items-center gap-3">
                    <Image src="/game-mode.svg" width={200} height={200} alt={""} />
                    {/* <h2 className=" capitalize font-extrabold text-white">permission denied</h2> */}
                </div>
                {/* <h2>
                    P1 :{player1Id} - {PLayer02?.login} <br />
                    p2 : {player2Id} - {PLayer01?.login}
                </h2> */}
                <div className="flex flex-col gap-3  w-full">
                    <button
                        onClick={() => {
                            onClick('time')
                            setLoadingGame(true);
                            setgamemode('time');
                            (async () => {
                                setTimeout(() => {
                                    setLoadingGame(false)
                                }, 8100);
                            })();
                            if (PLayer01?.status !== 'online') {
                                setLoadingGame(false)
                                toast(`${PLayer01?.login} is ${PLayer01?.status}`)
                            }
                        }}
                        className="flex flex-row justify-between items-center shadow p-2 rounded hover:border-[#FFCC00] hover:border">
                        <div className='flex justify-center items-center p-3 rounded bg-[#FFCC00] text-white'>
                            <TfiTimer size={28} />
                        </div>
                        <div>
                            <h2 className='text-white'>Time Mode</h2>
                        </div>
                        <div className='text-white'>
                            <BsArrowRightShort size={24} />
                        </div>
                    </button>
                    <button
                        onClick={() => {
                            if (PLayer01?.status === 'online') {
                                onClick('score')
                                setLoadingGame(true);
                                setgamemode('score');
                                (async () => {
                                    setTimeout(() => {
                                        setLoadingGame(false)
                                    }, 8000);
                                })();
                            }
                            else {
                                toast(`${PLayer01?.login} is ${PLayer01?.status}`)
                            }
                        }}
                        className="flex flex-row justify-between items-center shadow p-2 rounded hover:border-secondary hover:border">
                        <div className='flex justify-center items-center p-3 rounded bg-secondary text-white'>
                            <MdOutlineScoreboard size={28} />
                        </div>
                        <div>
                            <h2 className='text-white'>Score Mode</h2>
                        </div>
                        <div className='text-white'>
                            <BsArrowRightShort size={24} />
                        </div>
                    </button>

                </div>
            </div>
        </div>}
    </SettingsProvider>



}