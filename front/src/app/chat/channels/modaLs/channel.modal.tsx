import React, { MouseEvent } from "react";
import Button from "../../components/Button";
import { AiFillCloseCircle } from "react-icons/ai";

interface props {
    children: React.ReactNode;
    onClose: () => void;
    title: string;
    IsOpen?: boolean;
    z_index?: number;

}
export default function ChanneLModal({ children, onClose, title, IsOpen, z_index }: props) {

    const [IsMounted, setIsMounted] = React.useState<boolean>(false)
    React.useEffect(() => { setIsMounted(true) }, [])
    if (!IsOpen || !IsMounted) return null;
    const zindex = z_index ? 'z-[' + z_index.toString() + ']' : 'z-[36]'
    return (
        <div className={`absolute top-0 bg-[#2632389e] w-full h-full min-h-[40rem] flex justify-center items-center ${zindex}`}>
            <div className=" w-full max-w-xl bg-[#2B504B] m-3 rounded">
                <div className="flex justify-between items-center p-2 w-full mb-2">
                    <h1 className=" text-white capitalize pl-6">{title}</h1>
                    <Button
                        icon={AiFillCloseCircle}
                        small
                        outline
                        onClick={() => { onClose() }}
                    />
                </div>
                <div className="flex flex-col p-2">
                    {children}
                </div>
            </div>
        </div>
    )
}