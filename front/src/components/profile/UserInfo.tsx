import { userType } from '@/types/types';

interface Props {
  user: userType | null;
}

export const UserInfo: React.FC<Props> = ({ user }): JSX.Element => {
  return (
    <div className="text-white flex flex-col justify-center items-center ml-[100px]">
      <h2 className="text-[1.75em] sm:text-[1.2em] font-bold">{user?.login}</h2>
      <div className="flex justify-center items-center">
        <h3 className="uppercase text-[#D9D9D9] text-[1.125] sm:text-[1em] font-bold pl-2">
          {user?.location ? user?.location : 'Unavailable'}
        </h3>
      </div>
    </div>
  );
};
