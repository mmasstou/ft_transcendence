'use client';

import { IconType } from "react-icons";

interface ButtonProps {
    label?: string;
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
    disabled?: boolean;
    outline?: boolean;
    small?: boolean;
    icon?: IconType;
    border?: boolean;
<<<<<<< HEAD
    IsActive?: boolean;
    size?: number;
    IsBan?: boolean;
    labelsize?: number;
    responsive ?: boolean;
=======
>>>>>>> 83667b2c2c6fcadfdbeb783afabb311e9d36e57c
}

const Button: React.FC<ButtonProps> = ({
    label,
<<<<<<< HEAD
    labelsize,
=======
>>>>>>> 83667b2c2c6fcadfdbeb783afabb311e9d36e57c
    onClick,
    disabled,
    outline,
    small,
    icon: Icon,
<<<<<<< HEAD
    border,
    IsActive,
    size,
    IsBan,
    responsive
}) => {
    const _labelsise  :string | undefined = labelsize ? 'text-' + labelsize.toString() : undefined
=======
    border
}) => {
>>>>>>> 83667b2c2c6fcadfdbeb783afabb311e9d36e57c
    return (
        <button
            disabled={disabled}
            onClick={onClick}
            className={`
        relative
<<<<<<< HEAD
        flex
        gap-2
=======
>>>>>>> 83667b2c2c6fcadfdbeb783afabb311e9d36e57c
        disabled:opacity-70
        disabled:cursor-not-allowed
        rounded-lg
        hover:opacity-80
<<<<<<< HEAD
        capitalize
        transition
        items-center
        w-max
        px-2
        ${outline ? ' bg-transparent' : 'bg-rose-500'}
       ${border ? outline ? 'border-black' : 'border-rose-500' : ''}
       ${IsActive ? ' text-secondary' : IsBan ? ' text-isban' : 'text-white'}
        ${small ? 'text-sm' : 'text-md text-[#FFFFFF]'}
=======
        transition
        w-max
        ${outline ? ' bg-transparent' : 'bg-rose-500'}
       ${border ? outline ? 'border-black' : 'border-rose-500' : ''}
       text-white
        ${small ? 'text-sm' : 'text-md'}
>>>>>>> 83667b2c2c6fcadfdbeb783afabb311e9d36e57c
        ${small ? 'py-1' : 'py-3'}
        ${small ? 'font-light' : 'font-semibold'}
        ${border ? small ? 'border-[1px]' : 'border-2' : ''}
      `}
        >
<<<<<<< HEAD
            {Icon && (<Icon size={size ? size : 24} />)}
            <span className={` ${responsive ? 'hidden sm:flex' : ''}  ${_labelsise && _labelsise} `}>  {label && label}</span>
=======
            {Icon && (<Icon size={24} />)}
            {label && label}
>>>>>>> 83667b2c2c6fcadfdbeb783afabb311e9d36e57c
        </button>
    );
}

export default Button;