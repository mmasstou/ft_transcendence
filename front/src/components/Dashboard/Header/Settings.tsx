'use client';
import { use, useEffect, useRef, useState } from 'react';
import { RiSettingsLine } from 'react-icons/ri';
import axios from 'axios';
import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';
import * as Switch from '@radix-ui/react-switch';
import toast from 'react-hot-toast';
import AvatarUpload from './AvatarUpload';
import UserInput from './UserInput';
import { userType } from '@/types/types';
import Cookies from 'js-cookie';
import OtpModal from './OtpModal';
export * from '@radix-ui/react-dialog';

function getUserData(): userType | null {
  const [user, setUser] = useState<userType | null>(null);
  useEffect(() => {
    const jwtToken = Cookies.get('token');
    const userId = Cookies.get('_id');
    axios
      .get<userType | null>(
        `${process.env.NEXT_PUBLIC_BASE_URL}api/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            'Content-Type': 'application/json',
          },
        }
      )
      .then((response) => {
        if (response.status === 200) {
          setUser(response.data);
        }
      })
      .catch((error) => {
        toast.error(error.message);
      });
  }, []);
  return user;
}

const Settings: React.FC = () => {
  // fetch user data
  const userData: userType | null = getUserData();

  const [jwtToken, setJwtToken] = useState<string | undefined>(
    Cookies.get('token')
  );
  const [userId, setUserId] = useState<string | undefined>(Cookies.get('_id'));
  const [isOpen, setOpen] = useState<boolean>(false);
  const [selectedFile, setFile] = useState<File | null>(null);
  const [avatar, setAvatar] = useState<string | undefined>(userData?.avatar);
  const [user, setUser] = useState<string>(userData?.login || '');
  const [validName, setValidName] = useState<boolean>(false);
  const [twoFa, setTwoFA] = useState<boolean | undefined>(userData?.twoFA);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [openModal, setOpenModal] = useState<boolean>(false);

  useEffect(() => {
    setJwtToken(Cookies.get('token'));
    setUserId(Cookies.get('_id'));
  }, []);

  const handleModal = (): void => {
    setOpen(!isOpen);
  };

  const fileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFile(file);
      setAvatar(URL.createObjectURL(file));
    }
  };

  const fileUpload = async (): Promise<void> => {
    if (
      (selectedFile === null && user === '') ||
      (!validName && user.length > 0)
    ) {
      toast.error("Couldn't save informations!");
      return;
    } else {
      try {
        const formData = new FormData();
        if (selectedFile !== null) {
          formData.append('file', selectedFile);
        }
        const postAvatar = await axios.post(
          `${process.env.NEXT_PUBLIC_BASE_URL}api/uploads/avatar`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        const userData = { login: user };
        const postLogin = await axios.patch(
          `${process.env.NEXT_PUBLIC_BASE_URL}api/users/${userId}`,
          userData,
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
              'Content-Type': 'application/json',
            },
          }
        );

        const [avatarResponse, loginResponse] = await axios.all([
          postAvatar,
          postLogin,
        ]);
        console.log('avatarResponse', avatarResponse);
        console.log('loginResponse', loginResponse);
      } catch (error: any) {
        toast.error(error.message);
      }
    }
  };

  const getUserInfo = (user: string, validName: boolean): void => {
    setUser(user);
    setValidName(validName);
  };

  const handleTwoFa = (): void => {
    const headers = {
      Authorization: `Bearer ${jwtToken}`,
      'Content-Type': 'application/json',
    };

    if (twoFa) {
      axios
        .post(
          `${process.env.NEXT_PUBLIC_BASE_URL}api/2fa/turn-off`,
          {},
          { headers }
        )
        .catch((err) => {
          toast.error(err.response.data.message);
          return;
        });
    } else {
      setOpenModal(true);
    }
    if (openModal) {
      setOpenModal(false);
    }
    setTwoFA(false);
  };

  useEffect(() => {
    setAvatar(userData?.avatar);
    setUser(userData?.login || '');
    setTwoFA(userData?.twoFA);
  }, [userData]);

  useEffect(() => {
    setTwoFA(twoFa);
  }, [twoFa]);

  return (
    <>
      <Dialog.Root>
        <Dialog.Trigger asChild aria-controls="radix-:R1mcq:">
          <div>
            <RiSettingsLine
              size={32}
              className="cursor-pointer hover:text-white text-[#E0E0E0]"
              onClick={handleModal}
            />
          </div>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay
            className="data-[state=open]:animate-overlayShow fixed inset-0 
                        w-screen h-screen bg-[#161F1E]/80 z-20"
          />

          <Dialog.Content
            className={`data-[state=open]:animate-contentShow text-white rounded-lg bg-[#2B504B] p-6 absolute 
            top-[40%] left-[50%] max-h-full w-[80%] md:w-[60%] lg:w-[50%] xl:w-[40%] 2xl:w-[35%] translate-x-[-50%] lg:translate-x-[-50%] xl:translate-x-[-35%] translate-y-[-50%] 
            shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px]
            focus:outline-none z-50 `}
          >
            {openModal && (
              <OtpModal setOpenModal={setOpenModal} setTwoFA={setTwoFA} />
            )}
            <Dialog.Title className="">Settings</Dialog.Title>
            <Dialog.Close asChild>
              <button className="text-white top-5 right-5 absolute">
                <Cross2Icon />
              </button>
            </Dialog.Close>
            <div className=" p-4 m-4 flex flex-col justify-center items-center gap-6 md:gap-8 xl:gap-10">
              <div className="flex justify-between gap-6 md:gap-8 xl:gap-10 items-center">
                <div className="h-[60px] w-[60px]">
                  <AvatarUpload image={avatar} />
                </div>
                <input
                  style={{ display: 'none' }}
                  type="file"
                  onChange={fileSelect}
                  ref={fileInputRef}
                />
                <button
                  className="bg-[#939DA3] px-[8px] w-[130px] h-[40px] py-1 font-normal rounded-lg text-[1.25em]"
                  onClick={() => fileInputRef.current?.click()}
                >
                  UPLOAD
                </button>
              </div>
              {!openModal && (
                <UserInput
                  getUserInfo={getUserInfo}
                  oldName={userData?.login}
                />
              )}

              <form>
                <div
                  className="flex items-center"
                  style={{ display: 'flex', alignItems: 'center' }}
                >
                  <label
                    className="text-white text-[20px] leading-none pr-[15px] font-bold"
                    htmlFor="airplane-mode"
                  >
                    TWO-FACTOR AUTH
                  </label>
                  {twoFa ? (
                    <Switch.Root
                      className="w-[42px] h-[25px] bg-blackA9 rounded-full relative shadow-[0_2px_10px] shadow-blackA7 
                      focus:shadow-[0_0_0_2px]  focus:shadow-secondary
                    bg-secondary outline-none cursor-default"
                      id="airplane-mode"
                      onClick={handleTwoFa}
                    >
                      <Switch.Thumb
                        className="block w-[21px] h-[21px] bg-white rounded-full shadow-[0_2px_2px] shadow-blackA7 
                                          transition-transform duration-100  will-change-transform 
                                            translate-x-[19px]"
                      />
                    </Switch.Root>
                  ) : (
                    <Switch.Root
                      className="w-[42px] h-[25px] bg-blackA9 rounded-full relative shadow-[0_2px_10px] shadow-blackA7
                      focus:shadow-[0_0_0_2px] focus:shadow-black
                      outline-none cursor-default"
                      id="airplane-mode"
                      onClick={handleTwoFa}
                    >
                      <Switch.Thumb
                        className="block w-[21px] h-[21px] bg-white rounded-full shadow-[0_2px_2px] shadow-blackA7
                      transition-transform duration-100 translate-x-0.5 will-change-transform
                      "
                      />
                    </Switch.Root>
                  )}
                </div>
              </form>
              <Dialog.Close asChild>
                <button
                  className="bg-transparent text-secondary border border-secondary 
                              px-[8px] w-1/2 h-[40px] font-normal rounded-lg text-[1em] sm:text-[1.25em] hover:bg-secondary hover:text-white"
                  onClick={fileUpload}
                >
                  CONFIRM
                </button>
              </Dialog.Close>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
};

export default Settings;
