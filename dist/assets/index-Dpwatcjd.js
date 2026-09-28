(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const r of i)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function t(i){const r={};return i.integrity&&(r.integrity=i.integrity),i.referrerPolicy&&(r.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?r.credentials="include":i.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(i){if(i.ep)return;i.ep=!0;const r=t(i);fetch(i.href,r)}})();const Zu={minor:[0,2,3,5,7,8,10],phrygian:[0,1,3,5,7,8,10],dorian:[0,2,3,5,7,9,10],major:[0,2,4,5,7,9,11]},ju={minor:[0,5,2,6],phrygian:[0,1,0,6],dorian:[0,3,0,4],major:[0,4,5,3]},Wn=s=>440*Math.pow(2,(s-69)/12);class Qu{ctx=null;master;sfxBus;musicBus;comp;noiseBuf;seqTimer=null;nextNoteTime=0;step=0;music=null;musicSeed=1;volumes={master:.8,music:.5,sfx:.8};announcer=!0;voice=null;unlock(){if(!this.ctx){try{const i=window.AudioContext??window.webkitAudioContext;this.ctx=new i}catch{return}const e=this.ctx;this.comp=e.createDynamicsCompressor(),this.comp.threshold.value=-14,this.comp.ratio.value=4,this.master=e.createGain(),this.sfxBus=e.createGain(),this.musicBus=e.createGain(),this.sfxBus.connect(this.master),this.musicBus.connect(this.master),this.master.connect(this.comp),this.comp.connect(e.destination),this.applyVolumes();const t=e.sampleRate;this.noiseBuf=e.createBuffer(1,t,e.sampleRate);const n=this.noiseBuf.getChannelData(0);for(let i=0;i<t;i++)n[i]=Math.random()*2-1;this.pickVoice(),this.music&&this.startSequencer()}this.ctx.state==="suspended"&&this.ctx.resume().catch(()=>{})}get running(){return!!this.ctx&&this.ctx.state==="running"}applyVolumes(){this.ctx&&(this.master.gain.value=this.volumes.master,this.sfxBus.gain.value=this.volumes.sfx,this.musicBus.gain.value=this.volumes.music*.55)}pickVoice(){if(!("speechSynthesis"in window))return;const e=()=>{const t=speechSynthesis.getVoices();this.voice=t.find(n=>/en[-_](US|GB)/i.test(n.lang)&&/male|david|daniel|george|guy|fred/i.test(n.name))??t.find(n=>/^en/i.test(n.lang))??null};e(),speechSynthesis.onvoiceschanged=e}say(e){if(!(!this.announcer||!("speechSynthesis"in window)||this.volumes.master*this.volumes.sfx<=.01))try{speechSynthesis.cancel();const t=new SpeechSynthesisUtterance(e);this.voice&&(t.voice=this.voice),t.rate=.95,t.pitch=.55,t.volume=Math.min(1,this.volumes.master*this.volumes.sfx*1.2),speechSynthesis.speak(t)}catch{}}env(e,t,n,i,r){e.gain.setValueAtTime(1e-4,t),e.gain.exponentialRampToValueAtTime(Math.max(2e-4,i),t+n),e.gain.exponentialRampToValueAtTime(1e-4,t+n+r)}tone(e,t,n,i,r,a,o=0,c=.005){const l=this.ctx,h=l.currentTime+o,d=l.createOscillator(),u=l.createGain();d.type=e,d.frequency.setValueAtTime(t,h),n!==t&&d.frequency.exponentialRampToValueAtTime(Math.max(20,n),h+i),this.env(u,h,c,r,i),d.connect(u).connect(a),d.start(h),d.stop(h+c+i+.05)}noise(e,t,n,i,r,a,o,c=0){const l=this.ctx,h=l.currentTime+c,d=l.createBufferSource();d.buffer=this.noiseBuf,d.loop=!0;const u=l.createBiquadFilter();u.type=n,u.frequency.setValueAtTime(i,h),u.frequency.exponentialRampToValueAtTime(Math.max(30,r),h+e),u.Q.value=a;const f=l.createGain();this.env(f,h,.003,t,e),d.connect(u).connect(f).connect(o),d.start(h,Math.random()*.5),d.stop(h+e+.05)}sfx(e,t=1){if(!this.running)return;const n=this.sfxBus;switch(e){case"whoosh":this.noise(.12,.25,"bandpass",900*t,3e3*t,1.5,n);break;case"whooshHeavy":this.noise(.2,.35,"bandpass",500,1800,1.2,n);break;case"hitLight":this.noise(.07,.6,"lowpass",4e3,800,.8,n),this.tone("sine",220*t,90,.08,.5,n);break;case"hitHeavy":this.noise(.16,.8,"lowpass",3e3,300,.8,n),this.tone("sine",140*t,50,.2,.9,n),this.tone("square",90,40,.1,.15,n);break;case"hitSuper":this.noise(.3,.9,"lowpass",5e3,200,.6,n),this.tone("sine",120,35,.35,1,n),this.tone("sawtooth",300,60,.25,.2,n);break;case"block":this.tone("square",1400,900,.04,.18,n),this.noise(.06,.3,"highpass",2500,1500,1,n);break;case"jump":this.tone("sine",300,520,.08,.12,n);break;case"land":this.tone("sine",110,60,.08,.3,n);break;case"landHard":this.noise(.2,.5,"lowpass",900,120,.7,n),this.tone("sine",80,35,.25,.8,n);break;case"special":this.tone("sawtooth",220*t,660*t,.18,.12,n),this.noise(.2,.2,"bandpass",800,3e3,2,n);break;case"projectile":this.tone("square",660*t,220*t,.18,.1,n);break;case"superFlash":this.noise(.6,.4,"bandpass",400,4e3,1.5,n),[0,4,7,12].forEach((i,r)=>this.tone("sawtooth",Wn(57+i),Wn(57+i+12),.5,.08,n,r*.04));break;case"ko":this.noise(1.2,.8,"lowpass",2e3,60,.5,n),this.tone("sine",90,25,1.2,1,n);break;case"grab":this.noise(.1,.4,"bandpass",600,300,1,n),this.tone("sine",160,90,.1,.4,n);break;case"tech":this.tone("triangle",1600,1200,.15,.3,n),this.tone("triangle",2100,1700,.15,.2,n,.02);break;case"shield":this.tone("sine",1800,1200,.25,.25,n);break;case"reflect":this.tone("triangle",900,1800,.15,.3,n);break;case"armor":this.tone("square",300,200,.1,.2,n),this.tone("triangle",2400,2e3,.2,.15,n);break;case"teleport":this.tone("sine",400,1600,.12,.2,n),this.tone("sine",1600,400,.12,.2,n,.12);break;case"buff":[0,4,7].forEach((i,r)=>this.tone("triangle",Wn(72+i),Wn(72+i),.12,.12,n,r*.05));break;case"lifeline":this.tone("sine",70,50,.12,.8,n),this.tone("sine",70,50,.12,.8,n,.2),[0,7,12].forEach((i,r)=>this.tone("triangle",Wn(76+i),Wn(76+i),.3,.15,n,.4+r*.08));break;case"clash":this.tone("square",900,500,.12,.2,n),this.noise(.15,.4,"bandpass",2e3,800,2,n);break;case"counter":this.tone("sawtooth",500,1500,.1,.2,n);break;case"menuMove":this.tone("square",880,880,.035,.07,n);break;case"menuConfirm":this.tone("square",880,880,.05,.08,n),this.tone("square",1320,1320,.08,.08,n,.05);break;case"menuBack":this.tone("square",660,440,.08,.07,n);break;case"select":this.tone("sawtooth",440,880,.12,.12,n),this.noise(.2,.2,"highpass",3e3,6e3,1,n);break;case"round":this.tone("triangle",523,523,.25,.2,n);break;case"crowd":this.noise(1.2,.18,"bandpass",900,700,.6,n);break}}playMusic(e,t=1){this.music=e,this.musicSeed=t,this.stopSequencer(),e&&this.ctx&&this.startSequencer()}stopSequencer(){this.seqTimer!==null&&(clearInterval(this.seqTimer),this.seqTimer=null)}startSequencer(){!this.ctx||!this.music||(this.stopSequencer(),this.step=0,this.nextNoteTime=this.ctx.currentTime+.1,this.seqTimer=window.setInterval(()=>this.schedule(),25))}rnd(e){const t=Math.sin(e*12.9898+this.musicSeed*78.233)*43758.5453;return t-Math.floor(t)}schedule(){const e=this.ctx,t=this.music;if(!e||!t)return;const n=60/t.bpm/4;for(;this.nextNoteTime<e.currentTime+.12;)this.playStep(this.step,this.nextNoteTime-e.currentTime,t),this.nextNoteTime+=n,this.step++}playStep(e,t,n){const i=e%16,r=Math.floor(e/16)%4,a=Zu[n.mode],o=ju[n.mode][r],c=n.root+a[o%7]+(o>=7?12:0),l=(u,f=0)=>{const g=o+u;return n.root+a[(g%7+7)%7]+12*Math.floor(g/7)+f*12},h=Math.max(0,t);if(i%4===0&&this.kick(h),(i===4||i===12)&&this.snare(h),n.intensity>.85&&i===14&&this.snare(h,.5),this.hat(h,i%2===0?.08:.04),i%2===0){const u=i%8===6?12:0;this.voiceNote("sawtooth",Wn(c-12+u),60/n.bpm/2*.9,.12,h,700)}const d=Math.floor(e/64);if(this.rnd(i+d*16+r*3)<.45+n.intensity*.25){const u=[0,2,4,7,4,2,5,3][Math.floor(this.rnd(i*7+d)*8)];this.voiceNote("square",Wn(l(u,1)+12),60/n.bpm/4*.8,.045,h,3200)}if(i===0)for(const u of[0,2,4])this.voiceNote("triangle",Wn(l(u)),60/n.bpm*3.6,.035,h,1800,.08)}voiceNote(e,t,n,i,r,a,o=.005){const c=this.ctx,l=c.currentTime+r,h=c.createOscillator();h.type=e,h.frequency.value=t;const d=c.createBiquadFilter();d.type="lowpass",d.frequency.value=a;const u=c.createGain();this.env(u,l,o,i,n),h.connect(d).connect(u).connect(this.musicBus),h.start(l),h.stop(l+o+n+.05)}kick(e){const t=this.ctx,n=t.currentTime+e,i=t.createOscillator(),r=t.createGain();i.frequency.setValueAtTime(140,n),i.frequency.exponentialRampToValueAtTime(40,n+.12),this.env(r,n,.002,.5,.16),i.connect(r).connect(this.musicBus),i.start(n),i.stop(n+.2)}snare(e,t=.8){this.noise(.12,.28*t,"bandpass",1800,1200,.9,this.musicBus,e),this.tone("triangle",220,160,.06,.12*t,this.musicBus,e)}hat(e,t){this.noise(.03,t,"highpass",7e3,9e3,1,this.musicBus,e)}}const de={LP:1,HP:2,LK:4,HK:8,SP:16,UL:32,SS:64,TH:128,START:256,SELECT:512},ho=de.LP|de.HP,Lh=de.LK|de.HK,ms=ho|Lh,hn=Object.freeze({dir:5,held:0,pressed:0}),uo=["LP","HP","LK","HK","SP","UL","TH","SS","START","SELECT"],pa={LP:"Light Punch",HP:"Heavy Punch",LK:"Light Kick",HK:"Heavy Kick",SP:"Special",UL:"Ultimate",SS:"Sidestep",TH:"Throw",START:"Pause",SELECT:"Reset (training)"},ma={LP:2,HP:3,LK:0,HK:1,SP:5,UL:7,SS:4,TH:6,START:9,SELECT:8},ed={LP:0,HP:3,LK:1,HK:2,SP:5,UL:7,SS:4,TH:6,START:9,SELECT:8},Ls={UP:["KeyW"],DOWN:["KeyS"],LEFT:["KeyA"],RIGHT:["KeyD"],LP:["KeyU"],HP:["KeyI"],LK:["KeyJ"],HK:["KeyK"],SP:["KeyO"],UL:["KeyL"],TH:["KeyH"],SS:["Space"],START:["Escape","Enter"],SELECT:["Backspace"]},Is={UP:["ArrowUp"],DOWN:["ArrowDown"],LEFT:["ArrowLeft"],RIGHT:["ArrowRight"],LP:["Numpad4","Insert"],HP:["Numpad5","Home"],LK:["Numpad1","Delete"],HK:["Numpad2","End"],SP:["Numpad6","PageUp"],UL:["Numpad3","PageDown"],TH:["Numpad0"],SS:["NumpadDecimal","ShiftRight"],START:["NumpadEnter"],SELECT:["NumpadSubtract"]},td={up:!1,down:!1,left:!1,right:!1,confirm:!1,back:!1,extra:!1,extra2:!1,start:!1,l1:!1,r1:!1,any:!1},ir={LP:de.LP,HP:de.HP,LK:de.LK,HK:de.HK,SP:de.SP,UL:de.UL,SS:de.SS,TH:de.TH,START:de.START,SELECT:de.SELECT};function jl(s,e){return e<0?s<0?7:s>0?9:8:e>0?s<0?1:s>0?3:2:s<0?4:s>0?6:5}function nd(s){const e=s.toLowerCase();return e.includes("dualsense")||e.includes("0ce6")||e.includes("0df2")?"dualsense":e.includes("054c")||e.includes("dualshock")||e.includes("wireless controller")||e.includes("playstation")?"dualshock":e.includes("xbox")||e.includes("xinput")||e.includes("045e")?"xbox":"generic"}function id(s,e){try{const t=localStorage.getItem(s);return t?JSON.parse(t):e}catch{return e}}function Ql(s,e){try{localStorage.setItem(s,JSON.stringify(e))}catch{}}class sd{keys=new Set;tapped=new Set;prevKeys=new Set;pads=new Map;slotPad=[null,null];kb=[{dir:5,prevDir:5,repeat:0,menuDir:5},{dir:5,prevDir:5,repeat:0,menuDir:5}];bindings=id("skf.bindings",{});rumbleEnabled=!0;lastDevice=["kb","kb"];onChange=null;captureCb=null;constructor(){window.addEventListener("keydown",e=>{(e.code==="Tab"||e.code==="Space"||e.code.startsWith("Arrow")||e.code==="Backspace")&&e.preventDefault(),this.keys.add(e.code),this.tapped.add(e.code)}),window.addEventListener("keyup",e=>this.keys.delete(e.code)),window.addEventListener("blur",()=>{this.keys.clear(),this.tapped.clear()}),window.addEventListener("gamepadconnected",e=>{this.refreshPads(),this.autoAssign(e.gamepad.index),this.onChange?.()}),window.addEventListener("gamepaddisconnected",e=>{const t=e.gamepad.index;this.pads.delete(t),this.slotPad=this.slotPad.map(n=>n===t?null:n),this.onChange?.()})}refreshPads(){const e=navigator.getGamepads?navigator.getGamepads():[];for(const t of e)!t||!t.connected||this.pads.has(t.index)||(this.pads.set(t.index,{index:t.index,id:t.id,kind:nd(t.id),standard:t.mapping==="standard",buttons:[],prevButtons:[],dir:5,prevDir:5,repeat:0,menuDir:5}),this.autoAssign(t.index),this.onChange?.())}autoAssign(e){this.slotPad.includes(e)||(this.slotPad[0]===null?(this.slotPad[0]=e,this.lastDevice[0]="pad"):this.slotPad[1]===null&&(this.slotPad[1]=e,this.lastDevice[1]="pad"))}swapSlots(){this.slotPad=[this.slotPad[1],this.slotPad[0]],this.onChange?.()}assignPad(e,t){const n=e===0?1:0;t!==null&&this.slotPad[n]===t&&(this.slotPad[n]=this.slotPad[e]),this.slotPad[e]=t,this.onChange?.()}connectedPads(){return[...this.pads.values()].map(e=>({index:e.index,id:e.id,kind:e.kind,standard:e.standard}))}padInfo(e){const t=this.slotPad[e];if(t===null)return null;const n=this.pads.get(t);return n?{index:n.index,id:n.id,kind:n.kind}:null}bindingFor(e){const t=this.pads.get(e);if(!t)return ma;const n=this.bindings[t.id];return n||(t.standard?ma:t.kind==="dualsense"||t.kind==="dualshock"?ed:ma)}setBinding(e,t){const n=this.pads.get(e);n&&(this.bindings[n.id]=t,Ql("skf.bindings",this.bindings))}resetBinding(e){const t=this.pads.get(e);t&&(delete this.bindings[t.id],Ql("skf.bindings",this.bindings))}captureNextButton(e){this.captureCb=e}readPadDir(e,t){let n=0,i=0;const r=e.axes[0]??0,a=e.axes[1]??0;if(r<-.45?n=-1:r>.45&&(n=1),a<-.5?i=-1:a>.5&&(i=1),t){const o=e.buttons;o[12]?.pressed&&(i=-1),o[13]?.pressed&&(i=1),o[14]?.pressed&&(n=-1),o[15]?.pressed&&(n=1)}else if(e.axes.length>9){const o=e.axes[9];if(o>=-1.05&&o<=1.05){const c=Math.round((o+1)*3.5)%8,l=[0,1,1,1,0,-1,-1,-1][c],h=[-1,-1,0,1,1,1,0,-1][c];l&&(n=l),h&&(i=h)}}return jl(n,i)}poll(){this.prevKeys=new Set(this.keysSnapshot),this.keysSnapshot=new Set(this.keys);for(const t of this.tapped)this.keysSnapshot.add(t),this.prevKeys.has(t)&&!this.keys.has(t)&&this.prevKeys.delete(t);this.tapped.clear();for(let t=0;t<2;t++){const n=t===0?Ls:Is,i=this.kb[t];i.prevDir=i.dir;const r=(this.anyKey(n.RIGHT)?1:0)-(this.anyKey(n.LEFT)?1:0),a=(this.anyKey(n.DOWN)?1:0)-(this.anyKey(n.UP)?1:0);if(i.dir=jl(r,a),i.menuDir=this.dirRepeat(i),this.keysSnapshot.size>this.prevKeys.size)for(const o of this.keysSnapshot)!this.prevKeys.has(o)&&Object.values(n).some(c=>c.includes(o))&&(this.lastDevice[t]="kb")}this.refreshPads();const e=navigator.getGamepads?navigator.getGamepads():[];for(const t of e){if(!t)continue;const n=this.pads.get(t.index);if(!n)continue;n.prevButtons=n.buttons,n.buttons=t.buttons.map(r=>r.pressed||r.value>.5),n.prevDir=n.dir,n.dir=this.readPadDir(t,n.standard),n.menuDir=this.dirRepeat(n);const i=this.slotPad.indexOf(t.index);if(i>=0&&(n.buttons.some((r,a)=>r&&!n.prevButtons[a])||n.dir!==5&&n.prevDir===5)&&(this.lastDevice[i]="pad"),this.captureCb){for(let r=0;r<n.buttons.length;r++)if(n.buttons[r]&&!n.prevButtons[r]){const a=this.captureCb;this.captureCb=null,a(t.index,r);break}}}}keysSnapshot=new Set;anyKey(e){return e.some(t=>this.keysSnapshot.has(t))}anyKeyPressed(e){return e.some(t=>this.keysSnapshot.has(t)&&!this.prevKeys.has(t))}keyPressed(e){return this.keysSnapshot.has(e)&&!this.prevKeys.has(e)}player(e){const t=e===0?Ls:Is;let n=0,i=0;for(const o of uo)this.anyKey(t[o])&&(n|=ir[o]),this.anyKeyPressed(t[o])&&(i|=ir[o]);let r=this.kb[e].dir;const a=this.slotPad[e];if(a!==null){const o=this.pads.get(a);if(o){const c=this.bindingFor(a);for(const l of uo){const h=c[l];o.buttons[h]&&(n|=ir[l]),o.buttons[h]&&!o.prevButtons[h]&&(i|=ir[l])}o.dir!==5&&(r=o.dir)}}return{dir:r,held:n,pressed:i}}dirRepeat(e){return e.dir===5?(e.repeat=0,5):e.dir!==e.prevDir?(e.repeat=0,e.dir):(e.repeat++,e.repeat>22&&e.repeat%5===0?e.dir:5)}menu(e){const t={...td},n=e==="any"?[0,1]:[e],i=a=>{a!==5&&((a===8||a===7||a===9)&&(t.up=!0),(a===2||a===1||a===3)&&(t.down=!0),(a===4||a===7||a===1)&&(t.left=!0),(a===6||a===9||a===3)&&(t.right=!0))};for(const a of n){const o=a===0?Ls:Is;i(this.kb[a].menuDir);const c=l=>this.anyKeyPressed(l);(c(o.LK)||c(o.LP)||a===0&&(this.keyPressed("Enter")||this.keyPressed("Space")))&&(t.confirm=!0),a===1&&(this.keyPressed("NumpadEnter")||this.keyPressed("Numpad1"))&&(t.confirm=!0),(c(o.HK)||a===0&&(this.keyPressed("Escape")||this.keyPressed("Backspace")))&&(t.back=!0),c(o.HP)&&(t.extra=!0),c(o.SP)&&(t.extra2=!0),c(o.START)&&(t.start=!0),c(o.TH)&&(t.l1=!0),c(o.UL)&&(t.r1=!0)}e==="any"&&this.keyPressed("Enter")&&(t.confirm=!0);const r=e==="any"?[...this.pads.keys()]:this.slotPad[e]!==null?[this.slotPad[e]]:[];for(const a of r){const o=this.pads.get(a);if(!o)continue;i(o.menuDir);const c=l=>!!o.buttons[l]&&!o.prevButtons[l];if(o.standard)c(0)&&(t.confirm=!0),c(1)&&(t.back=!0),c(3)&&(t.extra=!0),c(2)&&(t.extra2=!0),c(9)&&(t.start=!0),c(4)&&(t.l1=!0),c(5)&&(t.r1=!0);else{const l=o.kind==="dualsense"||o.kind==="dualshock";c(l?1:0)&&(t.confirm=!0),c(l?2:1)&&(t.back=!0),c(3)&&(t.extra=!0),c(l?0:2)&&(t.extra2=!0),c(9)&&(t.start=!0),c(4)&&(t.l1=!0),c(5)&&(t.r1=!0)}}return t.any=t.confirm||t.start||t.back||t.up||t.down||t.left||t.right||t.extra||t.extra2,t}anyPressed(){for(const e of this.keysSnapshot)if(!this.prevKeys.has(e))return!0;for(const e of this.pads.values())if(e.buttons.some((t,n)=>t&&!e.prevButtons[n]))return!0;return!1}rumble(e,t,n,i){if(!this.rumbleEnabled)return;const r=this.slotPad[e];if(r===null)return;const o=navigator.getGamepads?.()[r]?.vibrationActuator;if(o)try{o.playEffect("dual-rumble",{startDelay:0,duration:i,strongMagnitude:Math.min(1,t),weakMagnitude:Math.min(1,n)}).catch(()=>{})}catch{}}}const rd={LP:"□",HP:"△",LK:"✕",HK:"○",SP:"R1",UL:"R2",SS:"L1",TH:"L2",START:"OPTIONS",SELECT:"CREATE"},ad={LP:"X",HP:"Y",LK:"A",HK:"B",SP:"RB",UL:"RT",SS:"LB",TH:"LT",START:"MENU",SELECT:"VIEW"};function ns(s){return s.replace("Key","").replace("Numpad","Num ").replace("Arrow","").replace("Space","Space")}function od(s,e,t=0){return e==="ps"?rd[s]:e==="xbox"?ad[s]:ns((t===0?Ls:Is)[s][0])}function ld(s,e){if(e!=="ps")return"g-key";switch(s){case"LP":return"g-square";case"HP":return"g-triangle";case"LK":return"g-cross";case"HK":return"g-circle";default:return"g-shoulder"}}const ec={difficulty:1,roundsToWin:2,roundTime:99,masterVolume:.8,musicVolume:.5,sfxVolume:.8,announcer:!0,rumble:!0,showHitboxes:!1,inputDisplay:!1,quality:"high"},Ih="skf.settings";function cd(){try{const s=localStorage.getItem(Ih);if(s)return{...ec,...JSON.parse(s)}}catch{}return{...ec}}function hd(s){try{localStorage.setItem(Ih,JSON.stringify(s))}catch{}}const ga=60,ud=.017,va=10.5,tc=7.6,dd=.62,fd=1e3,Bs=100,Dh=100,xa=42,pd=22,sr=8,nc=6,md=18;function ic(s){return s<=1?1:Math.max(.3,1-(s-1)*.12)}const cl="186",gd=0,sc=1,vd=2,Ds=1,xd=2,As=3,Ri=0,en=1,an=2,ni=0,ks=1,Kr=2,rc=3,ac=4,_d=5,is=100,yd=101,Sd=102,Md=103,bd=104,wd=200,Ed=201,Td=202,Ad=203,kh=204,Uh=205,Cd=206,Pd=207,Rd=208,Ld=209,Id=210,Dd=211,kd=212,Ud=213,Nd=214,fo=0,po=1,mo=2,Hs=3,go=4,vo=5,xo=6,_o=7,Nh=0,Fd=1,Od=2,Bn=0,Fh=1,Oh=2,Bh=3,sa=4,Hh=5,zh=6,Gh=7,Vh=300,Li=301,os=302,_a=303,ya=304,ra=306,$r=1e3,ei=1001,yo=1002,Wt=1003,Bd=1004,rr=1005,Qt=1006,Sa=1007,Ai=1008,pn=1009,Wh=1010,Xh=1011,zs=1012,hl=1013,zn=1014,Cn=1015,Gn=1016,ul=1017,dl=1018,Gs=1020,qh=35902,Kh=35899,$h=1021,Yh=1022,Sn=1023,si=1026,Ci=1027,fl=1028,pl=1029,Ii=1030,ml=1031,gl=1033,Hr=33776,zr=33777,Gr=33778,Vr=33779,So=35840,Mo=35841,bo=35842,wo=35843,Eo=36196,To=37492,Ao=37496,Co=37488,Po=37489,Yr=37490,Ro=37491,Lo=37808,Io=37809,Do=37810,ko=37811,Uo=37812,No=37813,Fo=37814,Oo=37815,Bo=37816,Ho=37817,zo=37818,Go=37819,Vo=37820,Wo=37821,Xo=36492,qo=36494,Ko=36495,$o=36283,Yo=36284,Jr=36285,Jo=36286,Hd=3200,Zr=0,zd=1,gi="",jt="srgb",jr="srgb-linear",Qr="linear",Mt="srgb",Ma=7680,Gd=519,Vd=512,Wd=513,Xd=514,vl=515,qd=516,Kd=517,xl=518,$d=519,Yd=35044,Jd=35048,oc="300 es",On=2e3,Vs=2001;function Zd(s){for(let e=s.length-1;e>=0;--e)if(s[e]>=65535)return!0;return!1}function ea(s){return document.createElementNS("http://www.w3.org/1999/xhtml",s)}function jd(){const s=ea("canvas");return s.style.display="block",s}const lc={};function cc(...s){const e="THREE."+s.shift();console.log(e,...s)}function Jh(s){const e=s[0];if(typeof e=="string"&&e.startsWith("TSL:")){const t=s[1];t&&t.isStackTrace?s[0]+=" "+t.getLocation():s[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return s}function Je(...s){s=Jh(s);const e="THREE."+s.shift();{const t=s[0];t&&t.isStackTrace?console.warn(t.getError(e)):console.warn(e,...s)}}function vt(...s){s=Jh(s);const e="THREE."+s.shift();{const t=s[0];t&&t.isStackTrace?console.error(t.getError(e)):console.error(e,...s)}}function rs(...s){const e=s.join(" ");e in lc||(lc[e]=!0,Je(...s))}function Qd(s,e,t){return new Promise(function(n,i){function r(){switch(s.clientWaitSync(e,s.SYNC_FLUSH_COMMANDS_BIT,0)){case s.WAIT_FAILED:i();break;case s.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}const ef={[fo]:po,[mo]:xo,[go]:_o,[Hs]:vo,[po]:fo,[xo]:mo,[_o]:go,[vo]:Hs};class Ni{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){const n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){const n=this._listeners;if(n===void 0)return;const i=n[e];if(i!==void 0){const r=i.indexOf(t);r!==-1&&i.splice(r,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const n=t[e.type];if(n!==void 0){e.target=this;const i=n.slice(0);for(let r=0,a=i.length;r<a;r++)i[r].call(this,e);e.target=null}}}const Yt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],ba=Math.PI/180,Zo=180/Math.PI;function hs(){const s=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Yt[s&255]+Yt[s>>8&255]+Yt[s>>16&255]+Yt[s>>24&255]+"-"+Yt[e&255]+Yt[e>>8&255]+"-"+Yt[e>>16&15|64]+Yt[e>>24&255]+"-"+Yt[t&63|128]+Yt[t>>8&255]+"-"+Yt[t>>16&255]+Yt[t>>24&255]+Yt[n&255]+Yt[n>>8&255]+Yt[n>>16&255]+Yt[n>>24&255]).toLowerCase()}function ct(s,e,t){return Math.max(e,Math.min(t,s))}function tf(s,e){return(s%e+e)%e}function wa(s,e,t){return(1-t)*s+t*e}function gs(s,e){switch(e.constructor){case Float32Array:return s;case Uint32Array:return s/4294967295;case Uint16Array:return s/65535;case Uint8Array:case Uint8ClampedArray:return s/255;case Int32Array:return Math.max(s/2147483647,-1);case Int16Array:return Math.max(s/32767,-1);case Int8Array:return Math.max(s/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function ln(s,e){switch(e.constructor){case Float32Array:return s;case Uint32Array:return Math.round(s*4294967295);case Uint16Array:return Math.round(s*65535);case Uint8Array:case Uint8ClampedArray:return Math.round(s*255);case Int32Array:return Math.round(s*2147483647);case Int16Array:return Math.round(s*32767);case Int8Array:return Math.round(s*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}const Fl=class Fl{constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("THREE.Vector2: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,n=this.y,i=e.elements;return this.x=i[0]*t+i[3]*n+i[6],this.y=i[1]*t+i[4]*n+i[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=ct(this.x,e.x,t.x),this.y=ct(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=ct(this.x,e,t),this.y=ct(this.y,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(ct(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(ct(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const n=Math.cos(t),i=Math.sin(t),r=this.x-e.x,a=this.y-e.y;return this.x=r*n-a*i+e.x,this.y=r*i+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};Fl.prototype.isVector2=!0;let ce=Fl;class us{constructor(e=0,t=0,n=0,i=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=i}static slerpFlat(e,t,n,i,r,a,o){let c=n[i+0],l=n[i+1],h=n[i+2],d=n[i+3],u=r[a+0],f=r[a+1],g=r[a+2],S=r[a+3];if(d!==S||c!==u||l!==f||h!==g){let p=c*u+l*f+h*g+d*S;p<0&&(u=-u,f=-f,g=-g,S=-S,p=-p);let m=1-o;if(p<.9995){const M=Math.acos(p),T=Math.sin(M);m=Math.sin(m*M)/T,o=Math.sin(o*M)/T,c=c*m+u*o,l=l*m+f*o,h=h*m+g*o,d=d*m+S*o}else{c=c*m+u*o,l=l*m+f*o,h=h*m+g*o,d=d*m+S*o;const M=1/Math.sqrt(c*c+l*l+h*h+d*d);c*=M,l*=M,h*=M,d*=M}}e[t]=c,e[t+1]=l,e[t+2]=h,e[t+3]=d}static multiplyQuaternionsFlat(e,t,n,i,r,a){const o=n[i],c=n[i+1],l=n[i+2],h=n[i+3],d=r[a],u=r[a+1],f=r[a+2],g=r[a+3];return e[t]=o*g+h*d+c*f-l*u,e[t+1]=c*g+h*u+l*d-o*f,e[t+2]=l*g+h*f+o*u-c*d,e[t+3]=h*g-o*d-c*u-l*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,i){return this._x=e,this._y=t,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const n=e._x,i=e._y,r=e._z,a=e._order,o=Math.cos,c=Math.sin,l=o(n/2),h=o(i/2),d=o(r/2),u=c(n/2),f=c(i/2),g=c(r/2);switch(a){case"XYZ":this._x=u*h*d+l*f*g,this._y=l*f*d-u*h*g,this._z=l*h*g+u*f*d,this._w=l*h*d-u*f*g;break;case"YXZ":this._x=u*h*d+l*f*g,this._y=l*f*d-u*h*g,this._z=l*h*g-u*f*d,this._w=l*h*d+u*f*g;break;case"ZXY":this._x=u*h*d-l*f*g,this._y=l*f*d+u*h*g,this._z=l*h*g+u*f*d,this._w=l*h*d-u*f*g;break;case"ZYX":this._x=u*h*d-l*f*g,this._y=l*f*d+u*h*g,this._z=l*h*g-u*f*d,this._w=l*h*d+u*f*g;break;case"YZX":this._x=u*h*d+l*f*g,this._y=l*f*d+u*h*g,this._z=l*h*g-u*f*d,this._w=l*h*d-u*f*g;break;case"XZY":this._x=u*h*d-l*f*g,this._y=l*f*d-u*h*g,this._z=l*h*g+u*f*d,this._w=l*h*d+u*f*g;break;default:Je("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const n=t/2,i=Math.sin(n);return this._x=e.x*i,this._y=e.y*i,this._z=e.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,n=t[0],i=t[4],r=t[8],a=t[1],o=t[5],c=t[9],l=t[2],h=t[6],d=t[10],u=n+o+d;if(u>0){const f=.5/Math.sqrt(u+1);this._w=.25/f,this._x=(h-c)*f,this._y=(r-l)*f,this._z=(a-i)*f}else if(n>o&&n>d){const f=2*Math.sqrt(1+n-o-d);this._w=(h-c)/f,this._x=.25*f,this._y=(i+a)/f,this._z=(r+l)/f}else if(o>d){const f=2*Math.sqrt(1+o-n-d);this._w=(r-l)/f,this._x=(i+a)/f,this._y=.25*f,this._z=(c+h)/f}else{const f=2*Math.sqrt(1+d-n-o);this._w=(a-i)/f,this._x=(r+l)/f,this._y=(c+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(ct(this.dot(e),-1,1)))}rotateTowards(e,t){const n=this.angleTo(e);if(n===0)return this;const i=Math.min(1,t/n);return this.slerp(e,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const n=e._x,i=e._y,r=e._z,a=e._w,o=t._x,c=t._y,l=t._z,h=t._w;return this._x=n*h+a*o+i*l-r*c,this._y=i*h+a*c+r*o-n*l,this._z=r*h+a*l+n*c-i*o,this._w=a*h-n*o-i*c-r*l,this._onChangeCallback(),this}slerp(e,t){let n=e._x,i=e._y,r=e._z,a=e._w,o=this.dot(e);o<0&&(n=-n,i=-i,r=-r,a=-a,o=-o);let c=1-t;if(o<.9995){const l=Math.acos(o),h=Math.sin(l);c=Math.sin(c*l)/h,t=Math.sin(t*l)/h,this._x=this._x*c+n*t,this._y=this._y*c+i*t,this._z=this._z*c+r*t,this._w=this._w*c+a*t,this._onChangeCallback()}else this._x=this._x*c+n*t,this._y=this._y*c+i*t,this._z=this._z*c+r*t,this._w=this._w*c+a*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),i=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(i*Math.sin(e),i*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}const Ol=class Ol{constructor(e=0,t=0,n=0){this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("THREE.Vector3: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(hc.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(hc.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,n=this.y,i=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*i,this.y=r[1]*t+r[4]*n+r[7]*i,this.z=r[2]*t+r[5]*n+r[8]*i,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,n=this.y,i=this.z,r=e.elements,a=1/(r[3]*t+r[7]*n+r[11]*i+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*i+r[12])*a,this.y=(r[1]*t+r[5]*n+r[9]*i+r[13])*a,this.z=(r[2]*t+r[6]*n+r[10]*i+r[14])*a,this}applyQuaternion(e){const t=this.x,n=this.y,i=this.z,r=e.x,a=e.y,o=e.z,c=e.w,l=2*(a*i-o*n),h=2*(o*t-r*i),d=2*(r*n-a*t);return this.x=t+c*l+a*d-o*h,this.y=n+c*h+o*l-r*d,this.z=i+c*d+r*h-a*l,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,n=this.y,i=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*i,this.y=r[1]*t+r[5]*n+r[9]*i,this.z=r[2]*t+r[6]*n+r[10]*i,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=ct(this.x,e.x,t.x),this.y=ct(this.y,e.y,t.y),this.z=ct(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=ct(this.x,e,t),this.y=ct(this.y,e,t),this.z=ct(this.z,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(ct(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const n=e.x,i=e.y,r=e.z,a=t.x,o=t.y,c=t.z;return this.x=i*c-r*o,this.y=r*a-n*c,this.z=n*o-i*a,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Ea.copy(this).projectOnVector(e),this.sub(Ea)}reflect(e){return this.sub(Ea.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(ct(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y,i=this.z-e.z;return t*t+n*n+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){const i=Math.sin(t)*e;return this.x=i*Math.sin(n),this.y=Math.cos(t)*e,this.z=i*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),i=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=i,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};Ol.prototype.isVector3=!0;let I=Ol;const Ea=new I,hc=new us,Bl=class Bl{constructor(e,t,n,i,r,a,o,c,l){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,i,r,a,o,c,l)}set(e,t,n,i,r,a,o,c,l){const h=this.elements;return h[0]=e,h[1]=i,h[2]=o,h[3]=t,h[4]=r,h[5]=c,h[6]=n,h[7]=a,h[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,i=t.elements,r=this.elements,a=n[0],o=n[3],c=n[6],l=n[1],h=n[4],d=n[7],u=n[2],f=n[5],g=n[8],S=i[0],p=i[3],m=i[6],M=i[1],T=i[4],_=i[7],b=i[2],E=i[5],P=i[8];return r[0]=a*S+o*M+c*b,r[3]=a*p+o*T+c*E,r[6]=a*m+o*_+c*P,r[1]=l*S+h*M+d*b,r[4]=l*p+h*T+d*E,r[7]=l*m+h*_+d*P,r[2]=u*S+f*M+g*b,r[5]=u*p+f*T+g*E,r[8]=u*m+f*_+g*P,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[1],i=e[2],r=e[3],a=e[4],o=e[5],c=e[6],l=e[7],h=e[8];return t*a*h-t*o*l-n*r*h+n*o*c+i*r*l-i*a*c}invert(){const e=this.elements,t=e[0],n=e[1],i=e[2],r=e[3],a=e[4],o=e[5],c=e[6],l=e[7],h=e[8],d=h*a-o*l,u=o*c-h*r,f=l*r-a*c,g=t*d+n*u+i*f;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const S=1/g;return e[0]=d*S,e[1]=(i*l-h*n)*S,e[2]=(o*n-i*a)*S,e[3]=u*S,e[4]=(h*t-i*c)*S,e[5]=(i*r-o*t)*S,e[6]=f*S,e[7]=(n*c-l*t)*S,e[8]=(a*t-n*r)*S,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,i,r,a,o){const c=Math.cos(r),l=Math.sin(r);return this.set(n*c,n*l,-n*(c*a+l*o)+a+e,-i*l,i*c,-i*(-l*a+c*o)+o+t,0,0,1),this}scale(e,t){return rs("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(Ta.makeScale(e,t)),this}rotate(e){return rs("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(Ta.makeRotation(-e)),this}translate(e,t){return rs("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(Ta.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,n=e.elements;for(let i=0;i<9;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}};Bl.prototype.isMatrix3=!0;let et=Bl;const Ta=new et,uc=new et().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),dc=new et().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function nf(){const s={enabled:!0,workingColorSpace:jr,spaces:{},convert:function(i,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===Mt&&(i.r=ii(i.r),i.g=ii(i.g),i.b=ii(i.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(i.applyMatrix3(this.spaces[r].toXYZ),i.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===Mt&&(i.r=as(i.r),i.g=as(i.g),i.b=as(i.b))),i},workingToColorSpace:function(i,r){return this.convert(i,this.workingColorSpace,r)},colorSpaceToWorking:function(i,r){return this.convert(i,r,this.workingColorSpace)},getPrimaries:function(i){return this.spaces[i].primaries},getTransfer:function(i){return i===gi?Qr:this.spaces[i].transfer},getToneMappingMode:function(i){return this.spaces[i].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(i,r=this.workingColorSpace){return i.fromArray(this.spaces[r].luminanceCoefficients)},define:function(i){Object.assign(this.spaces,i)},_getMatrix:function(i,r,a){return i.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(i){return this.spaces[i].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(i=this.workingColorSpace){return this.spaces[i].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(i,r){return rs("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),s.workingToColorSpace(i,r)},toWorkingColorSpace:function(i,r){return rs("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),s.colorSpaceToWorking(i,r)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return s.define({[jr]:{primaries:e,whitePoint:n,transfer:Qr,toXYZ:uc,fromXYZ:dc,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:jt},outputColorSpaceConfig:{drawingBufferColorSpace:jt}},[jt]:{primaries:e,whitePoint:n,transfer:Mt,toXYZ:uc,fromXYZ:dc,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:jt}}}),s}const ut=nf();function ii(s){return s<.04045?s*.0773993808:Math.pow(s*.9478672986+.0521327014,2.4)}function as(s){return s<.0031308?s*12.92:1.055*Math.pow(s,.41666)-.055}let zi;class sf{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{zi===void 0&&(zi=ea("canvas")),zi.width=e.width,zi.height=e.height;const i=zi.getContext("2d");e instanceof ImageData?i.putImageData(e,0,0):i.drawImage(e,0,0,e.width,e.height),n=zi}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=ea("canvas");t.width=e.width,t.height=e.height;const n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);const i=n.getImageData(0,0,e.width,e.height),r=i.data;for(let a=0;a<r.length;a++)r[a]=ii(r[a]/255)*255;return n.putImageData(i,0,0),t}else if(e.data){const t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(ii(t[n]/255)*255):t[n]=ii(t[n]);return{data:t,width:e.width,height:e.height}}else return Je("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let rf=0;class _l{constructor(e=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:rf++}),this.uuid=hs(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let r;if(Array.isArray(i)){r=[];for(let a=0,o=i.length;a<o;a++)i[a].isDataTexture?r.push(Aa(i[a].image)):r.push(Aa(i[a]))}else r=Aa(i);n.url=r}return t||(e.images[this.uuid]=n),n}}function Aa(s){return typeof HTMLImageElement<"u"&&s instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&s instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&s instanceof ImageBitmap?sf.getDataURL(s):s.data?{data:Array.from(s.data),width:s.width,height:s.height,type:s.data.constructor.name}:(Je("Texture: Unable to serialize Texture."),{})}let af=0;const Ca=new I;class tn extends Ni{constructor(e=tn.DEFAULT_IMAGE,t=tn.DEFAULT_MAPPING,n=ei,i=ei,r=Qt,a=Ai,o=Sn,c=pn,l=tn.DEFAULT_ANISOTROPY,h=gi){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:af++}),this.uuid=hs(),this.name="",this.source=new _l(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=i,this.magFilter=r,this.minFilter=a,this.anisotropy=l,this.format=o,this.internalFormat=null,this.type=c,this.offset=new ce(0,0),this.repeat=new ce(1,1),this.center=new ce(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new et,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(Ca).x}get height(){return this.source.getSize(Ca).y}get depth(){return this.source.getSize(Ca).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const n=e[t];if(n===void 0){Je(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const i=this[t];if(i===void 0){Je(`Texture.setValues(): property '${t}' does not exist.`);continue}i&&n&&i.isVector2&&n.isVector2||i&&n&&i.isVector3&&n.isVector3||i&&n&&i.isMatrix3&&n.isMatrix3?i.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Vh)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case $r:e.x=e.x-Math.floor(e.x);break;case ei:e.x=e.x<0?0:1;break;case yo:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case $r:e.y=e.y-Math.floor(e.y);break;case ei:e.y=e.y<0?0:1;break;case yo:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}tn.DEFAULT_IMAGE=null;tn.DEFAULT_MAPPING=Vh;tn.DEFAULT_ANISOTROPY=1;const Hl=class Hl{constructor(e=0,t=0,n=0,i=1){this.x=e,this.y=t,this.z=n,this.w=i}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,i){return this.x=e,this.y=t,this.z=n,this.w=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("THREE.Vector4: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,n=this.y,i=this.z,r=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*i+a[12]*r,this.y=a[1]*t+a[5]*n+a[9]*i+a[13]*r,this.z=a[2]*t+a[6]*n+a[10]*i+a[14]*r,this.w=a[3]*t+a[7]*n+a[11]*i+a[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,i,r;const c=e.elements,l=c[0],h=c[4],d=c[8],u=c[1],f=c[5],g=c[9],S=c[2],p=c[6],m=c[10];if(Math.abs(h-u)<.01&&Math.abs(d-S)<.01&&Math.abs(g-p)<.01){if(Math.abs(h+u)<.1&&Math.abs(d+S)<.1&&Math.abs(g+p)<.1&&Math.abs(l+f+m-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const T=(l+1)/2,_=(f+1)/2,b=(m+1)/2,E=(h+u)/4,P=(d+S)/4,x=(g+p)/4;return T>_&&T>b?T<.01?(n=0,i=.707106781,r=.707106781):(n=Math.sqrt(T),i=E/n,r=P/n):_>b?_<.01?(n=.707106781,i=0,r=.707106781):(i=Math.sqrt(_),n=E/i,r=x/i):b<.01?(n=.707106781,i=.707106781,r=0):(r=Math.sqrt(b),n=P/r,i=x/r),this.set(n,i,r,t),this}let M=Math.sqrt((p-g)*(p-g)+(d-S)*(d-S)+(u-h)*(u-h));return Math.abs(M)<.001&&(M=1),this.x=(p-g)/M,this.y=(d-S)/M,this.z=(u-h)/M,this.w=Math.acos((l+f+m-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=ct(this.x,e.x,t.x),this.y=ct(this.y,e.y,t.y),this.z=ct(this.z,e.z,t.z),this.w=ct(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=ct(this.x,e,t),this.y=ct(this.y,e,t),this.z=ct(this.z,e,t),this.w=ct(this.w,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(ct(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};Hl.prototype.isVector4=!0;let Rt=Hl;class of extends Ni{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Qt,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new Rt(0,0,e,t),this.scissorTest=!1,this.viewport=new Rt(0,0,e,t),this.textures=[];const i={width:e,height:t,depth:n.depth},r=new tn(i),a=n.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveColorBuffer=n.resolveColorBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.storeMultisampledColorBuffer=n.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=n.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=n.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(e={}){const t={minFilter:Qt,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),e!==null&&e.renderTarget===null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let i=0,r=this.textures.length;i<r;i++)this.textures[i].image.width=e,this.textures[i].image.height=t,this.textures[i].image.depth=n,this.textures[i].isData3DTexture!==!0&&(this.textures[i].isArrayTexture=this.textures[i].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const i=Object.assign({},e.textures[t].image);this.textures[t].source=new _l(i)}if(this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveColorBuffer=e.resolveColorBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,this.storeMultisampledColorBuffer=e.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=e.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=e.storeMultisampledStencilBuffer,e.depthTexture!==null)if(e.depthTexture.renderTarget===e){const t=e.depthTexture.clone();t.renderTarget=null,this.depthTexture=t}else this.depthTexture=e.depthTexture;return this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Pn extends of{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}}class Zh extends tn{constructor(e=null,t=1,n=1,i=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=Wt,this.minFilter=Wt,this.wrapR=ei,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class lf extends tn{constructor(e=null,t=1,n=1,i=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=Wt,this.minFilter=Wt,this.wrapR=ei,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}}const ia=class ia{constructor(e,t,n,i,r,a,o,c,l,h,d,u,f,g,S,p){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,i,r,a,o,c,l,h,d,u,f,g,S,p)}set(e,t,n,i,r,a,o,c,l,h,d,u,f,g,S,p){const m=this.elements;return m[0]=e,m[4]=t,m[8]=n,m[12]=i,m[1]=r,m[5]=a,m[9]=o,m[13]=c,m[2]=l,m[6]=h,m[10]=d,m[14]=u,m[3]=f,m[7]=g,m[11]=S,m[15]=p,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new ia().fromArray(this.elements)}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){const t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),n.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();const t=this.elements,n=e.elements,i=1/Gi.setFromMatrixColumn(e,0).length(),r=1/Gi.setFromMatrixColumn(e,1).length(),a=1/Gi.setFromMatrixColumn(e,2).length();return t[0]=n[0]*i,t[1]=n[1]*i,t[2]=n[2]*i,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,n=e.x,i=e.y,r=e.z,a=Math.cos(n),o=Math.sin(n),c=Math.cos(i),l=Math.sin(i),h=Math.cos(r),d=Math.sin(r);if(e.order==="XYZ"){const u=a*h,f=a*d,g=o*h,S=o*d;t[0]=c*h,t[4]=-c*d,t[8]=l,t[1]=f+g*l,t[5]=u-S*l,t[9]=-o*c,t[2]=S-u*l,t[6]=g+f*l,t[10]=a*c}else if(e.order==="YXZ"){const u=c*h,f=c*d,g=l*h,S=l*d;t[0]=u+S*o,t[4]=g*o-f,t[8]=a*l,t[1]=a*d,t[5]=a*h,t[9]=-o,t[2]=f*o-g,t[6]=S+u*o,t[10]=a*c}else if(e.order==="ZXY"){const u=c*h,f=c*d,g=l*h,S=l*d;t[0]=u-S*o,t[4]=-a*d,t[8]=g+f*o,t[1]=f+g*o,t[5]=a*h,t[9]=S-u*o,t[2]=-a*l,t[6]=o,t[10]=a*c}else if(e.order==="ZYX"){const u=a*h,f=a*d,g=o*h,S=o*d;t[0]=c*h,t[4]=g*l-f,t[8]=u*l+S,t[1]=c*d,t[5]=S*l+u,t[9]=f*l-g,t[2]=-l,t[6]=o*c,t[10]=a*c}else if(e.order==="YZX"){const u=a*c,f=a*l,g=o*c,S=o*l;t[0]=c*h,t[4]=S-u*d,t[8]=g*d+f,t[1]=d,t[5]=a*h,t[9]=-o*h,t[2]=-l*h,t[6]=f*d+g,t[10]=u-S*d}else if(e.order==="XZY"){const u=a*c,f=a*l,g=o*c,S=o*l;t[0]=c*h,t[4]=-d,t[8]=l*h,t[1]=u*d+S,t[5]=a*h,t[9]=f*d-g,t[2]=g*d-f,t[6]=o*h,t[10]=S*d+u}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(cf,e,hf)}lookAt(e,t,n){const i=this.elements;return un.subVectors(e,t),un.lengthSq()===0&&(un.z=1),un.normalize(),ci.crossVectors(n,un),ci.lengthSq()===0&&(Math.abs(n.z)===1?un.x+=1e-4:un.z+=1e-4,un.normalize(),ci.crossVectors(n,un)),ci.normalize(),ar.crossVectors(un,ci),i[0]=ci.x,i[4]=ar.x,i[8]=un.x,i[1]=ci.y,i[5]=ar.y,i[9]=un.y,i[2]=ci.z,i[6]=ar.z,i[10]=un.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,i=t.elements,r=this.elements,a=n[0],o=n[4],c=n[8],l=n[12],h=n[1],d=n[5],u=n[9],f=n[13],g=n[2],S=n[6],p=n[10],m=n[14],M=n[3],T=n[7],_=n[11],b=n[15],E=i[0],P=i[4],x=i[8],w=i[12],C=i[1],L=i[5],N=i[9],B=i[13],U=i[2],O=i[6],$=i[10],V=i[14],ie=i[3],q=i[7],j=i[11],ne=i[15];return r[0]=a*E+o*C+c*U+l*ie,r[4]=a*P+o*L+c*O+l*q,r[8]=a*x+o*N+c*$+l*j,r[12]=a*w+o*B+c*V+l*ne,r[1]=h*E+d*C+u*U+f*ie,r[5]=h*P+d*L+u*O+f*q,r[9]=h*x+d*N+u*$+f*j,r[13]=h*w+d*B+u*V+f*ne,r[2]=g*E+S*C+p*U+m*ie,r[6]=g*P+S*L+p*O+m*q,r[10]=g*x+S*N+p*$+m*j,r[14]=g*w+S*B+p*V+m*ne,r[3]=M*E+T*C+_*U+b*ie,r[7]=M*P+T*L+_*O+b*q,r[11]=M*x+T*N+_*$+b*j,r[15]=M*w+T*B+_*V+b*ne,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[4],i=e[8],r=e[12],a=e[1],o=e[5],c=e[9],l=e[13],h=e[2],d=e[6],u=e[10],f=e[14],g=e[3],S=e[7],p=e[11],m=e[15],M=c*f-l*u,T=o*f-l*d,_=o*u-c*d,b=a*f-l*h,E=a*u-c*h,P=a*d-o*h;return t*(S*M-p*T+m*_)-n*(g*M-p*b+m*E)+i*(g*T-S*b+m*P)-r*(g*_-S*E+p*P)}determinantAffine(){const e=this.elements,t=e[0],n=e[4],i=e[8],r=e[1],a=e[5],o=e[9],c=e[2],l=e[6],h=e[10];return t*(a*h-o*l)-n*(r*h-o*c)+i*(r*l-a*c)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){const i=this.elements;return e.isVector3?(i[12]=e.x,i[13]=e.y,i[14]=e.z):(i[12]=e,i[13]=t,i[14]=n),this}invert(){const e=this.elements,t=e[0],n=e[1],i=e[2],r=e[3],a=e[4],o=e[5],c=e[6],l=e[7],h=e[8],d=e[9],u=e[10],f=e[11],g=e[12],S=e[13],p=e[14],m=e[15],M=t*o-n*a,T=t*c-i*a,_=t*l-r*a,b=n*c-i*o,E=n*l-r*o,P=i*l-r*c,x=h*S-d*g,w=h*p-u*g,C=h*m-f*g,L=d*p-u*S,N=d*m-f*S,B=u*m-f*p,U=M*B-T*N+_*L+b*C-E*w+P*x;if(U===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const O=1/U;return e[0]=(o*B-c*N+l*L)*O,e[1]=(i*N-n*B-r*L)*O,e[2]=(S*P-p*E+m*b)*O,e[3]=(u*E-d*P-f*b)*O,e[4]=(c*C-a*B-l*w)*O,e[5]=(t*B-i*C+r*w)*O,e[6]=(p*_-g*P-m*T)*O,e[7]=(h*P-u*_+f*T)*O,e[8]=(a*N-o*C+l*x)*O,e[9]=(n*C-t*N-r*x)*O,e[10]=(g*E-S*_+m*M)*O,e[11]=(d*_-h*E-f*M)*O,e[12]=(o*w-a*L-c*x)*O,e[13]=(t*L-n*w+i*x)*O,e[14]=(S*T-g*b-p*M)*O,e[15]=(h*b-d*T+u*M)*O,this}scale(e){const t=this.elements,n=e.x,i=e.y,r=e.z;return t[0]*=n,t[4]*=i,t[8]*=r,t[1]*=n,t[5]*=i,t[9]*=r,t[2]*=n,t[6]*=i,t[10]*=r,t[3]*=n,t[7]*=i,t[11]*=r,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],i=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,i))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const n=Math.cos(t),i=Math.sin(t),r=1-n,a=e.x,o=e.y,c=e.z,l=r*a,h=r*o;return this.set(l*a+n,l*o-i*c,l*c+i*o,0,l*o+i*c,h*o+n,h*c-i*a,0,l*c-i*o,h*c+i*a,r*c*c+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,i,r,a){return this.set(1,n,r,0,e,1,a,0,t,i,1,0,0,0,0,1),this}compose(e,t,n){const i=this.elements,r=t._x,a=t._y,o=t._z,c=t._w,l=r+r,h=a+a,d=o+o,u=r*l,f=r*h,g=r*d,S=a*h,p=a*d,m=o*d,M=c*l,T=c*h,_=c*d,b=n.x,E=n.y,P=n.z;return i[0]=(1-(S+m))*b,i[1]=(f+_)*b,i[2]=(g-T)*b,i[3]=0,i[4]=(f-_)*E,i[5]=(1-(u+m))*E,i[6]=(p+M)*E,i[7]=0,i[8]=(g+T)*P,i[9]=(p-M)*P,i[10]=(1-(u+S))*P,i[11]=0,i[12]=e.x,i[13]=e.y,i[14]=e.z,i[15]=1,this}decompose(e,t,n){const i=this.elements;e.x=i[12],e.y=i[13],e.z=i[14];const r=this.determinantAffine();if(r===0)return n.set(1,1,1),t.identity(),this;let a=Gi.set(i[0],i[1],i[2]).length();const o=Gi.set(i[4],i[5],i[6]).length(),c=Gi.set(i[8],i[9],i[10]).length();r<0&&(a=-a),bn.copy(this);const l=1/a,h=1/o,d=1/c;return bn.elements[0]*=l,bn.elements[1]*=l,bn.elements[2]*=l,bn.elements[4]*=h,bn.elements[5]*=h,bn.elements[6]*=h,bn.elements[8]*=d,bn.elements[9]*=d,bn.elements[10]*=d,t.setFromRotationMatrix(bn),n.x=a,n.y=o,n.z=c,this}makePerspective(e,t,n,i,r,a,o=On,c=!1){const l=this.elements,h=2*r/(t-e),d=2*r/(n-i),u=(t+e)/(t-e),f=(n+i)/(n-i);let g,S;if(c)g=r/(a-r),S=a*r/(a-r);else if(o===On)g=-(a+r)/(a-r),S=-2*a*r/(a-r);else if(o===Vs)g=-a/(a-r),S=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=h,l[4]=0,l[8]=u,l[12]=0,l[1]=0,l[5]=d,l[9]=f,l[13]=0,l[2]=0,l[6]=0,l[10]=g,l[14]=S,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,n,i,r,a,o=On,c=!1){const l=this.elements,h=2/(t-e),d=2/(n-i),u=-(t+e)/(t-e),f=-(n+i)/(n-i);let g,S;if(c)g=1/(a-r),S=a/(a-r);else if(o===On)g=-2/(a-r),S=-(a+r)/(a-r);else if(o===Vs)g=-1/(a-r),S=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=h,l[4]=0,l[8]=0,l[12]=u,l[1]=0,l[5]=d,l[9]=0,l[13]=f,l[2]=0,l[6]=0,l[10]=g,l[14]=S,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){const t=this.elements,n=e.elements;for(let i=0;i<16;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}};ia.prototype.isMatrix4=!0;let Et=ia;const Gi=new I,bn=new Et,cf=new I(0,0,0),hf=new I(1,1,1),ci=new I,ar=new I,un=new I,fc=new Et,pc=new us;class vi{constructor(e=0,t=0,n=0,i=vi.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=i}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,i=this._order){return this._x=e,this._y=t,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){const i=e.elements,r=i[0],a=i[4],o=i[8],c=i[1],l=i[5],h=i[9],d=i[2],u=i[6],f=i[10];switch(t){case"XYZ":this._y=Math.asin(ct(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(u,l),this._z=0);break;case"YXZ":this._x=Math.asin(-ct(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-d,r),this._z=0);break;case"ZXY":this._x=Math.asin(ct(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(-d,f),this._z=Math.atan2(-a,l)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-ct(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(u,f),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-a,l));break;case"YZX":this._z=Math.asin(ct(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-h,l),this._y=Math.atan2(-d,r)):(this._x=0,this._y=Math.atan2(o,f));break;case"XZY":this._z=Math.asin(-ct(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(u,l),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-h,f),this._y=0);break;default:Je("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return fc.makeRotationFromQuaternion(e),this.setFromRotationMatrix(fc,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return pc.setFromEuler(this),this.setFromQuaternion(pc,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}vi.DEFAULT_ORDER="XYZ";class jh{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let uf=0;const mc=new I,Vi=new us,Xn=new Et,or=new I,vs=new I,df=new I,ff=new us,gc=new I(1,0,0),vc=new I(0,1,0),xc=new I(0,0,1),_c={type:"added"},pf={type:"removed"},Wi={type:"childadded",child:null},Pa={type:"childremoved",child:null};class Ot extends Ni{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:uf++}),this.uuid=hs(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Ot.DEFAULT_UP.clone();const e=new I,t=new vi,n=new us,i=new I(1,1,1);function r(){n.setFromEuler(t,!1)}function a(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new Et},normalMatrix:{value:new et}}),this.matrix=new Et,this.matrixWorld=new Et,this.matrixAutoUpdate=Ot.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Ot.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new jh,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Vi.setFromAxisAngle(e,t),this.quaternion.multiply(Vi),this}rotateOnWorldAxis(e,t){return Vi.setFromAxisAngle(e,t),this.quaternion.premultiply(Vi),this}rotateX(e){return this.rotateOnAxis(gc,e)}rotateY(e){return this.rotateOnAxis(vc,e)}rotateZ(e){return this.rotateOnAxis(xc,e)}translateOnAxis(e,t){return mc.copy(e).applyQuaternion(this.quaternion),this.position.add(mc.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(gc,e)}translateY(e){return this.translateOnAxis(vc,e)}translateZ(e){return this.translateOnAxis(xc,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Xn.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?or.copy(e):or.set(e,t,n);const i=this.parent;this.updateWorldMatrix(!0,!1),vs.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Xn.lookAt(vs,or,this.up):Xn.lookAt(or,vs,this.up),this.quaternion.setFromRotationMatrix(Xn),i&&(Xn.extractRotation(i.matrixWorld),Vi.setFromRotationMatrix(Xn),this.quaternion.premultiply(Vi.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(vt("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(_c),Wi.child=e,this.dispatchEvent(Wi),Wi.child=null):vt("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(pf),Pa.child=e,this.dispatchEvent(Pa),Pa.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Xn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Xn.multiply(e.parent.matrixWorld)),e.applyMatrix4(Xn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(_c),Wi.child=e,this.dispatchEvent(Wi),Wi.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,i=this.children.length;n<i;n++){const a=this.children[n].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);const i=this.children;for(let r=0,a=i.length;r<a;r++)i[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(vs,e,df),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(vs,ff,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}intersectsFrustum(){}traverse(e){e(this);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);const e=this.pivot;if(e!==null){const t=e.x,n=e.y,i=e.z,r=this.matrix.elements;r[12]+=t-r[0]*t-r[4]*n-r[8]*i,r[13]+=n-r[1]*t-r[5]*n-r[9]*i,r[14]+=i-r[2]*t-r[6]*n-r[10]*i}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t,n=!1){const i=this.parent;if(e===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),t===!0){const r=this.children;for(let a=0,o=r.length;a<o;a++)r[a].updateWorldMatrix(!1,!0,n)}}toJSON(e){const t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const i={};i.uuid=this.uuid,i.type=this.type,i.name=this.name,i.castShadow=this.castShadow,i.receiveShadow=this.receiveShadow,i.visible=this.visible,i.frustumCulled=this.frustumCulled,i.renderOrder=this.renderOrder,i.static=this.static,i.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.pivot!==null&&(i.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(i.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(i.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),i.instanceInfo=this._instanceInfo.map(o=>({...o})),i.availableInstanceIds=this._availableInstanceIds.slice(),i.availableGeometryIds=this._availableGeometryIds.slice(),i.nextIndexStart=this._nextIndexStart,i.nextVertexStart=this._nextVertexStart,i.geometryCount=this._geometryCount,i.maxInstanceCount=this._maxInstanceCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.matricesTexture=this._matricesTexture.toJSON(e),i.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(i.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(i.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(i.boundingBox=this.boundingBox.toJSON()));function r(o,c){return o[c.uuid]===void 0&&(o[c.uuid]=c.toJSON(e)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=r(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const c=o.shapes;if(Array.isArray(c))for(let l=0,h=c.length;l<h;l++){const d=c[l];r(e.shapes,d)}else r(e.shapes,c)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let c=0,l=this.material.length;c<l;c++)o.push(r(e.materials,this.material[c]));i.material=o}else i.material=r(e.materials,this.material);if(this.children.length>0){i.children=[];for(let o=0;o<this.children.length;o++)i.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){i.animations=[];for(let o=0;o<this.animations.length;o++){const c=this.animations[o];i.animations.push(r(e.animations,c))}}if(t){const o=a(e.geometries),c=a(e.materials),l=a(e.textures),h=a(e.images),d=a(e.shapes),u=a(e.skeletons),f=a(e.animations),g=a(e.nodes);o.length>0&&(n.geometries=o),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),h.length>0&&(n.images=h),d.length>0&&(n.shapes=d),u.length>0&&(n.skeletons=u),f.length>0&&(n.animations=f),g.length>0&&(n.nodes=g)}return n.object=i,n;function a(o){const c=[];for(const l in o){const h=o[l];delete h.metadata,c.push(h)}return c}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){const i=e.children[n];this.add(i.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}}Ot.DEFAULT_UP=new I(0,1,0);Ot.DEFAULT_MATRIX_AUTO_UPDATE=!0;Ot.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;class kt extends Ot{constructor(){super(),this.isGroup=!0,this.type="Group"}}const mf={type:"move"};class Ra{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new kt,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new kt,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new I,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new I),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new kt,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new I,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new I,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let i=null,r=null,a=null;const o=this._targetRay,c=this._grip,l=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(l&&e.hand){a=!0;for(const S of e.hand.values()){const p=t.getJointPose(S,n),m=this._getHandJoint(l,S);p!==null&&(m.matrix.fromArray(p.transform.matrix),m.matrix.decompose(m.position,m.rotation,m.scale),m.matrixWorldNeedsUpdate=!0,m.jointRadius=p.radius),m.visible=p!==null}const h=l.joints["index-finger-tip"],d=l.joints["thumb-tip"],u=h.position.distanceTo(d.position),f=.02,g=.005;l.inputState.pinching&&u>f+g?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!l.inputState.pinching&&u<=f-g&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else c!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1,c.eventsEnabled&&c.dispatchEvent({type:"gripUpdated",data:e,target:this})));o!==null&&(i=t.getPose(e.targetRaySpace,n),i===null&&r!==null&&(i=r),i!==null&&(o.matrix.fromArray(i.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,i.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(i.linearVelocity)):o.hasLinearVelocity=!1,i.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(i.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(mf)))}return o!==null&&(o.visible=i!==null),c!==null&&(c.visible=r!==null),l!==null&&(l.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const n=new kt;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}}const Qh={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},hi={h:0,s:0,l:0},lr={h:0,s:0,l:0};function La(s,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?s+(e-s)*6*t:t<1/2?e:t<2/3?s+(e-s)*6*(2/3-t):s}class qe{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){const i=e;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=jt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,ut.colorSpaceToWorking(this,t),this}setRGB(e,t,n,i=ut.workingColorSpace){return this.r=e,this.g=t,this.b=n,ut.colorSpaceToWorking(this,i),this}setHSL(e,t,n,i=ut.workingColorSpace){if(e=tf(e,1),t=ct(t,0,1),n=ct(n,0,1),t===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+t):n+t-n*t,a=2*n-r;this.r=La(a,r,e+1/3),this.g=La(a,r,e),this.b=La(a,r,e-1/3)}return ut.colorSpaceToWorking(this,i),this}setStyle(e,t=jt){function n(r){r!==void 0&&parseFloat(r)<1&&Je("Color: Alpha component of "+e+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(e)){let r;const a=i[1],o=i[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:Je("Color: Unknown color model "+e)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(e)){const r=i[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(r,16),t);Je("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=jt){const n=Qh[e.toLowerCase()];return n!==void 0?this.setHex(n,t):Je("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=ii(e.r),this.g=ii(e.g),this.b=ii(e.b),this}copyLinearToSRGB(e){return this.r=as(e.r),this.g=as(e.g),this.b=as(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=jt){return ut.workingToColorSpace(Jt.copy(this),e),Math.round(ct(Jt.r*255,0,255))*65536+Math.round(ct(Jt.g*255,0,255))*256+Math.round(ct(Jt.b*255,0,255))}getHexString(e=jt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=ut.workingColorSpace){ut.workingToColorSpace(Jt.copy(this),t);const n=Jt.r,i=Jt.g,r=Jt.b,a=Math.max(n,i,r),o=Math.min(n,i,r);let c,l;const h=(o+a)/2;if(o===a)c=0,l=0;else{const d=a-o;switch(l=h<=.5?d/(a+o):d/(2-a-o),a){case n:c=(i-r)/d+(i<r?6:0);break;case i:c=(r-n)/d+2;break;case r:c=(n-i)/d+4;break}c/=6}return e.h=c,e.s=l,e.l=h,e}getRGB(e,t=ut.workingColorSpace){return ut.workingToColorSpace(Jt.copy(this),t),e.r=Jt.r,e.g=Jt.g,e.b=Jt.b,e}getStyle(e=jt){ut.workingToColorSpace(Jt.copy(this),e);const t=Jt.r,n=Jt.g,i=Jt.b;return e!==jt?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(i*255)})`}offsetHSL(e,t,n){return this.getHSL(hi),this.setHSL(hi.h+e,hi.s+t,hi.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(hi),e.getHSL(lr);const n=wa(hi.h,lr.h,t),i=wa(hi.s,lr.s,t),r=wa(hi.l,lr.l,t);return this.setHSL(n,i,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,n=this.g,i=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*i,this.g=r[1]*t+r[4]*n+r[7]*i,this.b=r[2]*t+r[5]*n+r[8]*i,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Jt=new qe;qe.NAMES=Qh;class yl{constructor(e,t=1,n=1e3){this.isFog=!0,this.name="",this.color=new qe(e),this.near=t,this.far=n}clone(){return new yl(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class eu extends Ot{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new vi,this.environmentIntensity=1,this.environmentRotation=new vi,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),t.object.backgroundBlurriness=this.backgroundBlurriness,t.object.backgroundIntensity=this.backgroundIntensity,t.object.backgroundRotation=this.backgroundRotation.toArray(),t.object.environmentIntensity=this.environmentIntensity,t.object.environmentRotation=this.environmentRotation.toArray(),t}}const wn=new I,qn=new I,Ia=new I,Kn=new I,Xi=new I,qi=new I,yc=new I,Da=new I,ka=new I,Ua=new I,Na=new Rt,Fa=new Rt,Oa=new Rt;class An{constructor(e=new I,t=new I,n=new I){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,i){i.subVectors(n,t),wn.subVectors(e,t),i.cross(wn);const r=i.lengthSq();return r>0?i.multiplyScalar(1/Math.sqrt(r)):i.set(0,0,0)}static getBarycoord(e,t,n,i,r){wn.subVectors(i,t),qn.subVectors(n,t),Ia.subVectors(e,t);const a=wn.dot(wn),o=wn.dot(qn),c=wn.dot(Ia),l=qn.dot(qn),h=qn.dot(Ia),d=a*l-o*o;if(d===0)return r.set(0,0,0),null;const u=1/d,f=(l*c-o*h)*u,g=(a*h-o*c)*u;return r.set(1-f-g,g,f)}static containsPoint(e,t,n,i){return this.getBarycoord(e,t,n,i,Kn)===null?!1:Kn.x>=0&&Kn.y>=0&&Kn.x+Kn.y<=1}static getInterpolation(e,t,n,i,r,a,o,c){return this.getBarycoord(e,t,n,i,Kn)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,Kn.x),c.addScaledVector(a,Kn.y),c.addScaledVector(o,Kn.z),c)}static getInterpolatedAttribute(e,t,n,i,r,a){return Na.setScalar(0),Fa.setScalar(0),Oa.setScalar(0),Na.fromBufferAttribute(e,t),Fa.fromBufferAttribute(e,n),Oa.fromBufferAttribute(e,i),a.setScalar(0),a.addScaledVector(Na,r.x),a.addScaledVector(Fa,r.y),a.addScaledVector(Oa,r.z),a}static isFrontFacing(e,t,n,i){return wn.subVectors(n,t),qn.subVectors(e,t),wn.cross(qn).dot(i)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,i){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[i]),this}setFromAttributeAndIndices(e,t,n,i){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,i),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return wn.subVectors(this.c,this.b),qn.subVectors(this.a,this.b),wn.cross(qn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return An.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return An.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,i,r){return An.getInterpolation(e,this.a,this.b,this.c,t,n,i,r)}containsPoint(e){return An.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return An.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const n=this.a,i=this.b,r=this.c;let a,o;Xi.subVectors(i,n),qi.subVectors(r,n),Da.subVectors(e,n);const c=Xi.dot(Da),l=qi.dot(Da);if(c<=0&&l<=0)return t.copy(n);ka.subVectors(e,i);const h=Xi.dot(ka),d=qi.dot(ka);if(h>=0&&d<=h)return t.copy(i);const u=c*d-h*l;if(u<=0&&c>=0&&h<=0)return a=c/(c-h),t.copy(n).addScaledVector(Xi,a);Ua.subVectors(e,r);const f=Xi.dot(Ua),g=qi.dot(Ua);if(g>=0&&f<=g)return t.copy(r);const S=f*l-c*g;if(S<=0&&l>=0&&g<=0)return o=l/(l-g),t.copy(n).addScaledVector(qi,o);const p=h*g-f*d;if(p<=0&&d-h>=0&&f-g>=0)return yc.subVectors(r,i),o=(d-h)/(d-h+(f-g)),t.copy(i).addScaledVector(yc,o);const m=1/(p+S+u);return a=S*m,o=u*m,t.copy(n).addScaledVector(Xi,a).addScaledVector(qi,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}class Fi{constructor(e=new I(1/0,1/0,1/0),t=new I(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(En.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(En.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=En.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const n=e.geometry;if(n!==void 0){const r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,En):En.fromBufferAttribute(r,a),En.applyMatrix4(e.matrixWorld),this.expandByPoint(En);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),cr.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),cr.copy(n.boundingBox)),cr.applyMatrix4(e.matrixWorld),this.union(cr)}const i=e.children;for(let r=0,a=i.length;r<a;r++)this.expandByObject(i[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,En),En.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(xs),hr.subVectors(this.max,xs),Ki.subVectors(e.a,xs),$i.subVectors(e.b,xs),Yi.subVectors(e.c,xs),ui.subVectors($i,Ki),di.subVectors(Yi,$i),yi.subVectors(Ki,Yi);let t=[0,-ui.z,ui.y,0,-di.z,di.y,0,-yi.z,yi.y,ui.z,0,-ui.x,di.z,0,-di.x,yi.z,0,-yi.x,-ui.y,ui.x,0,-di.y,di.x,0,-yi.y,yi.x,0];return!Ba(t,Ki,$i,Yi,hr)||(t=[1,0,0,0,1,0,0,0,1],!Ba(t,Ki,$i,Yi,hr))?!1:(ur.crossVectors(ui,di),t=[ur.x,ur.y,ur.z],Ba(t,Ki,$i,Yi,hr))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,En).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(En).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:($n[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),$n[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),$n[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),$n[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),$n[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),$n[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),$n[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),$n[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints($n),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const $n=[new I,new I,new I,new I,new I,new I,new I,new I],En=new I,cr=new Fi,Ki=new I,$i=new I,Yi=new I,ui=new I,di=new I,yi=new I,xs=new I,hr=new I,ur=new I,Si=new I;function Ba(s,e,t,n,i){for(let r=0,a=s.length-3;r<=a;r+=3){Si.fromArray(s,r);const o=i.x*Math.abs(Si.x)+i.y*Math.abs(Si.y)+i.z*Math.abs(Si.z),c=e.dot(Si),l=t.dot(Si),h=n.dot(Si);if(Math.max(-Math.max(c,l,h),Math.min(c,l,h))>o)return!1}return!0}const zt=new I,dr=new ce;let gf=0;class gn extends Ni{constructor(e,t,n=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:gf++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=Yd,this.updateRanges=[],this.gpuType=Cn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let i=0,r=this.itemSize;i<r;i++)this.array[e+i]=t.array[n+i];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)dr.fromBufferAttribute(this,t),dr.applyMatrix3(e),this.setXY(t,dr.x,dr.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)zt.fromBufferAttribute(this,t),zt.applyMatrix3(e),this.setXYZ(t,zt.x,zt.y,zt.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)zt.fromBufferAttribute(this,t),zt.applyMatrix4(e),this.setXYZ(t,zt.x,zt.y,zt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)zt.fromBufferAttribute(this,t),zt.applyNormalMatrix(e),this.setXYZ(t,zt.x,zt.y,zt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)zt.fromBufferAttribute(this,t),zt.transformDirection(e),this.setXYZ(t,zt.x,zt.y,zt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=gs(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=ln(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=gs(t,this.array)),t}setX(e,t){return this.normalized&&(t=ln(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=gs(t,this.array)),t}setY(e,t){return this.normalized&&(t=ln(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=gs(t,this.array)),t}setZ(e,t){return this.normalized&&(t=ln(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=gs(t,this.array)),t}setW(e,t){return this.normalized&&(t=ln(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=ln(t,this.array),n=ln(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,i){return e*=this.itemSize,this.normalized&&(t=ln(t,this.array),n=ln(n,this.array),i=ln(i,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this}setXYZW(e,t,n,i,r){return e*=this.itemSize,this.normalized&&(t=ln(t,this.array),n=ln(n,this.array),i=ln(i,this.array),r=ln(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return e.name=this.name,e.usage=this.usage,e.gpuType=this.gpuType,e}dispose(){this.dispatchEvent({type:"dispose"})}}class tu extends gn{constructor(e,t,n){super(new Uint16Array(e),t,n)}}class nu extends gn{constructor(e,t,n){super(new Uint32Array(e),t,n)}}class dt extends gn{constructor(e,t,n){super(new Float32Array(e),t,n)}}const vf=new Fi,_s=new I,Ha=new I;class ds{constructor(e=new I,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const n=this.center;t!==void 0?n.copy(t):vf.setFromPoints(e).getCenter(n);let i=0;for(let r=0,a=e.length;r<a;r++)i=Math.max(i,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(i),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;_s.subVectors(e,this.center);const t=_s.lengthSq();if(t>this.radius*this.radius){const n=Math.sqrt(t),i=(n-this.radius)*.5;this.center.addScaledVector(_s,i/n),this.radius+=i}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Ha.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(_s.copy(e.center).add(Ha)),this.expandByPoint(_s.copy(e.center).sub(Ha))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}let xf=0;const _n=new Et,za=new Ot,Ji=new I,dn=new Fi,ys=new Fi,Kt=new I;class Bt extends Ni{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:xf++}),this.uuid=hs(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Zd(e)?nu:tu)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new et().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}const i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(e),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return _n.makeRotationFromQuaternion(e),this.applyMatrix4(_n),this}rotateX(e){return _n.makeRotationX(e),this.applyMatrix4(_n),this}rotateY(e){return _n.makeRotationY(e),this.applyMatrix4(_n),this}rotateZ(e){return _n.makeRotationZ(e),this.applyMatrix4(_n),this}translate(e,t,n){return _n.makeTranslation(e,t,n),this.applyMatrix4(_n),this}scale(e,t,n){return _n.makeScale(e,t,n),this.applyMatrix4(_n),this}lookAt(e){return za.lookAt(e),za.updateMatrix(),this.applyMatrix4(za.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Ji).negate(),this.translate(Ji.x,Ji.y,Ji.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const n=[];for(let i=0,r=e.length;i<r;i++){const a=e[i];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new dt(n,3))}else{const n=Math.min(e.length,t.count);for(let i=0;i<n;i++){const r=e[i];t.setXYZ(i,r.x,r.y,r.z||0)}e.length>t.count&&Je("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Fi);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){vt("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new I(-1/0,-1/0,-1/0),new I(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,i=t.length;n<i;n++){const r=t[n];dn.setFromBufferAttribute(r),this.morphTargetsRelative?(Kt.addVectors(this.boundingBox.min,dn.min),this.boundingBox.expandByPoint(Kt),Kt.addVectors(this.boundingBox.max,dn.max),this.boundingBox.expandByPoint(Kt)):(this.boundingBox.expandByPoint(dn.min),this.boundingBox.expandByPoint(dn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&vt('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new ds);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){vt("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new I,1/0);return}if(e){const n=this.boundingSphere.center;if(dn.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){const o=t[r];ys.setFromBufferAttribute(o),this.morphTargetsRelative?(Kt.addVectors(dn.min,ys.min),dn.expandByPoint(Kt),Kt.addVectors(dn.max,ys.max),dn.expandByPoint(Kt)):(dn.expandByPoint(ys.min),dn.expandByPoint(ys.max))}dn.getCenter(n);let i=0;for(let r=0,a=e.count;r<a;r++)Kt.fromBufferAttribute(e,r),i=Math.max(i,n.distanceToSquared(Kt));if(t)for(let r=0,a=t.length;r<a;r++){const o=t[r],c=this.morphTargetsRelative;for(let l=0,h=o.count;l<h;l++)Kt.fromBufferAttribute(o,l),c&&(Ji.fromBufferAttribute(e,l),Kt.add(Ji)),i=Math.max(i,n.distanceToSquared(Kt))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&vt('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){vt("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.position,i=t.normal,r=t.uv;let a=this.getAttribute("tangent");(a===void 0||a.count!==n.count)&&(a=new gn(new Float32Array(4*n.count),4),this.setAttribute("tangent",a));const o=[],c=[];for(let x=0;x<n.count;x++)o[x]=new I,c[x]=new I;const l=new I,h=new I,d=new I,u=new ce,f=new ce,g=new ce,S=new I,p=new I;function m(x,w,C){l.fromBufferAttribute(n,x),h.fromBufferAttribute(n,w),d.fromBufferAttribute(n,C),u.fromBufferAttribute(r,x),f.fromBufferAttribute(r,w),g.fromBufferAttribute(r,C),h.sub(l),d.sub(l),f.sub(u),g.sub(u);const L=1/(f.x*g.y-g.x*f.y);isFinite(L)&&(S.copy(h).multiplyScalar(g.y).addScaledVector(d,-f.y).multiplyScalar(L),p.copy(d).multiplyScalar(f.x).addScaledVector(h,-g.x).multiplyScalar(L),o[x].add(S),o[w].add(S),o[C].add(S),c[x].add(p),c[w].add(p),c[C].add(p))}let M=this.groups;M.length===0&&(M=[{start:0,count:e.count}]);for(let x=0,w=M.length;x<w;++x){const C=M[x],L=C.start,N=C.count;for(let B=L,U=L+N;B<U;B+=3)m(e.getX(B+0),e.getX(B+1),e.getX(B+2))}const T=new I,_=new I,b=new I,E=new I;function P(x){b.fromBufferAttribute(i,x),E.copy(b);const w=o[x];T.copy(w),T.sub(b.multiplyScalar(b.dot(w))).normalize(),_.crossVectors(E,w);const L=_.dot(c[x])<0?-1:1;a.setXYZW(x,T.x,T.y,T.z,L)}for(let x=0,w=M.length;x<w;++x){const C=M[x],L=C.start,N=C.count;for(let B=L,U=L+N;B<U;B+=3)P(e.getX(B+0)),P(e.getX(B+1)),P(e.getX(B+2))}this._transformed=!0}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0||n.count!==t.count)n=new gn(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let u=0,f=n.count;u<f;u++)n.setXYZ(u,0,0,0);const i=new I,r=new I,a=new I,o=new I,c=new I,l=new I,h=new I,d=new I;if(e)for(let u=0,f=e.count;u<f;u+=3){const g=e.getX(u+0),S=e.getX(u+1),p=e.getX(u+2);i.fromBufferAttribute(t,g),r.fromBufferAttribute(t,S),a.fromBufferAttribute(t,p),h.subVectors(a,r),d.subVectors(i,r),h.cross(d),o.fromBufferAttribute(n,g),c.fromBufferAttribute(n,S),l.fromBufferAttribute(n,p),o.add(h),c.add(h),l.add(h),n.setXYZ(g,o.x,o.y,o.z),n.setXYZ(S,c.x,c.y,c.z),n.setXYZ(p,l.x,l.y,l.z)}else for(let u=0,f=t.count;u<f;u+=3)i.fromBufferAttribute(t,u+0),r.fromBufferAttribute(t,u+1),a.fromBufferAttribute(t,u+2),h.subVectors(a,r),d.subVectors(i,r),h.cross(d),n.setXYZ(u+0,h.x,h.y,h.z),n.setXYZ(u+1,h.x,h.y,h.z),n.setXYZ(u+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)Kt.fromBufferAttribute(e,t),Kt.normalize(),e.setXYZ(t,Kt.x,Kt.y,Kt.z)}toNonIndexed(){function e(o,c){const l=o.array,h=o.itemSize,d=o.normalized,u=new l.constructor(c.length*h);let f=0,g=0;for(let S=0,p=c.length;S<p;S++){o.isInterleavedBufferAttribute?f=c[S]*o.data.stride+o.offset:f=c[S]*h;for(let m=0;m<h;m++)u[g++]=l[f++]}return new gn(u,h,d)}if(this.index===null)return Je("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new Bt,n=this.index.array,i=this.attributes;for(const o in i){const c=i[o],l=e(c,n);t.setAttribute(o,l)}const r=this.morphAttributes;for(const o in r){const c=[],l=r[o];for(let h=0,d=l.length;h<d;h++){const u=l[h],f=e(u,n);c.push(f)}t.morphAttributes[o]=c}t.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,c=a.length;o<c;o++){const l=a[o];t.addGroup(l.start,l.count,l.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,e.name=this.name,Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(e[l]=c[l]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const n=this.attributes;for(const c in n){const l=n[c];e.data.attributes[c]=l.toJSON(e.data)}const i={};let r=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],h=[];for(let d=0,u=l.length;d<u;d++){const f=l[d];h.push(f.toJSON(e.data))}h.length>0&&(i[c]=h,r=!0)}r&&(e.data.morphAttributes=i,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const n=e.index;n!==null&&this.setIndex(n.clone());const i=e.attributes;for(const l in i){const h=i[l];this.setAttribute(l,h.clone(t))}const r=e.morphAttributes;for(const l in r){const h=[],d=r[l];for(let u=0,f=d.length;u<f;u++)h.push(d[u].clone(t));this.morphAttributes[l]=h}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let l=0,h=a.length;l<h;l++){const d=a[l];this.addGroup(d.start,d.count,d.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const c=e.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Ga=new I,_f=new I,yf=new et;class mi{constructor(e=new I(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,i){return this.normal.set(e,t,n),this.constant=i,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){const i=Ga.subVectors(n,t).cross(_f.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(i,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,n=!0){const i=e.delta(Ga),r=this.normal.dot(i);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const a=-(e.start.dot(this.normal)+this.constant)/r;return n===!0&&(a<0||a>1)?null:t.copy(e.start).addScaledVector(i,a)}intersectsLine(e){const t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const n=t||yf.getNormalMatrix(e),i=this.coplanarPoint(Ga).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(e){return this.normal.fromArray(e.normal),this.constant=e.constant,this}}let Sf=0;class Oi extends Ni{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Sf++}),this.uuid=hs(),this.name="",this.type="Material",this.blending=ks,this.side=Ri,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=kh,this.blendDst=Uh,this.blendEquation=is,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new qe(0,0,0),this.blendAlpha=0,this.depthFunc=Hs,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Gd,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Ma,this.stencilZFail=Ma,this.stencilZPass=Ma,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const n=e[t];if(n===void 0){Je(`Material: parameter '${t}' has value of undefined.`);continue}const i=this[t];if(i===void 0){Je(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}i&&i.isColor?i.set(n):i&&i.isVector2&&n&&n.isVector2||i&&i.isEuler&&n&&n.isEuler||i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,n.blending=this.blending,n.side=this.side,n.shadowSide=this.shadowSide,n.vertexColors=this.vertexColors,n.opacity=this.opacity,n.transparent=this.transparent,n.blendSrc=this.blendSrc,n.blendDst=this.blendDst,n.blendEquation=this.blendEquation,n.blendSrcAlpha=this.blendSrcAlpha,n.blendDstAlpha=this.blendDstAlpha,n.blendEquationAlpha=this.blendEquationAlpha,n.blendColor=this.blendColor.getHex(),n.blendAlpha=this.blendAlpha,n.depthFunc=this.depthFunc,n.depthTest=this.depthTest,n.depthWrite=this.depthWrite,n.colorWrite=this.colorWrite,n.clipIntersection=this.clipIntersection,n.clipShadows=this.clipShadows,n.stencilWriteMask=this.stencilWriteMask,n.stencilFunc=this.stencilFunc,n.stencilRef=this.stencilRef,n.stencilFuncMask=this.stencilFuncMask,n.stencilFail=this.stencilFail,n.stencilZFail=this.stencilZFail,n.stencilZPass=this.stencilZPass,n.stencilWrite=this.stencilWrite,n.polygonOffset=this.polygonOffset,n.polygonOffsetFactor=this.polygonOffsetFactor,n.polygonOffsetUnits=this.polygonOffsetUnits,n.dithering=this.dithering,n.alphaTest=this.alphaTest,n.alphaHash=this.alphaHash,n.alphaToCoverage=this.alphaToCoverage,n.premultipliedAlpha=this.premultipliedAlpha,n.forceSinglePass=this.forceSinglePass,n.allowOverride=this.allowOverride,n.visible=this.visible,n.toneMapped=this.toneMapped,n.name=this.name,this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(n.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(n.clippingPlanes=this.clippingPlanes.map(r=>r.toJSON())),this.rotation!==void 0&&(n.rotation=this.rotation),this.depthPacking!==void 0&&(n.depthPacking=this.depthPacking),this.linewidth!==void 0&&(n.linewidth=this.linewidth),this.linecap!==void 0&&(n.linecap=this.linecap),this.linejoin!==void 0&&(n.linejoin=this.linejoin),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.wireframe!==void 0&&(n.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(n.flatShading=this.flatShading),this.fog!==void 0&&(n.fog=this.fog),Object.keys(this.userData).length>0&&(n.userData=this.userData);function i(r){const a=[];for(const o in r){const c=r[o];delete c.metadata,a.push(c)}return a}if(t){const r=i(e.textures),a=i(e.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new qe().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.retroreflectivity!==void 0&&(this.retroreflectivity=e.retroreflectivity),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=e.iridescenceThicknessRange),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.clippingPlanes!==void 0&&(this.clippingPlanes=e.clippingPlanes.map(n=>new mi().fromJSON(n))),e.clipIntersection!==void 0&&(this.clipIntersection=e.clipIntersection),e.clipShadows!==void 0&&(this.clipShadows=e.clipShadows),e.depthPacking!==void 0&&(this.depthPacking=e.depthPacking),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.linecap!==void 0&&(this.linecap=e.linecap),e.linejoin!==void 0&&(this.linejoin=e.linejoin),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(typeof e.vertexColors=="number"?this.vertexColors=e.vertexColors>0:this.vertexColors=e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let n=e.normalScale;Array.isArray(n)===!1&&(n=[n,n]),this.normalScale=new ce().fromArray(n)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new ce().fromArray(e.clearcoatNormalScale)),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let n=null;if(t!==null){const i=t.length;n=new Array(i);for(let r=0;r!==i;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}const Yn=new I,Va=new I,fr=new I,pr=new I;class iu{constructor(e=new I,t=new I(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Yn)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=Yn.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Yn.copy(this.origin).addScaledVector(this.direction,t),Yn.distanceToSquared(e))}distanceSqToSegment(e,t,n,i){Va.copy(e).add(t).multiplyScalar(.5),fr.copy(t).sub(e).normalize(),pr.copy(this.origin).sub(Va);const r=e.distanceTo(t)*.5,a=-this.direction.dot(fr),o=pr.dot(this.direction),c=-pr.dot(fr),l=pr.lengthSq(),h=Math.abs(1-a*a);let d,u,f,g;if(h>0)if(d=a*c-o,u=a*o-c,g=r*h,d>=0)if(u>=-g)if(u<=g){const S=1/h;d*=S,u*=S,f=d*(d+a*u+2*o)+u*(a*d+u+2*c)+l}else u=r,d=Math.max(0,-(a*u+o)),f=-d*d+u*(u+2*c)+l;else u=-r,d=Math.max(0,-(a*u+o)),f=-d*d+u*(u+2*c)+l;else u<=-g?(d=Math.max(0,-(-a*r+o)),u=d>0?-r:Math.min(Math.max(-r,-c),r),f=-d*d+u*(u+2*c)+l):u<=g?(d=0,u=Math.min(Math.max(-r,-c),r),f=u*(u+2*c)+l):(d=Math.max(0,-(a*r+o)),u=d>0?r:Math.min(Math.max(-r,-c),r),f=-d*d+u*(u+2*c)+l);else u=a>0?-r:r,d=Math.max(0,-(a*u+o)),f=-d*d+u*(u+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,d),i&&i.copy(Va).addScaledVector(fr,u),f}intersectSphere(e,t){if(e.radius<0)return null;Yn.subVectors(e.center,this.origin);const n=Yn.dot(this.direction),i=Yn.dot(Yn)-n*n,r=e.radius*e.radius;if(i>r)return null;const a=Math.sqrt(r-i),o=n-a,c=n+a;return c<0?null:o<0?this.at(c,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){const n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,i,r,a,o,c;const l=1/this.direction.x,h=1/this.direction.y,d=1/this.direction.z,u=this.origin;return l>=0?(n=(e.min.x-u.x)*l,i=(e.max.x-u.x)*l):(n=(e.max.x-u.x)*l,i=(e.min.x-u.x)*l),h>=0?(r=(e.min.y-u.y)*h,a=(e.max.y-u.y)*h):(r=(e.max.y-u.y)*h,a=(e.min.y-u.y)*h),n>a||r>i||((r>n||isNaN(n))&&(n=r),(a<i||isNaN(i))&&(i=a),d>=0?(o=(e.min.z-u.z)*d,c=(e.max.z-u.z)*d):(o=(e.max.z-u.z)*d,c=(e.min.z-u.z)*d),n>c||o>i)||((o>n||n!==n)&&(n=o),(c<i||i!==i)&&(i=c),i<0)?null:this.at(n>=0?n:i,t)}intersectsBox(e){return this.intersectBox(e,Yn)!==null}intersectTriangle(e,t,n,i,r){const a=this.origin,o=this.direction,c=o.x,l=o.y,h=o.z,d=e.x-a.x,u=e.y-a.y,f=e.z-a.z,g=t.x-a.x,S=t.y-a.y,p=t.z-a.z,m=n.x-a.x,M=n.y-a.y,T=n.z-a.z,_=Math.abs(c),b=Math.abs(l),E=Math.abs(h);let P,x,w,C,L,N,B,U,O,$,V,ie;if(_>=b&&_>=E?(w=c,N=d,O=g,ie=m,c>=0?(P=l,x=h,C=u,L=f,B=S,U=p,$=M,V=T):(P=h,x=l,C=f,L=u,B=p,U=S,$=T,V=M)):b>=E?(w=l,N=u,O=S,ie=M,l>=0?(P=h,x=c,C=f,L=d,B=p,U=g,$=T,V=m):(P=c,x=h,C=d,L=f,B=g,U=p,$=m,V=T)):(w=h,N=f,O=p,ie=T,h>=0?(P=c,x=l,C=d,L=u,B=g,U=S,$=m,V=M):(P=l,x=c,C=u,L=d,B=S,U=g,$=M,V=m)),w===0)return null;const q=P/w,j=x/w,ne=1/w,xe=C-q*N,_e=L-j*N,tt=B-q*O,Ze=U-j*O,ft=$-q*ie,J=V-j*ie,ee=ft*Ze-J*tt,Me=xe*J-_e*ft,We=tt*_e-Ze*xe;if(i){if(ee<0||Me<0||We<0)return null}else if((ee<0||Me<0||We<0)&&(ee>0||Me>0||We>0))return null;const Ae=ee+Me+We;if(Ae===0)return null;const Ke=ne*(ee*N+Me*O+We*ie);return(Ae>0?Ke<0:Ke>0)?null:this.at(Ke/Ae,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class vn extends Oi{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new qe(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new vi,this.combine=Nh,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const Sc=new Et,Mi=new iu,mr=new ds,Mc=new I,gr=new I,vr=new I,xr=new I,Wa=new I,_r=new I,bc=new I,yr=new I;class je extends Ot{constructor(e=new Bt,t=new vn){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=i.length;r<a;r++){const o=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(e,t){const n=this.geometry,i=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(i,e);const o=this.morphTargetInfluences;if(r&&o){_r.set(0,0,0);for(let c=0,l=r.length;c<l;c++){const h=o[c],d=r[c];h!==0&&(Wa.fromBufferAttribute(d,e),a?_r.addScaledVector(Wa,h):_r.addScaledVector(Wa.sub(t),h))}t.add(_r)}return t}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){const n=this.geometry,i=this.material,r=this.matrixWorld;i!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),mr.copy(n.boundingSphere),mr.applyMatrix4(r),Mi.copy(e.ray).recast(e.near),!(mr.containsPoint(Mi.origin)===!1&&(Mi.intersectSphere(mr,Mc)===null||Mi.origin.distanceToSquared(Mc)>(e.far-e.near)**2))&&(Sc.copy(r).invert(),Mi.copy(e.ray).applyMatrix4(Sc),!(n.boundingBox!==null&&Mi.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,Mi)))}_computeIntersections(e,t,n){let i;const r=this.geometry,a=this.material,o=r.index,c=r.attributes.position,l=r.attributes.uv,h=r.attributes.uv1,d=r.attributes.normal,u=r.groups,f=r.drawRange;if(o!==null)if(Array.isArray(a))for(let g=0,S=u.length;g<S;g++){const p=u[g],m=a[p.materialIndex],M=Math.max(p.start,f.start),T=Math.min(o.count,Math.min(p.start+p.count,f.start+f.count));for(let _=M,b=T;_<b;_+=3){const E=o.getX(_),P=o.getX(_+1),x=o.getX(_+2);i=Sr(this,m,e,n,l,h,d,E,P,x),i&&(i.faceIndex=Math.floor(_/3),i.face.materialIndex=p.materialIndex,t.push(i))}}else{const g=Math.max(0,f.start),S=Math.min(o.count,f.start+f.count);for(let p=g,m=S;p<m;p+=3){const M=o.getX(p),T=o.getX(p+1),_=o.getX(p+2);i=Sr(this,a,e,n,l,h,d,M,T,_),i&&(i.faceIndex=Math.floor(p/3),t.push(i))}}else if(c!==void 0)if(Array.isArray(a))for(let g=0,S=u.length;g<S;g++){const p=u[g],m=a[p.materialIndex],M=Math.max(p.start,f.start),T=Math.min(c.count,Math.min(p.start+p.count,f.start+f.count));for(let _=M,b=T;_<b;_+=3){const E=_,P=_+1,x=_+2;i=Sr(this,m,e,n,l,h,d,E,P,x),i&&(i.faceIndex=Math.floor(_/3),i.face.materialIndex=p.materialIndex,t.push(i))}}else{const g=Math.max(0,f.start),S=Math.min(c.count,f.start+f.count);for(let p=g,m=S;p<m;p+=3){const M=p,T=p+1,_=p+2;i=Sr(this,a,e,n,l,h,d,M,T,_),i&&(i.faceIndex=Math.floor(p/3),t.push(i))}}}}function Mf(s,e,t,n,i,r,a,o){let c;if(e.side===en?c=n.intersectTriangle(a,r,i,!0,o):c=n.intersectTriangle(i,r,a,e.side===Ri,o),c===null)return null;yr.copy(o),yr.applyMatrix4(s.matrixWorld);const l=t.ray.origin.distanceTo(yr);return l<t.near||l>t.far?null:{distance:l,point:yr.clone(),object:s}}function Sr(s,e,t,n,i,r,a,o,c,l){s.getVertexPosition(o,gr),s.getVertexPosition(c,vr),s.getVertexPosition(l,xr);const h=Mf(s,e,t,n,gr,vr,xr,bc);if(h){const d=new I;An.getBarycoord(bc,gr,vr,xr,d),i&&(h.uv=An.getInterpolatedAttribute(i,o,c,l,d,new ce)),r&&(h.uv1=An.getInterpolatedAttribute(r,o,c,l,d,new ce)),a&&(h.normal=An.getInterpolatedAttribute(a,o,c,l,d,new I),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const u={a:o,b:c,c:l,normal:new I,materialIndex:0};An.getNormal(gr,vr,xr,u.normal),h.face=u,h.barycoord=d}return h}class Sl extends tn{constructor(e=null,t=1,n=1,i,r,a,o,c,l=Wt,h=Wt,d,u){super(null,a,o,c,l,h,i,r,d,u),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class wc extends gn{constructor(e,t,n,i=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=i}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){const e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}}const Zi=new Et,Ec=new Et,Mr=[],Tc=new Fi,bf=new Et,Ss=new je,Ms=new ds;class Ws extends je{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new wc(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let i=0;i<n;i++)this.setMatrixAt(i,bf)}computeBoundingBox(){const e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new Fi),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Zi),Tc.copy(e.boundingBox).applyMatrix4(Zi),this.boundingBox.union(Tc)}computeBoundingSphere(){const e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new ds),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Zi),Ms.copy(e.boundingSphere).applyMatrix4(Zi),this.boundingSphere.union(Ms)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){return this.instanceColor===null?t.setRGB(1,1,1):t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){return t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){const n=t.morphTargetInfluences,i=this.morphTexture.source.data.data,r=n.length+1,a=e*r+1;for(let o=0;o<n.length;o++)n[o]=i[a+o]}raycast(e,t){const n=this.matrixWorld,i=this.count;if(Ss.geometry=this.geometry,Ss.material=this.material,Ss.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Ms.copy(this.boundingSphere),Ms.applyMatrix4(n),e.ray.intersectsSphere(Ms)!==!1))for(let r=0;r<i;r++){this.getMatrixAt(r,Zi),Ec.multiplyMatrices(n,Zi),Ss.matrixWorld=Ec,Ss.raycast(e,Mr);for(let a=0,o=Mr.length;a<o;a++){const c=Mr[a];c.instanceId=r,c.object=this,t.push(c)}Mr.length=0}}setColorAt(e,t){return this.instanceColor===null&&(this.instanceColor=new wc(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3),this}setMatrixAt(e,t){return t.toArray(this.instanceMatrix.array,e*16),this}setMorphAt(e,t){const n=t.morphTargetInfluences,i=n.length+1;this.morphTexture===null&&(this.morphTexture=new Sl(new Float32Array(i*this.count),i,this.count,fl,Cn));const r=this.morphTexture.source.data.data;let a=0;for(let l=0;l<n.length;l++)a+=n[l];const o=this.geometry.morphTargetsRelative?1:1-a,c=i*e;return r[c]=o,r.set(n,c+1),this}updateMorphTargets(){}dispose(){super.dispose(),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}}const bi=new ds,wf=new ce(.5,.5),br=new I;class Ml{constructor(e=new mi,t=new mi,n=new mi,i=new mi,r=new mi,a=new mi){this.planes=[e,t,n,i,r,a]}set(e,t,n,i,r,a){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(i),o[4].copy(r),o[5].copy(a),this}copy(e){const t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=On,n=!1){const i=this.planes,r=e.elements,a=r[0],o=r[1],c=r[2],l=r[3],h=r[4],d=r[5],u=r[6],f=r[7],g=r[8],S=r[9],p=r[10],m=r[11],M=r[12],T=r[13],_=r[14],b=r[15];if(i[0].setComponents(l-a,f-h,m-g,b-M).normalize(),i[1].setComponents(l+a,f+h,m+g,b+M).normalize(),i[2].setComponents(l+o,f+d,m+S,b+T).normalize(),i[3].setComponents(l-o,f-d,m-S,b-T).normalize(),n)i[4].setComponents(c,u,p,_).normalize(),i[5].setComponents(l-c,f-u,m-p,b-_).normalize();else if(i[4].setComponents(l-c,f-u,m-p,b-_).normalize(),t===On)i[5].setComponents(l+c,f+u,m+p,b+_).normalize();else if(t===Vs)i[5].setComponents(c,u,p,_).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),bi.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),bi.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(bi)}intersectsSprite(e){bi.center.set(0,0,0);const t=wf.distanceTo(e.center);return bi.radius=.7071067811865476+t,bi.applyMatrix4(e.matrixWorld),this.intersectsSphere(bi)}intersectsSphere(e){const t=this.planes,n=e.center,i=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<i)return!1;return!0}intersectsBox(e){const t=this.planes;for(let n=0;n<6;n++){const i=t[n];if(br.x=i.normal.x>0?e.max.x:e.min.x,br.y=i.normal.y>0?e.max.y:e.min.y,br.z=i.normal.z>0?e.max.z:e.min.z,i.distanceToPoint(br)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class jo extends Oi{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new qe(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const Ac=new Et,Qo=new iu,wr=new ds,Er=new I;class Cc extends Ot{constructor(e=new Bt,t=new jo){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){const n=this.geometry,i=this.matrixWorld,r=e.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),wr.copy(n.boundingSphere),wr.applyMatrix4(i),wr.radius+=r,e.ray.intersectsSphere(wr)===!1)return;Ac.copy(i).invert(),Qo.copy(e.ray).applyMatrix4(Ac);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=o*o,l=n.index,d=n.attributes.position;if(l!==null){const u=Math.max(0,a.start),f=Math.min(l.count,a.start+a.count);for(let g=u,S=f;g<S;g++){const p=l.getX(g);Er.fromBufferAttribute(d,p),Pc(Er,p,c,i,e,t,this)}}else{const u=Math.max(0,a.start),f=Math.min(d.count,a.start+a.count);for(let g=u,S=f;g<S;g++)Er.fromBufferAttribute(d,g),Pc(Er,g,c,i,e,t,this)}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=i.length;r<a;r++){const o=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function Pc(s,e,t,n,i,r,a){const o=Qo.distanceSqToPoint(s);if(o<t){const c=new I;Qo.closestPointToPoint(s,c),c.applyMatrix4(n);const l=i.ray.origin.distanceTo(c);if(l<i.near||l>i.far)return;r.push({distance:l,distanceToRay:Math.sqrt(o),point:c,index:e,face:null,faceIndex:null,barycoord:null,object:a})}}class su extends tn{constructor(e=[],t=Li,n,i,r,a,o,c,l,h){super(e,t,n,i,r,a,o,c,l,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class ru extends tn{constructor(e,t,n,i,r,a,o,c,l){super(e,t,n,i,r,a,o,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Xs extends tn{constructor(e,t,n=zn,i,r,a,o=Wt,c=Wt,l,h=si,d=1){if(h!==si&&h!==Ci)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const u={width:e,height:t,depth:d};super(u,i,r,a,o,c,h,n,l),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new _l(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return t.compareFunction=this.compareFunction,t}}class Ef extends Xs{constructor(e,t=zn,n=Li,i,r,a=Wt,o=Wt,c,l=si){const h={width:e,height:e,depth:1},d=[h,h,h,h,h,h];super(e,e,t,n,i,r,a,o,c,l),this.image=d,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}}class au extends tn{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class Te extends Bt{constructor(e=1,t=1,n=1,i=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:i,heightSegments:r,depthSegments:a};const o=this;i=Math.floor(i),r=Math.floor(r),a=Math.floor(a);const c=[],l=[],h=[],d=[];let u=0,f=0;g("z","y","x",-1,-1,n,t,e,a,r,0),g("z","y","x",1,-1,n,t,-e,a,r,1),g("x","z","y",1,1,e,n,t,i,a,2),g("x","z","y",1,-1,e,n,-t,i,a,3),g("x","y","z",1,-1,e,t,n,i,r,4),g("x","y","z",-1,-1,e,t,-n,i,r,5),this.setIndex(c),this.setAttribute("position",new dt(l,3)),this.setAttribute("normal",new dt(h,3)),this.setAttribute("uv",new dt(d,2));function g(S,p,m,M,T,_,b,E,P,x,w){const C=_/P,L=b/x,N=_/2,B=b/2,U=E/2,O=P+1,$=x+1;let V=0,ie=0;const q=new I;for(let j=0;j<$;j++){const ne=j*L-B;for(let xe=0;xe<O;xe++){const _e=xe*C-N;q[S]=_e*M,q[p]=ne*T,q[m]=U,l.push(q.x,q.y,q.z),q[S]=0,q[p]=0,q[m]=E>0?1:-1,h.push(q.x,q.y,q.z),d.push(xe/P),d.push(1-j/x),V+=1}}for(let j=0;j<x;j++)for(let ne=0;ne<P;ne++){const xe=u+ne+O*j,_e=u+ne+O*(j+1),tt=u+(ne+1)+O*(j+1),Ze=u+(ne+1)+O*j;c.push(xe,_e,Ze),c.push(_e,tt,Ze),ie+=6}o.addGroup(f,ie,w),f+=ie,u+=V}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Te(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}class Zs extends Bt{constructor(e=1,t=1,n=4,i=8,r=1){super(),this.type="CapsuleGeometry",this.parameters={radius:e,height:t,capSegments:n,radialSegments:i,heightSegments:r},t=Math.max(0,t),n=Math.max(1,Math.floor(n)),i=Math.max(3,Math.floor(i)),r=Math.max(1,Math.floor(r));const a=[],o=[],c=[],l=[],h=t/2,d=Math.PI/2*e,u=t,f=2*d+u,g=n*2+r,S=i+1,p=new I,m=new I;for(let M=0;M<=g;M++){let T=0,_=0,b=0,E=0;if(M<=n){const w=M/n,C=w*Math.PI/2;_=-h-e*Math.cos(C),b=e*Math.sin(C),E=-e*Math.cos(C),T=w*d}else if(M<=n+r){const w=(M-n)/r;_=-h+w*t,b=e,E=0,T=d+w*u}else{const w=(M-n-r)/n,C=w*Math.PI/2;_=h+e*Math.sin(C),b=e*Math.cos(C),E=e*Math.sin(C),T=d+u+w*d}const P=Math.max(0,Math.min(1,T/f));let x=0;M===0?x=.5/i:M===g&&(x=-.5/i);for(let w=0;w<=i;w++){const C=w/i,L=C*Math.PI*2,N=Math.sin(L),B=Math.cos(L);m.x=-b*B,m.y=_,m.z=b*N,o.push(m.x,m.y,m.z),p.set(-b*B,E,b*N),p.normalize(),c.push(p.x,p.y,p.z),l.push(C+x,P)}if(M>0){const w=(M-1)*S;for(let C=0;C<i;C++){const L=w+C,N=w+C+1,B=M*S+C,U=M*S+C+1;a.push(L,N,B),a.push(N,U,B)}}}this.setIndex(a),this.setAttribute("position",new dt(o,3)),this.setAttribute("normal",new dt(c,3)),this.setAttribute("uv",new dt(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Zs(e.radius,e.height,e.capSegments,e.radialSegments,e.heightSegments)}}class aa extends Bt{constructor(e=1,t=32,n=0,i=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:n,thetaLength:i},t=Math.max(3,t);const r=[],a=[],o=[],c=[],l=new I,h=new ce;a.push(0,0,0),o.push(0,0,1),c.push(.5,.5);for(let d=0,u=3;d<=t;d++,u+=3){const f=n+d/t*i;l.x=e*Math.cos(f),l.y=e*Math.sin(f),a.push(l.x,l.y,l.z),o.push(0,0,1),h.x=(a[u]/e+1)/2,h.y=(a[u+1]/e+1)/2,c.push(h.x,h.y)}for(let d=1;d<=t;d++)r.push(d,d+1,0);this.setIndex(r),this.setAttribute("position",new dt(a,3)),this.setAttribute("normal",new dt(o,3)),this.setAttribute("uv",new dt(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new aa(e.radius,e.segments,e.thetaStart,e.thetaLength)}}class Ue extends Bt{constructor(e=1,t=1,n=1,i=32,r=1,a=!1,o=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:i,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:c};const l=this;i=Math.floor(i),r=Math.floor(r);const h=[],d=[],u=[],f=[];let g=0;const S=[],p=n/2;let m=0;M(),a===!1&&(e>0&&T(!0),t>0&&T(!1)),this.setIndex(h),this.setAttribute("position",new dt(d,3)),this.setAttribute("normal",new dt(u,3)),this.setAttribute("uv",new dt(f,2));function M(){const _=new I,b=new I;let E=0;const P=(t-e)/n;for(let x=0;x<=r;x++){const w=[],C=x/r,L=C*(t-e)+e;for(let N=0;N<=i;N++){const B=N/i,U=B*c+o,O=Math.sin(U),$=Math.cos(U);b.x=L*O,b.y=-C*n+p,b.z=L*$,d.push(b.x,b.y,b.z),_.set(O,P,$).normalize(),u.push(_.x,_.y,_.z),f.push(B,1-C),w.push(g++)}S.push(w)}for(let x=0;x<i;x++)for(let w=0;w<r;w++){const C=S[w][x],L=S[w+1][x],N=S[w+1][x+1],B=S[w][x+1];(e>0||w!==0)&&(h.push(C,L,B),E+=3),(t>0||w!==r-1)&&(h.push(L,N,B),E+=3)}l.addGroup(m,E,0),m+=E}function T(_){const b=g,E=new ce,P=new I;let x=0;const w=_===!0?e:t,C=_===!0?1:-1;for(let N=1;N<=i;N++)d.push(0,p*C,0),u.push(0,C,0),f.push(.5,.5),g++;const L=g;for(let N=0;N<=i;N++){const U=N/i*c+o,O=Math.cos(U),$=Math.sin(U);P.x=w*$,P.y=p*C,P.z=w*O,d.push(P.x,P.y,P.z),u.push(0,C,0),E.x=O*.5+.5,E.y=$*.5*C+.5,f.push(E.x,E.y),g++}for(let N=0;N<i;N++){const B=b+N,U=L+N;_===!0?h.push(U,U+1,B):h.push(U+1,U,B),x+=3}l.addGroup(m,x,_===!0?1:2),m+=x}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ue(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class Zt extends Ue{constructor(e=1,t=1,n=32,i=1,r=!1,a=0,o=Math.PI*2){super(0,e,t,n,i,r,a,o),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:n,heightSegments:i,openEnded:r,thetaStart:a,thetaLength:o}}static fromJSON(e){return new Zt(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class bl extends Bt{constructor(e=[],t=[],n=1,i=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:n,detail:i};const r=[],a=[];o(i),l(n),h(),this.setAttribute("position",new dt(r,3)),this.setAttribute("normal",new dt(r.slice(),3)),this.setAttribute("uv",new dt(a,2)),i===0?this.computeVertexNormals():this.normalizeNormals();function o(M){const T=new I,_=new I,b=new I;for(let E=0;E<t.length;E+=3)f(t[E+0],T),f(t[E+1],_),f(t[E+2],b),c(T,_,b,M)}function c(M,T,_,b){const E=b+1,P=[];for(let x=0;x<=E;x++){P[x]=[];const w=M.clone().lerp(_,x/E),C=T.clone().lerp(_,x/E),L=E-x;for(let N=0;N<=L;N++)N===0&&x===E?P[x][N]=w:P[x][N]=w.clone().lerp(C,N/L)}for(let x=0;x<E;x++)for(let w=0;w<2*(E-x)-1;w++){const C=Math.floor(w/2);w%2===0?(u(P[x][C+1]),u(P[x+1][C]),u(P[x][C])):(u(P[x][C+1]),u(P[x+1][C+1]),u(P[x+1][C]))}}function l(M){const T=new I;for(let _=0;_<r.length;_+=3)T.x=r[_+0],T.y=r[_+1],T.z=r[_+2],T.normalize().multiplyScalar(M),r[_+0]=T.x,r[_+1]=T.y,r[_+2]=T.z}function h(){const M=new I;for(let T=0;T<r.length;T+=3){M.x=r[T+0],M.y=r[T+1],M.z=r[T+2];const _=p(M)/2/Math.PI+.5,b=m(M)/Math.PI+.5;a.push(_,1-b)}g(),d()}function d(){for(let M=0;M<a.length;M+=6){const T=a[M+0],_=a[M+2],b=a[M+4],E=Math.max(T,_,b),P=Math.min(T,_,b);E>.9&&P<.1&&(T<.2&&(a[M+0]+=1),_<.2&&(a[M+2]+=1),b<.2&&(a[M+4]+=1))}}function u(M){r.push(M.x,M.y,M.z)}function f(M,T){const _=M*3;T.x=e[_+0],T.y=e[_+1],T.z=e[_+2]}function g(){const M=new I,T=new I,_=new I,b=new I,E=new ce,P=new ce,x=new ce;for(let w=0,C=0;w<r.length;w+=9,C+=6){M.set(r[w+0],r[w+1],r[w+2]),T.set(r[w+3],r[w+4],r[w+5]),_.set(r[w+6],r[w+7],r[w+8]),E.set(a[C+0],a[C+1]),P.set(a[C+2],a[C+3]),x.set(a[C+4],a[C+5]),b.copy(M).add(T).add(_).divideScalar(3);const L=p(b);S(E,C+0,M,L),S(P,C+2,T,L),S(x,C+4,_,L)}}function S(M,T,_,b){b<0&&M.x===1&&(a[T]=M.x-1),_.x===0&&_.z===0&&(a[T]=b/2/Math.PI+.5)}function p(M){return Math.atan2(M.z,-M.x)}function m(M){return Math.atan2(-M.y,Math.sqrt(M.x*M.x+M.z*M.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new bl(e.vertices,e.indices,e.radius,e.detail)}}class Vn{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){Je("Curve: .getPoint() not implemented.")}getPointAt(e,t){const n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){const t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){const t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){const e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const t=[];let n,i=this.getPoint(0),r=0;t.push(0);for(let a=1;a<=e;a++)n=this.getPoint(a/e),r+=n.distanceTo(i),t.push(r),i=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){const n=this.getLengths();let i=0;const r=n.length;let a;t?a=t:a=e*n[r-1];let o=0,c=r-1,l;for(;o<=c;)if(i=Math.floor(o+(c-o)/2),l=n[i]-a,l<0)o=i+1;else if(l>0)c=i-1;else{c=i;break}if(i=c,n[i]===a)return i/(r-1);const h=n[i],u=n[i+1]-h,f=(a-h)/u;return(i+f)/(r-1)}getTangent(e,t){let i=e-1e-4,r=e+1e-4;i<0&&(i=0),r>1&&(r=1);const a=this.getPoint(i),o=this.getPoint(r),c=t||(a.isVector2?new ce:new I);return c.copy(o).sub(a).normalize(),c}getTangentAt(e,t){const n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t=!1){const n=new I,i=[],r=[],a=[],o=new I,c=new Et;for(let f=0;f<=e;f++){const g=f/e;i[f]=this.getTangentAt(g,new I)}r[0]=new I,a[0]=new I;let l=Number.MAX_VALUE;const h=Math.abs(i[0].x),d=Math.abs(i[0].y),u=Math.abs(i[0].z);h<=l&&(l=h,n.set(1,0,0)),d<=l&&(l=d,n.set(0,1,0)),u<=l&&n.set(0,0,1),o.crossVectors(i[0],n).normalize(),r[0].crossVectors(i[0],o),a[0].crossVectors(i[0],r[0]);for(let f=1;f<=e;f++){if(r[f]=r[f-1].clone(),a[f]=a[f-1].clone(),o.crossVectors(i[f-1],i[f]),o.length()>Number.EPSILON){o.normalize();const g=Math.acos(ct(i[f-1].dot(i[f]),-1,1));r[f].applyMatrix4(c.makeRotationAxis(o,g))}a[f].crossVectors(i[f],r[f])}if(t===!0){let f=Math.acos(ct(r[0].dot(r[e]),-1,1));f/=e,i[0].dot(o.crossVectors(r[0],r[e]))>0&&(f=-f);for(let g=1;g<=e;g++)r[g].applyMatrix4(c.makeRotationAxis(i[g],f*g)),a[g].crossVectors(i[g],r[g])}return{tangents:i,normals:r,binormals:a}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){const e={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}}class wl extends Vn{constructor(e=0,t=0,n=1,i=1,r=0,a=Math.PI*2,o=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=i,this.aStartAngle=r,this.aEndAngle=a,this.aClockwise=o,this.aRotation=c}getPoint(e,t=new ce){const n=t,i=Math.PI*2;let r=this.aEndAngle-this.aStartAngle;const a=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=i;for(;r>i;)r-=i;r<Number.EPSILON&&(a?r=0:r=i),this.aClockwise===!0&&!a&&(r===i?r=-i:r=r-i);const o=this.aStartAngle+e*r;let c=this.aX+this.xRadius*Math.cos(o),l=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){const h=Math.cos(this.aRotation),d=Math.sin(this.aRotation),u=c-this.aX,f=l-this.aY;c=u*h-f*d+this.aX,l=u*d+f*h+this.aY}return n.set(c,l)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){const e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}}class Tf extends wl{constructor(e,t,n,i,r,a){super(e,t,n,n,i,r,a),this.isArcCurve=!0,this.type="ArcCurve"}}function El(){let s=0,e=0,t=0,n=0;function i(r,a,o,c){s=r,e=o,t=-3*r+3*a-2*o-c,n=2*r-2*a+o+c}return{initCatmullRom:function(r,a,o,c,l){i(a,o,l*(o-r),l*(c-a))},initNonuniformCatmullRom:function(r,a,o,c,l,h,d){let u=(a-r)/l-(o-r)/(l+h)+(o-a)/h,f=(o-a)/h-(c-a)/(h+d)+(c-o)/d;u*=h,f*=h,i(a,o,u,f)},calc:function(r){const a=r*r,o=a*r;return s+e*r+t*a+n*o}}}const Rc=new I,Lc=new I,Xa=new El,qa=new El,Ka=new El;class Af extends Vn{constructor(e=[],t=!1,n="centripetal",i=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=n,this.tension=i}getPoint(e,t=new I){const n=t,i=this.points,r=i.length,a=(r-(this.closed?0:1))*e;let o=Math.floor(a),c=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/r)+1)*r:c===0&&o===r-1&&(o=r-2,c=1);let l,h;this.closed||o>0?l=i[(o-1)%r]:(Lc.subVectors(i[0],i[1]).add(i[0]),l=Lc);const d=i[o%r],u=i[(o+1)%r];if(this.closed||o+2<r?h=i[(o+2)%r]:(Rc.subVectors(i[r-1],i[r-2]).add(i[r-1]),h=Rc),this.curveType==="centripetal"||this.curveType==="chordal"){const f=this.curveType==="chordal"?.5:.25;let g=Math.pow(l.distanceToSquared(d),f),S=Math.pow(d.distanceToSquared(u),f),p=Math.pow(u.distanceToSquared(h),f);S<1e-4&&(S=1),g<1e-4&&(g=S),p<1e-4&&(p=S),Xa.initNonuniformCatmullRom(l.x,d.x,u.x,h.x,g,S,p),qa.initNonuniformCatmullRom(l.y,d.y,u.y,h.y,g,S,p),Ka.initNonuniformCatmullRom(l.z,d.z,u.z,h.z,g,S,p)}else this.curveType==="catmullrom"&&(Xa.initCatmullRom(l.x,d.x,u.x,h.x,this.tension),qa.initCatmullRom(l.y,d.y,u.y,h.y,this.tension),Ka.initCatmullRom(l.z,d.z,u.z,h.z,this.tension));return n.set(Xa.calc(c),qa.calc(c),Ka.calc(c)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const i=e.points[t];this.points.push(i.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){const i=this.points[t];e.points.push(i.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const i=e.points[t];this.points.push(new I().fromArray(i))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}}function Ic(s,e,t,n,i){const r=(n-e)*.5,a=(i-t)*.5,o=s*s,c=s*o;return(2*t-2*n+r+a)*c+(-3*t+3*n-2*r-a)*o+r*s+t}function Cf(s,e){const t=1-s;return t*t*e}function Pf(s,e){return 2*(1-s)*s*e}function Rf(s,e){return s*s*e}function Us(s,e,t,n){return Cf(s,e)+Pf(s,t)+Rf(s,n)}function Lf(s,e){const t=1-s;return t*t*t*e}function If(s,e){const t=1-s;return 3*t*t*s*e}function Df(s,e){return 3*(1-s)*s*s*e}function kf(s,e){return s*s*s*e}function Ns(s,e,t,n,i){return Lf(s,e)+If(s,t)+Df(s,n)+kf(s,i)}class ou extends Vn{constructor(e=new ce,t=new ce,n=new ce,i=new ce){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=n,this.v3=i}getPoint(e,t=new ce){const n=t,i=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(Ns(e,i.x,r.x,a.x,o.x),Ns(e,i.y,r.y,a.y,o.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class Uf extends Vn{constructor(e=new I,t=new I,n=new I,i=new I){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=n,this.v3=i}getPoint(e,t=new I){const n=t,i=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(Ns(e,i.x,r.x,a.x,o.x),Ns(e,i.y,r.y,a.y,o.y),Ns(e,i.z,r.z,a.z,o.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class lu extends Vn{constructor(e=new ce,t=new ce){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new ce){const n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new ce){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Nf extends Vn{constructor(e=new I,t=new I){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new I){const n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new I){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class cu extends Vn{constructor(e=new ce,t=new ce,n=new ce){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new ce){const n=t,i=this.v0,r=this.v1,a=this.v2;return n.set(Us(e,i.x,r.x,a.x),Us(e,i.y,r.y,a.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Ff extends Vn{constructor(e=new I,t=new I,n=new I){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new I){const n=t,i=this.v0,r=this.v1,a=this.v2;return n.set(Us(e,i.x,r.x,a.x),Us(e,i.y,r.y,a.y),Us(e,i.z,r.z,a.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class hu extends Vn{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new ce){const n=t,i=this.points,r=(i.length-1)*e,a=Math.floor(r),o=r-a,c=i[a===0?a:a-1],l=i[a],h=i[a>i.length-2?i.length-1:a+1],d=i[a>i.length-3?i.length-1:a+2];return n.set(Ic(o,c.x,l.x,h.x,d.x),Ic(o,c.y,l.y,h.y,d.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const i=e.points[t];this.points.push(i.clone())}return this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){const i=this.points[t];e.points.push(i.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const i=e.points[t];this.points.push(new ce().fromArray(i))}return this}}var el=Object.freeze({__proto__:null,ArcCurve:Tf,CatmullRomCurve3:Af,CubicBezierCurve:ou,CubicBezierCurve3:Uf,EllipseCurve:wl,LineCurve:lu,LineCurve3:Nf,QuadraticBezierCurve:cu,QuadraticBezierCurve3:Ff,SplineCurve:hu});class Of extends Vn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){const e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){const n=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new el[n](t,e))}return this}getPoint(e,t){const n=e*this.getLength(),i=this.getCurveLengths();let r=0;for(;r<i.length;){if(i[r]>=n){const a=i[r]-n,o=this.curves[r],c=o.getLength(),l=c===0?0:1-a/c;return o.getPointAt(l,t)}r++}return null}getLength(){const e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const e=[];let t=0;for(let n=0,i=this.curves.length;n<i;n++)t+=this.curves[n].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){const t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){const t=[];let n;for(let i=0,r=this.curves;i<r.length;i++){const a=r[i],o=a.isEllipseCurve?e*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?e*a.points.length:e,c=a.getPoints(o);for(let l=0;l<c.length;l++){const h=c[l];n&&n.equals(h)||(t.push(h),n=h)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){const i=e.curves[t];this.curves.push(i.clone())}return this.autoClose=e.autoClose,this}toJSON(){const e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,n=this.curves.length;t<n;t++){const i=this.curves[t];e.curves.push(i.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){const i=e.curves[t];this.curves.push(new el[i.type]().fromJSON(i))}return this}}class Dc extends Of{constructor(e){super(),this.type="Path",this.currentPoint=new ce,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,n=e.length;t<n;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){const n=new lu(this.currentPoint.clone(),new ce(e,t));return this.curves.push(n),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,n,i){const r=new cu(this.currentPoint.clone(),new ce(e,t),new ce(n,i));return this.curves.push(r),this.currentPoint.set(n,i),this}bezierCurveTo(e,t,n,i,r,a){const o=new ou(this.currentPoint.clone(),new ce(e,t),new ce(n,i),new ce(r,a));return this.curves.push(o),this.currentPoint.set(r,a),this}splineThru(e){const t=[this.currentPoint.clone()].concat(e),n=new hu(t);return this.curves.push(n),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,n,i,r,a){const o=this.currentPoint.x,c=this.currentPoint.y;return this.absarc(e+o,t+c,n,i,r,a),this}absarc(e,t,n,i,r,a){return this.absellipse(e,t,n,n,i,r,a),this}ellipse(e,t,n,i,r,a,o,c){const l=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(e+l,t+h,n,i,r,a,o,c),this}absellipse(e,t,n,i,r,a,o,c){const l=new wl(e,t,n,i,r,a,o,c);if(this.curves.length>0){const d=l.getPoint(0);d.equals(this.currentPoint)||this.lineTo(d.x,d.y)}this.curves.push(l);const h=l.getPoint(1);return this.currentPoint.copy(h),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){const e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}}class qs extends Dc{constructor(e){super(e),this.uuid=hs(),this.type="Shape",this.holes=[]}getPointsHoles(e){const t=[];for(let n=0,i=this.holes.length;n<i;n++)t[n]=this.holes[n].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){const i=e.holes[t];this.holes.push(i.clone())}return this}toJSON(){const e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,n=this.holes.length;t<n;t++){const i=this.holes[t];e.holes.push(i.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){const i=e.holes[t];this.holes.push(new Dc().fromJSON(i))}return this}}function Bf(s,e,t=2){const n=e&&e.length,i=n?e[0]*t:s.length;let r=uu(s,0,i,t,!0);const a=[];if(!r||r.next===r.prev)return a;let o,c,l;if(n&&(r=Wf(s,e,r,t)),s.length>80*t){o=s[0],c=s[1];let h=o,d=c;for(let u=t;u<i;u+=t){const f=s[u],g=s[u+1];f<o&&(o=f),g<c&&(c=g),f>h&&(h=f),g>d&&(d=g)}l=Math.max(h-o,d-c),l=l!==0?32767/l:0}return Ks(r,a,t,o,c,l,0),a}function uu(s,e,t,n,i){let r;if(i===tp(s,e,t,n)>0)for(let a=e;a<t;a+=n)r=kc(a/n|0,s[a],s[a+1],r);else for(let a=t-n;a>=e;a-=n)r=kc(a/n|0,s[a],s[a+1],r);return r&&ls(r,r.next)&&(Ys(r),r=r.next),r}function Di(s,e){if(!s)return s;e||(e=s);let t=s,n;do if(n=!1,!t.steiner&&(ls(t,t.next)||Lt(t.prev,t,t.next)===0)){if(Ys(t),t=e=t.prev,t===t.next)break;n=!0}else t=t.next;while(n||t!==e);return e}function Ks(s,e,t,n,i,r,a){if(!s)return;!a&&r&&Yf(s,n,i,r);let o=s;for(;s.prev!==s.next;){const c=s.prev,l=s.next;if(r?zf(s,n,i,r):Hf(s)){e.push(c.i,s.i,l.i),Ys(s),s=l.next,o=l.next;continue}if(s=l,s===o){a?a===1?(s=Gf(Di(s),e),Ks(s,e,t,n,i,r,2)):a===2&&Vf(s,e,t,n,i,r):Ks(Di(s),e,t,n,i,r,1);break}}}function Hf(s){const e=s.prev,t=s,n=s.next;if(Lt(e,t,n)>=0)return!1;const i=e.x,r=t.x,a=n.x,o=e.y,c=t.y,l=n.y,h=Math.min(i,r,a),d=Math.min(o,c,l),u=Math.max(i,r,a),f=Math.max(o,c,l);let g=n.next;for(;g!==e;){if(g.x>=h&&g.x<=u&&g.y>=d&&g.y<=f&&Cs(i,o,r,c,a,l,g.x,g.y)&&Lt(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function zf(s,e,t,n){const i=s.prev,r=s,a=s.next;if(Lt(i,r,a)>=0)return!1;const o=i.x,c=r.x,l=a.x,h=i.y,d=r.y,u=a.y,f=Math.min(o,c,l),g=Math.min(h,d,u),S=Math.max(o,c,l),p=Math.max(h,d,u),m=tl(f,g,e,t,n),M=tl(S,p,e,t,n);let T=s.prevZ,_=s.nextZ;for(;T&&T.z>=m&&_&&_.z<=M;){if(T.x>=f&&T.x<=S&&T.y>=g&&T.y<=p&&T!==i&&T!==a&&Cs(o,h,c,d,l,u,T.x,T.y)&&Lt(T.prev,T,T.next)>=0||(T=T.prevZ,_.x>=f&&_.x<=S&&_.y>=g&&_.y<=p&&_!==i&&_!==a&&Cs(o,h,c,d,l,u,_.x,_.y)&&Lt(_.prev,_,_.next)>=0))return!1;_=_.nextZ}for(;T&&T.z>=m;){if(T.x>=f&&T.x<=S&&T.y>=g&&T.y<=p&&T!==i&&T!==a&&Cs(o,h,c,d,l,u,T.x,T.y)&&Lt(T.prev,T,T.next)>=0)return!1;T=T.prevZ}for(;_&&_.z<=M;){if(_.x>=f&&_.x<=S&&_.y>=g&&_.y<=p&&_!==i&&_!==a&&Cs(o,h,c,d,l,u,_.x,_.y)&&Lt(_.prev,_,_.next)>=0)return!1;_=_.nextZ}return!0}function Gf(s,e){let t=s;do{const n=t.prev,i=t.next.next;!ls(n,i)&&fu(n,t,t.next,i)&&$s(n,i)&&$s(i,n)&&(e.push(n.i,t.i,i.i),Ys(t),Ys(t.next),t=s=i),t=t.next}while(t!==s);return Di(t)}function Vf(s,e,t,n,i,r){let a=s;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&jf(a,o)){let c=pu(a,o);a=Di(a,a.next),c=Di(c,c.next),Ks(a,e,t,n,i,r,0),Ks(c,e,t,n,i,r,0);return}o=o.next}a=a.next}while(a!==s)}function Wf(s,e,t,n){const i=[];for(let r=0,a=e.length;r<a;r++){const o=e[r]*n,c=r<a-1?e[r+1]*n:s.length,l=uu(s,o,c,n,!1);l===l.next&&(l.steiner=!0),i.push(Zf(l))}i.sort(Xf);for(let r=0;r<i.length;r++)t=qf(i[r],t);return t}function Xf(s,e){let t=s.x-e.x;if(t===0&&(t=s.y-e.y,t===0)){const n=(s.next.y-s.y)/(s.next.x-s.x),i=(e.next.y-e.y)/(e.next.x-e.x);t=n-i}return t}function qf(s,e){const t=Kf(s,e);if(!t)return e;const n=pu(t,s);return Di(n,n.next),Di(t,t.next)}function Kf(s,e){let t=e;const n=s.x,i=s.y;let r=-1/0,a;if(ls(s,t))return t;do{if(ls(s,t.next))return t.next;if(i<=t.y&&i>=t.next.y&&t.next.y!==t.y){const d=t.x+(i-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(d<=n&&d>r&&(r=d,a=t.x<t.next.x?t:t.next,d===n))return a}t=t.next}while(t!==e);if(!a)return null;const o=a,c=a.x,l=a.y;let h=1/0;t=a;do{if(n>=t.x&&t.x>=c&&n!==t.x&&du(i<l?n:r,i,c,l,i<l?r:n,i,t.x,t.y)){const d=Math.abs(i-t.y)/(n-t.x);$s(t,s)&&(d<h||d===h&&(t.x>a.x||t.x===a.x&&$f(a,t)))&&(a=t,h=d)}t=t.next}while(t!==o);return a}function $f(s,e){return Lt(s.prev,s,e.prev)<0&&Lt(e.next,s,s.next)<0}function Yf(s,e,t,n){let i=s;do i.z===0&&(i.z=tl(i.x,i.y,e,t,n)),i.prevZ=i.prev,i.nextZ=i.next,i=i.next;while(i!==s);i.prevZ.nextZ=null,i.prevZ=null,Jf(i)}function Jf(s){let e,t=1;do{let n=s,i;s=null;let r=null;for(e=0;n;){e++;let a=n,o=0;for(let l=0;l<t&&(o++,a=a.nextZ,!!a);l++);let c=t;for(;o>0||c>0&&a;)o!==0&&(c===0||!a||n.z<=a.z)?(i=n,n=n.nextZ,o--):(i=a,a=a.nextZ,c--),r?r.nextZ=i:s=i,i.prevZ=r,r=i;n=a}r.nextZ=null,t*=2}while(e>1);return s}function tl(s,e,t,n,i){return s=(s-t)*i|0,e=(e-n)*i|0,s=(s|s<<8)&16711935,s=(s|s<<4)&252645135,s=(s|s<<2)&858993459,s=(s|s<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,s|e<<1}function Zf(s){let e=s,t=s;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==s);return t}function du(s,e,t,n,i,r,a,o){return(i-a)*(e-o)>=(s-a)*(r-o)&&(s-a)*(n-o)>=(t-a)*(e-o)&&(t-a)*(r-o)>=(i-a)*(n-o)}function Cs(s,e,t,n,i,r,a,o){return!(s===a&&e===o)&&du(s,e,t,n,i,r,a,o)}function jf(s,e){return s.next.i!==e.i&&s.prev.i!==e.i&&!Qf(s,e)&&($s(s,e)&&$s(e,s)&&ep(s,e)&&(Lt(s.prev,s,e.prev)||Lt(s,e.prev,e))||ls(s,e)&&Lt(s.prev,s,s.next)>0&&Lt(e.prev,e,e.next)>0)}function Lt(s,e,t){return(e.y-s.y)*(t.x-e.x)-(e.x-s.x)*(t.y-e.y)}function ls(s,e){return s.x===e.x&&s.y===e.y}function fu(s,e,t,n){const i=Ar(Lt(s,e,t)),r=Ar(Lt(s,e,n)),a=Ar(Lt(t,n,s)),o=Ar(Lt(t,n,e));return!!(i!==r&&a!==o||i===0&&Tr(s,t,e)||r===0&&Tr(s,n,e)||a===0&&Tr(t,s,n)||o===0&&Tr(t,e,n))}function Tr(s,e,t){return e.x<=Math.max(s.x,t.x)&&e.x>=Math.min(s.x,t.x)&&e.y<=Math.max(s.y,t.y)&&e.y>=Math.min(s.y,t.y)}function Ar(s){return s>0?1:s<0?-1:0}function Qf(s,e){let t=s;do{if(t.i!==s.i&&t.next.i!==s.i&&t.i!==e.i&&t.next.i!==e.i&&fu(t,t.next,s,e))return!0;t=t.next}while(t!==s);return!1}function $s(s,e){return Lt(s.prev,s,s.next)<0?Lt(s,e,s.next)>=0&&Lt(s,s.prev,e)>=0:Lt(s,e,s.prev)<0||Lt(s,s.next,e)<0}function ep(s,e){let t=s,n=!1;const i=(s.x+e.x)/2,r=(s.y+e.y)/2;do t.y>r!=t.next.y>r&&t.next.y!==t.y&&i<(t.next.x-t.x)*(r-t.y)/(t.next.y-t.y)+t.x&&(n=!n),t=t.next;while(t!==s);return n}function pu(s,e){const t=nl(s.i,s.x,s.y),n=nl(e.i,e.x,e.y),i=s.next,r=e.prev;return s.next=e,e.prev=s,t.next=i,i.prev=t,n.next=t,t.prev=n,r.next=n,n.prev=r,n}function kc(s,e,t,n){const i=nl(s,e,t);return n?(i.next=n.next,i.prev=n,n.next.prev=i,n.next=i):(i.prev=i,i.next=i),i}function Ys(s){s.next.prev=s.prev,s.prev.next=s.next,s.prevZ&&(s.prevZ.nextZ=s.nextZ),s.nextZ&&(s.nextZ.prevZ=s.prevZ)}function nl(s,e,t){return{i:s,x:e,y:t,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function tp(s,e,t,n){let i=0;for(let r=e,a=t-n;r<t;r+=n)i+=(s[a]-s[r])*(s[r+1]+s[a+1]),a=r;return i}class np{static triangulate(e,t,n=2){return Bf(e,t,n)}}class ti{static area(e){const t=e.length;let n=0;for(let i=t-1,r=0;r<t;i=r++)n+=e[i].x*e[r].y-e[r].x*e[i].y;return n*.5}static isClockWise(e){return ti.area(e)<0}static triangulateShape(e,t){const n=[],i=[],r=[];Uc(e),Nc(n,e);let a=e.length;t.forEach(Uc);for(let c=0;c<t.length;c++)i.push(a),a+=t[c].length,Nc(n,t[c]);const o=np.triangulate(n,i);for(let c=0;c<o.length;c+=3)r.push(o.slice(c,c+3));return r}}function Uc(s){const e=s.length;e>2&&s[e-1].equals(s[0])&&s.pop()}function Nc(s,e){for(let t=0;t<e.length;t++)s.push(e[t].x),s.push(e[t].y)}class Tl extends Bt{constructor(e=new qs([new ce(.5,.5),new ce(-.5,.5),new ce(-.5,-.5),new ce(.5,-.5)]),t={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:e,options:t},e=Array.isArray(e)?e:[e];const n=this,i=[],r=[];for(let o=0,c=e.length;o<c;o++){const l=e[o];a(l)}this.setAttribute("position",new dt(i,3)),this.setAttribute("uv",new dt(r,2)),this.computeVertexNormals();function a(o){const c=[],l=t.curveSegments!==void 0?t.curveSegments:12,h=t.steps!==void 0?t.steps:1,d=t.depth!==void 0?t.depth:1;let u=t.bevelEnabled!==void 0?t.bevelEnabled:!0,f=t.bevelThickness!==void 0?t.bevelThickness:.2,g=t.bevelSize!==void 0?t.bevelSize:f-.1,S=t.bevelOffset!==void 0?t.bevelOffset:0,p=t.bevelSegments!==void 0?t.bevelSegments:3;const m=t.extrudePath,M=t.UVGenerator!==void 0?t.UVGenerator:ip;let T,_=!1,b,E,P,x;if(m){T=m.getSpacedPoints(h),_=!0,u=!1;const te=m.isCatmullRomCurve3?m.closed:!1;b=m.computeFrenetFrames(h,te),E=new I,P=new I,x=new I}u||(p=0,f=0,g=0,S=0);const w=o.extractPoints(l);let C=w.shape;const L=w.holes;if(!ti.isClockWise(C)){C=C.reverse();for(let te=0,re=L.length;te<re;te++){const ae=L[te];ti.isClockWise(ae)&&(L[te]=ae.reverse())}}function B(te){const ae=10000000000000001e-36;let oe=te[0];for(let ue=1;ue<=te.length;ue++){const Ge=ue%te.length,He=te[Ge],$e=He.x-oe.x,Qe=He.y-oe.y,R=$e*$e+Qe*Qe,xt=Math.max(Math.abs(He.x),Math.abs(He.y),Math.abs(oe.x),Math.abs(oe.y)),ot=ae*xt*xt;if(R<=ot){te.splice(Ge,1),ue--;continue}oe=He}}B(C),L.forEach(B);const U=L.length,O=C;for(let te=0;te<U;te++){const re=L[te];C=C.concat(re)}function $(te,re,ae){return re||vt("ExtrudeGeometry: vec does not exist"),te.clone().addScaledVector(re,ae)}const V=C.length;function ie(te,re,ae){let oe,ue,Ge;const He=te.x-re.x,$e=te.y-re.y,Qe=ae.x-te.x,R=ae.y-te.y,xt=He*He+$e*$e,ot=He*R-$e*Qe;if(Math.abs(ot)>Number.EPSILON){const A=Math.sqrt(xt),v=Math.sqrt(Qe*Qe+R*R),F=re.x-$e/A,G=re.y+He/A,K=ae.x-R/v,le=ae.y+Qe/v,he=((K-F)*R-(le-G)*Qe)/(He*R-$e*Qe);oe=F+He*he-te.x,ue=G+$e*he-te.y;const Y=oe*oe+ue*ue;if(Y<=2)return new ce(oe,ue);Ge=Math.sqrt(Y/2)}else{let A=!1;He>Number.EPSILON?Qe>Number.EPSILON&&(A=!0):He<-Number.EPSILON?Qe<-Number.EPSILON&&(A=!0):Math.sign($e)===Math.sign(R)&&(A=!0),A?(oe=-$e,ue=He,Ge=Math.sqrt(xt)):(oe=He,ue=$e,Ge=Math.sqrt(xt/2))}return new ce(oe/Ge,ue/Ge)}const q=[];for(let te=0,re=O.length,ae=re-1,oe=te+1;te<re;te++,ae++,oe++)ae===re&&(ae=0),oe===re&&(oe=0),q[te]=ie(O[te],O[ae],O[oe]);const j=[];let ne,xe=q.concat();for(let te=0,re=U;te<re;te++){const ae=L[te];ne=[];for(let oe=0,ue=ae.length,Ge=ue-1,He=oe+1;oe<ue;oe++,Ge++,He++)Ge===ue&&(Ge=0),He===ue&&(He=0),ne[oe]=ie(ae[oe],ae[Ge],ae[He]);j.push(ne),xe=xe.concat(ne)}let _e;if(p===0)_e=ti.triangulateShape(O,L);else{const te=[],re=[];for(let ae=0;ae<p;ae++){const oe=ae/p,ue=f*Math.cos(oe*Math.PI/2),Ge=g*Math.sin(oe*Math.PI/2)+S;for(let He=0,$e=O.length;He<$e;He++){const Qe=$(O[He],q[He],Ge);Me(Qe.x,Qe.y,-ue),oe===0&&te.push(Qe)}for(let He=0,$e=U;He<$e;He++){const Qe=L[He];ne=j[He];const R=[];for(let xt=0,ot=Qe.length;xt<ot;xt++){const A=$(Qe[xt],ne[xt],Ge);Me(A.x,A.y,-ue),oe===0&&R.push(A)}oe===0&&re.push(R)}}_e=ti.triangulateShape(te,re)}const tt=_e.length,Ze=g+S;for(let te=0;te<V;te++){const re=u?$(C[te],xe[te],Ze):C[te];_?(P.copy(b.normals[0]).multiplyScalar(re.x),E.copy(b.binormals[0]).multiplyScalar(re.y),x.copy(T[0]).add(P).add(E),Me(x.x,x.y,x.z)):Me(re.x,re.y,0)}for(let te=1;te<=h;te++)for(let re=0;re<V;re++){const ae=u?$(C[re],xe[re],Ze):C[re];_?(P.copy(b.normals[te]).multiplyScalar(ae.x),E.copy(b.binormals[te]).multiplyScalar(ae.y),x.copy(T[te]).add(P).add(E),Me(x.x,x.y,x.z)):Me(ae.x,ae.y,d/h*te)}for(let te=p-1;te>=0;te--){const re=te/p,ae=f*Math.cos(re*Math.PI/2),oe=g*Math.sin(re*Math.PI/2)+S;for(let ue=0,Ge=O.length;ue<Ge;ue++){const He=$(O[ue],q[ue],oe);Me(He.x,He.y,d+ae)}for(let ue=0,Ge=L.length;ue<Ge;ue++){const He=L[ue];ne=j[ue];for(let $e=0,Qe=He.length;$e<Qe;$e++){const R=$(He[$e],ne[$e],oe);_?Me(R.x,R.y+T[h-1].y,T[h-1].x+ae):Me(R.x,R.y,d+ae)}}}ft(),J();function ft(){const te=i.length/3;if(u){let re=0,ae=V*re;for(let oe=0;oe<tt;oe++){const ue=_e[oe];We(ue[2]+ae,ue[1]+ae,ue[0]+ae)}re=h+p*2,ae=V*re;for(let oe=0;oe<tt;oe++){const ue=_e[oe];We(ue[0]+ae,ue[1]+ae,ue[2]+ae)}}else{for(let re=0;re<tt;re++){const ae=_e[re];We(ae[2],ae[1],ae[0])}for(let re=0;re<tt;re++){const ae=_e[re];We(ae[0]+V*h,ae[1]+V*h,ae[2]+V*h)}}n.addGroup(te,i.length/3-te,0)}function J(){const te=i.length/3;let re=0;ee(O,re),re+=O.length;for(let ae=0,oe=L.length;ae<oe;ae++){const ue=L[ae];ee(ue,re),re+=ue.length}n.addGroup(te,i.length/3-te,1)}function ee(te,re){let ae=te.length;for(;--ae>=0;){const oe=ae;let ue=ae-1;ue<0&&(ue=te.length-1);for(let Ge=0,He=h+p*2;Ge<He;Ge++){const $e=V*Ge,Qe=V*(Ge+1),R=re+oe+$e,xt=re+ue+$e,ot=re+ue+Qe,A=re+oe+Qe;Ae(R,xt,ot,A)}}}function Me(te,re,ae){c.push(te),c.push(re),c.push(ae)}function We(te,re,ae){Ke(te),Ke(re),Ke(ae);const oe=i.length/3,ue=M.generateTopUV(n,i,oe-3,oe-2,oe-1);St(ue[0]),St(ue[1]),St(ue[2])}function Ae(te,re,ae,oe){Ke(te),Ke(re),Ke(oe),Ke(re),Ke(ae),Ke(oe);const ue=i.length/3,Ge=M.generateSideWallUV(n,i,ue-6,ue-3,ue-2,ue-1);St(Ge[0]),St(Ge[1]),St(Ge[3]),St(Ge[1]),St(Ge[2]),St(Ge[3])}function Ke(te){i.push(c[te*3+0]),i.push(c[te*3+1]),i.push(c[te*3+2])}function St(te){r.push(te.x),r.push(te.y)}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){const e=super.toJSON(),t=this.parameters.shapes,n=this.parameters.options;return sp(t,n,e)}static fromJSON(e,t){const n=[];for(let r=0,a=e.shapes.length;r<a;r++){const o=t[e.shapes[r]];n.push(o)}const i=e.options.extrudePath;return i!==void 0&&(e.options.extrudePath=new el[i.type]().fromJSON(i)),new Tl(n,e.options)}}const ip={generateTopUV:function(s,e,t,n,i){const r=e[t*3],a=e[t*3+1],o=e[n*3],c=e[n*3+1],l=e[i*3],h=e[i*3+1];return[new ce(r,a),new ce(o,c),new ce(l,h)]},generateSideWallUV:function(s,e,t,n,i,r){const a=e[t*3],o=e[t*3+1],c=e[t*3+2],l=e[n*3],h=e[n*3+1],d=e[n*3+2],u=e[i*3],f=e[i*3+1],g=e[i*3+2],S=e[r*3],p=e[r*3+1],m=e[r*3+2];return Math.abs(o-h)<Math.abs(a-l)?[new ce(a,1-c),new ce(l,1-d),new ce(u,1-g),new ce(S,1-m)]:[new ce(o,1-c),new ce(h,1-d),new ce(f,1-g),new ce(p,1-m)]}};function sp(s,e,t){if(t.shapes=[],Array.isArray(s))for(let n=0,i=s.length;n<i;n++){const r=s[n];t.shapes.push(r.uuid)}else t.shapes.push(s.uuid);return t.options=Object.assign({},e),e.extrudePath!==void 0&&(t.options.extrudePath=e.extrudePath.toJSON()),t}class Al extends bl{constructor(e=1,t=0){const n=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],i=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(n,i,e,t),this.type="OctahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new Al(e.radius,e.detail)}}class on extends Bt{constructor(e=1,t=1,n=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:i};const r=e/2,a=t/2,o=Math.floor(n),c=Math.floor(i),l=o+1,h=c+1,d=e/o,u=t/c,f=[],g=[],S=[],p=[];for(let m=0;m<h;m++){const M=m*u-a;for(let T=0;T<l;T++){const _=T*d-r;g.push(_,-M,0),S.push(0,0,1),p.push(T/o),p.push(1-m/c)}}for(let m=0;m<c;m++)for(let M=0;M<o;M++){const T=M+l*m,_=M+l*(m+1),b=M+1+l*(m+1),E=M+1+l*m;f.push(T,_,E),f.push(_,b,E)}this.setIndex(f),this.setAttribute("position",new dt(g,3)),this.setAttribute("normal",new dt(S,3)),this.setAttribute("uv",new dt(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new on(e.width,e.height,e.widthSegments,e.heightSegments)}}class Cl extends Bt{constructor(e=.5,t=1,n=32,i=1,r=0,a=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:t,thetaSegments:n,phiSegments:i,thetaStart:r,thetaLength:a},n=Math.max(3,n),i=Math.max(1,i);const o=[],c=[],l=[],h=[];let d=e;const u=(t-e)/i,f=new I,g=new ce;for(let S=0;S<=i;S++){for(let p=0;p<=n;p++){const m=r+p/n*a;f.x=d*Math.cos(m),f.y=d*Math.sin(m),c.push(f.x,f.y,f.z),l.push(0,0,1),g.x=(f.x/t+1)/2,g.y=(f.y/t+1)/2,h.push(g.x,g.y)}d+=u}for(let S=0;S<i;S++){const p=S*(n+1);for(let m=0;m<n;m++){const M=m+p,T=M,_=M+n+1,b=M+n+2,E=M+1;o.push(T,_,E),o.push(_,b,E)}}this.setIndex(o),this.setAttribute("position",new dt(c,3)),this.setAttribute("normal",new dt(l,3)),this.setAttribute("uv",new dt(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Cl(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}}class oa extends Bt{constructor(e=new qs([new ce(0,.5),new ce(-.5,-.5),new ce(.5,-.5)]),t=12){super(),this.type="ShapeGeometry",this.parameters={shapes:e,curveSegments:t};const n=[],i=[],r=[],a=[];let o=0,c=0;if(Array.isArray(e)===!1)l(e);else for(let h=0;h<e.length;h++)l(e[h]),this.addGroup(o,c,h),o+=c,c=0;this.setIndex(n),this.setAttribute("position",new dt(i,3)),this.setAttribute("normal",new dt(r,3)),this.setAttribute("uv",new dt(a,2));function l(h){const d=i.length/3,u=h.extractPoints(t);let f=u.shape;const g=u.holes;ti.isClockWise(f)===!1&&(f=f.reverse());for(let p=0,m=g.length;p<m;p++){const M=g[p];ti.isClockWise(M)===!0&&(g[p]=M.reverse())}const S=ti.triangulateShape(f,g);for(let p=0,m=g.length;p<m;p++){const M=g[p];f=f.concat(M)}for(let p=0,m=f.length;p<m;p++){const M=f[p];i.push(M.x,M.y,0),r.push(0,0,1),a.push(M.x,M.y)}for(let p=0,m=S.length;p<m;p++){const M=S[p],T=M[0]+d,_=M[1]+d,b=M[2]+d;n.push(T,_,b),c+=3}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){const e=super.toJSON(),t=this.parameters.shapes;return rp(t,e)}static fromJSON(e,t){const n=[];for(let i=0,r=e.shapes.length;i<r;i++){const a=t[e.shapes[i]];n.push(a)}return new oa(n,e.curveSegments)}}function rp(s,e){if(e.shapes=[],Array.isArray(s))for(let t=0,n=s.length;t<n;t++){const i=s[t];e.shapes.push(i.uuid)}else e.shapes.push(s.uuid);return e}class Re extends Bt{constructor(e=1,t=32,n=16,i=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:i,phiLength:r,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));const c=Math.min(a+o,Math.PI);let l=0;const h=[],d=new I,u=new I,f=[],g=[],S=[],p=[];for(let m=0;m<=n;m++){const M=[],T=m/n,_=a+T*o,b=e*Math.cos(_),E=Math.sqrt(e*e-b*b);let P=0;m===0&&a===0?P=.5/t:m===n&&c===Math.PI&&(P=-.5/t);for(let x=0;x<=t;x++){const w=x/t,C=i+w*r;d.x=-E*Math.cos(C),d.y=b,d.z=E*Math.sin(C),g.push(d.x,d.y,d.z),u.copy(d).normalize(),S.push(u.x,u.y,u.z),p.push(w+P,1-T),M.push(l++)}h.push(M)}for(let m=0;m<n;m++)for(let M=0;M<t;M++){const T=h[m][M+1],_=h[m][M],b=h[m+1][M],E=h[m+1][M+1];(m!==0||a>0)&&f.push(T,_,E),(m!==n-1||c<Math.PI)&&f.push(_,b,E)}this.setIndex(f),this.setAttribute("position",new dt(g,3)),this.setAttribute("normal",new dt(S,3)),this.setAttribute("uv",new dt(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Re(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class Nt extends Bt{constructor(e=1,t=.4,n=12,i=48,r=Math.PI*2,a=0,o=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:i,arc:r,thetaStart:a,thetaLength:o},n=Math.floor(n),i=Math.floor(i);const c=[],l=[],h=[],d=[],u=new I,f=new I,g=new I;for(let S=0;S<=n;S++){const p=a+S/n*o;for(let m=0;m<=i;m++){const M=m/i*r;f.x=(e+t*Math.cos(p))*Math.cos(M),f.y=(e+t*Math.cos(p))*Math.sin(M),f.z=t*Math.sin(p),l.push(f.x,f.y,f.z),u.x=e*Math.cos(M),u.y=e*Math.sin(M),g.subVectors(f,u).normalize(),h.push(g.x,g.y,g.z),d.push(m/i),d.push(S/n)}}for(let S=1;S<=n;S++)for(let p=1;p<=i;p++){const m=(i+1)*S+p-1,M=(i+1)*(S-1)+p-1,T=(i+1)*(S-1)+p,_=(i+1)*S+p;c.push(m,M,_),c.push(M,T,_)}this.setIndex(c),this.setAttribute("position",new dt(l,3)),this.setAttribute("normal",new dt(h,3)),this.setAttribute("uv",new dt(d,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Nt(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc,e.thetaStart,e.thetaLength)}}function cs(s){const e={};for(const t in s){e[t]={};for(const n in s[t]){const i=s[t][n];if(Fc(i))i.isRenderTargetTexture?(Je("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=i.clone();else if(Array.isArray(i))if(Fc(i[0])){const r=[];for(let a=0,o=i.length;a<o;a++)r[a]=i[a].clone();e[t][n]=r}else e[t][n]=i.slice();else e[t][n]=i}}return e}function sn(s){const e={};for(let t=0;t<s.length;t++){const n=cs(s[t]);for(const i in n)e[i]=n[i]}return e}function Fc(s){return s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)}function ap(s){const e=[];for(let t=0;t<s.length;t++)e.push(s[t].clone());return e}function mu(s){const e=s.getRenderTarget();return e===null?s.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:ut.workingColorSpace}const op={clone:cs,merge:sn};var lp=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,cp=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Rn extends Oi{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=lp,this.fragmentShader=cp,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=cs(e.uniforms),this.uniformsGroups=ap(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const i in this.uniforms){const a=this.uniforms[i].value;a&&a.isTexture?t.uniforms[i]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[i]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[i]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[i]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[i]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[i]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[i]={type:"m4",value:a.toArray()}:t.uniforms[i]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const n={};for(const i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(const n in e.uniforms){const i=e.uniforms[n];switch(this.uniforms[n]={},i.type){case"t":this.uniforms[n].value=t[i.value]||null;break;case"c":this.uniforms[n].value=new qe().setHex(i.value);break;case"v2":this.uniforms[n].value=new ce().fromArray(i.value);break;case"v3":this.uniforms[n].value=new I().fromArray(i.value);break;case"v4":this.uniforms[n].value=new Rt().fromArray(i.value);break;case"m3":this.uniforms[n].value=new et().fromArray(i.value);break;case"m4":this.uniforms[n].value=new Et().fromArray(i.value);break;default:this.uniforms[n].value=i.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(const n in e.extensions)this.extensions[n]=e.extensions[n];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}}class hp extends Rn{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class ri extends Oi{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new qe(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new qe(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Zr,this.normalScale=new ce(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new vi,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class Ps extends Oi{constructor(e){super(),this.isMeshToonMaterial=!0,this.defines={TOON:""},this.type="MeshToonMaterial",this.color=new qe(16777215),this.map=null,this.gradientMap=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new qe(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Zr,this.normalScale=new ce(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.alphaMap=null,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.gradientMap=e.gradientMap,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.alphaMap=e.alphaMap,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}class up extends Oi{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Hd,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class dp extends Oi{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}class Pl extends Ot{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new qe(e),this.intensity=t}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}}class gu extends Pl{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Ot.DEFAULT_UP),this.updateMatrix(),this.groundColor=new qe(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}toJSON(e){const t=super.toJSON(e);return t.object.groundColor=this.groundColor.getHex(),t}}const $a=new Et,Oc=new I,Bc=new I;class vu{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new ce(512,512),this.mapType=pn,this.map=null,this.mapPass=null,this.matrix=new Et,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Ml,this._frameExtents=new ce(1,1),this._viewportCount=1,this._viewports=[new Rt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera;Oc.setFromMatrixPosition(e.matrixWorld),t.position.copy(Oc),Bc.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Bc),t.updateMatrixWorld(),this._updateMatrix(t,this.matrix,this._frustum)}_updateMatrix(e,t,n,i){$a.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),n.setFromProjectionMatrix($a,e.coordinateSystem,e.reversedDepth);const r=this._frameExtents,a=i?i.z/r.x:1,o=i?i.w/r.y:1,c=i?i.x/r.x:0,l=i?i.y/r.y:0;e.coordinateSystem===Vs||e.reversedDepth?t.set(.5*a,0,0,.5*a+c,0,.5*o,0,.5*o+l,0,0,1,0,0,0,0,1):t.set(.5*a,0,0,.5*a+c,0,.5*o,0,.5*o+l,0,0,.5,.5,0,0,0,1),t.multiply($a)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return e.intensity=this.intensity,e.bias=this.bias,e.normalBias=this.normalBias,e.radius=this.radius,e.blurSamples=this.blurSamples,e.mapSize=this.mapSize.toArray(),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const Cr=new I,Pr=new us,Dn=new I;class xu extends Ot{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Et,this.projectionMatrix=new Et,this.projectionMatrixInverse=new Et,this.coordinateSystem=On,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(Cr,Pr,Dn),Dn.x===1&&Dn.y===1&&Dn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Cr,Pr,Dn.set(1,1,1)).invert()}updateWorldMatrix(e,t,n=!1){super.updateWorldMatrix(e,t,n),this.matrixWorld.decompose(Cr,Pr,Dn),Dn.x===1&&Dn.y===1&&Dn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Cr,Pr,Dn.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}}const fi=new I,Hc=new ce,zc=new ce;class cn extends xu{constructor(e=50,t=1,n=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=Zo*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(ba*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Zo*2*Math.atan(Math.tan(ba*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){fi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(fi.x,fi.y).multiplyScalar(-e/fi.z),fi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(fi.x,fi.y).multiplyScalar(-e/fi.z)}getViewSize(e,t){return this.getViewBounds(e,Hc,zc),t.subVectors(zc,Hc)}setViewOffset(e,t,n,i,r,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(ba*.5*this.fov)/this.zoom,n=2*t,i=this.aspect*n,r=-.5*i;const a=this.view;if(this.view!==null&&this.view.enabled){const c=a.fullWidth,l=a.fullHeight;r+=a.offsetX*i/c,t-=a.offsetY*n/l,i*=a.width/c,n*=a.height/l}const o=this.filmOffset;o!==0&&(r+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+i,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}class fp extends vu{constructor(){super(new cn(90,1,.5,500)),this.isPointLightShadow=!0}}class Gc extends Pl{constructor(e,t,n=0,i=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=i,this.shadow=new fp}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}toJSON(e){const t=super.toJSON(e);return t.object.distance=this.distance,t.object.decay=this.decay,t.object.shadow=this.shadow.toJSON(),t}}class Rl extends xu{constructor(e=-1,t=1,n=1,i=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=i,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,i,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2;let r=n-e,a=n+e,o=i+t,c=i-t;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=l*this.view.offsetX,a=r+l*this.view.width,o-=h*this.view.offsetY,c=o-h*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,c,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class pp extends vu{constructor(){super(new Rl(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class ta extends Pl{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Ot.DEFAULT_UP),this.updateMatrix(),this.target=new Ot,this.shadow=new pp}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){const t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}}const ji=-90,Qi=1;class mp extends Ot{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const i=new cn(ji,Qi,e,t);i.layers=this.layers,this.add(i);const r=new cn(ji,Qi,e,t);r.layers=this.layers,this.add(r);const a=new cn(ji,Qi,e,t);a.layers=this.layers,this.add(a);const o=new cn(ji,Qi,e,t);o.layers=this.layers,this.add(o);const c=new cn(ji,Qi,e,t);c.layers=this.layers,this.add(c);const l=new cn(ji,Qi,e,t);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[n,i,r,a,o,c]=t;for(const l of t)this.remove(l);if(e===On)n.up.set(0,1,0),n.lookAt(1,0,0),i.up.set(0,1,0),i.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(e===Vs)n.up.set(0,-1,0),n.lookAt(-1,0,0),i.up.set(0,-1,0),i.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const l of t)this.add(l),l.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:i}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,c,l,h]=this.children,d=e.getRenderTarget(),u=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;const S=n.texture.generateMipmaps;n.texture.generateMipmaps=!1;let p=!1;e.isWebGLRenderer===!0?p=e.state.buffers.depth.getReversed():p=e.reversedDepthBuffer,e.setRenderTarget(n,0,i),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,r),e.setRenderTarget(n,1,i),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(n,2,i),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(n,3,i),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),e.setRenderTarget(n,4,i),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),n.texture.generateMipmaps=S,e.setRenderTarget(n,5,i),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,h),e.setRenderTarget(d,u,f),e.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class gp extends cn{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}const zl=class zl{constructor(e,t,n,i){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,n,i)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let n=0;n<4;n++)this.elements[n]=e[n+t];return this}set(e,t,n,i){const r=this.elements;return r[0]=e,r[2]=t,r[1]=n,r[3]=i,this}};zl.prototype.isMatrix2=!0;let Vc=zl;function Wc(s,e,t,n){const i=vp(n);switch(t){case $h:return s*e;case fl:return s*e/i.components*i.byteLength;case pl:return s*e/i.components*i.byteLength;case Ii:return s*e*2/i.components*i.byteLength;case ml:return s*e*2/i.components*i.byteLength;case Yh:return s*e*3/i.components*i.byteLength;case Sn:return s*e*4/i.components*i.byteLength;case gl:return s*e*4/i.components*i.byteLength;case Hr:case zr:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*8;case Gr:case Vr:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case Mo:case wo:return Math.max(s,16)*Math.max(e,8)/4;case So:case bo:return Math.max(s,8)*Math.max(e,8)/2;case Eo:case To:case Co:case Po:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*8;case Ao:case Yr:case Ro:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case Lo:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case Io:return Math.floor((s+4)/5)*Math.floor((e+3)/4)*16;case Do:return Math.floor((s+4)/5)*Math.floor((e+4)/5)*16;case ko:return Math.floor((s+5)/6)*Math.floor((e+4)/5)*16;case Uo:return Math.floor((s+5)/6)*Math.floor((e+5)/6)*16;case No:return Math.floor((s+7)/8)*Math.floor((e+4)/5)*16;case Fo:return Math.floor((s+7)/8)*Math.floor((e+5)/6)*16;case Oo:return Math.floor((s+7)/8)*Math.floor((e+7)/8)*16;case Bo:return Math.floor((s+9)/10)*Math.floor((e+4)/5)*16;case Ho:return Math.floor((s+9)/10)*Math.floor((e+5)/6)*16;case zo:return Math.floor((s+9)/10)*Math.floor((e+7)/8)*16;case Go:return Math.floor((s+9)/10)*Math.floor((e+9)/10)*16;case Vo:return Math.floor((s+11)/12)*Math.floor((e+9)/10)*16;case Wo:return Math.floor((s+11)/12)*Math.floor((e+11)/12)*16;case Xo:case qo:case Ko:return Math.ceil(s/4)*Math.ceil(e/4)*16;case $o:case Yo:return Math.ceil(s/4)*Math.ceil(e/4)*8;case Jr:case Jo:return Math.ceil(s/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function vp(s){switch(s){case pn:case Wh:return{byteLength:1,components:1};case zs:case Xh:case Gn:return{byteLength:2,components:1};case ul:case dl:return{byteLength:2,components:4};case zn:case hl:case Cn:return{byteLength:4,components:1};case qh:case Kh:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${s}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:cl}}));typeof window<"u"&&(window.__THREE__?Je("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=cl);function _u(){let s=null,e=!1,t=null,n=null;function i(r,a){n=s.requestAnimationFrame(i),t(r,a)}return{start:function(){e!==!0&&t!==null&&s!==null&&(n=s.requestAnimationFrame(i),e=!0)},stop:function(){s!==null&&s.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){s=r}}}function xp(s){const e=new WeakMap;function t(o,c){const l=o.array,h=o.usage,d=l.byteLength,u=s.createBuffer();s.bindBuffer(c,u),s.bufferData(c,l,h),o.onUploadCallback();let f;if(l instanceof Float32Array)f=s.FLOAT;else if(typeof Float16Array<"u"&&l instanceof Float16Array)f=s.HALF_FLOAT;else if(l instanceof Uint16Array)o.isFloat16BufferAttribute?f=s.HALF_FLOAT:f=s.UNSIGNED_SHORT;else if(l instanceof Int16Array)f=s.SHORT;else if(l instanceof Uint32Array)f=s.UNSIGNED_INT;else if(l instanceof Int32Array)f=s.INT;else if(l instanceof Int8Array)f=s.BYTE;else if(l instanceof Uint8Array)f=s.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)f=s.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:u,type:f,bytesPerElement:l.BYTES_PER_ELEMENT,version:o.version,size:d}}function n(o,c,l){const h=c.array,d=c.updateRanges;if(s.bindBuffer(l,o),d.length===0)s.bufferSubData(l,0,h);else{d.sort((f,g)=>f.start-g.start);let u=0;for(let f=1;f<d.length;f++){const g=d[u],S=d[f];S.start<=g.start+g.count+1?g.count=Math.max(g.count,S.start+S.count-g.start):(++u,d[u]=S)}d.length=u+1;for(let f=0,g=d.length;f<g;f++){const S=d[f];s.bufferSubData(l,S.start*h.BYTES_PER_ELEMENT,h,S.start,S.count)}c.clearUpdateRanges()}c.onUploadCallback()}function i(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);const c=e.get(o);c&&(s.deleteBuffer(c.buffer),e.delete(o))}function a(o,c){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const h=e.get(o);(!h||h.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const l=e.get(o);if(l===void 0)e.set(o,t(o,c));else if(l.version<o.version){if(l.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(l.buffer,o,c),l.version=o.version}}return{get:i,remove:r,update:a}}var _p=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,yp=`#ifdef USE_ALPHAHASH
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
#endif`,Sp=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Mp=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,bp=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,wp=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Ep=`#ifdef USE_AOMAP
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
#endif`,Tp=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Ap=`#ifdef USE_BATCHING
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
#endif`,Cp=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Pp=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Rp=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Lp=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Ip=`#ifdef USE_IRIDESCENCE
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
#endif`,Dp=`#ifdef USE_BUMPMAP
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
#endif`,kp=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Up=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Np=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Fp=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Op=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,Bp=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,Hp=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,zp=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
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
#endif`,Gp=`#define PI 3.141592653589793
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
} // validated`,Vp=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Wp=`vec3 transformedNormal = objectNormal;
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
#endif`,Xp=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,qp=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Kp=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,$p=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Yp="gl_FragColor = linearToOutputTexel( gl_FragColor );",Jp=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Zp=`#ifdef USE_ENVMAP
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
#endif`,jp=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,Qp=`#ifdef USE_ENVMAP
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
#endif`,e0=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,t0=`#ifdef USE_ENVMAP
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
#endif`,n0=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,i0=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,s0=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,r0=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,a0=`#ifdef USE_GRADIENTMAP
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
}`,o0=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,l0=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,c0=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,h0=`uniform bool receiveShadow;
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
#include <lightprobes_pars_fragment>`,u0=`#ifdef USE_ENVMAP
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
#endif`,d0=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,f0=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,p0=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,m0=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,g0=`PhysicalMaterial material;
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
#endif`,v0=`uniform sampler2D dfgLUT;
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
}`,x0=`
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
#endif`,_0=`#if defined( RE_IndirectDiffuse )
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
#endif`,y0=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,S0=`#ifdef USE_LIGHT_PROBES_GRID
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
#endif`,M0=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,b0=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,w0=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,E0=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,T0=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,A0=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,C0=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,P0=`#if defined( USE_POINTS_UV )
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
#endif`,R0=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,L0=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,I0=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,D0=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,k0=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,U0=`#ifdef USE_MORPHTARGETS
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
#endif`,N0=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,F0=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,O0=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,B0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,H0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,z0=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,G0=`#ifdef USE_NORMALMAP
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
#endif`,V0=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,W0=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,X0=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,q0=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,K0=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,$0=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,Y0=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,J0=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Z0=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,j0=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Q0=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,em=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,tm=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,nm=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,im=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,sm=`float getShadowMask() {
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
}`,rm=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,am=`#ifdef USE_SKINNING
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
#endif`,om=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,lm=`#ifdef USE_SKINNING
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
#endif`,cm=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,hm=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,um=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,dm=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,fm=`#ifdef USE_TRANSMISSION
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
#endif`,pm=`#ifdef USE_TRANSMISSION
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
#endif`,mm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,gm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,vm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,xm=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const _m=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,ym=`uniform sampler2D t2D;
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
}`,Sm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Mm=`#ifdef ENVMAP_TYPE_CUBE
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
}`,bm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,wm=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Em=`#include <common>
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
}`,Tm=`#if DEPTH_PACKING == 3200
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
}`,Am=`#define DISTANCE
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
}`,Cm=`#define DISTANCE
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
}`,Pm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Rm=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Lm=`uniform float scale;
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
}`,Im=`uniform vec3 diffuse;
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
}`,Dm=`#include <common>
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
}`,km=`uniform vec3 diffuse;
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
}`,Um=`#define LAMBERT
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
}`,Nm=`#define LAMBERT
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
}`,Fm=`#define MATCAP
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
}`,Om=`#define MATCAP
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
}`,Bm=`#define NORMAL
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
}`,Hm=`#define NORMAL
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
}`,zm=`#define PHONG
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
}`,Gm=`#define PHONG
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
}`,Vm=`#define STANDARD
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
}`,Wm=`#define STANDARD
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
}`,Xm=`#define TOON
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
}`,qm=`#define TOON
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
}`,Km=`uniform float size;
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
}`,$m=`uniform vec3 diffuse;
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
}`,Ym=`#include <common>
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
}`,Jm=`uniform vec3 color;
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
}`,Zm=`uniform float rotation;
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
}`,jm=`uniform vec3 diffuse;
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
}`,rt={alphahash_fragment:_p,alphahash_pars_fragment:yp,alphamap_fragment:Sp,alphamap_pars_fragment:Mp,alphatest_fragment:bp,alphatest_pars_fragment:wp,aomap_fragment:Ep,aomap_pars_fragment:Tp,batching_pars_vertex:Ap,batching_vertex:Cp,begin_vertex:Pp,beginnormal_vertex:Rp,bsdfs:Lp,iridescence_fragment:Ip,bumpmap_pars_fragment:Dp,clipping_planes_fragment:kp,clipping_planes_pars_fragment:Up,clipping_planes_pars_vertex:Np,clipping_planes_vertex:Fp,color_fragment:Op,color_pars_fragment:Bp,color_pars_vertex:Hp,color_vertex:zp,common:Gp,cube_uv_reflection_fragment:Vp,defaultnormal_vertex:Wp,displacementmap_pars_vertex:Xp,displacementmap_vertex:qp,emissivemap_fragment:Kp,emissivemap_pars_fragment:$p,colorspace_fragment:Yp,colorspace_pars_fragment:Jp,envmap_fragment:Zp,envmap_common_pars_fragment:jp,envmap_pars_fragment:Qp,envmap_pars_vertex:e0,envmap_physical_pars_fragment:u0,envmap_vertex:t0,fog_vertex:n0,fog_pars_vertex:i0,fog_fragment:s0,fog_pars_fragment:r0,gradientmap_pars_fragment:a0,lightmap_pars_fragment:o0,lights_lambert_fragment:l0,lights_lambert_pars_fragment:c0,lights_pars_begin:h0,lights_toon_fragment:d0,lights_toon_pars_fragment:f0,lights_phong_fragment:p0,lights_phong_pars_fragment:m0,lights_physical_fragment:g0,lights_physical_pars_fragment:v0,lights_fragment_begin:x0,lights_fragment_maps:_0,lights_fragment_end:y0,lightprobes_pars_fragment:S0,logdepthbuf_fragment:M0,logdepthbuf_pars_fragment:b0,logdepthbuf_pars_vertex:w0,logdepthbuf_vertex:E0,map_fragment:T0,map_pars_fragment:A0,map_particle_fragment:C0,map_particle_pars_fragment:P0,metalnessmap_fragment:R0,metalnessmap_pars_fragment:L0,morphinstance_vertex:I0,morphcolor_vertex:D0,morphnormal_vertex:k0,morphtarget_pars_vertex:U0,morphtarget_vertex:N0,normal_fragment_begin:F0,normal_fragment_maps:O0,normal_pars_fragment:B0,normal_pars_vertex:H0,normal_vertex:z0,normalmap_pars_fragment:G0,clearcoat_normal_fragment_begin:V0,clearcoat_normal_fragment_maps:W0,clearcoat_pars_fragment:X0,iridescence_pars_fragment:q0,opaque_fragment:K0,packing:$0,premultiplied_alpha_fragment:Y0,project_vertex:J0,dithering_fragment:Z0,dithering_pars_fragment:j0,roughnessmap_fragment:Q0,roughnessmap_pars_fragment:em,shadowmap_pars_fragment:tm,shadowmap_pars_vertex:nm,shadowmap_vertex:im,shadowmask_pars_fragment:sm,skinbase_vertex:rm,skinning_pars_vertex:am,skinning_vertex:om,skinnormal_vertex:lm,specularmap_fragment:cm,specularmap_pars_fragment:hm,tonemapping_fragment:um,tonemapping_pars_fragment:dm,transmission_fragment:fm,transmission_pars_fragment:pm,uv_pars_fragment:mm,uv_pars_vertex:gm,uv_vertex:vm,worldpos_vertex:xm,background_vert:_m,background_frag:ym,backgroundCube_vert:Sm,backgroundCube_frag:Mm,cube_vert:bm,cube_frag:wm,depth_vert:Em,depth_frag:Tm,distance_vert:Am,distance_frag:Cm,equirect_vert:Pm,equirect_frag:Rm,linedashed_vert:Lm,linedashed_frag:Im,meshbasic_vert:Dm,meshbasic_frag:km,meshlambert_vert:Um,meshlambert_frag:Nm,meshmatcap_vert:Fm,meshmatcap_frag:Om,meshnormal_vert:Bm,meshnormal_frag:Hm,meshphong_vert:zm,meshphong_frag:Gm,meshphysical_vert:Vm,meshphysical_frag:Wm,meshtoon_vert:Xm,meshtoon_frag:qm,points_vert:Km,points_frag:$m,shadow_vert:Ym,shadow_frag:Jm,sprite_vert:Zm,sprite_frag:jm},Se={common:{diffuse:{value:new qe(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new et},alphaMap:{value:null},alphaMapTransform:{value:new et},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new et}},envmap:{envMap:{value:null},envMapRotation:{value:new et},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new et}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new et}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new et},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new et},normalScale:{value:new ce(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new et},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new et}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new et}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new et}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new qe(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new I},probesMax:{value:new I},probesResolution:{value:new I}},points:{diffuse:{value:new qe(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new et},alphaTest:{value:0},uvTransform:{value:new et}},sprite:{diffuse:{value:new qe(16777215)},opacity:{value:1},center:{value:new ce(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new et},alphaMap:{value:null},alphaMapTransform:{value:new et},alphaTest:{value:0}}},Nn={basic:{uniforms:sn([Se.common,Se.specularmap,Se.envmap,Se.aomap,Se.lightmap,Se.fog]),vertexShader:rt.meshbasic_vert,fragmentShader:rt.meshbasic_frag},lambert:{uniforms:sn([Se.common,Se.specularmap,Se.envmap,Se.aomap,Se.lightmap,Se.emissivemap,Se.bumpmap,Se.normalmap,Se.displacementmap,Se.fog,Se.lights,{emissive:{value:new qe(0)},envMapIntensity:{value:1}}]),vertexShader:rt.meshlambert_vert,fragmentShader:rt.meshlambert_frag},phong:{uniforms:sn([Se.common,Se.specularmap,Se.envmap,Se.aomap,Se.lightmap,Se.emissivemap,Se.bumpmap,Se.normalmap,Se.displacementmap,Se.fog,Se.lights,{emissive:{value:new qe(0)},specular:{value:new qe(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:rt.meshphong_vert,fragmentShader:rt.meshphong_frag},standard:{uniforms:sn([Se.common,Se.envmap,Se.aomap,Se.lightmap,Se.emissivemap,Se.bumpmap,Se.normalmap,Se.displacementmap,Se.roughnessmap,Se.metalnessmap,Se.fog,Se.lights,{emissive:{value:new qe(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:rt.meshphysical_vert,fragmentShader:rt.meshphysical_frag},toon:{uniforms:sn([Se.common,Se.aomap,Se.lightmap,Se.emissivemap,Se.bumpmap,Se.normalmap,Se.displacementmap,Se.gradientmap,Se.fog,Se.lights,{emissive:{value:new qe(0)}}]),vertexShader:rt.meshtoon_vert,fragmentShader:rt.meshtoon_frag},matcap:{uniforms:sn([Se.common,Se.bumpmap,Se.normalmap,Se.displacementmap,Se.fog,{matcap:{value:null}}]),vertexShader:rt.meshmatcap_vert,fragmentShader:rt.meshmatcap_frag},points:{uniforms:sn([Se.points,Se.fog]),vertexShader:rt.points_vert,fragmentShader:rt.points_frag},dashed:{uniforms:sn([Se.common,Se.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:rt.linedashed_vert,fragmentShader:rt.linedashed_frag},depth:{uniforms:sn([Se.common,Se.displacementmap]),vertexShader:rt.depth_vert,fragmentShader:rt.depth_frag},normal:{uniforms:sn([Se.common,Se.bumpmap,Se.normalmap,Se.displacementmap,{opacity:{value:1}}]),vertexShader:rt.meshnormal_vert,fragmentShader:rt.meshnormal_frag},sprite:{uniforms:sn([Se.sprite,Se.fog]),vertexShader:rt.sprite_vert,fragmentShader:rt.sprite_frag},background:{uniforms:{uvTransform:{value:new et},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:rt.background_vert,fragmentShader:rt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new et}},vertexShader:rt.backgroundCube_vert,fragmentShader:rt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:rt.cube_vert,fragmentShader:rt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:rt.equirect_vert,fragmentShader:rt.equirect_frag},distance:{uniforms:sn([Se.common,Se.displacementmap,{referencePosition:{value:new I},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:rt.distance_vert,fragmentShader:rt.distance_frag},shadow:{uniforms:sn([Se.lights,Se.fog,{color:{value:new qe(0)},opacity:{value:1}}]),vertexShader:rt.shadow_vert,fragmentShader:rt.shadow_frag}};Nn.physical={uniforms:sn([Nn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new et},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new et},clearcoatNormalScale:{value:new ce(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new et},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new et},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new et},sheen:{value:0},sheenColor:{value:new qe(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new et},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new et},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new et},transmissionSamplerSize:{value:new ce},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new et},attenuationDistance:{value:0},attenuationColor:{value:new qe(0)},specularColor:{value:new qe(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new et},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new et},anisotropyVector:{value:new ce},anisotropyMap:{value:null},anisotropyMapTransform:{value:new et}}]),vertexShader:rt.meshphysical_vert,fragmentShader:rt.meshphysical_frag};const Rr={r:0,b:0,g:0},Qm=new Et,yu=new et;yu.set(-1,0,0,0,1,0,0,0,1);function eg(s,e,t,n,i,r){const a=new qe(0);let o=i===!0?0:1,c,l,h=null,d=0,u=null;function f(M){let T=M.isScene===!0?M.background:null;if(T&&T.isTexture){const _=M.backgroundBlurriness>0;T=e.get(T,_)}return T}function g(M){let T=!1;const _=f(M);_===null?p(a,o):_&&_.isColor&&(p(_,1),T=!0);const b=s.xr.getEnvironmentBlendMode();b==="additive"?t.buffers.color.setClear(0,0,0,1,r):b==="alpha-blend"&&t.buffers.color.setClear(0,0,0,0,r),(s.autoClear||T)&&(t.buffers.depth.setTest(!0),t.buffers.depth.setMask(!0),t.buffers.color.setMask(!0),s.clear(s.autoClearColor,s.autoClearDepth,s.autoClearStencil))}function S(M,T){const _=f(T);_&&(_.isCubeTexture||_.mapping===ra)?(l===void 0&&(l=new je(new Te(1,1,1),new Rn({name:"BackgroundCubeMaterial",uniforms:cs(Nn.backgroundCube.uniforms),vertexShader:Nn.backgroundCube.vertexShader,fragmentShader:Nn.backgroundCube.fragmentShader,side:en,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),l.geometry.deleteAttribute("uv"),l.onBeforeRender=function(b,E,P){this.matrixWorld.copyPosition(P.matrixWorld)},Object.defineProperty(l.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(l)),l.material.uniforms.envMap.value=_,l.material.uniforms.backgroundBlurriness.value=T.backgroundBlurriness,l.material.uniforms.backgroundIntensity.value=T.backgroundIntensity,l.material.uniforms.backgroundRotation.value.setFromMatrix4(Qm.makeRotationFromEuler(T.backgroundRotation)).transpose(),_.isCubeTexture&&_.isRenderTargetTexture===!1&&l.material.uniforms.backgroundRotation.value.premultiply(yu),l.material.toneMapped=ut.getTransfer(_.colorSpace)!==Mt,(h!==_||d!==_.version||u!==s.toneMapping)&&(l.material.needsUpdate=!0,h=_,d=_.version,u=s.toneMapping),l.layers.enableAll(),M.unshift(l,l.geometry,l.material,0,0,null)):_&&_.isTexture&&(c===void 0&&(c=new je(new on(2,2),new Rn({name:"BackgroundMaterial",uniforms:cs(Nn.background.uniforms),vertexShader:Nn.background.vertexShader,fragmentShader:Nn.background.fragmentShader,side:Ri,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(c)),c.material.uniforms.t2D.value=_,c.material.uniforms.backgroundIntensity.value=T.backgroundIntensity,c.material.toneMapped=ut.getTransfer(_.colorSpace)!==Mt,_.matrixAutoUpdate===!0&&_.updateMatrix(),c.material.uniforms.uvTransform.value.copy(_.matrix),(h!==_||d!==_.version||u!==s.toneMapping)&&(c.material.needsUpdate=!0,h=_,d=_.version,u=s.toneMapping),c.layers.enableAll(),M.unshift(c,c.geometry,c.material,0,0,null))}function p(M,T){M.getRGB(Rr,mu(s)),t.buffers.color.setClear(Rr.r,Rr.g,Rr.b,T,r)}function m(){l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return a},setClearColor:function(M,T=1){a.set(M),o=T,p(a,o)},getClearAlpha:function(){return o},setClearAlpha:function(M){o=M,p(a,o)},render:g,addToRenderList:S,dispose:m}}function tg(s,e){const t=s.getParameter(s.MAX_VERTEX_ATTRIBS),n={},i=u(null);let r=i,a=!1;function o(L,N,B,U,O){let $=!1;const V=d(L,U,B,N);r!==V&&(r=V,l(r.object)),$=f(L,U,B,O),$&&g(L,U,B,O),O!==null&&e.update(O,s.ELEMENT_ARRAY_BUFFER),($||a)&&(a=!1,_(L,N,B,U),O!==null&&s.bindBuffer(s.ELEMENT_ARRAY_BUFFER,e.get(O).buffer))}function c(){return s.createVertexArray()}function l(L){return s.bindVertexArray(L)}function h(L){return s.deleteVertexArray(L)}function d(L,N,B,U){const O=U.wireframe===!0;let $=n[N.id];$===void 0&&($={},n[N.id]=$);const V=L.isInstancedMesh===!0?L.id:0;let ie=$[V];ie===void 0&&(ie={},$[V]=ie);let q=ie[B.id];q===void 0&&(q={},ie[B.id]=q);let j=q[O];return j===void 0&&(j=u(c()),q[O]=j),j}function u(L){const N=[],B=[],U=[];for(let O=0;O<t;O++)N[O]=0,B[O]=0,U[O]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:N,enabledAttributes:B,attributeDivisors:U,object:L,attributes:{},index:null}}function f(L,N,B,U){const O=r.attributes,$=N.attributes;let V=0;const ie=B.getAttributes();for(const q in ie)if(ie[q].location>=0){const ne=O[q];let xe=$[q];if(xe===void 0&&(q==="instanceMatrix"&&L.instanceMatrix&&(xe=L.instanceMatrix),q==="instanceColor"&&L.instanceColor&&(xe=L.instanceColor)),ne===void 0||ne.attribute!==xe||xe&&ne.data!==xe.data)return!0;V++}return r.attributesNum!==V||r.index!==U}function g(L,N,B,U){const O={},$=N.attributes;let V=0;const ie=B.getAttributes();for(const q in ie)if(ie[q].location>=0){let ne=$[q];ne===void 0&&(q==="instanceMatrix"&&L.instanceMatrix&&(ne=L.instanceMatrix),q==="instanceColor"&&L.instanceColor&&(ne=L.instanceColor));const xe={};xe.attribute=ne,ne&&ne.data&&(xe.data=ne.data),O[q]=xe,V++}r.attributes=O,r.attributesNum=V,r.index=U}function S(){const L=r.newAttributes;for(let N=0,B=L.length;N<B;N++)L[N]=0}function p(L){m(L,0)}function m(L,N){const B=r.newAttributes,U=r.enabledAttributes,O=r.attributeDivisors;B[L]=1,U[L]===0&&(s.enableVertexAttribArray(L),U[L]=1),O[L]!==N&&(s.vertexAttribDivisor(L,N),O[L]=N)}function M(){const L=r.newAttributes,N=r.enabledAttributes;for(let B=0,U=N.length;B<U;B++)N[B]!==L[B]&&(s.disableVertexAttribArray(B),N[B]=0)}function T(L,N,B,U,O,$,V){V===!0?s.vertexAttribIPointer(L,N,B,O,$):s.vertexAttribPointer(L,N,B,U,O,$)}function _(L,N,B,U){S();const O=U.attributes,$=B.getAttributes(),V=N.defaultAttributeValues;for(const ie in $){const q=$[ie];if(q.location>=0){let j=O[ie];if(j===void 0&&(ie==="instanceMatrix"&&L.instanceMatrix&&(j=L.instanceMatrix),ie==="instanceColor"&&L.instanceColor&&(j=L.instanceColor)),j!==void 0){const ne=j.normalized,xe=j.itemSize,_e=e.get(j);if(_e===void 0)continue;const tt=_e.buffer,Ze=_e.type,ft=_e.bytesPerElement,J=Ze===s.INT||Ze===s.UNSIGNED_INT||j.gpuType===hl;if(j.isInterleavedBufferAttribute){const ee=j.data,Me=ee.stride,We=j.offset;if(ee.isInstancedInterleavedBuffer){for(let Ae=0;Ae<q.locationSize;Ae++)m(q.location+Ae,ee.meshPerAttribute);L.isInstancedMesh!==!0&&U._maxInstanceCount===void 0&&(U._maxInstanceCount=ee.meshPerAttribute*ee.count)}else for(let Ae=0;Ae<q.locationSize;Ae++)p(q.location+Ae);s.bindBuffer(s.ARRAY_BUFFER,tt);for(let Ae=0;Ae<q.locationSize;Ae++)T(q.location+Ae,xe/q.locationSize,Ze,ne,Me*ft,(We+xe/q.locationSize*Ae)*ft,J)}else{if(j.isInstancedBufferAttribute){for(let ee=0;ee<q.locationSize;ee++)m(q.location+ee,j.meshPerAttribute);L.isInstancedMesh!==!0&&U._maxInstanceCount===void 0&&(U._maxInstanceCount=j.meshPerAttribute*j.count)}else for(let ee=0;ee<q.locationSize;ee++)p(q.location+ee);s.bindBuffer(s.ARRAY_BUFFER,tt);for(let ee=0;ee<q.locationSize;ee++)T(q.location+ee,xe/q.locationSize,Ze,ne,xe*ft,xe/q.locationSize*ee*ft,J)}}else if(V!==void 0){const ne=V[ie];if(ne!==void 0)switch(ne.length){case 2:s.vertexAttrib2fv(q.location,ne);break;case 3:s.vertexAttrib3fv(q.location,ne);break;case 4:s.vertexAttrib4fv(q.location,ne);break;default:s.vertexAttrib1fv(q.location,ne)}}}}M()}function b(){w();for(const L in n){const N=n[L];for(const B in N){const U=N[B];for(const O in U){const $=U[O];for(const V in $)h($[V].object),delete $[V];delete U[O]}}delete n[L]}}function E(L){if(n[L.id]===void 0)return;const N=n[L.id];for(const B in N){const U=N[B];for(const O in U){const $=U[O];for(const V in $)h($[V].object),delete $[V];delete U[O]}}delete n[L.id]}function P(L){for(const N in n){const B=n[N];for(const U in B){const O=B[U];if(O[L.id]===void 0)continue;const $=O[L.id];for(const V in $)h($[V].object),delete $[V];delete O[L.id]}}}function x(L){for(const N in n){const B=n[N],U=L.isInstancedMesh===!0?L.id:0,O=B[U];if(O!==void 0){for(const $ in O){const V=O[$];for(const ie in V)h(V[ie].object),delete V[ie];delete O[$]}delete B[U],Object.keys(B).length===0&&delete n[N]}}}function w(){C(),a=!0,r!==i&&(r=i,l(r.object))}function C(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:o,reset:w,resetDefaultState:C,dispose:b,releaseStatesOfGeometry:E,releaseStatesOfObject:x,releaseStatesOfProgram:P,initAttributes:S,enableAttribute:p,disableUnusedAttributes:M}}function ng(s,e,t){let n;function i(c){n=c}function r(c,l){s.drawArrays(n,c,l),t.update(l,n,1)}function a(c,l,h){h!==0&&(s.drawArraysInstanced(n,c,l,h),t.update(l,n,h))}function o(c,l,h){if(h===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,l,0,h);let u=0;for(let f=0;f<h;f++)u+=l[f];t.update(u,n,1)}this.setMode=i,this.render=r,this.renderInstances=a,this.renderMultiDraw=o}function ig(s,e,t,n){let i;function r(){if(i!==void 0)return i;if(e.has("EXT_texture_filter_anisotropic")===!0){const P=e.get("EXT_texture_filter_anisotropic");i=s.getParameter(P.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function a(P){return!(P!==Sn&&n.convert(P)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(P){const x=P===Gn&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(P!==pn&&P!==Cn&&!x&&n.convert(P)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_TYPE))}function c(P){if(P==="highp"){if(s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.HIGH_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.HIGH_FLOAT).precision>0)return"highp";P="mediump"}return P==="mediump"&&s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.MEDIUM_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=t.precision!==void 0?t.precision:"highp";const h=c(l);h!==l&&(Je("WebGLRenderer:",l,"not supported, using",h,"instead."),l=h);const d=t.logarithmicDepthBuffer===!0,u=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control");t.reversedDepthBuffer===!0&&u===!1&&Je("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");const f=s.getParameter(s.MAX_TEXTURE_IMAGE_UNITS),g=s.getParameter(s.MAX_VERTEX_TEXTURE_IMAGE_UNITS),S=s.getParameter(s.MAX_TEXTURE_SIZE),p=s.getParameter(s.MAX_CUBE_MAP_TEXTURE_SIZE),m=s.getParameter(s.MAX_VERTEX_ATTRIBS),M=s.getParameter(s.MAX_VERTEX_UNIFORM_VECTORS),T=s.getParameter(s.MAX_VARYING_VECTORS),_=s.getParameter(s.MAX_FRAGMENT_UNIFORM_VECTORS),b=s.getParameter(s.MAX_SAMPLES),E=s.getParameter(s.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:c,textureFormatReadable:a,textureTypeReadable:o,precision:l,logarithmicDepthBuffer:d,reversedDepthBuffer:u,maxTextures:f,maxVertexTextures:g,maxTextureSize:S,maxCubemapSize:p,maxAttributes:m,maxVertexUniforms:M,maxVaryings:T,maxFragmentUniforms:_,maxSamples:b,samples:E}}function sg(s){const e=this;let t=null,n=0,i=!1,r=!1;const a=new mi,o=new et,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(d,u){const f=d.length!==0||u||n!==0||i;return i=u,n=d.length,f},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(d,u){t=h(d,u,0)},this.setState=function(d,u,f){const g=d.clippingPlanes,S=d.clipIntersection,p=d.clipShadows,m=s.get(d);if(!i||g===null||g.length===0||r&&!p)r?h(null):l();else{const M=r?0:n,T=M*4;let _=m.clippingState||null;c.value=_,_=h(g,u,T,f);for(let b=0;b!==T;++b)_[b]=t[b];m.clippingState=_,this.numIntersection=S?this.numPlanes:0,this.numPlanes+=M}};function l(){c.value!==t&&(c.value=t,c.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function h(d,u,f,g){const S=d!==null?d.length:0;let p=null;if(S!==0){if(p=c.value,g!==!0||p===null){const m=f+S*4,M=u.matrixWorldInverse;o.getNormalMatrix(M),(p===null||p.length<m)&&(p=new Float32Array(m));for(let T=0,_=f;T!==S;++T,_+=4)a.copy(d[T]).applyMatrix4(M,o),a.normal.toArray(p,_),p[_+3]=a.constant}c.value=p,c.needsUpdate=!0}return e.numPlanes=S,e.numIntersection=0,p}}const ss=4,rg=6,ag=20,og=256,bs=new Rl,Xc=new qe;let Ya=null,Ja=0,Za=0,ja=!1;const lg=new I,wi=new I;class qc{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,n=.1,i=100,r={}){const{size:a=256,position:o=lg}=r;Ya=this._renderer.getRenderTarget(),Ja=this._renderer.getActiveCubeFace(),Za=this._renderer.getActiveMipmapLevel(),ja=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);const c=this._allocateTargets();return c.depthBuffer=!0,this._sceneToCubeUV(e,n,i,c,o),t>0&&this._blur(c,0,0,t),this._applyPMREM(c),this._cleanup(c),c}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Yc(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=$c(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(Ya,Ja,Za),this._renderer.xr.enabled=ja,e.scissorTest=!1,es(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Li||e.mapping===os?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Ya=this._renderer.getRenderTarget(),Ja=this._renderer.getActiveCubeFace(),Za=this._renderer.getActiveMipmapLevel(),ja=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:Qt,minFilter:Qt,generateMipmaps:!1,type:Gn,format:Sn,colorSpace:jr,depthBuffer:!1},i=Kc(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Kc(e,t,n);const{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods}=cg(r)),this._blurMaterial=ug(r,e,t),this._ggxMaterial=hg(r,e,t)}return i}_compileMaterial(e){const t=new je(new Bt,e);this._renderer.compile(t,bs)}_sceneToCubeUV(e,t,n,i,r){const c=new cn(90,1,t,n),l=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],d=this._renderer,u=d.autoClear,f=d.toneMapping;d.getClearColor(Xc),d.toneMapping=Bn,d.autoClear=!1,d.state.buffers.depth.getReversed()&&(d.setRenderTarget(i),d.clearDepth(),d.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new je(new Te,new vn({name:"PMREM.Background",side:en,depthWrite:!1,depthTest:!1})));const S=this._backgroundBox,p=S.material;let m=!1;const M=e.background;M?M.isColor&&(p.color.copy(M),e.background=null,m=!0):(p.color.copy(Xc),m=!0);for(let T=0;T<6;T++){const _=T%3;_===0?(c.up.set(0,l[T],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x+h[T],r.y,r.z)):_===1?(c.up.set(0,0,l[T]),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y+h[T],r.z)):(c.up.set(0,l[T],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y,r.z+h[T]));const b=this._cubeSize;es(i,_*b,T>2?b:0,b,b),d.setRenderTarget(i),m&&d.render(S,c),d.render(e,c)}d.toneMapping=f,d.autoClear=u,e.background=M}_textureToCubeUV(e,t){const n=this._renderer,i=e.mapping===Li||e.mapping===os;i?(this._cubemapMaterial===null&&(this._cubemapMaterial=Yc()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=$c());const r=i?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=r;const o=r.uniforms;o.envMap.value=e;const c=this._cubeSize;es(t,0,0,3*c,2*c),n.setRenderTarget(t),n.render(a,bs)}_applyPMREM(e){const t=this._renderer,n=t.autoClear;t.autoClear=!1;const i=this._lodMeshes.length;for(let r=1;r<i;r++)this._applyGGXFilter(e,r-1,r);t.autoClear=n}_applyGGXFilter(e,t,n){const i=this._renderer,r=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[n];o.material=a;const c=a.uniforms,l=n/(this._lodMeshes.length-1),h=t/(this._lodMeshes.length-1),d=Math.sqrt(l*l-h*h),u=l*1.25,f=d*u,{_lodMax:g}=this,S=this._sizeLods[n],p=3*S*(n>g-ss?n-g+ss:0),m=4*(this._cubeSize-S);c.envMap.value=e.texture,c.roughness.value=f,c.mipInt.value=g-t,es(r,p,m,3*S,2*S),i.setRenderTarget(r),i.render(o,bs),c.envMap.value=r.texture,c.roughness.value=0,c.mipInt.value=g-n,es(e,p,m,3*S,2*S),i.setRenderTarget(e),i.render(o,bs)}_blur(e,t,n,i){const r=this._pingPongRenderTarget,a=Math.min(i,Math.PI)/Math.SQRT2;this._blurPass(e,r,t,n,a),this._blurPass(r,e,n,n,a)}_blurPass(e,t,n,i,r){const a=this._renderer,o=this._blurMaterial,c=this._lodMeshes[i];c.material=o;const l=o.uniforms;l.envMap.value=e.texture,l.sigma.value=r,l.mipInt.value=this._lodMax-n;const h=this._sizeLods[i],d=3*h*(i>this._lodMax-ss?i-this._lodMax+ss:0),u=4*(this._cubeSize-h);es(t,d,u,3*h,2*h),a.setRenderTarget(t),a.render(c,bs)}}function cg(s){const e=[],t=[];let n=s;const i=s-ss+1+rg;for(let r=0;r<i;r++){const a=Math.pow(2,n);e.push(a);const o=1/(a-2),c=-o,l=1+o,h=[c,c,l,c,l,l,c,c,l,l,c,l],d=6,u=6,f=3,g=new Float32Array(f*u*d),S=new Float32Array(f*u*d);for(let m=0;m<d;m++){const M=m%3*2/3-1,T=m>2?0:-1,_=[M,T,0,M+2/3,T,0,M+2/3,T+1,0,M,T,0,M+2/3,T+1,0,M,T+1,0];g.set(_,f*u*m);for(let b=0;b<u;b++){const E=h[b*2]*2-1,P=h[b*2+1]*2-1;m===0?wi.set(1,P,E):m===1?wi.set(-E,1,-P):m===2?wi.set(-E,P,1):m===3?wi.set(-1,P,-E):m===4?wi.set(-E,-1,P):wi.set(E,P,-1),wi.toArray(S,(m*u+b)*f)}}const p=new Bt;p.setAttribute("position",new gn(g,f)),p.setAttribute("outputDirection",new gn(S,f)),t.push(new je(p,null)),n>ss&&n--}return{lodMeshes:t,sizeLods:e}}function Kc(s,e,t){const n=new Pn(s,e,t);return n.texture.mapping=ra,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function es(s,e,t,n,i){s.viewport.set(e,t,n,i),s.scissor.set(e,t,n,i)}function hg(s,e,t){return new Rn({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:og,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:la(),fragmentShader:`

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
		`,blending:ni,depthTest:!1,depthWrite:!1})}function ug(s,e,t){return new Rn({name:"SphericalGaussianBlur",defines:{SAMPLES:ag,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},sigma:{value:0},mipInt:{value:0}},vertexShader:la(),fragmentShader:`

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
		`,blending:ni,depthTest:!1,depthWrite:!1})}function $c(){return new Rn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:la(),fragmentShader:`

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
		`,blending:ni,depthTest:!1,depthWrite:!1})}function Yc(){return new Rn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:la(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:ni,depthTest:!1,depthWrite:!1})}function la(){return`

		precision mediump float;
		precision mediump int;

		attribute vec3 outputDirection;

		varying vec3 vOutputDirection;

		void main() {

			vOutputDirection = outputDirection;
			gl_Position = vec4( position, 1.0 );

		}
	`}class Su extends Pn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const n={width:e,height:e,depth:1},i=[n,n,n,n,n,n];this.texture=new su(i),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},i=new Te(5,5,5),r=new Rn({name:"CubemapFromEquirect",uniforms:cs(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:en,blending:ni});r.uniforms.tEquirect.value=t;const a=new je(i,r),o=t.minFilter;return t.minFilter===Ai&&(t.minFilter=Qt),new mp(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,i=!0){const r=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,n,i);e.setRenderTarget(r)}}function dg(s){let e=new WeakMap,t=new WeakMap,n=null;function i(u,f=!1){return u==null?null:f?a(u):r(u)}function r(u){if(u&&u.isTexture){const f=u.mapping;if(f===_a||f===ya)if(e.has(u)){const g=e.get(u).texture;return o(g,u.mapping)}else{const g=u.image;if(g&&g.height>0){const S=new Su(g.height);return S.fromEquirectangularTexture(s,u),e.set(u,S),u.addEventListener("dispose",l),o(S.texture,u.mapping)}else return null}}return u}function a(u){if(u&&u.isTexture){const f=u.mapping,g=f===_a||f===ya,S=f===Li||f===os;if(g||S){let p=t.get(u);const m=p!==void 0?p.texture.pmremVersion:0;if(u.isRenderTargetTexture&&u.pmremVersion!==m)return n===null&&(n=new qc(s)),p=g?n.fromEquirectangular(u,p):n.fromCubemap(u,p),p.texture.pmremVersion=u.pmremVersion,t.set(u,p),p.texture;if(p!==void 0)return p.texture;{const M=u.image;return g&&M&&M.height>0||S&&M&&c(M)?(n===null&&(n=new qc(s)),p=g?n.fromEquirectangular(u):n.fromCubemap(u),p.texture.pmremVersion=u.pmremVersion,t.set(u,p),u.addEventListener("dispose",h),p.texture):null}}}return u}function o(u,f){return f===_a?u.mapping=Li:f===ya&&(u.mapping=os),u}function c(u){let f=0;const g=6;for(let S=0;S<g;S++)u[S]!==void 0&&f++;return f===g}function l(u){const f=u.target;f.removeEventListener("dispose",l);const g=e.get(f);g!==void 0&&(e.delete(f),g.dispose())}function h(u){const f=u.target;f.removeEventListener("dispose",h);const g=t.get(f);g!==void 0&&(t.delete(f),g.dispose())}function d(){e=new WeakMap,t=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:i,dispose:d}}function fg(s){const e={};function t(n){if(e[n]!==void 0)return e[n];const i=s.getExtension(n);return e[n]=i,i}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){const i=t(n);return i===null&&rs("WebGLRenderer: "+n+" extension not supported."),i}}}function pg(s,e,t,n){const i={},r=new WeakMap;function a(d){const u=d.target;u.index!==null&&e.remove(u.index);for(const g in u.attributes)e.remove(u.attributes[g]);u.removeEventListener("dispose",a),delete i[u.id];const f=r.get(u);f&&(e.remove(f),r.delete(u)),n.releaseStatesOfGeometry(u),u.isInstancedBufferGeometry===!0&&delete u._maxInstanceCount,t.memory.geometries--}function o(d,u){return i[u.id]===!0||(u.addEventListener("dispose",a),i[u.id]=!0,t.memory.geometries++),u}function c(d){const u=d.attributes;for(const f in u)e.update(u[f],s.ARRAY_BUFFER)}function l(d){const u=[],f=d.index,g=d.attributes.position;let S=0;if(g===void 0)return;if(f!==null){const M=f.array;S=f.version;for(let T=0,_=M.length;T<_;T+=3){const b=M[T+0],E=M[T+1],P=M[T+2];u.push(b,E,E,P,P,b)}}else{const M=g.array;S=g.version;for(let T=0,_=M.length/3-1;T<_;T+=3){const b=T+0,E=T+1,P=T+2;u.push(b,E,E,P,P,b)}}const p=new(g.count>=65535?nu:tu)(u,1);p.version=S;const m=r.get(d);m&&e.remove(m),r.set(d,p)}function h(d){const u=r.get(d);if(u){const f=d.index;f!==null&&u.version<f.version&&l(d)}else l(d);return r.get(d)}return{get:o,update:c,getWireframeAttribute:h}}function mg(s,e,t){let n;function i(d){n=d}let r,a;function o(d){r=d.type,a=d.bytesPerElement}function c(d,u){s.drawElements(n,u,r,d*a),t.update(u,n,1)}function l(d,u,f){f!==0&&(s.drawElementsInstanced(n,u,r,d*a,f),t.update(u,n,f))}function h(d,u,f){if(f===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,u,0,r,d,0,f);let S=0;for(let p=0;p<f;p++)S+=u[p];t.update(S,n,1)}this.setMode=i,this.setIndex=o,this.render=c,this.renderInstances=l,this.renderMultiDraw=h}function gg(s){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(t.calls++,a){case s.TRIANGLES:t.triangles+=o*(r/3);break;case s.LINES:t.lines+=o*(r/2);break;case s.LINE_STRIP:t.lines+=o*(r-1);break;case s.LINE_LOOP:t.lines+=o*r;break;case s.POINTS:t.points+=o*r;break;default:vt("WebGLInfo: Unknown draw mode:",a);break}}function i(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:i,update:n}}function vg(s,e,t){const n=new WeakMap,i=new Rt;function r(a,o,c){const l=a.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,d=h!==void 0?h.length:0;let u=n.get(o);if(u===void 0||u.count!==d){let C=function(){x.dispose(),n.delete(o),o.removeEventListener("dispose",C)};var f=C;u!==void 0&&u.texture.dispose();const g=o.morphAttributes.position!==void 0,S=o.morphAttributes.normal!==void 0,p=o.morphAttributes.color!==void 0,m=o.morphAttributes.position||[],M=o.morphAttributes.normal||[],T=o.morphAttributes.color||[];let _=0;g===!0&&(_=1),S===!0&&(_=2),p===!0&&(_=3);let b=o.attributes.position.count*_,E=1;b>e.maxTextureSize&&(E=Math.ceil(b/e.maxTextureSize),b=e.maxTextureSize);const P=new Float32Array(b*E*4*d),x=new Zh(P,b,E,d);x.type=Cn,x.needsUpdate=!0;const w=_*4;for(let L=0;L<d;L++){const N=m[L],B=M[L],U=T[L],O=b*E*4*L;for(let $=0;$<N.count;$++){const V=$*w;g===!0&&(i.fromBufferAttribute(N,$),P[O+V+0]=i.x,P[O+V+1]=i.y,P[O+V+2]=i.z,P[O+V+3]=0),S===!0&&(i.fromBufferAttribute(B,$),P[O+V+4]=i.x,P[O+V+5]=i.y,P[O+V+6]=i.z,P[O+V+7]=0),p===!0&&(i.fromBufferAttribute(U,$),P[O+V+8]=i.x,P[O+V+9]=i.y,P[O+V+10]=i.z,P[O+V+11]=U.itemSize===4?i.w:1)}}u={count:d,texture:x,size:new ce(b,E)},n.set(o,u),o.addEventListener("dispose",C)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)c.getUniforms().setValue(s,"morphTexture",a.morphTexture,t);else{let g=0;for(let p=0;p<l.length;p++)g+=l[p];const S=o.morphTargetsRelative?1:1-g;c.getUniforms().setValue(s,"morphTargetBaseInfluence",S),c.getUniforms().setValue(s,"morphTargetInfluences",l)}c.getUniforms().setValue(s,"morphTargetsTexture",u.texture,t),c.getUniforms().setValue(s,"morphTargetsTextureSize",u.size)}return{update:r}}function xg(s,e,t,n,i){let r=new WeakMap;function a(l){const h=i.render.frame,d=l.geometry,u=e.get(l,d);if(r.get(u)!==h&&(e.update(u),r.set(u,h)),l.isInstancedMesh&&(l.hasEventListener("dispose",c)===!1&&l.addEventListener("dispose",c),r.get(l)!==h&&(t.update(l.instanceMatrix,s.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,s.ARRAY_BUFFER),r.set(l,h))),l.isSkinnedMesh){const f=l.skeleton;r.get(f)!==h&&(f.update(),r.set(f,h))}return u}function o(){r=new WeakMap}function c(l){const h=l.target;h.removeEventListener("dispose",c),n.releaseStatesOfObject(h),t.remove(h.instanceMatrix),h.instanceColor!==null&&t.remove(h.instanceColor)}return{update:a,dispose:o}}const _g={[Fh]:"LINEAR_TONE_MAPPING",[Oh]:"REINHARD_TONE_MAPPING",[Bh]:"CINEON_TONE_MAPPING",[sa]:"ACES_FILMIC_TONE_MAPPING",[zh]:"AGX_TONE_MAPPING",[Gh]:"NEUTRAL_TONE_MAPPING",[Hh]:"CUSTOM_TONE_MAPPING"};function yg(s,e,t,n,i,r){const a=new Pn(e,t,{type:s,depthBuffer:i,stencilBuffer:r,samples:n?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1});let o=null,c=null;const l=new Bt;l.setAttribute("position",new dt([-1,3,0,-1,-1,0,3,-1,0],3)),l.setAttribute("uv",new dt([0,2,0,0,2,0],2));const h=new hp({uniforms:{tDiffuse:{value:null}},vertexShader:`
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
			}`,depthTest:!1,depthWrite:!1}),d=new je(l,h),u=new Rl(-1,1,1,-1,0,1);let f=null,g=null,S=!1,p,m=null,M=[],T=!1;this.setSize=function(_,b){a.setSize(_,b),o!==null&&o.setSize(_,b),c!==null&&c.setSize(_,b);for(let E=0;E<M.length;E++){const P=M[E];P.setSize&&P.setSize(_,b)}},this.setEffects=function(_){M=_,T=M.length>0&&M[0].isRenderPass===!0;const b=a.width,E=a.height;M.length>0&&o===null&&(o=new Pn(b,E,{type:Gn,depthBuffer:!1,stencilBuffer:!1}),c=new Pn(b,E,{type:Gn,depthBuffer:!1,stencilBuffer:!1}));for(let P=0;P<M.length;P++){const x=M[P];x.setSize&&x.setSize(b,E)}},this.begin=function(_,b){if(S||_.toneMapping===Bn&&M.length===0)return!1;if(m=b,b!==null){const E=b.width,P=b.height;(a.width!==E||a.height!==P)&&this.setSize(E,P)}return T===!1&&_.setRenderTarget(a),p=_.toneMapping,_.toneMapping=Bn,!0},this.hasRenderPass=function(){return T},this.end=function(_,b){_.toneMapping=p,S=!0;let E=a,P=o;for(let x=0;x<M.length;x++){const w=M[x];w.enabled!==!1&&(w.render(_,P,E,b),w.needsSwap!==!1&&(E=P,P=P===o?c:o))}if(f!==_.outputColorSpace||g!==_.toneMapping){f=_.outputColorSpace,g=_.toneMapping,h.defines={},ut.getTransfer(f)===Mt&&(h.defines.SRGB_TRANSFER="");const x=_g[g];x&&(h.defines[x]=""),h.needsUpdate=!0}h.uniforms.tDiffuse.value=E.texture,_.setRenderTarget(m),_.render(d,u),m=null,S=!1},this.isCompositing=function(){return S},this.dispose=function(){a.dispose(),o!==null&&o.dispose(),c!==null&&c.dispose(),l.dispose(),h.dispose()}}const Mu=new tn,il=new Xs(1,1),bu=new Zh,wu=new lf,Eu=new su,Jc=[],Zc=[],jc=new Float32Array(16),Qc=new Float32Array(9),eh=new Float32Array(4);function fs(s,e,t){const n=s[0];if(n<=0||n>0)return s;const i=e*t;let r=Jc[i];if(r===void 0&&(r=new Float32Array(i),Jc[i]=r),e!==0){n.toArray(r,0);for(let a=1,o=0;a!==e;++a)o+=t,s[a].toArray(r,o)}return r}function Xt(s,e){if(s.length!==e.length)return!1;for(let t=0,n=s.length;t<n;t++)if(s[t]!==e[t])return!1;return!0}function qt(s,e){for(let t=0,n=e.length;t<n;t++)s[t]=e[t]}function ca(s,e){let t=Zc[e];t===void 0&&(t=new Int32Array(e),Zc[e]=t);for(let n=0;n!==e;++n)t[n]=s.allocateTextureUnit();return t}function Sg(s,e){const t=this.cache;t[0]!==e&&(s.uniform1f(this.addr,e),t[0]=e)}function Mg(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Xt(t,e))return;s.uniform2fv(this.addr,e),qt(t,e)}}function bg(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(s.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Xt(t,e))return;s.uniform3fv(this.addr,e),qt(t,e)}}function wg(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Xt(t,e))return;s.uniform4fv(this.addr,e),qt(t,e)}}function Eg(s,e){const t=this.cache,n=e.elements;if(n===void 0){if(Xt(t,e))return;s.uniformMatrix2fv(this.addr,!1,e),qt(t,e)}else{if(Xt(t,n))return;eh.set(n),s.uniformMatrix2fv(this.addr,!1,eh),qt(t,n)}}function Tg(s,e){const t=this.cache,n=e.elements;if(n===void 0){if(Xt(t,e))return;s.uniformMatrix3fv(this.addr,!1,e),qt(t,e)}else{if(Xt(t,n))return;Qc.set(n),s.uniformMatrix3fv(this.addr,!1,Qc),qt(t,n)}}function Ag(s,e){const t=this.cache,n=e.elements;if(n===void 0){if(Xt(t,e))return;s.uniformMatrix4fv(this.addr,!1,e),qt(t,e)}else{if(Xt(t,n))return;jc.set(n),s.uniformMatrix4fv(this.addr,!1,jc),qt(t,n)}}function Cg(s,e){const t=this.cache;t[0]!==e&&(s.uniform1i(this.addr,e),t[0]=e)}function Pg(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Xt(t,e))return;s.uniform2iv(this.addr,e),qt(t,e)}}function Rg(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Xt(t,e))return;s.uniform3iv(this.addr,e),qt(t,e)}}function Lg(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Xt(t,e))return;s.uniform4iv(this.addr,e),qt(t,e)}}function Ig(s,e){const t=this.cache;t[0]!==e&&(s.uniform1ui(this.addr,e),t[0]=e)}function Dg(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Xt(t,e))return;s.uniform2uiv(this.addr,e),qt(t,e)}}function kg(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Xt(t,e))return;s.uniform3uiv(this.addr,e),qt(t,e)}}function Ug(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Xt(t,e))return;s.uniform4uiv(this.addr,e),qt(t,e)}}function Ng(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i);let r;this.type===s.SAMPLER_2D_SHADOW?(il.compareFunction=t.isReversedDepthBuffer()?xl:vl,r=il):r=Mu,t.setTexture2D(e||r,i)}function Fg(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.setTexture3D(e||wu,i)}function Og(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.setTextureCube(e||Eu,i)}function Bg(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.setTexture2DArray(e||bu,i)}function Hg(s){switch(s){case 5126:return Sg;case 35664:return Mg;case 35665:return bg;case 35666:return wg;case 35674:return Eg;case 35675:return Tg;case 35676:return Ag;case 5124:case 35670:return Cg;case 35667:case 35671:return Pg;case 35668:case 35672:return Rg;case 35669:case 35673:return Lg;case 5125:return Ig;case 36294:return Dg;case 36295:return kg;case 36296:return Ug;case 35678:case 36198:case 36298:case 36306:case 35682:return Ng;case 35679:case 36299:case 36307:return Fg;case 35680:case 36300:case 36308:case 36293:return Og;case 36289:case 36303:case 36311:case 36292:return Bg}}function zg(s,e){s.uniform1fv(this.addr,e)}function Gg(s,e){const t=fs(e,this.size,2);s.uniform2fv(this.addr,t)}function Vg(s,e){const t=fs(e,this.size,3);s.uniform3fv(this.addr,t)}function Wg(s,e){const t=fs(e,this.size,4);s.uniform4fv(this.addr,t)}function Xg(s,e){const t=fs(e,this.size,4);s.uniformMatrix2fv(this.addr,!1,t)}function qg(s,e){const t=fs(e,this.size,9);s.uniformMatrix3fv(this.addr,!1,t)}function Kg(s,e){const t=fs(e,this.size,16);s.uniformMatrix4fv(this.addr,!1,t)}function $g(s,e){s.uniform1iv(this.addr,e)}function Yg(s,e){s.uniform2iv(this.addr,e)}function Jg(s,e){s.uniform3iv(this.addr,e)}function Zg(s,e){s.uniform4iv(this.addr,e)}function jg(s,e){s.uniform1uiv(this.addr,e)}function Qg(s,e){s.uniform2uiv(this.addr,e)}function ev(s,e){s.uniform3uiv(this.addr,e)}function tv(s,e){s.uniform4uiv(this.addr,e)}function nv(s,e,t){const n=this.cache,i=e.length,r=ca(t,i);Xt(n,r)||(s.uniform1iv(this.addr,r),qt(n,r));let a;this.type===s.SAMPLER_2D_SHADOW?a=il:a=Mu;for(let o=0;o!==i;++o)t.setTexture2D(e[o]||a,r[o])}function iv(s,e,t){const n=this.cache,i=e.length,r=ca(t,i);Xt(n,r)||(s.uniform1iv(this.addr,r),qt(n,r));for(let a=0;a!==i;++a)t.setTexture3D(e[a]||wu,r[a])}function sv(s,e,t){const n=this.cache,i=e.length,r=ca(t,i);Xt(n,r)||(s.uniform1iv(this.addr,r),qt(n,r));for(let a=0;a!==i;++a)t.setTextureCube(e[a]||Eu,r[a])}function rv(s,e,t){const n=this.cache,i=e.length,r=ca(t,i);Xt(n,r)||(s.uniform1iv(this.addr,r),qt(n,r));for(let a=0;a!==i;++a)t.setTexture2DArray(e[a]||bu,r[a])}function av(s){switch(s){case 5126:return zg;case 35664:return Gg;case 35665:return Vg;case 35666:return Wg;case 35674:return Xg;case 35675:return qg;case 35676:return Kg;case 5124:case 35670:return $g;case 35667:case 35671:return Yg;case 35668:case 35672:return Jg;case 35669:case 35673:return Zg;case 5125:return jg;case 36294:return Qg;case 36295:return ev;case 36296:return tv;case 35678:case 36198:case 36298:case 36306:case 35682:return nv;case 35679:case 36299:case 36307:return iv;case 35680:case 36300:case 36308:case 36293:return sv;case 36289:case 36303:case 36311:case 36292:return rv}}class ov{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=Hg(t.type)}}class lv{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=av(t.type)}}class cv{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){const i=this.seq;for(let r=0,a=i.length;r!==a;++r){const o=i[r];o.setValue(e,t[o.id],n)}}}const Qa=/(\w+)(\])?(\[|\.)?/g;function th(s,e){s.seq.push(e),s.map[e.id]=e}function hv(s,e,t){const n=s.name,i=n.length;for(Qa.lastIndex=0;;){const r=Qa.exec(n),a=Qa.lastIndex;let o=r[1];const c=r[2]==="]",l=r[3];if(c&&(o=o|0),l===void 0||l==="["&&a+2===i){th(t,l===void 0?new ov(o,s,e):new lv(o,s,e));break}else{let d=t.map[o];d===void 0&&(d=new cv(o),th(t,d)),t=d}}}class Wr{constructor(e,t){this.seq=[],this.map={};const n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let a=0;a<n;++a){const o=e.getActiveUniform(t,a),c=e.getUniformLocation(t,o.name);hv(o,c,this)}const i=[],r=[];for(const a of this.seq)a.type===e.SAMPLER_2D_SHADOW||a.type===e.SAMPLER_CUBE_SHADOW||a.type===e.SAMPLER_2D_ARRAY_SHADOW?i.push(a):r.push(a);i.length>0&&(this.seq=i.concat(r))}setValue(e,t,n,i){const r=this.map[t];r!==void 0&&r.setValue(e,n,i)}setOptional(e,t,n){const i=t[n];i!==void 0&&this.setValue(e,n,i)}static upload(e,t,n,i){for(let r=0,a=t.length;r!==a;++r){const o=t[r],c=n[o.id];c.needsUpdate!==!1&&o.setValue(e,c.value,i)}}static seqWithValue(e,t){const n=[];for(let i=0,r=e.length;i!==r;++i){const a=e[i];a.id in t&&n.push(a)}return n}}function nh(s,e,t){const n=s.createShader(e);return s.shaderSource(n,t),s.compileShader(n),n}const uv=37297;let dv=0;function fv(s,e){const t=s.split(`
`),n=[],i=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let a=i;a<r;a++){const o=a+1;n.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return n.join(`
`)}const ih=new et;function pv(s){ut._getMatrix(ih,ut.workingColorSpace,s);const e=`mat3( ${ih.elements.map(t=>t.toFixed(4))} )`;switch(ut.getTransfer(s)){case Qr:return[e,"LinearTransferOETF"];case Mt:return[e,"sRGBTransferOETF"];default:return Je("WebGLProgram: Unsupported color space: ",s),[e,"LinearTransferOETF"]}}function sh(s,e,t){const n=s.getShaderParameter(e,s.COMPILE_STATUS),r=(s.getShaderInfoLog(e)||"").trim();if(n&&r==="")return"";const a=/ERROR: 0:(\d+)/.exec(r);if(a){const o=parseInt(a[1]);return t.toUpperCase()+`

`+r+`

`+fv(s.getShaderSource(e),o)}else return r}function mv(s,e){const t=pv(e);return[`vec4 ${s}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}const gv={[Fh]:"Linear",[Oh]:"Reinhard",[Bh]:"Cineon",[sa]:"ACESFilmic",[zh]:"AgX",[Gh]:"Neutral",[Hh]:"Custom"};function vv(s,e){const t=gv[e];return t===void 0?(Je("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+s+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+s+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const Lr=new I;function xv(){ut.getLuminanceCoefficients(Lr);const s=Lr.x.toFixed(4),e=Lr.y.toFixed(4),t=Lr.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${s}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function _v(s){return[s.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",s.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Rs).join(`
`)}function yv(s){const e=[];for(const t in s){const n=s[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function Sv(s,e){const t={},n=s.getProgramParameter(e,s.ACTIVE_ATTRIBUTES);for(let i=0;i<n;i++){const r=s.getActiveAttrib(e,i),a=r.name;let o=1;r.type===s.FLOAT_MAT2&&(o=2),r.type===s.FLOAT_MAT3&&(o=3),r.type===s.FLOAT_MAT4&&(o=4),t[a]={type:r.type,location:s.getAttribLocation(e,a),locationSize:o}}return t}function Rs(s){return s!==""}function rh(s,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return s.replace(/NUM_SUN_LIGHTS/g,e.numSunLights).replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,e.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function ah(s,e){return s.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const Mv=/^[ \t]*#include +<([\w\d./]+)>/gm;function sl(s){return s.replace(Mv,wv)}const bv=new Map;function wv(s,e){let t=rt[e];if(t===void 0){const n=bv.get(e);if(n!==void 0)t=rt[n],Je('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+e+">")}return sl(t)}const Ev=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function oh(s){return s.replace(Ev,Tv)}function Tv(s,e,t,n){let i="";for(let r=parseInt(e);r<parseInt(t);r++)i+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return i}function lh(s){let e=`precision ${s.precision} float;
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
	`;return s.precision==="highp"?e+=`
#define HIGH_PRECISION`:s.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:s.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}const Av={[Ds]:"SHADOWMAP_TYPE_PCF",[As]:"SHADOWMAP_TYPE_VSM"};function Cv(s){return Av[s.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const Pv={[Li]:"ENVMAP_TYPE_CUBE",[os]:"ENVMAP_TYPE_CUBE",[ra]:"ENVMAP_TYPE_CUBE_UV"};function Rv(s){return s.envMap===!1?"ENVMAP_TYPE_CUBE":Pv[s.envMapMode]||"ENVMAP_TYPE_CUBE"}const Lv={[os]:"ENVMAP_MODE_REFRACTION"};function Iv(s){return s.envMap===!1?"ENVMAP_MODE_REFLECTION":Lv[s.envMapMode]||"ENVMAP_MODE_REFLECTION"}const Dv={[Nh]:"ENVMAP_BLENDING_MULTIPLY",[Fd]:"ENVMAP_BLENDING_MIX",[Od]:"ENVMAP_BLENDING_ADD"};function kv(s){return s.envMap===!1?"ENVMAP_BLENDING_NONE":Dv[s.combine]||"ENVMAP_BLENDING_NONE"}function Uv(s){const e=s.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:n,maxMip:t}}function Nv(s,e,t,n){const i=s.getContext(),r=t.defines;let a=t.vertexShader,o=t.fragmentShader;const c=Cv(t),l=Rv(t),h=Iv(t),d=kv(t),u=Uv(t),f=_v(t),g=yv(r),S=i.createProgram();let p,m,M=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Rs).join(`
`),p.length>0&&(p+=`
`),m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Rs).join(`
`),m.length>0&&(m+=`
`)):(p=[lh(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexNormals?"#define HAS_NORMAL":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Rs).join(`
`),m=[lh(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+l:"",t.envMap?"#define "+h:"",t.envMap?"#define "+d:"",u?"#define CUBEUV_TEXEL_WIDTH "+u.texelWidth:"",u?"#define CUBEUV_TEXEL_HEIGHT "+u.texelHeight:"",u?"#define CUBEUV_MAX_MIP "+u.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.retroreflection?"#define USE_RETROREFLECTION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas||t.batchingColor?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Bn?"#define TONE_MAPPING":"",t.toneMapping!==Bn?rt.tonemapping_pars_fragment:"",t.toneMapping!==Bn?vv("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",rt.colorspace_pars_fragment,mv("linearToOutputTexel",t.outputColorSpace),xv(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Rs).join(`
`)),a=sl(a),a=rh(a,t),a=ah(a,t),o=sl(o),o=rh(o,t),o=ah(o,t),a=oh(a),o=oh(o),t.isRawShaderMaterial!==!0&&(M=`#version 300 es
`,p=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+p,m=["#define varying in",t.glslVersion===oc?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===oc?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+m);const T=M+p+a,_=M+m+o,b=nh(i,i.VERTEX_SHADER,T),E=nh(i,i.FRAGMENT_SHADER,_);i.attachShader(S,b),i.attachShader(S,E),t.index0AttributeName!==void 0?i.bindAttribLocation(S,0,t.index0AttributeName):t.hasPositionAttribute===!0&&i.bindAttribLocation(S,0,"position"),i.linkProgram(S);function P(L){if(s.debug.checkShaderErrors){const N=i.getProgramInfoLog(S)||"",B=i.getShaderInfoLog(b)||"",U=i.getShaderInfoLog(E)||"",O=N.trim(),$=B.trim(),V=U.trim();let ie=!0,q=!0;if(i.getProgramParameter(S,i.LINK_STATUS)===!1)if(ie=!1,typeof s.debug.onShaderError=="function")s.debug.onShaderError(i,S,b,E);else{const j=sh(i,b,"vertex"),ne=sh(i,E,"fragment");vt("WebGLProgram: Shader Error "+i.getError()+" - VALIDATE_STATUS "+i.getProgramParameter(S,i.VALIDATE_STATUS)+`

Material Name: `+L.name+`
Material Type: `+L.type+`

Program Info Log: `+O+`
`+j+`
`+ne)}else O!==""?Je("WebGLProgram: Program Info Log:",O):($===""||V==="")&&(q=!1);q&&(L.diagnostics={runnable:ie,programLog:O,vertexShader:{log:$,prefix:p},fragmentShader:{log:V,prefix:m}})}i.deleteShader(b),i.deleteShader(E),x=new Wr(i,S),w=Sv(i,S)}let x;this.getUniforms=function(){return x===void 0&&P(this),x};let w;this.getAttributes=function(){return w===void 0&&P(this),w};let C=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return C===!1&&(C=i.getProgramParameter(S,uv)),C},this.destroy=function(){n.releaseStatesOfProgram(this),i.deleteProgram(S),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=dv++,this.cacheKey=e,this.usedTimes=1,this.program=S,this.vertexShader=b,this.fragmentShader=E,this}let Fv=0;class Ov{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,n){const i=this._getShaderCacheForMaterial(e);return i.has(t)===!1&&(i.add(t),t.usedTimes++),i.has(n)===!1&&(i.add(n),n.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){const t=this.shaderCache;let n=t.get(e);return n===void 0&&(n=new Bv(e),t.set(e,n)),n}}class Bv{constructor(e){this.id=Fv++,this.code=e,this.usedTimes=0}}function Hv(s){return s===Ii||s===Yr||s===Jr}function zv(s,e,t,n,i,r){const a=new jh,o=new Ov,c=new Set,l=[],h=new Map,d=n.logarithmicDepthBuffer;let u=n.precision;const f={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function g(x){return c.add(x),x===0?"uv":`uv${x}`}function S(x,w,C,L,N,B){const U=L.fog,O=N.geometry,$=x.isMeshStandardMaterial||x.isMeshLambertMaterial||x.isMeshPhongMaterial?L.environment:null,V=x.isMeshStandardMaterial||x.isMeshLambertMaterial&&!x.envMap||x.isMeshPhongMaterial&&!x.envMap,ie=e.get(x.envMap||$,V),q=ie&&ie.mapping===ra?ie.image.height:null,j=f[x.type];x.precision!==null&&(u=n.getMaxPrecision(x.precision),u!==x.precision&&Je("WebGLProgram.getParameters:",x.precision,"not supported, using",u,"instead."));const ne=O.morphAttributes.position||O.morphAttributes.normal||O.morphAttributes.color,xe=ne!==void 0?ne.length:0;let _e=0;O.morphAttributes.position!==void 0&&(_e=1),O.morphAttributes.normal!==void 0&&(_e=2),O.morphAttributes.color!==void 0&&(_e=3);let tt,Ze,ft,J;if(j){const Tt=Nn[j];tt=Tt.vertexShader,Ze=Tt.fragmentShader}else{tt=x.vertexShader,Ze=x.fragmentShader;const Tt=o.getVertexShaderStage(x),_t=o.getFragmentShaderStage(x);o.update(x,Tt,_t),ft=Tt.id,J=_t.id}const ee=s.getRenderTarget(),Me=s.state.buffers.depth.getReversed(),We=N.isInstancedMesh===!0,Ae=N.isBatchedMesh===!0,Ke=!!x.map,St=!!x.matcap,te=!!ie,re=!!x.aoMap,ae=!!x.lightMap,oe=!!x.bumpMap&&x.wireframe===!1,ue=!!x.normalMap,Ge=!!x.displacementMap,He=!!x.emissiveMap,$e=!!x.metalnessMap,Qe=!!x.roughnessMap,R=x.anisotropy>0,xt=x.clearcoat>0,ot=x.dispersion>0,A=x.retroreflectivity>0,v=x.iridescence>0,F=x.sheen>0,G=x.transmission>0,K=R&&!!x.anisotropyMap,le=xt&&!!x.clearcoatMap,he=xt&&!!x.clearcoatNormalMap,Y=xt&&!!x.clearcoatRoughnessMap,Q=v&&!!x.iridescenceMap,pe=v&&!!x.iridescenceThicknessMap,Fe=F&&!!x.sheenColorMap,ye=F&&!!x.sheenRoughnessMap,me=!!x.specularMap,Oe=!!x.specularColorMap,Ve=!!x.specularIntensityMap,nt=G&&!!x.transmissionMap,k=G&&!!x.thicknessMap,ge=!!x.gradientMap,Z=!!x.alphaMap,ve=x.alphaTest>0,Ee=!!x.alphaHash,se=!!x.extensions;let Be=Bn;x.toneMapped&&(ee===null||ee.isXRRenderTarget===!0)&&(Be=s.toneMapping);const ke={shaderID:j,shaderType:x.type,shaderName:x.name,vertexShader:tt,fragmentShader:Ze,defines:x.defines,customVertexShaderID:ft,customFragmentShaderID:J,isRawShaderMaterial:x.isRawShaderMaterial===!0,glslVersion:x.glslVersion,precision:u,batching:Ae,batchingColor:Ae&&N._colorsTexture!==null,instancing:We,instancingColor:We&&N.instanceColor!==null,instancingMorph:We&&N.morphTexture!==null,outputColorSpace:ee===null?s.outputColorSpace:ee.isXRRenderTarget===!0?ee.texture.colorSpace:ut.workingColorSpace,alphaToCoverage:!!x.alphaToCoverage,map:Ke,matcap:St,envMap:te,envMapMode:te&&ie.mapping,envMapCubeUVHeight:q,aoMap:re,lightMap:ae,bumpMap:oe,normalMap:ue,displacementMap:Ge,emissiveMap:He,normalMapObjectSpace:ue&&x.normalMapType===zd,normalMapTangentSpace:ue&&x.normalMapType===Zr,packedNormalMap:ue&&x.normalMapType===Zr&&Hv(x.normalMap.format),metalnessMap:$e,roughnessMap:Qe,anisotropy:R,anisotropyMap:K,clearcoat:xt,clearcoatMap:le,clearcoatNormalMap:he,clearcoatRoughnessMap:Y,dispersion:ot,retroreflection:A,iridescence:v,iridescenceMap:Q,iridescenceThicknessMap:pe,sheen:F,sheenColorMap:Fe,sheenRoughnessMap:ye,specularMap:me,specularColorMap:Oe,specularIntensityMap:Ve,transmission:G,transmissionMap:nt,thicknessMap:k,gradientMap:ge,opaque:x.transparent===!1&&x.blending===ks&&x.alphaToCoverage===!1,alphaMap:Z,alphaTest:ve,alphaHash:Ee,combine:x.combine,mapUv:Ke&&g(x.map.channel),aoMapUv:re&&g(x.aoMap.channel),lightMapUv:ae&&g(x.lightMap.channel),bumpMapUv:oe&&g(x.bumpMap.channel),normalMapUv:ue&&g(x.normalMap.channel),displacementMapUv:Ge&&g(x.displacementMap.channel),emissiveMapUv:He&&g(x.emissiveMap.channel),metalnessMapUv:$e&&g(x.metalnessMap.channel),roughnessMapUv:Qe&&g(x.roughnessMap.channel),anisotropyMapUv:K&&g(x.anisotropyMap.channel),clearcoatMapUv:le&&g(x.clearcoatMap.channel),clearcoatNormalMapUv:he&&g(x.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Y&&g(x.clearcoatRoughnessMap.channel),iridescenceMapUv:Q&&g(x.iridescenceMap.channel),iridescenceThicknessMapUv:pe&&g(x.iridescenceThicknessMap.channel),sheenColorMapUv:Fe&&g(x.sheenColorMap.channel),sheenRoughnessMapUv:ye&&g(x.sheenRoughnessMap.channel),specularMapUv:me&&g(x.specularMap.channel),specularColorMapUv:Oe&&g(x.specularColorMap.channel),specularIntensityMapUv:Ve&&g(x.specularIntensityMap.channel),transmissionMapUv:nt&&g(x.transmissionMap.channel),thicknessMapUv:k&&g(x.thicknessMap.channel),alphaMapUv:Z&&g(x.alphaMap.channel),vertexTangents:!!O.attributes.tangent&&(ue||R),vertexNormals:!!O.attributes.normal,vertexColors:x.vertexColors,vertexAlphas:x.vertexColors===!0&&!!O.attributes.color&&O.attributes.color.itemSize===4,pointsUvs:N.isPoints===!0&&!!O.attributes.uv&&(Ke||Z),fog:!!U,useFog:x.fog===!0,fogExp2:!!U&&U.isFogExp2,flatShading:x.wireframe===!1&&(x.flatShading===!0||O.attributes.normal===void 0&&ue===!1&&(x.isMeshLambertMaterial||x.isMeshPhongMaterial||x.isMeshStandardMaterial||x.isMeshPhysicalMaterial)),sizeAttenuation:x.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:Me,skinning:N.isSkinnedMesh===!0,hasPositionAttribute:O.attributes.position!==void 0,morphTargets:O.morphAttributes.position!==void 0,morphNormals:O.morphAttributes.normal!==void 0,morphColors:O.morphAttributes.color!==void 0,morphTargetsCount:xe,morphTextureStride:_e,numSunLights:w.sun.length,numDirLights:w.directional.length,numPointLights:w.point.length,numSpotLights:w.spot.length,numSpotLightMaps:w.spotLightMap.length,numRectAreaLights:w.rectArea.length,numHemiLights:w.hemi.length,numSunLightShadows:w.sunShadowMap.length,numDirLightShadows:w.directionalShadowMap.length,numPointLightShadows:w.pointShadowMap.length,numSpotLightShadows:w.spotShadowMap.length,numSpotLightShadowsWithMaps:w.numSpotLightShadowsWithMaps,numLightProbes:w.numLightProbes,numLightProbeGrids:B.length,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:x.dithering,shadowMapEnabled:s.shadowMap.enabled&&C.length>0,shadowMapType:s.shadowMap.type,toneMapping:Be,decodeVideoTexture:Ke&&x.map.isVideoTexture===!0&&ut.getTransfer(x.map.colorSpace)===Mt,decodeVideoTextureEmissive:He&&x.emissiveMap.isVideoTexture===!0&&ut.getTransfer(x.emissiveMap.colorSpace)===Mt,premultipliedAlpha:x.premultipliedAlpha,doubleSided:x.side===an,flipSided:x.side===en,useDepthPacking:x.depthPacking>=0,depthPacking:x.depthPacking||0,index0AttributeName:x.index0AttributeName,extensionClipCullDistance:se&&x.extensions.clipCullDistance===!0&&t.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(se&&x.extensions.multiDraw===!0||Ae)&&t.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:t.has("KHR_parallel_shader_compile"),customProgramCacheKey:x.customProgramCacheKey()};return ke.vertexUv1s=c.has(1),ke.vertexUv2s=c.has(2),ke.vertexUv3s=c.has(3),c.clear(),ke}function p(x){const w=[];if(x.shaderID?w.push(x.shaderID):(w.push(x.customVertexShaderID),w.push(x.customFragmentShaderID)),x.defines!==void 0)for(const C in x.defines)w.push(C),w.push(x.defines[C]);return x.isRawShaderMaterial===!1&&(m(w,x),M(w,x),w.push(s.outputColorSpace)),w.push(x.customProgramCacheKey),w.join()}function m(x,w){x.push(w.precision),x.push(w.outputColorSpace),x.push(w.envMapMode),x.push(w.envMapCubeUVHeight),x.push(w.mapUv),x.push(w.alphaMapUv),x.push(w.lightMapUv),x.push(w.aoMapUv),x.push(w.bumpMapUv),x.push(w.normalMapUv),x.push(w.displacementMapUv),x.push(w.emissiveMapUv),x.push(w.metalnessMapUv),x.push(w.roughnessMapUv),x.push(w.anisotropyMapUv),x.push(w.clearcoatMapUv),x.push(w.clearcoatNormalMapUv),x.push(w.clearcoatRoughnessMapUv),x.push(w.iridescenceMapUv),x.push(w.iridescenceThicknessMapUv),x.push(w.sheenColorMapUv),x.push(w.sheenRoughnessMapUv),x.push(w.specularMapUv),x.push(w.specularColorMapUv),x.push(w.specularIntensityMapUv),x.push(w.transmissionMapUv),x.push(w.thicknessMapUv),x.push(w.combine),x.push(w.fogExp2),x.push(w.sizeAttenuation),x.push(w.morphTargetsCount),x.push(w.morphAttributeCount),x.push(w.numSunLights),x.push(w.numDirLights),x.push(w.numPointLights),x.push(w.numSpotLights),x.push(w.numSpotLightMaps),x.push(w.numHemiLights),x.push(w.numRectAreaLights),x.push(w.numSunLightShadows),x.push(w.numDirLightShadows),x.push(w.numPointLightShadows),x.push(w.numSpotLightShadows),x.push(w.numSpotLightShadowsWithMaps),x.push(w.numLightProbes),x.push(w.shadowMapType),x.push(w.toneMapping),x.push(w.numClippingPlanes),x.push(w.numClipIntersection),x.push(w.depthPacking)}function M(x,w){a.disableAll(),w.instancing&&a.enable(0),w.instancingColor&&a.enable(1),w.instancingMorph&&a.enable(2),w.matcap&&a.enable(3),w.envMap&&a.enable(4),w.normalMapObjectSpace&&a.enable(5),w.normalMapTangentSpace&&a.enable(6),w.clearcoat&&a.enable(7),w.iridescence&&a.enable(8),w.alphaTest&&a.enable(9),w.vertexColors&&a.enable(10),w.vertexAlphas&&a.enable(11),w.vertexUv1s&&a.enable(12),w.vertexUv2s&&a.enable(13),w.vertexUv3s&&a.enable(14),w.vertexTangents&&a.enable(15),w.anisotropy&&a.enable(16),w.alphaHash&&a.enable(17),w.batching&&a.enable(18),w.dispersion&&a.enable(19),w.retroreflection&&a.enable(24),w.batchingColor&&a.enable(20),w.gradientMap&&a.enable(21),w.packedNormalMap&&a.enable(22),w.vertexNormals&&a.enable(23),x.push(a.mask),a.disableAll(),w.fog&&a.enable(0),w.useFog&&a.enable(1),w.flatShading&&a.enable(2),w.logarithmicDepthBuffer&&a.enable(3),w.reversedDepthBuffer&&a.enable(4),w.skinning&&a.enable(5),w.morphTargets&&a.enable(6),w.morphNormals&&a.enable(7),w.morphColors&&a.enable(8),w.premultipliedAlpha&&a.enable(9),w.shadowMapEnabled&&a.enable(10),w.doubleSided&&a.enable(11),w.flipSided&&a.enable(12),w.useDepthPacking&&a.enable(13),w.dithering&&a.enable(14),w.transmission&&a.enable(15),w.sheen&&a.enable(16),w.opaque&&a.enable(17),w.pointsUvs&&a.enable(18),w.decodeVideoTexture&&a.enable(19),w.decodeVideoTextureEmissive&&a.enable(20),w.alphaToCoverage&&a.enable(21),w.numLightProbeGrids>0&&a.enable(22),w.hasPositionAttribute&&a.enable(23),x.push(a.mask)}function T(x){const w=f[x.type];let C;if(w){const L=Nn[w];C=op.clone(L.uniforms)}else C=x.uniforms;return C}function _(x,w){let C=h.get(w);return C!==void 0?++C.usedTimes:(C=new Nv(s,w,x,i),l.push(C),h.set(w,C)),C}function b(x){if(--x.usedTimes===0){const w=l.indexOf(x);l[w]=l[l.length-1],l.pop(),h.delete(x.cacheKey),x.destroy()}}function E(x){o.remove(x)}function P(){o.dispose()}return{getParameters:S,getProgramCacheKey:p,getUniforms:T,acquireProgram:_,releaseProgram:b,releaseShaderCache:E,programs:l,dispose:P}}function Gv(){let s=new WeakMap;function e(a){return s.has(a)}function t(a){let o=s.get(a);return o===void 0&&(o={},s.set(a,o)),o}function n(a){s.delete(a)}function i(a,o,c){s.get(a)[o]=c}function r(){s=new WeakMap}return{has:e,get:t,remove:n,update:i,dispose:r}}function Vv(s,e){return s.groupOrder!==e.groupOrder?s.groupOrder-e.groupOrder:s.renderOrder!==e.renderOrder?s.renderOrder-e.renderOrder:s.material.id!==e.material.id?s.material.id-e.material.id:s.materialVariant!==e.materialVariant?s.materialVariant-e.materialVariant:s.z!==e.z?s.z-e.z:s.id-e.id}function ch(s,e){return s.groupOrder!==e.groupOrder?s.groupOrder-e.groupOrder:s.renderOrder!==e.renderOrder?s.renderOrder-e.renderOrder:s.z!==e.z?e.z-s.z:s.id-e.id}function hh(){const s=[];let e=0;const t=[],n=[],i=[];function r(){e=0,t.length=0,n.length=0,i.length=0}function a(u){let f=0;return u.isInstancedMesh&&(f+=2),u.isSkinnedMesh&&(f+=1),f}function o(u,f,g,S,p,m){let M=s[e];return M===void 0?(M={id:u.id,object:u,geometry:f,material:g,materialVariant:a(u),groupOrder:S,renderOrder:u.renderOrder,z:p,group:m},s[e]=M):(M.id=u.id,M.object=u,M.geometry=f,M.material=g,M.materialVariant=a(u),M.groupOrder=S,M.renderOrder=u.renderOrder,M.z=p,M.group=m),e++,M}function c(u,f,g,S,p,m,M){M.reversedDepth===!0&&(p=-p);const T=o(u,f,g,S,p,m);g.transmission>0?n.push(T):g.transparent===!0?i.push(T):t.push(T)}function l(u,f,g,S,p,m){const M=o(u,f,g,S,p,m);g.transmission>0?n.unshift(M):g.transparent===!0?i.unshift(M):t.unshift(M)}function h(u,f){t.length>1&&t.sort(u||Vv),n.length>1&&n.sort(f||ch),i.length>1&&i.sort(f||ch)}function d(){for(let u=e,f=s.length;u<f;u++){const g=s[u];if(g.id===null)break;g.id=null,g.object=null,g.geometry=null,g.material=null,g.group=null}}return{opaque:t,transmissive:n,transparent:i,init:r,push:c,unshift:l,finish:d,sort:h}}function Wv(){let s=new WeakMap;function e(n,i){const r=s.get(n);let a;return r===void 0?(a=new hh,s.set(n,[a])):i>=r.length?(a=new hh,r.push(a)):a=r[i],a}function t(){s=new WeakMap}return{get:e,dispose:t}}function Xv(){const s={};return{get:function(e){if(s[e.id]!==void 0)return s[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={direction:new I,color:new qe};break;case"SpotLight":t={position:new I,direction:new I,color:new qe,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new I,color:new qe,distance:0,decay:0};break;case"HemisphereLight":t={direction:new I,skyColor:new qe,groundColor:new qe};break;case"RectAreaLight":t={color:new qe,position:new I,halfWidth:new I,halfHeight:new I};break}return s[e.id]=t,t}}}function qv(){const s={};return{get:function(e){if(s[e.id]!==void 0)return s[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ce};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ce};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ce,shadowCameraNear:1,shadowCameraFar:1e3};break}return s[e.id]=t,t}}}let Kv=0;function $v(s,e){return(e.castShadow?2:0)-(s.castShadow?2:0)+(e.map?1:0)-(s.map?1:0)}function Yv(s){const e=new Xv,t=qv(),n={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)n.probe.push(new I);const i=new I,r=new Et,a=new Et;function o(l){let h=0,d=0,u=0;for(let N=0;N<9;N++)n.probe[N].set(0,0,0);let f=0,g=0,S=0,p=0,m=0,M=0,T=0,_=0,b=0,E=0,P=0,x=0,w=0,C=0;l.sort($v);for(let N=0,B=l.length;N<B;N++){const U=l[N],O=U.color,$=U.intensity,V=U.distance;let ie=null;if(U.shadow&&U.shadow.map&&(U.shadow.map.texture.format===Ii?ie=U.shadow.map.texture:ie=U.shadow.map.depthTexture||U.shadow.map.texture),U.isAmbientLight)h+=O.r*$,d+=O.g*$,u+=O.b*$;else if(U.isLightProbe){for(let q=0;q<9;q++)n.probe[q].addScaledVector(U.sh.coefficients[q],$);C++}else if(U.isSunLight){const q=e.get(U);if(q.color.copy(U.color).multiplyScalar(U.intensity),U.castShadow){const j=U.shadow,ne=t.get(U);ne.shadowIntensity=j.intensity,ne.shadowBias=j.bias,ne.shadowNormalBias=j.normalBias,ne.shadowRadius=j.radius,ne.shadowMapSize.copy(j.mapSize).multiply(j.getFrameExtents()),n.sunShadow[g]=ne,n.sunShadowMap[g]=ie;const xe=j.getViewportCount();for(let _e=0;_e<xe;_e++)n.sunShadowMatrix[S+_e]=j.getMatrix(_e),n.sunShadowCascade[S+_e]=j._cascadeData[_e];S+=xe,g++}n.sun[f]=q,f++}else if(U.isDirectionalLight){const q=e.get(U);if(q.color.copy(U.color).multiplyScalar(U.intensity),U.castShadow){const j=U.shadow,ne=t.get(U);ne.shadowIntensity=j.intensity,ne.shadowBias=j.bias,ne.shadowNormalBias=j.normalBias,ne.shadowRadius=j.radius,ne.shadowMapSize=j.mapSize,n.directionalShadow[p]=ne,n.directionalShadowMap[p]=ie,n.directionalShadowMatrix[p]=U.shadow.matrix,b++}n.directional[p]=q,p++}else if(U.isSpotLight){const q=e.get(U);q.position.setFromMatrixPosition(U.matrixWorld),q.color.copy(O).multiplyScalar($),q.distance=V,q.coneCos=Math.cos(U.angle),q.penumbraCos=Math.cos(U.angle*(1-U.penumbra)),q.decay=U.decay,n.spot[M]=q;const j=U.shadow;if(U.map&&(n.spotLightMap[x]=U.map,x++,j.updateMatrices(U),U.castShadow&&w++),n.spotLightMatrix[M]=j.matrix,U.castShadow){const ne=t.get(U);ne.shadowIntensity=j.intensity,ne.shadowBias=j.bias,ne.shadowNormalBias=j.normalBias,ne.shadowRadius=j.radius,ne.shadowMapSize=j.mapSize,n.spotShadow[M]=ne,n.spotShadowMap[M]=ie,P++}M++}else if(U.isRectAreaLight){const q=e.get(U);q.color.copy(O).multiplyScalar($),q.halfWidth.set(U.width*.5,0,0),q.halfHeight.set(0,U.height*.5,0),n.rectArea[T]=q,T++}else if(U.isPointLight){const q=e.get(U);if(q.color.copy(U.color).multiplyScalar(U.intensity),q.distance=U.distance,q.decay=U.decay,U.castShadow){const j=U.shadow,ne=t.get(U);ne.shadowIntensity=j.intensity,ne.shadowBias=j.bias,ne.shadowNormalBias=j.normalBias,ne.shadowRadius=j.radius,ne.shadowMapSize=j.mapSize,ne.shadowCameraNear=j.camera.near,ne.shadowCameraFar=j.camera.far,n.pointShadow[m]=ne,n.pointShadowMap[m]=ie,n.pointShadowMatrix[m]=U.shadow.matrix,E++}n.point[m]=q,m++}else if(U.isHemisphereLight){const q=e.get(U);q.skyColor.copy(U.color).multiplyScalar($),q.groundColor.copy(U.groundColor).multiplyScalar($),n.hemi[_]=q,_++}}T>0&&(s.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=Se.LTC_FLOAT_1,n.rectAreaLTC2=Se.LTC_FLOAT_2):(n.rectAreaLTC1=Se.LTC_HALF_1,n.rectAreaLTC2=Se.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=d,n.ambient[2]=u;const L=n.hash;(L.sunLength!==f||L.directionalLength!==p||L.pointLength!==m||L.spotLength!==M||L.rectAreaLength!==T||L.hemiLength!==_||L.numSunShadows!==g||L.numDirectionalShadows!==b||L.numPointShadows!==E||L.numSpotShadows!==P||L.numSpotMaps!==x||L.numLightProbes!==C)&&(n.sun.length=f,n.directional.length=p,n.spot.length=M,n.rectArea.length=T,n.point.length=m,n.hemi.length=_,n.sunShadow.length=g,n.sunShadowMap.length=g,n.sunShadowMatrix.length=S,n.sunShadowCascade.length=S,n.directionalShadow.length=b,n.directionalShadowMap.length=b,n.directionalShadowMatrix.length=b,n.pointShadow.length=E,n.pointShadowMap.length=E,n.pointShadowMatrix.length=E,n.spotShadow.length=P,n.spotShadowMap.length=P,n.spotLightMatrix.length=P+x-w,n.spotLightMap.length=x,n.numSpotLightShadowsWithMaps=w,n.numLightProbes=C,L.sunLength=f,L.directionalLength=p,L.pointLength=m,L.spotLength=M,L.rectAreaLength=T,L.hemiLength=_,L.numSunShadows=g,L.numDirectionalShadows=b,L.numPointShadows=E,L.numSpotShadows=P,L.numSpotMaps=x,L.numLightProbes=C,n.version=Kv++)}function c(l,h){let d=0,u=0,f=0,g=0,S=0,p=0;const m=h.matrixWorldInverse;for(let M=0,T=l.length;M<T;M++){const _=l[M];if(_.isSunLight){const b=n.sun[d];b.direction.setFromMatrixPosition(_.matrixWorld),b.direction.transformDirection(m),d++}else if(_.isDirectionalLight){const b=n.directional[u];b.direction.setFromMatrixPosition(_.matrixWorld),i.setFromMatrixPosition(_.target.matrixWorld),b.direction.sub(i),b.direction.transformDirection(m),u++}else if(_.isSpotLight){const b=n.spot[g];b.position.setFromMatrixPosition(_.matrixWorld),b.position.applyMatrix4(m),b.direction.setFromMatrixPosition(_.matrixWorld),i.setFromMatrixPosition(_.target.matrixWorld),b.direction.sub(i),b.direction.transformDirection(m),g++}else if(_.isRectAreaLight){const b=n.rectArea[S];b.position.setFromMatrixPosition(_.matrixWorld),b.position.applyMatrix4(m),a.identity(),r.copy(_.matrixWorld),r.premultiply(m),a.extractRotation(r),b.halfWidth.set(_.width*.5,0,0),b.halfHeight.set(0,_.height*.5,0),b.halfWidth.applyMatrix4(a),b.halfHeight.applyMatrix4(a),S++}else if(_.isPointLight){const b=n.point[f];b.position.setFromMatrixPosition(_.matrixWorld),b.position.applyMatrix4(m),f++}else if(_.isHemisphereLight){const b=n.hemi[p];b.direction.setFromMatrixPosition(_.matrixWorld),b.direction.transformDirection(m),p++}}}return{setup:o,setupView:c,state:n}}function uh(s){const e=new Yv(s),t=[],n=[],i=[];function r(u){d.camera=u,t.length=0,n.length=0,i.length=0}function a(u){t.push(u)}function o(u){n.push(u)}function c(u){i.push(u)}function l(){e.setup(t)}function h(u){e.setupView(t,u)}const d={lightsArray:t,shadowsArray:n,lightProbeGridArray:i,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return{init:r,state:d,setupLights:l,setupLightsView:h,pushLight:a,pushShadow:o,pushLightProbeGrid:c}}function Jv(s){let e=new WeakMap;function t(i,r=0){const a=e.get(i);let o;return a===void 0?(o=new uh(s),e.set(i,[o])):r>=a.length?(o=new uh(s),a.push(o)):o=a[r],o}function n(){e=new WeakMap}return{get:t,dispose:n}}const Zv=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,jv=`uniform sampler2D shadow_pass;
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
}`,Qv=[new I(1,0,0),new I(-1,0,0),new I(0,1,0),new I(0,-1,0),new I(0,0,1),new I(0,0,-1)],e1=[new I(0,-1,0),new I(0,-1,0),new I(0,0,1),new I(0,0,-1),new I(0,-1,0),new I(0,-1,0)],dh=new Et,ws=new I,eo=new I;function t1(s,e,t){let n=new Ml;const i=new ce,r=new ce,a=new Rt,o=new up,c=new dp,l={},h=t.maxTextureSize,d={[Ri]:en,[en]:Ri,[an]:an},u=new Rn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ce},radius:{value:4}},vertexShader:Zv,fragmentShader:jv}),f=u.clone();f.defines.HORIZONTAL_PASS=1;const g=new Bt;g.setAttribute("position",new gn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const S=new je(g,u),p=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Ds;let m=this.type;this.render=function(E,P,x){if(p.enabled===!1||p.autoUpdate===!1&&p.needsUpdate===!1||E.length===0)return;this.type===xd&&(Je("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=Ds);const w=s.getRenderTarget(),C=s.getActiveCubeFace(),L=s.getActiveMipmapLevel(),N=s.state;N.setBlending(ni),N.buffers.depth.getReversed()===!0?N.buffers.color.setClear(0,0,0,0):N.buffers.color.setClear(1,1,1,1),N.buffers.depth.setTest(!0),N.setScissorTest(!1);const B=m!==this.type;B&&P.traverse(function(U){U.material&&(Array.isArray(U.material)?U.material.forEach(O=>O.needsUpdate=!0):U.material.needsUpdate=!0)});for(let U=0,O=E.length;U<O;U++){const $=E[U],V=$.shadow;if(V===void 0){Je("WebGLShadowMap:",$,"has no shadow.");continue}if(V.autoUpdate===!1&&V.needsUpdate===!1)continue;i.copy(V.mapSize);const ie=V.getFrameExtents();i.multiply(ie),r.copy(V.mapSize),(i.x>h||i.y>h)&&(i.x>h&&(r.x=Math.floor(h/ie.x),i.x=r.x*ie.x,V.mapSize.x=r.x),i.y>h&&(r.y=Math.floor(h/ie.y),i.y=r.y*ie.y,V.mapSize.y=r.y));const q=s.state.buffers.depth.getReversed();if(V.camera._reversedDepth=q,V.map===null||B===!0){if(V.map!==null&&(V.map.depthTexture!==null&&(V.map.depthTexture.dispose(),V.map.depthTexture=null),V.map.dispose()),this.type===As){if($.isPointLight){Je("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}V.map=new Pn(i.x,i.y,{format:Ii,type:Gn,minFilter:Qt,magFilter:Qt,generateMipmaps:!1}),V.map.texture.name=$.name+".shadowMap",V.map.depthTexture=new Xs(i.x,i.y,Cn),V.map.depthTexture.name=$.name+".shadowMapDepth",V.map.depthTexture.format=si,V.map.depthTexture.compareFunction=null,V.map.depthTexture.minFilter=Wt,V.map.depthTexture.magFilter=Wt}else $.isPointLight?(V.map=new Su(i.x),V.map.depthTexture=new Ef(i.x,zn)):(V.map=new Pn(i.x,i.y),V.map.depthTexture=new Xs(i.x,i.y,zn)),V.map.depthTexture.name=$.name+".shadowMap",V.map.depthTexture.format=si,this.type===Ds?(V.map.depthTexture.compareFunction=q?xl:vl,V.map.depthTexture.minFilter=Qt,V.map.depthTexture.magFilter=Qt):(V.map.depthTexture.compareFunction=null,V.map.depthTexture.minFilter=Wt,V.map.depthTexture.magFilter=Wt);V.camera.updateProjectionMatrix()}V.map.isWebGLCubeRenderTarget!==!0&&(V.map.width!==i.x||V.map.height!==i.y)&&V.map.setSize(i.x,i.y);const j=V.map.isWebGLCubeRenderTarget?6:V.getViewportCount();$.isPointLight!==!0&&V.updateMatrices($,x);for(let ne=0;ne<j;ne++){const xe=V.getCamera(ne);if($.isPointLight){const _e=V.camera,tt=V.matrix,Ze=$.distance||_e.far;Ze!==_e.far&&(_e.far=Ze,_e.updateProjectionMatrix()),ws.setFromMatrixPosition($.matrixWorld),_e.position.copy(ws),eo.copy(_e.position),eo.add(Qv[ne]),_e.up.copy(e1[ne]),_e.lookAt(eo),_e.updateMatrixWorld(),tt.makeTranslation(-ws.x,-ws.y,-ws.z),dh.multiplyMatrices(_e.projectionMatrix,_e.matrixWorldInverse),V._frustum.setFromProjectionMatrix(dh,_e.coordinateSystem,_e.reversedDepth)}if(V.map.isWebGLCubeRenderTarget)s.setRenderTarget(V.map,ne),s.clear();else{ne===0&&(s.setRenderTarget(V.map),s.clear());const _e=V.getViewport(ne);a.set(r.x*_e.x,r.y*_e.y,r.x*_e.z,r.y*_e.w),N.viewport(a)}n=V.getFrustum(ne),_(P,x,xe,$,this.type)}V.isPointLightShadow!==!0&&this.type===As&&M(V,x),V.needsUpdate=!1}m=this.type,p.needsUpdate=!1,s.setRenderTarget(w,C,L)};function M(E,P){const x=e.update(S);u.defines.VSM_SAMPLES!==E.blurSamples&&(u.defines.VSM_SAMPLES=E.blurSamples,f.defines.VSM_SAMPLES=E.blurSamples,u.needsUpdate=!0,f.needsUpdate=!0),E.mapPass===null?E.mapPass=new Pn(i.x,i.y,{format:Ii,type:Gn}):(E.mapPass.width!==E.map.width||E.mapPass.height!==E.map.height)&&E.mapPass.setSize(E.map.width,E.map.height),u.uniforms.shadow_pass.value=E.map.depthTexture,u.uniforms.resolution.value.set(E.map.width,E.map.height),u.uniforms.radius.value=E.radius,s.setRenderTarget(E.mapPass),s.clear(),s.renderBufferDirect(P,null,x,u,S,null),f.uniforms.shadow_pass.value=E.mapPass.texture,f.uniforms.resolution.value.set(E.map.width,E.map.height),f.uniforms.radius.value=E.radius,s.setRenderTarget(E.map),s.clear(),s.renderBufferDirect(P,null,x,f,S,null)}function T(E,P,x,w){let C=null;const L=x.isPointLight===!0?E.customDistanceMaterial:E.customDepthMaterial;if(L!==void 0)C=L;else if(C=x.isPointLight===!0?c:o,s.localClippingEnabled&&P.clipShadows===!0&&Array.isArray(P.clippingPlanes)&&P.clippingPlanes.length!==0||P.displacementMap&&P.displacementScale!==0||P.alphaMap&&P.alphaTest>0||P.map&&P.alphaTest>0||P.alphaToCoverage===!0){const N=C.uuid,B=P.uuid;let U=l[N];U===void 0&&(U={},l[N]=U);let O=U[B];O===void 0&&(O=C.clone(),U[B]=O,P.addEventListener("dispose",b)),C=O}if(C.visible=P.visible,C.wireframe=P.wireframe,w===As?C.side=P.shadowSide!==null?P.shadowSide:P.side:C.side=P.shadowSide!==null?P.shadowSide:d[P.side],C.alphaMap=P.alphaMap,C.alphaTest=P.alphaToCoverage===!0?.5:P.alphaTest,C.map=P.map,C.clipShadows=P.clipShadows,C.clippingPlanes=P.clippingPlanes,C.clipIntersection=P.clipIntersection,C.displacementMap=P.displacementMap,C.displacementScale=P.displacementScale,C.displacementBias=P.displacementBias,C.wireframeLinewidth=P.wireframeLinewidth,C.linewidth=P.linewidth,x.isPointLight===!0&&C.isMeshDistanceMaterial===!0){const N=s.properties.get(C);N.light=x}return C}function _(E,P,x,w,C){if(E.visible===!1)return;if(E.layers.test(P.layers)&&(E.isMesh||E.isLine||E.isPoints)&&(E.castShadow||E.receiveShadow&&C===As)&&(!E.frustumCulled||E.intersectsFrustum(n))){E.modelViewMatrix.multiplyMatrices(x.matrixWorldInverse,E.matrixWorld);const B=e.update(E),U=E.material;if(Array.isArray(U)){const O=B.groups;for(let $=0,V=O.length;$<V;$++){const ie=O[$],q=U[ie.materialIndex];if(q&&q.visible){const j=T(E,q,w,C);E.onBeforeShadow(s,E,P,x,B,j,ie),s.renderBufferDirect(x,null,B,j,E,ie),E.onAfterShadow(s,E,P,x,B,j,ie)}}}else if(U.visible){const O=T(E,U,w,C);E.onBeforeShadow(s,E,P,x,B,O,null),s.renderBufferDirect(x,null,B,O,E,null),E.onAfterShadow(s,E,P,x,B,O,null)}}const N=E.children;for(let B=0,U=N.length;B<U;B++)_(N[B],P,x,w,C)}function b(E){E.target.removeEventListener("dispose",b);for(const x in l){const w=l[x],C=E.target.uuid;C in w&&(w[C].dispose(),delete w[C])}}}function n1(s,e){function t(){let k=!1;const ge=new Rt;let Z=null;const ve=new Rt(0,0,0,0);return{setMask:function(Ee){Z!==Ee&&!k&&(s.colorMask(Ee,Ee,Ee,Ee),Z=Ee)},setLocked:function(Ee){k=Ee},setClear:function(Ee,se,Be,ke,Tt){Tt===!0&&(Ee*=ke,se*=ke,Be*=ke),ge.set(Ee,se,Be,ke),ve.equals(ge)===!1&&(s.clearColor(Ee,se,Be,ke),ve.copy(ge))},reset:function(){k=!1,Z=null,ve.set(-1,0,0,0)}}}function n(){let k=!1,ge=!1,Z=null,ve=null,Ee=null;return{setReversed:function(se){if(ge!==se){const Be=e.get("EXT_clip_control");se?Be.clipControlEXT(Be.LOWER_LEFT_EXT,Be.ZERO_TO_ONE_EXT):Be.clipControlEXT(Be.LOWER_LEFT_EXT,Be.NEGATIVE_ONE_TO_ONE_EXT),ge=se;const ke=Ee;Ee=null,this.setClear(ke)}},getReversed:function(){return ge},setTest:function(se){se?ee(s.DEPTH_TEST):Me(s.DEPTH_TEST)},setMask:function(se){Z!==se&&!k&&(s.depthMask(se),Z=se)},setFunc:function(se){if(ge&&(se=ef[se]),ve!==se){switch(se){case fo:s.depthFunc(s.NEVER);break;case po:s.depthFunc(s.ALWAYS);break;case mo:s.depthFunc(s.LESS);break;case Hs:s.depthFunc(s.LEQUAL);break;case go:s.depthFunc(s.EQUAL);break;case vo:s.depthFunc(s.GEQUAL);break;case xo:s.depthFunc(s.GREATER);break;case _o:s.depthFunc(s.NOTEQUAL);break;default:s.depthFunc(s.LEQUAL)}ve=se}},setLocked:function(se){k=se},setClear:function(se){Ee!==se&&(Ee=se,ge&&(se=1-se),s.clearDepth(se))},reset:function(){k=!1,Z=null,ve=null,Ee=null,ge=!1}}}function i(){let k=!1,ge=null,Z=null,ve=null,Ee=null,se=null,Be=null,ke=null,Tt=null;return{setTest:function(_t){k||(_t?ee(s.STENCIL_TEST):Me(s.STENCIL_TEST))},setMask:function(_t){ge!==_t&&!k&&(s.stencilMask(_t),ge=_t)},setFunc:function(_t,Mn,Ln){(Z!==_t||ve!==Mn||Ee!==Ln)&&(s.stencilFunc(_t,Mn,Ln),Z=_t,ve=Mn,Ee=Ln)},setOp:function(_t,Mn,Ln){(se!==_t||Be!==Mn||ke!==Ln)&&(s.stencilOp(_t,Mn,Ln),se=_t,Be=Mn,ke=Ln)},setLocked:function(_t){k=_t},setClear:function(_t){Tt!==_t&&(s.clearStencil(_t),Tt=_t)},reset:function(){k=!1,ge=null,Z=null,ve=null,Ee=null,se=null,Be=null,ke=null,Tt=null}}}const r=new t,a=new n,o=new i,c=new WeakMap,l=new WeakMap;let h={},d={},u={},f=new WeakMap,g=[],S=null,p=!1,m=null,M=null,T=null,_=null,b=null,E=null,P=null,x=new qe(0,0,0),w=0,C=!1,L=null,N=null,B=null,U=null,O=null;const $=s.getParameter(s.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let V=!1,ie=0;const q=s.getParameter(s.VERSION);q.indexOf("WebGL")!==-1?(ie=parseFloat(/^WebGL (\d)/.exec(q)[1]),V=ie>=1):q.indexOf("OpenGL ES")!==-1&&(ie=parseFloat(/^OpenGL ES (\d)/.exec(q)[1]),V=ie>=2);let j=null,ne={};const xe=s.getParameter(s.SCISSOR_BOX),_e=s.getParameter(s.VIEWPORT),tt=new Rt().fromArray(xe),Ze=new Rt().fromArray(_e);function ft(k,ge,Z,ve){const Ee=new Uint8Array(4),se=s.createTexture();s.bindTexture(k,se),s.texParameteri(k,s.TEXTURE_MIN_FILTER,s.NEAREST),s.texParameteri(k,s.TEXTURE_MAG_FILTER,s.NEAREST);for(let Be=0;Be<Z;Be++)k===s.TEXTURE_3D||k===s.TEXTURE_2D_ARRAY?s.texImage3D(ge,0,s.RGBA,1,1,ve,0,s.RGBA,s.UNSIGNED_BYTE,Ee):s.texImage2D(ge+Be,0,s.RGBA,1,1,0,s.RGBA,s.UNSIGNED_BYTE,Ee);return se}const J={};J[s.TEXTURE_2D]=ft(s.TEXTURE_2D,s.TEXTURE_2D,1),J[s.TEXTURE_CUBE_MAP]=ft(s.TEXTURE_CUBE_MAP,s.TEXTURE_CUBE_MAP_POSITIVE_X,6),J[s.TEXTURE_2D_ARRAY]=ft(s.TEXTURE_2D_ARRAY,s.TEXTURE_2D_ARRAY,1,1),J[s.TEXTURE_3D]=ft(s.TEXTURE_3D,s.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),ee(s.DEPTH_TEST),a.setFunc(Hs),oe(!1),ue(sc),ee(s.CULL_FACE),re(ni);function ee(k){h[k]!==!0&&(s.enable(k),h[k]=!0)}function Me(k){h[k]!==!1&&(s.disable(k),h[k]=!1)}function We(k,ge){return u[k]!==ge?(s.bindFramebuffer(k,ge),u[k]=ge,k===s.DRAW_FRAMEBUFFER&&(u[s.FRAMEBUFFER]=ge),k===s.FRAMEBUFFER&&(u[s.DRAW_FRAMEBUFFER]=ge),!0):!1}function Ae(k,ge){let Z=g,ve=!1;if(k){Z=f.get(ge),Z===void 0&&(Z=[],f.set(ge,Z));const Ee=k.textures;if(Z.length!==Ee.length||Z[0]!==s.COLOR_ATTACHMENT0){for(let se=0,Be=Ee.length;se<Be;se++)Z[se]=s.COLOR_ATTACHMENT0+se;Z.length=Ee.length,ve=!0}}else Z[0]!==s.BACK&&(Z[0]=s.BACK,ve=!0);ve&&s.drawBuffers(Z)}function Ke(k){return S!==k?(s.useProgram(k),S=k,!0):!1}const St={[is]:s.FUNC_ADD,[yd]:s.FUNC_SUBTRACT,[Sd]:s.FUNC_REVERSE_SUBTRACT};St[Md]=s.MIN,St[bd]=s.MAX;const te={[wd]:s.ZERO,[Ed]:s.ONE,[Td]:s.SRC_COLOR,[kh]:s.SRC_ALPHA,[Id]:s.SRC_ALPHA_SATURATE,[Rd]:s.DST_COLOR,[Cd]:s.DST_ALPHA,[Ad]:s.ONE_MINUS_SRC_COLOR,[Uh]:s.ONE_MINUS_SRC_ALPHA,[Ld]:s.ONE_MINUS_DST_COLOR,[Pd]:s.ONE_MINUS_DST_ALPHA,[Dd]:s.CONSTANT_COLOR,[kd]:s.ONE_MINUS_CONSTANT_COLOR,[Ud]:s.CONSTANT_ALPHA,[Nd]:s.ONE_MINUS_CONSTANT_ALPHA};function re(k,ge,Z,ve,Ee,se,Be,ke,Tt,_t){if(k===ni){p===!0&&(Me(s.BLEND),p=!1);return}if(p===!1&&(ee(s.BLEND),p=!0),k!==_d){if(k!==m||_t!==C){if((M!==is||b!==is)&&(s.blendEquation(s.FUNC_ADD),M=is,b=is),_t)switch(k){case ks:s.blendFuncSeparate(s.ONE,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case Kr:s.blendFunc(s.ONE,s.ONE);break;case rc:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case ac:s.blendFuncSeparate(s.DST_COLOR,s.ONE_MINUS_SRC_ALPHA,s.ZERO,s.ONE);break;default:vt("WebGLState: Invalid blending: ",k);break}else switch(k){case ks:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case Kr:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE,s.ONE,s.ONE);break;case rc:vt("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case ac:vt("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:vt("WebGLState: Invalid blending: ",k);break}T=null,_=null,E=null,P=null,x.set(0,0,0),w=0,m=k,C=_t}return}Ee=Ee||ge,se=se||Z,Be=Be||ve,(ge!==M||Ee!==b)&&(s.blendEquationSeparate(St[ge],St[Ee]),M=ge,b=Ee),(Z!==T||ve!==_||se!==E||Be!==P)&&(s.blendFuncSeparate(te[Z],te[ve],te[se],te[Be]),T=Z,_=ve,E=se,P=Be),(ke.equals(x)===!1||Tt!==w)&&(s.blendColor(ke.r,ke.g,ke.b,Tt),x.copy(ke),w=Tt),m=k,C=!1}function ae(k,ge){k.side===an?Me(s.CULL_FACE):ee(s.CULL_FACE);let Z=k.side===en;ge&&(Z=!Z),oe(Z),k.blending===ks&&k.transparent===!1?re(ni):re(k.blending,k.blendEquation,k.blendSrc,k.blendDst,k.blendEquationAlpha,k.blendSrcAlpha,k.blendDstAlpha,k.blendColor,k.blendAlpha,k.premultipliedAlpha),a.setFunc(k.depthFunc),a.setTest(k.depthTest),a.setMask(k.depthWrite),r.setMask(k.colorWrite);const ve=k.stencilWrite;o.setTest(ve),ve&&(o.setMask(k.stencilWriteMask),o.setFunc(k.stencilFunc,k.stencilRef,k.stencilFuncMask),o.setOp(k.stencilFail,k.stencilZFail,k.stencilZPass)),He(k.polygonOffset,k.polygonOffsetFactor,k.polygonOffsetUnits),k.alphaToCoverage===!0?ee(s.SAMPLE_ALPHA_TO_COVERAGE):Me(s.SAMPLE_ALPHA_TO_COVERAGE)}function oe(k){L!==k&&(k?s.frontFace(s.CW):s.frontFace(s.CCW),L=k)}function ue(k){k!==gd?(ee(s.CULL_FACE),k!==N&&(k===sc?s.cullFace(s.BACK):k===vd?s.cullFace(s.FRONT):s.cullFace(s.FRONT_AND_BACK))):Me(s.CULL_FACE),N=k}function Ge(k){k!==B&&(V&&s.lineWidth(k),B=k)}function He(k,ge,Z){k?(ee(s.POLYGON_OFFSET_FILL),(U!==ge||O!==Z)&&(U=ge,O=Z,a.getReversed()&&(ge=-ge),s.polygonOffset(ge,Z))):Me(s.POLYGON_OFFSET_FILL)}function $e(k){k?ee(s.SCISSOR_TEST):Me(s.SCISSOR_TEST)}function Qe(k){k===void 0&&(k=s.TEXTURE0+$-1),j!==k&&(s.activeTexture(k),j=k)}function R(k,ge,Z){Z===void 0&&(j===null?Z=s.TEXTURE0+$-1:Z=j);let ve=ne[Z];ve===void 0&&(ve={type:void 0,texture:void 0},ne[Z]=ve),(ve.type!==k||ve.texture!==ge)&&(j!==Z&&(s.activeTexture(Z),j=Z),s.bindTexture(k,ge||J[k]),ve.type=k,ve.texture=ge)}function xt(){const k=ne[j];k!==void 0&&k.type!==void 0&&(s.bindTexture(k.type,null),k.type=void 0,k.texture=void 0)}function ot(){try{s.compressedTexImage2D(...arguments)}catch(k){vt("WebGLState:",k)}}function A(){try{s.compressedTexImage3D(...arguments)}catch(k){vt("WebGLState:",k)}}function v(){try{s.texSubImage2D(...arguments)}catch(k){vt("WebGLState:",k)}}function F(){try{s.texSubImage3D(...arguments)}catch(k){vt("WebGLState:",k)}}function G(){try{s.compressedTexSubImage2D(...arguments)}catch(k){vt("WebGLState:",k)}}function K(){try{s.compressedTexSubImage3D(...arguments)}catch(k){vt("WebGLState:",k)}}function le(){try{s.texStorage2D(...arguments)}catch(k){vt("WebGLState:",k)}}function he(){try{s.texStorage3D(...arguments)}catch(k){vt("WebGLState:",k)}}function Y(){try{s.texImage2D(...arguments)}catch(k){vt("WebGLState:",k)}}function Q(){try{s.texImage3D(...arguments)}catch(k){vt("WebGLState:",k)}}function pe(k){return d[k]!==void 0?d[k]:s.getParameter(k)}function Fe(k,ge){d[k]!==ge&&(s.pixelStorei(k,ge),d[k]=ge)}function ye(k){tt.equals(k)===!1&&(s.scissor(k.x,k.y,k.z,k.w),tt.copy(k))}function me(k){Ze.equals(k)===!1&&(s.viewport(k.x,k.y,k.z,k.w),Ze.copy(k))}function Oe(k,ge){let Z=l.get(ge);Z===void 0&&(Z=new WeakMap,l.set(ge,Z));let ve=Z.get(k);ve===void 0&&(ve=s.getUniformBlockIndex(ge,k.name),Z.set(k,ve))}function Ve(k,ge){const ve=l.get(ge).get(k);c.get(ge)!==ve&&(s.uniformBlockBinding(ge,ve,k.__bindingPointIndex),c.set(ge,ve))}function nt(){s.disable(s.BLEND),s.disable(s.CULL_FACE),s.disable(s.DEPTH_TEST),s.disable(s.POLYGON_OFFSET_FILL),s.disable(s.SCISSOR_TEST),s.disable(s.STENCIL_TEST),s.disable(s.SAMPLE_ALPHA_TO_COVERAGE),s.blendEquation(s.FUNC_ADD),s.blendFunc(s.ONE,s.ZERO),s.blendFuncSeparate(s.ONE,s.ZERO,s.ONE,s.ZERO),s.blendColor(0,0,0,0),s.colorMask(!0,!0,!0,!0),s.clearColor(0,0,0,0),s.depthMask(!0),s.depthFunc(s.LESS),a.setReversed(!1),s.clearDepth(1),s.stencilMask(4294967295),s.stencilFunc(s.ALWAYS,0,4294967295),s.stencilOp(s.KEEP,s.KEEP,s.KEEP),s.clearStencil(0),s.cullFace(s.BACK),s.frontFace(s.CCW),s.polygonOffset(0,0),s.activeTexture(s.TEXTURE0),s.bindFramebuffer(s.FRAMEBUFFER,null),s.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),s.bindFramebuffer(s.READ_FRAMEBUFFER,null),s.useProgram(null),s.lineWidth(1),s.scissor(0,0,s.canvas.width,s.canvas.height),s.viewport(0,0,s.canvas.width,s.canvas.height),s.pixelStorei(s.PACK_ALIGNMENT,4),s.pixelStorei(s.UNPACK_ALIGNMENT,4),s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,!1),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,s.BROWSER_DEFAULT_WEBGL),s.pixelStorei(s.PACK_ROW_LENGTH,0),s.pixelStorei(s.PACK_SKIP_PIXELS,0),s.pixelStorei(s.PACK_SKIP_ROWS,0),s.pixelStorei(s.UNPACK_ROW_LENGTH,0),s.pixelStorei(s.UNPACK_IMAGE_HEIGHT,0),s.pixelStorei(s.UNPACK_SKIP_PIXELS,0),s.pixelStorei(s.UNPACK_SKIP_ROWS,0),s.pixelStorei(s.UNPACK_SKIP_IMAGES,0),h={},d={},j=null,ne={},u={},f=new WeakMap,g=[],S=null,p=!1,m=null,M=null,T=null,_=null,b=null,E=null,P=null,x=new qe(0,0,0),w=0,C=!1,L=null,N=null,B=null,U=null,O=null,tt.set(0,0,s.canvas.width,s.canvas.height),Ze.set(0,0,s.canvas.width,s.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:ee,disable:Me,bindFramebuffer:We,drawBuffers:Ae,useProgram:Ke,setBlending:re,setMaterial:ae,setFlipSided:oe,setCullFace:ue,setLineWidth:Ge,setPolygonOffset:He,setScissorTest:$e,activeTexture:Qe,bindTexture:R,unbindTexture:xt,compressedTexImage2D:ot,compressedTexImage3D:A,texImage2D:Y,texImage3D:Q,pixelStorei:Fe,getParameter:pe,updateUBOMapping:Oe,uniformBlockBinding:Ve,texStorage2D:le,texStorage3D:he,texSubImage2D:v,texSubImage3D:F,compressedTexSubImage2D:G,compressedTexSubImage3D:K,scissor:ye,viewport:me,reset:nt}}function i1(s,e,t,n,i,r,a){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new ce,h=new WeakMap,d=new Set;let u;const f=new WeakMap;let g=!1;try{g=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function S(A,v){return g?new OffscreenCanvas(A,v):ea("canvas")}function p(A,v,F){let G=1;const K=ot(A);if((K.width>F||K.height>F)&&(G=F/Math.max(K.width,K.height)),G<1)if(typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&A instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&A instanceof ImageBitmap||typeof VideoFrame<"u"&&A instanceof VideoFrame){const le=Math.floor(G*K.width),he=Math.floor(G*K.height);u===void 0&&(u=S(le,he));const Y=v?S(le,he):u;return Y.width=le,Y.height=he,Y.getContext("2d").drawImage(A,0,0,le,he),Je("WebGLRenderer: Texture has been resized from ("+K.width+"x"+K.height+") to ("+le+"x"+he+")."),Y}else return"data"in A&&Je("WebGLRenderer: Image in DataTexture is too big ("+K.width+"x"+K.height+")."),A;return A}function m(A){return A.generateMipmaps}function M(A){s.generateMipmap(A)}function T(A){return A.isWebGLCubeRenderTarget?s.TEXTURE_CUBE_MAP:A.isWebGL3DRenderTarget?s.TEXTURE_3D:A.isWebGLArrayRenderTarget||A.isCompressedArrayTexture?s.TEXTURE_2D_ARRAY:s.TEXTURE_2D}function _(A,v,F,G,K,le=!1){if(A!==null){if(s[A]!==void 0)return s[A];Je("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+A+"'")}let he;G&&(he=e.get("EXT_texture_norm16"),he||Je("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let Y=v;if(v===s.RED&&(F===s.FLOAT&&(Y=s.R32F),F===s.HALF_FLOAT&&(Y=s.R16F),F===s.UNSIGNED_BYTE&&(Y=s.R8),F===s.UNSIGNED_SHORT&&he&&(Y=he.R16_EXT),F===s.SHORT&&he&&(Y=he.R16_SNORM_EXT)),v===s.RED_INTEGER&&(F===s.UNSIGNED_BYTE&&(Y=s.R8UI),F===s.UNSIGNED_SHORT&&(Y=s.R16UI),F===s.UNSIGNED_INT&&(Y=s.R32UI),F===s.BYTE&&(Y=s.R8I),F===s.SHORT&&(Y=s.R16I),F===s.INT&&(Y=s.R32I)),v===s.RG&&(F===s.FLOAT&&(Y=s.RG32F),F===s.HALF_FLOAT&&(Y=s.RG16F),F===s.UNSIGNED_BYTE&&(Y=s.RG8),F===s.UNSIGNED_SHORT&&he&&(Y=he.RG16_EXT),F===s.SHORT&&he&&(Y=he.RG16_SNORM_EXT)),v===s.RG_INTEGER&&(F===s.UNSIGNED_BYTE&&(Y=s.RG8UI),F===s.UNSIGNED_SHORT&&(Y=s.RG16UI),F===s.UNSIGNED_INT&&(Y=s.RG32UI),F===s.BYTE&&(Y=s.RG8I),F===s.SHORT&&(Y=s.RG16I),F===s.INT&&(Y=s.RG32I)),v===s.RGB_INTEGER&&(F===s.UNSIGNED_BYTE&&(Y=s.RGB8UI),F===s.UNSIGNED_SHORT&&(Y=s.RGB16UI),F===s.UNSIGNED_INT&&(Y=s.RGB32UI),F===s.BYTE&&(Y=s.RGB8I),F===s.SHORT&&(Y=s.RGB16I),F===s.INT&&(Y=s.RGB32I)),v===s.RGBA_INTEGER&&(F===s.UNSIGNED_BYTE&&(Y=s.RGBA8UI),F===s.UNSIGNED_SHORT&&(Y=s.RGBA16UI),F===s.UNSIGNED_INT&&(Y=s.RGBA32UI),F===s.BYTE&&(Y=s.RGBA8I),F===s.SHORT&&(Y=s.RGBA16I),F===s.INT&&(Y=s.RGBA32I)),v===s.RGB&&(F===s.UNSIGNED_SHORT&&he&&(Y=he.RGB16_EXT),F===s.SHORT&&he&&(Y=he.RGB16_SNORM_EXT),F===s.UNSIGNED_INT_5_9_9_9_REV&&(Y=s.RGB9_E5),F===s.UNSIGNED_INT_10F_11F_11F_REV&&(Y=s.R11F_G11F_B10F)),v===s.RGBA){const Q=le?Qr:ut.getTransfer(K);F===s.FLOAT&&(Y=s.RGBA32F),F===s.HALF_FLOAT&&(Y=s.RGBA16F),F===s.UNSIGNED_BYTE&&(Y=Q===Mt?s.SRGB8_ALPHA8:s.RGBA8),F===s.UNSIGNED_SHORT&&he&&(Y=he.RGBA16_EXT),F===s.SHORT&&he&&(Y=he.RGBA16_SNORM_EXT),F===s.UNSIGNED_SHORT_4_4_4_4&&(Y=s.RGBA4),F===s.UNSIGNED_SHORT_5_5_5_1&&(Y=s.RGB5_A1)}return(Y===s.R16F||Y===s.R32F||Y===s.RG16F||Y===s.RG32F||Y===s.RGBA16F||Y===s.RGBA32F)&&e.get("EXT_color_buffer_float"),Y}function b(A,v){let F;return A?v===null||v===zn||v===Gs?F=s.DEPTH24_STENCIL8:v===Cn?F=s.DEPTH32F_STENCIL8:v===zs&&(F=s.DEPTH24_STENCIL8,Je("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):v===null||v===zn||v===Gs?F=s.DEPTH_COMPONENT24:v===Cn?F=s.DEPTH_COMPONENT32F:v===zs&&(F=s.DEPTH_COMPONENT16),F}function E(A,v){return m(A)===!0||A.isFramebufferTexture&&A.minFilter!==Wt&&A.minFilter!==Qt?Math.log2(Math.max(v.width,v.height))+1:A.mipmaps!==void 0&&A.mipmaps.length>0?A.mipmaps.length:A.isCompressedTexture&&Array.isArray(A.image)?v.mipmaps.length:1}function P(A){const v=A.target;v.removeEventListener("dispose",P),w(v),v.isVideoTexture&&h.delete(v),v.isHTMLTexture&&d.delete(v)}function x(A){const v=A.target;v.removeEventListener("dispose",x),L(v)}function w(A){const v=n.get(A);if(v.__webglInit===void 0)return;const F=A.source,G=f.get(F);if(G){const K=G[v.__cacheKey];K.usedTimes--,K.usedTimes===0&&C(A),Object.keys(G).length===0&&f.delete(F)}n.remove(A)}function C(A){const v=n.get(A);s.deleteTexture(v.__webglTexture);const F=A.source,G=f.get(F);delete G[v.__cacheKey],a.memory.textures--}function L(A){const v=n.get(A);if(A.depthTexture&&(A.depthTexture.dispose(),n.remove(A.depthTexture)),A.isWebGLCubeRenderTarget)for(let G=0;G<6;G++){if(Array.isArray(v.__webglFramebuffer[G]))for(let K=0;K<v.__webglFramebuffer[G].length;K++)s.deleteFramebuffer(v.__webglFramebuffer[G][K]);else s.deleteFramebuffer(v.__webglFramebuffer[G]);v.__webglDepthbuffer&&s.deleteRenderbuffer(v.__webglDepthbuffer[G])}else{if(Array.isArray(v.__webglFramebuffer))for(let G=0;G<v.__webglFramebuffer.length;G++)s.deleteFramebuffer(v.__webglFramebuffer[G]);else s.deleteFramebuffer(v.__webglFramebuffer);if(v.__webglDepthbuffer&&s.deleteRenderbuffer(v.__webglDepthbuffer),v.__webglMultisampledFramebuffer&&s.deleteFramebuffer(v.__webglMultisampledFramebuffer),v.__webglColorRenderbuffer)for(let G=0;G<v.__webglColorRenderbuffer.length;G++)v.__webglColorRenderbuffer[G]&&s.deleteRenderbuffer(v.__webglColorRenderbuffer[G]);v.__webglDepthRenderbuffer&&s.deleteRenderbuffer(v.__webglDepthRenderbuffer)}const F=A.textures;for(let G=0,K=F.length;G<K;G++){const le=n.get(F[G]);le.__webglTexture&&(s.deleteTexture(le.__webglTexture),a.memory.textures--),n.remove(F[G])}n.remove(A)}let N=0;function B(){N=0}function U(){return N}function O(A){N=A}function $(){const A=N;return A>=i.maxTextures&&Je("WebGLTextures: Trying to use "+(A+1)+" texture units while this GPU supports only "+i.maxTextures),N+=1,A}function V(A){const v=[];return v.push(A.wrapS),v.push(A.wrapT),v.push(A.wrapR||0),v.push(A.magFilter),v.push(A.minFilter),v.push(A.anisotropy),v.push(A.internalFormat),v.push(A.format),v.push(A.type),v.push(A.generateMipmaps),v.push(A.premultiplyAlpha),v.push(A.flipY),v.push(A.unpackAlignment),v.push(A.colorSpace),v.join()}function ie(A,v){const F=n.get(A);if(A.isVideoTexture&&R(A),A.isRenderTargetTexture===!1&&A.isExternalTexture!==!0&&A.version>0&&F.__version!==A.version){const G=A.image;if(G===null)Je("WebGLRenderer: Texture marked for update but no image data found.");else if(G.complete===!1)Je("WebGLRenderer: Texture marked for update but image is incomplete");else{Me(F,A,v);return}}else A.isExternalTexture&&(F.__webglTexture=A.sourceTexture?A.sourceTexture:null);t.bindTexture(s.TEXTURE_2D,F.__webglTexture,s.TEXTURE0+v)}function q(A,v){const F=n.get(A);if(A.isRenderTargetTexture===!1&&A.version>0&&F.__version!==A.version){Me(F,A,v);return}else A.isExternalTexture&&(F.__webglTexture=A.sourceTexture?A.sourceTexture:null);t.bindTexture(s.TEXTURE_2D_ARRAY,F.__webglTexture,s.TEXTURE0+v)}function j(A,v){const F=n.get(A);if(A.isRenderTargetTexture===!1&&A.version>0&&F.__version!==A.version){Me(F,A,v);return}t.bindTexture(s.TEXTURE_3D,F.__webglTexture,s.TEXTURE0+v)}function ne(A,v){const F=n.get(A);if(A.isCubeDepthTexture!==!0&&A.version>0&&F.__version!==A.version){We(F,A,v);return}t.bindTexture(s.TEXTURE_CUBE_MAP,F.__webglTexture,s.TEXTURE0+v)}const xe={[$r]:s.REPEAT,[ei]:s.CLAMP_TO_EDGE,[yo]:s.MIRRORED_REPEAT},_e={[Wt]:s.NEAREST,[Bd]:s.NEAREST_MIPMAP_NEAREST,[rr]:s.NEAREST_MIPMAP_LINEAR,[Qt]:s.LINEAR,[Sa]:s.LINEAR_MIPMAP_NEAREST,[Ai]:s.LINEAR_MIPMAP_LINEAR},tt={[Vd]:s.NEVER,[$d]:s.ALWAYS,[Wd]:s.LESS,[vl]:s.LEQUAL,[Xd]:s.EQUAL,[xl]:s.GEQUAL,[qd]:s.GREATER,[Kd]:s.NOTEQUAL};function Ze(A,v){if(v.type===Cn&&e.has("OES_texture_float_linear")===!1&&(v.magFilter===Qt||v.magFilter===Sa||v.magFilter===rr||v.magFilter===Ai||v.minFilter===Qt||v.minFilter===Sa||v.minFilter===rr||v.minFilter===Ai)&&Je("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),s.texParameteri(A,s.TEXTURE_WRAP_S,xe[v.wrapS]),s.texParameteri(A,s.TEXTURE_WRAP_T,xe[v.wrapT]),(A===s.TEXTURE_3D||A===s.TEXTURE_2D_ARRAY)&&s.texParameteri(A,s.TEXTURE_WRAP_R,xe[v.wrapR]),s.texParameteri(A,s.TEXTURE_MAG_FILTER,_e[v.magFilter]),s.texParameteri(A,s.TEXTURE_MIN_FILTER,_e[v.minFilter]),v.compareFunction&&(s.texParameteri(A,s.TEXTURE_COMPARE_MODE,s.COMPARE_REF_TO_TEXTURE),s.texParameteri(A,s.TEXTURE_COMPARE_FUNC,tt[v.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(v.magFilter===Wt||v.minFilter!==rr&&v.minFilter!==Ai||v.type===Cn&&e.has("OES_texture_float_linear")===!1)return;if(v.anisotropy>1||n.get(v).__currentAnisotropy){const F=e.get("EXT_texture_filter_anisotropic");s.texParameterf(A,F.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(v.anisotropy,i.getMaxAnisotropy())),n.get(v).__currentAnisotropy=v.anisotropy}}}function ft(A,v){let F=!1;A.__webglInit===void 0&&(A.__webglInit=!0,v.addEventListener("dispose",P));const G=v.source;let K=f.get(G);K===void 0&&(K={},f.set(G,K));const le=V(v);if(le!==A.__cacheKey){K[le]===void 0&&(K[le]={texture:s.createTexture(),usedTimes:0},a.memory.textures++,F=!0),K[le].usedTimes++;const he=K[A.__cacheKey];he!==void 0&&(K[A.__cacheKey].usedTimes--,he.usedTimes===0&&C(v)),A.__cacheKey=le,A.__webglTexture=K[le].texture}return F}function J(A,v,F){return Math.floor(Math.floor(A/F)/v)}function ee(A,v,F,G){const le=A.updateRanges;if(le.length===0)t.texSubImage2D(s.TEXTURE_2D,0,0,0,v.width,v.height,F,G,v.data);else{le.sort((Fe,ye)=>Fe.start-ye.start);let he=0;for(let Fe=1;Fe<le.length;Fe++){const ye=le[he],me=le[Fe],Oe=ye.start+ye.count,Ve=J(me.start,v.width,4),nt=J(ye.start,v.width,4);me.start<=Oe+1&&Ve===nt&&J(me.start+me.count-1,v.width,4)===Ve?ye.count=Math.max(ye.count,me.start+me.count-ye.start):(++he,le[he]=me)}le.length=he+1;const Y=t.getParameter(s.UNPACK_ROW_LENGTH),Q=t.getParameter(s.UNPACK_SKIP_PIXELS),pe=t.getParameter(s.UNPACK_SKIP_ROWS);t.pixelStorei(s.UNPACK_ROW_LENGTH,v.width);for(let Fe=0,ye=le.length;Fe<ye;Fe++){const me=le[Fe],Oe=Math.floor(me.start/4),Ve=Math.ceil(me.count/4),nt=Oe%v.width,k=Math.floor(Oe/v.width),ge=Ve,Z=1;t.pixelStorei(s.UNPACK_SKIP_PIXELS,nt),t.pixelStorei(s.UNPACK_SKIP_ROWS,k),t.texSubImage2D(s.TEXTURE_2D,0,nt,k,ge,Z,F,G,v.data)}A.clearUpdateRanges(),t.pixelStorei(s.UNPACK_ROW_LENGTH,Y),t.pixelStorei(s.UNPACK_SKIP_PIXELS,Q),t.pixelStorei(s.UNPACK_SKIP_ROWS,pe)}}function Me(A,v,F){let G=s.TEXTURE_2D;(v.isDataArrayTexture||v.isCompressedArrayTexture)&&(G=s.TEXTURE_2D_ARRAY),v.isData3DTexture&&(G=s.TEXTURE_3D);const K=ft(A,v),le=v.source;t.bindTexture(G,A.__webglTexture,s.TEXTURE0+F);const he=n.get(le);if(le.version!==he.__version||K===!0){if(t.activeTexture(s.TEXTURE0+F),(typeof ImageBitmap<"u"&&v.image instanceof ImageBitmap)===!1){const Z=ut.getPrimaries(ut.workingColorSpace),ve=v.colorSpace===gi?null:ut.getPrimaries(v.colorSpace),Ee=v.colorSpace===gi||Z===ve?s.NONE:s.BROWSER_DEFAULT_WEBGL;t.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,v.flipY),t.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,v.premultiplyAlpha),t.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ee)}t.pixelStorei(s.UNPACK_ALIGNMENT,v.unpackAlignment);let Q=p(v.image,!1,i.maxTextureSize);Q=xt(v,Q);const pe=r.convert(v.format,v.colorSpace),Fe=r.convert(v.type);let ye=_(v.internalFormat,pe,Fe,v.normalized,v.colorSpace,v.isVideoTexture);Ze(G,v);let me;const Oe=v.mipmaps,Ve=v.isVideoTexture!==!0,nt=he.__version===void 0||K===!0,k=le.dataReady,ge=E(v,Q);if(v.isDepthTexture)ye=b(v.format===Ci,v.type),nt&&(Ve?t.texStorage2D(s.TEXTURE_2D,1,ye,Q.width,Q.height):t.texImage2D(s.TEXTURE_2D,0,ye,Q.width,Q.height,0,pe,Fe,null));else if(v.isDataTexture)if(Oe.length>0){Ve&&nt&&t.texStorage2D(s.TEXTURE_2D,ge,ye,Oe[0].width,Oe[0].height);for(let Z=0,ve=Oe.length;Z<ve;Z++)me=Oe[Z],Ve?k&&t.texSubImage2D(s.TEXTURE_2D,Z,0,0,me.width,me.height,pe,Fe,me.data):t.texImage2D(s.TEXTURE_2D,Z,ye,me.width,me.height,0,pe,Fe,me.data);v.generateMipmaps=!1}else Ve?(nt&&t.texStorage2D(s.TEXTURE_2D,ge,ye,Q.width,Q.height),k&&ee(v,Q,pe,Fe)):t.texImage2D(s.TEXTURE_2D,0,ye,Q.width,Q.height,0,pe,Fe,Q.data);else if(v.isCompressedTexture)if(v.isCompressedArrayTexture){Ve&&nt&&t.texStorage3D(s.TEXTURE_2D_ARRAY,ge,ye,Oe[0].width,Oe[0].height,Q.depth);for(let Z=0,ve=Oe.length;Z<ve;Z++)if(me=Oe[Z],v.format!==Sn)if(pe!==null)if(Ve){if(k)if(v.layerUpdates.size>0){const Ee=Wc(me.width,me.height,v.format,v.type);for(const se of v.layerUpdates){const Be=me.data.subarray(se*Ee/me.data.BYTES_PER_ELEMENT,(se+1)*Ee/me.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,Z,0,0,se,me.width,me.height,1,pe,Be)}}else t.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,Z,0,0,0,me.width,me.height,Q.depth,pe,me.data)}else t.compressedTexImage3D(s.TEXTURE_2D_ARRAY,Z,ye,me.width,me.height,Q.depth,0,me.data,0,0);else Je("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Ve?k&&t.texSubImage3D(s.TEXTURE_2D_ARRAY,Z,0,0,0,me.width,me.height,Q.depth,pe,Fe,me.data):t.texImage3D(s.TEXTURE_2D_ARRAY,Z,ye,me.width,me.height,Q.depth,0,pe,Fe,me.data);v.layerUpdates.size>0&&v.clearLayerUpdates()}else{Ve&&nt&&t.texStorage2D(s.TEXTURE_2D,ge,ye,Oe[0].width,Oe[0].height);for(let Z=0,ve=Oe.length;Z<ve;Z++)me=Oe[Z],v.format!==Sn?pe!==null?Ve?k&&t.compressedTexSubImage2D(s.TEXTURE_2D,Z,0,0,me.width,me.height,pe,me.data):t.compressedTexImage2D(s.TEXTURE_2D,Z,ye,me.width,me.height,0,me.data):Je("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Ve?k&&t.texSubImage2D(s.TEXTURE_2D,Z,0,0,me.width,me.height,pe,Fe,me.data):t.texImage2D(s.TEXTURE_2D,Z,ye,me.width,me.height,0,pe,Fe,me.data)}else if(v.isDataArrayTexture)if(Ve){if(nt&&t.texStorage3D(s.TEXTURE_2D_ARRAY,ge,ye,Q.width,Q.height,Q.depth),k)if(v.layerUpdates.size>0){const Z=Wc(Q.width,Q.height,v.format,v.type);for(const ve of v.layerUpdates){const Ee=Q.data.subarray(ve*Z/Q.data.BYTES_PER_ELEMENT,(ve+1)*Z/Q.data.BYTES_PER_ELEMENT);t.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,ve,Q.width,Q.height,1,pe,Fe,Ee)}v.clearLayerUpdates()}else t.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,0,Q.width,Q.height,Q.depth,pe,Fe,Q.data)}else t.texImage3D(s.TEXTURE_2D_ARRAY,0,ye,Q.width,Q.height,Q.depth,0,pe,Fe,Q.data);else if(v.isData3DTexture)Ve?(nt&&t.texStorage3D(s.TEXTURE_3D,ge,ye,Q.width,Q.height,Q.depth),k&&t.texSubImage3D(s.TEXTURE_3D,0,0,0,0,Q.width,Q.height,Q.depth,pe,Fe,Q.data)):t.texImage3D(s.TEXTURE_3D,0,ye,Q.width,Q.height,Q.depth,0,pe,Fe,Q.data);else if(v.isFramebufferTexture){if(nt)if(Ve)t.texStorage2D(s.TEXTURE_2D,ge,ye,Q.width,Q.height);else{let Z=Q.width,ve=Q.height;for(let Ee=0;Ee<ge;Ee++)t.texImage2D(s.TEXTURE_2D,Ee,ye,Z,ve,0,pe,Fe,null),Z>>=1,ve>>=1}}else if(v.isHTMLTexture){if("texElementImage2D"in s){const Z=s.canvas;if(Z.hasAttribute("layoutsubtree")||Z.setAttribute("layoutsubtree","true"),Q.parentNode!==Z){Z.appendChild(Q),d.add(v),Z.onpaint=ve=>{const Ee=ve.changedElements;for(const se of d)Ee.includes(se.image)&&(se.needsUpdate=!0)},Z.requestPaint();return}if(s.texElementImage2D.length===3)s.texElementImage2D(s.TEXTURE_2D,s.RGBA8,Q);else{const Ee=s.RGBA,se=s.RGBA,Be=s.UNSIGNED_BYTE;s.texElementImage2D(s.TEXTURE_2D,0,Ee,se,Be,Q)}s.texParameteri(s.TEXTURE_2D,s.TEXTURE_MIN_FILTER,s.LINEAR),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_WRAP_S,s.CLAMP_TO_EDGE),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_WRAP_T,s.CLAMP_TO_EDGE)}}else if(Oe.length>0){if(Ve&&nt){const Z=ot(Oe[0]);t.texStorage2D(s.TEXTURE_2D,ge,ye,Z.width,Z.height)}for(let Z=0,ve=Oe.length;Z<ve;Z++)me=Oe[Z],Ve?k&&t.texSubImage2D(s.TEXTURE_2D,Z,0,0,pe,Fe,me):t.texImage2D(s.TEXTURE_2D,Z,ye,pe,Fe,me);v.generateMipmaps=!1}else if(Ve){if(nt){const Z=ot(Q);t.texStorage2D(s.TEXTURE_2D,ge,ye,Z.width,Z.height)}k&&t.texSubImage2D(s.TEXTURE_2D,0,0,0,pe,Fe,Q)}else t.texImage2D(s.TEXTURE_2D,0,ye,pe,Fe,Q);m(v)&&M(G),he.__version=le.version,v.onUpdate&&v.onUpdate(v)}A.__version=v.version}function We(A,v,F){if(v.image.length!==6)return;const G=ft(A,v),K=v.source;t.bindTexture(s.TEXTURE_CUBE_MAP,A.__webglTexture,s.TEXTURE0+F);const le=n.get(K);if(K.version!==le.__version||G===!0){t.activeTexture(s.TEXTURE0+F);const he=ut.getPrimaries(ut.workingColorSpace),Y=v.colorSpace===gi?null:ut.getPrimaries(v.colorSpace),Q=v.colorSpace===gi||he===Y?s.NONE:s.BROWSER_DEFAULT_WEBGL;t.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,v.flipY),t.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,v.premultiplyAlpha),t.pixelStorei(s.UNPACK_ALIGNMENT,v.unpackAlignment),t.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,Q);const pe=v.isCompressedTexture||v.image[0].isCompressedTexture,Fe=v.image[0]&&v.image[0].isDataTexture,ye=[];for(let se=0;se<6;se++)!pe&&!Fe?ye[se]=p(v.image[se],!0,i.maxCubemapSize):ye[se]=Fe?v.image[se].image:v.image[se],ye[se]=xt(v,ye[se]);const me=ye[0],Oe=r.convert(v.format,v.colorSpace),Ve=r.convert(v.type),nt=_(v.internalFormat,Oe,Ve,v.normalized,v.colorSpace),k=v.isVideoTexture!==!0,ge=le.__version===void 0||G===!0,Z=K.dataReady;let ve=E(v,me);Ze(s.TEXTURE_CUBE_MAP,v);let Ee;if(pe){k&&ge&&t.texStorage2D(s.TEXTURE_CUBE_MAP,ve,nt,me.width,me.height);for(let se=0;se<6;se++){Ee=ye[se].mipmaps;for(let Be=0;Be<Ee.length;Be++){const ke=Ee[Be];v.format!==Sn?Oe!==null?k?Z&&t.compressedTexSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+se,Be,0,0,ke.width,ke.height,Oe,ke.data):t.compressedTexImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+se,Be,nt,ke.width,ke.height,0,ke.data):Je("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):k?Z&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+se,Be,0,0,ke.width,ke.height,Oe,Ve,ke.data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+se,Be,nt,ke.width,ke.height,0,Oe,Ve,ke.data)}}}else{if(Ee=v.mipmaps,k&&ge){Ee.length>0&&ve++;const se=ot(ye[0]);t.texStorage2D(s.TEXTURE_CUBE_MAP,ve,nt,se.width,se.height)}for(let se=0;se<6;se++)if(Fe){k?Z&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+se,0,0,0,ye[se].width,ye[se].height,Oe,Ve,ye[se].data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+se,0,nt,ye[se].width,ye[se].height,0,Oe,Ve,ye[se].data);for(let Be=0;Be<Ee.length;Be++){const Tt=Ee[Be].image[se].image;k?Z&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+se,Be+1,0,0,Tt.width,Tt.height,Oe,Ve,Tt.data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+se,Be+1,nt,Tt.width,Tt.height,0,Oe,Ve,Tt.data)}}else{k?Z&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+se,0,0,0,Oe,Ve,ye[se]):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+se,0,nt,Oe,Ve,ye[se]);for(let Be=0;Be<Ee.length;Be++){const ke=Ee[Be];k?Z&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+se,Be+1,0,0,Oe,Ve,ke.image[se]):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+se,Be+1,nt,Oe,Ve,ke.image[se])}}}m(v)&&M(s.TEXTURE_CUBE_MAP),le.__version=K.version,v.onUpdate&&v.onUpdate(v)}A.__version=v.version}function Ae(A,v,F,G,K,le){const he=r.convert(F.format,F.colorSpace),Y=r.convert(F.type),Q=_(F.internalFormat,he,Y,F.normalized,F.colorSpace),pe=n.get(v),Fe=n.get(F);if(Fe.__renderTarget=v,!pe.__hasExternalTextures){const ye=Math.max(1,v.width>>le),me=Math.max(1,v.height>>le);K===s.TEXTURE_3D||K===s.TEXTURE_2D_ARRAY?t.texImage3D(K,le,Q,ye,me,v.depth,0,he,Y,null):t.texImage2D(K,le,Q,ye,me,0,he,Y,null)}t.bindFramebuffer(s.FRAMEBUFFER,A),Qe(v)?o.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,G,K,Fe.__webglTexture,0,$e(v)):(K===s.TEXTURE_2D||K>=s.TEXTURE_CUBE_MAP_POSITIVE_X&&K<=s.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&s.framebufferTexture2D(s.FRAMEBUFFER,G,K,Fe.__webglTexture,le),t.bindFramebuffer(s.FRAMEBUFFER,null)}function Ke(A,v,F){if(s.bindRenderbuffer(s.RENDERBUFFER,A),v.depthBuffer){const G=v.depthTexture,K=G&&G.isDepthTexture?G.type:null,le=b(v.stencilBuffer,K),he=v.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;Qe(v)?o.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,$e(v),le,v.width,v.height):F?s.renderbufferStorageMultisample(s.RENDERBUFFER,$e(v),le,v.width,v.height):s.renderbufferStorage(s.RENDERBUFFER,le,v.width,v.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,he,s.RENDERBUFFER,A)}else{const G=v.textures;for(let K=0;K<G.length;K++){const le=G[K],he=r.convert(le.format,le.colorSpace),Y=r.convert(le.type),Q=_(le.internalFormat,he,Y,le.normalized,le.colorSpace);Qe(v)?o.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,$e(v),Q,v.width,v.height):F?s.renderbufferStorageMultisample(s.RENDERBUFFER,$e(v),Q,v.width,v.height):s.renderbufferStorage(s.RENDERBUFFER,Q,v.width,v.height)}}s.bindRenderbuffer(s.RENDERBUFFER,null)}function St(A,v,F){const G=v.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(s.FRAMEBUFFER,A),!(v.depthTexture&&v.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");const K=n.get(v.depthTexture);if(K.__renderTarget=v,(!K.__webglTexture||v.depthTexture.image.width!==v.width||v.depthTexture.image.height!==v.height)&&(v.depthTexture.image.width=v.width,v.depthTexture.image.height=v.height,v.depthTexture.needsUpdate=!0),G){if(K.__webglInit===void 0&&(K.__webglInit=!0,v.depthTexture.addEventListener("dispose",P)),K.__webglTexture===void 0){K.__webglTexture=s.createTexture(),t.bindTexture(s.TEXTURE_CUBE_MAP,K.__webglTexture),Ze(s.TEXTURE_CUBE_MAP,v.depthTexture);const pe=r.convert(v.depthTexture.format),Fe=r.convert(v.depthTexture.type);let ye;v.depthTexture.format===si?ye=s.DEPTH_COMPONENT24:v.depthTexture.format===Ci&&(ye=s.DEPTH24_STENCIL8);for(let me=0;me<6;me++)s.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+me,0,ye,v.width,v.height,0,pe,Fe,null)}}else ie(v.depthTexture,0);const le=K.__webglTexture,he=$e(v),Y=G?s.TEXTURE_CUBE_MAP_POSITIVE_X+F:s.TEXTURE_2D,Q=v.depthTexture.format===Ci?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;if(v.depthTexture.format===si)Qe(v)?o.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,Q,Y,le,0,he):s.framebufferTexture2D(s.FRAMEBUFFER,Q,Y,le,0);else if(v.depthTexture.format===Ci)Qe(v)?o.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,Q,Y,le,0,he):s.framebufferTexture2D(s.FRAMEBUFFER,Q,Y,le,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function te(A){const v=n.get(A),F=A.isWebGLCubeRenderTarget===!0;if(v.__boundDepthTexture!==A.depthTexture){const G=A.depthTexture;if(v.__depthDisposeCallback&&v.__depthDisposeCallback(),G){const K=()=>{delete v.__boundDepthTexture,delete v.__depthDisposeCallback,G.removeEventListener("dispose",K)};G.addEventListener("dispose",K),v.__depthDisposeCallback=K}v.__boundDepthTexture=G}if(A.depthTexture&&!v.__autoAllocateDepthBuffer)if(F)for(let G=0;G<6;G++)St(v.__webglFramebuffer[G],A,G);else{const G=A.texture.mipmaps;G&&G.length>0?St(v.__webglFramebuffer[0],A,0):St(v.__webglFramebuffer,A,0)}else if(F){v.__webglDepthbuffer=[];for(let G=0;G<6;G++)if(t.bindFramebuffer(s.FRAMEBUFFER,v.__webglFramebuffer[G]),v.__webglDepthbuffer[G]===void 0)v.__webglDepthbuffer[G]=s.createRenderbuffer(),Ke(v.__webglDepthbuffer[G],A,!1);else{const K=A.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,le=v.__webglDepthbuffer[G];s.bindRenderbuffer(s.RENDERBUFFER,le),s.framebufferRenderbuffer(s.FRAMEBUFFER,K,s.RENDERBUFFER,le)}}else{const G=A.texture.mipmaps;if(G&&G.length>0?t.bindFramebuffer(s.FRAMEBUFFER,v.__webglFramebuffer[0]):t.bindFramebuffer(s.FRAMEBUFFER,v.__webglFramebuffer),v.__webglDepthbuffer===void 0)v.__webglDepthbuffer=s.createRenderbuffer(),Ke(v.__webglDepthbuffer,A,!1);else{const K=A.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,le=v.__webglDepthbuffer;s.bindRenderbuffer(s.RENDERBUFFER,le),s.framebufferRenderbuffer(s.FRAMEBUFFER,K,s.RENDERBUFFER,le)}}t.bindFramebuffer(s.FRAMEBUFFER,null)}function re(A,v,F){const G=n.get(A);v!==void 0&&Ae(G.__webglFramebuffer,A,A.texture,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,0),F!==void 0&&te(A)}function ae(A){const v=A.texture,F=n.get(A),G=n.get(v);A.addEventListener("dispose",x);const K=A.textures,le=A.isWebGLCubeRenderTarget===!0,he=K.length>1;if(he||(G.__webglTexture===void 0&&(G.__webglTexture=s.createTexture()),G.__version=v.version,a.memory.textures++),le){F.__webglFramebuffer=[];for(let Y=0;Y<6;Y++)if(v.mipmaps&&v.mipmaps.length>0){F.__webglFramebuffer[Y]=[];for(let Q=0;Q<v.mipmaps.length;Q++)F.__webglFramebuffer[Y][Q]=s.createFramebuffer()}else F.__webglFramebuffer[Y]=s.createFramebuffer()}else{if(v.mipmaps&&v.mipmaps.length>0){F.__webglFramebuffer=[];for(let Y=0;Y<v.mipmaps.length;Y++)F.__webglFramebuffer[Y]=s.createFramebuffer()}else F.__webglFramebuffer=s.createFramebuffer();if(he)for(let Y=0,Q=K.length;Y<Q;Y++){const pe=n.get(K[Y]);pe.__webglTexture===void 0&&(pe.__webglTexture=s.createTexture(),a.memory.textures++)}if(A.samples>0&&Qe(A)===!1){F.__webglMultisampledFramebuffer=s.createFramebuffer(),F.__webglColorRenderbuffer=[],t.bindFramebuffer(s.FRAMEBUFFER,F.__webglMultisampledFramebuffer);for(let Y=0;Y<K.length;Y++){const Q=K[Y];F.__webglColorRenderbuffer[Y]=s.createRenderbuffer(),s.bindRenderbuffer(s.RENDERBUFFER,F.__webglColorRenderbuffer[Y]);const pe=r.convert(Q.format,Q.colorSpace),Fe=r.convert(Q.type),ye=_(Q.internalFormat,pe,Fe,Q.normalized,Q.colorSpace,A.isXRRenderTarget===!0),me=$e(A);s.renderbufferStorageMultisample(s.RENDERBUFFER,me,ye,A.width,A.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+Y,s.RENDERBUFFER,F.__webglColorRenderbuffer[Y])}s.bindRenderbuffer(s.RENDERBUFFER,null),A.depthBuffer&&(F.__webglDepthRenderbuffer=s.createRenderbuffer(),Ke(F.__webglDepthRenderbuffer,A,!0)),t.bindFramebuffer(s.FRAMEBUFFER,null)}}if(le){t.bindTexture(s.TEXTURE_CUBE_MAP,G.__webglTexture),Ze(s.TEXTURE_CUBE_MAP,v);for(let Y=0;Y<6;Y++)if(v.mipmaps&&v.mipmaps.length>0)for(let Q=0;Q<v.mipmaps.length;Q++)Ae(F.__webglFramebuffer[Y][Q],A,v,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+Y,Q);else Ae(F.__webglFramebuffer[Y],A,v,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+Y,0);m(v)&&M(s.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(he){for(let Y=0,Q=K.length;Y<Q;Y++){const pe=K[Y],Fe=n.get(pe);let ye=s.TEXTURE_2D;(A.isWebGL3DRenderTarget||A.isWebGLArrayRenderTarget)&&(ye=A.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),t.bindTexture(ye,Fe.__webglTexture),Ze(ye,pe),Ae(F.__webglFramebuffer,A,pe,s.COLOR_ATTACHMENT0+Y,ye,0),m(pe)&&M(ye)}t.unbindTexture()}else{let Y=s.TEXTURE_2D;if((A.isWebGL3DRenderTarget||A.isWebGLArrayRenderTarget)&&(Y=A.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),t.bindTexture(Y,G.__webglTexture),Ze(Y,v),v.mipmaps&&v.mipmaps.length>0)for(let Q=0;Q<v.mipmaps.length;Q++)Ae(F.__webglFramebuffer[Q],A,v,s.COLOR_ATTACHMENT0,Y,Q);else Ae(F.__webglFramebuffer,A,v,s.COLOR_ATTACHMENT0,Y,0);m(v)&&M(Y),t.unbindTexture()}A.depthBuffer&&te(A)}function oe(A){const v=A.textures;for(let F=0,G=v.length;F<G;F++){const K=v[F];if(m(K)){const le=T(A),he=n.get(K).__webglTexture;t.bindTexture(le,he),M(le),t.unbindTexture()}}}const ue=[],Ge=[];function He(A){if(A.samples>0){if(Qe(A)===!1){const v=A.textures,F=A.width,G=A.height;let K=s.COLOR_BUFFER_BIT;const le=A.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,he=n.get(A),Y=v.length>1;if(Y)for(let pe=0;pe<v.length;pe++)t.bindFramebuffer(s.FRAMEBUFFER,he.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+pe,s.RENDERBUFFER,null),t.bindFramebuffer(s.FRAMEBUFFER,he.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+pe,s.TEXTURE_2D,null,0);t.bindFramebuffer(s.READ_FRAMEBUFFER,he.__webglMultisampledFramebuffer);const Q=A.texture.mipmaps;Q&&Q.length>0?t.bindFramebuffer(s.DRAW_FRAMEBUFFER,he.__webglFramebuffer[0]):t.bindFramebuffer(s.DRAW_FRAMEBUFFER,he.__webglFramebuffer);for(let pe=0;pe<v.length;pe++){if(A.resolveDepthBuffer&&(A.depthBuffer&&(K|=s.DEPTH_BUFFER_BIT),A.stencilBuffer&&A.resolveStencilBuffer&&(K|=s.STENCIL_BUFFER_BIT)),Y){s.framebufferRenderbuffer(s.READ_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.RENDERBUFFER,he.__webglColorRenderbuffer[pe]);const Fe=n.get(v[pe]).__webglTexture;s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,Fe,0)}s.blitFramebuffer(0,0,F,G,0,0,F,G,K,s.NEAREST),c===!0&&(ue.length=0,Ge.length=0,ue.push(s.COLOR_ATTACHMENT0+pe),A.depthBuffer&&A.storeMultisampledDepthBuffer===!1&&(ue.push(le),Ge.push(le),s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,Ge)),s.invalidateFramebuffer(s.READ_FRAMEBUFFER,ue))}if(t.bindFramebuffer(s.READ_FRAMEBUFFER,null),t.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),Y)for(let pe=0;pe<v.length;pe++){t.bindFramebuffer(s.FRAMEBUFFER,he.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+pe,s.RENDERBUFFER,he.__webglColorRenderbuffer[pe]);const Fe=n.get(v[pe]).__webglTexture;t.bindFramebuffer(s.FRAMEBUFFER,he.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+pe,s.TEXTURE_2D,Fe,0)}t.bindFramebuffer(s.DRAW_FRAMEBUFFER,he.__webglMultisampledFramebuffer)}else if(A.depthBuffer&&A.storeMultisampledDepthBuffer===!1&&c){const v=A.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,[v])}}}function $e(A){return Math.min(i.maxSamples,A.samples)}function Qe(A){const v=n.get(A);return A.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&v.__useRenderToTexture!==!1}function R(A){const v=a.render.frame;h.get(A)!==v&&(h.set(A,v),A.update())}function xt(A,v){const F=A.colorSpace,G=A.format,K=A.type;return A.isCompressedTexture===!0||A.isVideoTexture===!0||F!==jr&&F!==gi&&(ut.getTransfer(F)===Mt?(G!==Sn||K!==pn)&&Je("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):vt("WebGLTextures: Unsupported texture color space:",F)),v}function ot(A){return typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement?(l.width=A.naturalWidth||A.width,l.height=A.naturalHeight||A.height):typeof VideoFrame<"u"&&A instanceof VideoFrame?(l.width=A.displayWidth,l.height=A.displayHeight):(l.width=A.width,l.height=A.height),l}this.allocateTextureUnit=$,this.resetTextureUnits=B,this.getTextureUnits=U,this.setTextureUnits=O,this.setTexture2D=ie,this.setTexture2DArray=q,this.setTexture3D=j,this.setTextureCube=ne,this.rebindTextures=re,this.setupRenderTarget=ae,this.updateRenderTargetMipmap=oe,this.updateMultisampleRenderTarget=He,this.setupDepthRenderbuffer=te,this.setupFrameBufferTexture=Ae,this.useMultisampledRTT=Qe,this.isReversedDepthBuffer=function(){return t.buffers.depth.getReversed()}}function s1(s,e){function t(n,i=gi){let r;const a=ut.getTransfer(i);if(n===pn)return s.UNSIGNED_BYTE;if(n===ul)return s.UNSIGNED_SHORT_4_4_4_4;if(n===dl)return s.UNSIGNED_SHORT_5_5_5_1;if(n===qh)return s.UNSIGNED_INT_5_9_9_9_REV;if(n===Kh)return s.UNSIGNED_INT_10F_11F_11F_REV;if(n===Wh)return s.BYTE;if(n===Xh)return s.SHORT;if(n===zs)return s.UNSIGNED_SHORT;if(n===hl)return s.INT;if(n===zn)return s.UNSIGNED_INT;if(n===Cn)return s.FLOAT;if(n===Gn)return s.HALF_FLOAT;if(n===$h)return s.ALPHA;if(n===Yh)return s.RGB;if(n===Sn)return s.RGBA;if(n===si)return s.DEPTH_COMPONENT;if(n===Ci)return s.DEPTH_STENCIL;if(n===fl)return s.RED;if(n===pl)return s.RED_INTEGER;if(n===Ii)return s.RG;if(n===ml)return s.RG_INTEGER;if(n===gl)return s.RGBA_INTEGER;if(n===Hr||n===zr||n===Gr||n===Vr)if(a===Mt)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===Hr)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===zr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Gr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Vr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===Hr)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===zr)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Gr)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Vr)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===So||n===Mo||n===bo||n===wo)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===So)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Mo)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===bo)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===wo)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Eo||n===To||n===Ao||n===Co||n===Po||n===Yr||n===Ro)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===Eo||n===To)return a===Mt?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===Ao)return a===Mt?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(n===Co)return r.COMPRESSED_R11_EAC;if(n===Po)return r.COMPRESSED_SIGNED_R11_EAC;if(n===Yr)return r.COMPRESSED_RG11_EAC;if(n===Ro)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(n===Lo||n===Io||n===Do||n===ko||n===Uo||n===No||n===Fo||n===Oo||n===Bo||n===Ho||n===zo||n===Go||n===Vo||n===Wo)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===Lo)return a===Mt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Io)return a===Mt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Do)return a===Mt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===ko)return a===Mt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Uo)return a===Mt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===No)return a===Mt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Fo)return a===Mt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Oo)return a===Mt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Bo)return a===Mt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Ho)return a===Mt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===zo)return a===Mt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Go)return a===Mt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Vo)return a===Mt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Wo)return a===Mt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Xo||n===qo||n===Ko)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===Xo)return a===Mt?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===qo)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Ko)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===$o||n===Yo||n===Jr||n===Jo)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===$o)return r.COMPRESSED_RED_RGTC1_EXT;if(n===Yo)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Jr)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Jo)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Gs?s.UNSIGNED_INT_24_8:s[n]!==void 0?s[n]:null}return{convert:t}}const r1=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,a1=`
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

}`;class o1{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const n=new au(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,n=new Rn({vertexShader:r1,fragmentShader:a1,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new je(new on(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class l1 extends Ni{constructor(e,t){super();const n=this;let i=null,r=1,a=null,o="local-floor",c=1,l=null,h=null,d=null,u=null,f=null,g=null;const S=typeof XRWebGLBinding<"u",p=new o1,m={},M=t.getContextAttributes();let T=null,_=null;const b=[],E=[],P=new ce;let x=null,w=null;const C=new cn;C.viewport=new Rt;const L=new cn;L.viewport=new Rt;const N=[C,L],B=new gp;let U=null,O=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(J){let ee=b[J];return ee===void 0&&(ee=new Ra,b[J]=ee),ee.getTargetRaySpace()},this.getControllerGrip=function(J){let ee=b[J];return ee===void 0&&(ee=new Ra,b[J]=ee),ee.getGripSpace()},this.getHand=function(J){let ee=b[J];return ee===void 0&&(ee=new Ra,b[J]=ee),ee.getHandSpace()};function $(J){const ee=E.indexOf(J.inputSource);if(ee===-1)return;const Me=b[ee];Me!==void 0&&(Me.update(J.inputSource,J.frame,l||a),Me.dispatchEvent({type:J.type,data:J.inputSource}))}function V(){i.removeEventListener("select",$),i.removeEventListener("selectstart",$),i.removeEventListener("selectend",$),i.removeEventListener("squeeze",$),i.removeEventListener("squeezestart",$),i.removeEventListener("squeezeend",$),i.removeEventListener("end",V),i.removeEventListener("inputsourceschange",ie);for(let J=0;J<b.length;J++){const ee=E[J];ee!==null&&(E[J]=null,b[J].disconnect(ee))}U=null,O=null,p.reset();for(const J in m)delete m[J];if(e.setRenderTarget(T),f=null,u=null,d=null,i=null,_=null,ft.stop(),n.isPresenting=!1,e.setPixelRatio(x),e.setSize(P.width,P.height,!1),w!==null){const J=w.camera;J.fov=w.fov,J.zoom=w.zoom,J.updateProjectionMatrix(),w=null}n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(J){r=J,n.isPresenting===!0&&Je("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(J){o=J,n.isPresenting===!0&&Je("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||a},this.setReferenceSpace=function(J){l=J},this.getBaseLayer=function(){return u!==null?u:f},this.getBinding=function(){return d===null&&S&&(d=new XRWebGLBinding(i,t)),d},this.getFrame=function(){return g},this.getSession=function(){return i},this.setSession=async function(J){if(i=J,i!==null){if(T=e.getRenderTarget(),i.addEventListener("select",$),i.addEventListener("selectstart",$),i.addEventListener("selectend",$),i.addEventListener("squeeze",$),i.addEventListener("squeezestart",$),i.addEventListener("squeezeend",$),i.addEventListener("end",V),i.addEventListener("inputsourceschange",ie),M.xrCompatible!==!0&&await t.makeXRCompatible(),x=e.getPixelRatio(),e.getSize(P),S&&"createProjectionLayer"in XRWebGLBinding.prototype){let Me=null,We=null,Ae=null;M.depth&&(Ae=M.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,Me=M.stencil?Ci:si,We=M.stencil?Gs:zn);const Ke={colorFormat:t.RGBA8,depthFormat:Ae,scaleFactor:r};d=this.getBinding(),u=d.createProjectionLayer(Ke),i.updateRenderState({layers:[u]}),e.setPixelRatio(1),e.setSize(u.textureWidth,u.textureHeight,!1),_=new Pn(u.textureWidth,u.textureHeight,{format:Sn,type:pn,depthTexture:new Xs(u.textureWidth,u.textureHeight,We,void 0,void 0,void 0,void 0,void 0,void 0,Me),stencilBuffer:M.stencil,colorSpace:e.outputColorSpace,samples:M.antialias?4:0,resolveDepthBuffer:u.ignoreDepthValues===!1,resolveStencilBuffer:u.ignoreDepthValues===!1,storeMultisampledDepthBuffer:u.ignoreDepthValues===!1,storeMultisampledStencilBuffer:u.ignoreDepthValues===!1})}else{const Me={antialias:M.antialias,alpha:!0,depth:M.depth,stencil:M.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(i,t,Me),i.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),_=new Pn(f.framebufferWidth,f.framebufferHeight,{format:Sn,type:pn,colorSpace:e.outputColorSpace,stencilBuffer:M.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1,storeMultisampledDepthBuffer:f.ignoreDepthValues===!1,storeMultisampledStencilBuffer:f.ignoreDepthValues===!1})}_.isXRRenderTarget=!0,this.setFoveation(c),l=null,a=await i.requestReferenceSpace(o),ft.setContext(i),ft.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(i!==null)return i.environmentBlendMode},this.getDepthTexture=function(){return p.getDepthTexture()};function ie(J){for(let ee=0;ee<J.removed.length;ee++){const Me=J.removed[ee],We=E.indexOf(Me);We>=0&&(E[We]=null,b[We].disconnect(Me))}for(let ee=0;ee<J.added.length;ee++){const Me=J.added[ee];let We=E.indexOf(Me);if(We===-1){for(let Ke=0;Ke<b.length;Ke++)if(Ke>=E.length){E.push(Me),We=Ke;break}else if(E[Ke]===null){E[Ke]=Me,We=Ke;break}if(We===-1)break}const Ae=b[We];Ae&&Ae.connect(Me)}}const q=new I,j=new I;function ne(J,ee,Me){q.setFromMatrixPosition(ee.matrixWorld),j.setFromMatrixPosition(Me.matrixWorld);const We=q.distanceTo(j),Ae=ee.projectionMatrix.elements,Ke=Me.projectionMatrix.elements,St=Ae[14]/(Ae[10]-1),te=Ae[14]/(Ae[10]+1),re=(Ae[9]+1)/Ae[5],ae=(Ae[9]-1)/Ae[5],oe=(Ae[8]-1)/Ae[0],ue=(Ke[8]+1)/Ke[0],Ge=St*oe,He=St*ue,$e=We/(-oe+ue),Qe=$e*-oe;if(ee.matrixWorld.decompose(J.position,J.quaternion,J.scale),J.translateX(Qe),J.translateZ($e),J.matrixWorld.compose(J.position,J.quaternion,J.scale),J.matrixWorldInverse.copy(J.matrixWorld).invert(),Ae[10]===-1)J.projectionMatrix.copy(ee.projectionMatrix),J.projectionMatrixInverse.copy(ee.projectionMatrixInverse);else{const R=St+$e,xt=te+$e,ot=Ge-Qe,A=He+(We-Qe),v=re*te/xt*R,F=ae*te/xt*R;J.projectionMatrix.makePerspective(ot,A,v,F,R,xt),J.projectionMatrixInverse.copy(J.projectionMatrix).invert()}}function xe(J,ee){ee===null?J.matrixWorld.copy(J.matrix):J.matrixWorld.multiplyMatrices(ee.matrixWorld,J.matrix),J.matrixWorldInverse.copy(J.matrixWorld).invert()}this.updateCamera=function(J){if(i===null)return;let ee=J.near,Me=J.far;p.texture!==null&&(p.depthNear>0&&(ee=p.depthNear),p.depthFar>0&&(Me=p.depthFar)),B.near=L.near=C.near=ee,B.far=L.far=C.far=Me,(U!==B.near||O!==B.far)&&(i.updateRenderState({depthNear:B.near,depthFar:B.far}),U=B.near,O=B.far),B.layers.mask=J.layers.mask|6,C.layers.mask=B.layers.mask&-5,L.layers.mask=B.layers.mask&-3;const We=J.parent,Ae=B.cameras;xe(B,We);for(let Ke=0;Ke<Ae.length;Ke++)xe(Ae[Ke],We);Ae.length===2?ne(B,C,L):B.projectionMatrix.copy(C.projectionMatrix),w===null&&J.isPerspectiveCamera&&(w={camera:J,fov:J.fov,zoom:J.zoom}),_e(J,B,We)};function _e(J,ee,Me){Me===null?J.matrix.copy(ee.matrixWorld):(J.matrix.copy(Me.matrixWorld),J.matrix.invert(),J.matrix.multiply(ee.matrixWorld)),J.matrix.decompose(J.position,J.quaternion,J.scale),J.updateMatrixWorld(!0),J.projectionMatrix.copy(ee.projectionMatrix),J.projectionMatrixInverse.copy(ee.projectionMatrixInverse),J.isPerspectiveCamera&&(J.fov=Zo*2*Math.atan(1/J.projectionMatrix.elements[5]),J.zoom=1)}this.getCamera=function(){return B},this.getFoveation=function(){if(!(u===null&&f===null))return c},this.setFoveation=function(J){c=J,u!==null&&(u.fixedFoveation=J),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=J)},this.hasDepthSensing=function(){return p.texture!==null},this.getDepthSensingMesh=function(){return p.getMesh(B)},this.getCameraTexture=function(J){return m[J]};let tt=null;function Ze(J,ee){if(h=ee.getViewerPose(l||a),g=ee,h!==null){const Me=h.views;f!==null&&(e.setRenderTargetFramebuffer(_,f.framebuffer),e.setRenderTarget(_));let We=!1;Me.length!==B.cameras.length&&(B.cameras.length=0,We=!0);for(let te=0;te<Me.length;te++){const re=Me[te];let ae=null;if(f!==null)ae=f.getViewport(re);else{const ue=d.getViewSubImage(u,re);ae=ue.viewport,te===0&&(e.setRenderTargetTextures(_,ue.colorTexture,ue.depthStencilTexture),e.setRenderTarget(_))}let oe=N[te];oe===void 0&&(oe=new cn,oe.layers.enable(te),oe.viewport=new Rt,N[te]=oe),oe.matrix.fromArray(re.transform.matrix),oe.matrix.decompose(oe.position,oe.quaternion,oe.scale),oe.projectionMatrix.fromArray(re.projectionMatrix),oe.projectionMatrixInverse.copy(oe.projectionMatrix).invert(),oe.viewport.set(ae.x,ae.y,ae.width,ae.height),te===0&&(B.matrix.copy(oe.matrix),B.matrix.decompose(B.position,B.quaternion,B.scale)),We===!0&&B.cameras.push(oe)}const Ae=i.enabledFeatures;if(Ae&&Ae.includes("depth-sensing")&&i.depthUsage=="gpu-optimized"&&S){d=n.getBinding();const te=d.getDepthInformation(Me[0]);te&&te.isValid&&te.texture&&p.init(te,i.renderState)}if(Ae&&Ae.includes("camera-access")&&S){e.state.unbindTexture(),d=n.getBinding();for(let te=0;te<Me.length;te++){const re=Me[te].camera;if(re){let ae=m[re];ae||(ae=new au,m[re]=ae);const oe=d.getCameraImage(re);ae.sourceTexture=oe}}}}for(let Me=0;Me<b.length;Me++){const We=E[Me],Ae=b[Me];We!==null&&Ae!==void 0&&Ae.update(We,ee,l||a)}tt&&tt(J,ee),ee.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:ee}),g=null}const ft=new _u;ft.setAnimationLoop(Ze),this.setAnimationLoop=function(J){tt=J},this.dispose=function(){}}}const c1=new Et,Tu=new et;Tu.set(-1,0,0,0,1,0,0,0,1);function h1(s,e){function t(p,m){p.matrixAutoUpdate===!0&&p.updateMatrix(),m.value.copy(p.matrix)}function n(p,m){m.color.getRGB(p.fogColor.value,mu(s)),m.isFog?(p.fogNear.value=m.near,p.fogFar.value=m.far):m.isFogExp2&&(p.fogDensity.value=m.density)}function i(p,m,M,T,_){m.isNodeMaterial?m.uniformsNeedUpdate=!1:m.isMeshBasicMaterial?r(p,m):m.isMeshLambertMaterial?(r(p,m),m.envMap&&(p.envMapIntensity.value=m.envMapIntensity)):m.isMeshToonMaterial?(r(p,m),d(p,m)):m.isMeshPhongMaterial?(r(p,m),h(p,m),m.envMap&&(p.envMapIntensity.value=m.envMapIntensity)):m.isMeshStandardMaterial?(r(p,m),u(p,m),m.isMeshPhysicalMaterial&&f(p,m,_)):m.isMeshMatcapMaterial?(r(p,m),g(p,m)):m.isMeshDepthMaterial?r(p,m):m.isMeshDistanceMaterial?(r(p,m),S(p,m)):m.isMeshNormalMaterial?r(p,m):m.isLineBasicMaterial?(a(p,m),m.isLineDashedMaterial&&o(p,m)):m.isPointsMaterial?c(p,m,M,T):m.isSpriteMaterial?l(p,m):m.isShadowMaterial?(p.color.value.copy(m.color),p.opacity.value=m.opacity):m.isShaderMaterial&&(m.uniformsNeedUpdate=!1)}function r(p,m){p.opacity.value=m.opacity,m.color&&p.diffuse.value.copy(m.color),m.emissive&&p.emissive.value.copy(m.emissive).multiplyScalar(m.emissiveIntensity),m.map&&(p.map.value=m.map,t(m.map,p.mapTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,t(m.alphaMap,p.alphaMapTransform)),m.bumpMap&&(p.bumpMap.value=m.bumpMap,t(m.bumpMap,p.bumpMapTransform),p.bumpScale.value=m.bumpScale,m.side===en&&(p.bumpScale.value*=-1)),m.normalMap&&(p.normalMap.value=m.normalMap,t(m.normalMap,p.normalMapTransform),p.normalScale.value.copy(m.normalScale),m.side===en&&p.normalScale.value.negate()),m.displacementMap&&(p.displacementMap.value=m.displacementMap,t(m.displacementMap,p.displacementMapTransform),p.displacementScale.value=m.displacementScale,p.displacementBias.value=m.displacementBias),m.emissiveMap&&(p.emissiveMap.value=m.emissiveMap,t(m.emissiveMap,p.emissiveMapTransform)),m.specularMap&&(p.specularMap.value=m.specularMap,t(m.specularMap,p.specularMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest);const M=e.get(m),T=M.envMap,_=M.envMapRotation;T&&(p.envMap.value=T,p.envMapRotation.value.setFromMatrix4(c1.makeRotationFromEuler(_)).transpose(),T.isCubeTexture&&T.isRenderTargetTexture===!1&&p.envMapRotation.value.premultiply(Tu),p.reflectivity.value=m.reflectivity,p.ior.value=m.ior,p.refractionRatio.value=m.refractionRatio),m.lightMap&&(p.lightMap.value=m.lightMap,p.lightMapIntensity.value=m.lightMapIntensity,t(m.lightMap,p.lightMapTransform)),m.aoMap&&(p.aoMap.value=m.aoMap,p.aoMapIntensity.value=m.aoMapIntensity,t(m.aoMap,p.aoMapTransform))}function a(p,m){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,m.map&&(p.map.value=m.map,t(m.map,p.mapTransform))}function o(p,m){p.dashSize.value=m.dashSize,p.totalSize.value=m.dashSize+m.gapSize,p.scale.value=m.scale}function c(p,m,M,T){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,p.size.value=m.size*M,p.scale.value=T*.5,m.map&&(p.map.value=m.map,t(m.map,p.uvTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,t(m.alphaMap,p.alphaMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest)}function l(p,m){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,p.rotation.value=m.rotation,m.map&&(p.map.value=m.map,t(m.map,p.mapTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,t(m.alphaMap,p.alphaMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest)}function h(p,m){p.specular.value.copy(m.specular),p.shininess.value=Math.max(m.shininess,1e-4)}function d(p,m){m.gradientMap&&(p.gradientMap.value=m.gradientMap)}function u(p,m){p.metalness.value=m.metalness,m.metalnessMap&&(p.metalnessMap.value=m.metalnessMap,t(m.metalnessMap,p.metalnessMapTransform)),p.roughness.value=m.roughness,m.roughnessMap&&(p.roughnessMap.value=m.roughnessMap,t(m.roughnessMap,p.roughnessMapTransform)),m.envMap&&(p.envMapIntensity.value=m.envMapIntensity)}function f(p,m,M){p.ior.value=m.ior,m.sheen>0&&(p.sheenColor.value.copy(m.sheenColor).multiplyScalar(m.sheen),p.sheenRoughness.value=m.sheenRoughness,m.sheenColorMap&&(p.sheenColorMap.value=m.sheenColorMap,t(m.sheenColorMap,p.sheenColorMapTransform)),m.sheenRoughnessMap&&(p.sheenRoughnessMap.value=m.sheenRoughnessMap,t(m.sheenRoughnessMap,p.sheenRoughnessMapTransform))),m.clearcoat>0&&(p.clearcoat.value=m.clearcoat,p.clearcoatRoughness.value=m.clearcoatRoughness,m.clearcoatMap&&(p.clearcoatMap.value=m.clearcoatMap,t(m.clearcoatMap,p.clearcoatMapTransform)),m.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=m.clearcoatRoughnessMap,t(m.clearcoatRoughnessMap,p.clearcoatRoughnessMapTransform)),m.clearcoatNormalMap&&(p.clearcoatNormalMap.value=m.clearcoatNormalMap,t(m.clearcoatNormalMap,p.clearcoatNormalMapTransform),p.clearcoatNormalScale.value.copy(m.clearcoatNormalScale),m.side===en&&p.clearcoatNormalScale.value.negate())),m.dispersion>0&&(p.dispersion.value=m.dispersion),m.retroreflectivity>0&&(p.retroreflectivity.value=m.retroreflectivity),m.iridescence>0&&(p.iridescence.value=m.iridescence,p.iridescenceIOR.value=m.iridescenceIOR,p.iridescenceThicknessMinimum.value=m.iridescenceThicknessRange[0],p.iridescenceThicknessMaximum.value=m.iridescenceThicknessRange[1],m.iridescenceMap&&(p.iridescenceMap.value=m.iridescenceMap,t(m.iridescenceMap,p.iridescenceMapTransform)),m.iridescenceThicknessMap&&(p.iridescenceThicknessMap.value=m.iridescenceThicknessMap,t(m.iridescenceThicknessMap,p.iridescenceThicknessMapTransform))),m.transmission>0&&(p.transmission.value=m.transmission,p.transmissionSamplerMap.value=M.texture,p.transmissionSamplerSize.value.set(M.width,M.height),m.transmissionMap&&(p.transmissionMap.value=m.transmissionMap,t(m.transmissionMap,p.transmissionMapTransform)),p.thickness.value=m.thickness,m.thicknessMap&&(p.thicknessMap.value=m.thicknessMap,t(m.thicknessMap,p.thicknessMapTransform)),p.attenuationDistance.value=m.attenuationDistance,p.attenuationColor.value.copy(m.attenuationColor)),m.anisotropy>0&&(p.anisotropyVector.value.set(m.anisotropy*Math.cos(m.anisotropyRotation),m.anisotropy*Math.sin(m.anisotropyRotation)),m.anisotropyMap&&(p.anisotropyMap.value=m.anisotropyMap,t(m.anisotropyMap,p.anisotropyMapTransform))),p.specularIntensity.value=m.specularIntensity,p.specularColor.value.copy(m.specularColor),m.specularColorMap&&(p.specularColorMap.value=m.specularColorMap,t(m.specularColorMap,p.specularColorMapTransform)),m.specularIntensityMap&&(p.specularIntensityMap.value=m.specularIntensityMap,t(m.specularIntensityMap,p.specularIntensityMapTransform))}function g(p,m){m.matcap&&(p.matcap.value=m.matcap)}function S(p,m){const M=e.get(m).light;p.referencePosition.value.setFromMatrixPosition(M.matrixWorld),p.nearDistance.value=M.shadow.camera.near,p.farDistance.value=M.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:i}}function u1(s,e,t,n){let i={},r={},a=[];const o=s.getParameter(s.MAX_UNIFORM_BUFFER_BINDINGS);function c(_,b){const E=b.program;n.uniformBlockBinding(_,E)}function l(_,b){let E=i[_.id];E===void 0&&(p(_),E=h(_),i[_.id]=E,_.addEventListener("dispose",M));const P=b.program;n.updateUBOMapping(_,P);const x=e.render.frame;r[_.id]!==x&&(u(_),r[_.id]=x)}function h(_){const b=d();_.__bindingPointIndex=b;const E=s.createBuffer(),P=_.__size,x=_.usage;return s.bindBuffer(s.UNIFORM_BUFFER,E),s.bufferData(s.UNIFORM_BUFFER,P,x),s.bindBuffer(s.UNIFORM_BUFFER,null),s.bindBufferBase(s.UNIFORM_BUFFER,b,E),E}function d(){for(let _=0;_<o;_++)if(a.indexOf(_)===-1)return a.push(_),_;return vt("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function u(_){const b=i[_.id],E=_.uniforms,P=_.__cache;s.bindBuffer(s.UNIFORM_BUFFER,b);for(let x=0,w=E.length;x<w;x++){const C=E[x];if(Array.isArray(C))for(let L=0,N=C.length;L<N;L++)f(C[L],x,L,P);else f(C,x,0,P)}s.bindBuffer(s.UNIFORM_BUFFER,null)}function f(_,b,E,P){if(S(_,b,E,P)===!0){const x=_.__offset,w=_.value;if(Array.isArray(w)){let C=0;for(let L=0;L<w.length;L++){const N=w[L],B=m(N);g(N,_.__data,C),typeof N!="number"&&typeof N!="boolean"&&!N.isMatrix3&&!ArrayBuffer.isView(N)&&(C+=B.storage/Float32Array.BYTES_PER_ELEMENT)}}else g(w,_.__data,0);s.bufferSubData(s.UNIFORM_BUFFER,x,_.__data)}}function g(_,b,E){typeof _=="number"||typeof _=="boolean"?b[0]=_:_.isMatrix3?(b[0]=_.elements[0],b[1]=_.elements[1],b[2]=_.elements[2],b[3]=0,b[4]=_.elements[3],b[5]=_.elements[4],b[6]=_.elements[5],b[7]=0,b[8]=_.elements[6],b[9]=_.elements[7],b[10]=_.elements[8],b[11]=0):ArrayBuffer.isView(_)?b.set(new _.constructor(_.buffer,_.byteOffset,b.length)):_.toArray(b,E)}function S(_,b,E,P){const x=_.value,w=b+"_"+E;if(P[w]===void 0)return typeof x=="number"||typeof x=="boolean"?P[w]=x:ArrayBuffer.isView(x)?P[w]=x.slice():P[w]=x.clone(),!0;{const C=P[w];if(typeof x=="number"||typeof x=="boolean"){if(C!==x)return P[w]=x,!0}else{if(ArrayBuffer.isView(x))return!0;if(C.equals(x)===!1)return C.copy(x),!0}}return!1}function p(_){const b=_.uniforms;let E=0;const P=16;for(let w=0,C=b.length;w<C;w++){const L=Array.isArray(b[w])?b[w]:[b[w]];for(let N=0,B=L.length;N<B;N++){const U=L[N],O=Array.isArray(U.value)?U.value:[U.value];for(let $=0,V=O.length;$<V;$++){const ie=O[$],q=m(ie),j=E%P,ne=j%q.boundary,xe=j+ne;E+=ne,xe!==0&&P-xe<q.storage&&(E+=P-xe),U.__data=new Float32Array(q.storage/Float32Array.BYTES_PER_ELEMENT),U.__offset=E,E+=q.storage}}}const x=E%P;return x>0&&(E+=P-x),_.__size=E,_.__cache={},this}function m(_){const b={boundary:0,storage:0};return typeof _=="number"||typeof _=="boolean"?(b.boundary=4,b.storage=4):_.isVector2?(b.boundary=8,b.storage=8):_.isVector3||_.isColor?(b.boundary=16,b.storage=12):_.isVector4?(b.boundary=16,b.storage=16):_.isMatrix3?(b.boundary=48,b.storage=48):_.isMatrix4?(b.boundary=64,b.storage=64):_.isTexture?Je("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(_)?(b.boundary=16,b.storage=_.byteLength):Je("WebGLRenderer: Unsupported uniform value type.",_),b}function M(_){const b=_.target;b.removeEventListener("dispose",M);const E=a.indexOf(b.__bindingPointIndex);a.splice(E,1),s.deleteBuffer(i[b.id]),delete i[b.id],delete r[b.id]}function T(){for(const _ in i)s.deleteBuffer(i[_]);a=[],i={},r={}}return{bind:c,update:l,dispose:T}}const d1=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let kn=null;function f1(){return kn===null&&(kn=new Sl(d1,16,16,Ii,Gn),kn.name="DFG_LUT",kn.minFilter=Qt,kn.magFilter=Qt,kn.wrapS=ei,kn.wrapT=ei,kn.generateMipmaps=!1,kn.needsUpdate=!0),kn}class Au{constructor(e={}){const{canvas:t=jd(),context:n=null,depth:i=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:d=!1,reversedDepthBuffer:u=!1,outputBufferType:f=pn}=e;this.isWebGLRenderer=!0;let g;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");g=n.getContextAttributes().alpha}else g=a;const S=f,p=new Set([gl,ml,pl]),m=new Set([pn,zn,zs,Gs,ul,dl]),M=new Uint32Array(4),T=new Int32Array(4),_=new I;let b=null,E=null;const P=[],x=[];let w=null;this.domElement=t,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Bn,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const C=this;let L=!1,N=null,B=null,U=null,O=null;this._outputColorSpace=jt;let $=0,V=0,ie=null,q=-1,j=null;const ne=new Rt,xe=new Rt;let _e=null;const tt=new qe(0);let Ze=0,ft=t.width,J=t.height,ee=1,Me=null,We=null;const Ae=new Rt(0,0,ft,J),Ke=new Rt(0,0,ft,J);let St=!1;const te=new Ml;let re=!1,ae=!1;const oe=new Et,ue=new I,Ge=new Rt,He={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let $e=!1;function Qe(){return ie===null?ee:1}let R=n;function xt(y,D){return t.getContext(y,D)}let ot,A,v,F,G,K,le,he,Y,Q,pe,Fe,ye,me,Oe,Ve,nt,k,ge,Z,ve,Ee,se;try{const y={alpha:!0,depth:i,stencil:r,antialias:o,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:h,failIfMajorPerformanceCaveat:d};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${cl}`),t.addEventListener("webglcontextlost",Tt,!1),t.addEventListener("webglcontextrestored",_t,!1),t.addEventListener("webglcontextcreationerror",Mn,!1),R===null){const D="webgl2";if(R=xt(D,y),R===null)throw xt(D)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}Be()}catch(y){throw t.removeEventListener("webglcontextlost",Tt,!1),t.removeEventListener("webglcontextrestored",_t,!1),t.removeEventListener("webglcontextcreationerror",Mn,!1),vt("WebGLRenderer: "+y.message),y}function Be(){ot=new fg(R),ot.init(),ve=new s1(R,ot),A=new ig(R,ot,e,ve),v=new n1(R,ot),A.reversedDepthBuffer&&u&&v.buffers.depth.setReversed(!0),B=R.createFramebuffer(),U=R.createFramebuffer(),O=R.createFramebuffer(),F=new gg(R),G=new Gv,K=new i1(R,ot,v,G,A,ve,F),le=new dg(C),he=new xp(R),Ee=new tg(R,he),Y=new pg(R,he,F,Ee),Q=new xg(R,Y,he,Ee,F),k=new vg(R,A,K),Oe=new sg(G),pe=new zv(C,le,ot,A,Ee,Oe),Fe=new h1(C,G),ye=new Wv,me=new Jv(ot),nt=new eg(C,le,v,Q,g,c),Ve=new t1(C,Q,A),se=new u1(R,F,A,v),ge=new ng(R,ot,F),Z=new mg(R,ot,F),F.programs=pe.programs,C.capabilities=A,C.extensions=ot,C.properties=G,C.renderLists=ye,C.shadowMap=Ve,C.state=v,C.info=F}S!==pn&&(w=new yg(S,t.width,t.height,o,i,r));const ke=new l1(C,R);this.xr=ke,this.getContext=function(){return R},this.getContextAttributes=function(){return R.getContextAttributes()},this.forceContextLoss=function(){const y=ot.get("WEBGL_lose_context");y&&y.loseContext()},this.forceContextRestore=function(){const y=ot.get("WEBGL_lose_context");y&&y.restoreContext()},this.getPixelRatio=function(){return ee},this.setPixelRatio=function(y){y!==void 0&&(ee=y,this.setSize(ft,J,!1))},this.getSize=function(y){return y.set(ft,J)},this.setSize=function(y,D,W=!0){if(ke.isPresenting){Je("WebGLRenderer: Can't change size while VR device is presenting.");return}ft=y,J=D,t.width=Math.floor(y*ee),t.height=Math.floor(D*ee),W===!0&&(t.style.width=y+"px",t.style.height=D+"px"),w!==null&&w.setSize(t.width,t.height),this.setViewport(0,0,y,D)},this.getDrawingBufferSize=function(y){return y.set(ft*ee,J*ee).floor()},this.setDrawingBufferSize=function(y,D,W){ft=y,J=D,ee=W,t.width=Math.floor(y*W),t.height=Math.floor(D*W),this.setViewport(0,0,y,D)},this.setEffects=function(y){if(S===pn){vt("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(y){for(let D=0;D<y.length;D++)if(y[D].isOutputPass===!0){Je("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}w.setEffects(y||[])},this.getCurrentViewport=function(y){return y.copy(ne)},this.getViewport=function(y){return y.copy(Ae)},this.setViewport=function(y,D,W,H){y.isVector4?Ae.set(y.x,y.y,y.z,y.w):Ae.set(y,D,W,H),v.viewport(ne.copy(Ae).multiplyScalar(ee).round())},this.getScissor=function(y){return y.copy(Ke)},this.setScissor=function(y,D,W,H){y.isVector4?Ke.set(y.x,y.y,y.z,y.w):Ke.set(y,D,W,H),v.scissor(xe.copy(Ke).multiplyScalar(ee).round())},this.getScissorTest=function(){return St},this.setScissorTest=function(y){v.setScissorTest(St=y)},this.setOpaqueSort=function(y){Me=y},this.setTransparentSort=function(y){We=y},this.getClearColor=function(y){return y.copy(nt.getClearColor())},this.setClearColor=function(){nt.setClearColor(...arguments)},this.getClearAlpha=function(){return nt.getClearAlpha()},this.setClearAlpha=function(){nt.setClearAlpha(...arguments)},this.clear=function(y=!0,D=!0,W=!0){let H=0;if(y){let z=!1;if(ie!==null){const we=ie.texture.format;z=p.has(we)}if(z){const we=ie.texture.type,Pe=m.has(we),be=nt.getClearColor(),Ie=nt.getClearAlpha(),Ne=be.r,it=be.g,lt=be.b;Pe?(M[0]=Ne,M[1]=it,M[2]=lt,M[3]=Ie,R.clearBufferuiv(R.COLOR,0,M)):(T[0]=Ne,T[1]=it,T[2]=lt,T[3]=Ie,R.clearBufferiv(R.COLOR,0,T))}else H|=R.COLOR_BUFFER_BIT}D&&(H|=R.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),W&&(H|=R.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),H!==0&&R.clear(H)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(y){y.setRenderer(this),N=y},this.dispose=function(){t.removeEventListener("webglcontextlost",Tt,!1),t.removeEventListener("webglcontextrestored",_t,!1),t.removeEventListener("webglcontextcreationerror",Mn,!1),nt.dispose(),ye.dispose(),me.dispose(),G.dispose(),le.dispose(),Q.dispose(),Ee.dispose(),se.dispose(),pe.dispose(),ke.dispose(),ke.removeEventListener("sessionstart",Vl),ke.removeEventListener("sessionend",Wl),_i.stop()};function Tt(y){y.preventDefault(),cc("WebGLRenderer: Context Lost."),L=!0}function _t(){cc("WebGLRenderer: Context Restored."),L=!1;const y=F.autoReset,D=Ve.enabled,W=Ve.autoUpdate,H=Ve.needsUpdate,z=Ve.type;Be(),F.autoReset=y,Ve.enabled=D,Ve.autoUpdate=W,Ve.needsUpdate=H,Ve.type=z}function Mn(y){vt("WebGLRenderer: A WebGL context could not be created. Reason: ",y.statusMessage)}function Ln(y){const D=y.target;D.removeEventListener("dispose",Ln),Wu(D)}function Wu(y){Xu(y),G.remove(y)}function Xu(y){const D=G.get(y).programs;D!==void 0&&(D.forEach(function(W){pe.releaseProgram(W)}),y.isShaderMaterial&&pe.releaseShaderCache(y))}this.renderBufferDirect=function(y,D,W,H,z,we){D===null&&(D=He);const Pe=z.isMesh&&z.matrixWorld.determinantAffine()<0,be=$u(y,D,W,H,z);v.setMaterial(H,Pe);let Ie=W.index,Ne=1;if(H.wireframe===!0){if(Ie=Y.getWireframeAttribute(W),Ie===void 0)return;Ne=2}const it=W.drawRange,lt=W.attributes.position;let De=it.start*Ne,yt=(it.start+it.count)*Ne;we!==null&&(De=Math.max(De,we.start*Ne),yt=Math.min(yt,(we.start+we.count)*Ne)),Ie!==null?(De=Math.max(De,0),yt=Math.min(yt,Ie.count)):lt!=null&&(De=Math.max(De,0),yt=Math.min(yt,lt.count));const Ht=yt-De;if(Ht<0||Ht===1/0)return;Ee.setup(z,H,be,W,Ie);let Ct,wt=ge;if(Ie!==null&&(Ct=he.get(Ie),wt=Z,wt.setIndex(Ct)),z.isMesh)H.wireframe===!0?(v.setLineWidth(H.wireframeLinewidth*Qe()),wt.setMode(R.LINES)):wt.setMode(R.TRIANGLES);else if(z.isLine){let $t=H.linewidth;$t===void 0&&($t=1),v.setLineWidth($t*Qe()),z.isLineSegments?wt.setMode(R.LINES):z.isLineLoop?wt.setMode(R.LINE_LOOP):wt.setMode(R.LINE_STRIP)}else z.isPoints?wt.setMode(R.POINTS):z.isSprite&&wt.setMode(R.TRIANGLES);if(z.isBatchedMesh)if(ot.get("WEBGL_multi_draw"))wt.renderMultiDraw(z._multiDrawStarts,z._multiDrawCounts,z._multiDrawCount);else{const $t=z._multiDrawStarts,Ce=z._multiDrawCounts,nn=z._multiDrawCount,pt=Ie?he.get(Ie).bytesPerElement:1,xn=G.get(H).currentProgram.getUniforms();for(let In=0;In<nn;In++)xn.setValue(R,"_gl_DrawID",In),wt.render($t[In]/pt,Ce[In])}else if(z.isInstancedMesh)wt.renderInstances(De,Ht,z.count);else if(W.isInstancedBufferGeometry){const $t=W._maxInstanceCount!==void 0?W._maxInstanceCount:1/0,Ce=Math.min(W.instanceCount,$t);wt.renderInstances(De,Ht,Ce)}else wt.render(De,Ht)};function Gl(y,D,W,H){N!==null&&y.isNodeMaterial&&N.setObject(H,y),re===!0&&Oe.setState(y,W,!1),y.transparent===!0&&y.side===an&&y.forceSinglePass===!1?(y.side=en,y.needsUpdate=!0,nr(y,D,H),y.side=Ri,y.needsUpdate=!0,nr(y,D,H),y.side=an):nr(y,D,H)}this.compile=function(y,D,W=null){W===null&&(W=y),N!==null&&N.renderStart(y,D,W),E=me.get(W),E.init(D),x.push(E),W.traverseVisible(function(z){z.isLight&&z.layers.test(D.layers)&&(E.pushLight(z),z.castShadow&&E.pushShadow(z))}),y!==W&&y.traverseVisible(function(z){z.isLight&&z.layers.test(D.layers)&&(E.pushLight(z),z.castShadow&&E.pushShadow(z))}),E.setupLights(),N!==null&&N.updateLights(E.state.lightsArray),ae=this.localClippingEnabled,re=Oe.init(this.clippingPlanes,ae),re===!0&&Oe.setGlobalState(this.clippingPlanes,D),N!==null&&Ve.render(E.state.shadowsArray,W,D);const H=new Set;return y.traverse(function(z){if(!(z.isMesh||z.isPoints||z.isLine||z.isSprite))return;const we=z.material;if(we)if(Array.isArray(we))for(let Pe=0;Pe<we.length;Pe++){const be=we[Pe];Gl(be,W,D,z),H.add(be)}else Gl(we,W,D,z),H.add(we)}),E=x.pop(),N!==null&&N.renderEnd(),H},this.compileAsync=function(y,D,W=null){const H=this.compile(y,D,W);return new Promise(z=>{function we(){if(H.forEach(function(Pe){const Ie=G.get(Pe).currentProgram;(Ie===void 0||Ie.isReady())&&H.delete(Pe)}),H.size===0){z(y);return}setTimeout(we,10)}ot.get("KHR_parallel_shader_compile")!==null?we():setTimeout(we,10)})};let da=null;function qu(y){da&&da(y)}function Vl(){_i.stop()}function Wl(){_i.start()}const _i=new _u;_i.setAnimationLoop(qu),typeof self<"u"&&_i.setContext(self),this.setAnimationLoop=function(y){da=y,ke.setAnimationLoop(y),y===null?_i.stop():_i.start()},ke.addEventListener("sessionstart",Vl),ke.addEventListener("sessionend",Wl),this.render=function(y,D){if(D!==void 0&&D.isCamera!==!0){vt("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(L===!0)return;N!==null&&N.renderStart(y,D);const W=ke.enabled===!0&&ke.isPresenting===!0,H=w!==null&&(ie===null||W)&&w.begin(C,ie);if(y.matrixWorldAutoUpdate===!0&&y.updateMatrixWorld(),D.parent===null&&D.matrixWorldAutoUpdate===!0&&D.updateMatrixWorld(),ke.enabled===!0&&ke.isPresenting===!0&&(w===null||w.isCompositing()===!1)&&(ke.cameraAutoUpdate===!0&&ke.updateCamera(D),D=ke.getCamera()),y.isScene===!0&&y.onBeforeRender(C,y,D,ie),E=me.get(y,x.length),E.init(D),E.state.textureUnits=K.getTextureUnits(),x.push(E),oe.multiplyMatrices(D.projectionMatrix,D.matrixWorldInverse),te.setFromProjectionMatrix(oe,On,D.reversedDepth),ae=this.localClippingEnabled,re=Oe.init(this.clippingPlanes,ae),b=ye.get(y,P.length),b.init(),P.push(b),ke.enabled===!0&&ke.isPresenting===!0){const Pe=C.xr.getDepthSensingMesh();Pe!==null&&fa(Pe,D,-1/0,C.sortObjects)}fa(y,D,0,C.sortObjects),b.finish(),N!==null&&N.updateLights(E.state.lightsArray),C.sortObjects===!0&&b.sort(Me,We),$e=ke.enabled===!1||ke.isPresenting===!1||ke.hasDepthSensing()===!1,$e&&nt.addToRenderList(b,y),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),re===!0&&Oe.beginShadows();const z=E.state.shadowsArray;if(Ve.render(z,y,D),re===!0&&Oe.endShadows(),(H&&w.hasRenderPass())===!1){const Pe=b.opaque,be=b.transmissive;if(E.setupLights(),D.isArrayCamera){const Ie=D.cameras;if(be.length>0)for(let Ne=0,it=Ie.length;Ne<it;Ne++){const lt=Ie[Ne];ql(Pe,be,y,lt)}$e&&nt.render(y);for(let Ne=0,it=Ie.length;Ne<it;Ne++){const lt=Ie[Ne];Xl(b,y,lt,lt.viewport)}}else be.length>0&&ql(Pe,be,y,D),$e&&nt.render(y),Xl(b,y,D)}ie!==null&&V===0&&(K.updateMultisampleRenderTarget(ie),K.updateRenderTargetMipmap(ie)),H&&w.end(C),y.isScene===!0&&y.onAfterRender(C,y,D),Ee.resetDefaultState(),q=-1,j=null,x.pop(),x.length>0?(E=x[x.length-1],K.setTextureUnits(E.state.textureUnits),re===!0&&Oe.setGlobalState(C.clippingPlanes,E.state.camera)):E=null,P.pop(),P.length>0?b=P[P.length-1]:b=null,N!==null&&N.renderEnd()};function fa(y,D,W,H){if(y.visible===!1)return;if(y.layers.test(D.layers)){if(y.isGroup)W=y.renderOrder;else if(y.isLOD)y.autoUpdate===!0&&y.update(D);else if(y.isLightProbeGrid)E.pushLightProbeGrid(y);else if(y.isLight)E.pushLight(y),y.castShadow&&E.pushShadow(y);else if(y.isSprite){if(!y.frustumCulled||y.intersectsFrustum(te)){H&&Ge.setFromMatrixPosition(y.matrixWorld).applyMatrix4(oe);const Pe=Q.update(y),be=y.material;be.visible&&b.push(y,Pe,be,W,Ge.z,null,D)}}else if((y.isMesh||y.isLine||y.isPoints)&&(!y.frustumCulled||y.intersectsFrustum(te))){const Pe=Q.update(y),be=y.material;if(H&&(y.boundingSphere!==void 0?(y.boundingSphere===null&&y.computeBoundingSphere(),Ge.copy(y.boundingSphere.center)):(Pe.boundingSphere===null&&Pe.computeBoundingSphere(),Ge.copy(Pe.boundingSphere.center)),Ge.applyMatrix4(y.matrixWorld).applyMatrix4(oe)),Array.isArray(be)){const Ie=Pe.groups;for(let Ne=0,it=Ie.length;Ne<it;Ne++){const lt=Ie[Ne],De=be[lt.materialIndex];De&&De.visible&&b.push(y,Pe,De,W,Ge.z,lt,D)}}else be.visible&&b.push(y,Pe,be,W,Ge.z,null,D)}}const we=y.children;for(let Pe=0,be=we.length;Pe<be;Pe++)fa(we[Pe],D,W,H)}function Xl(y,D,W,H){const{opaque:z,transmissive:we,transparent:Pe}=y;E.setupLightsView(W),re===!0&&Oe.setGlobalState(C.clippingPlanes,W),H&&v.viewport(ne.copy(H)),z.length>0&&tr(z,D,W),we.length>0&&tr(we,D,W),Pe.length>0&&tr(Pe,D,W),v.buffers.depth.setTest(!0),v.buffers.depth.setMask(!0),v.buffers.color.setMask(!0),v.setPolygonOffset(!1)}function ql(y,D,W,H){if((W.isScene===!0?W.overrideMaterial:null)!==null)return;if(E.state.transmissionRenderTarget[H.id]===void 0){const De=ot.has("EXT_color_buffer_half_float")||ot.has("EXT_color_buffer_float");E.state.transmissionRenderTarget[H.id]=new Pn(1,1,{generateMipmaps:!0,type:De?Gn:pn,minFilter:Ai,samples:Math.max(4,A.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:ut.workingColorSpace})}const we=E.state.transmissionRenderTarget[H.id],Pe=H.viewport||ne;we.setSize(Pe.z*C.transmissionResolutionScale,Pe.w*C.transmissionResolutionScale);const be=C.getRenderTarget(),Ie=C.getActiveCubeFace(),Ne=C.getActiveMipmapLevel();C.setRenderTarget(we),C.getClearColor(tt),Ze=C.getClearAlpha(),Ze<1&&C.setClearColor(16777215,.5),C.clear(),$e&&nt.render(W);const it=C.toneMapping;C.toneMapping=Bn;const lt=H.viewport;if(H.viewport!==void 0&&(H.viewport=void 0),E.setupLightsView(H),re===!0&&Oe.setGlobalState(C.clippingPlanes,H),tr(y,W,H),K.updateMultisampleRenderTarget(we),K.updateRenderTargetMipmap(we),ot.has("WEBGL_multisampled_render_to_texture")===!1){let De=!1;for(let yt=0,Ht=D.length;yt<Ht;yt++){const Ct=D[yt],{object:wt,geometry:$t,material:Ce,group:nn}=Ct;if(Ce.side===an&&wt.layers.test(H.layers)){const pt=Ce.side;Ce.side=en,Ce.needsUpdate=!0,Kl(wt,W,H,$t,Ce,nn),Ce.side=pt,Ce.needsUpdate=!0,De=!0}}De===!0&&(K.updateMultisampleRenderTarget(we),K.updateRenderTargetMipmap(we))}C.setRenderTarget(be,Ie,Ne),C.setClearColor(tt,Ze),lt!==void 0&&(H.viewport=lt),C.toneMapping=it}function tr(y,D,W){const H=D.isScene===!0?D.overrideMaterial:null;for(let z=0,we=y.length;z<we;z++){const Pe=y[z],{object:be,geometry:Ie,group:Ne}=Pe;let it=Pe.material;it.allowOverride===!0&&H!==null&&(it=H),be.layers.test(W.layers)&&Kl(be,D,W,Ie,it,Ne)}}function Kl(y,D,W,H,z,we){N!==null&&z.isNodeMaterial&&N.setObject(y,z),y.onBeforeRender(C,D,W,H,z,we),y.modelViewMatrix.multiplyMatrices(W.matrixWorldInverse,y.matrixWorld),y.normalMatrix.getNormalMatrix(y.modelViewMatrix),z.onBeforeRender(C,D,W,H,y,we),z.transparent===!0&&z.side===an&&z.forceSinglePass===!1?(z.side=en,z.needsUpdate=!0,C.renderBufferDirect(W,D,H,z,y,we),z.side=Ri,z.needsUpdate=!0,C.renderBufferDirect(W,D,H,z,y,we),z.side=an):C.renderBufferDirect(W,D,H,z,y,we),y.onAfterRender(C,D,W,H,z,we)}function nr(y,D,W){D.isScene!==!0&&(D=He);const H=G.get(y),z=E.state.lights,we=E.state.shadowsArray,Pe=z.state.version,be=pe.getParameters(y,z.state,we,D,W,E.state.lightProbeGridArray),Ie=pe.getProgramCacheKey(be);let Ne=H.programs;H.environment=y.isMeshStandardMaterial||y.isMeshLambertMaterial||y.isMeshPhongMaterial?D.environment:null,H.fog=D.fog;const it=y.isMeshStandardMaterial||y.isMeshLambertMaterial&&!y.envMap||y.isMeshPhongMaterial&&!y.envMap;H.envMap=le.get(y.envMap||H.environment,it),H.envMapRotation=H.environment!==null&&y.envMap===null?D.environmentRotation:y.envMapRotation,Ne===void 0&&(y.addEventListener("dispose",Ln),Ne=new Map,H.programs=Ne);let lt=Ne.get(Ie);if(lt!==void 0){if(H.currentProgram===lt&&H.lightsStateVersion===Pe)return Yl(y,be),lt}else be.uniforms=pe.getUniforms(y),N!==null&&y.isNodeMaterial&&N.build(y,W,be),y.onBeforeCompile(be,C),lt=pe.acquireProgram(be,Ie),Ne.set(Ie,lt),H.uniforms=be.uniforms;const De=H.uniforms;return(!y.isShaderMaterial&&!y.isRawShaderMaterial||y.clipping===!0)&&(De.clippingPlanes=Oe.uniform),Yl(y,be),H.needsLights=Ju(y),H.lightsStateVersion=Pe,H.needsLights&&(De.ambientLightColor.value=z.state.ambient,De.lightProbe.value=z.state.probe,De.sunLights.value=z.state.sun,De.sunLightShadows.value=z.state.sunShadow,De.directionalLights.value=z.state.directional,De.directionalLightShadows.value=z.state.directionalShadow,De.spotLights.value=z.state.spot,De.spotLightShadows.value=z.state.spotShadow,De.rectAreaLights.value=z.state.rectArea,De.ltc_1.value=z.state.rectAreaLTC1,De.ltc_2.value=z.state.rectAreaLTC2,De.pointLights.value=z.state.point,De.pointLightShadows.value=z.state.pointShadow,De.hemisphereLights.value=z.state.hemi,De.sunShadowMatrix.value=z.state.sunShadowMatrix,De.sunShadowCascade.value=z.state.sunShadowCascade,De.directionalShadowMatrix.value=z.state.directionalShadowMatrix,De.spotLightMatrix.value=z.state.spotLightMatrix,De.spotLightMap.value=z.state.spotLightMap,De.pointShadowMatrix.value=z.state.pointShadowMatrix),H.lightProbeGrid=E.state.lightProbeGridArray.length>0,H.currentProgram=lt,H.uniformsList=null,lt}function $l(y){if(y.uniformsList===null){const D=y.currentProgram.getUniforms();y.uniformsList=Wr.seqWithValue(D.seq,y.uniforms)}return y.uniformsList}function Yl(y,D){const W=G.get(y);W.outputColorSpace=D.outputColorSpace,W.batching=D.batching,W.batchingColor=D.batchingColor,W.instancing=D.instancing,W.instancingColor=D.instancingColor,W.instancingMorph=D.instancingMorph,W.skinning=D.skinning,W.morphTargets=D.morphTargets,W.morphNormals=D.morphNormals,W.morphColors=D.morphColors,W.morphTargetsCount=D.morphTargetsCount,W.numClippingPlanes=D.numClippingPlanes,W.numIntersection=D.numClipIntersection,W.vertexAlphas=D.vertexAlphas,W.vertexTangents=D.vertexTangents,W.toneMapping=D.toneMapping}function Ku(y,D){if(y.length===0)return null;if(y.length===1)return y[0].texture!==null?y[0]:null;_.setFromMatrixPosition(D.matrixWorld);for(let W=0,H=y.length;W<H;W++){const z=y[W];if(z.texture!==null&&z.boundingBox.containsPoint(_))return z}return null}function $u(y,D,W,H,z){D.isScene!==!0&&(D=He),K.resetTextureUnits();const we=D.fog,Pe=H.isMeshStandardMaterial||H.isMeshLambertMaterial||H.isMeshPhongMaterial?D.environment:null,be=ie===null?C.outputColorSpace:ie.isXRRenderTarget===!0?ie.texture.colorSpace:ut.workingColorSpace,Ie=H.isMeshStandardMaterial||H.isMeshLambertMaterial&&!H.envMap||H.isMeshPhongMaterial&&!H.envMap,Ne=le.get(H.envMap||Pe,Ie),it=H.vertexColors===!0&&!!W.attributes.color&&W.attributes.color.itemSize===4,lt=!!W.attributes.tangent&&(!!H.normalMap||H.anisotropy>0),De=!!W.morphAttributes.position,yt=!!W.morphAttributes.normal,Ht=!!W.morphAttributes.color;let Ct=Bn;H.toneMapped&&(ie===null||ie.isXRRenderTarget===!0)&&(Ct=C.toneMapping);const wt=W.morphAttributes.position||W.morphAttributes.normal||W.morphAttributes.color,$t=wt!==void 0?wt.length:0,Ce=G.get(H),nn=E.state.lights;if(re===!0&&(ae===!0||y!==j)){const At=y===j&&H.id===q;Oe.setState(H,y,At)}let pt=!1;H.version===Ce.__version?(Ce.needsLights&&Ce.lightsStateVersion!==nn.state.version||Ce.outputColorSpace!==be||z.isBatchedMesh&&Ce.batching===!1||!z.isBatchedMesh&&Ce.batching===!0||z.isBatchedMesh&&Ce.batchingColor===!0&&z._colorsTexture===null||z.isBatchedMesh&&Ce.batchingColor===!1&&z._colorsTexture!==null||z.isInstancedMesh&&Ce.instancing===!1||!z.isInstancedMesh&&Ce.instancing===!0||z.isSkinnedMesh&&Ce.skinning===!1||!z.isSkinnedMesh&&Ce.skinning===!0||z.isInstancedMesh&&Ce.instancingColor===!0&&z.instanceColor===null||z.isInstancedMesh&&Ce.instancingColor===!1&&z.instanceColor!==null||z.isInstancedMesh&&Ce.instancingMorph===!0&&z.morphTexture===null||z.isInstancedMesh&&Ce.instancingMorph===!1&&z.morphTexture!==null||Ce.envMap!==Ne||H.fog===!0&&Ce.fog!==we||Ce.numClippingPlanes!==void 0&&(Ce.numClippingPlanes!==Oe.numPlanes||Ce.numIntersection!==Oe.numIntersection)||Ce.vertexAlphas!==it||Ce.vertexTangents!==lt||Ce.morphTargets!==De||Ce.morphNormals!==yt||Ce.morphColors!==Ht||Ce.toneMapping!==Ct||Ce.morphTargetsCount!==$t||!!Ce.lightProbeGrid!=E.state.lightProbeGridArray.length>0)&&(pt=!0):(pt=!0,Ce.__version=H.version);let xn=Ce.currentProgram;pt===!0&&(xn=nr(H,D,z),N&&H.isNodeMaterial&&N.onUpdateProgram(H,xn,Ce));let In=!1,ai=!1,Bi=!1;const bt=xn.getUniforms(),Ut=Ce.uniforms;if(v.useProgram(xn.program)&&(In=!0,ai=!0,Bi=!0),H.id!==q&&(q=H.id,ai=!0),Ce.needsLights){const At=Ku(E.state.lightProbeGridArray,z);Ce.lightProbeGrid!==At&&(Ce.lightProbeGrid=At,ai=!0)}if(In||j!==y){v.buffers.depth.getReversed()&&y.reversedDepth!==!0&&(y._reversedDepth=!0,y.updateProjectionMatrix()),bt.setValue(R,"projectionMatrix",y.projectionMatrix),bt.setValue(R,"viewMatrix",y.matrixWorldInverse);const li=bt.map.cameraPosition;li!==void 0&&li.setValue(R,ue.setFromMatrixPosition(y.matrixWorld)),A.logarithmicDepthBuffer&&bt.setValue(R,"logDepthBufFC",2/(Math.log(y.far+1)/Math.LN2)),(H.isMeshPhongMaterial||H.isMeshToonMaterial||H.isMeshLambertMaterial||H.isMeshBasicMaterial||H.isMeshStandardMaterial||H.isShaderMaterial)&&bt.setValue(R,"isOrthographic",y.isOrthographicCamera===!0),j!==y&&(j=y,ai=!0,Bi=!0)}if(Ce.needsLights&&(nn.state.sunShadowMap.length>0&&bt.setValue(R,"sunShadowMap",nn.state.sunShadowMap,K),nn.state.directionalShadowMap.length>0&&bt.setValue(R,"directionalShadowMap",nn.state.directionalShadowMap,K),nn.state.spotShadowMap.length>0&&bt.setValue(R,"spotShadowMap",nn.state.spotShadowMap,K),nn.state.pointShadowMap.length>0&&bt.setValue(R,"pointShadowMap",nn.state.pointShadowMap,K)),z.isSkinnedMesh){bt.setOptional(R,z,"bindMatrix"),bt.setOptional(R,z,"bindMatrixInverse");const At=z.skeleton;At&&(At.boneTexture===null&&At.computeBoneTexture(),bt.setValue(R,"boneTexture",At.boneTexture,K))}z.isBatchedMesh&&(bt.setOptional(R,z,"batchingTexture"),bt.setValue(R,"batchingTexture",z._matricesTexture,K),bt.setOptional(R,z,"batchingIdTexture"),bt.setValue(R,"batchingIdTexture",z._indirectTexture,K),bt.setOptional(R,z,"batchingColorTexture"),z._colorsTexture!==null&&bt.setValue(R,"batchingColorTexture",z._colorsTexture,K));const oi=W.morphAttributes;if((oi.position!==void 0||oi.normal!==void 0||oi.color!==void 0)&&k.update(z,W,xn),(ai||Ce.receiveShadow!==z.receiveShadow)&&(Ce.receiveShadow=z.receiveShadow,bt.setValue(R,"receiveShadow",z.receiveShadow)),(H.isMeshStandardMaterial||H.isMeshLambertMaterial||H.isMeshPhongMaterial)&&H.envMap===null&&D.environment!==null&&(Ut.envMapIntensity.value=D.environmentIntensity),Ut.dfgLUT!==void 0&&(Ut.dfgLUT.value=f1()),ai){if(bt.setValue(R,"toneMappingExposure",C.toneMappingExposure),Ce.needsLights&&Yu(Ut,Bi),we&&H.fog===!0&&Fe.refreshFogUniforms(Ut,we),Fe.refreshMaterialUniforms(Ut,H,ee,J,E.state.transmissionRenderTarget[y.id]),Ce.needsLights&&Ce.lightProbeGrid){const At=Ce.lightProbeGrid;Ut.probesSH.value=At.texture,Ut.probesMin.value.copy(At.boundingBox.min),Ut.probesMax.value.copy(At.boundingBox.max),Ut.probesResolution.value.copy(At.resolution)}Wr.upload(R,$l(Ce),Ut,K)}if(H.isShaderMaterial&&H.uniformsNeedUpdate===!0&&(Wr.upload(R,$l(Ce),Ut,K),H.uniformsNeedUpdate=!1),H.isSpriteMaterial&&bt.setValue(R,"center",z.center),bt.setValue(R,"modelViewMatrix",z.modelViewMatrix),bt.setValue(R,"normalMatrix",z.normalMatrix),bt.setValue(R,"modelMatrix",z.matrixWorld),H.uniformsGroups!==void 0){const At=H.uniformsGroups;for(let li=0,Hi=At.length;li<Hi;li++){const Zl=At[li];se.update(Zl,xn),se.bind(Zl,xn)}}return xn}function Yu(y,D){y.ambientLightColor.needsUpdate=D,y.lightProbe.needsUpdate=D,y.sunLights.needsUpdate=D,y.sunLightShadows.needsUpdate=D,y.directionalLights.needsUpdate=D,y.directionalLightShadows.needsUpdate=D,y.pointLights.needsUpdate=D,y.pointLightShadows.needsUpdate=D,y.spotLights.needsUpdate=D,y.spotLightShadows.needsUpdate=D,y.rectAreaLights.needsUpdate=D,y.hemisphereLights.needsUpdate=D}function Ju(y){return y.isMeshLambertMaterial||y.isMeshToonMaterial||y.isMeshPhongMaterial||y.isMeshStandardMaterial||y.isShadowMaterial||y.isShaderMaterial&&y.lights===!0}this.getActiveCubeFace=function(){return $},this.getActiveMipmapLevel=function(){return V},this.getRenderTarget=function(){return ie},this.setRenderTargetTextures=function(y,D,W){const H=G.get(y);H.__autoAllocateDepthBuffer=y.resolveDepthBuffer===!1,H.__autoAllocateDepthBuffer===!1&&(H.__useRenderToTexture=!1),G.get(y.texture).__webglTexture=D,G.get(y.depthTexture).__webglTexture=H.__autoAllocateDepthBuffer?void 0:W,H.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(y,D){const W=G.get(y);W.__webglFramebuffer=D,W.__useDefaultFramebuffer=D===void 0},this.setRenderTarget=function(y,D=0,W=0){ie=y,$=D,V=W;let H=null,z=!1,we=!1;if(y){const be=G.get(y);if(be.__useDefaultFramebuffer!==void 0){v.bindFramebuffer(R.FRAMEBUFFER,be.__webglFramebuffer),ne.copy(y.viewport),xe.copy(y.scissor),_e=y.scissorTest,v.viewport(ne),v.scissor(xe),v.setScissorTest(_e),q=-1;return}else if(be.__webglFramebuffer===void 0)K.setupRenderTarget(y);else if(be.__hasExternalTextures)K.rebindTextures(y,G.get(y.texture).__webglTexture,G.get(y.depthTexture).__webglTexture);else if(y.depthBuffer){const it=y.depthTexture;if(be.__boundDepthTexture!==it){if(it!==null&&G.has(it)&&(y.width!==it.image.width||y.height!==it.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");K.setupDepthRenderbuffer(y)}}const Ie=y.texture;(Ie.isData3DTexture||Ie.isDataArrayTexture||Ie.isCompressedArrayTexture)&&(we=!0);const Ne=G.get(y).__webglFramebuffer;y.isWebGLCubeRenderTarget?(Array.isArray(Ne[D])?H=Ne[D][W]:H=Ne[D],z=!0):y.samples>0&&K.useMultisampledRTT(y)===!1?H=G.get(y).__webglMultisampledFramebuffer:Array.isArray(Ne)?H=Ne[W]:H=Ne,ne.copy(y.viewport),xe.copy(y.scissor),_e=y.scissorTest}else ne.copy(Ae).multiplyScalar(ee).floor(),xe.copy(Ke).multiplyScalar(ee).floor(),_e=St;if(W!==0&&(H=B),v.bindFramebuffer(R.FRAMEBUFFER,H)&&v.drawBuffers(y,H),v.viewport(ne),v.scissor(xe),v.setScissorTest(_e),z){const be=G.get(y.texture);R.framebufferTexture2D(R.FRAMEBUFFER,R.COLOR_ATTACHMENT0,R.TEXTURE_CUBE_MAP_POSITIVE_X+D,be.__webglTexture,W)}else if(we){const be=D;for(let Ie=0;Ie<y.textures.length;Ie++){const Ne=G.get(y.textures[Ie]);R.framebufferTextureLayer(R.FRAMEBUFFER,R.COLOR_ATTACHMENT0+Ie,Ne.__webglTexture,W,be)}}else if(y!==null&&W!==0){const be=G.get(y.texture);R.framebufferTexture2D(R.FRAMEBUFFER,R.COLOR_ATTACHMENT0,R.TEXTURE_2D,be.__webglTexture,W)}q=-1};function Jl(y){const D=G.get(y);return(D.__readFormat!==y.format||D.__readType!==y.type)&&(D.__readFormat=y.format,D.__readType=y.type,D.__formatReadable=A.textureFormatReadable(y.format),D.__typeReadable=A.textureTypeReadable(y.type)),D}this.readRenderTargetPixels=function(y,D,W,H,z,we,Pe,be=0){if(!(y&&y.isWebGLRenderTarget)){vt("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ie=G.get(y).__webglFramebuffer;if(y.isWebGLCubeRenderTarget&&Pe!==void 0&&(Ie=Ie[Pe]),Ie){v.bindFramebuffer(R.FRAMEBUFFER,Ie);try{const Ne=y.textures[be],it=Ne.format,lt=Ne.type;y.textures.length>1&&R.readBuffer(R.COLOR_ATTACHMENT0+be);const De=Jl(Ne);if(De.__formatReadable===!1){vt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(De.__typeReadable===!1){vt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}D>=0&&D<=y.width-H&&W>=0&&W<=y.height-z&&R.readPixels(D,W,H,z,ve.convert(it),ve.convert(lt),we)}finally{const Ne=ie!==null?G.get(ie).__webglFramebuffer:null;v.bindFramebuffer(R.FRAMEBUFFER,Ne)}}},this.readRenderTargetPixelsAsync=async function(y,D,W,H,z,we,Pe,be=0){if(!(y&&y.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Ie=G.get(y).__webglFramebuffer;if(y.isWebGLCubeRenderTarget&&Pe!==void 0&&(Ie=Ie[Pe]),Ie)if(D>=0&&D<=y.width-H&&W>=0&&W<=y.height-z){v.bindFramebuffer(R.FRAMEBUFFER,Ie);const Ne=y.textures[be],it=Ne.format,lt=Ne.type;y.textures.length>1&&R.readBuffer(R.COLOR_ATTACHMENT0+be);const De=Jl(Ne);if(De.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(De.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const yt=R.createBuffer();R.bindBuffer(R.PIXEL_PACK_BUFFER,yt),R.bufferData(R.PIXEL_PACK_BUFFER,we.byteLength,R.STREAM_READ),R.readPixels(D,W,H,z,ve.convert(it),ve.convert(lt),0),R.bindBuffer(R.PIXEL_PACK_BUFFER,null);const Ht=ie!==null?G.get(ie).__webglFramebuffer:null;v.bindFramebuffer(R.FRAMEBUFFER,Ht);const Ct=R.fenceSync(R.SYNC_GPU_COMMANDS_COMPLETE,0);return R.flush(),await Qd(R,Ct,4),R.bindBuffer(R.PIXEL_PACK_BUFFER,yt),R.getBufferSubData(R.PIXEL_PACK_BUFFER,0,we),R.bindBuffer(R.PIXEL_PACK_BUFFER,null),R.deleteBuffer(yt),R.deleteSync(Ct),we}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(y,D=null,W=0){const H=Math.pow(2,-W),z=Math.floor(y.image.width*H),we=Math.floor(y.image.height*H),Pe=D!==null?D.x:0,be=D!==null?D.y:0;K.setTexture2D(y,0),R.copyTexSubImage2D(R.TEXTURE_2D,W,0,0,Pe,be,z,we),v.unbindTexture()},this.copyTextureToTexture=function(y,D,W=null,H=null,z=0,we=0){let Pe,be,Ie,Ne,it,lt,De,yt,Ht;const Ct=y.isCompressedTexture?y.mipmaps[we]:y.image;if(W!==null)Pe=W.max.x-W.min.x,be=W.max.y-W.min.y,Ie=W.isBox3?W.max.z-W.min.z:1,Ne=W.min.x,it=W.min.y,lt=W.isBox3?W.min.z:0;else{const Ut=Math.pow(2,-z);Pe=Math.floor(Ct.width*Ut),be=Math.floor(Ct.height*Ut),y.isDataArrayTexture?Ie=Ct.depth:y.isData3DTexture?Ie=Math.floor(Ct.depth*Ut):Ie=1,Ne=0,it=0,lt=0}H!==null?(De=H.x,yt=H.y,Ht=H.z):(De=0,yt=0,Ht=0);const wt=ve.convert(D.format),$t=ve.convert(D.type);let Ce;D.isData3DTexture?(K.setTexture3D(D,0),Ce=R.TEXTURE_3D):D.isDataArrayTexture||D.isCompressedArrayTexture?(K.setTexture2DArray(D,0),Ce=R.TEXTURE_2D_ARRAY):(K.setTexture2D(D,0),Ce=R.TEXTURE_2D),v.activeTexture(R.TEXTURE0),v.pixelStorei(R.UNPACK_FLIP_Y_WEBGL,D.flipY),v.pixelStorei(R.UNPACK_PREMULTIPLY_ALPHA_WEBGL,D.premultiplyAlpha),v.pixelStorei(R.UNPACK_ALIGNMENT,D.unpackAlignment);const nn=v.getParameter(R.UNPACK_ROW_LENGTH),pt=v.getParameter(R.UNPACK_IMAGE_HEIGHT),xn=v.getParameter(R.UNPACK_SKIP_PIXELS),In=v.getParameter(R.UNPACK_SKIP_ROWS),ai=v.getParameter(R.UNPACK_SKIP_IMAGES);v.pixelStorei(R.UNPACK_ROW_LENGTH,Ct.width),v.pixelStorei(R.UNPACK_IMAGE_HEIGHT,Ct.height),v.pixelStorei(R.UNPACK_SKIP_PIXELS,Ne),v.pixelStorei(R.UNPACK_SKIP_ROWS,it),v.pixelStorei(R.UNPACK_SKIP_IMAGES,lt);const Bi=y.isDataArrayTexture||y.isData3DTexture,bt=D.isDataArrayTexture||D.isData3DTexture;if(y.isDepthTexture){const Ut=G.get(y),oi=G.get(D),At=G.get(Ut.__renderTarget),li=G.get(oi.__renderTarget);v.bindFramebuffer(R.READ_FRAMEBUFFER,At.__webglFramebuffer),v.bindFramebuffer(R.DRAW_FRAMEBUFFER,li.__webglFramebuffer);for(let Hi=0;Hi<Ie;Hi++)Bi&&(R.framebufferTextureLayer(R.READ_FRAMEBUFFER,R.COLOR_ATTACHMENT0,G.get(y).__webglTexture,z,lt+Hi),R.framebufferTextureLayer(R.DRAW_FRAMEBUFFER,R.COLOR_ATTACHMENT0,G.get(D).__webglTexture,we,Ht+Hi)),R.blitFramebuffer(Ne,it,Pe,be,De,yt,Pe,be,R.DEPTH_BUFFER_BIT,R.NEAREST);v.bindFramebuffer(R.READ_FRAMEBUFFER,null),v.bindFramebuffer(R.DRAW_FRAMEBUFFER,null)}else if(z!==0||y.isRenderTargetTexture||G.has(y)){const Ut=G.get(y),oi=G.get(D);v.bindFramebuffer(R.READ_FRAMEBUFFER,U),v.bindFramebuffer(R.DRAW_FRAMEBUFFER,O);for(let At=0;At<Ie;At++)Bi?R.framebufferTextureLayer(R.READ_FRAMEBUFFER,R.COLOR_ATTACHMENT0,Ut.__webglTexture,z,lt+At):R.framebufferTexture2D(R.READ_FRAMEBUFFER,R.COLOR_ATTACHMENT0,R.TEXTURE_2D,Ut.__webglTexture,z),bt?R.framebufferTextureLayer(R.DRAW_FRAMEBUFFER,R.COLOR_ATTACHMENT0,oi.__webglTexture,we,Ht+At):R.framebufferTexture2D(R.DRAW_FRAMEBUFFER,R.COLOR_ATTACHMENT0,R.TEXTURE_2D,oi.__webglTexture,we),z!==0?R.blitFramebuffer(Ne,it,Pe,be,De,yt,Pe,be,R.COLOR_BUFFER_BIT,R.NEAREST):bt?R.copyTexSubImage3D(Ce,we,De,yt,Ht+At,Ne,it,Pe,be):R.copyTexSubImage2D(Ce,we,De,yt,Ne,it,Pe,be);v.bindFramebuffer(R.READ_FRAMEBUFFER,null),v.bindFramebuffer(R.DRAW_FRAMEBUFFER,null)}else bt?y.isDataTexture||y.isData3DTexture?R.texSubImage3D(Ce,we,De,yt,Ht,Pe,be,Ie,wt,$t,Ct.data):D.isCompressedArrayTexture?R.compressedTexSubImage3D(Ce,we,De,yt,Ht,Pe,be,Ie,wt,Ct.data):R.texSubImage3D(Ce,we,De,yt,Ht,Pe,be,Ie,wt,$t,Ct):y.isDataTexture?R.texSubImage2D(R.TEXTURE_2D,we,De,yt,Pe,be,wt,$t,Ct.data):y.isCompressedTexture?R.compressedTexSubImage2D(R.TEXTURE_2D,we,De,yt,Ct.width,Ct.height,wt,Ct.data):R.texSubImage2D(R.TEXTURE_2D,we,De,yt,Pe,be,wt,$t,Ct);v.pixelStorei(R.UNPACK_ROW_LENGTH,nn),v.pixelStorei(R.UNPACK_IMAGE_HEIGHT,pt),v.pixelStorei(R.UNPACK_SKIP_PIXELS,xn),v.pixelStorei(R.UNPACK_SKIP_ROWS,In),v.pixelStorei(R.UNPACK_SKIP_IMAGES,ai),we===0&&D.generateMipmaps&&R.generateMipmap(Ce),v.unbindTexture()},this.initRenderTarget=function(y){G.get(y).__webglFramebuffer===void 0&&K.setupRenderTarget(y)},this.initTexture=function(y){y.isCubeTexture?K.setTextureCube(y,0):y.isData3DTexture?K.setTexture3D(y,0):y.isDataArrayTexture||y.isCompressedArrayTexture?K.setTexture2DArray(y,0):K.setTexture2D(y,0),v.unbindTexture()},this.resetState=function(){$=0,V=0,ie=null,v.reset(),Ee.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return On}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=ut._getDrawingBufferColorSpace(e),t.unpackColorSpace=ut._getUnpackColorSpace()}}const ki={likud:{id:"likud",name:"Likud",nameHe:"הליכוד",color:2056127,accent:10273791},yeshatid:{id:"yeshatid",name:"Yesh Atid",nameHe:"יש עתיד",color:41952,accent:11922687},nationalunity:{id:"nationalunity",name:"National Unity",nameHe:"המחנה הממלכתי",color:2573736,accent:10466559},yashar:{id:"yashar",name:"Yashar!",nameHe:"ישר!",color:3833156,accent:12116160},shas:{id:"shas",name:"Shas",nameHe:'ש"ס',color:732779,accent:15909198},utj:{id:"utj",name:"United Torah Judaism",nameHe:"יהדות התורה",color:2763310,accent:14211288},rzp:{id:"rzp",name:"Religious Zionism",nameHe:"הציונות הדתית",color:13849600,accent:16761738},otzma:{id:"otzma",name:"Otzma Yehudit",nameHe:"עוצמה יהודית",color:14721280,accent:16773288},noam:{id:"noam",name:"Noam",nameHe:"נעם",color:8207512,accent:14465258},yb:{id:"yb",name:"Yisrael Beiteinu",nameHe:"ישראל ביתנו",color:2651302,accent:11129840},raam:{id:"raam",name:"Ra'am",nameHe:'רע"ם',color:2006618,accent:10939588},hadash:{id:"hadash",name:"Hadash–Ta'al",nameHe:'חד"ש-תע"ל',color:12597547,accent:16757674},democrats:{id:"democrats",name:"The Democrats",nameHe:"הדמוקרטים",color:14035001,accent:16757693}};let Ei=null;function p1(){if(!Ei){const s=new Uint8Array([70,70,70,255,150,150,150,255,215,215,215,255,255,255,255,255]);Ei=new Sl(s,4,1,Sn),Ei.minFilter=Wt,Ei.magFilter=Wt,Ei.generateMipmaps=!1,Ei.needsUpdate=!0}return Ei}function Dt(s,e={}){return new Ps({color:s,gradientMap:p1(),...e})}const m1=new vn({color:460812,side:en});function g1(s,e){const t=s.clone(),n=t.getAttribute("position");let i=t.getAttribute("normal");i||(t.computeVertexNormals(),i=t.getAttribute("normal"));for(let r=0;r<n.count;r++)n.setXYZ(r,n.getX(r)+i.getX(r)*e,n.getY(r)+i.getY(r)*e,n.getZ(r)+i.getZ(r)*e);return n.needsUpdate=!0,t}function Xr(s,e){const t=new qe(s);return t.multiplyScalar(e),t.getHex()}function gt(s,e=1){return new vn({color:s,transparent:!0,opacity:e,blending:Kr,depthWrite:!1})}const Cu=.95;function It(s,e,t,n){const i=n??`${e}:${t?JSON.stringify(t):""}`;let r=s.matCache.get(i);return r||(r=Dt(e,t),s.matCache.set(i,r),s.mats.push(r)),r}function Le(s,e,t,n,i=[0,0,0],r={}){const a=new je(t,n);if(a.position.set(i[0],i[1],i[2]),r.rot&&a.rotation.set(r.rot[0],r.rot[1],r.rot[2]),r.scale&&a.scale.set(r.scale[0],r.scale[1],r.scale[2]),a.castShadow=r.shadow!==!1,a.receiveShadow=!1,e.add(a),r.outline!==!1&&s.outline>0){const o=new je(g1(t,s.outline),m1);o.castShadow=!1,a.add(o)}return a}function rn(s,e=[0,0,0]){const t=new kt;return t.position.set(e[0],e[1],e[2]),s.add(t),t}const Pi=(s,e)=>new Zs(s,Math.max(.001,e),5,12);function Pu(s,e={}){const t=s.look,n=ki[s.party],i={mats:[],matCache:new Map,outline:e.outline===!1?0:.012},r=!!t.female,a=t.build*(r?.9:1),o=r?.92:1,c=Math.sqrt(t.build),l=It(i,t.skin),h=It(i,Xr(t.skin,.86)),d=t.outfit==="shirt"||t.outfit==="tshirt"?t.shirt:t.jacket,u=It(i,d),f=It(i,t.shirt),g=It(i,t.pants),S=It(i,t.shoes??1315860),p=It(i,t.hairColor),m=new kt;m.scale.setScalar(t.height);const M=rn(m,[0,Cu,0]),T=rn(M);Le(i,T,new Ue(.16*a,.15*a,.2,14),g,[0,-.02,0],{scale:[1,1,.75]}),t.outfit==="skirt"?Le(i,T,new Ue(.17*a,.27*a,.5,16),g,[0,-.22,0],{scale:[1,1,.8]}):(t.outfit==="suit"||t.outfit==="open-suit"||t.outfit==="blazer")&&Le(i,T,new Ue(.185*a,.2*a,.2,14),u,[0,.02,0],{scale:[1,1,.78]});const b=t.outfit==="skirt"?It(i,Xr(t.skin,.8)):g,E=xe=>{const _e=rn(T,[xe*.095*a,-.05,0]);Le(i,_e,Pi(.082*c,.3),b,[0,-.22,0]);const tt=rn(_e,[0,-.45,0]);return Le(i,tt,Pi(.068*c,.3),b,[0,-.21,0]),Le(i,tt,new Te(.11,.07,.25),S,[0,-.44,.05]),{hip:_e,knee:tt}},P=E(1),x=E(-1),w=rn(T,[0,.06,0]),C=.205*a*o,L=.168*a;if(Le(i,w,new Ue(C,L,.5,16),u,[0,.25,0],{scale:[1,1,.66]}),t.build>1.1){const xe=(t.build-1)*.9;Le(i,w,new Re(.16*a,16,12),u,[0,.13,.03+xe*.1],{scale:[1,.9,.6+xe]})}r&&Le(i,w,new Re(.09,12,10),u,[0,.36,.08],{scale:[1.9,.8,.7],outline:!1});const N=C*.66+.004;if(t.outfit==="suit"||t.outfit==="open-suit"||t.outfit==="blazer"||t.outfit==="skirt"){const xe=new qs;xe.moveTo(-.075,0),xe.lineTo(.075,0),xe.lineTo(0,-.2),xe.closePath();const _e=Le(i,w,new oa(xe),f,[0,.5,N],{outline:!1,shadow:!1});_e.rotation.x=-.05;const tt=It(i,Xr(d,.75));for(const Ze of[1,-1])Le(i,w,new Te(.018,.22,.01),tt,[Ze*.045,.39,N+.004],{rot:[0,0,Ze*.36],outline:!1,shadow:!1});if(t.tie!==null&&t.tie!==void 0&&t.outfit==="suit"){const Ze=It(i,t.tie);Le(i,w,new Te(.05,.3,.012),Ze,[0,.33,N+.008],{outline:!1,shadow:!1}),Le(i,w,new Te(.055,.045,.02),Ze,[0,.48,N+.01],{outline:!1,shadow:!1})}Le(i,w,new Re(.018,8,6),It(i,n.color,{emissive:new qe(n.color),emissiveIntensity:.4},"pin"),[.1,.42,N+.01],{outline:!1,shadow:!1})}else if(t.outfit==="shirt")for(let xe=0;xe<4;xe++)Le(i,w,new Re(.009,6,4),It(i,14540253),[0,.45-xe*.1,N+.002],{outline:!1,shadow:!1});const B=rn(w,[0,.5,0]);Le(i,B,new Re(C,16,10,0,Math.PI*2,0,Math.PI/2),u,[0,-.02,0],{scale:[1,.35,.66]});const U=t.outfit==="tshirt",O=xe=>{const _e=rn(B,[xe*(C+.035),-.04,0]);Le(i,_e,new Re(.075*c,12,10),u,[0,0,0]),Le(i,_e,Pi(.06*c,.2),U?f:u,[0,-.15,0]);const tt=rn(_e,[0,-.3,0]);Le(i,tt,Pi(.052*c,.18),U?l:u,[0,-.13,0]),!U&&t.outfit!=="shirt"&&Le(i,tt,new Ue(.05*c,.05*c,.035,10),f,[0,-.255,0],{outline:!1});const Ze=rn(tt,[0,-.3,0]);return Le(i,Ze,new Re(.064,12,10),l,[0,0,0],{scale:[1,1.05,1.15]}),{sh:_e,el:tt,hand:Ze}},$=O(1),V=O(-1),ie=rn(B,[0,.03,0]);Le(i,ie,new Ue(.058,.064,.12,12),l,[0,.05,0]),t.outfit!=="tshirt"&&Le(i,ie,new Ue(.07,.075,.05,12),f,[0,0,0],{outline:!1});const q=rn(ie,[0,.1,0]),j=.15*(t.head??1);return v1(i,q,t,j,l,h,p),{root:m,pivot:M,hips:T,spine:w,chest:B,neck:ie,head:q,lSh:$.sh,lEl:$.el,rSh:V.sh,rEl:V.el,lHand:$.hand,rHand:V.hand,lHip:P.hip,lKnee:P.knee,rHip:x.hip,rKnee:x.knee,materials:i.mats,headRadius:j,def:s}}function v1(s,e,t,n,i,r,a){const o=rn(e,[0,.14,0]),c=[.92,1.05,1];Le(s,o,new Re(n,24,18),i,[0,0,0],{scale:c});const l=t.female?.84:.95;Le(s,o,new Re(n*.8,18,12),i,[0,-n*.35,n*.08],{scale:[l,.85,.95],outline:!1});for(const g of[1,-1])Le(s,o,new Re(n*.22,10,8),r,[g*n*.88,-n*.02,-n*.02],{scale:[.5,1,.8]});const h=It(s,16777215),d=It(s,1118481);for(const g of[1,-1])Le(s,o,new Re(n*.14,12,10),h,[g*n*.33,n*.12,n*.84],{outline:!1,shadow:!1}),Le(s,o,new Re(n*.075,10,8),d,[g*n*.32,n*.11,n*.965],{outline:!1,shadow:!1});const u=It(s,Xr(t.facialHairColor??t.hairColor,t.hairColor>10485760?.7:1)),f=t.brows??1;for(const g of[1,-1])Le(s,o,new Te(n*.38,n*.075*f,n*.09),u,[g*n*.33,n*.33,n*.9],{rot:[0,g*.25,g*.2],outline:!1,shadow:!1});Le(s,o,new Re(n*.17,12,10),r,[0,-n*.03,n*.98],{scale:[.8,1.05,1.1],outline:!1,shadow:!1}),Le(s,o,new Te(n*.38,n*.05,n*.05),It(s,5905950),[0,-n*.4,n*.9],{outline:!1,shadow:!1}),x1(s,o,t,n,a),_1(s,o,t,n),y1(s,o,t,n),S1(s,o,t,n)}function x1(s,e,t,n,i){const r=(o,c,l)=>{const h=Le(s,e,new Re(o,24,12,0,Math.PI*2,0,c),i,[0,n*.02,-n*.02],{scale:[.95,1.05,1.02]});return h.rotation.x=-l,h},a=()=>{const o=i.clone();return o.side=an,s.mats.push(o),o};switch(t.hair){case"bald":break;case"short":r(n*1.04,Math.PI*.46,.35);break;case"buzz":r(n*1.02,Math.PI*.5,.35);break;case"side":r(n*1.05,Math.PI*.46,.3),Le(s,e,new Re(n*.62,14,10),i,[n*.22,n*.74,n*.2],{scale:[1.35,.5,1.15],rot:[-.2,0,-.25]});break;case"swept":r(n*1.05,Math.PI*.46,.3),Le(s,e,new Re(n*.7,14,10),i,[0,n*.78,n*.18],{scale:[1.3,.48,1.25],rot:[-.35,0,0]});break;case"receding":r(n*1.04,Math.PI*.45,.85);break;case"horseshoe":{Le(s,e,new Nt(n*.93,n*.17,8,24,Math.PI*1.15),i,[0,n*.05,-n*.02]).rotation.set(-Math.PI/2,0,-Math.PI*.075);break}case"long":case"wavy":{if(r(n*1.06,Math.PI*.52,.25),Le(s,e,new Ue(n*1.02,n*1.2,n*2.3,20,1,!0,Math.PI*.32,Math.PI*1.36),a(),[0,-n*.62,-n*.02],{scale:[.95,1,1]}),t.hair==="wavy")for(let o=0;o<6;o++){const c=Math.PI*(.55+o*.18);Le(s,e,new Re(n*.32,10,8),i,[Math.sin(c)*n*1.05,-n*(1.3+o%2*.25),Math.cos(c)*n*1],{outline:!1})}break}case"bob":r(n*1.07,Math.PI*.52,.2),Le(s,e,new Ue(n*1.05,n*1.14,n*1.35,20,1,!0,Math.PI*.3,Math.PI*1.4),a(),[0,-n*.3,-n*.02],{scale:[.95,1,1]});break;case"bun":r(n*1.05,Math.PI*.5,.25),Le(s,e,new Re(n*.45,12,10),i,[0,n*.55,-n*.9]);break;case"ponytail":r(n*1.05,Math.PI*.5,.25),Le(s,e,Pi(n*.22,n*1.1),i,[0,-n*.2,-n*1.2],{rot:[.5,0,0]});break;case"curly":{r(n*1.12,Math.PI*.55,.2);for(let o=0;o<18;o++){const c=o/18*Math.PI*2,l=n*(.3+o%3*.28),h=n*(1+o%2*.1);Math.cos(c)>.7&&l<n*.6||Le(s,e,new Re(n*.33,10,8),i,[Math.sin(c)*h,l,Math.cos(c)*h-n*.05],{outline:!1})}for(let o=0;o<8;o++){const c=Math.PI*(.6+o*.1);Le(s,e,new Re(n*.34,10,8),i,[Math.sin(c)*n*1.05,-n*(.2+o%3*.3),Math.cos(c)*n*1],{outline:!1})}break}case"spiky":r(n*1.04,Math.PI*.46,.3);for(let o=0;o<7;o++){const c=-.9+o*.3;Le(s,e,new Zt(n*.18,n*.5,6),i,[Math.sin(c)*n*.5,n*.95,Math.cos(c)*n*.2],{rot:[0,0,-c*.6],outline:!1})}break;case"braids":{r(n*1.06,Math.PI*.52,.2);for(let o=0;o<9;o++){const c=Math.PI*(.62+o*.095);Le(s,e,Pi(n*.1,n*1.9),i,[Math.sin(c)*n*1,-n*.75,Math.cos(c)*n*.98],{outline:!1})}break}}}function _1(s,e,t,n){const i=t.facialHair??"none";if(i==="none")return;const r=t.facialHairColor??t.hairColor,a=It(s,r),o=(l,h,d,u)=>{Le(s,e,new Re(l,22,12,-.15,Math.PI+.3,Math.PI*h,Math.PI*(d-h)),u,[0,0,n*.02],{scale:[.93,1.05,1.02],outline:!1})},c=()=>{Le(s,e,Pi(n*.075,n*.34),a,[0,-n*.26,n*.98],{rot:[0,0,Math.PI/2],outline:!1})};switch(i){case"stubble":{const l=It(s,r,{transparent:!0,opacity:.45},`stubble${r}`);o(n*1.015,.58,.92,l);break}case"short":o(n*1.035,.6,.94,a),c();break;case"full":o(n*1.06,.56,.97,a),Le(s,e,new Re(n*.48,14,10),a,[0,-n*.82,n*.4],{scale:[1.1,.9,.9],outline:!1}),c();break;case"long":o(n*1.06,.56,.97,a),Le(s,e,new Re(n*.5,14,10),a,[0,-n*.8,n*.4],{scale:[1.1,.9,.9],outline:!1}),Le(s,e,new Zt(n*.52,n*1.5,14),a,[0,-n*1.45,n*.45],{rot:[Math.PI-.2,0,0]}),c();break;case"goatee":Le(s,e,new Re(n*.3,12,10),a,[0,-n*.75,n*.62],{outline:!1}),c();break;case"mustache":c();break}}function y1(s,e,t,n){const i=t.glasses??"none";if(i==="none")return;const r=It(s,i==="thick"?1710618:2763306),a=i==="thick"?n*.05:n*.028,o=new vn({color:12575999,transparent:!0,opacity:.22,depthWrite:!1});for(const c of[1,-1]){const l=[c*n*.34,n*.12,n*1.04];i==="round"?Le(s,e,new Nt(n*.22,a,6,20),r,l,{outline:!1,shadow:!1}):Le(s,e,new Nt(n*.23,a,4,4),r,l,{rot:[0,0,Math.PI/4],scale:[1.25,.85,1],outline:!1,shadow:!1}),Le(s,e,new aa(n*.2,16),o,[l[0],l[1],l[2]+.001],{outline:!1,shadow:!1}),Le(s,e,new Te(a*1.2,a*1.2,n*.95),r,[c*n*.62,n*.14,n*.55],{outline:!1,shadow:!1})}Le(s,e,new Te(n*.22,a*1.2,a*1.2),r,[0,n*.16,n*1.06],{outline:!1,shadow:!1})}function S1(s,e,t,n){const i=t.headwear??"none";if(i==="none")return;const r=t.headwearColor??(i==="black-hat"?723723:1118481),a=It(s,r);switch(i){case"kippah":case"kippah-knit":{const o=rn(e,[0,n*.94,-n*.32]);if(o.rotation.x=-.45,Le(s,o,new Re(n*.55,16,8,0,Math.PI*2,0,Math.PI*.22),a,[0,-n*.42,0],{scale:[1,.9,1]}),i==="kippah-knit"){const c=Le(s,o,new Nt(n*.28,n*.03,6,20),It(s,16777215),[0,n*.08,0],{outline:!1});c.rotation.x=Math.PI/2}break}case"black-hat":{const o=rn(e,[0,n*.78,-n*.05]);o.rotation.x=-.12,Le(s,o,new Ue(n*1.62,n*1.62,n*.07,24),a,[0,0,0]),Le(s,o,new Ue(n*.88,n*1,n*.95,20),a,[0,n*.48,0]),Le(s,o,new Ue(n*1.01,n*1.01,n*.18,20),It(s,2763306),[0,n*.12,0],{outline:!1});break}case"hat":{const o=rn(e,[0,n*.72,0]);o.rotation.x=-.1,Le(s,o,new Ue(n*1.45,n*1.45,n*.06,24),a,[0,0,0]),Le(s,o,new Re(n*.98,20,12,0,Math.PI*2,0,Math.PI/2),a,[0,0,0],{scale:[1,.75,1]});break}case"beret":Le(s,e,new Re(n*1.1,20,12),a,[n*.1,n*.78,-n*.05],{scale:[1.1,.35,1.1],rot:[0,0,-.2]});break;case"scarf":Le(s,e,new Re(n*1.1,22,14,0,Math.PI*2,0,Math.PI*.62),a,[0,0,-n*.05],{scale:[.96,1.05,1.02]}),Le(s,e,new Ue(n*1.02,n*1.15,n*1.3,20,1,!0,Math.PI*.35,Math.PI*1.3),a,[0,-n*.55,-n*.03]);break}}function Ru(s){s.root.traverse(e=>{const t=e;t.isMesh&&t.geometry.dispose()});for(const e of s.materials)e.dispose()}const Ll=["hips","spine","chest","neck","head","lSh","lEl","rSh","rEl","lHip","lKnee","rHip","rKnee"],Il=Ll.length*3+3,Un=Ll.length*3,rl=Un+1,Lu=Un+2;function Vt(s,e){const t=e?new Float32Array(e):new Float32Array(Il);return Ll.forEach((n,i)=>{const r=s[n];r&&(t[i*3]=r[0],t[i*3+1]=r[1],t[i*3+2]=r[2])}),s.hipY!==void 0&&(t[Un]=s.hipY),s.pivotX!==void 0&&(t[rl]=s.pivotX),s.pivotZ!==void 0&&(t[Lu]=s.pivotZ),t}function mt(s,e,t,n){for(let i=0;i<Il;i++)s[i]=e[i]+(t[i]-e[i])*n;return s}const jn=s=>s<=0?0:s>=1?1:s*s*(3-2*s),Ir=s=>Math.max(0,Math.min(1,s)),Xe=Vt({hipY:-.05,hips:[0,-.3,0],spine:[.1,-.12,0],chest:[.05,-.08,0],head:[0,.5,0],lSh:[-1.15,0,.3],lEl:[-1.75,0,0],rSh:[-.75,0,-.35],rEl:[-2.1,0,0],lHip:[-.35,.3,.05],lKnee:[.45,0,0],rHip:[.25,.3,-.06],rKnee:[.38,0,0]}),Fs=Vt({hipY:0,lSh:[.05,0,.12],lEl:[-.25,0,0],rSh:[.05,0,-.12],rEl:[-.25,0,0],lHip:[0,0,.04],rHip:[0,0,-.04]}),fn=Vt({hipY:-.4,hips:[0,-.25,0],spine:[.35,-.1,0],head:[-.3,.35,0],lHip:[-1.25,.25,.12],lKnee:[2.1,0,0],rHip:[-.55,.25,-.15],rKnee:[2.2,0,0]},Xe),Zn=Vt({hipY:0,hips:[0,0,0],spine:[.25,0,0],head:[-.2,.2,0],lSh:[-1.4,0,.45],lEl:[-1.3,0,0],rSh:[-1,0,-.45],rEl:[-1.6,0,0],lHip:[-1.35,0,.1],lKnee:[2,0,0],rHip:[-.75,0,-.1],rKnee:[1.7,0,0]},Xe),M1=Vt({hipY:0,spine:[.05,0,0],lSh:[-2.2,0,.3],lEl:[-.8,0,0],rSh:[-.4,0,-.5],rEl:[-1,0,0],lHip:[-.3,0,.05],lKnee:[.6,0,0],rHip:[.1,0,-.05],rKnee:[.4,0,0]},Xe),Dr=Vt({hipY:-.1,spine:[.2,-.05,0],head:[.25,.3,0],lSh:[-1.35,0,.05],lEl:[-2.2,0,0],rSh:[-1.25,0,-.05],rEl:[-2.25,0,0]},Xe),fh=Vt({lSh:[-1.3,0,.05],lEl:[-2.25,0,0],rSh:[-1.2,0,-.05],rEl:[-2.3,0,0],head:[.2,.3,0]},fn),to=Vt({hipY:-.06,spine:[-.35,.25,.08],chest:[-.2,0,0],head:[-.55,.3,.12],lSh:[-.4,0,.8],lEl:[-.8,0,0],rSh:[-.3,0,-.7],rEl:[-.7,0,0]},Xe),ph=Vt({hipY:-.12,spine:[.6,0,0],chest:[.2,0,0],head:[.35,.2,0],lSh:[-.6,0,.2],lEl:[-1.9,0,0],rSh:[-.5,0,-.2],rEl:[-1.9,0,0],lHip:[-.5,.3,.05],lKnee:[.7,0,0]},Xe),kr=Vt({hipY:-.8,pivotX:-Math.PI/2,hips:[0,0,0],spine:[0,0,0],chest:[0,0,0],head:[.25,.3,0],lSh:[-.2,0,1.3],lEl:[-.4,0,0],rSh:[-.3,0,-1.2],rEl:[-.6,0,0],lHip:[-.35,0,.12],lKnee:[.6,0,0],rHip:[-.1,0,-.1],rKnee:[.2,0,0]}),b1=Vt({hipY:0,pivotX:-.9,spine:[-.2,0,0],head:[-.4,0,0],lSh:[-2,0,1],lEl:[-.5,0,0],rSh:[-1.8,0,-1],rEl:[-.5,0,0],lHip:[-.9,0,.1],lKnee:[1.2,0,0],rHip:[-.4,0,-.1],rKnee:[.8,0,0]}),Ur=[Vt({hipY:0,head:[-.35,0,0],spine:[-.1,0,0],lSh:[-2.9,0,.35],lEl:[-.2,0,0],rSh:[-2.9,0,-.35],rEl:[-.2,0,0],lHip:[0,0,.12],rHip:[0,0,-.12],lKnee:[0,0,0],rKnee:[0,0,0]},Fs),Vt({hipY:0,head:[-.2,0,0],rSh:[-2.8,0,-.1],rEl:[-.5,0,0],lSh:[.35,0,.55],lEl:[-2,0,0],lHip:[0,0,.1],rHip:[0,0,-.1]},Fs),Vt({hipY:0,spine:[-.15,0,0],head:[-.2,0,0],lSh:[.35,0,.6],lEl:[-2,0,0],rSh:[.35,0,-.6],rEl:[-2,0,0],lHip:[0,0,.14],rHip:[0,0,-.14]},Fs)],Nr=Vt({hipY:0,rSh:[-1.55,0,-.1],rEl:[-.05,0,0],lSh:[.35,0,.6],lEl:[-2,0,0],head:[0,0,0],spine:[0,.2,0]},Fs),mh=Vt({hipY:-.1,spine:[.15,0,0],lSh:[.1,0,.3],lEl:[-.4,0,0],rSh:[.1,0,-.3],rEl:[-.4,0,0]},Xe),w1=Vt({hipY:0,pivotX:-.45,head:[-.4,0,0],lSh:[-2.4,0,.8],lEl:[-.6,0,0],rSh:[-2.2,0,-.8],rEl:[-.6,0,0],lHip:[-.8,0,.1],lKnee:[1,0,0],rHip:[-.2,0,0],rKnee:[.6,0,0]},Xe),ht=(s,e,t)=>({base:s,windup:Vt(e,s),strike:Vt(t,s)}),gh={spine:[.15,-.5,0],lSh:[-1.57,0,.05],lEl:[-.05,0,0],rSh:[-.8,0,-.3],rEl:[-2.1,0,0],lHip:[-.5,.3,.05]},al={hips:[0,.25,0],spine:[.22,.45,0],rSh:[-1.6,0,-.05],rEl:[-.05,0,0],lSh:[-.9,0,.4],lEl:[-2,0,0],rHip:[.45,.3,-.05],rKnee:[.2,0,0]},vh={hipY:-.02,spine:[-.25,.5,0],rSh:[-3,0,-.15],rEl:[-.15,0,0],lSh:[-.3,0,.5],lEl:[-1.2,0,0],lHip:[-1.3,0,.1],lKnee:[1.5,0,0],rHip:[.15,0,0],rKnee:[.2,0,0]},no={hipY:-.1,hips:[0,.1,0],spine:[.12,.25,0],lSh:[-1.55,-.2,-.1],lEl:[-.1,0,0],rSh:[-1.55,.2,.1],rEl:[-.1,0,0],lHip:[-.6,.2,.05],lKnee:[.6,0,0]},E1={hips:[0,.9,0],spine:[-.35,.3,.4],rHip:[-1.6,0,-.75],rKnee:[.1,0,0],lHip:[.1,.4,0],lKnee:[.25,0,0],lSh:[-.5,0,.9],rSh:[-.3,0,-.6]},io={jab:ht(Xe,{lSh:[-1,0,.35],lEl:[-2,0,0]},gh),strong:ht(Xe,{spine:[.05,-.4,0],rSh:[-.6,0,-.45],rEl:[-2.2,0,0]},al),short:ht(Xe,{lHip:[-.9,.3,.05],lKnee:[1.6,0,0]},{lHip:[-1.15,.3,.05],lKnee:[.1,0,0],spine:[-.15,-.1,0]}),roundhouse:ht(Xe,{rHip:[-.8,0,-.3],rKnee:[1.8,0,0],hips:[0,.5,0],spine:[-.1,.2,0]},E1),cJab:ht(fn,{lSh:[-1,0,.35],lEl:[-2,0,0]},{lSh:[-1.5,0,.05],lEl:[-.05,0,0],spine:[.3,-.4,0]}),cStrong:ht(fn,{rSh:[-.3,0,-.2],rEl:[-1.8,0,0]},{...vh,hipY:-.12}),cShort:ht(fn,{lHip:[-1.2,.25,.1],lKnee:[1.8,0,0]},{hipY:-.46,lHip:[-1.45,.25,.1],lKnee:[.1,0,0]}),sweep:ht(fn,{hipY:-.45,lHip:[-1,0,.3],lKnee:[1.6,0,0]},{hipY:-.52,spine:[.5,0,0],hips:[0,.5,0],lHip:[-1.5,0,.6],lKnee:[.05,0,0],rHip:[-1.2,0,-.2],rKnee:[2.3,0,0],lSh:[-.2,0,1],rSh:[-.4,0,-1.2]}),jJab:ht(Zn,{lSh:[-1,0,.35],lEl:[-2,0,0]},{lSh:[-1.35,0,.1],lEl:[-.1,0,0]}),jStrong:ht(Zn,{rSh:[-3,0,-.2],rEl:[-.5,0,0],spine:[-.2,0,0]},{rSh:[-1.1,0,-.1],rEl:[-.1,0,0],spine:[.45,0,0]}),jShort:ht(Zn,{lHip:[-1.2,0,0],lKnee:[2,0,0]},{lHip:[-1.7,0,0],lKnee:[2.3,0,0],rHip:[-.3,0,0],rKnee:[.6,0,0]}),jRoundhouse:ht(Zn,{lHip:[-1.3,0,.1],lKnee:[1.8,0,0]},{lHip:[-1.3,0,.1],lKnee:[.05,0,0],rHip:[.2,0,0],rKnee:[1.2,0,0],spine:[-.3,0,0]}),overhead:ht(Xe,{spine:[-.3,0,0],rSh:[-3,0,-.2],lSh:[-3,0,.2],rEl:[-.6,0,0],lEl:[-.6,0,0]},{hipY:-.14,spine:[.55,0,0],rSh:[-1.3,0,-.1],lSh:[-1.3,0,.1],rEl:[-.2,0,0],lEl:[-.2,0,0]}),throw:ht(Xe,{lSh:[-1.35,0,.4],rSh:[-1.35,0,-.4],lEl:[-.4,0,0],rEl:[-.4,0,0]},{spine:[.2,0,0],lSh:[-1.5,0,.12],rSh:[-1.5,0,-.12],lEl:[-.6,0,0],rEl:[-.6,0,0]}),throwExec:ht(Xe,{lSh:[-1.5,0,.12],rSh:[-1.5,0,-.12],lEl:[-.6,0,0],rEl:[-.6,0,0]},{hips:[0,-1.1,0],spine:[.3,-.5,0],lSh:[-1.8,0,.6],rSh:[-1.2,0,-.9],lEl:[-.2,0,0],rEl:[-.3,0,0]}),grab:ht(Xe,{spine:[.1,0,0],lSh:[-1.2,0,.7],rSh:[-1.2,0,-.7],lEl:[-.3,0,0],rEl:[-.3,0,0]},{spine:[.4,0,0],lSh:[-1.55,0,.1],rSh:[-1.55,0,-.1],lEl:[-.3,0,0],rEl:[-.3,0,0],hipY:-.12}),grabExec:ht(Xe,{lSh:[-2.8,0,.4],rSh:[-2.8,0,-.4],lEl:[-.4,0,0],rEl:[-.4,0,0],spine:[-.25,0,0]},{hipY:-.25,spine:[.6,0,0],lSh:[-1.2,0,.3],rSh:[-1.2,0,-.3],lEl:[-.2,0,0],rEl:[-.2,0,0]}),cast:ht(Xe,{hipY:-.12,hips:[0,-.7,0],spine:[0,-.3,0],rSh:[.4,0,-.3],rEl:[-1.6,0,0],lSh:[.3,0,.1],lEl:[-1.7,0,0]},no),charge:ht(Xe,{hipY:-.2,spine:[.3,0,0]},{hipY:-.12,spine:[.65,-.35,0],lSh:[-1.2,0,.1],lEl:[-1.9,0,0],rSh:[-.3,0,-.3],rEl:[-1.2,0,0],lHip:[-.95,.3,.05],lKnee:[.8,0,0],rHip:[.55,.3,0],rKnee:[.3,0,0]}),uppercut:ht(Xe,{hipY:-.3,rSh:[.2,0,-.2],rEl:[-1.6,0,0],spine:[.3,0,0]},vh),counterStance:ht(Xe,{hipY:-.1},{hipY:-.12,spine:[-.15,.25,0],lSh:[-1.5,0,.7],lEl:[-1.3,0,0],rSh:[-.2,0,-.9],rEl:[-1,0,0]}),counterStrike:ht(Xe,{hipY:-.15,spine:[-.1,-.4,0]},{...no,spine:[.35,.3,0]}),powerup:ht(Xe,{hipY:-.2,spine:[.4,0,0],lSh:[-.5,0,.1],rSh:[-.5,0,-.1],lEl:[-2.2,0,0],rEl:[-2.2,0,0]},{hipY:0,spine:[-.3,0,0],head:[-.4,0,0],lSh:[-.4,0,1.4],rSh:[-.4,0,-1.4],lEl:[-.3,0,0],rEl:[-.3,0,0],lHip:[0,0,.12],lKnee:[0,0,0],rHip:[0,0,-.12],rKnee:[0,0,0]}),vanish:ht(fn,{lSh:[-1.6,.6,.2],rSh:[-1.6,-.6,-.2],lEl:[-1.4,0,0],rEl:[-1.4,0,0]},{hipY:-.1,lSh:[-2.6,0,.6],rSh:[-2.6,0,-.6],lEl:[-.3,0,0],rEl:[-.3,0,0]}),stomp:ht(Xe,{hipY:0,lHip:[-1.6,0,0],lKnee:[1.9,0,0],lSh:[-2.4,0,.5],rSh:[-2.4,0,-.5]},{hipY:-.32,spine:[.55,0,0],lHip:[-.8,0,0],lKnee:[.8,0,0],rSh:[-.9,0,-.3],rEl:[-.1,0,0],lSh:[-.9,0,.3],lEl:[-.1,0,0]}),diveKick:ht(Zn,{lHip:[-1.2,0,.1],lKnee:[1.9,0,0]},{spine:[-.2,0,0],lHip:[-.9,0,.1],lKnee:[.05,0,0],rHip:[-.8,0,0],rKnee:[1.8,0,0],lSh:[.6,0,.5],rSh:[.6,0,-.5],lEl:[-.4,0,0],rEl:[-.4,0,0]}),place:ht(fn,{rSh:[-.6,0,-.2],rEl:[-1.4,0,0]},{spine:[.55,0,0],rSh:[-.95,0,-.1],rEl:[-.25,0,0]}),beam:ht(Xe,{hipY:-.12,hips:[0,-.6,0],rSh:[.4,0,-.3],rEl:[-1.6,0,0],lSh:[.3,0,.1],lEl:[-1.7,0,0]},{...no,spine:[.05,.1,0]}),whip:ht(Xe,{spine:[-.2,-.45,0],rSh:[-2.6,0,-.9],rEl:[-.6,0,0]},{spine:[.3,.45,0],rSh:[-1.55,0,-.1],rEl:[0,0,0]}),slamRise:ht(Zn,{lSh:[-2.8,0,.4],rSh:[-2.8,0,-.4],lEl:[-.3,0,0],rEl:[-.3,0,0]},{spine:[.5,0,0],lSh:[-1.3,0,.2],rSh:[-1.3,0,-.2],lEl:[-.2,0,0],rEl:[-.2,0,0],lHip:[-1,0,.1],lKnee:[1.1,0,0]}),summon:ht(Xe,{hipY:-.15,lSh:[-.6,0,.3],rSh:[-.6,0,-.3],lEl:[-1.8,0,0],rEl:[-1.8,0,0]},{hipY:0,spine:[-.25,0,0],head:[-.55,0,0],lSh:[-2.8,0,.6],rSh:[-2.8,0,-.6],lEl:[-.2,0,0],rEl:[-.2,0,0],lHip:[0,0,.1],lKnee:[.05,0,0],rHip:[0,0,-.1],rKnee:[.05,0,0]}),guardUp:ht(Xe,{hipY:-.1},{hipY:-.14,spine:[.1,0,0],lSh:[-1.5,0,-.25],lEl:[-1,0,0],rSh:[-1.45,0,.25],rEl:[-1,0,0]}),spinKick:ht(Zn,{rHip:[-1.2,0,-.5],rKnee:[1.5,0,0]},{spine:[-.1,0,0],rHip:[-1.55,0,-.95],rKnee:[.1,0,0],lHip:[-.4,0,0],lKnee:[1.2,0,0],lSh:[-.4,0,1.3],rSh:[-.4,0,-1.3],lEl:[-.2,0,0],rEl:[-.2,0,0]}),flurry:ht(Xe,{lSh:[-1,0,.35],lEl:[-2,0,0]},gh),ultCombo:ht(Xe,{spine:[.05,-.4,0],rSh:[-.6,0,-.45],rEl:[-2.2,0,0]},al),taunt:ht(Xe,{},{})},T1=Vt(al,Xe),xh=["strong","roundhouse","jab","uppercut","strong","short","roundhouse","uppercut"];function Es(s,e,t,n,i,r){const a=e.base??Xe;if(t<=n){const c=n>0?t/n:1;return c<.6?mt(s,a,e.windup,jn(c/.6)):mt(s,e.windup,e.strike,jn((c-.6)/.4))}if(t<=n+i)return mt(s,e.strike,e.strike,0);const o=r>0?(t-n-i)/r:1;return mt(s,e.strike,a,jn(o))}class Iu{cur=new Float32Array(Xe);target=new Float32Array(Il);spin=0;hidden=!1;reset(){this.cur.set(Xe),this.spin=0}update(e,t,n){const i=this.target,r=t.ticks/60;let a=18;this.hidden=!1;let o=0;switch(e.state){case"intro":mt(i,Nr,Nr,0),i[Un]+=Math.sin(r*2)*.01;break;case"idle":case"jumpSquat":case"land":{const l=Math.sin(r*2.6+e.index)*.5+.5;mt(i,Xe,Xe,0),i[Un]+=-l*.02,i[3]+=l*.05,(e.state==="jumpSquat"||e.state==="land")&&mt(i,i,fn,.45);break}case"walkF":case"walkB":{if(e.guarding){mt(i,Dr,Dr,0);break}mt(i,Xe,Xe,0);const l=e.stateFrame*.2*(e.state==="walkB"?-1:1),h=Math.sin(l),d=Math.cos(l);i[27]+=h*.4,i[33]-=h*.4,i[30]+=Math.max(0,d)*.55,i[36]+=Math.max(0,-d)*.55,i[Un]+=Math.abs(h)*.025-.02;break}case"crouch":mt(i,e.guarding?fh:fn,fn,0);break;case"dash":{mt(i,Xe,Xe,0),i[3]+=e.dashDir>0?.3:-.25;const l=e.stateFrame*.35;i[27]+=Math.sin(l)*.5,i[33]-=Math.sin(l)*.5;break}case"sidestep":mt(i,Xe,fn,.35),i[5]+=e.sidestepDir*.2;break;case"air":case"fall":{const l=e.vy>.12;mt(i,l?M1:Zn,Zn,l?.15:0),e.state==="fall"&&(i[3]+=.2,i[15]-=.5,i[21]-=.5);break}case"attack":{const l=e.move;if(!l){mt(i,Xe,Xe,0);break}a=32;const h=io[l.anim]??io.jab,d=e.moveFrame;if(l.anim==="flurry"&&d>l.startup&&d<=l.startup+l.active){const u=Math.floor((d-l.startup)/4)%2===1,f=(d-l.startup)%4/4;mt(i,h.windup,u?T1:h.strike,jn(f*2))}else if(l.anim==="slamRise")mt(i,e.vy>0?h.windup:h.strike,h.strike,0);else if(l.anim==="spinKick")Es(i,h,d,l.startup,l.active,l.recovery),d>l.startup&&d<=l.startup+l.active&&(o=(d-l.startup)*.7);else if(l.anim==="charge"&&l.kind==="super")Es(i,h,d,l.startup,l.active,l.recovery);else if(l.anim==="throwExec"||l.anim==="grabExec"){const u=Ir(d/26);mt(i,h.windup,h.strike,jn(u)),d>30&&mt(i,h.strike,Xe,jn((d-30)/14))}else l.anim==="vanish"?(Es(i,h,d,l.startup,l.active,l.recovery),d>=5&&d<=11&&(this.hidden=!0)):Es(i,h,d,l.startup,l.active,l.recovery);break}case"hitstun":{const l=e.hitHigh?to:ph,h=Ir(e.stateFrame/6);mt(i,Xe,l,h<1?jn(h):1),a=40;break}case"blockstun":mt(i,e.relDir===1?fh:Dr,Dr,0),a=40;break;case"juggle":case"thrown":{const l=e.state==="thrown"?w1:b1;if(mt(i,l,l,0),e.state==="juggle"){const h=Math.min(1.3,.9+e.stateFrame*.02);i[rl]=-h,e.vy<0&&e.y<.8&&mt(i,i,kr,Ir((.8-e.y)/.8)*.7)}a=22;break}case"knockdown":case"ko":mt(i,kr,kr,0),a=14;break;case"getup":{const l=Ir(e.stateFrame/20);l<.5?mt(i,kr,fn,jn(l*2)):mt(i,fn,Xe,jn((l-.5)*2)),a=30;break}case"dizzy":mt(i,mh,mh,0),i[12]+=Math.sin(r*7)*.35,i[14]+=Math.sin(r*5)*.35,i[5]+=Math.sin(r*3.5)*.18;break;case"victory":{const l=Ur[e.victoryVariant%Ur.length];mt(i,l,l,0),e.victoryVariant%3===1&&(i[21]+=Math.sin(r*9)*.25),e.victoryVariant%3===2&&(i[12]+=Math.sin(r*4)*.12),i[Un]+=Math.abs(Math.sin(r*3))*.02,a=10;break}case"cinematic":{const l=t.cinematic;if(l&&l.att===e){const h=Math.floor(e.stateFrame/11)%xh.length,d=io[xh[h]],u=e.stateFrame%11;Es(i,d,u,6,2,3),a=40}else{const h=Math.floor(e.stateFrame/11)%2===0;mt(i,h?to:ph,to,0),a=30}break}}this.spin=o>0?o:this.spin*.8;const c=1-Math.exp(-n*a);mt(this.cur,this.cur,i,c)}showcase(e,t,n,i=0,r=0){const a=this.target;if(n==="victory"){const o=Ur[i%Ur.length];mt(a,o,o,0),i%3===1&&(a[21]+=Math.sin(t*9+r)*.25),a[Un]+=Math.abs(Math.sin(t*3+r))*.02}else if(n==="intro")mt(a,Nr,Nr,0);else{const o=Math.sin(t*2.6+r)*.5+.5;mt(a,Xe,Xe,0),a[Un]+=-o*.02,a[3]+=o*.05}this.hidden=!1,this.spin*=.8,mt(this.cur,this.cur,a,1-Math.exp(-e*10))}apply(e){const t=this.cur,n=[e.hips,e.spine,e.chest,e.neck,e.head,e.lSh,e.lEl,e.rSh,e.rEl,e.lHip,e.lKnee,e.rHip,e.rKnee];for(let i=0;i<n.length;i++)n[i].rotation.set(t[i*3],t[i*3+1],t[i*3+2]);e.hips.rotation.y+=this.spin,e.pivot.position.y=Cu+t[Un],e.pivot.rotation.x=t[rl],e.pivot.rotation.z=t[Lu]}}function A1(s,e,t=0){const n=Fs,i=new Iu;i.cur.set(n),i.apply(s)}const Fr=900,Tn=new Ot,so=new qe;class C1{group=new kt;inst;particles=[];rings=[];flashes=[];constructor(){const e=new Al(1,0),t=new vn({color:16777215,transparent:!0,blending:Kr,depthWrite:!1});this.inst=new Ws(e,t,Fr),this.inst.instanceMatrix.setUsage(Jd),this.inst.frustumCulled=!1;for(let n=0;n<Fr;n++)Tn.scale.setScalar(0),Tn.updateMatrix(),this.inst.setMatrixAt(n,Tn.matrix),this.inst.setColorAt(n,so.set(16777215));this.group.add(this.inst);for(let n=0;n<24;n++){const i=new je(new Cl(.8,1,40),gt(16777215,1));i.material.side=an,i.visible=!1,this.group.add(i),this.rings.push({mesh:i,life:0,max:1,from:0,to:1,active:!1})}for(let n=0;n<12;n++){const i=new je(new Re(1,16,12),gt(16777215,1));i.visible=!1,this.group.add(i),this.flashes.push({mesh:i,life:0,max:1,from:0,to:1,active:!1})}}clear(){this.particles.length=0;for(const e of[...this.rings,...this.flashes])e.active=!1,e.mesh.visible=!1}burst(e,t,n,i,r,a,o=.05,c=.004,l=30){for(let h=0;h<r;h++){this.particles.length>=Fr&&this.particles.shift();const d=Math.random()*Math.PI*2,u=Math.acos(2*Math.random()-1),f=a*(.4+Math.random()*.8);this.particles.push({x:e,y:t,z:n,vx:Math.sin(u)*Math.cos(d)*f,vy:Math.cos(u)*f+a*.3,vz:Math.sin(u)*Math.sin(d)*f*.6,life:l*(.6+Math.random()*.6),max:l,size:o*(.6+Math.random()*.8),color:new qe(i),grav:c,drag:.92})}}ring(e,t,n,i,r,a,o,c=!1){const l=this.rings.find(h=>!h.active)??this.rings[0];l.active=!0,l.life=o,l.max=o,l.from=r,l.to=a,l.mesh.visible=!0,l.mesh.position.set(e,t,n),l.mesh.rotation.set(c?-Math.PI/2:0,0,0),l.mesh.material.color.set(i)}flash(e,t,n,i,r,a=8){const o=this.flashes.find(c=>!c.active)??this.flashes[0];o.active=!0,o.life=a,o.max=a,o.from=r*.4,o.to=r,o.mesh.visible=!0,o.mesh.position.set(e,t,n),o.mesh.material.color.set(i)}hitSpark(e,t,n,i,r,a){if(r){this.burst(e,t,n,8965375,10,.06,.04,.001,16),this.ring(e,t,n,10475775,.1,.6,12);return}const o=a??(i==="super"?16765440:i==="special"?16747008:i==="heavy"?16757575:16773544),c=i==="light"?12:i==="heavy"?22:i==="special"?26:40,l=i==="light"?.07:i==="heavy"?.1:.12;this.burst(e,t,n,o,c,l,i==="light"?.045:.06,.003,22),this.burst(e,t,n,16777215,Math.round(c/3),l*1.3,.035,.001,12),this.flash(e,t,n,16777215,i==="light"?.28:.45,6),this.ring(e,t,n,o,.1,i==="light"?.6:i==="super"?1.8:1.1,i==="light"?10:16)}update(e){const t=Math.min(3,e*60);let n=0;const i=this.particles;for(let r=i.length-1;r>=0;r--){const a=i[r];if(a.life-=t,a.life<=0){i.splice(r,1);continue}a.vy-=a.grav*t,a.vx*=Math.pow(a.drag,t),a.vy*=Math.pow(a.drag,t),a.vz*=Math.pow(a.drag,t),a.x+=a.vx*t,a.y+=a.vy*t,a.z+=a.vz*t,a.y<.02&&(a.y=.02,a.vy*=-.3)}for(const r of i){const a=r.life/r.max;Tn.position.set(r.x,r.y,r.z),Tn.rotation.set(r.life*.3,r.life*.2,0),Tn.scale.setScalar(r.size*(.3+a*.9)),Tn.updateMatrix(),this.inst.setMatrixAt(n,Tn.matrix),so.copy(r.color).multiplyScalar(.4+a),this.inst.setColorAt(n,so),n++}for(;n<Fr;n++)Tn.scale.setScalar(0),Tn.updateMatrix(),this.inst.setMatrixAt(n,Tn.matrix);this.inst.instanceMatrix.needsUpdate=!0,this.inst.instanceColor&&(this.inst.instanceColor.needsUpdate=!0);for(const r of[...this.rings,...this.flashes]){if(!r.active)continue;if(r.life-=t,r.life<=0){r.active=!1,r.mesh.visible=!1;continue}const a=1-r.life/r.max;r.mesh.scale.setScalar(r.from+(r.to-r.from)*(1-(1-a)*(1-a))),r.mesh.material.opacity=1-a}}}function X(s,e,t,n=[0,0,0],i=[0,0,0],r){const a=new je(e,typeof t=="number"?Dt(t):t);return a.position.set(...n),a.rotation.set(...i),r&&a.scale.set(...r),a.castShadow=!0,s.add(a),a}function Or(s,e,t,n,i){const r=document.createElement("canvas");r.width=256,r.height=Math.round(256*i/n);const a=r.getContext("2d");a.fillStyle=t,a.fillRect(0,0,r.width,r.height),a.fillStyle=e,a.font=`bold ${Math.round(r.height*.55)}px Arial, sans-serif`,a.textAlign="center",a.textBaseline="middle",a.fillText(s,r.width/2,r.height/2);const o=new ru(r);return o.colorSpace=jt,new je(new on(n,i),new vn({map:o,side:an}))}const Br=typeof document<"u";function na(s,e){const t=new kt;switch(s){case"orb":default:X(t,new Re(.22,16,12),gt(e,.9)),X(t,new Re(.12,12,10),gt(16777215,1));break;case"ballot":{X(t,new Te(.4,.34,.34),3895256),X(t,new Te(.2,.02,.06),1118481,[0,.175,0]),X(t,new Te(.14,.12,.005),16777215,[0,.24,0],[0,0,.1]);break}case"gavel":{X(t,new Ue(.09,.09,.3,12),8014372,[0,.12,0],[0,0,Math.PI/2]),X(t,new Ue(.025,.025,.4,8),10251067,[0,-.08,0]),X(t,new Ue(.1,.1,.03,12),13934674,[.155,.12,0],[0,0,Math.PI/2]),X(t,new Ue(.1,.1,.03,12),13934674,[-.155,.12,0],[0,0,Math.PI/2]);break}case"book":{X(t,new Te(.36,.46,.1),e),X(t,new Te(.34,.44,.08),16117984,[.015,0,0]);break}case"paper":{X(t,new Te(.34,.44,.01),16777215);for(let n=0;n<5;n++)X(t,new Te(.24,.02,.012),7829367,[0,.14-n*.07,.002]);X(t,new Te(.1,.06,.014),e,[.08,-.17,.003]);break}case"coin":case"shekel":{if(X(t,new Ue(.22,.22,.05,20),15909198,[0,0,0],[Math.PI/2,0,0]),X(t,new Nt(.2,.02,6,20),13934615),Br){const n=Or("₪","#8a6500","rgba(0,0,0,0)",.28,.28);n.material.transparent=!0,n.position.z=.03,t.add(n)}break}case"mic":{if(X(t,new Re(.11,12,10),4473924,[.18,0,0]),X(t,new Ue(.04,.05,.3,10),1118481,[0,0,0],[0,0,Math.PI/2]),Br){const n=Or("NEWS","#ffffff","#"+e.toString(16).padStart(6,"0"),.14,.07);n.position.set(.05,.07,0),t.add(n)}break}case"tv":{X(t,new Te(.5,.36,.18),2236962),X(t,new on(.42,.28),gt(e,.9),[0,0,.091]),X(t,new Ue(.008,.008,.25,6),10066329,[.08,.28,0],[0,0,-.5]),X(t,new Ue(.008,.008,.25,6),10066329,[-.08,.28,0],[0,0,.5]);break}case"envelope":{X(t,new Te(.44,.28,.03),16052193),X(t,new Zt(.22,.14,4),14735552,[0,.06,.02],[Math.PI,Math.PI/4,0],[1.4,1,.1]),X(t,new Ue(.035,.035,.02,12),12066084,[0,0,.02],[Math.PI/2,0,0]);break}case"phone":{X(t,new Te(.22,.42,.04),1710618),X(t,new on(.19,.36),gt(e,1),[0,0,.021]);break}case"bomb":{X(t,new Re(.24,18,14),1710618),X(t,new Ue(.06,.06,.08,10),4473924,[0,.26,0]),X(t,new Ue(.012,.012,.12,6),13148266,[.03,.34,0],[0,0,-.4]),X(t,new Re(.04,8,6),gt(16755200,1),[.06,.4,0]),X(t,new Nt(.245,.02,6,24,Math.PI*.9),16720418,[0,0,0],[0,0,-Math.PI*.1]);break}case"plane":{const n=new qs;n.moveTo(.3,0),n.lineTo(-.25,.2),n.lineTo(-.15,0),n.lineTo(-.25,-.2),n.closePath();const i=X(t,new oa(n),new Ps({color:16777215,side:an}));i.rotation.x=Math.PI/2,X(t,new Te(.5,.02,.02),14540253,[.02,-.03,0]);break}case"jet":{X(t,new Ue(.06,.08,.6,10),8030873,[0,0,0],[0,0,-Math.PI/2]),X(t,new Zt(.06,.18,10),5595243,[.39,0,0],[0,0,-Math.PI/2]),X(t,new Te(.28,.02,.6),6978185,[-.04,0,0]),X(t,new Te(.12,.18,.02),6978185,[-.26,.09,0]),X(t,new Re(.06,8,6),gt(16750848,.9),[-.33,0,0]);break}case"tomato":{X(t,new Re(.2,16,12),14692398,[0,0,0],[0,0,0],[1,.85,1]),X(t,new Zt(.08,.06,5),3115567,[0,.18,0]);break}case"watermelon":{X(t,new Re(.26,18,14),2980397,[0,0,0],[0,0,0],[1.25,1,1]);for(let n=0;n<6;n++)X(t,new Nt(.262,.012,4,24,Math.PI),1789211,[0,0,0],[0,n/6*Math.PI,Math.PI/2],[1,1.25,1]);break}case"brick":{X(t,new Te(.44,.2,.22),11879983),X(t,new Te(.46,.02,.24),13616824,[0,.1,0]);break}case"bin":{if(X(t,new Ue(.2,.16,.42,14),2984527),X(t,new Ue(.22,.22,.04,14),2388031,[0,.23,0]),Br){const n=Or("♻","#ffffff","rgba(0,0,0,0)",.2,.2);n.material.transparent=!0,n.position.set(0,0,.19),t.add(n)}break}case"cone":{X(t,new Zt(.2,.55,14),16743168,[0,.22,0]),X(t,new Ue(.155,.13,.08,14),16777215,[0,.2,0]),X(t,new Te(.44,.04,.44),16743168,[0,-.04,0]);break}case"train":{X(t,new Te(.8,.36,.3),e),X(t,new Te(.82,.12,.31),14606046,[0,.1,0]);for(let n=0;n<3;n++)X(t,new Te(.16,.1,.32),gt(10477823,.8),[-.25+n*.25,.1,0]);X(t,new Re(.19,12,10),e,[.4,-.02,0],[0,0,0],[.6,.9,.8]),X(t,new Re(.035,8,6),gt(16777130,1),[.5,-.06,.1]),X(t,new Re(.035,8,6),gt(16777130,1),[.5,-.06,-.1]);break}case"tank":{X(t,new Te(.7,.2,.42),4936480,[0,-.05,0]),X(t,new Te(.34,.14,.3),5923880,[-.04,.12,0]),X(t,new Ue(.03,.03,.45,8),3818008,[.3,.14,0],[0,0,Math.PI/2]),X(t,new Te(.76,.12,.1),2236962,[0,-.15,.2]),X(t,new Te(.76,.12,.1),2236962,[0,-.15,-.2]);break}case"syringe":{X(t,new Ue(.06,.06,.34,12),new Ps({color:15267839,transparent:!0,opacity:.75}),[0,0,0],[0,0,Math.PI/2]),X(t,new Ue(.05,.05,.24,10),gt(e,.9),[.03,0,0],[0,0,Math.PI/2]),X(t,new Ue(.006,.006,.16,6),13421772,[.25,0,0],[0,0,Math.PI/2]),X(t,new Ue(.02,.02,.12,6),10066329,[-.22,0,0],[0,0,Math.PI/2]);break}case"sign":{if(X(t,new Ue(.02,.02,.6,6),10251067,[0,-.22,0]),X(t,new Te(.5,.34,.02),16777215,[0,.14,0]),Br){const n=Or("VOTE!","#"+e.toString(16).padStart(6,"0"),"#ffffff",.46,.3);n.position.set(0,.14,.012),t.add(n)}break}case"megaphone":{X(t,new Ue(.2,.06,.4,14,1,!0),new Ps({color:15921906,side:an}),[.05,0,0],[0,0,-Math.PI/2]),X(t,new Nt(.2,.02,6,20),e,[.25,0,0],[0,Math.PI/2,0]),X(t,new Te(.05,.14,.05),3355443,[-.08,-.1,0]);break}case"chalk":{X(t,new Ue(.035,.035,.26,8),16777215,[0,0,0],[0,0,Math.PI/2]),X(t,new Re(.12,8,6),gt(16777215,.35),[-.12,0,0]);break}case"scissors":{X(t,new Te(.4,.04,.02),13621468,[.1,.02,0],[0,0,.2]),X(t,new Te(.4,.04,.02),13621468,[.1,-.02,.01],[0,0,-.2]),X(t,new Nt(.06,.018,6,12),e,[-.14,.07,0]),X(t,new Nt(.06,.018,6,12),e,[-.14,-.07,0]);break}case"tooth":{X(t,new Re(.2,14,10),16777215,[0,.06,0],[0,0,0],[1,.8,.9]),X(t,new Zt(.07,.24,8),16053492,[-.08,-.14,0],[Math.PI,0,.2]),X(t,new Zt(.07,.24,8),16053492,[.08,-.14,0],[Math.PI,0,-.2]);break}case"drill":{X(t,new Te(.22,.14,.12),2792847),X(t,new Te(.08,.2,.1),2508371,[-.06,-.14,0]),X(t,new Zt(.035,.24,8),13421772,[.22,0,0],[0,0,-Math.PI/2]);break}case"star":{const n=new qs;for(let i=0;i<10;i++){const r=i%2===0?.26:.11,a=i/10*Math.PI*2+Math.PI/2;i===0?n.moveTo(Math.cos(a)*r,Math.sin(a)*r):n.lineTo(Math.cos(a)*r,Math.sin(a)*r)}n.closePath(),X(t,new Tl(n,{depth:.06,bevelEnabled:!1}),16766474,[0,0,-.03]);break}case"flag":{X(t,new Ue(.015,.015,.7,6),14540253,[-.2,-.1,0]),X(t,new Te(.42,.28,.01),16777215,[.02,.1,0]),X(t,new Te(.42,.04,.012),e,[.02,.2,0]),X(t,new Te(.42,.04,.012),e,[.02,0,0]);break}case"wave":{X(t,new Nt(.3,.07,8,20,Math.PI),gt(e,.85),[0,-.05,0],[0,Math.PI/2,0]).scale.set(1,1,1.4),X(t,new Nt(.2,.05,8,16,Math.PI),gt(16777215,.8),[.05,-.05,0],[0,Math.PI/2,0]);break}case"sound":{for(let n=0;n<3;n++)X(t,new Nt(.12+n*.07,.022,6,20,Math.PI*.8),gt(e,.9-n*.2),[n*.07,0,0],[0,Math.PI/2,Math.PI*.6]);break}case"dish":{X(t,new Re(.24,16,8,0,Math.PI*2,0,Math.PI*.35),new Ps({color:15790320,side:an}),[0,0,0],[0,0,-Math.PI/2]),X(t,new Ue(.01,.01,.2,6),7829367,[.1,0,0],[0,0,Math.PI/2]),X(t,new Re(.04,8,6),gt(e,1),[.2,0,0]);break}case"briefcase":{X(t,new Te(.46,.32,.12),5978654),X(t,new Nt(.06,.015,6,12,Math.PI),2759182,[0,.16,0]),X(t,new Te(.05,.04,.13),13934674,[0,.08,0]);break}case"siren":{X(t,new Ue(.16,.18,.08,14),3355443,[0,-.1,0]),X(t,new Re(.15,14,10,0,Math.PI*2,0,Math.PI/2),gt(e,.95),[0,-.06,0]),X(t,new Re(.28,12,10),gt(e,.25),[0,0,0]);break}case"tower":{X(t,new Ue(.02,.12,.8,4,1),12568527,[0,.3,0]);for(let n=0;n<3;n++)X(t,new Nt(.1+n*.07,.012,4,16,Math.PI*.6),gt(e,.9),[0,.7,0],[0,0,Math.PI*.2]);X(t,new Re(.04,8,6),gt(16724821,1),[0,.72,0]);break}case"ball":{X(t,new Re(.2,16,12),16777215);for(let n=0;n<3;n++)X(t,new Nt(.2,.012,4,20),1118481,[0,0,0],[0,n*Math.PI/3,0]);break}case"whistle":{X(t,new Ue(.1,.1,.12,12),12632256,[0,0,0],[Math.PI/2,0,0]),X(t,new Te(.2,.06,.08),11579568,[.12,.05,0]);break}case"fire":{X(t,new Zt(.2,.5,10),gt(e,.9),[0,.05,0],[0,0,-Math.PI/2]),X(t,new Re(.2,12,10),gt(16768341,.9),[.1,0,0]),X(t,new Re(.1,10,8),gt(16777215,1),[.12,0,0]);break}case"snowflake":{for(let n=0;n<3;n++)X(t,new Te(.46,.04,.04),gt(e,.95),[0,0,0],[0,0,n*Math.PI/3]);X(t,new Re(.2,12,10),gt(16777215,.25));break}case"leaf":{X(t,new Re(.22,12,8),5613104,[0,0,0],[0,0,.6],[1,.45,.12]),X(t,new Te(.4,.015,.02),2849291,[0,0,0],[0,0,.6]);break}case"heart":{X(t,new Re(.12,12,10),e,[-.08,.06,0]),X(t,new Re(.12,12,10),e,[.08,.06,0]),X(t,new Zt(.17,.24,12),e,[0,-.1,0],[Math.PI,0,0]);break}case"shield":{X(t,new Ue(.25,.25,.04,20),e,[0,0,0],[Math.PI/2,0,0]),X(t,new Nt(.25,.03,6,20),13934674);break}case"crane":{X(t,new Te(.06,.8,.06),16759304,[0,.3,0]),X(t,new Te(.7,.05,.05),16759304,[.2,.68,0]),X(t,new Ue(.005,.005,.3,4),3355443,[.45,.52,0]),X(t,new Te(.16,.08,.08),11879983,[.45,.35,0]),X(t,new Te(.36,.06,.36),5592405,[0,-.08,0]);break}case"map":{X(t,new Te(.5,.02,.36),15326389),X(t,new Zt(.04,.12,8),14034984,[.1,.07,.05],[Math.PI,0,0]),X(t,new Zt(.04,.12,8),1920728,[-.12,.07,-.06],[Math.PI,0,0]),X(t,new Te(.3,.022,.015),5800279,[0,.005,.02],[0,.4,0]);break}case"clock":{X(t,new Ue(.22,.22,.06,20),16777215,[0,.22,0],[Math.PI/2,0,0]),X(t,new Nt(.22,.025,6,20),e,[0,.22,0]),X(t,new Te(.02,.14,.02),1118481,[0,.27,.035]),X(t,new Te(.1,.02,.02),1118481,[.05,.22,.035]);break}case"chair":{X(t,new Te(.34,.05,.34),2051993,[0,0,0]),X(t,new Te(.34,.36,.05),2051993,[0,.2,-.15]);for(const n of[-.14,.14])for(const i of[-.14,.14])X(t,new Ue(.015,.015,.3,6),4473924,[n,-.17,i]);break}case"laptop":{X(t,new Te(.46,.02,.32),11581376,[0,-.1,0]),X(t,new Te(.46,.3,.02),11581376,[0,.05,-.16],[-.25,0,0]),X(t,new on(.42,.26),gt(e,1),[0,.05,-.145],[-.25,0,0]);break}}return t}function at(s,e,t,n,i=[0,0,0],r=!0){const a=new je(new Te(...e),typeof t=="number"?Dt(t):t);return a.position.set(...n),a.rotation.set(...i),a.castShadow=r,a.receiveShadow=!0,s.add(a),a}function Hn(s,e,t,n=[1,1]){const i=document.createElement("canvas");i.width=s,i.height=e,t(i.getContext("2d"),s,e);const r=new ru(i);return r.colorSpace=jt,r.wrapS=r.wrapT=$r,r.repeat.set(n[0],n[1]),r.anisotropy=4,r}function Ui(s,e,t,n,i=.08){for(let r=0;r<n;r++){const a=Math.random()>.5?255:0;s.fillStyle=`rgba(${a},${a},${a},${i*Math.random()})`,s.fillRect(Math.random()*e,Math.random()*t,2,2)}}function js(s,e,t=16777215,n=[60,40]){const i=new je(new on(n[0],n[1]),new ri({map:e,color:t,roughness:.85,metalness:.02}));return i.rotation.x=-Math.PI/2,i.position.z=-n[1]/2+12,i.receiveShadow=!0,s.add(i),i}function ha(s,e,t,n){const i=new Re(120,32,16),r=new Rn({side:en,depthWrite:!1,fog:!1,uniforms:{top:{value:new qe(e)},bottom:{value:new qe(t)},horizon:{value:new qe(n??t)}},vertexShader:"varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",fragmentShader:`uniform vec3 top; uniform vec3 bottom; uniform vec3 horizon; varying vec3 vP;
      void main(){ float h = vP.y; vec3 c = h > 0.0 ? mix(horizon, top, pow(h, 0.6)) : mix(horizon, bottom, pow(-h, 0.5));
      gl_FragColor = vec4(c, 1.0); }`}),a=new je(i,r);a.renderOrder=-10,s.add(a)}function Qs(s,e,t,n=1){const i=e.length,r=new Zs(.22*n,.45*n,4,8),a=new Re(.16*n,10,8),o=new Ws(r,Dt(16777215),i),c=new Ws(a,Dt(16777215),i),l=[15845285,15251604,14262908,13012579,9263675],h=new qe,d=[];for(let g=0;g<i;g++)o.setColorAt(g,h.set(t[g%t.length])),c.setColorAt(g,h.set(l[g*7%l.length])),d.push(Math.random()*Math.PI*2);o.castShadow=!1,c.castShadow=!1,s.add(o,c);const u=new Ot,f=g=>{for(let S=0;S<i;S++){const[p,m,M]=e[S],T=Math.max(0,Math.sin(g*5+d[S]))*.08*n;u.position.set(p,m+.45*n+T,M),u.rotation.set(0,0,0),u.scale.setScalar(1),u.updateMatrix(),o.setMatrixAt(S,u.matrix),u.position.set(p,m+.98*n+T,M),u.updateMatrix(),c.setMatrixAt(S,u.matrix)}o.instanceMatrix.needsUpdate=!0,c.instanceMatrix.needsUpdate=!0};return f(0),f}function Dl(s,e,t,n){const i=new kt,r=new ri({color:n,metalness:.7,roughness:.35}),a=(o,c,l=[0,0,0])=>{const h=new je(o,r);h.position.set(...c),h.rotation.set(...l),h.castShadow=!0,i.add(h)};a(new Te(1.4,.3,.8),[0,.15,0]),a(new Ue(.12,.16,3.2,10),[0,1.9,0]);for(let o=1;o<=3;o++){const c=o*.55;a(new Nt(c,.09,8,24,Math.PI),[0,3.4,0],[0,0,Math.PI]);for(const l of[-1,1])a(new Ue(.09,.09,1.1+.05*o,8),[l*c,3.4+.55,0])}a(new Ue(.09,.09,1.2,8),[0,4,0]);for(let o=-3;o<=3;o++)a(new Ue(.13,.08,.14,8),[o*.55,4.6,0]);return i.position.set(...e),i.scale.setScalar(t),s.add(i),i}function P1(s,e,t){const n=new kt;for(let i=0;i<8;i++){const r=new je(new Ue(.13-i*.008,.15-i*.008,t/8,8),Dt(9071172));r.position.set(Math.sin(i*.25)*.15,(i+.5)*(t/8),0),r.castShadow=!0,n.add(r)}for(let i=0;i<7;i++){const r=new je(new Re(.9,8,6),Dt(3112242));r.scale.set(1.3,.12,.35);const a=i/7*Math.PI*2;r.position.set(Math.cos(a)*.8+.3,t+.05,Math.sin(a)*.8),r.rotation.set(0,-a,-.35),r.castShadow=!0,n.add(r)}n.position.set(...e),s.add(n)}function _h(s,e,t,n,i){const r=[];for(let a=0;a<n;a++){const o=a/(n-1),c=e[0]+(t[0]-e[0])*o,l=e[2]+(t[2]-e[2])*o,h=e[1]+(t[1]-e[1])*o-Math.sin(o*Math.PI)*.8,d=new je(new Re(.07,8,6),new vn({color:i[a%i.length]}));d.position.set(c,h,l),s.add(d),r.push(d)}return r}function R1(s,e,t,n,i){return Hn(256,512,(r,a,o)=>{r.fillStyle=i,r.fillRect(0,0,a,o);const c=a/s,l=o/e;for(let h=0;h<e;h++)for(let d=0;d<s;d++)r.fillStyle=Math.random()<.55?t:n,r.fillRect(d*c+3,h*l+3,c-6,l-6)})}function L1(s){switch(s.kind){case"plenum":return I1();case"plaza":return D1();case"committee":return k1();case"beach":return U1();case"market":return N1();case"rooftop":return F1()}}function I1(){const s=new kt,e=Hn(256,256,(g,S,p)=>{g.fillStyle="#23407a",g.fillRect(0,0,S,p),g.strokeStyle="rgba(160,190,255,0.18)",g.lineWidth=3;for(let m=0;m<8;m++)g.beginPath(),g.moveTo(0,m*32+16),g.lineTo(S,m*32+16),g.stroke();Ui(g,S,p,3e3,.12)},[14,10]);js(s,e);const t=Hn(512,256,(g,S,p)=>{g.fillStyle="#d8c7a3",g.fillRect(0,0,S,p),g.strokeStyle="rgba(120,100,70,0.35)";for(let m=0;m<8;m++){const M=m%2*32;for(let T=-1;T<9;T++)g.strokeRect(T*64+M,m*32,64,32)}Ui(g,S,p,4e3,.1)},[6,3]),n=new je(new on(60,18),new ri({map:t,roughness:.95}));n.position.set(0,9,-13),n.receiveShadow=!0,s.add(n),at(s,[9,1.2,1.6],7031342,[0,.6,-8.5]),at(s,[7,.9,1.2],8148532,[0,1.65,-9.4]),at(s,[.9,1.4,.6],5913893,[0,1.3,-7.6]),Dl(s,[0,2.3,-12.6],.8,13936722);const i=[3895256,14263361,3115626];for(let g=0;g<3;g++){const S=at(s,[5,5.5,.1],Dt(i[g]),[-12+g*12,5.5,-12.8],[0,0,0],!1);g===1&&(S.visible=!1)}const r=Dt(8148532),a=Dt(2908088),o=[],c=[],l=[],h=new Ot;for(let g=0;g<4;g++){const S=9+g*1.6,p=g*.55,m=16+g*3;for(let M=0;M<m;M++){const T=Math.PI*1.08+M/(m-1)*Math.PI*.84,_=Math.cos(T)*S*1.35,b=3+Math.sin(T)*S;b>-2.5||(h.position.set(_,p+.45,b),h.rotation.set(0,-T-Math.PI/2,0),h.updateMatrix(),o.push(h.matrix.clone()),h.position.set(_+Math.cos(T)*.7,p+.35,b+Math.sin(T)*.7),h.updateMatrix(),c.push(h.matrix.clone()),(M+g)%3!==0&&l.push([_+Math.cos(T)*.7,p+.1,b+Math.sin(T)*.7]))}}const d=new Ws(new Te(1.1,.9,.55),r,o.length);o.forEach((g,S)=>d.setMatrixAt(S,g)),d.receiveShadow=!0;const u=new Ws(new Te(.6,1,.5),a,c.length);c.forEach((g,S)=>u.setMatrixAt(S,g)),s.add(d,u);const f=Qs(s,l,[1780298,2961206,1118742,3820126,15921906,5913893]);for(let g=-2;g<=2;g++){const S=new je(new Te(8,.1,.4),new vn({color:16774358}));S.position.set(g*9,12,-4),s.add(S)}return{group:s,update:g=>f(g),lighting:{background:1709072,fog:[1709072,22,60],hemiSky:16773336,hemiGround:2763332,hemiIntensity:1.1,key:16773590,keyIntensity:2.6,keyPos:[4,12,8],rim:7314431,rimIntensity:1.4}}}function D1(){const s=new kt;ha(s,3112921,13624567,15266555);const e=Hn(256,256,(o,c,l)=>{o.fillStyle="#d9cdb4",o.fillRect(0,0,c,l),o.strokeStyle="rgba(110,95,70,0.35)",o.lineWidth=2;for(let h=0;h<=4;h++)o.beginPath(),o.moveTo(h*64,0),o.lineTo(h*64,l),o.stroke(),o.beginPath(),o.moveTo(0,h*64),o.lineTo(c,h*64),o.stroke();Ui(o,c,l,3e3,.1)},[16,12]);js(s,e,16777215,[120,80]);const t=Dt(6134586);for(const o of[-16,16])at(s,[14,.1,10],t,[o,.05,-10],[0,0,0],!1);const n=new kt,i=Dt(15195330);at(n,[34,1.2,8],i,[0,7.4,0]),at(n,[32,6.8,6],Dt(3815994),[0,3.4,-.5]);for(let o=0;o<15;o++)at(n,[1,6.8,1],i,[-14+o*2,3.4,3.2]);at(n,[36,.6,9],Dt(13616040),[0,.3,0]),n.position.set(0,0,-26),s.add(n),Dl(s,[8,0,-12],.9,723e4);for(const o of[-10,-7,10.5,13.5]){at(s,[.08,7,.08],14540253,[o,3.5,-16]);const c=new kt;at(c,[1.6,1.1,.03],16777215,[.8,0,0],[0,0,0],!1),at(c,[1.6,.16,.035],2052031,[.8,.38,0],[0,0,0],!1),at(c,[1.6,.16,.035],2052031,[.8,-.38,0],[0,0,0],!1),c.position.set(o,6.3,-16),s.add(c)}for(const[o,c]of[[-13,-7],[-17,-12],[15,-7],[18,-13],[-6,-18],[5,-19]]){at(s,[.3,2.2,.3],6967862,[o,1.1,c]);const l=new je(new Re(1.4,10,8),Dt(8362586));l.scale.set(1.2,.8,1.1),l.position.set(o,2.8,c),l.castShadow=!0,s.add(l)}const r=[];for(let o=0;o<40;o++)r.push([-18+o%20*1.9+(o>19?.9:0),0,-8.5-(o>19?1.4:0)]);const a=Qs(s,r,[2052031,16777215,14035001,2961206,15909198,3833156]);return{group:s,update:o=>a(o),lighting:{background:13624567,fog:[14412278,35,110],hemiSky:13625599,hemiGround:9075290,hemiIntensity:1.3,key:16774624,keyIntensity:3,keyPos:[-8,16,10],rim:16777215,rimIntensity:.6}}}function k1(){const s=new kt,e=Hn(256,256,(l,h,d)=>{l.fillStyle="#6a2c2c",l.fillRect(0,0,h,d),l.fillStyle="rgba(255,210,150,0.08)";for(let u=0;u<16;u++)for(let f=0;f<16;f++)(u+f)%2===0&&l.fillRect(u*16,f*16,16,16);Ui(l,h,d,2500,.12)},[16,10]);js(s,e);const t=Hn(256,256,(l,h,d)=>{l.fillStyle="#6b4a2e",l.fillRect(0,0,h,d);for(let u=0;u<16;u++)l.fillStyle=`rgba(40,20,10,${.08+Math.random()*.12})`,l.fillRect(u*16,0,2,d);Ui(l,h,d,2e3,.1)},[10,2]),n=new je(new on(60,12),new ri({map:t,roughness:.8}));n.position.set(0,6,-11),s.add(n);const i=Dt(4861724);at(s,[16,.9,1.6],i,[0,.45,-7]),at(s,[1.6,.9,6],i,[-9,.45,-4.5]),at(s,[1.6,.9,6],i,[9,.45,-4.5]);const r=Dt(1710618),a=[];for(let l=0;l<12;l++){const h=-7.2+l*1.3;at(s,[.7,1.3,.6],r,[h,.65,-8.3]),a.push([h,.2,-8.2]),at(s,[.25,.3,.02],16053492,[h,1.05,-6.2],[-.4,0,0],!1),at(s,[.08,.26,.08],new ri({color:10474495,transparent:!0,opacity:.6}),[h+.35,1.03,-6.6])}const o=Qs(s,a,[1780298,2961206,1118742,5913893]),c=Hn(512,288,(l,h,d)=>{l.fillStyle="#0b1a2e",l.fillRect(0,0,h,d),l.fillStyle="#9fd3ff",l.font="bold 28px Arial",l.fillText("STATE BUDGET 2026",24,44);const u=["#ffd166","#ef476f","#06d6a0","#118ab2","#f78c6b"];for(let f=0;f<10;f++){const g=40+Math.random()*170;l.fillStyle=u[f%u.length],l.fillRect(30+f*46,d-20-g,32,g)}});for(const l of[-8,8]){at(s,[5.4,3.2,.2],1118481,[l,5,-10.8]);const h=new je(new on(5,2.8),new vn({map:c}));h.position.set(l,5,-10.69),s.add(h)}return Dl(s,[0,4.2,-10.9],.55,13936722),{group:s,update:l=>o(l),lighting:{background:1313800,fog:[1313800,18,50],hemiSky:16769728,hemiGround:2759188,hemiIntensity:1,key:16770756,keyIntensity:2.5,keyPos:[3,11,7],rim:16756848,rimIntensity:1.2}}}function U1(){const s=new kt;ha(s,3817359,3811914,16751194);const e=Hn(256,256,(h,d,u)=>{h.fillStyle="#e6c894",h.fillRect(0,0,d,u),Ui(h,d,u,6e3,.15)},[20,12]);js(s,e,16777215,[120,60]);const t=new on(200,80,60,20),n=new je(t,new ri({color:2781086,roughness:.25,metalness:.3,flatShading:!0}));n.rotation.x=-Math.PI/2,n.position.set(0,.05,-52),s.add(n);const i=new je(new aa(6,32),new vn({color:16757594,fog:!1}));i.position.set(-18,7,-110),s.add(i);for(let h=0;h<16;h++){const d=4+Math.random()*14;at(s,[2.5+Math.random()*2,d,2.5],Dt(4868714),[28+h%4*4,d/2,-8-Math.floor(h/4)*5],[0,0,0],!1),at(s,[2.5+Math.random()*2,d,2.5],Dt(4868714),[-30-h%4*4,d/2,-8-Math.floor(h/4)*5],[0,0,0],!1)}for(const[h,d]of[[-12,-6],[-15,-3],[13,-7],[16,-4],[-8,-12],[9,-13]])P1(s,[h,0,d],6+Math.random()*2);const r=new kt;for(const h of[-1,1])for(const d of[-1,1])at(r,[.15,3,.15],14540253,[h,1.5,d]);at(r,[2.6,.2,2.6],15921906,[0,3.1,0]),at(r,[2.4,1.6,2.4],14034984,[0,4,0]),at(r,[2.8,.2,2.8],16777215,[0,4.9,0]),r.position.set(-5,0,-14),s.add(r);for(const[h,d,u]of[[7,-9,16731501],[11,-11,3835647],[-10,-10,16766474]]){at(s,[.08,2.4,.08],15658734,[h,1.2,d]);const f=new je(new Zt(1.6,.6,12),Dt(u));f.position.set(h,2.5,d),f.castShadow=!0,s.add(f)}const a=[];for(let h=0;h<24;h++)a.push([-16+h*1.4+h%2*.3,0,-7-h%3*1.3]);const o=Qs(s,a,[16731501,3835647,16766474,448160,16053492,8599788]),c=t.getAttribute("position"),l=Float32Array.from(c.array);return{group:s,update:h=>{o(h);for(let d=0;d<c.count;d++){const u=l[d*3],f=l[d*3+1];c.setZ(d,Math.sin(u*.2+h*1.2)*.25+Math.cos(f*.3+h)*.2)}c.needsUpdate=!0},lighting:{background:16751194,fog:[14256746,40,140],hemiSky:16762266,hemiGround:6965866,hemiIntensity:1.2,key:16756848,keyIntensity:3,keyPos:[-10,8,6],rim:16735912,rimIntensity:1.2}}}function N1(){const s=new kt;ha(s,658464,657930,1710650);const e=Hn(256,256,(c,l,h)=>{c.fillStyle="#6b6258",c.fillRect(0,0,l,h);for(let d=0;d<180;d++)c.fillStyle=`rgba(${150+Math.random()*40},${140+Math.random()*30},${120+Math.random()*30},0.9)`,c.beginPath(),c.ellipse(Math.random()*l,Math.random()*h,8+Math.random()*6,6+Math.random()*4,Math.random()*3,0,Math.PI*2),c.fill()},[16,10]);js(s,e);const t=[15087942,16219904,16766474,5613104,10309341,16748459];for(let c=0;c<9;c++){const l=-16+c*4,h=-7-c%2*.6;at(s,[3.4,1,1.6],7031342,[l,.5,h]),at(s,[.1,3.2,.1],3811866,[l-1.6,1.6,h+.7]),at(s,[.1,3.2,.1],3811866,[l+1.6,1.6,h+.7]);const d=at(s,[3.8,.08,2.2],Dt(c%2?14034984:16053492),[l,3.1,h+.3],[.25,0,0]);d.castShadow=!1;for(let u=0;u<14;u++){const f=new je(new Re(.13,8,6),Dt(t[(c+u)%t.length]));f.position.set(l-1.4+u%7*.45,1.1+Math.floor(u/7)*.18,h-.3+Math.floor(u/7)*.35),s.add(f)}}at(s,[60,8,1],9075300,[0,4,-12]);const n=[..._h(s,[-18,5,-5],[0,5,-5],22,[16769162,16752474,16773568]),..._h(s,[0,5,-5],[18,5,-5],22,[16769162,16752474,16773568])],i=new Gc(16756832,30,18,1.6);i.position.set(-6,4.5,-3);const r=new Gc(16756832,30,18,1.6);r.position.set(6,4.5,-3),s.add(i,r);const a=[];for(let c=0;c<30;c++)a.push([-17+c*1.2,0,-9.3+c%2*.5]);const o=Qs(s,a,[2961206,6966419,1671876,9095462,16734558,16763450]);return{group:s,update:c=>{o(c),n.forEach((l,h)=>l.material.color.setHSL(.1,1,.55+.15*Math.sin(c*3+h)))},lighting:{background:658464,fog:[921114,18,55],hemiSky:5925536,hemiGround:2759184,hemiIntensity:.8,key:16766112,keyIntensity:2.2,keyPos:[5,10,8],rim:8031487,rimIntensity:1.5}}}function F1(){const s=new kt;ha(s,329231,329231,1905984);const e=Hn(512,512,(p,m,M)=>{p.fillStyle="#50535a",p.fillRect(0,0,m,M),Ui(p,m,M,8e3,.12),p.strokeStyle="rgba(255,215,0,0.9)",p.lineWidth=10,p.beginPath(),p.arc(m/2,M/2,180,0,Math.PI*2),p.stroke(),p.fillStyle="rgba(255,255,255,0.85)",p.font="bold 220px Arial",p.textAlign="center",p.textBaseline="middle",p.fillText("H",m/2,M/2+10)}),t=new je(new on(26,18),new ri({map:e,roughness:.9}));t.rotation.x=-Math.PI/2,t.position.set(0,0,-2),t.receiveShadow=!0,s.add(t);for(let p=0;p<27;p++)at(s,[.06,1.1,.06],10066329,[-13+p,.55,-11]);at(s,[26,.06,.06],12303291,[0,1.1,-11]);const n=R1(8,40,"#ffe7a8","#1b2340","#2b3450"),i=new ri({map:n,emissive:16777215,emissiveMap:n,emissiveIntensity:.6,roughness:.4}),r=new je(new Ue(4,4,40,32),i);r.position.set(-16,-8,-30);const a=new je(new Ue(4.6,4.6,36,3),i);a.position.set(16,-10,-26);const o=new je(new Te(7,34,7),i);o.position.set(2,-12,-44),s.add(r,a,o);const c=1500,l=new Bt,h=new Float32Array(c*3),d=new Float32Array(c*3),u=new qe;for(let p=0;p<c;p++)h[p*3]=(Math.random()-.5)*220,h[p*3+1]=-28-Math.random()*3,h[p*3+2]=-20-Math.random()*120,u.setHSL(.08+Math.random()*.1,.9,.5+Math.random()*.3),d.set([u.r,u.g,u.b],p*3);l.setAttribute("position",new gn(h,3)),l.setAttribute("color",new gn(d,3)),s.add(new Cc(l,new jo({size:.5,vertexColors:!0,fog:!1})));const f=new Bt,g=new Float32Array(600*3);for(let p=0;p<600;p++){const m=Math.random()*Math.PI*2,M=Math.random()*Math.PI*.45;g.set([Math.cos(m)*Math.sin(M)*110,Math.cos(M)*110,Math.sin(m)*Math.sin(M)*110-20],p*3)}f.setAttribute("position",new gn(g,3)),s.add(new Cc(f,new jo({size:.35,color:16777215,fog:!1}))),at(s,[2,1.2,1.4],9080729,[-10,.6,-8]),at(s,[2,1.2,1.4],9080729,[10,.6,-8.5]),at(s,[.15,6,.15],7829367,[7,3,-9.5]);const S=new je(new Re(.15,8,6),gt(16720452,1));return S.position.set(7,6.1,-9.5),s.add(S),{group:s,update:p=>{S.visible=Math.sin(p*4)>0},lighting:{background:329231,fog:[723742,40,160],hemiSky:6320320,hemiGround:2103344,hemiIntensity:.9,key:13161727,keyIntensity:2.4,keyPos:[6,12,9],rim:16732067,rimIntensity:2}}}function yh(s){s.group.traverse(e=>{const t=e;t.geometry&&t.geometry.dispose();const n=t.material;Array.isArray(n)?n.forEach(i=>i.dispose()):n&&(n.map?.dispose(),n.dispose())})}const Os=Math.PI/2-.32,O1=new Set(["cast","grab","charge","whip","beam","counterStance","place","uppercut","summon","stomp","flurry","slamRise"]);class ro{rig;anim=new Iu;aura;shield;stars;prop=null;propStyle=null;whip;yaw=0;auraTimer=0;constructor(e){this.rig=Pu(e),this.aura=new je(new Zs(.5,1.1,6,16),gt(16777215,.18)),this.aura.position.y=.95,this.aura.visible=!1,this.rig.root.add(this.aura),this.shield=new je(new Re(1.05,24,16),gt(10474495,.22)),this.shield.position.y=.95,this.shield.visible=!1,this.rig.root.add(this.shield),this.stars=new kt;for(let t=0;t<3;t++){const n=na("star",16766474);n.scale.setScalar(.35),this.stars.add(n)}this.stars.visible=!1,this.rig.root.add(this.stars),this.whip=new je(new Ue(.018,.018,1,6),new vn({color:3811866})),this.whip.visible=!1,this.rig.root.add(this.whip),this.yaw=Os}setProp(e,t){this.propStyle!==e&&(this.prop&&(this.rig.rHand.remove(this.prop),this.prop=null),this.propStyle=e,e&&(this.prop=na(e,t),this.prop.scale.setScalar(.7),this.prop.position.set(0,-.12,.05),this.prop.rotation.set(Math.PI/2,0,Math.PI/2),this.rig.rHand.add(this.prop)))}sync(e,t,n,i){const r=this.rig.root;this.anim.update(e,t,n),this.anim.apply(this.rig),r.visible=!this.anim.hidden;let a=e.x;e.flash>0&&t.hitstop>0&&(a+=(Math.random()-.5)*.08),r.position.set(a,e.y,e.z);const o=e.facing>0?Os:-Os,c=e.state==="air"||e.state==="juggle"?.25:.5;this.yaw+=(o-this.yaw)*Math.min(1,c*n*60),r.rotation.y=this.yaw;const l=e.flash>0?Math.min(1,e.flash/5)*.7:0,h=e.buffs.find(p=>p.kind!=="shield"&&p.kind!=="reflect"&&p.kind!=="slow"),d=t.ticks/60;for(const p of this.rig.materials)l>0?p.emissive.setRGB(l*.5,l*.42,l*.34):h?p.emissive.setHex(h.color).multiplyScalar(.18+.1*Math.sin(d*8)):e.lifelineUsed&&e.health<=1?p.emissive.setRGB(.3+.2*Math.sin(d*10),0,0):p.emissive.setRGB(0,0,0);this.aura.visible=!1;const u=h?.color??(e.state==="attack"&&e.move?.kind==="super"?e.move.color??16765440:e.meter>=100?16765440:null);if(u!==null&&i){this.auraTimer+=n*60;const p=h||e.move?.kind==="super"?2:6;for(;this.auraTimer>=p;)this.auraTimer-=p,i.burst(e.x+(Math.random()-.5)*.7,e.y+.1+Math.random()*1.2,(Math.random()-.5)*.4,u,1,.01,.035,-.0015,34)}const f=e.buff("shield")??e.buff("reflect");this.shield.visible=!!f,f&&(this.shield.material.color.setHex(f.color),this.shield.material.opacity=.15+.08*Math.sin(d*6)),this.stars.visible=e.state==="dizzy",this.stars.visible&&this.stars.children.forEach((m,M)=>{const T=d*4+M*Math.PI*2/3;m.position.set(Math.cos(T)*.35,1.95,Math.sin(T)*.35),m.rotation.y=T});const g=e.move;if(e.state==="cinematic"&&t.cinematic?.att===e&&t.cinematic?.prop?this.setProp(t.cinematic.prop,t.cinematic.color):e.state==="attack"&&g?.prop&&O1.has(g.anim)&&g.tag!=="projectile"&&g.tag!=="rain"?this.setProp(g.prop,g.color??16777215):this.setProp(null,0),this.whip.visible=!1,e.state==="attack"&&g?.tag==="pull"){const p=e.moveFrame;p>g.startup-2&&p<=g.startup+g.active+4&&(this.whip.visible=!0,this.whip.scale.set(1,3,1),this.whip.position.set(0,1.25,3/2+.4),this.whip.rotation.set(Math.PI/2,0,0),this.whip.material.color.setHex(g.color??3811866))}}dispose(){Ru(this.rig)}}class B1{obj;glow=null;beam=null;core=null;constructor(e){if(this.obj=new kt,e.kind==="beam"||e.kind==="mega"&&e.attach){const t=e.h/2;if(this.beam=new je(new Ue(t,t,1,20,1,!0),gt(e.color,.55)),this.beam.rotation.z=Math.PI/2,this.core=new je(new Ue(t*.45,t*.45,1,12,1,!0),gt(16777215,.9)),this.core.rotation.z=Math.PI/2,this.obj.add(this.beam,this.core),e.prop&&e.prop!=="wave"&&e.prop!=="sound"){const n=na(e.prop,e.color);n.scale.setScalar(1.2),n.userData.src=!0,this.obj.add(n)}}else{const t=na(e.prop,e.color);t.scale.setScalar(e.scale*(e.kind==="wave"||e.kind==="trap"?1.3:1.2)),t.userData.spin=!0,this.obj.add(t),this.glow=new je(new Re(.32*e.scale,14,10),gt(e.color,.25)),this.obj.add(this.glow)}}sync(e,t){this.obj.position.set(e.x,e.y,.05);const n=e.attach?e.facing:Math.sign(e.vx)||e.facing;if(this.beam&&this.core){const r=e.w,a=1+.12*Math.sin(t*40);this.beam.scale.set(a,r,a),this.core.scale.set(1,r,1),this.obj.children.forEach(o=>{o.userData.src&&o.position.set(-n*(r/2-.1),0,0)});return}this.obj.visible=e.age>=e.delay||Math.floor(e.age/4)%2===0;const i=this.obj.children[0];if(i.scale.x=Math.abs(i.scale.x)*(n<0?-1:1),e.kind==="normal"||e.kind==="rain"||e.kind==="mega"?(i.rotation.z=e.prop==="plane"||e.prop==="jet"||e.prop==="train"||e.prop==="tank"||e.prop==="fire"||e.prop==="syringe"||e.prop==="envelope"?0:-n*e.age*e.spin,(e.prop==="coin"||e.prop==="shekel")&&(i.rotation.y=e.age*.3)):e.kind==="trap"&&(i.position.y=-.25+Math.sin(t*3)*.03),this.glow){const r=1+.15*Math.sin(t*20);this.glow.scale.setScalar(r)}}}class H1{renderer;scene=new eu;camera=new cn(38,16/9,.1,400);effects=new C1;hemi=new gu(16777215,4473924,1);key=new ta(16777215,2.5);rim=new ta(8956671,1.2);stage=null;stageId="";views=[];projViews=new Map;showcase=[];camPos=new I(0,1.8,8);camLook=new I(0,1.1,0);shake=0;superFocus=null;time=0;showHitboxes=!1;hitboxGroup=new kt;platform;constructor(e){this.renderer=new Au({canvas:e,antialias:!0,powerPreference:"high-performance"}),this.renderer.setPixelRatio(Math.min(2,window.devicePixelRatio||1)),this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=Ds,this.renderer.toneMapping=sa,this.renderer.toneMappingExposure=1,this.renderer.outputColorSpace=jt,this.key.castShadow=!0,this.key.shadow.mapSize.set(2048,2048);const t=this.key.shadow.camera;t.left=-14,t.right=14,t.top=10,t.bottom=-6,t.near=1,t.far=60,this.key.shadow.bias=-5e-4,this.key.shadow.normalBias=.02,this.scene.add(this.hemi,this.key,this.key.target,this.rim,this.effects.group,this.hitboxGroup),this.platform=new je(new Ue(1.6,1.8,.2,40),new ri({color:1778496,metalness:.4,roughness:.4})),this.platform.visible=!1,this.scene.add(this.platform),this.resize()}setQuality(e){const t=e==="low";this.renderer.setPixelRatio(t?1:Math.min(2,window.devicePixelRatio||1)),this.renderer.shadowMap.enabled=!t,this.key.castShadow=!t,this.scene.traverse(n=>{const i=n.material;i&&(i.needsUpdate=!0)}),this.resize()}resize(){const e=this.renderer.domElement,t=e.clientWidth||window.innerWidth,n=e.clientHeight||window.innerHeight;this.renderer.setSize(t,n,!1),this.camera.aspect=t/n,this.camera.updateProjectionMatrix()}setStage(e){if(this.stageId===e.id&&this.stage)return;this.stage&&(this.scene.remove(this.stage.group),yh(this.stage)),this.stage=L1(e),this.stageId=e.id,this.scene.add(this.stage.group);const t=this.stage.lighting;this.scene.background=new qe(t.background),this.scene.fog=new yl(t.fog[0],t.fog[1],t.fog[2]),this.hemi.color.setHex(t.hemiSky),this.hemi.groundColor.setHex(t.hemiGround),this.hemi.intensity=t.hemiIntensity,this.key.color.setHex(t.key),this.key.intensity=t.keyIntensity,this.key.position.set(...t.keyPos),this.rim.color.setHex(t.rim),this.rim.intensity=t.rimIntensity,this.rim.position.set(-4,6,-10)}clearStage(){this.stage&&(this.scene.remove(this.stage.group),yh(this.stage),this.stage=null,this.stageId=""),this.scene.background=new qe(329485),this.scene.fog=null,this.hemi.color.setHex(14542591),this.hemi.groundColor.setHex(2236979),this.hemi.intensity=1.2,this.key.color.setHex(16777215),this.key.intensity=2.8,this.key.position.set(3,8,8),this.rim.color.setHex(7310335),this.rim.intensity=2.2,this.rim.position.set(-4,5,-6)}setFighters(e){for(const t of this.views)this.scene.remove(t.rig.root),t.dispose();this.views=e.map(t=>{const n=new ro(t);return this.scene.add(n.rig.root),n});for(const t of this.projViews.values())this.scene.remove(t.obj);this.projViews.clear(),this.effects.clear(),this.superFocus=null}clearFighters(){this.setFighters([])}handleEvent(e,t){const n=this.effects;switch(e.t){case"hit":n.hitSpark(e.x,e.y,.35,e.spark,e.blocked,e.color),!e.blocked&&(e.spark==="heavy"||e.spark==="super"||e.counter)&&(this.shake=Math.max(this.shake,e.spark==="super"?.18:.08));break;case"superFlash":{const i=t.fighters[e.fighter];this.superFocus={fighter:e.fighter,frames:48},n.ring(i.x,1.1,.4,e.color,.3,3.5,30),n.burst(i.x,1.2,.3,e.color,50,.14,.07,.001,40);break}case"special":{const i=t.fighters[e.fighter];n.burst(i.x,1,.3,e.color,10,.05,.04,.001,18);break}case"teleport":n.burst(e.fromX,1,.2,e.color,30,.09,.06,0,26),n.burst(e.toX,1,.2,e.color,30,.09,.06,0,26),n.ring(e.toX,1,.3,e.color,.2,1.6,16);break;case"buff":{const i=t.fighters[e.fighter];n.ring(i.x,.05,0,e.color,.3,2.2,24,!0),n.burst(i.x,.8,.2,e.color,26,.07,.05,-.002,36);break}case"clash":n.burst(e.x,e.y,.2,16777215,24,.1,.05,.002,20),n.ring(e.x,e.y,.3,16777215,.2,1.2,14);break;case"tech":n.ring(e.x,e.y,.3,16777215,.2,1.4,14),n.burst(e.x,e.y,.2,11195647,20,.09,.05,.001,16);break;case"lifeline":{const i=t.fighters[e.fighter];n.flash(i.x,1,.2,16765440,2.5,20),n.burst(i.x,1,.2,16765440,60,.15,.07,.002,40),this.shake=.2;break}case"land":if(e.hard){const i=t.fighters[e.fighter];n.burst(i.x,.1,.1,12101768,16,.05,.06,.002,26)}break;case"shake":this.shake=Math.max(this.shake,e.amount);break;case"ko":{if(e.loser>=0){const i=t.fighters[e.loser];n.flash(i.x,1,.2,16777215,3,16)}break}}}syncFight(e,t){this.time+=t,this.platform.visible=!1,this.views.forEach((i,r)=>i.sync(e.fighters[r],e,t,this.effects));const n=new Set;for(const i of e.projectiles){n.add(i.id);let r=this.projViews.get(i.id);r||(r=new B1(i),this.projViews.set(i.id,r),this.scene.add(r.obj)),r.sync(i,this.time)}for(const[i,r]of this.projViews)if(!n.has(i)){const a=r.obj.position;this.effects.burst(a.x,a.y,a.z,16777215,8,.05,.035,.002,14),this.scene.remove(r.obj),this.projViews.delete(i)}this.stage?.update(this.time),this.effects.update(t),this.updateFightCamera(e,t),this.drawHitboxes(e)}updateFightCamera(e,t){const[n,i]=e.fighters,r=1-Math.exp(-t*6),a=new I,o=new I,c=(n.x+i.x)/2,l=Math.abs(n.x-i.x),h=Math.max(n.y,i.y);if(e.freeze>0&&this.superFocus){const d=e.fighters[this.superFocus.fighter];a.set(d.x-d.facing*.5,1.45,2.7),o.set(d.x+d.facing*.25,1.35,0),this.lerpCam(a,o,1-Math.exp(-t*12))}else if(e.cinematic){const d=e.cinematic,u=(d.att.x+d.def.x)/2,f=d.frame*.02-.6;a.set(u+Math.sin(f)*4.2,1.5+Math.sin(d.frame*.05)*.3,Math.cos(f)*4.2),o.set(u,1.1,0),this.lerpCam(a,o,1-Math.exp(-t*5))}else if(e.phase==="intro"){const d=e.phaseFrame<100,u=d?n:i;a.set(u.x-u.facing*-1.2+(d?1.2:-1.2),1.6,3.4),o.set(u.x,1.3,0),this.lerpCam(a,o,1-Math.exp(-t*3))}else if(e.phase==="ko"&&e.phaseFrame<100&&e.roundWinner!==null){const d=e.fighters.find(u=>u.koed)??n;a.set(c+(d.x-c)*.5,1.5,5.2),o.set(d.x*.6+c*.4,.9,0),this.lerpCam(a,o,1-Math.exp(-t*2.5))}else if(e.phase==="matchEnd"&&e.matchWinner!==null&&e.matchWinner>=0){const d=e.fighters[e.matchWinner],u=Math.sin(this.time*.3)*.3;a.set(d.x+Math.sin(u)*3.6,1.55,Math.cos(u)*3.6),o.set(d.x,1.2,0),this.lerpCam(a,o,1-Math.exp(-t*2))}else{const d=Math.max(5.8,Math.min(10,5+l*.62)),u=10.5-d*.45,f=Math.max(-u,Math.min(u,c));a.set(f,1.75+h*.35,d),o.set(f,1.12+h*.3,0),this.lerpCam(a,o,r)}this.superFocus&&(this.superFocus.frames--,this.superFocus.frames<=0&&e.freeze<=0&&(this.superFocus=null)),this.applyCamera(t)}lerpCam(e,t,n){this.camPos.lerp(e,n),this.camLook.lerp(t,n)}applyCamera(e){this.camera.position.copy(this.camPos),this.shake>.001&&(this.camera.position.x+=(Math.random()-.5)*this.shake,this.camera.position.y+=(Math.random()-.5)*this.shake,this.shake*=Math.pow(.86,e*60)),this.camera.lookAt(this.camLook)}drawHitboxes(e){if(this.hitboxGroup.visible=this.showHitboxes,!this.showHitboxes)return;for(;this.hitboxGroup.children.length;)this.hitboxGroup.children.pop().geometry.dispose();const t=(n,i,r,a,o)=>{const c=new je(new on(r,a),new vn({color:o,transparent:!0,opacity:.35,depthTest:!1}));c.position.set(n,i,.8),c.renderOrder=999,this.hitboxGroup.add(c)};for(const n of e.fighters){for(const r of n.hurtboxes())t(r.x,r.y,r.w,r.h,3407718);const i=n.activeHitbox();i&&t(i.x,i.y,i.w,i.h,16720452)}for(const n of e.projectiles)n.active&&t(n.x,n.y,n.w,n.h,16750882)}setShowcase(e,t=!0){for(const n of this.showcase)n&&(this.scene.remove(n.view.rig.root),n.view.dispose());this.showcase=e.map(n=>{const i=new ro(n.def);return i.rig.root.position.set(n.x,0,0),this.scene.add(i.rig.root),{view:i,slot:n}}),this.platform.visible=t&&e.length>0,this.views.forEach(n=>n.rig.root.visible=!1)}updateShowcaseSlot(e,t){const n=this.showcase[e];if(n&&t&&n.slot.def.id===t.def.id){n.slot=t;return}if(n&&(this.scene.remove(n.view.rig.root),n.view.dispose()),!t){this.showcase[e]=void 0;return}const i=new ro(t.def);this.scene.add(i.rig.root),this.showcase[e]={view:i,slot:t}}syncShowcase(e,t){this.time+=e;const n=this.showcaseCount;this.showcase.forEach((r,a)=>{if(!r)return;const{view:o,slot:c}=r;o.anim.showcase(e,this.time,c.pose,c.variant??0,a*1.7),o.anim.apply(o.rig);const l=o.rig.root;l.visible=!0,l.position.set(c.x,this.platform.visible&&n===1?.1:0,0),l.rotation.y=c.facing>0?Os-.5:-Os+.5;for(const h of o.rig.materials)h.emissive.setRGB(0,0,0);o.aura.visible=!1,o.shield.visible=!1,o.stars.visible=!1}),this.stage?.update(this.time),this.effects.update(e);const i=1-Math.exp(-e*4);this.lerpCam(new I(...t.pos),new I(...t.look),i),this.applyCamera(e)}get showcaseCount(){return this.showcase.filter(Boolean).length}get currentStage(){return this.stageId}clearShowcase(){this.setShowcase([],!1)}snapCamera(e,t){this.camPos.set(...e),this.camLook.set(...t)}render(){this.renderer.render(this.scene,this.camera)}}class z1{canvas;ui;renderer;input=new sd;audio=new Qu;settings=cd();screen=null;arcade=null;lastSetup=null;desktop=window.skfDesktop??null;quality="high";acc=0;last=0;fps=0;constructor(){this.canvas=document.getElementById("game"),this.ui=document.getElementById("ui"),this.renderer=new H1(this.canvas),this.applySettings(),window.addEventListener("resize",()=>this.renderer.resize());const e=()=>this.audio.unlock();window.addEventListener("keydown",e),window.addEventListener("pointerdown",e),window.addEventListener("keydown",t=>{t.code==="F11"&&!this.desktop&&(t.preventDefault(),this.toggleFullscreen())})}applySettings(){const e=this.settings;this.audio.volumes={master:e.masterVolume,music:e.musicVolume,sfx:e.sfxVolume},this.audio.announcer=e.announcer,this.audio.applyVolumes(),this.input.rumbleEnabled=e.rumble,this.renderer.showHitboxes=e.showHitboxes,this.quality!==e.quality&&(this.quality=e.quality,this.renderer.setQuality(e.quality)),hd(e)}toggleFullscreen(){if(this.desktop){this.desktop.toggleFullscreen();return}document.fullscreenElement?document.exitFullscreen().catch(()=>{}):document.documentElement.requestFullscreen().catch(()=>{})}go(e){this.screen?.exit(),this.ui.innerHTML="",this.screen=e,e.enter()}start(){const e=t=>{const n=this.last?Math.min(.1,(t-this.last)/1e3):1/ga;this.last=t,this.fps=this.fps*.95+1/Math.max(n,.001)*.05,this.acc+=n;let i=0;for(;this.acc>=1/ga&&i<5;)this.input.poll(),this.input.anyPressed()&&this.audio.unlock(),this.screen?.tick(),this.acc-=1/ga,i++;i===5&&(this.acc=0),this.screen?.frame(n),this.renderer.render(),requestAnimationFrame(e)};requestAnimationFrame(e)}glyphStyle(e){const t=this.input.padInfo(e);return!t||this.input.lastDevice[e]!=="pad"?"kb":t.kind==="xbox"?"xbox":"ps"}menuStyle(){const e=this.input.connectedPads();if(!e.length||this.input.lastDevice[0]!=="pad"&&this.input.lastDevice[1]!=="pad")return"kb";const t=this.input.lastDevice[0]==="pad"?0:1;return(this.input.padInfo(t)??e[0]).kind==="xbox"?"xbox":"ps"}glyph(e,t=0,n){const i=n??this.glyphStyle(t);return`<span class="g ${ld(e,i)}">${od(e,i,t)}</span>`}mg(e){const t=this.menuStyle();if(t==="ps"){const i={confirm:["g-cross","✕"],back:["g-circle","○"],extra:["g-triangle","△"],extra2:["g-square","□"],start:["g-shoulder","OPTIONS"]}[e];return`<span class="g ${i[0]}">${i[1]}</span>`}return t==="xbox"?`<span class="g g-key">${{confirm:"A",back:"B",extra:"Y",extra2:"X",start:"MENU"}[e]}</span>`:`<span class="g g-key">${{confirm:"Enter",back:"Esc",extra:"I",extra2:"O",start:"Esc"}[e]}</span>`}}const st={light:15845285,fair:15251604,medium:14262908,warm:14921868,olive:13012579,deep:7029808},Pt={black:1709330,dark:2827296,brown:4862498,light:11569754,grey:10132122,silver:13158600,salt:7236198},fe={navy:1780298,charcoal:2961206,black:1118742,slate:3820126,steel:2240831,white:16053492,paleBlue:14674421},Ft=[{id:"netanyahu",name:"Benjamin Netanyahu",nameHe:"בנימין נתניהו",nick:"Bibi",party:"likud",role:"Prime Minister",bio:"Israel's longest-serving Prime Minister. Has survived more no-confidence motions than anyone can count.",style:"technician",stats:{health:1.05,speed:.96},look:{skin:st.fair,height:1.03,build:1.14,hair:"side",hairColor:13619151,outfit:"suit",jacket:fe.navy,shirt:fe.white,tie:2776496,pants:fe.navy},specials:[{type:"projectile",name:"Red Line Bomb",prop:"bomb",color:16726843,arc:!0,damage:95,desc:"Lobs a cartoon bomb with a red line drawn on it."},{type:"teleport",name:"Coalition Shuffle",color:5219327,mode:"behind",attack:!0,desc:"Swaps partners, and sides. Reappears behind you with a strike."},{type:"shield",name:"Iron Dome",color:10474495,hits:3,desc:"Intercepts the next three incoming attacks."}],ultimate:{type:"cinematic",name:"Sixth Term",color:2780159,prop:"ballot",damage:390},passive:{id:"lifeline",name:"Political Survivor",desc:"Once per match, survives a knockout blow with 1 HP."},quotes:{intro:"I've been here before. I'll be here after.",win:"They said it was over. It's never over."}},{id:"levin",name:"Yariv Levin",nameHe:"יריב לוין",party:"likud",role:"Deputy PM & Justice Minister",bio:"Architect of the judicial overhaul. Treats every court ruling as a personal challenge.",style:"zoner",stats:{health:1},look:{skin:st.fair,height:.98,build:1.14,hair:"receding",hairColor:Pt.dark,outfit:"suit",jacket:fe.charcoal,shirt:fe.white,tie:8003371,pants:fe.charcoal},specials:[{type:"projectile",name:"Judicial Gavel",prop:"gavel",color:12618302,damage:85},{type:"counter",name:"Reasonableness Clause",color:16765286,damage:150,desc:"Declares the attack unreasonable and strikes back."},{type:"grab",name:"Committee Selection",color:9067775,damage:180,desc:"Appoints you to a very uncomfortable committee."}],ultimate:{type:"megarain",name:"The Overhaul",color:12618302,prop:"gavel"},passive:{id:"chipMaster",name:"Override Clause",desc:"Blocking him still hurts: triple chip damage."},quotes:{intro:"Objection overruled. By me.",win:"The court has been... reformed."}},{id:"israel-katz",name:"Israel Katz",nameHe:'ישראל כ"ץ',party:"likud",role:"Defense Minister",bio:"Former Transport Minister who built roads, rails and interchanges. Now runs defense like a construction project.",style:"brawler",stats:{health:1.1,speed:.9,power:1.05,weight:1.2},look:{skin:st.warm,height:1.02,build:1.32,hair:"horseshoe",hairColor:Pt.silver,outfit:"suit",jacket:2831430,shirt:fe.white,tie:2052e3,pants:2831430},specials:[{type:"wave",name:"Light Rail Line",prop:"train",color:14034984,damage:80,desc:"Sends a light-rail car along the floor. Block low!"},{type:"rush",name:"Express Train",color:16758531,hits:3,damage:130,armor:!0,prop:"train",desc:"Armored charge like an express train."},{type:"rising",name:"Interchange Uppercut",color:16766474,hits:2,damage:125}],ultimate:{type:"megaprojectile",name:"National Infrastructure Plan",color:16739125,prop:"train"},passive:{id:"heavyArmor",name:"Heavyweight",desc:"Heavy attacks absorb one hit during startup."},quotes:{intro:"Clear the tracks.",win:"Another project completed ahead of schedule."}},{id:"ohana",name:"Amir Ohana",nameHe:"אמיר אוחנה",party:"likud",role:"Speaker of the Knesset",bio:"Runs the plenum with an iron gavel. Order in the house is non-negotiable.",style:"technician",stats:{speed:1.05},look:{skin:st.medium,height:1,build:.95,hair:"short",hairColor:Pt.black,outfit:"suit",jacket:1842982,shirt:fe.white,tie:3160658,pants:1842982},specials:[{type:"projectile",name:"Order! Order!",prop:"sound",color:16044894,damage:50,effect:{stun:40},desc:"A booming call to order that stuns."},{type:"grab",name:"Removal From the Plenum",color:15087942,damage:160,range:1.4,desc:"Has you escorted out of the chamber. Forcefully."},{type:"rising",name:"Session Adjourned",color:16044894,damage:120}],ultimate:{type:"megarain",name:"Emergency Session",color:4553629,prop:"chair"},passive:{id:"meterBoost",name:"Speaker's Privilege",desc:"Builds Ultimate meter 30% faster."},quotes:{intro:"The member is out of order.",win:"This session is adjourned."}},{id:"regev",name:"Miri Regev",nameHe:"מירי רגב",party:"likud",role:"Transport Minister",bio:"Former IDF spokesperson and Culture Minister. Now controls every road, runway and traffic light.",style:"rushdown",stats:{speed:1.02},look:{skin:st.medium,height:.94,build:.92,hair:"bob",hairColor:Pt.black,outfit:"blazer",jacket:12653087,shirt:1118481,tie:null,pants:1118481,female:!0},specials:[{type:"trap",name:"Traffic Jam",prop:"cone",color:16743168,damage:40,effect:{slow:180},desc:"Drops a traffic cone. Step on it and you're stuck in traffic."},{type:"rush",name:"Highway Rush",color:16759304,hits:2,damage:115,distance:4},{type:"spin",name:"Red Carpet Spin",color:13631488,hits:4,damage:105}],ultimate:{type:"cinematic",name:"Grand Opening Ceremony",color:16764928,prop:"scissors"},passive:{id:"rage",name:"Culture War",desc:"Deals 25% more damage below 30% health."},quotes:{intro:"This road is closed. For you.",win:"Cut the ribbon!"}},{id:"amsalem",name:"David Amsalem",nameHe:"דוד אמסלם",nick:"Dudi",party:"likud",role:"Minister & Likud MK",bio:"Famous for plenum speeches you can hear from Tel Aviv. Volume: maximum.",style:"brawler",stats:{power:1.08,speed:.95,weight:1.15},look:{skin:st.medium,height:1,build:1.22,hair:"bald",hairColor:3355443,facialHair:"stubble",facialHairColor:3355443,outfit:"open-suit",jacket:fe.charcoal,shirt:15395562,tie:null,pants:fe.charcoal},specials:[{type:"beam",name:"Sonic Rant",prop:"sound",color:16765286,length:3.6,damage:120,hits:5,desc:"A point-blank blast of pure volume."},{type:"wave",name:"Plenum Stomp",color:15167313,damage:80},{type:"rising",name:"Table Flip",prop:"chair",color:10506797,damage:130}],ultimate:{type:"megabeam",name:"Ultimate Shouting Match",color:16711790,prop:"sound"},passive:{id:"ironWill",name:"Thick Skull",desc:"Shrugs off hits: 15% shorter hitstun."},quotes:{intro:"Sit down! I have the floor!",win:"Did everyone hear that? Good."}},{id:"barkat",name:"Nir Barkat",nameHe:"ניר ברקת",party:"likud",role:"Economy Minister",bio:"Tech millionaire and former Mayor of Jerusalem. Treats every fight like a startup exit.",style:"balanced",stats:{speed:1.05,jump:1.08},look:{skin:st.light,height:1.07,build:.95,hair:"receding",hairColor:10129286,outfit:"suit",jacket:fe.slate,shirt:fe.paleBlue,tie:1914199,pants:fe.slate},specials:[{type:"projectile",name:"Startup Pitch",prop:"laptop",color:5032432,damage:80},{type:"dive",name:"Angel Investor Dive",color:5032432,damage:95},{type:"rising",name:"Market Rally",prop:"coin",color:5420936,damage:120,hits:3}],ultimate:{type:"megaprojectile",name:"Unicorn Valuation",color:16766474,prop:"coin"},passive:{id:"deepPockets",name:"Deep Pockets",desc:"Starts every round with half a meter."},quotes:{intro:"Let's disrupt this.",win:"Exit achieved. Acquired for a billion."}},{id:"gotliv",name:"Tally Gotliv",nameHe:"טלי גוטליב",party:"likud",role:"Likud MK",bio:"Criminal lawyer turned firebrand MK. Objects to everything, loudly.",style:"rushdown",stats:{},look:{skin:st.fair,height:.96,build:.9,hair:"wavy",hairColor:Pt.brown,outfit:"blazer",jacket:fe.black,shirt:fe.white,tie:null,pants:fe.black,female:!0},specials:[{type:"projectile",name:"Legal Brief",prop:"paper",color:15858414,count:3,damage:36},{type:"barrage",name:"Cross-Examination",color:15087942,hits:7,damage:120},{type:"counter",name:"Objection!",color:16758531,damage:140}],ultimate:{type:"cinematic",name:"Closing Argument",color:15087942,prop:"book"},passive:{id:"counterPunch",name:"Sustained!",desc:"Counter-hits deal 50% extra damage."},quotes:{intro:"Objection! Your Honor, look at this!",win:"No further questions."}},{id:"karhi",name:"Shlomo Karhi",nameHe:"שלמה קרעי",party:"likud",role:"Communications Minister",bio:"Wants to reform the airwaves, the public broadcaster and possibly your phone plan.",style:"zoner",stats:{},look:{skin:st.medium,height:1,build:1,hair:"short",hairColor:Pt.black,facialHair:"short",facialHairColor:Pt.black,headwear:"kippah-knit",headwearColor:2838698,outfit:"open-suit",jacket:fe.navy,shirt:fe.white,tie:null,pants:fe.navy},specials:[{type:"beam",name:"Broadcast Signal",prop:"dish",color:4770532,length:4.5,hits:4,damage:110},{type:"pull",name:"Pull the Plug",prop:"phone",color:9494767,damage:55},{type:"trap",name:"5G Tower",prop:"tower",color:16735631,effect:{stun:45}}],ultimate:{type:"megarain",name:"Media Reform",color:46296,prop:"tv"},passive:{id:"drainer",name:"Frequency Auction",desc:"Every hit drains the opponent's meter."},quotes:{intro:"This channel is now under review.",win:"And we're off the air."}},{id:"may-golan",name:"May Golan",nameHe:"מאי גולן",party:"likud",role:"Minister for Social Equality",bio:"Minister for the Advancement of Women. Advances mostly toward her opponents.",style:"rushdown",stats:{speed:1.03},look:{skin:st.medium,height:.95,build:.9,hair:"long",hairColor:Pt.black,outfit:"blazer",jacket:15921906,shirt:2236962,tie:null,pants:2236962,female:!0},specials:[{type:"projectile",name:"Hot Take",prop:"fire",color:16733184,damage:80,speed:.19},{type:"rush",name:"Spotlight Dash",color:16764928,damage:110,launch:!0},{type:"rising",name:"Headline Kick",color:16711764,damage:120,hits:2}],ultimate:{type:"megarain",name:"Viral Moment",color:16733184,prop:"phone"},passive:{id:"swift",name:"Fast Track",desc:"Moves 18% faster."},quotes:{intro:"You're trending. Not in a good way.",win:"Screenshot that."}},{id:"edelstein",name:"Yuli Edelstein",nameHe:"יולי אדלשטיין",party:"likud",role:"Likud MK, former Speaker",bio:"Former Soviet refusenik, Knesset Speaker and Health Minister who ran the vaccine drive. Unbreakable.",style:"technician",stats:{defense:1.06},look:{skin:st.light,height:.98,build:1.05,hair:"receding",hairColor:13684944,facialHair:"full",facialHairColor:14211288,glasses:"rect",headwear:"kippah-knit",headwearColor:3158064,outfit:"suit",jacket:fe.charcoal,shirt:fe.white,tie:5925772,pants:fe.charcoal},specials:[{type:"projectile",name:"Booster Shot",prop:"syringe",color:8454107,damage:70,speed:.22,effect:{lifesteal:25},desc:"A fast dart that heals him on hit."},{type:"slam",name:"Speaker's Chair Drop",prop:"chair",color:10322313,damage:120},{type:"heal",name:"Green Pass",color:5420936,amount:90}],ultimate:{type:"megarain",name:"Mass Vaccination Drive",color:8454107,prop:"syringe"},passive:{id:"ironWill",name:"Refusenik",desc:"Unbreakable will: 15% shorter hitstun."},quotes:{intro:"I've faced tougher interrogations.",win:"Next patient, please."}},{id:"saar",name:"Gideon Sa'ar",nameHe:"גדעון סער",party:"likud",role:"Foreign Minister",bio:"Left Likud, founded New Hope, merged back into Likud. Always finds his way home.",style:"zoner",stats:{},look:{skin:st.fair,height:1.06,build:.98,hair:"bald",hairColor:Pt.grey,outfit:"suit",jacket:fe.steel,shirt:fe.white,tie:3835647,pants:fe.steel},specials:[{type:"projectile",name:"Diplomatic Cable",prop:"envelope",color:10670847,damage:75,homing:!0},{type:"grab",name:"Party Merger",color:3835647,damage:175,desc:"Absorbs your party. And you."},{type:"teleport",name:"Return Flight",color:12443902,mode:"behind",attack:!0}],ultimate:{type:"cinematic",name:"Summit Meeting",color:3835647,prop:"flag"},passive:{id:"regen",name:"New Hope",desc:"Recovers part of his lost health when not taking damage."},quotes:{intro:"I left. I came back. Now I'm here for you.",win:"Diplomacy by other means."}},{id:"dichter",name:"Avi Dichter",nameHe:"אבי דיכטר",party:"likud",role:"Agriculture Minister",bio:"Former head of the Shin Bet, now in charge of farms. Knows where you are, and what you ate.",style:"technician",stats:{},look:{skin:st.fair,height:1,build:1.02,hair:"bald",hairColor:11184810,outfit:"suit",jacket:3881787,shirt:fe.white,tie:2792847,pants:3881787},specials:[{type:"projectile",name:"Tomato Toss",prop:"tomato",color:15087942,count:2,arc:!0,damage:50},{type:"teleport",name:"Covert Op",color:2829634,mode:"behind",attack:!0},{type:"wave",name:"Harvest Sweep",prop:"leaf",color:8435992,damage:80}],ultimate:{type:"megarain",name:"Agricultural Reform",color:5613104,prop:"watermelon"},passive:{id:"quickRecovery",name:"Shin Bet Training",desc:"Gets up faster, and his backdash is invincible."},quotes:{intro:"We've had a file on you for years.",win:"Harvest season."}},{id:"silman",name:"Idit Silman",nameHe:"עידית סילמן",party:"likud",role:"Environmental Protection Minister",bio:"Brought down a government by crossing the floor. Now she recycles opponents.",style:"balanced",stats:{},look:{skin:st.fair,height:.94,build:.92,hair:"bob",hairColor:3877407,outfit:"skirt",jacket:2976335,shirt:fe.white,tie:null,pants:2976335,female:!0},specials:[{type:"projectile",name:"Recycling Bin",prop:"bin",color:2976335,arc:!0,damage:90},{type:"teleport",name:"Crossing the Floor",color:9819570,mode:"behind",attack:!0},{type:"shield",name:"Green Shield",color:7653021,hits:2}],ultimate:{type:"megarain",name:"Coalition Collapse",color:5420936,prop:"brick"},passive:{id:"projectileProof",name:"Sustainable",desc:"Takes half damage from projectiles."},quotes:{intro:"I've switched sides before.",win:"Reduce. Reuse. Defeat."}},{id:"ofir-katz",name:"Ofir Katz",nameHe:"אופיר כץ",party:"likud",role:"Coalition Whip",bio:"Keeps the coalition in line, one late-night vote at a time.",style:"rushdown",stats:{},look:{skin:st.warm,height:1,build:1.02,hair:"short",hairColor:Pt.dark,facialHair:"stubble",facialHairColor:Pt.dark,outfit:"suit",jacket:fe.navy,shirt:fe.white,tie:2508371,pants:fe.navy},specials:[{type:"pull",name:"The Whip",color:15320170,damage:60,desc:"Cracks the coalition whip and drags you into line."},{type:"rush",name:"Emergency Vote",color:16032353,hits:2,damage:115},{type:"rising",name:"Party Discipline",color:15167313,damage:120}],ultimate:{type:"cinematic",name:"Coalition Lockdown",color:15320170,prop:"ballot"},passive:{id:"comboMaster",name:"Three-Line Whip",desc:"Combos lose less damage to scaling."},quotes:{intro:"Nobody leaves until the vote passes.",win:"Motion carried."}},{id:"kisch",name:"Yoav Kisch",nameHe:"יואב קיש",party:"likud",role:"Education Minister",bio:"Former combat pilot, now Education Minister. Grades on a curve. A ballistic one.",style:"rushdown",stats:{jump:1.1,speed:1.04},look:{skin:st.fair,height:1.03,build:.98,hair:"short",hairColor:3877407,outfit:"suit",jacket:2508371,shirt:fe.white,tie:2792847,pants:2508371},specials:[{type:"projectile",name:"Paper Airplane",prop:"plane",color:15858414,damage:70,speed:.18,homing:!0},{type:"dive",name:"Dive Bomb",color:9358054,damage:95},{type:"rising",name:"Report Card",color:16758531,damage:115,height:1.1}],ultimate:{type:"megarain",name:"Final Exam",color:2203324,prop:"book"},passive:{id:"doubleJump",name:"Top Gun",desc:"Can jump again in mid-air."},quotes:{intro:"Pop quiz. Are you ready?",win:"See me after class."}},{id:"lapid",name:"Yair Lapid",nameHe:"יאיר לפיד",party:"yeshatid",role:"Leader of the Opposition",bio:"Former TV anchor, novelist and Prime Minister. Keeps boxing gloves in the office, just in case.",style:"rushdown",stats:{speed:1.04,power:1.02},look:{skin:st.fair,height:1.04,build:1,hair:"swept",hairColor:12566463,outfit:"open-suit",jacket:fe.black,shirt:1381914,tie:null,pants:fe.black},specials:[{type:"projectile",name:"Breaking News",prop:"mic",color:42747,damage:80},{type:"barrage",name:"Anchorman Combo",color:361162,hits:6,damage:115},{type:"rising",name:"Rotation Agreement",color:42747,hits:3,damage:125}],ultimate:{type:"cinematic",name:"There Is A Future",color:42747,prop:"tv"},passive:{id:"meterBoost",name:"Prime Time",desc:"Builds Ultimate meter 30% faster."},quotes:{intro:"Good evening. Tonight's top story: you, losing.",win:"And that's the news."}},{id:"ben-ari",name:"Merav Ben-Ari",nameHe:"מירב בן ארי",party:"yeshatid",role:"Yesh Atid MK",bio:"Committee veteran who never misses question time.",style:"technician",stats:{},look:{skin:st.light,height:.95,build:.92,hair:"long",hairColor:Pt.light,outfit:"blazer",jacket:30646,shirt:fe.white,tie:null,pants:fe.navy,female:!0},specials:[{type:"projectile",name:"Parliamentary Question",prop:"paper",color:9494767,damage:45,effect:{stun:35}},{type:"spin",name:"Spin Kick Motion",color:46296,hits:4},{type:"counter",name:"Point of Clarification",color:4770532,damage:135}],ultimate:{type:"megabeam",name:"Motion to the Agenda",color:38599,prop:"wave"},passive:{id:"counterPunch",name:"Follow-up Question",desc:"Counter-hits deal 50% extra damage."},quotes:{intro:"I have a follow-up question.",win:"Thank you. The committee is satisfied."}},{id:"gantz",name:"Benny Gantz",nameHe:"בני גנץ",party:"nationalunity",role:"Chairman, Blue and White",bio:"Former IDF Chief of Staff. Tall, calm, and has entered and left more governments than anyone.",style:"balanced",stats:{health:1.08,defense:1.04},look:{skin:st.light,height:1.1,build:1.02,hair:"short",hairColor:11053224,outfit:"suit",jacket:fe.navy,shirt:fe.paleBlue,tie:4756975,pants:fe.navy},specials:[{type:"slam",name:"Paratrooper Drop",color:4756975,damage:125},{type:"rush",name:"Blue & White Charge",color:4415982,armor:!0,damage:115,distance:3.6},{type:"counter",name:"Unity Guard",color:12443902,damage:145}],ultimate:{type:"cinematic",name:"Joint Operation",color:4415982,prop:"flag"},passive:{id:"thickSkin",name:"Chief of Staff",desc:"Takes 14% less damage."},quotes:{intro:"Israel before everything. Including you.",win:"Mission accomplished. For now."}},{id:"eisenkot",name:"Gadi Eisenkot",nameHe:"גדי איזנקוט",party:"yashar",role:"Former IDF Chief of Staff",bio:"Soft-spoken strategist who plans ten moves ahead. Started his own party to say it straight.",style:"technician",stats:{},look:{skin:st.medium,height:.98,build:1,hair:"buzz",hairColor:9079434,outfit:"suit",jacket:fe.charcoal,shirt:fe.white,tie:7107965,pants:fe.charcoal},specials:[{type:"trap",name:"Battle Plan",prop:"map",color:5800279,effect:{stun:50}},{type:"teleport",name:"Flanking Maneuver",color:3824192,mode:"behind",attack:!0},{type:"beam",name:"Straight Talk",prop:"sound",color:14342093,length:3.2,damage:110,hits:4}],ultimate:{type:"megarain",name:"Chief's Directive",color:5800279,prop:"jet"},passive:{id:"powerSurge",name:"Strategist",desc:"Special moves deal 20% more damage."},quotes:{intro:"I've already planned this fight.",win:"As expected."}},{id:"tropper",name:"Chili Tropper",nameHe:"חילי טרופר",party:"nationalunity",role:"National Unity MK",bio:"Former teacher and Culture & Sport Minister. Delivers a lecture with every punch.",style:"balanced",stats:{},look:{skin:st.fair,height:1.02,build:.96,hair:"short",hairColor:Pt.dark,facialHair:"stubble",facialHairColor:Pt.dark,outfit:"open-suit",jacket:fe.slate,shirt:fe.white,tie:null,pants:fe.slate},specials:[{type:"projectile",name:"Chalk Toss",prop:"chalk",color:16777215,count:2,damage:45,speed:.2},{type:"rush",name:"Sports Tackle",prop:"ball",color:16219904,damage:110,launch:!0},{type:"rising",name:"Culture Kick",color:16564041,damage:115,hits:2}],ultimate:{type:"cinematic",name:"Final Whistle",color:16219904,prop:"whistle"},passive:{id:"regen",name:"Team Player",desc:"Recovers part of his lost health when not taking damage."},quotes:{intro:"Class is in session.",win:"Homework: practice more."}},{id:"tamano-shata",name:"Pnina Tamano-Shata",nameHe:"פנינה תמנו-שטה",party:"nationalunity",role:"National Unity MK",bio:"Trailblazing lawyer and former Aliyah Minister. Breaks glass ceilings for a living.",style:"rushdown",stats:{speed:1.04},look:{skin:st.deep,height:.95,build:.9,hair:"braids",hairColor:1314572,outfit:"blazer",jacket:16758531,shirt:fe.white,tie:null,pants:fe.navy,female:!0},specials:[{type:"projectile",name:"Aliyah Flight",prop:"plane",color:9358054,damage:80,speed:.18},{type:"rush",name:"Integration Drive",color:16758531,hits:2,damage:115},{type:"rising",name:"Glass Ceiling Breaker",color:13299960,damage:125,height:1.15,hits:2}],ultimate:{type:"megaprojectile",name:"Trailblazer",color:16758531,prop:"star"},passive:{id:"swift",name:"First Through the Door",desc:"Moves 18% faster."},quotes:{intro:"Nobody gave me a seat at the table. I took one.",win:"Another ceiling, shattered."}},{id:"deri",name:"Aryeh Deri",nameHe:"אריה דרעי",party:"shas",role:"Shas Chairman",bio:"The ultimate political comeback story and dealmaker. Every coalition goes through him.",style:"technician",stats:{},look:{skin:st.medium,height:.97,build:1.08,hair:"short",hairColor:3815994,facialHair:"full",facialHairColor:9079434,glasses:"rect",headwear:"kippah",headwearColor:1118481,outfit:"suit",jacket:fe.black,shirt:fe.white,tie:1914199,pants:fe.black},specials:[{type:"pull",name:"Coalition Demands",prop:"briefcase",color:1914199,damage:55},{type:"projectile",name:"Budget Allocation",prop:"shekel",color:16765286,count:3,damage:38},{type:"counter",name:"Veteran's Maneuver",color:4553629,damage:150}],ultimate:{type:"megagrab",name:"The Kingmaker",color:16765286},passive:{id:"lifeline",name:"The Comeback",desc:"Once per match, survives a knockout blow with 1 HP."},quotes:{intro:"Let's make a deal.",win:"Every government needs me."}},{id:"malchieli",name:"Michael Malchieli",nameHe:"מיכאל מלכיאלי",party:"shas",role:"Shas MK",bio:"Former Religious Services Minister. Methodical, patient, and very hard to move.",style:"grappler",stats:{health:1.04},look:{skin:st.medium,height:1,build:1.12,hair:"short",hairColor:Pt.black,facialHair:"full",facialHairColor:2763306,headwear:"kippah",headwearColor:1118481,outfit:"suit",jacket:1842982,shirt:fe.white,tie:2829634,pants:1842982},specials:[{type:"projectile",name:"Ministry Memo",prop:"paper",color:14737885,damage:75},{type:"grab",name:"Bureaucratic Hold",color:4282999,damage:180},{type:"rising",name:"Ascending Motion",color:7835049,damage:120}],ultimate:{type:"megabeam",name:"Ministerial Decree",color:14737885,prop:"paper"},passive:{id:"thickSkin",name:"Steady Hand",desc:"Takes 14% less damage."},quotes:{intro:"Everything in its proper order.",win:"Filed and stamped."}},{id:"gafni",name:"Moshe Gafni",nameHe:"משה גפני",party:"utj",role:"UTJ MK, Finance Committee veteran",bio:"Long-time Finance Committee chair. Controls the budget, and therefore everything.",style:"zoner",stats:{speed:.9,health:1.05},look:{skin:st.light,height:.96,build:1.1,hair:"short",hairColor:13684944,facialHair:"long",facialHairColor:15790320,glasses:"round",headwear:"black-hat",outfit:"suit",jacket:855311,shirt:fe.white,tie:null,pants:855311},specials:[{type:"projectile",name:"Funding Freeze",prop:"snowflake",color:11066076,damage:60,effect:{slow:150},desc:"Freezes your funding: you move slower for a while."},{type:"counter",name:"Committee Veto",color:1914199,damage:150},{type:"beam",name:"Budget Cut",prop:"scissors",color:15858414,length:2.8,damage:120,hits:3}],ultimate:{type:"megarain",name:"Final Budget Vote",color:16765286,prop:"coin"},passive:{id:"drainer",name:"Finance Committee",desc:"Every hit drains the opponent's meter."},quotes:{intro:"Let's discuss the budget.",win:"Motion approved. Funds transferred."}},{id:"goldknopf",name:"Yitzhak Goldknopf",nameHe:"יצחק גולדקנופף",party:"utj",role:"UTJ Chairman (Agudat Yisrael)",bio:"Former Housing Minister. Builds fast and hits like a construction crane.",style:"grappler",stats:{health:1.1,power:1.08,speed:.88,weight:1.25},look:{skin:st.light,height:1,build:1.26,hair:"short",hairColor:Pt.salt,facialHair:"long",facialHairColor:10132122,glasses:"rect",headwear:"black-hat",outfit:"suit",jacket:855311,shirt:fe.white,tie:null,pants:855311},specials:[{type:"projectile",name:"Brick Toss",prop:"brick",color:12339017,arc:!0,damage:95},{type:"grab",name:"Cornerstone Slam",prop:"brick",color:10996055,damage:190},{type:"trap",name:"Housing Tender",prop:"crane",color:16759304,effect:{stun:45}}],ultimate:{type:"megarain",name:"Housing Boom",color:12339017,prop:"brick"},passive:{id:"heavyArmor",name:"Reinforced Concrete",desc:"Heavy attacks absorb one hit during startup."},quotes:{intro:"Permit approved. Construction begins.",win:"Another building. Another floor."}},{id:"smotrich",name:"Bezalel Smotrich",nameHe:"בצלאל סמוטריץ'",party:"rzp",role:"Finance Minister",bio:"Holds the Treasury keys and the coalition's purse strings. Taxes are his combo starter.",style:"zoner",stats:{},look:{skin:st.fair,height:1.08,build:.96,hair:"short",hairColor:Pt.dark,facialHair:"short",facialHairColor:3877407,headwear:"kippah-knit",headwearColor:16053492,outfit:"open-suit",jacket:fe.charcoal,shirt:fe.white,tie:null,pants:fe.charcoal},specials:[{type:"projectile",name:"Tax Hike",prop:"shekel",color:16765286,damage:75,effect:{drain:15},desc:"A coin that steals meter on hit."},{type:"grab",name:"Treasury Lock",prop:"briefcase",color:15167313,damage:175},{type:"rising",name:"Fiscal Surge",color:16032353,damage:125}],ultimate:{type:"megarain",name:"State Budget",color:16765286,prop:"coin"},passive:{id:"deepPockets",name:"Treasury Keys",desc:"Starts every round with half a meter."},quotes:{intro:"Your budget has been... adjusted.",win:"Balanced books."}},{id:"rothman",name:"Simcha Rothman",nameHe:"שמחה רוטמן",party:"rzp",role:"Constitution Committee Chair",bio:"Chairs the Constitution Committee. Drafts bills faster than you can read them.",style:"zoner",stats:{},look:{skin:st.light,height:1,build:.98,hair:"short",hairColor:3877407,facialHair:"full",facialHairColor:3877407,glasses:"rect",headwear:"kippah-knit",headwearColor:1914199,outfit:"suit",jacket:fe.charcoal,shirt:fe.white,tie:7166330,pants:fe.charcoal},specials:[{type:"projectile",name:"Draft Bill",prop:"book",color:11895693,count:2,damage:48},{type:"trap",name:"Committee Hearing",prop:"clock",color:7166330,effect:{stun:50}},{type:"rising",name:"Second Reading",color:15046811,damage:120}],ultimate:{type:"megabeam",name:"Third Reading",color:7166330,prop:"book"},passive:{id:"chipMaster",name:"Fine Print",desc:"Blocking him still hurts: triple chip damage."},quotes:{intro:"This bill passes in first reading.",win:"Third reading. Passed."}},{id:"strook",name:"Orit Strook",nameHe:"אורית סטרוק",party:"rzp",role:"Minister of National Missions",bio:"Veteran activist who never, ever backs down.",style:"technician",stats:{defense:1.04},look:{skin:st.light,height:.93,build:.98,hair:"bob",hairColor:9075306,headwear:"hat",headwearColor:4014171,glasses:"round",outfit:"skirt",jacket:4014171,shirt:fe.white,tie:null,pants:4014171,female:!0},specials:[{type:"projectile",name:"Mission Statement",prop:"paper",color:15912079,damage:75},{type:"rush",name:"National Mission",color:14711391,armor:!0,damage:115},{type:"counter",name:"Unyielding",color:8499866,damage:140}],ultimate:{type:"cinematic",name:"Ministry Takeover",color:14711391,prop:"map"},passive:{id:"projectileProof",name:"Hardliner",desc:"Takes half damage from projectiles."},quotes:{intro:"I don't negotiate.",win:"Mission complete."}},{id:"ben-gvir",name:"Itamar Ben-Gvir",nameHe:"איתמר בן גביר",party:"otzma",role:"National Security Minister",bio:"Resigned, returned, and threatened to resign again. Always arrives with the sirens on.",style:"brawler",stats:{power:1.06,weight:1.1},look:{skin:st.warm,height:1,build:1.16,hair:"short",hairColor:Pt.dark,headwear:"kippah-knit",headwearColor:16053492,outfit:"open-suit",jacket:fe.charcoal,shirt:fe.white,tie:null,pants:fe.charcoal},specials:[{type:"beam",name:"Siren Blast",prop:"siren",color:16720418,length:3.8,damage:110,hits:5},{type:"rush",name:"Police Reform",color:1920728,hits:2,damage:120,armor:!0},{type:"teleport",name:"Resign & Return",color:16766474,mode:"front",attack:!0,desc:"Vanishes from government, then comes right back swinging."}],ultimate:{type:"megarain",name:"National Guard",color:1920728,prop:"siren"},passive:{id:"rage",name:"Comeback Tour",desc:"Deals 25% more damage below 30% health."},quotes:{intro:"Sirens on. Let's go.",win:"Order has been restored. My order."}},{id:"fogel",name:"Zvika Fogel",nameHe:"צביקה פוגל",party:"otzma",role:"Otzma Yehudit MK",bio:"Retired brigadier general. Old school, heavy artillery, zero subtlety.",style:"brawler",stats:{health:1.05,speed:.9},look:{skin:st.warm,height:1,build:1.12,hair:"buzz",hairColor:13684944,facialHair:"mustache",facialHairColor:13684944,outfit:"open-suit",jacket:5597999,shirt:14211264,tie:null,pants:4147754},specials:[{type:"rain",name:"Artillery Call",prop:"bomb",color:7041116,count:4,damage:34},{type:"rush",name:"Tank Charge",prop:"tank",color:6319160,armor:!0,damage:125,distance:3},{type:"rising",name:"Reserve Duty",color:11109479,damage:120}],ultimate:{type:"megaprojectile",name:"Full Mobilization",color:6319160,prop:"tank"},passive:{id:"heavyArmor",name:"Old General",desc:"Heavy attacks absorb one hit during startup."},quotes:{intro:"In my day we fought without special moves.",win:"Dismissed."}},{id:"maoz",name:"Avi Maoz",nameHe:"אבי מעוז",party:"noam",role:"Noam Chairman",bio:"A one-man faction with a very specific agenda. Fights alone, and likes it.",style:"zoner",stats:{},look:{skin:st.light,height:.98,build:.98,hair:"short",hairColor:9079434,facialHair:"full",facialHairColor:10132122,glasses:"rect",headwear:"kippah-knit",headwearColor:2236962,outfit:"suit",jacket:fe.charcoal,shirt:fe.white,tie:6182030,pants:fe.charcoal},specials:[{type:"projectile",name:"Pamphlet Barrage",prop:"paper",color:10454720,count:3,damage:36},{type:"shield",name:"One-Man Faction",color:10454720,hits:2},{type:"beam",name:"Agenda Push",prop:"megaphone",color:12490180,length:3.5,hits:4}],ultimate:{type:"megabeam",name:"Single Seat, Full Volume",color:6182030,prop:"megaphone"},passive:{id:"regen",name:"Lone Seat",desc:"Recovers part of his lost health when not taking damage."},quotes:{intro:"I don't need a coalition.",win:"One seat is enough."}},{id:"lieberman",name:"Avigdor Lieberman",nameHe:"אביגדור ליברמן",nick:"Yvet",party:"yb",role:"Yisrael Beiteinu Chairman",bio:"Former nightclub bouncer turned kingmaker. If you're not on the list, you're not getting in.",style:"grappler",stats:{health:1.12,power:1.1,speed:.86,weight:1.3},look:{skin:st.light,height:1.02,build:1.3,hair:"buzz",hairColor:Pt.grey,facialHair:"short",facialHairColor:Pt.grey,outfit:"open-suit",jacket:fe.charcoal,shirt:fe.white,tie:null,pants:fe.charcoal},specials:[{type:"grab",name:"Bouncer's Grip",color:1914199,damage:190,range:1.35},{type:"rush",name:"Iron Fist",color:2575479,armor:!0,damage:125},{type:"wave",name:"Political Earthquake",prop:"wave",color:6330042,damage:85}],ultimate:{type:"megagrab",name:"You're Not on the List",color:1914199},passive:{id:"bouncer",name:"Bouncer",desc:"Throws deal 60% more damage and reach further."},quotes:{intro:"Name? You're not on the list.",win:"Next."}},{id:"forer",name:"Oded Forer",nameHe:"עודד פורר",party:"yb",role:"Yisrael Beiteinu MK",bio:"Former Agriculture Minister. Lieberman's right hand, and a pretty good left too.",style:"balanced",stats:{},look:{skin:st.light,height:1.02,build:.96,hair:"short",hairColor:3877407,outfit:"suit",jacket:2575479,shirt:fe.white,tie:10735345,pants:2575479},specials:[{type:"projectile",name:"Watermelon Lob",prop:"watermelon",color:3715072,arc:!0,damage:95},{type:"counter",name:"Committee Chair",color:6330042,damage:140},{type:"rising",name:"Rising Question",color:10735345,damage:120}],ultimate:{type:"cinematic",name:"Commission of Inquiry",color:2575479,prop:"book"},passive:{id:"comboMaster",name:"Loyal Lieutenant",desc:"Combos lose less damage to scaling."},quotes:{intro:"The chairman sends his regards.",win:"Fresh from the field."}},{id:"mansour-abbas",name:"Mansour Abbas",nameHe:"מנסור עבאס",party:"raam",role:"Ra'am Chairman",bio:"Dentist by trade and history-maker by profession: led the first Arab party into a governing coalition.",style:"technician",stats:{},look:{skin:st.olive,height:1,build:1.02,hair:"short",hairColor:Pt.black,facialHair:"mustache",facialHairColor:Pt.black,outfit:"suit",jacket:fe.charcoal,shirt:fe.white,tie:2976335,pants:fe.charcoal},specials:[{type:"grab",name:"Root Canal",prop:"drill",color:15858414,damage:175},{type:"barrage",name:"Drill Rush",prop:"drill",color:5420936,hits:7,damage:120},{type:"shield",name:"Bridge Builder",color:9819570,hits:2}],ultimate:{type:"megagrab",name:"Painless Extraction",color:16777215,prop:"tooth"},passive:{id:"vampire",name:"Kingmaker",desc:"Heals 12% of the damage he deals."},quotes:{intro:"Open wide. This won't hurt. Much.",win:"Please rinse."}},{id:"odeh",name:"Ayman Odeh",nameHe:"איימן עודה",party:"hadash",role:"Hadash Chairman",bio:"Lawyer and orator who can rally a crowd in two languages.",style:"zoner",stats:{},look:{skin:st.olive,height:1.02,build:.98,hair:"short",hairColor:Pt.black,facialHair:"stubble",facialHairColor:Pt.black,outfit:"open-suit",jacket:3815994,shirt:fe.white,tie:null,pants:3815994},specials:[{type:"beam",name:"Megaphone",prop:"megaphone",color:14034984,length:4,hits:4,damage:110},{type:"wave",name:"Protest March",prop:"sign",color:16219904,damage:80},{type:"rising",name:"Rising Voice",color:16564041,damage:120}],ultimate:{type:"megarain",name:"Mass Rally",color:14034984,prop:"sign"},passive:{id:"meterBoost",name:"Orator",desc:"Builds Ultimate meter 30% faster."},quotes:{intro:"Let me speak!",win:"The crowd has spoken."}},{id:"tibi",name:"Ahmad Tibi",nameHe:"אחמד טיבי",party:"hadash",role:"Ta'al Chairman",bio:"Physician and the Knesset's sharpest wit. His one-liners leave marks.",style:"technician",stats:{},look:{skin:st.olive,height:1,build:1.05,hair:"receding",hairColor:10526880,facialHair:"mustache",facialHairColor:10132122,glasses:"rect",outfit:"suit",jacket:fe.charcoal,shirt:fe.white,tie:7864320,pants:fe.charcoal},specials:[{type:"projectile",name:"One-Liner",prop:"star",color:16766474,speed:.24,damage:70},{type:"counter",name:"Witty Retort",color:16761600,damage:150},{type:"heal",name:"Doctor's Orders",color:8454107,amount:90}],ultimate:{type:"cinematic",name:"Standing Ovation",color:16766474,prop:"mic"},passive:{id:"counterPunch",name:"Sharpest Wit",desc:"Counter-hits deal 50% extra damage."},quotes:{intro:"Is that your best line?",win:"The doctor is out."}},{id:"touma-sliman",name:"Aida Touma-Sliman",nameHe:"עאידה תומא-סלימאן",party:"hadash",role:"Hadash MK",bio:"Veteran feminist activist and journalist. The first Arab woman to chair a Knesset committee.",style:"balanced",stats:{},look:{skin:st.medium,height:.94,build:.95,hair:"bob",hairColor:9079434,glasses:"round",outfit:"blazer",jacket:7864320,shirt:1118481,tie:null,pants:1118481,female:!0},specials:[{type:"projectile",name:"Petition Storm",prop:"paper",color:16777215,count:3,damage:38},{type:"rush",name:"Equal Rights Rush",color:12653087,damage:115,hits:2},{type:"rising",name:"Status Check",color:16741775,damage:120}],ultimate:{type:"megarain",name:"Women's March",color:12653087,prop:"sign"},passive:{id:"thickSkin",name:"Seasoned Activist",desc:"Takes 14% less damage."},quotes:{intro:"I've been fighting longer than you've been in politics.",win:"Equality: achieved."}},{id:"kariv",name:"Gilad Kariv",nameHe:"גלעד קריב",party:"democrats",role:"The Democrats MK",bio:"Reform rabbi and legislator. Amends opponents clause by clause.",style:"technician",stats:{},look:{skin:st.light,height:1,build:1,hair:"short",hairColor:3877407,facialHair:"short",facialHairColor:3877407,glasses:"round",headwear:"kippah-knit",headwearColor:12653087,outfit:"suit",jacket:fe.charcoal,shirt:fe.white,tie:12653087,pants:fe.charcoal},specials:[{type:"projectile",name:"Amendment",prop:"paper",color:15672124,damage:75},{type:"trap",name:"Parliamentary Question",prop:"clock",color:9279918,effect:{stun:45}},{type:"rising",name:"Reform Rising",color:15672124,damage:120}],ultimate:{type:"megabeam",name:"Constitutional Crisis",color:15672124,prop:"book"},passive:{id:"powerSurge",name:"Legislator",desc:"Special moves deal 20% more damage."},quotes:{intro:"I'd like to propose an amendment. To your face.",win:"Amendment adopted."}},{id:"lazimi",name:"Naama Lazimi",nameHe:"נעמה לזימי",party:"democrats",role:"The Democrats MK",bio:"Grassroots social activist. Brings the protest to the plenum, and the plenum to the street.",style:"rushdown",stats:{speed:1.03},look:{skin:st.fair,height:.94,build:.9,hair:"curly",hairColor:2825492,outfit:"tshirt",jacket:14035001,shirt:14035001,tie:null,pants:2834278,female:!0},specials:[{type:"projectile",name:"Protest Sign",prop:"sign",color:14035001,damage:80},{type:"rush",name:"Kaplan March",color:16731501,hits:3,damage:120},{type:"spin",name:"Social Justice Kick",color:16748451,hits:4,damage:105}],ultimate:{type:"megarain",name:"Mass Protest",color:14035001,prop:"sign"},passive:{id:"swift",name:"Grassroots",desc:"Moves 18% faster."},quotes:{intro:"We're not going home.",win:"The street has spoken."}}],Sh=Object.fromEntries(Ft.map(s=>[s.id,s]));function G1(s){return{...s,boss:!0,name:s.name,role:`FINAL BOSS · ${s.role}`}}const Fn=[{id:"plenum",kind:"plenum",name:"The Plenum",nameHe:"מליאת הכנסת",desc:"The horseshoe of power. Mind the government table.",music:{bpm:138,root:45,mode:"minor",intensity:1}},{id:"plaza",kind:"plaza",name:"Menorah Plaza",nameHe:"רחבת המנורה",desc:"Outside the Knesset, in the shadow of the great Menorah.",music:{bpm:128,root:50,mode:"dorian",intensity:.8}},{id:"committee",kind:"committee",name:"Finance Committee",nameHe:"ועדת הכספים",desc:"Where budgets are born and coalitions are bought.",music:{bpm:120,root:43,mode:"phrygian",intensity:.7}},{id:"beach",kind:"beach",name:"Tel Aviv Beach",nameHe:"חוף תל אביב",desc:"Sunset on Gordon Beach. Matkot players look on.",music:{bpm:124,root:48,mode:"major",intensity:.8}},{id:"market",kind:"market",name:"Mahane Yehuda",nameHe:"שוק מחנה יהודה",desc:"The shuk after dark. Every politician campaigns here eventually.",music:{bpm:132,root:47,mode:"phrygian",intensity:.9}},{id:"rooftop",kind:"rooftop",name:"Azrieli Rooftop",nameHe:"גג עזריאלי",desc:"High above Tel Aviv. Round, square and triangle towers.",music:{bpm:146,root:44,mode:"minor",intensity:1}}],Du=Object.fromEntries(Fn.map(s=>[s.id,s])),V1=["Backbencher","Committee Member","Minister","Prime Minister","Supreme Court"],Mh=[{reaction:30,block:.12,aggression:.3,combo:.1,antiAir:.1,tech:0,interval:26},{reaction:20,block:.35,aggression:.45,combo:.35,antiAir:.3,tech:.2,interval:18},{reaction:13,block:.6,aggression:.55,combo:.6,antiAir:.55,tech:.4,interval:12},{reaction:8,block:.8,aggression:.65,combo:.85,antiAir:.8,tech:.6,interval:8},{reaction:4,block:.93,aggression:.75,combo:1,antiAir:.95,tech:.8,interval:5}],bh=new Set(["projectile","beam","wave","rain","trap"]),W1=new Set(["rush","dive","slam","teleport","spin","pull"]),X1=new Set(["grab","barrage"]),wh=new Set(["rising","counter"]),q1=new Set(["buff","heal","shield"]);class ao{lv;plan=[];seed;threatTimer=0;decidedThreat=!1;lastMoveKey="";techTried=!1;idle=0;constructor(e,t=1234){this.lv=Mh[Math.max(0,Math.min(Mh.length-1,e))],this.seed=t}rand(){return this.seed=this.seed*1103515245+12345&2147483647,this.seed/2147483647}reset(){this.plan=[],this.threatTimer=0}next(e,t){if(t.phase!=="fight")return this.plan=[],hn;const n=e.opponent,i=e.facing,r=i>0?6:4,a=i>0?4:6,o=i>0?1:3,c=i>0?9:7,l=Math.abs(n.x-e.x);if(e.state==="thrown")return!this.techTried&&e.stateFrame>=2&&(this.techTried=!0,this.rand()<this.lv.tech)?{dir:5,held:de.TH,pressed:de.TH}:hn;if(this.techTried=!1,e.state==="attack"&&e.move&&e.moveConnected){const f=`${e.move.id}:${t.frame-e.moveFrame}`;if(f!==this.lastMoveKey&&(this.lastMoveKey=f,e.move.kind==="normal"&&e.move.cancel&&this.rand()<this.lv.combo)){if(this.plan=[],e.meter>=100&&this.ultInRange(e,l)&&this.rand()<.6)return this.press(de.UL,5);const g=this.pickSpecial(e,l,["rush","rising","barrage","spin","projectile","beam","pull","grab"]);if(g>=0)return this.press(de.SP,g===2?2:g===1?r:5)}}if(this.plan.length){const f=this.plan.shift();return(e.state==="hitstun"||e.state==="juggle"||e.state==="knockdown")&&(this.plan=[]),f}if(!(e.actionable||e.state==="blockstun")&&e.state!=="air")return hn;const d=t.isThreatened(e);if(d?this.threatTimer++:(this.threatTimer=0,this.decidedThreat=!1),d&&this.threatTimer>=this.lv.reaction&&!this.decidedThreat&&e.grounded){if(this.decidedThreat=!0,this.rand()<this.lv.block){const f=n.move?.hit?.guard,g=f==="low"||n.isCrouching&&f!=="overhead";return this.plan=this.hold(g?o:a,14),this.plan.shift()}if(this.rand()<.25)return this.press(de.SS,5)}if(e.state==="blockstun")return{dir:n.move?.hit?.guard==="low"?o:a,held:0,pressed:0};if(e.state==="air")return hn;if(!n.grounded&&(n.state==="air"||n.state==="attack"&&!!n.move?.air)&&l<3&&Math.sign(n.vx||0)!==Math.sign(e.x-n.x)*-1&&!this.decidedThreat&&this.rand()<this.lv.antiAir*.2){this.decidedThreat=!0;const f=this.findSpecial(e,wh);return f>=0&&e.moves.specials[f].tag==="rising"?this.press(de.SP,f===2?2:f===1?r:5):this.press(de.HP,2)}return this.idle++,this.idle<this.lv.interval?{dir:l>3&&this.rand()<this.lv.aggression?r:5,held:0,pressed:0}:(this.idle=0,this.decide(e,t,l,{FWD:r,BACK:a,DBACK:o,UFWD:c}),this.plan.shift()??hn)}decide(e,t,n,i){const r=this.rand(),a=this.lv.aggression;if(e.meter>=100&&this.ultInRange(e,n)&&r<.35){this.plan=[this.pressFrame(de.UL,5)];return}if(n>4.2){const l=this.findSpecial(e,bh,t),h=this.findSpecial(e,q1,t);if(l>=0&&r<.35)return this.useSpecial(l,i.FWD);if(h>=0&&r<.45)return this.useSpecial(h,i.FWD);if(r<.8){this.plan=this.hold(i.FWD,20);return}this.plan=[...this.hold(i.FWD,1),...this.hold(5,2),...this.hold(i.FWD,1),...this.hold(5,14)];return}if(n>2.1){const l=this.findSpecial(e,W1,t),h=this.findSpecial(e,bh,t);if(l>=0&&r<.2*(.5+a))return this.useSpecial(l,i.FWD);if(h>=0&&r<.4)return this.useSpecial(h,i.FWD);if(r<.4+a*.2){this.plan=[...this.hold(i.UFWD,4),...this.hold(5,14),this.pressFrame(de.HK,5),...this.hold(5,18)];return}if(r<.85){this.plan=this.hold(i.FWD,14);return}this.plan=this.hold(i.BACK,10);return}const o=this.findSpecial(e,X1,t);if(o>=0&&n<1.3&&r<.12)return this.useSpecial(o,i.FWD);if(n<1.05&&r<.2){this.plan=[this.pressFrame(de.TH,5),...this.hold(5,10)];return}const c=this.rand();if(c<.22)this.plan=[this.pressFrame(de.LP,5),...this.hold(5,5),this.pressFrame(de.LP,5),...this.hold(5,5),this.pressFrame(de.HP,5),...this.hold(5,8)];else if(c<.38)this.plan=[this.pressFrame(de.LK,2),...this.hold(2,6),this.pressFrame(de.HK,2),...this.hold(5,20)];else if(c<.5)this.plan=[this.pressFrame(de.HP,5),...this.hold(5,14)];else if(c<.6)this.plan=[this.pressFrame(de.HK,5),...this.hold(5,18)];else if(c<.66)this.plan=[this.pressFrame(de.HP,i.FWD),...this.hold(5,30)];else if(c<.78)this.plan=this.hold(i.BACK,16);else if(c<.88)this.plan=this.hold(i.DBACK,12);else{const l=this.findSpecial(e,wh,t);if(l>=0)return this.useSpecial(l,i.FWD);this.plan=[this.pressFrame(de.LK,2),...this.hold(2,8)]}}ultInRange(e,t){switch(e.moves.ultimate.tag){case"cinematic":return t<3.2;case"megagrab":return t<1.6;default:return!0}}findSpecial(e,t,n){const i=[];return e.moves.specials.forEach((r,a)=>{t.has(r.tag??"")&&(!n||e.canUse(r,n))&&i.push(a)}),i.length?i[Math.floor(this.rand()*i.length)]:-1}pickSpecial(e,t,n){for(const i of n){const r=e.moves.specials.findIndex(a=>a.tag===i);if(r>=0){if((i==="grab"||i==="barrage")&&t>1.4)continue;return r}}return-1}useSpecial(e,t){const n=e===2?2:e===1?t:5;this.plan=[this.pressFrame(de.SP,n),...this.hold(5,12)]}press(e,t){return this.pressFrame(e,t)}pressFrame(e,t){return{dir:t,held:e,pressed:e}}hold(e,t){const n=[];for(let i=0;i<t;i++)n.push({dir:e,held:0,pressed:0});return n}}function K1(s,e,t,n){const i=e.facing;switch(s){case"stand":return hn;case"crouch":return{dir:2,held:0,pressed:0};case"jump":return{dir:8,held:0,pressed:0};case"block":{const r=e.opponent,a=r.move?.hit?.guard==="low"||r.isCrouching&&r.move?.hit?.guard!=="overhead",o=i>0?4:6,c=i>0?1:3;return{dir:a?c:o,held:0,pressed:0}}case"cpu":return n?n.next(e,t):hn}}const ol=new Map;function $1(s){return ol.get(s)}async function Y1(s,e){const n=document.createElement("canvas");n.width=192,n.height=192;let i;try{i=new Au({canvas:n,antialias:!0,alpha:!0,preserveDrawingBuffer:!0})}catch{return}i.setSize(192,192,!1),i.outputColorSpace=jt,i.toneMapping=sa,i.setClearColor(0,0);const r=new eu;r.add(new gu(16777215,4477030,1.5));const a=new ta(16777215,2.6);a.position.set(1.5,2.5,3),r.add(a);const o=new ta(11193599,1.6);o.position.set(-2,1.5,-2),r.add(o);const c=new cn(24,1,.1,20);for(let l=0;l<s.length;l++){const h=s[l];if(ol.has(h.id))continue;const d=Pu(h);A1(d),d.root.rotation.y=.35,r.add(d.root),d.root.updateMatrixWorld(!0);const u=new I;d.head.getWorldPosition(u),u.y+=.1*h.look.height,c.position.set(u.x+.25,u.y+.05,u.z+1.35),c.lookAt(u.x,u.y-.08,u.z);const f=ki[h.party];i.setClearColor(f.color,1),i.render(r,c),ol.set(h.id,n.toDataURL("image/png")),r.remove(d.root),Ru(d),e?.(l+1,s.length),l%4===3&&await new Promise(g=>setTimeout(g,0))}i.dispose(),i.forceContextLoss()}function ze(s){return s.replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e])}function Ye(s,e="",t=""){const n=document.createElement(s);return e&&(n.className=e),t&&(n.innerHTML=t),n}function Js(s){return"#"+s.toString(16).padStart(6,"0")}function ll(s){let e=s>>16&255,t=s>>8&255,n=s&255;const i=.299*e+.587*t+.114*n;if(i<140){const a=(140-i)/(255-i+1);e=Math.round(e+(255-e)*a*1.4),t=Math.round(t+(255-t)*a*1.4),n=Math.round(n+(255-n)*a*1.4)}const r=a=>Math.max(0,Math.min(255,a));return`rgb(${r(e)},${r(t)},${r(n)})`}function xi(s,e=""){const t=$1(s.id);if(t)return`<img class="${e}" src="${t}" alt="${ze(s.name)}" draggable="false">`;const n=s.name.split(" ").map(i=>i[0]).join("").slice(0,2);return`<div class="${e} init" style="background:${Js(ki[s.party].color)}">${ze(n)}</div>`}function ku(s){const e=ki[s.party];return`<span class="chip" style="background:${Js(e.color)};color:#fff">${ze(e.name)} · <span class="he">${ze(e.nameHe)}</span></span>`}class ps{constructor(e,t,n={}){this.items=e,this.audio=t,this.el=Ye("div","menu"),n.desc&&(this.descEl=Ye("div","desc")),this.build()}items;audio;el;index=0;descEl=null;itemEls=[];setItems(e){this.items=e,this.index=Math.min(this.index,e.length-1),this.build()}build(){this.el.innerHTML="",this.itemEls=this.items.map((e,t)=>{const n=Ye("div","item");return n.addEventListener("mouseenter",()=>{this.index!==t&&(this.index=t,this.render())}),n.addEventListener("click",()=>{this.index=t,this.activate()}),this.el.appendChild(n),n}),this.descEl&&this.el.appendChild(this.descEl),this.render()}render(){this.items.forEach((e,t)=>{const n=this.itemEls[t],i=e.value?`<span class="val">◀ ${ze(e.value())} ▶</span>`:"";n.innerHTML=`<span>${ze(e.label)}</span>${i}`,n.classList.toggle("sel",t===this.index),n.classList.toggle("disabled",!!e.disabled)}),this.descEl&&(this.descEl.textContent=this.items[this.index]?.desc??"")}activate(){const e=this.items[this.index];!e||e.disabled||(e.onSelect?(this.audio.sfx("menuConfirm"),e.onSelect()):e.onRight&&(this.audio.sfx("menuMove"),e.onRight(),this.render()))}handle(e){const t=this.items.length;e.up?(this.index=(this.index-1+t)%t,this.audio.sfx("menuMove"),this.render()):e.down?(this.index=(this.index+1)%t,this.audio.sfx("menuMove"),this.render()):e.left&&this.items[this.index]?.onLeft?(this.items[this.index].onLeft(),this.audio.sfx("menuMove"),this.render()):e.right&&this.items[this.index]?.onRight?(this.items[this.index].onRight(),this.audio.sfx("menuMove"),this.render()):e.confirm&&this.activate()}}const qr={qcf:"↓↘→",qcb:"↓↙←",dp:"→↓↘",dqcf:"↓↘→↓↘→"},J1=48;function Z1(s){switch(s){case 1:return 3;case 3:return 1;case 4:return 6;case 6:return 4;case 7:return 9;case 9:return 7;default:return s}}function Eh(s,e){return e>=0?s:Z1(s)}const Ts=s=>s===1||s===2||s===3,oo=s=>s===7||s===8||s===9,j1=s=>s===3||s===6||s===9,Q1=s=>s===1||s===4||s===7,yn=s=>e=>e===s,Jn=(...s)=>e=>s.includes(e),ex={qcf:[Jn(2,1),yn(3),Jn(6,9)],qcb:[Jn(2,3),yn(1),Jn(4,7)],dp:[Jn(6,9,3),yn(2),Jn(3,6)],dqcf:[Jn(2,1),yn(3),Jn(6,9),yn(2),yn(3),Jn(6,9)],dashF:[yn(6),yn(5),yn(6)],dashB:[yn(4),yn(5),yn(4)]};class tx{dirs=[];presses=[];consumed=[];push(e,t){this.dirs.push(e),this.presses.push(t),this.consumed.push(0),this.dirs.length>J1&&(this.dirs.shift(),this.presses.shift(),this.consumed.shift())}clear(){this.dirs.length=0,this.presses.length=0,this.consumed.length=0}buffered(e,t=nc){let n=0;const i=this.presses.length;for(let r=Math.max(0,i-t);r<i;r++)n|=this.presses[r]&~this.consumed[r]&e;return n}consume(e,t=nc){const n=this.presses.length;for(let i=Math.max(0,n-t);i<n;i++)this.consumed[i]|=this.presses[i]&e}pressedTogether(e,t,n=3){return(this.buffered(e,n)&e)!==0&&(this.buffered(t,n)&t)!==0}motion(e,t=md,n=8){const i=ex[e],r=this.dirs,a=r.length,o=e==="dqcf"?t*2:t,c=Math.max(0,a-o);let l=i.length-1,h=a-1,d=!1;for(;h>=Math.max(c,a-n);h--)if(i[l](r[h])){d=!0;break}if(!d)return!1;for(l--,h=h-1;h>=c&&l>=0;h--)i[l](r[h])&&l--;return l<0}dash(e){const t=this.dirs.length;if(t<3)return!1;const n=e?6:4;if(this.dirs[t-1]!==n||this.dirs[t-2]===n)return!1;let i=!1;for(let r=t-2;r>=Math.max(0,t-14);r--){const a=this.dirs[r];if(a===5)i=!0;else{if(a===n&&i)return!0;if(a!==5)return!1}}return!1}}const nx=[{id:"jab",name:"Jab",anim:"jab",s:4,a:2,r:7,box:{x:.62,y:1.42,w:.6,h:.3},dmg:30,hs:14,bs:10,guard:"mid",push:.07,chain:["jab","strong","short","roundhouse"],cancel:!0},{id:"strong",name:"Straight",anim:"strong",s:8,a:3,r:16,box:{x:.74,y:1.38,w:.72,h:.36},dmg:70,hs:19,bs:15,guard:"mid",push:.11,heavy:!0,cancel:!0,motion:[{from:4,to:9,vx:.03}]},{id:"short",name:"Low Kick",anim:"short",s:5,a:3,r:9,box:{x:.68,y:.62,w:.64,h:.34},dmg:35,hs:14,bs:10,guard:"mid",push:.08,chain:["strong","roundhouse"],cancel:!0},{id:"roundhouse",name:"Roundhouse",anim:"roundhouse",s:10,a:3,r:18,box:{x:.84,y:1.25,w:.84,h:.44},dmg:82,hs:20,bs:15,guard:"mid",push:.14,heavy:!0,cancel:!0},{id:"cJab",name:"Crouch Jab",anim:"cJab",s:4,a:2,r:7,box:{x:.62,y:.82,w:.58,h:.28},dmg:25,hs:13,bs:9,guard:"mid",push:.07,low:!0,chain:["cJab","cShort","cStrong","sweep","strong"],cancel:!0},{id:"cStrong",name:"Uppercut",anim:"cStrong",s:7,a:4,r:18,box:{x:.48,y:1.5,w:.66,h:1.05},dmg:70,hs:19,bs:14,guard:"mid",push:.09,heavy:!0,low:!0,cancel:!0,launch:.22},{id:"cShort",name:"Shin Kick",anim:"cShort",s:5,a:2,r:9,box:{x:.74,y:.16,w:.74,h:.26},dmg:25,hs:13,bs:9,guard:"low",push:.07,low:!0,chain:["cJab","cStrong","sweep"],cancel:!0},{id:"sweep",name:"Sweep",anim:"sweep",s:9,a:4,r:22,box:{x:.94,y:.16,w:1,h:.28},dmg:70,hs:20,bs:14,guard:"low",push:.1,heavy:!0,low:!0,knockdown:!0},{id:"jJab",name:"Air Jab",anim:"jJab",s:4,a:8,r:3,box:{x:.52,y:.78,w:.58,h:.4},dmg:35,hs:14,bs:10,guard:"overhead",push:.06,air:!0},{id:"jStrong",name:"Air Hammer",anim:"jStrong",s:7,a:5,r:5,box:{x:.62,y:.62,w:.74,h:.5},dmg:70,hs:18,bs:14,guard:"overhead",push:.08,heavy:!0,air:!0},{id:"jShort",name:"Air Knee",anim:"jShort",s:5,a:9,r:3,box:{x:.56,y:.38,w:.62,h:.44},dmg:40,hs:15,bs:11,guard:"overhead",push:.06,air:!0},{id:"jRoundhouse",name:"Flying Kick",anim:"jRoundhouse",s:8,a:5,r:5,box:{x:.74,y:.4,w:.84,h:.5},dmg:82,hs:18,bs:14,guard:"overhead",push:.09,heavy:!0,air:!0},{id:"overhead",name:"Overhead Chop",anim:"overhead",s:18,a:3,r:14,box:{x:.72,y:1.3,w:.74,h:.66},dmg:60,hs:17,bs:12,guard:"overhead",push:.09,heavy:!0,motion:[{from:3,to:16,vx:.035}]}],ix={balanced:{startup:0,heavyStartup:0,recovery:0,damage:1,reach:0,hitstun:0},rushdown:{startup:-1,heavyStartup:-1,recovery:0,damage:.94,reach:-.03,hitstun:0},brawler:{startup:0,heavyStartup:1,recovery:1,damage:1.12,reach:0,hitstun:1},grappler:{startup:0,heavyStartup:1,recovery:0,damage:1.05,reach:0,hitstun:0},zoner:{startup:0,heavyStartup:0,recovery:0,damage:.95,reach:.12,hitstun:0},technician:{startup:0,heavyStartup:0,recovery:-1,damage:1,reach:.04,hitstun:1}},Uu={balanced:"All-rounder",rushdown:"Rushdown: fast pokes, fast feet",brawler:"Brawler: slower, hits harder",grappler:"Grappler: huge throws, sturdy",zoner:"Zoner: long reach, keeps you out",technician:"Technician: tight frames, big combos"};function sx(s,e){const t=ix[s],n={};for(const i of nx){const r=Math.max(3,i.s+t.startup+(i.heavy?t.heavyStartup:0)),a=Math.max(3,i.r+t.recovery),o=i.heavy?t.reach:t.reach*.5,c={damage:Math.round(i.dmg*t.damage*e),chip:0,hitstun:i.hs+t.hitstun,blockstun:i.bs,guard:i.guard,pushback:i.push,spark:i.heavy?"heavy":"light",knockdown:i.knockdown,launch:i.knockdown?.12:i.launch,meterGain:i.heavy?6:3};n[i.id]={id:i.id,name:i.name,kind:"normal",anim:i.anim,startup:r,active:i.a,recovery:a,hitbox:{x:i.box.x+o/2,y:i.box.y,w:i.box.w+o,h:i.box.h},hit:c,air:i.air,lowProfile:i.low,chain:i.chain,cancel:i.cancel?["special","super"]:void 0,motion:i.motion,tag:i.heavy?"heavy":"light"}}return n}function rx(s,e){const t=s==="grappler";return{id:"throw",name:"Throw",kind:"throw",anim:"throw",startup:5,active:3,recovery:22,throwRange:.98+(t?.25:0)+(e?.3:0),throwDamage:Math.round(120*(t?1.4:1)*(e?1.6:1)),techable:!0,tag:"throw"}}function Gt(s,e={}){return{damage:s,chip:Math.round(s*.15),hitstun:22,blockstun:17,guard:"mid",pushback:.12,spark:"special",meterGain:8,...e}}const pi=(s,e,t)=>e+(t-e)*s.strength,ax={projectile:"Fires a projectile.",rush:"Charges forward with a strike.",rising:"Invincible rising anti-air.",grab:"Unblockable command grab.",counter:"Counter stance: absorbs a strike and retaliates.",buff:"Temporary power-up.",heal:"Recovers health (vulnerable).",teleport:"Vanishes and reappears.",wave:"Ground wave: must be blocked low or jumped.",dive:"Diving kick (also works in the air).",trap:"Places a trap on the floor.",beam:"Short-range multi-hit beam.",pull:"Long reach strike that yanks the opponent in.",slam:"Leaps at the opponent and slams down (overhead).",rain:"Calls objects down on the opponent.",shield:"Raises a barrier.",spin:"Spinning multi-hit advance, passes over lows.",barrage:"Rapid flurry of blows."};function Nu(s){return s.desc??ax[s.type]}function ox(s,e){const t=`sp${e}`,n={id:t,name:s.name,kind:"special",color:s.color,tag:s.type,desc:Nu(s),cancel:["super"]};switch(s.type){case"projectile":{const i=s.count??1,r=s.damage??(i>1?45:80),a=s.size??1,o=`${t}`,c=13,l=7;return{...n,anim:"cast",prop:s.prop,startup:c,active:1+(i-1)*l,recovery:26,canStart:(h,d)=>!d.hasProjectile(h,o),onFrame:(h,d)=>{const u=(d-c)/l;if(d<c||u!==Math.floor(u)||u>=i)return;const f=h.fighter,g=(s.speed??.16)*pi(h,.85,1.15)*(s.arc?.62:1),S=i>1&&!s.arc?(u-(i-1)/2)*.012:0;h.match.spawnProjectile(f,{x:f.x+f.facing*.8,y:s.arc?1.7:1.25,vx:f.facing*g,vy:s.arc?.14+.03*h.strength:S,gravity:s.arc?.0085:0,w:.5*a,h:.45*a,hit:Gt(r,{effect:s.effect,knockdown:r>=100,launch:r>=100?.15:void 0}),prop:s.prop,color:s.color,hits:s.hits??1,rehit:7,life:200,homing:s.homing?1:0,tag:o,scale:a})}}}case"rush":{const i=s.hits??1,r=s.damage??110,a=Math.round(r/i),o=10,c=18;return{...n,anim:"charge",prop:s.prop,startup:o,active:c,recovery:20,hitbox:{x:.62,y:1.1,w:.9,h:1.1},hit:Gt(a,{pushback:i>1?.03:.16,hitstun:i>1?18:24,knockdown:i===1&&!!s.launch,launch:i===1&&s.launch?.24:void 0}),finalHit:i>1?{pushback:.18,knockdown:!0,launch:s.launch?.24:.12}:void 0,rehit:i>1?5:void 0,maxHits:i,armor:s.armor?{from:1,to:o+c,hits:1}:void 0,onFrame:(l,h)=>{const d=l.fighter;if(h>=o-2&&h<=o+c){const u=(s.distance??3.4)*pi(l,.8,1.2)/(c+2);d.vx=d.moveConnected?d.facing*.01:d.facing*u}else h>o+c&&(d.vx=0)}}}case"rising":{const i=s.hits??1,r=s.damage??120,a=Math.round(r/i);return{...n,anim:"uppercut",prop:s.prop,startup:4,active:14,recovery:16,airborne:!0,invuln:[{from:1,to:9,kind:"full"}],hitbox:{x:.45,y:1.45,w:.8,h:1.4},hit:Gt(a,{launch:i>1?.16:.26,launchVx:.03,knockdown:!0,hitstun:20}),finalHit:{launch:.26},rehit:i>1?4:void 0,maxHits:i,onFrame:(o,c)=>{if(c===4){const l=o.fighter;l.vy=.3*(s.height??1)*pi(o,.88,1.12),l.vx=l.facing*.04}}}}case"grab":return{...n,anim:"grab",prop:s.prop,startup:6,active:3,recovery:30,throwRange:s.range??1.25,throwDamage:s.damage??170,techable:!1,hit:Gt(s.damage??170,{guard:"unblockable",knockdown:!0,effect:s.effect})};case"counter":{const i=s.window??24,r={id:`${t}c`,name:s.name,kind:"special",anim:"counterStrike",color:s.color,startup:3,active:6,recovery:18,hitbox:{x:.8,y:1.1,w:1.8,h:1.8},hit:Gt(s.damage??140,{knockdown:!0,launch:.2,guard:"mid",spark:"heavy"}),invuln:[{from:1,to:10,kind:"full"}],cancel:["super"]};return{...n,anim:"counterStance",prop:s.prop,startup:3,active:i,recovery:22,counterWindow:{from:3,to:3+i},counterMove:r}}case"buff":{const i={damage:1.3,speed:1.35,defense:.6,armor:2,regen:.45,meter:.35,shield:2,reflect:1,slow:.6};return{...n,anim:"powerup",startup:18,active:1,recovery:16,cooldown:480,onFrame:(r,a)=>{if(a!==18)return;const o=s.duration??(s.buff==="armor"?480:360);r.fighter.addBuff(s.buff,s.value??i[s.buff]??1,o,s.color,r.match)}}}case"heal":return{...n,anim:"powerup",startup:28,active:1,recovery:18,cooldown:600,onFrame:(i,r)=>{if(r!==28)return;const a=(s.amount??80)*pi(i,.8,1.2);i.fighter.heal(a),i.match.emit({t:"buff",fighter:i.fighter.index,kind:"regen",color:s.color})}};case"teleport":{const i=!!s.attack,r=10;return{...n,anim:"vanish",startup:i?18:12,active:i?5:1,recovery:i?16:12,invuln:[{from:1,to:r+4,kind:"full"}],hitbox:i?{x:.7,y:1.2,w:.9,h:1}:void 0,hit:i?Gt(80,{knockdown:!0,launch:.14}):void 0,cooldown:90,onFrame:(a,o)=>{if(o!==r)return;const c=a.fighter,l=a.opponent,h=Math.sign(c.x-l.x)||-c.facing;let d;s.mode==="behind"?d=l.x-h*1.1:s.mode==="front"?d=l.x+h*1.1:d=c.x-c.facing*3.5,d=a.match.clampX(d,c),a.match.emit({t:"teleport",fighter:c.index,fromX:c.x,toX:d,color:s.color}),c.x=d,c.faceToward(l.x)}}}case"wave":{const i=t;return{...n,anim:"stomp",prop:s.prop??"wave",startup:14,active:2,recovery:26,canStart:(r,a)=>!a.hasProjectile(r,i),onFrame:(r,a)=>{if(a!==14)return;const o=r.fighter;r.match.spawnProjectile(o,{x:o.x+o.facing*.8,y:.22,vx:o.facing*(s.speed??.13)*pi(r,.85,1.15),w:.75,h:.42,hit:Gt(s.damage??75,{guard:"low",knockdown:!0,launch:.1}),prop:s.prop??"wave",color:s.color,kind:"wave",life:150,tag:i})}}}case"dive":return{...n,anim:"diveKick",startup:10,active:42,recovery:10,airborne:!0,airOK:!0,hitbox:{x:.45,y:.25,w:.75,h:.65},hit:Gt(s.damage??90,{guard:"overhead",hitstun:20}),onStart:r=>{const a=r.fighter;a.grounded?(a.vy=.27,a.vx=a.facing*.05,a.y=.01):a.vy=Math.max(a.vy,.04)},onFrame:(r,a)=>{const o=r.fighter;a>=10&&!o.moveConnected&&(o.vx=o.facing*.2*pi(r,.85,1.15),o.vy=-.24)},onHit:r=>{r.fighter.bounceOff()}};case"trap":{const i=t;return{...n,anim:"place",prop:s.prop,startup:12,active:1,recovery:18,cooldown:240,onFrame:(r,a)=>{if(a!==12)return;const o=r.fighter;r.match.removeProjectiles(o,i),r.match.spawnProjectile(o,{x:r.match.clampX(o.x+o.facing*pi(r,1.4,2.6),o),y:.3,w:.8,h:.6,hit:Gt(s.damage??60,{guard:"low",effect:s.effect??{stun:50},hitstun:26,pushback:.02}),prop:s.prop,color:s.color,kind:"trap",life:600,durability:99,tag:i,spin:0})}}}case"beam":{const i=s.hits??4,r=s.length??4.2,a=Math.round((s.damage??110)/i);return{...n,anim:"beam",prop:s.prop,startup:16,active:26,recovery:22,onFrame:(o,c)=>{if(c!==16)return;const l=o.fighter;o.match.spawnProjectile(l,{x:l.x+l.facing*(.7+r/2),y:1.3,w:r,h:.6,hit:Gt(a,{hitstun:16,blockstun:12,pushback:.05,effect:s.effect}),prop:s.prop??"sound",color:s.color,kind:"beam",attach:!0,offsetX:.7+r/2,life:26,hits:i,rehit:6,durability:99})}}}case"pull":return{...n,anim:"whip",prop:s.prop,startup:12,active:6,recovery:22,hitbox:{x:2,y:1.2,w:2.8,h:.5},hit:Gt(s.damage??50,{hitstun:36,pushback:0,spark:"special"}),onHit:(i,r)=>{if(r)return;const a=i.fighter,o=i.opponent;o.x=i.match.clampX(a.x+a.facing*.95,o),o.slideVx=0}};case"slam":return{...n,anim:"slamRise",prop:s.prop,startup:20,active:50,recovery:18,airborne:!0,hitbox:{x:.2,y:.3,w:1.3,h:.9},hit:Gt(s.damage??120,{guard:"overhead",knockdown:!0,launch:.14}),onStart:i=>{const r=i.fighter;r.vy=.36,r.y=.01;const a=i.opponent.x-r.x;r.vx=Math.max(-.17,Math.min(.17,a/42))},onLand:i=>{const r=i.fighter;i.match.emit({t:"shake",amount:.25});for(const a of[-1,1])i.match.spawnProjectile(r,{x:r.x+a*.6,y:.18,vx:a*.12,w:.6,h:.35,hit:Gt(35,{guard:"low",hitstun:16}),prop:"wave",color:s.color,kind:"wave",life:24})}};case"rain":{const i=s.count??4;return{...n,anim:"summon",prop:s.prop,startup:18,active:1,recovery:28,cooldown:200,onFrame:(r,a)=>{if(a!==18)return;const o=r.fighter;for(let c=0;c<i;c++)r.match.schedule(c*9,()=>{const l=o.opponent;if(!l)return;const h=l.x+(r.match.rng()-.5)*1.8;r.match.spawnProjectile(o,{x:h,y:7.5,vy:-.2,gravity:.004,w:.6,h:.6,hit:Gt(s.damage??32,{guard:"overhead",hitstun:18,tracking:!0}),prop:s.prop,color:s.color,kind:"rain",life:120})})}}}case"shield":return{...n,anim:"guardUp",startup:8,active:1,recovery:14,cooldown:480,onFrame:(i,r)=>{r===8&&(s.reflect?i.fighter.addBuff("reflect",1,240,s.color,i.match):i.fighter.addBuff("shield",s.hits??2,300,s.color,i.match))}};case"spin":{const i=s.hits??4,r=Math.round((s.damage??100)/i),a=8,o=30;return{...n,anim:"spinKick",startup:a,active:o,recovery:14,airborne:!0,hover:{from:8,to:a+o},hitbox:{x:.25,y:1.15,w:1.5,h:.75},hit:Gt(r,{hitstun:18,pushback:.03}),finalHit:{knockdown:!0,launch:.16,pushback:.15},rehit:7,maxHits:i,onFrame:(c,l)=>{const h=c.fighter;l===3&&(h.vy=.13,h.y=.01),l>=a&&l<=a+o&&(h.vx=h.facing*(s.distance??3)*pi(c,.8,1.2)/o)}}}case"barrage":{const i=s.hits??6,r=Math.round((s.damage??110)/i);return{...n,anim:"flurry",prop:s.prop,startup:6,active:26,recovery:18,hitbox:{x:.72,y:1.3,w:.9,h:.8},hit:Gt(r,{hitstun:16,blockstun:10,pushback:.02}),finalHit:{pushback:.2,knockdown:!0,launch:.14},rehit:4,maxHits:i,motion:[{from:6,to:32,vx:.025}]}}}}const lx={cinematic:"Invincible rush. On hit, a devastating combo.",megabeam:"Invincible full-screen beam.",megarain:"Rains destruction across the arena.",megagrab:"Invincible unblockable super grab.",megaprojectile:"Giant unstoppable projectile."};function Fu(s){return s.desc??lx[s.type]}function cx(s){const e={id:"ult",name:s.name,kind:"super",color:s.color,meterCost:Dh,superFreeze:48,tag:s.type,desc:Fu(s),prop:s.prop};switch(s.type){case"cinematic":return{...e,anim:"charge",startup:6,active:16,recovery:28,invuln:[{from:1,to:14,kind:"full"}],hitbox:{x:.7,y:1.1,w:1.1,h:1.5},hit:Gt(40,{chip:60,blockstun:22,pushback:.2,spark:"super"}),onFrame:(t,n)=>{const i=t.fighter;n>=4&&n<=22?i.vx=i.moveConnected?0:i.facing*.25:i.vx=0},onHit:(t,n)=>{n||t.match.startCinematic(t.fighter,t.opponent,s.damage??380,s.name,s.color,s.prop)}};case"megabeam":return{...e,anim:"beam",startup:12,active:60,recovery:30,invuln:[{from:1,to:14,kind:"full"}],onFrame:(n,i)=>{if(i!==12)return;const r=n.fighter,a=10;n.match.spawnProjectile(r,{x:r.x+r.facing*(.7+11/2),y:1.25,w:11,h:1.1,hit:Gt(Math.round((s.damage??330)/a),{hitstun:16,blockstun:12,chip:8,pushback:.03,spark:"super",tracking:!0}),prop:s.prop??"wave",color:s.color,kind:"mega",attach:!0,offsetX:.7+11/2,life:60,hits:a,rehit:6,durability:999})}};case"megarain":return{...e,anim:"summon",startup:10,active:1,recovery:36,invuln:[{from:1,to:14,kind:"full"}],onFrame:(t,n)=>{if(n!==10)return;const i=t.fighter;for(let r=0;r<14;r++)t.match.schedule(r*5,()=>{const a=i.opponent;a&&t.match.spawnProjectile(i,{x:a.x+(t.match.rng()-.5)*2.4,y:8,vy:-.26,gravity:.004,w:.85,h:.85,hit:Gt(Math.round((s.damage??380)/14),{guard:"overhead",hitstun:20,chip:6,spark:"super",tracking:!0}),prop:s.prop,color:s.color,kind:"rain",life:120,scale:1.6})})}};case"megagrab":return{...e,anim:"grab",startup:3,active:5,recovery:36,invuln:[{from:1,to:9,kind:"full"}],throwRange:1.75,throwDamage:s.damage??400,techable:!1,grabCinematic:{damage:s.damage??400,name:s.name}};case"megaprojectile":return{...e,anim:"cast",startup:14,active:1,recovery:30,invuln:[{from:1,to:16,kind:"full"}],onFrame:(t,n)=>{if(n!==14)return;const i=t.fighter,r=5;t.match.spawnProjectile(i,{x:i.x+i.facing*1.1,y:1.2,vx:i.facing*.15,w:1.5,h:1.5,hit:Gt(Math.round((s.damage??340)/r),{hitstun:18,chip:10,pushback:.04,spark:"super",tracking:!0}),prop:s.prop,color:s.color,kind:"mega",hits:r,rehit:7,durability:999,life:160,scale:3.2})}}}}const Ou={id:"throwExec",name:"Throw",kind:"throw",anim:"throwExec",startup:0,active:0,recovery:44},hx={...Ou,id:"grabExec",anim:"grabExec",kind:"special"},Th=new Map;function ux(s){const e=s.id+(s.boss?":boss":"");let t=Th.get(e);return t||(t={normals:sx(s.style,s.stats.power??1),throw:rx(s.style,s.passive.id==="bouncer"),specials:s.specials.map((n,i)=>ox(n,i)),ultimate:cx(s.ultimate)},Th.set(e,t)),t}function Bu(s){const e=s.stats,t=(e.speed??1)*(s.passive.id==="swift"?1.18:1)*(s.style==="rushdown"?1.1:s.style==="grappler"?.88:1),n=e.weight??1;return{maxHealth:Math.round(fd*(e.health??1)*(s.style==="grappler"?1.08:1)*(s.boss?1.5:1)),walk:.052*t,back:.042*t,dash:.16*t,jumpVy:.3*(e.jump??1),jumpVx:.07*t,gravity:ud*(.94+.06*n),dmgMul:(e.power??1)*(s.boss?1.15:1),defMul:1/(e.defense??1)*(s.passive.id==="thickSkin"?.86:1),meterMul:s.passive.id==="meterBoost"?1.3:1,weight:n}}class Ah{index;def;moves;stats;opponent=null;x=0;y=0;z=0;vx=0;vy=0;slideVx=0;facing=1;state="idle";stateFrame=0;move=null;moveFrame=0;moveStrength=.5;moveHits=0;moveLastHit=-99;moveConnected=!1;moveHitConfirmed=!1;armorLeft=0;fallMove=null;landLag=0;throwBack=!1;throwExec=null;grabbedBy=null;jumpDir=0;airJumps=0;airAttackUsed=!1;dashDir=0;sidestepDir=-1;health;recoverable=0;lastHurtFrame=-999;meter=0;stun=0;juggleCount=0;juggleInvuln=!1;comboHits=0;comboDamage=0;invuln=0;lifelineUsed=!1;koed=!1;pendingDizzy=0;buffs=[];cooldowns=new Map;history=new tx;input=hn;relDir=5;roundsWon=0;flash=0;guarding=!1;hitHigh=!0;lastHitHeavy=!1;knockdownFrames=xa;victoryVariant=0;constructor(e,t){this.index=e,this.def=t,this.moves=ux(t),this.stats=Bu(t),this.health=this.stats.maxHealth}get grounded(){return this.y<=0&&this.vy<=0}get passive(){return this.def.passive.id}get isCrouching(){return!!(this.state==="crouch"||(this.state==="blockstun"||this.state==="hitstun")&&this.relDir===1&&this.grounded||this.state==="attack"&&this.move?.lowProfile)}get actionable(){return this.state==="idle"||this.state==="walkF"||this.state==="walkB"||this.state==="crouch"}resetForRound(e,t){this.x=e,this.y=0,this.z=0,this.vx=this.vy=this.slideVx=0,this.facing=t,this.state="idle",this.stateFrame=0,this.move=null,this.fallMove=null,this.throwExec=null,this.grabbedBy=null,this.health=this.stats.maxHealth,this.recoverable=0,this.stun=0,this.juggleCount=0,this.juggleInvuln=!1,this.comboHits=0,this.comboDamage=0,this.invuln=0,this.buffs=[],this.pendingDizzy=0,this.cooldowns.clear(),this.history.clear(),this.flash=0,this.guarding=!1,this.passive==="deepPockets"&&(this.meter=Math.max(this.meter,50))}setState(e){this.state!==e&&(this.state=e,this.stateFrame=0)}faceToward(e){Math.abs(e-this.x)>.02&&(this.facing=e>this.x?1:-1)}faceOpponent(){this.opponent&&this.faceToward(this.opponent.x)}ctx(e){return{fighter:this,opponent:this.opponent,match:e,move:this.move,strength:this.moveStrength}}recordInput(e){this.input=e,this.relDir=Eh(e.dir,this.facing),this.history.push(this.relDir,e.pressed)}addBuff(e,t,n,i,r){this.buffs=this.buffs.filter(a=>a.kind!==e),this.buffs.push({kind:e,value:t,frames:n,color:i}),r?.emit({t:"buff",fighter:this.index,kind:e,color:i})}buff(e){return this.buffs.find(t=>t.kind===e)}speedMul(){let e=1;const t=this.buff("speed");t&&(e*=t.value);const n=this.buff("slow");return n&&(e*=n.value),e}outgoingMul(e){let t=this.stats.dmgMul;const n=this.buff("damage");return n&&(t*=n.value),this.passive==="rage"&&this.health<this.stats.maxHealth*.3&&(t*=1.25),this.passive==="powerSurge"&&(e==="special"||e==="projectile")&&(t*=1.2),t}incomingMul(e){let t=this.stats.defMul;const n=this.buff("defense");return n&&(t*=n.value),e&&this.passive==="projectileProof"&&(t*=.5),t}heal(e){this.health=Math.min(this.stats.maxHealth,this.health+e),this.recoverable=Math.max(0,this.recoverable-e)}gainMeter(e){this.meter=Math.max(0,Math.min(Bs,this.meter+e*this.stats.meterMul))}takeDamage(e,t,n=!0){const i=Math.max(0,Math.round(e));return this.health-i<=0&&n&&this.passive==="lifeline"&&!this.lifelineUsed&&!t.training?(this.lifelineUsed=!0,this.health=1,this.invuln=50,t.emit({t:"lifeline",fighter:this.index,name:this.def.passive.name}),!0):(this.health=Math.max(0,this.health-i),this.passive==="regen"&&(this.recoverable=Math.min(this.stats.maxHealth*.4,this.recoverable+i*.4)),this.lastHurtFrame=t.frame,!1)}isInvuln(e){if(this.invuln>0||this.throwExec)return!0;switch(this.state){case"knockdown":case"getup":case"ko":case"cinematic":case"thrown":case"intro":case"victory":return!0}if(this.juggleInvuln||this.state==="dash"&&this.dashDir<0&&this.passive==="quickRecovery"&&this.stateFrame<10)return!0;const t=this.move;if(this.state==="attack"&&t?.invuln){for(const n of t.invuln)if(this.moveFrame>=n.from&&this.moveFrame<=n.to&&(n.kind==="full"||n.kind===e))return!0}return!1}isEvading(){return this.state==="sidestep"&&this.stateFrame>=2&&this.stateFrame<=15}canBlock(){if(!this.grounded)return!1;switch(this.state){case"idle":case"walkF":case"walkB":case"crouch":case"blockstun":return!0}return!1}blockOK(e){if(e==="unblockable"||!Q1(this.relDir))return!1;const t=this.relDir===1;return e==="low"?t:e==="overhead"||e==="high"?!t:!0}isCounterable(){const e=this.move;return this.state==="attack"&&!!e&&this.moveFrame<=e.startup+e.active&&e.kind!=="throw"}inCounterWindow(){const e=this.move?.counterWindow;return this.state==="attack"&&!!e&&this.moveFrame>=e.from&&this.moveFrame<=e.to}hasArmor(){if(this.buff("armor"))return!0;const e=this.move;return this.state!=="attack"||!e||this.armorLeft<=0?!1:!!(e.armor&&this.moveFrame>=e.armor.from&&this.moveFrame<=e.armor.to||this.passive==="heavyArmor"&&e.tag==="heavy"&&this.moveFrame<=e.startup+1)}consumeArmor(){const e=this.buff("armor");if(e){e.value-=1,e.value<=0&&(e.frames=0);return}this.armorLeft--}hurtboxes(){switch(this.state){case"knockdown":case"getup":case"ko":case"intro":case"victory":return[]}const e=this.def.look.height,t=.58*Math.min(1.3,this.def.look.build),n=[];!this.grounded||this.state==="air"||this.state==="juggle"||this.state==="fall"?n.push({x:this.x,y:this.y+.95*e,w:t,h:1.3*e}):this.isCrouching?n.push({x:this.x,y:.55*e,w:t+.08,h:1.1*e}):n.push({x:this.x,y:.9*e,w:t,h:1.8*e});const i=this.move;if(this.state==="attack"&&i?.hitbox&&i.kind==="normal"&&this.moveFrame>i.startup){const r=this.worldBox(i.hitbox);n.push({x:r.x-this.facing*r.w*.1,y:r.y,w:r.w*.7,h:r.h*.8})}return n}worldBox(e){return{x:this.x+this.facing*e.x,y:this.y+e.y,w:e.w,h:e.h}}activeHitbox(){const e=this.move;if(this.state!=="attack"||!e?.hitbox||!e.hit)return null;const t=this.moveFrame;return t<=e.startup||t>e.startup+e.active||e.maxHits!==void 0&&this.moveHits>=e.maxHits||this.moveHits>0&&(!e.rehit||t-this.moveLastHit<e.rehit)?null:this.worldBox(e.hitbox)}canUse(e,t){return!(e.meterCost&&this.meter<e.meterCost&&!t.infiniteMeter(this)||(this.cooldowns.get(e.id)??0)>0||e.canStart&&!e.canStart(this,t))}update(e){switch(this.stateFrame++,this.invuln>0&&this.invuln--,this.flash>0&&this.flash--,this.tickBuffs(e),this.state){case"intro":case"victory":case"ko":case"cinematic":case"thrown":return;case"idle":case"walkF":case"walkB":case"crouch":this.neutral(e);return;case"jumpSquat":this.stateFrame>=4&&this.takeoff(e);return;case"air":this.airUpdate(e);return;case"land":this.stateFrame>=this.landLag&&this.toNeutral();return;case"dash":this.dashUpdate();return;case"sidestep":{const t=this.stateFrame/20;this.z=this.sidestepDir*Math.sin(Math.PI*Math.min(1,t))*.9,this.stateFrame>=20&&(this.z=0,this.toNeutral());return}case"attack":this.attackUpdate(e);return;case"hitstun":case"blockstun":case"dizzy":this.stun--,this.stun<=0&&this.toNeutral();return;case"knockdown":this.stateFrame>=this.knockdownFrames&&this.setState("getup");return;case"getup":this.stateFrame>=pd&&(this.faceOpponent(),this.toNeutral());return;case"fall":case"juggle":return}}tickBuffs(e){if(this.buffs.length){for(const t of this.buffs)t.frames--,t.kind==="regen"&&this.heal(t.value),t.kind==="meter"&&this.gainMeter(t.value);this.buffs=this.buffs.filter(t=>t.frames>0)}if(this.cooldowns.size)for(const[t,n]of this.cooldowns)n<=1?this.cooldowns.delete(t):this.cooldowns.set(t,n-1);if(this.passive==="regen"&&this.recoverable>0&&e.frame-this.lastHurtFrame>90&&this.health>0){const t=Math.min(this.recoverable,.35);this.health=Math.min(this.stats.maxHealth,this.health+t),this.recoverable-=t}}toNeutral(){this.move=null,this.fallMove=null,this.throwExec=null,this.comboHits=0,this.comboDamage=0,this.juggleCount=0,this.juggleInvuln=!1,this.airAttackUsed=!1,this.airJumps=0,this.stun=0,this.z=0,this.grounded?(this.vx=0,this.setState(Ts(this.relDir)?"crouch":"idle")):this.setState("air")}neutral(e){if(this.faceOpponent(),this.relDir=Eh(this.input.dir,this.facing),this.tryAttack(e,!1))return;const t=this.relDir,n=this.history;if(n.buffered(de.SS,3)){n.consume(de.SS,3),this.sidestepDir=Ts(t)?1:-1,this.setState("sidestep");return}if(n.dash(!0)){this.dashDir=1,this.setState("dash");return}if(n.dash(!1)){this.dashDir=-1,this.setState("dash");return}if(oo(t)){this.jumpDir=t===9?1:t===7?-1:0,this.setState("jumpSquat");return}if(Ts(t)){this.setState("crouch"),this.guarding=!1;return}if(t===6){this.setState("walkF"),this.guarding=!1;return}if(t===4){this.setState("walkB"),this.guarding=e.isThreatened(this);return}this.guarding=!1,this.setState("idle")}takeoff(e){this.vy=this.stats.jumpVy,this.y=.001,this.vx=this.jumpDir*this.stats.jumpVx*this.facing*this.speedMul(),this.airAttackUsed=!1,this.airJumps=0,this.setState("air"),e.emit({t:"jump",fighter:this.index})}airUpdate(e){if(!this.airAttackUsed&&this.tryAttack(e,!0)){this.airAttackUsed=!0;return}if(this.passive==="doubleJump"&&this.airJumps<1&&this.stateFrame>6){const t=this.history.dirs,n=t.length;if(n>=2&&oo(t[n-1])&&!oo(t[n-2])){this.airJumps++;const i=t[n-1]===9?1:t[n-1]===7?-1:0;this.vy=this.stats.jumpVy*.85,this.vx=i*this.stats.jumpVx*this.facing,e.emit({t:"jump",fighter:this.index})}}}dashUpdate(){const e=this.dashDir>0?16:20,t=this.stateFrame/e;this.vx=this.facing*this.dashDir*this.stats.dash*this.speedMul()*Math.sin(Math.PI*Math.min(1,t))*(this.dashDir>0?1:.8),this.stateFrame>=e&&(this.vx=0,this.toNeutral())}pickSpecial(e){const t=this.history,n=this.relDir;let i=-1,r=.5;if(t.buffered(de.SP))i=Ts(n)?2:j1(n)?1:0;else{const o=t.buffered(ho),c=t.buffered(Lh);o&&t.motion("dp")?(i=2,r=o&de.HP?1:0):o&&t.motion("qcf")?(i=0,r=o&de.HP?1:0):c&&t.motion("qcb")&&(i=1,r=c&de.HK?1:0)}if(i<0)return null;const a=this.moves.specials[i];return e&&!a.airOK?null:[a,r]}pickNormal(e){const t=this.history.buffered(ms);if(!t)return null;const n=this.relDir;return e?t&de.HK?"jRoundhouse":t&de.HP?"jStrong":t&de.LK?"jShort":"jJab":Ts(n)?t&de.HK?"sweep":t&de.HP?"cStrong":t&de.LK?"cShort":"cJab":n===6&&t&de.HP?"overhead":t&de.HK?"roundhouse":t&de.HP?"strong":t&de.LK?"short":"jab"}wantsThrow(){const e=this.history;return e.buffered(de.TH)!==0||e.pressedTogether(de.LP,de.LK)}tryUltimate(e){const t=this.history,n=this.moves.ultimate;return this.meter<Dh&&!e.infiniteMeter(this)?!1:(t.buffered(de.UL)||t.buffered(ho)&&t.motion("dqcf"))&&this.canUse(n,e)?(t.consume(de.UL|ms|de.SP),this.startMove(n,1,e),!0):!1}trySpecial(e,t){const n=this.pickSpecial(t);if(!n)return!1;const[i,r]=n;return this.canUse(i,e)?(this.history.consume(ms|de.SP),this.startMove(i,r,e),!0):!1}tryAttack(e,t){if(!t&&this.tryUltimate(e)||this.trySpecial(e,t))return!0;if(!t&&this.wantsThrow())return this.history.consume(de.TH|de.LP|de.LK),this.throwBack=this.relDir===4||this.relDir===1||this.relDir===7,this.startMove(this.moves.throw,.5,e),!0;const n=this.pickNormal(t);return n?(this.history.consume(ms),this.startMove(this.moves.normals[n],.5,e),!0):!1}startMove(e,t,n){this.move=e,this.moveFrame=0,this.moveStrength=t,this.moveHits=0,this.moveLastHit=-99,this.moveConnected=!1,this.moveHitConfirmed=!1,this.fallMove=null,this.armorLeft=e.armor?.hits??(this.passive==="heavyArmor"&&e.tag==="heavy"?1:0),this.guarding=!1,this.setState("attack"),this.stateFrame=0,e.meterCost&&!n.infiniteMeter(this)&&(this.meter-=e.meterCost),e.cooldown&&this.cooldowns.set(e.id,e.cooldown),this.grounded&&!e.air&&(this.vx=0),e.superFreeze?n.superFlash(this,e):e.kind==="special"?(n.emit({t:"special",fighter:this.index,name:e.name,color:e.color??16777215}),this.gainMeter(2)):(e.kind==="normal"||e.kind==="throw")&&n.emit({t:"whiff",fighter:this.index,heavy:e.tag==="heavy"}),e.onStart?.(this.ctx(n))}attackUpdate(e){const t=this.move;if(!t){this.toNeutral();return}this.moveFrame++;const n=this.moveFrame;if(!t.airborne&&!t.air&&this.grounded&&(this.vx=0),t.motion)for(const r of t.motion)n>=r.from&&n<=r.to&&(r.vx!==void 0&&(this.vx=this.facing*r.vx),r.vy!==void 0&&(this.vy=r.vy));if(t.onFrame?.(this.ctx(e),n),this.move!==t)return;if(n<=2&&(t.id==="jab"||t.id==="short")&&this.history.pressedTogether(de.LP,de.LK)){this.history.consume(de.LP|de.LK),this.throwBack=this.relDir===4,this.startMove(this.moves.throw,.5,e);return}if(t.throwRange&&!this.throwExec&&n>t.startup&&n<=t.startup+t.active&&(e.tryGrab(this,t),this.move!==t)||this.moveConnected&&n>=t.startup&&this.tryCancel(e,t))return;const i=t.startup+t.active+t.recovery;if(t.airborne){n>=t.startup+t.active&&!this.grounded?(this.fallMove=t,this.landLag=t.recovery,this.move=null,this.setState("fall")):n>=i&&this.endMove(e);return}n>=i&&this.endMove(e)}tryCancel(e,t){if(t.kind==="normal"){if(t.cancel?.includes("super")&&this.tryUltimate(e)||t.cancel?.includes("special")&&this.trySpecial(e,!!t.air))return!0;if(t.chain){const n=this.pickNormal(!!t.air);if(n&&t.chain.includes(n))return this.history.consume(ms),this.startMove(this.moves.normals[n],.5,e),!0}}else if(t.kind==="special"&&this.moveHitConfirmed&&t.cancel?.includes("super")&&this.tryUltimate(e))return!0;return!1}endMove(e){const t=this.move;t?.onEnd&&t.onEnd(this.ctx(e)),this.move=null,this.throwExec=null,this.grounded?this.toNeutral():(this.setState(t?.air?"air":"fall"),t?.air&&(this.airAttackUsed=!0),this.landLag=4)}bounceOff(){this.move&&(this.fallMove=null,this.landLag=6,this.move=null),this.vx=-this.facing*.07,this.vy=.16,this.setState("fall")}enterHitstun(e,t,n){this.move=null,this.fallMove=null,this.throwExec=null,this.stun=Math.max(1,Math.round(e*(this.passive==="ironWill"?.85:1))),this.hitHigh=t,this.lastHitHeavy=n,this.guarding=!1,this.state="hitstun",this.stateFrame=0}enterBlockstun(e){this.stun=e,this.guarding=!0,this.state="blockstun",this.stateFrame=0}enterJuggle(e,t){this.move=null,this.fallMove=null,this.throwExec=null,this.juggleCount++,this.juggleCount>5&&(this.juggleInvuln=!0),this.vy=e,this.vx=t,this.slideVx=0,this.y<=0&&(this.y=.01),this.state="juggle",this.stateFrame=0}enterDizzy(e){this.move=null,this.stun=e,this.state="dizzy",this.stateFrame=0}physics(e){if(this.state==="thrown"||this.state==="cinematic")return;const t=this.speedMul();switch(this.state){case"walkF":this.vx=this.facing*this.stats.walk*t;break;case"walkB":this.vx=this.guarding?0:-this.facing*this.stats.back*t;break;case"idle":case"crouch":case"land":case"blockstun":case"hitstun":case"dizzy":case"knockdown":case"getup":case"jumpSquat":case"sidestep":case"intro":case"victory":this.grounded&&(this.vx=0);break}if(this.x+=this.vx+this.slideVx,this.grounded?(this.slideVx*=.82,Math.abs(this.slideVx)<.002&&(this.slideVx=0)):this.slideVx*=.95,this.y>0||this.vy>0){const n=this.move;n?.hover&&this.state==="attack"&&this.moveFrame>=n.hover.from&&this.moveFrame<=n.hover.to?this.vy=0:this.vy-=this.stats.gravity,this.y+=this.vy,this.y<=0&&(this.y=0,this.land(e))}}land(e){const t=this.vy;switch(this.vy=0,this.y=0,this.state){case"air":this.vx=0,this.landLag=3,this.faceOpponent(),this.setState("land"),e.emit({t:"land",fighter:this.index,hard:!1});break;case"attack":{const n=this.move;if(this.vx=0,n?.airborne){if(this.moveFrame<=2)break;n.onLand?.(this.ctx(e)),this.landLag=n.recovery}else this.landLag=n?.air?4:2;this.move=null,this.faceOpponent(),this.setState("land"),e.emit({t:"land",fighter:this.index,hard:!1});break}case"fall":{this.vx=0;const n=this.fallMove;n?.onLand&&(this.move=n,n.onLand(this.ctx(e)),this.move=null),this.fallMove=null,this.faceOpponent(),this.setState("land"),e.emit({t:"land",fighter:this.index,hard:!1});break}case"juggle":this.vx=0,this.slideVx=-this.facing*.03,this.koed?this.setState("ko"):this.pendingDizzy>0?(this.enterDizzy(this.pendingDizzy),this.pendingDizzy=0):(this.knockdownFrames=this.passive==="quickRecovery"?Math.round(xa/2):xa,this.setState("knockdown")),e.emit({t:"land",fighter:this.index,hard:!0}),e.emit({t:"shake",amount:Math.min(.2,Math.abs(t)*.5)});break;case"ko":this.vx=0,e.emit({t:"land",fighter:this.index,hard:!0});break;default:this.vx=0}}}let dx=1;class fx{id=dx++;owner;x;y;vx;vy;w;h;hit;prop;color;kind;hitsLeft;rehit;durability;life;age=0;gravity;attach;offsetX;homing;delay;scale;spin;tag;facing;lastHitAge=-999;dead=!1;reflected=!1;onHit;constructor(e,t){this.owner=e,this.x=t.x,this.y=t.y,this.vx=t.vx??0,this.vy=t.vy??0,this.w=t.w,this.h=t.h,this.hit=t.hit,this.prop=t.prop,this.color=t.color,this.kind=t.kind??"normal",this.hitsLeft=t.hits??1,this.rehit=t.rehit??8,this.durability=t.durability??this.hitsLeft,this.life=t.life??240,this.gravity=t.gravity??0,this.attach=!!t.attach,this.offsetX=t.offsetX??0,this.homing=t.homing??0,this.delay=t.delay??0,this.scale=t.scale??1,this.spin=t.spin??.2,this.tag=t.tag,this.facing=e.facing,this.onHit=t.onHit}get active(){return!this.dead&&this.age>=this.delay}update(e){if(this.age++,!(this.age<this.delay)){if(this.attach){const t=this.owner;this.x=t.x+t.facing*this.offsetX,this.facing=t.facing,(t.state==="hitstun"||t.state==="juggle"||t.state==="knockdown"||t.state==="thrown")&&(this.dead=!0)}else{if(this.homing>0&&e){const t=e.y+1;this.vy+=Math.sign(t-this.y)*this.homing*.01,this.vy=Math.max(-.08,Math.min(.08,this.vy))}this.vy-=this.gravity,this.x+=this.vx,this.y+=this.vy,this.kind==="rain"&&this.y<.2&&(this.dead=!0),this.gravity>0&&this.y<.15&&this.kind!=="rain"&&(this.dead=!0)}this.age>=this.life+this.delay&&(this.dead=!0),Math.abs(this.x)>16&&(this.dead=!0)}}box(){return{x:this.x,y:this.y,w:this.w,h:this.h}}}function Hu(s,e){return Math.abs(s.x-e.x)*2<s.w+e.w&&Math.abs(s.y-e.y)*2<s.h+e.h}function lo(s,e){for(const t of e)if(Hu(s,t))return t;return null}function Ch(s,e,t){return s.hitstop!==void 0?s.hitstop:t?e==="super"?5:7:e==="super"?12:s.spark==="heavy"?10:e==="special"?11:7}class px{fighters;projectiles=[];events=[];config;frame=0;ticks=0;phase="intro";phaseFrame=0;round=1;timer=0;hitstop=0;freeze=0;freezeOwner=null;slowmo=0;cinematic=null;roundWinner=null;matchWinner=null;perfect=!1;paused=!1;scheduled=[];seed;constructor(e){this.config=e,this.seed=e.seed??Math.random()*2**31|0;const t=new Ah(0,e.p1),n=new Ah(1,e.p2);t.opponent=n,n.opponent=t,this.fighters=[t,n],t.victoryVariant=this.rngInt(3),n.victoryVariant=this.rngInt(3),this.placeFighters(),this.timer=e.roundTime*60,e.training||e.skipIntro?(this.startRound(),e.training&&(this.phase="fight",this.phaseFrame=0)):(this.phase="intro",t.state="intro",n.state="intro")}get training(){return!!this.config.training}infiniteMeter(e){return!!this.config.training?.infiniteMeter&&e.index>=0}rng(){let e=this.seed+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}rngInt(e){return Math.floor(this.rng()*e)}emit(e){this.events.push(e),this.events.length>400&&this.events.splice(0,this.events.length-400)}drainEvents(){const e=this.events;return this.events=[],e}schedule(e,t){this.scheduled.push({at:this.frame+e,fn:t})}clampX(e,t){const n=va-.35;return Math.max(-n,Math.min(n,e))}spawnProjectile(e,t){const n=new fx(e,t);return this.projectiles.push(n),this.emit({t:"projectile",id:n.id,owner:e.index}),n}hasProjectile(e,t){return this.projectiles.some(n=>n.owner===e&&n.tag===t&&!n.dead)}removeProjectiles(e,t){for(const n of this.projectiles)n.owner===e&&n.tag===t&&(n.dead=!0)}superFlash(e,t){this.freeze=t.superFreeze??40,this.freezeOwner=e,this.emit({t:"superFlash",fighter:e.index,name:t.name,color:t.color??16763904}),this.emit({t:"rumble",fighter:e.index,strong:.4,weak:.8,ms:400})}isThreatened(e){const t=e.opponent,n=Math.abs(t.x-e.x);if(t.state==="attack"&&t.move&&n<3.4&&t.moveFrame<=t.move.startup+t.move.active)return!0;for(const i of this.projectiles)if(i.owner===t&&!i.dead&&Math.abs(i.x-e.x)<3.8&&Math.sign(e.x-i.x)===Math.sign(i.vx||i.facing)||i.owner===t&&i.kind==="rain"&&Math.abs(i.x-e.x)<1.5)return!0;return!1}placeFighters(){const[e,t]=this.fighters;e.resetForRound(-2.1,1),t.resetForRound(2.1,-1)}skipIntro(){this.phase==="intro"&&this.startRound()}startRound(){this.phase="roundStart",this.phaseFrame=0,this.timer=this.config.roundTime*60,this.projectiles=[],this.scheduled=[],this.cinematic=null,this.hitstop=0,this.freeze=0,this.slowmo=0,this.roundWinner=null,this.perfect=!1,this.placeFighters();for(const e of this.fighters)e.koed=!1}resetPositions(){this.placeFighters(),this.projectiles=[],this.scheduled=[],this.cinematic=null;for(const e of this.fighters)e.koed=!1,this.config.training?.infiniteMeter&&(e.meter=Bs)}tick(e){if(this.ticks++,this.paused)return;const t=this.phase==="fight";if(this.fighters[0].recordInput(t?e[0]:hn),this.fighters[1].recordInput(t?e[1]:hn),this.hitstop>0){this.hitstop--;return}if(this.freeze>0){this.freeze--,this.freeze===0&&(this.freezeOwner=null);return}this.slowmo>0&&(this.slowmo--,this.slowmo%2===1)||(this.phaseFrame++,this.simulate(),this.phaseLogic())}simulate(){if(this.frame++,this.scheduled.length){const e=this.scheduled.filter(t=>t.at<=this.frame);this.scheduled=this.scheduled.filter(t=>t.at>this.frame);for(const t of e)t.fn()}this.cinematic&&this.updateCinematic();for(const e of this.fighters)e.update(this);this.updateThrows();for(const e of this.fighters)e.physics(this);this.resolvePush(),this.updateProjectiles(),this.phase==="fight"&&this.detectHits(),this.config.training&&this.trainingUpkeep()}phaseLogic(){const[e,t]=this.fighters;switch(this.phase){case"intro":this.phaseFrame>=200&&this.startRound();break;case"roundStart":{if(this.phaseFrame===1){const n=e.roundsWon===this.config.roundsToWin-1&&t.roundsWon===this.config.roundsToWin-1;this.emit({t:"round",n:this.round}),this.emit({t:"announce",text:n?"FINAL ROUND":`ROUND ${this.round}`,big:!0,frames:60})}this.phaseFrame===66&&(this.emit({t:"fight"}),this.emit({t:"announce",text:"FIGHT!",big:!0,frames:45})),this.phaseFrame>=76&&(this.phase="fight",this.phaseFrame=0);break}case"fight":{if(this.config.roundTime>0&&!this.training&&!this.cinematic&&(this.timer--,this.timer<=0)){this.timeout();break}if(this.cinematic)break;const n=this.fighters.filter(i=>i.health<=0);n.length&&this.ko(n);break}case"ko":{if(this.phaseFrame===110)for(const n of this.fighters)!n.koed&&this.roundWinner===n.index&&(n.move=null,n.throwExec=null,n.faceOpponent(),n.grounded&&n.setState("victory"));if(this.phaseFrame>110)for(const n of this.fighters)!n.koed&&this.roundWinner===n.index&&n.state!=="victory"&&n.grounded&&n.actionable&&n.setState("victory");this.phaseFrame>=200&&this.endRound();break}case"roundEnd":this.phaseFrame>=30&&(this.round++,this.startRound());break}}ko(e){this.phase="ko",this.phaseFrame=0,this.slowmo=70;for(const n of e)n.koed=!0,n.state!=="juggle"&&n.enterJuggle(.17,-n.facing*.07);this.roundWinner=e.length===2?-1:1-e[0].index;const t=this.roundWinner>=0?this.fighters[this.roundWinner]:null;this.perfect=!!t&&t.health>=t.stats.maxHealth,this.emit({t:"ko",loser:e.length===2?-1:e[0].index,perfect:this.perfect}),this.emit({t:"announce",text:e.length===2?"DOUBLE K.O.":"K.O.",big:!0,frames:100}),this.emit({t:"shake",amount:.35});for(const n of this.fighters)this.emit({t:"rumble",fighter:n.index,strong:1,weak:1,ms:600})}timeout(){this.phase="ko",this.phaseFrame=0;const[e,t]=this.fighters,n=e.health/e.stats.maxHealth,i=t.health/t.stats.maxHealth;this.roundWinner=Math.abs(n-i)<1e-6?-1:n>i?0:1,this.perfect=!1;for(const r of this.fighters)(r.state==="attack"||r.state==="dash"||r.state==="walkF"||r.state==="walkB")&&(r.move=null,r.grounded&&r.setState("idle"));this.emit({t:"timeout"}),this.emit({t:"announce",text:"TIME",big:!0,frames:100})}endRound(){const[e,t]=this.fighters;this.roundWinner===-1?(e.roundsWon++,t.roundsWon++):this.roundWinner!==null&&this.fighters[this.roundWinner].roundsWon++;const n=this.config.roundsToWin,i=e.roundsWon>=n,r=t.roundsWon>=n;if(i||r){this.matchWinner=i&&r?-1:i?0:1,this.phase="matchEnd",this.phaseFrame=0;const a=this.matchWinner>=0?this.fighters[this.matchWinner]:null;this.emit({t:"announce",text:a?`${a.def.name.toUpperCase()} WINS`:"DRAW GAME",big:!0,frames:150}),a&&(a.move=null,a.faceOpponent(),a.grounded&&a.setState("victory"))}else this.phase="roundEnd",this.phaseFrame=0}trainingUpkeep(){const e=this.config.training;for(const t of this.fighters)e.infiniteMeter&&(t.meter=Bs),e.infiniteHealth&&(t.health<=0&&(t.health=1),t.actionable&&t.stateFrame>40&&t.health<t.stats.maxHealth&&(t.health=t.stats.maxHealth)),t.koed&&(t.koed=!1)}resolvePush(){const[e,t]=this.fighters,n=va-.35;for(const f of this.fighters)f.x=Math.max(-n,Math.min(n,f.x));const i=t.x-e.x;if(Math.abs(i)>tc){const f=Math.abs(i)-tc,g=Math.sign(i),S=Math.sign(e.vx+e.slideVx)===-g,p=Math.sign(t.vx+t.slideVx)===g;S&&!p?e.x+=g*f:p&&!S?t.x-=g*f:(e.x+=g*f/2,t.x-=g*f/2)}const r=f=>f.state==="thrown"||f.state==="cinematic"||f.koed&&f.state==="ko";if(r(e)||r(t))return;const a=e.y+(e.isCrouching?1.1:1.7),o=t.y+(t.isCrouching?1.1:1.7);if(e.y>=o-.25||t.y>=a-.25)return;const c=t.x-e.x,l=dd-Math.abs(c);if(l<=0)return;let h=Math.sign(c);h===0&&(h=e.facing);let d=l/2,u=l/2;e.x-h*d<-n||e.x-h*d>n?(u=l,d=0):(t.x+h*u<-n||t.x+h*u>n)&&(d=l,u=0),e.x-=h*d,t.x+=h*u,e.x=Math.max(-n,Math.min(n,e.x)),t.x=Math.max(-n,Math.min(n,t.x))}atWall(e){return Math.abs(e.x)>=va-.4}tryGrab(e,t){const n=e.opponent;if(!n.grounded||n.y>.05||n.isInvuln("throw"))return;switch(n.state){case"hitstun":case"blockstun":case"juggle":case"knockdown":case"getup":case"thrown":case"jumpSquat":return}if(n.isEvading())return;const i=Math.abs(n.x-e.x);if(!(i>(t.throwRange??1))&&!(i>.3&&Math.sign(n.x-e.x)!==e.facing)){if(t.grabCinematic){this.startCinematic(e,n,t.grabCinematic.damage,t.grabCinematic.name,t.color??16763904,t.prop);return}e.throwExec={target:n,frame:0,total:44,damage:(t.throwDamage??120)*e.outgoingMul(t.kind),techable:!!t.techable,back:t.kind==="throw"&&e.throwBack,move:t},e.move=t.kind==="throw"?Ou:hx,e.moveFrame=0,e.stateFrame=0,n.move=null,n.throwExec=null,n.setState("thrown"),n.grabbedBy=e,n.guarding=!1,this.emit({t:"sfx",name:"grab"}),t.kind!=="throw"&&this.emit({t:"special",fighter:e.index,name:t.name,color:t.color??16777215})}}updateThrows(){for(const e of this.fighters){const t=e.throwExec;if(!t)continue;const n=t.target;if(n.state!=="thrown"){e.throwExec=null;continue}if(t.frame++,n.x=this.clampX(e.x+e.facing*.72),n.y=.12+Math.sin(Math.min(1,t.frame/26)*Math.PI)*.35,n.vx=n.vy=0,n.facing=-e.facing,t.techable&&t.frame<=sr){const i=n.history;if(i.buffered(de.TH,sr)||i.pressedTogether(de.LP,de.LK,sr)){i.consume(de.TH|de.LP|de.LK,sr),e.throwExec=null,e.move=null,n.grabbedBy=null,n.y=0,e.enterBlockstun(14),n.enterBlockstun(14),e.slideVx=-e.facing*.16,n.slideVx=e.facing*.16,this.emit({t:"tech",x:(e.x+n.x)/2,y:1.2}),this.emit({t:"announce",text:"TECH!",frames:30});continue}}if(t.frame===26){let i=e.facing;t.back&&(n.x=this.clampX(e.x-e.facing*.8),i=-e.facing);const r=t.damage*n.incomingMul(!1);n.grabbedBy=null,n.y=.3,n.state="juggle",n.takeDamage(r,this),n.comboHits++;const a=t.move.hit?.effect;if(a?.drain){const o=Math.min(n.meter,a.drain);n.meter-=o,e.gainMeter(o)}a?.lifesteal&&e.heal(a.lifesteal),n.enterJuggle(.2,i*.11),a?.stun&&n.health>0&&(n.pendingDizzy=a.stun),e.gainMeter(12),n.gainMeter(6),this.hitstop=Math.max(this.hitstop,10),n.flash=10,this.emit({t:"hit",x:n.x,y:1,spark:"heavy",blocked:!1,counter:!1,attacker:e.index,defender:n.index,damage:Math.round(r),color:t.move.color}),this.emit({t:"shake",amount:.2}),this.emit({t:"rumble",fighter:n.index,strong:.9,weak:.5,ms:250}),e.throwExec=null}}}startCinematic(e,t,n,i,r,a){for(const o of this.projectiles)o.owner===t&&(o.dead=!0);e.move=null,e.throwExec=null,e.fallMove=null,e.vx=e.vy=e.slideVx=0,e.y=0,e.setState("cinematic"),t.move=null,t.throwExec=null,t.grabbedBy=null,t.vx=t.vy=t.slideVx=0,t.y=0,t.setState("cinematic"),t.x=this.clampX(e.x+e.facing*.95),Math.abs(t.x-e.x)<.9&&(e.x=this.clampX(t.x-e.facing*.95)),t.facing=-e.facing,this.cinematic={att:e,def:t,frame:0,total:104,hits:8,damage:n,name:i,color:r,prop:a,scale:Math.max(.5,ic(t.comboHits+1))},this.emit({t:"sfx",name:"cinematic"})}updateCinematic(){const e=this.cinematic;e.frame++;const{att:t,def:n}=e;t.stateFrame=e.frame,n.stateFrame=e.frame;const i=11;if(e.frame%i===0&&e.frame/i<=e.hits){const r=e.frame/i,a=r===e.hits,o=e.damage/e.hits*t.outgoingMul("super")*n.incomingMul(!1)*e.scale*(a?1.4:.943);n.comboHits++,n.takeDamage(o,this,a),n.flash=8,this.emit({t:"hit",x:n.x-n.facing*.2,y:.9+r*37%7/10,spark:a?"super":"heavy",blocked:!1,counter:!1,attacker:t.index,defender:n.index,damage:Math.round(o),color:e.color}),this.emit({t:"shake",amount:a?.3:.08}),this.emit({t:"rumble",fighter:n.index,strong:a?1:.5,weak:.4,ms:a?400:90}),a&&(this.hitstop=14)}e.frame>=e.total&&(this.cinematic=null,t.state="idle",t.toNeutral(),n.state="idle",n.enterJuggle(.3,t.facing*.1),n.juggleInvuln=!0,t.gainMeter(0))}detectHits(){const[e,t]=this.fighters,n=e.activeHitbox(),i=t.activeHitbox(),r=e.hurtboxes(),a=t.hurtboxes(),o=n?lo(n,a):null,c=i?lo(i,r):null;o&&n&&this.strike(e,t,n,o),c&&i&&this.strike(t,e,i,c)}strike(e,t,n,i){const r=e.move;if(!r?.hit)return;let a=r.hit;(r.maxHits??1)>1&&r.finalHit&&e.moveHits+1>=(r.maxHits??1)&&(a={...a,...r.finalHit});const c=(Math.max(n.x-n.w/2,i.x-i.w/2)+Math.min(n.x+n.w/2,i.x+i.w/2))/2,l=Math.max(Math.min(n.y,i.y+i.h/2-.1),i.y-i.h/2+.1),h=this.resolveHit(e,t,a,{kind:r.kind,x:c,y:l});h!=="miss"&&(e.moveHits++,e.moveLastHit=e.moveFrame,h!=="counter"&&(e.moveConnected=!0,(h==="hit"||h==="armor")&&(e.moveHitConfirmed=!0),e.move===r&&r.onHit?.(e.ctx(this),h==="block"||h==="absorb")))}triggerCounter(e,t){const n=e.move.counterMove;t.move=null,t.enterHitstun(34,!0,!0),t.flash=6,e.faceOpponent(),e.startMove(n,.5,this),this.hitstop=Math.max(this.hitstop,12),this.emit({t:"counterHit",fighter:e.index}),this.emit({t:"announce",text:"COUNTER!",frames:40}),this.emit({t:"hit",x:(t.x+e.x)/2,y:1.3,spark:"special",blocked:!0,counter:!0,attacker:e.index,defender:t.index,damage:0,color:n.color})}resolveHit(e,t,n,i){const r=i.projectile,a=!!r;if(t.isInvuln(a?"projectile":"strike")||t.isEvading()&&!n.tracking)return"miss";if(t.inCounterWindow()&&t.move?.counterMove)return a?(this.emit({t:"clash",x:i.x,y:i.y}),"absorb"):(this.triggerCounter(t,e),"counter");if(a&&t.buff("reflect")&&r.kind!=="mega"&&r.kind!=="beam")return r.owner=t,r.vx=-r.vx,r.facing=-r.facing,r.reflected=!0,r.age=0,r.lastHitAge=-999,this.emit({t:"clash",x:i.x,y:i.y}),this.emit({t:"sfx",name:"reflect"}),"reflect";const o=t.buff("shield");if(o)return o.value--,o.value<=0&&(o.frames=0),this.hitstop=Math.max(this.hitstop,6),this.emit({t:"hit",x:i.x,y:i.y,spark:"light",blocked:!0,counter:!1,attacker:e.index,defender:t.index,damage:0,color:o.color}),this.emit({t:"sfx",name:"shield"}),"absorb";const c=a?Math.sign(r.vx)||r.facing:Math.sign(t.x-e.x)||e.facing,l=a?r.kind==="mega"?"super":"projectile":i.kind,h=n.spark==="heavy"||n.spark==="super"||n.spark==="special";if(t.canBlock()&&t.blockOK(n.guard)){let b=n.chip??0;return e.passive==="chipMaster"&&(b=Math.max(b*3,n.damage*.12)),b>0&&t.takeDamage(b*e.outgoingMul(l==="projectile"?"projectile":i.kind)*t.incomingMul(a),this),t.enterBlockstun(n.blockstun),t.slideVx=c*n.pushback*1.15,!a&&this.atWall(t)&&(e.slideVx=-c*n.pushback*.9),e.gainMeter(3),t.gainMeter(3),this.hitstop=Math.max(this.hitstop,Math.max(4,Ch(n,i.kind,a)-3)),this.emit({t:"hit",x:i.x,y:i.y,spark:"light",blocked:!0,counter:!1,attacker:e.index,defender:t.index,damage:0}),this.emit({t:"rumble",fighter:t.index,strong:.15,weak:.3,ms:80}),"block"}const d=!a&&t.isCounterable();let u=n.damage*e.outgoingMul(l);d&&(u*=e.passive==="counterPunch"?1.5:1.2),t.comboHits++;let f=ic(t.comboHits);if(e.passive==="comboMaster"&&(f=Math.max(.4,1-(t.comboHits-1)*.07)),(i.kind==="super"||l==="super")&&(f=Math.max(f,.5)),u=Math.max(1,Math.round(u*f*t.incomingMul(a))),t.hasArmor())return t.consumeArmor(),t.takeDamage(u,this),t.comboHits=Math.max(0,t.comboHits-1),t.flash=8,this.hitstop=Math.max(this.hitstop,8),this.emit({t:"hit",x:i.x,y:i.y,spark:"heavy",blocked:!1,counter:!1,attacker:e.index,defender:t.index,damage:u,color:16755251}),this.emit({t:"sfx",name:"armor"}),"armor";if(t.throwExec){const b=t.throwExec.target;t.throwExec=null,b.grabbedBy=null,b.enterJuggle(.1,-b.facing*.05)}t.comboDamage+=u;const g=t.takeDamage(u,this),S=n.effect;if(S?.drain){const b=Math.min(t.meter,S.drain);t.meter-=b,e.gainMeter(b)}if(e.passive==="drainer"){const b=Math.min(t.meter,4);t.meter-=b}S?.lifesteal&&e.heal(S.lifesteal),e.passive==="vampire"&&e.heal(u*.12),S?.slow&&t.addBuff("slow",.6,S.slow,6719743,this);const p=!t.grounded||t.state==="juggle"||t.state==="air"||t.state==="fall",m=!!n.launch&&(i.kind!=="normal"||p),M=Math.sqrt(t.stats.weight);if(g)t.enterJuggle(.2,c*.08);else if(t.health<=0)t.enterJuggle(Math.max(.2,n.launch??0),c*.08);else if(m)t.enterJuggle((n.launch??.2)/M,c*(n.launchVx??.05));else if(p)t.enterJuggle(.13,c*.05);else if(n.knockdown)t.enterJuggle(.12,c*.045);else if(S?.stun)t.enterDizzy(S.stun),t.slideVx=c*n.pushback;else{const b=i.y>1;t.enterHitstun(n.hitstun+(d?4:0),b,h),t.slideVx=c*n.pushback/M,!a&&this.atWall(t)&&(e.slideVx=-c*n.pushback*.9)}e.gainMeter((n.meterGain??5)+u*.03),t.gainMeter(u*.05),this.hitstop=Math.max(this.hitstop,Ch(n,i.kind,a)+(d?3:0)),t.flash=5;const T=n.spark??"light";this.emit({t:"hit",x:i.x,y:i.y,spark:T,blocked:!1,counter:d,attacker:e.index,defender:t.index,damage:u,color:r?.color}),d&&(this.emit({t:"counterHit",fighter:e.index}),this.emit({t:"announce",text:"COUNTER",frames:30}));const _=T==="super"?1:h?.7:.35;return this.emit({t:"rumble",fighter:t.index,strong:_,weak:_*.6,ms:h?200:110}),this.emit({t:"rumble",fighter:e.index,strong:_*.3,weak:_*.5,ms:80}),(h||d)&&this.emit({t:"shake",amount:T==="super"?.22:d?.14:.08}),"hit"}updateProjectiles(){const e=this.projectiles;for(const t of e)t.update(t.owner.opponent);for(let t=0;t<e.length;t++){const n=e[t];if(!(!n.active||n.kind==="trap"))for(let i=t+1;i<e.length;i++){const r=e[i];if(!r.active||r.kind==="trap"||r.owner===n.owner||!Hu(n.box(),r.box()))continue;const a=n.durability;n.durability-=Math.max(1,Math.min(r.durability,3)),r.durability-=Math.max(1,Math.min(a,3)),n.durability<=0&&(n.dead=!0),r.durability<=0&&(r.dead=!0),this.emit({t:"clash",x:(n.x+r.x)/2,y:(n.y+r.y)/2})}}if(this.phase==="fight")for(const t of e){if(!t.active)continue;const n=t.owner.opponent;if(t.kind==="trap"&&!n.grounded||t.age-t.lastHitAge<t.rehit||!lo(t.box(),n.hurtboxes()))continue;let r=t.hit;t.hitsLeft===1&&(t.kind==="mega"||t.durability>1)&&t.hit.damage>0&&(r={...r,knockdown:!0,launch:r.launch??.18});const a=this.resolveHit(t.owner,n,r,{kind:t.kind==="mega"?"super":"special",projectile:t,x:(t.x+n.x)/2,y:Math.max(.3,Math.min(t.y,n.y+1.6))});a==="miss"||a==="reflect"||(t.hitsLeft--,t.lastHitAge=t.age,t.onHit?.(n,a==="block"),(t.hitsLeft<=0||a==="absorb")&&(t.dead=!0))}e.some(t=>t.dead)&&(this.projectiles=e.filter(t=>!t.dead))}}const mx={1:"↙",2:"↓",3:"↘",4:"←",5:"•",6:"→",7:"↖",8:"↑",9:"↗"};class gx{constructor(e,t,n){this.app=e,this.root=Ye("div","hud");const i=Ye("div","top");t.fighters.forEach((a,o)=>{const c=o===0?"l":"r",l=ki[a.def.party],h=Ye("div",`hp-wrap ${c}`);h.innerHTML=`${xi(a.def,"hp-port")}
        <div class="hp-col">
          <div class="hp ${c}"><i class="rec"></i><i class="trail"></i><i class="fill"></i></div>
          <div class="hp-name"><span class="n">${ze(a.def.nick??a.def.name.split(" ").slice(-1)[0])}</span><span class="he">${ze(a.def.nameHe)}</span><span class="chip" style="background:${Js(l.color)}">${ze(l.name)}</span></div>
          <div class="pips"></div>
        </div>`,this.hp[o]=h.querySelector(".fill"),this.trail[o]=h.querySelector(".trail"),this.rec[o]=h.querySelector(".rec"),this.pips[o]=h.querySelector(".pips"),o===0||(this.timer=Ye("div","timer","99"),i.appendChild(this.timer)),i.appendChild(h)}),this.timer=i.querySelector(".timer"),this.root.appendChild(i);const r=Ye("div","bottom");t.fighters.forEach((a,o)=>{const l=Ye("div",`meter-wrap ${o===0?"l":"r"}`);l.innerHTML='<div class="buffs"></div><div class="meter-label">ULTIMATE</div><div class="meter"><i></i></div>',this.meter[o]=l.querySelector(".meter i"),this.meterBar[o]=l.querySelector(".meter"),this.meterLabel[o]=l.querySelector(".meter-label"),this.buffs[o]=l.querySelector(".buffs"),r.appendChild(l)}),this.root.appendChild(r);for(let a=0;a<2;a++){const o=a===0?"l":"r";this.combo[a]=Ye("div",`combo ${o}`,'<div class="n">0</div><div class="t">HITS</div><div class="d"></div>'),this.special[a]=Ye("div",`special-name ${o}`),this.quote[a]=Ye("div",`quote-bubble ${o}`),this.root.append(this.combo[a],this.special[a],this.quote[a])}this.dim=Ye("div","super-dim"),this.banner=Ye("div","super-banner",'<div class="strip"></div><div class="txt"><div class="who"></div><div class="mv"></div></div>'),this.announceEl=Ye("div","announce"),this.flash=Ye("div","flash"),this.root.prepend(this.dim),this.root.append(this.banner,this.announceEl,this.flash),n.training&&(this.training=Ye("div","training-panel panel"),this.root.appendChild(this.training)),(n.inputDisplay||n.training)&&(this.inputDisp=Ye("div","input-disp"),this.root.appendChild(this.inputDisp)),this.renderPips(t)}app;root;hp=[];trail=[];rec=[];meter=[];meterBar=[];meterLabel=[];buffs=[];pips=[];timer;announceEl;announceLeft=0;combo=[];comboHold=[0,0];comboBest=[{hits:0,dmg:0},{hits:0,dmg:0}];special=[];specialLeft=[0,0];banner;bannerLeft=0;dim;flash;quote=[];training=null;inputDisp=null;inputLog=[];lastInput="";lastCombo={hits:0,dmg:0};lastHpText=["",""];lastTicks=-1;renderPips(e){e.fighters.forEach((t,n)=>{let i="";for(let r=0;r<e.config.roundsToWin;r++)i+=`<div class="pip ${r<t.roundsWon?"on":""}"></div>`;this.pips[n].innerHTML=e.training?"":i})}showQuote(e,t,n){this.quote[e].textContent=`“${t}”`,this.quote[e].classList.toggle("show",n)}announce(e,t,n){this.announceEl.className="announce",this.announceEl.offsetWidth,this.announceEl.textContent=e,this.announceEl.className=`announce show ${t?"big":"small"}`,this.announceLeft=n}event(e,t){switch(e.t){case"announce":this.announce(e.text,!!e.big,e.frames??50);break;case"special":this.special[e.fighter].textContent=e.name+"!",this.special[e.fighter].style.color=ll(e.color),this.special[e.fighter].classList.add("show"),this.specialLeft[e.fighter]=70;break;case"superFlash":{const n=t.fighters[e.fighter];this.banner.querySelector(".who").textContent=`${n.def.name.toUpperCase()} · ULTIMATE`;const i=this.banner.querySelector(".mv");i.textContent=e.name,i.style.color=ll(e.color),this.banner.querySelector(".txt").style.textAlign=e.fighter===0?"left":"right",this.banner.classList.add("show"),this.dim.classList.add("show"),this.bannerLeft=52,this.doFlash();break}case"lifeline":this.announce(`${e.name}!`,!1,70),this.doFlash();break;case"ko":this.doFlash();break;case"round":this.renderPips(t);break}}doFlash(){this.flash.classList.remove("go"),this.flash.offsetWidth,this.flash.classList.add("go")}update(e,t){const n=this.lastTicks<0?1:Math.max(0,e.ticks-this.lastTicks);this.lastTicks=e.ticks;for(let i=0;i<n;i++)this.countdown();e.fighters.forEach((i,r)=>{const a=Math.max(0,i.health/i.stats.maxHealth*100),o=`${a.toFixed(2)}%`;this.lastHpText[r]!==o&&(this.hp[r].style.width=o,this.trail[r].style.width=o,this.lastHpText[r]=o),this.hp[r].classList.toggle("low",a<25),this.rec[r].style.width=`${Math.min(100,a+i.recoverable/i.stats.maxHealth*100).toFixed(2)}%`;const c=i.meter/Bs*100;this.meter[r].style.width=`${c}%`;const l=i.meter>=Bs;this.meterBar[r].classList.toggle("full",l),this.meterLabel[r].classList.toggle("full",l),this.meterLabel[r].innerHTML=l?`ULTIMATE READY ${this.app.glyph("UL",r)}`:`ULTIMATE ${Math.floor(c)}%`;const h=i.buffs.map(u=>u.kind.toUpperCase()).join(" · "),d=i.passive==="lifeline"&&!i.lifelineUsed?"♥ "+i.def.passive.name:"";this.buffs[r].textContent=[h,d].filter(Boolean).join("  ")});for(let i=0;i<2;i++){const r=e.fighters[i],a=1-i;r.comboHits>=2&&(this.comboBest[a]={hits:r.comboHits,dmg:r.comboDamage},this.combo[a].innerHTML=`<div class="n">${r.comboHits}</div><div class="t">HITS</div><div class="d">${r.comboDamage} DMG</div>`,this.combo[a].classList.add("show"),this.comboHold[a]=70,a===0&&(this.lastCombo={hits:r.comboHits,dmg:r.comboDamage})),r.comboHits===1&&a===0&&(this.lastCombo={hits:1,dmg:r.comboDamage})}if(e.training||e.config.roundTime===0)this.timer.textContent="∞";else{const i=Math.max(0,Math.ceil(e.timer/60));this.timer.textContent=String(i),this.timer.classList.toggle("low",i<=10)}if(e.phase==="roundStart"&&e.phaseFrame===2&&this.renderPips(e),e.phase==="matchEnd"&&e.phaseFrame===1&&this.renderPips(e),this.training){const i=e.fighters[1],r=e.config.training?.dummy??"stand";this.training.innerHTML=`<b>TRAINING</b><br>Last combo: ${this.lastCombo.hits} hits · ${this.lastCombo.dmg} dmg<br>
        Dummy: ${r.toUpperCase()}<br>Dummy HP: ${Math.round(i.health)} / ${i.stats.maxHealth}<br>
        ${this.app.glyph("SELECT",0)} reset positions · ${this.app.glyph("START",0)} menu`}if(this.inputDisp&&t){const i=t[0],r=[],a=[[de.LP,"LP"],[de.HP,"HP"],[de.LK,"LK"],[de.HK,"HK"],[de.SP,"SP"],[de.UL,"UL"],[de.TH,"TH"],[de.SS,"SS"]];for(const[c,l]of a)i.pressed&c&&r.push(l);const o=`${i.dir}|${r.join("+")}`;o!==this.lastInput&&(i.dir!==5||r.length)&&(this.inputLog.unshift(`<span class="arrow">${mx[i.dir]}</span> ${r.join("+")}`),this.inputLog.length=Math.min(this.inputLog.length,14)),this.lastInput=o,this.inputDisp.innerHTML=this.inputLog.join("<br>")}}countdown(){for(let e=0;e<2;e++)this.specialLeft[e]>0&&--this.specialLeft[e]===0&&this.special[e].classList.remove("show"),this.comboHold[e]>0&&--this.comboHold[e]===0&&this.combo[e].classList.remove("show");this.bannerLeft>0&&--this.bannerLeft===0&&(this.banner.classList.remove("show"),this.dim.classList.remove("show")),this.announceLeft>0&&--this.announceLeft===0&&this.announceEl.classList.add("hide")}destroy(){this.root.remove()}}const vx=[{motion:qr.qcf,btn:"P",dir:""},{motion:qr.qcb,btn:"K",dir:"→ +"},{motion:qr.dp,btn:"P",dir:"↓ +"}];function Ph(s,e,t,n){return e==="P"?`${s.glyph("LP",t,n)}/${s.glyph("HP",t,n)}`:`${s.glyph("LK",t,n)}/${s.glyph("HK",t,n)}`}function zu(s,e,t=0){const n=s.glyphStyle(t)==="kb"&&s.menuStyle()!=="kb"?s.menuStyle():s.glyphStyle(t),i=o=>s.glyph(o,t,n),r=[];r.push('<tr class="hdr"><td colspan="3">SPECIAL MOVES</td></tr>'),e.specials.forEach((o,c)=>{const l=vx[c];r.push(`<tr><td class="mv" style="color:${ll(o.color)}">${ze(o.name)}</td>
      <td class="in"><span class="arrow">${l.motion}</span> + ${Ph(s,l.btn,t,n)}<br><span style="color:var(--muted)">or</span> ${l.dir} ${i("SP")}</td>
      <td class="ds">${ze(Nu(o))}${o.type==="dive"?" Works in the air.":""}</td></tr>`)}),r.push('<tr class="hdr"><td colspan="3">ULTIMATE (FULL METER)</td></tr>'),r.push(`<tr><td class="mv" style="color:var(--gold)">${ze(e.ultimate.name)}</td>
    <td class="in"><span class="arrow">${qr.dqcf}</span> + ${Ph(s,"P",t,n)}<br><span style="color:var(--muted)">or</span> ${i("UL")}</td>
    <td class="ds">${ze(Fu(e.ultimate))}</td></tr>`),r.push('<tr class="hdr"><td colspan="3">PASSIVE ABILITY</td></tr>'),r.push(`<tr><td class="mv">${ze(e.passive.name)}</td><td class="in">Always on</td><td class="ds">${ze(e.passive.desc)}</td></tr>`),r.push('<tr class="hdr"><td colspan="3">UNIVERSAL</td></tr>');const a=[["Throw",`${i("TH")} <span style="color:var(--muted)">or</span> ${i("LP")}+${i("LK")}`,"Close range. Hold ← to throw backwards. Tech by pressing throw as you are grabbed."],["Sidestep",i("SS"),"Tekken-style step into the background (hold ↓ to step toward the camera). Dodges projectiles and most strikes."],["Overhead Chop",`→ + ${i("HP")}`,"Slow, but must be blocked standing."],["Anti-air Uppercut",`↓ + ${i("HP")}`,"Launches airborne opponents."],["Sweep",`↓ + ${i("HK")}`,"Low. Knocks down."],["Dash","→ → / ← ←","Quick burst of movement."],["Block","Hold ← (↙ for lows)","Block high/mid standing, lows crouching. Jump-ins and overheads must be blocked standing."],["Chains & cancels",`${i("LP")} → ${i("HP")} → Special → ${i("UL")}`,"Light attacks chain into heavies. Normals cancel into specials; specials that hit cancel into the Ultimate."]];for(const[o,c,l]of a)r.push(`<tr><td class="mv">${o}</td><td class="in">${c}</td><td class="ds">${l}</td></tr>`);return`<div class="ml-head">${xi(e)}<div><div class="display" style="font-size:40px;line-height:1">${ze(e.name)}</div>
    <div style="font-size:20px"><span class="he">${ze(e.nameHe)}</span></div>${ku(e)}
    <div style="color:var(--muted);margin-top:4px">${ze(e.role)} · ${ze(Uu[e.style])}</div>
    <div style="margin-top:6px;max-width:720px">${ze(e.bio)}</div></div></div>
    <table class="ml-table">${r.join("")}</table>`}class xx{constructor(e,t,n){this.app=e,this.index=t,this.back=n}app;index;back;page;enter(){this.page=Ye("div","page"),this.app.ui.append(this.page,Ye("div","hint",`◀ ▶ Change fighter (${this.index+1}/40) ${this.app.mg("back")} Back`)),this.render()}render(){this.page.innerHTML=zu(this.app,Ft[this.index],0);const e=this.app.ui.querySelector(".hint");e&&(e.innerHTML=`◀ ▶ Change fighter (${this.index+1}/40) ${this.app.mg("back")} Back`)}exit(){}tick(){const e=this.app.input.menu("any");e.back?(this.app.audio.sfx("menuBack"),this.back()):e.left||e.l1?(this.index=(this.index+Ft.length-1)%Ft.length,this.app.audio.sfx("menuMove"),this.render()):e.right||e.r1?(this.index=(this.index+1)%Ft.length,this.app.audio.sfx("menuMove"),this.render()):e.down?this.page.scrollTop+=80:e.up&&(this.page.scrollTop-=80)}frame(e){this.app.renderer.syncShowcase(e,{pos:[2,1.5,6],look:[0,1.1,0]})}}const _x=[{a:"TH",x:16,y:5,ps:"L2",cls:"g-shoulder"},{a:"SS",x:16,y:15,ps:"L1",cls:"g-shoulder"},{a:"UL",x:84,y:5,ps:"R2",cls:"g-shoulder"},{a:"SP",x:84,y:15,ps:"R1",cls:"g-shoulder"},{a:"MOVE",x:20,y:44,ps:"✚",cls:"g-shoulder"},{a:"HP",x:80,y:30,ps:"△",cls:"g-triangle"},{a:"HK",x:92,y:45,ps:"○",cls:"g-circle"},{a:"LK",x:80,y:60,ps:"✕",cls:"g-cross"},{a:"LP",x:67,y:45,ps:"□",cls:"g-square"},{a:"SELECT",x:34,y:27,ps:"CREATE",cls:"g-shoulder"},{a:"START",x:66,y:27,ps:"OPTIONS",cls:"g-shoulder"}];class yx{constructor(e,t){this.app=e,this.back=t}app;back;menu;status;remap=null;remapOrder=["LP","HP","LK","HK","SP","UL","TH","SS"];enter(){const e=this.app,t=Ye("div","page"),n=_x.map(r=>`<div class="pad-lbl" style="left:${r.x}%;top:${r.y}%"><span class="g ${r.cls}">${r.ps}</span>${r.a==="MOVE"?"Move":pa[r.a]}</div>`).join(""),i=r=>`<span class="g g-key">${ns(r.UP[0])}${ns(r.LEFT[0])}${ns(r.DOWN[0])}${ns(r.RIGHT[0])}</span><span>Move</span>`+uo.map(a=>`<span>${r[a].map(o=>`<span class="g g-key">${ns(o)}</span>`).join(" ")}</span><span>${pa[a]}</span>`).join("");t.innerHTML=`<h1 class="display">Controls</h1>
      <div class="sub">Plug in a PS5 DualSense (USB or Bluetooth) and press any button. Chrome, Edge and the desktop app read it natively.</div>
      <div class="ctrl-grid">
        <div class="panel"><h3>PS5 DualSense</h3><div class="pad-diagram"><div class="pad-body"></div>${n}<div class="pad-lbl" style="left:36%;top:70%">Left stick: Move</div></div>
          <div class="status"></div></div>
        <div class="panel"><h3>Controller setup</h3><div id="menu-slot"></div></div>
        <div class="panel"><h3>Keyboard · Player 1</h3><div class="kv">${i(Ls)}</div></div>
        <div class="panel"><h3>Keyboard · Player 2</h3><div class="kv">${i(Is)}</div></div>
      </div>`,this.status=t.querySelector(".status"),this.menu=new ps([{label:"Swap P1 / P2 controllers",onSelect:()=>{e.input.swapSlots(),this.refresh()}},{label:"Remap P1 buttons",onSelect:()=>this.startRemap(0)},{label:"Remap P2 buttons",onSelect:()=>this.startRemap(1)},{label:"Reset P1 mapping",onSelect:()=>{const r=e.input.slotPad[0];r!==null&&e.input.resetBinding(r),this.refresh()}},{label:"Reset P2 mapping",onSelect:()=>{const r=e.input.slotPad[1];r!==null&&e.input.resetBinding(r),this.refresh()}},{label:"Test rumble",onSelect:()=>{e.input.rumble(0,1,1,400),e.input.rumble(1,1,1,400)}},{label:"Back",onSelect:()=>this.back()}],e.audio),t.querySelector("#menu-slot").appendChild(this.menu.el),e.ui.append(t,Ye("div","hint",`${e.mg("confirm")} Select ${e.mg("back")} Back`)),e.input.onChange=()=>this.refresh(),this.refresh()}refresh(){const e=this.app.input,t=e.connectedPads(),n=r=>{const a=e.padInfo(r);if(!a)return`<div class="status-line">P${r+1}: <b>keyboard only</b></div>`;const o=e.bindingFor(a.index),c=this.remapOrder.map(l=>`${l}=${o[l]}`).join(" ");return`<div class="status-line">P${r+1}: <b>${ze(a.kind==="dualsense"?"DualSense":a.kind==="dualshock"?"DualShock 4":a.kind==="xbox"?"Xbox controller":"Gamepad")}</b> <span style="color:var(--muted);font-size:12px">#${a.index} · ${ze(c)}</span></div>`};let i=`<div class="status-line">Controllers connected: <b>${t.length}</b></div>${n(0)}${n(1)}`;if(t.some(r=>!r.standard)&&(i+='<div class="status-line" style="color:#ffb3aa">A controller is in raw mode (non-Chrome browser). If buttons feel wrong, use Remap or play in Chrome / Edge / the desktop app.</div>'),this.remap){const r=this.remapOrder[this.remap.step];i+=`<div class="status-line" style="font-size:20px;margin-top:10px">Press the button for <b>${pa[r]}</b> on P${this.remap.slot+1}'s controller… <span style="color:var(--muted);font-size:13px">(Esc to cancel)</span></div>`}this.status.innerHTML=i}startRemap(e){const t=this.app.input.slotPad[e];if(t===null){this.status.insertAdjacentHTML("beforeend",`<div class="status-line" style="color:#ffb3aa">No controller assigned to P${e+1}.</div>`);return}this.remap={slot:e,step:0,binding:{...this.app.input.bindingFor(t)}},this.refresh(),this.captureNext()}captureNext(){this.app.input.captureNextButton((e,t)=>{const n=this.remap;if(n){if(e!==this.app.input.slotPad[n.slot]){this.captureNext();return}n.binding[this.remapOrder[n.step]]=t,n.step++,this.app.audio.sfx("menuConfirm"),n.step>=this.remapOrder.length?(this.app.input.setBinding(e,n.binding),this.remap=null,this.suppress=20):this.captureNext(),this.refresh()}})}suppress=0;exit(){this.app.input.captureNextButton(null),this.app.input.onChange=null}tick(){if(this.remap){this.app.input.keyPressed("Escape")&&(this.remap=null,this.app.input.captureNextButton(null),this.refresh());return}if(this.suppress>0){this.suppress--;return}const e=this.app.input.menu("any");if(e.back){this.app.audio.sfx("menuBack"),this.back();return}this.menu.handle(e)}frame(e){this.app.renderer.syncShowcase(e,{pos:[2,1.5,6],look:[0,1.1,0]})}}class Sx{constructor(e,t,n){this.app=e,this.setup=t,this.winner=n}app;setup;winner;menu;t=0;enter(){const e=this.app,{p1:t,p2:n}=this.setup,i=this.winner===0?t:this.winner===1?n:null;i&&e.renderer.setShowcase([{def:i,x:0,facing:1,pose:"victory",variant:0}],!1),this.menu=new ps([{label:"Rematch",onSelect:()=>e.go(new Ul(e,this.setup))},{label:"Change Stage",onSelect:()=>e.go(new Gu(e,this.setup.mode,t,n))},{label:"Character Select",onSelect:()=>e.go(new ua(e,this.setup.mode))},{label:"Main Menu",onSelect:()=>e.go(new mn(e))}],e.audio);const r=Ye("div","results"),a=Ye("div","col");a.innerHTML=i?`${xi(i)}<div class="winner display">${ze(i.name)} wins</div><div class="he" style="font-size:24px">${ze(i.nameHe)}</div><div class="quote">“${ze(i.quotes.win)}”</div>`:'<div class="winner display">Draw game</div><div class="quote">A hung parliament. Again.</div>',a.appendChild(this.menu.el),r.appendChild(a),e.ui.append(r,Ye("div","hint",`${e.mg("confirm")} Select`))}exit(){}tick(){this.menu.handle(this.app.input.menu("any"))}frame(e){this.t+=e,this.app.renderer.syncShowcase(e,{pos:[1.6+Math.sin(this.t*.3)*.5,1.4,4.2],look:[-.6,1.2,0]})}}class kl{constructor(e){this.app=e}app;left=170;enter(){const e=this.app,t=e.arcade,n=t.ladder[t.index];e.renderer.setStage(t.stages[t.index]),e.renderer.clearFighters(),e.renderer.setShowcase([{def:n,x:0,facing:-1,pose:"intro"}],!1);const i=t.ladder.map((a,o)=>`<div class="rung ${o<t.index?"done":""} ${o===t.index?"cur":""} ${a.boss?"boss":""}">${xi(a)}${ze(a.name.split(" ").slice(-1)[0])}</div>`).join(""),r=Ye("div","results");r.innerHTML=`<div class="col">
      <div class="display" style="font-size:28px;color:var(--muted)">Arcade · Stage ${t.index+1} / ${t.ladder.length}</div>
      <div class="winner display">${n.boss?"Final boss":"Next opponent"}</div>
      <div class="display" style="font-size:44px;color:var(--gold)">${ze(n.name)}</div>
      <div class="he" style="font-size:22px">${ze(n.nameHe)}</div>
      <div style="color:var(--muted)">${ze(n.role)}</div>
      <div class="ladder">${i}</div>
    </div>`,e.ui.append(r,Ye("div","hint",`${e.mg("confirm")} Fight ${e.mg("back")} Quit`)),e.audio.say(n.boss?`Final boss. ${n.name}`:`Next: ${n.name}`)}start(){const e=this.app,t=e.arcade,n={mode:"arcade",p1:t.player,p2:t.ladder[t.index],stage:t.stages[t.index],cpu:[!1,!0]};e.lastSetup=n,e.go(new Ul(e,n,()=>e.go(new er(e,n))))}exit(){}tick(){const e=this.app.input.menu("any");if(e.back){this.app.go(new mn(this.app));return}(--this.left<=0||e.confirm)&&this.start()}frame(e){this.app.renderer.syncShowcase(e,{pos:[-1.8,1.4,4.4],look:[.6,1.2,0]})}}class Mx{constructor(e){this.app=e}app;left=600;el;enter(){const e=this.app,t=e.arcade,n=t.ladder[t.index];e.renderer.setShowcase([{def:n,x:0,facing:-1,pose:"victory",variant:2}],!1);const i=Ye("div","results");i.innerHTML=`<div class="col"><div class="winner display">Continue?</div>
      <div class="quote">${ze(n.name)}: “${ze(n.quotes.win)}”</div>
      <div class="display" style="font-size:120px;color:var(--gold)" id="cd">10</div>
      <div>${e.mg("confirm")} Continue &nbsp; ${e.mg("back")} Give up</div></div>`,e.ui.appendChild(i),this.el=i.querySelector("#cd")}exit(){}tick(){const e=this.app,t=e.input.menu("any");this.left--,this.el.textContent=String(Math.ceil(this.left/60)),t.confirm?(e.arcade.continues++,e.go(new kl(e))):t.back||this.left<=0?e.go(new mn(e)):(t.extra||t.extra2)&&(this.left=Math.max(1,this.left-60))}frame(e){this.app.renderer.syncShowcase(e,{pos:[-1.8,1.4,4.4],look:[.6,1.2,0]})}}class bx{constructor(e){this.app=e}app;t=0;enter(){const e=this.app,t=e.arcade,n=t.player;e.renderer.setShowcase([{def:n,x:0,facing:1,pose:"victory",variant:0}],!1),e.audio.say(`Congratulations, Prime Minister ${n.name}!`);const i=Ye("div","ending");i.innerHTML=`<h1 class="display">Coalition formed!</h1>
      <p>Against all odds, <b>${ze(n.name)}</b> has survived the plenum, outlasted ${t.ladder.length} rivals and assembled a 61-seat majority${t.continues?` (after ${t.continues} emergency election${t.continues>1?"s":""})`:""}.<br>
      The President has asked ${ze(n.name.split(" ")[0])} to form the next government. It will last at least… until the next arcade run.</p>
      <div class="defeated">${t.ladder.map(r=>xi(r)).join("")}</div>
      <p style="color:var(--muted);font-size:14px">Street Knesset Fighter · a parody. Thanks for playing!</p>
      <div>${e.mg("confirm")} Main Menu</div>`,e.ui.appendChild(i)}exit(){}tick(){const e=this.app.input.menu("any");this.t>1.5&&(e.confirm||e.start)&&(this.app.arcade=null,Nl(this.app,!0),this.app.go(new mn(this.app)))}frame(e){this.t+=e;const t=this.t*.25;this.app.renderer.syncShowcase(e,{pos:[Math.sin(t)*4,1.5,Math.cos(t)*4],look:[0,1.2,0]})}}const wx=["zero","one","two","three","four","five","six","seven","eight","nine"],Ti=["stand","crouch","jump","block","cpu"];class er{constructor(e,t){this.app=e,this.setup=t}app;setup;match;hud;cpu=[null,null];dummyCpu=null;paused=!1;pauseEl=null;pauseMenu=null;pauseSub="menu";movesSlot=0;endTimer=0;inputs=[hn,hn];finished=!1;get training(){return this.setup.mode==="training"}enter(){const e=this.app,t=e.settings,{p1:n,p2:i,stage:r}=this.setup;this.match=new px({p1:n,p2:i,roundsToWin:this.training?1:t.roundsToWin,roundTime:this.training?0:t.roundTime,training:this.training?{infiniteHealth:!0,infiniteMeter:!0,dummy:"stand"}:null}),e.renderer.clearShowcase(),e.renderer.setStage(r),e.renderer.setFighters([n,i]),e.renderer.snapCamera([0,1.8,7.5],[0,1.1,0]);let a=t.difficulty;this.setup.mode==="arcade"&&e.arcade&&(e.arcade.index>=4&&a++,i.boss&&a++),a=Math.max(0,Math.min(4,a)),this.cpu=[this.setup.cpu[0]?new ao(this.setup.mode==="watch"?t.difficulty:a,101):null,this.setup.cpu[1]?new ao(a,202):null],this.dummyCpu=new ao(t.difficulty,303),this.hud=new gx(e,this.match,{training:this.training,inputDisplay:t.inputDisplay}),e.ui.appendChild(this.hud.root),e.audio.playMusic(r.music,r.id.length+n.id.length)}exit(){this.hud?.destroy()}humanSlots(){const e=[];return this.setup.cpu[0]||e.push(0),!this.setup.cpu[1]&&!this.training&&e.push(1),e}openPause(){this.paused=!0,this.match.paused=!0,this.pauseSub="menu",this.app.audio.sfx("menuConfirm"),this.buildPause()}closePause(){this.paused=!1,this.match.paused=!1,this.pauseEl?.remove(),this.pauseEl=null,this.pauseMenu=null}buildPause(){const e=this.app;this.pauseEl?.remove();const t=Ye("div","pause"),n=Ye("div","box panel");if(t.appendChild(n),this.pauseSub==="moves"){const i=this.match.fighters[this.movesSlot];n.style.maxHeight="86vh",n.style.overflow="auto",n.style.width="min(1000px, 92vw)",n.innerHTML=zu(e,i.def,this.movesSlot)+`<div class="hint" style="position:static;margin-top:14px">◀ ▶ Switch fighter ${e.mg("back")} Back</div>`,this.pauseMenu=null}else{n.innerHTML='<h2 class="display">Paused</h2>';const i=this.match.config.training,r=[{label:"Resume",onSelect:()=>this.closePause()},{label:"Move List",onSelect:()=>{this.pauseSub="moves",this.movesSlot=0,this.buildPause()}}];i&&r.push({label:"Dummy",value:()=>i.dummy.toUpperCase(),onLeft:()=>{i.dummy=Ti[(Ti.indexOf(i.dummy)+Ti.length-1)%Ti.length]},onRight:()=>{i.dummy=Ti[(Ti.indexOf(i.dummy)+1)%Ti.length]}},{label:"Infinite Meter",value:()=>i.infiniteMeter?"On":"Off",onLeft:()=>{i.infiniteMeter=!i.infiniteMeter},onRight:()=>{i.infiniteMeter=!i.infiniteMeter}},{label:"Show Hitboxes",value:()=>e.renderer.showHitboxes?"On":"Off",onLeft:()=>{e.renderer.showHitboxes=!e.renderer.showHitboxes},onRight:()=>{e.renderer.showHitboxes=!e.renderer.showHitboxes}},{label:"Reset Positions",onSelect:()=>{this.match.resetPositions(),this.closePause()}}),r.push({label:"Restart Match",onSelect:()=>e.go(new er(e,this.setup))},{label:"Character Select",onSelect:()=>e.go(new ua(e,this.setup.mode))},{label:"Main Menu",onSelect:()=>e.go(new mn(e))}),this.pauseMenu=new ps(r,e.audio),n.appendChild(this.pauseMenu.el)}this.pauseEl=t,e.ui.appendChild(t)}tickPause(){const e=this.app.input.menu("any");if(this.pauseSub==="moves"){e.back||e.start?(this.pauseSub="menu",this.app.audio.sfx("menuBack"),this.buildPause()):(e.left||e.right||e.l1||e.r1)&&(this.movesSlot=this.movesSlot===0?1:0,this.app.audio.sfx("menuMove"),this.buildPause());return}if(e.back||e.start){this.closePause();return}this.pauseMenu?.handle(e)}tick(){if(this.paused){this.tickPause();return}const e=this.match,t=this.app,n=this.humanSlots(),i=[hn,hn];for(const a of[0,1])this.cpu[a]?i[a]=this.cpu[a].next(e.fighters[a],e):this.training&&a===1?i[1]=K1(e.config.training.dummy,e.fighters[1],e,this.dummyCpu):i[a]=t.input.player(a);const r=n.length?n:[0,1];for(const a of r)if((this.cpu[a]?t.input.player(a):i[a]).pressed&de.START&&e.phase!=="matchEnd"){this.openPause();return}this.training&&i[0].pressed&de.SELECT&&e.resetPositions(),e.phase==="intro"?(t.input.menu("any").confirm&&e.skipIntro(),this.hud.showQuote(0,e.fighters[0].def.quotes.intro,e.phaseFrame>10&&e.phaseFrame<100),this.hud.showQuote(1,e.fighters[1].def.quotes.intro,e.phaseFrame>=100&&e.phaseFrame<195)):(this.hud.showQuote(0,"",!1),this.hud.showQuote(1,"",!1)),this.inputs=i,e.tick(i);for(const a of e.drainEvents())this.onEvent(a);if(e.phase==="matchEnd"){this.endTimer++;const a=e.matchWinner;this.endTimer===60&&a!==null&&a>=0&&this.hud.showQuote(a,e.fighters[a].def.quotes.win,!0);const o=this.endTimer>90&&t.input.menu("any").confirm;(this.endTimer>=260||o)&&!this.finished&&(this.finished=!0,this.finish(a))}}onEvent(e){const t=this.app,n=this.match;t.renderer.handleEvent(e,n),this.hud.event(e,n);const i=t.audio;switch(e.t){case"hit":e.blocked?i.sfx(e.counter?"counter":"block"):i.sfx(e.spark==="super"?"hitSuper":e.spark==="light"?"hitLight":"hitHeavy",.9+Math.random()*.2);break;case"whiff":i.sfx(e.heavy?"whooshHeavy":"whoosh",.9+Math.random()*.2);break;case"special":i.sfx("special",.8+e.color%7/14);break;case"projectile":i.sfx("projectile",.9+Math.random()*.2);break;case"superFlash":i.sfx("superFlash");break;case"ko":i.sfx("ko"),i.say(e.perfect?"K.O. Perfect!":"K.O.");break;case"announce":{const r=e.text;if(r.startsWith("ROUND"))i.say(`Round ${wx[n.round]??n.round}`);else if(r==="FINAL ROUND")i.say("Final round");else if(r==="FIGHT!")i.say("Fight!");else if(r==="TIME")i.say("Time!");else if(r.endsWith("WINS")){const a=n.matchWinner!==null&&n.matchWinner>=0?n.fighters[n.matchWinner].def.name:"";i.say(`${a} wins!`)}else r==="DRAW GAME"&&i.say("Draw game");(r==="FIGHT!"||r.startsWith("ROUND")||r==="FINAL ROUND")&&i.sfx("round");break}case"jump":i.sfx("jump");break;case"land":i.sfx(e.hard?"landHard":"land");break;case"tech":i.sfx("tech");break;case"buff":i.sfx("buff");break;case"teleport":i.sfx("teleport");break;case"lifeline":i.sfx("lifeline"),i.say(e.name);break;case"clash":i.sfx("clash");break;case"counterHit":i.sfx("counter");break;case"sfx":i.sfx(e.name==="cinematic"?"superFlash":e.name);break;case"rumble":this.setup.cpu[e.fighter]||t.input.rumble(e.fighter,e.strong,e.weak,e.ms);break}}finish(e){const t=this.app;if(this.setup.mode==="arcade"&&t.arcade){const n=t.arcade;e===0?(n.index++,n.index>=n.ladder.length?t.go(new bx(t)):t.go(new kl(t))):t.go(new Mx(t));return}t.go(new Sx(t,this.setup,e??-1))}frame(e){this.app.renderer.syncFight(this.match,this.paused?0:e),this.hud.update(this.match,this.inputs)}}const ts=10;function Rh(s){const e=Bu(s);return[["Power",(e.dmgMul-.85)/.4],["Speed",(e.walk/.052-.75)/.6],["Health",(e.maxHealth/1e3-.85)/.4],["Defense",(1/e.defMul-.8)/.45]].map(([n,i])=>`<span>${n}</span><div class="bar"><i style="width:${Math.round(Math.max(.08,Math.min(1,i))*100)}%"></i></div>`).join("")}function Ex(s,e,t,n){const i=`<div class="stats">${n?Rh(s).replace(/<span>(\w+)<\/span>(<div class="bar">.*?<\/div>)/g,"$2<span>$1</span>"):Rh(s)}</div>`;return`<div class="who">${ze(e)}</div>
    <div class="name display">${ze(s.name)}${s.nick?` <span style="color:var(--gold)">“${ze(s.nick)}”</span>`:""}</div>
    <div class="he">${ze(s.nameHe)}</div>
    ${ku(s)}
    <div class="role">${ze(s.role)} · ${ze(Uu[s.style])}</div>
    <div class="passive"><b>${ze(s.passive.name)}:</b> ${ze(s.passive.desc)}</div>
    ${i}
    ${t?'<div class="locked">✔ LOCKED IN</div>':""}`}class ua{constructor(e,t){this.app=e,this.mode=t}app;mode;cursor=[0,9];locked=[!1,!1];pickingSlot=0;cells=[];info=[];shown=["",""];t=0;leaveIn=-1;get dual(){return this.mode==="versus"}get needsP2(){return this.mode!=="arcade"}enter(){const e=this.app;e.renderer.clearFighters(),e.renderer.clearStage(),e.renderer.setShowcase([],!1),e.renderer.snapCamera([0,1.35,8.8],[0,1.1,0]);const t=e.lastSetup;t&&(this.cursor[0]=Math.max(0,Ft.findIndex(o=>o.id===t.p1.id)),this.needsP2&&(this.cursor[1]=Math.max(0,Ft.findIndex(o=>o.id===t.p2.id))));const n={arcade:"Arcade · Choose your candidate",versus:"Versus · Choose your candidates",training:"Training · Choose your fighter",watch:"CPU vs CPU · Choose both fighters"}[this.mode],i=Ye("div","screen");i.innerHTML=`<div class="cs-title display">${ze(n)}</div>`;const r=Ye("div","cs-grid");this.cells=Ft.map((o,c)=>{const l=Ye("div","cs-cell");return l.innerHTML=`${xi(o)}<div class="nm">${ze(o.name.split(" ").slice(-1)[0])}</div>`,l.addEventListener("mouseenter",()=>{const h=this.dual?0:this.pickingSlot;this.locked[h]||(this.cursor[h]=c,this.refresh())}),l.addEventListener("click",()=>{const h=this.dual?0:this.pickingSlot;this.cursor[h]=c,this.lock(h)}),r.appendChild(l),l}),i.appendChild(r),this.info[0]=Ye("div","cs-info left panel"),this.info[1]=Ye("div","cs-info right panel"),i.append(this.info[0]),this.needsP2&&i.append(this.info[1]);const a=Ye("div","hint",`${e.mg("confirm")} Select ${e.mg("back")} Back ${e.mg("extra")} Random`);i.appendChild(a),e.ui.appendChild(i),this.refresh()}exit(){}slotLabel(e){return this.mode==="watch"?e===0?"CPU 1":"CPU 2":this.mode==="training"?e===0?"PLAYER 1":"DUMMY":this.mode==="arcade"||e===0?"PLAYER 1":"PLAYER 2"}refresh(){this.cells.forEach((e,t)=>{const n=this.cursor[0]===t,i=this.needsP2&&this.cursor[1]===t&&(this.dual||this.pickingSlot===1||this.locked[1]);e.classList.toggle("p1",n),e.classList.toggle("p2",i),e.querySelectorAll(".tag").forEach(r=>r.remove()),n&&e.insertAdjacentHTML("beforeend",`<div class="tag t1">${this.mode==="watch"?"C1":"1P"}</div>`),i&&e.insertAdjacentHTML("beforeend",`<div class="tag t2">${this.mode==="training"?"DUM":this.mode==="watch"?"C2":"2P"}</div>`)});for(const e of[0,1]){if(e===1&&!this.needsP2)continue;const t=e===0||this.dual||this.pickingSlot===1||this.locked[1];this.info[e].style.visibility=t?"visible":"hidden";const n=Ft[this.cursor[e]];this.info[e].innerHTML=Ex(n,this.slotLabel(e),this.locked[e],e===1);const i=`${n.id}:${this.locked[e]}:${t}`;this.shown[e]!==i&&(this.shown[e]=i,this.app.renderer.updateShowcaseSlot(e,t?{def:n,x:e===0?-3.7:3.7,facing:e===0?1:-1,pose:this.locked[e]?"victory":"guard",variant:e}:null))}}lock(e){this.locked[e]||(this.locked[e]=!0,this.app.audio.sfx("select"),!this.dual&&e===0&&this.needsP2&&(this.pickingSlot=1,this.cursor[1]===this.cursor[0]&&(this.cursor[1]=(this.cursor[0]+1)%Ft.length)),this.refresh(),this.locked[0]&&(!this.needsP2||this.locked[1])&&(this.leaveIn=40))}move(e,t,n){const i=Ft.length,r=Math.ceil(i/ts);let a=this.cursor[e]%ts,o=Math.floor(this.cursor[e]/ts);a=(a+t+ts)%ts,o=(o+n+r)%r,this.cursor[e]=Math.min(i-1,o*ts+a),this.app.audio.sfx("menuMove"),this.refresh()}handleSlot(e,t){if(t.back){if(this.locked[e]){this.locked[e]=!1,this.leaveIn=-1,this.app.audio.sfx("menuBack"),this.refresh();return}if(!this.dual&&e===1){this.pickingSlot=0,this.locked[0]=!1,this.app.audio.sfx("menuBack"),this.refresh();return}this.app.audio.sfx("menuBack"),this.app.go(new mn(this.app));return}this.locked[e]||(t.left?this.move(e,-1,0):t.right?this.move(e,1,0):t.up?this.move(e,0,-1):t.down&&this.move(e,0,1),t.extra?(this.cursor[e]=Math.floor(Math.random()*Ft.length),this.lock(e)):t.confirm&&this.lock(e))}tick(){if(this.leaveIn>0){--this.leaveIn===0&&this.finish();const e=this.app.input.menu(this.dual?0:"any");if(e.back&&this.handleSlot(this.dual?0:this.pickingSlot,e),this.dual){const t=this.app.input.menu(1);t.back&&this.handleSlot(1,t)}return}this.dual?(this.handleSlot(0,this.app.input.menu(0)),this.handleSlot(1,this.app.input.menu(1))):this.handleSlot(this.pickingSlot,this.app.input.menu("any"))}finish(){const e=this.app,t=Ft[this.cursor[0]];if(this.mode==="arcade"){const i=Ft.filter(c=>c.id!==t.id).sort(()=>Math.random()-.5),r=t.id==="netanyahu"?Ft.find(c=>c.id==="lapid"):Ft.find(c=>c.id==="netanyahu"),a=i.filter(c=>c.id!==r.id).slice(0,7);a.push(G1(r));const o=a.map((c,l)=>l===a.length-1?Fn[0]:Fn[Math.floor(Math.random()*Fn.length)]);e.arcade={player:t,ladder:a,stages:o,index:0,continues:0},e.go(new kl(e));return}const n=Ft[this.cursor[1]];e.go(new Gu(e,this.mode,t,n))}frame(e){this.t+=e,this.app.renderer.syncShowcase(e,{pos:[0,1.35,8.8],look:[0,1.1,0]})}}class Gu{constructor(e,t,n,i){this.app=e,this.mode=t,this.p1=n,this.p2=i}app;mode;p1;p2;menu;descEl;t=0;current=-1;enter(){const e=this.app,t=[...Fn.map((a,o)=>({label:a.name,onSelect:()=>this.go(Fn[o])})),{label:"Random",onSelect:()=>this.go(Fn[Math.floor(Math.random()*Fn.length)])}];this.menu=new ps(t,e.audio);const n=Ye("div","screen");n.innerHTML='<div class="cs-title display">Choose the arena</div>';const i=Ye("div","ss-list");i.appendChild(this.menu.el),this.descEl=Ye("div","ss-desc panel"),n.append(i,this.descEl,Ye("div","hint",`${e.mg("confirm")} Select ${e.mg("back")} Back`)),e.ui.appendChild(n);const r=e.lastSetup?.stage;r&&(this.menu.index=Math.max(0,Fn.findIndex(a=>a.id===r.id))),this.menu.render(),e.renderer.setShowcase([{def:this.p1,x:-1.6,facing:1,pose:"guard"},{def:this.p2,x:1.6,facing:-1,pose:"guard",variant:1}],!1),this.preview()}preview(){const e=this.menu.index;if(e===this.current)return;this.current=e;const t=Fn[e];t?(this.app.renderer.setStage(t),this.app.audio.playMusic(t.music,e+1),this.descEl.innerHTML=`<div class="name display">${ze(t.name)}</div><div class="he" style="font-size:22px">${ze(t.nameHe)}</div><div style="color:var(--muted);margin-top:6px">${ze(t.desc)}</div>`):this.descEl.innerHTML='<div class="name display">Random</div><div style="color:var(--muted)">Let the coalition decide.</div>'}go(e){const t={mode:this.mode,p1:this.p1,p2:this.p2,stage:e,cpu:this.mode==="versus"?[!1,!1]:this.mode==="watch"?[!0,!0]:[!1,this.mode!=="training"]};this.app.lastSetup=t,this.app.go(new Ul(this.app,t))}exit(){}tick(){const e=this.app.input.menu("any");if(e.back){this.app.audio.sfx("menuBack"),this.app.go(new ua(this.app,this.mode));return}this.menu.handle(e),this.preview()}frame(e){this.t+=e;const t=this.t*.12;this.app.renderer.syncShowcase(e,{pos:[Math.sin(t)*8,2.6,Math.cos(t)*8+1],look:[0,1.2,-1]})}}class Ul{constructor(e,t,n){this.app=e,this.setup=t,this.onDone=n}app;setup;onDone;left=200;t=0;enter(){const e=this.app,{p1:t,p2:n,stage:i}=this.setup;e.renderer.setStage(i),e.renderer.setShowcase([{def:t,x:-1.4,facing:1,pose:"intro"},{def:n,x:1.4,facing:-1,pose:"intro"}],!1),e.audio.sfx("superFlash"),e.audio.say(`${t.name}. Versus. ${n.name}.`);const r=Js(ki[t.party].color),a=Js(ki[n.party].color),o=Ye("div","vs");o.innerHTML=`<div class="band l" style="background:linear-gradient(90deg, ${r}, transparent)"></div>
      <div class="band r" style="background:linear-gradient(270deg, ${a}, transparent)"></div>
      <div class="stagename display">${ze(i.name)} · <span class="he">${ze(i.nameHe)}</span></div>
      <div class="side l">${xi(t,"portrait")}<div class="name display">${ze(t.name)}</div><div class="he" style="font-size:22px">${ze(t.nameHe)}</div><div class="quote">“${ze(t.quotes.intro)}”</div></div>
      <div class="side r">${xi(n,"portrait")}<div class="name display">${ze(n.boss?"BOSS · "+n.name:n.name)}</div><div class="he" style="font-size:22px">${ze(n.nameHe)}</div><div class="quote">“${ze(n.quotes.intro)}”</div></div>
      <div class="big display">VS</div>`,e.ui.appendChild(o)}exit(){}tick(){this.left--;const e=this.app.input.menu("any");(this.left<=0||this.left<170&&(e.confirm||e.start))&&(this.onDone?this.onDone():this.app.go(new er(this.app,this.setup)))}frame(e){this.t+=e,this.app.renderer.syncShowcase(e,{pos:[Math.sin(this.t*.2)*2,1.4,5.2-this.t*.2],look:[0,1.25,0]})}}const Tx={bpm:108,root:50,mode:"dorian",intensity:.5};function co(s){return s[Math.floor(Math.random()*s.length)]}class Ax{constructor(e){this.app=e}app;bar;done=!1;enter(){const e=Ye("div","loading");e.innerHTML=`<div class="logo"><span class="l1">Street</span><span class="l2">Knesset</span><span class="l3">Fighter</span></div>
      <div class="bar"><i style="width:0%"></i></div><div style="color:var(--muted)">Drafting 40 members of Knesset…</div>`,this.app.ui.appendChild(e),this.bar=e.querySelector(".bar i"),Y1(Ft,(t,n)=>{this.bar.style.width=`${t/n*100}%`}).then(()=>{this.done=!0})}exit(){}tick(){this.done&&this.app.go(new Vu(this.app))}frame(){}}function Nl(s,e=!1){if(!e&&s.renderer.showcaseCount===2&&s.renderer.currentStage==="plenum")return;s.renderer.clearFighters(),s.renderer.setStage(Du.plenum);const t=co(Ft);let n=co(Ft);for(;n.id===t.id;)n=co(Ft);s.renderer.setShowcase([{def:t,x:-1.3,facing:1,pose:"guard"},{def:n,x:1.3,facing:-1,pose:"guard"}],!1),s.audio.playMusic(Tx,3)}class Vu{constructor(e){this.app=e}app;t=0;enter(){const e=this.app;Nl(e,!0),e.renderer.snapCamera([0,1.6,6.5],[0,1.2,0]);const t=Ye("div","title-wrap");t.innerHTML=`<div class="logo"><span class="l1">Street</span><span class="l2">Knesset</span><span class="l3">Fighter</span><span class="sub"><span class="he">סטריט כנסת פייטר</span> · 40 MKs · ONE PLENUM</span></div>
      <div class="press blink">PRESS ${e.mg("confirm")} / ENTER</div>
      <div class="pads-status"></div>
      <div class="disclaimer">A parody fighting game. All characters are caricatures of public figures; moves and quotes are satire, not real statements.</div>`,t.addEventListener("click",()=>this.next()),e.ui.appendChild(t),this.updatePads(),e.input.onChange=()=>this.updatePads()}updatePads(){const e=this.app.ui.querySelector(".pads-status");if(!e)return;const t=this.app.input.connectedPads();e.innerHTML=t.length?t.map(n=>`<b>${n.kind==="dualsense"?"DualSense":n.kind==="dualshock"?"DualShock":n.kind==="xbox"?"Xbox pad":"Gamepad"}</b> connected${n.standard?"":" (raw mode)"}`).join("<br>"):"No controller detected: press a button on your PS5 controller.<br>Keyboard works too."}next(){this.app.audio.unlock(),this.app.audio.sfx("menuConfirm"),this.app.go(new mn(this.app))}exit(){this.app.input.onChange=null}tick(){const e=this.app.input.menu("any");(e.confirm||e.start)&&this.next()}frame(e){this.t+=e;const t=this.t*.15;this.app.renderer.syncShowcase(e,{pos:[Math.sin(t)*6.2,1.6+Math.sin(this.t*.4)*.2,Math.cos(t)*6.2],look:[0,1.15,0]})}}class mn{constructor(e){this.app=e}app;static lastIndex=0;menu;t=0;enter(){const e=this.app,t=a=>()=>e.go(new ua(e,a)),n=[{label:"Arcade",desc:"Fight through 7 MKs and the final boss to form a government.",onSelect:t("arcade")},{label:"Versus",desc:"Two players, one plenum. Local multiplayer.",onSelect:t("versus")},{label:"Training",desc:"Practice combos against a dummy. Infinite health and meter.",onSelect:t("training")},{label:"CPU vs CPU",desc:"Sit back and watch two CPUs debate.",onSelect:t("watch")},{label:"Move Lists",desc:"Every special move, ultimate and passive for all 40 fighters.",onSelect:()=>e.go(new xx(e,0,()=>e.go(new mn(e))))},{label:"Controls",desc:"PS5 DualSense and keyboard layouts, controller assignment and remapping.",onSelect:()=>e.go(new yx(e,()=>e.go(new mn(e))))},{label:"Options",desc:"Difficulty, rounds, timer, audio and more.",onSelect:()=>e.go(new Cx(e,()=>e.go(new mn(e))))}];e.desktop&&n.push({label:"Quit",desc:"Exit to desktop.",onSelect:()=>e.desktop.quit()}),this.menu=new ps(n,e.audio,{desc:!0}),this.menu.index=Math.min(mn.lastIndex,n.length-1),this.menu.render();const i=Ye("div","mainmenu");i.innerHTML='<div class="logo"><span class="l1">Street</span><span class="l2">Knesset</span><span class="l3">Fighter</span></div>',i.appendChild(this.menu.el);const r=Ye("div","hint",`${e.mg("confirm")} Select ${e.mg("back")} Back`);e.ui.append(i,r),Nl(e)}exit(){mn.lastIndex=this.menu.index}tick(){const e=this.app.input.menu("any");if(e.back){this.app.audio.sfx("menuBack"),this.app.go(new Vu(this.app));return}this.menu.handle(e)}frame(e){this.t+=e;const t=.5+Math.sin(this.t*.1)*.3;this.app.renderer.syncShowcase(e,{pos:[Math.sin(t)*6+1.5,1.5,Math.cos(t)*6],look:[1.2,1.1,0]})}}class Cx{constructor(e,t){this.app=e,this.back=t}app;back;menu;enter(){const e=this.app,t=e.settings,n=(o,c)=>{t[o]=Math.round(Math.max(0,Math.min(1,t[o]+c))*10)/10,e.applySettings()},i=[30,60,99,0],r=[{label:"CPU Difficulty",value:()=>V1[t.difficulty],onLeft:()=>{t.difficulty=Math.max(0,t.difficulty-1),e.applySettings()},onRight:()=>{t.difficulty=Math.min(4,t.difficulty+1),e.applySettings()},desc:"How tough the CPU opponents are."},{label:"Rounds to Win",value:()=>String(t.roundsToWin),onLeft:()=>{t.roundsToWin=Math.max(1,t.roundsToWin-1),e.applySettings()},onRight:()=>{t.roundsToWin=Math.min(5,t.roundsToWin+1),e.applySettings()}},{label:"Round Time",value:()=>t.roundTime===0?"∞":`${t.roundTime}s`,onLeft:()=>{t.roundTime=i[(i.indexOf(t.roundTime)+i.length-1)%i.length],e.applySettings()},onRight:()=>{t.roundTime=i[(i.indexOf(t.roundTime)+1)%i.length],e.applySettings()}},{label:"Master Volume",value:()=>`${Math.round(t.masterVolume*100)}%`,onLeft:()=>n("masterVolume",-.1),onRight:()=>n("masterVolume",.1)},{label:"Music Volume",value:()=>`${Math.round(t.musicVolume*100)}%`,onLeft:()=>n("musicVolume",-.1),onRight:()=>n("musicVolume",.1)},{label:"SFX Volume",value:()=>`${Math.round(t.sfxVolume*100)}%`,onLeft:()=>n("sfxVolume",-.1),onRight:()=>n("sfxVolume",.1)},{label:"Announcer Voice",value:()=>t.announcer?"On":"Off",onLeft:()=>{t.announcer=!t.announcer,e.applySettings()},onRight:()=>{t.announcer=!t.announcer,e.applySettings()},desc:"Uses your system text-to-speech voice."},{label:"Controller Rumble",value:()=>t.rumble?"On":"Off",onLeft:()=>{t.rumble=!t.rumble,e.applySettings()},onRight:()=>{t.rumble=!t.rumble,e.applySettings()},desc:"DualSense vibration on hits (Chrome / Edge / desktop app)."},{label:"Show Hitboxes",value:()=>t.showHitboxes?"On":"Off",onLeft:()=>{t.showHitboxes=!t.showHitboxes,e.applySettings()},onRight:()=>{t.showHitboxes=!t.showHitboxes,e.applySettings()}},{label:"Input Display",value:()=>t.inputDisplay?"On":"Off",onLeft:()=>{t.inputDisplay=!t.inputDisplay,e.applySettings()},onRight:()=>{t.inputDisplay=!t.inputDisplay,e.applySettings()}},{label:"Graphics Quality",value:()=>t.quality==="high"?"High":"Low",onLeft:()=>{t.quality=t.quality==="high"?"low":"high",e.applySettings()},onRight:()=>{t.quality=t.quality==="high"?"low":"high",e.applySettings()},desc:"Low disables shadows and high-DPI rendering for integrated graphics."},{label:"Toggle Fullscreen",onSelect:()=>e.toggleFullscreen(),desc:"Or press F11."},{label:"Back",onSelect:()=>this.back()}];this.menu=new ps(r,e.audio,{desc:!0});const a=Ye("div","page");a.innerHTML='<div class="options"><h1 class="display">Options</h1><div class="sub">Settings are saved automatically.</div></div>',a.querySelector(".options").appendChild(this.menu.el),e.ui.append(a,Ye("div","hint",`◀ ▶ Change ${e.mg("confirm")} Select ${e.mg("back")} Back`))}exit(){}tick(){const e=this.app.input.menu("any");if(e.back){this.app.audio.sfx("menuBack"),this.back();return}this.menu.handle(e)}frame(e){this.app.renderer.syncShowcase(e,{pos:[2,1.5,6],look:[0,1.1,0]})}}const Qn=new z1;Qn.go(new Ax(Qn));Qn.start();new URLSearchParams(location.search).has("debug")&&(window.skfDebug={app:Qn,fight(s,e,t="plenum",n="watch"){const i={mode:n,p1:Sh[s],p2:Sh[e],stage:Du[t],cpu:[n==="watch",n!=="versus"&&n!=="training"]},r=new er(Qn,i);return Qn.go(r),r},screen:()=>Qn.screen,move(s,e){const t=Qn.screen,n=t.match.fighters[s];n.meter=100;const i=e==="ult"?n.moves.ultimate:n.moves.specials[e];(n.actionable||n.state==="attack")&&n.startMove(i,.5,t.match)},place(s,e){const t=Qn.screen;t.match.fighters[0].x=s,t.match.fighters[1].x=e}});
