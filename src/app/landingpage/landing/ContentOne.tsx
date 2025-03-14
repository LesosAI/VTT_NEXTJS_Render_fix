"use client";
import React from "react";
import { useRouter } from "next/navigation";

interface ContentOneProps {
  // No props needed currently
}

const ContentOne: React.FC<ContentOneProps> = () => {
  const router = useRouter();
  const posterUrl =
    "https://cdn.prod.website-files.com/64a466f88f23f57bfdd487cd/64a670d2d2e8cb8b1bb3974d_art video -poster-00001.jpg";
  const videoMp4Url =
    "https://cdn.prod.website-files.com/64a466f88f23f57bfdd487cd/64a670d2d2e8cb8b1bb3974d_art video -transcode.mp4";
  const videoWebmUrl =
    "https://cdn.prod.website-files.com/64a466f88f23f57bfdd487cd/64a670d2d2e8cb8b1bb3974d_art video -transcode.webm";

  return (
    <div>
      <section className="section-dark large-space">
        <div className="w-layout-blockcontainer base-container w-container">
          <div
            data-w-id="38a750d2-cae0-6b8a-9702-b61ae2a82d1e"
            style={{
              opacity: 1,
              transform:
                "translate3d(0px, 0px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)",
              transformStyle: "preserve-3d",
            }}
            className="full-width"
          >
            <div className="text-holder-medium margin-bottom-large">
              <h2>
                ForgeLab — Your Gateway to{" "}
                <span className="secondary-text-span">Creative Campaigns</span>{" "}
                and{" "}
                <span className="secondary-text-span">
                  Virtual Tabletop Art
                </span>
              </h2>
            </div>
            <div
              data-w-id="27dac7b2-8482-53ef-dd45-360898bbf338"
              style={{
                opacity: 1,
                transform:
                  "translate3d(0px, 0px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)",
                transformStyle: "preserve-3d",
              }}
              className="text-full-width"
            >
              Elevate your virtual tabletop experience with{" "}
              <span className="secondary-text-span primary-text-color">
                custom-generated campaigns and stunning artwork
              </span>
              . Whether you're a GM or player, ForgeLab helps you bring your
              imagination to life.
            </div>
          </div>
        </div>
      </section>

      <section className="section-dark large-bottom-space">
        <div className="w-layout-blockcontainer base-container w-container">
          <div className="display-flex-horizontal large-gap-tablet-wrap">
            <div className="column-wrapper flex-vertical-space-between">
              <div>
                <div className="text-full-width margin-bottom-xmedium">
                  Create{" "}
                  <span className="secondary-text-span primary-text-color">
                    immersive
                  </span>{" "}
                  campaigns and generate{" "}
                  <span className="secondary-text-span primary-text-color">
                    stunning
                  </span>{" "}
                  artwork for your adventures.
                </div>
                <p className="description-xmedium">
                  Join our platform to access powerful tools for campaign
                  generation and custom art creation tailored for virtual
                  tabletop gaming.
                </p>
              </div>
              <div
                className="margin-top-medium display-flex-horizontal"
                style={{ gap: "1rem" }}
              >
                <button
                  onClick={() => router.push("/signup")}
                  className="secondary-button w-button"
                  style={{ flex: 1 }}
                >
                  Sign Up
                </button>
              </div>
            </div>
            <div className="video-wrapper">
              <div className="column-video-background w-background-video w-background-video-atom">
                <video
                  poster={posterUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                  data-object-fit="cover"
                >
                  <source src={videoMp4Url} type="video/mp4" />
                  <source src={videoWebmUrl} type="video/webm" />
                </video>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContentOne;

// CSS can be moved to a separate .css or .scss file
