"use client"
import Image from "next/image";
import styles from "./style";
import Button from "./Button";
import about  from "../../public/about.svg";

const About = () => {
    return (
        <section className={` ${styles.paddingY} ${styles.flexCenter} flex-1 flex-col md:p-5 
                        lg:flex-row-reverse xl:flex-row-reverse  mt-10`}>
            <div className={` ${styles.flexCenter} pl-4 flex-col text-center z-1`}>
                <h1 className={` ${styles.heading} md:text-[45px] mb-4`}>
                About Game
                </h1>
                <p className={`${styles.paragraph} md:text-[18px] mb-4`}>
                Ping pong, also known as table tennis, is a sport in which two or four players hit a lightweight ball back and forth over a table divided by 
                a net.
                </p>
                <Button login={false} style="text-secondary bg-transparent border border-secondary 
                        hover:bg-secondary hover:text-btn" title="Let’t play now" />
            </div>
    
            <div className={`${styles.flexStart} mr-10 lg:pr-10`}>
            <Image
              className="object-cover p-0 m-4"
              src={about}
              alt="ping pong tabe image"
            />
            </div>
        </section>
      )
}

export default About
