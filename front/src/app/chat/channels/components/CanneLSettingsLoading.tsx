// components/Loading.js
import "@/app/chat/channels/styles/Loading.css"
const Loading = (props: { message?: string }) => {
  return (
    <div className="loadingsettings flex flex-col gap-4">
      <div className="spinner"></div>
      <span className="text-white">{props.message ? props.message : 'Waiting for data ....'}</span>
    </div>
  );
};

export default Loading;