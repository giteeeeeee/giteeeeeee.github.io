// 博客后台 —— 自建极简 CMS（Cloudflare Workers，单文件、零 npm 依赖）
//
// 功能：admin 密码登录 → 网页编辑博文 + 拖图上传 + 相册管理，通过 GitHub API 写回仓库。
// 仓库：giteeeeeee/giteeeeeee.github.io（GitHub Actions 自动部署，改完自动上线）
//
// 需要 4 个 Secret（在 Cloudflare 后台/`wrangler secret put` 设置）：
//   ADMIN_PASSWORD_SALT   —— 密码盐（hex，由 hash-password.js 生成）
//   ADMIN_PASSWORD_HASH   —— 密码哈希（hex，PBKDF2-SHA256，100000 次，32 字节）
//   SESSION_SECRET        —— 会话签名密钥（任意长随机字符串）
//   GITHUB_TOKEN          —— fine-grained PAT，仅限本仓库、Contents: Read and write

const REPO = 'giteeeeeee/giteeeeeee.github.io';
const BRANCH = 'main';
const POSTS_DIR = 'source/_posts';
const IMAGES_DIR = 'source/images';
const ALBUMS_PATH = 'source/_data/albums.yml';
const SESSION_TTL = 7 * 24 * 60 * 60;   // 会话有效期（秒）：7 天
const PBKDF2_ITERATIONS = 100000;        // 必须与 hash-password.js 保持一致
const COOKIE_NAME = 'blog_session';
const MAX_LOGIN_FAILS = 5;               // 15 分钟内最多失败次数
const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const GITHUB_API = 'https://api.github.com';

// ============ 后台 UI（内嵌，避免额外静态资源文件） ============
// 注意：此字符串内部不能出现反引号或 ${，故 UI 里的 JS 全部用 + 拼接。
const ADMIN_HTML = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>博客后台</title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/easymde@2.18.0/dist/easymde.min.css">
<style>
* { box-sizing: border-box; }
body { margin: 0; font-family: -apple-system, "Segoe UI", "Microsoft YaHei", sans-serif; background: #f5f6f8; color: #1f2328; }
#login-view { max-width: 360px; margin: 15vh auto 0; background: #fff; border-radius: 12px; padding: 32px; box-shadow: 0 8px 30px rgba(0,0,0,.08); }
#login-view h1 { font-size: 20px; margin: 0 0 24px; text-align: center; }
.field { margin-bottom: 14px; }
.field label { display: block; font-size: 13px; color: #57606a; margin-bottom: 6px; }
.field input, .field textarea { width: 100%; padding: 9px 11px; border: 1px solid #d0d7de; border-radius: 8px; font-size: 14px; font-family: inherit; }
.field input:focus, .field textarea:focus { outline: none; border-color: #0969da; box-shadow: 0 0 0 3px rgba(9,105,218,.15); }
button { cursor: pointer; border: none; border-radius: 8px; padding: 9px 16px; font-size: 14px; font-family: inherit; }
.btn-primary { background: #1f883d; color: #fff; }
.btn-primary:hover { background: #1a7c36; }
.btn-plain { background: #eaeef2; color: #1f2328; }
.btn-plain:hover { background: #dfe4ea; }
.btn-danger { background: #cf222e; color: #fff; }
.btn-danger:hover { background: #a40e26; }
#app-view { display: none; }
.topbar { display: flex; align-items: center; gap: 12px; padding: 12px 20px; background: #fff; border-bottom: 1px solid #d0d7de; }
.topbar h1 { font-size: 17px; margin: 0; }
.tabs { display: flex; gap: 4px; flex: 1; }
.tab-btn { background: transparent; color: #57606a; border-radius: 6px; padding: 6px 14px; }
.tab-btn.active { background: #eaeef2; color: #1f2328; font-weight: 600; }
.layout { display: flex; min-height: calc(100vh - 54px); }
.sidebar { width: 240px; background: #fff; border-right: 1px solid #d0d7de; padding: 16px; flex-shrink: 0; }
.sidebar h2 { font-size: 13px; color: #57606a; margin: 0 0 10px; }
#post-list { list-style: none; margin: 0; padding: 0; }
#post-list li { margin-bottom: 4px; }
#post-list a { display: block; padding: 7px 10px; border-radius: 6px; color: #0969da; text-decoration: none; font-size: 14px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
#post-list a:hover { background: #f0f4f8; }
.editor { flex: 1; padding: 20px 24px; min-width: 0; }
.row { display: flex; gap: 12px; }
.row .field { flex: 1; }
.drop-zone { margin: 14px 0 6px; padding: 18px; border: 2px dashed #d0d7de; border-radius: 10px; text-align: center; color: #57606a; font-size: 14px; background: #fff; cursor: pointer; }
.drop-zone.drag { border-color: #0969da; background: #f0f7ff; }
.actions { margin-top: 14px; display: flex; gap: 10px; }
.hint { font-size: 12px; color: #6e7781; margin-top: 8px; }
#view-albums { display: none; padding: 20px 24px; max-width: 1000px; }
.album-toolbar { display: flex; gap: 10px; align-items: center; margin-bottom: 16px; }
.album-card { background: #fff; border: 1px solid #d0d7de; border-radius: 10px; padding: 16px; margin-bottom: 16px; }
.album-card-head { display: flex; gap: 10px; margin-bottom: 10px; }
.album-card-head input { flex: 1; padding: 8px 11px; border: 1px solid #d0d7de; border-radius: 8px; font-size: 15px; font-family: inherit; }
.album-cover-row { display: flex; gap: 8px; margin-bottom: 12px; align-items: center; }
.album-cover-row input[type=text] { flex: 1; padding: 8px 11px; border: 1px solid #d0d7de; border-radius: 8px; font-size: 14px; font-family: inherit; }
.album-cover-row input[type=number] { width: 70px; padding: 8px; border: 1px solid #d0d7de; border-radius: 8px; }
.album-photos { display: flex; flex-wrap: wrap; gap: 10px; }
.album-photo { width: 180px; border: 1px solid #d0d7de; border-radius: 8px; overflow: hidden; }
.album-photo img { width: 100%; height: 120px; object-fit: cover; display: block; background: #f0f4f8; }
.album-photo input { width: 100%; padding: 6px 8px; border: none; border-top: 1px solid #eee; font-size: 13px; font-family: inherit; }
.album-photo .btn-danger { width: 100%; border-radius: 0; padding: 6px; }
.album-photos .btn-plain { height: 40px; align-self: center; }
@media (max-width: 720px) { .layout { flex-direction: column; } .sidebar { width: auto; border-right: none; border-bottom: 1px solid #d0d7de; } .row { flex-direction: column; gap: 0; } }
</style>
</head>
<body>

<div id="login-view">
  <h1>博客后台</h1>
  <form onsubmit="doLogin(); return false;">
    <div class="field">
      <label>管理员密码</label>
      <input type="password" id="password" autocomplete="current-password" autofocus>
    </div>
    <button type="submit" class="btn-primary" style="width:100%">登录</button>
  </form>
</div>

<div id="app-view">
  <div class="topbar">
    <h1>博客后台</h1>
    <div class="tabs">
      <button class="tab-btn active" id="tab-posts" onclick="switchTab('posts')">文章</button>
      <button class="tab-btn" id="tab-albums" onclick="switchTab('albums')">相册</button>
    </div>
    <button class="btn-plain" onclick="doLogout()">退出登录</button>
  </div>

  <div id="view-posts">
    <div class="layout">
      <div class="sidebar">
        <h2>文章列表</h2>
        <ul id="post-list"></ul>
      </div>
      <div class="editor">
        <div class="row">
          <div class="field"><label>标题</label><input type="text" id="title" placeholder="文章标题"></div>
          <div class="field"><label>文件名（留空自动生成，仅英文/数字/-/_）</label><input type="text" id="slug" placeholder="my-post"></div>
        </div>
        <div class="row">
          <div class="field"><label>日期</label><input type="text" id="date" placeholder="2026-09-03 20:00:00"></div>
          <div class="field"><label>分类（逗号分隔）</label><input type="text" id="categories" placeholder="力量训练"></div>
          <div class="field"><label>标签（逗号分隔）</label><input type="text" id="tags" placeholder="体能"></div>
        </div>
        <div class="drop-zone" id="drop-zone">把图片拖到这里，或点击选择图片（自动插入正文）</div>
        <input type="file" id="file-input" accept="image/*" style="display:none">
        <div class="field">
          <label>正文</label>
          <textarea id="body-editor" rows="16"></textarea>
        </div>
        <div class="actions">
          <button class="btn-primary" onclick="newPost()">＋ 新建文章</button>
          <button class="btn-primary" onclick="savePost()">保存</button>
          <button class="btn-danger" id="delete-btn" onclick="deletePost()" style="display:none">删除文章</button>
        </div>
        <div class="hint">保存后 GitHub Actions 会自动构建，约 1–2 分钟更新到线上。</div>
      </div>
    </div>
  </div>

  <div id="view-albums">
    <div class="album-toolbar">
      <button class="btn-primary" onclick="newAlbum()">＋ 新建相册</button>
      <button class="btn-primary" onclick="saveAlbums()">保存相册修改</button>
      <span class="hint" style="margin:0">改完记得点「保存相册修改」</span>
    </div>
    <div id="album-list"></div>
    <input type="file" id="album-file-input" accept="image/*" style="display:none">
  </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/easymde@2.18.0/dist/easymde.min.js"></script>
<script>
var editor = null;
var currentSlug = null;
var currentSha = null;
var HAS_EASYMDE = (typeof EasyMDE !== 'undefined');
var albumsData = [];
var albumFileInputTarget = null;

function $(id) { return document.getElementById(id); }
function show(view) {
  $('login-view').style.display = (view === 'login') ? 'block' : 'none';
  $('app-view').style.display = (view === 'app') ? 'block' : 'none';
}
function pad(n) { return (n < 10 ? '0' : '') + n; }
function nowStr() {
  var d = new Date();
  return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) +
         ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds());
}
function slugify(title) {
  var s = (title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  if (!s) s = 'post-' + nowStr().slice(0, 10).replace(/-/g, '');
  return s;
}
function switchTab(tab) {
  $('tab-posts').classList.toggle('active', tab === 'posts');
  $('tab-albums').classList.toggle('active', tab === 'albums');
  $('view-posts').style.display = (tab === 'posts') ? 'block' : 'none';
  $('view-albums').style.display = (tab === 'albums') ? 'block' : 'none';
  if (tab === 'albums') loadAlbums();
}

function initEditor() {
  if (HAS_EASYMDE) {
    try {
      editor = new EasyMDE({ element: $('body-editor'), spellChecker: false, status: false, autofocus: false, placeholder: '在这里写正文…' });
    } catch (e) {
      editor = null;
    }
  }
}

function editorValue() {
  if (editor && HAS_EASYMDE) return editor.value();
  return $('body-editor').value;
}
function setEditorValue(v) {
  if (editor && HAS_EASYMDE) editor.value(v || '');
  else $('body-editor').value = v || '';
}

function insertMarkdown(text) {
  if (editor && HAS_EASYMDE) {
    var cm = editor.codemirror;
    cm.getDoc().replaceSelection(text);
    cm.focus();
  } else {
    var ta = $('body-editor');
    var s = (typeof ta.selectionStart === 'number') ? ta.selectionStart : ta.value.length;
    ta.value = ta.value.slice(0, s) + text + ta.value.slice(s);
    ta.selectionStart = ta.selectionEnd = s + text.length;
    ta.focus();
  }
}

function parseFrontmatter(md) {
  var res = { title: '', date: '', categories: [], tags: [], body: md || '' };
  var m = (md || '').match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!m) return res;
  res.body = md.slice(m[0].length);
  var lines = m[1].split(/\r?\n/);
  var cur = null;
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i];
    var kv = line.match(/^([A-Za-z_][A-Za-z0-9_-]*):\s*(.*)$/);
    if (kv) {
      cur = kv[1];
      var val = kv[2].trim();
      if (val.length >= 2 && val.charAt(0) === '"' && val.charAt(val.length - 1) === '"') val = val.slice(1, -1);
      if (cur === 'title' || cur === 'date') res[cur] = val;
      else if (cur === 'categories' || cur === 'tags') res[cur] = [];
    } else {
      var li = line.match(/^\s*-\s*(.*)$/);
      if (li && (cur === 'categories' || cur === 'tags')) res[cur].push(li[1].trim());
    }
  }
  return res;
}

function buildFrontmatter() {
  var title = $('title').value.trim() || '未命名';
  var date = $('date').value.trim() || nowStr();
  var cats = $('categories').value.split(',').map(function (s) { return s.trim(); }).filter(Boolean);
  var tags = $('tags').value.split(',').map(function (s) { return s.trim(); }).filter(Boolean);
  var lines = ['---', 'title: "' + title.replace(/"/g, '\\"') + '"', 'date: ' + date];
  if (cats.length) { lines.push('categories:'); cats.forEach(function (c) { lines.push('  - ' + c); }); }
  if (tags.length) { lines.push('tags:'); tags.forEach(function (t) { lines.push('  - ' + t); }); }
  lines.push('---');
  return lines.join('\\n');
}

function loadPosts() {
  fetch('/api/posts').then(function (r) {
    if (r.status === 401) { show('login'); return; }
    return r.json().then(function (list) {
      var el = $('post-list');
      el.innerHTML = '';
      list.forEach(function (p) {
        var li = document.createElement('li');
        var a = document.createElement('a');
        a.href = '#';
        a.textContent = p.slug;
        a.onclick = function () { openPost(p.slug); return false; };
        li.appendChild(a);
        el.appendChild(li);
      });
      show('app');
    });
  }).catch(function () { show('login'); });
}

function openPost(slug) {
  fetch('/api/posts?slug=' + encodeURIComponent(slug)).then(function (r) {
    return r.json().then(function (j) { return { ok: r.ok, j: j }; });
  }).then(function (o) {
    if (!o.ok) { alert('读取失败：' + (o.j.error || '')); return; }
    var fm = parseFrontmatter(o.j.content);
    currentSlug = slug;
    currentSha = o.j.sha;
    $('title').value = fm.title || '';
    $('slug').value = slug;
    $('date').value = fm.date || nowStr();
    $('categories').value = (fm.categories || []).join(', ');
    $('tags').value = (fm.tags || []).join(', ');
    setEditorValue(fm.body);
    $('delete-btn').style.display = 'inline-block';
  });
}

function newPost() {
  currentSlug = null;
  currentSha = null;
  $('title').value = '';
  $('slug').value = '';
  $('date').value = nowStr();
  $('categories').value = '';
  $('tags').value = '';
  setEditorValue('');
  $('delete-btn').style.display = 'none';
  $('title').focus();
}

function savePost() {
  var slug = $('slug').value.trim() || slugify($('title').value);
  if (!/^[A-Za-z0-9_-]{1,200}$/.test(slug)) { alert('文件名只能包含英文字母、数字、下划线、连字符'); return; }
  var body = editorValue();
  var content = buildFrontmatter() + '\\n\\n' + body.replace(/\\s+$/, '') + '\\n';
  var payload = { slug: slug, content: content };
  if (currentSha) payload.sha = currentSha;
  fetch('/api/posts', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, j: j }; }); })
    .then(function (o) {
      if (o.ok) {
        currentSlug = slug;
        currentSha = o.j.sha;
        $('delete-btn').style.display = 'inline-block';
        alert('已保存，线上约 1–2 分钟后更新');
        loadPosts();
      } else {
        alert('保存失败：' + (o.j.error || ''));
      }
    });
}

function deletePost() {
  if (!currentSlug) return;
  if (!confirm('确定删除文章「' + currentSlug + '」吗？此操作会提交到仓库。')) return;
  fetch('/api/posts?slug=' + encodeURIComponent(currentSlug), { method: 'DELETE' })
    .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, j: j }; }); })
    .then(function (o) {
      if (o.ok) { newPost(); loadPosts(); }
      else alert('删除失败：' + (o.j.error || ''));
    });
}

function doLogin() {
  var pw = $('password').value;
  if (!pw) return;
  fetch('/api/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: pw }) })
    .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, j: j }; }); })
    .then(function (o) {
      if (o.ok) { $('password').value = ''; loadPosts(); }
      else alert(o.j.error || '登录失败');
    });
}

function doLogout() {
  fetch('/api/logout', { method: 'POST' }).then(function () {
    currentSlug = null; currentSha = null;
    show('login');
  });
}

function uploadFile(file) {
  if (!file) return;
  var fd = new FormData();
  fd.append('file', file);
  fetch('/api/upload', { method: 'POST', body: fd })
    .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, j: j }; }); })
    .then(function (o) {
      if (o.ok && o.j.url) {
        var alt = (file.name || 'image').replace(/\\.[^.]+$/, '');
        insertMarkdown('![' + alt + '](' + o.j.url + ')');
      } else {
        alert('上传失败：' + (o.j && o.j.error ? o.j.error : '未知错误'));
      }
    })
    .catch(function (e) { alert('上传失败：' + e.message); });
}

function bindUpload() {
  var dz = $('drop-zone');
  dz.addEventListener('click', function () { $('file-input').click(); });
  dz.addEventListener('dragover', function (e) { e.preventDefault(); dz.classList.add('drag'); });
  dz.addEventListener('dragleave', function () { dz.classList.remove('drag'); });
  dz.addEventListener('drop', function (e) {
    e.preventDefault(); dz.classList.remove('drag');
    if (e.dataTransfer.files && e.dataTransfer.files[0]) uploadFile(e.dataTransfer.files[0]);
  });
  $('file-input').addEventListener('change', function (e) {
    if (e.target.files && e.target.files[0]) uploadFile(e.target.files[0]);
    e.target.value = '';
  });
  document.addEventListener('paste', function (e) {
    var items = e.clipboardData && e.clipboardData.items;
    if (!items) return;
    for (var i = 0; i < items.length; i++) {
      if (items[i].type && items[i].type.indexOf('image') === 0) {
        var f = items[i].getAsFile();
        if (f) { uploadFile(f); e.preventDefault(); break; }
      }
    }
  });
  $('album-file-input').addEventListener('change', handleAlbumFile);
}

function loadAlbums() {
  fetch('/api/albums').then(function (r) {
    return r.json().then(function (j) { return { ok: r.ok, j: j }; });
  }).then(function (o) {
    if (o.ok) { albumsData = o.j.albums || []; renderAlbums(); }
    else alert('读取相册失败：' + (o.j.error || ''));
  });
}

function newAlbum() {
  albumsData.push({ name: '新相册', cover: '', span: 4, column: 3, encrypt: false, images: [] });
  renderAlbums();
}

function saveAlbums() {
  fetch('/api/albums', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ albums: albumsData }) })
    .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, j: j }; }); })
    .then(function (o) {
      if (o.ok) alert('相册已保存，线上约 1–2 分钟后更新');
      else alert('保存失败：' + (o.j.error || ''));
    });
}

function pickImageForAlbum(i, type) {
  albumFileInputTarget = { albumIndex: i, type: type };
  $('album-file-input').click();
}

function handleAlbumFile(e) {
  var f = e.target.files && e.target.files[0];
  e.target.value = '';
  if (!f || !albumFileInputTarget) return;
  var t = albumFileInputTarget;
  albumFileInputTarget = null;
  var fd = new FormData();
  fd.append('file', f);
  fetch('/api/upload', { method: 'POST', body: fd })
    .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, j: j }; }); })
    .then(function (o) {
      if (!o.ok) { alert('上传失败：' + (o.j.error || '')); return; }
      var album = albumsData[t.albumIndex];
      if (!album) return;
      if (t.type === 'cover') {
        album.cover = o.j.url;
      } else {
        var title = (f.name || '照片').replace(/\\.[^.]+$/, '');
        album.images = album.images || [];
        album.images.push({ title: title, url: o.j.url });
      }
      renderAlbums();
    });
}

function renderAlbums() {
  var el = $('album-list');
  el.innerHTML = '';
  albumsData.forEach(function (a, i) { el.appendChild(renderAlbumCard(a, i)); });
}

function renderAlbumCard(a, i) {
  var card = document.createElement('div');
  card.className = 'album-card';

  var head = document.createElement('div');
  head.className = 'album-card-head';
  var nameInput = document.createElement('input');
  nameInput.type = 'text';
  nameInput.placeholder = '相册名';
  nameInput.value = a.name || '';
  nameInput.oninput = function () { a.name = nameInput.value; };
  var delBtn = document.createElement('button');
  delBtn.className = 'btn-danger';
  delBtn.textContent = '删除相册';
  delBtn.onclick = function () { albumsData.splice(i, 1); renderAlbums(); };
  head.appendChild(nameInput);
  head.appendChild(delBtn);
  card.appendChild(head);

  var coverRow = document.createElement('div');
  coverRow.className = 'album-cover-row';
  var coverInput = document.createElement('input');
  coverInput.type = 'text';
  coverInput.placeholder = '封面图地址（/images/xxx 或外链）';
  coverInput.value = a.cover || '';
  coverInput.oninput = function () { a.cover = coverInput.value; };
  var coverUp = document.createElement('button');
  coverUp.className = 'btn-plain';
  coverUp.textContent = '上传封面';
  coverUp.onclick = function () { pickImageForAlbum(i, 'cover'); };
  var colInput = document.createElement('input');
  colInput.type = 'number';
  colInput.min = '1';
  colInput.max = '6';
  colInput.value = a.column || 3;
  colInput.title = '图片列数';
  colInput.oninput = function () { a.column = colInput.value; };
  coverRow.appendChild(coverInput);
  coverRow.appendChild(coverUp);
  coverRow.appendChild(colInput);
  card.appendChild(coverRow);

  var photos = document.createElement('div');
  photos.className = 'album-photos';
  (a.images || []).forEach(function (img, j) {
    var item = document.createElement('div');
    item.className = 'album-photo';
    var thumb = document.createElement('img');
    thumb.src = img.url || '';
    thumb.onerror = function () { this.style.opacity = '0.2'; };
    var titleInput = document.createElement('input');
    titleInput.type = 'text';
    titleInput.placeholder = '照片标题';
    titleInput.value = img.title || '';
    titleInput.oninput = function () { img.title = titleInput.value; };
    var rm = document.createElement('button');
    rm.className = 'btn-danger';
    rm.textContent = '×';
    rm.onclick = function () { a.images.splice(j, 1); renderAlbums(); };
    item.appendChild(thumb);
    item.appendChild(titleInput);
    item.appendChild(rm);
    photos.appendChild(item);
  });

  var addPhoto = document.createElement('button');
  addPhoto.className = 'btn-plain';
  addPhoto.textContent = '＋ 上传照片到此相册';
  addPhoto.onclick = function () { pickImageForAlbum(i, 'photo'); };
  photos.appendChild(addPhoto);
  card.appendChild(photos);

  return card;
}

initEditor();
bindUpload();
loadPosts();
</script>
</body>
</html>`;

// ============ 工具函数 ============

function json(obj, status) {
  return new Response(JSON.stringify(obj), {
    status: status || 200,
    headers: { 'Content-Type': 'application/json;charset=utf-8' }
  });
}

function hexToBytes(hex) {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
  return bytes;
}

function bytesToHex(bytes) {
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('');
}

function timingSafeEqualHex(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function utf8ToBase64(str) {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

function base64ToUtf8(b64) {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

function bytesToBase64(bytes) {
  let binary = '';
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

function getCookie(request, name) {
  const c = request.headers.get('Cookie');
  if (!c) return null;
  for (const part of c.split(';')) {
    const idx = part.indexOf('=');
    if (idx < 0) continue;
    if (part.slice(0, idx).trim() === name) return part.slice(idx + 1).trim();
  }
  return null;
}

// ============ albums.yml 的极简 YAML 读写（仅针对本文件的固定结构） ============

function unquoteY(s) {
  s = String(s == null ? '' : s).trim();
  if (s.length >= 2 &&
      ((s.charAt(0) === '"' && s.charAt(s.length - 1) === '"') ||
       (s.charAt(0) === "'" && s.charAt(s.length - 1) === "'"))) {
    s = s.slice(1, -1);
  }
  return s;
}

function splitYamlKV(content) {
  const idx = content.indexOf(':');
  if (idx < 0) return null;
  return {
    key: unquoteY(content.slice(0, idx)),
    value: unquoteY(content.slice(idx + 1))
  };
}

function parseAlbumsYml(text) {
  const albums = [];
  let cur = null;
  let inImages = false;
  const lines = String(text || '').split(/\r?\n/);
  for (const line of lines) {
    const t = line.trim();
    if (!t || t.charAt(0) === '#') continue;
    if (/^albums_list:\s*$/.test(t)) { inImages = false; continue; }
    if (t.charAt(0) === '-') {
      cur = { name: '', cover: '', span: 4, column: 3, encrypt: false, images: [] };
      albums.push(cur);
      inImages = false;
      const kv = splitYamlKV(t.slice(1).trim());
      if (kv && kv.key === 'name') cur.name = kv.value;
      continue;
    }
    if (!cur) continue;
    const kv = splitYamlKV(t);
    if (!kv) continue;
    if (kv.key === 'images') { inImages = true; continue; }
    if (kv.key === 'name') cur.name = kv.value;
    else if (kv.key === 'cover') cur.cover = kv.value;
    else if (kv.key === 'span') cur.span = kv.value;
    else if (kv.key === 'column') cur.column = kv.value;
    else if (kv.key === 'encrypt') cur.encrypt = kv.value === 'true';
    else if (inImages) cur.images.push({ title: kv.key, url: kv.value });
  }
  return { albums };
}

function yq(s) {
  s = String(s == null ? '' : s).replace(/\n/g, ' ').replace(/"/g, '\\"');
  return '"' + s + '"';
}

function serializeAlbumsYml(albums) {
  let out = '# 相册数据（Meow 主题 external 模式，由后台自动维护）\n';
  out += '# 图片地址用 /images/xxx.jpg（本地上传）或外链 URL\n\n';
  out += 'albums_list:\n';
  for (const a of albums) {
    out += '  - name: ' + yq(a.name) + '\n';
    if (a.cover) out += '    cover: ' + yq(a.cover) + '\n';
    const span = parseInt(a.span, 10);
    if (!isNaN(span)) out += '    span: ' + span + '\n';
    const column = parseInt(a.column, 10);
    if (!isNaN(column)) out += '    column: ' + column + '\n';
    out += '    encrypt: ' + (a.encrypt ? 'true' : 'false') + '\n';
    out += '    images:\n';
    const images = a.images || [];
    if (images.length === 0) {
      out += '      {}\n';
    } else {
      for (const img of images) {
        const title = String(img.title || '照片').replace(/:/g, '：').replace(/\n/g, ' ');
        out += '      ' + yq(title) + ': ' + yq(img.url) + '\n';
      }
    }
  }
  return out;
}

// ============ 密码与会话 ============

async function verifyPassword(password, saltHex, hashHex) {
  if (!saltHex || !hashHex) return false;
  const salt = hexToBytes(saltHex);
  const expected = hashHex.toLowerCase();
  const key = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']
  );
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: PBKDF2_ITERATIONS, hash: 'SHA-256' },
    key, 256
  );
  return timingSafeEqualHex(bytesToHex(new Uint8Array(bits)), expected);
}

async function signSession(secret, ttl) {
  const expiry = String(Math.floor(Date.now() / 1000) + ttl);
  const key = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(expiry));
  return expiry + '.' + bytesToHex(new Uint8Array(sig));
}

async function verifySession(secret, token) {
  if (!secret || !token) return false;
  const dot = token.indexOf('.');
  if (dot < 0) return false;
  const expiryStr = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  if (!/^\d+$/.test(expiryStr)) return false;
  if (Date.now() / 1000 >= parseInt(expiryStr, 10)) return false;
  const key = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  const expected = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(expiryStr));
  return timingSafeEqualHex(bytesToHex(new Uint8Array(expected)), sig);
}

// 简易登录限流（内存级，Workers 单实例内生效；单管理员场景足够）
const loginFails = new Map(); // ip -> { count, first }
function isBlocked(ip) {
  const rec = loginFails.get(ip);
  if (!rec) return false;
  if (Date.now() - rec.first > LOGIN_WINDOW_MS) { loginFails.delete(ip); return false; }
  return rec.count >= MAX_LOGIN_FAILS;
}
function recordFail(ip) {
  const now = Date.now();
  const rec = loginFails.get(ip);
  if (!rec || now - rec.first > LOGIN_WINDOW_MS) loginFails.set(ip, { count: 1, first: now });
  else rec.count += 1;
}
function clearFail(ip) { loginFails.delete(ip); }

// ============ GitHub API ============

async function gh(env, method, path, body) {
  const headers = {
    'Authorization': 'Bearer ' + env.GITHUB_TOKEN,
    'Accept': 'application/vnd.github+json',
    'User-Agent': 'blog-admin',
    'X-GitHub-Api-Version': '2022-11-28'
  };
  if (body) headers['Content-Type'] = 'application/json';
  return fetch(GITHUB_API + path, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });
}

const SLUG_RE = /^[A-Za-z0-9_-]{1,200}$/;

async function listPosts(env) {
  const res = await gh(env, 'GET', '/repos/' + REPO + '/contents/' + POSTS_DIR);
  if (!res.ok) return [];
  const data = await res.json();
  if (!Array.isArray(data)) return [];
  return data
    .filter((f) => f.name.endsWith('.md'))
    .map((f) => ({ slug: f.name.replace(/\.md$/, ''), path: f.path, sha: f.sha }));
}

async function getPost(env, slug) {
  const filePath = POSTS_DIR + '/' + slug + '.md';
  const res = await gh(env, 'GET', '/repos/' + REPO + '/contents/' + filePath);
  if (!res.ok) return { ok: false, status: res.status, error: '文章不存在' };
  const data = await res.json();
  return { ok: true, slug, sha: data.sha, content: base64ToUtf8(data.content) };
}

async function savePost(env, slug, content, sha) {
  const filePath = POSTS_DIR + '/' + slug + '.md';
  const payload = {
    message: sha ? '更新博文：' + slug : '新建博文：' + slug,
    content: utf8ToBase64(content),
    branch: BRANCH
  };
  if (sha) payload.sha = sha;
  const res = await gh(env, 'PUT', '/repos/' + REPO + '/contents/' + filePath, payload);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) return { ok: false, status: res.status, error: data.message || ('HTTP ' + res.status) };
  return { ok: true, sha: data.content && data.content.sha };
}

async function deletePost(env, slug) {
  const filePath = POSTS_DIR + '/' + slug + '.md';
  const getRes = await gh(env, 'GET', '/repos/' + REPO + '/contents/' + filePath);
  if (!getRes.ok) return { ok: false, status: getRes.status, error: '文章不存在' };
  const meta = await getRes.json();
  const delRes = await gh(env, 'DELETE', '/repos/' + REPO + '/contents/' + filePath, {
    message: '删除博文：' + slug, sha: meta.sha, branch: BRANCH
  });
  if (!delRes.ok) {
    const j = await delRes.json().catch(() => ({}));
    return { ok: false, status: delRes.status, error: j.message || ('HTTP ' + delRes.status) };
  }
  return { ok: true };
}

async function listAlbums(env) {
  const res = await gh(env, 'GET', '/repos/' + REPO + '/contents/' + ALBUMS_PATH);
  if (!res.ok) return { ok: false, status: res.status, error: '读取相册数据失败' };
  const data = await res.json();
  const parsed = parseAlbumsYml(base64ToUtf8(data.content));
  return { ok: true, albums: parsed.albums };
}

async function saveAlbums(env, albums) {
  // 先取当前 sha，避免并发/过期导致 409
  const getRes = await gh(env, 'GET', '/repos/' + REPO + '/contents/' + ALBUMS_PATH);
  let sha = null;
  if (getRes.ok) { const meta = await getRes.json(); sha = meta.sha; }
  const content = serializeAlbumsYml(albums);
  const payload = {
    message: '更新相册数据',
    content: utf8ToBase64(content),
    branch: BRANCH
  };
  if (sha) payload.sha = sha;
  const res = await gh(env, 'PUT', '/repos/' + REPO + '/contents/' + ALBUMS_PATH, payload);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) return { ok: false, status: res.status, error: data.message || ('HTTP ' + res.status) };
  return { ok: true };
}

// 大文件（>1MB）走 Git Data API：blob → tree → commit → ref
async function uploadLargeFile(env, filePath, b64, message) {
  let res = await gh(env, 'POST', '/repos/' + REPO + '/git/blobs', { content: b64, encoding: 'base64' });
  if (!res.ok) return res;
  const blob = await res.json();

  res = await gh(env, 'GET', '/repos/' + REPO + '/git/ref/heads/' + BRANCH);
  if (!res.ok) return res;
  const ref = await res.json();
  const headSha = ref.object.sha;

  res = await gh(env, 'GET', '/repos/' + REPO + '/git/commits/' + headSha);
  if (!res.ok) return res;
  const commit = await res.json();
  const baseTree = commit.tree.sha;

  res = await gh(env, 'POST', '/repos/' + REPO + '/git/trees', {
    base_tree: baseTree,
    tree: [{ path: filePath, mode: '100644', type: 'blob', sha: blob.sha }]
  });
  if (!res.ok) return res;
  const tree = await res.json();

  res = await gh(env, 'POST', '/repos/' + REPO + '/git/commits', {
    message, tree: tree.sha, parents: [headSha]
  });
  if (!res.ok) return res;
  const newCommit = await res.json();

  return gh(env, 'PATCH', '/repos/' + REPO + '/git/refs/heads/' + BRANCH, {
    sha: newCommit.sha, force: false
  });
}

function getExt(name) {
  const i = name.lastIndexOf('.');
  return i < 0 ? '' : name.slice(i + 1).toLowerCase();
}
function dateStamp() {
  const d = new Date();
  const p = (n) => (n < 10 ? '0' : '') + n;
  return '' + d.getFullYear() + p(d.getMonth() + 1) + p(d.getDate()) + '-' +
    p(d.getHours()) + p(d.getMinutes()) + p(d.getSeconds());
}
function randHex(n) {
  const bytes = new Uint8Array(n);
  crypto.getRandomValues(bytes);
  return bytesToHex(bytes);
}

async function handleUpload(env, request) {
  let form;
  try { form = await request.formData(); } catch { return json({ error: '无效上传' }, 400); }
  const file = form.get('file');
  if (!file || typeof file.arrayBuffer !== 'function') return json({ error: '没有文件' }, 400);
  const bytes = new Uint8Array(await file.arrayBuffer());
  if (bytes.length === 0) return json({ error: '空文件' }, 400);
  const ext = getExt((file.name || 'image').toString());
  if (!/^(png|jpg|jpeg|gif|webp|avif)$/.test(ext)) return json({ error: '仅支持 png/jpg/jpeg/gif/webp/avif 图片' }, 400);
  const filename = 'img-' + dateStamp() + '-' + randHex(4) + '.' + ext;
  const filePath = IMAGES_DIR + '/' + filename;
  const b64 = bytesToBase64(bytes);
  const message = '上传图片 ' + filename;
  const res = bytes.length <= 1000000
    ? await gh(env, 'PUT', '/repos/' + REPO + '/contents/' + filePath, { message, content: b64, branch: BRANCH })
    : await uploadLargeFile(env, filePath, b64, message);
  if (!res.ok) {
    const j = await res.json().catch(() => ({}));
    return json({ error: j.message || ('HTTP ' + res.status) }, res.status);
  }
  return json({ url: '/images/' + filename });
}

// ============ 处理器 ============

async function handleLogin(env, request) {
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  if (isBlocked(ip)) return json({ error: '尝试次数过多，请 15 分钟后再试' }, 429);
  let body;
  try { body = await request.json(); } catch { return json({ error: '无效请求' }, 400); }
  const password = String((body && body.password) || '');
  const ok = await verifyPassword(password, env.ADMIN_PASSWORD_SALT, env.ADMIN_PASSWORD_HASH);
  if (!ok) {
    recordFail(ip);
    return json({ error: '密码错误' }, 401);
  }
  clearFail(ip);
  const token = await signSession(env.SESSION_SECRET, SESSION_TTL);
  const res = json({ ok: true });
  res.headers.append('Set-Cookie',
    COOKIE_NAME + '=' + token + '; HttpOnly; SameSite=Lax; Path=/; Max-Age=' + SESSION_TTL + '; Secure');
  return res;
}

async function isAuthed(env, request) {
  const token = getCookie(request, COOKIE_NAME);
  if (!token) return false;
  return verifySession(env.SESSION_SECRET, token);
}

// ============ 路由 ============

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    if (method === 'GET' && (path === '/' || path === '/index.html')) {
      return new Response(ADMIN_HTML, { headers: { 'Content-Type': 'text/html;charset=utf-8' } });
    }

    if (method === 'POST' && path === '/api/login') {
      return handleLogin(env, request);
    }
    if (method === 'POST' && path === '/api/logout') {
      const res = json({ ok: true });
      res.headers.append('Set-Cookie', COOKIE_NAME + '=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0; Secure');
      return res;
    }

    // 以下接口需要登录
    if (!(await isAuthed(env, request))) {
      return json({ error: '未登录' }, 401);
    }

    if (method === 'GET' && path === '/api/posts') {
      const slug = url.searchParams.get('slug');
      if (slug) {
        if (!SLUG_RE.test(slug)) return json({ error: '文件名不合法' }, 400);
        const r = await getPost(env, slug);
        if (!r.ok) return json({ error: r.error }, r.status);
        return json(r);
      }
      return json(await listPosts(env));
    }

    if (method === 'PUT' && path === '/api/posts') {
      let body;
      try { body = await request.json(); } catch { return json({ error: '无效请求' }, 400); }
      const slug = String((body && body.slug) || '').trim();
      const content = String((body && body.content) || '');
      const sha = (body && body.sha) ? String(body.sha) : null;
      if (!SLUG_RE.test(slug)) return json({ error: '文件名不合法' }, 400);
      return json(await savePost(env, slug, content, sha));
    }

    if (method === 'DELETE' && path === '/api/posts') {
      const slug = url.searchParams.get('slug');
      if (!slug || !SLUG_RE.test(slug)) return json({ error: '文件名不合法' }, 400);
      return json(await deletePost(env, slug));
    }

    if (method === 'GET' && path === '/api/albums') {
      return json(await listAlbums(env));
    }

    if (method === 'PUT' && path === '/api/albums') {
      let body;
      try { body = await request.json(); } catch { return json({ error: '无效请求' }, 400); }
      const albums = (body && Array.isArray(body.albums)) ? body.albums : null;
      if (!albums) return json({ error: '数据不合法' }, 400);
      return json(await saveAlbums(env, albums));
    }

    if (method === 'POST' && path === '/api/upload') {
      return handleUpload(env, request);
    }

    return json({ error: 'not found' }, 404);
  }
};
