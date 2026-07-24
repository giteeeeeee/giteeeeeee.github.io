import { getFeaturesConfig, getGitHubConfig, getProjectsConfig } from '@app/config/site.config';
import type { ProjectsConfig } from '@app/config/projects.config';
import { getGitHubRepo, getUserRepos, type GitHubRepo } from './github';

export type ProjectCatalogItem = GitHubRepo & {
  category: string;
  featured: boolean;
  customDescription?: string;
  customTags: string[];
};

function projectKey(owner: string, repo: string) {
  return `${owner}/${repo}`.toLocaleLowerCase();
}

function sortProjects(
  projects: ProjectCatalogItem[],
  sort: ProjectsConfig['displaySettings']['defaultSort'],
) {
  return projects.sort((left, right) => {
    if (sort === 'stars') return right.stars - left.stars;
    if (sort === 'created') return Date.parse(right.createdAt) - Date.parse(left.createdAt);
    if (sort === 'name') return left.name.localeCompare(right.name);
    return Date.parse(right.updatedAt) - Date.parse(left.updatedAt);
  });
}

export function buildProjectCatalog(
  repos: GitHubRepo[],
  config: ProjectsConfig,
  githubUsername: string,
) {
  const featured = new Map(
    config.featuredRepos.map((entry) => [projectKey(entry.owner, entry.repo), entry]),
  );
  const excluded = new Set(
    (config.source.excludeRepos ?? []).flatMap((entry) => {
      const normalized = entry.toLocaleLowerCase();
      return normalized.includes('/') ? [normalized] : [normalized, projectKey(githubUsername, normalized)];
    }),
  );

  const projects = repos
    .filter((repo) => !repo.isArchived)
    .filter((repo) => config.source.includeForked || !repo.isFork)
    .filter((repo) => !excluded.has(repo.name.toLocaleLowerCase()) && !excluded.has(projectKey(repo.owner, repo.name)))
    .map<ProjectCatalogItem>((repo) => {
      const override = featured.get(projectKey(repo.owner, repo.name));
      return {
        ...repo,
        category: override?.category ?? 'all',
        featured: override?.featured ?? false,
        customDescription: override?.customDescription,
        customTags: override?.tags ?? [],
      };
    });

  return sortProjects(projects, config.displaySettings.defaultSort);
}

/** Load the configured catalog, including explicitly featured external repos. */
export async function getConfiguredProjects() {
  if (!getFeaturesConfig().integrations.githubProjects) return [];

  const config = getProjectsConfig();
  const github = getGitHubConfig();
  const userRepos = await getUserRepos(github.username);
  const known = new Set(userRepos.map((repo) => projectKey(repo.owner, repo.name)));
  const external = await Promise.all(
    config.featuredRepos
      .filter((entry) => !known.has(projectKey(entry.owner, entry.repo)))
      .map((entry) => getGitHubRepo(entry.owner, entry.repo)),
  );

  return buildProjectCatalog(
    [...userRepos, ...external.filter((repo): repo is GitHubRepo => Boolean(repo))],
    config,
    github.username,
  );
}
