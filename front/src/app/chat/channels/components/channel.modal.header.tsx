import { FC } from "react";
import { IoMdCloseCircle } from "react-icons/io";


interface channeLmodaLheaderProps {
    label : string;
    OnClose : () => void;
}
const ChanneLmodaLheader : FC<channeLmodaLheaderProps> = ({label, OnClose}) => {
    return (
        <div className="header w-full flex flex-row justify-between items-center">
            <h2 className=" capitalize text-white font-semibold">{label}</h2>
            <button onClick={OnClose}><IoMdCloseCircle size={21} fill="#1EF0AE" /></button>
        </div>
    )
}
export default ChanneLmodaLheader;