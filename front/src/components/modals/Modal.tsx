'use client';
import { IoMdClose } from 'react-icons/io';

interface Props {
  isVisible: boolean;
  onClose: (isOpen: boolean) => void;
  children: React.ReactNode;
}

const Modal = ({ isVisible, onClose, children }: Props) => {
  if (!isVisible) return null;
  return (
    <div
      className={`fixed inset-0 bg-neutral-800/80  flex justify-center 
    md:items-center sm:items-center lg:py-[150px] z-50`}
    >
      <div
        className=" relative 
          max-w-[512px]
          min-w-[380px]
          w-full
          my-6
          mx-auto 
          h-full
          lg:h-auto
          md:h-auto"
      >
        <div
          className={`bg-[#243230] rounded-lg  p-8  mr-8 relative h-[500px]
                    xl:h-[800px] lg:h-[800px] md:mt-[-150px] small-device`}
        >
          <button onClick={() => onClose(true)} className="text-white text-xl ">
            <IoMdClose
              size={18}
              className="absolute top-0 right-0 m-4 bg-secondary rounded-full text-primary"
            />
          </button>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
