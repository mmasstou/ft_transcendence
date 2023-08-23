// components/Loading.js
import "@/app/chat/channels/styles/Loading.css"
const Loading = (props: { message?: string, mode?: string }) => {
  let bt: string = 'border-t-secondary'
  if (props.mode === 'time') bt = 'border-t-[#FFCC00]'
  return (
    <div className="loadingsettings flex flex-col gap-4">
      <div className={`spinner ${bt && bt}`}></div>
      <span className="text-white">{props.message && props.message}</span>
    </div>
  );
};

export default Loading;