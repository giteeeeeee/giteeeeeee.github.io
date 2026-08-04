import { expect, test } from '@playwright/test';
import { decodeRouteParam, encodeRouteParam } from '../../src/features/blog/lib/route-param';
import { getPlogAssetRelativePath } from '../../src/features/gallery/lib/plog-path';

test('taxonomy route params keep literal slashes inside one reversible segment', () => {
  const encoded = encodeRouteParam('C/C++');

  expect(encoded).toBe('C~2F~C++');
  expect(decodeRouteParam(encodeURIComponent(encoded))).toBe('C/C++');
  expect(encodeRouteParam('开发环境')).toBe('开发环境');
});

test('Plog asset paths normalize absolute and multi-level relative prefixes', () => {
  expect(getPlogAssetRelativePath('../../../content/plog/XiZang/images/photo.jpg'))
    .toBe('XiZang/images/photo.jpg');
  expect(getPlogAssetRelativePath('/workspace/src/content/plog/daily/morning/images/photo.jpg'))
    .toBe('daily/morning/images/photo.jpg');
});
