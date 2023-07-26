
import React from 'react';
import { BsArrowRightShort, BsSaveFill } from 'react-icons/bs';
import { CgEditFlipH } from 'react-icons/cg';
import { PiPassword } from "react-icons/pi";
import { TbEdit, TbUserCancel } from 'react-icons/tb';
import { VscGroupByRefType } from "react-icons/vsc";
import { Channel } from 'diagnostics_channel';
import ChanneLSettingsEditModaL from '../modaLs/channel.settings.edit.modal';
import Input from '@/components/Input';
import { RegisterOptions, FieldValues, UseFormRegisterReturn, useForm } from 'react-hook-form';
import Button from '../../components/Button';
import { IoChevronBackOutline, IoInformation, IoLogOut } from 'react-icons/io5';
import { GoEyeClosed } from 'react-icons/go';
import { HiLockClosed, HiLockOpen } from 'react-icons/hi';
import {TfiTimer } from 'react-icons/tfi';
import { FaChessQueen } from 'react-icons/fa';
interface ChanneLChatSettingsProps {

}

// create enum for channel type
enum SETTINGSTEPS {
    CHOICE = 0,
    EDITPASSWORD = 1,
    CHANGECHANNEL = 2,
}


export default function ChanneLChatSettings({ }: ChanneLChatSettingsProps) {
    const [step, setStep] = React.useState<SETTINGSTEPS>(SETTINGSTEPS.CHOICE)



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
            ChanneLpassword: "",
            newChanneLpassword: "",
            confirmChanneLpassword: "",
            channeLtype: ""
        },
    });
    const _channeLpassword = watch('ChanneLpassword')
    const _newChanneLpassword = watch('newChanneLpassword')
    const _confirmChanneLpassword = watch('confirmChanneLpassword')
    const _channeLtype = watch('channeLtype')
    const setcustomvalue = (key: any, value: any) => {
        setValue(key, value, { shouldValidate: true, shouldDirty: true, shouldTouch: true })
    }
    const OnEditPassword = () => {
        setStep(SETTINGSTEPS.EDITPASSWORD)
    }
    const OnChangeChannel = () => {
        setStep(SETTINGSTEPS.CHANGECHANNEL)
    }
    const OnBack = () => {
        setStep(SETTINGSTEPS.CHOICE)
    }


    let _body = (
      <div className="flex flex-col justify-between items-start min-h-[34rem] ">
          <div className="flex flex-col gap-2 w-full">
            <button
                onClick={() => {
                    console.log("change password")
                    OnEditPassword()
                }}
                className="flex flex-row justify-between items-center shadow p-2 rounded">
                <div className='flex justify-center items-center p-3 rounded bg-secondary text-white'>
                    <PiPassword size={28} />
                </div>
                <div>
                    <h2 className='text-white'>Change password</h2>
                </div>
                <div className='text-white'>
                    <BsArrowRightShort size={24} />
                </div>
            </button>

            <button
                onClick={() => {
                    console.log("change password")
                    OnChangeChannel()
                }}
                className="flex flex-row justify-between items-center shadow p-2 rounded">
                <div className='flex justify-center items-center p-3 rounded bg-secondary text-white'>
                    <CgEditFlipH size={32} />
                </div>
                <div>
                    <h2 className='text-white font-semibold capitalize'>Change Type</h2>
                </div>
                <div className='text-white'>
                    <BsArrowRightShort size={24} />
                </div>
            </button>
            <button
                onClick={() => {
                    console.log("Baned members")
                    OnChangeChannel()
                }}
                className="flex flex-row justify-between items-center shadow p-2 rounded">
                <div className='flex justify-center items-center p-3 rounded bg-secondary text-white'>
                    <TbUserCancel size={32} />
                </div>
                <div>
                    <h2 className='text-white font-semibold capitalize'>Baned members</h2>
                </div>
                <div className='text-white'>
                    <BsArrowRightShort size={24} />
                </div>
            </button>
            <button
                onClick={() => {
                    console.log("Baned members")
                    OnChangeChannel()
                }}
                className="flex flex-row justify-between items-center shadow p-2 rounded">
                <div className='flex justify-center items-center p-3 rounded bg-secondary text-white'>
                    <FaChessQueen size={32} />
                </div>
                <div>
                    <h2 className='text-white font-semibold capitalize'>set owner</h2>
                </div>
                <div className='text-white'>
                    <BsArrowRightShort size={24} />
                </div>
            </button>
            <button
                onClick={() => {
                    console.log("leave Channel")
                    OnBack()
                }}
                className="flex flex-row justify-between items-center shadow p-2 rounded">
                <div className='flex justify-center items-center p-3 rounded bg-isban text-white'>
                    <IoLogOut size={32} />
                </div>
                <div>
                    <h2 className='text-white font-semibold capitalize'>leave Channel</h2>
                </div>
                <div className='text-white'>
                    <BsArrowRightShort size={24} />
                </div>
            </button>
        </div>
        {/* <button
                onClick={() => {
                    console.log("leave Channel")
                    OnEditPassword()
                }}
                className="flex flex-row gap-6  items-center shadow p-1 rounded bg-isban px-4">
                <div className='flex justify-center items-center p-1 rounded text-white'>
                    <IoLogOut size={24} />
                </div>
                <div>
                    <h2 className='text-white'>leave Channel</h2>
                </div>
            </button> */}
      </div>

    )

    if (step === SETTINGSTEPS.EDITPASSWORD) {
        _body = (
            <div className="flex flex-col justify-between min-h-[34rem]">
               <div>
               <Button
                    icon={IoChevronBackOutline}
                    label={"Back"}
                    outline
                    onClick={OnBack}
                />

                <div className='flex flex-col gap-5 p-4'>
                    <Input id="ChanneLpassword" lable="password" type="password" register={register} errors={errors} onChange={() => { }} />
                    <Input id="newChanneLpassword" lable="new password" type="password" register={register} errors={errors} onChange={() => { }} />
                    <Input id="confirmChanneLpassword" lable="confirm password" type="password" register={register} errors={errors} onChange={() => { }} />
                </div>
               </div>
                <div className='flex flex-row justify-between items-center
               '>

                    <Button
                        label={"Save Changes"}
                        outline
                        onClick={() => { () => { } }}
                    />
                </div>
            </div>
        )
    }
    if (step === SETTINGSTEPS.CHANGECHANNEL) {
        _body = (
            <div className="flex flex-col justify-between min-h-[34rem]">
                <div>
                    <Button
                        icon={IoChevronBackOutline}
                        label={"Back"}
                        outline
                        onClick={OnBack}
                    />
                    <div className="flex flex-col gap-5 p-4">
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
                        {
                            _channeLtype === "PROTECTED"
                            && <div>
                                {/* <h1 className=" text-[#ffffffb9] text-xl font-bold capitalize">channel password </h1> */}
                                <Input
                                    onChange={(e: any) => { setcustomvalue(_channeLpassword, e.target.value) }}
                                    id={"ChanneLpassword"} lable={"ChanneLpassword"}
                                    register={register}
                                    type="password"
                                    errors={errors} />
                            </div>
                        }
                    </div>
                </div>
                <div className='flex flex-row justify-between items-center
               '>

                    <Button
                        label={"Save Changes"}
                        outline
                        onClick={() => { () => { } }}
                    />
                </div>
            </div>
        )
    }
    return <ChanneLSettingsEditModaL >
        {_body}
    </ChanneLSettingsEditModaL>
}