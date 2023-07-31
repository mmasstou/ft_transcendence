'use client'
import { useRef, useState } from 'react';
import { RiSettingsLine } from 'react-icons/ri'
import axios , { AxiosError } from 'axios';
import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';
import AvatarUpload from './AvatarUpload'
import UserInput from './UserInput';
import * as Switch from '@radix-ui/react-switch';
import toast from 'react-hot-toast';


const Settings: React.FC = () => {
  
  const [isOpen, setOpen] = useState<boolean>(false);
  const [selectedFile, setFile] = useState<File | null>(null);
  // default will be user avatar rather than undefined
  const [imgProp, setImage] = useState<string | undefined>(undefined);
  // default will be intra username
  const [user, setUser] = useState<string>('');
  const [validName, setValidName] = useState<boolean>(false);
  // default will be fetched
  const [twoFa, setTwoFA] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleModal = () : void => {
        setOpen(!isOpen);
    }

    const fileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0])
      {
        const file = e.target.files[0];
        setFile(file);
        setImage(URL.createObjectURL(file));
      }
    }

    const fileUpload = async () : Promise<void> => {
      console.log(validName);
      if ((selectedFile === null && !twoFa && user === '') || ( !validName && user.length > 0) ) {
        toast('Couldn\'t save informations!', {
          style: {background: '#ff0e0e', color: "#FFFFFF"}
        });
        return;
      }
      const formData = new FormData();
      if (selectedFile){
        formData.append('avatar', selectedFile as Blob, selectedFile?.name);
      }
      formData.append('username', user);
      formData.append('twoFa', String(twoFa));
      try {
        const response = await axios.post('http://localhost:8080/file-upload', formData);
        toast(`Informations updated`, {
          style: {background: '#81c784', color: "#FFFFFF"}
        });

      } catch (error) {
        toast(`'Couldn\'t save informations! ${error}'`, {
          style: {background: '#ff0e0e', color: "#FFFFFF"}
        });
      }
      
    }

    const getUserInfo = (user: string, validName: boolean) : void => {
      setUser(user);
      setValidName(validName);
    }

    const handleTwoFa = () : void => {
      setTwoFA(!twoFa);
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
                  <div className=' p-4 m-4 flex flex-col justify-center items-center gap-6 md:gap-8 xl:gap-10'>
                    <div className='flex justify-between gap-6 md:gap-8 xl:gap-10 items-center'>
                         <div className='h-[60px] w-[60px]'><AvatarUpload image={imgProp} /></div>
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

                    <UserInput getUserInfo={getUserInfo }/>

                    <form>
                      <div className="flex items-center" style={{ display: 'flex', alignItems: 'center' }}>
                        <label className="text-white text-[20px] leading-none pr-[15px] font-bold" htmlFor="airplane-mode">
                          TWO-FACTOR AUTH
                        </label>
                        <Switch.Root
                          className="w-[42px] h-[25px] bg-blackA9 rounded-full relative shadow-[0_2px_10px] shadow-blackA7 
                              focus:shadow-[0_0_0_2px] focus:shadow-black data-[state=checked]:focus:shadow-secondary data-[state=checked]:bg-secondary outline-none cursor-default"
                          id="airplane-mode"
                          onClick={handleTwoFa}
                        >
                          <Switch.Thumb className="block w-[21px] h-[21px] bg-white rounded-full shadow-[0_2px_2px] shadow-blackA7 
                                          transition-transform duration-100 translate-x-0.5 will-change-transform 
                                            data-[state=checked]:translate-x-[19px]" />
                        </Switch.Root>
                      </div>
                    </form>

                    <Dialog.Close asChild>
                    <button
                        className='bg-transparent text-secondary border border-secondary 
                            px-[8px] w-[130px] h-[40px] font-normal rounded-lg text-[1.25em] hover:bg-secondary hover:text-white'
                        onClick={fileUpload}
                    >
                      CONFIRM
                    </button>
                    </Dialog.Close>
                </div>
          </Dialog.Content>
        </Dialog.Portal>    
      </Dialog.Root>
  );
}

export default Settings