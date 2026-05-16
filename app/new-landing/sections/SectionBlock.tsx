import type { ReactNode } from "react";

type SectionBlockProps = {
  id?: string;
  className: string;
  children: ReactNode;
};

export function SectionBlock({ id, className, children }: SectionBlockProps) {
  return (
    <section className={className} id={id}>
      {children}
    </section>
  );
}