'use client'

import { useState } from "react"
import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form"

interface InputProps {
    id: string
    lable: string
    type?: string
    disabled?: boolean
    required?: boolean
    register: UseFormRegister<FieldValues>
    errors: FieldErrors,
    onChange : (event : any) => void;

}

const Input: React.FC<InputProps> = ({
    id,
    lable,
    type = 'text',
    disabled,
    required,
    register,
    errors,
    onChange
}) => {
    const [inputValue, setInputValue] = useState("");
    return (
        <div className=" relative w-full">
            <input
                id={id}
                {...register(id, { required })}
                placeholder=" "
                type={type}
                value={inputValue}
                onChange={(e) => {
                    setInputValue(e.target.value)
                    onChange(e)
                }}
                disabled={disabled}
                required
                className={`
             peer w-full pl-3 pt-6 text-xl bg-transparent text-white border text-[var(--white)] focus:bg-transparent font-light   rounded-md outline-none transition disabled:opacity-70 disabled:cursor-not-allowed
             ${errors[id] ? ' border-rose-500 focus:border-rose-500' : ' border-ç focus:border-teal-500'}`}
            />
            <label htmlFor=""
                className={`
                text-[var(--white)]
                absolute
                text-md
                duration-150
                transform
                -translate-x-3
                top-5
                z-10
                origin-[0]
                left-7
                peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0
                peer-focus:scale-75 peer-focus:-translate-y-4
                ${(inputValue.length !== 0 || !inputValue) ? 'scale-75 -translate-y-4':''}
                ${errors[id] ? 'text-rose-500':'text-zinc-500'}
                `}>
                {lable}
            </label>
        </div>
    );
}

export default Input;