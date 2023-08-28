'use client';
import { motion } from 'framer-motion';
import data from '../../../public/lotties/about.json';
import Button from './CTA';
import styles from './style';
import { useRouter } from 'next/navigation';
import Lottie from 'react-lottie';

const About = () => {
  const router = useRouter();

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: data,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };
  return (
    <section
      className={` ${styles.paddingY} ${styles.flexCenter}  flex-col md:p-5 
                        lg:flex-row-reverse xl:flex-row-reverse  mt-10 z-10`}
    >
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className={` ${styles.flexCenter} pl-4 flex-col text-center`}
      >
        <h1 className={` ${styles.heading} md:text-[45px] mb-4`}>About Game</h1>
        <p className={`${styles.paragraph} md:text-[18px] mb-4`}>
          Ping pong, also known as table tennis, is a sport in which two or four
          players hit a lightweight ball back and forth over a table divided by
          a net.
        </p>
        <Button
          OnClick={() => {
            router.push(`${process.env.NEXT_PUBLIC_API_URL}/auth/callback`);
          }}
          login={false}
          style="text-secondary bg-transparent  border border-secondary 
                        hover:bg-secondary hover:text-btn"
          title="Let’t play now"
        />
      </motion.div>

      <div className={`${styles.flexStart} mr-10 relative`}>
        <motion.div
          initial={{
            x: 200,
            opacity: 0,
          }}
          transition={{ duration: 1.2 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <Lottie options={defaultOptions} height={600} width={600} />
        </motion.div>
        <div className="absolute z-[3] -left-1/2 top-0 w-[50%] h-[50%] rounded-full white__gradient" />
        <div className="absolute z-[0] -left-1/2 bottom-0 w-[50%] h-[50%] rounded-full pink__gradient" />
      </div>
    </section>
  );
};

export default About;
