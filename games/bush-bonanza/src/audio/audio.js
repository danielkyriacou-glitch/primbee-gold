const FILES={spin:'slotPull.mp3',stop:'reelStop.mp3',small:'winSmall.wav',medium:'slotWin.mp3',large:'slotWin.mp3',feature:'slotFeature.mp3',scatter:'scatterHit.mp3',complete:'slotFeature.mp3',coin:'coinHandling.wav'};

export class GameAudio{
  constructor(enabled=true,volume=.65){this.enabled=enabled;this.volume=volume;this.active=new Set();this.coinTimes=[];this.spinLoop=null;}
  create(file,{loop=false}={}){const sound=new Audio(`audio/${file}`);sound.preload='auto';sound.loop=loop;sound.volume=this.volume;sound.addEventListener('ended',()=>this.active.delete(sound),{once:true});return sound;}
  play(file,options){if(!this.enabled)return null;const sound=this.create(file,options);this.active.add(sound);sound.play().catch(()=>this.active.delete(sound));return sound;}
  startReels(){this.stopReels();this.spinLoop=this.play('reelSpin.mp3',{loop:true});}
  reelLanded(reel){if(this.spinLoop)this.spinLoop.volume=this.volume*Math.max(.12,1-(reel+1)*.17);}
  stopReels(){if(this.spinLoop){this.spinLoop.pause();this.spinLoop.currentTime=0;this.active.delete(this.spinLoop);this.spinLoop=null;}}
  silence(){this.stopReels();for(const sound of this.active){sound.pause();sound.currentTime=0;}this.active.clear();}
  cue(name){if(name==='move'){this.startReels();return;}if(name==='stop'){this.play(FILES.stop);return;}const file=FILES[name];if(file)this.play(file);}
  coin(){this.coinTimes.push(Date.now());this.play(FILES.coin);}
}
