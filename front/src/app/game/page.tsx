"use client"
import React, { useRef, useEffect, createContext } from 'react';
import Dashboard from '../Dashboard';
import CanvasGame from '@/components/game/CanvasGame'; 

const page = () => {
  return (
    <Dashboard>
        <CanvasGame/>
   </Dashboard>
  )
}

export default page
