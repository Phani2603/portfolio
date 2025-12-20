# 🏗️ Backend Foundation Establishment Structure

## Complete Backend Architecture for Portfolio Enhancement

### 🎯 **PROJECT OVERVIEW**

#### **Goal**: Transform static portfolio into dynamic, data-driven platform
#### **Timeline**: 2-3 weeks development
#### **Tech Stack**: Supabase + Next.js API Routes + External APIs

---

## 🛠️ **PHASE 1: FOUNDATION SETUP (Days 1-3)**

### **1.1 Database Architecture (Supabase)**

#### **Core Tables Structure:**
```sql
-- Projects Table
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  long_description TEXT,
  technologies TEXT[] NOT NULL,
  github_url VARCHAR(500) NOT NULL,
  live_url VARCHAR(500),
  image_url VARCHAR(500),
  featured BOOLEAN DEFAULT false,
  category VARCHAR(100) NOT NULL, -- 'frontend', 'fullstack', 'backend', 'mobile'
  status VARCHAR(50) DEFAULT 'completed', -- 'in-progress', 'completed', 'archived'
  stars INTEGER DEFAULT 0,
  forks INTEGER DEFAULT 0,
  language VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_synced TIMESTAMP DEFAULT NOW()
);

-- Skills Table
CREATE TABLE skills (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  category VARCHAR(50) NOT NULL, -- 'frontend', 'backend', 'database', 'tools', 'languages'
  proficiency INTEGER CHECK (proficiency >= 1 AND proficiency <= 5),
  icon_url VARCHAR(500),
  years_experience DECIMAL(3,1),
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Coding Stats Table
CREATE TABLE coding_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  platform VARCHAR(50) NOT NULL, -- 'leetcode', 'hackerrank', 'codechef', 'codeforces'
  username VARCHAR(100) NOT NULL,
  total_solved INTEGER DEFAULT 0,
  easy_solved INTEGER DEFAULT 0,
  medium_solved INTEGER DEFAULT 0,
  hard_solved INTEGER DEFAULT 0,
  contest_rating INTEGER DEFAULT 0,
  global_ranking INTEGER,
  badges TEXT[], -- Array of badge names/URLs
  streak_current INTEGER DEFAULT 0,
  streak_max INTEGER DEFAULT 0,
  last_updated TIMESTAMP DEFAULT NOW(),
  profile_url VARCHAR(500)
);

-- Achievements/Certifications Table
CREATE TABLE achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  issuer VARCHAR(255) NOT NULL,
  description TEXT,
  credential_url VARCHAR(500),
  badge_url VARCHAR(500),
  issued_date DATE NOT NULL,
  expiry_date DATE,
  skills_demonstrated TEXT[],
  created_at TIMESTAMP DEFAULT NOW()
);

-- Contact Messages Table
CREATE TABLE contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(255),
  message TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'unread', -- 'unread', 'read', 'replied'
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Analytics Table
CREATE TABLE page_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page_path VARCHAR(255) NOT NULL,
  visitor_id VARCHAR(255), -- Anonymous visitor tracking
  session_id VARCHAR(255),
  referrer VARCHAR(500),
  device_type VARCHAR(50), -- 'desktop', 'mobile', 'tablet'
  browser VARCHAR(100),
  country VARCHAR(100),
  visit_duration INTEGER, -- in seconds
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### **Row Level Security (RLS) Setup:**
```sql
-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE coding_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Public read access for portfolio data
CREATE POLICY "Public read access" ON projects FOR SELECT USING (true);
CREATE POLICY "Public read access" ON skills FOR SELECT USING (true);
CREATE POLICY "Public read access" ON coding_stats FOR SELECT USING (true);
CREATE POLICY "Public read access" ON achievements FOR SELECT USING (true);

-- Contact messages - no public access
CREATE POLICY "No public access" ON contact_messages FOR SELECT TO authenticated;
```

### **1.2 Environment Configuration**

#### **Environment Variables Setup:**
```bash
# .env.local
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# GitHub API
GITHUB_TOKEN=your_github_personal_access_token
GITHUB_USERNAME=Phani2603

# Coding Platform APIs
LEETCODE_USERNAME=your_leetcode_username
HACKERRANK_API_KEY=your_hackerrank_api_key
CODECHEF_USERNAME=your_codechef_username
CODEFORCES_USERNAME=your_codeforces_username

# Email Service (Resend/SendGrid/Nodemailer)
RESEND_API_KEY=your_resend_api_key
FROM_EMAIL=kusumbaphanisrikar@gmail.com
TO_EMAIL=kusumbaphanisrikar@gmail.com

# Analytics
GOOGLE_ANALYTICS_ID=GA_TRACKING_ID
VERCEL_ANALYTICS_ID=your_vercel_analytics_id

# Security
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

# Rate Limiting
UPSTASH_REDIS_REST_URL=your_upstash_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_token

# Miscellaneous
NODE_ENV=development
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### **1.3 Supabase Client Setup**

#### **Supabase Configuration Files:**
```typescript
// lib/supabase/client.ts
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types/database'

export const createClient = () => createClientComponentClient<Database>()
```

```typescript
// lib/supabase/server.ts
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Database } from '@/types/database'

export const createServerClient = () => {
  const cookieStore = cookies()
  return createServerComponentClient<Database>({ cookies: () => cookieStore })
}
```

```typescript
// lib/supabase/admin.ts
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'

export const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
```

---

## 🔗 **PHASE 2: API INTEGRATIONS (Days 4-7)**

### **2.1 GitHub API Integration**

#### **GitHub Data Fetcher:**
```typescript
// lib/github/api.ts
interface GitHubRepo {
  id: number;
  name: string;
  description: string;
  html_url: string;
  homepage: string;
  language: string;
  stargazers_count: number;
  forks_count: number;
  topics: string[];
  created_at: string;
  updated_at: string;
  pushed_at: string;
}

export class GitHubService {
  private readonly baseUrl = 'https://api.github.com';
  private readonly headers = {
    'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
    'Accept': 'application/vnd.github.v3+json',
  };

  async getRepositories(username: string): Promise<GitHubRepo[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/users/${username}/repos?sort=updated&per_page=100`,
        { headers: this.headers }
      );
      
      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching repositories:', error);
      throw error;
    }
  }

  async getRepositoryDetails(username: string, repo: string) {
    try {
      const [repoData, languages, commits] = await Promise.all([
        fetch(`${this.baseUrl}/repos/${username}/${repo}`, { headers: this.headers }),
        fetch(`${this.baseUrl}/repos/${username}/${repo}/languages`, { headers: this.headers }),
        fetch(`${this.baseUrl}/repos/${username}/${repo}/commits?per_page=1`, { headers: this.headers })
      ]);

      return {
        repo: await repoData.json(),
        languages: await languages.json(),
        lastCommit: await commits.json()
      };
    } catch (error) {
      console.error('Error fetching repository details:', error);
      throw error;
    }
  }

  filterPortfolioProjects(repos: GitHubRepo[]): GitHubRepo[] {
    return repos.filter(repo => {
      // Filter out forks, empty repos, and non-portfolio projects
      return !repo.fork && 
             repo.description && 
             repo.stargazers_count >= 0 &&
             !repo.name.includes('practice') &&
             !repo.name.includes('tutorial');
    });
  }
}
```

### **2.2 Coding Platforms API Integration**

#### **LeetCode Stats Fetcher:**
```typescript
// lib/coding-platforms/leetcode.ts
interface LeetCodeStats {
  totalSolved: number;
  totalQuestions: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  acceptanceRate: number;
  ranking: number;
  contributionPoints: number;
  reputation: number;
}

export class LeetCodeService {
  async getUserStats(username: string): Promise<LeetCodeStats> {
    try {
      // Using LeetCode's GraphQL API (unofficial)
      const query = `
        query getUserProfile($username: String!) {
          matchedUser(username: $username) {
            submitStats: submitStatsGlobal {
              acSubmissionNum {
                difficulty
                count
                submissions
              }
            }
            profile {
              ranking
              reputation
              userAvatar
            }
          }
        }
      `;

      const response = await fetch('https://leetcode.com/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Referer': 'https://leetcode.com',
        },
        body: JSON.stringify({
          query,
          variables: { username }
        })
      });

      const data = await response.json();
      return this.parseStats(data);
    } catch (error) {
      console.error('Error fetching LeetCode stats:', error);
      throw error;
    }
  }

  private parseStats(data: any): LeetCodeStats {
    const stats = data.data.matchedUser.submitStats.acSubmissionNum;
    return {
      totalSolved: stats.reduce((sum: number, item: any) => sum + item.count, 0),
      totalQuestions: 3000, // Approximate
      easySolved: stats.find((s: any) => s.difficulty === 'Easy')?.count || 0,
      mediumSolved: stats.find((s: any) => s.difficulty === 'Medium')?.count || 0,
      hardSolved: stats.find((s: any) => s.difficulty === 'Hard')?.count || 0,
      acceptanceRate: 0, // Calculate from submissions
      ranking: data.data.matchedUser.profile.ranking,
      contributionPoints: 0,
      reputation: data.data.matchedUser.profile.reputation
    };
  }
}
```

#### **Multi-Platform Stats Aggregator:**
```typescript
// lib/coding-platforms/aggregator.ts
export class CodingStatsAggregator {
  private leetcode = new LeetCodeService();
  private hackerrank = new HackerRankService();
  private codechef = new CodeChefService();
  private codeforces = new CodeforcesService();

  async aggregateAllStats(usernames: {
    leetcode: string;
    hackerrank: string;
    codechef: string;
    codeforces: string;
  }) {
    try {
      const [leetcodeStats, hackerrankStats, codechefStats, codeforcesStats] = 
        await Promise.allSettled([
          this.leetcode.getUserStats(usernames.leetcode),
          this.hackerrank.getUserStats(usernames.hackerrank),
          this.codechef.getUserStats(usernames.codechef),
          this.codeforces.getUserStats(usernames.codeforces)
        ]);

      return {
        leetcode: leetcodeStats.status === 'fulfilled' ? leetcodeStats.value : null,
        hackerrank: hackerrankStats.status === 'fulfilled' ? hackerrankStats.value : null,
        codechef: codechefStats.status === 'fulfilled' ? codechefStats.value : null,
        codeforces: codeforcesStats.status === 'fulfilled' ? codeforcesStats.value : null,
        totalSolved: this.calculateTotalSolved([
          leetcodeStats.status === 'fulfilled' ? leetcodeStats.value : null,
          hackerrankStats.status === 'fulfilled' ? hackerrankStats.value : null,
          codechefStats.status === 'fulfilled' ? codechefStats.value : null,
          codeforcesStats.status === 'fulfilled' ? codeforcesStats.value : null
        ])
      };
    } catch (error) {
      console.error('Error aggregating coding stats:', error);
      throw error;
    }
  }

  private calculateTotalSolved(stats: any[]): number {
    return stats.reduce((total, stat) => {
      if (stat?.totalSolved) {
        return total + stat.totalSolved;
      }
      return total;
    }, 0);
  }
}
```

---

## 🔄 **PHASE 3: DATA SYNCHRONIZATION (Days 8-10)**

### **3.1 Automated Data Sync Jobs**

#### **GitHub Sync Service:**
```typescript
// lib/sync/github-sync.ts
export class GitHubSyncService {
  private github = new GitHubService();
  private supabase = supabaseAdmin;

  async syncProjects(username: string): Promise<void> {
    try {
      console.log('Starting GitHub projects sync...');
      
      // Fetch repositories from GitHub
      const repos = await this.github.getRepositories(username);
      const portfolioRepos = this.github.filterPortfolioProjects(repos);

      // Sync each repository
      for (const repo of portfolioRepos) {
        await this.syncSingleProject(repo, username);
      }

      console.log(`Synced ${portfolioRepos.length} projects successfully`);
    } catch (error) {
      console.error('GitHub sync failed:', error);
      throw error;
    }
  }

  private async syncSingleProject(repo: GitHubRepo, username: string): Promise<void> {
    const projectData = {
      title: repo.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      description: repo.description || 'No description available',
      technologies: repo.topics || [repo.language].filter(Boolean),
      github_url: repo.html_url,
      live_url: repo.homepage || null,
      image_url: await this.generateProjectImage(repo.name),
      featured: repo.stargazers_count > 5 || repo.topics.includes('portfolio'),
      category: this.categorizeProject(repo.topics, repo.language),
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      language: repo.language,
      last_synced: new Date().toISOString()
    };

    // Upsert project data
    const { error } = await this.supabase
      .from('projects')
      .upsert(projectData, { 
        onConflict: 'github_url',
        ignoreDuplicates: false 
      });

    if (error) {
      console.error(`Error syncing project ${repo.name}:`, error);
    }
  }

  private categorizeProject(topics: string[], language: string): string {
    if (topics.includes('fullstack') || topics.includes('full-stack')) return 'fullstack';
    if (topics.includes('backend') || topics.includes('api')) return 'backend';
    if (topics.includes('mobile') || topics.includes('react-native')) return 'mobile';
    if (language === 'JavaScript' || language === 'TypeScript' || language === 'HTML') return 'frontend';
    return 'other';
  }

  private async generateProjectImage(projectName: string): Promise<string> {
    // Generate a placeholder image URL or use a service like Unsplash
    return `https://via.placeholder.com/600x400/1a1a1a/ffffff?text=${encodeURIComponent(projectName)}`;
  }
}
```

#### **Coding Stats Sync Service:**
```typescript
// lib/sync/coding-stats-sync.ts
export class CodingStatsSyncService {
  private aggregator = new CodingStatsAggregator();
  private supabase = supabaseAdmin;

  async syncAllPlatforms(): Promise<void> {
    const usernames = {
      leetcode: process.env.LEETCODE_USERNAME!,
      hackerrank: process.env.HACKERRANK_USERNAME!,
      codechef: process.env.CODECHEF_USERNAME!,
      codeforces: process.env.CODEFORCES_USERNAME!
    };

    try {
      const stats = await this.aggregator.aggregateAllStats(usernames);
      
      // Sync each platform's stats
      await Promise.all([
        this.syncPlatformStats('leetcode', stats.leetcode, usernames.leetcode),
        this.syncPlatformStats('hackerrank', stats.hackerrank, usernames.hackerrank),
        this.syncPlatformStats('codechef', stats.codechef, usernames.codechef),
        this.syncPlatformStats('codeforces', stats.codeforces, usernames.codeforces)
      ]);

      console.log('Coding stats sync completed successfully');
    } catch (error) {
      console.error('Coding stats sync failed:', error);
      throw error;
    }
  }

  private async syncPlatformStats(platform: string, stats: any, username: string): Promise<void> {
    if (!stats) return;

    const { error } = await this.supabase
      .from('coding_stats')
      .upsert({
        platform,
        username,
        total_solved: stats.totalSolved || 0,
        easy_solved: stats.easySolved || 0,
        medium_solved: stats.mediumSolved || 0,
        hard_solved: stats.hardSolved || 0,
        contest_rating: stats.rating || 0,
        global_ranking: stats.ranking || null,
        streak_current: stats.currentStreak || 0,
        streak_max: stats.maxStreak || 0,
        last_updated: new Date().toISOString(),
        profile_url: this.getProfileUrl(platform, username)
      }, { 
        onConflict: 'platform,username' 
      });

    if (error) {
      console.error(`Error syncing ${platform} stats:`, error);
    }
  }

  private getProfileUrl(platform: string, username: string): string {
    const urls = {
      leetcode: `https://leetcode.com/${username}`,
      hackerrank: `https://www.hackerrank.com/${username}`,
      codechef: `https://www.codechef.com/users/${username}`,
      codeforces: `https://codeforces.com/profile/${username}`
    };
    return urls[platform as keyof typeof urls] || '';
  }
}
```

### **3.2 Scheduled Sync Jobs**

#### **Cron Job Setup:**
```typescript
// app/api/cron/sync-data/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { GitHubSyncService } from '@/lib/sync/github-sync';
import { CodingStatsSyncService } from '@/lib/sync/coding-stats-sync';

export async function GET(request: NextRequest) {
  // Verify cron secret to prevent unauthorized access
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const githubSync = new GitHubSyncService();
    const codingStatsSync = new CodingStatsSyncService();

    // Run sync jobs in parallel
    await Promise.all([
      githubSync.syncProjects(process.env.GITHUB_USERNAME!),
      codingStatsSync.syncAllPlatforms()
    ]);

    return NextResponse.json({ 
      success: true, 
      message: 'Data sync completed successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Sync job failed:', error);
    return NextResponse.json({ 
      error: 'Sync job failed', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
```

#### **Vercel Cron Configuration:**
```json
// vercel.json
{
  "functions": {
    "app/api/cron/sync-data/route.ts": {
      "maxDuration": 300
    }
  },
  "crons": [
    {
      "path": "/api/cron/sync-data",
      "schedule": "0 */6 * * *"
    }
  ]
}
```

---

## 🌐 **PHASE 4: API ROUTES & SERVICES (Days 11-14)**

### **4.1 Core API Routes**

#### **Projects API:**
```typescript
// app/api/projects/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient();
    const { searchParams } = new URL(request.url);
    
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    let query = supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (category && category !== 'all') {
      query = query.eq('category', category);
    }

    if (featured === 'true') {
      query = query.eq('featured', true);
    }

    const { data, error, count } = await query;

    if (error) {
      throw error;
    }

    return NextResponse.json({
      projects: data,
      total: count,
      hasMore: count ? count > offset + limit : false
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

// GET /api/projects/[id] - Single project
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerClient();
    
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ project: data });
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json(
      { error: 'Project not found' },
      { status: 404 }
    );
  }
}
```

#### **Skills API:**
```typescript
// app/api/skills/route.ts
export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    let query = supabase
      .from('skills')
      .select('*')
      .order('proficiency', { ascending: false });

    if (category && category !== 'all') {
      query = query.eq('category', category);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    // Group skills by category
    const groupedSkills = data.reduce((acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = [];
      }
      acc[skill.category].push(skill);
      return acc;
    }, {} as Record<string, typeof data>);

    return NextResponse.json({
      skills: data,
      groupedSkills,
      categories: Object.keys(groupedSkills)
    });
  } catch (error) {
    console.error('Error fetching skills:', error);
    return NextResponse.json(
      { error: 'Failed to fetch skills' },
      { status: 500 }
    );
  }
}
```

#### **Coding Stats API:**
```typescript
// app/api/coding-stats/route.ts
export async function GET() {
  try {
    const supabase = createServerClient();
    
    const { data, error } = await supabase
      .from('coding_stats')
      .select('*')
      .order('last_updated', { ascending: false });

    if (error) {
      throw error;
    }

    // Calculate total stats across all platforms
    const totalStats = data.reduce((total, platform) => ({
      totalSolved: total.totalSolved + platform.total_solved,
      totalEasy: total.totalEasy + platform.easy_solved,
      totalMedium: total.totalMedium + platform.medium_solved,
      totalHard: total.totalHard + platform.hard_solved,
    }), {
      totalSolved: 0,
      totalEasy: 0,
      totalMedium: 0,
      totalHard: 0
    });

    return NextResponse.json({
      platforms: data,
      summary: totalStats,
      lastUpdated: data[0]?.last_updated || null
    });
  } catch (error) {
    console.error('Error fetching coding stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch coding stats' },
      { status: 500 }
    );
  }
}
```

### **4.2 Contact Form API**

#### **Contact Form Handler:**
```typescript
// app/api/contact/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';
import { createServerClient } from '@/lib/supabase/server';
import { rateLimit } from '@/lib/rate-limit';

const resend = new Resend(process.env.RESEND_API_KEY);

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters')
});

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const identifier = request.ip ?? 'anonymous';
    const rateLimitResult = await rateLimit(identifier, 5, 3600); // 5 emails per hour
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const validatedData = contactSchema.parse(body);

    const supabase = createServerClient();

    // Save to database
    const { error: dbError } = await supabase
      .from('contact_messages')
      .insert({
        name: validatedData.name,
        email: validatedData.email,
        subject: validatedData.subject,
        message: validatedData.message,
        ip_address: request.ip,
        user_agent: request.headers.get('user-agent')
      });

    if (dbError) {
      throw dbError;
    }

    // Send email notification
    await resend.emails.send({
      from: 'portfolio@your-domain.com',
      to: process.env.TO_EMAIL!,
      subject: `Portfolio Contact: ${validatedData.subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">New Contact Form Submission</h2>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${validatedData.name}</p>
            <p><strong>Email:</strong> ${validatedData.email}</p>
            <p><strong>Subject:</strong> ${validatedData.subject}</p>
          </div>
          <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #6366f1;">
            <h3>Message:</h3>
            <p style="line-height: 1.6;">${validatedData.message.replace(/\n/g, '<br>')}</p>
          </div>
          <p style="color: #666; font-size: 12px; margin-top: 20px;">
            Sent from your portfolio contact form
          </p>
        </div>
      `
    });

    // Send auto-reply to sender
    await resend.emails.send({
      from: 'noreply@your-domain.com',
      to: validatedData.email,
      subject: 'Thanks for reaching out!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Thanks for your message, ${validatedData.name}!</h2>
          <p>I've received your message and will get back to you as soon as possible.</p>
          <p>Best regards,<br>Phani Srikar</p>
        </div>
      `
    });

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully!'
    });

  } catch (error) {
    console.error('Contact form error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to send message. Please try again.' },
      { status: 500 }
    );
  }
}
```

---

## 🔒 **PHASE 5: SECURITY & OPTIMIZATION (Days 15-17)**

### **5.1 Security Implementation**

#### **Rate Limiting Service:**
```typescript
// lib/rate-limit.ts
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

export async function rateLimit(
  identifier: string,
  limit: number,
  windowSeconds: number
): Promise<{ success: boolean; remaining: number; reset: number }> {
  const key = `rate_limit:${identifier}`;
  const window = Math.floor(Date.now() / 1000 / windowSeconds);
  const windowKey = `${key}:${window}`;

  try {
    const current = await redis.incr(windowKey);
    
    if (current === 1) {
      await redis.expire(windowKey, windowSeconds);
    }

    const remaining = Math.max(0, limit - current);
    const reset = (window + 1) * windowSeconds;

    return {
      success: current <= limit,
      remaining,
      reset
    };
  } catch (error) {
    console.error('Rate limiting error:', error);
    // Fail open - allow request if Redis is down
    return {
      success: true,
      remaining: limit,
      reset: Date.now() + windowSeconds * 1000
    };
  }
}
```

#### **Input Validation & Sanitization:**
```typescript
// lib/validation.ts
import { z } from 'zod';
import DOMPurify from 'isomorphic-dompurify';

export const sanitizeInput = (input: string): string => {
  return DOMPurify.sanitize(input, { ALLOWED_TAGS: [] });
};

export const projectSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().min(1).max(1000),
  technologies: z.array(z.string()).max(20),
  github_url: z.string().url(),
  live_url: z.string().url().optional(),
  category: z.enum(['frontend', 'backend', 'fullstack', 'mobile', 'other'])
});

export const skillSchema = z.object({
  name: z.string().min(1).max(100),
  category: z.enum(['frontend', 'backend', 'database', 'tools', 'languages']),
  proficiency: z.number().min(1).max(5),
  years_experience: z.number().min(0).max(20)
});
```

### **5.2 Caching Strategy**

#### **Redis Cache Implementation:**
```typescript
// lib/cache.ts
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

export class CacheService {
  async get<T>(key: string): Promise<T | null> {
    try {
      const data = await redis.get(key);
      return data as T;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  async set(key: string, value: any, ttlSeconds: number = 3600): Promise<void> {
    try {
      await redis.setex(key, ttlSeconds, JSON.stringify(value));
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }

  async del(key: string): Promise<void> {
    try {
      await redis.del(key);
    } catch (error) {
      console.error('Cache delete error:', error);
    }
  }

  async invalidatePattern(pattern: string): Promise<void> {
    try {
      const keys = await redis.keys(pattern);
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    } catch (error) {
      console.error('Cache invalidation error:', error);
    }
  }
}

// Cache keys
export const CACHE_KEYS = {
  PROJECTS: 'projects:all',
  PROJECTS_FEATURED: 'projects:featured',
  SKILLS: 'skills:all',
  CODING_STATS: 'coding_stats:all',
  GITHUB_REPOS: 'github:repos',
} as const;

// Cache TTL (in seconds)
export const CACHE_TTL = {
  SHORT: 300,    // 5 minutes
  MEDIUM: 1800,  // 30 minutes
  LONG: 3600,    // 1 hour
  VERY_LONG: 86400, // 24 hours
} as const;
```

### **5.3 Error Handling & Monitoring**

#### **Global Error Handler:**
```typescript
// lib/error-handler.ts
import { NextRequest, NextResponse } from 'next/server';

export class APIError extends Error {
  statusCode: number;
  code: string;

  constructor(message: string, statusCode: number = 500, code: string = 'INTERNAL_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.name = 'APIError';
  }
}

export function handleAPIError(error: unknown, request: NextRequest): NextResponse {
  console.error('API Error:', {
    error: error instanceof Error ? error.message : 'Unknown error',
    stack: error instanceof Error ? error.stack : undefined,
    url: request.url,
    method: request.method,
    timestamp: new Date().toISOString()
  });

  if (error instanceof APIError) {
    return NextResponse.json(
      { 
        error: error.message, 
        code: error.code 
      },
      { status: error.statusCode }
    );
  }

  if (error instanceof z.ZodError) {
    return NextResponse.json(
      { 
        error: 'Validation failed', 
        details: error.errors,
        code: 'VALIDATION_ERROR'
      },
      { status: 400 }
    );
  }

  return NextResponse.json(
    { 
      error: 'Internal server error',
      code: 'INTERNAL_ERROR'
    },
    { status: 500 }
  );
}

export function withErrorHandler(
  handler: (request: NextRequest, context?: any) => Promise<NextResponse>
) {
  return async (request: NextRequest, context?: any): Promise<NextResponse> => {
    try {
      return await handler(request, context);
    } catch (error) {
      return handleAPIError(error, request);
    }
  };
}
```

---

## 📊 **PHASE 6: ANALYTICS & MONITORING (Days 18-21)**

### **6.1 Analytics Implementation**

#### **Custom Analytics Service:**
```typescript
// lib/analytics.ts
export class AnalyticsService {
  private supabase = supabaseAdmin;

  async trackPageView(data: {
    page_path: string;
    visitor_id: string;
    session_id: string;
    referrer?: string;
    device_type: string;
    browser: string;
    country?: string;
  }): Promise<void> {
    try {
      await this.supabase
        .from('page_analytics')
        .insert({
          ...data,
          created_at: new Date().toISOString()
        });
    } catch (error) {
      console.error('Analytics tracking error:', error);
    }
  }

  async getAnalyticsSummary(days: number = 30) {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const { data, error } = await this.supabase
        .from('page_analytics')
        .select('*')
        .gte('created_at', startDate.toISOString());

      if (error) throw error;

      return {
        totalViews: data.length,
        uniqueVisitors: new Set(data.map(d => d.visitor_id)).size,
        topPages: this.getTopPages(data),
        deviceBreakdown: this.getDeviceBreakdown(data),
        referrerBreakdown: this.getReferrerBreakdown(data)
      };
    } catch (error) {
      console.error('Analytics summary error:', error);
      throw error;
    }
  }

  private getTopPages(data: any[]) {
    const pageViews = data.reduce((acc, item) => {
      acc[item.page_path] = (acc[item.page_path] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(pageViews)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([page, views]) => ({ page, views }));
  }

  private getDeviceBreakdown(data: any[]) {
    const devices = data.reduce((acc, item) => {
      acc[item.device_type] = (acc[item.device_type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return devices;
  }

  private getReferrerBreakdown(data: any[]) {
    const referrers = data.reduce((acc, item) => {
      const referrer = item.referrer || 'Direct';
      acc[referrer] = (acc[referrer] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(referrers)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([referrer, count]) => ({ referrer, count }));
  }
}
```

### **6.2 Performance Monitoring**

#### **Performance Metrics API:**
```typescript
// app/api/metrics/route.ts
export async function GET() {
  try {
    const supabase = createServerClient();
    
    // Get database metrics
    const [projectsCount, skillsCount, messagesCount, analyticsCount] = await Promise.all([
      supabase.from('projects').select('id', { count: 'exact', head: true }),
      supabase.from('skills').select('id', { count: 'exact', head: true }),
      supabase.from('contact_messages').select('id', { count: 'exact', head: true }),
      supabase.from('page_analytics').select('id', { count: 'exact', head: true })
    ]);

    // Get recent sync status
    const { data: recentProjects } = await supabase
      .from('projects')
      .select('last_synced')
      .order('last_synced', { ascending: false })
      .limit(1);

    const lastSyncTime = recentProjects?.[0]?.last_synced;

    return NextResponse.json({
      database: {
        projects: projectsCount.count || 0,
        skills: skillsCount.count || 0,
        messages: messagesCount.count || 0,
        pageViews: analyticsCount.count || 0
      },
      sync: {
        lastSync: lastSyncTime,
        status: lastSyncTime ? 'healthy' : 'needs_sync'
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Metrics error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch metrics' },
      { status: 500 }
    );
  }
}
```

---

## 🚀 **PHASE 7: FRONTEND INTEGRATION (Days 22-24)**

### **7.1 Data Fetching Hooks**

#### **Custom React Hooks:**
```typescript
// hooks/useProjects.ts
import { useState, useEffect } from 'react';
import { Project } from '@/types/database';

export function useProjects(category?: string, featured?: boolean) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProjects() {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (category) params.append('category', category);
        if (featured) params.append('featured', 'true');

        const response = await fetch(`/api/projects?${params}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch projects');
        }

        setProjects(data.projects);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, [category, featured]);

  return { projects, loading, error };
}

// hooks/useCodingStats.ts
export function useCodingStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        const response = await fetch('/api/coding-stats');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch coding stats');
        }

        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  return { stats, loading, error };
}
```

### **7.2 Updated Components**

#### **Dynamic Projects Section:**
```typescript
// components/DynamicProjects.tsx
'use client';

import { useProjects } from '@/hooks/useProjects';
import { ProjectCard } from './ProjectCard';
import { LoadingSpinner } from './ui/LoadingSpinner';

export function DynamicProjects() {
  const { projects, loading, error } = useProjects();

  if (loading) {
    return (
      <div className="py-20">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-20 text-center">
        <p className="text-red-400">Error loading projects: {error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <section className="py-20">
      <h2 className="text-4xl font-bold text-center mb-12">
        Recent <span className="text-purple-400">Projects</span>
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map(project => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
      
      {projects.length === 0 && (
        <p className="text-center text-gray-400">No projects found.</p>
      )}
    </section>
  );
}
```

#### **Coding Stats Display:**
```typescript
// components/CodingStats.tsx
'use client';

import { useCodingStats } from '@/hooks/useCodingStats';

export function CodingStats() {
  const { stats, loading, error } = useCodingStats();

  if (loading) return <div className="animate-pulse bg-gray-700 h-32 rounded-lg" />;
  if (error || !stats) return null;

  return (
    <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-lg p-6">
      <h3 className="text-2xl font-bold mb-4 text-center">
        Coding <span className="text-purple-400">Journey</span>
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div>
          <div className="text-3xl font-bold text-purple-400">{stats.summary.totalSolved}</div>
          <div className="text-sm text-gray-400">Problems Solved</div>
        </div>
        <div>
          <div className="text-3xl font-bold text-green-400">{stats.summary.totalEasy}</div>
          <div className="text-sm text-gray-400">Easy</div>
        </div>
        <div>
          <div className="text-3xl font-bold text-yellow-400">{stats.summary.totalMedium}</div>
          <div className="text-sm text-gray-400">Medium</div>
        </div>
        <div>
          <div className="text-3xl font-bold text-red-400">{stats.summary.totalHard}</div>
          <div className="text-sm text-gray-400">Hard</div>
        </div>
      </div>
      
      <div className="mt-6 flex flex-wrap justify-center gap-4">
        {stats.platforms.map((platform: any) => (
          <a
            key={platform.platform}
            href={platform.profile_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-1 bg-gray-800 rounded-full text-sm hover:bg-gray-700 transition-colors"
          >
            <span className="capitalize">{platform.platform}</span>
            <span className="text-purple-400">{platform.total_solved}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
```

---

## 📋 **FINAL CHECKLIST & DEPLOYMENT**

### **Pre-Deployment Checklist:**
- [ ] ✅ Database tables created and configured
- [ ] ✅ All API routes tested and working
- [ ] ✅ Environment variables configured
- [ ] ✅ Data sync jobs tested
- [ ] ✅ Error handling implemented
- [ ] ✅ Rate limiting configured
- [ ] ✅ Caching strategy implemented
- [ ] ✅ Security measures in place
- [ ] ✅ Analytics tracking active
- [ ] ✅ Contact form working
- [ ] ✅ Frontend components updated
- [ ] ✅ Performance optimized

### **Deployment Steps:**
1. **Environment Setup** - Configure all environment variables in Vercel
2. **Database Migration** - Run SQL scripts in Supabase
3. **API Testing** - Test all endpoints in production
4. **Cron Jobs** - Configure Vercel cron for auto-sync
5. **Monitoring** - Set up error tracking and analytics
6. **Domain Configuration** - Configure custom domain and SSL

### **Post-Deployment Monitoring:**
- Monitor API performance and errors
- Check data sync job success rates
- Analyze user engagement metrics
- Monitor contact form submissions
- Track Core Web Vitals

---

**Estimated Timeline: 21-24 days**
**Total Features: 15+ major backend features**
**API Endpoints: 10+ fully functional endpoints**
**Database Tables: 6 optimized tables with proper relationships**

This foundation will transform your portfolio from static to dynamic, showcasing real-time data from GitHub, coding platforms, and user interactions while maintaining professional-grade security and performance standards.
