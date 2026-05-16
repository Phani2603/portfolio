"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { IconType } from "react-icons";

type AnimatedProps = {
  className?: string;
  delay?: number;
  stepSize?: number;
  iconSize?: number;
  children: React.ReactNode;
};

const animatedVariants = {
  hidden: {
    opacity: 0,
    y: "1em",
  },
  visible: {
    opacity: 1,
    y: "0em",
  },
};

const Animated: React.FC<AnimatedProps> = ({
  className,
  delay,
  iconSize = 50,
  children,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isInView, setIsInView] = useState(false);
  const easing: [number, number, number, number] = [0.2, 0.65, 0.3, 0.9];

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => setIsInView(entry.isIntersecting));
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.div
      className={className}
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={animatedVariants}
      transition={{
        delay: delay || 0,
        duration: 1,
        ease: easing,
      }}
    >
      {React.Children.map(children, (child, index) => {
        const icon = child as React.ReactElement<IconType>;
        return (
          <motion.div
            key={index}
            whileHover={{ scale: 1.1, color: "#ff5733" }}
            whileTap={{ scale: 0.9 }}
            style={{ width: iconSize, height: iconSize }}
            data-blobity
            data-blobity-radius={15}
            data-blobity-offset-x={15}
            data-blobity-offset-y={15}
            data-blobity-magnetic={false}
          >
            {icon}
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default Animated;
