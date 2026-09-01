const FILES={spin:'slotPull.mp3',stop:'reelStop.mp3',small:'winSmall.wav',medium:'slotWin.mp3',large:'slotWin.mp3',feature:'slotFeature.mp3',scatter:'scatterHit.mp3',complete:'slotFeature.mp3',coin:'coinHandling.wav'};

export class GameAudio{
  constructor(enabled=true,volume=.65){this.enabled=enabled;this.volume=volume;this.active=new Set();this.coinTimes=[];this.spinLoop=null;this.ctx=null;}
  context(){if(!this.ctx){const Ctx=window.AudioContext||window.webkitAudioContext;if(Ctx)this.ctx=new Ctx();}if(this.ctx?.state==='suspended')this.ctx.resume().catch(()=>{});return this.ctx;}
  tone({frequency=440,duration=.12,type='sine',gain=.12,slide=0,delay=0}={}){if(!this.enabled)return;const ctx=this.context();if(!ctx)return;const start=ctx.currentTime+delay,osc=ctx.createOscillator(),amp=ctx.createGain();osc.type=type;osc.frequency.setValueAtTime(frequency,start);if(slide)osc.frequency.exponentialRampToValueAtTime(Math.max(30,frequency+slide),start+duration);amp.gain.setValueAtTime(.0001,start);amp.gain.exponentialRampToValueAtTime(Math.max(.0002,gain*this.volume),start+.012);amp.gain.exponentialRampToValueAtTime(.0001,start+duration);osc.connect(amp).connect(ctx.destination);osc.start(start);osc.stop(start+duration+.02);}
  create(file,{loop=false}={}){const sound=new Audio(`audio/${file}`);sound.preload='auto';sound.loop=loop;sound.volume=this.volume;sound.addEventListener('ended',()=>this.active.delete(sound),{once:true});return sound;}
  play(file,options){if(!this.enabled)return null;const sound=this.create(file,options);this.active.add(sound);sound.play().catch(()=>this.active.delete(sound));return sound;}
  startReels(){this.stopReels();this.spinLoop=this.play('reelSpin.mp3',{loop:true});if(this.spinLoop){this.spinLoop.playbackRate=.88;this.spinLoop.volume=this.volume*.48;}this.tone({frequency:105,duration:.16,type:'triangle',gain:.09,slide:35});}
  reelLanded(reel){if(this.spinLoop)this.spinLoop.volume=this.volume*Math.max(.08,.4-(reel+1)*.055);}
  stopReels(){if(this.spinLoop){this.spinLoop.pause();this.spinLoop.currentTime=0;this.active.delete(this.spinLoop);this.spinLoop=null;}}
  silence(){this.stopReels();for(const sound of this.active){sound.pause();sound.currentTime=0;}this.active.clear();}
  bushChime(notes,spacing=.075,gain=.12){notes.forEach((frequency,index)=>this.tone({frequency,duration:.18,type:'triangle',gain,slide:-10,delay:index*spacing}));}
  cue(name){
    if(name==='move'){this.startReels();return;}
    if(name==='stop'){this.tone({frequency:145,duration:.07,type:'square',gain:.055,slide:-35});return;}
    if(name==='small'){this.bushChime([392,523],.08,.09);return;}
    if(name==='medium'){this.bushChime([330,440,554,659],.07,.11);return;}
    if(name==='large'){this.bushChime([262,392,523,659,784],.065,.13);return;}
    if(name==='scatter'){this.bushChime([740,988],.055,.08);return;}
    if(name==='feature'){this.bushChime([262,330,392,523,659,784],.075,.14);return;}
    if(name==='complete'){this.bushChime([523,659,784,1047],.09,.13);return;}
    const file=FILES[name];if(file)this.play(file);
  }
  coin(progress=0){this.coinTimes.push(Date.now());const base=420+Math.round((progress||0)*180);this.tone({frequency:base,duration:.045,type:'triangle',gain:.045,slide:55});}
}
