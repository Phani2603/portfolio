'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Spotlight } from '@/components/ui/spotlight-new';
import { WorkCard } from '@/app/new-landing/sections/WorkCard';
import { cn } from '@/lib/utils';
import { FaEye, FaArrowLeft } from 'react-icons/fa';
import { ProjectService } from '@/backend/services/project-service';

type Avatar = {
  imageUrl: string;
  profileUrl: string;
};

const techLabelMap: Record<string, string> = {
  react: 'React',
  typescript: 'TypeScript',
  javascript: 'JavaScript',
  nextjs: 'Next.js',
  tailwindcss: 'Tailwind CSS',
  tailwind: 'Tailwind CSS',
  threejs: 'Three.js',
  'three.js': 'Three.js',
  'framer-motion': 'Framer Motion',
  gsap: 'GSAP',
  docker: 'Docker',
  git: 'Git',
  nodejs: 'Node.js',
  clerk: 'Clerk Auth',
  'social-media': 'Social Media',
  hostinger: 'Hostinger',
  cloud: 'Cloud',
  streaming: 'Streaming',
};

const iconLabelMap: Record<string, string> = {
  '/re.svg': 'React',
  '/ts.svg': 'TypeScript',
  '/c.svg': 'JavaScript',
  '/next.svg': 'Next.js',
  '/tail.svg': 'Tailwind CSS',
  '/three.svg': 'Three.js',
  '/fm.svg': 'Framer Motion',
  '/gsap.svg': 'GSAP',
  '/dock.svg': 'Docker',
  '/git.svg': 'Git',
  '/cloud.svg': 'Cloud',
  '/stream.svg': 'Streaming',
  '/host.svg': 'Hostinger',
  '/p.svg': 'Social Media',
  '/p2.svg': 'IoT',
  '/p3.svg': 'Music',
  '/p11.svg': 'Algorithms',
};

const iconPathToAvatar = (iconPath: string, profileUrl: string): Avatar => ({
  imageUrl: iconPath,
  profileUrl,
});

const normalizeTechLabel = (tech: string) => {
  const key = tech.toLowerCase();
  return techLabelMap[key] || iconLabelMap[tech] || tech;
};

interface DemoProject {
  id: number;
  title: string;
  titlehead: string;
  des: string;
  img: string;
  iconLists: string[];
  link: string;
  github_url: string;
  category: string;
  featured: boolean;
  stars: number;
  language: string;
  topics: string[];
  deploymentState: 'Production' | 'Development';
  skills: string[];
  avatarUrls: Avatar[];
}

export default function DemoPage() {
  const [projects, setProjects] = useState<DemoProject[]>([]);  const [selectedProjects, setSelectedProjects] = useState<DemoProject[]>([]);
  const [maxProjectsToShow, setMaxProjectsToShow] = useState(4);
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  useEffect(() => {
    setLoading(true);
    (async () => {
      try {
        const response = await fetch('/api/projects');
        const result = await response.json();
        if (result.success && result.data) {
          const projectData = result.data as Array<{
            title: string;
            description?: string;
            category: string;
            tech_stack?: string[];
            topics?: string[];
            language?: string;
            live_url?: string;
            github_url?: string;
            featured?: boolean;
          }>;

          const mappedProjects = projectData.map((project, index) => {
            let iconLists: string[] = [];

            if (project.tech_stack && project.tech_stack.length > 0) {
              const isIconPath = project.tech_stack[0]?.startsWith('/');
              if (isIconPath) {
                iconLists = project.tech_stack.slice(0, 5);
              } else {
                iconLists = ProjectService.mapTechStackToIcons(project.tech_stack, project.language);
              }
            } else {
              const fallbackIcons = project.topics && project.topics.length > 0
                ? ProjectService.mapTechStackToIcons(project.topics, project.language)
                : ['/re.svg', '/ts.svg', '/next.svg', '/tail.svg'];
              iconLists = fallbackIcons;
            }

            const skills = (project.tech_stack && project.tech_stack.length > 0)
              ? project.tech_stack.map((tech: string) => normalizeTechLabel(tech))
              : (project.topics && project.topics.length > 0)
                ? project.topics.map((tech: string) => normalizeTechLabel(tech))
                : ['React', 'TypeScript', 'Next.js'];

            const deploymentState: 'Production' | 'Development' = project.live_url ? 'Production' : 'Development';

            const avatarUrls = iconLists.slice(0, 5).map((iconPath) =>
              iconPathToAvatar(iconPath, project.live_url || project.github_url || '#')
            );

            const featured = project.featured === true;

            return {
              id: index + 1,
              title: project.title,
              titlehead: project.title,
              des: project.description || "A comprehensive project showcasing modern development practices.",
              img: ProjectService.getProjectImage(project.category),
              iconLists: iconLists,
              link: project.live_url || project.github_url || "#",
              github_url: project.github_url || "",
              category: project.category,
              featured,
              stars: 0,
              language: project.language || 'JavaScript',
              topics: project.tech_stack || [],
              skills,
              avatarUrls,
              deploymentState,
            };
          });
          setProjects(mappedProjects);
        }
      } catch (error) {
        console.error('Failed to fetch projects for demo:', error);
        setProjects(createFallbackDemoProjects());
      } finally {
        setLoading(false);
      }
    })();
  }, [refreshKey]);

  useEffect(() => {
    // Update selected projects when max count changes
    setSelectedProjects(projects.slice(0, maxProjectsToShow));
  }, [projects, maxProjectsToShow]);
 

  const refreshDemo = () => {
    setRefreshKey(prev => prev + 1);
  };
  const createFallbackDemoProjects = (): DemoProject[] => [
    {
      id: 1,
      title: "AlgoViz - Algorithm Visualizer",
      titlehead: "AlgoViz",
      des: "Interactive algorithm visualization platform built with React and TypeScript for educational purposes.",
      img: "/p11.svg",
      iconLists: ["/re.svg", "/ts.svg", "/tail.svg", "/three.svg"],
      link: "https://algoviz-demo.vercel.app",
      github_url: "https://github.com/username/algoviz",
      category: "algorithms",
      featured: true,
      stars: 12,
      language: "TypeScript",
      topics: ["react", "algorithms", "visualization"],
      deploymentState: "Production",
      skills: ["React", "TypeScript", "Visualization"],
      avatarUrls: [
        { imageUrl: "/re.svg", profileUrl: "#" },
        { imageUrl: "/ts.svg", profileUrl: "#" },
        { imageUrl: "/three.svg", profileUrl: "#" },
      ],
    },
    {
      id: 2,
      title: "Sinema - Social Media Platform",
      titlehead: "Sinema",
      des: "Full-stack social media web application built for movie lovers to connect and share cinema experiences.",
      img: "/p.svg",
      iconLists: ["/re.svg", "/next.svg", "/c.svg", "/dock.svg"],
      link: "https://sinema-demo.vercel.app",
      github_url: "https://github.com/username/sinema",
      category: "social-media",
      featured: true,
      stars: 8,
      language: "JavaScript",
      topics: ["social-media", "movies", "fullstack"],
      deploymentState: "Production",
      skills: ["Social Media", "Full Stack", "Movies"],
      avatarUrls: [
        { imageUrl: "/re.svg", profileUrl: "#" },
        { imageUrl: "/next.svg", profileUrl: "#" },
        { imageUrl: "/c.svg", profileUrl: "#" },
      ],
    },
    {
      id: 3,
      title: "Aura - IoT Dashboard",
      titlehead: "Aura",
      des: "Smart IoT ecosystem for home automation with real-time sensor monitoring and control.",
      img: "/p2.svg",
      iconLists: ["/re.svg", "/ts.svg", "/cloud.svg", "/host.svg"],
      link: "https://aura-iot.vercel.app",
      github_url: "https://github.com/username/aura",
      category: "backend-api",
      featured: false,
      stars: 5,
      language: "TypeScript",
      topics: ["iot", "sensors", "realtime"],
      deploymentState: "Development",
      skills: ["IoT", "Sensors", "Realtime"],
      avatarUrls: [
        { imageUrl: "/re.svg", profileUrl: "#" },
        { imageUrl: "/ts.svg", profileUrl: "#" },
        { imageUrl: "/cloud.svg", profileUrl: "#" },
      ],
    },
    {
      id: 4,
      title: "Vibeyy - Music Discovery",
      titlehead: "Vibeyy",
      des: "Music discovery platform with AI-powered recommendations and social sharing features.",
      img: "/p3.svg",
      iconLists: ["/re.svg", "/next.svg", "/tail.svg", "/stream.svg"],
      link: "https://vibeyy-demo.vercel.app",
      github_url: "https://github.com/username/vibeyy",
      category: "full-stack",
      featured: false,
      stars: 3,
      language: "JavaScript",
      topics: ["music", "ai", "social"],
      deploymentState: "Development",
      skills: ["Music", "AI", "Social"],
      avatarUrls: [
        { imageUrl: "/re.svg", profileUrl: "#" },
        { imageUrl: "/next.svg", profileUrl: "#" },
        { imageUrl: "/stream.svg", profileUrl: "#" },
      ],
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white relative overflow-clip">
      {/* Background Grid Pattern */}
      <div
        className={cn(
          "absolute inset-0 opacity-30",
          "[background-size:80px_80px]",
          "dark:[background-image:linear-gradient(to_right,rgba(38,38,38,0.60)_1px,transparent_1px),linear-gradient(to_bottom,rgba(38,38,38,0.55)_1px,transparent_1px)]"
        )}
      />

      {/* Spotlight Effects */}
      <div>
        <Spotlight className="-top-40 -left-10 md:left-10 md:-top-5 h-screen" fill="white" />
        <Spotlight className="top-10 left-full h-[80vh] w-[50vw]" fill="purple" />
        <Spotlight className="top-28 left-80 h-[80vh] w-[50vw]" fill="blue" />
      </div>

      {/* Navigation */}
      <div className="bg-black/50 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <a
                href="/dashboard"
                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
              >
                <FaArrowLeft />
                <span>Back to Dashboard</span>
              </a>
              <div className="h-6 w-px bg-gray-600" />
              <h1 className="text-xl font-bold text-white">Demo Preview</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="px-3 py-1 bg-purple-600 text-white text-sm rounded-full">
                🎯 Portfolio Preview
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="heading mb-4">
            Portfolio <span className="text-purple-300">Preview</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-8">
            This is how your selected projects will appear on the main portfolio using the WorkCard layout
          </p>
          {/* Project Count Controller */}
          <div className="flex justify-center items-center gap-6 mb-8">
            <div className="flex items-center gap-4">
              <label className="text-gray-300">Projects to Display:</label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setMaxProjectsToShow(Math.max(1, maxProjectsToShow - 1))}
                  className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-white"
                >
                  -
                </button>
                <span className="px-4 py-2 bg-purple-600 text-white rounded font-medium">
                  {maxProjectsToShow}
                </span>
                <button
                  onClick={() => setMaxProjectsToShow(Math.min(projects.length, maxProjectsToShow + 1))}
                  className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-white"
                >
                  +
                </button>
              </div>
              <span className="text-gray-400 text-sm">
                (Total: {projects.length} projects)
              </span>
            </div>
            
            <button
              onClick={refreshDemo}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg font-medium transition-colors"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-blue-300 border-t-transparent rounded-full animate-spin" />
              ) : (
                <FaEye className="w-4 h-4" />
              )}
              {loading ? 'Refreshing...' : 'Refresh Demo'}
            </button>
          </div>
        </motion.div>

        {/* Preview Section */}
        <div className="py-20 relative scale-90">
          <h2 className="heading mb-10">
            A small selection of{" "}
            <span className="text-purple-300">recent projects</span>
          </h2>
          
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="mx-auto max-w-6xl">
              <div className="grid gap-8 lg:grid-cols-2 p-4 mt-10">
                {selectedProjects.map((item) => {
                const workItem = {
                  title: item.title,
                  description: item.des,
                  skills: item.skills || item.topics || [],
                  avatarUrls: item.avatarUrls || [],
                  image: item.img,
                  deploymentState: item.deploymentState,
                  href: item.link || item.github_url || '#',
                  githubUrl: item.github_url,
                };

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: item.id * 0.06 }}
                    className="w-full"
                  >
                    <div className="mx-auto">
                      <WorkCard item={workItem} />
                    </div>
                  </motion.div>
                );
              })}
              </div>
            </div>
          )}
        </div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-gray-900/80 to-gray-800/80 border border-gray-700/50 rounded-xl p-6 mt-12"
        >
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <span className="mr-2">💡</span>
            Demo Instructions
          </h3>
          <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-300">
            <div>
              <h4 className="font-medium text-blue-400 mb-2">What you are seeing:</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>Your projects displayed with the 3D Pin component</li>
                <li>Same layout and styling as your main portfolio</li>
                <li>Interactive hover effects and animations</li>
                <li>Proper icon mapping and project images</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-purple-400 mb-2">How to use:</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>Adjust the project count using +/- buttons</li>
                <li>The ID number determines display order</li>
                <li>Go back to Dashboard to select/configure projects</li>
                <li>Changes in Dashboard will reflect here automatically</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
