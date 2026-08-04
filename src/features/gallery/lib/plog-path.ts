/** Normalize Vite glob paths before matching them to a Plog entry slug. */
export function getPlogAssetRelativePath(path: string) {
  return path
    .replace(/\\/g, '/')
    .replace(/^.*?\/src\/content\/plog\//, '')
    .replace(/^(?:\.\.\/)+content\/plog\//, '');
}
