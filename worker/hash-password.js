// 生成 admin 密码的盐 + 哈希（与 worker/index.js 的参数必须一致）
// 用法：node hash-password.js "你的密码"
// 输出两个值，分别填入 Cloudflare Secret：ADMIN_PASSWORD_SALT / ADMIN_PASSWORD_HASH

const crypto = require('crypto');

const ITERATIONS = 100000;   // 与 index.js 的 PBKDF2_ITERATIONS 保持一致
const KEY_LENGTH = 32;       // 32 字节 = 256 bit

const password = process.argv[2];

if (!password) {
  console.error('用法：node hash-password.js "你的密码"');
  console.error('提示：建议用 12 位以上、含大小写字母数字符号的随机密码。');
  process.exit(1);
}

const salt = crypto.randomBytes(16);
const hash = crypto.pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, 'sha256');

console.log('ADMIN_PASSWORD_SALT=' + salt.toString('hex'));
console.log('ADMIN_PASSWORD_HASH=' + hash.toString('hex'));
