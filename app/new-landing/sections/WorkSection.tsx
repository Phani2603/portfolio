import { workItems } from "./landing-content";
import { SectionBlock } from "./SectionBlock";
import { WorkCard } from "./WorkCard";

export function WorkSection() {
  return (
    <SectionBlock className="min-h-screen px-6 py-20 sm:px-10 sm:py-24 lg:px-16 lg:py-28">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-4 text-4xl font-black tracking-[-0.03em] text-white sm:text-5xl lg:text-6xl">
          Work
        </h2>

        <p className="mb-12 max-w-2xl text-sm leading-relaxed text-slate-400 sm:text-base">
          Selected projects rebuilt as cutout cards so the section feels more
          tactile, layered, and alive.
        </p>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-10">
          {workItems.map((item) => (
            <WorkCard key={item.title} item={item} />
          ))}
        </div>
      </div>
    </SectionBlock>
  );
}