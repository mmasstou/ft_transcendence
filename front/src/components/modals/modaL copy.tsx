"use client";
import { useCallback, useEffect, useState } from "react";

// styles

// icons :
import { IoMdClose } from "react-icons/io";
import { BsFullscreen, BsFullscreenExit, BsSearch } from "react-icons/bs";
import { CgClose } from "react-icons/cg"

// components :



interface ModalProps {
    head?: React.ReactElement;
    headCenter?: boolean;
    IsOpen: boolean;
    IsForm?: boolean;
    OnClose?: () => void;
    OnSubmit?: () => void;
    actionLable?: string;
    title?: string;
    subtitle?:string
    body?: React.ReactElement;
    footer?: React.ReactElement;
    Disabled?: boolean;
    secondaryAction?: () => void;
    secondaryActionLable?: string;
    overlay?:boolean
}

const Modal: React.FC<ModalProps> = ({
    head,
    headCenter,
    IsOpen,
    IsForm,
    OnClose,
    OnSubmit,
    title,
    subtitle,
    body,
    footer,
    actionLable,
    Disabled,
    secondaryAction,
    secondaryActionLable,
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
        <div className={` top-0 right-0  absolute w-screen h-screen ${overlay && ' bg-[#243230] dark:bg-[#292c33ed]'} z-50 flex flex-col gap-3 justify-center items-center`}>
            <div className="flex flex-col gap-4  p-8 sm:p-20 justify-center items-center h-full w-full" >
              {body}
            </div>
        </div>
    );
};

export default Modal;
