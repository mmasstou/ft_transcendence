import Image from 'next/image';
import Button from './Button'
import styles from './style';
import table from '../../public/table.svg'

const Hero = () => {
  return (
    <section className={`${styles.flexCenter} ${styles.paddingY} flex-1  flex-col lg:flex-row  
              md:p-5 sm:mt-10 mt-10 lg:mt-0`}>
        <div className={`lg:py-[200px] ${styles.flexCenter} flex-col text-center ml-5 
                 z-1 `}>
            <h1 className={` ${styles.heading} md:text-[45px] mb-4`}>
                Get Your Paddle <br/>Ready
            </h1>
            <p className={`${styles.paragraph} md:text-[18px] mb-4`}>
            Experience the thrill of table tennis with our fast-paced, hyper-realistic game. 
            Compete with friends and climb the leader boards to become a champion.
            </p>
            <Button login={false} style="text-btn hover:text-white bg-secondary " title="Get Started Now" />
        </div>

        <div>
        <Image
        className="object-fit"
          src={table}
          alt="ping pong tabe image"
        />
        </div>
    </section>
  )
}

export default Hero
