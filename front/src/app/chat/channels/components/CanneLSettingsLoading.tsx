// components/Loading.js
import "@/app/chat/channels/styles/Loading.css"
const Loading = () => {
    return (
      <div className="loadingsettings flex flex-col gap-4">
        <div className="spinner"></div>
        <span className="text-white">Waiting for data ....</span>
      </div>
    );
  };
  
  export default Loading;