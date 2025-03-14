import HeroSection from "./landing/HeroSection";
import ContentOne from "./landing/ContentOne";
import QuoteSection from "./landing/QuoteSection";
import FeaturedWork from "./landing/FeaturedWork";
import ContentTwo from "./landing/ContentTwo";
import ContentThree from "./landing/ContentThree";
import FooterSection from "./landing/FooterSection";
import "./landing.css";
import Image from "next/image";
export default function LandingPage() {
  return (
    <main className="flex flex-col min-h-screen">
      <div className="flex flex-col min-h-screen overflow-hidden">
        <Image src="/images/538526_shinyarmor-v1-0.png" alt="logo" width={100} height={100} />
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
