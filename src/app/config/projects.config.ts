/**
 * Projects Configuration
 *
 * GitHub identity and token live only in `user.config.ts`. This file owns
 * project-catalog filtering, categories, display settings, and featured repos.
 */

export const projectsConfig: ProjectsConfig = {
  source: {
    excludeRepos: [],
    includeForked: false,
  },

  displaySettings: {
    showLanguages: true,
    showStars: true,
    showForks: true,
    showLastUpdate: true,
    defaultSort: 'updated',
  },

  categories: [
    {
      id: 'all',
      name: 'All Projects',
      description: 'Browse all repositories',
      icon: 'i-carbon:grid',
    },
    {
      id: 'featured',
      name: 'Featured',
      description: 'Highlighted work and experiments',
      icon: 'i-carbon:star-filled',
    },
    {
      id: 'frontend',
      name: 'Frontend',
      description: 'Interfaces, interactions, and web experiences',
      icon: 'i-carbon:code',
    },
    {
      id: 'backend',
      name: 'Backend',
      description: 'APIs, services, and data workflows',
      icon: 'i-carbon:server',
    },
    {
      id: 'learning',
      name: 'Learning',
      description: 'Study notes, labs, and practice projects',
      icon: 'i-carbon:book',
    },
    {
      id: 'tools',
      name: 'Tools',
      description: 'Utilities, scripts, and productivity tools',
      icon: 'i-carbon:tool-box',
    },
  ],

  featuredRepos: [
    // Example:
    // {
    //   owner: 'yourusername',
    //   repo: 'your-project',
    //   category: 'frontend',
    //   featured: true,
    //   customDescription: 'A modern project built with Astro',
    //   tags: ['astro', 'typescript', 'material-design'],
    // },
  ],
};

export interface ProjectCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface ProjectRepo {
  owner: string;
  repo: string;
  category?: string;
  featured?: boolean;
  customDescription?: string;
  tags?: string[];
}

export interface ProjectSourceConfig {
  excludeRepos?: string[];
  includeForked?: boolean;
}

export interface ProjectDisplaySettings {
  showLanguages: boolean;
  showStars: boolean;
  showForks: boolean;
  showLastUpdate: boolean;
  defaultSort: 'stars' | 'updated' | 'created' | 'name';
}

export interface ProjectsConfig {
  categories: ProjectCategory[];
  source: ProjectSourceConfig;
  displaySettings: ProjectDisplaySettings;
  featuredRepos: ProjectRepo[];
}
