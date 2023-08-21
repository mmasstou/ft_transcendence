import { userType } from '@/types/types';
import React, { FC } from 'react';

interface Props {
  title: string;
  total: number;
  line: boolean;
  style: string;
}

interface userInfo {
  user: userType | null;
}
export const Statis: FC<Props> = (info): JSX.Element => {
  return (
    <>
      <div className="flex flex-col items-center">
        <h3 className={`text-[#E0E0E0] font-normal ${info.style}`}>
          {info.title}
        </h3>
        <h2 className={`font-bold ${info.style}`}>{info.total}</h2>
      </div>
      {info.line && (
        <div className="border-r-[1px] h-[51px] left-4 border-[#3D4042]"></div>
      )}
    </>
  );
};

export const UserStats: React.FC<userInfo> = ({ user }) => {
  return (
    <div className="text-white flex items-center justify-evenly py-8 overflow-hidden">
      <Statis
        title="Total game"
        total={user?.TotalMatch ? user?.TotalMatch : 0}
        line={true}
        style="text-[1em]"
      />
      <Statis
        title="Wins"
        total={user?.TotalWin ? user?.TotalWin : 0}
        line={true}
        style="text-[1em]"
      />
      <Statis
        title="Loses"
        total={user?.TotalLose ? user?.TotalLose : 0}
        line={true}
        style="text-[1em]"
      />
      <Statis title="Rank" total={14} line={false} style="text-[1em]" />
    </div>
  );
};
