import { AboutSection } from "./sections/AboutSection";
import { HeroSection } from "./sections/HeroSection";
import { WorkSection } from "./sections/WorkSection";
import ToolsSection from "./sections/ToolsSection";
import ContactSection from "./sections/ContactSection";

export const metadata = {
  title: "Greeting",
  description: "Simple greeting page.",
};

export default function NewLandingPage() {
  return (
    <main className="min-h-screen bg-[#100c08] text-white">
      <HeroSection />
      <AboutSection />
      <WorkSection />
      <ToolsSection />
      <ContactSection />
    </main>
  );
}