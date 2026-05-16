import type { Avatar } from "@/components/ui/avatar-circles";

type AboutParagraph = {
  text: string;
  emphasize?: boolean;
};

export type WorkItem = {
  title: string;
  description: string;
  skills: string[];
  avatarUrls: Avatar[];
  image: string;
  videoSrc?: string;
  deploymentState: "Production" | "Development";
  href: string;
  githubUrl?: string;
};

export const heroText = "Hi, I am K Vennela Kishore.";

export const aboutParagraphs: AboutParagraph[] = [
  {
    text: "I'm K Vennela Kishore, a CSE student at KLH deemed to be University specializing in AI Systems and Visual Intelligence. I spend most of my time building, whether that's full-stack web applications or AI-powered systems that actually solve something real.",
  },
  {
    text: "My foundation is in full-stack development with Next.js, React, Node.js, TypeScript, and Tailwind CSS. Over time I've pushed deeper into the AI side, working with LLMs, computer vision, and intelligent automation. The projects I'm most proud of live at that intersection.",
  },
  {
    text: "Smart Curriculum brings together Groq's LLaMA model, OCR, and real-time systems to reimagine how attendance and scheduling works. Certiflo is a live production platform at gocertiflo.com that automates certificate generation and distribution at scale. These aren't just portfolio pieces, they're things people actually use.",
  },
  {
    text: "I like picking up hard problems, experimenting with new tools, and figuring things out as I go. The AI space moves fast and I genuinely enjoy keeping up with it.",
  },
  {
    text: "I'm currently open to opportunities, collaborations, and interesting projects. If you're building something worth building, I'd love to be part of it.",
    emphasize: true,
  },
];

export const workItems: WorkItem[] = [
  {
    title: "Smart Curriculum",
    description:
      "AI-powered system that combines Groq's LLaMA model, OCR, and real-time automation to reimagine attendance tracking and schedule management for educational institutions.",
    skills: ["LLM", "Computer Vision", "Automation"],
    avatarUrls: [
      { imageUrl: "/re.svg", profileUrl: "#" },
      { imageUrl: "/ts.svg", profileUrl: "#" },
      { imageUrl: "/three.svg", profileUrl: "#" },
    ],
    image: "/smart-Curriculum.webp",
    deploymentState: "Production",
    href: "https://github.com/Gnanasai1205/smart-schedule",
    githubUrl: "https://github.com/Gnanasai1205/smart-schedule",
  },
  {
    title: "Certiflo",
    description:
    "Production-ready platform at gocertiflo.com that automates certificate generation and distribution at scale, serving thousands of users with seamless integration.",
    skills: ["Full Stack", "Automation", "Scale"],
    avatarUrls: [
      { imageUrl: "/next.svg", profileUrl: "#" },
      { imageUrl: "/tail.svg", profileUrl: "#" },
      { imageUrl: "/dock.svg", profileUrl: "#" },
    ],
    image: "/certiflomock.webp",
    deploymentState: "Production",
    href: "https://github.com/Phani2603/CertificateGen",
    githubUrl: "https://github.com/Phani2603/CertificateGen",
  },
  {
    title: "SinemaAgain",
    description:
      "Movie experience project focused on clean discovery flows, quick previews, and a focused UI for browsing titles.",
    skills: ["Next.js", "UI", "Media"],
    avatarUrls: [
      { imageUrl: "/next.svg", profileUrl: "#" },
      { imageUrl: "/tail.svg", profileUrl: "#" },
      { imageUrl: "/ts.svg", profileUrl: "#" },
    ],
    image: "/sinemamock.webp",
    deploymentState: "Production",
    href: "https://github.com/Phani2603/SinemaAgain",
    githubUrl: "https://github.com/Phani2603/SinemaAgain",
  },
  {
    title: "Traffic Rules Violation Detection",
    description:
      "Computer-vision pipeline that detects traffic rule violations and highlights incidents for review.",
    skills: ["Computer Vision", "Detection", "AI"],
    avatarUrls: [
      { imageUrl: "/python.svg", profileUrl: "#" },
      { imageUrl: "/opencv.svg", profileUrl: "#" },
      { imageUrl: "/ai.svg", profileUrl: "#" },
    ],
    image: "/traffic-violation.webp",
    videoSrc: "/traffic_annotated1.mp4",
    deploymentState: "Production",
    href: "https://github.com/Phani2603/Traffic-Rules-Violation-Detection",
    githubUrl: "https://github.com/Phani2603/Traffic-Rules-Violation-Detection",
  },
];