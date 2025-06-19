'use client';

import { useState } from 'react';

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  tech_stack: string[];
  github_url: string;
  live_url?: string;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

interface ApiResponse {
  success: boolean;
  data?: any;
  error?: string;
  message?: string;
  timestamp?: string;
}

export default function AdminTests() {
  const [syncResult, setSyncResult] = useState<ApiResponse | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectsResult, setProjectsResult] = useState<ApiResponse | null>(null);
  const [connectionResult, setConnectionResult] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  const [activeTab, setActiveTab] = useState('overview');
  const setLoadingState = (key: string, state: boolean) => {
    setLoading(prev => ({ ...prev, [key]: state }));
  };

  const syncGitHubRepos = async () => {
    setLoadingState('sync', true);
    setSyncResult(null);
    
    try {
      const response = await fetch('/api/sync-github', {
        method: 'POST',
      });
      const result = await response.json();
      
      const formattedResult: ApiResponse = {
        ...result,
        timestamp: new Date().toISOString()
      };
      
      setSyncResult(formattedResult);
      console.log('🔄 Sync Result:', result); // Keep console logging for debugging
    } catch (error) {
      console.error('❌ Sync failed:', error);
      setSyncResult({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Sync failed',
        timestamp: new Date().toISOString()
      });
    } finally {
      setLoadingState('sync', false);
    }
  };

  const fetchProjects = async () => {
    setLoadingState('projects', true);
    setProjectsResult(null);
    
    try {
      const response = await fetch('/api/projects');
      const result = await response.json();
      
      const formattedResult: ApiResponse = {
        ...result,
        timestamp: new Date().toISOString()
      };
      
      setProjects(result.data || []);
      setProjectsResult(formattedResult);
      console.log('📦 Projects fetched:', result); // Keep console logging for debugging
    } catch (error) {
      console.error('❌ Fetch failed:', error);
      const errorResult: ApiResponse = {
        success: false,
        error: error instanceof Error ? error.message : 'Fetch failed',
        timestamp: new Date().toISOString()
      };
      setProjectsResult(errorResult);
    } finally {
      setLoadingState('projects', false);
    }
  };

  const testConnection = async () => {
    setLoadingState('connection', true);
    setConnectionResult(null);
    
    try {
      const response = await fetch('/api/test-connection');
      const result = await response.json();
      
      const formattedResult: ApiResponse = {
        ...result,
        timestamp: new Date().toISOString()
      };
      
      setConnectionResult(formattedResult);
      console.log('🔗 Connection test:', result);
    } catch (error) {
      console.error('❌ Connection test failed:', error);
      setConnectionResult({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Connection failed',
        timestamp: new Date().toISOString()
      });
    } finally {
      setLoadingState('connection', false);
    }
  };

  const renderApiResult = (result: ApiResponse | null, title: string) => {
    if (!result) return null;

    return (
      <div className="mt-4 p-4 bg-gray-800 rounded-lg border border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium text-white">{title} Result</h4>
          <span className={`px-2 py-1 rounded text-xs font-medium ${
            result.success 
              ? 'bg-green-900 text-green-200 border border-green-700' 
              : 'bg-red-900 text-red-200 border border-red-700'
          }`}>
            {result.success ? '✅ Success' : '❌ Error'}
          </span>
        </div>
        
        {result.timestamp && (
          <p className="text-xs text-gray-400 mb-2">
            {new Date(result.timestamp).toLocaleString()}
          </p>
        )}
        
        {result.message && (
          <p className={`text-sm mb-2 ${
            result.success ? 'text-green-400' : 'text-yellow-400'
          }`}>
            {result.message}
          </p>
        )}
        
        {result.error && (
          <p className="text-red-400 text-sm mb-2">
            <strong>Error:</strong> {result.error}
          </p>
        )}
        
        <details className="text-xs">
          <summary className="cursor-pointer text-gray-400 hover:text-white transition-colors">
            View Raw Response
          </summary>
          <pre className="mt-2 p-2 bg-gray-900 rounded overflow-x-auto text-gray-300">
            {JSON.stringify(result, null, 2)}
          </pre>
        </details>
      </div>
    );
  };

  const renderProjectsList = () => {
    if (projects.length === 0) return null;

    return (
      <div className="mt-4 space-y-3">
        <h4 className="font-medium text-white mb-2">
          Projects ({projects.length} total)
        </h4>
        <div className="max-h-64 overflow-y-auto space-y-2">
          {projects.map((project, index) => (
            <div key={project.id || index} className="p-3 bg-gray-800 rounded border border-gray-700">
              <div className="flex items-start justify-between mb-2">
                <h5 className="font-medium text-white">{project.title}</h5>
                <div className="flex gap-2">
                  <span className={`px-2 py-1 rounded text-xs ${
                    project.featured 
                      ? 'bg-yellow-900 text-yellow-200' 
                      : 'bg-gray-700 text-gray-300'
                  }`}>
                    {project.featured ? '⭐ Featured' : 'Regular'}
                  </span>
                  <span className="px-2 py-1 bg-blue-900 text-blue-200 rounded text-xs">
                    {project.category}
                  </span>
                </div>
              </div>
              
              <p className="text-gray-300 text-sm mb-2 line-clamp-2">
                {project.description}
              </p>
              
              <div className="flex flex-wrap gap-1 mb-2">
                {project.tech_stack?.map((tech, techIndex) => (
                  <span key={techIndex} className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs">
                    {tech}
                  </span>
                ))}
              </div>
              
              <div className="flex gap-2 text-xs">
                {project.github_url && (
                  <a 
                    href={project.github_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    📁 GitHub
                  </a>
                )}
                {project.live_url && (
                  <a 
                    href={project.live_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-green-400 hover:text-green-300 transition-colors"
                  >
                    🌐 Live Demo
                  </a>
                )}
                <span className="text-gray-500">
                  Created {new Date(project.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation Bar */}
      <div className="bg-black/50 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-white">Portfolio Admin</h1>
              <div className="flex space-x-2">
                <span className="px-3 py-1 bg-blue-600 text-white text-sm rounded-full">
                  🧪 API Tests
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <a
                href="/dashboard"
                className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
              >
                📊 Dashboard
              </a>
              <a
                href="/"
                className="inline-flex items-center px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium rounded-lg transition-colors duration-200"
              >
                🏠 Home
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Rest of your existing admin-tests content */}
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-8 text-center">
          🧪 Backend API Testing Dashboard
        </h1>
        
        {/* Tab Navigation */}
        <div className="mb-8 flex justify-center">
          <div className="bg-gray-900 p-1 rounded-lg">
            {['overview', 'results'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab === 'overview' ? '🎯 Test Controls' : '📊 Results & Data'}
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'overview' && (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Connection Test */}
              <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <span className="mr-2">🔗</span>
                  Database Connection
                </h2>
                <button 
                  onClick={testConnection}
                  disabled={loading.connection}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:opacity-50 px-4 py-2 rounded text-white transition-colors w-full mb-2"
                >
                  {loading.connection ? 'Testing...' : 'Test Supabase Connection'}
                </button>
                <p className="text-sm text-gray-400">
                  Verifies database connectivity and authentication
                </p>
                
                {renderApiResult(connectionResult, 'Connection Test')}
              </div>

              {/* GitHub Sync Test */}
              <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <span className="mr-2">🔄</span>
                  GitHub Repository Sync
                </h2>
                <button 
                  onClick={syncGitHubRepos}
                  disabled={loading.sync}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:opacity-50 px-4 py-2 rounded text-white transition-colors w-full mb-2"
                >
                  {loading.sync ? 'Syncing...' : 'Sync GitHub Repos'}
                </button>
                <p className="text-sm text-gray-400">
                  Fetches and stores your GitHub repositories
                </p>
                
                {renderApiResult(syncResult, 'GitHub Sync')}
              </div>

              {/* Projects Fetch Test */}
              <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <span className="mr-2">📦</span>
                  Projects API Test
                </h2>
                <button 
                  onClick={fetchProjects}
                  disabled={loading.projects}
                  className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 disabled:opacity-50 px-4 py-2 rounded text-white transition-colors w-full mb-2"
                >
                  {loading.projects ? 'Fetching...' : 'Fetch Projects'}
                </button>
                <p className="text-sm text-gray-400">
                  Retrieves all projects from the database
                </p>
                
                {renderApiResult(projectsResult, 'Projects Fetch')}
              </div>
            </div>

            {/* API Endpoints Reference */}
            <div className="mt-8 bg-gray-900 p-6 rounded-lg border border-gray-800">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <span className="mr-2">📋</span>
                Available API Endpoints
              </h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="p-3 bg-gray-800 rounded">
                  <code className="text-green-400 font-mono text-sm">GET /api/projects</code>
                  <p className="text-gray-400 text-xs mt-1">Fetch all projects from database</p>
                </div>
                <div className="p-3 bg-gray-800 rounded">
                  <code className="text-blue-400 font-mono text-sm">POST /api/sync-github</code>
                  <p className="text-gray-400 text-xs mt-1">Sync GitHub repositories to database</p>
                </div>
                <div className="p-3 bg-gray-800 rounded">
                  <code className="text-yellow-400 font-mono text-sm">GET /api/test-connection</code>
                  <p className="text-gray-400 text-xs mt-1">Test Supabase database connection</p>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'results' && (
          <div className="space-y-6">
            {/* Projects Display */}
            {projects.length > 0 && (
              <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <span className="mr-2">📊</span>
                  Database Projects
                </h2>
                {renderProjectsList()}
              </div>
            )}

            {/* Latest Results Summary */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {connectionResult && (
                <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <span className="mr-2">🔗</span>
                    Connection Status
                  </h3>
                  {renderApiResult(connectionResult, 'Latest Connection Test')}
                </div>
              )}

              {syncResult && (
                <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <span className="mr-2">🔄</span>
                    Sync Status
                  </h3>
                  {renderApiResult(syncResult, 'Latest GitHub Sync')}
                </div>
              )}

              {projectsResult && (
                <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <span className="mr-2">📦</span>
                    Projects Status
                  </h3>
                  {renderApiResult(projectsResult, 'Latest Projects Fetch')}
                </div>
              )}
            </div>

            {/* Empty State */}
            {!connectionResult && !syncResult && !projectsResult && projects.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🧪</div>
                <h3 className="text-xl font-semibold mb-2">No test results yet</h3>
                <p className="text-gray-400 mb-4">
                  Switch to the Test Controls tab and run some API tests to see results here.
                </p>
                <button
                  onClick={() => setActiveTab('overview')}
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white transition-colors"
                >
                  Go to Test Controls
                </button>
              </div>
            )}
          </div>
        )}

        {/* Instructions */}
        <div className="mt-8 bg-gray-900 p-6 rounded-lg border-l-4 border-blue-500">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <span className="mr-2">🔍</span>
            Testing Instructions
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="font-medium text-blue-400 mb-2">On-Screen Results:</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-300">
                <li>All API responses are now displayed directly on this page</li>
                <li>Switch between Test Controls and Results & Data tabs</li>
                <li>View detailed project information and API responses</li>
                <li>Expandable raw JSON responses for debugging</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-yellow-400 mb-2">Console Logging (Optional):</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-300">
                <li>Open browser developer tools (F12) for additional details</li>
                <li>Console still logs detailed information for debugging</li>
                <li>Database changes are visible in Supabase dashboard</li>
                <li>GitHub sync shows all repository details</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-blue-900/30 rounded">
            <p className="text-blue-200 text-sm">
              <strong>💡 New Feature:</strong> All API results are now displayed directly on this page 
              with full details, timestamps, and expandable raw responses. No need to rely on console logging!
            </p>
          </div>
        </div>

        {/* Development Status */}
        <div className="mt-6 bg-gray-900 p-6 rounded-lg border-l-4 border-green-500">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <span className="mr-2">🚀</span>
            Development Status
          </h2>
          <div className="grid md:grid-cols-2 gap-6 text-sm">
            <div>
              <h3 className="font-medium text-green-400 mb-3 flex items-center">
                <span className="mr-2">✅</span>
                Completed Features:
              </h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">●</span>
                  Supabase database connection & authentication
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">●</span>
                  Projects table schema with RLS policies
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">●</span>
                  GitHub API integration & repository filtering
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">●</span>
                  Complete API route structure (CRUD operations)
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">●</span>
                  Enhanced admin testing dashboard with on-screen results
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">●</span>
                  Error handling and detailed response logging
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-yellow-400 mb-3 flex items-center">
                <span className="mr-2">🔄</span>
                In Progress:
              </h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center">
                  <span className="text-yellow-500 mr-2">●</span>
                  Repository selection interface for portfolio display
                </li>
                <li className="flex items-center">
                  <span className="text-yellow-500 mr-2">●</span>
                  Coding platform APIs (LeetCode, HackerRank)
                </li>
                <li className="flex items-center">
                  <span className="text-yellow-500 mr-2">●</span>
                  Contact form backend with validation
                </li>
                <li className="flex items-center">
                  <span className="text-yellow-500 mr-2">●</span>
                  Analytics tracking and user engagement metrics
                </li>
                <li className="flex items-center">
                  <span className="text-yellow-500 mr-2">●</span>
                  Advanced error handling and retry mechanisms
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-green-900/30 rounded">
            <p className="text-green-200 text-sm">
              <strong>🎯 Current Focus:</strong> All backend APIs are fully functional with comprehensive 
              testing capabilities. Ready for repository selection feature and frontend integration.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
