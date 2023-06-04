"use client"
import Image from "next/image";
import styles from "./style";
import Button from "./Button";
import show  from "../../public/show.svg";

const Showcase = () => {
  return (
    <div>
      <section className={`${styles.paddingY} ${styles.flexCenter} flex-1  flex-col lg:flex-row  
              sm:py-16  p-5 sm:mt-4 md:mt-4  mt-10`}>
        <div className={`${styles.flexCenter} flex-col text-center ml-5 z-1`}>
            <h1 className={` ${styles.heading} md:text-[45px] mb-4`}>
            Showcase
            </h1>
            <p className={`${styles.paragraph} md:text-[18px] mb-4 `}>
            Experience the thrill of table tennis with our fast-paced, hyper-realistic game. 
            Compete with friends and climb the leader boards to become a champion.
            </p>
            <Button login={false} style="text-secondary bg-transparent border border-secondary 
                        hover:bg-secondary hover:text-btn" title="Let’t play now"/>
        </div>

        <div className="ml-4 ">
        <Image
          className=""
          src={show}
          alt="ping pong tabe image"
          width={700}
          height={500}
        />
        </div>
    </section>
    </div>
  )
}

export default Showcase
