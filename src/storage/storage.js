export const KEY='primbee-gold-v1';export const defaults=()=>({version:1,credits:0,sound:true,volume:.65,reducedMotion:false,feature:{active:false,total:0,played:0,remaining:0,paused:false}});
export function load(storage=localStorage){try{const value=JSON.parse(storage.getItem(KEY));return value?.version===1?{...defaults(),...value}:defaults();}catch{return defaults();}}
export function save(value,storage=localStorage){storage.setItem(KEY,JSON.stringify({...value,version:1}));}
export function reset(storage=localStorage){storage.removeItem(KEY);return defaults();}
export function addCredits(state,amount){if(![10,20,50].includes(amount))throw Error('Invalid refill');state.credits+=amount;return state;}
