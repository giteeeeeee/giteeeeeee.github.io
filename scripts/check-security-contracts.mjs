import assert from 'node:assert/strict';
import { isPublishableContentVisible } from '../src/features/blog/lib/visibility.ts';
import { renderSafeReadme, stripMarkdownFrontmatter } from '../src/features/projects/lib/readme.ts';

assert.equal(isPublishableContentVisible({ draft: false, published: true }, false), true);
assert.equal(isPublishableContentVisible({ draft: true, published: true }, false), false);
assert.equal(isPublishableContentVisible({ draft: false, published: false }, false), false);
assert.equal(isPublishableContentVisible({ draft: true, published: false }, true), true);

const markdown = `---
title: unsafe fixture
---

# Safe heading

<script>globalThis.compromised = true</script>
<img src="https://example.com/image.png" onerror="alert('xss')">
<a href="javascript:alert('xss')">unsafe link</a>
<code class="language-js" onclick="alert('xss')">const safe = true</code>
`;

assert.equal(stripMarkdownFrontmatter(markdown).includes('unsafe fixture'), false);

const html = await renderSafeReadme(markdown);
assert.match(html, /<h1>Safe heading<\/h1>/);
assert.match(html, /class="language-js"/);
assert.doesNotMatch(html, /<script/i);
assert.doesNotMatch(html, /onerror|onclick/i);
assert.doesNotMatch(html, /javascript:/i);

console.log('Validated publication visibility and remote README sanitization contracts.');
