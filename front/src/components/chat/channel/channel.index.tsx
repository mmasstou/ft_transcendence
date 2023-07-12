import { ReactNode } from "react";


interface ChanneLsInter {
    children: ReactNode
}
const ChanneLs: React.FC<ChanneLsInter> = ({ children }) => {
    return <div className=" relative  h-full flex flex-col gap-2">
        {children}
    </div>
}
export default ChanneLs;