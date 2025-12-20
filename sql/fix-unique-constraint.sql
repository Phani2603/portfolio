-- Add unique constraint on github_url
ALTER TABLE projects ADD CONSTRAINT projects_github_url_unique UNIQUE (github_url);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_projects_github_url ON projects(github_url);
