import type { User } from './user.config';

export type UserContactKind = 'email' | 'website' | 'social';

export interface UserContactLink {
  id: string;
  kind: UserContactKind;
  label: string;
  value: string;
  href: string;
  icon: string;
  external: boolean;
}

function getUrlLabel(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

/** Build the one normalized contact collection consumed by every public surface. */
export function createUserContactLinks(user: User): UserContactLink[] {
  const links: UserContactLink[] = [];
  const email = user.contact.email?.trim();
  const twitter = user.contact.twitter?.trim();
  const website = user.contact.website?.trim();
  const githubUsername = user.github.username.trim();

  if (email) {
    links.push({
      id: 'email',
      kind: 'email',
      label: 'Email',
      value: email,
      href: `mailto:${email}`,
      icon: 'i-carbon:email',
      external: false,
    });
  }

  if (twitter) {
    links.push({
      id: 'twitter',
      kind: 'social',
      label: 'Twitter / X',
      value: getUrlLabel(twitter),
      href: twitter,
      icon: 'i-carbon:logo-twitter',
      external: true,
    });
  }

  if (website) {
    links.push({
      id: 'website',
      kind: 'website',
      label: 'Website',
      value: getUrlLabel(website),
      href: website,
      icon: 'i-carbon:earth',
      external: true,
    });
  }

  if (githubUsername) {
    links.push({
      id: 'github',
      kind: 'social',
      label: 'GitHub',
      value: `@${githubUsername}`,
      href: `https://github.com/${githubUsername}`,
      icon: 'i-carbon:logo-github',
      external: true,
    });
  }

  links.push(...user.contact.additionalLinks
    .filter((link) => link.url.trim())
    .map((link) => {
      const href = link.url.trim();
      return {
        id: link.id,
        kind: 'social' as const,
        label: link.label,
        value: link.displayValue || getUrlLabel(href),
        href,
        icon: link.icon,
        external: true,
      };
    }));

  const seen = new Set<string>();
  return links.filter((link) => {
    const key = link.href.toLocaleLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
