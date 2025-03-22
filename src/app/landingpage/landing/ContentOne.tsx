"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface ContentOneProps {
  // No props needed currently
}

const ContentOne: React.FC<ContentOneProps> = () => {
  const router = useRouter();

  return (
    <div>
      {/* First Section */}
      <section className="bg-black py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-12">
              ForgeLab — Your Gateway to{" "}
              <span className="text-[#e90026]">Creative Campaigns</span> and{" "}
              <span className="text-[#e90026]">Virtual Tabletop Art</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-200">
              Elevate your virtual tabletop experience with{" "}
              <span className="text-[#e90026]">
                custom-generated campaigns and stunning artwork
              </span>
              . Whether you're a GM or player, ForgeLab helps you bring your
              imagination to life.
            </p>
          </div>
        </div>
      </section>

      {/* Second Section */}
      <section className="bg-black py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <p className="text-xl md:text-2xl text-white">
                Create <span className="text-[#e90026]">immersive</span>{" "}
                campaigns and generate{" "}
                <span className="text-[#e90026]">stunning</span> artwork for
                your adventures.
              </p>
              <p className="text-lg text-gray-200">
                Join our platform to access powerful tools for campaign
                generation and custom art creation tailored for virtual tabletop
                gaming.
              </p>
              <div className="pt-4">
                <button
                  onClick={() => router.push("/signup")}
                  className="w-full sm:w-auto px-10 py-4 rounded-full bg-white text-black hover:bg-gray-100 transition-colors text-xl font-medium"
                >
                  Sign Up
                </button>
              </div>
            </div>
            <div className="relative rounded-lg overflow-hidden">
              <Image
                src="/Leonardo_4.avif"
                alt="logo"
                width={600}
                height={400}
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContentOne;

// CSS can be moved to a separate .css or .scss file
