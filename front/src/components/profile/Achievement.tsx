import React, { FC } from 'react';
import { BsCheckLg } from 'react-icons/bs';
import ProgressionBar from '../ui/progress/ProgressionBar';

type AchievementProps = {
  icon: string;
  title: string;
  description: string;
  accomplished?: boolean;
} & (
  | {
      hasProgression: true;
      progression: number;
    }
  | {
      hasProgression?: false;
      progression?: never;
    }
);

const Achievement: FC<AchievementProps> = ({
  description,
  icon,
  progression,
  title,
  hasProgression,
  accomplished,
}) => {
  return (
    <div
      className={`flex bg-[#3E504D] w-full rounded-md p-3 lg:p-4 items-center justify-between opacity-${
        progression === 100 || accomplished ? '100' : '50'
      }`}
    >
      <div className="flex items-center justify-center gap-3 lg:gap-5">
        <div className="h-12 w-12 lg:h-14 lg:w-14 2xl:h-16 2xl:w-16 flex items-center justify-center rounded-full border xl:border-2">
          <img
            src={`/${icon}.svg`}
            alt=""
            className="w-8 h-8 lg:w-10 lg:h-10"
          />
        </div>
        <div className="flex flex-col">
          <h2 className="font-semibold tracking-wide text-xl xl:text-2xl">
            {title}
          </h2>
          <span className="text-xs lg:text-sm xl:txt-base">{description}</span>
        </div>
      </div>
      {hasProgression && (
        <ProgressionBar initValue={0} currentValue={progression} />
      )}
      <BsCheckLg
        className={`h-9 w-9 lg:w-12 lg:h-12 ${
          (progression === 100 || accomplished) && 'fill-secondary'
        }`}
      />
    </div>
  );
};

export default Achievement;
