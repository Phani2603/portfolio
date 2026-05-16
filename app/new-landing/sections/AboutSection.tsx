import { SectionBlock } from "./SectionBlock";
import { aboutParagraphs } from "./landing-content";
import { AnimatedSectionTitle } from "../components/AnimatedSectionTitle";
import { AnimatedSectionBody } from "../components/AnimatedSectionBody";

export function AboutSection() {
  return (
    <SectionBlock
      className="relative min-h-screen px-6 py-20 sm:px-10 sm:py-24 lg:px-16 lg:py-28"
      id="about"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#0E1016]/80 via-[#0E1016]/40 to-transparent backdrop-blur-md" />
      <div className="mx-auto min-w-4xl">
        <AnimatedSectionTitle
          text="About"
          className="mb-8 text-4xl font-black tracking-[-0.03em] text-slate-300 sm:text-5xl lg:text-8xl"
          // wordSpace="mr-[14px]"
          // charSpace="mr-[0.001em]"
        />

        <div className="space-y-6 text-lg leading-relaxed text-slate-300 sm:text-2xl sm:leading-relaxed lg:text-3xl lg:leading-relaxed">
          {aboutParagraphs.map((paragraph, index) => (
            <AnimatedSectionBody
              key={paragraph.text}
              text={paragraph.text}
              delay={index * 0.12}
              className={paragraph.emphasize ? "text-white" : undefined}
            />
          ))}
        </div>
      </div>
    </SectionBlock>
  );
}