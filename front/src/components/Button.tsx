"use client"
import styles from "./style"

interface Btn {
  login: boolean, 
  style: string,
  title: string
}

const Button = ({login, style, title}: Btn) => {
  
  return (
    <div className={` w-full lg:flex lg:justify-start xl:flex xl:flex-start`}>
      {login ? (
        <button type="button" className={`rounded-full text-btn bg-secondary
                ${style} w-[100px] h-[32px] lg:w-[120px] lg:h-[42px] mr-6 mt-5`} >
            {title}
        </button>
      ) : (
        <button type="button" className={`rounded-full ${style}  
                w-[170px] h-[42px] mr-6 mt-5 mb-10`} >
            {title}
        </button>
      )}
    </div>
  )
}

export default Button
