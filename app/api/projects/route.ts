import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { supabaseAdmin } from '@/lib/supabase-admin';

// GET /api/projects - Fetch all projects
export async function GET() {
  try {
    const { data: projects, error } = await supabaseAdmin
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
    }    const { data: project, error } = await supabaseAdmin
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

// PUT /api/projects - Update multiple projects
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    console.log('PUT /api/projects - Received body:', JSON.stringify(body, null, 2));
    
    // Expect an array of projects to update
    if (!Array.isArray(body)) {
      return NextResponse.json(
        { error: 'Expected an array of projects to update' },
        { status: 400 }
      );
    }

    const updatePromises = body.map(async (project, index) => {
      console.log(`Updating project ${index + 1}:`, {
        id: project.id,
        title: project.title,
        category: project.category
      });

      if (!project.id) {
        throw new Error(`Project ID is required for updates. Project at index ${index}: ${JSON.stringify(project)}`);
      }      const updateData = {
        title: project.title,
        description: project.description,
        category: project.category,
        tech_stack: project.tech_stack,
        featured: project.featured,
        live_url: project.live_url,
        updated_at: new Date().toISOString()
      };

      console.log(`Update data for project ${project.id}:`, updateData);      // Use supabaseAdmin for server-side operations to bypass RLS
      const { data, error } = await supabaseAdmin
        .from('projects')
        .update(updateData)
        .eq('id', project.id)
        .select()
        .single();

      if (error) {
        console.error(`Error updating project ${project.id}:`, error);
        throw error;
      }

      console.log(`Successfully updated project ${project.id}:`, data);
      return data;
    });

    const updatedProjects = await Promise.all(updatePromises);

    return NextResponse.json({
      success: true,
      data: updatedProjects,
      message: `Successfully updated ${updatedProjects.length} project(s)`
    });
  } catch (error) {
    console.error('Error updating projects:', error);
    return NextResponse.json(
      { error: 'Failed to update projects' },
      { status: 500 }
    );
  }
}
