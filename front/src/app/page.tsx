import About from '@/components/Home/About';
import Footer from '@/components/Home/Footer';
import Hero from '@/components/Home/Hero';
import Home_Header from '@/components/Home/Home_Header';
import Showcase from '@/components/Home/Showcase';
import Head from 'next/head';

export default function Home() {
  return (
    <>
      <div className="bg-[#161F1E]  h-screen overflow-scroll">
        <Head>
          <title>Transcendence</title>
        </Head>
        <Home_Header />
        <Hero />
        <About />
        <Showcase />
        <Footer />
      </div>
    </>
  );
}
