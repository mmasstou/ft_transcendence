import CoverUpload from '@/components/profile/CoverUpload';
import { Navbar } from '@/components/profile/Navbar';
import { Statis } from '@/components/profile/UserStats';
import MyAvatar from './MyAvatar';
import { userType } from '@/types/types';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';

interface Props {
  user: userType | null;
}

function getUserData(): userType | null {
  const [user, setUser] = useState<userType | null>(null);

  useEffect(() => {
    const jwtToken = Cookies.get('token');
    const userId = Cookies.get('_id');
    axios
      .get<userType | null>(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            'Content-Type': 'application/json',
          },
        }
      )
      .then((response) => {
        if (response.status === 200) {
          setUser(response.data);
        }
      })
      .catch((error) => {
        console.log(error);
        return null;
      });
  }, []);
  return user;
}

export const DesktopProfile = (): JSX.Element => {
  const userData = getUserData();
  return (
    <div className="flex flex-col gap-10 mx-[20px]">
      <div className="bg-[#243230] relative rounded-[20px] max-h-[333px]">
        <CoverUpload />
        <div className="absolute w-[150px] h-[150px] z-10 avatar-position  border-2 border-secondary rounded-full">
          <MyAvatar />
          <div className="bottom-1 absolute">
            <span
              className={`bg-secondary flex justify-center items-center
                      rounded-full text-[#161F1E] text-[1.25em] font-bold  h-[40px] w-[40px]`}
            >
              {userData?.Level}
            </span>
          </div>
        </div>

        <div
          className="absolute bg-[#161F1E] bg-opacity-90
                   w-full h-1/3 rounded-[20px] bottom-0"
        >
          <div className="text-white flex justify-between items-center ml-6">
            <div className="flex items-center justify-between py-8 w-1/3">
              <Statis
                title="Total game"
                total={userData?.TotalMatch ? userData?.TotalMatch : 0}
                line={true}
                style="text-[1.5em] md:text-[1.1em]"
              />
              <Statis
                title="Wins"
                total={userData?.TotalWin ? userData?.TotalWin : 0}
                line={true}
                style="text-[1.5em] md:text-[1.1em]"
              />
              <Statis
                title="Loses"
                total={userData?.TotalLose ? userData?.TotalLose : 0}
                line={false}
                style="text-[1.5em] md:text-[1.1em]"
              />
            </div>

            <div className="w-1/3 flex justify-center items-center">
              <h2 className="text-[2em] md:text-[1.5em] text-white font-bold mt-12">
                {userData?.login}
              </h2>
            </div>

            <div className="flex items-center justify-end gap-4 w-1/3 mr-7">
              <div className="flex flex-col items-center">
                <h3 className="text-[#E0E0E0] font-normal text-[1.5em] md:text-[1.1em]">
                  Location
                </h3>
                <div className="flex justify-center items-center">
                  <h3 className="uppercase text-white text-[1.5m] md:text-[1.1em] font-bold pl-2">
                    {userData?.location ? userData?.location : 'Unvailable'}
                  </h3>
                </div>
              </div>

              <div className="border-r-[1px] h-[51px] left-4 border-[#3D4042]"></div>

              <div className="flex flex-col items-center">
                <h3 className="text-[#E0E0E0] font-normal text-[1.5em]">
                  Rank
                </h3>
                <h2 className="font-bold text-[1em]">15</h2>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Navbar
        mobile={false}
        style="rounded-md h-[4.5vh] flex text-[24px] font-semibold"
      />
    </div>
  );
};
