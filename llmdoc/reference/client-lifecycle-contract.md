# Client Lifecycle Contract

## Scope

适用于 Astro ClientRouter 下所有浏览器交互。

## Two Lifetimes

Document lifetime：

- 只启动一次。
- 可持有全局 listener，但 initializer 必须有幂等 guard。
- 当前包括 route transition、站内导航来源记录、theme sync 和可缓存 i18n runtime；prefetch 由 Astro ClientRouter 管理。

Page lifetime：

- 针对当前 DOM 初始化。
- 在 `astro:before-swap` 清理。
- 在 `astro:page-load` 重建。
- initializer 返回 cleanup 或实例暴露 `destroy()`。

## Required Cleanup

- `addEventListener` 对应 `removeEventListener`。
- timeout/interval/animation frame 必须取消。
- observer 必须 disconnect。
- module/global reference 必须重置或使用 WeakSet/data marker 保证幂等。
- 不在 swap cleanup 中制造旧 DOM 的可见闪烁。

## Shared Contracts

| Contract | Consumers |
| --- | --- |
| `astro:before-swap`, `astro:page-load` | runtime、i18n、search、comments、TOC 等 |
| history state `__reayReturnTo`, `data-history-back` | 站内来源记录、Blog/Plog 详情返回、文章 hash history |
| `data-theme`, localStorage `theme` | inline bootstrap、toggle、theme-sync、comments |
| localStorage `language`, `languagechange` | i18n、toggle、typewriter、search、comments feedback |
| `data-i18n`, `data-i18n-attr(s)`, `data-i18n-date`, `data-page-title-key`, `data-user-content`, `data-text` | static HTML + client translation、属性、日期与标题 |
| `reay:fullpage-section` | FullPageScroll + floating Header |
| `data-pagefind-body`, `data-pagefind-ignore` | build-time Pagefind indexing |

## Known Exceptions

- Comment host/observer/listener 已 cleanup，但 provider adapter 仍没有统一的第三方 teardown/theme/language update。
- 文章与 README 增强依靠 DOM marker 幂等，尚未全部迁入中心 registry。
- Native View Transitions 被 custom shim 替代；跨文档自动 View Transition 未启用。

## Browser Evidence

- Playwright 验证语言/主题经过 ClientRouter 导航后保持同步。
- Gallery E2E 验证 fallback、初始焦点和关闭后的焦点恢复。
- 移动菜单 E2E 与 Chrome 390×844 复测验证 label、`aria-expanded` 和无横向溢出。
- Guestbook E2E 与 Chrome 1440×900 / 390×844 复测验证默认关闭状态、统一联系人、双语属性、首屏完成、light/dark MD3 表面和无横向溢出；真实 provider 生命周期仍不在该证据范围内。
- Blog TOC E2E 与 Chrome 1440×900 复测验证正文边界 0%/100%、居中完整圆环、标准化 dash offset 和同步 `aria-valuenow`；页面交换仍复用单例 runtime 并在 before-swap cleanup。
- Search E2E/Chrome 验证 Pagefind 全站结果、`q` URL、开发环境 Blog/Plog 回退、桌面/移动布局、无溢出和无控制台错误；详情返回 E2E/Chrome 验证从带类型筛选的 Archives 进入 Blog/Plog 后恢复原 URL 与筛选状态。

## Sources of Truth

- `src/shared/client/runtime/client-runtime.ts`
- `src/features/i18n/components/I18nRuntime.astro`
- `src/features/search/client/search.ts`
- `src/features/comments/client/comments-runtime.ts`
- `src/features/media/client/music-dock.ts`
- `src/features/gallery/client/gallery-lightbox.ts`
- `src/shared/client/navigation/fullpage-scroll.ts`
