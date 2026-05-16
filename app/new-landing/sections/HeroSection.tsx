"use client";

import { useEffect, useRef } from "react";
import { heroText } from "./landing-content";
import { SectionBlock } from "./SectionBlock";
import HeroBackground from "../components/background/HeroBackground";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

export function HeroSection() {
  const isAnimatingRef = useRef(false);

  useEffect(() => {
    gsap.registerPlugin(ScrollToPlugin);

    const handleWheel = (event: WheelEvent) => {
      const hero = document.getElementById("hero");
      const about = document.getElementById("about");
      if (!hero || !about) return;

      const heroRect = hero.getBoundingClientRect();
      const aboutRect = about.getBoundingClientRect();
      const isHeroActive = heroRect.top >= -10 && heroRect.bottom >= window.innerHeight * 0.6;
      const isAboutActive = aboutRect.top <= window.innerHeight * 0.4 && aboutRect.bottom >= 0;

      if (isAnimatingRef.current) return;

      if (event.deltaY > 0 && isHeroActive) {
        event.preventDefault();
        isAnimatingRef.current = true;
        gsap.to(window, {
          duration: 0.6,
          ease: "power3.out",
          scrollTo: { y: about, autoKill: false },
          onComplete: () => {
            isAnimatingRef.current = false;
          },
        });
        return;
      }

      if (event.deltaY < 0 && isAboutActive && aboutRect.top >= 0) {
        event.preventDefault();
        isAnimatingRef.current = true;
        gsap.to(window, {
          duration: 0.6,
          ease: "power3.out",
          scrollTo: { y: hero, autoKill: false },
          onComplete: () => {
            isAnimatingRef.current = false;
          },
        });
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, []);

  return (
    <SectionBlock
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 text-center sm:px-10"
      id="hero"
    >
      <HeroBackground />
      <p className="relative z-10 text-5xl font-black tracking-[-0.05em] text-white/95 sm:text-4xl md:text-7xl lg:text-8xl">
        {heroText}
      </p>
    </SectionBlock>
  );
}