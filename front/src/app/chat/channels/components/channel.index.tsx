// imports :
import { FC, MouseEvent, use, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

// components :
import ChatNavbarLink from "../../components/chat.navbar.link";
import ChanneLbody from "./channel.body";
import Button from "../../components/Button";

// Hooks :

import LeftSidebarHook from "../hooks/LeftSidebarHook";

// Icons :
import { HiChatBubbleLeftRight } from "react-icons/hi2";
import { FaUsers } from "react-icons/fa";
import { BsJournalPlus, BsLayoutSidebarInset, BsReverseLayoutSidebarInsetReverse } from "react-icons/bs";
import { FiUsers } from "react-icons/fi";
import Conversations from "./channel.conversations";
import ChanneLcreatemodaLHook from "../hooks/channel.create.hook";
import { Socket } from "socket.io-client";

interface ChannelIndexProps {
    socket : Socket | null
 }

const ChanneLIndex: FC<ChannelIndexProps> = ({socket}) => {

    const [IsMounted, setIsMounted] = useState(false)
    const [IsLoading, setIsLoading] = useState(false)
    const router = usePathname();
    const leftSidebarHook = LeftSidebarHook();
    const channeLcreatemodaLHook = ChanneLcreatemodaLHook()
 // console.log("ChannelIndex socket :", socket?.id )


    useEffect(() => { setIsMounted(true) }, [])

    if (!IsMounted) return null
    return (
        <div className="border border-yellow-600 h-[90vh] md:h-[94vh] flex flex-col ">
            {/* nav bar */}
            <div className="channeLnavbar grid grid-flow-row-dense grid-cols-4 justify-between items-center text-white px-2 py-1">
                <div>
                    {leftSidebarHook.IsOpen
                        ? <Button
                            icon={BsReverseLayoutSidebarInsetReverse}
                            small
                            outline
                            onClick={() => { leftSidebarHook.onClose() }}
                        />
                        : <Button
                            icon={BsLayoutSidebarInset}
                            small
                            outline
                            onClick={() => {
                                leftSidebarHook.onOpen([])
                            }}
                        />
                    }
                </div>
                <div className="channeLnavbarmenu col-span-2 flex justify-center  sm:justify-around gap-4 w-full ">
                    <ChatNavbarLink
                        to="/chat/directmessage"
                        label="direct Message"
                        icon={HiChatBubbleLeftRight}
                        active={router.includes('directmessage')}
                    />
                    <ChatNavbarLink
                        to="/chat/channels"
                        label="channeL"
                        icon={FaUsers}
                        active={router.includes('channels')}
                    />
                </div>
                <div className="flex justify-end items-center gap-2">
                    <Button
                        icon={BsJournalPlus}
                        small
                        outline
                        onClick={() => {channeLcreatemodaLHook.onOpen([], socket) }}
                    />
                    <Button
                        icon={FiUsers}
                        small
                        outline
                        onClick={() => { }}
                    />
                </div>
            </div>
            <ChanneLbody socket={socket}>
                <Conversations socket={socket} />
            </ChanneLbody>

        </div>
    )
}

export default ChanneLIndex;