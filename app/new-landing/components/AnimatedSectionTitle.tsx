"use client";

type AnimatedSectionTitleProps = {
  text: string;
  className?: string;
};

export function AnimatedSectionTitle({ text, className }: AnimatedSectionTitleProps) {
  return (
    <h2 aria-label={text} className={className}>
      {text}
    </h2>
  );
}