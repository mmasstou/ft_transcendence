'use client';
import React, { useEffect, useRef, useState } from 'react';
import { RiSettingsLine } from 'react-icons/ri';
import axios from 'axios';
import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';
import * as Switch from '@radix-ui/react-switch';
import toast from 'react-hot-toast';
import AvatarUpload from './AvatarUpload';
import { userType } from '@/types/types';
import Cookies from 'js-cookie';
import OtpModal from './OtpModal';
import { useRouter } from 'next/navigation';
export * from '@radix-ui/react-dialog';
import { FaTimes, FaInfoCircle, FaCheck } from 'react-icons/fa';

const USER_REGEX = /^[A-z][A-z0-9-_]{5,7}$/;

function getUserData(): userType | null {
  const [user, setUser] = useState<userType | null>(null);
  useEffect(() => {
    const jwtToken = Cookies.get('token');
    const userId = Cookies.get('_id');
    axios
      .get<userType | null>(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`,
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

interface Props {
  login: boolean;
}

const Settings: React.FC<Props> = ({ login }) => {
  const userData: userType | null = getUserData();
  const router = useRouter();

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
  // user input
  const userRef = useRef<HTMLInputElement>(null);
  const errRef = useRef<HTMLParagraphElement>(null);
  const [userFocus, setUserFocus] = useState<boolean>(false);
  const [errMsg, setErrMsg] = useState<string>('');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (userRef.current != null) {
      userRef.current.focus();
    }
  }, []);

  useEffect(() => {
    const result = USER_REGEX.test(user);
    setValidName(result);
  }, [user]);

  useEffect(() => {
    setErrMsg('');
  }, [user]);
  // end user input

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
      const fileSizeInMB = file?.size / (1024 * 1024);
      if (fileSizeInMB > 5) {
        toast.error('File size must be less than 5MB');
        return;
      }
      setFile(file);
      setAvatar(URL.createObjectURL(file));
    }
  };

  const fileUpload = async (): Promise<void> => {
    if (user === '' || (!validName && user.length > 0)) {
      if (!login) {
        toast.error("Couldn't save informations!");
      }
      if (login) {
        router.push('/profile');
        toast.success('Account created successfully!');
      }
      return;
    } else {
      try {
        const formData = new FormData();
        if (selectedFile !== null) {
          formData.append('file', selectedFile);
        }
        let postAvatar;
        if (selectedFile) {
          postAvatar = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/uploads/avatar`,
            formData,
            {
              headers: {
                Authorization: `Bearer ${jwtToken}`,
                'Content-Type': 'multipart/form-data',
              },
            }
          );
        }

        const userData = { login: user };
        const postLogin = await axios.patch(
          `${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`,
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
        if (avatarResponse?.status === 200 || loginResponse?.status === 200) {
          if (login) {
            router.push('/profile');
            toast.success('Account created successfully!');
          } else {
            toast.success('Informations saved!');
          }
        }
      } catch (error: any) {
        toast.error(error.message);
        console.clear();
      }
    }
    router.push('/profile');
  };

  const handleTwoFa = async (): Promise<void> => {
    const headers = {
      Authorization: `Bearer ${jwtToken}`,
      'Content-Type': 'application/json',
    };

    if (twoFa) {
      await axios
        .post(
          `${process.env.NEXT_PUBLIC_API_URL}/2fa/turn-off`,
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

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <>
      {!login ? (
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
                  // start user input
                  <div className="text-white md:w-1/2">
                    <p
                      ref={errRef}
                      className={
                        errMsg
                          ? 'bg-pink-300 text-red-700 font-bold p-1 mb-1'
                          : 'hidden'
                      }
                      aria-live="assertive"
                    >
                      {errMsg}
                    </p>
                    <form className="flex flex-col justify-evenly  grow-1 pb-1">
                      <label htmlFor="username">
                        <span
                          className={
                            validName ? 'text-secondary ml-1' : 'hidden'
                          }
                        >
                          <FaCheck />
                        </span>
                        <span
                          className={
                            validName || !user ? 'hidden' : 'text-red-500 ml-1'
                          }
                        >
                          <FaTimes />
                        </span>
                      </label>
                      <div className="flex flex-col justify-between gap-2 items-center">
                        <input
                          value={user}
                          placeholder="USERNAME"
                          className="bg-transparent border rounded-md px-2 outline-none w-full py-1"
                          type="text"
                          id="username"
                          ref={userRef}
                          autoComplete="off"
                          onChange={(e) => setUser(e.target.value)}
                          aria-invalid={validName ? 'false' : 'true'}
                          aria-describedby="uidnote"
                          onFocus={() => setUserFocus(true)}
                          onBlur={() => setUserFocus(false)}
                        />
                        <p
                          id="uidnote"
                          className={
                            userFocus && user && !validName
                              ? 'mr-1 text-[1em] font-light bg-black/50 px-3 py-2 rounded-md'
                              : 'hidden'
                          }
                        >
                          <FaInfoCircle />
                          6-8 characters. <br />
                          Only Letters, Numbers, Undersocores, Hyphen allwed.
                        </p>
                      </div>
                    </form>
                  </div>
                  // end user input
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
      ) : (
        // for editing profile in login page
        <Dialog.Root defaultOpen>
          <Dialog.Trigger asChild aria-controls="radix-:R1mcq:">
            <div className={`${login ? 'hidden' : ''}`}>
              <RiSettingsLine
                size={32}
                className="cursor-pointer hover:text-white text-[#E0E0E0]"
                onClick={handleModal}
              />
            </div>
          </Dialog.Trigger>
          {isMounted && (
            <Dialog.Portal container={document.body}>
              <Dialog.Overlay
                className="data-[state=open]:animate-overlayShow fixed inset-0 
                      w-screen h-screen bg-[#161F1E]/80 z-20"
              />
              <Dialog.Content
                onPointerDownOutside={(e) => e.preventDefault()}
                className={`data-[state=open]:animate-contentShow text-white rounded-lg bg-[#2B504B] p-6 absolute 
          top-[40%] left-[50%] max-h-full w-[80%] md:w-[60%] lg:w-[50%] xl:w-[40%] 2xl:w-[35%] translate-x-[-50%] lg:translate-x-[-50%] xl:translate-x-[-35%] translate-y-[-50%] 
          shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px]
          focus:outline-none z-50 `}
              >
                {openModal && (
                  <OtpModal setOpenModal={setOpenModal} setTwoFA={setTwoFA} />
                )}
                <Dialog.Title className="flex justify-center items-center">
                  Complete your profile
                </Dialog.Title>
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
                    // start user input
                    <div className="text-white md:w-1/2">
                      <p
                        ref={errRef}
                        className={
                          errMsg
                            ? 'bg-pink-300 text-red-700 font-bold p-1 mb-1'
                            : 'hidden'
                        }
                        aria-live="assertive"
                      >
                        {errMsg}
                      </p>
                      <form className="flex flex-col justify-evenly  grow-1 pb-1">
                        <label htmlFor="username">
                          <span
                            className={
                              validName ? 'text-secondary ml-1' : 'hidden'
                            }
                          >
                            <FaCheck />
                          </span>
                          <span
                            className={
                              validName || !user
                                ? 'hidden'
                                : 'text-red-500 ml-1'
                            }
                          >
                            <FaTimes />
                          </span>
                        </label>
                        <div className="flex flex-col justify-between gap-2 items-center">
                          <input
                            value={user}
                            placeholder="USERNAME"
                            className="bg-transparent border rounded-md px-2 outline-none w-full py-1"
                            type="text"
                            id="username"
                            ref={userRef}
                            autoComplete="off"
                            onChange={(e) => setUser(e.target.value)}
                            aria-invalid={validName ? 'false' : 'true'}
                            aria-describedby="uidnote"
                            onFocus={() => setUserFocus(true)}
                            onBlur={() => setUserFocus(false)}
                          />
                          <p
                            id="uidnote"
                            className={
                              userFocus && user && !validName
                                ? 'mr-1 text-[1em] font-light bg-black/50 px-3 py-2 rounded-md'
                                : 'hidden'
                            }
                          >
                            <FaInfoCircle />
                            6-8 characters. <br />
                            Only Letters, Numbers, Undersocores, Hyphen allwed.
                            If you use invalid username a default one will be
                            set.
                          </p>
                        </div>
                      </form>
                    </div>
                    // end user input
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
                  <button
                    className="bg-transparent text-secondary border border-secondary 
                            px-[8px] w-1/2 h-[40px] font-normal rounded-lg text-[1em] sm:text-[1.25em] hover:bg-secondary hover:text-white"
                    onClick={fileUpload}
                  >
                    CONFIRM
                  </button>
                  <button
                    onClick={() => {
                      router.push('/profile');
                    }}
                    className="text-[#D9D9D9] border-b-[2px]"
                  >
                    I will do it later
                  </button>
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          )}
        </Dialog.Root>
      )}
    </>
  );
};

export default Settings;
