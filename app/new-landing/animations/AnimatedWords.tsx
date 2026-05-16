"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

type AnimatedWordsProps = {
  title: string;
  style: string;
};

const AnimatedWords: React.FC<AnimatedWordsProps> = ({ title, style }) => {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [isInView, setIsInView] = useState(false);
  const easing: [number, number, number, number] = [0.2, 0.65, 0.3, 0.9];

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => setIsInView(entry.isIntersecting));
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const letterAnimation = {
    initial: {
      opacity: 0,
      y: 150,
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        ease: easing,
        duration: 0.8,
      },
    },
  };

  return (
    <h1 aria-label={title}>
      <motion.span className={style} ref={ref}>
        {title.split("\n").map((word, index) => (
          <motion.div
            key={`${word}-${index}`}
            initial="initial"
            animate={isInView ? "animate" : "initial"}
            className="flex items-center justify-center overflow-hidden last:-mr-10"
            transition={{
              delayChildren: index * 0.25,
              staggerChildren: 0.05,
            }}
          >
            <motion.span
              className="-mb-4 inline-block overflow-hidden pt-1 sm:-mb-2 md:-mb-3 lg:-mb-4"
              variants={letterAnimation}
            >
              {word + "\u00A0"}
            </motion.span>
          </motion.div>
        ))}
      </motion.span>
    </h1>
  );
};

export default AnimatedWords;
