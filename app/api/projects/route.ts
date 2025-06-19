import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET /api/projects - Fetch all projects
export async function GET() {
  try {
    const { data: projects, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching projects:', error);
      return NextResponse.json(
        { error: 'Failed to fetch projects' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: projects,
      count: projects?.length || 0
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/projects - Create a new project
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Basic validation
    if (!body.title || !body.github_url) {
      return NextResponse.json(
        { error: 'Title and GitHub URL are required' },
        { status: 400 }
      );
    }

    const { data: project, error } = await supabase
      .from('projects')
      .insert([{
        title: body.title,
        description: body.description || null,
        github_url: body.github_url,
        live_url: body.live_url || null,
        tech_stack: body.tech_stack || [],
        category: body.category || 'other',
        featured: body.featured || false,
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating project:', error);
      return NextResponse.json(
        { error: 'Failed to create project' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: project,
      message: 'Project created successfully'
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
