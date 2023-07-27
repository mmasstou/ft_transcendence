'use client'
import { useRef, useState } from 'react';
import { RiSettingsLine } from 'react-icons/ri'
import * as Avatar from '@radix-ui/react-avatar';
import style from '@/components/Home/style'
import profile from '@/../public/profile.png';
import axios from 'axios';
import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';



const AvatarUpload = () => {
  return (
    <Avatar.Root className={`${style.flexCenter} flex-inline align-middle overflow-hidden select-none
            rounded-full `}>
        <Avatar.Image
          className="w-[100%] h-[100%] object-cover rounded-[inherit] border-secondary"
          src={profile.src}
          alt="User Avatar"
        />
        <Avatar.Fallback className={`w-[100%] h-[100%] ${style.flexCenter} bg-white text-[15px] leanding-1 font-medium`} delayMs={600}>
          Avatar
        </Avatar.Fallback>
      </Avatar.Root>
  )
}


const Settings: React.FC = () => {
    const [isOpen, setOpen] = useState<boolean>(false);
    const [selectedFile, setFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleModal = () : void => {
        setOpen(!isOpen);
    }

    const fileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0])
      {
        const file = e.target.files[0];
        setFile(file);
      }
    }

    const fileUpload = async () => {
      if (selectedFile === null) {
        return;
      }
      const formData = new FormData()
      formData.append('myFile', selectedFile as Blob, selectedFile?.name)
      await axios.post('http://localhost:8080/file-upload', formData)
      .then(res => {
        console.log(res);
      })
    }

  return (
    <Dialog.Root>
        <Dialog.Trigger asChild>
          <RiSettingsLine size={32} className='cursor-pointer hover:text-white text-[#E0E0E0]' onClick={handleModal} />
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="data-[state=open]:animate-overlayShow fixed inset-0 
                        w-screen h-screen bg-[#161F1E]/80" />
          <Dialog.Content
            className="data-[state=open]:animate-contentShow text-white rounded-lg bg-[#2B504B] p-6 fixed top-[25%] left-[50%] max-h-full w-[80%] md:w-[60%] lg:w-[50%] xl:w-[40%] 2xl:w-[30%] translate-x-[-50%] lg:translate-x-[-45%] xl:translate-x-[-35%] translate-y-[-50%] 
          shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px]
          focus:outline-none z-50"
          >
            <Dialog.Title className="">Settings</Dialog.Title>
            <Dialog.Close asChild>
              <button className="text-white top-5 right-5 absolute">
                <Cross2Icon />
              </button>
            </Dialog.Close>
                  <div className=' p-4 m-4 flex flex-col justify-center items-center gap-6'>
                     <div className='flex justify-between gap-6 items-center'>
                         <div className='h-[60px] w-[60px]'><AvatarUpload /></div>
                         <input 
                             style={{display: 'none'}}
                             type="file" 
                             onChange={fileSelect}
                             ref={fileInputRef}
                         />
                         <button 
                           className='bg-[#939DA3] px-[8px] w-[130px] h-[40px] py-1 font-normal rounded-lg text-[1.25em]'
                           onClick={() => fileInputRef.current?.click()}
                         >
                             UPLOAD
                         </button>
                     </div>
                     <button 
                         className='bg-transparent text-secondary border border-secondary 
                               px-[8px] w-[130px] h-[40px] font-normal rounded-lg text-[1.25em]'
                         onClick={fileUpload}
                            >
                        CONFIRM
                    </button>
                </div>
          </Dialog.Content>
        </Dialog.Portal>    
      </Dialog.Root>
            
  );
}

export default Settings