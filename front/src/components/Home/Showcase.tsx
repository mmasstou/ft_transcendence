'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import data from '../../../public/lotties/show.json';
import Button from './CTA';
import styles from './style';
import { useRouter } from 'next/navigation';
import Lottie from 'react-lottie-player';

const Showcase = () => {
  const router = useRouter();
  const AnimatedImage = motion(Image);

  return (
    <div>
      <section
        className={`${styles.paddingY} ${styles.flexCenter} flex-1  flex-col lg:flex-row  
              sm:py-16  p-5 `}
      >
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          className={`${styles.flexCenter} flex-col text-center ml-5 z-1`}
        >
          <h1 className={` ${styles.heading} md:text-[45px] mb-4`}>Showcase</h1>
          <p className={`${styles.paragraph} md:text-[18px] mb-4 `}>
            Experience the thrill of table tennis with our fast-paced,
            hyper-realistic game. Compete with friends and climb the leader
            boards to become a champion.
          </p>
          <Button
            OnClick={() => {
              router.push(`${process.env.NEXT_PUBLIC_API_URL}/auth/callback`);
            }}
            login={false}
            style="text-secondary bg-transparent border border-secondary 
                        hover:bg-secondary hover:text-btn"
            title="Let’t play now"
          />
        </motion.div>

        <div className="ml-4 relative">
          <motion.div
            initial={{
              x: 200,
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
          <div className="absolute z-[3] right-20 top-0 w-[50%] h-[50%] rounded-full white__gradient" />
          <div className="absolute z-[0] right-20 bottom-20 w-[50%] h-[50%] rounded-full pink__gradient" />
        </div>
      </section>
    </div>
  );
};

export default Showcase;
