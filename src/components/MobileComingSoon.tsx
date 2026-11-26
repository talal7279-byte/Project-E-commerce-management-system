"use client";

import React, { useState, useEffect } from "react";

export default function MobileComingSoon({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = useState(false);
  const [bypassed, setBypassed] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      // Small screen mobile breakpoint (< 768px phone width)
      const mobileWidth = window.innerWidth < 768;
      const userAgentMobile = /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
      setIsMobile(mobileWidth && userAgentMobile);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (isMobile && !bypassed) {
    return (
      <div className="min-h-screen w-full bg-[#090909] text-[#EAE3D5] flex flex-col justify-between items-center px-8 py-16 text-center relative overflow-hidden font-jost select-none">
        {/* Subtle background hairline border */}
        <div className="absolute inset-4 border border-[#26231F] pointer-events-none"></div>

        {/* Top Monogram Tagline */}
        <div className="pt-4 z-10">
          <p className="text-[9px] uppercase tracking-[0.4em] text-[#B89552] font-light">
            LA VER’nO
          </p>
        </div>

        {/* Center Monogram & Content */}
        <div className="flex flex-col items-center max-w-sm mx-auto z-10 space-y-8">
          {/* Centered V Monogram */}
          <div className="w-20 h-20 rounded-full border border-[#B89552]/40 flex items-center justify-center bg-[#121212]">
            <span className="font-cormorant text-5xl font-light text-[#B89552] translate-y-[-1px]">
              V
            </span>
          </div>

          <div className="space-y-4">
            <h1 className="font-cormorant font-light text-3xl sm:text-4xl text-[#EAE3D5] leading-[1.2]">
              A More Refined Experience Awaits.
            </h1>
            <div className="w-12 h-px bg-[#B89552]/40 mx-auto"></div>
            <p className="text-[13px] text-[#B5ADA0] font-light leading-[1.8]">
              Our digital boutique is currently available on desktop and laptop devices.
            </p>
            <p className="text-[13px] text-[#B5ADA0] font-light leading-[1.8]">
              We are preparing the mobile experience for Android and iOS.
            </p>
            <p className="text-[12px] text-[#B89552] font-light italic">
              Thank you for your patience.
            </p>
          </div>

          {/* Test Option to Preview Desktop on Mobile */}
          <div className="pt-4">
            <button
              onClick={() => setBypassed(true)}
              className="text-[10px] uppercase tracking-[0.25em] text-[#B5ADA0] border-b border-[#26231F] hover:text-[#B89552] hover:border-[#B89552] pb-1 transition-all"
            >
              Continue to Desktop View
            </button>
          </div>
        </div>

        {/* Bottom Tagline */}
        <div className="pb-4 z-10">
          <p className="text-[9px] uppercase tracking-[0.42em] text-[#B89552]/90 font-light">
            WAYS OF MEN
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
