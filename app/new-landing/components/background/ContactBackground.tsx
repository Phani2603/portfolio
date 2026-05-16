import React from "react";

const ContactBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 z-0">
      <video
        className="absolute inset-0 h-full w-full object-cover object-bottom"
        autoPlay
        loop
        playsInline
        muted
        preload="auto"
      >
        <source src="/contactvid.mp4" type="video/mp4" />
      </video>
      {/* Strong dark overlay to deepen the video background */}
      <div className="absolute inset-0 bg-black/75" />
      {/* Subtle top and full gradients to keep smooth blending with Tools */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#0E1016]/75 to-transparent" />
      <div className="absolute inset-0 h-full w-full bg-gradient-to-t from-[#0E1016]/45 to-transparent" />
    </div>
  );
};

export default ContactBackground;
