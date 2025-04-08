"use client";

import { useState } from "react";
import { Bars3Icon, XMarkIcon, PhotoIcon } from "@heroicons/react/24/outline";
import NextImage from "next/image";
export default function HeroSection() {
  const [posterUrl] = useState(
    "https://cdn.prod.website-files.com/64a466f88f23f57bfdd487cd/64a57bf0ef680a13e9340f22_banner video background-poster-00001.jpg"
  );
  const [videoMp4Url] = useState(
    "https://cdn.prod.website-files.com/64a466f88f23f57bfdd487cd/64a57bf0ef680a13e9340f22_banner video background-transcode.mp4"
  );
  const [videoWebmUrl] = useState(
    "https://cdn.prod.website-files.com/64a466f88f23f57bfdd487cd/64a57bf0ef680a13e9340f22_banner video background-transcode.webm"
  );
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="min-h-screen">
      <div className="absolute top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="w-[180px]">
              <NextImage
                src="/ForgeLabsLogo.png"
                alt="ForgeLab Logo"
                width={340}
                height={340}
                className="object-contain"
              />
            </div>

            <nav
              className={`${
                isMenuOpen
                  ? "fixed inset-0 bg-black/95 flex items-center justify-center"
                  : "hidden md:flex md:items-center"
              }`}
            >
              {isMenuOpen && (
                <button
                  onClick={toggleMenu}
                  className="absolute top-4 right-4 text-white"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              )}
              <div className="flex flex-col md:flex-row items-center">
                <div className="flex">
                  <a
                    href="/login"
                    className="px-6 py-3 rounded-l-full border border-white/30 text-white bg-black/40 hover:bg-black/60 transition-colors border-r-0 text-lg"
                  >
                    Sign In
                  </a>
                  <a
                    href="/register"
                    className="px-6 py-3 rounded-r-full border border-white/30 text-white bg-black/40 hover:bg-black/60 transition-colors border-l-0 text-lg"
                  >
                    Sign Up
                  </a>
                </div>
              </div>
            </nav>

            <div className="flex items-center">
              <a
                href="/register"
                className="hidden md:inline-flex px-8 py-3 rounded-full border border-white/30 text-white bg-white/20 hover:bg-white/30 transition-colors text-lg"
              >
                Get Started
              </a>
              <button onClick={toggleMenu} className="md:hidden text-white">
                <Bars3Icon className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="relative min-h-screen pt-20 pb-20 bg-gradient-to-b from-[#e9002680] to-black">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover -z-10"
          style={{ backgroundImage: `url(${posterUrl})` }}
        >
          <source src={videoMp4Url} type="video/mp4" />
          <source src={videoWebmUrl} type="video/webm" />
        </video>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-64 md:pt-[28rem] text-center relative z-10">
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-6">
            Welcome to <span className="font-sentient italic">ForgeLab</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-12 max-w-2xl mx-auto">
            Generate immersive campaign art and content for your virtual
            tabletop adventures. Bring your stories to life with our powerful
            creation tools.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <a
              href="/register"
              className="w-full sm:w-auto px-10 py-4 rounded-full bg-white text-black hover:bg-gray-100 transition-colors text-xl font-medium"
            >
              Get Started
            </a>
            <a
              href="/login"
              className="w-full sm:w-auto px-10 py-4 rounded-full border border-white/30 text-white hover:bg-white/10 transition-colors text-xl font-medium"
            >
              Sign In
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
