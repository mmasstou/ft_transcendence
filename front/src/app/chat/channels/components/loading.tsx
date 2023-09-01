// components/Loading.js
import "@/app/chat/channels/styles/Loading.css"
interface LoadingProps {
  size?: number;
  color?: string;
  avatar?: boolean;
  chat?: boolean;
  message?: string;
  mode?: string;
  background?: boolean;
  height?: string;
  auto ?: boolean
}
const Loading = (props: LoadingProps) => {
  let bt: string = 'border-t-secondary border-[3px] border-solid border-white rounded-[50%]'
  let size: string = props.size ? ` h-[${props.size}] w-[${props.size}]`  : 'h-[65px] w-[65px]'
  if (props.mode === 'time') bt = 'border-t-[#FFCC00] border-[3px] border-solid border-white rounded-[50%] '
  let background: string = props.background ? 'bg-[#161F1E]' : ''
  const height: string = props.height ? props.height : 'h-[20vh]'

  return (
    <div className={`flex flex-col gap-4 justify-center items-center relative ${background} 
    ${props.avatar ? 'h-[20vh]' : props.chat ? 'h-[32vh]' : 'h-[100vh]'}`}>
      <div className={`spinner w-[65px] h-[65px] ${bt && bt}`}></div>
      <span className="text-white">{props.message && props.message}</span>
    </div>
  );
};

export default Loading;