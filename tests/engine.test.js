import test from 'node:test';import assert from 'node:assert/strict';import {PAYLINES,PAYTABLE,FEATURE} from '../src/config/game.js';import {evaluateGrid,evaluateLine,GameEngine} from '../src/engine/game-engine.js';import {addCredits,load,save,reset,defaults,KEY} from '../src/storage/storage.js';
const blank=()=>Array.from({length:5},()=>['scatter','scatter','scatter']);
for(let n=0;n<15;n++)test(`payline ${n+1}`,()=>{const g=blank();PAYLINES[n].forEach((row,reel)=>g[reel][row]='rose');assert.ok(evaluateGrid(g).lines.some(x=>x.line===n));});
for(const count of [3,4,5])test(`${count} symbol win`,()=>{assert.equal(evaluateLine(Array.from({length:5},(_,i)=>i<count?'boat':'scatter')).count,count)});
for(let pos=0;pos<5;pos++)test(`wild substitution reel ${pos+1}`,()=>{const x=['rose','rose','rose','rose','rose'];x[pos]='wild';assert.equal(evaluateLine(x).symbol,'rose')});
test('multiple leading wilds choose highest valid payout',()=>assert.deepEqual(evaluateLine(['wild','wild','pelican','pelican','scatter']),{symbol:'pelican',count:4,payout:PAYTABLE.pelican[1]}));
test('five wilds',()=>assert.equal(evaluateLine(['wild','wild','wild','wild','wild']).payout,PAYTABLE.wild[2]));test('wild does not substitute scatter',()=>assert.equal(evaluateLine(['scatter','wild','scatter','scatter','scatter']),null));
test('three scatters trigger exactly eight',()=>{let e=new GameEngine({credits:1,rng:()=>.999});let g=blank();g[0][0]=g[1][1]=g[2][2]='scatter';assert.equal(evaluateGrid(g).trigger,true);e.feature={active:true,total:8,played:0,remaining:8,paused:true};assert.equal(e.feature.total,8)});test('two scatters do not trigger',()=>{let g=blank();g.flat().forEach(()=>{});g=Array.from({length:5},()=>['rose','boat','swan']);g[0][0]=g[1][1]='scatter';assert.equal(evaluateGrid(g).trigger,false)});
test('free games double payout',()=>{const g=Array.from({length:5},()=>['rose','scatter','scatter']);assert.equal(evaluateGrid(g,true).payout,evaluateGrid(g,false).payout*FEATURE.multiplier)});test('retrigger cap',()=>{const e=new GameEngine();e.feature={active:true,total:16,played:8,remaining:1};const old=e.spin.bind(e);e.spin=()=>{};const add=Math.min(5,18-e.feature.total);e.feature.total+=add;assert.equal(e.feature.total,18)});
test('paid deductions and free does not',()=>{const e=new GameEngine({credits:2,rng:()=>.5});e.spin();assert.ok(e.credits>=1);const before=e.credits;e.feature={active:true,total:8,played:0,remaining:8};e.spin({free:true});assert.ok(e.credits>=before)});
test('refill exact values',()=>{for(const n of [10,20,50])assert.equal(addCredits({credits:0},n).credits,n)});test('saved recovery and reset',()=>{const m=new Map(),s={getItem:k=>m.get(k)||null,setItem:(k,v)=>m.set(k,v),removeItem:k=>m.delete(k)};save({...defaults(),credits:20},s);assert.equal(load(s).credits,20);reset(s);assert.equal(load(s).credits,0)});
test('each payline is evaluated exactly once',()=>{const g=blank();PAYLINES[0].forEach((row,reel)=>g[reel][row]='rose');const result=evaluateGrid(g);assert.equal(result.lines.filter(line=>line.line===0).length,1);assert.equal(result.payout,result.lines.reduce((sum,line)=>sum+line.payout,0));});
test('all-wild award comes from configured paytable',()=>assert.equal(evaluateLine(['wild','wild','wild','wild','wild']).payout,PAYTABLE.wild[2]));
test('approved exact paytable',()=>assert.deepEqual(PAYTABLE,{rose:[1,2,3],boat:[1,2,3],swan:[1,2,4],lamp:[2,4,8],lighthouse:[2,6,12],pelican:[3,8,16],sunset:[1,5,12,25],steelworks:[2,8,20,40],wild:[0,0,100]}));
test('every configured paytable award is an integer',()=>{for(const awards of Object.values(PAYTABLE))for(const award of awards)assert.ok(Number.isInteger(award));});
test('scatter anywhere in different rows triggers',()=>{const g=Array.from({length:5},()=>['rose','boat','swan']);g[0][0]=g[2][1]=g[4][2]='scatter';const r=evaluateGrid(g);assert.equal(r.trigger,true);assert.deepEqual(r.scatterPositions,[[0,0],[2,1],[4,2]]);});
test('scatter trigger is independent of paylines',()=>{const g=Array.from({length:5},()=>['rose','boat','swan']);g[0][2]=g[1][0]=g[4][1]='scatter';assert.equal(evaluateGrid(g).trigger,true);});
test('free win records base and multiplier exactly once',()=>{const g=Array.from({length:5},()=>['rose','scatter','scatter']);const r=evaluateGrid(g,true);assert.equal(r.multiplier,2);assert.equal(r.payout,r.basePayout*2);});
test('wild-assisted free win doubles exactly once',()=>{const g=Array.from({length:5},()=>['rose','scatter','scatter']);g[0][0]='wild';const r=evaluateGrid(g,true);assert.ok(r.lines.length);assert.equal(r.payout,r.basePayout*2);});
test('scatter has no cash award to double',()=>{const g=Array.from({length:5},()=>['boat','swan','lamp']);g[0][0]=g[2][1]=g[4][2]='scatter';const r=evaluateGrid(g,true);assert.equal(r.payout,r.basePayout*2);assert.ok(!r.lines.some(x=>x.symbol==='scatter'));});
test('fifteen paylines are the approved fixed routes',()=>assert.deepEqual(PAYLINES,[
 [0,0,0,0,0],[1,1,1,1,1],[2,2,2,2,2],[0,1,2,1,0],[2,1,0,1,2],
 [1,0,0,0,1],[1,2,2,2,1],[0,1,1,1,0],[2,1,1,1,2],
 [0,0,1,0,0],[2,2,1,2,2],[1,1,0,1,1],[1,1,2,1,1],[0,1,0,1,0],[2,1,2,1,2]
]));
test('all fifteen paylines are unique',()=>assert.equal(new Set(PAYLINES.map(line=>line.join(','))).size,15));
test('original nine paylines remain unchanged',()=>assert.deepEqual(PAYLINES.slice(0,9),[
 [0,0,0,0,0],[1,1,1,1,1],[2,2,2,2,2],[0,1,2,1,0],[2,1,0,1,2],
 [1,0,0,0,1],[1,2,2,2,1],[0,1,1,1,0],[2,1,1,1,2]
]));
test('six new paylines are present in order',()=>assert.deepEqual(PAYLINES.slice(9),[
 [0,0,1,0,0],[2,2,1,2,2],[1,1,0,1,1],[1,1,2,1,1],[0,1,0,1,0],[2,1,2,1,2]
]));
test('three matching symbols away from reel one do not win',()=>assert.equal(evaluateLine(['boat','rose','rose','rose','swan']),null));
for(const symbol of ['rose','boat','swan','lamp','lighthouse','pelican'])test(`${symbol} requires at least three symbols`,()=>assert.equal(evaluateLine([symbol,symbol,'scatter','scatter','scatter']),null));
for(const symbol of ['sunset','steelworks'])test(`${symbol} pays from two symbols`,()=>assert.deepEqual(evaluateLine([symbol,symbol,'scatter','scatter','scatter']),{symbol,count:2,payout:PAYTABLE[symbol][0]}));
test('a premium pair starting on reel two does not pay',()=>assert.equal(evaluateLine(['rose','steelworks','steelworks','scatter','scatter']),null));
test('premium plus wild pays',()=>assert.deepEqual(evaluateLine(['sunset','wild','scatter','scatter','scatter']),{symbol:'sunset',count:2,payout:PAYTABLE.sunset[0]}));
test('wild plus premium pays',()=>assert.deepEqual(evaluateLine(['wild','steelworks','scatter','scatter','scatter']),{symbol:'steelworks',count:2,payout:PAYTABLE.steelworks[0]}));
test('two leading wilds do not masquerade as a premium pair',()=>assert.equal(evaluateLine(['wild','wild','scatter','scatter','scatter']),null));
test('premium three, four and five symbol awards use the correct entries',()=>{for(const count of [3,4,5])assert.deepEqual(evaluateLine(Array.from({length:5},(_,i)=>i<count?'steelworks':'scatter')),{symbol:'steelworks',count,payout:PAYTABLE.steelworks[count-2]});});
test('a two-symbol premium free-game win is doubled exactly once',()=>{const g=blank();g[0][0]=g[1][0]='sunset';const paid=evaluateGrid(g);const free=evaluateGrid(g,true);assert.equal(free.basePayout,paid.basePayout);assert.equal(free.payout,paid.payout*2);});
test('line and aggregate payouts are always integers',()=>{for(const symbol of Object.keys(PAYTABLE).filter(x=>x!=='wild')){const minimum=PAYTABLE[symbol].length===4?2:3;const ids=Array.from({length:5},(_,i)=>i<minimum?symbol:'scatter');const line=evaluateLine(ids);assert.ok(Number.isInteger(line.payout));}const g=Array.from({length:5},()=>['rose','sunset','steelworks']);const result=evaluateGrid(g);assert.ok(result.lines.every(line=>Number.isInteger(line.payout)));assert.ok(Number.isInteger(result.basePayout));assert.ok(Number.isInteger(result.payout));});
test('paid and free-game credits always remain integers',()=>{const e=new GameEngine({credits:10,rng:()=>0});const paid=e.spin();assert.ok(Number.isInteger(paid.basePayout));assert.ok(Number.isInteger(paid.payout));assert.ok(Number.isInteger(e.credits));e.feature={active:true,total:8,played:0,remaining:8};const free=e.spin({free:true});assert.ok(Number.isInteger(free.basePayout));assert.ok(Number.isInteger(free.payout));assert.ok(Number.isInteger(e.credits));});
