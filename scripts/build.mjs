import fs from 'node:fs';
import path from 'node:path';
fs.rmSync('dist', { recursive: true, force: true });
fs.mkdirSync('dist/games/primbee-gold', { recursive: true });
fs.cpSync('kiosk/index.html', 'dist/index.html');
fs.cpSync('kiosk/launcher.css', 'dist/launcher.css');
for (const item of ['index.html','styles.css','LICENSE','THIRD_PARTY_NOTICES.md','design-assets','src']) fs.cpSync(item,path.join('dist/games/primbee-gold',item),{recursive:true});
console.log('Built offline kiosk and Primbee Gold with original design-assets PNG artwork');
