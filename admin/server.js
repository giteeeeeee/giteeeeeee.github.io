// =====================================================================
//  博客本地后台（单文件，零新增依赖）
//  作用：在你自己电脑上跑一个网页后台，直接在本地读写文件：
//    - 文章   -> source/_posts/*.md
//    - 图片   -> source/images/*
//    - 相册   -> source/_data/albums.yml
//    - 发布   -> 一键 git add + commit + push（GitHub Actions 自动上线）
//
//  用法：在博客根目录执行  node admin/server.js
//       然后浏览器打开 http://localhost:8787
//
//  依赖：Node 自带模块 + 博客已安装的 js-yaml（node_modules 里已有）。
//  为什么零密码：后台只监听 127.0.0.1，别人从外面根本访问不到，等于只有你能用。
// =====================================================================

const http = require('http');
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const yaml = require('js-yaml');

const PORT = Number(process.env.PORT) || 8787;
const HOST = '127.0.0.1'; // 只监听本机，外部访问不到

const ADMIN_DIR = __dirname;                    // admin/
const ROOT = path.resolve(ADMIN_DIR, '..');     // 博客根目录
const POSTS_DIR = path.join(ROOT, 'source', '_posts');
const IMAGES_DIR = path.join(ROOT, 'source', 'images');
const ALBUMS_PATH = path.join(ROOT, 'source', '_data', 'albums.yml');
const ADMIN_HTML = path.join(ADMIN_DIR, 'admin.html');

// 用 JSON_SCHEMA 解析：不把日期串变成 Date、不把 yes/no 变布尔，最可预测
const YAML_OPTS = { schema: yaml.JSON_SCHEMA };

// ---------------- 小工具 ----------------

function sendJson(res, status, obj) {
  const body = JSON.stringify(obj);
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(body);
}

function readBody(req) {
  return new Promise((resolve) => {
    let data = '';
    req.on('data', (c) => { data += c; });
    req.on('end', () => {
      try { resolve(data ? JSON.parse(data) : {}); } catch { resolve({}); }
    });
  });
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

// 文件名安全化：去掉路径分隔符和非法字符，只留字母数字中文下划线连字符
function safeName(s) {
  return String(s || '')
    .replace(/[\\/:*?"<>|#\r\n]+/g, '-')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

// ---------------- 文章 ----------------

function splitFrontmatter(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) return { data: {}, content: text };
  let data = {};
  try { data = yaml.load(m[1], YAML_OPTS) || {}; } catch { /* 解析失败按空处理 */ }
  return { data, content: m[2] };
}

function listPosts() {
  ensureDir(POSTS_DIR);
  return fs.readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith('.md'))
    .map((f) => {
      const raw = fs.readFileSync(path.join(POSTS_DIR, f), 'utf-8');
      const { data } = splitFrontmatter(raw);
      return {
        slug: f.replace(/\.md$/, ''),
        title: data.title || '(无标题)',
        date: data.date || '',
        category: Array.isArray(data.categories) ? data.categories.join(', ') : (data.categories || ''),
        tags: Array.isArray(data.tags) ? data.tags : (data.tags ? [String(data.tags)] : []),
      };
    })
    .sort((a, b) => (String(a.date) < String(b.date) ? 1 : -1));
}

function readPost(slug) {
  const file = path.join(POSTS_DIR, slug + '.md');
  if (!fs.existsSync(file)) return null;
  const raw = fs.readFileSync(file, 'utf-8');
  const { data, content } = splitFrontmatter(raw);
  return {
    slug,
    title: data.title || '',
    date: data.date || '',
    categories: Array.isArray(data.categories) ? data.categories : (data.categories ? [String(data.categories)] : []),
    tags: Array.isArray(data.tags) ? data.tags : (data.tags ? [String(data.tags)] : []),
    excerpt: data.excerpt || '',
    content,
  };
}

function writePost(slug, post) {
  ensureDir(POSTS_DIR);
  const data = {};
  data.title = post.title || '';
  data.date = post.date || new Date().toISOString().slice(0, 19).replace('T', ' ');
  if (Array.isArray(post.categories) && post.categories.length) data.categories = post.categories;
  if (Array.isArray(post.tags) && post.tags.length) data.tags = post.tags;
  if (post.excerpt) data.excerpt = post.excerpt;
  const fm = '---\n' + yaml.dump(data, { lineWidth: -1 }) + '---\n';
  fs.writeFileSync(path.join(POSTS_DIR, slug + '.md'), fm + (post.content || ''), 'utf-8');
}

function deletePost(slug) {
  const file = path.join(POSTS_DIR, slug + '.md');
  if (fs.existsSync(file)) fs.unlinkSync(file);
}

// ---------------- 相册 ----------------

// 读 albums.yml，把 images（标题: 地址 的映射）转成数组 [{title,url}]，方便界面编辑
function readAlbums() {
  if (!fs.existsSync(ALBUMS_PATH)) return [];
  let data = {};
  try { data = yaml.load(fs.readFileSync(ALBUMS_PATH, 'utf-8'), YAML_OPTS) || {}; } catch {}
  const list = data.albums_list || [];
  return list.map((a) => {
    const images = [];
    if (a.images && typeof a.images === 'object') {
      for (const [title, url] of Object.entries(a.images)) {
        if (url) images.push({ title, url: String(url) });
      }
    }
    return {
      name: a.name || '',
      cover: a.cover || '',
      span: a.span != null ? a.span : '',
      column: a.column != null ? a.column : '',
      encrypt: !!a.encrypt,
      images,
    };
  });
}

function writeAlbums(albums) {
  const list = albums.map((a) => {
    const item = { name: a.name, cover: a.cover || '' };
    if (a.span !== '' && a.span != null) item.span = Number(a.span);
    if (a.column !== '' && a.column != null) item.column = Number(a.column);
    item.encrypt = !!a.encrypt;
    const images = {};
    for (const img of (a.images || [])) {
      if (img && img.url) images[img.title || '照片'] = img.url;
    }
    item.images = images;
    return item;
  });
  const header =
    '# =====================================================================\n' +
    '#  相册数据（Meow 主题 external 相册模式，由本地后台自动维护）\n' +
    '#  - name   相册名\n' +
    '#  - cover  封面图（本地路径 /images/xxx 或外链 URL）\n' +
    '#  - span   封面在合集页占的列宽（可选）\n' +
    '#  - column 相册内图片列数\n' +
    '#  - images 相册内图片：标题: 图片地址\n' +
    '# =====================================================================\n\n';
  fs.writeFileSync(ALBUMS_PATH, header + yaml.dump({ albums_list: list }, { lineWidth: -1 }), 'utf-8');
}

// ---------------- 图片上传 ----------------

function uploadImage(body) {
  ensureDir(IMAGES_DIR);
  const original = String(body.filename || 'image.png');
  const base = path.basename(original).replace(/[^\w.一-龥-]+/g, '_').slice(0, 80) || 'image';
  const name = Date.now() + '-' + base;
  const raw = String(body.data || '');
  const buf = Buffer.from(raw.replace(/^data:[^;]+,?/, '').replace(/^data:[^;]+;base64,/, ''), 'base64');
  if (!buf.length) throw new Error('图片数据为空');
  fs.writeFileSync(path.join(IMAGES_DIR, name), buf);
  return '/images/' + name;
}

// ---------------- 发布（git） ----------------

function runGit(args) {
  try { return execFileSync('git', args, { cwd: ROOT, encoding: 'utf8' }).trim(); }
  catch { return ''; }
}

function publish(message) {
  const status = runGit(['status', '--porcelain']);
  if (!status) return { ok: true, changed: false, message: '没有改动，无需发布。' };

  const msg = String(message || '更新博客')
    .replace(/[\r\n"`$&|<>%^]/g, ' ')
    .trim()
    .slice(0, 200) || '更新博客';

  // 提交身份兜底（若本机没配 user.name/email，用一个占位身份，避免 git commit 报错）
  const args = [];
  if (!runGit(['config', 'user.name'])) args.push('-c', 'user.name=blog-admin');
  if (!runGit(['config', 'user.email'])) args.push('-c', 'user.email=blog-admin@localhost');

  execFileSync('git', ['add', '-A'], { cwd: ROOT });
  execFileSync('git', [...args, 'commit', '-m', msg], { cwd: ROOT });
  execFileSync('git', ['push'], { cwd: ROOT });
  return { ok: true, changed: true, message: '已发布！GitHub Actions 正在构建，约 1–2 分钟后更新到线上。' };
}

// ---------------- 路由 ----------------

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://' + req.headers.host);
  const method = req.method;
  const p = url.pathname;

  try {
    // 页面
    if (method === 'GET' && (p === '/' || p === '/admin.html')) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(fs.readFileSync(ADMIN_HTML, 'utf-8'));
      return;
    }

    // 文章
    if (p === '/api/posts' && method === 'GET') {
      sendJson(res, 200, listPosts());
      return;
    }
    if (p === '/api/posts' && method === 'POST') {
      const body = await readBody(req);
      const title = String(body.title || '').trim();
      if (!title) { sendJson(res, 400, { error: '标题不能为空' }); return; }
      let slug = safeName(body.slug || '');
      if (!slug) {
        const d = new Date();
        const pad = (n) => String(n).padStart(2, '0');
        slug = 'post-' + d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate()) + '-' + pad(d.getHours()) + pad(d.getMinutes()) + pad(d.getSeconds());
      }
      writePost(slug, {
        title,
        date: body.date || '',
        categories: Array.isArray(body.categories) ? body.categories.filter(Boolean) : (body.categories ? [body.categories] : []),
        tags: Array.isArray(body.tags) ? body.tags.filter(Boolean) : (body.tags ? [body.tags] : []),
        excerpt: body.excerpt || '',
        content: body.content || '',
      });
      sendJson(res, 200, { ok: true, slug });
      return;
    }

    const postMatch = p.match(/^\/api\/posts\/([^/]+)$/);
    if (postMatch) {
      const slug = decodeURIComponent(postMatch[1]);
      if (method === 'GET') {
        const post = readPost(slug);
        if (!post) { sendJson(res, 404, { error: '文章不存在' }); return; }
        sendJson(res, 200, post);
        return;
      }
      if (method === 'DELETE') {
        deletePost(slug);
        sendJson(res, 200, { ok: true });
        return;
      }
    }

    // 图片上传
    if (p === '/api/upload' && method === 'POST') {
      const body = await readBody(req);
      const url = uploadImage(body);
      sendJson(res, 200, { url });
      return;
    }

    // 相册
    if (p === '/api/albums' && method === 'GET') {
      sendJson(res, 200, readAlbums());
      return;
    }
    if (p === '/api/albums' && method === 'PUT') {
      const body = await readBody(req);
      writeAlbums(Array.isArray(body) ? body : []);
      sendJson(res, 200, { ok: true });
      return;
    }

    // 发布
    if (p === '/api/publish' && method === 'POST') {
      const body = await readBody(req);
      sendJson(res, 200, publish(body.message));
      return;
    }

    sendJson(res, 404, { error: 'not found' });
  } catch (e) {
    sendJson(res, 500, { error: e && e.message ? e.message : String(e) });
  }
});

server.listen(PORT, HOST, () => {
  console.log('==============================================');
  console.log('  博客后台已启动');
  console.log('  请用浏览器打开： http://localhost:' + PORT);
  console.log('  （关闭本窗口即停止后台）');
  console.log('==============================================');
});
