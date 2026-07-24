import type { translations } from './i18n.config'

export type NavigationKey = keyof typeof translations.en

export interface NavigationItem {
  href: string
  key: NavigationKey
  icon: string
  showInFooter?: boolean
  prefetch?: 'hover' | 'idle'
}

export const navigationConfig = {
  primary: [
    { href: '/', key: 'nav.home', icon: 'i-carbon:home', showInFooter: true },
    { href: '/blog', key: 'nav.blog', icon: 'i-carbon:blog', showInFooter: true },
    { href: '/archives', key: 'nav.archives', icon: 'i-carbon:archive' },
    {
      href: '/projects',
      key: 'nav.projects',
      icon: 'i-carbon:application-web',
      showInFooter: true,
    },
    { href: '/gallery', key: 'nav.gallery', icon: 'i-carbon:image', showInFooter: true },
    { href: '/links', key: 'nav.links', icon: 'i-carbon:link' },
    {
      href: '/guestbook',
      key: 'nav.guestbook',
      icon: 'i-carbon:chat',
      showInFooter: true,
    },
    { href: '/about', key: 'nav.about', icon: 'i-carbon:user', showInFooter: true },
  ] satisfies NavigationItem[],
  resources: [
    { href: '/search', label: 'Search', icon: 'i-carbon:search' },
    { href: '/rss.xml', label: 'RSS', icon: 'i-carbon:rss' },
    { href: '/sitemap-index.xml', label: 'Sitemap', icon: 'i-carbon:map' },
  ],
} as const
