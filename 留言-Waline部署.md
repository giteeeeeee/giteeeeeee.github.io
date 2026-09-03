# 留言（Waline）服务端部署指南 —— 腾讯云 CloudBase

> 说明：Waline 是博客现有的评论系统（主题已配好 `type: waline`），缺的只是**服务端**。
> 这份指南带你把它部署到腾讯云 CloudBase（国内访问最稳、Waline 官方支持）。

## 0. 前置条件

- 一个**腾讯云账号**（需要实名认证）。
- 部署完成后会得到一个 `server_url`，把它填回 `_config.meow.yml` 即可（见第 5 步）。

## 1. 开通云开发 CloudBase

1. 登录腾讯云控制台，搜索并进入「**云开发 CloudBase**」。
2. 点「开通」，**创建一个环境**（地域选广州或上海，选择免费额度 / 按量付费方案即可）。
3. 记下环境的**环境 ID**（形如 `blog-xxxx`），后面会用。

## 2. 部署 Waline

### 方式 A：官方一键部署（推荐，最简单）

1. 打开 Waline 官方文档的「CloudBase 云开发部署」页面：
   https://waline.js.org/guide/deploy/cloudbase.html
2. 页面上有「部署」按钮，点它跳转到腾讯云 CloudBase，登录后选择你刚创建的环境。
3. 一路下一步完成，等待 3–5 分钟部署完成。
4. 点「访问」得到服务端地址（就是你的 `server_url`，形如 `https://xxx.ap-shanghai.app.tcloudbase.com`）。

> 也可以使用社区一键模板仓库 `tcb-starter`（基于 CloudBase Framework），效果相同。

### 方式 B：命令行部署（可选）

```bash
npm i -g @cloudbase/cli      # 安装 CloudBase CLI
tcb login                    # 登录腾讯云（会打开浏览器授权）
tcb env list                 # 查看环境列表，确认环境 ID
tcb framework deploy -e <你的环境ID>   # 部署 Waline 模板
```

## 3. 注册管理员（重要）

部署完成后，**第一个**访问 `<server_url>/ui/register` 注册的用户，会自动成为**管理员**。

- 注册：`https://你的server_url/ui/register`
- 以后管理评论（编辑/删除/回复）：`https://你的server_url/ui`

## 4. 配置安全域名（CORS）

如果评论框在博客上显示不出或报 `Failed to fetch`，是 CORS 没放开：

1. 进入 CloudBase 控制台 → 你的环境 → **云函数/HTTP 访问服务** → 安全配置。
2. 在**安全域名**里添加：`https://giteeeeeee.github.io`。

## 5. 把 server_url 填回博客

编辑仓库里的 `_config.meow.yml`，找到：

```yaml
comment:
  enable: true
  type: waline
  waline:
    server_url: ''        # ← 填成你的地址，例如 https://xxx.ap-shanghai.app.tcloudbase.com
    lang: zh-CN
```

- **末尾不要加 `/`**（否则首页「最新评论」可能加载失败）。
- 填好后提交，GitHub Actions 会自动重新部署博客，留言板就生效了。

## 常见问题

- **免费额度**：CloudBase 免费额度约 1000 GBs/月 + 有限读写次数，个人博客完全够用。
- **自定义域名**：默认给的 `.app.tcloudbase.com` 域名即可用；想绑自己的域名需域名已备案。
- **评论通知**（可选）：可在云函数里配 `SC_KEY`（Server 酱微信通知）、`SMTP_USER`/`SMTP_PASS`（邮件通知）等环境变量，非必需。

> 以上步骤以 [Waline 官方文档](https://waline.js.org/) 和腾讯云 CloudBase 文档为准。
