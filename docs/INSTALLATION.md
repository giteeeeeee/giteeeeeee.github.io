# 安装与本地环境

## 要求

- Node.js `>=22.12.0`
- npm `>=9.6.5`
- Git

仓库的 `.nvmrc` 固定 Node 22。使用 nvm 时：

```bash
nvm install
nvm use
node --version
npm --version
```

## 安装依赖

首次克隆或 CI 使用 lockfile 的确定性安装：

```bash
npm ci
```

只有在主动升级依赖并准备提交 `package-lock.json` 时才使用 `npm install`。

## 本地开发

```bash
npm run dev
```

默认地址是 `http://localhost:4321`。开发服务器不会生成完整 Pagefind 索引；搜索生产行为应使用：

```bash
npm run build
npm run preview
```

## 环境变量

```bash
cp .env.example .env
```

```env
SITE=https://your-domain.example
BASE=/
GITHUB_TOKEN=
```

- `SITE`：生产 HTTPS origin；开发时可留作占位，但发布前必须替换。
- `BASE`：必须保持 `/`。
- `GITHUB_TOKEN`：可选，只放在本地 `.env` 或 CI Secret。

`npm run check:production` 会自动读取本地 `.env`；显式传入的环境变量仍可用于 CI。

## 安装浏览器测试依赖

首次运行 E2E：

```bash
npx playwright install chromium
```

Linux CI 使用：

```bash
npx playwright install --with-deps chromium
```

## 验证安装

```bash
npm run lint
npm run check
npm run build
```

完整门禁：

```bash
npm run verify
npm run audit
```

## 常见问题

### Node 版本错误

重新执行 `nvm use`，确认 `node --version` 为 22.12.0 或更高版本。

### 依赖状态异常

不要删除 lockfile。先删除本地 `node_modules` 后重新运行 `npm ci`。

### 搜索页没有完整结果

Pagefind 只在 `npm run build` 后写入 `dist/pagefind`。使用生产预览，不要把开发服务器结果当作最终搜索验证。

### GitHub 项目为空

模板默认的 `yourusername` 会主动跳过外部请求。请在 `user.config.ts` 填写真实公开用户名；需要更高 API 限额时再提供 `GITHUB_TOKEN`。
