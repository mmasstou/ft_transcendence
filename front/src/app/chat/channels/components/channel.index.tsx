// imports :
import { FC, MouseEvent, use, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

// components :
import ChatNavbarLink from "../../components/chat.navbar.link";

// Hooks :
import LeftSidebarHook from "@/app/chat/hooks/LeftSidebarHook";
import RightSidebarHook from "@/app/chat/hooks/RightSidebarHook";

// Icons :
import { HiChatBubbleLeftRight } from "react-icons/hi2";
import { FaUsers } from "react-icons/fa";
import { BsJournalPlus, BsLayoutSidebarInset, BsReverseLayoutSidebarInsetReverse } from "react-icons/bs";
import { FiUsers } from "react-icons/fi";
import Button from "../../components/Button";
interface ChannelIndexProps { }

const ChanneLIndex: FC<ChannelIndexProps> = () => {

    const [IsMounted, setIsMounted] = useState(false)
    const [IsLoading, setIsLoading] = useState(false)
    const router = usePathname();
    const leftSidebarHook = LeftSidebarHook();
    const rightSidebarHook = RightSidebarHook();


    useEffect(() => { setIsMounted(true) }, [])

    if (!IsMounted) return null
    return (
        <div className="border border-yellow-600 h-full flex flex-col ">
            {/* nav bar */}
            <div className=" grid grid-flow-row-dense grid-cols-4 justify-between items-center text-white px-2 py-1">
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
                                rightSidebarHook.IsOpen && rightSidebarHook.onClose()
                            }}
                        />

                    }
                </div>
                <div className="channeLnavbar col-span-2 flex justify-center  sm:justify-around gap-4 w-full ">
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
                        onClick={() => { }}
                    />
                    <Button
                        icon={FiUsers}
                        small
                        outline
                        onClick={() => !rightSidebarHook.IsOpen ? rightSidebarHook.onOpen([]) : rightSidebarHook.onClose()}
                    />

                </div>
            </div>
            <div className="channeLbody border border-green-600 h-full">hrhhr</div>
        </div>
    )
}

export default ChanneLIndex;