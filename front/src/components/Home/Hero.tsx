'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import BackgroundCircles from './BackgroundCircles';
import Button from './CTA';
import styles from './style';
import { useRouter } from 'next/navigation';
import Lottie from 'react-lottie-player';
import data from '../../../public/lotties/hero.json';

const Hero = () => {
  const router = useRouter();

  return (
    <section
      className={`${styles.paddingY} ${styles.flexCenter} flex-col lg:flex-row  
              md:p-5 0 z-10`}
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
          OnClick={() => {
            router.push(`${process.env.NEXT_PUBLIC_API_URL}/auth/callback`);
          }}
          login={false}
          style="text-btn hover:text-white bg-secondary "
          title="Get Started Now"
        />
      </motion.div>
      <div className="flex flex-col md:flex-row justify-center items-center">
        <BackgroundCircles />
      </div>
      <div className="relative flex items-center justify-center">
        <motion.div
          className="z-[5] h-[500px] xl:h-[600px]"
          initial={{
            x: -200,
            opacity: 0,
          }}
          transition={{ duration: 1.2 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <Lottie
            loop
            animationData={data}
            play
            style={{ height: 600, width: 600 }}
          />
        </motion.div>
        <div className="absolute z-[1] w-[80%] h-[80%] rounded-full bottom-30 white__gradient overfolw-hidden" />
        <div className="absolute z-[0] w-[50%] h-[50%] right-20 bottom-20 blue__gradient overfolw-hidden" />
      </div>
    </section>
  );
};

export default Hero;
