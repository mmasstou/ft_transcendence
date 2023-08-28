'use client';
import React from 'react';
import Dashboard from '../Dashboard';
import Cookies from 'js-cookie';
import { Socket, io } from 'socket.io-client';

const metadata = {
  title: 'Transcendence',
  description: 'Online Pong Game',
};
export default function page() {
  return (
    <>
      <Dashboard>chat</Dashboard>
    </>
  );
}
