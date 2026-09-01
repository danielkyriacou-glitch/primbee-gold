import fs from 'node:fs';
import path from 'node:path';

const DIST='dist';
const GAME=path.join(DIST,'games','primbee-gold');

fs.rmSync(DIST,{recursive:true,force:true});
fs.mkdirSync(GAME,{recursive:true});
for(const item of ['index.html','launcher.css','launcher.js','manifest.webmanifest']) fs.cpSync(path.join('kiosk',item),path.join(DIST,item));
fs.cpSync(path.join('kiosk','icons'),path.join(DIST,'icons'),{recursive:true});
for(const item of ['index.html','styles.css','LICENSE','THIRD_PARTY_NOTICES.md','audio','design-assets','src']) fs.cpSync(item,path.join(GAME,item),{recursive:true});

function filesUnder(dir,base=dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(entry=>{const full=path.join(dir,entry.name);if(entry.isDirectory())return filesUnder(full,base);return [path.relative(base,full).split(path.sep).join('/')];});}

const precache=['./',...filesUnder(DIST).filter(file=>file!=='sw.js').sort().map(file=>`./${file}`)];
const cacheVersion=(process.env.GITHUB_SHA||'local-v1').slice(0,12);
const cacheName=`club-mick-${cacheVersion}`;
const serviceWorker=`const CACHE_NAME=${JSON.stringify(cacheName)};\nconst PRECACHE=${JSON.stringify(precache)};\nself.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(PRECACHE)).then(()=>self.skipWaiting()));});\nself.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('club-mick-')&&key!==CACHE_NAME).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));});\nself.addEventListener('fetch',event=>{if(event.request.method!=='GET')return;event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request).then(response=>{if(response&&response.ok&&event.request.url.startsWith(self.location.origin)){const copy=response.clone();caches.open(CACHE_NAME).then(cache=>cache.put(event.request,copy));}return response;}).catch(()=>event.request.mode==='navigate'?caches.match('./index.html'):Response.error())));});\n`;
fs.writeFileSync(path.join(DIST,'sw.js'),serviceWorker);
console.log(`Built Club Mick offline kiosk and Primbee Gold with ${precache.length} precached routes`);
