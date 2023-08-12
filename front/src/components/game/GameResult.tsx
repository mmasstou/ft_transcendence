'use client';
import { useRouter } from 'next/navigation';
import React, { FC } from 'react';

type GameResultProps = {
  result: 'win' | 'lose' | 'draw';
};

const GameResult: FC<GameResultProps> = ({ result }) => {
  const router = useRouter();
  return (
    <div className="flex flex-col gap-4 items-center text-white">
      <img
        src={`/${
          result === 'win' ? 'win' : result === 'lose' ? 'lose' : 'draw'
        }.svg`}
        alt=""
        className="w-[20%] h-[20%] md:w-[15%] md:h-[15%] xl:w-[10%] xl:h-[10%]"
      />
      <h1 className="uppercase tracking-wider text-3xl xl:text-5xl 2xl:text-6xl font-bold">
        {result === 'win' ? 'You Won' : result === 'lose' ? 'You Lost' : 'Draw'}
      </h1>
      <div className="flex gap-3 xl:gap-4 text-sm 2xl:text-base">
        <button
          onClick={() => router.push('/game')}
          className="px-4 py-1 xl:px-6 xl:py-2 border xl:border-2 border-secondary rounded-xl font-bold text-secondary"
        >
          Play again
        </button>
        <button
          onClick={() => router.push('/profile')}
          className="px-4 py-1 xl:px-6 xl:py-2 border xl:border-2 border-danger rounded-xl font-bold text-danger"
        >
          Quit
        </button>
      </div>
    </div>
  );
};

export default GameResult;
