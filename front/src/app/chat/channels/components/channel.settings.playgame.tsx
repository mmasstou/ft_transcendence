import Button from "../../components/Button";
import Image from "next/image"
import StartGame from "../actions/startgame";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { IoChevronBackOutline } from "react-icons/io5";
import { TfiTimer } from "react-icons/tfi";
import { BsArrowRightShort } from "react-icons/bs";
import { MdOutlineScoreboard } from "react-icons/md";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { USERSETTINGSTEPS, membersType, userType } from "@/types/types";
interface props {
    onClick: (data : any) => void;
    Onback : () => void;
    player1Id: string | undefined;
    player2Id: string | undefined;
}

export default function ChanneLsettingsPlayGame(
    { onClick, player1Id ,player2Id, Onback }: props
) {
    const router = useRouter()
    return (
        <>
            <div className="flex flex-row justify-center items-center gap-2">
                <Button
                    icon={IoChevronBackOutline}
                    label={"back"}
                    outline
                    size={21}
                    labelsize={8}
                    onClick={Onback}
                />
            </div>
            <div className="overflow-y-scroll max-h-[34rem] flex flex-col w-full">
                <div className="flex flex-col h-full w-full justify-start gap-4 items-center min-h-[34rem] ">
                    <div className="flex flex-col justify-center items-center gap-3">
                        <Image src="/game-mode.svg" width={200} height={200} alt={""} />
                        {/* <h2 className=" capitalize font-extrabold text-white">permission denied</h2> */}
                    </div>
                    <h2>
                        P1 :{player1Id} <br />
                        p2 : {player2Id}
                    </h2>
                    <div className="flex flex-col gap-3  w-full">
                        <button
                            onClick={() => {
                                onClick('time')
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
                                onClick('score')
                                // const body = {       ///////////////////////////////////////////////////////// body
                                //     player2Id: player2Id,
                                //     player1Id: player1Id,
                                //     mode: "score"
                                // }
                                // // axios.post(`${process.env.NEXT_PUBLIC_API_URL}/game/BotGame`, body).then((result) => {
                                // //     router.push('/game/score/robot')
                                // // })
                                // // console.log("Ti÷me Mode");
                                // toast("Time Mode");
                                // (async () => {
                                //     console.log("${process.env.NEXT_PUBLIC_API_URL}/game/BotGame :", `${process.env.NEXT_PUBLIC_API_URL}/game/BotGame`)
                                //     const token: any = Cookies.get('token');
                                //     if (!token) return;
                                //     const g = await StartGame(body, token);
                                //     console.log("++++++++++++++++++++++++++++++> game:", g)
                                //     if (!g) return;
                                //     toast.success("play ....")
                                //     router.push('/game/score/friend')
                                // })();
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
            </div>

        </>
    )
}