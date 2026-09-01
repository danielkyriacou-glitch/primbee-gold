export const KEY = 'bush-bonanza:state';
export const SCHEMA_VERSION = 3;
const featureDefaults = () => ({ active:false,total:0,played:0,remaining:0,paused:false,win:0 });
export const defaults = () => ({version:SCHEMA_VERSION,credits:0,sound:true,settings:{volume:.65,reducedMotion:false,startingCredits:20},feature:featureDefaults(),lastWin:0,displayedGrid:null,displayedLines:[],winningPositions:[],lastPresentation:null,status:'ADD PLAY CREDITS TO BEGIN',pendingOutcome:null});
const uint=value=>Number.isInteger(value)&&value>=0;
const validGrid=grid=>grid===null||(Array.isArray(grid)&&grid.length===5&&grid.every(reel=>Array.isArray(reel)&&reel.length===3&&reel.every(symbol=>typeof symbol==='string')));
const validFeature=value=>value&&typeof value.active==='boolean'&&uint(value.total)&&uint(value.played)&&uint(value.remaining)&&typeof value.paused==='boolean'&&value.played<=value.total&&value.remaining<=value.total&&value.total<=18&&uint(value.win??0);
const validOutcome=value=>value===null||(value&&validGrid(value.grid)&&uint(value.payout)&&typeof value.free==='boolean'&&typeof value.trigger==='boolean'&&Array.isArray(value.lines)&&uint(value.credits));
function migrate(value){if(value?.version!==2)return value;return {...defaults(),...value,version:SCHEMA_VERSION,feature:{...featureDefaults(),...value.feature},status:value.credits>0?'READY — PRESS SPIN':'ADD PLAY CREDITS TO BEGIN'};}
export function validate(input){const value=migrate(input),settings=value?.settings;if(!value||value.version!==SCHEMA_VERSION||!uint(value.credits)||typeof value.sound!=='boolean'||!validFeature(value.feature)||!uint(value.lastWin)||!validOutcome(value.pendingOutcome)||!validGrid(value.displayedGrid)||!Array.isArray(value.displayedLines)||!Array.isArray(value.winningPositions)||typeof value.status!=='string'||!settings||typeof settings.reducedMotion!=='boolean'||!Number.isFinite(settings.volume)||settings.volume<0||settings.volume>1||![10,20,50].includes(settings.startingCredits))return null;return structuredClone({...value,version:SCHEMA_VERSION,feature:{...featureDefaults(),...value.feature}});}
export function load(storage=localStorage){try{return validate(JSON.parse(storage.getItem(KEY)))||defaults();}catch{return defaults();}}
export function save(value,storage=localStorage){const record=validate({...value,version:SCHEMA_VERSION});if(!record)throw Error('Refusing to save invalid Bush Bonanza state');storage.setItem(KEY,JSON.stringify(record));return record;}
export function reset(storage=localStorage){storage.removeItem(KEY);return defaults();}
export function addCredits(state,amount){if(![10,20,50].includes(amount))throw Error('Invalid refill');state.credits+=amount;return state;}
