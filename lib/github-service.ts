interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  topics: string[];
  created_at: string;
  updated_at: string;
  fork: boolean;
}

export class GitHubService {
  private readonly baseUrl = 'https://api.github.com';
  private readonly token = process.env.GITHUB_TOKEN;
  private readonly username = process.env.GITHUB_USERNAME;

  private get headers() {
    return {
      'Authorization': `Bearer ${this.token}`,
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'Portfolio-App'
    };
  }  async getRepositories(): Promise<GitHubRepo[]> {
    try {
      // Prepare fetch options with environment-based caching
      const fetchOptions: RequestInit = {
        headers: this.headers,
      };

      // Environment-based caching strategy
      if (process.env.NODE_ENV === 'production') {
        // Production: Cache for 1 hour to reduce API calls and improve performance
        fetchOptions.next = { revalidate: 3600 };
      } else {
        // Development: No cache to get fresh data for testing repo updates
        fetchOptions.cache = 'no-cache';
      }

      // Original caching (commented out for reference):
      // next: { revalidate: 3600 } // Cache for 1 hour

      const response = await fetch(
        `${this.baseUrl}/users/${this.username}/repos?sort=updated&per_page=100&type=owner`,
        fetchOptions
      );

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
      }

      const repos: GitHubRepo[] = await response.json();
      
      // Debug: Log all repos before filtering
      console.log('🔍 All GitHub repos:', repos.map(r => ({
        name: r.name,
        description: r.description,
        fork: r.fork,
        stars: r.stargazers_count
      })));

      return this.filterPortfolioRepos(repos);
    } catch (error) {
      console.error('Error fetching GitHub repositories:', error);
      throw error;
    }
  }

  private filterPortfolioRepos(repos: GitHubRepo[]): GitHubRepo[] {
    return repos.filter(repo => {
      // Filter out forks and non-portfolio projects
      return !repo.fork && 
             repo.description && 
             !repo.name.toLowerCase().includes('practice') &&
             !repo.name.toLowerCase().includes('tutorial') &&
             !repo.name.toLowerCase().includes('test') &&
             repo.stargazers_count >= 0; // Include all repos with descriptions
    });
  }

  categorizeProject(topics: string[], language: string | null, name: string): string {
    const topicsLower = topics.map(t => t.toLowerCase());
    const nameLower = name.toLowerCase();

    if (topicsLower.includes('fullstack') || topicsLower.includes('full-stack')) {
      return 'fullstack';
    }
    if (topicsLower.includes('backend') || topicsLower.includes('api') || topicsLower.includes('server')) {
      return 'backend';
    }
    if (topicsLower.includes('mobile') || topicsLower.includes('react-native') || topicsLower.includes('flutter')) {
      return 'mobile';
    }
    if (language === 'JavaScript' || language === 'TypeScript' || language === 'HTML' || language === 'CSS') {
      return 'frontend';
    }
    if (nameLower.includes('algo') || nameLower.includes('dsa') || nameLower.includes('leetcode')) {
      return 'algorithms';
    }
    
    return 'other';
  }

  generateProjectImage(projectName: string): string {
    // Generate a consistent image URL for each project
    const encodedName = encodeURIComponent(projectName.replace(/-/g, ' '));
    return `https://via.placeholder.com/600x400/1a1a1a/ffffff?text=${encodedName}`;
  }

  formatProjectTitle(repoName: string): string {
    return repoName
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}
