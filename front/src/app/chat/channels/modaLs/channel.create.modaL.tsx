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
import { MouseEvent, useEffect, useState } from 'react';
import { userType } from '@/types/types';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

import ChanneLModal from './channel.modal';
import Select from '../../components/Select';
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

const ChanneLCreateModaL = () => {
  const { IsOpen, onClose, onOpen, socket, selectedFriends } =
    ChanneLcreatemodaLHook();
  const route = useRouter();
  const [aLLfriends, setfriends] = useState<any[] | null>(null);
  const [userId, setuserId] = useState<userType | null>(null);
  const [InputValue, setInputValue] = useState('');

  let users: any[] = [];
  useEffect(() => {
    (async function getFriends() {
      const token: any = Cookies.get('token');
      const User_ID: string | undefined = Cookies.get('_id');
      // if (!token)
      //     return;
      // await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
      //     headers: { Authorization: `Bearer ${token}`, },
      // }).then((resp) => resp.json()).then(data => {
      //     const _list =data && data.filter((user: any) => user.id !== User_ID)
      //     setfriends(_list)
      // })
      const resp = await getUsers(token);

      console.log('+++++++++++++++++++++await getUsers(token) :', resp);
      const _list = resp && resp.filter((user: any) => user.id !== User_ID);
      setfriends(_list);
    })();
  }, []);

  type formValues = {
    channel_name: string;
    friends: userType[];
    ChanneLpassword: string;
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
      channel_name: '',
      friends: selectedFriends,
      ChanneLpassword: '',
      channeLtype: '',
    },
  });

  const friends = watch('friends');
  const _channel_name = watch('channel_name');
  const _channeLpassword = watch('ChanneLpassword');
  const _channeLtype = watch('channeLtype');

  // Argument of type 'string' is not assignable to parameter of type '"channel_name" | "friends" | `friends.${number}` | `friends.${number}.id` | `friends.${number}.login` | `friends.${number}.email` | `friends.${number}.password` | `friends.${number}.first_name` | `friends.${number}.last_name` | `friends.${number}.kind` | `friends.${number}.image` | `friends.${number}.is_active`
  const setcustomvalue = (key: any, value: any) => {
    setValue(key, value, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const onSubmit: SubmitHandler<FieldValues> = async (UserId: any) => {
    // create private room : createroom
    setcustomvalue(_channel_name, "")
    reset();
    setInputValue("");

    const token: any = Cookies.get('token');
    const User_ID: string | undefined = Cookies.get('_id');

    const LoginUser = User_ID && await getUserWithId(User_ID, token)
    LoginUser.role = "OWNER"
    let _friends: any[] = []

    // get friends data :
    for (let i = 0; i < UserId.friends.length; i++) {
      const __friends = await getUserWithId(UserId.friends[i].value, token);
      __friends.role = "USER"
      _friends.push(__friends)
    }
    _friends.push(LoginUser)

    socket?.emit('createroom', {
      name: UserId.channel_name,
      friends: _friends,
      type: UserId.channeLtype,
      channeLpassword: UserId.ChanneLpassword
    },
      (response: any) => {
        console.log('join response : ', response)
      });
    socket?.on('createroomResponseEvent', (room: any) => {
      if (!room) return
      route.push(`/chat/channels?r=${room.id}`)
      onClose()
    })
  }

  const bodyContent = (

    <div className="  w-full p-4 md:p-6 flex flex-col justify-between min-h-[34rem]">

      <div className="body flex flex-col gap-4">

        <div className="body flex flex-col gap-2 py-4">
          <h1 className=" text-[#ffffffb9] text-xl font-bold capitalize">channel name </h1>
          <Input
            onChange={(e: any) => { setcustomvalue(_channel_name, e.target.value) }}
            id={"channel_name"} lable={"channel name"}
            register={register}

            errors={errors} />
        </div>
        <div className="flex flex-col gap-3">
          <h1 className=" text-[#ffffffb9] text-xl font-bold capitalize">channel type </h1>

          <div className=" w-full flex flex-row justify-between items-center ">
            <Button
              icon={GoEyeClosed}
              label={"private"}
              outline
              IsActive={_channeLtype === "PRIVATE"}
              onClick={() => { setcustomvalue("channeLtype", "PRIVATE") }}
            />
            <Button
              icon={HiLockClosed}
              label={"public"}
              outline
              IsActive={_channeLtype === "PUBLIC"}
              onClick={() => { setcustomvalue("channeLtype", "PUBLIC") }}
            />
            <Button
              icon={HiLockOpen}
              label={"protected"}
              outline
              IsActive={_channeLtype === "PROTECTED"}
              onClick={() => { setcustomvalue("channeLtype", "PROTECTED") }}
            />
          </div>
        </div>
        {/* if protacted */}
        {_channeLtype === "PROTECTED" && <div>
          <h1 className=" text-[#ffffffb9] text-xl font-bold capitalize">channel password </h1>
          <Input
            onChange={(e: any) => { setcustomvalue(_channeLpassword, e.target.value) }}
            id={"ChanneLpassword"} lable={"ChanneLpassword"}
            register={register}
            type="password"
            errors={errors} />
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
