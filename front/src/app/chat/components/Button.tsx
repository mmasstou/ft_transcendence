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
    IsActive?: boolean;
    size?: number;
}

const Button: React.FC<ButtonProps> = ({
    label,
    onClick,
    disabled,
    outline,
    small,
    icon: Icon,
    border,
    IsActive,
    size
}) => {
    return (
        <button
            disabled={disabled}
            onClick={onClick}
            className={`
        relative
        flex
        gap-2
        disabled:opacity-70
        disabled:cursor-not-allowed
        rounded-lg
        hover:opacity-80
        transition
        w-max
        px-2
        ${outline ? ' bg-transparent' : 'bg-rose-500'}
       ${border ? outline ? 'border-black' : 'border-rose-500' : ''}
       ${IsActive ? ' text-secondary' : 'text-white'}
        ${small ? 'text-sm' : 'text-md'}
        ${small ? 'py-1' : 'py-3'}
        ${small ? 'font-light' : 'font-semibold'}
        ${border ? small ? 'border-[1px]' : 'border-2' : ''}
      `}
        >
            {Icon && (<Icon  size={size ? size : 24} />)}
          <span className=" hidden sm:flex">  {label && label}</span>
        </button>
    );
}

export default Button;