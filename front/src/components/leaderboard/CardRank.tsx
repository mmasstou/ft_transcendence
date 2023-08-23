import profile from '@/../public/profile.png';
import Image from 'next/image';
import { userType } from '@/types/types';

interface Props {
  user: userType | null;
  rank: number;
}

const CardRank: React.FC<Props> = ({ user, rank }) => {
  return (
    <div className="flex flex-col justify-center h-[7vh] md:h-[9vh] bg-[#3E504D] rounded-md mx-2 my-3 md:mx-9">
      <div className="flex flex-row justify-between items-center mx-2">
        <div className="flex flex-row justify-between items-center gap-6 mx-6">
          <span className="text-[1em] font-semibold sm:text-[1.3em] sm:font-bold">
            {rank}
          </span>
          <div className="flex flex-row items-center gap-1 md:gap-2">
            <Image
              className="w-[35px] h-[35px] rounded-full sm:w-[45px] sm:h-[45px] md:w-[60px] md:h-[60px]"
              src={user?.avatar ? user.avatar : ''}
              width={35}
              height={35}
              alt="leaderboard icon"
            />
            <h3 className="text-[0.7em] font-semibold sm:text-[1.2em] sm:font-bold md:text-[1.2em] md:font-bold">
              {user?.login}
            </h3>
          </div>
        </div>
        <div className="flex flex-row justify-start items-center gap-6 mx-3">
          <span className="text-[1em] font-semibold sm:text-[1.3em] sm:font-bold">
            {user?.TotalWin}
          </span>
          <span className="text-[1em] font-semibold sm:text-[1.3em] sm:font-bold">
            {user?.TotalLose}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CardRank;
