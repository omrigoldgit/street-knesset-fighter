(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))i(n);new MutationObserver(n=>{for(const r of n)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&i(a)}).observe(document,{childList:!0,subtree:!0});function e(n){const r={};return n.integrity&&(r.integrity=n.integrity),n.referrerPolicy&&(r.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?r.credentials="include":n.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function i(n){if(n.ep)return;n.ep=!0;const r=e(n);fetch(n.href,r)}})();const Of={minor:[0,2,3,5,7,8,10],phrygian:[0,1,3,5,7,8,10],dorian:[0,2,3,5,7,9,10],major:[0,2,4,5,7,9,11]},Bf={minor:[0,5,2,6],phrygian:[0,1,0,6],dorian:[0,3,0,4],major:[0,4,5,3]},rn=s=>440*Math.pow(2,(s-69)/12);class zf{ctx=null;master;sfxBus;musicBus;comp;noiseBuf;seqTimer=null;nextNoteTime=0;step=0;music=null;musicSeed=1;volumes={master:.8,music:.5,sfx:.8};announcer=!0;voice=null;unlock(){if(!this.ctx){try{const n=window.AudioContext??window.webkitAudioContext;this.ctx=new n}catch{return}const t=this.ctx;this.comp=t.createDynamicsCompressor(),this.comp.threshold.value=-14,this.comp.ratio.value=4,this.master=t.createGain(),this.sfxBus=t.createGain(),this.musicBus=t.createGain(),this.sfxBus.connect(this.master),this.musicBus.connect(this.master),this.master.connect(this.comp),this.comp.connect(t.destination),this.applyVolumes();const e=t.sampleRate;this.noiseBuf=t.createBuffer(1,e,t.sampleRate);const i=this.noiseBuf.getChannelData(0);for(let n=0;n<e;n++)i[n]=Math.random()*2-1;this.pickVoice(),this.music&&this.startSequencer()}this.ctx.state==="suspended"&&this.ctx.resume().catch(()=>{})}get running(){return!!this.ctx&&this.ctx.state==="running"}applyVolumes(){this.ctx&&(this.master.gain.value=this.volumes.master,this.sfxBus.gain.value=this.volumes.sfx,this.musicBus.gain.value=this.volumes.music*.55)}pickVoice(){if(!("speechSynthesis"in window))return;const t=()=>{const e=speechSynthesis.getVoices();this.voice=e.find(i=>/en[-_](US|GB)/i.test(i.lang)&&/male|david|daniel|george|guy|fred/i.test(i.name))??e.find(i=>/^en/i.test(i.lang))??null};t(),speechSynthesis.onvoiceschanged=t}say(t){if(!(!this.announcer||!("speechSynthesis"in window)||this.volumes.master*this.volumes.sfx<=.01))try{speechSynthesis.cancel();const e=new SpeechSynthesisUtterance(t);this.voice&&(e.voice=this.voice),e.rate=.95,e.pitch=.55,e.volume=Math.min(1,this.volumes.master*this.volumes.sfx*1.2),speechSynthesis.speak(e)}catch{}}env(t,e,i,n,r){t.gain.setValueAtTime(1e-4,e),t.gain.exponentialRampToValueAtTime(Math.max(2e-4,n),e+i),t.gain.exponentialRampToValueAtTime(1e-4,e+i+r)}tone(t,e,i,n,r,a,o=0,l=.005){const c=this.ctx,h=c.currentTime+o,f=c.createOscillator(),u=c.createGain();f.type=t,f.frequency.setValueAtTime(e,h),i!==e&&f.frequency.exponentialRampToValueAtTime(Math.max(20,i),h+n),this.env(u,h,l,r,n),f.connect(u).connect(a),f.start(h),f.stop(h+l+n+.05)}noise(t,e,i,n,r,a,o,l=0){const c=this.ctx,h=c.currentTime+l,f=c.createBufferSource();f.buffer=this.noiseBuf,f.loop=!0;const u=c.createBiquadFilter();u.type=i,u.frequency.setValueAtTime(n,h),u.frequency.exponentialRampToValueAtTime(Math.max(30,r),h+t),u.Q.value=a;const d=c.createGain();this.env(d,h,.003,e,t),f.connect(u).connect(d).connect(o),f.start(h,Math.random()*.5),f.stop(h+t+.05)}sfx(t,e=1){if(!this.running)return;const i=this.sfxBus;switch(t){case"whoosh":this.noise(.12,.25,"bandpass",900*e,3e3*e,1.5,i);break;case"whooshHeavy":this.noise(.2,.35,"bandpass",500,1800,1.2,i);break;case"hitLight":this.noise(.07,.6,"lowpass",4e3,800,.8,i),this.tone("sine",220*e,90,.08,.5,i);break;case"hitHeavy":this.noise(.16,.8,"lowpass",3e3,300,.8,i),this.tone("sine",140*e,50,.2,.9,i),this.tone("square",90,40,.1,.15,i);break;case"hitSuper":this.noise(.3,.9,"lowpass",5e3,200,.6,i),this.tone("sine",120,35,.35,1,i),this.tone("sawtooth",300,60,.25,.2,i);break;case"block":this.tone("square",1400,900,.04,.18,i),this.noise(.06,.3,"highpass",2500,1500,1,i);break;case"jump":this.tone("sine",300,520,.08,.12,i);break;case"land":this.tone("sine",110,60,.08,.3,i);break;case"landHard":this.noise(.2,.5,"lowpass",900,120,.7,i),this.tone("sine",80,35,.25,.8,i);break;case"special":this.tone("sawtooth",220*e,660*e,.18,.12,i),this.noise(.2,.2,"bandpass",800,3e3,2,i);break;case"projectile":this.tone("square",660*e,220*e,.18,.1,i);break;case"superFlash":this.noise(.6,.4,"bandpass",400,4e3,1.5,i),[0,4,7,12].forEach((n,r)=>this.tone("sawtooth",rn(57+n),rn(57+n+12),.5,.08,i,r*.04));break;case"ko":this.noise(1.2,.8,"lowpass",2e3,60,.5,i),this.tone("sine",90,25,1.2,1,i);break;case"grab":this.noise(.1,.4,"bandpass",600,300,1,i),this.tone("sine",160,90,.1,.4,i);break;case"tech":this.tone("triangle",1600,1200,.15,.3,i),this.tone("triangle",2100,1700,.15,.2,i,.02);break;case"shield":this.tone("sine",1800,1200,.25,.25,i);break;case"reflect":this.tone("triangle",900,1800,.15,.3,i);break;case"armor":this.tone("square",300,200,.1,.2,i),this.tone("triangle",2400,2e3,.2,.15,i);break;case"teleport":this.tone("sine",400,1600,.12,.2,i),this.tone("sine",1600,400,.12,.2,i,.12);break;case"buff":[0,4,7].forEach((n,r)=>this.tone("triangle",rn(72+n),rn(72+n),.12,.12,i,r*.05));break;case"lifeline":this.tone("sine",70,50,.12,.8,i),this.tone("sine",70,50,.12,.8,i,.2),[0,7,12].forEach((n,r)=>this.tone("triangle",rn(76+n),rn(76+n),.3,.15,i,.4+r*.08));break;case"clash":this.tone("square",900,500,.12,.2,i),this.noise(.15,.4,"bandpass",2e3,800,2,i);break;case"counter":this.tone("sawtooth",500,1500,.1,.2,i);break;case"menuMove":this.tone("square",880,880,.035,.07,i);break;case"menuConfirm":this.tone("square",880,880,.05,.08,i),this.tone("square",1320,1320,.08,.08,i,.05);break;case"menuBack":this.tone("square",660,440,.08,.07,i);break;case"select":this.tone("sawtooth",440,880,.12,.12,i),this.noise(.2,.2,"highpass",3e3,6e3,1,i);break;case"round":this.tone("triangle",523,523,.25,.2,i);break;case"crowd":this.noise(1.2,.18,"bandpass",900,700,.6,i);break}}playMusic(t,e=1){this.music=t,this.musicSeed=e,this.stopSequencer(),t&&this.ctx&&this.startSequencer()}stopSequencer(){this.seqTimer!==null&&(clearInterval(this.seqTimer),this.seqTimer=null)}startSequencer(){!this.ctx||!this.music||(this.stopSequencer(),this.step=0,this.nextNoteTime=this.ctx.currentTime+.1,this.seqTimer=window.setInterval(()=>this.schedule(),25))}rnd(t){const e=Math.sin(t*12.9898+this.musicSeed*78.233)*43758.5453;return e-Math.floor(e)}schedule(){const t=this.ctx,e=this.music;if(!t||!e)return;const i=60/e.bpm/4;for(;this.nextNoteTime<t.currentTime+.12;)this.playStep(this.step,this.nextNoteTime-t.currentTime,e),this.nextNoteTime+=i,this.step++}playStep(t,e,i){const n=t%16,r=Math.floor(t/16)%4,a=Of[i.mode],o=Bf[i.mode][r],l=i.root+a[o%7]+(o>=7?12:0),c=(u,d=0)=>{const p=o+u;return i.root+a[(p%7+7)%7]+12*Math.floor(p/7)+d*12},h=Math.max(0,e);if(n%4===0&&this.kick(h),(n===4||n===12)&&this.snare(h),i.intensity>.85&&n===14&&this.snare(h,.5),this.hat(h,n%2===0?.08:.04),n%2===0){const u=n%8===6?12:0;this.voiceNote("sawtooth",rn(l-12+u),60/i.bpm/2*.9,.12,h,700)}const f=Math.floor(t/64);if(this.rnd(n+f*16+r*3)<.45+i.intensity*.25){const u=[0,2,4,7,4,2,5,3][Math.floor(this.rnd(n*7+f)*8)];this.voiceNote("square",rn(c(u,1)+12),60/i.bpm/4*.8,.045,h,3200)}if(n===0)for(const u of[0,2,4])this.voiceNote("triangle",rn(c(u)),60/i.bpm*3.6,.035,h,1800,.08)}voiceNote(t,e,i,n,r,a,o=.005){const l=this.ctx,c=l.currentTime+r,h=l.createOscillator();h.type=t,h.frequency.value=e;const f=l.createBiquadFilter();f.type="lowpass",f.frequency.value=a;const u=l.createGain();this.env(u,c,o,n,i),h.connect(f).connect(u).connect(this.musicBus),h.start(c),h.stop(c+o+i+.05)}kick(t){const e=this.ctx,i=e.currentTime+t,n=e.createOscillator(),r=e.createGain();n.frequency.setValueAtTime(140,i),n.frequency.exponentialRampToValueAtTime(40,i+.12),this.env(r,i,.002,.5,.16),n.connect(r).connect(this.musicBus),n.start(i),n.stop(i+.2)}snare(t,e=.8){this.noise(.12,.28*e,"bandpass",1800,1200,.9,this.musicBus,t),this.tone("triangle",220,160,.06,.12*e,this.musicBus,t)}hat(t,e){this.noise(.03,e,"highpass",7e3,9e3,1,this.musicBus,t)}}const at={LP:1,HP:2,LK:4,HK:8,SP:16,UL:32,SS:64,TH:128,START:256,SELECT:512},hl=at.LP|at.HP,Qu=at.LK|at.HK,an=hl|Qu,Xe=Object.freeze({dir:5,held:0,pressed:0}),ul=["LP","HP","LK","HK","SP","UL","TH","SS","START","SELECT"],so={LP:"Light Punch",HP:"Heavy Punch",LK:"Light Kick",HK:"Heavy Kick",SP:"Special",UL:"Ultimate",SS:"Sidestep",TH:"Throw",START:"Pause",SELECT:"Reset (training)"},ro={LP:2,HP:3,LK:0,HK:1,SP:5,UL:7,SS:4,TH:6,START:9,SELECT:8},Hf={LP:0,HP:3,LK:1,HK:2,SP:5,UL:7,SS:4,TH:6,START:9,SELECT:8},ur={UP:["KeyW"],DOWN:["KeyS"],LEFT:["KeyA"],RIGHT:["KeyD"],LP:["KeyU"],HP:["KeyI"],LK:["KeyJ"],HK:["KeyK"],SP:["KeyO"],UL:["KeyL"],TH:["KeyH"],SS:["Space"],START:["Escape","Enter"],SELECT:["Backspace"]},dr={UP:["ArrowUp"],DOWN:["ArrowDown"],LEFT:["ArrowLeft"],RIGHT:["ArrowRight"],LP:["Numpad4","Insert"],HP:["Numpad5","Home"],LK:["Numpad1","Delete"],HK:["Numpad2","End"],SP:["Numpad6","PageUp"],UL:["Numpad3","PageDown"],TH:["Numpad0"],SS:["NumpadDecimal","ShiftRight"],START:["NumpadEnter"],SELECT:["NumpadSubtract"]},Gf={up:!1,down:!1,left:!1,right:!1,confirm:!1,back:!1,extra:!1,extra2:!1,start:!1,l1:!1,r1:!1,any:!1},Or={LP:at.LP,HP:at.HP,LK:at.LK,HK:at.HK,SP:at.SP,UL:at.UL,SS:at.SS,TH:at.TH,START:at.START,SELECT:at.SELECT};function rh(s,t){return t<0?s<0?7:s>0?9:8:t>0?s<0?1:s>0?3:2:s<0?4:s>0?6:5}function Vf(s){const t=s.toLowerCase();return t.includes("dualsense")||t.includes("0ce6")||t.includes("0df2")?"dualsense":t.includes("054c")||t.includes("dualshock")||t.includes("wireless controller")||t.includes("playstation")?"dualshock":t.includes("xbox")||t.includes("xinput")||t.includes("045e")?"xbox":"generic"}function Wf(s,t){try{const e=localStorage.getItem(s);return e?JSON.parse(e):t}catch{return t}}function ah(s,t){try{localStorage.setItem(s,JSON.stringify(t))}catch{}}class Xf{keys=new Set;tapped=new Set;prevKeys=new Set;pads=new Map;slotPad=[null,null];kb=[{dir:5,prevDir:5,repeat:0,menuDir:5},{dir:5,prevDir:5,repeat:0,menuDir:5}];bindings=Wf("skf.bindings",{});rumbleEnabled=!0;lastDevice=["kb","kb"];onChange=null;captureCb=null;constructor(){window.addEventListener("keydown",t=>{(t.code==="Tab"||t.code==="Space"||t.code.startsWith("Arrow")||t.code==="Backspace")&&t.preventDefault(),this.keys.add(t.code),this.tapped.add(t.code)}),window.addEventListener("keyup",t=>this.keys.delete(t.code)),window.addEventListener("blur",()=>{this.keys.clear(),this.tapped.clear()}),window.addEventListener("gamepadconnected",t=>{this.refreshPads(),this.autoAssign(t.gamepad.index),this.onChange?.()}),window.addEventListener("gamepaddisconnected",t=>{const e=t.gamepad.index;this.pads.delete(e),this.slotPad=this.slotPad.map(i=>i===e?null:i),this.onChange?.()})}refreshPads(){const t=navigator.getGamepads?navigator.getGamepads():[];for(const e of t)!e||!e.connected||this.pads.has(e.index)||(this.pads.set(e.index,{index:e.index,id:e.id,kind:Vf(e.id),standard:e.mapping==="standard",buttons:[],prevButtons:[],dir:5,prevDir:5,repeat:0,menuDir:5}),this.autoAssign(e.index),this.onChange?.())}autoAssign(t){this.slotPad.includes(t)||(this.slotPad[0]===null?(this.slotPad[0]=t,this.lastDevice[0]="pad"):this.slotPad[1]===null&&(this.slotPad[1]=t,this.lastDevice[1]="pad"))}swapSlots(){this.slotPad=[this.slotPad[1],this.slotPad[0]],this.onChange?.()}assignPad(t,e){const i=t===0?1:0;e!==null&&this.slotPad[i]===e&&(this.slotPad[i]=this.slotPad[t]),this.slotPad[t]=e,this.onChange?.()}connectedPads(){return[...this.pads.values()].map(t=>({index:t.index,id:t.id,kind:t.kind,standard:t.standard}))}padInfo(t){const e=this.slotPad[t];if(e===null)return null;const i=this.pads.get(e);return i?{index:i.index,id:i.id,kind:i.kind}:null}bindingFor(t){const e=this.pads.get(t);if(!e)return ro;const i=this.bindings[e.id];return i||(e.standard?ro:e.kind==="dualsense"||e.kind==="dualshock"?Hf:ro)}setBinding(t,e){const i=this.pads.get(t);i&&(this.bindings[i.id]=e,ah("skf.bindings",this.bindings))}resetBinding(t){const e=this.pads.get(t);e&&(delete this.bindings[e.id],ah("skf.bindings",this.bindings))}captureNextButton(t){this.captureCb=t}readPadDir(t,e){let i=0,n=0;const r=t.axes[0]??0,a=t.axes[1]??0;if(r<-.45?i=-1:r>.45&&(i=1),a<-.5?n=-1:a>.5&&(n=1),e){const o=t.buttons;o[12]?.pressed&&(n=-1),o[13]?.pressed&&(n=1),o[14]?.pressed&&(i=-1),o[15]?.pressed&&(i=1)}else if(t.axes.length>9){const o=t.axes[9];if(o>=-1.05&&o<=1.05){const l=Math.round((o+1)*3.5)%8,c=[0,1,1,1,0,-1,-1,-1][l],h=[-1,-1,0,1,1,1,0,-1][l];c&&(i=c),h&&(n=h)}}return rh(i,n)}poll(){this.prevKeys=new Set(this.keysSnapshot),this.keysSnapshot=new Set(this.keys);for(const e of this.tapped)this.keysSnapshot.add(e),this.prevKeys.has(e)&&!this.keys.has(e)&&this.prevKeys.delete(e);this.tapped.clear();for(let e=0;e<2;e++){const i=e===0?ur:dr,n=this.kb[e];n.prevDir=n.dir;const r=(this.anyKey(i.RIGHT)?1:0)-(this.anyKey(i.LEFT)?1:0),a=(this.anyKey(i.DOWN)?1:0)-(this.anyKey(i.UP)?1:0);if(n.dir=rh(r,a),n.menuDir=this.dirRepeat(n),this.keysSnapshot.size>this.prevKeys.size)for(const o of this.keysSnapshot)!this.prevKeys.has(o)&&Object.values(i).some(l=>l.includes(o))&&(this.lastDevice[e]="kb")}this.refreshPads();const t=navigator.getGamepads?navigator.getGamepads():[];for(const e of t){if(!e)continue;const i=this.pads.get(e.index);if(!i)continue;i.prevButtons=i.buttons,i.buttons=e.buttons.map(r=>r.pressed||r.value>.5),i.prevDir=i.dir,i.dir=this.readPadDir(e,i.standard),i.menuDir=this.dirRepeat(i);const n=this.slotPad.indexOf(e.index);if(n>=0&&(i.buttons.some((r,a)=>r&&!i.prevButtons[a])||i.dir!==5&&i.prevDir===5)&&(this.lastDevice[n]="pad"),this.captureCb){for(let r=0;r<i.buttons.length;r++)if(i.buttons[r]&&!i.prevButtons[r]){const a=this.captureCb;this.captureCb=null,a(e.index,r);break}}}}keysSnapshot=new Set;anyKey(t){return t.some(e=>this.keysSnapshot.has(e))}anyKeyPressed(t){return t.some(e=>this.keysSnapshot.has(e)&&!this.prevKeys.has(e))}keyPressed(t){return this.keysSnapshot.has(t)&&!this.prevKeys.has(t)}player(t){const e=t===0?ur:dr;let i=0,n=0;for(const o of ul)this.anyKey(e[o])&&(i|=Or[o]),this.anyKeyPressed(e[o])&&(n|=Or[o]);let r=this.kb[t].dir;const a=this.slotPad[t];if(a!==null){const o=this.pads.get(a);if(o){const l=this.bindingFor(a);for(const c of ul){const h=l[c];o.buttons[h]&&(i|=Or[c]),o.buttons[h]&&!o.prevButtons[h]&&(n|=Or[c])}o.dir!==5&&(r=o.dir)}}return{dir:r,held:i,pressed:n}}dirRepeat(t){return t.dir===5?(t.repeat=0,5):t.dir!==t.prevDir?(t.repeat=0,t.dir):(t.repeat++,t.repeat>22&&t.repeat%5===0?t.dir:5)}menu(t){const e={...Gf},i=t==="any"?[0,1]:[t],n=a=>{a!==5&&((a===8||a===7||a===9)&&(e.up=!0),(a===2||a===1||a===3)&&(e.down=!0),(a===4||a===7||a===1)&&(e.left=!0),(a===6||a===9||a===3)&&(e.right=!0))};for(const a of i){const o=a===0?ur:dr;n(this.kb[a].menuDir);const l=c=>this.anyKeyPressed(c);(l(o.LK)||l(o.LP)||a===0&&(this.keyPressed("Enter")||this.keyPressed("Space")))&&(e.confirm=!0),a===1&&(this.keyPressed("NumpadEnter")||this.keyPressed("Numpad1"))&&(e.confirm=!0),(l(o.HK)||a===0&&(this.keyPressed("Escape")||this.keyPressed("Backspace")))&&(e.back=!0),l(o.HP)&&(e.extra=!0),l(o.SP)&&(e.extra2=!0),l(o.START)&&(e.start=!0),l(o.TH)&&(e.l1=!0),l(o.UL)&&(e.r1=!0)}t==="any"&&this.keyPressed("Enter")&&(e.confirm=!0);const r=t==="any"?[...this.pads.keys()]:this.slotPad[t]!==null?[this.slotPad[t]]:[];for(const a of r){const o=this.pads.get(a);if(!o)continue;n(o.menuDir);const l=c=>!!o.buttons[c]&&!o.prevButtons[c];if(o.standard)l(0)&&(e.confirm=!0),l(1)&&(e.back=!0),l(3)&&(e.extra=!0),l(2)&&(e.extra2=!0),l(9)&&(e.start=!0),l(4)&&(e.l1=!0),l(5)&&(e.r1=!0);else{const c=o.kind==="dualsense"||o.kind==="dualshock";l(c?1:0)&&(e.confirm=!0),l(c?2:1)&&(e.back=!0),l(3)&&(e.extra=!0),l(c?0:2)&&(e.extra2=!0),l(9)&&(e.start=!0),l(4)&&(e.l1=!0),l(5)&&(e.r1=!0)}}return e.any=e.confirm||e.start||e.back||e.up||e.down||e.left||e.right||e.extra||e.extra2,e}anyPressed(){for(const t of this.keysSnapshot)if(!this.prevKeys.has(t))return!0;for(const t of this.pads.values())if(t.buttons.some((e,i)=>e&&!t.prevButtons[i]))return!0;return!1}rumble(t,e,i,n){if(!this.rumbleEnabled)return;const r=this.slotPad[t];if(r===null)return;const o=navigator.getGamepads?.()[r]?.vibrationActuator;if(o)try{o.playEffect("dual-rumble",{startDelay:0,duration:n,strongMagnitude:Math.min(1,e),weakMagnitude:Math.min(1,i)}).catch(()=>{})}catch{}}}const qf={LP:"□",HP:"△",LK:"✕",HK:"○",SP:"R1",UL:"R2",SS:"L1",TH:"L2",START:"OPTIONS",SELECT:"CREATE"},Kf={LP:"X",HP:"Y",LK:"A",HK:"B",SP:"RB",UL:"RT",SS:"LB",TH:"LT",START:"MENU",SELECT:"VIEW"};function Ps(s){return s.replace("Key","").replace("Numpad","Num ").replace("Arrow","").replace("Space","Space")}function $f(s,t,e=0){return t==="ps"?qf[s]:t==="xbox"?Kf[s]:Ps((e===0?ur:dr)[s][0])}function Yf(s,t){if(t!=="ps")return"g-key";switch(s){case"LP":return"g-square";case"HP":return"g-triangle";case"LK":return"g-cross";case"HK":return"g-circle";default:return"g-shoulder"}}const oh={difficulty:1,roundsToWin:2,roundTime:99,masterVolume:.8,musicVolume:.5,sfxVolume:.8,announcer:!0,rumble:!0,showHitboxes:!1,inputDisplay:!1,quality:"high",faces:"photo"},td="skf.settings";function Zf(){try{const s=localStorage.getItem(td);if(s)return{...oh,...JSON.parse(s)}}catch{}return{...oh}}function Jf(s){try{localStorage.setItem(td,JSON.stringify(s))}catch{}}const ao=60,jf=.02,Is=.6,Qf=.0125*Is*Is,Pa=.15,Ds=9,tp=.3,ep=1e3,yr=100,dl=100,ip=.25,np=16,oo=70,ed=20,fl=18,lh=38,sp=9,lo=14,ch=8,rp=18;function hh(s){return s<=1?1:Math.max(.3,1-(s-1)*.1)}const pc="186",ap=0,uh=1,op=2,fr=1,lp=2,or=3,ts=0,Je=1,fi=2,gn=0,pr=1,Ra=2,dh=3,fh=4,cp=5,Rs=100,hp=101,up=102,dp=103,fp=104,pp=200,mp=201,gp=202,vp=203,id=204,nd=205,xp=206,_p=207,yp=208,Mp=209,Sp=210,bp=211,wp=212,Ep=213,Tp=214,pl=0,ml=1,gl=2,Mr=3,vl=4,xl=5,_l=6,yl=7,sd=0,Ap=1,Cp=2,ji=0,rd=1,ad=2,od=3,Ka=4,ld=5,cd=6,hd=7,ud=300,es=301,Os=302,co=303,ho=304,$a=306,La=1e3,pn=1001,Ml=1002,qe=1003,Pp=1004,Br=1005,si=1006,uo=1007,Jn=1008,bi=1009,dd=1010,fd=1011,Sr=1012,mc=1013,Qi=1014,Di=1015,tn=1016,gc=1017,vc=1018,br=1020,pd=35902,md=35899,gd=1021,vd=1022,Ci=1023,yn=1026,jn=1027,xc=1028,_c=1029,is=1030,yc=1031,Mc=1033,Ma=33776,Sa=33777,ba=33778,wa=33779,Sl=35840,bl=35841,wl=35842,El=35843,Tl=36196,Al=37492,Cl=37496,Pl=37488,Rl=37489,ka=37490,Ll=37491,kl=37808,Il=37809,Dl=37810,Ul=37811,Fl=37812,Nl=37813,Ol=37814,Bl=37815,zl=37816,Hl=37817,Gl=37818,Vl=37819,Wl=37820,Xl=37821,ql=36492,Kl=36494,$l=36495,Yl=36283,Zl=36284,Ia=36285,Jl=36286,Rp=3200,Da=0,Lp=1,Dn="",je="srgb",Ua="srgb-linear",Fa="linear",we="srgb",fo=7680,kp=519,Ip=512,Dp=513,Up=514,Sc=515,Fp=516,Np=517,bc=518,Op=519,xd=35044,Bp=35048,ph="300 es",Ji=2e3,wr=2001;function zp(s){for(let t=s.length-1;t>=0;--t)if(s[t]>=65535)return!0;return!1}function Na(s){return document.createElementNS("http://www.w3.org/1999/xhtml",s)}function Hp(){const s=Na("canvas");return s.style.display="block",s}const mh={};function Oa(...s){const t="THREE."+s.shift();console.log(t,...s)}function _d(s){const t=s[0];if(typeof t=="string"&&t.startsWith("TSL:")){const e=s[1];e&&e.isStackTrace?s[0]+=" "+e.getLocation():s[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return s}function Qt(...s){s=_d(s);const t="THREE."+s.shift();{const e=s[0];e&&e.isStackTrace?console.warn(e.getError(t)):console.warn(t,...s)}}function me(...s){s=_d(s);const t="THREE."+s.shift();{const e=s[0];e&&e.isStackTrace?console.error(e.getError(t)):console.error(t,...s)}}function Us(...s){const t=s.join(" ");t in mh||(mh[t]=!0,Qt(...s))}function Gp(s,t,e){return new Promise(function(i,n){function r(){switch(s.clientWaitSync(t,s.SYNC_FLUSH_COMMANDS_BIT,0)){case s.WAIT_FAILED:n();break;case s.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:i()}}setTimeout(r,e)})}const Vp={[pl]:ml,[gl]:_l,[vl]:yl,[Mr]:xl,[ml]:pl,[_l]:gl,[yl]:vl,[xl]:Mr};class ss{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[t]===void 0&&(i[t]=[]),i[t].indexOf(e)===-1&&i[t].push(e)}hasEventListener(t,e){const i=this._listeners;return i===void 0?!1:i[t]!==void 0&&i[t].indexOf(e)!==-1}removeEventListener(t,e){const i=this._listeners;if(i===void 0)return;const n=i[t];if(n!==void 0){const r=n.indexOf(e);r!==-1&&n.splice(r,1)}}dispatchEvent(t){const e=this._listeners;if(e===void 0)return;const i=e[t.type];if(i!==void 0){t.target=this;const n=i.slice(0);for(let r=0,a=n.length;r<a;r++)n[r].call(this,t);t.target=null}}}const ti=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],po=Math.PI/180,jl=180/Math.PI;function vn(){const s=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(ti[s&255]+ti[s>>8&255]+ti[s>>16&255]+ti[s>>24&255]+"-"+ti[t&255]+ti[t>>8&255]+"-"+ti[t>>16&15|64]+ti[t>>24&255]+"-"+ti[e&63|128]+ti[e>>8&255]+"-"+ti[e>>16&255]+ti[e>>24&255]+ti[i&255]+ti[i>>8&255]+ti[i>>16&255]+ti[i>>24&255]).toLowerCase()}function ue(s,t,e){return Math.max(t,Math.min(e,s))}function Wp(s,t){return(s%t+t)%t}function mo(s,t,e){return(1-e)*s+e*t}function Zi(s,t){switch(t.constructor){case Float32Array:return s;case Uint32Array:return s/4294967295;case Uint16Array:return s/65535;case Uint8Array:case Uint8ClampedArray:return s/255;case Int32Array:return Math.max(s/2147483647,-1);case Int16Array:return Math.max(s/32767,-1);case Int8Array:return Math.max(s/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function Ae(s,t){switch(t.constructor){case Float32Array:return s;case Uint32Array:return Math.round(s*4294967295);case Uint16Array:return Math.round(s*65535);case Uint8Array:case Uint8ClampedArray:return Math.round(s*255);case Int32Array:return Math.round(s*2147483647);case Int16Array:return Math.round(s*32767);case Int8Array:return Math.round(s*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}const Wc=class Wc{constructor(t=0,e=0){this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("THREE.Vector2: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,i=this.y,n=t.elements;return this.x=n[0]*e+n[3]*i+n[6],this.y=n[1]*e+n[4]*i+n[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=ue(this.x,t.x,e.x),this.y=ue(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=ue(this.x,t,e),this.y=ue(this.y,t,e),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(ue(i,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(ue(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y;return e*e+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const i=Math.cos(e),n=Math.sin(e),r=this.x-t.x,a=this.y-t.y;return this.x=r*i-a*n+t.x,this.y=r*n+a*i+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};Wc.prototype.isVector2=!0;let ot=Wc;class nn{constructor(t=0,e=0,i=0,n=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=i,this._w=n}static slerpFlat(t,e,i,n,r,a,o){let l=i[n+0],c=i[n+1],h=i[n+2],f=i[n+3],u=r[a+0],d=r[a+1],p=r[a+2],x=r[a+3];if(f!==x||l!==u||c!==d||h!==p){let m=l*u+c*d+h*p+f*x;m<0&&(u=-u,d=-d,p=-p,x=-x,m=-m);let g=1-o;if(m<.9995){const b=Math.acos(m),A=Math.sin(b);g=Math.sin(g*b)/A,o=Math.sin(o*b)/A,l=l*g+u*o,c=c*g+d*o,h=h*g+p*o,f=f*g+x*o}else{l=l*g+u*o,c=c*g+d*o,h=h*g+p*o,f=f*g+x*o;const b=1/Math.sqrt(l*l+c*c+h*h+f*f);l*=b,c*=b,h*=b,f*=b}}t[e]=l,t[e+1]=c,t[e+2]=h,t[e+3]=f}static multiplyQuaternionsFlat(t,e,i,n,r,a){const o=i[n],l=i[n+1],c=i[n+2],h=i[n+3],f=r[a],u=r[a+1],d=r[a+2],p=r[a+3];return t[e]=o*p+h*f+l*d-c*u,t[e+1]=l*p+h*u+c*f-o*d,t[e+2]=c*p+h*d+o*u-l*f,t[e+3]=h*p-o*f-l*u-c*d,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,i,n){return this._x=t,this._y=e,this._z=i,this._w=n,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const i=t._x,n=t._y,r=t._z,a=t._order,o=Math.cos,l=Math.sin,c=o(i/2),h=o(n/2),f=o(r/2),u=l(i/2),d=l(n/2),p=l(r/2);switch(a){case"XYZ":this._x=u*h*f+c*d*p,this._y=c*d*f-u*h*p,this._z=c*h*p+u*d*f,this._w=c*h*f-u*d*p;break;case"YXZ":this._x=u*h*f+c*d*p,this._y=c*d*f-u*h*p,this._z=c*h*p-u*d*f,this._w=c*h*f+u*d*p;break;case"ZXY":this._x=u*h*f-c*d*p,this._y=c*d*f+u*h*p,this._z=c*h*p+u*d*f,this._w=c*h*f-u*d*p;break;case"ZYX":this._x=u*h*f-c*d*p,this._y=c*d*f+u*h*p,this._z=c*h*p-u*d*f,this._w=c*h*f+u*d*p;break;case"YZX":this._x=u*h*f+c*d*p,this._y=c*d*f+u*h*p,this._z=c*h*p-u*d*f,this._w=c*h*f-u*d*p;break;case"XZY":this._x=u*h*f-c*d*p,this._y=c*d*f-u*h*p,this._z=c*h*p+u*d*f,this._w=c*h*f+u*d*p;break;default:Qt("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const i=e/2,n=Math.sin(i);return this._x=t.x*n,this._y=t.y*n,this._z=t.z*n,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,i=e[0],n=e[4],r=e[8],a=e[1],o=e[5],l=e[9],c=e[2],h=e[6],f=e[10],u=i+o+f;if(u>0){const d=.5/Math.sqrt(u+1);this._w=.25/d,this._x=(h-l)*d,this._y=(r-c)*d,this._z=(a-n)*d}else if(i>o&&i>f){const d=2*Math.sqrt(1+i-o-f);this._w=(h-l)/d,this._x=.25*d,this._y=(n+a)/d,this._z=(r+c)/d}else if(o>f){const d=2*Math.sqrt(1+o-i-f);this._w=(r-c)/d,this._x=(n+a)/d,this._y=.25*d,this._z=(l+h)/d}else{const d=2*Math.sqrt(1+f-i-o);this._w=(a-n)/d,this._x=(r+c)/d,this._y=(l+h)/d,this._z=.25*d}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let i=t.dot(e)+1;return i<1e-8?(i=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=i):(this._x=0,this._y=-t.z,this._z=t.y,this._w=i)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=i),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(ue(this.dot(t),-1,1)))}rotateTowards(t,e){const i=this.angleTo(t);if(i===0)return this;const n=Math.min(1,e/i);return this.slerp(t,n),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const i=t._x,n=t._y,r=t._z,a=t._w,o=e._x,l=e._y,c=e._z,h=e._w;return this._x=i*h+a*o+n*c-r*l,this._y=n*h+a*l+r*o-i*c,this._z=r*h+a*c+i*l-n*o,this._w=a*h-i*o-n*l-r*c,this._onChangeCallback(),this}slerp(t,e){let i=t._x,n=t._y,r=t._z,a=t._w,o=this.dot(t);o<0&&(i=-i,n=-n,r=-r,a=-a,o=-o);let l=1-e;if(o<.9995){const c=Math.acos(o),h=Math.sin(c);l=Math.sin(l*c)/h,e=Math.sin(e*c)/h,this._x=this._x*l+i*e,this._y=this._y*l+n*e,this._z=this._z*l+r*e,this._w=this._w*l+a*e,this._onChangeCallback()}else this._x=this._x*l+i*e,this._y=this._y*l+n*e,this._z=this._z*l+r*e,this._w=this._w*l+a*e,this.normalize();return this}slerpQuaternions(t,e,i){return this.copy(t).slerp(e,i)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),i=Math.random(),n=Math.sqrt(1-i),r=Math.sqrt(i);return this.set(n*Math.sin(t),n*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}const Xc=class Xc{constructor(t=0,e=0,i=0){this.x=t,this.y=e,this.z=i}set(t,e,i){return i===void 0&&(i=this.z),this.x=t,this.y=e,this.z=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("THREE.Vector3: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(gh.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(gh.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,i=this.y,n=this.z,r=t.elements;return this.x=r[0]*e+r[3]*i+r[6]*n,this.y=r[1]*e+r[4]*i+r[7]*n,this.z=r[2]*e+r[5]*i+r[8]*n,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,i=this.y,n=this.z,r=t.elements,a=1/(r[3]*e+r[7]*i+r[11]*n+r[15]);return this.x=(r[0]*e+r[4]*i+r[8]*n+r[12])*a,this.y=(r[1]*e+r[5]*i+r[9]*n+r[13])*a,this.z=(r[2]*e+r[6]*i+r[10]*n+r[14])*a,this}applyQuaternion(t){const e=this.x,i=this.y,n=this.z,r=t.x,a=t.y,o=t.z,l=t.w,c=2*(a*n-o*i),h=2*(o*e-r*n),f=2*(r*i-a*e);return this.x=e+l*c+a*f-o*h,this.y=i+l*h+o*c-r*f,this.z=n+l*f+r*h-a*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,i=this.y,n=this.z,r=t.elements;return this.x=r[0]*e+r[4]*i+r[8]*n,this.y=r[1]*e+r[5]*i+r[9]*n,this.z=r[2]*e+r[6]*i+r[10]*n,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=ue(this.x,t.x,e.x),this.y=ue(this.y,t.y,e.y),this.z=ue(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=ue(this.x,t,e),this.y=ue(this.y,t,e),this.z=ue(this.z,t,e),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(ue(i,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const i=t.x,n=t.y,r=t.z,a=e.x,o=e.y,l=e.z;return this.x=n*l-r*o,this.y=r*a-i*l,this.z=i*o-n*a,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const i=t.dot(this)/e;return this.copy(t).multiplyScalar(i)}projectOnPlane(t){return go.copy(this).projectOnVector(t),this.sub(go)}reflect(t){return this.sub(go.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(ue(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y,n=this.z-t.z;return e*e+i*i+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,i){const n=Math.sin(e)*t;return this.x=n*Math.sin(i),this.y=Math.cos(e)*t,this.z=n*Math.cos(i),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,i){return this.x=t*Math.sin(e),this.y=i,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),i=this.setFromMatrixColumn(t,1).length(),n=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=i,this.z=n,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,i=Math.sqrt(1-e*e);return this.x=i*Math.cos(t),this.y=e,this.z=i*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};Xc.prototype.isVector3=!0;let R=Xc;const go=new R,gh=new nn,qc=class qc{constructor(t,e,i,n,r,a,o,l,c){this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,i,n,r,a,o,l,c)}set(t,e,i,n,r,a,o,l,c){const h=this.elements;return h[0]=t,h[1]=n,h[2]=o,h[3]=e,h[4]=r,h[5]=l,h[6]=i,h[7]=a,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],this}extractBasis(t,e,i){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,n=e.elements,r=this.elements,a=i[0],o=i[3],l=i[6],c=i[1],h=i[4],f=i[7],u=i[2],d=i[5],p=i[8],x=n[0],m=n[3],g=n[6],b=n[1],A=n[4],y=n[7],E=n[2],M=n[5],T=n[8];return r[0]=a*x+o*b+l*E,r[3]=a*m+o*A+l*M,r[6]=a*g+o*y+l*T,r[1]=c*x+h*b+f*E,r[4]=c*m+h*A+f*M,r[7]=c*g+h*y+f*T,r[2]=u*x+d*b+p*E,r[5]=u*m+d*A+p*M,r[8]=u*g+d*y+p*T,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[1],n=t[2],r=t[3],a=t[4],o=t[5],l=t[6],c=t[7],h=t[8];return e*a*h-e*o*c-i*r*h+i*o*l+n*r*c-n*a*l}invert(){const t=this.elements,e=t[0],i=t[1],n=t[2],r=t[3],a=t[4],o=t[5],l=t[6],c=t[7],h=t[8],f=h*a-o*c,u=o*l-h*r,d=c*r-a*l,p=e*f+i*u+n*d;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);const x=1/p;return t[0]=f*x,t[1]=(n*c-h*i)*x,t[2]=(o*i-n*a)*x,t[3]=u*x,t[4]=(h*e-n*l)*x,t[5]=(n*r-o*e)*x,t[6]=d*x,t[7]=(i*l-c*e)*x,t[8]=(a*e-i*r)*x,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,i,n,r,a,o){const l=Math.cos(r),c=Math.sin(r);return this.set(i*l,i*c,-i*(l*a+c*o)+a+t,-n*c,n*l,-n*(-c*a+l*o)+o+e,0,0,1),this}scale(t,e){return Us("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(vo.makeScale(t,e)),this}rotate(t){return Us("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(vo.makeRotation(-t)),this}translate(t,e){return Us("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(vo.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,i,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,i=t.elements;for(let n=0;n<9;n++)if(e[n]!==i[n])return!1;return!0}fromArray(t,e=0){for(let i=0;i<9;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t}clone(){return new this.constructor().fromArray(this.elements)}};qc.prototype.isMatrix3=!0;let ne=qc;const vo=new ne,vh=new ne().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),xh=new ne().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Xp(){const s={enabled:!0,workingColorSpace:Ua,spaces:{},convert:function(n,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===we&&(n.r=xn(n.r),n.g=xn(n.g),n.b=xn(n.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(n.applyMatrix3(this.spaces[r].toXYZ),n.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===we&&(n.r=Fs(n.r),n.g=Fs(n.g),n.b=Fs(n.b))),n},workingToColorSpace:function(n,r){return this.convert(n,this.workingColorSpace,r)},colorSpaceToWorking:function(n,r){return this.convert(n,r,this.workingColorSpace)},getPrimaries:function(n){return this.spaces[n].primaries},getTransfer:function(n){return n===Dn?Fa:this.spaces[n].transfer},getToneMappingMode:function(n){return this.spaces[n].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(n,r=this.workingColorSpace){return n.fromArray(this.spaces[r].luminanceCoefficients)},define:function(n){Object.assign(this.spaces,n)},_getMatrix:function(n,r,a){return n.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(n){return this.spaces[n].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(n=this.workingColorSpace){return this.spaces[n].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(n,r){return Us("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),s.workingToColorSpace(n,r)},toWorkingColorSpace:function(n,r){return Us("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),s.colorSpaceToWorking(n,r)}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],i=[.3127,.329];return s.define({[Ua]:{primaries:t,whitePoint:i,transfer:Fa,toXYZ:vh,fromXYZ:xh,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:je},outputColorSpaceConfig:{drawingBufferColorSpace:je}},[je]:{primaries:t,whitePoint:i,transfer:we,toXYZ:vh,fromXYZ:xh,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:je}}}),s}const de=Xp();function xn(s){return s<.04045?s*.0773993808:Math.pow(s*.9478672986+.0521327014,2.4)}function Fs(s){return s<.0031308?s*12.92:1.055*Math.pow(s,.41666)-.055}let cs;class qp{static getDataURL(t,e="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let i;if(t instanceof HTMLCanvasElement)i=t;else{cs===void 0&&(cs=Na("canvas")),cs.width=t.width,cs.height=t.height;const n=cs.getContext("2d");t instanceof ImageData?n.putImageData(t,0,0):n.drawImage(t,0,0,t.width,t.height),i=cs}return i.toDataURL(e)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=Na("canvas");e.width=t.width,e.height=t.height;const i=e.getContext("2d");i.drawImage(t,0,0,t.width,t.height);const n=i.getImageData(0,0,t.width,t.height),r=n.data;for(let a=0;a<r.length;a++)r[a]=xn(r[a]/255)*255;return i.putImageData(n,0,0),e}else if(t.data){const e=t.data.slice(0);for(let i=0;i<e.length;i++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[i]=Math.floor(xn(e[i]/255)*255):e[i]=xn(e[i]);return{data:e,width:t.width,height:t.height}}else return Qt("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let Kp=0;class wc{constructor(t=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:Kp++}),this.uuid=vn(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){const e=this.data;return typeof HTMLVideoElement<"u"&&e instanceof HTMLVideoElement?t.set(e.videoWidth,e.videoHeight,0):typeof VideoFrame<"u"&&e instanceof VideoFrame?t.set(e.displayWidth,e.displayHeight,0):e!==null?t.set(e.width,e.height,e.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const i={uuid:this.uuid,url:""},n=this.data;if(n!==null){let r;if(Array.isArray(n)){r=[];for(let a=0,o=n.length;a<o;a++)n[a].isDataTexture?r.push(xo(n[a].image)):r.push(xo(n[a]))}else r=xo(n);i.url=r}return e||(t.images[this.uuid]=i),i}}function xo(s){return typeof HTMLImageElement<"u"&&s instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&s instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&s instanceof ImageBitmap?qp.getDataURL(s):s.data?{data:Array.from(s.data),width:s.width,height:s.height,type:s.data.constructor.name}:(Qt("Texture: Unable to serialize Texture."),{})}let $p=0;const _o=new R;class ri extends ss{constructor(t=ri.DEFAULT_IMAGE,e=ri.DEFAULT_MAPPING,i=pn,n=pn,r=si,a=Jn,o=Ci,l=bi,c=ri.DEFAULT_ANISOTROPY,h=Dn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:$p++}),this.uuid=vn(),this.name="",this.source=new wc(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=i,this.wrapT=n,this.magFilter=r,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new ot(0,0),this.repeat=new ot(1,1),this.center=new ot(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new ne,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(_o).x}get height(){return this.source.getSize(_o).y}get depth(){return this.source.getSize(_o).z}get image(){return this.source.data}set image(t){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.normalized=t.normalized,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(const e in t){const i=t[e];if(i===void 0){Qt(`Texture.setValues(): parameter '${e}' has value of undefined.`);continue}const n=this[e];if(n===void 0){Qt(`Texture.setValues(): property '${e}' does not exist.`);continue}n&&i&&n.isVector2&&i.isVector2||n&&i&&n.isVector3&&i.isVector3||n&&i&&n.isMatrix3&&i.isMatrix3?n.copy(i):this[e]=i}}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),e||(t.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==ud)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case La:t.x=t.x-Math.floor(t.x);break;case pn:t.x=t.x<0?0:1;break;case Ml:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case La:t.y=t.y-Math.floor(t.y);break;case pn:t.y=t.y<0?0:1;break;case Ml:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}ri.DEFAULT_IMAGE=null;ri.DEFAULT_MAPPING=ud;ri.DEFAULT_ANISOTROPY=1;const Kc=class Kc{constructor(t=0,e=0,i=0,n=1){this.x=t,this.y=e,this.z=i,this.w=n}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,i,n){return this.x=t,this.y=e,this.z=i,this.w=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("THREE.Vector4: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,i=this.y,n=this.z,r=this.w,a=t.elements;return this.x=a[0]*e+a[4]*i+a[8]*n+a[12]*r,this.y=a[1]*e+a[5]*i+a[9]*n+a[13]*r,this.z=a[2]*e+a[6]*i+a[10]*n+a[14]*r,this.w=a[3]*e+a[7]*i+a[11]*n+a[15]*r,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,i,n,r;const l=t.elements,c=l[0],h=l[4],f=l[8],u=l[1],d=l[5],p=l[9],x=l[2],m=l[6],g=l[10];if(Math.abs(h-u)<.01&&Math.abs(f-x)<.01&&Math.abs(p-m)<.01){if(Math.abs(h+u)<.1&&Math.abs(f+x)<.1&&Math.abs(p+m)<.1&&Math.abs(c+d+g-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const A=(c+1)/2,y=(d+1)/2,E=(g+1)/2,M=(h+u)/4,T=(f+x)/4,v=(p+m)/4;return A>y&&A>E?A<.01?(i=0,n=.707106781,r=.707106781):(i=Math.sqrt(A),n=M/i,r=T/i):y>E?y<.01?(i=.707106781,n=0,r=.707106781):(n=Math.sqrt(y),i=M/n,r=v/n):E<.01?(i=.707106781,n=.707106781,r=0):(r=Math.sqrt(E),i=T/r,n=v/r),this.set(i,n,r,e),this}let b=Math.sqrt((m-p)*(m-p)+(f-x)*(f-x)+(u-h)*(u-h));return Math.abs(b)<.001&&(b=1),this.x=(m-p)/b,this.y=(f-x)/b,this.z=(u-h)/b,this.w=Math.acos((c+d+g-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=ue(this.x,t.x,e.x),this.y=ue(this.y,t.y,e.y),this.z=ue(this.z,t.z,e.z),this.w=ue(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=ue(this.x,t,e),this.y=ue(this.y,t,e),this.z=ue(this.z,t,e),this.w=ue(this.w,t,e),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(ue(i,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this.w=t.w+(e.w-t.w)*i,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};Kc.prototype.isVector4=!0;let Ue=Kc;class Yp extends ss{constructor(t=1,e=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:si,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},i),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=i.depth,this.scissor=new Ue(0,0,t,e),this.scissorTest=!1,this.viewport=new Ue(0,0,t,e),this.textures=[];const n={width:t,height:e,depth:i.depth},r=new ri(n),a=i.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveColorBuffer=i.resolveColorBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.storeMultisampledColorBuffer=i.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=i.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=i.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview,this.useArrayDepthTexture=i.useArrayDepthTexture}_setTextureOptions(t={}){const e={minFilter:si,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(e.mapping=t.mapping),t.wrapS!==void 0&&(e.wrapS=t.wrapS),t.wrapT!==void 0&&(e.wrapT=t.wrapT),t.wrapR!==void 0&&(e.wrapR=t.wrapR),t.magFilter!==void 0&&(e.magFilter=t.magFilter),t.minFilter!==void 0&&(e.minFilter=t.minFilter),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.anisotropy!==void 0&&(e.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),t.internalFormat!==void 0&&(e.internalFormat=t.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(e)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),t!==null&&t.renderTarget===null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,e,i=1){if(this.width!==t||this.height!==e||this.depth!==i){this.width=t,this.height=e,this.depth=i;for(let n=0,r=this.textures.length;n<r;n++)this.textures[n].image.width=t,this.textures[n].image.height=e,this.textures[n].image.depth=i,this.textures[n].isData3DTexture!==!0&&(this.textures[n].isArrayTexture=this.textures[n].image.depth>1);this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let e=0,i=t.textures.length;e<i;e++){this.textures[e]=t.textures[e].clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;const n=Object.assign({},t.textures[e].image);this.textures[e].source=new wc(n)}if(this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveColorBuffer=t.resolveColorBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,this.storeMultisampledColorBuffer=t.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=t.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=t.storeMultisampledStencilBuffer,t.depthTexture!==null)if(t.depthTexture.renderTarget===t){const e=t.depthTexture.clone();e.renderTarget=null,this.depthTexture=e}else this.depthTexture=t.depthTexture;return this.samples=t.samples,this.multiview=t.multiview,this.useArrayDepthTexture=t.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Ui extends Yp{constructor(t=1,e=1,i={}){super(t,e,i),this.isWebGLRenderTarget=!0}}class yd extends ri{constructor(t=null,e=1,i=1,n=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:i,depth:n},this.magFilter=qe,this.minFilter=qe,this.wrapR=pn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(t){return super.copy(t),this.wrapR=t.wrapR,this}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class Zp extends ri{constructor(t=null,e=1,i=1,n=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:i,depth:n},this.magFilter=qe,this.minFilter=qe,this.wrapR=pn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(t){return super.copy(t),this.wrapR=t.wrapR,this}}const qa=class qa{constructor(t,e,i,n,r,a,o,l,c,h,f,u,d,p,x,m){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,i,n,r,a,o,l,c,h,f,u,d,p,x,m)}set(t,e,i,n,r,a,o,l,c,h,f,u,d,p,x,m){const g=this.elements;return g[0]=t,g[4]=e,g[8]=i,g[12]=n,g[1]=r,g[5]=a,g[9]=o,g[13]=l,g[2]=c,g[6]=h,g[10]=f,g[14]=u,g[3]=d,g[7]=p,g[11]=x,g[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new qa().fromArray(this.elements)}copy(t){const e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],e[9]=i[9],e[10]=i[10],e[11]=i[11],e[12]=i[12],e[13]=i[13],e[14]=i[14],e[15]=i[15],this}copyPosition(t){const e=this.elements,i=t.elements;return e[12]=i[12],e[13]=i[13],e[14]=i[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,i){return this.determinantAffine()===0?(t.set(1,0,0),e.set(0,1,0),i.set(0,0,1),this):(t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this)}makeBasis(t,e,i){return this.set(t.x,e.x,i.x,0,t.y,e.y,i.y,0,t.z,e.z,i.z,0,0,0,0,1),this}extractRotation(t){if(t.determinantAffine()===0)return this.identity();const e=this.elements,i=t.elements,n=1/hs.setFromMatrixColumn(t,0).length(),r=1/hs.setFromMatrixColumn(t,1).length(),a=1/hs.setFromMatrixColumn(t,2).length();return e[0]=i[0]*n,e[1]=i[1]*n,e[2]=i[2]*n,e[3]=0,e[4]=i[4]*r,e[5]=i[5]*r,e[6]=i[6]*r,e[7]=0,e[8]=i[8]*a,e[9]=i[9]*a,e[10]=i[10]*a,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,i=t.x,n=t.y,r=t.z,a=Math.cos(i),o=Math.sin(i),l=Math.cos(n),c=Math.sin(n),h=Math.cos(r),f=Math.sin(r);if(t.order==="XYZ"){const u=a*h,d=a*f,p=o*h,x=o*f;e[0]=l*h,e[4]=-l*f,e[8]=c,e[1]=d+p*c,e[5]=u-x*c,e[9]=-o*l,e[2]=x-u*c,e[6]=p+d*c,e[10]=a*l}else if(t.order==="YXZ"){const u=l*h,d=l*f,p=c*h,x=c*f;e[0]=u+x*o,e[4]=p*o-d,e[8]=a*c,e[1]=a*f,e[5]=a*h,e[9]=-o,e[2]=d*o-p,e[6]=x+u*o,e[10]=a*l}else if(t.order==="ZXY"){const u=l*h,d=l*f,p=c*h,x=c*f;e[0]=u-x*o,e[4]=-a*f,e[8]=p+d*o,e[1]=d+p*o,e[5]=a*h,e[9]=x-u*o,e[2]=-a*c,e[6]=o,e[10]=a*l}else if(t.order==="ZYX"){const u=a*h,d=a*f,p=o*h,x=o*f;e[0]=l*h,e[4]=p*c-d,e[8]=u*c+x,e[1]=l*f,e[5]=x*c+u,e[9]=d*c-p,e[2]=-c,e[6]=o*l,e[10]=a*l}else if(t.order==="YZX"){const u=a*l,d=a*c,p=o*l,x=o*c;e[0]=l*h,e[4]=x-u*f,e[8]=p*f+d,e[1]=f,e[5]=a*h,e[9]=-o*h,e[2]=-c*h,e[6]=d*f+p,e[10]=u-x*f}else if(t.order==="XZY"){const u=a*l,d=a*c,p=o*l,x=o*c;e[0]=l*h,e[4]=-f,e[8]=c*h,e[1]=u*f+x,e[5]=a*h,e[9]=d*f-p,e[2]=p*f-d,e[6]=o*h,e[10]=x*f+u}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Jp,t,jp)}lookAt(t,e,i){const n=this.elements;return yi.subVectors(t,e),yi.lengthSq()===0&&(yi.z=1),yi.normalize(),En.crossVectors(i,yi),En.lengthSq()===0&&(Math.abs(i.z)===1?yi.x+=1e-4:yi.z+=1e-4,yi.normalize(),En.crossVectors(i,yi)),En.normalize(),zr.crossVectors(yi,En),n[0]=En.x,n[4]=zr.x,n[8]=yi.x,n[1]=En.y,n[5]=zr.y,n[9]=yi.y,n[2]=En.z,n[6]=zr.z,n[10]=yi.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,n=e.elements,r=this.elements,a=i[0],o=i[4],l=i[8],c=i[12],h=i[1],f=i[5],u=i[9],d=i[13],p=i[2],x=i[6],m=i[10],g=i[14],b=i[3],A=i[7],y=i[11],E=i[15],M=n[0],T=n[4],v=n[8],w=n[12],P=n[1],L=n[5],U=n[9],B=n[13],F=n[2],O=n[6],$=n[10],V=n[14],nt=n[3],X=n[7],Q=n[11],j=n[15];return r[0]=a*M+o*P+l*F+c*nt,r[4]=a*T+o*L+l*O+c*X,r[8]=a*v+o*U+l*$+c*Q,r[12]=a*w+o*B+l*V+c*j,r[1]=h*M+f*P+u*F+d*nt,r[5]=h*T+f*L+u*O+d*X,r[9]=h*v+f*U+u*$+d*Q,r[13]=h*w+f*B+u*V+d*j,r[2]=p*M+x*P+m*F+g*nt,r[6]=p*T+x*L+m*O+g*X,r[10]=p*v+x*U+m*$+g*Q,r[14]=p*w+x*B+m*V+g*j,r[3]=b*M+A*P+y*F+E*nt,r[7]=b*T+A*L+y*O+E*X,r[11]=b*v+A*U+y*$+E*Q,r[15]=b*w+A*B+y*V+E*j,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[4],n=t[8],r=t[12],a=t[1],o=t[5],l=t[9],c=t[13],h=t[2],f=t[6],u=t[10],d=t[14],p=t[3],x=t[7],m=t[11],g=t[15],b=l*d-c*u,A=o*d-c*f,y=o*u-l*f,E=a*d-c*h,M=a*u-l*h,T=a*f-o*h;return e*(x*b-m*A+g*y)-i*(p*b-m*E+g*M)+n*(p*A-x*E+g*T)-r*(p*y-x*M+m*T)}determinantAffine(){const t=this.elements,e=t[0],i=t[4],n=t[8],r=t[1],a=t[5],o=t[9],l=t[2],c=t[6],h=t[10];return e*(a*h-o*c)-i*(r*h-o*l)+n*(r*c-a*l)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,i){const n=this.elements;return t.isVector3?(n[12]=t.x,n[13]=t.y,n[14]=t.z):(n[12]=t,n[13]=e,n[14]=i),this}invert(){const t=this.elements,e=t[0],i=t[1],n=t[2],r=t[3],a=t[4],o=t[5],l=t[6],c=t[7],h=t[8],f=t[9],u=t[10],d=t[11],p=t[12],x=t[13],m=t[14],g=t[15],b=e*o-i*a,A=e*l-n*a,y=e*c-r*a,E=i*l-n*o,M=i*c-r*o,T=n*c-r*l,v=h*x-f*p,w=h*m-u*p,P=h*g-d*p,L=f*m-u*x,U=f*g-d*x,B=u*g-d*m,F=b*B-A*U+y*L+E*P-M*w+T*v;if(F===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const O=1/F;return t[0]=(o*B-l*U+c*L)*O,t[1]=(n*U-i*B-r*L)*O,t[2]=(x*T-m*M+g*E)*O,t[3]=(u*M-f*T-d*E)*O,t[4]=(l*P-a*B-c*w)*O,t[5]=(e*B-n*P+r*w)*O,t[6]=(m*y-p*T-g*A)*O,t[7]=(h*T-u*y+d*A)*O,t[8]=(a*U-o*P+c*v)*O,t[9]=(i*P-e*U-r*v)*O,t[10]=(p*M-x*y+g*b)*O,t[11]=(f*y-h*M-d*b)*O,t[12]=(o*w-a*L-l*v)*O,t[13]=(e*L-i*w+n*v)*O,t[14]=(x*A-p*E-m*b)*O,t[15]=(h*E-f*A+u*b)*O,this}scale(t){const e=this.elements,i=t.x,n=t.y,r=t.z;return e[0]*=i,e[4]*=n,e[8]*=r,e[1]*=i,e[5]*=n,e[9]*=r,e[2]*=i,e[6]*=n,e[10]*=r,e[3]*=i,e[7]*=n,e[11]*=r,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],i=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],n=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,i,n))}makeTranslation(t,e,i){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,i,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),i=Math.sin(t);return this.set(1,0,0,0,0,e,-i,0,0,i,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,0,i,0,0,1,0,0,-i,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,0,i,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const i=Math.cos(e),n=Math.sin(e),r=1-i,a=t.x,o=t.y,l=t.z,c=r*a,h=r*o;return this.set(c*a+i,c*o-n*l,c*l+n*o,0,c*o+n*l,h*o+i,h*l-n*a,0,c*l-n*o,h*l+n*a,r*l*l+i,0,0,0,0,1),this}makeScale(t,e,i){return this.set(t,0,0,0,0,e,0,0,0,0,i,0,0,0,0,1),this}makeShear(t,e,i,n,r,a){return this.set(1,i,r,0,t,1,a,0,e,n,1,0,0,0,0,1),this}compose(t,e,i){const n=this.elements,r=e._x,a=e._y,o=e._z,l=e._w,c=r+r,h=a+a,f=o+o,u=r*c,d=r*h,p=r*f,x=a*h,m=a*f,g=o*f,b=l*c,A=l*h,y=l*f,E=i.x,M=i.y,T=i.z;return n[0]=(1-(x+g))*E,n[1]=(d+y)*E,n[2]=(p-A)*E,n[3]=0,n[4]=(d-y)*M,n[5]=(1-(u+g))*M,n[6]=(m+b)*M,n[7]=0,n[8]=(p+A)*T,n[9]=(m-b)*T,n[10]=(1-(u+x))*T,n[11]=0,n[12]=t.x,n[13]=t.y,n[14]=t.z,n[15]=1,this}decompose(t,e,i){const n=this.elements;t.x=n[12],t.y=n[13],t.z=n[14];const r=this.determinantAffine();if(r===0)return i.set(1,1,1),e.identity(),this;let a=hs.set(n[0],n[1],n[2]).length();const o=hs.set(n[4],n[5],n[6]).length(),l=hs.set(n[8],n[9],n[10]).length();r<0&&(a=-a),Ri.copy(this);const c=1/a,h=1/o,f=1/l;return Ri.elements[0]*=c,Ri.elements[1]*=c,Ri.elements[2]*=c,Ri.elements[4]*=h,Ri.elements[5]*=h,Ri.elements[6]*=h,Ri.elements[8]*=f,Ri.elements[9]*=f,Ri.elements[10]*=f,e.setFromRotationMatrix(Ri),i.x=a,i.y=o,i.z=l,this}makePerspective(t,e,i,n,r,a,o=Ji,l=!1){const c=this.elements,h=2*r/(e-t),f=2*r/(i-n),u=(e+t)/(e-t),d=(i+n)/(i-n);let p,x;if(l)p=r/(a-r),x=a*r/(a-r);else if(o===Ji)p=-(a+r)/(a-r),x=-2*a*r/(a-r);else if(o===wr)p=-a/(a-r),x=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=u,c[12]=0,c[1]=0,c[5]=f,c[9]=d,c[13]=0,c[2]=0,c[6]=0,c[10]=p,c[14]=x,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,i,n,r,a,o=Ji,l=!1){const c=this.elements,h=2/(e-t),f=2/(i-n),u=-(e+t)/(e-t),d=-(i+n)/(i-n);let p,x;if(l)p=1/(a-r),x=a/(a-r);else if(o===Ji)p=-2/(a-r),x=-(a+r)/(a-r);else if(o===wr)p=-1/(a-r),x=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=0,c[12]=u,c[1]=0,c[5]=f,c[9]=0,c[13]=d,c[2]=0,c[6]=0,c[10]=p,c[14]=x,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){const e=this.elements,i=t.elements;for(let n=0;n<16;n++)if(e[n]!==i[n])return!1;return!0}fromArray(t,e=0){for(let i=0;i<16;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t[e+9]=i[9],t[e+10]=i[10],t[e+11]=i[11],t[e+12]=i[12],t[e+13]=i[13],t[e+14]=i[14],t[e+15]=i[15],t}};qa.prototype.isMatrix4=!0;let Se=qa;const hs=new R,Ri=new Se,Jp=new R(0,0,0),jp=new R(1,1,1),En=new R,zr=new R,yi=new R,_h=new Se,yh=new nn;class Un{constructor(t=0,e=0,i=0,n=Un.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=i,this._order=n}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,i,n=this._order){return this._x=t,this._y=e,this._z=i,this._order=n,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,i=!0){const n=t.elements,r=n[0],a=n[4],o=n[8],l=n[1],c=n[5],h=n[9],f=n[2],u=n[6],d=n[10];switch(e){case"XYZ":this._y=Math.asin(ue(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,d),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(u,c),this._z=0);break;case"YXZ":this._x=Math.asin(-ue(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,d),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-f,r),this._z=0);break;case"ZXY":this._x=Math.asin(ue(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(-f,d),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-ue(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(u,d),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(ue(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-f,r)):(this._x=0,this._y=Math.atan2(o,d));break;case"XZY":this._z=Math.asin(-ue(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(u,c),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-h,d),this._y=0);break;default:Qt("Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,i===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,i){return _h.makeRotationFromQuaternion(t),this.setFromRotationMatrix(_h,e,i)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return yh.setFromEuler(this),this.setFromQuaternion(yh,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Un.DEFAULT_ORDER="XYZ";class Md{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let Qp=0;const Mh=new R,us=new nn,on=new Se,Hr=new R,$s=new R,t0=new R,e0=new nn,Sh=new R(1,0,0),bh=new R(0,1,0),wh=new R(0,0,1),Eh={type:"added"},i0={type:"removed"},ds={type:"childadded",child:null},yo={type:"childremoved",child:null};class Oe extends ss{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Qp++}),this.uuid=vn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Oe.DEFAULT_UP.clone();const t=new R,e=new Un,i=new nn,n=new R(1,1,1);function r(){i.setFromEuler(e,!1)}function a(){e.setFromQuaternion(i,void 0,!1)}e._onChange(r),i._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:n},modelViewMatrix:{value:new Se},normalMatrix:{value:new ne}}),this.matrix=new Se,this.matrixWorld=new Se,this.matrixAutoUpdate=Oe.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Oe.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Md,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return us.setFromAxisAngle(t,e),this.quaternion.multiply(us),this}rotateOnWorldAxis(t,e){return us.setFromAxisAngle(t,e),this.quaternion.premultiply(us),this}rotateX(t){return this.rotateOnAxis(Sh,t)}rotateY(t){return this.rotateOnAxis(bh,t)}rotateZ(t){return this.rotateOnAxis(wh,t)}translateOnAxis(t,e){return Mh.copy(t).applyQuaternion(this.quaternion),this.position.add(Mh.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Sh,t)}translateY(t){return this.translateOnAxis(bh,t)}translateZ(t){return this.translateOnAxis(wh,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(on.copy(this.matrixWorld).invert())}lookAt(t,e,i){t.isVector3?Hr.copy(t):Hr.set(t,e,i);const n=this.parent;this.updateWorldMatrix(!0,!1),$s.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?on.lookAt($s,Hr,this.up):on.lookAt(Hr,$s,this.up),this.quaternion.setFromRotationMatrix(on),n&&(on.extractRotation(n.matrixWorld),us.setFromRotationMatrix(on),this.quaternion.premultiply(us.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(me("Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(Eh),ds.child=t,this.dispatchEvent(ds),ds.child=null):me("Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(i0),yo.child=t,this.dispatchEvent(yo),yo.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),on.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),on.multiply(t.parent.matrixWorld)),t.applyMatrix4(on),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(Eh),ds.child=t,this.dispatchEvent(ds),ds.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let i=0,n=this.children.length;i<n;i++){const a=this.children[i].getObjectByProperty(t,e);if(a!==void 0)return a}}getObjectsByProperty(t,e,i=[]){this[t]===e&&i.push(this);const n=this.children;for(let r=0,a=n.length;r<a;r++)n[r].getObjectsByProperty(t,e,i);return i}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose($s,t,t0),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose($s,e0,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}intersectsFrustum(){}traverse(t){t(this);const e=this.children;for(let i=0,n=e.length;i<n;i++)e[i].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let i=0,n=e.length;i<n;i++)e[i].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);const t=this.pivot;if(t!==null){const e=t.x,i=t.y,n=t.z,r=this.matrix.elements;r[12]+=e-r[0]*e-r[4]*i-r[8]*n,r[13]+=i-r[1]*e-r[5]*i-r[9]*n,r[14]+=n-r[2]*e-r[6]*i-r[10]*n}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let i=0,n=e.length;i<n;i++)e[i].updateMatrixWorld(t)}updateWorldMatrix(t,e,i=!1){const n=this.parent;if(t===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||i)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,i=!0),e===!0){const r=this.children;for(let a=0,o=r.length;a<o;a++)r[a].updateWorldMatrix(!1,!0,i)}}toJSON(t){const e=t===void 0||typeof t=="string",i={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const n={};n.uuid=this.uuid,n.type=this.type,n.name=this.name,n.castShadow=this.castShadow,n.receiveShadow=this.receiveShadow,n.visible=this.visible,n.frustumCulled=this.frustumCulled,n.renderOrder=this.renderOrder,n.static=this.static,n.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(n.userData=this.userData),n.layers=this.layers.mask,n.matrix=this.matrix.toArray(),n.up=this.up.toArray(),this.pivot!==null&&(n.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(n.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(n.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(n.type="InstancedMesh",n.count=this.count,n.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(n.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(n.type="BatchedMesh",n.perObjectFrustumCulled=this.perObjectFrustumCulled,n.sortObjects=this.sortObjects,n.drawRanges=this._drawRanges,n.reservedRanges=this._reservedRanges,n.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),n.instanceInfo=this._instanceInfo.map(o=>({...o})),n.availableInstanceIds=this._availableInstanceIds.slice(),n.availableGeometryIds=this._availableGeometryIds.slice(),n.nextIndexStart=this._nextIndexStart,n.nextVertexStart=this._nextVertexStart,n.geometryCount=this._geometryCount,n.maxInstanceCount=this._maxInstanceCount,n.maxVertexCount=this._maxVertexCount,n.maxIndexCount=this._maxIndexCount,n.geometryInitialized=this._geometryInitialized,n.matricesTexture=this._matricesTexture.toJSON(t),n.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(n.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(n.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(n.boundingBox=this.boundingBox.toJSON()));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?n.background=this.background.toJSON():this.background.isTexture&&(n.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(n.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){n.geometry=r(t.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const f=l[c];r(t.shapes,f)}else r(t.shapes,l)}}if(this.isSkinnedMesh&&(n.bindMode=this.bindMode,n.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),n.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(r(t.materials,this.material[l]));n.material=o}else n.material=r(t.materials,this.material);if(this.children.length>0){n.children=[];for(let o=0;o<this.children.length;o++)n.children.push(this.children[o].toJSON(t).object)}if(this.animations.length>0){n.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];n.animations.push(r(t.animations,l))}}if(e){const o=a(t.geometries),l=a(t.materials),c=a(t.textures),h=a(t.images),f=a(t.shapes),u=a(t.skeletons),d=a(t.animations),p=a(t.nodes);o.length>0&&(i.geometries=o),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),h.length>0&&(i.images=h),f.length>0&&(i.shapes=f),u.length>0&&(i.skeletons=u),d.length>0&&(i.animations=d),p.length>0&&(i.nodes=p)}return i.object=n,i;function a(o){const l=[];for(const c in o){const h=o[c];delete h.metadata,l.push(h)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.pivot=t.pivot!==null?t.pivot.clone():null,this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.static=t.static,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let i=0;i<t.children.length;i++){const n=t.children[i];this.add(n.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}}Oe.DEFAULT_UP=new R(0,1,0);Oe.DEFAULT_MATRIX_AUTO_UPDATE=!0;Oe.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;class fe extends Oe{constructor(){super(),this.isGroup=!0,this.type="Group"}}const n0={type:"move"};class Mo{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new fe,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new fe,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new R,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new R),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new fe,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new R,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new R,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const i of t.hand.values())this._getHandJoint(e,i)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,i){let n=null,r=null,a=null;const o=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){a=!0;for(const x of t.hand.values()){const m=e.getJointPose(x,i),g=this._getHandJoint(c,x);m!==null&&(g.matrix.fromArray(m.transform.matrix),g.matrix.decompose(g.position,g.rotation,g.scale),g.matrixWorldNeedsUpdate=!0,g.jointRadius=m.radius),g.visible=m!==null}const h=c.joints["index-finger-tip"],f=c.joints["thumb-tip"],u=h.position.distanceTo(f.position),d=.02,p=.005;c.inputState.pinching&&u>d+p?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&u<=d-p&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,i),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:t,target:this})));o!==null&&(n=e.getPose(t.targetRaySpace,i),n===null&&r!==null&&(n=r),n!==null&&(o.matrix.fromArray(n.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,n.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(n.linearVelocity)):o.hasLinearVelocity=!1,n.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(n.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(n0)))}return o!==null&&(o.visible=n!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const i=new fe;i.matrixAutoUpdate=!1,i.visible=!1,t.joints[e.jointName]=i,t.add(i)}return t.joints[e.jointName]}}const Sd={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Tn={h:0,s:0,l:0},Gr={h:0,s:0,l:0};function So(s,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?s+(t-s)*6*e:e<1/2?t:e<2/3?s+(t-s)*6*(2/3-e):s}class Kt{constructor(t,e,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,i)}set(t,e,i){if(e===void 0&&i===void 0){const n=t;n&&n.isColor?this.copy(n):typeof n=="number"?this.setHex(n):typeof n=="string"&&this.setStyle(n)}else this.setRGB(t,e,i);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=je){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,de.colorSpaceToWorking(this,e),this}setRGB(t,e,i,n=de.workingColorSpace){return this.r=t,this.g=e,this.b=i,de.colorSpaceToWorking(this,n),this}setHSL(t,e,i,n=de.workingColorSpace){if(t=Wp(t,1),e=ue(e,0,1),i=ue(i,0,1),e===0)this.r=this.g=this.b=i;else{const r=i<=.5?i*(1+e):i+e-i*e,a=2*i-r;this.r=So(a,r,t+1/3),this.g=So(a,r,t),this.b=So(a,r,t-1/3)}return de.colorSpaceToWorking(this,n),this}setStyle(t,e=je){function i(r){r!==void 0&&parseFloat(r)<1&&Qt("Color: Alpha component of "+t+" will be ignored.")}let n;if(n=/^(\w+)\(([^\)]*)\)/.exec(t)){let r;const a=n[1],o=n[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:Qt("Color: Unknown color model "+t)}}else if(n=/^\#([A-Fa-f\d]+)$/.exec(t)){const r=n[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(a===6)return this.setHex(parseInt(r,16),e);Qt("Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=je){const i=Sd[t.toLowerCase()];return i!==void 0?this.setHex(i,e):Qt("Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=xn(t.r),this.g=xn(t.g),this.b=xn(t.b),this}copyLinearToSRGB(t){return this.r=Fs(t.r),this.g=Fs(t.g),this.b=Fs(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=je){return de.workingToColorSpace(ei.copy(this),t),Math.round(ue(ei.r*255,0,255))*65536+Math.round(ue(ei.g*255,0,255))*256+Math.round(ue(ei.b*255,0,255))}getHexString(t=je){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=de.workingColorSpace){de.workingToColorSpace(ei.copy(this),e);const i=ei.r,n=ei.g,r=ei.b,a=Math.max(i,n,r),o=Math.min(i,n,r);let l,c;const h=(o+a)/2;if(o===a)l=0,c=0;else{const f=a-o;switch(c=h<=.5?f/(a+o):f/(2-a-o),a){case i:l=(n-r)/f+(n<r?6:0);break;case n:l=(r-i)/f+2;break;case r:l=(i-n)/f+4;break}l/=6}return t.h=l,t.s=c,t.l=h,t}getRGB(t,e=de.workingColorSpace){return de.workingToColorSpace(ei.copy(this),e),t.r=ei.r,t.g=ei.g,t.b=ei.b,t}getStyle(t=je){de.workingToColorSpace(ei.copy(this),t);const e=ei.r,i=ei.g,n=ei.b;return t!==je?`color(${t} ${e.toFixed(3)} ${i.toFixed(3)} ${n.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(i*255)},${Math.round(n*255)})`}offsetHSL(t,e,i){return this.getHSL(Tn),this.setHSL(Tn.h+t,Tn.s+e,Tn.l+i)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,i){return this.r=t.r+(e.r-t.r)*i,this.g=t.g+(e.g-t.g)*i,this.b=t.b+(e.b-t.b)*i,this}lerpHSL(t,e){this.getHSL(Tn),t.getHSL(Gr);const i=mo(Tn.h,Gr.h,e),n=mo(Tn.s,Gr.s,e),r=mo(Tn.l,Gr.l,e);return this.setHSL(i,n,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,i=this.g,n=this.b,r=t.elements;return this.r=r[0]*e+r[3]*i+r[6]*n,this.g=r[1]*e+r[4]*i+r[7]*n,this.b=r[2]*e+r[5]*i+r[8]*n,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const ei=new Kt;Kt.NAMES=Sd;class Ec{constructor(t,e=1,i=1e3){this.isFog=!0,this.name="",this.color=new Kt(t),this.near=e,this.far=i}clone(){return new Ec(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class bd extends Oe{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Un,this.environmentIntensity=1,this.environmentRotation=new Un,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),e.object.backgroundBlurriness=this.backgroundBlurriness,e.object.backgroundIntensity=this.backgroundIntensity,e.object.backgroundRotation=this.backgroundRotation.toArray(),e.object.environmentIntensity=this.environmentIntensity,e.object.environmentRotation=this.environmentRotation.toArray(),e}}const Li=new R,ln=new R,bo=new R,cn=new R,fs=new R,ps=new R,Th=new R,wo=new R,Eo=new R,To=new R,Ao=new Ue,Co=new Ue,Po=new Ue;class Ai{constructor(t=new R,e=new R,i=new R){this.a=t,this.b=e,this.c=i}static getNormal(t,e,i,n){n.subVectors(i,e),Li.subVectors(t,e),n.cross(Li);const r=n.lengthSq();return r>0?n.multiplyScalar(1/Math.sqrt(r)):n.set(0,0,0)}static getBarycoord(t,e,i,n,r){Li.subVectors(n,e),ln.subVectors(i,e),bo.subVectors(t,e);const a=Li.dot(Li),o=Li.dot(ln),l=Li.dot(bo),c=ln.dot(ln),h=ln.dot(bo),f=a*c-o*o;if(f===0)return r.set(0,0,0),null;const u=1/f,d=(c*l-o*h)*u,p=(a*h-o*l)*u;return r.set(1-d-p,p,d)}static containsPoint(t,e,i,n){return this.getBarycoord(t,e,i,n,cn)===null?!1:cn.x>=0&&cn.y>=0&&cn.x+cn.y<=1}static getInterpolation(t,e,i,n,r,a,o,l){return this.getBarycoord(t,e,i,n,cn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,cn.x),l.addScaledVector(a,cn.y),l.addScaledVector(o,cn.z),l)}static getInterpolatedAttribute(t,e,i,n,r,a){return Ao.setScalar(0),Co.setScalar(0),Po.setScalar(0),Ao.fromBufferAttribute(t,e),Co.fromBufferAttribute(t,i),Po.fromBufferAttribute(t,n),a.setScalar(0),a.addScaledVector(Ao,r.x),a.addScaledVector(Co,r.y),a.addScaledVector(Po,r.z),a}static isFrontFacing(t,e,i,n){return Li.subVectors(i,e),ln.subVectors(t,e),Li.cross(ln).dot(n)<0}set(t,e,i){return this.a.copy(t),this.b.copy(e),this.c.copy(i),this}setFromPointsAndIndices(t,e,i,n){return this.a.copy(t[e]),this.b.copy(t[i]),this.c.copy(t[n]),this}setFromAttributeAndIndices(t,e,i,n){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,i),this.c.fromBufferAttribute(t,n),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return Li.subVectors(this.c,this.b),ln.subVectors(this.a,this.b),Li.cross(ln).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return Ai.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return Ai.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,i,n,r){return Ai.getInterpolation(t,this.a,this.b,this.c,e,i,n,r)}containsPoint(t){return Ai.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return Ai.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const i=this.a,n=this.b,r=this.c;let a,o;fs.subVectors(n,i),ps.subVectors(r,i),wo.subVectors(t,i);const l=fs.dot(wo),c=ps.dot(wo);if(l<=0&&c<=0)return e.copy(i);Eo.subVectors(t,n);const h=fs.dot(Eo),f=ps.dot(Eo);if(h>=0&&f<=h)return e.copy(n);const u=l*f-h*c;if(u<=0&&l>=0&&h<=0)return a=l/(l-h),e.copy(i).addScaledVector(fs,a);To.subVectors(t,r);const d=fs.dot(To),p=ps.dot(To);if(p>=0&&d<=p)return e.copy(r);const x=d*c-l*p;if(x<=0&&c>=0&&p<=0)return o=c/(c-p),e.copy(i).addScaledVector(ps,o);const m=h*p-d*f;if(m<=0&&f-h>=0&&d-p>=0)return Th.subVectors(r,n),o=(f-h)/(f-h+(d-p)),e.copy(n).addScaledVector(Th,o);const g=1/(m+x+u);return a=x*g,o=u*g,e.copy(i).addScaledVector(fs,a).addScaledVector(ps,o)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}class rs{constructor(t=new R(1/0,1/0,1/0),e=new R(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e+=3)this.expandByPoint(ki.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,i=t.count;e<i;e++)this.expandByPoint(ki.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const i=ki.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(i),this.max.copy(t).add(i),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const i=t.geometry;if(i!==void 0){const r=i.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)t.isMesh===!0?t.getVertexPosition(a,ki):ki.fromBufferAttribute(r,a),ki.applyMatrix4(t.matrixWorld),this.expandByPoint(ki);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Vr.copy(t.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),Vr.copy(i.boundingBox)),Vr.applyMatrix4(t.matrixWorld),this.union(Vr)}const n=t.children;for(let r=0,a=n.length;r<a;r++)this.expandByObject(n[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,ki),ki.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,i;return t.normal.x>0?(e=t.normal.x*this.min.x,i=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,i=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,i+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,i+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,i+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,i+=t.normal.z*this.min.z),e<=-t.constant&&i>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Ys),Wr.subVectors(this.max,Ys),ms.subVectors(t.a,Ys),gs.subVectors(t.b,Ys),vs.subVectors(t.c,Ys),An.subVectors(gs,ms),Cn.subVectors(vs,gs),zn.subVectors(ms,vs);let e=[0,-An.z,An.y,0,-Cn.z,Cn.y,0,-zn.z,zn.y,An.z,0,-An.x,Cn.z,0,-Cn.x,zn.z,0,-zn.x,-An.y,An.x,0,-Cn.y,Cn.x,0,-zn.y,zn.x,0];return!Ro(e,ms,gs,vs,Wr)||(e=[1,0,0,0,1,0,0,0,1],!Ro(e,ms,gs,vs,Wr))?!1:(Xr.crossVectors(An,Cn),e=[Xr.x,Xr.y,Xr.z],Ro(e,ms,gs,vs,Wr))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,ki).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(ki).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(hn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),hn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),hn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),hn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),hn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),hn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),hn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),hn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(hn),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}}const hn=[new R,new R,new R,new R,new R,new R,new R,new R],ki=new R,Vr=new rs,ms=new R,gs=new R,vs=new R,An=new R,Cn=new R,zn=new R,Ys=new R,Wr=new R,Xr=new R,Hn=new R;function Ro(s,t,e,i,n){for(let r=0,a=s.length-3;r<=a;r+=3){Hn.fromArray(s,r);const o=n.x*Math.abs(Hn.x)+n.y*Math.abs(Hn.y)+n.z*Math.abs(Hn.z),l=t.dot(Hn),c=e.dot(Hn),h=i.dot(Hn);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>o)return!1}return!0}const Ve=new R,qr=new ot;let s0=0;class xi extends ss{constructor(t,e,i=!1){if(super(),Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:s0++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=i,this.usage=xd,this.updateRanges=[],this.gpuType=Di,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,i){t*=this.itemSize,i*=e.itemSize;for(let n=0,r=this.itemSize;n<r;n++)this.array[t+n]=e.array[i+n];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,i=this.count;e<i;e++)qr.fromBufferAttribute(this,e),qr.applyMatrix3(t),this.setXY(e,qr.x,qr.y);else if(this.itemSize===3)for(let e=0,i=this.count;e<i;e++)Ve.fromBufferAttribute(this,e),Ve.applyMatrix3(t),this.setXYZ(e,Ve.x,Ve.y,Ve.z);return this}applyMatrix4(t){for(let e=0,i=this.count;e<i;e++)Ve.fromBufferAttribute(this,e),Ve.applyMatrix4(t),this.setXYZ(e,Ve.x,Ve.y,Ve.z);return this}applyNormalMatrix(t){for(let e=0,i=this.count;e<i;e++)Ve.fromBufferAttribute(this,e),Ve.applyNormalMatrix(t),this.setXYZ(e,Ve.x,Ve.y,Ve.z);return this}transformDirection(t){for(let e=0,i=this.count;e<i;e++)Ve.fromBufferAttribute(this,e),Ve.transformDirection(t),this.setXYZ(e,Ve.x,Ve.y,Ve.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let i=this.array[t*this.itemSize+e];return this.normalized&&(i=Zi(i,this.array)),i}setComponent(t,e,i){return this.normalized&&(i=Ae(i,this.array)),this.array[t*this.itemSize+e]=i,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=Zi(e,this.array)),e}setX(t,e){return this.normalized&&(e=Ae(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=Zi(e,this.array)),e}setY(t,e){return this.normalized&&(e=Ae(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=Zi(e,this.array)),e}setZ(t,e){return this.normalized&&(e=Ae(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=Zi(e,this.array)),e}setW(t,e){return this.normalized&&(e=Ae(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,i){return t*=this.itemSize,this.normalized&&(e=Ae(e,this.array),i=Ae(i,this.array)),this.array[t+0]=e,this.array[t+1]=i,this}setXYZ(t,e,i,n){return t*=this.itemSize,this.normalized&&(e=Ae(e,this.array),i=Ae(i,this.array),n=Ae(n,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=n,this}setXYZW(t,e,i,n,r){return t*=this.itemSize,this.normalized&&(e=Ae(e,this.array),i=Ae(i,this.array),n=Ae(n,this.array),r=Ae(r,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=n,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return t.name=this.name,t.usage=this.usage,t.gpuType=this.gpuType,t}dispose(){this.dispatchEvent({type:"dispose"})}}class wd extends xi{constructor(t,e,i){super(new Uint16Array(t),e,i)}}class Ed extends xi{constructor(t,e,i){super(new Uint32Array(t),e,i)}}class pe extends xi{constructor(t,e,i){super(new Float32Array(t),e,i)}}const r0=new rs,Zs=new R,Lo=new R;class Hs{constructor(t=new R,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const i=this.center;e!==void 0?i.copy(e):r0.setFromPoints(t).getCenter(i);let n=0;for(let r=0,a=t.length;r<a;r++)n=Math.max(n,i.distanceToSquared(t[r]));return this.radius=Math.sqrt(n),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const i=this.center.distanceToSquared(t);return e.copy(t),i>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Zs.subVectors(t,this.center);const e=Zs.lengthSq();if(e>this.radius*this.radius){const i=Math.sqrt(e),n=(i-this.radius)*.5;this.center.addScaledVector(Zs,n/i),this.radius+=n}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Lo.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Zs.copy(t.center).add(Lo)),this.expandByPoint(Zs.copy(t.center).sub(Lo))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}}let a0=0;const Ei=new Se,ko=new Oe,xs=new R,Mi=new rs,Js=new rs,Ye=new R;class Be extends ss{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:a0++}),this.uuid=vn(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(zp(t)?Ed:wd)(t,1):this.index=t,this}setIndirect(t,e=0){return this.indirect=t,this.indirectOffset=e,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,i=0){this.groups.push({start:t,count:e,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const r=new ne().getNormalMatrix(t);i.applyNormalMatrix(r),i.needsUpdate=!0}const n=this.attributes.tangent;return n!==void 0&&(n.transformDirection(t),n.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(t){return Ei.makeRotationFromQuaternion(t),this.applyMatrix4(Ei),this}rotateX(t){return Ei.makeRotationX(t),this.applyMatrix4(Ei),this}rotateY(t){return Ei.makeRotationY(t),this.applyMatrix4(Ei),this}rotateZ(t){return Ei.makeRotationZ(t),this.applyMatrix4(Ei),this}translate(t,e,i){return Ei.makeTranslation(t,e,i),this.applyMatrix4(Ei),this}scale(t,e,i){return Ei.makeScale(t,e,i),this.applyMatrix4(Ei),this}lookAt(t){return ko.lookAt(t),ko.updateMatrix(),this.applyMatrix4(ko.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(xs).negate(),this.translate(xs.x,xs.y,xs.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const i=[];for(let n=0,r=t.length;n<r;n++){const a=t[n];i.push(a.x,a.y,a.z||0)}this.setAttribute("position",new pe(i,3))}else{const i=Math.min(t.length,e.count);for(let n=0;n<i;n++){const r=t[n];e.setXYZ(n,r.x,r.y,r.z||0)}t.length>e.count&&Qt("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new rs);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){me("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new R(-1/0,-1/0,-1/0),new R(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let i=0,n=e.length;i<n;i++){const r=e[i];Mi.setFromBufferAttribute(r),this.morphTargetsRelative?(Ye.addVectors(this.boundingBox.min,Mi.min),this.boundingBox.expandByPoint(Ye),Ye.addVectors(this.boundingBox.max,Mi.max),this.boundingBox.expandByPoint(Ye)):(this.boundingBox.expandByPoint(Mi.min),this.boundingBox.expandByPoint(Mi.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&me('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Hs);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){me("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new R,1/0);return}if(t){const i=this.boundingSphere.center;if(Mi.setFromBufferAttribute(t),e)for(let r=0,a=e.length;r<a;r++){const o=e[r];Js.setFromBufferAttribute(o),this.morphTargetsRelative?(Ye.addVectors(Mi.min,Js.min),Mi.expandByPoint(Ye),Ye.addVectors(Mi.max,Js.max),Mi.expandByPoint(Ye)):(Mi.expandByPoint(Js.min),Mi.expandByPoint(Js.max))}Mi.getCenter(i);let n=0;for(let r=0,a=t.count;r<a;r++)Ye.fromBufferAttribute(t,r),n=Math.max(n,i.distanceToSquared(Ye));if(e)for(let r=0,a=e.length;r<a;r++){const o=e[r],l=this.morphTargetsRelative;for(let c=0,h=o.count;c<h;c++)Ye.fromBufferAttribute(o,c),l&&(xs.fromBufferAttribute(t,c),Ye.add(xs)),n=Math.max(n,i.distanceToSquared(Ye))}this.boundingSphere.radius=Math.sqrt(n),isNaN(this.boundingSphere.radius)&&me('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){me("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=e.position,n=e.normal,r=e.uv;let a=this.getAttribute("tangent");(a===void 0||a.count!==i.count)&&(a=new xi(new Float32Array(4*i.count),4),this.setAttribute("tangent",a));const o=[],l=[];for(let v=0;v<i.count;v++)o[v]=new R,l[v]=new R;const c=new R,h=new R,f=new R,u=new ot,d=new ot,p=new ot,x=new R,m=new R;function g(v,w,P){c.fromBufferAttribute(i,v),h.fromBufferAttribute(i,w),f.fromBufferAttribute(i,P),u.fromBufferAttribute(r,v),d.fromBufferAttribute(r,w),p.fromBufferAttribute(r,P),h.sub(c),f.sub(c),d.sub(u),p.sub(u);const L=1/(d.x*p.y-p.x*d.y);isFinite(L)&&(x.copy(h).multiplyScalar(p.y).addScaledVector(f,-d.y).multiplyScalar(L),m.copy(f).multiplyScalar(d.x).addScaledVector(h,-p.x).multiplyScalar(L),o[v].add(x),o[w].add(x),o[P].add(x),l[v].add(m),l[w].add(m),l[P].add(m))}let b=this.groups;b.length===0&&(b=[{start:0,count:t.count}]);for(let v=0,w=b.length;v<w;++v){const P=b[v],L=P.start,U=P.count;for(let B=L,F=L+U;B<F;B+=3)g(t.getX(B+0),t.getX(B+1),t.getX(B+2))}const A=new R,y=new R,E=new R,M=new R;function T(v){E.fromBufferAttribute(n,v),M.copy(E);const w=o[v];A.copy(w),A.sub(E.multiplyScalar(E.dot(w))).normalize(),y.crossVectors(M,w);const L=y.dot(l[v])<0?-1:1;a.setXYZW(v,A.x,A.y,A.z,L)}for(let v=0,w=b.length;v<w;++v){const P=b[v],L=P.start,U=P.count;for(let B=L,F=L+U;B<F;B+=3)T(t.getX(B+0)),T(t.getX(B+1)),T(t.getX(B+2))}this._transformed=!0}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let i=this.getAttribute("normal");if(i===void 0||i.count!==e.count)i=new xi(new Float32Array(e.count*3),3),this.setAttribute("normal",i);else for(let u=0,d=i.count;u<d;u++)i.setXYZ(u,0,0,0);const n=new R,r=new R,a=new R,o=new R,l=new R,c=new R,h=new R,f=new R;if(t)for(let u=0,d=t.count;u<d;u+=3){const p=t.getX(u+0),x=t.getX(u+1),m=t.getX(u+2);n.fromBufferAttribute(e,p),r.fromBufferAttribute(e,x),a.fromBufferAttribute(e,m),h.subVectors(a,r),f.subVectors(n,r),h.cross(f),o.fromBufferAttribute(i,p),l.fromBufferAttribute(i,x),c.fromBufferAttribute(i,m),o.add(h),l.add(h),c.add(h),i.setXYZ(p,o.x,o.y,o.z),i.setXYZ(x,l.x,l.y,l.z),i.setXYZ(m,c.x,c.y,c.z)}else for(let u=0,d=e.count;u<d;u+=3)n.fromBufferAttribute(e,u+0),r.fromBufferAttribute(e,u+1),a.fromBufferAttribute(e,u+2),h.subVectors(a,r),f.subVectors(n,r),h.cross(f),i.setXYZ(u+0,h.x,h.y,h.z),i.setXYZ(u+1,h.x,h.y,h.z),i.setXYZ(u+2,h.x,h.y,h.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,i=t.count;e<i;e++)Ye.fromBufferAttribute(t,e),Ye.normalize(),t.setXYZ(e,Ye.x,Ye.y,Ye.z)}toNonIndexed(){function t(o,l){const c=o.array,h=o.itemSize,f=o.normalized,u=new c.constructor(l.length*h);let d=0,p=0;for(let x=0,m=l.length;x<m;x++){o.isInterleavedBufferAttribute?d=l[x]*o.data.stride+o.offset:d=l[x]*h;for(let g=0;g<h;g++)u[p++]=c[d++]}return new xi(u,h,f)}if(this.index===null)return Qt("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new Be,i=this.index.array,n=this.attributes;for(const o in n){const l=n[o],c=t(l,i);e.setAttribute(o,c)}const r=this.morphAttributes;for(const o in r){const l=[],c=r[o];for(let h=0,f=c.length;h<f;h++){const u=c[h],d=t(u,i);l.push(d)}e.morphAttributes[o]=l}e.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){const t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,t.name=this.name,Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const i=this.attributes;for(const l in i){const c=i[l];t.data.attributes[l]=c.toJSON(t.data)}const n={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let f=0,u=c.length;f<u;f++){const d=c[f];h.push(d.toJSON(t.data))}h.length>0&&(n[l]=h,r=!0)}r&&(t.data.morphAttributes=n,t.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(t.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(t.data.boundingSphere=o.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const i=t.index;i!==null&&this.setIndex(i.clone());const n=t.attributes;for(const c in n){const h=n[c];this.setAttribute(c,h.clone(e))}const r=t.morphAttributes;for(const c in r){const h=[],f=r[c];for(let u=0,d=f.length;u<d;u++)h.push(f[u].clone(e));this.morphAttributes[c]=h}this.morphTargetsRelative=t.morphTargetsRelative;const a=t.groups;for(let c=0,h=a.length;c<h;c++){const f=a[c];this.addGroup(f.start,f.count,f.materialIndex)}const o=t.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this._transformed=t._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}}class o0{constructor(t,e){this.isInterleavedBuffer=!0,this.array=t,this.stride=e,this.count=t!==void 0?t.length/e:0,this.usage=xd,this.updateRanges=[],this.version=0,this.uuid=vn()}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.array=new t.array.constructor(t.array),this.count=t.count,this.stride=t.stride,this.usage=t.usage,this}copyAt(t,e,i){t*=this.stride,i*=e.stride;for(let n=0,r=this.stride;n<r;n++)this.array[t+n]=e.array[i+n];return this}set(t,e=0){return this.array.set(t,e),this}clone(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=vn()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const e=new this.array.constructor(t.arrayBuffers[this.array.buffer._uuid]),i=new this.constructor(e,this.stride);return i.setUsage(this.usage),i}onUpload(t){return this.onUploadCallback=t,this}toJSON(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=vn()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer)));const e={uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride};return e.usage=this.usage,e}}const oi=new R;class Ba{constructor(t,e,i,n=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=e,this.offset=i,this.normalized=n}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(t){this.data.needsUpdate=t}applyMatrix4(t){for(let e=0,i=this.data.count;e<i;e++)oi.fromBufferAttribute(this,e),oi.applyMatrix4(t),this.setXYZ(e,oi.x,oi.y,oi.z);return this}applyNormalMatrix(t){for(let e=0,i=this.count;e<i;e++)oi.fromBufferAttribute(this,e),oi.applyNormalMatrix(t),this.setXYZ(e,oi.x,oi.y,oi.z);return this}transformDirection(t){for(let e=0,i=this.count;e<i;e++)oi.fromBufferAttribute(this,e),oi.transformDirection(t),this.setXYZ(e,oi.x,oi.y,oi.z);return this}getComponent(t,e){let i=this.array[t*this.data.stride+this.offset+e];return this.normalized&&(i=Zi(i,this.array)),i}setComponent(t,e,i){return this.normalized&&(i=Ae(i,this.array)),this.data.array[t*this.data.stride+this.offset+e]=i,this}setX(t,e){return this.normalized&&(e=Ae(e,this.array)),this.data.array[t*this.data.stride+this.offset]=e,this}setY(t,e){return this.normalized&&(e=Ae(e,this.array)),this.data.array[t*this.data.stride+this.offset+1]=e,this}setZ(t,e){return this.normalized&&(e=Ae(e,this.array)),this.data.array[t*this.data.stride+this.offset+2]=e,this}setW(t,e){return this.normalized&&(e=Ae(e,this.array)),this.data.array[t*this.data.stride+this.offset+3]=e,this}getX(t){let e=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(e=Zi(e,this.array)),e}getY(t){let e=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(e=Zi(e,this.array)),e}getZ(t){let e=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(e=Zi(e,this.array)),e}getW(t){let e=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(e=Zi(e,this.array)),e}setXY(t,e,i){return t=t*this.data.stride+this.offset,this.normalized&&(e=Ae(e,this.array),i=Ae(i,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=i,this}setXYZ(t,e,i,n){return t=t*this.data.stride+this.offset,this.normalized&&(e=Ae(e,this.array),i=Ae(i,this.array),n=Ae(n,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=i,this.data.array[t+2]=n,this}setXYZW(t,e,i,n,r){return t=t*this.data.stride+this.offset,this.normalized&&(e=Ae(e,this.array),i=Ae(i,this.array),n=Ae(n,this.array),r=Ae(r,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=i,this.data.array[t+2]=n,this.data.array[t+3]=r,this}clone(t){if(t===void 0){Oa("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let i=0;i<this.count;i++){const n=i*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[n+r])}return new xi(new this.array.constructor(e),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new Ba(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(t){if(t===void 0){Oa("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let i=0;i<this.count;i++){const n=i*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[n+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}const Io=new R,l0=new R,c0=new ne;class In{constructor(t=new R(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,i,n){return this.normal.set(t,e,i),this.constant=n,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,i){const n=Io.subVectors(i,e).cross(l0.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(n,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e,i=!0){const n=t.delta(Io),r=this.normal.dot(n);if(r===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const a=-(t.start.dot(this.normal)+this.constant)/r;return i===!0&&(a<0||a>1)?null:e.copy(t.start).addScaledVector(n,a)}intersectsLine(t){const e=this.distanceToPoint(t.start),i=this.distanceToPoint(t.end);return e<0&&i>0||i<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const i=e||c0.getNormalMatrix(t),n=this.coplanarPoint(Io).applyMatrix4(t),r=this.normal.applyMatrix3(i).normalize();return this.constant=-n.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(t){return this.normal.fromArray(t.normal),this.constant=t.constant,this}}let h0=0;class On extends ss{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:h0++}),this.uuid=vn(),this.name="",this.type="Material",this.blending=pr,this.side=ts,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=id,this.blendDst=nd,this.blendEquation=Rs,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Kt(0,0,0),this.blendAlpha=0,this.depthFunc=Mr,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=kp,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=fo,this.stencilZFail=fo,this.stencilZPass=fo,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const i=t[e];if(i===void 0){Qt(`Material: parameter '${e}' has value of undefined.`);continue}const n=this[e];if(n===void 0){Qt(`Material: '${e}' is not a property of THREE.${this.type}.`);continue}n&&n.isColor?n.set(i):n&&n.isVector2&&i&&i.isVector2||n&&n.isEuler&&i&&i.isEuler||n&&n.isVector3&&i&&i.isVector3?n.copy(i):this[e]=i}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,i.blending=this.blending,i.side=this.side,i.shadowSide=this.shadowSide,i.vertexColors=this.vertexColors,i.opacity=this.opacity,i.transparent=this.transparent,i.blendSrc=this.blendSrc,i.blendDst=this.blendDst,i.blendEquation=this.blendEquation,i.blendSrcAlpha=this.blendSrcAlpha,i.blendDstAlpha=this.blendDstAlpha,i.blendEquationAlpha=this.blendEquationAlpha,i.blendColor=this.blendColor.getHex(),i.blendAlpha=this.blendAlpha,i.depthFunc=this.depthFunc,i.depthTest=this.depthTest,i.depthWrite=this.depthWrite,i.colorWrite=this.colorWrite,i.clipIntersection=this.clipIntersection,i.clipShadows=this.clipShadows,i.stencilWriteMask=this.stencilWriteMask,i.stencilFunc=this.stencilFunc,i.stencilRef=this.stencilRef,i.stencilFuncMask=this.stencilFuncMask,i.stencilFail=this.stencilFail,i.stencilZFail=this.stencilZFail,i.stencilZPass=this.stencilZPass,i.stencilWrite=this.stencilWrite,i.polygonOffset=this.polygonOffset,i.polygonOffsetFactor=this.polygonOffsetFactor,i.polygonOffsetUnits=this.polygonOffsetUnits,i.dithering=this.dithering,i.alphaTest=this.alphaTest,i.alphaHash=this.alphaHash,i.alphaToCoverage=this.alphaToCoverage,i.premultipliedAlpha=this.premultipliedAlpha,i.forceSinglePass=this.forceSinglePass,i.allowOverride=this.allowOverride,i.visible=this.visible,i.toneMapped=this.toneMapped,i.name=this.name,this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(i.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(t).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(t).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(t).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(t).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(t).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(i.clippingPlanes=this.clippingPlanes.map(r=>r.toJSON())),this.rotation!==void 0&&(i.rotation=this.rotation),this.depthPacking!==void 0&&(i.depthPacking=this.depthPacking),this.linewidth!==void 0&&(i.linewidth=this.linewidth),this.linecap!==void 0&&(i.linecap=this.linecap),this.linejoin!==void 0&&(i.linejoin=this.linejoin),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.wireframe!==void 0&&(i.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(i.flatShading=this.flatShading),this.fog!==void 0&&(i.fog=this.fog),Object.keys(this.userData).length>0&&(i.userData=this.userData);function n(r){const a=[];for(const o in r){const l=r[o];delete l.metadata,a.push(l)}return a}if(e){const r=n(t.textures),a=n(t.images);r.length>0&&(i.textures=r),a.length>0&&(i.images=a)}return i}fromJSON(t,e){if(t.uuid!==void 0&&(this.uuid=t.uuid),t.name!==void 0&&(this.name=t.name),t.color!==void 0&&this.color!==void 0&&this.color.setHex(t.color),t.roughness!==void 0&&(this.roughness=t.roughness),t.metalness!==void 0&&(this.metalness=t.metalness),t.sheen!==void 0&&(this.sheen=t.sheen),t.sheenColor!==void 0&&(this.sheenColor=new Kt().setHex(t.sheenColor)),t.sheenRoughness!==void 0&&(this.sheenRoughness=t.sheenRoughness),t.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(t.emissive),t.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(t.specular),t.specularIntensity!==void 0&&(this.specularIntensity=t.specularIntensity),t.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(t.specularColor),t.shininess!==void 0&&(this.shininess=t.shininess),t.clearcoat!==void 0&&(this.clearcoat=t.clearcoat),t.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=t.clearcoatRoughness),t.dispersion!==void 0&&(this.dispersion=t.dispersion),t.retroreflectivity!==void 0&&(this.retroreflectivity=t.retroreflectivity),t.iridescence!==void 0&&(this.iridescence=t.iridescence),t.iridescenceIOR!==void 0&&(this.iridescenceIOR=t.iridescenceIOR),t.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=t.iridescenceThicknessRange),t.transmission!==void 0&&(this.transmission=t.transmission),t.thickness!==void 0&&(this.thickness=t.thickness),t.attenuationDistance!==void 0&&(this.attenuationDistance=t.attenuationDistance),t.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(t.attenuationColor),t.anisotropy!==void 0&&(this.anisotropy=t.anisotropy),t.anisotropyRotation!==void 0&&(this.anisotropyRotation=t.anisotropyRotation),t.fog!==void 0&&(this.fog=t.fog),t.flatShading!==void 0&&(this.flatShading=t.flatShading),t.blending!==void 0&&(this.blending=t.blending),t.combine!==void 0&&(this.combine=t.combine),t.side!==void 0&&(this.side=t.side),t.shadowSide!==void 0&&(this.shadowSide=t.shadowSide),t.opacity!==void 0&&(this.opacity=t.opacity),t.transparent!==void 0&&(this.transparent=t.transparent),t.alphaTest!==void 0&&(this.alphaTest=t.alphaTest),t.alphaHash!==void 0&&(this.alphaHash=t.alphaHash),t.depthFunc!==void 0&&(this.depthFunc=t.depthFunc),t.depthTest!==void 0&&(this.depthTest=t.depthTest),t.depthWrite!==void 0&&(this.depthWrite=t.depthWrite),t.colorWrite!==void 0&&(this.colorWrite=t.colorWrite),t.clippingPlanes!==void 0&&(this.clippingPlanes=t.clippingPlanes.map(i=>new In().fromJSON(i))),t.clipIntersection!==void 0&&(this.clipIntersection=t.clipIntersection),t.clipShadows!==void 0&&(this.clipShadows=t.clipShadows),t.depthPacking!==void 0&&(this.depthPacking=t.depthPacking),t.blendSrc!==void 0&&(this.blendSrc=t.blendSrc),t.blendDst!==void 0&&(this.blendDst=t.blendDst),t.blendEquation!==void 0&&(this.blendEquation=t.blendEquation),t.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=t.blendSrcAlpha),t.blendDstAlpha!==void 0&&(this.blendDstAlpha=t.blendDstAlpha),t.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=t.blendEquationAlpha),t.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(t.blendColor),t.blendAlpha!==void 0&&(this.blendAlpha=t.blendAlpha),t.stencilWriteMask!==void 0&&(this.stencilWriteMask=t.stencilWriteMask),t.stencilFunc!==void 0&&(this.stencilFunc=t.stencilFunc),t.stencilRef!==void 0&&(this.stencilRef=t.stencilRef),t.stencilFuncMask!==void 0&&(this.stencilFuncMask=t.stencilFuncMask),t.stencilFail!==void 0&&(this.stencilFail=t.stencilFail),t.stencilZFail!==void 0&&(this.stencilZFail=t.stencilZFail),t.stencilZPass!==void 0&&(this.stencilZPass=t.stencilZPass),t.stencilWrite!==void 0&&(this.stencilWrite=t.stencilWrite),t.wireframe!==void 0&&(this.wireframe=t.wireframe),t.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=t.wireframeLinewidth),t.wireframeLinecap!==void 0&&(this.wireframeLinecap=t.wireframeLinecap),t.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=t.wireframeLinejoin),t.rotation!==void 0&&(this.rotation=t.rotation),t.linewidth!==void 0&&(this.linewidth=t.linewidth),t.linecap!==void 0&&(this.linecap=t.linecap),t.linejoin!==void 0&&(this.linejoin=t.linejoin),t.dashSize!==void 0&&(this.dashSize=t.dashSize),t.gapSize!==void 0&&(this.gapSize=t.gapSize),t.scale!==void 0&&(this.scale=t.scale),t.polygonOffset!==void 0&&(this.polygonOffset=t.polygonOffset),t.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=t.polygonOffsetFactor),t.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=t.polygonOffsetUnits),t.dithering!==void 0&&(this.dithering=t.dithering),t.alphaToCoverage!==void 0&&(this.alphaToCoverage=t.alphaToCoverage),t.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=t.premultipliedAlpha),t.forceSinglePass!==void 0&&(this.forceSinglePass=t.forceSinglePass),t.allowOverride!==void 0&&(this.allowOverride=t.allowOverride),t.visible!==void 0&&(this.visible=t.visible),t.toneMapped!==void 0&&(this.toneMapped=t.toneMapped),t.userData!==void 0&&(this.userData=t.userData),t.vertexColors!==void 0&&(typeof t.vertexColors=="number"?this.vertexColors=t.vertexColors>0:this.vertexColors=t.vertexColors),t.size!==void 0&&(this.size=t.size),t.sizeAttenuation!==void 0&&(this.sizeAttenuation=t.sizeAttenuation),t.map!==void 0&&(this.map=e[t.map]||null),t.matcap!==void 0&&(this.matcap=e[t.matcap]||null),t.alphaMap!==void 0&&(this.alphaMap=e[t.alphaMap]||null),t.bumpMap!==void 0&&(this.bumpMap=e[t.bumpMap]||null),t.bumpScale!==void 0&&(this.bumpScale=t.bumpScale),t.normalMap!==void 0&&(this.normalMap=e[t.normalMap]||null),t.normalMapType!==void 0&&(this.normalMapType=t.normalMapType),t.normalScale!==void 0){let i=t.normalScale;Array.isArray(i)===!1&&(i=[i,i]),this.normalScale=new ot().fromArray(i)}return t.displacementMap!==void 0&&(this.displacementMap=e[t.displacementMap]||null),t.displacementScale!==void 0&&(this.displacementScale=t.displacementScale),t.displacementBias!==void 0&&(this.displacementBias=t.displacementBias),t.roughnessMap!==void 0&&(this.roughnessMap=e[t.roughnessMap]||null),t.metalnessMap!==void 0&&(this.metalnessMap=e[t.metalnessMap]||null),t.emissiveMap!==void 0&&(this.emissiveMap=e[t.emissiveMap]||null),t.emissiveIntensity!==void 0&&(this.emissiveIntensity=t.emissiveIntensity),t.specularMap!==void 0&&(this.specularMap=e[t.specularMap]||null),t.specularIntensityMap!==void 0&&(this.specularIntensityMap=e[t.specularIntensityMap]||null),t.specularColorMap!==void 0&&(this.specularColorMap=e[t.specularColorMap]||null),t.envMap!==void 0&&(this.envMap=e[t.envMap]||null),t.envMapRotation!==void 0&&this.envMapRotation.fromArray(t.envMapRotation),t.envMapIntensity!==void 0&&(this.envMapIntensity=t.envMapIntensity),t.reflectivity!==void 0&&(this.reflectivity=t.reflectivity),t.refractionRatio!==void 0&&(this.refractionRatio=t.refractionRatio),t.lightMap!==void 0&&(this.lightMap=e[t.lightMap]||null),t.lightMapIntensity!==void 0&&(this.lightMapIntensity=t.lightMapIntensity),t.aoMap!==void 0&&(this.aoMap=e[t.aoMap]||null),t.aoMapIntensity!==void 0&&(this.aoMapIntensity=t.aoMapIntensity),t.gradientMap!==void 0&&(this.gradientMap=e[t.gradientMap]||null),t.clearcoatMap!==void 0&&(this.clearcoatMap=e[t.clearcoatMap]||null),t.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=e[t.clearcoatRoughnessMap]||null),t.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=e[t.clearcoatNormalMap]||null),t.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new ot().fromArray(t.clearcoatNormalScale)),t.iridescenceMap!==void 0&&(this.iridescenceMap=e[t.iridescenceMap]||null),t.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=e[t.iridescenceThicknessMap]||null),t.transmissionMap!==void 0&&(this.transmissionMap=e[t.transmissionMap]||null),t.thicknessMap!==void 0&&(this.thicknessMap=e[t.thicknessMap]||null),t.anisotropyMap!==void 0&&(this.anisotropyMap=e[t.anisotropyMap]||null),t.sheenColorMap!==void 0&&(this.sheenColorMap=e[t.sheenColorMap]||null),t.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=e[t.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let i=null;if(e!==null){const n=e.length;i=new Array(n);for(let r=0;r!==n;++r)i[r]=e[r].clone()}return this.clippingPlanes=i,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.allowOverride=t.allowOverride,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}}class Td extends On{constructor(t){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new Kt(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.rotation=t.rotation,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}let _s;const js=new R,ys=new R,Ms=new R,Ss=new ot,Qs=new ot,Ad=new Se,Kr=new R,tr=new R,$r=new R,Ah=new ot,Do=new ot,Ch=new ot;class u0 extends Oe{constructor(t=new Td){if(super(),this.isSprite=!0,this.type="Sprite",_s===void 0){_s=new Be;const e=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),i=new o0(e,5);_s.setIndex([0,1,2,0,2,3]),_s.setAttribute("position",new Ba(i,3,0,!1)),_s.setAttribute("uv",new Ba(i,2,3,!1))}this.geometry=_s,this.material=t,this.center=new ot(.5,.5),this.count=1}intersectsFrustum(t){return t.intersectsSprite(this)}raycast(t,e){t.camera===null&&me('Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),ys.setFromMatrixScale(this.matrixWorld),Ad.copy(t.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(t.camera.matrixWorldInverse,this.matrixWorld),Ms.setFromMatrixPosition(this.modelViewMatrix),t.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&ys.multiplyScalar(-Ms.z);const i=this.material.rotation;let n,r;i!==0&&(r=Math.cos(i),n=Math.sin(i));const a=this.center;Yr(Kr.set(-.5,-.5,0),Ms,a,ys,n,r),Yr(tr.set(.5,-.5,0),Ms,a,ys,n,r),Yr($r.set(.5,.5,0),Ms,a,ys,n,r),Ah.set(0,0),Do.set(1,0),Ch.set(1,1);let o=t.ray.intersectTriangle(Kr,tr,$r,!1,js);if(o===null&&(Yr(tr.set(-.5,.5,0),Ms,a,ys,n,r),Do.set(0,1),o=t.ray.intersectTriangle(Kr,$r,tr,!1,js),o===null))return;const l=t.ray.origin.distanceTo(js);l<t.near||l>t.far||e.push({distance:l,point:js.clone(),uv:Ai.getInterpolation(js,Kr,tr,$r,Ah,Do,Ch,new ot),face:null,object:this})}copy(t,e){return super.copy(t,e),t.center!==void 0&&this.center.copy(t.center),this.material=t.material,this}}function Yr(s,t,e,i,n,r){Ss.subVectors(s,e).addScalar(.5).multiply(i),n!==void 0?(Qs.x=r*Ss.x-n*Ss.y,Qs.y=n*Ss.x+r*Ss.y):Qs.copy(Ss),s.copy(t),s.x+=Qs.x,s.y+=Qs.y,s.applyMatrix4(Ad)}const un=new R,Uo=new R,Zr=new R,Jr=new R;class Cd{constructor(t=new R,e=new R(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,un)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const i=e.dot(this.direction);return i<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=un.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(un.copy(this.origin).addScaledVector(this.direction,e),un.distanceToSquared(t))}distanceSqToSegment(t,e,i,n){Uo.copy(t).add(e).multiplyScalar(.5),Zr.copy(e).sub(t).normalize(),Jr.copy(this.origin).sub(Uo);const r=t.distanceTo(e)*.5,a=-this.direction.dot(Zr),o=Jr.dot(this.direction),l=-Jr.dot(Zr),c=Jr.lengthSq(),h=Math.abs(1-a*a);let f,u,d,p;if(h>0)if(f=a*l-o,u=a*o-l,p=r*h,f>=0)if(u>=-p)if(u<=p){const x=1/h;f*=x,u*=x,d=f*(f+a*u+2*o)+u*(a*f+u+2*l)+c}else u=r,f=Math.max(0,-(a*u+o)),d=-f*f+u*(u+2*l)+c;else u=-r,f=Math.max(0,-(a*u+o)),d=-f*f+u*(u+2*l)+c;else u<=-p?(f=Math.max(0,-(-a*r+o)),u=f>0?-r:Math.min(Math.max(-r,-l),r),d=-f*f+u*(u+2*l)+c):u<=p?(f=0,u=Math.min(Math.max(-r,-l),r),d=u*(u+2*l)+c):(f=Math.max(0,-(a*r+o)),u=f>0?r:Math.min(Math.max(-r,-l),r),d=-f*f+u*(u+2*l)+c);else u=a>0?-r:r,f=Math.max(0,-(a*u+o)),d=-f*f+u*(u+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,f),n&&n.copy(Uo).addScaledVector(Zr,u),d}intersectSphere(t,e){if(t.radius<0)return null;un.subVectors(t.center,this.origin);const i=un.dot(this.direction),n=un.dot(un)-i*i,r=t.radius*t.radius;if(n>r)return null;const a=Math.sqrt(r-n),o=i-a,l=i+a;return l<0?null:o<0?this.at(l,e):this.at(o,e)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(t.normal)+t.constant)/e;return i>=0?i:null}intersectPlane(t,e){const i=this.distanceToPlane(t);return i===null?null:this.at(i,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let i,n,r,a,o,l;const c=1/this.direction.x,h=1/this.direction.y,f=1/this.direction.z,u=this.origin;return c>=0?(i=(t.min.x-u.x)*c,n=(t.max.x-u.x)*c):(i=(t.max.x-u.x)*c,n=(t.min.x-u.x)*c),h>=0?(r=(t.min.y-u.y)*h,a=(t.max.y-u.y)*h):(r=(t.max.y-u.y)*h,a=(t.min.y-u.y)*h),i>a||r>n||((r>i||isNaN(i))&&(i=r),(a<n||isNaN(n))&&(n=a),f>=0?(o=(t.min.z-u.z)*f,l=(t.max.z-u.z)*f):(o=(t.max.z-u.z)*f,l=(t.min.z-u.z)*f),i>l||o>n)||((o>i||i!==i)&&(i=o),(l<n||n!==n)&&(n=l),n<0)?null:this.at(i>=0?i:n,e)}intersectsBox(t){return this.intersectBox(t,un)!==null}intersectTriangle(t,e,i,n,r){const a=this.origin,o=this.direction,l=o.x,c=o.y,h=o.z,f=t.x-a.x,u=t.y-a.y,d=t.z-a.z,p=e.x-a.x,x=e.y-a.y,m=e.z-a.z,g=i.x-a.x,b=i.y-a.y,A=i.z-a.z,y=Math.abs(l),E=Math.abs(c),M=Math.abs(h);let T,v,w,P,L,U,B,F,O,$,V,nt;if(y>=E&&y>=M?(w=l,U=f,O=p,nt=g,l>=0?(T=c,v=h,P=u,L=d,B=x,F=m,$=b,V=A):(T=h,v=c,P=d,L=u,B=m,F=x,$=A,V=b)):E>=M?(w=c,U=u,O=x,nt=b,c>=0?(T=h,v=l,P=d,L=f,B=m,F=p,$=A,V=g):(T=l,v=h,P=f,L=d,B=p,F=m,$=g,V=A)):(w=h,U=d,O=m,nt=A,h>=0?(T=l,v=c,P=f,L=u,B=p,F=x,$=g,V=b):(T=c,v=l,P=u,L=f,B=x,F=p,$=b,V=g)),w===0)return null;const X=T/w,Q=v/w,j=1/w,Ft=P-X*U,ut=L-Q*U,te=B-X*O,Zt=F-Q*O,ee=$-X*nt,Z=V-Q*nt,et=ee*Zt-Z*te,Mt=Ft*Z-ut*ee,$t=te*ut-Zt*Ft;if(n){if(et<0||Mt<0||$t<0)return null}else if((et<0||Mt<0||$t<0)&&(et>0||Mt>0||$t>0))return null;const Tt=et+Mt+$t;if(Tt===0)return null;const Jt=j*(et*U+Mt*O+$t*nt);return(Tt>0?Jt<0:Jt>0)?null:this.at(Jt/Tt,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class pi extends On{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Kt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Un,this.combine=sd,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const Ph=new Se,Gn=new Cd,jr=new Hs,Rh=new R,Qr=new R,ta=new R,ea=new R,Fo=new R,ia=new R,Lh=new R,na=new R;class qt extends Oe{constructor(t=new Be,e=new pi){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const n=e[i[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=n.length;r<a;r++){const o=n[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(t,e){const i=this.geometry,n=i.attributes.position,r=i.morphAttributes.position,a=i.morphTargetsRelative;e.fromBufferAttribute(n,t);const o=this.morphTargetInfluences;if(r&&o){ia.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const h=o[l],f=r[l];h!==0&&(Fo.fromBufferAttribute(f,t),a?ia.addScaledVector(Fo,h):ia.addScaledVector(Fo.sub(e),h))}e.add(ia)}return e}intersectsFrustum(t){return t.intersectsObject(this)}raycast(t,e){const i=this.geometry,n=this.material,r=this.matrixWorld;n!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),jr.copy(i.boundingSphere),jr.applyMatrix4(r),Gn.copy(t.ray).recast(t.near),!(jr.containsPoint(Gn.origin)===!1&&(Gn.intersectSphere(jr,Rh)===null||Gn.origin.distanceToSquared(Rh)>(t.far-t.near)**2))&&(Ph.copy(r).invert(),Gn.copy(t.ray).applyMatrix4(Ph),!(i.boundingBox!==null&&Gn.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(t,e,Gn)))}_computeIntersections(t,e,i){let n;const r=this.geometry,a=this.material,o=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,f=r.attributes.normal,u=r.groups,d=r.drawRange;if(o!==null)if(Array.isArray(a))for(let p=0,x=u.length;p<x;p++){const m=u[p],g=a[m.materialIndex],b=Math.max(m.start,d.start),A=Math.min(o.count,Math.min(m.start+m.count,d.start+d.count));for(let y=b,E=A;y<E;y+=3){const M=o.getX(y),T=o.getX(y+1),v=o.getX(y+2);n=sa(this,g,t,i,c,h,f,M,T,v),n&&(n.faceIndex=Math.floor(y/3),n.face.materialIndex=m.materialIndex,e.push(n))}}else{const p=Math.max(0,d.start),x=Math.min(o.count,d.start+d.count);for(let m=p,g=x;m<g;m+=3){const b=o.getX(m),A=o.getX(m+1),y=o.getX(m+2);n=sa(this,a,t,i,c,h,f,b,A,y),n&&(n.faceIndex=Math.floor(m/3),e.push(n))}}else if(l!==void 0)if(Array.isArray(a))for(let p=0,x=u.length;p<x;p++){const m=u[p],g=a[m.materialIndex],b=Math.max(m.start,d.start),A=Math.min(l.count,Math.min(m.start+m.count,d.start+d.count));for(let y=b,E=A;y<E;y+=3){const M=y,T=y+1,v=y+2;n=sa(this,g,t,i,c,h,f,M,T,v),n&&(n.faceIndex=Math.floor(y/3),n.face.materialIndex=m.materialIndex,e.push(n))}}else{const p=Math.max(0,d.start),x=Math.min(l.count,d.start+d.count);for(let m=p,g=x;m<g;m+=3){const b=m,A=m+1,y=m+2;n=sa(this,a,t,i,c,h,f,b,A,y),n&&(n.faceIndex=Math.floor(m/3),e.push(n))}}}}function d0(s,t,e,i,n,r,a,o){let l;if(t.side===Je?l=i.intersectTriangle(a,r,n,!0,o):l=i.intersectTriangle(n,r,a,t.side===ts,o),l===null)return null;na.copy(o),na.applyMatrix4(s.matrixWorld);const c=e.ray.origin.distanceTo(na);return c<e.near||c>e.far?null:{distance:c,point:na.clone(),object:s}}function sa(s,t,e,i,n,r,a,o,l,c){s.getVertexPosition(o,Qr),s.getVertexPosition(l,ta),s.getVertexPosition(c,ea);const h=d0(s,t,e,i,Qr,ta,ea,Lh);if(h){const f=new R;Ai.getBarycoord(Lh,Qr,ta,ea,f),n&&(h.uv=Ai.getInterpolatedAttribute(n,o,l,c,f,new ot)),r&&(h.uv1=Ai.getInterpolatedAttribute(r,o,l,c,f,new ot)),a&&(h.normal=Ai.getInterpolatedAttribute(a,o,l,c,f,new R),h.normal.dot(i.direction)>0&&h.normal.multiplyScalar(-1));const u={a:o,b:l,c,normal:new R,materialIndex:0};Ai.getNormal(Qr,ta,ea,u.normal),h.face=u,h.barycoord=f}return h}class Tc extends ri{constructor(t=null,e=1,i=1,n,r,a,o,l,c=qe,h=qe,f,u){super(null,a,o,l,c,h,n,r,f,u),this.isDataTexture=!0,this.image={data:t,width:e,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class kh extends xi{constructor(t,e,i,n=1){super(t,e,i),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=n}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){const t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}}const bs=new Se,Ih=new Se,ra=[],Dh=new rs,f0=new Se,er=new qt,ir=new Hs;class za extends qt{constructor(t,e,i){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new kh(new Float32Array(i*16),16),this.instanceColor=null,this.morphTexture=null,this.count=i,this.boundingBox=null,this.boundingSphere=null;for(let n=0;n<i;n++)this.setMatrixAt(n,f0)}computeBoundingBox(){const t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new rs),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let i=0;i<e;i++)this.getMatrixAt(i,bs),Dh.copy(t.boundingBox).applyMatrix4(bs),this.boundingBox.union(Dh)}computeBoundingSphere(){const t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new Hs),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let i=0;i<e;i++)this.getMatrixAt(i,bs),ir.copy(t.boundingSphere).applyMatrix4(bs),this.boundingSphere.union(ir)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.morphTexture!==null&&(this.morphTexture=t.morphTexture.clone()),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){return this.instanceColor===null?e.setRGB(1,1,1):e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){return e.fromArray(this.instanceMatrix.array,t*16)}getMorphAt(t,e){const i=e.morphTargetInfluences,n=this.morphTexture.source.data.data,r=i.length+1,a=t*r+1;for(let o=0;o<i.length;o++)i[o]=n[a+o]}raycast(t,e){const i=this.matrixWorld,n=this.count;if(er.geometry=this.geometry,er.material=this.material,er.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),ir.copy(this.boundingSphere),ir.applyMatrix4(i),t.ray.intersectsSphere(ir)!==!1))for(let r=0;r<n;r++){this.getMatrixAt(r,bs),Ih.multiplyMatrices(i,bs),er.matrixWorld=Ih,er.raycast(t,ra);for(let a=0,o=ra.length;a<o;a++){const l=ra[a];l.instanceId=r,l.object=this,e.push(l)}ra.length=0}}setColorAt(t,e){return this.instanceColor===null&&(this.instanceColor=new kh(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),e.toArray(this.instanceColor.array,t*3),this}setMatrixAt(t,e){return e.toArray(this.instanceMatrix.array,t*16),this}setMorphAt(t,e){const i=e.morphTargetInfluences,n=i.length+1;this.morphTexture===null&&(this.morphTexture=new Tc(new Float32Array(n*this.count),n,this.count,xc,Di));const r=this.morphTexture.source.data.data;let a=0;for(let c=0;c<i.length;c++)a+=i[c];const o=this.geometry.morphTargetsRelative?1:1-a,l=n*t;return r[l]=o,r.set(i,l+1),this}updateMorphTargets(){}dispose(){super.dispose(),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}}const Vn=new Hs,p0=new ot(.5,.5),aa=new R;class Ac{constructor(t=new In,e=new In,i=new In,n=new In,r=new In,a=new In){this.planes=[t,e,i,n,r,a]}set(t,e,i,n,r,a){const o=this.planes;return o[0].copy(t),o[1].copy(e),o[2].copy(i),o[3].copy(n),o[4].copy(r),o[5].copy(a),this}copy(t){const e=this.planes;for(let i=0;i<6;i++)e[i].copy(t.planes[i]);return this}setFromProjectionMatrix(t,e=Ji,i=!1){const n=this.planes,r=t.elements,a=r[0],o=r[1],l=r[2],c=r[3],h=r[4],f=r[5],u=r[6],d=r[7],p=r[8],x=r[9],m=r[10],g=r[11],b=r[12],A=r[13],y=r[14],E=r[15];if(n[0].setComponents(c-a,d-h,g-p,E-b).normalize(),n[1].setComponents(c+a,d+h,g+p,E+b).normalize(),n[2].setComponents(c+o,d+f,g+x,E+A).normalize(),n[3].setComponents(c-o,d-f,g-x,E-A).normalize(),i)n[4].setComponents(l,u,m,y).normalize(),n[5].setComponents(c-l,d-u,g-m,E-y).normalize();else if(n[4].setComponents(c-l,d-u,g-m,E-y).normalize(),e===Ji)n[5].setComponents(c+l,d+u,g+m,E+y).normalize();else if(e===wr)n[5].setComponents(l,u,m,y).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),Vn.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),Vn.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(Vn)}intersectsSprite(t){Vn.center.set(0,0,0);const e=p0.distanceTo(t.center);return Vn.radius=.7071067811865476+e,Vn.applyMatrix4(t.matrixWorld),this.intersectsSphere(Vn)}intersectsSphere(t){const e=this.planes,i=t.center,n=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(i)<n)return!1;return!0}intersectsBox(t){const e=this.planes;for(let i=0;i<6;i++){const n=e[i];if(aa.x=n.normal.x>0?t.max.x:t.min.x,aa.y=n.normal.y>0?t.max.y:t.min.y,aa.z=n.normal.z>0?t.max.z:t.min.z,n.distanceToPoint(aa)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let i=0;i<6;i++)if(e[i].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class Ql extends On{constructor(t){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Kt(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}const Uh=new Se,tc=new Cd,oa=new Hs,la=new R;class Fh extends Oe{constructor(t=new Be,e=new Ql){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}intersectsFrustum(t){return t.intersectsObject(this)}raycast(t,e){const i=this.geometry,n=this.matrixWorld,r=t.params.Points.threshold,a=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),oa.copy(i.boundingSphere),oa.applyMatrix4(n),oa.radius+=r,t.ray.intersectsSphere(oa)===!1)return;Uh.copy(n).invert(),tc.copy(t.ray).applyMatrix4(Uh);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=i.index,f=i.attributes.position;if(c!==null){const u=Math.max(0,a.start),d=Math.min(c.count,a.start+a.count);for(let p=u,x=d;p<x;p++){const m=c.getX(p);la.fromBufferAttribute(f,m),Nh(la,m,l,n,t,e,this)}}else{const u=Math.max(0,a.start),d=Math.min(f.count,a.start+a.count);for(let p=u,x=d;p<x;p++)la.fromBufferAttribute(f,p),Nh(la,p,l,n,t,e,this)}}updateMorphTargets(){const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const n=e[i[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=n.length;r<a;r++){const o=n[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function Nh(s,t,e,i,n,r,a){const o=tc.distanceSqToPoint(s);if(o<e){const l=new R;tc.closestPointToPoint(s,l),l.applyMatrix4(i);const c=n.ray.origin.distanceTo(l);if(c<n.near||c>n.far)return;r.push({distance:c,distanceToRay:Math.sqrt(o),point:l,index:t,face:null,faceIndex:null,barycoord:null,object:a})}}class Pd extends ri{constructor(t=[],e=es,i,n,r,a,o,l,c,h){super(t,e,i,n,r,a,o,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class Cc extends ri{constructor(t,e,i,n,r,a,o,l,c){super(t,e,i,n,r,a,o,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Er extends ri{constructor(t,e,i=Qi,n,r,a,o=qe,l=qe,c,h=yn,f=1){if(h!==yn&&h!==jn)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const u={width:t,height:e,depth:f};super(u,n,r,a,o,l,h,i,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new wc(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return e.compareFunction=this.compareFunction,e}}class m0 extends Er{constructor(t,e=Qi,i=es,n,r,a=qe,o=qe,l,c=yn){const h={width:t,height:t,depth:1},f=[h,h,h,h,h,h];super(t,t,e,i,n,r,a,o,l,c),this.image=f,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(t){this.image=t}}class Rd extends ri{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this}}class wt extends Be{constructor(t=1,e=1,i=1,n=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:i,widthSegments:n,heightSegments:r,depthSegments:a};const o=this;n=Math.floor(n),r=Math.floor(r),a=Math.floor(a);const l=[],c=[],h=[],f=[];let u=0,d=0;p("z","y","x",-1,-1,i,e,t,a,r,0),p("z","y","x",1,-1,i,e,-t,a,r,1),p("x","z","y",1,1,t,i,e,n,a,2),p("x","z","y",1,-1,t,i,-e,n,a,3),p("x","y","z",1,-1,t,e,i,n,r,4),p("x","y","z",-1,-1,t,e,-i,n,r,5),this.setIndex(l),this.setAttribute("position",new pe(c,3)),this.setAttribute("normal",new pe(h,3)),this.setAttribute("uv",new pe(f,2));function p(x,m,g,b,A,y,E,M,T,v,w){const P=y/T,L=E/v,U=y/2,B=E/2,F=M/2,O=T+1,$=v+1;let V=0,nt=0;const X=new R;for(let Q=0;Q<$;Q++){const j=Q*L-B;for(let Ft=0;Ft<O;Ft++){const ut=Ft*P-U;X[x]=ut*b,X[m]=j*A,X[g]=F,c.push(X.x,X.y,X.z),X[x]=0,X[m]=0,X[g]=M>0?1:-1,h.push(X.x,X.y,X.z),f.push(Ft/T),f.push(1-Q/v),V+=1}}for(let Q=0;Q<v;Q++)for(let j=0;j<T;j++){const Ft=u+j+O*Q,ut=u+j+O*(Q+1),te=u+(j+1)+O*(Q+1),Zt=u+(j+1)+O*Q;l.push(Ft,ut,Zt),l.push(ut,te,Zt),nt+=6}o.addGroup(d,nt,w),d+=nt,u+=V}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new wt(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}class Ya extends Be{constructor(t=1,e=1,i=4,n=8,r=1){super(),this.type="CapsuleGeometry",this.parameters={radius:t,height:e,capSegments:i,radialSegments:n,heightSegments:r},e=Math.max(0,e),i=Math.max(1,Math.floor(i)),n=Math.max(3,Math.floor(n)),r=Math.max(1,Math.floor(r));const a=[],o=[],l=[],c=[],h=e/2,f=Math.PI/2*t,u=e,d=2*f+u,p=i*2+r,x=n+1,m=new R,g=new R;for(let b=0;b<=p;b++){let A=0,y=0,E=0,M=0;if(b<=i){const w=b/i,P=w*Math.PI/2;y=-h-t*Math.cos(P),E=t*Math.sin(P),M=-t*Math.cos(P),A=w*f}else if(b<=i+r){const w=(b-i)/r;y=-h+w*e,E=t,M=0,A=f+w*u}else{const w=(b-i-r)/i,P=w*Math.PI/2;y=h+t*Math.sin(P),E=t*Math.cos(P),M=t*Math.sin(P),A=f+u+w*f}const T=Math.max(0,Math.min(1,A/d));let v=0;b===0?v=.5/n:b===p&&(v=-.5/n);for(let w=0;w<=n;w++){const P=w/n,L=P*Math.PI*2,U=Math.sin(L),B=Math.cos(L);g.x=-E*B,g.y=y,g.z=E*U,o.push(g.x,g.y,g.z),m.set(-E*B,M,E*U),m.normalize(),l.push(m.x,m.y,m.z),c.push(P+v,T)}if(b>0){const w=(b-1)*x;for(let P=0;P<n;P++){const L=w+P,U=w+P+1,B=b*x+P,F=b*x+P+1;a.push(L,U,B),a.push(U,F,B)}}}this.setIndex(a),this.setAttribute("position",new pe(o,3)),this.setAttribute("normal",new pe(l,3)),this.setAttribute("uv",new pe(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ya(t.radius,t.height,t.capSegments,t.radialSegments,t.heightSegments)}}class Gs extends Be{constructor(t=1,e=32,i=0,n=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:i,thetaLength:n},e=Math.max(3,e);const r=[],a=[],o=[],l=[],c=new R,h=new ot;a.push(0,0,0),o.push(0,0,1),l.push(.5,.5);for(let f=0,u=3;f<=e;f++,u+=3){const d=i+f/e*n;c.x=t*Math.cos(d),c.y=t*Math.sin(d),a.push(c.x,c.y,c.z),o.push(0,0,1),h.x=(a[u]/t+1)/2,h.y=(a[u+1]/t+1)/2,l.push(h.x,h.y)}for(let f=1;f<=e;f++)r.push(f,f+1,0);this.setIndex(r),this.setAttribute("position",new pe(a,3)),this.setAttribute("normal",new pe(o,3)),this.setAttribute("uv",new pe(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Gs(t.radius,t.segments,t.thetaStart,t.thetaLength)}}class kt extends Be{constructor(t=1,e=1,i=1,n=32,r=1,a=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:i,radialSegments:n,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:l};const c=this;n=Math.floor(n),r=Math.floor(r);const h=[],f=[],u=[],d=[];let p=0;const x=[],m=i/2;let g=0;b(),a===!1&&(t>0&&A(!0),e>0&&A(!1)),this.setIndex(h),this.setAttribute("position",new pe(f,3)),this.setAttribute("normal",new pe(u,3)),this.setAttribute("uv",new pe(d,2));function b(){const y=new R,E=new R;let M=0;const T=(e-t)/i;for(let v=0;v<=r;v++){const w=[],P=v/r,L=P*(e-t)+t;for(let U=0;U<=n;U++){const B=U/n,F=B*l+o,O=Math.sin(F),$=Math.cos(F);E.x=L*O,E.y=-P*i+m,E.z=L*$,f.push(E.x,E.y,E.z),y.set(O,T,$).normalize(),u.push(y.x,y.y,y.z),d.push(B,1-P),w.push(p++)}x.push(w)}for(let v=0;v<n;v++)for(let w=0;w<r;w++){const P=x[w][v],L=x[w+1][v],U=x[w+1][v+1],B=x[w][v+1];(t>0||w!==0)&&(h.push(P,L,B),M+=3),(e>0||w!==r-1)&&(h.push(L,U,B),M+=3)}c.addGroup(g,M,0),g+=M}function A(y){const E=p,M=new ot,T=new R;let v=0;const w=y===!0?t:e,P=y===!0?1:-1;for(let U=1;U<=n;U++)f.push(0,m*P,0),u.push(0,P,0),d.push(.5,.5),p++;const L=p;for(let U=0;U<=n;U++){const F=U/n*l+o,O=Math.cos(F),$=Math.sin(F);T.x=w*$,T.y=m*P,T.z=w*O,f.push(T.x,T.y,T.z),u.push(0,P,0),M.x=O*.5+.5,M.y=$*.5*P+.5,d.push(M.x,M.y),p++}for(let U=0;U<n;U++){const B=E+U,F=L+U;y===!0?h.push(F,F+1,B):h.push(F+1,F,B),v+=3}c.addGroup(g,v,y===!0?1:2),g+=v}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new kt(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class ni extends kt{constructor(t=1,e=1,i=32,n=1,r=!1,a=0,o=Math.PI*2){super(0,t,e,i,n,r,a,o),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:i,heightSegments:n,openEnded:r,thetaStart:a,thetaLength:o}}static fromJSON(t){return new ni(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Pc extends Be{constructor(t=[],e=[],i=1,n=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:i,detail:n};const r=[],a=[];o(n),c(i),h(),this.setAttribute("position",new pe(r,3)),this.setAttribute("normal",new pe(r.slice(),3)),this.setAttribute("uv",new pe(a,2)),n===0?this.computeVertexNormals():this.normalizeNormals();function o(b){const A=new R,y=new R,E=new R;for(let M=0;M<e.length;M+=3)d(e[M+0],A),d(e[M+1],y),d(e[M+2],E),l(A,y,E,b)}function l(b,A,y,E){const M=E+1,T=[];for(let v=0;v<=M;v++){T[v]=[];const w=b.clone().lerp(y,v/M),P=A.clone().lerp(y,v/M),L=M-v;for(let U=0;U<=L;U++)U===0&&v===M?T[v][U]=w:T[v][U]=w.clone().lerp(P,U/L)}for(let v=0;v<M;v++)for(let w=0;w<2*(M-v)-1;w++){const P=Math.floor(w/2);w%2===0?(u(T[v][P+1]),u(T[v+1][P]),u(T[v][P])):(u(T[v][P+1]),u(T[v+1][P+1]),u(T[v+1][P]))}}function c(b){const A=new R;for(let y=0;y<r.length;y+=3)A.x=r[y+0],A.y=r[y+1],A.z=r[y+2],A.normalize().multiplyScalar(b),r[y+0]=A.x,r[y+1]=A.y,r[y+2]=A.z}function h(){const b=new R;for(let A=0;A<r.length;A+=3){b.x=r[A+0],b.y=r[A+1],b.z=r[A+2];const y=m(b)/2/Math.PI+.5,E=g(b)/Math.PI+.5;a.push(y,1-E)}p(),f()}function f(){for(let b=0;b<a.length;b+=6){const A=a[b+0],y=a[b+2],E=a[b+4],M=Math.max(A,y,E),T=Math.min(A,y,E);M>.9&&T<.1&&(A<.2&&(a[b+0]+=1),y<.2&&(a[b+2]+=1),E<.2&&(a[b+4]+=1))}}function u(b){r.push(b.x,b.y,b.z)}function d(b,A){const y=b*3;A.x=t[y+0],A.y=t[y+1],A.z=t[y+2]}function p(){const b=new R,A=new R,y=new R,E=new R,M=new ot,T=new ot,v=new ot;for(let w=0,P=0;w<r.length;w+=9,P+=6){b.set(r[w+0],r[w+1],r[w+2]),A.set(r[w+3],r[w+4],r[w+5]),y.set(r[w+6],r[w+7],r[w+8]),M.set(a[P+0],a[P+1]),T.set(a[P+2],a[P+3]),v.set(a[P+4],a[P+5]),E.copy(b).add(A).add(y).divideScalar(3);const L=m(E);x(M,P+0,b,L),x(T,P+2,A,L),x(v,P+4,y,L)}}function x(b,A,y,E){E<0&&b.x===1&&(a[A]=b.x-1),y.x===0&&y.z===0&&(a[A]=E/2/Math.PI+.5)}function m(b){return Math.atan2(b.z,-b.x)}function g(b){return Math.atan2(-b.y,Math.sqrt(b.x*b.x+b.z*b.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Pc(t.vertices,t.indices,t.radius,t.detail)}}class sn{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){Qt("Curve: .getPoint() not implemented.")}getPointAt(t,e){const i=this.getUtoTmapping(t);return this.getPoint(i,e)}getPoints(t=5){const e=[];for(let i=0;i<=t;i++)e.push(this.getPoint(i/t));return e}getSpacedPoints(t=5){const e=[];for(let i=0;i<=t;i++)e.push(this.getPointAt(i/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let i,n=this.getPoint(0),r=0;e.push(0);for(let a=1;a<=t;a++)i=this.getPoint(a/t),r+=i.distanceTo(n),e.push(r),n=i;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e=null){const i=this.getLengths();let n=0;const r=i.length;let a;e?a=e:a=t*i[r-1];let o=0,l=r-1,c;for(;o<=l;)if(n=Math.floor(o+(l-o)/2),c=i[n]-a,c<0)o=n+1;else if(c>0)l=n-1;else{l=n;break}if(n=l,i[n]===a)return n/(r-1);const h=i[n],u=i[n+1]-h,d=(a-h)/u;return(n+d)/(r-1)}getTangent(t,e){let n=t-1e-4,r=t+1e-4;n<0&&(n=0),r>1&&(r=1);const a=this.getPoint(n),o=this.getPoint(r),l=e||(a.isVector2?new ot:new R);return l.copy(o).sub(a).normalize(),l}getTangentAt(t,e){const i=this.getUtoTmapping(t);return this.getTangent(i,e)}computeFrenetFrames(t,e=!1){const i=new R,n=[],r=[],a=[],o=new R,l=new Se;for(let d=0;d<=t;d++){const p=d/t;n[d]=this.getTangentAt(p,new R)}r[0]=new R,a[0]=new R;let c=Number.MAX_VALUE;const h=Math.abs(n[0].x),f=Math.abs(n[0].y),u=Math.abs(n[0].z);h<=c&&(c=h,i.set(1,0,0)),f<=c&&(c=f,i.set(0,1,0)),u<=c&&i.set(0,0,1),o.crossVectors(n[0],i).normalize(),r[0].crossVectors(n[0],o),a[0].crossVectors(n[0],r[0]);for(let d=1;d<=t;d++){if(r[d]=r[d-1].clone(),a[d]=a[d-1].clone(),o.crossVectors(n[d-1],n[d]),o.length()>Number.EPSILON){o.normalize();const p=Math.acos(ue(n[d-1].dot(n[d]),-1,1));r[d].applyMatrix4(l.makeRotationAxis(o,p))}a[d].crossVectors(n[d],r[d])}if(e===!0){let d=Math.acos(ue(r[0].dot(r[t]),-1,1));d/=t,n[0].dot(o.crossVectors(r[0],r[t]))>0&&(d=-d);for(let p=1;p<=t;p++)r[p].applyMatrix4(l.makeRotationAxis(n[p],d*p)),a[p].crossVectors(n[p],r[p])}return{tangents:n,normals:r,binormals:a}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}class Rc extends sn{constructor(t=0,e=0,i=1,n=1,r=0,a=Math.PI*2,o=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=i,this.yRadius=n,this.aStartAngle=r,this.aEndAngle=a,this.aClockwise=o,this.aRotation=l}getPoint(t,e=new ot){const i=e,n=Math.PI*2;let r=this.aEndAngle-this.aStartAngle;const a=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=n;for(;r>n;)r-=n;r<Number.EPSILON&&(a?r=0:r=n),this.aClockwise===!0&&!a&&(r===n?r=-n:r=r-n);const o=this.aStartAngle+t*r;let l=this.aX+this.xRadius*Math.cos(o),c=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){const h=Math.cos(this.aRotation),f=Math.sin(this.aRotation),u=l-this.aX,d=c-this.aY;l=u*h-d*f+this.aX,c=u*f+d*h+this.aY}return i.set(l,c)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class g0 extends Rc{constructor(t,e,i,n,r,a){super(t,e,i,i,n,r,a),this.isArcCurve=!0,this.type="ArcCurve"}}function Lc(){let s=0,t=0,e=0,i=0;function n(r,a,o,l){s=r,t=o,e=-3*r+3*a-2*o-l,i=2*r-2*a+o+l}return{initCatmullRom:function(r,a,o,l,c){n(a,o,c*(o-r),c*(l-a))},initNonuniformCatmullRom:function(r,a,o,l,c,h,f){let u=(a-r)/c-(o-r)/(c+h)+(o-a)/h,d=(o-a)/h-(l-a)/(h+f)+(l-o)/f;u*=h,d*=h,n(a,o,u,d)},calc:function(r){const a=r*r,o=a*r;return s+t*r+e*a+i*o}}}const Oh=new R,Bh=new R,No=new Lc,Oo=new Lc,Bo=new Lc;class v0 extends sn{constructor(t=[],e=!1,i="centripetal",n=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=i,this.tension=n}getPoint(t,e=new R){const i=e,n=this.points,r=n.length,a=(r-(this.closed?0:1))*t;let o=Math.floor(a),l=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/r)+1)*r:l===0&&o===r-1&&(o=r-2,l=1);let c,h;this.closed||o>0?c=n[(o-1)%r]:(Bh.subVectors(n[0],n[1]).add(n[0]),c=Bh);const f=n[o%r],u=n[(o+1)%r];if(this.closed||o+2<r?h=n[(o+2)%r]:(Oh.subVectors(n[r-1],n[r-2]).add(n[r-1]),h=Oh),this.curveType==="centripetal"||this.curveType==="chordal"){const d=this.curveType==="chordal"?.5:.25;let p=Math.pow(c.distanceToSquared(f),d),x=Math.pow(f.distanceToSquared(u),d),m=Math.pow(u.distanceToSquared(h),d);x<1e-4&&(x=1),p<1e-4&&(p=x),m<1e-4&&(m=x),No.initNonuniformCatmullRom(c.x,f.x,u.x,h.x,p,x,m),Oo.initNonuniformCatmullRom(c.y,f.y,u.y,h.y,p,x,m),Bo.initNonuniformCatmullRom(c.z,f.z,u.z,h.z,p,x,m)}else this.curveType==="catmullrom"&&(No.initCatmullRom(c.x,f.x,u.x,h.x,this.tension),Oo.initCatmullRom(c.y,f.y,u.y,h.y,this.tension),Bo.initCatmullRom(c.z,f.z,u.z,h.z,this.tension));return i.set(No.calc(l),Oo.calc(l),Bo.calc(l)),i}copy(t){super.copy(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const n=t.points[e];this.points.push(n.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,i=this.points.length;e<i;e++){const n=this.points[e];t.points.push(n.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const n=t.points[e];this.points.push(new R().fromArray(n))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function zh(s,t,e,i,n){const r=(i-t)*.5,a=(n-e)*.5,o=s*s,l=s*o;return(2*e-2*i+r+a)*l+(-3*e+3*i-2*r-a)*o+r*s+e}function x0(s,t){const e=1-s;return e*e*t}function _0(s,t){return 2*(1-s)*s*t}function y0(s,t){return s*s*t}function mr(s,t,e,i){return x0(s,t)+_0(s,e)+y0(s,i)}function M0(s,t){const e=1-s;return e*e*e*t}function S0(s,t){const e=1-s;return 3*e*e*s*t}function b0(s,t){return 3*(1-s)*s*s*t}function w0(s,t){return s*s*s*t}function gr(s,t,e,i,n){return M0(s,t)+S0(s,e)+b0(s,i)+w0(s,n)}class Ld extends sn{constructor(t=new ot,e=new ot,i=new ot,n=new ot){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=i,this.v3=n}getPoint(t,e=new ot){const i=e,n=this.v0,r=this.v1,a=this.v2,o=this.v3;return i.set(gr(t,n.x,r.x,a.x,o.x),gr(t,n.y,r.y,a.y,o.y)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class E0 extends sn{constructor(t=new R,e=new R,i=new R,n=new R){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=i,this.v3=n}getPoint(t,e=new R){const i=e,n=this.v0,r=this.v1,a=this.v2,o=this.v3;return i.set(gr(t,n.x,r.x,a.x,o.x),gr(t,n.y,r.y,a.y,o.y),gr(t,n.z,r.z,a.z,o.z)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class kd extends sn{constructor(t=new ot,e=new ot){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new ot){const i=e;return t===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(t).add(this.v1)),i}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new ot){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class T0 extends sn{constructor(t=new R,e=new R){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new R){const i=e;return t===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(t).add(this.v1)),i}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new R){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Id extends sn{constructor(t=new ot,e=new ot,i=new ot){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=i}getPoint(t,e=new ot){const i=e,n=this.v0,r=this.v1,a=this.v2;return i.set(mr(t,n.x,r.x,a.x),mr(t,n.y,r.y,a.y)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class A0 extends sn{constructor(t=new R,e=new R,i=new R){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=i}getPoint(t,e=new R){const i=e,n=this.v0,r=this.v1,a=this.v2;return i.set(mr(t,n.x,r.x,a.x),mr(t,n.y,r.y,a.y),mr(t,n.z,r.z,a.z)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Dd extends sn{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new ot){const i=e,n=this.points,r=(n.length-1)*t,a=Math.floor(r),o=r-a,l=n[a===0?a:a-1],c=n[a],h=n[a>n.length-2?n.length-1:a+1],f=n[a>n.length-3?n.length-1:a+2];return i.set(zh(o,l.x,c.x,h.x,f.x),zh(o,l.y,c.y,h.y,f.y)),i}copy(t){super.copy(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const n=t.points[e];this.points.push(n.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,i=this.points.length;e<i;e++){const n=this.points[e];t.points.push(n.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const n=t.points[e];this.points.push(new ot().fromArray(n))}return this}}var ec=Object.freeze({__proto__:null,ArcCurve:g0,CatmullRomCurve3:v0,CubicBezierCurve:Ld,CubicBezierCurve3:E0,EllipseCurve:Rc,LineCurve:kd,LineCurve3:T0,QuadraticBezierCurve:Id,QuadraticBezierCurve3:A0,SplineCurve:Dd});class C0 extends sn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){const t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){const i=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new ec[i](e,t))}return this}getPoint(t,e){const i=t*this.getLength(),n=this.getCurveLengths();let r=0;for(;r<n.length;){if(n[r]>=i){const a=n[r]-i,o=this.curves[r],l=o.getLength(),c=l===0?0:1-a/l;return o.getPointAt(c,e)}r++}return null}getLength(){const t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const t=[];let e=0;for(let i=0,n=this.curves.length;i<n;i++)e+=this.curves[i].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){const e=[];for(let i=0;i<=t;i++)e.push(this.getPoint(i/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){const e=[];let i;for(let n=0,r=this.curves;n<r.length;n++){const a=r[n],o=a.isEllipseCurve?t*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?t*a.points.length:t,l=a.getPoints(o);for(let c=0;c<l.length;c++){const h=l[c];i&&i.equals(h)||(e.push(h),i=h)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,i=t.curves.length;e<i;e++){const n=t.curves[e];this.curves.push(n.clone())}return this.autoClose=t.autoClose,this}toJSON(){const t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,i=this.curves.length;e<i;e++){const n=this.curves[e];t.curves.push(n.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,i=t.curves.length;e<i;e++){const n=t.curves[e];this.curves.push(new ec[n.type]().fromJSON(n))}return this}}class Hh extends C0{constructor(t){super(),this.type="Path",this.currentPoint=new ot,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,i=t.length;e<i;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){const i=new kd(this.currentPoint.clone(),new ot(t,e));return this.curves.push(i),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,i,n){const r=new Id(this.currentPoint.clone(),new ot(t,e),new ot(i,n));return this.curves.push(r),this.currentPoint.set(i,n),this}bezierCurveTo(t,e,i,n,r,a){const o=new Ld(this.currentPoint.clone(),new ot(t,e),new ot(i,n),new ot(r,a));return this.curves.push(o),this.currentPoint.set(r,a),this}splineThru(t){const e=[this.currentPoint.clone()].concat(t),i=new Dd(e);return this.curves.push(i),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,i,n,r,a){const o=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(t+o,e+l,i,n,r,a),this}absarc(t,e,i,n,r,a){return this.absellipse(t,e,i,i,n,r,a),this}ellipse(t,e,i,n,r,a,o,l){const c=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(t+c,e+h,i,n,r,a,o,l),this}absellipse(t,e,i,n,r,a,o,l){const c=new Rc(t,e,i,n,r,a,o,l);if(this.curves.length>0){const f=c.getPoint(0);f.equals(this.currentPoint)||this.lineTo(f.x,f.y)}this.curves.push(c);const h=c.getPoint(1);return this.currentPoint.copy(h),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){const t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}}class Tr extends Hh{constructor(t){super(t),this.uuid=vn(),this.type="Shape",this.holes=[]}getPointsHoles(t){const e=[];for(let i=0,n=this.holes.length;i<n;i++)e[i]=this.holes[i].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,i=t.holes.length;e<i;e++){const n=t.holes[e];this.holes.push(n.clone())}return this}toJSON(){const t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,i=this.holes.length;e<i;e++){const n=this.holes[e];t.holes.push(n.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,i=t.holes.length;e<i;e++){const n=t.holes[e];this.holes.push(new Hh().fromJSON(n))}return this}}function P0(s,t,e=2){const i=t&&t.length,n=i?t[0]*e:s.length;let r=Ud(s,0,n,e,!0);const a=[];if(!r||r.next===r.prev)return a;let o,l,c;if(i&&(r=D0(s,t,r,e)),s.length>80*e){o=s[0],l=s[1];let h=o,f=l;for(let u=e;u<n;u+=e){const d=s[u],p=s[u+1];d<o&&(o=d),p<l&&(l=p),d>h&&(h=d),p>f&&(f=p)}c=Math.max(h-o,f-l),c=c!==0?32767/c:0}return Ar(r,a,e,o,l,c,0),a}function Ud(s,t,e,i,n){let r;if(n===X0(s,t,e,i)>0)for(let a=t;a<e;a+=i)r=Gh(a/i|0,s[a],s[a+1],r);else for(let a=e-i;a>=t;a-=i)r=Gh(a/i|0,s[a],s[a+1],r);return r&&Bs(r,r.next)&&(Pr(r),r=r.next),r}function ns(s,t){if(!s)return s;t||(t=s);let e=s,i;do if(i=!1,!e.steiner&&(Bs(e,e.next)||Fe(e.prev,e,e.next)===0)){if(Pr(e),e=t=e.prev,e===e.next)break;i=!0}else e=e.next;while(i||e!==t);return t}function Ar(s,t,e,i,n,r,a){if(!s)return;!a&&r&&B0(s,i,n,r);let o=s;for(;s.prev!==s.next;){const l=s.prev,c=s.next;if(r?L0(s,i,n,r):R0(s)){t.push(l.i,s.i,c.i),Pr(s),s=c.next,o=c.next;continue}if(s=c,s===o){a?a===1?(s=k0(ns(s),t),Ar(s,t,e,i,n,r,2)):a===2&&I0(s,t,e,i,n,r):Ar(ns(s),t,e,i,n,r,1);break}}}function R0(s){const t=s.prev,e=s,i=s.next;if(Fe(t,e,i)>=0)return!1;const n=t.x,r=e.x,a=i.x,o=t.y,l=e.y,c=i.y,h=Math.min(n,r,a),f=Math.min(o,l,c),u=Math.max(n,r,a),d=Math.max(o,l,c);let p=i.next;for(;p!==t;){if(p.x>=h&&p.x<=u&&p.y>=f&&p.y<=d&&lr(n,o,r,l,a,c,p.x,p.y)&&Fe(p.prev,p,p.next)>=0)return!1;p=p.next}return!0}function L0(s,t,e,i){const n=s.prev,r=s,a=s.next;if(Fe(n,r,a)>=0)return!1;const o=n.x,l=r.x,c=a.x,h=n.y,f=r.y,u=a.y,d=Math.min(o,l,c),p=Math.min(h,f,u),x=Math.max(o,l,c),m=Math.max(h,f,u),g=ic(d,p,t,e,i),b=ic(x,m,t,e,i);let A=s.prevZ,y=s.nextZ;for(;A&&A.z>=g&&y&&y.z<=b;){if(A.x>=d&&A.x<=x&&A.y>=p&&A.y<=m&&A!==n&&A!==a&&lr(o,h,l,f,c,u,A.x,A.y)&&Fe(A.prev,A,A.next)>=0||(A=A.prevZ,y.x>=d&&y.x<=x&&y.y>=p&&y.y<=m&&y!==n&&y!==a&&lr(o,h,l,f,c,u,y.x,y.y)&&Fe(y.prev,y,y.next)>=0))return!1;y=y.nextZ}for(;A&&A.z>=g;){if(A.x>=d&&A.x<=x&&A.y>=p&&A.y<=m&&A!==n&&A!==a&&lr(o,h,l,f,c,u,A.x,A.y)&&Fe(A.prev,A,A.next)>=0)return!1;A=A.prevZ}for(;y&&y.z<=b;){if(y.x>=d&&y.x<=x&&y.y>=p&&y.y<=m&&y!==n&&y!==a&&lr(o,h,l,f,c,u,y.x,y.y)&&Fe(y.prev,y,y.next)>=0)return!1;y=y.nextZ}return!0}function k0(s,t){let e=s;do{const i=e.prev,n=e.next.next;!Bs(i,n)&&Nd(i,e,e.next,n)&&Cr(i,n)&&Cr(n,i)&&(t.push(i.i,e.i,n.i),Pr(e),Pr(e.next),e=s=n),e=e.next}while(e!==s);return ns(e)}function I0(s,t,e,i,n,r){let a=s;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&G0(a,o)){let l=Od(a,o);a=ns(a,a.next),l=ns(l,l.next),Ar(a,t,e,i,n,r,0),Ar(l,t,e,i,n,r,0);return}o=o.next}a=a.next}while(a!==s)}function D0(s,t,e,i){const n=[];for(let r=0,a=t.length;r<a;r++){const o=t[r]*i,l=r<a-1?t[r+1]*i:s.length,c=Ud(s,o,l,i,!1);c===c.next&&(c.steiner=!0),n.push(H0(c))}n.sort(U0);for(let r=0;r<n.length;r++)e=F0(n[r],e);return e}function U0(s,t){let e=s.x-t.x;if(e===0&&(e=s.y-t.y,e===0)){const i=(s.next.y-s.y)/(s.next.x-s.x),n=(t.next.y-t.y)/(t.next.x-t.x);e=i-n}return e}function F0(s,t){const e=N0(s,t);if(!e)return t;const i=Od(e,s);return ns(i,i.next),ns(e,e.next)}function N0(s,t){let e=t;const i=s.x,n=s.y;let r=-1/0,a;if(Bs(s,e))return e;do{if(Bs(s,e.next))return e.next;if(n<=e.y&&n>=e.next.y&&e.next.y!==e.y){const f=e.x+(n-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(f<=i&&f>r&&(r=f,a=e.x<e.next.x?e:e.next,f===i))return a}e=e.next}while(e!==t);if(!a)return null;const o=a,l=a.x,c=a.y;let h=1/0;e=a;do{if(i>=e.x&&e.x>=l&&i!==e.x&&Fd(n<c?i:r,n,l,c,n<c?r:i,n,e.x,e.y)){const f=Math.abs(n-e.y)/(i-e.x);Cr(e,s)&&(f<h||f===h&&(e.x>a.x||e.x===a.x&&O0(a,e)))&&(a=e,h=f)}e=e.next}while(e!==o);return a}function O0(s,t){return Fe(s.prev,s,t.prev)<0&&Fe(t.next,s,s.next)<0}function B0(s,t,e,i){let n=s;do n.z===0&&(n.z=ic(n.x,n.y,t,e,i)),n.prevZ=n.prev,n.nextZ=n.next,n=n.next;while(n!==s);n.prevZ.nextZ=null,n.prevZ=null,z0(n)}function z0(s){let t,e=1;do{let i=s,n;s=null;let r=null;for(t=0;i;){t++;let a=i,o=0;for(let c=0;c<e&&(o++,a=a.nextZ,!!a);c++);let l=e;for(;o>0||l>0&&a;)o!==0&&(l===0||!a||i.z<=a.z)?(n=i,i=i.nextZ,o--):(n=a,a=a.nextZ,l--),r?r.nextZ=n:s=n,n.prevZ=r,r=n;i=a}r.nextZ=null,e*=2}while(t>1);return s}function ic(s,t,e,i,n){return s=(s-e)*n|0,t=(t-i)*n|0,s=(s|s<<8)&16711935,s=(s|s<<4)&252645135,s=(s|s<<2)&858993459,s=(s|s<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,s|t<<1}function H0(s){let t=s,e=s;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==s);return e}function Fd(s,t,e,i,n,r,a,o){return(n-a)*(t-o)>=(s-a)*(r-o)&&(s-a)*(i-o)>=(e-a)*(t-o)&&(e-a)*(r-o)>=(n-a)*(i-o)}function lr(s,t,e,i,n,r,a,o){return!(s===a&&t===o)&&Fd(s,t,e,i,n,r,a,o)}function G0(s,t){return s.next.i!==t.i&&s.prev.i!==t.i&&!V0(s,t)&&(Cr(s,t)&&Cr(t,s)&&W0(s,t)&&(Fe(s.prev,s,t.prev)||Fe(s,t.prev,t))||Bs(s,t)&&Fe(s.prev,s,s.next)>0&&Fe(t.prev,t,t.next)>0)}function Fe(s,t,e){return(t.y-s.y)*(e.x-t.x)-(t.x-s.x)*(e.y-t.y)}function Bs(s,t){return s.x===t.x&&s.y===t.y}function Nd(s,t,e,i){const n=ha(Fe(s,t,e)),r=ha(Fe(s,t,i)),a=ha(Fe(e,i,s)),o=ha(Fe(e,i,t));return!!(n!==r&&a!==o||n===0&&ca(s,e,t)||r===0&&ca(s,i,t)||a===0&&ca(e,s,i)||o===0&&ca(e,t,i))}function ca(s,t,e){return t.x<=Math.max(s.x,e.x)&&t.x>=Math.min(s.x,e.x)&&t.y<=Math.max(s.y,e.y)&&t.y>=Math.min(s.y,e.y)}function ha(s){return s>0?1:s<0?-1:0}function V0(s,t){let e=s;do{if(e.i!==s.i&&e.next.i!==s.i&&e.i!==t.i&&e.next.i!==t.i&&Nd(e,e.next,s,t))return!0;e=e.next}while(e!==s);return!1}function Cr(s,t){return Fe(s.prev,s,s.next)<0?Fe(s,t,s.next)>=0&&Fe(s,s.prev,t)>=0:Fe(s,t,s.prev)<0||Fe(s,s.next,t)<0}function W0(s,t){let e=s,i=!1;const n=(s.x+t.x)/2,r=(s.y+t.y)/2;do e.y>r!=e.next.y>r&&e.next.y!==e.y&&n<(e.next.x-e.x)*(r-e.y)/(e.next.y-e.y)+e.x&&(i=!i),e=e.next;while(e!==s);return i}function Od(s,t){const e=nc(s.i,s.x,s.y),i=nc(t.i,t.x,t.y),n=s.next,r=t.prev;return s.next=t,t.prev=s,e.next=n,n.prev=e,i.next=e,e.prev=i,r.next=i,i.prev=r,i}function Gh(s,t,e,i){const n=nc(s,t,e);return i?(n.next=i.next,n.prev=i,i.next.prev=n,i.next=n):(n.prev=n,n.next=n),n}function Pr(s){s.next.prev=s.prev,s.prev.next=s.next,s.prevZ&&(s.prevZ.nextZ=s.nextZ),s.nextZ&&(s.nextZ.prevZ=s.prevZ)}function nc(s,t,e){return{i:s,x:t,y:e,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function X0(s,t,e,i){let n=0;for(let r=t,a=e-i;r<e;r+=i)n+=(s[a]-s[r])*(s[r+1]+s[a+1]),a=r;return n}class q0{static triangulate(t,e,i=2){return P0(t,e,i)}}class mn{static area(t){const e=t.length;let i=0;for(let n=e-1,r=0;r<e;n=r++)i+=t[n].x*t[r].y-t[r].x*t[n].y;return i*.5}static isClockWise(t){return mn.area(t)<0}static triangulateShape(t,e){const i=[],n=[],r=[];Vh(t),Wh(i,t);let a=t.length;e.forEach(Vh);for(let l=0;l<e.length;l++)n.push(a),a+=e[l].length,Wh(i,e[l]);const o=q0.triangulate(i,n);for(let l=0;l<o.length;l+=3)r.push(o.slice(l,l+3));return r}}function Vh(s){const t=s.length;t>2&&s[t-1].equals(s[0])&&s.pop()}function Wh(s,t){for(let e=0;e<t.length;e++)s.push(t[e].x),s.push(t[e].y)}class kc extends Be{constructor(t=new Tr([new ot(.5,.5),new ot(-.5,.5),new ot(-.5,-.5),new ot(.5,-.5)]),e={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:t,options:e},t=Array.isArray(t)?t:[t];const i=this,n=[],r=[];for(let o=0,l=t.length;o<l;o++){const c=t[o];a(c)}this.setAttribute("position",new pe(n,3)),this.setAttribute("uv",new pe(r,2)),this.computeVertexNormals();function a(o){const l=[],c=e.curveSegments!==void 0?e.curveSegments:12,h=e.steps!==void 0?e.steps:1,f=e.depth!==void 0?e.depth:1;let u=e.bevelEnabled!==void 0?e.bevelEnabled:!0,d=e.bevelThickness!==void 0?e.bevelThickness:.2,p=e.bevelSize!==void 0?e.bevelSize:d-.1,x=e.bevelOffset!==void 0?e.bevelOffset:0,m=e.bevelSegments!==void 0?e.bevelSegments:3;const g=e.extrudePath,b=e.UVGenerator!==void 0?e.UVGenerator:K0;let A,y=!1,E,M,T,v;if(g){A=g.getSpacedPoints(h),y=!0,u=!1;const it=g.isCatmullRomCurve3?g.closed:!1;E=g.computeFrenetFrames(h,it),M=new R,T=new R,v=new R}u||(m=0,d=0,p=0,x=0);const w=o.extractPoints(c);let P=w.shape;const L=w.holes;if(!mn.isClockWise(P)){P=P.reverse();for(let it=0,rt=L.length;it<rt;it++){const lt=L[it];mn.isClockWise(lt)&&(L[it]=lt.reverse())}}function B(it){const lt=10000000000000001e-36;let ct=it[0];for(let ft=1;ft<=it.length;ft++){const Wt=ft%it.length,Gt=it[Wt],jt=Gt.x-ct.x,ie=Gt.y-ct.y,k=jt*jt+ie*ie,_e=Math.max(Math.abs(Gt.x),Math.abs(Gt.y),Math.abs(ct.x),Math.abs(ct.y)),ce=lt*_e*_e;if(k<=ce){it.splice(Wt,1),ft--;continue}ct=Gt}}B(P),L.forEach(B);const F=L.length,O=P;for(let it=0;it<F;it++){const rt=L[it];P=P.concat(rt)}function $(it,rt,lt){return rt||me("ExtrudeGeometry: vec does not exist"),it.clone().addScaledVector(rt,lt)}const V=P.length;function nt(it,rt,lt){let ct,ft,Wt;const Gt=it.x-rt.x,jt=it.y-rt.y,ie=lt.x-it.x,k=lt.y-it.y,_e=Gt*Gt+jt*jt,ce=Gt*k-jt*ie;if(Math.abs(ce)>Number.EPSILON){const C=Math.sqrt(_e),_=Math.sqrt(ie*ie+k*k),N=rt.x-jt/C,G=rt.y+Gt/C,K=lt.x-k/_,ht=lt.y+ie/_,dt=((K-N)*k-(ht-G)*ie)/(Gt*k-jt*ie);ct=N+Gt*dt-it.x,ft=G+jt*dt-it.y;const Y=ct*ct+ft*ft;if(Y<=2)return new ot(ct,ft);Wt=Math.sqrt(Y/2)}else{let C=!1;Gt>Number.EPSILON?ie>Number.EPSILON&&(C=!0):Gt<-Number.EPSILON?ie<-Number.EPSILON&&(C=!0):Math.sign(jt)===Math.sign(k)&&(C=!0),C?(ct=-jt,ft=Gt,Wt=Math.sqrt(_e)):(ct=Gt,ft=jt,Wt=Math.sqrt(_e/2))}return new ot(ct/Wt,ft/Wt)}const X=[];for(let it=0,rt=O.length,lt=rt-1,ct=it+1;it<rt;it++,lt++,ct++)lt===rt&&(lt=0),ct===rt&&(ct=0),X[it]=nt(O[it],O[lt],O[ct]);const Q=[];let j,Ft=X.concat();for(let it=0,rt=F;it<rt;it++){const lt=L[it];j=[];for(let ct=0,ft=lt.length,Wt=ft-1,Gt=ct+1;ct<ft;ct++,Wt++,Gt++)Wt===ft&&(Wt=0),Gt===ft&&(Gt=0),j[ct]=nt(lt[ct],lt[Wt],lt[Gt]);Q.push(j),Ft=Ft.concat(j)}let ut;if(m===0)ut=mn.triangulateShape(O,L);else{const it=[],rt=[];for(let lt=0;lt<m;lt++){const ct=lt/m,ft=d*Math.cos(ct*Math.PI/2),Wt=p*Math.sin(ct*Math.PI/2)+x;for(let Gt=0,jt=O.length;Gt<jt;Gt++){const ie=$(O[Gt],X[Gt],Wt);Mt(ie.x,ie.y,-ft),ct===0&&it.push(ie)}for(let Gt=0,jt=F;Gt<jt;Gt++){const ie=L[Gt];j=Q[Gt];const k=[];for(let _e=0,ce=ie.length;_e<ce;_e++){const C=$(ie[_e],j[_e],Wt);Mt(C.x,C.y,-ft),ct===0&&k.push(C)}ct===0&&rt.push(k)}}ut=mn.triangulateShape(it,rt)}const te=ut.length,Zt=p+x;for(let it=0;it<V;it++){const rt=u?$(P[it],Ft[it],Zt):P[it];y?(T.copy(E.normals[0]).multiplyScalar(rt.x),M.copy(E.binormals[0]).multiplyScalar(rt.y),v.copy(A[0]).add(T).add(M),Mt(v.x,v.y,v.z)):Mt(rt.x,rt.y,0)}for(let it=1;it<=h;it++)for(let rt=0;rt<V;rt++){const lt=u?$(P[rt],Ft[rt],Zt):P[rt];y?(T.copy(E.normals[it]).multiplyScalar(lt.x),M.copy(E.binormals[it]).multiplyScalar(lt.y),v.copy(A[it]).add(T).add(M),Mt(v.x,v.y,v.z)):Mt(lt.x,lt.y,f/h*it)}for(let it=m-1;it>=0;it--){const rt=it/m,lt=d*Math.cos(rt*Math.PI/2),ct=p*Math.sin(rt*Math.PI/2)+x;for(let ft=0,Wt=O.length;ft<Wt;ft++){const Gt=$(O[ft],X[ft],ct);Mt(Gt.x,Gt.y,f+lt)}for(let ft=0,Wt=L.length;ft<Wt;ft++){const Gt=L[ft];j=Q[ft];for(let jt=0,ie=Gt.length;jt<ie;jt++){const k=$(Gt[jt],j[jt],ct);y?Mt(k.x,k.y+A[h-1].y,A[h-1].x+lt):Mt(k.x,k.y,f+lt)}}}ee(),Z();function ee(){const it=n.length/3;if(u){let rt=0,lt=V*rt;for(let ct=0;ct<te;ct++){const ft=ut[ct];$t(ft[2]+lt,ft[1]+lt,ft[0]+lt)}rt=h+m*2,lt=V*rt;for(let ct=0;ct<te;ct++){const ft=ut[ct];$t(ft[0]+lt,ft[1]+lt,ft[2]+lt)}}else{for(let rt=0;rt<te;rt++){const lt=ut[rt];$t(lt[2],lt[1],lt[0])}for(let rt=0;rt<te;rt++){const lt=ut[rt];$t(lt[0]+V*h,lt[1]+V*h,lt[2]+V*h)}}i.addGroup(it,n.length/3-it,0)}function Z(){const it=n.length/3;let rt=0;et(O,rt),rt+=O.length;for(let lt=0,ct=L.length;lt<ct;lt++){const ft=L[lt];et(ft,rt),rt+=ft.length}i.addGroup(it,n.length/3-it,1)}function et(it,rt){let lt=it.length;for(;--lt>=0;){const ct=lt;let ft=lt-1;ft<0&&(ft=it.length-1);for(let Wt=0,Gt=h+m*2;Wt<Gt;Wt++){const jt=V*Wt,ie=V*(Wt+1),k=rt+ct+jt,_e=rt+ft+jt,ce=rt+ft+ie,C=rt+ct+ie;Tt(k,_e,ce,C)}}}function Mt(it,rt,lt){l.push(it),l.push(rt),l.push(lt)}function $t(it,rt,lt){Jt(it),Jt(rt),Jt(lt);const ct=n.length/3,ft=b.generateTopUV(i,n,ct-3,ct-2,ct-1);be(ft[0]),be(ft[1]),be(ft[2])}function Tt(it,rt,lt,ct){Jt(it),Jt(rt),Jt(ct),Jt(rt),Jt(lt),Jt(ct);const ft=n.length/3,Wt=b.generateSideWallUV(i,n,ft-6,ft-3,ft-2,ft-1);be(Wt[0]),be(Wt[1]),be(Wt[3]),be(Wt[1]),be(Wt[2]),be(Wt[3])}function Jt(it){n.push(l[it*3+0]),n.push(l[it*3+1]),n.push(l[it*3+2])}function be(it){r.push(it.x),r.push(it.y)}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON(),e=this.parameters.shapes,i=this.parameters.options;return $0(e,i,t)}static fromJSON(t,e){const i=[];for(let r=0,a=t.shapes.length;r<a;r++){const o=e[t.shapes[r]];i.push(o)}const n=t.options.extrudePath;return n!==void 0&&(t.options.extrudePath=new ec[n.type]().fromJSON(n)),new kc(i,t.options)}}const K0={generateTopUV:function(s,t,e,i,n){const r=t[e*3],a=t[e*3+1],o=t[i*3],l=t[i*3+1],c=t[n*3],h=t[n*3+1];return[new ot(r,a),new ot(o,l),new ot(c,h)]},generateSideWallUV:function(s,t,e,i,n,r){const a=t[e*3],o=t[e*3+1],l=t[e*3+2],c=t[i*3],h=t[i*3+1],f=t[i*3+2],u=t[n*3],d=t[n*3+1],p=t[n*3+2],x=t[r*3],m=t[r*3+1],g=t[r*3+2];return Math.abs(o-h)<Math.abs(a-c)?[new ot(a,1-l),new ot(c,1-f),new ot(u,1-p),new ot(x,1-g)]:[new ot(o,1-l),new ot(h,1-f),new ot(d,1-p),new ot(m,1-g)]}};function $0(s,t,e){if(e.shapes=[],Array.isArray(s))for(let i=0,n=s.length;i<n;i++){const r=s[i];e.shapes.push(r.uuid)}else e.shapes.push(s.uuid);return e.options=Object.assign({},t),t.extrudePath!==void 0&&(e.options.extrudePath=t.extrudePath.toJSON()),e}class Ic extends Pc{constructor(t=1,e=0){const i=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],n=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(i,n,t,e),this.type="OctahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new Ic(t.radius,t.detail)}}class Fi extends Be{constructor(t=1,e=1,i=1,n=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:i,heightSegments:n};const r=t/2,a=e/2,o=Math.floor(i),l=Math.floor(n),c=o+1,h=l+1,f=t/o,u=e/l,d=[],p=[],x=[],m=[];for(let g=0;g<h;g++){const b=g*u-a;for(let A=0;A<c;A++){const y=A*f-r;p.push(y,-b,0),x.push(0,0,1),m.push(A/o),m.push(1-g/l)}}for(let g=0;g<l;g++)for(let b=0;b<o;b++){const A=b+c*g,y=b+c*(g+1),E=b+1+c*(g+1),M=b+1+c*g;d.push(A,y,M),d.push(y,E,M)}this.setIndex(d),this.setAttribute("position",new pe(p,3)),this.setAttribute("normal",new pe(x,3)),this.setAttribute("uv",new pe(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Fi(t.width,t.height,t.widthSegments,t.heightSegments)}}class kr extends Be{constructor(t=.5,e=1,i=32,n=1,r=0,a=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:t,outerRadius:e,thetaSegments:i,phiSegments:n,thetaStart:r,thetaLength:a},i=Math.max(3,i),n=Math.max(1,n);const o=[],l=[],c=[],h=[];let f=t;const u=(e-t)/n,d=new R,p=new ot;for(let x=0;x<=n;x++){for(let m=0;m<=i;m++){const g=r+m/i*a;d.x=f*Math.cos(g),d.y=f*Math.sin(g),l.push(d.x,d.y,d.z),c.push(0,0,1),p.x=(d.x/e+1)/2,p.y=(d.y/e+1)/2,h.push(p.x,p.y)}f+=u}for(let x=0;x<n;x++){const m=x*(i+1);for(let g=0;g<i;g++){const b=g+m,A=b,y=b+i+1,E=b+i+2,M=b+1;o.push(A,y,M),o.push(y,E,M)}}this.setIndex(o),this.setAttribute("position",new pe(l,3)),this.setAttribute("normal",new pe(c,3)),this.setAttribute("uv",new pe(h,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new kr(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}}class Za extends Be{constructor(t=new Tr([new ot(0,.5),new ot(-.5,-.5),new ot(.5,-.5)]),e=12){super(),this.type="ShapeGeometry",this.parameters={shapes:t,curveSegments:e};const i=[],n=[],r=[],a=[];let o=0,l=0;if(Array.isArray(t)===!1)c(t);else for(let h=0;h<t.length;h++)c(t[h]),this.addGroup(o,l,h),o+=l,l=0;this.setIndex(i),this.setAttribute("position",new pe(n,3)),this.setAttribute("normal",new pe(r,3)),this.setAttribute("uv",new pe(a,2));function c(h){const f=n.length/3,u=h.extractPoints(e);let d=u.shape;const p=u.holes;mn.isClockWise(d)===!1&&(d=d.reverse());for(let m=0,g=p.length;m<g;m++){const b=p[m];mn.isClockWise(b)===!0&&(p[m]=b.reverse())}const x=mn.triangulateShape(d,p);for(let m=0,g=p.length;m<g;m++){const b=p[m];d=d.concat(b)}for(let m=0,g=d.length;m<g;m++){const b=d[m];n.push(b.x,b.y,0),r.push(0,0,1),a.push(b.x,b.y)}for(let m=0,g=x.length;m<g;m++){const b=x[m],A=b[0]+f,y=b[1]+f,E=b[2]+f;i.push(A,y,E),l+=3}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON(),e=this.parameters.shapes;return Y0(e,t)}static fromJSON(t,e){const i=[];for(let n=0,r=t.shapes.length;n<r;n++){const a=e[t.shapes[n]];i.push(a)}return new Za(i,t.curveSegments)}}function Y0(s,t){if(t.shapes=[],Array.isArray(s))for(let e=0,i=s.length;e<i;e++){const n=s[e];t.shapes.push(n.uuid)}else t.shapes.push(s.uuid);return t}class Rt extends Be{constructor(t=1,e=32,i=16,n=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:i,phiStart:n,phiLength:r,thetaStart:a,thetaLength:o},e=Math.max(3,Math.floor(e)),i=Math.max(2,Math.floor(i));const l=Math.min(a+o,Math.PI);let c=0;const h=[],f=new R,u=new R,d=[],p=[],x=[],m=[];for(let g=0;g<=i;g++){const b=[],A=g/i,y=a+A*o,E=t*Math.cos(y),M=Math.sqrt(t*t-E*E);let T=0;g===0&&a===0?T=.5/e:g===i&&l===Math.PI&&(T=-.5/e);for(let v=0;v<=e;v++){const w=v/e,P=n+w*r;f.x=-M*Math.cos(P),f.y=E,f.z=M*Math.sin(P),p.push(f.x,f.y,f.z),u.copy(f).normalize(),x.push(u.x,u.y,u.z),m.push(w+T,1-A),b.push(c++)}h.push(b)}for(let g=0;g<i;g++)for(let b=0;b<e;b++){const A=h[g][b+1],y=h[g][b],E=h[g+1][b],M=h[g+1][b+1];(g!==0||a>0)&&d.push(A,y,M),(g!==i-1||l<Math.PI)&&d.push(y,E,M)}this.setIndex(d),this.setAttribute("position",new pe(p,3)),this.setAttribute("normal",new pe(x,3)),this.setAttribute("uv",new pe(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Rt(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class He extends Be{constructor(t=1,e=.4,i=12,n=48,r=Math.PI*2,a=0,o=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:i,tubularSegments:n,arc:r,thetaStart:a,thetaLength:o},i=Math.floor(i),n=Math.floor(n);const l=[],c=[],h=[],f=[],u=new R,d=new R,p=new R;for(let x=0;x<=i;x++){const m=a+x/i*o;for(let g=0;g<=n;g++){const b=g/n*r;d.x=(t+e*Math.cos(m))*Math.cos(b),d.y=(t+e*Math.cos(m))*Math.sin(b),d.z=e*Math.sin(m),c.push(d.x,d.y,d.z),u.x=t*Math.cos(b),u.y=t*Math.sin(b),p.subVectors(d,u).normalize(),h.push(p.x,p.y,p.z),f.push(g/n),f.push(x/i)}}for(let x=1;x<=i;x++)for(let m=1;m<=n;m++){const g=(n+1)*x+m-1,b=(n+1)*(x-1)+m-1,A=(n+1)*(x-1)+m,y=(n+1)*x+m;l.push(g,b,y),l.push(b,A,y)}this.setIndex(l),this.setAttribute("position",new pe(c,3)),this.setAttribute("normal",new pe(h,3)),this.setAttribute("uv",new pe(f,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new He(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc,t.thetaStart,t.thetaLength)}}function zs(s){const t={};for(const e in s){t[e]={};for(const i in s[e]){const n=s[e][i];if(Xh(n))n.isRenderTargetTexture?(Qt("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][i]=null):t[e][i]=n.clone();else if(Array.isArray(n))if(Xh(n[0])){const r=[];for(let a=0,o=n.length;a<o;a++)r[a]=n[a].clone();t[e][i]=r}else t[e][i]=n.slice();else t[e][i]=n}}return t}function li(s){const t={};for(let e=0;e<s.length;e++){const i=zs(s[e]);for(const n in i)t[n]=i[n]}return t}function Xh(s){return s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)}function Z0(s){const t=[];for(let e=0;e<s.length;e++)t.push(s[e].clone());return t}function Bd(s){const t=s.getRenderTarget();return t===null?s.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:de.workingColorSpace}const J0={clone:zs,merge:li};var j0=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Q0=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Bi extends On{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=j0,this.fragmentShader=Q0,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=zs(t.uniforms),this.uniformsGroups=Z0(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this.defaultAttributeValues=Object.assign({},t.defaultAttributeValues),this.index0AttributeName=t.index0AttributeName,this.uniformsNeedUpdate=t.uniformsNeedUpdate,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const n in this.uniforms){const a=this.uniforms[n].value;a&&a.isTexture?e.uniforms[n]={type:"t",value:a.toJSON(t).uuid}:a&&a.isColor?e.uniforms[n]={type:"c",value:a.getHex()}:a&&a.isVector2?e.uniforms[n]={type:"v2",value:a.toArray()}:a&&a.isVector3?e.uniforms[n]={type:"v3",value:a.toArray()}:a&&a.isVector4?e.uniforms[n]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?e.uniforms[n]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?e.uniforms[n]={type:"m4",value:a.toArray()}:e.uniforms[n]={value:a}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const i={};for(const n in this.extensions)this.extensions[n]===!0&&(i[n]=!0);return Object.keys(i).length>0&&(e.extensions=i),e}fromJSON(t,e){if(super.fromJSON(t,e),t.uniforms!==void 0)for(const i in t.uniforms){const n=t.uniforms[i];switch(this.uniforms[i]={},n.type){case"t":this.uniforms[i].value=e[n.value]||null;break;case"c":this.uniforms[i].value=new Kt().setHex(n.value);break;case"v2":this.uniforms[i].value=new ot().fromArray(n.value);break;case"v3":this.uniforms[i].value=new R().fromArray(n.value);break;case"v4":this.uniforms[i].value=new Ue().fromArray(n.value);break;case"m3":this.uniforms[i].value=new ne().fromArray(n.value);break;case"m4":this.uniforms[i].value=new Se().fromArray(n.value);break;default:this.uniforms[i].value=n.value}}if(t.defines!==void 0&&(this.defines=t.defines),t.vertexShader!==void 0&&(this.vertexShader=t.vertexShader),t.fragmentShader!==void 0&&(this.fragmentShader=t.fragmentShader),t.glslVersion!==void 0&&(this.glslVersion=t.glslVersion),t.extensions!==void 0)for(const i in t.extensions)this.extensions[i]=t.extensions[i];return t.lights!==void 0&&(this.lights=t.lights),t.clipping!==void 0&&(this.clipping=t.clipping),this}}class tm extends Bi{constructor(t){super(t),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class Ni extends On{constructor(t){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Kt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Kt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Da,this.normalScale=new ot(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Un,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class cr extends On{constructor(t){super(),this.isMeshToonMaterial=!0,this.defines={TOON:""},this.type="MeshToonMaterial",this.color=new Kt(16777215),this.map=null,this.gradientMap=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Kt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Da,this.normalScale=new ot(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.alphaMap=null,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.gradientMap=t.gradientMap,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.alphaMap=t.alphaMap,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}class em extends On{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Rp,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class im extends On{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}class Dc extends Oe{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new Kt(t),this.intensity=e}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,e}}class zd extends Dc{constructor(t,e,i){super(t,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Oe.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Kt(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}toJSON(t){const e=super.toJSON(t);return e.object.groundColor=this.groundColor.getHex(),e}}const zo=new Se,qh=new R,Kh=new R;class Hd{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new ot(512,512),this.mapType=bi,this.map=null,this.mapPass=null,this.matrix=new Se,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Ac,this._frameExtents=new ot(1,1),this._viewportCount=1,this._viewports=[new Ue(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera;qh.setFromMatrixPosition(t.matrixWorld),e.position.copy(qh),Kh.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(Kh),e.updateMatrixWorld(),this._updateMatrix(e,this.matrix,this._frustum)}_updateMatrix(t,e,i,n){zo.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),i.setFromProjectionMatrix(zo,t.coordinateSystem,t.reversedDepth);const r=this._frameExtents,a=n?n.z/r.x:1,o=n?n.w/r.y:1,l=n?n.x/r.x:0,c=n?n.y/r.y:0;t.coordinateSystem===wr||t.reversedDepth?e.set(.5*a,0,0,.5*a+l,0,.5*o,0,.5*o+c,0,0,1,0,0,0,0,1):e.set(.5*a,0,0,.5*a+l,0,.5*o,0,.5*o+c,0,0,.5,.5,0,0,0,1),e.multiply(zo)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.autoUpdate=t.autoUpdate,this.needsUpdate=t.needsUpdate,this.normalBias=t.normalBias,this.blurSamples=t.blurSamples,this.mapSize.copy(t.mapSize),this.biasNode=t.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return t.intensity=this.intensity,t.bias=this.bias,t.normalBias=this.normalBias,t.radius=this.radius,t.blurSamples=this.blurSamples,t.mapSize=this.mapSize.toArray(),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}const ua=new R,da=new nn,Gi=new R;class Gd extends Oe{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Se,this.projectionMatrix=new Se,this.projectionMatrixInverse=new Se,this.coordinateSystem=Ji,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorld.decompose(ua,da,Gi),Gi.x===1&&Gi.y===1&&Gi.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(ua,da,Gi.set(1,1,1)).invert()}updateWorldMatrix(t,e,i=!1){super.updateWorldMatrix(t,e,i),this.matrixWorld.decompose(ua,da,Gi),Gi.x===1&&Gi.y===1&&Gi.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(ua,da,Gi.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}}const Pn=new R,$h=new ot,Yh=new ot;class vi extends Gd{constructor(t=50,e=1,i=.1,n=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=i,this.far=n,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=jl*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(po*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return jl*2*Math.atan(Math.tan(po*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,i){Pn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(Pn.x,Pn.y).multiplyScalar(-t/Pn.z),Pn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(Pn.x,Pn.y).multiplyScalar(-t/Pn.z)}getViewSize(t,e){return this.getViewBounds(t,$h,Yh),e.subVectors(Yh,$h)}setViewOffset(t,e,i,n,r,a){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=n,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(po*.5*this.fov)/this.zoom,i=2*e,n=this.aspect*i,r=-.5*n;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;r+=a.offsetX*n/l,e-=a.offsetY*i/c,n*=a.width/l,i*=a.height/c}const o=this.filmOffset;o!==0&&(r+=t*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+n,e,e-i,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}class nm extends Hd{constructor(){super(new vi(90,1,.5,500)),this.isPointLightShadow=!0}}class Zh extends Dc{constructor(t,e,i=0,n=2){super(t,e),this.isPointLight=!0,this.type="PointLight",this.distance=i,this.decay=n,this.shadow=new nm}get power(){return this.intensity*4*Math.PI}set power(t){this.intensity=t/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.decay=t.decay,this.shadow=t.shadow.clone(),this}toJSON(t){const e=super.toJSON(t);return e.object.distance=this.distance,e.object.decay=this.decay,e.object.shadow=this.shadow.toJSON(),e}}class Uc extends Gd{constructor(t=-1,e=1,i=1,n=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=i,this.bottom=n,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,i,n,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=n,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,n=(this.top+this.bottom)/2;let r=i-t,a=i+t,o=n+e,l=n-e;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,a=r+c*this.view.width,o-=h*this.view.offsetY,l=o-h*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}class sm extends Hd{constructor(){super(new Uc(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Ha extends Dc{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Oe.DEFAULT_UP),this.updateMatrix(),this.target=new Oe,this.shadow=new sm}dispose(){super.dispose(),this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}toJSON(t){const e=super.toJSON(t);return e.object.shadow=this.shadow.toJSON(),e.object.target=this.target.uuid,e}}const ws=-90,Es=1;class rm extends Oe{constructor(t,e,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const n=new vi(ws,Es,t,e);n.layers=this.layers,this.add(n);const r=new vi(ws,Es,t,e);r.layers=this.layers,this.add(r);const a=new vi(ws,Es,t,e);a.layers=this.layers,this.add(a);const o=new vi(ws,Es,t,e);o.layers=this.layers,this.add(o);const l=new vi(ws,Es,t,e);l.layers=this.layers,this.add(l);const c=new vi(ws,Es,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[i,n,r,a,o,l]=e;for(const c of e)this.remove(c);if(t===Ji)i.up.set(0,1,0),i.lookAt(1,0,0),n.up.set(0,1,0),n.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===wr)i.up.set(0,-1,0),i.lookAt(-1,0,0),n.up.set(0,-1,0),n.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:n}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,l,c,h]=this.children,f=t.getRenderTarget(),u=t.getActiveCubeFace(),d=t.getActiveMipmapLevel(),p=t.xr.enabled;t.xr.enabled=!1;const x=i.texture.generateMipmaps;i.texture.generateMipmaps=!1;let m=!1;t.isWebGLRenderer===!0?m=t.state.buffers.depth.getReversed():m=t.reversedDepthBuffer,t.setRenderTarget(i,0,n),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,r),t.setRenderTarget(i,1,n),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,a),t.setRenderTarget(i,2,n),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,o),t.setRenderTarget(i,3,n),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,l),t.setRenderTarget(i,4,n),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,c),i.texture.generateMipmaps=x,t.setRenderTarget(i,5,n),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,h),t.setRenderTarget(f,u,d),t.xr.enabled=p,i.texture.needsPMREMUpdate=!0}}class am extends vi{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t}}const $c=class $c{constructor(t,e,i,n){this.elements=[1,0,0,1],t!==void 0&&this.set(t,e,i,n)}identity(){return this.set(1,0,0,1),this}fromArray(t,e=0){for(let i=0;i<4;i++)this.elements[i]=t[i+e];return this}set(t,e,i,n){const r=this.elements;return r[0]=t,r[2]=e,r[1]=i,r[3]=n,this}};$c.prototype.isMatrix2=!0;let Jh=$c;function jh(s,t,e,i){const n=om(i);switch(e){case gd:return s*t;case xc:return s*t/n.components*n.byteLength;case _c:return s*t/n.components*n.byteLength;case is:return s*t*2/n.components*n.byteLength;case yc:return s*t*2/n.components*n.byteLength;case vd:return s*t*3/n.components*n.byteLength;case Ci:return s*t*4/n.components*n.byteLength;case Mc:return s*t*4/n.components*n.byteLength;case Ma:case Sa:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*8;case ba:case wa:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*16;case bl:case El:return Math.max(s,16)*Math.max(t,8)/4;case Sl:case wl:return Math.max(s,8)*Math.max(t,8)/2;case Tl:case Al:case Pl:case Rl:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*8;case Cl:case ka:case Ll:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*16;case kl:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*16;case Il:return Math.floor((s+4)/5)*Math.floor((t+3)/4)*16;case Dl:return Math.floor((s+4)/5)*Math.floor((t+4)/5)*16;case Ul:return Math.floor((s+5)/6)*Math.floor((t+4)/5)*16;case Fl:return Math.floor((s+5)/6)*Math.floor((t+5)/6)*16;case Nl:return Math.floor((s+7)/8)*Math.floor((t+4)/5)*16;case Ol:return Math.floor((s+7)/8)*Math.floor((t+5)/6)*16;case Bl:return Math.floor((s+7)/8)*Math.floor((t+7)/8)*16;case zl:return Math.floor((s+9)/10)*Math.floor((t+4)/5)*16;case Hl:return Math.floor((s+9)/10)*Math.floor((t+5)/6)*16;case Gl:return Math.floor((s+9)/10)*Math.floor((t+7)/8)*16;case Vl:return Math.floor((s+9)/10)*Math.floor((t+9)/10)*16;case Wl:return Math.floor((s+11)/12)*Math.floor((t+9)/10)*16;case Xl:return Math.floor((s+11)/12)*Math.floor((t+11)/12)*16;case ql:case Kl:case $l:return Math.ceil(s/4)*Math.ceil(t/4)*16;case Yl:case Zl:return Math.ceil(s/4)*Math.ceil(t/4)*8;case Ia:case Jl:return Math.ceil(s/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function om(s){switch(s){case bi:case dd:return{byteLength:1,components:1};case Sr:case fd:case tn:return{byteLength:2,components:1};case gc:case vc:return{byteLength:2,components:4};case Qi:case mc:case Di:return{byteLength:4,components:1};case pd:case md:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${s}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:pc}}));typeof window<"u"&&(window.__THREE__?Qt("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=pc);function Vd(){let s=null,t=!1,e=null,i=null;function n(r,a){i=s.requestAnimationFrame(n),e(r,a)}return{start:function(){t!==!0&&e!==null&&s!==null&&(i=s.requestAnimationFrame(n),t=!0)},stop:function(){s!==null&&s.cancelAnimationFrame(i),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){s=r}}}function lm(s){const t=new WeakMap;function e(o,l){const c=o.array,h=o.usage,f=c.byteLength,u=s.createBuffer();s.bindBuffer(l,u),s.bufferData(l,c,h),o.onUploadCallback();let d;if(c instanceof Float32Array)d=s.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)d=s.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?d=s.HALF_FLOAT:d=s.UNSIGNED_SHORT;else if(c instanceof Int16Array)d=s.SHORT;else if(c instanceof Uint32Array)d=s.UNSIGNED_INT;else if(c instanceof Int32Array)d=s.INT;else if(c instanceof Int8Array)d=s.BYTE;else if(c instanceof Uint8Array)d=s.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)d=s.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:u,type:d,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:f}}function i(o,l,c){const h=l.array,f=l.updateRanges;if(s.bindBuffer(c,o),f.length===0)s.bufferSubData(c,0,h);else{f.sort((d,p)=>d.start-p.start);let u=0;for(let d=1;d<f.length;d++){const p=f[u],x=f[d];x.start<=p.start+p.count+1?p.count=Math.max(p.count,x.start+x.count-p.start):(++u,f[u]=x)}f.length=u+1;for(let d=0,p=f.length;d<p;d++){const x=f[d];s.bufferSubData(c,x.start*h.BYTES_PER_ELEMENT,h,x.start,x.count)}l.clearUpdateRanges()}l.onUploadCallback()}function n(o){return o.isInterleavedBufferAttribute&&(o=o.data),t.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=t.get(o);l&&(s.deleteBuffer(l.buffer),t.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const h=t.get(o);(!h||h.version<o.version)&&t.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=t.get(o);if(c===void 0)t.set(o,e(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,o,l),c.version=o.version}}return{get:n,remove:r,update:a}}var cm=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,hm=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,um=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,dm=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,fm=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,pm=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,mm=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,gm=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,vm=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,xm=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,_m=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,ym=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Mm=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,Sm=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,bm=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,wm=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,Em=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Tm=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Am=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Cm=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,Pm=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,Rm=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,Lm=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,km=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Im=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,Dm=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,Um=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Fm=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Nm=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Om=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Bm="gl_FragColor = linearToOutputTexel( gl_FragColor );",zm=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Hm=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,Gm=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,Vm=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,Wm=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Xm=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,qm=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Km=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,$m=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Ym=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Zm=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Jm=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,jm=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Qm=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,tg=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_SUN_LIGHTS > 0
	struct SunLight {
		vec3 direction;
		vec3 color;
	};
	uniform SunLight sunLights[ NUM_SUN_LIGHTS ];
	void getSunLightInfo( const in SunLight sunLight, out IncidentLight light ) {
		light.color = sunLight.color;
		light.direction = sunLight.direction;
		light.visible = true;
	}
#endif
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,eg=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_RETROREFLECTION
		vec3 getIBLRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 retroVec = normalize( mix( viewDir, normal, pow4( roughness ) ) );
				retroVec = transformDirectionByInverseViewMatrix( retroVec, viewMatrix );
				vec4 envMapColor = textureCubeUV( envMap, envMapRotation * retroVec, roughness );
				return envMapColor.rgb * envMapIntensity;
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
		#ifdef USE_RETROREFLECTION
			vec3 getIBLAnisotropyRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
				#ifdef ENVMAP_TYPE_CUBE_UV
					vec3 bentNormal = cross( bitangent, viewDir );
					bentNormal = normalize( cross( bentNormal, bitangent ) );
					bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
					return getIBLRetroRadiance( viewDir, bentNormal, roughness );
				#else
					return vec3( 0.0 );
				#endif
			}
		#endif
	#endif
#endif`,ig=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,ng=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,sg=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,rg=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,ag=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_RETROREFLECTION
	material.retroreflectivity = retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,og=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	vec2 dfg;
	vec3 multiScatteringCompensation;
	#ifdef USE_RETROREFLECTION
		float retroreflectivity;
	#endif
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0Dielectric;
		vec3 iridescenceF0Metallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec2 fab, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec2 fab, const in vec3 specularColor, const in float specularF90, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	vec3 specularBRDF = BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	#ifdef USE_RETROREFLECTION
		vec3 retroViewDir = reflect( - geometryViewDir, geometryNormal );
		vec3 retroSpecularBRDF = BRDF_GGX( directLight.direction, retroViewDir, geometryNormal, material );
		specularBRDF = mix( specularBRDF, retroSpecularBRDF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directSpecular += irradiance * specularBRDF * material.multiScatteringCompensation;
	vec3 halfDir = normalize( directLight.direction + geometryViewDir );
	float dotVH = saturate( dot( geometryViewDir, halfDir ) );
	vec3 F = F_Schlick( material.specularColor, material.specularF90, dotVH );
	#ifdef USE_RETROREFLECTION
		vec3 retroHalfDir = normalize( directLight.direction + retroViewDir );
		float dotRetroVH = saturate( dot( retroViewDir, retroHalfDir ) );
		vec3 retroF = F_Schlick( material.specularColor, material.specularF90, dotRetroVH );
		F = mix( F, retroF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - F );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScattering, multiScattering );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScattering, multiScattering );
	#endif
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - singleScattering - multiScattering );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		sheenSpecularIndirect += irradiance * material.sheenColor * sheenAlbedo * RECIPROCAL_PI;
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( material.dfg, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceF0Metallic, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( material.dfg, material.diffuseColor, material.specularF90, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,lg=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		vec3 iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		vec3 iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( iridescenceFresnelDielectric, iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0Dielectric = Schlick_to_F0( iridescenceFresnelDielectric, 1.0, dotNVi );
		material.iridescenceF0Metallic = Schlick_to_F0( iridescenceFresnelMetallic, 1.0, dotNVi );
	}
#endif
#ifdef STANDARD
	float dotNVms = saturate( dot( geometryNormal, geometryViewDir ) );
	material.dfg = texture2D( dfgLUT, vec2( material.roughness, dotNVms ) ).rg;
	#if ( NUM_SUN_LIGHTS > 0 || NUM_DIR_LIGHTS > 0 || NUM_POINT_LIGHTS > 0 || NUM_SPOT_LIGHTS > 0 )
		float EssMs = material.dfg.x + material.dfg.y;
		material.multiScatteringCompensation = 1.0 + material.specularColorBlended * ( 1.0 / EssMs - 1.0 );
	#endif
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SUN_LIGHTS > 0 ) && defined( RE_Direct )
	SunLight sunLight;
	#if defined( USE_SHADOWMAP ) && NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHTS; i ++ ) {
		sunLight = sunLights[ i ];
		getSunLightInfo( sunLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SUN_LIGHT_SHADOWS )
		sunLightShadow = sunLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getSunShadow( sunShadowMap[ i ], sunLightShadow, UNROLLED_LOOP_INDEX ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,cg=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		vec3 iblRadiance = getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		vec3 iblRadiance = getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_RETROREFLECTION
		#ifdef USE_ANISOTROPY
			vec3 retroIBLRadiance = getIBLAnisotropyRetroRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
		#else
			vec3 retroIBLRadiance = getIBLRetroRadiance( geometryViewDir, geometryNormal, material.roughness );
		#endif
		iblRadiance = mix( iblRadiance, retroIBLRadiance, saturate( material.retroreflectivity ) );
	#endif
	radiance += iblRadiance;
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,hg=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,ug=`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,dg=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,fg=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,pg=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,mg=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,gg=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,vg=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,xg=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,_g=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,yg=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Mg=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Sg=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,bg=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,wg=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Eg=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,Tg=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Ag=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,Cg=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,Pg=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Rg=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Lg=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,kg=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,Ig=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Dg=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Ug=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Fg=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Ng=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Og=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,Bg=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,zg=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Hg=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Gg=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Vg=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Wg=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Xg=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		#define SUN_LIGHT_CASCADES 2
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#else
			uniform sampler2D sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#endif
		uniform mat4 sunShadowMatrix[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		uniform vec4 sunShadowCascade[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
		struct SunLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SunLightShadow sunLightShadows[ NUM_SUN_LIGHT_SHADOWS ];
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_SUN_LIGHT_SHADOWS > 0
		float getSunShadow(
			#if defined( SHADOWMAP_TYPE_PCF )
				sampler2DShadow shadowMap,
			#else
				sampler2D shadowMap,
			#endif
			SunLightShadow sunLightShadow,
			int shadowIndex
		) {
			vec4 shadowWorldPosition = vec4( vSunShadowWorldPosition.xyz + vSunShadowWorldNormal * sunLightShadow.shadowNormalBias, 1.0 );
			float viewDepth = vSunShadowWorldPosition.w;
			int cascadeOffset = shadowIndex * SUN_LIGHT_CASCADES;
			float shadow = 1.0;
			for ( int i = SUN_LIGHT_CASCADES - 1; i >= 0; i -- ) {
				vec4 cascade = sunShadowCascade[ cascadeOffset + i ];
				if ( viewDepth >= cascade.x && viewDepth < cascade.y ) {
					float cascadeShadow = getShadow(
						shadowMap,
						sunLightShadow.shadowMapSize,
						sunLightShadow.shadowIntensity,
						sunLightShadow.shadowBias,
						sunLightShadow.shadowRadius,
						sunShadowMatrix[ cascadeOffset + i ] * shadowWorldPosition
					);
					shadow = mix( cascadeShadow, shadow, smoothstep( cascade.z, cascade.y, viewDepth ) );
				}
			}
			return shadow;
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,qg=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Kg=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_SUN_LIGHT_SHADOWS > 0
		vSunShadowWorldPosition = vec4( worldPosition.xyz, - mvPosition.z );
		vSunShadowWorldNormal = shadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,$g=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHT_SHADOWS; i ++ ) {
		sunLight = sunLightShadows[ i ];
		shadow *= receiveShadow ? getSunShadow( sunShadowMap[ i ], sunLight, UNROLLED_LOOP_INDEX ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Yg=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Zg=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Jg=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,jg=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Qg=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,tv=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,ev=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,iv=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,nv=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,sv=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,rv=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,av=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,ov=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,lv=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const cv=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,hv=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,uv=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,dv=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,fv=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,pv=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,mv=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,gv=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,vv=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,xv=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,_v=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,yv=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Mv=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Sv=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,bv=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,wv=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Ev=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Tv=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Av=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,Cv=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Pv=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,Rv=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,Lv=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,kv=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Iv=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,Dv=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_RETROREFLECTION
	uniform float retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Uv=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Fv=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Nv=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,Ov=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Bv=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,zv=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Hv=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Gv=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,le={alphahash_fragment:cm,alphahash_pars_fragment:hm,alphamap_fragment:um,alphamap_pars_fragment:dm,alphatest_fragment:fm,alphatest_pars_fragment:pm,aomap_fragment:mm,aomap_pars_fragment:gm,batching_pars_vertex:vm,batching_vertex:xm,begin_vertex:_m,beginnormal_vertex:ym,bsdfs:Mm,iridescence_fragment:Sm,bumpmap_pars_fragment:bm,clipping_planes_fragment:wm,clipping_planes_pars_fragment:Em,clipping_planes_pars_vertex:Tm,clipping_planes_vertex:Am,color_fragment:Cm,color_pars_fragment:Pm,color_pars_vertex:Rm,color_vertex:Lm,common:km,cube_uv_reflection_fragment:Im,defaultnormal_vertex:Dm,displacementmap_pars_vertex:Um,displacementmap_vertex:Fm,emissivemap_fragment:Nm,emissivemap_pars_fragment:Om,colorspace_fragment:Bm,colorspace_pars_fragment:zm,envmap_fragment:Hm,envmap_common_pars_fragment:Gm,envmap_pars_fragment:Vm,envmap_pars_vertex:Wm,envmap_physical_pars_fragment:eg,envmap_vertex:Xm,fog_vertex:qm,fog_pars_vertex:Km,fog_fragment:$m,fog_pars_fragment:Ym,gradientmap_pars_fragment:Zm,lightmap_pars_fragment:Jm,lights_lambert_fragment:jm,lights_lambert_pars_fragment:Qm,lights_pars_begin:tg,lights_toon_fragment:ig,lights_toon_pars_fragment:ng,lights_phong_fragment:sg,lights_phong_pars_fragment:rg,lights_physical_fragment:ag,lights_physical_pars_fragment:og,lights_fragment_begin:lg,lights_fragment_maps:cg,lights_fragment_end:hg,lightprobes_pars_fragment:ug,logdepthbuf_fragment:dg,logdepthbuf_pars_fragment:fg,logdepthbuf_pars_vertex:pg,logdepthbuf_vertex:mg,map_fragment:gg,map_pars_fragment:vg,map_particle_fragment:xg,map_particle_pars_fragment:_g,metalnessmap_fragment:yg,metalnessmap_pars_fragment:Mg,morphinstance_vertex:Sg,morphcolor_vertex:bg,morphnormal_vertex:wg,morphtarget_pars_vertex:Eg,morphtarget_vertex:Tg,normal_fragment_begin:Ag,normal_fragment_maps:Cg,normal_pars_fragment:Pg,normal_pars_vertex:Rg,normal_vertex:Lg,normalmap_pars_fragment:kg,clearcoat_normal_fragment_begin:Ig,clearcoat_normal_fragment_maps:Dg,clearcoat_pars_fragment:Ug,iridescence_pars_fragment:Fg,opaque_fragment:Ng,packing:Og,premultiplied_alpha_fragment:Bg,project_vertex:zg,dithering_fragment:Hg,dithering_pars_fragment:Gg,roughnessmap_fragment:Vg,roughnessmap_pars_fragment:Wg,shadowmap_pars_fragment:Xg,shadowmap_pars_vertex:qg,shadowmap_vertex:Kg,shadowmask_pars_fragment:$g,skinbase_vertex:Yg,skinning_pars_vertex:Zg,skinning_vertex:Jg,skinnormal_vertex:jg,specularmap_fragment:Qg,specularmap_pars_fragment:tv,tonemapping_fragment:ev,tonemapping_pars_fragment:iv,transmission_fragment:nv,transmission_pars_fragment:sv,uv_pars_fragment:rv,uv_pars_vertex:av,uv_vertex:ov,worldpos_vertex:lv,background_vert:cv,background_frag:hv,backgroundCube_vert:uv,backgroundCube_frag:dv,cube_vert:fv,cube_frag:pv,depth_vert:mv,depth_frag:gv,distance_vert:vv,distance_frag:xv,equirect_vert:_v,equirect_frag:yv,linedashed_vert:Mv,linedashed_frag:Sv,meshbasic_vert:bv,meshbasic_frag:wv,meshlambert_vert:Ev,meshlambert_frag:Tv,meshmatcap_vert:Av,meshmatcap_frag:Cv,meshnormal_vert:Pv,meshnormal_frag:Rv,meshphong_vert:Lv,meshphong_frag:kv,meshphysical_vert:Iv,meshphysical_frag:Dv,meshtoon_vert:Uv,meshtoon_frag:Fv,points_vert:Nv,points_frag:Ov,shadow_vert:Bv,shadow_frag:zv,sprite_vert:Hv,sprite_frag:Gv},yt={common:{diffuse:{value:new Kt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new ne},alphaMap:{value:null},alphaMapTransform:{value:new ne},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new ne}},envmap:{envMap:{value:null},envMapRotation:{value:new ne},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new ne}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new ne}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new ne},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new ne},normalScale:{value:new ot(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new ne},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new ne}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new ne}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new ne}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Kt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new R},probesMax:{value:new R},probesResolution:{value:new R}},points:{diffuse:{value:new Kt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new ne},alphaTest:{value:0},uvTransform:{value:new ne}},sprite:{diffuse:{value:new Kt(16777215)},opacity:{value:1},center:{value:new ot(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new ne},alphaMap:{value:null},alphaMapTransform:{value:new ne},alphaTest:{value:0}}},Ki={basic:{uniforms:li([yt.common,yt.specularmap,yt.envmap,yt.aomap,yt.lightmap,yt.fog]),vertexShader:le.meshbasic_vert,fragmentShader:le.meshbasic_frag},lambert:{uniforms:li([yt.common,yt.specularmap,yt.envmap,yt.aomap,yt.lightmap,yt.emissivemap,yt.bumpmap,yt.normalmap,yt.displacementmap,yt.fog,yt.lights,{emissive:{value:new Kt(0)},envMapIntensity:{value:1}}]),vertexShader:le.meshlambert_vert,fragmentShader:le.meshlambert_frag},phong:{uniforms:li([yt.common,yt.specularmap,yt.envmap,yt.aomap,yt.lightmap,yt.emissivemap,yt.bumpmap,yt.normalmap,yt.displacementmap,yt.fog,yt.lights,{emissive:{value:new Kt(0)},specular:{value:new Kt(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:le.meshphong_vert,fragmentShader:le.meshphong_frag},standard:{uniforms:li([yt.common,yt.envmap,yt.aomap,yt.lightmap,yt.emissivemap,yt.bumpmap,yt.normalmap,yt.displacementmap,yt.roughnessmap,yt.metalnessmap,yt.fog,yt.lights,{emissive:{value:new Kt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:le.meshphysical_vert,fragmentShader:le.meshphysical_frag},toon:{uniforms:li([yt.common,yt.aomap,yt.lightmap,yt.emissivemap,yt.bumpmap,yt.normalmap,yt.displacementmap,yt.gradientmap,yt.fog,yt.lights,{emissive:{value:new Kt(0)}}]),vertexShader:le.meshtoon_vert,fragmentShader:le.meshtoon_frag},matcap:{uniforms:li([yt.common,yt.bumpmap,yt.normalmap,yt.displacementmap,yt.fog,{matcap:{value:null}}]),vertexShader:le.meshmatcap_vert,fragmentShader:le.meshmatcap_frag},points:{uniforms:li([yt.points,yt.fog]),vertexShader:le.points_vert,fragmentShader:le.points_frag},dashed:{uniforms:li([yt.common,yt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:le.linedashed_vert,fragmentShader:le.linedashed_frag},depth:{uniforms:li([yt.common,yt.displacementmap]),vertexShader:le.depth_vert,fragmentShader:le.depth_frag},normal:{uniforms:li([yt.common,yt.bumpmap,yt.normalmap,yt.displacementmap,{opacity:{value:1}}]),vertexShader:le.meshnormal_vert,fragmentShader:le.meshnormal_frag},sprite:{uniforms:li([yt.sprite,yt.fog]),vertexShader:le.sprite_vert,fragmentShader:le.sprite_frag},background:{uniforms:{uvTransform:{value:new ne},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:le.background_vert,fragmentShader:le.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new ne}},vertexShader:le.backgroundCube_vert,fragmentShader:le.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:le.cube_vert,fragmentShader:le.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:le.equirect_vert,fragmentShader:le.equirect_frag},distance:{uniforms:li([yt.common,yt.displacementmap,{referencePosition:{value:new R},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:le.distance_vert,fragmentShader:le.distance_frag},shadow:{uniforms:li([yt.lights,yt.fog,{color:{value:new Kt(0)},opacity:{value:1}}]),vertexShader:le.shadow_vert,fragmentShader:le.shadow_frag}};Ki.physical={uniforms:li([Ki.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new ne},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new ne},clearcoatNormalScale:{value:new ot(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new ne},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new ne},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new ne},sheen:{value:0},sheenColor:{value:new Kt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new ne},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new ne},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new ne},transmissionSamplerSize:{value:new ot},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new ne},attenuationDistance:{value:0},attenuationColor:{value:new Kt(0)},specularColor:{value:new Kt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new ne},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new ne},anisotropyVector:{value:new ot},anisotropyMap:{value:null},anisotropyMapTransform:{value:new ne}}]),vertexShader:le.meshphysical_vert,fragmentShader:le.meshphysical_frag};const fa={r:0,b:0,g:0},Vv=new Se,Wd=new ne;Wd.set(-1,0,0,0,1,0,0,0,1);function Wv(s,t,e,i,n,r){const a=new Kt(0);let o=n===!0?0:1,l,c,h=null,f=0,u=null;function d(b){let A=b.isScene===!0?b.background:null;if(A&&A.isTexture){const y=b.backgroundBlurriness>0;A=t.get(A,y)}return A}function p(b){let A=!1;const y=d(b);y===null?m(a,o):y&&y.isColor&&(m(y,1),A=!0);const E=s.xr.getEnvironmentBlendMode();E==="additive"?e.buffers.color.setClear(0,0,0,1,r):E==="alpha-blend"&&e.buffers.color.setClear(0,0,0,0,r),(s.autoClear||A)&&(e.buffers.depth.setTest(!0),e.buffers.depth.setMask(!0),e.buffers.color.setMask(!0),s.clear(s.autoClearColor,s.autoClearDepth,s.autoClearStencil))}function x(b,A){const y=d(A);y&&(y.isCubeTexture||y.mapping===$a)?(c===void 0&&(c=new qt(new wt(1,1,1),new Bi({name:"BackgroundCubeMaterial",uniforms:zs(Ki.backgroundCube.uniforms),vertexShader:Ki.backgroundCube.vertexShader,fragmentShader:Ki.backgroundCube.fragmentShader,side:Je,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(E,M,T){this.matrixWorld.copyPosition(T.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(c)),c.material.uniforms.envMap.value=y,c.material.uniforms.backgroundBlurriness.value=A.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=A.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(Vv.makeRotationFromEuler(A.backgroundRotation)).transpose(),y.isCubeTexture&&y.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(Wd),c.material.toneMapped=de.getTransfer(y.colorSpace)!==we,(h!==y||f!==y.version||u!==s.toneMapping)&&(c.material.needsUpdate=!0,h=y,f=y.version,u=s.toneMapping),c.layers.enableAll(),b.unshift(c,c.geometry,c.material,0,0,null)):y&&y.isTexture&&(l===void 0&&(l=new qt(new Fi(2,2),new Bi({name:"BackgroundMaterial",uniforms:zs(Ki.background.uniforms),vertexShader:Ki.background.vertexShader,fragmentShader:Ki.background.fragmentShader,side:ts,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(l)),l.material.uniforms.t2D.value=y,l.material.uniforms.backgroundIntensity.value=A.backgroundIntensity,l.material.toneMapped=de.getTransfer(y.colorSpace)!==we,y.matrixAutoUpdate===!0&&y.updateMatrix(),l.material.uniforms.uvTransform.value.copy(y.matrix),(h!==y||f!==y.version||u!==s.toneMapping)&&(l.material.needsUpdate=!0,h=y,f=y.version,u=s.toneMapping),l.layers.enableAll(),b.unshift(l,l.geometry,l.material,0,0,null))}function m(b,A){b.getRGB(fa,Bd(s)),e.buffers.color.setClear(fa.r,fa.g,fa.b,A,r)}function g(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return a},setClearColor:function(b,A=1){a.set(b),o=A,m(a,o)},getClearAlpha:function(){return o},setClearAlpha:function(b){o=b,m(a,o)},render:p,addToRenderList:x,dispose:g}}function Xv(s,t){const e=s.getParameter(s.MAX_VERTEX_ATTRIBS),i={},n=u(null);let r=n,a=!1;function o(L,U,B,F,O){let $=!1;const V=f(L,F,B,U);r!==V&&(r=V,c(r.object)),$=d(L,F,B,O),$&&p(L,F,B,O),O!==null&&t.update(O,s.ELEMENT_ARRAY_BUFFER),($||a)&&(a=!1,y(L,U,B,F),O!==null&&s.bindBuffer(s.ELEMENT_ARRAY_BUFFER,t.get(O).buffer))}function l(){return s.createVertexArray()}function c(L){return s.bindVertexArray(L)}function h(L){return s.deleteVertexArray(L)}function f(L,U,B,F){const O=F.wireframe===!0;let $=i[U.id];$===void 0&&($={},i[U.id]=$);const V=L.isInstancedMesh===!0?L.id:0;let nt=$[V];nt===void 0&&(nt={},$[V]=nt);let X=nt[B.id];X===void 0&&(X={},nt[B.id]=X);let Q=X[O];return Q===void 0&&(Q=u(l()),X[O]=Q),Q}function u(L){const U=[],B=[],F=[];for(let O=0;O<e;O++)U[O]=0,B[O]=0,F[O]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:U,enabledAttributes:B,attributeDivisors:F,object:L,attributes:{},index:null}}function d(L,U,B,F){const O=r.attributes,$=U.attributes;let V=0;const nt=B.getAttributes();for(const X in nt)if(nt[X].location>=0){const j=O[X];let Ft=$[X];if(Ft===void 0&&(X==="instanceMatrix"&&L.instanceMatrix&&(Ft=L.instanceMatrix),X==="instanceColor"&&L.instanceColor&&(Ft=L.instanceColor)),j===void 0||j.attribute!==Ft||Ft&&j.data!==Ft.data)return!0;V++}return r.attributesNum!==V||r.index!==F}function p(L,U,B,F){const O={},$=U.attributes;let V=0;const nt=B.getAttributes();for(const X in nt)if(nt[X].location>=0){let j=$[X];j===void 0&&(X==="instanceMatrix"&&L.instanceMatrix&&(j=L.instanceMatrix),X==="instanceColor"&&L.instanceColor&&(j=L.instanceColor));const Ft={};Ft.attribute=j,j&&j.data&&(Ft.data=j.data),O[X]=Ft,V++}r.attributes=O,r.attributesNum=V,r.index=F}function x(){const L=r.newAttributes;for(let U=0,B=L.length;U<B;U++)L[U]=0}function m(L){g(L,0)}function g(L,U){const B=r.newAttributes,F=r.enabledAttributes,O=r.attributeDivisors;B[L]=1,F[L]===0&&(s.enableVertexAttribArray(L),F[L]=1),O[L]!==U&&(s.vertexAttribDivisor(L,U),O[L]=U)}function b(){const L=r.newAttributes,U=r.enabledAttributes;for(let B=0,F=U.length;B<F;B++)U[B]!==L[B]&&(s.disableVertexAttribArray(B),U[B]=0)}function A(L,U,B,F,O,$,V){V===!0?s.vertexAttribIPointer(L,U,B,O,$):s.vertexAttribPointer(L,U,B,F,O,$)}function y(L,U,B,F){x();const O=F.attributes,$=B.getAttributes(),V=U.defaultAttributeValues;for(const nt in $){const X=$[nt];if(X.location>=0){let Q=O[nt];if(Q===void 0&&(nt==="instanceMatrix"&&L.instanceMatrix&&(Q=L.instanceMatrix),nt==="instanceColor"&&L.instanceColor&&(Q=L.instanceColor)),Q!==void 0){const j=Q.normalized,Ft=Q.itemSize,ut=t.get(Q);if(ut===void 0)continue;const te=ut.buffer,Zt=ut.type,ee=ut.bytesPerElement,Z=Zt===s.INT||Zt===s.UNSIGNED_INT||Q.gpuType===mc;if(Q.isInterleavedBufferAttribute){const et=Q.data,Mt=et.stride,$t=Q.offset;if(et.isInstancedInterleavedBuffer){for(let Tt=0;Tt<X.locationSize;Tt++)g(X.location+Tt,et.meshPerAttribute);L.isInstancedMesh!==!0&&F._maxInstanceCount===void 0&&(F._maxInstanceCount=et.meshPerAttribute*et.count)}else for(let Tt=0;Tt<X.locationSize;Tt++)m(X.location+Tt);s.bindBuffer(s.ARRAY_BUFFER,te);for(let Tt=0;Tt<X.locationSize;Tt++)A(X.location+Tt,Ft/X.locationSize,Zt,j,Mt*ee,($t+Ft/X.locationSize*Tt)*ee,Z)}else{if(Q.isInstancedBufferAttribute){for(let et=0;et<X.locationSize;et++)g(X.location+et,Q.meshPerAttribute);L.isInstancedMesh!==!0&&F._maxInstanceCount===void 0&&(F._maxInstanceCount=Q.meshPerAttribute*Q.count)}else for(let et=0;et<X.locationSize;et++)m(X.location+et);s.bindBuffer(s.ARRAY_BUFFER,te);for(let et=0;et<X.locationSize;et++)A(X.location+et,Ft/X.locationSize,Zt,j,Ft*ee,Ft/X.locationSize*et*ee,Z)}}else if(V!==void 0){const j=V[nt];if(j!==void 0)switch(j.length){case 2:s.vertexAttrib2fv(X.location,j);break;case 3:s.vertexAttrib3fv(X.location,j);break;case 4:s.vertexAttrib4fv(X.location,j);break;default:s.vertexAttrib1fv(X.location,j)}}}}b()}function E(){w();for(const L in i){const U=i[L];for(const B in U){const F=U[B];for(const O in F){const $=F[O];for(const V in $)h($[V].object),delete $[V];delete F[O]}}delete i[L]}}function M(L){if(i[L.id]===void 0)return;const U=i[L.id];for(const B in U){const F=U[B];for(const O in F){const $=F[O];for(const V in $)h($[V].object),delete $[V];delete F[O]}}delete i[L.id]}function T(L){for(const U in i){const B=i[U];for(const F in B){const O=B[F];if(O[L.id]===void 0)continue;const $=O[L.id];for(const V in $)h($[V].object),delete $[V];delete O[L.id]}}}function v(L){for(const U in i){const B=i[U],F=L.isInstancedMesh===!0?L.id:0,O=B[F];if(O!==void 0){for(const $ in O){const V=O[$];for(const nt in V)h(V[nt].object),delete V[nt];delete O[$]}delete B[F],Object.keys(B).length===0&&delete i[U]}}}function w(){P(),a=!0,r!==n&&(r=n,c(r.object))}function P(){n.geometry=null,n.program=null,n.wireframe=!1}return{setup:o,reset:w,resetDefaultState:P,dispose:E,releaseStatesOfGeometry:M,releaseStatesOfObject:v,releaseStatesOfProgram:T,initAttributes:x,enableAttribute:m,disableUnusedAttributes:b}}function qv(s,t,e){let i;function n(l){i=l}function r(l,c){s.drawArrays(i,l,c),e.update(c,i,1)}function a(l,c,h){h!==0&&(s.drawArraysInstanced(i,l,c,h),e.update(c,i,h))}function o(l,c,h){if(h===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,l,0,c,0,h);let u=0;for(let d=0;d<h;d++)u+=c[d];e.update(u,i,1)}this.setMode=n,this.render=r,this.renderInstances=a,this.renderMultiDraw=o}function Kv(s,t,e,i){let n;function r(){if(n!==void 0)return n;if(t.has("EXT_texture_filter_anisotropic")===!0){const T=t.get("EXT_texture_filter_anisotropic");n=s.getParameter(T.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else n=0;return n}function a(T){return!(T!==Ci&&i.convert(T)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(T){const v=T===tn&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(T!==bi&&T!==Di&&!v&&i.convert(T)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_TYPE))}function l(T){if(T==="highp"){if(s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.HIGH_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.HIGH_FLOAT).precision>0)return"highp";T="mediump"}return T==="mediump"&&s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.MEDIUM_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=e.precision!==void 0?e.precision:"highp";const h=l(c);h!==c&&(Qt("WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);const f=e.logarithmicDepthBuffer===!0,u=e.reversedDepthBuffer===!0&&t.has("EXT_clip_control");e.reversedDepthBuffer===!0&&u===!1&&Qt("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");const d=s.getParameter(s.MAX_TEXTURE_IMAGE_UNITS),p=s.getParameter(s.MAX_VERTEX_TEXTURE_IMAGE_UNITS),x=s.getParameter(s.MAX_TEXTURE_SIZE),m=s.getParameter(s.MAX_CUBE_MAP_TEXTURE_SIZE),g=s.getParameter(s.MAX_VERTEX_ATTRIBS),b=s.getParameter(s.MAX_VERTEX_UNIFORM_VECTORS),A=s.getParameter(s.MAX_VARYING_VECTORS),y=s.getParameter(s.MAX_FRAGMENT_UNIFORM_VECTORS),E=s.getParameter(s.MAX_SAMPLES),M=s.getParameter(s.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:f,reversedDepthBuffer:u,maxTextures:d,maxVertexTextures:p,maxTextureSize:x,maxCubemapSize:m,maxAttributes:g,maxVertexUniforms:b,maxVaryings:A,maxFragmentUniforms:y,maxSamples:E,samples:M}}function $v(s){const t=this;let e=null,i=0,n=!1,r=!1;const a=new In,o=new ne,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(f,u){const d=f.length!==0||u||i!==0||n;return n=u,i=f.length,d},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(f,u){e=h(f,u,0)},this.setState=function(f,u,d){const p=f.clippingPlanes,x=f.clipIntersection,m=f.clipShadows,g=s.get(f);if(!n||p===null||p.length===0||r&&!m)r?h(null):c();else{const b=r?0:i,A=b*4;let y=g.clippingState||null;l.value=y,y=h(p,u,A,d);for(let E=0;E!==A;++E)y[E]=e[E];g.clippingState=y,this.numIntersection=x?this.numPlanes:0,this.numPlanes+=b}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=i>0),t.numPlanes=i,t.numIntersection=0}function h(f,u,d,p){const x=f!==null?f.length:0;let m=null;if(x!==0){if(m=l.value,p!==!0||m===null){const g=d+x*4,b=u.matrixWorldInverse;o.getNormalMatrix(b),(m===null||m.length<g)&&(m=new Float32Array(g));for(let A=0,y=d;A!==x;++A,y+=4)a.copy(f[A]).applyMatrix4(b,o),a.normal.toArray(m,y),m[y+3]=a.constant}l.value=m,l.needsUpdate=!0}return t.numPlanes=x,t.numIntersection=0,m}}const ks=4,Yv=6,Zv=20,Jv=256,nr=new Uc,Qh=new Kt;let Ho=null,Go=0,Vo=0,Wo=!1;const jv=new R,Wn=new R;class tu{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(t,e=0,i=.1,n=100,r={}){const{size:a=256,position:o=jv}=r;Ho=this._renderer.getRenderTarget(),Go=this._renderer.getActiveCubeFace(),Vo=this._renderer.getActiveMipmapLevel(),Wo=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);const l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(t,i,n,l,o),e>0&&this._blur(l,0,0,e),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=nu(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=iu(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodMeshes.length;t++)this._lodMeshes[t].geometry.dispose()}_cleanup(t){this._renderer.setRenderTarget(Ho,Go,Vo),this._renderer.xr.enabled=Wo,t.scissorTest=!1,Ts(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===es||t.mapping===Os?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Ho=this._renderer.getRenderTarget(),Go=this._renderer.getActiveCubeFace(),Vo=this._renderer.getActiveMipmapLevel(),Wo=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=e||this._allocateTargets();return this._textureToCubeUV(t,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,i={magFilter:si,minFilter:si,generateMipmaps:!1,type:tn,format:Ci,colorSpace:Ua,depthBuffer:!1},n=eu(t,e,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=eu(t,e,i);const{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods}=Qv(r)),this._blurMaterial=e1(r,t,e),this._ggxMaterial=t1(r,t,e)}return n}_compileMaterial(t){const e=new qt(new Be,t);this._renderer.compile(e,nr)}_sceneToCubeUV(t,e,i,n,r){const l=new vi(90,1,e,i),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],f=this._renderer,u=f.autoClear,d=f.toneMapping;f.getClearColor(Qh),f.toneMapping=ji,f.autoClear=!1,f.state.buffers.depth.getReversed()&&(f.setRenderTarget(n),f.clearDepth(),f.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new qt(new wt,new pi({name:"PMREM.Background",side:Je,depthWrite:!1,depthTest:!1})));const x=this._backgroundBox,m=x.material;let g=!1;const b=t.background;b?b.isColor&&(m.color.copy(b),t.background=null,g=!0):(m.color.copy(Qh),g=!0);for(let A=0;A<6;A++){const y=A%3;y===0?(l.up.set(0,c[A],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+h[A],r.y,r.z)):y===1?(l.up.set(0,0,c[A]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+h[A],r.z)):(l.up.set(0,c[A],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+h[A]));const E=this._cubeSize;Ts(n,y*E,A>2?E:0,E,E),f.setRenderTarget(n),g&&f.render(x,l),f.render(t,l)}f.toneMapping=d,f.autoClear=u,t.background=b}_textureToCubeUV(t,e){const i=this._renderer,n=t.mapping===es||t.mapping===Os;n?(this._cubemapMaterial===null&&(this._cubemapMaterial=nu()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=iu());const r=n?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=r;const o=r.uniforms;o.envMap.value=t;const l=this._cubeSize;Ts(e,0,0,3*l,2*l),i.setRenderTarget(e),i.render(a,nr)}_applyPMREM(t){const e=this._renderer,i=e.autoClear;e.autoClear=!1;const n=this._lodMeshes.length;for(let r=1;r<n;r++)this._applyGGXFilter(t,r-1,r);e.autoClear=i}_applyGGXFilter(t,e,i){const n=this._renderer,r=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[i];o.material=a;const l=a.uniforms,c=i/(this._lodMeshes.length-1),h=e/(this._lodMeshes.length-1),f=Math.sqrt(c*c-h*h),u=c*1.25,d=f*u,{_lodMax:p}=this,x=this._sizeLods[i],m=3*x*(i>p-ks?i-p+ks:0),g=4*(this._cubeSize-x);l.envMap.value=t.texture,l.roughness.value=d,l.mipInt.value=p-e,Ts(r,m,g,3*x,2*x),n.setRenderTarget(r),n.render(o,nr),l.envMap.value=r.texture,l.roughness.value=0,l.mipInt.value=p-i,Ts(t,m,g,3*x,2*x),n.setRenderTarget(t),n.render(o,nr)}_blur(t,e,i,n){const r=this._pingPongRenderTarget,a=Math.min(n,Math.PI)/Math.SQRT2;this._blurPass(t,r,e,i,a),this._blurPass(r,t,i,i,a)}_blurPass(t,e,i,n,r){const a=this._renderer,o=this._blurMaterial,l=this._lodMeshes[n];l.material=o;const c=o.uniforms;c.envMap.value=t.texture,c.sigma.value=r,c.mipInt.value=this._lodMax-i;const h=this._sizeLods[n],f=3*h*(n>this._lodMax-ks?n-this._lodMax+ks:0),u=4*(this._cubeSize-h);Ts(e,f,u,3*h,2*h),a.setRenderTarget(e),a.render(l,nr)}}function Qv(s){const t=[],e=[];let i=s;const n=s-ks+1+Yv;for(let r=0;r<n;r++){const a=Math.pow(2,i);t.push(a);const o=1/(a-2),l=-o,c=1+o,h=[l,l,c,l,c,c,l,l,c,c,l,c],f=6,u=6,d=3,p=new Float32Array(d*u*f),x=new Float32Array(d*u*f);for(let g=0;g<f;g++){const b=g%3*2/3-1,A=g>2?0:-1,y=[b,A,0,b+2/3,A,0,b+2/3,A+1,0,b,A,0,b+2/3,A+1,0,b,A+1,0];p.set(y,d*u*g);for(let E=0;E<u;E++){const M=h[E*2]*2-1,T=h[E*2+1]*2-1;g===0?Wn.set(1,T,M):g===1?Wn.set(-M,1,-T):g===2?Wn.set(-M,T,1):g===3?Wn.set(-1,T,-M):g===4?Wn.set(-M,-1,T):Wn.set(M,T,-1),Wn.toArray(x,(g*u+E)*d)}}const m=new Be;m.setAttribute("position",new xi(p,d)),m.setAttribute("outputDirection",new xi(x,d)),e.push(new qt(m,null)),i>ks&&i--}return{lodMeshes:e,sizeLods:t}}function eu(s,t,e){const i=new Ui(s,t,e);return i.texture.mapping=$a,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function Ts(s,t,e,i,n){s.viewport.set(t,e,i,n),s.scissor.set(t,e,i,n)}function t1(s,t,e){return new Bi({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:Jv,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:Ja(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:gn,depthTest:!1,depthWrite:!1})}function e1(s,t,e){return new Bi({name:"SphericalGaussianBlur",defines:{SAMPLES:Zv,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},sigma:{value:0},mipInt:{value:0}},vertexShader:Ja(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float sigma;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359
			#define GOLDEN_ANGLE 2.39996322973

			void main() {

				if ( sigma == 0.0 ) {

					gl_FragColor = vec4( bilinearCubeUV( envMap, vOutputDirection, mipInt ), 1.0 );
					return;

				}

				vec3 outputDirection = normalize( vOutputDirection );

				vec3 up = abs( outputDirection.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
				vec3 tangent = normalize( cross( up, outputDirection ) );
				vec3 bitangent = cross( outputDirection, tangent );

				// Truncate the kernel at three standard deviations or at the antipode.
				float thetaMax = min( 3.0 * sigma, PI );
				float truncation = 1.0 - exp( - 0.5 * thetaMax * thetaMax / ( sigma * sigma ) );

				vec3 accumColor = vec3( 0.0 );
				float accumWeight = 0.0;

				for ( int i = 0; i < SAMPLES; i ++ ) {

					// Stratified inverse-CDF sampling of the Gaussian, placed on a golden-angle spiral.
					float stratum = ( float( i ) + 0.5 ) / float( SAMPLES );
					float theta = sigma * sqrt( - 2.0 * log( 1.0 - stratum * truncation ) );
					float phi = float( i ) * GOLDEN_ANGLE;

					vec3 offset = cos( phi ) * tangent + sin( phi ) * bitangent;
					vec3 sampleDirection = cos( theta ) * outputDirection + sin( theta ) * offset;

					// Correct the planar sample density to solid angle.
					float weight = sin( theta ) / theta;

					accumColor += weight * bilinearCubeUV( envMap, sampleDirection, mipInt );
					accumWeight += weight;

				}

				gl_FragColor = vec4( accumColor / accumWeight, 1.0 );

			}
		`,blending:gn,depthTest:!1,depthWrite:!1})}function iu(){return new Bi({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Ja(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:gn,depthTest:!1,depthWrite:!1})}function nu(){return new Bi({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Ja(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:gn,depthTest:!1,depthWrite:!1})}function Ja(){return`

		precision mediump float;
		precision mediump int;

		attribute vec3 outputDirection;

		varying vec3 vOutputDirection;

		void main() {

			vOutputDirection = outputDirection;
			gl_Position = vec4( position, 1.0 );

		}
	`}class Xd extends Ui{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const i={width:t,height:t,depth:1},n=[i,i,i,i,i,i];this.texture=new Pd(n),this._setTextureOptions(e),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},n=new wt(5,5,5),r=new Bi({name:"CubemapFromEquirect",uniforms:zs(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:Je,blending:gn});r.uniforms.tEquirect.value=e;const a=new qt(n,r),o=e.minFilter;return e.minFilter===Jn&&(e.minFilter=si),new rm(1,10,this).update(t,a),e.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(t,e=!0,i=!0,n=!0){const r=t.getRenderTarget();for(let a=0;a<6;a++)t.setRenderTarget(this,a),t.clear(e,i,n);t.setRenderTarget(r)}}function i1(s){let t=new WeakMap,e=new WeakMap,i=null;function n(u,d=!1){return u==null?null:d?a(u):r(u)}function r(u){if(u&&u.isTexture){const d=u.mapping;if(d===co||d===ho)if(t.has(u)){const p=t.get(u).texture;return o(p,u.mapping)}else{const p=u.image;if(p&&p.height>0){const x=new Xd(p.height);return x.fromEquirectangularTexture(s,u),t.set(u,x),u.addEventListener("dispose",c),o(x.texture,u.mapping)}else return null}}return u}function a(u){if(u&&u.isTexture){const d=u.mapping,p=d===co||d===ho,x=d===es||d===Os;if(p||x){let m=e.get(u);const g=m!==void 0?m.texture.pmremVersion:0;if(u.isRenderTargetTexture&&u.pmremVersion!==g)return i===null&&(i=new tu(s)),m=p?i.fromEquirectangular(u,m):i.fromCubemap(u,m),m.texture.pmremVersion=u.pmremVersion,e.set(u,m),m.texture;if(m!==void 0)return m.texture;{const b=u.image;return p&&b&&b.height>0||x&&b&&l(b)?(i===null&&(i=new tu(s)),m=p?i.fromEquirectangular(u):i.fromCubemap(u),m.texture.pmremVersion=u.pmremVersion,e.set(u,m),u.addEventListener("dispose",h),m.texture):null}}}return u}function o(u,d){return d===co?u.mapping=es:d===ho&&(u.mapping=Os),u}function l(u){let d=0;const p=6;for(let x=0;x<p;x++)u[x]!==void 0&&d++;return d===p}function c(u){const d=u.target;d.removeEventListener("dispose",c);const p=t.get(d);p!==void 0&&(t.delete(d),p.dispose())}function h(u){const d=u.target;d.removeEventListener("dispose",h);const p=e.get(d);p!==void 0&&(e.delete(d),p.dispose())}function f(){t=new WeakMap,e=new WeakMap,i!==null&&(i.dispose(),i=null)}return{get:n,dispose:f}}function n1(s){const t={};function e(i){if(t[i]!==void 0)return t[i];const n=s.getExtension(i);return t[i]=n,n}return{has:function(i){return e(i)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(i){const n=e(i);return n===null&&Us("WebGLRenderer: "+i+" extension not supported."),n}}}function s1(s,t,e,i){const n={},r=new WeakMap;function a(f){const u=f.target;u.index!==null&&t.remove(u.index);for(const p in u.attributes)t.remove(u.attributes[p]);u.removeEventListener("dispose",a),delete n[u.id];const d=r.get(u);d&&(t.remove(d),r.delete(u)),i.releaseStatesOfGeometry(u),u.isInstancedBufferGeometry===!0&&delete u._maxInstanceCount,e.memory.geometries--}function o(f,u){return n[u.id]===!0||(u.addEventListener("dispose",a),n[u.id]=!0,e.memory.geometries++),u}function l(f){const u=f.attributes;for(const d in u)t.update(u[d],s.ARRAY_BUFFER)}function c(f){const u=[],d=f.index,p=f.attributes.position;let x=0;if(p===void 0)return;if(d!==null){const b=d.array;x=d.version;for(let A=0,y=b.length;A<y;A+=3){const E=b[A+0],M=b[A+1],T=b[A+2];u.push(E,M,M,T,T,E)}}else{const b=p.array;x=p.version;for(let A=0,y=b.length/3-1;A<y;A+=3){const E=A+0,M=A+1,T=A+2;u.push(E,M,M,T,T,E)}}const m=new(p.count>=65535?Ed:wd)(u,1);m.version=x;const g=r.get(f);g&&t.remove(g),r.set(f,m)}function h(f){const u=r.get(f);if(u){const d=f.index;d!==null&&u.version<d.version&&c(f)}else c(f);return r.get(f)}return{get:o,update:l,getWireframeAttribute:h}}function r1(s,t,e){let i;function n(f){i=f}let r,a;function o(f){r=f.type,a=f.bytesPerElement}function l(f,u){s.drawElements(i,u,r,f*a),e.update(u,i,1)}function c(f,u,d){d!==0&&(s.drawElementsInstanced(i,u,r,f*a,d),e.update(u,i,d))}function h(f,u,d){if(d===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,u,0,r,f,0,d);let x=0;for(let m=0;m<d;m++)x+=u[m];e.update(x,i,1)}this.setMode=n,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=h}function a1(s){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function i(r,a,o){switch(e.calls++,a){case s.TRIANGLES:e.triangles+=o*(r/3);break;case s.LINES:e.lines+=o*(r/2);break;case s.LINE_STRIP:e.lines+=o*(r-1);break;case s.LINE_LOOP:e.lines+=o*r;break;case s.POINTS:e.points+=o*r;break;default:me("WebGLInfo: Unknown draw mode:",a);break}}function n(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:n,update:i}}function o1(s,t,e){const i=new WeakMap,n=new Ue;function r(a,o,l){const c=a.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,f=h!==void 0?h.length:0;let u=i.get(o);if(u===void 0||u.count!==f){let P=function(){v.dispose(),i.delete(o),o.removeEventListener("dispose",P)};var d=P;u!==void 0&&u.texture.dispose();const p=o.morphAttributes.position!==void 0,x=o.morphAttributes.normal!==void 0,m=o.morphAttributes.color!==void 0,g=o.morphAttributes.position||[],b=o.morphAttributes.normal||[],A=o.morphAttributes.color||[];let y=0;p===!0&&(y=1),x===!0&&(y=2),m===!0&&(y=3);let E=o.attributes.position.count*y,M=1;E>t.maxTextureSize&&(M=Math.ceil(E/t.maxTextureSize),E=t.maxTextureSize);const T=new Float32Array(E*M*4*f),v=new yd(T,E,M,f);v.type=Di,v.needsUpdate=!0;const w=y*4;for(let L=0;L<f;L++){const U=g[L],B=b[L],F=A[L],O=E*M*4*L;for(let $=0;$<U.count;$++){const V=$*w;p===!0&&(n.fromBufferAttribute(U,$),T[O+V+0]=n.x,T[O+V+1]=n.y,T[O+V+2]=n.z,T[O+V+3]=0),x===!0&&(n.fromBufferAttribute(B,$),T[O+V+4]=n.x,T[O+V+5]=n.y,T[O+V+6]=n.z,T[O+V+7]=0),m===!0&&(n.fromBufferAttribute(F,$),T[O+V+8]=n.x,T[O+V+9]=n.y,T[O+V+10]=n.z,T[O+V+11]=F.itemSize===4?n.w:1)}}u={count:f,texture:v,size:new ot(E,M)},i.set(o,u),o.addEventListener("dispose",P)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(s,"morphTexture",a.morphTexture,e);else{let p=0;for(let m=0;m<c.length;m++)p+=c[m];const x=o.morphTargetsRelative?1:1-p;l.getUniforms().setValue(s,"morphTargetBaseInfluence",x),l.getUniforms().setValue(s,"morphTargetInfluences",c)}l.getUniforms().setValue(s,"morphTargetsTexture",u.texture,e),l.getUniforms().setValue(s,"morphTargetsTextureSize",u.size)}return{update:r}}function l1(s,t,e,i,n){let r=new WeakMap;function a(c){const h=n.render.frame,f=c.geometry,u=t.get(c,f);if(r.get(u)!==h&&(t.update(u),r.set(u,h)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),r.get(c)!==h&&(e.update(c.instanceMatrix,s.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,s.ARRAY_BUFFER),r.set(c,h))),c.isSkinnedMesh){const d=c.skeleton;r.get(d)!==h&&(d.update(),r.set(d,h))}return u}function o(){r=new WeakMap}function l(c){const h=c.target;h.removeEventListener("dispose",l),i.releaseStatesOfObject(h),e.remove(h.instanceMatrix),h.instanceColor!==null&&e.remove(h.instanceColor)}return{update:a,dispose:o}}const c1={[rd]:"LINEAR_TONE_MAPPING",[ad]:"REINHARD_TONE_MAPPING",[od]:"CINEON_TONE_MAPPING",[Ka]:"ACES_FILMIC_TONE_MAPPING",[cd]:"AGX_TONE_MAPPING",[hd]:"NEUTRAL_TONE_MAPPING",[ld]:"CUSTOM_TONE_MAPPING"};function h1(s,t,e,i,n,r){const a=new Ui(t,e,{type:s,depthBuffer:n,stencilBuffer:r,samples:i?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1});let o=null,l=null;const c=new Be;c.setAttribute("position",new pe([-1,3,0,-1,-1,0,3,-1,0],3)),c.setAttribute("uv",new pe([0,2,0,0,2,0],2));const h=new tm({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),f=new qt(c,h),u=new Uc(-1,1,1,-1,0,1);let d=null,p=null,x=!1,m,g=null,b=[],A=!1;this.setSize=function(y,E){a.setSize(y,E),o!==null&&o.setSize(y,E),l!==null&&l.setSize(y,E);for(let M=0;M<b.length;M++){const T=b[M];T.setSize&&T.setSize(y,E)}},this.setEffects=function(y){b=y,A=b.length>0&&b[0].isRenderPass===!0;const E=a.width,M=a.height;b.length>0&&o===null&&(o=new Ui(E,M,{type:tn,depthBuffer:!1,stencilBuffer:!1}),l=new Ui(E,M,{type:tn,depthBuffer:!1,stencilBuffer:!1}));for(let T=0;T<b.length;T++){const v=b[T];v.setSize&&v.setSize(E,M)}},this.begin=function(y,E){if(x||y.toneMapping===ji&&b.length===0)return!1;if(g=E,E!==null){const M=E.width,T=E.height;(a.width!==M||a.height!==T)&&this.setSize(M,T)}return A===!1&&y.setRenderTarget(a),m=y.toneMapping,y.toneMapping=ji,!0},this.hasRenderPass=function(){return A},this.end=function(y,E){y.toneMapping=m,x=!0;let M=a,T=o;for(let v=0;v<b.length;v++){const w=b[v];w.enabled!==!1&&(w.render(y,T,M,E),w.needsSwap!==!1&&(M=T,T=T===o?l:o))}if(d!==y.outputColorSpace||p!==y.toneMapping){d=y.outputColorSpace,p=y.toneMapping,h.defines={},de.getTransfer(d)===we&&(h.defines.SRGB_TRANSFER="");const v=c1[p];v&&(h.defines[v]=""),h.needsUpdate=!0}h.uniforms.tDiffuse.value=M.texture,y.setRenderTarget(g),y.render(f,u),g=null,x=!1},this.isCompositing=function(){return x},this.dispose=function(){a.dispose(),o!==null&&o.dispose(),l!==null&&l.dispose(),c.dispose(),h.dispose()}}const qd=new ri,sc=new Er(1,1),Kd=new yd,$d=new Zp,Yd=new Pd,su=[],ru=[],au=new Float32Array(16),ou=new Float32Array(9),lu=new Float32Array(4);function Vs(s,t,e){const i=s[0];if(i<=0||i>0)return s;const n=t*e;let r=su[n];if(r===void 0&&(r=new Float32Array(n),su[n]=r),t!==0){i.toArray(r,0);for(let a=1,o=0;a!==t;++a)o+=e,s[a].toArray(r,o)}return r}function Ke(s,t){if(s.length!==t.length)return!1;for(let e=0,i=s.length;e<i;e++)if(s[e]!==t[e])return!1;return!0}function $e(s,t){for(let e=0,i=t.length;e<i;e++)s[e]=t[e]}function ja(s,t){let e=ru[t];e===void 0&&(e=new Int32Array(t),ru[t]=e);for(let i=0;i!==t;++i)e[i]=s.allocateTextureUnit();return e}function u1(s,t){const e=this.cache;e[0]!==t&&(s.uniform1f(this.addr,t),e[0]=t)}function d1(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ke(e,t))return;s.uniform2fv(this.addr,t),$e(e,t)}}function f1(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(s.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Ke(e,t))return;s.uniform3fv(this.addr,t),$e(e,t)}}function p1(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ke(e,t))return;s.uniform4fv(this.addr,t),$e(e,t)}}function m1(s,t){const e=this.cache,i=t.elements;if(i===void 0){if(Ke(e,t))return;s.uniformMatrix2fv(this.addr,!1,t),$e(e,t)}else{if(Ke(e,i))return;lu.set(i),s.uniformMatrix2fv(this.addr,!1,lu),$e(e,i)}}function g1(s,t){const e=this.cache,i=t.elements;if(i===void 0){if(Ke(e,t))return;s.uniformMatrix3fv(this.addr,!1,t),$e(e,t)}else{if(Ke(e,i))return;ou.set(i),s.uniformMatrix3fv(this.addr,!1,ou),$e(e,i)}}function v1(s,t){const e=this.cache,i=t.elements;if(i===void 0){if(Ke(e,t))return;s.uniformMatrix4fv(this.addr,!1,t),$e(e,t)}else{if(Ke(e,i))return;au.set(i),s.uniformMatrix4fv(this.addr,!1,au),$e(e,i)}}function x1(s,t){const e=this.cache;e[0]!==t&&(s.uniform1i(this.addr,t),e[0]=t)}function _1(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ke(e,t))return;s.uniform2iv(this.addr,t),$e(e,t)}}function y1(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ke(e,t))return;s.uniform3iv(this.addr,t),$e(e,t)}}function M1(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ke(e,t))return;s.uniform4iv(this.addr,t),$e(e,t)}}function S1(s,t){const e=this.cache;e[0]!==t&&(s.uniform1ui(this.addr,t),e[0]=t)}function b1(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ke(e,t))return;s.uniform2uiv(this.addr,t),$e(e,t)}}function w1(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ke(e,t))return;s.uniform3uiv(this.addr,t),$e(e,t)}}function E1(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ke(e,t))return;s.uniform4uiv(this.addr,t),$e(e,t)}}function T1(s,t,e){const i=this.cache,n=e.allocateTextureUnit();i[0]!==n&&(s.uniform1i(this.addr,n),i[0]=n);let r;this.type===s.SAMPLER_2D_SHADOW?(sc.compareFunction=e.isReversedDepthBuffer()?bc:Sc,r=sc):r=qd,e.setTexture2D(t||r,n)}function A1(s,t,e){const i=this.cache,n=e.allocateTextureUnit();i[0]!==n&&(s.uniform1i(this.addr,n),i[0]=n),e.setTexture3D(t||$d,n)}function C1(s,t,e){const i=this.cache,n=e.allocateTextureUnit();i[0]!==n&&(s.uniform1i(this.addr,n),i[0]=n),e.setTextureCube(t||Yd,n)}function P1(s,t,e){const i=this.cache,n=e.allocateTextureUnit();i[0]!==n&&(s.uniform1i(this.addr,n),i[0]=n),e.setTexture2DArray(t||Kd,n)}function R1(s){switch(s){case 5126:return u1;case 35664:return d1;case 35665:return f1;case 35666:return p1;case 35674:return m1;case 35675:return g1;case 35676:return v1;case 5124:case 35670:return x1;case 35667:case 35671:return _1;case 35668:case 35672:return y1;case 35669:case 35673:return M1;case 5125:return S1;case 36294:return b1;case 36295:return w1;case 36296:return E1;case 35678:case 36198:case 36298:case 36306:case 35682:return T1;case 35679:case 36299:case 36307:return A1;case 35680:case 36300:case 36308:case 36293:return C1;case 36289:case 36303:case 36311:case 36292:return P1}}function L1(s,t){s.uniform1fv(this.addr,t)}function k1(s,t){const e=Vs(t,this.size,2);s.uniform2fv(this.addr,e)}function I1(s,t){const e=Vs(t,this.size,3);s.uniform3fv(this.addr,e)}function D1(s,t){const e=Vs(t,this.size,4);s.uniform4fv(this.addr,e)}function U1(s,t){const e=Vs(t,this.size,4);s.uniformMatrix2fv(this.addr,!1,e)}function F1(s,t){const e=Vs(t,this.size,9);s.uniformMatrix3fv(this.addr,!1,e)}function N1(s,t){const e=Vs(t,this.size,16);s.uniformMatrix4fv(this.addr,!1,e)}function O1(s,t){s.uniform1iv(this.addr,t)}function B1(s,t){s.uniform2iv(this.addr,t)}function z1(s,t){s.uniform3iv(this.addr,t)}function H1(s,t){s.uniform4iv(this.addr,t)}function G1(s,t){s.uniform1uiv(this.addr,t)}function V1(s,t){s.uniform2uiv(this.addr,t)}function W1(s,t){s.uniform3uiv(this.addr,t)}function X1(s,t){s.uniform4uiv(this.addr,t)}function q1(s,t,e){const i=this.cache,n=t.length,r=ja(e,n);Ke(i,r)||(s.uniform1iv(this.addr,r),$e(i,r));let a;this.type===s.SAMPLER_2D_SHADOW?a=sc:a=qd;for(let o=0;o!==n;++o)e.setTexture2D(t[o]||a,r[o])}function K1(s,t,e){const i=this.cache,n=t.length,r=ja(e,n);Ke(i,r)||(s.uniform1iv(this.addr,r),$e(i,r));for(let a=0;a!==n;++a)e.setTexture3D(t[a]||$d,r[a])}function $1(s,t,e){const i=this.cache,n=t.length,r=ja(e,n);Ke(i,r)||(s.uniform1iv(this.addr,r),$e(i,r));for(let a=0;a!==n;++a)e.setTextureCube(t[a]||Yd,r[a])}function Y1(s,t,e){const i=this.cache,n=t.length,r=ja(e,n);Ke(i,r)||(s.uniform1iv(this.addr,r),$e(i,r));for(let a=0;a!==n;++a)e.setTexture2DArray(t[a]||Kd,r[a])}function Z1(s){switch(s){case 5126:return L1;case 35664:return k1;case 35665:return I1;case 35666:return D1;case 35674:return U1;case 35675:return F1;case 35676:return N1;case 5124:case 35670:return O1;case 35667:case 35671:return B1;case 35668:case 35672:return z1;case 35669:case 35673:return H1;case 5125:return G1;case 36294:return V1;case 36295:return W1;case 36296:return X1;case 35678:case 36198:case 36298:case 36306:case 35682:return q1;case 35679:case 36299:case 36307:return K1;case 35680:case 36300:case 36308:case 36293:return $1;case 36289:case 36303:case 36311:case 36292:return Y1}}class J1{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.setValue=R1(e.type)}}class j1{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=Z1(e.type)}}class Q1{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,i){const n=this.seq;for(let r=0,a=n.length;r!==a;++r){const o=n[r];o.setValue(t,e[o.id],i)}}}const Xo=/(\w+)(\])?(\[|\.)?/g;function cu(s,t){s.seq.push(t),s.map[t.id]=t}function tx(s,t,e){const i=s.name,n=i.length;for(Xo.lastIndex=0;;){const r=Xo.exec(i),a=Xo.lastIndex;let o=r[1];const l=r[2]==="]",c=r[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===n){cu(e,c===void 0?new J1(o,s,t):new j1(o,s,t));break}else{let f=e.map[o];f===void 0&&(f=new Q1(o),cu(e,f)),e=f}}}class Ea{constructor(t,e){this.seq=[],this.map={};const i=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let a=0;a<i;++a){const o=t.getActiveUniform(e,a),l=t.getUniformLocation(e,o.name);tx(o,l,this)}const n=[],r=[];for(const a of this.seq)a.type===t.SAMPLER_2D_SHADOW||a.type===t.SAMPLER_CUBE_SHADOW||a.type===t.SAMPLER_2D_ARRAY_SHADOW?n.push(a):r.push(a);n.length>0&&(this.seq=n.concat(r))}setValue(t,e,i,n){const r=this.map[e];r!==void 0&&r.setValue(t,i,n)}setOptional(t,e,i){const n=e[i];n!==void 0&&this.setValue(t,i,n)}static upload(t,e,i,n){for(let r=0,a=e.length;r!==a;++r){const o=e[r],l=i[o.id];l.needsUpdate!==!1&&o.setValue(t,l.value,n)}}static seqWithValue(t,e){const i=[];for(let n=0,r=t.length;n!==r;++n){const a=t[n];a.id in e&&i.push(a)}return i}}function hu(s,t,e){const i=s.createShader(t);return s.shaderSource(i,e),s.compileShader(i),i}const ex=37297;let ix=0;function nx(s,t){const e=s.split(`
`),i=[],n=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let a=n;a<r;a++){const o=a+1;i.push(`${o===t?">":" "} ${o}: ${e[a]}`)}return i.join(`
`)}const uu=new ne;function sx(s){de._getMatrix(uu,de.workingColorSpace,s);const t=`mat3( ${uu.elements.map(e=>e.toFixed(4))} )`;switch(de.getTransfer(s)){case Fa:return[t,"LinearTransferOETF"];case we:return[t,"sRGBTransferOETF"];default:return Qt("WebGLProgram: Unsupported color space: ",s),[t,"LinearTransferOETF"]}}function du(s,t,e){const i=s.getShaderParameter(t,s.COMPILE_STATUS),r=(s.getShaderInfoLog(t)||"").trim();if(i&&r==="")return"";const a=/ERROR: 0:(\d+)/.exec(r);if(a){const o=parseInt(a[1]);return e.toUpperCase()+`

`+r+`

`+nx(s.getShaderSource(t),o)}else return r}function rx(s,t){const e=sx(t);return[`vec4 ${s}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}const ax={[rd]:"Linear",[ad]:"Reinhard",[od]:"Cineon",[Ka]:"ACESFilmic",[cd]:"AgX",[hd]:"Neutral",[ld]:"Custom"};function ox(s,t){const e=ax[t];return e===void 0?(Qt("WebGLProgram: Unsupported toneMapping:",t),"vec3 "+s+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+s+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const pa=new R;function lx(){de.getLuminanceCoefficients(pa);const s=pa.x.toFixed(4),t=pa.y.toFixed(4),e=pa.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${s}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function cx(s){return[s.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",s.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(hr).join(`
`)}function hx(s){const t=[];for(const e in s){const i=s[e];i!==!1&&t.push("#define "+e+" "+i)}return t.join(`
`)}function ux(s,t){const e={},i=s.getProgramParameter(t,s.ACTIVE_ATTRIBUTES);for(let n=0;n<i;n++){const r=s.getActiveAttrib(t,n),a=r.name;let o=1;r.type===s.FLOAT_MAT2&&(o=2),r.type===s.FLOAT_MAT3&&(o=3),r.type===s.FLOAT_MAT4&&(o=4),e[a]={type:r.type,location:s.getAttribLocation(t,a),locationSize:o}}return e}function hr(s){return s!==""}function fu(s,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return s.replace(/NUM_SUN_LIGHTS/g,t.numSunLights).replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,t.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function pu(s,t){return s.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const dx=/^[ \t]*#include +<([\w\d./]+)>/gm;function rc(s){return s.replace(dx,px)}const fx=new Map;function px(s,t){let e=le[t];if(e===void 0){const i=fx.get(t);if(i!==void 0)e=le[i],Qt('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,i);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+t+">")}return rc(e)}const mx=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function mu(s){return s.replace(mx,gx)}function gx(s,t,e,i){let n="";for(let r=parseInt(t);r<parseInt(e);r++)n+=i.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return n}function gu(s){let t=`precision ${s.precision} float;
	precision ${s.precision} int;
	precision ${s.precision} sampler2D;
	precision ${s.precision} samplerCube;
	precision ${s.precision} sampler3D;
	precision ${s.precision} sampler2DArray;
	precision ${s.precision} sampler2DShadow;
	precision ${s.precision} samplerCubeShadow;
	precision ${s.precision} sampler2DArrayShadow;
	precision ${s.precision} isampler2D;
	precision ${s.precision} isampler3D;
	precision ${s.precision} isamplerCube;
	precision ${s.precision} isampler2DArray;
	precision ${s.precision} usampler2D;
	precision ${s.precision} usampler3D;
	precision ${s.precision} usamplerCube;
	precision ${s.precision} usampler2DArray;
	`;return s.precision==="highp"?t+=`
#define HIGH_PRECISION`:s.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:s.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}const vx={[fr]:"SHADOWMAP_TYPE_PCF",[or]:"SHADOWMAP_TYPE_VSM"};function xx(s){return vx[s.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const _x={[es]:"ENVMAP_TYPE_CUBE",[Os]:"ENVMAP_TYPE_CUBE",[$a]:"ENVMAP_TYPE_CUBE_UV"};function yx(s){return s.envMap===!1?"ENVMAP_TYPE_CUBE":_x[s.envMapMode]||"ENVMAP_TYPE_CUBE"}const Mx={[Os]:"ENVMAP_MODE_REFRACTION"};function Sx(s){return s.envMap===!1?"ENVMAP_MODE_REFLECTION":Mx[s.envMapMode]||"ENVMAP_MODE_REFLECTION"}const bx={[sd]:"ENVMAP_BLENDING_MULTIPLY",[Ap]:"ENVMAP_BLENDING_MIX",[Cp]:"ENVMAP_BLENDING_ADD"};function wx(s){return s.envMap===!1?"ENVMAP_BLENDING_NONE":bx[s.combine]||"ENVMAP_BLENDING_NONE"}function Ex(s){const t=s.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,i=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:i,maxMip:e}}function Tx(s,t,e,i){const n=s.getContext(),r=e.defines;let a=e.vertexShader,o=e.fragmentShader;const l=xx(e),c=yx(e),h=Sx(e),f=wx(e),u=Ex(e),d=cx(e),p=hx(r),x=n.createProgram();let m,g,b=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p].filter(hr).join(`
`),m.length>0&&(m+=`
`),g=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p].filter(hr).join(`
`),g.length>0&&(g+=`
`)):(m=[gu(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexNormals?"#define HAS_NORMAL":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(hr).join(`
`),g=[gu(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+h:"",e.envMap?"#define "+f:"",u?"#define CUBEUV_TEXEL_WIDTH "+u.texelWidth:"",u?"#define CUBEUV_TEXEL_HEIGHT "+u.texelHeight:"",u?"#define CUBEUV_MAX_MIP "+u.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.retroreflection?"#define USE_RETROREFLECTION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor?"#define USE_COLOR":"",e.vertexAlphas||e.batchingColor?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==ji?"#define TONE_MAPPING":"",e.toneMapping!==ji?le.tonemapping_pars_fragment:"",e.toneMapping!==ji?ox("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",le.colorspace_pars_fragment,rx("linearToOutputTexel",e.outputColorSpace),lx(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(hr).join(`
`)),a=rc(a),a=fu(a,e),a=pu(a,e),o=rc(o),o=fu(o,e),o=pu(o,e),a=mu(a),o=mu(o),e.isRawShaderMaterial!==!0&&(b=`#version 300 es
`,m=[d,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,g=["#define varying in",e.glslVersion===ph?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===ph?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+g);const A=b+m+a,y=b+g+o,E=hu(n,n.VERTEX_SHADER,A),M=hu(n,n.FRAGMENT_SHADER,y);n.attachShader(x,E),n.attachShader(x,M),e.index0AttributeName!==void 0?n.bindAttribLocation(x,0,e.index0AttributeName):e.hasPositionAttribute===!0&&n.bindAttribLocation(x,0,"position"),n.linkProgram(x);function T(L){if(s.debug.checkShaderErrors){const U=n.getProgramInfoLog(x)||"",B=n.getShaderInfoLog(E)||"",F=n.getShaderInfoLog(M)||"",O=U.trim(),$=B.trim(),V=F.trim();let nt=!0,X=!0;if(n.getProgramParameter(x,n.LINK_STATUS)===!1)if(nt=!1,typeof s.debug.onShaderError=="function")s.debug.onShaderError(n,x,E,M);else{const Q=du(n,E,"vertex"),j=du(n,M,"fragment");me("WebGLProgram: Shader Error "+n.getError()+" - VALIDATE_STATUS "+n.getProgramParameter(x,n.VALIDATE_STATUS)+`

Material Name: `+L.name+`
Material Type: `+L.type+`

Program Info Log: `+O+`
`+Q+`
`+j)}else O!==""?Qt("WebGLProgram: Program Info Log:",O):($===""||V==="")&&(X=!1);X&&(L.diagnostics={runnable:nt,programLog:O,vertexShader:{log:$,prefix:m},fragmentShader:{log:V,prefix:g}})}n.deleteShader(E),n.deleteShader(M),v=new Ea(n,x),w=ux(n,x)}let v;this.getUniforms=function(){return v===void 0&&T(this),v};let w;this.getAttributes=function(){return w===void 0&&T(this),w};let P=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return P===!1&&(P=n.getProgramParameter(x,ex)),P},this.destroy=function(){i.releaseStatesOfProgram(this),n.deleteProgram(x),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=ix++,this.cacheKey=t,this.usedTimes=1,this.program=x,this.vertexShader=E,this.fragmentShader=M,this}let Ax=0;class Cx{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t,e,i){const n=this._getShaderCacheForMaterial(t);return n.has(e)===!1&&(n.add(e),e.usedTimes++),n.has(i)===!1&&(n.add(i),i.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const i of e)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(t),this}getVertexShaderStage(t){return this._getShaderStage(t.vertexShader)}getFragmentShaderStage(t){return this._getShaderStage(t.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let i=e.get(t);return i===void 0&&(i=new Set,e.set(t,i)),i}_getShaderStage(t){const e=this.shaderCache;let i=e.get(t);return i===void 0&&(i=new Px(t),e.set(t,i)),i}}class Px{constructor(t){this.id=Ax++,this.code=t,this.usedTimes=0}}function Rx(s){return s===is||s===ka||s===Ia}function Lx(s,t,e,i,n,r){const a=new Md,o=new Cx,l=new Set,c=[],h=new Map,f=i.logarithmicDepthBuffer;let u=i.precision;const d={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function p(v){return l.add(v),v===0?"uv":`uv${v}`}function x(v,w,P,L,U,B){const F=L.fog,O=U.geometry,$=v.isMeshStandardMaterial||v.isMeshLambertMaterial||v.isMeshPhongMaterial?L.environment:null,V=v.isMeshStandardMaterial||v.isMeshLambertMaterial&&!v.envMap||v.isMeshPhongMaterial&&!v.envMap,nt=t.get(v.envMap||$,V),X=nt&&nt.mapping===$a?nt.image.height:null,Q=d[v.type];v.precision!==null&&(u=i.getMaxPrecision(v.precision),u!==v.precision&&Qt("WebGLProgram.getParameters:",v.precision,"not supported, using",u,"instead."));const j=O.morphAttributes.position||O.morphAttributes.normal||O.morphAttributes.color,Ft=j!==void 0?j.length:0;let ut=0;O.morphAttributes.position!==void 0&&(ut=1),O.morphAttributes.normal!==void 0&&(ut=2),O.morphAttributes.color!==void 0&&(ut=3);let te,Zt,ee,Z;if(Q){const Re=Ki[Q];te=Re.vertexShader,Zt=Re.fragmentShader}else{te=v.vertexShader,Zt=v.fragmentShader;const Re=o.getVertexShaderStage(v),ye=o.getFragmentShaderStage(v);o.update(v,Re,ye),ee=Re.id,Z=ye.id}const et=s.getRenderTarget(),Mt=s.state.buffers.depth.getReversed(),$t=U.isInstancedMesh===!0,Tt=U.isBatchedMesh===!0,Jt=!!v.map,be=!!v.matcap,it=!!nt,rt=!!v.aoMap,lt=!!v.lightMap,ct=!!v.bumpMap&&v.wireframe===!1,ft=!!v.normalMap,Wt=!!v.displacementMap,Gt=!!v.emissiveMap,jt=!!v.metalnessMap,ie=!!v.roughnessMap,k=v.anisotropy>0,_e=v.clearcoat>0,ce=v.dispersion>0,C=v.retroreflectivity>0,_=v.iridescence>0,N=v.sheen>0,G=v.transmission>0,K=k&&!!v.anisotropyMap,ht=_e&&!!v.clearcoatMap,dt=_e&&!!v.clearcoatNormalMap,Y=_e&&!!v.clearcoatRoughnessMap,tt=_&&!!v.iridescenceMap,mt=_&&!!v.iridescenceThicknessMap,Bt=N&&!!v.sheenColorMap,_t=N&&!!v.sheenRoughnessMap,gt=!!v.specularMap,zt=!!v.specularColorMap,Xt=!!v.specularIntensityMap,se=G&&!!v.transmissionMap,D=G&&!!v.thicknessMap,vt=!!v.gradientMap,J=!!v.alphaMap,xt=v.alphaTest>0,Et=!!v.alphaHash,st=!!v.extensions;let Ht=ji;v.toneMapped&&(et===null||et.isXRRenderTarget===!0)&&(Ht=s.toneMapping);const Ut={shaderID:Q,shaderType:v.type,shaderName:v.name,vertexShader:te,fragmentShader:Zt,defines:v.defines,customVertexShaderID:ee,customFragmentShaderID:Z,isRawShaderMaterial:v.isRawShaderMaterial===!0,glslVersion:v.glslVersion,precision:u,batching:Tt,batchingColor:Tt&&U._colorsTexture!==null,instancing:$t,instancingColor:$t&&U.instanceColor!==null,instancingMorph:$t&&U.morphTexture!==null,outputColorSpace:et===null?s.outputColorSpace:et.isXRRenderTarget===!0?et.texture.colorSpace:de.workingColorSpace,alphaToCoverage:!!v.alphaToCoverage,map:Jt,matcap:be,envMap:it,envMapMode:it&&nt.mapping,envMapCubeUVHeight:X,aoMap:rt,lightMap:lt,bumpMap:ct,normalMap:ft,displacementMap:Wt,emissiveMap:Gt,normalMapObjectSpace:ft&&v.normalMapType===Lp,normalMapTangentSpace:ft&&v.normalMapType===Da,packedNormalMap:ft&&v.normalMapType===Da&&Rx(v.normalMap.format),metalnessMap:jt,roughnessMap:ie,anisotropy:k,anisotropyMap:K,clearcoat:_e,clearcoatMap:ht,clearcoatNormalMap:dt,clearcoatRoughnessMap:Y,dispersion:ce,retroreflection:C,iridescence:_,iridescenceMap:tt,iridescenceThicknessMap:mt,sheen:N,sheenColorMap:Bt,sheenRoughnessMap:_t,specularMap:gt,specularColorMap:zt,specularIntensityMap:Xt,transmission:G,transmissionMap:se,thicknessMap:D,gradientMap:vt,opaque:v.transparent===!1&&v.blending===pr&&v.alphaToCoverage===!1,alphaMap:J,alphaTest:xt,alphaHash:Et,combine:v.combine,mapUv:Jt&&p(v.map.channel),aoMapUv:rt&&p(v.aoMap.channel),lightMapUv:lt&&p(v.lightMap.channel),bumpMapUv:ct&&p(v.bumpMap.channel),normalMapUv:ft&&p(v.normalMap.channel),displacementMapUv:Wt&&p(v.displacementMap.channel),emissiveMapUv:Gt&&p(v.emissiveMap.channel),metalnessMapUv:jt&&p(v.metalnessMap.channel),roughnessMapUv:ie&&p(v.roughnessMap.channel),anisotropyMapUv:K&&p(v.anisotropyMap.channel),clearcoatMapUv:ht&&p(v.clearcoatMap.channel),clearcoatNormalMapUv:dt&&p(v.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Y&&p(v.clearcoatRoughnessMap.channel),iridescenceMapUv:tt&&p(v.iridescenceMap.channel),iridescenceThicknessMapUv:mt&&p(v.iridescenceThicknessMap.channel),sheenColorMapUv:Bt&&p(v.sheenColorMap.channel),sheenRoughnessMapUv:_t&&p(v.sheenRoughnessMap.channel),specularMapUv:gt&&p(v.specularMap.channel),specularColorMapUv:zt&&p(v.specularColorMap.channel),specularIntensityMapUv:Xt&&p(v.specularIntensityMap.channel),transmissionMapUv:se&&p(v.transmissionMap.channel),thicknessMapUv:D&&p(v.thicknessMap.channel),alphaMapUv:J&&p(v.alphaMap.channel),vertexTangents:!!O.attributes.tangent&&(ft||k),vertexNormals:!!O.attributes.normal,vertexColors:v.vertexColors,vertexAlphas:v.vertexColors===!0&&!!O.attributes.color&&O.attributes.color.itemSize===4,pointsUvs:U.isPoints===!0&&!!O.attributes.uv&&(Jt||J),fog:!!F,useFog:v.fog===!0,fogExp2:!!F&&F.isFogExp2,flatShading:v.wireframe===!1&&(v.flatShading===!0||O.attributes.normal===void 0&&ft===!1&&(v.isMeshLambertMaterial||v.isMeshPhongMaterial||v.isMeshStandardMaterial||v.isMeshPhysicalMaterial)),sizeAttenuation:v.sizeAttenuation===!0,logarithmicDepthBuffer:f,reversedDepthBuffer:Mt,skinning:U.isSkinnedMesh===!0,hasPositionAttribute:O.attributes.position!==void 0,morphTargets:O.morphAttributes.position!==void 0,morphNormals:O.morphAttributes.normal!==void 0,morphColors:O.morphAttributes.color!==void 0,morphTargetsCount:Ft,morphTextureStride:ut,numSunLights:w.sun.length,numDirLights:w.directional.length,numPointLights:w.point.length,numSpotLights:w.spot.length,numSpotLightMaps:w.spotLightMap.length,numRectAreaLights:w.rectArea.length,numHemiLights:w.hemi.length,numSunLightShadows:w.sunShadowMap.length,numDirLightShadows:w.directionalShadowMap.length,numPointLightShadows:w.pointShadowMap.length,numSpotLightShadows:w.spotShadowMap.length,numSpotLightShadowsWithMaps:w.numSpotLightShadowsWithMaps,numLightProbes:w.numLightProbes,numLightProbeGrids:B.length,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:v.dithering,shadowMapEnabled:s.shadowMap.enabled&&P.length>0,shadowMapType:s.shadowMap.type,toneMapping:Ht,decodeVideoTexture:Jt&&v.map.isVideoTexture===!0&&de.getTransfer(v.map.colorSpace)===we,decodeVideoTextureEmissive:Gt&&v.emissiveMap.isVideoTexture===!0&&de.getTransfer(v.emissiveMap.colorSpace)===we,premultipliedAlpha:v.premultipliedAlpha,doubleSided:v.side===fi,flipSided:v.side===Je,useDepthPacking:v.depthPacking>=0,depthPacking:v.depthPacking||0,index0AttributeName:v.index0AttributeName,extensionClipCullDistance:st&&v.extensions.clipCullDistance===!0&&e.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(st&&v.extensions.multiDraw===!0||Tt)&&e.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:e.has("KHR_parallel_shader_compile"),customProgramCacheKey:v.customProgramCacheKey()};return Ut.vertexUv1s=l.has(1),Ut.vertexUv2s=l.has(2),Ut.vertexUv3s=l.has(3),l.clear(),Ut}function m(v){const w=[];if(v.shaderID?w.push(v.shaderID):(w.push(v.customVertexShaderID),w.push(v.customFragmentShaderID)),v.defines!==void 0)for(const P in v.defines)w.push(P),w.push(v.defines[P]);return v.isRawShaderMaterial===!1&&(g(w,v),b(w,v),w.push(s.outputColorSpace)),w.push(v.customProgramCacheKey),w.join()}function g(v,w){v.push(w.precision),v.push(w.outputColorSpace),v.push(w.envMapMode),v.push(w.envMapCubeUVHeight),v.push(w.mapUv),v.push(w.alphaMapUv),v.push(w.lightMapUv),v.push(w.aoMapUv),v.push(w.bumpMapUv),v.push(w.normalMapUv),v.push(w.displacementMapUv),v.push(w.emissiveMapUv),v.push(w.metalnessMapUv),v.push(w.roughnessMapUv),v.push(w.anisotropyMapUv),v.push(w.clearcoatMapUv),v.push(w.clearcoatNormalMapUv),v.push(w.clearcoatRoughnessMapUv),v.push(w.iridescenceMapUv),v.push(w.iridescenceThicknessMapUv),v.push(w.sheenColorMapUv),v.push(w.sheenRoughnessMapUv),v.push(w.specularMapUv),v.push(w.specularColorMapUv),v.push(w.specularIntensityMapUv),v.push(w.transmissionMapUv),v.push(w.thicknessMapUv),v.push(w.combine),v.push(w.fogExp2),v.push(w.sizeAttenuation),v.push(w.morphTargetsCount),v.push(w.morphAttributeCount),v.push(w.numSunLights),v.push(w.numDirLights),v.push(w.numPointLights),v.push(w.numSpotLights),v.push(w.numSpotLightMaps),v.push(w.numHemiLights),v.push(w.numRectAreaLights),v.push(w.numSunLightShadows),v.push(w.numDirLightShadows),v.push(w.numPointLightShadows),v.push(w.numSpotLightShadows),v.push(w.numSpotLightShadowsWithMaps),v.push(w.numLightProbes),v.push(w.shadowMapType),v.push(w.toneMapping),v.push(w.numClippingPlanes),v.push(w.numClipIntersection),v.push(w.depthPacking)}function b(v,w){a.disableAll(),w.instancing&&a.enable(0),w.instancingColor&&a.enable(1),w.instancingMorph&&a.enable(2),w.matcap&&a.enable(3),w.envMap&&a.enable(4),w.normalMapObjectSpace&&a.enable(5),w.normalMapTangentSpace&&a.enable(6),w.clearcoat&&a.enable(7),w.iridescence&&a.enable(8),w.alphaTest&&a.enable(9),w.vertexColors&&a.enable(10),w.vertexAlphas&&a.enable(11),w.vertexUv1s&&a.enable(12),w.vertexUv2s&&a.enable(13),w.vertexUv3s&&a.enable(14),w.vertexTangents&&a.enable(15),w.anisotropy&&a.enable(16),w.alphaHash&&a.enable(17),w.batching&&a.enable(18),w.dispersion&&a.enable(19),w.retroreflection&&a.enable(24),w.batchingColor&&a.enable(20),w.gradientMap&&a.enable(21),w.packedNormalMap&&a.enable(22),w.vertexNormals&&a.enable(23),v.push(a.mask),a.disableAll(),w.fog&&a.enable(0),w.useFog&&a.enable(1),w.flatShading&&a.enable(2),w.logarithmicDepthBuffer&&a.enable(3),w.reversedDepthBuffer&&a.enable(4),w.skinning&&a.enable(5),w.morphTargets&&a.enable(6),w.morphNormals&&a.enable(7),w.morphColors&&a.enable(8),w.premultipliedAlpha&&a.enable(9),w.shadowMapEnabled&&a.enable(10),w.doubleSided&&a.enable(11),w.flipSided&&a.enable(12),w.useDepthPacking&&a.enable(13),w.dithering&&a.enable(14),w.transmission&&a.enable(15),w.sheen&&a.enable(16),w.opaque&&a.enable(17),w.pointsUvs&&a.enable(18),w.decodeVideoTexture&&a.enable(19),w.decodeVideoTextureEmissive&&a.enable(20),w.alphaToCoverage&&a.enable(21),w.numLightProbeGrids>0&&a.enable(22),w.hasPositionAttribute&&a.enable(23),v.push(a.mask)}function A(v){const w=d[v.type];let P;if(w){const L=Ki[w];P=J0.clone(L.uniforms)}else P=v.uniforms;return P}function y(v,w){let P=h.get(w);return P!==void 0?++P.usedTimes:(P=new Tx(s,w,v,n),c.push(P),h.set(w,P)),P}function E(v){if(--v.usedTimes===0){const w=c.indexOf(v);c[w]=c[c.length-1],c.pop(),h.delete(v.cacheKey),v.destroy()}}function M(v){o.remove(v)}function T(){o.dispose()}return{getParameters:x,getProgramCacheKey:m,getUniforms:A,acquireProgram:y,releaseProgram:E,releaseShaderCache:M,programs:c,dispose:T}}function kx(){let s=new WeakMap;function t(a){return s.has(a)}function e(a){let o=s.get(a);return o===void 0&&(o={},s.set(a,o)),o}function i(a){s.delete(a)}function n(a,o,l){s.get(a)[o]=l}function r(){s=new WeakMap}return{has:t,get:e,remove:i,update:n,dispose:r}}function Ix(s,t){return s.groupOrder!==t.groupOrder?s.groupOrder-t.groupOrder:s.renderOrder!==t.renderOrder?s.renderOrder-t.renderOrder:s.material.id!==t.material.id?s.material.id-t.material.id:s.materialVariant!==t.materialVariant?s.materialVariant-t.materialVariant:s.z!==t.z?s.z-t.z:s.id-t.id}function vu(s,t){return s.groupOrder!==t.groupOrder?s.groupOrder-t.groupOrder:s.renderOrder!==t.renderOrder?s.renderOrder-t.renderOrder:s.z!==t.z?t.z-s.z:s.id-t.id}function xu(){const s=[];let t=0;const e=[],i=[],n=[];function r(){t=0,e.length=0,i.length=0,n.length=0}function a(u){let d=0;return u.isInstancedMesh&&(d+=2),u.isSkinnedMesh&&(d+=1),d}function o(u,d,p,x,m,g){let b=s[t];return b===void 0?(b={id:u.id,object:u,geometry:d,material:p,materialVariant:a(u),groupOrder:x,renderOrder:u.renderOrder,z:m,group:g},s[t]=b):(b.id=u.id,b.object=u,b.geometry=d,b.material=p,b.materialVariant=a(u),b.groupOrder=x,b.renderOrder=u.renderOrder,b.z=m,b.group=g),t++,b}function l(u,d,p,x,m,g,b){b.reversedDepth===!0&&(m=-m);const A=o(u,d,p,x,m,g);p.transmission>0?i.push(A):p.transparent===!0?n.push(A):e.push(A)}function c(u,d,p,x,m,g){const b=o(u,d,p,x,m,g);p.transmission>0?i.unshift(b):p.transparent===!0?n.unshift(b):e.unshift(b)}function h(u,d){e.length>1&&e.sort(u||Ix),i.length>1&&i.sort(d||vu),n.length>1&&n.sort(d||vu)}function f(){for(let u=t,d=s.length;u<d;u++){const p=s[u];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:e,transmissive:i,transparent:n,init:r,push:l,unshift:c,finish:f,sort:h}}function Dx(){let s=new WeakMap;function t(i,n){const r=s.get(i);let a;return r===void 0?(a=new xu,s.set(i,[a])):n>=r.length?(a=new xu,r.push(a)):a=r[n],a}function e(){s=new WeakMap}return{get:t,dispose:e}}function Ux(){const s={};return{get:function(t){if(s[t.id]!==void 0)return s[t.id];let e;switch(t.type){case"SunLight":case"DirectionalLight":e={direction:new R,color:new Kt};break;case"SpotLight":e={position:new R,direction:new R,color:new Kt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new R,color:new Kt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new R,skyColor:new Kt,groundColor:new Kt};break;case"RectAreaLight":e={color:new Kt,position:new R,halfWidth:new R,halfHeight:new R};break}return s[t.id]=e,e}}}function Fx(){const s={};return{get:function(t){if(s[t.id]!==void 0)return s[t.id];let e;switch(t.type){case"SunLight":case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ot};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ot};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ot,shadowCameraNear:1,shadowCameraFar:1e3};break}return s[t.id]=e,e}}}let Nx=0;function Ox(s,t){return(t.castShadow?2:0)-(s.castShadow?2:0)+(t.map?1:0)-(s.map?1:0)}function Bx(s){const t=new Ux,e=Fx(),i={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new R);const n=new R,r=new Se,a=new Se;function o(c){let h=0,f=0,u=0;for(let U=0;U<9;U++)i.probe[U].set(0,0,0);let d=0,p=0,x=0,m=0,g=0,b=0,A=0,y=0,E=0,M=0,T=0,v=0,w=0,P=0;c.sort(Ox);for(let U=0,B=c.length;U<B;U++){const F=c[U],O=F.color,$=F.intensity,V=F.distance;let nt=null;if(F.shadow&&F.shadow.map&&(F.shadow.map.texture.format===is?nt=F.shadow.map.texture:nt=F.shadow.map.depthTexture||F.shadow.map.texture),F.isAmbientLight)h+=O.r*$,f+=O.g*$,u+=O.b*$;else if(F.isLightProbe){for(let X=0;X<9;X++)i.probe[X].addScaledVector(F.sh.coefficients[X],$);P++}else if(F.isSunLight){const X=t.get(F);if(X.color.copy(F.color).multiplyScalar(F.intensity),F.castShadow){const Q=F.shadow,j=e.get(F);j.shadowIntensity=Q.intensity,j.shadowBias=Q.bias,j.shadowNormalBias=Q.normalBias,j.shadowRadius=Q.radius,j.shadowMapSize.copy(Q.mapSize).multiply(Q.getFrameExtents()),i.sunShadow[p]=j,i.sunShadowMap[p]=nt;const Ft=Q.getViewportCount();for(let ut=0;ut<Ft;ut++)i.sunShadowMatrix[x+ut]=Q.getMatrix(ut),i.sunShadowCascade[x+ut]=Q._cascadeData[ut];x+=Ft,p++}i.sun[d]=X,d++}else if(F.isDirectionalLight){const X=t.get(F);if(X.color.copy(F.color).multiplyScalar(F.intensity),F.castShadow){const Q=F.shadow,j=e.get(F);j.shadowIntensity=Q.intensity,j.shadowBias=Q.bias,j.shadowNormalBias=Q.normalBias,j.shadowRadius=Q.radius,j.shadowMapSize=Q.mapSize,i.directionalShadow[m]=j,i.directionalShadowMap[m]=nt,i.directionalShadowMatrix[m]=F.shadow.matrix,E++}i.directional[m]=X,m++}else if(F.isSpotLight){const X=t.get(F);X.position.setFromMatrixPosition(F.matrixWorld),X.color.copy(O).multiplyScalar($),X.distance=V,X.coneCos=Math.cos(F.angle),X.penumbraCos=Math.cos(F.angle*(1-F.penumbra)),X.decay=F.decay,i.spot[b]=X;const Q=F.shadow;if(F.map&&(i.spotLightMap[v]=F.map,v++,Q.updateMatrices(F),F.castShadow&&w++),i.spotLightMatrix[b]=Q.matrix,F.castShadow){const j=e.get(F);j.shadowIntensity=Q.intensity,j.shadowBias=Q.bias,j.shadowNormalBias=Q.normalBias,j.shadowRadius=Q.radius,j.shadowMapSize=Q.mapSize,i.spotShadow[b]=j,i.spotShadowMap[b]=nt,T++}b++}else if(F.isRectAreaLight){const X=t.get(F);X.color.copy(O).multiplyScalar($),X.halfWidth.set(F.width*.5,0,0),X.halfHeight.set(0,F.height*.5,0),i.rectArea[A]=X,A++}else if(F.isPointLight){const X=t.get(F);if(X.color.copy(F.color).multiplyScalar(F.intensity),X.distance=F.distance,X.decay=F.decay,F.castShadow){const Q=F.shadow,j=e.get(F);j.shadowIntensity=Q.intensity,j.shadowBias=Q.bias,j.shadowNormalBias=Q.normalBias,j.shadowRadius=Q.radius,j.shadowMapSize=Q.mapSize,j.shadowCameraNear=Q.camera.near,j.shadowCameraFar=Q.camera.far,i.pointShadow[g]=j,i.pointShadowMap[g]=nt,i.pointShadowMatrix[g]=F.shadow.matrix,M++}i.point[g]=X,g++}else if(F.isHemisphereLight){const X=t.get(F);X.skyColor.copy(F.color).multiplyScalar($),X.groundColor.copy(F.groundColor).multiplyScalar($),i.hemi[y]=X,y++}}A>0&&(s.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=yt.LTC_FLOAT_1,i.rectAreaLTC2=yt.LTC_FLOAT_2):(i.rectAreaLTC1=yt.LTC_HALF_1,i.rectAreaLTC2=yt.LTC_HALF_2)),i.ambient[0]=h,i.ambient[1]=f,i.ambient[2]=u;const L=i.hash;(L.sunLength!==d||L.directionalLength!==m||L.pointLength!==g||L.spotLength!==b||L.rectAreaLength!==A||L.hemiLength!==y||L.numSunShadows!==p||L.numDirectionalShadows!==E||L.numPointShadows!==M||L.numSpotShadows!==T||L.numSpotMaps!==v||L.numLightProbes!==P)&&(i.sun.length=d,i.directional.length=m,i.spot.length=b,i.rectArea.length=A,i.point.length=g,i.hemi.length=y,i.sunShadow.length=p,i.sunShadowMap.length=p,i.sunShadowMatrix.length=x,i.sunShadowCascade.length=x,i.directionalShadow.length=E,i.directionalShadowMap.length=E,i.directionalShadowMatrix.length=E,i.pointShadow.length=M,i.pointShadowMap.length=M,i.pointShadowMatrix.length=M,i.spotShadow.length=T,i.spotShadowMap.length=T,i.spotLightMatrix.length=T+v-w,i.spotLightMap.length=v,i.numSpotLightShadowsWithMaps=w,i.numLightProbes=P,L.sunLength=d,L.directionalLength=m,L.pointLength=g,L.spotLength=b,L.rectAreaLength=A,L.hemiLength=y,L.numSunShadows=p,L.numDirectionalShadows=E,L.numPointShadows=M,L.numSpotShadows=T,L.numSpotMaps=v,L.numLightProbes=P,i.version=Nx++)}function l(c,h){let f=0,u=0,d=0,p=0,x=0,m=0;const g=h.matrixWorldInverse;for(let b=0,A=c.length;b<A;b++){const y=c[b];if(y.isSunLight){const E=i.sun[f];E.direction.setFromMatrixPosition(y.matrixWorld),E.direction.transformDirection(g),f++}else if(y.isDirectionalLight){const E=i.directional[u];E.direction.setFromMatrixPosition(y.matrixWorld),n.setFromMatrixPosition(y.target.matrixWorld),E.direction.sub(n),E.direction.transformDirection(g),u++}else if(y.isSpotLight){const E=i.spot[p];E.position.setFromMatrixPosition(y.matrixWorld),E.position.applyMatrix4(g),E.direction.setFromMatrixPosition(y.matrixWorld),n.setFromMatrixPosition(y.target.matrixWorld),E.direction.sub(n),E.direction.transformDirection(g),p++}else if(y.isRectAreaLight){const E=i.rectArea[x];E.position.setFromMatrixPosition(y.matrixWorld),E.position.applyMatrix4(g),a.identity(),r.copy(y.matrixWorld),r.premultiply(g),a.extractRotation(r),E.halfWidth.set(y.width*.5,0,0),E.halfHeight.set(0,y.height*.5,0),E.halfWidth.applyMatrix4(a),E.halfHeight.applyMatrix4(a),x++}else if(y.isPointLight){const E=i.point[d];E.position.setFromMatrixPosition(y.matrixWorld),E.position.applyMatrix4(g),d++}else if(y.isHemisphereLight){const E=i.hemi[m];E.direction.setFromMatrixPosition(y.matrixWorld),E.direction.transformDirection(g),m++}}}return{setup:o,setupView:l,state:i}}function _u(s){const t=new Bx(s),e=[],i=[],n=[];function r(u){f.camera=u,e.length=0,i.length=0,n.length=0}function a(u){e.push(u)}function o(u){i.push(u)}function l(u){n.push(u)}function c(){t.setup(e)}function h(u){t.setupView(e,u)}const f={lightsArray:e,shadowsArray:i,lightProbeGridArray:n,camera:null,lights:t,transmissionRenderTarget:{},textureUnits:0};return{init:r,state:f,setupLights:c,setupLightsView:h,pushLight:a,pushShadow:o,pushLightProbeGrid:l}}function zx(s){let t=new WeakMap;function e(n,r=0){const a=t.get(n);let o;return a===void 0?(o=new _u(s),t.set(n,[o])):r>=a.length?(o=new _u(s),a.push(o)):o=a[r],o}function i(){t=new WeakMap}return{get:e,dispose:i}}const Hx=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Gx=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,Vx=[new R(1,0,0),new R(-1,0,0),new R(0,1,0),new R(0,-1,0),new R(0,0,1),new R(0,0,-1)],Wx=[new R(0,-1,0),new R(0,-1,0),new R(0,0,1),new R(0,0,-1),new R(0,-1,0),new R(0,-1,0)],yu=new Se,sr=new R,qo=new R;function Xx(s,t,e){let i=new Ac;const n=new ot,r=new ot,a=new Ue,o=new em,l=new im,c={},h=e.maxTextureSize,f={[ts]:Je,[Je]:ts,[fi]:fi},u=new Bi({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ot},radius:{value:4}},vertexShader:Hx,fragmentShader:Gx}),d=u.clone();d.defines.HORIZONTAL_PASS=1;const p=new Be;p.setAttribute("position",new xi(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const x=new qt(p,u),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=fr;let g=this.type;this.render=function(M,T,v){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||M.length===0)return;this.type===lp&&(Qt("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=fr);const w=s.getRenderTarget(),P=s.getActiveCubeFace(),L=s.getActiveMipmapLevel(),U=s.state;U.setBlending(gn),U.buffers.depth.getReversed()===!0?U.buffers.color.setClear(0,0,0,0):U.buffers.color.setClear(1,1,1,1),U.buffers.depth.setTest(!0),U.setScissorTest(!1);const B=g!==this.type;B&&T.traverse(function(F){F.material&&(Array.isArray(F.material)?F.material.forEach(O=>O.needsUpdate=!0):F.material.needsUpdate=!0)});for(let F=0,O=M.length;F<O;F++){const $=M[F],V=$.shadow;if(V===void 0){Qt("WebGLShadowMap:",$,"has no shadow.");continue}if(V.autoUpdate===!1&&V.needsUpdate===!1)continue;n.copy(V.mapSize);const nt=V.getFrameExtents();n.multiply(nt),r.copy(V.mapSize),(n.x>h||n.y>h)&&(n.x>h&&(r.x=Math.floor(h/nt.x),n.x=r.x*nt.x,V.mapSize.x=r.x),n.y>h&&(r.y=Math.floor(h/nt.y),n.y=r.y*nt.y,V.mapSize.y=r.y));const X=s.state.buffers.depth.getReversed();if(V.camera._reversedDepth=X,V.map===null||B===!0){if(V.map!==null&&(V.map.depthTexture!==null&&(V.map.depthTexture.dispose(),V.map.depthTexture=null),V.map.dispose()),this.type===or){if($.isPointLight){Qt("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}V.map=new Ui(n.x,n.y,{format:is,type:tn,minFilter:si,magFilter:si,generateMipmaps:!1}),V.map.texture.name=$.name+".shadowMap",V.map.depthTexture=new Er(n.x,n.y,Di),V.map.depthTexture.name=$.name+".shadowMapDepth",V.map.depthTexture.format=yn,V.map.depthTexture.compareFunction=null,V.map.depthTexture.minFilter=qe,V.map.depthTexture.magFilter=qe}else $.isPointLight?(V.map=new Xd(n.x),V.map.depthTexture=new m0(n.x,Qi)):(V.map=new Ui(n.x,n.y),V.map.depthTexture=new Er(n.x,n.y,Qi)),V.map.depthTexture.name=$.name+".shadowMap",V.map.depthTexture.format=yn,this.type===fr?(V.map.depthTexture.compareFunction=X?bc:Sc,V.map.depthTexture.minFilter=si,V.map.depthTexture.magFilter=si):(V.map.depthTexture.compareFunction=null,V.map.depthTexture.minFilter=qe,V.map.depthTexture.magFilter=qe);V.camera.updateProjectionMatrix()}V.map.isWebGLCubeRenderTarget!==!0&&(V.map.width!==n.x||V.map.height!==n.y)&&V.map.setSize(n.x,n.y);const Q=V.map.isWebGLCubeRenderTarget?6:V.getViewportCount();$.isPointLight!==!0&&V.updateMatrices($,v);for(let j=0;j<Q;j++){const Ft=V.getCamera(j);if($.isPointLight){const ut=V.camera,te=V.matrix,Zt=$.distance||ut.far;Zt!==ut.far&&(ut.far=Zt,ut.updateProjectionMatrix()),sr.setFromMatrixPosition($.matrixWorld),ut.position.copy(sr),qo.copy(ut.position),qo.add(Vx[j]),ut.up.copy(Wx[j]),ut.lookAt(qo),ut.updateMatrixWorld(),te.makeTranslation(-sr.x,-sr.y,-sr.z),yu.multiplyMatrices(ut.projectionMatrix,ut.matrixWorldInverse),V._frustum.setFromProjectionMatrix(yu,ut.coordinateSystem,ut.reversedDepth)}if(V.map.isWebGLCubeRenderTarget)s.setRenderTarget(V.map,j),s.clear();else{j===0&&(s.setRenderTarget(V.map),s.clear());const ut=V.getViewport(j);a.set(r.x*ut.x,r.y*ut.y,r.x*ut.z,r.y*ut.w),U.viewport(a)}i=V.getFrustum(j),y(T,v,Ft,$,this.type)}V.isPointLightShadow!==!0&&this.type===or&&b(V,v),V.needsUpdate=!1}g=this.type,m.needsUpdate=!1,s.setRenderTarget(w,P,L)};function b(M,T){const v=t.update(x);u.defines.VSM_SAMPLES!==M.blurSamples&&(u.defines.VSM_SAMPLES=M.blurSamples,d.defines.VSM_SAMPLES=M.blurSamples,u.needsUpdate=!0,d.needsUpdate=!0),M.mapPass===null?M.mapPass=new Ui(n.x,n.y,{format:is,type:tn}):(M.mapPass.width!==M.map.width||M.mapPass.height!==M.map.height)&&M.mapPass.setSize(M.map.width,M.map.height),u.uniforms.shadow_pass.value=M.map.depthTexture,u.uniforms.resolution.value.set(M.map.width,M.map.height),u.uniforms.radius.value=M.radius,s.setRenderTarget(M.mapPass),s.clear(),s.renderBufferDirect(T,null,v,u,x,null),d.uniforms.shadow_pass.value=M.mapPass.texture,d.uniforms.resolution.value.set(M.map.width,M.map.height),d.uniforms.radius.value=M.radius,s.setRenderTarget(M.map),s.clear(),s.renderBufferDirect(T,null,v,d,x,null)}function A(M,T,v,w){let P=null;const L=v.isPointLight===!0?M.customDistanceMaterial:M.customDepthMaterial;if(L!==void 0)P=L;else if(P=v.isPointLight===!0?l:o,s.localClippingEnabled&&T.clipShadows===!0&&Array.isArray(T.clippingPlanes)&&T.clippingPlanes.length!==0||T.displacementMap&&T.displacementScale!==0||T.alphaMap&&T.alphaTest>0||T.map&&T.alphaTest>0||T.alphaToCoverage===!0){const U=P.uuid,B=T.uuid;let F=c[U];F===void 0&&(F={},c[U]=F);let O=F[B];O===void 0&&(O=P.clone(),F[B]=O,T.addEventListener("dispose",E)),P=O}if(P.visible=T.visible,P.wireframe=T.wireframe,w===or?P.side=T.shadowSide!==null?T.shadowSide:T.side:P.side=T.shadowSide!==null?T.shadowSide:f[T.side],P.alphaMap=T.alphaMap,P.alphaTest=T.alphaToCoverage===!0?.5:T.alphaTest,P.map=T.map,P.clipShadows=T.clipShadows,P.clippingPlanes=T.clippingPlanes,P.clipIntersection=T.clipIntersection,P.displacementMap=T.displacementMap,P.displacementScale=T.displacementScale,P.displacementBias=T.displacementBias,P.wireframeLinewidth=T.wireframeLinewidth,P.linewidth=T.linewidth,v.isPointLight===!0&&P.isMeshDistanceMaterial===!0){const U=s.properties.get(P);U.light=v}return P}function y(M,T,v,w,P){if(M.visible===!1)return;if(M.layers.test(T.layers)&&(M.isMesh||M.isLine||M.isPoints)&&(M.castShadow||M.receiveShadow&&P===or)&&(!M.frustumCulled||M.intersectsFrustum(i))){M.modelViewMatrix.multiplyMatrices(v.matrixWorldInverse,M.matrixWorld);const B=t.update(M),F=M.material;if(Array.isArray(F)){const O=B.groups;for(let $=0,V=O.length;$<V;$++){const nt=O[$],X=F[nt.materialIndex];if(X&&X.visible){const Q=A(M,X,w,P);M.onBeforeShadow(s,M,T,v,B,Q,nt),s.renderBufferDirect(v,null,B,Q,M,nt),M.onAfterShadow(s,M,T,v,B,Q,nt)}}}else if(F.visible){const O=A(M,F,w,P);M.onBeforeShadow(s,M,T,v,B,O,null),s.renderBufferDirect(v,null,B,O,M,null),M.onAfterShadow(s,M,T,v,B,O,null)}}const U=M.children;for(let B=0,F=U.length;B<F;B++)y(U[B],T,v,w,P)}function E(M){M.target.removeEventListener("dispose",E);for(const v in c){const w=c[v],P=M.target.uuid;P in w&&(w[P].dispose(),delete w[P])}}}function qx(s,t){function e(){let D=!1;const vt=new Ue;let J=null;const xt=new Ue(0,0,0,0);return{setMask:function(Et){J!==Et&&!D&&(s.colorMask(Et,Et,Et,Et),J=Et)},setLocked:function(Et){D=Et},setClear:function(Et,st,Ht,Ut,Re){Re===!0&&(Et*=Ut,st*=Ut,Ht*=Ut),vt.set(Et,st,Ht,Ut),xt.equals(vt)===!1&&(s.clearColor(Et,st,Ht,Ut),xt.copy(vt))},reset:function(){D=!1,J=null,xt.set(-1,0,0,0)}}}function i(){let D=!1,vt=!1,J=null,xt=null,Et=null;return{setReversed:function(st){if(vt!==st){const Ht=t.get("EXT_clip_control");st?Ht.clipControlEXT(Ht.LOWER_LEFT_EXT,Ht.ZERO_TO_ONE_EXT):Ht.clipControlEXT(Ht.LOWER_LEFT_EXT,Ht.NEGATIVE_ONE_TO_ONE_EXT),vt=st;const Ut=Et;Et=null,this.setClear(Ut)}},getReversed:function(){return vt},setTest:function(st){st?et(s.DEPTH_TEST):Mt(s.DEPTH_TEST)},setMask:function(st){J!==st&&!D&&(s.depthMask(st),J=st)},setFunc:function(st){if(vt&&(st=Vp[st]),xt!==st){switch(st){case pl:s.depthFunc(s.NEVER);break;case ml:s.depthFunc(s.ALWAYS);break;case gl:s.depthFunc(s.LESS);break;case Mr:s.depthFunc(s.LEQUAL);break;case vl:s.depthFunc(s.EQUAL);break;case xl:s.depthFunc(s.GEQUAL);break;case _l:s.depthFunc(s.GREATER);break;case yl:s.depthFunc(s.NOTEQUAL);break;default:s.depthFunc(s.LEQUAL)}xt=st}},setLocked:function(st){D=st},setClear:function(st){Et!==st&&(Et=st,vt&&(st=1-st),s.clearDepth(st))},reset:function(){D=!1,J=null,xt=null,Et=null,vt=!1}}}function n(){let D=!1,vt=null,J=null,xt=null,Et=null,st=null,Ht=null,Ut=null,Re=null;return{setTest:function(ye){D||(ye?et(s.STENCIL_TEST):Mt(s.STENCIL_TEST))},setMask:function(ye){vt!==ye&&!D&&(s.stencilMask(ye),vt=ye)},setFunc:function(ye,Pi,zi){(J!==ye||xt!==Pi||Et!==zi)&&(s.stencilFunc(ye,Pi,zi),J=ye,xt=Pi,Et=zi)},setOp:function(ye,Pi,zi){(st!==ye||Ht!==Pi||Ut!==zi)&&(s.stencilOp(ye,Pi,zi),st=ye,Ht=Pi,Ut=zi)},setLocked:function(ye){D=ye},setClear:function(ye){Re!==ye&&(s.clearStencil(ye),Re=ye)},reset:function(){D=!1,vt=null,J=null,xt=null,Et=null,st=null,Ht=null,Ut=null,Re=null}}}const r=new e,a=new i,o=new n,l=new WeakMap,c=new WeakMap;let h={},f={},u={},d=new WeakMap,p=[],x=null,m=!1,g=null,b=null,A=null,y=null,E=null,M=null,T=null,v=new Kt(0,0,0),w=0,P=!1,L=null,U=null,B=null,F=null,O=null;const $=s.getParameter(s.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let V=!1,nt=0;const X=s.getParameter(s.VERSION);X.indexOf("WebGL")!==-1?(nt=parseFloat(/^WebGL (\d)/.exec(X)[1]),V=nt>=1):X.indexOf("OpenGL ES")!==-1&&(nt=parseFloat(/^OpenGL ES (\d)/.exec(X)[1]),V=nt>=2);let Q=null,j={};const Ft=s.getParameter(s.SCISSOR_BOX),ut=s.getParameter(s.VIEWPORT),te=new Ue().fromArray(Ft),Zt=new Ue().fromArray(ut);function ee(D,vt,J,xt){const Et=new Uint8Array(4),st=s.createTexture();s.bindTexture(D,st),s.texParameteri(D,s.TEXTURE_MIN_FILTER,s.NEAREST),s.texParameteri(D,s.TEXTURE_MAG_FILTER,s.NEAREST);for(let Ht=0;Ht<J;Ht++)D===s.TEXTURE_3D||D===s.TEXTURE_2D_ARRAY?s.texImage3D(vt,0,s.RGBA,1,1,xt,0,s.RGBA,s.UNSIGNED_BYTE,Et):s.texImage2D(vt+Ht,0,s.RGBA,1,1,0,s.RGBA,s.UNSIGNED_BYTE,Et);return st}const Z={};Z[s.TEXTURE_2D]=ee(s.TEXTURE_2D,s.TEXTURE_2D,1),Z[s.TEXTURE_CUBE_MAP]=ee(s.TEXTURE_CUBE_MAP,s.TEXTURE_CUBE_MAP_POSITIVE_X,6),Z[s.TEXTURE_2D_ARRAY]=ee(s.TEXTURE_2D_ARRAY,s.TEXTURE_2D_ARRAY,1,1),Z[s.TEXTURE_3D]=ee(s.TEXTURE_3D,s.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),et(s.DEPTH_TEST),a.setFunc(Mr),ct(!1),ft(uh),et(s.CULL_FACE),rt(gn);function et(D){h[D]!==!0&&(s.enable(D),h[D]=!0)}function Mt(D){h[D]!==!1&&(s.disable(D),h[D]=!1)}function $t(D,vt){return u[D]!==vt?(s.bindFramebuffer(D,vt),u[D]=vt,D===s.DRAW_FRAMEBUFFER&&(u[s.FRAMEBUFFER]=vt),D===s.FRAMEBUFFER&&(u[s.DRAW_FRAMEBUFFER]=vt),!0):!1}function Tt(D,vt){let J=p,xt=!1;if(D){J=d.get(vt),J===void 0&&(J=[],d.set(vt,J));const Et=D.textures;if(J.length!==Et.length||J[0]!==s.COLOR_ATTACHMENT0){for(let st=0,Ht=Et.length;st<Ht;st++)J[st]=s.COLOR_ATTACHMENT0+st;J.length=Et.length,xt=!0}}else J[0]!==s.BACK&&(J[0]=s.BACK,xt=!0);xt&&s.drawBuffers(J)}function Jt(D){return x!==D?(s.useProgram(D),x=D,!0):!1}const be={[Rs]:s.FUNC_ADD,[hp]:s.FUNC_SUBTRACT,[up]:s.FUNC_REVERSE_SUBTRACT};be[dp]=s.MIN,be[fp]=s.MAX;const it={[pp]:s.ZERO,[mp]:s.ONE,[gp]:s.SRC_COLOR,[id]:s.SRC_ALPHA,[Sp]:s.SRC_ALPHA_SATURATE,[yp]:s.DST_COLOR,[xp]:s.DST_ALPHA,[vp]:s.ONE_MINUS_SRC_COLOR,[nd]:s.ONE_MINUS_SRC_ALPHA,[Mp]:s.ONE_MINUS_DST_COLOR,[_p]:s.ONE_MINUS_DST_ALPHA,[bp]:s.CONSTANT_COLOR,[wp]:s.ONE_MINUS_CONSTANT_COLOR,[Ep]:s.CONSTANT_ALPHA,[Tp]:s.ONE_MINUS_CONSTANT_ALPHA};function rt(D,vt,J,xt,Et,st,Ht,Ut,Re,ye){if(D===gn){m===!0&&(Mt(s.BLEND),m=!1);return}if(m===!1&&(et(s.BLEND),m=!0),D!==cp){if(D!==g||ye!==P){if((b!==Rs||E!==Rs)&&(s.blendEquation(s.FUNC_ADD),b=Rs,E=Rs),ye)switch(D){case pr:s.blendFuncSeparate(s.ONE,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case Ra:s.blendFunc(s.ONE,s.ONE);break;case dh:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case fh:s.blendFuncSeparate(s.DST_COLOR,s.ONE_MINUS_SRC_ALPHA,s.ZERO,s.ONE);break;default:me("WebGLState: Invalid blending: ",D);break}else switch(D){case pr:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case Ra:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE,s.ONE,s.ONE);break;case dh:me("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case fh:me("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:me("WebGLState: Invalid blending: ",D);break}A=null,y=null,M=null,T=null,v.set(0,0,0),w=0,g=D,P=ye}return}Et=Et||vt,st=st||J,Ht=Ht||xt,(vt!==b||Et!==E)&&(s.blendEquationSeparate(be[vt],be[Et]),b=vt,E=Et),(J!==A||xt!==y||st!==M||Ht!==T)&&(s.blendFuncSeparate(it[J],it[xt],it[st],it[Ht]),A=J,y=xt,M=st,T=Ht),(Ut.equals(v)===!1||Re!==w)&&(s.blendColor(Ut.r,Ut.g,Ut.b,Re),v.copy(Ut),w=Re),g=D,P=!1}function lt(D,vt){D.side===fi?Mt(s.CULL_FACE):et(s.CULL_FACE);let J=D.side===Je;vt&&(J=!J),ct(J),D.blending===pr&&D.transparent===!1?rt(gn):rt(D.blending,D.blendEquation,D.blendSrc,D.blendDst,D.blendEquationAlpha,D.blendSrcAlpha,D.blendDstAlpha,D.blendColor,D.blendAlpha,D.premultipliedAlpha),a.setFunc(D.depthFunc),a.setTest(D.depthTest),a.setMask(D.depthWrite),r.setMask(D.colorWrite);const xt=D.stencilWrite;o.setTest(xt),xt&&(o.setMask(D.stencilWriteMask),o.setFunc(D.stencilFunc,D.stencilRef,D.stencilFuncMask),o.setOp(D.stencilFail,D.stencilZFail,D.stencilZPass)),Gt(D.polygonOffset,D.polygonOffsetFactor,D.polygonOffsetUnits),D.alphaToCoverage===!0?et(s.SAMPLE_ALPHA_TO_COVERAGE):Mt(s.SAMPLE_ALPHA_TO_COVERAGE)}function ct(D){L!==D&&(D?s.frontFace(s.CW):s.frontFace(s.CCW),L=D)}function ft(D){D!==ap?(et(s.CULL_FACE),D!==U&&(D===uh?s.cullFace(s.BACK):D===op?s.cullFace(s.FRONT):s.cullFace(s.FRONT_AND_BACK))):Mt(s.CULL_FACE),U=D}function Wt(D){D!==B&&(V&&s.lineWidth(D),B=D)}function Gt(D,vt,J){D?(et(s.POLYGON_OFFSET_FILL),(F!==vt||O!==J)&&(F=vt,O=J,a.getReversed()&&(vt=-vt),s.polygonOffset(vt,J))):Mt(s.POLYGON_OFFSET_FILL)}function jt(D){D?et(s.SCISSOR_TEST):Mt(s.SCISSOR_TEST)}function ie(D){D===void 0&&(D=s.TEXTURE0+$-1),Q!==D&&(s.activeTexture(D),Q=D)}function k(D,vt,J){J===void 0&&(Q===null?J=s.TEXTURE0+$-1:J=Q);let xt=j[J];xt===void 0&&(xt={type:void 0,texture:void 0},j[J]=xt),(xt.type!==D||xt.texture!==vt)&&(Q!==J&&(s.activeTexture(J),Q=J),s.bindTexture(D,vt||Z[D]),xt.type=D,xt.texture=vt)}function _e(){const D=j[Q];D!==void 0&&D.type!==void 0&&(s.bindTexture(D.type,null),D.type=void 0,D.texture=void 0)}function ce(){try{s.compressedTexImage2D(...arguments)}catch(D){me("WebGLState:",D)}}function C(){try{s.compressedTexImage3D(...arguments)}catch(D){me("WebGLState:",D)}}function _(){try{s.texSubImage2D(...arguments)}catch(D){me("WebGLState:",D)}}function N(){try{s.texSubImage3D(...arguments)}catch(D){me("WebGLState:",D)}}function G(){try{s.compressedTexSubImage2D(...arguments)}catch(D){me("WebGLState:",D)}}function K(){try{s.compressedTexSubImage3D(...arguments)}catch(D){me("WebGLState:",D)}}function ht(){try{s.texStorage2D(...arguments)}catch(D){me("WebGLState:",D)}}function dt(){try{s.texStorage3D(...arguments)}catch(D){me("WebGLState:",D)}}function Y(){try{s.texImage2D(...arguments)}catch(D){me("WebGLState:",D)}}function tt(){try{s.texImage3D(...arguments)}catch(D){me("WebGLState:",D)}}function mt(D){return f[D]!==void 0?f[D]:s.getParameter(D)}function Bt(D,vt){f[D]!==vt&&(s.pixelStorei(D,vt),f[D]=vt)}function _t(D){te.equals(D)===!1&&(s.scissor(D.x,D.y,D.z,D.w),te.copy(D))}function gt(D){Zt.equals(D)===!1&&(s.viewport(D.x,D.y,D.z,D.w),Zt.copy(D))}function zt(D,vt){let J=c.get(vt);J===void 0&&(J=new WeakMap,c.set(vt,J));let xt=J.get(D);xt===void 0&&(xt=s.getUniformBlockIndex(vt,D.name),J.set(D,xt))}function Xt(D,vt){const xt=c.get(vt).get(D);l.get(vt)!==xt&&(s.uniformBlockBinding(vt,xt,D.__bindingPointIndex),l.set(vt,xt))}function se(){s.disable(s.BLEND),s.disable(s.CULL_FACE),s.disable(s.DEPTH_TEST),s.disable(s.POLYGON_OFFSET_FILL),s.disable(s.SCISSOR_TEST),s.disable(s.STENCIL_TEST),s.disable(s.SAMPLE_ALPHA_TO_COVERAGE),s.blendEquation(s.FUNC_ADD),s.blendFunc(s.ONE,s.ZERO),s.blendFuncSeparate(s.ONE,s.ZERO,s.ONE,s.ZERO),s.blendColor(0,0,0,0),s.colorMask(!0,!0,!0,!0),s.clearColor(0,0,0,0),s.depthMask(!0),s.depthFunc(s.LESS),a.setReversed(!1),s.clearDepth(1),s.stencilMask(4294967295),s.stencilFunc(s.ALWAYS,0,4294967295),s.stencilOp(s.KEEP,s.KEEP,s.KEEP),s.clearStencil(0),s.cullFace(s.BACK),s.frontFace(s.CCW),s.polygonOffset(0,0),s.activeTexture(s.TEXTURE0),s.bindFramebuffer(s.FRAMEBUFFER,null),s.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),s.bindFramebuffer(s.READ_FRAMEBUFFER,null),s.useProgram(null),s.lineWidth(1),s.scissor(0,0,s.canvas.width,s.canvas.height),s.viewport(0,0,s.canvas.width,s.canvas.height),s.pixelStorei(s.PACK_ALIGNMENT,4),s.pixelStorei(s.UNPACK_ALIGNMENT,4),s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,!1),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,s.BROWSER_DEFAULT_WEBGL),s.pixelStorei(s.PACK_ROW_LENGTH,0),s.pixelStorei(s.PACK_SKIP_PIXELS,0),s.pixelStorei(s.PACK_SKIP_ROWS,0),s.pixelStorei(s.UNPACK_ROW_LENGTH,0),s.pixelStorei(s.UNPACK_IMAGE_HEIGHT,0),s.pixelStorei(s.UNPACK_SKIP_PIXELS,0),s.pixelStorei(s.UNPACK_SKIP_ROWS,0),s.pixelStorei(s.UNPACK_SKIP_IMAGES,0),h={},f={},Q=null,j={},u={},d=new WeakMap,p=[],x=null,m=!1,g=null,b=null,A=null,y=null,E=null,M=null,T=null,v=new Kt(0,0,0),w=0,P=!1,L=null,U=null,B=null,F=null,O=null,te.set(0,0,s.canvas.width,s.canvas.height),Zt.set(0,0,s.canvas.width,s.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:et,disable:Mt,bindFramebuffer:$t,drawBuffers:Tt,useProgram:Jt,setBlending:rt,setMaterial:lt,setFlipSided:ct,setCullFace:ft,setLineWidth:Wt,setPolygonOffset:Gt,setScissorTest:jt,activeTexture:ie,bindTexture:k,unbindTexture:_e,compressedTexImage2D:ce,compressedTexImage3D:C,texImage2D:Y,texImage3D:tt,pixelStorei:Bt,getParameter:mt,updateUBOMapping:zt,uniformBlockBinding:Xt,texStorage2D:ht,texStorage3D:dt,texSubImage2D:_,texSubImage3D:N,compressedTexSubImage2D:G,compressedTexSubImage3D:K,scissor:_t,viewport:gt,reset:se}}function Kx(s,t,e,i,n,r,a){const o=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new ot,h=new WeakMap,f=new Set;let u;const d=new WeakMap;let p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function x(C,_){return p?new OffscreenCanvas(C,_):Na("canvas")}function m(C,_,N){let G=1;const K=ce(C);if((K.width>N||K.height>N)&&(G=N/Math.max(K.width,K.height)),G<1)if(typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&C instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&C instanceof ImageBitmap||typeof VideoFrame<"u"&&C instanceof VideoFrame){const ht=Math.floor(G*K.width),dt=Math.floor(G*K.height);u===void 0&&(u=x(ht,dt));const Y=_?x(ht,dt):u;return Y.width=ht,Y.height=dt,Y.getContext("2d").drawImage(C,0,0,ht,dt),Qt("WebGLRenderer: Texture has been resized from ("+K.width+"x"+K.height+") to ("+ht+"x"+dt+")."),Y}else return"data"in C&&Qt("WebGLRenderer: Image in DataTexture is too big ("+K.width+"x"+K.height+")."),C;return C}function g(C){return C.generateMipmaps}function b(C){s.generateMipmap(C)}function A(C){return C.isWebGLCubeRenderTarget?s.TEXTURE_CUBE_MAP:C.isWebGL3DRenderTarget?s.TEXTURE_3D:C.isWebGLArrayRenderTarget||C.isCompressedArrayTexture?s.TEXTURE_2D_ARRAY:s.TEXTURE_2D}function y(C,_,N,G,K,ht=!1){if(C!==null){if(s[C]!==void 0)return s[C];Qt("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+C+"'")}let dt;G&&(dt=t.get("EXT_texture_norm16"),dt||Qt("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let Y=_;if(_===s.RED&&(N===s.FLOAT&&(Y=s.R32F),N===s.HALF_FLOAT&&(Y=s.R16F),N===s.UNSIGNED_BYTE&&(Y=s.R8),N===s.UNSIGNED_SHORT&&dt&&(Y=dt.R16_EXT),N===s.SHORT&&dt&&(Y=dt.R16_SNORM_EXT)),_===s.RED_INTEGER&&(N===s.UNSIGNED_BYTE&&(Y=s.R8UI),N===s.UNSIGNED_SHORT&&(Y=s.R16UI),N===s.UNSIGNED_INT&&(Y=s.R32UI),N===s.BYTE&&(Y=s.R8I),N===s.SHORT&&(Y=s.R16I),N===s.INT&&(Y=s.R32I)),_===s.RG&&(N===s.FLOAT&&(Y=s.RG32F),N===s.HALF_FLOAT&&(Y=s.RG16F),N===s.UNSIGNED_BYTE&&(Y=s.RG8),N===s.UNSIGNED_SHORT&&dt&&(Y=dt.RG16_EXT),N===s.SHORT&&dt&&(Y=dt.RG16_SNORM_EXT)),_===s.RG_INTEGER&&(N===s.UNSIGNED_BYTE&&(Y=s.RG8UI),N===s.UNSIGNED_SHORT&&(Y=s.RG16UI),N===s.UNSIGNED_INT&&(Y=s.RG32UI),N===s.BYTE&&(Y=s.RG8I),N===s.SHORT&&(Y=s.RG16I),N===s.INT&&(Y=s.RG32I)),_===s.RGB_INTEGER&&(N===s.UNSIGNED_BYTE&&(Y=s.RGB8UI),N===s.UNSIGNED_SHORT&&(Y=s.RGB16UI),N===s.UNSIGNED_INT&&(Y=s.RGB32UI),N===s.BYTE&&(Y=s.RGB8I),N===s.SHORT&&(Y=s.RGB16I),N===s.INT&&(Y=s.RGB32I)),_===s.RGBA_INTEGER&&(N===s.UNSIGNED_BYTE&&(Y=s.RGBA8UI),N===s.UNSIGNED_SHORT&&(Y=s.RGBA16UI),N===s.UNSIGNED_INT&&(Y=s.RGBA32UI),N===s.BYTE&&(Y=s.RGBA8I),N===s.SHORT&&(Y=s.RGBA16I),N===s.INT&&(Y=s.RGBA32I)),_===s.RGB&&(N===s.UNSIGNED_SHORT&&dt&&(Y=dt.RGB16_EXT),N===s.SHORT&&dt&&(Y=dt.RGB16_SNORM_EXT),N===s.UNSIGNED_INT_5_9_9_9_REV&&(Y=s.RGB9_E5),N===s.UNSIGNED_INT_10F_11F_11F_REV&&(Y=s.R11F_G11F_B10F)),_===s.RGBA){const tt=ht?Fa:de.getTransfer(K);N===s.FLOAT&&(Y=s.RGBA32F),N===s.HALF_FLOAT&&(Y=s.RGBA16F),N===s.UNSIGNED_BYTE&&(Y=tt===we?s.SRGB8_ALPHA8:s.RGBA8),N===s.UNSIGNED_SHORT&&dt&&(Y=dt.RGBA16_EXT),N===s.SHORT&&dt&&(Y=dt.RGBA16_SNORM_EXT),N===s.UNSIGNED_SHORT_4_4_4_4&&(Y=s.RGBA4),N===s.UNSIGNED_SHORT_5_5_5_1&&(Y=s.RGB5_A1)}return(Y===s.R16F||Y===s.R32F||Y===s.RG16F||Y===s.RG32F||Y===s.RGBA16F||Y===s.RGBA32F)&&t.get("EXT_color_buffer_float"),Y}function E(C,_){let N;return C?_===null||_===Qi||_===br?N=s.DEPTH24_STENCIL8:_===Di?N=s.DEPTH32F_STENCIL8:_===Sr&&(N=s.DEPTH24_STENCIL8,Qt("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):_===null||_===Qi||_===br?N=s.DEPTH_COMPONENT24:_===Di?N=s.DEPTH_COMPONENT32F:_===Sr&&(N=s.DEPTH_COMPONENT16),N}function M(C,_){return g(C)===!0||C.isFramebufferTexture&&C.minFilter!==qe&&C.minFilter!==si?Math.log2(Math.max(_.width,_.height))+1:C.mipmaps!==void 0&&C.mipmaps.length>0?C.mipmaps.length:C.isCompressedTexture&&Array.isArray(C.image)?_.mipmaps.length:1}function T(C){const _=C.target;_.removeEventListener("dispose",T),w(_),_.isVideoTexture&&h.delete(_),_.isHTMLTexture&&f.delete(_)}function v(C){const _=C.target;_.removeEventListener("dispose",v),L(_)}function w(C){const _=i.get(C);if(_.__webglInit===void 0)return;const N=C.source,G=d.get(N);if(G){const K=G[_.__cacheKey];K.usedTimes--,K.usedTimes===0&&P(C),Object.keys(G).length===0&&d.delete(N)}i.remove(C)}function P(C){const _=i.get(C);s.deleteTexture(_.__webglTexture);const N=C.source,G=d.get(N);delete G[_.__cacheKey],a.memory.textures--}function L(C){const _=i.get(C);if(C.depthTexture&&(C.depthTexture.dispose(),i.remove(C.depthTexture)),C.isWebGLCubeRenderTarget)for(let G=0;G<6;G++){if(Array.isArray(_.__webglFramebuffer[G]))for(let K=0;K<_.__webglFramebuffer[G].length;K++)s.deleteFramebuffer(_.__webglFramebuffer[G][K]);else s.deleteFramebuffer(_.__webglFramebuffer[G]);_.__webglDepthbuffer&&s.deleteRenderbuffer(_.__webglDepthbuffer[G])}else{if(Array.isArray(_.__webglFramebuffer))for(let G=0;G<_.__webglFramebuffer.length;G++)s.deleteFramebuffer(_.__webglFramebuffer[G]);else s.deleteFramebuffer(_.__webglFramebuffer);if(_.__webglDepthbuffer&&s.deleteRenderbuffer(_.__webglDepthbuffer),_.__webglMultisampledFramebuffer&&s.deleteFramebuffer(_.__webglMultisampledFramebuffer),_.__webglColorRenderbuffer)for(let G=0;G<_.__webglColorRenderbuffer.length;G++)_.__webglColorRenderbuffer[G]&&s.deleteRenderbuffer(_.__webglColorRenderbuffer[G]);_.__webglDepthRenderbuffer&&s.deleteRenderbuffer(_.__webglDepthRenderbuffer)}const N=C.textures;for(let G=0,K=N.length;G<K;G++){const ht=i.get(N[G]);ht.__webglTexture&&(s.deleteTexture(ht.__webglTexture),a.memory.textures--),i.remove(N[G])}i.remove(C)}let U=0;function B(){U=0}function F(){return U}function O(C){U=C}function $(){const C=U;return C>=n.maxTextures&&Qt("WebGLTextures: Trying to use "+(C+1)+" texture units while this GPU supports only "+n.maxTextures),U+=1,C}function V(C){const _=[];return _.push(C.wrapS),_.push(C.wrapT),_.push(C.wrapR||0),_.push(C.magFilter),_.push(C.minFilter),_.push(C.anisotropy),_.push(C.internalFormat),_.push(C.format),_.push(C.type),_.push(C.generateMipmaps),_.push(C.premultiplyAlpha),_.push(C.flipY),_.push(C.unpackAlignment),_.push(C.colorSpace),_.join()}function nt(C,_){const N=i.get(C);if(C.isVideoTexture&&k(C),C.isRenderTargetTexture===!1&&C.isExternalTexture!==!0&&C.version>0&&N.__version!==C.version){const G=C.image;if(G===null)Qt("WebGLRenderer: Texture marked for update but no image data found.");else if(G.complete===!1)Qt("WebGLRenderer: Texture marked for update but image is incomplete");else{Mt(N,C,_);return}}else C.isExternalTexture&&(N.__webglTexture=C.sourceTexture?C.sourceTexture:null);e.bindTexture(s.TEXTURE_2D,N.__webglTexture,s.TEXTURE0+_)}function X(C,_){const N=i.get(C);if(C.isRenderTargetTexture===!1&&C.version>0&&N.__version!==C.version){Mt(N,C,_);return}else C.isExternalTexture&&(N.__webglTexture=C.sourceTexture?C.sourceTexture:null);e.bindTexture(s.TEXTURE_2D_ARRAY,N.__webglTexture,s.TEXTURE0+_)}function Q(C,_){const N=i.get(C);if(C.isRenderTargetTexture===!1&&C.version>0&&N.__version!==C.version){Mt(N,C,_);return}e.bindTexture(s.TEXTURE_3D,N.__webglTexture,s.TEXTURE0+_)}function j(C,_){const N=i.get(C);if(C.isCubeDepthTexture!==!0&&C.version>0&&N.__version!==C.version){$t(N,C,_);return}e.bindTexture(s.TEXTURE_CUBE_MAP,N.__webglTexture,s.TEXTURE0+_)}const Ft={[La]:s.REPEAT,[pn]:s.CLAMP_TO_EDGE,[Ml]:s.MIRRORED_REPEAT},ut={[qe]:s.NEAREST,[Pp]:s.NEAREST_MIPMAP_NEAREST,[Br]:s.NEAREST_MIPMAP_LINEAR,[si]:s.LINEAR,[uo]:s.LINEAR_MIPMAP_NEAREST,[Jn]:s.LINEAR_MIPMAP_LINEAR},te={[Ip]:s.NEVER,[Op]:s.ALWAYS,[Dp]:s.LESS,[Sc]:s.LEQUAL,[Up]:s.EQUAL,[bc]:s.GEQUAL,[Fp]:s.GREATER,[Np]:s.NOTEQUAL};function Zt(C,_){if(_.type===Di&&t.has("OES_texture_float_linear")===!1&&(_.magFilter===si||_.magFilter===uo||_.magFilter===Br||_.magFilter===Jn||_.minFilter===si||_.minFilter===uo||_.minFilter===Br||_.minFilter===Jn)&&Qt("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),s.texParameteri(C,s.TEXTURE_WRAP_S,Ft[_.wrapS]),s.texParameteri(C,s.TEXTURE_WRAP_T,Ft[_.wrapT]),(C===s.TEXTURE_3D||C===s.TEXTURE_2D_ARRAY)&&s.texParameteri(C,s.TEXTURE_WRAP_R,Ft[_.wrapR]),s.texParameteri(C,s.TEXTURE_MAG_FILTER,ut[_.magFilter]),s.texParameteri(C,s.TEXTURE_MIN_FILTER,ut[_.minFilter]),_.compareFunction&&(s.texParameteri(C,s.TEXTURE_COMPARE_MODE,s.COMPARE_REF_TO_TEXTURE),s.texParameteri(C,s.TEXTURE_COMPARE_FUNC,te[_.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(_.magFilter===qe||_.minFilter!==Br&&_.minFilter!==Jn||_.type===Di&&t.has("OES_texture_float_linear")===!1)return;if(_.anisotropy>1||i.get(_).__currentAnisotropy){const N=t.get("EXT_texture_filter_anisotropic");s.texParameterf(C,N.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(_.anisotropy,n.getMaxAnisotropy())),i.get(_).__currentAnisotropy=_.anisotropy}}}function ee(C,_){let N=!1;C.__webglInit===void 0&&(C.__webglInit=!0,_.addEventListener("dispose",T));const G=_.source;let K=d.get(G);K===void 0&&(K={},d.set(G,K));const ht=V(_);if(ht!==C.__cacheKey){K[ht]===void 0&&(K[ht]={texture:s.createTexture(),usedTimes:0},a.memory.textures++,N=!0),K[ht].usedTimes++;const dt=K[C.__cacheKey];dt!==void 0&&(K[C.__cacheKey].usedTimes--,dt.usedTimes===0&&P(_)),C.__cacheKey=ht,C.__webglTexture=K[ht].texture}return N}function Z(C,_,N){return Math.floor(Math.floor(C/N)/_)}function et(C,_,N,G){const ht=C.updateRanges;if(ht.length===0)e.texSubImage2D(s.TEXTURE_2D,0,0,0,_.width,_.height,N,G,_.data);else{ht.sort((Bt,_t)=>Bt.start-_t.start);let dt=0;for(let Bt=1;Bt<ht.length;Bt++){const _t=ht[dt],gt=ht[Bt],zt=_t.start+_t.count,Xt=Z(gt.start,_.width,4),se=Z(_t.start,_.width,4);gt.start<=zt+1&&Xt===se&&Z(gt.start+gt.count-1,_.width,4)===Xt?_t.count=Math.max(_t.count,gt.start+gt.count-_t.start):(++dt,ht[dt]=gt)}ht.length=dt+1;const Y=e.getParameter(s.UNPACK_ROW_LENGTH),tt=e.getParameter(s.UNPACK_SKIP_PIXELS),mt=e.getParameter(s.UNPACK_SKIP_ROWS);e.pixelStorei(s.UNPACK_ROW_LENGTH,_.width);for(let Bt=0,_t=ht.length;Bt<_t;Bt++){const gt=ht[Bt],zt=Math.floor(gt.start/4),Xt=Math.ceil(gt.count/4),se=zt%_.width,D=Math.floor(zt/_.width),vt=Xt,J=1;e.pixelStorei(s.UNPACK_SKIP_PIXELS,se),e.pixelStorei(s.UNPACK_SKIP_ROWS,D),e.texSubImage2D(s.TEXTURE_2D,0,se,D,vt,J,N,G,_.data)}C.clearUpdateRanges(),e.pixelStorei(s.UNPACK_ROW_LENGTH,Y),e.pixelStorei(s.UNPACK_SKIP_PIXELS,tt),e.pixelStorei(s.UNPACK_SKIP_ROWS,mt)}}function Mt(C,_,N){let G=s.TEXTURE_2D;(_.isDataArrayTexture||_.isCompressedArrayTexture)&&(G=s.TEXTURE_2D_ARRAY),_.isData3DTexture&&(G=s.TEXTURE_3D);const K=ee(C,_),ht=_.source;e.bindTexture(G,C.__webglTexture,s.TEXTURE0+N);const dt=i.get(ht);if(ht.version!==dt.__version||K===!0){if(e.activeTexture(s.TEXTURE0+N),(typeof ImageBitmap<"u"&&_.image instanceof ImageBitmap)===!1){const J=de.getPrimaries(de.workingColorSpace),xt=_.colorSpace===Dn?null:de.getPrimaries(_.colorSpace),Et=_.colorSpace===Dn||J===xt?s.NONE:s.BROWSER_DEFAULT_WEBGL;e.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,_.flipY),e.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),e.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,Et)}e.pixelStorei(s.UNPACK_ALIGNMENT,_.unpackAlignment);let tt=m(_.image,!1,n.maxTextureSize);tt=_e(_,tt);const mt=r.convert(_.format,_.colorSpace),Bt=r.convert(_.type);let _t=y(_.internalFormat,mt,Bt,_.normalized,_.colorSpace,_.isVideoTexture);Zt(G,_);let gt;const zt=_.mipmaps,Xt=_.isVideoTexture!==!0,se=dt.__version===void 0||K===!0,D=ht.dataReady,vt=M(_,tt);if(_.isDepthTexture)_t=E(_.format===jn,_.type),se&&(Xt?e.texStorage2D(s.TEXTURE_2D,1,_t,tt.width,tt.height):e.texImage2D(s.TEXTURE_2D,0,_t,tt.width,tt.height,0,mt,Bt,null));else if(_.isDataTexture)if(zt.length>0){Xt&&se&&e.texStorage2D(s.TEXTURE_2D,vt,_t,zt[0].width,zt[0].height);for(let J=0,xt=zt.length;J<xt;J++)gt=zt[J],Xt?D&&e.texSubImage2D(s.TEXTURE_2D,J,0,0,gt.width,gt.height,mt,Bt,gt.data):e.texImage2D(s.TEXTURE_2D,J,_t,gt.width,gt.height,0,mt,Bt,gt.data);_.generateMipmaps=!1}else Xt?(se&&e.texStorage2D(s.TEXTURE_2D,vt,_t,tt.width,tt.height),D&&et(_,tt,mt,Bt)):e.texImage2D(s.TEXTURE_2D,0,_t,tt.width,tt.height,0,mt,Bt,tt.data);else if(_.isCompressedTexture)if(_.isCompressedArrayTexture){Xt&&se&&e.texStorage3D(s.TEXTURE_2D_ARRAY,vt,_t,zt[0].width,zt[0].height,tt.depth);for(let J=0,xt=zt.length;J<xt;J++)if(gt=zt[J],_.format!==Ci)if(mt!==null)if(Xt){if(D)if(_.layerUpdates.size>0){const Et=jh(gt.width,gt.height,_.format,_.type);for(const st of _.layerUpdates){const Ht=gt.data.subarray(st*Et/gt.data.BYTES_PER_ELEMENT,(st+1)*Et/gt.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,J,0,0,st,gt.width,gt.height,1,mt,Ht)}}else e.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,J,0,0,0,gt.width,gt.height,tt.depth,mt,gt.data)}else e.compressedTexImage3D(s.TEXTURE_2D_ARRAY,J,_t,gt.width,gt.height,tt.depth,0,gt.data,0,0);else Qt("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Xt?D&&e.texSubImage3D(s.TEXTURE_2D_ARRAY,J,0,0,0,gt.width,gt.height,tt.depth,mt,Bt,gt.data):e.texImage3D(s.TEXTURE_2D_ARRAY,J,_t,gt.width,gt.height,tt.depth,0,mt,Bt,gt.data);_.layerUpdates.size>0&&_.clearLayerUpdates()}else{Xt&&se&&e.texStorage2D(s.TEXTURE_2D,vt,_t,zt[0].width,zt[0].height);for(let J=0,xt=zt.length;J<xt;J++)gt=zt[J],_.format!==Ci?mt!==null?Xt?D&&e.compressedTexSubImage2D(s.TEXTURE_2D,J,0,0,gt.width,gt.height,mt,gt.data):e.compressedTexImage2D(s.TEXTURE_2D,J,_t,gt.width,gt.height,0,gt.data):Qt("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Xt?D&&e.texSubImage2D(s.TEXTURE_2D,J,0,0,gt.width,gt.height,mt,Bt,gt.data):e.texImage2D(s.TEXTURE_2D,J,_t,gt.width,gt.height,0,mt,Bt,gt.data)}else if(_.isDataArrayTexture)if(Xt){if(se&&e.texStorage3D(s.TEXTURE_2D_ARRAY,vt,_t,tt.width,tt.height,tt.depth),D)if(_.layerUpdates.size>0){const J=jh(tt.width,tt.height,_.format,_.type);for(const xt of _.layerUpdates){const Et=tt.data.subarray(xt*J/tt.data.BYTES_PER_ELEMENT,(xt+1)*J/tt.data.BYTES_PER_ELEMENT);e.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,xt,tt.width,tt.height,1,mt,Bt,Et)}_.clearLayerUpdates()}else e.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,0,tt.width,tt.height,tt.depth,mt,Bt,tt.data)}else e.texImage3D(s.TEXTURE_2D_ARRAY,0,_t,tt.width,tt.height,tt.depth,0,mt,Bt,tt.data);else if(_.isData3DTexture)Xt?(se&&e.texStorage3D(s.TEXTURE_3D,vt,_t,tt.width,tt.height,tt.depth),D&&e.texSubImage3D(s.TEXTURE_3D,0,0,0,0,tt.width,tt.height,tt.depth,mt,Bt,tt.data)):e.texImage3D(s.TEXTURE_3D,0,_t,tt.width,tt.height,tt.depth,0,mt,Bt,tt.data);else if(_.isFramebufferTexture){if(se)if(Xt)e.texStorage2D(s.TEXTURE_2D,vt,_t,tt.width,tt.height);else{let J=tt.width,xt=tt.height;for(let Et=0;Et<vt;Et++)e.texImage2D(s.TEXTURE_2D,Et,_t,J,xt,0,mt,Bt,null),J>>=1,xt>>=1}}else if(_.isHTMLTexture){if("texElementImage2D"in s){const J=s.canvas;if(J.hasAttribute("layoutsubtree")||J.setAttribute("layoutsubtree","true"),tt.parentNode!==J){J.appendChild(tt),f.add(_),J.onpaint=xt=>{const Et=xt.changedElements;for(const st of f)Et.includes(st.image)&&(st.needsUpdate=!0)},J.requestPaint();return}if(s.texElementImage2D.length===3)s.texElementImage2D(s.TEXTURE_2D,s.RGBA8,tt);else{const Et=s.RGBA,st=s.RGBA,Ht=s.UNSIGNED_BYTE;s.texElementImage2D(s.TEXTURE_2D,0,Et,st,Ht,tt)}s.texParameteri(s.TEXTURE_2D,s.TEXTURE_MIN_FILTER,s.LINEAR),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_WRAP_S,s.CLAMP_TO_EDGE),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_WRAP_T,s.CLAMP_TO_EDGE)}}else if(zt.length>0){if(Xt&&se){const J=ce(zt[0]);e.texStorage2D(s.TEXTURE_2D,vt,_t,J.width,J.height)}for(let J=0,xt=zt.length;J<xt;J++)gt=zt[J],Xt?D&&e.texSubImage2D(s.TEXTURE_2D,J,0,0,mt,Bt,gt):e.texImage2D(s.TEXTURE_2D,J,_t,mt,Bt,gt);_.generateMipmaps=!1}else if(Xt){if(se){const J=ce(tt);e.texStorage2D(s.TEXTURE_2D,vt,_t,J.width,J.height)}D&&e.texSubImage2D(s.TEXTURE_2D,0,0,0,mt,Bt,tt)}else e.texImage2D(s.TEXTURE_2D,0,_t,mt,Bt,tt);g(_)&&b(G),dt.__version=ht.version,_.onUpdate&&_.onUpdate(_)}C.__version=_.version}function $t(C,_,N){if(_.image.length!==6)return;const G=ee(C,_),K=_.source;e.bindTexture(s.TEXTURE_CUBE_MAP,C.__webglTexture,s.TEXTURE0+N);const ht=i.get(K);if(K.version!==ht.__version||G===!0){e.activeTexture(s.TEXTURE0+N);const dt=de.getPrimaries(de.workingColorSpace),Y=_.colorSpace===Dn?null:de.getPrimaries(_.colorSpace),tt=_.colorSpace===Dn||dt===Y?s.NONE:s.BROWSER_DEFAULT_WEBGL;e.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,_.flipY),e.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),e.pixelStorei(s.UNPACK_ALIGNMENT,_.unpackAlignment),e.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,tt);const mt=_.isCompressedTexture||_.image[0].isCompressedTexture,Bt=_.image[0]&&_.image[0].isDataTexture,_t=[];for(let st=0;st<6;st++)!mt&&!Bt?_t[st]=m(_.image[st],!0,n.maxCubemapSize):_t[st]=Bt?_.image[st].image:_.image[st],_t[st]=_e(_,_t[st]);const gt=_t[0],zt=r.convert(_.format,_.colorSpace),Xt=r.convert(_.type),se=y(_.internalFormat,zt,Xt,_.normalized,_.colorSpace),D=_.isVideoTexture!==!0,vt=ht.__version===void 0||G===!0,J=K.dataReady;let xt=M(_,gt);Zt(s.TEXTURE_CUBE_MAP,_);let Et;if(mt){D&&vt&&e.texStorage2D(s.TEXTURE_CUBE_MAP,xt,se,gt.width,gt.height);for(let st=0;st<6;st++){Et=_t[st].mipmaps;for(let Ht=0;Ht<Et.length;Ht++){const Ut=Et[Ht];_.format!==Ci?zt!==null?D?J&&e.compressedTexSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+st,Ht,0,0,Ut.width,Ut.height,zt,Ut.data):e.compressedTexImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+st,Ht,se,Ut.width,Ut.height,0,Ut.data):Qt("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):D?J&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+st,Ht,0,0,Ut.width,Ut.height,zt,Xt,Ut.data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+st,Ht,se,Ut.width,Ut.height,0,zt,Xt,Ut.data)}}}else{if(Et=_.mipmaps,D&&vt){Et.length>0&&xt++;const st=ce(_t[0]);e.texStorage2D(s.TEXTURE_CUBE_MAP,xt,se,st.width,st.height)}for(let st=0;st<6;st++)if(Bt){D?J&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+st,0,0,0,_t[st].width,_t[st].height,zt,Xt,_t[st].data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+st,0,se,_t[st].width,_t[st].height,0,zt,Xt,_t[st].data);for(let Ht=0;Ht<Et.length;Ht++){const Re=Et[Ht].image[st].image;D?J&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+st,Ht+1,0,0,Re.width,Re.height,zt,Xt,Re.data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+st,Ht+1,se,Re.width,Re.height,0,zt,Xt,Re.data)}}else{D?J&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+st,0,0,0,zt,Xt,_t[st]):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+st,0,se,zt,Xt,_t[st]);for(let Ht=0;Ht<Et.length;Ht++){const Ut=Et[Ht];D?J&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+st,Ht+1,0,0,zt,Xt,Ut.image[st]):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+st,Ht+1,se,zt,Xt,Ut.image[st])}}}g(_)&&b(s.TEXTURE_CUBE_MAP),ht.__version=K.version,_.onUpdate&&_.onUpdate(_)}C.__version=_.version}function Tt(C,_,N,G,K,ht){const dt=r.convert(N.format,N.colorSpace),Y=r.convert(N.type),tt=y(N.internalFormat,dt,Y,N.normalized,N.colorSpace),mt=i.get(_),Bt=i.get(N);if(Bt.__renderTarget=_,!mt.__hasExternalTextures){const _t=Math.max(1,_.width>>ht),gt=Math.max(1,_.height>>ht);K===s.TEXTURE_3D||K===s.TEXTURE_2D_ARRAY?e.texImage3D(K,ht,tt,_t,gt,_.depth,0,dt,Y,null):e.texImage2D(K,ht,tt,_t,gt,0,dt,Y,null)}e.bindFramebuffer(s.FRAMEBUFFER,C),ie(_)?o.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,G,K,Bt.__webglTexture,0,jt(_)):(K===s.TEXTURE_2D||K>=s.TEXTURE_CUBE_MAP_POSITIVE_X&&K<=s.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&s.framebufferTexture2D(s.FRAMEBUFFER,G,K,Bt.__webglTexture,ht),e.bindFramebuffer(s.FRAMEBUFFER,null)}function Jt(C,_,N){if(s.bindRenderbuffer(s.RENDERBUFFER,C),_.depthBuffer){const G=_.depthTexture,K=G&&G.isDepthTexture?G.type:null,ht=E(_.stencilBuffer,K),dt=_.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;ie(_)?o.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,jt(_),ht,_.width,_.height):N?s.renderbufferStorageMultisample(s.RENDERBUFFER,jt(_),ht,_.width,_.height):s.renderbufferStorage(s.RENDERBUFFER,ht,_.width,_.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,dt,s.RENDERBUFFER,C)}else{const G=_.textures;for(let K=0;K<G.length;K++){const ht=G[K],dt=r.convert(ht.format,ht.colorSpace),Y=r.convert(ht.type),tt=y(ht.internalFormat,dt,Y,ht.normalized,ht.colorSpace);ie(_)?o.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,jt(_),tt,_.width,_.height):N?s.renderbufferStorageMultisample(s.RENDERBUFFER,jt(_),tt,_.width,_.height):s.renderbufferStorage(s.RENDERBUFFER,tt,_.width,_.height)}}s.bindRenderbuffer(s.RENDERBUFFER,null)}function be(C,_,N){const G=_.isWebGLCubeRenderTarget===!0;if(e.bindFramebuffer(s.FRAMEBUFFER,C),!(_.depthTexture&&_.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");const K=i.get(_.depthTexture);if(K.__renderTarget=_,(!K.__webglTexture||_.depthTexture.image.width!==_.width||_.depthTexture.image.height!==_.height)&&(_.depthTexture.image.width=_.width,_.depthTexture.image.height=_.height,_.depthTexture.needsUpdate=!0),G){if(K.__webglInit===void 0&&(K.__webglInit=!0,_.depthTexture.addEventListener("dispose",T)),K.__webglTexture===void 0){K.__webglTexture=s.createTexture(),e.bindTexture(s.TEXTURE_CUBE_MAP,K.__webglTexture),Zt(s.TEXTURE_CUBE_MAP,_.depthTexture);const mt=r.convert(_.depthTexture.format),Bt=r.convert(_.depthTexture.type);let _t;_.depthTexture.format===yn?_t=s.DEPTH_COMPONENT24:_.depthTexture.format===jn&&(_t=s.DEPTH24_STENCIL8);for(let gt=0;gt<6;gt++)s.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+gt,0,_t,_.width,_.height,0,mt,Bt,null)}}else nt(_.depthTexture,0);const ht=K.__webglTexture,dt=jt(_),Y=G?s.TEXTURE_CUBE_MAP_POSITIVE_X+N:s.TEXTURE_2D,tt=_.depthTexture.format===jn?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;if(_.depthTexture.format===yn)ie(_)?o.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,tt,Y,ht,0,dt):s.framebufferTexture2D(s.FRAMEBUFFER,tt,Y,ht,0);else if(_.depthTexture.format===jn)ie(_)?o.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,tt,Y,ht,0,dt):s.framebufferTexture2D(s.FRAMEBUFFER,tt,Y,ht,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function it(C){const _=i.get(C),N=C.isWebGLCubeRenderTarget===!0;if(_.__boundDepthTexture!==C.depthTexture){const G=C.depthTexture;if(_.__depthDisposeCallback&&_.__depthDisposeCallback(),G){const K=()=>{delete _.__boundDepthTexture,delete _.__depthDisposeCallback,G.removeEventListener("dispose",K)};G.addEventListener("dispose",K),_.__depthDisposeCallback=K}_.__boundDepthTexture=G}if(C.depthTexture&&!_.__autoAllocateDepthBuffer)if(N)for(let G=0;G<6;G++)be(_.__webglFramebuffer[G],C,G);else{const G=C.texture.mipmaps;G&&G.length>0?be(_.__webglFramebuffer[0],C,0):be(_.__webglFramebuffer,C,0)}else if(N){_.__webglDepthbuffer=[];for(let G=0;G<6;G++)if(e.bindFramebuffer(s.FRAMEBUFFER,_.__webglFramebuffer[G]),_.__webglDepthbuffer[G]===void 0)_.__webglDepthbuffer[G]=s.createRenderbuffer(),Jt(_.__webglDepthbuffer[G],C,!1);else{const K=C.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,ht=_.__webglDepthbuffer[G];s.bindRenderbuffer(s.RENDERBUFFER,ht),s.framebufferRenderbuffer(s.FRAMEBUFFER,K,s.RENDERBUFFER,ht)}}else{const G=C.texture.mipmaps;if(G&&G.length>0?e.bindFramebuffer(s.FRAMEBUFFER,_.__webglFramebuffer[0]):e.bindFramebuffer(s.FRAMEBUFFER,_.__webglFramebuffer),_.__webglDepthbuffer===void 0)_.__webglDepthbuffer=s.createRenderbuffer(),Jt(_.__webglDepthbuffer,C,!1);else{const K=C.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,ht=_.__webglDepthbuffer;s.bindRenderbuffer(s.RENDERBUFFER,ht),s.framebufferRenderbuffer(s.FRAMEBUFFER,K,s.RENDERBUFFER,ht)}}e.bindFramebuffer(s.FRAMEBUFFER,null)}function rt(C,_,N){const G=i.get(C);_!==void 0&&Tt(G.__webglFramebuffer,C,C.texture,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,0),N!==void 0&&it(C)}function lt(C){const _=C.texture,N=i.get(C),G=i.get(_);C.addEventListener("dispose",v);const K=C.textures,ht=C.isWebGLCubeRenderTarget===!0,dt=K.length>1;if(dt||(G.__webglTexture===void 0&&(G.__webglTexture=s.createTexture()),G.__version=_.version,a.memory.textures++),ht){N.__webglFramebuffer=[];for(let Y=0;Y<6;Y++)if(_.mipmaps&&_.mipmaps.length>0){N.__webglFramebuffer[Y]=[];for(let tt=0;tt<_.mipmaps.length;tt++)N.__webglFramebuffer[Y][tt]=s.createFramebuffer()}else N.__webglFramebuffer[Y]=s.createFramebuffer()}else{if(_.mipmaps&&_.mipmaps.length>0){N.__webglFramebuffer=[];for(let Y=0;Y<_.mipmaps.length;Y++)N.__webglFramebuffer[Y]=s.createFramebuffer()}else N.__webglFramebuffer=s.createFramebuffer();if(dt)for(let Y=0,tt=K.length;Y<tt;Y++){const mt=i.get(K[Y]);mt.__webglTexture===void 0&&(mt.__webglTexture=s.createTexture(),a.memory.textures++)}if(C.samples>0&&ie(C)===!1){N.__webglMultisampledFramebuffer=s.createFramebuffer(),N.__webglColorRenderbuffer=[],e.bindFramebuffer(s.FRAMEBUFFER,N.__webglMultisampledFramebuffer);for(let Y=0;Y<K.length;Y++){const tt=K[Y];N.__webglColorRenderbuffer[Y]=s.createRenderbuffer(),s.bindRenderbuffer(s.RENDERBUFFER,N.__webglColorRenderbuffer[Y]);const mt=r.convert(tt.format,tt.colorSpace),Bt=r.convert(tt.type),_t=y(tt.internalFormat,mt,Bt,tt.normalized,tt.colorSpace,C.isXRRenderTarget===!0),gt=jt(C);s.renderbufferStorageMultisample(s.RENDERBUFFER,gt,_t,C.width,C.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+Y,s.RENDERBUFFER,N.__webglColorRenderbuffer[Y])}s.bindRenderbuffer(s.RENDERBUFFER,null),C.depthBuffer&&(N.__webglDepthRenderbuffer=s.createRenderbuffer(),Jt(N.__webglDepthRenderbuffer,C,!0)),e.bindFramebuffer(s.FRAMEBUFFER,null)}}if(ht){e.bindTexture(s.TEXTURE_CUBE_MAP,G.__webglTexture),Zt(s.TEXTURE_CUBE_MAP,_);for(let Y=0;Y<6;Y++)if(_.mipmaps&&_.mipmaps.length>0)for(let tt=0;tt<_.mipmaps.length;tt++)Tt(N.__webglFramebuffer[Y][tt],C,_,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+Y,tt);else Tt(N.__webglFramebuffer[Y],C,_,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+Y,0);g(_)&&b(s.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(dt){for(let Y=0,tt=K.length;Y<tt;Y++){const mt=K[Y],Bt=i.get(mt);let _t=s.TEXTURE_2D;(C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(_t=C.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),e.bindTexture(_t,Bt.__webglTexture),Zt(_t,mt),Tt(N.__webglFramebuffer,C,mt,s.COLOR_ATTACHMENT0+Y,_t,0),g(mt)&&b(_t)}e.unbindTexture()}else{let Y=s.TEXTURE_2D;if((C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(Y=C.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),e.bindTexture(Y,G.__webglTexture),Zt(Y,_),_.mipmaps&&_.mipmaps.length>0)for(let tt=0;tt<_.mipmaps.length;tt++)Tt(N.__webglFramebuffer[tt],C,_,s.COLOR_ATTACHMENT0,Y,tt);else Tt(N.__webglFramebuffer,C,_,s.COLOR_ATTACHMENT0,Y,0);g(_)&&b(Y),e.unbindTexture()}C.depthBuffer&&it(C)}function ct(C){const _=C.textures;for(let N=0,G=_.length;N<G;N++){const K=_[N];if(g(K)){const ht=A(C),dt=i.get(K).__webglTexture;e.bindTexture(ht,dt),b(ht),e.unbindTexture()}}}const ft=[],Wt=[];function Gt(C){if(C.samples>0){if(ie(C)===!1){const _=C.textures,N=C.width,G=C.height;let K=s.COLOR_BUFFER_BIT;const ht=C.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,dt=i.get(C),Y=_.length>1;if(Y)for(let mt=0;mt<_.length;mt++)e.bindFramebuffer(s.FRAMEBUFFER,dt.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+mt,s.RENDERBUFFER,null),e.bindFramebuffer(s.FRAMEBUFFER,dt.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+mt,s.TEXTURE_2D,null,0);e.bindFramebuffer(s.READ_FRAMEBUFFER,dt.__webglMultisampledFramebuffer);const tt=C.texture.mipmaps;tt&&tt.length>0?e.bindFramebuffer(s.DRAW_FRAMEBUFFER,dt.__webglFramebuffer[0]):e.bindFramebuffer(s.DRAW_FRAMEBUFFER,dt.__webglFramebuffer);for(let mt=0;mt<_.length;mt++){if(C.resolveDepthBuffer&&(C.depthBuffer&&(K|=s.DEPTH_BUFFER_BIT),C.stencilBuffer&&C.resolveStencilBuffer&&(K|=s.STENCIL_BUFFER_BIT)),Y){s.framebufferRenderbuffer(s.READ_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.RENDERBUFFER,dt.__webglColorRenderbuffer[mt]);const Bt=i.get(_[mt]).__webglTexture;s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,Bt,0)}s.blitFramebuffer(0,0,N,G,0,0,N,G,K,s.NEAREST),l===!0&&(ft.length=0,Wt.length=0,ft.push(s.COLOR_ATTACHMENT0+mt),C.depthBuffer&&C.storeMultisampledDepthBuffer===!1&&(ft.push(ht),Wt.push(ht),s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,Wt)),s.invalidateFramebuffer(s.READ_FRAMEBUFFER,ft))}if(e.bindFramebuffer(s.READ_FRAMEBUFFER,null),e.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),Y)for(let mt=0;mt<_.length;mt++){e.bindFramebuffer(s.FRAMEBUFFER,dt.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+mt,s.RENDERBUFFER,dt.__webglColorRenderbuffer[mt]);const Bt=i.get(_[mt]).__webglTexture;e.bindFramebuffer(s.FRAMEBUFFER,dt.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+mt,s.TEXTURE_2D,Bt,0)}e.bindFramebuffer(s.DRAW_FRAMEBUFFER,dt.__webglMultisampledFramebuffer)}else if(C.depthBuffer&&C.storeMultisampledDepthBuffer===!1&&l){const _=C.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,[_])}}}function jt(C){return Math.min(n.maxSamples,C.samples)}function ie(C){const _=i.get(C);return C.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&_.__useRenderToTexture!==!1}function k(C){const _=a.render.frame;h.get(C)!==_&&(h.set(C,_),C.update())}function _e(C,_){const N=C.colorSpace,G=C.format,K=C.type;return C.isCompressedTexture===!0||C.isVideoTexture===!0||N!==Ua&&N!==Dn&&(de.getTransfer(N)===we?(G!==Ci||K!==bi)&&Qt("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):me("WebGLTextures: Unsupported texture color space:",N)),_}function ce(C){return typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement?(c.width=C.naturalWidth||C.width,c.height=C.naturalHeight||C.height):typeof VideoFrame<"u"&&C instanceof VideoFrame?(c.width=C.displayWidth,c.height=C.displayHeight):(c.width=C.width,c.height=C.height),c}this.allocateTextureUnit=$,this.resetTextureUnits=B,this.getTextureUnits=F,this.setTextureUnits=O,this.setTexture2D=nt,this.setTexture2DArray=X,this.setTexture3D=Q,this.setTextureCube=j,this.rebindTextures=rt,this.setupRenderTarget=lt,this.updateRenderTargetMipmap=ct,this.updateMultisampleRenderTarget=Gt,this.setupDepthRenderbuffer=it,this.setupFrameBufferTexture=Tt,this.useMultisampledRTT=ie,this.isReversedDepthBuffer=function(){return e.buffers.depth.getReversed()}}function $x(s,t){function e(i,n=Dn){let r;const a=de.getTransfer(n);if(i===bi)return s.UNSIGNED_BYTE;if(i===gc)return s.UNSIGNED_SHORT_4_4_4_4;if(i===vc)return s.UNSIGNED_SHORT_5_5_5_1;if(i===pd)return s.UNSIGNED_INT_5_9_9_9_REV;if(i===md)return s.UNSIGNED_INT_10F_11F_11F_REV;if(i===dd)return s.BYTE;if(i===fd)return s.SHORT;if(i===Sr)return s.UNSIGNED_SHORT;if(i===mc)return s.INT;if(i===Qi)return s.UNSIGNED_INT;if(i===Di)return s.FLOAT;if(i===tn)return s.HALF_FLOAT;if(i===gd)return s.ALPHA;if(i===vd)return s.RGB;if(i===Ci)return s.RGBA;if(i===yn)return s.DEPTH_COMPONENT;if(i===jn)return s.DEPTH_STENCIL;if(i===xc)return s.RED;if(i===_c)return s.RED_INTEGER;if(i===is)return s.RG;if(i===yc)return s.RG_INTEGER;if(i===Mc)return s.RGBA_INTEGER;if(i===Ma||i===Sa||i===ba||i===wa)if(a===we)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(i===Ma)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===Sa)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===ba)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===wa)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(i===Ma)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===Sa)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===ba)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===wa)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===Sl||i===bl||i===wl||i===El)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(i===Sl)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===bl)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===wl)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===El)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===Tl||i===Al||i===Cl||i===Pl||i===Rl||i===ka||i===Ll)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(i===Tl||i===Al)return a===we?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(i===Cl)return a===we?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(i===Pl)return r.COMPRESSED_R11_EAC;if(i===Rl)return r.COMPRESSED_SIGNED_R11_EAC;if(i===ka)return r.COMPRESSED_RG11_EAC;if(i===Ll)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(i===kl||i===Il||i===Dl||i===Ul||i===Fl||i===Nl||i===Ol||i===Bl||i===zl||i===Hl||i===Gl||i===Vl||i===Wl||i===Xl)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(i===kl)return a===we?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===Il)return a===we?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===Dl)return a===we?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===Ul)return a===we?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===Fl)return a===we?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===Nl)return a===we?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===Ol)return a===we?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===Bl)return a===we?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===zl)return a===we?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===Hl)return a===we?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===Gl)return a===we?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===Vl)return a===we?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===Wl)return a===we?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===Xl)return a===we?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===ql||i===Kl||i===$l)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(i===ql)return a===we?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===Kl)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===$l)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===Yl||i===Zl||i===Ia||i===Jl)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(i===Yl)return r.COMPRESSED_RED_RGTC1_EXT;if(i===Zl)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===Ia)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===Jl)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===br?s.UNSIGNED_INT_24_8:s[i]!==void 0?s[i]:null}return{convert:e}}const Yx=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Zx=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class Jx{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e){if(this.texture===null){const i=new Rd(t.texture);(t.depthNear!==e.depthNear||t.depthFar!==e.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=i}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,i=new Bi({vertexShader:Yx,fragmentShader:Zx,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new qt(new Fi(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class jx extends ss{constructor(t,e){super();const i=this;let n=null,r=1,a=null,o="local-floor",l=1,c=null,h=null,f=null,u=null,d=null,p=null;const x=typeof XRWebGLBinding<"u",m=new Jx,g={},b=e.getContextAttributes();let A=null,y=null;const E=[],M=[],T=new ot;let v=null,w=null;const P=new vi;P.viewport=new Ue;const L=new vi;L.viewport=new Ue;const U=[P,L],B=new am;let F=null,O=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Z){let et=E[Z];return et===void 0&&(et=new Mo,E[Z]=et),et.getTargetRaySpace()},this.getControllerGrip=function(Z){let et=E[Z];return et===void 0&&(et=new Mo,E[Z]=et),et.getGripSpace()},this.getHand=function(Z){let et=E[Z];return et===void 0&&(et=new Mo,E[Z]=et),et.getHandSpace()};function $(Z){const et=M.indexOf(Z.inputSource);if(et===-1)return;const Mt=E[et];Mt!==void 0&&(Mt.update(Z.inputSource,Z.frame,c||a),Mt.dispatchEvent({type:Z.type,data:Z.inputSource}))}function V(){n.removeEventListener("select",$),n.removeEventListener("selectstart",$),n.removeEventListener("selectend",$),n.removeEventListener("squeeze",$),n.removeEventListener("squeezestart",$),n.removeEventListener("squeezeend",$),n.removeEventListener("end",V),n.removeEventListener("inputsourceschange",nt);for(let Z=0;Z<E.length;Z++){const et=M[Z];et!==null&&(M[Z]=null,E[Z].disconnect(et))}F=null,O=null,m.reset();for(const Z in g)delete g[Z];if(t.setRenderTarget(A),d=null,u=null,f=null,n=null,y=null,ee.stop(),i.isPresenting=!1,t.setPixelRatio(v),t.setSize(T.width,T.height,!1),w!==null){const Z=w.camera;Z.fov=w.fov,Z.zoom=w.zoom,Z.updateProjectionMatrix(),w=null}i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Z){r=Z,i.isPresenting===!0&&Qt("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Z){o=Z,i.isPresenting===!0&&Qt("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(Z){c=Z},this.getBaseLayer=function(){return u!==null?u:d},this.getBinding=function(){return f===null&&x&&(f=new XRWebGLBinding(n,e)),f},this.getFrame=function(){return p},this.getSession=function(){return n},this.setSession=async function(Z){if(n=Z,n!==null){if(A=t.getRenderTarget(),n.addEventListener("select",$),n.addEventListener("selectstart",$),n.addEventListener("selectend",$),n.addEventListener("squeeze",$),n.addEventListener("squeezestart",$),n.addEventListener("squeezeend",$),n.addEventListener("end",V),n.addEventListener("inputsourceschange",nt),b.xrCompatible!==!0&&await e.makeXRCompatible(),v=t.getPixelRatio(),t.getSize(T),x&&"createProjectionLayer"in XRWebGLBinding.prototype){let Mt=null,$t=null,Tt=null;b.depth&&(Tt=b.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,Mt=b.stencil?jn:yn,$t=b.stencil?br:Qi);const Jt={colorFormat:e.RGBA8,depthFormat:Tt,scaleFactor:r};f=this.getBinding(),u=f.createProjectionLayer(Jt),n.updateRenderState({layers:[u]}),t.setPixelRatio(1),t.setSize(u.textureWidth,u.textureHeight,!1),y=new Ui(u.textureWidth,u.textureHeight,{format:Ci,type:bi,depthTexture:new Er(u.textureWidth,u.textureHeight,$t,void 0,void 0,void 0,void 0,void 0,void 0,Mt),stencilBuffer:b.stencil,colorSpace:t.outputColorSpace,samples:b.antialias?4:0,resolveDepthBuffer:u.ignoreDepthValues===!1,resolveStencilBuffer:u.ignoreDepthValues===!1,storeMultisampledDepthBuffer:u.ignoreDepthValues===!1,storeMultisampledStencilBuffer:u.ignoreDepthValues===!1})}else{const Mt={antialias:b.antialias,alpha:!0,depth:b.depth,stencil:b.stencil,framebufferScaleFactor:r};d=new XRWebGLLayer(n,e,Mt),n.updateRenderState({baseLayer:d}),t.setPixelRatio(1),t.setSize(d.framebufferWidth,d.framebufferHeight,!1),y=new Ui(d.framebufferWidth,d.framebufferHeight,{format:Ci,type:bi,colorSpace:t.outputColorSpace,stencilBuffer:b.stencil,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1,storeMultisampledDepthBuffer:d.ignoreDepthValues===!1,storeMultisampledStencilBuffer:d.ignoreDepthValues===!1})}y.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await n.requestReferenceSpace(o),ee.setContext(n),ee.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(n!==null)return n.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function nt(Z){for(let et=0;et<Z.removed.length;et++){const Mt=Z.removed[et],$t=M.indexOf(Mt);$t>=0&&(M[$t]=null,E[$t].disconnect(Mt))}for(let et=0;et<Z.added.length;et++){const Mt=Z.added[et];let $t=M.indexOf(Mt);if($t===-1){for(let Jt=0;Jt<E.length;Jt++)if(Jt>=M.length){M.push(Mt),$t=Jt;break}else if(M[Jt]===null){M[Jt]=Mt,$t=Jt;break}if($t===-1)break}const Tt=E[$t];Tt&&Tt.connect(Mt)}}const X=new R,Q=new R;function j(Z,et,Mt){X.setFromMatrixPosition(et.matrixWorld),Q.setFromMatrixPosition(Mt.matrixWorld);const $t=X.distanceTo(Q),Tt=et.projectionMatrix.elements,Jt=Mt.projectionMatrix.elements,be=Tt[14]/(Tt[10]-1),it=Tt[14]/(Tt[10]+1),rt=(Tt[9]+1)/Tt[5],lt=(Tt[9]-1)/Tt[5],ct=(Tt[8]-1)/Tt[0],ft=(Jt[8]+1)/Jt[0],Wt=be*ct,Gt=be*ft,jt=$t/(-ct+ft),ie=jt*-ct;if(et.matrixWorld.decompose(Z.position,Z.quaternion,Z.scale),Z.translateX(ie),Z.translateZ(jt),Z.matrixWorld.compose(Z.position,Z.quaternion,Z.scale),Z.matrixWorldInverse.copy(Z.matrixWorld).invert(),Tt[10]===-1)Z.projectionMatrix.copy(et.projectionMatrix),Z.projectionMatrixInverse.copy(et.projectionMatrixInverse);else{const k=be+jt,_e=it+jt,ce=Wt-ie,C=Gt+($t-ie),_=rt*it/_e*k,N=lt*it/_e*k;Z.projectionMatrix.makePerspective(ce,C,_,N,k,_e),Z.projectionMatrixInverse.copy(Z.projectionMatrix).invert()}}function Ft(Z,et){et===null?Z.matrixWorld.copy(Z.matrix):Z.matrixWorld.multiplyMatrices(et.matrixWorld,Z.matrix),Z.matrixWorldInverse.copy(Z.matrixWorld).invert()}this.updateCamera=function(Z){if(n===null)return;let et=Z.near,Mt=Z.far;m.texture!==null&&(m.depthNear>0&&(et=m.depthNear),m.depthFar>0&&(Mt=m.depthFar)),B.near=L.near=P.near=et,B.far=L.far=P.far=Mt,(F!==B.near||O!==B.far)&&(n.updateRenderState({depthNear:B.near,depthFar:B.far}),F=B.near,O=B.far),B.layers.mask=Z.layers.mask|6,P.layers.mask=B.layers.mask&-5,L.layers.mask=B.layers.mask&-3;const $t=Z.parent,Tt=B.cameras;Ft(B,$t);for(let Jt=0;Jt<Tt.length;Jt++)Ft(Tt[Jt],$t);Tt.length===2?j(B,P,L):B.projectionMatrix.copy(P.projectionMatrix),w===null&&Z.isPerspectiveCamera&&(w={camera:Z,fov:Z.fov,zoom:Z.zoom}),ut(Z,B,$t)};function ut(Z,et,Mt){Mt===null?Z.matrix.copy(et.matrixWorld):(Z.matrix.copy(Mt.matrixWorld),Z.matrix.invert(),Z.matrix.multiply(et.matrixWorld)),Z.matrix.decompose(Z.position,Z.quaternion,Z.scale),Z.updateMatrixWorld(!0),Z.projectionMatrix.copy(et.projectionMatrix),Z.projectionMatrixInverse.copy(et.projectionMatrixInverse),Z.isPerspectiveCamera&&(Z.fov=jl*2*Math.atan(1/Z.projectionMatrix.elements[5]),Z.zoom=1)}this.getCamera=function(){return B},this.getFoveation=function(){if(!(u===null&&d===null))return l},this.setFoveation=function(Z){l=Z,u!==null&&(u.fixedFoveation=Z),d!==null&&d.fixedFoveation!==void 0&&(d.fixedFoveation=Z)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(B)},this.getCameraTexture=function(Z){return g[Z]};let te=null;function Zt(Z,et){if(h=et.getViewerPose(c||a),p=et,h!==null){const Mt=h.views;d!==null&&(t.setRenderTargetFramebuffer(y,d.framebuffer),t.setRenderTarget(y));let $t=!1;Mt.length!==B.cameras.length&&(B.cameras.length=0,$t=!0);for(let it=0;it<Mt.length;it++){const rt=Mt[it];let lt=null;if(d!==null)lt=d.getViewport(rt);else{const ft=f.getViewSubImage(u,rt);lt=ft.viewport,it===0&&(t.setRenderTargetTextures(y,ft.colorTexture,ft.depthStencilTexture),t.setRenderTarget(y))}let ct=U[it];ct===void 0&&(ct=new vi,ct.layers.enable(it),ct.viewport=new Ue,U[it]=ct),ct.matrix.fromArray(rt.transform.matrix),ct.matrix.decompose(ct.position,ct.quaternion,ct.scale),ct.projectionMatrix.fromArray(rt.projectionMatrix),ct.projectionMatrixInverse.copy(ct.projectionMatrix).invert(),ct.viewport.set(lt.x,lt.y,lt.width,lt.height),it===0&&(B.matrix.copy(ct.matrix),B.matrix.decompose(B.position,B.quaternion,B.scale)),$t===!0&&B.cameras.push(ct)}const Tt=n.enabledFeatures;if(Tt&&Tt.includes("depth-sensing")&&n.depthUsage=="gpu-optimized"&&x){f=i.getBinding();const it=f.getDepthInformation(Mt[0]);it&&it.isValid&&it.texture&&m.init(it,n.renderState)}if(Tt&&Tt.includes("camera-access")&&x){t.state.unbindTexture(),f=i.getBinding();for(let it=0;it<Mt.length;it++){const rt=Mt[it].camera;if(rt){let lt=g[rt];lt||(lt=new Rd,g[rt]=lt);const ct=f.getCameraImage(rt);lt.sourceTexture=ct}}}}for(let Mt=0;Mt<E.length;Mt++){const $t=M[Mt],Tt=E[Mt];$t!==null&&Tt!==void 0&&Tt.update($t,et,c||a)}te&&te(Z,et),et.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:et}),p=null}const ee=new Vd;ee.setAnimationLoop(Zt),this.setAnimationLoop=function(Z){te=Z},this.dispose=function(){}}}const Qx=new Se,Zd=new ne;Zd.set(-1,0,0,0,1,0,0,0,1);function t_(s,t){function e(m,g){m.matrixAutoUpdate===!0&&m.updateMatrix(),g.value.copy(m.matrix)}function i(m,g){g.color.getRGB(m.fogColor.value,Bd(s)),g.isFog?(m.fogNear.value=g.near,m.fogFar.value=g.far):g.isFogExp2&&(m.fogDensity.value=g.density)}function n(m,g,b,A,y){g.isNodeMaterial?g.uniformsNeedUpdate=!1:g.isMeshBasicMaterial?r(m,g):g.isMeshLambertMaterial?(r(m,g),g.envMap&&(m.envMapIntensity.value=g.envMapIntensity)):g.isMeshToonMaterial?(r(m,g),f(m,g)):g.isMeshPhongMaterial?(r(m,g),h(m,g),g.envMap&&(m.envMapIntensity.value=g.envMapIntensity)):g.isMeshStandardMaterial?(r(m,g),u(m,g),g.isMeshPhysicalMaterial&&d(m,g,y)):g.isMeshMatcapMaterial?(r(m,g),p(m,g)):g.isMeshDepthMaterial?r(m,g):g.isMeshDistanceMaterial?(r(m,g),x(m,g)):g.isMeshNormalMaterial?r(m,g):g.isLineBasicMaterial?(a(m,g),g.isLineDashedMaterial&&o(m,g)):g.isPointsMaterial?l(m,g,b,A):g.isSpriteMaterial?c(m,g):g.isShadowMaterial?(m.color.value.copy(g.color),m.opacity.value=g.opacity):g.isShaderMaterial&&(g.uniformsNeedUpdate=!1)}function r(m,g){m.opacity.value=g.opacity,g.color&&m.diffuse.value.copy(g.color),g.emissive&&m.emissive.value.copy(g.emissive).multiplyScalar(g.emissiveIntensity),g.map&&(m.map.value=g.map,e(g.map,m.mapTransform)),g.alphaMap&&(m.alphaMap.value=g.alphaMap,e(g.alphaMap,m.alphaMapTransform)),g.bumpMap&&(m.bumpMap.value=g.bumpMap,e(g.bumpMap,m.bumpMapTransform),m.bumpScale.value=g.bumpScale,g.side===Je&&(m.bumpScale.value*=-1)),g.normalMap&&(m.normalMap.value=g.normalMap,e(g.normalMap,m.normalMapTransform),m.normalScale.value.copy(g.normalScale),g.side===Je&&m.normalScale.value.negate()),g.displacementMap&&(m.displacementMap.value=g.displacementMap,e(g.displacementMap,m.displacementMapTransform),m.displacementScale.value=g.displacementScale,m.displacementBias.value=g.displacementBias),g.emissiveMap&&(m.emissiveMap.value=g.emissiveMap,e(g.emissiveMap,m.emissiveMapTransform)),g.specularMap&&(m.specularMap.value=g.specularMap,e(g.specularMap,m.specularMapTransform)),g.alphaTest>0&&(m.alphaTest.value=g.alphaTest);const b=t.get(g),A=b.envMap,y=b.envMapRotation;A&&(m.envMap.value=A,m.envMapRotation.value.setFromMatrix4(Qx.makeRotationFromEuler(y)).transpose(),A.isCubeTexture&&A.isRenderTargetTexture===!1&&m.envMapRotation.value.premultiply(Zd),m.reflectivity.value=g.reflectivity,m.ior.value=g.ior,m.refractionRatio.value=g.refractionRatio),g.lightMap&&(m.lightMap.value=g.lightMap,m.lightMapIntensity.value=g.lightMapIntensity,e(g.lightMap,m.lightMapTransform)),g.aoMap&&(m.aoMap.value=g.aoMap,m.aoMapIntensity.value=g.aoMapIntensity,e(g.aoMap,m.aoMapTransform))}function a(m,g){m.diffuse.value.copy(g.color),m.opacity.value=g.opacity,g.map&&(m.map.value=g.map,e(g.map,m.mapTransform))}function o(m,g){m.dashSize.value=g.dashSize,m.totalSize.value=g.dashSize+g.gapSize,m.scale.value=g.scale}function l(m,g,b,A){m.diffuse.value.copy(g.color),m.opacity.value=g.opacity,m.size.value=g.size*b,m.scale.value=A*.5,g.map&&(m.map.value=g.map,e(g.map,m.uvTransform)),g.alphaMap&&(m.alphaMap.value=g.alphaMap,e(g.alphaMap,m.alphaMapTransform)),g.alphaTest>0&&(m.alphaTest.value=g.alphaTest)}function c(m,g){m.diffuse.value.copy(g.color),m.opacity.value=g.opacity,m.rotation.value=g.rotation,g.map&&(m.map.value=g.map,e(g.map,m.mapTransform)),g.alphaMap&&(m.alphaMap.value=g.alphaMap,e(g.alphaMap,m.alphaMapTransform)),g.alphaTest>0&&(m.alphaTest.value=g.alphaTest)}function h(m,g){m.specular.value.copy(g.specular),m.shininess.value=Math.max(g.shininess,1e-4)}function f(m,g){g.gradientMap&&(m.gradientMap.value=g.gradientMap)}function u(m,g){m.metalness.value=g.metalness,g.metalnessMap&&(m.metalnessMap.value=g.metalnessMap,e(g.metalnessMap,m.metalnessMapTransform)),m.roughness.value=g.roughness,g.roughnessMap&&(m.roughnessMap.value=g.roughnessMap,e(g.roughnessMap,m.roughnessMapTransform)),g.envMap&&(m.envMapIntensity.value=g.envMapIntensity)}function d(m,g,b){m.ior.value=g.ior,g.sheen>0&&(m.sheenColor.value.copy(g.sheenColor).multiplyScalar(g.sheen),m.sheenRoughness.value=g.sheenRoughness,g.sheenColorMap&&(m.sheenColorMap.value=g.sheenColorMap,e(g.sheenColorMap,m.sheenColorMapTransform)),g.sheenRoughnessMap&&(m.sheenRoughnessMap.value=g.sheenRoughnessMap,e(g.sheenRoughnessMap,m.sheenRoughnessMapTransform))),g.clearcoat>0&&(m.clearcoat.value=g.clearcoat,m.clearcoatRoughness.value=g.clearcoatRoughness,g.clearcoatMap&&(m.clearcoatMap.value=g.clearcoatMap,e(g.clearcoatMap,m.clearcoatMapTransform)),g.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=g.clearcoatRoughnessMap,e(g.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),g.clearcoatNormalMap&&(m.clearcoatNormalMap.value=g.clearcoatNormalMap,e(g.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(g.clearcoatNormalScale),g.side===Je&&m.clearcoatNormalScale.value.negate())),g.dispersion>0&&(m.dispersion.value=g.dispersion),g.retroreflectivity>0&&(m.retroreflectivity.value=g.retroreflectivity),g.iridescence>0&&(m.iridescence.value=g.iridescence,m.iridescenceIOR.value=g.iridescenceIOR,m.iridescenceThicknessMinimum.value=g.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=g.iridescenceThicknessRange[1],g.iridescenceMap&&(m.iridescenceMap.value=g.iridescenceMap,e(g.iridescenceMap,m.iridescenceMapTransform)),g.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=g.iridescenceThicknessMap,e(g.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),g.transmission>0&&(m.transmission.value=g.transmission,m.transmissionSamplerMap.value=b.texture,m.transmissionSamplerSize.value.set(b.width,b.height),g.transmissionMap&&(m.transmissionMap.value=g.transmissionMap,e(g.transmissionMap,m.transmissionMapTransform)),m.thickness.value=g.thickness,g.thicknessMap&&(m.thicknessMap.value=g.thicknessMap,e(g.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=g.attenuationDistance,m.attenuationColor.value.copy(g.attenuationColor)),g.anisotropy>0&&(m.anisotropyVector.value.set(g.anisotropy*Math.cos(g.anisotropyRotation),g.anisotropy*Math.sin(g.anisotropyRotation)),g.anisotropyMap&&(m.anisotropyMap.value=g.anisotropyMap,e(g.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=g.specularIntensity,m.specularColor.value.copy(g.specularColor),g.specularColorMap&&(m.specularColorMap.value=g.specularColorMap,e(g.specularColorMap,m.specularColorMapTransform)),g.specularIntensityMap&&(m.specularIntensityMap.value=g.specularIntensityMap,e(g.specularIntensityMap,m.specularIntensityMapTransform))}function p(m,g){g.matcap&&(m.matcap.value=g.matcap)}function x(m,g){const b=t.get(g).light;m.referencePosition.value.setFromMatrixPosition(b.matrixWorld),m.nearDistance.value=b.shadow.camera.near,m.farDistance.value=b.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:n}}function e_(s,t,e,i){let n={},r={},a=[];const o=s.getParameter(s.MAX_UNIFORM_BUFFER_BINDINGS);function l(y,E){const M=E.program;i.uniformBlockBinding(y,M)}function c(y,E){let M=n[y.id];M===void 0&&(m(y),M=h(y),n[y.id]=M,y.addEventListener("dispose",b));const T=E.program;i.updateUBOMapping(y,T);const v=t.render.frame;r[y.id]!==v&&(u(y),r[y.id]=v)}function h(y){const E=f();y.__bindingPointIndex=E;const M=s.createBuffer(),T=y.__size,v=y.usage;return s.bindBuffer(s.UNIFORM_BUFFER,M),s.bufferData(s.UNIFORM_BUFFER,T,v),s.bindBuffer(s.UNIFORM_BUFFER,null),s.bindBufferBase(s.UNIFORM_BUFFER,E,M),M}function f(){for(let y=0;y<o;y++)if(a.indexOf(y)===-1)return a.push(y),y;return me("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function u(y){const E=n[y.id],M=y.uniforms,T=y.__cache;s.bindBuffer(s.UNIFORM_BUFFER,E);for(let v=0,w=M.length;v<w;v++){const P=M[v];if(Array.isArray(P))for(let L=0,U=P.length;L<U;L++)d(P[L],v,L,T);else d(P,v,0,T)}s.bindBuffer(s.UNIFORM_BUFFER,null)}function d(y,E,M,T){if(x(y,E,M,T)===!0){const v=y.__offset,w=y.value;if(Array.isArray(w)){let P=0;for(let L=0;L<w.length;L++){const U=w[L],B=g(U);p(U,y.__data,P),typeof U!="number"&&typeof U!="boolean"&&!U.isMatrix3&&!ArrayBuffer.isView(U)&&(P+=B.storage/Float32Array.BYTES_PER_ELEMENT)}}else p(w,y.__data,0);s.bufferSubData(s.UNIFORM_BUFFER,v,y.__data)}}function p(y,E,M){typeof y=="number"||typeof y=="boolean"?E[0]=y:y.isMatrix3?(E[0]=y.elements[0],E[1]=y.elements[1],E[2]=y.elements[2],E[3]=0,E[4]=y.elements[3],E[5]=y.elements[4],E[6]=y.elements[5],E[7]=0,E[8]=y.elements[6],E[9]=y.elements[7],E[10]=y.elements[8],E[11]=0):ArrayBuffer.isView(y)?E.set(new y.constructor(y.buffer,y.byteOffset,E.length)):y.toArray(E,M)}function x(y,E,M,T){const v=y.value,w=E+"_"+M;if(T[w]===void 0)return typeof v=="number"||typeof v=="boolean"?T[w]=v:ArrayBuffer.isView(v)?T[w]=v.slice():T[w]=v.clone(),!0;{const P=T[w];if(typeof v=="number"||typeof v=="boolean"){if(P!==v)return T[w]=v,!0}else{if(ArrayBuffer.isView(v))return!0;if(P.equals(v)===!1)return P.copy(v),!0}}return!1}function m(y){const E=y.uniforms;let M=0;const T=16;for(let w=0,P=E.length;w<P;w++){const L=Array.isArray(E[w])?E[w]:[E[w]];for(let U=0,B=L.length;U<B;U++){const F=L[U],O=Array.isArray(F.value)?F.value:[F.value];for(let $=0,V=O.length;$<V;$++){const nt=O[$],X=g(nt),Q=M%T,j=Q%X.boundary,Ft=Q+j;M+=j,Ft!==0&&T-Ft<X.storage&&(M+=T-Ft),F.__data=new Float32Array(X.storage/Float32Array.BYTES_PER_ELEMENT),F.__offset=M,M+=X.storage}}}const v=M%T;return v>0&&(M+=T-v),y.__size=M,y.__cache={},this}function g(y){const E={boundary:0,storage:0};return typeof y=="number"||typeof y=="boolean"?(E.boundary=4,E.storage=4):y.isVector2?(E.boundary=8,E.storage=8):y.isVector3||y.isColor?(E.boundary=16,E.storage=12):y.isVector4?(E.boundary=16,E.storage=16):y.isMatrix3?(E.boundary=48,E.storage=48):y.isMatrix4?(E.boundary=64,E.storage=64):y.isTexture?Qt("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(y)?(E.boundary=16,E.storage=y.byteLength):Qt("WebGLRenderer: Unsupported uniform value type.",y),E}function b(y){const E=y.target;E.removeEventListener("dispose",b);const M=a.indexOf(E.__bindingPointIndex);a.splice(M,1),s.deleteBuffer(n[E.id]),delete n[E.id],delete r[E.id]}function A(){for(const y in n)s.deleteBuffer(n[y]);a=[],n={},r={}}return{bind:l,update:c,dispose:A}}const i_=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let Vi=null;function n_(){return Vi===null&&(Vi=new Tc(i_,16,16,is,tn),Vi.name="DFG_LUT",Vi.minFilter=si,Vi.magFilter=si,Vi.wrapS=pn,Vi.wrapT=pn,Vi.generateMipmaps=!1,Vi.needsUpdate=!0),Vi}class Jd{constructor(t={}){const{canvas:e=Hp(),context:i=null,depth:n=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:f=!1,reversedDepthBuffer:u=!1,outputBufferType:d=bi}=t;this.isWebGLRenderer=!0;let p;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=i.getContextAttributes().alpha}else p=a;const x=d,m=new Set([Mc,yc,_c]),g=new Set([bi,Qi,Sr,br,gc,vc]),b=new Uint32Array(4),A=new Int32Array(4),y=new R;let E=null,M=null;const T=[],v=[];let w=null;this.domElement=e,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=ji,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const P=this;let L=!1,U=null,B=null,F=null,O=null;this._outputColorSpace=je;let $=0,V=0,nt=null,X=-1,Q=null;const j=new Ue,Ft=new Ue;let ut=null;const te=new Kt(0);let Zt=0,ee=e.width,Z=e.height,et=1,Mt=null,$t=null;const Tt=new Ue(0,0,ee,Z),Jt=new Ue(0,0,ee,Z);let be=!1;const it=new Ac;let rt=!1,lt=!1;const ct=new Se,ft=new R,Wt=new Ue,Gt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let jt=!1;function ie(){return nt===null?et:1}let k=i;function _e(S,I){return e.getContext(S,I)}let ce,C,_,N,G,K,ht,dt,Y,tt,mt,Bt,_t,gt,zt,Xt,se,D,vt,J,xt,Et,st;try{const S={alpha:!0,depth:n,stencil:r,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:f};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${pc}`),e.addEventListener("webglcontextlost",Re,!1),e.addEventListener("webglcontextrestored",ye,!1),e.addEventListener("webglcontextcreationerror",Pi,!1),k===null){const I="webgl2";if(k=_e(I,S),k===null)throw _e(I)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}Ht()}catch(S){throw e.removeEventListener("webglcontextlost",Re,!1),e.removeEventListener("webglcontextrestored",ye,!1),e.removeEventListener("webglcontextcreationerror",Pi,!1),me("WebGLRenderer: "+S.message),S}function Ht(){ce=new n1(k),ce.init(),xt=new $x(k,ce),C=new Kv(k,ce,t,xt),_=new qx(k,ce),C.reversedDepthBuffer&&u&&_.buffers.depth.setReversed(!0),B=k.createFramebuffer(),F=k.createFramebuffer(),O=k.createFramebuffer(),N=new a1(k),G=new kx,K=new Kx(k,ce,_,G,C,xt,N),ht=new i1(P),dt=new lm(k),Et=new Xv(k,dt),Y=new s1(k,dt,N,Et),tt=new l1(k,Y,dt,Et,N),D=new o1(k,C,K),zt=new $v(G),mt=new Lx(P,ht,ce,C,Et,zt),Bt=new t_(P,G),_t=new Dx,gt=new zx(ce),se=new Wv(P,ht,_,tt,p,l),Xt=new Xx(P,tt,C),st=new e_(k,N,C,_),vt=new qv(k,ce,N),J=new r1(k,ce,N),N.programs=mt.programs,P.capabilities=C,P.extensions=ce,P.properties=G,P.renderLists=_t,P.shadowMap=Xt,P.state=_,P.info=N}x!==bi&&(w=new h1(x,e.width,e.height,o,n,r));const Ut=new jx(P,k);this.xr=Ut,this.getContext=function(){return k},this.getContextAttributes=function(){return k.getContextAttributes()},this.forceContextLoss=function(){const S=ce.get("WEBGL_lose_context");S&&S.loseContext()},this.forceContextRestore=function(){const S=ce.get("WEBGL_lose_context");S&&S.restoreContext()},this.getPixelRatio=function(){return et},this.setPixelRatio=function(S){S!==void 0&&(et=S,this.setSize(ee,Z,!1))},this.getSize=function(S){return S.set(ee,Z)},this.setSize=function(S,I,W=!0){if(Ut.isPresenting){Qt("WebGLRenderer: Can't change size while VR device is presenting.");return}ee=S,Z=I,e.width=Math.floor(S*et),e.height=Math.floor(I*et),W===!0&&(e.style.width=S+"px",e.style.height=I+"px"),w!==null&&w.setSize(e.width,e.height),this.setViewport(0,0,S,I)},this.getDrawingBufferSize=function(S){return S.set(ee*et,Z*et).floor()},this.setDrawingBufferSize=function(S,I,W){ee=S,Z=I,et=W,e.width=Math.floor(S*W),e.height=Math.floor(I*W),this.setViewport(0,0,S,I)},this.setEffects=function(S){if(x===bi){me("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(S){for(let I=0;I<S.length;I++)if(S[I].isOutputPass===!0){Qt("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}w.setEffects(S||[])},this.getCurrentViewport=function(S){return S.copy(j)},this.getViewport=function(S){return S.copy(Tt)},this.setViewport=function(S,I,W,z){S.isVector4?Tt.set(S.x,S.y,S.z,S.w):Tt.set(S,I,W,z),_.viewport(j.copy(Tt).multiplyScalar(et).round())},this.getScissor=function(S){return S.copy(Jt)},this.setScissor=function(S,I,W,z){S.isVector4?Jt.set(S.x,S.y,S.z,S.w):Jt.set(S,I,W,z),_.scissor(Ft.copy(Jt).multiplyScalar(et).round())},this.getScissorTest=function(){return be},this.setScissorTest=function(S){_.setScissorTest(be=S)},this.setOpaqueSort=function(S){Mt=S},this.setTransparentSort=function(S){$t=S},this.getClearColor=function(S){return S.copy(se.getClearColor())},this.setClearColor=function(){se.setClearColor(...arguments)},this.getClearAlpha=function(){return se.getClearAlpha()},this.setClearAlpha=function(){se.setClearAlpha(...arguments)},this.clear=function(S=!0,I=!0,W=!0){let z=0;if(S){let H=!1;if(nt!==null){const bt=nt.texture.format;H=m.has(bt)}if(H){const bt=nt.texture.type,Pt=g.has(bt),St=se.getClearColor(),It=se.getClearAlpha(),Nt=St.r,ae=St.g,he=St.b;Pt?(b[0]=Nt,b[1]=ae,b[2]=he,b[3]=It,k.clearBufferuiv(k.COLOR,0,b)):(A[0]=Nt,A[1]=ae,A[2]=he,A[3]=It,k.clearBufferiv(k.COLOR,0,A))}else z|=k.COLOR_BUFFER_BIT}I&&(z|=k.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),W&&(z|=k.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),z!==0&&k.clear(z)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(S){S.setRenderer(this),U=S},this.dispose=function(){e.removeEventListener("webglcontextlost",Re,!1),e.removeEventListener("webglcontextrestored",ye,!1),e.removeEventListener("webglcontextcreationerror",Pi,!1),se.dispose(),_t.dispose(),gt.dispose(),G.dispose(),ht.dispose(),tt.dispose(),Et.dispose(),st.dispose(),mt.dispose(),Ut.dispose(),Ut.removeEventListener("sessionstart",Zc),Ut.removeEventListener("sessionend",Jc),Bn.stop()};function Re(S){S.preventDefault(),Oa("WebGLRenderer: Context Lost."),L=!0}function ye(){Oa("WebGLRenderer: Context Restored."),L=!1;const S=N.autoReset,I=Xt.enabled,W=Xt.autoUpdate,z=Xt.needsUpdate,H=Xt.type;Ht(),N.autoReset=S,Xt.enabled=I,Xt.autoUpdate=W,Xt.needsUpdate=z,Xt.type=H}function Pi(S){me("WebGLRenderer: A WebGL context could not be created. Reason: ",S.statusMessage)}function zi(S){const I=S.target;I.removeEventListener("dispose",zi),Lf(I)}function Lf(S){kf(S),G.remove(S)}function kf(S){const I=G.get(S).programs;I!==void 0&&(I.forEach(function(W){mt.releaseProgram(W)}),S.isShaderMaterial&&mt.releaseShaderCache(S))}this.renderBufferDirect=function(S,I,W,z,H,bt){I===null&&(I=Gt);const Pt=H.isMesh&&H.matrixWorld.determinantAffine()<0,St=Uf(S,I,W,z,H);_.setMaterial(z,Pt);let It=W.index,Nt=1;if(z.wireframe===!0){if(It=Y.getWireframeAttribute(W),It===void 0)return;Nt=2}const ae=W.drawRange,he=W.attributes.position;let Dt=ae.start*Nt,Me=(ae.start+ae.count)*Nt;bt!==null&&(Dt=Math.max(Dt,bt.start*Nt),Me=Math.min(Me,(bt.start+bt.count)*Nt)),It!==null?(Dt=Math.max(Dt,0),Me=Math.min(Me,It.count)):he!=null&&(Dt=Math.max(Dt,0),Me=Math.min(Me,he.count));const Ge=Me-Dt;if(Ge<0||Ge===1/0)return;Et.setup(H,z,St,W,It);let ke,Pe=vt;if(It!==null&&(ke=dt.get(It),Pe=J,Pe.setIndex(ke)),H.isMesh)z.wireframe===!0?(_.setLineWidth(z.wireframeLinewidth*ie()),Pe.setMode(k.LINES)):Pe.setMode(k.TRIANGLES);else if(H.isLine){let Qe=z.linewidth;Qe===void 0&&(Qe=1),_.setLineWidth(Qe*ie()),H.isLineSegments?Pe.setMode(k.LINES):H.isLineLoop?Pe.setMode(k.LINE_LOOP):Pe.setMode(k.LINE_STRIP)}else H.isPoints?Pe.setMode(k.POINTS):H.isSprite&&Pe.setMode(k.TRIANGLES);if(H.isBatchedMesh)if(ce.get("WEBGL_multi_draw"))Pe.renderMultiDraw(H._multiDrawStarts,H._multiDrawCounts,H._multiDrawCount);else{const Qe=H._multiDrawStarts,At=H._multiDrawCounts,ai=H._multiDrawCount,ve=It?dt.get(It).bytesPerElement:1,wi=G.get(z).currentProgram.getUniforms();for(let Hi=0;Hi<ai;Hi++)wi.setValue(k,"_gl_DrawID",Hi),Pe.render(Qe[Hi]/ve,At[Hi])}else if(H.isInstancedMesh)Pe.renderInstances(Dt,Ge,H.count);else if(W.isInstancedBufferGeometry){const Qe=W._maxInstanceCount!==void 0?W._maxInstanceCount:1/0,At=Math.min(W.instanceCount,Qe);Pe.renderInstances(Dt,Ge,At)}else Pe.render(Dt,Ge)};function Yc(S,I,W,z){U!==null&&S.isNodeMaterial&&U.setObject(z,S),rt===!0&&zt.setState(S,W,!1),S.transparent===!0&&S.side===fi&&S.forceSinglePass===!1?(S.side=Je,S.needsUpdate=!0,Nr(S,I,z),S.side=ts,S.needsUpdate=!0,Nr(S,I,z),S.side=fi):Nr(S,I,z)}this.compile=function(S,I,W=null){W===null&&(W=S),U!==null&&U.renderStart(S,I,W),M=gt.get(W),M.init(I),v.push(M),W.traverseVisible(function(H){H.isLight&&H.layers.test(I.layers)&&(M.pushLight(H),H.castShadow&&M.pushShadow(H))}),S!==W&&S.traverseVisible(function(H){H.isLight&&H.layers.test(I.layers)&&(M.pushLight(H),H.castShadow&&M.pushShadow(H))}),M.setupLights(),U!==null&&U.updateLights(M.state.lightsArray),lt=this.localClippingEnabled,rt=zt.init(this.clippingPlanes,lt),rt===!0&&zt.setGlobalState(this.clippingPlanes,I),U!==null&&Xt.render(M.state.shadowsArray,W,I);const z=new Set;return S.traverse(function(H){if(!(H.isMesh||H.isPoints||H.isLine||H.isSprite))return;const bt=H.material;if(bt)if(Array.isArray(bt))for(let Pt=0;Pt<bt.length;Pt++){const St=bt[Pt];Yc(St,W,I,H),z.add(St)}else Yc(bt,W,I,H),z.add(bt)}),M=v.pop(),U!==null&&U.renderEnd(),z},this.compileAsync=function(S,I,W=null){const z=this.compile(S,I,W);return new Promise(H=>{function bt(){if(z.forEach(function(Pt){const It=G.get(Pt).currentProgram;(It===void 0||It.isReady())&&z.delete(Pt)}),z.size===0){H(S);return}setTimeout(bt,10)}ce.get("KHR_parallel_shader_compile")!==null?bt():setTimeout(bt,10)})};let io=null;function If(S){io&&io(S)}function Zc(){Bn.stop()}function Jc(){Bn.start()}const Bn=new Vd;Bn.setAnimationLoop(If),typeof self<"u"&&Bn.setContext(self),this.setAnimationLoop=function(S){io=S,Ut.setAnimationLoop(S),S===null?Bn.stop():Bn.start()},Ut.addEventListener("sessionstart",Zc),Ut.addEventListener("sessionend",Jc),this.render=function(S,I){if(I!==void 0&&I.isCamera!==!0){me("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(L===!0)return;U!==null&&U.renderStart(S,I);const W=Ut.enabled===!0&&Ut.isPresenting===!0,z=w!==null&&(nt===null||W)&&w.begin(P,nt);if(S.matrixWorldAutoUpdate===!0&&S.updateMatrixWorld(),I.parent===null&&I.matrixWorldAutoUpdate===!0&&I.updateMatrixWorld(),Ut.enabled===!0&&Ut.isPresenting===!0&&(w===null||w.isCompositing()===!1)&&(Ut.cameraAutoUpdate===!0&&Ut.updateCamera(I),I=Ut.getCamera()),S.isScene===!0&&S.onBeforeRender(P,S,I,nt),M=gt.get(S,v.length),M.init(I),M.state.textureUnits=K.getTextureUnits(),v.push(M),ct.multiplyMatrices(I.projectionMatrix,I.matrixWorldInverse),it.setFromProjectionMatrix(ct,Ji,I.reversedDepth),lt=this.localClippingEnabled,rt=zt.init(this.clippingPlanes,lt),E=_t.get(S,T.length),E.init(),T.push(E),Ut.enabled===!0&&Ut.isPresenting===!0){const Pt=P.xr.getDepthSensingMesh();Pt!==null&&no(Pt,I,-1/0,P.sortObjects)}no(S,I,0,P.sortObjects),E.finish(),U!==null&&U.updateLights(M.state.lightsArray),P.sortObjects===!0&&E.sort(Mt,$t),jt=Ut.enabled===!1||Ut.isPresenting===!1||Ut.hasDepthSensing()===!1,jt&&se.addToRenderList(E,S),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),rt===!0&&zt.beginShadows();const H=M.state.shadowsArray;if(Xt.render(H,S,I),rt===!0&&zt.endShadows(),(z&&w.hasRenderPass())===!1){const Pt=E.opaque,St=E.transmissive;if(M.setupLights(),I.isArrayCamera){const It=I.cameras;if(St.length>0)for(let Nt=0,ae=It.length;Nt<ae;Nt++){const he=It[Nt];Qc(Pt,St,S,he)}jt&&se.render(S);for(let Nt=0,ae=It.length;Nt<ae;Nt++){const he=It[Nt];jc(E,S,he,he.viewport)}}else St.length>0&&Qc(Pt,St,S,I),jt&&se.render(S),jc(E,S,I)}nt!==null&&V===0&&(K.updateMultisampleRenderTarget(nt),K.updateRenderTargetMipmap(nt)),z&&w.end(P),S.isScene===!0&&S.onAfterRender(P,S,I),Et.resetDefaultState(),X=-1,Q=null,v.pop(),v.length>0?(M=v[v.length-1],K.setTextureUnits(M.state.textureUnits),rt===!0&&zt.setGlobalState(P.clippingPlanes,M.state.camera)):M=null,T.pop(),T.length>0?E=T[T.length-1]:E=null,U!==null&&U.renderEnd()};function no(S,I,W,z){if(S.visible===!1)return;if(S.layers.test(I.layers)){if(S.isGroup)W=S.renderOrder;else if(S.isLOD)S.autoUpdate===!0&&S.update(I);else if(S.isLightProbeGrid)M.pushLightProbeGrid(S);else if(S.isLight)M.pushLight(S),S.castShadow&&M.pushShadow(S);else if(S.isSprite){if(!S.frustumCulled||S.intersectsFrustum(it)){z&&Wt.setFromMatrixPosition(S.matrixWorld).applyMatrix4(ct);const Pt=tt.update(S),St=S.material;St.visible&&E.push(S,Pt,St,W,Wt.z,null,I)}}else if((S.isMesh||S.isLine||S.isPoints)&&(!S.frustumCulled||S.intersectsFrustum(it))){const Pt=tt.update(S),St=S.material;if(z&&(S.boundingSphere!==void 0?(S.boundingSphere===null&&S.computeBoundingSphere(),Wt.copy(S.boundingSphere.center)):(Pt.boundingSphere===null&&Pt.computeBoundingSphere(),Wt.copy(Pt.boundingSphere.center)),Wt.applyMatrix4(S.matrixWorld).applyMatrix4(ct)),Array.isArray(St)){const It=Pt.groups;for(let Nt=0,ae=It.length;Nt<ae;Nt++){const he=It[Nt],Dt=St[he.materialIndex];Dt&&Dt.visible&&E.push(S,Pt,Dt,W,Wt.z,he,I)}}else St.visible&&E.push(S,Pt,St,W,Wt.z,null,I)}}const bt=S.children;for(let Pt=0,St=bt.length;Pt<St;Pt++)no(bt[Pt],I,W,z)}function jc(S,I,W,z){const{opaque:H,transmissive:bt,transparent:Pt}=S;M.setupLightsView(W),rt===!0&&zt.setGlobalState(P.clippingPlanes,W),z&&_.viewport(j.copy(z)),H.length>0&&Fr(H,I,W),bt.length>0&&Fr(bt,I,W),Pt.length>0&&Fr(Pt,I,W),_.buffers.depth.setTest(!0),_.buffers.depth.setMask(!0),_.buffers.color.setMask(!0),_.setPolygonOffset(!1)}function Qc(S,I,W,z){if((W.isScene===!0?W.overrideMaterial:null)!==null)return;if(M.state.transmissionRenderTarget[z.id]===void 0){const Dt=ce.has("EXT_color_buffer_half_float")||ce.has("EXT_color_buffer_float");M.state.transmissionRenderTarget[z.id]=new Ui(1,1,{generateMipmaps:!0,type:Dt?tn:bi,minFilter:Jn,samples:Math.max(4,C.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:de.workingColorSpace})}const bt=M.state.transmissionRenderTarget[z.id],Pt=z.viewport||j;bt.setSize(Pt.z*P.transmissionResolutionScale,Pt.w*P.transmissionResolutionScale);const St=P.getRenderTarget(),It=P.getActiveCubeFace(),Nt=P.getActiveMipmapLevel();P.setRenderTarget(bt),P.getClearColor(te),Zt=P.getClearAlpha(),Zt<1&&P.setClearColor(16777215,.5),P.clear(),jt&&se.render(W);const ae=P.toneMapping;P.toneMapping=ji;const he=z.viewport;if(z.viewport!==void 0&&(z.viewport=void 0),M.setupLightsView(z),rt===!0&&zt.setGlobalState(P.clippingPlanes,z),Fr(S,W,z),K.updateMultisampleRenderTarget(bt),K.updateRenderTargetMipmap(bt),ce.has("WEBGL_multisampled_render_to_texture")===!1){let Dt=!1;for(let Me=0,Ge=I.length;Me<Ge;Me++){const ke=I[Me],{object:Pe,geometry:Qe,material:At,group:ai}=ke;if(At.side===fi&&Pe.layers.test(z.layers)){const ve=At.side;At.side=Je,At.needsUpdate=!0,th(Pe,W,z,Qe,At,ai),At.side=ve,At.needsUpdate=!0,Dt=!0}}Dt===!0&&(K.updateMultisampleRenderTarget(bt),K.updateRenderTargetMipmap(bt))}P.setRenderTarget(St,It,Nt),P.setClearColor(te,Zt),he!==void 0&&(z.viewport=he),P.toneMapping=ae}function Fr(S,I,W){const z=I.isScene===!0?I.overrideMaterial:null;for(let H=0,bt=S.length;H<bt;H++){const Pt=S[H],{object:St,geometry:It,group:Nt}=Pt;let ae=Pt.material;ae.allowOverride===!0&&z!==null&&(ae=z),St.layers.test(W.layers)&&th(St,I,W,It,ae,Nt)}}function th(S,I,W,z,H,bt){U!==null&&H.isNodeMaterial&&U.setObject(S,H),S.onBeforeRender(P,I,W,z,H,bt),S.modelViewMatrix.multiplyMatrices(W.matrixWorldInverse,S.matrixWorld),S.normalMatrix.getNormalMatrix(S.modelViewMatrix),H.onBeforeRender(P,I,W,z,S,bt),H.transparent===!0&&H.side===fi&&H.forceSinglePass===!1?(H.side=Je,H.needsUpdate=!0,P.renderBufferDirect(W,I,z,H,S,bt),H.side=ts,H.needsUpdate=!0,P.renderBufferDirect(W,I,z,H,S,bt),H.side=fi):P.renderBufferDirect(W,I,z,H,S,bt),S.onAfterRender(P,I,W,z,H,bt)}function Nr(S,I,W){I.isScene!==!0&&(I=Gt);const z=G.get(S),H=M.state.lights,bt=M.state.shadowsArray,Pt=H.state.version,St=mt.getParameters(S,H.state,bt,I,W,M.state.lightProbeGridArray),It=mt.getProgramCacheKey(St);let Nt=z.programs;z.environment=S.isMeshStandardMaterial||S.isMeshLambertMaterial||S.isMeshPhongMaterial?I.environment:null,z.fog=I.fog;const ae=S.isMeshStandardMaterial||S.isMeshLambertMaterial&&!S.envMap||S.isMeshPhongMaterial&&!S.envMap;z.envMap=ht.get(S.envMap||z.environment,ae),z.envMapRotation=z.environment!==null&&S.envMap===null?I.environmentRotation:S.envMapRotation,Nt===void 0&&(S.addEventListener("dispose",zi),Nt=new Map,z.programs=Nt);let he=Nt.get(It);if(he!==void 0){if(z.currentProgram===he&&z.lightsStateVersion===Pt)return ih(S,St),he}else St.uniforms=mt.getUniforms(S),U!==null&&S.isNodeMaterial&&U.build(S,W,St),S.onBeforeCompile(St,P),he=mt.acquireProgram(St,It),Nt.set(It,he),z.uniforms=St.uniforms;const Dt=z.uniforms;return(!S.isShaderMaterial&&!S.isRawShaderMaterial||S.clipping===!0)&&(Dt.clippingPlanes=zt.uniform),ih(S,St),z.needsLights=Nf(S),z.lightsStateVersion=Pt,z.needsLights&&(Dt.ambientLightColor.value=H.state.ambient,Dt.lightProbe.value=H.state.probe,Dt.sunLights.value=H.state.sun,Dt.sunLightShadows.value=H.state.sunShadow,Dt.directionalLights.value=H.state.directional,Dt.directionalLightShadows.value=H.state.directionalShadow,Dt.spotLights.value=H.state.spot,Dt.spotLightShadows.value=H.state.spotShadow,Dt.rectAreaLights.value=H.state.rectArea,Dt.ltc_1.value=H.state.rectAreaLTC1,Dt.ltc_2.value=H.state.rectAreaLTC2,Dt.pointLights.value=H.state.point,Dt.pointLightShadows.value=H.state.pointShadow,Dt.hemisphereLights.value=H.state.hemi,Dt.sunShadowMatrix.value=H.state.sunShadowMatrix,Dt.sunShadowCascade.value=H.state.sunShadowCascade,Dt.directionalShadowMatrix.value=H.state.directionalShadowMatrix,Dt.spotLightMatrix.value=H.state.spotLightMatrix,Dt.spotLightMap.value=H.state.spotLightMap,Dt.pointShadowMatrix.value=H.state.pointShadowMatrix),z.lightProbeGrid=M.state.lightProbeGridArray.length>0,z.currentProgram=he,z.uniformsList=null,he}function eh(S){if(S.uniformsList===null){const I=S.currentProgram.getUniforms();S.uniformsList=Ea.seqWithValue(I.seq,S.uniforms)}return S.uniformsList}function ih(S,I){const W=G.get(S);W.outputColorSpace=I.outputColorSpace,W.batching=I.batching,W.batchingColor=I.batchingColor,W.instancing=I.instancing,W.instancingColor=I.instancingColor,W.instancingMorph=I.instancingMorph,W.skinning=I.skinning,W.morphTargets=I.morphTargets,W.morphNormals=I.morphNormals,W.morphColors=I.morphColors,W.morphTargetsCount=I.morphTargetsCount,W.numClippingPlanes=I.numClippingPlanes,W.numIntersection=I.numClipIntersection,W.vertexAlphas=I.vertexAlphas,W.vertexTangents=I.vertexTangents,W.toneMapping=I.toneMapping}function Df(S,I){if(S.length===0)return null;if(S.length===1)return S[0].texture!==null?S[0]:null;y.setFromMatrixPosition(I.matrixWorld);for(let W=0,z=S.length;W<z;W++){const H=S[W];if(H.texture!==null&&H.boundingBox.containsPoint(y))return H}return null}function Uf(S,I,W,z,H){I.isScene!==!0&&(I=Gt),K.resetTextureUnits();const bt=I.fog,Pt=z.isMeshStandardMaterial||z.isMeshLambertMaterial||z.isMeshPhongMaterial?I.environment:null,St=nt===null?P.outputColorSpace:nt.isXRRenderTarget===!0?nt.texture.colorSpace:de.workingColorSpace,It=z.isMeshStandardMaterial||z.isMeshLambertMaterial&&!z.envMap||z.isMeshPhongMaterial&&!z.envMap,Nt=ht.get(z.envMap||Pt,It),ae=z.vertexColors===!0&&!!W.attributes.color&&W.attributes.color.itemSize===4,he=!!W.attributes.tangent&&(!!z.normalMap||z.anisotropy>0),Dt=!!W.morphAttributes.position,Me=!!W.morphAttributes.normal,Ge=!!W.morphAttributes.color;let ke=ji;z.toneMapped&&(nt===null||nt.isXRRenderTarget===!0)&&(ke=P.toneMapping);const Pe=W.morphAttributes.position||W.morphAttributes.normal||W.morphAttributes.color,Qe=Pe!==void 0?Pe.length:0,At=G.get(z),ai=M.state.lights;if(rt===!0&&(lt===!0||S!==Q)){const Le=S===Q&&z.id===X;zt.setState(z,S,Le)}let ve=!1;z.version===At.__version?(At.needsLights&&At.lightsStateVersion!==ai.state.version||At.outputColorSpace!==St||H.isBatchedMesh&&At.batching===!1||!H.isBatchedMesh&&At.batching===!0||H.isBatchedMesh&&At.batchingColor===!0&&H._colorsTexture===null||H.isBatchedMesh&&At.batchingColor===!1&&H._colorsTexture!==null||H.isInstancedMesh&&At.instancing===!1||!H.isInstancedMesh&&At.instancing===!0||H.isSkinnedMesh&&At.skinning===!1||!H.isSkinnedMesh&&At.skinning===!0||H.isInstancedMesh&&At.instancingColor===!0&&H.instanceColor===null||H.isInstancedMesh&&At.instancingColor===!1&&H.instanceColor!==null||H.isInstancedMesh&&At.instancingMorph===!0&&H.morphTexture===null||H.isInstancedMesh&&At.instancingMorph===!1&&H.morphTexture!==null||At.envMap!==Nt||z.fog===!0&&At.fog!==bt||At.numClippingPlanes!==void 0&&(At.numClippingPlanes!==zt.numPlanes||At.numIntersection!==zt.numIntersection)||At.vertexAlphas!==ae||At.vertexTangents!==he||At.morphTargets!==Dt||At.morphNormals!==Me||At.morphColors!==Ge||At.toneMapping!==ke||At.morphTargetsCount!==Qe||!!At.lightProbeGrid!=M.state.lightProbeGridArray.length>0)&&(ve=!0):(ve=!0,At.__version=z.version);let wi=At.currentProgram;ve===!0&&(wi=Nr(z,I,H),U&&z.isNodeMaterial&&U.onUpdateProgram(z,wi,At));let Hi=!1,Sn=!1,os=!1;const Te=wi.getUniforms(),ze=At.uniforms;if(_.useProgram(wi.program)&&(Hi=!0,Sn=!0,os=!0),z.id!==X&&(X=z.id,Sn=!0),At.needsLights){const Le=Df(M.state.lightProbeGridArray,H);At.lightProbeGrid!==Le&&(At.lightProbeGrid=Le,Sn=!0)}if(Hi||Q!==S){_.buffers.depth.getReversed()&&S.reversedDepth!==!0&&(S._reversedDepth=!0,S.updateProjectionMatrix()),Te.setValue(k,"projectionMatrix",S.projectionMatrix),Te.setValue(k,"viewMatrix",S.matrixWorldInverse);const wn=Te.map.cameraPosition;wn!==void 0&&wn.setValue(k,ft.setFromMatrixPosition(S.matrixWorld)),C.logarithmicDepthBuffer&&Te.setValue(k,"logDepthBufFC",2/(Math.log(S.far+1)/Math.LN2)),(z.isMeshPhongMaterial||z.isMeshToonMaterial||z.isMeshLambertMaterial||z.isMeshBasicMaterial||z.isMeshStandardMaterial||z.isShaderMaterial)&&Te.setValue(k,"isOrthographic",S.isOrthographicCamera===!0),Q!==S&&(Q=S,Sn=!0,os=!0)}if(At.needsLights&&(ai.state.sunShadowMap.length>0&&Te.setValue(k,"sunShadowMap",ai.state.sunShadowMap,K),ai.state.directionalShadowMap.length>0&&Te.setValue(k,"directionalShadowMap",ai.state.directionalShadowMap,K),ai.state.spotShadowMap.length>0&&Te.setValue(k,"spotShadowMap",ai.state.spotShadowMap,K),ai.state.pointShadowMap.length>0&&Te.setValue(k,"pointShadowMap",ai.state.pointShadowMap,K)),H.isSkinnedMesh){Te.setOptional(k,H,"bindMatrix"),Te.setOptional(k,H,"bindMatrixInverse");const Le=H.skeleton;Le&&(Le.boneTexture===null&&Le.computeBoneTexture(),Te.setValue(k,"boneTexture",Le.boneTexture,K))}H.isBatchedMesh&&(Te.setOptional(k,H,"batchingTexture"),Te.setValue(k,"batchingTexture",H._matricesTexture,K),Te.setOptional(k,H,"batchingIdTexture"),Te.setValue(k,"batchingIdTexture",H._indirectTexture,K),Te.setOptional(k,H,"batchingColorTexture"),H._colorsTexture!==null&&Te.setValue(k,"batchingColorTexture",H._colorsTexture,K));const bn=W.morphAttributes;if((bn.position!==void 0||bn.normal!==void 0||bn.color!==void 0)&&D.update(H,W,wi),(Sn||At.receiveShadow!==H.receiveShadow)&&(At.receiveShadow=H.receiveShadow,Te.setValue(k,"receiveShadow",H.receiveShadow)),(z.isMeshStandardMaterial||z.isMeshLambertMaterial||z.isMeshPhongMaterial)&&z.envMap===null&&I.environment!==null&&(ze.envMapIntensity.value=I.environmentIntensity),ze.dfgLUT!==void 0&&(ze.dfgLUT.value=n_()),Sn){if(Te.setValue(k,"toneMappingExposure",P.toneMappingExposure),At.needsLights&&Ff(ze,os),bt&&z.fog===!0&&Bt.refreshFogUniforms(ze,bt),Bt.refreshMaterialUniforms(ze,z,et,Z,M.state.transmissionRenderTarget[S.id]),At.needsLights&&At.lightProbeGrid){const Le=At.lightProbeGrid;ze.probesSH.value=Le.texture,ze.probesMin.value.copy(Le.boundingBox.min),ze.probesMax.value.copy(Le.boundingBox.max),ze.probesResolution.value.copy(Le.resolution)}Ea.upload(k,eh(At),ze,K)}if(z.isShaderMaterial&&z.uniformsNeedUpdate===!0&&(Ea.upload(k,eh(At),ze,K),z.uniformsNeedUpdate=!1),z.isSpriteMaterial&&Te.setValue(k,"center",H.center),Te.setValue(k,"modelViewMatrix",H.modelViewMatrix),Te.setValue(k,"normalMatrix",H.normalMatrix),Te.setValue(k,"modelMatrix",H.matrixWorld),z.uniformsGroups!==void 0){const Le=z.uniformsGroups;for(let wn=0,ls=Le.length;wn<ls;wn++){const sh=Le[wn];st.update(sh,wi),st.bind(sh,wi)}}return wi}function Ff(S,I){S.ambientLightColor.needsUpdate=I,S.lightProbe.needsUpdate=I,S.sunLights.needsUpdate=I,S.sunLightShadows.needsUpdate=I,S.directionalLights.needsUpdate=I,S.directionalLightShadows.needsUpdate=I,S.pointLights.needsUpdate=I,S.pointLightShadows.needsUpdate=I,S.spotLights.needsUpdate=I,S.spotLightShadows.needsUpdate=I,S.rectAreaLights.needsUpdate=I,S.hemisphereLights.needsUpdate=I}function Nf(S){return S.isMeshLambertMaterial||S.isMeshToonMaterial||S.isMeshPhongMaterial||S.isMeshStandardMaterial||S.isShadowMaterial||S.isShaderMaterial&&S.lights===!0}this.getActiveCubeFace=function(){return $},this.getActiveMipmapLevel=function(){return V},this.getRenderTarget=function(){return nt},this.setRenderTargetTextures=function(S,I,W){const z=G.get(S);z.__autoAllocateDepthBuffer=S.resolveDepthBuffer===!1,z.__autoAllocateDepthBuffer===!1&&(z.__useRenderToTexture=!1),G.get(S.texture).__webglTexture=I,G.get(S.depthTexture).__webglTexture=z.__autoAllocateDepthBuffer?void 0:W,z.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(S,I){const W=G.get(S);W.__webglFramebuffer=I,W.__useDefaultFramebuffer=I===void 0},this.setRenderTarget=function(S,I=0,W=0){nt=S,$=I,V=W;let z=null,H=!1,bt=!1;if(S){const St=G.get(S);if(St.__useDefaultFramebuffer!==void 0){_.bindFramebuffer(k.FRAMEBUFFER,St.__webglFramebuffer),j.copy(S.viewport),Ft.copy(S.scissor),ut=S.scissorTest,_.viewport(j),_.scissor(Ft),_.setScissorTest(ut),X=-1;return}else if(St.__webglFramebuffer===void 0)K.setupRenderTarget(S);else if(St.__hasExternalTextures)K.rebindTextures(S,G.get(S.texture).__webglTexture,G.get(S.depthTexture).__webglTexture);else if(S.depthBuffer){const ae=S.depthTexture;if(St.__boundDepthTexture!==ae){if(ae!==null&&G.has(ae)&&(S.width!==ae.image.width||S.height!==ae.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");K.setupDepthRenderbuffer(S)}}const It=S.texture;(It.isData3DTexture||It.isDataArrayTexture||It.isCompressedArrayTexture)&&(bt=!0);const Nt=G.get(S).__webglFramebuffer;S.isWebGLCubeRenderTarget?(Array.isArray(Nt[I])?z=Nt[I][W]:z=Nt[I],H=!0):S.samples>0&&K.useMultisampledRTT(S)===!1?z=G.get(S).__webglMultisampledFramebuffer:Array.isArray(Nt)?z=Nt[W]:z=Nt,j.copy(S.viewport),Ft.copy(S.scissor),ut=S.scissorTest}else j.copy(Tt).multiplyScalar(et).floor(),Ft.copy(Jt).multiplyScalar(et).floor(),ut=be;if(W!==0&&(z=B),_.bindFramebuffer(k.FRAMEBUFFER,z)&&_.drawBuffers(S,z),_.viewport(j),_.scissor(Ft),_.setScissorTest(ut),H){const St=G.get(S.texture);k.framebufferTexture2D(k.FRAMEBUFFER,k.COLOR_ATTACHMENT0,k.TEXTURE_CUBE_MAP_POSITIVE_X+I,St.__webglTexture,W)}else if(bt){const St=I;for(let It=0;It<S.textures.length;It++){const Nt=G.get(S.textures[It]);k.framebufferTextureLayer(k.FRAMEBUFFER,k.COLOR_ATTACHMENT0+It,Nt.__webglTexture,W,St)}}else if(S!==null&&W!==0){const St=G.get(S.texture);k.framebufferTexture2D(k.FRAMEBUFFER,k.COLOR_ATTACHMENT0,k.TEXTURE_2D,St.__webglTexture,W)}X=-1};function nh(S){const I=G.get(S);return(I.__readFormat!==S.format||I.__readType!==S.type)&&(I.__readFormat=S.format,I.__readType=S.type,I.__formatReadable=C.textureFormatReadable(S.format),I.__typeReadable=C.textureTypeReadable(S.type)),I}this.readRenderTargetPixels=function(S,I,W,z,H,bt,Pt,St=0){if(!(S&&S.isWebGLRenderTarget)){me("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let It=G.get(S).__webglFramebuffer;if(S.isWebGLCubeRenderTarget&&Pt!==void 0&&(It=It[Pt]),It){_.bindFramebuffer(k.FRAMEBUFFER,It);try{const Nt=S.textures[St],ae=Nt.format,he=Nt.type;S.textures.length>1&&k.readBuffer(k.COLOR_ATTACHMENT0+St);const Dt=nh(Nt);if(Dt.__formatReadable===!1){me("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(Dt.__typeReadable===!1){me("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}I>=0&&I<=S.width-z&&W>=0&&W<=S.height-H&&k.readPixels(I,W,z,H,xt.convert(ae),xt.convert(he),bt)}finally{const Nt=nt!==null?G.get(nt).__webglFramebuffer:null;_.bindFramebuffer(k.FRAMEBUFFER,Nt)}}},this.readRenderTargetPixelsAsync=async function(S,I,W,z,H,bt,Pt,St=0){if(!(S&&S.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let It=G.get(S).__webglFramebuffer;if(S.isWebGLCubeRenderTarget&&Pt!==void 0&&(It=It[Pt]),It)if(I>=0&&I<=S.width-z&&W>=0&&W<=S.height-H){_.bindFramebuffer(k.FRAMEBUFFER,It);const Nt=S.textures[St],ae=Nt.format,he=Nt.type;S.textures.length>1&&k.readBuffer(k.COLOR_ATTACHMENT0+St);const Dt=nh(Nt);if(Dt.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(Dt.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const Me=k.createBuffer();k.bindBuffer(k.PIXEL_PACK_BUFFER,Me),k.bufferData(k.PIXEL_PACK_BUFFER,bt.byteLength,k.STREAM_READ),k.readPixels(I,W,z,H,xt.convert(ae),xt.convert(he),0),k.bindBuffer(k.PIXEL_PACK_BUFFER,null);const Ge=nt!==null?G.get(nt).__webglFramebuffer:null;_.bindFramebuffer(k.FRAMEBUFFER,Ge);const ke=k.fenceSync(k.SYNC_GPU_COMMANDS_COMPLETE,0);return k.flush(),await Gp(k,ke,4),k.bindBuffer(k.PIXEL_PACK_BUFFER,Me),k.getBufferSubData(k.PIXEL_PACK_BUFFER,0,bt),k.bindBuffer(k.PIXEL_PACK_BUFFER,null),k.deleteBuffer(Me),k.deleteSync(ke),bt}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(S,I=null,W=0){const z=Math.pow(2,-W),H=Math.floor(S.image.width*z),bt=Math.floor(S.image.height*z),Pt=I!==null?I.x:0,St=I!==null?I.y:0;K.setTexture2D(S,0),k.copyTexSubImage2D(k.TEXTURE_2D,W,0,0,Pt,St,H,bt),_.unbindTexture()},this.copyTextureToTexture=function(S,I,W=null,z=null,H=0,bt=0){let Pt,St,It,Nt,ae,he,Dt,Me,Ge;const ke=S.isCompressedTexture?S.mipmaps[bt]:S.image;if(W!==null)Pt=W.max.x-W.min.x,St=W.max.y-W.min.y,It=W.isBox3?W.max.z-W.min.z:1,Nt=W.min.x,ae=W.min.y,he=W.isBox3?W.min.z:0;else{const ze=Math.pow(2,-H);Pt=Math.floor(ke.width*ze),St=Math.floor(ke.height*ze),S.isDataArrayTexture?It=ke.depth:S.isData3DTexture?It=Math.floor(ke.depth*ze):It=1,Nt=0,ae=0,he=0}z!==null?(Dt=z.x,Me=z.y,Ge=z.z):(Dt=0,Me=0,Ge=0);const Pe=xt.convert(I.format),Qe=xt.convert(I.type);let At;I.isData3DTexture?(K.setTexture3D(I,0),At=k.TEXTURE_3D):I.isDataArrayTexture||I.isCompressedArrayTexture?(K.setTexture2DArray(I,0),At=k.TEXTURE_2D_ARRAY):(K.setTexture2D(I,0),At=k.TEXTURE_2D),_.activeTexture(k.TEXTURE0),_.pixelStorei(k.UNPACK_FLIP_Y_WEBGL,I.flipY),_.pixelStorei(k.UNPACK_PREMULTIPLY_ALPHA_WEBGL,I.premultiplyAlpha),_.pixelStorei(k.UNPACK_ALIGNMENT,I.unpackAlignment);const ai=_.getParameter(k.UNPACK_ROW_LENGTH),ve=_.getParameter(k.UNPACK_IMAGE_HEIGHT),wi=_.getParameter(k.UNPACK_SKIP_PIXELS),Hi=_.getParameter(k.UNPACK_SKIP_ROWS),Sn=_.getParameter(k.UNPACK_SKIP_IMAGES);_.pixelStorei(k.UNPACK_ROW_LENGTH,ke.width),_.pixelStorei(k.UNPACK_IMAGE_HEIGHT,ke.height),_.pixelStorei(k.UNPACK_SKIP_PIXELS,Nt),_.pixelStorei(k.UNPACK_SKIP_ROWS,ae),_.pixelStorei(k.UNPACK_SKIP_IMAGES,he);const os=S.isDataArrayTexture||S.isData3DTexture,Te=I.isDataArrayTexture||I.isData3DTexture;if(S.isDepthTexture){const ze=G.get(S),bn=G.get(I),Le=G.get(ze.__renderTarget),wn=G.get(bn.__renderTarget);_.bindFramebuffer(k.READ_FRAMEBUFFER,Le.__webglFramebuffer),_.bindFramebuffer(k.DRAW_FRAMEBUFFER,wn.__webglFramebuffer);for(let ls=0;ls<It;ls++)os&&(k.framebufferTextureLayer(k.READ_FRAMEBUFFER,k.COLOR_ATTACHMENT0,G.get(S).__webglTexture,H,he+ls),k.framebufferTextureLayer(k.DRAW_FRAMEBUFFER,k.COLOR_ATTACHMENT0,G.get(I).__webglTexture,bt,Ge+ls)),k.blitFramebuffer(Nt,ae,Pt,St,Dt,Me,Pt,St,k.DEPTH_BUFFER_BIT,k.NEAREST);_.bindFramebuffer(k.READ_FRAMEBUFFER,null),_.bindFramebuffer(k.DRAW_FRAMEBUFFER,null)}else if(H!==0||S.isRenderTargetTexture||G.has(S)){const ze=G.get(S),bn=G.get(I);_.bindFramebuffer(k.READ_FRAMEBUFFER,F),_.bindFramebuffer(k.DRAW_FRAMEBUFFER,O);for(let Le=0;Le<It;Le++)os?k.framebufferTextureLayer(k.READ_FRAMEBUFFER,k.COLOR_ATTACHMENT0,ze.__webglTexture,H,he+Le):k.framebufferTexture2D(k.READ_FRAMEBUFFER,k.COLOR_ATTACHMENT0,k.TEXTURE_2D,ze.__webglTexture,H),Te?k.framebufferTextureLayer(k.DRAW_FRAMEBUFFER,k.COLOR_ATTACHMENT0,bn.__webglTexture,bt,Ge+Le):k.framebufferTexture2D(k.DRAW_FRAMEBUFFER,k.COLOR_ATTACHMENT0,k.TEXTURE_2D,bn.__webglTexture,bt),H!==0?k.blitFramebuffer(Nt,ae,Pt,St,Dt,Me,Pt,St,k.COLOR_BUFFER_BIT,k.NEAREST):Te?k.copyTexSubImage3D(At,bt,Dt,Me,Ge+Le,Nt,ae,Pt,St):k.copyTexSubImage2D(At,bt,Dt,Me,Nt,ae,Pt,St);_.bindFramebuffer(k.READ_FRAMEBUFFER,null),_.bindFramebuffer(k.DRAW_FRAMEBUFFER,null)}else Te?S.isDataTexture||S.isData3DTexture?k.texSubImage3D(At,bt,Dt,Me,Ge,Pt,St,It,Pe,Qe,ke.data):I.isCompressedArrayTexture?k.compressedTexSubImage3D(At,bt,Dt,Me,Ge,Pt,St,It,Pe,ke.data):k.texSubImage3D(At,bt,Dt,Me,Ge,Pt,St,It,Pe,Qe,ke):S.isDataTexture?k.texSubImage2D(k.TEXTURE_2D,bt,Dt,Me,Pt,St,Pe,Qe,ke.data):S.isCompressedTexture?k.compressedTexSubImage2D(k.TEXTURE_2D,bt,Dt,Me,ke.width,ke.height,Pe,ke.data):k.texSubImage2D(k.TEXTURE_2D,bt,Dt,Me,Pt,St,Pe,Qe,ke);_.pixelStorei(k.UNPACK_ROW_LENGTH,ai),_.pixelStorei(k.UNPACK_IMAGE_HEIGHT,ve),_.pixelStorei(k.UNPACK_SKIP_PIXELS,wi),_.pixelStorei(k.UNPACK_SKIP_ROWS,Hi),_.pixelStorei(k.UNPACK_SKIP_IMAGES,Sn),bt===0&&I.generateMipmaps&&k.generateMipmap(At),_.unbindTexture()},this.initRenderTarget=function(S){G.get(S).__webglFramebuffer===void 0&&K.setupRenderTarget(S)},this.initTexture=function(S){S.isCubeTexture?K.setTextureCube(S,0):S.isData3DTexture?K.setTexture3D(S,0):S.isDataArrayTexture||S.isCompressedArrayTexture?K.setTexture2DArray(S,0):K.setTexture2D(S,0),_.unbindTexture()},this.resetState=function(){$=0,V=0,nt=null,_.reset(),Et.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Ji}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorSpace=de._getDrawingBufferColorSpace(t),e.unpackColorSpace=de._getUnpackColorSpace()}}const Fn={likud:{id:"likud",name:"Likud",nameHe:"הליכוד",color:2056127,accent:10273791},yeshatid:{id:"yeshatid",name:"Yesh Atid",nameHe:"יש עתיד",color:41952,accent:11922687},nationalunity:{id:"nationalunity",name:"National Unity",nameHe:"המחנה הממלכתי",color:2573736,accent:10466559},yashar:{id:"yashar",name:"Yashar!",nameHe:"ישר!",color:3833156,accent:12116160},shas:{id:"shas",name:"Shas",nameHe:'ש"ס',color:732779,accent:15909198},utj:{id:"utj",name:"United Torah Judaism",nameHe:"יהדות התורה",color:2763310,accent:14211288},rzp:{id:"rzp",name:"Religious Zionism",nameHe:"הציונות הדתית",color:13849600,accent:16761738},otzma:{id:"otzma",name:"Otzma Yehudit",nameHe:"עוצמה יהודית",color:14721280,accent:16773288},noam:{id:"noam",name:"Noam",nameHe:"נעם",color:8207512,accent:14465258},yb:{id:"yb",name:"Yisrael Beiteinu",nameHe:"ישראל ביתנו",color:2651302,accent:11129840},raam:{id:"raam",name:"Ra'am",nameHe:'רע"ם',color:2006618,accent:10939588},hadash:{id:"hadash",name:"Hadash–Ta'al",nameHe:'חד"ש-תע"ל',color:12597547,accent:16757674},democrats:{id:"democrats",name:"The Democrats",nameHe:"הדמוקרטים",color:14035001,accent:16757693}};let Xn=null;function s_(){if(!Xn){const s=new Uint8Array([70,70,70,255,150,150,150,255,215,215,215,255,255,255,255,255]);Xn=new Tc(s,4,1,Ci),Xn.minFilter=qe,Xn.magFilter=qe,Xn.generateMipmaps=!1,Xn.needsUpdate=!0}return Xn}function Ce(s,t={}){return new cr({color:s,gradientMap:s_(),...t})}const r_=new pi({color:460812,side:Je});function a_(s,t){const e=s.clone(),i=e.getAttribute("position");let n=e.getAttribute("normal");n||(e.computeVertexNormals(),n=e.getAttribute("normal"));for(let r=0;r<i.count;r++)i.setXYZ(r,i.getX(r)+n.getX(r)*t,i.getY(r)+n.getY(r)*t,i.getZ(r)+n.getZ(r)*t);return i.needsUpdate=!0,e}function Ta(s,t){const e=new Kt(s);return e.multiplyScalar(t),e.getHex()}function xe(s,t=1){return new pi({color:s,transparent:!0,opacity:t,blending:Ra,depthWrite:!1})}const jd=.95,Qd=.45,tf=.44,Mu=.035;function Ne(s,t,e,i){const n=i??`${t}:${e?JSON.stringify(e):""}`;let r=s.matCache.get(n);return r||(r=Ce(t,e),s.matCache.set(n,r),s.mats.push(r)),r}function Lt(s,t,e,i,n=[0,0,0],r={}){const a=new qt(e,i);if(a.position.set(n[0],n[1],n[2]),r.rot&&a.rotation.set(r.rot[0],r.rot[1],r.rot[2]),r.scale&&a.scale.set(r.scale[0],r.scale[1],r.scale[2]),a.castShadow=r.shadow!==!1,a.receiveShadow=!1,t.add(a),r.outline!==!1&&s.outline>0){const o=new qt(a_(e,s.outline),r_);o.castShadow=!1,a.add(o)}return a}function ii(s,t=[0,0,0]){const e=new fe;return e.position.set(t[0],t[1],t[2]),s.add(e),e}const Qn=(s,t)=>new Ya(s,Math.max(.001,t),5,12);function ef(s,t={}){const e=s.look,i=Fn[s.party],n={mats:[],matCache:new Map,outline:t.outline===!1?0:.012},r=!!e.female,a=e.build*(r?.9:1),o=r?.92:1,l=Math.sqrt(e.build),c=Ne(n,e.skin),h=Ne(n,Ta(e.skin,.86)),f=e.outfit==="shirt"||e.outfit==="tshirt"?e.shirt:e.jacket,u=Ne(n,f),d=Ne(n,e.shirt),p=Ne(n,e.pants),x=Ne(n,e.shoes??1315860),m=Ne(n,e.hairColor),g=new fe;g.scale.setScalar(e.height);const b=ii(g,[0,jd,0]),A=ii(b);Lt(n,A,new kt(.16*a,.15*a,.2,14),p,[0,-.02,0],{scale:[1,1,.75]}),e.outfit==="skirt"?Lt(n,A,new kt(.17*a,.27*a,.5,16),p,[0,-.22,0],{scale:[1,1,.8]}):(e.outfit==="suit"||e.outfit==="open-suit"||e.outfit==="blazer")&&Lt(n,A,new kt(.185*a,.2*a,.2,14),u,[0,.02,0],{scale:[1,1,.78]});const E=e.outfit==="skirt"?Ne(n,Ta(e.skin,.8)):p,M=ut=>{const te=ii(A,[ut*.095*a,-.05,0]);Lt(n,te,Qn(.082*l,.3),E,[0,-.22,0]);const Zt=ii(te,[0,-Qd,0]);Lt(n,Zt,Qn(.068*l,.3),E,[0,-.21,0]);const ee=ii(Zt,[0,-tf,0]);return Lt(n,ee,new wt(.11,.07,.25),x,[0,0,.05]),{hip:te,knee:Zt,foot:ee}},T=M(1),v=M(-1),w=ii(A,[0,.06,0]),P=.205*a*o,L=.168*a;if(Lt(n,w,new kt(P,L,.5,16),u,[0,.25,0],{scale:[1,1,.66]}),e.build>1.1){const ut=(e.build-1)*.9;Lt(n,w,new Rt(.16*a,16,12),u,[0,.13,.03+ut*.1],{scale:[1,.9,.6+ut]})}r&&Lt(n,w,new Rt(.09,12,10),u,[0,.36,.08],{scale:[1.9,.8,.7],outline:!1});const U=P*.66+.004;if(e.outfit==="suit"||e.outfit==="open-suit"||e.outfit==="blazer"||e.outfit==="skirt"){const ut=new Tr;ut.moveTo(-.075,0),ut.lineTo(.075,0),ut.lineTo(0,-.2),ut.closePath();const te=Lt(n,w,new Za(ut),d,[0,.5,U],{outline:!1,shadow:!1});te.rotation.x=-.05;const Zt=Ne(n,Ta(f,.75));for(const ee of[1,-1])Lt(n,w,new wt(.018,.22,.01),Zt,[ee*.045,.39,U+.004],{rot:[0,0,ee*.36],outline:!1,shadow:!1});if(e.tie!==null&&e.tie!==void 0&&e.outfit==="suit"){const ee=Ne(n,e.tie);Lt(n,w,new wt(.05,.3,.012),ee,[0,.33,U+.008],{outline:!1,shadow:!1}),Lt(n,w,new wt(.055,.045,.02),ee,[0,.48,U+.01],{outline:!1,shadow:!1})}Lt(n,w,new Rt(.018,8,6),Ne(n,i.color,{emissive:new Kt(i.color),emissiveIntensity:.4},"pin"),[.1,.42,U+.01],{outline:!1,shadow:!1})}else if(e.outfit==="shirt")for(let ut=0;ut<4;ut++)Lt(n,w,new Rt(.009,6,4),Ne(n,14540253),[0,.45-ut*.1,U+.002],{outline:!1,shadow:!1});const B=ii(w,[0,.5,0]);Lt(n,B,new Rt(P,16,10,0,Math.PI*2,0,Math.PI/2),u,[0,-.02,0],{scale:[1,.35,.66]});const F=e.outfit==="tshirt",O=ut=>{const te=ii(B,[ut*(P+.035),-.04,0]);Lt(n,te,new Rt(.075*l,12,10),u,[0,0,0]),Lt(n,te,Qn(.06*l,.2),F?d:u,[0,-.15,0]);const Zt=ii(te,[0,-.3,0]);Lt(n,Zt,Qn(.052*l,.18),F?c:u,[0,-.13,0]),!F&&e.outfit!=="shirt"&&Lt(n,Zt,new kt(.05*l,.05*l,.035,10),d,[0,-.255,0],{outline:!1});const ee=ii(Zt,[0,-.3,0]);return Lt(n,ee,new Rt(.064,12,10),c,[0,0,0],{scale:[1,1.05,1.15]}),{sh:te,el:Zt,hand:ee}},$=O(1),V=O(-1),nt=ii(B,[0,.03,0]);Lt(n,nt,new kt(.058,.064,.12,12),c,[0,.05,0]),e.outfit!=="tshirt"&&Lt(n,nt,new kt(.07,.075,.05,12),d,[0,0,0],{outline:!1});const X=ii(nt,[0,.1,0]),Q=.15*(e.head??1);let j=null;if(t.face){const ut=new Td({map:t.face,transparent:!0,alphaTest:.06,toneMapped:!1,depthWrite:!0});j=new u0(ut);const te=e.head??1;j.scale.set(.5*te,.625*te,1),j.position.set(0,.2,.04),X.add(j)}else o_(n,X,e,Q,c,h,m);return{root:g,pivot:b,hips:A,spine:w,chest:B,neck:nt,head:X,lSh:$.sh,lEl:$.el,rSh:V.sh,rEl:V.el,lHand:$.hand,rHand:V.hand,lHip:T.hip,lKnee:T.knee,rHip:v.hip,rKnee:v.knee,lFoot:T.foot,rFoot:v.foot,materials:n.mats,headRadius:Q,def:s,faceSprite:j}}function o_(s,t,e,i,n,r,a){const o=ii(t,[0,.14,0]),l=[.92,1.05,1];Lt(s,o,new Rt(i,24,18),n,[0,0,0],{scale:l});const c=e.female?.84:.95;Lt(s,o,new Rt(i*.8,18,12),n,[0,-i*.35,i*.08],{scale:[c,.85,.95],outline:!1});for(const p of[1,-1])Lt(s,o,new Rt(i*.22,10,8),r,[p*i*.88,-i*.02,-i*.02],{scale:[.5,1,.8]});const h=Ne(s,16777215),f=Ne(s,1118481);for(const p of[1,-1])Lt(s,o,new Rt(i*.14,12,10),h,[p*i*.33,i*.12,i*.84],{outline:!1,shadow:!1}),Lt(s,o,new Rt(i*.075,10,8),f,[p*i*.32,i*.11,i*.965],{outline:!1,shadow:!1});const u=Ne(s,Ta(e.facialHairColor??e.hairColor,e.hairColor>10485760?.7:1)),d=e.brows??1;for(const p of[1,-1])Lt(s,o,new wt(i*.38,i*.075*d,i*.09),u,[p*i*.33,i*.33,i*.9],{rot:[0,p*.25,p*.2],outline:!1,shadow:!1});Lt(s,o,new Rt(i*.17,12,10),r,[0,-i*.03,i*.98],{scale:[.8,1.05,1.1],outline:!1,shadow:!1}),Lt(s,o,new wt(i*.38,i*.05,i*.05),Ne(s,5905950),[0,-i*.4,i*.9],{outline:!1,shadow:!1}),l_(s,o,e,i,a),c_(s,o,e,i),h_(s,o,e,i),u_(s,o,e,i)}function l_(s,t,e,i,n){const r=(o,l,c)=>{const h=Lt(s,t,new Rt(o,24,12,0,Math.PI*2,0,l),n,[0,i*.02,-i*.02],{scale:[.95,1.05,1.02]});return h.rotation.x=-c,h},a=()=>{const o=n.clone();return o.side=fi,s.mats.push(o),o};switch(e.hair){case"bald":break;case"short":r(i*1.04,Math.PI*.46,.35);break;case"buzz":r(i*1.02,Math.PI*.5,.35);break;case"side":r(i*1.05,Math.PI*.46,.3),Lt(s,t,new Rt(i*.62,14,10),n,[i*.22,i*.74,i*.2],{scale:[1.35,.5,1.15],rot:[-.2,0,-.25]});break;case"swept":r(i*1.05,Math.PI*.46,.3),Lt(s,t,new Rt(i*.7,14,10),n,[0,i*.78,i*.18],{scale:[1.3,.48,1.25],rot:[-.35,0,0]});break;case"receding":r(i*1.04,Math.PI*.45,.85);break;case"horseshoe":{Lt(s,t,new He(i*.93,i*.17,8,24,Math.PI*1.15),n,[0,i*.05,-i*.02]).rotation.set(-Math.PI/2,0,-Math.PI*.075);break}case"long":case"wavy":{if(r(i*1.06,Math.PI*.52,.25),Lt(s,t,new kt(i*1.02,i*1.2,i*2.3,20,1,!0,Math.PI*.32,Math.PI*1.36),a(),[0,-i*.62,-i*.02],{scale:[.95,1,1]}),e.hair==="wavy")for(let o=0;o<6;o++){const l=Math.PI*(.55+o*.18);Lt(s,t,new Rt(i*.32,10,8),n,[Math.sin(l)*i*1.05,-i*(1.3+o%2*.25),Math.cos(l)*i*1],{outline:!1})}break}case"bob":r(i*1.07,Math.PI*.52,.2),Lt(s,t,new kt(i*1.05,i*1.14,i*1.35,20,1,!0,Math.PI*.3,Math.PI*1.4),a(),[0,-i*.3,-i*.02],{scale:[.95,1,1]});break;case"bun":r(i*1.05,Math.PI*.5,.25),Lt(s,t,new Rt(i*.45,12,10),n,[0,i*.55,-i*.9]);break;case"ponytail":r(i*1.05,Math.PI*.5,.25),Lt(s,t,Qn(i*.22,i*1.1),n,[0,-i*.2,-i*1.2],{rot:[.5,0,0]});break;case"curly":{r(i*1.12,Math.PI*.55,.2);for(let o=0;o<18;o++){const l=o/18*Math.PI*2,c=i*(.3+o%3*.28),h=i*(1+o%2*.1);Math.cos(l)>.7&&c<i*.6||Lt(s,t,new Rt(i*.33,10,8),n,[Math.sin(l)*h,c,Math.cos(l)*h-i*.05],{outline:!1})}for(let o=0;o<8;o++){const l=Math.PI*(.6+o*.1);Lt(s,t,new Rt(i*.34,10,8),n,[Math.sin(l)*i*1.05,-i*(.2+o%3*.3),Math.cos(l)*i*1],{outline:!1})}break}case"spiky":r(i*1.04,Math.PI*.46,.3);for(let o=0;o<7;o++){const l=-.9+o*.3;Lt(s,t,new ni(i*.18,i*.5,6),n,[Math.sin(l)*i*.5,i*.95,Math.cos(l)*i*.2],{rot:[0,0,-l*.6],outline:!1})}break;case"braids":{r(i*1.06,Math.PI*.52,.2);for(let o=0;o<9;o++){const l=Math.PI*(.62+o*.095);Lt(s,t,Qn(i*.1,i*1.9),n,[Math.sin(l)*i*1,-i*.75,Math.cos(l)*i*.98],{outline:!1})}break}}}function c_(s,t,e,i){const n=e.facialHair??"none";if(n==="none")return;const r=e.facialHairColor??e.hairColor,a=Ne(s,r),o=(c,h,f,u)=>{Lt(s,t,new Rt(c,22,12,-.15,Math.PI+.3,Math.PI*h,Math.PI*(f-h)),u,[0,0,i*.02],{scale:[.93,1.05,1.02],outline:!1})},l=()=>{Lt(s,t,Qn(i*.075,i*.34),a,[0,-i*.26,i*.98],{rot:[0,0,Math.PI/2],outline:!1})};switch(n){case"stubble":{const c=Ne(s,r,{transparent:!0,opacity:.45},`stubble${r}`);o(i*1.015,.58,.92,c);break}case"short":o(i*1.035,.6,.94,a),l();break;case"full":o(i*1.06,.56,.97,a),Lt(s,t,new Rt(i*.48,14,10),a,[0,-i*.82,i*.4],{scale:[1.1,.9,.9],outline:!1}),l();break;case"long":o(i*1.06,.56,.97,a),Lt(s,t,new Rt(i*.5,14,10),a,[0,-i*.8,i*.4],{scale:[1.1,.9,.9],outline:!1}),Lt(s,t,new ni(i*.52,i*1.5,14),a,[0,-i*1.45,i*.45],{rot:[Math.PI-.2,0,0]}),l();break;case"goatee":Lt(s,t,new Rt(i*.3,12,10),a,[0,-i*.75,i*.62],{outline:!1}),l();break;case"mustache":l();break}}function h_(s,t,e,i){const n=e.glasses??"none";if(n==="none")return;const r=Ne(s,n==="thick"?1710618:2763306),a=n==="thick"?i*.05:i*.028,o=new pi({color:12575999,transparent:!0,opacity:.22,depthWrite:!1});for(const l of[1,-1]){const c=[l*i*.34,i*.12,i*1.04];n==="round"?Lt(s,t,new He(i*.22,a,6,20),r,c,{outline:!1,shadow:!1}):Lt(s,t,new He(i*.23,a,4,4),r,c,{rot:[0,0,Math.PI/4],scale:[1.25,.85,1],outline:!1,shadow:!1}),Lt(s,t,new Gs(i*.2,16),o,[c[0],c[1],c[2]+.001],{outline:!1,shadow:!1}),Lt(s,t,new wt(a*1.2,a*1.2,i*.95),r,[l*i*.62,i*.14,i*.55],{outline:!1,shadow:!1})}Lt(s,t,new wt(i*.22,a*1.2,a*1.2),r,[0,i*.16,i*1.06],{outline:!1,shadow:!1})}function u_(s,t,e,i){const n=e.headwear??"none";if(n==="none")return;const r=e.headwearColor??(n==="black-hat"?723723:1118481),a=Ne(s,r);switch(n){case"kippah":case"kippah-knit":{const o=ii(t,[0,i*.94,-i*.32]);if(o.rotation.x=-.45,Lt(s,o,new Rt(i*.55,16,8,0,Math.PI*2,0,Math.PI*.22),a,[0,-i*.42,0],{scale:[1,.9,1]}),n==="kippah-knit"){const l=Lt(s,o,new He(i*.28,i*.03,6,20),Ne(s,16777215),[0,i*.08,0],{outline:!1});l.rotation.x=Math.PI/2}break}case"black-hat":{const o=ii(t,[0,i*.78,-i*.05]);o.rotation.x=-.12,Lt(s,o,new kt(i*1.62,i*1.62,i*.07,24),a,[0,0,0]),Lt(s,o,new kt(i*.88,i*1,i*.95,20),a,[0,i*.48,0]),Lt(s,o,new kt(i*1.01,i*1.01,i*.18,20),Ne(s,2763306),[0,i*.12,0],{outline:!1});break}case"hat":{const o=ii(t,[0,i*.72,0]);o.rotation.x=-.1,Lt(s,o,new kt(i*1.45,i*1.45,i*.06,24),a,[0,0,0]),Lt(s,o,new Rt(i*.98,20,12,0,Math.PI*2,0,Math.PI/2),a,[0,0,0],{scale:[1,.75,1]});break}case"beret":Lt(s,t,new Rt(i*1.1,20,12),a,[i*.1,i*.78,-i*.05],{scale:[1.1,.35,1.1],rot:[0,0,-.2]});break;case"scarf":Lt(s,t,new Rt(i*1.1,22,14,0,Math.PI*2,0,Math.PI*.62),a,[0,0,-i*.05],{scale:[.96,1.05,1.02]}),Lt(s,t,new kt(i*1.02,i*1.15,i*1.3,20,1,!0,Math.PI*.35,Math.PI*1.3),a,[0,-i*.55,-i*.03]);break}}function nf(s){s.root.traverse(t=>{const e=t;e.isMesh&&e.geometry.dispose()}),s.faceSprite?.material?.dispose();for(const t of s.materials)t.dispose()}const Qa=["hips","spine","chest","neck","head","lSh","lEl","rSh","rEl","lHip","lKnee","rHip","rKnee"],vr=Qa.length*3+3,ci=Qa.length*3,Aa=ci+1,sf=ci+2,re=Object.fromEntries(Qa.map((s,t)=>[s,t*3])),dn=1,Rn=2,$i=Math.PI*2;function De(s,t){const e=t?new Float32Array(t):new Float32Array(vr);return Qa.forEach((i,n)=>{const r=s[i];r&&(e[n*3]=r[0],e[n*3+1]=r[1],e[n*3+2]=r[2])}),s.hipY!==void 0&&(e[ci]=s.hipY),s.pivotX!==void 0&&(e[Aa]=s.pivotX),s.pivotZ!==void 0&&(e[sf]=s.pivotZ),e}function gi(s,t,e,i){for(let n=0;n<vr;n++)s[n]=t[n]+(e[n]-t[n])*i;return s}const Yn=s=>s<=0?0:s>=1?1:s,qi=s=>{const t=Yn(s);return t*t*(3-2*t)},ac=s=>1-(1-Yn(s))**3,Ot=De({hipY:-.08,hips:[0,-.4,0],spine:[.12,-.08,0],chest:[.06,-.04,0],lSh:[-1.2,0,.28],lEl:[-1.9,0,0],rSh:[-.85,0,-.32],rEl:[-2.2,0,0],lHip:[-.35,.3,.05],lKnee:[.5,0,0],rHip:[.25,.3,-.06],rKnee:[.42,0,0]}),xr=De({lSh:[.05,0,.12],lEl:[-.25,0,0],rSh:[.05,0,-.12],rEl:[-.25,0,0],lHip:[0,0,.04],rHip:[0,0,-.04]}),ui=De({hipY:-.42,hips:[0,-.3,0],spine:[.42,-.08,0],head:[-.35,0,0],lSh:[-1,0,.3],rSh:[-.75,0,-.3],lHip:[-1.25,.25,.12],lKnee:[2.1,0,0],rHip:[-.55,.25,-.15],rKnee:[2.2,0,0]},Ot),d_=De({hipY:-.06,hips:[0,0,0],spine:[.5,0,0],chest:[.1,0,0],head:[-.45,0,0],lSh:[-.6,0,.15],lEl:[-1.6,0,0],rSh:[-.6,0,-.15],rEl:[-1.6,0,0]},Ot),Zn=De({hipY:0,hips:[0,0,0],spine:[.25,0,0],head:[-.2,0,0],lSh:[-1.4,0,.45],lEl:[-1.3,0,0],rSh:[-1,0,-.45],rEl:[-1.6,0,0],lHip:[-1.35,0,.1],lKnee:[2,0,0],rHip:[-.75,0,-.1],rKnee:[1.7,0,0]},Ot),f_=De({hipY:0,spine:[.05,0,0],lSh:[-2.2,0,.3],lEl:[-.8,0,0],rSh:[-.4,0,-.5],rEl:[-1,0,0],lHip:[-.3,0,.05],lKnee:[.6,0,0],rHip:[.1,0,-.05],rKnee:[.4,0,0]},Ot),Ko=De({hipY:-.12,spine:[.22,-.05,0],head:[.25,0,0],lSh:[-1.4,0,.08],lEl:[-2.3,0,0],rSh:[-1.3,0,-.08],rEl:[-2.35,0,0]},Ot),Su=De({lSh:[-1.3,0,.05],lEl:[-2.3,0,0],rSh:[-1.2,0,-.05],rEl:[-2.35,0,0],head:[.2,0,0]},ui),bu=De({hipY:-.06,spine:[-.38,.25,.1],chest:[-.22,0,0],head:[-.6,0,.15],lSh:[-.45,0,.85],lEl:[-.8,0,0],rSh:[-.3,0,-.75],rEl:[-.7,0,0]},Ot),wu=De({hipY:-.16,hips:[0,-.15,0],spine:[.7,0,0],chest:[.25,0,0],head:[.25,0,0],lSh:[-.55,0,.1],lEl:[-1.9,0,0],rSh:[-.45,0,-.1],rEl:[-1.9,0,0]},Ot),p_=De({hipY:-.24,spine:[.35,0,.18],chest:[.15,0,0],head:[.25,0,0],lSh:[-.7,0,.3],lEl:[-1.6,0,0],rSh:[-.6,0,-.35],rEl:[-1.5,0,0]},Ot),rr=De({hipY:-.8,pivotX:-Math.PI/2,hips:[0,0,0],spine:[0,0,0],chest:[0,0,0],head:[.25,0,0],lSh:[-.2,0,1.3],lEl:[-.4,0,0],rSh:[-.3,0,-1.2],rEl:[-.6,0,0],lHip:[-.35,0,.12],lKnee:[.6,0,0],rHip:[-.1,0,-.1],rKnee:[.2,0,0]}),m_=De({hipY:0,pivotX:-.9,spine:[-.25,0,0],head:[-.45,0,0],lSh:[-2.1,0,1.1],lEl:[-.4,0,0],rSh:[-1.9,0,-1.1],rEl:[-.5,0,0],lHip:[-.9,0,.12],lKnee:[1.3,0,0],rHip:[-.35,0,-.12],rKnee:[.7,0,0]}),g_=De({hipY:0,pivotX:-.12,spine:[-.2,0,.1],chest:[-.1,0,0],head:[.35,0,-.2],lSh:[-.35,0,1.45],lEl:[-.35,0,0],rSh:[-.25,0,-1.35],rEl:[-.45,0,0],lHip:[-.35,0,.18],lKnee:[.55,0,0],rHip:[-.15,0,-.14],rKnee:[.3,0,0]}),v_=De({hipY:-.5,hips:[0,0,0],spine:[.55,0,.2],chest:[.2,0,0],head:[.55,0,.3],lSh:[.25,0,.18],lEl:[-.3,0,0],rSh:[.3,0,-.14],rEl:[-.25,0,0],lHip:[-1.45,0,.12],lKnee:[1.45,0,0],rHip:[.05,0,-.1],rKnee:[1.6,0,0]}),ma=[De({head:[-.35,0,0],spine:[-.1,0,0],lSh:[-2.9,0,.35],lEl:[-.2,0,0],rSh:[-2.9,0,-.35],rEl:[-.2,0,0],lHip:[0,0,.12],rHip:[0,0,-.12],lKnee:[0,0,0],rKnee:[0,0,0]},xr),De({head:[-.2,0,0],rSh:[-2.8,0,-.1],rEl:[-.5,0,0],lSh:[.35,0,.55],lEl:[-2,0,0],lHip:[0,0,.1],rHip:[0,0,-.1]},xr),De({spine:[-.15,0,0],head:[-.2,0,0],lSh:[.35,0,.6],lEl:[-2,0,0],rSh:[.35,0,-.6],rEl:[-2,0,0],lHip:[0,0,.14],rHip:[0,0,-.14]},xr)],Eu=De({rSh:[-1.55,0,-.1],rEl:[-.05,0,0],lSh:[.35,0,.6],lEl:[-2,0,0],spine:[0,.2,0]},xr),x_=De({hipY:-.1,spine:[.15,0,0],lSh:[.1,0,.3],lEl:[-.4,0,0],rSh:[.1,0,-.3],rEl:[-.4,0,0]},Ot),__=De({hipY:0,pivotX:-.45,head:[-.4,0,0],lSh:[-2.4,0,.8],lEl:[-.6,0,0],rSh:[-2.2,0,-.8],rEl:[-.6,0,0],lHip:[-.8,0,.1],lKnee:[1,0,0],rHip:[-.2,0,0],rKnee:[.6,0,0]},Ot),Yt=(s,t,e,i={})=>({base:s,windup:De(t,s),strike:De(e,s),...i}),$o={spine:[.16,-.55,0],chest:[.05,-.12,0],lSh:[-1.57,0,.05],lEl:[-.05,0,0],rSh:[-.85,0,-.32],rEl:[-2.2,0,0]},oc={hips:[0,.2,0],spine:[.22,.5,0],chest:[.05,.12,0],rSh:[-1.6,0,-.05],rEl:[-.05,0,0],lSh:[-.95,0,.35],lEl:[-2.1,0,0]},Yo={hipY:0,hips:[0,.35,0],spine:[-.25,.4,0],rSh:[-3,0,-.15],rEl:[-.25,0,0],lSh:[-.4,0,.5],lEl:[-1.3,0,0]},Zo={hipY:-.1,hips:[0,.1,0],spine:[.12,.25,0],lSh:[-1.55,-.2,-.1],lEl:[-.1,0,0],rSh:[-1.55,.2,.1],rEl:[-.1,0,0]},y_={hips:[0,1,0],spine:[-.35,.2,.45],rHip:[-1.7,0,-.8],rKnee:[.08,0,0],lHip:[.05,.4,0],lKnee:[.2,0,0],lSh:[-.5,0,.9],rSh:[-.3,0,-.6]},Jo={jab:Yt(Ot,{spine:[.12,-.15,0],lSh:[-1.05,0,.35],lEl:[-2,0,0]},$o,{step:.06}),jab2:Yt(Ot,{lSh:[-1.1,0,.3],lEl:[-1.6,0,0]},{...$o,hipY:-.1,spine:[.22,-.5,0]},{step:.1}),straight:Yt(Ot,{spine:[.1,-.35,0],rSh:[-.7,0,-.4],rEl:[-2.2,0,0]},oc,{step:.1,rear:.05}),hook:Yt(Ot,{spine:[.1,.35,0],lSh:[-1.1,0,1],lEl:[-1.5,0,0]},{hips:[0,-.6,0],spine:[.15,-.6,0],lSh:[-1.55,0,.55],lEl:[-1.35,0,0],rSh:[-.8,0,-.3],rEl:[-2.2,0,0]},{step:.05}),midKick:Yt(Ot,{hipY:-.02,spine:[-.05,-.2,0],lHip:[-1.3,0,.1],lKnee:[1.9,0,0]},{hips:[0,-.15,0],spine:[-.25,-.1,0],lHip:[-1.55,0,.05],lKnee:[.08,0,0],rHip:[.1,.2,0],rKnee:[.2,0,0],lSh:[-.9,0,.5],rSh:[-.9,0,-.4]},{fk:"l"}),highKick:Yt(Ot,{hips:[0,.4,0],spine:[-.1,.1,0],rHip:[-.9,0,-.35],rKnee:[1.9,0,0]},y_,{fk:"r"}),kick2:Yt(Ot,{hips:[0,.8,0],rHip:[-1.1,0,-.3],rKnee:[2.1,0,0]},{hips:[0,1.3,0],spine:[-.2,.2,.55],rHip:[-1.4,0,-.9],rKnee:[.05,0,0],lHip:[.1,.3,.05],lKnee:[.25,0,0],lSh:[-.6,0,.6],rSh:[-.5,0,-.3]},{fk:"r"}),dfJab:Yt(Ot,{hipY:-.12,lSh:[-1,0,.3],lEl:[-1.9,0,0]},{hipY:-.2,spine:[.4,-.45,0],lSh:[-1.3,0,.05],lEl:[-.05,0,0]},{step:.12}),launcher:Yt(Ot,{hipY:-.3,spine:[.45,.05,0],rSh:[.25,0,-.2],rEl:[-1.7,0,0],lSh:[-1.2,0,.3]},Yo,{step:.12,rear:.06}),frontKick:Yt(Ot,{spine:[-.1,0,0],lHip:[-1.4,0,0],lKnee:[2,0,0]},{spine:[-.3,0,0],lHip:[-1.6,0,0],lKnee:[.05,0,0],lSh:[-.8,0,.5],rSh:[-.8,0,-.5]},{fk:"l"}),power:Yt(Ot,{hipY:-.12,hips:[0,-.5,0],spine:[.2,-.4,0],rSh:[-.5,0,-.4],rEl:[-2.2,0,0]},{hipY:-.16,hips:[0,.45,0],spine:[.35,.55,0],chest:[.1,.1,0],rSh:[-1.6,0,0],rEl:[-.02,0,0],lSh:[-.7,0,.5],lEl:[-2,0,0]},{step:.3,rear:.12}),knee:Yt(Ot,{lSh:[-1.6,0,.2],rSh:[-1.6,0,-.2],lEl:[-.8,0,0],rEl:[-.8,0,0]},{spine:[.15,0,0],rHip:[-2,0,0],rKnee:[2.4,0,0],lHip:[.1,0,0],lKnee:[.2,0,0],lSh:[-1,0,.25],rSh:[-1,0,-.25],lEl:[-1.4,0,0],rEl:[-1.4,0,0]},{fk:"r"}),elbow:Yt(Ot,{spine:[.1,.3,0],lSh:[-1.3,0,.9],lEl:[-2.4,0,0]},{hips:[0,-.6,0],spine:[.2,-.5,0],lSh:[-1.55,0,.6],lEl:[-2.5,0,0]},{step:.12}),bHook:Yt(Ot,{spine:[.1,-.6,0],rSh:[-1,0,-1.1],rEl:[-1.4,0,0]},{hips:[0,.55,0],spine:[.2,.65,0],rSh:[-1.55,0,-.5],rEl:[-1.4,0,0],lSh:[-.9,0,.3],lEl:[-2.1,0,0]},{step:.1,rear:.06}),spinBack:Yt(Ot,{hips:[0,-.8,0],spine:[.1,-.3,0],rHip:[-.6,0,-.4],rKnee:[1.6,0,0]},{spine:[-.3,0,.4],rHip:[-1.6,0,-1],rKnee:[.05,0,0],lHip:[0,0,.05],lKnee:[.15,0,0],lSh:[-.4,0,1.2],rSh:[-.3,0,-1]},{fk:"r",spin:-$i}),dJab:Yt(ui,{lSh:[-1,0,.35],lEl:[-2,0,0]},{spine:[.35,-.45,0],lSh:[-1.5,0,.05],lEl:[-.05,0,0]}),dStraight:Yt(ui,{spine:[.35,-.3,0],rSh:[-.8,0,-.3],rEl:[-2.1,0,0]},{hips:[0,.1,0],spine:[.35,.45,0],rSh:[-1.5,0,-.05],rEl:[-.05,0,0]}),lowKick:Yt(ui,{lHip:[-1,0,.3],lKnee:[1.8,0,0]},{hipY:-.38,spine:[.1,-.2,0],lHip:[-1.1,0,.35],lKnee:[.1,0,0]},{fk:"l"}),shin:Yt(Ot,{hips:[0,.4,0],rHip:[-.4,0,-.2],rKnee:[1.2,0,0]},{hips:[0,.8,0],spine:[-.15,.1,.2],rHip:[-.75,0,-.55],rKnee:[.1,0,0]},{fk:"r"}),sweep:Yt(ui,{hipY:-.5,hips:[0,-.6,0],lHip:[-1,0,.3],lKnee:[1.6,0,0]},{hipY:-.55,spine:[.55,0,0],hips:[0,.4,0],lHip:[-1.45,0,.7],lKnee:[.05,0,0],rHip:[-1.3,0,-.2],rKnee:[2.4,0,0],lSh:[-.2,0,1],rSh:[-.4,0,-1.2]},{fk:"both",spin:-$i}),ufKnee:Yt(Ot,{hipY:-.2,spine:[.2,0,0],lSh:[-1.6,0,.3],rSh:[-1.6,0,-.3]},{hipY:.1,spine:[-.2,0,0],rHip:[-2.1,0,0],rKnee:[2.5,0,0],lHip:[-.3,0,.1],lKnee:[1.4,0,0],lSh:[-2.6,0,.5],rSh:[-2.4,0,-.5],lEl:[-.8,0,0],rEl:[-.8,0,0]},{fk:"both"}),wsUpper:Yt(ui,{hipY:-.35,rSh:[.2,0,-.2],rEl:[-1.6,0,0]},Yo,{step:.08}),wsKick:Yt(ui,{rHip:[-1.3,0,-.1],rKnee:[2.2,0,0]},{hipY:-.02,spine:[-.25,0,0],rHip:[-1.7,0,-.15],rKnee:[.08,0,0],lSh:[-.7,0,.6],rSh:[-.6,0,-.6]},{fk:"r"}),dashPunch:Yt(Ot,{hipY:-.15,spine:[.45,-.4,0],rSh:[-.4,0,-.4],rEl:[-2.2,0,0]},{hipY:-.18,hips:[0,.45,0],spine:[.45,.55,0],rSh:[-1.65,0,0],rEl:[-.02,0,0],lSh:[-.5,0,.6],lEl:[-1.9,0,0]},{step:.35,rear:.2}),jPunch:Yt(Zn,{spine:[-.2,0,0],rSh:[-2.8,0,-.2],rEl:[-.6,0,0]},{spine:[.45,.3,0],rSh:[-1.2,0,-.1],rEl:[-.1,0,0]},{fk:"both"}),jKick:Yt(Zn,{lHip:[-1.3,0,.1],lKnee:[1.8,0,0]},{spine:[-.3,0,0],lHip:[-1.3,0,.1],lKnee:[.05,0,0],rHip:[.2,0,0],rKnee:[1.2,0,0]},{fk:"both"}),throw:Yt(Ot,{lSh:[-1.35,0,.45],rSh:[-1.35,0,-.45],lEl:[-.4,0,0],rEl:[-.4,0,0]},{spine:[.25,0,0],lSh:[-1.55,0,.12],rSh:[-1.55,0,-.12],lEl:[-.5,0,0],rEl:[-.5,0,0]},{step:.15}),throwExec:Yt(Ot,{lSh:[-1.5,0,.12],rSh:[-1.5,0,-.12],lEl:[-.6,0,0],rEl:[-.6,0,0]},{hips:[0,-1.1,0],spine:[.3,-.5,0],lSh:[-1.8,0,.6],rSh:[-1.2,0,-.9],lEl:[-.2,0,0],rEl:[-.3,0,0]}),grab:Yt(Ot,{spine:[.1,0,0],lSh:[-1.2,0,.7],rSh:[-1.2,0,-.7],lEl:[-.3,0,0],rEl:[-.3,0,0]},{hipY:-.12,spine:[.4,0,0],lSh:[-1.55,0,.1],rSh:[-1.55,0,-.1],lEl:[-.3,0,0],rEl:[-.3,0,0]},{step:.2}),grabExec:Yt(Ot,{spine:[-.25,0,0],lSh:[-2.8,0,.4],rSh:[-2.8,0,-.4],lEl:[-.4,0,0],rEl:[-.4,0,0]},{hipY:-.25,spine:[.6,0,0],lSh:[-1.2,0,.3],rSh:[-1.2,0,-.3],lEl:[-.2,0,0],rEl:[-.2,0,0]}),cast:Yt(Ot,{hipY:-.12,hips:[0,-.7,0],spine:[0,-.3,0],rSh:[.4,0,-.3],rEl:[-1.6,0,0],lSh:[.3,0,.1],lEl:[-1.7,0,0]},Zo,{step:.12}),charge:Yt(Ot,{hipY:-.2,spine:[.3,0,0]},{hipY:-.12,spine:[.65,-.35,0],lSh:[-1.2,0,.1],lEl:[-1.9,0,0],rSh:[-.3,0,-.3],rEl:[-1.2,0,0]},{step:.2,rear:.1}),uppercut:Yt(Ot,{hipY:-.3,spine:[.3,0,0],rSh:[.2,0,-.2],rEl:[-1.6,0,0]},Yo,{step:.1}),counterStance:Yt(Ot,{hipY:-.1},{hipY:-.12,spine:[-.15,.25,0],lSh:[-1.5,0,.7],lEl:[-1.3,0,0],rSh:[-.2,0,-.9],rEl:[-1,0,0]}),counterStrike:Yt(Ot,{hipY:-.15,spine:[-.1,-.4,0]},{...Zo,spine:[.35,.3,0]},{step:.15}),powerup:Yt(Ot,{hipY:-.2,spine:[.4,0,0],lSh:[-.5,0,.1],rSh:[-.5,0,-.1],lEl:[-2.2,0,0],rEl:[-2.2,0,0]},{hipY:0,spine:[-.3,0,0],head:[-.4,0,0],lSh:[-.4,0,1.4],rSh:[-.4,0,-1.4],lEl:[-.3,0,0],rEl:[-.3,0,0]}),vanish:Yt(ui,{lSh:[-1.6,.6,.2],rSh:[-1.6,-.6,-.2],lEl:[-1.4,0,0],rEl:[-1.4,0,0]},{hipY:-.1,lSh:[-2.6,0,.6],rSh:[-2.6,0,-.6],lEl:[-.3,0,0],rEl:[-.3,0,0]}),stomp:Yt(Ot,{hipY:0,lHip:[-1.6,0,0],lKnee:[1.9,0,0],lSh:[-2.4,0,.5],rSh:[-2.4,0,-.5]},{hipY:-.32,spine:[.55,0,0],lHip:[-.8,0,0],lKnee:[.8,0,0],rSh:[-.9,0,-.3],rEl:[-.1,0,0],lSh:[-.9,0,.3],lEl:[-.1,0,0]},{fk:"l"}),diveKick:Yt(Zn,{lHip:[-1.2,0,.1],lKnee:[1.9,0,0]},{spine:[-.2,0,0],lHip:[-.9,0,.1],lKnee:[.05,0,0],rHip:[-.8,0,0],rKnee:[1.8,0,0],lSh:[.6,0,.5],rSh:[.6,0,-.5],lEl:[-.4,0,0],rEl:[-.4,0,0]},{fk:"both"}),place:Yt(ui,{rSh:[-.6,0,-.2],rEl:[-1.4,0,0]},{spine:[.55,0,0],rSh:[-.95,0,-.1],rEl:[-.25,0,0]}),beam:Yt(Ot,{hipY:-.12,hips:[0,-.6,0],rSh:[.4,0,-.3],rEl:[-1.6,0,0],lSh:[.3,0,.1],lEl:[-1.7,0,0]},{...Zo,spine:[.05,.1,0]},{step:.1}),whip:Yt(Ot,{spine:[-.2,-.45,0],rSh:[-2.6,0,-.9],rEl:[-.6,0,0]},{spine:[.3,.45,0],rSh:[-1.55,0,-.1],rEl:[0,0,0]},{step:.1}),slamRise:Yt(Zn,{lSh:[-2.8,0,.4],rSh:[-2.8,0,-.4],lEl:[-.3,0,0],rEl:[-.3,0,0]},{spine:[.5,0,0],lSh:[-1.3,0,.2],rSh:[-1.3,0,-.2],lEl:[-.2,0,0],rEl:[-.2,0,0],lHip:[-1,0,.1],lKnee:[1.1,0,0]},{fk:"both"}),summon:Yt(Ot,{hipY:-.15,lSh:[-.6,0,.3],rSh:[-.6,0,-.3],lEl:[-1.8,0,0],rEl:[-1.8,0,0]},{hipY:0,spine:[-.25,0,0],head:[-.55,0,0],lSh:[-2.8,0,.6],rSh:[-2.8,0,-.6],lEl:[-.2,0,0],rEl:[-.2,0,0]}),guardUp:Yt(Ot,{hipY:-.1},{hipY:-.14,spine:[.1,0,0],lSh:[-1.5,0,-.25],lEl:[-1,0,0],rSh:[-1.45,0,.25],rEl:[-1,0,0]}),spinKick:Yt(Zn,{rHip:[-1.2,0,-.5],rKnee:[1.5,0,0]},{spine:[-.1,0,0],rHip:[-1.55,0,-.95],rKnee:[.1,0,0],lHip:[-.4,0,0],lKnee:[1.2,0,0],lSh:[-.4,0,1.3],rSh:[-.4,0,-1.3],lEl:[-.2,0,0],rEl:[-.2,0,0]},{fk:"both"}),flurry:Yt(Ot,{lSh:[-1,0,.35],lEl:[-2,0,0]},$o,{step:.08}),ultCombo:Yt(Ot,{spine:[.05,-.4,0],rSh:[-.6,0,-.45],rEl:[-2.2,0,0]},oc,{step:.12}),taunt:Yt(Ot,{},{})},M_=De(oc,Ot),Tu=["straight","highKick","jab","uppercut","power","midKick","bHook","launcher"];function Au(s,t,e,i,n,r){if(e<=i){const l=i>0?e/i:1;if(l<.55)return gi(s,t.base,t.windup,qi(l/.55)),0;const c=ac((l-.55)/.45);return gi(s,t.windup,t.strike,c),c}if(e<=i+n)return s.set(t.strike),1;const a=r>0?(e-i-n)/r:1,o=qi((a-.12)/.88);return gi(s,t.strike,t.base,o),1-o}const ar=Qd,As=tf,Cu=new Se,rf=new Se,af=new nn,jo=new nn,Pu=new nn,qn=new R,ga=new R,S_=new R(0,1,0),b_=new nn;function Ru(s){for(;s>Math.PI;)s-=$i;for(;s<-Math.PI;)s+=$i;return s}function Lu(s,t,e,i,n,r){if(n<=.001){e.quaternion.identity();return}qn.copy(i).applyMatrix4(rf).sub(s.position);let a=qn.length();const o=ar+As-.002;a>o?(qn.multiplyScalar(o/a),a=o):a<.2&&(qn.multiplyScalar(.2/Math.max(1e-4,a)),a=.2);const l=Math.max(-1,Math.min(1,(a*a-ar*ar-As*As)/(2*ar*As))),c=Math.acos(l),h=Math.max(.05,ar+As*l),f=Math.asin(Math.max(-1,Math.min(1,qn.x/h))),u=-h*Math.cos(f),d=-As*Math.sin(c),p=Ru(Math.atan2(qn.z,qn.y)-Math.atan2(d,u)),x=s.rotation;s.rotation.set(x.x+Ru(p-x.x)*n,x.y*(1-n),x.z+(f-x.z)*n),t.rotation.set(t.rotation.x+(c-t.rotation.x)*n,0,0),jo.copy(af).multiply(s.quaternion).multiply(t.quaternion).invert(),Pu.setFromAxisAngle(S_,r),jo.multiply(Pu),e.quaternion.copy(b_).slerp(jo,n)}class of{cur=new Float32Array(Ot);vel=new Float32Array(vr);target=new Float32Array(vr);hidden=!1;ikL=1;ikR=1;spin=0;roll=0;gaitPhase=0;gaitW=0;gaitOff=new Float32Array(6);stepOff=new Float32Array(2);prevState="";prevFrame=0;lastHurt=Number.NaN;reset(){this.cur.set(Ot),this.vel.fill(0),this.spin=0,this.roll=0,this.gaitW=0,this.ikL=this.ikR=1}get pivotX(){return this.cur[Aa]}get headRoll(){return this.cur[re.head+Rn]+this.cur[re.spine+Rn]}update(t,e,i){const n=this.target,r=this.vel,a=e.ticks/60;let o=[280,.85],l=1,c=1,h=!0,f=0,u=0,d=0,p=0,x=0,m=0;this.hidden=!1;const g=t.state!==this.prevState||t.stateFrame<this.prevFrame;if(Number.isNaN(this.lastHurt)&&(this.lastHurt=t.lastHurtFrame),t.lastHurtFrame!==this.lastHurt&&t.state!=="blockstun"){this.lastHurt=t.lastHurtFrame;const M=t.lastHitHeavy?1.6:1,T=Math.random()<.5?-1:1;t.state==="hitstun"&&!t.hitHigh?(r[re.spine]+=9*M,r[re.head]+=7*M,r[ci]-=1.2*M):(r[re.spine]-=8*M,r[re.chest]-=4*M,r[re.head]-=14*M,r[re.spine+Rn]+=T*3*M,r[re.head+Rn]+=T*5*M)}switch(t.state==="blockstun"&&g&&(r[re.spine]-=3,r[re.lSh]-=2,r[re.rSh]-=2,r[ci]-=.5),t.state){case"intro":n.set(Eu),n[ci]+=Math.sin(a*2)*.01,o=[200,.9];break;case"idle":case"jumpSquat":case"land":{const M=Math.sin(a*3.4+t.index*1.3)*.5+.5;n.set(t.guarding?Ko:Ot),n[ci]-=M*.024,n[re.spine]+=M*.04,n[re.lSh]+=M*.05,n[re.rSh]-=M*.03,t.state!=="idle"&&(gi(n,n,ui,.4),o=[700,.8]);break}case"walkF":case"walkB":n.set(t.guarding?Ko:Ot),d=.26,p=.07,n[ci]-=.018*(.5-.5*Math.cos(this.gaitPhase*$i*2)),o=[320,.85];break;case"crouch":n.set(t.guarding?Su:ui),o=[520,.8];break;case"dash":n.set(Ot),n[re.spine]+=.28,n[ci]-=.05,d=.42,p=.12,o=[520,.8];break;case"run":{n.set(d_);const M=Math.sin(this.gaitPhase*$i);n[re.lSh]+=M*.7,n[re.rSh]-=M*.7,n[re.hips+dn]+=M*.15,n[ci]-=.03*Math.abs(Math.cos(this.gaitPhase*$i)),d=.62,p=.2,o=[520,.8];break}case"backdash":n.set(Ot),n[re.spine]-=.12,n[ci]-=.04,d=.4,p=.12,o=[520,.8];break;case"sidestep":case"sidewalk":{gi(n,Ot,ui,.18);const M=t.sideX*Math.sin(t.yaw)-t.sideZ*Math.cos(t.yaw);n[re.spine+Rn]-=M*.22,d=t.state==="sidestep"?.38:.3,p=.09,o=[520,.8];break}case"air":case"fall":{const M=t.vy>.12;gi(n,M?f_:Zn,Zn,M?.15:0),t.state==="fall"&&(n[re.spine]+=.2,n[re.lSh]-=.5,n[re.rSh]-=.5),l=c=0,o=[400,.8];break}case"attack":{const M=t.move;if(!M){n.set(Ot);break}o=[2200,.72];const T=Jo[M.anim]??Jo.jab,v=t.moveFrame+1,w=M.startup;let P=0;if(M.anim==="flurry"&&v>w&&v<=w+M.active){const L=Math.floor((v-w)/4)%2===1,U=(v-w)%4/4;gi(n,T.windup,L?M_:T.strike,qi(U*2)),P=1}else M.anim==="slamRise"?n.set(t.vy>0?T.windup:T.strike):M.anim==="throwExec"||M.anim==="grabExec"?(gi(n,T.windup,T.strike,qi(v/26)),v>30&&gi(n,T.strike,Ot,qi((v-30)/14))):P=Au(n,T,v,w,M.active,M.recovery);M.anim==="spinKick"&&v>w&&v<=w+M.active&&(f=(v-w)*.7),T.spin&&v<=w+M.active&&(f=T.spin*ac((v-.35*w)/(.65*w+1))),M.anim==="vanish"&&v>=5&&v<=11&&(this.hidden=!0),(T.fk==="l"||T.fk==="both")&&(l=0),(T.fk==="r"||T.fk==="both")&&(c=0),x=(T.step??0)*P,m=(T.rear??0)*P,d=.34,p=.05;break}case"hitstun":{const M=t.hitHigh?bu:t.isCrouching?p_:wu;gi(n,M,Ot,qi(1-t.stun/8)),o=[700,.5];break}case"blockstun":n.set(t.isCrouching?Su:Ko),o=[900,.55];break;case"juggle":{n.set(m_),n[Aa]=-(.7+Yn((.1-t.vy)/.2)*.8),t.vy<0&&t.y<.7&&gi(n,n,rr,Yn((.7-t.y)/.7)*.6),l=c=0,h=!1,u=null,o=[260,.7];break}case"thrown":n.set(__),l=c=0,h=!1,o=[400,.8];break;case"knockdown":case"ko":n.set(rr),n[re.spine]+=Math.sin(a*2.2)*.02,l=c=0,h=!1,o=[220,.55];break;case"getup":{const M=Yn(t.stateFrame/ed);M<.5?gi(n,rr,ui,qi(M*2)):gi(n,ui,Ot,qi((M-.5)*2)),l=c=Yn((M-.45)*2),h=M>.4,o=[900,.85];break}case"techroll":{const M=Yn(t.stateFrame/fl),v=t.sideX*Math.sin(t.yaw)-t.sideZ*Math.cos(t.yaw)>=0?1:-1;M<.7?n.set(rr):gi(n,rr,ui,qi((M-.7)/.3)),u=v*$i*ac(M/.7),l=c=M>.8?1:0,h=!1,o=[700,.8];break}case"wallsplat":n.set(g_),n[re.head+Rn]+=Math.sin(a*6)*.1,l=c=0,h=!1,o=[420,.6];break;case"dizzy":t.crumpled?(n.set(v_),l=c=0,o=[160,.7]):(n.set(x_),n[re.head]+=Math.sin(a*7)*.35,n[re.head+Rn]+=Math.sin(a*5)*.35,n[re.spine+Rn]+=Math.sin(a*3.5)*.18);break;case"victory":{const M=ma[t.victoryVariant%ma.length];n.set(M),t.victoryVariant%3===1&&(n[re.rSh]+=Math.sin(a*9)*.25),t.victoryVariant%3===2&&(n[re.head]+=Math.sin(a*4)*.12),n[ci]+=Math.abs(Math.sin(a*3))*.02,l=c=0,o=[150,.9];break}case"cinematic":{const M=e.cinematic;if(M&&M.att===t){const T=Math.floor(t.stateFrame/11)%Tu.length,v=Jo[Tu[T]],w=Au(n,v,t.stateFrame%11+1,6,2,3);(v.fk==="l"||v.fk==="both")&&(l=0),(v.fk==="r"||v.fk==="both")&&(c=0),x=(v.step??0)*w,m=(v.rear??0)*w,o=[2e3,.7]}else{const T=Math.floor(t.stateFrame/11)%2===0;n.set(T?bu:wu),t.stateFrame%11===7&&(r[re.head]+=T?-12:10),o=[800,.5]}break}}if(h&&(n[re.head+dn]=-(n[re.hips+dn]+n[re.spine+dn]+n[re.chest+dn])*.9),this.spin=f!==0?f:this.spin*.8,u===null)this.roll=t.spin;else if(u!==0)this.roll=u;else{const M=Math.round(this.roll/$i)*$i;this.roll=M+(this.roll-M)*Math.exp(-i*10),Math.abs(this.roll-M)<.01&&(this.roll=0)}t.grounded||(l=c=0);const b=d>0&&t.grounded&&this.gait(t,i,d,p);this.gaitW+=((b?1:0)-this.gaitW)*(1-Math.exp(-i*14));const A=1-Math.exp(-i*22);this.stepOff[0]+=(x-this.stepOff[0])*A,this.stepOff[1]+=(m-this.stepOff[1])*A;const y=1-Math.exp(-i*18);this.ikL+=(l-this.ikL)*y,this.ikR+=(c-this.ikR)*y,e.hitstop>0||e.freeze>0&&e.freezeOwner!==t||this.integrate(i,o[0],o[1]),this.prevState=t.state,this.prevFrame=t.stateFrame}gait(t,e,i,n){const r=Math.cos(t.yaw),a=Math.sin(t.yaw),o=t.vx*r+t.vz*a,l=t.vx*a-t.vz*r,c=Math.hypot(o,l);if(c<.003)return!1;this.gaitPhase=(this.gaitPhase+c*e*60/(2*i))%1;const h=l/c,f=o/c;for(let u=0;u<2;u++){const d=(this.gaitPhase+u*.5)%1;let p,x=0;if(d<.5)p=.5-d*2;else{const m=(d-.5)*2;p=-.5+qi(m),x=Math.sin(Math.PI*m)*n}this.gaitOff[u*3]=h*p*i,this.gaitOff[u*3+1]=x,this.gaitOff[u*3+2]=f*p*i}return!0}integrate(t,e,i){const n=2*i*Math.sqrt(e),r=this.cur,a=this.vel,o=this.target;let l=Math.min(t,.05);for(;l>1e-6;){const c=Math.min(l,.008333333333333333);l-=c;for(let h=0;h<vr;h++)a[h]+=(e*(o[h]-r[h])-n*a[h])*c,r[h]+=a[h]*c}}showcase(t,e,i,n=0,r=0){const a=this.target;if(i==="victory")a.set(ma[n%ma.length]),n%3===1&&(a[re.rSh]+=Math.sin(e*9+r)*.25),a[ci]+=Math.abs(Math.sin(e*3+r))*.02,this.ikL=this.ikR=0;else if(i==="intro")a.set(Eu),this.ikL=this.ikR=1;else{const o=Math.sin(e*3.4+r)*.5+.5;a.set(Ot),a[ci]-=o*.024,a[re.spine]+=o*.04,this.ikL=this.ikR=1}a[re.head+dn]=-(a[re.hips+dn]+a[re.spine+dn]+a[re.chest+dn])*.9,this.hidden=!1,this.spin*=.8,this.roll=0,this.gaitW=0,this.stepOff.fill(0),this.integrate(t,200,.9)}apply(t){const e=this.cur,i=[t.hips,t.spine,t.chest,t.neck,t.head,t.lSh,t.lEl,t.rSh,t.rEl,t.lHip,t.lKnee,t.rHip,t.rKnee];for(let o=0;o<i.length;o++)i[o].rotation.set(e[o*3],e[o*3+1],e[o*3+2]);if(t.hips.rotation.y+=this.spin,t.pivot.position.y=jd+e[ci],t.pivot.rotation.set(e[Aa],this.roll,e[sf]),this.ikL<=.001&&this.ikR<=.001){t.lFoot.quaternion.identity(),t.rFoot.quaternion.identity();return}t.pivot.updateMatrix(),t.hips.updateMatrix(),Cu.multiplyMatrices(t.pivot.matrix,t.hips.matrix),rf.copy(Cu).invert(),af.copy(t.pivot.quaternion).multiply(t.hips.quaternion);const n=Math.abs(t.lHip.position.x)+.035,r=this.gaitW,a=this.gaitOff;ga.set(n+a[0]*r,Mu+a[1]*r,.19+a[2]*r+this.stepOff[0]),Lu(t.lHip,t.lKnee,t.lFoot,ga,this.ikL,.1),ga.set(-n+a[3]*r,Mu+a[4]*r,-.2+a[5]*r+this.stepOff[1]),Lu(t.rHip,t.rKnee,t.rFoot,ga,this.ikR,-.45)}}function w_(s,t,e=0){const i=xr,n=new of;n.cur.set(i),n.ikL=n.ikR=0,n.apply(s)}const va=900,Ii=new Oe,Qo=new Kt;class E_{group=new fe;inst;particles=[];rings=[];flashes=[];constructor(){const t=new Ic(1,0),e=new pi({color:16777215,transparent:!0,blending:Ra,depthWrite:!1});this.inst=new za(t,e,va),this.inst.instanceMatrix.setUsage(Bp),this.inst.frustumCulled=!1;for(let i=0;i<va;i++)Ii.scale.setScalar(0),Ii.updateMatrix(),this.inst.setMatrixAt(i,Ii.matrix),this.inst.setColorAt(i,Qo.set(16777215));this.group.add(this.inst);for(let i=0;i<24;i++){const n=new qt(new kr(.8,1,40),xe(16777215,1));n.material.side=fi,n.visible=!1,this.group.add(n),this.rings.push({mesh:n,life:0,max:1,from:0,to:1,active:!1,flat:!1})}for(let i=0;i<12;i++){const n=new qt(new Rt(1,16,12),xe(16777215,1));n.visible=!1,this.group.add(n),this.flashes.push({mesh:n,life:0,max:1,from:0,to:1,active:!1,flat:!0})}}clear(){this.particles.length=0;for(const t of[...this.rings,...this.flashes])t.active=!1,t.mesh.visible=!1}burst(t,e,i,n,r,a,o=.05,l=.004,c=30){for(let h=0;h<r;h++){this.particles.length>=va&&this.particles.shift();const f=Math.random()*Math.PI*2,u=Math.acos(2*Math.random()-1),d=a*(.4+Math.random()*.8);this.particles.push({x:t,y:e,z:i,vx:Math.sin(u)*Math.cos(f)*d,vy:Math.cos(u)*d+a*.3,vz:Math.sin(u)*Math.sin(f)*d,life:c*(.6+Math.random()*.6),max:c,size:o*(.6+Math.random()*.8),color:new Kt(n),grav:l,drag:.92})}}ring(t,e,i,n,r,a,o,l=!1){const c=this.rings.find(h=>!h.active)??this.rings[0];c.active=!0,c.life=o,c.max=o,c.from=r,c.to=a,c.mesh.visible=!0,c.mesh.position.set(t,e,i),c.flat=l,c.mesh.rotation.set(l?-Math.PI/2:0,0,0),c.mesh.material.color.set(n)}flash(t,e,i,n,r,a=8){const o=this.flashes.find(l=>!l.active)??this.flashes[0];o.active=!0,o.life=a,o.max=a,o.from=r*.4,o.to=r,o.mesh.visible=!0,o.mesh.position.set(t,e,i),o.mesh.material.color.set(n)}hitSpark(t,e,i,n,r,a){if(r){this.burst(t,e,i,8965375,10,.06,.04,.001,16),this.ring(t,e,i,10475775,.1,.6,12);return}const o=a??(n==="super"?16765440:n==="special"?16747008:n==="heavy"?16757575:16773544),l=n==="light"?12:n==="heavy"?22:n==="special"?26:40,c=n==="light"?.07:n==="heavy"?.1:.12;this.burst(t,e,i,o,l,c,n==="light"?.045:.06,.003,22),this.burst(t,e,i,16777215,Math.round(l/3),c*1.3,.035,.001,12),this.flash(t,e,i,16777215,n==="light"?.28:.45,6),this.ring(t,e,i,o,.1,n==="light"?.6:n==="super"?1.8:1.1,n==="light"?10:16)}update(t,e){const i=Math.min(3,t*60);let n=0;const r=this.particles;for(let a=r.length-1;a>=0;a--){const o=r[a];if(o.life-=i,o.life<=0){r.splice(a,1);continue}o.vy-=o.grav*i,o.vx*=Math.pow(o.drag,i),o.vy*=Math.pow(o.drag,i),o.vz*=Math.pow(o.drag,i),o.x+=o.vx*i,o.y+=o.vy*i,o.z+=o.vz*i,o.y<.02&&(o.y=.02,o.vy*=-.3)}for(const a of r){const o=a.life/a.max;Ii.position.set(a.x,a.y,a.z),Ii.rotation.set(a.life*.3,a.life*.2,0),Ii.scale.setScalar(a.size*(.3+o*.9)),Ii.updateMatrix(),this.inst.setMatrixAt(n,Ii.matrix),Qo.copy(a.color).multiplyScalar(.4+o),this.inst.setColorAt(n,Qo),n++}for(;n<va;n++)Ii.scale.setScalar(0),Ii.updateMatrix(),this.inst.setMatrixAt(n,Ii.matrix);this.inst.instanceMatrix.needsUpdate=!0,this.inst.instanceColor&&(this.inst.instanceColor.needsUpdate=!0);for(const a of[...this.rings,...this.flashes]){if(!a.active)continue;if(a.life-=i,a.life<=0){a.active=!1,a.mesh.visible=!1;continue}const o=1-a.life/a.max;!a.flat&&e&&a.mesh.quaternion.copy(e.quaternion),a.mesh.scale.setScalar(a.from+(a.to-a.from)*(1-(1-o)*(1-o))),a.mesh.material.opacity=1-o}}}function q(s,t,e,i=[0,0,0],n=[0,0,0],r){const a=new qt(t,typeof e=="number"?Ce(e):e);return a.position.set(...i),a.rotation.set(...n),r&&a.scale.set(...r),a.castShadow=!0,s.add(a),a}function xa(s,t,e,i,n){const r=document.createElement("canvas");r.width=256,r.height=Math.round(256*n/i);const a=r.getContext("2d");a.fillStyle=e,a.fillRect(0,0,r.width,r.height),a.fillStyle=t,a.font=`bold ${Math.round(r.height*.55)}px Arial, sans-serif`,a.textAlign="center",a.textBaseline="middle",a.fillText(s,r.width/2,r.height/2);const o=new Cc(r);return o.colorSpace=je,new qt(new Fi(i,n),new pi({map:o,side:fi}))}const _a=typeof document<"u";function Ga(s,t){const e=new fe;switch(s){case"orb":default:q(e,new Rt(.22,16,12),xe(t,.9)),q(e,new Rt(.12,12,10),xe(16777215,1));break;case"ballot":{q(e,new wt(.4,.34,.34),3895256),q(e,new wt(.2,.02,.06),1118481,[0,.175,0]),q(e,new wt(.14,.12,.005),16777215,[0,.24,0],[0,0,.1]);break}case"gavel":{q(e,new kt(.09,.09,.3,12),8014372,[0,.12,0],[0,0,Math.PI/2]),q(e,new kt(.025,.025,.4,8),10251067,[0,-.08,0]),q(e,new kt(.1,.1,.03,12),13934674,[.155,.12,0],[0,0,Math.PI/2]),q(e,new kt(.1,.1,.03,12),13934674,[-.155,.12,0],[0,0,Math.PI/2]);break}case"book":{q(e,new wt(.36,.46,.1),t),q(e,new wt(.34,.44,.08),16117984,[.015,0,0]);break}case"paper":{q(e,new wt(.34,.44,.01),16777215);for(let i=0;i<5;i++)q(e,new wt(.24,.02,.012),7829367,[0,.14-i*.07,.002]);q(e,new wt(.1,.06,.014),t,[.08,-.17,.003]);break}case"coin":case"shekel":{if(q(e,new kt(.22,.22,.05,20),15909198,[0,0,0],[Math.PI/2,0,0]),q(e,new He(.2,.02,6,20),13934615),_a){const i=xa("₪","#8a6500","rgba(0,0,0,0)",.28,.28);i.material.transparent=!0,i.position.z=.03,e.add(i)}break}case"mic":{if(q(e,new Rt(.11,12,10),4473924,[.18,0,0]),q(e,new kt(.04,.05,.3,10),1118481,[0,0,0],[0,0,Math.PI/2]),_a){const i=xa("NEWS","#ffffff","#"+t.toString(16).padStart(6,"0"),.14,.07);i.position.set(.05,.07,0),e.add(i)}break}case"tv":{q(e,new wt(.5,.36,.18),2236962),q(e,new Fi(.42,.28),xe(t,.9),[0,0,.091]),q(e,new kt(.008,.008,.25,6),10066329,[.08,.28,0],[0,0,-.5]),q(e,new kt(.008,.008,.25,6),10066329,[-.08,.28,0],[0,0,.5]);break}case"envelope":{q(e,new wt(.44,.28,.03),16052193),q(e,new ni(.22,.14,4),14735552,[0,.06,.02],[Math.PI,Math.PI/4,0],[1.4,1,.1]),q(e,new kt(.035,.035,.02,12),12066084,[0,0,.02],[Math.PI/2,0,0]);break}case"phone":{q(e,new wt(.22,.42,.04),1710618),q(e,new Fi(.19,.36),xe(t,1),[0,0,.021]);break}case"bomb":{q(e,new Rt(.24,18,14),1710618),q(e,new kt(.06,.06,.08,10),4473924,[0,.26,0]),q(e,new kt(.012,.012,.12,6),13148266,[.03,.34,0],[0,0,-.4]),q(e,new Rt(.04,8,6),xe(16755200,1),[.06,.4,0]),q(e,new He(.245,.02,6,24,Math.PI*.9),16720418,[0,0,0],[0,0,-Math.PI*.1]);break}case"plane":{const i=new Tr;i.moveTo(.3,0),i.lineTo(-.25,.2),i.lineTo(-.15,0),i.lineTo(-.25,-.2),i.closePath();const n=q(e,new Za(i),new cr({color:16777215,side:fi}));n.rotation.x=Math.PI/2,q(e,new wt(.5,.02,.02),14540253,[.02,-.03,0]);break}case"jet":{q(e,new kt(.06,.08,.6,10),8030873,[0,0,0],[0,0,-Math.PI/2]),q(e,new ni(.06,.18,10),5595243,[.39,0,0],[0,0,-Math.PI/2]),q(e,new wt(.28,.02,.6),6978185,[-.04,0,0]),q(e,new wt(.12,.18,.02),6978185,[-.26,.09,0]),q(e,new Rt(.06,8,6),xe(16750848,.9),[-.33,0,0]);break}case"tomato":{q(e,new Rt(.2,16,12),14692398,[0,0,0],[0,0,0],[1,.85,1]),q(e,new ni(.08,.06,5),3115567,[0,.18,0]);break}case"watermelon":{q(e,new Rt(.26,18,14),2980397,[0,0,0],[0,0,0],[1.25,1,1]);for(let i=0;i<6;i++)q(e,new He(.262,.012,4,24,Math.PI),1789211,[0,0,0],[0,i/6*Math.PI,Math.PI/2],[1,1.25,1]);break}case"brick":{q(e,new wt(.44,.2,.22),11879983),q(e,new wt(.46,.02,.24),13616824,[0,.1,0]);break}case"bin":{if(q(e,new kt(.2,.16,.42,14),2984527),q(e,new kt(.22,.22,.04,14),2388031,[0,.23,0]),_a){const i=xa("♻","#ffffff","rgba(0,0,0,0)",.2,.2);i.material.transparent=!0,i.position.set(0,0,.19),e.add(i)}break}case"cone":{q(e,new ni(.2,.55,14),16743168,[0,.22,0]),q(e,new kt(.155,.13,.08,14),16777215,[0,.2,0]),q(e,new wt(.44,.04,.44),16743168,[0,-.04,0]);break}case"train":{q(e,new wt(.8,.36,.3),t),q(e,new wt(.82,.12,.31),14606046,[0,.1,0]);for(let i=0;i<3;i++)q(e,new wt(.16,.1,.32),xe(10477823,.8),[-.25+i*.25,.1,0]);q(e,new Rt(.19,12,10),t,[.4,-.02,0],[0,0,0],[.6,.9,.8]),q(e,new Rt(.035,8,6),xe(16777130,1),[.5,-.06,.1]),q(e,new Rt(.035,8,6),xe(16777130,1),[.5,-.06,-.1]);break}case"tank":{q(e,new wt(.7,.2,.42),4936480,[0,-.05,0]),q(e,new wt(.34,.14,.3),5923880,[-.04,.12,0]),q(e,new kt(.03,.03,.45,8),3818008,[.3,.14,0],[0,0,Math.PI/2]),q(e,new wt(.76,.12,.1),2236962,[0,-.15,.2]),q(e,new wt(.76,.12,.1),2236962,[0,-.15,-.2]);break}case"syringe":{q(e,new kt(.06,.06,.34,12),new cr({color:15267839,transparent:!0,opacity:.75}),[0,0,0],[0,0,Math.PI/2]),q(e,new kt(.05,.05,.24,10),xe(t,.9),[.03,0,0],[0,0,Math.PI/2]),q(e,new kt(.006,.006,.16,6),13421772,[.25,0,0],[0,0,Math.PI/2]),q(e,new kt(.02,.02,.12,6),10066329,[-.22,0,0],[0,0,Math.PI/2]);break}case"sign":{if(q(e,new kt(.02,.02,.6,6),10251067,[0,-.22,0]),q(e,new wt(.5,.34,.02),16777215,[0,.14,0]),_a){const i=xa("VOTE!","#"+t.toString(16).padStart(6,"0"),"#ffffff",.46,.3);i.position.set(0,.14,.012),e.add(i)}break}case"megaphone":{q(e,new kt(.2,.06,.4,14,1,!0),new cr({color:15921906,side:fi}),[.05,0,0],[0,0,-Math.PI/2]),q(e,new He(.2,.02,6,20),t,[.25,0,0],[0,Math.PI/2,0]),q(e,new wt(.05,.14,.05),3355443,[-.08,-.1,0]);break}case"chalk":{q(e,new kt(.035,.035,.26,8),16777215,[0,0,0],[0,0,Math.PI/2]),q(e,new Rt(.12,8,6),xe(16777215,.35),[-.12,0,0]);break}case"scissors":{q(e,new wt(.4,.04,.02),13621468,[.1,.02,0],[0,0,.2]),q(e,new wt(.4,.04,.02),13621468,[.1,-.02,.01],[0,0,-.2]),q(e,new He(.06,.018,6,12),t,[-.14,.07,0]),q(e,new He(.06,.018,6,12),t,[-.14,-.07,0]);break}case"tooth":{q(e,new Rt(.2,14,10),16777215,[0,.06,0],[0,0,0],[1,.8,.9]),q(e,new ni(.07,.24,8),16053492,[-.08,-.14,0],[Math.PI,0,.2]),q(e,new ni(.07,.24,8),16053492,[.08,-.14,0],[Math.PI,0,-.2]);break}case"drill":{q(e,new wt(.22,.14,.12),2792847),q(e,new wt(.08,.2,.1),2508371,[-.06,-.14,0]),q(e,new ni(.035,.24,8),13421772,[.22,0,0],[0,0,-Math.PI/2]);break}case"star":{const i=new Tr;for(let n=0;n<10;n++){const r=n%2===0?.26:.11,a=n/10*Math.PI*2+Math.PI/2;n===0?i.moveTo(Math.cos(a)*r,Math.sin(a)*r):i.lineTo(Math.cos(a)*r,Math.sin(a)*r)}i.closePath(),q(e,new kc(i,{depth:.06,bevelEnabled:!1}),16766474,[0,0,-.03]);break}case"flag":{q(e,new kt(.015,.015,.7,6),14540253,[-.2,-.1,0]),q(e,new wt(.42,.28,.01),16777215,[.02,.1,0]),q(e,new wt(.42,.04,.012),t,[.02,.2,0]),q(e,new wt(.42,.04,.012),t,[.02,0,0]);break}case"wave":{q(e,new He(.3,.07,8,20,Math.PI),xe(t,.85),[0,-.05,0],[0,Math.PI/2,0]).scale.set(1,1,1.4),q(e,new He(.2,.05,8,16,Math.PI),xe(16777215,.8),[.05,-.05,0],[0,Math.PI/2,0]);break}case"sound":{for(let i=0;i<3;i++)q(e,new He(.12+i*.07,.022,6,20,Math.PI*.8),xe(t,.9-i*.2),[i*.07,0,0],[0,Math.PI/2,Math.PI*.6]);break}case"dish":{q(e,new Rt(.24,16,8,0,Math.PI*2,0,Math.PI*.35),new cr({color:15790320,side:fi}),[0,0,0],[0,0,-Math.PI/2]),q(e,new kt(.01,.01,.2,6),7829367,[.1,0,0],[0,0,Math.PI/2]),q(e,new Rt(.04,8,6),xe(t,1),[.2,0,0]);break}case"briefcase":{q(e,new wt(.46,.32,.12),5978654),q(e,new He(.06,.015,6,12,Math.PI),2759182,[0,.16,0]),q(e,new wt(.05,.04,.13),13934674,[0,.08,0]);break}case"siren":{q(e,new kt(.16,.18,.08,14),3355443,[0,-.1,0]),q(e,new Rt(.15,14,10,0,Math.PI*2,0,Math.PI/2),xe(t,.95),[0,-.06,0]),q(e,new Rt(.28,12,10),xe(t,.25),[0,0,0]);break}case"tower":{q(e,new kt(.02,.12,.8,4,1),12568527,[0,.3,0]);for(let i=0;i<3;i++)q(e,new He(.1+i*.07,.012,4,16,Math.PI*.6),xe(t,.9),[0,.7,0],[0,0,Math.PI*.2]);q(e,new Rt(.04,8,6),xe(16724821,1),[0,.72,0]);break}case"ball":{q(e,new Rt(.2,16,12),16777215);for(let i=0;i<3;i++)q(e,new He(.2,.012,4,20),1118481,[0,0,0],[0,i*Math.PI/3,0]);break}case"whistle":{q(e,new kt(.1,.1,.12,12),12632256,[0,0,0],[Math.PI/2,0,0]),q(e,new wt(.2,.06,.08),11579568,[.12,.05,0]);break}case"fire":{q(e,new ni(.2,.5,10),xe(t,.9),[0,.05,0],[0,0,-Math.PI/2]),q(e,new Rt(.2,12,10),xe(16768341,.9),[.1,0,0]),q(e,new Rt(.1,10,8),xe(16777215,1),[.12,0,0]);break}case"snowflake":{for(let i=0;i<3;i++)q(e,new wt(.46,.04,.04),xe(t,.95),[0,0,0],[0,0,i*Math.PI/3]);q(e,new Rt(.2,12,10),xe(16777215,.25));break}case"leaf":{q(e,new Rt(.22,12,8),5613104,[0,0,0],[0,0,.6],[1,.45,.12]),q(e,new wt(.4,.015,.02),2849291,[0,0,0],[0,0,.6]);break}case"heart":{q(e,new Rt(.12,12,10),t,[-.08,.06,0]),q(e,new Rt(.12,12,10),t,[.08,.06,0]),q(e,new ni(.17,.24,12),t,[0,-.1,0],[Math.PI,0,0]);break}case"shield":{q(e,new kt(.25,.25,.04,20),t,[0,0,0],[Math.PI/2,0,0]),q(e,new He(.25,.03,6,20),13934674);break}case"crane":{q(e,new wt(.06,.8,.06),16759304,[0,.3,0]),q(e,new wt(.7,.05,.05),16759304,[.2,.68,0]),q(e,new kt(.005,.005,.3,4),3355443,[.45,.52,0]),q(e,new wt(.16,.08,.08),11879983,[.45,.35,0]),q(e,new wt(.36,.06,.36),5592405,[0,-.08,0]);break}case"map":{q(e,new wt(.5,.02,.36),15326389),q(e,new ni(.04,.12,8),14034984,[.1,.07,.05],[Math.PI,0,0]),q(e,new ni(.04,.12,8),1920728,[-.12,.07,-.06],[Math.PI,0,0]),q(e,new wt(.3,.022,.015),5800279,[0,.005,.02],[0,.4,0]);break}case"clock":{q(e,new kt(.22,.22,.06,20),16777215,[0,.22,0],[Math.PI/2,0,0]),q(e,new He(.22,.025,6,20),t,[0,.22,0]),q(e,new wt(.02,.14,.02),1118481,[0,.27,.035]),q(e,new wt(.1,.02,.02),1118481,[.05,.22,.035]);break}case"chair":{q(e,new wt(.34,.05,.34),2051993,[0,0,0]),q(e,new wt(.34,.36,.05),2051993,[0,.2,-.15]);for(const i of[-.14,.14])for(const n of[-.14,.14])q(e,new kt(.015,.015,.3,6),4473924,[i,-.17,n]);break}case"laptop":{q(e,new wt(.46,.02,.32),11581376,[0,-.1,0]),q(e,new wt(.46,.3,.02),11581376,[0,.05,-.16],[-.25,0,0]),q(e,new Fi(.42,.26),xe(t,1),[0,.05,-.145],[-.25,0,0]);break}}return e}const _n=Math.PI*2,Ns=Ds+.3;function ge(s,t,e,i,n=[0,0,0],r=!0){const a=new qt(new wt(...t),typeof e=="number"?Ce(e):e);return a.position.set(...i),a.rotation.set(...n),a.castShadow=r,a.receiveShadow=!0,s.add(a),a}function Oi(s,t,e,i=[1,1]){const n=document.createElement("canvas");n.width=s,n.height=t,e(n.getContext("2d"),s,t);const r=new Cc(n);return r.colorSpace=je,r.wrapS=r.wrapT=La,r.repeat.set(i[0],i[1]),r.anisotropy=4,r}function Nn(s,t,e,i,n=.08){for(let r=0;r<i;r++){const a=Math.random()>.5?255:0;s.fillStyle=`rgba(${a},${a},${a},${n*Math.random()})`,s.fillRect(Math.random()*t,Math.random()*e,2,2)}}function Ir(s,t,e=16777215,i=90){const n=new qt(new Fi(i,i),new Ni({map:t,color:e,roughness:.85,metalness:.02}));return n.rotation.x=-Math.PI/2,n.receiveShadow=!0,s.add(n),n}function Dr(s,t,e,i=.12){const n=new qt(new Gs(Ds,72),new pi({color:t,transparent:!0,opacity:i,depthWrite:!1}));n.rotation.x=-Math.PI/2,n.position.y=.004;const r=new qt(new kr(Ds-.12,Ds,96),new pi({color:e,transparent:!0,opacity:.8,depthWrite:!1}));r.rotation.x=-Math.PI/2,r.position.y=.006,s.add(n,r)}function Ws(s,t,e){const i=e.segs??28,n=e.thick??.3,r=2*Ns*Math.sin(Math.PI/i)+.02,a=typeof e.color=="number"?Ce(e.color):e.color,o=e.top!==void 0?Ce(e.top):null,l=e.posts!==void 0?Ce(e.posts):null;for(let c=0;c<i;c++){const h=c/i*_n,f=new fe;f.position.set(Math.cos(h)*Ns,0,Math.sin(h)*Ns),f.rotation.y=Math.PI/2-h,f.userData.radius=r/2+.3,ge(f,[r,e.h,n],a,[0,e.h/2,0],[0,0,0],!e.glass),o&&ge(f,[r+.02,.08,n+.12],o,[0,e.h+.04,0]),l&&ge(f,[.12,e.h+.2,.12],l,[r/2,(e.h+.2)/2,0]),s.add(f),t.push(f)}}function Fc(s,t,e,i,n=0){i.side=Je;const r=new qt(new kt(t,t,e,64,1,!0),i);return r.position.y=n+e/2,r.receiveShadow=!0,s.add(r),r}function to(s,t,e,i){const n=new Rt(120,32,16),r=new Bi({side:Je,depthWrite:!1,fog:!1,uniforms:{top:{value:new Kt(t)},bottom:{value:new Kt(e)},horizon:{value:new Kt(i??e)}},vertexShader:"varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",fragmentShader:`uniform vec3 top; uniform vec3 bottom; uniform vec3 horizon; varying vec3 vP;
      void main(){ float h = vP.y; vec3 c = h > 0.0 ? mix(horizon, top, pow(h, 0.6)) : mix(horizon, bottom, pow(-h, 0.5));
      gl_FragColor = vec4(c, 1.0); }`}),a=new qt(n,r);a.renderOrder=-10,s.add(a)}function T_(s,t,e,i=1){const n=t.length;if(!n)return()=>{};const r=new Ya(.22*i,.45*i,4,8),a=new Rt(.16*i,10,8),o=new za(r,Ce(16777215),n),l=new za(a,Ce(16777215),n),c=[15845285,15251604,14262908,13012579,9263675],h=new Kt,f=[];for(let p=0;p<n;p++)o.setColorAt(p,h.set(e[p%e.length])),l.setColorAt(p,h.set(c[p*7%c.length])),f.push(Math.random()*Math.PI*2);o.castShadow=!1,l.castShadow=!1,s.add(o,l);const u=new Oe,d=p=>{for(let x=0;x<n;x++){const[m,g,b]=t[x],A=Math.max(0,Math.sin(p*5+f[x]))*.08*i;u.position.set(m,g+.45*i+A,b),u.updateMatrix(),o.setMatrixAt(x,u.matrix),u.position.set(m,g+.98*i+A,b),u.updateMatrix(),l.setMatrixAt(x,u.matrix)}o.instanceMatrix.needsUpdate=!0,l.instanceMatrix.needsUpdate=!0};return d(0),d}class Xs{constructor(t,e,i=16,n=13){this.n=i;for(let r=0;r<i;r++){const a=(r+.5)/i*_n,o=new fe;o.position.set(Math.cos(a)*n,0,Math.sin(a)*n),o.userData.radius=0,t.add(o),e.push(o),this.groups.push(o)}}n;groups=[];at(t,e){let i=Math.atan2(e,t);return i<0&&(i+=_n),this.groups[Math.floor(i/_n*this.n)%this.n]}grow(t,e,i,n){t.userData.radius=Math.max(t.userData.radius,Math.hypot(e,i)+n)}adopt(t,e=1){for(const i of[...t.children]){const n=this.at(i.position.x,i.position.z);i.position.x-=n.position.x,i.position.z-=n.position.z,n.add(i),this.grow(n,i.position.x,i.position.z,e)}}instanced(t,e,i,n=!1){const r=new Map,a=new R;for(const o of i){a.setFromMatrixPosition(o);const l=this.at(a.x,a.z),c=o.clone();c.elements[12]-=l.position.x,c.elements[14]-=l.position.z,this.grow(l,c.elements[12],c.elements[14],.8);const h=r.get(l)??[];h.push(c),r.set(l,h)}for(const[o,l]of r){const c=new za(t,e,l.length);l.forEach((h,f)=>c.setMatrixAt(f,h)),c.castShadow=n,c.receiveShadow=!0,o.add(c)}}crowd(t,e,i=1){const n=new Map;for(const[a,o,l]of t){const c=this.at(a,l),h=a-c.position.x,f=l-c.position.z;this.grow(c,h,f,.6);const u=n.get(c)??[];u.push([h,o,f]),n.set(c,u)}const r=[...n].map(([a,o])=>T_(a,o,e,i));return a=>r.forEach(o=>o(a))}}function Ze(s,t,e,i=0,n=0){for(let r=0;r<s;r++){const a=r/s*_n;let o=Math.abs(a-i)%_n;o>Math.PI&&(o=_n-o),!(n>0&&o<n/2)&&e(Math.cos(a)*t,Math.sin(a)*t,a,r)}}function Nc(s,t,e,i,n=0){const r=new fe,a=new Ni({color:i,metalness:.7,roughness:.35}),o=(l,c,h=[0,0,0])=>{const f=new qt(l,a);f.position.set(...c),f.rotation.set(...h),f.castShadow=!0,r.add(f)};o(new wt(1.4,.3,.8),[0,.15,0]),o(new kt(.12,.16,3.2,10),[0,1.9,0]);for(let l=1;l<=3;l++){const c=l*.55;o(new He(c,.09,8,24,Math.PI),[0,3.4,0],[0,0,Math.PI]);for(const h of[-1,1])o(new kt(.09,.09,1.1+.05*l,8),[h*c,3.4+.55,0])}o(new kt(.09,.09,1.2,8),[0,4,0]);for(let l=-3;l<=3;l++)o(new kt(.13,.08,.14,8),[l*.55,4.6,0]);return r.position.set(...t),r.rotation.y=n,r.scale.setScalar(e),s.add(r),r}function A_(s,t,e){const i=new fe;for(let n=0;n<8;n++){const r=new qt(new kt(.13-n*.008,.15-n*.008,e/8,8),Ce(9071172));r.position.set(Math.sin(n*.25)*.15,(n+.5)*(e/8),0),r.castShadow=!0,i.add(r)}for(let n=0;n<7;n++){const r=new qt(new Rt(.9,8,6),Ce(3112242));r.scale.set(1.3,.12,.35);const a=n/7*Math.PI*2;r.position.set(Math.cos(a)*.8+.3,e+.05,Math.sin(a)*.8),r.rotation.set(0,-a,-.35),r.castShadow=!0,i.add(r)}i.position.set(...t),s.add(i)}function C_(s,t,e,i,n){const r=[];for(let a=0;a<i;a++){const o=a/(i-1),l=t[0]+(e[0]-t[0])*o,c=t[2]+(e[2]-t[2])*o,h=t[1]+(e[1]-t[1])*o-Math.sin(o*Math.PI)*.8,f=new qt(new Rt(.07,8,6),new pi({color:n[a%n.length]}));f.position.set(l,h,c),s.add(f),r.push(f)}return r}function P_(s,t,e,i,n){return Oi(256,512,(r,a,o)=>{r.fillStyle=n,r.fillRect(0,0,a,o);const l=a/s,c=o/t;for(let h=0;h<t;h++)for(let f=0;f<s;f++)r.fillStyle=Math.random()<.55?e:i,r.fillRect(f*l+3,h*c+3,l-6,c-6)})}const Rr=(s,t)=>Math.atan2(-s,-t);function R_(s){switch(s.kind){case"plenum":return L_();case"plaza":return k_();case"committee":return I_();case"beach":return D_();case"market":return U_();case"rooftop":return F_()}}function L_(){const s=new fe,t=[],e=Oi(256,256,(u,d,p)=>{u.fillStyle="#23407a",u.fillRect(0,0,d,p),u.strokeStyle="rgba(160,190,255,0.18)",u.lineWidth=3;for(let x=0;x<8;x++)u.beginPath(),u.moveTo(0,x*32+16),u.lineTo(d,x*32+16),u.stroke();Nn(u,d,p,3e3,.12)},[20,20]);Ir(s,e),Dr(s,10467583,13936722,.08),Ws(s,t,{h:1,color:7031342,top:9071172});const i=Oi(512,256,(u,d,p)=>{u.fillStyle="#d8c7a3",u.fillRect(0,0,d,p),u.strokeStyle="rgba(120,100,70,0.35)";for(let x=0;x<8;x++){const m=x%2*32;for(let g=-1;g<9;g++)u.strokeRect(g*64+m,x*32,64,32)}Nn(u,d,p,4e3,.1)},[14,3]);Fc(s,20,16,new Ni({map:i,roughness:.95}));const n=new Xs(s,t,16,13.5),r=[],a=[],o=[],l=new Oe;for(let u=0;u<4;u++){const d=11+u*1.6,p=u*.5;Ze(Math.round(_n*d/1.35),d,(x,m,g,b)=>{l.position.set(x,p+.45,m),l.rotation.set(0,Math.PI/2-g,0),l.updateMatrix(),r.push(l.matrix.clone()),l.position.set(x+Math.cos(g)*.7,p+.35,m+Math.sin(g)*.7),l.updateMatrix(),a.push(l.matrix.clone()),(b+u)%3!==0&&o.push([x+Math.cos(g)*.7,p+.1,m+Math.sin(g)*.7])},-Math.PI/2,.7)}n.instanced(new wt(1.1,.9,.55),Ce(8148532),r),n.instanced(new wt(.6,1,.5),Ce(2908088),a);const c=n.crowd(o,[1780298,2961206,1118742,3820126,15921906,5913893]);for(let u=1;u<4;u++){const d=11+u*1.6-.8,p=new qt(new kt(d,d,u*.5,72,1,!0),Ce(3877404));p.material.side=Je,p.position.y=u*.5/2,s.add(p);const x=new qt(new kr(d,d+1.6,72),Ce(2768750));x.rotation.x=-Math.PI/2,x.position.y=u*.5+.005,s.add(x)}const h=new fe;ge(h,[7,1.2,1.6],7031342,[0,.6,-12.5]),ge(h,[5.5,.9,1.2],8148532,[0,1.65,-13.6]),ge(h,[.9,1.4,.6],5913893,[0,1.3,-11.6]),n.adopt(h,2),Nc(s,[0,3,-19.3],.9,13936722);const f=[3895256,14263361,3115626,3895256,14263361,3115626];return Ze(6,19.6,(u,d,p,x)=>{const m=ge(s,[5,5.5,.1],Ce(f[x]),[u,6,d],[0,Rr(u,d),0],!1);m.castShadow=!1},-Math.PI/2,1.2),Ze(10,12,(u,d,p)=>{const x=new qt(new wt(5,.1,.4),new pi({color:16774358}));x.position.set(u,12,d),x.rotation.y=Math.PI/2-p,s.add(x)}),{group:s,occluders:t,update:u=>c(u),lighting:{background:1709072,fog:[1709072,24,60],hemiSky:16773336,hemiGround:2763332,hemiIntensity:1.1,key:16773590,keyIntensity:2.6,keyPos:[4,14,8],rim:7314431,rimIntensity:1.4}}}function k_(){const s=new fe,t=[];to(s,3112921,13624567,15266555);const e=Oi(256,256,(h,f,u)=>{h.fillStyle="#d9cdb4",h.fillRect(0,0,f,u),h.strokeStyle="rgba(110,95,70,0.35)",h.lineWidth=2;for(let d=0;d<=4;d++)h.beginPath(),h.moveTo(d*64,0),h.lineTo(d*64,u),h.stroke(),h.beginPath(),h.moveTo(0,d*64),h.lineTo(f,d*64),h.stroke();Nn(h,f,u,3e3,.1)},[30,30]);Ir(s,e,16777215,160),Dr(s,16777215,9075290,.1),Ws(s,t,{h:.85,color:13616040,top:15195330,segs:24});const i=Ce(6134586);Ze(4,17,(h,f)=>ge(s,[9,.1,9],i,[h,.05,f],[0,0,0],!1),Math.PI/4+.001);const n=new fe,r=Ce(15195330);ge(n,[34,1.2,8],r,[0,7.4,0]),ge(n,[32,6.8,6],Ce(3815994),[0,3.4,-.5]);for(let h=0;h<15;h++)ge(n,[1,6.8,1],r,[-14+h*2,3.4,3.2]);ge(n,[36,.6,9],Ce(13616040),[0,.3,0]),n.position.set(0,0,-32),s.add(n),Ze(18,38,(h,f,u)=>{const d=6+(Math.sin(u*7)+1)/2*9;ge(s,[7,d,7],Ce(14208176),[h,d/2,f],[0,Rr(h,f),0],!1)},-Math.PI/2,1.3);const a=new fe,o=new Xs(s,t,16,14);Nc(a,[13,0,-8],.9,723e4,Rr(13,-8)),Ze(8,12.5,(h,f,u)=>{const d=new fe;ge(d,[.08,7,.08],14540253,[0,3.5,0]);const p=new fe;ge(p,[1.6,1.1,.03],16777215,[.8,0,0],[0,0,0],!1),ge(p,[1.6,.16,.035],2052031,[.8,.38,0],[0,0,0],!1),ge(p,[1.6,.16,.035],2052031,[.8,-.38,0],[0,0,0],!1),p.position.y=6.3,d.add(p),d.position.set(h,0,f),d.rotation.y=Math.PI/2-u,a.add(d)},.2),Ze(9,16,(h,f)=>{const u=new fe;ge(u,[.3,2.2,.3],6967862,[0,1.1,0]);const d=new qt(new Rt(1.4,10,8),Ce(8362586));d.scale.set(1.2,.8,1.1),d.position.set(0,2.8,0),d.castShadow=!0,u.add(d),u.position.set(h,0,f),a.add(u)},.35),o.adopt(a,2);const l=[];Ze(56,10.6,(h,f,u,d)=>l.push([h+Math.cos(u)*(d%2)*.8,0,f+Math.sin(u)*(d%2)*.8]));const c=o.crowd(l,[2052031,16777215,14035001,2961206,15909198,3833156]);return{group:s,occluders:t,update:h=>c(h),lighting:{background:13624567,fog:[14412278,35,110],hemiSky:13625599,hemiGround:9075290,hemiIntensity:1.3,key:16774624,keyIntensity:3,keyPos:[-8,16,10],rim:16777215,rimIntensity:.6}}}function I_(){const s=new fe,t=[],e=Oi(256,256,(u,d,p)=>{u.fillStyle="#6a2c2c",u.fillRect(0,0,d,p),u.fillStyle="rgba(255,210,150,0.08)";for(let x=0;x<16;x++)for(let m=0;m<16;m++)(x+m)%2===0&&u.fillRect(x*16,m*16,16,16);Nn(u,d,p,2500,.12)},[20,20]);Ir(s,e),Dr(s,16765088,13936722,.06),Ws(s,t,{h:.9,color:4861724,top:6176037,thick:.9,segs:28});const i=Oi(256,256,(u,d,p)=>{u.fillStyle="#6b4a2e",u.fillRect(0,0,d,p);for(let x=0;x<16;x++)u.fillStyle=`rgba(40,20,10,${.08+Math.random()*.12})`,u.fillRect(x*16,0,2,p);Nn(u,d,p,2e3,.1)},[24,2]);Fc(s,17,12,new Ni({map:i,roughness:.8}));const n=new Xs(s,t,16,11),r=new fe,a=[],o=Ce(1710618),l=Ce(16053492),c=new Ni({color:10474495,transparent:!0,opacity:.6});Ze(26,10.6,(u,d,p)=>{ge(r,[.7,1.3,.6],o,[u,.65,d],[0,Math.PI/2-p,0]),a.push([u,.2,d]);const x=Math.cos(p)*(Ns-.1),m=Math.sin(p)*(Ns-.1);ge(r,[.25,.02,.3],l,[x,.95,m],[0,Math.PI/2-p,0],!1),ge(r,[.08,.2,.08],c,[x+Math.sin(p)*.3,1,m-Math.cos(p)*.3],[0,0,0],!1)}),n.adopt(r,1);const h=n.crowd(a,[1780298,2961206,1118742,5913893]),f=Oi(512,288,(u,d,p)=>{u.fillStyle="#0b1a2e",u.fillRect(0,0,d,p),u.fillStyle="#9fd3ff",u.font="bold 28px Arial",u.fillText("STATE BUDGET 2026",24,44);const x=["#ffd166","#ef476f","#06d6a0","#118ab2","#f78c6b"];for(let m=0;m<10;m++){const g=40+Math.random()*170;u.fillStyle=x[m%x.length],u.fillRect(30+m*46,p-20-g,32,g)}});return Ze(5,16.7,(u,d)=>{const p=Rr(u,d);ge(s,[5.4,3.2,.2],1118481,[u,5,d],[0,p,0],!1);const x=new qt(new Fi(5,2.8),new pi({map:f}));x.position.set(u*.992,5,d*.992),x.rotation.y=p,s.add(x)},-Math.PI/2,1),Nc(s,[0,4.2,-16.7],.55,13936722),{group:s,occluders:t,update:u=>h(u),lighting:{background:1313800,fog:[1313800,20,50],hemiSky:16769728,hemiGround:2759188,hemiIntensity:1,key:16770756,keyIntensity:2.5,keyPos:[3,12,7],rim:16756848,rimIntensity:1.2}}}function D_(){const s=new fe,t=[];to(s,3817359,3811914,16751194);const e=Oi(256,256,(d,p,x)=>{d.fillStyle="#e6c894",d.fillRect(0,0,p,x),Nn(d,p,x,6e3,.15)},[30,30]);Ir(s,e,16777215,160),Dr(s,16777215,11569232,.08),Ws(s,t,{h:.9,color:10516560,top:13279344,thick:.18,segs:28,posts:7031342});const i=new Fi(90,200,30,60),n=new qt(i,new Ni({color:2781086,roughness:.25,metalness:.3,flatShading:!0}));n.rotation.x=-Math.PI/2,n.position.set(-63,.05,0),s.add(n);const r=new qt(new Gs(6,32),new pi({color:16757594,fog:!1}));r.position.set(-110,7,-10),r.rotation.y=Math.PI/2,s.add(r);for(let d=0;d<22;d++){const p=5+Math.random()*16,x=-40+d*4;ge(s,[3+Math.random()*2,p,3],Ce(4868714),[34+d%3*5,p/2,x],[0,0,0],!1)}const a=new Xs(s,t,16,14),o=new fe;Ze(8,14.5,(d,p)=>A_(o,[d,0,p],6+Math.random()*2),Math.PI,1.2);const l=new fe;for(const d of[-1,1])for(const p of[-1,1])ge(l,[.15,3,.15],14540253,[d,1.5,p]);ge(l,[2.6,.2,2.6],15921906,[0,3.1,0]),ge(l,[2.4,1.6,2.4],14034984,[0,4,0]),ge(l,[2.8,.2,2.8],16777215,[0,4.9,0]),l.position.set(-13,0,-6),o.add(l),Ze(6,12,(d,p,x,m)=>{const g=new fe;ge(g,[.08,2.4,.08],15658734,[0,1.2,0]);const b=new qt(new ni(1.6,.6,12),Ce([16731501,3835647,16766474][m%3]));b.position.set(0,2.5,0),b.castShadow=!0,g.add(b),g.position.set(d,0,p),o.add(g)},.5),a.adopt(o,2.5);const c=[];Ze(40,11,(d,p,x,m)=>c.push([d+Math.cos(x)*(m%3)*.7,0,p+Math.sin(x)*(m%3)*.7]),Math.PI,1);const h=a.crowd(c,[16731501,3835647,16766474,448160,16053492,8599788]),f=i.getAttribute("position"),u=Float32Array.from(f.array);return{group:s,occluders:t,update:d=>{h(d);for(let p=0;p<f.count;p++){const x=u[p*3],m=u[p*3+1];f.setZ(p,Math.sin(m*.2+d*1.2)*.25+Math.cos(x*.3+d)*.2)}f.needsUpdate=!0},lighting:{background:16751194,fog:[14256746,40,140],hemiSky:16762266,hemiGround:6965866,hemiIntensity:1.2,key:16756848,keyIntensity:3,keyPos:[-10,9,6],rim:16735912,rimIntensity:1.2}}}function U_(){const s=new fe,t=[];to(s,658464,657930,1710650);const e=Oi(256,256,(u,d,p)=>{u.fillStyle="#6b6258",u.fillRect(0,0,d,p);for(let x=0;x<180;x++)u.fillStyle=`rgba(${150+Math.random()*40},${140+Math.random()*30},${120+Math.random()*30},0.9)`,u.beginPath(),u.ellipse(Math.random()*d,Math.random()*p,8+Math.random()*6,6+Math.random()*4,Math.random()*3,0,Math.PI*2),u.fill()},[22,22]);Ir(s,e),Dr(s,16765066,16756832,.07),Ws(s,t,{h:1,color:7031342,top:9071172,thick:.8,segs:24});const i=[15087942,16219904,16766474,5613104,10309341,16748459],n=new Xs(s,t,16,11.5),r=new fe;Ze(24,Ns,(u,d,p,x)=>{const m=new fe;for(let g=0;g<8;g++){const b=new qt(new Rt(.13,8,6),Ce(i[(x+g)%i.length]));b.position.set(-.6+g%4*.4,1.12+Math.floor(g/4)*.16,(Math.floor(g/4)-.5)*.3),m.add(b)}m.position.set(u,0,d),m.rotation.y=Math.PI/2-p,r.add(m)}),Ze(12,11.2,(u,d,p,x)=>{const m=new fe;ge(m,[.1,3.2,.1],3811866,[-1.6,1.6,0]),ge(m,[.1,3.2,.1],3811866,[1.6,1.6,0]);const g=ge(m,[3.8,.08,2.2],Ce(x%2?14034984:16053492),[0,3.1,-.3],[-.25,0,0]);g.castShadow=!1,m.position.set(u,0,d),m.rotation.y=Rr(u,d),r.add(m)}),n.adopt(r,2.5);const a=Oi(512,256,(u,d,p)=>{u.fillStyle="#8a7a64",u.fillRect(0,0,d,p),u.fillStyle="#2a2018";for(let x=0;x<4;x++)u.beginPath(),u.moveTo(x*128+24,p),u.lineTo(x*128+24,p*.45),u.arc(x*128+64,p*.45,40,Math.PI,0),u.lineTo(x*128+104,p),u.fill();Nn(u,d,p,3e3,.1)},[10,1]);Fc(s,17,8,new Ni({map:a,roughness:.95}));const o=[];Ze(6,14,(u,d)=>o.push(...C_(s,[u,5.6,d],[-u*.2,6.2,-d*.2],18,[16769162,16752474,16773568])));const l=new Zh(16756832,30,18,1.6);l.position.set(-5,5,-3);const c=new Zh(16756832,30,18,1.6);c.position.set(5,5,3),s.add(l,c);const h=[];Ze(40,12.3,(u,d,p,x)=>h.push([u+Math.cos(p)*(x%2)*.6,0,d+Math.sin(p)*(x%2)*.6]));const f=n.crowd(h,[2961206,6966419,1671876,9095462,16734558,16763450]);return{group:s,occluders:t,update:u=>{f(u),o.forEach((d,p)=>d.material.color.setHSL(.1,1,.55+.15*Math.sin(u*3+p)))},lighting:{background:658464,fog:[921114,20,55],hemiSky:5925536,hemiGround:2759184,hemiIntensity:.8,key:16766112,keyIntensity:2.2,keyPos:[5,12,8],rim:8031487,rimIntensity:1.5}}}function F_(){const s=new fe,t=[];to(s,329231,329231,1905984);const e=Oi(1024,1024,(E,M,T)=>{E.fillStyle="#50535a",E.fillRect(0,0,M,T),Nn(E,M,T,16e3,.12),E.strokeStyle="rgba(255,215,0,0.9)",E.lineWidth=14,E.beginPath(),E.arc(M/2,T/2,250,0,Math.PI*2),E.stroke(),E.fillStyle="rgba(255,255,255,0.85)",E.font="bold 300px Arial",E.textAlign="center",E.textBaseline="middle",E.fillText("H",M/2,T/2+14)}),i=new qt(new Gs(12,72),new Ni({map:e,roughness:.9}));i.rotation.x=-Math.PI/2,i.receiveShadow=!0,s.add(i);const n=new qt(new kt(12,12,1.2,72,1,!0),Ce(3816772));n.position.y=-.6,s.add(n);const r=new Ni({color:10471679,transparent:!0,opacity:.22,roughness:.1,metalness:.2});Ws(s,t,{h:1.1,color:r,top:12303291,thick:.06,segs:28,posts:10066329,glass:!0});const a=P_(8,40,"#ffe7a8","#1b2340","#2b3450"),o=new Ni({map:a,emissive:16777215,emissiveMap:a,emissiveIntensity:.6,roughness:.4}),l=new qt(new kt(4,4,40,32),o);l.position.set(-18,-8,-28);const c=new qt(new kt(4.6,4.6,36,3),o);c.position.set(20,-10,-24);const h=new qt(new wt(7,34,7),o);h.position.set(2,-12,-40),s.add(l,c,h),Ze(14,46,(E,M,T)=>{const v=20+(Math.sin(T*5)+1)/2*24,w=new qt(new wt(6,v,6),o);w.position.set(E,-30+v/2,M),w.rotation.y=T,s.add(w)},-Math.PI/2,1.4);const f=2e3,u=new Be,d=new Float32Array(f*3),p=new Float32Array(f*3),x=new Kt;for(let E=0;E<f;E++){const M=Math.random()*_n,T=25+Math.random()*110;d[E*3]=Math.cos(M)*T,d[E*3+1]=-28-Math.random()*3,d[E*3+2]=Math.sin(M)*T,x.setHSL(.08+Math.random()*.1,.9,.5+Math.random()*.3),p.set([x.r,x.g,x.b],E*3)}u.setAttribute("position",new xi(d,3)),u.setAttribute("color",new xi(p,3)),s.add(new Fh(u,new Ql({size:.5,vertexColors:!0,fog:!1})));const m=new Be,g=new Float32Array(600*3);for(let E=0;E<600;E++){const M=Math.random()*Math.PI*2,T=Math.random()*Math.PI*.45;g.set([Math.cos(M)*Math.sin(T)*110,Math.cos(T)*110,Math.sin(M)*Math.sin(T)*110],E*3)}m.setAttribute("position",new xi(g,3)),s.add(new Fh(m,new Ql({size:.35,color:16777215,fog:!1})));const b=new Xs(s,t,12,10.8),A=new fe;ge(A,[2,1.2,1.4],9080729,[-7.6,.6,-7.6],[0,Math.PI/4,0]),ge(A,[2,1.2,1.4],9080729,[8,.6,7.2],[0,-Math.PI/4,0]),ge(A,[.15,6,.15],7829367,[7.8,3,-7.8]),b.adopt(A,1.5);const y=new qt(new Rt(.15,8,6),xe(16720452,1));return y.position.set(7.8,6.1,-7.8),s.add(y),{group:s,occluders:t,update:E=>{y.visible=Math.sin(E*4)>0},lighting:{background:329231,fog:[723742,40,160],hemiSky:6320320,hemiGround:2103344,hemiIntensity:.9,key:13161727,keyIntensity:2.4,keyPos:[6,14,9],rim:16732067,rimIntensity:2}}}function ku(s){s.group.traverse(t=>{const e=t;e.geometry&&e.geometry.dispose();const i=e.material;Array.isArray(i)?i.forEach(n=>n.dispose()):i&&(i.map?.dispose(),i.dispose())})}const N_={netanyahu:"Benjamin Netanyahu",levin:"Yariv Levin","israel-katz":"Israel Katz",ohana:"Amir Ohana",regev:"Miri Regev",amsalem:"David Amsalem",barkat:"Nir Barkat",gotliv:"Tally Gotliv",karhi:"Shlomo Karhi","may-golan":"May Golan",edelstein:"Yuli Edelstein",saar:"Gideon Sa'ar",dichter:"Avi Dichter",silman:"Idit Silman","ofir-katz":"Ofir Katz",kisch:"Yoav Kisch",lapid:"Yair Lapid","ben-ari":"Meirav Ben-Ari",gantz:"Benny Gantz",eisenkot:"Gadi Eisenkot",tropper:"Hili Tropper","tamano-shata":"Pnina Tamano-Shata",deri:"Aryeh Deri",malchieli:"Michael Malchieli",gafni:"Moshe Gafni",goldknopf:"Yitzhak Goldknopf",smotrich:"Bezalel Smotrich",rothman:"Simcha Rothman",strook:"Orit Strook","ben-gvir":"Itamar Ben-Gvir",fogel:"Zvika Fogel",maoz:"Avi Maoz",lieberman:"Avigdor Lieberman",forer:"Oded Forer","mansour-abbas":"Mansour Abbas",odeh:"Ayman Odeh",tibi:"Ahmad Tibi","touma-sliman":"Aida Touma-Suleiman",kariv:"Gilad Kariv",lazimi:"Naama Lazimi"},lf=s=>`https://${s}/w/api.php`;function O_(s,t,e=640){const i=new URLSearchParams({action:"query",format:"json",formatversion:"2",origin:"*",prop:"pageimages",piprop:"thumbnail|name",pithumbsize:String(e),pilicense:"free",redirects:"1",titles:t.join("|")});return`${lf(s)}?${i}`}function B_(s,t){const e=s.query??{},i=new Map((e.normalized??[]).map(o=>[o.from,o.to])),n=new Map((e.redirects??[]).map(o=>[o.from,o.to])),r=new Map((e.pages??[]).map(o=>[o.title,o])),a={};for(const o of t){let l=i.get(o)??o;for(let h=0;h<3&&n.has(l);h++)l=n.get(l);const c=r.get(l);c&&!c.missing&&c.pageimage&&c.thumbnail?.source&&(a[o]={file:c.pageimage,thumb:c.thumbnail.source,width:c.thumbnail.width,height:c.thumbnail.height,pageTitle:c.title})}return a}function z_(s,t){const e=new URLSearchParams({action:"query",format:"json",formatversion:"2",origin:"*",prop:"imageinfo",iiprop:"extmetadata|url",iiextmetadatafilter:"LicenseShortName|LicenseUrl|Artist|Credit",titles:t.map(i=>`File:${i}`).join("|")});return`${lf(s)}?${e}`}function tl(s){return s.replace(/<[^>]*>/g," ").replace(/&nbsp;/g," ").replace(/&amp;/g,"&").replace(/&quot;/g,'"').replace(/&#0?39;/g,"'").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/\s+/g," ").trim()}function H_(s){const t={};for(const e of s.query?.pages??[]){const i=e.imageinfo?.[0];if(!i)continue;const n=i.extmetadata??{},r=e.title.replace(/^File:/,"").replace(/ /g,"_");t[r]={license:tl(n.LicenseShortName?.value??""),licenseUrl:tl(n.LicenseUrl?.value??""),artist:tl(n.Artist?.value??n.Credit?.value??"Unknown"),descUrl:i.descriptionurl??""}}return t}function Iu(s){return s.replace(/^File:/,"").replace(/ /g,"_")}function G_(s){const t=s.toLowerCase();return!t||t.includes("nc")||t.includes("nd")||t.includes("fair use")||t.includes("non-free")?!1:t.includes("cc0")||t.includes("public domain")||t.startsWith("pd")||t.includes("cc by")||t.includes("cc-by")||t.includes("attribution")||t.includes("gfdl")}function V_(s,t,e){const i=Math.max(s.height*e,s.width*t*1.1),n=i*1.95/e;return{cx:s.xCenter,cy:s.yCenter-i*.2/e,h:n}}function W_(s,t){const e=s/t;return e<.95?{cx:.5,cy:.32,h:Math.min(.62,.55/e*.8)}:e>1.3?{cx:.5,cy:.36,h:.62}:{cx:.5,cy:.36,h:.64}}function cf(s,t,e){const i=s.h*e,n=i*.8;return{x:s.cx*t-n/2,y:s.cy*e-i/2,w:n,h:i}}function X_(s,t,e){const i=s.h*e*1.35;return{x:s.cx*t-i/2,y:s.cy*e-i*.42,s:i}}const q_="0.4.1646425229",Du=`https://cdn.jsdelivr.net/npm/@mediapipe/face_detection@${q_}/`;let el=null,lc=null,cc="",Uu=Promise.resolve();function K_(s,t){return new Promise((e,i)=>{const n=document.createElement("script");n.src=s,n.crossOrigin="anonymous";const r=setTimeout(()=>i(new Error("timeout")),t);n.onload=()=>{clearTimeout(r),e()},n.onerror=()=>{clearTimeout(r),i(new Error("load failed"))},document.head.appendChild(n)})}function hf(s,t){return Promise.race([s,new Promise((e,i)=>setTimeout(()=>i(new Error("timeout")),t))])}async function $_(){return el||(el=(async()=>{try{const s=window;if(s.FaceDetection||await K_(`${Du}face_detection.js`,15e3),!s.FaceDetection)return null;const t=new s.FaceDetection({locateFile:e=>`${Du}${e}`});return t.onResults(e=>{const i=lc;lc=null,i?.(e)}),t.setOptions({model:"full",minDetectionConfidence:.4}),cc="full",await hf(t.initialize(),25e3),t}catch(s){return console.warn("Face detector unavailable, using heuristic crops.",s),null}})()),el}async function Y_(s,t,e){return cc!==e&&(s.setOptions({model:e,minDetectionConfidence:.45}),cc=e),(await hf(new Promise(n=>{lc=n,s.send({image:t}).catch(()=>n({detections:[]}))}),8e3)).detections??[]}function Z_(s,t){for(const[e,i]of Object.entries(s))if(!(e==="boundingBox"||e==="landmarks"||!Array.isArray(i)||!i.length)){for(const[n,r]of Object.entries(i[0]))if(n!=="index"&&typeof r=="number"&&r>0&&r<=1)return r}return 1-t*.01}function J_(s){let t=null;return s.forEach((e,i)=>{const n=e.boundingBox,r=Z_(e,i);(!t||r>t.score)&&(t={xCenter:n.xCenter,yCenter:n.yCenter,width:n.width,height:n.height,score:r})}),t}function j_(s){const t=Uu.then(async()=>{const e=await $_();if(!e)return null;try{return J_(await Y_(e,s,"full"))}catch{return null}});return Uu=t.catch(()=>null),t}const mi=256,Ln=320,_i=new Map,Oc=new Map;let Va="photo",as=0;function Bc(s,t){try{const e=localStorage.getItem(s);return e?JSON.parse(e):t}catch{return t}}function qs(s,t){try{localStorage.setItem(s,JSON.stringify(t))}catch{}}const _r=new Set(Bc("skf.faceDisabled",[])),Mn=Bc("skf.faceCrops",{}),il=Bc("skf.faceAutoCrops",{});function Q_(s){Va!==s&&(Va=s,as++)}function ty(){return Va}function uf(s){if(!(Va!=="photo"||_r.has(s)))return _i.get(s)}function Ls(s){return _i.get(s)}function ey(s){const t=uf(s);return t?(t.texture||(t.texture=new Cc(t.head),t.texture.colorSpace=je,t.texture.anisotropy=4),t.texture):null}function iy(s){return uf(s)?.portrait}function nl(s){return _r.has(s)}function df(s,t){t?_r.add(s):_r.delete(s),qs("skf.faceDisabled",[..._r]),as++}function ny(){return _i.size}function sy(){return[..._i.values()].filter(s=>s.source.kind==="wiki").map(s=>({id:s.id,source:s.source}))}function ry(s,t=15e3){return new Promise((e,i)=>{const n=new Image;n.crossOrigin="anonymous",n.decoding="async";const r=setTimeout(()=>i(new Error("timeout")),t);n.onload=()=>{clearTimeout(r),e(n)},n.onerror=()=>{clearTimeout(r),i(new Error(`failed to load ${s}`))},n.src=s})}function ay(s,t=900){const e=Math.min(1,t/Math.max(s.naturalWidth,s.naturalHeight)),i=document.createElement("canvas");return i.width=Math.max(1,Math.round(s.naturalWidth*e)),i.height=Math.max(1,Math.round(s.naturalHeight*e)),i.getContext("2d").drawImage(s,0,0,i.width,i.height),i}async function Fu(s,t=12e3){const e=new AbortController,i=setTimeout(()=>e.abort(),t);try{const n=await fetch(s,{signal:e.signal});if(!n.ok)throw new Error(`HTTP ${n.status}`);return await n.json()}finally{clearTimeout(i)}}function oy(s){const e=s.getContext("2d").getImageData(0,0,s.width,1).data;let i=0,n=0,r=0;const a=e.length/4;for(let o=0;o<e.length;o+=4)i+=e[o],n+=e[o+1],r+=e[o+2];return`rgb(${Math.round(i/a)},${Math.round(n/a)},${Math.round(r/a)})`}function zc(s,t){const e=s.image,i=e.width,n=e.height,r=oy(e),a=s.head;a.width=mi,a.height=Ln;const o=a.getContext("2d");o.save(),o.clearRect(0,0,mi,Ln),o.fillStyle=r,o.fillRect(0,0,mi,Ln);const l=cf(s.crop,i,n);o.drawImage(e,l.x,l.y,l.w,l.h,0,0,mi,Ln),o.globalCompositeOperation="destination-in",o.translate(mi/2,Ln/2),o.scale(1,Ln/mi);const c=o.createRadialGradient(0,0,mi*.38,0,0,mi*.5);c.addColorStop(0,"rgba(0,0,0,1)"),c.addColorStop(.82,"rgba(0,0,0,1)"),c.addColorStop(1,"rgba(0,0,0,0)"),o.fillStyle=c,o.fillRect(-mi/2,-mi/2,mi,mi),o.restore(),o.save(),o.translate(mi/2,Ln/2),o.beginPath(),o.ellipse(0,0,mi*.465,Ln*.465,0,0,Math.PI*2),o.lineWidth=6,o.strokeStyle="rgba(7,8,12,0.9)",o.stroke(),o.restore();const h=192,f=document.createElement("canvas");f.width=h,f.height=h;const u=f.getContext("2d");u.fillStyle=t?`#${Fn[t.party].color.toString(16).padStart(6,"0")}`:r,u.fillRect(0,0,h,h);const d=X_(s.crop,i,n);u.drawImage(e,d.x,d.y,d.s,d.s,0,0,h,h),s.portrait=f.toDataURL("image/jpeg",.88),s.texture&&(s.texture.needsUpdate=!0)}async function ly(s,t){const e=il[t];if(e)return{crop:{cx:e.cx,cy:e.cy,h:e.h},detected:e.detected};const i=await j_(s),n=i?{crop:V_(i,s.width,s.height),detected:!0}:{crop:W_(s.width,s.height),detected:!1};return i&&(il[t]={...n.crop,detected:!0},qs("skf.faceAutoCrops",il)),n}async function Wa(s,t,e){const i=await ry(e),n=ay(i);n.getContext("2d").getImageData(0,0,1,1);const{crop:r,detected:a}=await ly(n,t.url),o=Mn[s.id],l=o&&o.url===t.url?{cx:o.cx,cy:o.cy,h:o.h}:r,c={id:s.id,image:n,source:t,crop:l,auto:r,detected:a,head:document.createElement("canvas"),portrait:"",texture:null};return zc(c,s),c}function ff(){return new Promise((s,t)=>{const e=indexedDB.open("skf-faces",1);e.onupgradeneeded=()=>e.result.createObjectStore("uploads"),e.onsuccess=()=>s(e.result),e.onerror=()=>t(e.error)})}async function cy(){const s=await ff();return new Promise((t,e)=>{const i={},r=s.transaction("uploads","readonly").objectStore("uploads").openCursor();r.onsuccess=()=>{const a=r.result;a?(i[String(a.key)]=a.value,a.continue()):t(i)},r.onerror=()=>e(r.error)})}async function pf(s,t){const e=await ff();return new Promise((i,n)=>{const r=e.transaction("uploads","readwrite"),a=r.objectStore("uploads");t?a.put(t,s):a.delete(s),r.oncomplete=()=>i(),r.onerror=()=>n(r.error)})}async function hy(s){const t=new Map,e=[{host:"en.wikipedia.org",title:n=>N_[n.id]??n.name},{host:"he.wikipedia.org",title:n=>n.nameHe}];for(const{host:n,title:r}of e){const a=s.filter(o=>!t.has(o.id));if(a.length)for(let o=0;o<a.length;o+=45){const l=a.slice(o,o+45),c=l.map(r);try{const h=B_(await Fu(O_(n,c)),c);l.forEach((f,u)=>{const d=h[c[u]];d&&t.set(f.id,{...d,host:n})})}catch(h){console.warn(`Wikipedia lookup failed on ${n}`,h)}}}const i=new Map;for(const n of["en.wikipedia.org","he.wikipedia.org"]){const r=[...new Set([...t.values()].filter(a=>a.host===n).map(a=>a.file))];for(let a=0;a<r.length;a+=45)try{const o=H_(await Fu(z_(n,r.slice(a,a+45))));for(const[l,c]of Object.entries(o))i.set(`${n}:${l}`,c)}catch(o){console.warn("Licence lookup failed",o)}}for(const n of s){const r=t.get(n.id);if(!r)continue;const a=i.get(`${r.host}:${Iu(r.file)}`);a&&a.license&&!G_(a.license)||Oc.set(n.id,{kind:"wiki",url:r.thumb,file:r.file,license:a?.license||"Free licence (see file page)",licenseUrl:a?.licenseUrl,artist:a?.artist||"Wikimedia Commons contributor",descUrl:a?.descUrl||`https://${r.host}/wiki/File:${encodeURIComponent(Iu(r.file))}`,pageUrl:`https://${r.host}/wiki/${encodeURIComponent(r.pageTitle.replace(/ /g,"_"))}`})}}async function mf(s,t){const e=s.length;let i=0,n={};try{n=await cy()}catch{}try{await hy(s)}catch(o){console.warn("Photo lookup failed; using cartoon faces.",o)}const r=[...s],a=async()=>{for(;;){const o=r.shift();if(!o)return;try{const l=n[o.id];if(l){const c=URL.createObjectURL(l);_i.set(o.id,await Wa(o,{kind:"upload",url:`upload:${o.id}`},c))}else{const c=Oc.get(o.id);c&&_i.set(o.id,await Wa(o,c,c.url))}}catch(l){console.warn(`No photo face for ${o.id}`,l)}i++,t?.(i,e)}};return await Promise.all([a(),a(),a(),a()]),as++,_i.size}function sl(s,t){const e=_i.get(s.id);e&&(e.crop={cx:t.cx,cy:t.cy,h:Math.max(.05,Math.min(3,t.h))},Mn[s.id]={...e.crop,url:e.source.url},qs("skf.faceCrops",Mn),zc(e,s),as++)}function uy(s){const t=_i.get(s.id);t&&(delete Mn[s.id],qs("skf.faceCrops",Mn),t.crop={...t.auto},zc(t,s),as++)}async function dy(s,t){try{await pf(s.id,t).catch(()=>{});const e=URL.createObjectURL(t);delete Mn[s.id],qs("skf.faceCrops",Mn);const i=await Wa(s,{kind:"upload",url:`upload:${s.id}:${Date.now()}`},e),n=_i.get(s.id);return n?.texture&&(i.texture=n.texture,i.texture.image=i.head,i.texture.needsUpdate=!0),_i.set(s.id,i),df(s.id,!1),as++,!0}catch(e){return console.warn("Upload failed",e),!1}}async function fy(s){await pf(s.id,null).catch(()=>{}),delete Mn[s.id],qs("skf.faceCrops",Mn);const t=Oc.get(s.id),e=_i.get(s.id);if(_i.delete(s.id),t)try{const i=await Wa(s,t,t.url);e?.texture&&(i.texture=e.texture,i.texture.image=i.head,i.texture.needsUpdate=!0),_i.set(s.id,i)}catch{}as++}const Nu=Math.PI/2-.32,py=new Set(["cast","grab","charge","whip","beam","counterStance","place","uppercut","summon","stomp","flurry","slamRise"]),hc=16722458,Xa=13154458,uc=s=>Math.PI/2-s;class rl{rig;anim=new of;shield;stars;prop=null;propStyle=null;whip;auraTimer=0;prevState="";constructor(t){this.rig=ef(t,{face:ey(t.id)}),this.shield=new qt(new Rt(1.05,24,16),xe(10474495,.22)),this.shield.position.y=.95,this.shield.visible=!1,this.rig.root.add(this.shield),this.stars=new fe;for(let e=0;e<3;e++){const i=Ga("star",16766474);i.scale.setScalar(.35),this.stars.add(i)}this.stars.visible=!1,this.rig.root.add(this.stars),this.whip=new qt(new kt(.018,.018,1,6),new pi({color:3811866})),this.whip.visible=!1,this.rig.root.add(this.whip)}syncFace(t,e,i){const n=this.rig.faceSprite;if(!n)return;const r=n.material;r.rotation=-this.anim.pivotX*e+this.anim.headRoll*.6*e+i,r.color.setRGB(1,1-t*.45,1-t*.5)}setProp(t,e){this.propStyle!==t&&(this.prop&&(this.rig.rHand.remove(this.prop),this.prop=null),this.propStyle=t,t&&(this.prop=Ga(t,e),this.prop.scale.setScalar(.7),this.prop.position.set(0,-.12,.05),this.prop.rotation.set(Math.PI/2,0,Math.PI/2),this.rig.rHand.add(this.prop)))}sync(t,e,i,n){const r=this.rig.root;this.anim.update(t,e,i),this.anim.apply(this.rig),r.visible=!this.anim.hidden;let a=t.x,o=t.z;t.flash>0&&e.hitstop>0&&(a+=(Math.random()-.5)*.08,o+=(Math.random()-.5)*.08),r.position.set(a,t.y,o),r.rotation.y=uc(t.yaw);const l=t.flash>0?Math.min(1,t.flash/5)*.7:0,c=t.buffs.find(m=>m.kind!=="shield"&&m.kind!=="reflect"&&m.kind!=="slow"),h=e.ticks/60;for(const m of this.rig.materials)l>0?m.emissive.setRGB(l*.5,l*.42,l*.34):c?m.emissive.setHex(c.color).multiplyScalar(.18+.1*Math.sin(h*8)):t.inRage?m.emissive.setRGB(.16+.08*Math.sin(h*7),.01,0):t.lifelineUsed&&t.health<=1?m.emissive.setRGB(.3+.2*Math.sin(h*10),0,0):m.emissive.setRGB(0,0,0);const f=e.screenRight,u=t.dirX*f.x+t.dirZ*f.z;if(this.syncFace(l,u,t.state==="hitstun"||t.state==="cinematic"?Math.sin(h*40)*.15:0),n){const m=c?.color??(t.state==="attack"&&t.move?.kind==="super"?t.move.color??16765440:t.inRage?hc:t.meter>=100?16765440:null);if(m!==null){this.auraTimer+=i*60;const g=c||t.move?.kind==="super"?2:t.inRage?3:6;for(;this.auraTimer>=g;)this.auraTimer-=g,n.burst(t.x+(Math.random()-.5)*.7,t.y+.1+Math.random()*1.2,t.z+(Math.random()-.5)*.7,m,1,.01,.035,-.0015,34)}t.state!==this.prevState&&t.grounded&&(t.state==="dash"||t.state==="backdash"||t.state==="sidestep"||t.state==="techroll")&&n.burst(t.x,.06,t.z,Xa,8,.035,.05,.001,22),t.state==="run"&&t.stateFrame%8===0&&n.burst(t.x,.05,t.z,Xa,3,.025,.045,.001,18)}this.prevState=t.state;const d=t.buff("shield")??t.buff("reflect");if(this.shield.visible=!!d,d&&(this.shield.material.color.setHex(d.color),this.shield.material.opacity=.15+.08*Math.sin(h*6)),this.stars.visible=t.state==="dizzy",this.stars.visible){const m=t.crumpled?1.35:1.95;this.stars.children.forEach((g,b)=>{const A=h*4+b*Math.PI*2/3;g.position.set(Math.cos(A)*.35,m,Math.sin(A)*.35),g.rotation.y=A})}const p=t.move;if(t.state==="cinematic"&&e.cinematic?.att===t&&e.cinematic?.prop?this.setProp(e.cinematic.prop,e.cinematic.color):t.state==="attack"&&p?.prop&&py.has(p.anim)&&p.tag!=="projectile"&&p.tag!=="rain"?this.setProp(p.prop,p.color??16777215):this.setProp(null,0),this.whip.visible=!1,t.state==="attack"&&p?.tag==="pull"){const m=t.moveFrame;m>p.startup-2&&m<=p.startup+p.active+4&&(this.whip.visible=!0,this.whip.scale.set(1,3,1),this.whip.position.set(0,1.25,3/2+.4),this.whip.rotation.set(Math.PI/2,0,0),this.whip.material.color.setHex(p.color??3811866))}}dispose(){nf(this.rig)}}const my=new Set(["plane","jet","train","tank","fire","syringe","envelope"]);class gy{obj;glow=null;beam=null;core=null;constructor(t){if(this.obj=new fe,t.kind==="beam"||t.kind==="mega"&&t.attach){const e=t.h/2;if(this.beam=new qt(new kt(e,e,1,20,1,!0),xe(t.color,.55)),this.beam.rotation.z=Math.PI/2,this.core=new qt(new kt(e*.45,e*.45,1,12,1,!0),xe(16777215,.9)),this.core.rotation.z=Math.PI/2,this.obj.add(this.beam,this.core),t.prop&&t.prop!=="wave"&&t.prop!=="sound"){const i=Ga(t.prop,t.color);i.scale.setScalar(1.2),i.userData.src=!0,this.obj.add(i)}}else{const e=Ga(t.prop,t.color);e.scale.setScalar(t.scale*(t.kind==="wave"||t.kind==="trap"?1.3:1.2)),this.obj.add(e),this.glow=new qt(new Rt(.32*t.scale,14,10),xe(t.color,.25)),this.obj.add(this.glow)}}sync(t,e){if(this.obj.position.set(t.x,t.y,t.z),this.obj.rotation.y=-Math.atan2(t.dirZ,t.dirX),this.beam&&this.core){const n=t.w,r=1+.12*Math.sin(e*40);this.beam.scale.set(r,n,r),this.core.scale.set(1,n,1),this.obj.children.forEach(a=>{a.userData.src&&a.position.set(-(n/2-.1),0,0)});return}this.obj.visible=t.age>=t.delay||Math.floor(t.age/4)%2===0;const i=this.obj.children[0];t.kind==="normal"||t.kind==="rain"||t.kind==="mega"?(i.rotation.z=my.has(t.prop)?0:-t.age*t.spin,(t.prop==="coin"||t.prop==="shekel")&&(i.rotation.y=t.age*.3)):t.kind==="trap"&&(i.position.y=-.25+Math.sin(e*3)*.03),this.glow&&this.glow.scale.setScalar(1+.15*Math.sin(e*20))}}const Ou=(s,t,e)=>Math.max(t,Math.min(e,s));class vy{renderer;scene=new bd;camera=new vi(38,16/9,.1,400);effects=new E_;hemi=new zd(16777215,4473924,1);key=new Ha(16777215,2.5);rim=new Ha(8956671,1.2);stage=null;stageId="";views=[];projViews=new Map;showcase=[];camPos=new R(0,1.8,8);camLook=new R(0,1.1,0);shake=0;superFocus=null;time=0;showHitboxes=!1;hitboxGroup=new fe;platform;constructor(t){this.renderer=new Jd({canvas:t,antialias:!0,powerPreference:"high-performance"}),this.renderer.setPixelRatio(Math.min(2,window.devicePixelRatio||1)),this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=fr,this.renderer.toneMapping=Ka,this.renderer.toneMappingExposure=1,this.renderer.outputColorSpace=je,this.key.castShadow=!0,this.key.shadow.mapSize.set(2048,2048);const e=this.key.shadow.camera;e.left=-12,e.right=12,e.top=12,e.bottom=-12,e.near=1,e.far=60,this.key.shadow.bias=-5e-4,this.key.shadow.normalBias=.02,this.scene.add(this.hemi,this.key,this.key.target,this.rim,this.effects.group,this.hitboxGroup),this.platform=new qt(new kt(1.6,1.8,.2,40),new Ni({color:1778496,metalness:.4,roughness:.4})),this.platform.visible=!1,this.scene.add(this.platform),this.resize()}setQuality(t){const e=t==="low";this.renderer.setPixelRatio(e?1:Math.min(2,window.devicePixelRatio||1)),this.renderer.shadowMap.enabled=!e,this.key.castShadow=!e,this.scene.traverse(i=>{const n=i.material;n&&(n.needsUpdate=!0)}),this.resize()}resize(){const t=this.renderer.domElement,e=t.clientWidth||window.innerWidth,i=t.clientHeight||window.innerHeight;this.renderer.setSize(e,i,!1),this.camera.aspect=e/i,this.camera.updateProjectionMatrix()}setStage(t){if(this.stageId===t.id&&this.stage)return;this.stage&&(this.scene.remove(this.stage.group),ku(this.stage)),this.stage=R_(t),this.stageId=t.id,this.scene.add(this.stage.group);const e=this.stage.lighting;this.scene.background=new Kt(e.background),this.scene.fog=new Ec(e.fog[0],e.fog[1],e.fog[2]),this.hemi.color.setHex(e.hemiSky),this.hemi.groundColor.setHex(e.hemiGround),this.hemi.intensity=e.hemiIntensity,this.key.color.setHex(e.key),this.key.intensity=e.keyIntensity,this.key.position.set(...e.keyPos),this.rim.color.setHex(e.rim),this.rim.intensity=e.rimIntensity,this.rim.position.set(-4,6,-10)}clearStage(){this.stage&&(this.scene.remove(this.stage.group),ku(this.stage),this.stage=null,this.stageId=""),this.scene.background=new Kt(329485),this.scene.fog=null,this.hemi.color.setHex(14542591),this.hemi.groundColor.setHex(2236979),this.hemi.intensity=1.2,this.key.color.setHex(16777215),this.key.intensity=2.8,this.key.position.set(3,8,8),this.rim.color.setHex(7310335),this.rim.intensity=2.2,this.rim.position.set(-4,5,-6)}setFighters(t){for(const e of this.views)this.scene.remove(e.rig.root),e.dispose();this.views=t.map(e=>{const i=new rl(e);return this.scene.add(i.rig.root),i});for(const e of this.projViews.values())this.scene.remove(e.obj);this.projViews.clear(),this.effects.clear(),this.superFocus=null}clearFighters(){this.setFighters([])}handleEvent(t,e){const i=this.effects;switch(t.t){case"hit":i.hitSpark(t.x,t.y,t.z,t.spark,t.blocked,t.color),!t.blocked&&(t.spark==="heavy"||t.spark==="super"||t.counter)&&(this.shake=Math.max(this.shake,t.spark==="super"?.18:.08));break;case"superFlash":{const n=e.fighters[t.fighter];this.superFocus={fighter:t.fighter,frames:48},i.ring(n.x,1.1,n.z,t.color,.3,3.5,30),i.burst(n.x,1.2,n.z,t.color,50,.14,.07,.001,40);break}case"special":{const n=e.fighters[t.fighter];i.burst(n.x,1,n.z,t.color,10,.05,.04,.001,18);break}case"teleport":i.burst(t.fromX,1,t.fromZ,t.color,30,.09,.06,0,26),i.burst(t.toX,1,t.toZ,t.color,30,.09,.06,0,26),i.ring(t.toX,1,t.toZ,t.color,.2,1.6,16);break;case"buff":{const n=e.fighters[t.fighter];i.ring(n.x,.05,n.z,t.color,.3,2.2,24,!0),i.burst(n.x,.8,n.z,t.color,26,.07,.05,-.002,36);break}case"clash":i.burst(t.x,t.y,t.z,16777215,24,.1,.05,.002,20),i.ring(t.x,t.y,t.z,16777215,.2,1.2,14);break;case"tech":i.ring(t.x,t.y,t.z,16777215,.2,1.4,14),i.burst(t.x,t.y,t.z,11195647,20,.09,.05,.001,16);break;case"wallsplat":{const n=e.fighters[t.fighter],r=Math.hypot(n.x,n.z)||1,a=n.x/r*(r+.35),o=n.z/r*(r+.35);i.burst(a,1.1,o,15260868,34,.1,.07,.004,34),i.flash(a,1.1,o,16777215,.8,8),this.shake=Math.max(this.shake,.16);break}case"techroll":{const n=e.fighters[t.fighter];i.burst(n.x,.08,n.z,Xa,12,.05,.05,.001,22);break}case"rage":{const n=e.fighters[t.fighter];i.ring(n.x,.05,n.z,hc,.3,2.6,30,!0),i.burst(n.x,1,n.z,hc,40,.1,.06,-.001,40);break}case"lifeline":{const n=e.fighters[t.fighter];i.flash(n.x,1,n.z,16765440,2.5,20),i.burst(n.x,1,n.z,16765440,60,.15,.07,.002,40),this.shake=.2;break}case"land":if(t.hard){const n=e.fighters[t.fighter];i.burst(n.x,.1,n.z,Xa,16,.05,.06,.002,26)}break;case"shake":this.shake=Math.max(this.shake,t.amount);break;case"ko":{if(t.loser>=0){const n=e.fighters[t.loser];i.flash(n.x,1,n.z,16777215,3,16)}break}}}syncFight(t,e){this.time+=e,this.platform.visible=!1,this.views.forEach((n,r)=>n.sync(t.fighters[r],t,e,this.effects));const i=new Set;for(const n of t.projectiles){i.add(n.id);let r=this.projViews.get(n.id);r||(r=new gy(n),this.projViews.set(n.id,r),this.scene.add(r.obj)),r.sync(n,this.time)}for(const[n,r]of this.projViews)if(!i.has(n)){const a=r.obj.position;this.effects.burst(a.x,a.y,a.z,16777215,8,.05,.035,.002,14),this.scene.remove(r.obj),this.projViews.delete(n)}this.stage?.update(this.time),this.updateFightCamera(t,e),this.effects.update(e,this.camera),this.hideOccluders(),this.drawHitboxes(t)}updateFightCamera(t,e){const[i,n]=t.fighters,r=t.camN,a=new R,o=new R,l=(i.x+n.x)/2,c=(i.z+n.z)/2,h=Math.hypot(i.x-n.x,i.z-n.z),f=Math.max(i.y,n.y),u=Math.atan2(r.z,r.x);if(t.freeze>0&&this.superFocus){const d=t.fighters[this.superFocus.fighter];a.set(d.x+r.x*2.5+d.dirX*.7,1.45,d.z+r.z*2.5+d.dirZ*.7),o.set(d.x+d.dirX*.25,1.35,d.z+d.dirZ*.25),this.lerpCam(a,o,1-Math.exp(-e*12))}else if(t.cinematic){const d=t.cinematic,p=(d.att.x+d.def.x)/2,x=(d.att.z+d.def.z)/2,m=u+d.frame*.02-.6;a.set(p+Math.cos(m)*4.2,1.5+Math.sin(d.frame*.05)*.3,x+Math.sin(m)*4.2),o.set(p,1.1,x),this.lerpCam(a,o,1-Math.exp(-e*5))}else if(t.phase==="intro"){const d=t.phaseFrame<100?i:n;a.set(d.x+d.dirX*2.3+r.x*1.1,1.55,d.z+d.dirZ*2.3+r.z*1.1),o.set(d.x,1.3,d.z),this.lerpCam(a,o,1-Math.exp(-e*3))}else if(t.phase==="ko"&&t.phaseFrame<100&&t.roundWinner!==null){const d=t.fighters.find(m=>m.koed)??i,p=l+(d.x-l)*.5,x=c+(d.z-c)*.5;a.set(p+r.x*5.2,1.5,x+r.z*5.2),o.set(d.x*.6+l*.4,.9,d.z*.6+c*.4),this.lerpCam(a,o,1-Math.exp(-e*2.5))}else if(t.phase==="matchEnd"&&t.matchWinner!==null&&t.matchWinner>=0){const d=t.fighters[t.matchWinner],p=Math.atan2(d.dirZ,d.dirX)+Math.sin(this.time*.3)*.3;a.set(d.x+Math.cos(p)*3.6,1.55,d.z+Math.sin(p)*3.6),o.set(d.x,1.2,d.z),this.lerpCam(a,o,1-Math.exp(-e*2))}else{const d=Ou(3.4+h*.72,4.6,9.5);a.set(l+r.x*d,1.5+f*.35+d*.05,c+r.z*d),o.set(l,1.05+f*.3,c),this.lerpCam(a,o,1-Math.exp(-e*7))}this.superFocus&&(this.superFocus.frames--,this.superFocus.frames<=0&&t.freeze<=0&&(this.superFocus=null)),this.applyCamera(e)}hideOccluders(){const t=this.stage?.occluders;if(!t)return;const e=this.camPos.x,i=this.camPos.z,n=this.camLook.x,r=this.camLook.z,a=n-e,o=r-i,l=a*a+o*o||1;for(const c of t){const h=c.position.x,f=c.position.z,u=Ou(((h-e)*a+(f-i)*o)/l,0,1),d=e+a*u-h,p=i+o*u-f,x=c.userData.radius??1.5;c.visible=u>=1||d*d+p*p>(x+.6)*(x+.6)}}lerpCam(t,e,i){this.camPos.lerp(t,i),this.camLook.lerp(e,i)}applyCamera(t){this.camera.position.copy(this.camPos),this.shake>.001&&(this.camera.position.x+=(Math.random()-.5)*this.shake,this.camera.position.y+=(Math.random()-.5)*this.shake,this.camera.position.z+=(Math.random()-.5)*this.shake,this.shake*=Math.pow(.86,t*60)),this.camera.lookAt(this.camLook)}drawHitboxes(t){if(this.hitboxGroup.visible=this.showHitboxes,!this.showHitboxes)return;for(;this.hitboxGroup.children.length;){const n=this.hitboxGroup.children.pop();n.geometry.dispose(),n.material.dispose()}const e=n=>new pi({color:n,transparent:!0,opacity:.3,depthTest:!1,depthWrite:!1}),i=(n,r,a,o,l,c=0)=>{const h=new qt(n,e(r));h.position.set(a,o,l),h.rotation.y=c,h.renderOrder=999,this.hitboxGroup.add(h)};for(const n of t.fighters){for(const a of n.hurtboxes())i(new kt(a.r,a.r,a.h,16,1,!0),3407718,a.x,a.y,a.z);const r=n.activeHitbox();if(r){const a=n.ahead(r.x);i(new wt((r.lw??.26)*2,r.h,r.w),16720452,a.x,n.y+r.y,a.z,uc(n.yaw))}}for(const n of t.projectiles)n.active&&(n.attach?i(new wt(n.h,n.h,n.w),16750882,n.x,n.y,n.z,uc(Math.atan2(n.dirZ,n.dirX))):i(new Rt(n.w/2,12,8),16750882,n.x,n.y,n.z))}setShowcase(t,e=!0){for(const i of this.showcase)i&&(this.scene.remove(i.view.rig.root),i.view.dispose());this.showcase=t.map(i=>{const n=new rl(i.def);return n.rig.root.position.set(i.x,0,0),this.scene.add(n.rig.root),{view:n,slot:i}}),this.platform.visible=e&&t.length>0,this.views.forEach(i=>i.rig.root.visible=!1)}updateShowcaseSlot(t,e){const i=this.showcase[t];if(i&&e&&i.slot.def.id===e.def.id){i.slot=e;return}if(i&&(this.scene.remove(i.view.rig.root),i.view.dispose()),!e){this.showcase[t]=void 0;return}const n=new rl(e.def);this.scene.add(n.rig.root),this.showcase[t]={view:n,slot:e}}syncShowcase(t,e){this.time+=t;const i=this.showcaseCount;this.showcase.forEach((r,a)=>{if(!r)return;const{view:o,slot:l}=r;o.anim.showcase(t,this.time,l.pose,l.variant??0,a*1.7),o.anim.apply(o.rig);const c=o.rig.root;c.visible=!0,c.position.set(l.x,this.platform.visible&&i===1?.1:0,0),c.rotation.y=l.facing>0?Nu-.5:-Nu+.5;for(const h of o.rig.materials)h.emissive.setRGB(0,0,0);o.shield.visible=!1,o.stars.visible=!1}),this.stage?.update(this.time);const n=1-Math.exp(-t*4);this.lerpCam(new R(...e.pos),new R(...e.look),n),this.applyCamera(t),this.effects.update(t,this.camera)}get showcaseCount(){return this.showcase.filter(Boolean).length}get currentStage(){return this.stageId}clearShowcase(){this.setShowcase([],!1)}snapCamera(t,e){this.camPos.set(...t),this.camLook.set(...e)}render(){this.renderer.render(this.scene,this.camera)}}class xy{canvas;ui;renderer;input=new Xf;audio=new zf;settings=Zf();screen=null;arcade=null;lastSetup=null;desktop=window.skfDesktop??null;quality="high";acc=0;last=0;fps=0;constructor(){this.canvas=document.getElementById("game"),this.ui=document.getElementById("ui"),this.renderer=new vy(this.canvas),this.applySettings(),window.addEventListener("resize",()=>this.renderer.resize());const t=()=>this.audio.unlock();window.addEventListener("keydown",t),window.addEventListener("pointerdown",t),window.addEventListener("keydown",e=>{e.code==="F11"&&!this.desktop&&(e.preventDefault(),this.toggleFullscreen())})}applySettings(){const t=this.settings;this.audio.volumes={master:t.masterVolume,music:t.musicVolume,sfx:t.sfxVolume},this.audio.announcer=t.announcer,this.audio.applyVolumes(),this.input.rumbleEnabled=t.rumble,this.renderer.showHitboxes=t.showHitboxes,Q_(t.faces),this.quality!==t.quality&&(this.quality=t.quality,this.renderer.setQuality(t.quality)),Jf(t)}toggleFullscreen(){if(this.desktop){this.desktop.toggleFullscreen();return}document.fullscreenElement?document.exitFullscreen().catch(()=>{}):document.documentElement.requestFullscreen().catch(()=>{})}go(t){this.screen?.exit(),this.ui.innerHTML="",this.screen=t,t.enter()}start(){const t=e=>{const i=this.last?Math.min(.1,(e-this.last)/1e3):1/ao;this.last=e,this.fps=this.fps*.95+1/Math.max(i,.001)*.05,this.acc+=i;let n=0;for(;this.acc>=1/ao&&n<5;)this.input.poll(),this.input.anyPressed()&&this.audio.unlock(),this.screen?.tick(),this.acc-=1/ao,n++;n===5&&(this.acc=0),this.screen?.frame(i),this.renderer.render(),requestAnimationFrame(t)};requestAnimationFrame(t)}glyphStyle(t){const e=this.input.padInfo(t);return!e||this.input.lastDevice[t]!=="pad"?"kb":e.kind==="xbox"?"xbox":"ps"}menuStyle(){const t=this.input.connectedPads();if(!t.length||this.input.lastDevice[0]!=="pad"&&this.input.lastDevice[1]!=="pad")return"kb";const e=this.input.lastDevice[0]==="pad"?0:1;return(this.input.padInfo(e)??t[0]).kind==="xbox"?"xbox":"ps"}glyph(t,e=0,i){const n=i??this.glyphStyle(e);return`<span class="g ${Yf(t,n)}">${$f(t,n,e)}</span>`}mg(t){const e=this.menuStyle();if(e==="ps"){const n={confirm:["g-cross","✕"],back:["g-circle","○"],extra:["g-triangle","△"],extra2:["g-square","□"],start:["g-shoulder","OPTIONS"]}[t];return`<span class="g ${n[0]}">${n[1]}</span>`}return e==="xbox"?`<span class="g g-key">${{confirm:"A",back:"B",extra:"Y",extra2:"X",start:"MENU"}[t]}</span>`:`<span class="g g-key">${{confirm:"Enter",back:"Esc",extra:"I",extra2:"O",start:"Esc"}[t]}</span>`}}const oe={light:15845285,fair:15251604,medium:14262908,warm:14921868,olive:13012579,deep:7029808},Ie={black:1709330,dark:2827296,brown:4862498,light:11569754,grey:10132122,silver:13158600,salt:7236198},pt={navy:1780298,charcoal:2961206,black:1118742,slate:3820126,steel:2240831,white:16053492,paleBlue:14674421},Ee=[{id:"netanyahu",name:"Benjamin Netanyahu",nameHe:"בנימין נתניהו",nick:"Bibi",party:"likud",role:"Prime Minister",bio:"Israel's longest-serving Prime Minister. Has survived more no-confidence motions than anyone can count.",style:"technician",stats:{health:1.05,speed:.96},look:{skin:oe.fair,height:1.03,build:1.14,hair:"side",hairColor:13619151,outfit:"suit",jacket:pt.navy,shirt:pt.white,tie:2776496,pants:pt.navy},specials:[{type:"projectile",name:"Red Line Bomb",prop:"bomb",color:16726843,arc:!0,damage:95,desc:"Lobs a cartoon bomb with a red line drawn on it."},{type:"teleport",name:"Coalition Shuffle",color:5219327,mode:"behind",attack:!0,desc:"Swaps partners, and sides. Reappears behind you with a strike."},{type:"shield",name:"Iron Dome",color:10474495,hits:3,desc:"Intercepts the next three incoming attacks."}],ultimate:{type:"cinematic",name:"Sixth Term",color:2780159,prop:"ballot",damage:390},passive:{id:"lifeline",name:"Political Survivor",desc:"Once per match, survives a knockout blow with 1 HP."},quotes:{intro:"I've been here before. I'll be here after.",win:"They said it was over. It's never over."}},{id:"levin",name:"Yariv Levin",nameHe:"יריב לוין",party:"likud",role:"Deputy PM & Justice Minister",bio:"Architect of the judicial overhaul. Treats every court ruling as a personal challenge.",style:"zoner",stats:{health:1},look:{skin:oe.fair,height:.98,build:1.14,hair:"receding",hairColor:Ie.dark,outfit:"suit",jacket:pt.charcoal,shirt:pt.white,tie:8003371,pants:pt.charcoal},specials:[{type:"projectile",name:"Judicial Gavel",prop:"gavel",color:12618302,damage:85},{type:"counter",name:"Reasonableness Clause",color:16765286,damage:150,desc:"Declares the attack unreasonable and strikes back."},{type:"grab",name:"Committee Selection",color:9067775,damage:180,desc:"Appoints you to a very uncomfortable committee."}],ultimate:{type:"megarain",name:"The Overhaul",color:12618302,prop:"gavel"},passive:{id:"chipMaster",name:"Override Clause",desc:"Blocking him still hurts: triple chip damage."},quotes:{intro:"Objection overruled. By me.",win:"The court has been... reformed."}},{id:"israel-katz",name:"Israel Katz",nameHe:'ישראל כ"ץ',party:"likud",role:"Defense Minister",bio:"Former Transport Minister who built roads, rails and interchanges. Now runs defense like a construction project.",style:"brawler",stats:{health:1.1,speed:.9,power:1.05,weight:1.2},look:{skin:oe.warm,height:1.02,build:1.32,hair:"horseshoe",hairColor:Ie.silver,outfit:"suit",jacket:2831430,shirt:pt.white,tie:2052e3,pants:2831430},specials:[{type:"wave",name:"Light Rail Line",prop:"train",color:14034984,damage:80,desc:"Sends a light-rail car along the floor. Block low!"},{type:"rush",name:"Express Train",color:16758531,hits:3,damage:130,armor:!0,prop:"train",desc:"Armored charge like an express train."},{type:"rising",name:"Interchange Uppercut",color:16766474,hits:2,damage:125}],ultimate:{type:"megaprojectile",name:"National Infrastructure Plan",color:16739125,prop:"train"},passive:{id:"heavyArmor",name:"Heavyweight",desc:"Heavy attacks absorb one hit during startup."},quotes:{intro:"Clear the tracks.",win:"Another project completed ahead of schedule."}},{id:"ohana",name:"Amir Ohana",nameHe:"אמיר אוחנה",party:"likud",role:"Speaker of the Knesset",bio:"Runs the plenum with an iron gavel. Order in the house is non-negotiable.",style:"technician",stats:{speed:1.05},look:{skin:oe.medium,height:1,build:.95,hair:"short",hairColor:Ie.black,outfit:"suit",jacket:1842982,shirt:pt.white,tie:3160658,pants:1842982},specials:[{type:"projectile",name:"Order! Order!",prop:"sound",color:16044894,damage:50,effect:{stun:40},desc:"A booming call to order that stuns."},{type:"grab",name:"Removal From the Plenum",color:15087942,damage:160,range:1.4,desc:"Has you escorted out of the chamber. Forcefully."},{type:"rising",name:"Session Adjourned",color:16044894,damage:120}],ultimate:{type:"megarain",name:"Emergency Session",color:4553629,prop:"chair"},passive:{id:"meterBoost",name:"Speaker's Privilege",desc:"Builds Ultimate meter 30% faster."},quotes:{intro:"The member is out of order.",win:"This session is adjourned."}},{id:"regev",name:"Miri Regev",nameHe:"מירי רגב",party:"likud",role:"Transport Minister",bio:"Former IDF spokesperson and Culture Minister. Now controls every road, runway and traffic light.",style:"rushdown",stats:{speed:1.02},look:{skin:oe.medium,height:.94,build:.92,hair:"bob",hairColor:Ie.black,outfit:"blazer",jacket:12653087,shirt:1118481,tie:null,pants:1118481,female:!0},specials:[{type:"trap",name:"Traffic Jam",prop:"cone",color:16743168,damage:40,effect:{slow:180},desc:"Drops a traffic cone. Step on it and you're stuck in traffic."},{type:"rush",name:"Highway Rush",color:16759304,hits:2,damage:115,distance:4},{type:"spin",name:"Red Carpet Spin",color:13631488,hits:4,damage:105}],ultimate:{type:"cinematic",name:"Grand Opening Ceremony",color:16764928,prop:"scissors"},passive:{id:"rage",name:"Culture War",desc:"Deals 25% more damage below 30% health."},quotes:{intro:"This road is closed. For you.",win:"Cut the ribbon!"}},{id:"amsalem",name:"David Amsalem",nameHe:"דוד אמסלם",nick:"Dudi",party:"likud",role:"Minister & Likud MK",bio:"Famous for plenum speeches you can hear from Tel Aviv. Volume: maximum.",style:"brawler",stats:{power:1.08,speed:.95,weight:1.15},look:{skin:oe.medium,height:1,build:1.22,hair:"bald",hairColor:3355443,facialHair:"stubble",facialHairColor:3355443,outfit:"open-suit",jacket:pt.charcoal,shirt:15395562,tie:null,pants:pt.charcoal},specials:[{type:"beam",name:"Sonic Rant",prop:"sound",color:16765286,length:3.6,damage:120,hits:5,desc:"A point-blank blast of pure volume."},{type:"wave",name:"Plenum Stomp",color:15167313,damage:80},{type:"rising",name:"Table Flip",prop:"chair",color:10506797,damage:130}],ultimate:{type:"megabeam",name:"Ultimate Shouting Match",color:16711790,prop:"sound"},passive:{id:"ironWill",name:"Thick Skull",desc:"Shrugs off hits: 15% shorter hitstun."},quotes:{intro:"Sit down! I have the floor!",win:"Did everyone hear that? Good."}},{id:"barkat",name:"Nir Barkat",nameHe:"ניר ברקת",party:"likud",role:"Economy Minister",bio:"Tech millionaire and former Mayor of Jerusalem. Treats every fight like a startup exit.",style:"balanced",stats:{speed:1.05,jump:1.08},look:{skin:oe.light,height:1.07,build:.95,hair:"receding",hairColor:10129286,outfit:"suit",jacket:pt.slate,shirt:pt.paleBlue,tie:1914199,pants:pt.slate},specials:[{type:"projectile",name:"Startup Pitch",prop:"laptop",color:5032432,damage:80},{type:"dive",name:"Angel Investor Dive",color:5032432,damage:95},{type:"rising",name:"Market Rally",prop:"coin",color:5420936,damage:120,hits:3}],ultimate:{type:"megaprojectile",name:"Unicorn Valuation",color:16766474,prop:"coin"},passive:{id:"deepPockets",name:"Deep Pockets",desc:"Starts every round with half a meter."},quotes:{intro:"Let's disrupt this.",win:"Exit achieved. Acquired for a billion."}},{id:"gotliv",name:"Tally Gotliv",nameHe:"טלי גוטליב",party:"likud",role:"Likud MK",bio:"Criminal lawyer turned firebrand MK. Objects to everything, loudly.",style:"rushdown",stats:{},look:{skin:oe.fair,height:.96,build:.9,hair:"wavy",hairColor:Ie.brown,outfit:"blazer",jacket:pt.black,shirt:pt.white,tie:null,pants:pt.black,female:!0},specials:[{type:"projectile",name:"Legal Brief",prop:"paper",color:15858414,count:3,damage:36},{type:"barrage",name:"Cross-Examination",color:15087942,hits:7,damage:120},{type:"counter",name:"Objection!",color:16758531,damage:140}],ultimate:{type:"cinematic",name:"Closing Argument",color:15087942,prop:"book"},passive:{id:"counterPunch",name:"Sustained!",desc:"Counter-hits deal 50% extra damage."},quotes:{intro:"Objection! Your Honor, look at this!",win:"No further questions."}},{id:"karhi",name:"Shlomo Karhi",nameHe:"שלמה קרעי",party:"likud",role:"Communications Minister",bio:"Wants to reform the airwaves, the public broadcaster and possibly your phone plan.",style:"zoner",stats:{},look:{skin:oe.medium,height:1,build:1,hair:"short",hairColor:Ie.black,facialHair:"short",facialHairColor:Ie.black,headwear:"kippah-knit",headwearColor:2838698,outfit:"open-suit",jacket:pt.navy,shirt:pt.white,tie:null,pants:pt.navy},specials:[{type:"beam",name:"Broadcast Signal",prop:"dish",color:4770532,length:4.5,hits:4,damage:110},{type:"pull",name:"Pull the Plug",prop:"phone",color:9494767,damage:55},{type:"trap",name:"5G Tower",prop:"tower",color:16735631,effect:{stun:45}}],ultimate:{type:"megarain",name:"Media Reform",color:46296,prop:"tv"},passive:{id:"drainer",name:"Frequency Auction",desc:"Every hit drains the opponent's meter."},quotes:{intro:"This channel is now under review.",win:"And we're off the air."}},{id:"may-golan",name:"May Golan",nameHe:"מאי גולן",party:"likud",role:"Minister for Social Equality",bio:"Minister for the Advancement of Women. Advances mostly toward her opponents.",style:"rushdown",stats:{speed:1.03},look:{skin:oe.medium,height:.95,build:.9,hair:"long",hairColor:Ie.black,outfit:"blazer",jacket:15921906,shirt:2236962,tie:null,pants:2236962,female:!0},specials:[{type:"projectile",name:"Hot Take",prop:"fire",color:16733184,damage:80,speed:.19},{type:"rush",name:"Spotlight Dash",color:16764928,damage:110,launch:!0},{type:"rising",name:"Headline Kick",color:16711764,damage:120,hits:2}],ultimate:{type:"megarain",name:"Viral Moment",color:16733184,prop:"phone"},passive:{id:"swift",name:"Fast Track",desc:"Moves 18% faster."},quotes:{intro:"You're trending. Not in a good way.",win:"Screenshot that."}},{id:"edelstein",name:"Yuli Edelstein",nameHe:"יולי אדלשטיין",party:"likud",role:"Likud MK, former Speaker",bio:"Former Soviet refusenik, Knesset Speaker and Health Minister who ran the vaccine drive. Unbreakable.",style:"technician",stats:{defense:1.06},look:{skin:oe.light,height:.98,build:1.05,hair:"receding",hairColor:13684944,facialHair:"full",facialHairColor:14211288,glasses:"rect",headwear:"kippah-knit",headwearColor:3158064,outfit:"suit",jacket:pt.charcoal,shirt:pt.white,tie:5925772,pants:pt.charcoal},specials:[{type:"projectile",name:"Booster Shot",prop:"syringe",color:8454107,damage:70,speed:.22,effect:{lifesteal:25},desc:"A fast dart that heals him on hit."},{type:"slam",name:"Speaker's Chair Drop",prop:"chair",color:10322313,damage:120},{type:"heal",name:"Green Pass",color:5420936,amount:90}],ultimate:{type:"megarain",name:"Mass Vaccination Drive",color:8454107,prop:"syringe"},passive:{id:"ironWill",name:"Refusenik",desc:"Unbreakable will: 15% shorter hitstun."},quotes:{intro:"I've faced tougher interrogations.",win:"Next patient, please."}},{id:"saar",name:"Gideon Sa'ar",nameHe:"גדעון סער",party:"likud",role:"Foreign Minister",bio:"Left Likud, founded New Hope, merged back into Likud. Always finds his way home.",style:"zoner",stats:{},look:{skin:oe.fair,height:1.06,build:.98,hair:"bald",hairColor:Ie.grey,outfit:"suit",jacket:pt.steel,shirt:pt.white,tie:3835647,pants:pt.steel},specials:[{type:"projectile",name:"Diplomatic Cable",prop:"envelope",color:10670847,damage:75,homing:!0},{type:"grab",name:"Party Merger",color:3835647,damage:175,desc:"Absorbs your party. And you."},{type:"teleport",name:"Return Flight",color:12443902,mode:"behind",attack:!0}],ultimate:{type:"cinematic",name:"Summit Meeting",color:3835647,prop:"flag"},passive:{id:"regen",name:"New Hope",desc:"Recovers part of his lost health when not taking damage."},quotes:{intro:"I left. I came back. Now I'm here for you.",win:"Diplomacy by other means."}},{id:"dichter",name:"Avi Dichter",nameHe:"אבי דיכטר",party:"likud",role:"Agriculture Minister",bio:"Former head of the Shin Bet, now in charge of farms. Knows where you are, and what you ate.",style:"technician",stats:{},look:{skin:oe.fair,height:1,build:1.02,hair:"bald",hairColor:11184810,outfit:"suit",jacket:3881787,shirt:pt.white,tie:2792847,pants:3881787},specials:[{type:"projectile",name:"Tomato Toss",prop:"tomato",color:15087942,count:2,arc:!0,damage:50},{type:"teleport",name:"Covert Op",color:2829634,mode:"behind",attack:!0},{type:"wave",name:"Harvest Sweep",prop:"leaf",color:8435992,damage:80}],ultimate:{type:"megarain",name:"Agricultural Reform",color:5613104,prop:"watermelon"},passive:{id:"quickRecovery",name:"Shin Bet Training",desc:"Gets up faster, and his backdash is invincible."},quotes:{intro:"We've had a file on you for years.",win:"Harvest season."}},{id:"silman",name:"Idit Silman",nameHe:"עידית סילמן",party:"likud",role:"Environmental Protection Minister",bio:"Brought down a government by crossing the floor. Now she recycles opponents.",style:"balanced",stats:{},look:{skin:oe.fair,height:.94,build:.92,hair:"bob",hairColor:3877407,outfit:"skirt",jacket:2976335,shirt:pt.white,tie:null,pants:2976335,female:!0},specials:[{type:"projectile",name:"Recycling Bin",prop:"bin",color:2976335,arc:!0,damage:90},{type:"teleport",name:"Crossing the Floor",color:9819570,mode:"behind",attack:!0},{type:"shield",name:"Green Shield",color:7653021,hits:2}],ultimate:{type:"megarain",name:"Coalition Collapse",color:5420936,prop:"brick"},passive:{id:"projectileProof",name:"Sustainable",desc:"Takes half damage from projectiles."},quotes:{intro:"I've switched sides before.",win:"Reduce. Reuse. Defeat."}},{id:"ofir-katz",name:"Ofir Katz",nameHe:"אופיר כץ",party:"likud",role:"Coalition Whip",bio:"Keeps the coalition in line, one late-night vote at a time.",style:"rushdown",stats:{},look:{skin:oe.warm,height:1,build:1.02,hair:"short",hairColor:Ie.dark,facialHair:"stubble",facialHairColor:Ie.dark,outfit:"suit",jacket:pt.navy,shirt:pt.white,tie:2508371,pants:pt.navy},specials:[{type:"pull",name:"The Whip",color:15320170,damage:60,desc:"Cracks the coalition whip and drags you into line."},{type:"rush",name:"Emergency Vote",color:16032353,hits:2,damage:115},{type:"rising",name:"Party Discipline",color:15167313,damage:120}],ultimate:{type:"cinematic",name:"Coalition Lockdown",color:15320170,prop:"ballot"},passive:{id:"comboMaster",name:"Three-Line Whip",desc:"Combos lose less damage to scaling."},quotes:{intro:"Nobody leaves until the vote passes.",win:"Motion carried."}},{id:"kisch",name:"Yoav Kisch",nameHe:"יואב קיש",party:"likud",role:"Education Minister",bio:"Former combat pilot, now Education Minister. Grades on a curve. A ballistic one.",style:"rushdown",stats:{jump:1.1,speed:1.04},look:{skin:oe.fair,height:1.03,build:.98,hair:"short",hairColor:3877407,outfit:"suit",jacket:2508371,shirt:pt.white,tie:2792847,pants:2508371},specials:[{type:"projectile",name:"Paper Airplane",prop:"plane",color:15858414,damage:70,speed:.18,homing:!0},{type:"dive",name:"Dive Bomb",color:9358054,damage:95},{type:"rising",name:"Report Card",color:16758531,damage:115,height:1.1}],ultimate:{type:"megarain",name:"Final Exam",color:2203324,prop:"book"},passive:{id:"doubleJump",name:"Top Gun",desc:"Can jump again in mid-air."},quotes:{intro:"Pop quiz. Are you ready?",win:"See me after class."}},{id:"lapid",name:"Yair Lapid",nameHe:"יאיר לפיד",party:"yeshatid",role:"Leader of the Opposition",bio:"Former TV anchor, novelist and Prime Minister. Keeps boxing gloves in the office, just in case.",style:"rushdown",stats:{speed:1.04,power:1.02},look:{skin:oe.fair,height:1.04,build:1,hair:"swept",hairColor:12566463,outfit:"open-suit",jacket:pt.black,shirt:1381914,tie:null,pants:pt.black},specials:[{type:"projectile",name:"Breaking News",prop:"mic",color:42747,damage:80},{type:"barrage",name:"Anchorman Combo",color:361162,hits:6,damage:115},{type:"rising",name:"Rotation Agreement",color:42747,hits:3,damage:125}],ultimate:{type:"cinematic",name:"There Is A Future",color:42747,prop:"tv"},passive:{id:"meterBoost",name:"Prime Time",desc:"Builds Ultimate meter 30% faster."},quotes:{intro:"Good evening. Tonight's top story: you, losing.",win:"And that's the news."}},{id:"ben-ari",name:"Merav Ben-Ari",nameHe:"מירב בן ארי",party:"yeshatid",role:"Yesh Atid MK",bio:"Committee veteran who never misses question time.",style:"technician",stats:{},look:{skin:oe.light,height:.95,build:.92,hair:"long",hairColor:Ie.light,outfit:"blazer",jacket:30646,shirt:pt.white,tie:null,pants:pt.navy,female:!0},specials:[{type:"projectile",name:"Parliamentary Question",prop:"paper",color:9494767,damage:45,effect:{stun:35}},{type:"spin",name:"Spin Kick Motion",color:46296,hits:4},{type:"counter",name:"Point of Clarification",color:4770532,damage:135}],ultimate:{type:"megabeam",name:"Motion to the Agenda",color:38599,prop:"wave"},passive:{id:"counterPunch",name:"Follow-up Question",desc:"Counter-hits deal 50% extra damage."},quotes:{intro:"I have a follow-up question.",win:"Thank you. The committee is satisfied."}},{id:"gantz",name:"Benny Gantz",nameHe:"בני גנץ",party:"nationalunity",role:"Chairman, Blue and White",bio:"Former IDF Chief of Staff. Tall, calm, and has entered and left more governments than anyone.",style:"balanced",stats:{health:1.08,defense:1.04},look:{skin:oe.light,height:1.1,build:1.02,hair:"short",hairColor:11053224,outfit:"suit",jacket:pt.navy,shirt:pt.paleBlue,tie:4756975,pants:pt.navy},specials:[{type:"slam",name:"Paratrooper Drop",color:4756975,damage:125},{type:"rush",name:"Blue & White Charge",color:4415982,armor:!0,damage:115,distance:3.6},{type:"counter",name:"Unity Guard",color:12443902,damage:145}],ultimate:{type:"cinematic",name:"Joint Operation",color:4415982,prop:"flag"},passive:{id:"thickSkin",name:"Chief of Staff",desc:"Takes 14% less damage."},quotes:{intro:"Israel before everything. Including you.",win:"Mission accomplished. For now."}},{id:"eisenkot",name:"Gadi Eisenkot",nameHe:"גדי איזנקוט",party:"yashar",role:"Former IDF Chief of Staff",bio:"Soft-spoken strategist who plans ten moves ahead. Started his own party to say it straight.",style:"technician",stats:{},look:{skin:oe.medium,height:.98,build:1,hair:"buzz",hairColor:9079434,outfit:"suit",jacket:pt.charcoal,shirt:pt.white,tie:7107965,pants:pt.charcoal},specials:[{type:"trap",name:"Battle Plan",prop:"map",color:5800279,effect:{stun:50}},{type:"teleport",name:"Flanking Maneuver",color:3824192,mode:"behind",attack:!0},{type:"beam",name:"Straight Talk",prop:"sound",color:14342093,length:3.2,damage:110,hits:4}],ultimate:{type:"megarain",name:"Chief's Directive",color:5800279,prop:"jet"},passive:{id:"powerSurge",name:"Strategist",desc:"Special moves deal 20% more damage."},quotes:{intro:"I've already planned this fight.",win:"As expected."}},{id:"tropper",name:"Chili Tropper",nameHe:"חילי טרופר",party:"nationalunity",role:"National Unity MK",bio:"Former teacher and Culture & Sport Minister. Delivers a lecture with every punch.",style:"balanced",stats:{},look:{skin:oe.fair,height:1.02,build:.96,hair:"short",hairColor:Ie.dark,facialHair:"stubble",facialHairColor:Ie.dark,outfit:"open-suit",jacket:pt.slate,shirt:pt.white,tie:null,pants:pt.slate},specials:[{type:"projectile",name:"Chalk Toss",prop:"chalk",color:16777215,count:2,damage:45,speed:.2},{type:"rush",name:"Sports Tackle",prop:"ball",color:16219904,damage:110,launch:!0},{type:"rising",name:"Culture Kick",color:16564041,damage:115,hits:2}],ultimate:{type:"cinematic",name:"Final Whistle",color:16219904,prop:"whistle"},passive:{id:"regen",name:"Team Player",desc:"Recovers part of his lost health when not taking damage."},quotes:{intro:"Class is in session.",win:"Homework: practice more."}},{id:"tamano-shata",name:"Pnina Tamano-Shata",nameHe:"פנינה תמנו-שטה",party:"nationalunity",role:"National Unity MK",bio:"Trailblazing lawyer and former Aliyah Minister. Breaks glass ceilings for a living.",style:"rushdown",stats:{speed:1.04},look:{skin:oe.deep,height:.95,build:.9,hair:"braids",hairColor:1314572,outfit:"blazer",jacket:16758531,shirt:pt.white,tie:null,pants:pt.navy,female:!0},specials:[{type:"projectile",name:"Aliyah Flight",prop:"plane",color:9358054,damage:80,speed:.18},{type:"rush",name:"Integration Drive",color:16758531,hits:2,damage:115},{type:"rising",name:"Glass Ceiling Breaker",color:13299960,damage:125,height:1.15,hits:2}],ultimate:{type:"megaprojectile",name:"Trailblazer",color:16758531,prop:"star"},passive:{id:"swift",name:"First Through the Door",desc:"Moves 18% faster."},quotes:{intro:"Nobody gave me a seat at the table. I took one.",win:"Another ceiling, shattered."}},{id:"deri",name:"Aryeh Deri",nameHe:"אריה דרעי",party:"shas",role:"Shas Chairman",bio:"The ultimate political comeback story and dealmaker. Every coalition goes through him.",style:"technician",stats:{},look:{skin:oe.medium,height:.97,build:1.08,hair:"short",hairColor:3815994,facialHair:"full",facialHairColor:9079434,glasses:"rect",headwear:"kippah",headwearColor:1118481,outfit:"suit",jacket:pt.black,shirt:pt.white,tie:1914199,pants:pt.black},specials:[{type:"pull",name:"Coalition Demands",prop:"briefcase",color:1914199,damage:55},{type:"projectile",name:"Budget Allocation",prop:"shekel",color:16765286,count:3,damage:38},{type:"counter",name:"Veteran's Maneuver",color:4553629,damage:150}],ultimate:{type:"megagrab",name:"The Kingmaker",color:16765286},passive:{id:"lifeline",name:"The Comeback",desc:"Once per match, survives a knockout blow with 1 HP."},quotes:{intro:"Let's make a deal.",win:"Every government needs me."}},{id:"malchieli",name:"Michael Malchieli",nameHe:"מיכאל מלכיאלי",party:"shas",role:"Shas MK",bio:"Former Religious Services Minister. Methodical, patient, and very hard to move.",style:"grappler",stats:{health:1.04},look:{skin:oe.medium,height:1,build:1.12,hair:"short",hairColor:Ie.black,facialHair:"full",facialHairColor:2763306,headwear:"kippah",headwearColor:1118481,outfit:"suit",jacket:1842982,shirt:pt.white,tie:2829634,pants:1842982},specials:[{type:"projectile",name:"Ministry Memo",prop:"paper",color:14737885,damage:75},{type:"grab",name:"Bureaucratic Hold",color:4282999,damage:180},{type:"rising",name:"Ascending Motion",color:7835049,damage:120}],ultimate:{type:"megabeam",name:"Ministerial Decree",color:14737885,prop:"paper"},passive:{id:"thickSkin",name:"Steady Hand",desc:"Takes 14% less damage."},quotes:{intro:"Everything in its proper order.",win:"Filed and stamped."}},{id:"gafni",name:"Moshe Gafni",nameHe:"משה גפני",party:"utj",role:"UTJ MK, Finance Committee veteran",bio:"Long-time Finance Committee chair. Controls the budget, and therefore everything.",style:"zoner",stats:{speed:.9,health:1.05},look:{skin:oe.light,height:.96,build:1.1,hair:"short",hairColor:13684944,facialHair:"long",facialHairColor:15790320,glasses:"round",headwear:"black-hat",outfit:"suit",jacket:855311,shirt:pt.white,tie:null,pants:855311},specials:[{type:"projectile",name:"Funding Freeze",prop:"snowflake",color:11066076,damage:60,effect:{slow:150},desc:"Freezes your funding: you move slower for a while."},{type:"counter",name:"Committee Veto",color:1914199,damage:150},{type:"beam",name:"Budget Cut",prop:"scissors",color:15858414,length:2.8,damage:120,hits:3}],ultimate:{type:"megarain",name:"Final Budget Vote",color:16765286,prop:"coin"},passive:{id:"drainer",name:"Finance Committee",desc:"Every hit drains the opponent's meter."},quotes:{intro:"Let's discuss the budget.",win:"Motion approved. Funds transferred."}},{id:"goldknopf",name:"Yitzhak Goldknopf",nameHe:"יצחק גולדקנופף",party:"utj",role:"UTJ Chairman (Agudat Yisrael)",bio:"Former Housing Minister. Builds fast and hits like a construction crane.",style:"grappler",stats:{health:1.1,power:1.08,speed:.88,weight:1.25},look:{skin:oe.light,height:1,build:1.26,hair:"short",hairColor:Ie.salt,facialHair:"long",facialHairColor:10132122,glasses:"rect",headwear:"black-hat",outfit:"suit",jacket:855311,shirt:pt.white,tie:null,pants:855311},specials:[{type:"projectile",name:"Brick Toss",prop:"brick",color:12339017,arc:!0,damage:95},{type:"grab",name:"Cornerstone Slam",prop:"brick",color:10996055,damage:190},{type:"trap",name:"Housing Tender",prop:"crane",color:16759304,effect:{stun:45}}],ultimate:{type:"megarain",name:"Housing Boom",color:12339017,prop:"brick"},passive:{id:"heavyArmor",name:"Reinforced Concrete",desc:"Heavy attacks absorb one hit during startup."},quotes:{intro:"Permit approved. Construction begins.",win:"Another building. Another floor."}},{id:"smotrich",name:"Bezalel Smotrich",nameHe:"בצלאל סמוטריץ'",party:"rzp",role:"Finance Minister",bio:"Holds the Treasury keys and the coalition's purse strings. Taxes are his combo starter.",style:"zoner",stats:{},look:{skin:oe.fair,height:1.08,build:.96,hair:"short",hairColor:Ie.dark,facialHair:"short",facialHairColor:3877407,headwear:"kippah-knit",headwearColor:16053492,outfit:"open-suit",jacket:pt.charcoal,shirt:pt.white,tie:null,pants:pt.charcoal},specials:[{type:"projectile",name:"Tax Hike",prop:"shekel",color:16765286,damage:75,effect:{drain:15},desc:"A coin that steals meter on hit."},{type:"grab",name:"Treasury Lock",prop:"briefcase",color:15167313,damage:175},{type:"rising",name:"Fiscal Surge",color:16032353,damage:125}],ultimate:{type:"megarain",name:"State Budget",color:16765286,prop:"coin"},passive:{id:"deepPockets",name:"Treasury Keys",desc:"Starts every round with half a meter."},quotes:{intro:"Your budget has been... adjusted.",win:"Balanced books."}},{id:"rothman",name:"Simcha Rothman",nameHe:"שמחה רוטמן",party:"rzp",role:"Constitution Committee Chair",bio:"Chairs the Constitution Committee. Drafts bills faster than you can read them.",style:"zoner",stats:{},look:{skin:oe.light,height:1,build:.98,hair:"short",hairColor:3877407,facialHair:"full",facialHairColor:3877407,glasses:"rect",headwear:"kippah-knit",headwearColor:1914199,outfit:"suit",jacket:pt.charcoal,shirt:pt.white,tie:7166330,pants:pt.charcoal},specials:[{type:"projectile",name:"Draft Bill",prop:"book",color:11895693,count:2,damage:48},{type:"trap",name:"Committee Hearing",prop:"clock",color:7166330,effect:{stun:50}},{type:"rising",name:"Second Reading",color:15046811,damage:120}],ultimate:{type:"megabeam",name:"Third Reading",color:7166330,prop:"book"},passive:{id:"chipMaster",name:"Fine Print",desc:"Blocking him still hurts: triple chip damage."},quotes:{intro:"This bill passes in first reading.",win:"Third reading. Passed."}},{id:"strook",name:"Orit Strook",nameHe:"אורית סטרוק",party:"rzp",role:"Minister of National Missions",bio:"Veteran activist who never, ever backs down.",style:"technician",stats:{defense:1.04},look:{skin:oe.light,height:.93,build:.98,hair:"bob",hairColor:9075306,headwear:"hat",headwearColor:4014171,glasses:"round",outfit:"skirt",jacket:4014171,shirt:pt.white,tie:null,pants:4014171,female:!0},specials:[{type:"projectile",name:"Mission Statement",prop:"paper",color:15912079,damage:75},{type:"rush",name:"National Mission",color:14711391,armor:!0,damage:115},{type:"counter",name:"Unyielding",color:8499866,damage:140}],ultimate:{type:"cinematic",name:"Ministry Takeover",color:14711391,prop:"map"},passive:{id:"projectileProof",name:"Hardliner",desc:"Takes half damage from projectiles."},quotes:{intro:"I don't negotiate.",win:"Mission complete."}},{id:"ben-gvir",name:"Itamar Ben-Gvir",nameHe:"איתמר בן גביר",party:"otzma",role:"National Security Minister",bio:"Resigned, returned, and threatened to resign again. Always arrives with the sirens on.",style:"brawler",stats:{power:1.06,weight:1.1},look:{skin:oe.warm,height:1,build:1.16,hair:"short",hairColor:Ie.dark,headwear:"kippah-knit",headwearColor:16053492,outfit:"open-suit",jacket:pt.charcoal,shirt:pt.white,tie:null,pants:pt.charcoal},specials:[{type:"beam",name:"Siren Blast",prop:"siren",color:16720418,length:3.8,damage:110,hits:5},{type:"rush",name:"Police Reform",color:1920728,hits:2,damage:120,armor:!0},{type:"teleport",name:"Resign & Return",color:16766474,mode:"front",attack:!0,desc:"Vanishes from government, then comes right back swinging."}],ultimate:{type:"megarain",name:"National Guard",color:1920728,prop:"siren"},passive:{id:"rage",name:"Comeback Tour",desc:"Deals 25% more damage below 30% health."},quotes:{intro:"Sirens on. Let's go.",win:"Order has been restored. My order."}},{id:"fogel",name:"Zvika Fogel",nameHe:"צביקה פוגל",party:"otzma",role:"Otzma Yehudit MK",bio:"Retired brigadier general. Old school, heavy artillery, zero subtlety.",style:"brawler",stats:{health:1.05,speed:.9},look:{skin:oe.warm,height:1,build:1.12,hair:"buzz",hairColor:13684944,facialHair:"mustache",facialHairColor:13684944,outfit:"open-suit",jacket:5597999,shirt:14211264,tie:null,pants:4147754},specials:[{type:"rain",name:"Artillery Call",prop:"bomb",color:7041116,count:4,damage:34},{type:"rush",name:"Tank Charge",prop:"tank",color:6319160,armor:!0,damage:125,distance:3},{type:"rising",name:"Reserve Duty",color:11109479,damage:120}],ultimate:{type:"megaprojectile",name:"Full Mobilization",color:6319160,prop:"tank"},passive:{id:"heavyArmor",name:"Old General",desc:"Heavy attacks absorb one hit during startup."},quotes:{intro:"In my day we fought without special moves.",win:"Dismissed."}},{id:"maoz",name:"Avi Maoz",nameHe:"אבי מעוז",party:"noam",role:"Noam Chairman",bio:"A one-man faction with a very specific agenda. Fights alone, and likes it.",style:"zoner",stats:{},look:{skin:oe.light,height:.98,build:.98,hair:"short",hairColor:9079434,facialHair:"full",facialHairColor:10132122,glasses:"rect",headwear:"kippah-knit",headwearColor:2236962,outfit:"suit",jacket:pt.charcoal,shirt:pt.white,tie:6182030,pants:pt.charcoal},specials:[{type:"projectile",name:"Pamphlet Barrage",prop:"paper",color:10454720,count:3,damage:36},{type:"shield",name:"One-Man Faction",color:10454720,hits:2},{type:"beam",name:"Agenda Push",prop:"megaphone",color:12490180,length:3.5,hits:4}],ultimate:{type:"megabeam",name:"Single Seat, Full Volume",color:6182030,prop:"megaphone"},passive:{id:"regen",name:"Lone Seat",desc:"Recovers part of his lost health when not taking damage."},quotes:{intro:"I don't need a coalition.",win:"One seat is enough."}},{id:"lieberman",name:"Avigdor Lieberman",nameHe:"אביגדור ליברמן",nick:"Yvet",party:"yb",role:"Yisrael Beiteinu Chairman",bio:"Former nightclub bouncer turned kingmaker. If you're not on the list, you're not getting in.",style:"grappler",stats:{health:1.12,power:1.1,speed:.86,weight:1.3},look:{skin:oe.light,height:1.02,build:1.3,hair:"buzz",hairColor:Ie.grey,facialHair:"short",facialHairColor:Ie.grey,outfit:"open-suit",jacket:pt.charcoal,shirt:pt.white,tie:null,pants:pt.charcoal},specials:[{type:"grab",name:"Bouncer's Grip",color:1914199,damage:190,range:1.35},{type:"rush",name:"Iron Fist",color:2575479,armor:!0,damage:125},{type:"wave",name:"Political Earthquake",prop:"wave",color:6330042,damage:85}],ultimate:{type:"megagrab",name:"You're Not on the List",color:1914199},passive:{id:"bouncer",name:"Bouncer",desc:"Throws deal 60% more damage and reach further."},quotes:{intro:"Name? You're not on the list.",win:"Next."}},{id:"forer",name:"Oded Forer",nameHe:"עודד פורר",party:"yb",role:"Yisrael Beiteinu MK",bio:"Former Agriculture Minister. Lieberman's right hand, and a pretty good left too.",style:"balanced",stats:{},look:{skin:oe.light,height:1.02,build:.96,hair:"short",hairColor:3877407,outfit:"suit",jacket:2575479,shirt:pt.white,tie:10735345,pants:2575479},specials:[{type:"projectile",name:"Watermelon Lob",prop:"watermelon",color:3715072,arc:!0,damage:95},{type:"counter",name:"Committee Chair",color:6330042,damage:140},{type:"rising",name:"Rising Question",color:10735345,damage:120}],ultimate:{type:"cinematic",name:"Commission of Inquiry",color:2575479,prop:"book"},passive:{id:"comboMaster",name:"Loyal Lieutenant",desc:"Combos lose less damage to scaling."},quotes:{intro:"The chairman sends his regards.",win:"Fresh from the field."}},{id:"mansour-abbas",name:"Mansour Abbas",nameHe:"מנסור עבאס",party:"raam",role:"Ra'am Chairman",bio:"Dentist by trade and history-maker by profession: led the first Arab party into a governing coalition.",style:"technician",stats:{},look:{skin:oe.olive,height:1,build:1.02,hair:"short",hairColor:Ie.black,facialHair:"mustache",facialHairColor:Ie.black,outfit:"suit",jacket:pt.charcoal,shirt:pt.white,tie:2976335,pants:pt.charcoal},specials:[{type:"grab",name:"Root Canal",prop:"drill",color:15858414,damage:175},{type:"barrage",name:"Drill Rush",prop:"drill",color:5420936,hits:7,damage:120},{type:"shield",name:"Bridge Builder",color:9819570,hits:2}],ultimate:{type:"megagrab",name:"Painless Extraction",color:16777215,prop:"tooth"},passive:{id:"vampire",name:"Kingmaker",desc:"Heals 12% of the damage he deals."},quotes:{intro:"Open wide. This won't hurt. Much.",win:"Please rinse."}},{id:"odeh",name:"Ayman Odeh",nameHe:"איימן עודה",party:"hadash",role:"Hadash Chairman",bio:"Lawyer and orator who can rally a crowd in two languages.",style:"zoner",stats:{},look:{skin:oe.olive,height:1.02,build:.98,hair:"short",hairColor:Ie.black,facialHair:"stubble",facialHairColor:Ie.black,outfit:"open-suit",jacket:3815994,shirt:pt.white,tie:null,pants:3815994},specials:[{type:"beam",name:"Megaphone",prop:"megaphone",color:14034984,length:4,hits:4,damage:110},{type:"wave",name:"Protest March",prop:"sign",color:16219904,damage:80},{type:"rising",name:"Rising Voice",color:16564041,damage:120}],ultimate:{type:"megarain",name:"Mass Rally",color:14034984,prop:"sign"},passive:{id:"meterBoost",name:"Orator",desc:"Builds Ultimate meter 30% faster."},quotes:{intro:"Let me speak!",win:"The crowd has spoken."}},{id:"tibi",name:"Ahmad Tibi",nameHe:"אחמד טיבי",party:"hadash",role:"Ta'al Chairman",bio:"Physician and the Knesset's sharpest wit. His one-liners leave marks.",style:"technician",stats:{},look:{skin:oe.olive,height:1,build:1.05,hair:"receding",hairColor:10526880,facialHair:"mustache",facialHairColor:10132122,glasses:"rect",outfit:"suit",jacket:pt.charcoal,shirt:pt.white,tie:7864320,pants:pt.charcoal},specials:[{type:"projectile",name:"One-Liner",prop:"star",color:16766474,speed:.24,damage:70},{type:"counter",name:"Witty Retort",color:16761600,damage:150},{type:"heal",name:"Doctor's Orders",color:8454107,amount:90}],ultimate:{type:"cinematic",name:"Standing Ovation",color:16766474,prop:"mic"},passive:{id:"counterPunch",name:"Sharpest Wit",desc:"Counter-hits deal 50% extra damage."},quotes:{intro:"Is that your best line?",win:"The doctor is out."}},{id:"touma-sliman",name:"Aida Touma-Sliman",nameHe:"עאידה תומא-סלימאן",party:"hadash",role:"Hadash MK",bio:"Veteran feminist activist and journalist. The first Arab woman to chair a Knesset committee.",style:"balanced",stats:{},look:{skin:oe.medium,height:.94,build:.95,hair:"bob",hairColor:9079434,glasses:"round",outfit:"blazer",jacket:7864320,shirt:1118481,tie:null,pants:1118481,female:!0},specials:[{type:"projectile",name:"Petition Storm",prop:"paper",color:16777215,count:3,damage:38},{type:"rush",name:"Equal Rights Rush",color:12653087,damage:115,hits:2},{type:"rising",name:"Status Check",color:16741775,damage:120}],ultimate:{type:"megarain",name:"Women's March",color:12653087,prop:"sign"},passive:{id:"thickSkin",name:"Seasoned Activist",desc:"Takes 14% less damage."},quotes:{intro:"I've been fighting longer than you've been in politics.",win:"Equality: achieved."}},{id:"kariv",name:"Gilad Kariv",nameHe:"גלעד קריב",party:"democrats",role:"The Democrats MK",bio:"Reform rabbi and legislator. Amends opponents clause by clause.",style:"technician",stats:{},look:{skin:oe.light,height:1,build:1,hair:"short",hairColor:3877407,facialHair:"short",facialHairColor:3877407,glasses:"round",headwear:"kippah-knit",headwearColor:12653087,outfit:"suit",jacket:pt.charcoal,shirt:pt.white,tie:12653087,pants:pt.charcoal},specials:[{type:"projectile",name:"Amendment",prop:"paper",color:15672124,damage:75},{type:"trap",name:"Parliamentary Question",prop:"clock",color:9279918,effect:{stun:45}},{type:"rising",name:"Reform Rising",color:15672124,damage:120}],ultimate:{type:"megabeam",name:"Constitutional Crisis",color:15672124,prop:"book"},passive:{id:"powerSurge",name:"Legislator",desc:"Special moves deal 20% more damage."},quotes:{intro:"I'd like to propose an amendment. To your face.",win:"Amendment adopted."}},{id:"lazimi",name:"Naama Lazimi",nameHe:"נעמה לזימי",party:"democrats",role:"The Democrats MK",bio:"Grassroots social activist. Brings the protest to the plenum, and the plenum to the street.",style:"rushdown",stats:{speed:1.03},look:{skin:oe.fair,height:.94,build:.9,hair:"curly",hairColor:2825492,outfit:"tshirt",jacket:14035001,shirt:14035001,tie:null,pants:2834278,female:!0},specials:[{type:"projectile",name:"Protest Sign",prop:"sign",color:14035001,damage:80},{type:"rush",name:"Kaplan March",color:16731501,hits:3,damage:120},{type:"spin",name:"Social Justice Kick",color:16748451,hits:4,damage:105}],ultimate:{type:"megarain",name:"Mass Protest",color:14035001,prop:"sign"},passive:{id:"swift",name:"Grassroots",desc:"Moves 18% faster."},quotes:{intro:"We're not going home.",win:"The street has spoken."}}],Bu=Object.fromEntries(Ee.map(s=>[s.id,s]));function _y(s){return{...s,boss:!0,name:s.name,role:`FINAL BOSS · ${s.role}`}}const Yi=[{id:"plenum",kind:"plenum",name:"The Plenum",nameHe:"מליאת הכנסת",desc:"The horseshoe of power. Mind the government table.",music:{bpm:138,root:45,mode:"minor",intensity:1}},{id:"plaza",kind:"plaza",name:"Menorah Plaza",nameHe:"רחבת המנורה",desc:"Outside the Knesset, in the shadow of the great Menorah.",music:{bpm:128,root:50,mode:"dorian",intensity:.8}},{id:"committee",kind:"committee",name:"Finance Committee",nameHe:"ועדת הכספים",desc:"Where budgets are born and coalitions are bought.",music:{bpm:120,root:43,mode:"phrygian",intensity:.7}},{id:"beach",kind:"beach",name:"Tel Aviv Beach",nameHe:"חוף תל אביב",desc:"Sunset on Gordon Beach. Matkot players look on.",music:{bpm:124,root:48,mode:"major",intensity:.8}},{id:"market",kind:"market",name:"Mahane Yehuda",nameHe:"שוק מחנה יהודה",desc:"The shuk after dark. Every politician campaigns here eventually.",music:{bpm:132,root:47,mode:"phrygian",intensity:.9}},{id:"rooftop",kind:"rooftop",name:"Azrieli Rooftop",nameHe:"גג עזריאלי",desc:"High above Tel Aviv. Round, square and triangle towers.",music:{bpm:146,root:44,mode:"minor",intensity:1}}],gf=Object.fromEntries(Yi.map(s=>[s.id,s])),yy=["Backbencher","Committee Member","Minister","Prime Minister","Supreme Court"],zu=[{reaction:30,block:.12,aggression:.3,combo:.1,antiAir:.1,tech:0,interval:26,punish:.05,step:.05,juggle:.1},{reaction:20,block:.35,aggression:.45,combo:.35,antiAir:.3,tech:.2,interval:18,punish:.25,step:.12,juggle:.35},{reaction:13,block:.6,aggression:.55,combo:.6,antiAir:.55,tech:.4,interval:12,punish:.5,step:.22,juggle:.6},{reaction:8,block:.8,aggression:.65,combo:.85,antiAir:.8,tech:.6,interval:8,punish:.75,step:.32,juggle:.85},{reaction:4,block:.93,aggression:.75,combo:1,antiAir:.95,tech:.8,interval:5,punish:.95,step:.42,juggle:1}],Hu=new Set(["projectile","beam","wave","rain","trap"]),My=new Set(["rush","dive","slam","teleport","spin","pull"]),Sy=new Set(["grab","barrage"]),Gu=new Set(["rising","counter"]),by=new Set(["buff","heal","shield"]);class al{lv;plan=[];seed;threatTimer=0;decidedThreat=!1;lastMoveKey="";techTried=!1;wakeDelay=0;punished=-1;juggled=-1;idle=0;constructor(t,e=1234){this.lv=zu[Math.max(0,Math.min(zu.length-1,t))],this.seed=e}rand(){return this.seed=this.seed*1103515245+12345&2147483647,this.seed/2147483647}reset(){this.plan=[],this.threatTimer=0,this.decidedThreat=!1}next(t,e){if(e.phase!=="fight")return this.plan=[],t.noGuard=!1,Xe;const i=t.opponent,n=t.facing,r={FWD:n>0?6:4,BACK:n>0?4:6,DBACK:n>0?1:3,DFWD:n>0?3:1,UFWD:n>0?9:7},a=t.distTo(i);if(t.state==="thrown")return!this.techTried&&t.stateFrame>=2&&(this.techTried=!0,this.rand()<this.lv.tech)?{dir:5,held:at.TH,pressed:at.TH}:Xe;if(t.state==="juggle")return this.plan=[],!this.techTried&&t.vy<0&&t.y<.35&&(this.techTried=!0,this.rand()<this.lv.tech)?this.press(at.LP,5):Xe;if(this.techTried=!1,t.state==="knockdown")return this.plan=[],t.stateFrame===1&&(this.wakeDelay=Math.floor(this.rand()*26)),t.stateFrame>=16+this.wakeDelay?{dir:r.BACK,held:0,pressed:0}:Xe;if(t.state==="attack"&&t.move&&t.moveHitConfirmed){const f=`${t.move.id}:${e.frame-t.moveFrame}`;if(f!==this.lastMoveKey&&(this.lastMoveKey=f,t.move.kind==="normal"&&t.move.cancel&&t.move.tag!=="launcher"&&this.rand()<this.lv.combo*.6)){if(this.plan=[],t.meter>=100&&this.ultInRange(t,a)&&this.rand()<.6)return this.press(at.UL,5);const u=this.pickSpecial(t,a,["rush","rising","barrage","spin","projectile","beam","pull","grab"]);if(u>=0)return this.press(at.SP,u===2?2:u===1?r.FWD:5)}}const o=t.actionable||t.state==="blockstun"||t.state==="dash"||t.state==="run";if(i.state==="juggle"&&i.juggleCount<=3&&o&&a<2.6&&i.y>.25&&this.juggled!==i.juggleCount&&(this.juggled=i.juggleCount,this.rand()<this.lv.juggle))return this.plan=this.jugglePlan(a,r),t.noGuard=!1,this.plan.shift();if(i.state!=="juggle"&&(this.juggled=-1),this.plan.length){const f=this.plan.shift();return(t.state==="hitstun"||t.state==="wallsplat")&&(this.plan=[]),f}const l=i.move;if(l&&i.state==="attack"&&i.moveFrame>l.startup+l.active&&this.punished!==e.frame-i.moveFrame){const f=l.startup+l.active+l.recovery-i.moveFrame-(t.state==="blockstun"?t.stun:0);if(f>=10&&a<1.9&&(o||t.state==="blockstun")&&(this.punished=e.frame-i.moveFrame,this.rand()<this.lv.punish))return t.noGuard=!1,this.plan=f>=16&&a<1.4?[this.pressFrame(at.HP,r.DFWD),...this.hold(5,20)]:[this.pressFrame(at.LP,5),...this.hold(5,4),this.pressFrame(at.HP,5),...this.hold(5,14)],this.plan.shift()}if(!o&&t.state!=="air")return Xe;const c=e.isThreatened(t);if(c?(this.threatTimer++,this.decidedThreat||(t.noGuard=!0)):(this.threatTimer=0,this.decidedThreat=!1,t.noGuard=!1),c&&this.threatTimer>=this.lv.reaction&&!this.decidedThreat&&t.grounded){this.decidedThreat=!0;const f=i.move?.hit?.guard,u=!!i.move&&!i.move.track&&(i.move.hitbox?.lw??.26)<.5&&!i.move.hit?.tracking,d=this.rand();if(u&&i.moveFrame<(i.move?.startup??0)-6&&d<this.lv.step)return t.noGuard=!1,this.plan=[this.pressFrame(at.SS,this.rand()<.5?2:5),...this.hold(5,12)],this.plan.shift();if(this.rand()<this.lv.block)return t.noGuard=!1,f==="high"&&this.rand()<.35?this.plan=[...this.hold(2,14),this.pressFrame(at.HP,5),...this.hold(5,16)]:this.plan=this.hold(f==="low"?r.DBACK:5,14),this.plan.shift()}if(t.state==="blockstun")return{dir:i.move?.hit?.guard==="low"?r.DBACK:5,held:0,pressed:0};if(t.state==="air")return Xe;if(!i.grounded&&(i.state==="air"||i.state==="attack"&&!!i.move?.air)&&a<3&&!this.decidedThreat&&this.rand()<this.lv.antiAir*.2){this.decidedThreat=!0;const f=this.findSpecial(t,Gu);return f>=0&&t.moves.specials[f].tag==="rising"?this.press(at.SP,f===2?2:f===1?r.FWD:5):this.press(at.HP,r.DFWD)}return this.idle++,this.idle<this.lv.interval?a>3&&this.rand()<this.lv.aggression?{dir:r.FWD,held:0,pressed:0}:Xe:(this.idle=0,this.decide(t,e,a,r),this.plan.shift()??Xe)}jugglePlan(t,e){const i=[];t>1.4&&i.push(this.pressFrame(0,e.FWD),...this.hold(5,1),this.pressFrame(0,e.FWD),...this.hold(e.FWD,3));const n=this.rand();return n<.5?i.push(this.pressFrame(at.LP,5),...this.hold(5,6),this.pressFrame(at.LP,5),...this.hold(5,6),this.pressFrame(at.HP,5),...this.hold(5,18)):n<.8?i.push(this.pressFrame(at.LP,5),...this.hold(5,12),this.pressFrame(at.LK,5),...this.hold(5,6),this.pressFrame(at.HK,5),...this.hold(5,22)):i.push(this.pressFrame(at.HP,5),...this.hold(5,6),this.pressFrame(at.LP,5),...this.hold(5,18)),i}decide(t,e,i,n){const r=this.rand(),a=this.lv.aggression;if(t.meter>=100&&this.ultInRange(t,i)&&r<.35){this.plan=[this.pressFrame(at.UL,5)];return}if(i>4.2){const c=this.findSpecial(t,Hu,e),h=this.findSpecial(t,by,e);if(c>=0&&r<.35)return this.useSpecial(c,n.FWD);if(h>=0&&r<.45)return this.useSpecial(h,n.FWD);if(r<.55){this.plan=[this.pressFrame(0,n.FWD),...this.hold(5,1),this.pressFrame(0,n.FWD),...this.hold(n.FWD,16)];return}if(r<.75){this.plan=[this.pressFrame(0,n.FWD),...this.hold(5,1),...this.hold(n.FWD,16),this.pressFrame(at.HP,n.FWD),...this.hold(5,26)];return}this.plan=this.hold(n.FWD,20);return}if(i>2.1){const c=this.findSpecial(t,My,e),h=this.findSpecial(t,Hu,e);if(c>=0&&r<.2*(.5+a))return this.useSpecial(c,n.FWD);if(h>=0&&r<.35)return this.useSpecial(h,n.FWD);if(r<.5){this.plan=[this.pressFrame(0,n.FWD),...this.hold(5,1),this.pressFrame(0,n.FWD),...this.hold(n.FWD,8),this.pressFrame(at.LK,5),...this.hold(5,16)];return}if(r<.62){this.plan=[this.pressFrame(at.SS,this.rand()<.5?2:5),...this.hold(5,14)];return}if(r<.72+a*.1){this.plan=[...this.hold(n.FWD,6),this.pressFrame(at.HK,n.UFWD),...this.hold(5,28)];return}if(r<.88){this.plan=this.hold(n.FWD,14);return}this.plan=[this.pressFrame(0,n.BACK),...this.hold(5,1),this.pressFrame(0,n.BACK),...this.hold(5,12)];return}const o=this.findSpecial(t,Sy,e);if(o>=0&&i<1.3&&r<.12)return this.useSpecial(o,n.FWD);if(i<1.05&&r<.18){this.plan=[this.pressFrame(at.TH,5),...this.hold(5,10)];return}const l=this.rand();if(l<.18)this.plan=[this.pressFrame(at.LP,5),...this.hold(5,5),this.pressFrame(at.LP,5),...this.hold(5,5),this.pressFrame(at.HP,5),...this.hold(5,10)];else if(l<.3)this.plan=[this.pressFrame(at.LP,n.DFWD),...this.hold(5,18)];else if(l<.4)this.plan=[this.pressFrame(at.LK,5),...this.hold(5,6),this.pressFrame(at.HK,5),...this.hold(5,22)];else if(l<.5)this.plan=this.rand()<.6?[this.pressFrame(at.HK,2),...this.hold(2,4),...this.hold(5,14)]:[this.pressFrame(at.HK,n.DBACK),...this.hold(5,32)];else if(l<.58)this.plan=[this.pressFrame(at.HP,n.DFWD),...this.hold(5,28)];else if(l<.66)this.plan=[this.pressFrame(at.HP,n.FWD),...this.hold(5,26)];else if(l<.74)this.plan=[this.pressFrame(0,n.BACK),...this.hold(5,1),this.pressFrame(0,n.BACK),...this.hold(5,14)];else if(l<.82)this.plan=[this.pressFrame(at.SS,this.rand()<.5?2:5),...this.hold(5,10)];else if(l<.9)this.plan=this.hold(5,12);else{const c=this.findSpecial(t,Gu,e);if(c>=0)return this.useSpecial(c,n.FWD);this.plan=[this.pressFrame(at.LK,2),...this.hold(2,8)]}}ultInRange(t,e){switch(t.moves.ultimate.tag){case"cinematic":return e<3.2;case"megagrab":return e<1.6;default:return!0}}findSpecial(t,e,i){const n=[];return t.moves.specials.forEach((r,a)=>{e.has(r.tag??"")&&(!i||t.canUse(r,i))&&n.push(a)}),n.length?n[Math.floor(this.rand()*n.length)]:-1}pickSpecial(t,e,i){for(const n of i){const r=t.moves.specials.findIndex(a=>a.tag===n);if(r>=0){if((n==="grab"||n==="barrage")&&e>1.4)continue;return r}}return-1}useSpecial(t,e){const i=t===2?2:t===1?e:5;this.plan=[this.pressFrame(at.SP,i),...this.hold(5,12)]}press(t,e){return this.pressFrame(t,e)}pressFrame(t,e){return{dir:e,held:t,pressed:t}}hold(t,e){const i=[];for(let n=0;n<e;n++)i.push({dir:t,held:0,pressed:0});return i}}function wy(s,t,e,i){const n=t.facing;switch(s!=="cpu"&&(t.noGuard=s!=="block"),s){case"stand":return Xe;case"crouch":return{dir:2,held:0,pressed:0};case"jump":return{dir:8,held:0,pressed:0};case"block":return{dir:t.opponent.move?.hit?.guard==="low"?n>0?1:3:5,held:0,pressed:0};case"cpu":return i?i.next(t,e):Xe}}const dc=new Map;function Ey(s){return iy(s)??dc.get(s)}async function Ty(s,t){const i=document.createElement("canvas");i.width=192,i.height=192;let n;try{n=new Jd({canvas:i,antialias:!0,alpha:!0,preserveDrawingBuffer:!0})}catch{return}n.setSize(192,192,!1),n.outputColorSpace=je,n.toneMapping=Ka,n.setClearColor(0,0);const r=new bd;r.add(new zd(16777215,4477030,1.5));const a=new Ha(16777215,2.6);a.position.set(1.5,2.5,3),r.add(a);const o=new Ha(11193599,1.6);o.position.set(-2,1.5,-2),r.add(o);const l=new vi(24,1,.1,20);for(let c=0;c<s.length;c++){const h=s[c];if(dc.has(h.id))continue;const f=ef(h);w_(f),f.root.rotation.y=.35,r.add(f.root),f.root.updateMatrixWorld(!0);const u=new R;f.head.getWorldPosition(u),u.y+=.1*h.look.height,l.position.set(u.x+.25,u.y+.05,u.z+1.35),l.lookAt(u.x,u.y-.08,u.z);const d=Fn[h.party];n.setClearColor(d.color,1),n.render(r,l),dc.set(h.id,i.toDataURL("image/png")),r.remove(f.root),nf(f),t?.(c+1,s.length),c%4===3&&await new Promise(p=>setTimeout(p,0))}n.dispose(),n.forceContextLoss()}function Ct(s){return s.replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}function Vt(s,t="",e=""){const i=document.createElement(s);return t&&(i.className=t),e&&(i.innerHTML=e),i}function Lr(s){return"#"+s.toString(16).padStart(6,"0")}function fc(s){let t=s>>16&255,e=s>>8&255,i=s&255;const n=.299*t+.587*e+.114*i;if(n<140){const a=(140-n)/(255-n+1);t=Math.round(t+(255-t)*a*1.4),e=Math.round(e+(255-e)*a*1.4),i=Math.round(i+(255-i)*a*1.4)}const r=a=>Math.max(0,Math.min(255,a));return`rgb(${r(t)},${r(e)},${r(i)})`}function en(s,t=""){const e=Ey(s.id);if(e)return`<img class="${t}" src="${e}" alt="${Ct(s.name)}" draggable="false">`;const i=s.name.split(" ").map(n=>n[0]).join("").slice(0,2);return`<div class="${t} init" style="background:${Lr(Fn[s.party].color)}">${Ct(i)}</div>`}function vf(s){const t=Fn[s.party];return`<span class="chip" style="background:${Lr(t.color)};color:#fff">${Ct(t.name)} · <span class="he">${Ct(t.nameHe)}</span></span>`}class Ks{constructor(t,e,i={}){this.items=t,this.audio=e,this.el=Vt("div","menu"),i.desc&&(this.descEl=Vt("div","desc")),this.build()}items;audio;el;index=0;descEl=null;itemEls=[];setItems(t){this.items=t,this.index=Math.min(this.index,t.length-1),this.build()}build(){this.el.innerHTML="",this.itemEls=this.items.map((t,e)=>{const i=Vt("div","item");return i.addEventListener("mouseenter",()=>{this.index!==e&&(this.index=e,this.render())}),i.addEventListener("click",()=>{this.index=e,this.activate()}),this.el.appendChild(i),i}),this.descEl&&this.el.appendChild(this.descEl),this.render()}render(){this.items.forEach((t,e)=>{const i=this.itemEls[e],n=t.value?`<span class="val">◀ ${Ct(t.value())} ▶</span>`:"";i.innerHTML=`<span>${Ct(t.label)}</span>${n}`,i.classList.toggle("sel",e===this.index),i.classList.toggle("disabled",!!t.disabled)}),this.descEl&&(this.descEl.textContent=this.items[this.index]?.desc??"")}activate(){const t=this.items[this.index];!t||t.disabled||(t.onSelect?(this.audio.sfx("menuConfirm"),t.onSelect()):t.onRight&&(this.audio.sfx("menuMove"),t.onRight(),this.render()))}handle(t){const e=this.items.length;t.up?(this.index=(this.index-1+e)%e,this.audio.sfx("menuMove"),this.render()):t.down?(this.index=(this.index+1)%e,this.audio.sfx("menuMove"),this.render()):t.left&&this.items[this.index]?.onLeft?(this.items[this.index].onLeft(),this.audio.sfx("menuMove"),this.render()):t.right&&this.items[this.index]?.onRight?(this.items[this.index].onRight(),this.audio.sfx("menuMove"),this.render()):t.confirm&&this.activate()}}const Ca={qcf:"↓↘→",qcb:"↓↙←",dp:"→↓↘",dqcf:"↓↘→↓↘→"},Ay=48;function Cy(s){switch(s){case 1:return 3;case 3:return 1;case 4:return 6;case 6:return 4;case 7:return 9;case 9:return 7;default:return s}}function ol(s,t){return t>=0?s:Cy(s)}const Kn=s=>s===1||s===2||s===3,ya=s=>s===7||s===8||s===9,Vu=s=>s===1||s===4||s===7,Ti=s=>t=>t===s,fn=(...s)=>t=>s.includes(t),Py={qcf:[fn(2,1),Ti(3),fn(6,9)],qcb:[fn(2,3),Ti(1),fn(4,7)],dp:[fn(6,9,3),Ti(2),fn(3,6)],dqcf:[fn(2,1),Ti(3),fn(6,9),Ti(2),Ti(3),fn(6,9)],dashF:[Ti(6),Ti(5),Ti(6)],dashB:[Ti(4),Ti(5),Ti(4)]};class Ry{dirs=[];presses=[];consumed=[];push(t,e){this.dirs.push(t),this.presses.push(e),this.consumed.push(0),this.dirs.length>Ay&&(this.dirs.shift(),this.presses.shift(),this.consumed.shift())}clear(){this.dirs.length=0,this.presses.length=0,this.consumed.length=0}buffered(t,e=ch){let i=0;const n=this.presses.length;for(let r=Math.max(0,n-e);r<n;r++)i|=this.presses[r]&~this.consumed[r]&t;return i}consume(t,e=ch){const i=this.presses.length;for(let n=Math.max(0,i-e);n<i;n++)this.consumed[n]|=this.presses[n]&t}pressedTogether(t,e,i=3){return(this.buffered(t,i)&t)!==0&&(this.buffered(e,i)&e)!==0}motion(t,e=rp,i=8){const n=Py[t],r=this.dirs,a=r.length,o=t==="dqcf"?e*2:e,l=Math.max(0,a-o);let c=n.length-1,h=a-1,f=!1;for(;h>=Math.max(l,a-i);h--)if(n[c](r[h])){f=!0;break}if(!f)return!1;for(c--,h=h-1;h>=l&&c>=0;h--)n[c](r[h])&&c--;return c<0}dash(t){const e=this.dirs.length;if(e<3)return!1;const i=t?6:4;if(this.dirs[e-1]!==i||this.dirs[e-2]===i)return!1;let n=!1;for(let r=e-2;r>=Math.max(0,e-14);r--){const a=this.dirs[r];if(a===5)n=!0;else{if(a===i&&n)return!0;if(a!==5)return!1}}return!1}}const Wi=(s,t,e=.26)=>({x:s,y:1.46,w:t,h:.34,lw:e}),Xi=(s,t,e=.26)=>({x:s,y:1.1,w:t,h:.56,lw:e}),ll=(s,t,e=.3)=>({x:s,y:.24,w:t,h:.42,lw:e}),xf=[{id:"jab",name:"Jab",input:"1",anim:"jab",i:10,a:2,r:16,box:Wi(.62,.62),dmg:30,hs:24,bs:17,guard:"high",push:.05,strings:{LP:"jab2",HP:"onetwo"},desc:"Fastest move. Beats almost everything up close."},{id:"jab2",name:"Double Jab",input:"1,1",anim:"jab2",i:10,a:2,r:17,box:Wi(.62,.62),dmg:30,hs:24,bs:17,guard:"high",push:.06,strings:{HP:"onetwo"}},{id:"onetwo",name:"One-Two",input:"1,2",anim:"straight",i:10,a:3,r:20,box:Wi(.7,.7),dmg:45,hs:26,bs:18,guard:"high",push:.1,heavy:!0,desc:"Classic natural combo."},{id:"straight",name:"Right Straight",input:"2",anim:"straight",i:12,a:3,r:20,box:Wi(.72,.7),dmg:45,hs:25,bs:17,guard:"high",push:.08,strings:{LP:"hook21"}},{id:"hook21",name:"Straight-Hook",input:"2,1",anim:"hook",i:13,a:3,r:24,box:Wi(.66,.7,.4),dmg:55,hs:28,bs:16,guard:"high",push:.16,heavy:!0},{id:"lkick",name:"Left Mid Kick",input:"3",anim:"midKick",i:13,a:3,r:20,box:Xi(.8,.8),dmg:40,hs:24,bs:16,guard:"mid",push:.08,strings:{HK:"kick34"},desc:"Fast mid: forces the opponent to stand."},{id:"kick34",name:"Kick Combo",input:"3,4",anim:"highKick",i:14,a:3,r:26,box:Wi(.86,.9,.45),dmg:60,hs:26,bs:14,guard:"high",push:.14,heavy:!0,knockdown:!0,screw:!0},{id:"rkick",name:"Right High Kick",input:"4",anim:"highKick",i:12,a:3,r:22,box:Wi(.86,.9,.42),dmg:55,hs:26,bs:16,guard:"high",push:.1,heavy:!0,track:.03,strings:{HK:"kick44"}},{id:"kick44",name:"Double Kick",input:"4,4",anim:"kick2",i:15,a:3,r:26,box:Xi(.9,.9),dmg:60,hs:28,bs:14,guard:"mid",push:.2,heavy:!0,wall:!0},{id:"dfJab",name:"Body Jab",input:"d/f+1",anim:"dfJab",i:13,a:2,r:18,box:Xi(.66,.64),dmg:35,hs:24,bs:17,guard:"mid",push:.06,strings:{HP:"dfJab2"},desc:"Safe mid poke."},{id:"dfJab2",name:"Body Jab-Straight",input:"d/f+1,2",anim:"straight",i:14,a:3,r:22,box:Wi(.72,.7),dmg:45,hs:26,bs:16,guard:"high",push:.12,heavy:!0},{id:"launcher",name:"Launcher Uppercut",input:"d/f+2",anim:"launcher",i:15,a:3,r:28,box:{x:.52,y:1.2,w:.7,h:.9,lw:.28},dmg:50,hs:30,bs:14,guard:"mid",push:.04,heavy:!0,launch:.17,desc:"Launches on hit: follow up with a juggle combo. Punishable on block."},{id:"dfKick",name:"Front Kick",input:"d/f+3",anim:"frontKick",i:14,a:3,r:22,box:Xi(.84,.8),dmg:45,hs:24,bs:16,guard:"mid",push:.1},{id:"dfKick4",name:"Side Kick",input:"d/f+4",anim:"kick2",i:14,a:3,r:22,box:Xi(.9,.84),dmg:50,hs:24,bs:16,guard:"mid",push:.14},{id:"power",name:"Power Straight",input:"f+2",anim:"power",i:15,a:3,r:24,box:Xi(.8,.8),dmg:60,hs:28,bs:16,guard:"mid",push:.24,heavy:!0,wall:!0,crumpleCH:!0,motion:[{from:4,to:14,vx:.04}],desc:"Big knockback; crumples on counter hit; wall splats."},{id:"knee",name:"Step-in Knee",input:"f+4",anim:"knee",i:16,a:3,r:24,box:Xi(.62,.66),dmg:60,hs:28,bs:15,guard:"mid",push:.12,heavy:!0,motion:[{from:3,to:15,vx:.05}]},{id:"elbow",name:"Elbow",input:"b+1",anim:"elbow",i:13,a:3,r:20,box:Xi(.56,.6),dmg:45,hs:25,bs:16,guard:"mid",push:.1},{id:"bhook",name:"Heavy Hook",input:"b+2",anim:"bHook",i:15,a:3,r:24,box:Wi(.64,.72,.5),dmg:60,hs:28,bs:15,guard:"high",push:.18,heavy:!0,track:.04},{id:"spin4",name:"Spinning Heel",input:"b+4",anim:"spinBack",i:18,a:4,r:26,box:Wi(.9,1,.9),dmg:75,hs:30,bs:14,guard:"high",push:.18,heavy:!0,knockdown:!0,screw:!0,track:.08,desc:"Homing: catches sidesteps. Screws juggles."},{id:"dJab",name:"Crouch Jab",input:"d+1",anim:"dJab",i:10,a:2,r:16,box:{x:.6,y:.82,w:.6,h:.3,lw:.26},dmg:20,hs:22,bs:16,guard:"mid",push:.05,low:!0},{id:"dStraight",name:"Crouch Straight",input:"d+2",anim:"dStraight",i:12,a:3,r:20,box:{x:.68,y:.85,w:.7,h:.34,lw:.26},dmg:30,hs:24,bs:16,guard:"mid",push:.08,low:!0},{id:"lowKick",name:"Low Kick",input:"d+3",anim:"lowKick",i:16,a:3,r:24,box:ll(.82,.8),dmg:30,hs:22,bs:13,guard:"low",push:.06,low:!0,otg:!0},{id:"shin",name:"Shin Kick",input:"d+4",anim:"shin",i:12,a:2,r:20,box:ll(.78,.74),dmg:20,hs:20,bs:13,guard:"low",push:.05,low:!0,otg:!0,desc:"Fast low. Hits grounded opponents."},{id:"sweep",name:"Sweep",input:"d/b+4",anim:"sweep",i:20,a:4,r:30,box:ll(.96,1,.6),dmg:60,hs:24,bs:12,guard:"low",push:.1,heavy:!0,low:!0,knockdown:!0,launch:.1,otg:!0,track:.04,desc:"Low knockdown. Very punishable on block."},{id:"ufKnee",name:"Rising Knee",input:"u/f+4",anim:"ufKnee",i:15,a:4,r:28,box:{x:.5,y:1.15,w:.7,h:.8,lw:.28},dmg:50,hs:30,bs:14,guard:"mid",push:.04,heavy:!0,launch:.165,motion:[{from:2,to:16,vx:.04}],desc:"Launcher that hops over lows."},{id:"ws2",name:"Rising Uppercut",input:"WS 2",anim:"wsUpper",i:14,a:3,r:26,box:{x:.52,y:1.2,w:.7,h:1,lw:.28},dmg:50,hs:30,bs:14,guard:"mid",push:.04,heavy:!0,launch:.175,desc:"While standing up from a crouch: launcher."},{id:"ws4",name:"Rising Kick",input:"WS 4",anim:"wsKick",i:12,a:3,r:22,box:Xi(.84,.84),dmg:45,hs:26,bs:15,guard:"mid",push:.14,heavy:!0},{id:"dash2",name:"Dash Punch",input:"f,f+2",anim:"dashPunch",i:16,a:3,r:26,box:Xi(.82,.8),dmg:70,hs:30,bs:14,guard:"mid",push:.3,heavy:!0,wall:!0,motion:[{from:1,to:14,vx:.09}],desc:"Dashing blow: huge knockback, wall splats."},{id:"jPunch",name:"Jumping Punch",input:"jump 1/2",anim:"jPunch",i:8,a:6,r:6,box:{x:.56,y:.8,w:.62,h:.44,lw:.28},dmg:40,hs:22,bs:15,guard:"high",push:.06,air:!0},{id:"jKick",name:"Jumping Kick",input:"jump 3/4",anim:"jKick",i:9,a:6,r:6,box:{x:.7,y:.45,w:.8,h:.5,lw:.3},dmg:55,hs:24,bs:15,guard:"mid",push:.08,heavy:!0,air:!0}],Ly=xf.map(s=>({id:s.id,name:s.name,input:s.input,desc:s.desc,guard:s.guard})),ky={balanced:{startup:0,heavyStartup:0,recovery:0,damage:1,reach:0,hitstun:0},rushdown:{startup:-1,heavyStartup:-1,recovery:0,damage:.94,reach:-.03,hitstun:0},brawler:{startup:0,heavyStartup:1,recovery:1,damage:1.12,reach:0,hitstun:1},grappler:{startup:0,heavyStartup:1,recovery:0,damage:1.05,reach:0,hitstun:0},zoner:{startup:0,heavyStartup:0,recovery:0,damage:.95,reach:.1,hitstun:0},technician:{startup:0,heavyStartup:0,recovery:-1,damage:1,reach:.04,hitstun:1}},_f={balanced:"All-rounder",rushdown:"Rushdown: fast pokes, fast feet",brawler:"Brawler: slower, hits harder",grappler:"Grappler: huge throws, sturdy",zoner:"Zoner: long reach, keeps you out",technician:"Technician: tight frames, big combos"};function Iy(s,t){const e=ky[s],i={};for(const n of xf){const r=Math.max(6,n.i-1+e.startup+(n.heavy?e.heavyStartup:0)),a=Math.max(4,n.r+e.recovery),o=n.heavy?e.reach:e.reach*.5,l={damage:Math.round(n.dmg*e.damage*t),chip:0,hitstun:n.hs+e.hitstun,blockstun:n.bs,guard:n.guard,pushback:n.push,spark:n.heavy?"heavy":"light",knockdown:n.knockdown,launch:n.launch??(n.knockdown?.12:void 0),launchVx:(n.launch??0)>=Pa?.012:void 0,meterGain:n.heavy?6:3,screw:n.screw,wall:n.wall,crumpleCH:n.crumpleCH,otg:n.otg,tracking:(n.box.lw??0)>=.8};i[n.id]={id:n.id,name:n.name,kind:"normal",anim:n.anim,startup:r,active:n.a,recovery:a,hitbox:{...n.box,x:n.box.x+o/2,w:n.box.w+o},hit:l,air:n.air,lowProfile:n.low,strings:n.strings,track:n.track,hitRecovery:(n.launch??0)>=Pa?8:void 0,cancel:["special","super"],motion:n.motion,tag:n.launch&&!n.knockdown?"launcher":n.heavy?"heavy":"light",desc:n.desc}}return i}function Dy(s,t){const e=s==="grappler";return{id:"throw",name:"Throw",kind:"throw",anim:"throw",startup:11,active:2,recovery:28,throwRange:1+(e?.2:0)+(t?.25:0),throwDamage:Math.round(120*(e?1.4:1)*(t?1.6:1)),techable:!0,tag:"throw"}}function We(s,t={}){return{damage:s,chip:Math.round(s*.15),hitstun:22,blockstun:17,guard:"mid",pushback:.12,spark:"special",meterGain:8,...t}}const kn=(s,t,e)=>t+(e-t)*s.strength,Uy={projectile:"Fires a projectile.",rush:"Charges forward with a strike.",rising:"Invincible rising anti-air.",grab:"Unblockable command grab.",counter:"Counter stance: absorbs a strike and retaliates.",buff:"Temporary power-up.",heal:"Recovers health (vulnerable).",teleport:"Vanishes and reappears.",wave:"Ground wave: must be blocked low or jumped.",dive:"Diving kick (also works in the air).",trap:"Places a trap on the floor.",beam:"Short-range multi-hit beam.",pull:"Long reach strike that yanks the opponent in.",slam:"Leaps at the opponent and slams down (overhead).",rain:"Calls objects down on the opponent.",shield:"Raises a barrier.",spin:"Spinning multi-hit advance, passes over lows.",barrage:"Rapid flurry of blows."};function yf(s){return s.desc??Uy[s.type]}function Fy(s,t){const e=`sp${t}`,i={id:e,name:s.name,kind:"special",color:s.color,tag:s.type,desc:yf(s),cancel:["super"]};switch(s.type){case"projectile":{const n=s.count??1,r=s.damage??(n>1?45:80),a=s.size??1,o=`${e}`,l=13,c=7;return{...i,anim:"cast",prop:s.prop,startup:l,active:1+(n-1)*c,recovery:26,canStart:(h,f)=>!f.hasProjectile(h,o),onFrame:(h,f)=>{const u=(f-l)/c;if(f<l||u!==Math.floor(u)||u>=n)return;const d=h.fighter,p=(s.speed??.16)*kn(h,.85,1.15)*(s.arc?.62:1),x=n>1&&!s.arc?(u-(n-1)/2)*.012:0;h.match.spawnProjectile(d,{...d.ahead(.8),y:s.arc?1.7:1.25,speed:p,vy:s.arc?.14+.03*h.strength:x,gravity:s.arc?.0085:0,w:.5*a,h:.45*a,hit:We(r,{effect:s.effect,knockdown:r>=100,launch:r>=100?.15:void 0}),prop:s.prop,color:s.color,hits:s.hits??1,rehit:7,life:200,homing:s.homing?1:0,tag:o,scale:a})}}}case"rush":{const n=s.hits??1,r=s.damage??110,a=Math.round(r/n),o=10,l=18;return{...i,anim:"charge",prop:s.prop,startup:o,active:l,recovery:20,hitbox:{x:.62,y:1.1,w:.9,h:1.1,lw:.34},track:.06,hit:We(a,{pushback:n>1?.03:.16,hitstun:n>1?18:24,knockdown:n===1&&!!s.launch,launch:n===1&&s.launch?.24:void 0}),finalHit:n>1?{pushback:.18,knockdown:!0,launch:s.launch?.24:.12}:void 0,rehit:n>1?5:void 0,maxHits:n,armor:s.armor?{from:1,to:o+l,hits:1}:void 0,onFrame:(c,h)=>{const f=c.fighter;if(h>=o-2&&h<=o+l){const u=(s.distance??3.4)*kn(c,.8,1.2)/(l+2);f.setForward(f.moveConnected?.01:u)}else h>o+l&&(f.vx=f.vz=0)}}}case"rising":{const n=s.hits??1,r=s.damage??120,a=Math.round(r/n);return{...i,anim:"uppercut",prop:s.prop,startup:4,active:14,recovery:16,airborne:!0,invuln:[{from:1,to:9,kind:"full"}],hitbox:{x:.45,y:1.45,w:.8,h:1.4,lw:.42},hit:We(a,{launch:n>1?.16:.26,launchVx:.03,knockdown:!0,hitstun:20}),finalHit:{launch:.26},rehit:n>1?4:void 0,maxHits:n,onFrame:(o,l)=>{if(l===4){const c=o.fighter;c.vy=.3*(s.height??1)*kn(o,.88,1.12),c.setForward(.04)}}}}case"grab":return{...i,anim:"grab",prop:s.prop,startup:6,active:3,recovery:30,throwRange:s.range??1.25,throwDamage:s.damage??170,techable:!1,hit:We(s.damage??170,{guard:"unblockable",knockdown:!0,effect:s.effect})};case"counter":{const n=s.window??24,r={id:`${e}c`,name:s.name,kind:"special",anim:"counterStrike",color:s.color,startup:3,active:6,recovery:18,hitbox:{x:.8,y:1.1,w:1.8,h:1.8,lw:.7},hit:We(s.damage??140,{knockdown:!0,launch:.2,guard:"mid",spark:"heavy"}),invuln:[{from:1,to:10,kind:"full"}],cancel:["super"]};return{...i,anim:"counterStance",prop:s.prop,startup:3,active:n,recovery:22,counterWindow:{from:3,to:3+n},counterMove:r}}case"buff":{const n={damage:1.3,speed:1.35,defense:.6,armor:2,regen:.45,meter:.35,shield:2,reflect:1,slow:.6};return{...i,anim:"powerup",startup:18,active:1,recovery:16,cooldown:480,onFrame:(r,a)=>{if(a!==18)return;const o=s.duration??(s.buff==="armor"?480:360);r.fighter.addBuff(s.buff,s.value??n[s.buff]??1,o,s.color,r.match)}}}case"heal":return{...i,anim:"powerup",startup:28,active:1,recovery:18,cooldown:600,onFrame:(n,r)=>{if(r!==28)return;const a=(s.amount??80)*kn(n,.8,1.2);n.fighter.heal(a),n.match.emit({t:"buff",fighter:n.fighter.index,kind:"regen",color:s.color})}};case"teleport":{const n=!!s.attack,r=10;return{...i,anim:"vanish",startup:n?18:12,active:n?5:1,recovery:n?16:12,invuln:[{from:1,to:r+4,kind:"full"}],hitbox:n?{x:.7,y:1.2,w:.9,h:1,lw:.45}:void 0,hit:n?We(80,{knockdown:!0,launch:.14}):void 0,cooldown:90,onFrame:(a,o)=>{if(o!==r)return;const l=a.fighter,c=a.opponent;let h=l.x-c.x,f=l.z-c.z;const u=Math.hypot(h,f)||1;h/=u,f/=u;let d;s.mode==="behind"?d={x:c.x-h*1.1,z:c.z-f*1.1}:s.mode==="front"?d={x:c.x+h*1.1,z:c.z+f*1.1}:d=l.ahead(-3.5);const p=a.match.clampPos(d);a.match.emit({t:"teleport",fighter:l.index,fromX:l.x,fromZ:l.z,toX:p.x,toZ:p.z,color:s.color}),l.x=p.x,l.z=p.z,l.faceToward(c.x,c.z)}}}case"wave":{const n=e;return{...i,anim:"stomp",prop:s.prop??"wave",startup:14,active:2,recovery:26,canStart:(r,a)=>!a.hasProjectile(r,n),onFrame:(r,a)=>{if(a!==14)return;const o=r.fighter;r.match.spawnProjectile(o,{...o.ahead(.8),y:.22,speed:(s.speed??.13)*kn(r,.85,1.15),w:.75,h:.42,hit:We(s.damage??75,{guard:"low",knockdown:!0,launch:.1}),prop:s.prop??"wave",color:s.color,kind:"wave",life:150,tag:n})}}}case"dive":return{...i,anim:"diveKick",startup:10,active:42,recovery:10,airborne:!0,airOK:!0,hitbox:{x:.45,y:.25,w:.75,h:.65,lw:.36},hit:We(s.damage??90,{guard:"overhead",hitstun:20}),onStart:r=>{const a=r.fighter;a.grounded?(a.vy=.27,a.setForward(.05),a.y=.01):a.vy=Math.max(a.vy,.04)},onFrame:(r,a)=>{const o=r.fighter;a>=10&&!o.moveConnected&&(o.setForward(.2*kn(r,.85,1.15)),o.vy=-.24)},onHit:r=>{r.fighter.bounceOff()}};case"trap":{const n=e;return{...i,anim:"place",prop:s.prop,startup:12,active:1,recovery:18,cooldown:240,onFrame:(r,a)=>{if(a!==12)return;const o=r.fighter;r.match.removeProjectiles(o,n),r.match.spawnProjectile(o,{...r.match.clampPos(o.ahead(kn(r,1.4,2.6))),y:.3,w:.8,h:.6,hit:We(s.damage??60,{guard:"low",effect:s.effect??{stun:50},hitstun:26,pushback:.02}),prop:s.prop,color:s.color,kind:"trap",life:600,durability:99,tag:n,spin:0})}}}case"beam":{const n=s.hits??4,r=s.length??4.2,a=Math.round((s.damage??110)/n);return{...i,anim:"beam",prop:s.prop,startup:16,active:26,recovery:22,onFrame:(o,l)=>{if(l!==16)return;const c=o.fighter;o.match.spawnProjectile(c,{...c.ahead(.7+r/2),y:1.3,w:r,h:.6,hit:We(a,{hitstun:16,blockstun:12,pushback:.05,effect:s.effect}),prop:s.prop??"sound",color:s.color,kind:"beam",attach:!0,offsetX:.7+r/2,life:26,hits:n,rehit:6,durability:99})}}}case"pull":return{...i,anim:"whip",prop:s.prop,startup:12,active:6,recovery:22,hitbox:{x:2,y:1.2,w:2.8,h:.5,lw:.3},hit:We(s.damage??50,{hitstun:36,pushback:0,spark:"special"}),onHit:(n,r)=>{if(r)return;const a=n.fighter,o=n.opponent,l=n.match.clampPos(a.ahead(.95));o.x=l.x,o.z=l.z,o.slideX=o.slideZ=0}};case"slam":return{...i,anim:"slamRise",prop:s.prop,startup:20,active:50,recovery:18,airborne:!0,hitbox:{x:.2,y:.3,w:1.3,h:.9,lw:.8},hit:We(s.damage??120,{guard:"overhead",knockdown:!0,launch:.14}),onStart:n=>{const r=n.fighter;r.vy=.36,r.y=.01,r.faceOpponent();const a=(n.opponent.x-r.x)/42,o=(n.opponent.z-r.z)/42,l=Math.min(1,.17/Math.max(.001,Math.hypot(a,o)));r.vx=a*l,r.vz=o*l},onLand:n=>{const r=n.fighter;n.match.emit({t:"shake",amount:.25});for(const a of[-1,1]){const o=r.dirX*a,l=r.dirZ*a;n.match.spawnProjectile(r,{x:r.x+o*.6,z:r.z+l*.6,dirX:o,dirZ:l,y:.18,speed:.12,w:.6,h:.35,hit:We(35,{guard:"low",hitstun:16}),prop:"wave",color:s.color,kind:"wave",life:24})}}};case"rain":{const n=s.count??4;return{...i,anim:"summon",prop:s.prop,startup:18,active:1,recovery:28,cooldown:200,onFrame:(r,a)=>{if(a!==18)return;const o=r.fighter;for(let l=0;l<n;l++)r.match.schedule(l*9,()=>{const c=o.opponent;c&&r.match.spawnProjectile(o,{x:c.x+(r.match.rng()-.5)*1.4,z:c.z+(r.match.rng()-.5)*1.4,y:7.5,vy:-.2,gravity:.004,w:.6,h:.6,hit:We(s.damage??32,{guard:"overhead",hitstun:18,tracking:!0}),prop:s.prop,color:s.color,kind:"rain",life:120})})}}}case"shield":return{...i,anim:"guardUp",startup:8,active:1,recovery:14,cooldown:480,onFrame:(n,r)=>{r===8&&(s.reflect?n.fighter.addBuff("reflect",1,240,s.color,n.match):n.fighter.addBuff("shield",s.hits??2,300,s.color,n.match))}};case"spin":{const n=s.hits??4,r=Math.round((s.damage??100)/n),a=8,o=30;return{...i,anim:"spinKick",startup:a,active:o,recovery:14,airborne:!0,hover:{from:8,to:a+o},hitbox:{x:.25,y:1.15,w:1.5,h:.75,lw:.6},hit:We(r,{hitstun:18,pushback:.03}),finalHit:{knockdown:!0,launch:.16,pushback:.15},rehit:7,maxHits:n,onFrame:(l,c)=>{const h=l.fighter;c===3&&(h.vy=.13,h.y=.01),c>=a&&c<=a+o&&h.setForward((s.distance??3)*kn(l,.8,1.2)/o)}}}case"barrage":{const n=s.hits??6,r=Math.round((s.damage??110)/n);return{...i,anim:"flurry",prop:s.prop,startup:6,active:26,recovery:18,hitbox:{x:.72,y:1.3,w:.9,h:.8,lw:.34},hit:We(r,{hitstun:16,blockstun:10,pushback:.02}),finalHit:{pushback:.2,knockdown:!0,launch:.14},rehit:4,maxHits:n,motion:[{from:6,to:32,vx:.025}]}}}}const Ny={cinematic:"Invincible rush. On hit, a devastating combo.",megabeam:"Invincible full-screen beam.",megarain:"Rains destruction across the arena.",megagrab:"Invincible unblockable super grab.",megaprojectile:"Giant unstoppable projectile."};function Mf(s){return s.desc??Ny[s.type]}function Oy(s){const t={id:"ult",name:s.name,kind:"super",color:s.color,meterCost:dl,superFreeze:48,tag:s.type,desc:Mf(s),prop:s.prop};switch(s.type){case"cinematic":return{...t,anim:"charge",startup:6,active:16,recovery:28,invuln:[{from:1,to:14,kind:"full"}],hitbox:{x:.7,y:1.1,w:1.1,h:1.5,lw:.55},track:.25,hit:We(40,{chip:60,blockstun:22,pushback:.2,spark:"super"}),onFrame:(e,i)=>{const n=e.fighter;i>=4&&i<=22?n.setForward(n.moveConnected?0:.25):n.vx=n.vz=0},onHit:(e,i)=>{i||e.match.startCinematic(e.fighter,e.opponent,s.damage??380,s.name,s.color,s.prop)}};case"megabeam":return{...t,anim:"beam",startup:12,active:60,recovery:30,invuln:[{from:1,to:14,kind:"full"}],onFrame:(i,n)=>{if(n!==12)return;const r=i.fighter,a=10;i.match.spawnProjectile(r,{...r.ahead(.7+11/2),y:1.25,w:11,h:1.1,hit:We(Math.round((s.damage??330)/a),{hitstun:16,blockstun:12,chip:8,pushback:.03,spark:"super",tracking:!0}),prop:s.prop??"wave",color:s.color,kind:"mega",attach:!0,offsetX:.7+11/2,life:60,hits:a,rehit:6,durability:999})}};case"megarain":return{...t,anim:"summon",startup:10,active:1,recovery:36,invuln:[{from:1,to:14,kind:"full"}],onFrame:(e,i)=>{if(i!==10)return;const n=e.fighter;for(let r=0;r<14;r++)e.match.schedule(r*5,()=>{const a=n.opponent;a&&e.match.spawnProjectile(n,{x:a.x+(e.match.rng()-.5)*2,z:a.z+(e.match.rng()-.5)*2,y:8,vy:-.26,gravity:.004,w:.85,h:.85,hit:We(Math.round((s.damage??380)/14),{guard:"overhead",hitstun:20,chip:6,spark:"super",tracking:!0}),prop:s.prop,color:s.color,kind:"rain",life:120,scale:1.6})})}};case"megagrab":return{...t,anim:"grab",startup:3,active:5,recovery:36,invuln:[{from:1,to:9,kind:"full"}],throwRange:1.75,throwDamage:s.damage??400,techable:!1,grabCinematic:{damage:s.damage??400,name:s.name}};case"megaprojectile":return{...t,anim:"cast",startup:14,active:1,recovery:30,invuln:[{from:1,to:16,kind:"full"}],onFrame:(e,i)=>{if(i!==14)return;const n=e.fighter,r=5;e.match.spawnProjectile(n,{...n.ahead(1.1),y:1.2,speed:.15,w:1.5,h:1.5,hit:We(Math.round((s.damage??340)/r),{hitstun:18,chip:10,pushback:.04,spark:"super",tracking:!0}),prop:s.prop,color:s.color,kind:"mega",hits:r,rehit:7,durability:999,life:160,scale:3.2})}}}}function Sf(s){return{x:s.z,z:-s.x}}function bf(s){for(;s>Math.PI;)s-=Math.PI*2;for(;s<-Math.PI;)s+=Math.PI*2;return s}function By(s,t,e){const i=bf(t-s);return Math.abs(i)<=e?t:s+Math.sign(i)*e}const wf={id:"throwExec",name:"Throw",kind:"throw",anim:"throwExec",startup:0,active:0,recovery:44},zy={...wf,id:"grabExec",anim:"grabExec",kind:"special"},Wu=new Map;function Hy(s){const t=s.id+(s.boss?":boss":"");let e=Wu.get(t);return e||(e={normals:Iy(s.style,s.stats.power??1),throw:Dy(s.style,s.passive.id==="bouncer"),specials:s.specials.map((i,n)=>Fy(i,n)),ultimate:Oy(s.ultimate)},Wu.set(t,e)),e}function Ef(s){const t=s.stats,e=(t.speed??1)*(s.passive.id==="swift"?1.18:1)*(s.style==="rushdown"?1.1:s.style==="grappler"?.88:1),i=t.weight??1;return{maxHealth:Math.round(ep*(t.health??1)*(s.style==="grappler"?1.08:1)*(s.boss?1.5:1)),walk:.042*e,back:.034*e,dash:.15*e,run:.1*e,jumpVy:.3*(t.jump??1),jumpVx:.06*e,gravity:jf*(.94+.06*i),dmgMul:(t.power??1)*(s.boss?1.15:1),defMul:1/(t.defense??1)*(s.passive.id==="thickSkin"?.86:1),meterMul:s.passive.id==="meterBoost"?1.3:1,weight:i}}class Xu{index;def;moves;stats;opponent=null;x=0;y=0;z=0;vx=0;vy=0;vz=0;slideX=0;slideZ=0;yaw=0;facing=1;state="idle";stateFrame=0;move=null;moveFrame=0;moveStrength=.5;moveHits=0;moveLastHit=-99;moveConnected=!1;moveHitConfirmed=!1;pendingString=null;armorLeft=0;fallMove=null;landLag=0;throwBack=!1;throwExec=null;grabbedBy=null;jumpDir=0;airJumps=0;airAttackUsed=!1;dashDir=0;sideX=0;sideZ=0;sidestepDir=-1;wsFrames=0;crouchEnteredFromStand=!1;health;recoverable=0;lastHurtFrame=-999;meter=0;stun=0;juggleCount=0;juggleInvuln=!1;screwed=!1;comboHits=0;comboDamage=0;invuln=0;lifelineUsed=!1;rageArtUsed=!1;rageAnnounced=!1;koed=!1;pendingDizzy=0;buffs=[];cooldowns=new Map;history=new Ry;input=Xe;relDir=5;roundsWon=0;noGuard=!1;flash=0;guarding=!1;hitHigh=!0;lastHitHeavy=!1;crumpled=!1;knockdownFrames=oo;victoryVariant=0;spin=0;constructor(t,e){this.index=t,this.def=e,this.moves=Hy(e),this.stats=Ef(e),this.health=this.stats.maxHealth}get dirX(){return Math.cos(this.yaw)}get dirZ(){return Math.sin(this.yaw)}get dir(){return{x:Math.cos(this.yaw),z:Math.sin(this.yaw)}}ahead(t){return{x:this.x+Math.cos(this.yaw)*t,z:this.z+Math.sin(this.yaw)*t}}setForward(t){this.vx=Math.cos(this.yaw)*t,this.vz=Math.sin(this.yaw)*t}localOf(t,e){const i=t-this.x,n=e-this.z,r=this.dir,a=Sf(r);return{f:i*r.x+n*r.z,l:i*a.x+n*a.z}}distTo(t){return Math.hypot(t.x-this.x,t.z-this.z)}yawToward(t,e){return Math.atan2(e-this.z,t-this.x)}turnToOpponent(t){const e=this.opponent;e&&(Math.hypot(e.x-this.x,e.z-this.z)<.05||(this.yaw=By(this.yaw,this.yawToward(e.x,e.z),t)))}faceToward(t,e=this.z){Math.hypot(t-this.x,e-this.z)>.02&&(this.yaw=this.yawToward(t,e))}faceOpponent(){this.opponent&&this.faceToward(this.opponent.x,this.opponent.z)}offAxis(){const t=this.opponent;return t?Math.abs(bf(this.yawToward(t.x,t.z)-this.yaw)):0}get grounded(){return this.y<=0&&this.vy<=0}get passive(){return this.def.passive.id}get inRage(){return this.health>0&&this.health<this.stats.maxHealth*ip}get isCrouching(){return!!(this.state==="crouch"||(this.state==="blockstun"||this.state==="hitstun")&&Kn(this.relDir)&&this.grounded||this.state==="attack"&&this.move?.lowProfile)}get actionable(){return this.state==="idle"||this.state==="walkF"||this.state==="walkB"||this.state==="crouch"}resetForRound(t,e,i){this.x=t,this.z=e,this.y=0,this.vx=this.vy=this.vz=this.slideX=this.slideZ=0,this.yaw=i,this.state="idle",this.stateFrame=0,this.move=null,this.pendingString=null,this.fallMove=null,this.throwExec=null,this.grabbedBy=null,this.health=this.stats.maxHealth,this.recoverable=0,this.stun=0,this.juggleCount=0,this.juggleInvuln=!1,this.screwed=!1,this.comboHits=0,this.comboDamage=0,this.invuln=0,this.rageArtUsed=!1,this.rageAnnounced=!1,this.crumpled=!1,this.buffs=[],this.pendingDizzy=0,this.wsFrames=0,this.spin=0,this.cooldowns.clear(),this.history.clear(),this.flash=0,this.guarding=!1,this.noGuard=!1,this.passive==="deepPockets"&&(this.meter=Math.max(this.meter,50))}setState(t){this.state!==t&&(this.state=t,this.stateFrame=0)}ctx(t){return{fighter:this,opponent:this.opponent,match:t,move:this.move,strength:this.moveStrength}}recordInput(t){this.input=t,this.relDir=ol(t.dir,this.facing),this.history.push(this.relDir,t.pressed)}addBuff(t,e,i,n,r){this.buffs=this.buffs.filter(a=>a.kind!==t),this.buffs.push({kind:t,value:e,frames:i,color:n}),r?.emit({t:"buff",fighter:this.index,kind:t,color:n})}buff(t){return this.buffs.find(e=>e.kind===t)}speedMul(){let t=1;const e=this.buff("speed");e&&(t*=e.value);const i=this.buff("slow");return i&&(t*=i.value),t}outgoingMul(t){let e=this.stats.dmgMul;const i=this.buff("damage");return i&&(e*=i.value),this.inRage&&(e*=1.1),this.passive==="rage"&&this.health<this.stats.maxHealth*.3&&(e*=1.25),this.passive==="powerSurge"&&(t==="special"||t==="projectile")&&(e*=1.2),e}incomingMul(t){let e=this.stats.defMul;const i=this.buff("defense");return i&&(e*=i.value),t&&this.passive==="projectileProof"&&(e*=.5),e}heal(t){this.health=Math.min(this.stats.maxHealth,this.health+t),this.recoverable=Math.max(0,this.recoverable-t)}gainMeter(t){this.meter=Math.max(0,Math.min(yr,this.meter+t*this.stats.meterMul))}takeDamage(t,e,i=!0){const n=Math.max(0,Math.round(t));return this.health-n<=0&&i&&this.passive==="lifeline"&&!this.lifelineUsed&&!e.training?(this.lifelineUsed=!0,this.health=1,this.invuln=50,e.emit({t:"lifeline",fighter:this.index,name:this.def.passive.name}),!0):(this.health=Math.max(0,this.health-n),this.passive==="regen"&&(this.recoverable=Math.min(this.stats.maxHealth*.4,this.recoverable+n*.4)),this.lastHurtFrame=e.frame,this.inRage&&!this.rageAnnounced&&(this.rageAnnounced=!0,e.emit({t:"rage",fighter:this.index})),!1)}isInvuln(t){if(this.invuln>0||this.throwExec)return!0;switch(this.state){case"getup":case"techroll":case"ko":case"cinematic":case"thrown":case"intro":case"victory":return!0;case"knockdown":return t!=="strike"}if(this.juggleInvuln||this.state==="backdash"&&this.passive==="quickRecovery"&&this.stateFrame<10)return!0;const e=this.move;if(this.state==="attack"&&e?.invuln){for(const i of e.invuln)if(this.moveFrame>=i.from&&this.moveFrame<=i.to&&(i.kind==="full"||i.kind===t))return!0}return!1}canBlock(){if(!this.grounded||this.noGuard)return!1;switch(this.state){case"idle":case"walkB":case"crouch":case"blockstun":case"backdash":return!0;case"land":return this.stateFrame>1}return!1}blockOK(t){if(t==="unblockable")return!1;const e=this.relDir,i=this.state==="crouch"||e===1||e===2;return t==="low"?i&&(e===1||e===2):i?!1:e===5||Vu(e)}isCounterable(){const t=this.move;return this.state==="attack"&&!!t&&this.moveFrame<=t.startup+t.active&&t.kind!=="throw"}inCounterWindow(){const t=this.move?.counterWindow;return this.state==="attack"&&!!t&&this.moveFrame>=t.from&&this.moveFrame<=t.to}hasArmor(){if(this.buff("armor"))return!0;const t=this.move;return this.state!=="attack"||!t||this.armorLeft<=0?!1:!!(t.armor&&this.moveFrame>=t.armor.from&&this.moveFrame<=t.armor.to||this.passive==="heavyArmor"&&t.tag==="heavy"&&this.moveFrame<=t.startup+1)}consumeArmor(){const t=this.buff("armor");if(t){t.value-=1,t.value<=0&&(t.frames=0);return}this.armorLeft--}get radius(){return .28*Math.min(1.3,this.def.look.build)}hurtboxes(){switch(this.state){case"getup":case"techroll":case"ko":case"intro":case"victory":return[];case"knockdown":return[{x:this.x,z:this.z,y:.2,h:.4,r:.5}]}const t=this.def.look.height,e=this.radius,i=[];this.state==="wallsplat"?i.push({x:this.x,z:this.z,y:this.y+.9,h:1.8,r:e}):!this.grounded||this.state==="air"||this.state==="juggle"||this.state==="fall"?i.push({x:this.x,z:this.z,y:this.y+.95*t,h:1.3*t,r:e}):this.isCrouching?i.push({x:this.x,z:this.z,y:.55*t,h:1.1*t,r:e+.04}):i.push({x:this.x,z:this.z,y:.9*t,h:1.8*t,r:e});const n=this.move;if(this.state==="attack"&&n?.hitbox&&n.kind==="normal"&&this.moveFrame>n.startup){const r=this.ahead(n.hitbox.x*.85);i.push({x:r.x,z:r.z,y:this.y+n.hitbox.y,h:n.hitbox.h*.8,r:.16})}return i}activeHitbox(){const t=this.move;if(this.state!=="attack"||!t?.hitbox||!t.hit)return null;const e=this.moveFrame;return e<=t.startup||e>t.startup+t.active||t.maxHits!==void 0&&this.moveHits>=t.maxHits||this.moveHits>0&&(!t.rehit||e-this.moveLastHit<t.rehit)?null:t.hitbox}canUse(t,e){return!(t.meterCost&&this.meter<t.meterCost&&!e.infiniteMeter(this)&&!(t.kind==="super"&&this.inRage&&!this.rageArtUsed)||(this.cooldowns.get(t.id)??0)>0||t.canStart&&!t.canStart(this,e))}update(t){switch(this.stateFrame++,this.invuln>0&&this.invuln--,this.flash>0&&this.flash--,this.wsFrames>0&&this.wsFrames--,this.tickBuffs(t),this.state){case"intro":case"victory":case"ko":case"cinematic":case"thrown":return;case"idle":case"walkF":case"walkB":case"crouch":this.neutral(t);return;case"jumpSquat":this.jumpSquat(t);return;case"air":this.airUpdate(t);return;case"land":this.stateFrame>=this.landLag&&this.toNeutral();return;case"dash":case"run":case"backdash":this.dashUpdate(t);return;case"sidestep":case"sidewalk":this.sidestepUpdate(t);return;case"attack":this.attackUpdate(t);return;case"hitstun":case"blockstun":case"dizzy":this.stun--,this.stun<=0&&(this.crumpled=!1,this.toNeutral());return;case"wallsplat":this.stun--,this.stun<=0&&this.enterJuggle(.02,-this.dirX*.01,-this.dirZ*.01);return;case"knockdown":{const e=this.input.dir!==5||(this.input.pressed&an)!==0;(this.stateFrame>=np&&e||this.stateFrame>=this.knockdownFrames)&&this.setState("getup");return}case"getup":this.stateFrame>=ed&&(this.faceOpponent(),this.toNeutral());return;case"techroll":{const e=this.stateFrame/fl,i=.075*Math.sin(Math.PI*Math.min(1,e));this.vx=this.sideX*i,this.vz=this.sideZ*i,this.stateFrame>=fl&&(this.vx=this.vz=0,this.faceOpponent(),this.toNeutral());return}case"fall":case"juggle":return}}tickBuffs(t){if(this.buffs.length){for(const e of this.buffs)e.frames--,e.kind==="regen"&&this.heal(e.value),e.kind==="meter"&&this.gainMeter(e.value);this.buffs=this.buffs.filter(e=>e.frames>0)}if(this.cooldowns.size)for(const[e,i]of this.cooldowns)i<=1?this.cooldowns.delete(e):this.cooldowns.set(e,i-1);if(this.passive==="regen"&&this.recoverable>0&&t.frame-this.lastHurtFrame>90&&this.health>0){const e=Math.min(this.recoverable,.35);this.health=Math.min(this.stats.maxHealth,this.health+e),this.recoverable-=e}}toNeutral(){this.move=null,this.pendingString=null,this.fallMove=null,this.throwExec=null,this.comboHits=0,this.comboDamage=0,this.juggleCount=0,this.juggleInvuln=!1,this.screwed=!1,this.airAttackUsed=!1,this.airJumps=0,this.stun=0,this.spin=0,this.grounded?(this.vx=this.vz=0,this.setState(Kn(this.relDir)?"crouch":"idle")):this.setState("air")}startSidestep(t,e){const i=e.camN,n=t?1:-1;this.sideX=i.x*n,this.sideZ=i.z*n,this.sidestepDir=n,this.setState("sidestep")}neutral(t){this.turnToOpponent(.4),this.relDir=ol(this.input.dir,this.facing);const e=this.relDir,i=this.history;if(this.state==="crouch"&&!Kn(e)&&(this.wsFrames=12,e===5&&this.stateFrame<=5&&this.crouchEnteredFromStand&&!i.buffered(an,3))){this.startSidestep(!0,t);return}if(!this.tryAttack(t,!1)){if(i.buffered(at.SS,3)){i.consume(at.SS,3),this.startSidestep(Kn(e),t);return}if(i.dash(!0)){this.dashDir=1,this.setState("dash");return}if(i.dash(!1)){this.dashDir=-1,this.setState("backdash");return}if(ya(e)){this.jumpDir=e===9?1:e===7?-1:0,this.setState("jumpSquat");return}if(Kn(e)){this.state!=="crouch"&&(this.crouchEnteredFromStand=this.state==="idle"||this.state==="walkF"||this.state==="walkB"),this.setState("crouch"),this.guarding=!this.noGuard&&(e===1||e===2)&&t.isThreatened(this);return}if(e===6){this.setState("walkF"),this.guarding=!1;return}if(e===4){this.setState("walkB"),this.guarding=!this.noGuard&&t.isThreatened(this);return}this.guarding=!this.noGuard&&t.isThreatened(this),this.setState("idle")}}jumpSquat(t){if(this.relDir=ol(this.input.dir,this.facing),!(this.stateFrame<=5&&this.tryAttack(t,!1))){if(!ya(this.relDir)&&this.stateFrame<=5){this.startSidestep(!1,t);return}this.stateFrame>=6&&this.takeoff(t)}}takeoff(t){this.vy=this.stats.jumpVy,this.y=.001,this.setForward(this.jumpDir*this.stats.jumpVx*this.speedMul()),this.airAttackUsed=!1,this.airJumps=0,this.setState("air"),t.emit({t:"jump",fighter:this.index})}airUpdate(t){if(!this.airAttackUsed&&this.tryAttack(t,!0)){this.airAttackUsed=!0;return}if(this.passive==="doubleJump"&&this.airJumps<1&&this.stateFrame>6){const e=this.history.dirs,i=e.length;if(i>=2&&ya(e[i-1])&&!ya(e[i-2])){this.airJumps++;const n=e[i-1]===9?1:e[i-1]===7?-1:0;this.vy=this.stats.jumpVy*.85,this.setForward(n*this.stats.jumpVx),t.emit({t:"jump",fighter:this.index})}}}dashUpdate(t){const e=this.speedMul();if(this.state==="dash"){if(this.turnToOpponent(.2),this.tryAttack(t,!1))return;const i=14,n=this.stateFrame/i;this.setForward(this.stats.dash*e*Math.sin(Math.PI*Math.min(1,n*.85+.15))),this.stateFrame>=i&&(this.relDir===6||this.relDir===9||this.relDir===3?this.setState("run"):(this.vx=this.vz=0,this.toNeutral()))}else if(this.state==="run"){if(this.turnToOpponent(.1),this.tryAttack(t,!1))return;const i=this.stats.run*e*Math.min(1.35,1+this.stateFrame/40);this.setForward(i);const n=this.opponent;this.relDir!==6&&this.relDir!==9&&this.relDir!==3?(this.vx=this.vz=0,this.toNeutral()):this.distTo(n)<.75&&(this.vx=this.vz=0,this.toNeutral())}else{this.stateFrame>9&&this.history.dash(!1)&&(this.stateFrame=0);const n=this.stateFrame/20;if(this.setForward(-this.stats.dash*.85*e*Math.max(0,1-n)**1.4),this.stateFrame>=8&&this.tryAttack(t,!1))return;this.stateFrame>=20&&(this.vx=this.vz=0,this.toNeutral())}}sidestepUpdate(t){if(this.state==="sidestep"){const i=this.stateFrame/18,n=.1*Math.sin(Math.PI*Math.min(1,i))*this.speedMul();if(this.vx=this.sideX*n,this.vz=this.sideZ*n,this.stateFrame>=8&&this.tryAttack(t,!1))return;this.stateFrame>=18&&(this.input.held&at.SS?this.setState("sidewalk"):(this.vx=this.vz=0,this.toNeutral()))}else{const e=this.opponent,i=this.x-e.x,n=this.z-e.z,r=Math.hypot(i,n)||1,a=-n/r,o=i/r,l=Math.sign(a*this.sideX+o*this.sideZ)||1,c=.045*this.speedMul(),h=c*c/(2*r);if(this.vx=a*l*c-i/r*h,this.vz=o*l*c-n/r*h,this.sideX=a*l,this.sideZ=o*l,this.turnToOpponent(.08),this.tryAttack(t,!1))return;this.input.held&at.SS||(this.vx=this.vz=0,this.toNeutral())}}pickSpecial(t){const e=this.history,i=this.relDir;let n=-1,r=.5;if(e.buffered(at.SP))n=Kn(i)?2:i===6||i===9?1:0;else{const o=e.buffered(hl),l=e.buffered(Qu);o&&e.motion("dp")?(n=2,r=o&at.HP?1:0):o&&e.motion("qcf")?(n=0,r=o&at.HP?1:0):l&&e.motion("qcb")&&(n=1,r=l&at.HK?1:0)}if(n<0)return null;const a=this.moves.specials[n];return t&&!a.airOK?null:[a,r]}pickNormal(t){const e=this.history.buffered(an);if(!e)return null;const i=(e&at.LP)!==0,n=(e&at.HP)!==0,r=(e&at.LK)!==0,a=(e&at.HK)!==0;if(t)return r||a?"jKick":"jPunch";const o=this.relDir;if((this.state==="dash"||this.state==="run")&&n)return"dash2";if(this.wsFrames>0&&!Kn(o)){if(n)return"ws2";if(a)return"ws4"}switch(o){case 3:return a?"dfKick4":n?"launcher":r?"dfKick":"dfJab";case 2:return a?"shin":n?"dStraight":r?"lowKick":"dJab";case 1:return a?"sweep":n?"dStraight":r?"lowKick":"dJab";case 6:return a?"knee":n?"power":r?"lkick":"jab";case 4:return a?"spin4":n?"bhook":r?"lkick":"elbow";case 9:if(a)return"ufKnee";break}return a?"rkick":n?"straight":r?"lkick":i?"jab":null}wantsThrow(){const t=this.history;return t.buffered(at.TH)!==0||t.pressedTogether(at.LP,at.LK)||t.pressedTogether(at.HP,at.HK)}tryUltimate(t){const e=this.history,i=this.moves.ultimate,n=this.inRage&&!this.rageArtUsed;return this.meter<dl&&!t.infiniteMeter(this)&&!n?!1:(e.buffered(at.UL)||e.buffered(hl)&&e.motion("dqcf"))&&this.canUse(i,t)?(e.consume(at.UL|an|at.SP),this.meter<dl&&!t.infiniteMeter(this)?(this.rageArtUsed=!0,this.startMove({...i,meterCost:0},1,t)):this.startMove(i,1,t),!0):!1}trySpecial(t,e){const i=this.pickSpecial(e);if(!i)return!1;const[n,r]=i;return this.canUse(n,t)?(this.history.consume(an|at.SP),this.startMove(n,r,t),!0):!1}tryAttack(t,e){if(!e&&this.tryUltimate(t)||this.trySpecial(t,e))return!0;if(!e&&this.wantsThrow())return this.history.consume(at.TH|an),this.throwBack=Vu(this.relDir),this.startMove(this.moves.throw,.5,t),!0;const i=this.pickNormal(e);return i?(this.history.consume(an),this.startMove(this.moves.normals[i],.5,t),!0):!1}startMove(t,e,i){this.move=t,this.moveFrame=0,this.moveStrength=e,this.moveHits=0,this.moveLastHit=-99,this.moveConnected=!1,this.moveHitConfirmed=!1,this.pendingString=null,this.fallMove=null,this.armorLeft=t.armor?.hits??(this.passive==="heavyArmor"&&t.tag==="heavy"?1:0),this.guarding=!1,this.setState("attack"),this.stateFrame=0,t.meterCost&&!i.infiniteMeter(this)&&(this.meter=Math.max(0,this.meter-t.meterCost)),t.cooldown&&this.cooldowns.set(t.id,t.cooldown),this.grounded&&!t.air&&(this.vx=this.vz=0),this.grounded&&this.offAxis()<.9&&this.turnToOpponent(.5),t.superFreeze?(this.faceOpponent(),i.superFlash(this,t)):t.kind==="special"?(i.emit({t:"special",fighter:this.index,name:t.name,color:t.color??16777215}),this.gainMeter(2)):(t.kind==="normal"||t.kind==="throw")&&i.emit({t:"whiff",fighter:this.index,heavy:t.tag==="heavy"||t.tag==="launcher"}),t.onStart?.(this.ctx(i))}attackUpdate(t){const e=this.move;if(!e){this.toNeutral();return}this.moveFrame++;const i=this.moveFrame;if(e.track&&i<=e.startup&&this.turnToOpponent(e.track),!e.airborne&&!e.air&&this.grounded&&(this.vx=this.vz=0),e.motion)for(const a of e.motion)i>=a.from&&i<=a.to&&(a.vx!==void 0&&this.setForward(a.vx),a.vy!==void 0&&(this.vy=a.vy));if(e.onFrame?.(this.ctx(t),i),this.move!==e||e.throwRange&&!this.throwExec&&i>e.startup&&i<=e.startup+e.active&&(t.tryGrab(this,e),this.move!==e))return;if(e.strings&&!this.pendingString){const a=this.history;for(const o of["LP","HP","LK","HK"]){const l=e.strings[o];if(l&&a.buffered(at[o],10)){a.consume(at[o],10),this.pendingString=this.moves.normals[l]??null;break}}}if(this.pendingString&&i>=e.startup+e.active){const a=this.pendingString;this.pendingString=null,this.startMove(a,.5,t);return}if(this.moveConnected&&i>=e.startup&&this.tryCancel(t,e))return;const n=this.moveHitConfirmed&&e.hitRecovery!==void 0?e.hitRecovery:e.recovery,r=e.startup+e.active+n;if(e.airborne){i>=e.startup+e.active&&!this.grounded?(this.fallMove=e,this.landLag=e.recovery,this.move=null,this.setState("fall")):i>=r&&this.endMove(t);return}i>=r&&this.endMove(t)}tryCancel(t,e){if(e.kind==="normal"){if(e.cancel?.includes("super")&&this.tryUltimate(t)||e.cancel?.includes("special")&&this.trySpecial(t,!!e.air))return!0}else if(e.kind==="special"&&this.moveHitConfirmed&&e.cancel?.includes("super")&&this.tryUltimate(t))return!0;return!1}endMove(t){const e=this.move;e?.onEnd&&e.onEnd(this.ctx(t)),this.move=null,this.throwExec=null,this.grounded?this.toNeutral():(this.setState(e?.air?"air":"fall"),e?.air&&(this.airAttackUsed=!0),this.landLag=4)}bounceOff(){this.move&&(this.fallMove=null,this.landLag=6,this.move=null),this.setForward(-.07),this.vy=.16,this.setState("fall")}enterHitstun(t,e,i){this.move=null,this.pendingString=null,this.fallMove=null,this.throwExec=null,this.stun=Math.max(1,Math.round(t*(this.passive==="ironWill"?.85:1))),this.hitHigh=e,this.lastHitHeavy=i,this.guarding=!1,this.crumpled=!1,this.state="hitstun",this.stateFrame=0}enterBlockstun(t){this.move=null,this.pendingString=null,this.stun=t,this.guarding=!0,this.state="blockstun",this.stateFrame=0}enterJuggle(t,e,i){this.move=null,this.pendingString=null,this.fallMove=null,this.throwExec=null,this.juggleCount++,this.juggleCount>sp&&(this.juggleInvuln=!0),this.vy=t*Is,this.vx=e*Is,this.vz=i*Is,this.slideX=this.slideZ=0,this.y<=0&&(this.y=.01),this.state="juggle",this.stateFrame=0}enterDizzy(t,e=!1){this.move=null,this.pendingString=null,this.stun=t,this.crumpled=e,this.state="dizzy",this.stateFrame=0}enterWallsplat(t,e){this.move=null,this.vx=this.vz=this.slideX=this.slideZ=0,this.vy=0,this.y=Math.min(Math.max(this.y,.15),1.1),this.stun=t,this.state="wallsplat",this.stateFrame=0,e.emit({t:"wallsplat",fighter:this.index})}physics(t){if(this.state==="thrown"||this.state==="cinematic")return;const e=this.speedMul();switch(this.state){case"walkF":this.setForward(this.stats.walk*e);break;case"walkB":this.setForward(-this.stats.back*e);break;case"idle":case"crouch":case"land":case"blockstun":case"hitstun":case"dizzy":case"knockdown":case"getup":case"jumpSquat":case"intro":case"victory":case"wallsplat":this.grounded&&(this.vx=this.vz=0);break}this.x+=this.vx+this.slideX,this.z+=this.vz+this.slideZ;const i=this.grounded?.84:.95;if(this.slideX*=i,this.slideZ*=i,Math.abs(this.slideX)+Math.abs(this.slideZ)<.002&&(this.slideX=this.slideZ=0),this.state==="wallsplat"){this.y=Math.max(.1,this.y-.006);return}if(this.y>0||this.vy>0){const n=this.move;n?.hover&&this.state==="attack"&&this.moveFrame>=n.hover.from&&this.moveFrame<=n.hover.to?this.vy=0:this.state==="juggle"?this.vy-=Qf*(1+.08*this.juggleCount):this.vy-=this.stats.gravity,this.y+=this.vy,this.state==="juggle"&&(this.spin+=this.screwed?.35:0),this.y<=0&&(this.y=0,this.land(t))}}land(t){const e=this.vy;switch(this.vy=0,this.y=0,this.state){case"air":this.vx=this.vz=0,this.landLag=4,this.faceOpponent(),this.setState("land"),t.emit({t:"land",fighter:this.index,hard:!1});break;case"attack":{const i=this.move;if(this.vx=this.vz=0,i?.airborne){if(this.moveFrame<=2)break;i.onLand?.(this.ctx(t)),this.landLag=i.recovery}else this.landLag=i?.air?5:2;this.move=null,this.faceOpponent(),this.setState("land"),t.emit({t:"land",fighter:this.index,hard:!1});break}case"fall":{this.vx=this.vz=0;const i=this.fallMove;i?.onLand&&(this.move=i,i.onLand(this.ctx(t)),this.move=null),this.fallMove=null,this.faceOpponent(),this.setState("land"),t.emit({t:"land",fighter:this.index,hard:!1});break}case"juggle":if(this.vx=this.vz=0,this.spin=0,this.slideX=-this.dirX*.02,this.slideZ=-this.dirZ*.02,this.koed)this.setState("ko");else if(this.pendingDizzy>0)this.enterDizzy(this.pendingDizzy),this.pendingDizzy=0;else if(this.history.buffered(an,8)&&!this.juggleInvuln){this.history.consume(an,8);const i=t.camN,n=this.index===0?1:-1;this.sideX=i.x*n,this.sideZ=i.z*n,this.setState("techroll"),t.emit({t:"techroll",fighter:this.index})}else this.knockdownFrames=this.passive==="quickRecovery"?Math.round(oo/2):oo,this.setState("knockdown");t.emit({t:"land",fighter:this.index,hard:!0}),t.emit({t:"shake",amount:Math.min(.2,Math.abs(e)*.6)});break;case"ko":this.vx=this.vz=0,t.emit({t:"land",fighter:this.index,hard:!0});break;default:this.vx=this.vz=0}}}let Gy=1;class Vy{id=Gy++;owner;x;y;z;vx;vy;vz;dirX;dirZ;w;h;hit;prop;color;kind;hitsLeft;rehit;durability;life;age=0;gravity;attach;offsetX;homing;delay;scale;spin;tag;lastHitAge=-999;dead=!1;reflected=!1;onHit;constructor(t,e){this.owner=t,this.x=e.x,this.y=e.y,this.z=e.z,this.dirX=e.dirX??t.dirX,this.dirZ=e.dirZ??t.dirZ;const i=e.speed??0;this.vx=this.dirX*i,this.vz=this.dirZ*i,this.vy=e.vy??0,this.w=e.w,this.h=e.h,this.hit=e.hit,this.prop=e.prop,this.color=e.color,this.kind=e.kind??"normal",this.hitsLeft=e.hits??1,this.rehit=e.rehit??8,this.durability=e.durability??this.hitsLeft,this.life=e.life??240,this.gravity=e.gravity??0,this.attach=!!e.attach,this.offsetX=e.offsetX??0,this.homing=e.homing??0,this.delay=e.delay??0,this.scale=e.scale??1,this.spin=e.spin??.2,this.tag=e.tag,this.onHit=e.onHit}get active(){return!this.dead&&this.age>=this.delay}get facing(){return this.owner.facing}update(t){if(this.age++,!(this.age<this.delay)){if(this.attach){const e=this.owner;this.dirX=e.dirX,this.dirZ=e.dirZ,this.x=e.x+this.dirX*this.offsetX,this.z=e.z+this.dirZ*this.offsetX,(e.state==="hitstun"||e.state==="juggle"||e.state==="knockdown"||e.state==="thrown")&&(this.dead=!0)}else{if(this.homing>0&&t){const e=t.y+1;this.vy+=Math.sign(e-this.y)*this.homing*.01,this.vy=Math.max(-.08,Math.min(.08,this.vy));const i=Math.hypot(this.vx,this.vz);if(i>0){const n=Math.atan2(t.z-this.z,t.x-this.x),r=Math.atan2(this.vz,this.vx);let a=n-r;for(;a>Math.PI;)a-=Math.PI*2;for(;a<-Math.PI;)a+=Math.PI*2;const o=r+Math.max(-.02,Math.min(.02,a))*this.homing;this.vx=Math.cos(o)*i,this.vz=Math.sin(o)*i,this.dirX=Math.cos(o),this.dirZ=Math.sin(o)}}this.vy-=this.gravity,this.x+=this.vx,this.y+=this.vy,this.z+=this.vz,this.kind==="rain"&&this.y<.2&&(this.dead=!0),this.gravity>0&&this.y<.15&&this.kind!=="rain"&&(this.dead=!0)}this.age>=this.life+this.delay&&(this.dead=!0),Math.hypot(this.x,this.z)>30&&(this.dead=!0)}}overlaps(t){if(Math.abs(this.y-t.y)*2>=this.h+t.h)return!1;if(this.attach){const e=this.owner,i=t.x-e.x,n=t.z-e.z,r=i*this.dirX+n*this.dirZ,a=i*this.dirZ-n*this.dirX;return Math.abs(r-this.offsetX)<=this.w/2+t.r&&Math.abs(a)<=this.h/2+t.r}return Math.hypot(t.x-this.x,t.z-this.z)<=this.w/2+t.r}touches(t){return Math.abs(this.y-t.y)*2>=this.h+t.h?!1:this.attach?this.overlaps({x:t.x,z:t.z,y:t.y,h:t.h,r:t.w/2}):t.attach?t.overlaps({x:this.x,z:this.z,y:this.y,h:this.h,r:this.w/2}):Math.hypot(t.x-this.x,t.z-this.z)<=(this.w+t.w)/2}}function qu(s,t,e){const i=s.dir,n=Sf(i),r=e.x-s.x,a=e.z-s.z,o=r*i.x+a*i.z,l=r*n.x+a*n.z;return Math.abs(o-t.x)>t.w/2+e.r||Math.abs(l)>(t.lw??.26)+e.r?!1:Math.abs(s.y+t.y-e.y)*2<t.h+e.h}function Ku(s,t,e){return s.hitstop!==void 0?s.hitstop:e?t==="super"?5:7:t==="super"?12:s.spark==="heavy"?10:t==="special"?11:7}class Wy{fighters;projectiles=[];events=[];config;frame=0;ticks=0;phase="intro";phaseFrame=0;round=1;timer=0;hitstop=0;freeze=0;freezeOwner=null;slowmo=0;cinematic=null;roundWinner=null;matchWinner=null;perfect=!1;paused=!1;camN={x:0,z:1};scheduled=[];seed;constructor(t){this.config=t,this.seed=t.seed??Math.random()*2**31|0;const e=new Xu(0,t.p1),i=new Xu(1,t.p2);e.opponent=i,i.opponent=e,this.fighters=[e,i],e.victoryVariant=this.rngInt(3),i.victoryVariant=this.rngInt(3),this.placeFighters(),this.timer=t.roundTime*60,t.training||t.skipIntro?(this.startRound(),t.training&&(this.phase="fight",this.phaseFrame=0)):(this.phase="intro",e.state="intro",i.state="intro")}get training(){return!!this.config.training}infiniteMeter(t){return!!this.config.training?.infiniteMeter&&t.index>=0}rng(){let t=this.seed+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}rngInt(t){return Math.floor(this.rng()*t)}emit(t){this.events.push(t),this.events.length>400&&this.events.splice(0,this.events.length-400)}drainEvents(){const t=this.events;return this.events=[],t}schedule(t,e){this.scheduled.push({at:this.frame+t,fn:e})}clampPos(t,e=.35){const i=Ds-e,n=Math.hypot(t.x,t.z);return n<=i?{x:t.x,z:t.z}:{x:t.x/n*i,z:t.z/n*i}}atWall(t,e=.45){return Math.hypot(t.x,t.z)>=Ds-e}get screenRight(){return{x:this.camN.z,z:-this.camN.x}}spawnProjectile(t,e){const i=new Vy(t,{z:t.z,...e});return this.projectiles.push(i),this.emit({t:"projectile",id:i.id,owner:t.index}),i}hasProjectile(t,e){return this.projectiles.some(i=>i.owner===t&&i.tag===e&&!i.dead)}removeProjectiles(t,e){for(const i of this.projectiles)i.owner===t&&i.tag===e&&(i.dead=!0)}superFlash(t,e){this.freeze=e.superFreeze??40,this.freezeOwner=t,this.emit({t:"superFlash",fighter:t.index,name:e.name,color:e.color??16763904}),this.emit({t:"rumble",fighter:t.index,strong:.4,weak:.8,ms:400})}isThreatened(t){const e=t.opponent,i=t.distTo(e);if(e.state==="attack"&&e.move&&i<3.4&&e.moveFrame<=e.move.startup+e.move.active)return!0;for(const n of this.projectiles){if(n.owner!==e||n.dead)continue;const r=t.x-n.x,a=t.z-n.z,o=Math.hypot(r,a);if(n.kind==="rain"&&o<1.5||o<3.8&&(n.attach||r*n.vx+a*n.vz>0))return!0}return!1}placeFighters(){const[t,e]=this.fighters;t.resetForRound(-2,0,0),e.resetForRound(2,0,Math.PI),this.camN={x:0,z:1},this.updateAxis(1)}skipIntro(){this.phase==="intro"&&this.startRound()}startRound(){this.phase="roundStart",this.phaseFrame=0,this.timer=this.config.roundTime*60,this.projectiles=[],this.scheduled=[],this.cinematic=null,this.hitstop=0,this.freeze=0,this.slowmo=0,this.roundWinner=null,this.perfect=!1,this.placeFighters();for(const t of this.fighters)t.koed=!1}resetPositions(){this.placeFighters(),this.projectiles=[],this.scheduled=[],this.cinematic=null;for(const t of this.fighters)t.koed=!1,this.config.training?.infiniteMeter&&(t.meter=yr)}updateAxis(t=.12){const[e,i]=this.fighters,n=i.x-e.x,r=i.z-e.z,a=Math.hypot(n,r);if(a>.05){let l=-r/a,c=n/a;l*this.camN.x+c*this.camN.z<0&&(l=-l,c=-c);const h=this.camN.x+(l-this.camN.x)*t,f=this.camN.z+(c-this.camN.z)*t,u=Math.hypot(h,f)||1;this.camN={x:h/u,z:f/u}}const o=this.screenRight;for(const l of this.fighters){const c=l.opponent,h=(c.x-l.x)*o.x+(c.z-l.z)*o.z;Math.abs(h)>.05&&(l.facing=h>0?1:-1)}}tick(t){if(this.ticks++,this.paused)return;const e=this.phase==="fight";if(this.updateAxis(),this.fighters[0].recordInput(e?t[0]:Xe),this.fighters[1].recordInput(e?t[1]:Xe),this.hitstop>0){this.hitstop--;return}if(this.freeze>0){this.freeze--,this.freeze===0&&(this.freezeOwner=null);return}this.slowmo>0&&(this.slowmo--,this.slowmo%2===1)||(this.phaseFrame++,this.simulate(),this.phaseLogic())}simulate(){if(this.frame++,this.scheduled.length){const t=this.scheduled.filter(e=>e.at<=this.frame);this.scheduled=this.scheduled.filter(e=>e.at>this.frame);for(const e of t)e.fn()}this.cinematic&&this.updateCinematic();for(const t of this.fighters)t.update(this);this.updateThrows();for(const t of this.fighters)t.physics(this);this.resolvePush(),this.checkWalls(),this.updateProjectiles(),this.phase==="fight"&&this.detectHits(),this.config.training&&this.trainingUpkeep()}phaseLogic(){const[t,e]=this.fighters;switch(this.phase){case"intro":this.phaseFrame>=200&&this.startRound();break;case"roundStart":{if(this.phaseFrame===1){const i=t.roundsWon===this.config.roundsToWin-1&&e.roundsWon===this.config.roundsToWin-1;this.emit({t:"round",n:this.round}),this.emit({t:"announce",text:i?"FINAL ROUND":`ROUND ${this.round}`,big:!0,frames:60})}this.phaseFrame===66&&(this.emit({t:"fight"}),this.emit({t:"announce",text:"FIGHT!",big:!0,frames:45})),this.phaseFrame>=76&&(this.phase="fight",this.phaseFrame=0);break}case"fight":{if(this.config.roundTime>0&&!this.training&&!this.cinematic&&(this.timer--,this.timer<=0)){this.timeout();break}if(this.cinematic)break;const i=this.fighters.filter(n=>n.health<=0);i.length&&this.ko(i);break}case"ko":{if(this.phaseFrame>=110)for(const i of this.fighters)!i.koed&&this.roundWinner===i.index&&i.state!=="victory"&&i.grounded&&(i.actionable||this.phaseFrame===110)&&(i.move=null,i.throwExec=null,i.faceOpponent(),i.setState("victory"));this.phaseFrame>=200&&this.endRound();break}case"roundEnd":this.phaseFrame>=30&&(this.round++,this.startRound());break}}ko(t){this.phase="ko",this.phaseFrame=0,this.slowmo=70;for(const i of t)i.koed=!0,i.state!=="juggle"&&i.enterJuggle(.17,-i.dirX*.07,-i.dirZ*.07);this.roundWinner=t.length===2?-1:1-t[0].index;const e=this.roundWinner>=0?this.fighters[this.roundWinner]:null;this.perfect=!!e&&e.health>=e.stats.maxHealth,this.emit({t:"ko",loser:t.length===2?-1:t[0].index,perfect:this.perfect}),this.emit({t:"announce",text:t.length===2?"DOUBLE K.O.":"K.O.",big:!0,frames:100}),this.emit({t:"shake",amount:.35});for(const i of this.fighters)this.emit({t:"rumble",fighter:i.index,strong:1,weak:1,ms:600})}timeout(){this.phase="ko",this.phaseFrame=0;const[t,e]=this.fighters,i=t.health/t.stats.maxHealth,n=e.health/e.stats.maxHealth;this.roundWinner=Math.abs(i-n)<1e-6?-1:i>n?0:1,this.perfect=!1;for(const r of this.fighters)(r.state==="attack"||r.state==="dash"||r.state==="run"||r.state==="walkF"||r.state==="walkB")&&(r.move=null,r.grounded&&r.setState("idle"));this.emit({t:"timeout"}),this.emit({t:"announce",text:"TIME",big:!0,frames:100})}endRound(){const[t,e]=this.fighters;this.roundWinner===-1?(t.roundsWon++,e.roundsWon++):this.roundWinner!==null&&this.fighters[this.roundWinner].roundsWon++;const i=this.config.roundsToWin,n=t.roundsWon>=i,r=e.roundsWon>=i;if(n||r){this.matchWinner=n&&r?-1:n?0:1,this.phase="matchEnd",this.phaseFrame=0;const a=this.matchWinner>=0?this.fighters[this.matchWinner]:null;this.emit({t:"announce",text:a?`${a.def.name.toUpperCase()} WINS`:"DRAW GAME",big:!0,frames:150}),a&&(a.move=null,a.faceOpponent(),a.grounded&&a.setState("victory"))}else this.phase="roundEnd",this.phaseFrame=0}trainingUpkeep(){const t=this.config.training;for(const e of this.fighters)t.infiniteMeter&&(e.meter=yr),t.infiniteHealth&&(e.health<=0&&(e.health=1),e.actionable&&e.stateFrame>40&&e.health<e.stats.maxHealth&&(e.health=e.stats.maxHealth)),e.koed&&(e.koed=!1)}resolvePush(){const[t,e]=this.fighters;for(const x of this.fighters){const m=this.clampPos(x);x.x=m.x,x.z=m.z}const i=x=>x.state==="thrown"||x.state==="cinematic"||x.koed&&x.state==="ko";if(i(t)||i(e))return;const n=t.y+(t.isCrouching?1.1:1.7),r=e.y+(e.isCrouching?1.1:1.7);if(t.y>=r-.25||e.y>=n-.25)return;let a=e.x-t.x,o=e.z-t.z,l=Math.hypot(a,o);const c=tp*2;if(l>=c)return;l<1e-4?(a=t.dirX,o=t.dirZ,l=1):(a/=l,o/=l);const h=c-Math.min(l,c),f=this.atWall(t,.4),u=this.atWall(e,.4),d=f&&!u?0:u&&!f?h:h/2,p=h-d;t.x-=a*d,t.z-=o*d,e.x+=a*p,e.z+=o*p;for(const x of this.fighters){const m=this.clampPos(x);x.x=m.x,x.z=m.z}}checkWalls(){for(const t of this.fighters){if(!this.atWall(t,.4)||t.koed)continue;const e=Math.hypot(t.vx+t.slideX,t.vz+t.slideZ);t.x*(t.vx+t.slideX)+t.z*(t.vz+t.slideZ)>0&&(t.state==="juggle"&&e>.03&&t.y<1.6||t.state==="hitstun"&&e>.12)&&(t.enterWallsplat(lh,this),this.hitstop=Math.max(this.hitstop,8),this.emit({t:"shake",amount:.18}))}}tryGrab(t,e){const i=t.opponent;if(!i.grounded||i.y>.05||i.isInvuln("throw"))return;switch(i.state){case"hitstun":case"blockstun":case"juggle":case"knockdown":case"getup":case"thrown":case"jumpSquat":case"techroll":case"wallsplat":return}const n=t.localOf(i.x,i.z);if(!(n.f<-.2||n.f>(e.throwRange??1)||Math.abs(n.l)>.55)){if(e.grabCinematic){this.startCinematic(t,i,e.grabCinematic.damage,e.grabCinematic.name,e.color??16763904,e.prop);return}t.throwExec={target:i,frame:0,total:44,damage:(e.throwDamage??120)*t.outgoingMul(e.kind),techable:!!e.techable,back:e.kind==="throw"&&t.throwBack,move:e},t.move=e.kind==="throw"?wf:zy,t.moveFrame=0,t.stateFrame=0,i.move=null,i.throwExec=null,i.setState("thrown"),i.grabbedBy=t,i.guarding=!1,this.emit({t:"sfx",name:"grab"}),e.kind!=="throw"&&this.emit({t:"special",fighter:t.index,name:e.name,color:e.color??16777215})}}updateThrows(){for(const t of this.fighters){const e=t.throwExec;if(!e)continue;const i=e.target;if(i.state!=="thrown"){t.throwExec=null;continue}e.frame++;const n=this.clampPos(t.ahead(.72));if(i.x=n.x,i.z=n.z,i.y=.12+Math.sin(Math.min(1,e.frame/26)*Math.PI)*.35,i.vx=i.vy=i.vz=0,i.yaw=t.yaw+Math.PI,e.techable&&e.frame<=lo){const r=i.history;if(r.buffered(at.TH|at.LP|at.HP,lo)){r.consume(at.TH|at.LP|at.HP,lo),t.throwExec=null,t.move=null,i.grabbedBy=null,i.y=0,t.enterBlockstun(14),i.enterBlockstun(14),t.slideX=-t.dirX*.16,t.slideZ=-t.dirZ*.16,i.slideX=t.dirX*.16,i.slideZ=t.dirZ*.16,this.emit({t:"tech",x:(t.x+i.x)/2,y:1.2,z:(t.z+i.z)/2}),this.emit({t:"announce",text:"THROW BREAK!",frames:30});continue}}if(e.frame===26){let r=t.dirX,a=t.dirZ;if(e.back){const c=this.clampPos(t.ahead(-.8));i.x=c.x,i.z=c.z,r=-r,a=-a}const o=e.damage*i.incomingMul(!1);i.grabbedBy=null,i.y=.3,i.state="juggle",i.takeDamage(o,this),i.comboHits++;const l=e.move.hit?.effect;if(l?.drain){const c=Math.min(i.meter,l.drain);i.meter-=c,t.gainMeter(c)}l?.lifesteal&&t.heal(l.lifesteal),i.enterJuggle(.2,r*.11,a*.11),l?.stun&&i.health>0&&(i.pendingDizzy=l.stun),t.gainMeter(12),i.gainMeter(6),this.hitstop=Math.max(this.hitstop,10),i.flash=10,this.emit({t:"hit",x:i.x,y:1,z:i.z,spark:"heavy",blocked:!1,counter:!1,attacker:t.index,defender:i.index,damage:Math.round(o),color:e.move.color}),this.emit({t:"shake",amount:.2}),this.emit({t:"rumble",fighter:i.index,strong:.9,weak:.5,ms:250}),t.throwExec=null}}}startCinematic(t,e,i,n,r,a){for(const l of this.projectiles)l.owner===e&&(l.dead=!0);t.move=null,t.throwExec=null,t.fallMove=null,t.vx=t.vy=t.vz=t.slideX=t.slideZ=0,t.y=0,t.setState("cinematic"),e.move=null,e.throwExec=null,e.grabbedBy=null,e.vx=e.vy=e.vz=e.slideX=e.slideZ=0,e.y=0,e.setState("cinematic");const o=this.clampPos(t.ahead(.95));e.x=o.x,e.z=o.z,e.yaw=t.yaw+Math.PI,this.cinematic={att:t,def:e,frame:0,total:104,hits:8,damage:i,name:n,color:r,prop:a,scale:Math.max(.5,hh(e.comboHits+1))},this.emit({t:"sfx",name:"cinematic"})}updateCinematic(){const t=this.cinematic;t.frame++;const{att:e,def:i}=t;e.stateFrame=t.frame,i.stateFrame=t.frame;const n=11;if(t.frame%n===0&&t.frame/n<=t.hits){const r=t.frame/n,a=r===t.hits,o=t.damage/t.hits*e.outgoingMul("super")*i.incomingMul(!1)*t.scale*(a?1.4:.943);i.comboHits++,i.takeDamage(o,this,a),i.flash=8;const l=i.ahead(.2);this.emit({t:"hit",x:l.x,y:.9+r*37%7/10,z:l.z,spark:a?"super":"heavy",blocked:!1,counter:!1,attacker:e.index,defender:i.index,damage:Math.round(o),color:t.color}),this.emit({t:"shake",amount:a?.3:.08}),this.emit({t:"rumble",fighter:i.index,strong:a?1:.5,weak:.4,ms:a?400:90}),a&&(this.hitstop=14)}t.frame>=t.total&&(this.cinematic=null,e.state="idle",e.toNeutral(),i.state="idle",i.enterJuggle(.3,e.dirX*.1,e.dirZ*.1),i.juggleInvuln=!0)}detectHits(){const[t,e]=this.fighters,i=t.activeHitbox(),n=e.activeHitbox(),r=t.hurtboxes(),a=e.hurtboxes(),o=i?a.find(c=>qu(t,i,c)):void 0,l=n?r.find(c=>qu(e,n,c)):void 0;o&&i&&this.strike(t,e,i,o),l&&n&&this.strike(e,t,n,l)}strike(t,e,i,n){const r=t.move;if(!r?.hit)return;let a=r.hit;(r.maxHits??1)>1&&r.finalHit&&t.moveHits+1>=(r.maxHits??1)&&(a={...a,...r.finalHit});const l=Math.max(.2,Math.min(i.x+i.w/2,t.distTo(e)-n.r*.6)),c=t.ahead(l),h=Math.max(Math.min(t.y+i.y,n.y+n.h/2-.1),n.y-n.h/2+.1),f=this.resolveHit(t,e,a,{kind:r.kind,x:c.x,y:h,z:c.z});f!=="miss"&&(t.moveHits++,t.moveLastHit=t.moveFrame,f!=="counter"&&(t.moveConnected=!0,(f==="hit"||f==="armor")&&(t.moveHitConfirmed=!0),t.move===r&&r.onHit?.(t.ctx(this),f==="block"||f==="absorb")))}triggerCounter(t,e){const i=t.move.counterMove;e.move=null,e.enterHitstun(34,!0,!0),e.flash=6,t.faceOpponent(),t.startMove(i,.5,this),this.hitstop=Math.max(this.hitstop,12),this.emit({t:"counterHit",fighter:t.index}),this.emit({t:"announce",text:"COUNTER!",frames:40}),this.emit({t:"hit",x:(e.x+t.x)/2,y:1.3,z:(e.z+t.z)/2,spark:"special",blocked:!0,counter:!0,attacker:t.index,defender:e.index,damage:0,color:i.color})}resolveHit(t,e,i,n){const r=n.projectile,a=!!r;if(e.isInvuln(a?"projectile":"strike")||e.state==="knockdown"&&!i.otg)return"miss";if(e.inCounterWindow()&&e.move?.counterMove)return a?(this.emit({t:"clash",x:n.x,y:n.y,z:n.z}),"absorb"):(this.triggerCounter(e,t),"counter");if(a&&e.buff("reflect")&&r.kind!=="mega"&&r.kind!=="beam")return r.owner=e,r.vx=-r.vx,r.vz=-r.vz,r.dirX=-r.dirX,r.dirZ=-r.dirZ,r.reflected=!0,r.age=0,r.lastHitAge=-999,this.emit({t:"clash",x:n.x,y:n.y,z:n.z}),this.emit({t:"sfx",name:"reflect"}),"reflect";const o=e.buff("shield");if(o)return o.value--,o.value<=0&&(o.frames=0),this.hitstop=Math.max(this.hitstop,6),this.emit({t:"hit",x:n.x,y:n.y,z:n.z,spark:"light",blocked:!0,counter:!1,attacker:t.index,defender:e.index,damage:0,color:o.color}),this.emit({t:"sfx",name:"shield"}),"absorb";let l,c;if(a){const T=Math.hypot(r.vx,r.vz);l=T>0?r.vx/T:r.dirX,c=T>0?r.vz/T:r.dirZ}else{const T=e.x-t.x,v=e.z-t.z,w=Math.hypot(T,v);l=w>.01?T/w:t.dirX,c=w>.01?v/w:t.dirZ}const h=a?r.kind==="mega"?"super":"projectile":n.kind,f=i.spark==="heavy"||i.spark==="super"||i.spark==="special";if(e.canBlock()&&e.blockOK(i.guard)){let T=i.chip??0;return t.passive==="chipMaster"&&(T=Math.max(T*3,i.damage*.12)),T>0&&e.takeDamage(T*t.outgoingMul(h==="projectile"?"projectile":n.kind)*e.incomingMul(a),this),e.enterBlockstun(i.blockstun),e.slideX=l*i.pushback*1.15,e.slideZ=c*i.pushback*1.15,!a&&this.atWall(e)&&(t.slideX=-l*i.pushback*.9,t.slideZ=-c*i.pushback*.9),t.gainMeter(3),e.gainMeter(3),this.hitstop=Math.max(this.hitstop,Math.max(4,Ku(i,n.kind,a)-3)),this.emit({t:"hit",x:n.x,y:n.y,z:n.z,spark:"light",blocked:!0,counter:!1,attacker:t.index,defender:e.index,damage:0}),this.emit({t:"rumble",fighter:e.index,strong:.15,weak:.3,ms:80}),"block"}const u=!a&&e.isCounterable();let d=i.damage*t.outgoingMul(h);u&&(d*=t.passive==="counterPunch"?1.5:1.2),e.comboHits++;let p=hh(e.comboHits);if(t.passive==="comboMaster"&&(p=Math.max(.4,1-(e.comboHits-1)*.07)),(n.kind==="super"||h==="super")&&(p=Math.max(p,.5)),e.state==="knockdown"&&(p*=.5),d=Math.max(1,Math.round(d*p*e.incomingMul(a))),e.hasArmor())return e.consumeArmor(),e.takeDamage(d,this),e.comboHits=Math.max(0,e.comboHits-1),e.flash=8,this.hitstop=Math.max(this.hitstop,8),this.emit({t:"hit",x:n.x,y:n.y,z:n.z,spark:"heavy",blocked:!1,counter:!1,attacker:t.index,defender:e.index,damage:d,color:16755251}),this.emit({t:"sfx",name:"armor"}),"armor";if(e.throwExec){const T=e.throwExec.target;e.throwExec=null,T.grabbedBy=null,T.enterJuggle(.1,-T.dirX*.05,-T.dirZ*.05)}e.comboDamage+=d;const x=e.takeDamage(d,this),m=i.effect;if(m?.drain){const T=Math.min(e.meter,m.drain);e.meter-=T,t.gainMeter(T)}t.passive==="drainer"&&(e.meter-=Math.min(e.meter,4)),m?.lifesteal&&t.heal(m.lifesteal),t.passive==="vampire"&&t.heal(d*.12),m?.slow&&e.addBuff("slow",.6,m.slow,6719743,this);const g=!e.grounded||e.state==="juggle"||e.state==="air"||e.state==="fall",b=!!i.launch&&(i.launch>=Pa||n.kind!=="normal"||g),A=Math.sqrt(e.stats.weight),y=i.launchVx??.03;if(x)e.enterJuggle(.2,l*.08,c*.08);else if(e.health<=0)e.enterJuggle(Math.max(.2,i.launch??0),l*.08,c*.08);else if(e.state==="knockdown")e.stateFrame=Math.max(0,e.stateFrame-12);else if(e.state==="wallsplat")e.stun=Math.min(e.stun+14,30),e.y=Math.min(1.1,e.y+.08);else if(g){const T=e.state==="juggle"?e.vy/Is:e.vy;let v=Math.max(T,(b?i.launch*.75:.11)-e.juggleCount*.008);i.screw&&!e.screwed&&(e.screwed=!0,v=Math.max(v,.15),this.emit({t:"announce",text:"SCREW!",frames:24})),e.enterJuggle(v/A,l*(y+i.pushback*.25),c*(y+i.pushback*.25))}else if(b)e.enterJuggle(i.launch/A,l*y,c*y),i.launch>=Pa&&this.emit({t:"announce",text:"LAUNCH!",frames:22});else if(i.knockdown)e.enterJuggle(.12,l*.045,c*.045);else if(m?.stun)e.enterDizzy(m.stun),e.slideX=l*i.pushback,e.slideZ=c*i.pushback;else if(u&&i.crumpleCH)e.enterDizzy(52,!0),this.emit({t:"announce",text:"CRUMPLE!",frames:30});else{const T=i.guard==="high"||n.y>1.35;e.enterHitstun(i.hitstun+(u?6:0),T,f);const v=i.pushback*(i.wall?1.3:1);e.slideX=l*v/A,e.slideZ=c*v/A,!a&&this.atWall(e)&&(i.wall?e.enterWallsplat(lh,this):(t.slideX=-l*i.pushback*.9,t.slideZ=-c*i.pushback*.9))}t.gainMeter((i.meterGain??5)+d*.03),e.gainMeter(d*.05),this.hitstop=Math.max(this.hitstop,Ku(i,n.kind,a)+(u?3:0)),e.flash=5;const E=i.spark??"light";this.emit({t:"hit",x:n.x,y:n.y,z:n.z,spark:E,blocked:!1,counter:u,attacker:t.index,defender:e.index,damage:d,color:r?.color}),u&&(this.emit({t:"counterHit",fighter:t.index}),this.emit({t:"announce",text:"COUNTER HIT",frames:30}));const M=E==="super"?1:f?.7:.35;return this.emit({t:"rumble",fighter:e.index,strong:M,weak:M*.6,ms:f?200:110}),this.emit({t:"rumble",fighter:t.index,strong:M*.3,weak:M*.5,ms:80}),(f||u)&&this.emit({t:"shake",amount:E==="super"?.22:u?.14:.08}),"hit"}updateProjectiles(){const t=this.projectiles;for(const e of t)e.update(e.owner.opponent);for(let e=0;e<t.length;e++){const i=t[e];if(!(!i.active||i.kind==="trap"))for(let n=e+1;n<t.length;n++){const r=t[n];if(!r.active||r.kind==="trap"||r.owner===i.owner||!i.touches(r))continue;const a=i.durability;i.durability-=Math.max(1,Math.min(r.durability,3)),r.durability-=Math.max(1,Math.min(a,3)),i.durability<=0&&(i.dead=!0),r.durability<=0&&(r.dead=!0),this.emit({t:"clash",x:(i.x+r.x)/2,y:(i.y+r.y)/2,z:(i.z+r.z)/2})}}if(this.phase==="fight")for(const e of t){if(!e.active)continue;const i=e.owner.opponent;if(e.kind==="trap"&&!i.grounded||e.age-e.lastHitAge<e.rehit||!i.hurtboxes().find(o=>e.overlaps(o)))continue;let r=e.hit;e.hitsLeft===1&&(e.kind==="mega"||e.durability>1)&&e.hit.damage>0&&(r={...r,knockdown:!0,launch:r.launch??.18});const a=this.resolveHit(e.owner,i,r,{kind:e.kind==="mega"?"super":"special",projectile:e,x:(e.x+i.x)/2,y:Math.max(.3,Math.min(e.y,i.y+1.6)),z:(e.z+i.z)/2});a==="miss"||a==="reflect"||(e.hitsLeft--,e.lastHitAge=e.age,e.onHit?.(i,a==="block"),(e.hitsLeft<=0||a==="absorb")&&(e.dead=!0))}t.some(e=>e.dead)&&(this.projectiles=t.filter(e=>!e.dead))}}const Xy={1:"↙",2:"↓",3:"↘",4:"←",5:"•",6:"→",7:"↖",8:"↑",9:"↗"};class qy{constructor(t,e,i){this.app=t,this.root=Vt("div","hud");const n=Vt("div","top");e.fighters.forEach((a,o)=>{const l=o===0?"l":"r",c=Fn[a.def.party],h=Vt("div",`hp-wrap ${l}`);h.innerHTML=`${en(a.def,"hp-port")}
        <div class="hp-col">
          <div class="hp ${l}"><i class="rec"></i><i class="trail"></i><i class="fill"></i></div>
          <div class="hp-name"><span class="n">${Ct(a.def.nick??a.def.name.split(" ").slice(-1)[0])}</span><span class="he">${Ct(a.def.nameHe)}</span><span class="chip" style="background:${Lr(c.color)}">${Ct(c.name)}</span></div>
          <div class="pips"></div>
        </div>`,this.hp[o]=h.querySelector(".fill"),this.trail[o]=h.querySelector(".trail"),this.rec[o]=h.querySelector(".rec"),this.pips[o]=h.querySelector(".pips"),o===0||(this.timer=Vt("div","timer","99"),n.appendChild(this.timer)),n.appendChild(h)}),this.timer=n.querySelector(".timer"),this.root.appendChild(n);const r=Vt("div","bottom");e.fighters.forEach((a,o)=>{const c=Vt("div",`meter-wrap ${o===0?"l":"r"}`);c.innerHTML='<div class="buffs"></div><div class="meter-label">ULTIMATE</div><div class="meter"><i></i></div>',this.meter[o]=c.querySelector(".meter i"),this.meterBar[o]=c.querySelector(".meter"),this.meterLabel[o]=c.querySelector(".meter-label"),this.buffs[o]=c.querySelector(".buffs"),r.appendChild(c)}),this.root.appendChild(r);for(let a=0;a<2;a++){const o=a===0?"l":"r";this.combo[a]=Vt("div",`combo ${o}`,'<div class="n">0</div><div class="t">HITS</div><div class="d"></div>'),this.special[a]=Vt("div",`special-name ${o}`),this.quote[a]=Vt("div",`quote-bubble ${o}`),this.root.append(this.combo[a],this.special[a],this.quote[a])}this.dim=Vt("div","super-dim"),this.banner=Vt("div","super-banner",'<div class="strip"></div><div class="txt"><div class="who"></div><div class="mv"></div></div>'),this.announceEl=Vt("div","announce"),this.flash=Vt("div","flash"),this.root.prepend(this.dim),this.root.append(this.banner,this.announceEl,this.flash),i.training&&(this.training=Vt("div","training-panel panel"),this.root.appendChild(this.training)),(i.inputDisplay||i.training)&&(this.inputDisp=Vt("div","input-disp"),this.root.appendChild(this.inputDisp)),this.renderPips(e)}app;root;hp=[];trail=[];rec=[];meter=[];meterBar=[];meterLabel=[];lastLabel=["",""];buffs=[];pips=[];timer;announceEl;announceLeft=0;combo=[];comboHold=[0,0];comboBest=[{hits:0,dmg:0},{hits:0,dmg:0}];special=[];specialLeft=[0,0];banner;bannerLeft=0;dim;flash;quote=[];training=null;inputDisp=null;inputLog=[];lastInput="";lastCombo={hits:0,dmg:0};lastHpText=["",""];lastTicks=-1;renderPips(t){t.fighters.forEach((e,i)=>{let n="";for(let r=0;r<t.config.roundsToWin;r++)n+=`<div class="pip ${r<e.roundsWon?"on":""}"></div>`;this.pips[i].innerHTML=t.training?"":n})}showQuote(t,e,i){this.quote[t].textContent=`“${e}”`,this.quote[t].classList.toggle("show",i)}announce(t,e,i){this.announceEl.className="announce",this.announceEl.offsetWidth,this.announceEl.textContent=t,this.announceEl.className=`announce show ${e?"big":"small"}`,this.announceLeft=i}event(t,e){switch(t.t){case"announce":this.announce(t.text,!!t.big,t.frames??50);break;case"special":this.special[t.fighter].textContent=t.name+"!",this.special[t.fighter].style.color=fc(t.color),this.special[t.fighter].classList.add("show"),this.specialLeft[t.fighter]=70;break;case"superFlash":{const i=e.fighters[t.fighter];this.banner.querySelector(".who").textContent=`${i.def.name.toUpperCase()} · ULTIMATE`;const n=this.banner.querySelector(".mv");n.textContent=t.name,n.style.color=fc(t.color),this.banner.querySelector(".txt").style.textAlign=t.fighter===0?"left":"right",this.banner.classList.add("show"),this.dim.classList.add("show"),this.bannerLeft=52,this.doFlash();break}case"lifeline":this.announce(`${t.name}!`,!1,70),this.doFlash();break;case"ko":this.doFlash();break;case"round":this.renderPips(e);break}}doFlash(){this.flash.classList.remove("go"),this.flash.offsetWidth,this.flash.classList.add("go")}update(t,e){const i=this.lastTicks<0?1:Math.max(0,t.ticks-this.lastTicks);this.lastTicks=t.ticks;for(let n=0;n<i;n++)this.countdown();t.fighters.forEach((n,r)=>{const a=Math.max(0,n.health/n.stats.maxHealth*100),o=`${a.toFixed(2)}%`;this.lastHpText[r]!==o&&(this.hp[r].style.width=o,this.trail[r].style.width=o,this.lastHpText[r]=o),this.hp[r].classList.toggle("low",a<25),this.rec[r].style.width=`${Math.min(100,a+n.recoverable/n.stats.maxHealth*100).toFixed(2)}%`;const l=n.meter/yr*100;this.meter[r].style.width=`${l}%`;const c=n.meter>=yr;this.meterBar[r].classList.toggle("full",c),this.meterLabel[r].classList.toggle("full",c);const h=n.inRage&&!n.rageArtUsed;this.meterLabel[r].classList.toggle("rage",h&&!c),this.hp[r].classList.toggle("rage",n.inRage);const f=c?`ULTIMATE READY ${this.app.glyph("UL",r)}`:h?`RAGE ART ${this.app.glyph("UL",r)}`:`ULTIMATE ${Math.floor(l)}%`;this.lastLabel[r]!==f&&(this.meterLabel[r].innerHTML=f,this.lastLabel[r]=f);const u=n.buffs.map(p=>p.kind.toUpperCase()).join(" · "),d=n.passive==="lifeline"&&!n.lifelineUsed?"♥ "+n.def.passive.name:"";this.buffs[r].textContent=[u,d].filter(Boolean).join("  ")});for(let n=0;n<2;n++){const r=t.fighters[n],a=1-n;r.comboHits>=2&&(this.comboBest[a]={hits:r.comboHits,dmg:r.comboDamage},this.combo[a].innerHTML=`<div class="n">${r.comboHits}</div><div class="t">HITS</div><div class="d">${r.comboDamage} DMG</div>`,this.combo[a].classList.add("show"),this.comboHold[a]=70,a===0&&(this.lastCombo={hits:r.comboHits,dmg:r.comboDamage})),r.comboHits===1&&a===0&&(this.lastCombo={hits:1,dmg:r.comboDamage})}if(t.training||t.config.roundTime===0)this.timer.textContent="∞";else{const n=Math.max(0,Math.ceil(t.timer/60));this.timer.textContent=String(n),this.timer.classList.toggle("low",n<=10)}if(t.phase==="roundStart"&&t.phaseFrame===2&&this.renderPips(t),t.phase==="matchEnd"&&t.phaseFrame===1&&this.renderPips(t),this.training){const n=t.fighters[1],r=t.config.training?.dummy??"stand";this.training.innerHTML=`<b>TRAINING</b><br>Last combo: ${this.lastCombo.hits} hits · ${this.lastCombo.dmg} dmg<br>
        Dummy: ${r.toUpperCase()}<br>Dummy HP: ${Math.round(n.health)} / ${n.stats.maxHealth}<br>
        ${this.app.glyph("SELECT",0)} reset positions · ${this.app.glyph("START",0)} menu`}if(this.inputDisp&&e){const n=e[0],r=[],a=[[at.LP,"LP"],[at.HP,"HP"],[at.LK,"LK"],[at.HK,"HK"],[at.SP,"SP"],[at.UL,"UL"],[at.TH,"TH"],[at.SS,"SS"]];for(const[l,c]of a)n.pressed&l&&r.push(c);const o=`${n.dir}|${r.join("+")}`;o!==this.lastInput&&(n.dir!==5||r.length)&&(this.inputLog.unshift(`<span class="arrow">${Xy[n.dir]}</span> ${r.join("+")}`),this.inputLog.length=Math.min(this.inputLog.length,14)),this.lastInput=o,this.inputDisp.innerHTML=this.inputLog.join("<br>")}}countdown(){for(let t=0;t<2;t++)this.specialLeft[t]>0&&--this.specialLeft[t]===0&&this.special[t].classList.remove("show"),this.comboHold[t]>0&&--this.comboHold[t]===0&&this.combo[t].classList.remove("show");this.bannerLeft>0&&--this.bannerLeft===0&&(this.banner.classList.remove("show"),this.dim.classList.remove("show")),this.announceLeft>0&&--this.announceLeft===0&&this.announceEl.classList.add("hide")}destroy(){this.root.remove()}}const Ky=[{motion:Ca.qcf,btn:"P",dir:""},{motion:Ca.qcb,btn:"K",dir:"→ +"},{motion:Ca.dp,btn:"P",dir:"↓ +"}],$u={"d/f":"↘","d/b":"↙","u/f":"↗","u/b":"↖",f:"→",b:"←",d:"↓",u:"↑"},Yu={1:"LP",2:"HP",3:"LK",4:"HK"};function $y(s,t){return s.split(/(d\/f|d\/b|u\/f|u\/b|\b[fbdu]\b|[1-4])/).map(e=>$u[e]?`<span class="arrow">${$u[e]}</span>`:Yu[e]?t(Yu[e]):Ct(e)).join("")}function Zu(s,t,e,i){return t==="P"?`${s.glyph("LP",e,i)}/${s.glyph("HP",e,i)}`:`${s.glyph("LK",e,i)}/${s.glyph("HK",e,i)}`}function Tf(s,t,e=0){const i=s.glyphStyle(e)==="kb"&&s.menuStyle()!=="kb"?s.menuStyle():s.glyphStyle(e),n=l=>s.glyph(l,e,i),r=[];r.push('<tr class="hdr"><td colspan="3">SPECIAL MOVES</td></tr>'),t.specials.forEach((l,c)=>{const h=Ky[c];r.push(`<tr><td class="mv" style="color:${fc(l.color)}">${Ct(l.name)}</td>
      <td class="in"><span class="arrow">${h.motion}</span> + ${Zu(s,h.btn,e,i)}<br><span style="color:var(--muted)">or</span> ${h.dir} ${n("SP")}</td>
      <td class="ds">${Ct(yf(l))}${l.type==="dive"?" Works in the air.":""}</td></tr>`)}),r.push('<tr class="hdr"><td colspan="3">ULTIMATE (FULL METER)</td></tr>'),r.push(`<tr><td class="mv" style="color:var(--gold)">${Ct(t.ultimate.name)}</td>
    <td class="in"><span class="arrow">${Ca.dqcf}</span> + ${Zu(s,"P",e,i)}<br><span style="color:var(--muted)">or</span> ${n("UL")}</td>
    <td class="ds">${Ct(Mf(t.ultimate))}</td></tr>`),r.push('<tr class="hdr"><td colspan="3">PASSIVE ABILITY</td></tr>'),r.push(`<tr><td class="mv">${Ct(t.passive.name)}</td><td class="in">Always on</td><td class="ds">${Ct(t.passive.desc)}</td></tr>`),r.push('<tr class="hdr"><td colspan="3">SYSTEM</td></tr>');const a=[["Guard","Stand still / hold ← · hold ↓ or ↙","Tekken guard: standing blocks highs and mids, crouching blocks lows. Highs whiff over crouching opponents."],["Sidestep",`${n("SS")} <span style="color:var(--muted)">or tap</span> ↑ / ↓`,"Step into the background or toward the camera. Linear attacks miss; homing moves track you."],["Sidewalk",`Hold ${n("SS")}`,"Circle around your opponent."],["Dash · Run","→ → (hold →)","Dash in; keep holding to run. Run + 2 is the Dash Punch."],["Backdash","← ← (repeat)","Chain backdashes to escape (Korean backdash)."],["Throw",`${n("TH")} <span style="color:var(--muted)">or</span> ${n("LP")}+${n("LK")}`,"Close range. Hold ← to throw backwards. Break it by pressing throw, 1 or 2 as you are grabbed."],["Launch & juggle",`↘ ${n("HP")} · ↗ ${n("HK")} · WS ${n("HP")}`,"Launchers pop the opponent into the air: follow up with strings before they land. Screw moves extend the juggle."],["Walls","—","Heavy hits near the arena edge cause a wall splat: free follow-up."],["Tech roll · Get up","Any attack as you land · any input","Roll away when you hit the floor, or get up when you choose."],["Rage",`Below 25% health: ${n("UL")}`,"Red aura. Fire your Ultimate as a Rage Art without meter, once per round."],["Cancels",`Normal → Special → ${n("UL")}`,"Normals that connect cancel into specials; specials that hit cancel into the Ultimate."]];for(const[l,c,h]of a)r.push(`<tr><td class="mv">${l}</td><td class="in">${c}</td><td class="ds">${h}</td></tr>`);r.push(`<tr class="hdr"><td colspan="3">COMMAND LIST · ${n("LP")}=1 ${n("HP")}=2 ${n("LK")}=3 ${n("HK")}=4</td></tr>`);const o={high:"High",mid:"Mid",low:"Low",overhead:"Mid",unblockable:"!"};for(const l of Ly)r.push(`<tr><td class="mv">${Ct(l.name)} <span style="color:var(--muted);font-size:12px">${o[l.guard]??""}</span></td>
      <td class="in">${$y(l.input,n)}</td><td class="ds">${Ct(l.desc??"")}</td></tr>`);return`<div class="ml-head">${en(t)}<div><div class="display" style="font-size:40px;line-height:1">${Ct(t.name)}</div>
    <div style="font-size:20px"><span class="he">${Ct(t.nameHe)}</span></div>${vf(t)}
    <div style="color:var(--muted);margin-top:4px">${Ct(t.role)} · ${Ct(_f[t.style])}</div>
    <div style="margin-top:6px;max-width:720px">${Ct(t.bio)}</div></div></div>
    <table class="ml-table">${r.join("")}</table>`}class Yy{constructor(t,e,i){this.app=t,this.index=e,this.back=i}app;index;back;page;enter(){this.page=Vt("div","page"),this.app.ui.append(this.page,Vt("div","hint",`◀ ▶ Change fighter (${this.index+1}/40) ${this.app.mg("back")} Back`)),this.render()}render(){this.page.innerHTML=Tf(this.app,Ee[this.index],0);const t=this.app.ui.querySelector(".hint");t&&(t.innerHTML=`◀ ▶ Change fighter (${this.index+1}/40) ${this.app.mg("back")} Back`)}exit(){}tick(){const t=this.app.input.menu("any");t.back?(this.app.audio.sfx("menuBack"),this.back()):t.left||t.l1?(this.index=(this.index+Ee.length-1)%Ee.length,this.app.audio.sfx("menuMove"),this.render()):t.right||t.r1?(this.index=(this.index+1)%Ee.length,this.app.audio.sfx("menuMove"),this.render()):t.down?this.page.scrollTop+=80:t.up&&(this.page.scrollTop-=80)}frame(t){this.app.renderer.syncShowcase(t,{pos:[2,1.5,6],look:[0,1.1,0]})}}const Zy=[{a:"TH",x:16,y:5,ps:"L2",cls:"g-shoulder"},{a:"SS",x:16,y:15,ps:"L1",cls:"g-shoulder"},{a:"UL",x:84,y:5,ps:"R2",cls:"g-shoulder"},{a:"SP",x:84,y:15,ps:"R1",cls:"g-shoulder"},{a:"MOVE",x:20,y:44,ps:"✚",cls:"g-shoulder"},{a:"HP",x:80,y:30,ps:"△",cls:"g-triangle"},{a:"HK",x:92,y:45,ps:"○",cls:"g-circle"},{a:"LK",x:80,y:60,ps:"✕",cls:"g-cross"},{a:"LP",x:67,y:45,ps:"□",cls:"g-square"},{a:"SELECT",x:34,y:27,ps:"CREATE",cls:"g-shoulder"},{a:"START",x:66,y:27,ps:"OPTIONS",cls:"g-shoulder"}];class Jy{constructor(t,e){this.app=t,this.back=e}app;back;menu;status;remap=null;remapOrder=["LP","HP","LK","HK","SP","UL","TH","SS"];enter(){const t=this.app,e=Vt("div","page"),i=Zy.map(r=>`<div class="pad-lbl" style="left:${r.x}%;top:${r.y}%"><span class="g ${r.cls}">${r.ps}</span>${r.a==="MOVE"?"Move":so[r.a]}</div>`).join(""),n=r=>`<span class="g g-key">${Ps(r.UP[0])}${Ps(r.LEFT[0])}${Ps(r.DOWN[0])}${Ps(r.RIGHT[0])}</span><span>Move</span>`+ul.map(a=>`<span>${r[a].map(o=>`<span class="g g-key">${Ps(o)}</span>`).join(" ")}</span><span>${so[a]}</span>`).join("");e.innerHTML=`<h1 class="display">Controls</h1>
      <div class="sub">Plug in a PS5 DualSense (USB or Bluetooth) and press any button. Chrome, Edge and the desktop app read it natively.</div>
      <div class="ctrl-grid">
        <div class="panel"><h3>PS5 DualSense</h3><div class="pad-diagram"><div class="pad-body"></div>${i}<div class="pad-lbl" style="left:36%;top:70%">Left stick: Move</div></div>
          <div class="status"></div></div>
        <div class="panel"><h3>Controller setup</h3><div id="menu-slot"></div></div>
        <div class="panel"><h3>Keyboard · Player 1</h3><div class="kv">${n(ur)}</div></div>
        <div class="panel"><h3>Keyboard · Player 2</h3><div class="kv">${n(dr)}</div></div>
      </div>`,this.status=e.querySelector(".status"),this.menu=new Ks([{label:"Swap P1 / P2 controllers",onSelect:()=>{t.input.swapSlots(),this.refresh()}},{label:"Remap P1 buttons",onSelect:()=>this.startRemap(0)},{label:"Remap P2 buttons",onSelect:()=>this.startRemap(1)},{label:"Reset P1 mapping",onSelect:()=>{const r=t.input.slotPad[0];r!==null&&t.input.resetBinding(r),this.refresh()}},{label:"Reset P2 mapping",onSelect:()=>{const r=t.input.slotPad[1];r!==null&&t.input.resetBinding(r),this.refresh()}},{label:"Test rumble",onSelect:()=>{t.input.rumble(0,1,1,400),t.input.rumble(1,1,1,400)}},{label:"Back",onSelect:()=>this.back()}],t.audio),e.querySelector("#menu-slot").appendChild(this.menu.el),t.ui.append(e,Vt("div","hint",`${t.mg("confirm")} Select ${t.mg("back")} Back`)),t.input.onChange=()=>this.refresh(),this.refresh()}refresh(){const t=this.app.input,e=t.connectedPads(),i=r=>{const a=t.padInfo(r);if(!a)return`<div class="status-line">P${r+1}: <b>keyboard only</b></div>`;const o=t.bindingFor(a.index),l=this.remapOrder.map(c=>`${c}=${o[c]}`).join(" ");return`<div class="status-line">P${r+1}: <b>${Ct(a.kind==="dualsense"?"DualSense":a.kind==="dualshock"?"DualShock 4":a.kind==="xbox"?"Xbox controller":"Gamepad")}</b> <span style="color:var(--muted);font-size:12px">#${a.index} · ${Ct(l)}</span></div>`};let n=`<div class="status-line">Controllers connected: <b>${e.length}</b></div>${i(0)}${i(1)}`;if(e.some(r=>!r.standard)&&(n+='<div class="status-line" style="color:#ffb3aa">A controller is in raw mode (non-Chrome browser). If buttons feel wrong, use Remap or play in Chrome / Edge / the desktop app.</div>'),this.remap){const r=this.remapOrder[this.remap.step];n+=`<div class="status-line" style="font-size:20px;margin-top:10px">Press the button for <b>${so[r]}</b> on P${this.remap.slot+1}'s controller… <span style="color:var(--muted);font-size:13px">(Esc to cancel)</span></div>`}this.status.innerHTML=n}startRemap(t){const e=this.app.input.slotPad[t];if(e===null){this.status.insertAdjacentHTML("beforeend",`<div class="status-line" style="color:#ffb3aa">No controller assigned to P${t+1}.</div>`);return}this.remap={slot:t,step:0,binding:{...this.app.input.bindingFor(e)}},this.refresh(),this.captureNext()}captureNext(){this.app.input.captureNextButton((t,e)=>{const i=this.remap;if(i){if(t!==this.app.input.slotPad[i.slot]){this.captureNext();return}i.binding[this.remapOrder[i.step]]=e,i.step++,this.app.audio.sfx("menuConfirm"),i.step>=this.remapOrder.length?(this.app.input.setBinding(t,i.binding),this.remap=null,this.suppress=20):this.captureNext(),this.refresh()}})}suppress=0;exit(){this.app.input.captureNextButton(null),this.app.input.onChange=null}tick(){if(this.remap){this.app.input.keyPressed("Escape")&&(this.remap=null,this.app.input.captureNextButton(null),this.refresh());return}if(this.suppress>0){this.suppress--;return}const t=this.app.input.menu("any");if(t.back){this.app.audio.sfx("menuBack"),this.back();return}this.menu.handle(t)}frame(t){this.app.renderer.syncShowcase(t,{pos:[2,1.5,6],look:[0,1.1,0]})}}class jy{constructor(t,e,i){this.app=t,this.setup=e,this.winner=i}app;setup;winner;menu;t=0;enter(){const t=this.app,{p1:e,p2:i}=this.setup,n=this.winner===0?e:this.winner===1?i:null;n&&t.renderer.setShowcase([{def:n,x:0,facing:1,pose:"victory",variant:0}],!1),this.menu=new Ks([{label:"Rematch",onSelect:()=>t.go(new Gc(t,this.setup))},{label:"Change Stage",onSelect:()=>t.go(new Af(t,this.setup.mode,e,i))},{label:"Character Select",onSelect:()=>t.go(new eo(t,this.setup.mode))},{label:"Main Menu",onSelect:()=>t.go(new di(t))}],t.audio);const r=Vt("div","results"),a=Vt("div","col");a.innerHTML=n?`${en(n)}<div class="winner display">${Ct(n.name)} wins</div><div class="he" style="font-size:24px">${Ct(n.nameHe)}</div><div class="quote">“${Ct(n.quotes.win)}”</div>`:'<div class="winner display">Draw game</div><div class="quote">A hung parliament. Again.</div>',a.appendChild(this.menu.el),r.appendChild(a),t.ui.append(r,Vt("div","hint",`${t.mg("confirm")} Select`))}exit(){}tick(){this.menu.handle(this.app.input.menu("any"))}frame(t){this.t+=t,this.app.renderer.syncShowcase(t,{pos:[1.6+Math.sin(this.t*.3)*.5,1.4,4.2],look:[-.6,1.2,0]})}}class Hc{constructor(t){this.app=t}app;left=170;enter(){const t=this.app,e=t.arcade,i=e.ladder[e.index];t.renderer.setStage(e.stages[e.index]),t.renderer.clearFighters(),t.renderer.setShowcase([{def:i,x:0,facing:-1,pose:"intro"}],!1);const n=e.ladder.map((a,o)=>`<div class="rung ${o<e.index?"done":""} ${o===e.index?"cur":""} ${a.boss?"boss":""}">${en(a)}${Ct(a.name.split(" ").slice(-1)[0])}</div>`).join(""),r=Vt("div","results");r.innerHTML=`<div class="col">
      <div class="display" style="font-size:28px;color:var(--muted)">Arcade · Stage ${e.index+1} / ${e.ladder.length}</div>
      <div class="winner display">${i.boss?"Final boss":"Next opponent"}</div>
      <div class="display" style="font-size:44px;color:var(--gold)">${Ct(i.name)}</div>
      <div class="he" style="font-size:22px">${Ct(i.nameHe)}</div>
      <div style="color:var(--muted)">${Ct(i.role)}</div>
      <div class="ladder">${n}</div>
    </div>`,t.ui.append(r,Vt("div","hint",`${t.mg("confirm")} Fight ${t.mg("back")} Quit`)),t.audio.say(i.boss?`Final boss. ${i.name}`:`Next: ${i.name}`)}start(){const t=this.app,e=t.arcade,i={mode:"arcade",p1:e.player,p2:e.ladder[e.index],stage:e.stages[e.index],cpu:[!1,!0]};t.lastSetup=i,t.go(new Gc(t,i,()=>t.go(new Ur(t,i))))}exit(){}tick(){const t=this.app.input.menu("any");if(t.back){this.app.go(new di(this.app));return}(--this.left<=0||t.confirm)&&this.start()}frame(t){this.app.renderer.syncShowcase(t,{pos:[-1.8,1.4,4.4],look:[.6,1.2,0]})}}class Qy{constructor(t){this.app=t}app;left=600;el;enter(){const t=this.app,e=t.arcade,i=e.ladder[e.index];t.renderer.setShowcase([{def:i,x:0,facing:-1,pose:"victory",variant:2}],!1);const n=Vt("div","results");n.innerHTML=`<div class="col"><div class="winner display">Continue?</div>
      <div class="quote">${Ct(i.name)}: “${Ct(i.quotes.win)}”</div>
      <div class="display" style="font-size:120px;color:var(--gold)" id="cd">10</div>
      <div>${t.mg("confirm")} Continue &nbsp; ${t.mg("back")} Give up</div></div>`,t.ui.appendChild(n),this.el=n.querySelector("#cd")}exit(){}tick(){const t=this.app,e=t.input.menu("any");this.left--,this.el.textContent=String(Math.ceil(this.left/60)),e.confirm?(t.arcade.continues++,t.go(new Hc(t))):e.back||this.left<=0?t.go(new di(t)):(e.extra||e.extra2)&&(this.left=Math.max(1,this.left-60))}frame(t){this.app.renderer.syncShowcase(t,{pos:[-1.8,1.4,4.4],look:[.6,1.2,0]})}}class tM{constructor(t){this.app=t}app;t=0;enter(){const t=this.app,e=t.arcade,i=e.player;t.renderer.setShowcase([{def:i,x:0,facing:1,pose:"victory",variant:0}],!1),t.audio.say(`Congratulations, Prime Minister ${i.name}!`);const n=Vt("div","ending");n.innerHTML=`<h1 class="display">Coalition formed!</h1>
      <p>Against all odds, <b>${Ct(i.name)}</b> has survived the plenum, outlasted ${e.ladder.length} rivals and assembled a 61-seat majority${e.continues?` (after ${e.continues} emergency election${e.continues>1?"s":""})`:""}.<br>
      The President has asked ${Ct(i.name.split(" ")[0])} to form the next government. It will last at least… until the next arcade run.</p>
      <div class="defeated">${e.ladder.map(r=>en(r)).join("")}</div>
      <p style="color:var(--muted);font-size:14px">Street Knesset Fighter · a parody. Thanks for playing!</p>
      <div>${t.mg("confirm")} Main Menu</div>`,t.ui.appendChild(n)}exit(){}tick(){const t=this.app.input.menu("any");this.t>1.5&&(t.confirm||t.start)&&(this.app.arcade=null,Vc(this.app,!0),this.app.go(new di(this.app)))}frame(t){this.t+=t;const e=this.t*.25;this.app.renderer.syncShowcase(t,{pos:[Math.sin(e)*4,1.5,Math.cos(e)*4],look:[0,1.2,0]})}}const eM=["zero","one","two","three","four","five","six","seven","eight","nine"],$n=["stand","crouch","jump","block","cpu"];class Ur{constructor(t,e){this.app=t,this.setup=e}app;setup;match;hud;cpu=[null,null];dummyCpu=null;paused=!1;pauseEl=null;pauseMenu=null;pauseSub="menu";movesSlot=0;endTimer=0;inputs=[Xe,Xe];finished=!1;get training(){return this.setup.mode==="training"}enter(){const t=this.app,e=t.settings,{p1:i,p2:n,stage:r}=this.setup;this.match=new Wy({p1:i,p2:n,roundsToWin:this.training?1:e.roundsToWin,roundTime:this.training?0:e.roundTime,training:this.training?{infiniteHealth:!0,infiniteMeter:!0,dummy:"stand"}:null}),t.renderer.clearShowcase(),t.renderer.setStage(r),t.renderer.setFighters([i,n]),t.renderer.snapCamera([0,1.8,7.5],[0,1.1,0]);let a=e.difficulty;this.setup.mode==="arcade"&&t.arcade&&(t.arcade.index>=4&&a++,n.boss&&a++),a=Math.max(0,Math.min(4,a)),this.cpu=[this.setup.cpu[0]?new al(this.setup.mode==="watch"?e.difficulty:a,101):null,this.setup.cpu[1]?new al(a,202):null],this.dummyCpu=new al(e.difficulty,303),this.hud=new qy(t,this.match,{training:this.training,inputDisplay:e.inputDisplay}),t.ui.appendChild(this.hud.root),t.audio.playMusic(r.music,r.id.length+i.id.length)}exit(){this.hud?.destroy()}humanSlots(){const t=[];return this.setup.cpu[0]||t.push(0),!this.setup.cpu[1]&&!this.training&&t.push(1),t}openPause(){this.paused=!0,this.match.paused=!0,this.pauseSub="menu",this.app.audio.sfx("menuConfirm"),this.buildPause()}closePause(){this.paused=!1,this.match.paused=!1,this.pauseEl?.remove(),this.pauseEl=null,this.pauseMenu=null}buildPause(){const t=this.app;this.pauseEl?.remove();const e=Vt("div","pause"),i=Vt("div","box panel");if(e.appendChild(i),this.pauseSub==="moves"){const n=this.match.fighters[this.movesSlot];i.style.maxHeight="86vh",i.style.overflow="auto",i.style.width="min(1000px, 92vw)",i.innerHTML=Tf(t,n.def,this.movesSlot)+`<div class="hint" style="position:static;margin-top:14px">◀ ▶ Switch fighter ${t.mg("back")} Back</div>`,this.pauseMenu=null}else{i.innerHTML='<h2 class="display">Paused</h2>';const n=this.match.config.training,r=[{label:"Resume",onSelect:()=>this.closePause()},{label:"Move List",onSelect:()=>{this.pauseSub="moves",this.movesSlot=0,this.buildPause()}}];n&&r.push({label:"Dummy",value:()=>n.dummy.toUpperCase(),onLeft:()=>{n.dummy=$n[($n.indexOf(n.dummy)+$n.length-1)%$n.length]},onRight:()=>{n.dummy=$n[($n.indexOf(n.dummy)+1)%$n.length]}},{label:"Infinite Meter",value:()=>n.infiniteMeter?"On":"Off",onLeft:()=>{n.infiniteMeter=!n.infiniteMeter},onRight:()=>{n.infiniteMeter=!n.infiniteMeter}},{label:"Show Hitboxes",value:()=>t.renderer.showHitboxes?"On":"Off",onLeft:()=>{t.renderer.showHitboxes=!t.renderer.showHitboxes},onRight:()=>{t.renderer.showHitboxes=!t.renderer.showHitboxes}},{label:"Reset Positions",onSelect:()=>{this.match.resetPositions(),this.closePause()}}),r.push({label:"Restart Match",onSelect:()=>t.go(new Ur(t,this.setup))},{label:"Character Select",onSelect:()=>t.go(new eo(t,this.setup.mode))},{label:"Main Menu",onSelect:()=>t.go(new di(t))}),this.pauseMenu=new Ks(r,t.audio),i.appendChild(this.pauseMenu.el)}this.pauseEl=e,t.ui.appendChild(e)}tickPause(){const t=this.app.input.menu("any");if(this.pauseSub==="moves"){t.back||t.start?(this.pauseSub="menu",this.app.audio.sfx("menuBack"),this.buildPause()):(t.left||t.right||t.l1||t.r1)&&(this.movesSlot=this.movesSlot===0?1:0,this.app.audio.sfx("menuMove"),this.buildPause());return}if(t.back||t.start){this.closePause();return}this.pauseMenu?.handle(t)}tick(){if(this.paused){this.tickPause();return}const t=this.match,e=this.app,i=this.humanSlots(),n=[Xe,Xe];for(const a of[0,1])this.cpu[a]?n[a]=this.cpu[a].next(t.fighters[a],t):this.training&&a===1?n[1]=wy(t.config.training.dummy,t.fighters[1],t,this.dummyCpu):n[a]=e.input.player(a);const r=i.length?i:[0,1];for(const a of r)if((this.cpu[a]?e.input.player(a):n[a]).pressed&at.START&&t.phase!=="matchEnd"){this.openPause();return}this.training&&n[0].pressed&at.SELECT&&t.resetPositions(),t.phase==="intro"?(e.input.menu("any").confirm&&t.skipIntro(),this.hud.showQuote(0,t.fighters[0].def.quotes.intro,t.phaseFrame>10&&t.phaseFrame<100),this.hud.showQuote(1,t.fighters[1].def.quotes.intro,t.phaseFrame>=100&&t.phaseFrame<195)):(this.hud.showQuote(0,"",!1),this.hud.showQuote(1,"",!1)),this.inputs=n,t.tick(n);for(const a of t.drainEvents())this.onEvent(a);if(t.phase==="matchEnd"){this.endTimer++;const a=t.matchWinner;this.endTimer===60&&a!==null&&a>=0&&this.hud.showQuote(a,t.fighters[a].def.quotes.win,!0);const o=this.endTimer>90&&e.input.menu("any").confirm;(this.endTimer>=260||o)&&!this.finished&&(this.finished=!0,this.finish(a))}}onEvent(t){const e=this.app,i=this.match;e.renderer.handleEvent(t,i),this.hud.event(t,i);const n=e.audio;switch(t.t){case"hit":t.blocked?n.sfx(t.counter?"counter":"block"):n.sfx(t.spark==="super"?"hitSuper":t.spark==="light"?"hitLight":"hitHeavy",.9+Math.random()*.2);break;case"whiff":n.sfx(t.heavy?"whooshHeavy":"whoosh",.9+Math.random()*.2);break;case"special":n.sfx("special",.8+t.color%7/14);break;case"projectile":n.sfx("projectile",.9+Math.random()*.2);break;case"superFlash":n.sfx("superFlash");break;case"ko":n.sfx("ko"),n.say(t.perfect?"K.O. Perfect!":"K.O.");break;case"announce":{const r=t.text;if(r.startsWith("ROUND"))n.say(`Round ${eM[i.round]??i.round}`);else if(r==="FINAL ROUND")n.say("Final round");else if(r==="FIGHT!")n.say("Fight!");else if(r==="TIME")n.say("Time!");else if(r.endsWith("WINS")){const a=i.matchWinner!==null&&i.matchWinner>=0?i.fighters[i.matchWinner].def.name:"";n.say(`${a} wins!`)}else r==="DRAW GAME"&&n.say("Draw game");(r==="FIGHT!"||r.startsWith("ROUND")||r==="FINAL ROUND")&&n.sfx("round");break}case"jump":n.sfx("jump");break;case"land":n.sfx(t.hard?"landHard":"land");break;case"tech":n.sfx("tech");break;case"buff":n.sfx("buff");break;case"teleport":n.sfx("teleport");break;case"lifeline":n.sfx("lifeline"),n.say(t.name);break;case"clash":n.sfx("clash");break;case"wallsplat":n.sfx("landHard",.8),n.sfx("crowd");break;case"techroll":n.sfx("whoosh",.8);break;case"rage":n.sfx("buff",.7),n.say("Rage!");break;case"counterHit":n.sfx("counter");break;case"sfx":n.sfx(t.name==="cinematic"?"superFlash":t.name);break;case"rumble":this.setup.cpu[t.fighter]||e.input.rumble(t.fighter,t.strong,t.weak,t.ms);break}}finish(t){const e=this.app;if(this.setup.mode==="arcade"&&e.arcade){const i=e.arcade;t===0?(i.index++,i.index>=i.ladder.length?e.go(new tM(e)):e.go(new Hc(e))):e.go(new Qy(e));return}e.go(new jy(e,this.setup,t??-1))}frame(t){this.app.renderer.syncFight(this.match,this.paused?0:t),this.hud.update(this.match,this.inputs)}}const Cs=10;function Ju(s){const t=Ef(s);return[["Power",(t.dmgMul-.85)/.4],["Speed",(t.walk/.052-.75)/.6],["Health",(t.maxHealth/1e3-.85)/.4],["Defense",(1/t.defMul-.8)/.45]].map(([i,n])=>`<span>${i}</span><div class="bar"><i style="width:${Math.round(Math.max(.08,Math.min(1,n))*100)}%"></i></div>`).join("")}function iM(s,t,e,i){const n=`<div class="stats">${i?Ju(s).replace(/<span>(\w+)<\/span>(<div class="bar">.*?<\/div>)/g,"$2<span>$1</span>"):Ju(s)}</div>`;return`<div class="who">${Ct(t)}</div>
    <div class="name display">${Ct(s.name)}${s.nick?` <span style="color:var(--gold)">“${Ct(s.nick)}”</span>`:""}</div>
    <div class="he">${Ct(s.nameHe)}</div>
    ${vf(s)}
    <div class="role">${Ct(s.role)} · ${Ct(_f[s.style])}</div>
    <div class="passive"><b>${Ct(s.passive.name)}:</b> ${Ct(s.passive.desc)}</div>
    ${n}
    ${e?'<div class="locked">✔ LOCKED IN</div>':""}`}class eo{constructor(t,e){this.app=t,this.mode=e}app;mode;cursor=[0,9];locked=[!1,!1];pickingSlot=0;cells=[];info=[];shown=["",""];t=0;leaveIn=-1;get dual(){return this.mode==="versus"}get needsP2(){return this.mode!=="arcade"}enter(){const t=this.app;t.renderer.clearFighters(),t.renderer.clearStage(),t.renderer.setShowcase([],!1),t.renderer.snapCamera([0,1.35,8.8],[0,1.1,0]);const e=t.lastSetup;e&&(this.cursor[0]=Math.max(0,Ee.findIndex(o=>o.id===e.p1.id)),this.needsP2&&(this.cursor[1]=Math.max(0,Ee.findIndex(o=>o.id===e.p2.id))));const i={arcade:"Arcade · Choose your candidate",versus:"Versus · Choose your candidates",training:"Training · Choose your fighter",watch:"CPU vs CPU · Choose both fighters"}[this.mode],n=Vt("div","screen");n.innerHTML=`<div class="cs-title display">${Ct(i)}</div>`;const r=Vt("div","cs-grid");this.cells=Ee.map((o,l)=>{const c=Vt("div","cs-cell");return c.innerHTML=`${en(o)}<div class="nm">${Ct(o.name.split(" ").slice(-1)[0])}</div>`,c.addEventListener("mouseenter",()=>{const h=this.dual?0:this.pickingSlot;this.locked[h]||(this.cursor[h]=l,this.refresh())}),c.addEventListener("click",()=>{const h=this.dual?0:this.pickingSlot;this.cursor[h]=l,this.lock(h)}),r.appendChild(c),c}),n.appendChild(r),this.info[0]=Vt("div","cs-info left panel"),this.info[1]=Vt("div","cs-info right panel"),n.append(this.info[0]),this.needsP2&&n.append(this.info[1]);const a=Vt("div","hint",`${t.mg("confirm")} Select ${t.mg("back")} Back ${t.mg("extra")} Random`);n.appendChild(a),t.ui.appendChild(n),this.refresh()}exit(){}slotLabel(t){return this.mode==="watch"?t===0?"CPU 1":"CPU 2":this.mode==="training"?t===0?"PLAYER 1":"DUMMY":this.mode==="arcade"||t===0?"PLAYER 1":"PLAYER 2"}refresh(){this.cells.forEach((t,e)=>{const i=this.cursor[0]===e,n=this.needsP2&&this.cursor[1]===e&&(this.dual||this.pickingSlot===1||this.locked[1]);t.classList.toggle("p1",i),t.classList.toggle("p2",n),t.querySelectorAll(".tag").forEach(r=>r.remove()),i&&t.insertAdjacentHTML("beforeend",`<div class="tag t1">${this.mode==="watch"?"C1":"1P"}</div>`),n&&t.insertAdjacentHTML("beforeend",`<div class="tag t2">${this.mode==="training"?"DUM":this.mode==="watch"?"C2":"2P"}</div>`)});for(const t of[0,1]){if(t===1&&!this.needsP2)continue;const e=t===0||this.dual||this.pickingSlot===1||this.locked[1];this.info[t].style.visibility=e?"visible":"hidden";const i=Ee[this.cursor[t]];this.info[t].innerHTML=iM(i,this.slotLabel(t),this.locked[t],t===1);const n=`${i.id}:${this.locked[t]}:${e}`;this.shown[t]!==n&&(this.shown[t]=n,this.app.renderer.updateShowcaseSlot(t,e?{def:i,x:t===0?-3.7:3.7,facing:t===0?1:-1,pose:this.locked[t]?"victory":"guard",variant:t}:null))}}lock(t){this.locked[t]||(this.locked[t]=!0,this.app.audio.sfx("select"),!this.dual&&t===0&&this.needsP2&&(this.pickingSlot=1,this.cursor[1]===this.cursor[0]&&(this.cursor[1]=(this.cursor[0]+1)%Ee.length)),this.refresh(),this.locked[0]&&(!this.needsP2||this.locked[1])&&(this.leaveIn=40))}move(t,e,i){const n=Ee.length,r=Math.ceil(n/Cs);let a=this.cursor[t]%Cs,o=Math.floor(this.cursor[t]/Cs);a=(a+e+Cs)%Cs,o=(o+i+r)%r,this.cursor[t]=Math.min(n-1,o*Cs+a),this.app.audio.sfx("menuMove"),this.refresh()}handleSlot(t,e){if(e.back){if(this.locked[t]){this.locked[t]=!1,this.leaveIn=-1,this.app.audio.sfx("menuBack"),this.refresh();return}if(!this.dual&&t===1){this.pickingSlot=0,this.locked[0]=!1,this.app.audio.sfx("menuBack"),this.refresh();return}this.app.audio.sfx("menuBack"),this.app.go(new di(this.app));return}this.locked[t]||(e.left?this.move(t,-1,0):e.right?this.move(t,1,0):e.up?this.move(t,0,-1):e.down&&this.move(t,0,1),e.extra?(this.cursor[t]=Math.floor(Math.random()*Ee.length),this.lock(t)):e.confirm&&this.lock(t))}tick(){if(this.leaveIn>0){--this.leaveIn===0&&this.finish();const t=this.app.input.menu(this.dual?0:"any");if(t.back&&this.handleSlot(this.dual?0:this.pickingSlot,t),this.dual){const e=this.app.input.menu(1);e.back&&this.handleSlot(1,e)}return}this.dual?(this.handleSlot(0,this.app.input.menu(0)),this.handleSlot(1,this.app.input.menu(1))):this.handleSlot(this.pickingSlot,this.app.input.menu("any"))}finish(){const t=this.app,e=Ee[this.cursor[0]];if(this.mode==="arcade"){const n=Ee.filter(l=>l.id!==e.id).sort(()=>Math.random()-.5),r=e.id==="netanyahu"?Ee.find(l=>l.id==="lapid"):Ee.find(l=>l.id==="netanyahu"),a=n.filter(l=>l.id!==r.id).slice(0,7);a.push(_y(r));const o=a.map((l,c)=>c===a.length-1?Yi[0]:Yi[Math.floor(Math.random()*Yi.length)]);t.arcade={player:e,ladder:a,stages:o,index:0,continues:0},t.go(new Hc(t));return}const i=Ee[this.cursor[1]];t.go(new Af(t,this.mode,e,i))}frame(t){this.t+=t,this.app.renderer.syncShowcase(t,{pos:[0,1.35,8.8],look:[0,1.1,0]})}}class Af{constructor(t,e,i,n){this.app=t,this.mode=e,this.p1=i,this.p2=n}app;mode;p1;p2;menu;descEl;t=0;current=-1;enter(){const t=this.app,e=[...Yi.map((a,o)=>({label:a.name,onSelect:()=>this.go(Yi[o])})),{label:"Random",onSelect:()=>this.go(Yi[Math.floor(Math.random()*Yi.length)])}];this.menu=new Ks(e,t.audio);const i=Vt("div","screen");i.innerHTML='<div class="cs-title display">Choose the arena</div>';const n=Vt("div","ss-list");n.appendChild(this.menu.el),this.descEl=Vt("div","ss-desc panel"),i.append(n,this.descEl,Vt("div","hint",`${t.mg("confirm")} Select ${t.mg("back")} Back`)),t.ui.appendChild(i);const r=t.lastSetup?.stage;r&&(this.menu.index=Math.max(0,Yi.findIndex(a=>a.id===r.id))),this.menu.render(),t.renderer.setShowcase([{def:this.p1,x:-1.6,facing:1,pose:"guard"},{def:this.p2,x:1.6,facing:-1,pose:"guard",variant:1}],!1),this.preview()}preview(){const t=this.menu.index;if(t===this.current)return;this.current=t;const e=Yi[t];e?(this.app.renderer.setStage(e),this.app.audio.playMusic(e.music,t+1),this.descEl.innerHTML=`<div class="name display">${Ct(e.name)}</div><div class="he" style="font-size:22px">${Ct(e.nameHe)}</div><div style="color:var(--muted);margin-top:6px">${Ct(e.desc)}</div>`):this.descEl.innerHTML='<div class="name display">Random</div><div style="color:var(--muted)">Let the coalition decide.</div>'}go(t){const e={mode:this.mode,p1:this.p1,p2:this.p2,stage:t,cpu:this.mode==="versus"?[!1,!1]:this.mode==="watch"?[!0,!0]:[!1,this.mode!=="training"]};this.app.lastSetup=e,this.app.go(new Gc(this.app,e))}exit(){}tick(){const t=this.app.input.menu("any");if(t.back){this.app.audio.sfx("menuBack"),this.app.go(new eo(this.app,this.mode));return}this.menu.handle(t),this.preview()}frame(t){this.t+=t;const e=this.t*.12;this.app.renderer.syncShowcase(t,{pos:[Math.sin(e)*8,2.6,Math.cos(e)*8+1],look:[0,1.2,-1]})}}class Gc{constructor(t,e,i){this.app=t,this.setup=e,this.onDone=i}app;setup;onDone;left=200;t=0;enter(){const t=this.app,{p1:e,p2:i,stage:n}=this.setup;t.renderer.setStage(n),t.renderer.setShowcase([{def:e,x:-1.4,facing:1,pose:"intro"},{def:i,x:1.4,facing:-1,pose:"intro"}],!1),t.audio.sfx("superFlash"),t.audio.say(`${e.name}. Versus. ${i.name}.`);const r=Lr(Fn[e.party].color),a=Lr(Fn[i.party].color),o=Vt("div","vs");o.innerHTML=`<div class="band l" style="background:linear-gradient(90deg, ${r}, transparent)"></div>
      <div class="band r" style="background:linear-gradient(270deg, ${a}, transparent)"></div>
      <div class="stagename display">${Ct(n.name)} · <span class="he">${Ct(n.nameHe)}</span></div>
      <div class="side l">${en(e,"portrait")}<div class="name display">${Ct(e.name)}</div><div class="he" style="font-size:22px">${Ct(e.nameHe)}</div><div class="quote">“${Ct(e.quotes.intro)}”</div></div>
      <div class="side r">${en(i,"portrait")}<div class="name display">${Ct(i.boss?"BOSS · "+i.name:i.name)}</div><div class="he" style="font-size:22px">${Ct(i.nameHe)}</div><div class="quote">“${Ct(i.quotes.intro)}”</div></div>
      <div class="big display">VS</div>`,t.ui.appendChild(o)}exit(){}tick(){this.left--;const t=this.app.input.menu("any");(this.left<=0||this.left<170&&(t.confirm||t.start))&&(this.onDone?this.onDone():this.app.go(new Ur(this.app,this.setup)))}frame(t){this.t+=t,this.app.renderer.syncShowcase(t,{pos:[Math.sin(this.t*.2)*2,1.4,5.2-this.t*.2],look:[0,1.25,0]})}}const ju=8,Si=440;class Cf{constructor(t,e){this.app=t,this.back=e}app;back;index=0;focus="grid";grid;cells=[];panel;canvas;preview;info;fileInput;drag=null;busy=!1;get def(){return Ee[this.index]}enter(){const t=this.app,e=Vt("div","page");e.innerHTML=`<h1 class="display">Faces</h1>
      <div class="sub">Photos come from each MK's Wikipedia article (free licences only). Drag to move, scroll to zoom, or upload your own photo.
      ${ty()==="cartoon"?'<br><b style="color:var(--gold)">Faces are set to Cartoon in Options: switch to Photos to see them in game.</b>':""}</div>
      <div class="fe-wrap"><div class="fe-grid"></div><div class="fe-panel panel"></div></div>`,this.grid=e.querySelector(".fe-grid"),this.panel=e.querySelector(".fe-panel"),this.cells=Ee.map((i,n)=>{const r=Vt("div","cs-cell");return r.addEventListener("click",()=>{this.index=n,this.focus="edit",this.refreshAll()}),this.grid.appendChild(r),r}),this.panel.innerHTML=`<div class="fe-title display"></div><div class="fe-info"></div>
      <div class="fe-row"><canvas width="${Si}" height="${Si}" class="fe-canvas"></canvas><div class="fe-preview"></div></div>
      <div class="fe-buttons">
        <button data-a="upload">Upload photo…</button><button data-a="auto">Auto crop</button>
        <button data-a="toggle"></button><button data-a="remove">Remove upload</button>
      </div>
      <div class="fe-keys"></div>`,this.canvas=this.panel.querySelector("canvas"),this.preview=this.panel.querySelector(".fe-preview"),this.info=this.panel.querySelector(".fe-info"),this.fileInput=document.createElement("input"),this.fileInput.type="file",this.fileInput.accept="image/*",this.fileInput.style.display="none",this.fileInput.addEventListener("change",()=>{const i=this.fileInput.files?.[0];i&&this.upload(i),this.fileInput.value=""}),e.appendChild(this.fileInput),this.panel.querySelectorAll("button").forEach(i=>i.addEventListener("click",()=>this.action(i.dataset.a))),this.canvas.addEventListener("pointerdown",i=>{const n=Ls(this.def.id);n&&(this.drag={x:i.clientX,y:i.clientY,crop:{...n.crop}},this.canvas.setPointerCapture(i.pointerId))}),this.canvas.addEventListener("pointermove",i=>{const n=Ls(this.def.id);if(!this.drag||!n)return;const r=this.fit(n.image).k,a=this.canvas.getBoundingClientRect(),o=Si/a.width;sl(this.def,{cx:this.drag.crop.cx-(i.clientX-this.drag.x)*o/(r*n.image.width),cy:this.drag.crop.cy-(i.clientY-this.drag.y)*o/(r*n.image.height),h:this.drag.crop.h}),this.refreshEditor()}),this.canvas.addEventListener("pointerup",()=>{this.drag=null,this.refreshCell(this.index)}),this.canvas.addEventListener("wheel",i=>{i.preventDefault(),this.zoom(i.deltaY>0?1.06:1/1.06)},{passive:!1}),e.addEventListener("dragover",i=>i.preventDefault()),e.addEventListener("drop",i=>{i.preventDefault();const n=i.dataTransfer?.files?.[0];n&&n.type.startsWith("image/")&&this.upload(n)}),t.ui.append(e,Vt("div","hint",`${t.mg("confirm")} Edit ${t.mg("back")} Back`)),this.refreshAll()}fit(t){const e=Math.min(Si/t.width,Si/t.height);return{k:e,ox:(Si-t.width*e)/2,oy:(Si-t.height*e)/2}}refreshCell(t){const e=Ee[t],i=this.cells[t],n=nl(e.id);i.innerHTML=`${en(e)}<div class="nm">${Ct(e.name.split(" ").slice(-1)[0])}${n?" · 🎨":""}</div>`,i.classList.toggle("p1",t===this.index)}refreshAll(){this.cells.forEach((t,e)=>this.refreshCell(e)),this.refreshEditor()}refreshEditor(){const t=this.def,e=Ls(t.id);this.panel.querySelector(".fe-title").textContent=t.name;const i=nl(t.id);this.panel.querySelector('[data-a="toggle"]').textContent=i?"Use photo":"Use cartoon",this.panel.querySelector('[data-a="remove"]').style.display=e?.source.kind==="upload"?"":"none",this.panel.classList.toggle("focused",this.focus==="edit");const n=e?.source;this.info.innerHTML=e?n?.kind==="upload"?"Your uploaded photo (stored only in this browser).":`Photo: ${Ct(n?.artist??"")} · ${Ct(n?.license??"")} · <a href="${Ct(n?.descUrl??"#")}" target="_blank" rel="noopener">source</a>${e.detected?"":' · <span style="color:var(--gold)">face not auto-detected: check the crop</span>'}`:"No free-licensed photo found (or you are offline). Upload one to use it in game.";const r=this.canvas.getContext("2d");if(r.fillStyle="#0b1020",r.fillRect(0,0,Si,Si),this.preview.innerHTML="",!e)r.fillStyle="#9aa6c4",r.font="18px Arial",r.textAlign="center",r.fillText("No photo yet: click Upload or drop an image here",Si/2,Si/2);else{const{k:l,ox:c,oy:h}=this.fit(e.image);r.drawImage(e.image,c,h,e.image.width*l,e.image.height*l);const f=cf(e.crop,e.image.width,e.image.height),u=c+(f.x+f.w/2)*l,d=h+(f.y+f.h/2)*l;r.save(),r.beginPath(),r.rect(0,0,Si,Si),r.ellipse(u,d,f.w*l*.465,f.h*l*.465,0,0,Math.PI*2),r.fillStyle="rgba(0,0,0,0.55)",r.fill("evenodd"),r.beginPath(),r.ellipse(u,d,f.w*l*.465,f.h*l*.465,0,0,Math.PI*2),r.lineWidth=3,r.strokeStyle="#ffcc33",r.stroke(),r.restore();const p=e.head.cloneNode();p.getContext("2d").drawImage(e.head,0,0),p.className="fe-head",this.preview.appendChild(p),this.preview.insertAdjacentHTML("beforeend",`<img class="fe-portrait" src="${e.portrait}" alt="">`)}const a=this.app.menuStyle(),o=a==="kb"?'<span class="g g-key">H</span>/<span class="g g-key">L</span>':`${this.app.glyph("TH",0,a)}/${this.app.glyph("UL",0,a)}`;this.panel.querySelector(".fe-keys").innerHTML=this.focus==="edit"?`Arrows / stick: move · ${o} zoom · ${this.app.mg("extra")} photo/cartoon · ${this.app.mg("extra2")} auto crop · ${this.app.mg("back")} done`:`Pick an MK, then ${this.app.mg("confirm")} to edit`}zoom(t){const e=Ls(this.def.id);e&&(sl(this.def,{...e.crop,h:e.crop.h*t}),this.refreshEditor(),this.refreshCell(this.index))}nudge(t,e){const i=Ls(this.def.id);i&&(sl(this.def,{cx:i.crop.cx+t*i.crop.h*.05,cy:i.crop.cy+e*i.crop.h*.05,h:i.crop.h}),this.refreshEditor(),this.refreshCell(this.index))}async upload(t){if(this.busy)return;this.busy=!0,this.info.textContent="Processing photo…";const e=await dy(this.def,t);this.busy=!1,e||(this.info.textContent="Could not read that image."),this.refreshAll()}action(t){const e=this.def;this.app.audio.sfx("menuConfirm"),t==="upload"?this.fileInput.click():t==="auto"?uy(e):t==="toggle"?df(e.id,!nl(e.id)):t==="remove"&&fy(e).then(()=>this.refreshAll()),this.refreshAll()}exit(){}tick(){if(this.busy)return;const t=this.app.input.menu("any");if(this.focus==="grid"){if(t.back){this.app.audio.sfx("menuBack"),this.back();return}const e=Ee.length;let i=!1;t.left?(this.index=(this.index+e-1)%e,i=!0):t.right?(this.index=(this.index+1)%e,i=!0):t.up?(this.index=(this.index+e-ju)%e,i=!0):t.down&&(this.index=(this.index+ju)%e,i=!0),i&&(this.app.audio.sfx("menuMove"),this.refreshAll()),t.confirm&&(this.focus="edit",this.app.audio.sfx("menuConfirm"),this.refreshEditor());return}if(t.back){this.focus="grid",this.app.audio.sfx("menuBack"),this.refreshAll();return}t.left&&this.nudge(-1,0),t.right&&this.nudge(1,0),t.up&&this.nudge(0,-1),t.down&&this.nudge(0,1),t.l1&&this.zoom(1.06),t.r1&&this.zoom(1/1.06),t.extra&&this.action("toggle"),t.extra2&&this.action("auto")}frame(t){this.app.renderer.syncShowcase(t,{pos:[2,1.5,6],look:[0,1.1,0]})}}class Pf{constructor(t,e){this.app=t,this.back=e}app;back;enter(){const t=sy(),e=t.map(({id:n,source:r})=>{const a=Ee.find(o=>o.id===n);return`<tr><td>${en(a,"cr-img")}</td><td><b>${Ct(a.name)}</b></td>
          <td>${Ct(r.artist??"")}</td><td>${Ct(r.license??"")}${r.licenseUrl?` · <a href="${Ct(r.licenseUrl)}" target="_blank" rel="noopener">licence</a>`:""}</td>
          <td><a href="${Ct(r.descUrl??"#")}" target="_blank" rel="noopener">${Ct(r.file??"file")}</a></td></tr>`}).join(""),i=Vt("div","page");i.innerHTML=`<h1 class="display">Credits</h1>
      <div class="sub">Street Knesset Fighter is a parody. MK photos are loaded live from Wikipedia / Wikimedia Commons under the free licences listed below,
      cropped and used as caricature heads. Photos remain the work of their authors. Photos you upload stay in your browser only.</div>
      ${t.length?`<table class="ml-table cr-table"><tr class="hdr"><td></td><td>MK</td><td>Photographer / author</td><td>Licence</td><td>Source file</td></tr>${e}</table>`:"<p>No photos loaded (offline, blocked, or Faces set to Cartoon).</p>"}
      <p class="sub" style="margin-top:24px">Code: TypeScript + three.js. Face detection: MediaPipe (Apache 2.0). Music, sound and 3D models are generated procedurally.</p>`,this.app.ui.append(i,Vt("div","hint",`${this.app.mg("back")} Back`))}exit(){}tick(){const t=this.app.input.menu("any");(t.back||t.confirm)&&(this.app.audio.sfx("menuBack"),this.back())}frame(t){this.app.renderer.syncShowcase(t,{pos:[2,1.5,6],look:[0,1.1,0]})}}const nM={bpm:108,root:50,mode:"dorian",intensity:.5};function cl(s){return s[Math.floor(Math.random()*s.length)]}class sM{constructor(t){this.app=t}app;bar;msg;done=!1;photosStarted=0;ticks=0;enter(){const t=Vt("div","loading");t.innerHTML=`<div class="logo"><span class="l1">Street</span><span class="l2">Knesset</span><span class="l3">Fighter</span></div>
      <div class="bar"><i style="width:0%"></i></div><div class="boot-msg" style="color:var(--muted);text-align:center">Drafting 40 members of Knesset…</div>`,this.app.ui.appendChild(t),this.bar=t.querySelector(".bar i"),this.msg=t.querySelector(".boot-msg"),Ty(Ee,(e,i)=>{this.bar.style.width=`${e/i*50}%`}).then(()=>{if(this.app.settings.faces!=="photo"){this.done=!0;return}this.photosStarted=this.ticks,this.msg.textContent="Fetching MK photos from Wikipedia…",mf(Ee,(e,i)=>{this.bar.style.width=`${50+e/i*50}%`,this.msg.innerHTML=`Fetching MK photos from Wikipedia… ${e}/${i}<br><span style="font-size:13px">Press any button to skip</span>`}).then(()=>{this.done=!0})})}exit(){}tick(){this.ticks++;const t=this.photosStarted?this.ticks-this.photosStarted:0,e=this.photosStarted>0&&t>60&&this.app.input.anyPressed();(this.done||e||t>2700)&&this.app.go(new Rf(this.app))}frame(){}}function Vc(s,t=!1){if(!t&&s.renderer.showcaseCount===2&&s.renderer.currentStage==="plenum")return;s.renderer.clearFighters(),s.renderer.setStage(gf.plenum);const e=cl(Ee);let i=cl(Ee);for(;i.id===e.id;)i=cl(Ee);s.renderer.setShowcase([{def:e,x:-1.3,facing:1,pose:"guard"},{def:i,x:1.3,facing:-1,pose:"guard"}],!1),s.audio.playMusic(nM,3)}class Rf{constructor(t){this.app=t}app;t=0;enter(){const t=this.app;Vc(t,!0),t.renderer.snapCamera([0,1.6,6.5],[0,1.2,0]);const e=Vt("div","title-wrap");e.innerHTML=`<div class="logo"><span class="l1">Street</span><span class="l2">Knesset</span><span class="l3">Fighter</span><span class="sub"><span class="he">סטריט כנסת פייטר</span> · 40 MKs · ONE PLENUM</span></div>
      <div class="press blink">PRESS ${t.mg("confirm")} / ENTER</div>
      <div class="pads-status"></div>
      <div class="disclaimer">A parody fighting game. All characters are caricatures of public figures; moves and quotes are satire, not real statements.</div>`,e.addEventListener("click",()=>this.next()),t.ui.appendChild(e),this.updatePads(),t.input.onChange=()=>this.updatePads()}updatePads(){const t=this.app.ui.querySelector(".pads-status");if(!t)return;const e=this.app.input.connectedPads();t.innerHTML=e.length?e.map(i=>`<b>${i.kind==="dualsense"?"DualSense":i.kind==="dualshock"?"DualShock":i.kind==="xbox"?"Xbox pad":"Gamepad"}</b> connected${i.standard?"":" (raw mode)"}`).join("<br>"):"No controller detected: press a button on your PS5 controller.<br>Keyboard works too."}next(){this.app.audio.unlock(),this.app.audio.sfx("menuConfirm"),this.app.go(new di(this.app))}exit(){this.app.input.onChange=null}tick(){const t=this.app.input.menu("any");(t.confirm||t.start)&&this.next()}frame(t){this.t+=t;const e=this.t*.15;this.app.renderer.syncShowcase(t,{pos:[Math.sin(e)*6.2,1.6+Math.sin(this.t*.4)*.2,Math.cos(e)*6.2],look:[0,1.15,0]})}}class di{constructor(t){this.app=t}app;static lastIndex=0;menu;t=0;enter(){const t=this.app,e=a=>()=>t.go(new eo(t,a)),i=[{label:"Arcade",desc:"Fight through 7 MKs and the final boss to form a government.",onSelect:e("arcade")},{label:"Versus",desc:"Two players, one plenum. Local multiplayer.",onSelect:e("versus")},{label:"Training",desc:"Practice combos against a dummy. Infinite health and meter.",onSelect:e("training")},{label:"CPU vs CPU",desc:"Sit back and watch two CPUs debate.",onSelect:e("watch")},{label:"Move Lists",desc:"Every special move, ultimate and passive for all 40 fighters.",onSelect:()=>t.go(new Yy(t,0,()=>t.go(new di(t))))},{label:"Controls",desc:"PS5 DualSense and keyboard layouts, controller assignment and remapping.",onSelect:()=>t.go(new Jy(t,()=>t.go(new di(t))))},{label:"Faces",desc:"Adjust any MK’s photo crop, or upload your own photo.",onSelect:()=>t.go(new Cf(t,()=>t.go(new di(t))))},{label:"Credits",desc:"Photo credits and licences.",onSelect:()=>t.go(new Pf(t,()=>t.go(new di(t))))},{label:"Options",desc:"Difficulty, rounds, timer, audio and more.",onSelect:()=>t.go(new rM(t,()=>t.go(new di(t))))}];t.desktop&&i.push({label:"Quit",desc:"Exit to desktop.",onSelect:()=>t.desktop.quit()}),this.menu=new Ks(i,t.audio,{desc:!0}),this.menu.index=Math.min(di.lastIndex,i.length-1),this.menu.render();const n=Vt("div","mainmenu");n.innerHTML='<div class="logo"><span class="l1">Street</span><span class="l2">Knesset</span><span class="l3">Fighter</span></div>',n.appendChild(this.menu.el);const r=Vt("div","hint",`${t.mg("confirm")} Select ${t.mg("back")} Back`);t.ui.append(n,r),Vc(t)}exit(){di.lastIndex=this.menu.index}tick(){const t=this.app.input.menu("any");if(t.back){this.app.audio.sfx("menuBack"),this.app.go(new Rf(this.app));return}this.menu.handle(t)}frame(t){this.t+=t;const e=.5+Math.sin(this.t*.1)*.3;this.app.renderer.syncShowcase(t,{pos:[Math.sin(e)*6+1.5,1.5,Math.cos(e)*6],look:[1.2,1.1,0]})}}class rM{constructor(t,e){this.app=t,this.back=e}app;back;menu;toggleFaces(){const t=this.app.settings;t.faces=t.faces==="photo"?"cartoon":"photo",this.app.applySettings(),t.faces==="photo"&&ny()===0&&mf(Ee)}enter(){const t=this.app,e=t.settings,i=(o,l)=>{e[o]=Math.round(Math.max(0,Math.min(1,e[o]+l))*10)/10,t.applySettings()},n=[30,60,99,0],r=[{label:"CPU Difficulty",value:()=>yy[e.difficulty],onLeft:()=>{e.difficulty=Math.max(0,e.difficulty-1),t.applySettings()},onRight:()=>{e.difficulty=Math.min(4,e.difficulty+1),t.applySettings()},desc:"How tough the CPU opponents are."},{label:"Rounds to Win",value:()=>String(e.roundsToWin),onLeft:()=>{e.roundsToWin=Math.max(1,e.roundsToWin-1),t.applySettings()},onRight:()=>{e.roundsToWin=Math.min(5,e.roundsToWin+1),t.applySettings()}},{label:"Round Time",value:()=>e.roundTime===0?"∞":`${e.roundTime}s`,onLeft:()=>{e.roundTime=n[(n.indexOf(e.roundTime)+n.length-1)%n.length],t.applySettings()},onRight:()=>{e.roundTime=n[(n.indexOf(e.roundTime)+1)%n.length],t.applySettings()}},{label:"Master Volume",value:()=>`${Math.round(e.masterVolume*100)}%`,onLeft:()=>i("masterVolume",-.1),onRight:()=>i("masterVolume",.1)},{label:"Music Volume",value:()=>`${Math.round(e.musicVolume*100)}%`,onLeft:()=>i("musicVolume",-.1),onRight:()=>i("musicVolume",.1)},{label:"SFX Volume",value:()=>`${Math.round(e.sfxVolume*100)}%`,onLeft:()=>i("sfxVolume",-.1),onRight:()=>i("sfxVolume",.1)},{label:"Announcer Voice",value:()=>e.announcer?"On":"Off",onLeft:()=>{e.announcer=!e.announcer,t.applySettings()},onRight:()=>{e.announcer=!e.announcer,t.applySettings()},desc:"Uses your system text-to-speech voice."},{label:"Controller Rumble",value:()=>e.rumble?"On":"Off",onLeft:()=>{e.rumble=!e.rumble,t.applySettings()},onRight:()=>{e.rumble=!e.rumble,t.applySettings()},desc:"DualSense vibration on hits (Chrome / Edge / desktop app)."},{label:"Show Hitboxes",value:()=>e.showHitboxes?"On":"Off",onLeft:()=>{e.showHitboxes=!e.showHitboxes,t.applySettings()},onRight:()=>{e.showHitboxes=!e.showHitboxes,t.applySettings()}},{label:"Input Display",value:()=>e.inputDisplay?"On":"Off",onLeft:()=>{e.inputDisplay=!e.inputDisplay,t.applySettings()},onRight:()=>{e.inputDisplay=!e.inputDisplay,t.applySettings()}},{label:"Faces",value:()=>e.faces==="photo"?"Photos":"Cartoon",onLeft:()=>this.toggleFaces(),onRight:()=>this.toggleFaces(),desc:"Photos: real MK faces from Wikipedia (free-licensed). Cartoon: procedural caricatures."},{label:"Graphics Quality",value:()=>e.quality==="high"?"High":"Low",onLeft:()=>{e.quality=e.quality==="high"?"low":"high",t.applySettings()},onRight:()=>{e.quality=e.quality==="high"?"low":"high",t.applySettings()},desc:"Low disables shadows and high-DPI rendering for integrated graphics."},{label:"Toggle Fullscreen",onSelect:()=>t.toggleFullscreen(),desc:"Or press F11."},{label:"Back",onSelect:()=>this.back()}];this.menu=new Ks(r,t.audio,{desc:!0});const a=Vt("div","page");a.innerHTML='<div class="options"><h1 class="display">Options</h1><div class="sub">Settings are saved automatically.</div></div>',a.querySelector(".options").appendChild(this.menu.el),t.ui.append(a,Vt("div","hint",`◀ ▶ Change ${t.mg("confirm")} Select ${t.mg("back")} Back`))}exit(){}tick(){const t=this.app.input.menu("any");if(t.back){this.app.audio.sfx("menuBack"),this.back();return}this.menu.handle(t)}frame(t){this.app.renderer.syncShowcase(t,{pos:[2,1.5,6],look:[0,1.1,0]})}}const hi=new xy;hi.go(new sM(hi));hi.start();new URLSearchParams(location.search).has("debug")&&(window.skfDebug={app:hi,fight(s,t,e="plenum",i="watch"){const n={mode:i,p1:Bu[s],p2:Bu[t],stage:gf[e],cpu:[i==="watch",i!=="versus"&&i!=="training"]},r=new Ur(hi,n);return hi.go(r),r},screen:()=>hi.screen,editor:()=>Cf,credits:()=>Pf,faces:()=>Ee.map(s=>{const t=Ls(s.id);return{id:s.id,loaded:!!t,detected:!!t?.detected,crop:t?.crop,license:t?.source.license}}),move(s,t){const e=hi.screen,i=e.match.fighters[s];i.meter=100;const n=t==="ult"?i.moves.ultimate:i.moves.specials[t];(i.actionable||i.state==="attack")&&i.startMove(n,.5,e.match)},place(s,t,e=0,i=0){const n=hi.screen,[r,a]=n.match.fighters;r.x=s,r.z=e,a.x=t,a.z=i;for(const o of[r,a])o.vx=o.vz=o.slideX=o.slideZ=0,o.faceOpponent()},normal(s,t){const e=hi.screen,i=e.match.fighters[s],n=i.moves.normals[t];n&&(i.actionable||i.state==="attack")&&i.startMove(n,.5,e.match)},manual(){const s=hi.screen;s.tick=()=>{},s.frame=()=>{}},step(s=1,t=Xe,e=Xe){const n=hi.screen.match;for(let r=0;r<s;r++){n.tick([t,e]);for(const a of n.drainEvents())hi.renderer.handleEvent(a,n);hi.renderer.syncFight(n,1/60)}},info(){const s=hi.screen.match;return{phase:s.phase,camN:s.camN,fighters:s.fighters.map(t=>({x:+t.x.toFixed(2),y:+t.y.toFixed(2),z:+t.z.toFixed(2),yaw:+t.yaw.toFixed(2),state:t.state,hp:t.health,facing:t.facing}))}}});
