import { InputProps } from '@/types/InputTypes';
import { FC } from 'react';

const Input: FC<InputProps> = ({ label, icon, ...props }) => {
  return (
    <div className=" flex flex-col bg-container outline-none border-none focus:outline-secondary rounded-2xl">
      {label && <label htmlFor="name">Name</label>}
      <div className="flex px-2 p-1 items-center gap-2">
        {icon && <div className="">{icon}</div>}
        <input className="bg-transparent outline-none " {...props} />
      </div>
    </div>
  );
};

export default Input;
