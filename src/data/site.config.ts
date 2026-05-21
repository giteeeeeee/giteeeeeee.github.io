/**
 * Central Site Configuration
 *
 * User-editable values live in the sibling `*.config.ts` files.
 * Application code should prefer this module so config access stays consistent.
 * You usually do not need to edit this file during site initialization.
 */

import { defaultLang, languages, translations, type Language } from './i18n.config';
import { linksConfig } from './links.config';
import { mediaConfig, musicConfig } from './media.config';
import { projectsConfig } from './projects.config';
import { backgroundConfig, themeConfig } from './theme.config';
import { aboutConfig, getUserContent, user, userContent } from './user.config';

export const siteConfig = {
  i18n: {
    defaultLang,
    languages,
    translations,
  },
  user,
  userContent,
  about: aboutConfig,
  theme: themeConfig,
  background: backgroundConfig,
  links: linksConfig,
  media: mediaConfig,
  projects: projectsConfig,
} as const;

export type SiteConfig = typeof siteConfig;

// User and localized content
export function getUserProfile() {
  return siteConfig.user;
}

export function getLocalizedUserContent(lang: Language = defaultLang) {
  return getUserContent(lang);
}

export function getAboutConfig() {
  return siteConfig.about;
}

// Visual configuration
export function getThemeConfig() {
  return siteConfig.theme;
}

export function getBackgroundConfig() {
  return siteConfig.background;
}

// Feature configuration
export function getLinksConfig() {
  return siteConfig.links;
}

export function getMediaConfig() {
  return siteConfig.media;
}

export function getMusicConfig() {
  return musicConfig;
}

export function getProjectsConfig() {
  return siteConfig.projects;
}

export function getGitHubConfig() {
  return siteConfig.projects.githubConfig;
}
