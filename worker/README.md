# 博客后台（自建极简 CMS）

一个跑在 Cloudflare Workers 上的单文件后台，让博主**在网页里写文章、拖图上传**，访客只能浏览 + 留言、无法修改。

- 后台地址 = Worker 自己的域名（如 `https://blog-admin.你的子域.workers.dev`），只给博主用。
- 登录 = 输入 admin 密码（服务端 PBKDF2 哈希校验，非明文）。
- 编辑 = 通过 GitHub API 把 Markdown 写进仓库 `source/_posts/`、图片写进 `source/images/`。
- 提交后，仓库自带的 GitHub Actions 会自动构建部署，约 1–2 分钟更新到 `https://giteeeeeee.github.io`。
- 完全绕开本机 SSH 22 端口被墙 / 中文用户名 mojibake 的问题（走 HTTPS API）。

## 你需要准备

1. **Cloudflare 账号**（免费，无需绑卡）。
2. **GitHub fine-grained PAT**：GitHub → Settings → Developer settings → Fine-grained tokens → Generate new token：
   - Repository access：只选 `giteeeeeee/giteeeeeee.github.io`
   - Permissions → Repository permissions → **Contents: Read and write**
   - 其它都保持默认（只读或 No access），过期时间按需设置。
3. 定一个 **admin 密码**（建议 12 位以上随机），生成哈希：

   ```bash
   node hash-password.js "你的密码"
   ```

   会输出两个值 `ADMIN_PASSWORD_SALT` 和 `ADMIN_PASSWORD_HASH`，记下来。
4. 再随便生成一个**会话签名密钥**（任意长随机字符串），作为 `SESSION_SECRET`，例如：
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

## 部署方式（二选一）

### 方式 A：网页后台（最简单，无需安装任何东西）

1. 打开 Cloudflare 控制台 → **Workers & Pages → Create → Create Worker**（名称随意，如 `blog-admin`）。
2. 点 **Edit code**，把 `index.js` 的**全部内容**粘贴进去，点 **Deploy**。
3. 点 **Settings → Variables and Secrets → Add secret**，依次添加 4 个 Secret：
   - `ADMIN_PASSWORD_SALT` = 上一步的 SALT
   - `ADMIN_PASSWORD_HASH` = 上一步的 HASH
   - `SESSION_SECRET` = 随机字符串
   - `GITHUB_TOKEN` = GitHub fine-grained PAT
4. 回到 Workers 首页，找到你的 Worker，点它的域名（形如 `blog-admin.xxx.workers.dev`）打开。
5. 输入密码登录即可使用。

### 方式 B：wrangler CLI

```bash
npm i -g wrangler
wrangler login
cd worker
npx wrangler secret put ADMIN_PASSWORD_SALT
npx wrangler secret put ADMIN_PASSWORD_HASH
npx wrangler secret put SESSION_SECRET
npx wrangler secret put GITHUB_TOKEN
npx wrangler deploy
```

部署完终端会打印一个 `https://xxx.workers.dev` 地址，就是你的后台。

## 使用

- 打开后台地址 → 输密码登录。
- 「新建文章」：填标题（文件名可留空自动生成）、日期、分类、标签，正文用 Markdown。
- **图片**：直接把图片拖进虚线框（或点击选择、或 Ctrl+V 粘贴截图），会自动上传并插入 `![](/images/xxx.png)`。
- 「保存」→ 线上约 1–2 分钟自动更新。
- **「相册」标签页**：新建/删除相册、上传照片到相册、编辑相册名与封面、增删照片；改完点「保存相册修改」，数据写回 `source/_data/albums.yml`。

## 安全说明

- 密码只存 **PBKDF2-SHA256 哈希**，存于 Cloudflare 加密 Secret，不进代码、不进仓库。
- 会话 Cookie 为 HttpOnly + SameSite，签名密钥单独存放。
- 登录接口带**限流**（同 IP 15 分钟最多错 5 次）。
- GitHub 令牌为**最小权限**（仅本仓库、仅 Contents 读写），只存服务端，浏览器拿不到。
- 后台页面带 `noindex`，不被搜索引擎收录。
- 本方案面向「单管理员 + 不对外传播」的低风险场景；请务必使用强密码。

## 常见问题

- **大陆访问后台慢/不稳**：`*.workers.dev` 在大陆可能不稳。可后续给 Worker 绑自定义域名，或把同一份代码迁到 Deno Deploy / 腾讯云函数计算（逻辑完全兼容，只改运行时）。
- **登录提示 429**：密码错太多，等 15 分钟再试。
- **上传失败**：确认 GITHUB_TOKEN 的 Contents 权限是「Read and write」，且授权了本仓库。
- **改完没更新**：GitHub Actions 每次 push 会自动跑，去仓库 Actions 页确认构建是否成功。
