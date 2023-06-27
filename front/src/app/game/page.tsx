"use client"
import React, { useRef, useEffect, createContext } from 'react';
import Dashboard from '../Dashboard';
import CanvasGame from '@/components/game/CanvasGame'; 

const page = () => {
  // const gameRef = useRef<HTMLDivElement>(null);

  // useEffect(() => {
  //   if (gameRef.current && gameRef.current.offsetParent) {
  //     const dashboardRect = gameRef.current.offsetParent.getBoundingClientRect();
  //     const headerHeight = gameRef.current.offsetParent.querySelector('header')?.getBoundingClientRect().height ?? 0;
  //     const sideBarwidth = document.getElementById('Sidebar')?.getBoundingClientRect().width ?? 0;
  //     // const sidebarWidth = gameRef.current.offsetParent.getElementById('sidebar')?.getBoundingClientRect().width ?? 0;
  //     const availableHeight = dashboardRect.height - headerHeight;
  //     const availableWidth = dashboardRect.width - sideBarwidth;
  //     console.log(`Available Height: ${availableWidth}x${availableHeight}`);
  //   }
  // }, [gameRef]);
  return (
    <Dashboard>
      <CanvasGame/>
        {/* <div ref={gameRef}>game page</div> */}
   </Dashboard>
  )
}

export default page




/**

import React, { useRef, useEffect } from 'react';
import Dashboard from './Dashboard';

const Page = () => {
  const gameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (gameRef.current) {
      const gameRect = gameRef.current.getBoundingClientRect();
      console.log(`Width: ${gameRect.width}, Height: ${gameRect.height}`);
    }
  }, [gameRef]);

  return (
    <Dashboard>
      <div ref={gameRef}>game page</div>
    </Dashboard>
  );
};

export default Page;

 */