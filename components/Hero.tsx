import React from "react";
import { Spotlight } from "./ui/spotlight-new";
import { cn } from "@/lib/utils";
import { TextGenerateEffect } from "./ui/text-generate-effect";
import MagicButton from "./ui/MagicButton";
import { FaLocationArrow } from "react-icons/fa";

const Hero = () => {
  return (
    <div className="pb-20 pt-36 " id="home">
      <div>
        {/* <Spotlight/> */}
        <Spotlight className=" -top-40 -left-10 md:left-10 md:-top-5 h-screen" fill="white" />
        <Spotlight className="top-10 left-full h-[80vh] w-[50vw]" fill="purple" />
        <Spotlight className="top-28 left-80 h-[80vh] w-[50vw]" fill="blue" />
      </div>
      <div
        className={cn(
            "absolute inset-0",
            "[background-size:80px_80px]",
            "[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
            "dark:[background-image:linear-gradient(to_right,rgba(38,38,38,0.60)_1px,transparent_1px),linear-gradient(to_bottom,rgba(38,38,38,0.55)_1px,transparent_1px)]",
          )}
      />
      {/* Radial gradient for the container to give a faded look */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black-100 [mask-image:radial-gradient(ellipse_at_center,transparent_10%,black)] dark:bg-black-100"></div>
      {/* <p className="relative z-20 bg-gradient-to-b from-neutral-200 to-neutral-500 bg-clip-text py-8 text-4xl font-bold text-transparent sm:text-7xl justify-center flex items-center">
       
      </p> */}
      <div className="flex flex-col items-center justify-center relative z-20">
        <div className="max-w-[89vw] md:max-w-2xl lg:max-w-[60vw] felx flex-col items-center justify-center">
            <h2 className="uppercase tracking-widest text-xs text-center text-blue-100 max-x-80">
                Dynamic Web Magic with Next.js
            </h2>
            <TextGenerateEffect
            className="text-center text-[40px] md:text-5xl lg:text-6xl "
            words="Engineering Intelligent Web Platforms from Idea to Deployment"
            />
            <p className="text-center md:tracking-wider mb-4 text-sm md:text-lg lg:text-2xl">Hi, I&apos;m Phani, a Next.js  Developer based in India.</p>
            <a href="#about" className="flex flex-col items-center justify-center">
                <MagicButton title="Show My Work" icon={<FaLocationArrow />} postion="right" />
            </a>
            {/* <a href="#about" className="flex flex-col items-center justify-center">
                <MagicButton title="About.." icon={<FaLocationArrow />} postion="right" />
            </a> */}
        </div>
      </div>
    </div>
  );
};

export default Hero;
