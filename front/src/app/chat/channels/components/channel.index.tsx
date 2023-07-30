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
<<<<<<< HEAD
import { Socket } from "socket.io-client";
import RightsidebarHook from "../hooks/RightSidebarHook";
import ChanneLsettingsHook from "../hooks/channel.settings";

// env vars :
interface ChannelIndexProps {
    socket : Socket | null
 }

const ChanneLIndex: FC<ChannelIndexProps> = ({socket}) => {
    
=======

interface ChannelIndexProps { }

const ChanneLIndex: FC<ChannelIndexProps> = () => {

>>>>>>> 83667b2c2c6fcadfdbeb783afabb311e9d36e57c
    const [IsMounted, setIsMounted] = useState(false)
    const [IsLoading, setIsLoading] = useState(false)
    const router = usePathname();
    const leftSidebarHook = LeftSidebarHook();
    const channeLcreatemodaLHook = ChanneLcreatemodaLHook()
<<<<<<< HEAD
    const channeLsettingsHook = ChanneLsettingsHook()
    const rightsidebarHook = RightsidebarHook()
=======

>>>>>>> 83667b2c2c6fcadfdbeb783afabb311e9d36e57c

    useEffect(() => { setIsMounted(true) }, [])

    if (!IsMounted) return null
    return (
<<<<<<< HEAD
        <div className="--channeL relative h-full flex flex-col border-4 border-[#24323044] ">
            {/* nav bar */}
            
=======
        <div className="border border-yellow-600 h-[90vh] md:h-[94vh] flex flex-col ">
            {/* nav bar */}
>>>>>>> 83667b2c2c6fcadfdbeb783afabb311e9d36e57c
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
<<<<<<< HEAD
                        onClick={() => {channeLcreatemodaLHook.onOpen([], socket) }}
=======
                        onClick={() => {channeLcreatemodaLHook.onOpen([]) }}
>>>>>>> 83667b2c2c6fcadfdbeb783afabb311e9d36e57c
                    />
                    <Button
                        icon={FiUsers}
                        small
                        outline
<<<<<<< HEAD
                        onClick={() => {rightsidebarHook.IsOpen ? rightsidebarHook.onClose() : rightsidebarHook.onOpen([]) }}
                    />
                </div>
            </div>

            <ChanneLbody socket={socket}>
                <Conversations socket={socket} />
=======
                        onClick={() => { }}
                    />
                </div>
            </div>
            <ChanneLbody>
                <Conversations>

                </Conversations>
>>>>>>> 83667b2c2c6fcadfdbeb783afabb311e9d36e57c
            </ChanneLbody>

        </div>
    )
}

export default ChanneLIndex;