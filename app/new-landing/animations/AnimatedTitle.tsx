"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

type AnimatedTitleProps = {
  text: string;
  className: string;
  wordSpace: string;
  charSpace: string;
  delay?: number;
};

export default function AnimatedTitle({
  text,
  className,
  wordSpace,
  charSpace,
}: AnimatedTitleProps) {
  const ref = useRef<HTMLHeadingElement | null>(null);
  const [isInView, setIsInView] = useState(false);
  const easing: [number, number, number, number] = [0.2, 0.65, 0.3, 0.9];

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => setIsInView(entry.isIntersecting));
      },
      { threshold: 0.4 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const wordAnimation = {
    hidden: {},
    visible: {},
  };

  const characterAnimation = {
    hidden: {
      opacity: 0,
      y: "0.25em",
    },
    visible: {
      opacity: 1,
      y: "0em",
      transition: {
        duration: 1,
        ease: easing,
      },
    },
  };

  return (
    <h2 aria-label={text} className={className} ref={ref}>
      {text.split("\n").map((word, index) => (
        <motion.span
          aria-hidden="true"
          key={`${word}-${index}`}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={wordAnimation}
          transition={{
            delayChildren: index * 0.25,
            staggerChildren: 0.05,
          }}
          className={`inline-block whitespace-nowrap ${wordSpace}`}
        >
          {word.split("").map((character, charIndex) => (
            <motion.span
              aria-hidden="true"
              key={`${character}-${charIndex}`}
              variants={characterAnimation}
              className={`inline-block ${charSpace}`}
            >
              {character}
            </motion.span>
          ))}
        </motion.span>
      ))}
    </h2>
  );
}
