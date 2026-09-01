import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const launcher=()=>fs.readFileSync('kiosk/index.html','utf8');

test('launcher is branded Club Mick and exposes only finished activities',()=>{const html=launcher();assert.match(html,/<title>Club Mick<\/title>/);assert.match(html,/<h1>Club Mick<\/h1>/);assert.doesNotMatch(html,/Primbee Games|Future game|Future photo gallery|Horse/i);assert.equal((html.match(/class="game-tile"/g)||[]).length,1);assert.match(html,/href="games\/primbee-gold\/index\.html"/);});

test('Club Mick launcher keeps blank grid capacity without visible placeholders',()=>{const html=launcher(),css=fs.readFileSync('kiosk/launcher.css','utf8');assert.doesNotMatch(html,/placeholder/);assert.match(css,/grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/);assert.match(css,/grid-template-rows:repeat\(2,minmax\(0,1fr\)\)/);});

test('Club Mick manifest meets the Android standalone install shape with local icons',()=>{const manifest=JSON.parse(fs.readFileSync('kiosk/manifest.webmanifest','utf8'));assert.equal(manifest.id,'./');assert.equal(manifest.name,'Club Mick');assert.equal(manifest.short_name,'Club Mick');assert.equal(manifest.start_url,'./');assert.equal(manifest.scope,'./');assert.equal(manifest.display,'standalone');assert.equal(manifest.orientation,'landscape');assert.deepEqual(manifest.icons.map(icon=>icon.sizes),['192x192','512x512']);for(const icon of manifest.icons){assert.equal(icon.type,'image/png');assert.doesNotMatch(icon.src,/^(?:https?:)?\/\//);assert.ok(fs.existsSync(`kiosk/${icon.src}`));}});

test('launcher registers only the local root service worker',()=>{const html=launcher(),js=fs.readFileSync('kiosk/launcher.js','utf8');assert.match(html,/rel="manifest" href="manifest\.webmanifest"/);assert.match(html,/src="launcher\.js"/);assert.match(js,/serviceWorker\.register\('\.\/sw\.js'\)/);assert.doesNotMatch(js,/https?:\/\//);});

test('production build copies Club Mick shell and generates an offline precache service worker',()=>{const build=fs.readFileSync('scripts/build.mjs','utf8');for(const item of ['launcher.js','manifest.webmanifest','icons'])assert.match(build,new RegExp(item.replace('.','\\.')));assert.match(build,/filesUnder\(DIST\)/);assert.match(build,/cache\.addAll\(PRECACHE\)/);assert.match(build,/fs\.writeFileSync\(path\.join\(DIST,'sw\.js'\)/);assert.match(build,/club-mick-/);assert.match(build,/'audio','design-assets','src'/);});

test('Club Mick shell runtime contains no external URLs',()=>{const files=['kiosk/index.html','kiosk/launcher.css','kiosk/launcher.js','kiosk/manifest.webmanifest'];const text=files.map(file=>fs.readFileSync(file,'utf8')).join('\n');assert.doesNotMatch(text,/https?:\/\//i);});
