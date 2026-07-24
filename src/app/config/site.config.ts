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
import { themeConfig } from './theme.config';
import { aboutConfig, getUserContent, site, user, userContent } from './user.config';
import { commentsConfig } from './comments.config';
import { featuresConfig } from './features.config';
import { navigationConfig } from './navigation.config';
import { createUserContactLinks } from './user-contact';
export type { UserContactKind, UserContactLink } from './user-contact';

const userContactLinks = createUserContactLinks(user);

export const siteConfig = {
  i18n: {
    defaultLang,
    languages,
    translations,
  },
  user,
  userContent,
  userContactLinks,
  site,
  about: aboutConfig,
  theme: themeConfig,
  background: themeConfig.background,
  links: linksConfig,
  media: mediaConfig,
  comments: commentsConfig,
  projects: projectsConfig,
  features: featuresConfig,
  navigation: navigationConfig,
} as const;

export type SiteConfig = typeof siteConfig;

// User and localized content
export function getUserProfile() {
  return siteConfig.user;
}

export function getUserContact() {
  return siteConfig.user.contact;
}

export function getUserContactLinks() {
  return siteConfig.userContactLinks;
}

export function getUserSocialLinks() {
  return siteConfig.userContactLinks.filter((link) => link.kind === 'social');
}

export function getLocalizedUserContent(lang: Language = defaultLang) {
  return getUserContent(lang);
}

export function getSiteProfile(lang: Language = defaultLang) {
  return {
    ...siteConfig.site,
    name: siteConfig.user.name,
    description: siteConfig.userContent[lang].description,
    avatar: siteConfig.user.avatar,
    url: siteConfig.user.contact.website || '',
  };
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

export function getEffectsConfig() {
  return siteConfig.theme.effects;
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

export function getCommentsConfig() {
  return siteConfig.comments;
}

export function getProjectsConfig() {
  return siteConfig.projects;
}

export function getGitHubConfig() {
  return {
    ...siteConfig.user.github,
    ...siteConfig.projects.source,
  };
}

export function getFeaturesConfig() {
  return siteConfig.features;
}

export function getNavigationConfig() {
  return siteConfig.navigation;
}
