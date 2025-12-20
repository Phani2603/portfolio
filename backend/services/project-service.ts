// Type definitions for better TypeScript support
type TechStackIconKey = 
  | 'react' | 'typescript' | 'nextjs' | 'next' | 'tailwindcss' | 'tailwind'
  | 'threejs' | 'three.js' | 'framer-motion' | 'gsap' | 'docker' | 'git'
  | 'javascript' | 'nodejs' | 'clerk' | 'authentication' | 'twitter' | 'x'
  | 'social-media' | 'hostinger' | 'hosting' | 'cloud' | 'streaming' | 'realtime'
  | 'default';

type ProjectImageKey = 
  | 'web application' | 'frontend library' | 'backend api' | 'backend' | 'full stack'
  | 'fullstack' | 'mobile app' | 'mobile' | 'data science' | 'devops' | 'game development'
  | 'machine learning' | 'algorithms' | 'social-media' | 'other' | 'default';

export class ProjectService {
  private static techStackIconMap: Record<TechStackIconKey, string> = {
    // Frontend
    'react': '/re.svg',
    'typescript': '/ts.svg',
    'nextjs': '/next.svg',
    'next': '/next.svg',
    'tailwindcss': '/tail.svg',
    'tailwind': '/tail.svg',
    'threejs': '/three.svg',
    'three.js': '/three.svg',
    'framer-motion': '/fm.svg',
    'gsap': '/gsap.svg',
    
    // Backend & Tools
    'docker': '/dock.svg',
    'git': '/git.svg',
    'javascript': '/c.svg', // Actually Clerk icon
    'nodejs': '/c.svg',
    'clerk': '/c.svg',
    'authentication': '/c.svg',
    
    // Social & Hosting
    'twitter': '/p.svg', // X (formerly Twitter)
    'x': '/p.svg',
    'social-media': '/p.svg',
    'hostinger': '/host.svg',
    'hosting': '/host.svg',
    'cloud': '/cloud.svg',
    'streaming': '/stream.svg',
    'realtime': '/stream.svg',
    
    // Default fallback
    'default': '/tail.svg'
  };
  private static projectImageMap: Record<ProjectImageKey, string> = {
    'web application': '/p1.svg',
    'frontend library': '/p1.svg',
    'backend api': '/p2.svg', 
    'backend': '/p2.svg',
    'full stack': '/p3.svg',
    'fullstack': '/p3.svg',
    'mobile app': '/p4.svg',
    'mobile': '/p4.svg',
    'data science': '/p11.svg',
    'machine learning': '/p11.svg',
    'algorithms': '/p11.svg',
    'game development': '/p4.svg',
    'devops': '/p2.svg',
    'social-media': '/p2.svg',
    'other': '/p1.svg',
    'default': '/p1.svg'
  };
  static mapTechStackToIcons(topics: string[], language?: string): string[] {
    const allTech = [...topics, ...(language ? [language] : [])];
    return allTech
      .map(tech => {
        const techKey = tech.toLowerCase() as TechStackIconKey;
        return this.techStackIconMap[techKey] || this.techStackIconMap.default;
      })
      .filter((icon, index, arr) => arr.indexOf(icon) === index) // Remove duplicates
      .slice(0, 5); // Limit to 5 icons
  }

  static getProjectImage(category: string): string {
    const categoryKey = category.toLowerCase() as ProjectImageKey;
    return this.projectImageMap[categoryKey] || this.projectImageMap.default;
  }

  static categorizeProject(repo: any): string {
    const name = repo.name.toLowerCase();
    const description = (repo.description || '').toLowerCase();
    const topics = (repo.topics || []).map((t: string) => t.toLowerCase());
    
    // Check for specific keywords
    if (topics.includes('social-media') || name.includes('social') || description.includes('social')) {
      return 'social-media';
    }
    if (topics.includes('mobile') || topics.includes('react-native') || topics.includes('flutter')) {
      return 'mobile-app';
    }
    if (topics.includes('backend') || topics.includes('api') || topics.includes('server')) {
      return 'backend-api';
    }
    if (topics.includes('fullstack') || topics.includes('full-stack')) {
      return 'full-stack';
    }
    if (topics.includes('algorithm') || topics.includes('data-science') || name.includes('algo')) {
      return 'algorithms';
    }
    
    // Default to web application
    return 'web-application';
  }

  static mapGitHubRepoToProject(repo: any, displayOrder: number): any {
    return {
      id: displayOrder, // This determines display order (1, 2, 3, etc.)
      title: repo.name,
      titlehead: repo.name,
      des: repo.description || "A comprehensive project showcasing modern development practices.",
      img: this.getProjectImage(this.categorizeProject(repo)),
      iconLists: this.mapTechStackToIcons(repo.topics || [], repo.language),
      link: repo.homepage || repo.html_url,
      github_url: repo.html_url,
      category: this.categorizeProject(repo),
      featured: repo.stargazers_count > 2,
      show_in_portfolio: true,
      stars: repo.stargazers_count,
      language: repo.language,
      topics: repo.topics || [],
      created_at: repo.created_at,
      updated_at: repo.updated_at
    };
  }
}
