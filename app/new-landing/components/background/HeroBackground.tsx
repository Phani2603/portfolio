import React from "react";

const HeroBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 z-0">
      <video
        className="h-full w-full object-cover"
        autoPlay
        loop
        playsInline
        muted
        preload="auto"
      >
        <source src="/hero.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 h-full w-full bg-gradient-to-t from-[#0E1016]/70 to-transparent" />
      <div className="absolute inset-0 h-full w-full bg-gradient-to-b from-[#0E1016]/60 to-transparent" />
    </div>
  );
};

export default HeroBackground;
