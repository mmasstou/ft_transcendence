'use client';
import React, { useEffect, useState } from 'react'
import Dashboard from '@/app/Dashboard';
import { HiChatBubbleLeftRight } from "react-icons/hi2";
import { usePathname } from "next/navigation";
import { FaUsers } from "react-icons/fa";
import ChatNavbarLink from '../components/chat.navbar.link';
import Button from '../components/Button';
import { BsLayoutSidebarInset, BsReverseLayoutSidebarInsetReverse, BsPersonAdd, BsFillPeopleFill, BsPeople } from "react-icons/bs";
import PrivateConversation from './components/privateConversation';
import Cookies from 'js-cookie';

const metadata = {
  title: 'Transcendence',
  description: 'Online Pong Game',
};

const token = Cookies.get('token');
const currentId = Cookies.get('_id');


export default function page() {
    

  return (
	<></> )

}
