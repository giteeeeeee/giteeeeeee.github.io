/**
 * Markdown 样式生成器
 * 根据配置生成 CSS 样式
 */
import type { MarkdownStyleConfig } from '@app/config/markdown-style.config';

export function generateMarkdownStyles(config: MarkdownStyleConfig): string {
  return `
    /* === 文章头部组件 === */
    .post-title {
      font-size: ${config.postHeader.fontSize};
      font-weight: ${config.postHeader.fontWeight};
      color: ${config.postHeader.color};
      margin-bottom: ${config.postHeader.marginBottom};
      line-height: ${config.postHeader.lineHeight};
    }
    
    @media (min-width: 768px) {
      .post-title {
        font-size: ${config.postHeader.fontSizeMd};
      }
    }

    @media (min-width: 1024px) {
      .post-title {
        font-size: ${config.postHeader.fontSizeLg};
      }
    }

    .post-description {
      font-size: ${config.postHeader.descriptionFontSize};
      color: ${config.postHeader.descriptionColor};
      font-style: ${config.postHeader.descriptionFontStyle};
      margin-bottom: ${config.postHeader.descriptionMarginBottom};
      border-left: ${config.postHeader.descriptionBorderWidth} solid ${config.postHeader.descriptionBorderColor};
      padding-left: ${config.postHeader.descriptionPaddingLeft};
      opacity: 0.8;
    }

    /* === 基础排版 === */
    .prose {
      font-size: ${config.typography.fontSize};
      line-height: ${config.typography.lineHeight};
      letter-spacing: ${config.typography.letterSpacing};
      font-family: ${config.typography.fontFamily};
      color: ${config.typography.color};
      max-width: ${config.typography.maxWidth};
      text-rendering: ${config.typography.textRendering};
      -webkit-font-smoothing: ${config.typography.fontSmoothing};
      -moz-osx-font-smoothing: grayscale;
      word-spacing: ${config.typography.wordSpacing};
    }

    /* 基础排版响应式 */
    @media (min-width: 768px) {
      .prose {
        font-size: ${config.typography.fontSizeMd};
      }
    }

    @media (min-width: 1024px) {
      .prose {
        font-size: ${config.typography.fontSizeLg};
      }
    }

    /* === 标题样式 === */
    .prose h1 {
      font-family: var(--reay-font-prose-heading);
      font-size: ${config.headings.h1.fontSize};
      font-weight: ${config.headings.h1.fontWeight};
      color: ${config.headings.h1.color};
      margin-top: ${config.headings.h1.marginTop};
      margin-bottom: ${config.headings.h1.marginBottom};
      padding-bottom: ${config.headings.h1.paddingBottom};
      line-height: ${config.headings.h1.lineHeight};
      text-align: ${config.headings.h1.textAlign};
      border-bottom: ${config.headings.h1.borderBottom};
      text-shadow: ${config.headings.h1.textShadow};
      position: relative;
    }

    /* H1 响应式 */
    @media (min-width: 768px) {
      .prose h1 {
        font-size: ${config.headings.h1.fontSizeMd};
      }
    }

    @media (min-width: 1024px) {
      .prose h1 {
        font-size: ${config.headings.h1.fontSizeLg};
      }
    }

    ${config.headings.h1.showDecorator ? `
    .prose h1::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      height: ${config.headings.h1.decoratorHeight};
      width: ${config.headings.h1.decoratorWidth};
      background: ${config.headings.h1.decoratorGradient};
      border-radius: 2px;
      transform: translateY(-8px);
    }
    ` : ''}

    .prose h2 {
      font-family: var(--reay-font-prose-heading);
      font-size: ${config.headings.h2.fontSize};
      font-weight: ${config.headings.h2.fontWeight};
      color: ${config.headings.h2.color};
      margin-top: ${config.headings.h2.marginTop};
      margin-bottom: ${config.headings.h2.marginBottom};
      padding-bottom: ${config.headings.h2.paddingBottom};
      line-height: ${config.headings.h2.lineHeight};
      text-align: ${config.headings.h2.textAlign};
      border-bottom: ${config.headings.h2.borderBottom};
      text-shadow: ${config.headings.h2.textShadow};
      position: relative;
    }

    /* H2 响应式 */
    @media (min-width: 768px) {
      .prose h2 {
        font-size: ${config.headings.h2.fontSizeMd};
      }
    }

    @media (min-width: 1024px) {
      .prose h2 {
        font-size: ${config.headings.h2.fontSizeLg};
      }
    }

    ${config.headings.h2.showDecorator ? `
    .prose h2::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      height: ${config.headings.h2.decoratorHeight};
      width: ${config.headings.h2.decoratorWidth};
      background: ${config.headings.h2.decoratorGradient};
      border-radius: 2px;
      transform: translateY(-8px);
    }
    ` : ''}

    .prose h3 {
      font-family: var(--reay-font-prose-heading);
      font-size: ${config.headings.h3.fontSize};
      font-weight: ${config.headings.h3.fontWeight};
      color: ${config.headings.h3.color};
      margin-top: ${config.headings.h3.marginTop};
      margin-bottom: ${config.headings.h3.marginBottom};
      padding-bottom: ${config.headings.h3.paddingBottom};
      line-height: ${config.headings.h3.lineHeight};
      text-align: ${config.headings.h3.textAlign};
      border-bottom: ${config.headings.h3.borderBottom};
      text-shadow: ${config.headings.h3.textShadow};
      position: relative;
    }

    /* H3 响应式 */
    @media (min-width: 768px) {
      .prose h3 {
        font-size: ${config.headings.h3.fontSizeMd};
      }
    }

    @media (min-width: 1024px) {
      .prose h3 {
        font-size: ${config.headings.h3.fontSizeLg};
      }
    }

    ${config.headings.h3.showDecorator ? `
    .prose h3::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      height: ${config.headings.h3.decoratorHeight};
      width: ${config.headings.h3.decoratorWidth};
      background: ${config.headings.h3.decoratorGradient};
      border-radius: 2px;
      transform: translateY(-8px);
    }
    ` : ''}

    .prose h4 {
      font-family: var(--reay-font-prose-heading);
      font-size: ${config.headings.h4.fontSize};
      font-weight: ${config.headings.h4.fontWeight};
      color: ${config.headings.h4.color};
      margin-top: ${config.headings.h4.marginTop};
      margin-bottom: ${config.headings.h4.marginBottom};
      padding-bottom: ${config.headings.h4.paddingBottom};
      line-height: ${config.headings.h4.lineHeight};
      text-align: ${config.headings.h4.textAlign};
      border-bottom: ${config.headings.h4.borderBottom};
      text-shadow: ${config.headings.h4.textShadow};
      position: relative;
    }

    /* H4 响应式 */
    @media (min-width: 768px) {
      .prose h4 {
        font-size: ${config.headings.h4.fontSizeMd};
      }
    }

    @media (min-width: 1024px) {
      .prose h4 {
        font-size: ${config.headings.h4.fontSizeLg};
      }
    }

    ${config.headings.h4.showDecorator ? `
    .prose h4::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      height: ${config.headings.h4.decoratorHeight};
      width: ${config.headings.h4.decoratorWidth};
      background: ${config.headings.h4.decoratorGradient};
      border-radius: 2px;
      transform: translateY(-8px);
    }
    ` : ''}

    .prose h5 {
      font-family: var(--reay-font-prose-heading);
      font-size: ${config.headings.h5.fontSize};
      font-weight: ${config.headings.h5.fontWeight};
      color: ${config.headings.h5.color};
      margin-top: ${config.headings.h5.marginTop};
      margin-bottom: ${config.headings.h5.marginBottom};
      padding-bottom: ${config.headings.h5.paddingBottom};
      line-height: ${config.headings.h5.lineHeight};
      text-align: ${config.headings.h5.textAlign};
      border-bottom: ${config.headings.h5.borderBottom};
      text-shadow: ${config.headings.h5.textShadow};
      position: relative;
    }

    /* H5 响应式 */
    @media (min-width: 768px) {
      .prose h5 {
        font-size: ${config.headings.h5.fontSizeMd};
      }
    }

    @media (min-width: 1024px) {
      .prose h5 {
        font-size: ${config.headings.h5.fontSizeLg};
      }
    }

    ${config.headings.h5.showDecorator ? `
    .prose h5::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      height: ${config.headings.h5.decoratorHeight};
      width: ${config.headings.h5.decoratorWidth};
      background: ${config.headings.h5.decoratorGradient};
      border-radius: 2px;
      transform: translateY(-8px);
    }
    ` : ''}

    .prose h6 {
      font-family: var(--reay-font-prose-heading);
      font-size: ${config.headings.h6.fontSize};
      font-weight: ${config.headings.h6.fontWeight};
      color: ${config.headings.h6.color};
      margin-top: ${config.headings.h6.marginTop};
      margin-bottom: ${config.headings.h6.marginBottom};
      padding-bottom: ${config.headings.h6.paddingBottom};
      line-height: ${config.headings.h6.lineHeight};
      text-align: ${config.headings.h6.textAlign};
      border-bottom: ${config.headings.h6.borderBottom};
      text-shadow: ${config.headings.h6.textShadow};
      position: relative;
    }

    /* H6 响应式 */
    @media (min-width: 768px) {
      .prose h6 {
        font-size: ${config.headings.h6.fontSizeMd};
      }
    }

    @media (min-width: 1024px) {
      .prose h6 {
        font-size: ${config.headings.h6.fontSizeLg};
      }
    }

    ${config.headings.h6.showDecorator ? `
    .prose h6::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      height: ${config.headings.h6.decoratorHeight};
      width: ${config.headings.h6.decoratorWidth};
      background: ${config.headings.h6.decoratorGradient};
      border-radius: 2px;
      transform: translateY(-8px);
    }
    ` : ''}

    /* === 段落样式 === */
    .prose p {
      margin-top: ${config.paragraph.marginTop};
      margin-bottom: ${config.paragraph.marginBottom};
      text-align: ${config.paragraph.textAlign};
      text-indent: ${config.paragraph.textIndent};
      orphans: ${config.paragraph.orphans};
      widows: ${config.paragraph.widows};
    }

    /* === 链接样式 === */
    .prose a {
      color: ${config.link.color};
      text-decoration: ${config.link.underline ? 'underline' : 'none'};
      text-decoration-thickness: ${config.link.underlineThickness};
      text-underline-offset: ${config.link.underlineOffset};
      font-weight: ${config.link.fontWeight};
      transition: ${config.link.transition};
    }

    ${config.link.externalIcon ? `
    .prose a[href^="http"]::before {
      content: '${config.link.externalIconSymbol}';
      margin-right: 0.25em;
      font-size: 0.8em;
      opacity: 0.6;
    }
    ` : ''}

    ${config.link.underlineStyle === 'gradient' ? `
    .prose a {
      background: linear-gradient(90deg, var(--md-sys-color-primary), var(--md-sys-color-tertiary));
      background-size: 100% 2px;
      background-position: 0 100%;
      background-repeat: no-repeat;
      text-decoration: none;
    }
    ` : ''}

    ${config.link.underlineStyle === 'animated' ? `
    .prose a {
      position: relative;
      text-decoration: none;
    }
    .prose a::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      width: 0;
      height: 2px;
      background: linear-gradient(90deg, var(--md-sys-color-primary), var(--md-sys-color-tertiary));
      transition: width 0.3s ease;
    }
    .prose a:hover::after {
      width: 100%;
    }
    ` : ''}

    .prose a:hover {
      color: ${config.link.hoverColor};
    }

    /* === 行内代码样式 === */
    .prose code:not(pre code) {
      font-size: ${config.code.inline.fontSize};
      font-family: ${config.code.inline.fontFamily};
      background-color: ${config.code.inline.backgroundColor};
      color: ${config.code.inline.color};
      padding: ${config.code.inline.padding};
      border-radius: ${config.code.inline.borderRadius};
      border: ${config.code.inline.border};
    }

    /* 行内代码响应式 */
    @media (min-width: 768px) {
      .prose code:not(pre code) {
        font-size: ${config.code.inline.fontSizeMd};
      }
    }

    @media (min-width: 1024px) {
      .prose code:not(pre code) {
        font-size: ${config.code.inline.fontSizeLg};
      }
    }

    /* === 代码块样式 === */
    .prose pre {
      font-size: ${config.code.block.fontSize};
      font-family: ${config.code.block.fontFamily};
      background-color: ${config.code.block.backgroundColor};
      padding: 3em 1.2em 1.2em 1.2em;
      border-radius: ${config.code.block.borderRadius};
      border: ${config.code.block.border};
      margin-top: ${config.code.block.marginTop};
      margin-bottom: ${config.code.block.marginBottom};
      max-height: ${config.code.block.maxHeight};
      overflow: ${config.code.block.overflow};
      line-height: ${config.code.block.lineHeight};
      box-shadow: ${config.code.block.boxShadow};
      tab-size: ${config.code.block.tabSize};
      position: relative;
    }

    /* 代码块响应式 */
    @media (min-width: 768px) {
      .prose pre {
        font-size: ${config.code.block.fontSizeMd};
      }
    }

    @media (min-width: 1024px) {
      .prose pre {
        font-size: ${config.code.block.fontSizeLg};
      }
    }

    /* 代码块行号 */
    ${config.code.block.showLineNumbers ? `
    .prose pre code {
      counter-reset: line;
    }
    
    .prose pre code .line::before {
      counter-increment: line;
      content: counter(line);
      display: inline-block;
      width: 2.5em;
      padding-right: 1em;
      margin-right: 1em;
      color: ${config.code.block.lineNumberColor};
      background-color: ${config.code.block.lineNumberBg};
      text-align: right;
      user-select: none;
      border-right: 1px solid var(--md-sys-color-outline-variant);
    }
    ` : ''}

    /* 代码块语言标签 */
    ${config.code.block.showLanguage ? `
    .prose pre[data-language]::before {
      content: attr(data-language);
      position: absolute;
      left: 12px;
      top: 8px;
      padding: 4px 8px;
      background: transparent;
      color: var(--md-sys-color-on-surface-variant);
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      line-height: 1;
      opacity: 0.8;
      z-index: 1;
      pointer-events: none;
    }
    ` : ''}

    /* 代码块复制按钮 */
    ${config.code.block.showCopyButton ? `
    .prose .code-block-wrapper {
      position: relative;
    }
    
    .prose .code-copy-button {
      position: absolute;
      right: 8px;
      top: 8px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      padding: 0;
      background: var(--md-sys-color-surface-container);
      color: var(--md-sys-color-on-surface-variant);
      border: 1px solid var(--md-sys-color-outline-variant);
      border-radius: 6px;
      cursor: pointer;
      z-index: 10;
      opacity: 1;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .prose .code-copy-button:hover {
      background: var(--md-sys-color-surface-variant);
      border-color: var(--md-sys-color-outline);
      color: var(--md-sys-color-on-surface);
    }
    
    .prose .code-copy-button:active {
      transform: scale(0.95);
    }
    
    .prose .code-copy-button.copied {
      color: var(--md-sys-color-primary);
      border-color: var(--md-sys-color-primary);
    }
    
    .prose .code-copy-button svg {
      width: 18px;
      height: 18px;
      flex-shrink: 0;
      display: block;
    }
    
    .prose .code-copy-button .copy-icon {
      display: block;
    }
    
    .prose .code-copy-button .check-icon {
      display: none;
    }
    ` : ''}

    /* 代码行高亮 */
    ${config.code.block.highlightLines ? `
    .prose pre code .line.highlight {
      background-color: ${config.code.block.highlightColor};
      display: block;
      margin-left: -1em;
      margin-right: -1em;
      padding-left: 1em;
      padding-right: 1em;
      border-left: 3px solid var(--md-sys-color-primary);
    }
    ` : ''}

    .prose pre::-webkit-scrollbar {
      width: ${config.code.block.scrollbarWidth};
      height: ${config.code.block.scrollbarWidth};
    }

    .prose pre::-webkit-scrollbar-track {
      background: var(--md-sys-color-surface-variant);
      border-radius: 4px;
    }

    .prose pre::-webkit-scrollbar-thumb {
      background: ${config.code.block.scrollbarColor};
      border-radius: 4px;
    }

    .prose pre::-webkit-scrollbar-thumb:hover {
      background: var(--md-sys-color-primary);
    }

    .prose pre code {
      background: none;
      border: none;
      padding: 0;
      font-size: inherit;
      color: inherit;
    }

    /* === 引用块样式 === */
    .prose blockquote {
      font-size: ${config.blockquote.fontSize};
      font-style: ${config.blockquote.fontStyle};
      font-weight: ${config.blockquote.fontWeight};
      color: ${config.blockquote.color};
      background-color: ${config.blockquote.backgroundColor};
      border-left: ${config.blockquote.borderLeft};
      padding: ${config.blockquote.padding};
      margin-top: ${config.blockquote.marginTop};
      margin-bottom: ${config.blockquote.marginBottom};
      border-radius: ${config.blockquote.borderRadius};
      box-shadow: ${config.blockquote.boxShadow};
      position: relative;
    }

    /* 引用块响应式 */
    @media (min-width: 768px) {
      .prose blockquote {
        font-size: ${config.blockquote.fontSizeMd};
      }
    }

    @media (min-width: 1024px) {
      .prose blockquote {
        font-size: ${config.blockquote.fontSizeLg};
      }
    }

    ${config.blockquote.showQuoteMark ? `
    .prose blockquote::before {
      content: '"';
      position: absolute;
      top: -0.2em;
      left: 0.2em;
      font-size: ${config.blockquote.quoteMarkSize};
      color: ${config.blockquote.quoteMarkColor};
      opacity: 0.2;
      font-family: var(--reay-font-sans);
      line-height: 1;
    }
    ` : ''}

    /* === 列表样式 === */
    .prose ul {
      margin-top: ${config.list.ul.marginTop};
      margin-bottom: ${config.list.ul.marginBottom};
      padding-left: ${config.list.ul.paddingLeft};
      list-style-type: ${config.list.ul.markerType};
    }

    .prose ul::marker {
      color: ${config.list.ul.markerColor};
    }

    .prose ol {
      margin-top: ${config.list.ol.marginTop};
      margin-bottom: ${config.list.ol.marginBottom};
      padding-left: ${config.list.ol.paddingLeft};
    }

    .prose ol::marker {
      color: ${config.list.ol.markerColor};
      font-weight: ${config.list.ol.markerFontWeight};
    }

    .prose li {
      margin-bottom: ${config.list.li.marginBottom};
      line-height: ${config.list.li.lineHeight};
    }

    .prose li:hover {
      transform: translateX(4px);
      transition: transform 0.2s ease;
    }

    /* 任务列表 */
    .prose input[type="checkbox"] {
      width: ${config.list.task.checkboxSize};
      height: ${config.list.task.checkboxSize};
      margin-right: 0.5em;
      accent-color: ${config.list.task.checkedColor};
      cursor: pointer;
      border-radius: 3px;
      transition: all 0.2s ease;
    }
    
    .prose input[type="checkbox"]:hover {
      transform: scale(1.1);
    }
    
    .prose input[type="checkbox"]:disabled {
      cursor: not-allowed;
      opacity: 0.6;
    }
    
    /* 已完成任务的样式 */
    .prose li.task-completed {
      opacity: 0.7;
      transition: opacity 0.3s ease;
    }
    
    .prose li.task-completed > * {
      text-decoration: line-through;
      text-decoration-color: var(--md-sys-color-outline);
    }
    
    .prose li.task-completed input[type="checkbox"] {
      text-decoration: none;
    }
    
    /* 打勾动画 */
    .prose .task-check-animation {
      animation: taskCheckBounce 0.3s ease;
    }
    
    @keyframes taskCheckBounce {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.2); }
    }

    /* === 表格样式 === */
    .prose table {
      width: ${config.table.width};
      margin-top: ${config.table.marginTop};
      margin-bottom: ${config.table.marginBottom};
      font-size: ${config.table.fontSize};
      border-collapse: ${config.table.borderCollapse};
      border: ${config.table.border};
      border-radius: ${config.table.borderRadius};
      overflow: ${config.table.overflow};
    }

    .prose th {
      background-color: ${config.table.th.backgroundColor};
      color: ${config.table.th.color};
      font-weight: ${config.table.th.fontWeight};
      padding: ${config.table.th.padding};
      border-bottom: ${config.table.th.borderBottom};
      text-align: ${config.table.th.textAlign};
    }

    .prose td {
      padding: ${config.table.td.padding};
      border-bottom: ${config.table.td.borderBottom};
    }

    ${config.table.striped ? `
    .prose tr:nth-child(even) {
      background-color: ${config.table.stripedColor};
    }
    ` : ''}

    .prose tr:hover {
      background-color: ${config.table.hoverColor};
      transform: scale(1.01);
      transition: all 0.2s ease;
    }

    /* === 图片样式 === */
    .prose img {
      max-width: ${config.image.maxWidth};
      margin-top: ${config.image.marginTop};
      margin-bottom: ${config.image.marginBottom};
      border-radius: ${config.image.borderRadius};
      border: ${config.image.border};
      box-shadow: ${config.image.boxShadow};
      transition: ${config.image.transition};
      cursor: ${config.image.cursor};
      display: ${config.image.display};
    }

    .prose img:hover {
      transform: ${config.image.hoverTransform};
      box-shadow: ${config.image.hoverShadow};
    }

    /* === 分隔线样式 === */
    .prose hr {
      margin-top: ${config.hr.marginTop};
      margin-bottom: ${config.hr.marginBottom};
      border: ${config.hr.border};
      height: ${config.hr.height};
      background: ${config.hr.background};
      position: relative;
    }

    ${config.hr.showDecorator ? `
    .prose hr::after {
      content: '${config.hr.decoratorSymbol}';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: var(--md-sys-color-surface);
      color: ${config.hr.decoratorColor};
      padding: 0 0.5em;
      font-size: 1.2em;
    }
    ` : ''}

    /* === 其他元素样式 === */
    .prose mark {
      background-color: ${config.others.mark.backgroundColor};
      color: ${config.others.mark.color};
      padding: ${config.others.mark.padding};
      border-radius: ${config.others.mark.borderRadius};
    }

    .prose kbd {
      background-color: ${config.others.kbd.backgroundColor};
      color: ${config.others.kbd.color};
      padding: ${config.others.kbd.padding};
      border-radius: ${config.others.kbd.borderRadius};
      border: ${config.others.kbd.border};
      box-shadow: ${config.others.kbd.boxShadow};
      font-size: ${config.others.kbd.fontSize};
      font-family: ${config.others.kbd.fontFamily};
      font-weight: ${config.others.kbd.fontWeight};
    }

    .prose abbr {
      text-decoration: ${config.others.abbr.textDecoration};
      cursor: ${config.others.abbr.cursor};
      border-bottom: ${config.others.abbr.borderBottom};
    }

    .prose details {
      margin-top: ${config.others.details.marginTop};
      margin-bottom: ${config.others.details.marginBottom};
      padding: ${config.others.details.padding};
      background-color: ${config.others.details.backgroundColor};
      border-radius: ${config.others.details.borderRadius};
      border: ${config.others.details.border};
      box-shadow: ${config.others.details.boxShadow};
    }

    .prose summary {
      cursor: pointer;
      font-weight: 600;
      user-select: none;
    }

    .prose summary:hover {
      color: var(--md-sys-color-primary);
    }

    /* === 强调元素 === */
    .prose strong {
      font-weight: ${config.others.strong.fontWeight};
      color: ${config.others.strong.color};
    }

    .prose em {
      font-style: ${config.others.em.fontStyle};
      color: ${config.others.em.color};
    }

    .prose del {
      text-decoration-color: ${config.others.del.textDecorationColor};
      opacity: ${config.others.del.opacity};
    }

    .prose sup {
      font-size: ${config.others.sup.fontSize};
      vertical-align: ${config.others.sup.verticalAlign};
    }

    .prose sub {
      font-size: ${config.others.sub.fontSize};
      vertical-align: ${config.others.sub.verticalAlign};
    }
  `;
}
