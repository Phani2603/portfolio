"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

type AnimatedBodyProps = {
  text: string;
  className?: string;
  delay?: number;
};

export default function AnimatedBody({ text, className, delay }: AnimatedBodyProps) {
  const ref = useRef<HTMLParagraphElement | null>(null);
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

  const bodyAnimation = {
    hidden: {
      opacity: 0,
      y: "1em",
    },
    visible: {
      opacity: 1,
      y: "0em",
      transition: {
        delay: delay,
        duration: 1,
        ease: easing,
      },
    },
  };

  return (
    <motion.p
      aria-label={text}
      role="heading"
      className={className}
      ref={ref}
      aria-hidden="true"
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={bodyAnimation}
    >
      {text}
    </motion.p>
  );
}
