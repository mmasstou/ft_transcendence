import Image from 'next/image';
import { userType } from '@/types/types';
import { useState } from 'react';
import PublicProfile from '../public_profile/PublicProfile';
import Cookies from 'js-cookie';

interface Props {
  user: userType | null;
  rank: number;
}

const CardRank: React.FC<Props> = ({ user, rank }) => {
  const [showPublicProfile, setPublicProfile] = useState<boolean>(false);
  const userId = Cookies.get('_id');

  const handlePublicProfile = () => {
    if (user?.id === userId) {
      setPublicProfile(false);
    } else {
      setPublicProfile(!showPublicProfile);
    }
  };

  return (
    <>
      {showPublicProfile && (
        <PublicProfile
          userId={user?.id}
          handlePublicProfile={handlePublicProfile}
        />
      )}
      {showPublicProfile && (
        <div className="w-[100%] h-[100%] bg-black/60 absolute top-0 left-0 z-50" />
      )}
      <div
        className={`flex flex-col justify-center lg:h-[8vh] bg-[#3E504D] rounded-md mx-2 my-3 md:mx-9`}
      >
        <div className="flex flex-row justify-between items-center mx-2">
          <div className="flex flex-row justify-between items-center gap-5 mx-5">
            <span className="text-[1em] font-semibold sm:text-[1.3em] sm:font-bold">
              {rank}
            </span>
            <div className="flex flex-row items-center gap-1 md:gap-2 h-[10vh] w-full">
              <div className="relative w-12 h-12">
                <Image
                  onClick={handlePublicProfile}
                  className={` rounded-full  ${
                    user?.id === userId
                      ? 'cursor-not-allowed'
                      : 'cursor-pointer'
                  } border border-secondary`}
                  src={user?.avatar ? user.avatar : ''}
                  sizes="100vh 100vw"
                  fill={true}
                  alt="leaderboard icon"
                  priority
                />
              </div>
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
              {user?.Level}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default CardRank;
