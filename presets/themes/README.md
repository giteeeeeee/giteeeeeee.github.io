# Theme Presets

这里的预设只定义视觉语言，不包含姓名、邮箱、GitHub、导航、文章或第三方凭据。

先通过 [`docs/THEME-GALLERY.md`](../../docs/THEME-GALLERY.md) 查看 13 套预设的真实 Chrome 首页效果，再选择最接近目标气质的一套。

| ID | 名称 | 适合场景 |
| --- | --- | --- |
| `technology` | 科技流光 | 默认科技感主页、开源项目与开发博客 |
| `paper` | 米纸手记 | 米黄色低彩度纸张、手记、散文和生活记录 |
| `eink` | 墨水屏 | 低干扰长文阅读与知识库 |
| `forest` | 青苔护眼 | 长时间浏览、日常记录和自然主题 |
| `editorial` | 朱砂刊物 | 独立杂志、作品集和编辑式博客 |
| `inkwash` | 水墨江湖 | 东方随笔、游记和长篇叙事 |
| `monochrome-ink` | 墨白丹朱 | 黑白水墨、楷体长文与克制朱砂点缀 |
| `anime-spring` | 春日动画 | 轻快日常、插画和青春记录 |
| `anime-night` | 动画夜城 | 夜间创作、城市摄影和霓虹视觉 |
| `cosmic-abyss` | 星渊银河 | 深空叙事、天文主题和沉浸式作品集 |
| `ukiyo` | 浮世绘 | 东方刊物、文化记录和版画气质作品集 |
| `ocean` | 海岸晴空 | 旅行、摄影与清爽生活记录 |
| `retro-terminal` | 复古终端 | 开发日志、极客主页和代码笔记 |

## 一个对象完成配置

编辑 `src/app/config/theme.config.ts`：

```ts
export const themeConfig = defineTheme({
  preset: 'paper',
  primary: '#5F7355',
  typography: {
    baseSize: 16,
  },
  shape: {
    radiusLg: '18px',
  },
  background: {
    decoration: 'paper',
  },
});
```

不写其他字段时只需修改 `preset`。填写 `primary` 会从新主色重新生成完整 MD3 配色；填写高级 `source` 时则只采用显式关键色。背景、字体、shape 和 effects 都在同一对象中按层级覆盖。

八套扩展主题的山岚、墨痕、云层、夜城、黑洞银河、版画波纹、海面与扫描线都由 `Background.astro` 使用原创 CSS 绘制，不请求外部背景图片；`preset-identities.css` 再统一改变表面材质、边界、阴影、按钮和 Hero 细节，所以它们不是同一套组件的简单换色。水墨、春日、夜城、星渊银河、浮世绘和海岸会继续消费覆盖后的 MD3 token；墨白丹朱固定中性黑白与朱砂身份，复古终端固定经典黑底与磷光绿身份。预设 `mode` 只在访客没有本地选择时作为默认值，显式的 light/dark/system 选择始终优先。

完整参数和图片背景示例见 [`docs/THEME-CONFIG.md`](../../docs/THEME-CONFIG.md)。若增加未自托管的字体，请同时在 `DocumentShell.astro` 引入字体资源。

## 创建自己的预设

复制一个 `.ts` 文件、修改元数据与 `config`，再将它加入 `index.ts` 的 `themePresets`。随后在 `theme.config.ts` 修改 `preset`。所有预设都会被 Astro/TypeScript 校验，即使当前没有启用。
