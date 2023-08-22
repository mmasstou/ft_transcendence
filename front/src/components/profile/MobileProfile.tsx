import CoverUpload from '@/components/profile/CoverUpload';
import AvatarProfile from '@/components/profile/AvatarProfile';
import { UserInfo } from '@/components/profile/UserInfo';
import { UserStats } from '@/components/profile/UserStats';
import { Navbar } from '@/components/profile/Navbar';
import { userType } from '@/types/types';

interface Props {
  user: userType | null;
}

export const MobileProfile: React.FC<Props> = ({ user }): JSX.Element => {
  return (
    <div className="flex flex-col ">
      <div className="bg-[#243230]">
        <CoverUpload />
        <AvatarProfile
          position="left-[7vw] top-[-5vh] w-[100px] h-[100px] border-2 rounded-full border-secondary"
          score="text-[0.875em] font-bold  h-[26px] w-[26px]"
        />
        <UserInfo user={user} />
        <UserStats user={user} />
      </div>
      <Navbar mobile={true} style="" />
    </div>
  );
};
