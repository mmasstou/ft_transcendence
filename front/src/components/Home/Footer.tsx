import styles from "./style"
import { SocialIcon } from "react-social-icons"

const Footer = () => {
  return (
    <section className={`${styles.flexCenter} flex-col mb-10 `}>
      <div className="">
        <h1 className={`${styles.heading} `}>Transcendence</h1>
      </div>
      <div className="">
      <SocialIcon
            url='https://www.youtube.com/@AzedineOuhadou/'
            fgColor='#1EF0AE'
            bgColor='transparent'
        />
        <SocialIcon
            url='https://www.facebook.com/azdine.ohaddou'
            fgColor='#1EF0AE'
            bgColor='transparent'
        />
        <SocialIcon
            url='https://twitter.com/OuhadouAzedine'
            fgColor='#1EF0AE'
            bgColor='transparent'
        />
        <SocialIcon
            url='https://www.instagram.com/azedine_ouhadou/'
            fgColor='#1EF0AE'
            bgColor='transparent'
        />
        <SocialIcon
            url='https://github.com/mmasstou/ft_transcendence'
            fgColor='#1EF0AE'
            bgColor='transparent'
        />
        <SocialIcon
            url='https://www.behance.net/Xperaz'
            fgColor='#1EF0AE'
            bgColor='transparent'
        />
      </div>
      <div className="flex justify-center items-center text-center">
        <p className={`${styles.paragraph} `}>
        Copyright  &copy; 2023 Arcade Pong Game, All right reserved.
        </p>

      </div>
    </section>
  )
}

export default Footer
