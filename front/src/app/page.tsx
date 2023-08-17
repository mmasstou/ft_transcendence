import Home_Header from '@/components/Home/Home_Header';
import About from '@/components/Home/About';
import Hero from '@/components/Home/Hero';
import Showcase from '@/components/Home/Showcase';
import Footer from '@/components/Home/Footer';
import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Transcendence',
  description: 'Online Pong Game',
};
export default function Home() {
  return (
    <>
      <div className="bg-[#161F1E] h-screen overflow-scroll">
        <Home_Header />
        <Hero />
        <About />
        <Showcase />
        <Footer />
      </div>
    </>
  );
}
