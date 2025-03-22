import HeroSection from "./landing/HeroSection";
import ContentOne from "./landing/ContentOne";
import QuoteSection from "./landing/QuoteSection";
import FeaturedWork from "./landing/FeaturedWork";
import ContentTwo from "./landing/ContentTwo";
import ContentThree from "./landing/ContentThree";
import FooterSection from "./landing/FooterSection";
// import "./landing.css";
import Image from "next/image";
export default function LandingPage() {
  return (
    <main className="flex flex-col min-h-screen">
      <div className="flex flex-col min-h-screen overflow-hidden">
        
        <HeroSection />
        <ContentOne />
        <QuoteSection />
        <FeaturedWork />
        <ContentTwo />
        <ContentThree />
        <FooterSection />
      </div>
    </main>
  );
}
