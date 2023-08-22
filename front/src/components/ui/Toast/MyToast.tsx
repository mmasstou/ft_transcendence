import React from 'react';
import toast, { Toast } from 'react-hot-toast';

interface toastProps {
  t: Toast;
  user: string;
  message: string;
  OnAccept: () => void;
  OnDeny: () => void;
}

const Invitation: React.FC<toastProps> = (props: toastProps) => {
  const handleAccept = (e: React.MouseEvent<HTMLButtonElement>, t: Toast) => {
    e.preventDefault();
    toast.dismiss(t.id);
    props.OnAccept()
  };
  const handleDeny = (e: React.MouseEvent<HTMLButtonElement>, t: Toast) => {
    e.preventDefault();
    toast.dismiss(props.t.id)
    props.OnDeny()
  }
  return (
    <div className="flex flex-col items-center gap-4 my-2">
      <p>
        <span className="text-secondary">{props.user} </span> {props.message}
      </p>
      <div className="flex justify-between w-full gap-2">
        <button
          onClick={(e) => handleDeny(e, props.t)}
          className="border border-[D9D9D9] w-1/2 rounded-md text-white"
        >
          Deny
        </button>
        <button
          onClick={(e) => handleAccept(e, props.t)}
          className="bg-secondary w-1/2 rounded-md"
        >
          Accept
        </button>
      </div>
    </div>
  );
};

interface toastInfo {
  isOpen: boolean;
  user: string;
  message: string;
  OnAccept: () => void
  OnDeny: () => void;
}

const MyToast: React.FC<toastInfo> = (props: toastInfo) => {
  if (props.isOpen === false) return null;
  toast((t) => <Invitation OnAccept={props.OnAccept} OnDeny={props.OnDeny} t={t} user={props.user} message={props.message} />, {
    style: {
      background: '#2B504B',
      color: '#ffffff',
      zIndex: '1000',
      width: '380px',
      
    },
    duration: 8000,
    position: 'top-left',
  });
  return <>{toast}</>;
};

export default MyToast;
