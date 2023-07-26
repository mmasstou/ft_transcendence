'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import table from '../../../public/table.svg';
import BackgroundCircles from './BackgroundCircles';
import Button from './CTA';
import styles from './style';

const Hero = () => {
  const AnimatedImage = motion(Image);

  return (
    <section
      className={`${styles.paddingY} ${styles.flexCenter} flex-col lg:flex-row  
              md:p-5 sm:mt-10 mt-10 lg:mt-0 z-10`}
    >
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className={`lg:py-[200px] ${styles.flexCenter} text-center flex-col  ml-5
          lg:ml-[60px] xl:ml-[80px] ${styles.paddingX}`}
      >
        <h1 className={` ${styles.heading} md:text-[45px] mb-4 `}>
          Get Your Paddle <br />
          Ready
        </h1>
        <p className={`${styles.paragraph} md:text-[18px] mb-4`}>
          Experience the thrill of table tennis with our fast-paced,
          hyper-realistic game. Compete with friends and climb the leader boards
          to become a champion.
        </p>
        <Button
          login={false}
          style="text-btn hover:text-white bg-secondary "
          title="Get Started Now"
        />
      </motion.div>
      <div className="flex justify-center items-center ">
        <BackgroundCircles />
      </div>
      <div className="relative lg:m-[100px] xl:m-[120px] flex items-center justify-center">
        <AnimatedImage
          className="object-fit z-[5]"
          src={table}
          initial={{ opacity: 0, x: 1 }}
          animate={{ opacity: 1, x: 0, x1: -50, x2: 0 }}
          transition={{ duration: 1.5 }}
          alt="ping pong tabe image"
          width={500}
          height={500}
          priority={false}
        />
        <div className="absolute z-[1] w-[80%] h-[80%] rounded-full bottom-30 white__gradient overfolw-hidden" />
        <div className="absolute z-[0] w-[50%] h-[50%] right-20 bottom-20 blue__gradient overfolw-hidden" />
      </div>
    </section>
  );
};

export default Hero;
