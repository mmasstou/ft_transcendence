import { RiLogoutBoxFill } from 'react-icons/ri';
import * as Popover from '@radix-ui/react-popover';
import { Cross2Icon } from '@radix-ui/react-icons';
import Cookies from 'js-cookie';
import MyAvatar from '@/components/profile/MyAvatar';
import router from 'next/router';

export const Logout: React.FC = (props): JSX.Element => {
  const logoutHandle = () => {
    (async () => {
      const resp = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/logout`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${Cookies.get('token')}`,
          },
        }
      );
      if (resp.status === 200) {
        Cookies.remove('token');
        Cookies.remove('_id');
        Cookies.remove('tableId');
        router.push('/');
      }
    })();
  };

  return (
    <Popover.Root>
      <Popover.Trigger asChild aria-controls="radix-:R1mcq:">
        <button aria-label="Update dimensions">
          <div className="cursor-pointer w-[32px] h-[32px]">
            <MyAvatar />
          </div>
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className="text-white rounded p-5 w-[200px] mr-4 bg-[#2B504B] shadow-[0_10px_38px_-10px_hsla(206,22%,7%,.35),0_10px_20px_-15px_hsla(206,22%,7%,.2)] "
          sideOffset={5}
        >
          <div className="flex flex-col justify-center items-center gap-2.5 py-2">
            <p className="text-[15px] leading-[19px] font-medium mt-2">
              👋 Hey, aouhadou
            </p>
            <div className="w-3/4 border-b-[0.1vh] border-white opacity-50"></div>
            <a
              onClick={logoutHandle}
              href="/"
              className="flex justify-between items-center my-1 hover:text-red-500"
            >
              <RiLogoutBoxFill className="mx-2" />
              Logout
            </a>
          </div>
          <Popover.Close
            className="rounded-full h-[25px] w-[25px] mr-4 inline-flex items-center justify-center text-white absolute top-[5px] right-[5px] outline-none cursor-pointer"
            aria-label="Close"
          >
            <Cross2Icon />
          </Popover.Close>
          <Popover.Arrow className="fill-[#2B504B]" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};
