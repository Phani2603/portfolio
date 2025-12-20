'use client';

import { useState, useEffect } from 'react';
import { Spotlight } from '@/components/ui/spotlight-new';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaGithub, 
  FaCheck, 
  FaTimes, 
  FaStar, 
  FaEye, 
  FaCode, 
  FaLayerGroup,
  FaFilter,
  FaSearch,
  FaSave,
  FaRocket
} from 'react-icons/fa';

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
  stars: number;
  language: string;
  topics: string[];
  isSelected?: boolean;
}

const categories = [
  'Web Application',
  'Mobile App', 
  'Backend API',
  'Frontend Library',
  'Full Stack',
  'Data Science',
  'DevOps',
  'Game Development',
  'Machine Learning',
  'Other'
];

export default function AdminDashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showOnlySelected, setShowOnlySelected] = useState(false);  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [testDbStatus, setTestDbStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [showIconSelector, setShowIconSelector] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    filterProjects();
  }, [projects, searchTerm, selectedCategory, showOnlySelected]);
  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/projects');
      const result = await response.json();
      if (result.success) {
        console.log('Dashboard - Fetched projects:', result.data);
        setProjects(result.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterProjects = () => {
    let filtered = projects;

    if (searchTerm) {
      filtered = filtered.filter(project => 
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.tech_stack.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(project => project.category === selectedCategory);
    }

    if (showOnlySelected) {
      filtered = filtered.filter(project => project.isSelected);
    }

    setFilteredProjects(filtered);
  };

  const toggleProjectSelection = (projectId: string) => {
    setProjects(prevProjects => 
      prevProjects.map(project => 
        project.id === projectId 
          ? { ...project, isSelected: !project.isSelected }
          : project
      )
    );
  };

  const toggleProjectFeatured = (projectId: string) => {
    setProjects(prevProjects => 
      prevProjects.map(project => 
        project.id === projectId 
          ? { ...project, featured: !project.featured }
          : project
      )
    );
  };
  const updateProjectCategory = (projectId: string, category: string) => {
    setProjects(prevProjects => 
      prevProjects.map(project => 
        project.id === projectId 
          ? { ...project, category }
          : project
      )
    );
  };

  const updateProjectIcons = (projectId: string, selectedIcons: string[]) => {
    setProjects(prevProjects => 
      prevProjects.map(project => 
        project.id === projectId 
          ? { ...project, tech_stack: selectedIcons }
          : project
      )
    );
  };

  const toggleIconSelector = (projectId: string) => {
    setShowIconSelector(prev => ({
      ...prev,
      [projectId]: !prev[projectId]
    }));
  };

  const getAvailableIcons = (project: Project): { icon: string, label: string }[] => {
    const iconMap: Record<string, { icon: string, label: string }> = {
      'react': { icon: '/re.svg', label: 'React' },
      'typescript': { icon: '/ts.svg', label: 'TypeScript' },
      'javascript': { icon: '/c.svg', label: 'JavaScript' },
      'nextjs': { icon: '/next.svg', label: 'Next.js' },
      'tailwindcss': { icon: '/tail.svg', label: 'Tailwind CSS' },
      'tailwind': { icon: '/tail.svg', label: 'Tailwind CSS' },
      'threejs': { icon: '/three.svg', label: 'Three.js' },
      'three.js': { icon: '/three.svg', label: 'Three.js' },
      'framer-motion': { icon: '/fm.svg', label: 'Framer Motion' },
      'gsap': { icon: '/gsap.svg', label: 'GSAP' },
      'docker': { icon: '/dock.svg', label: 'Docker' },
      'git': { icon: '/git.svg', label: 'Git' },
      'nodejs': { icon: '/c.svg', label: 'Node.js' },
      'clerk': { icon: '/c.svg', label: 'Clerk Auth' },
      'social-media': { icon: '/p.svg', label: 'Social Media' },
      'hostinger': { icon: '/host.svg', label: 'Hostinger' },
      'cloud': { icon: '/cloud.svg', label: 'Cloud' },
      'streaming': { icon: '/stream.svg', label: 'Streaming' }
    };

    // Get icons based on project's tech stack and common icons
    const allTech = [...(project.tech_stack || []), project.language].filter(Boolean);
    const availableIcons = allTech.map(tech => {
      const key = tech.toLowerCase();
      return iconMap[key] || { icon: '/gsap.svg', label: tech };
    });

    // Add common icons
    const commonIcons = [
      { icon: '/re.svg', label: 'React' },
      { icon: '/ts.svg', label: 'TypeScript' },
      { icon: '/next.svg', label: 'Next.js' },
      { icon: '/tail.svg', label: 'Tailwind CSS' },
      { icon: '/three.svg', label: 'Three.js' },
      { icon: '/fm.svg', label: 'Framer Motion' },
      { icon: '/gsap.svg', label: 'GSAP' },
      { icon: '/dock.svg', label: 'Docker' },
      { icon: '/git.svg', label: 'Git' }
    ];

    // Combine and remove duplicates
    return [...availableIcons, ...commonIcons].filter((item, index, arr) => 
      arr.findIndex(i => i.icon === item.icon) === index
    );
  };const saveChanges = async () => {
    setSaveStatus('saving');
    try {
      if (projects.length === 0) {
        console.log('Dashboard - No projects to save');
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 2000);
        return;
      }

      // Prepare the projects data for update
      const projectsToUpdate = projects.map(project => ({
        id: project.id,
        title: project.title,
        description: project.description,
        category: project.category,
        tech_stack: project.tech_stack,
        featured: project.featured,
        live_url: project.live_url
      }));

      console.log('Dashboard - Sending projects to update:', projectsToUpdate);

      const response = await fetch('/api/projects', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectsToUpdate),
      });

      console.log('Dashboard - Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Dashboard - Response error:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      const result = await response.json();
      console.log('Dashboard - Response data:', result);
      
      if (result.success) {
        setSaveStatus('saved');
        // Optionally refresh the projects data
        await fetchProjects();
      } else {
        throw new Error(result.error || 'Failed to save changes');
      }
      
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      console.error('Save failed:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }
  };
  const syncGitHubRepos = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/sync-github', {
        method: 'POST',
      });
      const result = await response.json();
      if (result.success) {
        await fetchProjects();
      }
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const testDatabaseConnection = async () => {
    setTestDbStatus('testing');
    try {
      const response = await fetch('/api/test-db');
      const result = await response.json();
      
      if (result.success) {
        console.log('Database test successful:', result);
        setTestDbStatus('success');
      } else {
        console.error('Database test failed:', result);
        setTestDbStatus('error');
      }
      
      setTimeout(() => setTestDbStatus('idle'), 3000);
    } catch (error) {
      console.error('Database test error:', error);
      setTestDbStatus('error');
      setTimeout(() => setTestDbStatus('idle'), 3000);
    }
  };

  const selectedCount = projects.filter(p => p.isSelected).length;
  const featuredCount = projects.filter(p => p.featured).length;

  return (
    <div className="min-h-screen bg-black-100 relative overflow-clip">
      {/* Navigation Bar */}
      <div className="bg-black/50 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-white">Portfolio Admin</h1>
              <div className="flex space-x-2">
                <span className="px-3 py-1 bg-purple-600 text-white text-sm rounded-full">
                  📊 Dashboard
                </span>
              </div>
            </div>            <div className="flex items-center space-x-4">
              <a
                href="/demo"
                className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
              >
                🎯 Preview Demo
              </a>
              <a
                href="/admin-tests"
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
              >
                🧪 API Tests
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

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="heading mb-4">
            Admin <span className="text-purple-300">Dashboard</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Manage your portfolio projects with advanced repository selection and categorization
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-purple-900/20 to-purple-800/20 border border-purple-500/20 rounded-xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-300 text-sm font-medium">Total Projects</p>
                <p className="text-3xl font-bold text-white">{projects.length}</p>
              </div>
              <FaCode className="text-purple-400 text-2xl" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-blue-900/20 to-blue-800/20 border border-blue-500/20 rounded-xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-300 text-sm font-medium">Selected</p>
                <p className="text-3xl font-bold text-white">{selectedCount}</p>
              </div>
              <FaCheck className="text-blue-400 text-2xl" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-green-900/20 to-green-800/20 border border-green-500/20 rounded-xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-300 text-sm font-medium">Featured</p>
                <p className="text-3xl font-bold text-white">{featuredCount}</p>
              </div>
              <FaStar className="text-green-400 text-2xl" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-orange-900/20 to-orange-800/20 border border-orange-500/20 rounded-xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-300 text-sm font-medium">Categories</p>
                <p className="text-3xl font-bold text-white">{new Set(projects.map(p => p.category)).size}</p>
              </div>
              <FaLayerGroup className="text-orange-400 text-2xl" />
            </div>
          </motion.div>
        </div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-gray-900/80 to-gray-800/80 border border-gray-700/50 rounded-xl p-6 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Search */}
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent"
                />
              </div>

              {/* Category Filter */}
              <div className="relative">
                <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="pl-10 pr-8 py-2 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent appearance-none"
                >
                  <option value="All">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Show Only Selected */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showOnlySelected}
                  onChange={(e) => setShowOnlySelected(e.target.checked)}
                  className="w-4 h-4 text-purple-600 bg-gray-800 border-gray-600 rounded focus:ring-purple-500"
                />
                <span className="text-gray-300">Show only selected</span>
              </label>
            </div>

            <div className="flex gap-3">
              <a
                href="/demo"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 rounded-lg text-purple-300 hover:text-purple-200 transition-all duration-300"
              >
                <FaEye />
                Preview Portfolio
              </a>
                <button
                onClick={syncGitHubRepos}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-green-600/20 hover:bg-green-600/30 border border-green-500/30 rounded-lg text-green-300 hover:text-green-200 transition-all duration-300 disabled:opacity-50"
              >
                <FaGithub className={loading ? 'animate-spin' : ''} />
                {loading ? 'Syncing...' : 'Sync GitHub'}
              </button>

              <button
                onClick={testDatabaseConnection}
                disabled={testDbStatus === 'testing'}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300",
                  testDbStatus === 'success' 
                    ? 'bg-green-600/20 border-green-500/30 text-green-300'
                    : testDbStatus === 'error'
                    ? 'bg-red-600/20 border-red-500/30 text-red-300'
                    : 'bg-yellow-600/20 hover:bg-yellow-600/30 border border-yellow-500/30 text-yellow-300 hover:text-yellow-200'
                )}
              >
                {testDbStatus === 'testing' ? (
                  <div className="w-4 h-4 border-2 border-yellow-300 border-t-transparent rounded-full animate-spin" />
                ) : testDbStatus === 'success' ? (
                  <FaCheck />
                ) : testDbStatus === 'error' ? (
                  <FaTimes />
                ) : (
                  <FaCode />
                )}
                {testDbStatus === 'testing' ? 'Testing...' : 
                 testDbStatus === 'success' ? 'DB OK!' : 
                 testDbStatus === 'error' ? 'DB Error!' : 'Test DB'}
              </button>

              <button
                onClick={saveChanges}
                disabled={saveStatus === 'saving'}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300",
                  saveStatus === 'saved' 
                    ? 'bg-green-600/20 border-green-500/30 text-green-300'
                    : saveStatus === 'error'
                    ? 'bg-red-600/20 border-red-500/30 text-red-300'
                    : 'bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 hover:text-blue-200'
                )}
              >
                {saveStatus === 'saving' ? (
                  <div className="w-4 h-4 border-2 border-blue-300 border-t-transparent rounded-full animate-spin" />
                ) : saveStatus === 'saved' ? (
                  <FaCheck />
                ) : saveStatus === 'error' ? (
                  <FaTimes />
                ) : (
                  <FaSave />
                )}
                {saveStatus === 'saving' ? 'Saving...' : 
                 saveStatus === 'saved' ? 'Saved!' : 
                 saveStatus === 'error' ? 'Error!' : 'Save Changes'}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredProjects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
                onToggleSelection={() => toggleProjectSelection(project.id)}
                onToggleFeatured={() => toggleProjectFeatured(project.id)}
                onUpdateCategory={(category) => updateProjectCategory(project.id, category)}
                onUpdateIcons={(icons) => updateProjectIcons(project.id, icons)}
                onToggleIconSelector={() => toggleIconSelector(project.id)}
                categories={categories}
                showIconSelector={showIconSelector[project.id]}
                availableIcons={getAvailableIcons(project)}
              />
            ))}
          </AnimatePresence>
        </div>

        {filteredProjects.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <FaRocket className="text-6xl text-gray-600 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-gray-300 mb-2">No projects found</h3>
            <p className="text-gray-500">
              {searchTerm || selectedCategory !== 'All' || showOnlySelected
                ? 'Try adjusting your filters or search term'
                : 'Sync your GitHub repositories to get started'
              }
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// Project Card Component
function ProjectCard({ 
  project, 
  index, 
  onToggleSelection, 
  onToggleFeatured, 
  onUpdateCategory, 
  onUpdateIcons, 
  onToggleIconSelector, 
  categories, 
  showIconSelector, 
  availableIcons 
}: {
  project: Project;
  index: number;
  onToggleSelection: () => void;
  onToggleFeatured: () => void;
  onUpdateCategory: (category: string) => void;
  onUpdateIcons: (icons: string[]) => void;
  onToggleIconSelector: () => void;
  categories: string[];
  showIconSelector: boolean;
  availableIcons: { icon: string, label: string }[];
}) {
  const handleIconClick = (icon: string) => {
    const isSelected = project.tech_stack.includes(icon);
    const newIcons = isSelected 
      ? project.tech_stack.filter(i => i !== icon) 
      : [...project.tech_stack, icon];

    onUpdateIcons(newIcons);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ delay: index * 0.1 }}
      className={cn(
        "relative rounded-xl border overflow-hidden group transition-all duration-300",
        project.isSelected 
          ? "border-purple-500/50 bg-gradient-to-br from-purple-900/20 to-purple-800/20"
          : "border-gray-700/50 bg-gradient-to-br from-gray-900/50 to-gray-800/50 hover:border-gray-600/50"
      )}
      style={{
        background: project.isSelected 
          ? "linear-gradient(135deg, rgba(147, 51, 234, 0.1) 0%, rgba(109, 40, 217, 0.1) 100%)"
          : "linear-gradient(135deg, rgba(4,7,29,0.8) 0%, rgba(12,14,35,0.8) 100%)"
      }}
    >
      {/* Selection Indicator */}
      {project.isSelected && (
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-blue-500" />
      )}

      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-white mb-1 truncate">
              {project.title}
            </h3>
            <p className="text-sm text-gray-400 line-clamp-2">
              {project.description}
            </p>
          </div>
          
          <div className="flex items-center gap-2 ml-4">
            <button
              onClick={onToggleFeatured}
              className={cn(
                "p-2 rounded-lg transition-all duration-300",
                project.featured
                  ? "bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30"
                  : "bg-gray-700/50 text-gray-400 hover:bg-gray-600/50 hover:text-yellow-400"
              )}
            >
              <FaStar className="w-4 h-4" />
            </button>
            
            <button
              onClick={onToggleSelection}
              className={cn(
                "p-2 rounded-lg transition-all duration-300",
                project.isSelected
                  ? "bg-purple-500/20 text-purple-400 hover:bg-purple-500/30"
                  : "bg-gray-700/50 text-gray-400 hover:bg-gray-600/50 hover:text-purple-400"
              )}
            >
              <FaCheck className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Category Selector */}
        <div className="mb-4">
          <select
            value={project.category}
            onChange={(e) => onUpdateCategory(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent"
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        {/* Icon Selection */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Tech Stack Icons</span>
            <button
              onClick={onToggleIconSelector}
              className="text-xs px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
            >
              {showIconSelector ? 'Hide' : 'Customize'}
            </button>
          </div>
          
          {/* Current Icons Display */}
          <div className="flex items-center space-x-1 mb-2">
            {project.tech_stack?.slice(0, 5).map((icon, index) => (
              <div key={index} className="w-6 h-6 relative">
                <img
                  src={icon}
                  alt="Tech icon"
                  className="w-full h-full object-contain"
                />
              </div>
            ))}
            {project.tech_stack?.length === 0 && (
              <span className="text-xs text-gray-500">No icons selected</span>
            )}
          </div>

          {/* Icon Selector Panel */}
          {showIconSelector && (
            <div className="mt-2 p-3 bg-gray-800 rounded-lg">
              <p className="text-xs text-gray-400 mb-2">Select up to 5 icons:</p>
              <div className="grid grid-cols-4 gap-2 max-h-32 overflow-y-auto">
                {availableIcons.map((iconItem, index) => {
                  const isSelected = project.tech_stack?.includes(iconItem.icon) || false;
                  const canAdd = (project.tech_stack?.length || 0) < 5;
                  return (
                    <button
                      key={index}
                      onClick={() => handleIconClick(iconItem.icon)}
                      className={`p-2 rounded border-2 transition-all ${
                        isSelected 
                          ? 'border-purple-500 bg-purple-500/20' 
                          : 'border-gray-600 hover:border-gray-500'
                      } ${!canAdd && !isSelected ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={!canAdd && !isSelected}
                    >
                      <img
                        src={iconItem.icon}
                        alt={iconItem.label}
                        className="w-4 h-4 mx-auto"
                      />
                      <span className="text-xs text-gray-400 block mt-1 truncate">
                        {iconItem.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tech_stack?.slice(0, 4).map((tech, techIndex) => (
            <span
              key={techIndex}
              className="px-2 py-1 bg-gray-700/50 text-gray-300 rounded text-xs"
            >
              {tech}
            </span>
          ))}
          {project.tech_stack?.length > 4 && (
            <span className="px-2 py-1 bg-gray-700/50 text-gray-400 rounded text-xs">
              +{project.tech_stack.length - 4}
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-sm text-gray-400">
          <div className="flex items-center gap-4">
            {project.language && (
              <span className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                {project.language}
              </span>
            )}
            <span className="flex items-center gap-1">
              <FaStar className="w-3 h-3" />
              {project.stars || 0}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400 transition-colors"
              >
                <FaGithub className="w-4 h-4" />
              </a>
            )}
            {project.live_url && (
              <a
                href={project.live_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-green-400 transition-colors"
              >
                <FaEye className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

        {/* Icon Selector */}
        {showIconSelector && (
          <div className="mt-4">
            <div className="flex flex-wrap gap-2">
              {availableIcons.map(({ icon, label }) => (
                <div
                  key={icon}
                  onClick={() => handleIconClick(label.toLowerCase())}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all duration-300",
                    project.tech_stack.includes(label.toLowerCase())
                      ? "bg-purple-500/20 text-purple-400"
                      : "bg-gray-700/50 text-gray-400 hover:bg-gray-600/50"
                  )}
                >
                  <img src={icon} alt={label} className="w-5 h-5" />
                  <span className="text-sm">{label}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
