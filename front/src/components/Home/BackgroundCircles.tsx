import React from 'react';
import { motion } from 'framer-motion';

const BackgroundCircles = () => {
  return (
    <motion.div
      initial={{
        opacity: 0,
      }}
      animate={{
        scale: [0.5, 0.8, 1, 1, 0.8],
        opacity: [0.1, 0.2, 0.4, 0.8, 0.6, 0.4],
        radius: ['20%', '20%', '50%', '80%', '20%'],
      }}
      transition={{
        duration: 2.5,
      }}
      className="relative flex justify-center items-center md:flex-col sm:flex-col  sm:mt-50"
    >
      <div
        className=" absolute    -[#c3c3c3] rounded-full h-[170px] w-[170px] lg:h-[200px] lg:w-[200px] 
            xl:h-[200px] xl:w-[200px] lg:ml-[750px] xl:ml-[900px] md:mt-[500px]  mt-[600px] lg:mt-[500px]  xl:mb-[450px] lg:mb-[450px]"
      />

      <div
        className="absolute    -[#c3c3c3] rounded-full h-[220px] w-[220px] lg:h-[300px] lg:w-[300px] 
            xl:h-[300px] xl:w-[300px] lg:ml-[750px] xl:ml-[900px] animate-ping  mt-[600px] lg:mt-[500px]  xl:mb-[450px] lg:mb-[450px]"
      />

      <div
        className="absolute    -[#c3c3c3] rounded-full h-[420px] w-[420px] lg:h-[500px] lg:w-[500px] 
            xl:h-[500px] xl:w-[500px] lg:ml-[750px] xl:ml-[900px]  mt-[600px] lg:mt-[500px]  xl:mb-[450px] lg:mb-[450px]"
      />

      <div
        className="absolute    -secondary opacity-20 rounded-full lg:h-[650px] lg:w-[650px] 
            xl:h-[650px] xl:w-[650px] h-[570px] w-[570px] lg:ml-[750px] xl:ml-[900px]  mt-[600px] lg:mt-[500px]
            xl:mb-[450px] lg:mb-[450px]  animate-pulse"
      />

      <div
        className="absolute    -[#c3c3c3] rounded-full lg:h-[800px] lg:w-[800px] xl:h-[800px] xl:w-[800px]
             xl:mb-[450px] lg:mb-[450px]  h-[650px] w-[650px] lg:ml-[750px] xl:ml-[900px]  mt-[600px] lg:mt-[500px] "
      />
    </motion.div>
  );
};

export default BackgroundCircles;
