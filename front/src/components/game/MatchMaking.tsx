'use client';
import React from 'react'
import * as Dialog from '@radix-ui/react-dialog';
import { PiSpinnerGap } from 'react-icons/pi';

const MatchMaking = () => {
  return (
    <>
    <div className='bg-black h-50 w-1/3 text-white flex flex-col justify-center items-center'>
        match making ....
    </div>
     {/* <Dialog.Root defaultOpen>
        <Dialog.Trigger>Open</Dialog.Trigger>
        <Dialog.Portal>
            <Dialog.Overlay
            className="bg-black opacity-60 data-[state=open]:animate-overlayShow fixed inset-0"
            onPointerDown={(e) => e.stopPropagation()}
            />
            <Dialog.Content 
            className="flex flex-col items-center gap-6 lg:gap-8 xl:gap-10 data-[state=open]:animate-contentShow text-white rounded-lg bg-[#243230] p-6 fixed top-1/2 left-1/2 max-h-full w-[80vw] md:w-[50vw] xl:w-[30vw] translate-x-[-50%] translate-y-[-50%] 
            shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px]
            focus:outline-none"
            >
            <Dialog.Title>
                <h1 className="text-2xl md:text-3xl xl:text-4xl tracking-wider">
                Matchmaking Queue
                </h1>
            </Dialog.Title>
            <PiSpinnerGap className="animate-spin w-14 h-14 xl:w-20 xl:h-20 fill-secondary" />
            <Dialog.Close asChild>
                <button className="px-4 py-1 xl:px-6 xl:py-2 border xl:border-2  border-danger rounded-xl font-bold text-danger focus:outline-none">
                Cancel
                </button>
            </Dialog.Close>
            </Dialog.Content>
        </Dialog.Portal>
        </Dialog.Root> */}
    </>
  )
}

export default MatchMaking