export class GameAudio {
  constructor(enabled=true,volume=.65){this.enabled=enabled;this.volume=volume;this.ctx=null;this.active=new Set();this.coinTimes=[];}
  tone(freq=440,duration=.1,type='sine',gain=.1){if(!this.enabled)return;this.ctx??=new (window.AudioContext||window.webkitAudioContext)();const o=this.ctx.createOscillator(),g=this.ctx.createGain(),now=this.ctx.currentTime;o.type=type;o.frequency.value=freq;g.gain.setValueAtTime(this.volume*gain,now);g.gain.exponentialRampToValueAtTime(.001,now+duration);o.connect(g).connect(this.ctx.destination);this.active.add(o);o.onended=()=>this.active.delete(o);o.start();o.stop(now+duration);}
  silence(){for(const node of this.active){try{node.stop();}catch{}}this.active.clear();}
  cue(name,index=0){const map={spin:[145,.11,'sawtooth'],move:[105,.07,'triangle'],small:[520,.18,'triangle'],medium:[620,.28,'triangle'],large:[720,.42,'triangle'],feature:[390,.5,'triangle'],free:[260,.14,'triangle'],double:[660,.32,'triangle'],complete:[820,.38,'triangle']},cue=map[name];if(!cue)return;if(name==='stop')this.tone(250+index*45,.09,'triangle',.08);else this.tone(...cue);}
  coin(progress=0){this.coinTimes.push(Date.now());this.tone(480+progress*260,.045,'triangle',.055);}
  completion(){this.tone(760,.18,'triangle',.09);setTimeout(()=>this.tone(980,.22,'triangle',.07),90);}
}
