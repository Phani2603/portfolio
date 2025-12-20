import { NextResponse } from 'next/server';
import { GitHubService } from '@/lib/github-service';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST() {
  try {
    const githubService = new GitHubService();
    
    console.log('🚀 Starting GitHub sync...');
    
    // Fetch repositories from GitHub
    const repos = await githubService.getRepositories();
    console.log(`📦 Found ${repos.length} repositories to sync`);

    const syncResults = [];

    // Sync each repository
    for (const repo of repos) {
      try {        const projectData = {
          title: githubService.formatProjectTitle(repo.name),
          description: repo.description || 'No description available',
          long_description: null,
          github_url: repo.html_url,
          live_url: repo.homepage || null,
          image_url: githubService.generateProjectImage(repo.name),
          tech_stack: [], // Start with empty array - user will customize icons manually
          category: githubService.categorizeProject(repo.topics, repo.language, repo.name),
          featured: repo.stargazers_count > 3 || repo.topics.includes('portfolio') || repo.topics.includes('featured'),
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          language: repo.language,
          last_synced: new Date().toISOString()
        };// First check if project exists
        const { data: existingProject } = await supabaseAdmin
          .from('projects')
          .select('id')
          .eq('github_url', repo.html_url)
          .single();

        let data, error;

        if (existingProject) {
          // Update existing project
          const result = await supabaseAdmin
            .from('projects')
            .update(projectData)
            .eq('github_url', repo.html_url)
            .select()
            .single();
          data = result.data;
          error = result.error;
        } else {
          // Insert new project
          const result = await supabaseAdmin
            .from('projects')
            .insert(projectData)
            .select()
            .single();
          data = result.data;
          error = result.error;
        }

        if (error) {
          console.error(`❌ Error syncing ${repo.name}:`, error);
          syncResults.push({ 
            repo: repo.name, 
            status: 'error', 
            error: error.message 
          });
        } else {
          console.log(`✅ Synced ${repo.name}`);
          syncResults.push({ 
            repo: repo.name, 
            status: 'success',
            id: data.id
          });
        }
      } catch (error) {
        console.error(`❌ Unexpected error syncing ${repo.name}:`, error);
        syncResults.push({ 
          repo: repo.name, 
          status: 'error', 
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    const successCount = syncResults.filter(r => r.status === 'success').length;
    const errorCount = syncResults.filter(r => r.status === 'error').length;

    console.log(`🎉 Sync completed: ${successCount} success, ${errorCount} errors`);

    return NextResponse.json({
      success: true,
      message: `GitHub sync completed successfully`,
      stats: {
        total: repos.length,
        synced: successCount,
        errors: errorCount
      },
      results: syncResults,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('🔥 GitHub sync failed:', error);
    
    return NextResponse.json({
      success: false,
      error: 'GitHub sync failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

// GET endpoint to check sync status
export async function GET() {
  try {
    const { data: projects, error } = await supabaseAdmin
      .from('projects')
      .select('title, last_synced, stars, category')
      .order('last_synced', { ascending: false });

    if (error) {
      throw error;
    }

    const lastSync = projects?.[0]?.last_synced;
    const totalProjects = projects?.length || 0;
    
    const categoryBreakdown = projects?.reduce((acc, project) => {
      acc[project.category] = (acc[project.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {};

    return NextResponse.json({
      success: true,
      stats: {
        totalProjects,
        lastSync,
        categoryBreakdown,
        totalStars: projects?.reduce((sum, p) => sum + (p.stars || 0), 0) || 0
      },
      recentProjects: projects?.slice(0, 5).map(p => ({
        title: p.title,
        category: p.category,
        stars: p.stars
      })) || []
    });

  } catch (error) {
    console.error('Error fetching sync status:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch sync status'
    }, { status: 500 });
  }
}
