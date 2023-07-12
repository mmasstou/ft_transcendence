import React from 'react'
import Dashboard from '../Dashboard'
import Chat from '@/components/chat/chat.index'

const metadata = {
  title: 'Transcendence',
  description: 'Online Pong Game',
};
export default function page() {
  return (
    <Dashboard>
    <Chat />
  </Dashboard>
  )
}
