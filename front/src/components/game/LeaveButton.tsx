import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { root } from 'postcss';
import React, { useState } from 'react';

interface Props {
  isvertical: boolean;
  isReady: boolean;
  isMobile: boolean;
}

function LeaveButton({ isvertical, isReady, isMobile }: Props) {
  const router = useRouter();
  //   const [data, setData] = useState('');

  const handleClick = async () => {
    router.replace('/game');
    const response = await fetch('http://127.0.0.1:80/api/game/leaveGame', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        UserId: Cookies.get('_id'),
        TableId: Cookies.get('tableId'),
      }),
    });

    // const json = await response.json();
    // console.log(json);
  };
  // console.log(isvertical);
  return isReady ? (
    <div>
      <button
        onClick={handleClick}
        className={`border-2 text-danger relative mb-2  rounded-md px-4 py-1 border-danger  bg-transparent ${
          isvertical ? 'text-xs px-2 -left-9 ' : ''
        } ${isvertical && isMobile ? '-rotate-90 -top-5' : ''}`}
      >
        QUIT
      </button>
    </div>
  ) : (
    <></>
  );
}

export default LeaveButton;
