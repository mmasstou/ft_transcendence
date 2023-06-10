'use client'
import Image from "next/image";
import logo from "../../../public/logo2.svg"
import Button from "./Button";
import { motion } from "framer-motion";

const Home_Header = () => {
  return (
    <header className="flex justify-between items-center  ">
      <motion.div
        initial={{
          x: -500,
          opacity: 0,
          scale: 0.5
        }}
        animate={{
          x: 0,
          opacity: 1,
          scale: 1,
        }}
        transition={{ duration: 1}}
      >
        <Image
            className="lg:top-[20px] lg:left-[33px] mt-4 left-2.5 w-[100px] h-[32px] 
                      lg:w-[250px] lg:h-[42px] ml-5"
            src={logo}
            width={100}
            height={100}
            alt="pong game logo"
            priority={false}
            
        />
      </motion.div>
      <motion.div
      initial={{
        x: 500,
        opacity: 0,
        scale: 0.5
      }}
      animate={{
        x: 0,
        opacity: 1,
        scale: 1,
      }}
      transition={{ duration: 1}}
      >
        <Button login={true} style="hover:text-white" title="Sign In" />
      </motion.div>
    </header>
  )
}

export default Home_Header
