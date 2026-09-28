(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))i(n);new MutationObserver(n=>{for(const r of n)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&i(a)}).observe(document,{childList:!0,subtree:!0});function t(n){const r={};return n.integrity&&(r.integrity=n.integrity),n.referrerPolicy&&(r.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?r.credentials="include":n.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function i(n){if(n.ep)return;n.ep=!0;const r=t(n);fetch(n.href,r)}})();const Zd={minor:[0,2,3,5,7,8,10],phrygian:[0,1,3,5,7,8,10],dorian:[0,2,3,5,7,9,10],major:[0,2,4,5,7,9,11]},jd={minor:[0,5,2,6],phrygian:[0,1,0,6],dorian:[0,3,0,4],major:[0,4,5,3]},Yi=s=>440*Math.pow(2,(s-69)/12);class Qd{ctx=null;master;sfxBus;musicBus;comp;noiseBuf;seqTimer=null;nextNoteTime=0;step=0;music=null;musicSeed=1;volumes={master:.8,music:.5,sfx:.8};announcer=!0;voice=null;unlock(){if(!this.ctx){try{const n=window.AudioContext??window.webkitAudioContext;this.ctx=new n}catch{return}const e=this.ctx;this.comp=e.createDynamicsCompressor(),this.comp.threshold.value=-14,this.comp.ratio.value=4,this.master=e.createGain(),this.sfxBus=e.createGain(),this.musicBus=e.createGain(),this.sfxBus.connect(this.master),this.musicBus.connect(this.master),this.master.connect(this.comp),this.comp.connect(e.destination),this.applyVolumes();const t=e.sampleRate;this.noiseBuf=e.createBuffer(1,t,e.sampleRate);const i=this.noiseBuf.getChannelData(0);for(let n=0;n<t;n++)i[n]=Math.random()*2-1;this.pickVoice(),this.music&&this.startSequencer()}this.ctx.state==="suspended"&&this.ctx.resume().catch(()=>{})}get running(){return!!this.ctx&&this.ctx.state==="running"}applyVolumes(){this.ctx&&(this.master.gain.value=this.volumes.master,this.sfxBus.gain.value=this.volumes.sfx,this.musicBus.gain.value=this.volumes.music*.55)}pickVoice(){if(!("speechSynthesis"in window))return;const e=()=>{const t=speechSynthesis.getVoices();this.voice=t.find(i=>/en[-_](US|GB)/i.test(i.lang)&&/male|david|daniel|george|guy|fred/i.test(i.name))??t.find(i=>/^en/i.test(i.lang))??null};e(),speechSynthesis.onvoiceschanged=e}say(e){if(!(!this.announcer||!("speechSynthesis"in window)||this.volumes.master*this.volumes.sfx<=.01))try{speechSynthesis.cancel();const t=new SpeechSynthesisUtterance(e);this.voice&&(t.voice=this.voice),t.rate=.95,t.pitch=.55,t.volume=Math.min(1,this.volumes.master*this.volumes.sfx*1.2),speechSynthesis.speak(t)}catch{}}env(e,t,i,n,r){e.gain.setValueAtTime(1e-4,t),e.gain.exponentialRampToValueAtTime(Math.max(2e-4,n),t+i),e.gain.exponentialRampToValueAtTime(1e-4,t+i+r)}tone(e,t,i,n,r,a,o=0,c=.005){const l=this.ctx,h=l.currentTime+o,d=l.createOscillator(),u=l.createGain();d.type=e,d.frequency.setValueAtTime(t,h),i!==t&&d.frequency.exponentialRampToValueAtTime(Math.max(20,i),h+n),this.env(u,h,c,r,n),d.connect(u).connect(a),d.start(h),d.stop(h+c+n+.05)}noise(e,t,i,n,r,a,o,c=0){const l=this.ctx,h=l.currentTime+c,d=l.createBufferSource();d.buffer=this.noiseBuf,d.loop=!0;const u=l.createBiquadFilter();u.type=i,u.frequency.setValueAtTime(n,h),u.frequency.exponentialRampToValueAtTime(Math.max(30,r),h+e),u.Q.value=a;const f=l.createGain();this.env(f,h,.003,t,e),d.connect(u).connect(f).connect(o),d.start(h,Math.random()*.5),d.stop(h+e+.05)}sfx(e,t=1){if(!this.running)return;const i=this.sfxBus;switch(e){case"whoosh":this.noise(.12,.25,"bandpass",900*t,3e3*t,1.5,i);break;case"whooshHeavy":this.noise(.2,.35,"bandpass",500,1800,1.2,i);break;case"hitLight":this.noise(.07,.6,"lowpass",4e3,800,.8,i),this.tone("sine",220*t,90,.08,.5,i);break;case"hitHeavy":this.noise(.16,.8,"lowpass",3e3,300,.8,i),this.tone("sine",140*t,50,.2,.9,i),this.tone("square",90,40,.1,.15,i);break;case"hitSuper":this.noise(.3,.9,"lowpass",5e3,200,.6,i),this.tone("sine",120,35,.35,1,i),this.tone("sawtooth",300,60,.25,.2,i);break;case"block":this.tone("square",1400,900,.04,.18,i),this.noise(.06,.3,"highpass",2500,1500,1,i);break;case"jump":this.tone("sine",300,520,.08,.12,i);break;case"land":this.tone("sine",110,60,.08,.3,i);break;case"landHard":this.noise(.2,.5,"lowpass",900,120,.7,i),this.tone("sine",80,35,.25,.8,i);break;case"special":this.tone("sawtooth",220*t,660*t,.18,.12,i),this.noise(.2,.2,"bandpass",800,3e3,2,i);break;case"projectile":this.tone("square",660*t,220*t,.18,.1,i);break;case"superFlash":this.noise(.6,.4,"bandpass",400,4e3,1.5,i),[0,4,7,12].forEach((n,r)=>this.tone("sawtooth",Yi(57+n),Yi(57+n+12),.5,.08,i,r*.04));break;case"ko":this.noise(1.2,.8,"lowpass",2e3,60,.5,i),this.tone("sine",90,25,1.2,1,i);break;case"grab":this.noise(.1,.4,"bandpass",600,300,1,i),this.tone("sine",160,90,.1,.4,i);break;case"tech":this.tone("triangle",1600,1200,.15,.3,i),this.tone("triangle",2100,1700,.15,.2,i,.02);break;case"shield":this.tone("sine",1800,1200,.25,.25,i);break;case"reflect":this.tone("triangle",900,1800,.15,.3,i);break;case"armor":this.tone("square",300,200,.1,.2,i),this.tone("triangle",2400,2e3,.2,.15,i);break;case"teleport":this.tone("sine",400,1600,.12,.2,i),this.tone("sine",1600,400,.12,.2,i,.12);break;case"buff":[0,4,7].forEach((n,r)=>this.tone("triangle",Yi(72+n),Yi(72+n),.12,.12,i,r*.05));break;case"lifeline":this.tone("sine",70,50,.12,.8,i),this.tone("sine",70,50,.12,.8,i,.2),[0,7,12].forEach((n,r)=>this.tone("triangle",Yi(76+n),Yi(76+n),.3,.15,i,.4+r*.08));break;case"clash":this.tone("square",900,500,.12,.2,i),this.noise(.15,.4,"bandpass",2e3,800,2,i);break;case"counter":this.tone("sawtooth",500,1500,.1,.2,i);break;case"menuMove":this.tone("square",880,880,.035,.07,i);break;case"menuConfirm":this.tone("square",880,880,.05,.08,i),this.tone("square",1320,1320,.08,.08,i,.05);break;case"menuBack":this.tone("square",660,440,.08,.07,i);break;case"select":this.tone("sawtooth",440,880,.12,.12,i),this.noise(.2,.2,"highpass",3e3,6e3,1,i);break;case"round":this.tone("triangle",523,523,.25,.2,i);break;case"crowd":this.noise(1.2,.18,"bandpass",900,700,.6,i);break}}playMusic(e,t=1){this.music=e,this.musicSeed=t,this.stopSequencer(),e&&this.ctx&&this.startSequencer()}stopSequencer(){this.seqTimer!==null&&(clearInterval(this.seqTimer),this.seqTimer=null)}startSequencer(){!this.ctx||!this.music||(this.stopSequencer(),this.step=0,this.nextNoteTime=this.ctx.currentTime+.1,this.seqTimer=window.setInterval(()=>this.schedule(),25))}rnd(e){const t=Math.sin(e*12.9898+this.musicSeed*78.233)*43758.5453;return t-Math.floor(t)}schedule(){const e=this.ctx,t=this.music;if(!e||!t)return;const i=60/t.bpm/4;for(;this.nextNoteTime<e.currentTime+.12;)this.playStep(this.step,this.nextNoteTime-e.currentTime,t),this.nextNoteTime+=i,this.step++}playStep(e,t,i){const n=e%16,r=Math.floor(e/16)%4,a=Zd[i.mode],o=jd[i.mode][r],c=i.root+a[o%7]+(o>=7?12:0),l=(u,f=0)=>{const g=o+u;return i.root+a[(g%7+7)%7]+12*Math.floor(g/7)+f*12},h=Math.max(0,t);if(n%4===0&&this.kick(h),(n===4||n===12)&&this.snare(h),i.intensity>.85&&n===14&&this.snare(h,.5),this.hat(h,n%2===0?.08:.04),n%2===0){const u=n%8===6?12:0;this.voiceNote("sawtooth",Yi(c-12+u),60/i.bpm/2*.9,.12,h,700)}const d=Math.floor(e/64);if(this.rnd(n+d*16+r*3)<.45+i.intensity*.25){const u=[0,2,4,7,4,2,5,3][Math.floor(this.rnd(n*7+d)*8)];this.voiceNote("square",Yi(l(u,1)+12),60/i.bpm/4*.8,.045,h,3200)}if(n===0)for(const u of[0,2,4])this.voiceNote("triangle",Yi(l(u)),60/i.bpm*3.6,.035,h,1800,.08)}voiceNote(e,t,i,n,r,a,o=.005){const c=this.ctx,l=c.currentTime+r,h=c.createOscillator();h.type=e,h.frequency.value=t;const d=c.createBiquadFilter();d.type="lowpass",d.frequency.value=a;const u=c.createGain();this.env(u,l,o,n,i),h.connect(d).connect(u).connect(this.musicBus),h.start(l),h.stop(l+o+i+.05)}kick(e){const t=this.ctx,i=t.currentTime+e,n=t.createOscillator(),r=t.createGain();n.frequency.setValueAtTime(140,i),n.frequency.exponentialRampToValueAtTime(40,i+.12),this.env(r,i,.002,.5,.16),n.connect(r).connect(this.musicBus),n.start(i),n.stop(i+.2)}snare(e,t=.8){this.noise(.12,.28*t,"bandpass",1800,1200,.9,this.musicBus,e),this.tone("triangle",220,160,.06,.12*t,this.musicBus,e)}hat(e,t){this.noise(.03,t,"highpass",7e3,9e3,1,this.musicBus,e)}}const fe={LP:1,HP:2,LK:4,HK:8,SP:16,UL:32,SS:64,TH:128,START:256,SELECT:512},Go=fe.LP|fe.HP,_u=fe.LK|fe.HK,Ps=Go|_u,di=Object.freeze({dir:5,held:0,pressed:0}),Vo=["LP","HP","LK","HK","SP","UL","TH","SS","START","SELECT"],Ba={LP:"Light Punch",HP:"Heavy Punch",LK:"Light Kick",HK:"Heavy Kick",SP:"Special",UL:"Ultimate",SS:"Sidestep",TH:"Throw",START:"Pause",SELECT:"Reset (training)"},Ha={LP:2,HP:3,LK:0,HK:1,SP:5,UL:7,SS:4,TH:6,START:9,SELECT:8},ef={LP:0,HP:3,LK:1,HK:2,SP:5,UL:7,SS:4,TH:6,START:9,SELECT:8},$s={UP:["KeyW"],DOWN:["KeyS"],LEFT:["KeyA"],RIGHT:["KeyD"],LP:["KeyU"],HP:["KeyI"],LK:["KeyJ"],HK:["KeyK"],SP:["KeyO"],UL:["KeyL"],TH:["KeyH"],SS:["Space"],START:["Escape","Enter"],SELECT:["Backspace"]},Ks={UP:["ArrowUp"],DOWN:["ArrowDown"],LEFT:["ArrowLeft"],RIGHT:["ArrowRight"],LP:["Numpad4","Insert"],HP:["Numpad5","Home"],LK:["Numpad1","Delete"],HK:["Numpad2","End"],SP:["Numpad6","PageUp"],UL:["Numpad3","PageDown"],TH:["Numpad0"],SS:["NumpadDecimal","ShiftRight"],START:["NumpadEnter"],SELECT:["NumpadSubtract"]},tf={up:!1,down:!1,left:!1,right:!1,confirm:!1,back:!1,extra:!1,extra2:!1,start:!1,l1:!1,r1:!1,any:!1},yr={LP:fe.LP,HP:fe.HP,LK:fe.LK,HK:fe.HK,SP:fe.SP,UL:fe.UL,SS:fe.SS,TH:fe.TH,START:fe.START,SELECT:fe.SELECT};function kc(s,e){return e<0?s<0?7:s>0?9:8:e>0?s<0?1:s>0?3:2:s<0?4:s>0?6:5}function nf(s){const e=s.toLowerCase();return e.includes("dualsense")||e.includes("0ce6")||e.includes("0df2")?"dualsense":e.includes("054c")||e.includes("dualshock")||e.includes("wireless controller")||e.includes("playstation")?"dualshock":e.includes("xbox")||e.includes("xinput")||e.includes("045e")?"xbox":"generic"}function sf(s,e){try{const t=localStorage.getItem(s);return t?JSON.parse(t):e}catch{return e}}function Uc(s,e){try{localStorage.setItem(s,JSON.stringify(e))}catch{}}class rf{keys=new Set;tapped=new Set;prevKeys=new Set;pads=new Map;slotPad=[null,null];kb=[{dir:5,prevDir:5,repeat:0,menuDir:5},{dir:5,prevDir:5,repeat:0,menuDir:5}];bindings=sf("skf.bindings",{});rumbleEnabled=!0;lastDevice=["kb","kb"];onChange=null;captureCb=null;constructor(){window.addEventListener("keydown",e=>{(e.code==="Tab"||e.code==="Space"||e.code.startsWith("Arrow")||e.code==="Backspace")&&e.preventDefault(),this.keys.add(e.code),this.tapped.add(e.code)}),window.addEventListener("keyup",e=>this.keys.delete(e.code)),window.addEventListener("blur",()=>{this.keys.clear(),this.tapped.clear()}),window.addEventListener("gamepadconnected",e=>{this.refreshPads(),this.autoAssign(e.gamepad.index),this.onChange?.()}),window.addEventListener("gamepaddisconnected",e=>{const t=e.gamepad.index;this.pads.delete(t),this.slotPad=this.slotPad.map(i=>i===t?null:i),this.onChange?.()})}refreshPads(){const e=navigator.getGamepads?navigator.getGamepads():[];for(const t of e)!t||!t.connected||this.pads.has(t.index)||(this.pads.set(t.index,{index:t.index,id:t.id,kind:nf(t.id),standard:t.mapping==="standard",buttons:[],prevButtons:[],dir:5,prevDir:5,repeat:0,menuDir:5}),this.autoAssign(t.index),this.onChange?.())}autoAssign(e){this.slotPad.includes(e)||(this.slotPad[0]===null?(this.slotPad[0]=e,this.lastDevice[0]="pad"):this.slotPad[1]===null&&(this.slotPad[1]=e,this.lastDevice[1]="pad"))}swapSlots(){this.slotPad=[this.slotPad[1],this.slotPad[0]],this.onChange?.()}assignPad(e,t){const i=e===0?1:0;t!==null&&this.slotPad[i]===t&&(this.slotPad[i]=this.slotPad[e]),this.slotPad[e]=t,this.onChange?.()}connectedPads(){return[...this.pads.values()].map(e=>({index:e.index,id:e.id,kind:e.kind,standard:e.standard}))}padInfo(e){const t=this.slotPad[e];if(t===null)return null;const i=this.pads.get(t);return i?{index:i.index,id:i.id,kind:i.kind}:null}bindingFor(e){const t=this.pads.get(e);if(!t)return Ha;const i=this.bindings[t.id];return i||(t.standard?Ha:t.kind==="dualsense"||t.kind==="dualshock"?ef:Ha)}setBinding(e,t){const i=this.pads.get(e);i&&(this.bindings[i.id]=t,Uc("skf.bindings",this.bindings))}resetBinding(e){const t=this.pads.get(e);t&&(delete this.bindings[t.id],Uc("skf.bindings",this.bindings))}captureNextButton(e){this.captureCb=e}readPadDir(e,t){let i=0,n=0;const r=e.axes[0]??0,a=e.axes[1]??0;if(r<-.45?i=-1:r>.45&&(i=1),a<-.5?n=-1:a>.5&&(n=1),t){const o=e.buttons;o[12]?.pressed&&(n=-1),o[13]?.pressed&&(n=1),o[14]?.pressed&&(i=-1),o[15]?.pressed&&(i=1)}else if(e.axes.length>9){const o=e.axes[9];if(o>=-1.05&&o<=1.05){const c=Math.round((o+1)*3.5)%8,l=[0,1,1,1,0,-1,-1,-1][c],h=[-1,-1,0,1,1,1,0,-1][c];l&&(i=l),h&&(n=h)}}return kc(i,n)}poll(){this.prevKeys=new Set(this.keysSnapshot),this.keysSnapshot=new Set(this.keys);for(const t of this.tapped)this.keysSnapshot.add(t),this.prevKeys.has(t)&&!this.keys.has(t)&&this.prevKeys.delete(t);this.tapped.clear();for(let t=0;t<2;t++){const i=t===0?$s:Ks,n=this.kb[t];n.prevDir=n.dir;const r=(this.anyKey(i.RIGHT)?1:0)-(this.anyKey(i.LEFT)?1:0),a=(this.anyKey(i.DOWN)?1:0)-(this.anyKey(i.UP)?1:0);if(n.dir=kc(r,a),n.menuDir=this.dirRepeat(n),this.keysSnapshot.size>this.prevKeys.size)for(const o of this.keysSnapshot)!this.prevKeys.has(o)&&Object.values(i).some(c=>c.includes(o))&&(this.lastDevice[t]="kb")}this.refreshPads();const e=navigator.getGamepads?navigator.getGamepads():[];for(const t of e){if(!t)continue;const i=this.pads.get(t.index);if(!i)continue;i.prevButtons=i.buttons,i.buttons=t.buttons.map(r=>r.pressed||r.value>.5),i.prevDir=i.dir,i.dir=this.readPadDir(t,i.standard),i.menuDir=this.dirRepeat(i);const n=this.slotPad.indexOf(t.index);if(n>=0&&(i.buttons.some((r,a)=>r&&!i.prevButtons[a])||i.dir!==5&&i.prevDir===5)&&(this.lastDevice[n]="pad"),this.captureCb){for(let r=0;r<i.buttons.length;r++)if(i.buttons[r]&&!i.prevButtons[r]){const a=this.captureCb;this.captureCb=null,a(t.index,r);break}}}}keysSnapshot=new Set;anyKey(e){return e.some(t=>this.keysSnapshot.has(t))}anyKeyPressed(e){return e.some(t=>this.keysSnapshot.has(t)&&!this.prevKeys.has(t))}keyPressed(e){return this.keysSnapshot.has(e)&&!this.prevKeys.has(e)}player(e){const t=e===0?$s:Ks;let i=0,n=0;for(const o of Vo)this.anyKey(t[o])&&(i|=yr[o]),this.anyKeyPressed(t[o])&&(n|=yr[o]);let r=this.kb[e].dir;const a=this.slotPad[e];if(a!==null){const o=this.pads.get(a);if(o){const c=this.bindingFor(a);for(const l of Vo){const h=c[l];o.buttons[h]&&(i|=yr[l]),o.buttons[h]&&!o.prevButtons[h]&&(n|=yr[l])}o.dir!==5&&(r=o.dir)}}return{dir:r,held:i,pressed:n}}dirRepeat(e){return e.dir===5?(e.repeat=0,5):e.dir!==e.prevDir?(e.repeat=0,e.dir):(e.repeat++,e.repeat>22&&e.repeat%5===0?e.dir:5)}menu(e){const t={...tf},i=e==="any"?[0,1]:[e],n=a=>{a!==5&&((a===8||a===7||a===9)&&(t.up=!0),(a===2||a===1||a===3)&&(t.down=!0),(a===4||a===7||a===1)&&(t.left=!0),(a===6||a===9||a===3)&&(t.right=!0))};for(const a of i){const o=a===0?$s:Ks;n(this.kb[a].menuDir);const c=l=>this.anyKeyPressed(l);(c(o.LK)||c(o.LP)||a===0&&(this.keyPressed("Enter")||this.keyPressed("Space")))&&(t.confirm=!0),a===1&&(this.keyPressed("NumpadEnter")||this.keyPressed("Numpad1"))&&(t.confirm=!0),(c(o.HK)||a===0&&(this.keyPressed("Escape")||this.keyPressed("Backspace")))&&(t.back=!0),c(o.HP)&&(t.extra=!0),c(o.SP)&&(t.extra2=!0),c(o.START)&&(t.start=!0),c(o.TH)&&(t.l1=!0),c(o.UL)&&(t.r1=!0)}e==="any"&&this.keyPressed("Enter")&&(t.confirm=!0);const r=e==="any"?[...this.pads.keys()]:this.slotPad[e]!==null?[this.slotPad[e]]:[];for(const a of r){const o=this.pads.get(a);if(!o)continue;n(o.menuDir);const c=l=>!!o.buttons[l]&&!o.prevButtons[l];if(o.standard)c(0)&&(t.confirm=!0),c(1)&&(t.back=!0),c(3)&&(t.extra=!0),c(2)&&(t.extra2=!0),c(9)&&(t.start=!0),c(4)&&(t.l1=!0),c(5)&&(t.r1=!0);else{const l=o.kind==="dualsense"||o.kind==="dualshock";c(l?1:0)&&(t.confirm=!0),c(l?2:1)&&(t.back=!0),c(3)&&(t.extra=!0),c(l?0:2)&&(t.extra2=!0),c(9)&&(t.start=!0),c(4)&&(t.l1=!0),c(5)&&(t.r1=!0)}}return t.any=t.confirm||t.start||t.back||t.up||t.down||t.left||t.right||t.extra||t.extra2,t}anyPressed(){for(const e of this.keysSnapshot)if(!this.prevKeys.has(e))return!0;for(const e of this.pads.values())if(e.buttons.some((t,i)=>t&&!e.prevButtons[i]))return!0;return!1}rumble(e,t,i,n){if(!this.rumbleEnabled)return;const r=this.slotPad[e];if(r===null)return;const o=navigator.getGamepads?.()[r]?.vibrationActuator;if(o)try{o.playEffect("dual-rumble",{startDelay:0,duration:n,strongMagnitude:Math.min(1,t),weakMagnitude:Math.min(1,i)}).catch(()=>{})}catch{}}}const af={LP:"□",HP:"△",LK:"✕",HK:"○",SP:"R1",UL:"R2",SS:"L1",TH:"L2",START:"OPTIONS",SELECT:"CREATE"},of={LP:"X",HP:"Y",LK:"A",HK:"B",SP:"RB",UL:"RT",SS:"LB",TH:"LT",START:"MENU",SELECT:"VIEW"};function ms(s){return s.replace("Key","").replace("Numpad","Num ").replace("Arrow","").replace("Space","Space")}function lf(s,e,t=0){return e==="ps"?af[s]:e==="xbox"?of[s]:ms((t===0?$s:Ks)[s][0])}function cf(s,e){if(e!=="ps")return"g-key";switch(s){case"LP":return"g-square";case"HP":return"g-triangle";case"LK":return"g-cross";case"HK":return"g-circle";default:return"g-shoulder"}}const Nc={difficulty:1,roundsToWin:2,roundTime:99,masterVolume:.8,musicVolume:.5,sfxVolume:.8,announcer:!0,rumble:!0,showHitboxes:!1,inputDisplay:!1,quality:"high",faces:"photo"},yu="skf.settings";function hf(){try{const s=localStorage.getItem(yu);if(s)return{...Nc,...JSON.parse(s)}}catch{}return{...Nc}}function uf(s){try{localStorage.setItem(yu,JSON.stringify(s))}catch{}}const za=60,df=.017,Ga=10.5,Fc=7.6,ff=.62,pf=1e3,ir=100,Su=100,Va=42,mf=22,Sr=8,Oc=6,gf=18;function Bc(s){return s<=1?1:Math.max(.3,1-(s-1)*.12)}const zl="186",vf=0,Hc=1,xf=2,Ys=1,_f=2,Vs=3,Hn=0,ti=1,li=2,ln=0,Js=1,pa=2,zc=3,Gc=4,yf=5,gs=100,Sf=101,Mf=102,bf=103,wf=104,Ef=200,Tf=201,Af=202,Cf=203,Mu=204,bu=205,Pf=206,Rf=207,Lf=208,If=209,Df=210,kf=211,Uf=212,Nf=213,Ff=214,Wo=0,Xo=1,qo=2,nr=3,$o=4,Ko=5,Yo=6,Jo=7,wu=0,Of=1,Bf=2,Vi=0,Eu=1,Tu=2,Au=3,Pa=4,Cu=5,Pu=6,Ru=7,Lu=300,zn=301,Ss=302,Wa=303,Xa=304,Ra=306,ma=1e3,an=1001,Zo=1002,Xt=1003,Hf=1004,Mr=1005,ei=1006,qa=1007,Fn=1008,_i=1009,Iu=1010,Du=1011,sr=1012,Gl=1013,Xi=1014,Li=1015,qi=1016,Vl=1017,Wl=1018,rr=1020,ku=35902,Uu=35899,Nu=1021,Fu=1022,Ei=1023,un=1026,On=1027,Xl=1028,ql=1029,Gn=1030,$l=1031,Kl=1033,aa=33776,oa=33777,la=33778,ca=33779,jo=35840,Qo=35841,el=35842,tl=35843,il=36196,nl=37492,sl=37496,rl=37488,al=37489,ga=37490,ol=37491,ll=37808,cl=37809,hl=37810,ul=37811,dl=37812,fl=37813,pl=37814,ml=37815,gl=37816,vl=37817,xl=37818,_l=37819,yl=37820,Sl=37821,Ml=36492,bl=36494,wl=36495,El=36283,Tl=36284,va=36285,Al=36286,zf=3200,xa=0,Gf=1,En="",Yt="srgb",_a="srgb-linear",ya="linear",Mt="srgb",$a=7680,Vf=519,Wf=512,Xf=513,qf=514,Yl=515,$f=516,Kf=517,Jl=518,Yf=519,Ou=35044,Jf=35048,Vc="300 es",Gi=2e3,ar=2001;function Zf(s){for(let e=s.length-1;e>=0;--e)if(s[e]>=65535)return!0;return!1}function Sa(s){return document.createElementNS("http://www.w3.org/1999/xhtml",s)}function jf(){const s=Sa("canvas");return s.style.display="block",s}const Wc={};function Ma(...s){const e="THREE."+s.shift();console.log(e,...s)}function Bu(s){const e=s[0];if(typeof e=="string"&&e.startsWith("TSL:")){const t=s[1];t&&t.isStackTrace?s[0]+=" "+t.getLocation():s[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return s}function Ze(...s){s=Bu(s);const e="THREE."+s.shift();{const t=s[0];t&&t.isStackTrace?console.warn(t.getError(e)):console.warn(e,...s)}}function pt(...s){s=Bu(s);const e="THREE."+s.shift();{const t=s[0];t&&t.isStackTrace?console.error(t.getError(e)):console.error(e,...s)}}function _s(...s){const e=s.join(" ");e in Wc||(Wc[e]=!0,Ze(...s))}function Qf(s,e,t){return new Promise(function(i,n){function r(){switch(s.clientWaitSync(e,s.SYNC_FLUSH_COMMANDS_BIT,0)){case s.WAIT_FAILED:n();break;case s.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:i()}}setTimeout(r,t)})}const ep={[Wo]:Xo,[qo]:Yo,[$o]:Jo,[nr]:Ko,[Xo]:Wo,[Yo]:qo,[Jo]:$o,[Ko]:nr};class Xn{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){const i=this._listeners;return i===void 0?!1:i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){const i=this._listeners;if(i===void 0)return;const n=i[e];if(n!==void 0){const r=n.indexOf(t);r!==-1&&n.splice(r,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const i=t[e.type];if(i!==void 0){e.target=this;const n=i.slice(0);for(let r=0,a=n.length;r<a;r++)n[r].call(this,e);e.target=null}}}const Zt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Ka=Math.PI/180,Cl=180/Math.PI;function cn(){const s=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Zt[s&255]+Zt[s>>8&255]+Zt[s>>16&255]+Zt[s>>24&255]+"-"+Zt[e&255]+Zt[e>>8&255]+"-"+Zt[e>>16&15|64]+Zt[e>>24&255]+"-"+Zt[t&63|128]+Zt[t>>8&255]+"-"+Zt[t>>16&255]+Zt[t>>24&255]+Zt[i&255]+Zt[i>>8&255]+Zt[i>>16&255]+Zt[i>>24&255]).toLowerCase()}function ht(s,e,t){return Math.max(e,Math.min(t,s))}function tp(s,e){return(s%e+e)%e}function Ya(s,e,t){return(1-t)*s+t*e}function zi(s,e){switch(e.constructor){case Float32Array:return s;case Uint32Array:return s/4294967295;case Uint16Array:return s/65535;case Uint8Array:case Uint8ClampedArray:return s/255;case Int32Array:return Math.max(s/2147483647,-1);case Int16Array:return Math.max(s/32767,-1);case Int8Array:return Math.max(s/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function Et(s,e){switch(e.constructor){case Float32Array:return s;case Uint32Array:return Math.round(s*4294967295);case Uint16Array:return Math.round(s*65535);case Uint8Array:case Uint8ClampedArray:return Math.round(s*255);case Int32Array:return Math.round(s*2147483647);case Int16Array:return Math.round(s*32767);case Int8Array:return Math.round(s*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}const _c=class _c{constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("THREE.Vector2: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,i=this.y,n=e.elements;return this.x=n[0]*t+n[3]*i+n[6],this.y=n[1]*t+n[4]*i+n[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=ht(this.x,e.x,t.x),this.y=ht(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=ht(this.x,e,t),this.y=ht(this.y,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(ht(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(ht(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const i=Math.cos(t),n=Math.sin(t),r=this.x-e.x,a=this.y-e.y;return this.x=r*i-a*n+e.x,this.y=r*n+a*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};_c.prototype.isVector2=!0;let ae=_c;class ws{constructor(e=0,t=0,i=0,n=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=n}static slerpFlat(e,t,i,n,r,a,o){let c=i[n+0],l=i[n+1],h=i[n+2],d=i[n+3],u=r[a+0],f=r[a+1],g=r[a+2],S=r[a+3];if(d!==S||c!==u||l!==f||h!==g){let p=c*u+l*f+h*g+d*S;p<0&&(u=-u,f=-f,g=-g,S=-S,p=-p);let m=1-o;if(p<.9995){const M=Math.acos(p),T=Math.sin(M);m=Math.sin(m*M)/T,o=Math.sin(o*M)/T,c=c*m+u*o,l=l*m+f*o,h=h*m+g*o,d=d*m+S*o}else{c=c*m+u*o,l=l*m+f*o,h=h*m+g*o,d=d*m+S*o;const M=1/Math.sqrt(c*c+l*l+h*h+d*d);c*=M,l*=M,h*=M,d*=M}}e[t]=c,e[t+1]=l,e[t+2]=h,e[t+3]=d}static multiplyQuaternionsFlat(e,t,i,n,r,a){const o=i[n],c=i[n+1],l=i[n+2],h=i[n+3],d=r[a],u=r[a+1],f=r[a+2],g=r[a+3];return e[t]=o*g+h*d+c*f-l*u,e[t+1]=c*g+h*u+l*d-o*f,e[t+2]=l*g+h*f+o*u-c*d,e[t+3]=h*g-o*d-c*u-l*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,n){return this._x=e,this._y=t,this._z=i,this._w=n,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const i=e._x,n=e._y,r=e._z,a=e._order,o=Math.cos,c=Math.sin,l=o(i/2),h=o(n/2),d=o(r/2),u=c(i/2),f=c(n/2),g=c(r/2);switch(a){case"XYZ":this._x=u*h*d+l*f*g,this._y=l*f*d-u*h*g,this._z=l*h*g+u*f*d,this._w=l*h*d-u*f*g;break;case"YXZ":this._x=u*h*d+l*f*g,this._y=l*f*d-u*h*g,this._z=l*h*g-u*f*d,this._w=l*h*d+u*f*g;break;case"ZXY":this._x=u*h*d-l*f*g,this._y=l*f*d+u*h*g,this._z=l*h*g+u*f*d,this._w=l*h*d-u*f*g;break;case"ZYX":this._x=u*h*d-l*f*g,this._y=l*f*d+u*h*g,this._z=l*h*g-u*f*d,this._w=l*h*d+u*f*g;break;case"YZX":this._x=u*h*d+l*f*g,this._y=l*f*d+u*h*g,this._z=l*h*g-u*f*d,this._w=l*h*d-u*f*g;break;case"XZY":this._x=u*h*d-l*f*g,this._y=l*f*d-u*h*g,this._z=l*h*g+u*f*d,this._w=l*h*d+u*f*g;break;default:Ze("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const i=t/2,n=Math.sin(i);return this._x=e.x*n,this._y=e.y*n,this._z=e.z*n,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,i=t[0],n=t[4],r=t[8],a=t[1],o=t[5],c=t[9],l=t[2],h=t[6],d=t[10],u=i+o+d;if(u>0){const f=.5/Math.sqrt(u+1);this._w=.25/f,this._x=(h-c)*f,this._y=(r-l)*f,this._z=(a-n)*f}else if(i>o&&i>d){const f=2*Math.sqrt(1+i-o-d);this._w=(h-c)/f,this._x=.25*f,this._y=(n+a)/f,this._z=(r+l)/f}else if(o>d){const f=2*Math.sqrt(1+o-i-d);this._w=(r-l)/f,this._x=(n+a)/f,this._y=.25*f,this._z=(c+h)/f}else{const f=2*Math.sqrt(1+d-i-o);this._w=(a-n)/f,this._x=(r+l)/f,this._y=(c+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<1e-8?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(ht(this.dot(e),-1,1)))}rotateTowards(e,t){const i=this.angleTo(e);if(i===0)return this;const n=Math.min(1,t/i);return this.slerp(e,n),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const i=e._x,n=e._y,r=e._z,a=e._w,o=t._x,c=t._y,l=t._z,h=t._w;return this._x=i*h+a*o+n*l-r*c,this._y=n*h+a*c+r*o-i*l,this._z=r*h+a*l+i*c-n*o,this._w=a*h-i*o-n*c-r*l,this._onChangeCallback(),this}slerp(e,t){let i=e._x,n=e._y,r=e._z,a=e._w,o=this.dot(e);o<0&&(i=-i,n=-n,r=-r,a=-a,o=-o);let c=1-t;if(o<.9995){const l=Math.acos(o),h=Math.sin(l);c=Math.sin(c*l)/h,t=Math.sin(t*l)/h,this._x=this._x*c+i*t,this._y=this._y*c+n*t,this._z=this._z*c+r*t,this._w=this._w*c+a*t,this._onChangeCallback()}else this._x=this._x*c+i*t,this._y=this._y*c+n*t,this._z=this._z*c+r*t,this._w=this._w*c+a*t,this.normalize();return this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),i=Math.random(),n=Math.sqrt(1-i),r=Math.sqrt(i);return this.set(n*Math.sin(e),n*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}const yc=class yc{constructor(e=0,t=0,i=0){this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("THREE.Vector3: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Xc.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Xc.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,i=this.y,n=this.z,r=e.elements;return this.x=r[0]*t+r[3]*i+r[6]*n,this.y=r[1]*t+r[4]*i+r[7]*n,this.z=r[2]*t+r[5]*i+r[8]*n,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,i=this.y,n=this.z,r=e.elements,a=1/(r[3]*t+r[7]*i+r[11]*n+r[15]);return this.x=(r[0]*t+r[4]*i+r[8]*n+r[12])*a,this.y=(r[1]*t+r[5]*i+r[9]*n+r[13])*a,this.z=(r[2]*t+r[6]*i+r[10]*n+r[14])*a,this}applyQuaternion(e){const t=this.x,i=this.y,n=this.z,r=e.x,a=e.y,o=e.z,c=e.w,l=2*(a*n-o*i),h=2*(o*t-r*n),d=2*(r*i-a*t);return this.x=t+c*l+a*d-o*h,this.y=i+c*h+o*l-r*d,this.z=n+c*d+r*h-a*l,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,i=this.y,n=this.z,r=e.elements;return this.x=r[0]*t+r[4]*i+r[8]*n,this.y=r[1]*t+r[5]*i+r[9]*n,this.z=r[2]*t+r[6]*i+r[10]*n,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=ht(this.x,e.x,t.x),this.y=ht(this.y,e.y,t.y),this.z=ht(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=ht(this.x,e,t),this.y=ht(this.y,e,t),this.z=ht(this.z,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(ht(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const i=e.x,n=e.y,r=e.z,a=t.x,o=t.y,c=t.z;return this.x=n*c-r*o,this.y=r*a-i*c,this.z=i*o-n*a,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return Ja.copy(this).projectOnVector(e),this.sub(Ja)}reflect(e){return this.sub(Ja.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(ht(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y,n=this.z-e.z;return t*t+i*i+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){const n=Math.sin(t)*e;return this.x=n*Math.sin(i),this.y=Math.cos(t)*e,this.z=n*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),n=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=n,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,i=Math.sqrt(1-t*t);return this.x=i*Math.cos(e),this.y=t,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};yc.prototype.isVector3=!0;let R=yc;const Ja=new R,Xc=new ws,Sc=class Sc{constructor(e,t,i,n,r,a,o,c,l){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,i,n,r,a,o,c,l)}set(e,t,i,n,r,a,o,c,l){const h=this.elements;return h[0]=e,h[1]=n,h[2]=o,h[3]=t,h[4]=r,h[5]=c,h[6]=i,h[7]=a,h[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,n=t.elements,r=this.elements,a=i[0],o=i[3],c=i[6],l=i[1],h=i[4],d=i[7],u=i[2],f=i[5],g=i[8],S=n[0],p=n[3],m=n[6],M=n[1],T=n[4],_=n[7],b=n[2],E=n[5],P=n[8];return r[0]=a*S+o*M+c*b,r[3]=a*p+o*T+c*E,r[6]=a*m+o*_+c*P,r[1]=l*S+h*M+d*b,r[4]=l*p+h*T+d*E,r[7]=l*m+h*_+d*P,r[2]=u*S+f*M+g*b,r[5]=u*p+f*T+g*E,r[8]=u*m+f*_+g*P,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[1],n=e[2],r=e[3],a=e[4],o=e[5],c=e[6],l=e[7],h=e[8];return t*a*h-t*o*l-i*r*h+i*o*c+n*r*l-n*a*c}invert(){const e=this.elements,t=e[0],i=e[1],n=e[2],r=e[3],a=e[4],o=e[5],c=e[6],l=e[7],h=e[8],d=h*a-o*l,u=o*c-h*r,f=l*r-a*c,g=t*d+i*u+n*f;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const S=1/g;return e[0]=d*S,e[1]=(n*l-h*i)*S,e[2]=(o*i-n*a)*S,e[3]=u*S,e[4]=(h*t-n*c)*S,e[5]=(n*r-o*t)*S,e[6]=f*S,e[7]=(i*c-l*t)*S,e[8]=(a*t-i*r)*S,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,n,r,a,o){const c=Math.cos(r),l=Math.sin(r);return this.set(i*c,i*l,-i*(c*a+l*o)+a+e,-n*l,n*c,-n*(-l*a+c*o)+o+t,0,0,1),this}scale(e,t){return _s("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(Za.makeScale(e,t)),this}rotate(e){return _s("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(Za.makeRotation(-e)),this}translate(e,t){return _s("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(Za.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,i,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,i=e.elements;for(let n=0;n<9;n++)if(t[n]!==i[n])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}};Sc.prototype.isMatrix3=!0;let tt=Sc;const Za=new tt,qc=new tt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),$c=new tt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function ip(){const s={enabled:!0,workingColorSpace:_a,spaces:{},convert:function(n,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===Mt&&(n.r=hn(n.r),n.g=hn(n.g),n.b=hn(n.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(n.applyMatrix3(this.spaces[r].toXYZ),n.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===Mt&&(n.r=ys(n.r),n.g=ys(n.g),n.b=ys(n.b))),n},workingToColorSpace:function(n,r){return this.convert(n,this.workingColorSpace,r)},colorSpaceToWorking:function(n,r){return this.convert(n,r,this.workingColorSpace)},getPrimaries:function(n){return this.spaces[n].primaries},getTransfer:function(n){return n===En?ya:this.spaces[n].transfer},getToneMappingMode:function(n){return this.spaces[n].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(n,r=this.workingColorSpace){return n.fromArray(this.spaces[r].luminanceCoefficients)},define:function(n){Object.assign(this.spaces,n)},_getMatrix:function(n,r,a){return n.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(n){return this.spaces[n].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(n=this.workingColorSpace){return this.spaces[n].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(n,r){return _s("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),s.workingToColorSpace(n,r)},toWorkingColorSpace:function(n,r){return _s("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),s.colorSpaceToWorking(n,r)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],i=[.3127,.329];return s.define({[_a]:{primaries:e,whitePoint:i,transfer:ya,toXYZ:qc,fromXYZ:$c,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:Yt},outputColorSpaceConfig:{drawingBufferColorSpace:Yt}},[Yt]:{primaries:e,whitePoint:i,transfer:Mt,toXYZ:qc,fromXYZ:$c,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:Yt}}}),s}const dt=ip();function hn(s){return s<.04045?s*.0773993808:Math.pow(s*.9478672986+.0521327014,2.4)}function ys(s){return s<.0031308?s*12.92:1.055*Math.pow(s,.41666)-.055}let Jn;class np{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let i;if(e instanceof HTMLCanvasElement)i=e;else{Jn===void 0&&(Jn=Sa("canvas")),Jn.width=e.width,Jn.height=e.height;const n=Jn.getContext("2d");e instanceof ImageData?n.putImageData(e,0,0):n.drawImage(e,0,0,e.width,e.height),i=Jn}return i.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=Sa("canvas");t.width=e.width,t.height=e.height;const i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const n=i.getImageData(0,0,e.width,e.height),r=n.data;for(let a=0;a<r.length;a++)r[a]=hn(r[a]/255)*255;return i.putImageData(n,0,0),t}else if(e.data){const t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor(hn(t[i]/255)*255):t[i]=hn(t[i]);return{data:t,width:e.width,height:e.height}}else return Ze("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let sp=0;class Zl{constructor(e=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:sp++}),this.uuid=cn(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},n=this.data;if(n!==null){let r;if(Array.isArray(n)){r=[];for(let a=0,o=n.length;a<o;a++)n[a].isDataTexture?r.push(ja(n[a].image)):r.push(ja(n[a]))}else r=ja(n);i.url=r}return t||(e.images[this.uuid]=i),i}}function ja(s){return typeof HTMLImageElement<"u"&&s instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&s instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&s instanceof ImageBitmap?np.getDataURL(s):s.data?{data:Array.from(s.data),width:s.width,height:s.height,type:s.data.constructor.name}:(Ze("Texture: Unable to serialize Texture."),{})}let rp=0;const Qa=new R;class ii extends Xn{constructor(e=ii.DEFAULT_IMAGE,t=ii.DEFAULT_MAPPING,i=an,n=an,r=ei,a=Fn,o=Ei,c=_i,l=ii.DEFAULT_ANISOTROPY,h=En){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:rp++}),this.uuid=cn(),this.name="",this.source=new Zl(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=i,this.wrapT=n,this.magFilter=r,this.minFilter=a,this.anisotropy=l,this.format=o,this.internalFormat=null,this.type=c,this.offset=new ae(0,0),this.repeat=new ae(1,1),this.center=new ae(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new tt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(Qa).x}get height(){return this.source.getSize(Qa).y}get depth(){return this.source.getSize(Qa).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const i=e[t];if(i===void 0){Ze(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const n=this[t];if(n===void 0){Ze(`Texture.setValues(): property '${t}' does not exist.`);continue}n&&i&&n.isVector2&&i.isVector2||n&&i&&n.isVector3&&i.isVector3||n&&i&&n.isMatrix3&&i.isMatrix3?n.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Lu)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case ma:e.x=e.x-Math.floor(e.x);break;case an:e.x=e.x<0?0:1;break;case Zo:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case ma:e.y=e.y-Math.floor(e.y);break;case an:e.y=e.y<0?0:1;break;case Zo:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}ii.DEFAULT_IMAGE=null;ii.DEFAULT_MAPPING=Lu;ii.DEFAULT_ANISOTROPY=1;const Mc=class Mc{constructor(e=0,t=0,i=0,n=1){this.x=e,this.y=t,this.z=i,this.w=n}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,n){return this.x=e,this.y=t,this.z=i,this.w=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("THREE.Vector4: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,i=this.y,n=this.z,r=this.w,a=e.elements;return this.x=a[0]*t+a[4]*i+a[8]*n+a[12]*r,this.y=a[1]*t+a[5]*i+a[9]*n+a[13]*r,this.z=a[2]*t+a[6]*i+a[10]*n+a[14]*r,this.w=a[3]*t+a[7]*i+a[11]*n+a[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,n,r;const c=e.elements,l=c[0],h=c[4],d=c[8],u=c[1],f=c[5],g=c[9],S=c[2],p=c[6],m=c[10];if(Math.abs(h-u)<.01&&Math.abs(d-S)<.01&&Math.abs(g-p)<.01){if(Math.abs(h+u)<.1&&Math.abs(d+S)<.1&&Math.abs(g+p)<.1&&Math.abs(l+f+m-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const T=(l+1)/2,_=(f+1)/2,b=(m+1)/2,E=(h+u)/4,P=(d+S)/4,x=(g+p)/4;return T>_&&T>b?T<.01?(i=0,n=.707106781,r=.707106781):(i=Math.sqrt(T),n=E/i,r=P/i):_>b?_<.01?(i=.707106781,n=0,r=.707106781):(n=Math.sqrt(_),i=E/n,r=x/n):b<.01?(i=.707106781,n=.707106781,r=0):(r=Math.sqrt(b),i=P/r,n=x/r),this.set(i,n,r,t),this}let M=Math.sqrt((p-g)*(p-g)+(d-S)*(d-S)+(u-h)*(u-h));return Math.abs(M)<.001&&(M=1),this.x=(p-g)/M,this.y=(d-S)/M,this.z=(u-h)/M,this.w=Math.acos((l+f+m-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=ht(this.x,e.x,t.x),this.y=ht(this.y,e.y,t.y),this.z=ht(this.z,e.z,t.z),this.w=ht(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=ht(this.x,e,t),this.y=ht(this.y,e,t),this.z=ht(this.z,e,t),this.w=ht(this.w,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(ht(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};Mc.prototype.isVector4=!0;let It=Mc;class ap extends Xn{constructor(e=1,t=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:ei,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},i),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=i.depth,this.scissor=new It(0,0,e,t),this.scissorTest=!1,this.viewport=new It(0,0,e,t),this.textures=[];const n={width:e,height:t,depth:i.depth},r=new ii(n),a=i.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveColorBuffer=i.resolveColorBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.storeMultisampledColorBuffer=i.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=i.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=i.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview,this.useArrayDepthTexture=i.useArrayDepthTexture}_setTextureOptions(e={}){const t={minFilter:ei,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),e!==null&&e.renderTarget===null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,i=1){if(this.width!==e||this.height!==t||this.depth!==i){this.width=e,this.height=t,this.depth=i;for(let n=0,r=this.textures.length;n<r;n++)this.textures[n].image.width=e,this.textures[n].image.height=t,this.textures[n].image.depth=i,this.textures[n].isData3DTexture!==!0&&(this.textures[n].isArrayTexture=this.textures[n].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,i=e.textures.length;t<i;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const n=Object.assign({},e.textures[t].image);this.textures[t].source=new Zl(n)}if(this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveColorBuffer=e.resolveColorBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,this.storeMultisampledColorBuffer=e.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=e.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=e.storeMultisampledStencilBuffer,e.depthTexture!==null)if(e.depthTexture.renderTarget===e){const t=e.depthTexture.clone();t.renderTarget=null,this.depthTexture=t}else this.depthTexture=e.depthTexture;return this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Ii extends ap{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}}class Hu extends ii{constructor(e=null,t=1,i=1,n=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:n},this.magFilter=Xt,this.minFilter=Xt,this.wrapR=an,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class op extends ii{constructor(e=null,t=1,i=1,n=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:n},this.magFilter=Xt,this.minFilter=Xt,this.wrapR=an,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}}const Ca=class Ca{constructor(e,t,i,n,r,a,o,c,l,h,d,u,f,g,S,p){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,i,n,r,a,o,c,l,h,d,u,f,g,S,p)}set(e,t,i,n,r,a,o,c,l,h,d,u,f,g,S,p){const m=this.elements;return m[0]=e,m[4]=t,m[8]=i,m[12]=n,m[1]=r,m[5]=a,m[9]=o,m[13]=c,m[2]=l,m[6]=h,m[10]=d,m[14]=u,m[3]=f,m[7]=g,m[11]=S,m[15]=p,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Ca().fromArray(this.elements)}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){const t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),i.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this)}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();const t=this.elements,i=e.elements,n=1/Zn.setFromMatrixColumn(e,0).length(),r=1/Zn.setFromMatrixColumn(e,1).length(),a=1/Zn.setFromMatrixColumn(e,2).length();return t[0]=i[0]*n,t[1]=i[1]*n,t[2]=i[2]*n,t[3]=0,t[4]=i[4]*r,t[5]=i[5]*r,t[6]=i[6]*r,t[7]=0,t[8]=i[8]*a,t[9]=i[9]*a,t[10]=i[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,i=e.x,n=e.y,r=e.z,a=Math.cos(i),o=Math.sin(i),c=Math.cos(n),l=Math.sin(n),h=Math.cos(r),d=Math.sin(r);if(e.order==="XYZ"){const u=a*h,f=a*d,g=o*h,S=o*d;t[0]=c*h,t[4]=-c*d,t[8]=l,t[1]=f+g*l,t[5]=u-S*l,t[9]=-o*c,t[2]=S-u*l,t[6]=g+f*l,t[10]=a*c}else if(e.order==="YXZ"){const u=c*h,f=c*d,g=l*h,S=l*d;t[0]=u+S*o,t[4]=g*o-f,t[8]=a*l,t[1]=a*d,t[5]=a*h,t[9]=-o,t[2]=f*o-g,t[6]=S+u*o,t[10]=a*c}else if(e.order==="ZXY"){const u=c*h,f=c*d,g=l*h,S=l*d;t[0]=u-S*o,t[4]=-a*d,t[8]=g+f*o,t[1]=f+g*o,t[5]=a*h,t[9]=S-u*o,t[2]=-a*l,t[6]=o,t[10]=a*c}else if(e.order==="ZYX"){const u=a*h,f=a*d,g=o*h,S=o*d;t[0]=c*h,t[4]=g*l-f,t[8]=u*l+S,t[1]=c*d,t[5]=S*l+u,t[9]=f*l-g,t[2]=-l,t[6]=o*c,t[10]=a*c}else if(e.order==="YZX"){const u=a*c,f=a*l,g=o*c,S=o*l;t[0]=c*h,t[4]=S-u*d,t[8]=g*d+f,t[1]=d,t[5]=a*h,t[9]=-o*h,t[2]=-l*h,t[6]=f*d+g,t[10]=u-S*d}else if(e.order==="XZY"){const u=a*c,f=a*l,g=o*c,S=o*l;t[0]=c*h,t[4]=-d,t[8]=l*h,t[1]=u*d+S,t[5]=a*h,t[9]=f*d-g,t[2]=g*d-f,t[6]=o*h,t[10]=S*d+u}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(lp,e,cp)}lookAt(e,t,i){const n=this.elements;return mi.subVectors(e,t),mi.lengthSq()===0&&(mi.z=1),mi.normalize(),vn.crossVectors(i,mi),vn.lengthSq()===0&&(Math.abs(i.z)===1?mi.x+=1e-4:mi.z+=1e-4,mi.normalize(),vn.crossVectors(i,mi)),vn.normalize(),br.crossVectors(mi,vn),n[0]=vn.x,n[4]=br.x,n[8]=mi.x,n[1]=vn.y,n[5]=br.y,n[9]=mi.y,n[2]=vn.z,n[6]=br.z,n[10]=mi.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,n=t.elements,r=this.elements,a=i[0],o=i[4],c=i[8],l=i[12],h=i[1],d=i[5],u=i[9],f=i[13],g=i[2],S=i[6],p=i[10],m=i[14],M=i[3],T=i[7],_=i[11],b=i[15],E=n[0],P=n[4],x=n[8],w=n[12],C=n[1],I=n[5],N=n[9],B=n[13],U=n[2],O=n[6],K=n[10],V=n[14],ne=n[3],X=n[7],Q=n[11],j=n[15];return r[0]=a*E+o*C+c*U+l*ne,r[4]=a*P+o*I+c*O+l*X,r[8]=a*x+o*N+c*K+l*Q,r[12]=a*w+o*B+c*V+l*j,r[1]=h*E+d*C+u*U+f*ne,r[5]=h*P+d*I+u*O+f*X,r[9]=h*x+d*N+u*K+f*Q,r[13]=h*w+d*B+u*V+f*j,r[2]=g*E+S*C+p*U+m*ne,r[6]=g*P+S*I+p*O+m*X,r[10]=g*x+S*N+p*K+m*Q,r[14]=g*w+S*B+p*V+m*j,r[3]=M*E+T*C+_*U+b*ne,r[7]=M*P+T*I+_*O+b*X,r[11]=M*x+T*N+_*K+b*Q,r[15]=M*w+T*B+_*V+b*j,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[4],n=e[8],r=e[12],a=e[1],o=e[5],c=e[9],l=e[13],h=e[2],d=e[6],u=e[10],f=e[14],g=e[3],S=e[7],p=e[11],m=e[15],M=c*f-l*u,T=o*f-l*d,_=o*u-c*d,b=a*f-l*h,E=a*u-c*h,P=a*d-o*h;return t*(S*M-p*T+m*_)-i*(g*M-p*b+m*E)+n*(g*T-S*b+m*P)-r*(g*_-S*E+p*P)}determinantAffine(){const e=this.elements,t=e[0],i=e[4],n=e[8],r=e[1],a=e[5],o=e[9],c=e[2],l=e[6],h=e[10];return t*(a*h-o*l)-i*(r*h-o*c)+n*(r*l-a*c)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){const n=this.elements;return e.isVector3?(n[12]=e.x,n[13]=e.y,n[14]=e.z):(n[12]=e,n[13]=t,n[14]=i),this}invert(){const e=this.elements,t=e[0],i=e[1],n=e[2],r=e[3],a=e[4],o=e[5],c=e[6],l=e[7],h=e[8],d=e[9],u=e[10],f=e[11],g=e[12],S=e[13],p=e[14],m=e[15],M=t*o-i*a,T=t*c-n*a,_=t*l-r*a,b=i*c-n*o,E=i*l-r*o,P=n*l-r*c,x=h*S-d*g,w=h*p-u*g,C=h*m-f*g,I=d*p-u*S,N=d*m-f*S,B=u*m-f*p,U=M*B-T*N+_*I+b*C-E*w+P*x;if(U===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const O=1/U;return e[0]=(o*B-c*N+l*I)*O,e[1]=(n*N-i*B-r*I)*O,e[2]=(S*P-p*E+m*b)*O,e[3]=(u*E-d*P-f*b)*O,e[4]=(c*C-a*B-l*w)*O,e[5]=(t*B-n*C+r*w)*O,e[6]=(p*_-g*P-m*T)*O,e[7]=(h*P-u*_+f*T)*O,e[8]=(a*N-o*C+l*x)*O,e[9]=(i*C-t*N-r*x)*O,e[10]=(g*E-S*_+m*M)*O,e[11]=(d*_-h*E-f*M)*O,e[12]=(o*w-a*I-c*x)*O,e[13]=(t*I-i*w+n*x)*O,e[14]=(S*T-g*b-p*M)*O,e[15]=(h*b-d*T+u*M)*O,this}scale(e){const t=this.elements,i=e.x,n=e.y,r=e.z;return t[0]*=i,t[4]*=n,t[8]*=r,t[1]*=i,t[5]*=n,t[9]*=r,t[2]*=i,t[6]*=n,t[10]*=r,t[3]*=i,t[7]*=n,t[11]*=r,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],n=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,n))}makeTranslation(e,t,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const i=Math.cos(t),n=Math.sin(t),r=1-i,a=e.x,o=e.y,c=e.z,l=r*a,h=r*o;return this.set(l*a+i,l*o-n*c,l*c+n*o,0,l*o+n*c,h*o+i,h*c-n*a,0,l*c-n*o,h*c+n*a,r*c*c+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,n,r,a){return this.set(1,i,r,0,e,1,a,0,t,n,1,0,0,0,0,1),this}compose(e,t,i){const n=this.elements,r=t._x,a=t._y,o=t._z,c=t._w,l=r+r,h=a+a,d=o+o,u=r*l,f=r*h,g=r*d,S=a*h,p=a*d,m=o*d,M=c*l,T=c*h,_=c*d,b=i.x,E=i.y,P=i.z;return n[0]=(1-(S+m))*b,n[1]=(f+_)*b,n[2]=(g-T)*b,n[3]=0,n[4]=(f-_)*E,n[5]=(1-(u+m))*E,n[6]=(p+M)*E,n[7]=0,n[8]=(g+T)*P,n[9]=(p-M)*P,n[10]=(1-(u+S))*P,n[11]=0,n[12]=e.x,n[13]=e.y,n[14]=e.z,n[15]=1,this}decompose(e,t,i){const n=this.elements;e.x=n[12],e.y=n[13],e.z=n[14];const r=this.determinantAffine();if(r===0)return i.set(1,1,1),t.identity(),this;let a=Zn.set(n[0],n[1],n[2]).length();const o=Zn.set(n[4],n[5],n[6]).length(),c=Zn.set(n[8],n[9],n[10]).length();r<0&&(a=-a),Ai.copy(this);const l=1/a,h=1/o,d=1/c;return Ai.elements[0]*=l,Ai.elements[1]*=l,Ai.elements[2]*=l,Ai.elements[4]*=h,Ai.elements[5]*=h,Ai.elements[6]*=h,Ai.elements[8]*=d,Ai.elements[9]*=d,Ai.elements[10]*=d,t.setFromRotationMatrix(Ai),i.x=a,i.y=o,i.z=c,this}makePerspective(e,t,i,n,r,a,o=Gi,c=!1){const l=this.elements,h=2*r/(t-e),d=2*r/(i-n),u=(t+e)/(t-e),f=(i+n)/(i-n);let g,S;if(c)g=r/(a-r),S=a*r/(a-r);else if(o===Gi)g=-(a+r)/(a-r),S=-2*a*r/(a-r);else if(o===ar)g=-a/(a-r),S=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=h,l[4]=0,l[8]=u,l[12]=0,l[1]=0,l[5]=d,l[9]=f,l[13]=0,l[2]=0,l[6]=0,l[10]=g,l[14]=S,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,i,n,r,a,o=Gi,c=!1){const l=this.elements,h=2/(t-e),d=2/(i-n),u=-(t+e)/(t-e),f=-(i+n)/(i-n);let g,S;if(c)g=1/(a-r),S=a/(a-r);else if(o===Gi)g=-2/(a-r),S=-(a+r)/(a-r);else if(o===ar)g=-1/(a-r),S=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=h,l[4]=0,l[8]=0,l[12]=u,l[1]=0,l[5]=d,l[9]=0,l[13]=f,l[2]=0,l[6]=0,l[10]=g,l[14]=S,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){const t=this.elements,i=e.elements;for(let n=0;n<16;n++)if(t[n]!==i[n])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}};Ca.prototype.isMatrix4=!0;let Tt=Ca;const Zn=new R,Ai=new Tt,lp=new R(0,0,0),cp=new R(1,1,1),vn=new R,br=new R,mi=new R,Kc=new Tt,Yc=new ws;class Tn{constructor(e=0,t=0,i=0,n=Tn.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=i,this._order=n}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,n=this._order){return this._x=e,this._y=t,this._z=i,this._order=n,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){const n=e.elements,r=n[0],a=n[4],o=n[8],c=n[1],l=n[5],h=n[9],d=n[2],u=n[6],f=n[10];switch(t){case"XYZ":this._y=Math.asin(ht(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(u,l),this._z=0);break;case"YXZ":this._x=Math.asin(-ht(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-d,r),this._z=0);break;case"ZXY":this._x=Math.asin(ht(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(-d,f),this._z=Math.atan2(-a,l)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-ht(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(u,f),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-a,l));break;case"YZX":this._z=Math.asin(ht(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-h,l),this._y=Math.atan2(-d,r)):(this._x=0,this._y=Math.atan2(o,f));break;case"XZY":this._z=Math.asin(-ht(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(u,l),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-h,f),this._y=0);break;default:Ze("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return Kc.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Kc,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Yc.setFromEuler(this),this.setFromQuaternion(Yc,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Tn.DEFAULT_ORDER="XYZ";class zu{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let hp=0;const Jc=new R,jn=new ws,Ji=new Tt,wr=new R,Rs=new R,up=new R,dp=new ws,Zc=new R(1,0,0),jc=new R(0,1,0),Qc=new R(0,0,1),eh={type:"added"},fp={type:"removed"},Qn={type:"childadded",child:null},eo={type:"childremoved",child:null};class Ft extends Xn{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:hp++}),this.uuid=cn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Ft.DEFAULT_UP.clone();const e=new R,t=new Tn,i=new ws,n=new R(1,1,1);function r(){i.setFromEuler(t,!1)}function a(){t.setFromQuaternion(i,void 0,!1)}t._onChange(r),i._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:n},modelViewMatrix:{value:new Tt},normalMatrix:{value:new tt}}),this.matrix=new Tt,this.matrixWorld=new Tt,this.matrixAutoUpdate=Ft.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Ft.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new zu,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return jn.setFromAxisAngle(e,t),this.quaternion.multiply(jn),this}rotateOnWorldAxis(e,t){return jn.setFromAxisAngle(e,t),this.quaternion.premultiply(jn),this}rotateX(e){return this.rotateOnAxis(Zc,e)}rotateY(e){return this.rotateOnAxis(jc,e)}rotateZ(e){return this.rotateOnAxis(Qc,e)}translateOnAxis(e,t){return Jc.copy(e).applyQuaternion(this.quaternion),this.position.add(Jc.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Zc,e)}translateY(e){return this.translateOnAxis(jc,e)}translateZ(e){return this.translateOnAxis(Qc,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Ji.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?wr.copy(e):wr.set(e,t,i);const n=this.parent;this.updateWorldMatrix(!0,!1),Rs.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Ji.lookAt(Rs,wr,this.up):Ji.lookAt(wr,Rs,this.up),this.quaternion.setFromRotationMatrix(Ji),n&&(Ji.extractRotation(n.matrixWorld),jn.setFromRotationMatrix(Ji),this.quaternion.premultiply(jn.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(pt("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(eh),Qn.child=e,this.dispatchEvent(Qn),Qn.child=null):pt("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(fp),eo.child=e,this.dispatchEvent(eo),eo.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Ji.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Ji.multiply(e.parent.matrixWorld)),e.applyMatrix4(Ji),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(eh),Qn.child=e,this.dispatchEvent(Qn),Qn.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,n=this.children.length;i<n;i++){const a=this.children[i].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,i=[]){this[e]===t&&i.push(this);const n=this.children;for(let r=0,a=n.length;r<a;r++)n[r].getObjectsByProperty(e,t,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Rs,e,up),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Rs,dp,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}intersectsFrustum(){}traverse(e){e(this);const t=this.children;for(let i=0,n=t.length;i<n;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let i=0,n=t.length;i<n;i++)t[i].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);const e=this.pivot;if(e!==null){const t=e.x,i=e.y,n=e.z,r=this.matrix.elements;r[12]+=t-r[0]*t-r[4]*i-r[8]*n,r[13]+=i-r[1]*t-r[5]*i-r[9]*n,r[14]+=n-r[2]*t-r[6]*i-r[10]*n}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let i=0,n=t.length;i<n;i++)t[i].updateMatrixWorld(e)}updateWorldMatrix(e,t,i=!1){const n=this.parent;if(e===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||i)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,i=!0),t===!0){const r=this.children;for(let a=0,o=r.length;a<o;a++)r[a].updateWorldMatrix(!1,!0,i)}}toJSON(e){const t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const n={};n.uuid=this.uuid,n.type=this.type,n.name=this.name,n.castShadow=this.castShadow,n.receiveShadow=this.receiveShadow,n.visible=this.visible,n.frustumCulled=this.frustumCulled,n.renderOrder=this.renderOrder,n.static=this.static,n.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(n.userData=this.userData),n.layers=this.layers.mask,n.matrix=this.matrix.toArray(),n.up=this.up.toArray(),this.pivot!==null&&(n.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(n.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(n.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(n.type="InstancedMesh",n.count=this.count,n.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(n.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(n.type="BatchedMesh",n.perObjectFrustumCulled=this.perObjectFrustumCulled,n.sortObjects=this.sortObjects,n.drawRanges=this._drawRanges,n.reservedRanges=this._reservedRanges,n.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),n.instanceInfo=this._instanceInfo.map(o=>({...o})),n.availableInstanceIds=this._availableInstanceIds.slice(),n.availableGeometryIds=this._availableGeometryIds.slice(),n.nextIndexStart=this._nextIndexStart,n.nextVertexStart=this._nextVertexStart,n.geometryCount=this._geometryCount,n.maxInstanceCount=this._maxInstanceCount,n.maxVertexCount=this._maxVertexCount,n.maxIndexCount=this._maxIndexCount,n.geometryInitialized=this._geometryInitialized,n.matricesTexture=this._matricesTexture.toJSON(e),n.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(n.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(n.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(n.boundingBox=this.boundingBox.toJSON()));function r(o,c){return o[c.uuid]===void 0&&(o[c.uuid]=c.toJSON(e)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?n.background=this.background.toJSON():this.background.isTexture&&(n.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(n.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){n.geometry=r(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const c=o.shapes;if(Array.isArray(c))for(let l=0,h=c.length;l<h;l++){const d=c[l];r(e.shapes,d)}else r(e.shapes,c)}}if(this.isSkinnedMesh&&(n.bindMode=this.bindMode,n.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),n.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let c=0,l=this.material.length;c<l;c++)o.push(r(e.materials,this.material[c]));n.material=o}else n.material=r(e.materials,this.material);if(this.children.length>0){n.children=[];for(let o=0;o<this.children.length;o++)n.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){n.animations=[];for(let o=0;o<this.animations.length;o++){const c=this.animations[o];n.animations.push(r(e.animations,c))}}if(t){const o=a(e.geometries),c=a(e.materials),l=a(e.textures),h=a(e.images),d=a(e.shapes),u=a(e.skeletons),f=a(e.animations),g=a(e.nodes);o.length>0&&(i.geometries=o),c.length>0&&(i.materials=c),l.length>0&&(i.textures=l),h.length>0&&(i.images=h),d.length>0&&(i.shapes=d),u.length>0&&(i.skeletons=u),f.length>0&&(i.animations=f),g.length>0&&(i.nodes=g)}return i.object=n,i;function a(o){const c=[];for(const l in o){const h=o[l];delete h.metadata,c.push(h)}return c}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){const n=e.children[i];this.add(n.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}}Ft.DEFAULT_UP=new R(0,1,0);Ft.DEFAULT_MATRIX_AUTO_UPDATE=!0;Ft.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;class Nt extends Ft{constructor(){super(),this.isGroup=!0,this.type="Group"}}const pp={type:"move"};class to{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Nt,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Nt,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new R,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new R),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Nt,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new R,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new R,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let n=null,r=null,a=null;const o=this._targetRay,c=this._grip,l=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(l&&e.hand){a=!0;for(const S of e.hand.values()){const p=t.getJointPose(S,i),m=this._getHandJoint(l,S);p!==null&&(m.matrix.fromArray(p.transform.matrix),m.matrix.decompose(m.position,m.rotation,m.scale),m.matrixWorldNeedsUpdate=!0,m.jointRadius=p.radius),m.visible=p!==null}const h=l.joints["index-finger-tip"],d=l.joints["thumb-tip"],u=h.position.distanceTo(d.position),f=.02,g=.005;l.inputState.pinching&&u>f+g?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!l.inputState.pinching&&u<=f-g&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else c!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,i),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1,c.eventsEnabled&&c.dispatchEvent({type:"gripUpdated",data:e,target:this})));o!==null&&(n=t.getPose(e.targetRaySpace,i),n===null&&r!==null&&(n=r),n!==null&&(o.matrix.fromArray(n.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,n.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(n.linearVelocity)):o.hasLinearVelocity=!1,n.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(n.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(pp)))}return o!==null&&(o.visible=n!==null),c!==null&&(c.visible=r!==null),l!==null&&(l.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const i=new Nt;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}}const Gu={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},xn={h:0,s:0,l:0},Er={h:0,s:0,l:0};function io(s,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?s+(e-s)*6*t:t<1/2?e:t<2/3?s+(e-s)*6*(2/3-t):s}class Xe{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){const n=e;n&&n.isColor?this.copy(n):typeof n=="number"?this.setHex(n):typeof n=="string"&&this.setStyle(n)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Yt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,dt.colorSpaceToWorking(this,t),this}setRGB(e,t,i,n=dt.workingColorSpace){return this.r=e,this.g=t,this.b=i,dt.colorSpaceToWorking(this,n),this}setHSL(e,t,i,n=dt.workingColorSpace){if(e=tp(e,1),t=ht(t,0,1),i=ht(i,0,1),t===0)this.r=this.g=this.b=i;else{const r=i<=.5?i*(1+t):i+t-i*t,a=2*i-r;this.r=io(a,r,e+1/3),this.g=io(a,r,e),this.b=io(a,r,e-1/3)}return dt.colorSpaceToWorking(this,n),this}setStyle(e,t=Yt){function i(r){r!==void 0&&parseFloat(r)<1&&Ze("Color: Alpha component of "+e+" will be ignored.")}let n;if(n=/^(\w+)\(([^\)]*)\)/.exec(e)){let r;const a=n[1],o=n[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:Ze("Color: Unknown color model "+e)}}else if(n=/^\#([A-Fa-f\d]+)$/.exec(e)){const r=n[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(r,16),t);Ze("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Yt){const i=Gu[e.toLowerCase()];return i!==void 0?this.setHex(i,t):Ze("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=hn(e.r),this.g=hn(e.g),this.b=hn(e.b),this}copyLinearToSRGB(e){return this.r=ys(e.r),this.g=ys(e.g),this.b=ys(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Yt){return dt.workingToColorSpace(jt.copy(this),e),Math.round(ht(jt.r*255,0,255))*65536+Math.round(ht(jt.g*255,0,255))*256+Math.round(ht(jt.b*255,0,255))}getHexString(e=Yt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=dt.workingColorSpace){dt.workingToColorSpace(jt.copy(this),t);const i=jt.r,n=jt.g,r=jt.b,a=Math.max(i,n,r),o=Math.min(i,n,r);let c,l;const h=(o+a)/2;if(o===a)c=0,l=0;else{const d=a-o;switch(l=h<=.5?d/(a+o):d/(2-a-o),a){case i:c=(n-r)/d+(n<r?6:0);break;case n:c=(r-i)/d+2;break;case r:c=(i-n)/d+4;break}c/=6}return e.h=c,e.s=l,e.l=h,e}getRGB(e,t=dt.workingColorSpace){return dt.workingToColorSpace(jt.copy(this),t),e.r=jt.r,e.g=jt.g,e.b=jt.b,e}getStyle(e=Yt){dt.workingToColorSpace(jt.copy(this),e);const t=jt.r,i=jt.g,n=jt.b;return e!==Yt?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${n.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(i*255)},${Math.round(n*255)})`}offsetHSL(e,t,i){return this.getHSL(xn),this.setHSL(xn.h+e,xn.s+t,xn.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL(xn),e.getHSL(Er);const i=Ya(xn.h,Er.h,t),n=Ya(xn.s,Er.s,t),r=Ya(xn.l,Er.l,t);return this.setHSL(i,n,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,i=this.g,n=this.b,r=e.elements;return this.r=r[0]*t+r[3]*i+r[6]*n,this.g=r[1]*t+r[4]*i+r[7]*n,this.b=r[2]*t+r[5]*i+r[8]*n,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const jt=new Xe;Xe.NAMES=Gu;class jl{constructor(e,t=1,i=1e3){this.isFog=!0,this.name="",this.color=new Xe(e),this.near=t,this.far=i}clone(){return new jl(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class Vu extends Ft{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Tn,this.environmentIntensity=1,this.environmentRotation=new Tn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),t.object.backgroundBlurriness=this.backgroundBlurriness,t.object.backgroundIntensity=this.backgroundIntensity,t.object.backgroundRotation=this.backgroundRotation.toArray(),t.object.environmentIntensity=this.environmentIntensity,t.object.environmentRotation=this.environmentRotation.toArray(),t}}const Ci=new R,Zi=new R,no=new R,ji=new R,es=new R,ts=new R,th=new R,so=new R,ro=new R,ao=new R,oo=new It,lo=new It,co=new It;class wi{constructor(e=new R,t=new R,i=new R){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,n){n.subVectors(i,t),Ci.subVectors(e,t),n.cross(Ci);const r=n.lengthSq();return r>0?n.multiplyScalar(1/Math.sqrt(r)):n.set(0,0,0)}static getBarycoord(e,t,i,n,r){Ci.subVectors(n,t),Zi.subVectors(i,t),no.subVectors(e,t);const a=Ci.dot(Ci),o=Ci.dot(Zi),c=Ci.dot(no),l=Zi.dot(Zi),h=Zi.dot(no),d=a*l-o*o;if(d===0)return r.set(0,0,0),null;const u=1/d,f=(l*c-o*h)*u,g=(a*h-o*c)*u;return r.set(1-f-g,g,f)}static containsPoint(e,t,i,n){return this.getBarycoord(e,t,i,n,ji)===null?!1:ji.x>=0&&ji.y>=0&&ji.x+ji.y<=1}static getInterpolation(e,t,i,n,r,a,o,c){return this.getBarycoord(e,t,i,n,ji)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,ji.x),c.addScaledVector(a,ji.y),c.addScaledVector(o,ji.z),c)}static getInterpolatedAttribute(e,t,i,n,r,a){return oo.setScalar(0),lo.setScalar(0),co.setScalar(0),oo.fromBufferAttribute(e,t),lo.fromBufferAttribute(e,i),co.fromBufferAttribute(e,n),a.setScalar(0),a.addScaledVector(oo,r.x),a.addScaledVector(lo,r.y),a.addScaledVector(co,r.z),a}static isFrontFacing(e,t,i,n){return Ci.subVectors(i,t),Zi.subVectors(e,t),Ci.cross(Zi).dot(n)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,n){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[n]),this}setFromAttributeAndIndices(e,t,i,n){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,n),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Ci.subVectors(this.c,this.b),Zi.subVectors(this.a,this.b),Ci.cross(Zi).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return wi.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return wi.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,i,n,r){return wi.getInterpolation(e,this.a,this.b,this.c,t,i,n,r)}containsPoint(e){return wi.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return wi.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const i=this.a,n=this.b,r=this.c;let a,o;es.subVectors(n,i),ts.subVectors(r,i),so.subVectors(e,i);const c=es.dot(so),l=ts.dot(so);if(c<=0&&l<=0)return t.copy(i);ro.subVectors(e,n);const h=es.dot(ro),d=ts.dot(ro);if(h>=0&&d<=h)return t.copy(n);const u=c*d-h*l;if(u<=0&&c>=0&&h<=0)return a=c/(c-h),t.copy(i).addScaledVector(es,a);ao.subVectors(e,r);const f=es.dot(ao),g=ts.dot(ao);if(g>=0&&f<=g)return t.copy(r);const S=f*l-c*g;if(S<=0&&l>=0&&g<=0)return o=l/(l-g),t.copy(i).addScaledVector(ts,o);const p=h*g-f*d;if(p<=0&&d-h>=0&&f-g>=0)return th.subVectors(r,n),o=(d-h)/(d-h+(f-g)),t.copy(n).addScaledVector(th,o);const m=1/(p+S+u);return a=S*m,o=u*m,t.copy(i).addScaledVector(es,a).addScaledVector(ts,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}class qn{constructor(e=new R(1/0,1/0,1/0),t=new R(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(Pi.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(Pi.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const i=Pi.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const r=i.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,Pi):Pi.fromBufferAttribute(r,a),Pi.applyMatrix4(e.matrixWorld),this.expandByPoint(Pi);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Tr.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),Tr.copy(i.boundingBox)),Tr.applyMatrix4(e.matrixWorld),this.union(Tr)}const n=e.children;for(let r=0,a=n.length;r<a;r++)this.expandByObject(n[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Pi),Pi.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Ls),Ar.subVectors(this.max,Ls),is.subVectors(e.a,Ls),ns.subVectors(e.b,Ls),ss.subVectors(e.c,Ls),_n.subVectors(ns,is),yn.subVectors(ss,ns),Rn.subVectors(is,ss);let t=[0,-_n.z,_n.y,0,-yn.z,yn.y,0,-Rn.z,Rn.y,_n.z,0,-_n.x,yn.z,0,-yn.x,Rn.z,0,-Rn.x,-_n.y,_n.x,0,-yn.y,yn.x,0,-Rn.y,Rn.x,0];return!ho(t,is,ns,ss,Ar)||(t=[1,0,0,0,1,0,0,0,1],!ho(t,is,ns,ss,Ar))?!1:(Cr.crossVectors(_n,yn),t=[Cr.x,Cr.y,Cr.z],ho(t,is,ns,ss,Ar))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Pi).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Pi).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Qi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Qi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Qi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Qi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Qi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Qi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Qi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Qi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Qi),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const Qi=[new R,new R,new R,new R,new R,new R,new R,new R],Pi=new R,Tr=new qn,is=new R,ns=new R,ss=new R,_n=new R,yn=new R,Rn=new R,Ls=new R,Ar=new R,Cr=new R,Ln=new R;function ho(s,e,t,i,n){for(let r=0,a=s.length-3;r<=a;r+=3){Ln.fromArray(s,r);const o=n.x*Math.abs(Ln.x)+n.y*Math.abs(Ln.y)+n.z*Math.abs(Ln.z),c=e.dot(Ln),l=t.dot(Ln),h=i.dot(Ln);if(Math.max(-Math.max(c,l,h),Math.min(c,l,h))>o)return!1}return!0}const Gt=new R,Pr=new ae;let mp=0;class fi extends Xn{constructor(e,t,i=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:mp++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=Ou,this.updateRanges=[],this.gpuType=Li,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let n=0,r=this.itemSize;n<r;n++)this.array[e+n]=t.array[i+n];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)Pr.fromBufferAttribute(this,t),Pr.applyMatrix3(e),this.setXY(t,Pr.x,Pr.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)Gt.fromBufferAttribute(this,t),Gt.applyMatrix3(e),this.setXYZ(t,Gt.x,Gt.y,Gt.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)Gt.fromBufferAttribute(this,t),Gt.applyMatrix4(e),this.setXYZ(t,Gt.x,Gt.y,Gt.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)Gt.fromBufferAttribute(this,t),Gt.applyNormalMatrix(e),this.setXYZ(t,Gt.x,Gt.y,Gt.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)Gt.fromBufferAttribute(this,t),Gt.transformDirection(e),this.setXYZ(t,Gt.x,Gt.y,Gt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=zi(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=Et(i,this.array)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=zi(t,this.array)),t}setX(e,t){return this.normalized&&(t=Et(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=zi(t,this.array)),t}setY(e,t){return this.normalized&&(t=Et(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=zi(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Et(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=zi(t,this.array)),t}setW(e,t){return this.normalized&&(t=Et(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=Et(t,this.array),i=Et(i,this.array)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,n){return e*=this.itemSize,this.normalized&&(t=Et(t,this.array),i=Et(i,this.array),n=Et(n,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=n,this}setXYZW(e,t,i,n,r){return e*=this.itemSize,this.normalized&&(t=Et(t,this.array),i=Et(i,this.array),n=Et(n,this.array),r=Et(r,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=n,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return e.name=this.name,e.usage=this.usage,e.gpuType=this.gpuType,e}dispose(){this.dispatchEvent({type:"dispose"})}}class Wu extends fi{constructor(e,t,i){super(new Uint16Array(e),t,i)}}class Xu extends fi{constructor(e,t,i){super(new Uint32Array(e),t,i)}}class ft extends fi{constructor(e,t,i){super(new Float32Array(e),t,i)}}const gp=new qn,Is=new R,uo=new R;class Es{constructor(e=new R,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const i=this.center;t!==void 0?i.copy(t):gp.setFromPoints(e).getCenter(i);let n=0;for(let r=0,a=e.length;r<a;r++)n=Math.max(n,i.distanceToSquared(e[r]));return this.radius=Math.sqrt(n),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Is.subVectors(e,this.center);const t=Is.lengthSq();if(t>this.radius*this.radius){const i=Math.sqrt(t),n=(i-this.radius)*.5;this.center.addScaledVector(Is,n/i),this.radius+=n}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(uo.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Is.copy(e.center).add(uo)),this.expandByPoint(Is.copy(e.center).sub(uo))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}let vp=0;const Mi=new Tt,fo=new Ft,rs=new R,gi=new qn,Ds=new qn,Kt=new R;class Ot extends Xn{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:vp++}),this.uuid=cn(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Zf(e)?Xu:Wu)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const r=new tt().getNormalMatrix(e);i.applyNormalMatrix(r),i.needsUpdate=!0}const n=this.attributes.tangent;return n!==void 0&&(n.transformDirection(e),n.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return Mi.makeRotationFromQuaternion(e),this.applyMatrix4(Mi),this}rotateX(e){return Mi.makeRotationX(e),this.applyMatrix4(Mi),this}rotateY(e){return Mi.makeRotationY(e),this.applyMatrix4(Mi),this}rotateZ(e){return Mi.makeRotationZ(e),this.applyMatrix4(Mi),this}translate(e,t,i){return Mi.makeTranslation(e,t,i),this.applyMatrix4(Mi),this}scale(e,t,i){return Mi.makeScale(e,t,i),this.applyMatrix4(Mi),this}lookAt(e){return fo.lookAt(e),fo.updateMatrix(),this.applyMatrix4(fo.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(rs).negate(),this.translate(rs.x,rs.y,rs.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const i=[];for(let n=0,r=e.length;n<r;n++){const a=e[n];i.push(a.x,a.y,a.z||0)}this.setAttribute("position",new ft(i,3))}else{const i=Math.min(e.length,t.count);for(let n=0;n<i;n++){const r=e[n];t.setXYZ(n,r.x,r.y,r.z||0)}e.length>t.count&&Ze("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new qn);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){pt("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new R(-1/0,-1/0,-1/0),new R(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,n=t.length;i<n;i++){const r=t[i];gi.setFromBufferAttribute(r),this.morphTargetsRelative?(Kt.addVectors(this.boundingBox.min,gi.min),this.boundingBox.expandByPoint(Kt),Kt.addVectors(this.boundingBox.max,gi.max),this.boundingBox.expandByPoint(Kt)):(this.boundingBox.expandByPoint(gi.min),this.boundingBox.expandByPoint(gi.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&pt('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Es);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){pt("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new R,1/0);return}if(e){const i=this.boundingSphere.center;if(gi.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){const o=t[r];Ds.setFromBufferAttribute(o),this.morphTargetsRelative?(Kt.addVectors(gi.min,Ds.min),gi.expandByPoint(Kt),Kt.addVectors(gi.max,Ds.max),gi.expandByPoint(Kt)):(gi.expandByPoint(Ds.min),gi.expandByPoint(Ds.max))}gi.getCenter(i);let n=0;for(let r=0,a=e.count;r<a;r++)Kt.fromBufferAttribute(e,r),n=Math.max(n,i.distanceToSquared(Kt));if(t)for(let r=0,a=t.length;r<a;r++){const o=t[r],c=this.morphTargetsRelative;for(let l=0,h=o.count;l<h;l++)Kt.fromBufferAttribute(o,l),c&&(rs.fromBufferAttribute(e,l),Kt.add(rs)),n=Math.max(n,i.distanceToSquared(Kt))}this.boundingSphere.radius=Math.sqrt(n),isNaN(this.boundingSphere.radius)&&pt('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){pt("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=t.position,n=t.normal,r=t.uv;let a=this.getAttribute("tangent");(a===void 0||a.count!==i.count)&&(a=new fi(new Float32Array(4*i.count),4),this.setAttribute("tangent",a));const o=[],c=[];for(let x=0;x<i.count;x++)o[x]=new R,c[x]=new R;const l=new R,h=new R,d=new R,u=new ae,f=new ae,g=new ae,S=new R,p=new R;function m(x,w,C){l.fromBufferAttribute(i,x),h.fromBufferAttribute(i,w),d.fromBufferAttribute(i,C),u.fromBufferAttribute(r,x),f.fromBufferAttribute(r,w),g.fromBufferAttribute(r,C),h.sub(l),d.sub(l),f.sub(u),g.sub(u);const I=1/(f.x*g.y-g.x*f.y);isFinite(I)&&(S.copy(h).multiplyScalar(g.y).addScaledVector(d,-f.y).multiplyScalar(I),p.copy(d).multiplyScalar(f.x).addScaledVector(h,-g.x).multiplyScalar(I),o[x].add(S),o[w].add(S),o[C].add(S),c[x].add(p),c[w].add(p),c[C].add(p))}let M=this.groups;M.length===0&&(M=[{start:0,count:e.count}]);for(let x=0,w=M.length;x<w;++x){const C=M[x],I=C.start,N=C.count;for(let B=I,U=I+N;B<U;B+=3)m(e.getX(B+0),e.getX(B+1),e.getX(B+2))}const T=new R,_=new R,b=new R,E=new R;function P(x){b.fromBufferAttribute(n,x),E.copy(b);const w=o[x];T.copy(w),T.sub(b.multiplyScalar(b.dot(w))).normalize(),_.crossVectors(E,w);const I=_.dot(c[x])<0?-1:1;a.setXYZW(x,T.x,T.y,T.z,I)}for(let x=0,w=M.length;x<w;++x){const C=M[x],I=C.start,N=C.count;for(let B=I,U=I+N;B<U;B+=3)P(e.getX(B+0)),P(e.getX(B+1)),P(e.getX(B+2))}this._transformed=!0}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0||i.count!==t.count)i=new fi(new Float32Array(t.count*3),3),this.setAttribute("normal",i);else for(let u=0,f=i.count;u<f;u++)i.setXYZ(u,0,0,0);const n=new R,r=new R,a=new R,o=new R,c=new R,l=new R,h=new R,d=new R;if(e)for(let u=0,f=e.count;u<f;u+=3){const g=e.getX(u+0),S=e.getX(u+1),p=e.getX(u+2);n.fromBufferAttribute(t,g),r.fromBufferAttribute(t,S),a.fromBufferAttribute(t,p),h.subVectors(a,r),d.subVectors(n,r),h.cross(d),o.fromBufferAttribute(i,g),c.fromBufferAttribute(i,S),l.fromBufferAttribute(i,p),o.add(h),c.add(h),l.add(h),i.setXYZ(g,o.x,o.y,o.z),i.setXYZ(S,c.x,c.y,c.z),i.setXYZ(p,l.x,l.y,l.z)}else for(let u=0,f=t.count;u<f;u+=3)n.fromBufferAttribute(t,u+0),r.fromBufferAttribute(t,u+1),a.fromBufferAttribute(t,u+2),h.subVectors(a,r),d.subVectors(n,r),h.cross(d),i.setXYZ(u+0,h.x,h.y,h.z),i.setXYZ(u+1,h.x,h.y,h.z),i.setXYZ(u+2,h.x,h.y,h.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)Kt.fromBufferAttribute(e,t),Kt.normalize(),e.setXYZ(t,Kt.x,Kt.y,Kt.z)}toNonIndexed(){function e(o,c){const l=o.array,h=o.itemSize,d=o.normalized,u=new l.constructor(c.length*h);let f=0,g=0;for(let S=0,p=c.length;S<p;S++){o.isInterleavedBufferAttribute?f=c[S]*o.data.stride+o.offset:f=c[S]*h;for(let m=0;m<h;m++)u[g++]=l[f++]}return new fi(u,h,d)}if(this.index===null)return Ze("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new Ot,i=this.index.array,n=this.attributes;for(const o in n){const c=n[o],l=e(c,i);t.setAttribute(o,l)}const r=this.morphAttributes;for(const o in r){const c=[],l=r[o];for(let h=0,d=l.length;h<d;h++){const u=l[h],f=e(u,i);c.push(f)}t.morphAttributes[o]=c}t.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,c=a.length;o<c;o++){const l=a[o];t.addGroup(l.start,l.count,l.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,e.name=this.name,Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(e[l]=c[l]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const i=this.attributes;for(const c in i){const l=i[c];e.data.attributes[c]=l.toJSON(e.data)}const n={};let r=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],h=[];for(let d=0,u=l.length;d<u;d++){const f=l[d];h.push(f.toJSON(e.data))}h.length>0&&(n[c]=h,r=!0)}r&&(e.data.morphAttributes=n,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone());const n=e.attributes;for(const l in n){const h=n[l];this.setAttribute(l,h.clone(t))}const r=e.morphAttributes;for(const l in r){const h=[],d=r[l];for(let u=0,f=d.length;u<f;u++)h.push(d[u].clone(t));this.morphAttributes[l]=h}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let l=0,h=a.length;l<h;l++){const d=a[l];this.addGroup(d.start,d.count,d.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const c=e.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}}class xp{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=Ou,this.updateRanges=[],this.version=0,this.uuid=cn()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,i){e*=this.stride,i*=t.stride;for(let n=0,r=this.stride;n<r;n++)this.array[e+n]=t.array[i+n];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=cn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),i=new this.constructor(t,this.stride);return i.setUsage(this.usage),i}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=cn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer)));const t={uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride};return t.usage=this.usage,t}}const si=new R;class ba{constructor(e,t,i,n=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=i,this.normalized=n}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,i=this.data.count;t<i;t++)si.fromBufferAttribute(this,t),si.applyMatrix4(e),this.setXYZ(t,si.x,si.y,si.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)si.fromBufferAttribute(this,t),si.applyNormalMatrix(e),this.setXYZ(t,si.x,si.y,si.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)si.fromBufferAttribute(this,t),si.transformDirection(e),this.setXYZ(t,si.x,si.y,si.z);return this}getComponent(e,t){let i=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(i=zi(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=Et(i,this.array)),this.data.array[e*this.data.stride+this.offset+t]=i,this}setX(e,t){return this.normalized&&(t=Et(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=Et(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=Et(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=Et(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=zi(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=zi(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=zi(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=zi(t,this.array)),t}setXY(e,t,i){return e=e*this.data.stride+this.offset,this.normalized&&(t=Et(t,this.array),i=Et(i,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=i,this}setXYZ(e,t,i,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=Et(t,this.array),i=Et(i,this.array),n=Et(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=i,this.data.array[e+2]=n,this}setXYZW(e,t,i,n,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=Et(t,this.array),i=Et(i,this.array),n=Et(n,this.array),r=Et(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=i,this.data.array[e+2]=n,this.data.array[e+3]=r,this}clone(e){if(e===void 0){Ma("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let i=0;i<this.count;i++){const n=i*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[n+r])}return new fi(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new ba(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){Ma("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let i=0;i<this.count;i++){const n=i*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[n+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}const po=new R,_p=new R,yp=new tt;class wn{constructor(e=new R(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,n){return this.normal.set(e,t,i),this.constant=n,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){const n=po.subVectors(i,t).cross(_p.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(n,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,i=!0){const n=e.delta(po),r=this.normal.dot(n);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const a=-(e.start.dot(this.normal)+this.constant)/r;return i===!0&&(a<0||a>1)?null:t.copy(e.start).addScaledVector(n,a)}intersectsLine(e){const t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const i=t||yp.getNormalMatrix(e),n=this.coplanarPoint(po).applyMatrix4(e),r=this.normal.applyMatrix3(i).normalize();return this.constant=-n.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(e){return this.normal.fromArray(e.normal),this.constant=e.constant,this}}let Sp=0;class Cn extends Xn{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Sp++}),this.uuid=cn(),this.name="",this.type="Material",this.blending=Js,this.side=Hn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Mu,this.blendDst=bu,this.blendEquation=gs,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Xe(0,0,0),this.blendAlpha=0,this.depthFunc=nr,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Vf,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=$a,this.stencilZFail=$a,this.stencilZPass=$a,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const i=e[t];if(i===void 0){Ze(`Material: parameter '${t}' has value of undefined.`);continue}const n=this[t];if(n===void 0){Ze(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}n&&n.isColor?n.set(i):n&&n.isVector2&&i&&i.isVector2||n&&n.isEuler&&i&&i.isEuler||n&&n.isVector3&&i&&i.isVector3?n.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,i.blending=this.blending,i.side=this.side,i.shadowSide=this.shadowSide,i.vertexColors=this.vertexColors,i.opacity=this.opacity,i.transparent=this.transparent,i.blendSrc=this.blendSrc,i.blendDst=this.blendDst,i.blendEquation=this.blendEquation,i.blendSrcAlpha=this.blendSrcAlpha,i.blendDstAlpha=this.blendDstAlpha,i.blendEquationAlpha=this.blendEquationAlpha,i.blendColor=this.blendColor.getHex(),i.blendAlpha=this.blendAlpha,i.depthFunc=this.depthFunc,i.depthTest=this.depthTest,i.depthWrite=this.depthWrite,i.colorWrite=this.colorWrite,i.clipIntersection=this.clipIntersection,i.clipShadows=this.clipShadows,i.stencilWriteMask=this.stencilWriteMask,i.stencilFunc=this.stencilFunc,i.stencilRef=this.stencilRef,i.stencilFuncMask=this.stencilFuncMask,i.stencilFail=this.stencilFail,i.stencilZFail=this.stencilZFail,i.stencilZPass=this.stencilZPass,i.stencilWrite=this.stencilWrite,i.polygonOffset=this.polygonOffset,i.polygonOffsetFactor=this.polygonOffsetFactor,i.polygonOffsetUnits=this.polygonOffsetUnits,i.dithering=this.dithering,i.alphaTest=this.alphaTest,i.alphaHash=this.alphaHash,i.alphaToCoverage=this.alphaToCoverage,i.premultipliedAlpha=this.premultipliedAlpha,i.forceSinglePass=this.forceSinglePass,i.allowOverride=this.allowOverride,i.visible=this.visible,i.toneMapped=this.toneMapped,i.name=this.name,this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(i.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(i.clippingPlanes=this.clippingPlanes.map(r=>r.toJSON())),this.rotation!==void 0&&(i.rotation=this.rotation),this.depthPacking!==void 0&&(i.depthPacking=this.depthPacking),this.linewidth!==void 0&&(i.linewidth=this.linewidth),this.linecap!==void 0&&(i.linecap=this.linecap),this.linejoin!==void 0&&(i.linejoin=this.linejoin),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.wireframe!==void 0&&(i.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(i.flatShading=this.flatShading),this.fog!==void 0&&(i.fog=this.fog),Object.keys(this.userData).length>0&&(i.userData=this.userData);function n(r){const a=[];for(const o in r){const c=r[o];delete c.metadata,a.push(c)}return a}if(t){const r=n(e.textures),a=n(e.images);r.length>0&&(i.textures=r),a.length>0&&(i.images=a)}return i}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new Xe().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.retroreflectivity!==void 0&&(this.retroreflectivity=e.retroreflectivity),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=e.iridescenceThicknessRange),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.clippingPlanes!==void 0&&(this.clippingPlanes=e.clippingPlanes.map(i=>new wn().fromJSON(i))),e.clipIntersection!==void 0&&(this.clipIntersection=e.clipIntersection),e.clipShadows!==void 0&&(this.clipShadows=e.clipShadows),e.depthPacking!==void 0&&(this.depthPacking=e.depthPacking),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.linecap!==void 0&&(this.linecap=e.linecap),e.linejoin!==void 0&&(this.linejoin=e.linejoin),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(typeof e.vertexColors=="number"?this.vertexColors=e.vertexColors>0:this.vertexColors=e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let i=e.normalScale;Array.isArray(i)===!1&&(i=[i,i]),this.normalScale=new ae().fromArray(i)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new ae().fromArray(e.clearcoatNormalScale)),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let i=null;if(t!==null){const n=t.length;i=new Array(n);for(let r=0;r!==n;++r)i[r]=t[r].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class qu extends Cn{constructor(e){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new Xe(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}let as;const ks=new R,os=new R,ls=new R,cs=new ae,Us=new ae,$u=new Tt,Rr=new R,Ns=new R,Lr=new R,ih=new ae,mo=new ae,nh=new ae;class Mp extends Ft{constructor(e=new qu){if(super(),this.isSprite=!0,this.type="Sprite",as===void 0){as=new Ot;const t=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),i=new xp(t,5);as.setIndex([0,1,2,0,2,3]),as.setAttribute("position",new ba(i,3,0,!1)),as.setAttribute("uv",new ba(i,2,3,!1))}this.geometry=as,this.material=e,this.center=new ae(.5,.5),this.count=1}intersectsFrustum(e){return e.intersectsSprite(this)}raycast(e,t){e.camera===null&&pt('Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),os.setFromMatrixScale(this.matrixWorld),$u.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),ls.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&os.multiplyScalar(-ls.z);const i=this.material.rotation;let n,r;i!==0&&(r=Math.cos(i),n=Math.sin(i));const a=this.center;Ir(Rr.set(-.5,-.5,0),ls,a,os,n,r),Ir(Ns.set(.5,-.5,0),ls,a,os,n,r),Ir(Lr.set(.5,.5,0),ls,a,os,n,r),ih.set(0,0),mo.set(1,0),nh.set(1,1);let o=e.ray.intersectTriangle(Rr,Ns,Lr,!1,ks);if(o===null&&(Ir(Ns.set(-.5,.5,0),ls,a,os,n,r),mo.set(0,1),o=e.ray.intersectTriangle(Rr,Lr,Ns,!1,ks),o===null))return;const c=e.ray.origin.distanceTo(ks);c<e.near||c>e.far||t.push({distance:c,point:ks.clone(),uv:wi.getInterpolation(ks,Rr,Ns,Lr,ih,mo,nh,new ae),face:null,object:this})}copy(e,t){return super.copy(e,t),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}}function Ir(s,e,t,i,n,r){cs.subVectors(s,t).addScalar(.5).multiply(i),n!==void 0?(Us.x=r*cs.x-n*cs.y,Us.y=n*cs.x+r*cs.y):Us.copy(cs),s.copy(e),s.x+=Us.x,s.y+=Us.y,s.applyMatrix4($u)}const en=new R,go=new R,Dr=new R,kr=new R;class Ku{constructor(e=new R,t=new R(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,en)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=en.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(en.copy(this.origin).addScaledVector(this.direction,t),en.distanceToSquared(e))}distanceSqToSegment(e,t,i,n){go.copy(e).add(t).multiplyScalar(.5),Dr.copy(t).sub(e).normalize(),kr.copy(this.origin).sub(go);const r=e.distanceTo(t)*.5,a=-this.direction.dot(Dr),o=kr.dot(this.direction),c=-kr.dot(Dr),l=kr.lengthSq(),h=Math.abs(1-a*a);let d,u,f,g;if(h>0)if(d=a*c-o,u=a*o-c,g=r*h,d>=0)if(u>=-g)if(u<=g){const S=1/h;d*=S,u*=S,f=d*(d+a*u+2*o)+u*(a*d+u+2*c)+l}else u=r,d=Math.max(0,-(a*u+o)),f=-d*d+u*(u+2*c)+l;else u=-r,d=Math.max(0,-(a*u+o)),f=-d*d+u*(u+2*c)+l;else u<=-g?(d=Math.max(0,-(-a*r+o)),u=d>0?-r:Math.min(Math.max(-r,-c),r),f=-d*d+u*(u+2*c)+l):u<=g?(d=0,u=Math.min(Math.max(-r,-c),r),f=u*(u+2*c)+l):(d=Math.max(0,-(a*r+o)),u=d>0?r:Math.min(Math.max(-r,-c),r),f=-d*d+u*(u+2*c)+l);else u=a>0?-r:r,d=Math.max(0,-(a*u+o)),f=-d*d+u*(u+2*c)+l;return i&&i.copy(this.origin).addScaledVector(this.direction,d),n&&n.copy(go).addScaledVector(Dr,u),f}intersectSphere(e,t){if(e.radius<0)return null;en.subVectors(e.center,this.origin);const i=en.dot(this.direction),n=en.dot(en)-i*i,r=e.radius*e.radius;if(n>r)return null;const a=Math.sqrt(r-n),o=i-a,c=i+a;return c<0?null:o<0?this.at(c,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){const i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,n,r,a,o,c;const l=1/this.direction.x,h=1/this.direction.y,d=1/this.direction.z,u=this.origin;return l>=0?(i=(e.min.x-u.x)*l,n=(e.max.x-u.x)*l):(i=(e.max.x-u.x)*l,n=(e.min.x-u.x)*l),h>=0?(r=(e.min.y-u.y)*h,a=(e.max.y-u.y)*h):(r=(e.max.y-u.y)*h,a=(e.min.y-u.y)*h),i>a||r>n||((r>i||isNaN(i))&&(i=r),(a<n||isNaN(n))&&(n=a),d>=0?(o=(e.min.z-u.z)*d,c=(e.max.z-u.z)*d):(o=(e.max.z-u.z)*d,c=(e.min.z-u.z)*d),i>c||o>n)||((o>i||i!==i)&&(i=o),(c<n||n!==n)&&(n=c),n<0)?null:this.at(i>=0?i:n,t)}intersectsBox(e){return this.intersectBox(e,en)!==null}intersectTriangle(e,t,i,n,r){const a=this.origin,o=this.direction,c=o.x,l=o.y,h=o.z,d=e.x-a.x,u=e.y-a.y,f=e.z-a.z,g=t.x-a.x,S=t.y-a.y,p=t.z-a.z,m=i.x-a.x,M=i.y-a.y,T=i.z-a.z,_=Math.abs(c),b=Math.abs(l),E=Math.abs(h);let P,x,w,C,I,N,B,U,O,K,V,ne;if(_>=b&&_>=E?(w=c,N=d,O=g,ne=m,c>=0?(P=l,x=h,C=u,I=f,B=S,U=p,K=M,V=T):(P=h,x=l,C=f,I=u,B=p,U=S,K=T,V=M)):b>=E?(w=l,N=u,O=S,ne=M,l>=0?(P=h,x=c,C=f,I=d,B=p,U=g,K=T,V=m):(P=c,x=h,C=d,I=f,B=g,U=p,K=m,V=T)):(w=h,N=f,O=p,ne=T,h>=0?(P=c,x=l,C=d,I=u,B=g,U=S,K=m,V=M):(P=l,x=c,C=u,I=d,B=S,U=g,K=M,V=m)),w===0)return null;const X=P/w,Q=x/w,j=1/w,Ne=C-X*N,he=I-Q*N,Qe=B-X*O,Ke=U-Q*O,it=K-X*ne,J=V-Q*ne,te=it*Ke-J*Qe,Se=Ne*J-he*it,qe=Qe*he-Ke*Ne;if(n){if(te<0||Se<0||qe<0)return null}else if((te<0||Se<0||qe<0)&&(te>0||Se>0||qe>0))return null;const Te=te+Se+qe;if(Te===0)return null;const Ye=j*(te*N+Se*O+qe*ne);return(Te>0?Ye<0:Ye>0)?null:this.at(Ye/Te,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class yi extends Cn{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Xe(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Tn,this.combine=wu,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const sh=new Tt,In=new Ku,Ur=new Es,rh=new R,Nr=new R,Fr=new R,Or=new R,vo=new R,Br=new R,ah=new R,Hr=new R;class je extends Ft{constructor(e=new Ot,t=new yi){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const n=t[i[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=n.length;r<a;r++){const o=n[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(e,t){const i=this.geometry,n=i.attributes.position,r=i.morphAttributes.position,a=i.morphTargetsRelative;t.fromBufferAttribute(n,e);const o=this.morphTargetInfluences;if(r&&o){Br.set(0,0,0);for(let c=0,l=r.length;c<l;c++){const h=o[c],d=r[c];h!==0&&(vo.fromBufferAttribute(d,e),a?Br.addScaledVector(vo,h):Br.addScaledVector(vo.sub(t),h))}t.add(Br)}return t}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){const i=this.geometry,n=this.material,r=this.matrixWorld;n!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),Ur.copy(i.boundingSphere),Ur.applyMatrix4(r),In.copy(e.ray).recast(e.near),!(Ur.containsPoint(In.origin)===!1&&(In.intersectSphere(Ur,rh)===null||In.origin.distanceToSquared(rh)>(e.far-e.near)**2))&&(sh.copy(r).invert(),In.copy(e.ray).applyMatrix4(sh),!(i.boundingBox!==null&&In.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,t,In)))}_computeIntersections(e,t,i){let n;const r=this.geometry,a=this.material,o=r.index,c=r.attributes.position,l=r.attributes.uv,h=r.attributes.uv1,d=r.attributes.normal,u=r.groups,f=r.drawRange;if(o!==null)if(Array.isArray(a))for(let g=0,S=u.length;g<S;g++){const p=u[g],m=a[p.materialIndex],M=Math.max(p.start,f.start),T=Math.min(o.count,Math.min(p.start+p.count,f.start+f.count));for(let _=M,b=T;_<b;_+=3){const E=o.getX(_),P=o.getX(_+1),x=o.getX(_+2);n=zr(this,m,e,i,l,h,d,E,P,x),n&&(n.faceIndex=Math.floor(_/3),n.face.materialIndex=p.materialIndex,t.push(n))}}else{const g=Math.max(0,f.start),S=Math.min(o.count,f.start+f.count);for(let p=g,m=S;p<m;p+=3){const M=o.getX(p),T=o.getX(p+1),_=o.getX(p+2);n=zr(this,a,e,i,l,h,d,M,T,_),n&&(n.faceIndex=Math.floor(p/3),t.push(n))}}else if(c!==void 0)if(Array.isArray(a))for(let g=0,S=u.length;g<S;g++){const p=u[g],m=a[p.materialIndex],M=Math.max(p.start,f.start),T=Math.min(c.count,Math.min(p.start+p.count,f.start+f.count));for(let _=M,b=T;_<b;_+=3){const E=_,P=_+1,x=_+2;n=zr(this,m,e,i,l,h,d,E,P,x),n&&(n.faceIndex=Math.floor(_/3),n.face.materialIndex=p.materialIndex,t.push(n))}}else{const g=Math.max(0,f.start),S=Math.min(c.count,f.start+f.count);for(let p=g,m=S;p<m;p+=3){const M=p,T=p+1,_=p+2;n=zr(this,a,e,i,l,h,d,M,T,_),n&&(n.faceIndex=Math.floor(p/3),t.push(n))}}}}function bp(s,e,t,i,n,r,a,o){let c;if(e.side===ti?c=i.intersectTriangle(a,r,n,!0,o):c=i.intersectTriangle(n,r,a,e.side===Hn,o),c===null)return null;Hr.copy(o),Hr.applyMatrix4(s.matrixWorld);const l=t.ray.origin.distanceTo(Hr);return l<t.near||l>t.far?null:{distance:l,point:Hr.clone(),object:s}}function zr(s,e,t,i,n,r,a,o,c,l){s.getVertexPosition(o,Nr),s.getVertexPosition(c,Fr),s.getVertexPosition(l,Or);const h=bp(s,e,t,i,Nr,Fr,Or,ah);if(h){const d=new R;wi.getBarycoord(ah,Nr,Fr,Or,d),n&&(h.uv=wi.getInterpolatedAttribute(n,o,c,l,d,new ae)),r&&(h.uv1=wi.getInterpolatedAttribute(r,o,c,l,d,new ae)),a&&(h.normal=wi.getInterpolatedAttribute(a,o,c,l,d,new R),h.normal.dot(i.direction)>0&&h.normal.multiplyScalar(-1));const u={a:o,b:c,c:l,normal:new R,materialIndex:0};wi.getNormal(Nr,Fr,Or,u.normal),h.face=u,h.barycoord=d}return h}class Ql extends ii{constructor(e=null,t=1,i=1,n,r,a,o,c,l=Xt,h=Xt,d,u){super(null,a,o,c,l,h,n,r,d,u),this.isDataTexture=!0,this.image={data:e,width:t,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class oh extends fi{constructor(e,t,i,n=1){super(e,t,i),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=n}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){const e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}}const hs=new Tt,lh=new Tt,Gr=[],ch=new qn,wp=new Tt,Fs=new je,Os=new Es;class or extends je{constructor(e,t,i){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new oh(new Float32Array(i*16),16),this.instanceColor=null,this.morphTexture=null,this.count=i,this.boundingBox=null,this.boundingSphere=null;for(let n=0;n<i;n++)this.setMatrixAt(n,wp)}computeBoundingBox(){const e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new qn),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let i=0;i<t;i++)this.getMatrixAt(i,hs),ch.copy(e.boundingBox).applyMatrix4(hs),this.boundingBox.union(ch)}computeBoundingSphere(){const e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new Es),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let i=0;i<t;i++)this.getMatrixAt(i,hs),Os.copy(e.boundingSphere).applyMatrix4(hs),this.boundingSphere.union(Os)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){return this.instanceColor===null?t.setRGB(1,1,1):t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){return t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){const i=t.morphTargetInfluences,n=this.morphTexture.source.data.data,r=i.length+1,a=e*r+1;for(let o=0;o<i.length;o++)i[o]=n[a+o]}raycast(e,t){const i=this.matrixWorld,n=this.count;if(Fs.geometry=this.geometry,Fs.material=this.material,Fs.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Os.copy(this.boundingSphere),Os.applyMatrix4(i),e.ray.intersectsSphere(Os)!==!1))for(let r=0;r<n;r++){this.getMatrixAt(r,hs),lh.multiplyMatrices(i,hs),Fs.matrixWorld=lh,Fs.raycast(e,Gr);for(let a=0,o=Gr.length;a<o;a++){const c=Gr[a];c.instanceId=r,c.object=this,t.push(c)}Gr.length=0}}setColorAt(e,t){return this.instanceColor===null&&(this.instanceColor=new oh(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3),this}setMatrixAt(e,t){return t.toArray(this.instanceMatrix.array,e*16),this}setMorphAt(e,t){const i=t.morphTargetInfluences,n=i.length+1;this.morphTexture===null&&(this.morphTexture=new Ql(new Float32Array(n*this.count),n,this.count,Xl,Li));const r=this.morphTexture.source.data.data;let a=0;for(let l=0;l<i.length;l++)a+=i[l];const o=this.geometry.morphTargetsRelative?1:1-a,c=n*e;return r[c]=o,r.set(i,c+1),this}updateMorphTargets(){}dispose(){super.dispose(),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}}const Dn=new Es,Ep=new ae(.5,.5),Vr=new R;class ec{constructor(e=new wn,t=new wn,i=new wn,n=new wn,r=new wn,a=new wn){this.planes=[e,t,i,n,r,a]}set(e,t,i,n,r,a){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(i),o[3].copy(n),o[4].copy(r),o[5].copy(a),this}copy(e){const t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=Gi,i=!1){const n=this.planes,r=e.elements,a=r[0],o=r[1],c=r[2],l=r[3],h=r[4],d=r[5],u=r[6],f=r[7],g=r[8],S=r[9],p=r[10],m=r[11],M=r[12],T=r[13],_=r[14],b=r[15];if(n[0].setComponents(l-a,f-h,m-g,b-M).normalize(),n[1].setComponents(l+a,f+h,m+g,b+M).normalize(),n[2].setComponents(l+o,f+d,m+S,b+T).normalize(),n[3].setComponents(l-o,f-d,m-S,b-T).normalize(),i)n[4].setComponents(c,u,p,_).normalize(),n[5].setComponents(l-c,f-u,m-p,b-_).normalize();else if(n[4].setComponents(l-c,f-u,m-p,b-_).normalize(),t===Gi)n[5].setComponents(l+c,f+u,m+p,b+_).normalize();else if(t===ar)n[5].setComponents(c,u,p,_).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Dn.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Dn.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Dn)}intersectsSprite(e){Dn.center.set(0,0,0);const t=Ep.distanceTo(e.center);return Dn.radius=.7071067811865476+t,Dn.applyMatrix4(e.matrixWorld),this.intersectsSphere(Dn)}intersectsSphere(e){const t=this.planes,i=e.center,n=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(i)<n)return!1;return!0}intersectsBox(e){const t=this.planes;for(let i=0;i<6;i++){const n=t[i];if(Vr.x=n.normal.x>0?e.max.x:e.min.x,Vr.y=n.normal.y>0?e.max.y:e.min.y,Vr.z=n.normal.z>0?e.max.z:e.min.z,n.distanceToPoint(Vr)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class Pl extends Cn{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Xe(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const hh=new Tt,Rl=new Ku,Wr=new Es,Xr=new R;class uh extends Ft{constructor(e=new Ot,t=new Pl){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){const i=this.geometry,n=this.matrixWorld,r=e.params.Points.threshold,a=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),Wr.copy(i.boundingSphere),Wr.applyMatrix4(n),Wr.radius+=r,e.ray.intersectsSphere(Wr)===!1)return;hh.copy(n).invert(),Rl.copy(e.ray).applyMatrix4(hh);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=o*o,l=i.index,d=i.attributes.position;if(l!==null){const u=Math.max(0,a.start),f=Math.min(l.count,a.start+a.count);for(let g=u,S=f;g<S;g++){const p=l.getX(g);Xr.fromBufferAttribute(d,p),dh(Xr,p,c,n,e,t,this)}}else{const u=Math.max(0,a.start),f=Math.min(d.count,a.start+a.count);for(let g=u,S=f;g<S;g++)Xr.fromBufferAttribute(d,g),dh(Xr,g,c,n,e,t,this)}}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const n=t[i[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=n.length;r<a;r++){const o=n[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function dh(s,e,t,i,n,r,a){const o=Rl.distanceSqToPoint(s);if(o<t){const c=new R;Rl.closestPointToPoint(s,c),c.applyMatrix4(i);const l=n.ray.origin.distanceTo(c);if(l<n.near||l>n.far)return;r.push({distance:l,distanceToRay:Math.sqrt(o),point:c,index:e,face:null,faceIndex:null,barycoord:null,object:a})}}class Yu extends ii{constructor(e=[],t=zn,i,n,r,a,o,c,l,h){super(e,t,i,n,r,a,o,c,l,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class tc extends ii{constructor(e,t,i,n,r,a,o,c,l){super(e,t,i,n,r,a,o,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}}class lr extends ii{constructor(e,t,i=Xi,n,r,a,o=Xt,c=Xt,l,h=un,d=1){if(h!==un&&h!==On)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const u={width:e,height:t,depth:d};super(u,n,r,a,o,c,h,i,l),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Zl(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return t.compareFunction=this.compareFunction,t}}class Tp extends lr{constructor(e,t=Xi,i=zn,n,r,a=Xt,o=Xt,c,l=un){const h={width:e,height:e,depth:1},d=[h,h,h,h,h,h];super(e,e,t,i,n,r,a,o,c,l),this.image=d,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}}class Ju extends ii{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class Ee extends Ot{constructor(e=1,t=1,i=1,n=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:n,heightSegments:r,depthSegments:a};const o=this;n=Math.floor(n),r=Math.floor(r),a=Math.floor(a);const c=[],l=[],h=[],d=[];let u=0,f=0;g("z","y","x",-1,-1,i,t,e,a,r,0),g("z","y","x",1,-1,i,t,-e,a,r,1),g("x","z","y",1,1,e,i,t,n,a,2),g("x","z","y",1,-1,e,i,-t,n,a,3),g("x","y","z",1,-1,e,t,i,n,r,4),g("x","y","z",-1,-1,e,t,-i,n,r,5),this.setIndex(c),this.setAttribute("position",new ft(l,3)),this.setAttribute("normal",new ft(h,3)),this.setAttribute("uv",new ft(d,2));function g(S,p,m,M,T,_,b,E,P,x,w){const C=_/P,I=b/x,N=_/2,B=b/2,U=E/2,O=P+1,K=x+1;let V=0,ne=0;const X=new R;for(let Q=0;Q<K;Q++){const j=Q*I-B;for(let Ne=0;Ne<O;Ne++){const he=Ne*C-N;X[S]=he*M,X[p]=j*T,X[m]=U,l.push(X.x,X.y,X.z),X[S]=0,X[p]=0,X[m]=E>0?1:-1,h.push(X.x,X.y,X.z),d.push(Ne/P),d.push(1-Q/x),V+=1}}for(let Q=0;Q<x;Q++)for(let j=0;j<P;j++){const Ne=u+j+O*Q,he=u+j+O*(Q+1),Qe=u+(j+1)+O*(Q+1),Ke=u+(j+1)+O*Q;c.push(Ne,he,Ke),c.push(he,Qe,Ke),ne+=6}o.addGroup(f,ne,w),f+=ne,u+=V}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ee(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}class pr extends Ot{constructor(e=1,t=1,i=4,n=8,r=1){super(),this.type="CapsuleGeometry",this.parameters={radius:e,height:t,capSegments:i,radialSegments:n,heightSegments:r},t=Math.max(0,t),i=Math.max(1,Math.floor(i)),n=Math.max(3,Math.floor(n)),r=Math.max(1,Math.floor(r));const a=[],o=[],c=[],l=[],h=t/2,d=Math.PI/2*e,u=t,f=2*d+u,g=i*2+r,S=n+1,p=new R,m=new R;for(let M=0;M<=g;M++){let T=0,_=0,b=0,E=0;if(M<=i){const w=M/i,C=w*Math.PI/2;_=-h-e*Math.cos(C),b=e*Math.sin(C),E=-e*Math.cos(C),T=w*d}else if(M<=i+r){const w=(M-i)/r;_=-h+w*t,b=e,E=0,T=d+w*u}else{const w=(M-i-r)/i,C=w*Math.PI/2;_=h+e*Math.sin(C),b=e*Math.cos(C),E=e*Math.sin(C),T=d+u+w*d}const P=Math.max(0,Math.min(1,T/f));let x=0;M===0?x=.5/n:M===g&&(x=-.5/n);for(let w=0;w<=n;w++){const C=w/n,I=C*Math.PI*2,N=Math.sin(I),B=Math.cos(I);m.x=-b*B,m.y=_,m.z=b*N,o.push(m.x,m.y,m.z),p.set(-b*B,E,b*N),p.normalize(),c.push(p.x,p.y,p.z),l.push(C+x,P)}if(M>0){const w=(M-1)*S;for(let C=0;C<n;C++){const I=w+C,N=w+C+1,B=M*S+C,U=M*S+C+1;a.push(I,N,B),a.push(N,U,B)}}}this.setIndex(a),this.setAttribute("position",new ft(o,3)),this.setAttribute("normal",new ft(c,3)),this.setAttribute("uv",new ft(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new pr(e.radius,e.height,e.capSegments,e.radialSegments,e.heightSegments)}}class La extends Ot{constructor(e=1,t=32,i=0,n=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:i,thetaLength:n},t=Math.max(3,t);const r=[],a=[],o=[],c=[],l=new R,h=new ae;a.push(0,0,0),o.push(0,0,1),c.push(.5,.5);for(let d=0,u=3;d<=t;d++,u+=3){const f=i+d/t*n;l.x=e*Math.cos(f),l.y=e*Math.sin(f),a.push(l.x,l.y,l.z),o.push(0,0,1),h.x=(a[u]/e+1)/2,h.y=(a[u+1]/e+1)/2,c.push(h.x,h.y)}for(let d=1;d<=t;d++)r.push(d,d+1,0);this.setIndex(r),this.setAttribute("position",new ft(a,3)),this.setAttribute("normal",new ft(o,3)),this.setAttribute("uv",new ft(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new La(e.radius,e.segments,e.thetaStart,e.thetaLength)}}class Ue extends Ot{constructor(e=1,t=1,i=1,n=32,r=1,a=!1,o=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:i,radialSegments:n,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:c};const l=this;n=Math.floor(n),r=Math.floor(r);const h=[],d=[],u=[],f=[];let g=0;const S=[],p=i/2;let m=0;M(),a===!1&&(e>0&&T(!0),t>0&&T(!1)),this.setIndex(h),this.setAttribute("position",new ft(d,3)),this.setAttribute("normal",new ft(u,3)),this.setAttribute("uv",new ft(f,2));function M(){const _=new R,b=new R;let E=0;const P=(t-e)/i;for(let x=0;x<=r;x++){const w=[],C=x/r,I=C*(t-e)+e;for(let N=0;N<=n;N++){const B=N/n,U=B*c+o,O=Math.sin(U),K=Math.cos(U);b.x=I*O,b.y=-C*i+p,b.z=I*K,d.push(b.x,b.y,b.z),_.set(O,P,K).normalize(),u.push(_.x,_.y,_.z),f.push(B,1-C),w.push(g++)}S.push(w)}for(let x=0;x<n;x++)for(let w=0;w<r;w++){const C=S[w][x],I=S[w+1][x],N=S[w+1][x+1],B=S[w][x+1];(e>0||w!==0)&&(h.push(C,I,B),E+=3),(t>0||w!==r-1)&&(h.push(I,N,B),E+=3)}l.addGroup(m,E,0),m+=E}function T(_){const b=g,E=new ae,P=new R;let x=0;const w=_===!0?e:t,C=_===!0?1:-1;for(let N=1;N<=n;N++)d.push(0,p*C,0),u.push(0,C,0),f.push(.5,.5),g++;const I=g;for(let N=0;N<=n;N++){const U=N/n*c+o,O=Math.cos(U),K=Math.sin(U);P.x=w*K,P.y=p*C,P.z=w*O,d.push(P.x,P.y,P.z),u.push(0,C,0),E.x=O*.5+.5,E.y=K*.5*C+.5,f.push(E.x,E.y),g++}for(let N=0;N<n;N++){const B=b+N,U=I+N;_===!0?h.push(U,U+1,B):h.push(U+1,U,B),x+=3}l.addGroup(m,x,_===!0?1:2),m+=x}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ue(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class Qt extends Ue{constructor(e=1,t=1,i=32,n=1,r=!1,a=0,o=Math.PI*2){super(0,e,t,i,n,r,a,o),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:i,heightSegments:n,openEnded:r,thetaStart:a,thetaLength:o}}static fromJSON(e){return new Qt(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class ic extends Ot{constructor(e=[],t=[],i=1,n=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:i,detail:n};const r=[],a=[];o(n),l(i),h(),this.setAttribute("position",new ft(r,3)),this.setAttribute("normal",new ft(r.slice(),3)),this.setAttribute("uv",new ft(a,2)),n===0?this.computeVertexNormals():this.normalizeNormals();function o(M){const T=new R,_=new R,b=new R;for(let E=0;E<t.length;E+=3)f(t[E+0],T),f(t[E+1],_),f(t[E+2],b),c(T,_,b,M)}function c(M,T,_,b){const E=b+1,P=[];for(let x=0;x<=E;x++){P[x]=[];const w=M.clone().lerp(_,x/E),C=T.clone().lerp(_,x/E),I=E-x;for(let N=0;N<=I;N++)N===0&&x===E?P[x][N]=w:P[x][N]=w.clone().lerp(C,N/I)}for(let x=0;x<E;x++)for(let w=0;w<2*(E-x)-1;w++){const C=Math.floor(w/2);w%2===0?(u(P[x][C+1]),u(P[x+1][C]),u(P[x][C])):(u(P[x][C+1]),u(P[x+1][C+1]),u(P[x+1][C]))}}function l(M){const T=new R;for(let _=0;_<r.length;_+=3)T.x=r[_+0],T.y=r[_+1],T.z=r[_+2],T.normalize().multiplyScalar(M),r[_+0]=T.x,r[_+1]=T.y,r[_+2]=T.z}function h(){const M=new R;for(let T=0;T<r.length;T+=3){M.x=r[T+0],M.y=r[T+1],M.z=r[T+2];const _=p(M)/2/Math.PI+.5,b=m(M)/Math.PI+.5;a.push(_,1-b)}g(),d()}function d(){for(let M=0;M<a.length;M+=6){const T=a[M+0],_=a[M+2],b=a[M+4],E=Math.max(T,_,b),P=Math.min(T,_,b);E>.9&&P<.1&&(T<.2&&(a[M+0]+=1),_<.2&&(a[M+2]+=1),b<.2&&(a[M+4]+=1))}}function u(M){r.push(M.x,M.y,M.z)}function f(M,T){const _=M*3;T.x=e[_+0],T.y=e[_+1],T.z=e[_+2]}function g(){const M=new R,T=new R,_=new R,b=new R,E=new ae,P=new ae,x=new ae;for(let w=0,C=0;w<r.length;w+=9,C+=6){M.set(r[w+0],r[w+1],r[w+2]),T.set(r[w+3],r[w+4],r[w+5]),_.set(r[w+6],r[w+7],r[w+8]),E.set(a[C+0],a[C+1]),P.set(a[C+2],a[C+3]),x.set(a[C+4],a[C+5]),b.copy(M).add(T).add(_).divideScalar(3);const I=p(b);S(E,C+0,M,I),S(P,C+2,T,I),S(x,C+4,_,I)}}function S(M,T,_,b){b<0&&M.x===1&&(a[T]=M.x-1),_.x===0&&_.z===0&&(a[T]=b/2/Math.PI+.5)}function p(M){return Math.atan2(M.z,-M.x)}function m(M){return Math.atan2(-M.y,Math.sqrt(M.x*M.x+M.z*M.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ic(e.vertices,e.indices,e.radius,e.detail)}}class Ki{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){Ze("Curve: .getPoint() not implemented.")}getPointAt(e,t){const i=this.getUtoTmapping(e);return this.getPoint(i,t)}getPoints(e=5){const t=[];for(let i=0;i<=e;i++)t.push(this.getPoint(i/e));return t}getSpacedPoints(e=5){const t=[];for(let i=0;i<=e;i++)t.push(this.getPointAt(i/e));return t}getLength(){const e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const t=[];let i,n=this.getPoint(0),r=0;t.push(0);for(let a=1;a<=e;a++)i=this.getPoint(a/e),r+=i.distanceTo(n),t.push(r),n=i;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){const i=this.getLengths();let n=0;const r=i.length;let a;t?a=t:a=e*i[r-1];let o=0,c=r-1,l;for(;o<=c;)if(n=Math.floor(o+(c-o)/2),l=i[n]-a,l<0)o=n+1;else if(l>0)c=n-1;else{c=n;break}if(n=c,i[n]===a)return n/(r-1);const h=i[n],u=i[n+1]-h,f=(a-h)/u;return(n+f)/(r-1)}getTangent(e,t){let n=e-1e-4,r=e+1e-4;n<0&&(n=0),r>1&&(r=1);const a=this.getPoint(n),o=this.getPoint(r),c=t||(a.isVector2?new ae:new R);return c.copy(o).sub(a).normalize(),c}getTangentAt(e,t){const i=this.getUtoTmapping(e);return this.getTangent(i,t)}computeFrenetFrames(e,t=!1){const i=new R,n=[],r=[],a=[],o=new R,c=new Tt;for(let f=0;f<=e;f++){const g=f/e;n[f]=this.getTangentAt(g,new R)}r[0]=new R,a[0]=new R;let l=Number.MAX_VALUE;const h=Math.abs(n[0].x),d=Math.abs(n[0].y),u=Math.abs(n[0].z);h<=l&&(l=h,i.set(1,0,0)),d<=l&&(l=d,i.set(0,1,0)),u<=l&&i.set(0,0,1),o.crossVectors(n[0],i).normalize(),r[0].crossVectors(n[0],o),a[0].crossVectors(n[0],r[0]);for(let f=1;f<=e;f++){if(r[f]=r[f-1].clone(),a[f]=a[f-1].clone(),o.crossVectors(n[f-1],n[f]),o.length()>Number.EPSILON){o.normalize();const g=Math.acos(ht(n[f-1].dot(n[f]),-1,1));r[f].applyMatrix4(c.makeRotationAxis(o,g))}a[f].crossVectors(n[f],r[f])}if(t===!0){let f=Math.acos(ht(r[0].dot(r[e]),-1,1));f/=e,n[0].dot(o.crossVectors(r[0],r[e]))>0&&(f=-f);for(let g=1;g<=e;g++)r[g].applyMatrix4(c.makeRotationAxis(n[g],f*g)),a[g].crossVectors(n[g],r[g])}return{tangents:n,normals:r,binormals:a}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){const e={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}}class nc extends Ki{constructor(e=0,t=0,i=1,n=1,r=0,a=Math.PI*2,o=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=i,this.yRadius=n,this.aStartAngle=r,this.aEndAngle=a,this.aClockwise=o,this.aRotation=c}getPoint(e,t=new ae){const i=t,n=Math.PI*2;let r=this.aEndAngle-this.aStartAngle;const a=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=n;for(;r>n;)r-=n;r<Number.EPSILON&&(a?r=0:r=n),this.aClockwise===!0&&!a&&(r===n?r=-n:r=r-n);const o=this.aStartAngle+e*r;let c=this.aX+this.xRadius*Math.cos(o),l=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){const h=Math.cos(this.aRotation),d=Math.sin(this.aRotation),u=c-this.aX,f=l-this.aY;c=u*h-f*d+this.aX,l=u*d+f*h+this.aY}return i.set(c,l)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){const e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}}class Ap extends nc{constructor(e,t,i,n,r,a){super(e,t,i,i,n,r,a),this.isArcCurve=!0,this.type="ArcCurve"}}function sc(){let s=0,e=0,t=0,i=0;function n(r,a,o,c){s=r,e=o,t=-3*r+3*a-2*o-c,i=2*r-2*a+o+c}return{initCatmullRom:function(r,a,o,c,l){n(a,o,l*(o-r),l*(c-a))},initNonuniformCatmullRom:function(r,a,o,c,l,h,d){let u=(a-r)/l-(o-r)/(l+h)+(o-a)/h,f=(o-a)/h-(c-a)/(h+d)+(c-o)/d;u*=h,f*=h,n(a,o,u,f)},calc:function(r){const a=r*r,o=a*r;return s+e*r+t*a+i*o}}}const fh=new R,ph=new R,xo=new sc,_o=new sc,yo=new sc;class Cp extends Ki{constructor(e=[],t=!1,i="centripetal",n=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=i,this.tension=n}getPoint(e,t=new R){const i=t,n=this.points,r=n.length,a=(r-(this.closed?0:1))*e;let o=Math.floor(a),c=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/r)+1)*r:c===0&&o===r-1&&(o=r-2,c=1);let l,h;this.closed||o>0?l=n[(o-1)%r]:(ph.subVectors(n[0],n[1]).add(n[0]),l=ph);const d=n[o%r],u=n[(o+1)%r];if(this.closed||o+2<r?h=n[(o+2)%r]:(fh.subVectors(n[r-1],n[r-2]).add(n[r-1]),h=fh),this.curveType==="centripetal"||this.curveType==="chordal"){const f=this.curveType==="chordal"?.5:.25;let g=Math.pow(l.distanceToSquared(d),f),S=Math.pow(d.distanceToSquared(u),f),p=Math.pow(u.distanceToSquared(h),f);S<1e-4&&(S=1),g<1e-4&&(g=S),p<1e-4&&(p=S),xo.initNonuniformCatmullRom(l.x,d.x,u.x,h.x,g,S,p),_o.initNonuniformCatmullRom(l.y,d.y,u.y,h.y,g,S,p),yo.initNonuniformCatmullRom(l.z,d.z,u.z,h.z,g,S,p)}else this.curveType==="catmullrom"&&(xo.initCatmullRom(l.x,d.x,u.x,h.x,this.tension),_o.initCatmullRom(l.y,d.y,u.y,h.y,this.tension),yo.initCatmullRom(l.z,d.z,u.z,h.z,this.tension));return i.set(xo.calc(c),_o.calc(c),yo.calc(c)),i}copy(e){super.copy(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const n=e.points[t];this.points.push(n.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,i=this.points.length;t<i;t++){const n=this.points[t];e.points.push(n.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const n=e.points[t];this.points.push(new R().fromArray(n))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}}function mh(s,e,t,i,n){const r=(i-e)*.5,a=(n-t)*.5,o=s*s,c=s*o;return(2*t-2*i+r+a)*c+(-3*t+3*i-2*r-a)*o+r*s+t}function Pp(s,e){const t=1-s;return t*t*e}function Rp(s,e){return 2*(1-s)*s*e}function Lp(s,e){return s*s*e}function Zs(s,e,t,i){return Pp(s,e)+Rp(s,t)+Lp(s,i)}function Ip(s,e){const t=1-s;return t*t*t*e}function Dp(s,e){const t=1-s;return 3*t*t*s*e}function kp(s,e){return 3*(1-s)*s*s*e}function Up(s,e){return s*s*s*e}function js(s,e,t,i,n){return Ip(s,e)+Dp(s,t)+kp(s,i)+Up(s,n)}class Zu extends Ki{constructor(e=new ae,t=new ae,i=new ae,n=new ae){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=i,this.v3=n}getPoint(e,t=new ae){const i=t,n=this.v0,r=this.v1,a=this.v2,o=this.v3;return i.set(js(e,n.x,r.x,a.x,o.x),js(e,n.y,r.y,a.y,o.y)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class Np extends Ki{constructor(e=new R,t=new R,i=new R,n=new R){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=i,this.v3=n}getPoint(e,t=new R){const i=t,n=this.v0,r=this.v1,a=this.v2,o=this.v3;return i.set(js(e,n.x,r.x,a.x,o.x),js(e,n.y,r.y,a.y,o.y),js(e,n.z,r.z,a.z,o.z)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class ju extends Ki{constructor(e=new ae,t=new ae){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new ae){const i=t;return e===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(e).add(this.v1)),i}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new ae){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Fp extends Ki{constructor(e=new R,t=new R){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new R){const i=t;return e===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(e).add(this.v1)),i}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new R){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Qu extends Ki{constructor(e=new ae,t=new ae,i=new ae){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=i}getPoint(e,t=new ae){const i=t,n=this.v0,r=this.v1,a=this.v2;return i.set(Zs(e,n.x,r.x,a.x),Zs(e,n.y,r.y,a.y)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Op extends Ki{constructor(e=new R,t=new R,i=new R){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=i}getPoint(e,t=new R){const i=t,n=this.v0,r=this.v1,a=this.v2;return i.set(Zs(e,n.x,r.x,a.x),Zs(e,n.y,r.y,a.y),Zs(e,n.z,r.z,a.z)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class ed extends Ki{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new ae){const i=t,n=this.points,r=(n.length-1)*e,a=Math.floor(r),o=r-a,c=n[a===0?a:a-1],l=n[a],h=n[a>n.length-2?n.length-1:a+1],d=n[a>n.length-3?n.length-1:a+2];return i.set(mh(o,c.x,l.x,h.x,d.x),mh(o,c.y,l.y,h.y,d.y)),i}copy(e){super.copy(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const n=e.points[t];this.points.push(n.clone())}return this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,i=this.points.length;t<i;t++){const n=this.points[t];e.points.push(n.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const n=e.points[t];this.points.push(new ae().fromArray(n))}return this}}var Ll=Object.freeze({__proto__:null,ArcCurve:Ap,CatmullRomCurve3:Cp,CubicBezierCurve:Zu,CubicBezierCurve3:Np,EllipseCurve:nc,LineCurve:ju,LineCurve3:Fp,QuadraticBezierCurve:Qu,QuadraticBezierCurve3:Op,SplineCurve:ed});class Bp extends Ki{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){const e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){const i=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Ll[i](t,e))}return this}getPoint(e,t){const i=e*this.getLength(),n=this.getCurveLengths();let r=0;for(;r<n.length;){if(n[r]>=i){const a=n[r]-i,o=this.curves[r],c=o.getLength(),l=c===0?0:1-a/c;return o.getPointAt(l,t)}r++}return null}getLength(){const e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const e=[];let t=0;for(let i=0,n=this.curves.length;i<n;i++)t+=this.curves[i].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){const t=[];for(let i=0;i<=e;i++)t.push(this.getPoint(i/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){const t=[];let i;for(let n=0,r=this.curves;n<r.length;n++){const a=r[n],o=a.isEllipseCurve?e*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?e*a.points.length:e,c=a.getPoints(o);for(let l=0;l<c.length;l++){const h=c[l];i&&i.equals(h)||(t.push(h),i=h)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,i=e.curves.length;t<i;t++){const n=e.curves[t];this.curves.push(n.clone())}return this.autoClose=e.autoClose,this}toJSON(){const e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,i=this.curves.length;t<i;t++){const n=this.curves[t];e.curves.push(n.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,i=e.curves.length;t<i;t++){const n=e.curves[t];this.curves.push(new Ll[n.type]().fromJSON(n))}return this}}class gh extends Bp{constructor(e){super(),this.type="Path",this.currentPoint=new ae,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,i=e.length;t<i;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){const i=new ju(this.currentPoint.clone(),new ae(e,t));return this.curves.push(i),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,i,n){const r=new Qu(this.currentPoint.clone(),new ae(e,t),new ae(i,n));return this.curves.push(r),this.currentPoint.set(i,n),this}bezierCurveTo(e,t,i,n,r,a){const o=new Zu(this.currentPoint.clone(),new ae(e,t),new ae(i,n),new ae(r,a));return this.curves.push(o),this.currentPoint.set(r,a),this}splineThru(e){const t=[this.currentPoint.clone()].concat(e),i=new ed(t);return this.curves.push(i),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,i,n,r,a){const o=this.currentPoint.x,c=this.currentPoint.y;return this.absarc(e+o,t+c,i,n,r,a),this}absarc(e,t,i,n,r,a){return this.absellipse(e,t,i,i,n,r,a),this}ellipse(e,t,i,n,r,a,o,c){const l=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(e+l,t+h,i,n,r,a,o,c),this}absellipse(e,t,i,n,r,a,o,c){const l=new nc(e,t,i,n,r,a,o,c);if(this.curves.length>0){const d=l.getPoint(0);d.equals(this.currentPoint)||this.lineTo(d.x,d.y)}this.curves.push(l);const h=l.getPoint(1);return this.currentPoint.copy(h),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){const e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}}class cr extends gh{constructor(e){super(e),this.uuid=cn(),this.type="Shape",this.holes=[]}getPointsHoles(e){const t=[];for(let i=0,n=this.holes.length;i<n;i++)t[i]=this.holes[i].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,i=e.holes.length;t<i;t++){const n=e.holes[t];this.holes.push(n.clone())}return this}toJSON(){const e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,i=this.holes.length;t<i;t++){const n=this.holes[t];e.holes.push(n.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,i=e.holes.length;t<i;t++){const n=e.holes[t];this.holes.push(new gh().fromJSON(n))}return this}}function Hp(s,e,t=2){const i=e&&e.length,n=i?e[0]*t:s.length;let r=td(s,0,n,t,!0);const a=[];if(!r||r.next===r.prev)return a;let o,c,l;if(i&&(r=Xp(s,e,r,t)),s.length>80*t){o=s[0],c=s[1];let h=o,d=c;for(let u=t;u<n;u+=t){const f=s[u],g=s[u+1];f<o&&(o=f),g<c&&(c=g),f>h&&(h=f),g>d&&(d=g)}l=Math.max(h-o,d-c),l=l!==0?32767/l:0}return hr(r,a,t,o,c,l,0),a}function td(s,e,t,i,n){let r;if(n===i0(s,e,t,i)>0)for(let a=e;a<t;a+=i)r=vh(a/i|0,s[a],s[a+1],r);else for(let a=t-i;a>=e;a-=i)r=vh(a/i|0,s[a],s[a+1],r);return r&&Ms(r,r.next)&&(dr(r),r=r.next),r}function Vn(s,e){if(!s)return s;e||(e=s);let t=s,i;do if(i=!1,!t.steiner&&(Ms(t,t.next)||Dt(t.prev,t,t.next)===0)){if(dr(t),t=e=t.prev,t===t.next)break;i=!0}else t=t.next;while(i||t!==e);return e}function hr(s,e,t,i,n,r,a){if(!s)return;!a&&r&&Jp(s,i,n,r);let o=s;for(;s.prev!==s.next;){const c=s.prev,l=s.next;if(r?Gp(s,i,n,r):zp(s)){e.push(c.i,s.i,l.i),dr(s),s=l.next,o=l.next;continue}if(s=l,s===o){a?a===1?(s=Vp(Vn(s),e),hr(s,e,t,i,n,r,2)):a===2&&Wp(s,e,t,i,n,r):hr(Vn(s),e,t,i,n,r,1);break}}}function zp(s){const e=s.prev,t=s,i=s.next;if(Dt(e,t,i)>=0)return!1;const n=e.x,r=t.x,a=i.x,o=e.y,c=t.y,l=i.y,h=Math.min(n,r,a),d=Math.min(o,c,l),u=Math.max(n,r,a),f=Math.max(o,c,l);let g=i.next;for(;g!==e;){if(g.x>=h&&g.x<=u&&g.y>=d&&g.y<=f&&Ws(n,o,r,c,a,l,g.x,g.y)&&Dt(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function Gp(s,e,t,i){const n=s.prev,r=s,a=s.next;if(Dt(n,r,a)>=0)return!1;const o=n.x,c=r.x,l=a.x,h=n.y,d=r.y,u=a.y,f=Math.min(o,c,l),g=Math.min(h,d,u),S=Math.max(o,c,l),p=Math.max(h,d,u),m=Il(f,g,e,t,i),M=Il(S,p,e,t,i);let T=s.prevZ,_=s.nextZ;for(;T&&T.z>=m&&_&&_.z<=M;){if(T.x>=f&&T.x<=S&&T.y>=g&&T.y<=p&&T!==n&&T!==a&&Ws(o,h,c,d,l,u,T.x,T.y)&&Dt(T.prev,T,T.next)>=0||(T=T.prevZ,_.x>=f&&_.x<=S&&_.y>=g&&_.y<=p&&_!==n&&_!==a&&Ws(o,h,c,d,l,u,_.x,_.y)&&Dt(_.prev,_,_.next)>=0))return!1;_=_.nextZ}for(;T&&T.z>=m;){if(T.x>=f&&T.x<=S&&T.y>=g&&T.y<=p&&T!==n&&T!==a&&Ws(o,h,c,d,l,u,T.x,T.y)&&Dt(T.prev,T,T.next)>=0)return!1;T=T.prevZ}for(;_&&_.z<=M;){if(_.x>=f&&_.x<=S&&_.y>=g&&_.y<=p&&_!==n&&_!==a&&Ws(o,h,c,d,l,u,_.x,_.y)&&Dt(_.prev,_,_.next)>=0)return!1;_=_.nextZ}return!0}function Vp(s,e){let t=s;do{const i=t.prev,n=t.next.next;!Ms(i,n)&&nd(i,t,t.next,n)&&ur(i,n)&&ur(n,i)&&(e.push(i.i,t.i,n.i),dr(t),dr(t.next),t=s=n),t=t.next}while(t!==s);return Vn(t)}function Wp(s,e,t,i,n,r){let a=s;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&Qp(a,o)){let c=sd(a,o);a=Vn(a,a.next),c=Vn(c,c.next),hr(a,e,t,i,n,r,0),hr(c,e,t,i,n,r,0);return}o=o.next}a=a.next}while(a!==s)}function Xp(s,e,t,i){const n=[];for(let r=0,a=e.length;r<a;r++){const o=e[r]*i,c=r<a-1?e[r+1]*i:s.length,l=td(s,o,c,i,!1);l===l.next&&(l.steiner=!0),n.push(jp(l))}n.sort(qp);for(let r=0;r<n.length;r++)t=$p(n[r],t);return t}function qp(s,e){let t=s.x-e.x;if(t===0&&(t=s.y-e.y,t===0)){const i=(s.next.y-s.y)/(s.next.x-s.x),n=(e.next.y-e.y)/(e.next.x-e.x);t=i-n}return t}function $p(s,e){const t=Kp(s,e);if(!t)return e;const i=sd(t,s);return Vn(i,i.next),Vn(t,t.next)}function Kp(s,e){let t=e;const i=s.x,n=s.y;let r=-1/0,a;if(Ms(s,t))return t;do{if(Ms(s,t.next))return t.next;if(n<=t.y&&n>=t.next.y&&t.next.y!==t.y){const d=t.x+(n-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(d<=i&&d>r&&(r=d,a=t.x<t.next.x?t:t.next,d===i))return a}t=t.next}while(t!==e);if(!a)return null;const o=a,c=a.x,l=a.y;let h=1/0;t=a;do{if(i>=t.x&&t.x>=c&&i!==t.x&&id(n<l?i:r,n,c,l,n<l?r:i,n,t.x,t.y)){const d=Math.abs(n-t.y)/(i-t.x);ur(t,s)&&(d<h||d===h&&(t.x>a.x||t.x===a.x&&Yp(a,t)))&&(a=t,h=d)}t=t.next}while(t!==o);return a}function Yp(s,e){return Dt(s.prev,s,e.prev)<0&&Dt(e.next,s,s.next)<0}function Jp(s,e,t,i){let n=s;do n.z===0&&(n.z=Il(n.x,n.y,e,t,i)),n.prevZ=n.prev,n.nextZ=n.next,n=n.next;while(n!==s);n.prevZ.nextZ=null,n.prevZ=null,Zp(n)}function Zp(s){let e,t=1;do{let i=s,n;s=null;let r=null;for(e=0;i;){e++;let a=i,o=0;for(let l=0;l<t&&(o++,a=a.nextZ,!!a);l++);let c=t;for(;o>0||c>0&&a;)o!==0&&(c===0||!a||i.z<=a.z)?(n=i,i=i.nextZ,o--):(n=a,a=a.nextZ,c--),r?r.nextZ=n:s=n,n.prevZ=r,r=n;i=a}r.nextZ=null,t*=2}while(e>1);return s}function Il(s,e,t,i,n){return s=(s-t)*n|0,e=(e-i)*n|0,s=(s|s<<8)&16711935,s=(s|s<<4)&252645135,s=(s|s<<2)&858993459,s=(s|s<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,s|e<<1}function jp(s){let e=s,t=s;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==s);return t}function id(s,e,t,i,n,r,a,o){return(n-a)*(e-o)>=(s-a)*(r-o)&&(s-a)*(i-o)>=(t-a)*(e-o)&&(t-a)*(r-o)>=(n-a)*(i-o)}function Ws(s,e,t,i,n,r,a,o){return!(s===a&&e===o)&&id(s,e,t,i,n,r,a,o)}function Qp(s,e){return s.next.i!==e.i&&s.prev.i!==e.i&&!e0(s,e)&&(ur(s,e)&&ur(e,s)&&t0(s,e)&&(Dt(s.prev,s,e.prev)||Dt(s,e.prev,e))||Ms(s,e)&&Dt(s.prev,s,s.next)>0&&Dt(e.prev,e,e.next)>0)}function Dt(s,e,t){return(e.y-s.y)*(t.x-e.x)-(e.x-s.x)*(t.y-e.y)}function Ms(s,e){return s.x===e.x&&s.y===e.y}function nd(s,e,t,i){const n=$r(Dt(s,e,t)),r=$r(Dt(s,e,i)),a=$r(Dt(t,i,s)),o=$r(Dt(t,i,e));return!!(n!==r&&a!==o||n===0&&qr(s,t,e)||r===0&&qr(s,i,e)||a===0&&qr(t,s,i)||o===0&&qr(t,e,i))}function qr(s,e,t){return e.x<=Math.max(s.x,t.x)&&e.x>=Math.min(s.x,t.x)&&e.y<=Math.max(s.y,t.y)&&e.y>=Math.min(s.y,t.y)}function $r(s){return s>0?1:s<0?-1:0}function e0(s,e){let t=s;do{if(t.i!==s.i&&t.next.i!==s.i&&t.i!==e.i&&t.next.i!==e.i&&nd(t,t.next,s,e))return!0;t=t.next}while(t!==s);return!1}function ur(s,e){return Dt(s.prev,s,s.next)<0?Dt(s,e,s.next)>=0&&Dt(s,s.prev,e)>=0:Dt(s,e,s.prev)<0||Dt(s,s.next,e)<0}function t0(s,e){let t=s,i=!1;const n=(s.x+e.x)/2,r=(s.y+e.y)/2;do t.y>r!=t.next.y>r&&t.next.y!==t.y&&n<(t.next.x-t.x)*(r-t.y)/(t.next.y-t.y)+t.x&&(i=!i),t=t.next;while(t!==s);return i}function sd(s,e){const t=Dl(s.i,s.x,s.y),i=Dl(e.i,e.x,e.y),n=s.next,r=e.prev;return s.next=e,e.prev=s,t.next=n,n.prev=t,i.next=t,t.prev=i,r.next=i,i.prev=r,i}function vh(s,e,t,i){const n=Dl(s,e,t);return i?(n.next=i.next,n.prev=i,i.next.prev=n,i.next=n):(n.prev=n,n.next=n),n}function dr(s){s.next.prev=s.prev,s.prev.next=s.next,s.prevZ&&(s.prevZ.nextZ=s.nextZ),s.nextZ&&(s.nextZ.prevZ=s.prevZ)}function Dl(s,e,t){return{i:s,x:e,y:t,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function i0(s,e,t,i){let n=0;for(let r=e,a=t-i;r<t;r+=i)n+=(s[a]-s[r])*(s[r+1]+s[a+1]),a=r;return n}class n0{static triangulate(e,t,i=2){return Hp(e,t,i)}}class on{static area(e){const t=e.length;let i=0;for(let n=t-1,r=0;r<t;n=r++)i+=e[n].x*e[r].y-e[r].x*e[n].y;return i*.5}static isClockWise(e){return on.area(e)<0}static triangulateShape(e,t){const i=[],n=[],r=[];xh(e),_h(i,e);let a=e.length;t.forEach(xh);for(let c=0;c<t.length;c++)n.push(a),a+=t[c].length,_h(i,t[c]);const o=n0.triangulate(i,n);for(let c=0;c<o.length;c+=3)r.push(o.slice(c,c+3));return r}}function xh(s){const e=s.length;e>2&&s[e-1].equals(s[0])&&s.pop()}function _h(s,e){for(let t=0;t<e.length;t++)s.push(e[t].x),s.push(e[t].y)}class rc extends Ot{constructor(e=new cr([new ae(.5,.5),new ae(-.5,.5),new ae(-.5,-.5),new ae(.5,-.5)]),t={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:e,options:t},e=Array.isArray(e)?e:[e];const i=this,n=[],r=[];for(let o=0,c=e.length;o<c;o++){const l=e[o];a(l)}this.setAttribute("position",new ft(n,3)),this.setAttribute("uv",new ft(r,2)),this.computeVertexNormals();function a(o){const c=[],l=t.curveSegments!==void 0?t.curveSegments:12,h=t.steps!==void 0?t.steps:1,d=t.depth!==void 0?t.depth:1;let u=t.bevelEnabled!==void 0?t.bevelEnabled:!0,f=t.bevelThickness!==void 0?t.bevelThickness:.2,g=t.bevelSize!==void 0?t.bevelSize:f-.1,S=t.bevelOffset!==void 0?t.bevelOffset:0,p=t.bevelSegments!==void 0?t.bevelSegments:3;const m=t.extrudePath,M=t.UVGenerator!==void 0?t.UVGenerator:s0;let T,_=!1,b,E,P,x;if(m){T=m.getSpacedPoints(h),_=!0,u=!1;const ie=m.isCatmullRomCurve3?m.closed:!1;b=m.computeFrenetFrames(h,ie),E=new R,P=new R,x=new R}u||(p=0,f=0,g=0,S=0);const w=o.extractPoints(l);let C=w.shape;const I=w.holes;if(!on.isClockWise(C)){C=C.reverse();for(let ie=0,re=I.length;ie<re;ie++){const oe=I[ie];on.isClockWise(oe)&&(I[ie]=oe.reverse())}}function B(ie){const oe=10000000000000001e-36;let le=ie[0];for(let de=1;de<=ie.length;de++){const Ve=de%ie.length,ze=ie[Ve],Je=ze.x-le.x,et=ze.y-le.y,L=Je*Je+et*et,xt=Math.max(Math.abs(ze.x),Math.abs(ze.y),Math.abs(le.x),Math.abs(le.y)),lt=oe*xt*xt;if(L<=lt){ie.splice(Ve,1),de--;continue}le=ze}}B(C),I.forEach(B);const U=I.length,O=C;for(let ie=0;ie<U;ie++){const re=I[ie];C=C.concat(re)}function K(ie,re,oe){return re||pt("ExtrudeGeometry: vec does not exist"),ie.clone().addScaledVector(re,oe)}const V=C.length;function ne(ie,re,oe){let le,de,Ve;const ze=ie.x-re.x,Je=ie.y-re.y,et=oe.x-ie.x,L=oe.y-ie.y,xt=ze*ze+Je*Je,lt=ze*L-Je*et;if(Math.abs(lt)>Number.EPSILON){const A=Math.sqrt(xt),v=Math.sqrt(et*et+L*L),F=re.x-Je/A,G=re.y+ze/A,$=oe.x-L/v,ce=oe.y+et/v,ue=(($-F)*L-(ce-G)*et)/(ze*L-Je*et);le=F+ze*ue-ie.x,de=G+Je*ue-ie.y;const Y=le*le+de*de;if(Y<=2)return new ae(le,de);Ve=Math.sqrt(Y/2)}else{let A=!1;ze>Number.EPSILON?et>Number.EPSILON&&(A=!0):ze<-Number.EPSILON?et<-Number.EPSILON&&(A=!0):Math.sign(Je)===Math.sign(L)&&(A=!0),A?(le=-Je,de=ze,Ve=Math.sqrt(xt)):(le=ze,de=Je,Ve=Math.sqrt(xt/2))}return new ae(le/Ve,de/Ve)}const X=[];for(let ie=0,re=O.length,oe=re-1,le=ie+1;ie<re;ie++,oe++,le++)oe===re&&(oe=0),le===re&&(le=0),X[ie]=ne(O[ie],O[oe],O[le]);const Q=[];let j,Ne=X.concat();for(let ie=0,re=U;ie<re;ie++){const oe=I[ie];j=[];for(let le=0,de=oe.length,Ve=de-1,ze=le+1;le<de;le++,Ve++,ze++)Ve===de&&(Ve=0),ze===de&&(ze=0),j[le]=ne(oe[le],oe[Ve],oe[ze]);Q.push(j),Ne=Ne.concat(j)}let he;if(p===0)he=on.triangulateShape(O,I);else{const ie=[],re=[];for(let oe=0;oe<p;oe++){const le=oe/p,de=f*Math.cos(le*Math.PI/2),Ve=g*Math.sin(le*Math.PI/2)+S;for(let ze=0,Je=O.length;ze<Je;ze++){const et=K(O[ze],X[ze],Ve);Se(et.x,et.y,-de),le===0&&ie.push(et)}for(let ze=0,Je=U;ze<Je;ze++){const et=I[ze];j=Q[ze];const L=[];for(let xt=0,lt=et.length;xt<lt;xt++){const A=K(et[xt],j[xt],Ve);Se(A.x,A.y,-de),le===0&&L.push(A)}le===0&&re.push(L)}}he=on.triangulateShape(ie,re)}const Qe=he.length,Ke=g+S;for(let ie=0;ie<V;ie++){const re=u?K(C[ie],Ne[ie],Ke):C[ie];_?(P.copy(b.normals[0]).multiplyScalar(re.x),E.copy(b.binormals[0]).multiplyScalar(re.y),x.copy(T[0]).add(P).add(E),Se(x.x,x.y,x.z)):Se(re.x,re.y,0)}for(let ie=1;ie<=h;ie++)for(let re=0;re<V;re++){const oe=u?K(C[re],Ne[re],Ke):C[re];_?(P.copy(b.normals[ie]).multiplyScalar(oe.x),E.copy(b.binormals[ie]).multiplyScalar(oe.y),x.copy(T[ie]).add(P).add(E),Se(x.x,x.y,x.z)):Se(oe.x,oe.y,d/h*ie)}for(let ie=p-1;ie>=0;ie--){const re=ie/p,oe=f*Math.cos(re*Math.PI/2),le=g*Math.sin(re*Math.PI/2)+S;for(let de=0,Ve=O.length;de<Ve;de++){const ze=K(O[de],X[de],le);Se(ze.x,ze.y,d+oe)}for(let de=0,Ve=I.length;de<Ve;de++){const ze=I[de];j=Q[de];for(let Je=0,et=ze.length;Je<et;Je++){const L=K(ze[Je],j[Je],le);_?Se(L.x,L.y+T[h-1].y,T[h-1].x+oe):Se(L.x,L.y,d+oe)}}}it(),J();function it(){const ie=n.length/3;if(u){let re=0,oe=V*re;for(let le=0;le<Qe;le++){const de=he[le];qe(de[2]+oe,de[1]+oe,de[0]+oe)}re=h+p*2,oe=V*re;for(let le=0;le<Qe;le++){const de=he[le];qe(de[0]+oe,de[1]+oe,de[2]+oe)}}else{for(let re=0;re<Qe;re++){const oe=he[re];qe(oe[2],oe[1],oe[0])}for(let re=0;re<Qe;re++){const oe=he[re];qe(oe[0]+V*h,oe[1]+V*h,oe[2]+V*h)}}i.addGroup(ie,n.length/3-ie,0)}function J(){const ie=n.length/3;let re=0;te(O,re),re+=O.length;for(let oe=0,le=I.length;oe<le;oe++){const de=I[oe];te(de,re),re+=de.length}i.addGroup(ie,n.length/3-ie,1)}function te(ie,re){let oe=ie.length;for(;--oe>=0;){const le=oe;let de=oe-1;de<0&&(de=ie.length-1);for(let Ve=0,ze=h+p*2;Ve<ze;Ve++){const Je=V*Ve,et=V*(Ve+1),L=re+le+Je,xt=re+de+Je,lt=re+de+et,A=re+le+et;Te(L,xt,lt,A)}}}function Se(ie,re,oe){c.push(ie),c.push(re),c.push(oe)}function qe(ie,re,oe){Ye(ie),Ye(re),Ye(oe);const le=n.length/3,de=M.generateTopUV(i,n,le-3,le-2,le-1);St(de[0]),St(de[1]),St(de[2])}function Te(ie,re,oe,le){Ye(ie),Ye(re),Ye(le),Ye(re),Ye(oe),Ye(le);const de=n.length/3,Ve=M.generateSideWallUV(i,n,de-6,de-3,de-2,de-1);St(Ve[0]),St(Ve[1]),St(Ve[3]),St(Ve[1]),St(Ve[2]),St(Ve[3])}function Ye(ie){n.push(c[ie*3+0]),n.push(c[ie*3+1]),n.push(c[ie*3+2])}function St(ie){r.push(ie.x),r.push(ie.y)}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){const e=super.toJSON(),t=this.parameters.shapes,i=this.parameters.options;return r0(t,i,e)}static fromJSON(e,t){const i=[];for(let r=0,a=e.shapes.length;r<a;r++){const o=t[e.shapes[r]];i.push(o)}const n=e.options.extrudePath;return n!==void 0&&(e.options.extrudePath=new Ll[n.type]().fromJSON(n)),new rc(i,e.options)}}const s0={generateTopUV:function(s,e,t,i,n){const r=e[t*3],a=e[t*3+1],o=e[i*3],c=e[i*3+1],l=e[n*3],h=e[n*3+1];return[new ae(r,a),new ae(o,c),new ae(l,h)]},generateSideWallUV:function(s,e,t,i,n,r){const a=e[t*3],o=e[t*3+1],c=e[t*3+2],l=e[i*3],h=e[i*3+1],d=e[i*3+2],u=e[n*3],f=e[n*3+1],g=e[n*3+2],S=e[r*3],p=e[r*3+1],m=e[r*3+2];return Math.abs(o-h)<Math.abs(a-l)?[new ae(a,1-c),new ae(l,1-d),new ae(u,1-g),new ae(S,1-m)]:[new ae(o,1-c),new ae(h,1-d),new ae(f,1-g),new ae(p,1-m)]}};function r0(s,e,t){if(t.shapes=[],Array.isArray(s))for(let i=0,n=s.length;i<n;i++){const r=s[i];t.shapes.push(r.uuid)}else t.shapes.push(s.uuid);return t.options=Object.assign({},e),e.extrudePath!==void 0&&(t.options.extrudePath=e.extrudePath.toJSON()),t}class ac extends ic{constructor(e=1,t=0){const i=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],n=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(i,n,e,t),this.type="OctahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new ac(e.radius,e.detail)}}class ci extends Ot{constructor(e=1,t=1,i=1,n=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:n};const r=e/2,a=t/2,o=Math.floor(i),c=Math.floor(n),l=o+1,h=c+1,d=e/o,u=t/c,f=[],g=[],S=[],p=[];for(let m=0;m<h;m++){const M=m*u-a;for(let T=0;T<l;T++){const _=T*d-r;g.push(_,-M,0),S.push(0,0,1),p.push(T/o),p.push(1-m/c)}}for(let m=0;m<c;m++)for(let M=0;M<o;M++){const T=M+l*m,_=M+l*(m+1),b=M+1+l*(m+1),E=M+1+l*m;f.push(T,_,E),f.push(_,b,E)}this.setIndex(f),this.setAttribute("position",new ft(g,3)),this.setAttribute("normal",new ft(S,3)),this.setAttribute("uv",new ft(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ci(e.width,e.height,e.widthSegments,e.heightSegments)}}class oc extends Ot{constructor(e=.5,t=1,i=32,n=1,r=0,a=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:t,thetaSegments:i,phiSegments:n,thetaStart:r,thetaLength:a},i=Math.max(3,i),n=Math.max(1,n);const o=[],c=[],l=[],h=[];let d=e;const u=(t-e)/n,f=new R,g=new ae;for(let S=0;S<=n;S++){for(let p=0;p<=i;p++){const m=r+p/i*a;f.x=d*Math.cos(m),f.y=d*Math.sin(m),c.push(f.x,f.y,f.z),l.push(0,0,1),g.x=(f.x/t+1)/2,g.y=(f.y/t+1)/2,h.push(g.x,g.y)}d+=u}for(let S=0;S<n;S++){const p=S*(i+1);for(let m=0;m<i;m++){const M=m+p,T=M,_=M+i+1,b=M+i+2,E=M+1;o.push(T,_,E),o.push(_,b,E)}}this.setIndex(o),this.setAttribute("position",new ft(c,3)),this.setAttribute("normal",new ft(l,3)),this.setAttribute("uv",new ft(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new oc(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}}class Ia extends Ot{constructor(e=new cr([new ae(0,.5),new ae(-.5,-.5),new ae(.5,-.5)]),t=12){super(),this.type="ShapeGeometry",this.parameters={shapes:e,curveSegments:t};const i=[],n=[],r=[],a=[];let o=0,c=0;if(Array.isArray(e)===!1)l(e);else for(let h=0;h<e.length;h++)l(e[h]),this.addGroup(o,c,h),o+=c,c=0;this.setIndex(i),this.setAttribute("position",new ft(n,3)),this.setAttribute("normal",new ft(r,3)),this.setAttribute("uv",new ft(a,2));function l(h){const d=n.length/3,u=h.extractPoints(t);let f=u.shape;const g=u.holes;on.isClockWise(f)===!1&&(f=f.reverse());for(let p=0,m=g.length;p<m;p++){const M=g[p];on.isClockWise(M)===!0&&(g[p]=M.reverse())}const S=on.triangulateShape(f,g);for(let p=0,m=g.length;p<m;p++){const M=g[p];f=f.concat(M)}for(let p=0,m=f.length;p<m;p++){const M=f[p];n.push(M.x,M.y,0),r.push(0,0,1),a.push(M.x,M.y)}for(let p=0,m=S.length;p<m;p++){const M=S[p],T=M[0]+d,_=M[1]+d,b=M[2]+d;i.push(T,_,b),c+=3}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){const e=super.toJSON(),t=this.parameters.shapes;return a0(t,e)}static fromJSON(e,t){const i=[];for(let n=0,r=e.shapes.length;n<r;n++){const a=t[e.shapes[n]];i.push(a)}return new Ia(i,e.curveSegments)}}function a0(s,e){if(e.shapes=[],Array.isArray(s))for(let t=0,i=s.length;t<i;t++){const n=s[t];e.shapes.push(n.uuid)}else e.shapes.push(s.uuid);return e}class Pe extends Ot{constructor(e=1,t=32,i=16,n=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:i,phiStart:n,phiLength:r,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),i=Math.max(2,Math.floor(i));const c=Math.min(a+o,Math.PI);let l=0;const h=[],d=new R,u=new R,f=[],g=[],S=[],p=[];for(let m=0;m<=i;m++){const M=[],T=m/i,_=a+T*o,b=e*Math.cos(_),E=Math.sqrt(e*e-b*b);let P=0;m===0&&a===0?P=.5/t:m===i&&c===Math.PI&&(P=-.5/t);for(let x=0;x<=t;x++){const w=x/t,C=n+w*r;d.x=-E*Math.cos(C),d.y=b,d.z=E*Math.sin(C),g.push(d.x,d.y,d.z),u.copy(d).normalize(),S.push(u.x,u.y,u.z),p.push(w+P,1-T),M.push(l++)}h.push(M)}for(let m=0;m<i;m++)for(let M=0;M<t;M++){const T=h[m][M+1],_=h[m][M],b=h[m+1][M],E=h[m+1][M+1];(m!==0||a>0)&&f.push(T,_,E),(m!==i-1||c<Math.PI)&&f.push(_,b,E)}this.setIndex(f),this.setAttribute("position",new ft(g,3)),this.setAttribute("normal",new ft(S,3)),this.setAttribute("uv",new ft(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Pe(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class Ht extends Ot{constructor(e=1,t=.4,i=12,n=48,r=Math.PI*2,a=0,o=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:i,tubularSegments:n,arc:r,thetaStart:a,thetaLength:o},i=Math.floor(i),n=Math.floor(n);const c=[],l=[],h=[],d=[],u=new R,f=new R,g=new R;for(let S=0;S<=i;S++){const p=a+S/i*o;for(let m=0;m<=n;m++){const M=m/n*r;f.x=(e+t*Math.cos(p))*Math.cos(M),f.y=(e+t*Math.cos(p))*Math.sin(M),f.z=t*Math.sin(p),l.push(f.x,f.y,f.z),u.x=e*Math.cos(M),u.y=e*Math.sin(M),g.subVectors(f,u).normalize(),h.push(g.x,g.y,g.z),d.push(m/n),d.push(S/i)}}for(let S=1;S<=i;S++)for(let p=1;p<=n;p++){const m=(n+1)*S+p-1,M=(n+1)*(S-1)+p-1,T=(n+1)*(S-1)+p,_=(n+1)*S+p;c.push(m,M,_),c.push(M,T,_)}this.setIndex(c),this.setAttribute("position",new ft(l,3)),this.setAttribute("normal",new ft(h,3)),this.setAttribute("uv",new ft(d,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ht(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc,e.thetaStart,e.thetaLength)}}function bs(s){const e={};for(const t in s){e[t]={};for(const i in s[t]){const n=s[t][i];if(yh(n))n.isRenderTargetTexture?(Ze("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][i]=null):e[t][i]=n.clone();else if(Array.isArray(n))if(yh(n[0])){const r=[];for(let a=0,o=n.length;a<o;a++)r[a]=n[a].clone();e[t][i]=r}else e[t][i]=n.slice();else e[t][i]=n}}return e}function ri(s){const e={};for(let t=0;t<s.length;t++){const i=bs(s[t]);for(const n in i)e[n]=i[n]}return e}function yh(s){return s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)}function o0(s){const e=[];for(let t=0;t<s.length;t++)e.push(s[t].clone());return e}function rd(s){const e=s.getRenderTarget();return e===null?s.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:dt.workingColorSpace}const l0={clone:bs,merge:ri};var c0=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,h0=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Di extends Cn{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=c0,this.fragmentShader=h0,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=bs(e.uniforms),this.uniformsGroups=o0(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const n in this.uniforms){const a=this.uniforms[n].value;a&&a.isTexture?t.uniforms[n]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[n]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[n]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[n]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[n]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[n]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[n]={type:"m4",value:a.toArray()}:t.uniforms[n]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const i={};for(const n in this.extensions)this.extensions[n]===!0&&(i[n]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(const i in e.uniforms){const n=e.uniforms[i];switch(this.uniforms[i]={},n.type){case"t":this.uniforms[i].value=t[n.value]||null;break;case"c":this.uniforms[i].value=new Xe().setHex(n.value);break;case"v2":this.uniforms[i].value=new ae().fromArray(n.value);break;case"v3":this.uniforms[i].value=new R().fromArray(n.value);break;case"v4":this.uniforms[i].value=new It().fromArray(n.value);break;case"m3":this.uniforms[i].value=new tt().fromArray(n.value);break;case"m4":this.uniforms[i].value=new Tt().fromArray(n.value);break;default:this.uniforms[i].value=n.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(const i in e.extensions)this.extensions[i]=e.extensions[i];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}}class u0 extends Di{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class dn extends Cn{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Xe(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Xe(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=xa,this.normalScale=new ae(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Tn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class Xs extends Cn{constructor(e){super(),this.isMeshToonMaterial=!0,this.defines={TOON:""},this.type="MeshToonMaterial",this.color=new Xe(16777215),this.map=null,this.gradientMap=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Xe(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=xa,this.normalScale=new ae(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.alphaMap=null,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.gradientMap=e.gradientMap,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.alphaMap=e.alphaMap,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}class d0 extends Cn{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=zf,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class f0 extends Cn{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}class lc extends Ft{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Xe(e),this.intensity=t}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}}class ad extends lc{constructor(e,t,i){super(e,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Ft.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Xe(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}toJSON(e){const t=super.toJSON(e);return t.object.groundColor=this.groundColor.getHex(),t}}const So=new Tt,Sh=new R,Mh=new R;class od{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new ae(512,512),this.mapType=_i,this.map=null,this.mapPass=null,this.matrix=new Tt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new ec,this._frameExtents=new ae(1,1),this._viewportCount=1,this._viewports=[new It(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera;Sh.setFromMatrixPosition(e.matrixWorld),t.position.copy(Sh),Mh.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Mh),t.updateMatrixWorld(),this._updateMatrix(t,this.matrix,this._frustum)}_updateMatrix(e,t,i,n){So.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),i.setFromProjectionMatrix(So,e.coordinateSystem,e.reversedDepth);const r=this._frameExtents,a=n?n.z/r.x:1,o=n?n.w/r.y:1,c=n?n.x/r.x:0,l=n?n.y/r.y:0;e.coordinateSystem===ar||e.reversedDepth?t.set(.5*a,0,0,.5*a+c,0,.5*o,0,.5*o+l,0,0,1,0,0,0,0,1):t.set(.5*a,0,0,.5*a+c,0,.5*o,0,.5*o+l,0,0,.5,.5,0,0,0,1),t.multiply(So)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return e.intensity=this.intensity,e.bias=this.bias,e.normalBias=this.normalBias,e.radius=this.radius,e.blurSamples=this.blurSamples,e.mapSize=this.mapSize.toArray(),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const Kr=new R,Yr=new ws,Ni=new R;class ld extends Ft{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Tt,this.projectionMatrix=new Tt,this.projectionMatrixInverse=new Tt,this.coordinateSystem=Gi,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(Kr,Yr,Ni),Ni.x===1&&Ni.y===1&&Ni.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Kr,Yr,Ni.set(1,1,1)).invert()}updateWorldMatrix(e,t,i=!1){super.updateWorldMatrix(e,t,i),this.matrixWorld.decompose(Kr,Yr,Ni),Ni.x===1&&Ni.y===1&&Ni.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Kr,Yr,Ni.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}}const Sn=new R,bh=new ae,wh=new ae;class ui extends ld{constructor(e=50,t=1,i=.1,n=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=n,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=Cl*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Ka*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Cl*2*Math.atan(Math.tan(Ka*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,i){Sn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Sn.x,Sn.y).multiplyScalar(-e/Sn.z),Sn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(Sn.x,Sn.y).multiplyScalar(-e/Sn.z)}getViewSize(e,t){return this.getViewBounds(e,bh,wh),t.subVectors(wh,bh)}setViewOffset(e,t,i,n,r,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=n,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(Ka*.5*this.fov)/this.zoom,i=2*t,n=this.aspect*i,r=-.5*n;const a=this.view;if(this.view!==null&&this.view.enabled){const c=a.fullWidth,l=a.fullHeight;r+=a.offsetX*n/c,t-=a.offsetY*i/l,n*=a.width/c,i*=a.height/l}const o=this.filmOffset;o!==0&&(r+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+n,t,t-i,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}class p0 extends od{constructor(){super(new ui(90,1,.5,500)),this.isPointLightShadow=!0}}class Eh extends lc{constructor(e,t,i=0,n=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=i,this.decay=n,this.shadow=new p0}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}toJSON(e){const t=super.toJSON(e);return t.object.distance=this.distance,t.object.decay=this.decay,t.object.shadow=this.shadow.toJSON(),t}}class cc extends ld{constructor(e=-1,t=1,i=1,n=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=n,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,n,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=n,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,n=(this.top+this.bottom)/2;let r=i-e,a=i+e,o=n+t,c=n-t;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=l*this.view.offsetX,a=r+l*this.view.width,o-=h*this.view.offsetY,c=o-h*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,c,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class m0 extends od{constructor(){super(new cc(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class wa extends lc{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Ft.DEFAULT_UP),this.updateMatrix(),this.target=new Ft,this.shadow=new m0}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){const t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}}const us=-90,ds=1;class g0 extends Ft{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const n=new ui(us,ds,e,t);n.layers=this.layers,this.add(n);const r=new ui(us,ds,e,t);r.layers=this.layers,this.add(r);const a=new ui(us,ds,e,t);a.layers=this.layers,this.add(a);const o=new ui(us,ds,e,t);o.layers=this.layers,this.add(o);const c=new ui(us,ds,e,t);c.layers=this.layers,this.add(c);const l=new ui(us,ds,e,t);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[i,n,r,a,o,c]=t;for(const l of t)this.remove(l);if(e===Gi)i.up.set(0,1,0),i.lookAt(1,0,0),n.up.set(0,1,0),n.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(e===ar)i.up.set(0,-1,0),i.lookAt(-1,0,0),n.up.set(0,-1,0),n.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const l of t)this.add(l),l.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:n}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,c,l,h]=this.children,d=e.getRenderTarget(),u=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;const S=i.texture.generateMipmaps;i.texture.generateMipmaps=!1;let p=!1;e.isWebGLRenderer===!0?p=e.state.buffers.depth.getReversed():p=e.reversedDepthBuffer,e.setRenderTarget(i,0,n),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,r),e.setRenderTarget(i,1,n),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(i,2,n),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(i,3,n),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),e.setRenderTarget(i,4,n),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),i.texture.generateMipmaps=S,e.setRenderTarget(i,5,n),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,h),e.setRenderTarget(d,u,f),e.xr.enabled=g,i.texture.needsPMREMUpdate=!0}}class v0 extends ui{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}const bc=class bc{constructor(e,t,i,n){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,i,n)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let i=0;i<4;i++)this.elements[i]=e[i+t];return this}set(e,t,i,n){const r=this.elements;return r[0]=e,r[2]=t,r[1]=i,r[3]=n,this}};bc.prototype.isMatrix2=!0;let Th=bc;function Ah(s,e,t,i){const n=x0(i);switch(t){case Nu:return s*e;case Xl:return s*e/n.components*n.byteLength;case ql:return s*e/n.components*n.byteLength;case Gn:return s*e*2/n.components*n.byteLength;case $l:return s*e*2/n.components*n.byteLength;case Fu:return s*e*3/n.components*n.byteLength;case Ei:return s*e*4/n.components*n.byteLength;case Kl:return s*e*4/n.components*n.byteLength;case aa:case oa:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*8;case la:case ca:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case Qo:case tl:return Math.max(s,16)*Math.max(e,8)/4;case jo:case el:return Math.max(s,8)*Math.max(e,8)/2;case il:case nl:case rl:case al:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*8;case sl:case ga:case ol:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case ll:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case cl:return Math.floor((s+4)/5)*Math.floor((e+3)/4)*16;case hl:return Math.floor((s+4)/5)*Math.floor((e+4)/5)*16;case ul:return Math.floor((s+5)/6)*Math.floor((e+4)/5)*16;case dl:return Math.floor((s+5)/6)*Math.floor((e+5)/6)*16;case fl:return Math.floor((s+7)/8)*Math.floor((e+4)/5)*16;case pl:return Math.floor((s+7)/8)*Math.floor((e+5)/6)*16;case ml:return Math.floor((s+7)/8)*Math.floor((e+7)/8)*16;case gl:return Math.floor((s+9)/10)*Math.floor((e+4)/5)*16;case vl:return Math.floor((s+9)/10)*Math.floor((e+5)/6)*16;case xl:return Math.floor((s+9)/10)*Math.floor((e+7)/8)*16;case _l:return Math.floor((s+9)/10)*Math.floor((e+9)/10)*16;case yl:return Math.floor((s+11)/12)*Math.floor((e+9)/10)*16;case Sl:return Math.floor((s+11)/12)*Math.floor((e+11)/12)*16;case Ml:case bl:case wl:return Math.ceil(s/4)*Math.ceil(e/4)*16;case El:case Tl:return Math.ceil(s/4)*Math.ceil(e/4)*8;case va:case Al:return Math.ceil(s/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function x0(s){switch(s){case _i:case Iu:return{byteLength:1,components:1};case sr:case Du:case qi:return{byteLength:2,components:1};case Vl:case Wl:return{byteLength:2,components:4};case Xi:case Gl:case Li:return{byteLength:4,components:1};case ku:case Uu:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${s}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:zl}}));typeof window<"u"&&(window.__THREE__?Ze("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=zl);function cd(){let s=null,e=!1,t=null,i=null;function n(r,a){i=s.requestAnimationFrame(n),t(r,a)}return{start:function(){e!==!0&&t!==null&&s!==null&&(i=s.requestAnimationFrame(n),e=!0)},stop:function(){s!==null&&s.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){s=r}}}function _0(s){const e=new WeakMap;function t(o,c){const l=o.array,h=o.usage,d=l.byteLength,u=s.createBuffer();s.bindBuffer(c,u),s.bufferData(c,l,h),o.onUploadCallback();let f;if(l instanceof Float32Array)f=s.FLOAT;else if(typeof Float16Array<"u"&&l instanceof Float16Array)f=s.HALF_FLOAT;else if(l instanceof Uint16Array)o.isFloat16BufferAttribute?f=s.HALF_FLOAT:f=s.UNSIGNED_SHORT;else if(l instanceof Int16Array)f=s.SHORT;else if(l instanceof Uint32Array)f=s.UNSIGNED_INT;else if(l instanceof Int32Array)f=s.INT;else if(l instanceof Int8Array)f=s.BYTE;else if(l instanceof Uint8Array)f=s.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)f=s.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:u,type:f,bytesPerElement:l.BYTES_PER_ELEMENT,version:o.version,size:d}}function i(o,c,l){const h=c.array,d=c.updateRanges;if(s.bindBuffer(l,o),d.length===0)s.bufferSubData(l,0,h);else{d.sort((f,g)=>f.start-g.start);let u=0;for(let f=1;f<d.length;f++){const g=d[u],S=d[f];S.start<=g.start+g.count+1?g.count=Math.max(g.count,S.start+S.count-g.start):(++u,d[u]=S)}d.length=u+1;for(let f=0,g=d.length;f<g;f++){const S=d[f];s.bufferSubData(l,S.start*h.BYTES_PER_ELEMENT,h,S.start,S.count)}c.clearUpdateRanges()}c.onUploadCallback()}function n(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);const c=e.get(o);c&&(s.deleteBuffer(c.buffer),e.delete(o))}function a(o,c){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const h=e.get(o);(!h||h.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const l=e.get(o);if(l===void 0)e.set(o,t(o,c));else if(l.version<o.version){if(l.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(l.buffer,o,c),l.version=o.version}}return{get:n,remove:r,update:a}}var y0=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,S0=`#ifdef USE_ALPHAHASH
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
#endif`,M0=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,b0=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,w0=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,E0=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,T0=`#ifdef USE_AOMAP
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
#endif`,A0=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,C0=`#ifdef USE_BATCHING
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
#endif`,P0=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,R0=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,L0=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,I0=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,D0=`#ifdef USE_IRIDESCENCE
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
#endif`,k0=`#ifdef USE_BUMPMAP
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
#endif`,U0=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,N0=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,F0=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,O0=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,B0=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,H0=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,z0=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,G0=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
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
#endif`,V0=`#define PI 3.141592653589793
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
} // validated`,W0=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,X0=`vec3 transformedNormal = objectNormal;
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
#endif`,q0=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,$0=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,K0=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Y0=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,J0="gl_FragColor = linearToOutputTexel( gl_FragColor );",Z0=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,j0=`#ifdef USE_ENVMAP
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
#endif`,Q0=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,em=`#ifdef USE_ENVMAP
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
#endif`,tm=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,im=`#ifdef USE_ENVMAP
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
#endif`,nm=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,sm=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,rm=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,am=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,om=`#ifdef USE_GRADIENTMAP
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
}`,lm=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,cm=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,hm=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,um=`uniform bool receiveShadow;
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
#include <lightprobes_pars_fragment>`,dm=`#ifdef USE_ENVMAP
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
#endif`,fm=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,pm=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,mm=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,gm=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,vm=`PhysicalMaterial material;
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
#endif`,xm=`uniform sampler2D dfgLUT;
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
}`,_m=`
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
#endif`,ym=`#if defined( RE_IndirectDiffuse )
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
#endif`,Sm=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Mm=`#ifdef USE_LIGHT_PROBES_GRID
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
#endif`,bm=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,wm=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Em=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Tm=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Am=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Cm=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Pm=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,Rm=`#if defined( USE_POINTS_UV )
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
#endif`,Lm=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Im=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Dm=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,km=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Um=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Nm=`#ifdef USE_MORPHTARGETS
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
#endif`,Fm=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Om=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Bm=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Hm=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,zm=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Gm=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,Vm=`#ifdef USE_NORMALMAP
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
#endif`,Wm=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Xm=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,qm=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,$m=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Km=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Ym=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,Jm=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Zm=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,jm=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Qm=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,eg=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,tg=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,ig=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,ng=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,sg=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,rg=`float getShadowMask() {
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
}`,ag=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,og=`#ifdef USE_SKINNING
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
#endif`,lg=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,cg=`#ifdef USE_SKINNING
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
#endif`,hg=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,ug=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,dg=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,fg=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,pg=`#ifdef USE_TRANSMISSION
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
#endif`,mg=`#ifdef USE_TRANSMISSION
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
#endif`,gg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,vg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,xg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,_g=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const yg=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Sg=`uniform sampler2D t2D;
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
}`,Mg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,bg=`#ifdef ENVMAP_TYPE_CUBE
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
}`,wg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Eg=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Tg=`#include <common>
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
}`,Ag=`#if DEPTH_PACKING == 3200
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
}`,Cg=`#define DISTANCE
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
}`,Pg=`#define DISTANCE
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
}`,Rg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Lg=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Ig=`uniform float scale;
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
}`,Dg=`uniform vec3 diffuse;
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
}`,kg=`#include <common>
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
}`,Ug=`uniform vec3 diffuse;
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
}`,Ng=`#define LAMBERT
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
}`,Fg=`#define LAMBERT
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
}`,Og=`#define MATCAP
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
}`,Bg=`#define MATCAP
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
}`,Hg=`#define NORMAL
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
}`,zg=`#define NORMAL
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
}`,Gg=`#define PHONG
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
}`,Vg=`#define PHONG
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
}`,Wg=`#define STANDARD
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
}`,Xg=`#define STANDARD
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
}`,qg=`#define TOON
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
}`,$g=`#define TOON
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
}`,Kg=`uniform float size;
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
}`,Yg=`uniform vec3 diffuse;
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
}`,Jg=`#include <common>
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
}`,Zg=`uniform vec3 color;
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
}`,jg=`uniform float rotation;
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
}`,Qg=`uniform vec3 diffuse;
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
}`,at={alphahash_fragment:y0,alphahash_pars_fragment:S0,alphamap_fragment:M0,alphamap_pars_fragment:b0,alphatest_fragment:w0,alphatest_pars_fragment:E0,aomap_fragment:T0,aomap_pars_fragment:A0,batching_pars_vertex:C0,batching_vertex:P0,begin_vertex:R0,beginnormal_vertex:L0,bsdfs:I0,iridescence_fragment:D0,bumpmap_pars_fragment:k0,clipping_planes_fragment:U0,clipping_planes_pars_fragment:N0,clipping_planes_pars_vertex:F0,clipping_planes_vertex:O0,color_fragment:B0,color_pars_fragment:H0,color_pars_vertex:z0,color_vertex:G0,common:V0,cube_uv_reflection_fragment:W0,defaultnormal_vertex:X0,displacementmap_pars_vertex:q0,displacementmap_vertex:$0,emissivemap_fragment:K0,emissivemap_pars_fragment:Y0,colorspace_fragment:J0,colorspace_pars_fragment:Z0,envmap_fragment:j0,envmap_common_pars_fragment:Q0,envmap_pars_fragment:em,envmap_pars_vertex:tm,envmap_physical_pars_fragment:dm,envmap_vertex:im,fog_vertex:nm,fog_pars_vertex:sm,fog_fragment:rm,fog_pars_fragment:am,gradientmap_pars_fragment:om,lightmap_pars_fragment:lm,lights_lambert_fragment:cm,lights_lambert_pars_fragment:hm,lights_pars_begin:um,lights_toon_fragment:fm,lights_toon_pars_fragment:pm,lights_phong_fragment:mm,lights_phong_pars_fragment:gm,lights_physical_fragment:vm,lights_physical_pars_fragment:xm,lights_fragment_begin:_m,lights_fragment_maps:ym,lights_fragment_end:Sm,lightprobes_pars_fragment:Mm,logdepthbuf_fragment:bm,logdepthbuf_pars_fragment:wm,logdepthbuf_pars_vertex:Em,logdepthbuf_vertex:Tm,map_fragment:Am,map_pars_fragment:Cm,map_particle_fragment:Pm,map_particle_pars_fragment:Rm,metalnessmap_fragment:Lm,metalnessmap_pars_fragment:Im,morphinstance_vertex:Dm,morphcolor_vertex:km,morphnormal_vertex:Um,morphtarget_pars_vertex:Nm,morphtarget_vertex:Fm,normal_fragment_begin:Om,normal_fragment_maps:Bm,normal_pars_fragment:Hm,normal_pars_vertex:zm,normal_vertex:Gm,normalmap_pars_fragment:Vm,clearcoat_normal_fragment_begin:Wm,clearcoat_normal_fragment_maps:Xm,clearcoat_pars_fragment:qm,iridescence_pars_fragment:$m,opaque_fragment:Km,packing:Ym,premultiplied_alpha_fragment:Jm,project_vertex:Zm,dithering_fragment:jm,dithering_pars_fragment:Qm,roughnessmap_fragment:eg,roughnessmap_pars_fragment:tg,shadowmap_pars_fragment:ig,shadowmap_pars_vertex:ng,shadowmap_vertex:sg,shadowmask_pars_fragment:rg,skinbase_vertex:ag,skinning_pars_vertex:og,skinning_vertex:lg,skinnormal_vertex:cg,specularmap_fragment:hg,specularmap_pars_fragment:ug,tonemapping_fragment:dg,tonemapping_pars_fragment:fg,transmission_fragment:pg,transmission_pars_fragment:mg,uv_pars_fragment:gg,uv_pars_vertex:vg,uv_vertex:xg,worldpos_vertex:_g,background_vert:yg,background_frag:Sg,backgroundCube_vert:Mg,backgroundCube_frag:bg,cube_vert:wg,cube_frag:Eg,depth_vert:Tg,depth_frag:Ag,distance_vert:Cg,distance_frag:Pg,equirect_vert:Rg,equirect_frag:Lg,linedashed_vert:Ig,linedashed_frag:Dg,meshbasic_vert:kg,meshbasic_frag:Ug,meshlambert_vert:Ng,meshlambert_frag:Fg,meshmatcap_vert:Og,meshmatcap_frag:Bg,meshnormal_vert:Hg,meshnormal_frag:zg,meshphong_vert:Gg,meshphong_frag:Vg,meshphysical_vert:Wg,meshphysical_frag:Xg,meshtoon_vert:qg,meshtoon_frag:$g,points_vert:Kg,points_frag:Yg,shadow_vert:Jg,shadow_frag:Zg,sprite_vert:jg,sprite_frag:Qg},ye={common:{diffuse:{value:new Xe(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new tt},alphaMap:{value:null},alphaMapTransform:{value:new tt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new tt}},envmap:{envMap:{value:null},envMapRotation:{value:new tt},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new tt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new tt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new tt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new tt},normalScale:{value:new ae(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new tt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new tt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new tt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new tt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Xe(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new R},probesMax:{value:new R},probesResolution:{value:new R}},points:{diffuse:{value:new Xe(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new tt},alphaTest:{value:0},uvTransform:{value:new tt}},sprite:{diffuse:{value:new Xe(16777215)},opacity:{value:1},center:{value:new ae(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new tt},alphaMap:{value:null},alphaMapTransform:{value:new tt},alphaTest:{value:0}}},Bi={basic:{uniforms:ri([ye.common,ye.specularmap,ye.envmap,ye.aomap,ye.lightmap,ye.fog]),vertexShader:at.meshbasic_vert,fragmentShader:at.meshbasic_frag},lambert:{uniforms:ri([ye.common,ye.specularmap,ye.envmap,ye.aomap,ye.lightmap,ye.emissivemap,ye.bumpmap,ye.normalmap,ye.displacementmap,ye.fog,ye.lights,{emissive:{value:new Xe(0)},envMapIntensity:{value:1}}]),vertexShader:at.meshlambert_vert,fragmentShader:at.meshlambert_frag},phong:{uniforms:ri([ye.common,ye.specularmap,ye.envmap,ye.aomap,ye.lightmap,ye.emissivemap,ye.bumpmap,ye.normalmap,ye.displacementmap,ye.fog,ye.lights,{emissive:{value:new Xe(0)},specular:{value:new Xe(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:at.meshphong_vert,fragmentShader:at.meshphong_frag},standard:{uniforms:ri([ye.common,ye.envmap,ye.aomap,ye.lightmap,ye.emissivemap,ye.bumpmap,ye.normalmap,ye.displacementmap,ye.roughnessmap,ye.metalnessmap,ye.fog,ye.lights,{emissive:{value:new Xe(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:at.meshphysical_vert,fragmentShader:at.meshphysical_frag},toon:{uniforms:ri([ye.common,ye.aomap,ye.lightmap,ye.emissivemap,ye.bumpmap,ye.normalmap,ye.displacementmap,ye.gradientmap,ye.fog,ye.lights,{emissive:{value:new Xe(0)}}]),vertexShader:at.meshtoon_vert,fragmentShader:at.meshtoon_frag},matcap:{uniforms:ri([ye.common,ye.bumpmap,ye.normalmap,ye.displacementmap,ye.fog,{matcap:{value:null}}]),vertexShader:at.meshmatcap_vert,fragmentShader:at.meshmatcap_frag},points:{uniforms:ri([ye.points,ye.fog]),vertexShader:at.points_vert,fragmentShader:at.points_frag},dashed:{uniforms:ri([ye.common,ye.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:at.linedashed_vert,fragmentShader:at.linedashed_frag},depth:{uniforms:ri([ye.common,ye.displacementmap]),vertexShader:at.depth_vert,fragmentShader:at.depth_frag},normal:{uniforms:ri([ye.common,ye.bumpmap,ye.normalmap,ye.displacementmap,{opacity:{value:1}}]),vertexShader:at.meshnormal_vert,fragmentShader:at.meshnormal_frag},sprite:{uniforms:ri([ye.sprite,ye.fog]),vertexShader:at.sprite_vert,fragmentShader:at.sprite_frag},background:{uniforms:{uvTransform:{value:new tt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:at.background_vert,fragmentShader:at.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new tt}},vertexShader:at.backgroundCube_vert,fragmentShader:at.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:at.cube_vert,fragmentShader:at.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:at.equirect_vert,fragmentShader:at.equirect_frag},distance:{uniforms:ri([ye.common,ye.displacementmap,{referencePosition:{value:new R},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:at.distance_vert,fragmentShader:at.distance_frag},shadow:{uniforms:ri([ye.lights,ye.fog,{color:{value:new Xe(0)},opacity:{value:1}}]),vertexShader:at.shadow_vert,fragmentShader:at.shadow_frag}};Bi.physical={uniforms:ri([Bi.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new tt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new tt},clearcoatNormalScale:{value:new ae(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new tt},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new tt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new tt},sheen:{value:0},sheenColor:{value:new Xe(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new tt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new tt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new tt},transmissionSamplerSize:{value:new ae},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new tt},attenuationDistance:{value:0},attenuationColor:{value:new Xe(0)},specularColor:{value:new Xe(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new tt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new tt},anisotropyVector:{value:new ae},anisotropyMap:{value:null},anisotropyMapTransform:{value:new tt}}]),vertexShader:at.meshphysical_vert,fragmentShader:at.meshphysical_frag};const Jr={r:0,b:0,g:0},ev=new Tt,hd=new tt;hd.set(-1,0,0,0,1,0,0,0,1);function tv(s,e,t,i,n,r){const a=new Xe(0);let o=n===!0?0:1,c,l,h=null,d=0,u=null;function f(M){let T=M.isScene===!0?M.background:null;if(T&&T.isTexture){const _=M.backgroundBlurriness>0;T=e.get(T,_)}return T}function g(M){let T=!1;const _=f(M);_===null?p(a,o):_&&_.isColor&&(p(_,1),T=!0);const b=s.xr.getEnvironmentBlendMode();b==="additive"?t.buffers.color.setClear(0,0,0,1,r):b==="alpha-blend"&&t.buffers.color.setClear(0,0,0,0,r),(s.autoClear||T)&&(t.buffers.depth.setTest(!0),t.buffers.depth.setMask(!0),t.buffers.color.setMask(!0),s.clear(s.autoClearColor,s.autoClearDepth,s.autoClearStencil))}function S(M,T){const _=f(T);_&&(_.isCubeTexture||_.mapping===Ra)?(l===void 0&&(l=new je(new Ee(1,1,1),new Di({name:"BackgroundCubeMaterial",uniforms:bs(Bi.backgroundCube.uniforms),vertexShader:Bi.backgroundCube.vertexShader,fragmentShader:Bi.backgroundCube.fragmentShader,side:ti,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),l.geometry.deleteAttribute("uv"),l.onBeforeRender=function(b,E,P){this.matrixWorld.copyPosition(P.matrixWorld)},Object.defineProperty(l.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(l)),l.material.uniforms.envMap.value=_,l.material.uniforms.backgroundBlurriness.value=T.backgroundBlurriness,l.material.uniforms.backgroundIntensity.value=T.backgroundIntensity,l.material.uniforms.backgroundRotation.value.setFromMatrix4(ev.makeRotationFromEuler(T.backgroundRotation)).transpose(),_.isCubeTexture&&_.isRenderTargetTexture===!1&&l.material.uniforms.backgroundRotation.value.premultiply(hd),l.material.toneMapped=dt.getTransfer(_.colorSpace)!==Mt,(h!==_||d!==_.version||u!==s.toneMapping)&&(l.material.needsUpdate=!0,h=_,d=_.version,u=s.toneMapping),l.layers.enableAll(),M.unshift(l,l.geometry,l.material,0,0,null)):_&&_.isTexture&&(c===void 0&&(c=new je(new ci(2,2),new Di({name:"BackgroundMaterial",uniforms:bs(Bi.background.uniforms),vertexShader:Bi.background.vertexShader,fragmentShader:Bi.background.fragmentShader,side:Hn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(c)),c.material.uniforms.t2D.value=_,c.material.uniforms.backgroundIntensity.value=T.backgroundIntensity,c.material.toneMapped=dt.getTransfer(_.colorSpace)!==Mt,_.matrixAutoUpdate===!0&&_.updateMatrix(),c.material.uniforms.uvTransform.value.copy(_.matrix),(h!==_||d!==_.version||u!==s.toneMapping)&&(c.material.needsUpdate=!0,h=_,d=_.version,u=s.toneMapping),c.layers.enableAll(),M.unshift(c,c.geometry,c.material,0,0,null))}function p(M,T){M.getRGB(Jr,rd(s)),t.buffers.color.setClear(Jr.r,Jr.g,Jr.b,T,r)}function m(){l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return a},setClearColor:function(M,T=1){a.set(M),o=T,p(a,o)},getClearAlpha:function(){return o},setClearAlpha:function(M){o=M,p(a,o)},render:g,addToRenderList:S,dispose:m}}function iv(s,e){const t=s.getParameter(s.MAX_VERTEX_ATTRIBS),i={},n=u(null);let r=n,a=!1;function o(I,N,B,U,O){let K=!1;const V=d(I,U,B,N);r!==V&&(r=V,l(r.object)),K=f(I,U,B,O),K&&g(I,U,B,O),O!==null&&e.update(O,s.ELEMENT_ARRAY_BUFFER),(K||a)&&(a=!1,_(I,N,B,U),O!==null&&s.bindBuffer(s.ELEMENT_ARRAY_BUFFER,e.get(O).buffer))}function c(){return s.createVertexArray()}function l(I){return s.bindVertexArray(I)}function h(I){return s.deleteVertexArray(I)}function d(I,N,B,U){const O=U.wireframe===!0;let K=i[N.id];K===void 0&&(K={},i[N.id]=K);const V=I.isInstancedMesh===!0?I.id:0;let ne=K[V];ne===void 0&&(ne={},K[V]=ne);let X=ne[B.id];X===void 0&&(X={},ne[B.id]=X);let Q=X[O];return Q===void 0&&(Q=u(c()),X[O]=Q),Q}function u(I){const N=[],B=[],U=[];for(let O=0;O<t;O++)N[O]=0,B[O]=0,U[O]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:N,enabledAttributes:B,attributeDivisors:U,object:I,attributes:{},index:null}}function f(I,N,B,U){const O=r.attributes,K=N.attributes;let V=0;const ne=B.getAttributes();for(const X in ne)if(ne[X].location>=0){const j=O[X];let Ne=K[X];if(Ne===void 0&&(X==="instanceMatrix"&&I.instanceMatrix&&(Ne=I.instanceMatrix),X==="instanceColor"&&I.instanceColor&&(Ne=I.instanceColor)),j===void 0||j.attribute!==Ne||Ne&&j.data!==Ne.data)return!0;V++}return r.attributesNum!==V||r.index!==U}function g(I,N,B,U){const O={},K=N.attributes;let V=0;const ne=B.getAttributes();for(const X in ne)if(ne[X].location>=0){let j=K[X];j===void 0&&(X==="instanceMatrix"&&I.instanceMatrix&&(j=I.instanceMatrix),X==="instanceColor"&&I.instanceColor&&(j=I.instanceColor));const Ne={};Ne.attribute=j,j&&j.data&&(Ne.data=j.data),O[X]=Ne,V++}r.attributes=O,r.attributesNum=V,r.index=U}function S(){const I=r.newAttributes;for(let N=0,B=I.length;N<B;N++)I[N]=0}function p(I){m(I,0)}function m(I,N){const B=r.newAttributes,U=r.enabledAttributes,O=r.attributeDivisors;B[I]=1,U[I]===0&&(s.enableVertexAttribArray(I),U[I]=1),O[I]!==N&&(s.vertexAttribDivisor(I,N),O[I]=N)}function M(){const I=r.newAttributes,N=r.enabledAttributes;for(let B=0,U=N.length;B<U;B++)N[B]!==I[B]&&(s.disableVertexAttribArray(B),N[B]=0)}function T(I,N,B,U,O,K,V){V===!0?s.vertexAttribIPointer(I,N,B,O,K):s.vertexAttribPointer(I,N,B,U,O,K)}function _(I,N,B,U){S();const O=U.attributes,K=B.getAttributes(),V=N.defaultAttributeValues;for(const ne in K){const X=K[ne];if(X.location>=0){let Q=O[ne];if(Q===void 0&&(ne==="instanceMatrix"&&I.instanceMatrix&&(Q=I.instanceMatrix),ne==="instanceColor"&&I.instanceColor&&(Q=I.instanceColor)),Q!==void 0){const j=Q.normalized,Ne=Q.itemSize,he=e.get(Q);if(he===void 0)continue;const Qe=he.buffer,Ke=he.type,it=he.bytesPerElement,J=Ke===s.INT||Ke===s.UNSIGNED_INT||Q.gpuType===Gl;if(Q.isInterleavedBufferAttribute){const te=Q.data,Se=te.stride,qe=Q.offset;if(te.isInstancedInterleavedBuffer){for(let Te=0;Te<X.locationSize;Te++)m(X.location+Te,te.meshPerAttribute);I.isInstancedMesh!==!0&&U._maxInstanceCount===void 0&&(U._maxInstanceCount=te.meshPerAttribute*te.count)}else for(let Te=0;Te<X.locationSize;Te++)p(X.location+Te);s.bindBuffer(s.ARRAY_BUFFER,Qe);for(let Te=0;Te<X.locationSize;Te++)T(X.location+Te,Ne/X.locationSize,Ke,j,Se*it,(qe+Ne/X.locationSize*Te)*it,J)}else{if(Q.isInstancedBufferAttribute){for(let te=0;te<X.locationSize;te++)m(X.location+te,Q.meshPerAttribute);I.isInstancedMesh!==!0&&U._maxInstanceCount===void 0&&(U._maxInstanceCount=Q.meshPerAttribute*Q.count)}else for(let te=0;te<X.locationSize;te++)p(X.location+te);s.bindBuffer(s.ARRAY_BUFFER,Qe);for(let te=0;te<X.locationSize;te++)T(X.location+te,Ne/X.locationSize,Ke,j,Ne*it,Ne/X.locationSize*te*it,J)}}else if(V!==void 0){const j=V[ne];if(j!==void 0)switch(j.length){case 2:s.vertexAttrib2fv(X.location,j);break;case 3:s.vertexAttrib3fv(X.location,j);break;case 4:s.vertexAttrib4fv(X.location,j);break;default:s.vertexAttrib1fv(X.location,j)}}}}M()}function b(){w();for(const I in i){const N=i[I];for(const B in N){const U=N[B];for(const O in U){const K=U[O];for(const V in K)h(K[V].object),delete K[V];delete U[O]}}delete i[I]}}function E(I){if(i[I.id]===void 0)return;const N=i[I.id];for(const B in N){const U=N[B];for(const O in U){const K=U[O];for(const V in K)h(K[V].object),delete K[V];delete U[O]}}delete i[I.id]}function P(I){for(const N in i){const B=i[N];for(const U in B){const O=B[U];if(O[I.id]===void 0)continue;const K=O[I.id];for(const V in K)h(K[V].object),delete K[V];delete O[I.id]}}}function x(I){for(const N in i){const B=i[N],U=I.isInstancedMesh===!0?I.id:0,O=B[U];if(O!==void 0){for(const K in O){const V=O[K];for(const ne in V)h(V[ne].object),delete V[ne];delete O[K]}delete B[U],Object.keys(B).length===0&&delete i[N]}}}function w(){C(),a=!0,r!==n&&(r=n,l(r.object))}function C(){n.geometry=null,n.program=null,n.wireframe=!1}return{setup:o,reset:w,resetDefaultState:C,dispose:b,releaseStatesOfGeometry:E,releaseStatesOfObject:x,releaseStatesOfProgram:P,initAttributes:S,enableAttribute:p,disableUnusedAttributes:M}}function nv(s,e,t){let i;function n(c){i=c}function r(c,l){s.drawArrays(i,c,l),t.update(l,i,1)}function a(c,l,h){h!==0&&(s.drawArraysInstanced(i,c,l,h),t.update(l,i,h))}function o(c,l,h){if(h===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,c,0,l,0,h);let u=0;for(let f=0;f<h;f++)u+=l[f];t.update(u,i,1)}this.setMode=n,this.render=r,this.renderInstances=a,this.renderMultiDraw=o}function sv(s,e,t,i){let n;function r(){if(n!==void 0)return n;if(e.has("EXT_texture_filter_anisotropic")===!0){const P=e.get("EXT_texture_filter_anisotropic");n=s.getParameter(P.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else n=0;return n}function a(P){return!(P!==Ei&&i.convert(P)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(P){const x=P===qi&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(P!==_i&&P!==Li&&!x&&i.convert(P)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_TYPE))}function c(P){if(P==="highp"){if(s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.HIGH_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.HIGH_FLOAT).precision>0)return"highp";P="mediump"}return P==="mediump"&&s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.MEDIUM_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=t.precision!==void 0?t.precision:"highp";const h=c(l);h!==l&&(Ze("WebGLRenderer:",l,"not supported, using",h,"instead."),l=h);const d=t.logarithmicDepthBuffer===!0,u=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control");t.reversedDepthBuffer===!0&&u===!1&&Ze("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");const f=s.getParameter(s.MAX_TEXTURE_IMAGE_UNITS),g=s.getParameter(s.MAX_VERTEX_TEXTURE_IMAGE_UNITS),S=s.getParameter(s.MAX_TEXTURE_SIZE),p=s.getParameter(s.MAX_CUBE_MAP_TEXTURE_SIZE),m=s.getParameter(s.MAX_VERTEX_ATTRIBS),M=s.getParameter(s.MAX_VERTEX_UNIFORM_VECTORS),T=s.getParameter(s.MAX_VARYING_VECTORS),_=s.getParameter(s.MAX_FRAGMENT_UNIFORM_VECTORS),b=s.getParameter(s.MAX_SAMPLES),E=s.getParameter(s.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:c,textureFormatReadable:a,textureTypeReadable:o,precision:l,logarithmicDepthBuffer:d,reversedDepthBuffer:u,maxTextures:f,maxVertexTextures:g,maxTextureSize:S,maxCubemapSize:p,maxAttributes:m,maxVertexUniforms:M,maxVaryings:T,maxFragmentUniforms:_,maxSamples:b,samples:E}}function rv(s){const e=this;let t=null,i=0,n=!1,r=!1;const a=new wn,o=new tt,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(d,u){const f=d.length!==0||u||i!==0||n;return n=u,i=d.length,f},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(d,u){t=h(d,u,0)},this.setState=function(d,u,f){const g=d.clippingPlanes,S=d.clipIntersection,p=d.clipShadows,m=s.get(d);if(!n||g===null||g.length===0||r&&!p)r?h(null):l();else{const M=r?0:i,T=M*4;let _=m.clippingState||null;c.value=_,_=h(g,u,T,f);for(let b=0;b!==T;++b)_[b]=t[b];m.clippingState=_,this.numIntersection=S?this.numPlanes:0,this.numPlanes+=M}};function l(){c.value!==t&&(c.value=t,c.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function h(d,u,f,g){const S=d!==null?d.length:0;let p=null;if(S!==0){if(p=c.value,g!==!0||p===null){const m=f+S*4,M=u.matrixWorldInverse;o.getNormalMatrix(M),(p===null||p.length<m)&&(p=new Float32Array(m));for(let T=0,_=f;T!==S;++T,_+=4)a.copy(d[T]).applyMatrix4(M,o),a.normal.toArray(p,_),p[_+3]=a.constant}c.value=p,c.needsUpdate=!0}return e.numPlanes=S,e.numIntersection=0,p}}const xs=4,av=6,ov=20,lv=256,Bs=new cc,Ch=new Xe;let Mo=null,bo=0,wo=0,Eo=!1;const cv=new R,kn=new R;class Ph{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,i=.1,n=100,r={}){const{size:a=256,position:o=cv}=r;Mo=this._renderer.getRenderTarget(),bo=this._renderer.getActiveCubeFace(),wo=this._renderer.getActiveMipmapLevel(),Eo=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);const c=this._allocateTargets();return c.depthBuffer=!0,this._sceneToCubeUV(e,i,n,c,o),t>0&&this._blur(c,0,0,t),this._applyPMREM(c),this._cleanup(c),c}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Ih(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Lh(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(Mo,bo,wo),this._renderer.xr.enabled=Eo,e.scissorTest=!1,fs(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===zn||e.mapping===Ss?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Mo=this._renderer.getRenderTarget(),bo=this._renderer.getActiveCubeFace(),wo=this._renderer.getActiveMipmapLevel(),Eo=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=t||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,i={magFilter:ei,minFilter:ei,generateMipmaps:!1,type:qi,format:Ei,colorSpace:_a,depthBuffer:!1},n=Rh(e,t,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Rh(e,t,i);const{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods}=hv(r)),this._blurMaterial=dv(r,e,t),this._ggxMaterial=uv(r,e,t)}return n}_compileMaterial(e){const t=new je(new Ot,e);this._renderer.compile(t,Bs)}_sceneToCubeUV(e,t,i,n,r){const c=new ui(90,1,t,i),l=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],d=this._renderer,u=d.autoClear,f=d.toneMapping;d.getClearColor(Ch),d.toneMapping=Vi,d.autoClear=!1,d.state.buffers.depth.getReversed()&&(d.setRenderTarget(n),d.clearDepth(),d.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new je(new Ee,new yi({name:"PMREM.Background",side:ti,depthWrite:!1,depthTest:!1})));const S=this._backgroundBox,p=S.material;let m=!1;const M=e.background;M?M.isColor&&(p.color.copy(M),e.background=null,m=!0):(p.color.copy(Ch),m=!0);for(let T=0;T<6;T++){const _=T%3;_===0?(c.up.set(0,l[T],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x+h[T],r.y,r.z)):_===1?(c.up.set(0,0,l[T]),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y+h[T],r.z)):(c.up.set(0,l[T],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y,r.z+h[T]));const b=this._cubeSize;fs(n,_*b,T>2?b:0,b,b),d.setRenderTarget(n),m&&d.render(S,c),d.render(e,c)}d.toneMapping=f,d.autoClear=u,e.background=M}_textureToCubeUV(e,t){const i=this._renderer,n=e.mapping===zn||e.mapping===Ss;n?(this._cubemapMaterial===null&&(this._cubemapMaterial=Ih()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Lh());const r=n?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=r;const o=r.uniforms;o.envMap.value=e;const c=this._cubeSize;fs(t,0,0,3*c,2*c),i.setRenderTarget(t),i.render(a,Bs)}_applyPMREM(e){const t=this._renderer,i=t.autoClear;t.autoClear=!1;const n=this._lodMeshes.length;for(let r=1;r<n;r++)this._applyGGXFilter(e,r-1,r);t.autoClear=i}_applyGGXFilter(e,t,i){const n=this._renderer,r=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[i];o.material=a;const c=a.uniforms,l=i/(this._lodMeshes.length-1),h=t/(this._lodMeshes.length-1),d=Math.sqrt(l*l-h*h),u=l*1.25,f=d*u,{_lodMax:g}=this,S=this._sizeLods[i],p=3*S*(i>g-xs?i-g+xs:0),m=4*(this._cubeSize-S);c.envMap.value=e.texture,c.roughness.value=f,c.mipInt.value=g-t,fs(r,p,m,3*S,2*S),n.setRenderTarget(r),n.render(o,Bs),c.envMap.value=r.texture,c.roughness.value=0,c.mipInt.value=g-i,fs(e,p,m,3*S,2*S),n.setRenderTarget(e),n.render(o,Bs)}_blur(e,t,i,n){const r=this._pingPongRenderTarget,a=Math.min(n,Math.PI)/Math.SQRT2;this._blurPass(e,r,t,i,a),this._blurPass(r,e,i,i,a)}_blurPass(e,t,i,n,r){const a=this._renderer,o=this._blurMaterial,c=this._lodMeshes[n];c.material=o;const l=o.uniforms;l.envMap.value=e.texture,l.sigma.value=r,l.mipInt.value=this._lodMax-i;const h=this._sizeLods[n],d=3*h*(n>this._lodMax-xs?n-this._lodMax+xs:0),u=4*(this._cubeSize-h);fs(t,d,u,3*h,2*h),a.setRenderTarget(t),a.render(c,Bs)}}function hv(s){const e=[],t=[];let i=s;const n=s-xs+1+av;for(let r=0;r<n;r++){const a=Math.pow(2,i);e.push(a);const o=1/(a-2),c=-o,l=1+o,h=[c,c,l,c,l,l,c,c,l,l,c,l],d=6,u=6,f=3,g=new Float32Array(f*u*d),S=new Float32Array(f*u*d);for(let m=0;m<d;m++){const M=m%3*2/3-1,T=m>2?0:-1,_=[M,T,0,M+2/3,T,0,M+2/3,T+1,0,M,T,0,M+2/3,T+1,0,M,T+1,0];g.set(_,f*u*m);for(let b=0;b<u;b++){const E=h[b*2]*2-1,P=h[b*2+1]*2-1;m===0?kn.set(1,P,E):m===1?kn.set(-E,1,-P):m===2?kn.set(-E,P,1):m===3?kn.set(-1,P,-E):m===4?kn.set(-E,-1,P):kn.set(E,P,-1),kn.toArray(S,(m*u+b)*f)}}const p=new Ot;p.setAttribute("position",new fi(g,f)),p.setAttribute("outputDirection",new fi(S,f)),t.push(new je(p,null)),i>xs&&i--}return{lodMeshes:t,sizeLods:e}}function Rh(s,e,t){const i=new Ii(s,e,t);return i.texture.mapping=Ra,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function fs(s,e,t,i,n){s.viewport.set(e,t,i,n),s.scissor.set(e,t,i,n)}function uv(s,e,t){return new Di({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:lv,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:Da(),fragmentShader:`

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
		`,blending:ln,depthTest:!1,depthWrite:!1})}function dv(s,e,t){return new Di({name:"SphericalGaussianBlur",defines:{SAMPLES:ov,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},sigma:{value:0},mipInt:{value:0}},vertexShader:Da(),fragmentShader:`

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
		`,blending:ln,depthTest:!1,depthWrite:!1})}function Lh(){return new Di({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Da(),fragmentShader:`

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
		`,blending:ln,depthTest:!1,depthWrite:!1})}function Ih(){return new Di({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Da(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:ln,depthTest:!1,depthWrite:!1})}function Da(){return`

		precision mediump float;
		precision mediump int;

		attribute vec3 outputDirection;

		varying vec3 vOutputDirection;

		void main() {

			vOutputDirection = outputDirection;
			gl_Position = vec4( position, 1.0 );

		}
	`}class ud extends Ii{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},n=[i,i,i,i,i,i];this.texture=new Yu(n),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},n=new Ee(5,5,5),r=new Di({name:"CubemapFromEquirect",uniforms:bs(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:ti,blending:ln});r.uniforms.tEquirect.value=t;const a=new je(n,r),o=t.minFilter;return t.minFilter===Fn&&(t.minFilter=ei),new g0(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,i=!0,n=!0){const r=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,i,n);e.setRenderTarget(r)}}function fv(s){let e=new WeakMap,t=new WeakMap,i=null;function n(u,f=!1){return u==null?null:f?a(u):r(u)}function r(u){if(u&&u.isTexture){const f=u.mapping;if(f===Wa||f===Xa)if(e.has(u)){const g=e.get(u).texture;return o(g,u.mapping)}else{const g=u.image;if(g&&g.height>0){const S=new ud(g.height);return S.fromEquirectangularTexture(s,u),e.set(u,S),u.addEventListener("dispose",l),o(S.texture,u.mapping)}else return null}}return u}function a(u){if(u&&u.isTexture){const f=u.mapping,g=f===Wa||f===Xa,S=f===zn||f===Ss;if(g||S){let p=t.get(u);const m=p!==void 0?p.texture.pmremVersion:0;if(u.isRenderTargetTexture&&u.pmremVersion!==m)return i===null&&(i=new Ph(s)),p=g?i.fromEquirectangular(u,p):i.fromCubemap(u,p),p.texture.pmremVersion=u.pmremVersion,t.set(u,p),p.texture;if(p!==void 0)return p.texture;{const M=u.image;return g&&M&&M.height>0||S&&M&&c(M)?(i===null&&(i=new Ph(s)),p=g?i.fromEquirectangular(u):i.fromCubemap(u),p.texture.pmremVersion=u.pmremVersion,t.set(u,p),u.addEventListener("dispose",h),p.texture):null}}}return u}function o(u,f){return f===Wa?u.mapping=zn:f===Xa&&(u.mapping=Ss),u}function c(u){let f=0;const g=6;for(let S=0;S<g;S++)u[S]!==void 0&&f++;return f===g}function l(u){const f=u.target;f.removeEventListener("dispose",l);const g=e.get(f);g!==void 0&&(e.delete(f),g.dispose())}function h(u){const f=u.target;f.removeEventListener("dispose",h);const g=t.get(f);g!==void 0&&(t.delete(f),g.dispose())}function d(){e=new WeakMap,t=new WeakMap,i!==null&&(i.dispose(),i=null)}return{get:n,dispose:d}}function pv(s){const e={};function t(i){if(e[i]!==void 0)return e[i];const n=s.getExtension(i);return e[i]=n,n}return{has:function(i){return t(i)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(i){const n=t(i);return n===null&&_s("WebGLRenderer: "+i+" extension not supported."),n}}}function mv(s,e,t,i){const n={},r=new WeakMap;function a(d){const u=d.target;u.index!==null&&e.remove(u.index);for(const g in u.attributes)e.remove(u.attributes[g]);u.removeEventListener("dispose",a),delete n[u.id];const f=r.get(u);f&&(e.remove(f),r.delete(u)),i.releaseStatesOfGeometry(u),u.isInstancedBufferGeometry===!0&&delete u._maxInstanceCount,t.memory.geometries--}function o(d,u){return n[u.id]===!0||(u.addEventListener("dispose",a),n[u.id]=!0,t.memory.geometries++),u}function c(d){const u=d.attributes;for(const f in u)e.update(u[f],s.ARRAY_BUFFER)}function l(d){const u=[],f=d.index,g=d.attributes.position;let S=0;if(g===void 0)return;if(f!==null){const M=f.array;S=f.version;for(let T=0,_=M.length;T<_;T+=3){const b=M[T+0],E=M[T+1],P=M[T+2];u.push(b,E,E,P,P,b)}}else{const M=g.array;S=g.version;for(let T=0,_=M.length/3-1;T<_;T+=3){const b=T+0,E=T+1,P=T+2;u.push(b,E,E,P,P,b)}}const p=new(g.count>=65535?Xu:Wu)(u,1);p.version=S;const m=r.get(d);m&&e.remove(m),r.set(d,p)}function h(d){const u=r.get(d);if(u){const f=d.index;f!==null&&u.version<f.version&&l(d)}else l(d);return r.get(d)}return{get:o,update:c,getWireframeAttribute:h}}function gv(s,e,t){let i;function n(d){i=d}let r,a;function o(d){r=d.type,a=d.bytesPerElement}function c(d,u){s.drawElements(i,u,r,d*a),t.update(u,i,1)}function l(d,u,f){f!==0&&(s.drawElementsInstanced(i,u,r,d*a,f),t.update(u,i,f))}function h(d,u,f){if(f===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,u,0,r,d,0,f);let S=0;for(let p=0;p<f;p++)S+=u[p];t.update(S,i,1)}this.setMode=n,this.setIndex=o,this.render=c,this.renderInstances=l,this.renderMultiDraw=h}function vv(s){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(r,a,o){switch(t.calls++,a){case s.TRIANGLES:t.triangles+=o*(r/3);break;case s.LINES:t.lines+=o*(r/2);break;case s.LINE_STRIP:t.lines+=o*(r-1);break;case s.LINE_LOOP:t.lines+=o*r;break;case s.POINTS:t.points+=o*r;break;default:pt("WebGLInfo: Unknown draw mode:",a);break}}function n(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:n,update:i}}function xv(s,e,t){const i=new WeakMap,n=new It;function r(a,o,c){const l=a.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,d=h!==void 0?h.length:0;let u=i.get(o);if(u===void 0||u.count!==d){let C=function(){x.dispose(),i.delete(o),o.removeEventListener("dispose",C)};var f=C;u!==void 0&&u.texture.dispose();const g=o.morphAttributes.position!==void 0,S=o.morphAttributes.normal!==void 0,p=o.morphAttributes.color!==void 0,m=o.morphAttributes.position||[],M=o.morphAttributes.normal||[],T=o.morphAttributes.color||[];let _=0;g===!0&&(_=1),S===!0&&(_=2),p===!0&&(_=3);let b=o.attributes.position.count*_,E=1;b>e.maxTextureSize&&(E=Math.ceil(b/e.maxTextureSize),b=e.maxTextureSize);const P=new Float32Array(b*E*4*d),x=new Hu(P,b,E,d);x.type=Li,x.needsUpdate=!0;const w=_*4;for(let I=0;I<d;I++){const N=m[I],B=M[I],U=T[I],O=b*E*4*I;for(let K=0;K<N.count;K++){const V=K*w;g===!0&&(n.fromBufferAttribute(N,K),P[O+V+0]=n.x,P[O+V+1]=n.y,P[O+V+2]=n.z,P[O+V+3]=0),S===!0&&(n.fromBufferAttribute(B,K),P[O+V+4]=n.x,P[O+V+5]=n.y,P[O+V+6]=n.z,P[O+V+7]=0),p===!0&&(n.fromBufferAttribute(U,K),P[O+V+8]=n.x,P[O+V+9]=n.y,P[O+V+10]=n.z,P[O+V+11]=U.itemSize===4?n.w:1)}}u={count:d,texture:x,size:new ae(b,E)},i.set(o,u),o.addEventListener("dispose",C)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)c.getUniforms().setValue(s,"morphTexture",a.morphTexture,t);else{let g=0;for(let p=0;p<l.length;p++)g+=l[p];const S=o.morphTargetsRelative?1:1-g;c.getUniforms().setValue(s,"morphTargetBaseInfluence",S),c.getUniforms().setValue(s,"morphTargetInfluences",l)}c.getUniforms().setValue(s,"morphTargetsTexture",u.texture,t),c.getUniforms().setValue(s,"morphTargetsTextureSize",u.size)}return{update:r}}function _v(s,e,t,i,n){let r=new WeakMap;function a(l){const h=n.render.frame,d=l.geometry,u=e.get(l,d);if(r.get(u)!==h&&(e.update(u),r.set(u,h)),l.isInstancedMesh&&(l.hasEventListener("dispose",c)===!1&&l.addEventListener("dispose",c),r.get(l)!==h&&(t.update(l.instanceMatrix,s.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,s.ARRAY_BUFFER),r.set(l,h))),l.isSkinnedMesh){const f=l.skeleton;r.get(f)!==h&&(f.update(),r.set(f,h))}return u}function o(){r=new WeakMap}function c(l){const h=l.target;h.removeEventListener("dispose",c),i.releaseStatesOfObject(h),t.remove(h.instanceMatrix),h.instanceColor!==null&&t.remove(h.instanceColor)}return{update:a,dispose:o}}const yv={[Eu]:"LINEAR_TONE_MAPPING",[Tu]:"REINHARD_TONE_MAPPING",[Au]:"CINEON_TONE_MAPPING",[Pa]:"ACES_FILMIC_TONE_MAPPING",[Pu]:"AGX_TONE_MAPPING",[Ru]:"NEUTRAL_TONE_MAPPING",[Cu]:"CUSTOM_TONE_MAPPING"};function Sv(s,e,t,i,n,r){const a=new Ii(e,t,{type:s,depthBuffer:n,stencilBuffer:r,samples:i?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1});let o=null,c=null;const l=new Ot;l.setAttribute("position",new ft([-1,3,0,-1,-1,0,3,-1,0],3)),l.setAttribute("uv",new ft([0,2,0,0,2,0],2));const h=new u0({uniforms:{tDiffuse:{value:null}},vertexShader:`
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
			}`,depthTest:!1,depthWrite:!1}),d=new je(l,h),u=new cc(-1,1,1,-1,0,1);let f=null,g=null,S=!1,p,m=null,M=[],T=!1;this.setSize=function(_,b){a.setSize(_,b),o!==null&&o.setSize(_,b),c!==null&&c.setSize(_,b);for(let E=0;E<M.length;E++){const P=M[E];P.setSize&&P.setSize(_,b)}},this.setEffects=function(_){M=_,T=M.length>0&&M[0].isRenderPass===!0;const b=a.width,E=a.height;M.length>0&&o===null&&(o=new Ii(b,E,{type:qi,depthBuffer:!1,stencilBuffer:!1}),c=new Ii(b,E,{type:qi,depthBuffer:!1,stencilBuffer:!1}));for(let P=0;P<M.length;P++){const x=M[P];x.setSize&&x.setSize(b,E)}},this.begin=function(_,b){if(S||_.toneMapping===Vi&&M.length===0)return!1;if(m=b,b!==null){const E=b.width,P=b.height;(a.width!==E||a.height!==P)&&this.setSize(E,P)}return T===!1&&_.setRenderTarget(a),p=_.toneMapping,_.toneMapping=Vi,!0},this.hasRenderPass=function(){return T},this.end=function(_,b){_.toneMapping=p,S=!0;let E=a,P=o;for(let x=0;x<M.length;x++){const w=M[x];w.enabled!==!1&&(w.render(_,P,E,b),w.needsSwap!==!1&&(E=P,P=P===o?c:o))}if(f!==_.outputColorSpace||g!==_.toneMapping){f=_.outputColorSpace,g=_.toneMapping,h.defines={},dt.getTransfer(f)===Mt&&(h.defines.SRGB_TRANSFER="");const x=yv[g];x&&(h.defines[x]=""),h.needsUpdate=!0}h.uniforms.tDiffuse.value=E.texture,_.setRenderTarget(m),_.render(d,u),m=null,S=!1},this.isCompositing=function(){return S},this.dispose=function(){a.dispose(),o!==null&&o.dispose(),c!==null&&c.dispose(),l.dispose(),h.dispose()}}const dd=new ii,kl=new lr(1,1),fd=new Hu,pd=new op,md=new Yu,Dh=[],kh=[],Uh=new Float32Array(16),Nh=new Float32Array(9),Fh=new Float32Array(4);function Ts(s,e,t){const i=s[0];if(i<=0||i>0)return s;const n=e*t;let r=Dh[n];if(r===void 0&&(r=new Float32Array(n),Dh[n]=r),e!==0){i.toArray(r,0);for(let a=1,o=0;a!==e;++a)o+=t,s[a].toArray(r,o)}return r}function qt(s,e){if(s.length!==e.length)return!1;for(let t=0,i=s.length;t<i;t++)if(s[t]!==e[t])return!1;return!0}function $t(s,e){for(let t=0,i=e.length;t<i;t++)s[t]=e[t]}function ka(s,e){let t=kh[e];t===void 0&&(t=new Int32Array(e),kh[e]=t);for(let i=0;i!==e;++i)t[i]=s.allocateTextureUnit();return t}function Mv(s,e){const t=this.cache;t[0]!==e&&(s.uniform1f(this.addr,e),t[0]=e)}function bv(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(qt(t,e))return;s.uniform2fv(this.addr,e),$t(t,e)}}function wv(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(s.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(qt(t,e))return;s.uniform3fv(this.addr,e),$t(t,e)}}function Ev(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(qt(t,e))return;s.uniform4fv(this.addr,e),$t(t,e)}}function Tv(s,e){const t=this.cache,i=e.elements;if(i===void 0){if(qt(t,e))return;s.uniformMatrix2fv(this.addr,!1,e),$t(t,e)}else{if(qt(t,i))return;Fh.set(i),s.uniformMatrix2fv(this.addr,!1,Fh),$t(t,i)}}function Av(s,e){const t=this.cache,i=e.elements;if(i===void 0){if(qt(t,e))return;s.uniformMatrix3fv(this.addr,!1,e),$t(t,e)}else{if(qt(t,i))return;Nh.set(i),s.uniformMatrix3fv(this.addr,!1,Nh),$t(t,i)}}function Cv(s,e){const t=this.cache,i=e.elements;if(i===void 0){if(qt(t,e))return;s.uniformMatrix4fv(this.addr,!1,e),$t(t,e)}else{if(qt(t,i))return;Uh.set(i),s.uniformMatrix4fv(this.addr,!1,Uh),$t(t,i)}}function Pv(s,e){const t=this.cache;t[0]!==e&&(s.uniform1i(this.addr,e),t[0]=e)}function Rv(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(qt(t,e))return;s.uniform2iv(this.addr,e),$t(t,e)}}function Lv(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(qt(t,e))return;s.uniform3iv(this.addr,e),$t(t,e)}}function Iv(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(qt(t,e))return;s.uniform4iv(this.addr,e),$t(t,e)}}function Dv(s,e){const t=this.cache;t[0]!==e&&(s.uniform1ui(this.addr,e),t[0]=e)}function kv(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(qt(t,e))return;s.uniform2uiv(this.addr,e),$t(t,e)}}function Uv(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(qt(t,e))return;s.uniform3uiv(this.addr,e),$t(t,e)}}function Nv(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(qt(t,e))return;s.uniform4uiv(this.addr,e),$t(t,e)}}function Fv(s,e,t){const i=this.cache,n=t.allocateTextureUnit();i[0]!==n&&(s.uniform1i(this.addr,n),i[0]=n);let r;this.type===s.SAMPLER_2D_SHADOW?(kl.compareFunction=t.isReversedDepthBuffer()?Jl:Yl,r=kl):r=dd,t.setTexture2D(e||r,n)}function Ov(s,e,t){const i=this.cache,n=t.allocateTextureUnit();i[0]!==n&&(s.uniform1i(this.addr,n),i[0]=n),t.setTexture3D(e||pd,n)}function Bv(s,e,t){const i=this.cache,n=t.allocateTextureUnit();i[0]!==n&&(s.uniform1i(this.addr,n),i[0]=n),t.setTextureCube(e||md,n)}function Hv(s,e,t){const i=this.cache,n=t.allocateTextureUnit();i[0]!==n&&(s.uniform1i(this.addr,n),i[0]=n),t.setTexture2DArray(e||fd,n)}function zv(s){switch(s){case 5126:return Mv;case 35664:return bv;case 35665:return wv;case 35666:return Ev;case 35674:return Tv;case 35675:return Av;case 35676:return Cv;case 5124:case 35670:return Pv;case 35667:case 35671:return Rv;case 35668:case 35672:return Lv;case 35669:case 35673:return Iv;case 5125:return Dv;case 36294:return kv;case 36295:return Uv;case 36296:return Nv;case 35678:case 36198:case 36298:case 36306:case 35682:return Fv;case 35679:case 36299:case 36307:return Ov;case 35680:case 36300:case 36308:case 36293:return Bv;case 36289:case 36303:case 36311:case 36292:return Hv}}function Gv(s,e){s.uniform1fv(this.addr,e)}function Vv(s,e){const t=Ts(e,this.size,2);s.uniform2fv(this.addr,t)}function Wv(s,e){const t=Ts(e,this.size,3);s.uniform3fv(this.addr,t)}function Xv(s,e){const t=Ts(e,this.size,4);s.uniform4fv(this.addr,t)}function qv(s,e){const t=Ts(e,this.size,4);s.uniformMatrix2fv(this.addr,!1,t)}function $v(s,e){const t=Ts(e,this.size,9);s.uniformMatrix3fv(this.addr,!1,t)}function Kv(s,e){const t=Ts(e,this.size,16);s.uniformMatrix4fv(this.addr,!1,t)}function Yv(s,e){s.uniform1iv(this.addr,e)}function Jv(s,e){s.uniform2iv(this.addr,e)}function Zv(s,e){s.uniform3iv(this.addr,e)}function jv(s,e){s.uniform4iv(this.addr,e)}function Qv(s,e){s.uniform1uiv(this.addr,e)}function e1(s,e){s.uniform2uiv(this.addr,e)}function t1(s,e){s.uniform3uiv(this.addr,e)}function i1(s,e){s.uniform4uiv(this.addr,e)}function n1(s,e,t){const i=this.cache,n=e.length,r=ka(t,n);qt(i,r)||(s.uniform1iv(this.addr,r),$t(i,r));let a;this.type===s.SAMPLER_2D_SHADOW?a=kl:a=dd;for(let o=0;o!==n;++o)t.setTexture2D(e[o]||a,r[o])}function s1(s,e,t){const i=this.cache,n=e.length,r=ka(t,n);qt(i,r)||(s.uniform1iv(this.addr,r),$t(i,r));for(let a=0;a!==n;++a)t.setTexture3D(e[a]||pd,r[a])}function r1(s,e,t){const i=this.cache,n=e.length,r=ka(t,n);qt(i,r)||(s.uniform1iv(this.addr,r),$t(i,r));for(let a=0;a!==n;++a)t.setTextureCube(e[a]||md,r[a])}function a1(s,e,t){const i=this.cache,n=e.length,r=ka(t,n);qt(i,r)||(s.uniform1iv(this.addr,r),$t(i,r));for(let a=0;a!==n;++a)t.setTexture2DArray(e[a]||fd,r[a])}function o1(s){switch(s){case 5126:return Gv;case 35664:return Vv;case 35665:return Wv;case 35666:return Xv;case 35674:return qv;case 35675:return $v;case 35676:return Kv;case 5124:case 35670:return Yv;case 35667:case 35671:return Jv;case 35668:case 35672:return Zv;case 35669:case 35673:return jv;case 5125:return Qv;case 36294:return e1;case 36295:return t1;case 36296:return i1;case 35678:case 36198:case 36298:case 36306:case 35682:return n1;case 35679:case 36299:case 36307:return s1;case 35680:case 36300:case 36308:case 36293:return r1;case 36289:case 36303:case 36311:case 36292:return a1}}class l1{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=zv(t.type)}}class c1{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=o1(t.type)}}class h1{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){const n=this.seq;for(let r=0,a=n.length;r!==a;++r){const o=n[r];o.setValue(e,t[o.id],i)}}}const To=/(\w+)(\])?(\[|\.)?/g;function Oh(s,e){s.seq.push(e),s.map[e.id]=e}function u1(s,e,t){const i=s.name,n=i.length;for(To.lastIndex=0;;){const r=To.exec(i),a=To.lastIndex;let o=r[1];const c=r[2]==="]",l=r[3];if(c&&(o=o|0),l===void 0||l==="["&&a+2===n){Oh(t,l===void 0?new l1(o,s,e):new c1(o,s,e));break}else{let d=t.map[o];d===void 0&&(d=new h1(o),Oh(t,d)),t=d}}}class ha{constructor(e,t){this.seq=[],this.map={};const i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let a=0;a<i;++a){const o=e.getActiveUniform(t,a),c=e.getUniformLocation(t,o.name);u1(o,c,this)}const n=[],r=[];for(const a of this.seq)a.type===e.SAMPLER_2D_SHADOW||a.type===e.SAMPLER_CUBE_SHADOW||a.type===e.SAMPLER_2D_ARRAY_SHADOW?n.push(a):r.push(a);n.length>0&&(this.seq=n.concat(r))}setValue(e,t,i,n){const r=this.map[t];r!==void 0&&r.setValue(e,i,n)}setOptional(e,t,i){const n=t[i];n!==void 0&&this.setValue(e,i,n)}static upload(e,t,i,n){for(let r=0,a=t.length;r!==a;++r){const o=t[r],c=i[o.id];c.needsUpdate!==!1&&o.setValue(e,c.value,n)}}static seqWithValue(e,t){const i=[];for(let n=0,r=e.length;n!==r;++n){const a=e[n];a.id in t&&i.push(a)}return i}}function Bh(s,e,t){const i=s.createShader(e);return s.shaderSource(i,t),s.compileShader(i),i}const d1=37297;let f1=0;function p1(s,e){const t=s.split(`
`),i=[],n=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let a=n;a<r;a++){const o=a+1;i.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return i.join(`
`)}const Hh=new tt;function m1(s){dt._getMatrix(Hh,dt.workingColorSpace,s);const e=`mat3( ${Hh.elements.map(t=>t.toFixed(4))} )`;switch(dt.getTransfer(s)){case ya:return[e,"LinearTransferOETF"];case Mt:return[e,"sRGBTransferOETF"];default:return Ze("WebGLProgram: Unsupported color space: ",s),[e,"LinearTransferOETF"]}}function zh(s,e,t){const i=s.getShaderParameter(e,s.COMPILE_STATUS),r=(s.getShaderInfoLog(e)||"").trim();if(i&&r==="")return"";const a=/ERROR: 0:(\d+)/.exec(r);if(a){const o=parseInt(a[1]);return t.toUpperCase()+`

`+r+`

`+p1(s.getShaderSource(e),o)}else return r}function g1(s,e){const t=m1(e);return[`vec4 ${s}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}const v1={[Eu]:"Linear",[Tu]:"Reinhard",[Au]:"Cineon",[Pa]:"ACESFilmic",[Pu]:"AgX",[Ru]:"Neutral",[Cu]:"Custom"};function x1(s,e){const t=v1[e];return t===void 0?(Ze("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+s+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+s+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const Zr=new R;function _1(){dt.getLuminanceCoefficients(Zr);const s=Zr.x.toFixed(4),e=Zr.y.toFixed(4),t=Zr.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${s}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function y1(s){return[s.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",s.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(qs).join(`
`)}function S1(s){const e=[];for(const t in s){const i=s[t];i!==!1&&e.push("#define "+t+" "+i)}return e.join(`
`)}function M1(s,e){const t={},i=s.getProgramParameter(e,s.ACTIVE_ATTRIBUTES);for(let n=0;n<i;n++){const r=s.getActiveAttrib(e,n),a=r.name;let o=1;r.type===s.FLOAT_MAT2&&(o=2),r.type===s.FLOAT_MAT3&&(o=3),r.type===s.FLOAT_MAT4&&(o=4),t[a]={type:r.type,location:s.getAttribLocation(e,a),locationSize:o}}return t}function qs(s){return s!==""}function Gh(s,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return s.replace(/NUM_SUN_LIGHTS/g,e.numSunLights).replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,e.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Vh(s,e){return s.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const b1=/^[ \t]*#include +<([\w\d./]+)>/gm;function Ul(s){return s.replace(b1,E1)}const w1=new Map;function E1(s,e){let t=at[e];if(t===void 0){const i=w1.get(e);if(i!==void 0)t=at[i],Ze('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+e+">")}return Ul(t)}const T1=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Wh(s){return s.replace(T1,A1)}function A1(s,e,t,i){let n="";for(let r=parseInt(e);r<parseInt(t);r++)n+=i.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return n}function Xh(s){let e=`precision ${s.precision} float;
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
#define LOW_PRECISION`),e}const C1={[Ys]:"SHADOWMAP_TYPE_PCF",[Vs]:"SHADOWMAP_TYPE_VSM"};function P1(s){return C1[s.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const R1={[zn]:"ENVMAP_TYPE_CUBE",[Ss]:"ENVMAP_TYPE_CUBE",[Ra]:"ENVMAP_TYPE_CUBE_UV"};function L1(s){return s.envMap===!1?"ENVMAP_TYPE_CUBE":R1[s.envMapMode]||"ENVMAP_TYPE_CUBE"}const I1={[Ss]:"ENVMAP_MODE_REFRACTION"};function D1(s){return s.envMap===!1?"ENVMAP_MODE_REFLECTION":I1[s.envMapMode]||"ENVMAP_MODE_REFLECTION"}const k1={[wu]:"ENVMAP_BLENDING_MULTIPLY",[Of]:"ENVMAP_BLENDING_MIX",[Bf]:"ENVMAP_BLENDING_ADD"};function U1(s){return s.envMap===!1?"ENVMAP_BLENDING_NONE":k1[s.combine]||"ENVMAP_BLENDING_NONE"}function N1(s){const e=s.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:i,maxMip:t}}function F1(s,e,t,i){const n=s.getContext(),r=t.defines;let a=t.vertexShader,o=t.fragmentShader;const c=P1(t),l=L1(t),h=D1(t),d=U1(t),u=N1(t),f=y1(t),g=S1(r),S=n.createProgram();let p,m,M=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(qs).join(`
`),p.length>0&&(p+=`
`),m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(qs).join(`
`),m.length>0&&(m+=`
`)):(p=[Xh(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexNormals?"#define HAS_NORMAL":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(qs).join(`
`),m=[Xh(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+l:"",t.envMap?"#define "+h:"",t.envMap?"#define "+d:"",u?"#define CUBEUV_TEXEL_WIDTH "+u.texelWidth:"",u?"#define CUBEUV_TEXEL_HEIGHT "+u.texelHeight:"",u?"#define CUBEUV_MAX_MIP "+u.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.retroreflection?"#define USE_RETROREFLECTION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas||t.batchingColor?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Vi?"#define TONE_MAPPING":"",t.toneMapping!==Vi?at.tonemapping_pars_fragment:"",t.toneMapping!==Vi?x1("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",at.colorspace_pars_fragment,g1("linearToOutputTexel",t.outputColorSpace),_1(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(qs).join(`
`)),a=Ul(a),a=Gh(a,t),a=Vh(a,t),o=Ul(o),o=Gh(o,t),o=Vh(o,t),a=Wh(a),o=Wh(o),t.isRawShaderMaterial!==!0&&(M=`#version 300 es
`,p=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+p,m=["#define varying in",t.glslVersion===Vc?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Vc?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+m);const T=M+p+a,_=M+m+o,b=Bh(n,n.VERTEX_SHADER,T),E=Bh(n,n.FRAGMENT_SHADER,_);n.attachShader(S,b),n.attachShader(S,E),t.index0AttributeName!==void 0?n.bindAttribLocation(S,0,t.index0AttributeName):t.hasPositionAttribute===!0&&n.bindAttribLocation(S,0,"position"),n.linkProgram(S);function P(I){if(s.debug.checkShaderErrors){const N=n.getProgramInfoLog(S)||"",B=n.getShaderInfoLog(b)||"",U=n.getShaderInfoLog(E)||"",O=N.trim(),K=B.trim(),V=U.trim();let ne=!0,X=!0;if(n.getProgramParameter(S,n.LINK_STATUS)===!1)if(ne=!1,typeof s.debug.onShaderError=="function")s.debug.onShaderError(n,S,b,E);else{const Q=zh(n,b,"vertex"),j=zh(n,E,"fragment");pt("WebGLProgram: Shader Error "+n.getError()+" - VALIDATE_STATUS "+n.getProgramParameter(S,n.VALIDATE_STATUS)+`

Material Name: `+I.name+`
Material Type: `+I.type+`

Program Info Log: `+O+`
`+Q+`
`+j)}else O!==""?Ze("WebGLProgram: Program Info Log:",O):(K===""||V==="")&&(X=!1);X&&(I.diagnostics={runnable:ne,programLog:O,vertexShader:{log:K,prefix:p},fragmentShader:{log:V,prefix:m}})}n.deleteShader(b),n.deleteShader(E),x=new ha(n,S),w=M1(n,S)}let x;this.getUniforms=function(){return x===void 0&&P(this),x};let w;this.getAttributes=function(){return w===void 0&&P(this),w};let C=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return C===!1&&(C=n.getProgramParameter(S,d1)),C},this.destroy=function(){i.releaseStatesOfProgram(this),n.deleteProgram(S),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=f1++,this.cacheKey=e,this.usedTimes=1,this.program=S,this.vertexShader=b,this.fragmentShader=E,this}let O1=0;class B1{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,i){const n=this._getShaderCacheForMaterial(e);return n.has(t)===!1&&(n.add(t),t.usedTimes++),n.has(i)===!1&&(n.add(i),i.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){const t=this.shaderCache;let i=t.get(e);return i===void 0&&(i=new H1(e),t.set(e,i)),i}}class H1{constructor(e){this.id=O1++,this.code=e,this.usedTimes=0}}function z1(s){return s===Gn||s===ga||s===va}function G1(s,e,t,i,n,r){const a=new zu,o=new B1,c=new Set,l=[],h=new Map,d=i.logarithmicDepthBuffer;let u=i.precision;const f={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function g(x){return c.add(x),x===0?"uv":`uv${x}`}function S(x,w,C,I,N,B){const U=I.fog,O=N.geometry,K=x.isMeshStandardMaterial||x.isMeshLambertMaterial||x.isMeshPhongMaterial?I.environment:null,V=x.isMeshStandardMaterial||x.isMeshLambertMaterial&&!x.envMap||x.isMeshPhongMaterial&&!x.envMap,ne=e.get(x.envMap||K,V),X=ne&&ne.mapping===Ra?ne.image.height:null,Q=f[x.type];x.precision!==null&&(u=i.getMaxPrecision(x.precision),u!==x.precision&&Ze("WebGLProgram.getParameters:",x.precision,"not supported, using",u,"instead."));const j=O.morphAttributes.position||O.morphAttributes.normal||O.morphAttributes.color,Ne=j!==void 0?j.length:0;let he=0;O.morphAttributes.position!==void 0&&(he=1),O.morphAttributes.normal!==void 0&&(he=2),O.morphAttributes.color!==void 0&&(he=3);let Qe,Ke,it,J;if(Q){const Ct=Bi[Q];Qe=Ct.vertexShader,Ke=Ct.fragmentShader}else{Qe=x.vertexShader,Ke=x.fragmentShader;const Ct=o.getVertexShaderStage(x),_t=o.getFragmentShaderStage(x);o.update(x,Ct,_t),it=Ct.id,J=_t.id}const te=s.getRenderTarget(),Se=s.state.buffers.depth.getReversed(),qe=N.isInstancedMesh===!0,Te=N.isBatchedMesh===!0,Ye=!!x.map,St=!!x.matcap,ie=!!ne,re=!!x.aoMap,oe=!!x.lightMap,le=!!x.bumpMap&&x.wireframe===!1,de=!!x.normalMap,Ve=!!x.displacementMap,ze=!!x.emissiveMap,Je=!!x.metalnessMap,et=!!x.roughnessMap,L=x.anisotropy>0,xt=x.clearcoat>0,lt=x.dispersion>0,A=x.retroreflectivity>0,v=x.iridescence>0,F=x.sheen>0,G=x.transmission>0,$=L&&!!x.anisotropyMap,ce=xt&&!!x.clearcoatMap,ue=xt&&!!x.clearcoatNormalMap,Y=xt&&!!x.clearcoatRoughnessMap,ee=v&&!!x.iridescenceMap,me=v&&!!x.iridescenceThicknessMap,Oe=F&&!!x.sheenColorMap,_e=F&&!!x.sheenRoughnessMap,ge=!!x.specularMap,Be=!!x.specularColorMap,We=!!x.specularIntensityMap,nt=G&&!!x.transmissionMap,k=G&&!!x.thicknessMap,ve=!!x.gradientMap,Z=!!x.alphaMap,xe=x.alphaTest>0,we=!!x.alphaHash,se=!!x.extensions;let He=Vi;x.toneMapped&&(te===null||te.isXRRenderTarget===!0)&&(He=s.toneMapping);const ke={shaderID:Q,shaderType:x.type,shaderName:x.name,vertexShader:Qe,fragmentShader:Ke,defines:x.defines,customVertexShaderID:it,customFragmentShaderID:J,isRawShaderMaterial:x.isRawShaderMaterial===!0,glslVersion:x.glslVersion,precision:u,batching:Te,batchingColor:Te&&N._colorsTexture!==null,instancing:qe,instancingColor:qe&&N.instanceColor!==null,instancingMorph:qe&&N.morphTexture!==null,outputColorSpace:te===null?s.outputColorSpace:te.isXRRenderTarget===!0?te.texture.colorSpace:dt.workingColorSpace,alphaToCoverage:!!x.alphaToCoverage,map:Ye,matcap:St,envMap:ie,envMapMode:ie&&ne.mapping,envMapCubeUVHeight:X,aoMap:re,lightMap:oe,bumpMap:le,normalMap:de,displacementMap:Ve,emissiveMap:ze,normalMapObjectSpace:de&&x.normalMapType===Gf,normalMapTangentSpace:de&&x.normalMapType===xa,packedNormalMap:de&&x.normalMapType===xa&&z1(x.normalMap.format),metalnessMap:Je,roughnessMap:et,anisotropy:L,anisotropyMap:$,clearcoat:xt,clearcoatMap:ce,clearcoatNormalMap:ue,clearcoatRoughnessMap:Y,dispersion:lt,retroreflection:A,iridescence:v,iridescenceMap:ee,iridescenceThicknessMap:me,sheen:F,sheenColorMap:Oe,sheenRoughnessMap:_e,specularMap:ge,specularColorMap:Be,specularIntensityMap:We,transmission:G,transmissionMap:nt,thicknessMap:k,gradientMap:ve,opaque:x.transparent===!1&&x.blending===Js&&x.alphaToCoverage===!1,alphaMap:Z,alphaTest:xe,alphaHash:we,combine:x.combine,mapUv:Ye&&g(x.map.channel),aoMapUv:re&&g(x.aoMap.channel),lightMapUv:oe&&g(x.lightMap.channel),bumpMapUv:le&&g(x.bumpMap.channel),normalMapUv:de&&g(x.normalMap.channel),displacementMapUv:Ve&&g(x.displacementMap.channel),emissiveMapUv:ze&&g(x.emissiveMap.channel),metalnessMapUv:Je&&g(x.metalnessMap.channel),roughnessMapUv:et&&g(x.roughnessMap.channel),anisotropyMapUv:$&&g(x.anisotropyMap.channel),clearcoatMapUv:ce&&g(x.clearcoatMap.channel),clearcoatNormalMapUv:ue&&g(x.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Y&&g(x.clearcoatRoughnessMap.channel),iridescenceMapUv:ee&&g(x.iridescenceMap.channel),iridescenceThicknessMapUv:me&&g(x.iridescenceThicknessMap.channel),sheenColorMapUv:Oe&&g(x.sheenColorMap.channel),sheenRoughnessMapUv:_e&&g(x.sheenRoughnessMap.channel),specularMapUv:ge&&g(x.specularMap.channel),specularColorMapUv:Be&&g(x.specularColorMap.channel),specularIntensityMapUv:We&&g(x.specularIntensityMap.channel),transmissionMapUv:nt&&g(x.transmissionMap.channel),thicknessMapUv:k&&g(x.thicknessMap.channel),alphaMapUv:Z&&g(x.alphaMap.channel),vertexTangents:!!O.attributes.tangent&&(de||L),vertexNormals:!!O.attributes.normal,vertexColors:x.vertexColors,vertexAlphas:x.vertexColors===!0&&!!O.attributes.color&&O.attributes.color.itemSize===4,pointsUvs:N.isPoints===!0&&!!O.attributes.uv&&(Ye||Z),fog:!!U,useFog:x.fog===!0,fogExp2:!!U&&U.isFogExp2,flatShading:x.wireframe===!1&&(x.flatShading===!0||O.attributes.normal===void 0&&de===!1&&(x.isMeshLambertMaterial||x.isMeshPhongMaterial||x.isMeshStandardMaterial||x.isMeshPhysicalMaterial)),sizeAttenuation:x.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:Se,skinning:N.isSkinnedMesh===!0,hasPositionAttribute:O.attributes.position!==void 0,morphTargets:O.morphAttributes.position!==void 0,morphNormals:O.morphAttributes.normal!==void 0,morphColors:O.morphAttributes.color!==void 0,morphTargetsCount:Ne,morphTextureStride:he,numSunLights:w.sun.length,numDirLights:w.directional.length,numPointLights:w.point.length,numSpotLights:w.spot.length,numSpotLightMaps:w.spotLightMap.length,numRectAreaLights:w.rectArea.length,numHemiLights:w.hemi.length,numSunLightShadows:w.sunShadowMap.length,numDirLightShadows:w.directionalShadowMap.length,numPointLightShadows:w.pointShadowMap.length,numSpotLightShadows:w.spotShadowMap.length,numSpotLightShadowsWithMaps:w.numSpotLightShadowsWithMaps,numLightProbes:w.numLightProbes,numLightProbeGrids:B.length,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:x.dithering,shadowMapEnabled:s.shadowMap.enabled&&C.length>0,shadowMapType:s.shadowMap.type,toneMapping:He,decodeVideoTexture:Ye&&x.map.isVideoTexture===!0&&dt.getTransfer(x.map.colorSpace)===Mt,decodeVideoTextureEmissive:ze&&x.emissiveMap.isVideoTexture===!0&&dt.getTransfer(x.emissiveMap.colorSpace)===Mt,premultipliedAlpha:x.premultipliedAlpha,doubleSided:x.side===li,flipSided:x.side===ti,useDepthPacking:x.depthPacking>=0,depthPacking:x.depthPacking||0,index0AttributeName:x.index0AttributeName,extensionClipCullDistance:se&&x.extensions.clipCullDistance===!0&&t.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(se&&x.extensions.multiDraw===!0||Te)&&t.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:t.has("KHR_parallel_shader_compile"),customProgramCacheKey:x.customProgramCacheKey()};return ke.vertexUv1s=c.has(1),ke.vertexUv2s=c.has(2),ke.vertexUv3s=c.has(3),c.clear(),ke}function p(x){const w=[];if(x.shaderID?w.push(x.shaderID):(w.push(x.customVertexShaderID),w.push(x.customFragmentShaderID)),x.defines!==void 0)for(const C in x.defines)w.push(C),w.push(x.defines[C]);return x.isRawShaderMaterial===!1&&(m(w,x),M(w,x),w.push(s.outputColorSpace)),w.push(x.customProgramCacheKey),w.join()}function m(x,w){x.push(w.precision),x.push(w.outputColorSpace),x.push(w.envMapMode),x.push(w.envMapCubeUVHeight),x.push(w.mapUv),x.push(w.alphaMapUv),x.push(w.lightMapUv),x.push(w.aoMapUv),x.push(w.bumpMapUv),x.push(w.normalMapUv),x.push(w.displacementMapUv),x.push(w.emissiveMapUv),x.push(w.metalnessMapUv),x.push(w.roughnessMapUv),x.push(w.anisotropyMapUv),x.push(w.clearcoatMapUv),x.push(w.clearcoatNormalMapUv),x.push(w.clearcoatRoughnessMapUv),x.push(w.iridescenceMapUv),x.push(w.iridescenceThicknessMapUv),x.push(w.sheenColorMapUv),x.push(w.sheenRoughnessMapUv),x.push(w.specularMapUv),x.push(w.specularColorMapUv),x.push(w.specularIntensityMapUv),x.push(w.transmissionMapUv),x.push(w.thicknessMapUv),x.push(w.combine),x.push(w.fogExp2),x.push(w.sizeAttenuation),x.push(w.morphTargetsCount),x.push(w.morphAttributeCount),x.push(w.numSunLights),x.push(w.numDirLights),x.push(w.numPointLights),x.push(w.numSpotLights),x.push(w.numSpotLightMaps),x.push(w.numHemiLights),x.push(w.numRectAreaLights),x.push(w.numSunLightShadows),x.push(w.numDirLightShadows),x.push(w.numPointLightShadows),x.push(w.numSpotLightShadows),x.push(w.numSpotLightShadowsWithMaps),x.push(w.numLightProbes),x.push(w.shadowMapType),x.push(w.toneMapping),x.push(w.numClippingPlanes),x.push(w.numClipIntersection),x.push(w.depthPacking)}function M(x,w){a.disableAll(),w.instancing&&a.enable(0),w.instancingColor&&a.enable(1),w.instancingMorph&&a.enable(2),w.matcap&&a.enable(3),w.envMap&&a.enable(4),w.normalMapObjectSpace&&a.enable(5),w.normalMapTangentSpace&&a.enable(6),w.clearcoat&&a.enable(7),w.iridescence&&a.enable(8),w.alphaTest&&a.enable(9),w.vertexColors&&a.enable(10),w.vertexAlphas&&a.enable(11),w.vertexUv1s&&a.enable(12),w.vertexUv2s&&a.enable(13),w.vertexUv3s&&a.enable(14),w.vertexTangents&&a.enable(15),w.anisotropy&&a.enable(16),w.alphaHash&&a.enable(17),w.batching&&a.enable(18),w.dispersion&&a.enable(19),w.retroreflection&&a.enable(24),w.batchingColor&&a.enable(20),w.gradientMap&&a.enable(21),w.packedNormalMap&&a.enable(22),w.vertexNormals&&a.enable(23),x.push(a.mask),a.disableAll(),w.fog&&a.enable(0),w.useFog&&a.enable(1),w.flatShading&&a.enable(2),w.logarithmicDepthBuffer&&a.enable(3),w.reversedDepthBuffer&&a.enable(4),w.skinning&&a.enable(5),w.morphTargets&&a.enable(6),w.morphNormals&&a.enable(7),w.morphColors&&a.enable(8),w.premultipliedAlpha&&a.enable(9),w.shadowMapEnabled&&a.enable(10),w.doubleSided&&a.enable(11),w.flipSided&&a.enable(12),w.useDepthPacking&&a.enable(13),w.dithering&&a.enable(14),w.transmission&&a.enable(15),w.sheen&&a.enable(16),w.opaque&&a.enable(17),w.pointsUvs&&a.enable(18),w.decodeVideoTexture&&a.enable(19),w.decodeVideoTextureEmissive&&a.enable(20),w.alphaToCoverage&&a.enable(21),w.numLightProbeGrids>0&&a.enable(22),w.hasPositionAttribute&&a.enable(23),x.push(a.mask)}function T(x){const w=f[x.type];let C;if(w){const I=Bi[w];C=l0.clone(I.uniforms)}else C=x.uniforms;return C}function _(x,w){let C=h.get(w);return C!==void 0?++C.usedTimes:(C=new F1(s,w,x,n),l.push(C),h.set(w,C)),C}function b(x){if(--x.usedTimes===0){const w=l.indexOf(x);l[w]=l[l.length-1],l.pop(),h.delete(x.cacheKey),x.destroy()}}function E(x){o.remove(x)}function P(){o.dispose()}return{getParameters:S,getProgramCacheKey:p,getUniforms:T,acquireProgram:_,releaseProgram:b,releaseShaderCache:E,programs:l,dispose:P}}function V1(){let s=new WeakMap;function e(a){return s.has(a)}function t(a){let o=s.get(a);return o===void 0&&(o={},s.set(a,o)),o}function i(a){s.delete(a)}function n(a,o,c){s.get(a)[o]=c}function r(){s=new WeakMap}return{has:e,get:t,remove:i,update:n,dispose:r}}function W1(s,e){return s.groupOrder!==e.groupOrder?s.groupOrder-e.groupOrder:s.renderOrder!==e.renderOrder?s.renderOrder-e.renderOrder:s.material.id!==e.material.id?s.material.id-e.material.id:s.materialVariant!==e.materialVariant?s.materialVariant-e.materialVariant:s.z!==e.z?s.z-e.z:s.id-e.id}function qh(s,e){return s.groupOrder!==e.groupOrder?s.groupOrder-e.groupOrder:s.renderOrder!==e.renderOrder?s.renderOrder-e.renderOrder:s.z!==e.z?e.z-s.z:s.id-e.id}function $h(){const s=[];let e=0;const t=[],i=[],n=[];function r(){e=0,t.length=0,i.length=0,n.length=0}function a(u){let f=0;return u.isInstancedMesh&&(f+=2),u.isSkinnedMesh&&(f+=1),f}function o(u,f,g,S,p,m){let M=s[e];return M===void 0?(M={id:u.id,object:u,geometry:f,material:g,materialVariant:a(u),groupOrder:S,renderOrder:u.renderOrder,z:p,group:m},s[e]=M):(M.id=u.id,M.object=u,M.geometry=f,M.material=g,M.materialVariant=a(u),M.groupOrder=S,M.renderOrder=u.renderOrder,M.z=p,M.group=m),e++,M}function c(u,f,g,S,p,m,M){M.reversedDepth===!0&&(p=-p);const T=o(u,f,g,S,p,m);g.transmission>0?i.push(T):g.transparent===!0?n.push(T):t.push(T)}function l(u,f,g,S,p,m){const M=o(u,f,g,S,p,m);g.transmission>0?i.unshift(M):g.transparent===!0?n.unshift(M):t.unshift(M)}function h(u,f){t.length>1&&t.sort(u||W1),i.length>1&&i.sort(f||qh),n.length>1&&n.sort(f||qh)}function d(){for(let u=e,f=s.length;u<f;u++){const g=s[u];if(g.id===null)break;g.id=null,g.object=null,g.geometry=null,g.material=null,g.group=null}}return{opaque:t,transmissive:i,transparent:n,init:r,push:c,unshift:l,finish:d,sort:h}}function X1(){let s=new WeakMap;function e(i,n){const r=s.get(i);let a;return r===void 0?(a=new $h,s.set(i,[a])):n>=r.length?(a=new $h,r.push(a)):a=r[n],a}function t(){s=new WeakMap}return{get:e,dispose:t}}function q1(){const s={};return{get:function(e){if(s[e.id]!==void 0)return s[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={direction:new R,color:new Xe};break;case"SpotLight":t={position:new R,direction:new R,color:new Xe,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new R,color:new Xe,distance:0,decay:0};break;case"HemisphereLight":t={direction:new R,skyColor:new Xe,groundColor:new Xe};break;case"RectAreaLight":t={color:new Xe,position:new R,halfWidth:new R,halfHeight:new R};break}return s[e.id]=t,t}}}function $1(){const s={};return{get:function(e){if(s[e.id]!==void 0)return s[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ae};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ae};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ae,shadowCameraNear:1,shadowCameraFar:1e3};break}return s[e.id]=t,t}}}let K1=0;function Y1(s,e){return(e.castShadow?2:0)-(s.castShadow?2:0)+(e.map?1:0)-(s.map?1:0)}function J1(s){const e=new q1,t=$1(),i={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)i.probe.push(new R);const n=new R,r=new Tt,a=new Tt;function o(l){let h=0,d=0,u=0;for(let N=0;N<9;N++)i.probe[N].set(0,0,0);let f=0,g=0,S=0,p=0,m=0,M=0,T=0,_=0,b=0,E=0,P=0,x=0,w=0,C=0;l.sort(Y1);for(let N=0,B=l.length;N<B;N++){const U=l[N],O=U.color,K=U.intensity,V=U.distance;let ne=null;if(U.shadow&&U.shadow.map&&(U.shadow.map.texture.format===Gn?ne=U.shadow.map.texture:ne=U.shadow.map.depthTexture||U.shadow.map.texture),U.isAmbientLight)h+=O.r*K,d+=O.g*K,u+=O.b*K;else if(U.isLightProbe){for(let X=0;X<9;X++)i.probe[X].addScaledVector(U.sh.coefficients[X],K);C++}else if(U.isSunLight){const X=e.get(U);if(X.color.copy(U.color).multiplyScalar(U.intensity),U.castShadow){const Q=U.shadow,j=t.get(U);j.shadowIntensity=Q.intensity,j.shadowBias=Q.bias,j.shadowNormalBias=Q.normalBias,j.shadowRadius=Q.radius,j.shadowMapSize.copy(Q.mapSize).multiply(Q.getFrameExtents()),i.sunShadow[g]=j,i.sunShadowMap[g]=ne;const Ne=Q.getViewportCount();for(let he=0;he<Ne;he++)i.sunShadowMatrix[S+he]=Q.getMatrix(he),i.sunShadowCascade[S+he]=Q._cascadeData[he];S+=Ne,g++}i.sun[f]=X,f++}else if(U.isDirectionalLight){const X=e.get(U);if(X.color.copy(U.color).multiplyScalar(U.intensity),U.castShadow){const Q=U.shadow,j=t.get(U);j.shadowIntensity=Q.intensity,j.shadowBias=Q.bias,j.shadowNormalBias=Q.normalBias,j.shadowRadius=Q.radius,j.shadowMapSize=Q.mapSize,i.directionalShadow[p]=j,i.directionalShadowMap[p]=ne,i.directionalShadowMatrix[p]=U.shadow.matrix,b++}i.directional[p]=X,p++}else if(U.isSpotLight){const X=e.get(U);X.position.setFromMatrixPosition(U.matrixWorld),X.color.copy(O).multiplyScalar(K),X.distance=V,X.coneCos=Math.cos(U.angle),X.penumbraCos=Math.cos(U.angle*(1-U.penumbra)),X.decay=U.decay,i.spot[M]=X;const Q=U.shadow;if(U.map&&(i.spotLightMap[x]=U.map,x++,Q.updateMatrices(U),U.castShadow&&w++),i.spotLightMatrix[M]=Q.matrix,U.castShadow){const j=t.get(U);j.shadowIntensity=Q.intensity,j.shadowBias=Q.bias,j.shadowNormalBias=Q.normalBias,j.shadowRadius=Q.radius,j.shadowMapSize=Q.mapSize,i.spotShadow[M]=j,i.spotShadowMap[M]=ne,P++}M++}else if(U.isRectAreaLight){const X=e.get(U);X.color.copy(O).multiplyScalar(K),X.halfWidth.set(U.width*.5,0,0),X.halfHeight.set(0,U.height*.5,0),i.rectArea[T]=X,T++}else if(U.isPointLight){const X=e.get(U);if(X.color.copy(U.color).multiplyScalar(U.intensity),X.distance=U.distance,X.decay=U.decay,U.castShadow){const Q=U.shadow,j=t.get(U);j.shadowIntensity=Q.intensity,j.shadowBias=Q.bias,j.shadowNormalBias=Q.normalBias,j.shadowRadius=Q.radius,j.shadowMapSize=Q.mapSize,j.shadowCameraNear=Q.camera.near,j.shadowCameraFar=Q.camera.far,i.pointShadow[m]=j,i.pointShadowMap[m]=ne,i.pointShadowMatrix[m]=U.shadow.matrix,E++}i.point[m]=X,m++}else if(U.isHemisphereLight){const X=e.get(U);X.skyColor.copy(U.color).multiplyScalar(K),X.groundColor.copy(U.groundColor).multiplyScalar(K),i.hemi[_]=X,_++}}T>0&&(s.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=ye.LTC_FLOAT_1,i.rectAreaLTC2=ye.LTC_FLOAT_2):(i.rectAreaLTC1=ye.LTC_HALF_1,i.rectAreaLTC2=ye.LTC_HALF_2)),i.ambient[0]=h,i.ambient[1]=d,i.ambient[2]=u;const I=i.hash;(I.sunLength!==f||I.directionalLength!==p||I.pointLength!==m||I.spotLength!==M||I.rectAreaLength!==T||I.hemiLength!==_||I.numSunShadows!==g||I.numDirectionalShadows!==b||I.numPointShadows!==E||I.numSpotShadows!==P||I.numSpotMaps!==x||I.numLightProbes!==C)&&(i.sun.length=f,i.directional.length=p,i.spot.length=M,i.rectArea.length=T,i.point.length=m,i.hemi.length=_,i.sunShadow.length=g,i.sunShadowMap.length=g,i.sunShadowMatrix.length=S,i.sunShadowCascade.length=S,i.directionalShadow.length=b,i.directionalShadowMap.length=b,i.directionalShadowMatrix.length=b,i.pointShadow.length=E,i.pointShadowMap.length=E,i.pointShadowMatrix.length=E,i.spotShadow.length=P,i.spotShadowMap.length=P,i.spotLightMatrix.length=P+x-w,i.spotLightMap.length=x,i.numSpotLightShadowsWithMaps=w,i.numLightProbes=C,I.sunLength=f,I.directionalLength=p,I.pointLength=m,I.spotLength=M,I.rectAreaLength=T,I.hemiLength=_,I.numSunShadows=g,I.numDirectionalShadows=b,I.numPointShadows=E,I.numSpotShadows=P,I.numSpotMaps=x,I.numLightProbes=C,i.version=K1++)}function c(l,h){let d=0,u=0,f=0,g=0,S=0,p=0;const m=h.matrixWorldInverse;for(let M=0,T=l.length;M<T;M++){const _=l[M];if(_.isSunLight){const b=i.sun[d];b.direction.setFromMatrixPosition(_.matrixWorld),b.direction.transformDirection(m),d++}else if(_.isDirectionalLight){const b=i.directional[u];b.direction.setFromMatrixPosition(_.matrixWorld),n.setFromMatrixPosition(_.target.matrixWorld),b.direction.sub(n),b.direction.transformDirection(m),u++}else if(_.isSpotLight){const b=i.spot[g];b.position.setFromMatrixPosition(_.matrixWorld),b.position.applyMatrix4(m),b.direction.setFromMatrixPosition(_.matrixWorld),n.setFromMatrixPosition(_.target.matrixWorld),b.direction.sub(n),b.direction.transformDirection(m),g++}else if(_.isRectAreaLight){const b=i.rectArea[S];b.position.setFromMatrixPosition(_.matrixWorld),b.position.applyMatrix4(m),a.identity(),r.copy(_.matrixWorld),r.premultiply(m),a.extractRotation(r),b.halfWidth.set(_.width*.5,0,0),b.halfHeight.set(0,_.height*.5,0),b.halfWidth.applyMatrix4(a),b.halfHeight.applyMatrix4(a),S++}else if(_.isPointLight){const b=i.point[f];b.position.setFromMatrixPosition(_.matrixWorld),b.position.applyMatrix4(m),f++}else if(_.isHemisphereLight){const b=i.hemi[p];b.direction.setFromMatrixPosition(_.matrixWorld),b.direction.transformDirection(m),p++}}}return{setup:o,setupView:c,state:i}}function Kh(s){const e=new J1(s),t=[],i=[],n=[];function r(u){d.camera=u,t.length=0,i.length=0,n.length=0}function a(u){t.push(u)}function o(u){i.push(u)}function c(u){n.push(u)}function l(){e.setup(t)}function h(u){e.setupView(t,u)}const d={lightsArray:t,shadowsArray:i,lightProbeGridArray:n,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return{init:r,state:d,setupLights:l,setupLightsView:h,pushLight:a,pushShadow:o,pushLightProbeGrid:c}}function Z1(s){let e=new WeakMap;function t(n,r=0){const a=e.get(n);let o;return a===void 0?(o=new Kh(s),e.set(n,[o])):r>=a.length?(o=new Kh(s),a.push(o)):o=a[r],o}function i(){e=new WeakMap}return{get:t,dispose:i}}const j1=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Q1=`uniform sampler2D shadow_pass;
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
}`,ex=[new R(1,0,0),new R(-1,0,0),new R(0,1,0),new R(0,-1,0),new R(0,0,1),new R(0,0,-1)],tx=[new R(0,-1,0),new R(0,-1,0),new R(0,0,1),new R(0,0,-1),new R(0,-1,0),new R(0,-1,0)],Yh=new Tt,Hs=new R,Ao=new R;function ix(s,e,t){let i=new ec;const n=new ae,r=new ae,a=new It,o=new d0,c=new f0,l={},h=t.maxTextureSize,d={[Hn]:ti,[ti]:Hn,[li]:li},u=new Di({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ae},radius:{value:4}},vertexShader:j1,fragmentShader:Q1}),f=u.clone();f.defines.HORIZONTAL_PASS=1;const g=new Ot;g.setAttribute("position",new fi(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const S=new je(g,u),p=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Ys;let m=this.type;this.render=function(E,P,x){if(p.enabled===!1||p.autoUpdate===!1&&p.needsUpdate===!1||E.length===0)return;this.type===_f&&(Ze("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=Ys);const w=s.getRenderTarget(),C=s.getActiveCubeFace(),I=s.getActiveMipmapLevel(),N=s.state;N.setBlending(ln),N.buffers.depth.getReversed()===!0?N.buffers.color.setClear(0,0,0,0):N.buffers.color.setClear(1,1,1,1),N.buffers.depth.setTest(!0),N.setScissorTest(!1);const B=m!==this.type;B&&P.traverse(function(U){U.material&&(Array.isArray(U.material)?U.material.forEach(O=>O.needsUpdate=!0):U.material.needsUpdate=!0)});for(let U=0,O=E.length;U<O;U++){const K=E[U],V=K.shadow;if(V===void 0){Ze("WebGLShadowMap:",K,"has no shadow.");continue}if(V.autoUpdate===!1&&V.needsUpdate===!1)continue;n.copy(V.mapSize);const ne=V.getFrameExtents();n.multiply(ne),r.copy(V.mapSize),(n.x>h||n.y>h)&&(n.x>h&&(r.x=Math.floor(h/ne.x),n.x=r.x*ne.x,V.mapSize.x=r.x),n.y>h&&(r.y=Math.floor(h/ne.y),n.y=r.y*ne.y,V.mapSize.y=r.y));const X=s.state.buffers.depth.getReversed();if(V.camera._reversedDepth=X,V.map===null||B===!0){if(V.map!==null&&(V.map.depthTexture!==null&&(V.map.depthTexture.dispose(),V.map.depthTexture=null),V.map.dispose()),this.type===Vs){if(K.isPointLight){Ze("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}V.map=new Ii(n.x,n.y,{format:Gn,type:qi,minFilter:ei,magFilter:ei,generateMipmaps:!1}),V.map.texture.name=K.name+".shadowMap",V.map.depthTexture=new lr(n.x,n.y,Li),V.map.depthTexture.name=K.name+".shadowMapDepth",V.map.depthTexture.format=un,V.map.depthTexture.compareFunction=null,V.map.depthTexture.minFilter=Xt,V.map.depthTexture.magFilter=Xt}else K.isPointLight?(V.map=new ud(n.x),V.map.depthTexture=new Tp(n.x,Xi)):(V.map=new Ii(n.x,n.y),V.map.depthTexture=new lr(n.x,n.y,Xi)),V.map.depthTexture.name=K.name+".shadowMap",V.map.depthTexture.format=un,this.type===Ys?(V.map.depthTexture.compareFunction=X?Jl:Yl,V.map.depthTexture.minFilter=ei,V.map.depthTexture.magFilter=ei):(V.map.depthTexture.compareFunction=null,V.map.depthTexture.minFilter=Xt,V.map.depthTexture.magFilter=Xt);V.camera.updateProjectionMatrix()}V.map.isWebGLCubeRenderTarget!==!0&&(V.map.width!==n.x||V.map.height!==n.y)&&V.map.setSize(n.x,n.y);const Q=V.map.isWebGLCubeRenderTarget?6:V.getViewportCount();K.isPointLight!==!0&&V.updateMatrices(K,x);for(let j=0;j<Q;j++){const Ne=V.getCamera(j);if(K.isPointLight){const he=V.camera,Qe=V.matrix,Ke=K.distance||he.far;Ke!==he.far&&(he.far=Ke,he.updateProjectionMatrix()),Hs.setFromMatrixPosition(K.matrixWorld),he.position.copy(Hs),Ao.copy(he.position),Ao.add(ex[j]),he.up.copy(tx[j]),he.lookAt(Ao),he.updateMatrixWorld(),Qe.makeTranslation(-Hs.x,-Hs.y,-Hs.z),Yh.multiplyMatrices(he.projectionMatrix,he.matrixWorldInverse),V._frustum.setFromProjectionMatrix(Yh,he.coordinateSystem,he.reversedDepth)}if(V.map.isWebGLCubeRenderTarget)s.setRenderTarget(V.map,j),s.clear();else{j===0&&(s.setRenderTarget(V.map),s.clear());const he=V.getViewport(j);a.set(r.x*he.x,r.y*he.y,r.x*he.z,r.y*he.w),N.viewport(a)}i=V.getFrustum(j),_(P,x,Ne,K,this.type)}V.isPointLightShadow!==!0&&this.type===Vs&&M(V,x),V.needsUpdate=!1}m=this.type,p.needsUpdate=!1,s.setRenderTarget(w,C,I)};function M(E,P){const x=e.update(S);u.defines.VSM_SAMPLES!==E.blurSamples&&(u.defines.VSM_SAMPLES=E.blurSamples,f.defines.VSM_SAMPLES=E.blurSamples,u.needsUpdate=!0,f.needsUpdate=!0),E.mapPass===null?E.mapPass=new Ii(n.x,n.y,{format:Gn,type:qi}):(E.mapPass.width!==E.map.width||E.mapPass.height!==E.map.height)&&E.mapPass.setSize(E.map.width,E.map.height),u.uniforms.shadow_pass.value=E.map.depthTexture,u.uniforms.resolution.value.set(E.map.width,E.map.height),u.uniforms.radius.value=E.radius,s.setRenderTarget(E.mapPass),s.clear(),s.renderBufferDirect(P,null,x,u,S,null),f.uniforms.shadow_pass.value=E.mapPass.texture,f.uniforms.resolution.value.set(E.map.width,E.map.height),f.uniforms.radius.value=E.radius,s.setRenderTarget(E.map),s.clear(),s.renderBufferDirect(P,null,x,f,S,null)}function T(E,P,x,w){let C=null;const I=x.isPointLight===!0?E.customDistanceMaterial:E.customDepthMaterial;if(I!==void 0)C=I;else if(C=x.isPointLight===!0?c:o,s.localClippingEnabled&&P.clipShadows===!0&&Array.isArray(P.clippingPlanes)&&P.clippingPlanes.length!==0||P.displacementMap&&P.displacementScale!==0||P.alphaMap&&P.alphaTest>0||P.map&&P.alphaTest>0||P.alphaToCoverage===!0){const N=C.uuid,B=P.uuid;let U=l[N];U===void 0&&(U={},l[N]=U);let O=U[B];O===void 0&&(O=C.clone(),U[B]=O,P.addEventListener("dispose",b)),C=O}if(C.visible=P.visible,C.wireframe=P.wireframe,w===Vs?C.side=P.shadowSide!==null?P.shadowSide:P.side:C.side=P.shadowSide!==null?P.shadowSide:d[P.side],C.alphaMap=P.alphaMap,C.alphaTest=P.alphaToCoverage===!0?.5:P.alphaTest,C.map=P.map,C.clipShadows=P.clipShadows,C.clippingPlanes=P.clippingPlanes,C.clipIntersection=P.clipIntersection,C.displacementMap=P.displacementMap,C.displacementScale=P.displacementScale,C.displacementBias=P.displacementBias,C.wireframeLinewidth=P.wireframeLinewidth,C.linewidth=P.linewidth,x.isPointLight===!0&&C.isMeshDistanceMaterial===!0){const N=s.properties.get(C);N.light=x}return C}function _(E,P,x,w,C){if(E.visible===!1)return;if(E.layers.test(P.layers)&&(E.isMesh||E.isLine||E.isPoints)&&(E.castShadow||E.receiveShadow&&C===Vs)&&(!E.frustumCulled||E.intersectsFrustum(i))){E.modelViewMatrix.multiplyMatrices(x.matrixWorldInverse,E.matrixWorld);const B=e.update(E),U=E.material;if(Array.isArray(U)){const O=B.groups;for(let K=0,V=O.length;K<V;K++){const ne=O[K],X=U[ne.materialIndex];if(X&&X.visible){const Q=T(E,X,w,C);E.onBeforeShadow(s,E,P,x,B,Q,ne),s.renderBufferDirect(x,null,B,Q,E,ne),E.onAfterShadow(s,E,P,x,B,Q,ne)}}}else if(U.visible){const O=T(E,U,w,C);E.onBeforeShadow(s,E,P,x,B,O,null),s.renderBufferDirect(x,null,B,O,E,null),E.onAfterShadow(s,E,P,x,B,O,null)}}const N=E.children;for(let B=0,U=N.length;B<U;B++)_(N[B],P,x,w,C)}function b(E){E.target.removeEventListener("dispose",b);for(const x in l){const w=l[x],C=E.target.uuid;C in w&&(w[C].dispose(),delete w[C])}}}function nx(s,e){function t(){let k=!1;const ve=new It;let Z=null;const xe=new It(0,0,0,0);return{setMask:function(we){Z!==we&&!k&&(s.colorMask(we,we,we,we),Z=we)},setLocked:function(we){k=we},setClear:function(we,se,He,ke,Ct){Ct===!0&&(we*=ke,se*=ke,He*=ke),ve.set(we,se,He,ke),xe.equals(ve)===!1&&(s.clearColor(we,se,He,ke),xe.copy(ve))},reset:function(){k=!1,Z=null,xe.set(-1,0,0,0)}}}function i(){let k=!1,ve=!1,Z=null,xe=null,we=null;return{setReversed:function(se){if(ve!==se){const He=e.get("EXT_clip_control");se?He.clipControlEXT(He.LOWER_LEFT_EXT,He.ZERO_TO_ONE_EXT):He.clipControlEXT(He.LOWER_LEFT_EXT,He.NEGATIVE_ONE_TO_ONE_EXT),ve=se;const ke=we;we=null,this.setClear(ke)}},getReversed:function(){return ve},setTest:function(se){se?te(s.DEPTH_TEST):Se(s.DEPTH_TEST)},setMask:function(se){Z!==se&&!k&&(s.depthMask(se),Z=se)},setFunc:function(se){if(ve&&(se=ep[se]),xe!==se){switch(se){case Wo:s.depthFunc(s.NEVER);break;case Xo:s.depthFunc(s.ALWAYS);break;case qo:s.depthFunc(s.LESS);break;case nr:s.depthFunc(s.LEQUAL);break;case $o:s.depthFunc(s.EQUAL);break;case Ko:s.depthFunc(s.GEQUAL);break;case Yo:s.depthFunc(s.GREATER);break;case Jo:s.depthFunc(s.NOTEQUAL);break;default:s.depthFunc(s.LEQUAL)}xe=se}},setLocked:function(se){k=se},setClear:function(se){we!==se&&(we=se,ve&&(se=1-se),s.clearDepth(se))},reset:function(){k=!1,Z=null,xe=null,we=null,ve=!1}}}function n(){let k=!1,ve=null,Z=null,xe=null,we=null,se=null,He=null,ke=null,Ct=null;return{setTest:function(_t){k||(_t?te(s.STENCIL_TEST):Se(s.STENCIL_TEST))},setMask:function(_t){ve!==_t&&!k&&(s.stencilMask(_t),ve=_t)},setFunc:function(_t,Ti,ki){(Z!==_t||xe!==Ti||we!==ki)&&(s.stencilFunc(_t,Ti,ki),Z=_t,xe=Ti,we=ki)},setOp:function(_t,Ti,ki){(se!==_t||He!==Ti||ke!==ki)&&(s.stencilOp(_t,Ti,ki),se=_t,He=Ti,ke=ki)},setLocked:function(_t){k=_t},setClear:function(_t){Ct!==_t&&(s.clearStencil(_t),Ct=_t)},reset:function(){k=!1,ve=null,Z=null,xe=null,we=null,se=null,He=null,ke=null,Ct=null}}}const r=new t,a=new i,o=new n,c=new WeakMap,l=new WeakMap;let h={},d={},u={},f=new WeakMap,g=[],S=null,p=!1,m=null,M=null,T=null,_=null,b=null,E=null,P=null,x=new Xe(0,0,0),w=0,C=!1,I=null,N=null,B=null,U=null,O=null;const K=s.getParameter(s.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let V=!1,ne=0;const X=s.getParameter(s.VERSION);X.indexOf("WebGL")!==-1?(ne=parseFloat(/^WebGL (\d)/.exec(X)[1]),V=ne>=1):X.indexOf("OpenGL ES")!==-1&&(ne=parseFloat(/^OpenGL ES (\d)/.exec(X)[1]),V=ne>=2);let Q=null,j={};const Ne=s.getParameter(s.SCISSOR_BOX),he=s.getParameter(s.VIEWPORT),Qe=new It().fromArray(Ne),Ke=new It().fromArray(he);function it(k,ve,Z,xe){const we=new Uint8Array(4),se=s.createTexture();s.bindTexture(k,se),s.texParameteri(k,s.TEXTURE_MIN_FILTER,s.NEAREST),s.texParameteri(k,s.TEXTURE_MAG_FILTER,s.NEAREST);for(let He=0;He<Z;He++)k===s.TEXTURE_3D||k===s.TEXTURE_2D_ARRAY?s.texImage3D(ve,0,s.RGBA,1,1,xe,0,s.RGBA,s.UNSIGNED_BYTE,we):s.texImage2D(ve+He,0,s.RGBA,1,1,0,s.RGBA,s.UNSIGNED_BYTE,we);return se}const J={};J[s.TEXTURE_2D]=it(s.TEXTURE_2D,s.TEXTURE_2D,1),J[s.TEXTURE_CUBE_MAP]=it(s.TEXTURE_CUBE_MAP,s.TEXTURE_CUBE_MAP_POSITIVE_X,6),J[s.TEXTURE_2D_ARRAY]=it(s.TEXTURE_2D_ARRAY,s.TEXTURE_2D_ARRAY,1,1),J[s.TEXTURE_3D]=it(s.TEXTURE_3D,s.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),te(s.DEPTH_TEST),a.setFunc(nr),le(!1),de(Hc),te(s.CULL_FACE),re(ln);function te(k){h[k]!==!0&&(s.enable(k),h[k]=!0)}function Se(k){h[k]!==!1&&(s.disable(k),h[k]=!1)}function qe(k,ve){return u[k]!==ve?(s.bindFramebuffer(k,ve),u[k]=ve,k===s.DRAW_FRAMEBUFFER&&(u[s.FRAMEBUFFER]=ve),k===s.FRAMEBUFFER&&(u[s.DRAW_FRAMEBUFFER]=ve),!0):!1}function Te(k,ve){let Z=g,xe=!1;if(k){Z=f.get(ve),Z===void 0&&(Z=[],f.set(ve,Z));const we=k.textures;if(Z.length!==we.length||Z[0]!==s.COLOR_ATTACHMENT0){for(let se=0,He=we.length;se<He;se++)Z[se]=s.COLOR_ATTACHMENT0+se;Z.length=we.length,xe=!0}}else Z[0]!==s.BACK&&(Z[0]=s.BACK,xe=!0);xe&&s.drawBuffers(Z)}function Ye(k){return S!==k?(s.useProgram(k),S=k,!0):!1}const St={[gs]:s.FUNC_ADD,[Sf]:s.FUNC_SUBTRACT,[Mf]:s.FUNC_REVERSE_SUBTRACT};St[bf]=s.MIN,St[wf]=s.MAX;const ie={[Ef]:s.ZERO,[Tf]:s.ONE,[Af]:s.SRC_COLOR,[Mu]:s.SRC_ALPHA,[Df]:s.SRC_ALPHA_SATURATE,[Lf]:s.DST_COLOR,[Pf]:s.DST_ALPHA,[Cf]:s.ONE_MINUS_SRC_COLOR,[bu]:s.ONE_MINUS_SRC_ALPHA,[If]:s.ONE_MINUS_DST_COLOR,[Rf]:s.ONE_MINUS_DST_ALPHA,[kf]:s.CONSTANT_COLOR,[Uf]:s.ONE_MINUS_CONSTANT_COLOR,[Nf]:s.CONSTANT_ALPHA,[Ff]:s.ONE_MINUS_CONSTANT_ALPHA};function re(k,ve,Z,xe,we,se,He,ke,Ct,_t){if(k===ln){p===!0&&(Se(s.BLEND),p=!1);return}if(p===!1&&(te(s.BLEND),p=!0),k!==yf){if(k!==m||_t!==C){if((M!==gs||b!==gs)&&(s.blendEquation(s.FUNC_ADD),M=gs,b=gs),_t)switch(k){case Js:s.blendFuncSeparate(s.ONE,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case pa:s.blendFunc(s.ONE,s.ONE);break;case zc:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case Gc:s.blendFuncSeparate(s.DST_COLOR,s.ONE_MINUS_SRC_ALPHA,s.ZERO,s.ONE);break;default:pt("WebGLState: Invalid blending: ",k);break}else switch(k){case Js:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case pa:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE,s.ONE,s.ONE);break;case zc:pt("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Gc:pt("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:pt("WebGLState: Invalid blending: ",k);break}T=null,_=null,E=null,P=null,x.set(0,0,0),w=0,m=k,C=_t}return}we=we||ve,se=se||Z,He=He||xe,(ve!==M||we!==b)&&(s.blendEquationSeparate(St[ve],St[we]),M=ve,b=we),(Z!==T||xe!==_||se!==E||He!==P)&&(s.blendFuncSeparate(ie[Z],ie[xe],ie[se],ie[He]),T=Z,_=xe,E=se,P=He),(ke.equals(x)===!1||Ct!==w)&&(s.blendColor(ke.r,ke.g,ke.b,Ct),x.copy(ke),w=Ct),m=k,C=!1}function oe(k,ve){k.side===li?Se(s.CULL_FACE):te(s.CULL_FACE);let Z=k.side===ti;ve&&(Z=!Z),le(Z),k.blending===Js&&k.transparent===!1?re(ln):re(k.blending,k.blendEquation,k.blendSrc,k.blendDst,k.blendEquationAlpha,k.blendSrcAlpha,k.blendDstAlpha,k.blendColor,k.blendAlpha,k.premultipliedAlpha),a.setFunc(k.depthFunc),a.setTest(k.depthTest),a.setMask(k.depthWrite),r.setMask(k.colorWrite);const xe=k.stencilWrite;o.setTest(xe),xe&&(o.setMask(k.stencilWriteMask),o.setFunc(k.stencilFunc,k.stencilRef,k.stencilFuncMask),o.setOp(k.stencilFail,k.stencilZFail,k.stencilZPass)),ze(k.polygonOffset,k.polygonOffsetFactor,k.polygonOffsetUnits),k.alphaToCoverage===!0?te(s.SAMPLE_ALPHA_TO_COVERAGE):Se(s.SAMPLE_ALPHA_TO_COVERAGE)}function le(k){I!==k&&(k?s.frontFace(s.CW):s.frontFace(s.CCW),I=k)}function de(k){k!==vf?(te(s.CULL_FACE),k!==N&&(k===Hc?s.cullFace(s.BACK):k===xf?s.cullFace(s.FRONT):s.cullFace(s.FRONT_AND_BACK))):Se(s.CULL_FACE),N=k}function Ve(k){k!==B&&(V&&s.lineWidth(k),B=k)}function ze(k,ve,Z){k?(te(s.POLYGON_OFFSET_FILL),(U!==ve||O!==Z)&&(U=ve,O=Z,a.getReversed()&&(ve=-ve),s.polygonOffset(ve,Z))):Se(s.POLYGON_OFFSET_FILL)}function Je(k){k?te(s.SCISSOR_TEST):Se(s.SCISSOR_TEST)}function et(k){k===void 0&&(k=s.TEXTURE0+K-1),Q!==k&&(s.activeTexture(k),Q=k)}function L(k,ve,Z){Z===void 0&&(Q===null?Z=s.TEXTURE0+K-1:Z=Q);let xe=j[Z];xe===void 0&&(xe={type:void 0,texture:void 0},j[Z]=xe),(xe.type!==k||xe.texture!==ve)&&(Q!==Z&&(s.activeTexture(Z),Q=Z),s.bindTexture(k,ve||J[k]),xe.type=k,xe.texture=ve)}function xt(){const k=j[Q];k!==void 0&&k.type!==void 0&&(s.bindTexture(k.type,null),k.type=void 0,k.texture=void 0)}function lt(){try{s.compressedTexImage2D(...arguments)}catch(k){pt("WebGLState:",k)}}function A(){try{s.compressedTexImage3D(...arguments)}catch(k){pt("WebGLState:",k)}}function v(){try{s.texSubImage2D(...arguments)}catch(k){pt("WebGLState:",k)}}function F(){try{s.texSubImage3D(...arguments)}catch(k){pt("WebGLState:",k)}}function G(){try{s.compressedTexSubImage2D(...arguments)}catch(k){pt("WebGLState:",k)}}function $(){try{s.compressedTexSubImage3D(...arguments)}catch(k){pt("WebGLState:",k)}}function ce(){try{s.texStorage2D(...arguments)}catch(k){pt("WebGLState:",k)}}function ue(){try{s.texStorage3D(...arguments)}catch(k){pt("WebGLState:",k)}}function Y(){try{s.texImage2D(...arguments)}catch(k){pt("WebGLState:",k)}}function ee(){try{s.texImage3D(...arguments)}catch(k){pt("WebGLState:",k)}}function me(k){return d[k]!==void 0?d[k]:s.getParameter(k)}function Oe(k,ve){d[k]!==ve&&(s.pixelStorei(k,ve),d[k]=ve)}function _e(k){Qe.equals(k)===!1&&(s.scissor(k.x,k.y,k.z,k.w),Qe.copy(k))}function ge(k){Ke.equals(k)===!1&&(s.viewport(k.x,k.y,k.z,k.w),Ke.copy(k))}function Be(k,ve){let Z=l.get(ve);Z===void 0&&(Z=new WeakMap,l.set(ve,Z));let xe=Z.get(k);xe===void 0&&(xe=s.getUniformBlockIndex(ve,k.name),Z.set(k,xe))}function We(k,ve){const xe=l.get(ve).get(k);c.get(ve)!==xe&&(s.uniformBlockBinding(ve,xe,k.__bindingPointIndex),c.set(ve,xe))}function nt(){s.disable(s.BLEND),s.disable(s.CULL_FACE),s.disable(s.DEPTH_TEST),s.disable(s.POLYGON_OFFSET_FILL),s.disable(s.SCISSOR_TEST),s.disable(s.STENCIL_TEST),s.disable(s.SAMPLE_ALPHA_TO_COVERAGE),s.blendEquation(s.FUNC_ADD),s.blendFunc(s.ONE,s.ZERO),s.blendFuncSeparate(s.ONE,s.ZERO,s.ONE,s.ZERO),s.blendColor(0,0,0,0),s.colorMask(!0,!0,!0,!0),s.clearColor(0,0,0,0),s.depthMask(!0),s.depthFunc(s.LESS),a.setReversed(!1),s.clearDepth(1),s.stencilMask(4294967295),s.stencilFunc(s.ALWAYS,0,4294967295),s.stencilOp(s.KEEP,s.KEEP,s.KEEP),s.clearStencil(0),s.cullFace(s.BACK),s.frontFace(s.CCW),s.polygonOffset(0,0),s.activeTexture(s.TEXTURE0),s.bindFramebuffer(s.FRAMEBUFFER,null),s.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),s.bindFramebuffer(s.READ_FRAMEBUFFER,null),s.useProgram(null),s.lineWidth(1),s.scissor(0,0,s.canvas.width,s.canvas.height),s.viewport(0,0,s.canvas.width,s.canvas.height),s.pixelStorei(s.PACK_ALIGNMENT,4),s.pixelStorei(s.UNPACK_ALIGNMENT,4),s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,!1),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,s.BROWSER_DEFAULT_WEBGL),s.pixelStorei(s.PACK_ROW_LENGTH,0),s.pixelStorei(s.PACK_SKIP_PIXELS,0),s.pixelStorei(s.PACK_SKIP_ROWS,0),s.pixelStorei(s.UNPACK_ROW_LENGTH,0),s.pixelStorei(s.UNPACK_IMAGE_HEIGHT,0),s.pixelStorei(s.UNPACK_SKIP_PIXELS,0),s.pixelStorei(s.UNPACK_SKIP_ROWS,0),s.pixelStorei(s.UNPACK_SKIP_IMAGES,0),h={},d={},Q=null,j={},u={},f=new WeakMap,g=[],S=null,p=!1,m=null,M=null,T=null,_=null,b=null,E=null,P=null,x=new Xe(0,0,0),w=0,C=!1,I=null,N=null,B=null,U=null,O=null,Qe.set(0,0,s.canvas.width,s.canvas.height),Ke.set(0,0,s.canvas.width,s.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:te,disable:Se,bindFramebuffer:qe,drawBuffers:Te,useProgram:Ye,setBlending:re,setMaterial:oe,setFlipSided:le,setCullFace:de,setLineWidth:Ve,setPolygonOffset:ze,setScissorTest:Je,activeTexture:et,bindTexture:L,unbindTexture:xt,compressedTexImage2D:lt,compressedTexImage3D:A,texImage2D:Y,texImage3D:ee,pixelStorei:Oe,getParameter:me,updateUBOMapping:Be,uniformBlockBinding:We,texStorage2D:ce,texStorage3D:ue,texSubImage2D:v,texSubImage3D:F,compressedTexSubImage2D:G,compressedTexSubImage3D:$,scissor:_e,viewport:ge,reset:nt}}function sx(s,e,t,i,n,r,a){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new ae,h=new WeakMap,d=new Set;let u;const f=new WeakMap;let g=!1;try{g=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function S(A,v){return g?new OffscreenCanvas(A,v):Sa("canvas")}function p(A,v,F){let G=1;const $=lt(A);if(($.width>F||$.height>F)&&(G=F/Math.max($.width,$.height)),G<1)if(typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&A instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&A instanceof ImageBitmap||typeof VideoFrame<"u"&&A instanceof VideoFrame){const ce=Math.floor(G*$.width),ue=Math.floor(G*$.height);u===void 0&&(u=S(ce,ue));const Y=v?S(ce,ue):u;return Y.width=ce,Y.height=ue,Y.getContext("2d").drawImage(A,0,0,ce,ue),Ze("WebGLRenderer: Texture has been resized from ("+$.width+"x"+$.height+") to ("+ce+"x"+ue+")."),Y}else return"data"in A&&Ze("WebGLRenderer: Image in DataTexture is too big ("+$.width+"x"+$.height+")."),A;return A}function m(A){return A.generateMipmaps}function M(A){s.generateMipmap(A)}function T(A){return A.isWebGLCubeRenderTarget?s.TEXTURE_CUBE_MAP:A.isWebGL3DRenderTarget?s.TEXTURE_3D:A.isWebGLArrayRenderTarget||A.isCompressedArrayTexture?s.TEXTURE_2D_ARRAY:s.TEXTURE_2D}function _(A,v,F,G,$,ce=!1){if(A!==null){if(s[A]!==void 0)return s[A];Ze("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+A+"'")}let ue;G&&(ue=e.get("EXT_texture_norm16"),ue||Ze("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let Y=v;if(v===s.RED&&(F===s.FLOAT&&(Y=s.R32F),F===s.HALF_FLOAT&&(Y=s.R16F),F===s.UNSIGNED_BYTE&&(Y=s.R8),F===s.UNSIGNED_SHORT&&ue&&(Y=ue.R16_EXT),F===s.SHORT&&ue&&(Y=ue.R16_SNORM_EXT)),v===s.RED_INTEGER&&(F===s.UNSIGNED_BYTE&&(Y=s.R8UI),F===s.UNSIGNED_SHORT&&(Y=s.R16UI),F===s.UNSIGNED_INT&&(Y=s.R32UI),F===s.BYTE&&(Y=s.R8I),F===s.SHORT&&(Y=s.R16I),F===s.INT&&(Y=s.R32I)),v===s.RG&&(F===s.FLOAT&&(Y=s.RG32F),F===s.HALF_FLOAT&&(Y=s.RG16F),F===s.UNSIGNED_BYTE&&(Y=s.RG8),F===s.UNSIGNED_SHORT&&ue&&(Y=ue.RG16_EXT),F===s.SHORT&&ue&&(Y=ue.RG16_SNORM_EXT)),v===s.RG_INTEGER&&(F===s.UNSIGNED_BYTE&&(Y=s.RG8UI),F===s.UNSIGNED_SHORT&&(Y=s.RG16UI),F===s.UNSIGNED_INT&&(Y=s.RG32UI),F===s.BYTE&&(Y=s.RG8I),F===s.SHORT&&(Y=s.RG16I),F===s.INT&&(Y=s.RG32I)),v===s.RGB_INTEGER&&(F===s.UNSIGNED_BYTE&&(Y=s.RGB8UI),F===s.UNSIGNED_SHORT&&(Y=s.RGB16UI),F===s.UNSIGNED_INT&&(Y=s.RGB32UI),F===s.BYTE&&(Y=s.RGB8I),F===s.SHORT&&(Y=s.RGB16I),F===s.INT&&(Y=s.RGB32I)),v===s.RGBA_INTEGER&&(F===s.UNSIGNED_BYTE&&(Y=s.RGBA8UI),F===s.UNSIGNED_SHORT&&(Y=s.RGBA16UI),F===s.UNSIGNED_INT&&(Y=s.RGBA32UI),F===s.BYTE&&(Y=s.RGBA8I),F===s.SHORT&&(Y=s.RGBA16I),F===s.INT&&(Y=s.RGBA32I)),v===s.RGB&&(F===s.UNSIGNED_SHORT&&ue&&(Y=ue.RGB16_EXT),F===s.SHORT&&ue&&(Y=ue.RGB16_SNORM_EXT),F===s.UNSIGNED_INT_5_9_9_9_REV&&(Y=s.RGB9_E5),F===s.UNSIGNED_INT_10F_11F_11F_REV&&(Y=s.R11F_G11F_B10F)),v===s.RGBA){const ee=ce?ya:dt.getTransfer($);F===s.FLOAT&&(Y=s.RGBA32F),F===s.HALF_FLOAT&&(Y=s.RGBA16F),F===s.UNSIGNED_BYTE&&(Y=ee===Mt?s.SRGB8_ALPHA8:s.RGBA8),F===s.UNSIGNED_SHORT&&ue&&(Y=ue.RGBA16_EXT),F===s.SHORT&&ue&&(Y=ue.RGBA16_SNORM_EXT),F===s.UNSIGNED_SHORT_4_4_4_4&&(Y=s.RGBA4),F===s.UNSIGNED_SHORT_5_5_5_1&&(Y=s.RGB5_A1)}return(Y===s.R16F||Y===s.R32F||Y===s.RG16F||Y===s.RG32F||Y===s.RGBA16F||Y===s.RGBA32F)&&e.get("EXT_color_buffer_float"),Y}function b(A,v){let F;return A?v===null||v===Xi||v===rr?F=s.DEPTH24_STENCIL8:v===Li?F=s.DEPTH32F_STENCIL8:v===sr&&(F=s.DEPTH24_STENCIL8,Ze("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):v===null||v===Xi||v===rr?F=s.DEPTH_COMPONENT24:v===Li?F=s.DEPTH_COMPONENT32F:v===sr&&(F=s.DEPTH_COMPONENT16),F}function E(A,v){return m(A)===!0||A.isFramebufferTexture&&A.minFilter!==Xt&&A.minFilter!==ei?Math.log2(Math.max(v.width,v.height))+1:A.mipmaps!==void 0&&A.mipmaps.length>0?A.mipmaps.length:A.isCompressedTexture&&Array.isArray(A.image)?v.mipmaps.length:1}function P(A){const v=A.target;v.removeEventListener("dispose",P),w(v),v.isVideoTexture&&h.delete(v),v.isHTMLTexture&&d.delete(v)}function x(A){const v=A.target;v.removeEventListener("dispose",x),I(v)}function w(A){const v=i.get(A);if(v.__webglInit===void 0)return;const F=A.source,G=f.get(F);if(G){const $=G[v.__cacheKey];$.usedTimes--,$.usedTimes===0&&C(A),Object.keys(G).length===0&&f.delete(F)}i.remove(A)}function C(A){const v=i.get(A);s.deleteTexture(v.__webglTexture);const F=A.source,G=f.get(F);delete G[v.__cacheKey],a.memory.textures--}function I(A){const v=i.get(A);if(A.depthTexture&&(A.depthTexture.dispose(),i.remove(A.depthTexture)),A.isWebGLCubeRenderTarget)for(let G=0;G<6;G++){if(Array.isArray(v.__webglFramebuffer[G]))for(let $=0;$<v.__webglFramebuffer[G].length;$++)s.deleteFramebuffer(v.__webglFramebuffer[G][$]);else s.deleteFramebuffer(v.__webglFramebuffer[G]);v.__webglDepthbuffer&&s.deleteRenderbuffer(v.__webglDepthbuffer[G])}else{if(Array.isArray(v.__webglFramebuffer))for(let G=0;G<v.__webglFramebuffer.length;G++)s.deleteFramebuffer(v.__webglFramebuffer[G]);else s.deleteFramebuffer(v.__webglFramebuffer);if(v.__webglDepthbuffer&&s.deleteRenderbuffer(v.__webglDepthbuffer),v.__webglMultisampledFramebuffer&&s.deleteFramebuffer(v.__webglMultisampledFramebuffer),v.__webglColorRenderbuffer)for(let G=0;G<v.__webglColorRenderbuffer.length;G++)v.__webglColorRenderbuffer[G]&&s.deleteRenderbuffer(v.__webglColorRenderbuffer[G]);v.__webglDepthRenderbuffer&&s.deleteRenderbuffer(v.__webglDepthRenderbuffer)}const F=A.textures;for(let G=0,$=F.length;G<$;G++){const ce=i.get(F[G]);ce.__webglTexture&&(s.deleteTexture(ce.__webglTexture),a.memory.textures--),i.remove(F[G])}i.remove(A)}let N=0;function B(){N=0}function U(){return N}function O(A){N=A}function K(){const A=N;return A>=n.maxTextures&&Ze("WebGLTextures: Trying to use "+(A+1)+" texture units while this GPU supports only "+n.maxTextures),N+=1,A}function V(A){const v=[];return v.push(A.wrapS),v.push(A.wrapT),v.push(A.wrapR||0),v.push(A.magFilter),v.push(A.minFilter),v.push(A.anisotropy),v.push(A.internalFormat),v.push(A.format),v.push(A.type),v.push(A.generateMipmaps),v.push(A.premultiplyAlpha),v.push(A.flipY),v.push(A.unpackAlignment),v.push(A.colorSpace),v.join()}function ne(A,v){const F=i.get(A);if(A.isVideoTexture&&L(A),A.isRenderTargetTexture===!1&&A.isExternalTexture!==!0&&A.version>0&&F.__version!==A.version){const G=A.image;if(G===null)Ze("WebGLRenderer: Texture marked for update but no image data found.");else if(G.complete===!1)Ze("WebGLRenderer: Texture marked for update but image is incomplete");else{Se(F,A,v);return}}else A.isExternalTexture&&(F.__webglTexture=A.sourceTexture?A.sourceTexture:null);t.bindTexture(s.TEXTURE_2D,F.__webglTexture,s.TEXTURE0+v)}function X(A,v){const F=i.get(A);if(A.isRenderTargetTexture===!1&&A.version>0&&F.__version!==A.version){Se(F,A,v);return}else A.isExternalTexture&&(F.__webglTexture=A.sourceTexture?A.sourceTexture:null);t.bindTexture(s.TEXTURE_2D_ARRAY,F.__webglTexture,s.TEXTURE0+v)}function Q(A,v){const F=i.get(A);if(A.isRenderTargetTexture===!1&&A.version>0&&F.__version!==A.version){Se(F,A,v);return}t.bindTexture(s.TEXTURE_3D,F.__webglTexture,s.TEXTURE0+v)}function j(A,v){const F=i.get(A);if(A.isCubeDepthTexture!==!0&&A.version>0&&F.__version!==A.version){qe(F,A,v);return}t.bindTexture(s.TEXTURE_CUBE_MAP,F.__webglTexture,s.TEXTURE0+v)}const Ne={[ma]:s.REPEAT,[an]:s.CLAMP_TO_EDGE,[Zo]:s.MIRRORED_REPEAT},he={[Xt]:s.NEAREST,[Hf]:s.NEAREST_MIPMAP_NEAREST,[Mr]:s.NEAREST_MIPMAP_LINEAR,[ei]:s.LINEAR,[qa]:s.LINEAR_MIPMAP_NEAREST,[Fn]:s.LINEAR_MIPMAP_LINEAR},Qe={[Wf]:s.NEVER,[Yf]:s.ALWAYS,[Xf]:s.LESS,[Yl]:s.LEQUAL,[qf]:s.EQUAL,[Jl]:s.GEQUAL,[$f]:s.GREATER,[Kf]:s.NOTEQUAL};function Ke(A,v){if(v.type===Li&&e.has("OES_texture_float_linear")===!1&&(v.magFilter===ei||v.magFilter===qa||v.magFilter===Mr||v.magFilter===Fn||v.minFilter===ei||v.minFilter===qa||v.minFilter===Mr||v.minFilter===Fn)&&Ze("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),s.texParameteri(A,s.TEXTURE_WRAP_S,Ne[v.wrapS]),s.texParameteri(A,s.TEXTURE_WRAP_T,Ne[v.wrapT]),(A===s.TEXTURE_3D||A===s.TEXTURE_2D_ARRAY)&&s.texParameteri(A,s.TEXTURE_WRAP_R,Ne[v.wrapR]),s.texParameteri(A,s.TEXTURE_MAG_FILTER,he[v.magFilter]),s.texParameteri(A,s.TEXTURE_MIN_FILTER,he[v.minFilter]),v.compareFunction&&(s.texParameteri(A,s.TEXTURE_COMPARE_MODE,s.COMPARE_REF_TO_TEXTURE),s.texParameteri(A,s.TEXTURE_COMPARE_FUNC,Qe[v.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(v.magFilter===Xt||v.minFilter!==Mr&&v.minFilter!==Fn||v.type===Li&&e.has("OES_texture_float_linear")===!1)return;if(v.anisotropy>1||i.get(v).__currentAnisotropy){const F=e.get("EXT_texture_filter_anisotropic");s.texParameterf(A,F.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(v.anisotropy,n.getMaxAnisotropy())),i.get(v).__currentAnisotropy=v.anisotropy}}}function it(A,v){let F=!1;A.__webglInit===void 0&&(A.__webglInit=!0,v.addEventListener("dispose",P));const G=v.source;let $=f.get(G);$===void 0&&($={},f.set(G,$));const ce=V(v);if(ce!==A.__cacheKey){$[ce]===void 0&&($[ce]={texture:s.createTexture(),usedTimes:0},a.memory.textures++,F=!0),$[ce].usedTimes++;const ue=$[A.__cacheKey];ue!==void 0&&($[A.__cacheKey].usedTimes--,ue.usedTimes===0&&C(v)),A.__cacheKey=ce,A.__webglTexture=$[ce].texture}return F}function J(A,v,F){return Math.floor(Math.floor(A/F)/v)}function te(A,v,F,G){const ce=A.updateRanges;if(ce.length===0)t.texSubImage2D(s.TEXTURE_2D,0,0,0,v.width,v.height,F,G,v.data);else{ce.sort((Oe,_e)=>Oe.start-_e.start);let ue=0;for(let Oe=1;Oe<ce.length;Oe++){const _e=ce[ue],ge=ce[Oe],Be=_e.start+_e.count,We=J(ge.start,v.width,4),nt=J(_e.start,v.width,4);ge.start<=Be+1&&We===nt&&J(ge.start+ge.count-1,v.width,4)===We?_e.count=Math.max(_e.count,ge.start+ge.count-_e.start):(++ue,ce[ue]=ge)}ce.length=ue+1;const Y=t.getParameter(s.UNPACK_ROW_LENGTH),ee=t.getParameter(s.UNPACK_SKIP_PIXELS),me=t.getParameter(s.UNPACK_SKIP_ROWS);t.pixelStorei(s.UNPACK_ROW_LENGTH,v.width);for(let Oe=0,_e=ce.length;Oe<_e;Oe++){const ge=ce[Oe],Be=Math.floor(ge.start/4),We=Math.ceil(ge.count/4),nt=Be%v.width,k=Math.floor(Be/v.width),ve=We,Z=1;t.pixelStorei(s.UNPACK_SKIP_PIXELS,nt),t.pixelStorei(s.UNPACK_SKIP_ROWS,k),t.texSubImage2D(s.TEXTURE_2D,0,nt,k,ve,Z,F,G,v.data)}A.clearUpdateRanges(),t.pixelStorei(s.UNPACK_ROW_LENGTH,Y),t.pixelStorei(s.UNPACK_SKIP_PIXELS,ee),t.pixelStorei(s.UNPACK_SKIP_ROWS,me)}}function Se(A,v,F){let G=s.TEXTURE_2D;(v.isDataArrayTexture||v.isCompressedArrayTexture)&&(G=s.TEXTURE_2D_ARRAY),v.isData3DTexture&&(G=s.TEXTURE_3D);const $=it(A,v),ce=v.source;t.bindTexture(G,A.__webglTexture,s.TEXTURE0+F);const ue=i.get(ce);if(ce.version!==ue.__version||$===!0){if(t.activeTexture(s.TEXTURE0+F),(typeof ImageBitmap<"u"&&v.image instanceof ImageBitmap)===!1){const Z=dt.getPrimaries(dt.workingColorSpace),xe=v.colorSpace===En?null:dt.getPrimaries(v.colorSpace),we=v.colorSpace===En||Z===xe?s.NONE:s.BROWSER_DEFAULT_WEBGL;t.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,v.flipY),t.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,v.premultiplyAlpha),t.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,we)}t.pixelStorei(s.UNPACK_ALIGNMENT,v.unpackAlignment);let ee=p(v.image,!1,n.maxTextureSize);ee=xt(v,ee);const me=r.convert(v.format,v.colorSpace),Oe=r.convert(v.type);let _e=_(v.internalFormat,me,Oe,v.normalized,v.colorSpace,v.isVideoTexture);Ke(G,v);let ge;const Be=v.mipmaps,We=v.isVideoTexture!==!0,nt=ue.__version===void 0||$===!0,k=ce.dataReady,ve=E(v,ee);if(v.isDepthTexture)_e=b(v.format===On,v.type),nt&&(We?t.texStorage2D(s.TEXTURE_2D,1,_e,ee.width,ee.height):t.texImage2D(s.TEXTURE_2D,0,_e,ee.width,ee.height,0,me,Oe,null));else if(v.isDataTexture)if(Be.length>0){We&&nt&&t.texStorage2D(s.TEXTURE_2D,ve,_e,Be[0].width,Be[0].height);for(let Z=0,xe=Be.length;Z<xe;Z++)ge=Be[Z],We?k&&t.texSubImage2D(s.TEXTURE_2D,Z,0,0,ge.width,ge.height,me,Oe,ge.data):t.texImage2D(s.TEXTURE_2D,Z,_e,ge.width,ge.height,0,me,Oe,ge.data);v.generateMipmaps=!1}else We?(nt&&t.texStorage2D(s.TEXTURE_2D,ve,_e,ee.width,ee.height),k&&te(v,ee,me,Oe)):t.texImage2D(s.TEXTURE_2D,0,_e,ee.width,ee.height,0,me,Oe,ee.data);else if(v.isCompressedTexture)if(v.isCompressedArrayTexture){We&&nt&&t.texStorage3D(s.TEXTURE_2D_ARRAY,ve,_e,Be[0].width,Be[0].height,ee.depth);for(let Z=0,xe=Be.length;Z<xe;Z++)if(ge=Be[Z],v.format!==Ei)if(me!==null)if(We){if(k)if(v.layerUpdates.size>0){const we=Ah(ge.width,ge.height,v.format,v.type);for(const se of v.layerUpdates){const He=ge.data.subarray(se*we/ge.data.BYTES_PER_ELEMENT,(se+1)*we/ge.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,Z,0,0,se,ge.width,ge.height,1,me,He)}}else t.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,Z,0,0,0,ge.width,ge.height,ee.depth,me,ge.data)}else t.compressedTexImage3D(s.TEXTURE_2D_ARRAY,Z,_e,ge.width,ge.height,ee.depth,0,ge.data,0,0);else Ze("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else We?k&&t.texSubImage3D(s.TEXTURE_2D_ARRAY,Z,0,0,0,ge.width,ge.height,ee.depth,me,Oe,ge.data):t.texImage3D(s.TEXTURE_2D_ARRAY,Z,_e,ge.width,ge.height,ee.depth,0,me,Oe,ge.data);v.layerUpdates.size>0&&v.clearLayerUpdates()}else{We&&nt&&t.texStorage2D(s.TEXTURE_2D,ve,_e,Be[0].width,Be[0].height);for(let Z=0,xe=Be.length;Z<xe;Z++)ge=Be[Z],v.format!==Ei?me!==null?We?k&&t.compressedTexSubImage2D(s.TEXTURE_2D,Z,0,0,ge.width,ge.height,me,ge.data):t.compressedTexImage2D(s.TEXTURE_2D,Z,_e,ge.width,ge.height,0,ge.data):Ze("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):We?k&&t.texSubImage2D(s.TEXTURE_2D,Z,0,0,ge.width,ge.height,me,Oe,ge.data):t.texImage2D(s.TEXTURE_2D,Z,_e,ge.width,ge.height,0,me,Oe,ge.data)}else if(v.isDataArrayTexture)if(We){if(nt&&t.texStorage3D(s.TEXTURE_2D_ARRAY,ve,_e,ee.width,ee.height,ee.depth),k)if(v.layerUpdates.size>0){const Z=Ah(ee.width,ee.height,v.format,v.type);for(const xe of v.layerUpdates){const we=ee.data.subarray(xe*Z/ee.data.BYTES_PER_ELEMENT,(xe+1)*Z/ee.data.BYTES_PER_ELEMENT);t.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,xe,ee.width,ee.height,1,me,Oe,we)}v.clearLayerUpdates()}else t.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,0,ee.width,ee.height,ee.depth,me,Oe,ee.data)}else t.texImage3D(s.TEXTURE_2D_ARRAY,0,_e,ee.width,ee.height,ee.depth,0,me,Oe,ee.data);else if(v.isData3DTexture)We?(nt&&t.texStorage3D(s.TEXTURE_3D,ve,_e,ee.width,ee.height,ee.depth),k&&t.texSubImage3D(s.TEXTURE_3D,0,0,0,0,ee.width,ee.height,ee.depth,me,Oe,ee.data)):t.texImage3D(s.TEXTURE_3D,0,_e,ee.width,ee.height,ee.depth,0,me,Oe,ee.data);else if(v.isFramebufferTexture){if(nt)if(We)t.texStorage2D(s.TEXTURE_2D,ve,_e,ee.width,ee.height);else{let Z=ee.width,xe=ee.height;for(let we=0;we<ve;we++)t.texImage2D(s.TEXTURE_2D,we,_e,Z,xe,0,me,Oe,null),Z>>=1,xe>>=1}}else if(v.isHTMLTexture){if("texElementImage2D"in s){const Z=s.canvas;if(Z.hasAttribute("layoutsubtree")||Z.setAttribute("layoutsubtree","true"),ee.parentNode!==Z){Z.appendChild(ee),d.add(v),Z.onpaint=xe=>{const we=xe.changedElements;for(const se of d)we.includes(se.image)&&(se.needsUpdate=!0)},Z.requestPaint();return}if(s.texElementImage2D.length===3)s.texElementImage2D(s.TEXTURE_2D,s.RGBA8,ee);else{const we=s.RGBA,se=s.RGBA,He=s.UNSIGNED_BYTE;s.texElementImage2D(s.TEXTURE_2D,0,we,se,He,ee)}s.texParameteri(s.TEXTURE_2D,s.TEXTURE_MIN_FILTER,s.LINEAR),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_WRAP_S,s.CLAMP_TO_EDGE),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_WRAP_T,s.CLAMP_TO_EDGE)}}else if(Be.length>0){if(We&&nt){const Z=lt(Be[0]);t.texStorage2D(s.TEXTURE_2D,ve,_e,Z.width,Z.height)}for(let Z=0,xe=Be.length;Z<xe;Z++)ge=Be[Z],We?k&&t.texSubImage2D(s.TEXTURE_2D,Z,0,0,me,Oe,ge):t.texImage2D(s.TEXTURE_2D,Z,_e,me,Oe,ge);v.generateMipmaps=!1}else if(We){if(nt){const Z=lt(ee);t.texStorage2D(s.TEXTURE_2D,ve,_e,Z.width,Z.height)}k&&t.texSubImage2D(s.TEXTURE_2D,0,0,0,me,Oe,ee)}else t.texImage2D(s.TEXTURE_2D,0,_e,me,Oe,ee);m(v)&&M(G),ue.__version=ce.version,v.onUpdate&&v.onUpdate(v)}A.__version=v.version}function qe(A,v,F){if(v.image.length!==6)return;const G=it(A,v),$=v.source;t.bindTexture(s.TEXTURE_CUBE_MAP,A.__webglTexture,s.TEXTURE0+F);const ce=i.get($);if($.version!==ce.__version||G===!0){t.activeTexture(s.TEXTURE0+F);const ue=dt.getPrimaries(dt.workingColorSpace),Y=v.colorSpace===En?null:dt.getPrimaries(v.colorSpace),ee=v.colorSpace===En||ue===Y?s.NONE:s.BROWSER_DEFAULT_WEBGL;t.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,v.flipY),t.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,v.premultiplyAlpha),t.pixelStorei(s.UNPACK_ALIGNMENT,v.unpackAlignment),t.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,ee);const me=v.isCompressedTexture||v.image[0].isCompressedTexture,Oe=v.image[0]&&v.image[0].isDataTexture,_e=[];for(let se=0;se<6;se++)!me&&!Oe?_e[se]=p(v.image[se],!0,n.maxCubemapSize):_e[se]=Oe?v.image[se].image:v.image[se],_e[se]=xt(v,_e[se]);const ge=_e[0],Be=r.convert(v.format,v.colorSpace),We=r.convert(v.type),nt=_(v.internalFormat,Be,We,v.normalized,v.colorSpace),k=v.isVideoTexture!==!0,ve=ce.__version===void 0||G===!0,Z=$.dataReady;let xe=E(v,ge);Ke(s.TEXTURE_CUBE_MAP,v);let we;if(me){k&&ve&&t.texStorage2D(s.TEXTURE_CUBE_MAP,xe,nt,ge.width,ge.height);for(let se=0;se<6;se++){we=_e[se].mipmaps;for(let He=0;He<we.length;He++){const ke=we[He];v.format!==Ei?Be!==null?k?Z&&t.compressedTexSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+se,He,0,0,ke.width,ke.height,Be,ke.data):t.compressedTexImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+se,He,nt,ke.width,ke.height,0,ke.data):Ze("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):k?Z&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+se,He,0,0,ke.width,ke.height,Be,We,ke.data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+se,He,nt,ke.width,ke.height,0,Be,We,ke.data)}}}else{if(we=v.mipmaps,k&&ve){we.length>0&&xe++;const se=lt(_e[0]);t.texStorage2D(s.TEXTURE_CUBE_MAP,xe,nt,se.width,se.height)}for(let se=0;se<6;se++)if(Oe){k?Z&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+se,0,0,0,_e[se].width,_e[se].height,Be,We,_e[se].data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+se,0,nt,_e[se].width,_e[se].height,0,Be,We,_e[se].data);for(let He=0;He<we.length;He++){const Ct=we[He].image[se].image;k?Z&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+se,He+1,0,0,Ct.width,Ct.height,Be,We,Ct.data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+se,He+1,nt,Ct.width,Ct.height,0,Be,We,Ct.data)}}else{k?Z&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+se,0,0,0,Be,We,_e[se]):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+se,0,nt,Be,We,_e[se]);for(let He=0;He<we.length;He++){const ke=we[He];k?Z&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+se,He+1,0,0,Be,We,ke.image[se]):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+se,He+1,nt,Be,We,ke.image[se])}}}m(v)&&M(s.TEXTURE_CUBE_MAP),ce.__version=$.version,v.onUpdate&&v.onUpdate(v)}A.__version=v.version}function Te(A,v,F,G,$,ce){const ue=r.convert(F.format,F.colorSpace),Y=r.convert(F.type),ee=_(F.internalFormat,ue,Y,F.normalized,F.colorSpace),me=i.get(v),Oe=i.get(F);if(Oe.__renderTarget=v,!me.__hasExternalTextures){const _e=Math.max(1,v.width>>ce),ge=Math.max(1,v.height>>ce);$===s.TEXTURE_3D||$===s.TEXTURE_2D_ARRAY?t.texImage3D($,ce,ee,_e,ge,v.depth,0,ue,Y,null):t.texImage2D($,ce,ee,_e,ge,0,ue,Y,null)}t.bindFramebuffer(s.FRAMEBUFFER,A),et(v)?o.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,G,$,Oe.__webglTexture,0,Je(v)):($===s.TEXTURE_2D||$>=s.TEXTURE_CUBE_MAP_POSITIVE_X&&$<=s.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&s.framebufferTexture2D(s.FRAMEBUFFER,G,$,Oe.__webglTexture,ce),t.bindFramebuffer(s.FRAMEBUFFER,null)}function Ye(A,v,F){if(s.bindRenderbuffer(s.RENDERBUFFER,A),v.depthBuffer){const G=v.depthTexture,$=G&&G.isDepthTexture?G.type:null,ce=b(v.stencilBuffer,$),ue=v.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;et(v)?o.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,Je(v),ce,v.width,v.height):F?s.renderbufferStorageMultisample(s.RENDERBUFFER,Je(v),ce,v.width,v.height):s.renderbufferStorage(s.RENDERBUFFER,ce,v.width,v.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,ue,s.RENDERBUFFER,A)}else{const G=v.textures;for(let $=0;$<G.length;$++){const ce=G[$],ue=r.convert(ce.format,ce.colorSpace),Y=r.convert(ce.type),ee=_(ce.internalFormat,ue,Y,ce.normalized,ce.colorSpace);et(v)?o.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,Je(v),ee,v.width,v.height):F?s.renderbufferStorageMultisample(s.RENDERBUFFER,Je(v),ee,v.width,v.height):s.renderbufferStorage(s.RENDERBUFFER,ee,v.width,v.height)}}s.bindRenderbuffer(s.RENDERBUFFER,null)}function St(A,v,F){const G=v.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(s.FRAMEBUFFER,A),!(v.depthTexture&&v.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");const $=i.get(v.depthTexture);if($.__renderTarget=v,(!$.__webglTexture||v.depthTexture.image.width!==v.width||v.depthTexture.image.height!==v.height)&&(v.depthTexture.image.width=v.width,v.depthTexture.image.height=v.height,v.depthTexture.needsUpdate=!0),G){if($.__webglInit===void 0&&($.__webglInit=!0,v.depthTexture.addEventListener("dispose",P)),$.__webglTexture===void 0){$.__webglTexture=s.createTexture(),t.bindTexture(s.TEXTURE_CUBE_MAP,$.__webglTexture),Ke(s.TEXTURE_CUBE_MAP,v.depthTexture);const me=r.convert(v.depthTexture.format),Oe=r.convert(v.depthTexture.type);let _e;v.depthTexture.format===un?_e=s.DEPTH_COMPONENT24:v.depthTexture.format===On&&(_e=s.DEPTH24_STENCIL8);for(let ge=0;ge<6;ge++)s.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ge,0,_e,v.width,v.height,0,me,Oe,null)}}else ne(v.depthTexture,0);const ce=$.__webglTexture,ue=Je(v),Y=G?s.TEXTURE_CUBE_MAP_POSITIVE_X+F:s.TEXTURE_2D,ee=v.depthTexture.format===On?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;if(v.depthTexture.format===un)et(v)?o.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,ee,Y,ce,0,ue):s.framebufferTexture2D(s.FRAMEBUFFER,ee,Y,ce,0);else if(v.depthTexture.format===On)et(v)?o.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,ee,Y,ce,0,ue):s.framebufferTexture2D(s.FRAMEBUFFER,ee,Y,ce,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function ie(A){const v=i.get(A),F=A.isWebGLCubeRenderTarget===!0;if(v.__boundDepthTexture!==A.depthTexture){const G=A.depthTexture;if(v.__depthDisposeCallback&&v.__depthDisposeCallback(),G){const $=()=>{delete v.__boundDepthTexture,delete v.__depthDisposeCallback,G.removeEventListener("dispose",$)};G.addEventListener("dispose",$),v.__depthDisposeCallback=$}v.__boundDepthTexture=G}if(A.depthTexture&&!v.__autoAllocateDepthBuffer)if(F)for(let G=0;G<6;G++)St(v.__webglFramebuffer[G],A,G);else{const G=A.texture.mipmaps;G&&G.length>0?St(v.__webglFramebuffer[0],A,0):St(v.__webglFramebuffer,A,0)}else if(F){v.__webglDepthbuffer=[];for(let G=0;G<6;G++)if(t.bindFramebuffer(s.FRAMEBUFFER,v.__webglFramebuffer[G]),v.__webglDepthbuffer[G]===void 0)v.__webglDepthbuffer[G]=s.createRenderbuffer(),Ye(v.__webglDepthbuffer[G],A,!1);else{const $=A.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,ce=v.__webglDepthbuffer[G];s.bindRenderbuffer(s.RENDERBUFFER,ce),s.framebufferRenderbuffer(s.FRAMEBUFFER,$,s.RENDERBUFFER,ce)}}else{const G=A.texture.mipmaps;if(G&&G.length>0?t.bindFramebuffer(s.FRAMEBUFFER,v.__webglFramebuffer[0]):t.bindFramebuffer(s.FRAMEBUFFER,v.__webglFramebuffer),v.__webglDepthbuffer===void 0)v.__webglDepthbuffer=s.createRenderbuffer(),Ye(v.__webglDepthbuffer,A,!1);else{const $=A.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,ce=v.__webglDepthbuffer;s.bindRenderbuffer(s.RENDERBUFFER,ce),s.framebufferRenderbuffer(s.FRAMEBUFFER,$,s.RENDERBUFFER,ce)}}t.bindFramebuffer(s.FRAMEBUFFER,null)}function re(A,v,F){const G=i.get(A);v!==void 0&&Te(G.__webglFramebuffer,A,A.texture,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,0),F!==void 0&&ie(A)}function oe(A){const v=A.texture,F=i.get(A),G=i.get(v);A.addEventListener("dispose",x);const $=A.textures,ce=A.isWebGLCubeRenderTarget===!0,ue=$.length>1;if(ue||(G.__webglTexture===void 0&&(G.__webglTexture=s.createTexture()),G.__version=v.version,a.memory.textures++),ce){F.__webglFramebuffer=[];for(let Y=0;Y<6;Y++)if(v.mipmaps&&v.mipmaps.length>0){F.__webglFramebuffer[Y]=[];for(let ee=0;ee<v.mipmaps.length;ee++)F.__webglFramebuffer[Y][ee]=s.createFramebuffer()}else F.__webglFramebuffer[Y]=s.createFramebuffer()}else{if(v.mipmaps&&v.mipmaps.length>0){F.__webglFramebuffer=[];for(let Y=0;Y<v.mipmaps.length;Y++)F.__webglFramebuffer[Y]=s.createFramebuffer()}else F.__webglFramebuffer=s.createFramebuffer();if(ue)for(let Y=0,ee=$.length;Y<ee;Y++){const me=i.get($[Y]);me.__webglTexture===void 0&&(me.__webglTexture=s.createTexture(),a.memory.textures++)}if(A.samples>0&&et(A)===!1){F.__webglMultisampledFramebuffer=s.createFramebuffer(),F.__webglColorRenderbuffer=[],t.bindFramebuffer(s.FRAMEBUFFER,F.__webglMultisampledFramebuffer);for(let Y=0;Y<$.length;Y++){const ee=$[Y];F.__webglColorRenderbuffer[Y]=s.createRenderbuffer(),s.bindRenderbuffer(s.RENDERBUFFER,F.__webglColorRenderbuffer[Y]);const me=r.convert(ee.format,ee.colorSpace),Oe=r.convert(ee.type),_e=_(ee.internalFormat,me,Oe,ee.normalized,ee.colorSpace,A.isXRRenderTarget===!0),ge=Je(A);s.renderbufferStorageMultisample(s.RENDERBUFFER,ge,_e,A.width,A.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+Y,s.RENDERBUFFER,F.__webglColorRenderbuffer[Y])}s.bindRenderbuffer(s.RENDERBUFFER,null),A.depthBuffer&&(F.__webglDepthRenderbuffer=s.createRenderbuffer(),Ye(F.__webglDepthRenderbuffer,A,!0)),t.bindFramebuffer(s.FRAMEBUFFER,null)}}if(ce){t.bindTexture(s.TEXTURE_CUBE_MAP,G.__webglTexture),Ke(s.TEXTURE_CUBE_MAP,v);for(let Y=0;Y<6;Y++)if(v.mipmaps&&v.mipmaps.length>0)for(let ee=0;ee<v.mipmaps.length;ee++)Te(F.__webglFramebuffer[Y][ee],A,v,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+Y,ee);else Te(F.__webglFramebuffer[Y],A,v,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+Y,0);m(v)&&M(s.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(ue){for(let Y=0,ee=$.length;Y<ee;Y++){const me=$[Y],Oe=i.get(me);let _e=s.TEXTURE_2D;(A.isWebGL3DRenderTarget||A.isWebGLArrayRenderTarget)&&(_e=A.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),t.bindTexture(_e,Oe.__webglTexture),Ke(_e,me),Te(F.__webglFramebuffer,A,me,s.COLOR_ATTACHMENT0+Y,_e,0),m(me)&&M(_e)}t.unbindTexture()}else{let Y=s.TEXTURE_2D;if((A.isWebGL3DRenderTarget||A.isWebGLArrayRenderTarget)&&(Y=A.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),t.bindTexture(Y,G.__webglTexture),Ke(Y,v),v.mipmaps&&v.mipmaps.length>0)for(let ee=0;ee<v.mipmaps.length;ee++)Te(F.__webglFramebuffer[ee],A,v,s.COLOR_ATTACHMENT0,Y,ee);else Te(F.__webglFramebuffer,A,v,s.COLOR_ATTACHMENT0,Y,0);m(v)&&M(Y),t.unbindTexture()}A.depthBuffer&&ie(A)}function le(A){const v=A.textures;for(let F=0,G=v.length;F<G;F++){const $=v[F];if(m($)){const ce=T(A),ue=i.get($).__webglTexture;t.bindTexture(ce,ue),M(ce),t.unbindTexture()}}}const de=[],Ve=[];function ze(A){if(A.samples>0){if(et(A)===!1){const v=A.textures,F=A.width,G=A.height;let $=s.COLOR_BUFFER_BIT;const ce=A.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,ue=i.get(A),Y=v.length>1;if(Y)for(let me=0;me<v.length;me++)t.bindFramebuffer(s.FRAMEBUFFER,ue.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+me,s.RENDERBUFFER,null),t.bindFramebuffer(s.FRAMEBUFFER,ue.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+me,s.TEXTURE_2D,null,0);t.bindFramebuffer(s.READ_FRAMEBUFFER,ue.__webglMultisampledFramebuffer);const ee=A.texture.mipmaps;ee&&ee.length>0?t.bindFramebuffer(s.DRAW_FRAMEBUFFER,ue.__webglFramebuffer[0]):t.bindFramebuffer(s.DRAW_FRAMEBUFFER,ue.__webglFramebuffer);for(let me=0;me<v.length;me++){if(A.resolveDepthBuffer&&(A.depthBuffer&&($|=s.DEPTH_BUFFER_BIT),A.stencilBuffer&&A.resolveStencilBuffer&&($|=s.STENCIL_BUFFER_BIT)),Y){s.framebufferRenderbuffer(s.READ_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.RENDERBUFFER,ue.__webglColorRenderbuffer[me]);const Oe=i.get(v[me]).__webglTexture;s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,Oe,0)}s.blitFramebuffer(0,0,F,G,0,0,F,G,$,s.NEAREST),c===!0&&(de.length=0,Ve.length=0,de.push(s.COLOR_ATTACHMENT0+me),A.depthBuffer&&A.storeMultisampledDepthBuffer===!1&&(de.push(ce),Ve.push(ce),s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,Ve)),s.invalidateFramebuffer(s.READ_FRAMEBUFFER,de))}if(t.bindFramebuffer(s.READ_FRAMEBUFFER,null),t.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),Y)for(let me=0;me<v.length;me++){t.bindFramebuffer(s.FRAMEBUFFER,ue.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+me,s.RENDERBUFFER,ue.__webglColorRenderbuffer[me]);const Oe=i.get(v[me]).__webglTexture;t.bindFramebuffer(s.FRAMEBUFFER,ue.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+me,s.TEXTURE_2D,Oe,0)}t.bindFramebuffer(s.DRAW_FRAMEBUFFER,ue.__webglMultisampledFramebuffer)}else if(A.depthBuffer&&A.storeMultisampledDepthBuffer===!1&&c){const v=A.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,[v])}}}function Je(A){return Math.min(n.maxSamples,A.samples)}function et(A){const v=i.get(A);return A.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&v.__useRenderToTexture!==!1}function L(A){const v=a.render.frame;h.get(A)!==v&&(h.set(A,v),A.update())}function xt(A,v){const F=A.colorSpace,G=A.format,$=A.type;return A.isCompressedTexture===!0||A.isVideoTexture===!0||F!==_a&&F!==En&&(dt.getTransfer(F)===Mt?(G!==Ei||$!==_i)&&Ze("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):pt("WebGLTextures: Unsupported texture color space:",F)),v}function lt(A){return typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement?(l.width=A.naturalWidth||A.width,l.height=A.naturalHeight||A.height):typeof VideoFrame<"u"&&A instanceof VideoFrame?(l.width=A.displayWidth,l.height=A.displayHeight):(l.width=A.width,l.height=A.height),l}this.allocateTextureUnit=K,this.resetTextureUnits=B,this.getTextureUnits=U,this.setTextureUnits=O,this.setTexture2D=ne,this.setTexture2DArray=X,this.setTexture3D=Q,this.setTextureCube=j,this.rebindTextures=re,this.setupRenderTarget=oe,this.updateRenderTargetMipmap=le,this.updateMultisampleRenderTarget=ze,this.setupDepthRenderbuffer=ie,this.setupFrameBufferTexture=Te,this.useMultisampledRTT=et,this.isReversedDepthBuffer=function(){return t.buffers.depth.getReversed()}}function rx(s,e){function t(i,n=En){let r;const a=dt.getTransfer(n);if(i===_i)return s.UNSIGNED_BYTE;if(i===Vl)return s.UNSIGNED_SHORT_4_4_4_4;if(i===Wl)return s.UNSIGNED_SHORT_5_5_5_1;if(i===ku)return s.UNSIGNED_INT_5_9_9_9_REV;if(i===Uu)return s.UNSIGNED_INT_10F_11F_11F_REV;if(i===Iu)return s.BYTE;if(i===Du)return s.SHORT;if(i===sr)return s.UNSIGNED_SHORT;if(i===Gl)return s.INT;if(i===Xi)return s.UNSIGNED_INT;if(i===Li)return s.FLOAT;if(i===qi)return s.HALF_FLOAT;if(i===Nu)return s.ALPHA;if(i===Fu)return s.RGB;if(i===Ei)return s.RGBA;if(i===un)return s.DEPTH_COMPONENT;if(i===On)return s.DEPTH_STENCIL;if(i===Xl)return s.RED;if(i===ql)return s.RED_INTEGER;if(i===Gn)return s.RG;if(i===$l)return s.RG_INTEGER;if(i===Kl)return s.RGBA_INTEGER;if(i===aa||i===oa||i===la||i===ca)if(a===Mt)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(i===aa)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===oa)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===la)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===ca)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(i===aa)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===oa)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===la)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===ca)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===jo||i===Qo||i===el||i===tl)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(i===jo)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===Qo)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===el)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===tl)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===il||i===nl||i===sl||i===rl||i===al||i===ga||i===ol)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(i===il||i===nl)return a===Mt?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(i===sl)return a===Mt?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(i===rl)return r.COMPRESSED_R11_EAC;if(i===al)return r.COMPRESSED_SIGNED_R11_EAC;if(i===ga)return r.COMPRESSED_RG11_EAC;if(i===ol)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(i===ll||i===cl||i===hl||i===ul||i===dl||i===fl||i===pl||i===ml||i===gl||i===vl||i===xl||i===_l||i===yl||i===Sl)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(i===ll)return a===Mt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===cl)return a===Mt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===hl)return a===Mt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===ul)return a===Mt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===dl)return a===Mt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===fl)return a===Mt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===pl)return a===Mt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===ml)return a===Mt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===gl)return a===Mt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===vl)return a===Mt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===xl)return a===Mt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===_l)return a===Mt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===yl)return a===Mt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===Sl)return a===Mt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===Ml||i===bl||i===wl)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(i===Ml)return a===Mt?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===bl)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===wl)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===El||i===Tl||i===va||i===Al)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(i===El)return r.COMPRESSED_RED_RGTC1_EXT;if(i===Tl)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===va)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===Al)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===rr?s.UNSIGNED_INT_24_8:s[i]!==void 0?s[i]:null}return{convert:t}}const ax=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,ox=`
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

}`;class lx{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const i=new Ju(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,i=new Di({vertexShader:ax,fragmentShader:ox,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new je(new ci(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class cx extends Xn{constructor(e,t){super();const i=this;let n=null,r=1,a=null,o="local-floor",c=1,l=null,h=null,d=null,u=null,f=null,g=null;const S=typeof XRWebGLBinding<"u",p=new lx,m={},M=t.getContextAttributes();let T=null,_=null;const b=[],E=[],P=new ae;let x=null,w=null;const C=new ui;C.viewport=new It;const I=new ui;I.viewport=new It;const N=[C,I],B=new v0;let U=null,O=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(J){let te=b[J];return te===void 0&&(te=new to,b[J]=te),te.getTargetRaySpace()},this.getControllerGrip=function(J){let te=b[J];return te===void 0&&(te=new to,b[J]=te),te.getGripSpace()},this.getHand=function(J){let te=b[J];return te===void 0&&(te=new to,b[J]=te),te.getHandSpace()};function K(J){const te=E.indexOf(J.inputSource);if(te===-1)return;const Se=b[te];Se!==void 0&&(Se.update(J.inputSource,J.frame,l||a),Se.dispatchEvent({type:J.type,data:J.inputSource}))}function V(){n.removeEventListener("select",K),n.removeEventListener("selectstart",K),n.removeEventListener("selectend",K),n.removeEventListener("squeeze",K),n.removeEventListener("squeezestart",K),n.removeEventListener("squeezeend",K),n.removeEventListener("end",V),n.removeEventListener("inputsourceschange",ne);for(let J=0;J<b.length;J++){const te=E[J];te!==null&&(E[J]=null,b[J].disconnect(te))}U=null,O=null,p.reset();for(const J in m)delete m[J];if(e.setRenderTarget(T),f=null,u=null,d=null,n=null,_=null,it.stop(),i.isPresenting=!1,e.setPixelRatio(x),e.setSize(P.width,P.height,!1),w!==null){const J=w.camera;J.fov=w.fov,J.zoom=w.zoom,J.updateProjectionMatrix(),w=null}i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(J){r=J,i.isPresenting===!0&&Ze("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(J){o=J,i.isPresenting===!0&&Ze("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||a},this.setReferenceSpace=function(J){l=J},this.getBaseLayer=function(){return u!==null?u:f},this.getBinding=function(){return d===null&&S&&(d=new XRWebGLBinding(n,t)),d},this.getFrame=function(){return g},this.getSession=function(){return n},this.setSession=async function(J){if(n=J,n!==null){if(T=e.getRenderTarget(),n.addEventListener("select",K),n.addEventListener("selectstart",K),n.addEventListener("selectend",K),n.addEventListener("squeeze",K),n.addEventListener("squeezestart",K),n.addEventListener("squeezeend",K),n.addEventListener("end",V),n.addEventListener("inputsourceschange",ne),M.xrCompatible!==!0&&await t.makeXRCompatible(),x=e.getPixelRatio(),e.getSize(P),S&&"createProjectionLayer"in XRWebGLBinding.prototype){let Se=null,qe=null,Te=null;M.depth&&(Te=M.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,Se=M.stencil?On:un,qe=M.stencil?rr:Xi);const Ye={colorFormat:t.RGBA8,depthFormat:Te,scaleFactor:r};d=this.getBinding(),u=d.createProjectionLayer(Ye),n.updateRenderState({layers:[u]}),e.setPixelRatio(1),e.setSize(u.textureWidth,u.textureHeight,!1),_=new Ii(u.textureWidth,u.textureHeight,{format:Ei,type:_i,depthTexture:new lr(u.textureWidth,u.textureHeight,qe,void 0,void 0,void 0,void 0,void 0,void 0,Se),stencilBuffer:M.stencil,colorSpace:e.outputColorSpace,samples:M.antialias?4:0,resolveDepthBuffer:u.ignoreDepthValues===!1,resolveStencilBuffer:u.ignoreDepthValues===!1,storeMultisampledDepthBuffer:u.ignoreDepthValues===!1,storeMultisampledStencilBuffer:u.ignoreDepthValues===!1})}else{const Se={antialias:M.antialias,alpha:!0,depth:M.depth,stencil:M.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(n,t,Se),n.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),_=new Ii(f.framebufferWidth,f.framebufferHeight,{format:Ei,type:_i,colorSpace:e.outputColorSpace,stencilBuffer:M.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1,storeMultisampledDepthBuffer:f.ignoreDepthValues===!1,storeMultisampledStencilBuffer:f.ignoreDepthValues===!1})}_.isXRRenderTarget=!0,this.setFoveation(c),l=null,a=await n.requestReferenceSpace(o),it.setContext(n),it.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(n!==null)return n.environmentBlendMode},this.getDepthTexture=function(){return p.getDepthTexture()};function ne(J){for(let te=0;te<J.removed.length;te++){const Se=J.removed[te],qe=E.indexOf(Se);qe>=0&&(E[qe]=null,b[qe].disconnect(Se))}for(let te=0;te<J.added.length;te++){const Se=J.added[te];let qe=E.indexOf(Se);if(qe===-1){for(let Ye=0;Ye<b.length;Ye++)if(Ye>=E.length){E.push(Se),qe=Ye;break}else if(E[Ye]===null){E[Ye]=Se,qe=Ye;break}if(qe===-1)break}const Te=b[qe];Te&&Te.connect(Se)}}const X=new R,Q=new R;function j(J,te,Se){X.setFromMatrixPosition(te.matrixWorld),Q.setFromMatrixPosition(Se.matrixWorld);const qe=X.distanceTo(Q),Te=te.projectionMatrix.elements,Ye=Se.projectionMatrix.elements,St=Te[14]/(Te[10]-1),ie=Te[14]/(Te[10]+1),re=(Te[9]+1)/Te[5],oe=(Te[9]-1)/Te[5],le=(Te[8]-1)/Te[0],de=(Ye[8]+1)/Ye[0],Ve=St*le,ze=St*de,Je=qe/(-le+de),et=Je*-le;if(te.matrixWorld.decompose(J.position,J.quaternion,J.scale),J.translateX(et),J.translateZ(Je),J.matrixWorld.compose(J.position,J.quaternion,J.scale),J.matrixWorldInverse.copy(J.matrixWorld).invert(),Te[10]===-1)J.projectionMatrix.copy(te.projectionMatrix),J.projectionMatrixInverse.copy(te.projectionMatrixInverse);else{const L=St+Je,xt=ie+Je,lt=Ve-et,A=ze+(qe-et),v=re*ie/xt*L,F=oe*ie/xt*L;J.projectionMatrix.makePerspective(lt,A,v,F,L,xt),J.projectionMatrixInverse.copy(J.projectionMatrix).invert()}}function Ne(J,te){te===null?J.matrixWorld.copy(J.matrix):J.matrixWorld.multiplyMatrices(te.matrixWorld,J.matrix),J.matrixWorldInverse.copy(J.matrixWorld).invert()}this.updateCamera=function(J){if(n===null)return;let te=J.near,Se=J.far;p.texture!==null&&(p.depthNear>0&&(te=p.depthNear),p.depthFar>0&&(Se=p.depthFar)),B.near=I.near=C.near=te,B.far=I.far=C.far=Se,(U!==B.near||O!==B.far)&&(n.updateRenderState({depthNear:B.near,depthFar:B.far}),U=B.near,O=B.far),B.layers.mask=J.layers.mask|6,C.layers.mask=B.layers.mask&-5,I.layers.mask=B.layers.mask&-3;const qe=J.parent,Te=B.cameras;Ne(B,qe);for(let Ye=0;Ye<Te.length;Ye++)Ne(Te[Ye],qe);Te.length===2?j(B,C,I):B.projectionMatrix.copy(C.projectionMatrix),w===null&&J.isPerspectiveCamera&&(w={camera:J,fov:J.fov,zoom:J.zoom}),he(J,B,qe)};function he(J,te,Se){Se===null?J.matrix.copy(te.matrixWorld):(J.matrix.copy(Se.matrixWorld),J.matrix.invert(),J.matrix.multiply(te.matrixWorld)),J.matrix.decompose(J.position,J.quaternion,J.scale),J.updateMatrixWorld(!0),J.projectionMatrix.copy(te.projectionMatrix),J.projectionMatrixInverse.copy(te.projectionMatrixInverse),J.isPerspectiveCamera&&(J.fov=Cl*2*Math.atan(1/J.projectionMatrix.elements[5]),J.zoom=1)}this.getCamera=function(){return B},this.getFoveation=function(){if(!(u===null&&f===null))return c},this.setFoveation=function(J){c=J,u!==null&&(u.fixedFoveation=J),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=J)},this.hasDepthSensing=function(){return p.texture!==null},this.getDepthSensingMesh=function(){return p.getMesh(B)},this.getCameraTexture=function(J){return m[J]};let Qe=null;function Ke(J,te){if(h=te.getViewerPose(l||a),g=te,h!==null){const Se=h.views;f!==null&&(e.setRenderTargetFramebuffer(_,f.framebuffer),e.setRenderTarget(_));let qe=!1;Se.length!==B.cameras.length&&(B.cameras.length=0,qe=!0);for(let ie=0;ie<Se.length;ie++){const re=Se[ie];let oe=null;if(f!==null)oe=f.getViewport(re);else{const de=d.getViewSubImage(u,re);oe=de.viewport,ie===0&&(e.setRenderTargetTextures(_,de.colorTexture,de.depthStencilTexture),e.setRenderTarget(_))}let le=N[ie];le===void 0&&(le=new ui,le.layers.enable(ie),le.viewport=new It,N[ie]=le),le.matrix.fromArray(re.transform.matrix),le.matrix.decompose(le.position,le.quaternion,le.scale),le.projectionMatrix.fromArray(re.projectionMatrix),le.projectionMatrixInverse.copy(le.projectionMatrix).invert(),le.viewport.set(oe.x,oe.y,oe.width,oe.height),ie===0&&(B.matrix.copy(le.matrix),B.matrix.decompose(B.position,B.quaternion,B.scale)),qe===!0&&B.cameras.push(le)}const Te=n.enabledFeatures;if(Te&&Te.includes("depth-sensing")&&n.depthUsage=="gpu-optimized"&&S){d=i.getBinding();const ie=d.getDepthInformation(Se[0]);ie&&ie.isValid&&ie.texture&&p.init(ie,n.renderState)}if(Te&&Te.includes("camera-access")&&S){e.state.unbindTexture(),d=i.getBinding();for(let ie=0;ie<Se.length;ie++){const re=Se[ie].camera;if(re){let oe=m[re];oe||(oe=new Ju,m[re]=oe);const le=d.getCameraImage(re);oe.sourceTexture=le}}}}for(let Se=0;Se<b.length;Se++){const qe=E[Se],Te=b[Se];qe!==null&&Te!==void 0&&Te.update(qe,te,l||a)}Qe&&Qe(J,te),te.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:te}),g=null}const it=new cd;it.setAnimationLoop(Ke),this.setAnimationLoop=function(J){Qe=J},this.dispose=function(){}}}const hx=new Tt,gd=new tt;gd.set(-1,0,0,0,1,0,0,0,1);function ux(s,e){function t(p,m){p.matrixAutoUpdate===!0&&p.updateMatrix(),m.value.copy(p.matrix)}function i(p,m){m.color.getRGB(p.fogColor.value,rd(s)),m.isFog?(p.fogNear.value=m.near,p.fogFar.value=m.far):m.isFogExp2&&(p.fogDensity.value=m.density)}function n(p,m,M,T,_){m.isNodeMaterial?m.uniformsNeedUpdate=!1:m.isMeshBasicMaterial?r(p,m):m.isMeshLambertMaterial?(r(p,m),m.envMap&&(p.envMapIntensity.value=m.envMapIntensity)):m.isMeshToonMaterial?(r(p,m),d(p,m)):m.isMeshPhongMaterial?(r(p,m),h(p,m),m.envMap&&(p.envMapIntensity.value=m.envMapIntensity)):m.isMeshStandardMaterial?(r(p,m),u(p,m),m.isMeshPhysicalMaterial&&f(p,m,_)):m.isMeshMatcapMaterial?(r(p,m),g(p,m)):m.isMeshDepthMaterial?r(p,m):m.isMeshDistanceMaterial?(r(p,m),S(p,m)):m.isMeshNormalMaterial?r(p,m):m.isLineBasicMaterial?(a(p,m),m.isLineDashedMaterial&&o(p,m)):m.isPointsMaterial?c(p,m,M,T):m.isSpriteMaterial?l(p,m):m.isShadowMaterial?(p.color.value.copy(m.color),p.opacity.value=m.opacity):m.isShaderMaterial&&(m.uniformsNeedUpdate=!1)}function r(p,m){p.opacity.value=m.opacity,m.color&&p.diffuse.value.copy(m.color),m.emissive&&p.emissive.value.copy(m.emissive).multiplyScalar(m.emissiveIntensity),m.map&&(p.map.value=m.map,t(m.map,p.mapTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,t(m.alphaMap,p.alphaMapTransform)),m.bumpMap&&(p.bumpMap.value=m.bumpMap,t(m.bumpMap,p.bumpMapTransform),p.bumpScale.value=m.bumpScale,m.side===ti&&(p.bumpScale.value*=-1)),m.normalMap&&(p.normalMap.value=m.normalMap,t(m.normalMap,p.normalMapTransform),p.normalScale.value.copy(m.normalScale),m.side===ti&&p.normalScale.value.negate()),m.displacementMap&&(p.displacementMap.value=m.displacementMap,t(m.displacementMap,p.displacementMapTransform),p.displacementScale.value=m.displacementScale,p.displacementBias.value=m.displacementBias),m.emissiveMap&&(p.emissiveMap.value=m.emissiveMap,t(m.emissiveMap,p.emissiveMapTransform)),m.specularMap&&(p.specularMap.value=m.specularMap,t(m.specularMap,p.specularMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest);const M=e.get(m),T=M.envMap,_=M.envMapRotation;T&&(p.envMap.value=T,p.envMapRotation.value.setFromMatrix4(hx.makeRotationFromEuler(_)).transpose(),T.isCubeTexture&&T.isRenderTargetTexture===!1&&p.envMapRotation.value.premultiply(gd),p.reflectivity.value=m.reflectivity,p.ior.value=m.ior,p.refractionRatio.value=m.refractionRatio),m.lightMap&&(p.lightMap.value=m.lightMap,p.lightMapIntensity.value=m.lightMapIntensity,t(m.lightMap,p.lightMapTransform)),m.aoMap&&(p.aoMap.value=m.aoMap,p.aoMapIntensity.value=m.aoMapIntensity,t(m.aoMap,p.aoMapTransform))}function a(p,m){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,m.map&&(p.map.value=m.map,t(m.map,p.mapTransform))}function o(p,m){p.dashSize.value=m.dashSize,p.totalSize.value=m.dashSize+m.gapSize,p.scale.value=m.scale}function c(p,m,M,T){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,p.size.value=m.size*M,p.scale.value=T*.5,m.map&&(p.map.value=m.map,t(m.map,p.uvTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,t(m.alphaMap,p.alphaMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest)}function l(p,m){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,p.rotation.value=m.rotation,m.map&&(p.map.value=m.map,t(m.map,p.mapTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,t(m.alphaMap,p.alphaMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest)}function h(p,m){p.specular.value.copy(m.specular),p.shininess.value=Math.max(m.shininess,1e-4)}function d(p,m){m.gradientMap&&(p.gradientMap.value=m.gradientMap)}function u(p,m){p.metalness.value=m.metalness,m.metalnessMap&&(p.metalnessMap.value=m.metalnessMap,t(m.metalnessMap,p.metalnessMapTransform)),p.roughness.value=m.roughness,m.roughnessMap&&(p.roughnessMap.value=m.roughnessMap,t(m.roughnessMap,p.roughnessMapTransform)),m.envMap&&(p.envMapIntensity.value=m.envMapIntensity)}function f(p,m,M){p.ior.value=m.ior,m.sheen>0&&(p.sheenColor.value.copy(m.sheenColor).multiplyScalar(m.sheen),p.sheenRoughness.value=m.sheenRoughness,m.sheenColorMap&&(p.sheenColorMap.value=m.sheenColorMap,t(m.sheenColorMap,p.sheenColorMapTransform)),m.sheenRoughnessMap&&(p.sheenRoughnessMap.value=m.sheenRoughnessMap,t(m.sheenRoughnessMap,p.sheenRoughnessMapTransform))),m.clearcoat>0&&(p.clearcoat.value=m.clearcoat,p.clearcoatRoughness.value=m.clearcoatRoughness,m.clearcoatMap&&(p.clearcoatMap.value=m.clearcoatMap,t(m.clearcoatMap,p.clearcoatMapTransform)),m.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=m.clearcoatRoughnessMap,t(m.clearcoatRoughnessMap,p.clearcoatRoughnessMapTransform)),m.clearcoatNormalMap&&(p.clearcoatNormalMap.value=m.clearcoatNormalMap,t(m.clearcoatNormalMap,p.clearcoatNormalMapTransform),p.clearcoatNormalScale.value.copy(m.clearcoatNormalScale),m.side===ti&&p.clearcoatNormalScale.value.negate())),m.dispersion>0&&(p.dispersion.value=m.dispersion),m.retroreflectivity>0&&(p.retroreflectivity.value=m.retroreflectivity),m.iridescence>0&&(p.iridescence.value=m.iridescence,p.iridescenceIOR.value=m.iridescenceIOR,p.iridescenceThicknessMinimum.value=m.iridescenceThicknessRange[0],p.iridescenceThicknessMaximum.value=m.iridescenceThicknessRange[1],m.iridescenceMap&&(p.iridescenceMap.value=m.iridescenceMap,t(m.iridescenceMap,p.iridescenceMapTransform)),m.iridescenceThicknessMap&&(p.iridescenceThicknessMap.value=m.iridescenceThicknessMap,t(m.iridescenceThicknessMap,p.iridescenceThicknessMapTransform))),m.transmission>0&&(p.transmission.value=m.transmission,p.transmissionSamplerMap.value=M.texture,p.transmissionSamplerSize.value.set(M.width,M.height),m.transmissionMap&&(p.transmissionMap.value=m.transmissionMap,t(m.transmissionMap,p.transmissionMapTransform)),p.thickness.value=m.thickness,m.thicknessMap&&(p.thicknessMap.value=m.thicknessMap,t(m.thicknessMap,p.thicknessMapTransform)),p.attenuationDistance.value=m.attenuationDistance,p.attenuationColor.value.copy(m.attenuationColor)),m.anisotropy>0&&(p.anisotropyVector.value.set(m.anisotropy*Math.cos(m.anisotropyRotation),m.anisotropy*Math.sin(m.anisotropyRotation)),m.anisotropyMap&&(p.anisotropyMap.value=m.anisotropyMap,t(m.anisotropyMap,p.anisotropyMapTransform))),p.specularIntensity.value=m.specularIntensity,p.specularColor.value.copy(m.specularColor),m.specularColorMap&&(p.specularColorMap.value=m.specularColorMap,t(m.specularColorMap,p.specularColorMapTransform)),m.specularIntensityMap&&(p.specularIntensityMap.value=m.specularIntensityMap,t(m.specularIntensityMap,p.specularIntensityMapTransform))}function g(p,m){m.matcap&&(p.matcap.value=m.matcap)}function S(p,m){const M=e.get(m).light;p.referencePosition.value.setFromMatrixPosition(M.matrixWorld),p.nearDistance.value=M.shadow.camera.near,p.farDistance.value=M.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:n}}function dx(s,e,t,i){let n={},r={},a=[];const o=s.getParameter(s.MAX_UNIFORM_BUFFER_BINDINGS);function c(_,b){const E=b.program;i.uniformBlockBinding(_,E)}function l(_,b){let E=n[_.id];E===void 0&&(p(_),E=h(_),n[_.id]=E,_.addEventListener("dispose",M));const P=b.program;i.updateUBOMapping(_,P);const x=e.render.frame;r[_.id]!==x&&(u(_),r[_.id]=x)}function h(_){const b=d();_.__bindingPointIndex=b;const E=s.createBuffer(),P=_.__size,x=_.usage;return s.bindBuffer(s.UNIFORM_BUFFER,E),s.bufferData(s.UNIFORM_BUFFER,P,x),s.bindBuffer(s.UNIFORM_BUFFER,null),s.bindBufferBase(s.UNIFORM_BUFFER,b,E),E}function d(){for(let _=0;_<o;_++)if(a.indexOf(_)===-1)return a.push(_),_;return pt("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function u(_){const b=n[_.id],E=_.uniforms,P=_.__cache;s.bindBuffer(s.UNIFORM_BUFFER,b);for(let x=0,w=E.length;x<w;x++){const C=E[x];if(Array.isArray(C))for(let I=0,N=C.length;I<N;I++)f(C[I],x,I,P);else f(C,x,0,P)}s.bindBuffer(s.UNIFORM_BUFFER,null)}function f(_,b,E,P){if(S(_,b,E,P)===!0){const x=_.__offset,w=_.value;if(Array.isArray(w)){let C=0;for(let I=0;I<w.length;I++){const N=w[I],B=m(N);g(N,_.__data,C),typeof N!="number"&&typeof N!="boolean"&&!N.isMatrix3&&!ArrayBuffer.isView(N)&&(C+=B.storage/Float32Array.BYTES_PER_ELEMENT)}}else g(w,_.__data,0);s.bufferSubData(s.UNIFORM_BUFFER,x,_.__data)}}function g(_,b,E){typeof _=="number"||typeof _=="boolean"?b[0]=_:_.isMatrix3?(b[0]=_.elements[0],b[1]=_.elements[1],b[2]=_.elements[2],b[3]=0,b[4]=_.elements[3],b[5]=_.elements[4],b[6]=_.elements[5],b[7]=0,b[8]=_.elements[6],b[9]=_.elements[7],b[10]=_.elements[8],b[11]=0):ArrayBuffer.isView(_)?b.set(new _.constructor(_.buffer,_.byteOffset,b.length)):_.toArray(b,E)}function S(_,b,E,P){const x=_.value,w=b+"_"+E;if(P[w]===void 0)return typeof x=="number"||typeof x=="boolean"?P[w]=x:ArrayBuffer.isView(x)?P[w]=x.slice():P[w]=x.clone(),!0;{const C=P[w];if(typeof x=="number"||typeof x=="boolean"){if(C!==x)return P[w]=x,!0}else{if(ArrayBuffer.isView(x))return!0;if(C.equals(x)===!1)return C.copy(x),!0}}return!1}function p(_){const b=_.uniforms;let E=0;const P=16;for(let w=0,C=b.length;w<C;w++){const I=Array.isArray(b[w])?b[w]:[b[w]];for(let N=0,B=I.length;N<B;N++){const U=I[N],O=Array.isArray(U.value)?U.value:[U.value];for(let K=0,V=O.length;K<V;K++){const ne=O[K],X=m(ne),Q=E%P,j=Q%X.boundary,Ne=Q+j;E+=j,Ne!==0&&P-Ne<X.storage&&(E+=P-Ne),U.__data=new Float32Array(X.storage/Float32Array.BYTES_PER_ELEMENT),U.__offset=E,E+=X.storage}}}const x=E%P;return x>0&&(E+=P-x),_.__size=E,_.__cache={},this}function m(_){const b={boundary:0,storage:0};return typeof _=="number"||typeof _=="boolean"?(b.boundary=4,b.storage=4):_.isVector2?(b.boundary=8,b.storage=8):_.isVector3||_.isColor?(b.boundary=16,b.storage=12):_.isVector4?(b.boundary=16,b.storage=16):_.isMatrix3?(b.boundary=48,b.storage=48):_.isMatrix4?(b.boundary=64,b.storage=64):_.isTexture?Ze("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(_)?(b.boundary=16,b.storage=_.byteLength):Ze("WebGLRenderer: Unsupported uniform value type.",_),b}function M(_){const b=_.target;b.removeEventListener("dispose",M);const E=a.indexOf(b.__bindingPointIndex);a.splice(E,1),s.deleteBuffer(n[b.id]),delete n[b.id],delete r[b.id]}function T(){for(const _ in n)s.deleteBuffer(n[_]);a=[],n={},r={}}return{bind:c,update:l,dispose:T}}const fx=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let Fi=null;function px(){return Fi===null&&(Fi=new Ql(fx,16,16,Gn,qi),Fi.name="DFG_LUT",Fi.minFilter=ei,Fi.magFilter=ei,Fi.wrapS=an,Fi.wrapT=an,Fi.generateMipmaps=!1,Fi.needsUpdate=!0),Fi}class vd{constructor(e={}){const{canvas:t=jf(),context:i=null,depth:n=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:d=!1,reversedDepthBuffer:u=!1,outputBufferType:f=_i}=e;this.isWebGLRenderer=!0;let g;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");g=i.getContextAttributes().alpha}else g=a;const S=f,p=new Set([Kl,$l,ql]),m=new Set([_i,Xi,sr,rr,Vl,Wl]),M=new Uint32Array(4),T=new Int32Array(4),_=new R;let b=null,E=null;const P=[],x=[];let w=null;this.domElement=t,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Vi,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const C=this;let I=!1,N=null,B=null,U=null,O=null;this._outputColorSpace=Yt;let K=0,V=0,ne=null,X=-1,Q=null;const j=new It,Ne=new It;let he=null;const Qe=new Xe(0);let Ke=0,it=t.width,J=t.height,te=1,Se=null,qe=null;const Te=new It(0,0,it,J),Ye=new It(0,0,it,J);let St=!1;const ie=new ec;let re=!1,oe=!1;const le=new Tt,de=new R,Ve=new It,ze={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Je=!1;function et(){return ne===null?te:1}let L=i;function xt(y,D){return t.getContext(y,D)}let lt,A,v,F,G,$,ce,ue,Y,ee,me,Oe,_e,ge,Be,We,nt,k,ve,Z,xe,we,se;try{const y={alpha:!0,depth:n,stencil:r,antialias:o,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:h,failIfMajorPerformanceCaveat:d};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${zl}`),t.addEventListener("webglcontextlost",Ct,!1),t.addEventListener("webglcontextrestored",_t,!1),t.addEventListener("webglcontextcreationerror",Ti,!1),L===null){const D="webgl2";if(L=xt(D,y),L===null)throw xt(D)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}He()}catch(y){throw t.removeEventListener("webglcontextlost",Ct,!1),t.removeEventListener("webglcontextrestored",_t,!1),t.removeEventListener("webglcontextcreationerror",Ti,!1),pt("WebGLRenderer: "+y.message),y}function He(){lt=new pv(L),lt.init(),xe=new rx(L,lt),A=new sv(L,lt,e,xe),v=new nx(L,lt),A.reversedDepthBuffer&&u&&v.buffers.depth.setReversed(!0),B=L.createFramebuffer(),U=L.createFramebuffer(),O=L.createFramebuffer(),F=new vv(L),G=new V1,$=new sx(L,lt,v,G,A,xe,F),ce=new fv(C),ue=new _0(L),we=new iv(L,ue),Y=new mv(L,ue,F,we),ee=new _v(L,Y,ue,we,F),k=new xv(L,A,$),Be=new rv(G),me=new G1(C,ce,lt,A,we,Be),Oe=new ux(C,G),_e=new X1,ge=new Z1(lt),nt=new tv(C,ce,v,ee,g,c),We=new ix(C,ee,A),se=new dx(L,F,A,v),ve=new nv(L,lt,F),Z=new gv(L,lt,F),F.programs=me.programs,C.capabilities=A,C.extensions=lt,C.properties=G,C.renderLists=_e,C.shadowMap=We,C.state=v,C.info=F}S!==_i&&(w=new Sv(S,t.width,t.height,o,n,r));const ke=new cx(C,L);this.xr=ke,this.getContext=function(){return L},this.getContextAttributes=function(){return L.getContextAttributes()},this.forceContextLoss=function(){const y=lt.get("WEBGL_lose_context");y&&y.loseContext()},this.forceContextRestore=function(){const y=lt.get("WEBGL_lose_context");y&&y.restoreContext()},this.getPixelRatio=function(){return te},this.setPixelRatio=function(y){y!==void 0&&(te=y,this.setSize(it,J,!1))},this.getSize=function(y){return y.set(it,J)},this.setSize=function(y,D,W=!0){if(ke.isPresenting){Ze("WebGLRenderer: Can't change size while VR device is presenting.");return}it=y,J=D,t.width=Math.floor(y*te),t.height=Math.floor(D*te),W===!0&&(t.style.width=y+"px",t.style.height=D+"px"),w!==null&&w.setSize(t.width,t.height),this.setViewport(0,0,y,D)},this.getDrawingBufferSize=function(y){return y.set(it*te,J*te).floor()},this.setDrawingBufferSize=function(y,D,W){it=y,J=D,te=W,t.width=Math.floor(y*W),t.height=Math.floor(D*W),this.setViewport(0,0,y,D)},this.setEffects=function(y){if(S===_i){pt("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(y){for(let D=0;D<y.length;D++)if(y[D].isOutputPass===!0){Ze("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}w.setEffects(y||[])},this.getCurrentViewport=function(y){return y.copy(j)},this.getViewport=function(y){return y.copy(Te)},this.setViewport=function(y,D,W,H){y.isVector4?Te.set(y.x,y.y,y.z,y.w):Te.set(y,D,W,H),v.viewport(j.copy(Te).multiplyScalar(te).round())},this.getScissor=function(y){return y.copy(Ye)},this.setScissor=function(y,D,W,H){y.isVector4?Ye.set(y.x,y.y,y.z,y.w):Ye.set(y,D,W,H),v.scissor(Ne.copy(Ye).multiplyScalar(te).round())},this.getScissorTest=function(){return St},this.setScissorTest=function(y){v.setScissorTest(St=y)},this.setOpaqueSort=function(y){Se=y},this.setTransparentSort=function(y){qe=y},this.getClearColor=function(y){return y.copy(nt.getClearColor())},this.setClearColor=function(){nt.setClearColor(...arguments)},this.getClearAlpha=function(){return nt.getClearAlpha()},this.setClearAlpha=function(){nt.setClearAlpha(...arguments)},this.clear=function(y=!0,D=!0,W=!0){let H=0;if(y){let z=!1;if(ne!==null){const be=ne.texture.format;z=p.has(be)}if(z){const be=ne.texture.type,Ce=m.has(be),Me=nt.getClearColor(),Ie=nt.getClearAlpha(),Fe=Me.r,st=Me.g,ct=Me.b;Ce?(M[0]=Fe,M[1]=st,M[2]=ct,M[3]=Ie,L.clearBufferuiv(L.COLOR,0,M)):(T[0]=Fe,T[1]=st,T[2]=ct,T[3]=Ie,L.clearBufferiv(L.COLOR,0,T))}else H|=L.COLOR_BUFFER_BIT}D&&(H|=L.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),W&&(H|=L.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),H!==0&&L.clear(H)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(y){y.setRenderer(this),N=y},this.dispose=function(){t.removeEventListener("webglcontextlost",Ct,!1),t.removeEventListener("webglcontextrestored",_t,!1),t.removeEventListener("webglcontextcreationerror",Ti,!1),nt.dispose(),_e.dispose(),ge.dispose(),G.dispose(),ce.dispose(),ee.dispose(),we.dispose(),se.dispose(),me.dispose(),ke.dispose(),ke.removeEventListener("sessionstart",Ec),ke.removeEventListener("sessionend",Tc),Pn.stop()};function Ct(y){y.preventDefault(),Ma("WebGLRenderer: Context Lost."),I=!0}function _t(){Ma("WebGLRenderer: Context Restored."),I=!1;const y=F.autoReset,D=We.enabled,W=We.autoUpdate,H=We.needsUpdate,z=We.type;He(),F.autoReset=y,We.enabled=D,We.autoUpdate=W,We.needsUpdate=H,We.type=z}function Ti(y){pt("WebGLRenderer: A WebGL context could not be created. Reason: ",y.statusMessage)}function ki(y){const D=y.target;D.removeEventListener("dispose",ki),Wd(D)}function Wd(y){Xd(y),G.remove(y)}function Xd(y){const D=G.get(y).programs;D!==void 0&&(D.forEach(function(W){me.releaseProgram(W)}),y.isShaderMaterial&&me.releaseShaderCache(y))}this.renderBufferDirect=function(y,D,W,H,z,be){D===null&&(D=ze);const Ce=z.isMesh&&z.matrixWorld.determinantAffine()<0,Me=Kd(y,D,W,H,z);v.setMaterial(H,Ce);let Ie=W.index,Fe=1;if(H.wireframe===!0){if(Ie=Y.getWireframeAttribute(W),Ie===void 0)return;Fe=2}const st=W.drawRange,ct=W.attributes.position;let De=st.start*Fe,yt=(st.start+st.count)*Fe;be!==null&&(De=Math.max(De,be.start*Fe),yt=Math.min(yt,(be.start+be.count)*Fe)),Ie!==null?(De=Math.max(De,0),yt=Math.min(yt,Ie.count)):ct!=null&&(De=Math.max(De,0),yt=Math.min(yt,ct.count));const zt=yt-De;if(zt<0||zt===1/0)return;we.setup(z,H,Me,W,Ie);let Rt,At=ve;if(Ie!==null&&(Rt=ue.get(Ie),At=Z,At.setIndex(Rt)),z.isMesh)H.wireframe===!0?(v.setLineWidth(H.wireframeLinewidth*et()),At.setMode(L.LINES)):At.setMode(L.TRIANGLES);else if(z.isLine){let Jt=H.linewidth;Jt===void 0&&(Jt=1),v.setLineWidth(Jt*et()),z.isLineSegments?At.setMode(L.LINES):z.isLineLoop?At.setMode(L.LINE_LOOP):At.setMode(L.LINE_STRIP)}else z.isPoints?At.setMode(L.POINTS):z.isSprite&&At.setMode(L.TRIANGLES);if(z.isBatchedMesh)if(lt.get("WEBGL_multi_draw"))At.renderMultiDraw(z._multiDrawStarts,z._multiDrawCounts,z._multiDrawCount);else{const Jt=z._multiDrawStarts,Ae=z._multiDrawCounts,ni=z._multiDrawCount,mt=Ie?ue.get(Ie).bytesPerElement:1,Si=G.get(H).currentProgram.getUniforms();for(let Ui=0;Ui<ni;Ui++)Si.setValue(L,"_gl_DrawID",Ui),At.render(Jt[Ui]/mt,Ae[Ui])}else if(z.isInstancedMesh)At.renderInstances(De,zt,z.count);else if(W.isInstancedBufferGeometry){const Jt=W._maxInstanceCount!==void 0?W._maxInstanceCount:1/0,Ae=Math.min(W.instanceCount,Jt);At.renderInstances(De,zt,Ae)}else At.render(De,zt)};function wc(y,D,W,H){N!==null&&y.isNodeMaterial&&N.setObject(H,y),re===!0&&Be.setState(y,W,!1),y.transparent===!0&&y.side===li&&y.forceSinglePass===!1?(y.side=ti,y.needsUpdate=!0,_r(y,D,H),y.side=Hn,y.needsUpdate=!0,_r(y,D,H),y.side=li):_r(y,D,H)}this.compile=function(y,D,W=null){W===null&&(W=y),N!==null&&N.renderStart(y,D,W),E=ge.get(W),E.init(D),x.push(E),W.traverseVisible(function(z){z.isLight&&z.layers.test(D.layers)&&(E.pushLight(z),z.castShadow&&E.pushShadow(z))}),y!==W&&y.traverseVisible(function(z){z.isLight&&z.layers.test(D.layers)&&(E.pushLight(z),z.castShadow&&E.pushShadow(z))}),E.setupLights(),N!==null&&N.updateLights(E.state.lightsArray),oe=this.localClippingEnabled,re=Be.init(this.clippingPlanes,oe),re===!0&&Be.setGlobalState(this.clippingPlanes,D),N!==null&&We.render(E.state.shadowsArray,W,D);const H=new Set;return y.traverse(function(z){if(!(z.isMesh||z.isPoints||z.isLine||z.isSprite))return;const be=z.material;if(be)if(Array.isArray(be))for(let Ce=0;Ce<be.length;Ce++){const Me=be[Ce];wc(Me,W,D,z),H.add(Me)}else wc(be,W,D,z),H.add(be)}),E=x.pop(),N!==null&&N.renderEnd(),H},this.compileAsync=function(y,D,W=null){const H=this.compile(y,D,W);return new Promise(z=>{function be(){if(H.forEach(function(Ce){const Ie=G.get(Ce).currentProgram;(Ie===void 0||Ie.isReady())&&H.delete(Ce)}),H.size===0){z(y);return}setTimeout(be,10)}lt.get("KHR_parallel_shader_compile")!==null?be():setTimeout(be,10)})};let Fa=null;function qd(y){Fa&&Fa(y)}function Ec(){Pn.stop()}function Tc(){Pn.start()}const Pn=new cd;Pn.setAnimationLoop(qd),typeof self<"u"&&Pn.setContext(self),this.setAnimationLoop=function(y){Fa=y,ke.setAnimationLoop(y),y===null?Pn.stop():Pn.start()},ke.addEventListener("sessionstart",Ec),ke.addEventListener("sessionend",Tc),this.render=function(y,D){if(D!==void 0&&D.isCamera!==!0){pt("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(I===!0)return;N!==null&&N.renderStart(y,D);const W=ke.enabled===!0&&ke.isPresenting===!0,H=w!==null&&(ne===null||W)&&w.begin(C,ne);if(y.matrixWorldAutoUpdate===!0&&y.updateMatrixWorld(),D.parent===null&&D.matrixWorldAutoUpdate===!0&&D.updateMatrixWorld(),ke.enabled===!0&&ke.isPresenting===!0&&(w===null||w.isCompositing()===!1)&&(ke.cameraAutoUpdate===!0&&ke.updateCamera(D),D=ke.getCamera()),y.isScene===!0&&y.onBeforeRender(C,y,D,ne),E=ge.get(y,x.length),E.init(D),E.state.textureUnits=$.getTextureUnits(),x.push(E),le.multiplyMatrices(D.projectionMatrix,D.matrixWorldInverse),ie.setFromProjectionMatrix(le,Gi,D.reversedDepth),oe=this.localClippingEnabled,re=Be.init(this.clippingPlanes,oe),b=_e.get(y,P.length),b.init(),P.push(b),ke.enabled===!0&&ke.isPresenting===!0){const Ce=C.xr.getDepthSensingMesh();Ce!==null&&Oa(Ce,D,-1/0,C.sortObjects)}Oa(y,D,0,C.sortObjects),b.finish(),N!==null&&N.updateLights(E.state.lightsArray),C.sortObjects===!0&&b.sort(Se,qe),Je=ke.enabled===!1||ke.isPresenting===!1||ke.hasDepthSensing()===!1,Je&&nt.addToRenderList(b,y),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),re===!0&&Be.beginShadows();const z=E.state.shadowsArray;if(We.render(z,y,D),re===!0&&Be.endShadows(),(H&&w.hasRenderPass())===!1){const Ce=b.opaque,Me=b.transmissive;if(E.setupLights(),D.isArrayCamera){const Ie=D.cameras;if(Me.length>0)for(let Fe=0,st=Ie.length;Fe<st;Fe++){const ct=Ie[Fe];Cc(Ce,Me,y,ct)}Je&&nt.render(y);for(let Fe=0,st=Ie.length;Fe<st;Fe++){const ct=Ie[Fe];Ac(b,y,ct,ct.viewport)}}else Me.length>0&&Cc(Ce,Me,y,D),Je&&nt.render(y),Ac(b,y,D)}ne!==null&&V===0&&($.updateMultisampleRenderTarget(ne),$.updateRenderTargetMipmap(ne)),H&&w.end(C),y.isScene===!0&&y.onAfterRender(C,y,D),we.resetDefaultState(),X=-1,Q=null,x.pop(),x.length>0?(E=x[x.length-1],$.setTextureUnits(E.state.textureUnits),re===!0&&Be.setGlobalState(C.clippingPlanes,E.state.camera)):E=null,P.pop(),P.length>0?b=P[P.length-1]:b=null,N!==null&&N.renderEnd()};function Oa(y,D,W,H){if(y.visible===!1)return;if(y.layers.test(D.layers)){if(y.isGroup)W=y.renderOrder;else if(y.isLOD)y.autoUpdate===!0&&y.update(D);else if(y.isLightProbeGrid)E.pushLightProbeGrid(y);else if(y.isLight)E.pushLight(y),y.castShadow&&E.pushShadow(y);else if(y.isSprite){if(!y.frustumCulled||y.intersectsFrustum(ie)){H&&Ve.setFromMatrixPosition(y.matrixWorld).applyMatrix4(le);const Ce=ee.update(y),Me=y.material;Me.visible&&b.push(y,Ce,Me,W,Ve.z,null,D)}}else if((y.isMesh||y.isLine||y.isPoints)&&(!y.frustumCulled||y.intersectsFrustum(ie))){const Ce=ee.update(y),Me=y.material;if(H&&(y.boundingSphere!==void 0?(y.boundingSphere===null&&y.computeBoundingSphere(),Ve.copy(y.boundingSphere.center)):(Ce.boundingSphere===null&&Ce.computeBoundingSphere(),Ve.copy(Ce.boundingSphere.center)),Ve.applyMatrix4(y.matrixWorld).applyMatrix4(le)),Array.isArray(Me)){const Ie=Ce.groups;for(let Fe=0,st=Ie.length;Fe<st;Fe++){const ct=Ie[Fe],De=Me[ct.materialIndex];De&&De.visible&&b.push(y,Ce,De,W,Ve.z,ct,D)}}else Me.visible&&b.push(y,Ce,Me,W,Ve.z,null,D)}}const be=y.children;for(let Ce=0,Me=be.length;Ce<Me;Ce++)Oa(be[Ce],D,W,H)}function Ac(y,D,W,H){const{opaque:z,transmissive:be,transparent:Ce}=y;E.setupLightsView(W),re===!0&&Be.setGlobalState(C.clippingPlanes,W),H&&v.viewport(j.copy(H)),z.length>0&&xr(z,D,W),be.length>0&&xr(be,D,W),Ce.length>0&&xr(Ce,D,W),v.buffers.depth.setTest(!0),v.buffers.depth.setMask(!0),v.buffers.color.setMask(!0),v.setPolygonOffset(!1)}function Cc(y,D,W,H){if((W.isScene===!0?W.overrideMaterial:null)!==null)return;if(E.state.transmissionRenderTarget[H.id]===void 0){const De=lt.has("EXT_color_buffer_half_float")||lt.has("EXT_color_buffer_float");E.state.transmissionRenderTarget[H.id]=new Ii(1,1,{generateMipmaps:!0,type:De?qi:_i,minFilter:Fn,samples:Math.max(4,A.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:dt.workingColorSpace})}const be=E.state.transmissionRenderTarget[H.id],Ce=H.viewport||j;be.setSize(Ce.z*C.transmissionResolutionScale,Ce.w*C.transmissionResolutionScale);const Me=C.getRenderTarget(),Ie=C.getActiveCubeFace(),Fe=C.getActiveMipmapLevel();C.setRenderTarget(be),C.getClearColor(Qe),Ke=C.getClearAlpha(),Ke<1&&C.setClearColor(16777215,.5),C.clear(),Je&&nt.render(W);const st=C.toneMapping;C.toneMapping=Vi;const ct=H.viewport;if(H.viewport!==void 0&&(H.viewport=void 0),E.setupLightsView(H),re===!0&&Be.setGlobalState(C.clippingPlanes,H),xr(y,W,H),$.updateMultisampleRenderTarget(be),$.updateRenderTargetMipmap(be),lt.has("WEBGL_multisampled_render_to_texture")===!1){let De=!1;for(let yt=0,zt=D.length;yt<zt;yt++){const Rt=D[yt],{object:At,geometry:Jt,material:Ae,group:ni}=Rt;if(Ae.side===li&&At.layers.test(H.layers)){const mt=Ae.side;Ae.side=ti,Ae.needsUpdate=!0,Pc(At,W,H,Jt,Ae,ni),Ae.side=mt,Ae.needsUpdate=!0,De=!0}}De===!0&&($.updateMultisampleRenderTarget(be),$.updateRenderTargetMipmap(be))}C.setRenderTarget(Me,Ie,Fe),C.setClearColor(Qe,Ke),ct!==void 0&&(H.viewport=ct),C.toneMapping=st}function xr(y,D,W){const H=D.isScene===!0?D.overrideMaterial:null;for(let z=0,be=y.length;z<be;z++){const Ce=y[z],{object:Me,geometry:Ie,group:Fe}=Ce;let st=Ce.material;st.allowOverride===!0&&H!==null&&(st=H),Me.layers.test(W.layers)&&Pc(Me,D,W,Ie,st,Fe)}}function Pc(y,D,W,H,z,be){N!==null&&z.isNodeMaterial&&N.setObject(y,z),y.onBeforeRender(C,D,W,H,z,be),y.modelViewMatrix.multiplyMatrices(W.matrixWorldInverse,y.matrixWorld),y.normalMatrix.getNormalMatrix(y.modelViewMatrix),z.onBeforeRender(C,D,W,H,y,be),z.transparent===!0&&z.side===li&&z.forceSinglePass===!1?(z.side=ti,z.needsUpdate=!0,C.renderBufferDirect(W,D,H,z,y,be),z.side=Hn,z.needsUpdate=!0,C.renderBufferDirect(W,D,H,z,y,be),z.side=li):C.renderBufferDirect(W,D,H,z,y,be),y.onAfterRender(C,D,W,H,z,be)}function _r(y,D,W){D.isScene!==!0&&(D=ze);const H=G.get(y),z=E.state.lights,be=E.state.shadowsArray,Ce=z.state.version,Me=me.getParameters(y,z.state,be,D,W,E.state.lightProbeGridArray),Ie=me.getProgramCacheKey(Me);let Fe=H.programs;H.environment=y.isMeshStandardMaterial||y.isMeshLambertMaterial||y.isMeshPhongMaterial?D.environment:null,H.fog=D.fog;const st=y.isMeshStandardMaterial||y.isMeshLambertMaterial&&!y.envMap||y.isMeshPhongMaterial&&!y.envMap;H.envMap=ce.get(y.envMap||H.environment,st),H.envMapRotation=H.environment!==null&&y.envMap===null?D.environmentRotation:y.envMapRotation,Fe===void 0&&(y.addEventListener("dispose",ki),Fe=new Map,H.programs=Fe);let ct=Fe.get(Ie);if(ct!==void 0){if(H.currentProgram===ct&&H.lightsStateVersion===Ce)return Lc(y,Me),ct}else Me.uniforms=me.getUniforms(y),N!==null&&y.isNodeMaterial&&N.build(y,W,Me),y.onBeforeCompile(Me,C),ct=me.acquireProgram(Me,Ie),Fe.set(Ie,ct),H.uniforms=Me.uniforms;const De=H.uniforms;return(!y.isShaderMaterial&&!y.isRawShaderMaterial||y.clipping===!0)&&(De.clippingPlanes=Be.uniform),Lc(y,Me),H.needsLights=Jd(y),H.lightsStateVersion=Ce,H.needsLights&&(De.ambientLightColor.value=z.state.ambient,De.lightProbe.value=z.state.probe,De.sunLights.value=z.state.sun,De.sunLightShadows.value=z.state.sunShadow,De.directionalLights.value=z.state.directional,De.directionalLightShadows.value=z.state.directionalShadow,De.spotLights.value=z.state.spot,De.spotLightShadows.value=z.state.spotShadow,De.rectAreaLights.value=z.state.rectArea,De.ltc_1.value=z.state.rectAreaLTC1,De.ltc_2.value=z.state.rectAreaLTC2,De.pointLights.value=z.state.point,De.pointLightShadows.value=z.state.pointShadow,De.hemisphereLights.value=z.state.hemi,De.sunShadowMatrix.value=z.state.sunShadowMatrix,De.sunShadowCascade.value=z.state.sunShadowCascade,De.directionalShadowMatrix.value=z.state.directionalShadowMatrix,De.spotLightMatrix.value=z.state.spotLightMatrix,De.spotLightMap.value=z.state.spotLightMap,De.pointShadowMatrix.value=z.state.pointShadowMatrix),H.lightProbeGrid=E.state.lightProbeGridArray.length>0,H.currentProgram=ct,H.uniformsList=null,ct}function Rc(y){if(y.uniformsList===null){const D=y.currentProgram.getUniforms();y.uniformsList=ha.seqWithValue(D.seq,y.uniforms)}return y.uniformsList}function Lc(y,D){const W=G.get(y);W.outputColorSpace=D.outputColorSpace,W.batching=D.batching,W.batchingColor=D.batchingColor,W.instancing=D.instancing,W.instancingColor=D.instancingColor,W.instancingMorph=D.instancingMorph,W.skinning=D.skinning,W.morphTargets=D.morphTargets,W.morphNormals=D.morphNormals,W.morphColors=D.morphColors,W.morphTargetsCount=D.morphTargetsCount,W.numClippingPlanes=D.numClippingPlanes,W.numIntersection=D.numClipIntersection,W.vertexAlphas=D.vertexAlphas,W.vertexTangents=D.vertexTangents,W.toneMapping=D.toneMapping}function $d(y,D){if(y.length===0)return null;if(y.length===1)return y[0].texture!==null?y[0]:null;_.setFromMatrixPosition(D.matrixWorld);for(let W=0,H=y.length;W<H;W++){const z=y[W];if(z.texture!==null&&z.boundingBox.containsPoint(_))return z}return null}function Kd(y,D,W,H,z){D.isScene!==!0&&(D=ze),$.resetTextureUnits();const be=D.fog,Ce=H.isMeshStandardMaterial||H.isMeshLambertMaterial||H.isMeshPhongMaterial?D.environment:null,Me=ne===null?C.outputColorSpace:ne.isXRRenderTarget===!0?ne.texture.colorSpace:dt.workingColorSpace,Ie=H.isMeshStandardMaterial||H.isMeshLambertMaterial&&!H.envMap||H.isMeshPhongMaterial&&!H.envMap,Fe=ce.get(H.envMap||Ce,Ie),st=H.vertexColors===!0&&!!W.attributes.color&&W.attributes.color.itemSize===4,ct=!!W.attributes.tangent&&(!!H.normalMap||H.anisotropy>0),De=!!W.morphAttributes.position,yt=!!W.morphAttributes.normal,zt=!!W.morphAttributes.color;let Rt=Vi;H.toneMapped&&(ne===null||ne.isXRRenderTarget===!0)&&(Rt=C.toneMapping);const At=W.morphAttributes.position||W.morphAttributes.normal||W.morphAttributes.color,Jt=At!==void 0?At.length:0,Ae=G.get(H),ni=E.state.lights;if(re===!0&&(oe===!0||y!==Q)){const Pt=y===Q&&H.id===X;Be.setState(H,y,Pt)}let mt=!1;H.version===Ae.__version?(Ae.needsLights&&Ae.lightsStateVersion!==ni.state.version||Ae.outputColorSpace!==Me||z.isBatchedMesh&&Ae.batching===!1||!z.isBatchedMesh&&Ae.batching===!0||z.isBatchedMesh&&Ae.batchingColor===!0&&z._colorsTexture===null||z.isBatchedMesh&&Ae.batchingColor===!1&&z._colorsTexture!==null||z.isInstancedMesh&&Ae.instancing===!1||!z.isInstancedMesh&&Ae.instancing===!0||z.isSkinnedMesh&&Ae.skinning===!1||!z.isSkinnedMesh&&Ae.skinning===!0||z.isInstancedMesh&&Ae.instancingColor===!0&&z.instanceColor===null||z.isInstancedMesh&&Ae.instancingColor===!1&&z.instanceColor!==null||z.isInstancedMesh&&Ae.instancingMorph===!0&&z.morphTexture===null||z.isInstancedMesh&&Ae.instancingMorph===!1&&z.morphTexture!==null||Ae.envMap!==Fe||H.fog===!0&&Ae.fog!==be||Ae.numClippingPlanes!==void 0&&(Ae.numClippingPlanes!==Be.numPlanes||Ae.numIntersection!==Be.numIntersection)||Ae.vertexAlphas!==st||Ae.vertexTangents!==ct||Ae.morphTargets!==De||Ae.morphNormals!==yt||Ae.morphColors!==zt||Ae.toneMapping!==Rt||Ae.morphTargetsCount!==Jt||!!Ae.lightProbeGrid!=E.state.lightProbeGridArray.length>0)&&(mt=!0):(mt=!0,Ae.__version=H.version);let Si=Ae.currentProgram;mt===!0&&(Si=_r(H,D,z),N&&H.isNodeMaterial&&N.onUpdateProgram(H,Si,Ae));let Ui=!1,pn=!1,Kn=!1;const wt=Si.getUniforms(),Bt=Ae.uniforms;if(v.useProgram(Si.program)&&(Ui=!0,pn=!0,Kn=!0),H.id!==X&&(X=H.id,pn=!0),Ae.needsLights){const Pt=$d(E.state.lightProbeGridArray,z);Ae.lightProbeGrid!==Pt&&(Ae.lightProbeGrid=Pt,pn=!0)}if(Ui||Q!==y){v.buffers.depth.getReversed()&&y.reversedDepth!==!0&&(y._reversedDepth=!0,y.updateProjectionMatrix()),wt.setValue(L,"projectionMatrix",y.projectionMatrix),wt.setValue(L,"viewMatrix",y.matrixWorldInverse);const gn=wt.map.cameraPosition;gn!==void 0&&gn.setValue(L,de.setFromMatrixPosition(y.matrixWorld)),A.logarithmicDepthBuffer&&wt.setValue(L,"logDepthBufFC",2/(Math.log(y.far+1)/Math.LN2)),(H.isMeshPhongMaterial||H.isMeshToonMaterial||H.isMeshLambertMaterial||H.isMeshBasicMaterial||H.isMeshStandardMaterial||H.isShaderMaterial)&&wt.setValue(L,"isOrthographic",y.isOrthographicCamera===!0),Q!==y&&(Q=y,pn=!0,Kn=!0)}if(Ae.needsLights&&(ni.state.sunShadowMap.length>0&&wt.setValue(L,"sunShadowMap",ni.state.sunShadowMap,$),ni.state.directionalShadowMap.length>0&&wt.setValue(L,"directionalShadowMap",ni.state.directionalShadowMap,$),ni.state.spotShadowMap.length>0&&wt.setValue(L,"spotShadowMap",ni.state.spotShadowMap,$),ni.state.pointShadowMap.length>0&&wt.setValue(L,"pointShadowMap",ni.state.pointShadowMap,$)),z.isSkinnedMesh){wt.setOptional(L,z,"bindMatrix"),wt.setOptional(L,z,"bindMatrixInverse");const Pt=z.skeleton;Pt&&(Pt.boneTexture===null&&Pt.computeBoneTexture(),wt.setValue(L,"boneTexture",Pt.boneTexture,$))}z.isBatchedMesh&&(wt.setOptional(L,z,"batchingTexture"),wt.setValue(L,"batchingTexture",z._matricesTexture,$),wt.setOptional(L,z,"batchingIdTexture"),wt.setValue(L,"batchingIdTexture",z._indirectTexture,$),wt.setOptional(L,z,"batchingColorTexture"),z._colorsTexture!==null&&wt.setValue(L,"batchingColorTexture",z._colorsTexture,$));const mn=W.morphAttributes;if((mn.position!==void 0||mn.normal!==void 0||mn.color!==void 0)&&k.update(z,W,Si),(pn||Ae.receiveShadow!==z.receiveShadow)&&(Ae.receiveShadow=z.receiveShadow,wt.setValue(L,"receiveShadow",z.receiveShadow)),(H.isMeshStandardMaterial||H.isMeshLambertMaterial||H.isMeshPhongMaterial)&&H.envMap===null&&D.environment!==null&&(Bt.envMapIntensity.value=D.environmentIntensity),Bt.dfgLUT!==void 0&&(Bt.dfgLUT.value=px()),pn){if(wt.setValue(L,"toneMappingExposure",C.toneMappingExposure),Ae.needsLights&&Yd(Bt,Kn),be&&H.fog===!0&&Oe.refreshFogUniforms(Bt,be),Oe.refreshMaterialUniforms(Bt,H,te,J,E.state.transmissionRenderTarget[y.id]),Ae.needsLights&&Ae.lightProbeGrid){const Pt=Ae.lightProbeGrid;Bt.probesSH.value=Pt.texture,Bt.probesMin.value.copy(Pt.boundingBox.min),Bt.probesMax.value.copy(Pt.boundingBox.max),Bt.probesResolution.value.copy(Pt.resolution)}ha.upload(L,Rc(Ae),Bt,$)}if(H.isShaderMaterial&&H.uniformsNeedUpdate===!0&&(ha.upload(L,Rc(Ae),Bt,$),H.uniformsNeedUpdate=!1),H.isSpriteMaterial&&wt.setValue(L,"center",z.center),wt.setValue(L,"modelViewMatrix",z.modelViewMatrix),wt.setValue(L,"normalMatrix",z.normalMatrix),wt.setValue(L,"modelMatrix",z.matrixWorld),H.uniformsGroups!==void 0){const Pt=H.uniformsGroups;for(let gn=0,Yn=Pt.length;gn<Yn;gn++){const Dc=Pt[gn];se.update(Dc,Si),se.bind(Dc,Si)}}return Si}function Yd(y,D){y.ambientLightColor.needsUpdate=D,y.lightProbe.needsUpdate=D,y.sunLights.needsUpdate=D,y.sunLightShadows.needsUpdate=D,y.directionalLights.needsUpdate=D,y.directionalLightShadows.needsUpdate=D,y.pointLights.needsUpdate=D,y.pointLightShadows.needsUpdate=D,y.spotLights.needsUpdate=D,y.spotLightShadows.needsUpdate=D,y.rectAreaLights.needsUpdate=D,y.hemisphereLights.needsUpdate=D}function Jd(y){return y.isMeshLambertMaterial||y.isMeshToonMaterial||y.isMeshPhongMaterial||y.isMeshStandardMaterial||y.isShadowMaterial||y.isShaderMaterial&&y.lights===!0}this.getActiveCubeFace=function(){return K},this.getActiveMipmapLevel=function(){return V},this.getRenderTarget=function(){return ne},this.setRenderTargetTextures=function(y,D,W){const H=G.get(y);H.__autoAllocateDepthBuffer=y.resolveDepthBuffer===!1,H.__autoAllocateDepthBuffer===!1&&(H.__useRenderToTexture=!1),G.get(y.texture).__webglTexture=D,G.get(y.depthTexture).__webglTexture=H.__autoAllocateDepthBuffer?void 0:W,H.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(y,D){const W=G.get(y);W.__webglFramebuffer=D,W.__useDefaultFramebuffer=D===void 0},this.setRenderTarget=function(y,D=0,W=0){ne=y,K=D,V=W;let H=null,z=!1,be=!1;if(y){const Me=G.get(y);if(Me.__useDefaultFramebuffer!==void 0){v.bindFramebuffer(L.FRAMEBUFFER,Me.__webglFramebuffer),j.copy(y.viewport),Ne.copy(y.scissor),he=y.scissorTest,v.viewport(j),v.scissor(Ne),v.setScissorTest(he),X=-1;return}else if(Me.__webglFramebuffer===void 0)$.setupRenderTarget(y);else if(Me.__hasExternalTextures)$.rebindTextures(y,G.get(y.texture).__webglTexture,G.get(y.depthTexture).__webglTexture);else if(y.depthBuffer){const st=y.depthTexture;if(Me.__boundDepthTexture!==st){if(st!==null&&G.has(st)&&(y.width!==st.image.width||y.height!==st.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");$.setupDepthRenderbuffer(y)}}const Ie=y.texture;(Ie.isData3DTexture||Ie.isDataArrayTexture||Ie.isCompressedArrayTexture)&&(be=!0);const Fe=G.get(y).__webglFramebuffer;y.isWebGLCubeRenderTarget?(Array.isArray(Fe[D])?H=Fe[D][W]:H=Fe[D],z=!0):y.samples>0&&$.useMultisampledRTT(y)===!1?H=G.get(y).__webglMultisampledFramebuffer:Array.isArray(Fe)?H=Fe[W]:H=Fe,j.copy(y.viewport),Ne.copy(y.scissor),he=y.scissorTest}else j.copy(Te).multiplyScalar(te).floor(),Ne.copy(Ye).multiplyScalar(te).floor(),he=St;if(W!==0&&(H=B),v.bindFramebuffer(L.FRAMEBUFFER,H)&&v.drawBuffers(y,H),v.viewport(j),v.scissor(Ne),v.setScissorTest(he),z){const Me=G.get(y.texture);L.framebufferTexture2D(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_CUBE_MAP_POSITIVE_X+D,Me.__webglTexture,W)}else if(be){const Me=D;for(let Ie=0;Ie<y.textures.length;Ie++){const Fe=G.get(y.textures[Ie]);L.framebufferTextureLayer(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0+Ie,Fe.__webglTexture,W,Me)}}else if(y!==null&&W!==0){const Me=G.get(y.texture);L.framebufferTexture2D(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_2D,Me.__webglTexture,W)}X=-1};function Ic(y){const D=G.get(y);return(D.__readFormat!==y.format||D.__readType!==y.type)&&(D.__readFormat=y.format,D.__readType=y.type,D.__formatReadable=A.textureFormatReadable(y.format),D.__typeReadable=A.textureTypeReadable(y.type)),D}this.readRenderTargetPixels=function(y,D,W,H,z,be,Ce,Me=0){if(!(y&&y.isWebGLRenderTarget)){pt("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ie=G.get(y).__webglFramebuffer;if(y.isWebGLCubeRenderTarget&&Ce!==void 0&&(Ie=Ie[Ce]),Ie){v.bindFramebuffer(L.FRAMEBUFFER,Ie);try{const Fe=y.textures[Me],st=Fe.format,ct=Fe.type;y.textures.length>1&&L.readBuffer(L.COLOR_ATTACHMENT0+Me);const De=Ic(Fe);if(De.__formatReadable===!1){pt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(De.__typeReadable===!1){pt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}D>=0&&D<=y.width-H&&W>=0&&W<=y.height-z&&L.readPixels(D,W,H,z,xe.convert(st),xe.convert(ct),be)}finally{const Fe=ne!==null?G.get(ne).__webglFramebuffer:null;v.bindFramebuffer(L.FRAMEBUFFER,Fe)}}},this.readRenderTargetPixelsAsync=async function(y,D,W,H,z,be,Ce,Me=0){if(!(y&&y.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Ie=G.get(y).__webglFramebuffer;if(y.isWebGLCubeRenderTarget&&Ce!==void 0&&(Ie=Ie[Ce]),Ie)if(D>=0&&D<=y.width-H&&W>=0&&W<=y.height-z){v.bindFramebuffer(L.FRAMEBUFFER,Ie);const Fe=y.textures[Me],st=Fe.format,ct=Fe.type;y.textures.length>1&&L.readBuffer(L.COLOR_ATTACHMENT0+Me);const De=Ic(Fe);if(De.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(De.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const yt=L.createBuffer();L.bindBuffer(L.PIXEL_PACK_BUFFER,yt),L.bufferData(L.PIXEL_PACK_BUFFER,be.byteLength,L.STREAM_READ),L.readPixels(D,W,H,z,xe.convert(st),xe.convert(ct),0),L.bindBuffer(L.PIXEL_PACK_BUFFER,null);const zt=ne!==null?G.get(ne).__webglFramebuffer:null;v.bindFramebuffer(L.FRAMEBUFFER,zt);const Rt=L.fenceSync(L.SYNC_GPU_COMMANDS_COMPLETE,0);return L.flush(),await Qf(L,Rt,4),L.bindBuffer(L.PIXEL_PACK_BUFFER,yt),L.getBufferSubData(L.PIXEL_PACK_BUFFER,0,be),L.bindBuffer(L.PIXEL_PACK_BUFFER,null),L.deleteBuffer(yt),L.deleteSync(Rt),be}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(y,D=null,W=0){const H=Math.pow(2,-W),z=Math.floor(y.image.width*H),be=Math.floor(y.image.height*H),Ce=D!==null?D.x:0,Me=D!==null?D.y:0;$.setTexture2D(y,0),L.copyTexSubImage2D(L.TEXTURE_2D,W,0,0,Ce,Me,z,be),v.unbindTexture()},this.copyTextureToTexture=function(y,D,W=null,H=null,z=0,be=0){let Ce,Me,Ie,Fe,st,ct,De,yt,zt;const Rt=y.isCompressedTexture?y.mipmaps[be]:y.image;if(W!==null)Ce=W.max.x-W.min.x,Me=W.max.y-W.min.y,Ie=W.isBox3?W.max.z-W.min.z:1,Fe=W.min.x,st=W.min.y,ct=W.isBox3?W.min.z:0;else{const Bt=Math.pow(2,-z);Ce=Math.floor(Rt.width*Bt),Me=Math.floor(Rt.height*Bt),y.isDataArrayTexture?Ie=Rt.depth:y.isData3DTexture?Ie=Math.floor(Rt.depth*Bt):Ie=1,Fe=0,st=0,ct=0}H!==null?(De=H.x,yt=H.y,zt=H.z):(De=0,yt=0,zt=0);const At=xe.convert(D.format),Jt=xe.convert(D.type);let Ae;D.isData3DTexture?($.setTexture3D(D,0),Ae=L.TEXTURE_3D):D.isDataArrayTexture||D.isCompressedArrayTexture?($.setTexture2DArray(D,0),Ae=L.TEXTURE_2D_ARRAY):($.setTexture2D(D,0),Ae=L.TEXTURE_2D),v.activeTexture(L.TEXTURE0),v.pixelStorei(L.UNPACK_FLIP_Y_WEBGL,D.flipY),v.pixelStorei(L.UNPACK_PREMULTIPLY_ALPHA_WEBGL,D.premultiplyAlpha),v.pixelStorei(L.UNPACK_ALIGNMENT,D.unpackAlignment);const ni=v.getParameter(L.UNPACK_ROW_LENGTH),mt=v.getParameter(L.UNPACK_IMAGE_HEIGHT),Si=v.getParameter(L.UNPACK_SKIP_PIXELS),Ui=v.getParameter(L.UNPACK_SKIP_ROWS),pn=v.getParameter(L.UNPACK_SKIP_IMAGES);v.pixelStorei(L.UNPACK_ROW_LENGTH,Rt.width),v.pixelStorei(L.UNPACK_IMAGE_HEIGHT,Rt.height),v.pixelStorei(L.UNPACK_SKIP_PIXELS,Fe),v.pixelStorei(L.UNPACK_SKIP_ROWS,st),v.pixelStorei(L.UNPACK_SKIP_IMAGES,ct);const Kn=y.isDataArrayTexture||y.isData3DTexture,wt=D.isDataArrayTexture||D.isData3DTexture;if(y.isDepthTexture){const Bt=G.get(y),mn=G.get(D),Pt=G.get(Bt.__renderTarget),gn=G.get(mn.__renderTarget);v.bindFramebuffer(L.READ_FRAMEBUFFER,Pt.__webglFramebuffer),v.bindFramebuffer(L.DRAW_FRAMEBUFFER,gn.__webglFramebuffer);for(let Yn=0;Yn<Ie;Yn++)Kn&&(L.framebufferTextureLayer(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,G.get(y).__webglTexture,z,ct+Yn),L.framebufferTextureLayer(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,G.get(D).__webglTexture,be,zt+Yn)),L.blitFramebuffer(Fe,st,Ce,Me,De,yt,Ce,Me,L.DEPTH_BUFFER_BIT,L.NEAREST);v.bindFramebuffer(L.READ_FRAMEBUFFER,null),v.bindFramebuffer(L.DRAW_FRAMEBUFFER,null)}else if(z!==0||y.isRenderTargetTexture||G.has(y)){const Bt=G.get(y),mn=G.get(D);v.bindFramebuffer(L.READ_FRAMEBUFFER,U),v.bindFramebuffer(L.DRAW_FRAMEBUFFER,O);for(let Pt=0;Pt<Ie;Pt++)Kn?L.framebufferTextureLayer(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,Bt.__webglTexture,z,ct+Pt):L.framebufferTexture2D(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_2D,Bt.__webglTexture,z),wt?L.framebufferTextureLayer(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,mn.__webglTexture,be,zt+Pt):L.framebufferTexture2D(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_2D,mn.__webglTexture,be),z!==0?L.blitFramebuffer(Fe,st,Ce,Me,De,yt,Ce,Me,L.COLOR_BUFFER_BIT,L.NEAREST):wt?L.copyTexSubImage3D(Ae,be,De,yt,zt+Pt,Fe,st,Ce,Me):L.copyTexSubImage2D(Ae,be,De,yt,Fe,st,Ce,Me);v.bindFramebuffer(L.READ_FRAMEBUFFER,null),v.bindFramebuffer(L.DRAW_FRAMEBUFFER,null)}else wt?y.isDataTexture||y.isData3DTexture?L.texSubImage3D(Ae,be,De,yt,zt,Ce,Me,Ie,At,Jt,Rt.data):D.isCompressedArrayTexture?L.compressedTexSubImage3D(Ae,be,De,yt,zt,Ce,Me,Ie,At,Rt.data):L.texSubImage3D(Ae,be,De,yt,zt,Ce,Me,Ie,At,Jt,Rt):y.isDataTexture?L.texSubImage2D(L.TEXTURE_2D,be,De,yt,Ce,Me,At,Jt,Rt.data):y.isCompressedTexture?L.compressedTexSubImage2D(L.TEXTURE_2D,be,De,yt,Rt.width,Rt.height,At,Rt.data):L.texSubImage2D(L.TEXTURE_2D,be,De,yt,Ce,Me,At,Jt,Rt);v.pixelStorei(L.UNPACK_ROW_LENGTH,ni),v.pixelStorei(L.UNPACK_IMAGE_HEIGHT,mt),v.pixelStorei(L.UNPACK_SKIP_PIXELS,Si),v.pixelStorei(L.UNPACK_SKIP_ROWS,Ui),v.pixelStorei(L.UNPACK_SKIP_IMAGES,pn),be===0&&D.generateMipmaps&&L.generateMipmap(Ae),v.unbindTexture()},this.initRenderTarget=function(y){G.get(y).__webglFramebuffer===void 0&&$.setupRenderTarget(y)},this.initTexture=function(y){y.isCubeTexture?$.setTextureCube(y,0):y.isData3DTexture?$.setTexture3D(y,0):y.isDataArrayTexture||y.isCompressedArrayTexture?$.setTexture2DArray(y,0):$.setTexture2D(y,0),v.unbindTexture()},this.resetState=function(){K=0,V=0,ne=null,v.reset(),we.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Gi}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=dt._getDrawingBufferColorSpace(e),t.unpackColorSpace=dt._getUnpackColorSpace()}}const An={likud:{id:"likud",name:"Likud",nameHe:"הליכוד",color:2056127,accent:10273791},yeshatid:{id:"yeshatid",name:"Yesh Atid",nameHe:"יש עתיד",color:41952,accent:11922687},nationalunity:{id:"nationalunity",name:"National Unity",nameHe:"המחנה הממלכתי",color:2573736,accent:10466559},yashar:{id:"yashar",name:"Yashar!",nameHe:"ישר!",color:3833156,accent:12116160},shas:{id:"shas",name:"Shas",nameHe:'ש"ס',color:732779,accent:15909198},utj:{id:"utj",name:"United Torah Judaism",nameHe:"יהדות התורה",color:2763310,accent:14211288},rzp:{id:"rzp",name:"Religious Zionism",nameHe:"הציונות הדתית",color:13849600,accent:16761738},otzma:{id:"otzma",name:"Otzma Yehudit",nameHe:"עוצמה יהודית",color:14721280,accent:16773288},noam:{id:"noam",name:"Noam",nameHe:"נעם",color:8207512,accent:14465258},yb:{id:"yb",name:"Yisrael Beiteinu",nameHe:"ישראל ביתנו",color:2651302,accent:11129840},raam:{id:"raam",name:"Ra'am",nameHe:'רע"ם',color:2006618,accent:10939588},hadash:{id:"hadash",name:"Hadash–Ta'al",nameHe:'חד"ש-תע"ל',color:12597547,accent:16757674},democrats:{id:"democrats",name:"The Democrats",nameHe:"הדמוקרטים",color:14035001,accent:16757693}};let Un=null;function mx(){if(!Un){const s=new Uint8Array([70,70,70,255,150,150,150,255,215,215,215,255,255,255,255,255]);Un=new Ql(s,4,1,Ei),Un.minFilter=Xt,Un.magFilter=Xt,Un.generateMipmaps=!1,Un.needsUpdate=!0}return Un}function Ut(s,e={}){return new Xs({color:s,gradientMap:mx(),...e})}const gx=new yi({color:460812,side:ti});function vx(s,e){const t=s.clone(),i=t.getAttribute("position");let n=t.getAttribute("normal");n||(t.computeVertexNormals(),n=t.getAttribute("normal"));for(let r=0;r<i.count;r++)i.setXYZ(r,i.getX(r)+n.getX(r)*e,i.getY(r)+n.getY(r)*e,i.getZ(r)+n.getZ(r)*e);return i.needsUpdate=!0,t}function ua(s,e){const t=new Xe(s);return t.multiplyScalar(e),t.getHex()}function vt(s,e=1){return new yi({color:s,transparent:!0,opacity:e,blending:pa,depthWrite:!1})}const xd=.95;function kt(s,e,t,i){const n=i??`${e}:${t?JSON.stringify(t):""}`;let r=s.matCache.get(n);return r||(r=Ut(e,t),s.matCache.set(n,r),s.mats.push(r)),r}function Re(s,e,t,i,n=[0,0,0],r={}){const a=new je(t,i);if(a.position.set(n[0],n[1],n[2]),r.rot&&a.rotation.set(r.rot[0],r.rot[1],r.rot[2]),r.scale&&a.scale.set(r.scale[0],r.scale[1],r.scale[2]),a.castShadow=r.shadow!==!1,a.receiveShadow=!1,e.add(a),r.outline!==!1&&s.outline>0){const o=new je(vx(t,s.outline),gx);o.castShadow=!1,a.add(o)}return a}function ai(s,e=[0,0,0]){const t=new Nt;return t.position.set(e[0],e[1],e[2]),s.add(t),t}const Bn=(s,e)=>new pr(s,Math.max(.001,e),5,12);function _d(s,e={}){const t=s.look,i=An[s.party],n={mats:[],matCache:new Map,outline:e.outline===!1?0:.012},r=!!t.female,a=t.build*(r?.9:1),o=r?.92:1,c=Math.sqrt(t.build),l=kt(n,t.skin),h=kt(n,ua(t.skin,.86)),d=t.outfit==="shirt"||t.outfit==="tshirt"?t.shirt:t.jacket,u=kt(n,d),f=kt(n,t.shirt),g=kt(n,t.pants),S=kt(n,t.shoes??1315860),p=kt(n,t.hairColor),m=new Nt;m.scale.setScalar(t.height);const M=ai(m,[0,xd,0]),T=ai(M);Re(n,T,new Ue(.16*a,.15*a,.2,14),g,[0,-.02,0],{scale:[1,1,.75]}),t.outfit==="skirt"?Re(n,T,new Ue(.17*a,.27*a,.5,16),g,[0,-.22,0],{scale:[1,1,.8]}):(t.outfit==="suit"||t.outfit==="open-suit"||t.outfit==="blazer")&&Re(n,T,new Ue(.185*a,.2*a,.2,14),u,[0,.02,0],{scale:[1,1,.78]});const b=t.outfit==="skirt"?kt(n,ua(t.skin,.8)):g,E=he=>{const Qe=ai(T,[he*.095*a,-.05,0]);Re(n,Qe,Bn(.082*c,.3),b,[0,-.22,0]);const Ke=ai(Qe,[0,-.45,0]);return Re(n,Ke,Bn(.068*c,.3),b,[0,-.21,0]),Re(n,Ke,new Ee(.11,.07,.25),S,[0,-.44,.05]),{hip:Qe,knee:Ke}},P=E(1),x=E(-1),w=ai(T,[0,.06,0]),C=.205*a*o,I=.168*a;if(Re(n,w,new Ue(C,I,.5,16),u,[0,.25,0],{scale:[1,1,.66]}),t.build>1.1){const he=(t.build-1)*.9;Re(n,w,new Pe(.16*a,16,12),u,[0,.13,.03+he*.1],{scale:[1,.9,.6+he]})}r&&Re(n,w,new Pe(.09,12,10),u,[0,.36,.08],{scale:[1.9,.8,.7],outline:!1});const N=C*.66+.004;if(t.outfit==="suit"||t.outfit==="open-suit"||t.outfit==="blazer"||t.outfit==="skirt"){const he=new cr;he.moveTo(-.075,0),he.lineTo(.075,0),he.lineTo(0,-.2),he.closePath();const Qe=Re(n,w,new Ia(he),f,[0,.5,N],{outline:!1,shadow:!1});Qe.rotation.x=-.05;const Ke=kt(n,ua(d,.75));for(const it of[1,-1])Re(n,w,new Ee(.018,.22,.01),Ke,[it*.045,.39,N+.004],{rot:[0,0,it*.36],outline:!1,shadow:!1});if(t.tie!==null&&t.tie!==void 0&&t.outfit==="suit"){const it=kt(n,t.tie);Re(n,w,new Ee(.05,.3,.012),it,[0,.33,N+.008],{outline:!1,shadow:!1}),Re(n,w,new Ee(.055,.045,.02),it,[0,.48,N+.01],{outline:!1,shadow:!1})}Re(n,w,new Pe(.018,8,6),kt(n,i.color,{emissive:new Xe(i.color),emissiveIntensity:.4},"pin"),[.1,.42,N+.01],{outline:!1,shadow:!1})}else if(t.outfit==="shirt")for(let he=0;he<4;he++)Re(n,w,new Pe(.009,6,4),kt(n,14540253),[0,.45-he*.1,N+.002],{outline:!1,shadow:!1});const B=ai(w,[0,.5,0]);Re(n,B,new Pe(C,16,10,0,Math.PI*2,0,Math.PI/2),u,[0,-.02,0],{scale:[1,.35,.66]});const U=t.outfit==="tshirt",O=he=>{const Qe=ai(B,[he*(C+.035),-.04,0]);Re(n,Qe,new Pe(.075*c,12,10),u,[0,0,0]),Re(n,Qe,Bn(.06*c,.2),U?f:u,[0,-.15,0]);const Ke=ai(Qe,[0,-.3,0]);Re(n,Ke,Bn(.052*c,.18),U?l:u,[0,-.13,0]),!U&&t.outfit!=="shirt"&&Re(n,Ke,new Ue(.05*c,.05*c,.035,10),f,[0,-.255,0],{outline:!1});const it=ai(Ke,[0,-.3,0]);return Re(n,it,new Pe(.064,12,10),l,[0,0,0],{scale:[1,1.05,1.15]}),{sh:Qe,el:Ke,hand:it}},K=O(1),V=O(-1),ne=ai(B,[0,.03,0]);Re(n,ne,new Ue(.058,.064,.12,12),l,[0,.05,0]),t.outfit!=="tshirt"&&Re(n,ne,new Ue(.07,.075,.05,12),f,[0,0,0],{outline:!1});const X=ai(ne,[0,.1,0]),Q=.15*(t.head??1);let j=null;if(e.face){const he=new qu({map:e.face,transparent:!0,alphaTest:.06,toneMapped:!1,depthWrite:!0});j=new Mp(he);const Qe=t.head??1;j.scale.set(.5*Qe,.625*Qe,1),j.position.set(0,.2,.04),X.add(j)}else xx(n,X,t,Q,l,h,p);return{root:m,pivot:M,hips:T,spine:w,chest:B,neck:ne,head:X,lSh:K.sh,lEl:K.el,rSh:V.sh,rEl:V.el,lHand:K.hand,rHand:V.hand,lHip:P.hip,lKnee:P.knee,rHip:x.hip,rKnee:x.knee,materials:n.mats,headRadius:Q,def:s,faceSprite:j}}function xx(s,e,t,i,n,r,a){const o=ai(e,[0,.14,0]),c=[.92,1.05,1];Re(s,o,new Pe(i,24,18),n,[0,0,0],{scale:c});const l=t.female?.84:.95;Re(s,o,new Pe(i*.8,18,12),n,[0,-i*.35,i*.08],{scale:[l,.85,.95],outline:!1});for(const g of[1,-1])Re(s,o,new Pe(i*.22,10,8),r,[g*i*.88,-i*.02,-i*.02],{scale:[.5,1,.8]});const h=kt(s,16777215),d=kt(s,1118481);for(const g of[1,-1])Re(s,o,new Pe(i*.14,12,10),h,[g*i*.33,i*.12,i*.84],{outline:!1,shadow:!1}),Re(s,o,new Pe(i*.075,10,8),d,[g*i*.32,i*.11,i*.965],{outline:!1,shadow:!1});const u=kt(s,ua(t.facialHairColor??t.hairColor,t.hairColor>10485760?.7:1)),f=t.brows??1;for(const g of[1,-1])Re(s,o,new Ee(i*.38,i*.075*f,i*.09),u,[g*i*.33,i*.33,i*.9],{rot:[0,g*.25,g*.2],outline:!1,shadow:!1});Re(s,o,new Pe(i*.17,12,10),r,[0,-i*.03,i*.98],{scale:[.8,1.05,1.1],outline:!1,shadow:!1}),Re(s,o,new Ee(i*.38,i*.05,i*.05),kt(s,5905950),[0,-i*.4,i*.9],{outline:!1,shadow:!1}),_x(s,o,t,i,a),yx(s,o,t,i),Sx(s,o,t,i),Mx(s,o,t,i)}function _x(s,e,t,i,n){const r=(o,c,l)=>{const h=Re(s,e,new Pe(o,24,12,0,Math.PI*2,0,c),n,[0,i*.02,-i*.02],{scale:[.95,1.05,1.02]});return h.rotation.x=-l,h},a=()=>{const o=n.clone();return o.side=li,s.mats.push(o),o};switch(t.hair){case"bald":break;case"short":r(i*1.04,Math.PI*.46,.35);break;case"buzz":r(i*1.02,Math.PI*.5,.35);break;case"side":r(i*1.05,Math.PI*.46,.3),Re(s,e,new Pe(i*.62,14,10),n,[i*.22,i*.74,i*.2],{scale:[1.35,.5,1.15],rot:[-.2,0,-.25]});break;case"swept":r(i*1.05,Math.PI*.46,.3),Re(s,e,new Pe(i*.7,14,10),n,[0,i*.78,i*.18],{scale:[1.3,.48,1.25],rot:[-.35,0,0]});break;case"receding":r(i*1.04,Math.PI*.45,.85);break;case"horseshoe":{Re(s,e,new Ht(i*.93,i*.17,8,24,Math.PI*1.15),n,[0,i*.05,-i*.02]).rotation.set(-Math.PI/2,0,-Math.PI*.075);break}case"long":case"wavy":{if(r(i*1.06,Math.PI*.52,.25),Re(s,e,new Ue(i*1.02,i*1.2,i*2.3,20,1,!0,Math.PI*.32,Math.PI*1.36),a(),[0,-i*.62,-i*.02],{scale:[.95,1,1]}),t.hair==="wavy")for(let o=0;o<6;o++){const c=Math.PI*(.55+o*.18);Re(s,e,new Pe(i*.32,10,8),n,[Math.sin(c)*i*1.05,-i*(1.3+o%2*.25),Math.cos(c)*i*1],{outline:!1})}break}case"bob":r(i*1.07,Math.PI*.52,.2),Re(s,e,new Ue(i*1.05,i*1.14,i*1.35,20,1,!0,Math.PI*.3,Math.PI*1.4),a(),[0,-i*.3,-i*.02],{scale:[.95,1,1]});break;case"bun":r(i*1.05,Math.PI*.5,.25),Re(s,e,new Pe(i*.45,12,10),n,[0,i*.55,-i*.9]);break;case"ponytail":r(i*1.05,Math.PI*.5,.25),Re(s,e,Bn(i*.22,i*1.1),n,[0,-i*.2,-i*1.2],{rot:[.5,0,0]});break;case"curly":{r(i*1.12,Math.PI*.55,.2);for(let o=0;o<18;o++){const c=o/18*Math.PI*2,l=i*(.3+o%3*.28),h=i*(1+o%2*.1);Math.cos(c)>.7&&l<i*.6||Re(s,e,new Pe(i*.33,10,8),n,[Math.sin(c)*h,l,Math.cos(c)*h-i*.05],{outline:!1})}for(let o=0;o<8;o++){const c=Math.PI*(.6+o*.1);Re(s,e,new Pe(i*.34,10,8),n,[Math.sin(c)*i*1.05,-i*(.2+o%3*.3),Math.cos(c)*i*1],{outline:!1})}break}case"spiky":r(i*1.04,Math.PI*.46,.3);for(let o=0;o<7;o++){const c=-.9+o*.3;Re(s,e,new Qt(i*.18,i*.5,6),n,[Math.sin(c)*i*.5,i*.95,Math.cos(c)*i*.2],{rot:[0,0,-c*.6],outline:!1})}break;case"braids":{r(i*1.06,Math.PI*.52,.2);for(let o=0;o<9;o++){const c=Math.PI*(.62+o*.095);Re(s,e,Bn(i*.1,i*1.9),n,[Math.sin(c)*i*1,-i*.75,Math.cos(c)*i*.98],{outline:!1})}break}}}function yx(s,e,t,i){const n=t.facialHair??"none";if(n==="none")return;const r=t.facialHairColor??t.hairColor,a=kt(s,r),o=(l,h,d,u)=>{Re(s,e,new Pe(l,22,12,-.15,Math.PI+.3,Math.PI*h,Math.PI*(d-h)),u,[0,0,i*.02],{scale:[.93,1.05,1.02],outline:!1})},c=()=>{Re(s,e,Bn(i*.075,i*.34),a,[0,-i*.26,i*.98],{rot:[0,0,Math.PI/2],outline:!1})};switch(n){case"stubble":{const l=kt(s,r,{transparent:!0,opacity:.45},`stubble${r}`);o(i*1.015,.58,.92,l);break}case"short":o(i*1.035,.6,.94,a),c();break;case"full":o(i*1.06,.56,.97,a),Re(s,e,new Pe(i*.48,14,10),a,[0,-i*.82,i*.4],{scale:[1.1,.9,.9],outline:!1}),c();break;case"long":o(i*1.06,.56,.97,a),Re(s,e,new Pe(i*.5,14,10),a,[0,-i*.8,i*.4],{scale:[1.1,.9,.9],outline:!1}),Re(s,e,new Qt(i*.52,i*1.5,14),a,[0,-i*1.45,i*.45],{rot:[Math.PI-.2,0,0]}),c();break;case"goatee":Re(s,e,new Pe(i*.3,12,10),a,[0,-i*.75,i*.62],{outline:!1}),c();break;case"mustache":c();break}}function Sx(s,e,t,i){const n=t.glasses??"none";if(n==="none")return;const r=kt(s,n==="thick"?1710618:2763306),a=n==="thick"?i*.05:i*.028,o=new yi({color:12575999,transparent:!0,opacity:.22,depthWrite:!1});for(const c of[1,-1]){const l=[c*i*.34,i*.12,i*1.04];n==="round"?Re(s,e,new Ht(i*.22,a,6,20),r,l,{outline:!1,shadow:!1}):Re(s,e,new Ht(i*.23,a,4,4),r,l,{rot:[0,0,Math.PI/4],scale:[1.25,.85,1],outline:!1,shadow:!1}),Re(s,e,new La(i*.2,16),o,[l[0],l[1],l[2]+.001],{outline:!1,shadow:!1}),Re(s,e,new Ee(a*1.2,a*1.2,i*.95),r,[c*i*.62,i*.14,i*.55],{outline:!1,shadow:!1})}Re(s,e,new Ee(i*.22,a*1.2,a*1.2),r,[0,i*.16,i*1.06],{outline:!1,shadow:!1})}function Mx(s,e,t,i){const n=t.headwear??"none";if(n==="none")return;const r=t.headwearColor??(n==="black-hat"?723723:1118481),a=kt(s,r);switch(n){case"kippah":case"kippah-knit":{const o=ai(e,[0,i*.94,-i*.32]);if(o.rotation.x=-.45,Re(s,o,new Pe(i*.55,16,8,0,Math.PI*2,0,Math.PI*.22),a,[0,-i*.42,0],{scale:[1,.9,1]}),n==="kippah-knit"){const c=Re(s,o,new Ht(i*.28,i*.03,6,20),kt(s,16777215),[0,i*.08,0],{outline:!1});c.rotation.x=Math.PI/2}break}case"black-hat":{const o=ai(e,[0,i*.78,-i*.05]);o.rotation.x=-.12,Re(s,o,new Ue(i*1.62,i*1.62,i*.07,24),a,[0,0,0]),Re(s,o,new Ue(i*.88,i*1,i*.95,20),a,[0,i*.48,0]),Re(s,o,new Ue(i*1.01,i*1.01,i*.18,20),kt(s,2763306),[0,i*.12,0],{outline:!1});break}case"hat":{const o=ai(e,[0,i*.72,0]);o.rotation.x=-.1,Re(s,o,new Ue(i*1.45,i*1.45,i*.06,24),a,[0,0,0]),Re(s,o,new Pe(i*.98,20,12,0,Math.PI*2,0,Math.PI/2),a,[0,0,0],{scale:[1,.75,1]});break}case"beret":Re(s,e,new Pe(i*1.1,20,12),a,[i*.1,i*.78,-i*.05],{scale:[1.1,.35,1.1],rot:[0,0,-.2]});break;case"scarf":Re(s,e,new Pe(i*1.1,22,14,0,Math.PI*2,0,Math.PI*.62),a,[0,0,-i*.05],{scale:[.96,1.05,1.02]}),Re(s,e,new Ue(i*1.02,i*1.15,i*1.3,20,1,!0,Math.PI*.35,Math.PI*1.3),a,[0,-i*.55,-i*.03]);break}}function yd(s){s.root.traverse(e=>{const t=e;t.isMesh&&t.geometry.dispose()}),s.faceSprite?.material?.dispose();for(const e of s.materials)e.dispose()}const hc=["hips","spine","chest","neck","head","lSh","lEl","rSh","rEl","lHip","lKnee","rHip","rKnee"],uc=hc.length*3+3,Oi=hc.length*3,da=Oi+1,Sd=Oi+2;function Wt(s,e){const t=e?new Float32Array(e):new Float32Array(uc);return hc.forEach((i,n)=>{const r=s[i];r&&(t[n*3]=r[0],t[n*3+1]=r[1],t[n*3+2]=r[2])}),s.hipY!==void 0&&(t[Oi]=s.hipY),s.pivotX!==void 0&&(t[da]=s.pivotX),s.pivotZ!==void 0&&(t[Sd]=s.pivotZ),t}function gt(s,e,t,i){for(let n=0;n<uc;n++)s[n]=e[n]+(t[n]-e[n])*i;return s}const sn=s=>s<=0?0:s>=1?1:s*s*(3-2*s),jr=s=>Math.max(0,Math.min(1,s)),$e=Wt({hipY:-.05,hips:[0,-.3,0],spine:[.1,-.12,0],chest:[.05,-.08,0],head:[0,.5,0],lSh:[-1.15,0,.3],lEl:[-1.75,0,0],rSh:[-.75,0,-.35],rEl:[-2.1,0,0],lHip:[-.35,.3,.05],lKnee:[.45,0,0],rHip:[.25,.3,-.06],rKnee:[.38,0,0]}),Qs=Wt({hipY:0,lSh:[.05,0,.12],lEl:[-.25,0,0],rSh:[.05,0,-.12],rEl:[-.25,0,0],lHip:[0,0,.04],rHip:[0,0,-.04]}),xi=Wt({hipY:-.4,hips:[0,-.25,0],spine:[.35,-.1,0],head:[-.3,.35,0],lHip:[-1.25,.25,.12],lKnee:[2.1,0,0],rHip:[-.55,.25,-.15],rKnee:[2.2,0,0]},$e),nn=Wt({hipY:0,hips:[0,0,0],spine:[.25,0,0],head:[-.2,.2,0],lSh:[-1.4,0,.45],lEl:[-1.3,0,0],rSh:[-1,0,-.45],rEl:[-1.6,0,0],lHip:[-1.35,0,.1],lKnee:[2,0,0],rHip:[-.75,0,-.1],rKnee:[1.7,0,0]},$e),bx=Wt({hipY:0,spine:[.05,0,0],lSh:[-2.2,0,.3],lEl:[-.8,0,0],rSh:[-.4,0,-.5],rEl:[-1,0,0],lHip:[-.3,0,.05],lKnee:[.6,0,0],rHip:[.1,0,-.05],rKnee:[.4,0,0]},$e),Qr=Wt({hipY:-.1,spine:[.2,-.05,0],head:[.25,.3,0],lSh:[-1.35,0,.05],lEl:[-2.2,0,0],rSh:[-1.25,0,-.05],rEl:[-2.25,0,0]},$e),Jh=Wt({lSh:[-1.3,0,.05],lEl:[-2.25,0,0],rSh:[-1.2,0,-.05],rEl:[-2.3,0,0],head:[.2,.3,0]},xi),Co=Wt({hipY:-.06,spine:[-.35,.25,.08],chest:[-.2,0,0],head:[-.55,.3,.12],lSh:[-.4,0,.8],lEl:[-.8,0,0],rSh:[-.3,0,-.7],rEl:[-.7,0,0]},$e),Zh=Wt({hipY:-.12,spine:[.6,0,0],chest:[.2,0,0],head:[.35,.2,0],lSh:[-.6,0,.2],lEl:[-1.9,0,0],rSh:[-.5,0,-.2],rEl:[-1.9,0,0],lHip:[-.5,.3,.05],lKnee:[.7,0,0]},$e),ea=Wt({hipY:-.8,pivotX:-Math.PI/2,hips:[0,0,0],spine:[0,0,0],chest:[0,0,0],head:[.25,.3,0],lSh:[-.2,0,1.3],lEl:[-.4,0,0],rSh:[-.3,0,-1.2],rEl:[-.6,0,0],lHip:[-.35,0,.12],lKnee:[.6,0,0],rHip:[-.1,0,-.1],rKnee:[.2,0,0]}),wx=Wt({hipY:0,pivotX:-.9,spine:[-.2,0,0],head:[-.4,0,0],lSh:[-2,0,1],lEl:[-.5,0,0],rSh:[-1.8,0,-1],rEl:[-.5,0,0],lHip:[-.9,0,.1],lKnee:[1.2,0,0],rHip:[-.4,0,-.1],rKnee:[.8,0,0]}),ta=[Wt({hipY:0,head:[-.35,0,0],spine:[-.1,0,0],lSh:[-2.9,0,.35],lEl:[-.2,0,0],rSh:[-2.9,0,-.35],rEl:[-.2,0,0],lHip:[0,0,.12],rHip:[0,0,-.12],lKnee:[0,0,0],rKnee:[0,0,0]},Qs),Wt({hipY:0,head:[-.2,0,0],rSh:[-2.8,0,-.1],rEl:[-.5,0,0],lSh:[.35,0,.55],lEl:[-2,0,0],lHip:[0,0,.1],rHip:[0,0,-.1]},Qs),Wt({hipY:0,spine:[-.15,0,0],head:[-.2,0,0],lSh:[.35,0,.6],lEl:[-2,0,0],rSh:[.35,0,-.6],rEl:[-2,0,0],lHip:[0,0,.14],rHip:[0,0,-.14]},Qs)],ia=Wt({hipY:0,rSh:[-1.55,0,-.1],rEl:[-.05,0,0],lSh:[.35,0,.6],lEl:[-2,0,0],head:[0,0,0],spine:[0,.2,0]},Qs),jh=Wt({hipY:-.1,spine:[.15,0,0],lSh:[.1,0,.3],lEl:[-.4,0,0],rSh:[.1,0,-.3],rEl:[-.4,0,0]},$e),Ex=Wt({hipY:0,pivotX:-.45,head:[-.4,0,0],lSh:[-2.4,0,.8],lEl:[-.6,0,0],rSh:[-2.2,0,-.8],rEl:[-.6,0,0],lHip:[-.8,0,.1],lKnee:[1,0,0],rHip:[-.2,0,0],rKnee:[.6,0,0]},$e),ut=(s,e,t)=>({base:s,windup:Wt(e,s),strike:Wt(t,s)}),Qh={spine:[.15,-.5,0],lSh:[-1.57,0,.05],lEl:[-.05,0,0],rSh:[-.8,0,-.3],rEl:[-2.1,0,0],lHip:[-.5,.3,.05]},Nl={hips:[0,.25,0],spine:[.22,.45,0],rSh:[-1.6,0,-.05],rEl:[-.05,0,0],lSh:[-.9,0,.4],lEl:[-2,0,0],rHip:[.45,.3,-.05],rKnee:[.2,0,0]},eu={hipY:-.02,spine:[-.25,.5,0],rSh:[-3,0,-.15],rEl:[-.15,0,0],lSh:[-.3,0,.5],lEl:[-1.2,0,0],lHip:[-1.3,0,.1],lKnee:[1.5,0,0],rHip:[.15,0,0],rKnee:[.2,0,0]},Po={hipY:-.1,hips:[0,.1,0],spine:[.12,.25,0],lSh:[-1.55,-.2,-.1],lEl:[-.1,0,0],rSh:[-1.55,.2,.1],rEl:[-.1,0,0],lHip:[-.6,.2,.05],lKnee:[.6,0,0]},Tx={hips:[0,.9,0],spine:[-.35,.3,.4],rHip:[-1.6,0,-.75],rKnee:[.1,0,0],lHip:[.1,.4,0],lKnee:[.25,0,0],lSh:[-.5,0,.9],rSh:[-.3,0,-.6]},Ro={jab:ut($e,{lSh:[-1,0,.35],lEl:[-2,0,0]},Qh),strong:ut($e,{spine:[.05,-.4,0],rSh:[-.6,0,-.45],rEl:[-2.2,0,0]},Nl),short:ut($e,{lHip:[-.9,.3,.05],lKnee:[1.6,0,0]},{lHip:[-1.15,.3,.05],lKnee:[.1,0,0],spine:[-.15,-.1,0]}),roundhouse:ut($e,{rHip:[-.8,0,-.3],rKnee:[1.8,0,0],hips:[0,.5,0],spine:[-.1,.2,0]},Tx),cJab:ut(xi,{lSh:[-1,0,.35],lEl:[-2,0,0]},{lSh:[-1.5,0,.05],lEl:[-.05,0,0],spine:[.3,-.4,0]}),cStrong:ut(xi,{rSh:[-.3,0,-.2],rEl:[-1.8,0,0]},{...eu,hipY:-.12}),cShort:ut(xi,{lHip:[-1.2,.25,.1],lKnee:[1.8,0,0]},{hipY:-.46,lHip:[-1.45,.25,.1],lKnee:[.1,0,0]}),sweep:ut(xi,{hipY:-.45,lHip:[-1,0,.3],lKnee:[1.6,0,0]},{hipY:-.52,spine:[.5,0,0],hips:[0,.5,0],lHip:[-1.5,0,.6],lKnee:[.05,0,0],rHip:[-1.2,0,-.2],rKnee:[2.3,0,0],lSh:[-.2,0,1],rSh:[-.4,0,-1.2]}),jJab:ut(nn,{lSh:[-1,0,.35],lEl:[-2,0,0]},{lSh:[-1.35,0,.1],lEl:[-.1,0,0]}),jStrong:ut(nn,{rSh:[-3,0,-.2],rEl:[-.5,0,0],spine:[-.2,0,0]},{rSh:[-1.1,0,-.1],rEl:[-.1,0,0],spine:[.45,0,0]}),jShort:ut(nn,{lHip:[-1.2,0,0],lKnee:[2,0,0]},{lHip:[-1.7,0,0],lKnee:[2.3,0,0],rHip:[-.3,0,0],rKnee:[.6,0,0]}),jRoundhouse:ut(nn,{lHip:[-1.3,0,.1],lKnee:[1.8,0,0]},{lHip:[-1.3,0,.1],lKnee:[.05,0,0],rHip:[.2,0,0],rKnee:[1.2,0,0],spine:[-.3,0,0]}),overhead:ut($e,{spine:[-.3,0,0],rSh:[-3,0,-.2],lSh:[-3,0,.2],rEl:[-.6,0,0],lEl:[-.6,0,0]},{hipY:-.14,spine:[.55,0,0],rSh:[-1.3,0,-.1],lSh:[-1.3,0,.1],rEl:[-.2,0,0],lEl:[-.2,0,0]}),throw:ut($e,{lSh:[-1.35,0,.4],rSh:[-1.35,0,-.4],lEl:[-.4,0,0],rEl:[-.4,0,0]},{spine:[.2,0,0],lSh:[-1.5,0,.12],rSh:[-1.5,0,-.12],lEl:[-.6,0,0],rEl:[-.6,0,0]}),throwExec:ut($e,{lSh:[-1.5,0,.12],rSh:[-1.5,0,-.12],lEl:[-.6,0,0],rEl:[-.6,0,0]},{hips:[0,-1.1,0],spine:[.3,-.5,0],lSh:[-1.8,0,.6],rSh:[-1.2,0,-.9],lEl:[-.2,0,0],rEl:[-.3,0,0]}),grab:ut($e,{spine:[.1,0,0],lSh:[-1.2,0,.7],rSh:[-1.2,0,-.7],lEl:[-.3,0,0],rEl:[-.3,0,0]},{spine:[.4,0,0],lSh:[-1.55,0,.1],rSh:[-1.55,0,-.1],lEl:[-.3,0,0],rEl:[-.3,0,0],hipY:-.12}),grabExec:ut($e,{lSh:[-2.8,0,.4],rSh:[-2.8,0,-.4],lEl:[-.4,0,0],rEl:[-.4,0,0],spine:[-.25,0,0]},{hipY:-.25,spine:[.6,0,0],lSh:[-1.2,0,.3],rSh:[-1.2,0,-.3],lEl:[-.2,0,0],rEl:[-.2,0,0]}),cast:ut($e,{hipY:-.12,hips:[0,-.7,0],spine:[0,-.3,0],rSh:[.4,0,-.3],rEl:[-1.6,0,0],lSh:[.3,0,.1],lEl:[-1.7,0,0]},Po),charge:ut($e,{hipY:-.2,spine:[.3,0,0]},{hipY:-.12,spine:[.65,-.35,0],lSh:[-1.2,0,.1],lEl:[-1.9,0,0],rSh:[-.3,0,-.3],rEl:[-1.2,0,0],lHip:[-.95,.3,.05],lKnee:[.8,0,0],rHip:[.55,.3,0],rKnee:[.3,0,0]}),uppercut:ut($e,{hipY:-.3,rSh:[.2,0,-.2],rEl:[-1.6,0,0],spine:[.3,0,0]},eu),counterStance:ut($e,{hipY:-.1},{hipY:-.12,spine:[-.15,.25,0],lSh:[-1.5,0,.7],lEl:[-1.3,0,0],rSh:[-.2,0,-.9],rEl:[-1,0,0]}),counterStrike:ut($e,{hipY:-.15,spine:[-.1,-.4,0]},{...Po,spine:[.35,.3,0]}),powerup:ut($e,{hipY:-.2,spine:[.4,0,0],lSh:[-.5,0,.1],rSh:[-.5,0,-.1],lEl:[-2.2,0,0],rEl:[-2.2,0,0]},{hipY:0,spine:[-.3,0,0],head:[-.4,0,0],lSh:[-.4,0,1.4],rSh:[-.4,0,-1.4],lEl:[-.3,0,0],rEl:[-.3,0,0],lHip:[0,0,.12],lKnee:[0,0,0],rHip:[0,0,-.12],rKnee:[0,0,0]}),vanish:ut(xi,{lSh:[-1.6,.6,.2],rSh:[-1.6,-.6,-.2],lEl:[-1.4,0,0],rEl:[-1.4,0,0]},{hipY:-.1,lSh:[-2.6,0,.6],rSh:[-2.6,0,-.6],lEl:[-.3,0,0],rEl:[-.3,0,0]}),stomp:ut($e,{hipY:0,lHip:[-1.6,0,0],lKnee:[1.9,0,0],lSh:[-2.4,0,.5],rSh:[-2.4,0,-.5]},{hipY:-.32,spine:[.55,0,0],lHip:[-.8,0,0],lKnee:[.8,0,0],rSh:[-.9,0,-.3],rEl:[-.1,0,0],lSh:[-.9,0,.3],lEl:[-.1,0,0]}),diveKick:ut(nn,{lHip:[-1.2,0,.1],lKnee:[1.9,0,0]},{spine:[-.2,0,0],lHip:[-.9,0,.1],lKnee:[.05,0,0],rHip:[-.8,0,0],rKnee:[1.8,0,0],lSh:[.6,0,.5],rSh:[.6,0,-.5],lEl:[-.4,0,0],rEl:[-.4,0,0]}),place:ut(xi,{rSh:[-.6,0,-.2],rEl:[-1.4,0,0]},{spine:[.55,0,0],rSh:[-.95,0,-.1],rEl:[-.25,0,0]}),beam:ut($e,{hipY:-.12,hips:[0,-.6,0],rSh:[.4,0,-.3],rEl:[-1.6,0,0],lSh:[.3,0,.1],lEl:[-1.7,0,0]},{...Po,spine:[.05,.1,0]}),whip:ut($e,{spine:[-.2,-.45,0],rSh:[-2.6,0,-.9],rEl:[-.6,0,0]},{spine:[.3,.45,0],rSh:[-1.55,0,-.1],rEl:[0,0,0]}),slamRise:ut(nn,{lSh:[-2.8,0,.4],rSh:[-2.8,0,-.4],lEl:[-.3,0,0],rEl:[-.3,0,0]},{spine:[.5,0,0],lSh:[-1.3,0,.2],rSh:[-1.3,0,-.2],lEl:[-.2,0,0],rEl:[-.2,0,0],lHip:[-1,0,.1],lKnee:[1.1,0,0]}),summon:ut($e,{hipY:-.15,lSh:[-.6,0,.3],rSh:[-.6,0,-.3],lEl:[-1.8,0,0],rEl:[-1.8,0,0]},{hipY:0,spine:[-.25,0,0],head:[-.55,0,0],lSh:[-2.8,0,.6],rSh:[-2.8,0,-.6],lEl:[-.2,0,0],rEl:[-.2,0,0],lHip:[0,0,.1],lKnee:[.05,0,0],rHip:[0,0,-.1],rKnee:[.05,0,0]}),guardUp:ut($e,{hipY:-.1},{hipY:-.14,spine:[.1,0,0],lSh:[-1.5,0,-.25],lEl:[-1,0,0],rSh:[-1.45,0,.25],rEl:[-1,0,0]}),spinKick:ut(nn,{rHip:[-1.2,0,-.5],rKnee:[1.5,0,0]},{spine:[-.1,0,0],rHip:[-1.55,0,-.95],rKnee:[.1,0,0],lHip:[-.4,0,0],lKnee:[1.2,0,0],lSh:[-.4,0,1.3],rSh:[-.4,0,-1.3],lEl:[-.2,0,0],rEl:[-.2,0,0]}),flurry:ut($e,{lSh:[-1,0,.35],lEl:[-2,0,0]},Qh),ultCombo:ut($e,{spine:[.05,-.4,0],rSh:[-.6,0,-.45],rEl:[-2.2,0,0]},Nl),taunt:ut($e,{},{})},Ax=Wt(Nl,$e),tu=["strong","roundhouse","jab","uppercut","strong","short","roundhouse","uppercut"];function zs(s,e,t,i,n,r){const a=e.base??$e;if(t<=i){const c=i>0?t/i:1;return c<.6?gt(s,a,e.windup,sn(c/.6)):gt(s,e.windup,e.strike,sn((c-.6)/.4))}if(t<=i+n)return gt(s,e.strike,e.strike,0);const o=r>0?(t-i-n)/r:1;return gt(s,e.strike,a,sn(o))}class Md{cur=new Float32Array($e);target=new Float32Array(uc);spin=0;hidden=!1;reset(){this.cur.set($e),this.spin=0}get pivotX(){return this.cur[da]}get headRoll(){return this.cur[14]+this.cur[5]}update(e,t,i){const n=this.target,r=t.ticks/60;let a=18;this.hidden=!1;let o=0;switch(e.state){case"intro":gt(n,ia,ia,0),n[Oi]+=Math.sin(r*2)*.01;break;case"idle":case"jumpSquat":case"land":{const l=Math.sin(r*2.6+e.index)*.5+.5;gt(n,$e,$e,0),n[Oi]+=-l*.02,n[3]+=l*.05,(e.state==="jumpSquat"||e.state==="land")&&gt(n,n,xi,.45);break}case"walkF":case"walkB":{if(e.guarding){gt(n,Qr,Qr,0);break}gt(n,$e,$e,0);const l=e.stateFrame*.2*(e.state==="walkB"?-1:1),h=Math.sin(l),d=Math.cos(l);n[27]+=h*.4,n[33]-=h*.4,n[30]+=Math.max(0,d)*.55,n[36]+=Math.max(0,-d)*.55,n[Oi]+=Math.abs(h)*.025-.02;break}case"crouch":gt(n,e.guarding?Jh:xi,xi,0);break;case"dash":{gt(n,$e,$e,0),n[3]+=e.dashDir>0?.3:-.25;const l=e.stateFrame*.35;n[27]+=Math.sin(l)*.5,n[33]-=Math.sin(l)*.5;break}case"sidestep":gt(n,$e,xi,.35),n[5]+=e.sidestepDir*.2;break;case"air":case"fall":{const l=e.vy>.12;gt(n,l?bx:nn,nn,l?.15:0),e.state==="fall"&&(n[3]+=.2,n[15]-=.5,n[21]-=.5);break}case"attack":{const l=e.move;if(!l){gt(n,$e,$e,0);break}a=32;const h=Ro[l.anim]??Ro.jab,d=e.moveFrame;if(l.anim==="flurry"&&d>l.startup&&d<=l.startup+l.active){const u=Math.floor((d-l.startup)/4)%2===1,f=(d-l.startup)%4/4;gt(n,h.windup,u?Ax:h.strike,sn(f*2))}else if(l.anim==="slamRise")gt(n,e.vy>0?h.windup:h.strike,h.strike,0);else if(l.anim==="spinKick")zs(n,h,d,l.startup,l.active,l.recovery),d>l.startup&&d<=l.startup+l.active&&(o=(d-l.startup)*.7);else if(l.anim==="charge"&&l.kind==="super")zs(n,h,d,l.startup,l.active,l.recovery);else if(l.anim==="throwExec"||l.anim==="grabExec"){const u=jr(d/26);gt(n,h.windup,h.strike,sn(u)),d>30&&gt(n,h.strike,$e,sn((d-30)/14))}else l.anim==="vanish"?(zs(n,h,d,l.startup,l.active,l.recovery),d>=5&&d<=11&&(this.hidden=!0)):zs(n,h,d,l.startup,l.active,l.recovery);break}case"hitstun":{const l=e.hitHigh?Co:Zh,h=jr(e.stateFrame/6);gt(n,$e,l,h<1?sn(h):1),a=40;break}case"blockstun":gt(n,e.relDir===1?Jh:Qr,Qr,0),a=40;break;case"juggle":case"thrown":{const l=e.state==="thrown"?Ex:wx;if(gt(n,l,l,0),e.state==="juggle"){const h=Math.min(1.3,.9+e.stateFrame*.02);n[da]=-h,e.vy<0&&e.y<.8&&gt(n,n,ea,jr((.8-e.y)/.8)*.7)}a=22;break}case"knockdown":case"ko":gt(n,ea,ea,0),a=14;break;case"getup":{const l=jr(e.stateFrame/20);l<.5?gt(n,ea,xi,sn(l*2)):gt(n,xi,$e,sn((l-.5)*2)),a=30;break}case"dizzy":gt(n,jh,jh,0),n[12]+=Math.sin(r*7)*.35,n[14]+=Math.sin(r*5)*.35,n[5]+=Math.sin(r*3.5)*.18;break;case"victory":{const l=ta[e.victoryVariant%ta.length];gt(n,l,l,0),e.victoryVariant%3===1&&(n[21]+=Math.sin(r*9)*.25),e.victoryVariant%3===2&&(n[12]+=Math.sin(r*4)*.12),n[Oi]+=Math.abs(Math.sin(r*3))*.02,a=10;break}case"cinematic":{const l=t.cinematic;if(l&&l.att===e){const h=Math.floor(e.stateFrame/11)%tu.length,d=Ro[tu[h]],u=e.stateFrame%11;zs(n,d,u,6,2,3),a=40}else{const h=Math.floor(e.stateFrame/11)%2===0;gt(n,h?Co:Zh,Co,0),a=30}break}}this.spin=o>0?o:this.spin*.8;const c=1-Math.exp(-i*a);gt(this.cur,this.cur,n,c)}showcase(e,t,i,n=0,r=0){const a=this.target;if(i==="victory"){const o=ta[n%ta.length];gt(a,o,o,0),n%3===1&&(a[21]+=Math.sin(t*9+r)*.25),a[Oi]+=Math.abs(Math.sin(t*3+r))*.02}else if(i==="intro")gt(a,ia,ia,0);else{const o=Math.sin(t*2.6+r)*.5+.5;gt(a,$e,$e,0),a[Oi]+=-o*.02,a[3]+=o*.05}this.hidden=!1,this.spin*=.8,gt(this.cur,this.cur,a,1-Math.exp(-e*10))}apply(e){const t=this.cur,i=[e.hips,e.spine,e.chest,e.neck,e.head,e.lSh,e.lEl,e.rSh,e.rEl,e.lHip,e.lKnee,e.rHip,e.rKnee];for(let n=0;n<i.length;n++)i[n].rotation.set(t[n*3],t[n*3+1],t[n*3+2]);e.hips.rotation.y+=this.spin,e.pivot.position.y=xd+t[Oi],e.pivot.rotation.x=t[da],e.pivot.rotation.z=t[Sd]}}function Cx(s,e,t=0){const i=Qs,n=new Md;n.cur.set(i),n.apply(s)}const na=900,Ri=new Ft,Lo=new Xe;class Px{group=new Nt;inst;particles=[];rings=[];flashes=[];constructor(){const e=new ac(1,0),t=new yi({color:16777215,transparent:!0,blending:pa,depthWrite:!1});this.inst=new or(e,t,na),this.inst.instanceMatrix.setUsage(Jf),this.inst.frustumCulled=!1;for(let i=0;i<na;i++)Ri.scale.setScalar(0),Ri.updateMatrix(),this.inst.setMatrixAt(i,Ri.matrix),this.inst.setColorAt(i,Lo.set(16777215));this.group.add(this.inst);for(let i=0;i<24;i++){const n=new je(new oc(.8,1,40),vt(16777215,1));n.material.side=li,n.visible=!1,this.group.add(n),this.rings.push({mesh:n,life:0,max:1,from:0,to:1,active:!1})}for(let i=0;i<12;i++){const n=new je(new Pe(1,16,12),vt(16777215,1));n.visible=!1,this.group.add(n),this.flashes.push({mesh:n,life:0,max:1,from:0,to:1,active:!1})}}clear(){this.particles.length=0;for(const e of[...this.rings,...this.flashes])e.active=!1,e.mesh.visible=!1}burst(e,t,i,n,r,a,o=.05,c=.004,l=30){for(let h=0;h<r;h++){this.particles.length>=na&&this.particles.shift();const d=Math.random()*Math.PI*2,u=Math.acos(2*Math.random()-1),f=a*(.4+Math.random()*.8);this.particles.push({x:e,y:t,z:i,vx:Math.sin(u)*Math.cos(d)*f,vy:Math.cos(u)*f+a*.3,vz:Math.sin(u)*Math.sin(d)*f*.6,life:l*(.6+Math.random()*.6),max:l,size:o*(.6+Math.random()*.8),color:new Xe(n),grav:c,drag:.92})}}ring(e,t,i,n,r,a,o,c=!1){const l=this.rings.find(h=>!h.active)??this.rings[0];l.active=!0,l.life=o,l.max=o,l.from=r,l.to=a,l.mesh.visible=!0,l.mesh.position.set(e,t,i),l.mesh.rotation.set(c?-Math.PI/2:0,0,0),l.mesh.material.color.set(n)}flash(e,t,i,n,r,a=8){const o=this.flashes.find(c=>!c.active)??this.flashes[0];o.active=!0,o.life=a,o.max=a,o.from=r*.4,o.to=r,o.mesh.visible=!0,o.mesh.position.set(e,t,i),o.mesh.material.color.set(n)}hitSpark(e,t,i,n,r,a){if(r){this.burst(e,t,i,8965375,10,.06,.04,.001,16),this.ring(e,t,i,10475775,.1,.6,12);return}const o=a??(n==="super"?16765440:n==="special"?16747008:n==="heavy"?16757575:16773544),c=n==="light"?12:n==="heavy"?22:n==="special"?26:40,l=n==="light"?.07:n==="heavy"?.1:.12;this.burst(e,t,i,o,c,l,n==="light"?.045:.06,.003,22),this.burst(e,t,i,16777215,Math.round(c/3),l*1.3,.035,.001,12),this.flash(e,t,i,16777215,n==="light"?.28:.45,6),this.ring(e,t,i,o,.1,n==="light"?.6:n==="super"?1.8:1.1,n==="light"?10:16)}update(e){const t=Math.min(3,e*60);let i=0;const n=this.particles;for(let r=n.length-1;r>=0;r--){const a=n[r];if(a.life-=t,a.life<=0){n.splice(r,1);continue}a.vy-=a.grav*t,a.vx*=Math.pow(a.drag,t),a.vy*=Math.pow(a.drag,t),a.vz*=Math.pow(a.drag,t),a.x+=a.vx*t,a.y+=a.vy*t,a.z+=a.vz*t,a.y<.02&&(a.y=.02,a.vy*=-.3)}for(const r of n){const a=r.life/r.max;Ri.position.set(r.x,r.y,r.z),Ri.rotation.set(r.life*.3,r.life*.2,0),Ri.scale.setScalar(r.size*(.3+a*.9)),Ri.updateMatrix(),this.inst.setMatrixAt(i,Ri.matrix),Lo.copy(r.color).multiplyScalar(.4+a),this.inst.setColorAt(i,Lo),i++}for(;i<na;i++)Ri.scale.setScalar(0),Ri.updateMatrix(),this.inst.setMatrixAt(i,Ri.matrix);this.inst.instanceMatrix.needsUpdate=!0,this.inst.instanceColor&&(this.inst.instanceColor.needsUpdate=!0);for(const r of[...this.rings,...this.flashes]){if(!r.active)continue;if(r.life-=t,r.life<=0){r.active=!1,r.mesh.visible=!1;continue}const a=1-r.life/r.max;r.mesh.scale.setScalar(r.from+(r.to-r.from)*(1-(1-a)*(1-a))),r.mesh.material.opacity=1-a}}}function q(s,e,t,i=[0,0,0],n=[0,0,0],r){const a=new je(e,typeof t=="number"?Ut(t):t);return a.position.set(...i),a.rotation.set(...n),r&&a.scale.set(...r),a.castShadow=!0,s.add(a),a}function sa(s,e,t,i,n){const r=document.createElement("canvas");r.width=256,r.height=Math.round(256*n/i);const a=r.getContext("2d");a.fillStyle=t,a.fillRect(0,0,r.width,r.height),a.fillStyle=e,a.font=`bold ${Math.round(r.height*.55)}px Arial, sans-serif`,a.textAlign="center",a.textBaseline="middle",a.fillText(s,r.width/2,r.height/2);const o=new tc(r);return o.colorSpace=Yt,new je(new ci(i,n),new yi({map:o,side:li}))}const ra=typeof document<"u";function Ea(s,e){const t=new Nt;switch(s){case"orb":default:q(t,new Pe(.22,16,12),vt(e,.9)),q(t,new Pe(.12,12,10),vt(16777215,1));break;case"ballot":{q(t,new Ee(.4,.34,.34),3895256),q(t,new Ee(.2,.02,.06),1118481,[0,.175,0]),q(t,new Ee(.14,.12,.005),16777215,[0,.24,0],[0,0,.1]);break}case"gavel":{q(t,new Ue(.09,.09,.3,12),8014372,[0,.12,0],[0,0,Math.PI/2]),q(t,new Ue(.025,.025,.4,8),10251067,[0,-.08,0]),q(t,new Ue(.1,.1,.03,12),13934674,[.155,.12,0],[0,0,Math.PI/2]),q(t,new Ue(.1,.1,.03,12),13934674,[-.155,.12,0],[0,0,Math.PI/2]);break}case"book":{q(t,new Ee(.36,.46,.1),e),q(t,new Ee(.34,.44,.08),16117984,[.015,0,0]);break}case"paper":{q(t,new Ee(.34,.44,.01),16777215);for(let i=0;i<5;i++)q(t,new Ee(.24,.02,.012),7829367,[0,.14-i*.07,.002]);q(t,new Ee(.1,.06,.014),e,[.08,-.17,.003]);break}case"coin":case"shekel":{if(q(t,new Ue(.22,.22,.05,20),15909198,[0,0,0],[Math.PI/2,0,0]),q(t,new Ht(.2,.02,6,20),13934615),ra){const i=sa("₪","#8a6500","rgba(0,0,0,0)",.28,.28);i.material.transparent=!0,i.position.z=.03,t.add(i)}break}case"mic":{if(q(t,new Pe(.11,12,10),4473924,[.18,0,0]),q(t,new Ue(.04,.05,.3,10),1118481,[0,0,0],[0,0,Math.PI/2]),ra){const i=sa("NEWS","#ffffff","#"+e.toString(16).padStart(6,"0"),.14,.07);i.position.set(.05,.07,0),t.add(i)}break}case"tv":{q(t,new Ee(.5,.36,.18),2236962),q(t,new ci(.42,.28),vt(e,.9),[0,0,.091]),q(t,new Ue(.008,.008,.25,6),10066329,[.08,.28,0],[0,0,-.5]),q(t,new Ue(.008,.008,.25,6),10066329,[-.08,.28,0],[0,0,.5]);break}case"envelope":{q(t,new Ee(.44,.28,.03),16052193),q(t,new Qt(.22,.14,4),14735552,[0,.06,.02],[Math.PI,Math.PI/4,0],[1.4,1,.1]),q(t,new Ue(.035,.035,.02,12),12066084,[0,0,.02],[Math.PI/2,0,0]);break}case"phone":{q(t,new Ee(.22,.42,.04),1710618),q(t,new ci(.19,.36),vt(e,1),[0,0,.021]);break}case"bomb":{q(t,new Pe(.24,18,14),1710618),q(t,new Ue(.06,.06,.08,10),4473924,[0,.26,0]),q(t,new Ue(.012,.012,.12,6),13148266,[.03,.34,0],[0,0,-.4]),q(t,new Pe(.04,8,6),vt(16755200,1),[.06,.4,0]),q(t,new Ht(.245,.02,6,24,Math.PI*.9),16720418,[0,0,0],[0,0,-Math.PI*.1]);break}case"plane":{const i=new cr;i.moveTo(.3,0),i.lineTo(-.25,.2),i.lineTo(-.15,0),i.lineTo(-.25,-.2),i.closePath();const n=q(t,new Ia(i),new Xs({color:16777215,side:li}));n.rotation.x=Math.PI/2,q(t,new Ee(.5,.02,.02),14540253,[.02,-.03,0]);break}case"jet":{q(t,new Ue(.06,.08,.6,10),8030873,[0,0,0],[0,0,-Math.PI/2]),q(t,new Qt(.06,.18,10),5595243,[.39,0,0],[0,0,-Math.PI/2]),q(t,new Ee(.28,.02,.6),6978185,[-.04,0,0]),q(t,new Ee(.12,.18,.02),6978185,[-.26,.09,0]),q(t,new Pe(.06,8,6),vt(16750848,.9),[-.33,0,0]);break}case"tomato":{q(t,new Pe(.2,16,12),14692398,[0,0,0],[0,0,0],[1,.85,1]),q(t,new Qt(.08,.06,5),3115567,[0,.18,0]);break}case"watermelon":{q(t,new Pe(.26,18,14),2980397,[0,0,0],[0,0,0],[1.25,1,1]);for(let i=0;i<6;i++)q(t,new Ht(.262,.012,4,24,Math.PI),1789211,[0,0,0],[0,i/6*Math.PI,Math.PI/2],[1,1.25,1]);break}case"brick":{q(t,new Ee(.44,.2,.22),11879983),q(t,new Ee(.46,.02,.24),13616824,[0,.1,0]);break}case"bin":{if(q(t,new Ue(.2,.16,.42,14),2984527),q(t,new Ue(.22,.22,.04,14),2388031,[0,.23,0]),ra){const i=sa("♻","#ffffff","rgba(0,0,0,0)",.2,.2);i.material.transparent=!0,i.position.set(0,0,.19),t.add(i)}break}case"cone":{q(t,new Qt(.2,.55,14),16743168,[0,.22,0]),q(t,new Ue(.155,.13,.08,14),16777215,[0,.2,0]),q(t,new Ee(.44,.04,.44),16743168,[0,-.04,0]);break}case"train":{q(t,new Ee(.8,.36,.3),e),q(t,new Ee(.82,.12,.31),14606046,[0,.1,0]);for(let i=0;i<3;i++)q(t,new Ee(.16,.1,.32),vt(10477823,.8),[-.25+i*.25,.1,0]);q(t,new Pe(.19,12,10),e,[.4,-.02,0],[0,0,0],[.6,.9,.8]),q(t,new Pe(.035,8,6),vt(16777130,1),[.5,-.06,.1]),q(t,new Pe(.035,8,6),vt(16777130,1),[.5,-.06,-.1]);break}case"tank":{q(t,new Ee(.7,.2,.42),4936480,[0,-.05,0]),q(t,new Ee(.34,.14,.3),5923880,[-.04,.12,0]),q(t,new Ue(.03,.03,.45,8),3818008,[.3,.14,0],[0,0,Math.PI/2]),q(t,new Ee(.76,.12,.1),2236962,[0,-.15,.2]),q(t,new Ee(.76,.12,.1),2236962,[0,-.15,-.2]);break}case"syringe":{q(t,new Ue(.06,.06,.34,12),new Xs({color:15267839,transparent:!0,opacity:.75}),[0,0,0],[0,0,Math.PI/2]),q(t,new Ue(.05,.05,.24,10),vt(e,.9),[.03,0,0],[0,0,Math.PI/2]),q(t,new Ue(.006,.006,.16,6),13421772,[.25,0,0],[0,0,Math.PI/2]),q(t,new Ue(.02,.02,.12,6),10066329,[-.22,0,0],[0,0,Math.PI/2]);break}case"sign":{if(q(t,new Ue(.02,.02,.6,6),10251067,[0,-.22,0]),q(t,new Ee(.5,.34,.02),16777215,[0,.14,0]),ra){const i=sa("VOTE!","#"+e.toString(16).padStart(6,"0"),"#ffffff",.46,.3);i.position.set(0,.14,.012),t.add(i)}break}case"megaphone":{q(t,new Ue(.2,.06,.4,14,1,!0),new Xs({color:15921906,side:li}),[.05,0,0],[0,0,-Math.PI/2]),q(t,new Ht(.2,.02,6,20),e,[.25,0,0],[0,Math.PI/2,0]),q(t,new Ee(.05,.14,.05),3355443,[-.08,-.1,0]);break}case"chalk":{q(t,new Ue(.035,.035,.26,8),16777215,[0,0,0],[0,0,Math.PI/2]),q(t,new Pe(.12,8,6),vt(16777215,.35),[-.12,0,0]);break}case"scissors":{q(t,new Ee(.4,.04,.02),13621468,[.1,.02,0],[0,0,.2]),q(t,new Ee(.4,.04,.02),13621468,[.1,-.02,.01],[0,0,-.2]),q(t,new Ht(.06,.018,6,12),e,[-.14,.07,0]),q(t,new Ht(.06,.018,6,12),e,[-.14,-.07,0]);break}case"tooth":{q(t,new Pe(.2,14,10),16777215,[0,.06,0],[0,0,0],[1,.8,.9]),q(t,new Qt(.07,.24,8),16053492,[-.08,-.14,0],[Math.PI,0,.2]),q(t,new Qt(.07,.24,8),16053492,[.08,-.14,0],[Math.PI,0,-.2]);break}case"drill":{q(t,new Ee(.22,.14,.12),2792847),q(t,new Ee(.08,.2,.1),2508371,[-.06,-.14,0]),q(t,new Qt(.035,.24,8),13421772,[.22,0,0],[0,0,-Math.PI/2]);break}case"star":{const i=new cr;for(let n=0;n<10;n++){const r=n%2===0?.26:.11,a=n/10*Math.PI*2+Math.PI/2;n===0?i.moveTo(Math.cos(a)*r,Math.sin(a)*r):i.lineTo(Math.cos(a)*r,Math.sin(a)*r)}i.closePath(),q(t,new rc(i,{depth:.06,bevelEnabled:!1}),16766474,[0,0,-.03]);break}case"flag":{q(t,new Ue(.015,.015,.7,6),14540253,[-.2,-.1,0]),q(t,new Ee(.42,.28,.01),16777215,[.02,.1,0]),q(t,new Ee(.42,.04,.012),e,[.02,.2,0]),q(t,new Ee(.42,.04,.012),e,[.02,0,0]);break}case"wave":{q(t,new Ht(.3,.07,8,20,Math.PI),vt(e,.85),[0,-.05,0],[0,Math.PI/2,0]).scale.set(1,1,1.4),q(t,new Ht(.2,.05,8,16,Math.PI),vt(16777215,.8),[.05,-.05,0],[0,Math.PI/2,0]);break}case"sound":{for(let i=0;i<3;i++)q(t,new Ht(.12+i*.07,.022,6,20,Math.PI*.8),vt(e,.9-i*.2),[i*.07,0,0],[0,Math.PI/2,Math.PI*.6]);break}case"dish":{q(t,new Pe(.24,16,8,0,Math.PI*2,0,Math.PI*.35),new Xs({color:15790320,side:li}),[0,0,0],[0,0,-Math.PI/2]),q(t,new Ue(.01,.01,.2,6),7829367,[.1,0,0],[0,0,Math.PI/2]),q(t,new Pe(.04,8,6),vt(e,1),[.2,0,0]);break}case"briefcase":{q(t,new Ee(.46,.32,.12),5978654),q(t,new Ht(.06,.015,6,12,Math.PI),2759182,[0,.16,0]),q(t,new Ee(.05,.04,.13),13934674,[0,.08,0]);break}case"siren":{q(t,new Ue(.16,.18,.08,14),3355443,[0,-.1,0]),q(t,new Pe(.15,14,10,0,Math.PI*2,0,Math.PI/2),vt(e,.95),[0,-.06,0]),q(t,new Pe(.28,12,10),vt(e,.25),[0,0,0]);break}case"tower":{q(t,new Ue(.02,.12,.8,4,1),12568527,[0,.3,0]);for(let i=0;i<3;i++)q(t,new Ht(.1+i*.07,.012,4,16,Math.PI*.6),vt(e,.9),[0,.7,0],[0,0,Math.PI*.2]);q(t,new Pe(.04,8,6),vt(16724821,1),[0,.72,0]);break}case"ball":{q(t,new Pe(.2,16,12),16777215);for(let i=0;i<3;i++)q(t,new Ht(.2,.012,4,20),1118481,[0,0,0],[0,i*Math.PI/3,0]);break}case"whistle":{q(t,new Ue(.1,.1,.12,12),12632256,[0,0,0],[Math.PI/2,0,0]),q(t,new Ee(.2,.06,.08),11579568,[.12,.05,0]);break}case"fire":{q(t,new Qt(.2,.5,10),vt(e,.9),[0,.05,0],[0,0,-Math.PI/2]),q(t,new Pe(.2,12,10),vt(16768341,.9),[.1,0,0]),q(t,new Pe(.1,10,8),vt(16777215,1),[.12,0,0]);break}case"snowflake":{for(let i=0;i<3;i++)q(t,new Ee(.46,.04,.04),vt(e,.95),[0,0,0],[0,0,i*Math.PI/3]);q(t,new Pe(.2,12,10),vt(16777215,.25));break}case"leaf":{q(t,new Pe(.22,12,8),5613104,[0,0,0],[0,0,.6],[1,.45,.12]),q(t,new Ee(.4,.015,.02),2849291,[0,0,0],[0,0,.6]);break}case"heart":{q(t,new Pe(.12,12,10),e,[-.08,.06,0]),q(t,new Pe(.12,12,10),e,[.08,.06,0]),q(t,new Qt(.17,.24,12),e,[0,-.1,0],[Math.PI,0,0]);break}case"shield":{q(t,new Ue(.25,.25,.04,20),e,[0,0,0],[Math.PI/2,0,0]),q(t,new Ht(.25,.03,6,20),13934674);break}case"crane":{q(t,new Ee(.06,.8,.06),16759304,[0,.3,0]),q(t,new Ee(.7,.05,.05),16759304,[.2,.68,0]),q(t,new Ue(.005,.005,.3,4),3355443,[.45,.52,0]),q(t,new Ee(.16,.08,.08),11879983,[.45,.35,0]),q(t,new Ee(.36,.06,.36),5592405,[0,-.08,0]);break}case"map":{q(t,new Ee(.5,.02,.36),15326389),q(t,new Qt(.04,.12,8),14034984,[.1,.07,.05],[Math.PI,0,0]),q(t,new Qt(.04,.12,8),1920728,[-.12,.07,-.06],[Math.PI,0,0]),q(t,new Ee(.3,.022,.015),5800279,[0,.005,.02],[0,.4,0]);break}case"clock":{q(t,new Ue(.22,.22,.06,20),16777215,[0,.22,0],[Math.PI/2,0,0]),q(t,new Ht(.22,.025,6,20),e,[0,.22,0]),q(t,new Ee(.02,.14,.02),1118481,[0,.27,.035]),q(t,new Ee(.1,.02,.02),1118481,[.05,.22,.035]);break}case"chair":{q(t,new Ee(.34,.05,.34),2051993,[0,0,0]),q(t,new Ee(.34,.36,.05),2051993,[0,.2,-.15]);for(const i of[-.14,.14])for(const n of[-.14,.14])q(t,new Ue(.015,.015,.3,6),4473924,[i,-.17,n]);break}case"laptop":{q(t,new Ee(.46,.02,.32),11581376,[0,-.1,0]),q(t,new Ee(.46,.3,.02),11581376,[0,.05,-.16],[-.25,0,0]),q(t,new ci(.42,.26),vt(e,1),[0,.05,-.145],[-.25,0,0]);break}}return t}function ot(s,e,t,i,n=[0,0,0],r=!0){const a=new je(new Ee(...e),typeof t=="number"?Ut(t):t);return a.position.set(...i),a.rotation.set(...n),a.castShadow=r,a.receiveShadow=!0,s.add(a),a}function Wi(s,e,t,i=[1,1]){const n=document.createElement("canvas");n.width=s,n.height=e,t(n.getContext("2d"),s,e);const r=new tc(n);return r.colorSpace=Yt,r.wrapS=r.wrapT=ma,r.repeat.set(i[0],i[1]),r.anisotropy=4,r}function Wn(s,e,t,i,n=.08){for(let r=0;r<i;r++){const a=Math.random()>.5?255:0;s.fillStyle=`rgba(${a},${a},${a},${n*Math.random()})`,s.fillRect(Math.random()*e,Math.random()*t,2,2)}}function mr(s,e,t=16777215,i=[60,40]){const n=new je(new ci(i[0],i[1]),new dn({map:e,color:t,roughness:.85,metalness:.02}));return n.rotation.x=-Math.PI/2,n.position.z=-i[1]/2+12,n.receiveShadow=!0,s.add(n),n}function Ua(s,e,t,i){const n=new Pe(120,32,16),r=new Di({side:ti,depthWrite:!1,fog:!1,uniforms:{top:{value:new Xe(e)},bottom:{value:new Xe(t)},horizon:{value:new Xe(i??t)}},vertexShader:"varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",fragmentShader:`uniform vec3 top; uniform vec3 bottom; uniform vec3 horizon; varying vec3 vP;
      void main(){ float h = vP.y; vec3 c = h > 0.0 ? mix(horizon, top, pow(h, 0.6)) : mix(horizon, bottom, pow(-h, 0.5));
      gl_FragColor = vec4(c, 1.0); }`}),a=new je(n,r);a.renderOrder=-10,s.add(a)}function gr(s,e,t,i=1){const n=e.length,r=new pr(.22*i,.45*i,4,8),a=new Pe(.16*i,10,8),o=new or(r,Ut(16777215),n),c=new or(a,Ut(16777215),n),l=[15845285,15251604,14262908,13012579,9263675],h=new Xe,d=[];for(let g=0;g<n;g++)o.setColorAt(g,h.set(t[g%t.length])),c.setColorAt(g,h.set(l[g*7%l.length])),d.push(Math.random()*Math.PI*2);o.castShadow=!1,c.castShadow=!1,s.add(o,c);const u=new Ft,f=g=>{for(let S=0;S<n;S++){const[p,m,M]=e[S],T=Math.max(0,Math.sin(g*5+d[S]))*.08*i;u.position.set(p,m+.45*i+T,M),u.rotation.set(0,0,0),u.scale.setScalar(1),u.updateMatrix(),o.setMatrixAt(S,u.matrix),u.position.set(p,m+.98*i+T,M),u.updateMatrix(),c.setMatrixAt(S,u.matrix)}o.instanceMatrix.needsUpdate=!0,c.instanceMatrix.needsUpdate=!0};return f(0),f}function dc(s,e,t,i){const n=new Nt,r=new dn({color:i,metalness:.7,roughness:.35}),a=(o,c,l=[0,0,0])=>{const h=new je(o,r);h.position.set(...c),h.rotation.set(...l),h.castShadow=!0,n.add(h)};a(new Ee(1.4,.3,.8),[0,.15,0]),a(new Ue(.12,.16,3.2,10),[0,1.9,0]);for(let o=1;o<=3;o++){const c=o*.55;a(new Ht(c,.09,8,24,Math.PI),[0,3.4,0],[0,0,Math.PI]);for(const l of[-1,1])a(new Ue(.09,.09,1.1+.05*o,8),[l*c,3.4+.55,0])}a(new Ue(.09,.09,1.2,8),[0,4,0]);for(let o=-3;o<=3;o++)a(new Ue(.13,.08,.14,8),[o*.55,4.6,0]);return n.position.set(...e),n.scale.setScalar(t),s.add(n),n}function Rx(s,e,t){const i=new Nt;for(let n=0;n<8;n++){const r=new je(new Ue(.13-n*.008,.15-n*.008,t/8,8),Ut(9071172));r.position.set(Math.sin(n*.25)*.15,(n+.5)*(t/8),0),r.castShadow=!0,i.add(r)}for(let n=0;n<7;n++){const r=new je(new Pe(.9,8,6),Ut(3112242));r.scale.set(1.3,.12,.35);const a=n/7*Math.PI*2;r.position.set(Math.cos(a)*.8+.3,t+.05,Math.sin(a)*.8),r.rotation.set(0,-a,-.35),r.castShadow=!0,i.add(r)}i.position.set(...e),s.add(i)}function iu(s,e,t,i,n){const r=[];for(let a=0;a<i;a++){const o=a/(i-1),c=e[0]+(t[0]-e[0])*o,l=e[2]+(t[2]-e[2])*o,h=e[1]+(t[1]-e[1])*o-Math.sin(o*Math.PI)*.8,d=new je(new Pe(.07,8,6),new yi({color:n[a%n.length]}));d.position.set(c,h,l),s.add(d),r.push(d)}return r}function Lx(s,e,t,i,n){return Wi(256,512,(r,a,o)=>{r.fillStyle=n,r.fillRect(0,0,a,o);const c=a/s,l=o/e;for(let h=0;h<e;h++)for(let d=0;d<s;d++)r.fillStyle=Math.random()<.55?t:i,r.fillRect(d*c+3,h*l+3,c-6,l-6)})}function Ix(s){switch(s.kind){case"plenum":return Dx();case"plaza":return kx();case"committee":return Ux();case"beach":return Nx();case"market":return Fx();case"rooftop":return Ox()}}function Dx(){const s=new Nt,e=Wi(256,256,(g,S,p)=>{g.fillStyle="#23407a",g.fillRect(0,0,S,p),g.strokeStyle="rgba(160,190,255,0.18)",g.lineWidth=3;for(let m=0;m<8;m++)g.beginPath(),g.moveTo(0,m*32+16),g.lineTo(S,m*32+16),g.stroke();Wn(g,S,p,3e3,.12)},[14,10]);mr(s,e);const t=Wi(512,256,(g,S,p)=>{g.fillStyle="#d8c7a3",g.fillRect(0,0,S,p),g.strokeStyle="rgba(120,100,70,0.35)";for(let m=0;m<8;m++){const M=m%2*32;for(let T=-1;T<9;T++)g.strokeRect(T*64+M,m*32,64,32)}Wn(g,S,p,4e3,.1)},[6,3]),i=new je(new ci(60,18),new dn({map:t,roughness:.95}));i.position.set(0,9,-13),i.receiveShadow=!0,s.add(i),ot(s,[9,1.2,1.6],7031342,[0,.6,-8.5]),ot(s,[7,.9,1.2],8148532,[0,1.65,-9.4]),ot(s,[.9,1.4,.6],5913893,[0,1.3,-7.6]),dc(s,[0,2.3,-12.6],.8,13936722);const n=[3895256,14263361,3115626];for(let g=0;g<3;g++){const S=ot(s,[5,5.5,.1],Ut(n[g]),[-12+g*12,5.5,-12.8],[0,0,0],!1);g===1&&(S.visible=!1)}const r=Ut(8148532),a=Ut(2908088),o=[],c=[],l=[],h=new Ft;for(let g=0;g<4;g++){const S=9+g*1.6,p=g*.55,m=16+g*3;for(let M=0;M<m;M++){const T=Math.PI*1.08+M/(m-1)*Math.PI*.84,_=Math.cos(T)*S*1.35,b=3+Math.sin(T)*S;b>-2.5||(h.position.set(_,p+.45,b),h.rotation.set(0,-T-Math.PI/2,0),h.updateMatrix(),o.push(h.matrix.clone()),h.position.set(_+Math.cos(T)*.7,p+.35,b+Math.sin(T)*.7),h.updateMatrix(),c.push(h.matrix.clone()),(M+g)%3!==0&&l.push([_+Math.cos(T)*.7,p+.1,b+Math.sin(T)*.7]))}}const d=new or(new Ee(1.1,.9,.55),r,o.length);o.forEach((g,S)=>d.setMatrixAt(S,g)),d.receiveShadow=!0;const u=new or(new Ee(.6,1,.5),a,c.length);c.forEach((g,S)=>u.setMatrixAt(S,g)),s.add(d,u);const f=gr(s,l,[1780298,2961206,1118742,3820126,15921906,5913893]);for(let g=-2;g<=2;g++){const S=new je(new Ee(8,.1,.4),new yi({color:16774358}));S.position.set(g*9,12,-4),s.add(S)}return{group:s,update:g=>f(g),lighting:{background:1709072,fog:[1709072,22,60],hemiSky:16773336,hemiGround:2763332,hemiIntensity:1.1,key:16773590,keyIntensity:2.6,keyPos:[4,12,8],rim:7314431,rimIntensity:1.4}}}function kx(){const s=new Nt;Ua(s,3112921,13624567,15266555);const e=Wi(256,256,(o,c,l)=>{o.fillStyle="#d9cdb4",o.fillRect(0,0,c,l),o.strokeStyle="rgba(110,95,70,0.35)",o.lineWidth=2;for(let h=0;h<=4;h++)o.beginPath(),o.moveTo(h*64,0),o.lineTo(h*64,l),o.stroke(),o.beginPath(),o.moveTo(0,h*64),o.lineTo(c,h*64),o.stroke();Wn(o,c,l,3e3,.1)},[16,12]);mr(s,e,16777215,[120,80]);const t=Ut(6134586);for(const o of[-16,16])ot(s,[14,.1,10],t,[o,.05,-10],[0,0,0],!1);const i=new Nt,n=Ut(15195330);ot(i,[34,1.2,8],n,[0,7.4,0]),ot(i,[32,6.8,6],Ut(3815994),[0,3.4,-.5]);for(let o=0;o<15;o++)ot(i,[1,6.8,1],n,[-14+o*2,3.4,3.2]);ot(i,[36,.6,9],Ut(13616040),[0,.3,0]),i.position.set(0,0,-26),s.add(i),dc(s,[8,0,-12],.9,723e4);for(const o of[-10,-7,10.5,13.5]){ot(s,[.08,7,.08],14540253,[o,3.5,-16]);const c=new Nt;ot(c,[1.6,1.1,.03],16777215,[.8,0,0],[0,0,0],!1),ot(c,[1.6,.16,.035],2052031,[.8,.38,0],[0,0,0],!1),ot(c,[1.6,.16,.035],2052031,[.8,-.38,0],[0,0,0],!1),c.position.set(o,6.3,-16),s.add(c)}for(const[o,c]of[[-13,-7],[-17,-12],[15,-7],[18,-13],[-6,-18],[5,-19]]){ot(s,[.3,2.2,.3],6967862,[o,1.1,c]);const l=new je(new Pe(1.4,10,8),Ut(8362586));l.scale.set(1.2,.8,1.1),l.position.set(o,2.8,c),l.castShadow=!0,s.add(l)}const r=[];for(let o=0;o<40;o++)r.push([-18+o%20*1.9+(o>19?.9:0),0,-8.5-(o>19?1.4:0)]);const a=gr(s,r,[2052031,16777215,14035001,2961206,15909198,3833156]);return{group:s,update:o=>a(o),lighting:{background:13624567,fog:[14412278,35,110],hemiSky:13625599,hemiGround:9075290,hemiIntensity:1.3,key:16774624,keyIntensity:3,keyPos:[-8,16,10],rim:16777215,rimIntensity:.6}}}function Ux(){const s=new Nt,e=Wi(256,256,(l,h,d)=>{l.fillStyle="#6a2c2c",l.fillRect(0,0,h,d),l.fillStyle="rgba(255,210,150,0.08)";for(let u=0;u<16;u++)for(let f=0;f<16;f++)(u+f)%2===0&&l.fillRect(u*16,f*16,16,16);Wn(l,h,d,2500,.12)},[16,10]);mr(s,e);const t=Wi(256,256,(l,h,d)=>{l.fillStyle="#6b4a2e",l.fillRect(0,0,h,d);for(let u=0;u<16;u++)l.fillStyle=`rgba(40,20,10,${.08+Math.random()*.12})`,l.fillRect(u*16,0,2,d);Wn(l,h,d,2e3,.1)},[10,2]),i=new je(new ci(60,12),new dn({map:t,roughness:.8}));i.position.set(0,6,-11),s.add(i);const n=Ut(4861724);ot(s,[16,.9,1.6],n,[0,.45,-7]),ot(s,[1.6,.9,6],n,[-9,.45,-4.5]),ot(s,[1.6,.9,6],n,[9,.45,-4.5]);const r=Ut(1710618),a=[];for(let l=0;l<12;l++){const h=-7.2+l*1.3;ot(s,[.7,1.3,.6],r,[h,.65,-8.3]),a.push([h,.2,-8.2]),ot(s,[.25,.3,.02],16053492,[h,1.05,-6.2],[-.4,0,0],!1),ot(s,[.08,.26,.08],new dn({color:10474495,transparent:!0,opacity:.6}),[h+.35,1.03,-6.6])}const o=gr(s,a,[1780298,2961206,1118742,5913893]),c=Wi(512,288,(l,h,d)=>{l.fillStyle="#0b1a2e",l.fillRect(0,0,h,d),l.fillStyle="#9fd3ff",l.font="bold 28px Arial",l.fillText("STATE BUDGET 2026",24,44);const u=["#ffd166","#ef476f","#06d6a0","#118ab2","#f78c6b"];for(let f=0;f<10;f++){const g=40+Math.random()*170;l.fillStyle=u[f%u.length],l.fillRect(30+f*46,d-20-g,32,g)}});for(const l of[-8,8]){ot(s,[5.4,3.2,.2],1118481,[l,5,-10.8]);const h=new je(new ci(5,2.8),new yi({map:c}));h.position.set(l,5,-10.69),s.add(h)}return dc(s,[0,4.2,-10.9],.55,13936722),{group:s,update:l=>o(l),lighting:{background:1313800,fog:[1313800,18,50],hemiSky:16769728,hemiGround:2759188,hemiIntensity:1,key:16770756,keyIntensity:2.5,keyPos:[3,11,7],rim:16756848,rimIntensity:1.2}}}function Nx(){const s=new Nt;Ua(s,3817359,3811914,16751194);const e=Wi(256,256,(h,d,u)=>{h.fillStyle="#e6c894",h.fillRect(0,0,d,u),Wn(h,d,u,6e3,.15)},[20,12]);mr(s,e,16777215,[120,60]);const t=new ci(200,80,60,20),i=new je(t,new dn({color:2781086,roughness:.25,metalness:.3,flatShading:!0}));i.rotation.x=-Math.PI/2,i.position.set(0,.05,-52),s.add(i);const n=new je(new La(6,32),new yi({color:16757594,fog:!1}));n.position.set(-18,7,-110),s.add(n);for(let h=0;h<16;h++){const d=4+Math.random()*14;ot(s,[2.5+Math.random()*2,d,2.5],Ut(4868714),[28+h%4*4,d/2,-8-Math.floor(h/4)*5],[0,0,0],!1),ot(s,[2.5+Math.random()*2,d,2.5],Ut(4868714),[-30-h%4*4,d/2,-8-Math.floor(h/4)*5],[0,0,0],!1)}for(const[h,d]of[[-12,-6],[-15,-3],[13,-7],[16,-4],[-8,-12],[9,-13]])Rx(s,[h,0,d],6+Math.random()*2);const r=new Nt;for(const h of[-1,1])for(const d of[-1,1])ot(r,[.15,3,.15],14540253,[h,1.5,d]);ot(r,[2.6,.2,2.6],15921906,[0,3.1,0]),ot(r,[2.4,1.6,2.4],14034984,[0,4,0]),ot(r,[2.8,.2,2.8],16777215,[0,4.9,0]),r.position.set(-5,0,-14),s.add(r);for(const[h,d,u]of[[7,-9,16731501],[11,-11,3835647],[-10,-10,16766474]]){ot(s,[.08,2.4,.08],15658734,[h,1.2,d]);const f=new je(new Qt(1.6,.6,12),Ut(u));f.position.set(h,2.5,d),f.castShadow=!0,s.add(f)}const a=[];for(let h=0;h<24;h++)a.push([-16+h*1.4+h%2*.3,0,-7-h%3*1.3]);const o=gr(s,a,[16731501,3835647,16766474,448160,16053492,8599788]),c=t.getAttribute("position"),l=Float32Array.from(c.array);return{group:s,update:h=>{o(h);for(let d=0;d<c.count;d++){const u=l[d*3],f=l[d*3+1];c.setZ(d,Math.sin(u*.2+h*1.2)*.25+Math.cos(f*.3+h)*.2)}c.needsUpdate=!0},lighting:{background:16751194,fog:[14256746,40,140],hemiSky:16762266,hemiGround:6965866,hemiIntensity:1.2,key:16756848,keyIntensity:3,keyPos:[-10,8,6],rim:16735912,rimIntensity:1.2}}}function Fx(){const s=new Nt;Ua(s,658464,657930,1710650);const e=Wi(256,256,(c,l,h)=>{c.fillStyle="#6b6258",c.fillRect(0,0,l,h);for(let d=0;d<180;d++)c.fillStyle=`rgba(${150+Math.random()*40},${140+Math.random()*30},${120+Math.random()*30},0.9)`,c.beginPath(),c.ellipse(Math.random()*l,Math.random()*h,8+Math.random()*6,6+Math.random()*4,Math.random()*3,0,Math.PI*2),c.fill()},[16,10]);mr(s,e);const t=[15087942,16219904,16766474,5613104,10309341,16748459];for(let c=0;c<9;c++){const l=-16+c*4,h=-7-c%2*.6;ot(s,[3.4,1,1.6],7031342,[l,.5,h]),ot(s,[.1,3.2,.1],3811866,[l-1.6,1.6,h+.7]),ot(s,[.1,3.2,.1],3811866,[l+1.6,1.6,h+.7]);const d=ot(s,[3.8,.08,2.2],Ut(c%2?14034984:16053492),[l,3.1,h+.3],[.25,0,0]);d.castShadow=!1;for(let u=0;u<14;u++){const f=new je(new Pe(.13,8,6),Ut(t[(c+u)%t.length]));f.position.set(l-1.4+u%7*.45,1.1+Math.floor(u/7)*.18,h-.3+Math.floor(u/7)*.35),s.add(f)}}ot(s,[60,8,1],9075300,[0,4,-12]);const i=[...iu(s,[-18,5,-5],[0,5,-5],22,[16769162,16752474,16773568]),...iu(s,[0,5,-5],[18,5,-5],22,[16769162,16752474,16773568])],n=new Eh(16756832,30,18,1.6);n.position.set(-6,4.5,-3);const r=new Eh(16756832,30,18,1.6);r.position.set(6,4.5,-3),s.add(n,r);const a=[];for(let c=0;c<30;c++)a.push([-17+c*1.2,0,-9.3+c%2*.5]);const o=gr(s,a,[2961206,6966419,1671876,9095462,16734558,16763450]);return{group:s,update:c=>{o(c),i.forEach((l,h)=>l.material.color.setHSL(.1,1,.55+.15*Math.sin(c*3+h)))},lighting:{background:658464,fog:[921114,18,55],hemiSky:5925536,hemiGround:2759184,hemiIntensity:.8,key:16766112,keyIntensity:2.2,keyPos:[5,10,8],rim:8031487,rimIntensity:1.5}}}function Ox(){const s=new Nt;Ua(s,329231,329231,1905984);const e=Wi(512,512,(p,m,M)=>{p.fillStyle="#50535a",p.fillRect(0,0,m,M),Wn(p,m,M,8e3,.12),p.strokeStyle="rgba(255,215,0,0.9)",p.lineWidth=10,p.beginPath(),p.arc(m/2,M/2,180,0,Math.PI*2),p.stroke(),p.fillStyle="rgba(255,255,255,0.85)",p.font="bold 220px Arial",p.textAlign="center",p.textBaseline="middle",p.fillText("H",m/2,M/2+10)}),t=new je(new ci(26,18),new dn({map:e,roughness:.9}));t.rotation.x=-Math.PI/2,t.position.set(0,0,-2),t.receiveShadow=!0,s.add(t);for(let p=0;p<27;p++)ot(s,[.06,1.1,.06],10066329,[-13+p,.55,-11]);ot(s,[26,.06,.06],12303291,[0,1.1,-11]);const i=Lx(8,40,"#ffe7a8","#1b2340","#2b3450"),n=new dn({map:i,emissive:16777215,emissiveMap:i,emissiveIntensity:.6,roughness:.4}),r=new je(new Ue(4,4,40,32),n);r.position.set(-16,-8,-30);const a=new je(new Ue(4.6,4.6,36,3),n);a.position.set(16,-10,-26);const o=new je(new Ee(7,34,7),n);o.position.set(2,-12,-44),s.add(r,a,o);const c=1500,l=new Ot,h=new Float32Array(c*3),d=new Float32Array(c*3),u=new Xe;for(let p=0;p<c;p++)h[p*3]=(Math.random()-.5)*220,h[p*3+1]=-28-Math.random()*3,h[p*3+2]=-20-Math.random()*120,u.setHSL(.08+Math.random()*.1,.9,.5+Math.random()*.3),d.set([u.r,u.g,u.b],p*3);l.setAttribute("position",new fi(h,3)),l.setAttribute("color",new fi(d,3)),s.add(new uh(l,new Pl({size:.5,vertexColors:!0,fog:!1})));const f=new Ot,g=new Float32Array(600*3);for(let p=0;p<600;p++){const m=Math.random()*Math.PI*2,M=Math.random()*Math.PI*.45;g.set([Math.cos(m)*Math.sin(M)*110,Math.cos(M)*110,Math.sin(m)*Math.sin(M)*110-20],p*3)}f.setAttribute("position",new fi(g,3)),s.add(new uh(f,new Pl({size:.35,color:16777215,fog:!1}))),ot(s,[2,1.2,1.4],9080729,[-10,.6,-8]),ot(s,[2,1.2,1.4],9080729,[10,.6,-8.5]),ot(s,[.15,6,.15],7829367,[7,3,-9.5]);const S=new je(new Pe(.15,8,6),vt(16720452,1));return S.position.set(7,6.1,-9.5),s.add(S),{group:s,update:p=>{S.visible=Math.sin(p*4)>0},lighting:{background:329231,fog:[723742,40,160],hemiSky:6320320,hemiGround:2103344,hemiIntensity:.9,key:13161727,keyIntensity:2.4,keyPos:[6,12,9],rim:16732067,rimIntensity:2}}}function nu(s){s.group.traverse(e=>{const t=e;t.geometry&&t.geometry.dispose();const i=t.material;Array.isArray(i)?i.forEach(n=>n.dispose()):i&&(i.map?.dispose(),i.dispose())})}const Bx={netanyahu:"Benjamin Netanyahu",levin:"Yariv Levin","israel-katz":"Israel Katz",ohana:"Amir Ohana",regev:"Miri Regev",amsalem:"David Amsalem",barkat:"Nir Barkat",gotliv:"Tally Gotliv",karhi:"Shlomo Karhi","may-golan":"May Golan",edelstein:"Yuli Edelstein",saar:"Gideon Sa'ar",dichter:"Avi Dichter",silman:"Idit Silman","ofir-katz":"Ofir Katz",kisch:"Yoav Kisch",lapid:"Yair Lapid","ben-ari":"Meirav Ben-Ari",gantz:"Benny Gantz",eisenkot:"Gadi Eisenkot",tropper:"Hili Tropper","tamano-shata":"Pnina Tamano-Shata",deri:"Aryeh Deri",malchieli:"Michael Malchieli",gafni:"Moshe Gafni",goldknopf:"Yitzhak Goldknopf",smotrich:"Bezalel Smotrich",rothman:"Simcha Rothman",strook:"Orit Strook","ben-gvir":"Itamar Ben-Gvir",fogel:"Zvika Fogel",maoz:"Avi Maoz",lieberman:"Avigdor Lieberman",forer:"Oded Forer","mansour-abbas":"Mansour Abbas",odeh:"Ayman Odeh",tibi:"Ahmad Tibi","touma-sliman":"Aida Touma-Suleiman",kariv:"Gilad Kariv",lazimi:"Naama Lazimi"},bd=s=>`https://${s}/w/api.php`;function Hx(s,e,t=640){const i=new URLSearchParams({action:"query",format:"json",formatversion:"2",origin:"*",prop:"pageimages",piprop:"thumbnail|name",pithumbsize:String(t),pilicense:"free",redirects:"1",titles:e.join("|")});return`${bd(s)}?${i}`}function zx(s,e){const t=s.query??{},i=new Map((t.normalized??[]).map(o=>[o.from,o.to])),n=new Map((t.redirects??[]).map(o=>[o.from,o.to])),r=new Map((t.pages??[]).map(o=>[o.title,o])),a={};for(const o of e){let c=i.get(o)??o;for(let h=0;h<3&&n.has(c);h++)c=n.get(c);const l=r.get(c);l&&!l.missing&&l.pageimage&&l.thumbnail?.source&&(a[o]={file:l.pageimage,thumb:l.thumbnail.source,width:l.thumbnail.width,height:l.thumbnail.height,pageTitle:l.title})}return a}function Gx(s,e){const t=new URLSearchParams({action:"query",format:"json",formatversion:"2",origin:"*",prop:"imageinfo",iiprop:"extmetadata|url",iiextmetadatafilter:"LicenseShortName|LicenseUrl|Artist|Credit",titles:e.map(i=>`File:${i}`).join("|")});return`${bd(s)}?${t}`}function Io(s){return s.replace(/<[^>]*>/g," ").replace(/&nbsp;/g," ").replace(/&amp;/g,"&").replace(/&quot;/g,'"').replace(/&#0?39;/g,"'").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/\s+/g," ").trim()}function Vx(s){const e={};for(const t of s.query?.pages??[]){const i=t.imageinfo?.[0];if(!i)continue;const n=i.extmetadata??{},r=t.title.replace(/^File:/,"").replace(/ /g,"_");e[r]={license:Io(n.LicenseShortName?.value??""),licenseUrl:Io(n.LicenseUrl?.value??""),artist:Io(n.Artist?.value??n.Credit?.value??"Unknown"),descUrl:i.descriptionurl??""}}return e}function su(s){return s.replace(/^File:/,"").replace(/ /g,"_")}function Wx(s){const e=s.toLowerCase();return!e||e.includes("nc")||e.includes("nd")||e.includes("fair use")||e.includes("non-free")?!1:e.includes("cc0")||e.includes("public domain")||e.startsWith("pd")||e.includes("cc by")||e.includes("cc-by")||e.includes("attribution")||e.includes("gfdl")}function Xx(s,e,t){const i=Math.max(s.height*t,s.width*e*1.1),n=i*1.95/t;return{cx:s.xCenter,cy:s.yCenter-i*.2/t,h:n}}function qx(s,e){const t=s/e;return t<.95?{cx:.5,cy:.32,h:Math.min(.62,.55/t*.8)}:t>1.3?{cx:.5,cy:.36,h:.62}:{cx:.5,cy:.36,h:.64}}function wd(s,e,t){const i=s.h*t,n=i*.8;return{x:s.cx*e-n/2,y:s.cy*t-i/2,w:n,h:i}}function $x(s,e,t){const i=s.h*t*1.35;return{x:s.cx*e-i/2,y:s.cy*t-i*.42,s:i}}const Kx="0.4.1646425229",ru=`https://cdn.jsdelivr.net/npm/@mediapipe/face_detection@${Kx}/`;let Do=null,Fl=null,Ol="",au=Promise.resolve();function Yx(s,e){return new Promise((t,i)=>{const n=document.createElement("script");n.src=s,n.crossOrigin="anonymous";const r=setTimeout(()=>i(new Error("timeout")),e);n.onload=()=>{clearTimeout(r),t()},n.onerror=()=>{clearTimeout(r),i(new Error("load failed"))},document.head.appendChild(n)})}function Ed(s,e){return Promise.race([s,new Promise((t,i)=>setTimeout(()=>i(new Error("timeout")),e))])}async function Jx(){return Do||(Do=(async()=>{try{const s=window;if(s.FaceDetection||await Yx(`${ru}face_detection.js`,15e3),!s.FaceDetection)return null;const e=new s.FaceDetection({locateFile:t=>`${ru}${t}`});return e.onResults(t=>{const i=Fl;Fl=null,i?.(t)}),e.setOptions({model:"full",minDetectionConfidence:.4}),Ol="full",await Ed(e.initialize(),25e3),e}catch(s){return console.warn("Face detector unavailable, using heuristic crops.",s),null}})()),Do}async function Zx(s,e,t){return Ol!==t&&(s.setOptions({model:t,minDetectionConfidence:.45}),Ol=t),(await Ed(new Promise(n=>{Fl=n,s.send({image:e}).catch(()=>n({detections:[]}))}),8e3)).detections??[]}function jx(s,e){for(const[t,i]of Object.entries(s))if(!(t==="boundingBox"||t==="landmarks"||!Array.isArray(i)||!i.length)){for(const[n,r]of Object.entries(i[0]))if(n!=="index"&&typeof r=="number"&&r>0&&r<=1)return r}return 1-e*.01}function Qx(s){let e=null;return s.forEach((t,i)=>{const n=t.boundingBox,r=jx(t,i);(!e||r>e.score)&&(e={xCenter:n.xCenter,yCenter:n.yCenter,width:n.width,height:n.height,score:r})}),e}function e_(s){const e=au.then(async()=>{const t=await Jx();if(!t)return null;try{return Qx(await Zx(t,s,"full"))}catch{return null}});return au=e.catch(()=>null),e}const hi=256,Mn=320,pi=new Map,fc=new Map;let Ta="photo",$n=0;function pc(s,e){try{const t=localStorage.getItem(s);return t?JSON.parse(t):e}catch{return e}}function As(s,e){try{localStorage.setItem(s,JSON.stringify(e))}catch{}}const er=new Set(pc("skf.faceDisabled",[])),fn=pc("skf.faceCrops",{}),ko=pc("skf.faceAutoCrops",{});function t_(s){Ta!==s&&(Ta=s,$n++)}function i_(){return Ta}function Td(s){if(!(Ta!=="photo"||er.has(s)))return pi.get(s)}function vs(s){return pi.get(s)}function n_(s){const e=Td(s);return e?(e.texture||(e.texture=new tc(e.head),e.texture.colorSpace=Yt,e.texture.anisotropy=4),e.texture):null}function s_(s){return Td(s)?.portrait}function Uo(s){return er.has(s)}function Ad(s,e){e?er.add(s):er.delete(s),As("skf.faceDisabled",[...er]),$n++}function r_(){return pi.size}function a_(){return[...pi.values()].filter(s=>s.source.kind==="wiki").map(s=>({id:s.id,source:s.source}))}function o_(s,e=15e3){return new Promise((t,i)=>{const n=new Image;n.crossOrigin="anonymous",n.decoding="async";const r=setTimeout(()=>i(new Error("timeout")),e);n.onload=()=>{clearTimeout(r),t(n)},n.onerror=()=>{clearTimeout(r),i(new Error(`failed to load ${s}`))},n.src=s})}function l_(s,e=900){const t=Math.min(1,e/Math.max(s.naturalWidth,s.naturalHeight)),i=document.createElement("canvas");return i.width=Math.max(1,Math.round(s.naturalWidth*t)),i.height=Math.max(1,Math.round(s.naturalHeight*t)),i.getContext("2d").drawImage(s,0,0,i.width,i.height),i}async function ou(s,e=12e3){const t=new AbortController,i=setTimeout(()=>t.abort(),e);try{const n=await fetch(s,{signal:t.signal});if(!n.ok)throw new Error(`HTTP ${n.status}`);return await n.json()}finally{clearTimeout(i)}}function c_(s){const t=s.getContext("2d").getImageData(0,0,s.width,1).data;let i=0,n=0,r=0;const a=t.length/4;for(let o=0;o<t.length;o+=4)i+=t[o],n+=t[o+1],r+=t[o+2];return`rgb(${Math.round(i/a)},${Math.round(n/a)},${Math.round(r/a)})`}function mc(s,e){const t=s.image,i=t.width,n=t.height,r=c_(t),a=s.head;a.width=hi,a.height=Mn;const o=a.getContext("2d");o.save(),o.clearRect(0,0,hi,Mn),o.fillStyle=r,o.fillRect(0,0,hi,Mn);const c=wd(s.crop,i,n);o.drawImage(t,c.x,c.y,c.w,c.h,0,0,hi,Mn),o.globalCompositeOperation="destination-in",o.translate(hi/2,Mn/2),o.scale(1,Mn/hi);const l=o.createRadialGradient(0,0,hi*.38,0,0,hi*.5);l.addColorStop(0,"rgba(0,0,0,1)"),l.addColorStop(.82,"rgba(0,0,0,1)"),l.addColorStop(1,"rgba(0,0,0,0)"),o.fillStyle=l,o.fillRect(-hi/2,-hi/2,hi,hi),o.restore(),o.save(),o.translate(hi/2,Mn/2),o.beginPath(),o.ellipse(0,0,hi*.465,Mn*.465,0,0,Math.PI*2),o.lineWidth=6,o.strokeStyle="rgba(7,8,12,0.9)",o.stroke(),o.restore();const h=192,d=document.createElement("canvas");d.width=h,d.height=h;const u=d.getContext("2d");u.fillStyle=e?`#${An[e.party].color.toString(16).padStart(6,"0")}`:r,u.fillRect(0,0,h,h);const f=$x(s.crop,i,n);u.drawImage(t,f.x,f.y,f.s,f.s,0,0,h,h),s.portrait=d.toDataURL("image/jpeg",.88),s.texture&&(s.texture.needsUpdate=!0)}async function h_(s,e){const t=ko[e];if(t)return{crop:{cx:t.cx,cy:t.cy,h:t.h},detected:t.detected};const i=await e_(s),n=i?{crop:Xx(i,s.width,s.height),detected:!0}:{crop:qx(s.width,s.height),detected:!1};return i&&(ko[e]={...n.crop,detected:!0},As("skf.faceAutoCrops",ko)),n}async function Aa(s,e,t){const i=await o_(t),n=l_(i);n.getContext("2d").getImageData(0,0,1,1);const{crop:r,detected:a}=await h_(n,e.url),o=fn[s.id],c=o&&o.url===e.url?{cx:o.cx,cy:o.cy,h:o.h}:r,l={id:s.id,image:n,source:e,crop:c,auto:r,detected:a,head:document.createElement("canvas"),portrait:"",texture:null};return mc(l,s),l}function Cd(){return new Promise((s,e)=>{const t=indexedDB.open("skf-faces",1);t.onupgradeneeded=()=>t.result.createObjectStore("uploads"),t.onsuccess=()=>s(t.result),t.onerror=()=>e(t.error)})}async function u_(){const s=await Cd();return new Promise((e,t)=>{const i={},r=s.transaction("uploads","readonly").objectStore("uploads").openCursor();r.onsuccess=()=>{const a=r.result;a?(i[String(a.key)]=a.value,a.continue()):e(i)},r.onerror=()=>t(r.error)})}async function Pd(s,e){const t=await Cd();return new Promise((i,n)=>{const r=t.transaction("uploads","readwrite"),a=r.objectStore("uploads");e?a.put(e,s):a.delete(s),r.oncomplete=()=>i(),r.onerror=()=>n(r.error)})}async function d_(s){const e=new Map,t=[{host:"en.wikipedia.org",title:n=>Bx[n.id]??n.name},{host:"he.wikipedia.org",title:n=>n.nameHe}];for(const{host:n,title:r}of t){const a=s.filter(o=>!e.has(o.id));if(a.length)for(let o=0;o<a.length;o+=45){const c=a.slice(o,o+45),l=c.map(r);try{const h=zx(await ou(Hx(n,l)),l);c.forEach((d,u)=>{const f=h[l[u]];f&&e.set(d.id,{...f,host:n})})}catch(h){console.warn(`Wikipedia lookup failed on ${n}`,h)}}}const i=new Map;for(const n of["en.wikipedia.org","he.wikipedia.org"]){const r=[...new Set([...e.values()].filter(a=>a.host===n).map(a=>a.file))];for(let a=0;a<r.length;a+=45)try{const o=Vx(await ou(Gx(n,r.slice(a,a+45))));for(const[c,l]of Object.entries(o))i.set(`${n}:${c}`,l)}catch(o){console.warn("Licence lookup failed",o)}}for(const n of s){const r=e.get(n.id);if(!r)continue;const a=i.get(`${r.host}:${su(r.file)}`);a&&a.license&&!Wx(a.license)||fc.set(n.id,{kind:"wiki",url:r.thumb,file:r.file,license:a?.license||"Free licence (see file page)",licenseUrl:a?.licenseUrl,artist:a?.artist||"Wikimedia Commons contributor",descUrl:a?.descUrl||`https://${r.host}/wiki/File:${encodeURIComponent(su(r.file))}`,pageUrl:`https://${r.host}/wiki/${encodeURIComponent(r.pageTitle.replace(/ /g,"_"))}`})}}async function Rd(s,e){const t=s.length;let i=0,n={};try{n=await u_()}catch{}try{await d_(s)}catch(o){console.warn("Photo lookup failed; using cartoon faces.",o)}const r=[...s],a=async()=>{for(;;){const o=r.shift();if(!o)return;try{const c=n[o.id];if(c){const l=URL.createObjectURL(c);pi.set(o.id,await Aa(o,{kind:"upload",url:`upload:${o.id}`},l))}else{const l=fc.get(o.id);l&&pi.set(o.id,await Aa(o,l,l.url))}}catch(c){console.warn(`No photo face for ${o.id}`,c)}i++,e?.(i,t)}};return await Promise.all([a(),a(),a(),a()]),$n++,pi.size}function No(s,e){const t=pi.get(s.id);t&&(t.crop={cx:e.cx,cy:e.cy,h:Math.max(.05,Math.min(3,e.h))},fn[s.id]={...t.crop,url:t.source.url},As("skf.faceCrops",fn),mc(t,s),$n++)}function f_(s){const e=pi.get(s.id);e&&(delete fn[s.id],As("skf.faceCrops",fn),e.crop={...e.auto},mc(e,s),$n++)}async function p_(s,e){try{await Pd(s.id,e).catch(()=>{});const t=URL.createObjectURL(e);delete fn[s.id],As("skf.faceCrops",fn);const i=await Aa(s,{kind:"upload",url:`upload:${s.id}:${Date.now()}`},t),n=pi.get(s.id);return n?.texture&&(i.texture=n.texture,i.texture.image=i.head,i.texture.needsUpdate=!0),pi.set(s.id,i),Ad(s.id,!1),$n++,!0}catch(t){return console.warn("Upload failed",t),!1}}async function m_(s){await Pd(s.id,null).catch(()=>{}),delete fn[s.id],As("skf.faceCrops",fn);const e=fc.get(s.id),t=pi.get(s.id);if(pi.delete(s.id),e)try{const i=await Aa(s,e,e.url);t?.texture&&(i.texture=t.texture,i.texture.image=i.head,i.texture.needsUpdate=!0),pi.set(s.id,i)}catch{}$n++}const tr=Math.PI/2-.32,g_=new Set(["cast","grab","charge","whip","beam","counterStance","place","uppercut","summon","stomp","flurry","slamRise"]);class Fo{rig;anim=new Md;aura;shield;stars;prop=null;propStyle=null;whip;yaw=0;auraTimer=0;constructor(e){this.rig=_d(e,{face:n_(e.id)}),this.aura=new je(new pr(.5,1.1,6,16),vt(16777215,.18)),this.aura.position.y=.95,this.aura.visible=!1,this.rig.root.add(this.aura),this.shield=new je(new Pe(1.05,24,16),vt(10474495,.22)),this.shield.position.y=.95,this.shield.visible=!1,this.rig.root.add(this.shield),this.stars=new Nt;for(let t=0;t<3;t++){const i=Ea("star",16766474);i.scale.setScalar(.35),this.stars.add(i)}this.stars.visible=!1,this.rig.root.add(this.stars),this.whip=new je(new Ue(.018,.018,1,6),new yi({color:3811866})),this.whip.visible=!1,this.rig.root.add(this.whip),this.yaw=tr}syncFace(e,t,i){const n=this.rig.faceSprite;if(!n)return;const r=n.material;r.rotation=-this.anim.pivotX*t+this.anim.headRoll*.6*t+i,r.color.setRGB(1,1-e*.45,1-e*.5)}setProp(e,t){this.propStyle!==e&&(this.prop&&(this.rig.rHand.remove(this.prop),this.prop=null),this.propStyle=e,e&&(this.prop=Ea(e,t),this.prop.scale.setScalar(.7),this.prop.position.set(0,-.12,.05),this.prop.rotation.set(Math.PI/2,0,Math.PI/2),this.rig.rHand.add(this.prop)))}sync(e,t,i,n){const r=this.rig.root;this.anim.update(e,t,i),this.anim.apply(this.rig),r.visible=!this.anim.hidden;let a=e.x;e.flash>0&&t.hitstop>0&&(a+=(Math.random()-.5)*.08),r.position.set(a,e.y,e.z);const o=e.facing>0?tr:-tr,c=e.state==="air"||e.state==="juggle"?.25:.5;this.yaw+=(o-this.yaw)*Math.min(1,c*i*60),r.rotation.y=this.yaw;const l=e.flash>0?Math.min(1,e.flash/5)*.7:0,h=e.buffs.find(p=>p.kind!=="shield"&&p.kind!=="reflect"&&p.kind!=="slow"),d=t.ticks/60;for(const p of this.rig.materials)l>0?p.emissive.setRGB(l*.5,l*.42,l*.34):h?p.emissive.setHex(h.color).multiplyScalar(.18+.1*Math.sin(d*8)):e.lifelineUsed&&e.health<=1?p.emissive.setRGB(.3+.2*Math.sin(d*10),0,0):p.emissive.setRGB(0,0,0);this.syncFace(l,e.facing,e.state==="hitstun"||e.state==="cinematic"?Math.sin(d*40)*.15:0),this.aura.visible=!1;const u=h?.color??(e.state==="attack"&&e.move?.kind==="super"?e.move.color??16765440:e.meter>=100?16765440:null);if(u!==null&&n){this.auraTimer+=i*60;const p=h||e.move?.kind==="super"?2:6;for(;this.auraTimer>=p;)this.auraTimer-=p,n.burst(e.x+(Math.random()-.5)*.7,e.y+.1+Math.random()*1.2,(Math.random()-.5)*.4,u,1,.01,.035,-.0015,34)}const f=e.buff("shield")??e.buff("reflect");this.shield.visible=!!f,f&&(this.shield.material.color.setHex(f.color),this.shield.material.opacity=.15+.08*Math.sin(d*6)),this.stars.visible=e.state==="dizzy",this.stars.visible&&this.stars.children.forEach((m,M)=>{const T=d*4+M*Math.PI*2/3;m.position.set(Math.cos(T)*.35,1.95,Math.sin(T)*.35),m.rotation.y=T});const g=e.move;if(e.state==="cinematic"&&t.cinematic?.att===e&&t.cinematic?.prop?this.setProp(t.cinematic.prop,t.cinematic.color):e.state==="attack"&&g?.prop&&g_.has(g.anim)&&g.tag!=="projectile"&&g.tag!=="rain"?this.setProp(g.prop,g.color??16777215):this.setProp(null,0),this.whip.visible=!1,e.state==="attack"&&g?.tag==="pull"){const p=e.moveFrame;p>g.startup-2&&p<=g.startup+g.active+4&&(this.whip.visible=!0,this.whip.scale.set(1,3,1),this.whip.position.set(0,1.25,3/2+.4),this.whip.rotation.set(Math.PI/2,0,0),this.whip.material.color.setHex(g.color??3811866))}}dispose(){yd(this.rig)}}class v_{obj;glow=null;beam=null;core=null;constructor(e){if(this.obj=new Nt,e.kind==="beam"||e.kind==="mega"&&e.attach){const t=e.h/2;if(this.beam=new je(new Ue(t,t,1,20,1,!0),vt(e.color,.55)),this.beam.rotation.z=Math.PI/2,this.core=new je(new Ue(t*.45,t*.45,1,12,1,!0),vt(16777215,.9)),this.core.rotation.z=Math.PI/2,this.obj.add(this.beam,this.core),e.prop&&e.prop!=="wave"&&e.prop!=="sound"){const i=Ea(e.prop,e.color);i.scale.setScalar(1.2),i.userData.src=!0,this.obj.add(i)}}else{const t=Ea(e.prop,e.color);t.scale.setScalar(e.scale*(e.kind==="wave"||e.kind==="trap"?1.3:1.2)),t.userData.spin=!0,this.obj.add(t),this.glow=new je(new Pe(.32*e.scale,14,10),vt(e.color,.25)),this.obj.add(this.glow)}}sync(e,t){this.obj.position.set(e.x,e.y,.05);const i=e.attach?e.facing:Math.sign(e.vx)||e.facing;if(this.beam&&this.core){const r=e.w,a=1+.12*Math.sin(t*40);this.beam.scale.set(a,r,a),this.core.scale.set(1,r,1),this.obj.children.forEach(o=>{o.userData.src&&o.position.set(-i*(r/2-.1),0,0)});return}this.obj.visible=e.age>=e.delay||Math.floor(e.age/4)%2===0;const n=this.obj.children[0];if(n.scale.x=Math.abs(n.scale.x)*(i<0?-1:1),e.kind==="normal"||e.kind==="rain"||e.kind==="mega"?(n.rotation.z=e.prop==="plane"||e.prop==="jet"||e.prop==="train"||e.prop==="tank"||e.prop==="fire"||e.prop==="syringe"||e.prop==="envelope"?0:-i*e.age*e.spin,(e.prop==="coin"||e.prop==="shekel")&&(n.rotation.y=e.age*.3)):e.kind==="trap"&&(n.position.y=-.25+Math.sin(t*3)*.03),this.glow){const r=1+.15*Math.sin(t*20);this.glow.scale.setScalar(r)}}}class x_{renderer;scene=new Vu;camera=new ui(38,16/9,.1,400);effects=new Px;hemi=new ad(16777215,4473924,1);key=new wa(16777215,2.5);rim=new wa(8956671,1.2);stage=null;stageId="";views=[];projViews=new Map;showcase=[];camPos=new R(0,1.8,8);camLook=new R(0,1.1,0);shake=0;superFocus=null;time=0;showHitboxes=!1;hitboxGroup=new Nt;platform;constructor(e){this.renderer=new vd({canvas:e,antialias:!0,powerPreference:"high-performance"}),this.renderer.setPixelRatio(Math.min(2,window.devicePixelRatio||1)),this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=Ys,this.renderer.toneMapping=Pa,this.renderer.toneMappingExposure=1,this.renderer.outputColorSpace=Yt,this.key.castShadow=!0,this.key.shadow.mapSize.set(2048,2048);const t=this.key.shadow.camera;t.left=-14,t.right=14,t.top=10,t.bottom=-6,t.near=1,t.far=60,this.key.shadow.bias=-5e-4,this.key.shadow.normalBias=.02,this.scene.add(this.hemi,this.key,this.key.target,this.rim,this.effects.group,this.hitboxGroup),this.platform=new je(new Ue(1.6,1.8,.2,40),new dn({color:1778496,metalness:.4,roughness:.4})),this.platform.visible=!1,this.scene.add(this.platform),this.resize()}setQuality(e){const t=e==="low";this.renderer.setPixelRatio(t?1:Math.min(2,window.devicePixelRatio||1)),this.renderer.shadowMap.enabled=!t,this.key.castShadow=!t,this.scene.traverse(i=>{const n=i.material;n&&(n.needsUpdate=!0)}),this.resize()}resize(){const e=this.renderer.domElement,t=e.clientWidth||window.innerWidth,i=e.clientHeight||window.innerHeight;this.renderer.setSize(t,i,!1),this.camera.aspect=t/i,this.camera.updateProjectionMatrix()}setStage(e){if(this.stageId===e.id&&this.stage)return;this.stage&&(this.scene.remove(this.stage.group),nu(this.stage)),this.stage=Ix(e),this.stageId=e.id,this.scene.add(this.stage.group);const t=this.stage.lighting;this.scene.background=new Xe(t.background),this.scene.fog=new jl(t.fog[0],t.fog[1],t.fog[2]),this.hemi.color.setHex(t.hemiSky),this.hemi.groundColor.setHex(t.hemiGround),this.hemi.intensity=t.hemiIntensity,this.key.color.setHex(t.key),this.key.intensity=t.keyIntensity,this.key.position.set(...t.keyPos),this.rim.color.setHex(t.rim),this.rim.intensity=t.rimIntensity,this.rim.position.set(-4,6,-10)}clearStage(){this.stage&&(this.scene.remove(this.stage.group),nu(this.stage),this.stage=null,this.stageId=""),this.scene.background=new Xe(329485),this.scene.fog=null,this.hemi.color.setHex(14542591),this.hemi.groundColor.setHex(2236979),this.hemi.intensity=1.2,this.key.color.setHex(16777215),this.key.intensity=2.8,this.key.position.set(3,8,8),this.rim.color.setHex(7310335),this.rim.intensity=2.2,this.rim.position.set(-4,5,-6)}setFighters(e){for(const t of this.views)this.scene.remove(t.rig.root),t.dispose();this.views=e.map(t=>{const i=new Fo(t);return this.scene.add(i.rig.root),i});for(const t of this.projViews.values())this.scene.remove(t.obj);this.projViews.clear(),this.effects.clear(),this.superFocus=null}clearFighters(){this.setFighters([])}handleEvent(e,t){const i=this.effects;switch(e.t){case"hit":i.hitSpark(e.x,e.y,.35,e.spark,e.blocked,e.color),!e.blocked&&(e.spark==="heavy"||e.spark==="super"||e.counter)&&(this.shake=Math.max(this.shake,e.spark==="super"?.18:.08));break;case"superFlash":{const n=t.fighters[e.fighter];this.superFocus={fighter:e.fighter,frames:48},i.ring(n.x,1.1,.4,e.color,.3,3.5,30),i.burst(n.x,1.2,.3,e.color,50,.14,.07,.001,40);break}case"special":{const n=t.fighters[e.fighter];i.burst(n.x,1,.3,e.color,10,.05,.04,.001,18);break}case"teleport":i.burst(e.fromX,1,.2,e.color,30,.09,.06,0,26),i.burst(e.toX,1,.2,e.color,30,.09,.06,0,26),i.ring(e.toX,1,.3,e.color,.2,1.6,16);break;case"buff":{const n=t.fighters[e.fighter];i.ring(n.x,.05,0,e.color,.3,2.2,24,!0),i.burst(n.x,.8,.2,e.color,26,.07,.05,-.002,36);break}case"clash":i.burst(e.x,e.y,.2,16777215,24,.1,.05,.002,20),i.ring(e.x,e.y,.3,16777215,.2,1.2,14);break;case"tech":i.ring(e.x,e.y,.3,16777215,.2,1.4,14),i.burst(e.x,e.y,.2,11195647,20,.09,.05,.001,16);break;case"lifeline":{const n=t.fighters[e.fighter];i.flash(n.x,1,.2,16765440,2.5,20),i.burst(n.x,1,.2,16765440,60,.15,.07,.002,40),this.shake=.2;break}case"land":if(e.hard){const n=t.fighters[e.fighter];i.burst(n.x,.1,.1,12101768,16,.05,.06,.002,26)}break;case"shake":this.shake=Math.max(this.shake,e.amount);break;case"ko":{if(e.loser>=0){const n=t.fighters[e.loser];i.flash(n.x,1,.2,16777215,3,16)}break}}}syncFight(e,t){this.time+=t,this.platform.visible=!1,this.views.forEach((n,r)=>n.sync(e.fighters[r],e,t,this.effects));const i=new Set;for(const n of e.projectiles){i.add(n.id);let r=this.projViews.get(n.id);r||(r=new v_(n),this.projViews.set(n.id,r),this.scene.add(r.obj)),r.sync(n,this.time)}for(const[n,r]of this.projViews)if(!i.has(n)){const a=r.obj.position;this.effects.burst(a.x,a.y,a.z,16777215,8,.05,.035,.002,14),this.scene.remove(r.obj),this.projViews.delete(n)}this.stage?.update(this.time),this.effects.update(t),this.updateFightCamera(e,t),this.drawHitboxes(e)}updateFightCamera(e,t){const[i,n]=e.fighters,r=1-Math.exp(-t*6),a=new R,o=new R,c=(i.x+n.x)/2,l=Math.abs(i.x-n.x),h=Math.max(i.y,n.y);if(e.freeze>0&&this.superFocus){const d=e.fighters[this.superFocus.fighter];a.set(d.x-d.facing*.5,1.45,2.7),o.set(d.x+d.facing*.25,1.35,0),this.lerpCam(a,o,1-Math.exp(-t*12))}else if(e.cinematic){const d=e.cinematic,u=(d.att.x+d.def.x)/2,f=d.frame*.02-.6;a.set(u+Math.sin(f)*4.2,1.5+Math.sin(d.frame*.05)*.3,Math.cos(f)*4.2),o.set(u,1.1,0),this.lerpCam(a,o,1-Math.exp(-t*5))}else if(e.phase==="intro"){const d=e.phaseFrame<100,u=d?i:n;a.set(u.x-u.facing*-1.2+(d?1.2:-1.2),1.6,3.4),o.set(u.x,1.3,0),this.lerpCam(a,o,1-Math.exp(-t*3))}else if(e.phase==="ko"&&e.phaseFrame<100&&e.roundWinner!==null){const d=e.fighters.find(u=>u.koed)??i;a.set(c+(d.x-c)*.5,1.5,5.2),o.set(d.x*.6+c*.4,.9,0),this.lerpCam(a,o,1-Math.exp(-t*2.5))}else if(e.phase==="matchEnd"&&e.matchWinner!==null&&e.matchWinner>=0){const d=e.fighters[e.matchWinner],u=Math.sin(this.time*.3)*.3;a.set(d.x+Math.sin(u)*3.6,1.55,Math.cos(u)*3.6),o.set(d.x,1.2,0),this.lerpCam(a,o,1-Math.exp(-t*2))}else{const d=Math.max(5.8,Math.min(10,5+l*.62)),u=10.5-d*.45,f=Math.max(-u,Math.min(u,c));a.set(f,1.75+h*.35,d),o.set(f,1.12+h*.3,0),this.lerpCam(a,o,r)}this.superFocus&&(this.superFocus.frames--,this.superFocus.frames<=0&&e.freeze<=0&&(this.superFocus=null)),this.applyCamera(t)}lerpCam(e,t,i){this.camPos.lerp(e,i),this.camLook.lerp(t,i)}applyCamera(e){this.camera.position.copy(this.camPos),this.shake>.001&&(this.camera.position.x+=(Math.random()-.5)*this.shake,this.camera.position.y+=(Math.random()-.5)*this.shake,this.shake*=Math.pow(.86,e*60)),this.camera.lookAt(this.camLook)}drawHitboxes(e){if(this.hitboxGroup.visible=this.showHitboxes,!this.showHitboxes)return;for(;this.hitboxGroup.children.length;)this.hitboxGroup.children.pop().geometry.dispose();const t=(i,n,r,a,o)=>{const c=new je(new ci(r,a),new yi({color:o,transparent:!0,opacity:.35,depthTest:!1}));c.position.set(i,n,.8),c.renderOrder=999,this.hitboxGroup.add(c)};for(const i of e.fighters){for(const r of i.hurtboxes())t(r.x,r.y,r.w,r.h,3407718);const n=i.activeHitbox();n&&t(n.x,n.y,n.w,n.h,16720452)}for(const i of e.projectiles)i.active&&t(i.x,i.y,i.w,i.h,16750882)}setShowcase(e,t=!0){for(const i of this.showcase)i&&(this.scene.remove(i.view.rig.root),i.view.dispose());this.showcase=e.map(i=>{const n=new Fo(i.def);return n.rig.root.position.set(i.x,0,0),this.scene.add(n.rig.root),{view:n,slot:i}}),this.platform.visible=t&&e.length>0,this.views.forEach(i=>i.rig.root.visible=!1)}updateShowcaseSlot(e,t){const i=this.showcase[e];if(i&&t&&i.slot.def.id===t.def.id){i.slot=t;return}if(i&&(this.scene.remove(i.view.rig.root),i.view.dispose()),!t){this.showcase[e]=void 0;return}const n=new Fo(t.def);this.scene.add(n.rig.root),this.showcase[e]={view:n,slot:t}}syncShowcase(e,t){this.time+=e;const i=this.showcaseCount;this.showcase.forEach((r,a)=>{if(!r)return;const{view:o,slot:c}=r;o.anim.showcase(e,this.time,c.pose,c.variant??0,a*1.7),o.anim.apply(o.rig);const l=o.rig.root;l.visible=!0,l.position.set(c.x,this.platform.visible&&i===1?.1:0,0),l.rotation.y=c.facing>0?tr-.5:-tr+.5;for(const h of o.rig.materials)h.emissive.setRGB(0,0,0);o.aura.visible=!1,o.shield.visible=!1,o.stars.visible=!1}),this.stage?.update(this.time),this.effects.update(e);const n=1-Math.exp(-e*4);this.lerpCam(new R(...t.pos),new R(...t.look),n),this.applyCamera(e)}get showcaseCount(){return this.showcase.filter(Boolean).length}get currentStage(){return this.stageId}clearShowcase(){this.setShowcase([],!1)}snapCamera(e,t){this.camPos.set(...e),this.camLook.set(...t)}render(){this.renderer.render(this.scene,this.camera)}}class __{canvas;ui;renderer;input=new rf;audio=new Qd;settings=hf();screen=null;arcade=null;lastSetup=null;desktop=window.skfDesktop??null;quality="high";acc=0;last=0;fps=0;constructor(){this.canvas=document.getElementById("game"),this.ui=document.getElementById("ui"),this.renderer=new x_(this.canvas),this.applySettings(),window.addEventListener("resize",()=>this.renderer.resize());const e=()=>this.audio.unlock();window.addEventListener("keydown",e),window.addEventListener("pointerdown",e),window.addEventListener("keydown",t=>{t.code==="F11"&&!this.desktop&&(t.preventDefault(),this.toggleFullscreen())})}applySettings(){const e=this.settings;this.audio.volumes={master:e.masterVolume,music:e.musicVolume,sfx:e.sfxVolume},this.audio.announcer=e.announcer,this.audio.applyVolumes(),this.input.rumbleEnabled=e.rumble,this.renderer.showHitboxes=e.showHitboxes,t_(e.faces),this.quality!==e.quality&&(this.quality=e.quality,this.renderer.setQuality(e.quality)),uf(e)}toggleFullscreen(){if(this.desktop){this.desktop.toggleFullscreen();return}document.fullscreenElement?document.exitFullscreen().catch(()=>{}):document.documentElement.requestFullscreen().catch(()=>{})}go(e){this.screen?.exit(),this.ui.innerHTML="",this.screen=e,e.enter()}start(){const e=t=>{const i=this.last?Math.min(.1,(t-this.last)/1e3):1/za;this.last=t,this.fps=this.fps*.95+1/Math.max(i,.001)*.05,this.acc+=i;let n=0;for(;this.acc>=1/za&&n<5;)this.input.poll(),this.input.anyPressed()&&this.audio.unlock(),this.screen?.tick(),this.acc-=1/za,n++;n===5&&(this.acc=0),this.screen?.frame(i),this.renderer.render(),requestAnimationFrame(e)};requestAnimationFrame(e)}glyphStyle(e){const t=this.input.padInfo(e);return!t||this.input.lastDevice[e]!=="pad"?"kb":t.kind==="xbox"?"xbox":"ps"}menuStyle(){const e=this.input.connectedPads();if(!e.length||this.input.lastDevice[0]!=="pad"&&this.input.lastDevice[1]!=="pad")return"kb";const t=this.input.lastDevice[0]==="pad"?0:1;return(this.input.padInfo(t)??e[0]).kind==="xbox"?"xbox":"ps"}glyph(e,t=0,i){const n=i??this.glyphStyle(t);return`<span class="g ${cf(e,n)}">${lf(e,n,t)}</span>`}mg(e){const t=this.menuStyle();if(t==="ps"){const n={confirm:["g-cross","✕"],back:["g-circle","○"],extra:["g-triangle","△"],extra2:["g-square","□"],start:["g-shoulder","OPTIONS"]}[e];return`<span class="g ${n[0]}">${n[1]}</span>`}return t==="xbox"?`<span class="g g-key">${{confirm:"A",back:"B",extra:"Y",extra2:"X",start:"MENU"}[e]}</span>`:`<span class="g g-key">${{confirm:"Enter",back:"Esc",extra:"I",extra2:"O",start:"Esc"}[e]}</span>`}}const rt={light:15845285,fair:15251604,medium:14262908,warm:14921868,olive:13012579,deep:7029808},Lt={black:1709330,dark:2827296,brown:4862498,light:11569754,grey:10132122,silver:13158600,salt:7236198},pe={navy:1780298,charcoal:2961206,black:1118742,slate:3820126,steel:2240831,white:16053492,paleBlue:14674421},bt=[{id:"netanyahu",name:"Benjamin Netanyahu",nameHe:"בנימין נתניהו",nick:"Bibi",party:"likud",role:"Prime Minister",bio:"Israel's longest-serving Prime Minister. Has survived more no-confidence motions than anyone can count.",style:"technician",stats:{health:1.05,speed:.96},look:{skin:rt.fair,height:1.03,build:1.14,hair:"side",hairColor:13619151,outfit:"suit",jacket:pe.navy,shirt:pe.white,tie:2776496,pants:pe.navy},specials:[{type:"projectile",name:"Red Line Bomb",prop:"bomb",color:16726843,arc:!0,damage:95,desc:"Lobs a cartoon bomb with a red line drawn on it."},{type:"teleport",name:"Coalition Shuffle",color:5219327,mode:"behind",attack:!0,desc:"Swaps partners, and sides. Reappears behind you with a strike."},{type:"shield",name:"Iron Dome",color:10474495,hits:3,desc:"Intercepts the next three incoming attacks."}],ultimate:{type:"cinematic",name:"Sixth Term",color:2780159,prop:"ballot",damage:390},passive:{id:"lifeline",name:"Political Survivor",desc:"Once per match, survives a knockout blow with 1 HP."},quotes:{intro:"I've been here before. I'll be here after.",win:"They said it was over. It's never over."}},{id:"levin",name:"Yariv Levin",nameHe:"יריב לוין",party:"likud",role:"Deputy PM & Justice Minister",bio:"Architect of the judicial overhaul. Treats every court ruling as a personal challenge.",style:"zoner",stats:{health:1},look:{skin:rt.fair,height:.98,build:1.14,hair:"receding",hairColor:Lt.dark,outfit:"suit",jacket:pe.charcoal,shirt:pe.white,tie:8003371,pants:pe.charcoal},specials:[{type:"projectile",name:"Judicial Gavel",prop:"gavel",color:12618302,damage:85},{type:"counter",name:"Reasonableness Clause",color:16765286,damage:150,desc:"Declares the attack unreasonable and strikes back."},{type:"grab",name:"Committee Selection",color:9067775,damage:180,desc:"Appoints you to a very uncomfortable committee."}],ultimate:{type:"megarain",name:"The Overhaul",color:12618302,prop:"gavel"},passive:{id:"chipMaster",name:"Override Clause",desc:"Blocking him still hurts: triple chip damage."},quotes:{intro:"Objection overruled. By me.",win:"The court has been... reformed."}},{id:"israel-katz",name:"Israel Katz",nameHe:'ישראל כ"ץ',party:"likud",role:"Defense Minister",bio:"Former Transport Minister who built roads, rails and interchanges. Now runs defense like a construction project.",style:"brawler",stats:{health:1.1,speed:.9,power:1.05,weight:1.2},look:{skin:rt.warm,height:1.02,build:1.32,hair:"horseshoe",hairColor:Lt.silver,outfit:"suit",jacket:2831430,shirt:pe.white,tie:2052e3,pants:2831430},specials:[{type:"wave",name:"Light Rail Line",prop:"train",color:14034984,damage:80,desc:"Sends a light-rail car along the floor. Block low!"},{type:"rush",name:"Express Train",color:16758531,hits:3,damage:130,armor:!0,prop:"train",desc:"Armored charge like an express train."},{type:"rising",name:"Interchange Uppercut",color:16766474,hits:2,damage:125}],ultimate:{type:"megaprojectile",name:"National Infrastructure Plan",color:16739125,prop:"train"},passive:{id:"heavyArmor",name:"Heavyweight",desc:"Heavy attacks absorb one hit during startup."},quotes:{intro:"Clear the tracks.",win:"Another project completed ahead of schedule."}},{id:"ohana",name:"Amir Ohana",nameHe:"אמיר אוחנה",party:"likud",role:"Speaker of the Knesset",bio:"Runs the plenum with an iron gavel. Order in the house is non-negotiable.",style:"technician",stats:{speed:1.05},look:{skin:rt.medium,height:1,build:.95,hair:"short",hairColor:Lt.black,outfit:"suit",jacket:1842982,shirt:pe.white,tie:3160658,pants:1842982},specials:[{type:"projectile",name:"Order! Order!",prop:"sound",color:16044894,damage:50,effect:{stun:40},desc:"A booming call to order that stuns."},{type:"grab",name:"Removal From the Plenum",color:15087942,damage:160,range:1.4,desc:"Has you escorted out of the chamber. Forcefully."},{type:"rising",name:"Session Adjourned",color:16044894,damage:120}],ultimate:{type:"megarain",name:"Emergency Session",color:4553629,prop:"chair"},passive:{id:"meterBoost",name:"Speaker's Privilege",desc:"Builds Ultimate meter 30% faster."},quotes:{intro:"The member is out of order.",win:"This session is adjourned."}},{id:"regev",name:"Miri Regev",nameHe:"מירי רגב",party:"likud",role:"Transport Minister",bio:"Former IDF spokesperson and Culture Minister. Now controls every road, runway and traffic light.",style:"rushdown",stats:{speed:1.02},look:{skin:rt.medium,height:.94,build:.92,hair:"bob",hairColor:Lt.black,outfit:"blazer",jacket:12653087,shirt:1118481,tie:null,pants:1118481,female:!0},specials:[{type:"trap",name:"Traffic Jam",prop:"cone",color:16743168,damage:40,effect:{slow:180},desc:"Drops a traffic cone. Step on it and you're stuck in traffic."},{type:"rush",name:"Highway Rush",color:16759304,hits:2,damage:115,distance:4},{type:"spin",name:"Red Carpet Spin",color:13631488,hits:4,damage:105}],ultimate:{type:"cinematic",name:"Grand Opening Ceremony",color:16764928,prop:"scissors"},passive:{id:"rage",name:"Culture War",desc:"Deals 25% more damage below 30% health."},quotes:{intro:"This road is closed. For you.",win:"Cut the ribbon!"}},{id:"amsalem",name:"David Amsalem",nameHe:"דוד אמסלם",nick:"Dudi",party:"likud",role:"Minister & Likud MK",bio:"Famous for plenum speeches you can hear from Tel Aviv. Volume: maximum.",style:"brawler",stats:{power:1.08,speed:.95,weight:1.15},look:{skin:rt.medium,height:1,build:1.22,hair:"bald",hairColor:3355443,facialHair:"stubble",facialHairColor:3355443,outfit:"open-suit",jacket:pe.charcoal,shirt:15395562,tie:null,pants:pe.charcoal},specials:[{type:"beam",name:"Sonic Rant",prop:"sound",color:16765286,length:3.6,damage:120,hits:5,desc:"A point-blank blast of pure volume."},{type:"wave",name:"Plenum Stomp",color:15167313,damage:80},{type:"rising",name:"Table Flip",prop:"chair",color:10506797,damage:130}],ultimate:{type:"megabeam",name:"Ultimate Shouting Match",color:16711790,prop:"sound"},passive:{id:"ironWill",name:"Thick Skull",desc:"Shrugs off hits: 15% shorter hitstun."},quotes:{intro:"Sit down! I have the floor!",win:"Did everyone hear that? Good."}},{id:"barkat",name:"Nir Barkat",nameHe:"ניר ברקת",party:"likud",role:"Economy Minister",bio:"Tech millionaire and former Mayor of Jerusalem. Treats every fight like a startup exit.",style:"balanced",stats:{speed:1.05,jump:1.08},look:{skin:rt.light,height:1.07,build:.95,hair:"receding",hairColor:10129286,outfit:"suit",jacket:pe.slate,shirt:pe.paleBlue,tie:1914199,pants:pe.slate},specials:[{type:"projectile",name:"Startup Pitch",prop:"laptop",color:5032432,damage:80},{type:"dive",name:"Angel Investor Dive",color:5032432,damage:95},{type:"rising",name:"Market Rally",prop:"coin",color:5420936,damage:120,hits:3}],ultimate:{type:"megaprojectile",name:"Unicorn Valuation",color:16766474,prop:"coin"},passive:{id:"deepPockets",name:"Deep Pockets",desc:"Starts every round with half a meter."},quotes:{intro:"Let's disrupt this.",win:"Exit achieved. Acquired for a billion."}},{id:"gotliv",name:"Tally Gotliv",nameHe:"טלי גוטליב",party:"likud",role:"Likud MK",bio:"Criminal lawyer turned firebrand MK. Objects to everything, loudly.",style:"rushdown",stats:{},look:{skin:rt.fair,height:.96,build:.9,hair:"wavy",hairColor:Lt.brown,outfit:"blazer",jacket:pe.black,shirt:pe.white,tie:null,pants:pe.black,female:!0},specials:[{type:"projectile",name:"Legal Brief",prop:"paper",color:15858414,count:3,damage:36},{type:"barrage",name:"Cross-Examination",color:15087942,hits:7,damage:120},{type:"counter",name:"Objection!",color:16758531,damage:140}],ultimate:{type:"cinematic",name:"Closing Argument",color:15087942,prop:"book"},passive:{id:"counterPunch",name:"Sustained!",desc:"Counter-hits deal 50% extra damage."},quotes:{intro:"Objection! Your Honor, look at this!",win:"No further questions."}},{id:"karhi",name:"Shlomo Karhi",nameHe:"שלמה קרעי",party:"likud",role:"Communications Minister",bio:"Wants to reform the airwaves, the public broadcaster and possibly your phone plan.",style:"zoner",stats:{},look:{skin:rt.medium,height:1,build:1,hair:"short",hairColor:Lt.black,facialHair:"short",facialHairColor:Lt.black,headwear:"kippah-knit",headwearColor:2838698,outfit:"open-suit",jacket:pe.navy,shirt:pe.white,tie:null,pants:pe.navy},specials:[{type:"beam",name:"Broadcast Signal",prop:"dish",color:4770532,length:4.5,hits:4,damage:110},{type:"pull",name:"Pull the Plug",prop:"phone",color:9494767,damage:55},{type:"trap",name:"5G Tower",prop:"tower",color:16735631,effect:{stun:45}}],ultimate:{type:"megarain",name:"Media Reform",color:46296,prop:"tv"},passive:{id:"drainer",name:"Frequency Auction",desc:"Every hit drains the opponent's meter."},quotes:{intro:"This channel is now under review.",win:"And we're off the air."}},{id:"may-golan",name:"May Golan",nameHe:"מאי גולן",party:"likud",role:"Minister for Social Equality",bio:"Minister for the Advancement of Women. Advances mostly toward her opponents.",style:"rushdown",stats:{speed:1.03},look:{skin:rt.medium,height:.95,build:.9,hair:"long",hairColor:Lt.black,outfit:"blazer",jacket:15921906,shirt:2236962,tie:null,pants:2236962,female:!0},specials:[{type:"projectile",name:"Hot Take",prop:"fire",color:16733184,damage:80,speed:.19},{type:"rush",name:"Spotlight Dash",color:16764928,damage:110,launch:!0},{type:"rising",name:"Headline Kick",color:16711764,damage:120,hits:2}],ultimate:{type:"megarain",name:"Viral Moment",color:16733184,prop:"phone"},passive:{id:"swift",name:"Fast Track",desc:"Moves 18% faster."},quotes:{intro:"You're trending. Not in a good way.",win:"Screenshot that."}},{id:"edelstein",name:"Yuli Edelstein",nameHe:"יולי אדלשטיין",party:"likud",role:"Likud MK, former Speaker",bio:"Former Soviet refusenik, Knesset Speaker and Health Minister who ran the vaccine drive. Unbreakable.",style:"technician",stats:{defense:1.06},look:{skin:rt.light,height:.98,build:1.05,hair:"receding",hairColor:13684944,facialHair:"full",facialHairColor:14211288,glasses:"rect",headwear:"kippah-knit",headwearColor:3158064,outfit:"suit",jacket:pe.charcoal,shirt:pe.white,tie:5925772,pants:pe.charcoal},specials:[{type:"projectile",name:"Booster Shot",prop:"syringe",color:8454107,damage:70,speed:.22,effect:{lifesteal:25},desc:"A fast dart that heals him on hit."},{type:"slam",name:"Speaker's Chair Drop",prop:"chair",color:10322313,damage:120},{type:"heal",name:"Green Pass",color:5420936,amount:90}],ultimate:{type:"megarain",name:"Mass Vaccination Drive",color:8454107,prop:"syringe"},passive:{id:"ironWill",name:"Refusenik",desc:"Unbreakable will: 15% shorter hitstun."},quotes:{intro:"I've faced tougher interrogations.",win:"Next patient, please."}},{id:"saar",name:"Gideon Sa'ar",nameHe:"גדעון סער",party:"likud",role:"Foreign Minister",bio:"Left Likud, founded New Hope, merged back into Likud. Always finds his way home.",style:"zoner",stats:{},look:{skin:rt.fair,height:1.06,build:.98,hair:"bald",hairColor:Lt.grey,outfit:"suit",jacket:pe.steel,shirt:pe.white,tie:3835647,pants:pe.steel},specials:[{type:"projectile",name:"Diplomatic Cable",prop:"envelope",color:10670847,damage:75,homing:!0},{type:"grab",name:"Party Merger",color:3835647,damage:175,desc:"Absorbs your party. And you."},{type:"teleport",name:"Return Flight",color:12443902,mode:"behind",attack:!0}],ultimate:{type:"cinematic",name:"Summit Meeting",color:3835647,prop:"flag"},passive:{id:"regen",name:"New Hope",desc:"Recovers part of his lost health when not taking damage."},quotes:{intro:"I left. I came back. Now I'm here for you.",win:"Diplomacy by other means."}},{id:"dichter",name:"Avi Dichter",nameHe:"אבי דיכטר",party:"likud",role:"Agriculture Minister",bio:"Former head of the Shin Bet, now in charge of farms. Knows where you are, and what you ate.",style:"technician",stats:{},look:{skin:rt.fair,height:1,build:1.02,hair:"bald",hairColor:11184810,outfit:"suit",jacket:3881787,shirt:pe.white,tie:2792847,pants:3881787},specials:[{type:"projectile",name:"Tomato Toss",prop:"tomato",color:15087942,count:2,arc:!0,damage:50},{type:"teleport",name:"Covert Op",color:2829634,mode:"behind",attack:!0},{type:"wave",name:"Harvest Sweep",prop:"leaf",color:8435992,damage:80}],ultimate:{type:"megarain",name:"Agricultural Reform",color:5613104,prop:"watermelon"},passive:{id:"quickRecovery",name:"Shin Bet Training",desc:"Gets up faster, and his backdash is invincible."},quotes:{intro:"We've had a file on you for years.",win:"Harvest season."}},{id:"silman",name:"Idit Silman",nameHe:"עידית סילמן",party:"likud",role:"Environmental Protection Minister",bio:"Brought down a government by crossing the floor. Now she recycles opponents.",style:"balanced",stats:{},look:{skin:rt.fair,height:.94,build:.92,hair:"bob",hairColor:3877407,outfit:"skirt",jacket:2976335,shirt:pe.white,tie:null,pants:2976335,female:!0},specials:[{type:"projectile",name:"Recycling Bin",prop:"bin",color:2976335,arc:!0,damage:90},{type:"teleport",name:"Crossing the Floor",color:9819570,mode:"behind",attack:!0},{type:"shield",name:"Green Shield",color:7653021,hits:2}],ultimate:{type:"megarain",name:"Coalition Collapse",color:5420936,prop:"brick"},passive:{id:"projectileProof",name:"Sustainable",desc:"Takes half damage from projectiles."},quotes:{intro:"I've switched sides before.",win:"Reduce. Reuse. Defeat."}},{id:"ofir-katz",name:"Ofir Katz",nameHe:"אופיר כץ",party:"likud",role:"Coalition Whip",bio:"Keeps the coalition in line, one late-night vote at a time.",style:"rushdown",stats:{},look:{skin:rt.warm,height:1,build:1.02,hair:"short",hairColor:Lt.dark,facialHair:"stubble",facialHairColor:Lt.dark,outfit:"suit",jacket:pe.navy,shirt:pe.white,tie:2508371,pants:pe.navy},specials:[{type:"pull",name:"The Whip",color:15320170,damage:60,desc:"Cracks the coalition whip and drags you into line."},{type:"rush",name:"Emergency Vote",color:16032353,hits:2,damage:115},{type:"rising",name:"Party Discipline",color:15167313,damage:120}],ultimate:{type:"cinematic",name:"Coalition Lockdown",color:15320170,prop:"ballot"},passive:{id:"comboMaster",name:"Three-Line Whip",desc:"Combos lose less damage to scaling."},quotes:{intro:"Nobody leaves until the vote passes.",win:"Motion carried."}},{id:"kisch",name:"Yoav Kisch",nameHe:"יואב קיש",party:"likud",role:"Education Minister",bio:"Former combat pilot, now Education Minister. Grades on a curve. A ballistic one.",style:"rushdown",stats:{jump:1.1,speed:1.04},look:{skin:rt.fair,height:1.03,build:.98,hair:"short",hairColor:3877407,outfit:"suit",jacket:2508371,shirt:pe.white,tie:2792847,pants:2508371},specials:[{type:"projectile",name:"Paper Airplane",prop:"plane",color:15858414,damage:70,speed:.18,homing:!0},{type:"dive",name:"Dive Bomb",color:9358054,damage:95},{type:"rising",name:"Report Card",color:16758531,damage:115,height:1.1}],ultimate:{type:"megarain",name:"Final Exam",color:2203324,prop:"book"},passive:{id:"doubleJump",name:"Top Gun",desc:"Can jump again in mid-air."},quotes:{intro:"Pop quiz. Are you ready?",win:"See me after class."}},{id:"lapid",name:"Yair Lapid",nameHe:"יאיר לפיד",party:"yeshatid",role:"Leader of the Opposition",bio:"Former TV anchor, novelist and Prime Minister. Keeps boxing gloves in the office, just in case.",style:"rushdown",stats:{speed:1.04,power:1.02},look:{skin:rt.fair,height:1.04,build:1,hair:"swept",hairColor:12566463,outfit:"open-suit",jacket:pe.black,shirt:1381914,tie:null,pants:pe.black},specials:[{type:"projectile",name:"Breaking News",prop:"mic",color:42747,damage:80},{type:"barrage",name:"Anchorman Combo",color:361162,hits:6,damage:115},{type:"rising",name:"Rotation Agreement",color:42747,hits:3,damage:125}],ultimate:{type:"cinematic",name:"There Is A Future",color:42747,prop:"tv"},passive:{id:"meterBoost",name:"Prime Time",desc:"Builds Ultimate meter 30% faster."},quotes:{intro:"Good evening. Tonight's top story: you, losing.",win:"And that's the news."}},{id:"ben-ari",name:"Merav Ben-Ari",nameHe:"מירב בן ארי",party:"yeshatid",role:"Yesh Atid MK",bio:"Committee veteran who never misses question time.",style:"technician",stats:{},look:{skin:rt.light,height:.95,build:.92,hair:"long",hairColor:Lt.light,outfit:"blazer",jacket:30646,shirt:pe.white,tie:null,pants:pe.navy,female:!0},specials:[{type:"projectile",name:"Parliamentary Question",prop:"paper",color:9494767,damage:45,effect:{stun:35}},{type:"spin",name:"Spin Kick Motion",color:46296,hits:4},{type:"counter",name:"Point of Clarification",color:4770532,damage:135}],ultimate:{type:"megabeam",name:"Motion to the Agenda",color:38599,prop:"wave"},passive:{id:"counterPunch",name:"Follow-up Question",desc:"Counter-hits deal 50% extra damage."},quotes:{intro:"I have a follow-up question.",win:"Thank you. The committee is satisfied."}},{id:"gantz",name:"Benny Gantz",nameHe:"בני גנץ",party:"nationalunity",role:"Chairman, Blue and White",bio:"Former IDF Chief of Staff. Tall, calm, and has entered and left more governments than anyone.",style:"balanced",stats:{health:1.08,defense:1.04},look:{skin:rt.light,height:1.1,build:1.02,hair:"short",hairColor:11053224,outfit:"suit",jacket:pe.navy,shirt:pe.paleBlue,tie:4756975,pants:pe.navy},specials:[{type:"slam",name:"Paratrooper Drop",color:4756975,damage:125},{type:"rush",name:"Blue & White Charge",color:4415982,armor:!0,damage:115,distance:3.6},{type:"counter",name:"Unity Guard",color:12443902,damage:145}],ultimate:{type:"cinematic",name:"Joint Operation",color:4415982,prop:"flag"},passive:{id:"thickSkin",name:"Chief of Staff",desc:"Takes 14% less damage."},quotes:{intro:"Israel before everything. Including you.",win:"Mission accomplished. For now."}},{id:"eisenkot",name:"Gadi Eisenkot",nameHe:"גדי איזנקוט",party:"yashar",role:"Former IDF Chief of Staff",bio:"Soft-spoken strategist who plans ten moves ahead. Started his own party to say it straight.",style:"technician",stats:{},look:{skin:rt.medium,height:.98,build:1,hair:"buzz",hairColor:9079434,outfit:"suit",jacket:pe.charcoal,shirt:pe.white,tie:7107965,pants:pe.charcoal},specials:[{type:"trap",name:"Battle Plan",prop:"map",color:5800279,effect:{stun:50}},{type:"teleport",name:"Flanking Maneuver",color:3824192,mode:"behind",attack:!0},{type:"beam",name:"Straight Talk",prop:"sound",color:14342093,length:3.2,damage:110,hits:4}],ultimate:{type:"megarain",name:"Chief's Directive",color:5800279,prop:"jet"},passive:{id:"powerSurge",name:"Strategist",desc:"Special moves deal 20% more damage."},quotes:{intro:"I've already planned this fight.",win:"As expected."}},{id:"tropper",name:"Chili Tropper",nameHe:"חילי טרופר",party:"nationalunity",role:"National Unity MK",bio:"Former teacher and Culture & Sport Minister. Delivers a lecture with every punch.",style:"balanced",stats:{},look:{skin:rt.fair,height:1.02,build:.96,hair:"short",hairColor:Lt.dark,facialHair:"stubble",facialHairColor:Lt.dark,outfit:"open-suit",jacket:pe.slate,shirt:pe.white,tie:null,pants:pe.slate},specials:[{type:"projectile",name:"Chalk Toss",prop:"chalk",color:16777215,count:2,damage:45,speed:.2},{type:"rush",name:"Sports Tackle",prop:"ball",color:16219904,damage:110,launch:!0},{type:"rising",name:"Culture Kick",color:16564041,damage:115,hits:2}],ultimate:{type:"cinematic",name:"Final Whistle",color:16219904,prop:"whistle"},passive:{id:"regen",name:"Team Player",desc:"Recovers part of his lost health when not taking damage."},quotes:{intro:"Class is in session.",win:"Homework: practice more."}},{id:"tamano-shata",name:"Pnina Tamano-Shata",nameHe:"פנינה תמנו-שטה",party:"nationalunity",role:"National Unity MK",bio:"Trailblazing lawyer and former Aliyah Minister. Breaks glass ceilings for a living.",style:"rushdown",stats:{speed:1.04},look:{skin:rt.deep,height:.95,build:.9,hair:"braids",hairColor:1314572,outfit:"blazer",jacket:16758531,shirt:pe.white,tie:null,pants:pe.navy,female:!0},specials:[{type:"projectile",name:"Aliyah Flight",prop:"plane",color:9358054,damage:80,speed:.18},{type:"rush",name:"Integration Drive",color:16758531,hits:2,damage:115},{type:"rising",name:"Glass Ceiling Breaker",color:13299960,damage:125,height:1.15,hits:2}],ultimate:{type:"megaprojectile",name:"Trailblazer",color:16758531,prop:"star"},passive:{id:"swift",name:"First Through the Door",desc:"Moves 18% faster."},quotes:{intro:"Nobody gave me a seat at the table. I took one.",win:"Another ceiling, shattered."}},{id:"deri",name:"Aryeh Deri",nameHe:"אריה דרעי",party:"shas",role:"Shas Chairman",bio:"The ultimate political comeback story and dealmaker. Every coalition goes through him.",style:"technician",stats:{},look:{skin:rt.medium,height:.97,build:1.08,hair:"short",hairColor:3815994,facialHair:"full",facialHairColor:9079434,glasses:"rect",headwear:"kippah",headwearColor:1118481,outfit:"suit",jacket:pe.black,shirt:pe.white,tie:1914199,pants:pe.black},specials:[{type:"pull",name:"Coalition Demands",prop:"briefcase",color:1914199,damage:55},{type:"projectile",name:"Budget Allocation",prop:"shekel",color:16765286,count:3,damage:38},{type:"counter",name:"Veteran's Maneuver",color:4553629,damage:150}],ultimate:{type:"megagrab",name:"The Kingmaker",color:16765286},passive:{id:"lifeline",name:"The Comeback",desc:"Once per match, survives a knockout blow with 1 HP."},quotes:{intro:"Let's make a deal.",win:"Every government needs me."}},{id:"malchieli",name:"Michael Malchieli",nameHe:"מיכאל מלכיאלי",party:"shas",role:"Shas MK",bio:"Former Religious Services Minister. Methodical, patient, and very hard to move.",style:"grappler",stats:{health:1.04},look:{skin:rt.medium,height:1,build:1.12,hair:"short",hairColor:Lt.black,facialHair:"full",facialHairColor:2763306,headwear:"kippah",headwearColor:1118481,outfit:"suit",jacket:1842982,shirt:pe.white,tie:2829634,pants:1842982},specials:[{type:"projectile",name:"Ministry Memo",prop:"paper",color:14737885,damage:75},{type:"grab",name:"Bureaucratic Hold",color:4282999,damage:180},{type:"rising",name:"Ascending Motion",color:7835049,damage:120}],ultimate:{type:"megabeam",name:"Ministerial Decree",color:14737885,prop:"paper"},passive:{id:"thickSkin",name:"Steady Hand",desc:"Takes 14% less damage."},quotes:{intro:"Everything in its proper order.",win:"Filed and stamped."}},{id:"gafni",name:"Moshe Gafni",nameHe:"משה גפני",party:"utj",role:"UTJ MK, Finance Committee veteran",bio:"Long-time Finance Committee chair. Controls the budget, and therefore everything.",style:"zoner",stats:{speed:.9,health:1.05},look:{skin:rt.light,height:.96,build:1.1,hair:"short",hairColor:13684944,facialHair:"long",facialHairColor:15790320,glasses:"round",headwear:"black-hat",outfit:"suit",jacket:855311,shirt:pe.white,tie:null,pants:855311},specials:[{type:"projectile",name:"Funding Freeze",prop:"snowflake",color:11066076,damage:60,effect:{slow:150},desc:"Freezes your funding: you move slower for a while."},{type:"counter",name:"Committee Veto",color:1914199,damage:150},{type:"beam",name:"Budget Cut",prop:"scissors",color:15858414,length:2.8,damage:120,hits:3}],ultimate:{type:"megarain",name:"Final Budget Vote",color:16765286,prop:"coin"},passive:{id:"drainer",name:"Finance Committee",desc:"Every hit drains the opponent's meter."},quotes:{intro:"Let's discuss the budget.",win:"Motion approved. Funds transferred."}},{id:"goldknopf",name:"Yitzhak Goldknopf",nameHe:"יצחק גולדקנופף",party:"utj",role:"UTJ Chairman (Agudat Yisrael)",bio:"Former Housing Minister. Builds fast and hits like a construction crane.",style:"grappler",stats:{health:1.1,power:1.08,speed:.88,weight:1.25},look:{skin:rt.light,height:1,build:1.26,hair:"short",hairColor:Lt.salt,facialHair:"long",facialHairColor:10132122,glasses:"rect",headwear:"black-hat",outfit:"suit",jacket:855311,shirt:pe.white,tie:null,pants:855311},specials:[{type:"projectile",name:"Brick Toss",prop:"brick",color:12339017,arc:!0,damage:95},{type:"grab",name:"Cornerstone Slam",prop:"brick",color:10996055,damage:190},{type:"trap",name:"Housing Tender",prop:"crane",color:16759304,effect:{stun:45}}],ultimate:{type:"megarain",name:"Housing Boom",color:12339017,prop:"brick"},passive:{id:"heavyArmor",name:"Reinforced Concrete",desc:"Heavy attacks absorb one hit during startup."},quotes:{intro:"Permit approved. Construction begins.",win:"Another building. Another floor."}},{id:"smotrich",name:"Bezalel Smotrich",nameHe:"בצלאל סמוטריץ'",party:"rzp",role:"Finance Minister",bio:"Holds the Treasury keys and the coalition's purse strings. Taxes are his combo starter.",style:"zoner",stats:{},look:{skin:rt.fair,height:1.08,build:.96,hair:"short",hairColor:Lt.dark,facialHair:"short",facialHairColor:3877407,headwear:"kippah-knit",headwearColor:16053492,outfit:"open-suit",jacket:pe.charcoal,shirt:pe.white,tie:null,pants:pe.charcoal},specials:[{type:"projectile",name:"Tax Hike",prop:"shekel",color:16765286,damage:75,effect:{drain:15},desc:"A coin that steals meter on hit."},{type:"grab",name:"Treasury Lock",prop:"briefcase",color:15167313,damage:175},{type:"rising",name:"Fiscal Surge",color:16032353,damage:125}],ultimate:{type:"megarain",name:"State Budget",color:16765286,prop:"coin"},passive:{id:"deepPockets",name:"Treasury Keys",desc:"Starts every round with half a meter."},quotes:{intro:"Your budget has been... adjusted.",win:"Balanced books."}},{id:"rothman",name:"Simcha Rothman",nameHe:"שמחה רוטמן",party:"rzp",role:"Constitution Committee Chair",bio:"Chairs the Constitution Committee. Drafts bills faster than you can read them.",style:"zoner",stats:{},look:{skin:rt.light,height:1,build:.98,hair:"short",hairColor:3877407,facialHair:"full",facialHairColor:3877407,glasses:"rect",headwear:"kippah-knit",headwearColor:1914199,outfit:"suit",jacket:pe.charcoal,shirt:pe.white,tie:7166330,pants:pe.charcoal},specials:[{type:"projectile",name:"Draft Bill",prop:"book",color:11895693,count:2,damage:48},{type:"trap",name:"Committee Hearing",prop:"clock",color:7166330,effect:{stun:50}},{type:"rising",name:"Second Reading",color:15046811,damage:120}],ultimate:{type:"megabeam",name:"Third Reading",color:7166330,prop:"book"},passive:{id:"chipMaster",name:"Fine Print",desc:"Blocking him still hurts: triple chip damage."},quotes:{intro:"This bill passes in first reading.",win:"Third reading. Passed."}},{id:"strook",name:"Orit Strook",nameHe:"אורית סטרוק",party:"rzp",role:"Minister of National Missions",bio:"Veteran activist who never, ever backs down.",style:"technician",stats:{defense:1.04},look:{skin:rt.light,height:.93,build:.98,hair:"bob",hairColor:9075306,headwear:"hat",headwearColor:4014171,glasses:"round",outfit:"skirt",jacket:4014171,shirt:pe.white,tie:null,pants:4014171,female:!0},specials:[{type:"projectile",name:"Mission Statement",prop:"paper",color:15912079,damage:75},{type:"rush",name:"National Mission",color:14711391,armor:!0,damage:115},{type:"counter",name:"Unyielding",color:8499866,damage:140}],ultimate:{type:"cinematic",name:"Ministry Takeover",color:14711391,prop:"map"},passive:{id:"projectileProof",name:"Hardliner",desc:"Takes half damage from projectiles."},quotes:{intro:"I don't negotiate.",win:"Mission complete."}},{id:"ben-gvir",name:"Itamar Ben-Gvir",nameHe:"איתמר בן גביר",party:"otzma",role:"National Security Minister",bio:"Resigned, returned, and threatened to resign again. Always arrives with the sirens on.",style:"brawler",stats:{power:1.06,weight:1.1},look:{skin:rt.warm,height:1,build:1.16,hair:"short",hairColor:Lt.dark,headwear:"kippah-knit",headwearColor:16053492,outfit:"open-suit",jacket:pe.charcoal,shirt:pe.white,tie:null,pants:pe.charcoal},specials:[{type:"beam",name:"Siren Blast",prop:"siren",color:16720418,length:3.8,damage:110,hits:5},{type:"rush",name:"Police Reform",color:1920728,hits:2,damage:120,armor:!0},{type:"teleport",name:"Resign & Return",color:16766474,mode:"front",attack:!0,desc:"Vanishes from government, then comes right back swinging."}],ultimate:{type:"megarain",name:"National Guard",color:1920728,prop:"siren"},passive:{id:"rage",name:"Comeback Tour",desc:"Deals 25% more damage below 30% health."},quotes:{intro:"Sirens on. Let's go.",win:"Order has been restored. My order."}},{id:"fogel",name:"Zvika Fogel",nameHe:"צביקה פוגל",party:"otzma",role:"Otzma Yehudit MK",bio:"Retired brigadier general. Old school, heavy artillery, zero subtlety.",style:"brawler",stats:{health:1.05,speed:.9},look:{skin:rt.warm,height:1,build:1.12,hair:"buzz",hairColor:13684944,facialHair:"mustache",facialHairColor:13684944,outfit:"open-suit",jacket:5597999,shirt:14211264,tie:null,pants:4147754},specials:[{type:"rain",name:"Artillery Call",prop:"bomb",color:7041116,count:4,damage:34},{type:"rush",name:"Tank Charge",prop:"tank",color:6319160,armor:!0,damage:125,distance:3},{type:"rising",name:"Reserve Duty",color:11109479,damage:120}],ultimate:{type:"megaprojectile",name:"Full Mobilization",color:6319160,prop:"tank"},passive:{id:"heavyArmor",name:"Old General",desc:"Heavy attacks absorb one hit during startup."},quotes:{intro:"In my day we fought without special moves.",win:"Dismissed."}},{id:"maoz",name:"Avi Maoz",nameHe:"אבי מעוז",party:"noam",role:"Noam Chairman",bio:"A one-man faction with a very specific agenda. Fights alone, and likes it.",style:"zoner",stats:{},look:{skin:rt.light,height:.98,build:.98,hair:"short",hairColor:9079434,facialHair:"full",facialHairColor:10132122,glasses:"rect",headwear:"kippah-knit",headwearColor:2236962,outfit:"suit",jacket:pe.charcoal,shirt:pe.white,tie:6182030,pants:pe.charcoal},specials:[{type:"projectile",name:"Pamphlet Barrage",prop:"paper",color:10454720,count:3,damage:36},{type:"shield",name:"One-Man Faction",color:10454720,hits:2},{type:"beam",name:"Agenda Push",prop:"megaphone",color:12490180,length:3.5,hits:4}],ultimate:{type:"megabeam",name:"Single Seat, Full Volume",color:6182030,prop:"megaphone"},passive:{id:"regen",name:"Lone Seat",desc:"Recovers part of his lost health when not taking damage."},quotes:{intro:"I don't need a coalition.",win:"One seat is enough."}},{id:"lieberman",name:"Avigdor Lieberman",nameHe:"אביגדור ליברמן",nick:"Yvet",party:"yb",role:"Yisrael Beiteinu Chairman",bio:"Former nightclub bouncer turned kingmaker. If you're not on the list, you're not getting in.",style:"grappler",stats:{health:1.12,power:1.1,speed:.86,weight:1.3},look:{skin:rt.light,height:1.02,build:1.3,hair:"buzz",hairColor:Lt.grey,facialHair:"short",facialHairColor:Lt.grey,outfit:"open-suit",jacket:pe.charcoal,shirt:pe.white,tie:null,pants:pe.charcoal},specials:[{type:"grab",name:"Bouncer's Grip",color:1914199,damage:190,range:1.35},{type:"rush",name:"Iron Fist",color:2575479,armor:!0,damage:125},{type:"wave",name:"Political Earthquake",prop:"wave",color:6330042,damage:85}],ultimate:{type:"megagrab",name:"You're Not on the List",color:1914199},passive:{id:"bouncer",name:"Bouncer",desc:"Throws deal 60% more damage and reach further."},quotes:{intro:"Name? You're not on the list.",win:"Next."}},{id:"forer",name:"Oded Forer",nameHe:"עודד פורר",party:"yb",role:"Yisrael Beiteinu MK",bio:"Former Agriculture Minister. Lieberman's right hand, and a pretty good left too.",style:"balanced",stats:{},look:{skin:rt.light,height:1.02,build:.96,hair:"short",hairColor:3877407,outfit:"suit",jacket:2575479,shirt:pe.white,tie:10735345,pants:2575479},specials:[{type:"projectile",name:"Watermelon Lob",prop:"watermelon",color:3715072,arc:!0,damage:95},{type:"counter",name:"Committee Chair",color:6330042,damage:140},{type:"rising",name:"Rising Question",color:10735345,damage:120}],ultimate:{type:"cinematic",name:"Commission of Inquiry",color:2575479,prop:"book"},passive:{id:"comboMaster",name:"Loyal Lieutenant",desc:"Combos lose less damage to scaling."},quotes:{intro:"The chairman sends his regards.",win:"Fresh from the field."}},{id:"mansour-abbas",name:"Mansour Abbas",nameHe:"מנסור עבאס",party:"raam",role:"Ra'am Chairman",bio:"Dentist by trade and history-maker by profession: led the first Arab party into a governing coalition.",style:"technician",stats:{},look:{skin:rt.olive,height:1,build:1.02,hair:"short",hairColor:Lt.black,facialHair:"mustache",facialHairColor:Lt.black,outfit:"suit",jacket:pe.charcoal,shirt:pe.white,tie:2976335,pants:pe.charcoal},specials:[{type:"grab",name:"Root Canal",prop:"drill",color:15858414,damage:175},{type:"barrage",name:"Drill Rush",prop:"drill",color:5420936,hits:7,damage:120},{type:"shield",name:"Bridge Builder",color:9819570,hits:2}],ultimate:{type:"megagrab",name:"Painless Extraction",color:16777215,prop:"tooth"},passive:{id:"vampire",name:"Kingmaker",desc:"Heals 12% of the damage he deals."},quotes:{intro:"Open wide. This won't hurt. Much.",win:"Please rinse."}},{id:"odeh",name:"Ayman Odeh",nameHe:"איימן עודה",party:"hadash",role:"Hadash Chairman",bio:"Lawyer and orator who can rally a crowd in two languages.",style:"zoner",stats:{},look:{skin:rt.olive,height:1.02,build:.98,hair:"short",hairColor:Lt.black,facialHair:"stubble",facialHairColor:Lt.black,outfit:"open-suit",jacket:3815994,shirt:pe.white,tie:null,pants:3815994},specials:[{type:"beam",name:"Megaphone",prop:"megaphone",color:14034984,length:4,hits:4,damage:110},{type:"wave",name:"Protest March",prop:"sign",color:16219904,damage:80},{type:"rising",name:"Rising Voice",color:16564041,damage:120}],ultimate:{type:"megarain",name:"Mass Rally",color:14034984,prop:"sign"},passive:{id:"meterBoost",name:"Orator",desc:"Builds Ultimate meter 30% faster."},quotes:{intro:"Let me speak!",win:"The crowd has spoken."}},{id:"tibi",name:"Ahmad Tibi",nameHe:"אחמד טיבי",party:"hadash",role:"Ta'al Chairman",bio:"Physician and the Knesset's sharpest wit. His one-liners leave marks.",style:"technician",stats:{},look:{skin:rt.olive,height:1,build:1.05,hair:"receding",hairColor:10526880,facialHair:"mustache",facialHairColor:10132122,glasses:"rect",outfit:"suit",jacket:pe.charcoal,shirt:pe.white,tie:7864320,pants:pe.charcoal},specials:[{type:"projectile",name:"One-Liner",prop:"star",color:16766474,speed:.24,damage:70},{type:"counter",name:"Witty Retort",color:16761600,damage:150},{type:"heal",name:"Doctor's Orders",color:8454107,amount:90}],ultimate:{type:"cinematic",name:"Standing Ovation",color:16766474,prop:"mic"},passive:{id:"counterPunch",name:"Sharpest Wit",desc:"Counter-hits deal 50% extra damage."},quotes:{intro:"Is that your best line?",win:"The doctor is out."}},{id:"touma-sliman",name:"Aida Touma-Sliman",nameHe:"עאידה תומא-סלימאן",party:"hadash",role:"Hadash MK",bio:"Veteran feminist activist and journalist. The first Arab woman to chair a Knesset committee.",style:"balanced",stats:{},look:{skin:rt.medium,height:.94,build:.95,hair:"bob",hairColor:9079434,glasses:"round",outfit:"blazer",jacket:7864320,shirt:1118481,tie:null,pants:1118481,female:!0},specials:[{type:"projectile",name:"Petition Storm",prop:"paper",color:16777215,count:3,damage:38},{type:"rush",name:"Equal Rights Rush",color:12653087,damage:115,hits:2},{type:"rising",name:"Status Check",color:16741775,damage:120}],ultimate:{type:"megarain",name:"Women's March",color:12653087,prop:"sign"},passive:{id:"thickSkin",name:"Seasoned Activist",desc:"Takes 14% less damage."},quotes:{intro:"I've been fighting longer than you've been in politics.",win:"Equality: achieved."}},{id:"kariv",name:"Gilad Kariv",nameHe:"גלעד קריב",party:"democrats",role:"The Democrats MK",bio:"Reform rabbi and legislator. Amends opponents clause by clause.",style:"technician",stats:{},look:{skin:rt.light,height:1,build:1,hair:"short",hairColor:3877407,facialHair:"short",facialHairColor:3877407,glasses:"round",headwear:"kippah-knit",headwearColor:12653087,outfit:"suit",jacket:pe.charcoal,shirt:pe.white,tie:12653087,pants:pe.charcoal},specials:[{type:"projectile",name:"Amendment",prop:"paper",color:15672124,damage:75},{type:"trap",name:"Parliamentary Question",prop:"clock",color:9279918,effect:{stun:45}},{type:"rising",name:"Reform Rising",color:15672124,damage:120}],ultimate:{type:"megabeam",name:"Constitutional Crisis",color:15672124,prop:"book"},passive:{id:"powerSurge",name:"Legislator",desc:"Special moves deal 20% more damage."},quotes:{intro:"I'd like to propose an amendment. To your face.",win:"Amendment adopted."}},{id:"lazimi",name:"Naama Lazimi",nameHe:"נעמה לזימי",party:"democrats",role:"The Democrats MK",bio:"Grassroots social activist. Brings the protest to the plenum, and the plenum to the street.",style:"rushdown",stats:{speed:1.03},look:{skin:rt.fair,height:.94,build:.9,hair:"curly",hairColor:2825492,outfit:"tshirt",jacket:14035001,shirt:14035001,tie:null,pants:2834278,female:!0},specials:[{type:"projectile",name:"Protest Sign",prop:"sign",color:14035001,damage:80},{type:"rush",name:"Kaplan March",color:16731501,hits:3,damage:120},{type:"spin",name:"Social Justice Kick",color:16748451,hits:4,damage:105}],ultimate:{type:"megarain",name:"Mass Protest",color:14035001,prop:"sign"},passive:{id:"swift",name:"Grassroots",desc:"Moves 18% faster."},quotes:{intro:"We're not going home.",win:"The street has spoken."}}],lu=Object.fromEntries(bt.map(s=>[s.id,s]));function y_(s){return{...s,boss:!0,name:s.name,role:`FINAL BOSS · ${s.role}`}}const Hi=[{id:"plenum",kind:"plenum",name:"The Plenum",nameHe:"מליאת הכנסת",desc:"The horseshoe of power. Mind the government table.",music:{bpm:138,root:45,mode:"minor",intensity:1}},{id:"plaza",kind:"plaza",name:"Menorah Plaza",nameHe:"רחבת המנורה",desc:"Outside the Knesset, in the shadow of the great Menorah.",music:{bpm:128,root:50,mode:"dorian",intensity:.8}},{id:"committee",kind:"committee",name:"Finance Committee",nameHe:"ועדת הכספים",desc:"Where budgets are born and coalitions are bought.",music:{bpm:120,root:43,mode:"phrygian",intensity:.7}},{id:"beach",kind:"beach",name:"Tel Aviv Beach",nameHe:"חוף תל אביב",desc:"Sunset on Gordon Beach. Matkot players look on.",music:{bpm:124,root:48,mode:"major",intensity:.8}},{id:"market",kind:"market",name:"Mahane Yehuda",nameHe:"שוק מחנה יהודה",desc:"The shuk after dark. Every politician campaigns here eventually.",music:{bpm:132,root:47,mode:"phrygian",intensity:.9}},{id:"rooftop",kind:"rooftop",name:"Azrieli Rooftop",nameHe:"גג עזריאלי",desc:"High above Tel Aviv. Round, square and triangle towers.",music:{bpm:146,root:44,mode:"minor",intensity:1}}],Ld=Object.fromEntries(Hi.map(s=>[s.id,s])),S_=["Backbencher","Committee Member","Minister","Prime Minister","Supreme Court"],cu=[{reaction:30,block:.12,aggression:.3,combo:.1,antiAir:.1,tech:0,interval:26},{reaction:20,block:.35,aggression:.45,combo:.35,antiAir:.3,tech:.2,interval:18},{reaction:13,block:.6,aggression:.55,combo:.6,antiAir:.55,tech:.4,interval:12},{reaction:8,block:.8,aggression:.65,combo:.85,antiAir:.8,tech:.6,interval:8},{reaction:4,block:.93,aggression:.75,combo:1,antiAir:.95,tech:.8,interval:5}],hu=new Set(["projectile","beam","wave","rain","trap"]),M_=new Set(["rush","dive","slam","teleport","spin","pull"]),b_=new Set(["grab","barrage"]),uu=new Set(["rising","counter"]),w_=new Set(["buff","heal","shield"]);class Oo{lv;plan=[];seed;threatTimer=0;decidedThreat=!1;lastMoveKey="";techTried=!1;idle=0;constructor(e,t=1234){this.lv=cu[Math.max(0,Math.min(cu.length-1,e))],this.seed=t}rand(){return this.seed=this.seed*1103515245+12345&2147483647,this.seed/2147483647}reset(){this.plan=[],this.threatTimer=0}next(e,t){if(t.phase!=="fight")return this.plan=[],di;const i=e.opponent,n=e.facing,r=n>0?6:4,a=n>0?4:6,o=n>0?1:3,c=n>0?9:7,l=Math.abs(i.x-e.x);if(e.state==="thrown")return!this.techTried&&e.stateFrame>=2&&(this.techTried=!0,this.rand()<this.lv.tech)?{dir:5,held:fe.TH,pressed:fe.TH}:di;if(this.techTried=!1,e.state==="attack"&&e.move&&e.moveConnected){const f=`${e.move.id}:${t.frame-e.moveFrame}`;if(f!==this.lastMoveKey&&(this.lastMoveKey=f,e.move.kind==="normal"&&e.move.cancel&&this.rand()<this.lv.combo)){if(this.plan=[],e.meter>=100&&this.ultInRange(e,l)&&this.rand()<.6)return this.press(fe.UL,5);const g=this.pickSpecial(e,l,["rush","rising","barrage","spin","projectile","beam","pull","grab"]);if(g>=0)return this.press(fe.SP,g===2?2:g===1?r:5)}}if(this.plan.length){const f=this.plan.shift();return(e.state==="hitstun"||e.state==="juggle"||e.state==="knockdown")&&(this.plan=[]),f}if(!(e.actionable||e.state==="blockstun")&&e.state!=="air")return di;const d=t.isThreatened(e);if(d?this.threatTimer++:(this.threatTimer=0,this.decidedThreat=!1),d&&this.threatTimer>=this.lv.reaction&&!this.decidedThreat&&e.grounded){if(this.decidedThreat=!0,this.rand()<this.lv.block){const f=i.move?.hit?.guard,g=f==="low"||i.isCrouching&&f!=="overhead";return this.plan=this.hold(g?o:a,14),this.plan.shift()}if(this.rand()<.25)return this.press(fe.SS,5)}if(e.state==="blockstun")return{dir:i.move?.hit?.guard==="low"?o:a,held:0,pressed:0};if(e.state==="air")return di;if(!i.grounded&&(i.state==="air"||i.state==="attack"&&!!i.move?.air)&&l<3&&Math.sign(i.vx||0)!==Math.sign(e.x-i.x)*-1&&!this.decidedThreat&&this.rand()<this.lv.antiAir*.2){this.decidedThreat=!0;const f=this.findSpecial(e,uu);return f>=0&&e.moves.specials[f].tag==="rising"?this.press(fe.SP,f===2?2:f===1?r:5):this.press(fe.HP,2)}return this.idle++,this.idle<this.lv.interval?{dir:l>3&&this.rand()<this.lv.aggression?r:5,held:0,pressed:0}:(this.idle=0,this.decide(e,t,l,{FWD:r,BACK:a,DBACK:o,UFWD:c}),this.plan.shift()??di)}decide(e,t,i,n){const r=this.rand(),a=this.lv.aggression;if(e.meter>=100&&this.ultInRange(e,i)&&r<.35){this.plan=[this.pressFrame(fe.UL,5)];return}if(i>4.2){const l=this.findSpecial(e,hu,t),h=this.findSpecial(e,w_,t);if(l>=0&&r<.35)return this.useSpecial(l,n.FWD);if(h>=0&&r<.45)return this.useSpecial(h,n.FWD);if(r<.8){this.plan=this.hold(n.FWD,20);return}this.plan=[...this.hold(n.FWD,1),...this.hold(5,2),...this.hold(n.FWD,1),...this.hold(5,14)];return}if(i>2.1){const l=this.findSpecial(e,M_,t),h=this.findSpecial(e,hu,t);if(l>=0&&r<.2*(.5+a))return this.useSpecial(l,n.FWD);if(h>=0&&r<.4)return this.useSpecial(h,n.FWD);if(r<.4+a*.2){this.plan=[...this.hold(n.UFWD,4),...this.hold(5,14),this.pressFrame(fe.HK,5),...this.hold(5,18)];return}if(r<.85){this.plan=this.hold(n.FWD,14);return}this.plan=this.hold(n.BACK,10);return}const o=this.findSpecial(e,b_,t);if(o>=0&&i<1.3&&r<.12)return this.useSpecial(o,n.FWD);if(i<1.05&&r<.2){this.plan=[this.pressFrame(fe.TH,5),...this.hold(5,10)];return}const c=this.rand();if(c<.22)this.plan=[this.pressFrame(fe.LP,5),...this.hold(5,5),this.pressFrame(fe.LP,5),...this.hold(5,5),this.pressFrame(fe.HP,5),...this.hold(5,8)];else if(c<.38)this.plan=[this.pressFrame(fe.LK,2),...this.hold(2,6),this.pressFrame(fe.HK,2),...this.hold(5,20)];else if(c<.5)this.plan=[this.pressFrame(fe.HP,5),...this.hold(5,14)];else if(c<.6)this.plan=[this.pressFrame(fe.HK,5),...this.hold(5,18)];else if(c<.66)this.plan=[this.pressFrame(fe.HP,n.FWD),...this.hold(5,30)];else if(c<.78)this.plan=this.hold(n.BACK,16);else if(c<.88)this.plan=this.hold(n.DBACK,12);else{const l=this.findSpecial(e,uu,t);if(l>=0)return this.useSpecial(l,n.FWD);this.plan=[this.pressFrame(fe.LK,2),...this.hold(2,8)]}}ultInRange(e,t){switch(e.moves.ultimate.tag){case"cinematic":return t<3.2;case"megagrab":return t<1.6;default:return!0}}findSpecial(e,t,i){const n=[];return e.moves.specials.forEach((r,a)=>{t.has(r.tag??"")&&(!i||e.canUse(r,i))&&n.push(a)}),n.length?n[Math.floor(this.rand()*n.length)]:-1}pickSpecial(e,t,i){for(const n of i){const r=e.moves.specials.findIndex(a=>a.tag===n);if(r>=0){if((n==="grab"||n==="barrage")&&t>1.4)continue;return r}}return-1}useSpecial(e,t){const i=e===2?2:e===1?t:5;this.plan=[this.pressFrame(fe.SP,i),...this.hold(5,12)]}press(e,t){return this.pressFrame(e,t)}pressFrame(e,t){return{dir:t,held:e,pressed:e}}hold(e,t){const i=[];for(let n=0;n<t;n++)i.push({dir:e,held:0,pressed:0});return i}}function E_(s,e,t,i){const n=e.facing;switch(s){case"stand":return di;case"crouch":return{dir:2,held:0,pressed:0};case"jump":return{dir:8,held:0,pressed:0};case"block":{const r=e.opponent,a=r.move?.hit?.guard==="low"||r.isCrouching&&r.move?.hit?.guard!=="overhead",o=n>0?4:6,c=n>0?1:3;return{dir:a?c:o,held:0,pressed:0}}case"cpu":return i?i.next(e,t):di}}const Bl=new Map;function T_(s){return s_(s)??Bl.get(s)}async function A_(s,e){const i=document.createElement("canvas");i.width=192,i.height=192;let n;try{n=new vd({canvas:i,antialias:!0,alpha:!0,preserveDrawingBuffer:!0})}catch{return}n.setSize(192,192,!1),n.outputColorSpace=Yt,n.toneMapping=Pa,n.setClearColor(0,0);const r=new Vu;r.add(new ad(16777215,4477030,1.5));const a=new wa(16777215,2.6);a.position.set(1.5,2.5,3),r.add(a);const o=new wa(11193599,1.6);o.position.set(-2,1.5,-2),r.add(o);const c=new ui(24,1,.1,20);for(let l=0;l<s.length;l++){const h=s[l];if(Bl.has(h.id))continue;const d=_d(h);Cx(d),d.root.rotation.y=.35,r.add(d.root),d.root.updateMatrixWorld(!0);const u=new R;d.head.getWorldPosition(u),u.y+=.1*h.look.height,c.position.set(u.x+.25,u.y+.05,u.z+1.35),c.lookAt(u.x,u.y-.08,u.z);const f=An[h.party];n.setClearColor(f.color,1),n.render(r,c),Bl.set(h.id,i.toDataURL("image/png")),r.remove(d.root),yd(d),e?.(l+1,s.length),l%4===3&&await new Promise(g=>setTimeout(g,0))}n.dispose(),n.forceContextLoss()}function Le(s){return s.replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e])}function Ge(s,e="",t=""){const i=document.createElement(s);return e&&(i.className=e),t&&(i.innerHTML=t),i}function fr(s){return"#"+s.toString(16).padStart(6,"0")}function Hl(s){let e=s>>16&255,t=s>>8&255,i=s&255;const n=.299*e+.587*t+.114*i;if(n<140){const a=(140-n)/(255-n+1);e=Math.round(e+(255-e)*a*1.4),t=Math.round(t+(255-t)*a*1.4),i=Math.round(i+(255-i)*a*1.4)}const r=a=>Math.max(0,Math.min(255,a));return`rgb(${r(e)},${r(t)},${r(i)})`}function $i(s,e=""){const t=T_(s.id);if(t)return`<img class="${e}" src="${t}" alt="${Le(s.name)}" draggable="false">`;const i=s.name.split(" ").map(n=>n[0]).join("").slice(0,2);return`<div class="${e} init" style="background:${fr(An[s.party].color)}">${Le(i)}</div>`}function Id(s){const e=An[s.party];return`<span class="chip" style="background:${fr(e.color)};color:#fff">${Le(e.name)} · <span class="he">${Le(e.nameHe)}</span></span>`}class Cs{constructor(e,t,i={}){this.items=e,this.audio=t,this.el=Ge("div","menu"),i.desc&&(this.descEl=Ge("div","desc")),this.build()}items;audio;el;index=0;descEl=null;itemEls=[];setItems(e){this.items=e,this.index=Math.min(this.index,e.length-1),this.build()}build(){this.el.innerHTML="",this.itemEls=this.items.map((e,t)=>{const i=Ge("div","item");return i.addEventListener("mouseenter",()=>{this.index!==t&&(this.index=t,this.render())}),i.addEventListener("click",()=>{this.index=t,this.activate()}),this.el.appendChild(i),i}),this.descEl&&this.el.appendChild(this.descEl),this.render()}render(){this.items.forEach((e,t)=>{const i=this.itemEls[t],n=e.value?`<span class="val">◀ ${Le(e.value())} ▶</span>`:"";i.innerHTML=`<span>${Le(e.label)}</span>${n}`,i.classList.toggle("sel",t===this.index),i.classList.toggle("disabled",!!e.disabled)}),this.descEl&&(this.descEl.textContent=this.items[this.index]?.desc??"")}activate(){const e=this.items[this.index];!e||e.disabled||(e.onSelect?(this.audio.sfx("menuConfirm"),e.onSelect()):e.onRight&&(this.audio.sfx("menuMove"),e.onRight(),this.render()))}handle(e){const t=this.items.length;e.up?(this.index=(this.index-1+t)%t,this.audio.sfx("menuMove"),this.render()):e.down?(this.index=(this.index+1)%t,this.audio.sfx("menuMove"),this.render()):e.left&&this.items[this.index]?.onLeft?(this.items[this.index].onLeft(),this.audio.sfx("menuMove"),this.render()):e.right&&this.items[this.index]?.onRight?(this.items[this.index].onRight(),this.audio.sfx("menuMove"),this.render()):e.confirm&&this.activate()}}const fa={qcf:"↓↘→",qcb:"↓↙←",dp:"→↓↘",dqcf:"↓↘→↓↘→"},C_=48;function P_(s){switch(s){case 1:return 3;case 3:return 1;case 4:return 6;case 6:return 4;case 7:return 9;case 9:return 7;default:return s}}function du(s,e){return e>=0?s:P_(s)}const Gs=s=>s===1||s===2||s===3,Bo=s=>s===7||s===8||s===9,R_=s=>s===3||s===6||s===9,L_=s=>s===1||s===4||s===7,bi=s=>e=>e===s,tn=(...s)=>e=>s.includes(e),I_={qcf:[tn(2,1),bi(3),tn(6,9)],qcb:[tn(2,3),bi(1),tn(4,7)],dp:[tn(6,9,3),bi(2),tn(3,6)],dqcf:[tn(2,1),bi(3),tn(6,9),bi(2),bi(3),tn(6,9)],dashF:[bi(6),bi(5),bi(6)],dashB:[bi(4),bi(5),bi(4)]};class D_{dirs=[];presses=[];consumed=[];push(e,t){this.dirs.push(e),this.presses.push(t),this.consumed.push(0),this.dirs.length>C_&&(this.dirs.shift(),this.presses.shift(),this.consumed.shift())}clear(){this.dirs.length=0,this.presses.length=0,this.consumed.length=0}buffered(e,t=Oc){let i=0;const n=this.presses.length;for(let r=Math.max(0,n-t);r<n;r++)i|=this.presses[r]&~this.consumed[r]&e;return i}consume(e,t=Oc){const i=this.presses.length;for(let n=Math.max(0,i-t);n<i;n++)this.consumed[n]|=this.presses[n]&e}pressedTogether(e,t,i=3){return(this.buffered(e,i)&e)!==0&&(this.buffered(t,i)&t)!==0}motion(e,t=gf,i=8){const n=I_[e],r=this.dirs,a=r.length,o=e==="dqcf"?t*2:t,c=Math.max(0,a-o);let l=n.length-1,h=a-1,d=!1;for(;h>=Math.max(c,a-i);h--)if(n[l](r[h])){d=!0;break}if(!d)return!1;for(l--,h=h-1;h>=c&&l>=0;h--)n[l](r[h])&&l--;return l<0}dash(e){const t=this.dirs.length;if(t<3)return!1;const i=e?6:4;if(this.dirs[t-1]!==i||this.dirs[t-2]===i)return!1;let n=!1;for(let r=t-2;r>=Math.max(0,t-14);r--){const a=this.dirs[r];if(a===5)n=!0;else{if(a===i&&n)return!0;if(a!==5)return!1}}return!1}}const k_=[{id:"jab",name:"Jab",anim:"jab",s:4,a:2,r:7,box:{x:.62,y:1.42,w:.6,h:.3},dmg:30,hs:14,bs:10,guard:"mid",push:.07,chain:["jab","strong","short","roundhouse"],cancel:!0},{id:"strong",name:"Straight",anim:"strong",s:8,a:3,r:16,box:{x:.74,y:1.38,w:.72,h:.36},dmg:70,hs:19,bs:15,guard:"mid",push:.11,heavy:!0,cancel:!0,motion:[{from:4,to:9,vx:.03}]},{id:"short",name:"Low Kick",anim:"short",s:5,a:3,r:9,box:{x:.68,y:.62,w:.64,h:.34},dmg:35,hs:14,bs:10,guard:"mid",push:.08,chain:["strong","roundhouse"],cancel:!0},{id:"roundhouse",name:"Roundhouse",anim:"roundhouse",s:10,a:3,r:18,box:{x:.84,y:1.25,w:.84,h:.44},dmg:82,hs:20,bs:15,guard:"mid",push:.14,heavy:!0,cancel:!0},{id:"cJab",name:"Crouch Jab",anim:"cJab",s:4,a:2,r:7,box:{x:.62,y:.82,w:.58,h:.28},dmg:25,hs:13,bs:9,guard:"mid",push:.07,low:!0,chain:["cJab","cShort","cStrong","sweep","strong"],cancel:!0},{id:"cStrong",name:"Uppercut",anim:"cStrong",s:7,a:4,r:18,box:{x:.48,y:1.5,w:.66,h:1.05},dmg:70,hs:19,bs:14,guard:"mid",push:.09,heavy:!0,low:!0,cancel:!0,launch:.22},{id:"cShort",name:"Shin Kick",anim:"cShort",s:5,a:2,r:9,box:{x:.74,y:.16,w:.74,h:.26},dmg:25,hs:13,bs:9,guard:"low",push:.07,low:!0,chain:["cJab","cStrong","sweep"],cancel:!0},{id:"sweep",name:"Sweep",anim:"sweep",s:9,a:4,r:22,box:{x:.94,y:.16,w:1,h:.28},dmg:70,hs:20,bs:14,guard:"low",push:.1,heavy:!0,low:!0,knockdown:!0},{id:"jJab",name:"Air Jab",anim:"jJab",s:4,a:8,r:3,box:{x:.52,y:.78,w:.58,h:.4},dmg:35,hs:14,bs:10,guard:"overhead",push:.06,air:!0},{id:"jStrong",name:"Air Hammer",anim:"jStrong",s:7,a:5,r:5,box:{x:.62,y:.62,w:.74,h:.5},dmg:70,hs:18,bs:14,guard:"overhead",push:.08,heavy:!0,air:!0},{id:"jShort",name:"Air Knee",anim:"jShort",s:5,a:9,r:3,box:{x:.56,y:.38,w:.62,h:.44},dmg:40,hs:15,bs:11,guard:"overhead",push:.06,air:!0},{id:"jRoundhouse",name:"Flying Kick",anim:"jRoundhouse",s:8,a:5,r:5,box:{x:.74,y:.4,w:.84,h:.5},dmg:82,hs:18,bs:14,guard:"overhead",push:.09,heavy:!0,air:!0},{id:"overhead",name:"Overhead Chop",anim:"overhead",s:18,a:3,r:14,box:{x:.72,y:1.3,w:.74,h:.66},dmg:60,hs:17,bs:12,guard:"overhead",push:.09,heavy:!0,motion:[{from:3,to:16,vx:.035}]}],U_={balanced:{startup:0,heavyStartup:0,recovery:0,damage:1,reach:0,hitstun:0},rushdown:{startup:-1,heavyStartup:-1,recovery:0,damage:.94,reach:-.03,hitstun:0},brawler:{startup:0,heavyStartup:1,recovery:1,damage:1.12,reach:0,hitstun:1},grappler:{startup:0,heavyStartup:1,recovery:0,damage:1.05,reach:0,hitstun:0},zoner:{startup:0,heavyStartup:0,recovery:0,damage:.95,reach:.12,hitstun:0},technician:{startup:0,heavyStartup:0,recovery:-1,damage:1,reach:.04,hitstun:1}},Dd={balanced:"All-rounder",rushdown:"Rushdown: fast pokes, fast feet",brawler:"Brawler: slower, hits harder",grappler:"Grappler: huge throws, sturdy",zoner:"Zoner: long reach, keeps you out",technician:"Technician: tight frames, big combos"};function N_(s,e){const t=U_[s],i={};for(const n of k_){const r=Math.max(3,n.s+t.startup+(n.heavy?t.heavyStartup:0)),a=Math.max(3,n.r+t.recovery),o=n.heavy?t.reach:t.reach*.5,c={damage:Math.round(n.dmg*t.damage*e),chip:0,hitstun:n.hs+t.hitstun,blockstun:n.bs,guard:n.guard,pushback:n.push,spark:n.heavy?"heavy":"light",knockdown:n.knockdown,launch:n.knockdown?.12:n.launch,meterGain:n.heavy?6:3};i[n.id]={id:n.id,name:n.name,kind:"normal",anim:n.anim,startup:r,active:n.a,recovery:a,hitbox:{x:n.box.x+o/2,y:n.box.y,w:n.box.w+o,h:n.box.h},hit:c,air:n.air,lowProfile:n.low,chain:n.chain,cancel:n.cancel?["special","super"]:void 0,motion:n.motion,tag:n.heavy?"heavy":"light"}}return i}function F_(s,e){const t=s==="grappler";return{id:"throw",name:"Throw",kind:"throw",anim:"throw",startup:5,active:3,recovery:22,throwRange:.98+(t?.25:0)+(e?.3:0),throwDamage:Math.round(120*(t?1.4:1)*(e?1.6:1)),techable:!0,tag:"throw"}}function Vt(s,e={}){return{damage:s,chip:Math.round(s*.15),hitstun:22,blockstun:17,guard:"mid",pushback:.12,spark:"special",meterGain:8,...e}}const bn=(s,e,t)=>e+(t-e)*s.strength,O_={projectile:"Fires a projectile.",rush:"Charges forward with a strike.",rising:"Invincible rising anti-air.",grab:"Unblockable command grab.",counter:"Counter stance: absorbs a strike and retaliates.",buff:"Temporary power-up.",heal:"Recovers health (vulnerable).",teleport:"Vanishes and reappears.",wave:"Ground wave: must be blocked low or jumped.",dive:"Diving kick (also works in the air).",trap:"Places a trap on the floor.",beam:"Short-range multi-hit beam.",pull:"Long reach strike that yanks the opponent in.",slam:"Leaps at the opponent and slams down (overhead).",rain:"Calls objects down on the opponent.",shield:"Raises a barrier.",spin:"Spinning multi-hit advance, passes over lows.",barrage:"Rapid flurry of blows."};function kd(s){return s.desc??O_[s.type]}function B_(s,e){const t=`sp${e}`,i={id:t,name:s.name,kind:"special",color:s.color,tag:s.type,desc:kd(s),cancel:["super"]};switch(s.type){case"projectile":{const n=s.count??1,r=s.damage??(n>1?45:80),a=s.size??1,o=`${t}`,c=13,l=7;return{...i,anim:"cast",prop:s.prop,startup:c,active:1+(n-1)*l,recovery:26,canStart:(h,d)=>!d.hasProjectile(h,o),onFrame:(h,d)=>{const u=(d-c)/l;if(d<c||u!==Math.floor(u)||u>=n)return;const f=h.fighter,g=(s.speed??.16)*bn(h,.85,1.15)*(s.arc?.62:1),S=n>1&&!s.arc?(u-(n-1)/2)*.012:0;h.match.spawnProjectile(f,{x:f.x+f.facing*.8,y:s.arc?1.7:1.25,vx:f.facing*g,vy:s.arc?.14+.03*h.strength:S,gravity:s.arc?.0085:0,w:.5*a,h:.45*a,hit:Vt(r,{effect:s.effect,knockdown:r>=100,launch:r>=100?.15:void 0}),prop:s.prop,color:s.color,hits:s.hits??1,rehit:7,life:200,homing:s.homing?1:0,tag:o,scale:a})}}}case"rush":{const n=s.hits??1,r=s.damage??110,a=Math.round(r/n),o=10,c=18;return{...i,anim:"charge",prop:s.prop,startup:o,active:c,recovery:20,hitbox:{x:.62,y:1.1,w:.9,h:1.1},hit:Vt(a,{pushback:n>1?.03:.16,hitstun:n>1?18:24,knockdown:n===1&&!!s.launch,launch:n===1&&s.launch?.24:void 0}),finalHit:n>1?{pushback:.18,knockdown:!0,launch:s.launch?.24:.12}:void 0,rehit:n>1?5:void 0,maxHits:n,armor:s.armor?{from:1,to:o+c,hits:1}:void 0,onFrame:(l,h)=>{const d=l.fighter;if(h>=o-2&&h<=o+c){const u=(s.distance??3.4)*bn(l,.8,1.2)/(c+2);d.vx=d.moveConnected?d.facing*.01:d.facing*u}else h>o+c&&(d.vx=0)}}}case"rising":{const n=s.hits??1,r=s.damage??120,a=Math.round(r/n);return{...i,anim:"uppercut",prop:s.prop,startup:4,active:14,recovery:16,airborne:!0,invuln:[{from:1,to:9,kind:"full"}],hitbox:{x:.45,y:1.45,w:.8,h:1.4},hit:Vt(a,{launch:n>1?.16:.26,launchVx:.03,knockdown:!0,hitstun:20}),finalHit:{launch:.26},rehit:n>1?4:void 0,maxHits:n,onFrame:(o,c)=>{if(c===4){const l=o.fighter;l.vy=.3*(s.height??1)*bn(o,.88,1.12),l.vx=l.facing*.04}}}}case"grab":return{...i,anim:"grab",prop:s.prop,startup:6,active:3,recovery:30,throwRange:s.range??1.25,throwDamage:s.damage??170,techable:!1,hit:Vt(s.damage??170,{guard:"unblockable",knockdown:!0,effect:s.effect})};case"counter":{const n=s.window??24,r={id:`${t}c`,name:s.name,kind:"special",anim:"counterStrike",color:s.color,startup:3,active:6,recovery:18,hitbox:{x:.8,y:1.1,w:1.8,h:1.8},hit:Vt(s.damage??140,{knockdown:!0,launch:.2,guard:"mid",spark:"heavy"}),invuln:[{from:1,to:10,kind:"full"}],cancel:["super"]};return{...i,anim:"counterStance",prop:s.prop,startup:3,active:n,recovery:22,counterWindow:{from:3,to:3+n},counterMove:r}}case"buff":{const n={damage:1.3,speed:1.35,defense:.6,armor:2,regen:.45,meter:.35,shield:2,reflect:1,slow:.6};return{...i,anim:"powerup",startup:18,active:1,recovery:16,cooldown:480,onFrame:(r,a)=>{if(a!==18)return;const o=s.duration??(s.buff==="armor"?480:360);r.fighter.addBuff(s.buff,s.value??n[s.buff]??1,o,s.color,r.match)}}}case"heal":return{...i,anim:"powerup",startup:28,active:1,recovery:18,cooldown:600,onFrame:(n,r)=>{if(r!==28)return;const a=(s.amount??80)*bn(n,.8,1.2);n.fighter.heal(a),n.match.emit({t:"buff",fighter:n.fighter.index,kind:"regen",color:s.color})}};case"teleport":{const n=!!s.attack,r=10;return{...i,anim:"vanish",startup:n?18:12,active:n?5:1,recovery:n?16:12,invuln:[{from:1,to:r+4,kind:"full"}],hitbox:n?{x:.7,y:1.2,w:.9,h:1}:void 0,hit:n?Vt(80,{knockdown:!0,launch:.14}):void 0,cooldown:90,onFrame:(a,o)=>{if(o!==r)return;const c=a.fighter,l=a.opponent,h=Math.sign(c.x-l.x)||-c.facing;let d;s.mode==="behind"?d=l.x-h*1.1:s.mode==="front"?d=l.x+h*1.1:d=c.x-c.facing*3.5,d=a.match.clampX(d,c),a.match.emit({t:"teleport",fighter:c.index,fromX:c.x,toX:d,color:s.color}),c.x=d,c.faceToward(l.x)}}}case"wave":{const n=t;return{...i,anim:"stomp",prop:s.prop??"wave",startup:14,active:2,recovery:26,canStart:(r,a)=>!a.hasProjectile(r,n),onFrame:(r,a)=>{if(a!==14)return;const o=r.fighter;r.match.spawnProjectile(o,{x:o.x+o.facing*.8,y:.22,vx:o.facing*(s.speed??.13)*bn(r,.85,1.15),w:.75,h:.42,hit:Vt(s.damage??75,{guard:"low",knockdown:!0,launch:.1}),prop:s.prop??"wave",color:s.color,kind:"wave",life:150,tag:n})}}}case"dive":return{...i,anim:"diveKick",startup:10,active:42,recovery:10,airborne:!0,airOK:!0,hitbox:{x:.45,y:.25,w:.75,h:.65},hit:Vt(s.damage??90,{guard:"overhead",hitstun:20}),onStart:r=>{const a=r.fighter;a.grounded?(a.vy=.27,a.vx=a.facing*.05,a.y=.01):a.vy=Math.max(a.vy,.04)},onFrame:(r,a)=>{const o=r.fighter;a>=10&&!o.moveConnected&&(o.vx=o.facing*.2*bn(r,.85,1.15),o.vy=-.24)},onHit:r=>{r.fighter.bounceOff()}};case"trap":{const n=t;return{...i,anim:"place",prop:s.prop,startup:12,active:1,recovery:18,cooldown:240,onFrame:(r,a)=>{if(a!==12)return;const o=r.fighter;r.match.removeProjectiles(o,n),r.match.spawnProjectile(o,{x:r.match.clampX(o.x+o.facing*bn(r,1.4,2.6),o),y:.3,w:.8,h:.6,hit:Vt(s.damage??60,{guard:"low",effect:s.effect??{stun:50},hitstun:26,pushback:.02}),prop:s.prop,color:s.color,kind:"trap",life:600,durability:99,tag:n,spin:0})}}}case"beam":{const n=s.hits??4,r=s.length??4.2,a=Math.round((s.damage??110)/n);return{...i,anim:"beam",prop:s.prop,startup:16,active:26,recovery:22,onFrame:(o,c)=>{if(c!==16)return;const l=o.fighter;o.match.spawnProjectile(l,{x:l.x+l.facing*(.7+r/2),y:1.3,w:r,h:.6,hit:Vt(a,{hitstun:16,blockstun:12,pushback:.05,effect:s.effect}),prop:s.prop??"sound",color:s.color,kind:"beam",attach:!0,offsetX:.7+r/2,life:26,hits:n,rehit:6,durability:99})}}}case"pull":return{...i,anim:"whip",prop:s.prop,startup:12,active:6,recovery:22,hitbox:{x:2,y:1.2,w:2.8,h:.5},hit:Vt(s.damage??50,{hitstun:36,pushback:0,spark:"special"}),onHit:(n,r)=>{if(r)return;const a=n.fighter,o=n.opponent;o.x=n.match.clampX(a.x+a.facing*.95,o),o.slideVx=0}};case"slam":return{...i,anim:"slamRise",prop:s.prop,startup:20,active:50,recovery:18,airborne:!0,hitbox:{x:.2,y:.3,w:1.3,h:.9},hit:Vt(s.damage??120,{guard:"overhead",knockdown:!0,launch:.14}),onStart:n=>{const r=n.fighter;r.vy=.36,r.y=.01;const a=n.opponent.x-r.x;r.vx=Math.max(-.17,Math.min(.17,a/42))},onLand:n=>{const r=n.fighter;n.match.emit({t:"shake",amount:.25});for(const a of[-1,1])n.match.spawnProjectile(r,{x:r.x+a*.6,y:.18,vx:a*.12,w:.6,h:.35,hit:Vt(35,{guard:"low",hitstun:16}),prop:"wave",color:s.color,kind:"wave",life:24})}};case"rain":{const n=s.count??4;return{...i,anim:"summon",prop:s.prop,startup:18,active:1,recovery:28,cooldown:200,onFrame:(r,a)=>{if(a!==18)return;const o=r.fighter;for(let c=0;c<n;c++)r.match.schedule(c*9,()=>{const l=o.opponent;if(!l)return;const h=l.x+(r.match.rng()-.5)*1.8;r.match.spawnProjectile(o,{x:h,y:7.5,vy:-.2,gravity:.004,w:.6,h:.6,hit:Vt(s.damage??32,{guard:"overhead",hitstun:18,tracking:!0}),prop:s.prop,color:s.color,kind:"rain",life:120})})}}}case"shield":return{...i,anim:"guardUp",startup:8,active:1,recovery:14,cooldown:480,onFrame:(n,r)=>{r===8&&(s.reflect?n.fighter.addBuff("reflect",1,240,s.color,n.match):n.fighter.addBuff("shield",s.hits??2,300,s.color,n.match))}};case"spin":{const n=s.hits??4,r=Math.round((s.damage??100)/n),a=8,o=30;return{...i,anim:"spinKick",startup:a,active:o,recovery:14,airborne:!0,hover:{from:8,to:a+o},hitbox:{x:.25,y:1.15,w:1.5,h:.75},hit:Vt(r,{hitstun:18,pushback:.03}),finalHit:{knockdown:!0,launch:.16,pushback:.15},rehit:7,maxHits:n,onFrame:(c,l)=>{const h=c.fighter;l===3&&(h.vy=.13,h.y=.01),l>=a&&l<=a+o&&(h.vx=h.facing*(s.distance??3)*bn(c,.8,1.2)/o)}}}case"barrage":{const n=s.hits??6,r=Math.round((s.damage??110)/n);return{...i,anim:"flurry",prop:s.prop,startup:6,active:26,recovery:18,hitbox:{x:.72,y:1.3,w:.9,h:.8},hit:Vt(r,{hitstun:16,blockstun:10,pushback:.02}),finalHit:{pushback:.2,knockdown:!0,launch:.14},rehit:4,maxHits:n,motion:[{from:6,to:32,vx:.025}]}}}}const H_={cinematic:"Invincible rush. On hit, a devastating combo.",megabeam:"Invincible full-screen beam.",megarain:"Rains destruction across the arena.",megagrab:"Invincible unblockable super grab.",megaprojectile:"Giant unstoppable projectile."};function Ud(s){return s.desc??H_[s.type]}function z_(s){const e={id:"ult",name:s.name,kind:"super",color:s.color,meterCost:Su,superFreeze:48,tag:s.type,desc:Ud(s),prop:s.prop};switch(s.type){case"cinematic":return{...e,anim:"charge",startup:6,active:16,recovery:28,invuln:[{from:1,to:14,kind:"full"}],hitbox:{x:.7,y:1.1,w:1.1,h:1.5},hit:Vt(40,{chip:60,blockstun:22,pushback:.2,spark:"super"}),onFrame:(t,i)=>{const n=t.fighter;i>=4&&i<=22?n.vx=n.moveConnected?0:n.facing*.25:n.vx=0},onHit:(t,i)=>{i||t.match.startCinematic(t.fighter,t.opponent,s.damage??380,s.name,s.color,s.prop)}};case"megabeam":return{...e,anim:"beam",startup:12,active:60,recovery:30,invuln:[{from:1,to:14,kind:"full"}],onFrame:(i,n)=>{if(n!==12)return;const r=i.fighter,a=10;i.match.spawnProjectile(r,{x:r.x+r.facing*(.7+11/2),y:1.25,w:11,h:1.1,hit:Vt(Math.round((s.damage??330)/a),{hitstun:16,blockstun:12,chip:8,pushback:.03,spark:"super",tracking:!0}),prop:s.prop??"wave",color:s.color,kind:"mega",attach:!0,offsetX:.7+11/2,life:60,hits:a,rehit:6,durability:999})}};case"megarain":return{...e,anim:"summon",startup:10,active:1,recovery:36,invuln:[{from:1,to:14,kind:"full"}],onFrame:(t,i)=>{if(i!==10)return;const n=t.fighter;for(let r=0;r<14;r++)t.match.schedule(r*5,()=>{const a=n.opponent;a&&t.match.spawnProjectile(n,{x:a.x+(t.match.rng()-.5)*2.4,y:8,vy:-.26,gravity:.004,w:.85,h:.85,hit:Vt(Math.round((s.damage??380)/14),{guard:"overhead",hitstun:20,chip:6,spark:"super",tracking:!0}),prop:s.prop,color:s.color,kind:"rain",life:120,scale:1.6})})}};case"megagrab":return{...e,anim:"grab",startup:3,active:5,recovery:36,invuln:[{from:1,to:9,kind:"full"}],throwRange:1.75,throwDamage:s.damage??400,techable:!1,grabCinematic:{damage:s.damage??400,name:s.name}};case"megaprojectile":return{...e,anim:"cast",startup:14,active:1,recovery:30,invuln:[{from:1,to:16,kind:"full"}],onFrame:(t,i)=>{if(i!==14)return;const n=t.fighter,r=5;t.match.spawnProjectile(n,{x:n.x+n.facing*1.1,y:1.2,vx:n.facing*.15,w:1.5,h:1.5,hit:Vt(Math.round((s.damage??340)/r),{hitstun:18,chip:10,pushback:.04,spark:"super",tracking:!0}),prop:s.prop,color:s.color,kind:"mega",hits:r,rehit:7,durability:999,life:160,scale:3.2})}}}}const Nd={id:"throwExec",name:"Throw",kind:"throw",anim:"throwExec",startup:0,active:0,recovery:44},G_={...Nd,id:"grabExec",anim:"grabExec",kind:"special"},fu=new Map;function V_(s){const e=s.id+(s.boss?":boss":"");let t=fu.get(e);return t||(t={normals:N_(s.style,s.stats.power??1),throw:F_(s.style,s.passive.id==="bouncer"),specials:s.specials.map((i,n)=>B_(i,n)),ultimate:z_(s.ultimate)},fu.set(e,t)),t}function Fd(s){const e=s.stats,t=(e.speed??1)*(s.passive.id==="swift"?1.18:1)*(s.style==="rushdown"?1.1:s.style==="grappler"?.88:1),i=e.weight??1;return{maxHealth:Math.round(pf*(e.health??1)*(s.style==="grappler"?1.08:1)*(s.boss?1.5:1)),walk:.052*t,back:.042*t,dash:.16*t,jumpVy:.3*(e.jump??1),jumpVx:.07*t,gravity:df*(.94+.06*i),dmgMul:(e.power??1)*(s.boss?1.15:1),defMul:1/(e.defense??1)*(s.passive.id==="thickSkin"?.86:1),meterMul:s.passive.id==="meterBoost"?1.3:1,weight:i}}class pu{index;def;moves;stats;opponent=null;x=0;y=0;z=0;vx=0;vy=0;slideVx=0;facing=1;state="idle";stateFrame=0;move=null;moveFrame=0;moveStrength=.5;moveHits=0;moveLastHit=-99;moveConnected=!1;moveHitConfirmed=!1;armorLeft=0;fallMove=null;landLag=0;throwBack=!1;throwExec=null;grabbedBy=null;jumpDir=0;airJumps=0;airAttackUsed=!1;dashDir=0;sidestepDir=-1;health;recoverable=0;lastHurtFrame=-999;meter=0;stun=0;juggleCount=0;juggleInvuln=!1;comboHits=0;comboDamage=0;invuln=0;lifelineUsed=!1;koed=!1;pendingDizzy=0;buffs=[];cooldowns=new Map;history=new D_;input=di;relDir=5;roundsWon=0;flash=0;guarding=!1;hitHigh=!0;lastHitHeavy=!1;knockdownFrames=Va;victoryVariant=0;constructor(e,t){this.index=e,this.def=t,this.moves=V_(t),this.stats=Fd(t),this.health=this.stats.maxHealth}get grounded(){return this.y<=0&&this.vy<=0}get passive(){return this.def.passive.id}get isCrouching(){return!!(this.state==="crouch"||(this.state==="blockstun"||this.state==="hitstun")&&this.relDir===1&&this.grounded||this.state==="attack"&&this.move?.lowProfile)}get actionable(){return this.state==="idle"||this.state==="walkF"||this.state==="walkB"||this.state==="crouch"}resetForRound(e,t){this.x=e,this.y=0,this.z=0,this.vx=this.vy=this.slideVx=0,this.facing=t,this.state="idle",this.stateFrame=0,this.move=null,this.fallMove=null,this.throwExec=null,this.grabbedBy=null,this.health=this.stats.maxHealth,this.recoverable=0,this.stun=0,this.juggleCount=0,this.juggleInvuln=!1,this.comboHits=0,this.comboDamage=0,this.invuln=0,this.buffs=[],this.pendingDizzy=0,this.cooldowns.clear(),this.history.clear(),this.flash=0,this.guarding=!1,this.passive==="deepPockets"&&(this.meter=Math.max(this.meter,50))}setState(e){this.state!==e&&(this.state=e,this.stateFrame=0)}faceToward(e){Math.abs(e-this.x)>.02&&(this.facing=e>this.x?1:-1)}faceOpponent(){this.opponent&&this.faceToward(this.opponent.x)}ctx(e){return{fighter:this,opponent:this.opponent,match:e,move:this.move,strength:this.moveStrength}}recordInput(e){this.input=e,this.relDir=du(e.dir,this.facing),this.history.push(this.relDir,e.pressed)}addBuff(e,t,i,n,r){this.buffs=this.buffs.filter(a=>a.kind!==e),this.buffs.push({kind:e,value:t,frames:i,color:n}),r?.emit({t:"buff",fighter:this.index,kind:e,color:n})}buff(e){return this.buffs.find(t=>t.kind===e)}speedMul(){let e=1;const t=this.buff("speed");t&&(e*=t.value);const i=this.buff("slow");return i&&(e*=i.value),e}outgoingMul(e){let t=this.stats.dmgMul;const i=this.buff("damage");return i&&(t*=i.value),this.passive==="rage"&&this.health<this.stats.maxHealth*.3&&(t*=1.25),this.passive==="powerSurge"&&(e==="special"||e==="projectile")&&(t*=1.2),t}incomingMul(e){let t=this.stats.defMul;const i=this.buff("defense");return i&&(t*=i.value),e&&this.passive==="projectileProof"&&(t*=.5),t}heal(e){this.health=Math.min(this.stats.maxHealth,this.health+e),this.recoverable=Math.max(0,this.recoverable-e)}gainMeter(e){this.meter=Math.max(0,Math.min(ir,this.meter+e*this.stats.meterMul))}takeDamage(e,t,i=!0){const n=Math.max(0,Math.round(e));return this.health-n<=0&&i&&this.passive==="lifeline"&&!this.lifelineUsed&&!t.training?(this.lifelineUsed=!0,this.health=1,this.invuln=50,t.emit({t:"lifeline",fighter:this.index,name:this.def.passive.name}),!0):(this.health=Math.max(0,this.health-n),this.passive==="regen"&&(this.recoverable=Math.min(this.stats.maxHealth*.4,this.recoverable+n*.4)),this.lastHurtFrame=t.frame,!1)}isInvuln(e){if(this.invuln>0||this.throwExec)return!0;switch(this.state){case"knockdown":case"getup":case"ko":case"cinematic":case"thrown":case"intro":case"victory":return!0}if(this.juggleInvuln||this.state==="dash"&&this.dashDir<0&&this.passive==="quickRecovery"&&this.stateFrame<10)return!0;const t=this.move;if(this.state==="attack"&&t?.invuln){for(const i of t.invuln)if(this.moveFrame>=i.from&&this.moveFrame<=i.to&&(i.kind==="full"||i.kind===e))return!0}return!1}isEvading(){return this.state==="sidestep"&&this.stateFrame>=2&&this.stateFrame<=15}canBlock(){if(!this.grounded)return!1;switch(this.state){case"idle":case"walkF":case"walkB":case"crouch":case"blockstun":return!0}return!1}blockOK(e){if(e==="unblockable"||!L_(this.relDir))return!1;const t=this.relDir===1;return e==="low"?t:e==="overhead"||e==="high"?!t:!0}isCounterable(){const e=this.move;return this.state==="attack"&&!!e&&this.moveFrame<=e.startup+e.active&&e.kind!=="throw"}inCounterWindow(){const e=this.move?.counterWindow;return this.state==="attack"&&!!e&&this.moveFrame>=e.from&&this.moveFrame<=e.to}hasArmor(){if(this.buff("armor"))return!0;const e=this.move;return this.state!=="attack"||!e||this.armorLeft<=0?!1:!!(e.armor&&this.moveFrame>=e.armor.from&&this.moveFrame<=e.armor.to||this.passive==="heavyArmor"&&e.tag==="heavy"&&this.moveFrame<=e.startup+1)}consumeArmor(){const e=this.buff("armor");if(e){e.value-=1,e.value<=0&&(e.frames=0);return}this.armorLeft--}hurtboxes(){switch(this.state){case"knockdown":case"getup":case"ko":case"intro":case"victory":return[]}const e=this.def.look.height,t=.58*Math.min(1.3,this.def.look.build),i=[];!this.grounded||this.state==="air"||this.state==="juggle"||this.state==="fall"?i.push({x:this.x,y:this.y+.95*e,w:t,h:1.3*e}):this.isCrouching?i.push({x:this.x,y:.55*e,w:t+.08,h:1.1*e}):i.push({x:this.x,y:.9*e,w:t,h:1.8*e});const n=this.move;if(this.state==="attack"&&n?.hitbox&&n.kind==="normal"&&this.moveFrame>n.startup){const r=this.worldBox(n.hitbox);i.push({x:r.x-this.facing*r.w*.1,y:r.y,w:r.w*.7,h:r.h*.8})}return i}worldBox(e){return{x:this.x+this.facing*e.x,y:this.y+e.y,w:e.w,h:e.h}}activeHitbox(){const e=this.move;if(this.state!=="attack"||!e?.hitbox||!e.hit)return null;const t=this.moveFrame;return t<=e.startup||t>e.startup+e.active||e.maxHits!==void 0&&this.moveHits>=e.maxHits||this.moveHits>0&&(!e.rehit||t-this.moveLastHit<e.rehit)?null:this.worldBox(e.hitbox)}canUse(e,t){return!(e.meterCost&&this.meter<e.meterCost&&!t.infiniteMeter(this)||(this.cooldowns.get(e.id)??0)>0||e.canStart&&!e.canStart(this,t))}update(e){switch(this.stateFrame++,this.invuln>0&&this.invuln--,this.flash>0&&this.flash--,this.tickBuffs(e),this.state){case"intro":case"victory":case"ko":case"cinematic":case"thrown":return;case"idle":case"walkF":case"walkB":case"crouch":this.neutral(e);return;case"jumpSquat":this.stateFrame>=4&&this.takeoff(e);return;case"air":this.airUpdate(e);return;case"land":this.stateFrame>=this.landLag&&this.toNeutral();return;case"dash":this.dashUpdate();return;case"sidestep":{const t=this.stateFrame/20;this.z=this.sidestepDir*Math.sin(Math.PI*Math.min(1,t))*.9,this.stateFrame>=20&&(this.z=0,this.toNeutral());return}case"attack":this.attackUpdate(e);return;case"hitstun":case"blockstun":case"dizzy":this.stun--,this.stun<=0&&this.toNeutral();return;case"knockdown":this.stateFrame>=this.knockdownFrames&&this.setState("getup");return;case"getup":this.stateFrame>=mf&&(this.faceOpponent(),this.toNeutral());return;case"fall":case"juggle":return}}tickBuffs(e){if(this.buffs.length){for(const t of this.buffs)t.frames--,t.kind==="regen"&&this.heal(t.value),t.kind==="meter"&&this.gainMeter(t.value);this.buffs=this.buffs.filter(t=>t.frames>0)}if(this.cooldowns.size)for(const[t,i]of this.cooldowns)i<=1?this.cooldowns.delete(t):this.cooldowns.set(t,i-1);if(this.passive==="regen"&&this.recoverable>0&&e.frame-this.lastHurtFrame>90&&this.health>0){const t=Math.min(this.recoverable,.35);this.health=Math.min(this.stats.maxHealth,this.health+t),this.recoverable-=t}}toNeutral(){this.move=null,this.fallMove=null,this.throwExec=null,this.comboHits=0,this.comboDamage=0,this.juggleCount=0,this.juggleInvuln=!1,this.airAttackUsed=!1,this.airJumps=0,this.stun=0,this.z=0,this.grounded?(this.vx=0,this.setState(Gs(this.relDir)?"crouch":"idle")):this.setState("air")}neutral(e){if(this.faceOpponent(),this.relDir=du(this.input.dir,this.facing),this.tryAttack(e,!1))return;const t=this.relDir,i=this.history;if(i.buffered(fe.SS,3)){i.consume(fe.SS,3),this.sidestepDir=Gs(t)?1:-1,this.setState("sidestep");return}if(i.dash(!0)){this.dashDir=1,this.setState("dash");return}if(i.dash(!1)){this.dashDir=-1,this.setState("dash");return}if(Bo(t)){this.jumpDir=t===9?1:t===7?-1:0,this.setState("jumpSquat");return}if(Gs(t)){this.setState("crouch"),this.guarding=!1;return}if(t===6){this.setState("walkF"),this.guarding=!1;return}if(t===4){this.setState("walkB"),this.guarding=e.isThreatened(this);return}this.guarding=!1,this.setState("idle")}takeoff(e){this.vy=this.stats.jumpVy,this.y=.001,this.vx=this.jumpDir*this.stats.jumpVx*this.facing*this.speedMul(),this.airAttackUsed=!1,this.airJumps=0,this.setState("air"),e.emit({t:"jump",fighter:this.index})}airUpdate(e){if(!this.airAttackUsed&&this.tryAttack(e,!0)){this.airAttackUsed=!0;return}if(this.passive==="doubleJump"&&this.airJumps<1&&this.stateFrame>6){const t=this.history.dirs,i=t.length;if(i>=2&&Bo(t[i-1])&&!Bo(t[i-2])){this.airJumps++;const n=t[i-1]===9?1:t[i-1]===7?-1:0;this.vy=this.stats.jumpVy*.85,this.vx=n*this.stats.jumpVx*this.facing,e.emit({t:"jump",fighter:this.index})}}}dashUpdate(){const e=this.dashDir>0?16:20,t=this.stateFrame/e;this.vx=this.facing*this.dashDir*this.stats.dash*this.speedMul()*Math.sin(Math.PI*Math.min(1,t))*(this.dashDir>0?1:.8),this.stateFrame>=e&&(this.vx=0,this.toNeutral())}pickSpecial(e){const t=this.history,i=this.relDir;let n=-1,r=.5;if(t.buffered(fe.SP))n=Gs(i)?2:R_(i)?1:0;else{const o=t.buffered(Go),c=t.buffered(_u);o&&t.motion("dp")?(n=2,r=o&fe.HP?1:0):o&&t.motion("qcf")?(n=0,r=o&fe.HP?1:0):c&&t.motion("qcb")&&(n=1,r=c&fe.HK?1:0)}if(n<0)return null;const a=this.moves.specials[n];return e&&!a.airOK?null:[a,r]}pickNormal(e){const t=this.history.buffered(Ps);if(!t)return null;const i=this.relDir;return e?t&fe.HK?"jRoundhouse":t&fe.HP?"jStrong":t&fe.LK?"jShort":"jJab":Gs(i)?t&fe.HK?"sweep":t&fe.HP?"cStrong":t&fe.LK?"cShort":"cJab":i===6&&t&fe.HP?"overhead":t&fe.HK?"roundhouse":t&fe.HP?"strong":t&fe.LK?"short":"jab"}wantsThrow(){const e=this.history;return e.buffered(fe.TH)!==0||e.pressedTogether(fe.LP,fe.LK)}tryUltimate(e){const t=this.history,i=this.moves.ultimate;return this.meter<Su&&!e.infiniteMeter(this)?!1:(t.buffered(fe.UL)||t.buffered(Go)&&t.motion("dqcf"))&&this.canUse(i,e)?(t.consume(fe.UL|Ps|fe.SP),this.startMove(i,1,e),!0):!1}trySpecial(e,t){const i=this.pickSpecial(t);if(!i)return!1;const[n,r]=i;return this.canUse(n,e)?(this.history.consume(Ps|fe.SP),this.startMove(n,r,e),!0):!1}tryAttack(e,t){if(!t&&this.tryUltimate(e)||this.trySpecial(e,t))return!0;if(!t&&this.wantsThrow())return this.history.consume(fe.TH|fe.LP|fe.LK),this.throwBack=this.relDir===4||this.relDir===1||this.relDir===7,this.startMove(this.moves.throw,.5,e),!0;const i=this.pickNormal(t);return i?(this.history.consume(Ps),this.startMove(this.moves.normals[i],.5,e),!0):!1}startMove(e,t,i){this.move=e,this.moveFrame=0,this.moveStrength=t,this.moveHits=0,this.moveLastHit=-99,this.moveConnected=!1,this.moveHitConfirmed=!1,this.fallMove=null,this.armorLeft=e.armor?.hits??(this.passive==="heavyArmor"&&e.tag==="heavy"?1:0),this.guarding=!1,this.setState("attack"),this.stateFrame=0,e.meterCost&&!i.infiniteMeter(this)&&(this.meter-=e.meterCost),e.cooldown&&this.cooldowns.set(e.id,e.cooldown),this.grounded&&!e.air&&(this.vx=0),e.superFreeze?i.superFlash(this,e):e.kind==="special"?(i.emit({t:"special",fighter:this.index,name:e.name,color:e.color??16777215}),this.gainMeter(2)):(e.kind==="normal"||e.kind==="throw")&&i.emit({t:"whiff",fighter:this.index,heavy:e.tag==="heavy"}),e.onStart?.(this.ctx(i))}attackUpdate(e){const t=this.move;if(!t){this.toNeutral();return}this.moveFrame++;const i=this.moveFrame;if(!t.airborne&&!t.air&&this.grounded&&(this.vx=0),t.motion)for(const r of t.motion)i>=r.from&&i<=r.to&&(r.vx!==void 0&&(this.vx=this.facing*r.vx),r.vy!==void 0&&(this.vy=r.vy));if(t.onFrame?.(this.ctx(e),i),this.move!==t)return;if(i<=2&&(t.id==="jab"||t.id==="short")&&this.history.pressedTogether(fe.LP,fe.LK)){this.history.consume(fe.LP|fe.LK),this.throwBack=this.relDir===4,this.startMove(this.moves.throw,.5,e);return}if(t.throwRange&&!this.throwExec&&i>t.startup&&i<=t.startup+t.active&&(e.tryGrab(this,t),this.move!==t)||this.moveConnected&&i>=t.startup&&this.tryCancel(e,t))return;const n=t.startup+t.active+t.recovery;if(t.airborne){i>=t.startup+t.active&&!this.grounded?(this.fallMove=t,this.landLag=t.recovery,this.move=null,this.setState("fall")):i>=n&&this.endMove(e);return}i>=n&&this.endMove(e)}tryCancel(e,t){if(t.kind==="normal"){if(t.cancel?.includes("super")&&this.tryUltimate(e)||t.cancel?.includes("special")&&this.trySpecial(e,!!t.air))return!0;if(t.chain){const i=this.pickNormal(!!t.air);if(i&&t.chain.includes(i))return this.history.consume(Ps),this.startMove(this.moves.normals[i],.5,e),!0}}else if(t.kind==="special"&&this.moveHitConfirmed&&t.cancel?.includes("super")&&this.tryUltimate(e))return!0;return!1}endMove(e){const t=this.move;t?.onEnd&&t.onEnd(this.ctx(e)),this.move=null,this.throwExec=null,this.grounded?this.toNeutral():(this.setState(t?.air?"air":"fall"),t?.air&&(this.airAttackUsed=!0),this.landLag=4)}bounceOff(){this.move&&(this.fallMove=null,this.landLag=6,this.move=null),this.vx=-this.facing*.07,this.vy=.16,this.setState("fall")}enterHitstun(e,t,i){this.move=null,this.fallMove=null,this.throwExec=null,this.stun=Math.max(1,Math.round(e*(this.passive==="ironWill"?.85:1))),this.hitHigh=t,this.lastHitHeavy=i,this.guarding=!1,this.state="hitstun",this.stateFrame=0}enterBlockstun(e){this.stun=e,this.guarding=!0,this.state="blockstun",this.stateFrame=0}enterJuggle(e,t){this.move=null,this.fallMove=null,this.throwExec=null,this.juggleCount++,this.juggleCount>5&&(this.juggleInvuln=!0),this.vy=e,this.vx=t,this.slideVx=0,this.y<=0&&(this.y=.01),this.state="juggle",this.stateFrame=0}enterDizzy(e){this.move=null,this.stun=e,this.state="dizzy",this.stateFrame=0}physics(e){if(this.state==="thrown"||this.state==="cinematic")return;const t=this.speedMul();switch(this.state){case"walkF":this.vx=this.facing*this.stats.walk*t;break;case"walkB":this.vx=this.guarding?0:-this.facing*this.stats.back*t;break;case"idle":case"crouch":case"land":case"blockstun":case"hitstun":case"dizzy":case"knockdown":case"getup":case"jumpSquat":case"sidestep":case"intro":case"victory":this.grounded&&(this.vx=0);break}if(this.x+=this.vx+this.slideVx,this.grounded?(this.slideVx*=.82,Math.abs(this.slideVx)<.002&&(this.slideVx=0)):this.slideVx*=.95,this.y>0||this.vy>0){const i=this.move;i?.hover&&this.state==="attack"&&this.moveFrame>=i.hover.from&&this.moveFrame<=i.hover.to?this.vy=0:this.vy-=this.stats.gravity,this.y+=this.vy,this.y<=0&&(this.y=0,this.land(e))}}land(e){const t=this.vy;switch(this.vy=0,this.y=0,this.state){case"air":this.vx=0,this.landLag=3,this.faceOpponent(),this.setState("land"),e.emit({t:"land",fighter:this.index,hard:!1});break;case"attack":{const i=this.move;if(this.vx=0,i?.airborne){if(this.moveFrame<=2)break;i.onLand?.(this.ctx(e)),this.landLag=i.recovery}else this.landLag=i?.air?4:2;this.move=null,this.faceOpponent(),this.setState("land"),e.emit({t:"land",fighter:this.index,hard:!1});break}case"fall":{this.vx=0;const i=this.fallMove;i?.onLand&&(this.move=i,i.onLand(this.ctx(e)),this.move=null),this.fallMove=null,this.faceOpponent(),this.setState("land"),e.emit({t:"land",fighter:this.index,hard:!1});break}case"juggle":this.vx=0,this.slideVx=-this.facing*.03,this.koed?this.setState("ko"):this.pendingDizzy>0?(this.enterDizzy(this.pendingDizzy),this.pendingDizzy=0):(this.knockdownFrames=this.passive==="quickRecovery"?Math.round(Va/2):Va,this.setState("knockdown")),e.emit({t:"land",fighter:this.index,hard:!0}),e.emit({t:"shake",amount:Math.min(.2,Math.abs(t)*.5)});break;case"ko":this.vx=0,e.emit({t:"land",fighter:this.index,hard:!0});break;default:this.vx=0}}}let W_=1;class X_{id=W_++;owner;x;y;vx;vy;w;h;hit;prop;color;kind;hitsLeft;rehit;durability;life;age=0;gravity;attach;offsetX;homing;delay;scale;spin;tag;facing;lastHitAge=-999;dead=!1;reflected=!1;onHit;constructor(e,t){this.owner=e,this.x=t.x,this.y=t.y,this.vx=t.vx??0,this.vy=t.vy??0,this.w=t.w,this.h=t.h,this.hit=t.hit,this.prop=t.prop,this.color=t.color,this.kind=t.kind??"normal",this.hitsLeft=t.hits??1,this.rehit=t.rehit??8,this.durability=t.durability??this.hitsLeft,this.life=t.life??240,this.gravity=t.gravity??0,this.attach=!!t.attach,this.offsetX=t.offsetX??0,this.homing=t.homing??0,this.delay=t.delay??0,this.scale=t.scale??1,this.spin=t.spin??.2,this.tag=t.tag,this.facing=e.facing,this.onHit=t.onHit}get active(){return!this.dead&&this.age>=this.delay}update(e){if(this.age++,!(this.age<this.delay)){if(this.attach){const t=this.owner;this.x=t.x+t.facing*this.offsetX,this.facing=t.facing,(t.state==="hitstun"||t.state==="juggle"||t.state==="knockdown"||t.state==="thrown")&&(this.dead=!0)}else{if(this.homing>0&&e){const t=e.y+1;this.vy+=Math.sign(t-this.y)*this.homing*.01,this.vy=Math.max(-.08,Math.min(.08,this.vy))}this.vy-=this.gravity,this.x+=this.vx,this.y+=this.vy,this.kind==="rain"&&this.y<.2&&(this.dead=!0),this.gravity>0&&this.y<.15&&this.kind!=="rain"&&(this.dead=!0)}this.age>=this.life+this.delay&&(this.dead=!0),Math.abs(this.x)>16&&(this.dead=!0)}}box(){return{x:this.x,y:this.y,w:this.w,h:this.h}}}function Od(s,e){return Math.abs(s.x-e.x)*2<s.w+e.w&&Math.abs(s.y-e.y)*2<s.h+e.h}function Ho(s,e){for(const t of e)if(Od(s,t))return t;return null}function mu(s,e,t){return s.hitstop!==void 0?s.hitstop:t?e==="super"?5:7:e==="super"?12:s.spark==="heavy"?10:e==="special"?11:7}class q_{fighters;projectiles=[];events=[];config;frame=0;ticks=0;phase="intro";phaseFrame=0;round=1;timer=0;hitstop=0;freeze=0;freezeOwner=null;slowmo=0;cinematic=null;roundWinner=null;matchWinner=null;perfect=!1;paused=!1;scheduled=[];seed;constructor(e){this.config=e,this.seed=e.seed??Math.random()*2**31|0;const t=new pu(0,e.p1),i=new pu(1,e.p2);t.opponent=i,i.opponent=t,this.fighters=[t,i],t.victoryVariant=this.rngInt(3),i.victoryVariant=this.rngInt(3),this.placeFighters(),this.timer=e.roundTime*60,e.training||e.skipIntro?(this.startRound(),e.training&&(this.phase="fight",this.phaseFrame=0)):(this.phase="intro",t.state="intro",i.state="intro")}get training(){return!!this.config.training}infiniteMeter(e){return!!this.config.training?.infiniteMeter&&e.index>=0}rng(){let e=this.seed+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}rngInt(e){return Math.floor(this.rng()*e)}emit(e){this.events.push(e),this.events.length>400&&this.events.splice(0,this.events.length-400)}drainEvents(){const e=this.events;return this.events=[],e}schedule(e,t){this.scheduled.push({at:this.frame+e,fn:t})}clampX(e,t){const i=Ga-.35;return Math.max(-i,Math.min(i,e))}spawnProjectile(e,t){const i=new X_(e,t);return this.projectiles.push(i),this.emit({t:"projectile",id:i.id,owner:e.index}),i}hasProjectile(e,t){return this.projectiles.some(i=>i.owner===e&&i.tag===t&&!i.dead)}removeProjectiles(e,t){for(const i of this.projectiles)i.owner===e&&i.tag===t&&(i.dead=!0)}superFlash(e,t){this.freeze=t.superFreeze??40,this.freezeOwner=e,this.emit({t:"superFlash",fighter:e.index,name:t.name,color:t.color??16763904}),this.emit({t:"rumble",fighter:e.index,strong:.4,weak:.8,ms:400})}isThreatened(e){const t=e.opponent,i=Math.abs(t.x-e.x);if(t.state==="attack"&&t.move&&i<3.4&&t.moveFrame<=t.move.startup+t.move.active)return!0;for(const n of this.projectiles)if(n.owner===t&&!n.dead&&Math.abs(n.x-e.x)<3.8&&Math.sign(e.x-n.x)===Math.sign(n.vx||n.facing)||n.owner===t&&n.kind==="rain"&&Math.abs(n.x-e.x)<1.5)return!0;return!1}placeFighters(){const[e,t]=this.fighters;e.resetForRound(-2.1,1),t.resetForRound(2.1,-1)}skipIntro(){this.phase==="intro"&&this.startRound()}startRound(){this.phase="roundStart",this.phaseFrame=0,this.timer=this.config.roundTime*60,this.projectiles=[],this.scheduled=[],this.cinematic=null,this.hitstop=0,this.freeze=0,this.slowmo=0,this.roundWinner=null,this.perfect=!1,this.placeFighters();for(const e of this.fighters)e.koed=!1}resetPositions(){this.placeFighters(),this.projectiles=[],this.scheduled=[],this.cinematic=null;for(const e of this.fighters)e.koed=!1,this.config.training?.infiniteMeter&&(e.meter=ir)}tick(e){if(this.ticks++,this.paused)return;const t=this.phase==="fight";if(this.fighters[0].recordInput(t?e[0]:di),this.fighters[1].recordInput(t?e[1]:di),this.hitstop>0){this.hitstop--;return}if(this.freeze>0){this.freeze--,this.freeze===0&&(this.freezeOwner=null);return}this.slowmo>0&&(this.slowmo--,this.slowmo%2===1)||(this.phaseFrame++,this.simulate(),this.phaseLogic())}simulate(){if(this.frame++,this.scheduled.length){const e=this.scheduled.filter(t=>t.at<=this.frame);this.scheduled=this.scheduled.filter(t=>t.at>this.frame);for(const t of e)t.fn()}this.cinematic&&this.updateCinematic();for(const e of this.fighters)e.update(this);this.updateThrows();for(const e of this.fighters)e.physics(this);this.resolvePush(),this.updateProjectiles(),this.phase==="fight"&&this.detectHits(),this.config.training&&this.trainingUpkeep()}phaseLogic(){const[e,t]=this.fighters;switch(this.phase){case"intro":this.phaseFrame>=200&&this.startRound();break;case"roundStart":{if(this.phaseFrame===1){const i=e.roundsWon===this.config.roundsToWin-1&&t.roundsWon===this.config.roundsToWin-1;this.emit({t:"round",n:this.round}),this.emit({t:"announce",text:i?"FINAL ROUND":`ROUND ${this.round}`,big:!0,frames:60})}this.phaseFrame===66&&(this.emit({t:"fight"}),this.emit({t:"announce",text:"FIGHT!",big:!0,frames:45})),this.phaseFrame>=76&&(this.phase="fight",this.phaseFrame=0);break}case"fight":{if(this.config.roundTime>0&&!this.training&&!this.cinematic&&(this.timer--,this.timer<=0)){this.timeout();break}if(this.cinematic)break;const i=this.fighters.filter(n=>n.health<=0);i.length&&this.ko(i);break}case"ko":{if(this.phaseFrame===110)for(const i of this.fighters)!i.koed&&this.roundWinner===i.index&&(i.move=null,i.throwExec=null,i.faceOpponent(),i.grounded&&i.setState("victory"));if(this.phaseFrame>110)for(const i of this.fighters)!i.koed&&this.roundWinner===i.index&&i.state!=="victory"&&i.grounded&&i.actionable&&i.setState("victory");this.phaseFrame>=200&&this.endRound();break}case"roundEnd":this.phaseFrame>=30&&(this.round++,this.startRound());break}}ko(e){this.phase="ko",this.phaseFrame=0,this.slowmo=70;for(const i of e)i.koed=!0,i.state!=="juggle"&&i.enterJuggle(.17,-i.facing*.07);this.roundWinner=e.length===2?-1:1-e[0].index;const t=this.roundWinner>=0?this.fighters[this.roundWinner]:null;this.perfect=!!t&&t.health>=t.stats.maxHealth,this.emit({t:"ko",loser:e.length===2?-1:e[0].index,perfect:this.perfect}),this.emit({t:"announce",text:e.length===2?"DOUBLE K.O.":"K.O.",big:!0,frames:100}),this.emit({t:"shake",amount:.35});for(const i of this.fighters)this.emit({t:"rumble",fighter:i.index,strong:1,weak:1,ms:600})}timeout(){this.phase="ko",this.phaseFrame=0;const[e,t]=this.fighters,i=e.health/e.stats.maxHealth,n=t.health/t.stats.maxHealth;this.roundWinner=Math.abs(i-n)<1e-6?-1:i>n?0:1,this.perfect=!1;for(const r of this.fighters)(r.state==="attack"||r.state==="dash"||r.state==="walkF"||r.state==="walkB")&&(r.move=null,r.grounded&&r.setState("idle"));this.emit({t:"timeout"}),this.emit({t:"announce",text:"TIME",big:!0,frames:100})}endRound(){const[e,t]=this.fighters;this.roundWinner===-1?(e.roundsWon++,t.roundsWon++):this.roundWinner!==null&&this.fighters[this.roundWinner].roundsWon++;const i=this.config.roundsToWin,n=e.roundsWon>=i,r=t.roundsWon>=i;if(n||r){this.matchWinner=n&&r?-1:n?0:1,this.phase="matchEnd",this.phaseFrame=0;const a=this.matchWinner>=0?this.fighters[this.matchWinner]:null;this.emit({t:"announce",text:a?`${a.def.name.toUpperCase()} WINS`:"DRAW GAME",big:!0,frames:150}),a&&(a.move=null,a.faceOpponent(),a.grounded&&a.setState("victory"))}else this.phase="roundEnd",this.phaseFrame=0}trainingUpkeep(){const e=this.config.training;for(const t of this.fighters)e.infiniteMeter&&(t.meter=ir),e.infiniteHealth&&(t.health<=0&&(t.health=1),t.actionable&&t.stateFrame>40&&t.health<t.stats.maxHealth&&(t.health=t.stats.maxHealth)),t.koed&&(t.koed=!1)}resolvePush(){const[e,t]=this.fighters,i=Ga-.35;for(const f of this.fighters)f.x=Math.max(-i,Math.min(i,f.x));const n=t.x-e.x;if(Math.abs(n)>Fc){const f=Math.abs(n)-Fc,g=Math.sign(n),S=Math.sign(e.vx+e.slideVx)===-g,p=Math.sign(t.vx+t.slideVx)===g;S&&!p?e.x+=g*f:p&&!S?t.x-=g*f:(e.x+=g*f/2,t.x-=g*f/2)}const r=f=>f.state==="thrown"||f.state==="cinematic"||f.koed&&f.state==="ko";if(r(e)||r(t))return;const a=e.y+(e.isCrouching?1.1:1.7),o=t.y+(t.isCrouching?1.1:1.7);if(e.y>=o-.25||t.y>=a-.25)return;const c=t.x-e.x,l=ff-Math.abs(c);if(l<=0)return;let h=Math.sign(c);h===0&&(h=e.facing);let d=l/2,u=l/2;e.x-h*d<-i||e.x-h*d>i?(u=l,d=0):(t.x+h*u<-i||t.x+h*u>i)&&(d=l,u=0),e.x-=h*d,t.x+=h*u,e.x=Math.max(-i,Math.min(i,e.x)),t.x=Math.max(-i,Math.min(i,t.x))}atWall(e){return Math.abs(e.x)>=Ga-.4}tryGrab(e,t){const i=e.opponent;if(!i.grounded||i.y>.05||i.isInvuln("throw"))return;switch(i.state){case"hitstun":case"blockstun":case"juggle":case"knockdown":case"getup":case"thrown":case"jumpSquat":return}if(i.isEvading())return;const n=Math.abs(i.x-e.x);if(!(n>(t.throwRange??1))&&!(n>.3&&Math.sign(i.x-e.x)!==e.facing)){if(t.grabCinematic){this.startCinematic(e,i,t.grabCinematic.damage,t.grabCinematic.name,t.color??16763904,t.prop);return}e.throwExec={target:i,frame:0,total:44,damage:(t.throwDamage??120)*e.outgoingMul(t.kind),techable:!!t.techable,back:t.kind==="throw"&&e.throwBack,move:t},e.move=t.kind==="throw"?Nd:G_,e.moveFrame=0,e.stateFrame=0,i.move=null,i.throwExec=null,i.setState("thrown"),i.grabbedBy=e,i.guarding=!1,this.emit({t:"sfx",name:"grab"}),t.kind!=="throw"&&this.emit({t:"special",fighter:e.index,name:t.name,color:t.color??16777215})}}updateThrows(){for(const e of this.fighters){const t=e.throwExec;if(!t)continue;const i=t.target;if(i.state!=="thrown"){e.throwExec=null;continue}if(t.frame++,i.x=this.clampX(e.x+e.facing*.72),i.y=.12+Math.sin(Math.min(1,t.frame/26)*Math.PI)*.35,i.vx=i.vy=0,i.facing=-e.facing,t.techable&&t.frame<=Sr){const n=i.history;if(n.buffered(fe.TH,Sr)||n.pressedTogether(fe.LP,fe.LK,Sr)){n.consume(fe.TH|fe.LP|fe.LK,Sr),e.throwExec=null,e.move=null,i.grabbedBy=null,i.y=0,e.enterBlockstun(14),i.enterBlockstun(14),e.slideVx=-e.facing*.16,i.slideVx=e.facing*.16,this.emit({t:"tech",x:(e.x+i.x)/2,y:1.2}),this.emit({t:"announce",text:"TECH!",frames:30});continue}}if(t.frame===26){let n=e.facing;t.back&&(i.x=this.clampX(e.x-e.facing*.8),n=-e.facing);const r=t.damage*i.incomingMul(!1);i.grabbedBy=null,i.y=.3,i.state="juggle",i.takeDamage(r,this),i.comboHits++;const a=t.move.hit?.effect;if(a?.drain){const o=Math.min(i.meter,a.drain);i.meter-=o,e.gainMeter(o)}a?.lifesteal&&e.heal(a.lifesteal),i.enterJuggle(.2,n*.11),a?.stun&&i.health>0&&(i.pendingDizzy=a.stun),e.gainMeter(12),i.gainMeter(6),this.hitstop=Math.max(this.hitstop,10),i.flash=10,this.emit({t:"hit",x:i.x,y:1,spark:"heavy",blocked:!1,counter:!1,attacker:e.index,defender:i.index,damage:Math.round(r),color:t.move.color}),this.emit({t:"shake",amount:.2}),this.emit({t:"rumble",fighter:i.index,strong:.9,weak:.5,ms:250}),e.throwExec=null}}}startCinematic(e,t,i,n,r,a){for(const o of this.projectiles)o.owner===t&&(o.dead=!0);e.move=null,e.throwExec=null,e.fallMove=null,e.vx=e.vy=e.slideVx=0,e.y=0,e.setState("cinematic"),t.move=null,t.throwExec=null,t.grabbedBy=null,t.vx=t.vy=t.slideVx=0,t.y=0,t.setState("cinematic"),t.x=this.clampX(e.x+e.facing*.95),Math.abs(t.x-e.x)<.9&&(e.x=this.clampX(t.x-e.facing*.95)),t.facing=-e.facing,this.cinematic={att:e,def:t,frame:0,total:104,hits:8,damage:i,name:n,color:r,prop:a,scale:Math.max(.5,Bc(t.comboHits+1))},this.emit({t:"sfx",name:"cinematic"})}updateCinematic(){const e=this.cinematic;e.frame++;const{att:t,def:i}=e;t.stateFrame=e.frame,i.stateFrame=e.frame;const n=11;if(e.frame%n===0&&e.frame/n<=e.hits){const r=e.frame/n,a=r===e.hits,o=e.damage/e.hits*t.outgoingMul("super")*i.incomingMul(!1)*e.scale*(a?1.4:.943);i.comboHits++,i.takeDamage(o,this,a),i.flash=8,this.emit({t:"hit",x:i.x-i.facing*.2,y:.9+r*37%7/10,spark:a?"super":"heavy",blocked:!1,counter:!1,attacker:t.index,defender:i.index,damage:Math.round(o),color:e.color}),this.emit({t:"shake",amount:a?.3:.08}),this.emit({t:"rumble",fighter:i.index,strong:a?1:.5,weak:.4,ms:a?400:90}),a&&(this.hitstop=14)}e.frame>=e.total&&(this.cinematic=null,t.state="idle",t.toNeutral(),i.state="idle",i.enterJuggle(.3,t.facing*.1),i.juggleInvuln=!0,t.gainMeter(0))}detectHits(){const[e,t]=this.fighters,i=e.activeHitbox(),n=t.activeHitbox(),r=e.hurtboxes(),a=t.hurtboxes(),o=i?Ho(i,a):null,c=n?Ho(n,r):null;o&&i&&this.strike(e,t,i,o),c&&n&&this.strike(t,e,n,c)}strike(e,t,i,n){const r=e.move;if(!r?.hit)return;let a=r.hit;(r.maxHits??1)>1&&r.finalHit&&e.moveHits+1>=(r.maxHits??1)&&(a={...a,...r.finalHit});const c=(Math.max(i.x-i.w/2,n.x-n.w/2)+Math.min(i.x+i.w/2,n.x+n.w/2))/2,l=Math.max(Math.min(i.y,n.y+n.h/2-.1),n.y-n.h/2+.1),h=this.resolveHit(e,t,a,{kind:r.kind,x:c,y:l});h!=="miss"&&(e.moveHits++,e.moveLastHit=e.moveFrame,h!=="counter"&&(e.moveConnected=!0,(h==="hit"||h==="armor")&&(e.moveHitConfirmed=!0),e.move===r&&r.onHit?.(e.ctx(this),h==="block"||h==="absorb")))}triggerCounter(e,t){const i=e.move.counterMove;t.move=null,t.enterHitstun(34,!0,!0),t.flash=6,e.faceOpponent(),e.startMove(i,.5,this),this.hitstop=Math.max(this.hitstop,12),this.emit({t:"counterHit",fighter:e.index}),this.emit({t:"announce",text:"COUNTER!",frames:40}),this.emit({t:"hit",x:(t.x+e.x)/2,y:1.3,spark:"special",blocked:!0,counter:!0,attacker:e.index,defender:t.index,damage:0,color:i.color})}resolveHit(e,t,i,n){const r=n.projectile,a=!!r;if(t.isInvuln(a?"projectile":"strike")||t.isEvading()&&!i.tracking)return"miss";if(t.inCounterWindow()&&t.move?.counterMove)return a?(this.emit({t:"clash",x:n.x,y:n.y}),"absorb"):(this.triggerCounter(t,e),"counter");if(a&&t.buff("reflect")&&r.kind!=="mega"&&r.kind!=="beam")return r.owner=t,r.vx=-r.vx,r.facing=-r.facing,r.reflected=!0,r.age=0,r.lastHitAge=-999,this.emit({t:"clash",x:n.x,y:n.y}),this.emit({t:"sfx",name:"reflect"}),"reflect";const o=t.buff("shield");if(o)return o.value--,o.value<=0&&(o.frames=0),this.hitstop=Math.max(this.hitstop,6),this.emit({t:"hit",x:n.x,y:n.y,spark:"light",blocked:!0,counter:!1,attacker:e.index,defender:t.index,damage:0,color:o.color}),this.emit({t:"sfx",name:"shield"}),"absorb";const c=a?Math.sign(r.vx)||r.facing:Math.sign(t.x-e.x)||e.facing,l=a?r.kind==="mega"?"super":"projectile":n.kind,h=i.spark==="heavy"||i.spark==="super"||i.spark==="special";if(t.canBlock()&&t.blockOK(i.guard)){let b=i.chip??0;return e.passive==="chipMaster"&&(b=Math.max(b*3,i.damage*.12)),b>0&&t.takeDamage(b*e.outgoingMul(l==="projectile"?"projectile":n.kind)*t.incomingMul(a),this),t.enterBlockstun(i.blockstun),t.slideVx=c*i.pushback*1.15,!a&&this.atWall(t)&&(e.slideVx=-c*i.pushback*.9),e.gainMeter(3),t.gainMeter(3),this.hitstop=Math.max(this.hitstop,Math.max(4,mu(i,n.kind,a)-3)),this.emit({t:"hit",x:n.x,y:n.y,spark:"light",blocked:!0,counter:!1,attacker:e.index,defender:t.index,damage:0}),this.emit({t:"rumble",fighter:t.index,strong:.15,weak:.3,ms:80}),"block"}const d=!a&&t.isCounterable();let u=i.damage*e.outgoingMul(l);d&&(u*=e.passive==="counterPunch"?1.5:1.2),t.comboHits++;let f=Bc(t.comboHits);if(e.passive==="comboMaster"&&(f=Math.max(.4,1-(t.comboHits-1)*.07)),(n.kind==="super"||l==="super")&&(f=Math.max(f,.5)),u=Math.max(1,Math.round(u*f*t.incomingMul(a))),t.hasArmor())return t.consumeArmor(),t.takeDamage(u,this),t.comboHits=Math.max(0,t.comboHits-1),t.flash=8,this.hitstop=Math.max(this.hitstop,8),this.emit({t:"hit",x:n.x,y:n.y,spark:"heavy",blocked:!1,counter:!1,attacker:e.index,defender:t.index,damage:u,color:16755251}),this.emit({t:"sfx",name:"armor"}),"armor";if(t.throwExec){const b=t.throwExec.target;t.throwExec=null,b.grabbedBy=null,b.enterJuggle(.1,-b.facing*.05)}t.comboDamage+=u;const g=t.takeDamage(u,this),S=i.effect;if(S?.drain){const b=Math.min(t.meter,S.drain);t.meter-=b,e.gainMeter(b)}if(e.passive==="drainer"){const b=Math.min(t.meter,4);t.meter-=b}S?.lifesteal&&e.heal(S.lifesteal),e.passive==="vampire"&&e.heal(u*.12),S?.slow&&t.addBuff("slow",.6,S.slow,6719743,this);const p=!t.grounded||t.state==="juggle"||t.state==="air"||t.state==="fall",m=!!i.launch&&(n.kind!=="normal"||p),M=Math.sqrt(t.stats.weight);if(g)t.enterJuggle(.2,c*.08);else if(t.health<=0)t.enterJuggle(Math.max(.2,i.launch??0),c*.08);else if(m)t.enterJuggle((i.launch??.2)/M,c*(i.launchVx??.05));else if(p)t.enterJuggle(.13,c*.05);else if(i.knockdown)t.enterJuggle(.12,c*.045);else if(S?.stun)t.enterDizzy(S.stun),t.slideVx=c*i.pushback;else{const b=n.y>1;t.enterHitstun(i.hitstun+(d?4:0),b,h),t.slideVx=c*i.pushback/M,!a&&this.atWall(t)&&(e.slideVx=-c*i.pushback*.9)}e.gainMeter((i.meterGain??5)+u*.03),t.gainMeter(u*.05),this.hitstop=Math.max(this.hitstop,mu(i,n.kind,a)+(d?3:0)),t.flash=5;const T=i.spark??"light";this.emit({t:"hit",x:n.x,y:n.y,spark:T,blocked:!1,counter:d,attacker:e.index,defender:t.index,damage:u,color:r?.color}),d&&(this.emit({t:"counterHit",fighter:e.index}),this.emit({t:"announce",text:"COUNTER",frames:30}));const _=T==="super"?1:h?.7:.35;return this.emit({t:"rumble",fighter:t.index,strong:_,weak:_*.6,ms:h?200:110}),this.emit({t:"rumble",fighter:e.index,strong:_*.3,weak:_*.5,ms:80}),(h||d)&&this.emit({t:"shake",amount:T==="super"?.22:d?.14:.08}),"hit"}updateProjectiles(){const e=this.projectiles;for(const t of e)t.update(t.owner.opponent);for(let t=0;t<e.length;t++){const i=e[t];if(!(!i.active||i.kind==="trap"))for(let n=t+1;n<e.length;n++){const r=e[n];if(!r.active||r.kind==="trap"||r.owner===i.owner||!Od(i.box(),r.box()))continue;const a=i.durability;i.durability-=Math.max(1,Math.min(r.durability,3)),r.durability-=Math.max(1,Math.min(a,3)),i.durability<=0&&(i.dead=!0),r.durability<=0&&(r.dead=!0),this.emit({t:"clash",x:(i.x+r.x)/2,y:(i.y+r.y)/2})}}if(this.phase==="fight")for(const t of e){if(!t.active)continue;const i=t.owner.opponent;if(t.kind==="trap"&&!i.grounded||t.age-t.lastHitAge<t.rehit||!Ho(t.box(),i.hurtboxes()))continue;let r=t.hit;t.hitsLeft===1&&(t.kind==="mega"||t.durability>1)&&t.hit.damage>0&&(r={...r,knockdown:!0,launch:r.launch??.18});const a=this.resolveHit(t.owner,i,r,{kind:t.kind==="mega"?"super":"special",projectile:t,x:(t.x+i.x)/2,y:Math.max(.3,Math.min(t.y,i.y+1.6))});a==="miss"||a==="reflect"||(t.hitsLeft--,t.lastHitAge=t.age,t.onHit?.(i,a==="block"),(t.hitsLeft<=0||a==="absorb")&&(t.dead=!0))}e.some(t=>t.dead)&&(this.projectiles=e.filter(t=>!t.dead))}}const $_={1:"↙",2:"↓",3:"↘",4:"←",5:"•",6:"→",7:"↖",8:"↑",9:"↗"};class K_{constructor(e,t,i){this.app=e,this.root=Ge("div","hud");const n=Ge("div","top");t.fighters.forEach((a,o)=>{const c=o===0?"l":"r",l=An[a.def.party],h=Ge("div",`hp-wrap ${c}`);h.innerHTML=`${$i(a.def,"hp-port")}
        <div class="hp-col">
          <div class="hp ${c}"><i class="rec"></i><i class="trail"></i><i class="fill"></i></div>
          <div class="hp-name"><span class="n">${Le(a.def.nick??a.def.name.split(" ").slice(-1)[0])}</span><span class="he">${Le(a.def.nameHe)}</span><span class="chip" style="background:${fr(l.color)}">${Le(l.name)}</span></div>
          <div class="pips"></div>
        </div>`,this.hp[o]=h.querySelector(".fill"),this.trail[o]=h.querySelector(".trail"),this.rec[o]=h.querySelector(".rec"),this.pips[o]=h.querySelector(".pips"),o===0||(this.timer=Ge("div","timer","99"),n.appendChild(this.timer)),n.appendChild(h)}),this.timer=n.querySelector(".timer"),this.root.appendChild(n);const r=Ge("div","bottom");t.fighters.forEach((a,o)=>{const l=Ge("div",`meter-wrap ${o===0?"l":"r"}`);l.innerHTML='<div class="buffs"></div><div class="meter-label">ULTIMATE</div><div class="meter"><i></i></div>',this.meter[o]=l.querySelector(".meter i"),this.meterBar[o]=l.querySelector(".meter"),this.meterLabel[o]=l.querySelector(".meter-label"),this.buffs[o]=l.querySelector(".buffs"),r.appendChild(l)}),this.root.appendChild(r);for(let a=0;a<2;a++){const o=a===0?"l":"r";this.combo[a]=Ge("div",`combo ${o}`,'<div class="n">0</div><div class="t">HITS</div><div class="d"></div>'),this.special[a]=Ge("div",`special-name ${o}`),this.quote[a]=Ge("div",`quote-bubble ${o}`),this.root.append(this.combo[a],this.special[a],this.quote[a])}this.dim=Ge("div","super-dim"),this.banner=Ge("div","super-banner",'<div class="strip"></div><div class="txt"><div class="who"></div><div class="mv"></div></div>'),this.announceEl=Ge("div","announce"),this.flash=Ge("div","flash"),this.root.prepend(this.dim),this.root.append(this.banner,this.announceEl,this.flash),i.training&&(this.training=Ge("div","training-panel panel"),this.root.appendChild(this.training)),(i.inputDisplay||i.training)&&(this.inputDisp=Ge("div","input-disp"),this.root.appendChild(this.inputDisp)),this.renderPips(t)}app;root;hp=[];trail=[];rec=[];meter=[];meterBar=[];meterLabel=[];buffs=[];pips=[];timer;announceEl;announceLeft=0;combo=[];comboHold=[0,0];comboBest=[{hits:0,dmg:0},{hits:0,dmg:0}];special=[];specialLeft=[0,0];banner;bannerLeft=0;dim;flash;quote=[];training=null;inputDisp=null;inputLog=[];lastInput="";lastCombo={hits:0,dmg:0};lastHpText=["",""];lastTicks=-1;renderPips(e){e.fighters.forEach((t,i)=>{let n="";for(let r=0;r<e.config.roundsToWin;r++)n+=`<div class="pip ${r<t.roundsWon?"on":""}"></div>`;this.pips[i].innerHTML=e.training?"":n})}showQuote(e,t,i){this.quote[e].textContent=`“${t}”`,this.quote[e].classList.toggle("show",i)}announce(e,t,i){this.announceEl.className="announce",this.announceEl.offsetWidth,this.announceEl.textContent=e,this.announceEl.className=`announce show ${t?"big":"small"}`,this.announceLeft=i}event(e,t){switch(e.t){case"announce":this.announce(e.text,!!e.big,e.frames??50);break;case"special":this.special[e.fighter].textContent=e.name+"!",this.special[e.fighter].style.color=Hl(e.color),this.special[e.fighter].classList.add("show"),this.specialLeft[e.fighter]=70;break;case"superFlash":{const i=t.fighters[e.fighter];this.banner.querySelector(".who").textContent=`${i.def.name.toUpperCase()} · ULTIMATE`;const n=this.banner.querySelector(".mv");n.textContent=e.name,n.style.color=Hl(e.color),this.banner.querySelector(".txt").style.textAlign=e.fighter===0?"left":"right",this.banner.classList.add("show"),this.dim.classList.add("show"),this.bannerLeft=52,this.doFlash();break}case"lifeline":this.announce(`${e.name}!`,!1,70),this.doFlash();break;case"ko":this.doFlash();break;case"round":this.renderPips(t);break}}doFlash(){this.flash.classList.remove("go"),this.flash.offsetWidth,this.flash.classList.add("go")}update(e,t){const i=this.lastTicks<0?1:Math.max(0,e.ticks-this.lastTicks);this.lastTicks=e.ticks;for(let n=0;n<i;n++)this.countdown();e.fighters.forEach((n,r)=>{const a=Math.max(0,n.health/n.stats.maxHealth*100),o=`${a.toFixed(2)}%`;this.lastHpText[r]!==o&&(this.hp[r].style.width=o,this.trail[r].style.width=o,this.lastHpText[r]=o),this.hp[r].classList.toggle("low",a<25),this.rec[r].style.width=`${Math.min(100,a+n.recoverable/n.stats.maxHealth*100).toFixed(2)}%`;const c=n.meter/ir*100;this.meter[r].style.width=`${c}%`;const l=n.meter>=ir;this.meterBar[r].classList.toggle("full",l),this.meterLabel[r].classList.toggle("full",l),this.meterLabel[r].innerHTML=l?`ULTIMATE READY ${this.app.glyph("UL",r)}`:`ULTIMATE ${Math.floor(c)}%`;const h=n.buffs.map(u=>u.kind.toUpperCase()).join(" · "),d=n.passive==="lifeline"&&!n.lifelineUsed?"♥ "+n.def.passive.name:"";this.buffs[r].textContent=[h,d].filter(Boolean).join("  ")});for(let n=0;n<2;n++){const r=e.fighters[n],a=1-n;r.comboHits>=2&&(this.comboBest[a]={hits:r.comboHits,dmg:r.comboDamage},this.combo[a].innerHTML=`<div class="n">${r.comboHits}</div><div class="t">HITS</div><div class="d">${r.comboDamage} DMG</div>`,this.combo[a].classList.add("show"),this.comboHold[a]=70,a===0&&(this.lastCombo={hits:r.comboHits,dmg:r.comboDamage})),r.comboHits===1&&a===0&&(this.lastCombo={hits:1,dmg:r.comboDamage})}if(e.training||e.config.roundTime===0)this.timer.textContent="∞";else{const n=Math.max(0,Math.ceil(e.timer/60));this.timer.textContent=String(n),this.timer.classList.toggle("low",n<=10)}if(e.phase==="roundStart"&&e.phaseFrame===2&&this.renderPips(e),e.phase==="matchEnd"&&e.phaseFrame===1&&this.renderPips(e),this.training){const n=e.fighters[1],r=e.config.training?.dummy??"stand";this.training.innerHTML=`<b>TRAINING</b><br>Last combo: ${this.lastCombo.hits} hits · ${this.lastCombo.dmg} dmg<br>
        Dummy: ${r.toUpperCase()}<br>Dummy HP: ${Math.round(n.health)} / ${n.stats.maxHealth}<br>
        ${this.app.glyph("SELECT",0)} reset positions · ${this.app.glyph("START",0)} menu`}if(this.inputDisp&&t){const n=t[0],r=[],a=[[fe.LP,"LP"],[fe.HP,"HP"],[fe.LK,"LK"],[fe.HK,"HK"],[fe.SP,"SP"],[fe.UL,"UL"],[fe.TH,"TH"],[fe.SS,"SS"]];for(const[c,l]of a)n.pressed&c&&r.push(l);const o=`${n.dir}|${r.join("+")}`;o!==this.lastInput&&(n.dir!==5||r.length)&&(this.inputLog.unshift(`<span class="arrow">${$_[n.dir]}</span> ${r.join("+")}`),this.inputLog.length=Math.min(this.inputLog.length,14)),this.lastInput=o,this.inputDisp.innerHTML=this.inputLog.join("<br>")}}countdown(){for(let e=0;e<2;e++)this.specialLeft[e]>0&&--this.specialLeft[e]===0&&this.special[e].classList.remove("show"),this.comboHold[e]>0&&--this.comboHold[e]===0&&this.combo[e].classList.remove("show");this.bannerLeft>0&&--this.bannerLeft===0&&(this.banner.classList.remove("show"),this.dim.classList.remove("show")),this.announceLeft>0&&--this.announceLeft===0&&this.announceEl.classList.add("hide")}destroy(){this.root.remove()}}const Y_=[{motion:fa.qcf,btn:"P",dir:""},{motion:fa.qcb,btn:"K",dir:"→ +"},{motion:fa.dp,btn:"P",dir:"↓ +"}];function gu(s,e,t,i){return e==="P"?`${s.glyph("LP",t,i)}/${s.glyph("HP",t,i)}`:`${s.glyph("LK",t,i)}/${s.glyph("HK",t,i)}`}function Bd(s,e,t=0){const i=s.glyphStyle(t)==="kb"&&s.menuStyle()!=="kb"?s.menuStyle():s.glyphStyle(t),n=o=>s.glyph(o,t,i),r=[];r.push('<tr class="hdr"><td colspan="3">SPECIAL MOVES</td></tr>'),e.specials.forEach((o,c)=>{const l=Y_[c];r.push(`<tr><td class="mv" style="color:${Hl(o.color)}">${Le(o.name)}</td>
      <td class="in"><span class="arrow">${l.motion}</span> + ${gu(s,l.btn,t,i)}<br><span style="color:var(--muted)">or</span> ${l.dir} ${n("SP")}</td>
      <td class="ds">${Le(kd(o))}${o.type==="dive"?" Works in the air.":""}</td></tr>`)}),r.push('<tr class="hdr"><td colspan="3">ULTIMATE (FULL METER)</td></tr>'),r.push(`<tr><td class="mv" style="color:var(--gold)">${Le(e.ultimate.name)}</td>
    <td class="in"><span class="arrow">${fa.dqcf}</span> + ${gu(s,"P",t,i)}<br><span style="color:var(--muted)">or</span> ${n("UL")}</td>
    <td class="ds">${Le(Ud(e.ultimate))}</td></tr>`),r.push('<tr class="hdr"><td colspan="3">PASSIVE ABILITY</td></tr>'),r.push(`<tr><td class="mv">${Le(e.passive.name)}</td><td class="in">Always on</td><td class="ds">${Le(e.passive.desc)}</td></tr>`),r.push('<tr class="hdr"><td colspan="3">UNIVERSAL</td></tr>');const a=[["Throw",`${n("TH")} <span style="color:var(--muted)">or</span> ${n("LP")}+${n("LK")}`,"Close range. Hold ← to throw backwards. Tech by pressing throw as you are grabbed."],["Sidestep",n("SS"),"Tekken-style step into the background (hold ↓ to step toward the camera). Dodges projectiles and most strikes."],["Overhead Chop",`→ + ${n("HP")}`,"Slow, but must be blocked standing."],["Anti-air Uppercut",`↓ + ${n("HP")}`,"Launches airborne opponents."],["Sweep",`↓ + ${n("HK")}`,"Low. Knocks down."],["Dash","→ → / ← ←","Quick burst of movement."],["Block","Hold ← (↙ for lows)","Block high/mid standing, lows crouching. Jump-ins and overheads must be blocked standing."],["Chains & cancels",`${n("LP")} → ${n("HP")} → Special → ${n("UL")}`,"Light attacks chain into heavies. Normals cancel into specials; specials that hit cancel into the Ultimate."]];for(const[o,c,l]of a)r.push(`<tr><td class="mv">${o}</td><td class="in">${c}</td><td class="ds">${l}</td></tr>`);return`<div class="ml-head">${$i(e)}<div><div class="display" style="font-size:40px;line-height:1">${Le(e.name)}</div>
    <div style="font-size:20px"><span class="he">${Le(e.nameHe)}</span></div>${Id(e)}
    <div style="color:var(--muted);margin-top:4px">${Le(e.role)} · ${Le(Dd[e.style])}</div>
    <div style="margin-top:6px;max-width:720px">${Le(e.bio)}</div></div></div>
    <table class="ml-table">${r.join("")}</table>`}class J_{constructor(e,t,i){this.app=e,this.index=t,this.back=i}app;index;back;page;enter(){this.page=Ge("div","page"),this.app.ui.append(this.page,Ge("div","hint",`◀ ▶ Change fighter (${this.index+1}/40) ${this.app.mg("back")} Back`)),this.render()}render(){this.page.innerHTML=Bd(this.app,bt[this.index],0);const e=this.app.ui.querySelector(".hint");e&&(e.innerHTML=`◀ ▶ Change fighter (${this.index+1}/40) ${this.app.mg("back")} Back`)}exit(){}tick(){const e=this.app.input.menu("any");e.back?(this.app.audio.sfx("menuBack"),this.back()):e.left||e.l1?(this.index=(this.index+bt.length-1)%bt.length,this.app.audio.sfx("menuMove"),this.render()):e.right||e.r1?(this.index=(this.index+1)%bt.length,this.app.audio.sfx("menuMove"),this.render()):e.down?this.page.scrollTop+=80:e.up&&(this.page.scrollTop-=80)}frame(e){this.app.renderer.syncShowcase(e,{pos:[2,1.5,6],look:[0,1.1,0]})}}const Z_=[{a:"TH",x:16,y:5,ps:"L2",cls:"g-shoulder"},{a:"SS",x:16,y:15,ps:"L1",cls:"g-shoulder"},{a:"UL",x:84,y:5,ps:"R2",cls:"g-shoulder"},{a:"SP",x:84,y:15,ps:"R1",cls:"g-shoulder"},{a:"MOVE",x:20,y:44,ps:"✚",cls:"g-shoulder"},{a:"HP",x:80,y:30,ps:"△",cls:"g-triangle"},{a:"HK",x:92,y:45,ps:"○",cls:"g-circle"},{a:"LK",x:80,y:60,ps:"✕",cls:"g-cross"},{a:"LP",x:67,y:45,ps:"□",cls:"g-square"},{a:"SELECT",x:34,y:27,ps:"CREATE",cls:"g-shoulder"},{a:"START",x:66,y:27,ps:"OPTIONS",cls:"g-shoulder"}];class j_{constructor(e,t){this.app=e,this.back=t}app;back;menu;status;remap=null;remapOrder=["LP","HP","LK","HK","SP","UL","TH","SS"];enter(){const e=this.app,t=Ge("div","page"),i=Z_.map(r=>`<div class="pad-lbl" style="left:${r.x}%;top:${r.y}%"><span class="g ${r.cls}">${r.ps}</span>${r.a==="MOVE"?"Move":Ba[r.a]}</div>`).join(""),n=r=>`<span class="g g-key">${ms(r.UP[0])}${ms(r.LEFT[0])}${ms(r.DOWN[0])}${ms(r.RIGHT[0])}</span><span>Move</span>`+Vo.map(a=>`<span>${r[a].map(o=>`<span class="g g-key">${ms(o)}</span>`).join(" ")}</span><span>${Ba[a]}</span>`).join("");t.innerHTML=`<h1 class="display">Controls</h1>
      <div class="sub">Plug in a PS5 DualSense (USB or Bluetooth) and press any button. Chrome, Edge and the desktop app read it natively.</div>
      <div class="ctrl-grid">
        <div class="panel"><h3>PS5 DualSense</h3><div class="pad-diagram"><div class="pad-body"></div>${i}<div class="pad-lbl" style="left:36%;top:70%">Left stick: Move</div></div>
          <div class="status"></div></div>
        <div class="panel"><h3>Controller setup</h3><div id="menu-slot"></div></div>
        <div class="panel"><h3>Keyboard · Player 1</h3><div class="kv">${n($s)}</div></div>
        <div class="panel"><h3>Keyboard · Player 2</h3><div class="kv">${n(Ks)}</div></div>
      </div>`,this.status=t.querySelector(".status"),this.menu=new Cs([{label:"Swap P1 / P2 controllers",onSelect:()=>{e.input.swapSlots(),this.refresh()}},{label:"Remap P1 buttons",onSelect:()=>this.startRemap(0)},{label:"Remap P2 buttons",onSelect:()=>this.startRemap(1)},{label:"Reset P1 mapping",onSelect:()=>{const r=e.input.slotPad[0];r!==null&&e.input.resetBinding(r),this.refresh()}},{label:"Reset P2 mapping",onSelect:()=>{const r=e.input.slotPad[1];r!==null&&e.input.resetBinding(r),this.refresh()}},{label:"Test rumble",onSelect:()=>{e.input.rumble(0,1,1,400),e.input.rumble(1,1,1,400)}},{label:"Back",onSelect:()=>this.back()}],e.audio),t.querySelector("#menu-slot").appendChild(this.menu.el),e.ui.append(t,Ge("div","hint",`${e.mg("confirm")} Select ${e.mg("back")} Back`)),e.input.onChange=()=>this.refresh(),this.refresh()}refresh(){const e=this.app.input,t=e.connectedPads(),i=r=>{const a=e.padInfo(r);if(!a)return`<div class="status-line">P${r+1}: <b>keyboard only</b></div>`;const o=e.bindingFor(a.index),c=this.remapOrder.map(l=>`${l}=${o[l]}`).join(" ");return`<div class="status-line">P${r+1}: <b>${Le(a.kind==="dualsense"?"DualSense":a.kind==="dualshock"?"DualShock 4":a.kind==="xbox"?"Xbox controller":"Gamepad")}</b> <span style="color:var(--muted);font-size:12px">#${a.index} · ${Le(c)}</span></div>`};let n=`<div class="status-line">Controllers connected: <b>${t.length}</b></div>${i(0)}${i(1)}`;if(t.some(r=>!r.standard)&&(n+='<div class="status-line" style="color:#ffb3aa">A controller is in raw mode (non-Chrome browser). If buttons feel wrong, use Remap or play in Chrome / Edge / the desktop app.</div>'),this.remap){const r=this.remapOrder[this.remap.step];n+=`<div class="status-line" style="font-size:20px;margin-top:10px">Press the button for <b>${Ba[r]}</b> on P${this.remap.slot+1}'s controller… <span style="color:var(--muted);font-size:13px">(Esc to cancel)</span></div>`}this.status.innerHTML=n}startRemap(e){const t=this.app.input.slotPad[e];if(t===null){this.status.insertAdjacentHTML("beforeend",`<div class="status-line" style="color:#ffb3aa">No controller assigned to P${e+1}.</div>`);return}this.remap={slot:e,step:0,binding:{...this.app.input.bindingFor(t)}},this.refresh(),this.captureNext()}captureNext(){this.app.input.captureNextButton((e,t)=>{const i=this.remap;if(i){if(e!==this.app.input.slotPad[i.slot]){this.captureNext();return}i.binding[this.remapOrder[i.step]]=t,i.step++,this.app.audio.sfx("menuConfirm"),i.step>=this.remapOrder.length?(this.app.input.setBinding(e,i.binding),this.remap=null,this.suppress=20):this.captureNext(),this.refresh()}})}suppress=0;exit(){this.app.input.captureNextButton(null),this.app.input.onChange=null}tick(){if(this.remap){this.app.input.keyPressed("Escape")&&(this.remap=null,this.app.input.captureNextButton(null),this.refresh());return}if(this.suppress>0){this.suppress--;return}const e=this.app.input.menu("any");if(e.back){this.app.audio.sfx("menuBack"),this.back();return}this.menu.handle(e)}frame(e){this.app.renderer.syncShowcase(e,{pos:[2,1.5,6],look:[0,1.1,0]})}}class Q_{constructor(e,t,i){this.app=e,this.setup=t,this.winner=i}app;setup;winner;menu;t=0;enter(){const e=this.app,{p1:t,p2:i}=this.setup,n=this.winner===0?t:this.winner===1?i:null;n&&e.renderer.setShowcase([{def:n,x:0,facing:1,pose:"victory",variant:0}],!1),this.menu=new Cs([{label:"Rematch",onSelect:()=>e.go(new vc(e,this.setup))},{label:"Change Stage",onSelect:()=>e.go(new Hd(e,this.setup.mode,t,i))},{label:"Character Select",onSelect:()=>e.go(new Na(e,this.setup.mode))},{label:"Main Menu",onSelect:()=>e.go(new oi(e))}],e.audio);const r=Ge("div","results"),a=Ge("div","col");a.innerHTML=n?`${$i(n)}<div class="winner display">${Le(n.name)} wins</div><div class="he" style="font-size:24px">${Le(n.nameHe)}</div><div class="quote">“${Le(n.quotes.win)}”</div>`:'<div class="winner display">Draw game</div><div class="quote">A hung parliament. Again.</div>',a.appendChild(this.menu.el),r.appendChild(a),e.ui.append(r,Ge("div","hint",`${e.mg("confirm")} Select`))}exit(){}tick(){this.menu.handle(this.app.input.menu("any"))}frame(e){this.t+=e,this.app.renderer.syncShowcase(e,{pos:[1.6+Math.sin(this.t*.3)*.5,1.4,4.2],look:[-.6,1.2,0]})}}class gc{constructor(e){this.app=e}app;left=170;enter(){const e=this.app,t=e.arcade,i=t.ladder[t.index];e.renderer.setStage(t.stages[t.index]),e.renderer.clearFighters(),e.renderer.setShowcase([{def:i,x:0,facing:-1,pose:"intro"}],!1);const n=t.ladder.map((a,o)=>`<div class="rung ${o<t.index?"done":""} ${o===t.index?"cur":""} ${a.boss?"boss":""}">${$i(a)}${Le(a.name.split(" ").slice(-1)[0])}</div>`).join(""),r=Ge("div","results");r.innerHTML=`<div class="col">
      <div class="display" style="font-size:28px;color:var(--muted)">Arcade · Stage ${t.index+1} / ${t.ladder.length}</div>
      <div class="winner display">${i.boss?"Final boss":"Next opponent"}</div>
      <div class="display" style="font-size:44px;color:var(--gold)">${Le(i.name)}</div>
      <div class="he" style="font-size:22px">${Le(i.nameHe)}</div>
      <div style="color:var(--muted)">${Le(i.role)}</div>
      <div class="ladder">${n}</div>
    </div>`,e.ui.append(r,Ge("div","hint",`${e.mg("confirm")} Fight ${e.mg("back")} Quit`)),e.audio.say(i.boss?`Final boss. ${i.name}`:`Next: ${i.name}`)}start(){const e=this.app,t=e.arcade,i={mode:"arcade",p1:t.player,p2:t.ladder[t.index],stage:t.stages[t.index],cpu:[!1,!0]};e.lastSetup=i,e.go(new vc(e,i,()=>e.go(new vr(e,i))))}exit(){}tick(){const e=this.app.input.menu("any");if(e.back){this.app.go(new oi(this.app));return}(--this.left<=0||e.confirm)&&this.start()}frame(e){this.app.renderer.syncShowcase(e,{pos:[-1.8,1.4,4.4],look:[.6,1.2,0]})}}class ey{constructor(e){this.app=e}app;left=600;el;enter(){const e=this.app,t=e.arcade,i=t.ladder[t.index];e.renderer.setShowcase([{def:i,x:0,facing:-1,pose:"victory",variant:2}],!1);const n=Ge("div","results");n.innerHTML=`<div class="col"><div class="winner display">Continue?</div>
      <div class="quote">${Le(i.name)}: “${Le(i.quotes.win)}”</div>
      <div class="display" style="font-size:120px;color:var(--gold)" id="cd">10</div>
      <div>${e.mg("confirm")} Continue &nbsp; ${e.mg("back")} Give up</div></div>`,e.ui.appendChild(n),this.el=n.querySelector("#cd")}exit(){}tick(){const e=this.app,t=e.input.menu("any");this.left--,this.el.textContent=String(Math.ceil(this.left/60)),t.confirm?(e.arcade.continues++,e.go(new gc(e))):t.back||this.left<=0?e.go(new oi(e)):(t.extra||t.extra2)&&(this.left=Math.max(1,this.left-60))}frame(e){this.app.renderer.syncShowcase(e,{pos:[-1.8,1.4,4.4],look:[.6,1.2,0]})}}class ty{constructor(e){this.app=e}app;t=0;enter(){const e=this.app,t=e.arcade,i=t.player;e.renderer.setShowcase([{def:i,x:0,facing:1,pose:"victory",variant:0}],!1),e.audio.say(`Congratulations, Prime Minister ${i.name}!`);const n=Ge("div","ending");n.innerHTML=`<h1 class="display">Coalition formed!</h1>
      <p>Against all odds, <b>${Le(i.name)}</b> has survived the plenum, outlasted ${t.ladder.length} rivals and assembled a 61-seat majority${t.continues?` (after ${t.continues} emergency election${t.continues>1?"s":""})`:""}.<br>
      The President has asked ${Le(i.name.split(" ")[0])} to form the next government. It will last at least… until the next arcade run.</p>
      <div class="defeated">${t.ladder.map(r=>$i(r)).join("")}</div>
      <p style="color:var(--muted);font-size:14px">Street Knesset Fighter · a parody. Thanks for playing!</p>
      <div>${e.mg("confirm")} Main Menu</div>`,e.ui.appendChild(n)}exit(){}tick(){const e=this.app.input.menu("any");this.t>1.5&&(e.confirm||e.start)&&(this.app.arcade=null,xc(this.app,!0),this.app.go(new oi(this.app)))}frame(e){this.t+=e;const t=this.t*.25;this.app.renderer.syncShowcase(e,{pos:[Math.sin(t)*4,1.5,Math.cos(t)*4],look:[0,1.2,0]})}}const iy=["zero","one","two","three","four","five","six","seven","eight","nine"],Nn=["stand","crouch","jump","block","cpu"];class vr{constructor(e,t){this.app=e,this.setup=t}app;setup;match;hud;cpu=[null,null];dummyCpu=null;paused=!1;pauseEl=null;pauseMenu=null;pauseSub="menu";movesSlot=0;endTimer=0;inputs=[di,di];finished=!1;get training(){return this.setup.mode==="training"}enter(){const e=this.app,t=e.settings,{p1:i,p2:n,stage:r}=this.setup;this.match=new q_({p1:i,p2:n,roundsToWin:this.training?1:t.roundsToWin,roundTime:this.training?0:t.roundTime,training:this.training?{infiniteHealth:!0,infiniteMeter:!0,dummy:"stand"}:null}),e.renderer.clearShowcase(),e.renderer.setStage(r),e.renderer.setFighters([i,n]),e.renderer.snapCamera([0,1.8,7.5],[0,1.1,0]);let a=t.difficulty;this.setup.mode==="arcade"&&e.arcade&&(e.arcade.index>=4&&a++,n.boss&&a++),a=Math.max(0,Math.min(4,a)),this.cpu=[this.setup.cpu[0]?new Oo(this.setup.mode==="watch"?t.difficulty:a,101):null,this.setup.cpu[1]?new Oo(a,202):null],this.dummyCpu=new Oo(t.difficulty,303),this.hud=new K_(e,this.match,{training:this.training,inputDisplay:t.inputDisplay}),e.ui.appendChild(this.hud.root),e.audio.playMusic(r.music,r.id.length+i.id.length)}exit(){this.hud?.destroy()}humanSlots(){const e=[];return this.setup.cpu[0]||e.push(0),!this.setup.cpu[1]&&!this.training&&e.push(1),e}openPause(){this.paused=!0,this.match.paused=!0,this.pauseSub="menu",this.app.audio.sfx("menuConfirm"),this.buildPause()}closePause(){this.paused=!1,this.match.paused=!1,this.pauseEl?.remove(),this.pauseEl=null,this.pauseMenu=null}buildPause(){const e=this.app;this.pauseEl?.remove();const t=Ge("div","pause"),i=Ge("div","box panel");if(t.appendChild(i),this.pauseSub==="moves"){const n=this.match.fighters[this.movesSlot];i.style.maxHeight="86vh",i.style.overflow="auto",i.style.width="min(1000px, 92vw)",i.innerHTML=Bd(e,n.def,this.movesSlot)+`<div class="hint" style="position:static;margin-top:14px">◀ ▶ Switch fighter ${e.mg("back")} Back</div>`,this.pauseMenu=null}else{i.innerHTML='<h2 class="display">Paused</h2>';const n=this.match.config.training,r=[{label:"Resume",onSelect:()=>this.closePause()},{label:"Move List",onSelect:()=>{this.pauseSub="moves",this.movesSlot=0,this.buildPause()}}];n&&r.push({label:"Dummy",value:()=>n.dummy.toUpperCase(),onLeft:()=>{n.dummy=Nn[(Nn.indexOf(n.dummy)+Nn.length-1)%Nn.length]},onRight:()=>{n.dummy=Nn[(Nn.indexOf(n.dummy)+1)%Nn.length]}},{label:"Infinite Meter",value:()=>n.infiniteMeter?"On":"Off",onLeft:()=>{n.infiniteMeter=!n.infiniteMeter},onRight:()=>{n.infiniteMeter=!n.infiniteMeter}},{label:"Show Hitboxes",value:()=>e.renderer.showHitboxes?"On":"Off",onLeft:()=>{e.renderer.showHitboxes=!e.renderer.showHitboxes},onRight:()=>{e.renderer.showHitboxes=!e.renderer.showHitboxes}},{label:"Reset Positions",onSelect:()=>{this.match.resetPositions(),this.closePause()}}),r.push({label:"Restart Match",onSelect:()=>e.go(new vr(e,this.setup))},{label:"Character Select",onSelect:()=>e.go(new Na(e,this.setup.mode))},{label:"Main Menu",onSelect:()=>e.go(new oi(e))}),this.pauseMenu=new Cs(r,e.audio),i.appendChild(this.pauseMenu.el)}this.pauseEl=t,e.ui.appendChild(t)}tickPause(){const e=this.app.input.menu("any");if(this.pauseSub==="moves"){e.back||e.start?(this.pauseSub="menu",this.app.audio.sfx("menuBack"),this.buildPause()):(e.left||e.right||e.l1||e.r1)&&(this.movesSlot=this.movesSlot===0?1:0,this.app.audio.sfx("menuMove"),this.buildPause());return}if(e.back||e.start){this.closePause();return}this.pauseMenu?.handle(e)}tick(){if(this.paused){this.tickPause();return}const e=this.match,t=this.app,i=this.humanSlots(),n=[di,di];for(const a of[0,1])this.cpu[a]?n[a]=this.cpu[a].next(e.fighters[a],e):this.training&&a===1?n[1]=E_(e.config.training.dummy,e.fighters[1],e,this.dummyCpu):n[a]=t.input.player(a);const r=i.length?i:[0,1];for(const a of r)if((this.cpu[a]?t.input.player(a):n[a]).pressed&fe.START&&e.phase!=="matchEnd"){this.openPause();return}this.training&&n[0].pressed&fe.SELECT&&e.resetPositions(),e.phase==="intro"?(t.input.menu("any").confirm&&e.skipIntro(),this.hud.showQuote(0,e.fighters[0].def.quotes.intro,e.phaseFrame>10&&e.phaseFrame<100),this.hud.showQuote(1,e.fighters[1].def.quotes.intro,e.phaseFrame>=100&&e.phaseFrame<195)):(this.hud.showQuote(0,"",!1),this.hud.showQuote(1,"",!1)),this.inputs=n,e.tick(n);for(const a of e.drainEvents())this.onEvent(a);if(e.phase==="matchEnd"){this.endTimer++;const a=e.matchWinner;this.endTimer===60&&a!==null&&a>=0&&this.hud.showQuote(a,e.fighters[a].def.quotes.win,!0);const o=this.endTimer>90&&t.input.menu("any").confirm;(this.endTimer>=260||o)&&!this.finished&&(this.finished=!0,this.finish(a))}}onEvent(e){const t=this.app,i=this.match;t.renderer.handleEvent(e,i),this.hud.event(e,i);const n=t.audio;switch(e.t){case"hit":e.blocked?n.sfx(e.counter?"counter":"block"):n.sfx(e.spark==="super"?"hitSuper":e.spark==="light"?"hitLight":"hitHeavy",.9+Math.random()*.2);break;case"whiff":n.sfx(e.heavy?"whooshHeavy":"whoosh",.9+Math.random()*.2);break;case"special":n.sfx("special",.8+e.color%7/14);break;case"projectile":n.sfx("projectile",.9+Math.random()*.2);break;case"superFlash":n.sfx("superFlash");break;case"ko":n.sfx("ko"),n.say(e.perfect?"K.O. Perfect!":"K.O.");break;case"announce":{const r=e.text;if(r.startsWith("ROUND"))n.say(`Round ${iy[i.round]??i.round}`);else if(r==="FINAL ROUND")n.say("Final round");else if(r==="FIGHT!")n.say("Fight!");else if(r==="TIME")n.say("Time!");else if(r.endsWith("WINS")){const a=i.matchWinner!==null&&i.matchWinner>=0?i.fighters[i.matchWinner].def.name:"";n.say(`${a} wins!`)}else r==="DRAW GAME"&&n.say("Draw game");(r==="FIGHT!"||r.startsWith("ROUND")||r==="FINAL ROUND")&&n.sfx("round");break}case"jump":n.sfx("jump");break;case"land":n.sfx(e.hard?"landHard":"land");break;case"tech":n.sfx("tech");break;case"buff":n.sfx("buff");break;case"teleport":n.sfx("teleport");break;case"lifeline":n.sfx("lifeline"),n.say(e.name);break;case"clash":n.sfx("clash");break;case"counterHit":n.sfx("counter");break;case"sfx":n.sfx(e.name==="cinematic"?"superFlash":e.name);break;case"rumble":this.setup.cpu[e.fighter]||t.input.rumble(e.fighter,e.strong,e.weak,e.ms);break}}finish(e){const t=this.app;if(this.setup.mode==="arcade"&&t.arcade){const i=t.arcade;e===0?(i.index++,i.index>=i.ladder.length?t.go(new ty(t)):t.go(new gc(t))):t.go(new ey(t));return}t.go(new Q_(t,this.setup,e??-1))}frame(e){this.app.renderer.syncFight(this.match,this.paused?0:e),this.hud.update(this.match,this.inputs)}}const ps=10;function vu(s){const e=Fd(s);return[["Power",(e.dmgMul-.85)/.4],["Speed",(e.walk/.052-.75)/.6],["Health",(e.maxHealth/1e3-.85)/.4],["Defense",(1/e.defMul-.8)/.45]].map(([i,n])=>`<span>${i}</span><div class="bar"><i style="width:${Math.round(Math.max(.08,Math.min(1,n))*100)}%"></i></div>`).join("")}function ny(s,e,t,i){const n=`<div class="stats">${i?vu(s).replace(/<span>(\w+)<\/span>(<div class="bar">.*?<\/div>)/g,"$2<span>$1</span>"):vu(s)}</div>`;return`<div class="who">${Le(e)}</div>
    <div class="name display">${Le(s.name)}${s.nick?` <span style="color:var(--gold)">“${Le(s.nick)}”</span>`:""}</div>
    <div class="he">${Le(s.nameHe)}</div>
    ${Id(s)}
    <div class="role">${Le(s.role)} · ${Le(Dd[s.style])}</div>
    <div class="passive"><b>${Le(s.passive.name)}:</b> ${Le(s.passive.desc)}</div>
    ${n}
    ${t?'<div class="locked">✔ LOCKED IN</div>':""}`}class Na{constructor(e,t){this.app=e,this.mode=t}app;mode;cursor=[0,9];locked=[!1,!1];pickingSlot=0;cells=[];info=[];shown=["",""];t=0;leaveIn=-1;get dual(){return this.mode==="versus"}get needsP2(){return this.mode!=="arcade"}enter(){const e=this.app;e.renderer.clearFighters(),e.renderer.clearStage(),e.renderer.setShowcase([],!1),e.renderer.snapCamera([0,1.35,8.8],[0,1.1,0]);const t=e.lastSetup;t&&(this.cursor[0]=Math.max(0,bt.findIndex(o=>o.id===t.p1.id)),this.needsP2&&(this.cursor[1]=Math.max(0,bt.findIndex(o=>o.id===t.p2.id))));const i={arcade:"Arcade · Choose your candidate",versus:"Versus · Choose your candidates",training:"Training · Choose your fighter",watch:"CPU vs CPU · Choose both fighters"}[this.mode],n=Ge("div","screen");n.innerHTML=`<div class="cs-title display">${Le(i)}</div>`;const r=Ge("div","cs-grid");this.cells=bt.map((o,c)=>{const l=Ge("div","cs-cell");return l.innerHTML=`${$i(o)}<div class="nm">${Le(o.name.split(" ").slice(-1)[0])}</div>`,l.addEventListener("mouseenter",()=>{const h=this.dual?0:this.pickingSlot;this.locked[h]||(this.cursor[h]=c,this.refresh())}),l.addEventListener("click",()=>{const h=this.dual?0:this.pickingSlot;this.cursor[h]=c,this.lock(h)}),r.appendChild(l),l}),n.appendChild(r),this.info[0]=Ge("div","cs-info left panel"),this.info[1]=Ge("div","cs-info right panel"),n.append(this.info[0]),this.needsP2&&n.append(this.info[1]);const a=Ge("div","hint",`${e.mg("confirm")} Select ${e.mg("back")} Back ${e.mg("extra")} Random`);n.appendChild(a),e.ui.appendChild(n),this.refresh()}exit(){}slotLabel(e){return this.mode==="watch"?e===0?"CPU 1":"CPU 2":this.mode==="training"?e===0?"PLAYER 1":"DUMMY":this.mode==="arcade"||e===0?"PLAYER 1":"PLAYER 2"}refresh(){this.cells.forEach((e,t)=>{const i=this.cursor[0]===t,n=this.needsP2&&this.cursor[1]===t&&(this.dual||this.pickingSlot===1||this.locked[1]);e.classList.toggle("p1",i),e.classList.toggle("p2",n),e.querySelectorAll(".tag").forEach(r=>r.remove()),i&&e.insertAdjacentHTML("beforeend",`<div class="tag t1">${this.mode==="watch"?"C1":"1P"}</div>`),n&&e.insertAdjacentHTML("beforeend",`<div class="tag t2">${this.mode==="training"?"DUM":this.mode==="watch"?"C2":"2P"}</div>`)});for(const e of[0,1]){if(e===1&&!this.needsP2)continue;const t=e===0||this.dual||this.pickingSlot===1||this.locked[1];this.info[e].style.visibility=t?"visible":"hidden";const i=bt[this.cursor[e]];this.info[e].innerHTML=ny(i,this.slotLabel(e),this.locked[e],e===1);const n=`${i.id}:${this.locked[e]}:${t}`;this.shown[e]!==n&&(this.shown[e]=n,this.app.renderer.updateShowcaseSlot(e,t?{def:i,x:e===0?-3.7:3.7,facing:e===0?1:-1,pose:this.locked[e]?"victory":"guard",variant:e}:null))}}lock(e){this.locked[e]||(this.locked[e]=!0,this.app.audio.sfx("select"),!this.dual&&e===0&&this.needsP2&&(this.pickingSlot=1,this.cursor[1]===this.cursor[0]&&(this.cursor[1]=(this.cursor[0]+1)%bt.length)),this.refresh(),this.locked[0]&&(!this.needsP2||this.locked[1])&&(this.leaveIn=40))}move(e,t,i){const n=bt.length,r=Math.ceil(n/ps);let a=this.cursor[e]%ps,o=Math.floor(this.cursor[e]/ps);a=(a+t+ps)%ps,o=(o+i+r)%r,this.cursor[e]=Math.min(n-1,o*ps+a),this.app.audio.sfx("menuMove"),this.refresh()}handleSlot(e,t){if(t.back){if(this.locked[e]){this.locked[e]=!1,this.leaveIn=-1,this.app.audio.sfx("menuBack"),this.refresh();return}if(!this.dual&&e===1){this.pickingSlot=0,this.locked[0]=!1,this.app.audio.sfx("menuBack"),this.refresh();return}this.app.audio.sfx("menuBack"),this.app.go(new oi(this.app));return}this.locked[e]||(t.left?this.move(e,-1,0):t.right?this.move(e,1,0):t.up?this.move(e,0,-1):t.down&&this.move(e,0,1),t.extra?(this.cursor[e]=Math.floor(Math.random()*bt.length),this.lock(e)):t.confirm&&this.lock(e))}tick(){if(this.leaveIn>0){--this.leaveIn===0&&this.finish();const e=this.app.input.menu(this.dual?0:"any");if(e.back&&this.handleSlot(this.dual?0:this.pickingSlot,e),this.dual){const t=this.app.input.menu(1);t.back&&this.handleSlot(1,t)}return}this.dual?(this.handleSlot(0,this.app.input.menu(0)),this.handleSlot(1,this.app.input.menu(1))):this.handleSlot(this.pickingSlot,this.app.input.menu("any"))}finish(){const e=this.app,t=bt[this.cursor[0]];if(this.mode==="arcade"){const n=bt.filter(c=>c.id!==t.id).sort(()=>Math.random()-.5),r=t.id==="netanyahu"?bt.find(c=>c.id==="lapid"):bt.find(c=>c.id==="netanyahu"),a=n.filter(c=>c.id!==r.id).slice(0,7);a.push(y_(r));const o=a.map((c,l)=>l===a.length-1?Hi[0]:Hi[Math.floor(Math.random()*Hi.length)]);e.arcade={player:t,ladder:a,stages:o,index:0,continues:0},e.go(new gc(e));return}const i=bt[this.cursor[1]];e.go(new Hd(e,this.mode,t,i))}frame(e){this.t+=e,this.app.renderer.syncShowcase(e,{pos:[0,1.35,8.8],look:[0,1.1,0]})}}class Hd{constructor(e,t,i,n){this.app=e,this.mode=t,this.p1=i,this.p2=n}app;mode;p1;p2;menu;descEl;t=0;current=-1;enter(){const e=this.app,t=[...Hi.map((a,o)=>({label:a.name,onSelect:()=>this.go(Hi[o])})),{label:"Random",onSelect:()=>this.go(Hi[Math.floor(Math.random()*Hi.length)])}];this.menu=new Cs(t,e.audio);const i=Ge("div","screen");i.innerHTML='<div class="cs-title display">Choose the arena</div>';const n=Ge("div","ss-list");n.appendChild(this.menu.el),this.descEl=Ge("div","ss-desc panel"),i.append(n,this.descEl,Ge("div","hint",`${e.mg("confirm")} Select ${e.mg("back")} Back`)),e.ui.appendChild(i);const r=e.lastSetup?.stage;r&&(this.menu.index=Math.max(0,Hi.findIndex(a=>a.id===r.id))),this.menu.render(),e.renderer.setShowcase([{def:this.p1,x:-1.6,facing:1,pose:"guard"},{def:this.p2,x:1.6,facing:-1,pose:"guard",variant:1}],!1),this.preview()}preview(){const e=this.menu.index;if(e===this.current)return;this.current=e;const t=Hi[e];t?(this.app.renderer.setStage(t),this.app.audio.playMusic(t.music,e+1),this.descEl.innerHTML=`<div class="name display">${Le(t.name)}</div><div class="he" style="font-size:22px">${Le(t.nameHe)}</div><div style="color:var(--muted);margin-top:6px">${Le(t.desc)}</div>`):this.descEl.innerHTML='<div class="name display">Random</div><div style="color:var(--muted)">Let the coalition decide.</div>'}go(e){const t={mode:this.mode,p1:this.p1,p2:this.p2,stage:e,cpu:this.mode==="versus"?[!1,!1]:this.mode==="watch"?[!0,!0]:[!1,this.mode!=="training"]};this.app.lastSetup=t,this.app.go(new vc(this.app,t))}exit(){}tick(){const e=this.app.input.menu("any");if(e.back){this.app.audio.sfx("menuBack"),this.app.go(new Na(this.app,this.mode));return}this.menu.handle(e),this.preview()}frame(e){this.t+=e;const t=this.t*.12;this.app.renderer.syncShowcase(e,{pos:[Math.sin(t)*8,2.6,Math.cos(t)*8+1],look:[0,1.2,-1]})}}class vc{constructor(e,t,i){this.app=e,this.setup=t,this.onDone=i}app;setup;onDone;left=200;t=0;enter(){const e=this.app,{p1:t,p2:i,stage:n}=this.setup;e.renderer.setStage(n),e.renderer.setShowcase([{def:t,x:-1.4,facing:1,pose:"intro"},{def:i,x:1.4,facing:-1,pose:"intro"}],!1),e.audio.sfx("superFlash"),e.audio.say(`${t.name}. Versus. ${i.name}.`);const r=fr(An[t.party].color),a=fr(An[i.party].color),o=Ge("div","vs");o.innerHTML=`<div class="band l" style="background:linear-gradient(90deg, ${r}, transparent)"></div>
      <div class="band r" style="background:linear-gradient(270deg, ${a}, transparent)"></div>
      <div class="stagename display">${Le(n.name)} · <span class="he">${Le(n.nameHe)}</span></div>
      <div class="side l">${$i(t,"portrait")}<div class="name display">${Le(t.name)}</div><div class="he" style="font-size:22px">${Le(t.nameHe)}</div><div class="quote">“${Le(t.quotes.intro)}”</div></div>
      <div class="side r">${$i(i,"portrait")}<div class="name display">${Le(i.boss?"BOSS · "+i.name:i.name)}</div><div class="he" style="font-size:22px">${Le(i.nameHe)}</div><div class="quote">“${Le(i.quotes.intro)}”</div></div>
      <div class="big display">VS</div>`,e.ui.appendChild(o)}exit(){}tick(){this.left--;const e=this.app.input.menu("any");(this.left<=0||this.left<170&&(e.confirm||e.start))&&(this.onDone?this.onDone():this.app.go(new vr(this.app,this.setup)))}frame(e){this.t+=e,this.app.renderer.syncShowcase(e,{pos:[Math.sin(this.t*.2)*2,1.4,5.2-this.t*.2],look:[0,1.25,0]})}}const xu=8,vi=440;class zd{constructor(e,t){this.app=e,this.back=t}app;back;index=0;focus="grid";grid;cells=[];panel;canvas;preview;info;fileInput;drag=null;busy=!1;get def(){return bt[this.index]}enter(){const e=this.app,t=Ge("div","page");t.innerHTML=`<h1 class="display">Faces</h1>
      <div class="sub">Photos come from each MK's Wikipedia article (free licences only). Drag to move, scroll to zoom, or upload your own photo.
      ${i_()==="cartoon"?'<br><b style="color:var(--gold)">Faces are set to Cartoon in Options: switch to Photos to see them in game.</b>':""}</div>
      <div class="fe-wrap"><div class="fe-grid"></div><div class="fe-panel panel"></div></div>`,this.grid=t.querySelector(".fe-grid"),this.panel=t.querySelector(".fe-panel"),this.cells=bt.map((i,n)=>{const r=Ge("div","cs-cell");return r.addEventListener("click",()=>{this.index=n,this.focus="edit",this.refreshAll()}),this.grid.appendChild(r),r}),this.panel.innerHTML=`<div class="fe-title display"></div><div class="fe-info"></div>
      <div class="fe-row"><canvas width="${vi}" height="${vi}" class="fe-canvas"></canvas><div class="fe-preview"></div></div>
      <div class="fe-buttons">
        <button data-a="upload">Upload photo…</button><button data-a="auto">Auto crop</button>
        <button data-a="toggle"></button><button data-a="remove">Remove upload</button>
      </div>
      <div class="fe-keys"></div>`,this.canvas=this.panel.querySelector("canvas"),this.preview=this.panel.querySelector(".fe-preview"),this.info=this.panel.querySelector(".fe-info"),this.fileInput=document.createElement("input"),this.fileInput.type="file",this.fileInput.accept="image/*",this.fileInput.style.display="none",this.fileInput.addEventListener("change",()=>{const i=this.fileInput.files?.[0];i&&this.upload(i),this.fileInput.value=""}),t.appendChild(this.fileInput),this.panel.querySelectorAll("button").forEach(i=>i.addEventListener("click",()=>this.action(i.dataset.a))),this.canvas.addEventListener("pointerdown",i=>{const n=vs(this.def.id);n&&(this.drag={x:i.clientX,y:i.clientY,crop:{...n.crop}},this.canvas.setPointerCapture(i.pointerId))}),this.canvas.addEventListener("pointermove",i=>{const n=vs(this.def.id);if(!this.drag||!n)return;const r=this.fit(n.image).k,a=this.canvas.getBoundingClientRect(),o=vi/a.width;No(this.def,{cx:this.drag.crop.cx-(i.clientX-this.drag.x)*o/(r*n.image.width),cy:this.drag.crop.cy-(i.clientY-this.drag.y)*o/(r*n.image.height),h:this.drag.crop.h}),this.refreshEditor()}),this.canvas.addEventListener("pointerup",()=>{this.drag=null,this.refreshCell(this.index)}),this.canvas.addEventListener("wheel",i=>{i.preventDefault(),this.zoom(i.deltaY>0?1.06:1/1.06)},{passive:!1}),t.addEventListener("dragover",i=>i.preventDefault()),t.addEventListener("drop",i=>{i.preventDefault();const n=i.dataTransfer?.files?.[0];n&&n.type.startsWith("image/")&&this.upload(n)}),e.ui.append(t,Ge("div","hint",`${e.mg("confirm")} Edit ${e.mg("back")} Back`)),this.refreshAll()}fit(e){const t=Math.min(vi/e.width,vi/e.height);return{k:t,ox:(vi-e.width*t)/2,oy:(vi-e.height*t)/2}}refreshCell(e){const t=bt[e],i=this.cells[e],n=Uo(t.id);i.innerHTML=`${$i(t)}<div class="nm">${Le(t.name.split(" ").slice(-1)[0])}${n?" · 🎨":""}</div>`,i.classList.toggle("p1",e===this.index)}refreshAll(){this.cells.forEach((e,t)=>this.refreshCell(t)),this.refreshEditor()}refreshEditor(){const e=this.def,t=vs(e.id);this.panel.querySelector(".fe-title").textContent=e.name;const i=Uo(e.id);this.panel.querySelector('[data-a="toggle"]').textContent=i?"Use photo":"Use cartoon",this.panel.querySelector('[data-a="remove"]').style.display=t?.source.kind==="upload"?"":"none",this.panel.classList.toggle("focused",this.focus==="edit");const n=t?.source;this.info.innerHTML=t?n?.kind==="upload"?"Your uploaded photo (stored only in this browser).":`Photo: ${Le(n?.artist??"")} · ${Le(n?.license??"")} · <a href="${Le(n?.descUrl??"#")}" target="_blank" rel="noopener">source</a>${t.detected?"":' · <span style="color:var(--gold)">face not auto-detected: check the crop</span>'}`:"No free-licensed photo found (or you are offline). Upload one to use it in game.";const r=this.canvas.getContext("2d");if(r.fillStyle="#0b1020",r.fillRect(0,0,vi,vi),this.preview.innerHTML="",!t)r.fillStyle="#9aa6c4",r.font="18px Arial",r.textAlign="center",r.fillText("No photo yet: click Upload or drop an image here",vi/2,vi/2);else{const{k:c,ox:l,oy:h}=this.fit(t.image);r.drawImage(t.image,l,h,t.image.width*c,t.image.height*c);const d=wd(t.crop,t.image.width,t.image.height),u=l+(d.x+d.w/2)*c,f=h+(d.y+d.h/2)*c;r.save(),r.beginPath(),r.rect(0,0,vi,vi),r.ellipse(u,f,d.w*c*.465,d.h*c*.465,0,0,Math.PI*2),r.fillStyle="rgba(0,0,0,0.55)",r.fill("evenodd"),r.beginPath(),r.ellipse(u,f,d.w*c*.465,d.h*c*.465,0,0,Math.PI*2),r.lineWidth=3,r.strokeStyle="#ffcc33",r.stroke(),r.restore();const g=t.head.cloneNode();g.getContext("2d").drawImage(t.head,0,0),g.className="fe-head",this.preview.appendChild(g),this.preview.insertAdjacentHTML("beforeend",`<img class="fe-portrait" src="${t.portrait}" alt="">`)}const a=this.app.menuStyle(),o=a==="kb"?'<span class="g g-key">H</span>/<span class="g g-key">L</span>':`${this.app.glyph("TH",0,a)}/${this.app.glyph("UL",0,a)}`;this.panel.querySelector(".fe-keys").innerHTML=this.focus==="edit"?`Arrows / stick: move · ${o} zoom · ${this.app.mg("extra")} photo/cartoon · ${this.app.mg("extra2")} auto crop · ${this.app.mg("back")} done`:`Pick an MK, then ${this.app.mg("confirm")} to edit`}zoom(e){const t=vs(this.def.id);t&&(No(this.def,{...t.crop,h:t.crop.h*e}),this.refreshEditor(),this.refreshCell(this.index))}nudge(e,t){const i=vs(this.def.id);i&&(No(this.def,{cx:i.crop.cx+e*i.crop.h*.05,cy:i.crop.cy+t*i.crop.h*.05,h:i.crop.h}),this.refreshEditor(),this.refreshCell(this.index))}async upload(e){if(this.busy)return;this.busy=!0,this.info.textContent="Processing photo…";const t=await p_(this.def,e);this.busy=!1,t||(this.info.textContent="Could not read that image."),this.refreshAll()}action(e){const t=this.def;this.app.audio.sfx("menuConfirm"),e==="upload"?this.fileInput.click():e==="auto"?f_(t):e==="toggle"?Ad(t.id,!Uo(t.id)):e==="remove"&&m_(t).then(()=>this.refreshAll()),this.refreshAll()}exit(){}tick(){if(this.busy)return;const e=this.app.input.menu("any");if(this.focus==="grid"){if(e.back){this.app.audio.sfx("menuBack"),this.back();return}const t=bt.length;let i=!1;e.left?(this.index=(this.index+t-1)%t,i=!0):e.right?(this.index=(this.index+1)%t,i=!0):e.up?(this.index=(this.index+t-xu)%t,i=!0):e.down&&(this.index=(this.index+xu)%t,i=!0),i&&(this.app.audio.sfx("menuMove"),this.refreshAll()),e.confirm&&(this.focus="edit",this.app.audio.sfx("menuConfirm"),this.refreshEditor());return}if(e.back){this.focus="grid",this.app.audio.sfx("menuBack"),this.refreshAll();return}e.left&&this.nudge(-1,0),e.right&&this.nudge(1,0),e.up&&this.nudge(0,-1),e.down&&this.nudge(0,1),e.l1&&this.zoom(1.06),e.r1&&this.zoom(1/1.06),e.extra&&this.action("toggle"),e.extra2&&this.action("auto")}frame(e){this.app.renderer.syncShowcase(e,{pos:[2,1.5,6],look:[0,1.1,0]})}}class Gd{constructor(e,t){this.app=e,this.back=t}app;back;enter(){const e=a_(),t=e.map(({id:n,source:r})=>{const a=bt.find(o=>o.id===n);return`<tr><td>${$i(a,"cr-img")}</td><td><b>${Le(a.name)}</b></td>
          <td>${Le(r.artist??"")}</td><td>${Le(r.license??"")}${r.licenseUrl?` · <a href="${Le(r.licenseUrl)}" target="_blank" rel="noopener">licence</a>`:""}</td>
          <td><a href="${Le(r.descUrl??"#")}" target="_blank" rel="noopener">${Le(r.file??"file")}</a></td></tr>`}).join(""),i=Ge("div","page");i.innerHTML=`<h1 class="display">Credits</h1>
      <div class="sub">Street Knesset Fighter is a parody. MK photos are loaded live from Wikipedia / Wikimedia Commons under the free licences listed below,
      cropped and used as caricature heads. Photos remain the work of their authors. Photos you upload stay in your browser only.</div>
      ${e.length?`<table class="ml-table cr-table"><tr class="hdr"><td></td><td>MK</td><td>Photographer / author</td><td>Licence</td><td>Source file</td></tr>${t}</table>`:"<p>No photos loaded (offline, blocked, or Faces set to Cartoon).</p>"}
      <p class="sub" style="margin-top:24px">Code: TypeScript + three.js. Face detection: MediaPipe (Apache 2.0). Music, sound and 3D models are generated procedurally.</p>`,this.app.ui.append(i,Ge("div","hint",`${this.app.mg("back")} Back`))}exit(){}tick(){const e=this.app.input.menu("any");(e.back||e.confirm)&&(this.app.audio.sfx("menuBack"),this.back())}frame(e){this.app.renderer.syncShowcase(e,{pos:[2,1.5,6],look:[0,1.1,0]})}}const sy={bpm:108,root:50,mode:"dorian",intensity:.5};function zo(s){return s[Math.floor(Math.random()*s.length)]}class ry{constructor(e){this.app=e}app;bar;msg;done=!1;photosStarted=0;ticks=0;enter(){const e=Ge("div","loading");e.innerHTML=`<div class="logo"><span class="l1">Street</span><span class="l2">Knesset</span><span class="l3">Fighter</span></div>
      <div class="bar"><i style="width:0%"></i></div><div class="boot-msg" style="color:var(--muted);text-align:center">Drafting 40 members of Knesset…</div>`,this.app.ui.appendChild(e),this.bar=e.querySelector(".bar i"),this.msg=e.querySelector(".boot-msg"),A_(bt,(t,i)=>{this.bar.style.width=`${t/i*50}%`}).then(()=>{if(this.app.settings.faces!=="photo"){this.done=!0;return}this.photosStarted=this.ticks,this.msg.textContent="Fetching MK photos from Wikipedia…",Rd(bt,(t,i)=>{this.bar.style.width=`${50+t/i*50}%`,this.msg.innerHTML=`Fetching MK photos from Wikipedia… ${t}/${i}<br><span style="font-size:13px">Press any button to skip</span>`}).then(()=>{this.done=!0})})}exit(){}tick(){this.ticks++;const e=this.photosStarted?this.ticks-this.photosStarted:0,t=this.photosStarted>0&&e>60&&this.app.input.anyPressed();(this.done||t||e>2700)&&this.app.go(new Vd(this.app))}frame(){}}function xc(s,e=!1){if(!e&&s.renderer.showcaseCount===2&&s.renderer.currentStage==="plenum")return;s.renderer.clearFighters(),s.renderer.setStage(Ld.plenum);const t=zo(bt);let i=zo(bt);for(;i.id===t.id;)i=zo(bt);s.renderer.setShowcase([{def:t,x:-1.3,facing:1,pose:"guard"},{def:i,x:1.3,facing:-1,pose:"guard"}],!1),s.audio.playMusic(sy,3)}class Vd{constructor(e){this.app=e}app;t=0;enter(){const e=this.app;xc(e,!0),e.renderer.snapCamera([0,1.6,6.5],[0,1.2,0]);const t=Ge("div","title-wrap");t.innerHTML=`<div class="logo"><span class="l1">Street</span><span class="l2">Knesset</span><span class="l3">Fighter</span><span class="sub"><span class="he">סטריט כנסת פייטר</span> · 40 MKs · ONE PLENUM</span></div>
      <div class="press blink">PRESS ${e.mg("confirm")} / ENTER</div>
      <div class="pads-status"></div>
      <div class="disclaimer">A parody fighting game. All characters are caricatures of public figures; moves and quotes are satire, not real statements.</div>`,t.addEventListener("click",()=>this.next()),e.ui.appendChild(t),this.updatePads(),e.input.onChange=()=>this.updatePads()}updatePads(){const e=this.app.ui.querySelector(".pads-status");if(!e)return;const t=this.app.input.connectedPads();e.innerHTML=t.length?t.map(i=>`<b>${i.kind==="dualsense"?"DualSense":i.kind==="dualshock"?"DualShock":i.kind==="xbox"?"Xbox pad":"Gamepad"}</b> connected${i.standard?"":" (raw mode)"}`).join("<br>"):"No controller detected: press a button on your PS5 controller.<br>Keyboard works too."}next(){this.app.audio.unlock(),this.app.audio.sfx("menuConfirm"),this.app.go(new oi(this.app))}exit(){this.app.input.onChange=null}tick(){const e=this.app.input.menu("any");(e.confirm||e.start)&&this.next()}frame(e){this.t+=e;const t=this.t*.15;this.app.renderer.syncShowcase(e,{pos:[Math.sin(t)*6.2,1.6+Math.sin(this.t*.4)*.2,Math.cos(t)*6.2],look:[0,1.15,0]})}}class oi{constructor(e){this.app=e}app;static lastIndex=0;menu;t=0;enter(){const e=this.app,t=a=>()=>e.go(new Na(e,a)),i=[{label:"Arcade",desc:"Fight through 7 MKs and the final boss to form a government.",onSelect:t("arcade")},{label:"Versus",desc:"Two players, one plenum. Local multiplayer.",onSelect:t("versus")},{label:"Training",desc:"Practice combos against a dummy. Infinite health and meter.",onSelect:t("training")},{label:"CPU vs CPU",desc:"Sit back and watch two CPUs debate.",onSelect:t("watch")},{label:"Move Lists",desc:"Every special move, ultimate and passive for all 40 fighters.",onSelect:()=>e.go(new J_(e,0,()=>e.go(new oi(e))))},{label:"Controls",desc:"PS5 DualSense and keyboard layouts, controller assignment and remapping.",onSelect:()=>e.go(new j_(e,()=>e.go(new oi(e))))},{label:"Faces",desc:"Adjust any MK’s photo crop, or upload your own photo.",onSelect:()=>e.go(new zd(e,()=>e.go(new oi(e))))},{label:"Credits",desc:"Photo credits and licences.",onSelect:()=>e.go(new Gd(e,()=>e.go(new oi(e))))},{label:"Options",desc:"Difficulty, rounds, timer, audio and more.",onSelect:()=>e.go(new ay(e,()=>e.go(new oi(e))))}];e.desktop&&i.push({label:"Quit",desc:"Exit to desktop.",onSelect:()=>e.desktop.quit()}),this.menu=new Cs(i,e.audio,{desc:!0}),this.menu.index=Math.min(oi.lastIndex,i.length-1),this.menu.render();const n=Ge("div","mainmenu");n.innerHTML='<div class="logo"><span class="l1">Street</span><span class="l2">Knesset</span><span class="l3">Fighter</span></div>',n.appendChild(this.menu.el);const r=Ge("div","hint",`${e.mg("confirm")} Select ${e.mg("back")} Back`);e.ui.append(n,r),xc(e)}exit(){oi.lastIndex=this.menu.index}tick(){const e=this.app.input.menu("any");if(e.back){this.app.audio.sfx("menuBack"),this.app.go(new Vd(this.app));return}this.menu.handle(e)}frame(e){this.t+=e;const t=.5+Math.sin(this.t*.1)*.3;this.app.renderer.syncShowcase(e,{pos:[Math.sin(t)*6+1.5,1.5,Math.cos(t)*6],look:[1.2,1.1,0]})}}class ay{constructor(e,t){this.app=e,this.back=t}app;back;menu;toggleFaces(){const e=this.app.settings;e.faces=e.faces==="photo"?"cartoon":"photo",this.app.applySettings(),e.faces==="photo"&&r_()===0&&Rd(bt)}enter(){const e=this.app,t=e.settings,i=(o,c)=>{t[o]=Math.round(Math.max(0,Math.min(1,t[o]+c))*10)/10,e.applySettings()},n=[30,60,99,0],r=[{label:"CPU Difficulty",value:()=>S_[t.difficulty],onLeft:()=>{t.difficulty=Math.max(0,t.difficulty-1),e.applySettings()},onRight:()=>{t.difficulty=Math.min(4,t.difficulty+1),e.applySettings()},desc:"How tough the CPU opponents are."},{label:"Rounds to Win",value:()=>String(t.roundsToWin),onLeft:()=>{t.roundsToWin=Math.max(1,t.roundsToWin-1),e.applySettings()},onRight:()=>{t.roundsToWin=Math.min(5,t.roundsToWin+1),e.applySettings()}},{label:"Round Time",value:()=>t.roundTime===0?"∞":`${t.roundTime}s`,onLeft:()=>{t.roundTime=n[(n.indexOf(t.roundTime)+n.length-1)%n.length],e.applySettings()},onRight:()=>{t.roundTime=n[(n.indexOf(t.roundTime)+1)%n.length],e.applySettings()}},{label:"Master Volume",value:()=>`${Math.round(t.masterVolume*100)}%`,onLeft:()=>i("masterVolume",-.1),onRight:()=>i("masterVolume",.1)},{label:"Music Volume",value:()=>`${Math.round(t.musicVolume*100)}%`,onLeft:()=>i("musicVolume",-.1),onRight:()=>i("musicVolume",.1)},{label:"SFX Volume",value:()=>`${Math.round(t.sfxVolume*100)}%`,onLeft:()=>i("sfxVolume",-.1),onRight:()=>i("sfxVolume",.1)},{label:"Announcer Voice",value:()=>t.announcer?"On":"Off",onLeft:()=>{t.announcer=!t.announcer,e.applySettings()},onRight:()=>{t.announcer=!t.announcer,e.applySettings()},desc:"Uses your system text-to-speech voice."},{label:"Controller Rumble",value:()=>t.rumble?"On":"Off",onLeft:()=>{t.rumble=!t.rumble,e.applySettings()},onRight:()=>{t.rumble=!t.rumble,e.applySettings()},desc:"DualSense vibration on hits (Chrome / Edge / desktop app)."},{label:"Show Hitboxes",value:()=>t.showHitboxes?"On":"Off",onLeft:()=>{t.showHitboxes=!t.showHitboxes,e.applySettings()},onRight:()=>{t.showHitboxes=!t.showHitboxes,e.applySettings()}},{label:"Input Display",value:()=>t.inputDisplay?"On":"Off",onLeft:()=>{t.inputDisplay=!t.inputDisplay,e.applySettings()},onRight:()=>{t.inputDisplay=!t.inputDisplay,e.applySettings()}},{label:"Faces",value:()=>t.faces==="photo"?"Photos":"Cartoon",onLeft:()=>this.toggleFaces(),onRight:()=>this.toggleFaces(),desc:"Photos: real MK faces from Wikipedia (free-licensed). Cartoon: procedural caricatures."},{label:"Graphics Quality",value:()=>t.quality==="high"?"High":"Low",onLeft:()=>{t.quality=t.quality==="high"?"low":"high",e.applySettings()},onRight:()=>{t.quality=t.quality==="high"?"low":"high",e.applySettings()},desc:"Low disables shadows and high-DPI rendering for integrated graphics."},{label:"Toggle Fullscreen",onSelect:()=>e.toggleFullscreen(),desc:"Or press F11."},{label:"Back",onSelect:()=>this.back()}];this.menu=new Cs(r,e.audio,{desc:!0});const a=Ge("div","page");a.innerHTML='<div class="options"><h1 class="display">Options</h1><div class="sub">Settings are saved automatically.</div></div>',a.querySelector(".options").appendChild(this.menu.el),e.ui.append(a,Ge("div","hint",`◀ ▶ Change ${e.mg("confirm")} Select ${e.mg("back")} Back`))}exit(){}tick(){const e=this.app.input.menu("any");if(e.back){this.app.audio.sfx("menuBack"),this.back();return}this.menu.handle(e)}frame(e){this.app.renderer.syncShowcase(e,{pos:[2,1.5,6],look:[0,1.1,0]})}}const rn=new __;rn.go(new ry(rn));rn.start();new URLSearchParams(location.search).has("debug")&&(window.skfDebug={app:rn,fight(s,e,t="plenum",i="watch"){const n={mode:i,p1:lu[s],p2:lu[e],stage:Ld[t],cpu:[i==="watch",i!=="versus"&&i!=="training"]},r=new vr(rn,n);return rn.go(r),r},screen:()=>rn.screen,editor:()=>zd,credits:()=>Gd,faces:()=>bt.map(s=>{const e=vs(s.id);return{id:s.id,loaded:!!e,detected:!!e?.detected,crop:e?.crop,license:e?.source.license}}),move(s,e){const t=rn.screen,i=t.match.fighters[s];i.meter=100;const n=e==="ult"?i.moves.ultimate:i.moves.specials[e];(i.actionable||i.state==="attack")&&i.startMove(n,.5,t.match)},place(s,e){const t=rn.screen;t.match.fighters[0].x=s,t.match.fighters[1].x=e}});
