import fs from 'node:fs';
import path from 'node:path';

fs.rmSync('dist', { recursive: true, force: true });
for (const item of [
  'index.html',
  'styles.css',
  'LICENSE',
  'THIRD_PARTY_NOTICES.md',
  'design-assets',
  'src'
]) {
  fs.cpSync(item, path.join('dist', item), { recursive: true });
}
console.log('Built dist/ with original design-assets PNG artwork');
