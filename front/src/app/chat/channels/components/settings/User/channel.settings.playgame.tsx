import Button from "../../../../components/Button";
import Image from "next/image"
import StartGame from "../../../actions/startgame";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { IoChevronBackOutline } from "react-icons/io5";
import { TfiTimer } from "react-icons/tfi";
import { BsArrowRightShort } from "react-icons/bs";
import { MdOutlineScoreboard } from "react-icons/md";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { USERSETTINGSTEPS, membersType, userType } from "@/types/types";
import React from "react";
import { Socket } from "socket.io-client";
import getUserWithId from "../../../actions/getUserWithId";
import { set } from "date-fns";
import ChanneLSettingsBody from "../channel.settings.body";
import ChanneLsettingsProvider from "../ChanneL/channel.settings.chnnel.provider";
import SettingsProvider from "../channel.settings.provider";
import Loading from "../../loading";
import ChanneLsettingsHook from "../../../hooks/channel.settings";
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
            toast(`sdjghdsffdsfhdsfjdhgfjfgdh`);
            (async () => {
                if (!token) return;
                const body = {       ///////////////////////////////////////////////////////// body
                    player2Id: data.sender.id,
                    player1Id: data.userId,
                    mode: data.mode
                }
                const g = await StartGame(body, token);
                if (!g) return;
                toast(`satart game`);
                channeLsettingsHook.onClose()
                router.push(`/game/${data.mode}/friend`)
            })();
        }
        )

    }, [socket]);

    return <SettingsProvider
        socket={socket}
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
                            if (PLayer01?.status === 'online') {
                                onClick('time')
                                setLoadingGame(true);
                                setgamemode('time');
                                (async () => {
                                    setTimeout(() => {
                                        setLoadingGame(false)
                                    }, 8100);
                                })();
                            }
                            else {
                                toast(`${PLayer01?.login} is On Game`)
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
                                toast(`${PLayer01?.login} is On Game`)
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