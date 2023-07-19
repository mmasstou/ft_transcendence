import { MouseEvent } from "react";
import Button from "../../components/Button";
import { AiFillCloseCircle } from "react-icons/ai";


export default function ChanneLModal({ children , onClose , title, IsOpen }: { children: React.ReactNode, onClose : () => void , title: string, IsOpen ?: boolean }) {
    if (!IsOpen) return null;
    return (
        <div className=" absolute top-0 bg-[#2632389e] w-full h-full z-50 flex justify-center items-center">
            <div className=" w-full max-w-xl bg-[#2B504B] m-3 rounded">
                <div className="flex justify-between items-center p-2 w-full mb-4">
                    <h1 className=" text-white capitalize">{title}</h1>
                    <Button
                        icon={AiFillCloseCircle}
                        small
                        outline
                        onClick={() => { onClose()}}
                    />
                </div>
                <div className="flex flex-col p-2 ">
                    {children}
                </div>
            </div>
        </div>
    )
}