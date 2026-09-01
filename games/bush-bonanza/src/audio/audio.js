const RECORDINGS={scatter:'whipbird-call.mp3',feature:'kookaburra-call.mp3'};

export class GameAudio{
  constructor(enabled=true,volume=.65){
    this.enabled=enabled;
    this.volume=volume;
    this.active=new Set();
    this.nodes=new Set();
    this.coinTimes=[];
    this.spinBus=null;
    this.ctx=null;
  }

  context(){
    if(!this.ctx){
      const Ctx=window.AudioContext||window.webkitAudioContext;
      if(Ctx)this.ctx=new Ctx();
    }
    if(this.ctx?.state==='suspended')this.ctx.resume().catch(()=>{});
    return this.ctx;
  }

  tone({frequency=440,duration=.12,type='sine',gain=.12,slide=0,delay=0}={}){
    if(!this.enabled)return;
    const ctx=this.context();
    if(!ctx)return;
    const start=ctx.currentTime+delay,osc=ctx.createOscillator(),amp=ctx.createGain();
    osc.type=type;
    osc.frequency.setValueAtTime(frequency,start);
    if(slide)osc.frequency.exponentialRampToValueAtTime(Math.max(30,frequency+slide),start+duration);
    amp.gain.setValueAtTime(.0001,start);
    amp.gain.exponentialRampToValueAtTime(Math.max(.0002,gain*this.volume),start+.012);
    amp.gain.exponentialRampToValueAtTime(.0001,start+duration);
    osc.connect(amp).connect(ctx.destination);
    this.nodes.add(osc);
    osc.onended=()=>this.nodes.delete(osc);
    osc.start(start);
    osc.stop(start+duration+.02);
  }

  noise({duration=.1,gain=.05,frequency=600,type='bandpass',delay=0}={}){
    if(!this.enabled)return;
    const ctx=this.context();
    if(!ctx)return;
    const start=ctx.currentTime+delay,length=Math.max(1,Math.floor(ctx.sampleRate*duration));
    const buffer=ctx.createBuffer(1,length,ctx.sampleRate),data=buffer.getChannelData(0);
    for(let i=0;i<length;i++)data[i]=(Math.random()*2-1)*(1-i/length);
    const source=ctx.createBufferSource(),filter=ctx.createBiquadFilter(),amp=ctx.createGain();
    source.buffer=buffer;
    filter.type=type;
    filter.frequency.value=frequency;
    filter.Q.value=.8;
    amp.gain.setValueAtTime(.0001,start);
    amp.gain.exponentialRampToValueAtTime(Math.max(.0002,gain*this.volume),start+.008);
    amp.gain.exponentialRampToValueAtTime(.0001,start+duration);
    source.connect(filter).connect(amp).connect(ctx.destination);
    this.nodes.add(source);
    source.onended=()=>this.nodes.delete(source);
    source.start(start);
  }

  create(file,{loop=false,volume=1,playbackRate=1}={}){
    const sound=new Audio(`audio/${file}`);
    sound.preload='auto';
    sound.loop=loop;
    sound.volume=Math.min(1,this.volume*volume);
    sound.playbackRate=playbackRate;
    sound.addEventListener('ended',()=>this.active.delete(sound),{once:true});
    return sound;
  }

  play(file,options){
    if(!this.enabled)return null;
    const sound=this.create(file,options);
    this.active.add(sound);
    sound.play().catch(()=>this.active.delete(sound));
    return sound;
  }

  woodKnock(pitch=115,delay=0,gain=.1){
    this.tone({frequency:pitch,duration:.095,type:'triangle',gain,slide:-45,delay});
    this.noise({duration:.055,gain:gain*.42,frequency:420,type:'lowpass',delay});
  }

  startReels(){
    this.stopReels();
    const ctx=this.context();
    if(!this.enabled||!ctx)return;
    const length=Math.floor(ctx.sampleRate*1.2),buffer=ctx.createBuffer(1,length,ctx.sampleRate),data=buffer.getChannelData(0);
    let previous=0;
    for(let i=0;i<length;i++){
      const white=Math.random()*2-1;
      previous=previous*.86+white*.14;
      data[i]=previous;
    }
    const source=ctx.createBufferSource(),filter=ctx.createBiquadFilter(),amp=ctx.createGain();
    source.buffer=buffer;
    source.loop=true;
    source.playbackRate.value=1.15;
    filter.type='bandpass';
    filter.frequency.value=520;
    filter.Q.value=.55;
    amp.gain.setValueAtTime(.0001,ctx.currentTime);
    amp.gain.exponentialRampToValueAtTime(Math.max(.0002,this.volume*.065),ctx.currentTime+.12);
    source.connect(filter).connect(amp).connect(ctx.destination);
    source.start();
    this.spinBus={source,amp};
    this.woodKnock(92,0,.11);
    this.noise({duration:.18,gain:.045,frequency:1050,type:'bandpass'});
  }

  reelLanded(reel){
    const ctx=this.context();
    if(this.spinBus&&ctx){
      const next=this.volume*Math.max(.012,.055-(reel+1)*.008);
      this.spinBus.amp.gain.linearRampToValueAtTime(next,ctx.currentTime+.08);
    }
  }

  stopReels(){
    if(!this.spinBus)return;
    try{this.spinBus.source.stop();}catch{}
    this.spinBus.source.disconnect();
    this.spinBus.amp.disconnect();
    this.spinBus=null;
  }

  silence(){
    this.stopReels();
    for(const sound of this.active){sound.pause();sound.currentTime=0;}
    this.active.clear();
    for(const node of this.nodes){try{node.stop();}catch{}}
    this.nodes.clear();
  }

  bushChime(notes,spacing=.085,gain=.1){
    notes.forEach((frequency,index)=>{
      const delay=index*spacing;
      this.tone({frequency,duration:.22,type:'sine',gain,slide:-6,delay});
      this.tone({frequency:frequency*2,duration:.11,type:'triangle',gain:gain*.28,slide:-12,delay});
    });
  }

  cue(name){
    if(name==='spin'){
      this.woodKnock(105,0,.12);
      this.noise({duration:.11,gain:.05,frequency:780,type:'bandpass'});
      return;
    }
    if(name==='move'){this.startReels();return;}
    if(name==='stop'){
      this.woodKnock(125,0,.09);
      this.noise({duration:.05,gain:.035,frequency:330,type:'lowpass'});
      return;
    }
    if(name==='small'){this.bushChime([392,523],.1,.075);return;}
    if(name==='medium'){this.bushChime([330,440,554,659],.085,.095);return;}
    if(name==='large'){this.bushChime([262,392,523,659,784],.08,.115);return;}
    if(name==='scatter'){
      this.play(RECORDINGS.scatter,{volume:.48,playbackRate:1.03});
      return;
    }
    if(name==='feature'){
      this.play(RECORDINGS.feature,{volume:.62});
      this.bushChime([262,330,392,523,659],.1,.09);
      return;
    }
    if(name==='complete'){this.bushChime([392,523,659,784],.105,.1);return;}
  }

  coin(progress=0){
    this.coinTimes.push(Date.now());
    const base=560+Math.round((progress||0)*240);
    this.tone({frequency:base,duration:.055,type:'sine',gain:.035,slide:70});
    this.noise({duration:.025,gain:.014,frequency:1800,type:'highpass'});
  }
}
