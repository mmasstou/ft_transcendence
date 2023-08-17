import { Info } from '@/app/profile/page';
import React, { FC } from 'react';

export const UserInfo = (): JSX.Element => {
  return (
    <div className="text-white flex flex-col justify-center items-center ml-[100px]">
      <h2 className="text-[1.75em] sm:text-[1.2em] font-bold">aouhadou</h2>
      <div className="flex justify-center items-center">
        <img
          className="h-[13px] w-[22px]"
          alt="Morocco"
          src="http://purecatamphetamine.github.io/country-flag-icons/3x2/MA.svg"
        />
        <h3 className="uppercase text-[#D9D9D9] text-[1.125] sm:text-[1em] font-bold pl-2">
          mar
        </h3>
      </div>
    </div>
  );
};
