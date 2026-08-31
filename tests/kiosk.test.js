import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { defaults, load, save, KEY, SCHEMA_VERSION } from '../src/storage/storage.js';
import { GameEngine } from '../src/engine/game-engine.js';
import { goHome, HOME_PATH } from '../src/kiosk-navigation.js';

const memoryStorage = initial => { const values = new Map(initial ? [[KEY, initial]] : []); return { getItem: key => values.get(key) ?? null, setItem: (key,value) => values.set(key,value), removeItem: key => values.delete(key) }; };
const outcome = { grid: Array.from({length:5},()=>['rose','boat','swan']), lines: [], scatters: 0, trigger: false, payout: 4, free: false, credits: 13 };

test('normal state restoration includes settings',()=>{const storage=memoryStorage();const state=defaults();state.credits=22;state.sound=false;state.settings.reducedMotion=true;save(state,storage);assert.deepEqual(load(storage),state);});
test('restoration during free games preserves feature progress',()=>{const storage=memoryStorage();const state=defaults();state.credits=17;state.feature={active:true,total:13,played:5,remaining:8,paused:true};save(state,storage);assert.deepEqual(load(storage).feature,state.feature);});
test('reload after calculation restores completed outcome',()=>{const storage=memoryStorage();const state=defaults();state.credits=outcome.credits;state.pendingOutcome=outcome;save(state,storage);assert.deepEqual(load(storage).pendingOutcome,outcome);});
test('restored completed spin does not duplicate wager',()=>{const storage=memoryStorage();const engine=new GameEngine({credits:10,rng:()=>.5});const result=engine.spin();const state=defaults();state.credits=engine.credits;state.pendingOutcome=result;save(state,storage);const once=load(storage).credits;assert.equal(load(storage).credits,once);});
test('restored completed spin does not duplicate payout',()=>{const storage=memoryStorage();const state=defaults();state.credits=13;state.pendingOutcome=outcome;save(state,storage);const restored=load(storage);restored.pendingOutcome=null;save(restored,storage);assert.equal(load(storage).credits,13);});
test('corrupted local storage recovers safe defaults',()=>assert.deepEqual(load(memoryStorage('{not json')),defaults()));
test('unsupported storage version recovers safe defaults',()=>assert.deepEqual(load(memoryStorage(JSON.stringify({...defaults(),version:999}))),defaults()));
test('HOME saves before replacement navigation',()=>{const calls=[];goHome(()=>calls.push('save'),{replace:path=>calls.push(path)});assert.deepEqual(calls,['save',HOME_PATH]);});
test('launcher navigates to game with a relative local path',()=>{const html=fs.readFileSync('kiosk/index.html','utf8');assert.match(html,/href="games\/primbee-gold\/index\.html"/);assert.doesNotMatch(html,/href="(?:https?:)?\/\//);});
test('game returns to launcher with replacement navigation',()=>{assert.equal(HOME_PATH,'../../index.html');assert.match(fs.readFileSync('src/kiosk-navigation.js','utf8'),/\.replace\(HOME_PATH\)/);});
test('runtime sources contain no external URLs or window.open',()=>{const files=['index.html','styles.css','kiosk/index.html','kiosk/launcher.css',...fs.readdirSync('src',{recursive:true}).filter(name=>/\.(?:js|css|html)$/.test(name)).map(name=>`src/${name}`)];const text=files.map(file=>fs.readFileSync(file,'utf8')).join('\n');assert.doesNotMatch(text,/https?:\/\//i);assert.doesNotMatch(text,/window\.open\s*\(/);});
test('storage key is game-specific and schema is versioned',()=>{assert.equal(KEY,'primbee-gold:state');assert.equal(SCHEMA_VERSION,2);});
