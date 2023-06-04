import { type } from 'os';
import React from 'react'
import { motion } from 'framer-motion';

type Props = {};

const BackgroundCircles = () => {
  return (
    <motion.div
      initial={{
        opacity: 0,
      }}
      animate={{
        scale: [1, 1, 2, 3, 1],
        opacity: [0.1, 0.2, 0.4, 0.8, 0.6, 0.4],
        borderRadius: ["20%", "20%", "50%", "80%", "20%",]
      }}
      transition={{
        duration: 2.5,
      }}
      className="relative flex justify-center items-center">

      <div className=" absolute border border-tertiary rounded-full h-[200px] w-[200px] 
            ml-[700px] animate-ping" />
      <div className="absolute border border-tertiary rounded-full h-[300px] w-[300px] ml-[700px]  " />
      <div className="absolute border border-tertiary rounded-full h-[500px] w-[500px] ml-[700px]" />
      <div className="absolute border border-secondary opacity-20 rounded-full h-[650px] w-[650px] ml-[700px] animate-pulse" />
      <div className="absolute border border-tertiary rounded-full h-[800px] w-[800px] ml-[700px]" />
    </motion.div>
  )
}

export default BackgroundCircles;
