'use client';
import Home_Header from '@/components/Home/Home_Header';
import About from '@/components/Home/About';
import Hero from '@/components/Home/Hero';
import Showcase from '@/components/Home/Showcase';
import Footer from '@/components/Home/Footer';
import React, { useEffect, useState } from 'react';
import Lottie from 'react-lottie-player';
import data from '@/../public/lotties/pong.json';
import { Metadata } from 'next';

const metadata: Metadata = {
  title: 'Transcendence',
  description: 'Online Pong Game',
};

export default function Home() {
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  return (
    <>
      {loading && (
        <div className="bg-[#161F1E] h-screen overflow-scroll flex flex-col justify-center items-center">
          <Lottie
            loop
            animationData={data}
            play
            style={{ height: 300, width: 300 }}
          />
        </div>
      )}
      {!loading && (
        <div className="bg-[#161F1E] h-screen overflow-scroll flex flex-col gap-4">
          <Home_Header />
          <Hero />
          <About />
          <Showcase />
          <Footer />
        </div>
      )}
    </>
  );
}
