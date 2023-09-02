import { InputProps } from '@/types/InputTypes';
import { FC } from 'react';
import { BiSearch } from 'react-icons/bi';

const SearchInput: FC<InputProps> = ({ label, ...props }) => {
  return (
    <div className=" flex flex-col bg-container outline-none border-none focus:outline-secondary rounded-lg w-[80%]">
      {label && <label htmlFor="name">Name</label>}
      <div className="flex px-2 p-1 xl:px-3 xl:p-2 items-center gap-2">
        <BiSearch className="fill-gray-300" size={18} />
        <input className="bg-transparent outline-none w-full" {...props} />
      </div>
    </div>
  );
};

export default SearchInput;
