"use client";

import { useState } from "react";
import { Bars3Icon, XMarkIcon, PhotoIcon } from "@heroicons/react/24/outline";

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
    <div>
      <div className="navbar w-nav">
        <div className="nav-container w-container">
          <div className="nav-menu-wrapper">
            <a href="/" className="brand w-nav-brand">
              <PhotoIcon className="nav-logo-icon" width="27" height="27" />
            </a>
            <nav role="navigation" className="nav-menu w-nav-menu">
              <div className="tablet-menu">
                <a href="/" className="brand-tablet w-nav-brand">
                  <PhotoIcon className="nav-logo-icon" width="27" height="27" />
                </a>
                <div
                  className="close-menu-button w-nav-button"
                  onClick={toggleMenu}
                >
                  <XMarkIcon
                    className="nav-close-icon"
                    width="24"
                    height="24"
                  />
                </div>
              </div>
              <div className="menu-wrap">
                <div className="nav-dropdown w-dropdown">
                  <div className="nav-dropdown-toggle w-dropdown-toggle">
                    <div className="nav-dropdown-icon w-icon-dropdown-toggle"></div>
                    <a
                      href="/login"
                      className="nav-item-title"
                      style={{ color: "rgb(255, 255, 255);" }}
                    >
                      Sign In
                    </a>
                  </div>
                </div>
                <div className="nav-dropdown w-dropdown">
                  <div className="nav-dropdown-toggle w-dropdown-toggle">
                    <div className="nav-dropdown-icon w-icon-dropdown-toggle"></div>
                    <a
                      href="/register"
                      className="nav-item-title"
                      style={{ color: "rgb(255, 255, 255);" }}
                    >
                      Sign Up
                    </a>
                  </div>
                </div>
              </div>
            </nav>
            <div className="search-shop-con">
              <a href="/signup" className="nav-button w-button">
                Get Started
              </a>
            </div>
            <div className="menu-button w-nav-button" onClick={toggleMenu}>
              <Bars3Icon className="image-burger" width="24" height="24" />
            </div>
          </div>
        </div>
      </div>

      <div className="background-video w-background-video w-background-video-atom">
        <video
          autoPlay
          loop
          muted
          playsInline
          style={{ backgroundImage: `url(${posterUrl})` }}
        >
          <source src={videoMp4Url} type="video/mp4" />
          <source src={videoWebmUrl} type="video/webm" />
        </video>

        <div className="banner-info-bottom-wrapper">
          <h1 className="banner-title-large">
            Welcome to <span className="secondary-text-span">ForgeLab</span>
          </h1>
          <p className="banner-description-large">
            Generate immersive campaign art and content for your virtual
            tabletop adventures. Bring your stories to life with our powerful
            creation tools.
          </p>
          <div className="buttons-wrapper">
            <a href="/signup" className="primary-button w-button">
              Get Started
            </a>
            <a href="/signin" className="primary-button-white w-button">
              Sign In
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
