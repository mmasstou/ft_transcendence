'use client';
import { Tooltip } from 'react-tooltip'
import { IconType } from "react-icons";
// import { randomUUID } from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-hot-toast';
interface ButtonProps {
    label?: string;
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
    disabled?: boolean;
    outline?: boolean;
    small?: boolean;
    icon?: IconType;
    border?: boolean;
    IsActive?: boolean;
    size?: number;
    IsBan?: boolean;
    labelsize?: number;
    responsive?: boolean;
    type?: boolean;
    showLabeL?: boolean
}

const Button: React.FC<ButtonProps> = ({
    label,
    labelsize,
    onClick,
    disabled,
    outline,
    small,
    icon: Icon,
    border,
    IsActive,
    type,
    size,
    IsBan,
    responsive,
    showLabeL
}) => {
    const _labelsise: string | undefined = labelsize ? 'text-' + labelsize.toString() : undefined
    const _id = uuidv4();
    return (
        <button
            type={type ? 'submit' : 'button'}
            disabled={disabled}
            onClick={onClick}
            data-tooltip-id={_id}
            data-tooltip-content={label}
            className={`
        relative
        flex
        gap-2
        disabled:opacity-70
        disabled:cursor-not-allowed
        rounded-lg
        hover:opacity-80
        capitalize
        transition
        items-center
        w-max
        px-2 z-10
        ${outline ? ' bg-transparent' : 'bg-rose-500'}
       ${border ? outline ? 'border-black' : 'border-rose-500' : ''}
       ${IsActive ? ' text-secondary' : IsBan ? ' text-isban' : 'text-white'}
        ${small ? 'text-sm' : 'text-md text-[#FFFFFF]'}
        ${small ? 'py-1' : 'py-3'}
        ${small ? 'font-light' : 'font-semibold'}
        ${border ? small ? 'border-[1px]' : 'border-2' : ''}
      `}
        >
            {Icon && (<Icon size={size ? size : 24} />)}
            {showLabeL && <span className={` ${responsive ? 'hidden sm:flex' : ''}  ${_labelsise && _labelsise} `}>  {label && label}</span>}
            {label && responsive&&<Tooltip opacity={1} className='z-[1111111111111111] bg-black' id={_id} place="left" />}

        </button>

    );
}

export default Button;