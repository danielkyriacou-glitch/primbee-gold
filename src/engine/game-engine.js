import {PAYLINES,PAYTABLE,WEIGHTS,FEATURE} from '../config/game.js';
import {productionRng} from './rng.js';
export function choose(weights,rng){const entries=Object.entries(weights),total=entries.reduce((n,[,w])=>n+w,0);let x=rng()*total;for(const [id,w] of entries){x-=w;if(x<0)return id;}return entries.at(-1)[0];}
export function generateGrid(rng=productionRng,free=false){return Array.from({length:5},()=>Array.from({length:3},()=>choose(free?WEIGHTS.free:WEIGHTS.base,rng)));}
export function evaluateLine(ids){let best=null;for(const symbol of Object.keys(PAYTABLE).filter(x=>x!=='wild')){let count=0;for(const id of ids){if(id===symbol||id==='wild')count++;else break;}if(count>=3){const payout=PAYTABLE[symbol][count-3];if(!best||payout>best.payout)best={symbol,count,payout};}}
 if(ids.every(x=>x==='wild')) return {symbol:'wild',count:5,payout:PAYTABLE.wild[2]}; return best;
}
export function evaluateGrid(grid,free=false){const lines=[];for(let i=0;i<PAYLINES.length;i++){const ids=PAYLINES[i].map((row,reel)=>grid[reel][row]);const win=evaluateLine(ids);if(win)lines.push({...win,line:i,positions:PAYLINES[i].map((row,reel)=>[reel,row])});}const scatters=grid.flat().filter(x=>x==='scatter').length;return {lines,scatters,trigger:scatters>=3,payout:lines.reduce((n,x)=>n+x.payout,0)*(free?FEATURE.multiplier:1)};}
export class GameEngine{constructor({rng=productionRng,credits=0,state}={}){this.rng=rng;this.credits=credits;this.feature=state||{active:false,total:0,played:0,remaining:0,paused:false};}
 spin({free=false}={}){if(!free){if(this.credits<1)throw Error('No play credits');this.credits--;}else if(!this.feature.active||this.feature.remaining<1)throw Error('No free game available');
 const grid=generateGrid(this.rng,free),result=evaluateGrid(grid,free);if(free){this.feature.played++;this.feature.remaining--;if(result.trigger){const add=Math.min(FEATURE.retrigger,FEATURE.cap-this.feature.total);this.feature.total+=add;this.feature.remaining+=add;}}else if(result.trigger){this.feature={active:true,total:8,played:0,remaining:8,paused:true};}this.credits+=result.payout;return {...result,grid,free,credits:this.credits};}
 finishFeature(){this.feature={active:false,total:0,played:0,remaining:0,paused:false};}}
