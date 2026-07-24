# Theme Presets Must Preserve Direct Configuration

## Signal

主题预设首次实现把原有完整 `themeConfig` 拆成 `activeThemePreset` 与 `themeOverrides`。功能上仍能修改背景和主色，但用户无法从编辑入口直观看出参数位置，并误以为背景配置已被移除。

## Lesson

增加模板或预设层时，用户入口仍应保持一个可发现、可直接编辑的对象。预设应是该对象中的基础字段，而不是要求用户理解额外的选择变量、覆盖变量和派生兼容导出。

颜色覆盖还需要明确区分简单与高级意图：简单 `primary` 应从新主色重推完整动态色板；显式 `source` 才表示用户要控制 secondary、tertiary 或 neutral key colors。不能让预设残留的辅助色静默改变“修改主色”的含义。

## Applied Rule

- 用户只编辑 `defineTheme({ preset, ... })`。
- 兼容导出从最终对象派生，不形成第二配置源。
- 配置示例在入口文件直接展示常用背景写法。
- 自动化测试覆盖 primary/source 优先级、深度合并和默认预设传播。
