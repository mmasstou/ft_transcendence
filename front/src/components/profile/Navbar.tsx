'use client';
import Historique from './Historique';
import Achpage from './Achpage';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Statistics from './Statistics';
import Friend from './Friend';

interface Props {
  mobile: boolean;
  style: string;
}

export const Navbar: React.FC<Props> = (info): JSX.Element => {
  let router = usePathname();

  const updateRouter = (url: string) => {
    router = url;
  };

  return (
    <>
      <div className={`bg-[#243230] ${info.style}`}>
        {info.mobile && (
          <div className="flex justify-center items-center">
            <div className="border-[1px] w-full mx-5 border-[#3D4042]"></div>
          </div>
        )}
        <nav className={`flex items-center justify-start px-5 py-2 `}>
          <ul className="flex items-center gap-5 text-white">
            <li
              className={
                router == '/profile' || router == '/profile/statistics'
                  ? 'text-secondary'
                  : ''
              }
            >
              <Link href="/profile/statistics">Statistics</Link>
            </li>

            <li
              className={router == '/profile/history' ? 'text-secondary ' : ''}
            >
              <Link href="/profile/history">History</Link>
            </li>

            <li className={router == '/profile/friend' ? 'text-secondary' : ''}>
              <Link href="/profile/friend">Friend</Link>
            </li>

            <li
              className={
                router == '/profile/achievements' ? 'text-secondary' : ''
              }
            >
              <Link
                onClick={() => updateRouter('/profile/achievements')}
                href="/profile/achievements"
              >
                Achievements
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <div className="">
        {(router === '/profile' || router === '/profile/statistics') && (
          <Statistics />
        )}

        {router === '/profile/history' && <Historique />}
        {router === '/profile/friend' && <Friend />}
        {router === '/profile/achievements' && <Achpage />}
      </div>
    </>
  );
};
