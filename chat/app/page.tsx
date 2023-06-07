import Image from 'next/image'
import Chat from './components/chat.index'
import OnlineUsersModaL from './modaL/OnlineUsersModaL'

export default function Home() {
  return (
    <main className="main-box flex h-full  min-h-screen flex-col justify-end p-2 border  border-white max-w-[1500px] m-auto">
      <Chat />
    </main>
  )
}
