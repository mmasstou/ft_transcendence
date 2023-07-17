"use client";
import { useCallback, useEffect, useState } from "react";

interface ModalProps {
    head?: React.ReactElement;
    headCenter?: boolean;
    IsOpen: boolean;
    IsForm?: boolean;
    OnClose?: () => void;
    OnSubmit?: () => void;
    actionLable?: string;
    title?: string;
    subtitle?: string
    body?: React.ReactElement;
    footer?: React.ReactElement;
    Disabled?: boolean;
    secondaryAction?: () => void;
    secondaryActionLable?: string;
    overlay?: boolean
}

const Modal: React.FC<ModalProps> = ({
    head,
    headCenter,
    IsOpen,
    IsForm,
    OnClose,
    OnSubmit,
    body,
    footer,
    Disabled,
    overlay
}) => {
    const handlOnSubmit = useCallback(() => {
        if (Disabled || !OnSubmit) {
            return;
        }
        OnSubmit();
    }, [Disabled, OnSubmit]);
    if (!IsOpen)
        return null

    return (
        <div className={` 
        top-0
        right-0 
        absolute
        w-screen
        h-screen
        ${overlay &&
            ' bg-[#243230] dark:bg-[#292c33ed]'
            } 
        z-50
        flex
        flex-col
        gap-3
        justify-center
        items-center
        `}>
            <div className="
            relative
            flex
            flex-col
            gap-4 
            p-8
            sm:p-20
            justify-center
            items-center
            h-full
            w-full
            " >
               
                {body}
            </div>
        </div>
    );
};

export default Modal;
