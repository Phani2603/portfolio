"use client";

import { useEffect, useRef } from "react";

type AnimatedSectionBodyProps = {
  text: string;
  className?: string;
  delay?: number;
};

export function AnimatedSectionBody({ text, className, delay = 0 }: AnimatedSectionBodyProps) {
  const ref = useRef<HTMLParagraphElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.style.transition = `opacity 0.9s cubic-bezier(0.2,0.65,0.3,0.9) ${delay}s, transform 0.9s ${delay}s`;
            el.style.opacity = "1";
            el.style.transform = "translateY(0)";
          } else {
            // reset so the paragraph will animate again when it re-enters
            el.style.transition = "";
            el.style.opacity = "0";
            el.style.transform = "translateY(1em)";
          }
        });
      },
      { threshold: 0.15 }
    );

    el.style.opacity = "0";
    el.style.transform = "translateY(1em)";
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <p aria-label={text} role="heading" className={className} ref={ref}>
      {text}
    </p>
  );
}