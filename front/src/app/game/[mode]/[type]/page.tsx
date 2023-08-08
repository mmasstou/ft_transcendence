'use client';
import Dashboard from '@/app/Dashboard';
import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';
import Image from 'next/image';
import CanvasGame from '@/components/game/CanvasGame';

const page = () => {
  return (
    <Dashboard>
      <CanvasGame/>
    </Dashboard>
  );
};

export default page;
