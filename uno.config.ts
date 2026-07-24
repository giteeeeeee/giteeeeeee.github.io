import { defineConfig, presetWind4, presetIcons } from 'unocss'
import type { IconifyJSON } from '@iconify/types'
import { aboutConfig, site, user } from './src/app/config/user.config'
import { mediaConfig } from './src/app/config/media.config'

// 自动从配置文件中提取所有图标
function extractIcons() {
  const icons = new Set<string>()
  
  // 从用户统一联系方式提取自定义图标
  user.contact.additionalLinks?.forEach(link => {
    if (link.icon) icons.add(link.icon)
  })
  
  // 从 aboutConfig.sections 提取图标
  aboutConfig.sections?.forEach(section => {
    if (section.icon) icons.add(section.icon)
    section.items?.forEach(item => {
      if (item.icon) icons.add(item.icon)
    })
  })
  
  // 从站点技术栈提取图标
  site.techStack?.forEach(tech => {
    if (tech.icon) icons.add(tech.icon)
  })

  // 从媒体配置提取图标
  mediaConfig.music.playlists?.forEach(playlist => {
    if (playlist.icon) icons.add(playlist.icon)
  })
  
  return Array.from(icons)
}

export default defineConfig({
  presets: [
    presetWind4(),
    presetIcons({
      scale: 1.2,
      collections: {
        carbon: () => import('@iconify-json/carbon/icons.json').then(i => i.default as IconifyJSON),
        'simple-icons': () => import('@iconify-json/simple-icons/icons.json').then(i => i.default as IconifyJSON),
      },
    }),
  ],
  shortcuts: {
    // MD3 Primary Filled Button
    btn: [
      'px-3 py-2 rounded-md transition-200',
      'bg-[var(--md-sys-color-primary)] text-[var(--md-sys-color-on-primary)]',
      'hover:op-90'
    ].join(' '),

    // MD3 Outlined Button
    'btn-outline': [
      'px-3 py-2 rounded-md transition-200',
      'border border-[var(--md-sys-color-outline)]',
      'text-[var(--md-sys-color-primary)]',
      'hover:bg-[var(--md-sys-color-primary)]/10'
    ].join(' '),

    // MD3 Tonal Button
    'btn-tonal': [
      'px-3 py-2 rounded-md transition-200',
      'bg-[var(--md-sys-color-secondary-container)]',
      'text-[var(--md-sys-color-on-secondary-container)]',
      'hover:op-90'
    ].join(' '),

    // MD3 Surface Card
    card: [
      'rounded-[var(--radius-md)]',
      'border border-[var(--md-sys-color-outline)]',
      'bg-[var(--md-sys-color-surface)]',
      'text-[var(--md-sys-color-on-surface)]',
      'shadow-[var(--shadow-sm)]'
    ].join(' '),

    // MD3 Icon Button (已在全局样式定义，这里保留作为 UnoCSS 快捷方式)
    'icon-btn-uno': [
      'inline-flex items-center justify-center',
      'w-10 h-10 rounded-[var(--radius-md)]',
      'text-[var(--md-sys-color-on-surface)]',
      'border border-[var(--md-sys-color-outline)]',
      'bg-transparent',
      'hover:bg-[var(--md-sys-color-surface-variant)]',
      'transition-200'
    ].join(' '),

    // 排版快捷方式
    h1: 'text-[var(--fs-3xl)] font-bold',
    h2: 'text-[var(--fs-2xl)] font-bold',
    h3: 'text-[var(--fs-xl)] font-semibold',
  },
  safelist: [
    // 系统核心图标（手动维护）
    'i-carbon:sun',
    'i-carbon:moon',
    'i-carbon:laptop',
    'i-carbon:menu',
    'i-carbon:close',
    'i-carbon:logo-github',
    'i-carbon:logo-twitter',
    'i-carbon:email',
    'i-carbon:rss',
    'i-carbon:arrow-left',
    'i-carbon:arrow-right',
    'i-carbon:portfolio',
    'i-carbon:chevron-down',
    'i-carbon:chevron-left',
    'i-carbon:chevron-right',
    'i-carbon:launch',
    'i-carbon:tools',
    'i-carbon:user-avatar',
    'i-carbon:development',
    'i-carbon:blog',
    'i-carbon:chart-bar',
    'i-carbon:link',
    'i-carbon:cube',
    'i-carbon:analytics',
    'i-carbon:download',
    'i-carbon:document',
    'i-carbon:earth',
    'i-carbon:folder',
    'i-carbon:image',
    'i-carbon:camera',
    'i-carbon:calendar',
    'i-carbon:location',
    'i-carbon:music',
    'i-carbon:headphones',
    'i-carbon:playlist',
    'i-carbon:filter',
    'i-carbon:view',
    'i-carbon:play-filled',
    'i-carbon:pause-filled',
    'i-carbon:skip-back-filled',
    'i-carbon:skip-forward-filled',
    'i-carbon:volume-up',
    'text-[18px]',
    // 自动从配置文件提取的图标
    ...extractIcons(),
  ],
})
