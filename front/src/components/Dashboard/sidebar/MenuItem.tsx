import Link from 'next/link';
import React from 'react';
import { IconType } from 'react-icons';

interface Props {
  isActive?: boolean;
  icon: IconType;
  href: string;
}

const MenuItem: React.FC<Props> = ({ isActive, icon: Icon, href }) => {
  return (
    <li className="">
      <Link href={href}>
        <div
          className={`relative ${
            isActive ? 'text-secondary  rounded-lg ' : 'text-white'
          } `}
        >
          <Icon
            className={`w-full h-[32px] md:h-[42px] xl:h-[48px]  2xl:h-[54px]
                `}
          />
        </div>
      </Link>
    </li>
  );
};

export default MenuItem;
