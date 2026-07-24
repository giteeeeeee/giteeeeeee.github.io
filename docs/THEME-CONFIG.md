# 主题配置

Astro Theme Reay 使用一个 `defineTheme({ ... })` 对象管理预设、MD3 配色、字体、圆角、背景和动效。用户只需编辑 `src/app/config/theme.config.ts`；`presets/themes/` 保存可复用基础方案，不保存姓名、内容或凭据。

## 最小配置

```ts
export const themeConfig = defineTheme({
  preset: 'technology',
});
```

将 `preset` 改成下列任一值即可切换完整视觉基础：

| ID | 中文名 | 视觉特点 |
| --- | --- | --- |
| `technology` | 科技流光 | 默认青蓝配色、圆体、柔和光晕与轻网格 |
| `paper` | 米纸手记 | 米黄色、Neutral 低彩度色板、宋体正文与纸纤维 |
| `eink` | 墨水屏 | 单色 MD3、近直角、无抬升阴影与电子纸颗粒 |
| `forest` | 青苔护眼 | 鼠尾草绿、柔和圆角和低刺激纸面纹理 |
| `editorial` | 朱砂刊物 | 朱砂红、衬线标题和独立杂志式边界 |
| `inkwash` | 水墨江湖 | 烟青灰墨、朱砂点题、衬线正文与宣纸远山 |
| `monochrome-ink` | 墨白丹朱 | 中性黑白宣纸、楷体细线、浓淡墨痕与克制朱砂印 |
| `anime-spring` | 春日动画 | 天空蓝、樱花粉、圆体、云层与静态花瓣 |
| `anime-night` | 动画夜城 | 靛蓝、霓虹青粉、星点与城市剪影 |
| `cosmic-abyss` | 星渊银河 | 深空蓝紫、银河尘带、星野与黑洞吸积盘 |
| `ukiyo` | 浮世绘 | 靛青、赭红、米纸、日轮与版画波纹 |
| `ocean` | 海岸晴空 | 海蓝、青绿、沙白、海平线与日光水纹 |
| `retro-terminal` | 复古终端 | 等宽字体、近直角、荧光绿、网格与扫描线 |

预设不只提供一组颜色。最终主题包含两层：MD3 根据 key colors 生成可访问的 light/dark 配色；`data-theme-preset` 再启用该预设的材质与组件身份，例如水墨的宣纸和朱砂印、墨白丹朱的中性黑白表面与楷体细线、春日的贴纸边缘、夜城的霓虹玻璃、星渊银河的观测舷窗与引力光环、浮世绘的双线版画边界、海岸的水光表面，以及终端的 CRT 扫描线和方角控件。这些身份规则集中在 `src/design-system/styles/preset-identities.css`，页面组件不各自判断预设。

## 同一对象直接修改

不需要再维护单独的 `activeThemePreset` 和 `themeOverrides`：

```ts
export const themeConfig = defineTheme({
  preset: 'paper',
  mode: 'system',
  primary: '#4E6B50',

  typography: {
    baseSize: 16,
    lineHeight: 1.72,
  },

  shape: {
    radiusLg: '18px',
  },

  background: {
    decoration: 'paper',
  },
});
```

所有字段都是可选覆盖。未填写的普通字段继续继承预设；typography/fontFamilies/scale、shape、background/imageStyle/gradient 和 effects/seasonal/seasons 会按层级合并。

`mode` 是没有本地选择时的默认明暗模式。`anime-night`、`cosmic-abyss` 与 `retro-terminal` 默认 `dark`，`monochrome-ink` 默认 `light`，其余内置预设默认 `system`。访客实际使用主题按钮后，`localStorage.theme` 中的显式 `light | dark | system` 始终优先；仅加载预设默认值不会写入本地存储，因此以后更换预设仍会采用新预设的默认模式。

## 配色规则

配置系统区分三个明确层级：

1. 不填写 `primary` 或 `source`：完整保留预设关键色。
2. 填写 `primary`：以它重新生成整套 MD3 色板，不继承预设固定的 secondary、tertiary 或 neutral；预设的算法变体会保留，因此 `paper` 仍是低彩度 neutral、`eink` 仍是 monochrome。
3. 填写 `source`：进入高级模式，只使用你显式填写的关键色，其余由 MD3 推导。`source.primary` 比顶层 `primary` 优先。

最常用的方式只有一行：

```ts
export const themeConfig = defineTheme({
  preset: 'paper',
  primary: '#4E6B50',
});
```

纸张纹理、字体、圆角与阴影仍来自 `paper`，但完整配色会从 `#4E6B50` 重新生成。

扩展预设同样遵循这条规则：覆盖 `primary` 会重生成 MD3 配色，但仍保留水墨、春日、夜城、黑洞银河、浮世绘或海岸的布局材质身份。`monochrome-ink` 与 `retro-terminal` 是刻意的固定身份：前者始终保留中性黑白表面与朱砂点缀，后者始终保留经典近黑背景与磷光绿核心色；`primary` 仍参与配置解析，但不会覆盖这两层专属视觉身份。

需要分别控制关键色时再使用 `source`：

```ts
export const themeConfig = defineTheme({
  preset: 'editorial',
  source: {
    primary: '#8B2635',
    secondary: '#76565A',
    tertiary: '#805532',
    neutral: '#777171',
    neutralVariant: '#7D6D70',
    variant: 'tonal-spot', // 也可使用低彩度 'neutral' 或单色 'monochrome'
  },
});
```

无论哪种方式，最终都会生成 light/dark 的 primary、secondary、tertiary、surface/container、outline、error 和对应 on-color。

## 背景

### MD3 渐变

```ts
background: {
  type: 'gradient',
  decoration: 'paper',
  blur: false,
  gradient: {
    useMD3Colors: true,
    direction: '155deg',
  },
}
```

### 自定义渐变

```ts
background: {
  type: 'gradient',
  decoration: 'plain',
  gradient: {
    useMD3Colors: false,
    colors: ['#f5f0e7', '#ddd5c5'],
    direction: '145deg',
  },
}
```

### 图片背景

```ts
background: {
  type: 'image',
  decoration: 'plain',
  imageUrl: '/images/background.jpg',
  blur: false,
  imageStyle: {
    size: 'cover',
    position: 'center',
    repeat: 'no-repeat',
    opacity: 0.72,
  },
}
```

`decoration` 可为 `aurora | paper | eink | plain | inkwash | monochrome-ink | anime-spring | anime-night | cosmic-abyss | ukiyo | ocean | terminal`。切换为图片且不希望保留预设纹理时，应同时设置 `decoration: 'plain'`。`type: 'none'` 会关闭全局背景层。

扩展场景不依赖外部图片，而是使用 MD3 RGB token 和原创 CSS 图层绘制；除固定黑白朱砂身份的 `monochrome-ink` 与固定黑绿身份的 `retro-terminal` 外，覆盖 `primary` 或 `source` 后，场景色彩会与新色板同步。所有场景默认静态，移动端会减少细节，`prefers-reduced-motion` 会关闭背景动画与过渡。

## 字体

字体按用途分成 global、brand、navigation、heading、body、metadata、prose、proseHeading 和 mono。只改 `global` 时，原本继承预设 global 的角色会自动跟随；预设刻意设置的差异角色仍保留，也可以逐项覆盖。

```ts
typography: {
  baseSize: 16,
  lineHeight: 1.72,
  fontFamilies: {
    global: fontStacks.rounded.global,
    prose: fontStacks.paper.global,
  },
  scale: {
    '2xl': 1.55,
  },
}
```

当前仓库自托管 Nunito Variable、寒蝉全圆体和 Noto Sans SC Variable。`monochrome-ink` 使用系统 `Kaiti SC / STKaiti / KaiTi / 楷体` 回退栈，不产生新的网络字体请求；缺少楷体时回退到系统 serif。引入新的 WebFont 时仍需在 `DocumentShell.astro` 加载相应资源。

## 圆角、阴影和动效

```ts
shape: {
  radiusXs: '2px',
  radiusSm: '5px',
  radiusMd: '9px',
  radiusLg: '14px',
  radiusXl: '18px',
  radiusPill: '999px',
  borderWidth: '1px',
  shadowSm: 'none',
  shadowMd: 'none',
  shadowLg: 'none',
},
effects: {
  homeWave: { enabled: false },
  seasonal: {
    enabled: false,
    respectReducedMotion: true,
    seasons: { autumn: true },
  },
}
```

只需填写准备修改的字段。重新启用持续动效时建议保留 `respectReducedMotion: true` 并单独检查移动端性能。

## 兼容导出

`activeThemePreset`、`fontFamilies` 和 `backgroundConfig` 仍会从最终 `themeConfig` 派生，供已有代码兼容。它们不是新的编辑入口，不要分别维护。

## 创建自己的预设

1. 复制 `presets/themes/` 中最接近的一套 `.ts` 文件。
2. 修改名称、说明和完整 `config`。
3. 在 `presets/themes/index.ts` 的 `themePresets` 注册新 ID。
4. 在 `theme.config.ts` 的 `preset` 选择它。
5. 运行验证。

## 验证

```bash
npm run check
npm run test:config
npm run verify
```

至少检查首页、Blog 详情、归档和相册，并覆盖浅色、深色、1440×900 与 390×844。确认没有横向溢出、字体资源正常加载，背景纹理不会遮挡文字。
