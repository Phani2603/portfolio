import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    // Test the connection by attempting to get the current session
    const { data, error } = await supabase.auth.getSession()
    
    if (error) {
      console.error('Supabase connection error:', error)
      return NextResponse.json(
        { 
          success: false, 
          error: error.message,
          details: 'Failed to connect to Supabase'
        },
        { status: 500 }
      )
    }

    // Test a simple query (this will work even without tables)
    const { error: healthError } = await supabase
      .from('projects')
      .select('count')
      .limit(1)

    return NextResponse.json({
      success: true,
      message: 'Supabase connection successful!',
      connection: {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'configured' : 'missing',
        key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'configured' : 'missing'
      },
      database: {
        accessible: !healthError,
        error: healthError?.message || null
      },
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Connection test failed:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Connection failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function POST() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  )
}
