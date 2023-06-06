"use client"
import { useState } from "react"
import Modal from "../modals/Modal";
import styles from "./style";
import LoginButton from "./LoginButton";
import loginImg from "../../../public/login.png";
import Image from "next/image";

interface Btn {
  login: boolean, 
  style: string,
  title: string,
}

const Button = ({login, style, title}: Btn) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <>
      <div className={` w-full lg:flex lg:justify-start xl:flex xl:flex-start`}>
        {login ? (
          <button
                onClick={() => setIsOpen(true)} 
                type="button"
                className={`rounded-full text-btn bg-secondary
                  ${style} w-[100px] h-[32px] lg:w-[120px] lg:h-[42px] mr-6 mt-5`} >
              {title}
          </button>
          
        ) : (
          <button
            onClick={() => setIsOpen(true)}
            type="button" className={`rounded-full ${style}  
                  w-[170px] h-[42px] mr-6 mt-5 mb-10`} >
              {title}
          </button>
        )}
      </div>
       <Modal isVisible={isOpen} onClose={() => setIsOpen(false)} >
          <div className={`flex justify-center items-center flex-col xl:mt-[110px] lg:mt-[110px]`}>
            <h1 className={`${styles.heading2} text-secondary flex justify-center `}>Login</h1>
            <Image
              src={loginImg}
              width={250}
              height={500}
              alt="Login vector"
            />
            <p className={`${styles.paragraph} text-[11px] lg:text[16px] p-2`}>
              You can login via these option :
            </p>
            <LoginButton  label="Login With 42" />
          </div>
       </Modal>
    </>
  )
}

export default Button