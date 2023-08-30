'use client';
import ContactHook from '@/hooks/contactHook';
import { TiArrowMinimise } from 'react-icons/ti';
import {
  RegisterOptions,
  FieldValues,
  UseFormRegisterReturn,
  useForm,
  SubmitHandler,
  useFieldArray,
  set,
} from 'react-hook-form';
import { ChangeEvent, MouseEvent, useEffect, useState } from 'react';
import { userType } from '@/types/types';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

import ChanneLModal from './channel.modal';
import ChanneLcreatemodaLHook from '../hooks/channel.create.hook';
import ChanneLmodaLheader from '../components/channel.modal.header';
import Input from '@/components/Input';
import getUserWithId from '../actions/getUserWithId';
import Button from '../../components/Button';
import { RiGitRepositoryPrivateFill } from 'react-icons/ri';
import { MdOutlinePublic } from 'react-icons/md';
import { GrSecure, GrInsecure } from 'react-icons/gr';
import { GoEyeClosed } from 'react-icons/go';
import { HiLockClosed, HiLockOpen } from 'react-icons/hi';
import getUsers from '../actions/getUsers';
import { toast } from 'react-hot-toast';
import Select from '../../components/Select';
import React from 'react';

const ChanneLCreateModaL = () => {
  const { IsOpen, onClose, onOpen, socket, selectedFriends } =
    ChanneLcreatemodaLHook();
  const route = useRouter();
  const [aLLfriends, setfriends] = useState<any[] | null>(null);
  const [userId, setuserId] = useState<userType | null>(null);
  const [InputValue, setInputValue] = useState('');
  const [IsLoading, setIsLoading] = useState<boolean>(false)
  const [channeLnameInput, setchanneLnameInput] = useState<string>('')
  const [channeLpasswordInput, setchanneLpasswordInput] = useState<string>('')


  IsOpen && (document.body.style.display = 'hidden');
  let users: any[] = [];
  useEffect(() => {
    (async function getFriends() {
      const token: any = Cookies.get('token');
      const User_ID: string | undefined = Cookies.get('_id');
      const resp = await getUsers(token);
      const _list = resp && resp.filter((user: any) => user.id !== User_ID);
      setfriends(_list);
    })();
    
  }, []);
  
  React.useEffect(() => {
    socket?.on(`${process.env.NEXT_PUBLIC_SOCKET_EVENT_RESPONSE_CHAT_CREATE}`, (room: any) => {
      if (!room.OK) {
        toast(room.message)
        return
      }
      route.push(`/chat/channels/${room.data.slug}`)
      onClose()
    })
  }, [socket]);

  type formValues = {
    channel_name: string;
    friends: userType[];
    channeLpassword: string;
    channeLtype: string;
  };

  const {
    control,
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      channeLname: '',
      friends: selectedFriends,
      channeLpassword: '',
      channeLtype: "PUBLIC",
    },
  });

  const friends = watch('friends');
  const channeLname = watch('channeLname');
  const channeLpassword = watch('channeLpassword');
  const _channeLtype = watch('channeLtype');

  // Argument of type 'string' is not assignable to parameter of type '"channel_name" | "friends" | `friends.${number}` | `friends.${number}.id` | `friends.${number}.login` | `friends.${number}.email` | `friends.${number}.password` | `friends.${number}.first_name` | `friends.${number}.last_name` | `friends.${number}.kind` | `friends.${number}.image` | `friends.${number}.is_active`
  const setcustomvalue = (key: any, value: any) => {
    setValue(key, value, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const resetALL = () => {
    reset();
    setchanneLnameInput('');
    setchanneLpasswordInput('')

  }
  const onSubmit: SubmitHandler<FieldValues> = async (Data: any) => {
    // create private room : createroom

    const token: any = Cookies.get('token');
    const User_ID: string | undefined = Cookies.get('_id');

    const LoginUser = User_ID && await getUserWithId(User_ID, token)
    LoginUser.role = "OWNER"
    let _friends: any[] = []

    // get friends data :
    for (let i = 0; i < Data.friends.length; i++) {
      const __friends = await getUserWithId(Data.friends[i].value, token);
      __friends.role = "USER"
      _friends.push(__friends)
    }
    _friends.push(LoginUser)
    console.log('NEXT_PUBLIC_SOCKET_EVENT_CHAT_CREATE :', Data)
    resetALL()
    socket?.emit(`${process.env.NEXT_PUBLIC_SOCKET_EVENT_CHAT_CREATE}`, {
      name: Data.channeLname,
      friends: _friends,
      type: Data.channeLtype,
      channeLpassword: Data.channeLpassword
    });
  }

  const onChangeChanneLname = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault()
    setValue('channeLname', event.target.value)
    setchanneLnameInput(event.target.value)
  }

  const onChangeChanneLpassword = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault()
    setValue('channeLpassword', event.target.value)
    setchanneLpasswordInput(event.target.value)
  }

  if (IsLoading) {
    toast.loading("fitching dependencies ... !")

  }
  const bodyContent = (
    <div className="  w-full p-4 md:p-6 flex flex-col justify-between min-h-[34rem]">
      <div className="body flex flex-col gap-4">
        <div className=" relative w-full">
          <input

            id={'channeLname'}
            {...register('channeLname', { required: true })}
            placeholder=" "
            type={'text'}
            value={channeLnameInput}
            onChange={onChangeChanneLname}
            disabled={IsLoading}
            className={` text-white peer w-full p-2 pt-6 text-xl bg-transparent text-[var(--white)] focus:bg-transparent font-light border rounded-md outline-none transition disabled:opacity-70 disabled:cursor-not-allowed ${errors['channeLname'] ? 'border-rose-500 focus:border-rose-500' : 'border-neutral-300 focus:border-secondary'}`}
          />
          <label htmlFor="" className={`capitalize text-[var(--white)] absolute text-md duration-150 transform -translate-x-3 top-5 z-10 origin-[0] left-7 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 ${(channeLname.length !== 0 || !channeLname) ? 'scale-75 -translate-y-4' : ''} ${errors['channeLname'] ? 'text-rose-500' : 'text-zinc-500'}`}>channel name</label>
        </div>
        <div className="flex flex-col gap-3">
          <h1 className=" text-[#ffffffb9] text-xl font-bold capitalize">channel type </h1>
          <div className=" w-full flex flex-row justify-between items-center ">

            <Button
              icon={HiLockOpen}
              label={"public"}
              outline
              showLabeL
              IsActive={_channeLtype === "PUBLIC"}
              onClick={() => { setcustomvalue("channeLtype", "PUBLIC") }}
            />
            <Button
              icon={GoEyeClosed}
              label={"private"}
              outline
              showLabeL
              IsActive={_channeLtype === "PRIVATE"}
              onClick={() => { setcustomvalue("channeLtype", "PRIVATE") }}
            />
            <Button
              icon={HiLockClosed}
              label={"protected"}
              outline
              showLabeL
              IsActive={_channeLtype === "PROTECTED"}
              onClick={() => { setcustomvalue("channeLtype", "PROTECTED") }}
            />
          </div>
        </div>
        {/* if protacted */}
        {_channeLtype === "PROTECTED" &&
          <div className=" relative w-full">
            <input

              id={'channeLpassword'}
              {...register('channeLpassword', { required: true })}
              placeholder=" "
              type={'password'}
              value={channeLpasswordInput}
              onChange={onChangeChanneLpassword}
              disabled={IsLoading}
              className={` text-white peer w-full p-2 pt-6 text-xl bg-transparent text-[var(--white)] focus:bg-transparent font-light border rounded-md outline-none transition disabled:opacity-70 disabled:cursor-not-allowed ${errors['channeLpassword'] ? 'border-rose-500 focus:border-rose-500' : 'border-neutral-300 focus:border-secondary'}`}
            />
            <label htmlFor="" className={` capitalize text-[var(--white)] absolute text-md duration-150 transform -translate-x-3 top-5 z-10 origin-[0] left-7 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 ${(channeLpassword.length !== 0 || !channeLpassword) ? 'scale-75 -translate-y-4' : ''} ${errors['channeLpassword'] ? 'text-rose-500' : 'text-zinc-500'}`}>channel password</label>
          </div>
        }
        {aLLfriends !== null && <Select
          disabled={false}
          lable={"Select Friends"}
          options={aLLfriends.map((friend) => ({
            value: friend.id,
            label: friend.login,
            role: "USER"
          }))}
          value={friends}
          onChange={(value: any) => {
            setValue('friends', value,
              { shouldValidate: true })
          }}
        />}
      </div>
      <div className="">
        <button onClick={handleSubmit(onSubmit)} className="text-white hover:text-black border border-secondary hover:bg-secondary text-sm font-bold capitalize px-7 py-3 rounded-[12px]  w-max">
          Create
        </button>
      </div>
    </div>
  );
  console.log("const ChanneLCreateModaL = ():", socket?.id)
  return (
    <ChanneLModal
      IsOpen={IsOpen}
      title={'create channel'}
      children={bodyContent}
      onClose={onClose}
    />
  );
};
export default ChanneLCreateModaL;
