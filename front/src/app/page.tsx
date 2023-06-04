import About from "@/components/About";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Home_Header from "@/components/Home_Header";
import Showcase from "@/components/Showcase";

export default function Home() {
    return (
        <div className="bg-[#161F1E] h-screen overflow-scroll z-0">
            <Home_Header />
            <Hero />
            <About />
            <Showcase />
            <Footer />
        </div>
    );
}
