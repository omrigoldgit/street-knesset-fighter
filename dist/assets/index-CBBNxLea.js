(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))i(n);new MutationObserver(n=>{for(const r of n)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&i(a)}).observe(document,{childList:!0,subtree:!0});function t(n){const r={};return n.integrity&&(r.integrity=n.integrity),n.referrerPolicy&&(r.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?r.credentials="include":n.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function i(n){if(n.ep)return;n.ep=!0;const r=t(n);fetch(n.href,r)}})();const Zp={minor:[0,2,3,5,7,8,10],phrygian:[0,1,3,5,7,8,10],dorian:[0,2,3,5,7,9,10],major:[0,2,4,5,7,9,11]},Jp={minor:[0,5,2,6],phrygian:[0,1,0,6],dorian:[0,3,0,4],major:[0,4,5,3]},fn=s=>440*Math.pow(2,(s-69)/12);class jp{ctx=null;master;sfxBus;musicBus;comp;noiseBuf;seqTimer=null;nextNoteTime=0;step=0;music=null;musicSeed=1;volumes={master:.8,music:.5,sfx:.8};announcer=!0;voice=null;unlock(){if(!this.ctx){try{const n=window.AudioContext??window.webkitAudioContext;this.ctx=new n}catch{return}const e=this.ctx;this.comp=e.createDynamicsCompressor(),this.comp.threshold.value=-14,this.comp.ratio.value=4,this.master=e.createGain(),this.sfxBus=e.createGain(),this.musicBus=e.createGain(),this.sfxBus.connect(this.master),this.musicBus.connect(this.master),this.master.connect(this.comp),this.comp.connect(e.destination),this.applyVolumes();const t=e.sampleRate;this.noiseBuf=e.createBuffer(1,t,e.sampleRate);const i=this.noiseBuf.getChannelData(0);for(let n=0;n<t;n++)i[n]=Math.random()*2-1;this.pickVoice(),this.music&&this.startSequencer()}this.ctx.state==="suspended"&&this.ctx.resume().catch(()=>{})}get running(){return!!this.ctx&&this.ctx.state==="running"}applyVolumes(){this.ctx&&(this.master.gain.value=this.volumes.master,this.sfxBus.gain.value=this.volumes.sfx,this.musicBus.gain.value=this.volumes.music*.55)}pickVoice(){if(!("speechSynthesis"in window))return;const e=()=>{const t=speechSynthesis.getVoices();this.voice=t.find(i=>/en[-_](US|GB)/i.test(i.lang)&&/male|david|daniel|george|guy|fred/i.test(i.name))??t.find(i=>/^en/i.test(i.lang))??null};e(),speechSynthesis.onvoiceschanged=e}say(e){if(!(!this.announcer||!("speechSynthesis"in window)||this.volumes.master*this.volumes.sfx<=.01))try{speechSynthesis.cancel();const t=new SpeechSynthesisUtterance(e);this.voice&&(t.voice=this.voice),t.rate=.95,t.pitch=.55,t.volume=Math.min(1,this.volumes.master*this.volumes.sfx*1.2),speechSynthesis.speak(t)}catch{}}env(e,t,i,n,r){e.gain.setValueAtTime(1e-4,t),e.gain.exponentialRampToValueAtTime(Math.max(2e-4,n),t+i),e.gain.exponentialRampToValueAtTime(1e-4,t+i+r)}tone(e,t,i,n,r,a,o=0,l=.005){const c=this.ctx,h=c.currentTime+o,f=c.createOscillator(),u=c.createGain();f.type=e,f.frequency.setValueAtTime(t,h),i!==t&&f.frequency.exponentialRampToValueAtTime(Math.max(20,i),h+n),this.env(u,h,l,r,n),f.connect(u).connect(a),f.start(h),f.stop(h+l+n+.05)}noise(e,t,i,n,r,a,o,l=0){const c=this.ctx,h=c.currentTime+l,f=c.createBufferSource();f.buffer=this.noiseBuf,f.loop=!0;const u=c.createBiquadFilter();u.type=i,u.frequency.setValueAtTime(n,h),u.frequency.exponentialRampToValueAtTime(Math.max(30,r),h+e),u.Q.value=a;const d=c.createGain();this.env(d,h,.003,t,e),f.connect(u).connect(d).connect(o),f.start(h,Math.random()*.5),f.stop(h+e+.05)}sfx(e,t=1){if(!this.running)return;const i=this.sfxBus;switch(e){case"whoosh":this.noise(.12,.25,"bandpass",900*t,3e3*t,1.5,i);break;case"whooshHeavy":this.noise(.2,.35,"bandpass",500,1800,1.2,i);break;case"hitLight":this.noise(.07,.6,"lowpass",4e3,800,.8,i),this.tone("sine",220*t,90,.08,.5,i);break;case"hitHeavy":this.noise(.16,.8,"lowpass",3e3,300,.8,i),this.tone("sine",140*t,50,.2,.9,i),this.tone("square",90,40,.1,.15,i);break;case"hitSuper":this.noise(.3,.9,"lowpass",5e3,200,.6,i),this.tone("sine",120,35,.35,1,i),this.tone("sawtooth",300,60,.25,.2,i);break;case"block":this.tone("square",1400,900,.04,.18,i),this.noise(.06,.3,"highpass",2500,1500,1,i);break;case"jump":this.tone("sine",300,520,.08,.12,i);break;case"land":this.tone("sine",110,60,.08,.3,i);break;case"landHard":this.noise(.2,.5,"lowpass",900,120,.7,i),this.tone("sine",80,35,.25,.8,i);break;case"special":this.tone("sawtooth",220*t,660*t,.18,.12,i),this.noise(.2,.2,"bandpass",800,3e3,2,i);break;case"projectile":this.tone("square",660*t,220*t,.18,.1,i);break;case"superFlash":this.noise(.6,.4,"bandpass",400,4e3,1.5,i),[0,4,7,12].forEach((n,r)=>this.tone("sawtooth",fn(57+n),fn(57+n+12),.5,.08,i,r*.04));break;case"ko":this.noise(1.2,.8,"lowpass",2e3,60,.5,i),this.tone("sine",90,25,1.2,1,i);break;case"grab":this.noise(.1,.4,"bandpass",600,300,1,i),this.tone("sine",160,90,.1,.4,i);break;case"tech":this.tone("triangle",1600,1200,.15,.3,i),this.tone("triangle",2100,1700,.15,.2,i,.02);break;case"shield":this.tone("sine",1800,1200,.25,.25,i);break;case"reflect":this.tone("triangle",900,1800,.15,.3,i);break;case"armor":this.tone("square",300,200,.1,.2,i),this.tone("triangle",2400,2e3,.2,.15,i);break;case"teleport":this.tone("sine",400,1600,.12,.2,i),this.tone("sine",1600,400,.12,.2,i,.12);break;case"buff":[0,4,7].forEach((n,r)=>this.tone("triangle",fn(72+n),fn(72+n),.12,.12,i,r*.05));break;case"lifeline":this.tone("sine",70,50,.12,.8,i),this.tone("sine",70,50,.12,.8,i,.2),[0,7,12].forEach((n,r)=>this.tone("triangle",fn(76+n),fn(76+n),.3,.15,i,.4+r*.08));break;case"clash":this.tone("square",900,500,.12,.2,i),this.noise(.15,.4,"bandpass",2e3,800,2,i);break;case"counter":this.tone("sawtooth",500,1500,.1,.2,i);break;case"menuMove":this.tone("square",880,880,.035,.07,i);break;case"menuConfirm":this.tone("square",880,880,.05,.08,i),this.tone("square",1320,1320,.08,.08,i,.05);break;case"menuBack":this.tone("square",660,440,.08,.07,i);break;case"select":this.tone("sawtooth",440,880,.12,.12,i),this.noise(.2,.2,"highpass",3e3,6e3,1,i);break;case"round":this.tone("triangle",523,523,.25,.2,i);break;case"crowd":this.noise(1.2,.18,"bandpass",900,700,.6,i);break}}playMusic(e,t=1){this.music=e,this.musicSeed=t,this.stopSequencer(),e&&this.ctx&&this.startSequencer()}stopSequencer(){this.seqTimer!==null&&(clearInterval(this.seqTimer),this.seqTimer=null)}startSequencer(){!this.ctx||!this.music||(this.stopSequencer(),this.step=0,this.nextNoteTime=this.ctx.currentTime+.1,this.seqTimer=window.setInterval(()=>this.schedule(),25))}rnd(e){const t=Math.sin(e*12.9898+this.musicSeed*78.233)*43758.5453;return t-Math.floor(t)}schedule(){const e=this.ctx,t=this.music;if(!e||!t)return;const i=60/t.bpm/4;for(;this.nextNoteTime<e.currentTime+.12;)this.playStep(this.step,this.nextNoteTime-e.currentTime,t),this.nextNoteTime+=i,this.step++}playStep(e,t,i){const n=e%16,r=Math.floor(e/16)%4,a=Zp[i.mode],o=Jp[i.mode][r],l=i.root+a[o%7]+(o>=7?12:0),c=(u,d=0)=>{const m=o+u;return i.root+a[(m%7+7)%7]+12*Math.floor(m/7)+d*12},h=Math.max(0,t);if(n%4===0&&this.kick(h),(n===4||n===12)&&this.snare(h),i.intensity>.85&&n===14&&this.snare(h,.5),this.hat(h,n%2===0?.08:.04),n%2===0){const u=n%8===6?12:0;this.voiceNote("sawtooth",fn(l-12+u),60/i.bpm/2*.9,.12,h,700)}const f=Math.floor(e/64);if(this.rnd(n+f*16+r*3)<.45+i.intensity*.25){const u=[0,2,4,7,4,2,5,3][Math.floor(this.rnd(n*7+f)*8)];this.voiceNote("square",fn(c(u,1)+12),60/i.bpm/4*.8,.045,h,3200)}if(n===0)for(const u of[0,2,4])this.voiceNote("triangle",fn(c(u)),60/i.bpm*3.6,.035,h,1800,.08)}voiceNote(e,t,i,n,r,a,o=.005){const l=this.ctx,c=l.currentTime+r,h=l.createOscillator();h.type=e,h.frequency.value=t;const f=l.createBiquadFilter();f.type="lowpass",f.frequency.value=a;const u=l.createGain();this.env(u,c,o,n,i),h.connect(f).connect(u).connect(this.musicBus),h.start(c),h.stop(c+o+i+.05)}kick(e){const t=this.ctx,i=t.currentTime+e,n=t.createOscillator(),r=t.createGain();n.frequency.setValueAtTime(140,i),n.frequency.exponentialRampToValueAtTime(40,i+.12),this.env(r,i,.002,.5,.16),n.connect(r).connect(this.musicBus),n.start(i),n.stop(i+.2)}snare(e,t=.8){this.noise(.12,.28*t,"bandpass",1800,1200,.9,this.musicBus,e),this.tone("triangle",220,160,.06,.12*t,this.musicBus,e)}hat(e,t){this.noise(.03,t,"highpass",7e3,9e3,1,this.musicBus,e)}}const me={LP:1,HP:2,LK:4,HK:8,SP:16,UL:32,SS:64,TH:128,START:256,SELECT:512},Wl=me.LP|me.HP,mf=me.LK|me.HK,pn=Wl|mf,$t=Object.freeze({dir:5,held:0,pressed:0}),Xl=["LP","HP","LK","HK","SP","UL","TH","SS","START","SELECT"],Do={LP:"Light Punch",HP:"Heavy Punch",LK:"Light Kick",HK:"Heavy Kick",SP:"Special",UL:"Ultimate",SS:"Sidestep",TH:"Throw",START:"Pause",SELECT:"Reset (training)"},ko={LP:2,HP:3,LK:0,HK:1,SP:5,UL:7,SS:4,TH:6,START:9,SELECT:8},e0={LP:0,HP:3,LK:1,HK:2,SP:5,UL:7,SS:4,TH:6,START:9,SELECT:8},kr={UP:["KeyW"],DOWN:["KeyS"],LEFT:["KeyA"],RIGHT:["KeyD"],LP:["KeyU"],HP:["KeyI"],LK:["KeyJ"],HK:["KeyK"],SP:["KeyO"],UL:["KeyL"],TH:["KeyH"],SS:["Space"],START:["Escape","Enter"],SELECT:["Backspace"]},Ur={UP:["ArrowUp"],DOWN:["ArrowDown"],LEFT:["ArrowLeft"],RIGHT:["ArrowRight"],LP:["Numpad4","Insert"],HP:["Numpad5","Home"],LK:["Numpad1","Delete"],HK:["Numpad2","End"],SP:["Numpad6","PageUp"],UL:["Numpad3","PageDown"],TH:["Numpad0"],SS:["NumpadDecimal","ShiftRight"],START:["NumpadEnter"],SELECT:["NumpadSubtract"]},t0={up:!1,down:!1,left:!1,right:!1,confirm:!1,back:!1,extra:!1,extra2:!1,start:!1,l1:!1,r1:!1,any:!1},oa={LP:me.LP,HP:me.HP,LK:me.LK,HK:me.HK,SP:me.SP,UL:me.UL,SS:me.SS,TH:me.TH,START:me.START,SELECT:me.SELECT};function ou(s,e){return e<0?s<0?7:s>0?9:8:e>0?s<0?1:s>0?3:2:s<0?4:s>0?6:5}function i0(s){const e=s.toLowerCase();return e.includes("dualsense")||e.includes("0ce6")||e.includes("0df2")?"dualsense":e.includes("054c")||e.includes("dualshock")||e.includes("wireless controller")||e.includes("playstation")?"dualshock":e.includes("xbox")||e.includes("xinput")||e.includes("045e")?"xbox":"generic"}function n0(s,e){try{const t=localStorage.getItem(s);return t?JSON.parse(t):e}catch{return e}}function lu(s,e){try{localStorage.setItem(s,JSON.stringify(e))}catch{}}class s0{keys=new Set;tapped=new Set;prevKeys=new Set;pads=new Map;slotPad=[null,null];kb=[{dir:5,prevDir:5,repeat:0,menuDir:5},{dir:5,prevDir:5,repeat:0,menuDir:5}];bindings=n0("skf.bindings",{});rumbleEnabled=!0;lastDevice=["kb","kb"];onChange=null;captureCb=null;constructor(){window.addEventListener("keydown",e=>{(e.code==="Tab"||e.code==="Space"||e.code.startsWith("Arrow")||e.code==="Backspace")&&e.preventDefault(),this.keys.add(e.code),this.tapped.add(e.code)}),window.addEventListener("keyup",e=>this.keys.delete(e.code)),window.addEventListener("blur",()=>{this.keys.clear(),this.tapped.clear()}),window.addEventListener("gamepadconnected",e=>{this.refreshPads(),this.autoAssign(e.gamepad.index),this.onChange?.()}),window.addEventListener("gamepaddisconnected",e=>{const t=e.gamepad.index;this.pads.delete(t),this.slotPad=this.slotPad.map(i=>i===t?null:i),this.onChange?.()})}refreshPads(){const e=navigator.getGamepads?navigator.getGamepads():[];for(const t of e)!t||!t.connected||this.pads.has(t.index)||(this.pads.set(t.index,{index:t.index,id:t.id,kind:i0(t.id),standard:t.mapping==="standard",buttons:[],prevButtons:[],dir:5,prevDir:5,repeat:0,menuDir:5}),this.autoAssign(t.index),this.onChange?.())}autoAssign(e){this.slotPad.includes(e)||(this.slotPad[0]===null?(this.slotPad[0]=e,this.lastDevice[0]="pad"):this.slotPad[1]===null&&(this.slotPad[1]=e,this.lastDevice[1]="pad"))}swapSlots(){this.slotPad=[this.slotPad[1],this.slotPad[0]],this.onChange?.()}assignPad(e,t){const i=e===0?1:0;t!==null&&this.slotPad[i]===t&&(this.slotPad[i]=this.slotPad[e]),this.slotPad[e]=t,this.onChange?.()}connectedPads(){return[...this.pads.values()].map(e=>({index:e.index,id:e.id,kind:e.kind,standard:e.standard}))}padInfo(e){const t=this.slotPad[e];if(t===null)return null;const i=this.pads.get(t);return i?{index:i.index,id:i.id,kind:i.kind}:null}bindingFor(e){const t=this.pads.get(e);if(!t)return ko;const i=this.bindings[t.id];return i||(t.standard?ko:t.kind==="dualsense"||t.kind==="dualshock"?e0:ko)}setBinding(e,t){const i=this.pads.get(e);i&&(this.bindings[i.id]=t,lu("skf.bindings",this.bindings))}resetBinding(e){const t=this.pads.get(e);t&&(delete this.bindings[t.id],lu("skf.bindings",this.bindings))}captureNextButton(e){this.captureCb=e}readPadDir(e,t){let i=0,n=0;const r=e.axes[0]??0,a=e.axes[1]??0;if(r<-.45?i=-1:r>.45&&(i=1),a<-.5?n=-1:a>.5&&(n=1),t){const o=e.buttons;o[12]?.pressed&&(n=-1),o[13]?.pressed&&(n=1),o[14]?.pressed&&(i=-1),o[15]?.pressed&&(i=1)}else if(e.axes.length>9){const o=e.axes[9];if(o>=-1.05&&o<=1.05){const l=Math.round((o+1)*3.5)%8,c=[0,1,1,1,0,-1,-1,-1][l],h=[-1,-1,0,1,1,1,0,-1][l];c&&(i=c),h&&(n=h)}}return ou(i,n)}poll(){this.prevKeys=new Set(this.keysSnapshot),this.keysSnapshot=new Set(this.keys);for(const t of this.tapped)this.keysSnapshot.add(t),this.prevKeys.has(t)&&!this.keys.has(t)&&this.prevKeys.delete(t);this.tapped.clear();for(let t=0;t<2;t++){const i=t===0?kr:Ur,n=this.kb[t];n.prevDir=n.dir;const r=(this.anyKey(i.RIGHT)?1:0)-(this.anyKey(i.LEFT)?1:0),a=(this.anyKey(i.DOWN)?1:0)-(this.anyKey(i.UP)?1:0);if(n.dir=ou(r,a),n.menuDir=this.dirRepeat(n),this.keysSnapshot.size>this.prevKeys.size)for(const o of this.keysSnapshot)!this.prevKeys.has(o)&&Object.values(i).some(l=>l.includes(o))&&(this.lastDevice[t]="kb")}this.refreshPads();const e=navigator.getGamepads?navigator.getGamepads():[];for(const t of e){if(!t)continue;const i=this.pads.get(t.index);if(!i)continue;i.prevButtons=i.buttons,i.buttons=t.buttons.map(r=>r.pressed||r.value>.5),i.prevDir=i.dir,i.dir=this.readPadDir(t,i.standard),i.menuDir=this.dirRepeat(i);const n=this.slotPad.indexOf(t.index);if(n>=0&&(i.buttons.some((r,a)=>r&&!i.prevButtons[a])||i.dir!==5&&i.prevDir===5)&&(this.lastDevice[n]="pad"),this.captureCb){for(let r=0;r<i.buttons.length;r++)if(i.buttons[r]&&!i.prevButtons[r]){const a=this.captureCb;this.captureCb=null,a(t.index,r);break}}}}keysSnapshot=new Set;anyKey(e){return e.some(t=>this.keysSnapshot.has(t))}anyKeyPressed(e){return e.some(t=>this.keysSnapshot.has(t)&&!this.prevKeys.has(t))}keyPressed(e){return this.keysSnapshot.has(e)&&!this.prevKeys.has(e)}player(e){const t=e===0?kr:Ur;let i=0,n=0;for(const o of Xl)this.anyKey(t[o])&&(i|=oa[o]),this.anyKeyPressed(t[o])&&(n|=oa[o]);let r=this.kb[e].dir;const a=this.slotPad[e];if(a!==null){const o=this.pads.get(a);if(o){const l=this.bindingFor(a);for(const c of Xl){const h=l[c];o.buttons[h]&&(i|=oa[c]),o.buttons[h]&&!o.prevButtons[h]&&(n|=oa[c])}o.dir!==5&&(r=o.dir)}}return{dir:r,held:i,pressed:n}}dirRepeat(e){return e.dir===5?(e.repeat=0,5):e.dir!==e.prevDir?(e.repeat=0,e.dir):(e.repeat++,e.repeat>22&&e.repeat%5===0?e.dir:5)}menu(e){const t={...t0},i=e==="any"?[0,1]:[e],n=a=>{a!==5&&((a===8||a===7||a===9)&&(t.up=!0),(a===2||a===1||a===3)&&(t.down=!0),(a===4||a===7||a===1)&&(t.left=!0),(a===6||a===9||a===3)&&(t.right=!0))};for(const a of i){const o=a===0?kr:Ur;n(this.kb[a].menuDir);const l=c=>this.anyKeyPressed(c);(l(o.LK)||l(o.LP)||a===0&&(this.keyPressed("Enter")||this.keyPressed("Space")))&&(t.confirm=!0),a===1&&(this.keyPressed("NumpadEnter")||this.keyPressed("Numpad1"))&&(t.confirm=!0),(l(o.HK)||a===0&&(this.keyPressed("Escape")||this.keyPressed("Backspace")))&&(t.back=!0),l(o.HP)&&(t.extra=!0),l(o.SP)&&(t.extra2=!0),l(o.START)&&(t.start=!0),l(o.TH)&&(t.l1=!0),l(o.UL)&&(t.r1=!0)}e==="any"&&this.keyPressed("Enter")&&(t.confirm=!0);const r=e==="any"?[...this.pads.keys()]:this.slotPad[e]!==null?[this.slotPad[e]]:[];for(const a of r){const o=this.pads.get(a);if(!o)continue;n(o.menuDir);const l=c=>!!o.buttons[c]&&!o.prevButtons[c];if(o.standard)l(0)&&(t.confirm=!0),l(1)&&(t.back=!0),l(3)&&(t.extra=!0),l(2)&&(t.extra2=!0),l(9)&&(t.start=!0),l(4)&&(t.l1=!0),l(5)&&(t.r1=!0);else{const c=o.kind==="dualsense"||o.kind==="dualshock";l(c?1:0)&&(t.confirm=!0),l(c?2:1)&&(t.back=!0),l(3)&&(t.extra=!0),l(c?0:2)&&(t.extra2=!0),l(9)&&(t.start=!0),l(4)&&(t.l1=!0),l(5)&&(t.r1=!0)}}return t.any=t.confirm||t.start||t.back||t.up||t.down||t.left||t.right||t.extra||t.extra2,t}anyPressed(){for(const e of this.keysSnapshot)if(!this.prevKeys.has(e))return!0;for(const e of this.pads.values())if(e.buttons.some((t,i)=>t&&!e.prevButtons[i]))return!0;return!1}rumble(e,t,i,n){if(!this.rumbleEnabled)return;const r=this.slotPad[e];if(r===null)return;const o=navigator.getGamepads?.()[r]?.vibrationActuator;if(o)try{o.playEffect("dual-rumble",{startDelay:0,duration:n,strongMagnitude:Math.min(1,t),weakMagnitude:Math.min(1,i)}).catch(()=>{})}catch{}}}const r0={LP:"□",HP:"△",LK:"✕",HK:"○",SP:"R1",UL:"R2",SS:"L1",TH:"L2",START:"OPTIONS",SELECT:"CREATE"},a0={LP:"X",HP:"Y",LK:"A",HK:"B",SP:"RB",UL:"RT",SS:"LB",TH:"LT",START:"MENU",SELECT:"VIEW"};function Xs(s){return s.replace("Key","").replace("Numpad","Num ").replace("Arrow","").replace("Space","Space")}function o0(s,e,t=0){return e==="ps"?r0[s]:e==="xbox"?a0[s]:Xs((t===0?kr:Ur)[s][0])}function l0(s,e){if(e!=="ps")return"g-key";switch(s){case"LP":return"g-square";case"HP":return"g-triangle";case"LK":return"g-cross";case"HK":return"g-circle";default:return"g-shoulder"}}const Pr=["ultra","high","low"],c0={ultra:"Ultra",high:"High",low:"Low"},Uo={difficulty:1,roundsToWin:2,roundTime:99,masterVolume:.8,musicVolume:.5,sfxVolume:.8,announcer:!0,rumble:!0,showHitboxes:!1,inputDisplay:!1,quality:"ultra",faces:"photo"},gf="skf.settings";function h0(){try{const s=localStorage.getItem(gf);if(s){const e={...Uo,...JSON.parse(s)};return Pr.includes(e.quality)||(e.quality=Uo.quality),e}}catch{}return{...Uo}}function u0(s){try{localStorage.setItem(gf,JSON.stringify(s))}catch{}}const Fo=60,d0=.02,$s=.6,f0=.0125*$s*$s,so=.15,Qs=9,p0=.3,m0=1e3,Vr=100,ql=100,g0=.25,v0=16,No=70,vf=20,Kl=18,cu=38,x0=9,Bo=14,hu=8,y0=18;function uu(s){return s<=1?1:Math.max(.3,1-(s-1)*.1)}const sh="186",M0=0,du=1,_0=2,Fr=1,S0=2,Rr=3,fs=0,Zt=1,oi=2,ni=0,Nr=1,er=2,fu=3,pu=4,xf=5,nn=100,b0=101,A0=102,w0=103,E0=104,Lr=200,T0=201,C0=202,P0=203,yf=204,Mf=205,Yl=206,R0=207,$l=208,L0=209,I0=210,D0=211,k0=212,U0=213,F0=214,Ql=0,Zl=1,Jl=2,Wr=3,jl=4,ec=5,tc=6,ic=7,rh=0,N0=1,B0=2,on=0,ah=1,oh=2,lh=3,jr=4,ch=5,hh=6,uh=7,mu="attached",O0="detached",_f=300,ps=301,tr=302,Oo=303,zo=304,Mo=306,Wi=1e3,bn=1001,nc=1002,Qt=1003,z0=1004,la=1005,di=1006,Ho=1007,us=1008,wi=1009,Sf=1010,bf=1011,Xr=1012,dh=1013,cn=1014,Bi=1015,li=1016,fh=1017,ph=1018,ir=1020,Af=35902,wf=35899,Ef=1021,Tf=1022,Li=1023,Cn=1026,Kn=1027,mh=1028,gh=1029,ms=1030,vh=1031,xh=1033,Za=33776,Ja=33777,ja=33778,eo=33779,sc=35840,rc=35841,ac=35842,oc=35843,lc=36196,cc=37492,hc=37496,uc=37488,dc=37489,ro=37490,fc=37491,pc=37808,mc=37809,gc=37810,vc=37811,xc=37812,yc=37813,Mc=37814,_c=37815,Sc=37816,bc=37817,Ac=37818,wc=37819,Ec=37820,Tc=37821,Cc=36492,Pc=36494,Rc=36495,Lc=36283,Ic=36284,ao=36285,Dc=36286,H0=3200,qr=0,G0=1,Sn="",Kt="srgb",oo="srgb-linear",lo="linear",bt="srgb",Go=7680,V0=519,W0=512,X0=513,q0=514,yh=515,K0=516,Y0=517,Mh=518,$0=519,Cf=35044,gu=35048,vu="300 es",an=2e3,Kr=2001;function Q0(s){for(let e=s.length-1;e>=0;--e)if(s[e]>=65535)return!0;return!1}function co(s){return document.createElementNS("http://www.w3.org/1999/xhtml",s)}function Z0(){const s=co("canvas");return s.style.display="block",s}const xu={};function ho(...s){const e="THREE."+s.shift();console.log(e,...s)}function Pf(s){const e=s[0];if(typeof e=="string"&&e.startsWith("TSL:")){const t=s[1];t&&t.isStackTrace?s[0]+=" "+t.getLocation():s[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return s}function je(...s){s=Pf(s);const e="THREE."+s.shift();{const t=s[0];t&&t.isStackTrace?console.warn(t.getError(e)):console.warn(e,...s)}}function vt(...s){s=Pf(s);const e="THREE."+s.shift();{const t=s[0];t&&t.isStackTrace?console.error(t.getError(e)):console.error(e,...s)}}function Zs(...s){const e=s.join(" ");e in xu||(xu[e]=!0,je(...s))}function J0(s,e,t){return new Promise(function(i,n){function r(){switch(s.clientWaitSync(e,s.SYNC_FLUSH_COMMANDS_BIT,0)){case s.WAIT_FAILED:n();break;case s.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:i()}}setTimeout(r,t)})}const j0={[Ql]:Zl,[Jl]:tc,[jl]:ic,[Wr]:ec,[Zl]:Ql,[tc]:Jl,[ic]:jl,[ec]:Wr};class vs{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){const i=this._listeners;return i===void 0?!1:i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){const i=this._listeners;if(i===void 0)return;const n=i[e];if(n!==void 0){const r=n.indexOf(t);r!==-1&&n.splice(r,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const i=t[e.type];if(i!==void 0){e.target=this;const n=i.slice(0);for(let r=0,a=n.length;r<a;r++)n[r].call(this,e);e.target=null}}}const hi=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Vo=Math.PI/180,kc=180/Math.PI;function ln(){const s=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(hi[s&255]+hi[s>>8&255]+hi[s>>16&255]+hi[s>>24&255]+"-"+hi[e&255]+hi[e>>8&255]+"-"+hi[e>>16&15|64]+hi[e>>24&255]+"-"+hi[t&63|128]+hi[t>>8&255]+"-"+hi[t>>16&255]+hi[t>>24&255]+hi[i&255]+hi[i>>8&255]+hi[i>>16&255]+hi[i>>24&255]).toLowerCase()}function ft(s,e,t){return Math.max(e,Math.min(t,s))}function em(s,e){return(s%e+e)%e}function Wo(s,e,t){return(1-t)*s+t*e}function sn(s,e){switch(e.constructor){case Float32Array:return s;case Uint32Array:return s/4294967295;case Uint16Array:return s/65535;case Uint8Array:case Uint8ClampedArray:return s/255;case Int32Array:return Math.max(s/2147483647,-1);case Int16Array:return Math.max(s/32767,-1);case Int8Array:return Math.max(s/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function Tt(s,e){switch(e.constructor){case Float32Array:return s;case Uint32Array:return Math.round(s*4294967295);case Uint16Array:return Math.round(s*65535);case Uint8Array:case Uint8ClampedArray:return Math.round(s*255);case Int32Array:return Math.round(s*2147483647);case Int16Array:return Math.round(s*32767);case Int8Array:return Math.round(s*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}const qh=class qh{constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("THREE.Vector2: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,i=this.y,n=e.elements;return this.x=n[0]*t+n[3]*i+n[6],this.y=n[1]*t+n[4]*i+n[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=ft(this.x,e.x,t.x),this.y=ft(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=ft(this.x,e,t),this.y=ft(this.y,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(ft(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(ft(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const i=Math.cos(t),n=Math.sin(t),r=this.x-e.x,a=this.y-e.y;return this.x=r*i-a*n+e.x,this.y=r*n+a*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};qh.prototype.isVector2=!0;let le=qh;class un{constructor(e=0,t=0,i=0,n=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=n}static slerpFlat(e,t,i,n,r,a,o){let l=i[n+0],c=i[n+1],h=i[n+2],f=i[n+3],u=r[a+0],d=r[a+1],m=r[a+2],v=r[a+3];if(f!==v||l!==u||c!==d||h!==m){let p=l*u+c*d+h*m+f*v;p<0&&(u=-u,d=-d,m=-m,v=-v,p=-p);let g=1-o;if(p<.9995){const y=Math.acos(p),E=Math.sin(y);g=Math.sin(g*y)/E,o=Math.sin(o*y)/E,l=l*g+u*o,c=c*g+d*o,h=h*g+m*o,f=f*g+v*o}else{l=l*g+u*o,c=c*g+d*o,h=h*g+m*o,f=f*g+v*o;const y=1/Math.sqrt(l*l+c*c+h*h+f*f);l*=y,c*=y,h*=y,f*=y}}e[t]=l,e[t+1]=c,e[t+2]=h,e[t+3]=f}static multiplyQuaternionsFlat(e,t,i,n,r,a){const o=i[n],l=i[n+1],c=i[n+2],h=i[n+3],f=r[a],u=r[a+1],d=r[a+2],m=r[a+3];return e[t]=o*m+h*f+l*d-c*u,e[t+1]=l*m+h*u+c*f-o*d,e[t+2]=c*m+h*d+o*u-l*f,e[t+3]=h*m-o*f-l*u-c*d,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,n){return this._x=e,this._y=t,this._z=i,this._w=n,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const i=e._x,n=e._y,r=e._z,a=e._order,o=Math.cos,l=Math.sin,c=o(i/2),h=o(n/2),f=o(r/2),u=l(i/2),d=l(n/2),m=l(r/2);switch(a){case"XYZ":this._x=u*h*f+c*d*m,this._y=c*d*f-u*h*m,this._z=c*h*m+u*d*f,this._w=c*h*f-u*d*m;break;case"YXZ":this._x=u*h*f+c*d*m,this._y=c*d*f-u*h*m,this._z=c*h*m-u*d*f,this._w=c*h*f+u*d*m;break;case"ZXY":this._x=u*h*f-c*d*m,this._y=c*d*f+u*h*m,this._z=c*h*m+u*d*f,this._w=c*h*f-u*d*m;break;case"ZYX":this._x=u*h*f-c*d*m,this._y=c*d*f+u*h*m,this._z=c*h*m-u*d*f,this._w=c*h*f+u*d*m;break;case"YZX":this._x=u*h*f+c*d*m,this._y=c*d*f+u*h*m,this._z=c*h*m-u*d*f,this._w=c*h*f-u*d*m;break;case"XZY":this._x=u*h*f-c*d*m,this._y=c*d*f-u*h*m,this._z=c*h*m+u*d*f,this._w=c*h*f+u*d*m;break;default:je("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const i=t/2,n=Math.sin(i);return this._x=e.x*n,this._y=e.y*n,this._z=e.z*n,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,i=t[0],n=t[4],r=t[8],a=t[1],o=t[5],l=t[9],c=t[2],h=t[6],f=t[10],u=i+o+f;if(u>0){const d=.5/Math.sqrt(u+1);this._w=.25/d,this._x=(h-l)*d,this._y=(r-c)*d,this._z=(a-n)*d}else if(i>o&&i>f){const d=2*Math.sqrt(1+i-o-f);this._w=(h-l)/d,this._x=.25*d,this._y=(n+a)/d,this._z=(r+c)/d}else if(o>f){const d=2*Math.sqrt(1+o-i-f);this._w=(r-c)/d,this._x=(n+a)/d,this._y=.25*d,this._z=(l+h)/d}else{const d=2*Math.sqrt(1+f-i-o);this._w=(a-n)/d,this._x=(r+c)/d,this._y=(l+h)/d,this._z=.25*d}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<1e-8?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(ft(this.dot(e),-1,1)))}rotateTowards(e,t){const i=this.angleTo(e);if(i===0)return this;const n=Math.min(1,t/i);return this.slerp(e,n),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const i=e._x,n=e._y,r=e._z,a=e._w,o=t._x,l=t._y,c=t._z,h=t._w;return this._x=i*h+a*o+n*c-r*l,this._y=n*h+a*l+r*o-i*c,this._z=r*h+a*c+i*l-n*o,this._w=a*h-i*o-n*l-r*c,this._onChangeCallback(),this}slerp(e,t){let i=e._x,n=e._y,r=e._z,a=e._w,o=this.dot(e);o<0&&(i=-i,n=-n,r=-r,a=-a,o=-o);let l=1-t;if(o<.9995){const c=Math.acos(o),h=Math.sin(c);l=Math.sin(l*c)/h,t=Math.sin(t*c)/h,this._x=this._x*l+i*t,this._y=this._y*l+n*t,this._z=this._z*l+r*t,this._w=this._w*l+a*t,this._onChangeCallback()}else this._x=this._x*l+i*t,this._y=this._y*l+n*t,this._z=this._z*l+r*t,this._w=this._w*l+a*t,this.normalize();return this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),i=Math.random(),n=Math.sqrt(1-i),r=Math.sqrt(i);return this.set(n*Math.sin(e),n*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}const Kh=class Kh{constructor(e=0,t=0,i=0){this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("THREE.Vector3: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(yu.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(yu.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,i=this.y,n=this.z,r=e.elements;return this.x=r[0]*t+r[3]*i+r[6]*n,this.y=r[1]*t+r[4]*i+r[7]*n,this.z=r[2]*t+r[5]*i+r[8]*n,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,i=this.y,n=this.z,r=e.elements,a=1/(r[3]*t+r[7]*i+r[11]*n+r[15]);return this.x=(r[0]*t+r[4]*i+r[8]*n+r[12])*a,this.y=(r[1]*t+r[5]*i+r[9]*n+r[13])*a,this.z=(r[2]*t+r[6]*i+r[10]*n+r[14])*a,this}applyQuaternion(e){const t=this.x,i=this.y,n=this.z,r=e.x,a=e.y,o=e.z,l=e.w,c=2*(a*n-o*i),h=2*(o*t-r*n),f=2*(r*i-a*t);return this.x=t+l*c+a*f-o*h,this.y=i+l*h+o*c-r*f,this.z=n+l*f+r*h-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,i=this.y,n=this.z,r=e.elements;return this.x=r[0]*t+r[4]*i+r[8]*n,this.y=r[1]*t+r[5]*i+r[9]*n,this.z=r[2]*t+r[6]*i+r[10]*n,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=ft(this.x,e.x,t.x),this.y=ft(this.y,e.y,t.y),this.z=ft(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=ft(this.x,e,t),this.y=ft(this.y,e,t),this.z=ft(this.z,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(ft(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const i=e.x,n=e.y,r=e.z,a=t.x,o=t.y,l=t.z;return this.x=n*l-r*o,this.y=r*a-i*l,this.z=i*o-n*a,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return Xo.copy(this).projectOnVector(e),this.sub(Xo)}reflect(e){return this.sub(Xo.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(ft(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y,n=this.z-e.z;return t*t+i*i+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){const n=Math.sin(t)*e;return this.x=n*Math.sin(i),this.y=Math.cos(t)*e,this.z=n*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),n=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=n,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,i=Math.sqrt(1-t*t);return this.x=i*Math.cos(e),this.y=t,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};Kh.prototype.isVector3=!0;let L=Kh;const Xo=new L,yu=new un,Yh=class Yh{constructor(e,t,i,n,r,a,o,l,c){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,i,n,r,a,o,l,c)}set(e,t,i,n,r,a,o,l,c){const h=this.elements;return h[0]=e,h[1]=n,h[2]=o,h[3]=t,h[4]=r,h[5]=l,h[6]=i,h[7]=a,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,n=t.elements,r=this.elements,a=i[0],o=i[3],l=i[6],c=i[1],h=i[4],f=i[7],u=i[2],d=i[5],m=i[8],v=n[0],p=n[3],g=n[6],y=n[1],E=n[4],M=n[7],b=n[2],S=n[5],w=n[8];return r[0]=a*v+o*y+l*b,r[3]=a*p+o*E+l*S,r[6]=a*g+o*M+l*w,r[1]=c*v+h*y+f*b,r[4]=c*p+h*E+f*S,r[7]=c*g+h*M+f*w,r[2]=u*v+d*y+m*b,r[5]=u*p+d*E+m*S,r[8]=u*g+d*M+m*w,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[1],n=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8];return t*a*h-t*o*c-i*r*h+i*o*l+n*r*c-n*a*l}invert(){const e=this.elements,t=e[0],i=e[1],n=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],f=h*a-o*c,u=o*l-h*r,d=c*r-a*l,m=t*f+i*u+n*d;if(m===0)return this.set(0,0,0,0,0,0,0,0,0);const v=1/m;return e[0]=f*v,e[1]=(n*c-h*i)*v,e[2]=(o*i-n*a)*v,e[3]=u*v,e[4]=(h*t-n*l)*v,e[5]=(n*r-o*t)*v,e[6]=d*v,e[7]=(i*l-c*t)*v,e[8]=(a*t-i*r)*v,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,n,r,a,o){const l=Math.cos(r),c=Math.sin(r);return this.set(i*l,i*c,-i*(l*a+c*o)+a+e,-n*c,n*l,-n*(-c*a+l*o)+o+t,0,0,1),this}scale(e,t){return Zs("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(qo.makeScale(e,t)),this}rotate(e){return Zs("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(qo.makeRotation(-e)),this}translate(e,t){return Zs("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(qo.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,i,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,i=e.elements;for(let n=0;n<9;n++)if(t[n]!==i[n])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}};Yh.prototype.isMatrix3=!0;let it=Yh;const qo=new it,Mu=new it().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),_u=new it().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function tm(){const s={enabled:!0,workingColorSpace:oo,spaces:{},convert:function(n,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===bt&&(n.r=En(n.r),n.g=En(n.g),n.b=En(n.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(n.applyMatrix3(this.spaces[r].toXYZ),n.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===bt&&(n.r=Js(n.r),n.g=Js(n.g),n.b=Js(n.b))),n},workingToColorSpace:function(n,r){return this.convert(n,this.workingColorSpace,r)},colorSpaceToWorking:function(n,r){return this.convert(n,r,this.workingColorSpace)},getPrimaries:function(n){return this.spaces[n].primaries},getTransfer:function(n){return n===Sn?lo:this.spaces[n].transfer},getToneMappingMode:function(n){return this.spaces[n].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(n,r=this.workingColorSpace){return n.fromArray(this.spaces[r].luminanceCoefficients)},define:function(n){Object.assign(this.spaces,n)},_getMatrix:function(n,r,a){return n.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(n){return this.spaces[n].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(n=this.workingColorSpace){return this.spaces[n].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(n,r){return Zs("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),s.workingToColorSpace(n,r)},toWorkingColorSpace:function(n,r){return Zs("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),s.colorSpaceToWorking(n,r)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],i=[.3127,.329];return s.define({[oo]:{primaries:e,whitePoint:i,transfer:lo,toXYZ:Mu,fromXYZ:_u,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:Kt},outputColorSpaceConfig:{drawingBufferColorSpace:Kt}},[Kt]:{primaries:e,whitePoint:i,transfer:bt,toXYZ:Mu,fromXYZ:_u,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:Kt}}}),s}const gt=tm();function En(s){return s<.04045?s*.0773993808:Math.pow(s*.9478672986+.0521327014,2.4)}function Js(s){return s<.0031308?s*12.92:1.055*Math.pow(s,.41666)-.055}let Ss;class im{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let i;if(e instanceof HTMLCanvasElement)i=e;else{Ss===void 0&&(Ss=co("canvas")),Ss.width=e.width,Ss.height=e.height;const n=Ss.getContext("2d");e instanceof ImageData?n.putImageData(e,0,0):n.drawImage(e,0,0,e.width,e.height),i=Ss}return i.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=co("canvas");t.width=e.width,t.height=e.height;const i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const n=i.getImageData(0,0,e.width,e.height),r=n.data;for(let a=0;a<r.length;a++)r[a]=En(r[a]/255)*255;return i.putImageData(n,0,0),t}else if(e.data){const t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor(En(t[i]/255)*255):t[i]=En(t[i]);return{data:t,width:e.width,height:e.height}}else return je("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let nm=0;class _h{constructor(e=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:nm++}),this.uuid=ln(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},n=this.data;if(n!==null){let r;if(Array.isArray(n)){r=[];for(let a=0,o=n.length;a<o;a++)n[a].isDataTexture?r.push(Ko(n[a].image)):r.push(Ko(n[a]))}else r=Ko(n);i.url=r}return t||(e.images[this.uuid]=i),i}}function Ko(s){return typeof HTMLImageElement<"u"&&s instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&s instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&s instanceof ImageBitmap?im.getDataURL(s):s.data?{data:Array.from(s.data),width:s.width,height:s.height,type:s.data.constructor.name}:(je("Texture: Unable to serialize Texture."),{})}let sm=0;const Yo=new L;class fi extends vs{constructor(e=fi.DEFAULT_IMAGE,t=fi.DEFAULT_MAPPING,i=bn,n=bn,r=di,a=us,o=Li,l=wi,c=fi.DEFAULT_ANISOTROPY,h=Sn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:sm++}),this.uuid=ln(),this.name="",this.source=new _h(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=i,this.wrapT=n,this.magFilter=r,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new le(0,0),this.repeat=new le(1,1),this.center=new le(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new it,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(Yo).x}get height(){return this.source.getSize(Yo).y}get depth(){return this.source.getSize(Yo).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const i=e[t];if(i===void 0){je(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const n=this[t];if(n===void 0){je(`Texture.setValues(): property '${t}' does not exist.`);continue}n&&i&&n.isVector2&&i.isVector2||n&&i&&n.isVector3&&i.isVector3||n&&i&&n.isMatrix3&&i.isMatrix3?n.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==_f)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Wi:e.x=e.x-Math.floor(e.x);break;case bn:e.x=e.x<0?0:1;break;case nc:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Wi:e.y=e.y-Math.floor(e.y);break;case bn:e.y=e.y<0?0:1;break;case nc:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}fi.DEFAULT_IMAGE=null;fi.DEFAULT_MAPPING=_f;fi.DEFAULT_ANISOTROPY=1;const $h=class $h{constructor(e=0,t=0,i=0,n=1){this.x=e,this.y=t,this.z=i,this.w=n}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,n){return this.x=e,this.y=t,this.z=i,this.w=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("THREE.Vector4: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,i=this.y,n=this.z,r=this.w,a=e.elements;return this.x=a[0]*t+a[4]*i+a[8]*n+a[12]*r,this.y=a[1]*t+a[5]*i+a[9]*n+a[13]*r,this.z=a[2]*t+a[6]*i+a[10]*n+a[14]*r,this.w=a[3]*t+a[7]*i+a[11]*n+a[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,n,r;const l=e.elements,c=l[0],h=l[4],f=l[8],u=l[1],d=l[5],m=l[9],v=l[2],p=l[6],g=l[10];if(Math.abs(h-u)<.01&&Math.abs(f-v)<.01&&Math.abs(m-p)<.01){if(Math.abs(h+u)<.1&&Math.abs(f+v)<.1&&Math.abs(m+p)<.1&&Math.abs(c+d+g-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const E=(c+1)/2,M=(d+1)/2,b=(g+1)/2,S=(h+u)/4,w=(f+v)/4,x=(m+p)/4;return E>M&&E>b?E<.01?(i=0,n=.707106781,r=.707106781):(i=Math.sqrt(E),n=S/i,r=w/i):M>b?M<.01?(i=.707106781,n=0,r=.707106781):(n=Math.sqrt(M),i=S/n,r=x/n):b<.01?(i=.707106781,n=.707106781,r=0):(r=Math.sqrt(b),i=w/r,n=x/r),this.set(i,n,r,t),this}let y=Math.sqrt((p-m)*(p-m)+(f-v)*(f-v)+(u-h)*(u-h));return Math.abs(y)<.001&&(y=1),this.x=(p-m)/y,this.y=(f-v)/y,this.z=(u-h)/y,this.w=Math.acos((c+d+g-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=ft(this.x,e.x,t.x),this.y=ft(this.y,e.y,t.y),this.z=ft(this.z,e.z,t.z),this.w=ft(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=ft(this.x,e,t),this.y=ft(this.y,e,t),this.z=ft(this.z,e,t),this.w=ft(this.w,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(ft(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};$h.prototype.isVector4=!0;let Ct=$h;class rm extends vs{constructor(e=1,t=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:di,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},i),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=i.depth,this.scissor=new Ct(0,0,e,t),this.scissorTest=!1,this.viewport=new Ct(0,0,e,t),this.textures=[];const n={width:e,height:t,depth:i.depth},r=new fi(n),a=i.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveColorBuffer=i.resolveColorBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.storeMultisampledColorBuffer=i.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=i.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=i.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview,this.useArrayDepthTexture=i.useArrayDepthTexture}_setTextureOptions(e={}){const t={minFilter:di,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),e!==null&&e.renderTarget===null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,i=1){if(this.width!==e||this.height!==t||this.depth!==i){this.width=e,this.height=t,this.depth=i;for(let n=0,r=this.textures.length;n<r;n++)this.textures[n].image.width=e,this.textures[n].image.height=t,this.textures[n].image.depth=i,this.textures[n].isData3DTexture!==!0&&(this.textures[n].isArrayTexture=this.textures[n].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,i=e.textures.length;t<i;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const n=Object.assign({},e.textures[t].image);this.textures[t].source=new _h(n)}if(this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveColorBuffer=e.resolveColorBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,this.storeMultisampledColorBuffer=e.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=e.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=e.storeMultisampledStencilBuffer,e.depthTexture!==null)if(e.depthTexture.renderTarget===e){const t=e.depthTexture.clone();t.renderTarget=null,this.depthTexture=t}else this.depthTexture=e.depthTexture;return this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}}class ai extends rm{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}}class Rf extends fi{constructor(e=null,t=1,i=1,n=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:n},this.magFilter=Qt,this.minFilter=Qt,this.wrapR=bn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class am extends fi{constructor(e=null,t=1,i=1,n=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:n},this.magFilter=Qt,this.minFilter=Qt,this.wrapR=bn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}}const yo=class yo{constructor(e,t,i,n,r,a,o,l,c,h,f,u,d,m,v,p){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,i,n,r,a,o,l,c,h,f,u,d,m,v,p)}set(e,t,i,n,r,a,o,l,c,h,f,u,d,m,v,p){const g=this.elements;return g[0]=e,g[4]=t,g[8]=i,g[12]=n,g[1]=r,g[5]=a,g[9]=o,g[13]=l,g[2]=c,g[6]=h,g[10]=f,g[14]=u,g[3]=d,g[7]=m,g[11]=v,g[15]=p,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new yo().fromArray(this.elements)}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){const t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),i.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this)}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();const t=this.elements,i=e.elements,n=1/bs.setFromMatrixColumn(e,0).length(),r=1/bs.setFromMatrixColumn(e,1).length(),a=1/bs.setFromMatrixColumn(e,2).length();return t[0]=i[0]*n,t[1]=i[1]*n,t[2]=i[2]*n,t[3]=0,t[4]=i[4]*r,t[5]=i[5]*r,t[6]=i[6]*r,t[7]=0,t[8]=i[8]*a,t[9]=i[9]*a,t[10]=i[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,i=e.x,n=e.y,r=e.z,a=Math.cos(i),o=Math.sin(i),l=Math.cos(n),c=Math.sin(n),h=Math.cos(r),f=Math.sin(r);if(e.order==="XYZ"){const u=a*h,d=a*f,m=o*h,v=o*f;t[0]=l*h,t[4]=-l*f,t[8]=c,t[1]=d+m*c,t[5]=u-v*c,t[9]=-o*l,t[2]=v-u*c,t[6]=m+d*c,t[10]=a*l}else if(e.order==="YXZ"){const u=l*h,d=l*f,m=c*h,v=c*f;t[0]=u+v*o,t[4]=m*o-d,t[8]=a*c,t[1]=a*f,t[5]=a*h,t[9]=-o,t[2]=d*o-m,t[6]=v+u*o,t[10]=a*l}else if(e.order==="ZXY"){const u=l*h,d=l*f,m=c*h,v=c*f;t[0]=u-v*o,t[4]=-a*f,t[8]=m+d*o,t[1]=d+m*o,t[5]=a*h,t[9]=v-u*o,t[2]=-a*c,t[6]=o,t[10]=a*l}else if(e.order==="ZYX"){const u=a*h,d=a*f,m=o*h,v=o*f;t[0]=l*h,t[4]=m*c-d,t[8]=u*c+v,t[1]=l*f,t[5]=v*c+u,t[9]=d*c-m,t[2]=-c,t[6]=o*l,t[10]=a*l}else if(e.order==="YZX"){const u=a*l,d=a*c,m=o*l,v=o*c;t[0]=l*h,t[4]=v-u*f,t[8]=m*f+d,t[1]=f,t[5]=a*h,t[9]=-o*h,t[2]=-c*h,t[6]=d*f+m,t[10]=u-v*f}else if(e.order==="XZY"){const u=a*l,d=a*c,m=o*l,v=o*c;t[0]=l*h,t[4]=-f,t[8]=c*h,t[1]=u*f+v,t[5]=a*h,t[9]=d*f-m,t[2]=m*f-d,t[6]=o*h,t[10]=v*f+u}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(om,e,lm)}lookAt(e,t,i){const n=this.elements;return Ci.subVectors(e,t),Ci.lengthSq()===0&&(Ci.z=1),Ci.normalize(),Nn.crossVectors(i,Ci),Nn.lengthSq()===0&&(Math.abs(i.z)===1?Ci.x+=1e-4:Ci.z+=1e-4,Ci.normalize(),Nn.crossVectors(i,Ci)),Nn.normalize(),ca.crossVectors(Ci,Nn),n[0]=Nn.x,n[4]=ca.x,n[8]=Ci.x,n[1]=Nn.y,n[5]=ca.y,n[9]=Ci.y,n[2]=Nn.z,n[6]=ca.z,n[10]=Ci.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,n=t.elements,r=this.elements,a=i[0],o=i[4],l=i[8],c=i[12],h=i[1],f=i[5],u=i[9],d=i[13],m=i[2],v=i[6],p=i[10],g=i[14],y=i[3],E=i[7],M=i[11],b=i[15],S=n[0],w=n[4],x=n[8],A=n[12],C=n[1],R=n[5],D=n[9],B=n[13],k=n[2],N=n[6],G=n[10],H=n[14],se=n[3],V=n[7],j=n[11],J=n[15];return r[0]=a*S+o*C+l*k+c*se,r[4]=a*w+o*R+l*N+c*V,r[8]=a*x+o*D+l*G+c*j,r[12]=a*A+o*B+l*H+c*J,r[1]=h*S+f*C+u*k+d*se,r[5]=h*w+f*R+u*N+d*V,r[9]=h*x+f*D+u*G+d*j,r[13]=h*A+f*B+u*H+d*J,r[2]=m*S+v*C+p*k+g*se,r[6]=m*w+v*R+p*N+g*V,r[10]=m*x+v*D+p*G+g*j,r[14]=m*A+v*B+p*H+g*J,r[3]=y*S+E*C+M*k+b*se,r[7]=y*w+E*R+M*N+b*V,r[11]=y*x+E*D+M*G+b*j,r[15]=y*A+E*B+M*H+b*J,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[4],n=e[8],r=e[12],a=e[1],o=e[5],l=e[9],c=e[13],h=e[2],f=e[6],u=e[10],d=e[14],m=e[3],v=e[7],p=e[11],g=e[15],y=l*d-c*u,E=o*d-c*f,M=o*u-l*f,b=a*d-c*h,S=a*u-l*h,w=a*f-o*h;return t*(v*y-p*E+g*M)-i*(m*y-p*b+g*S)+n*(m*E-v*b+g*w)-r*(m*M-v*S+p*w)}determinantAffine(){const e=this.elements,t=e[0],i=e[4],n=e[8],r=e[1],a=e[5],o=e[9],l=e[2],c=e[6],h=e[10];return t*(a*h-o*c)-i*(r*h-o*l)+n*(r*c-a*l)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){const n=this.elements;return e.isVector3?(n[12]=e.x,n[13]=e.y,n[14]=e.z):(n[12]=e,n[13]=t,n[14]=i),this}invert(){const e=this.elements,t=e[0],i=e[1],n=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],f=e[9],u=e[10],d=e[11],m=e[12],v=e[13],p=e[14],g=e[15],y=t*o-i*a,E=t*l-n*a,M=t*c-r*a,b=i*l-n*o,S=i*c-r*o,w=n*c-r*l,x=h*v-f*m,A=h*p-u*m,C=h*g-d*m,R=f*p-u*v,D=f*g-d*v,B=u*g-d*p,k=y*B-E*D+M*R+b*C-S*A+w*x;if(k===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const N=1/k;return e[0]=(o*B-l*D+c*R)*N,e[1]=(n*D-i*B-r*R)*N,e[2]=(v*w-p*S+g*b)*N,e[3]=(u*S-f*w-d*b)*N,e[4]=(l*C-a*B-c*A)*N,e[5]=(t*B-n*C+r*A)*N,e[6]=(p*M-m*w-g*E)*N,e[7]=(h*w-u*M+d*E)*N,e[8]=(a*D-o*C+c*x)*N,e[9]=(i*C-t*D-r*x)*N,e[10]=(m*S-v*M+g*y)*N,e[11]=(f*M-h*S-d*y)*N,e[12]=(o*A-a*R-l*x)*N,e[13]=(t*R-i*A+n*x)*N,e[14]=(v*E-m*b-p*y)*N,e[15]=(h*b-f*E+u*y)*N,this}scale(e){const t=this.elements,i=e.x,n=e.y,r=e.z;return t[0]*=i,t[4]*=n,t[8]*=r,t[1]*=i,t[5]*=n,t[9]*=r,t[2]*=i,t[6]*=n,t[10]*=r,t[3]*=i,t[7]*=n,t[11]*=r,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],n=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,n))}makeTranslation(e,t,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const i=Math.cos(t),n=Math.sin(t),r=1-i,a=e.x,o=e.y,l=e.z,c=r*a,h=r*o;return this.set(c*a+i,c*o-n*l,c*l+n*o,0,c*o+n*l,h*o+i,h*l-n*a,0,c*l-n*o,h*l+n*a,r*l*l+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,n,r,a){return this.set(1,i,r,0,e,1,a,0,t,n,1,0,0,0,0,1),this}compose(e,t,i){const n=this.elements,r=t._x,a=t._y,o=t._z,l=t._w,c=r+r,h=a+a,f=o+o,u=r*c,d=r*h,m=r*f,v=a*h,p=a*f,g=o*f,y=l*c,E=l*h,M=l*f,b=i.x,S=i.y,w=i.z;return n[0]=(1-(v+g))*b,n[1]=(d+M)*b,n[2]=(m-E)*b,n[3]=0,n[4]=(d-M)*S,n[5]=(1-(u+g))*S,n[6]=(p+y)*S,n[7]=0,n[8]=(m+E)*w,n[9]=(p-y)*w,n[10]=(1-(u+v))*w,n[11]=0,n[12]=e.x,n[13]=e.y,n[14]=e.z,n[15]=1,this}decompose(e,t,i){const n=this.elements;e.x=n[12],e.y=n[13],e.z=n[14];const r=this.determinantAffine();if(r===0)return i.set(1,1,1),t.identity(),this;let a=bs.set(n[0],n[1],n[2]).length();const o=bs.set(n[4],n[5],n[6]).length(),l=bs.set(n[8],n[9],n[10]).length();r<0&&(a=-a),zi.copy(this);const c=1/a,h=1/o,f=1/l;return zi.elements[0]*=c,zi.elements[1]*=c,zi.elements[2]*=c,zi.elements[4]*=h,zi.elements[5]*=h,zi.elements[6]*=h,zi.elements[8]*=f,zi.elements[9]*=f,zi.elements[10]*=f,t.setFromRotationMatrix(zi),i.x=a,i.y=o,i.z=l,this}makePerspective(e,t,i,n,r,a,o=an,l=!1){const c=this.elements,h=2*r/(t-e),f=2*r/(i-n),u=(t+e)/(t-e),d=(i+n)/(i-n);let m,v;if(l)m=r/(a-r),v=a*r/(a-r);else if(o===an)m=-(a+r)/(a-r),v=-2*a*r/(a-r);else if(o===Kr)m=-a/(a-r),v=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=u,c[12]=0,c[1]=0,c[5]=f,c[9]=d,c[13]=0,c[2]=0,c[6]=0,c[10]=m,c[14]=v,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,i,n,r,a,o=an,l=!1){const c=this.elements,h=2/(t-e),f=2/(i-n),u=-(t+e)/(t-e),d=-(i+n)/(i-n);let m,v;if(l)m=1/(a-r),v=a/(a-r);else if(o===an)m=-2/(a-r),v=-(a+r)/(a-r);else if(o===Kr)m=-1/(a-r),v=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=0,c[12]=u,c[1]=0,c[5]=f,c[9]=0,c[13]=d,c[2]=0,c[6]=0,c[10]=m,c[14]=v,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){const t=this.elements,i=e.elements;for(let n=0;n<16;n++)if(t[n]!==i[n])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}};yo.prototype.isMatrix4=!0;let rt=yo;const bs=new L,zi=new rt,om=new L(0,0,0),lm=new L(1,1,1),Nn=new L,ca=new L,Ci=new L,Su=new rt,bu=new un;class Pn{constructor(e=0,t=0,i=0,n=Pn.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=i,this._order=n}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,n=this._order){return this._x=e,this._y=t,this._z=i,this._order=n,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){const n=e.elements,r=n[0],a=n[4],o=n[8],l=n[1],c=n[5],h=n[9],f=n[2],u=n[6],d=n[10];switch(t){case"XYZ":this._y=Math.asin(ft(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,d),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(u,c),this._z=0);break;case"YXZ":this._x=Math.asin(-ft(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,d),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-f,r),this._z=0);break;case"ZXY":this._x=Math.asin(ft(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(-f,d),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-ft(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(u,d),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(ft(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-f,r)):(this._x=0,this._y=Math.atan2(o,d));break;case"XZY":this._z=Math.asin(-ft(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(u,c),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-h,d),this._y=0);break;default:je("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return Su.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Su,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return bu.setFromEuler(this),this.setFromQuaternion(bu,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Pn.DEFAULT_ORDER="XYZ";class Lf{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let cm=0;const Au=new L,As=new un,mn=new rt,ha=new L,pr=new L,hm=new L,um=new un,wu=new L(1,0,0),Eu=new L(0,1,0),Tu=new L(0,0,1),Cu={type:"added"},dm={type:"removed"},ws={type:"childadded",child:null},$o={type:"childremoved",child:null};class Ft extends vs{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:cm++}),this.uuid=ln(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Ft.DEFAULT_UP.clone();const e=new L,t=new Pn,i=new un,n=new L(1,1,1);function r(){i.setFromEuler(t,!1)}function a(){t.setFromQuaternion(i,void 0,!1)}t._onChange(r),i._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:n},modelViewMatrix:{value:new rt},normalMatrix:{value:new it}}),this.matrix=new rt,this.matrixWorld=new rt,this.matrixAutoUpdate=Ft.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Ft.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Lf,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return As.setFromAxisAngle(e,t),this.quaternion.multiply(As),this}rotateOnWorldAxis(e,t){return As.setFromAxisAngle(e,t),this.quaternion.premultiply(As),this}rotateX(e){return this.rotateOnAxis(wu,e)}rotateY(e){return this.rotateOnAxis(Eu,e)}rotateZ(e){return this.rotateOnAxis(Tu,e)}translateOnAxis(e,t){return Au.copy(e).applyQuaternion(this.quaternion),this.position.add(Au.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(wu,e)}translateY(e){return this.translateOnAxis(Eu,e)}translateZ(e){return this.translateOnAxis(Tu,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(mn.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?ha.copy(e):ha.set(e,t,i);const n=this.parent;this.updateWorldMatrix(!0,!1),pr.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?mn.lookAt(pr,ha,this.up):mn.lookAt(ha,pr,this.up),this.quaternion.setFromRotationMatrix(mn),n&&(mn.extractRotation(n.matrixWorld),As.setFromRotationMatrix(mn),this.quaternion.premultiply(As.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(vt("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Cu),ws.child=e,this.dispatchEvent(ws),ws.child=null):vt("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(dm),$o.child=e,this.dispatchEvent($o),$o.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),mn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),mn.multiply(e.parent.matrixWorld)),e.applyMatrix4(mn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Cu),ws.child=e,this.dispatchEvent(ws),ws.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,n=this.children.length;i<n;i++){const a=this.children[i].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,i=[]){this[e]===t&&i.push(this);const n=this.children;for(let r=0,a=n.length;r<a;r++)n[r].getObjectsByProperty(e,t,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(pr,e,hm),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(pr,um,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}intersectsFrustum(){}traverse(e){e(this);const t=this.children;for(let i=0,n=t.length;i<n;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let i=0,n=t.length;i<n;i++)t[i].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);const e=this.pivot;if(e!==null){const t=e.x,i=e.y,n=e.z,r=this.matrix.elements;r[12]+=t-r[0]*t-r[4]*i-r[8]*n,r[13]+=i-r[1]*t-r[5]*i-r[9]*n,r[14]+=n-r[2]*t-r[6]*i-r[10]*n}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let i=0,n=t.length;i<n;i++)t[i].updateMatrixWorld(e)}updateWorldMatrix(e,t,i=!1){const n=this.parent;if(e===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||i)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,i=!0),t===!0){const r=this.children;for(let a=0,o=r.length;a<o;a++)r[a].updateWorldMatrix(!1,!0,i)}}toJSON(e){const t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const n={};n.uuid=this.uuid,n.type=this.type,n.name=this.name,n.castShadow=this.castShadow,n.receiveShadow=this.receiveShadow,n.visible=this.visible,n.frustumCulled=this.frustumCulled,n.renderOrder=this.renderOrder,n.static=this.static,n.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(n.userData=this.userData),n.layers=this.layers.mask,n.matrix=this.matrix.toArray(),n.up=this.up.toArray(),this.pivot!==null&&(n.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(n.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(n.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(n.type="InstancedMesh",n.count=this.count,n.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(n.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(n.type="BatchedMesh",n.perObjectFrustumCulled=this.perObjectFrustumCulled,n.sortObjects=this.sortObjects,n.drawRanges=this._drawRanges,n.reservedRanges=this._reservedRanges,n.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),n.instanceInfo=this._instanceInfo.map(o=>({...o})),n.availableInstanceIds=this._availableInstanceIds.slice(),n.availableGeometryIds=this._availableGeometryIds.slice(),n.nextIndexStart=this._nextIndexStart,n.nextVertexStart=this._nextVertexStart,n.geometryCount=this._geometryCount,n.maxInstanceCount=this._maxInstanceCount,n.maxVertexCount=this._maxVertexCount,n.maxIndexCount=this._maxIndexCount,n.geometryInitialized=this._geometryInitialized,n.matricesTexture=this._matricesTexture.toJSON(e),n.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(n.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(n.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(n.boundingBox=this.boundingBox.toJSON()));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?n.background=this.background.toJSON():this.background.isTexture&&(n.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(n.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){n.geometry=r(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const f=l[c];r(e.shapes,f)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(n.bindMode=this.bindMode,n.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),n.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(r(e.materials,this.material[l]));n.material=o}else n.material=r(e.materials,this.material);if(this.children.length>0){n.children=[];for(let o=0;o<this.children.length;o++)n.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){n.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];n.animations.push(r(e.animations,l))}}if(t){const o=a(e.geometries),l=a(e.materials),c=a(e.textures),h=a(e.images),f=a(e.shapes),u=a(e.skeletons),d=a(e.animations),m=a(e.nodes);o.length>0&&(i.geometries=o),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),h.length>0&&(i.images=h),f.length>0&&(i.shapes=f),u.length>0&&(i.skeletons=u),d.length>0&&(i.animations=d),m.length>0&&(i.nodes=m)}return i.object=n,i;function a(o){const l=[];for(const c in o){const h=o[c];delete h.metadata,l.push(h)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){const n=e.children[i];this.add(n.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}}Ft.DEFAULT_UP=new L(0,1,0);Ft.DEFAULT_MATRIX_AUTO_UPDATE=!0;Ft.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;class lt extends Ft{constructor(){super(),this.isGroup=!0,this.type="Group"}}const fm={type:"move"};class Qo{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new lt,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new lt,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new L,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new L),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new lt,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new L,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new L,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let n=null,r=null,a=null;const o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){a=!0;for(const v of e.hand.values()){const p=t.getJointPose(v,i),g=this._getHandJoint(c,v);p!==null&&(g.matrix.fromArray(p.transform.matrix),g.matrix.decompose(g.position,g.rotation,g.scale),g.matrixWorldNeedsUpdate=!0,g.jointRadius=p.radius),g.visible=p!==null}const h=c.joints["index-finger-tip"],f=c.joints["thumb-tip"],u=h.position.distanceTo(f.position),d=.02,m=.005;c.inputState.pinching&&u>d+m?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&u<=d-m&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,i),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:e,target:this})));o!==null&&(n=t.getPose(e.targetRaySpace,i),n===null&&r!==null&&(n=r),n!==null&&(o.matrix.fromArray(n.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,n.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(n.linearVelocity)):o.hasLinearVelocity=!1,n.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(n.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(fm)))}return o!==null&&(o.visible=n!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const i=new lt;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}}const If={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Bn={h:0,s:0,l:0},ua={h:0,s:0,l:0};function Zo(s,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?s+(e-s)*6*t:t<1/2?e:t<2/3?s+(e-s)*6*(2/3-t):s}class Te{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){const n=e;n&&n.isColor?this.copy(n):typeof n=="number"?this.setHex(n):typeof n=="string"&&this.setStyle(n)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Kt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,gt.colorSpaceToWorking(this,t),this}setRGB(e,t,i,n=gt.workingColorSpace){return this.r=e,this.g=t,this.b=i,gt.colorSpaceToWorking(this,n),this}setHSL(e,t,i,n=gt.workingColorSpace){if(e=em(e,1),t=ft(t,0,1),i=ft(i,0,1),t===0)this.r=this.g=this.b=i;else{const r=i<=.5?i*(1+t):i+t-i*t,a=2*i-r;this.r=Zo(a,r,e+1/3),this.g=Zo(a,r,e),this.b=Zo(a,r,e-1/3)}return gt.colorSpaceToWorking(this,n),this}setStyle(e,t=Kt){function i(r){r!==void 0&&parseFloat(r)<1&&je("Color: Alpha component of "+e+" will be ignored.")}let n;if(n=/^(\w+)\(([^\)]*)\)/.exec(e)){let r;const a=n[1],o=n[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:je("Color: Unknown color model "+e)}}else if(n=/^\#([A-Fa-f\d]+)$/.exec(e)){const r=n[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(r,16),t);je("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Kt){const i=If[e.toLowerCase()];return i!==void 0?this.setHex(i,t):je("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=En(e.r),this.g=En(e.g),this.b=En(e.b),this}copyLinearToSRGB(e){return this.r=Js(e.r),this.g=Js(e.g),this.b=Js(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Kt){return gt.workingToColorSpace(ui.copy(this),e),Math.round(ft(ui.r*255,0,255))*65536+Math.round(ft(ui.g*255,0,255))*256+Math.round(ft(ui.b*255,0,255))}getHexString(e=Kt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=gt.workingColorSpace){gt.workingToColorSpace(ui.copy(this),t);const i=ui.r,n=ui.g,r=ui.b,a=Math.max(i,n,r),o=Math.min(i,n,r);let l,c;const h=(o+a)/2;if(o===a)l=0,c=0;else{const f=a-o;switch(c=h<=.5?f/(a+o):f/(2-a-o),a){case i:l=(n-r)/f+(n<r?6:0);break;case n:l=(r-i)/f+2;break;case r:l=(i-n)/f+4;break}l/=6}return e.h=l,e.s=c,e.l=h,e}getRGB(e,t=gt.workingColorSpace){return gt.workingToColorSpace(ui.copy(this),t),e.r=ui.r,e.g=ui.g,e.b=ui.b,e}getStyle(e=Kt){gt.workingToColorSpace(ui.copy(this),e);const t=ui.r,i=ui.g,n=ui.b;return e!==Kt?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${n.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(i*255)},${Math.round(n*255)})`}offsetHSL(e,t,i){return this.getHSL(Bn),this.setHSL(Bn.h+e,Bn.s+t,Bn.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL(Bn),e.getHSL(ua);const i=Wo(Bn.h,ua.h,t),n=Wo(Bn.s,ua.s,t),r=Wo(Bn.l,ua.l,t);return this.setHSL(i,n,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,i=this.g,n=this.b,r=e.elements;return this.r=r[0]*t+r[3]*i+r[6]*n,this.g=r[1]*t+r[4]*i+r[7]*n,this.b=r[2]*t+r[5]*i+r[8]*n,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const ui=new Te;Te.NAMES=If;class Sh{constructor(e,t=1,i=1e3){this.isFog=!0,this.name="",this.color=new Te(e),this.near=t,this.far=i}clone(){return new Sh(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class _o extends Ft{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Pn,this.environmentIntensity=1,this.environmentRotation=new Pn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),t.object.backgroundBlurriness=this.backgroundBlurriness,t.object.backgroundIntensity=this.backgroundIntensity,t.object.backgroundRotation=this.backgroundRotation.toArray(),t.object.environmentIntensity=this.environmentIntensity,t.object.environmentRotation=this.environmentRotation.toArray(),t}}const Hi=new L,gn=new L,Jo=new L,vn=new L,Es=new L,Ts=new L,Pu=new L,jo=new L,el=new L,tl=new L,il=new Ct,nl=new Ct,sl=new Ct;class Ni{constructor(e=new L,t=new L,i=new L){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,n){n.subVectors(i,t),Hi.subVectors(e,t),n.cross(Hi);const r=n.lengthSq();return r>0?n.multiplyScalar(1/Math.sqrt(r)):n.set(0,0,0)}static getBarycoord(e,t,i,n,r){Hi.subVectors(n,t),gn.subVectors(i,t),Jo.subVectors(e,t);const a=Hi.dot(Hi),o=Hi.dot(gn),l=Hi.dot(Jo),c=gn.dot(gn),h=gn.dot(Jo),f=a*c-o*o;if(f===0)return r.set(0,0,0),null;const u=1/f,d=(c*l-o*h)*u,m=(a*h-o*l)*u;return r.set(1-d-m,m,d)}static containsPoint(e,t,i,n){return this.getBarycoord(e,t,i,n,vn)===null?!1:vn.x>=0&&vn.y>=0&&vn.x+vn.y<=1}static getInterpolation(e,t,i,n,r,a,o,l){return this.getBarycoord(e,t,i,n,vn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,vn.x),l.addScaledVector(a,vn.y),l.addScaledVector(o,vn.z),l)}static getInterpolatedAttribute(e,t,i,n,r,a){return il.setScalar(0),nl.setScalar(0),sl.setScalar(0),il.fromBufferAttribute(e,t),nl.fromBufferAttribute(e,i),sl.fromBufferAttribute(e,n),a.setScalar(0),a.addScaledVector(il,r.x),a.addScaledVector(nl,r.y),a.addScaledVector(sl,r.z),a}static isFrontFacing(e,t,i,n){return Hi.subVectors(i,t),gn.subVectors(e,t),Hi.cross(gn).dot(n)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,n){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[n]),this}setFromAttributeAndIndices(e,t,i,n){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,n),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Hi.subVectors(this.c,this.b),gn.subVectors(this.a,this.b),Hi.cross(gn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return Ni.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return Ni.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,i,n,r){return Ni.getInterpolation(e,this.a,this.b,this.c,t,i,n,r)}containsPoint(e){return Ni.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return Ni.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const i=this.a,n=this.b,r=this.c;let a,o;Es.subVectors(n,i),Ts.subVectors(r,i),jo.subVectors(e,i);const l=Es.dot(jo),c=Ts.dot(jo);if(l<=0&&c<=0)return t.copy(i);el.subVectors(e,n);const h=Es.dot(el),f=Ts.dot(el);if(h>=0&&f<=h)return t.copy(n);const u=l*f-h*c;if(u<=0&&l>=0&&h<=0)return a=l/(l-h),t.copy(i).addScaledVector(Es,a);tl.subVectors(e,r);const d=Es.dot(tl),m=Ts.dot(tl);if(m>=0&&d<=m)return t.copy(r);const v=d*c-l*m;if(v<=0&&c>=0&&m<=0)return o=c/(c-m),t.copy(i).addScaledVector(Ts,o);const p=h*m-d*f;if(p<=0&&f-h>=0&&d-m>=0)return Pu.subVectors(r,n),o=(f-h)/(f-h+(d-m)),t.copy(n).addScaledVector(Pu,o);const g=1/(p+v+u);return a=v*g,o=u*g,t.copy(i).addScaledVector(Es,a).addScaledVector(Ts,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}class Zn{constructor(e=new L(1/0,1/0,1/0),t=new L(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(Gi.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(Gi.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const i=Gi.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const r=i.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,Gi):Gi.fromBufferAttribute(r,a),Gi.applyMatrix4(e.matrixWorld),this.expandByPoint(Gi);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),da.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),da.copy(i.boundingBox)),da.applyMatrix4(e.matrixWorld),this.union(da)}const n=e.children;for(let r=0,a=n.length;r<a;r++)this.expandByObject(n[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Gi),Gi.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(mr),fa.subVectors(this.max,mr),Cs.subVectors(e.a,mr),Ps.subVectors(e.b,mr),Rs.subVectors(e.c,mr),On.subVectors(Ps,Cs),zn.subVectors(Rs,Ps),ts.subVectors(Cs,Rs);let t=[0,-On.z,On.y,0,-zn.z,zn.y,0,-ts.z,ts.y,On.z,0,-On.x,zn.z,0,-zn.x,ts.z,0,-ts.x,-On.y,On.x,0,-zn.y,zn.x,0,-ts.y,ts.x,0];return!rl(t,Cs,Ps,Rs,fa)||(t=[1,0,0,0,1,0,0,0,1],!rl(t,Cs,Ps,Rs,fa))?!1:(pa.crossVectors(On,zn),t=[pa.x,pa.y,pa.z],rl(t,Cs,Ps,Rs,fa))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Gi).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Gi).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(xn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),xn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),xn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),xn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),xn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),xn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),xn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),xn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(xn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const xn=[new L,new L,new L,new L,new L,new L,new L,new L],Gi=new L,da=new Zn,Cs=new L,Ps=new L,Rs=new L,On=new L,zn=new L,ts=new L,mr=new L,fa=new L,pa=new L,is=new L;function rl(s,e,t,i,n){for(let r=0,a=s.length-3;r<=a;r+=3){is.fromArray(s,r);const o=n.x*Math.abs(is.x)+n.y*Math.abs(is.y)+n.z*Math.abs(is.z),l=e.dot(is),c=t.dot(is),h=i.dot(is);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>o)return!1}return!0}const Xt=new L,ma=new le;let pm=0;class ri extends vs{constructor(e,t,i=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:pm++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=Cf,this.updateRanges=[],this.gpuType=Bi,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let n=0,r=this.itemSize;n<r;n++)this.array[e+n]=t.array[i+n];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)ma.fromBufferAttribute(this,t),ma.applyMatrix3(e),this.setXY(t,ma.x,ma.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)Xt.fromBufferAttribute(this,t),Xt.applyMatrix3(e),this.setXYZ(t,Xt.x,Xt.y,Xt.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)Xt.fromBufferAttribute(this,t),Xt.applyMatrix4(e),this.setXYZ(t,Xt.x,Xt.y,Xt.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)Xt.fromBufferAttribute(this,t),Xt.applyNormalMatrix(e),this.setXYZ(t,Xt.x,Xt.y,Xt.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)Xt.fromBufferAttribute(this,t),Xt.transformDirection(e),this.setXYZ(t,Xt.x,Xt.y,Xt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=sn(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=Tt(i,this.array)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=sn(t,this.array)),t}setX(e,t){return this.normalized&&(t=Tt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=sn(t,this.array)),t}setY(e,t){return this.normalized&&(t=Tt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=sn(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Tt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=sn(t,this.array)),t}setW(e,t){return this.normalized&&(t=Tt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=Tt(t,this.array),i=Tt(i,this.array)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,n){return e*=this.itemSize,this.normalized&&(t=Tt(t,this.array),i=Tt(i,this.array),n=Tt(n,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=n,this}setXYZW(e,t,i,n,r){return e*=this.itemSize,this.normalized&&(t=Tt(t,this.array),i=Tt(i,this.array),n=Tt(n,this.array),r=Tt(r,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=n,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return e.name=this.name,e.usage=this.usage,e.gpuType=this.gpuType,e}dispose(){this.dispatchEvent({type:"dispose"})}}class bh extends ri{constructor(e,t,i){super(new Uint16Array(e),t,i)}}class Df extends ri{constructor(e,t,i){super(new Uint32Array(e),t,i)}}class ot extends ri{constructor(e,t,i){super(new Float32Array(e),t,i)}}const mm=new Zn,gr=new L,al=new L;class Jn{constructor(e=new L,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const i=this.center;t!==void 0?i.copy(t):mm.setFromPoints(e).getCenter(i);let n=0;for(let r=0,a=e.length;r<a;r++)n=Math.max(n,i.distanceToSquared(e[r]));return this.radius=Math.sqrt(n),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;gr.subVectors(e,this.center);const t=gr.lengthSq();if(t>this.radius*this.radius){const i=Math.sqrt(t),n=(i-this.radius)*.5;this.center.addScaledVector(gr,n/i),this.radius+=n}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(al.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(gr.copy(e.center).add(al)),this.expandByPoint(gr.copy(e.center).sub(al))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}let gm=0;const Di=new rt,ol=new Ft,Ls=new L,Pi=new Zn,vr=new Zn,ei=new L;class It extends vs{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:gm++}),this.uuid=ln(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Q0(e)?Df:bh)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const r=new it().getNormalMatrix(e);i.applyNormalMatrix(r),i.needsUpdate=!0}const n=this.attributes.tangent;return n!==void 0&&(n.transformDirection(e),n.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return Di.makeRotationFromQuaternion(e),this.applyMatrix4(Di),this}rotateX(e){return Di.makeRotationX(e),this.applyMatrix4(Di),this}rotateY(e){return Di.makeRotationY(e),this.applyMatrix4(Di),this}rotateZ(e){return Di.makeRotationZ(e),this.applyMatrix4(Di),this}translate(e,t,i){return Di.makeTranslation(e,t,i),this.applyMatrix4(Di),this}scale(e,t,i){return Di.makeScale(e,t,i),this.applyMatrix4(Di),this}lookAt(e){return ol.lookAt(e),ol.updateMatrix(),this.applyMatrix4(ol.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Ls).negate(),this.translate(Ls.x,Ls.y,Ls.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const i=[];for(let n=0,r=e.length;n<r;n++){const a=e[n];i.push(a.x,a.y,a.z||0)}this.setAttribute("position",new ot(i,3))}else{const i=Math.min(e.length,t.count);for(let n=0;n<i;n++){const r=e[n];t.setXYZ(n,r.x,r.y,r.z||0)}e.length>t.count&&je("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Zn);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){vt("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new L(-1/0,-1/0,-1/0),new L(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,n=t.length;i<n;i++){const r=t[i];Pi.setFromBufferAttribute(r),this.morphTargetsRelative?(ei.addVectors(this.boundingBox.min,Pi.min),this.boundingBox.expandByPoint(ei),ei.addVectors(this.boundingBox.max,Pi.max),this.boundingBox.expandByPoint(ei)):(this.boundingBox.expandByPoint(Pi.min),this.boundingBox.expandByPoint(Pi.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&vt('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Jn);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){vt("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new L,1/0);return}if(e){const i=this.boundingSphere.center;if(Pi.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){const o=t[r];vr.setFromBufferAttribute(o),this.morphTargetsRelative?(ei.addVectors(Pi.min,vr.min),Pi.expandByPoint(ei),ei.addVectors(Pi.max,vr.max),Pi.expandByPoint(ei)):(Pi.expandByPoint(vr.min),Pi.expandByPoint(vr.max))}Pi.getCenter(i);let n=0;for(let r=0,a=e.count;r<a;r++)ei.fromBufferAttribute(e,r),n=Math.max(n,i.distanceToSquared(ei));if(t)for(let r=0,a=t.length;r<a;r++){const o=t[r],l=this.morphTargetsRelative;for(let c=0,h=o.count;c<h;c++)ei.fromBufferAttribute(o,c),l&&(Ls.fromBufferAttribute(e,c),ei.add(Ls)),n=Math.max(n,i.distanceToSquared(ei))}this.boundingSphere.radius=Math.sqrt(n),isNaN(this.boundingSphere.radius)&&vt('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){vt("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=t.position,n=t.normal,r=t.uv;let a=this.getAttribute("tangent");(a===void 0||a.count!==i.count)&&(a=new ri(new Float32Array(4*i.count),4),this.setAttribute("tangent",a));const o=[],l=[];for(let x=0;x<i.count;x++)o[x]=new L,l[x]=new L;const c=new L,h=new L,f=new L,u=new le,d=new le,m=new le,v=new L,p=new L;function g(x,A,C){c.fromBufferAttribute(i,x),h.fromBufferAttribute(i,A),f.fromBufferAttribute(i,C),u.fromBufferAttribute(r,x),d.fromBufferAttribute(r,A),m.fromBufferAttribute(r,C),h.sub(c),f.sub(c),d.sub(u),m.sub(u);const R=1/(d.x*m.y-m.x*d.y);isFinite(R)&&(v.copy(h).multiplyScalar(m.y).addScaledVector(f,-d.y).multiplyScalar(R),p.copy(f).multiplyScalar(d.x).addScaledVector(h,-m.x).multiplyScalar(R),o[x].add(v),o[A].add(v),o[C].add(v),l[x].add(p),l[A].add(p),l[C].add(p))}let y=this.groups;y.length===0&&(y=[{start:0,count:e.count}]);for(let x=0,A=y.length;x<A;++x){const C=y[x],R=C.start,D=C.count;for(let B=R,k=R+D;B<k;B+=3)g(e.getX(B+0),e.getX(B+1),e.getX(B+2))}const E=new L,M=new L,b=new L,S=new L;function w(x){b.fromBufferAttribute(n,x),S.copy(b);const A=o[x];E.copy(A),E.sub(b.multiplyScalar(b.dot(A))).normalize(),M.crossVectors(S,A);const R=M.dot(l[x])<0?-1:1;a.setXYZW(x,E.x,E.y,E.z,R)}for(let x=0,A=y.length;x<A;++x){const C=y[x],R=C.start,D=C.count;for(let B=R,k=R+D;B<k;B+=3)w(e.getX(B+0)),w(e.getX(B+1)),w(e.getX(B+2))}this._transformed=!0}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0||i.count!==t.count)i=new ri(new Float32Array(t.count*3),3),this.setAttribute("normal",i);else for(let u=0,d=i.count;u<d;u++)i.setXYZ(u,0,0,0);const n=new L,r=new L,a=new L,o=new L,l=new L,c=new L,h=new L,f=new L;if(e)for(let u=0,d=e.count;u<d;u+=3){const m=e.getX(u+0),v=e.getX(u+1),p=e.getX(u+2);n.fromBufferAttribute(t,m),r.fromBufferAttribute(t,v),a.fromBufferAttribute(t,p),h.subVectors(a,r),f.subVectors(n,r),h.cross(f),o.fromBufferAttribute(i,m),l.fromBufferAttribute(i,v),c.fromBufferAttribute(i,p),o.add(h),l.add(h),c.add(h),i.setXYZ(m,o.x,o.y,o.z),i.setXYZ(v,l.x,l.y,l.z),i.setXYZ(p,c.x,c.y,c.z)}else for(let u=0,d=t.count;u<d;u+=3)n.fromBufferAttribute(t,u+0),r.fromBufferAttribute(t,u+1),a.fromBufferAttribute(t,u+2),h.subVectors(a,r),f.subVectors(n,r),h.cross(f),i.setXYZ(u+0,h.x,h.y,h.z),i.setXYZ(u+1,h.x,h.y,h.z),i.setXYZ(u+2,h.x,h.y,h.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)ei.fromBufferAttribute(e,t),ei.normalize(),e.setXYZ(t,ei.x,ei.y,ei.z)}toNonIndexed(){function e(o,l){const c=o.array,h=o.itemSize,f=o.normalized,u=new c.constructor(l.length*h);let d=0,m=0;for(let v=0,p=l.length;v<p;v++){o.isInterleavedBufferAttribute?d=l[v]*o.data.stride+o.offset:d=l[v]*h;for(let g=0;g<h;g++)u[m++]=c[d++]}return new ri(u,h,f)}if(this.index===null)return je("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new It,i=this.index.array,n=this.attributes;for(const o in n){const l=n[o],c=e(l,i);t.setAttribute(o,c)}const r=this.morphAttributes;for(const o in r){const l=[],c=r[o];for(let h=0,f=c.length;h<f;h++){const u=c[h],d=e(u,i);l.push(d)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,e.name=this.name,Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const i=this.attributes;for(const l in i){const c=i[l];e.data.attributes[l]=c.toJSON(e.data)}const n={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let f=0,u=c.length;f<u;f++){const d=c[f];h.push(d.toJSON(e.data))}h.length>0&&(n[l]=h,r=!0)}r&&(e.data.morphAttributes=n,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone());const n=e.attributes;for(const c in n){const h=n[c];this.setAttribute(c,h.clone(t))}const r=e.morphAttributes;for(const c in r){const h=[],f=r[c];for(let u=0,d=f.length;u<d;u++)h.push(f[u].clone(t));this.morphAttributes[c]=h}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let c=0,h=a.length;c<h;c++){const f=a[c];this.addGroup(f.start,f.count,f.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}}class vm{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=Cf,this.updateRanges=[],this.version=0,this.uuid=ln()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,i){e*=this.stride,i*=t.stride;for(let n=0,r=this.stride;n<r;n++)this.array[e+n]=t.array[i+n];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=ln()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),i=new this.constructor(t,this.stride);return i.setUsage(this.usage),i}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=ln()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer)));const t={uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride};return t.usage=this.usage,t}}const mi=new L;class uo{constructor(e,t,i,n=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=i,this.normalized=n}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,i=this.data.count;t<i;t++)mi.fromBufferAttribute(this,t),mi.applyMatrix4(e),this.setXYZ(t,mi.x,mi.y,mi.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)mi.fromBufferAttribute(this,t),mi.applyNormalMatrix(e),this.setXYZ(t,mi.x,mi.y,mi.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)mi.fromBufferAttribute(this,t),mi.transformDirection(e),this.setXYZ(t,mi.x,mi.y,mi.z);return this}getComponent(e,t){let i=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(i=sn(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=Tt(i,this.array)),this.data.array[e*this.data.stride+this.offset+t]=i,this}setX(e,t){return this.normalized&&(t=Tt(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=Tt(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=Tt(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=Tt(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=sn(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=sn(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=sn(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=sn(t,this.array)),t}setXY(e,t,i){return e=e*this.data.stride+this.offset,this.normalized&&(t=Tt(t,this.array),i=Tt(i,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=i,this}setXYZ(e,t,i,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=Tt(t,this.array),i=Tt(i,this.array),n=Tt(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=i,this.data.array[e+2]=n,this}setXYZW(e,t,i,n,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=Tt(t,this.array),i=Tt(i,this.array),n=Tt(n,this.array),r=Tt(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=i,this.data.array[e+2]=n,this.data.array[e+3]=r,this}clone(e){if(e===void 0){ho("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let i=0;i<this.count;i++){const n=i*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[n+r])}return new ri(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new uo(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){ho("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let i=0;i<this.count;i++){const n=i*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[n+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}const ll=new L,xm=new L,ym=new it;class qn{constructor(e=new L(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,n){return this.normal.set(e,t,i),this.constant=n,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){const n=ll.subVectors(i,t).cross(xm.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(n,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,i=!0){const n=e.delta(ll),r=this.normal.dot(n);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const a=-(e.start.dot(this.normal)+this.constant)/r;return i===!0&&(a<0||a>1)?null:t.copy(e.start).addScaledVector(n,a)}intersectsLine(e){const t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const i=t||ym.getNormalMatrix(e),n=this.coplanarPoint(ll).applyMatrix4(e),r=this.normal.applyMatrix3(i).normalize();return this.constant=-n.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(e){return this.normal.fromArray(e.normal),this.constant=e.constant,this}}let Mm=0;class Dn extends vs{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Mm++}),this.uuid=ln(),this.name="",this.type="Material",this.blending=Nr,this.side=fs,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=yf,this.blendDst=Mf,this.blendEquation=nn,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Te(0,0,0),this.blendAlpha=0,this.depthFunc=Wr,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=V0,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Go,this.stencilZFail=Go,this.stencilZPass=Go,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const i=e[t];if(i===void 0){je(`Material: parameter '${t}' has value of undefined.`);continue}const n=this[t];if(n===void 0){je(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}n&&n.isColor?n.set(i):n&&n.isVector2&&i&&i.isVector2||n&&n.isEuler&&i&&i.isEuler||n&&n.isVector3&&i&&i.isVector3?n.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,i.blending=this.blending,i.side=this.side,i.shadowSide=this.shadowSide,i.vertexColors=this.vertexColors,i.opacity=this.opacity,i.transparent=this.transparent,i.blendSrc=this.blendSrc,i.blendDst=this.blendDst,i.blendEquation=this.blendEquation,i.blendSrcAlpha=this.blendSrcAlpha,i.blendDstAlpha=this.blendDstAlpha,i.blendEquationAlpha=this.blendEquationAlpha,i.blendColor=this.blendColor.getHex(),i.blendAlpha=this.blendAlpha,i.depthFunc=this.depthFunc,i.depthTest=this.depthTest,i.depthWrite=this.depthWrite,i.colorWrite=this.colorWrite,i.clipIntersection=this.clipIntersection,i.clipShadows=this.clipShadows,i.stencilWriteMask=this.stencilWriteMask,i.stencilFunc=this.stencilFunc,i.stencilRef=this.stencilRef,i.stencilFuncMask=this.stencilFuncMask,i.stencilFail=this.stencilFail,i.stencilZFail=this.stencilZFail,i.stencilZPass=this.stencilZPass,i.stencilWrite=this.stencilWrite,i.polygonOffset=this.polygonOffset,i.polygonOffsetFactor=this.polygonOffsetFactor,i.polygonOffsetUnits=this.polygonOffsetUnits,i.dithering=this.dithering,i.alphaTest=this.alphaTest,i.alphaHash=this.alphaHash,i.alphaToCoverage=this.alphaToCoverage,i.premultipliedAlpha=this.premultipliedAlpha,i.forceSinglePass=this.forceSinglePass,i.allowOverride=this.allowOverride,i.visible=this.visible,i.toneMapped=this.toneMapped,i.name=this.name,this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(i.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(i.clippingPlanes=this.clippingPlanes.map(r=>r.toJSON())),this.rotation!==void 0&&(i.rotation=this.rotation),this.depthPacking!==void 0&&(i.depthPacking=this.depthPacking),this.linewidth!==void 0&&(i.linewidth=this.linewidth),this.linecap!==void 0&&(i.linecap=this.linecap),this.linejoin!==void 0&&(i.linejoin=this.linejoin),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.wireframe!==void 0&&(i.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(i.flatShading=this.flatShading),this.fog!==void 0&&(i.fog=this.fog),Object.keys(this.userData).length>0&&(i.userData=this.userData);function n(r){const a=[];for(const o in r){const l=r[o];delete l.metadata,a.push(l)}return a}if(t){const r=n(e.textures),a=n(e.images);r.length>0&&(i.textures=r),a.length>0&&(i.images=a)}return i}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new Te().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.retroreflectivity!==void 0&&(this.retroreflectivity=e.retroreflectivity),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=e.iridescenceThicknessRange),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.clippingPlanes!==void 0&&(this.clippingPlanes=e.clippingPlanes.map(i=>new qn().fromJSON(i))),e.clipIntersection!==void 0&&(this.clipIntersection=e.clipIntersection),e.clipShadows!==void 0&&(this.clipShadows=e.clipShadows),e.depthPacking!==void 0&&(this.depthPacking=e.depthPacking),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.linecap!==void 0&&(this.linecap=e.linecap),e.linejoin!==void 0&&(this.linejoin=e.linejoin),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(typeof e.vertexColors=="number"?this.vertexColors=e.vertexColors>0:this.vertexColors=e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let i=e.normalScale;Array.isArray(i)===!1&&(i=[i,i]),this.normalScale=new le().fromArray(i)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new le().fromArray(e.clearcoatNormalScale)),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let i=null;if(t!==null){const n=t.length;i=new Array(n);for(let r=0;r!==n;++r)i[r]=t[r].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class Ah extends Dn{constructor(e){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new Te(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}let Is;const xr=new L,Ds=new L,ks=new L,Us=new le,yr=new le,kf=new rt,ga=new L,Mr=new L,va=new L,Ru=new le,cl=new le,Lu=new le;class Uf extends Ft{constructor(e=new Ah){if(super(),this.isSprite=!0,this.type="Sprite",Is===void 0){Is=new It;const t=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),i=new vm(t,5);Is.setIndex([0,1,2,0,2,3]),Is.setAttribute("position",new uo(i,3,0,!1)),Is.setAttribute("uv",new uo(i,2,3,!1))}this.geometry=Is,this.material=e,this.center=new le(.5,.5),this.count=1}intersectsFrustum(e){return e.intersectsSprite(this)}raycast(e,t){e.camera===null&&vt('Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),Ds.setFromMatrixScale(this.matrixWorld),kf.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),ks.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&Ds.multiplyScalar(-ks.z);const i=this.material.rotation;let n,r;i!==0&&(r=Math.cos(i),n=Math.sin(i));const a=this.center;xa(ga.set(-.5,-.5,0),ks,a,Ds,n,r),xa(Mr.set(.5,-.5,0),ks,a,Ds,n,r),xa(va.set(.5,.5,0),ks,a,Ds,n,r),Ru.set(0,0),cl.set(1,0),Lu.set(1,1);let o=e.ray.intersectTriangle(ga,Mr,va,!1,xr);if(o===null&&(xa(Mr.set(-.5,.5,0),ks,a,Ds,n,r),cl.set(0,1),o=e.ray.intersectTriangle(ga,va,Mr,!1,xr),o===null))return;const l=e.ray.origin.distanceTo(xr);l<e.near||l>e.far||t.push({distance:l,point:xr.clone(),uv:Ni.getInterpolation(xr,ga,Mr,va,Ru,cl,Lu,new le),face:null,object:this})}copy(e,t){return super.copy(e,t),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}}function xa(s,e,t,i,n,r){Us.subVectors(s,t).addScalar(.5).multiply(i),n!==void 0?(yr.x=r*Us.x-n*Us.y,yr.y=n*Us.x+r*Us.y):yr.copy(Us),s.copy(e),s.x+=yr.x,s.y+=yr.y,s.applyMatrix4(kf)}const yn=new L,hl=new L,ya=new L,Ma=new L;class wh{constructor(e=new L,t=new L(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,yn)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=yn.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(yn.copy(this.origin).addScaledVector(this.direction,t),yn.distanceToSquared(e))}distanceSqToSegment(e,t,i,n){hl.copy(e).add(t).multiplyScalar(.5),ya.copy(t).sub(e).normalize(),Ma.copy(this.origin).sub(hl);const r=e.distanceTo(t)*.5,a=-this.direction.dot(ya),o=Ma.dot(this.direction),l=-Ma.dot(ya),c=Ma.lengthSq(),h=Math.abs(1-a*a);let f,u,d,m;if(h>0)if(f=a*l-o,u=a*o-l,m=r*h,f>=0)if(u>=-m)if(u<=m){const v=1/h;f*=v,u*=v,d=f*(f+a*u+2*o)+u*(a*f+u+2*l)+c}else u=r,f=Math.max(0,-(a*u+o)),d=-f*f+u*(u+2*l)+c;else u=-r,f=Math.max(0,-(a*u+o)),d=-f*f+u*(u+2*l)+c;else u<=-m?(f=Math.max(0,-(-a*r+o)),u=f>0?-r:Math.min(Math.max(-r,-l),r),d=-f*f+u*(u+2*l)+c):u<=m?(f=0,u=Math.min(Math.max(-r,-l),r),d=u*(u+2*l)+c):(f=Math.max(0,-(a*r+o)),u=f>0?r:Math.min(Math.max(-r,-l),r),d=-f*f+u*(u+2*l)+c);else u=a>0?-r:r,f=Math.max(0,-(a*u+o)),d=-f*f+u*(u+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,f),n&&n.copy(hl).addScaledVector(ya,u),d}intersectSphere(e,t){if(e.radius<0)return null;yn.subVectors(e.center,this.origin);const i=yn.dot(this.direction),n=yn.dot(yn)-i*i,r=e.radius*e.radius;if(n>r)return null;const a=Math.sqrt(r-n),o=i-a,l=i+a;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){const i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,n,r,a,o,l;const c=1/this.direction.x,h=1/this.direction.y,f=1/this.direction.z,u=this.origin;return c>=0?(i=(e.min.x-u.x)*c,n=(e.max.x-u.x)*c):(i=(e.max.x-u.x)*c,n=(e.min.x-u.x)*c),h>=0?(r=(e.min.y-u.y)*h,a=(e.max.y-u.y)*h):(r=(e.max.y-u.y)*h,a=(e.min.y-u.y)*h),i>a||r>n||((r>i||isNaN(i))&&(i=r),(a<n||isNaN(n))&&(n=a),f>=0?(o=(e.min.z-u.z)*f,l=(e.max.z-u.z)*f):(o=(e.max.z-u.z)*f,l=(e.min.z-u.z)*f),i>l||o>n)||((o>i||i!==i)&&(i=o),(l<n||n!==n)&&(n=l),n<0)?null:this.at(i>=0?i:n,t)}intersectsBox(e){return this.intersectBox(e,yn)!==null}intersectTriangle(e,t,i,n,r){const a=this.origin,o=this.direction,l=o.x,c=o.y,h=o.z,f=e.x-a.x,u=e.y-a.y,d=e.z-a.z,m=t.x-a.x,v=t.y-a.y,p=t.z-a.z,g=i.x-a.x,y=i.y-a.y,E=i.z-a.z,M=Math.abs(l),b=Math.abs(c),S=Math.abs(h);let w,x,A,C,R,D,B,k,N,G,H,se;if(M>=b&&M>=S?(A=l,D=f,N=m,se=g,l>=0?(w=c,x=h,C=u,R=d,B=v,k=p,G=y,H=E):(w=h,x=c,C=d,R=u,B=p,k=v,G=E,H=y)):b>=S?(A=c,D=u,N=v,se=y,c>=0?(w=h,x=l,C=d,R=f,B=p,k=m,G=E,H=g):(w=l,x=h,C=f,R=d,B=m,k=p,G=g,H=E)):(A=h,D=d,N=p,se=E,h>=0?(w=l,x=c,C=f,R=u,B=m,k=v,G=g,H=y):(w=c,x=l,C=u,R=f,B=v,k=m,G=y,H=g)),A===0)return null;const V=w/A,j=x/A,J=1/A,we=C-V*D,ce=R-j*D,ct=B-V*N,tt=k-j*N,Je=G-V*se,q=H-j*se,te=Je*tt-q*ct,ee=we*q-ce*Je,be=ct*ce-tt*we;if(n){if(te<0||ee<0||be<0)return null}else if((te<0||ee<0||be<0)&&(te>0||ee>0||be>0))return null;const Me=te+ee+be;if(Me===0)return null;const Ie=J*(te*D+ee*N+be*se);return(Me>0?Ie<0:Ie>0)?null:this.at(Ie/Me,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class _i extends Dn{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Te(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Pn,this.combine=rh,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const Iu=new rt,ns=new wh,_a=new Jn,Du=new L,Sa=new L,ba=new L,Aa=new L,ul=new L,wa=new L,ku=new L,Ea=new L;class Ge extends Ft{constructor(e=new It,t=new _i){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const n=t[i[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=n.length;r<a;r++){const o=n[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(e,t){const i=this.geometry,n=i.attributes.position,r=i.morphAttributes.position,a=i.morphTargetsRelative;t.fromBufferAttribute(n,e);const o=this.morphTargetInfluences;if(r&&o){wa.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const h=o[l],f=r[l];h!==0&&(ul.fromBufferAttribute(f,e),a?wa.addScaledVector(ul,h):wa.addScaledVector(ul.sub(t),h))}t.add(wa)}return t}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){const i=this.geometry,n=this.material,r=this.matrixWorld;n!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),_a.copy(i.boundingSphere),_a.applyMatrix4(r),ns.copy(e.ray).recast(e.near),!(_a.containsPoint(ns.origin)===!1&&(ns.intersectSphere(_a,Du)===null||ns.origin.distanceToSquared(Du)>(e.far-e.near)**2))&&(Iu.copy(r).invert(),ns.copy(e.ray).applyMatrix4(Iu),!(i.boundingBox!==null&&ns.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,t,ns)))}_computeIntersections(e,t,i){let n;const r=this.geometry,a=this.material,o=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,f=r.attributes.normal,u=r.groups,d=r.drawRange;if(o!==null)if(Array.isArray(a))for(let m=0,v=u.length;m<v;m++){const p=u[m],g=a[p.materialIndex],y=Math.max(p.start,d.start),E=Math.min(o.count,Math.min(p.start+p.count,d.start+d.count));for(let M=y,b=E;M<b;M+=3){const S=o.getX(M),w=o.getX(M+1),x=o.getX(M+2);n=Ta(this,g,e,i,c,h,f,S,w,x),n&&(n.faceIndex=Math.floor(M/3),n.face.materialIndex=p.materialIndex,t.push(n))}}else{const m=Math.max(0,d.start),v=Math.min(o.count,d.start+d.count);for(let p=m,g=v;p<g;p+=3){const y=o.getX(p),E=o.getX(p+1),M=o.getX(p+2);n=Ta(this,a,e,i,c,h,f,y,E,M),n&&(n.faceIndex=Math.floor(p/3),t.push(n))}}else if(l!==void 0)if(Array.isArray(a))for(let m=0,v=u.length;m<v;m++){const p=u[m],g=a[p.materialIndex],y=Math.max(p.start,d.start),E=Math.min(l.count,Math.min(p.start+p.count,d.start+d.count));for(let M=y,b=E;M<b;M+=3){const S=M,w=M+1,x=M+2;n=Ta(this,g,e,i,c,h,f,S,w,x),n&&(n.faceIndex=Math.floor(M/3),n.face.materialIndex=p.materialIndex,t.push(n))}}else{const m=Math.max(0,d.start),v=Math.min(l.count,d.start+d.count);for(let p=m,g=v;p<g;p+=3){const y=p,E=p+1,M=p+2;n=Ta(this,a,e,i,c,h,f,y,E,M),n&&(n.faceIndex=Math.floor(p/3),t.push(n))}}}}function _m(s,e,t,i,n,r,a,o){let l;if(e.side===Zt?l=i.intersectTriangle(a,r,n,!0,o):l=i.intersectTriangle(n,r,a,e.side===fs,o),l===null)return null;Ea.copy(o),Ea.applyMatrix4(s.matrixWorld);const c=t.ray.origin.distanceTo(Ea);return c<t.near||c>t.far?null:{distance:c,point:Ea.clone(),object:s}}function Ta(s,e,t,i,n,r,a,o,l,c){s.getVertexPosition(o,Sa),s.getVertexPosition(l,ba),s.getVertexPosition(c,Aa);const h=_m(s,e,t,i,Sa,ba,Aa,ku);if(h){const f=new L;Ni.getBarycoord(ku,Sa,ba,Aa,f),n&&(h.uv=Ni.getInterpolatedAttribute(n,o,l,c,f,new le)),r&&(h.uv1=Ni.getInterpolatedAttribute(r,o,l,c,f,new le)),a&&(h.normal=Ni.getInterpolatedAttribute(a,o,l,c,f,new L),h.normal.dot(i.direction)>0&&h.normal.multiplyScalar(-1));const u={a:o,b:l,c,normal:new L,materialIndex:0};Ni.getNormal(Sa,ba,Aa,u.normal),h.face=u,h.barycoord=f}return h}const _r=new Ct,Uu=new Ct,Fu=new Ct,Sm=new Ct,Nu=new rt,Ca=new L,dl=new Jn,Bu=new rt,fl=new wh;class bm extends Ge{constructor(e,t){super(e,t),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=mu,this.bindMatrix=new rt,this.bindMatrixInverse=new rt,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){const e=this.geometry;this.boundingBox===null&&(this.boundingBox=new Zn),this.boundingBox.makeEmpty();const t=e.getAttribute("position");for(let i=0;i<t.count;i++)this.getVertexPosition(i,Ca),this.boundingBox.expandByPoint(Ca)}computeBoundingSphere(){const e=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new Jn),this.boundingSphere.makeEmpty();const t=e.getAttribute("position");for(let i=0;i<t.count;i++)this.getVertexPosition(i,Ca),this.boundingSphere.expandByPoint(Ca)}copy(e,t){return super.copy(e,t),this.bindMode=e.bindMode,this.bindMatrix.copy(e.bindMatrix),this.bindMatrixInverse.copy(e.bindMatrixInverse),this.skeleton=e.skeleton,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}raycast(e,t){const i=this.material,n=this.matrixWorld;i!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),dl.copy(this.boundingSphere),dl.applyMatrix4(n),e.ray.intersectsSphere(dl)!==!1&&(Bu.copy(n).invert(),fl.copy(e.ray).applyMatrix4(Bu),!(this.boundingBox!==null&&fl.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(e,t,fl)))}getVertexPosition(e,t){return super.getVertexPosition(e,t),this.applyBoneTransform(e,t),t}bind(e,t){this.skeleton=e,t===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),t=this.matrixWorld),this.bindMatrix.copy(t),this.bindMatrixInverse.copy(t).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){const e=new Ct,t=this.geometry.attributes.skinWeight;for(let i=0,n=t.count;i<n;i++){e.fromBufferAttribute(t,i);const r=1/e.manhattanLength();r!==1/0?e.multiplyScalar(r):e.set(1,0,0,0),t.setXYZW(i,e.x,e.y,e.z,e.w)}}updateMatrixWorld(e){super.updateMatrixWorld(e),this.bindMode===mu?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===O0?this.bindMatrixInverse.copy(this.bindMatrix).invert():je("SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(e,t){const i=this.skeleton,n=this.geometry;Uu.fromBufferAttribute(n.attributes.skinIndex,e),Fu.fromBufferAttribute(n.attributes.skinWeight,e),t.isVector4?(_r.copy(t),t.set(0,0,0,0)):(_r.set(...t,1),t.set(0,0,0)),_r.applyMatrix4(this.bindMatrix);for(let r=0;r<4;r++){const a=Fu.getComponent(r);if(a!==0){const o=Uu.getComponent(r);Nu.multiplyMatrices(i.bones[o].matrixWorld,i.boneInverses[o]),t.addScaledVector(Sm.copy(_r).applyMatrix4(Nu),a)}}return t.isVector4&&(t.w=_r.w),t.applyMatrix4(this.bindMatrixInverse)}}class Ff extends Ft{constructor(){super(),this.isBone=!0,this.type="Bone"}}class ea extends fi{constructor(e=null,t=1,i=1,n,r,a,o,l,c=Qt,h=Qt,f,u){super(null,a,o,l,c,h,n,r,f,u),this.isDataTexture=!0,this.image={data:e,width:t,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const Ou=new rt,Am=new rt;class Eh{constructor(e=[],t=[]){this.uuid=ln(),this.bones=e.slice(0),this.boneInverses=t,this.boneMatrices=null,this.boneTexture=null,this.init()}init(){const e=this.bones,t=this.boneInverses;if(this.boneMatrices=new Float32Array(e.length*16),t.length===0)this.calculateInverses();else if(e.length!==t.length){je("Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let i=0,n=this.bones.length;i<n;i++)this.boneInverses.push(new rt)}}calculateInverses(){this.boneInverses.length=0;for(let e=0,t=this.bones.length;e<t;e++){const i=new rt;this.bones[e]&&i.copy(this.bones[e].matrixWorld).invert(),this.boneInverses.push(i)}}pose(){for(let e=0,t=this.bones.length;e<t;e++){const i=this.bones[e];i&&i.matrixWorld.copy(this.boneInverses[e]).invert()}for(let e=0,t=this.bones.length;e<t;e++){const i=this.bones[e];i&&(i.parent&&i.parent.isBone?(i.matrix.copy(i.parent.matrixWorld).invert(),i.matrix.multiply(i.matrixWorld)):i.matrix.copy(i.matrixWorld),i.matrix.decompose(i.position,i.quaternion,i.scale))}}update(){const e=this.bones,t=this.boneInverses,i=this.boneMatrices,n=this.boneTexture;for(let r=0,a=e.length;r<a;r++){const o=e[r]?e[r].matrixWorld:Am;Ou.multiplyMatrices(o,t[r]),Ou.toArray(i,r*16)}n!==null&&(n.needsUpdate=!0)}clone(){return new Eh(this.bones,this.boneInverses)}computeBoneTexture(){let e=Math.sqrt(this.bones.length*4);e=Math.ceil(e/4)*4,e=Math.max(e,4);const t=new Float32Array(e*e*4);t.set(this.boneMatrices);const i=new ea(t,e,e,Li,Bi);return i.needsUpdate=!0,this.boneMatrices=t,this.boneTexture=i,this}getBoneByName(e){for(let t=0,i=this.bones.length;t<i;t++){const n=this.bones[t];if(n.name===e)return n}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null)}fromJSON(e,t){this.uuid=e.uuid;for(let i=0,n=e.bones.length;i<n;i++){const r=e.bones[i];let a=t[r];a===void 0&&(je("Skeleton: No bone found with UUID:",r),a=new Ff),this.bones.push(a),this.boneInverses.push(new rt().fromArray(e.boneInverses[i]))}return this.init(),this}toJSON(){const e={metadata:{version:4.7,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};e.uuid=this.uuid;const t=this.bones,i=this.boneInverses;for(let n=0,r=t.length;n<r;n++){const a=t[n];e.bones.push(a.uuid);const o=i[n];e.boneInverses.push(o.toArray())}return e}}class zu extends ri{constructor(e,t,i,n=1){super(e,t,i),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=n}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){const e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}}const Fs=new rt,Hu=new rt,Pa=[],Gu=new Zn,wm=new rt,Sr=new Ge,br=new Jn;class nr extends Ge{constructor(e,t,i){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new zu(new Float32Array(i*16),16),this.instanceColor=null,this.morphTexture=null,this.count=i,this.boundingBox=null,this.boundingSphere=null;for(let n=0;n<i;n++)this.setMatrixAt(n,wm)}computeBoundingBox(){const e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new Zn),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let i=0;i<t;i++)this.getMatrixAt(i,Fs),Gu.copy(e.boundingBox).applyMatrix4(Fs),this.boundingBox.union(Gu)}computeBoundingSphere(){const e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new Jn),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let i=0;i<t;i++)this.getMatrixAt(i,Fs),br.copy(e.boundingSphere).applyMatrix4(Fs),this.boundingSphere.union(br)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){return this.instanceColor===null?t.setRGB(1,1,1):t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){return t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){const i=t.morphTargetInfluences,n=this.morphTexture.source.data.data,r=i.length+1,a=e*r+1;for(let o=0;o<i.length;o++)i[o]=n[a+o]}raycast(e,t){const i=this.matrixWorld,n=this.count;if(Sr.geometry=this.geometry,Sr.material=this.material,Sr.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),br.copy(this.boundingSphere),br.applyMatrix4(i),e.ray.intersectsSphere(br)!==!1))for(let r=0;r<n;r++){this.getMatrixAt(r,Fs),Hu.multiplyMatrices(i,Fs),Sr.matrixWorld=Hu,Sr.raycast(e,Pa);for(let a=0,o=Pa.length;a<o;a++){const l=Pa[a];l.instanceId=r,l.object=this,t.push(l)}Pa.length=0}}setColorAt(e,t){return this.instanceColor===null&&(this.instanceColor=new zu(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3),this}setMatrixAt(e,t){return t.toArray(this.instanceMatrix.array,e*16),this}setMorphAt(e,t){const i=t.morphTargetInfluences,n=i.length+1;this.morphTexture===null&&(this.morphTexture=new ea(new Float32Array(n*this.count),n,this.count,mh,Bi));const r=this.morphTexture.source.data.data;let a=0;for(let c=0;c<i.length;c++)a+=i[c];const o=this.geometry.morphTargetsRelative?1:1-a,l=n*e;return r[l]=o,r.set(i,l+1),this}updateMorphTargets(){}dispose(){super.dispose(),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}}const ss=new Jn,Em=new le(.5,.5),Ra=new L;class Th{constructor(e=new qn,t=new qn,i=new qn,n=new qn,r=new qn,a=new qn){this.planes=[e,t,i,n,r,a]}set(e,t,i,n,r,a){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(i),o[3].copy(n),o[4].copy(r),o[5].copy(a),this}copy(e){const t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=an,i=!1){const n=this.planes,r=e.elements,a=r[0],o=r[1],l=r[2],c=r[3],h=r[4],f=r[5],u=r[6],d=r[7],m=r[8],v=r[9],p=r[10],g=r[11],y=r[12],E=r[13],M=r[14],b=r[15];if(n[0].setComponents(c-a,d-h,g-m,b-y).normalize(),n[1].setComponents(c+a,d+h,g+m,b+y).normalize(),n[2].setComponents(c+o,d+f,g+v,b+E).normalize(),n[3].setComponents(c-o,d-f,g-v,b-E).normalize(),i)n[4].setComponents(l,u,p,M).normalize(),n[5].setComponents(c-l,d-u,g-p,b-M).normalize();else if(n[4].setComponents(c-l,d-u,g-p,b-M).normalize(),t===an)n[5].setComponents(c+l,d+u,g+p,b+M).normalize();else if(t===Kr)n[5].setComponents(l,u,p,M).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),ss.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),ss.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(ss)}intersectsSprite(e){ss.center.set(0,0,0);const t=Em.distanceTo(e.center);return ss.radius=.7071067811865476+t,ss.applyMatrix4(e.matrixWorld),this.intersectsSphere(ss)}intersectsSphere(e){const t=this.planes,i=e.center,n=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(i)<n)return!1;return!0}intersectsBox(e){const t=this.planes;for(let i=0;i<6;i++){const n=t[i];if(Ra.x=n.normal.x>0?e.max.x:e.min.x,Ra.y=n.normal.y>0?e.max.y:e.min.y,Ra.z=n.normal.z>0?e.max.z:e.min.z,n.distanceToPoint(Ra)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class Uc extends Dn{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Te(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const Vu=new rt,Fc=new wh,La=new Jn,Ia=new L;class Wu extends Ft{constructor(e=new It,t=new Uc){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){const i=this.geometry,n=this.matrixWorld,r=e.params.Points.threshold,a=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),La.copy(i.boundingSphere),La.applyMatrix4(n),La.radius+=r,e.ray.intersectsSphere(La)===!1)return;Vu.copy(n).invert(),Fc.copy(e.ray).applyMatrix4(Vu);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=i.index,f=i.attributes.position;if(c!==null){const u=Math.max(0,a.start),d=Math.min(c.count,a.start+a.count);for(let m=u,v=d;m<v;m++){const p=c.getX(m);Ia.fromBufferAttribute(f,p),Xu(Ia,p,l,n,e,t,this)}}else{const u=Math.max(0,a.start),d=Math.min(f.count,a.start+a.count);for(let m=u,v=d;m<v;m++)Ia.fromBufferAttribute(f,m),Xu(Ia,m,l,n,e,t,this)}}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const n=t[i[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=n.length;r<a;r++){const o=n[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function Xu(s,e,t,i,n,r,a){const o=Fc.distanceSqToPoint(s);if(o<t){const l=new L;Fc.closestPointToPoint(s,l),l.applyMatrix4(i);const c=n.ray.origin.distanceTo(l);if(c<n.near||c>n.far)return;r.push({distance:c,distanceToRay:Math.sqrt(o),point:l,index:e,face:null,faceIndex:null,barycoord:null,object:a})}}class Nf extends fi{constructor(e=[],t=ps,i,n,r,a,o,l,c,h){super(e,t,i,n,r,a,o,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class lr extends fi{constructor(e,t,i,n,r,a,o,l,c){super(e,t,i,n,r,a,o,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class sr extends fi{constructor(e,t,i=cn,n,r,a,o=Qt,l=Qt,c,h=Cn,f=1){if(h!==Cn&&h!==Kn)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const u={width:e,height:t,depth:f};super(u,n,r,a,o,l,h,i,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new _h(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return t.compareFunction=this.compareFunction,t}}class Tm extends sr{constructor(e,t=cn,i=ps,n,r,a=Qt,o=Qt,l,c=Cn){const h={width:e,height:e,depth:1},f=[h,h,h,h,h,h];super(e,e,t,i,n,r,a,o,l,c),this.image=f,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}}class Bf extends fi{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class Le extends It{constructor(e=1,t=1,i=1,n=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:n,heightSegments:r,depthSegments:a};const o=this;n=Math.floor(n),r=Math.floor(r),a=Math.floor(a);const l=[],c=[],h=[],f=[];let u=0,d=0;m("z","y","x",-1,-1,i,t,e,a,r,0),m("z","y","x",1,-1,i,t,-e,a,r,1),m("x","z","y",1,1,e,i,t,n,a,2),m("x","z","y",1,-1,e,i,-t,n,a,3),m("x","y","z",1,-1,e,t,i,n,r,4),m("x","y","z",-1,-1,e,t,-i,n,r,5),this.setIndex(l),this.setAttribute("position",new ot(c,3)),this.setAttribute("normal",new ot(h,3)),this.setAttribute("uv",new ot(f,2));function m(v,p,g,y,E,M,b,S,w,x,A){const C=M/w,R=b/x,D=M/2,B=b/2,k=S/2,N=w+1,G=x+1;let H=0,se=0;const V=new L;for(let j=0;j<G;j++){const J=j*R-B;for(let we=0;we<N;we++){const ce=we*C-D;V[v]=ce*y,V[p]=J*E,V[g]=k,c.push(V.x,V.y,V.z),V[v]=0,V[p]=0,V[g]=S>0?1:-1,h.push(V.x,V.y,V.z),f.push(we/w),f.push(1-j/x),H+=1}}for(let j=0;j<x;j++)for(let J=0;J<w;J++){const we=u+J+N*j,ce=u+J+N*(j+1),ct=u+(J+1)+N*(j+1),tt=u+(J+1)+N*j;l.push(we,ce,tt),l.push(ce,ct,tt),se+=6}o.addGroup(d,se,A),d+=se,u+=H}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Le(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}class Rn extends It{constructor(e=1,t=1,i=4,n=8,r=1){super(),this.type="CapsuleGeometry",this.parameters={radius:e,height:t,capSegments:i,radialSegments:n,heightSegments:r},t=Math.max(0,t),i=Math.max(1,Math.floor(i)),n=Math.max(3,Math.floor(n)),r=Math.max(1,Math.floor(r));const a=[],o=[],l=[],c=[],h=t/2,f=Math.PI/2*e,u=t,d=2*f+u,m=i*2+r,v=n+1,p=new L,g=new L;for(let y=0;y<=m;y++){let E=0,M=0,b=0,S=0;if(y<=i){const A=y/i,C=A*Math.PI/2;M=-h-e*Math.cos(C),b=e*Math.sin(C),S=-e*Math.cos(C),E=A*f}else if(y<=i+r){const A=(y-i)/r;M=-h+A*t,b=e,S=0,E=f+A*u}else{const A=(y-i-r)/i,C=A*Math.PI/2;M=h+e*Math.sin(C),b=e*Math.cos(C),S=e*Math.sin(C),E=f+u+A*f}const w=Math.max(0,Math.min(1,E/d));let x=0;y===0?x=.5/n:y===m&&(x=-.5/n);for(let A=0;A<=n;A++){const C=A/n,R=C*Math.PI*2,D=Math.sin(R),B=Math.cos(R);g.x=-b*B,g.y=M,g.z=b*D,o.push(g.x,g.y,g.z),p.set(-b*B,S,b*D),p.normalize(),l.push(p.x,p.y,p.z),c.push(C+x,w)}if(y>0){const A=(y-1)*v;for(let C=0;C<n;C++){const R=A+C,D=A+C+1,B=y*v+C,k=y*v+C+1;a.push(R,D,B),a.push(D,k,B)}}}this.setIndex(a),this.setAttribute("position",new ot(o,3)),this.setAttribute("normal",new ot(l,3)),this.setAttribute("uv",new ot(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Rn(e.radius,e.height,e.capSegments,e.radialSegments,e.heightSegments)}}class cr extends It{constructor(e=1,t=32,i=0,n=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:i,thetaLength:n},t=Math.max(3,t);const r=[],a=[],o=[],l=[],c=new L,h=new le;a.push(0,0,0),o.push(0,0,1),l.push(.5,.5);for(let f=0,u=3;f<=t;f++,u+=3){const d=i+f/t*n;c.x=e*Math.cos(d),c.y=e*Math.sin(d),a.push(c.x,c.y,c.z),o.push(0,0,1),h.x=(a[u]/e+1)/2,h.y=(a[u+1]/e+1)/2,l.push(h.x,h.y)}for(let f=1;f<=t;f++)r.push(f,f+1,0);this.setIndex(r),this.setAttribute("position",new ot(a,3)),this.setAttribute("normal",new ot(o,3)),this.setAttribute("uv",new ot(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new cr(e.radius,e.segments,e.thetaStart,e.thetaLength)}}class $e extends It{constructor(e=1,t=1,i=1,n=32,r=1,a=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:i,radialSegments:n,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:l};const c=this;n=Math.floor(n),r=Math.floor(r);const h=[],f=[],u=[],d=[];let m=0;const v=[],p=i/2;let g=0;y(),a===!1&&(e>0&&E(!0),t>0&&E(!1)),this.setIndex(h),this.setAttribute("position",new ot(f,3)),this.setAttribute("normal",new ot(u,3)),this.setAttribute("uv",new ot(d,2));function y(){const M=new L,b=new L;let S=0;const w=(t-e)/i;for(let x=0;x<=r;x++){const A=[],C=x/r,R=C*(t-e)+e;for(let D=0;D<=n;D++){const B=D/n,k=B*l+o,N=Math.sin(k),G=Math.cos(k);b.x=R*N,b.y=-C*i+p,b.z=R*G,f.push(b.x,b.y,b.z),M.set(N,w,G).normalize(),u.push(M.x,M.y,M.z),d.push(B,1-C),A.push(m++)}v.push(A)}for(let x=0;x<n;x++)for(let A=0;A<r;A++){const C=v[A][x],R=v[A+1][x],D=v[A+1][x+1],B=v[A][x+1];(e>0||A!==0)&&(h.push(C,R,B),S+=3),(t>0||A!==r-1)&&(h.push(R,D,B),S+=3)}c.addGroup(g,S,0),g+=S}function E(M){const b=m,S=new le,w=new L;let x=0;const A=M===!0?e:t,C=M===!0?1:-1;for(let D=1;D<=n;D++)f.push(0,p*C,0),u.push(0,C,0),d.push(.5,.5),m++;const R=m;for(let D=0;D<=n;D++){const k=D/n*l+o,N=Math.cos(k),G=Math.sin(k);w.x=A*G,w.y=p*C,w.z=A*N,f.push(w.x,w.y,w.z),u.push(0,C,0),S.x=N*.5+.5,S.y=G*.5*C+.5,d.push(S.x,S.y),m++}for(let D=0;D<n;D++){const B=b+D,k=R+D;M===!0?h.push(k,k+1,B):h.push(k+1,k,B),x+=3}c.addGroup(g,x,M===!0?1:2),g+=x}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new $e(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class ti extends $e{constructor(e=1,t=1,i=32,n=1,r=!1,a=0,o=Math.PI*2){super(0,e,t,i,n,r,a,o),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:i,heightSegments:n,openEnded:r,thetaStart:a,thetaLength:o}}static fromJSON(e){return new ti(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class Ch extends It{constructor(e=[],t=[],i=1,n=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:i,detail:n};const r=[],a=[];o(n),c(i),h(),this.setAttribute("position",new ot(r,3)),this.setAttribute("normal",new ot(r.slice(),3)),this.setAttribute("uv",new ot(a,2)),n===0?this.computeVertexNormals():this.normalizeNormals();function o(y){const E=new L,M=new L,b=new L;for(let S=0;S<t.length;S+=3)d(t[S+0],E),d(t[S+1],M),d(t[S+2],b),l(E,M,b,y)}function l(y,E,M,b){const S=b+1,w=[];for(let x=0;x<=S;x++){w[x]=[];const A=y.clone().lerp(M,x/S),C=E.clone().lerp(M,x/S),R=S-x;for(let D=0;D<=R;D++)D===0&&x===S?w[x][D]=A:w[x][D]=A.clone().lerp(C,D/R)}for(let x=0;x<S;x++)for(let A=0;A<2*(S-x)-1;A++){const C=Math.floor(A/2);A%2===0?(u(w[x][C+1]),u(w[x+1][C]),u(w[x][C])):(u(w[x][C+1]),u(w[x+1][C+1]),u(w[x+1][C]))}}function c(y){const E=new L;for(let M=0;M<r.length;M+=3)E.x=r[M+0],E.y=r[M+1],E.z=r[M+2],E.normalize().multiplyScalar(y),r[M+0]=E.x,r[M+1]=E.y,r[M+2]=E.z}function h(){const y=new L;for(let E=0;E<r.length;E+=3){y.x=r[E+0],y.y=r[E+1],y.z=r[E+2];const M=p(y)/2/Math.PI+.5,b=g(y)/Math.PI+.5;a.push(M,1-b)}m(),f()}function f(){for(let y=0;y<a.length;y+=6){const E=a[y+0],M=a[y+2],b=a[y+4],S=Math.max(E,M,b),w=Math.min(E,M,b);S>.9&&w<.1&&(E<.2&&(a[y+0]+=1),M<.2&&(a[y+2]+=1),b<.2&&(a[y+4]+=1))}}function u(y){r.push(y.x,y.y,y.z)}function d(y,E){const M=y*3;E.x=e[M+0],E.y=e[M+1],E.z=e[M+2]}function m(){const y=new L,E=new L,M=new L,b=new L,S=new le,w=new le,x=new le;for(let A=0,C=0;A<r.length;A+=9,C+=6){y.set(r[A+0],r[A+1],r[A+2]),E.set(r[A+3],r[A+4],r[A+5]),M.set(r[A+6],r[A+7],r[A+8]),S.set(a[C+0],a[C+1]),w.set(a[C+2],a[C+3]),x.set(a[C+4],a[C+5]),b.copy(y).add(E).add(M).divideScalar(3);const R=p(b);v(S,C+0,y,R),v(w,C+2,E,R),v(x,C+4,M,R)}}function v(y,E,M,b){b<0&&y.x===1&&(a[E]=y.x-1),M.x===0&&M.z===0&&(a[E]=b/2/Math.PI+.5)}function p(y){return Math.atan2(y.z,-y.x)}function g(y){return Math.atan2(-y.y,Math.sqrt(y.x*y.x+y.z*y.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ch(e.vertices,e.indices,e.radius,e.detail)}}class dn{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){je("Curve: .getPoint() not implemented.")}getPointAt(e,t){const i=this.getUtoTmapping(e);return this.getPoint(i,t)}getPoints(e=5){const t=[];for(let i=0;i<=e;i++)t.push(this.getPoint(i/e));return t}getSpacedPoints(e=5){const t=[];for(let i=0;i<=e;i++)t.push(this.getPointAt(i/e));return t}getLength(){const e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const t=[];let i,n=this.getPoint(0),r=0;t.push(0);for(let a=1;a<=e;a++)i=this.getPoint(a/e),r+=i.distanceTo(n),t.push(r),n=i;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){const i=this.getLengths();let n=0;const r=i.length;let a;t?a=t:a=e*i[r-1];let o=0,l=r-1,c;for(;o<=l;)if(n=Math.floor(o+(l-o)/2),c=i[n]-a,c<0)o=n+1;else if(c>0)l=n-1;else{l=n;break}if(n=l,i[n]===a)return n/(r-1);const h=i[n],u=i[n+1]-h,d=(a-h)/u;return(n+d)/(r-1)}getTangent(e,t){let n=e-1e-4,r=e+1e-4;n<0&&(n=0),r>1&&(r=1);const a=this.getPoint(n),o=this.getPoint(r),l=t||(a.isVector2?new le:new L);return l.copy(o).sub(a).normalize(),l}getTangentAt(e,t){const i=this.getUtoTmapping(e);return this.getTangent(i,t)}computeFrenetFrames(e,t=!1){const i=new L,n=[],r=[],a=[],o=new L,l=new rt;for(let d=0;d<=e;d++){const m=d/e;n[d]=this.getTangentAt(m,new L)}r[0]=new L,a[0]=new L;let c=Number.MAX_VALUE;const h=Math.abs(n[0].x),f=Math.abs(n[0].y),u=Math.abs(n[0].z);h<=c&&(c=h,i.set(1,0,0)),f<=c&&(c=f,i.set(0,1,0)),u<=c&&i.set(0,0,1),o.crossVectors(n[0],i).normalize(),r[0].crossVectors(n[0],o),a[0].crossVectors(n[0],r[0]);for(let d=1;d<=e;d++){if(r[d]=r[d-1].clone(),a[d]=a[d-1].clone(),o.crossVectors(n[d-1],n[d]),o.length()>Number.EPSILON){o.normalize();const m=Math.acos(ft(n[d-1].dot(n[d]),-1,1));r[d].applyMatrix4(l.makeRotationAxis(o,m))}a[d].crossVectors(n[d],r[d])}if(t===!0){let d=Math.acos(ft(r[0].dot(r[e]),-1,1));d/=e,n[0].dot(o.crossVectors(r[0],r[e]))>0&&(d=-d);for(let m=1;m<=e;m++)r[m].applyMatrix4(l.makeRotationAxis(n[m],d*m)),a[m].crossVectors(n[m],r[m])}return{tangents:n,normals:r,binormals:a}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){const e={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}}class Ph extends dn{constructor(e=0,t=0,i=1,n=1,r=0,a=Math.PI*2,o=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=i,this.yRadius=n,this.aStartAngle=r,this.aEndAngle=a,this.aClockwise=o,this.aRotation=l}getPoint(e,t=new le){const i=t,n=Math.PI*2;let r=this.aEndAngle-this.aStartAngle;const a=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=n;for(;r>n;)r-=n;r<Number.EPSILON&&(a?r=0:r=n),this.aClockwise===!0&&!a&&(r===n?r=-n:r=r-n);const o=this.aStartAngle+e*r;let l=this.aX+this.xRadius*Math.cos(o),c=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){const h=Math.cos(this.aRotation),f=Math.sin(this.aRotation),u=l-this.aX,d=c-this.aY;l=u*h-d*f+this.aX,c=u*f+d*h+this.aY}return i.set(l,c)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){const e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}}class Cm extends Ph{constructor(e,t,i,n,r,a){super(e,t,i,i,n,r,a),this.isArcCurve=!0,this.type="ArcCurve"}}function Rh(){let s=0,e=0,t=0,i=0;function n(r,a,o,l){s=r,e=o,t=-3*r+3*a-2*o-l,i=2*r-2*a+o+l}return{initCatmullRom:function(r,a,o,l,c){n(a,o,c*(o-r),c*(l-a))},initNonuniformCatmullRom:function(r,a,o,l,c,h,f){let u=(a-r)/c-(o-r)/(c+h)+(o-a)/h,d=(o-a)/h-(l-a)/(h+f)+(l-o)/f;u*=h,d*=h,n(a,o,u,d)},calc:function(r){const a=r*r,o=a*r;return s+e*r+t*a+i*o}}}const qu=new L,Ku=new L,pl=new Rh,ml=new Rh,gl=new Rh;class Pm extends dn{constructor(e=[],t=!1,i="centripetal",n=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=i,this.tension=n}getPoint(e,t=new L){const i=t,n=this.points,r=n.length,a=(r-(this.closed?0:1))*e;let o=Math.floor(a),l=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/r)+1)*r:l===0&&o===r-1&&(o=r-2,l=1);let c,h;this.closed||o>0?c=n[(o-1)%r]:(Ku.subVectors(n[0],n[1]).add(n[0]),c=Ku);const f=n[o%r],u=n[(o+1)%r];if(this.closed||o+2<r?h=n[(o+2)%r]:(qu.subVectors(n[r-1],n[r-2]).add(n[r-1]),h=qu),this.curveType==="centripetal"||this.curveType==="chordal"){const d=this.curveType==="chordal"?.5:.25;let m=Math.pow(c.distanceToSquared(f),d),v=Math.pow(f.distanceToSquared(u),d),p=Math.pow(u.distanceToSquared(h),d);v<1e-4&&(v=1),m<1e-4&&(m=v),p<1e-4&&(p=v),pl.initNonuniformCatmullRom(c.x,f.x,u.x,h.x,m,v,p),ml.initNonuniformCatmullRom(c.y,f.y,u.y,h.y,m,v,p),gl.initNonuniformCatmullRom(c.z,f.z,u.z,h.z,m,v,p)}else this.curveType==="catmullrom"&&(pl.initCatmullRom(c.x,f.x,u.x,h.x,this.tension),ml.initCatmullRom(c.y,f.y,u.y,h.y,this.tension),gl.initCatmullRom(c.z,f.z,u.z,h.z,this.tension));return i.set(pl.calc(l),ml.calc(l),gl.calc(l)),i}copy(e){super.copy(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const n=e.points[t];this.points.push(n.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,i=this.points.length;t<i;t++){const n=this.points[t];e.points.push(n.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const n=e.points[t];this.points.push(new L().fromArray(n))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}}function Yu(s,e,t,i,n){const r=(i-e)*.5,a=(n-t)*.5,o=s*s,l=s*o;return(2*t-2*i+r+a)*l+(-3*t+3*i-2*r-a)*o+r*s+t}function Rm(s,e){const t=1-s;return t*t*e}function Lm(s,e){return 2*(1-s)*s*e}function Im(s,e){return s*s*e}function Br(s,e,t,i){return Rm(s,e)+Lm(s,t)+Im(s,i)}function Dm(s,e){const t=1-s;return t*t*t*e}function km(s,e){const t=1-s;return 3*t*t*s*e}function Um(s,e){return 3*(1-s)*s*s*e}function Fm(s,e){return s*s*s*e}function Or(s,e,t,i,n){return Dm(s,e)+km(s,t)+Um(s,i)+Fm(s,n)}class Of extends dn{constructor(e=new le,t=new le,i=new le,n=new le){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=i,this.v3=n}getPoint(e,t=new le){const i=t,n=this.v0,r=this.v1,a=this.v2,o=this.v3;return i.set(Or(e,n.x,r.x,a.x,o.x),Or(e,n.y,r.y,a.y,o.y)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class Nm extends dn{constructor(e=new L,t=new L,i=new L,n=new L){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=i,this.v3=n}getPoint(e,t=new L){const i=t,n=this.v0,r=this.v1,a=this.v2,o=this.v3;return i.set(Or(e,n.x,r.x,a.x,o.x),Or(e,n.y,r.y,a.y,o.y),Or(e,n.z,r.z,a.z,o.z)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class zf extends dn{constructor(e=new le,t=new le){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new le){const i=t;return e===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(e).add(this.v1)),i}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new le){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Bm extends dn{constructor(e=new L,t=new L){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new L){const i=t;return e===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(e).add(this.v1)),i}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new L){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Hf extends dn{constructor(e=new le,t=new le,i=new le){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=i}getPoint(e,t=new le){const i=t,n=this.v0,r=this.v1,a=this.v2;return i.set(Br(e,n.x,r.x,a.x),Br(e,n.y,r.y,a.y)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Om extends dn{constructor(e=new L,t=new L,i=new L){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=i}getPoint(e,t=new L){const i=t,n=this.v0,r=this.v1,a=this.v2;return i.set(Br(e,n.x,r.x,a.x),Br(e,n.y,r.y,a.y),Br(e,n.z,r.z,a.z)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Gf extends dn{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new le){const i=t,n=this.points,r=(n.length-1)*e,a=Math.floor(r),o=r-a,l=n[a===0?a:a-1],c=n[a],h=n[a>n.length-2?n.length-1:a+1],f=n[a>n.length-3?n.length-1:a+2];return i.set(Yu(o,l.x,c.x,h.x,f.x),Yu(o,l.y,c.y,h.y,f.y)),i}copy(e){super.copy(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const n=e.points[t];this.points.push(n.clone())}return this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,i=this.points.length;t<i;t++){const n=this.points[t];e.points.push(n.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const n=e.points[t];this.points.push(new le().fromArray(n))}return this}}var Nc=Object.freeze({__proto__:null,ArcCurve:Cm,CatmullRomCurve3:Pm,CubicBezierCurve:Of,CubicBezierCurve3:Nm,EllipseCurve:Ph,LineCurve:zf,LineCurve3:Bm,QuadraticBezierCurve:Hf,QuadraticBezierCurve3:Om,SplineCurve:Gf});class zm extends dn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){const e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){const i=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Nc[i](t,e))}return this}getPoint(e,t){const i=e*this.getLength(),n=this.getCurveLengths();let r=0;for(;r<n.length;){if(n[r]>=i){const a=n[r]-i,o=this.curves[r],l=o.getLength(),c=l===0?0:1-a/l;return o.getPointAt(c,t)}r++}return null}getLength(){const e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const e=[];let t=0;for(let i=0,n=this.curves.length;i<n;i++)t+=this.curves[i].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){const t=[];for(let i=0;i<=e;i++)t.push(this.getPoint(i/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){const t=[];let i;for(let n=0,r=this.curves;n<r.length;n++){const a=r[n],o=a.isEllipseCurve?e*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?e*a.points.length:e,l=a.getPoints(o);for(let c=0;c<l.length;c++){const h=l[c];i&&i.equals(h)||(t.push(h),i=h)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,i=e.curves.length;t<i;t++){const n=e.curves[t];this.curves.push(n.clone())}return this.autoClose=e.autoClose,this}toJSON(){const e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,i=this.curves.length;t<i;t++){const n=this.curves[t];e.curves.push(n.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,i=e.curves.length;t<i;t++){const n=e.curves[t];this.curves.push(new Nc[n.type]().fromJSON(n))}return this}}class $u extends zm{constructor(e){super(),this.type="Path",this.currentPoint=new le,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,i=e.length;t<i;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){const i=new zf(this.currentPoint.clone(),new le(e,t));return this.curves.push(i),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,i,n){const r=new Hf(this.currentPoint.clone(),new le(e,t),new le(i,n));return this.curves.push(r),this.currentPoint.set(i,n),this}bezierCurveTo(e,t,i,n,r,a){const o=new Of(this.currentPoint.clone(),new le(e,t),new le(i,n),new le(r,a));return this.curves.push(o),this.currentPoint.set(r,a),this}splineThru(e){const t=[this.currentPoint.clone()].concat(e),i=new Gf(t);return this.curves.push(i),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,i,n,r,a){const o=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(e+o,t+l,i,n,r,a),this}absarc(e,t,i,n,r,a){return this.absellipse(e,t,i,i,n,r,a),this}ellipse(e,t,i,n,r,a,o,l){const c=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(e+c,t+h,i,n,r,a,o,l),this}absellipse(e,t,i,n,r,a,o,l){const c=new Ph(e,t,i,n,r,a,o,l);if(this.curves.length>0){const f=c.getPoint(0);f.equals(this.currentPoint)||this.lineTo(f.x,f.y)}this.curves.push(c);const h=c.getPoint(1);return this.currentPoint.copy(h),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){const e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}}class fo extends $u{constructor(e){super(e),this.uuid=ln(),this.type="Shape",this.holes=[]}getPointsHoles(e){const t=[];for(let i=0,n=this.holes.length;i<n;i++)t[i]=this.holes[i].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,i=e.holes.length;t<i;t++){const n=e.holes[t];this.holes.push(n.clone())}return this}toJSON(){const e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,i=this.holes.length;t<i;t++){const n=this.holes[t];e.holes.push(n.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,i=e.holes.length;t<i;t++){const n=e.holes[t];this.holes.push(new $u().fromJSON(n))}return this}}function Hm(s,e,t=2){const i=e&&e.length,n=i?e[0]*t:s.length;let r=Vf(s,0,n,t,!0);const a=[];if(!r||r.next===r.prev)return a;let o,l,c;if(i&&(r=qm(s,e,r,t)),s.length>80*t){o=s[0],l=s[1];let h=o,f=l;for(let u=t;u<n;u+=t){const d=s[u],m=s[u+1];d<o&&(o=d),m<l&&(l=m),d>h&&(h=d),m>f&&(f=m)}c=Math.max(h-o,f-l),c=c!==0?32767/c:0}return Yr(r,a,t,o,l,c,0),a}function Vf(s,e,t,i,n){let r;if(n===ng(s,e,t,i)>0)for(let a=e;a<t;a+=i)r=Qu(a/i|0,s[a],s[a+1],r);else for(let a=t-i;a>=e;a-=i)r=Qu(a/i|0,s[a],s[a+1],r);return r&&rr(r,r.next)&&(Qr(r),r=r.next),r}function gs(s,e){if(!s)return s;e||(e=s);let t=s,i;do if(i=!1,!t.steiner&&(rr(t,t.next)||Bt(t.prev,t,t.next)===0)){if(Qr(t),t=e=t.prev,t===t.next)break;i=!0}else t=t.next;while(i||t!==e);return e}function Yr(s,e,t,i,n,r,a){if(!s)return;!a&&r&&Zm(s,i,n,r);let o=s;for(;s.prev!==s.next;){const l=s.prev,c=s.next;if(r?Vm(s,i,n,r):Gm(s)){e.push(l.i,s.i,c.i),Qr(s),s=c.next,o=c.next;continue}if(s=c,s===o){a?a===1?(s=Wm(gs(s),e),Yr(s,e,t,i,n,r,2)):a===2&&Xm(s,e,t,i,n,r):Yr(gs(s),e,t,i,n,r,1);break}}}function Gm(s){const e=s.prev,t=s,i=s.next;if(Bt(e,t,i)>=0)return!1;const n=e.x,r=t.x,a=i.x,o=e.y,l=t.y,c=i.y,h=Math.min(n,r,a),f=Math.min(o,l,c),u=Math.max(n,r,a),d=Math.max(o,l,c);let m=i.next;for(;m!==e;){if(m.x>=h&&m.x<=u&&m.y>=f&&m.y<=d&&Ir(n,o,r,l,a,c,m.x,m.y)&&Bt(m.prev,m,m.next)>=0)return!1;m=m.next}return!0}function Vm(s,e,t,i){const n=s.prev,r=s,a=s.next;if(Bt(n,r,a)>=0)return!1;const o=n.x,l=r.x,c=a.x,h=n.y,f=r.y,u=a.y,d=Math.min(o,l,c),m=Math.min(h,f,u),v=Math.max(o,l,c),p=Math.max(h,f,u),g=Bc(d,m,e,t,i),y=Bc(v,p,e,t,i);let E=s.prevZ,M=s.nextZ;for(;E&&E.z>=g&&M&&M.z<=y;){if(E.x>=d&&E.x<=v&&E.y>=m&&E.y<=p&&E!==n&&E!==a&&Ir(o,h,l,f,c,u,E.x,E.y)&&Bt(E.prev,E,E.next)>=0||(E=E.prevZ,M.x>=d&&M.x<=v&&M.y>=m&&M.y<=p&&M!==n&&M!==a&&Ir(o,h,l,f,c,u,M.x,M.y)&&Bt(M.prev,M,M.next)>=0))return!1;M=M.nextZ}for(;E&&E.z>=g;){if(E.x>=d&&E.x<=v&&E.y>=m&&E.y<=p&&E!==n&&E!==a&&Ir(o,h,l,f,c,u,E.x,E.y)&&Bt(E.prev,E,E.next)>=0)return!1;E=E.prevZ}for(;M&&M.z<=y;){if(M.x>=d&&M.x<=v&&M.y>=m&&M.y<=p&&M!==n&&M!==a&&Ir(o,h,l,f,c,u,M.x,M.y)&&Bt(M.prev,M,M.next)>=0)return!1;M=M.nextZ}return!0}function Wm(s,e){let t=s;do{const i=t.prev,n=t.next.next;!rr(i,n)&&Xf(i,t,t.next,n)&&$r(i,n)&&$r(n,i)&&(e.push(i.i,t.i,n.i),Qr(t),Qr(t.next),t=s=n),t=t.next}while(t!==s);return gs(t)}function Xm(s,e,t,i,n,r){let a=s;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&eg(a,o)){let l=qf(a,o);a=gs(a,a.next),l=gs(l,l.next),Yr(a,e,t,i,n,r,0),Yr(l,e,t,i,n,r,0);return}o=o.next}a=a.next}while(a!==s)}function qm(s,e,t,i){const n=[];for(let r=0,a=e.length;r<a;r++){const o=e[r]*i,l=r<a-1?e[r+1]*i:s.length,c=Vf(s,o,l,i,!1);c===c.next&&(c.steiner=!0),n.push(jm(c))}n.sort(Km);for(let r=0;r<n.length;r++)t=Ym(n[r],t);return t}function Km(s,e){let t=s.x-e.x;if(t===0&&(t=s.y-e.y,t===0)){const i=(s.next.y-s.y)/(s.next.x-s.x),n=(e.next.y-e.y)/(e.next.x-e.x);t=i-n}return t}function Ym(s,e){const t=$m(s,e);if(!t)return e;const i=qf(t,s);return gs(i,i.next),gs(t,t.next)}function $m(s,e){let t=e;const i=s.x,n=s.y;let r=-1/0,a;if(rr(s,t))return t;do{if(rr(s,t.next))return t.next;if(n<=t.y&&n>=t.next.y&&t.next.y!==t.y){const f=t.x+(n-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(f<=i&&f>r&&(r=f,a=t.x<t.next.x?t:t.next,f===i))return a}t=t.next}while(t!==e);if(!a)return null;const o=a,l=a.x,c=a.y;let h=1/0;t=a;do{if(i>=t.x&&t.x>=l&&i!==t.x&&Wf(n<c?i:r,n,l,c,n<c?r:i,n,t.x,t.y)){const f=Math.abs(n-t.y)/(i-t.x);$r(t,s)&&(f<h||f===h&&(t.x>a.x||t.x===a.x&&Qm(a,t)))&&(a=t,h=f)}t=t.next}while(t!==o);return a}function Qm(s,e){return Bt(s.prev,s,e.prev)<0&&Bt(e.next,s,s.next)<0}function Zm(s,e,t,i){let n=s;do n.z===0&&(n.z=Bc(n.x,n.y,e,t,i)),n.prevZ=n.prev,n.nextZ=n.next,n=n.next;while(n!==s);n.prevZ.nextZ=null,n.prevZ=null,Jm(n)}function Jm(s){let e,t=1;do{let i=s,n;s=null;let r=null;for(e=0;i;){e++;let a=i,o=0;for(let c=0;c<t&&(o++,a=a.nextZ,!!a);c++);let l=t;for(;o>0||l>0&&a;)o!==0&&(l===0||!a||i.z<=a.z)?(n=i,i=i.nextZ,o--):(n=a,a=a.nextZ,l--),r?r.nextZ=n:s=n,n.prevZ=r,r=n;i=a}r.nextZ=null,t*=2}while(e>1);return s}function Bc(s,e,t,i,n){return s=(s-t)*n|0,e=(e-i)*n|0,s=(s|s<<8)&16711935,s=(s|s<<4)&252645135,s=(s|s<<2)&858993459,s=(s|s<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,s|e<<1}function jm(s){let e=s,t=s;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==s);return t}function Wf(s,e,t,i,n,r,a,o){return(n-a)*(e-o)>=(s-a)*(r-o)&&(s-a)*(i-o)>=(t-a)*(e-o)&&(t-a)*(r-o)>=(n-a)*(i-o)}function Ir(s,e,t,i,n,r,a,o){return!(s===a&&e===o)&&Wf(s,e,t,i,n,r,a,o)}function eg(s,e){return s.next.i!==e.i&&s.prev.i!==e.i&&!tg(s,e)&&($r(s,e)&&$r(e,s)&&ig(s,e)&&(Bt(s.prev,s,e.prev)||Bt(s,e.prev,e))||rr(s,e)&&Bt(s.prev,s,s.next)>0&&Bt(e.prev,e,e.next)>0)}function Bt(s,e,t){return(e.y-s.y)*(t.x-e.x)-(e.x-s.x)*(t.y-e.y)}function rr(s,e){return s.x===e.x&&s.y===e.y}function Xf(s,e,t,i){const n=ka(Bt(s,e,t)),r=ka(Bt(s,e,i)),a=ka(Bt(t,i,s)),o=ka(Bt(t,i,e));return!!(n!==r&&a!==o||n===0&&Da(s,t,e)||r===0&&Da(s,i,e)||a===0&&Da(t,s,i)||o===0&&Da(t,e,i))}function Da(s,e,t){return e.x<=Math.max(s.x,t.x)&&e.x>=Math.min(s.x,t.x)&&e.y<=Math.max(s.y,t.y)&&e.y>=Math.min(s.y,t.y)}function ka(s){return s>0?1:s<0?-1:0}function tg(s,e){let t=s;do{if(t.i!==s.i&&t.next.i!==s.i&&t.i!==e.i&&t.next.i!==e.i&&Xf(t,t.next,s,e))return!0;t=t.next}while(t!==s);return!1}function $r(s,e){return Bt(s.prev,s,s.next)<0?Bt(s,e,s.next)>=0&&Bt(s,s.prev,e)>=0:Bt(s,e,s.prev)<0||Bt(s,s.next,e)<0}function ig(s,e){let t=s,i=!1;const n=(s.x+e.x)/2,r=(s.y+e.y)/2;do t.y>r!=t.next.y>r&&t.next.y!==t.y&&n<(t.next.x-t.x)*(r-t.y)/(t.next.y-t.y)+t.x&&(i=!i),t=t.next;while(t!==s);return i}function qf(s,e){const t=Oc(s.i,s.x,s.y),i=Oc(e.i,e.x,e.y),n=s.next,r=e.prev;return s.next=e,e.prev=s,t.next=n,n.prev=t,i.next=t,t.prev=i,r.next=i,i.prev=r,i}function Qu(s,e,t,i){const n=Oc(s,e,t);return i?(n.next=i.next,n.prev=i,i.next.prev=n,i.next=n):(n.prev=n,n.next=n),n}function Qr(s){s.next.prev=s.prev,s.prev.next=s.next,s.prevZ&&(s.prevZ.nextZ=s.nextZ),s.nextZ&&(s.nextZ.prevZ=s.prevZ)}function Oc(s,e,t){return{i:s,x:e,y:t,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function ng(s,e,t,i){let n=0;for(let r=e,a=t-i;r<t;r+=i)n+=(s[a]-s[r])*(s[r+1]+s[a+1]),a=r;return n}class sg{static triangulate(e,t,i=2){return Hm(e,t,i)}}class An{static area(e){const t=e.length;let i=0;for(let n=t-1,r=0;r<t;n=r++)i+=e[n].x*e[r].y-e[r].x*e[n].y;return i*.5}static isClockWise(e){return An.area(e)<0}static triangulateShape(e,t){const i=[],n=[],r=[];Zu(e),Ju(i,e);let a=e.length;t.forEach(Zu);for(let l=0;l<t.length;l++)n.push(a),a+=t[l].length,Ju(i,t[l]);const o=sg.triangulate(i,n);for(let l=0;l<o.length;l+=3)r.push(o.slice(l,l+3));return r}}function Zu(s){const e=s.length;e>2&&s[e-1].equals(s[0])&&s.pop()}function Ju(s,e){for(let t=0;t<e.length;t++)s.push(e[t].x),s.push(e[t].y)}class Lh extends It{constructor(e=new fo([new le(.5,.5),new le(-.5,.5),new le(-.5,-.5),new le(.5,-.5)]),t={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:e,options:t},e=Array.isArray(e)?e:[e];const i=this,n=[],r=[];for(let o=0,l=e.length;o<l;o++){const c=e[o];a(c)}this.setAttribute("position",new ot(n,3)),this.setAttribute("uv",new ot(r,2)),this.computeVertexNormals();function a(o){const l=[],c=t.curveSegments!==void 0?t.curveSegments:12,h=t.steps!==void 0?t.steps:1,f=t.depth!==void 0?t.depth:1;let u=t.bevelEnabled!==void 0?t.bevelEnabled:!0,d=t.bevelThickness!==void 0?t.bevelThickness:.2,m=t.bevelSize!==void 0?t.bevelSize:d-.1,v=t.bevelOffset!==void 0?t.bevelOffset:0,p=t.bevelSegments!==void 0?t.bevelSegments:3;const g=t.extrudePath,y=t.UVGenerator!==void 0?t.UVGenerator:rg;let E,M=!1,b,S,w,x;if(g){E=g.getSpacedPoints(h),M=!0,u=!1;const ie=g.isCatmullRomCurve3?g.closed:!1;b=g.computeFrenetFrames(h,ie),S=new L,w=new L,x=new L}u||(p=0,d=0,m=0,v=0);const A=o.extractPoints(c);let C=A.shape;const R=A.holes;if(!An.isClockWise(C)){C=C.reverse();for(let ie=0,re=R.length;ie<re;ie++){const he=R[ie];An.isClockWise(he)&&(R[ie]=he.reverse())}}function B(ie){const he=10000000000000001e-36;let ue=ie[0];for(let xe=1;xe<=ie.length;xe++){const Ye=xe%ie.length,We=ie[Ye],Ve=We.x-ue.x,Qe=We.y-ue.y,U=Ve*Ve+Qe*Qe,pt=Math.max(Math.abs(We.x),Math.abs(We.y),Math.abs(ue.x),Math.abs(ue.y)),st=he*pt*pt;if(U<=st){ie.splice(Ye,1),xe--;continue}ue=We}}B(C),R.forEach(B);const k=R.length,N=C;for(let ie=0;ie<k;ie++){const re=R[ie];C=C.concat(re)}function G(ie,re,he){return re||vt("ExtrudeGeometry: vec does not exist"),ie.clone().addScaledVector(re,he)}const H=C.length;function se(ie,re,he){let ue,xe,Ye;const We=ie.x-re.x,Ve=ie.y-re.y,Qe=he.x-ie.x,U=he.y-ie.y,pt=We*We+Ve*Ve,st=We*U-Ve*Qe;if(Math.abs(st)>Number.EPSILON){const P=Math.sqrt(pt),_=Math.sqrt(Qe*Qe+U*U),O=re.x-Ve/P,z=re.y+We/P,Y=he.x-U/_,de=he.y+Qe/_,ye=((Y-O)*U-(de-z)*Qe)/(We*U-Ve*Qe);ue=O+We*ye-ie.x,xe=z+Ve*ye-ie.y;const Z=ue*ue+xe*xe;if(Z<=2)return new le(ue,xe);Ye=Math.sqrt(Z/2)}else{let P=!1;We>Number.EPSILON?Qe>Number.EPSILON&&(P=!0):We<-Number.EPSILON?Qe<-Number.EPSILON&&(P=!0):Math.sign(Ve)===Math.sign(U)&&(P=!0),P?(ue=-Ve,xe=We,Ye=Math.sqrt(pt)):(ue=We,xe=Ve,Ye=Math.sqrt(pt/2))}return new le(ue/Ye,xe/Ye)}const V=[];for(let ie=0,re=N.length,he=re-1,ue=ie+1;ie<re;ie++,he++,ue++)he===re&&(he=0),ue===re&&(ue=0),V[ie]=se(N[ie],N[he],N[ue]);const j=[];let J,we=V.concat();for(let ie=0,re=k;ie<re;ie++){const he=R[ie];J=[];for(let ue=0,xe=he.length,Ye=xe-1,We=ue+1;ue<xe;ue++,Ye++,We++)Ye===xe&&(Ye=0),We===xe&&(We=0),J[ue]=se(he[ue],he[Ye],he[We]);j.push(J),we=we.concat(J)}let ce;if(p===0)ce=An.triangulateShape(N,R);else{const ie=[],re=[];for(let he=0;he<p;he++){const ue=he/p,xe=d*Math.cos(ue*Math.PI/2),Ye=m*Math.sin(ue*Math.PI/2)+v;for(let We=0,Ve=N.length;We<Ve;We++){const Qe=G(N[We],V[We],Ye);ee(Qe.x,Qe.y,-xe),ue===0&&ie.push(Qe)}for(let We=0,Ve=k;We<Ve;We++){const Qe=R[We];J=j[We];const U=[];for(let pt=0,st=Qe.length;pt<st;pt++){const P=G(Qe[pt],J[pt],Ye);ee(P.x,P.y,-xe),ue===0&&U.push(P)}ue===0&&re.push(U)}}ce=An.triangulateShape(ie,re)}const ct=ce.length,tt=m+v;for(let ie=0;ie<H;ie++){const re=u?G(C[ie],we[ie],tt):C[ie];M?(w.copy(b.normals[0]).multiplyScalar(re.x),S.copy(b.binormals[0]).multiplyScalar(re.y),x.copy(E[0]).add(w).add(S),ee(x.x,x.y,x.z)):ee(re.x,re.y,0)}for(let ie=1;ie<=h;ie++)for(let re=0;re<H;re++){const he=u?G(C[re],we[re],tt):C[re];M?(w.copy(b.normals[ie]).multiplyScalar(he.x),S.copy(b.binormals[ie]).multiplyScalar(he.y),x.copy(E[ie]).add(w).add(S),ee(x.x,x.y,x.z)):ee(he.x,he.y,f/h*ie)}for(let ie=p-1;ie>=0;ie--){const re=ie/p,he=d*Math.cos(re*Math.PI/2),ue=m*Math.sin(re*Math.PI/2)+v;for(let xe=0,Ye=N.length;xe<Ye;xe++){const We=G(N[xe],V[xe],ue);ee(We.x,We.y,f+he)}for(let xe=0,Ye=R.length;xe<Ye;xe++){const We=R[xe];J=j[xe];for(let Ve=0,Qe=We.length;Ve<Qe;Ve++){const U=G(We[Ve],J[Ve],ue);M?ee(U.x,U.y+E[h-1].y,E[h-1].x+he):ee(U.x,U.y,f+he)}}}Je(),q();function Je(){const ie=n.length/3;if(u){let re=0,he=H*re;for(let ue=0;ue<ct;ue++){const xe=ce[ue];be(xe[2]+he,xe[1]+he,xe[0]+he)}re=h+p*2,he=H*re;for(let ue=0;ue<ct;ue++){const xe=ce[ue];be(xe[0]+he,xe[1]+he,xe[2]+he)}}else{for(let re=0;re<ct;re++){const he=ce[re];be(he[2],he[1],he[0])}for(let re=0;re<ct;re++){const he=ce[re];be(he[0]+H*h,he[1]+H*h,he[2]+H*h)}}i.addGroup(ie,n.length/3-ie,0)}function q(){const ie=n.length/3;let re=0;te(N,re),re+=N.length;for(let he=0,ue=R.length;he<ue;he++){const xe=R[he];te(xe,re),re+=xe.length}i.addGroup(ie,n.length/3-ie,1)}function te(ie,re){let he=ie.length;for(;--he>=0;){const ue=he;let xe=he-1;xe<0&&(xe=ie.length-1);for(let Ye=0,We=h+p*2;Ye<We;Ye++){const Ve=H*Ye,Qe=H*(Ye+1),U=re+ue+Ve,pt=re+xe+Ve,st=re+xe+Qe,P=re+ue+Qe;Me(U,pt,st,P)}}}function ee(ie,re,he){l.push(ie),l.push(re),l.push(he)}function be(ie,re,he){Ie(ie),Ie(re),Ie(he);const ue=n.length/3,xe=y.generateTopUV(i,n,ue-3,ue-2,ue-1);nt(xe[0]),nt(xe[1]),nt(xe[2])}function Me(ie,re,he,ue){Ie(ie),Ie(re),Ie(ue),Ie(re),Ie(he),Ie(ue);const xe=n.length/3,Ye=y.generateSideWallUV(i,n,xe-6,xe-3,xe-2,xe-1);nt(Ye[0]),nt(Ye[1]),nt(Ye[3]),nt(Ye[1]),nt(Ye[2]),nt(Ye[3])}function Ie(ie){n.push(l[ie*3+0]),n.push(l[ie*3+1]),n.push(l[ie*3+2])}function nt(ie){r.push(ie.x),r.push(ie.y)}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){const e=super.toJSON(),t=this.parameters.shapes,i=this.parameters.options;return ag(t,i,e)}static fromJSON(e,t){const i=[];for(let r=0,a=e.shapes.length;r<a;r++){const o=t[e.shapes[r]];i.push(o)}const n=e.options.extrudePath;return n!==void 0&&(e.options.extrudePath=new Nc[n.type]().fromJSON(n)),new Lh(i,e.options)}}const rg={generateTopUV:function(s,e,t,i,n){const r=e[t*3],a=e[t*3+1],o=e[i*3],l=e[i*3+1],c=e[n*3],h=e[n*3+1];return[new le(r,a),new le(o,l),new le(c,h)]},generateSideWallUV:function(s,e,t,i,n,r){const a=e[t*3],o=e[t*3+1],l=e[t*3+2],c=e[i*3],h=e[i*3+1],f=e[i*3+2],u=e[n*3],d=e[n*3+1],m=e[n*3+2],v=e[r*3],p=e[r*3+1],g=e[r*3+2];return Math.abs(o-h)<Math.abs(a-c)?[new le(a,1-l),new le(c,1-f),new le(u,1-m),new le(v,1-g)]:[new le(o,1-l),new le(h,1-f),new le(d,1-m),new le(p,1-g)]}};function ag(s,e,t){if(t.shapes=[],Array.isArray(s))for(let i=0,n=s.length;i<n;i++){const r=s[i];t.shapes.push(r.uuid)}else t.shapes.push(s.uuid);return t.options=Object.assign({},e),e.extrudePath!==void 0&&(t.options.extrudePath=e.extrudePath.toJSON()),t}class Ih extends Ch{constructor(e=1,t=0){const i=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],n=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(i,n,e,t),this.type="OctahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new Ih(e.radius,e.detail)}}class Oi extends It{constructor(e=1,t=1,i=1,n=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:n};const r=e/2,a=t/2,o=Math.floor(i),l=Math.floor(n),c=o+1,h=l+1,f=e/o,u=t/l,d=[],m=[],v=[],p=[];for(let g=0;g<h;g++){const y=g*u-a;for(let E=0;E<c;E++){const M=E*f-r;m.push(M,-y,0),v.push(0,0,1),p.push(E/o),p.push(1-g/l)}}for(let g=0;g<l;g++)for(let y=0;y<o;y++){const E=y+c*g,M=y+c*(g+1),b=y+1+c*(g+1),S=y+1+c*g;d.push(E,M,S),d.push(M,b,S)}this.setIndex(d),this.setAttribute("position",new ot(m,3)),this.setAttribute("normal",new ot(v,3)),this.setAttribute("uv",new ot(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Oi(e.width,e.height,e.widthSegments,e.heightSegments)}}class ta extends It{constructor(e=.5,t=1,i=32,n=1,r=0,a=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:t,thetaSegments:i,phiSegments:n,thetaStart:r,thetaLength:a},i=Math.max(3,i),n=Math.max(1,n);const o=[],l=[],c=[],h=[];let f=e;const u=(t-e)/n,d=new L,m=new le;for(let v=0;v<=n;v++){for(let p=0;p<=i;p++){const g=r+p/i*a;d.x=f*Math.cos(g),d.y=f*Math.sin(g),l.push(d.x,d.y,d.z),c.push(0,0,1),m.x=(d.x/t+1)/2,m.y=(d.y/t+1)/2,h.push(m.x,m.y)}f+=u}for(let v=0;v<n;v++){const p=v*(i+1);for(let g=0;g<i;g++){const y=g+p,E=y,M=y+i+1,b=y+i+2,S=y+1;o.push(E,M,S),o.push(M,b,S)}}this.setIndex(o),this.setAttribute("position",new ot(l,3)),this.setAttribute("normal",new ot(c,3)),this.setAttribute("uv",new ot(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ta(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}}class Dh extends It{constructor(e=new fo([new le(0,.5),new le(-.5,-.5),new le(.5,-.5)]),t=12){super(),this.type="ShapeGeometry",this.parameters={shapes:e,curveSegments:t};const i=[],n=[],r=[],a=[];let o=0,l=0;if(Array.isArray(e)===!1)c(e);else for(let h=0;h<e.length;h++)c(e[h]),this.addGroup(o,l,h),o+=l,l=0;this.setIndex(i),this.setAttribute("position",new ot(n,3)),this.setAttribute("normal",new ot(r,3)),this.setAttribute("uv",new ot(a,2));function c(h){const f=n.length/3,u=h.extractPoints(t);let d=u.shape;const m=u.holes;An.isClockWise(d)===!1&&(d=d.reverse());for(let p=0,g=m.length;p<g;p++){const y=m[p];An.isClockWise(y)===!0&&(m[p]=y.reverse())}const v=An.triangulateShape(d,m);for(let p=0,g=m.length;p<g;p++){const y=m[p];d=d.concat(y)}for(let p=0,g=d.length;p<g;p++){const y=d[p];n.push(y.x,y.y,0),r.push(0,0,1),a.push(y.x,y.y)}for(let p=0,g=v.length;p<g;p++){const y=v[p],E=y[0]+f,M=y[1]+f,b=y[2]+f;i.push(E,M,b),l+=3}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){const e=super.toJSON(),t=this.parameters.shapes;return og(t,e)}static fromJSON(e,t){const i=[];for(let n=0,r=e.shapes.length;n<r;n++){const a=t[e.shapes[n]];i.push(a)}return new Dh(i,e.curveSegments)}}function og(s,e){if(e.shapes=[],Array.isArray(s))for(let t=0,i=s.length;t<i;t++){const n=s[t];e.shapes.push(n.uuid)}else e.shapes.push(s.uuid);return e}class Oe extends It{constructor(e=1,t=32,i=16,n=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:i,phiStart:n,phiLength:r,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),i=Math.max(2,Math.floor(i));const l=Math.min(a+o,Math.PI);let c=0;const h=[],f=new L,u=new L,d=[],m=[],v=[],p=[];for(let g=0;g<=i;g++){const y=[],E=g/i,M=a+E*o,b=e*Math.cos(M),S=Math.sqrt(e*e-b*b);let w=0;g===0&&a===0?w=.5/t:g===i&&l===Math.PI&&(w=-.5/t);for(let x=0;x<=t;x++){const A=x/t,C=n+A*r;f.x=-S*Math.cos(C),f.y=b,f.z=S*Math.sin(C),m.push(f.x,f.y,f.z),u.copy(f).normalize(),v.push(u.x,u.y,u.z),p.push(A+w,1-E),y.push(c++)}h.push(y)}for(let g=0;g<i;g++)for(let y=0;y<t;y++){const E=h[g][y+1],M=h[g][y],b=h[g+1][y],S=h[g+1][y+1];(g!==0||a>0)&&d.push(E,M,S),(g!==i-1||l<Math.PI)&&d.push(M,b,S)}this.setIndex(d),this.setAttribute("position",new ot(m,3)),this.setAttribute("normal",new ot(v,3)),this.setAttribute("uv",new ot(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Oe(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class Vt extends It{constructor(e=1,t=.4,i=12,n=48,r=Math.PI*2,a=0,o=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:i,tubularSegments:n,arc:r,thetaStart:a,thetaLength:o},i=Math.floor(i),n=Math.floor(n);const l=[],c=[],h=[],f=[],u=new L,d=new L,m=new L;for(let v=0;v<=i;v++){const p=a+v/i*o;for(let g=0;g<=n;g++){const y=g/n*r;d.x=(e+t*Math.cos(p))*Math.cos(y),d.y=(e+t*Math.cos(p))*Math.sin(y),d.z=t*Math.sin(p),c.push(d.x,d.y,d.z),u.x=e*Math.cos(y),u.y=e*Math.sin(y),m.subVectors(d,u).normalize(),h.push(m.x,m.y,m.z),f.push(g/n),f.push(v/i)}}for(let v=1;v<=i;v++)for(let p=1;p<=n;p++){const g=(n+1)*v+p-1,y=(n+1)*(v-1)+p-1,E=(n+1)*(v-1)+p,M=(n+1)*v+p;l.push(g,y,M),l.push(y,E,M)}this.setIndex(l),this.setAttribute("position",new ot(c,3)),this.setAttribute("normal",new ot(h,3)),this.setAttribute("uv",new ot(f,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Vt(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc,e.thetaStart,e.thetaLength)}}function ar(s){const e={};for(const t in s){e[t]={};for(const i in s[t]){const n=s[t][i];if(ju(n))n.isRenderTargetTexture?(je("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][i]=null):e[t][i]=n.clone();else if(Array.isArray(n))if(ju(n[0])){const r=[];for(let a=0,o=n.length;a<o;a++)r[a]=n[a].clone();e[t][i]=r}else e[t][i]=n.slice();else e[t][i]=n}}return e}function gi(s){const e={};for(let t=0;t<s.length;t++){const i=ar(s[t]);for(const n in i)e[n]=i[n]}return e}function ju(s){return s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)}function lg(s){const e=[];for(let t=0;t<s.length;t++)e.push(s[t].clone());return e}function Kf(s){const e=s.getRenderTarget();return e===null?s.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:gt.workingColorSpace}const rn={clone:ar,merge:gi};var cg=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,hg=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Ot extends Dn{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=cg,this.fragmentShader=hg,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=ar(e.uniforms),this.uniformsGroups=lg(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const n in this.uniforms){const a=this.uniforms[n].value;a&&a.isTexture?t.uniforms[n]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[n]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[n]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[n]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[n]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[n]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[n]={type:"m4",value:a.toArray()}:t.uniforms[n]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const i={};for(const n in this.extensions)this.extensions[n]===!0&&(i[n]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(const i in e.uniforms){const n=e.uniforms[i];switch(this.uniforms[i]={},n.type){case"t":this.uniforms[i].value=t[n.value]||null;break;case"c":this.uniforms[i].value=new Te().setHex(n.value);break;case"v2":this.uniforms[i].value=new le().fromArray(n.value);break;case"v3":this.uniforms[i].value=new L().fromArray(n.value);break;case"v4":this.uniforms[i].value=new Ct().fromArray(n.value);break;case"m3":this.uniforms[i].value=new it().fromArray(n.value);break;case"m4":this.uniforms[i].value=new rt().fromArray(n.value);break;default:this.uniforms[i].value=n.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(const i in e.extensions)this.extensions[i]=e.extensions[i];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}}class Yf extends Ot{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class Ut extends Dn{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Te(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Te(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=qr,this.normalScale=new le(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Pn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class Ks extends Ut{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new le(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return ft(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new Te(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new Te(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new Te(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._retroreflectivity=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get retroreflectivity(){return this._retroreflectivity}set retroreflectivity(e){this._retroreflectivity>0!=e>0&&this.version++,this._retroreflectivity=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.retroreflectivity=e.retroreflectivity,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}}class ug extends Dn{constructor(e){super(),this.isMeshNormalMaterial=!0,this.type="MeshNormalMaterial",this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=qr,this.normalScale=new le(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.flatShading=!1,this.setValues(e)}copy(e){return super.copy(e),this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.flatShading=e.flatShading,this}}class dg extends Dn{constructor(e){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new Te(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Te(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=qr,this.normalScale=new le(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Pn,this.combine=rh,this.reflectivity=1,this.envMapIntensity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.envMapIntensity=e.envMapIntensity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class fg extends Dn{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=H0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class pg extends Dn{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}class kh extends Ft{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Te(e),this.intensity=t}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}}class $f extends kh{constructor(e,t,i){super(e,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Ft.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Te(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}toJSON(e){const t=super.toJSON(e);return t.object.groundColor=this.groundColor.getHex(),t}}const vl=new rt,ed=new L,td=new L;class Qf{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new le(512,512),this.mapType=wi,this.map=null,this.mapPass=null,this.matrix=new rt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Th,this._frameExtents=new le(1,1),this._viewportCount=1,this._viewports=[new Ct(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera;ed.setFromMatrixPosition(e.matrixWorld),t.position.copy(ed),td.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(td),t.updateMatrixWorld(),this._updateMatrix(t,this.matrix,this._frustum)}_updateMatrix(e,t,i,n){vl.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),i.setFromProjectionMatrix(vl,e.coordinateSystem,e.reversedDepth);const r=this._frameExtents,a=n?n.z/r.x:1,o=n?n.w/r.y:1,l=n?n.x/r.x:0,c=n?n.y/r.y:0;e.coordinateSystem===Kr||e.reversedDepth?t.set(.5*a,0,0,.5*a+l,0,.5*o,0,.5*o+c,0,0,1,0,0,0,0,1):t.set(.5*a,0,0,.5*a+l,0,.5*o,0,.5*o+c,0,0,.5,.5,0,0,0,1),t.multiply(vl)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return e.intensity=this.intensity,e.bias=this.bias,e.normalBias=this.normalBias,e.radius=this.radius,e.blurSamples=this.blurSamples,e.mapSize=this.mapSize.toArray(),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const Ua=new L,Fa=new un,Ki=new L;class Zf extends Ft{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new rt,this.projectionMatrix=new rt,this.projectionMatrixInverse=new rt,this.coordinateSystem=an,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(Ua,Fa,Ki),Ki.x===1&&Ki.y===1&&Ki.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Ua,Fa,Ki.set(1,1,1)).invert()}updateWorldMatrix(e,t,i=!1){super.updateWorldMatrix(e,t,i),this.matrixWorld.decompose(Ua,Fa,Ki),Ki.x===1&&Ki.y===1&&Ki.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Ua,Fa,Ki.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}}const Hn=new L,id=new le,nd=new le;class Ai extends Zf{constructor(e=50,t=1,i=.1,n=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=n,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=kc*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Vo*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return kc*2*Math.atan(Math.tan(Vo*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,i){Hn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Hn.x,Hn.y).multiplyScalar(-e/Hn.z),Hn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(Hn.x,Hn.y).multiplyScalar(-e/Hn.z)}getViewSize(e,t){return this.getViewBounds(e,id,nd),t.subVectors(nd,id)}setViewOffset(e,t,i,n,r,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=n,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(Vo*.5*this.fov)/this.zoom,i=2*t,n=this.aspect*i,r=-.5*n;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;r+=a.offsetX*n/l,t-=a.offsetY*i/c,n*=a.width/l,i*=a.height/c}const o=this.filmOffset;o!==0&&(r+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+n,t,t-i,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}class mg extends Qf{constructor(){super(new Ai(90,1,.5,500)),this.isPointLightShadow=!0}}class zc extends kh{constructor(e,t,i=0,n=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=i,this.decay=n,this.shadow=new mg}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}toJSON(e){const t=super.toJSON(e);return t.object.distance=this.distance,t.object.decay=this.decay,t.object.shadow=this.shadow.toJSON(),t}}class So extends Zf{constructor(e=-1,t=1,i=1,n=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=n,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,n,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=n,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,n=(this.top+this.bottom)/2;let r=i-e,a=i+e,o=n+t,l=n-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,a=r+c*this.view.width,o-=h*this.view.offsetY,l=o-h*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class gg extends Qf{constructor(){super(new So(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class po extends kh{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Ft.DEFAULT_UP),this.updateMatrix(),this.target=new Ft,this.shadow=new gg}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){const t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}}const Ns=-90,Bs=1;class vg extends Ft{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const n=new Ai(Ns,Bs,e,t);n.layers=this.layers,this.add(n);const r=new Ai(Ns,Bs,e,t);r.layers=this.layers,this.add(r);const a=new Ai(Ns,Bs,e,t);a.layers=this.layers,this.add(a);const o=new Ai(Ns,Bs,e,t);o.layers=this.layers,this.add(o);const l=new Ai(Ns,Bs,e,t);l.layers=this.layers,this.add(l);const c=new Ai(Ns,Bs,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[i,n,r,a,o,l]=t;for(const c of t)this.remove(c);if(e===an)i.up.set(0,1,0),i.lookAt(1,0,0),n.up.set(0,1,0),n.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===Kr)i.up.set(0,-1,0),i.lookAt(-1,0,0),n.up.set(0,-1,0),n.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:n}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,l,c,h]=this.children,f=e.getRenderTarget(),u=e.getActiveCubeFace(),d=e.getActiveMipmapLevel(),m=e.xr.enabled;e.xr.enabled=!1;const v=i.texture.generateMipmaps;i.texture.generateMipmaps=!1;let p=!1;e.isWebGLRenderer===!0?p=e.state.buffers.depth.getReversed():p=e.reversedDepthBuffer,e.setRenderTarget(i,0,n),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,r),e.setRenderTarget(i,1,n),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(i,2,n),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(i,3,n),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),e.setRenderTarget(i,4,n),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),i.texture.generateMipmaps=v,e.setRenderTarget(i,5,n),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,h),e.setRenderTarget(f,u,d),e.xr.enabled=m,i.texture.needsPMREMUpdate=!0}}class xg extends Ai{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}class yg{constructor(){this._previousTime=0,this._currentTime=0,this._startTime=performance.now(),this._delta=0,this._elapsed=0,this._timescale=1,this._document=null,this._pageVisibilityHandler=null}connect(e){this._document=e,e.hidden!==void 0&&(this._pageVisibilityHandler=Mg.bind(this),e.addEventListener("visibilitychange",this._pageVisibilityHandler,!1))}disconnect(){this._pageVisibilityHandler!==null&&(this._document.removeEventListener("visibilitychange",this._pageVisibilityHandler),this._pageVisibilityHandler=null),this._document=null}getDelta(){return this._delta/1e3}getElapsed(){return this._elapsed/1e3}getTimescale(){return this._timescale}setTimescale(e){return this._timescale=e,this}reset(){return this._currentTime=performance.now()-this._startTime,this}dispose(){this.disconnect()}update(e){return this._pageVisibilityHandler!==null&&this._document.hidden===!0?this._delta=0:(this._previousTime=this._currentTime,this._currentTime=(e!==void 0?e:performance.now())-this._startTime,this._delta=(this._currentTime-this._previousTime)*this._timescale,this._elapsed+=this._delta),this}}function Mg(){this._document.hidden===!1&&this.reset()}const Qh=class Qh{constructor(e,t,i,n){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,i,n)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let i=0;i<4;i++)this.elements[i]=e[i+t];return this}set(e,t,i,n){const r=this.elements;return r[0]=e,r[2]=t,r[1]=i,r[3]=n,this}};Qh.prototype.isMatrix2=!0;let sd=Qh;function rd(s,e,t,i){const n=_g(i);switch(t){case Ef:return s*e;case mh:return s*e/n.components*n.byteLength;case gh:return s*e/n.components*n.byteLength;case ms:return s*e*2/n.components*n.byteLength;case vh:return s*e*2/n.components*n.byteLength;case Tf:return s*e*3/n.components*n.byteLength;case Li:return s*e*4/n.components*n.byteLength;case xh:return s*e*4/n.components*n.byteLength;case Za:case Ja:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*8;case ja:case eo:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case rc:case oc:return Math.max(s,16)*Math.max(e,8)/4;case sc:case ac:return Math.max(s,8)*Math.max(e,8)/2;case lc:case cc:case uc:case dc:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*8;case hc:case ro:case fc:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case pc:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case mc:return Math.floor((s+4)/5)*Math.floor((e+3)/4)*16;case gc:return Math.floor((s+4)/5)*Math.floor((e+4)/5)*16;case vc:return Math.floor((s+5)/6)*Math.floor((e+4)/5)*16;case xc:return Math.floor((s+5)/6)*Math.floor((e+5)/6)*16;case yc:return Math.floor((s+7)/8)*Math.floor((e+4)/5)*16;case Mc:return Math.floor((s+7)/8)*Math.floor((e+5)/6)*16;case _c:return Math.floor((s+7)/8)*Math.floor((e+7)/8)*16;case Sc:return Math.floor((s+9)/10)*Math.floor((e+4)/5)*16;case bc:return Math.floor((s+9)/10)*Math.floor((e+5)/6)*16;case Ac:return Math.floor((s+9)/10)*Math.floor((e+7)/8)*16;case wc:return Math.floor((s+9)/10)*Math.floor((e+9)/10)*16;case Ec:return Math.floor((s+11)/12)*Math.floor((e+9)/10)*16;case Tc:return Math.floor((s+11)/12)*Math.floor((e+11)/12)*16;case Cc:case Pc:case Rc:return Math.ceil(s/4)*Math.ceil(e/4)*16;case Lc:case Ic:return Math.ceil(s/4)*Math.ceil(e/4)*8;case ao:case Dc:return Math.ceil(s/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function _g(s){switch(s){case wi:case Sf:return{byteLength:1,components:1};case Xr:case bf:case li:return{byteLength:2,components:1};case fh:case ph:return{byteLength:2,components:4};case cn:case dh:case Bi:return{byteLength:4,components:1};case Af:case wf:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${s}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:sh}}));typeof window<"u"&&(window.__THREE__?je("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=sh);function Jf(){let s=null,e=!1,t=null,i=null;function n(r,a){i=s.requestAnimationFrame(n),t(r,a)}return{start:function(){e!==!0&&t!==null&&s!==null&&(i=s.requestAnimationFrame(n),e=!0)},stop:function(){s!==null&&s.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){s=r}}}function Sg(s){const e=new WeakMap;function t(o,l){const c=o.array,h=o.usage,f=c.byteLength,u=s.createBuffer();s.bindBuffer(l,u),s.bufferData(l,c,h),o.onUploadCallback();let d;if(c instanceof Float32Array)d=s.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)d=s.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?d=s.HALF_FLOAT:d=s.UNSIGNED_SHORT;else if(c instanceof Int16Array)d=s.SHORT;else if(c instanceof Uint32Array)d=s.UNSIGNED_INT;else if(c instanceof Int32Array)d=s.INT;else if(c instanceof Int8Array)d=s.BYTE;else if(c instanceof Uint8Array)d=s.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)d=s.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:u,type:d,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:f}}function i(o,l,c){const h=l.array,f=l.updateRanges;if(s.bindBuffer(c,o),f.length===0)s.bufferSubData(c,0,h);else{f.sort((d,m)=>d.start-m.start);let u=0;for(let d=1;d<f.length;d++){const m=f[u],v=f[d];v.start<=m.start+m.count+1?m.count=Math.max(m.count,v.start+v.count-m.start):(++u,f[u]=v)}f.length=u+1;for(let d=0,m=f.length;d<m;d++){const v=f[d];s.bufferSubData(c,v.start*h.BYTES_PER_ELEMENT,h,v.start,v.count)}l.clearUpdateRanges()}l.onUploadCallback()}function n(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=e.get(o);l&&(s.deleteBuffer(l.buffer),e.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const h=e.get(o);(!h||h.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=e.get(o);if(c===void 0)e.set(o,t(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,o,l),c.version=o.version}}return{get:n,remove:r,update:a}}var bg=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Ag=`#ifdef USE_ALPHAHASH
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
#endif`,wg=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Eg=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Tg=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Cg=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Pg=`#ifdef USE_AOMAP
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
#endif`,Rg=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Lg=`#ifdef USE_BATCHING
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
#endif`,Ig=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Dg=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,kg=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Ug=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Fg=`#ifdef USE_IRIDESCENCE
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
#endif`,Ng=`#ifdef USE_BUMPMAP
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
#endif`,Bg=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Og=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,zg=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Hg=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Gg=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,Vg=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,Wg=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,Xg=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
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
#endif`,qg=`#define PI 3.141592653589793
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
} // validated`,Kg=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Yg=`vec3 transformedNormal = objectNormal;
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
#endif`,$g=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Qg=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Zg=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Jg=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,jg="gl_FragColor = linearToOutputTexel( gl_FragColor );",e1=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,t1=`#ifdef USE_ENVMAP
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
#endif`,i1=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,n1=`#ifdef USE_ENVMAP
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
#endif`,s1=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,r1=`#ifdef USE_ENVMAP
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
#endif`,a1=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,o1=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,l1=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,c1=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,h1=`#ifdef USE_GRADIENTMAP
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
}`,u1=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,d1=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,f1=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,p1=`uniform bool receiveShadow;
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
#include <lightprobes_pars_fragment>`,m1=`#ifdef USE_ENVMAP
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
#endif`,g1=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,v1=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,x1=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,y1=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,M1=`PhysicalMaterial material;
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
#endif`,_1=`uniform sampler2D dfgLUT;
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
}`,S1=`
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
#endif`,b1=`#if defined( RE_IndirectDiffuse )
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
#endif`,A1=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,w1=`#ifdef USE_LIGHT_PROBES_GRID
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
#endif`,E1=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,T1=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,C1=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,P1=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,R1=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,L1=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,I1=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,D1=`#if defined( USE_POINTS_UV )
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
#endif`,k1=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,U1=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,F1=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,N1=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,B1=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,O1=`#ifdef USE_MORPHTARGETS
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
#endif`,z1=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,H1=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,G1=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,V1=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,W1=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,X1=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,q1=`#ifdef USE_NORMALMAP
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
#endif`,K1=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Y1=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,$1=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Q1=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Z1=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,J1=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,j1=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,ev=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,tv=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,iv=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,nv=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,sv=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,rv=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,av=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,ov=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,lv=`float getShadowMask() {
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
}`,cv=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,hv=`#ifdef USE_SKINNING
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
#endif`,uv=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,dv=`#ifdef USE_SKINNING
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
#endif`,fv=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,pv=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,mv=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,gv=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,vv=`#ifdef USE_TRANSMISSION
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
#endif`,xv=`#ifdef USE_TRANSMISSION
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
#endif`,yv=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Mv=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,_v=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Sv=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const bv=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Av=`uniform sampler2D t2D;
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
}`,wv=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Ev=`#ifdef ENVMAP_TYPE_CUBE
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
}`,Tv=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Cv=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Pv=`#include <common>
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
}`,Rv=`#if DEPTH_PACKING == 3200
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
}`,Lv=`#define DISTANCE
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
}`,Iv=`#define DISTANCE
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
}`,Dv=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,kv=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Uv=`uniform float scale;
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
}`,Fv=`uniform vec3 diffuse;
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
}`,Nv=`#include <common>
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
}`,Bv=`uniform vec3 diffuse;
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
}`,Ov=`#define LAMBERT
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
}`,zv=`#define LAMBERT
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
}`,Hv=`#define MATCAP
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
}`,Gv=`#define MATCAP
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
}`,Vv=`#define NORMAL
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
}`,Wv=`#define NORMAL
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
}`,Xv=`#define PHONG
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
}`,qv=`#define PHONG
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
}`,Kv=`#define STANDARD
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
}`,Yv=`#define STANDARD
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
}`,$v=`#define TOON
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
}`,Qv=`#define TOON
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
}`,Zv=`uniform float size;
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
}`,Jv=`uniform vec3 diffuse;
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
}`,jv=`#include <common>
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
}`,ex=`uniform vec3 color;
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
}`,tx=`uniform float rotation;
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
}`,ix=`uniform vec3 diffuse;
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
}`,dt={alphahash_fragment:bg,alphahash_pars_fragment:Ag,alphamap_fragment:wg,alphamap_pars_fragment:Eg,alphatest_fragment:Tg,alphatest_pars_fragment:Cg,aomap_fragment:Pg,aomap_pars_fragment:Rg,batching_pars_vertex:Lg,batching_vertex:Ig,begin_vertex:Dg,beginnormal_vertex:kg,bsdfs:Ug,iridescence_fragment:Fg,bumpmap_pars_fragment:Ng,clipping_planes_fragment:Bg,clipping_planes_pars_fragment:Og,clipping_planes_pars_vertex:zg,clipping_planes_vertex:Hg,color_fragment:Gg,color_pars_fragment:Vg,color_pars_vertex:Wg,color_vertex:Xg,common:qg,cube_uv_reflection_fragment:Kg,defaultnormal_vertex:Yg,displacementmap_pars_vertex:$g,displacementmap_vertex:Qg,emissivemap_fragment:Zg,emissivemap_pars_fragment:Jg,colorspace_fragment:jg,colorspace_pars_fragment:e1,envmap_fragment:t1,envmap_common_pars_fragment:i1,envmap_pars_fragment:n1,envmap_pars_vertex:s1,envmap_physical_pars_fragment:m1,envmap_vertex:r1,fog_vertex:a1,fog_pars_vertex:o1,fog_fragment:l1,fog_pars_fragment:c1,gradientmap_pars_fragment:h1,lightmap_pars_fragment:u1,lights_lambert_fragment:d1,lights_lambert_pars_fragment:f1,lights_pars_begin:p1,lights_toon_fragment:g1,lights_toon_pars_fragment:v1,lights_phong_fragment:x1,lights_phong_pars_fragment:y1,lights_physical_fragment:M1,lights_physical_pars_fragment:_1,lights_fragment_begin:S1,lights_fragment_maps:b1,lights_fragment_end:A1,lightprobes_pars_fragment:w1,logdepthbuf_fragment:E1,logdepthbuf_pars_fragment:T1,logdepthbuf_pars_vertex:C1,logdepthbuf_vertex:P1,map_fragment:R1,map_pars_fragment:L1,map_particle_fragment:I1,map_particle_pars_fragment:D1,metalnessmap_fragment:k1,metalnessmap_pars_fragment:U1,morphinstance_vertex:F1,morphcolor_vertex:N1,morphnormal_vertex:B1,morphtarget_pars_vertex:O1,morphtarget_vertex:z1,normal_fragment_begin:H1,normal_fragment_maps:G1,normal_pars_fragment:V1,normal_pars_vertex:W1,normal_vertex:X1,normalmap_pars_fragment:q1,clearcoat_normal_fragment_begin:K1,clearcoat_normal_fragment_maps:Y1,clearcoat_pars_fragment:$1,iridescence_pars_fragment:Q1,opaque_fragment:Z1,packing:J1,premultiplied_alpha_fragment:j1,project_vertex:ev,dithering_fragment:tv,dithering_pars_fragment:iv,roughnessmap_fragment:nv,roughnessmap_pars_fragment:sv,shadowmap_pars_fragment:rv,shadowmap_pars_vertex:av,shadowmap_vertex:ov,shadowmask_pars_fragment:lv,skinbase_vertex:cv,skinning_pars_vertex:hv,skinning_vertex:uv,skinnormal_vertex:dv,specularmap_fragment:fv,specularmap_pars_fragment:pv,tonemapping_fragment:mv,tonemapping_pars_fragment:gv,transmission_fragment:vv,transmission_pars_fragment:xv,uv_pars_fragment:yv,uv_pars_vertex:Mv,uv_vertex:_v,worldpos_vertex:Sv,background_vert:bv,background_frag:Av,backgroundCube_vert:wv,backgroundCube_frag:Ev,cube_vert:Tv,cube_frag:Cv,depth_vert:Pv,depth_frag:Rv,distance_vert:Lv,distance_frag:Iv,equirect_vert:Dv,equirect_frag:kv,linedashed_vert:Uv,linedashed_frag:Fv,meshbasic_vert:Nv,meshbasic_frag:Bv,meshlambert_vert:Ov,meshlambert_frag:zv,meshmatcap_vert:Hv,meshmatcap_frag:Gv,meshnormal_vert:Vv,meshnormal_frag:Wv,meshphong_vert:Xv,meshphong_frag:qv,meshphysical_vert:Kv,meshphysical_frag:Yv,meshtoon_vert:$v,meshtoon_frag:Qv,points_vert:Zv,points_frag:Jv,shadow_vert:jv,shadow_frag:ex,sprite_vert:tx,sprite_frag:ix},Ee={common:{diffuse:{value:new Te(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new it},alphaMap:{value:null},alphaMapTransform:{value:new it},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new it}},envmap:{envMap:{value:null},envMapRotation:{value:new it},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new it}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new it}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new it},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new it},normalScale:{value:new le(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new it},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new it}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new it}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new it}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Te(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new L},probesMax:{value:new L},probesResolution:{value:new L}},points:{diffuse:{value:new Te(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new it},alphaTest:{value:0},uvTransform:{value:new it}},sprite:{diffuse:{value:new Te(16777215)},opacity:{value:1},center:{value:new le(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new it},alphaMap:{value:null},alphaMapTransform:{value:new it},alphaTest:{value:0}}},ji={basic:{uniforms:gi([Ee.common,Ee.specularmap,Ee.envmap,Ee.aomap,Ee.lightmap,Ee.fog]),vertexShader:dt.meshbasic_vert,fragmentShader:dt.meshbasic_frag},lambert:{uniforms:gi([Ee.common,Ee.specularmap,Ee.envmap,Ee.aomap,Ee.lightmap,Ee.emissivemap,Ee.bumpmap,Ee.normalmap,Ee.displacementmap,Ee.fog,Ee.lights,{emissive:{value:new Te(0)},envMapIntensity:{value:1}}]),vertexShader:dt.meshlambert_vert,fragmentShader:dt.meshlambert_frag},phong:{uniforms:gi([Ee.common,Ee.specularmap,Ee.envmap,Ee.aomap,Ee.lightmap,Ee.emissivemap,Ee.bumpmap,Ee.normalmap,Ee.displacementmap,Ee.fog,Ee.lights,{emissive:{value:new Te(0)},specular:{value:new Te(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:dt.meshphong_vert,fragmentShader:dt.meshphong_frag},standard:{uniforms:gi([Ee.common,Ee.envmap,Ee.aomap,Ee.lightmap,Ee.emissivemap,Ee.bumpmap,Ee.normalmap,Ee.displacementmap,Ee.roughnessmap,Ee.metalnessmap,Ee.fog,Ee.lights,{emissive:{value:new Te(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:dt.meshphysical_vert,fragmentShader:dt.meshphysical_frag},toon:{uniforms:gi([Ee.common,Ee.aomap,Ee.lightmap,Ee.emissivemap,Ee.bumpmap,Ee.normalmap,Ee.displacementmap,Ee.gradientmap,Ee.fog,Ee.lights,{emissive:{value:new Te(0)}}]),vertexShader:dt.meshtoon_vert,fragmentShader:dt.meshtoon_frag},matcap:{uniforms:gi([Ee.common,Ee.bumpmap,Ee.normalmap,Ee.displacementmap,Ee.fog,{matcap:{value:null}}]),vertexShader:dt.meshmatcap_vert,fragmentShader:dt.meshmatcap_frag},points:{uniforms:gi([Ee.points,Ee.fog]),vertexShader:dt.points_vert,fragmentShader:dt.points_frag},dashed:{uniforms:gi([Ee.common,Ee.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:dt.linedashed_vert,fragmentShader:dt.linedashed_frag},depth:{uniforms:gi([Ee.common,Ee.displacementmap]),vertexShader:dt.depth_vert,fragmentShader:dt.depth_frag},normal:{uniforms:gi([Ee.common,Ee.bumpmap,Ee.normalmap,Ee.displacementmap,{opacity:{value:1}}]),vertexShader:dt.meshnormal_vert,fragmentShader:dt.meshnormal_frag},sprite:{uniforms:gi([Ee.sprite,Ee.fog]),vertexShader:dt.sprite_vert,fragmentShader:dt.sprite_frag},background:{uniforms:{uvTransform:{value:new it},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:dt.background_vert,fragmentShader:dt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new it}},vertexShader:dt.backgroundCube_vert,fragmentShader:dt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:dt.cube_vert,fragmentShader:dt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:dt.equirect_vert,fragmentShader:dt.equirect_frag},distance:{uniforms:gi([Ee.common,Ee.displacementmap,{referencePosition:{value:new L},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:dt.distance_vert,fragmentShader:dt.distance_frag},shadow:{uniforms:gi([Ee.lights,Ee.fog,{color:{value:new Te(0)},opacity:{value:1}}]),vertexShader:dt.shadow_vert,fragmentShader:dt.shadow_frag}};ji.physical={uniforms:gi([ji.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new it},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new it},clearcoatNormalScale:{value:new le(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new it},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new it},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new it},sheen:{value:0},sheenColor:{value:new Te(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new it},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new it},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new it},transmissionSamplerSize:{value:new le},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new it},attenuationDistance:{value:0},attenuationColor:{value:new Te(0)},specularColor:{value:new Te(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new it},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new it},anisotropyVector:{value:new le},anisotropyMap:{value:null},anisotropyMapTransform:{value:new it}}]),vertexShader:dt.meshphysical_vert,fragmentShader:dt.meshphysical_frag};const Na={r:0,b:0,g:0},nx=new rt,jf=new it;jf.set(-1,0,0,0,1,0,0,0,1);function sx(s,e,t,i,n,r){const a=new Te(0);let o=n===!0?0:1,l,c,h=null,f=0,u=null;function d(y){let E=y.isScene===!0?y.background:null;if(E&&E.isTexture){const M=y.backgroundBlurriness>0;E=e.get(E,M)}return E}function m(y){let E=!1;const M=d(y);M===null?p(a,o):M&&M.isColor&&(p(M,1),E=!0);const b=s.xr.getEnvironmentBlendMode();b==="additive"?t.buffers.color.setClear(0,0,0,1,r):b==="alpha-blend"&&t.buffers.color.setClear(0,0,0,0,r),(s.autoClear||E)&&(t.buffers.depth.setTest(!0),t.buffers.depth.setMask(!0),t.buffers.color.setMask(!0),s.clear(s.autoClearColor,s.autoClearDepth,s.autoClearStencil))}function v(y,E){const M=d(E);M&&(M.isCubeTexture||M.mapping===Mo)?(c===void 0&&(c=new Ge(new Le(1,1,1),new Ot({name:"BackgroundCubeMaterial",uniforms:ar(ji.backgroundCube.uniforms),vertexShader:ji.backgroundCube.vertexShader,fragmentShader:ji.backgroundCube.fragmentShader,side:Zt,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(b,S,w){this.matrixWorld.copyPosition(w.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(c)),c.material.uniforms.envMap.value=M,c.material.uniforms.backgroundBlurriness.value=E.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=E.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(nx.makeRotationFromEuler(E.backgroundRotation)).transpose(),M.isCubeTexture&&M.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(jf),c.material.toneMapped=gt.getTransfer(M.colorSpace)!==bt,(h!==M||f!==M.version||u!==s.toneMapping)&&(c.material.needsUpdate=!0,h=M,f=M.version,u=s.toneMapping),c.layers.enableAll(),y.unshift(c,c.geometry,c.material,0,0,null)):M&&M.isTexture&&(l===void 0&&(l=new Ge(new Oi(2,2),new Ot({name:"BackgroundMaterial",uniforms:ar(ji.background.uniforms),vertexShader:ji.background.vertexShader,fragmentShader:ji.background.fragmentShader,side:fs,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(l)),l.material.uniforms.t2D.value=M,l.material.uniforms.backgroundIntensity.value=E.backgroundIntensity,l.material.toneMapped=gt.getTransfer(M.colorSpace)!==bt,M.matrixAutoUpdate===!0&&M.updateMatrix(),l.material.uniforms.uvTransform.value.copy(M.matrix),(h!==M||f!==M.version||u!==s.toneMapping)&&(l.material.needsUpdate=!0,h=M,f=M.version,u=s.toneMapping),l.layers.enableAll(),y.unshift(l,l.geometry,l.material,0,0,null))}function p(y,E){y.getRGB(Na,Kf(s)),t.buffers.color.setClear(Na.r,Na.g,Na.b,E,r)}function g(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return a},setClearColor:function(y,E=1){a.set(y),o=E,p(a,o)},getClearAlpha:function(){return o},setClearAlpha:function(y){o=y,p(a,o)},render:m,addToRenderList:v,dispose:g}}function rx(s,e){const t=s.getParameter(s.MAX_VERTEX_ATTRIBS),i={},n=u(null);let r=n,a=!1;function o(R,D,B,k,N){let G=!1;const H=f(R,k,B,D);r!==H&&(r=H,c(r.object)),G=d(R,k,B,N),G&&m(R,k,B,N),N!==null&&e.update(N,s.ELEMENT_ARRAY_BUFFER),(G||a)&&(a=!1,M(R,D,B,k),N!==null&&s.bindBuffer(s.ELEMENT_ARRAY_BUFFER,e.get(N).buffer))}function l(){return s.createVertexArray()}function c(R){return s.bindVertexArray(R)}function h(R){return s.deleteVertexArray(R)}function f(R,D,B,k){const N=k.wireframe===!0;let G=i[D.id];G===void 0&&(G={},i[D.id]=G);const H=R.isInstancedMesh===!0?R.id:0;let se=G[H];se===void 0&&(se={},G[H]=se);let V=se[B.id];V===void 0&&(V={},se[B.id]=V);let j=V[N];return j===void 0&&(j=u(l()),V[N]=j),j}function u(R){const D=[],B=[],k=[];for(let N=0;N<t;N++)D[N]=0,B[N]=0,k[N]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:D,enabledAttributes:B,attributeDivisors:k,object:R,attributes:{},index:null}}function d(R,D,B,k){const N=r.attributes,G=D.attributes;let H=0;const se=B.getAttributes();for(const V in se)if(se[V].location>=0){const J=N[V];let we=G[V];if(we===void 0&&(V==="instanceMatrix"&&R.instanceMatrix&&(we=R.instanceMatrix),V==="instanceColor"&&R.instanceColor&&(we=R.instanceColor)),J===void 0||J.attribute!==we||we&&J.data!==we.data)return!0;H++}return r.attributesNum!==H||r.index!==k}function m(R,D,B,k){const N={},G=D.attributes;let H=0;const se=B.getAttributes();for(const V in se)if(se[V].location>=0){let J=G[V];J===void 0&&(V==="instanceMatrix"&&R.instanceMatrix&&(J=R.instanceMatrix),V==="instanceColor"&&R.instanceColor&&(J=R.instanceColor));const we={};we.attribute=J,J&&J.data&&(we.data=J.data),N[V]=we,H++}r.attributes=N,r.attributesNum=H,r.index=k}function v(){const R=r.newAttributes;for(let D=0,B=R.length;D<B;D++)R[D]=0}function p(R){g(R,0)}function g(R,D){const B=r.newAttributes,k=r.enabledAttributes,N=r.attributeDivisors;B[R]=1,k[R]===0&&(s.enableVertexAttribArray(R),k[R]=1),N[R]!==D&&(s.vertexAttribDivisor(R,D),N[R]=D)}function y(){const R=r.newAttributes,D=r.enabledAttributes;for(let B=0,k=D.length;B<k;B++)D[B]!==R[B]&&(s.disableVertexAttribArray(B),D[B]=0)}function E(R,D,B,k,N,G,H){H===!0?s.vertexAttribIPointer(R,D,B,N,G):s.vertexAttribPointer(R,D,B,k,N,G)}function M(R,D,B,k){v();const N=k.attributes,G=B.getAttributes(),H=D.defaultAttributeValues;for(const se in G){const V=G[se];if(V.location>=0){let j=N[se];if(j===void 0&&(se==="instanceMatrix"&&R.instanceMatrix&&(j=R.instanceMatrix),se==="instanceColor"&&R.instanceColor&&(j=R.instanceColor)),j!==void 0){const J=j.normalized,we=j.itemSize,ce=e.get(j);if(ce===void 0)continue;const ct=ce.buffer,tt=ce.type,Je=ce.bytesPerElement,q=tt===s.INT||tt===s.UNSIGNED_INT||j.gpuType===dh;if(j.isInterleavedBufferAttribute){const te=j.data,ee=te.stride,be=j.offset;if(te.isInstancedInterleavedBuffer){for(let Me=0;Me<V.locationSize;Me++)g(V.location+Me,te.meshPerAttribute);R.isInstancedMesh!==!0&&k._maxInstanceCount===void 0&&(k._maxInstanceCount=te.meshPerAttribute*te.count)}else for(let Me=0;Me<V.locationSize;Me++)p(V.location+Me);s.bindBuffer(s.ARRAY_BUFFER,ct);for(let Me=0;Me<V.locationSize;Me++)E(V.location+Me,we/V.locationSize,tt,J,ee*Je,(be+we/V.locationSize*Me)*Je,q)}else{if(j.isInstancedBufferAttribute){for(let te=0;te<V.locationSize;te++)g(V.location+te,j.meshPerAttribute);R.isInstancedMesh!==!0&&k._maxInstanceCount===void 0&&(k._maxInstanceCount=j.meshPerAttribute*j.count)}else for(let te=0;te<V.locationSize;te++)p(V.location+te);s.bindBuffer(s.ARRAY_BUFFER,ct);for(let te=0;te<V.locationSize;te++)E(V.location+te,we/V.locationSize,tt,J,we*Je,we/V.locationSize*te*Je,q)}}else if(H!==void 0){const J=H[se];if(J!==void 0)switch(J.length){case 2:s.vertexAttrib2fv(V.location,J);break;case 3:s.vertexAttrib3fv(V.location,J);break;case 4:s.vertexAttrib4fv(V.location,J);break;default:s.vertexAttrib1fv(V.location,J)}}}}y()}function b(){A();for(const R in i){const D=i[R];for(const B in D){const k=D[B];for(const N in k){const G=k[N];for(const H in G)h(G[H].object),delete G[H];delete k[N]}}delete i[R]}}function S(R){if(i[R.id]===void 0)return;const D=i[R.id];for(const B in D){const k=D[B];for(const N in k){const G=k[N];for(const H in G)h(G[H].object),delete G[H];delete k[N]}}delete i[R.id]}function w(R){for(const D in i){const B=i[D];for(const k in B){const N=B[k];if(N[R.id]===void 0)continue;const G=N[R.id];for(const H in G)h(G[H].object),delete G[H];delete N[R.id]}}}function x(R){for(const D in i){const B=i[D],k=R.isInstancedMesh===!0?R.id:0,N=B[k];if(N!==void 0){for(const G in N){const H=N[G];for(const se in H)h(H[se].object),delete H[se];delete N[G]}delete B[k],Object.keys(B).length===0&&delete i[D]}}}function A(){C(),a=!0,r!==n&&(r=n,c(r.object))}function C(){n.geometry=null,n.program=null,n.wireframe=!1}return{setup:o,reset:A,resetDefaultState:C,dispose:b,releaseStatesOfGeometry:S,releaseStatesOfObject:x,releaseStatesOfProgram:w,initAttributes:v,enableAttribute:p,disableUnusedAttributes:y}}function ax(s,e,t){let i;function n(l){i=l}function r(l,c){s.drawArrays(i,l,c),t.update(c,i,1)}function a(l,c,h){h!==0&&(s.drawArraysInstanced(i,l,c,h),t.update(c,i,h))}function o(l,c,h){if(h===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,l,0,c,0,h);let u=0;for(let d=0;d<h;d++)u+=c[d];t.update(u,i,1)}this.setMode=n,this.render=r,this.renderInstances=a,this.renderMultiDraw=o}function ox(s,e,t,i){let n;function r(){if(n!==void 0)return n;if(e.has("EXT_texture_filter_anisotropic")===!0){const w=e.get("EXT_texture_filter_anisotropic");n=s.getParameter(w.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else n=0;return n}function a(w){return!(w!==Li&&i.convert(w)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(w){const x=w===li&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(w!==wi&&w!==Bi&&!x&&i.convert(w)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_TYPE))}function l(w){if(w==="highp"){if(s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.HIGH_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.HIGH_FLOAT).precision>0)return"highp";w="mediump"}return w==="mediump"&&s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.MEDIUM_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp";const h=l(c);h!==c&&(je("WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);const f=t.logarithmicDepthBuffer===!0,u=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control");t.reversedDepthBuffer===!0&&u===!1&&je("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");const d=s.getParameter(s.MAX_TEXTURE_IMAGE_UNITS),m=s.getParameter(s.MAX_VERTEX_TEXTURE_IMAGE_UNITS),v=s.getParameter(s.MAX_TEXTURE_SIZE),p=s.getParameter(s.MAX_CUBE_MAP_TEXTURE_SIZE),g=s.getParameter(s.MAX_VERTEX_ATTRIBS),y=s.getParameter(s.MAX_VERTEX_UNIFORM_VECTORS),E=s.getParameter(s.MAX_VARYING_VECTORS),M=s.getParameter(s.MAX_FRAGMENT_UNIFORM_VECTORS),b=s.getParameter(s.MAX_SAMPLES),S=s.getParameter(s.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:f,reversedDepthBuffer:u,maxTextures:d,maxVertexTextures:m,maxTextureSize:v,maxCubemapSize:p,maxAttributes:g,maxVertexUniforms:y,maxVaryings:E,maxFragmentUniforms:M,maxSamples:b,samples:S}}function lx(s){const e=this;let t=null,i=0,n=!1,r=!1;const a=new qn,o=new it,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(f,u){const d=f.length!==0||u||i!==0||n;return n=u,i=f.length,d},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(f,u){t=h(f,u,0)},this.setState=function(f,u,d){const m=f.clippingPlanes,v=f.clipIntersection,p=f.clipShadows,g=s.get(f);if(!n||m===null||m.length===0||r&&!p)r?h(null):c();else{const y=r?0:i,E=y*4;let M=g.clippingState||null;l.value=M,M=h(m,u,E,d);for(let b=0;b!==E;++b)M[b]=t[b];g.clippingState=M,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=y}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function h(f,u,d,m){const v=f!==null?f.length:0;let p=null;if(v!==0){if(p=l.value,m!==!0||p===null){const g=d+v*4,y=u.matrixWorldInverse;o.getNormalMatrix(y),(p===null||p.length<g)&&(p=new Float32Array(g));for(let E=0,M=d;E!==v;++E,M+=4)a.copy(f[E]).applyMatrix4(y,o),a.normal.toArray(p,M),p[M+3]=a.constant}l.value=p,l.needsUpdate=!0}return e.numPlanes=v,e.numIntersection=0,p}}const Ys=4,cx=6,hx=20,ux=256,Ar=new So,ad=new Te;let xl=null,yl=0,Ml=0,_l=!1;const dx=new L,rs=new L;class Hc{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,i=.1,n=100,r={}){const{size:a=256,position:o=dx}=r;xl=this._renderer.getRenderTarget(),yl=this._renderer.getActiveCubeFace(),Ml=this._renderer.getActiveMipmapLevel(),_l=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);const l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,i,n,l,o),t>0&&this._blur(l,0,0,t),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=cd(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=ld(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(xl,yl,Ml),this._renderer.xr.enabled=_l,e.scissorTest=!1,Os(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===ps||e.mapping===tr?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),xl=this._renderer.getRenderTarget(),yl=this._renderer.getActiveCubeFace(),Ml=this._renderer.getActiveMipmapLevel(),_l=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=t||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,i={magFilter:di,minFilter:di,generateMipmaps:!1,type:li,format:Li,colorSpace:oo,depthBuffer:!1},n=od(e,t,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=od(e,t,i);const{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods}=fx(r)),this._blurMaterial=mx(r,e,t),this._ggxMaterial=px(r,e,t)}return n}_compileMaterial(e){const t=new Ge(new It,e);this._renderer.compile(t,Ar)}_sceneToCubeUV(e,t,i,n,r){const l=new Ai(90,1,t,i),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],f=this._renderer,u=f.autoClear,d=f.toneMapping;f.getClearColor(ad),f.toneMapping=on,f.autoClear=!1,f.state.buffers.depth.getReversed()&&(f.setRenderTarget(n),f.clearDepth(),f.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new Ge(new Le,new _i({name:"PMREM.Background",side:Zt,depthWrite:!1,depthTest:!1})));const v=this._backgroundBox,p=v.material;let g=!1;const y=e.background;y?y.isColor&&(p.color.copy(y),e.background=null,g=!0):(p.color.copy(ad),g=!0);for(let E=0;E<6;E++){const M=E%3;M===0?(l.up.set(0,c[E],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+h[E],r.y,r.z)):M===1?(l.up.set(0,0,c[E]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+h[E],r.z)):(l.up.set(0,c[E],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+h[E]));const b=this._cubeSize;Os(n,M*b,E>2?b:0,b,b),f.setRenderTarget(n),g&&f.render(v,l),f.render(e,l)}f.toneMapping=d,f.autoClear=u,e.background=y}_textureToCubeUV(e,t){const i=this._renderer,n=e.mapping===ps||e.mapping===tr;n?(this._cubemapMaterial===null&&(this._cubemapMaterial=cd()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=ld());const r=n?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=r;const o=r.uniforms;o.envMap.value=e;const l=this._cubeSize;Os(t,0,0,3*l,2*l),i.setRenderTarget(t),i.render(a,Ar)}_applyPMREM(e){const t=this._renderer,i=t.autoClear;t.autoClear=!1;const n=this._lodMeshes.length;for(let r=1;r<n;r++)this._applyGGXFilter(e,r-1,r);t.autoClear=i}_applyGGXFilter(e,t,i){const n=this._renderer,r=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[i];o.material=a;const l=a.uniforms,c=i/(this._lodMeshes.length-1),h=t/(this._lodMeshes.length-1),f=Math.sqrt(c*c-h*h),u=c*1.25,d=f*u,{_lodMax:m}=this,v=this._sizeLods[i],p=3*v*(i>m-Ys?i-m+Ys:0),g=4*(this._cubeSize-v);l.envMap.value=e.texture,l.roughness.value=d,l.mipInt.value=m-t,Os(r,p,g,3*v,2*v),n.setRenderTarget(r),n.render(o,Ar),l.envMap.value=r.texture,l.roughness.value=0,l.mipInt.value=m-i,Os(e,p,g,3*v,2*v),n.setRenderTarget(e),n.render(o,Ar)}_blur(e,t,i,n){const r=this._pingPongRenderTarget,a=Math.min(n,Math.PI)/Math.SQRT2;this._blurPass(e,r,t,i,a),this._blurPass(r,e,i,i,a)}_blurPass(e,t,i,n,r){const a=this._renderer,o=this._blurMaterial,l=this._lodMeshes[n];l.material=o;const c=o.uniforms;c.envMap.value=e.texture,c.sigma.value=r,c.mipInt.value=this._lodMax-i;const h=this._sizeLods[n],f=3*h*(n>this._lodMax-Ys?n-this._lodMax+Ys:0),u=4*(this._cubeSize-h);Os(t,f,u,3*h,2*h),a.setRenderTarget(t),a.render(l,Ar)}}function fx(s){const e=[],t=[];let i=s;const n=s-Ys+1+cx;for(let r=0;r<n;r++){const a=Math.pow(2,i);e.push(a);const o=1/(a-2),l=-o,c=1+o,h=[l,l,c,l,c,c,l,l,c,c,l,c],f=6,u=6,d=3,m=new Float32Array(d*u*f),v=new Float32Array(d*u*f);for(let g=0;g<f;g++){const y=g%3*2/3-1,E=g>2?0:-1,M=[y,E,0,y+2/3,E,0,y+2/3,E+1,0,y,E,0,y+2/3,E+1,0,y,E+1,0];m.set(M,d*u*g);for(let b=0;b<u;b++){const S=h[b*2]*2-1,w=h[b*2+1]*2-1;g===0?rs.set(1,w,S):g===1?rs.set(-S,1,-w):g===2?rs.set(-S,w,1):g===3?rs.set(-1,w,-S):g===4?rs.set(-S,-1,w):rs.set(S,w,-1),rs.toArray(v,(g*u+b)*d)}}const p=new It;p.setAttribute("position",new ri(m,d)),p.setAttribute("outputDirection",new ri(v,d)),t.push(new Ge(p,null)),i>Ys&&i--}return{lodMeshes:t,sizeLods:e}}function od(s,e,t){const i=new ai(s,e,t);return i.texture.mapping=Mo,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function Os(s,e,t,i,n){s.viewport.set(e,t,i,n),s.scissor.set(e,t,i,n)}function px(s,e,t){return new Ot({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:ux,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:bo(),fragmentShader:`

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
		`,blending:ni,depthTest:!1,depthWrite:!1})}function mx(s,e,t){return new Ot({name:"SphericalGaussianBlur",defines:{SAMPLES:hx,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},sigma:{value:0},mipInt:{value:0}},vertexShader:bo(),fragmentShader:`

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
		`,blending:ni,depthTest:!1,depthWrite:!1})}function ld(){return new Ot({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:bo(),fragmentShader:`

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
		`,blending:ni,depthTest:!1,depthWrite:!1})}function cd(){return new Ot({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:bo(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:ni,depthTest:!1,depthWrite:!1})}function bo(){return`

		precision mediump float;
		precision mediump int;

		attribute vec3 outputDirection;

		varying vec3 vOutputDirection;

		void main() {

			vOutputDirection = outputDirection;
			gl_Position = vec4( position, 1.0 );

		}
	`}class ep extends ai{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},n=[i,i,i,i,i,i];this.texture=new Nf(n),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},n=new Le(5,5,5),r=new Ot({name:"CubemapFromEquirect",uniforms:ar(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:Zt,blending:ni});r.uniforms.tEquirect.value=t;const a=new Ge(n,r),o=t.minFilter;return t.minFilter===us&&(t.minFilter=di),new vg(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,i=!0,n=!0){const r=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,i,n);e.setRenderTarget(r)}}function gx(s){let e=new WeakMap,t=new WeakMap,i=null;function n(u,d=!1){return u==null?null:d?a(u):r(u)}function r(u){if(u&&u.isTexture){const d=u.mapping;if(d===Oo||d===zo)if(e.has(u)){const m=e.get(u).texture;return o(m,u.mapping)}else{const m=u.image;if(m&&m.height>0){const v=new ep(m.height);return v.fromEquirectangularTexture(s,u),e.set(u,v),u.addEventListener("dispose",c),o(v.texture,u.mapping)}else return null}}return u}function a(u){if(u&&u.isTexture){const d=u.mapping,m=d===Oo||d===zo,v=d===ps||d===tr;if(m||v){let p=t.get(u);const g=p!==void 0?p.texture.pmremVersion:0;if(u.isRenderTargetTexture&&u.pmremVersion!==g)return i===null&&(i=new Hc(s)),p=m?i.fromEquirectangular(u,p):i.fromCubemap(u,p),p.texture.pmremVersion=u.pmremVersion,t.set(u,p),p.texture;if(p!==void 0)return p.texture;{const y=u.image;return m&&y&&y.height>0||v&&y&&l(y)?(i===null&&(i=new Hc(s)),p=m?i.fromEquirectangular(u):i.fromCubemap(u),p.texture.pmremVersion=u.pmremVersion,t.set(u,p),u.addEventListener("dispose",h),p.texture):null}}}return u}function o(u,d){return d===Oo?u.mapping=ps:d===zo&&(u.mapping=tr),u}function l(u){let d=0;const m=6;for(let v=0;v<m;v++)u[v]!==void 0&&d++;return d===m}function c(u){const d=u.target;d.removeEventListener("dispose",c);const m=e.get(d);m!==void 0&&(e.delete(d),m.dispose())}function h(u){const d=u.target;d.removeEventListener("dispose",h);const m=t.get(d);m!==void 0&&(t.delete(d),m.dispose())}function f(){e=new WeakMap,t=new WeakMap,i!==null&&(i.dispose(),i=null)}return{get:n,dispose:f}}function vx(s){const e={};function t(i){if(e[i]!==void 0)return e[i];const n=s.getExtension(i);return e[i]=n,n}return{has:function(i){return t(i)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(i){const n=t(i);return n===null&&Zs("WebGLRenderer: "+i+" extension not supported."),n}}}function xx(s,e,t,i){const n={},r=new WeakMap;function a(f){const u=f.target;u.index!==null&&e.remove(u.index);for(const m in u.attributes)e.remove(u.attributes[m]);u.removeEventListener("dispose",a),delete n[u.id];const d=r.get(u);d&&(e.remove(d),r.delete(u)),i.releaseStatesOfGeometry(u),u.isInstancedBufferGeometry===!0&&delete u._maxInstanceCount,t.memory.geometries--}function o(f,u){return n[u.id]===!0||(u.addEventListener("dispose",a),n[u.id]=!0,t.memory.geometries++),u}function l(f){const u=f.attributes;for(const d in u)e.update(u[d],s.ARRAY_BUFFER)}function c(f){const u=[],d=f.index,m=f.attributes.position;let v=0;if(m===void 0)return;if(d!==null){const y=d.array;v=d.version;for(let E=0,M=y.length;E<M;E+=3){const b=y[E+0],S=y[E+1],w=y[E+2];u.push(b,S,S,w,w,b)}}else{const y=m.array;v=m.version;for(let E=0,M=y.length/3-1;E<M;E+=3){const b=E+0,S=E+1,w=E+2;u.push(b,S,S,w,w,b)}}const p=new(m.count>=65535?Df:bh)(u,1);p.version=v;const g=r.get(f);g&&e.remove(g),r.set(f,p)}function h(f){const u=r.get(f);if(u){const d=f.index;d!==null&&u.version<d.version&&c(f)}else c(f);return r.get(f)}return{get:o,update:l,getWireframeAttribute:h}}function yx(s,e,t){let i;function n(f){i=f}let r,a;function o(f){r=f.type,a=f.bytesPerElement}function l(f,u){s.drawElements(i,u,r,f*a),t.update(u,i,1)}function c(f,u,d){d!==0&&(s.drawElementsInstanced(i,u,r,f*a,d),t.update(u,i,d))}function h(f,u,d){if(d===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,u,0,r,f,0,d);let v=0;for(let p=0;p<d;p++)v+=u[p];t.update(v,i,1)}this.setMode=n,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=h}function Mx(s){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(r,a,o){switch(t.calls++,a){case s.TRIANGLES:t.triangles+=o*(r/3);break;case s.LINES:t.lines+=o*(r/2);break;case s.LINE_STRIP:t.lines+=o*(r-1);break;case s.LINE_LOOP:t.lines+=o*r;break;case s.POINTS:t.points+=o*r;break;default:vt("WebGLInfo: Unknown draw mode:",a);break}}function n(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:n,update:i}}function _x(s,e,t){const i=new WeakMap,n=new Ct;function r(a,o,l){const c=a.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,f=h!==void 0?h.length:0;let u=i.get(o);if(u===void 0||u.count!==f){let C=function(){x.dispose(),i.delete(o),o.removeEventListener("dispose",C)};var d=C;u!==void 0&&u.texture.dispose();const m=o.morphAttributes.position!==void 0,v=o.morphAttributes.normal!==void 0,p=o.morphAttributes.color!==void 0,g=o.morphAttributes.position||[],y=o.morphAttributes.normal||[],E=o.morphAttributes.color||[];let M=0;m===!0&&(M=1),v===!0&&(M=2),p===!0&&(M=3);let b=o.attributes.position.count*M,S=1;b>e.maxTextureSize&&(S=Math.ceil(b/e.maxTextureSize),b=e.maxTextureSize);const w=new Float32Array(b*S*4*f),x=new Rf(w,b,S,f);x.type=Bi,x.needsUpdate=!0;const A=M*4;for(let R=0;R<f;R++){const D=g[R],B=y[R],k=E[R],N=b*S*4*R;for(let G=0;G<D.count;G++){const H=G*A;m===!0&&(n.fromBufferAttribute(D,G),w[N+H+0]=n.x,w[N+H+1]=n.y,w[N+H+2]=n.z,w[N+H+3]=0),v===!0&&(n.fromBufferAttribute(B,G),w[N+H+4]=n.x,w[N+H+5]=n.y,w[N+H+6]=n.z,w[N+H+7]=0),p===!0&&(n.fromBufferAttribute(k,G),w[N+H+8]=n.x,w[N+H+9]=n.y,w[N+H+10]=n.z,w[N+H+11]=k.itemSize===4?n.w:1)}}u={count:f,texture:x,size:new le(b,S)},i.set(o,u),o.addEventListener("dispose",C)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(s,"morphTexture",a.morphTexture,t);else{let m=0;for(let p=0;p<c.length;p++)m+=c[p];const v=o.morphTargetsRelative?1:1-m;l.getUniforms().setValue(s,"morphTargetBaseInfluence",v),l.getUniforms().setValue(s,"morphTargetInfluences",c)}l.getUniforms().setValue(s,"morphTargetsTexture",u.texture,t),l.getUniforms().setValue(s,"morphTargetsTextureSize",u.size)}return{update:r}}function Sx(s,e,t,i,n){let r=new WeakMap;function a(c){const h=n.render.frame,f=c.geometry,u=e.get(c,f);if(r.get(u)!==h&&(e.update(u),r.set(u,h)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),r.get(c)!==h&&(t.update(c.instanceMatrix,s.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,s.ARRAY_BUFFER),r.set(c,h))),c.isSkinnedMesh){const d=c.skeleton;r.get(d)!==h&&(d.update(),r.set(d,h))}return u}function o(){r=new WeakMap}function l(c){const h=c.target;h.removeEventListener("dispose",l),i.releaseStatesOfObject(h),t.remove(h.instanceMatrix),h.instanceColor!==null&&t.remove(h.instanceColor)}return{update:a,dispose:o}}const bx={[ah]:"LINEAR_TONE_MAPPING",[oh]:"REINHARD_TONE_MAPPING",[lh]:"CINEON_TONE_MAPPING",[jr]:"ACES_FILMIC_TONE_MAPPING",[hh]:"AGX_TONE_MAPPING",[uh]:"NEUTRAL_TONE_MAPPING",[ch]:"CUSTOM_TONE_MAPPING"};function Ax(s,e,t,i,n,r){const a=new ai(e,t,{type:s,depthBuffer:n,stencilBuffer:r,samples:i?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1});let o=null,l=null;const c=new It;c.setAttribute("position",new ot([-1,3,0,-1,-1,0,3,-1,0],3)),c.setAttribute("uv",new ot([0,2,0,0,2,0],2));const h=new Yf({uniforms:{tDiffuse:{value:null}},vertexShader:`
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
			}`,depthTest:!1,depthWrite:!1}),f=new Ge(c,h),u=new So(-1,1,1,-1,0,1);let d=null,m=null,v=!1,p,g=null,y=[],E=!1;this.setSize=function(M,b){a.setSize(M,b),o!==null&&o.setSize(M,b),l!==null&&l.setSize(M,b);for(let S=0;S<y.length;S++){const w=y[S];w.setSize&&w.setSize(M,b)}},this.setEffects=function(M){y=M,E=y.length>0&&y[0].isRenderPass===!0;const b=a.width,S=a.height;y.length>0&&o===null&&(o=new ai(b,S,{type:li,depthBuffer:!1,stencilBuffer:!1}),l=new ai(b,S,{type:li,depthBuffer:!1,stencilBuffer:!1}));for(let w=0;w<y.length;w++){const x=y[w];x.setSize&&x.setSize(b,S)}},this.begin=function(M,b){if(v||M.toneMapping===on&&y.length===0)return!1;if(g=b,b!==null){const S=b.width,w=b.height;(a.width!==S||a.height!==w)&&this.setSize(S,w)}return E===!1&&M.setRenderTarget(a),p=M.toneMapping,M.toneMapping=on,!0},this.hasRenderPass=function(){return E},this.end=function(M,b){M.toneMapping=p,v=!0;let S=a,w=o;for(let x=0;x<y.length;x++){const A=y[x];A.enabled!==!1&&(A.render(M,w,S,b),A.needsSwap!==!1&&(S=w,w=w===o?l:o))}if(d!==M.outputColorSpace||m!==M.toneMapping){d=M.outputColorSpace,m=M.toneMapping,h.defines={},gt.getTransfer(d)===bt&&(h.defines.SRGB_TRANSFER="");const x=bx[m];x&&(h.defines[x]=""),h.needsUpdate=!0}h.uniforms.tDiffuse.value=S.texture,M.setRenderTarget(g),M.render(f,u),g=null,v=!1},this.isCompositing=function(){return v},this.dispose=function(){a.dispose(),o!==null&&o.dispose(),l!==null&&l.dispose(),c.dispose(),h.dispose()}}const tp=new fi,Gc=new sr(1,1),ip=new Rf,np=new am,sp=new Nf,hd=[],ud=[],dd=new Float32Array(16),fd=new Float32Array(9),pd=new Float32Array(4);function hr(s,e,t){const i=s[0];if(i<=0||i>0)return s;const n=e*t;let r=hd[n];if(r===void 0&&(r=new Float32Array(n),hd[n]=r),e!==0){i.toArray(r,0);for(let a=1,o=0;a!==e;++a)o+=t,s[a].toArray(r,o)}return r}function Jt(s,e){if(s.length!==e.length)return!1;for(let t=0,i=s.length;t<i;t++)if(s[t]!==e[t])return!1;return!0}function jt(s,e){for(let t=0,i=e.length;t<i;t++)s[t]=e[t]}function Ao(s,e){let t=ud[e];t===void 0&&(t=new Int32Array(e),ud[e]=t);for(let i=0;i!==e;++i)t[i]=s.allocateTextureUnit();return t}function wx(s,e){const t=this.cache;t[0]!==e&&(s.uniform1f(this.addr,e),t[0]=e)}function Ex(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Jt(t,e))return;s.uniform2fv(this.addr,e),jt(t,e)}}function Tx(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(s.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Jt(t,e))return;s.uniform3fv(this.addr,e),jt(t,e)}}function Cx(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Jt(t,e))return;s.uniform4fv(this.addr,e),jt(t,e)}}function Px(s,e){const t=this.cache,i=e.elements;if(i===void 0){if(Jt(t,e))return;s.uniformMatrix2fv(this.addr,!1,e),jt(t,e)}else{if(Jt(t,i))return;pd.set(i),s.uniformMatrix2fv(this.addr,!1,pd),jt(t,i)}}function Rx(s,e){const t=this.cache,i=e.elements;if(i===void 0){if(Jt(t,e))return;s.uniformMatrix3fv(this.addr,!1,e),jt(t,e)}else{if(Jt(t,i))return;fd.set(i),s.uniformMatrix3fv(this.addr,!1,fd),jt(t,i)}}function Lx(s,e){const t=this.cache,i=e.elements;if(i===void 0){if(Jt(t,e))return;s.uniformMatrix4fv(this.addr,!1,e),jt(t,e)}else{if(Jt(t,i))return;dd.set(i),s.uniformMatrix4fv(this.addr,!1,dd),jt(t,i)}}function Ix(s,e){const t=this.cache;t[0]!==e&&(s.uniform1i(this.addr,e),t[0]=e)}function Dx(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Jt(t,e))return;s.uniform2iv(this.addr,e),jt(t,e)}}function kx(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Jt(t,e))return;s.uniform3iv(this.addr,e),jt(t,e)}}function Ux(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Jt(t,e))return;s.uniform4iv(this.addr,e),jt(t,e)}}function Fx(s,e){const t=this.cache;t[0]!==e&&(s.uniform1ui(this.addr,e),t[0]=e)}function Nx(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Jt(t,e))return;s.uniform2uiv(this.addr,e),jt(t,e)}}function Bx(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Jt(t,e))return;s.uniform3uiv(this.addr,e),jt(t,e)}}function Ox(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Jt(t,e))return;s.uniform4uiv(this.addr,e),jt(t,e)}}function zx(s,e,t){const i=this.cache,n=t.allocateTextureUnit();i[0]!==n&&(s.uniform1i(this.addr,n),i[0]=n);let r;this.type===s.SAMPLER_2D_SHADOW?(Gc.compareFunction=t.isReversedDepthBuffer()?Mh:yh,r=Gc):r=tp,t.setTexture2D(e||r,n)}function Hx(s,e,t){const i=this.cache,n=t.allocateTextureUnit();i[0]!==n&&(s.uniform1i(this.addr,n),i[0]=n),t.setTexture3D(e||np,n)}function Gx(s,e,t){const i=this.cache,n=t.allocateTextureUnit();i[0]!==n&&(s.uniform1i(this.addr,n),i[0]=n),t.setTextureCube(e||sp,n)}function Vx(s,e,t){const i=this.cache,n=t.allocateTextureUnit();i[0]!==n&&(s.uniform1i(this.addr,n),i[0]=n),t.setTexture2DArray(e||ip,n)}function Wx(s){switch(s){case 5126:return wx;case 35664:return Ex;case 35665:return Tx;case 35666:return Cx;case 35674:return Px;case 35675:return Rx;case 35676:return Lx;case 5124:case 35670:return Ix;case 35667:case 35671:return Dx;case 35668:case 35672:return kx;case 35669:case 35673:return Ux;case 5125:return Fx;case 36294:return Nx;case 36295:return Bx;case 36296:return Ox;case 35678:case 36198:case 36298:case 36306:case 35682:return zx;case 35679:case 36299:case 36307:return Hx;case 35680:case 36300:case 36308:case 36293:return Gx;case 36289:case 36303:case 36311:case 36292:return Vx}}function Xx(s,e){s.uniform1fv(this.addr,e)}function qx(s,e){const t=hr(e,this.size,2);s.uniform2fv(this.addr,t)}function Kx(s,e){const t=hr(e,this.size,3);s.uniform3fv(this.addr,t)}function Yx(s,e){const t=hr(e,this.size,4);s.uniform4fv(this.addr,t)}function $x(s,e){const t=hr(e,this.size,4);s.uniformMatrix2fv(this.addr,!1,t)}function Qx(s,e){const t=hr(e,this.size,9);s.uniformMatrix3fv(this.addr,!1,t)}function Zx(s,e){const t=hr(e,this.size,16);s.uniformMatrix4fv(this.addr,!1,t)}function Jx(s,e){s.uniform1iv(this.addr,e)}function jx(s,e){s.uniform2iv(this.addr,e)}function ey(s,e){s.uniform3iv(this.addr,e)}function ty(s,e){s.uniform4iv(this.addr,e)}function iy(s,e){s.uniform1uiv(this.addr,e)}function ny(s,e){s.uniform2uiv(this.addr,e)}function sy(s,e){s.uniform3uiv(this.addr,e)}function ry(s,e){s.uniform4uiv(this.addr,e)}function ay(s,e,t){const i=this.cache,n=e.length,r=Ao(t,n);Jt(i,r)||(s.uniform1iv(this.addr,r),jt(i,r));let a;this.type===s.SAMPLER_2D_SHADOW?a=Gc:a=tp;for(let o=0;o!==n;++o)t.setTexture2D(e[o]||a,r[o])}function oy(s,e,t){const i=this.cache,n=e.length,r=Ao(t,n);Jt(i,r)||(s.uniform1iv(this.addr,r),jt(i,r));for(let a=0;a!==n;++a)t.setTexture3D(e[a]||np,r[a])}function ly(s,e,t){const i=this.cache,n=e.length,r=Ao(t,n);Jt(i,r)||(s.uniform1iv(this.addr,r),jt(i,r));for(let a=0;a!==n;++a)t.setTextureCube(e[a]||sp,r[a])}function cy(s,e,t){const i=this.cache,n=e.length,r=Ao(t,n);Jt(i,r)||(s.uniform1iv(this.addr,r),jt(i,r));for(let a=0;a!==n;++a)t.setTexture2DArray(e[a]||ip,r[a])}function hy(s){switch(s){case 5126:return Xx;case 35664:return qx;case 35665:return Kx;case 35666:return Yx;case 35674:return $x;case 35675:return Qx;case 35676:return Zx;case 5124:case 35670:return Jx;case 35667:case 35671:return jx;case 35668:case 35672:return ey;case 35669:case 35673:return ty;case 5125:return iy;case 36294:return ny;case 36295:return sy;case 36296:return ry;case 35678:case 36198:case 36298:case 36306:case 35682:return ay;case 35679:case 36299:case 36307:return oy;case 35680:case 36300:case 36308:case 36293:return ly;case 36289:case 36303:case 36311:case 36292:return cy}}class uy{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=Wx(t.type)}}class dy{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=hy(t.type)}}class fy{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){const n=this.seq;for(let r=0,a=n.length;r!==a;++r){const o=n[r];o.setValue(e,t[o.id],i)}}}const Sl=/(\w+)(\])?(\[|\.)?/g;function md(s,e){s.seq.push(e),s.map[e.id]=e}function py(s,e,t){const i=s.name,n=i.length;for(Sl.lastIndex=0;;){const r=Sl.exec(i),a=Sl.lastIndex;let o=r[1];const l=r[2]==="]",c=r[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===n){md(t,c===void 0?new uy(o,s,e):new dy(o,s,e));break}else{let f=t.map[o];f===void 0&&(f=new fy(o),md(t,f)),t=f}}}class to{constructor(e,t){this.seq=[],this.map={};const i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let a=0;a<i;++a){const o=e.getActiveUniform(t,a),l=e.getUniformLocation(t,o.name);py(o,l,this)}const n=[],r=[];for(const a of this.seq)a.type===e.SAMPLER_2D_SHADOW||a.type===e.SAMPLER_CUBE_SHADOW||a.type===e.SAMPLER_2D_ARRAY_SHADOW?n.push(a):r.push(a);n.length>0&&(this.seq=n.concat(r))}setValue(e,t,i,n){const r=this.map[t];r!==void 0&&r.setValue(e,i,n)}setOptional(e,t,i){const n=t[i];n!==void 0&&this.setValue(e,i,n)}static upload(e,t,i,n){for(let r=0,a=t.length;r!==a;++r){const o=t[r],l=i[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,n)}}static seqWithValue(e,t){const i=[];for(let n=0,r=e.length;n!==r;++n){const a=e[n];a.id in t&&i.push(a)}return i}}function gd(s,e,t){const i=s.createShader(e);return s.shaderSource(i,t),s.compileShader(i),i}const my=37297;let gy=0;function vy(s,e){const t=s.split(`
`),i=[],n=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let a=n;a<r;a++){const o=a+1;i.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return i.join(`
`)}const vd=new it;function xy(s){gt._getMatrix(vd,gt.workingColorSpace,s);const e=`mat3( ${vd.elements.map(t=>t.toFixed(4))} )`;switch(gt.getTransfer(s)){case lo:return[e,"LinearTransferOETF"];case bt:return[e,"sRGBTransferOETF"];default:return je("WebGLProgram: Unsupported color space: ",s),[e,"LinearTransferOETF"]}}function xd(s,e,t){const i=s.getShaderParameter(e,s.COMPILE_STATUS),r=(s.getShaderInfoLog(e)||"").trim();if(i&&r==="")return"";const a=/ERROR: 0:(\d+)/.exec(r);if(a){const o=parseInt(a[1]);return t.toUpperCase()+`

`+r+`

`+vy(s.getShaderSource(e),o)}else return r}function yy(s,e){const t=xy(e);return[`vec4 ${s}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}const My={[ah]:"Linear",[oh]:"Reinhard",[lh]:"Cineon",[jr]:"ACESFilmic",[hh]:"AgX",[uh]:"Neutral",[ch]:"Custom"};function _y(s,e){const t=My[e];return t===void 0?(je("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+s+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+s+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const Ba=new L;function Sy(){gt.getLuminanceCoefficients(Ba);const s=Ba.x.toFixed(4),e=Ba.y.toFixed(4),t=Ba.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${s}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function by(s){return[s.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",s.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Dr).join(`
`)}function Ay(s){const e=[];for(const t in s){const i=s[t];i!==!1&&e.push("#define "+t+" "+i)}return e.join(`
`)}function wy(s,e){const t={},i=s.getProgramParameter(e,s.ACTIVE_ATTRIBUTES);for(let n=0;n<i;n++){const r=s.getActiveAttrib(e,n),a=r.name;let o=1;r.type===s.FLOAT_MAT2&&(o=2),r.type===s.FLOAT_MAT3&&(o=3),r.type===s.FLOAT_MAT4&&(o=4),t[a]={type:r.type,location:s.getAttribLocation(e,a),locationSize:o}}return t}function Dr(s){return s!==""}function yd(s,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return s.replace(/NUM_SUN_LIGHTS/g,e.numSunLights).replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,e.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Md(s,e){return s.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const Ey=/^[ \t]*#include +<([\w\d./]+)>/gm;function Vc(s){return s.replace(Ey,Cy)}const Ty=new Map;function Cy(s,e){let t=dt[e];if(t===void 0){const i=Ty.get(e);if(i!==void 0)t=dt[i],je('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+e+">")}return Vc(t)}const Py=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function _d(s){return s.replace(Py,Ry)}function Ry(s,e,t,i){let n="";for(let r=parseInt(e);r<parseInt(t);r++)n+=i.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return n}function Sd(s){let e=`precision ${s.precision} float;
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
#define LOW_PRECISION`),e}const Ly={[Fr]:"SHADOWMAP_TYPE_PCF",[Rr]:"SHADOWMAP_TYPE_VSM"};function Iy(s){return Ly[s.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const Dy={[ps]:"ENVMAP_TYPE_CUBE",[tr]:"ENVMAP_TYPE_CUBE",[Mo]:"ENVMAP_TYPE_CUBE_UV"};function ky(s){return s.envMap===!1?"ENVMAP_TYPE_CUBE":Dy[s.envMapMode]||"ENVMAP_TYPE_CUBE"}const Uy={[tr]:"ENVMAP_MODE_REFRACTION"};function Fy(s){return s.envMap===!1?"ENVMAP_MODE_REFLECTION":Uy[s.envMapMode]||"ENVMAP_MODE_REFLECTION"}const Ny={[rh]:"ENVMAP_BLENDING_MULTIPLY",[N0]:"ENVMAP_BLENDING_MIX",[B0]:"ENVMAP_BLENDING_ADD"};function By(s){return s.envMap===!1?"ENVMAP_BLENDING_NONE":Ny[s.combine]||"ENVMAP_BLENDING_NONE"}function Oy(s){const e=s.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:i,maxMip:t}}function zy(s,e,t,i){const n=s.getContext(),r=t.defines;let a=t.vertexShader,o=t.fragmentShader;const l=Iy(t),c=ky(t),h=Fy(t),f=By(t),u=Oy(t),d=by(t),m=Ay(r),v=n.createProgram();let p,g,y=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m].filter(Dr).join(`
`),p.length>0&&(p+=`
`),g=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m].filter(Dr).join(`
`),g.length>0&&(g+=`
`)):(p=[Sd(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexNormals?"#define HAS_NORMAL":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Dr).join(`
`),g=[Sd(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+h:"",t.envMap?"#define "+f:"",u?"#define CUBEUV_TEXEL_WIDTH "+u.texelWidth:"",u?"#define CUBEUV_TEXEL_HEIGHT "+u.texelHeight:"",u?"#define CUBEUV_MAX_MIP "+u.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.retroreflection?"#define USE_RETROREFLECTION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas||t.batchingColor?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==on?"#define TONE_MAPPING":"",t.toneMapping!==on?dt.tonemapping_pars_fragment:"",t.toneMapping!==on?_y("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",dt.colorspace_pars_fragment,yy("linearToOutputTexel",t.outputColorSpace),Sy(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Dr).join(`
`)),a=Vc(a),a=yd(a,t),a=Md(a,t),o=Vc(o),o=yd(o,t),o=Md(o,t),a=_d(a),o=_d(o),t.isRawShaderMaterial!==!0&&(y=`#version 300 es
`,p=[d,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+p,g=["#define varying in",t.glslVersion===vu?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===vu?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+g);const E=y+p+a,M=y+g+o,b=gd(n,n.VERTEX_SHADER,E),S=gd(n,n.FRAGMENT_SHADER,M);n.attachShader(v,b),n.attachShader(v,S),t.index0AttributeName!==void 0?n.bindAttribLocation(v,0,t.index0AttributeName):t.hasPositionAttribute===!0&&n.bindAttribLocation(v,0,"position"),n.linkProgram(v);function w(R){if(s.debug.checkShaderErrors){const D=n.getProgramInfoLog(v)||"",B=n.getShaderInfoLog(b)||"",k=n.getShaderInfoLog(S)||"",N=D.trim(),G=B.trim(),H=k.trim();let se=!0,V=!0;if(n.getProgramParameter(v,n.LINK_STATUS)===!1)if(se=!1,typeof s.debug.onShaderError=="function")s.debug.onShaderError(n,v,b,S);else{const j=xd(n,b,"vertex"),J=xd(n,S,"fragment");vt("WebGLProgram: Shader Error "+n.getError()+" - VALIDATE_STATUS "+n.getProgramParameter(v,n.VALIDATE_STATUS)+`

Material Name: `+R.name+`
Material Type: `+R.type+`

Program Info Log: `+N+`
`+j+`
`+J)}else N!==""?je("WebGLProgram: Program Info Log:",N):(G===""||H==="")&&(V=!1);V&&(R.diagnostics={runnable:se,programLog:N,vertexShader:{log:G,prefix:p},fragmentShader:{log:H,prefix:g}})}n.deleteShader(b),n.deleteShader(S),x=new to(n,v),A=wy(n,v)}let x;this.getUniforms=function(){return x===void 0&&w(this),x};let A;this.getAttributes=function(){return A===void 0&&w(this),A};let C=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return C===!1&&(C=n.getProgramParameter(v,my)),C},this.destroy=function(){i.releaseStatesOfProgram(this),n.deleteProgram(v),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=gy++,this.cacheKey=e,this.usedTimes=1,this.program=v,this.vertexShader=b,this.fragmentShader=S,this}let Hy=0;class Gy{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,i){const n=this._getShaderCacheForMaterial(e);return n.has(t)===!1&&(n.add(t),t.usedTimes++),n.has(i)===!1&&(n.add(i),i.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){const t=this.shaderCache;let i=t.get(e);return i===void 0&&(i=new Vy(e),t.set(e,i)),i}}class Vy{constructor(e){this.id=Hy++,this.code=e,this.usedTimes=0}}function Wy(s){return s===ms||s===ro||s===ao}function Xy(s,e,t,i,n,r){const a=new Lf,o=new Gy,l=new Set,c=[],h=new Map,f=i.logarithmicDepthBuffer;let u=i.precision;const d={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function m(x){return l.add(x),x===0?"uv":`uv${x}`}function v(x,A,C,R,D,B){const k=R.fog,N=D.geometry,G=x.isMeshStandardMaterial||x.isMeshLambertMaterial||x.isMeshPhongMaterial?R.environment:null,H=x.isMeshStandardMaterial||x.isMeshLambertMaterial&&!x.envMap||x.isMeshPhongMaterial&&!x.envMap,se=e.get(x.envMap||G,H),V=se&&se.mapping===Mo?se.image.height:null,j=d[x.type];x.precision!==null&&(u=i.getMaxPrecision(x.precision),u!==x.precision&&je("WebGLProgram.getParameters:",x.precision,"not supported, using",u,"instead."));const J=N.morphAttributes.position||N.morphAttributes.normal||N.morphAttributes.color,we=J!==void 0?J.length:0;let ce=0;N.morphAttributes.position!==void 0&&(ce=1),N.morphAttributes.normal!==void 0&&(ce=2),N.morphAttributes.color!==void 0&&(ce=3);let ct,tt,Je,q;if(j){const wt=ji[j];ct=wt.vertexShader,tt=wt.fragmentShader}else{ct=x.vertexShader,tt=x.fragmentShader;const wt=o.getVertexShaderStage(x),Mt=o.getFragmentShaderStage(x);o.update(x,wt,Mt),Je=wt.id,q=Mt.id}const te=s.getRenderTarget(),ee=s.state.buffers.depth.getReversed(),be=D.isInstancedMesh===!0,Me=D.isBatchedMesh===!0,Ie=!!x.map,nt=!!x.matcap,ie=!!se,re=!!x.aoMap,he=!!x.lightMap,ue=!!x.bumpMap&&x.wireframe===!1,xe=!!x.normalMap,Ye=!!x.displacementMap,We=!!x.emissiveMap,Ve=!!x.metalnessMap,Qe=!!x.roughnessMap,U=x.anisotropy>0,pt=x.clearcoat>0,st=x.dispersion>0,P=x.retroreflectivity>0,_=x.iridescence>0,O=x.sheen>0,z=x.transmission>0,Y=U&&!!x.anisotropyMap,de=pt&&!!x.clearcoatMap,ye=pt&&!!x.clearcoatNormalMap,Z=pt&&!!x.clearcoatRoughnessMap,ne=_&&!!x.iridescenceMap,Se=_&&!!x.iridescenceThicknessMap,Fe=O&&!!x.sheenColorMap,_e=O&&!!x.sheenRoughnessMap,ve=!!x.specularMap,De=!!x.specularColorMap,ae=!!x.specularIntensityMap,pe=z&&!!x.transmissionMap,I=z&&!!x.thicknessMap,fe=!!x.gradientMap,$=!!x.alphaMap,ge=x.alphaTest>0,Ce=!!x.alphaHash,oe=!!x.extensions;let Xe=on;x.toneMapped&&(te===null||te.isXRRenderTarget===!0)&&(Xe=s.toneMapping);const Be={shaderID:j,shaderType:x.type,shaderName:x.name,vertexShader:ct,fragmentShader:tt,defines:x.defines,customVertexShaderID:Je,customFragmentShaderID:q,isRawShaderMaterial:x.isRawShaderMaterial===!0,glslVersion:x.glslVersion,precision:u,batching:Me,batchingColor:Me&&D._colorsTexture!==null,instancing:be,instancingColor:be&&D.instanceColor!==null,instancingMorph:be&&D.morphTexture!==null,outputColorSpace:te===null?s.outputColorSpace:te.isXRRenderTarget===!0?te.texture.colorSpace:gt.workingColorSpace,alphaToCoverage:!!x.alphaToCoverage,map:Ie,matcap:nt,envMap:ie,envMapMode:ie&&se.mapping,envMapCubeUVHeight:V,aoMap:re,lightMap:he,bumpMap:ue,normalMap:xe,displacementMap:Ye,emissiveMap:We,normalMapObjectSpace:xe&&x.normalMapType===G0,normalMapTangentSpace:xe&&x.normalMapType===qr,packedNormalMap:xe&&x.normalMapType===qr&&Wy(x.normalMap.format),metalnessMap:Ve,roughnessMap:Qe,anisotropy:U,anisotropyMap:Y,clearcoat:pt,clearcoatMap:de,clearcoatNormalMap:ye,clearcoatRoughnessMap:Z,dispersion:st,retroreflection:P,iridescence:_,iridescenceMap:ne,iridescenceThicknessMap:Se,sheen:O,sheenColorMap:Fe,sheenRoughnessMap:_e,specularMap:ve,specularColorMap:De,specularIntensityMap:ae,transmission:z,transmissionMap:pe,thicknessMap:I,gradientMap:fe,opaque:x.transparent===!1&&x.blending===Nr&&x.alphaToCoverage===!1,alphaMap:$,alphaTest:ge,alphaHash:Ce,combine:x.combine,mapUv:Ie&&m(x.map.channel),aoMapUv:re&&m(x.aoMap.channel),lightMapUv:he&&m(x.lightMap.channel),bumpMapUv:ue&&m(x.bumpMap.channel),normalMapUv:xe&&m(x.normalMap.channel),displacementMapUv:Ye&&m(x.displacementMap.channel),emissiveMapUv:We&&m(x.emissiveMap.channel),metalnessMapUv:Ve&&m(x.metalnessMap.channel),roughnessMapUv:Qe&&m(x.roughnessMap.channel),anisotropyMapUv:Y&&m(x.anisotropyMap.channel),clearcoatMapUv:de&&m(x.clearcoatMap.channel),clearcoatNormalMapUv:ye&&m(x.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Z&&m(x.clearcoatRoughnessMap.channel),iridescenceMapUv:ne&&m(x.iridescenceMap.channel),iridescenceThicknessMapUv:Se&&m(x.iridescenceThicknessMap.channel),sheenColorMapUv:Fe&&m(x.sheenColorMap.channel),sheenRoughnessMapUv:_e&&m(x.sheenRoughnessMap.channel),specularMapUv:ve&&m(x.specularMap.channel),specularColorMapUv:De&&m(x.specularColorMap.channel),specularIntensityMapUv:ae&&m(x.specularIntensityMap.channel),transmissionMapUv:pe&&m(x.transmissionMap.channel),thicknessMapUv:I&&m(x.thicknessMap.channel),alphaMapUv:$&&m(x.alphaMap.channel),vertexTangents:!!N.attributes.tangent&&(xe||U),vertexNormals:!!N.attributes.normal,vertexColors:x.vertexColors,vertexAlphas:x.vertexColors===!0&&!!N.attributes.color&&N.attributes.color.itemSize===4,pointsUvs:D.isPoints===!0&&!!N.attributes.uv&&(Ie||$),fog:!!k,useFog:x.fog===!0,fogExp2:!!k&&k.isFogExp2,flatShading:x.wireframe===!1&&(x.flatShading===!0||N.attributes.normal===void 0&&xe===!1&&(x.isMeshLambertMaterial||x.isMeshPhongMaterial||x.isMeshStandardMaterial||x.isMeshPhysicalMaterial)),sizeAttenuation:x.sizeAttenuation===!0,logarithmicDepthBuffer:f,reversedDepthBuffer:ee,skinning:D.isSkinnedMesh===!0,hasPositionAttribute:N.attributes.position!==void 0,morphTargets:N.morphAttributes.position!==void 0,morphNormals:N.morphAttributes.normal!==void 0,morphColors:N.morphAttributes.color!==void 0,morphTargetsCount:we,morphTextureStride:ce,numSunLights:A.sun.length,numDirLights:A.directional.length,numPointLights:A.point.length,numSpotLights:A.spot.length,numSpotLightMaps:A.spotLightMap.length,numRectAreaLights:A.rectArea.length,numHemiLights:A.hemi.length,numSunLightShadows:A.sunShadowMap.length,numDirLightShadows:A.directionalShadowMap.length,numPointLightShadows:A.pointShadowMap.length,numSpotLightShadows:A.spotShadowMap.length,numSpotLightShadowsWithMaps:A.numSpotLightShadowsWithMaps,numLightProbes:A.numLightProbes,numLightProbeGrids:B.length,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:x.dithering,shadowMapEnabled:s.shadowMap.enabled&&C.length>0,shadowMapType:s.shadowMap.type,toneMapping:Xe,decodeVideoTexture:Ie&&x.map.isVideoTexture===!0&&gt.getTransfer(x.map.colorSpace)===bt,decodeVideoTextureEmissive:We&&x.emissiveMap.isVideoTexture===!0&&gt.getTransfer(x.emissiveMap.colorSpace)===bt,premultipliedAlpha:x.premultipliedAlpha,doubleSided:x.side===oi,flipSided:x.side===Zt,useDepthPacking:x.depthPacking>=0,depthPacking:x.depthPacking||0,index0AttributeName:x.index0AttributeName,extensionClipCullDistance:oe&&x.extensions.clipCullDistance===!0&&t.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(oe&&x.extensions.multiDraw===!0||Me)&&t.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:t.has("KHR_parallel_shader_compile"),customProgramCacheKey:x.customProgramCacheKey()};return Be.vertexUv1s=l.has(1),Be.vertexUv2s=l.has(2),Be.vertexUv3s=l.has(3),l.clear(),Be}function p(x){const A=[];if(x.shaderID?A.push(x.shaderID):(A.push(x.customVertexShaderID),A.push(x.customFragmentShaderID)),x.defines!==void 0)for(const C in x.defines)A.push(C),A.push(x.defines[C]);return x.isRawShaderMaterial===!1&&(g(A,x),y(A,x),A.push(s.outputColorSpace)),A.push(x.customProgramCacheKey),A.join()}function g(x,A){x.push(A.precision),x.push(A.outputColorSpace),x.push(A.envMapMode),x.push(A.envMapCubeUVHeight),x.push(A.mapUv),x.push(A.alphaMapUv),x.push(A.lightMapUv),x.push(A.aoMapUv),x.push(A.bumpMapUv),x.push(A.normalMapUv),x.push(A.displacementMapUv),x.push(A.emissiveMapUv),x.push(A.metalnessMapUv),x.push(A.roughnessMapUv),x.push(A.anisotropyMapUv),x.push(A.clearcoatMapUv),x.push(A.clearcoatNormalMapUv),x.push(A.clearcoatRoughnessMapUv),x.push(A.iridescenceMapUv),x.push(A.iridescenceThicknessMapUv),x.push(A.sheenColorMapUv),x.push(A.sheenRoughnessMapUv),x.push(A.specularMapUv),x.push(A.specularColorMapUv),x.push(A.specularIntensityMapUv),x.push(A.transmissionMapUv),x.push(A.thicknessMapUv),x.push(A.combine),x.push(A.fogExp2),x.push(A.sizeAttenuation),x.push(A.morphTargetsCount),x.push(A.morphAttributeCount),x.push(A.numSunLights),x.push(A.numDirLights),x.push(A.numPointLights),x.push(A.numSpotLights),x.push(A.numSpotLightMaps),x.push(A.numHemiLights),x.push(A.numRectAreaLights),x.push(A.numSunLightShadows),x.push(A.numDirLightShadows),x.push(A.numPointLightShadows),x.push(A.numSpotLightShadows),x.push(A.numSpotLightShadowsWithMaps),x.push(A.numLightProbes),x.push(A.shadowMapType),x.push(A.toneMapping),x.push(A.numClippingPlanes),x.push(A.numClipIntersection),x.push(A.depthPacking)}function y(x,A){a.disableAll(),A.instancing&&a.enable(0),A.instancingColor&&a.enable(1),A.instancingMorph&&a.enable(2),A.matcap&&a.enable(3),A.envMap&&a.enable(4),A.normalMapObjectSpace&&a.enable(5),A.normalMapTangentSpace&&a.enable(6),A.clearcoat&&a.enable(7),A.iridescence&&a.enable(8),A.alphaTest&&a.enable(9),A.vertexColors&&a.enable(10),A.vertexAlphas&&a.enable(11),A.vertexUv1s&&a.enable(12),A.vertexUv2s&&a.enable(13),A.vertexUv3s&&a.enable(14),A.vertexTangents&&a.enable(15),A.anisotropy&&a.enable(16),A.alphaHash&&a.enable(17),A.batching&&a.enable(18),A.dispersion&&a.enable(19),A.retroreflection&&a.enable(24),A.batchingColor&&a.enable(20),A.gradientMap&&a.enable(21),A.packedNormalMap&&a.enable(22),A.vertexNormals&&a.enable(23),x.push(a.mask),a.disableAll(),A.fog&&a.enable(0),A.useFog&&a.enable(1),A.flatShading&&a.enable(2),A.logarithmicDepthBuffer&&a.enable(3),A.reversedDepthBuffer&&a.enable(4),A.skinning&&a.enable(5),A.morphTargets&&a.enable(6),A.morphNormals&&a.enable(7),A.morphColors&&a.enable(8),A.premultipliedAlpha&&a.enable(9),A.shadowMapEnabled&&a.enable(10),A.doubleSided&&a.enable(11),A.flipSided&&a.enable(12),A.useDepthPacking&&a.enable(13),A.dithering&&a.enable(14),A.transmission&&a.enable(15),A.sheen&&a.enable(16),A.opaque&&a.enable(17),A.pointsUvs&&a.enable(18),A.decodeVideoTexture&&a.enable(19),A.decodeVideoTextureEmissive&&a.enable(20),A.alphaToCoverage&&a.enable(21),A.numLightProbeGrids>0&&a.enable(22),A.hasPositionAttribute&&a.enable(23),x.push(a.mask)}function E(x){const A=d[x.type];let C;if(A){const R=ji[A];C=rn.clone(R.uniforms)}else C=x.uniforms;return C}function M(x,A){let C=h.get(A);return C!==void 0?++C.usedTimes:(C=new zy(s,A,x,n),c.push(C),h.set(A,C)),C}function b(x){if(--x.usedTimes===0){const A=c.indexOf(x);c[A]=c[c.length-1],c.pop(),h.delete(x.cacheKey),x.destroy()}}function S(x){o.remove(x)}function w(){o.dispose()}return{getParameters:v,getProgramCacheKey:p,getUniforms:E,acquireProgram:M,releaseProgram:b,releaseShaderCache:S,programs:c,dispose:w}}function qy(){let s=new WeakMap;function e(a){return s.has(a)}function t(a){let o=s.get(a);return o===void 0&&(o={},s.set(a,o)),o}function i(a){s.delete(a)}function n(a,o,l){s.get(a)[o]=l}function r(){s=new WeakMap}return{has:e,get:t,remove:i,update:n,dispose:r}}function Ky(s,e){return s.groupOrder!==e.groupOrder?s.groupOrder-e.groupOrder:s.renderOrder!==e.renderOrder?s.renderOrder-e.renderOrder:s.material.id!==e.material.id?s.material.id-e.material.id:s.materialVariant!==e.materialVariant?s.materialVariant-e.materialVariant:s.z!==e.z?s.z-e.z:s.id-e.id}function bd(s,e){return s.groupOrder!==e.groupOrder?s.groupOrder-e.groupOrder:s.renderOrder!==e.renderOrder?s.renderOrder-e.renderOrder:s.z!==e.z?e.z-s.z:s.id-e.id}function Ad(){const s=[];let e=0;const t=[],i=[],n=[];function r(){e=0,t.length=0,i.length=0,n.length=0}function a(u){let d=0;return u.isInstancedMesh&&(d+=2),u.isSkinnedMesh&&(d+=1),d}function o(u,d,m,v,p,g){let y=s[e];return y===void 0?(y={id:u.id,object:u,geometry:d,material:m,materialVariant:a(u),groupOrder:v,renderOrder:u.renderOrder,z:p,group:g},s[e]=y):(y.id=u.id,y.object=u,y.geometry=d,y.material=m,y.materialVariant=a(u),y.groupOrder=v,y.renderOrder=u.renderOrder,y.z=p,y.group=g),e++,y}function l(u,d,m,v,p,g,y){y.reversedDepth===!0&&(p=-p);const E=o(u,d,m,v,p,g);m.transmission>0?i.push(E):m.transparent===!0?n.push(E):t.push(E)}function c(u,d,m,v,p,g){const y=o(u,d,m,v,p,g);m.transmission>0?i.unshift(y):m.transparent===!0?n.unshift(y):t.unshift(y)}function h(u,d){t.length>1&&t.sort(u||Ky),i.length>1&&i.sort(d||bd),n.length>1&&n.sort(d||bd)}function f(){for(let u=e,d=s.length;u<d;u++){const m=s[u];if(m.id===null)break;m.id=null,m.object=null,m.geometry=null,m.material=null,m.group=null}}return{opaque:t,transmissive:i,transparent:n,init:r,push:l,unshift:c,finish:f,sort:h}}function Yy(){let s=new WeakMap;function e(i,n){const r=s.get(i);let a;return r===void 0?(a=new Ad,s.set(i,[a])):n>=r.length?(a=new Ad,r.push(a)):a=r[n],a}function t(){s=new WeakMap}return{get:e,dispose:t}}function $y(){const s={};return{get:function(e){if(s[e.id]!==void 0)return s[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={direction:new L,color:new Te};break;case"SpotLight":t={position:new L,direction:new L,color:new Te,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new L,color:new Te,distance:0,decay:0};break;case"HemisphereLight":t={direction:new L,skyColor:new Te,groundColor:new Te};break;case"RectAreaLight":t={color:new Te,position:new L,halfWidth:new L,halfHeight:new L};break}return s[e.id]=t,t}}}function Qy(){const s={};return{get:function(e){if(s[e.id]!==void 0)return s[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new le};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new le};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new le,shadowCameraNear:1,shadowCameraFar:1e3};break}return s[e.id]=t,t}}}let Zy=0;function Jy(s,e){return(e.castShadow?2:0)-(s.castShadow?2:0)+(e.map?1:0)-(s.map?1:0)}function jy(s){const e=new $y,t=Qy(),i={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new L);const n=new L,r=new rt,a=new rt;function o(c){let h=0,f=0,u=0;for(let D=0;D<9;D++)i.probe[D].set(0,0,0);let d=0,m=0,v=0,p=0,g=0,y=0,E=0,M=0,b=0,S=0,w=0,x=0,A=0,C=0;c.sort(Jy);for(let D=0,B=c.length;D<B;D++){const k=c[D],N=k.color,G=k.intensity,H=k.distance;let se=null;if(k.shadow&&k.shadow.map&&(k.shadow.map.texture.format===ms?se=k.shadow.map.texture:se=k.shadow.map.depthTexture||k.shadow.map.texture),k.isAmbientLight)h+=N.r*G,f+=N.g*G,u+=N.b*G;else if(k.isLightProbe){for(let V=0;V<9;V++)i.probe[V].addScaledVector(k.sh.coefficients[V],G);C++}else if(k.isSunLight){const V=e.get(k);if(V.color.copy(k.color).multiplyScalar(k.intensity),k.castShadow){const j=k.shadow,J=t.get(k);J.shadowIntensity=j.intensity,J.shadowBias=j.bias,J.shadowNormalBias=j.normalBias,J.shadowRadius=j.radius,J.shadowMapSize.copy(j.mapSize).multiply(j.getFrameExtents()),i.sunShadow[m]=J,i.sunShadowMap[m]=se;const we=j.getViewportCount();for(let ce=0;ce<we;ce++)i.sunShadowMatrix[v+ce]=j.getMatrix(ce),i.sunShadowCascade[v+ce]=j._cascadeData[ce];v+=we,m++}i.sun[d]=V,d++}else if(k.isDirectionalLight){const V=e.get(k);if(V.color.copy(k.color).multiplyScalar(k.intensity),k.castShadow){const j=k.shadow,J=t.get(k);J.shadowIntensity=j.intensity,J.shadowBias=j.bias,J.shadowNormalBias=j.normalBias,J.shadowRadius=j.radius,J.shadowMapSize=j.mapSize,i.directionalShadow[p]=J,i.directionalShadowMap[p]=se,i.directionalShadowMatrix[p]=k.shadow.matrix,b++}i.directional[p]=V,p++}else if(k.isSpotLight){const V=e.get(k);V.position.setFromMatrixPosition(k.matrixWorld),V.color.copy(N).multiplyScalar(G),V.distance=H,V.coneCos=Math.cos(k.angle),V.penumbraCos=Math.cos(k.angle*(1-k.penumbra)),V.decay=k.decay,i.spot[y]=V;const j=k.shadow;if(k.map&&(i.spotLightMap[x]=k.map,x++,j.updateMatrices(k),k.castShadow&&A++),i.spotLightMatrix[y]=j.matrix,k.castShadow){const J=t.get(k);J.shadowIntensity=j.intensity,J.shadowBias=j.bias,J.shadowNormalBias=j.normalBias,J.shadowRadius=j.radius,J.shadowMapSize=j.mapSize,i.spotShadow[y]=J,i.spotShadowMap[y]=se,w++}y++}else if(k.isRectAreaLight){const V=e.get(k);V.color.copy(N).multiplyScalar(G),V.halfWidth.set(k.width*.5,0,0),V.halfHeight.set(0,k.height*.5,0),i.rectArea[E]=V,E++}else if(k.isPointLight){const V=e.get(k);if(V.color.copy(k.color).multiplyScalar(k.intensity),V.distance=k.distance,V.decay=k.decay,k.castShadow){const j=k.shadow,J=t.get(k);J.shadowIntensity=j.intensity,J.shadowBias=j.bias,J.shadowNormalBias=j.normalBias,J.shadowRadius=j.radius,J.shadowMapSize=j.mapSize,J.shadowCameraNear=j.camera.near,J.shadowCameraFar=j.camera.far,i.pointShadow[g]=J,i.pointShadowMap[g]=se,i.pointShadowMatrix[g]=k.shadow.matrix,S++}i.point[g]=V,g++}else if(k.isHemisphereLight){const V=e.get(k);V.skyColor.copy(k.color).multiplyScalar(G),V.groundColor.copy(k.groundColor).multiplyScalar(G),i.hemi[M]=V,M++}}E>0&&(s.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=Ee.LTC_FLOAT_1,i.rectAreaLTC2=Ee.LTC_FLOAT_2):(i.rectAreaLTC1=Ee.LTC_HALF_1,i.rectAreaLTC2=Ee.LTC_HALF_2)),i.ambient[0]=h,i.ambient[1]=f,i.ambient[2]=u;const R=i.hash;(R.sunLength!==d||R.directionalLength!==p||R.pointLength!==g||R.spotLength!==y||R.rectAreaLength!==E||R.hemiLength!==M||R.numSunShadows!==m||R.numDirectionalShadows!==b||R.numPointShadows!==S||R.numSpotShadows!==w||R.numSpotMaps!==x||R.numLightProbes!==C)&&(i.sun.length=d,i.directional.length=p,i.spot.length=y,i.rectArea.length=E,i.point.length=g,i.hemi.length=M,i.sunShadow.length=m,i.sunShadowMap.length=m,i.sunShadowMatrix.length=v,i.sunShadowCascade.length=v,i.directionalShadow.length=b,i.directionalShadowMap.length=b,i.directionalShadowMatrix.length=b,i.pointShadow.length=S,i.pointShadowMap.length=S,i.pointShadowMatrix.length=S,i.spotShadow.length=w,i.spotShadowMap.length=w,i.spotLightMatrix.length=w+x-A,i.spotLightMap.length=x,i.numSpotLightShadowsWithMaps=A,i.numLightProbes=C,R.sunLength=d,R.directionalLength=p,R.pointLength=g,R.spotLength=y,R.rectAreaLength=E,R.hemiLength=M,R.numSunShadows=m,R.numDirectionalShadows=b,R.numPointShadows=S,R.numSpotShadows=w,R.numSpotMaps=x,R.numLightProbes=C,i.version=Zy++)}function l(c,h){let f=0,u=0,d=0,m=0,v=0,p=0;const g=h.matrixWorldInverse;for(let y=0,E=c.length;y<E;y++){const M=c[y];if(M.isSunLight){const b=i.sun[f];b.direction.setFromMatrixPosition(M.matrixWorld),b.direction.transformDirection(g),f++}else if(M.isDirectionalLight){const b=i.directional[u];b.direction.setFromMatrixPosition(M.matrixWorld),n.setFromMatrixPosition(M.target.matrixWorld),b.direction.sub(n),b.direction.transformDirection(g),u++}else if(M.isSpotLight){const b=i.spot[m];b.position.setFromMatrixPosition(M.matrixWorld),b.position.applyMatrix4(g),b.direction.setFromMatrixPosition(M.matrixWorld),n.setFromMatrixPosition(M.target.matrixWorld),b.direction.sub(n),b.direction.transformDirection(g),m++}else if(M.isRectAreaLight){const b=i.rectArea[v];b.position.setFromMatrixPosition(M.matrixWorld),b.position.applyMatrix4(g),a.identity(),r.copy(M.matrixWorld),r.premultiply(g),a.extractRotation(r),b.halfWidth.set(M.width*.5,0,0),b.halfHeight.set(0,M.height*.5,0),b.halfWidth.applyMatrix4(a),b.halfHeight.applyMatrix4(a),v++}else if(M.isPointLight){const b=i.point[d];b.position.setFromMatrixPosition(M.matrixWorld),b.position.applyMatrix4(g),d++}else if(M.isHemisphereLight){const b=i.hemi[p];b.direction.setFromMatrixPosition(M.matrixWorld),b.direction.transformDirection(g),p++}}}return{setup:o,setupView:l,state:i}}function wd(s){const e=new jy(s),t=[],i=[],n=[];function r(u){f.camera=u,t.length=0,i.length=0,n.length=0}function a(u){t.push(u)}function o(u){i.push(u)}function l(u){n.push(u)}function c(){e.setup(t)}function h(u){e.setupView(t,u)}const f={lightsArray:t,shadowsArray:i,lightProbeGridArray:n,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return{init:r,state:f,setupLights:c,setupLightsView:h,pushLight:a,pushShadow:o,pushLightProbeGrid:l}}function eM(s){let e=new WeakMap;function t(n,r=0){const a=e.get(n);let o;return a===void 0?(o=new wd(s),e.set(n,[o])):r>=a.length?(o=new wd(s),a.push(o)):o=a[r],o}function i(){e=new WeakMap}return{get:t,dispose:i}}const tM=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,iM=`uniform sampler2D shadow_pass;
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
}`,nM=[new L(1,0,0),new L(-1,0,0),new L(0,1,0),new L(0,-1,0),new L(0,0,1),new L(0,0,-1)],sM=[new L(0,-1,0),new L(0,-1,0),new L(0,0,1),new L(0,0,-1),new L(0,-1,0),new L(0,-1,0)],Ed=new rt,wr=new L,bl=new L;function rM(s,e,t){let i=new Th;const n=new le,r=new le,a=new Ct,o=new fg,l=new pg,c={},h=t.maxTextureSize,f={[fs]:Zt,[Zt]:fs,[oi]:oi},u=new Ot({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new le},radius:{value:4}},vertexShader:tM,fragmentShader:iM}),d=u.clone();d.defines.HORIZONTAL_PASS=1;const m=new It;m.setAttribute("position",new ri(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const v=new Ge(m,u),p=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Fr;let g=this.type;this.render=function(S,w,x){if(p.enabled===!1||p.autoUpdate===!1&&p.needsUpdate===!1||S.length===0)return;this.type===S0&&(je("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=Fr);const A=s.getRenderTarget(),C=s.getActiveCubeFace(),R=s.getActiveMipmapLevel(),D=s.state;D.setBlending(ni),D.buffers.depth.getReversed()===!0?D.buffers.color.setClear(0,0,0,0):D.buffers.color.setClear(1,1,1,1),D.buffers.depth.setTest(!0),D.setScissorTest(!1);const B=g!==this.type;B&&w.traverse(function(k){k.material&&(Array.isArray(k.material)?k.material.forEach(N=>N.needsUpdate=!0):k.material.needsUpdate=!0)});for(let k=0,N=S.length;k<N;k++){const G=S[k],H=G.shadow;if(H===void 0){je("WebGLShadowMap:",G,"has no shadow.");continue}if(H.autoUpdate===!1&&H.needsUpdate===!1)continue;n.copy(H.mapSize);const se=H.getFrameExtents();n.multiply(se),r.copy(H.mapSize),(n.x>h||n.y>h)&&(n.x>h&&(r.x=Math.floor(h/se.x),n.x=r.x*se.x,H.mapSize.x=r.x),n.y>h&&(r.y=Math.floor(h/se.y),n.y=r.y*se.y,H.mapSize.y=r.y));const V=s.state.buffers.depth.getReversed();if(H.camera._reversedDepth=V,H.map===null||B===!0){if(H.map!==null&&(H.map.depthTexture!==null&&(H.map.depthTexture.dispose(),H.map.depthTexture=null),H.map.dispose()),this.type===Rr){if(G.isPointLight){je("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}H.map=new ai(n.x,n.y,{format:ms,type:li,minFilter:di,magFilter:di,generateMipmaps:!1}),H.map.texture.name=G.name+".shadowMap",H.map.depthTexture=new sr(n.x,n.y,Bi),H.map.depthTexture.name=G.name+".shadowMapDepth",H.map.depthTexture.format=Cn,H.map.depthTexture.compareFunction=null,H.map.depthTexture.minFilter=Qt,H.map.depthTexture.magFilter=Qt}else G.isPointLight?(H.map=new ep(n.x),H.map.depthTexture=new Tm(n.x,cn)):(H.map=new ai(n.x,n.y),H.map.depthTexture=new sr(n.x,n.y,cn)),H.map.depthTexture.name=G.name+".shadowMap",H.map.depthTexture.format=Cn,this.type===Fr?(H.map.depthTexture.compareFunction=V?Mh:yh,H.map.depthTexture.minFilter=di,H.map.depthTexture.magFilter=di):(H.map.depthTexture.compareFunction=null,H.map.depthTexture.minFilter=Qt,H.map.depthTexture.magFilter=Qt);H.camera.updateProjectionMatrix()}H.map.isWebGLCubeRenderTarget!==!0&&(H.map.width!==n.x||H.map.height!==n.y)&&H.map.setSize(n.x,n.y);const j=H.map.isWebGLCubeRenderTarget?6:H.getViewportCount();G.isPointLight!==!0&&H.updateMatrices(G,x);for(let J=0;J<j;J++){const we=H.getCamera(J);if(G.isPointLight){const ce=H.camera,ct=H.matrix,tt=G.distance||ce.far;tt!==ce.far&&(ce.far=tt,ce.updateProjectionMatrix()),wr.setFromMatrixPosition(G.matrixWorld),ce.position.copy(wr),bl.copy(ce.position),bl.add(nM[J]),ce.up.copy(sM[J]),ce.lookAt(bl),ce.updateMatrixWorld(),ct.makeTranslation(-wr.x,-wr.y,-wr.z),Ed.multiplyMatrices(ce.projectionMatrix,ce.matrixWorldInverse),H._frustum.setFromProjectionMatrix(Ed,ce.coordinateSystem,ce.reversedDepth)}if(H.map.isWebGLCubeRenderTarget)s.setRenderTarget(H.map,J),s.clear();else{J===0&&(s.setRenderTarget(H.map),s.clear());const ce=H.getViewport(J);a.set(r.x*ce.x,r.y*ce.y,r.x*ce.z,r.y*ce.w),D.viewport(a)}i=H.getFrustum(J),M(w,x,we,G,this.type)}H.isPointLightShadow!==!0&&this.type===Rr&&y(H,x),H.needsUpdate=!1}g=this.type,p.needsUpdate=!1,s.setRenderTarget(A,C,R)};function y(S,w){const x=e.update(v);u.defines.VSM_SAMPLES!==S.blurSamples&&(u.defines.VSM_SAMPLES=S.blurSamples,d.defines.VSM_SAMPLES=S.blurSamples,u.needsUpdate=!0,d.needsUpdate=!0),S.mapPass===null?S.mapPass=new ai(n.x,n.y,{format:ms,type:li}):(S.mapPass.width!==S.map.width||S.mapPass.height!==S.map.height)&&S.mapPass.setSize(S.map.width,S.map.height),u.uniforms.shadow_pass.value=S.map.depthTexture,u.uniforms.resolution.value.set(S.map.width,S.map.height),u.uniforms.radius.value=S.radius,s.setRenderTarget(S.mapPass),s.clear(),s.renderBufferDirect(w,null,x,u,v,null),d.uniforms.shadow_pass.value=S.mapPass.texture,d.uniforms.resolution.value.set(S.map.width,S.map.height),d.uniforms.radius.value=S.radius,s.setRenderTarget(S.map),s.clear(),s.renderBufferDirect(w,null,x,d,v,null)}function E(S,w,x,A){let C=null;const R=x.isPointLight===!0?S.customDistanceMaterial:S.customDepthMaterial;if(R!==void 0)C=R;else if(C=x.isPointLight===!0?l:o,s.localClippingEnabled&&w.clipShadows===!0&&Array.isArray(w.clippingPlanes)&&w.clippingPlanes.length!==0||w.displacementMap&&w.displacementScale!==0||w.alphaMap&&w.alphaTest>0||w.map&&w.alphaTest>0||w.alphaToCoverage===!0){const D=C.uuid,B=w.uuid;let k=c[D];k===void 0&&(k={},c[D]=k);let N=k[B];N===void 0&&(N=C.clone(),k[B]=N,w.addEventListener("dispose",b)),C=N}if(C.visible=w.visible,C.wireframe=w.wireframe,A===Rr?C.side=w.shadowSide!==null?w.shadowSide:w.side:C.side=w.shadowSide!==null?w.shadowSide:f[w.side],C.alphaMap=w.alphaMap,C.alphaTest=w.alphaToCoverage===!0?.5:w.alphaTest,C.map=w.map,C.clipShadows=w.clipShadows,C.clippingPlanes=w.clippingPlanes,C.clipIntersection=w.clipIntersection,C.displacementMap=w.displacementMap,C.displacementScale=w.displacementScale,C.displacementBias=w.displacementBias,C.wireframeLinewidth=w.wireframeLinewidth,C.linewidth=w.linewidth,x.isPointLight===!0&&C.isMeshDistanceMaterial===!0){const D=s.properties.get(C);D.light=x}return C}function M(S,w,x,A,C){if(S.visible===!1)return;if(S.layers.test(w.layers)&&(S.isMesh||S.isLine||S.isPoints)&&(S.castShadow||S.receiveShadow&&C===Rr)&&(!S.frustumCulled||S.intersectsFrustum(i))){S.modelViewMatrix.multiplyMatrices(x.matrixWorldInverse,S.matrixWorld);const B=e.update(S),k=S.material;if(Array.isArray(k)){const N=B.groups;for(let G=0,H=N.length;G<H;G++){const se=N[G],V=k[se.materialIndex];if(V&&V.visible){const j=E(S,V,A,C);S.onBeforeShadow(s,S,w,x,B,j,se),s.renderBufferDirect(x,null,B,j,S,se),S.onAfterShadow(s,S,w,x,B,j,se)}}}else if(k.visible){const N=E(S,k,A,C);S.onBeforeShadow(s,S,w,x,B,N,null),s.renderBufferDirect(x,null,B,N,S,null),S.onAfterShadow(s,S,w,x,B,N,null)}}const D=S.children;for(let B=0,k=D.length;B<k;B++)M(D[B],w,x,A,C)}function b(S){S.target.removeEventListener("dispose",b);for(const x in c){const A=c[x],C=S.target.uuid;C in A&&(A[C].dispose(),delete A[C])}}}function aM(s,e){function t(){let I=!1;const fe=new Ct;let $=null;const ge=new Ct(0,0,0,0);return{setMask:function(Ce){$!==Ce&&!I&&(s.colorMask(Ce,Ce,Ce,Ce),$=Ce)},setLocked:function(Ce){I=Ce},setClear:function(Ce,oe,Xe,Be,wt){wt===!0&&(Ce*=Be,oe*=Be,Xe*=Be),fe.set(Ce,oe,Xe,Be),ge.equals(fe)===!1&&(s.clearColor(Ce,oe,Xe,Be),ge.copy(fe))},reset:function(){I=!1,$=null,ge.set(-1,0,0,0)}}}function i(){let I=!1,fe=!1,$=null,ge=null,Ce=null;return{setReversed:function(oe){if(fe!==oe){const Xe=e.get("EXT_clip_control");oe?Xe.clipControlEXT(Xe.LOWER_LEFT_EXT,Xe.ZERO_TO_ONE_EXT):Xe.clipControlEXT(Xe.LOWER_LEFT_EXT,Xe.NEGATIVE_ONE_TO_ONE_EXT),fe=oe;const Be=Ce;Ce=null,this.setClear(Be)}},getReversed:function(){return fe},setTest:function(oe){oe?te(s.DEPTH_TEST):ee(s.DEPTH_TEST)},setMask:function(oe){$!==oe&&!I&&(s.depthMask(oe),$=oe)},setFunc:function(oe){if(fe&&(oe=j0[oe]),ge!==oe){switch(oe){case Ql:s.depthFunc(s.NEVER);break;case Zl:s.depthFunc(s.ALWAYS);break;case Jl:s.depthFunc(s.LESS);break;case Wr:s.depthFunc(s.LEQUAL);break;case jl:s.depthFunc(s.EQUAL);break;case ec:s.depthFunc(s.GEQUAL);break;case tc:s.depthFunc(s.GREATER);break;case ic:s.depthFunc(s.NOTEQUAL);break;default:s.depthFunc(s.LEQUAL)}ge=oe}},setLocked:function(oe){I=oe},setClear:function(oe){Ce!==oe&&(Ce=oe,fe&&(oe=1-oe),s.clearDepth(oe))},reset:function(){I=!1,$=null,ge=null,Ce=null,fe=!1}}}function n(){let I=!1,fe=null,$=null,ge=null,Ce=null,oe=null,Xe=null,Be=null,wt=null;return{setTest:function(Mt){I||(Mt?te(s.STENCIL_TEST):ee(s.STENCIL_TEST))},setMask:function(Mt){fe!==Mt&&!I&&(s.stencilMask(Mt),fe=Mt)},setFunc:function(Mt,Ti,Xi){($!==Mt||ge!==Ti||Ce!==Xi)&&(s.stencilFunc(Mt,Ti,Xi),$=Mt,ge=Ti,Ce=Xi)},setOp:function(Mt,Ti,Xi){(oe!==Mt||Xe!==Ti||Be!==Xi)&&(s.stencilOp(Mt,Ti,Xi),oe=Mt,Xe=Ti,Be=Xi)},setLocked:function(Mt){I=Mt},setClear:function(Mt){wt!==Mt&&(s.clearStencil(Mt),wt=Mt)},reset:function(){I=!1,fe=null,$=null,ge=null,Ce=null,oe=null,Xe=null,Be=null,wt=null}}}const r=new t,a=new i,o=new n,l=new WeakMap,c=new WeakMap;let h={},f={},u={},d=new WeakMap,m=[],v=null,p=!1,g=null,y=null,E=null,M=null,b=null,S=null,w=null,x=new Te(0,0,0),A=0,C=!1,R=null,D=null,B=null,k=null,N=null;const G=s.getParameter(s.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let H=!1,se=0;const V=s.getParameter(s.VERSION);V.indexOf("WebGL")!==-1?(se=parseFloat(/^WebGL (\d)/.exec(V)[1]),H=se>=1):V.indexOf("OpenGL ES")!==-1&&(se=parseFloat(/^OpenGL ES (\d)/.exec(V)[1]),H=se>=2);let j=null,J={};const we=s.getParameter(s.SCISSOR_BOX),ce=s.getParameter(s.VIEWPORT),ct=new Ct().fromArray(we),tt=new Ct().fromArray(ce);function Je(I,fe,$,ge){const Ce=new Uint8Array(4),oe=s.createTexture();s.bindTexture(I,oe),s.texParameteri(I,s.TEXTURE_MIN_FILTER,s.NEAREST),s.texParameteri(I,s.TEXTURE_MAG_FILTER,s.NEAREST);for(let Xe=0;Xe<$;Xe++)I===s.TEXTURE_3D||I===s.TEXTURE_2D_ARRAY?s.texImage3D(fe,0,s.RGBA,1,1,ge,0,s.RGBA,s.UNSIGNED_BYTE,Ce):s.texImage2D(fe+Xe,0,s.RGBA,1,1,0,s.RGBA,s.UNSIGNED_BYTE,Ce);return oe}const q={};q[s.TEXTURE_2D]=Je(s.TEXTURE_2D,s.TEXTURE_2D,1),q[s.TEXTURE_CUBE_MAP]=Je(s.TEXTURE_CUBE_MAP,s.TEXTURE_CUBE_MAP_POSITIVE_X,6),q[s.TEXTURE_2D_ARRAY]=Je(s.TEXTURE_2D_ARRAY,s.TEXTURE_2D_ARRAY,1,1),q[s.TEXTURE_3D]=Je(s.TEXTURE_3D,s.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),te(s.DEPTH_TEST),a.setFunc(Wr),ue(!1),xe(du),te(s.CULL_FACE),re(ni);function te(I){h[I]!==!0&&(s.enable(I),h[I]=!0)}function ee(I){h[I]!==!1&&(s.disable(I),h[I]=!1)}function be(I,fe){return u[I]!==fe?(s.bindFramebuffer(I,fe),u[I]=fe,I===s.DRAW_FRAMEBUFFER&&(u[s.FRAMEBUFFER]=fe),I===s.FRAMEBUFFER&&(u[s.DRAW_FRAMEBUFFER]=fe),!0):!1}function Me(I,fe){let $=m,ge=!1;if(I){$=d.get(fe),$===void 0&&($=[],d.set(fe,$));const Ce=I.textures;if($.length!==Ce.length||$[0]!==s.COLOR_ATTACHMENT0){for(let oe=0,Xe=Ce.length;oe<Xe;oe++)$[oe]=s.COLOR_ATTACHMENT0+oe;$.length=Ce.length,ge=!0}}else $[0]!==s.BACK&&($[0]=s.BACK,ge=!0);ge&&s.drawBuffers($)}function Ie(I){return v!==I?(s.useProgram(I),v=I,!0):!1}const nt={[nn]:s.FUNC_ADD,[b0]:s.FUNC_SUBTRACT,[A0]:s.FUNC_REVERSE_SUBTRACT};nt[w0]=s.MIN,nt[E0]=s.MAX;const ie={[Lr]:s.ZERO,[T0]:s.ONE,[C0]:s.SRC_COLOR,[yf]:s.SRC_ALPHA,[I0]:s.SRC_ALPHA_SATURATE,[$l]:s.DST_COLOR,[Yl]:s.DST_ALPHA,[P0]:s.ONE_MINUS_SRC_COLOR,[Mf]:s.ONE_MINUS_SRC_ALPHA,[L0]:s.ONE_MINUS_DST_COLOR,[R0]:s.ONE_MINUS_DST_ALPHA,[D0]:s.CONSTANT_COLOR,[k0]:s.ONE_MINUS_CONSTANT_COLOR,[U0]:s.CONSTANT_ALPHA,[F0]:s.ONE_MINUS_CONSTANT_ALPHA};function re(I,fe,$,ge,Ce,oe,Xe,Be,wt,Mt){if(I===ni){p===!0&&(ee(s.BLEND),p=!1);return}if(p===!1&&(te(s.BLEND),p=!0),I!==xf){if(I!==g||Mt!==C){if((y!==nn||b!==nn)&&(s.blendEquation(s.FUNC_ADD),y=nn,b=nn),Mt)switch(I){case Nr:s.blendFuncSeparate(s.ONE,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case er:s.blendFunc(s.ONE,s.ONE);break;case fu:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case pu:s.blendFuncSeparate(s.DST_COLOR,s.ONE_MINUS_SRC_ALPHA,s.ZERO,s.ONE);break;default:vt("WebGLState: Invalid blending: ",I);break}else switch(I){case Nr:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case er:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE,s.ONE,s.ONE);break;case fu:vt("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case pu:vt("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:vt("WebGLState: Invalid blending: ",I);break}E=null,M=null,S=null,w=null,x.set(0,0,0),A=0,g=I,C=Mt}return}Ce=Ce||fe,oe=oe||$,Xe=Xe||ge,(fe!==y||Ce!==b)&&(s.blendEquationSeparate(nt[fe],nt[Ce]),y=fe,b=Ce),($!==E||ge!==M||oe!==S||Xe!==w)&&(s.blendFuncSeparate(ie[$],ie[ge],ie[oe],ie[Xe]),E=$,M=ge,S=oe,w=Xe),(Be.equals(x)===!1||wt!==A)&&(s.blendColor(Be.r,Be.g,Be.b,wt),x.copy(Be),A=wt),g=I,C=!1}function he(I,fe){I.side===oi?ee(s.CULL_FACE):te(s.CULL_FACE);let $=I.side===Zt;fe&&($=!$),ue($),I.blending===Nr&&I.transparent===!1?re(ni):re(I.blending,I.blendEquation,I.blendSrc,I.blendDst,I.blendEquationAlpha,I.blendSrcAlpha,I.blendDstAlpha,I.blendColor,I.blendAlpha,I.premultipliedAlpha),a.setFunc(I.depthFunc),a.setTest(I.depthTest),a.setMask(I.depthWrite),r.setMask(I.colorWrite);const ge=I.stencilWrite;o.setTest(ge),ge&&(o.setMask(I.stencilWriteMask),o.setFunc(I.stencilFunc,I.stencilRef,I.stencilFuncMask),o.setOp(I.stencilFail,I.stencilZFail,I.stencilZPass)),We(I.polygonOffset,I.polygonOffsetFactor,I.polygonOffsetUnits),I.alphaToCoverage===!0?te(s.SAMPLE_ALPHA_TO_COVERAGE):ee(s.SAMPLE_ALPHA_TO_COVERAGE)}function ue(I){R!==I&&(I?s.frontFace(s.CW):s.frontFace(s.CCW),R=I)}function xe(I){I!==M0?(te(s.CULL_FACE),I!==D&&(I===du?s.cullFace(s.BACK):I===_0?s.cullFace(s.FRONT):s.cullFace(s.FRONT_AND_BACK))):ee(s.CULL_FACE),D=I}function Ye(I){I!==B&&(H&&s.lineWidth(I),B=I)}function We(I,fe,$){I?(te(s.POLYGON_OFFSET_FILL),(k!==fe||N!==$)&&(k=fe,N=$,a.getReversed()&&(fe=-fe),s.polygonOffset(fe,$))):ee(s.POLYGON_OFFSET_FILL)}function Ve(I){I?te(s.SCISSOR_TEST):ee(s.SCISSOR_TEST)}function Qe(I){I===void 0&&(I=s.TEXTURE0+G-1),j!==I&&(s.activeTexture(I),j=I)}function U(I,fe,$){$===void 0&&(j===null?$=s.TEXTURE0+G-1:$=j);let ge=J[$];ge===void 0&&(ge={type:void 0,texture:void 0},J[$]=ge),(ge.type!==I||ge.texture!==fe)&&(j!==$&&(s.activeTexture($),j=$),s.bindTexture(I,fe||q[I]),ge.type=I,ge.texture=fe)}function pt(){const I=J[j];I!==void 0&&I.type!==void 0&&(s.bindTexture(I.type,null),I.type=void 0,I.texture=void 0)}function st(){try{s.compressedTexImage2D(...arguments)}catch(I){vt("WebGLState:",I)}}function P(){try{s.compressedTexImage3D(...arguments)}catch(I){vt("WebGLState:",I)}}function _(){try{s.texSubImage2D(...arguments)}catch(I){vt("WebGLState:",I)}}function O(){try{s.texSubImage3D(...arguments)}catch(I){vt("WebGLState:",I)}}function z(){try{s.compressedTexSubImage2D(...arguments)}catch(I){vt("WebGLState:",I)}}function Y(){try{s.compressedTexSubImage3D(...arguments)}catch(I){vt("WebGLState:",I)}}function de(){try{s.texStorage2D(...arguments)}catch(I){vt("WebGLState:",I)}}function ye(){try{s.texStorage3D(...arguments)}catch(I){vt("WebGLState:",I)}}function Z(){try{s.texImage2D(...arguments)}catch(I){vt("WebGLState:",I)}}function ne(){try{s.texImage3D(...arguments)}catch(I){vt("WebGLState:",I)}}function Se(I){return f[I]!==void 0?f[I]:s.getParameter(I)}function Fe(I,fe){f[I]!==fe&&(s.pixelStorei(I,fe),f[I]=fe)}function _e(I){ct.equals(I)===!1&&(s.scissor(I.x,I.y,I.z,I.w),ct.copy(I))}function ve(I){tt.equals(I)===!1&&(s.viewport(I.x,I.y,I.z,I.w),tt.copy(I))}function De(I,fe){let $=c.get(fe);$===void 0&&($=new WeakMap,c.set(fe,$));let ge=$.get(I);ge===void 0&&(ge=s.getUniformBlockIndex(fe,I.name),$.set(I,ge))}function ae(I,fe){const ge=c.get(fe).get(I);l.get(fe)!==ge&&(s.uniformBlockBinding(fe,ge,I.__bindingPointIndex),l.set(fe,ge))}function pe(){s.disable(s.BLEND),s.disable(s.CULL_FACE),s.disable(s.DEPTH_TEST),s.disable(s.POLYGON_OFFSET_FILL),s.disable(s.SCISSOR_TEST),s.disable(s.STENCIL_TEST),s.disable(s.SAMPLE_ALPHA_TO_COVERAGE),s.blendEquation(s.FUNC_ADD),s.blendFunc(s.ONE,s.ZERO),s.blendFuncSeparate(s.ONE,s.ZERO,s.ONE,s.ZERO),s.blendColor(0,0,0,0),s.colorMask(!0,!0,!0,!0),s.clearColor(0,0,0,0),s.depthMask(!0),s.depthFunc(s.LESS),a.setReversed(!1),s.clearDepth(1),s.stencilMask(4294967295),s.stencilFunc(s.ALWAYS,0,4294967295),s.stencilOp(s.KEEP,s.KEEP,s.KEEP),s.clearStencil(0),s.cullFace(s.BACK),s.frontFace(s.CCW),s.polygonOffset(0,0),s.activeTexture(s.TEXTURE0),s.bindFramebuffer(s.FRAMEBUFFER,null),s.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),s.bindFramebuffer(s.READ_FRAMEBUFFER,null),s.useProgram(null),s.lineWidth(1),s.scissor(0,0,s.canvas.width,s.canvas.height),s.viewport(0,0,s.canvas.width,s.canvas.height),s.pixelStorei(s.PACK_ALIGNMENT,4),s.pixelStorei(s.UNPACK_ALIGNMENT,4),s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,!1),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,s.BROWSER_DEFAULT_WEBGL),s.pixelStorei(s.PACK_ROW_LENGTH,0),s.pixelStorei(s.PACK_SKIP_PIXELS,0),s.pixelStorei(s.PACK_SKIP_ROWS,0),s.pixelStorei(s.UNPACK_ROW_LENGTH,0),s.pixelStorei(s.UNPACK_IMAGE_HEIGHT,0),s.pixelStorei(s.UNPACK_SKIP_PIXELS,0),s.pixelStorei(s.UNPACK_SKIP_ROWS,0),s.pixelStorei(s.UNPACK_SKIP_IMAGES,0),h={},f={},j=null,J={},u={},d=new WeakMap,m=[],v=null,p=!1,g=null,y=null,E=null,M=null,b=null,S=null,w=null,x=new Te(0,0,0),A=0,C=!1,R=null,D=null,B=null,k=null,N=null,ct.set(0,0,s.canvas.width,s.canvas.height),tt.set(0,0,s.canvas.width,s.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:te,disable:ee,bindFramebuffer:be,drawBuffers:Me,useProgram:Ie,setBlending:re,setMaterial:he,setFlipSided:ue,setCullFace:xe,setLineWidth:Ye,setPolygonOffset:We,setScissorTest:Ve,activeTexture:Qe,bindTexture:U,unbindTexture:pt,compressedTexImage2D:st,compressedTexImage3D:P,texImage2D:Z,texImage3D:ne,pixelStorei:Fe,getParameter:Se,updateUBOMapping:De,uniformBlockBinding:ae,texStorage2D:de,texStorage3D:ye,texSubImage2D:_,texSubImage3D:O,compressedTexSubImage2D:z,compressedTexSubImage3D:Y,scissor:_e,viewport:ve,reset:pe}}function oM(s,e,t,i,n,r,a){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new le,h=new WeakMap,f=new Set;let u;const d=new WeakMap;let m=!1;try{m=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function v(P,_){return m?new OffscreenCanvas(P,_):co("canvas")}function p(P,_,O){let z=1;const Y=st(P);if((Y.width>O||Y.height>O)&&(z=O/Math.max(Y.width,Y.height)),z<1)if(typeof HTMLImageElement<"u"&&P instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&P instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&P instanceof ImageBitmap||typeof VideoFrame<"u"&&P instanceof VideoFrame){const de=Math.floor(z*Y.width),ye=Math.floor(z*Y.height);u===void 0&&(u=v(de,ye));const Z=_?v(de,ye):u;return Z.width=de,Z.height=ye,Z.getContext("2d").drawImage(P,0,0,de,ye),je("WebGLRenderer: Texture has been resized from ("+Y.width+"x"+Y.height+") to ("+de+"x"+ye+")."),Z}else return"data"in P&&je("WebGLRenderer: Image in DataTexture is too big ("+Y.width+"x"+Y.height+")."),P;return P}function g(P){return P.generateMipmaps}function y(P){s.generateMipmap(P)}function E(P){return P.isWebGLCubeRenderTarget?s.TEXTURE_CUBE_MAP:P.isWebGL3DRenderTarget?s.TEXTURE_3D:P.isWebGLArrayRenderTarget||P.isCompressedArrayTexture?s.TEXTURE_2D_ARRAY:s.TEXTURE_2D}function M(P,_,O,z,Y,de=!1){if(P!==null){if(s[P]!==void 0)return s[P];je("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+P+"'")}let ye;z&&(ye=e.get("EXT_texture_norm16"),ye||je("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let Z=_;if(_===s.RED&&(O===s.FLOAT&&(Z=s.R32F),O===s.HALF_FLOAT&&(Z=s.R16F),O===s.UNSIGNED_BYTE&&(Z=s.R8),O===s.UNSIGNED_SHORT&&ye&&(Z=ye.R16_EXT),O===s.SHORT&&ye&&(Z=ye.R16_SNORM_EXT)),_===s.RED_INTEGER&&(O===s.UNSIGNED_BYTE&&(Z=s.R8UI),O===s.UNSIGNED_SHORT&&(Z=s.R16UI),O===s.UNSIGNED_INT&&(Z=s.R32UI),O===s.BYTE&&(Z=s.R8I),O===s.SHORT&&(Z=s.R16I),O===s.INT&&(Z=s.R32I)),_===s.RG&&(O===s.FLOAT&&(Z=s.RG32F),O===s.HALF_FLOAT&&(Z=s.RG16F),O===s.UNSIGNED_BYTE&&(Z=s.RG8),O===s.UNSIGNED_SHORT&&ye&&(Z=ye.RG16_EXT),O===s.SHORT&&ye&&(Z=ye.RG16_SNORM_EXT)),_===s.RG_INTEGER&&(O===s.UNSIGNED_BYTE&&(Z=s.RG8UI),O===s.UNSIGNED_SHORT&&(Z=s.RG16UI),O===s.UNSIGNED_INT&&(Z=s.RG32UI),O===s.BYTE&&(Z=s.RG8I),O===s.SHORT&&(Z=s.RG16I),O===s.INT&&(Z=s.RG32I)),_===s.RGB_INTEGER&&(O===s.UNSIGNED_BYTE&&(Z=s.RGB8UI),O===s.UNSIGNED_SHORT&&(Z=s.RGB16UI),O===s.UNSIGNED_INT&&(Z=s.RGB32UI),O===s.BYTE&&(Z=s.RGB8I),O===s.SHORT&&(Z=s.RGB16I),O===s.INT&&(Z=s.RGB32I)),_===s.RGBA_INTEGER&&(O===s.UNSIGNED_BYTE&&(Z=s.RGBA8UI),O===s.UNSIGNED_SHORT&&(Z=s.RGBA16UI),O===s.UNSIGNED_INT&&(Z=s.RGBA32UI),O===s.BYTE&&(Z=s.RGBA8I),O===s.SHORT&&(Z=s.RGBA16I),O===s.INT&&(Z=s.RGBA32I)),_===s.RGB&&(O===s.UNSIGNED_SHORT&&ye&&(Z=ye.RGB16_EXT),O===s.SHORT&&ye&&(Z=ye.RGB16_SNORM_EXT),O===s.UNSIGNED_INT_5_9_9_9_REV&&(Z=s.RGB9_E5),O===s.UNSIGNED_INT_10F_11F_11F_REV&&(Z=s.R11F_G11F_B10F)),_===s.RGBA){const ne=de?lo:gt.getTransfer(Y);O===s.FLOAT&&(Z=s.RGBA32F),O===s.HALF_FLOAT&&(Z=s.RGBA16F),O===s.UNSIGNED_BYTE&&(Z=ne===bt?s.SRGB8_ALPHA8:s.RGBA8),O===s.UNSIGNED_SHORT&&ye&&(Z=ye.RGBA16_EXT),O===s.SHORT&&ye&&(Z=ye.RGBA16_SNORM_EXT),O===s.UNSIGNED_SHORT_4_4_4_4&&(Z=s.RGBA4),O===s.UNSIGNED_SHORT_5_5_5_1&&(Z=s.RGB5_A1)}return(Z===s.R16F||Z===s.R32F||Z===s.RG16F||Z===s.RG32F||Z===s.RGBA16F||Z===s.RGBA32F)&&e.get("EXT_color_buffer_float"),Z}function b(P,_){let O;return P?_===null||_===cn||_===ir?O=s.DEPTH24_STENCIL8:_===Bi?O=s.DEPTH32F_STENCIL8:_===Xr&&(O=s.DEPTH24_STENCIL8,je("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):_===null||_===cn||_===ir?O=s.DEPTH_COMPONENT24:_===Bi?O=s.DEPTH_COMPONENT32F:_===Xr&&(O=s.DEPTH_COMPONENT16),O}function S(P,_){return g(P)===!0||P.isFramebufferTexture&&P.minFilter!==Qt&&P.minFilter!==di?Math.log2(Math.max(_.width,_.height))+1:P.mipmaps!==void 0&&P.mipmaps.length>0?P.mipmaps.length:P.isCompressedTexture&&Array.isArray(P.image)?_.mipmaps.length:1}function w(P){const _=P.target;_.removeEventListener("dispose",w),A(_),_.isVideoTexture&&h.delete(_),_.isHTMLTexture&&f.delete(_)}function x(P){const _=P.target;_.removeEventListener("dispose",x),R(_)}function A(P){const _=i.get(P);if(_.__webglInit===void 0)return;const O=P.source,z=d.get(O);if(z){const Y=z[_.__cacheKey];Y.usedTimes--,Y.usedTimes===0&&C(P),Object.keys(z).length===0&&d.delete(O)}i.remove(P)}function C(P){const _=i.get(P);s.deleteTexture(_.__webglTexture);const O=P.source,z=d.get(O);delete z[_.__cacheKey],a.memory.textures--}function R(P){const _=i.get(P);if(P.depthTexture&&(P.depthTexture.dispose(),i.remove(P.depthTexture)),P.isWebGLCubeRenderTarget)for(let z=0;z<6;z++){if(Array.isArray(_.__webglFramebuffer[z]))for(let Y=0;Y<_.__webglFramebuffer[z].length;Y++)s.deleteFramebuffer(_.__webglFramebuffer[z][Y]);else s.deleteFramebuffer(_.__webglFramebuffer[z]);_.__webglDepthbuffer&&s.deleteRenderbuffer(_.__webglDepthbuffer[z])}else{if(Array.isArray(_.__webglFramebuffer))for(let z=0;z<_.__webglFramebuffer.length;z++)s.deleteFramebuffer(_.__webglFramebuffer[z]);else s.deleteFramebuffer(_.__webglFramebuffer);if(_.__webglDepthbuffer&&s.deleteRenderbuffer(_.__webglDepthbuffer),_.__webglMultisampledFramebuffer&&s.deleteFramebuffer(_.__webglMultisampledFramebuffer),_.__webglColorRenderbuffer)for(let z=0;z<_.__webglColorRenderbuffer.length;z++)_.__webglColorRenderbuffer[z]&&s.deleteRenderbuffer(_.__webglColorRenderbuffer[z]);_.__webglDepthRenderbuffer&&s.deleteRenderbuffer(_.__webglDepthRenderbuffer)}const O=P.textures;for(let z=0,Y=O.length;z<Y;z++){const de=i.get(O[z]);de.__webglTexture&&(s.deleteTexture(de.__webglTexture),a.memory.textures--),i.remove(O[z])}i.remove(P)}let D=0;function B(){D=0}function k(){return D}function N(P){D=P}function G(){const P=D;return P>=n.maxTextures&&je("WebGLTextures: Trying to use "+(P+1)+" texture units while this GPU supports only "+n.maxTextures),D+=1,P}function H(P){const _=[];return _.push(P.wrapS),_.push(P.wrapT),_.push(P.wrapR||0),_.push(P.magFilter),_.push(P.minFilter),_.push(P.anisotropy),_.push(P.internalFormat),_.push(P.format),_.push(P.type),_.push(P.generateMipmaps),_.push(P.premultiplyAlpha),_.push(P.flipY),_.push(P.unpackAlignment),_.push(P.colorSpace),_.join()}function se(P,_){const O=i.get(P);if(P.isVideoTexture&&U(P),P.isRenderTargetTexture===!1&&P.isExternalTexture!==!0&&P.version>0&&O.__version!==P.version){const z=P.image;if(z===null)je("WebGLRenderer: Texture marked for update but no image data found.");else if(z.complete===!1)je("WebGLRenderer: Texture marked for update but image is incomplete");else{ee(O,P,_);return}}else P.isExternalTexture&&(O.__webglTexture=P.sourceTexture?P.sourceTexture:null);t.bindTexture(s.TEXTURE_2D,O.__webglTexture,s.TEXTURE0+_)}function V(P,_){const O=i.get(P);if(P.isRenderTargetTexture===!1&&P.version>0&&O.__version!==P.version){ee(O,P,_);return}else P.isExternalTexture&&(O.__webglTexture=P.sourceTexture?P.sourceTexture:null);t.bindTexture(s.TEXTURE_2D_ARRAY,O.__webglTexture,s.TEXTURE0+_)}function j(P,_){const O=i.get(P);if(P.isRenderTargetTexture===!1&&P.version>0&&O.__version!==P.version){ee(O,P,_);return}t.bindTexture(s.TEXTURE_3D,O.__webglTexture,s.TEXTURE0+_)}function J(P,_){const O=i.get(P);if(P.isCubeDepthTexture!==!0&&P.version>0&&O.__version!==P.version){be(O,P,_);return}t.bindTexture(s.TEXTURE_CUBE_MAP,O.__webglTexture,s.TEXTURE0+_)}const we={[Wi]:s.REPEAT,[bn]:s.CLAMP_TO_EDGE,[nc]:s.MIRRORED_REPEAT},ce={[Qt]:s.NEAREST,[z0]:s.NEAREST_MIPMAP_NEAREST,[la]:s.NEAREST_MIPMAP_LINEAR,[di]:s.LINEAR,[Ho]:s.LINEAR_MIPMAP_NEAREST,[us]:s.LINEAR_MIPMAP_LINEAR},ct={[W0]:s.NEVER,[$0]:s.ALWAYS,[X0]:s.LESS,[yh]:s.LEQUAL,[q0]:s.EQUAL,[Mh]:s.GEQUAL,[K0]:s.GREATER,[Y0]:s.NOTEQUAL};function tt(P,_){if(_.type===Bi&&e.has("OES_texture_float_linear")===!1&&(_.magFilter===di||_.magFilter===Ho||_.magFilter===la||_.magFilter===us||_.minFilter===di||_.minFilter===Ho||_.minFilter===la||_.minFilter===us)&&je("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),s.texParameteri(P,s.TEXTURE_WRAP_S,we[_.wrapS]),s.texParameteri(P,s.TEXTURE_WRAP_T,we[_.wrapT]),(P===s.TEXTURE_3D||P===s.TEXTURE_2D_ARRAY)&&s.texParameteri(P,s.TEXTURE_WRAP_R,we[_.wrapR]),s.texParameteri(P,s.TEXTURE_MAG_FILTER,ce[_.magFilter]),s.texParameteri(P,s.TEXTURE_MIN_FILTER,ce[_.minFilter]),_.compareFunction&&(s.texParameteri(P,s.TEXTURE_COMPARE_MODE,s.COMPARE_REF_TO_TEXTURE),s.texParameteri(P,s.TEXTURE_COMPARE_FUNC,ct[_.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(_.magFilter===Qt||_.minFilter!==la&&_.minFilter!==us||_.type===Bi&&e.has("OES_texture_float_linear")===!1)return;if(_.anisotropy>1||i.get(_).__currentAnisotropy){const O=e.get("EXT_texture_filter_anisotropic");s.texParameterf(P,O.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(_.anisotropy,n.getMaxAnisotropy())),i.get(_).__currentAnisotropy=_.anisotropy}}}function Je(P,_){let O=!1;P.__webglInit===void 0&&(P.__webglInit=!0,_.addEventListener("dispose",w));const z=_.source;let Y=d.get(z);Y===void 0&&(Y={},d.set(z,Y));const de=H(_);if(de!==P.__cacheKey){Y[de]===void 0&&(Y[de]={texture:s.createTexture(),usedTimes:0},a.memory.textures++,O=!0),Y[de].usedTimes++;const ye=Y[P.__cacheKey];ye!==void 0&&(Y[P.__cacheKey].usedTimes--,ye.usedTimes===0&&C(_)),P.__cacheKey=de,P.__webglTexture=Y[de].texture}return O}function q(P,_,O){return Math.floor(Math.floor(P/O)/_)}function te(P,_,O,z){const de=P.updateRanges;if(de.length===0)t.texSubImage2D(s.TEXTURE_2D,0,0,0,_.width,_.height,O,z,_.data);else{de.sort((Fe,_e)=>Fe.start-_e.start);let ye=0;for(let Fe=1;Fe<de.length;Fe++){const _e=de[ye],ve=de[Fe],De=_e.start+_e.count,ae=q(ve.start,_.width,4),pe=q(_e.start,_.width,4);ve.start<=De+1&&ae===pe&&q(ve.start+ve.count-1,_.width,4)===ae?_e.count=Math.max(_e.count,ve.start+ve.count-_e.start):(++ye,de[ye]=ve)}de.length=ye+1;const Z=t.getParameter(s.UNPACK_ROW_LENGTH),ne=t.getParameter(s.UNPACK_SKIP_PIXELS),Se=t.getParameter(s.UNPACK_SKIP_ROWS);t.pixelStorei(s.UNPACK_ROW_LENGTH,_.width);for(let Fe=0,_e=de.length;Fe<_e;Fe++){const ve=de[Fe],De=Math.floor(ve.start/4),ae=Math.ceil(ve.count/4),pe=De%_.width,I=Math.floor(De/_.width),fe=ae,$=1;t.pixelStorei(s.UNPACK_SKIP_PIXELS,pe),t.pixelStorei(s.UNPACK_SKIP_ROWS,I),t.texSubImage2D(s.TEXTURE_2D,0,pe,I,fe,$,O,z,_.data)}P.clearUpdateRanges(),t.pixelStorei(s.UNPACK_ROW_LENGTH,Z),t.pixelStorei(s.UNPACK_SKIP_PIXELS,ne),t.pixelStorei(s.UNPACK_SKIP_ROWS,Se)}}function ee(P,_,O){let z=s.TEXTURE_2D;(_.isDataArrayTexture||_.isCompressedArrayTexture)&&(z=s.TEXTURE_2D_ARRAY),_.isData3DTexture&&(z=s.TEXTURE_3D);const Y=Je(P,_),de=_.source;t.bindTexture(z,P.__webglTexture,s.TEXTURE0+O);const ye=i.get(de);if(de.version!==ye.__version||Y===!0){if(t.activeTexture(s.TEXTURE0+O),(typeof ImageBitmap<"u"&&_.image instanceof ImageBitmap)===!1){const $=gt.getPrimaries(gt.workingColorSpace),ge=_.colorSpace===Sn?null:gt.getPrimaries(_.colorSpace),Ce=_.colorSpace===Sn||$===ge?s.NONE:s.BROWSER_DEFAULT_WEBGL;t.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,_.flipY),t.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),t.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ce)}t.pixelStorei(s.UNPACK_ALIGNMENT,_.unpackAlignment);let ne=p(_.image,!1,n.maxTextureSize);ne=pt(_,ne);const Se=r.convert(_.format,_.colorSpace),Fe=r.convert(_.type);let _e=M(_.internalFormat,Se,Fe,_.normalized,_.colorSpace,_.isVideoTexture);tt(z,_);let ve;const De=_.mipmaps,ae=_.isVideoTexture!==!0,pe=ye.__version===void 0||Y===!0,I=de.dataReady,fe=S(_,ne);if(_.isDepthTexture)_e=b(_.format===Kn,_.type),pe&&(ae?t.texStorage2D(s.TEXTURE_2D,1,_e,ne.width,ne.height):t.texImage2D(s.TEXTURE_2D,0,_e,ne.width,ne.height,0,Se,Fe,null));else if(_.isDataTexture)if(De.length>0){ae&&pe&&t.texStorage2D(s.TEXTURE_2D,fe,_e,De[0].width,De[0].height);for(let $=0,ge=De.length;$<ge;$++)ve=De[$],ae?I&&t.texSubImage2D(s.TEXTURE_2D,$,0,0,ve.width,ve.height,Se,Fe,ve.data):t.texImage2D(s.TEXTURE_2D,$,_e,ve.width,ve.height,0,Se,Fe,ve.data);_.generateMipmaps=!1}else ae?(pe&&t.texStorage2D(s.TEXTURE_2D,fe,_e,ne.width,ne.height),I&&te(_,ne,Se,Fe)):t.texImage2D(s.TEXTURE_2D,0,_e,ne.width,ne.height,0,Se,Fe,ne.data);else if(_.isCompressedTexture)if(_.isCompressedArrayTexture){ae&&pe&&t.texStorage3D(s.TEXTURE_2D_ARRAY,fe,_e,De[0].width,De[0].height,ne.depth);for(let $=0,ge=De.length;$<ge;$++)if(ve=De[$],_.format!==Li)if(Se!==null)if(ae){if(I)if(_.layerUpdates.size>0){const Ce=rd(ve.width,ve.height,_.format,_.type);for(const oe of _.layerUpdates){const Xe=ve.data.subarray(oe*Ce/ve.data.BYTES_PER_ELEMENT,(oe+1)*Ce/ve.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,$,0,0,oe,ve.width,ve.height,1,Se,Xe)}}else t.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,$,0,0,0,ve.width,ve.height,ne.depth,Se,ve.data)}else t.compressedTexImage3D(s.TEXTURE_2D_ARRAY,$,_e,ve.width,ve.height,ne.depth,0,ve.data,0,0);else je("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else ae?I&&t.texSubImage3D(s.TEXTURE_2D_ARRAY,$,0,0,0,ve.width,ve.height,ne.depth,Se,Fe,ve.data):t.texImage3D(s.TEXTURE_2D_ARRAY,$,_e,ve.width,ve.height,ne.depth,0,Se,Fe,ve.data);_.layerUpdates.size>0&&_.clearLayerUpdates()}else{ae&&pe&&t.texStorage2D(s.TEXTURE_2D,fe,_e,De[0].width,De[0].height);for(let $=0,ge=De.length;$<ge;$++)ve=De[$],_.format!==Li?Se!==null?ae?I&&t.compressedTexSubImage2D(s.TEXTURE_2D,$,0,0,ve.width,ve.height,Se,ve.data):t.compressedTexImage2D(s.TEXTURE_2D,$,_e,ve.width,ve.height,0,ve.data):je("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):ae?I&&t.texSubImage2D(s.TEXTURE_2D,$,0,0,ve.width,ve.height,Se,Fe,ve.data):t.texImage2D(s.TEXTURE_2D,$,_e,ve.width,ve.height,0,Se,Fe,ve.data)}else if(_.isDataArrayTexture)if(ae){if(pe&&t.texStorage3D(s.TEXTURE_2D_ARRAY,fe,_e,ne.width,ne.height,ne.depth),I)if(_.layerUpdates.size>0){const $=rd(ne.width,ne.height,_.format,_.type);for(const ge of _.layerUpdates){const Ce=ne.data.subarray(ge*$/ne.data.BYTES_PER_ELEMENT,(ge+1)*$/ne.data.BYTES_PER_ELEMENT);t.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,ge,ne.width,ne.height,1,Se,Fe,Ce)}_.clearLayerUpdates()}else t.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,0,ne.width,ne.height,ne.depth,Se,Fe,ne.data)}else t.texImage3D(s.TEXTURE_2D_ARRAY,0,_e,ne.width,ne.height,ne.depth,0,Se,Fe,ne.data);else if(_.isData3DTexture)ae?(pe&&t.texStorage3D(s.TEXTURE_3D,fe,_e,ne.width,ne.height,ne.depth),I&&t.texSubImage3D(s.TEXTURE_3D,0,0,0,0,ne.width,ne.height,ne.depth,Se,Fe,ne.data)):t.texImage3D(s.TEXTURE_3D,0,_e,ne.width,ne.height,ne.depth,0,Se,Fe,ne.data);else if(_.isFramebufferTexture){if(pe)if(ae)t.texStorage2D(s.TEXTURE_2D,fe,_e,ne.width,ne.height);else{let $=ne.width,ge=ne.height;for(let Ce=0;Ce<fe;Ce++)t.texImage2D(s.TEXTURE_2D,Ce,_e,$,ge,0,Se,Fe,null),$>>=1,ge>>=1}}else if(_.isHTMLTexture){if("texElementImage2D"in s){const $=s.canvas;if($.hasAttribute("layoutsubtree")||$.setAttribute("layoutsubtree","true"),ne.parentNode!==$){$.appendChild(ne),f.add(_),$.onpaint=ge=>{const Ce=ge.changedElements;for(const oe of f)Ce.includes(oe.image)&&(oe.needsUpdate=!0)},$.requestPaint();return}if(s.texElementImage2D.length===3)s.texElementImage2D(s.TEXTURE_2D,s.RGBA8,ne);else{const Ce=s.RGBA,oe=s.RGBA,Xe=s.UNSIGNED_BYTE;s.texElementImage2D(s.TEXTURE_2D,0,Ce,oe,Xe,ne)}s.texParameteri(s.TEXTURE_2D,s.TEXTURE_MIN_FILTER,s.LINEAR),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_WRAP_S,s.CLAMP_TO_EDGE),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_WRAP_T,s.CLAMP_TO_EDGE)}}else if(De.length>0){if(ae&&pe){const $=st(De[0]);t.texStorage2D(s.TEXTURE_2D,fe,_e,$.width,$.height)}for(let $=0,ge=De.length;$<ge;$++)ve=De[$],ae?I&&t.texSubImage2D(s.TEXTURE_2D,$,0,0,Se,Fe,ve):t.texImage2D(s.TEXTURE_2D,$,_e,Se,Fe,ve);_.generateMipmaps=!1}else if(ae){if(pe){const $=st(ne);t.texStorage2D(s.TEXTURE_2D,fe,_e,$.width,$.height)}I&&t.texSubImage2D(s.TEXTURE_2D,0,0,0,Se,Fe,ne)}else t.texImage2D(s.TEXTURE_2D,0,_e,Se,Fe,ne);g(_)&&y(z),ye.__version=de.version,_.onUpdate&&_.onUpdate(_)}P.__version=_.version}function be(P,_,O){if(_.image.length!==6)return;const z=Je(P,_),Y=_.source;t.bindTexture(s.TEXTURE_CUBE_MAP,P.__webglTexture,s.TEXTURE0+O);const de=i.get(Y);if(Y.version!==de.__version||z===!0){t.activeTexture(s.TEXTURE0+O);const ye=gt.getPrimaries(gt.workingColorSpace),Z=_.colorSpace===Sn?null:gt.getPrimaries(_.colorSpace),ne=_.colorSpace===Sn||ye===Z?s.NONE:s.BROWSER_DEFAULT_WEBGL;t.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,_.flipY),t.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),t.pixelStorei(s.UNPACK_ALIGNMENT,_.unpackAlignment),t.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,ne);const Se=_.isCompressedTexture||_.image[0].isCompressedTexture,Fe=_.image[0]&&_.image[0].isDataTexture,_e=[];for(let oe=0;oe<6;oe++)!Se&&!Fe?_e[oe]=p(_.image[oe],!0,n.maxCubemapSize):_e[oe]=Fe?_.image[oe].image:_.image[oe],_e[oe]=pt(_,_e[oe]);const ve=_e[0],De=r.convert(_.format,_.colorSpace),ae=r.convert(_.type),pe=M(_.internalFormat,De,ae,_.normalized,_.colorSpace),I=_.isVideoTexture!==!0,fe=de.__version===void 0||z===!0,$=Y.dataReady;let ge=S(_,ve);tt(s.TEXTURE_CUBE_MAP,_);let Ce;if(Se){I&&fe&&t.texStorage2D(s.TEXTURE_CUBE_MAP,ge,pe,ve.width,ve.height);for(let oe=0;oe<6;oe++){Ce=_e[oe].mipmaps;for(let Xe=0;Xe<Ce.length;Xe++){const Be=Ce[Xe];_.format!==Li?De!==null?I?$&&t.compressedTexSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+oe,Xe,0,0,Be.width,Be.height,De,Be.data):t.compressedTexImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+oe,Xe,pe,Be.width,Be.height,0,Be.data):je("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):I?$&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+oe,Xe,0,0,Be.width,Be.height,De,ae,Be.data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+oe,Xe,pe,Be.width,Be.height,0,De,ae,Be.data)}}}else{if(Ce=_.mipmaps,I&&fe){Ce.length>0&&ge++;const oe=st(_e[0]);t.texStorage2D(s.TEXTURE_CUBE_MAP,ge,pe,oe.width,oe.height)}for(let oe=0;oe<6;oe++)if(Fe){I?$&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+oe,0,0,0,_e[oe].width,_e[oe].height,De,ae,_e[oe].data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+oe,0,pe,_e[oe].width,_e[oe].height,0,De,ae,_e[oe].data);for(let Xe=0;Xe<Ce.length;Xe++){const wt=Ce[Xe].image[oe].image;I?$&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+oe,Xe+1,0,0,wt.width,wt.height,De,ae,wt.data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+oe,Xe+1,pe,wt.width,wt.height,0,De,ae,wt.data)}}else{I?$&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+oe,0,0,0,De,ae,_e[oe]):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+oe,0,pe,De,ae,_e[oe]);for(let Xe=0;Xe<Ce.length;Xe++){const Be=Ce[Xe];I?$&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+oe,Xe+1,0,0,De,ae,Be.image[oe]):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+oe,Xe+1,pe,De,ae,Be.image[oe])}}}g(_)&&y(s.TEXTURE_CUBE_MAP),de.__version=Y.version,_.onUpdate&&_.onUpdate(_)}P.__version=_.version}function Me(P,_,O,z,Y,de){const ye=r.convert(O.format,O.colorSpace),Z=r.convert(O.type),ne=M(O.internalFormat,ye,Z,O.normalized,O.colorSpace),Se=i.get(_),Fe=i.get(O);if(Fe.__renderTarget=_,!Se.__hasExternalTextures){const _e=Math.max(1,_.width>>de),ve=Math.max(1,_.height>>de);Y===s.TEXTURE_3D||Y===s.TEXTURE_2D_ARRAY?t.texImage3D(Y,de,ne,_e,ve,_.depth,0,ye,Z,null):t.texImage2D(Y,de,ne,_e,ve,0,ye,Z,null)}t.bindFramebuffer(s.FRAMEBUFFER,P),Qe(_)?o.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,z,Y,Fe.__webglTexture,0,Ve(_)):(Y===s.TEXTURE_2D||Y>=s.TEXTURE_CUBE_MAP_POSITIVE_X&&Y<=s.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&s.framebufferTexture2D(s.FRAMEBUFFER,z,Y,Fe.__webglTexture,de),t.bindFramebuffer(s.FRAMEBUFFER,null)}function Ie(P,_,O){if(s.bindRenderbuffer(s.RENDERBUFFER,P),_.depthBuffer){const z=_.depthTexture,Y=z&&z.isDepthTexture?z.type:null,de=b(_.stencilBuffer,Y),ye=_.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;Qe(_)?o.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,Ve(_),de,_.width,_.height):O?s.renderbufferStorageMultisample(s.RENDERBUFFER,Ve(_),de,_.width,_.height):s.renderbufferStorage(s.RENDERBUFFER,de,_.width,_.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,ye,s.RENDERBUFFER,P)}else{const z=_.textures;for(let Y=0;Y<z.length;Y++){const de=z[Y],ye=r.convert(de.format,de.colorSpace),Z=r.convert(de.type),ne=M(de.internalFormat,ye,Z,de.normalized,de.colorSpace);Qe(_)?o.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,Ve(_),ne,_.width,_.height):O?s.renderbufferStorageMultisample(s.RENDERBUFFER,Ve(_),ne,_.width,_.height):s.renderbufferStorage(s.RENDERBUFFER,ne,_.width,_.height)}}s.bindRenderbuffer(s.RENDERBUFFER,null)}function nt(P,_,O){const z=_.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(s.FRAMEBUFFER,P),!(_.depthTexture&&_.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");const Y=i.get(_.depthTexture);if(Y.__renderTarget=_,(!Y.__webglTexture||_.depthTexture.image.width!==_.width||_.depthTexture.image.height!==_.height)&&(_.depthTexture.image.width=_.width,_.depthTexture.image.height=_.height,_.depthTexture.needsUpdate=!0),z){if(Y.__webglInit===void 0&&(Y.__webglInit=!0,_.depthTexture.addEventListener("dispose",w)),Y.__webglTexture===void 0){Y.__webglTexture=s.createTexture(),t.bindTexture(s.TEXTURE_CUBE_MAP,Y.__webglTexture),tt(s.TEXTURE_CUBE_MAP,_.depthTexture);const Se=r.convert(_.depthTexture.format),Fe=r.convert(_.depthTexture.type);let _e;_.depthTexture.format===Cn?_e=s.DEPTH_COMPONENT24:_.depthTexture.format===Kn&&(_e=s.DEPTH24_STENCIL8);for(let ve=0;ve<6;ve++)s.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ve,0,_e,_.width,_.height,0,Se,Fe,null)}}else se(_.depthTexture,0);const de=Y.__webglTexture,ye=Ve(_),Z=z?s.TEXTURE_CUBE_MAP_POSITIVE_X+O:s.TEXTURE_2D,ne=_.depthTexture.format===Kn?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;if(_.depthTexture.format===Cn)Qe(_)?o.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,ne,Z,de,0,ye):s.framebufferTexture2D(s.FRAMEBUFFER,ne,Z,de,0);else if(_.depthTexture.format===Kn)Qe(_)?o.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,ne,Z,de,0,ye):s.framebufferTexture2D(s.FRAMEBUFFER,ne,Z,de,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function ie(P){const _=i.get(P),O=P.isWebGLCubeRenderTarget===!0;if(_.__boundDepthTexture!==P.depthTexture){const z=P.depthTexture;if(_.__depthDisposeCallback&&_.__depthDisposeCallback(),z){const Y=()=>{delete _.__boundDepthTexture,delete _.__depthDisposeCallback,z.removeEventListener("dispose",Y)};z.addEventListener("dispose",Y),_.__depthDisposeCallback=Y}_.__boundDepthTexture=z}if(P.depthTexture&&!_.__autoAllocateDepthBuffer)if(O)for(let z=0;z<6;z++)nt(_.__webglFramebuffer[z],P,z);else{const z=P.texture.mipmaps;z&&z.length>0?nt(_.__webglFramebuffer[0],P,0):nt(_.__webglFramebuffer,P,0)}else if(O){_.__webglDepthbuffer=[];for(let z=0;z<6;z++)if(t.bindFramebuffer(s.FRAMEBUFFER,_.__webglFramebuffer[z]),_.__webglDepthbuffer[z]===void 0)_.__webglDepthbuffer[z]=s.createRenderbuffer(),Ie(_.__webglDepthbuffer[z],P,!1);else{const Y=P.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,de=_.__webglDepthbuffer[z];s.bindRenderbuffer(s.RENDERBUFFER,de),s.framebufferRenderbuffer(s.FRAMEBUFFER,Y,s.RENDERBUFFER,de)}}else{const z=P.texture.mipmaps;if(z&&z.length>0?t.bindFramebuffer(s.FRAMEBUFFER,_.__webglFramebuffer[0]):t.bindFramebuffer(s.FRAMEBUFFER,_.__webglFramebuffer),_.__webglDepthbuffer===void 0)_.__webglDepthbuffer=s.createRenderbuffer(),Ie(_.__webglDepthbuffer,P,!1);else{const Y=P.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,de=_.__webglDepthbuffer;s.bindRenderbuffer(s.RENDERBUFFER,de),s.framebufferRenderbuffer(s.FRAMEBUFFER,Y,s.RENDERBUFFER,de)}}t.bindFramebuffer(s.FRAMEBUFFER,null)}function re(P,_,O){const z=i.get(P);_!==void 0&&Me(z.__webglFramebuffer,P,P.texture,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,0),O!==void 0&&ie(P)}function he(P){const _=P.texture,O=i.get(P),z=i.get(_);P.addEventListener("dispose",x);const Y=P.textures,de=P.isWebGLCubeRenderTarget===!0,ye=Y.length>1;if(ye||(z.__webglTexture===void 0&&(z.__webglTexture=s.createTexture()),z.__version=_.version,a.memory.textures++),de){O.__webglFramebuffer=[];for(let Z=0;Z<6;Z++)if(_.mipmaps&&_.mipmaps.length>0){O.__webglFramebuffer[Z]=[];for(let ne=0;ne<_.mipmaps.length;ne++)O.__webglFramebuffer[Z][ne]=s.createFramebuffer()}else O.__webglFramebuffer[Z]=s.createFramebuffer()}else{if(_.mipmaps&&_.mipmaps.length>0){O.__webglFramebuffer=[];for(let Z=0;Z<_.mipmaps.length;Z++)O.__webglFramebuffer[Z]=s.createFramebuffer()}else O.__webglFramebuffer=s.createFramebuffer();if(ye)for(let Z=0,ne=Y.length;Z<ne;Z++){const Se=i.get(Y[Z]);Se.__webglTexture===void 0&&(Se.__webglTexture=s.createTexture(),a.memory.textures++)}if(P.samples>0&&Qe(P)===!1){O.__webglMultisampledFramebuffer=s.createFramebuffer(),O.__webglColorRenderbuffer=[],t.bindFramebuffer(s.FRAMEBUFFER,O.__webglMultisampledFramebuffer);for(let Z=0;Z<Y.length;Z++){const ne=Y[Z];O.__webglColorRenderbuffer[Z]=s.createRenderbuffer(),s.bindRenderbuffer(s.RENDERBUFFER,O.__webglColorRenderbuffer[Z]);const Se=r.convert(ne.format,ne.colorSpace),Fe=r.convert(ne.type),_e=M(ne.internalFormat,Se,Fe,ne.normalized,ne.colorSpace,P.isXRRenderTarget===!0),ve=Ve(P);s.renderbufferStorageMultisample(s.RENDERBUFFER,ve,_e,P.width,P.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+Z,s.RENDERBUFFER,O.__webglColorRenderbuffer[Z])}s.bindRenderbuffer(s.RENDERBUFFER,null),P.depthBuffer&&(O.__webglDepthRenderbuffer=s.createRenderbuffer(),Ie(O.__webglDepthRenderbuffer,P,!0)),t.bindFramebuffer(s.FRAMEBUFFER,null)}}if(de){t.bindTexture(s.TEXTURE_CUBE_MAP,z.__webglTexture),tt(s.TEXTURE_CUBE_MAP,_);for(let Z=0;Z<6;Z++)if(_.mipmaps&&_.mipmaps.length>0)for(let ne=0;ne<_.mipmaps.length;ne++)Me(O.__webglFramebuffer[Z][ne],P,_,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+Z,ne);else Me(O.__webglFramebuffer[Z],P,_,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+Z,0);g(_)&&y(s.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(ye){for(let Z=0,ne=Y.length;Z<ne;Z++){const Se=Y[Z],Fe=i.get(Se);let _e=s.TEXTURE_2D;(P.isWebGL3DRenderTarget||P.isWebGLArrayRenderTarget)&&(_e=P.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),t.bindTexture(_e,Fe.__webglTexture),tt(_e,Se),Me(O.__webglFramebuffer,P,Se,s.COLOR_ATTACHMENT0+Z,_e,0),g(Se)&&y(_e)}t.unbindTexture()}else{let Z=s.TEXTURE_2D;if((P.isWebGL3DRenderTarget||P.isWebGLArrayRenderTarget)&&(Z=P.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),t.bindTexture(Z,z.__webglTexture),tt(Z,_),_.mipmaps&&_.mipmaps.length>0)for(let ne=0;ne<_.mipmaps.length;ne++)Me(O.__webglFramebuffer[ne],P,_,s.COLOR_ATTACHMENT0,Z,ne);else Me(O.__webglFramebuffer,P,_,s.COLOR_ATTACHMENT0,Z,0);g(_)&&y(Z),t.unbindTexture()}P.depthBuffer&&ie(P)}function ue(P){const _=P.textures;for(let O=0,z=_.length;O<z;O++){const Y=_[O];if(g(Y)){const de=E(P),ye=i.get(Y).__webglTexture;t.bindTexture(de,ye),y(de),t.unbindTexture()}}}const xe=[],Ye=[];function We(P){if(P.samples>0){if(Qe(P)===!1){const _=P.textures,O=P.width,z=P.height;let Y=s.COLOR_BUFFER_BIT;const de=P.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,ye=i.get(P),Z=_.length>1;if(Z)for(let Se=0;Se<_.length;Se++)t.bindFramebuffer(s.FRAMEBUFFER,ye.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+Se,s.RENDERBUFFER,null),t.bindFramebuffer(s.FRAMEBUFFER,ye.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+Se,s.TEXTURE_2D,null,0);t.bindFramebuffer(s.READ_FRAMEBUFFER,ye.__webglMultisampledFramebuffer);const ne=P.texture.mipmaps;ne&&ne.length>0?t.bindFramebuffer(s.DRAW_FRAMEBUFFER,ye.__webglFramebuffer[0]):t.bindFramebuffer(s.DRAW_FRAMEBUFFER,ye.__webglFramebuffer);for(let Se=0;Se<_.length;Se++){if(P.resolveDepthBuffer&&(P.depthBuffer&&(Y|=s.DEPTH_BUFFER_BIT),P.stencilBuffer&&P.resolveStencilBuffer&&(Y|=s.STENCIL_BUFFER_BIT)),Z){s.framebufferRenderbuffer(s.READ_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.RENDERBUFFER,ye.__webglColorRenderbuffer[Se]);const Fe=i.get(_[Se]).__webglTexture;s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,Fe,0)}s.blitFramebuffer(0,0,O,z,0,0,O,z,Y,s.NEAREST),l===!0&&(xe.length=0,Ye.length=0,xe.push(s.COLOR_ATTACHMENT0+Se),P.depthBuffer&&P.storeMultisampledDepthBuffer===!1&&(xe.push(de),Ye.push(de),s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,Ye)),s.invalidateFramebuffer(s.READ_FRAMEBUFFER,xe))}if(t.bindFramebuffer(s.READ_FRAMEBUFFER,null),t.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),Z)for(let Se=0;Se<_.length;Se++){t.bindFramebuffer(s.FRAMEBUFFER,ye.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+Se,s.RENDERBUFFER,ye.__webglColorRenderbuffer[Se]);const Fe=i.get(_[Se]).__webglTexture;t.bindFramebuffer(s.FRAMEBUFFER,ye.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+Se,s.TEXTURE_2D,Fe,0)}t.bindFramebuffer(s.DRAW_FRAMEBUFFER,ye.__webglMultisampledFramebuffer)}else if(P.depthBuffer&&P.storeMultisampledDepthBuffer===!1&&l){const _=P.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,[_])}}}function Ve(P){return Math.min(n.maxSamples,P.samples)}function Qe(P){const _=i.get(P);return P.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&_.__useRenderToTexture!==!1}function U(P){const _=a.render.frame;h.get(P)!==_&&(h.set(P,_),P.update())}function pt(P,_){const O=P.colorSpace,z=P.format,Y=P.type;return P.isCompressedTexture===!0||P.isVideoTexture===!0||O!==oo&&O!==Sn&&(gt.getTransfer(O)===bt?(z!==Li||Y!==wi)&&je("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):vt("WebGLTextures: Unsupported texture color space:",O)),_}function st(P){return typeof HTMLImageElement<"u"&&P instanceof HTMLImageElement?(c.width=P.naturalWidth||P.width,c.height=P.naturalHeight||P.height):typeof VideoFrame<"u"&&P instanceof VideoFrame?(c.width=P.displayWidth,c.height=P.displayHeight):(c.width=P.width,c.height=P.height),c}this.allocateTextureUnit=G,this.resetTextureUnits=B,this.getTextureUnits=k,this.setTextureUnits=N,this.setTexture2D=se,this.setTexture2DArray=V,this.setTexture3D=j,this.setTextureCube=J,this.rebindTextures=re,this.setupRenderTarget=he,this.updateRenderTargetMipmap=ue,this.updateMultisampleRenderTarget=We,this.setupDepthRenderbuffer=ie,this.setupFrameBufferTexture=Me,this.useMultisampledRTT=Qe,this.isReversedDepthBuffer=function(){return t.buffers.depth.getReversed()}}function lM(s,e){function t(i,n=Sn){let r;const a=gt.getTransfer(n);if(i===wi)return s.UNSIGNED_BYTE;if(i===fh)return s.UNSIGNED_SHORT_4_4_4_4;if(i===ph)return s.UNSIGNED_SHORT_5_5_5_1;if(i===Af)return s.UNSIGNED_INT_5_9_9_9_REV;if(i===wf)return s.UNSIGNED_INT_10F_11F_11F_REV;if(i===Sf)return s.BYTE;if(i===bf)return s.SHORT;if(i===Xr)return s.UNSIGNED_SHORT;if(i===dh)return s.INT;if(i===cn)return s.UNSIGNED_INT;if(i===Bi)return s.FLOAT;if(i===li)return s.HALF_FLOAT;if(i===Ef)return s.ALPHA;if(i===Tf)return s.RGB;if(i===Li)return s.RGBA;if(i===Cn)return s.DEPTH_COMPONENT;if(i===Kn)return s.DEPTH_STENCIL;if(i===mh)return s.RED;if(i===gh)return s.RED_INTEGER;if(i===ms)return s.RG;if(i===vh)return s.RG_INTEGER;if(i===xh)return s.RGBA_INTEGER;if(i===Za||i===Ja||i===ja||i===eo)if(a===bt)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(i===Za)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===Ja)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===ja)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===eo)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(i===Za)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===Ja)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===ja)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===eo)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===sc||i===rc||i===ac||i===oc)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(i===sc)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===rc)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===ac)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===oc)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===lc||i===cc||i===hc||i===uc||i===dc||i===ro||i===fc)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(i===lc||i===cc)return a===bt?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(i===hc)return a===bt?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(i===uc)return r.COMPRESSED_R11_EAC;if(i===dc)return r.COMPRESSED_SIGNED_R11_EAC;if(i===ro)return r.COMPRESSED_RG11_EAC;if(i===fc)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(i===pc||i===mc||i===gc||i===vc||i===xc||i===yc||i===Mc||i===_c||i===Sc||i===bc||i===Ac||i===wc||i===Ec||i===Tc)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(i===pc)return a===bt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===mc)return a===bt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===gc)return a===bt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===vc)return a===bt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===xc)return a===bt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===yc)return a===bt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===Mc)return a===bt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===_c)return a===bt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===Sc)return a===bt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===bc)return a===bt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===Ac)return a===bt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===wc)return a===bt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===Ec)return a===bt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===Tc)return a===bt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===Cc||i===Pc||i===Rc)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(i===Cc)return a===bt?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===Pc)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===Rc)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===Lc||i===Ic||i===ao||i===Dc)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(i===Lc)return r.COMPRESSED_RED_RGTC1_EXT;if(i===Ic)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===ao)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===Dc)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===ir?s.UNSIGNED_INT_24_8:s[i]!==void 0?s[i]:null}return{convert:t}}const cM=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,hM=`
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

}`;class uM{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const i=new Bf(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,i=new Ot({vertexShader:cM,fragmentShader:hM,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Ge(new Oi(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class dM extends vs{constructor(e,t){super();const i=this;let n=null,r=1,a=null,o="local-floor",l=1,c=null,h=null,f=null,u=null,d=null,m=null;const v=typeof XRWebGLBinding<"u",p=new uM,g={},y=t.getContextAttributes();let E=null,M=null;const b=[],S=[],w=new le;let x=null,A=null;const C=new Ai;C.viewport=new Ct;const R=new Ai;R.viewport=new Ct;const D=[C,R],B=new xg;let k=null,N=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(q){let te=b[q];return te===void 0&&(te=new Qo,b[q]=te),te.getTargetRaySpace()},this.getControllerGrip=function(q){let te=b[q];return te===void 0&&(te=new Qo,b[q]=te),te.getGripSpace()},this.getHand=function(q){let te=b[q];return te===void 0&&(te=new Qo,b[q]=te),te.getHandSpace()};function G(q){const te=S.indexOf(q.inputSource);if(te===-1)return;const ee=b[te];ee!==void 0&&(ee.update(q.inputSource,q.frame,c||a),ee.dispatchEvent({type:q.type,data:q.inputSource}))}function H(){n.removeEventListener("select",G),n.removeEventListener("selectstart",G),n.removeEventListener("selectend",G),n.removeEventListener("squeeze",G),n.removeEventListener("squeezestart",G),n.removeEventListener("squeezeend",G),n.removeEventListener("end",H),n.removeEventListener("inputsourceschange",se);for(let q=0;q<b.length;q++){const te=S[q];te!==null&&(S[q]=null,b[q].disconnect(te))}k=null,N=null,p.reset();for(const q in g)delete g[q];if(e.setRenderTarget(E),d=null,u=null,f=null,n=null,M=null,Je.stop(),i.isPresenting=!1,e.setPixelRatio(x),e.setSize(w.width,w.height,!1),A!==null){const q=A.camera;q.fov=A.fov,q.zoom=A.zoom,q.updateProjectionMatrix(),A=null}i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(q){r=q,i.isPresenting===!0&&je("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(q){o=q,i.isPresenting===!0&&je("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(q){c=q},this.getBaseLayer=function(){return u!==null?u:d},this.getBinding=function(){return f===null&&v&&(f=new XRWebGLBinding(n,t)),f},this.getFrame=function(){return m},this.getSession=function(){return n},this.setSession=async function(q){if(n=q,n!==null){if(E=e.getRenderTarget(),n.addEventListener("select",G),n.addEventListener("selectstart",G),n.addEventListener("selectend",G),n.addEventListener("squeeze",G),n.addEventListener("squeezestart",G),n.addEventListener("squeezeend",G),n.addEventListener("end",H),n.addEventListener("inputsourceschange",se),y.xrCompatible!==!0&&await t.makeXRCompatible(),x=e.getPixelRatio(),e.getSize(w),v&&"createProjectionLayer"in XRWebGLBinding.prototype){let ee=null,be=null,Me=null;y.depth&&(Me=y.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,ee=y.stencil?Kn:Cn,be=y.stencil?ir:cn);const Ie={colorFormat:t.RGBA8,depthFormat:Me,scaleFactor:r};f=this.getBinding(),u=f.createProjectionLayer(Ie),n.updateRenderState({layers:[u]}),e.setPixelRatio(1),e.setSize(u.textureWidth,u.textureHeight,!1),M=new ai(u.textureWidth,u.textureHeight,{format:Li,type:wi,depthTexture:new sr(u.textureWidth,u.textureHeight,be,void 0,void 0,void 0,void 0,void 0,void 0,ee),stencilBuffer:y.stencil,colorSpace:e.outputColorSpace,samples:y.antialias?4:0,resolveDepthBuffer:u.ignoreDepthValues===!1,resolveStencilBuffer:u.ignoreDepthValues===!1,storeMultisampledDepthBuffer:u.ignoreDepthValues===!1,storeMultisampledStencilBuffer:u.ignoreDepthValues===!1})}else{const ee={antialias:y.antialias,alpha:!0,depth:y.depth,stencil:y.stencil,framebufferScaleFactor:r};d=new XRWebGLLayer(n,t,ee),n.updateRenderState({baseLayer:d}),e.setPixelRatio(1),e.setSize(d.framebufferWidth,d.framebufferHeight,!1),M=new ai(d.framebufferWidth,d.framebufferHeight,{format:Li,type:wi,colorSpace:e.outputColorSpace,stencilBuffer:y.stencil,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1,storeMultisampledDepthBuffer:d.ignoreDepthValues===!1,storeMultisampledStencilBuffer:d.ignoreDepthValues===!1})}M.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await n.requestReferenceSpace(o),Je.setContext(n),Je.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(n!==null)return n.environmentBlendMode},this.getDepthTexture=function(){return p.getDepthTexture()};function se(q){for(let te=0;te<q.removed.length;te++){const ee=q.removed[te],be=S.indexOf(ee);be>=0&&(S[be]=null,b[be].disconnect(ee))}for(let te=0;te<q.added.length;te++){const ee=q.added[te];let be=S.indexOf(ee);if(be===-1){for(let Ie=0;Ie<b.length;Ie++)if(Ie>=S.length){S.push(ee),be=Ie;break}else if(S[Ie]===null){S[Ie]=ee,be=Ie;break}if(be===-1)break}const Me=b[be];Me&&Me.connect(ee)}}const V=new L,j=new L;function J(q,te,ee){V.setFromMatrixPosition(te.matrixWorld),j.setFromMatrixPosition(ee.matrixWorld);const be=V.distanceTo(j),Me=te.projectionMatrix.elements,Ie=ee.projectionMatrix.elements,nt=Me[14]/(Me[10]-1),ie=Me[14]/(Me[10]+1),re=(Me[9]+1)/Me[5],he=(Me[9]-1)/Me[5],ue=(Me[8]-1)/Me[0],xe=(Ie[8]+1)/Ie[0],Ye=nt*ue,We=nt*xe,Ve=be/(-ue+xe),Qe=Ve*-ue;if(te.matrixWorld.decompose(q.position,q.quaternion,q.scale),q.translateX(Qe),q.translateZ(Ve),q.matrixWorld.compose(q.position,q.quaternion,q.scale),q.matrixWorldInverse.copy(q.matrixWorld).invert(),Me[10]===-1)q.projectionMatrix.copy(te.projectionMatrix),q.projectionMatrixInverse.copy(te.projectionMatrixInverse);else{const U=nt+Ve,pt=ie+Ve,st=Ye-Qe,P=We+(be-Qe),_=re*ie/pt*U,O=he*ie/pt*U;q.projectionMatrix.makePerspective(st,P,_,O,U,pt),q.projectionMatrixInverse.copy(q.projectionMatrix).invert()}}function we(q,te){te===null?q.matrixWorld.copy(q.matrix):q.matrixWorld.multiplyMatrices(te.matrixWorld,q.matrix),q.matrixWorldInverse.copy(q.matrixWorld).invert()}this.updateCamera=function(q){if(n===null)return;let te=q.near,ee=q.far;p.texture!==null&&(p.depthNear>0&&(te=p.depthNear),p.depthFar>0&&(ee=p.depthFar)),B.near=R.near=C.near=te,B.far=R.far=C.far=ee,(k!==B.near||N!==B.far)&&(n.updateRenderState({depthNear:B.near,depthFar:B.far}),k=B.near,N=B.far),B.layers.mask=q.layers.mask|6,C.layers.mask=B.layers.mask&-5,R.layers.mask=B.layers.mask&-3;const be=q.parent,Me=B.cameras;we(B,be);for(let Ie=0;Ie<Me.length;Ie++)we(Me[Ie],be);Me.length===2?J(B,C,R):B.projectionMatrix.copy(C.projectionMatrix),A===null&&q.isPerspectiveCamera&&(A={camera:q,fov:q.fov,zoom:q.zoom}),ce(q,B,be)};function ce(q,te,ee){ee===null?q.matrix.copy(te.matrixWorld):(q.matrix.copy(ee.matrixWorld),q.matrix.invert(),q.matrix.multiply(te.matrixWorld)),q.matrix.decompose(q.position,q.quaternion,q.scale),q.updateMatrixWorld(!0),q.projectionMatrix.copy(te.projectionMatrix),q.projectionMatrixInverse.copy(te.projectionMatrixInverse),q.isPerspectiveCamera&&(q.fov=kc*2*Math.atan(1/q.projectionMatrix.elements[5]),q.zoom=1)}this.getCamera=function(){return B},this.getFoveation=function(){if(!(u===null&&d===null))return l},this.setFoveation=function(q){l=q,u!==null&&(u.fixedFoveation=q),d!==null&&d.fixedFoveation!==void 0&&(d.fixedFoveation=q)},this.hasDepthSensing=function(){return p.texture!==null},this.getDepthSensingMesh=function(){return p.getMesh(B)},this.getCameraTexture=function(q){return g[q]};let ct=null;function tt(q,te){if(h=te.getViewerPose(c||a),m=te,h!==null){const ee=h.views;d!==null&&(e.setRenderTargetFramebuffer(M,d.framebuffer),e.setRenderTarget(M));let be=!1;ee.length!==B.cameras.length&&(B.cameras.length=0,be=!0);for(let ie=0;ie<ee.length;ie++){const re=ee[ie];let he=null;if(d!==null)he=d.getViewport(re);else{const xe=f.getViewSubImage(u,re);he=xe.viewport,ie===0&&(e.setRenderTargetTextures(M,xe.colorTexture,xe.depthStencilTexture),e.setRenderTarget(M))}let ue=D[ie];ue===void 0&&(ue=new Ai,ue.layers.enable(ie),ue.viewport=new Ct,D[ie]=ue),ue.matrix.fromArray(re.transform.matrix),ue.matrix.decompose(ue.position,ue.quaternion,ue.scale),ue.projectionMatrix.fromArray(re.projectionMatrix),ue.projectionMatrixInverse.copy(ue.projectionMatrix).invert(),ue.viewport.set(he.x,he.y,he.width,he.height),ie===0&&(B.matrix.copy(ue.matrix),B.matrix.decompose(B.position,B.quaternion,B.scale)),be===!0&&B.cameras.push(ue)}const Me=n.enabledFeatures;if(Me&&Me.includes("depth-sensing")&&n.depthUsage=="gpu-optimized"&&v){f=i.getBinding();const ie=f.getDepthInformation(ee[0]);ie&&ie.isValid&&ie.texture&&p.init(ie,n.renderState)}if(Me&&Me.includes("camera-access")&&v){e.state.unbindTexture(),f=i.getBinding();for(let ie=0;ie<ee.length;ie++){const re=ee[ie].camera;if(re){let he=g[re];he||(he=new Bf,g[re]=he);const ue=f.getCameraImage(re);he.sourceTexture=ue}}}}for(let ee=0;ee<b.length;ee++){const be=S[ee],Me=b[ee];be!==null&&Me!==void 0&&Me.update(be,te,c||a)}ct&&ct(q,te),te.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:te}),m=null}const Je=new Jf;Je.setAnimationLoop(tt),this.setAnimationLoop=function(q){ct=q},this.dispose=function(){}}}const fM=new rt,rp=new it;rp.set(-1,0,0,0,1,0,0,0,1);function pM(s,e){function t(p,g){p.matrixAutoUpdate===!0&&p.updateMatrix(),g.value.copy(p.matrix)}function i(p,g){g.color.getRGB(p.fogColor.value,Kf(s)),g.isFog?(p.fogNear.value=g.near,p.fogFar.value=g.far):g.isFogExp2&&(p.fogDensity.value=g.density)}function n(p,g,y,E,M){g.isNodeMaterial?g.uniformsNeedUpdate=!1:g.isMeshBasicMaterial?r(p,g):g.isMeshLambertMaterial?(r(p,g),g.envMap&&(p.envMapIntensity.value=g.envMapIntensity)):g.isMeshToonMaterial?(r(p,g),f(p,g)):g.isMeshPhongMaterial?(r(p,g),h(p,g),g.envMap&&(p.envMapIntensity.value=g.envMapIntensity)):g.isMeshStandardMaterial?(r(p,g),u(p,g),g.isMeshPhysicalMaterial&&d(p,g,M)):g.isMeshMatcapMaterial?(r(p,g),m(p,g)):g.isMeshDepthMaterial?r(p,g):g.isMeshDistanceMaterial?(r(p,g),v(p,g)):g.isMeshNormalMaterial?r(p,g):g.isLineBasicMaterial?(a(p,g),g.isLineDashedMaterial&&o(p,g)):g.isPointsMaterial?l(p,g,y,E):g.isSpriteMaterial?c(p,g):g.isShadowMaterial?(p.color.value.copy(g.color),p.opacity.value=g.opacity):g.isShaderMaterial&&(g.uniformsNeedUpdate=!1)}function r(p,g){p.opacity.value=g.opacity,g.color&&p.diffuse.value.copy(g.color),g.emissive&&p.emissive.value.copy(g.emissive).multiplyScalar(g.emissiveIntensity),g.map&&(p.map.value=g.map,t(g.map,p.mapTransform)),g.alphaMap&&(p.alphaMap.value=g.alphaMap,t(g.alphaMap,p.alphaMapTransform)),g.bumpMap&&(p.bumpMap.value=g.bumpMap,t(g.bumpMap,p.bumpMapTransform),p.bumpScale.value=g.bumpScale,g.side===Zt&&(p.bumpScale.value*=-1)),g.normalMap&&(p.normalMap.value=g.normalMap,t(g.normalMap,p.normalMapTransform),p.normalScale.value.copy(g.normalScale),g.side===Zt&&p.normalScale.value.negate()),g.displacementMap&&(p.displacementMap.value=g.displacementMap,t(g.displacementMap,p.displacementMapTransform),p.displacementScale.value=g.displacementScale,p.displacementBias.value=g.displacementBias),g.emissiveMap&&(p.emissiveMap.value=g.emissiveMap,t(g.emissiveMap,p.emissiveMapTransform)),g.specularMap&&(p.specularMap.value=g.specularMap,t(g.specularMap,p.specularMapTransform)),g.alphaTest>0&&(p.alphaTest.value=g.alphaTest);const y=e.get(g),E=y.envMap,M=y.envMapRotation;E&&(p.envMap.value=E,p.envMapRotation.value.setFromMatrix4(fM.makeRotationFromEuler(M)).transpose(),E.isCubeTexture&&E.isRenderTargetTexture===!1&&p.envMapRotation.value.premultiply(rp),p.reflectivity.value=g.reflectivity,p.ior.value=g.ior,p.refractionRatio.value=g.refractionRatio),g.lightMap&&(p.lightMap.value=g.lightMap,p.lightMapIntensity.value=g.lightMapIntensity,t(g.lightMap,p.lightMapTransform)),g.aoMap&&(p.aoMap.value=g.aoMap,p.aoMapIntensity.value=g.aoMapIntensity,t(g.aoMap,p.aoMapTransform))}function a(p,g){p.diffuse.value.copy(g.color),p.opacity.value=g.opacity,g.map&&(p.map.value=g.map,t(g.map,p.mapTransform))}function o(p,g){p.dashSize.value=g.dashSize,p.totalSize.value=g.dashSize+g.gapSize,p.scale.value=g.scale}function l(p,g,y,E){p.diffuse.value.copy(g.color),p.opacity.value=g.opacity,p.size.value=g.size*y,p.scale.value=E*.5,g.map&&(p.map.value=g.map,t(g.map,p.uvTransform)),g.alphaMap&&(p.alphaMap.value=g.alphaMap,t(g.alphaMap,p.alphaMapTransform)),g.alphaTest>0&&(p.alphaTest.value=g.alphaTest)}function c(p,g){p.diffuse.value.copy(g.color),p.opacity.value=g.opacity,p.rotation.value=g.rotation,g.map&&(p.map.value=g.map,t(g.map,p.mapTransform)),g.alphaMap&&(p.alphaMap.value=g.alphaMap,t(g.alphaMap,p.alphaMapTransform)),g.alphaTest>0&&(p.alphaTest.value=g.alphaTest)}function h(p,g){p.specular.value.copy(g.specular),p.shininess.value=Math.max(g.shininess,1e-4)}function f(p,g){g.gradientMap&&(p.gradientMap.value=g.gradientMap)}function u(p,g){p.metalness.value=g.metalness,g.metalnessMap&&(p.metalnessMap.value=g.metalnessMap,t(g.metalnessMap,p.metalnessMapTransform)),p.roughness.value=g.roughness,g.roughnessMap&&(p.roughnessMap.value=g.roughnessMap,t(g.roughnessMap,p.roughnessMapTransform)),g.envMap&&(p.envMapIntensity.value=g.envMapIntensity)}function d(p,g,y){p.ior.value=g.ior,g.sheen>0&&(p.sheenColor.value.copy(g.sheenColor).multiplyScalar(g.sheen),p.sheenRoughness.value=g.sheenRoughness,g.sheenColorMap&&(p.sheenColorMap.value=g.sheenColorMap,t(g.sheenColorMap,p.sheenColorMapTransform)),g.sheenRoughnessMap&&(p.sheenRoughnessMap.value=g.sheenRoughnessMap,t(g.sheenRoughnessMap,p.sheenRoughnessMapTransform))),g.clearcoat>0&&(p.clearcoat.value=g.clearcoat,p.clearcoatRoughness.value=g.clearcoatRoughness,g.clearcoatMap&&(p.clearcoatMap.value=g.clearcoatMap,t(g.clearcoatMap,p.clearcoatMapTransform)),g.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=g.clearcoatRoughnessMap,t(g.clearcoatRoughnessMap,p.clearcoatRoughnessMapTransform)),g.clearcoatNormalMap&&(p.clearcoatNormalMap.value=g.clearcoatNormalMap,t(g.clearcoatNormalMap,p.clearcoatNormalMapTransform),p.clearcoatNormalScale.value.copy(g.clearcoatNormalScale),g.side===Zt&&p.clearcoatNormalScale.value.negate())),g.dispersion>0&&(p.dispersion.value=g.dispersion),g.retroreflectivity>0&&(p.retroreflectivity.value=g.retroreflectivity),g.iridescence>0&&(p.iridescence.value=g.iridescence,p.iridescenceIOR.value=g.iridescenceIOR,p.iridescenceThicknessMinimum.value=g.iridescenceThicknessRange[0],p.iridescenceThicknessMaximum.value=g.iridescenceThicknessRange[1],g.iridescenceMap&&(p.iridescenceMap.value=g.iridescenceMap,t(g.iridescenceMap,p.iridescenceMapTransform)),g.iridescenceThicknessMap&&(p.iridescenceThicknessMap.value=g.iridescenceThicknessMap,t(g.iridescenceThicknessMap,p.iridescenceThicknessMapTransform))),g.transmission>0&&(p.transmission.value=g.transmission,p.transmissionSamplerMap.value=y.texture,p.transmissionSamplerSize.value.set(y.width,y.height),g.transmissionMap&&(p.transmissionMap.value=g.transmissionMap,t(g.transmissionMap,p.transmissionMapTransform)),p.thickness.value=g.thickness,g.thicknessMap&&(p.thicknessMap.value=g.thicknessMap,t(g.thicknessMap,p.thicknessMapTransform)),p.attenuationDistance.value=g.attenuationDistance,p.attenuationColor.value.copy(g.attenuationColor)),g.anisotropy>0&&(p.anisotropyVector.value.set(g.anisotropy*Math.cos(g.anisotropyRotation),g.anisotropy*Math.sin(g.anisotropyRotation)),g.anisotropyMap&&(p.anisotropyMap.value=g.anisotropyMap,t(g.anisotropyMap,p.anisotropyMapTransform))),p.specularIntensity.value=g.specularIntensity,p.specularColor.value.copy(g.specularColor),g.specularColorMap&&(p.specularColorMap.value=g.specularColorMap,t(g.specularColorMap,p.specularColorMapTransform)),g.specularIntensityMap&&(p.specularIntensityMap.value=g.specularIntensityMap,t(g.specularIntensityMap,p.specularIntensityMapTransform))}function m(p,g){g.matcap&&(p.matcap.value=g.matcap)}function v(p,g){const y=e.get(g).light;p.referencePosition.value.setFromMatrixPosition(y.matrixWorld),p.nearDistance.value=y.shadow.camera.near,p.farDistance.value=y.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:n}}function mM(s,e,t,i){let n={},r={},a=[];const o=s.getParameter(s.MAX_UNIFORM_BUFFER_BINDINGS);function l(M,b){const S=b.program;i.uniformBlockBinding(M,S)}function c(M,b){let S=n[M.id];S===void 0&&(p(M),S=h(M),n[M.id]=S,M.addEventListener("dispose",y));const w=b.program;i.updateUBOMapping(M,w);const x=e.render.frame;r[M.id]!==x&&(u(M),r[M.id]=x)}function h(M){const b=f();M.__bindingPointIndex=b;const S=s.createBuffer(),w=M.__size,x=M.usage;return s.bindBuffer(s.UNIFORM_BUFFER,S),s.bufferData(s.UNIFORM_BUFFER,w,x),s.bindBuffer(s.UNIFORM_BUFFER,null),s.bindBufferBase(s.UNIFORM_BUFFER,b,S),S}function f(){for(let M=0;M<o;M++)if(a.indexOf(M)===-1)return a.push(M),M;return vt("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function u(M){const b=n[M.id],S=M.uniforms,w=M.__cache;s.bindBuffer(s.UNIFORM_BUFFER,b);for(let x=0,A=S.length;x<A;x++){const C=S[x];if(Array.isArray(C))for(let R=0,D=C.length;R<D;R++)d(C[R],x,R,w);else d(C,x,0,w)}s.bindBuffer(s.UNIFORM_BUFFER,null)}function d(M,b,S,w){if(v(M,b,S,w)===!0){const x=M.__offset,A=M.value;if(Array.isArray(A)){let C=0;for(let R=0;R<A.length;R++){const D=A[R],B=g(D);m(D,M.__data,C),typeof D!="number"&&typeof D!="boolean"&&!D.isMatrix3&&!ArrayBuffer.isView(D)&&(C+=B.storage/Float32Array.BYTES_PER_ELEMENT)}}else m(A,M.__data,0);s.bufferSubData(s.UNIFORM_BUFFER,x,M.__data)}}function m(M,b,S){typeof M=="number"||typeof M=="boolean"?b[0]=M:M.isMatrix3?(b[0]=M.elements[0],b[1]=M.elements[1],b[2]=M.elements[2],b[3]=0,b[4]=M.elements[3],b[5]=M.elements[4],b[6]=M.elements[5],b[7]=0,b[8]=M.elements[6],b[9]=M.elements[7],b[10]=M.elements[8],b[11]=0):ArrayBuffer.isView(M)?b.set(new M.constructor(M.buffer,M.byteOffset,b.length)):M.toArray(b,S)}function v(M,b,S,w){const x=M.value,A=b+"_"+S;if(w[A]===void 0)return typeof x=="number"||typeof x=="boolean"?w[A]=x:ArrayBuffer.isView(x)?w[A]=x.slice():w[A]=x.clone(),!0;{const C=w[A];if(typeof x=="number"||typeof x=="boolean"){if(C!==x)return w[A]=x,!0}else{if(ArrayBuffer.isView(x))return!0;if(C.equals(x)===!1)return C.copy(x),!0}}return!1}function p(M){const b=M.uniforms;let S=0;const w=16;for(let A=0,C=b.length;A<C;A++){const R=Array.isArray(b[A])?b[A]:[b[A]];for(let D=0,B=R.length;D<B;D++){const k=R[D],N=Array.isArray(k.value)?k.value:[k.value];for(let G=0,H=N.length;G<H;G++){const se=N[G],V=g(se),j=S%w,J=j%V.boundary,we=j+J;S+=J,we!==0&&w-we<V.storage&&(S+=w-we),k.__data=new Float32Array(V.storage/Float32Array.BYTES_PER_ELEMENT),k.__offset=S,S+=V.storage}}}const x=S%w;return x>0&&(S+=w-x),M.__size=S,M.__cache={},this}function g(M){const b={boundary:0,storage:0};return typeof M=="number"||typeof M=="boolean"?(b.boundary=4,b.storage=4):M.isVector2?(b.boundary=8,b.storage=8):M.isVector3||M.isColor?(b.boundary=16,b.storage=12):M.isVector4?(b.boundary=16,b.storage=16):M.isMatrix3?(b.boundary=48,b.storage=48):M.isMatrix4?(b.boundary=64,b.storage=64):M.isTexture?je("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(M)?(b.boundary=16,b.storage=M.byteLength):je("WebGLRenderer: Unsupported uniform value type.",M),b}function y(M){const b=M.target;b.removeEventListener("dispose",y);const S=a.indexOf(b.__bindingPointIndex);a.splice(S,1),s.deleteBuffer(n[b.id]),delete n[b.id],delete r[b.id]}function E(){for(const M in n)s.deleteBuffer(n[M]);a=[],n={},r={}}return{bind:l,update:c,dispose:E}}const gM=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let Yi=null;function vM(){return Yi===null&&(Yi=new ea(gM,16,16,ms,li),Yi.name="DFG_LUT",Yi.minFilter=di,Yi.magFilter=di,Yi.wrapS=bn,Yi.wrapT=bn,Yi.generateMipmaps=!1,Yi.needsUpdate=!0),Yi}class ap{constructor(e={}){const{canvas:t=Z0(),context:i=null,depth:n=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:f=!1,reversedDepthBuffer:u=!1,outputBufferType:d=wi}=e;this.isWebGLRenderer=!0;let m;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");m=i.getContextAttributes().alpha}else m=a;const v=d,p=new Set([xh,vh,gh]),g=new Set([wi,cn,Xr,ir,fh,ph]),y=new Uint32Array(4),E=new Int32Array(4),M=new L;let b=null,S=null;const w=[],x=[];let A=null;this.domElement=t,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=on,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const C=this;let R=!1,D=null,B=null,k=null,N=null;this._outputColorSpace=Kt;let G=0,H=0,se=null,V=-1,j=null;const J=new Ct,we=new Ct;let ce=null;const ct=new Te(0);let tt=0,Je=t.width,q=t.height,te=1,ee=null,be=null;const Me=new Ct(0,0,Je,q),Ie=new Ct(0,0,Je,q);let nt=!1;const ie=new Th;let re=!1,he=!1;const ue=new rt,xe=new L,Ye=new Ct,We={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Ve=!1;function Qe(){return se===null?te:1}let U=i;function pt(T,F){return t.getContext(T,F)}let st,P,_,O,z,Y,de,ye,Z,ne,Se,Fe,_e,ve,De,ae,pe,I,fe,$,ge,Ce,oe;try{const T={alpha:!0,depth:n,stencil:r,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:f};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${sh}`),t.addEventListener("webglcontextlost",wt,!1),t.addEventListener("webglcontextrestored",Mt,!1),t.addEventListener("webglcontextcreationerror",Ti,!1),U===null){const F="webgl2";if(U=pt(F,T),U===null)throw pt(F)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}Xe()}catch(T){throw t.removeEventListener("webglcontextlost",wt,!1),t.removeEventListener("webglcontextrestored",Mt,!1),t.removeEventListener("webglcontextcreationerror",Ti,!1),vt("WebGLRenderer: "+T.message),T}function Xe(){st=new vx(U),st.init(),ge=new lM(U,st),P=new ox(U,st,e,ge),_=new aM(U,st),P.reversedDepthBuffer&&u&&_.buffers.depth.setReversed(!0),B=U.createFramebuffer(),k=U.createFramebuffer(),N=U.createFramebuffer(),O=new Mx(U),z=new qy,Y=new oM(U,st,_,z,P,ge,O),de=new gx(C),ye=new Sg(U),Ce=new rx(U,ye),Z=new xx(U,ye,O,Ce),ne=new Sx(U,Z,ye,Ce,O),I=new _x(U,P,Y),De=new lx(z),Se=new Xy(C,de,st,P,Ce,De),Fe=new pM(C,z),_e=new Yy,ve=new eM(st),pe=new sx(C,de,_,ne,m,l),ae=new rM(C,ne,P),oe=new mM(U,O,P,_),fe=new ax(U,st,O),$=new yx(U,st,O),O.programs=Se.programs,C.capabilities=P,C.extensions=st,C.properties=z,C.renderLists=_e,C.shadowMap=ae,C.state=_,C.info=O}v!==wi&&(A=new Ax(v,t.width,t.height,o,n,r));const Be=new dM(C,U);this.xr=Be,this.getContext=function(){return U},this.getContextAttributes=function(){return U.getContextAttributes()},this.forceContextLoss=function(){const T=st.get("WEBGL_lose_context");T&&T.loseContext()},this.forceContextRestore=function(){const T=st.get("WEBGL_lose_context");T&&T.restoreContext()},this.getPixelRatio=function(){return te},this.setPixelRatio=function(T){T!==void 0&&(te=T,this.setSize(Je,q,!1))},this.getSize=function(T){return T.set(Je,q)},this.setSize=function(T,F,K=!0){if(Be.isPresenting){je("WebGLRenderer: Can't change size while VR device is presenting.");return}Je=T,q=F,t.width=Math.floor(T*te),t.height=Math.floor(F*te),K===!0&&(t.style.width=T+"px",t.style.height=F+"px"),A!==null&&A.setSize(t.width,t.height),this.setViewport(0,0,T,F)},this.getDrawingBufferSize=function(T){return T.set(Je*te,q*te).floor()},this.setDrawingBufferSize=function(T,F,K){Je=T,q=F,te=K,t.width=Math.floor(T*K),t.height=Math.floor(F*K),this.setViewport(0,0,T,F)},this.setEffects=function(T){if(v===wi){vt("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(T){for(let F=0;F<T.length;F++)if(T[F].isOutputPass===!0){je("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}A.setEffects(T||[])},this.getCurrentViewport=function(T){return T.copy(J)},this.getViewport=function(T){return T.copy(Me)},this.setViewport=function(T,F,K,W){T.isVector4?Me.set(T.x,T.y,T.z,T.w):Me.set(T,F,K,W),_.viewport(J.copy(Me).multiplyScalar(te).round())},this.getScissor=function(T){return T.copy(Ie)},this.setScissor=function(T,F,K,W){T.isVector4?Ie.set(T.x,T.y,T.z,T.w):Ie.set(T,F,K,W),_.scissor(we.copy(Ie).multiplyScalar(te).round())},this.getScissorTest=function(){return nt},this.setScissorTest=function(T){_.setScissorTest(nt=T)},this.setOpaqueSort=function(T){ee=T},this.setTransparentSort=function(T){be=T},this.getClearColor=function(T){return T.copy(pe.getClearColor())},this.setClearColor=function(){pe.setClearColor(...arguments)},this.getClearAlpha=function(){return pe.getClearAlpha()},this.setClearAlpha=function(){pe.setClearAlpha(...arguments)},this.clear=function(T=!0,F=!0,K=!0){let W=0;if(T){let X=!1;if(se!==null){const Re=se.texture.format;X=p.has(Re)}if(X){const Re=se.texture.type,Ne=g.has(Re),Pe=pe.getClearColor(),ze=pe.getClearAlpha(),qe=Pe.r,ht=Pe.g,mt=Pe.b;Ne?(y[0]=qe,y[1]=ht,y[2]=mt,y[3]=ze,U.clearBufferuiv(U.COLOR,0,y)):(E[0]=qe,E[1]=ht,E[2]=mt,E[3]=ze,U.clearBufferiv(U.COLOR,0,E))}else W|=U.COLOR_BUFFER_BIT}F&&(W|=U.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),K&&(W|=U.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),W!==0&&U.clear(W)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(T){T.setRenderer(this),D=T},this.dispose=function(){t.removeEventListener("webglcontextlost",wt,!1),t.removeEventListener("webglcontextrestored",Mt,!1),t.removeEventListener("webglcontextcreationerror",Ti,!1),pe.dispose(),_e.dispose(),ve.dispose(),z.dispose(),de.dispose(),ne.dispose(),Ce.dispose(),oe.dispose(),Se.dispose(),Be.dispose(),Be.removeEventListener("sessionstart",Jh),Be.removeEventListener("sessionend",jh),es.stop()};function wt(T){T.preventDefault(),ho("WebGLRenderer: Context Lost."),R=!0}function Mt(){ho("WebGLRenderer: Context Restored."),R=!1;const T=O.autoReset,F=ae.enabled,K=ae.autoUpdate,W=ae.needsUpdate,X=ae.type;Xe(),O.autoReset=T,ae.enabled=F,ae.autoUpdate=K,ae.needsUpdate=W,ae.type=X}function Ti(T){vt("WebGLRenderer: A WebGL context could not be created. Reason: ",T.statusMessage)}function Xi(T){const F=T.target;F.removeEventListener("dispose",Xi),Wp(F)}function Wp(T){Xp(T),z.remove(T)}function Xp(T){const F=z.get(T).programs;F!==void 0&&(F.forEach(function(K){Se.releaseProgram(K)}),T.isShaderMaterial&&Se.releaseShaderCache(T))}this.renderBufferDirect=function(T,F,K,W,X,Re){F===null&&(F=We);const Ne=X.isMesh&&X.matrixWorld.determinantAffine()<0,Pe=Yp(T,F,K,W,X);_.setMaterial(W,Ne);let ze=K.index,qe=1;if(W.wireframe===!0){if(ze=Z.getWireframeAttribute(K),ze===void 0)return;qe=2}const ht=K.drawRange,mt=K.attributes.position;let He=ht.start*qe,St=(ht.start+ht.count)*qe;Re!==null&&(He=Math.max(He,Re.start*qe),St=Math.min(St,(Re.start+Re.count)*qe)),ze!==null?(He=Math.max(He,0),St=Math.min(St,ze.count)):mt!=null&&(He=Math.max(He,0),St=Math.min(St,mt.count));const Wt=St-He;if(Wt<0||Wt===1/0)return;Ce.setup(X,W,Pe,K,ze);let Dt,Pt=fe;if(ze!==null&&(Dt=ye.get(ze),Pt=$,Pt.setIndex(Dt)),X.isMesh)W.wireframe===!0?(_.setLineWidth(W.wireframeLinewidth*Qe()),Pt.setMode(U.LINES)):Pt.setMode(U.TRIANGLES);else if(X.isLine){let ci=W.linewidth;ci===void 0&&(ci=1),_.setLineWidth(ci*Qe()),X.isLineSegments?Pt.setMode(U.LINES):X.isLineLoop?Pt.setMode(U.LINE_LOOP):Pt.setMode(U.LINE_STRIP)}else X.isPoints?Pt.setMode(U.POINTS):X.isSprite&&Pt.setMode(U.TRIANGLES);if(X.isBatchedMesh)if(st.get("WEBGL_multi_draw"))Pt.renderMultiDraw(X._multiDrawStarts,X._multiDrawCounts,X._multiDrawCount);else{const ci=X._multiDrawStarts,ke=X._multiDrawCounts,pi=X._multiDrawCount,yt=ze?ye.get(ze).bytesPerElement:1,Ii=z.get(W).currentProgram.getUniforms();for(let qi=0;qi<pi;qi++)Ii.setValue(U,"_gl_DrawID",qi),Pt.render(ci[qi]/yt,ke[qi])}else if(X.isInstancedMesh)Pt.renderInstances(He,Wt,X.count);else if(K.isInstancedBufferGeometry){const ci=K._maxInstanceCount!==void 0?K._maxInstanceCount:1/0,ke=Math.min(K.instanceCount,ci);Pt.renderInstances(He,Wt,ke)}else Pt.render(He,Wt)};function Zh(T,F,K,W){D!==null&&T.isNodeMaterial&&D.setObject(W,T),re===!0&&De.setState(T,K,!1),T.transparent===!0&&T.side===oi&&T.forceSinglePass===!1?(T.side=Zt,T.needsUpdate=!0,aa(T,F,W),T.side=fs,T.needsUpdate=!0,aa(T,F,W),T.side=oi):aa(T,F,W)}this.compile=function(T,F,K=null){K===null&&(K=T),D!==null&&D.renderStart(T,F,K),S=ve.get(K),S.init(F),x.push(S),K.traverseVisible(function(X){X.isLight&&X.layers.test(F.layers)&&(S.pushLight(X),X.castShadow&&S.pushShadow(X))}),T!==K&&T.traverseVisible(function(X){X.isLight&&X.layers.test(F.layers)&&(S.pushLight(X),X.castShadow&&S.pushShadow(X))}),S.setupLights(),D!==null&&D.updateLights(S.state.lightsArray),he=this.localClippingEnabled,re=De.init(this.clippingPlanes,he),re===!0&&De.setGlobalState(this.clippingPlanes,F),D!==null&&ae.render(S.state.shadowsArray,K,F);const W=new Set;return T.traverse(function(X){if(!(X.isMesh||X.isPoints||X.isLine||X.isSprite))return;const Re=X.material;if(Re)if(Array.isArray(Re))for(let Ne=0;Ne<Re.length;Ne++){const Pe=Re[Ne];Zh(Pe,K,F,X),W.add(Pe)}else Zh(Re,K,F,X),W.add(Re)}),S=x.pop(),D!==null&&D.renderEnd(),W},this.compileAsync=function(T,F,K=null){const W=this.compile(T,F,K);return new Promise(X=>{function Re(){if(W.forEach(function(Ne){const ze=z.get(Ne).currentProgram;(ze===void 0||ze.isReady())&&W.delete(Ne)}),W.size===0){X(T);return}setTimeout(Re,10)}st.get("KHR_parallel_shader_compile")!==null?Re():setTimeout(Re,10)})};let Lo=null;function qp(T){Lo&&Lo(T)}function Jh(){es.stop()}function jh(){es.start()}const es=new Jf;es.setAnimationLoop(qp),typeof self<"u"&&es.setContext(self),this.setAnimationLoop=function(T){Lo=T,Be.setAnimationLoop(T),T===null?es.stop():es.start()},Be.addEventListener("sessionstart",Jh),Be.addEventListener("sessionend",jh),this.render=function(T,F){if(F!==void 0&&F.isCamera!==!0){vt("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(R===!0)return;D!==null&&D.renderStart(T,F);const K=Be.enabled===!0&&Be.isPresenting===!0,W=A!==null&&(se===null||K)&&A.begin(C,se);if(T.matrixWorldAutoUpdate===!0&&T.updateMatrixWorld(),F.parent===null&&F.matrixWorldAutoUpdate===!0&&F.updateMatrixWorld(),Be.enabled===!0&&Be.isPresenting===!0&&(A===null||A.isCompositing()===!1)&&(Be.cameraAutoUpdate===!0&&Be.updateCamera(F),F=Be.getCamera()),T.isScene===!0&&T.onBeforeRender(C,T,F,se),S=ve.get(T,x.length),S.init(F),S.state.textureUnits=Y.getTextureUnits(),x.push(S),ue.multiplyMatrices(F.projectionMatrix,F.matrixWorldInverse),ie.setFromProjectionMatrix(ue,an,F.reversedDepth),he=this.localClippingEnabled,re=De.init(this.clippingPlanes,he),b=_e.get(T,w.length),b.init(),w.push(b),Be.enabled===!0&&Be.isPresenting===!0){const Ne=C.xr.getDepthSensingMesh();Ne!==null&&Io(Ne,F,-1/0,C.sortObjects)}Io(T,F,0,C.sortObjects),b.finish(),D!==null&&D.updateLights(S.state.lightsArray),C.sortObjects===!0&&b.sort(ee,be),Ve=Be.enabled===!1||Be.isPresenting===!1||Be.hasDepthSensing()===!1,Ve&&pe.addToRenderList(b,T),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),re===!0&&De.beginShadows();const X=S.state.shadowsArray;if(ae.render(X,T,F),re===!0&&De.endShadows(),(W&&A.hasRenderPass())===!1){const Ne=b.opaque,Pe=b.transmissive;if(S.setupLights(),F.isArrayCamera){const ze=F.cameras;if(Pe.length>0)for(let qe=0,ht=ze.length;qe<ht;qe++){const mt=ze[qe];tu(Ne,Pe,T,mt)}Ve&&pe.render(T);for(let qe=0,ht=ze.length;qe<ht;qe++){const mt=ze[qe];eu(b,T,mt,mt.viewport)}}else Pe.length>0&&tu(Ne,Pe,T,F),Ve&&pe.render(T),eu(b,T,F)}se!==null&&H===0&&(Y.updateMultisampleRenderTarget(se),Y.updateRenderTargetMipmap(se)),W&&A.end(C),T.isScene===!0&&T.onAfterRender(C,T,F),Ce.resetDefaultState(),V=-1,j=null,x.pop(),x.length>0?(S=x[x.length-1],Y.setTextureUnits(S.state.textureUnits),re===!0&&De.setGlobalState(C.clippingPlanes,S.state.camera)):S=null,w.pop(),w.length>0?b=w[w.length-1]:b=null,D!==null&&D.renderEnd()};function Io(T,F,K,W){if(T.visible===!1)return;if(T.layers.test(F.layers)){if(T.isGroup)K=T.renderOrder;else if(T.isLOD)T.autoUpdate===!0&&T.update(F);else if(T.isLightProbeGrid)S.pushLightProbeGrid(T);else if(T.isLight)S.pushLight(T),T.castShadow&&S.pushShadow(T);else if(T.isSprite){if(!T.frustumCulled||T.intersectsFrustum(ie)){W&&Ye.setFromMatrixPosition(T.matrixWorld).applyMatrix4(ue);const Ne=ne.update(T),Pe=T.material;Pe.visible&&b.push(T,Ne,Pe,K,Ye.z,null,F)}}else if((T.isMesh||T.isLine||T.isPoints)&&(!T.frustumCulled||T.intersectsFrustum(ie))){const Ne=ne.update(T),Pe=T.material;if(W&&(T.boundingSphere!==void 0?(T.boundingSphere===null&&T.computeBoundingSphere(),Ye.copy(T.boundingSphere.center)):(Ne.boundingSphere===null&&Ne.computeBoundingSphere(),Ye.copy(Ne.boundingSphere.center)),Ye.applyMatrix4(T.matrixWorld).applyMatrix4(ue)),Array.isArray(Pe)){const ze=Ne.groups;for(let qe=0,ht=ze.length;qe<ht;qe++){const mt=ze[qe],He=Pe[mt.materialIndex];He&&He.visible&&b.push(T,Ne,He,K,Ye.z,mt,F)}}else Pe.visible&&b.push(T,Ne,Pe,K,Ye.z,null,F)}}const Re=T.children;for(let Ne=0,Pe=Re.length;Ne<Pe;Ne++)Io(Re[Ne],F,K,W)}function eu(T,F,K,W){const{opaque:X,transmissive:Re,transparent:Ne}=T;S.setupLightsView(K),re===!0&&De.setGlobalState(C.clippingPlanes,K),W&&_.viewport(J.copy(W)),X.length>0&&ra(X,F,K),Re.length>0&&ra(Re,F,K),Ne.length>0&&ra(Ne,F,K),_.buffers.depth.setTest(!0),_.buffers.depth.setMask(!0),_.buffers.color.setMask(!0),_.setPolygonOffset(!1)}function tu(T,F,K,W){if((K.isScene===!0?K.overrideMaterial:null)!==null)return;if(S.state.transmissionRenderTarget[W.id]===void 0){const He=st.has("EXT_color_buffer_half_float")||st.has("EXT_color_buffer_float");S.state.transmissionRenderTarget[W.id]=new ai(1,1,{generateMipmaps:!0,type:He?li:wi,minFilter:us,samples:Math.max(4,P.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:gt.workingColorSpace})}const Re=S.state.transmissionRenderTarget[W.id],Ne=W.viewport||J;Re.setSize(Ne.z*C.transmissionResolutionScale,Ne.w*C.transmissionResolutionScale);const Pe=C.getRenderTarget(),ze=C.getActiveCubeFace(),qe=C.getActiveMipmapLevel();C.setRenderTarget(Re),C.getClearColor(ct),tt=C.getClearAlpha(),tt<1&&C.setClearColor(16777215,.5),C.clear(),Ve&&pe.render(K);const ht=C.toneMapping;C.toneMapping=on;const mt=W.viewport;if(W.viewport!==void 0&&(W.viewport=void 0),S.setupLightsView(W),re===!0&&De.setGlobalState(C.clippingPlanes,W),ra(T,K,W),Y.updateMultisampleRenderTarget(Re),Y.updateRenderTargetMipmap(Re),st.has("WEBGL_multisampled_render_to_texture")===!1){let He=!1;for(let St=0,Wt=F.length;St<Wt;St++){const Dt=F[St],{object:Pt,geometry:ci,material:ke,group:pi}=Dt;if(ke.side===oi&&Pt.layers.test(W.layers)){const yt=ke.side;ke.side=Zt,ke.needsUpdate=!0,iu(Pt,K,W,ci,ke,pi),ke.side=yt,ke.needsUpdate=!0,He=!0}}He===!0&&(Y.updateMultisampleRenderTarget(Re),Y.updateRenderTargetMipmap(Re))}C.setRenderTarget(Pe,ze,qe),C.setClearColor(ct,tt),mt!==void 0&&(W.viewport=mt),C.toneMapping=ht}function ra(T,F,K){const W=F.isScene===!0?F.overrideMaterial:null;for(let X=0,Re=T.length;X<Re;X++){const Ne=T[X],{object:Pe,geometry:ze,group:qe}=Ne;let ht=Ne.material;ht.allowOverride===!0&&W!==null&&(ht=W),Pe.layers.test(K.layers)&&iu(Pe,F,K,ze,ht,qe)}}function iu(T,F,K,W,X,Re){D!==null&&X.isNodeMaterial&&D.setObject(T,X),T.onBeforeRender(C,F,K,W,X,Re),T.modelViewMatrix.multiplyMatrices(K.matrixWorldInverse,T.matrixWorld),T.normalMatrix.getNormalMatrix(T.modelViewMatrix),X.onBeforeRender(C,F,K,W,T,Re),X.transparent===!0&&X.side===oi&&X.forceSinglePass===!1?(X.side=Zt,X.needsUpdate=!0,C.renderBufferDirect(K,F,W,X,T,Re),X.side=fs,X.needsUpdate=!0,C.renderBufferDirect(K,F,W,X,T,Re),X.side=oi):C.renderBufferDirect(K,F,W,X,T,Re),T.onAfterRender(C,F,K,W,X,Re)}function aa(T,F,K){F.isScene!==!0&&(F=We);const W=z.get(T),X=S.state.lights,Re=S.state.shadowsArray,Ne=X.state.version,Pe=Se.getParameters(T,X.state,Re,F,K,S.state.lightProbeGridArray),ze=Se.getProgramCacheKey(Pe);let qe=W.programs;W.environment=T.isMeshStandardMaterial||T.isMeshLambertMaterial||T.isMeshPhongMaterial?F.environment:null,W.fog=F.fog;const ht=T.isMeshStandardMaterial||T.isMeshLambertMaterial&&!T.envMap||T.isMeshPhongMaterial&&!T.envMap;W.envMap=de.get(T.envMap||W.environment,ht),W.envMapRotation=W.environment!==null&&T.envMap===null?F.environmentRotation:T.envMapRotation,qe===void 0&&(T.addEventListener("dispose",Xi),qe=new Map,W.programs=qe);let mt=qe.get(ze);if(mt!==void 0){if(W.currentProgram===mt&&W.lightsStateVersion===Ne)return su(T,Pe),mt}else Pe.uniforms=Se.getUniforms(T),D!==null&&T.isNodeMaterial&&D.build(T,K,Pe),T.onBeforeCompile(Pe,C),mt=Se.acquireProgram(Pe,ze),qe.set(ze,mt),W.uniforms=Pe.uniforms;const He=W.uniforms;return(!T.isShaderMaterial&&!T.isRawShaderMaterial||T.clipping===!0)&&(He.clippingPlanes=De.uniform),su(T,Pe),W.needsLights=Qp(T),W.lightsStateVersion=Ne,W.needsLights&&(He.ambientLightColor.value=X.state.ambient,He.lightProbe.value=X.state.probe,He.sunLights.value=X.state.sun,He.sunLightShadows.value=X.state.sunShadow,He.directionalLights.value=X.state.directional,He.directionalLightShadows.value=X.state.directionalShadow,He.spotLights.value=X.state.spot,He.spotLightShadows.value=X.state.spotShadow,He.rectAreaLights.value=X.state.rectArea,He.ltc_1.value=X.state.rectAreaLTC1,He.ltc_2.value=X.state.rectAreaLTC2,He.pointLights.value=X.state.point,He.pointLightShadows.value=X.state.pointShadow,He.hemisphereLights.value=X.state.hemi,He.sunShadowMatrix.value=X.state.sunShadowMatrix,He.sunShadowCascade.value=X.state.sunShadowCascade,He.directionalShadowMatrix.value=X.state.directionalShadowMatrix,He.spotLightMatrix.value=X.state.spotLightMatrix,He.spotLightMap.value=X.state.spotLightMap,He.pointShadowMatrix.value=X.state.pointShadowMatrix),W.lightProbeGrid=S.state.lightProbeGridArray.length>0,W.currentProgram=mt,W.uniformsList=null,mt}function nu(T){if(T.uniformsList===null){const F=T.currentProgram.getUniforms();T.uniformsList=to.seqWithValue(F.seq,T.uniforms)}return T.uniformsList}function su(T,F){const K=z.get(T);K.outputColorSpace=F.outputColorSpace,K.batching=F.batching,K.batchingColor=F.batchingColor,K.instancing=F.instancing,K.instancingColor=F.instancingColor,K.instancingMorph=F.instancingMorph,K.skinning=F.skinning,K.morphTargets=F.morphTargets,K.morphNormals=F.morphNormals,K.morphColors=F.morphColors,K.morphTargetsCount=F.morphTargetsCount,K.numClippingPlanes=F.numClippingPlanes,K.numIntersection=F.numClipIntersection,K.vertexAlphas=F.vertexAlphas,K.vertexTangents=F.vertexTangents,K.toneMapping=F.toneMapping}function Kp(T,F){if(T.length===0)return null;if(T.length===1)return T[0].texture!==null?T[0]:null;M.setFromMatrixPosition(F.matrixWorld);for(let K=0,W=T.length;K<W;K++){const X=T[K];if(X.texture!==null&&X.boundingBox.containsPoint(M))return X}return null}function Yp(T,F,K,W,X){F.isScene!==!0&&(F=We),Y.resetTextureUnits();const Re=F.fog,Ne=W.isMeshStandardMaterial||W.isMeshLambertMaterial||W.isMeshPhongMaterial?F.environment:null,Pe=se===null?C.outputColorSpace:se.isXRRenderTarget===!0?se.texture.colorSpace:gt.workingColorSpace,ze=W.isMeshStandardMaterial||W.isMeshLambertMaterial&&!W.envMap||W.isMeshPhongMaterial&&!W.envMap,qe=de.get(W.envMap||Ne,ze),ht=W.vertexColors===!0&&!!K.attributes.color&&K.attributes.color.itemSize===4,mt=!!K.attributes.tangent&&(!!W.normalMap||W.anisotropy>0),He=!!K.morphAttributes.position,St=!!K.morphAttributes.normal,Wt=!!K.morphAttributes.color;let Dt=on;W.toneMapped&&(se===null||se.isXRRenderTarget===!0)&&(Dt=C.toneMapping);const Pt=K.morphAttributes.position||K.morphAttributes.normal||K.morphAttributes.color,ci=Pt!==void 0?Pt.length:0,ke=z.get(W),pi=S.state.lights;if(re===!0&&(he===!0||T!==j)){const Lt=T===j&&W.id===V;De.setState(W,T,Lt)}let yt=!1;W.version===ke.__version?(ke.needsLights&&ke.lightsStateVersion!==pi.state.version||ke.outputColorSpace!==Pe||X.isBatchedMesh&&ke.batching===!1||!X.isBatchedMesh&&ke.batching===!0||X.isBatchedMesh&&ke.batchingColor===!0&&X._colorsTexture===null||X.isBatchedMesh&&ke.batchingColor===!1&&X._colorsTexture!==null||X.isInstancedMesh&&ke.instancing===!1||!X.isInstancedMesh&&ke.instancing===!0||X.isSkinnedMesh&&ke.skinning===!1||!X.isSkinnedMesh&&ke.skinning===!0||X.isInstancedMesh&&ke.instancingColor===!0&&X.instanceColor===null||X.isInstancedMesh&&ke.instancingColor===!1&&X.instanceColor!==null||X.isInstancedMesh&&ke.instancingMorph===!0&&X.morphTexture===null||X.isInstancedMesh&&ke.instancingMorph===!1&&X.morphTexture!==null||ke.envMap!==qe||W.fog===!0&&ke.fog!==Re||ke.numClippingPlanes!==void 0&&(ke.numClippingPlanes!==De.numPlanes||ke.numIntersection!==De.numIntersection)||ke.vertexAlphas!==ht||ke.vertexTangents!==mt||ke.morphTargets!==He||ke.morphNormals!==St||ke.morphColors!==Wt||ke.toneMapping!==Dt||ke.morphTargetsCount!==ci||!!ke.lightProbeGrid!=S.state.lightProbeGridArray.length>0)&&(yt=!0):(yt=!0,ke.__version=W.version);let Ii=ke.currentProgram;yt===!0&&(Ii=aa(W,F,X),D&&W.isNodeMaterial&&D.onUpdateProgram(W,Ii,ke));let qi=!1,kn=!1,Ms=!1;const Et=Ii.getUniforms(),Gt=ke.uniforms;if(_.useProgram(Ii.program)&&(qi=!0,kn=!0,Ms=!0),W.id!==V&&(V=W.id,kn=!0),ke.needsLights){const Lt=Kp(S.state.lightProbeGridArray,X);ke.lightProbeGrid!==Lt&&(ke.lightProbeGrid=Lt,kn=!0)}if(qi||j!==T){_.buffers.depth.getReversed()&&T.reversedDepth!==!0&&(T._reversedDepth=!0,T.updateProjectionMatrix()),Et.setValue(U,"projectionMatrix",T.projectionMatrix),Et.setValue(U,"viewMatrix",T.matrixWorldInverse);const Fn=Et.map.cameraPosition;Fn!==void 0&&Fn.setValue(U,xe.setFromMatrixPosition(T.matrixWorld)),P.logarithmicDepthBuffer&&Et.setValue(U,"logDepthBufFC",2/(Math.log(T.far+1)/Math.LN2)),(W.isMeshPhongMaterial||W.isMeshToonMaterial||W.isMeshLambertMaterial||W.isMeshBasicMaterial||W.isMeshStandardMaterial||W.isShaderMaterial)&&Et.setValue(U,"isOrthographic",T.isOrthographicCamera===!0),j!==T&&(j=T,kn=!0,Ms=!0)}if(ke.needsLights&&(pi.state.sunShadowMap.length>0&&Et.setValue(U,"sunShadowMap",pi.state.sunShadowMap,Y),pi.state.directionalShadowMap.length>0&&Et.setValue(U,"directionalShadowMap",pi.state.directionalShadowMap,Y),pi.state.spotShadowMap.length>0&&Et.setValue(U,"spotShadowMap",pi.state.spotShadowMap,Y),pi.state.pointShadowMap.length>0&&Et.setValue(U,"pointShadowMap",pi.state.pointShadowMap,Y)),X.isSkinnedMesh){Et.setOptional(U,X,"bindMatrix"),Et.setOptional(U,X,"bindMatrixInverse");const Lt=X.skeleton;Lt&&(Lt.boneTexture===null&&Lt.computeBoneTexture(),Et.setValue(U,"boneTexture",Lt.boneTexture,Y))}X.isBatchedMesh&&(Et.setOptional(U,X,"batchingTexture"),Et.setValue(U,"batchingTexture",X._matricesTexture,Y),Et.setOptional(U,X,"batchingIdTexture"),Et.setValue(U,"batchingIdTexture",X._indirectTexture,Y),Et.setOptional(U,X,"batchingColorTexture"),X._colorsTexture!==null&&Et.setValue(U,"batchingColorTexture",X._colorsTexture,Y));const Un=K.morphAttributes;if((Un.position!==void 0||Un.normal!==void 0||Un.color!==void 0)&&I.update(X,K,Ii),(kn||ke.receiveShadow!==X.receiveShadow)&&(ke.receiveShadow=X.receiveShadow,Et.setValue(U,"receiveShadow",X.receiveShadow)),(W.isMeshStandardMaterial||W.isMeshLambertMaterial||W.isMeshPhongMaterial)&&W.envMap===null&&F.environment!==null&&(Gt.envMapIntensity.value=F.environmentIntensity),Gt.dfgLUT!==void 0&&(Gt.dfgLUT.value=vM()),kn){if(Et.setValue(U,"toneMappingExposure",C.toneMappingExposure),ke.needsLights&&$p(Gt,Ms),Re&&W.fog===!0&&Fe.refreshFogUniforms(Gt,Re),Fe.refreshMaterialUniforms(Gt,W,te,q,S.state.transmissionRenderTarget[T.id]),ke.needsLights&&ke.lightProbeGrid){const Lt=ke.lightProbeGrid;Gt.probesSH.value=Lt.texture,Gt.probesMin.value.copy(Lt.boundingBox.min),Gt.probesMax.value.copy(Lt.boundingBox.max),Gt.probesResolution.value.copy(Lt.resolution)}to.upload(U,nu(ke),Gt,Y)}if(W.isShaderMaterial&&W.uniformsNeedUpdate===!0&&(to.upload(U,nu(ke),Gt,Y),W.uniformsNeedUpdate=!1),W.isSpriteMaterial&&Et.setValue(U,"center",X.center),Et.setValue(U,"modelViewMatrix",X.modelViewMatrix),Et.setValue(U,"normalMatrix",X.normalMatrix),Et.setValue(U,"modelMatrix",X.matrixWorld),W.uniformsGroups!==void 0){const Lt=W.uniformsGroups;for(let Fn=0,_s=Lt.length;Fn<_s;Fn++){const au=Lt[Fn];oe.update(au,Ii),oe.bind(au,Ii)}}return Ii}function $p(T,F){T.ambientLightColor.needsUpdate=F,T.lightProbe.needsUpdate=F,T.sunLights.needsUpdate=F,T.sunLightShadows.needsUpdate=F,T.directionalLights.needsUpdate=F,T.directionalLightShadows.needsUpdate=F,T.pointLights.needsUpdate=F,T.pointLightShadows.needsUpdate=F,T.spotLights.needsUpdate=F,T.spotLightShadows.needsUpdate=F,T.rectAreaLights.needsUpdate=F,T.hemisphereLights.needsUpdate=F}function Qp(T){return T.isMeshLambertMaterial||T.isMeshToonMaterial||T.isMeshPhongMaterial||T.isMeshStandardMaterial||T.isShadowMaterial||T.isShaderMaterial&&T.lights===!0}this.getActiveCubeFace=function(){return G},this.getActiveMipmapLevel=function(){return H},this.getRenderTarget=function(){return se},this.setRenderTargetTextures=function(T,F,K){const W=z.get(T);W.__autoAllocateDepthBuffer=T.resolveDepthBuffer===!1,W.__autoAllocateDepthBuffer===!1&&(W.__useRenderToTexture=!1),z.get(T.texture).__webglTexture=F,z.get(T.depthTexture).__webglTexture=W.__autoAllocateDepthBuffer?void 0:K,W.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(T,F){const K=z.get(T);K.__webglFramebuffer=F,K.__useDefaultFramebuffer=F===void 0},this.setRenderTarget=function(T,F=0,K=0){se=T,G=F,H=K;let W=null,X=!1,Re=!1;if(T){const Pe=z.get(T);if(Pe.__useDefaultFramebuffer!==void 0){_.bindFramebuffer(U.FRAMEBUFFER,Pe.__webglFramebuffer),J.copy(T.viewport),we.copy(T.scissor),ce=T.scissorTest,_.viewport(J),_.scissor(we),_.setScissorTest(ce),V=-1;return}else if(Pe.__webglFramebuffer===void 0)Y.setupRenderTarget(T);else if(Pe.__hasExternalTextures)Y.rebindTextures(T,z.get(T.texture).__webglTexture,z.get(T.depthTexture).__webglTexture);else if(T.depthBuffer){const ht=T.depthTexture;if(Pe.__boundDepthTexture!==ht){if(ht!==null&&z.has(ht)&&(T.width!==ht.image.width||T.height!==ht.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");Y.setupDepthRenderbuffer(T)}}const ze=T.texture;(ze.isData3DTexture||ze.isDataArrayTexture||ze.isCompressedArrayTexture)&&(Re=!0);const qe=z.get(T).__webglFramebuffer;T.isWebGLCubeRenderTarget?(Array.isArray(qe[F])?W=qe[F][K]:W=qe[F],X=!0):T.samples>0&&Y.useMultisampledRTT(T)===!1?W=z.get(T).__webglMultisampledFramebuffer:Array.isArray(qe)?W=qe[K]:W=qe,J.copy(T.viewport),we.copy(T.scissor),ce=T.scissorTest}else J.copy(Me).multiplyScalar(te).floor(),we.copy(Ie).multiplyScalar(te).floor(),ce=nt;if(K!==0&&(W=B),_.bindFramebuffer(U.FRAMEBUFFER,W)&&_.drawBuffers(T,W),_.viewport(J),_.scissor(we),_.setScissorTest(ce),X){const Pe=z.get(T.texture);U.framebufferTexture2D(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_CUBE_MAP_POSITIVE_X+F,Pe.__webglTexture,K)}else if(Re){const Pe=F;for(let ze=0;ze<T.textures.length;ze++){const qe=z.get(T.textures[ze]);U.framebufferTextureLayer(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0+ze,qe.__webglTexture,K,Pe)}}else if(T!==null&&K!==0){const Pe=z.get(T.texture);U.framebufferTexture2D(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_2D,Pe.__webglTexture,K)}V=-1};function ru(T){const F=z.get(T);return(F.__readFormat!==T.format||F.__readType!==T.type)&&(F.__readFormat=T.format,F.__readType=T.type,F.__formatReadable=P.textureFormatReadable(T.format),F.__typeReadable=P.textureTypeReadable(T.type)),F}this.readRenderTargetPixels=function(T,F,K,W,X,Re,Ne,Pe=0){if(!(T&&T.isWebGLRenderTarget)){vt("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let ze=z.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&Ne!==void 0&&(ze=ze[Ne]),ze){_.bindFramebuffer(U.FRAMEBUFFER,ze);try{const qe=T.textures[Pe],ht=qe.format,mt=qe.type;T.textures.length>1&&U.readBuffer(U.COLOR_ATTACHMENT0+Pe);const He=ru(qe);if(He.__formatReadable===!1){vt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(He.__typeReadable===!1){vt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}F>=0&&F<=T.width-W&&K>=0&&K<=T.height-X&&U.readPixels(F,K,W,X,ge.convert(ht),ge.convert(mt),Re)}finally{const qe=se!==null?z.get(se).__webglFramebuffer:null;_.bindFramebuffer(U.FRAMEBUFFER,qe)}}},this.readRenderTargetPixelsAsync=async function(T,F,K,W,X,Re,Ne,Pe=0){if(!(T&&T.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let ze=z.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&Ne!==void 0&&(ze=ze[Ne]),ze)if(F>=0&&F<=T.width-W&&K>=0&&K<=T.height-X){_.bindFramebuffer(U.FRAMEBUFFER,ze);const qe=T.textures[Pe],ht=qe.format,mt=qe.type;T.textures.length>1&&U.readBuffer(U.COLOR_ATTACHMENT0+Pe);const He=ru(qe);if(He.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(He.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const St=U.createBuffer();U.bindBuffer(U.PIXEL_PACK_BUFFER,St),U.bufferData(U.PIXEL_PACK_BUFFER,Re.byteLength,U.STREAM_READ),U.readPixels(F,K,W,X,ge.convert(ht),ge.convert(mt),0),U.bindBuffer(U.PIXEL_PACK_BUFFER,null);const Wt=se!==null?z.get(se).__webglFramebuffer:null;_.bindFramebuffer(U.FRAMEBUFFER,Wt);const Dt=U.fenceSync(U.SYNC_GPU_COMMANDS_COMPLETE,0);return U.flush(),await J0(U,Dt,4),U.bindBuffer(U.PIXEL_PACK_BUFFER,St),U.getBufferSubData(U.PIXEL_PACK_BUFFER,0,Re),U.bindBuffer(U.PIXEL_PACK_BUFFER,null),U.deleteBuffer(St),U.deleteSync(Dt),Re}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(T,F=null,K=0){const W=Math.pow(2,-K),X=Math.floor(T.image.width*W),Re=Math.floor(T.image.height*W),Ne=F!==null?F.x:0,Pe=F!==null?F.y:0;Y.setTexture2D(T,0),U.copyTexSubImage2D(U.TEXTURE_2D,K,0,0,Ne,Pe,X,Re),_.unbindTexture()},this.copyTextureToTexture=function(T,F,K=null,W=null,X=0,Re=0){let Ne,Pe,ze,qe,ht,mt,He,St,Wt;const Dt=T.isCompressedTexture?T.mipmaps[Re]:T.image;if(K!==null)Ne=K.max.x-K.min.x,Pe=K.max.y-K.min.y,ze=K.isBox3?K.max.z-K.min.z:1,qe=K.min.x,ht=K.min.y,mt=K.isBox3?K.min.z:0;else{const Gt=Math.pow(2,-X);Ne=Math.floor(Dt.width*Gt),Pe=Math.floor(Dt.height*Gt),T.isDataArrayTexture?ze=Dt.depth:T.isData3DTexture?ze=Math.floor(Dt.depth*Gt):ze=1,qe=0,ht=0,mt=0}W!==null?(He=W.x,St=W.y,Wt=W.z):(He=0,St=0,Wt=0);const Pt=ge.convert(F.format),ci=ge.convert(F.type);let ke;F.isData3DTexture?(Y.setTexture3D(F,0),ke=U.TEXTURE_3D):F.isDataArrayTexture||F.isCompressedArrayTexture?(Y.setTexture2DArray(F,0),ke=U.TEXTURE_2D_ARRAY):(Y.setTexture2D(F,0),ke=U.TEXTURE_2D),_.activeTexture(U.TEXTURE0),_.pixelStorei(U.UNPACK_FLIP_Y_WEBGL,F.flipY),_.pixelStorei(U.UNPACK_PREMULTIPLY_ALPHA_WEBGL,F.premultiplyAlpha),_.pixelStorei(U.UNPACK_ALIGNMENT,F.unpackAlignment);const pi=_.getParameter(U.UNPACK_ROW_LENGTH),yt=_.getParameter(U.UNPACK_IMAGE_HEIGHT),Ii=_.getParameter(U.UNPACK_SKIP_PIXELS),qi=_.getParameter(U.UNPACK_SKIP_ROWS),kn=_.getParameter(U.UNPACK_SKIP_IMAGES);_.pixelStorei(U.UNPACK_ROW_LENGTH,Dt.width),_.pixelStorei(U.UNPACK_IMAGE_HEIGHT,Dt.height),_.pixelStorei(U.UNPACK_SKIP_PIXELS,qe),_.pixelStorei(U.UNPACK_SKIP_ROWS,ht),_.pixelStorei(U.UNPACK_SKIP_IMAGES,mt);const Ms=T.isDataArrayTexture||T.isData3DTexture,Et=F.isDataArrayTexture||F.isData3DTexture;if(T.isDepthTexture){const Gt=z.get(T),Un=z.get(F),Lt=z.get(Gt.__renderTarget),Fn=z.get(Un.__renderTarget);_.bindFramebuffer(U.READ_FRAMEBUFFER,Lt.__webglFramebuffer),_.bindFramebuffer(U.DRAW_FRAMEBUFFER,Fn.__webglFramebuffer);for(let _s=0;_s<ze;_s++)Ms&&(U.framebufferTextureLayer(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,z.get(T).__webglTexture,X,mt+_s),U.framebufferTextureLayer(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,z.get(F).__webglTexture,Re,Wt+_s)),U.blitFramebuffer(qe,ht,Ne,Pe,He,St,Ne,Pe,U.DEPTH_BUFFER_BIT,U.NEAREST);_.bindFramebuffer(U.READ_FRAMEBUFFER,null),_.bindFramebuffer(U.DRAW_FRAMEBUFFER,null)}else if(X!==0||T.isRenderTargetTexture||z.has(T)){const Gt=z.get(T),Un=z.get(F);_.bindFramebuffer(U.READ_FRAMEBUFFER,k),_.bindFramebuffer(U.DRAW_FRAMEBUFFER,N);for(let Lt=0;Lt<ze;Lt++)Ms?U.framebufferTextureLayer(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,Gt.__webglTexture,X,mt+Lt):U.framebufferTexture2D(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_2D,Gt.__webglTexture,X),Et?U.framebufferTextureLayer(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,Un.__webglTexture,Re,Wt+Lt):U.framebufferTexture2D(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_2D,Un.__webglTexture,Re),X!==0?U.blitFramebuffer(qe,ht,Ne,Pe,He,St,Ne,Pe,U.COLOR_BUFFER_BIT,U.NEAREST):Et?U.copyTexSubImage3D(ke,Re,He,St,Wt+Lt,qe,ht,Ne,Pe):U.copyTexSubImage2D(ke,Re,He,St,qe,ht,Ne,Pe);_.bindFramebuffer(U.READ_FRAMEBUFFER,null),_.bindFramebuffer(U.DRAW_FRAMEBUFFER,null)}else Et?T.isDataTexture||T.isData3DTexture?U.texSubImage3D(ke,Re,He,St,Wt,Ne,Pe,ze,Pt,ci,Dt.data):F.isCompressedArrayTexture?U.compressedTexSubImage3D(ke,Re,He,St,Wt,Ne,Pe,ze,Pt,Dt.data):U.texSubImage3D(ke,Re,He,St,Wt,Ne,Pe,ze,Pt,ci,Dt):T.isDataTexture?U.texSubImage2D(U.TEXTURE_2D,Re,He,St,Ne,Pe,Pt,ci,Dt.data):T.isCompressedTexture?U.compressedTexSubImage2D(U.TEXTURE_2D,Re,He,St,Dt.width,Dt.height,Pt,Dt.data):U.texSubImage2D(U.TEXTURE_2D,Re,He,St,Ne,Pe,Pt,ci,Dt);_.pixelStorei(U.UNPACK_ROW_LENGTH,pi),_.pixelStorei(U.UNPACK_IMAGE_HEIGHT,yt),_.pixelStorei(U.UNPACK_SKIP_PIXELS,Ii),_.pixelStorei(U.UNPACK_SKIP_ROWS,qi),_.pixelStorei(U.UNPACK_SKIP_IMAGES,kn),Re===0&&F.generateMipmaps&&U.generateMipmap(ke),_.unbindTexture()},this.initRenderTarget=function(T){z.get(T).__webglFramebuffer===void 0&&Y.setupRenderTarget(T)},this.initTexture=function(T){T.isCubeTexture?Y.setTextureCube(T,0):T.isData3DTexture?Y.setTexture3D(T,0):T.isDataArrayTexture||T.isCompressedArrayTexture?Y.setTexture2DArray(T,0):Y.setTexture2D(T,0),_.unbindTexture()},this.resetState=function(){G=0,H=0,se=null,_.reset(),Ce.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return an}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=gt._getDrawingBufferColorSpace(e),t.unpackColorSpace=gt._getUnpackColorSpace()}}const Yn={likud:{id:"likud",name:"Likud",nameHe:"הליכוד",color:2056127,accent:10273791},yeshatid:{id:"yeshatid",name:"Yesh Atid",nameHe:"יש עתיד",color:41952,accent:11922687},nationalunity:{id:"nationalunity",name:"National Unity",nameHe:"המחנה הממלכתי",color:2573736,accent:10466559},yashar:{id:"yashar",name:"Yashar!",nameHe:"ישר!",color:3833156,accent:12116160},shas:{id:"shas",name:"Shas",nameHe:'ש"ס',color:732779,accent:15909198},utj:{id:"utj",name:"United Torah Judaism",nameHe:"יהדות התורה",color:2763310,accent:14211288},rzp:{id:"rzp",name:"Religious Zionism",nameHe:"הציונות הדתית",color:13849600,accent:16761738},otzma:{id:"otzma",name:"Otzma Yehudit",nameHe:"עוצמה יהודית",color:14721280,accent:16773288},noam:{id:"noam",name:"Noam",nameHe:"נעם",color:8207512,accent:14465258},yb:{id:"yb",name:"Yisrael Beiteinu",nameHe:"ישראל ביתנו",color:2651302,accent:11129840},raam:{id:"raam",name:"Ra'am",nameHe:'רע"ם',color:2006618,accent:10939588},hadash:{id:"hadash",name:"Hadash–Ta'al",nameHe:'חד"ש-תע"ל',color:12597547,accent:16757674},democrats:{id:"democrats",name:"The Democrats",nameHe:"הדמוקרטים",color:14035001,accent:16757693}},Er=new L;function ki(s,e,t,i,n,r){const a=2*Math.PI*n/4,o=Math.max(r-2*n,0),l=Math.PI/4;Er.copy(e),Er[i]=0,Er.normalize();const c=.5*a/(a+o),h=1-Er.angleTo(s)/l;return Math.sign(Er[t])===1?h*c:o/(a+o)+c+c*(1-h)}class wn extends Le{constructor(e=1,t=1,i=1,n=2,r=.1){const a=n*2+1;if(r=Math.min(e/2,t/2,i/2,r),super(1,1,1,a,a,a),this.type="RoundedBoxGeometry",this.parameters={width:e,height:t,depth:i,segments:n,radius:r},a===1)return;const o=this.toNonIndexed();this.index=null,this.attributes.position=o.attributes.position,this.attributes.normal=o.attributes.normal,this.attributes.uv=o.attributes.uv;const l=new L,c=new L,h=new L(e,t,i).divideScalar(2).subScalar(r),f=this.attributes.position.array,u=this.attributes.normal.array,d=this.attributes.uv.array,m=f.length/6,v=new L,p=.5/a;for(let g=0,y=0;g<f.length;g+=3,y+=2)switch(l.fromArray(f,g),c.copy(l),c.x-=Math.sign(c.x)*p,c.y-=Math.sign(c.y)*p,c.z-=Math.sign(c.z)*p,c.normalize(),f[g+0]=h.x*Math.sign(l.x)+c.x*r,f[g+1]=h.y*Math.sign(l.y)+c.y*r,f[g+2]=h.z*Math.sign(l.z)+c.z*r,u[g+0]=c.x,u[g+1]=c.y,u[g+2]=c.z,Math.floor(g/m)){case 0:v.set(1,0,0),d[y+0]=ki(v,c,"z","y",r,i),d[y+1]=1-ki(v,c,"y","z",r,t);break;case 1:v.set(-1,0,0),d[y+0]=1-ki(v,c,"z","y",r,i),d[y+1]=1-ki(v,c,"y","z",r,t);break;case 2:v.set(0,1,0),d[y+0]=1-ki(v,c,"x","z",r,e),d[y+1]=ki(v,c,"z","x",r,i);break;case 3:v.set(0,-1,0),d[y+0]=1-ki(v,c,"x","z",r,e),d[y+1]=1-ki(v,c,"z","x",r,i);break;case 4:v.set(0,0,1),d[y+0]=1-ki(v,c,"x","y",r,e),d[y+1]=1-ki(v,c,"y","x",r,t);break;case 5:v.set(0,0,-1),d[y+0]=ki(v,c,"x","y",r,e),d[y+1]=1-ki(v,c,"y","x",r,t);break}}static fromJSON(e){return new wn(e.width,e.height,e.depth,e.segments,e.radius)}}const Fi=(s,e=1)=>{const t=new Te(s);return`rgba(${Math.round(t.r*255)},${Math.round(t.g*255)},${Math.round(t.b*255)},${e})`};function Ln(s,e){const t=document.createElement("canvas");return t.width=s,t.height=e,[t,t.getContext("2d",{willReadFrequently:!0})]}function $n(s,e){const t=new lr(s);return t.colorSpace=e?Kt:Sn,t.wrapS=Wi,t.anisotropy=4,t}function Uh(s){let e=s>>>0||1;return()=>(e=e*1664525+1013904223>>>0,e/4294967296)}function Fh(s,e,t,i,n,r=.05){s.fillStyle=Fi(i),s.fillRect(0,0,e,t);const a=Uh(n),o=s.getImageData(0,0,e,t),l=o.data;for(let c=0;c<t;c++)for(let h=0;h<e;h++){const f=(c*e+h)*4,u=((h+c)%4<2?1:-1)*r*.4,d=(a()-.5)*r+u;l[f]=Math.max(0,Math.min(255,l[f]*(1+d))),l[f+1]=Math.max(0,Math.min(255,l[f+1]*(1+d))),l[f+2]=Math.max(0,Math.min(255,l[f+2]*(1+d)))}s.putImageData(o,0,0)}function wo(s,e){const t=s.width,i=s.height,n=s.getContext("2d",{willReadFrequently:!0}).getImageData(0,0,t,i).data,[r,a]=Ln(t,i),o=a.createImageData(t,i),l=o.data,c=(h,f)=>n[((f+i)%i*t+(h+t)%t)*4]/255;for(let h=0;h<i;h++)for(let f=0;f<t;f++){const u=(c(f+1,h)-c(f-1,h))*e,d=(c(f,h+1)-c(f,h-1))*e;let m=-u,v=d,p=1;const g=Math.hypot(m,v,p);m/=g,v/=g,p/=g;const y=(h*t+f)*4;l[y]=(m*.5+.5)*255,l[y+1]=(v*.5+.5)*255,l[y+2]=(p*.5+.5)*255,l[y+3]=255}return a.putImageData(o,0,0),r}function Nh(s,e,t,i,n=10){const r=Uh(i),a=s.getImageData(0,0,e,t),o=a.data;for(let l=0;l<t;l++)for(let c=0;c<e;c++){const h=(l*e+c)*4,f=o[h]+((c+l)%3===0?n*.5:0)+(r()-.5)*n;o[h]=o[h+1]=o[h+2]=Math.max(0,Math.min(255,f))}s.putImageData(a,0,0)}function xM(s,e){const[n,r]=Ln(512,512),[a,o]=Ln(512,512);o.fillStyle="rgb(128,128,128)",o.fillRect(0,0,512,512);const l=p=>p*512,c=p=>(1-(p-s.y0)/(s.y1-s.y0))*512,h=s.style==="shirt"||s.style==="tshirt"?s.shirt:s.color;if(Fh(r,512,512,h,e,s.style==="tshirt"?.04:.06),s.pinstripe&&s.style!=="shirt"&&s.style!=="tshirt"){r.strokeStyle=Fi(16777215,.09),r.lineWidth=1;for(let p=0;p<512;p+=9)r.beginPath(),r.moveTo(p,0),r.lineTo(p,512),r.stroke()}const f=(p,g,y,E)=>{r.strokeStyle="rgba(0,0,0,0.22)",r.lineWidth=1.5,r.beginPath(),r.moveTo(p,g),r.lineTo(y,E),r.stroke(),o.strokeStyle="rgb(100,100,100)",o.lineWidth=2,o.beginPath(),o.moveTo(p,g),o.lineTo(y,E),o.stroke()};for(const p of[.002,.25,.75,.998])f(l(p),0,l(p),512);const u=l(.5),d=c(s.y1-.005),m=s.style;if(m==="tshirt")r.fillStyle=Fi(new Te(s.shirt).multiplyScalar(.85).getHex()),r.fillRect(0,0,512,512*.035);else if(m==="shirt"){r.fillStyle="rgba(0,0,0,0.08)",r.fillRect(u-7,d,14,512),o.fillStyle="rgb(150,150,150)",o.fillRect(u-7,d,14,512);for(let p=c(s.y1-.08);p<502;p+=512*.11)r.fillStyle="rgba(240,240,240,0.9)",r.beginPath(),r.arc(u,p,3.2,0,Math.PI*2),r.fill()}else{const p=m==="open",g=m==="blazer"?s.y0+(s.y1-s.y0)*.44:s.y0+(s.y1-s.y0)*.5,y=c(g),E=l(p?.085:.075)-l(0),M=p?l(.035)-l(0):l(.012)-l(0);if(r.fillStyle=Fi(s.shirt),r.beginPath(),r.moveTo(u-E,0),r.lineTo(u+E,0),p?(r.lineTo(u+M,y),r.lineTo(u+M*.8,512),r.lineTo(u-M*.8,512),r.lineTo(u-M,y)):r.lineTo(u,y),r.closePath(),r.fill(),!p)r.fillStyle="rgba(10,10,14,0.55)",r.beginPath(),r.moveTo(u,y+6),r.lineTo(u+M*1.6,512),r.lineTo(u-M*1.6,512),r.closePath(),r.fill();else{for(let w=512*.12;w<502;w+=512*.13)r.fillStyle="rgba(235,235,235,0.9)",r.beginPath(),r.arc(u,w,2.6,0,Math.PI*2),r.fill();r.fillStyle="rgba(214,170,140,0.95)",r.beginPath(),r.moveTo(u-E*.45,0),r.lineTo(u+E*.45,0),r.lineTo(u,512*.07),r.closePath(),r.fill()}if(s.tie!==null&&m==="suit"){const x=y+(512-y)*.05,A=512*.018,C=512*.03;r.save(),r.beginPath(),r.moveTo(u-A,10.24),r.lineTo(u+A,10.24),r.lineTo(u+C,x-C),r.lineTo(u,x),r.lineTo(u-C,x-C),r.closePath(),r.clip(),r.fillStyle=Fi(s.tie),r.fillRect(0,0,512,512),r.strokeStyle=Fi(new Te(s.tie).lerp(new Te(16777215),.35).getHex(),.7),r.lineWidth=3;for(let R=-512;R<512;R+=12)r.beginPath(),r.moveTo(u-40,R),r.lineTo(u+40,R+40),r.stroke();r.restore(),o.fillStyle="rgb(150,150,150)",o.fillRect(u-C,10.24,C*2,x-10.24)}const b=512*(s.female?.026:.034),S=Fi(new Te(s.color).multiplyScalar(.72).getHex());for(const w of[-1,1]){const x=u+w*E,A=p?u+w*M:u,C=new Path2D;C.moveTo(x,0),C.lineTo(x+w*b*1.25,512*.07),C.lineTo(x+w*b*.7,512*.09),C.lineTo(A+w*b,y-512*.02),C.lineTo(A,y),C.closePath(),r.fillStyle="rgba(255,255,255,0.05)",r.fill(C),r.strokeStyle=S,r.lineWidth=2,r.stroke(C),o.fillStyle="rgb(175,175,175)",o.fill(C),o.strokeStyle="rgb(95,95,95)",o.lineWidth=2,o.stroke(C),r.strokeStyle="rgba(0,0,0,0.18)",r.lineWidth=5,r.beginPath(),r.moveTo(x+w*b*1.35,512*.07),r.lineTo(A+w*b*1.1,y-512*.02),r.stroke()}if(r.fillStyle=Fi(s.pin),r.beginPath(),r.arc(u-E-b*.4,512*.2,4.5,0,Math.PI*2),r.fill(),r.fillStyle="rgba(255,255,255,0.7)",r.beginPath(),r.arc(u-E-b*.4-1.2,512*.2-1.2,1.5,0,Math.PI*2),r.fill(),!p){const w=x=>{r.fillStyle="rgba(15,15,18,0.95)",r.beginPath(),r.arc(u,x,5,0,Math.PI*2),r.fill(),r.fillStyle="rgba(255,255,255,0.25)",r.beginPath(),r.arc(u-1.5,x-1.5,1.6,0,Math.PI*2),r.fill(),o.fillStyle="rgb(200,200,200)",o.beginPath(),o.arc(u,x,5,0,Math.PI*2),o.fill()};w(y+8),s.female||w(y+512*.16)}for(const w of[-1,1]){const x=u+w*l(.1),A=512*.8;r.fillStyle="rgba(0,0,0,0.12)",r.fillRect(x-512*.035,A,512*.07,3),r.strokeStyle=S,r.lineWidth=1.5,r.strokeRect(x-512*.035,A,512*.07,512*.035),o.fillStyle="rgb(150,150,150)",o.fillRect(x-512*.035,A,512*.07,512*.035)}if(!s.female){const w=u-l(.095),x=512*.32;r.strokeStyle=S,r.lineWidth=1.5,r.beginPath(),r.moveTo(w-512*.025,x),r.lineTo(w+512*.022,x-2),r.stroke(),r.fillStyle=Fi(s.pin,.9),r.beginPath(),r.moveTo(w-512*.018,x),r.lineTo(w-512*.008,x-9),r.lineTo(w+512*.004,x-4),r.lineTo(w+512*.014,x-8),r.lineTo(w+512*.016,x),r.closePath(),r.fill()}}const v=r.createLinearGradient(0,512*.85,0,512);v.addColorStop(0,"rgba(0,0,0,0)"),v.addColorStop(1,"rgba(0,0,0,0.25)"),r.fillStyle=v,r.fillRect(0,0,512,512);for(const p of[.25,.75]){const g=r.createLinearGradient(l(p)-30,0,l(p)+30,0);g.addColorStop(0,"rgba(0,0,0,0)"),g.addColorStop(.5,"rgba(0,0,0,0.12)"),g.addColorStop(1,"rgba(0,0,0,0)"),r.fillStyle=g,r.fillRect(l(p)-30,512*.15,60,512*.55)}return Nh(o,512,512,e+7,m==="tshirt"?6:12),{map:$n(n,!0),normalMap:$n(wo(a,2.2),!1)}}function Td(s,e,t=!0){const[r,a]=Ln(256,512),[o,l]=Ln(256,512);Fh(a,256,512,s,e,.06),l.fillStyle="rgb(128,128,128)",l.fillRect(0,0,256,512),t&&(a.fillStyle="rgba(255,255,255,0.07)",a.fillRect(256*.5-1,0,2,512),a.fillStyle="rgba(0,0,0,0.08)",a.fillRect(256*.5+1,0,2,512),l.fillStyle="rgb(165,165,165)",l.fillRect(256*.5-1.5,0,3,512));for(const h of[.25,.75])a.fillStyle="rgba(0,0,0,0.15)",a.fillRect(256*h-1,0,2,512),l.fillStyle="rgb(105,105,105)",l.fillRect(256*h-1,0,2,512);const c=a.createLinearGradient(0,512*.94,0,512);return c.addColorStop(0,"rgba(0,0,0,0)"),c.addColorStop(1,"rgba(0,0,0,0.3)"),a.fillStyle=c,a.fillRect(0,0,256,512),Nh(l,256,512,e+3,12),{map:$n(r,!0),normalMap:$n(wo(o,2),!1)}}function yM(s,e,t,i,n,r){const[l,c]=Ln(256,512),[h,f]=Ln(256,512);if(Fh(c,256,512,s,t,.06),f.fillStyle="rgb(128,128,128)",f.fillRect(0,0,256,512),n!==null){const u=(1-n)*512;c.fillStyle=Fi(r),c.fillRect(0,u,256,512-u),c.fillStyle="rgba(0,0,0,0.12)",c.fillRect(0,u,256,4),f.fillStyle="rgb(160,160,160)",f.fillRect(0,u-4,256,4)}else{e!==null&&(c.fillStyle=Fi(e),c.fillRect(0,512*.965,256,512*.035));for(let d=0;d<3;d++)c.fillStyle="rgba(10,10,12,0.9)",c.beginPath(),c.arc(256*i+(d-1)*7,512*.93,2.6,0,Math.PI*2),c.fill();c.strokeStyle="rgba(0,0,0,0.1)",c.lineWidth=2;const u=256*((i+.5)%1);for(let d=0;d<3;d++)c.beginPath(),c.moveTo(u-30,512*(.5+d*.025)),c.quadraticCurveTo(u,512*(.51+d*.025),u+30,512*(.5+d*.025)),c.stroke()}return Nh(f,256,512,t+11,12),{map:$n(l,!0),normalMap:$n(wo(h,2),!1)}}function MM(s,e){const[n,r]=Ln(256,256),[a,o]=Ln(256,256),l=Uh(e);r.fillStyle=Fi(s),r.fillRect(0,0,256,256),o.fillStyle="rgb(128,128,128)",o.fillRect(0,0,256,256);const c=new Te(s);for(let u=0;u<1400;u++){const d=l()*256,m=l()*256,v=10+l()*40,p=(l()-.5)*.5,g=c.clone().multiplyScalar(1+p);r.strokeStyle=`rgba(${Math.round(Math.min(1,g.r)*255)},${Math.round(Math.min(1,g.g)*255)},${Math.round(Math.min(1,g.b)*255)},0.5)`,r.lineWidth=1,r.beginPath(),r.moveTo(d,m),r.lineTo(d+(l()-.5)*6,m+v),r.stroke();const y=128+p*200;o.strokeStyle=`rgb(${y},${y},${y})`,o.beginPath(),o.moveTo(d,m),o.lineTo(d+(l()-.5)*6,m+v),o.stroke()}const h=$n(n,!0);h.wrapT=Wi;const f=$n(wo(a,3),!1);return f.wrapT=Wi,{map:h,normalMap:f}}const _M="rQCbAIUA9gAhAAcAfgGOAWoBBwHSAfkANAGfAUQBTgBfAL8AZAGFAQgBfwAiAKIAcAEIAYUBiwCiACIACwEAAC4BJQBIAAAACwAuAQAACwAAAEgAXQHDAV4BeAB5AOcAxAFeAcMB6ADnAHkACwEuAQ0BJQAnAEgALwENAS4BSQBIACcAZQFXAV4BgAB5AHIAFQFeAVcBLwByAHkAXgHEAWUBeQCAAOgAxQFlAcQB6QDoAIAAKwFNASkBRQBDAGgATAEpAU0BZwBoAEMArwCYAIwBrwCrAJgAeQGMAZgAlACYAKsAfQGAAX4BmgCbAJ0AjgF+AYABrQCdAJsAGAFbAUoBMgBlAHYAXAFKAVsBdwB2AGUADQEvAQ4BJwAoAEkAMAEOAS8BSgBJACgACQBQAZcACQCXAGsAUQGXAFABbABrAJcAWAEWAWgBcwCDADAAFwFoARYBMQAwAIMABgGvAaIBIADCANMAqAGiAa8BzADTAMIAMAGYAQ4BSgAoALgAmQEOAZgBuQC4ACgAEAE2AZcBKgC3AFAAnwGXATYBvwBQALcAQgEOAZoBXAC6ACgAmQGaAQ4BuQAoALoAWwHBAVwBdgB3AOUAwgFcAcEB5gDlAHcAsgGwAa4B1gDSANQApgGuAbABygDUANIAOQE6ARIAUwASAFQAEQASADoBEQBUABIAMwF3ATIBTQBMAJIAIwEyAXcBPQCSAEwAAwGDAQQBHQAeAKAAhAEEAYMBoQCgAB4AHgGeAYABOACdAL4AjgGAAZ4BrQC+AJ0AogGoAZYBwgC2AMwATwGWAagBagDMALYAbwGgAWwBigCHAMAAsgFsAaAB1gDAAIcAhwGnAUcBpQBiAMsAZgFHAacBgQDLAGIAKgEtARwBRAA2AEcA+wAcAS0BFQBHADYABAATAQUABAAFAC0AGQEFABMBMwAtAAUA/gB1Af0AGAAXAJAAdgH9AHUBkQCQABcAQAFBATMBWgBNAFsAdwEzAUEBkgBbAE0AGAGpAZsBMgC7AM0AqwGbAakBzwDNALsApQE5AcgAyQDIAFMAEgDIADkBEgBTAMgATwFBAZYBagC2AFsAlQGWAUEBtQBbALYAlQFBAZQBtQC0AFsAQAGUAUEBWgBbALQAEQA6ARAAEQAQAFQAOwEQADoBVQBUABAAqQEKAaoBzQDOACQApwGqAQoBywAkAM4AcQGMAZABjACwAKsAeQGQAYwBlACrALAAhwENAUIBpQBcACcADgFCAQ0BKAAnAFwAoQHRAZ0BwQC9APUA0AGdAdEB9AD1AL0AAQECAYIBGwCfABwAgQGCAQIBngAcAJ8ABAGEAdMBHgD3AKEA0gHTAYQB9gChAPcA+ADIAaMBAwDEAOwAjwGjAcgBrgDsAMQATQEqAUwBaABnAEQAHAFMASoBNgBEAGcAHQEIAKEBNwDBAAgAqAChAQgAqAAIAMEAVAEFAVoBbwB1AB8AwAFaAQUB5AAfAHUAHQGhAbkBNwDdAMEAnQG5AaEBvQDBAN0ARwHMAUYBYgBhAPAASAFGAcwBYwDwAGEAFQFjAUkBLwBkAH4AcwFJAWMBjgB+AGQANQGIAbYBTwDaAKYAtwG2AYgB2wCmANoAfQF+AQABmgAaAJsAVQEAAX4BcACbABoAaAEXAaQBgwDGADEArQGkARcB0QAxAMYAbQFsAXsBiACWAIcAigF7AWwBqQCHAJYAYwEVAbUBfgDZAC8AVwG1ARUBcgAvANkAuwG8ARoB3wA0AOAAGwEaAbwBNQDgADQAGQETAWsBMwCGAC0AuAFrARMB3AAtAIYArwEGAYsB0wCqACAAcQGLAQYBjAAgAKoAUQErAVIBbABtAEUAKQFSASsBQwBFAG0ATwERAUEBagBbACsAdwFBAREBkgArAFsAXAHCAV0BdwB4AOYAwwFdAcIB5wDmAHgA0wFnAVYB9wBxAIIAvgFWAWcB4gCCAHEAGgEbAU4BNABpADUAJQFOARsBPwA1AGkA+gDKAc4BFADyAO4AzQHOAcoB8QDuAPIAFAFhASwBLgBGAHwAfwEsAWEBnAB8AEYARQEkAUQBYABfAD4ANAFEASQBTgA+AF8AGwEUASUBNQA/AC4ALAElARQBRgAuAD8AvwEIAVkB4wB0ACIAdAFZAQgBjwAiAHQAYAFZAVoBewB1AHQAVAFaAVkBbwB0AHUAAQATABIBAQAsABMAYgESARMAfQATACwA+AAZAcgBAwDsADMAawHIARkBhgAzAOwAqQGqAasBzQDPAM4AtAGrAaoB2ADOAM8AfAF9AfwAmQAWAJoAAAH8AH0BGgCaABYAhwGJAQ0BpQAnAKcACwENAYkBJQCnACcAxwCsAcgAxwDIANAApQHIAKwByQDQAMgASgFJAQoBZQAkAGQAcwEKAUkBjgBkACQApgGwAREBygArANQAHwERAbABOQDUACsAIgH6AEgBPABjABQAzgFIAfoA8gAUAGMAAgEeAYEBHACeADgAgAGBAR4BnQA4AJ4AVgG+AWEBcQB8AOIACQFhAb4BIwDiAHwAAQGCAQMBGwAdAJ8AgwEDAYIBoACfAB0ArgGmAa8B0gDTAMoAqAGvAaYBzADKANMAvQFWARQB4QAuAHEAYQEUAVYBfABxAC4AqAGmAU8BzABqAMoAEQFPAaYBKwDKAGoAMgEkATMBTABNAD4ARQEzASQBYAA+AE0AbgG/AWABiQB7AOMAWQFgAb8BdADjAHsALgEMAS8BSABJACYADwEvAQwBKQAmAEkAcwFmAQoBjgAkAIEApwEKAWYBywCBACQARwEmAcwBYgDwAEAAxwHMASYB6wBAAPAAJgFLARYBQAAwAGYAFwEWAUsBMQBmADAALwEPATABSQBKACkAEAEwAQ8BKgApAEoAqwG0AbIBzwDWANgAsAGyAbQB1ADYANYAMAEQAZgBSgC4ACoAlwGYARABtwAqALgAigGuAYsBqQCqANIArwGLAa4B0wDSAKoAiwFxAXoBqgCVAIwAkAF6AXEBsACMAJUAKAFOASsBQgBFAGkATQErAU4BaABpAEUAoQGoAF8BwQB6AKgABgBfAagABgCoAHoAGAGbAWABMgB7ALsAeAFgAZsBkwC7AHsAPwFAAUUBWQBgAFoAMwFFAUABTQBaAGAAHQEnAVABNwBrAEEAKAFQAScBQgBBAGsAlAFAAZMBtACzAFoAPwGTAUABWQBaALMASgFcAUkBZQBkAHcAXQFJAVwBeAB3AGQATgElAU0BaQBoAD8AKgFNASUBRAA/AGgAQwHGAW4BXQCJAOoAvwFuAcYB4wDqAIkAEAA7AQ8AEAAPAFUAPAEPADsBVgBVAA8ArQEXAWYB0QCBADEASwFmARcBZgAxAIEADwA8AQ4ADwAOAFYAPQEOADwBVwBWAA4ACAAdAQkACAAJADcAUAEJAB0BawA3AAkASQFdARUBZAAvAHgAXgEVAV0BeQB4AC8A/AD9AHwBFgCZABcAdgF8Af0AkQAXAJkAkgGTAT4BsgBYALMAPwE+AZMBWQCzAFgAXwEGAKMBegDEAAYAxQCjAQYAxQAGAMQARAE+AUUBXwBgAFgAPwFFAT4BWQBYAGAAjQFvAW0BrACIAIoAbAFtAW8BhwCKAIgAIAGzAY0BOgCsANcAbwGNAbMBigDXAKwAtgG3AVgB2gBzANsAFgFYAbcBMADbAHMADwE3ARABKQAqAFEANgEQATcBUABRACoABQAZAcMABQDDADMA+ADDABkBAwAzAMMAEQEfAXcBKwCSADkAIwF3AR8BPQA5AJIAjAGsAa8AqwCvANAAxwCvAKwBxwDQAK8ADAE4AQ8BJgApAFIANwEPATgBUQBSACkAvAG9ARsB4AA1AOEAFAEbAb0BLgDhADUA/gBTAXUBGACQAG4AhgF1AVMBowBuAJAAJwEaASgBQQBCADQATgEoARoBaQA0AEIAWgHAAVsBdQB2AOQAwQFbAcAB5QDkAHYAxgFkAb8B6gDjAH8ACAG/AWQBIgB/AOMAUAEoAVEBawBsAEIAKwFRASgBRQBCAGwAlwBRAQoAlwAKAGwAUgEKAFEBbQBsAAoAFgG3ASYBMABAANsAxwEmAbcB6wDbAEAAlwGfASQBtwA+AL8ANAEkAZ8BTgC/AD4AZgFzAa0BgQDRAI4AYwGtAXMBfgCOANEAWQF0AVQBdABvAI8ACQFUAXQBIwCPAG8AhAGGAdIBoQD2AKMA+QDSAYYBBwCjAPYAYAFaARgBewAyAHUAWwEYAVoBdgB1ADIAJwG6ARoBQQA0AN4AuwEaAboB3wDeADQAEwBeAGIBEwB9AF4AcgFiAV4AjQBeAH0AJwEdAboBQQDeADcAuQG6AR0B3QA3AN4AowHFAPgAxAADAMUAwwD4AMUAwwDFAAMAZwEHAf8AggAZACEA+QD/AAcBBwAhABkAEwESAbgBLQDcACwAyQG4ARIB7QAsANwALAF/AS0BRgBHAJwAcAEtAX8BiwCcAEcAoQFfAdEBwQD1AHoAnAHRAV8BvAB6APUA0gEHAdMB9gD3ACEAZwHTAQcBggAhAPcAhQH7AHABogCLABUALQFwAfsARwAVAIsAdgGCAXwBkQCZAJ8AgQF8AYIBngCfAJkAewGKAXoBlgCVAKkAiwF6AYoBqgCpAJUAXwGjAZwBegC8AMQAjwGcAaMBrgDEALwAqgFCAbQBzgDYAFwAmgG0AUIBugBcANgAgwF1AYQBoAChAJAAhgGEAXUBowCQAKEAiQFGAaQApwCkAGEAAgCkAEYBAgBhAKQAYgFyAc0BfQDxAI0AzgHNAXIB8gCNAPEAAAALAaQAAACkACUAiQGkAAsBpwAlAKQACwAMAC4BCwBIAAwADAEuAQwAJgAMAEgAggF2AYMBnwCgAJEAdQGDAXYBkACRAKAADAANAAwBDAAmAA0AOAEMAQ0AUgANACYAJQEsASoBPwBEAEYALQEqASwBRwBGAEQAVAEJAQUBbwAfACMAvgEFAQkB4gAjAB8AfAGBAX0BmQCaAJ4AgAF9AYEBnQCeAJoAGAFKAakBMgDNAGUACgGpAUoBJABlAM0ApwGHAaoBywDOAKUAQgGqAYcBXAClAM4ArQFjAaQB0QDGAH4AtQGkAWMB2QB+AMYAhwFHAYkBpQCnAGIARgGJAUcBYQBiAKcAyQG2AbgB7QDcANoAWAG4AbYBcwDaANwAfgFqAVUBmwBwAIUAzwFVAWoB8wCFAHAAyQHNAcsB7QDvAPEAygHLAc0B7gDxAO8AsgGuAWwB1gCHANIAigFsAa4BqQDSAIcAngHPAY4BvgCtAPMAagGOAc8BhQDzAK0ABgGsAXEBIACMANAAjAFxAawBqwDQAIwAyQESAc0B7QDxACwAYgHNARIBfQAsAPEAPAGTAT0BVgBXALMAkgE9AZMBsgCzAFcAOwGUATwBVQBWALQAkwE8AZQBswC0AFYAOgGVATsBVABVALUAlAE7AZUBtAC1AFUAOQGWAToBUwBUALYAlQE6AZYBtQC2AFQAogGWAaUBwgDJALYAOQGlAZYBUwC2AMkAbgGRAUMBiQBdALEAaQFDAZEBhACxAF0AmAGXATIBuABMALcAJAEyAZcBPgC3AEwAmAEyAZkBuAC5AEwAIwGZATIBPQBMALkAmgGZAR8BugA5ALkAIwEfAZkBPQC5ADkAtAGaAbAB2ADUALoAHwGwAZoBOQC6ANQAsgGgAasB1gDPAMAAmwGrAaABuwDAAM8ACAFwAXQBIgCPAIsAfwF0AXABnACLAI8AyQHLAbYB7QDaAO8ANQG2AcsBTwDvANoAYAF4AW4BewCJAJMAkQFuAXgBsQCTAIkABAABABMBBAAtAAEAEgETAQEALAABAC0ArAEGAaUB0ADJACAAogGlAQYBwgAgAMkARwFmASYBYgBAAIEASwEmAWYBZgCBAEAAbwGzAaABigDAANcAsQGgAbMB1QDXAMAAxwG3ASEB6wA7ANsAiAEhAbcBpgDbADsASAHOAUYBYwBhAPIAcgFGAc4BjQDyAGEARgFyAQIAYQACAI0AXgACAHIBXgCNAAIAzAHHATEB8ABLAOsAIQExAccBOwDrAEsAwAFTAcEB5ADlAG4A/gDBAVMBGABuAOUABQG+Af8AHwAZAOIAZwH/AL4BggDiABkAwQH+AMIB5QDmABgA/QDCAf4AFwAYAOYAwgH9AMMB5gDnABcA/ADDAf0AFgAXAOcAwwH8AMQB5wDoABYAAAHEAfwAGgAWAOgAAAFVAcQBGgDoAHAAxQHEAVUB6QBwAOgAnQHQAZ4BvQC+APQAzwGeAdAB8wD0AL4AuQGdAR4B3QA4AL0AngEeAZ0BvgC9ADgAuQEeAboB3QDeADgAAgG6AR4BHAA4AN4AugECAbsB3gDfABwAAQG7AQIBGwAcAN8AvAG7AQMB4AAdAN8AAQEDAbsBGwDfAB0AAwEEAbwBHQDgAB4AvQG8AQQB4QAeAOAABAHTAb0BHgDhAPcAVgG9AdMBcQD3AOEA+gA1AcoBFADuAE8AywHKATUB7wBPAO4AIgExAYgBPACmAEsAIQGIATEBOwBLAKYAzAExAUgB8ABjAEsAIgFIATEBPABLAGMAeAGxAZEBkwCxANUAswGRAbEB1wDVALEA+gAiATUBFABPADwAiAE1ASIBpgA8AE8AmwGgAXgBuwCTAMAAsQF4AaAB1QDAAJMAVQHPAcUBcADpAPMA0AHFAc8B9ADzAOkAxQHQAWUB6QCAAPQA0QFlAdAB9QD0AIAAnAFXAdEBvAD1AHIAZQHRAVcBgAByAPUAtQFXAY8B2QCuAHIAnAGPAVcBvAByAK4AawG4AWgBhgCDANwAWAFoAbgBcwDcAIMAyAGkAY8B7ACuAMYAtQGPAaQB2QDGAK4AyAFrAaQB7ADGAIYAaAGkAWsBgwCGAMYAaQGRASABhAA6ALEAswEgAZEB1wCxADoAYQEJAX8BfACcACMAdAF/AQkBjwAjAJwA/wD5AFMBGQBuAAcAhgFTAfkAowAHAG4ABQH/AMABHwDkABkAUwHAAf8AbgAZAOQADgA9AQ0ADgANAFcAOAENAD0BUgBXAA0APQGSATgBVwBSALIANwE4AZIBUQCyAFIAkgE+ATcBsgBRAFgANgE3AT4BUABYAFEAPgFEATYBWABQAF8AnwE2AUQBvwBfAFAA";let Al=null;function SM(){if(!Al){const s=atob(_M),e=new Uint8Array(s.length);for(let t=0;t<s.length;t++)e[t]=s.charCodeAt(t);Al=new Uint16Array(e.buffer)}return Al}const bM=[10,338,297,332,284,251,389,356,454,323,361,288,397,365,379,378,400,377,152,148,176,149,150,136,172,58,132,93,234,127,162,21,54,103,67,109],AM=[50,280,101,330,118,347,205,425];function Rt(s,e={}){return new Ut({color:s,roughness:.72,metalness:0,...e})}function Wc(s,e){const t=new Te(s);return t.multiplyScalar(e),t.getHex()}function _t(s,e=1){return new _i({color:s,transparent:!0,opacity:e,blending:er,depthWrite:!1})}function ii(s,e,t,i=[0,0,0],n){const r=new Ge(s,e);return r.position.set(...t),r.rotation.set(...i),n&&r.scale.set(...n),r.castShadow=!0,r.receiveShadow=!0,r}const Xc=s=>(e,t={})=>s(new Ut({color:e,roughness:.55,...t}));function wM(s,e){let t=1/0,i=-1/0,n=1/0,r=-1/0;for(let u=0;u<s.length;u+=3)t=Math.min(t,s[u]),i=Math.max(i,s[u]),n=Math.min(n,s[u+1]),r=Math.max(r,s[u+1]);const a=(i-t)*.3;t-=a,i+=a,n-=a,r+=a;const o=72,l=(i-t)/(o-1),c=(r-n)/(o-1),h=new Float32Array(o*o).fill(NaN);for(let u=0;u<e.length;u+=3){const d=e[u]*3,m=e[u+1]*3,v=e[u+2]*3,p=s[d],g=s[d+1],y=s[d+2],E=s[m],M=s[m+1],b=s[m+2],S=s[v],w=s[v+1],x=s[v+2],A=(M-w)*(p-S)+(S-E)*(g-w);if(Math.abs(A)<1e-12)continue;const C=Math.max(0,Math.floor((Math.min(p,E,S)-t)/l)),R=Math.min(o-1,Math.ceil((Math.max(p,E,S)-t)/l)),D=Math.max(0,Math.floor((Math.min(g,M,w)-n)/c)),B=Math.min(o-1,Math.ceil((Math.max(g,M,w)-n)/c));for(let k=D;k<=B;k++){const N=n+k*c;for(let G=C;G<=R;G++){const H=t+G*l,se=((M-w)*(H-S)+(S-E)*(N-w))/A,V=((w-g)*(H-S)+(p-S)*(N-w))/A,j=1-se-V;if(se<-.01||V<-.01||j<-.01)continue;const J=se*y+V*b+j*x,we=k*o+G;(Number.isNaN(h[we])||J>h[we])&&(h[we]=J)}}}const f=Math.max(l,c)*1.3;for(let u=0;u<14;u++){const d=h.slice();for(let m=0;m<o;m++)for(let v=0;v<o;v++){const p=m*o+v;if(!Number.isNaN(h[p]))continue;let g=-1/0;for(let y=-1;y<=1;y++)for(let E=-1;E<=1;E++){const M=v+E,b=m+y;if(M<0||b<0||M>=o||b>=o)continue;const S=h[b*o+M];Number.isNaN(S)||(g=Math.max(g,S))}g>-1/0&&(d[p]=g-f)}h.set(d)}for(let u=0;u<2;u++){const d=h.slice();for(let m=1;m<o-1;m++)for(let v=1;v<o-1;v++){let p=0,g=0;for(let y=-1;y<=1;y++)for(let E=-1;E<=1;E++){const M=h[(m+y)*o+v+E];Number.isNaN(M)||(p+=M,g++)}g>=5&&!Number.isNaN(h[m*o+v])&&(d[m*o+v]=p/g)}h.set(d)}return(u,d)=>{const m=(u-t)/l,v=(d-n)/c;if(m<0||v<0||m>o-1||v>o-1)return null;const p=Math.min(o-2,Math.floor(m)),g=Math.min(o-2,Math.floor(v)),y=m-p,E=v-g,M=[h[g*o+p],h[g*o+p+1],h[(g+1)*o+p],h[(g+1)*o+p+1]];if(M.some(Number.isNaN)){const b=M.filter(S=>!Number.isNaN(S));return b.length?Math.min(...b):null}return(M[0]*(1-y)+M[1]*y)*(1-E)+(M[2]*(1-y)+M[3]*y)*E}}function EM(s,e){const t=Array.from({length:e},()=>new Set);for(let a=0;a<s.length;a+=3){const o=s[a],l=s[a+1],c=s[a+2];t[o].add(l).add(c),t[l].add(o).add(c),t[c].add(o).add(l)}const i=new Int32Array(e).fill(99);let n=bM.slice();for(const a of n)i[a]=0;for(let a=1;a<=3;a++){const o=[];for(const l of n)for(const c of t[l])i[c]>a&&(i[c]=a,o.push(c));n=o}const r=new Float32Array(e);for(let a=0;a<e;a++)r[a]=i[a]===0?0:i[a]===1?.45:i[a]===2?.85:1;return r}function TM(s,e,t,i,n,r,a){const o=e.mesh.pos,l=e.mesh.uv,c=ee=>new L(o[ee*3],o[ee*3+1],o[ee*3+2]),h=t.head??1,f=c(234),u=c(454),d=Math.abs(u.x-f.x)||15,m=.2*h/d,v=f.clone().add(u).multiplyScalar(.5),p=c(152),g=c(10),y=-.125*h-(p.y-v.y)*m,E=new Float32Array(468*3);for(let ee=0;ee<468;ee++)E[ee*3]=(o[ee*3]-v.x)*m,E[ee*3+1]=(o[ee*3+1]-v.y)*m+y,E[ee*3+2]=(o[ee*3+2]-v.z)*m*1.05;const M=SM();let b=M;{const be=new L().fromArray(E,M[0]*3),Me=new L().fromArray(E,M[1]*3),Ie=new L().fromArray(E,M[2]*3),nt=Me.clone().sub(be).cross(Ie.clone().sub(be));let ie=0;for(let re=0;re<M.length;re+=3)be.fromArray(E,M[re]*3),Me.fromArray(E,M[re+1]*3),Ie.fromArray(E,M[re+2]*3),nt.copy(Me).sub(be).cross(Ie.clone().sub(be)),ie+=nt.z;if(ie<0){b=new Uint16Array(M.length);for(let re=0;re<M.length;re+=3)b[re]=M[re],b[re+1]=M[re+2],b[re+2]=M[re+1]}}const S=EM(b,468),w=l[2],x=l[3],A=new Float32Array(468*2);for(let ee=0;ee<468;ee++){const be=S[ee]===0?.1:S[ee]<.5?.06:S[ee]<.9?.03:0;A[ee*2]=l[ee*2]+(w-l[ee*2])*be,A[ee*2+1]=1-(l[ee*2+1]+(x-l[ee*2+1])*be)}const C=new Float32Array(468*4);for(let ee=0;ee<468;ee++)C.set([1,1,1,S[ee]],ee*4);const R=new It;R.setAttribute("position",new ri(E,3)),R.setAttribute("uv",new ri(A,2)),R.setAttribute("color",new ri(C,4)),R.setIndex(new ri(b,1)),R.computeVertexNormals(),r.push(R);const D=new Ut({map:e.texture,vertexColors:!0,transparent:!0,roughness:.62,emissive:16777215,emissiveMap:e.texture,emissiveIntensity:.24,envMapIntensity:.8});r.push(D);const B=new Ge(R,D);B.castShadow=!0,B.renderOrder=2,s.add(B);const k=.2*h,N=(g.y-p.y)*m,G=new L(0,y+.125*h*.16+.004,-.035*h),H=k*.52,se=Math.max(N*.7,k*.66),V=k*.62,j=wM(E,b),J=new Oe(1,56,40),we=J.getAttribute("position");for(let ee=0;ee<we.count;ee++){let be=G.x+we.getX(ee)*H,Me=G.y+we.getY(ee)*se,Ie=G.z+we.getZ(ee)*V;if(Me<G.y){const nt=1-(G.y-Me)/se*.18;be*=nt,Ie=G.z+(Ie-G.z)*(Ie<G.z?nt*.95:1)}if(Ie>G.z){const nt=j(be,Me);nt!==null&&(Ie=Math.min(Ie,nt-.003))}we.setXYZ(ee,be,Me,Ie)}J.computeVertexNormals(),r.push(J),s.add(ii(J,i,[0,0,0]));const ce=new Oe(1,16,12),ct=i,tt=["long","wavy","bob","braids","curly"].includes(t.hair);for(const ee of tt?[]:[1,-1]){const be=ii(ce,ct,[ee*H*.96,G.y-.012*h,G.z+.012*h],[0,ee*.35,0],[.012*h,.032*h,.022*h]);s.add(be)}const Je=new lt;Je.position.copy(G),Je.scale.set(1,se/H,V/H),s.add(Je);const q=((g.y-v.y)*m+y-G.y)/se,te={front:q-.05,temple:q-.3,side:-.16,back:-.42};if(op(Je,t,H*.985,n,r,a,te),lp(Je,t,H,Xc(n)),(t.facialHair??"none")==="long"){const ee=Xc(n)(t.facialHairColor??t.hairColor,{roughness:.85}),be=(p.y-v.y)*m+y,Me=(p.z-v.z)*m;s.add(ii(new Oe(1,20,14),ee,[0,be-.01*h,Me-.035*h],[0,0,0],[.05*h,.035*h,.04*h])),s.add(ii(new ti(.046*h,.15*h,16),ee,[0,be-.085*h,Me-.04*h],[Math.PI-.2,0,0]))}}function CM(s,e,t,i,n,r,a){const o=Xc(n),l=(v,p,g,y={})=>{const E=ii(v,p,g,y.rot,y.scale);return s.add(E),E},c=o(Wc(e.skin,.84),{roughness:.6});l(new Oe(t,32,24),i,[0,0,0],{scale:[.9,1.08,1]});const h=e.female?.82:.93;l(new Oe(t*.8,24,16),i,[0,-t*.36,t*.1],{scale:[h,.85,.95]});for(const v of[1,-1])l(new Oe(t*.22,12,10),c,[v*t*.87,-t*.02,-t*.02],{scale:[.45,1,.8]});const f=o(16053488,{roughness:.2}),u=o(2825492,{roughness:.15});for(const v of[1,-1])l(new Oe(t*.12,14,12),f,[v*t*.32,t*.1,t*.83]),l(new Oe(t*.064,12,10),u,[v*t*.31,t*.09,t*.935]);const d=o(Wc(e.facialHairColor??e.hairColor,e.hairColor>10485760?.7:1),{roughness:.8}),m=e.brows??1;for(const v of[1,-1])l(new Le(t*.36,t*.06*m,t*.08),d,[v*t*.32,t*.3,t*.9],{rot:[0,v*.25,v*.16]});l(new Oe(t*.16,14,12),c,[0,-t*.03,t*.98],{scale:[.78,1.1,1.05]}),l(new Le(t*.36,t*.045,t*.05),o(8010294,{roughness:.4}),[0,-t*.4,t*.9]),op(s,e,t,n,r,a),RM(s,e,t,o),LM(s,e,t,o),lp(s,e,t,o)}function PM(s,e,t,i){const n=MM(s,i);return n.map.repeat.set(3,2),n.normalMap.repeat.set(3,2),t.push(n.map,n.normalMap),e(new Ks({map:n.map,normalMap:n.normalMap,roughness:.5,sheen:.6,sheenColor:new Te(s).lerp(new Te(16777215),.4),sheenRoughness:.35,side:oi}))}function op(s,e,t,i,n,r,a){if(e.hair==="bald")return;const o=PM(e.hairColor,i,n,r),l=(f,u,d=[0,0,0],m=[1,1,1])=>{const v=a&&f.userData.cap,p=ii(f,o,v?[0,0,0]:u,v?[0,0,0]:d,v?[1.01,1,1.01]:m);return s.add(p),p},c=(f,u,d,m)=>{const v=e.hair==="receding"?.25:0,p=w=>{const x=Math.acos(Math.cos(w)),A=a,C=[[0,A.front+v],[.75,A.temple+v*.8],[Math.PI/2,A.side],[Math.PI,A.back]];for(let R=0;R<C.length-1;R++){const[D,B]=C[R],[k,N]=C[R+1];if(x<=k){const G=(x-D)/(k-D);return B+(N-B)*G*G*(3-2*G)}}return A.back},g=56,y=16,E=[],M=[],b=[];for(let w=0;w<=y;w++)for(let x=0;x<=g;x++){const A=x/g*Math.PI*2,C=(Math.cos(A)+1)/2,R=Math.abs(Math.sin(A)),D=a?f*p(A):f*(C*u+(1-C)*d)*(1-R*.3)+R*f*m*.3,B=Math.acos(Math.max(-.97,Math.min(.97,D/f))),k=w/y,N=B*k,G=f*(1-.035*k*k*k);E.push(Math.sin(N)*Math.sin(A)*G,Math.cos(N)*G,Math.sin(N)*Math.cos(A)*G),M.push(x/g,1-k)}for(let w=0;w<y;w++)for(let x=0;x<g;x++){const A=w*(g+1)+x,C=A+1,R=A+g+1,D=R+1;b.push(A,R,C,C,R,D)}const S=new It;return S.setAttribute("position",new ot(E,3)),S.setAttribute("uv",new ot(M,2)),S.setIndex(b),S.computeVertexNormals(),S.userData.cap=!0,S},h=t*1.04;switch(e.hair){case"short":l(c(h,.42,-.2,-.1),[0,t*.02,-t*.02],[0,0,0],[.93,1.06,1.02]);break;case"buzz":l(c(t*1.015,.45,-.25,-.15),[0,t*.02,-t*.02],[0,0,0],[.92,1.06,1.01]);break;case"side":l(c(h*1.02,.4,-.2,-.1),[0,t*.03,-t*.02],[0,0,-.06],[.95,1.07,1.03]),l(new Oe(t*.6,16,10),[t*.2,t*.72,t*.22],[-.2,0,-.25],[1.3,.45,1.1]);break;case"swept":l(c(h*1.03,.45,-.2,-.1),[0,t*.03,-t*.02],[0,0,0],[.95,1.08,1.04]),l(new Oe(t*.68,16,10),[0,t*.76,t*.2],[-.35,0,0],[1.25,.45,1.2]);break;case"receding":l(c(h,.75,-.15,-.05),[0,t*.02,-t*.03],[0,0,0],[.94,1.05,1.02]);break;case"horseshoe":{const f=l(new Vt(t*.9,t*.16,10,28,Math.PI*1.15),[0,t*.02,-t*.03]);f.rotation.set(-Math.PI/2,0,-Math.PI*.075),f.scale.set(1,1.08,.8);break}case"long":case"wavy":{if(l(c(t*1.06,.35,-.3,-.3),[0,t*.02,-t*.02],[0,0,0],[.95,1.06,1.03]),l(new $e(t*1,t*1.18,t*2.2,28,1,!0,Math.PI*.32,Math.PI*1.36),[0,-t*.62,-t*.03],[0,0,0],[.95,1,1]),e.hair==="wavy")for(let f=0;f<6;f++){const u=Math.PI*(.55+f*.18);l(new Oe(t*.3,12,8),[Math.sin(u)*t*1.02,-t*(1.25+f%2*.22),Math.cos(u)*t*.98])}break}case"bob":l(c(t*1.07,.3,-.35,-.4),[0,t*.02,-t*.02],[0,0,0],[.96,1.06,1.03]),l(new $e(t*1.04,t*1.12,t*1.3,28,1,!0,Math.PI*.3,Math.PI*1.4),[0,-t*.3,-t*.03],[0,0,0],[.95,1,1]);break;case"bun":l(c(t*1.05,.35,-.2,-.2),[0,t*.02,-t*.02],[0,0,0],[.95,1.06,1.03]),l(new Oe(t*.42,16,12),[0,t*.55,-t*.88]);break;case"ponytail":l(c(t*1.05,.35,-.2,-.2),[0,t*.02,-t*.02],[0,0,0],[.95,1.06,1.03]),l(new Rn(t*.2,t*1.1,6,10),[0,-t*.2,-t*1.18],[.5,0,0]);break;case"curly":{l(c(t*1.1,.3,-.25,-.2),[0,t*.02,-t*.02],[0,0,0],[.97,1.06,1.04]);for(let f=0;f<22;f++){const u=f/22*Math.PI*2,d=t*(.25+f%3*.26),m=t*(1+f%2*.1);Math.cos(u)>.65&&d<t*.6||l(new Oe(t*.32,12,8),[Math.sin(u)*m,d,Math.cos(u)*m-t*.05])}for(let f=0;f<9;f++){const u=Math.PI*(.6+f*.09);l(new Oe(t*.33,12,8),[Math.sin(u)*t*1.04,-t*(.2+f%3*.3),Math.cos(u)*t*.98])}break}case"spiky":l(c(h,.42,-.2,-.1),[0,t*.02,-t*.02],[0,0,0],[.93,1.06,1.02]);for(let f=0;f<7;f++){const u=-.9+f*.3;l(new ti(t*.16,t*.45,6),[Math.sin(u)*t*.5,t*.95,Math.cos(u)*t*.2],[0,0,-u*.6])}break;case"braids":{l(c(t*1.06,.33,-.25,-.3),[0,t*.02,-t*.02],[0,0,0],[.95,1.06,1.03]);for(let f=0;f<11;f++){const u=Math.PI*(.6+f*.08);l(new Rn(t*.09,t*1.9,4,8),[Math.sin(u)*t*.98,-t*.75,Math.cos(u)*t*.96])}break}}}function RM(s,e,t,i){const n=e.facialHair??"none";if(n==="none")return;const r=e.facialHairColor??e.hairColor,a=i(r,{roughness:.85}),o=(h,f,u,d=[0,0,0],m)=>s.add(ii(h,f,u,d,m)),l=(h,f,u,d)=>o(new Oe(h,26,14,-.15,Math.PI+.3,Math.PI*f,Math.PI*(u-f)),d,[0,0,t*.02],[0,0,0],[.91,1.07,1.02]),c=()=>o(new Rn(t*.07,t*.32,4,8),a,[0,-t*.26,t*.96],[0,0,Math.PI/2]);switch(n){case"stubble":l(t*1.012,.58,.92,i(r,{transparent:!0,opacity:.4,roughness:.9}));break;case"short":l(t*1.03,.6,.94,a),c();break;case"full":l(t*1.06,.56,.97,a),o(new Oe(t*.46,16,12),a,[0,-t*.82,t*.4],[0,0,0],[1.1,.9,.9]),c();break;case"long":l(t*1.06,.56,.97,a),o(new Oe(t*.48,16,12),a,[0,-t*.8,t*.4],[0,0,0],[1.1,.9,.9]),o(new ti(t*.5,t*1.5,16),a,[0,-t*1.45,t*.45],[Math.PI-.2,0,0]),c();break;case"goatee":o(new Oe(t*.28,12,10),a,[0,-t*.75,t*.62]),c();break;case"mustache":c();break}}function LM(s,e,t,i){const n=e.glasses??"none";if(n==="none")return;const r=i(n==="thick"?1710618:2763306,{metalness:.6,roughness:.3}),a=n==="thick"?t*.045:t*.024,o=new Ks({color:14676735,transparent:!0,opacity:.18,roughness:.05,metalness:0,depthWrite:!1}),l=(c,h,f,u=[0,0,0],d)=>s.add(ii(c,h,f,u,d));for(const c of[1,-1]){const h=[c*t*.33,t*.1,t*1.02];n==="round"?l(new Vt(t*.21,a,8,24),r,h):l(new Vt(t*.22,a,6,4),r,h,[0,0,Math.PI/4],[1.25,.85,1]),l(new cr(t*.19,20),o,[h[0],h[1],h[2]+.001]),l(new Le(a*1.2,a*1.2,t*.95),r,[c*t*.6,t*.13,t*.55])}l(new Le(t*.2,a*1.2,a*1.2),r,[0,t*.15,t*1.04])}function lp(s,e,t,i){const n=e.headwear??"none";if(n==="none")return;const r=e.headwearColor??(n==="black-hat"?723723:1118481),a=i(r,{roughness:n==="black-hat"?.55:.85}),o=(l,c)=>{const h=new lt;return h.position.set(...l),h.rotation.x=c,s.add(h),h};switch(n){case"kippah":case"kippah-knit":{const l=o([0,t*.92,-t*.3],-.45);l.add(ii(new Oe(t*.55,20,8,0,Math.PI*2,0,Math.PI*.22),a,[0,-t*.42,0],[0,0,0],[1,.9,1])),n==="kippah-knit"&&l.add(ii(new Vt(t*.28,t*.03,6,24),i(16777215),[0,t*.08,0],[Math.PI/2,0,0]));break}case"black-hat":{const l=o([0,t*.78,-t*.05],-.12);l.add(ii(new $e(t*1.6,t*1.6,t*.07,32),a,[0,0,0])),l.add(ii(new $e(t*.88,t*1,t*.95,28),a,[0,t*.48,0])),l.add(ii(new $e(t*1.01,t*1.01,t*.18,28),i(2763306,{roughness:.4}),[0,t*.12,0]));break}case"hat":{const l=o([0,t*.72,0],-.1);l.add(ii(new $e(t*1.45,t*1.45,t*.06,32),a,[0,0,0])),l.add(ii(new Oe(t*.98,24,12,0,Math.PI*2,0,Math.PI/2),a,[0,0,0],[0,0,0],[1,.75,1]));break}case"beret":s.add(ii(new Oe(t*1.1,24,12),a,[t*.1,t*.78,-t*.05],[0,0,-.2],[1.1,.35,1.1]));break;case"scarf":s.add(ii(new Oe(t*1.1,26,16,0,Math.PI*2,0,Math.PI*.62),a,[0,0,-t*.05],[0,0,0],[.96,1.05,1.02])),s.add(ii(new $e(t*1.02,t*1.15,t*1.3,24,1,!0,Math.PI*.35,Math.PI*1.3),a,[0,-t*.55,-t*.03]));break}}const cp=.95,qc=.45,Kc=.44,Cd=.035,hp=["fist","open","point","thumb","v"];function Pd(s,e,t){const i=s.hands[e];for(const n of hp)i[n].visible=n===t}const Yt=(s,e,t)=>{const i=Math.max(0,Math.min(1,(t-s)/(e-s)));return i*i*(3-2*i)};function IM(s,e,t,i,n){const r=n*n,a=r*n;return .5*(2*e+(-s+t)*n+(2*s-5*e+4*t-i)*r+(-s+3*e-3*t+i)*a)}function Rd(s,e){let t=0;for(;t<s.length-2&&e>s[t+1].y;)t++;const i=s[Math.max(0,t-1)],n=s[t],r=s[t+1],a=s[Math.min(s.length-1,t+2)],o=Math.max(0,Math.min(1,(e-n.y)/(r.y-n.y||1))),l=(c,h)=>IM(i[c]??h,n[c]??h,r[c]??h,a[c]??h,o);return{y:e,rx:Math.max(.004,l("rx",0)),rz:Math.max(.004,l("rz",0)),cx:l("cx",0),cz:l("cz",0),n:Math.max(1.6,l("n",2)),front:Math.max(0,l("front",0)),back:Math.max(0,l("back",0))}}function Gn(s,e){const t=s[0].y,i=s[s.length-1].y,n=e.v0??t,r=e.v1??i,a=e.seg+1,o=[],l=[],c=[],h=[],f=[],u=(p,g,y)=>{const E=e.influence(p,g,y).filter(([,b])=>b>1e-4).sort((b,S)=>S[1]-b[1]).slice(0,4),M=E.reduce((b,[,S])=>b+S,0)||1;for(let b=0;b<4;b++)c.push(E[b]?.[0]??0),h.push(E[b]?E[b][1]/M:0)};for(let p=0;p<=e.rings;p++){const g=t+(i-t)*p/e.rings,y=Rd(s,g),E=2/y.n;for(let M=0;M<a;M++){const b=M/e.seg,S=b*Math.PI*2,w=Math.sin(S),x=Math.cos(S),A=y.cx+y.rx*Math.sign(w)*Math.abs(w)**E,C=x>0?y.rz+y.back:y.rz+y.front,R=y.cz-C*Math.sign(x)*Math.abs(x)**E;o.push(A,g,R),l.push(b,(g-n)/(r-n)),u(A,g,R)}}for(let p=0;p<e.rings;p++)for(let g=0;g<e.seg;g++){const y=p*a+g,E=y+1,M=y+a,b=M+1;f.push(y,E,M,E,b,M)}const d=(p,g)=>{const y=Rd(s,p===0?t:i),E=o.length/3,M=p===0?t-(g?.01:0):i+.01;o.push(y.cx,M,y.cz),l.push(.5,p===0?0:1),u(y.cx,M,y.cz);const b=p*a;for(let S=0;S<e.seg;S++)g?f.push(E,b+S+1,b+S):f.push(E,b+S,b+S+1)};e.capBottom&&d(0,!0),e.capTop&&d(e.rings,!1);const m=new It;m.setAttribute("position",new ot(o,3)),m.setAttribute("uv",new ot(l,2)),m.setAttribute("skinIndex",new bh(c,4)),m.setAttribute("skinWeight",new ot(h,4)),m.setIndex(f),m.computeVertexNormals();const v=m.getAttribute("normal");for(let p=0;p<=e.rings;p++){const g=p*a,y=g+e.seg,E=v.getX(g)+v.getX(y),M=v.getY(g)+v.getY(y),b=v.getZ(g)+v.getZ(y),S=Math.hypot(E,M,b)||1;v.setXYZ(g,E/S,M/S,b/S),v.setXYZ(y,E/S,M/S,b/S)}return m}function xi(s,e,t,i=[0,0,0],n){const r=new Ge(s,e);return r.position.set(...t),r.rotation.set(...i),n&&r.scale.set(...n),r.castShadow=!0,r.receiveShadow=!0,r}function Ld(s,e){const t=e,i=new wn(.048*t,.075*t,.08*t,3,.018*t),n=new wn(.03*t,.085*t,.082*t,3,.012*t),r=new wn(.056*t,.032*t,.084*t,3,.014*t),a=new wn(.024*t,.05*t,.078*t,3,.011*t),o=new Oe(.0105*t,10,8),l=new Rn(.009*t,.062*t,4,8),c=new Rn(.0118*t,.038*t,4,8),h=[.031,.01,-.011,-.031].map(d=>d*t),f=(d,m=!1)=>{const v=new lt;return v.add(xi(i,s,[.004*t,-.045*t,0])),v.add(xi(r,s,[-.002*t,-.094*t,0])),v.add(xi(a,s,[-.03*t,-.074*t,0])),h.forEach((p,g)=>{d.includes(g)?v.add(xi(l,s,[-.004*t,-.14*t,p])):v.add(xi(o,s,[.02*t,-.103*t,p]))}),m?v.add(xi(c,s,[-.012*t,-.052*t,.062*t],[Math.PI/2,0,0])):v.add(xi(c,s,[-.045*t,-.08*t,.01*t],[Math.PI/2,0,0])),v},u=new lt;return u.add(xi(n,s,[0,-.048*t,.002*t])),h.forEach((d,m)=>u.add(xi(l,s,[0,-.13*t+Math.abs(m-1.5)*.006*t,d*1.1]))),u.add(xi(c,s,[-.018*t,-.06*t,.058*t],[Math.PI/2-.5,0,0])),{fist:f([]),open:u,point:f([0]),thumb:f([],!0),v:f([0,1])}}function Id(s,e,t){const i=new lt,n=new Rn(.048,.15,6,14);return i.add(xi(n,s,[0,-.004,.05],[Math.PI/2,0,0],[t?.85:1,1,t?.62:.72])),i.add(xi(new wn(t?.085:.104,.02,.27,2,.008),e,[0,-.03,.05])),i.add(xi(new wn(.085,t?.05:.028,.065,2,.008),e,[0,t?-.045:-.03,-.055])),i}const DM=s=>[...s].reduce((e,t)=>e*31+t.charCodeAt(0)>>>0,7);function up(s,e={}){const t=s.look,i=Yn[s.party],n=!!t.female,r=t.build*(n?.92:1),a=n?.88:1,o=Math.sqrt(t.build)*(n?.9:1),l=Math.max(0,t.build-1.02)*1.25,c=DM(s.id),h=[],f=[],u=ae=>(f.push(ae),ae),d=t.outfit,m=d==="suit"?"suit":d==="open-suit"?"open":d==="blazer"||d==="skirt"?"blazer":d==="shirt"?"shirt":"tshirt",v=d==="suit"&&t.tie!==null&&t.tie!==void 0?t.tie:null,p=new lt,g=new lt;g.position.set(0,cp,0),p.add(g);const y=(ae,pe,I,fe)=>{const $=new Ff;return $.position.set(pe,I,fe),ae.add($),$},E=.2*a*(.55+.45*r)+.035,M=.092*(.6+.4*r)*(n?1.04:1),b=y(g,0,0,0),S=y(b,0,.06,0),w=y(S,0,.5,0),x=y(w,0,.03,0),A=y(x,0,.1,0),C=y(w,E,-.04,0),R=y(C,0,-.3,0),D=y(R,0,-.3,0),B=y(w,-E,-.04,0),k=y(B,0,-.3,0),N=y(k,0,-.3,0),G=y(b,M,-.05,0),H=y(G,0,-qc,0),se=y(H,0,-Kc,0),V=y(b,-M,-.05,0),j=y(V,0,-qc,0),J=y(j,0,-Kc,0),we=[b,S,w,x,A,C,R,D,B,k,N,G,H,se,V,j,J],ce={hips:0,spine:1,chest:2,neck:3,head:4,lSh:5,lEl:6,rSh:8,rEl:9,lHip:11,lKnee:12,rHip:14,rKnee:15};p.updateMatrixWorld(!0);const ct=new Eh(we),tt=new Te(e.photo?e.photo.skin:t.skin),Je=u(new Ks({color:tt,roughness:.52,sheen:.25,sheenColor:new Te(16760992),sheenRoughness:.6})),q=(ae,pe=.8)=>(h.push(ae.map,ae.normalMap),u(new Ks({map:ae.map,normalMap:ae.normalMap,normalScale:new le(.7,.7),roughness:pe,sheen:.45,sheenRoughness:.55,sheenColor:new Te(16777215).multiplyScalar(.25),side:oi}))),te=m==="shirt"||m==="tshirt"?.9:.82,ee=1.585,be=n?.035:0,Me=[{y:te,rx:(n?.19:.185)*r,rz:.13*r,back:.01},{y:.92,rx:(n?.185:.175)*r,rz:.125*r,front:l*.05,back:.012},{y:1.05,rx:(n?.15:.166+l*.03)*r,rz:.118*r,front:l*.11},{y:1.18,rx:(n?.16:.173)*r,rz:.12*r,front:l*.07},{y:1.32,rx:.19*r*a,rz:.124*Math.sqrt(r),front:be},{y:1.42,rx:.205*a*(.55+.45*r),rz:.12*Math.sqrt(r),front:be*.6,n:2.2},{y:1.49,rx:E-.015,rz:.105*Math.sqrt(r),n:2.6},{y:1.535,rx:E-.055,rz:.09,n:2.3},{y:1.565,rx:.11,rz:.08},{y:ee,rx:.068,rz:.066}],Ie=(ae,pe,I)=>ae>=0?pe:I,ie=Gn(Me,{rings:44,seg:40,influence:(ae,pe)=>{const I=1-Yt(.98,1.12,pe),fe=Yt(1.3,1.44,pe),$=Math.max(0,1-I-fe);let ge=[[ce.hips,I],[ce.spine,$],[ce.chest,fe]];const Ce=Math.abs(ae),oe=pe>1.34?Yt(.12,E,Ce)*Yt(1.34,1.48,pe)*.7:0,Xe=pe<.94?(1-Yt(.82,.94,pe))*.35*Yt(.02,.12,Ce):0,Be=pe>1.56?Yt(1.56,ee,pe)*.5:0,wt=1-oe-Xe-Be;return ge=ge.map(([Mt,Ti])=>[Mt,Ti*wt]),oe&&ge.push([Ie(ae,ce.lSh,ce.rSh),oe]),Xe&&ge.push([Ie(ae,ce.lHip,ce.rHip),Xe]),Be&&ge.push([ce.neck,Be]),ge}}),re=xM({color:t.jacket,shirt:t.shirt,tie:v,style:m,pin:i.color,female:n,pinstripe:c%5===0,y0:te,y1:ee},c),he=q(re,m==="tshirt"?.9:.78),ue=m==="tshirt",xe=m==="shirt"||m==="tshirt"?t.shirt:t.jacket,Ye=ae=>[{y:.9,rx:.047*o,rz:.047*o,cx:ae},{y:.94,rx:.046*o,rz:.046*o,cx:ae},{y:1.05,rx:.05*o,rz:.052*o,cx:ae,cz:.004},{y:1.17,rx:.053*o,rz:.053*o,cx:ae},{y:1.3,rx:.06*o,rz:.062*o,cx:ae},{y:1.44,rx:.068*o,rz:.07*o,cx:ae},{y:1.53,rx:.06*o,rz:.066*o,cx:ae*.96}],We=(ae,pe)=>(I,fe)=>{const $=Yt(1.46,1.53,fe)*.35,ge=1-Yt(1.1,1.25,fe);return[[ce.chest,$],[ae,Math.max(0,1-$-ge)],[pe,ge]]},Ve=(ae,pe)=>{const I=new bm(ae,pe);return I.castShadow=!0,I.receiveShadow=!0,I.frustumCulled=!1,p.add(I),I.bind(ct),h.push(ae),I};Ve(ie,he);for(const[ae,pe,I,fe]of[[E,ce.lSh,ce.lEl,.25],[-E,ce.rSh,ce.rEl,.75]]){const $=yM(xe,m==="tshirt"?null:t.shirt,c+(ae>0?1:2),fe,ue?.55:null,t.skin);Ve(Gn(Ye(ae),{rings:30,seg:20,influence:We(pe,I)}),q($))}const Qe=d==="skirt",U=Td(t.pants,c+5,!Qe),pt=q(U),st=[{y:.77,rx:.05,rz:.05},{y:.8,rx:.13*r,rz:.095*r},{y:.86,rx:.165*r,rz:.118*r,back:.012},{y:.94,rx:.17*r,rz:.122*r,back:.01,front:l*.04},{y:1.02,rx:.165*r,rz:.118*r,front:l*.06}];Ve(Gn(st,{rings:14,seg:28,capBottom:!0,influence:(ae,pe)=>{const I=(1-Yt(.78,.88,pe))*.55*Yt(0,.07,Math.abs(ae));return[[ce.hips,1-I],[Ie(ae,ce.lHip,ce.rHip),I]]}}),pt);const P=(ae,pe)=>{const I=pe?.82:1;return[{y:.04,rx:(pe?.034:.058)*o,rz:(pe?.038:.06)*o,cx:ae},{y:.14,rx:.052*o*I,rz:.056*o*I,cx:ae},{y:.33,rx:.062*o*I,rz:.068*o*I,cx:ae,back:.008},{y:.46,rx:.06*o*I,rz:.062*o*I,cx:ae,cz:.004},{y:.62,rx:.075*o*I,rz:.078*o*I,cx:ae},{y:.8,rx:.09*o*I,rz:.094*o*I,cx:ae},{y:.95,rx:.098*o*I,rz:.1*o*I,cx:ae*.9}]},_=(ae,pe)=>(I,fe)=>{const $=Yt(.84,.97,fe)*.55,ge=1-Yt(.4,.53,fe);return[[ce.hips,$],[ae,Math.max(0,1-$-ge)],[pe,ge]]};let O=pt;if(Qe){O=u(new Ks({color:Wc(t.skin,.9),roughness:.45,sheen:.5,sheenColor:new Te(5583650)}));const ae=[{y:.5,rx:.2*r,rz:.14*r},{y:.7,rx:.19*r,rz:.135*r,back:.01},{y:.9,rx:.19*r,rz:.13*r,back:.015},{y:1.02,rx:.165*r,rz:.118*r}],pe=Td(t.pants,c+9,!1);Ve(Gn(ae,{rings:20,seg:32,influence:(I,fe)=>{const $=(1-Yt(.5,.88,fe))*.6*Yt(0,.12,Math.abs(I));return[[ce.hips,1-$],[Ie(I,ce.lHip,ce.rHip),$]]}}),q(pe))}Ve(Gn(P(M,Qe),{rings:36,seg:18,influence:_(ce.lHip,ce.lKnee)}),O),Ve(Gn(P(-M,Qe),{rings:36,seg:18,influence:_(ce.rHip,ce.rKnee)}),O);const z=n?.047:.056*Math.sqrt(r);Ve(Gn([{y:1.55,rx:z*1.05,rz:z*1.02},{y:1.62,rx:z,rz:z*.98,cz:.004},{y:1.7,rx:z*.95,rz:z*.95,cz:.012}],{rings:10,seg:16,influence:(ae,pe)=>{const I=1-Yt(1.55,1.6,pe),fe=Yt(1.63,1.7,pe);return[[ce.chest,I],[ce.neck,Math.max(0,1-I-fe)],[ce.head,fe]]}}),Je);const Y=u(new Ut({color:t.shirt,roughness:.6}));if(m!=="tshirt"){Ve(Gn([{y:1.555,rx:z+.018,rz:z+.016},{y:1.58,rx:z+.014,rz:z+.013},{y:1.61,rx:z+.01,rz:z+.01}],{rings:3,seg:24,influence:(ae,pe)=>[[ce.chest,1-Yt(1.56,1.62,pe)*.6],[ce.neck,Yt(1.56,1.62,pe)*.6]]}),Y);for(const ae of[-1,1]){const pe=xi(new ti(.022,.05,3),Y,[ae*.028,.06,z+.022],[Math.PI-.25,0,ae*.5],[1,1,.3]);w.add(pe)}if(v!==null){const ae=u(new Ut({color:v,roughness:.4}));w.add(xi(new wn(.032,.03,.02,2,.008),ae,[0,.052,z+.026],[.25,0,0]))}}const de=(n?.88:1)*(.9+.1*t.build),ye=Ld(Je,de),Z=Ld(Je,de);for(const ae of hp){D.add(ye[ae]);const pe=Z[ae];pe.scale.x=-1,N.add(pe)}const ne=u(new Ks({color:t.shoes??1315860,roughness:.28,clearcoat:.9,clearcoatRoughness:.18})),Se=u(new Ut({color:723723,roughness:.7}));se.add(Id(ne,Se,n)),J.add(Id(ne,Se,n));const Fe=new lt;Fe.position.set(0,.14,0),A.add(Fe);const _e=.13*(t.head??1);let ve=null;if(e.photo)TM(Fe,e.photo,t,Je,u,h,c);else if(e.face){const ae=new Ah({map:e.face,transparent:!0,alphaTest:.06,toneMapped:!1,depthWrite:!0});ve=new Uf(ae);const pe=t.head??1;ve.scale.set(.44*pe,.55*pe,1),ve.position.set(0,.02,.03),Fe.add(ve)}else CM(Fe,t,_e,Je,u,h,c);for(const ae of f)ae.envMapIntensity=1.6;p.scale.setScalar(t.height);const De={root:p,pivot:g,hips:b,spine:S,chest:w,neck:x,head:A,lSh:C,lEl:R,rSh:B,rEl:k,lHand:D,rHand:N,lHip:G,lKnee:H,rHip:V,rKnee:j,lFoot:se,rFoot:J,materials:f,headRadius:_e,def:s,faceSprite:ve,headMount:Fe,hands:{l:ye,r:Z},disposables:h};return Pd(De,"l","fist"),Pd(De,"r","fist"),De}function dp(s){s.root.traverse(e=>{const t=e;t.isMesh&&t.geometry.dispose()}),s.faceSprite?.material?.dispose();for(const e of s.materials)e.dispose();for(const e of s.disposables)e.dispose()}const Eo=["hips","spine","chest","neck","head","lSh","lEl","rSh","rEl","lHip","lKnee","rHip","rKnee"],zr=Eo.length*3+3,vi=Eo.length*3,io=vi+1,fp=vi+2,at=Object.fromEntries(Eo.map((s,e)=>[s,e*3])),Mn=1,Vn=2,en=Math.PI*2;function Nt(s,e){const t=e?new Float32Array(e):new Float32Array(zr);return Eo.forEach((i,n)=>{const r=s[i];r&&(t[n*3]=r[0],t[n*3+1]=r[1],t[n*3+2]=r[2])}),s.hipY!==void 0&&(t[vi]=s.hipY),s.pivotX!==void 0&&(t[io]=s.pivotX),s.pivotZ!==void 0&&(t[fp]=s.pivotZ),t}function bi(s,e,t,i){for(let n=0;n<zr;n++)s[n]=e[n]+(t[n]-e[n])*i;return s}const cs=s=>s<=0?0:s>=1?1:s,Zi=s=>{const e=cs(s);return e*e*(3-2*e)},Yc=s=>1-(1-cs(s))**3,Ke=Nt({hipY:-.08,hips:[0,-.4,0],spine:[.12,-.08,0],chest:[.06,-.04,0],lSh:[-1.2,0,.28],lEl:[-1.9,0,0],rSh:[-.85,0,-.32],rEl:[-2.2,0,0],lHip:[-.35,.3,.05],lKnee:[.5,0,0],rHip:[.25,.3,-.06],rKnee:[.42,0,0]}),Hr=Nt({lSh:[.05,0,.12],lEl:[-.25,0,0],rSh:[.05,0,-.12],rEl:[-.25,0,0],lHip:[0,0,.04],rHip:[0,0,-.04]}),yi=Nt({hipY:-.42,hips:[0,-.3,0],spine:[.42,-.08,0],head:[-.35,0,0],lSh:[-1,0,.3],rSh:[-.75,0,-.3],lHip:[-1.25,.25,.12],lKnee:[2.1,0,0],rHip:[-.55,.25,-.15],rKnee:[2.2,0,0]},Ke),kM=Nt({hipY:-.06,hips:[0,0,0],spine:[.5,0,0],chest:[.1,0,0],head:[-.45,0,0],lSh:[-.6,0,.15],lEl:[-1.6,0,0],rSh:[-.6,0,-.15],rEl:[-1.6,0,0]},Ke),hs=Nt({hipY:0,hips:[0,0,0],spine:[.25,0,0],head:[-.2,0,0],lSh:[-1.4,0,.45],lEl:[-1.3,0,0],rSh:[-1,0,-.45],rEl:[-1.6,0,0],lHip:[-1.35,0,.1],lKnee:[2,0,0],rHip:[-.75,0,-.1],rKnee:[1.7,0,0]},Ke),UM=Nt({hipY:0,spine:[.05,0,0],lSh:[-2.2,0,.3],lEl:[-.8,0,0],rSh:[-.4,0,-.5],rEl:[-1,0,0],lHip:[-.3,0,.05],lKnee:[.6,0,0],rHip:[.1,0,-.05],rKnee:[.4,0,0]},Ke),wl=Nt({hipY:-.12,spine:[.22,-.05,0],head:[.25,0,0],lSh:[-1.4,0,.08],lEl:[-2.3,0,0],rSh:[-1.3,0,-.08],rEl:[-2.35,0,0]},Ke),Dd=Nt({lSh:[-1.3,0,.05],lEl:[-2.3,0,0],rSh:[-1.2,0,-.05],rEl:[-2.35,0,0],head:[.2,0,0]},yi),kd=Nt({hipY:-.06,spine:[-.38,.25,.1],chest:[-.22,0,0],head:[-.6,0,.15],lSh:[-.45,0,.85],lEl:[-.8,0,0],rSh:[-.3,0,-.75],rEl:[-.7,0,0]},Ke),Ud=Nt({hipY:-.16,hips:[0,-.15,0],spine:[.7,0,0],chest:[.25,0,0],head:[.25,0,0],lSh:[-.55,0,.1],lEl:[-1.9,0,0],rSh:[-.45,0,-.1],rEl:[-1.9,0,0]},Ke),FM=Nt({hipY:-.24,spine:[.35,0,.18],chest:[.15,0,0],head:[.25,0,0],lSh:[-.7,0,.3],lEl:[-1.6,0,0],rSh:[-.6,0,-.35],rEl:[-1.5,0,0]},Ke),Tr=Nt({hipY:-.8,pivotX:-Math.PI/2,hips:[0,0,0],spine:[0,0,0],chest:[0,0,0],head:[.25,0,0],lSh:[-.2,0,1.3],lEl:[-.4,0,0],rSh:[-.3,0,-1.2],rEl:[-.6,0,0],lHip:[-.35,0,.12],lKnee:[.6,0,0],rHip:[-.1,0,-.1],rKnee:[.2,0,0]}),NM=Nt({hipY:0,pivotX:-.9,spine:[-.25,0,0],head:[-.45,0,0],lSh:[-2.1,0,1.1],lEl:[-.4,0,0],rSh:[-1.9,0,-1.1],rEl:[-.5,0,0],lHip:[-.9,0,.12],lKnee:[1.3,0,0],rHip:[-.35,0,-.12],rKnee:[.7,0,0]}),BM=Nt({hipY:0,pivotX:-.12,spine:[-.2,0,.1],chest:[-.1,0,0],head:[.35,0,-.2],lSh:[-.35,0,1.45],lEl:[-.35,0,0],rSh:[-.25,0,-1.35],rEl:[-.45,0,0],lHip:[-.35,0,.18],lKnee:[.55,0,0],rHip:[-.15,0,-.14],rKnee:[.3,0,0]}),OM=Nt({hipY:-.5,hips:[0,0,0],spine:[.55,0,.2],chest:[.2,0,0],head:[.55,0,.3],lSh:[.25,0,.18],lEl:[-.3,0,0],rSh:[.3,0,-.14],rEl:[-.25,0,0],lHip:[-1.45,0,.12],lKnee:[1.45,0,0],rHip:[.05,0,-.1],rKnee:[1.6,0,0]}),Oa=[Nt({head:[-.35,0,0],spine:[-.1,0,0],lSh:[-2.9,0,.35],lEl:[-.2,0,0],rSh:[-2.9,0,-.35],rEl:[-.2,0,0],lHip:[0,0,.12],rHip:[0,0,-.12],lKnee:[0,0,0],rKnee:[0,0,0]},Hr),Nt({head:[-.2,0,0],rSh:[-2.8,0,-.1],rEl:[-.5,0,0],lSh:[.35,0,.55],lEl:[-2,0,0],lHip:[0,0,.1],rHip:[0,0,-.1]},Hr),Nt({spine:[-.15,0,0],head:[-.2,0,0],lSh:[.35,0,.6],lEl:[-2,0,0],rSh:[.35,0,-.6],rEl:[-2,0,0],lHip:[0,0,.14],rHip:[0,0,-.14]},Hr)],Fd=Nt({rSh:[-1.55,0,-.1],rEl:[-.05,0,0],lSh:[.35,0,.6],lEl:[-2,0,0],spine:[0,.2,0]},Hr),zM=Nt({hipY:-.1,spine:[.15,0,0],lSh:[.1,0,.3],lEl:[-.4,0,0],rSh:[.1,0,-.3],rEl:[-.4,0,0]},Ke),HM=Nt({hipY:0,pivotX:-.45,head:[-.4,0,0],lSh:[-2.4,0,.8],lEl:[-.6,0,0],rSh:[-2.2,0,-.8],rEl:[-.6,0,0],lHip:[-.8,0,.1],lKnee:[1,0,0],rHip:[-.2,0,0],rKnee:[.6,0,0]},Ke),et=(s,e,t,i={})=>({base:s,windup:Nt(e,s),strike:Nt(t,s),...i}),El={spine:[.16,-.55,0],chest:[.05,-.12,0],lSh:[-1.57,0,.05],lEl:[-.05,0,0],rSh:[-.85,0,-.32],rEl:[-2.2,0,0]},$c={hips:[0,.2,0],spine:[.22,.5,0],chest:[.05,.12,0],rSh:[-1.6,0,-.05],rEl:[-.05,0,0],lSh:[-.95,0,.35],lEl:[-2.1,0,0]},Tl={hipY:0,hips:[0,.35,0],spine:[-.25,.4,0],rSh:[-3,0,-.15],rEl:[-.25,0,0],lSh:[-.4,0,.5],lEl:[-1.3,0,0]},Cl={hipY:-.1,hips:[0,.1,0],spine:[.12,.25,0],lSh:[-1.55,-.2,-.1],lEl:[-.1,0,0],rSh:[-1.55,.2,.1],rEl:[-.1,0,0]},GM={hips:[0,1,0],spine:[-.35,.2,.45],rHip:[-1.7,0,-.8],rKnee:[.08,0,0],lHip:[.05,.4,0],lKnee:[.2,0,0],lSh:[-.5,0,.9],rSh:[-.3,0,-.6]},Pl={jab:et(Ke,{spine:[.12,-.15,0],lSh:[-1.05,0,.35],lEl:[-2,0,0]},El,{step:.06}),jab2:et(Ke,{lSh:[-1.1,0,.3],lEl:[-1.6,0,0]},{...El,hipY:-.1,spine:[.22,-.5,0]},{step:.1}),straight:et(Ke,{spine:[.1,-.35,0],rSh:[-.7,0,-.4],rEl:[-2.2,0,0]},$c,{step:.1,rear:.05}),hook:et(Ke,{spine:[.1,.35,0],lSh:[-1.1,0,1],lEl:[-1.5,0,0]},{hips:[0,-.6,0],spine:[.15,-.6,0],lSh:[-1.55,0,.55],lEl:[-1.35,0,0],rSh:[-.8,0,-.3],rEl:[-2.2,0,0]},{step:.05}),midKick:et(Ke,{hipY:-.02,spine:[-.05,-.2,0],lHip:[-1.3,0,.1],lKnee:[1.9,0,0]},{hips:[0,-.15,0],spine:[-.25,-.1,0],lHip:[-1.55,0,.05],lKnee:[.08,0,0],rHip:[.1,.2,0],rKnee:[.2,0,0],lSh:[-.9,0,.5],rSh:[-.9,0,-.4]},{fk:"l"}),highKick:et(Ke,{hips:[0,.4,0],spine:[-.1,.1,0],rHip:[-.9,0,-.35],rKnee:[1.9,0,0]},GM,{fk:"r"}),kick2:et(Ke,{hips:[0,.8,0],rHip:[-1.1,0,-.3],rKnee:[2.1,0,0]},{hips:[0,1.3,0],spine:[-.2,.2,.55],rHip:[-1.4,0,-.9],rKnee:[.05,0,0],lHip:[.1,.3,.05],lKnee:[.25,0,0],lSh:[-.6,0,.6],rSh:[-.5,0,-.3]},{fk:"r"}),dfJab:et(Ke,{hipY:-.12,lSh:[-1,0,.3],lEl:[-1.9,0,0]},{hipY:-.2,spine:[.4,-.45,0],lSh:[-1.3,0,.05],lEl:[-.05,0,0]},{step:.12}),launcher:et(Ke,{hipY:-.3,spine:[.45,.05,0],rSh:[.25,0,-.2],rEl:[-1.7,0,0],lSh:[-1.2,0,.3]},Tl,{step:.12,rear:.06}),frontKick:et(Ke,{spine:[-.1,0,0],lHip:[-1.4,0,0],lKnee:[2,0,0]},{spine:[-.3,0,0],lHip:[-1.6,0,0],lKnee:[.05,0,0],lSh:[-.8,0,.5],rSh:[-.8,0,-.5]},{fk:"l"}),power:et(Ke,{hipY:-.12,hips:[0,-.5,0],spine:[.2,-.4,0],rSh:[-.5,0,-.4],rEl:[-2.2,0,0]},{hipY:-.16,hips:[0,.45,0],spine:[.35,.55,0],chest:[.1,.1,0],rSh:[-1.6,0,0],rEl:[-.02,0,0],lSh:[-.7,0,.5],lEl:[-2,0,0]},{step:.3,rear:.12}),knee:et(Ke,{lSh:[-1.6,0,.2],rSh:[-1.6,0,-.2],lEl:[-.8,0,0],rEl:[-.8,0,0]},{spine:[.15,0,0],rHip:[-2,0,0],rKnee:[2.4,0,0],lHip:[.1,0,0],lKnee:[.2,0,0],lSh:[-1,0,.25],rSh:[-1,0,-.25],lEl:[-1.4,0,0],rEl:[-1.4,0,0]},{fk:"r"}),elbow:et(Ke,{spine:[.1,.3,0],lSh:[-1.3,0,.9],lEl:[-2.4,0,0]},{hips:[0,-.6,0],spine:[.2,-.5,0],lSh:[-1.55,0,.6],lEl:[-2.5,0,0]},{step:.12}),bHook:et(Ke,{spine:[.1,-.6,0],rSh:[-1,0,-1.1],rEl:[-1.4,0,0]},{hips:[0,.55,0],spine:[.2,.65,0],rSh:[-1.55,0,-.5],rEl:[-1.4,0,0],lSh:[-.9,0,.3],lEl:[-2.1,0,0]},{step:.1,rear:.06}),spinBack:et(Ke,{hips:[0,-.8,0],spine:[.1,-.3,0],rHip:[-.6,0,-.4],rKnee:[1.6,0,0]},{spine:[-.3,0,.4],rHip:[-1.6,0,-1],rKnee:[.05,0,0],lHip:[0,0,.05],lKnee:[.15,0,0],lSh:[-.4,0,1.2],rSh:[-.3,0,-1]},{fk:"r",spin:-en}),dJab:et(yi,{lSh:[-1,0,.35],lEl:[-2,0,0]},{spine:[.35,-.45,0],lSh:[-1.5,0,.05],lEl:[-.05,0,0]}),dStraight:et(yi,{spine:[.35,-.3,0],rSh:[-.8,0,-.3],rEl:[-2.1,0,0]},{hips:[0,.1,0],spine:[.35,.45,0],rSh:[-1.5,0,-.05],rEl:[-.05,0,0]}),lowKick:et(yi,{lHip:[-1,0,.3],lKnee:[1.8,0,0]},{hipY:-.38,spine:[.1,-.2,0],lHip:[-1.1,0,.35],lKnee:[.1,0,0]},{fk:"l"}),shin:et(Ke,{hips:[0,.4,0],rHip:[-.4,0,-.2],rKnee:[1.2,0,0]},{hips:[0,.8,0],spine:[-.15,.1,.2],rHip:[-.75,0,-.55],rKnee:[.1,0,0]},{fk:"r"}),sweep:et(yi,{hipY:-.5,hips:[0,-.6,0],lHip:[-1,0,.3],lKnee:[1.6,0,0]},{hipY:-.55,spine:[.55,0,0],hips:[0,.4,0],lHip:[-1.45,0,.7],lKnee:[.05,0,0],rHip:[-1.3,0,-.2],rKnee:[2.4,0,0],lSh:[-.2,0,1],rSh:[-.4,0,-1.2]},{fk:"both",spin:-en}),ufKnee:et(Ke,{hipY:-.2,spine:[.2,0,0],lSh:[-1.6,0,.3],rSh:[-1.6,0,-.3]},{hipY:.1,spine:[-.2,0,0],rHip:[-2.1,0,0],rKnee:[2.5,0,0],lHip:[-.3,0,.1],lKnee:[1.4,0,0],lSh:[-2.6,0,.5],rSh:[-2.4,0,-.5],lEl:[-.8,0,0],rEl:[-.8,0,0]},{fk:"both"}),wsUpper:et(yi,{hipY:-.35,rSh:[.2,0,-.2],rEl:[-1.6,0,0]},Tl,{step:.08}),wsKick:et(yi,{rHip:[-1.3,0,-.1],rKnee:[2.2,0,0]},{hipY:-.02,spine:[-.25,0,0],rHip:[-1.7,0,-.15],rKnee:[.08,0,0],lSh:[-.7,0,.6],rSh:[-.6,0,-.6]},{fk:"r"}),dashPunch:et(Ke,{hipY:-.15,spine:[.45,-.4,0],rSh:[-.4,0,-.4],rEl:[-2.2,0,0]},{hipY:-.18,hips:[0,.45,0],spine:[.45,.55,0],rSh:[-1.65,0,0],rEl:[-.02,0,0],lSh:[-.5,0,.6],lEl:[-1.9,0,0]},{step:.35,rear:.2}),jPunch:et(hs,{spine:[-.2,0,0],rSh:[-2.8,0,-.2],rEl:[-.6,0,0]},{spine:[.45,.3,0],rSh:[-1.2,0,-.1],rEl:[-.1,0,0]},{fk:"both"}),jKick:et(hs,{lHip:[-1.3,0,.1],lKnee:[1.8,0,0]},{spine:[-.3,0,0],lHip:[-1.3,0,.1],lKnee:[.05,0,0],rHip:[.2,0,0],rKnee:[1.2,0,0]},{fk:"both"}),throw:et(Ke,{lSh:[-1.35,0,.45],rSh:[-1.35,0,-.45],lEl:[-.4,0,0],rEl:[-.4,0,0]},{spine:[.25,0,0],lSh:[-1.55,0,.12],rSh:[-1.55,0,-.12],lEl:[-.5,0,0],rEl:[-.5,0,0]},{step:.15}),throwExec:et(Ke,{lSh:[-1.5,0,.12],rSh:[-1.5,0,-.12],lEl:[-.6,0,0],rEl:[-.6,0,0]},{hips:[0,-1.1,0],spine:[.3,-.5,0],lSh:[-1.8,0,.6],rSh:[-1.2,0,-.9],lEl:[-.2,0,0],rEl:[-.3,0,0]}),grab:et(Ke,{spine:[.1,0,0],lSh:[-1.2,0,.7],rSh:[-1.2,0,-.7],lEl:[-.3,0,0],rEl:[-.3,0,0]},{hipY:-.12,spine:[.4,0,0],lSh:[-1.55,0,.1],rSh:[-1.55,0,-.1],lEl:[-.3,0,0],rEl:[-.3,0,0]},{step:.2}),grabExec:et(Ke,{spine:[-.25,0,0],lSh:[-2.8,0,.4],rSh:[-2.8,0,-.4],lEl:[-.4,0,0],rEl:[-.4,0,0]},{hipY:-.25,spine:[.6,0,0],lSh:[-1.2,0,.3],rSh:[-1.2,0,-.3],lEl:[-.2,0,0],rEl:[-.2,0,0]}),cast:et(Ke,{hipY:-.12,hips:[0,-.7,0],spine:[0,-.3,0],rSh:[.4,0,-.3],rEl:[-1.6,0,0],lSh:[.3,0,.1],lEl:[-1.7,0,0]},Cl,{step:.12}),charge:et(Ke,{hipY:-.2,spine:[.3,0,0]},{hipY:-.12,spine:[.65,-.35,0],lSh:[-1.2,0,.1],lEl:[-1.9,0,0],rSh:[-.3,0,-.3],rEl:[-1.2,0,0]},{step:.2,rear:.1}),uppercut:et(Ke,{hipY:-.3,spine:[.3,0,0],rSh:[.2,0,-.2],rEl:[-1.6,0,0]},Tl,{step:.1}),counterStance:et(Ke,{hipY:-.1},{hipY:-.12,spine:[-.15,.25,0],lSh:[-1.5,0,.7],lEl:[-1.3,0,0],rSh:[-.2,0,-.9],rEl:[-1,0,0]}),counterStrike:et(Ke,{hipY:-.15,spine:[-.1,-.4,0]},{...Cl,spine:[.35,.3,0]},{step:.15}),powerup:et(Ke,{hipY:-.2,spine:[.4,0,0],lSh:[-.5,0,.1],rSh:[-.5,0,-.1],lEl:[-2.2,0,0],rEl:[-2.2,0,0]},{hipY:0,spine:[-.3,0,0],head:[-.4,0,0],lSh:[-.4,0,1.4],rSh:[-.4,0,-1.4],lEl:[-.3,0,0],rEl:[-.3,0,0]}),vanish:et(yi,{lSh:[-1.6,.6,.2],rSh:[-1.6,-.6,-.2],lEl:[-1.4,0,0],rEl:[-1.4,0,0]},{hipY:-.1,lSh:[-2.6,0,.6],rSh:[-2.6,0,-.6],lEl:[-.3,0,0],rEl:[-.3,0,0]}),stomp:et(Ke,{hipY:0,lHip:[-1.6,0,0],lKnee:[1.9,0,0],lSh:[-2.4,0,.5],rSh:[-2.4,0,-.5]},{hipY:-.32,spine:[.55,0,0],lHip:[-.8,0,0],lKnee:[.8,0,0],rSh:[-.9,0,-.3],rEl:[-.1,0,0],lSh:[-.9,0,.3],lEl:[-.1,0,0]},{fk:"l"}),diveKick:et(hs,{lHip:[-1.2,0,.1],lKnee:[1.9,0,0]},{spine:[-.2,0,0],lHip:[-.9,0,.1],lKnee:[.05,0,0],rHip:[-.8,0,0],rKnee:[1.8,0,0],lSh:[.6,0,.5],rSh:[.6,0,-.5],lEl:[-.4,0,0],rEl:[-.4,0,0]},{fk:"both"}),place:et(yi,{rSh:[-.6,0,-.2],rEl:[-1.4,0,0]},{spine:[.55,0,0],rSh:[-.95,0,-.1],rEl:[-.25,0,0]}),beam:et(Ke,{hipY:-.12,hips:[0,-.6,0],rSh:[.4,0,-.3],rEl:[-1.6,0,0],lSh:[.3,0,.1],lEl:[-1.7,0,0]},{...Cl,spine:[.05,.1,0]},{step:.1}),whip:et(Ke,{spine:[-.2,-.45,0],rSh:[-2.6,0,-.9],rEl:[-.6,0,0]},{spine:[.3,.45,0],rSh:[-1.55,0,-.1],rEl:[0,0,0]},{step:.1}),slamRise:et(hs,{lSh:[-2.8,0,.4],rSh:[-2.8,0,-.4],lEl:[-.3,0,0],rEl:[-.3,0,0]},{spine:[.5,0,0],lSh:[-1.3,0,.2],rSh:[-1.3,0,-.2],lEl:[-.2,0,0],rEl:[-.2,0,0],lHip:[-1,0,.1],lKnee:[1.1,0,0]},{fk:"both"}),summon:et(Ke,{hipY:-.15,lSh:[-.6,0,.3],rSh:[-.6,0,-.3],lEl:[-1.8,0,0],rEl:[-1.8,0,0]},{hipY:0,spine:[-.25,0,0],head:[-.55,0,0],lSh:[-2.8,0,.6],rSh:[-2.8,0,-.6],lEl:[-.2,0,0],rEl:[-.2,0,0]}),guardUp:et(Ke,{hipY:-.1},{hipY:-.14,spine:[.1,0,0],lSh:[-1.5,0,-.25],lEl:[-1,0,0],rSh:[-1.45,0,.25],rEl:[-1,0,0]}),spinKick:et(hs,{rHip:[-1.2,0,-.5],rKnee:[1.5,0,0]},{spine:[-.1,0,0],rHip:[-1.55,0,-.95],rKnee:[.1,0,0],lHip:[-.4,0,0],lKnee:[1.2,0,0],lSh:[-.4,0,1.3],rSh:[-.4,0,-1.3],lEl:[-.2,0,0],rEl:[-.2,0,0]},{fk:"both"}),flurry:et(Ke,{lSh:[-1,0,.35],lEl:[-2,0,0]},El,{step:.08}),ultCombo:et(Ke,{spine:[.05,-.4,0],rSh:[-.6,0,-.45],rEl:[-2.2,0,0]},$c,{step:.12}),taunt:et(Ke,{},{})},VM=Nt($c,Ke),Nd=["straight","highKick","jab","uppercut","power","midKick","bHook","launcher"];function Bd(s,e,t,i,n,r){if(t<=i){const l=i>0?t/i:1;if(l<.55)return bi(s,e.base,e.windup,Zi(l/.55)),0;const c=Yc((l-.55)/.45);return bi(s,e.windup,e.strike,c),c}if(t<=i+n)return s.set(e.strike),1;const a=r>0?(t-i-n)/r:1,o=Zi((a-.12)/.88);return bi(s,e.strike,e.base,o),1-o}const Cr=qc,zs=Kc,Od=new rt,pp=new rt,mp=new un,Rl=new un,zd=new un,as=new L,za=new L,WM=new L(0,1,0),XM=new un;function Hd(s){for(;s>Math.PI;)s-=en;for(;s<-Math.PI;)s+=en;return s}function Gd(s,e,t,i,n,r){if(n<=.001){t.quaternion.identity();return}as.copy(i).applyMatrix4(pp).sub(s.position);let a=as.length();const o=Cr+zs-.002;a>o?(as.multiplyScalar(o/a),a=o):a<.2&&(as.multiplyScalar(.2/Math.max(1e-4,a)),a=.2);const l=Math.max(-1,Math.min(1,(a*a-Cr*Cr-zs*zs)/(2*Cr*zs))),c=Math.acos(l),h=Math.max(.05,Cr+zs*l),f=Math.asin(Math.max(-1,Math.min(1,as.x/h))),u=-h*Math.cos(f),d=-zs*Math.sin(c),m=Hd(Math.atan2(as.z,as.y)-Math.atan2(d,u)),v=s.rotation;s.rotation.set(v.x+Hd(m-v.x)*n,v.y*(1-n),v.z+(f-v.z)*n),e.rotation.set(e.rotation.x+(c-e.rotation.x)*n,0,0),Rl.copy(mp).multiply(s.quaternion).multiply(e.quaternion).invert(),zd.setFromAxisAngle(WM,r),Rl.multiply(zd),t.quaternion.copy(XM).slerp(Rl,n)}class gp{cur=new Float32Array(Ke);vel=new Float32Array(zr);target=new Float32Array(zr);hidden=!1;ikL=1;ikR=1;spin=0;roll=0;gaitPhase=0;gaitW=0;gaitOff=new Float32Array(6);stepOff=new Float32Array(2);prevState="";prevFrame=0;lastHurt=Number.NaN;reset(){this.cur.set(Ke),this.vel.fill(0),this.spin=0,this.roll=0,this.gaitW=0,this.ikL=this.ikR=1}get pivotX(){return this.cur[io]}get headRoll(){return this.cur[at.head+Vn]+this.cur[at.spine+Vn]}update(e,t,i){const n=this.target,r=this.vel,a=t.ticks/60;let o=[280,.85],l=1,c=1,h=!0,f=0,u=0,d=0,m=0,v=0,p=0;this.hidden=!1;const g=e.state!==this.prevState||e.stateFrame<this.prevFrame;if(Number.isNaN(this.lastHurt)&&(this.lastHurt=e.lastHurtFrame),e.lastHurtFrame!==this.lastHurt&&e.state!=="blockstun"){this.lastHurt=e.lastHurtFrame;const S=e.lastHitHeavy?1.6:1,w=Math.random()<.5?-1:1;e.state==="hitstun"&&!e.hitHigh?(r[at.spine]+=9*S,r[at.head]+=7*S,r[vi]-=1.2*S):(r[at.spine]-=8*S,r[at.chest]-=4*S,r[at.head]-=14*S,r[at.spine+Vn]+=w*3*S,r[at.head+Vn]+=w*5*S)}switch(e.state==="blockstun"&&g&&(r[at.spine]-=3,r[at.lSh]-=2,r[at.rSh]-=2,r[vi]-=.5),e.state){case"intro":n.set(Fd),n[vi]+=Math.sin(a*2)*.01,o=[200,.9];break;case"idle":case"jumpSquat":case"land":{const S=Math.sin(a*3.4+e.index*1.3)*.5+.5;n.set(e.guarding?wl:Ke),n[vi]-=S*.024,n[at.spine]+=S*.04,n[at.lSh]+=S*.05,n[at.rSh]-=S*.03,e.state!=="idle"&&(bi(n,n,yi,.4),o=[700,.8]);break}case"walkF":case"walkB":n.set(e.guarding?wl:Ke),d=.26,m=.07,n[vi]-=.018*(.5-.5*Math.cos(this.gaitPhase*en*2)),o=[320,.85];break;case"crouch":n.set(e.guarding?Dd:yi),o=[520,.8];break;case"dash":n.set(Ke),n[at.spine]+=.28,n[vi]-=.05,d=.42,m=.12,o=[520,.8];break;case"run":{n.set(kM);const S=Math.sin(this.gaitPhase*en);n[at.lSh]+=S*.7,n[at.rSh]-=S*.7,n[at.hips+Mn]+=S*.15,n[vi]-=.03*Math.abs(Math.cos(this.gaitPhase*en)),d=.62,m=.2,o=[520,.8];break}case"backdash":n.set(Ke),n[at.spine]-=.12,n[vi]-=.04,d=.4,m=.12,o=[520,.8];break;case"sidestep":case"sidewalk":{bi(n,Ke,yi,.18);const S=e.sideX*Math.sin(e.yaw)-e.sideZ*Math.cos(e.yaw);n[at.spine+Vn]-=S*.22,d=e.state==="sidestep"?.38:.3,m=.09,o=[520,.8];break}case"air":case"fall":{const S=e.vy>.12;bi(n,S?UM:hs,hs,S?.15:0),e.state==="fall"&&(n[at.spine]+=.2,n[at.lSh]-=.5,n[at.rSh]-=.5),l=c=0,o=[400,.8];break}case"attack":{const S=e.move;if(!S){n.set(Ke);break}o=[2200,.72];const w=Pl[S.anim]??Pl.jab,x=e.moveFrame+1,A=S.startup;let C=0;if(S.anim==="flurry"&&x>A&&x<=A+S.active){const R=Math.floor((x-A)/4)%2===1,D=(x-A)%4/4;bi(n,w.windup,R?VM:w.strike,Zi(D*2)),C=1}else S.anim==="slamRise"?n.set(e.vy>0?w.windup:w.strike):S.anim==="throwExec"||S.anim==="grabExec"?(bi(n,w.windup,w.strike,Zi(x/26)),x>30&&bi(n,w.strike,Ke,Zi((x-30)/14))):C=Bd(n,w,x,A,S.active,S.recovery);S.anim==="spinKick"&&x>A&&x<=A+S.active&&(f=(x-A)*.7),w.spin&&x<=A+S.active&&(f=w.spin*Yc((x-.35*A)/(.65*A+1))),S.anim==="vanish"&&x>=5&&x<=11&&(this.hidden=!0),(w.fk==="l"||w.fk==="both")&&(l=0),(w.fk==="r"||w.fk==="both")&&(c=0),v=(w.step??0)*C,p=(w.rear??0)*C,d=.34,m=.05;break}case"hitstun":{const S=e.hitHigh?kd:e.isCrouching?FM:Ud;bi(n,S,Ke,Zi(1-e.stun/8)),o=[700,.5];break}case"blockstun":n.set(e.isCrouching?Dd:wl),o=[900,.55];break;case"juggle":{n.set(NM),n[io]=-(.7+cs((.1-e.vy)/.2)*.8),e.vy<0&&e.y<.7&&bi(n,n,Tr,cs((.7-e.y)/.7)*.6),l=c=0,h=!1,u=null,o=[260,.7];break}case"thrown":n.set(HM),l=c=0,h=!1,o=[400,.8];break;case"knockdown":case"ko":n.set(Tr),n[at.spine]+=Math.sin(a*2.2)*.02,l=c=0,h=!1,o=[220,.55];break;case"getup":{const S=cs(e.stateFrame/vf);S<.5?bi(n,Tr,yi,Zi(S*2)):bi(n,yi,Ke,Zi((S-.5)*2)),l=c=cs((S-.45)*2),h=S>.4,o=[900,.85];break}case"techroll":{const S=cs(e.stateFrame/Kl),x=e.sideX*Math.sin(e.yaw)-e.sideZ*Math.cos(e.yaw)>=0?1:-1;S<.7?n.set(Tr):bi(n,Tr,yi,Zi((S-.7)/.3)),u=x*en*Yc(S/.7),l=c=S>.8?1:0,h=!1,o=[700,.8];break}case"wallsplat":n.set(BM),n[at.head+Vn]+=Math.sin(a*6)*.1,l=c=0,h=!1,o=[420,.6];break;case"dizzy":e.crumpled?(n.set(OM),l=c=0,o=[160,.7]):(n.set(zM),n[at.head]+=Math.sin(a*7)*.35,n[at.head+Vn]+=Math.sin(a*5)*.35,n[at.spine+Vn]+=Math.sin(a*3.5)*.18);break;case"victory":{const S=Oa[e.victoryVariant%Oa.length];n.set(S),e.victoryVariant%3===1&&(n[at.rSh]+=Math.sin(a*9)*.25),e.victoryVariant%3===2&&(n[at.head]+=Math.sin(a*4)*.12),n[vi]+=Math.abs(Math.sin(a*3))*.02,l=c=0,o=[150,.9];break}case"cinematic":{const S=t.cinematic;if(S&&S.att===e){const w=Math.floor(e.stateFrame/11)%Nd.length,x=Pl[Nd[w]],A=Bd(n,x,e.stateFrame%11+1,6,2,3);(x.fk==="l"||x.fk==="both")&&(l=0),(x.fk==="r"||x.fk==="both")&&(c=0),v=(x.step??0)*A,p=(x.rear??0)*A,o=[2e3,.7]}else{const w=Math.floor(e.stateFrame/11)%2===0;n.set(w?kd:Ud),e.stateFrame%11===7&&(r[at.head]+=w?-12:10),o=[800,.5]}break}}if(h&&(n[at.head+Mn]=-(n[at.hips+Mn]+n[at.spine+Mn]+n[at.chest+Mn])*.9),this.spin=f!==0?f:this.spin*.8,u===null)this.roll=e.spin;else if(u!==0)this.roll=u;else{const S=Math.round(this.roll/en)*en;this.roll=S+(this.roll-S)*Math.exp(-i*10),Math.abs(this.roll-S)<.01&&(this.roll=0)}e.grounded||(l=c=0);const y=d>0&&e.grounded&&this.gait(e,i,d,m);this.gaitW+=((y?1:0)-this.gaitW)*(1-Math.exp(-i*14));const E=1-Math.exp(-i*22);this.stepOff[0]+=(v-this.stepOff[0])*E,this.stepOff[1]+=(p-this.stepOff[1])*E;const M=1-Math.exp(-i*18);this.ikL+=(l-this.ikL)*M,this.ikR+=(c-this.ikR)*M,t.hitstop>0||t.freeze>0&&t.freezeOwner!==e||this.integrate(i,o[0],o[1]),this.prevState=e.state,this.prevFrame=e.stateFrame}gait(e,t,i,n){const r=Math.cos(e.yaw),a=Math.sin(e.yaw),o=e.vx*r+e.vz*a,l=e.vx*a-e.vz*r,c=Math.hypot(o,l);if(c<.003)return!1;this.gaitPhase=(this.gaitPhase+c*t*60/(2*i))%1;const h=l/c,f=o/c;for(let u=0;u<2;u++){const d=(this.gaitPhase+u*.5)%1;let m,v=0;if(d<.5)m=.5-d*2;else{const p=(d-.5)*2;m=-.5+Zi(p),v=Math.sin(Math.PI*p)*n}this.gaitOff[u*3]=h*m*i,this.gaitOff[u*3+1]=v,this.gaitOff[u*3+2]=f*m*i}return!0}integrate(e,t,i){const n=2*i*Math.sqrt(t),r=this.cur,a=this.vel,o=this.target;let l=Math.min(e,.05);for(;l>1e-6;){const c=Math.min(l,.008333333333333333);l-=c;for(let h=0;h<zr;h++)a[h]+=(t*(o[h]-r[h])-n*a[h])*c,r[h]+=a[h]*c}}showcase(e,t,i,n=0,r=0){const a=this.target;if(i==="victory")a.set(Oa[n%Oa.length]),n%3===1&&(a[at.rSh]+=Math.sin(t*9+r)*.25),a[vi]+=Math.abs(Math.sin(t*3+r))*.02,this.ikL=this.ikR=0;else if(i==="intro")a.set(Fd),this.ikL=this.ikR=1;else{const o=Math.sin(t*3.4+r)*.5+.5;a.set(Ke),a[vi]-=o*.024,a[at.spine]+=o*.04,this.ikL=this.ikR=1}a[at.head+Mn]=-(a[at.hips+Mn]+a[at.spine+Mn]+a[at.chest+Mn])*.9,this.hidden=!1,this.spin*=.8,this.roll=0,this.gaitW=0,this.stepOff.fill(0),this.integrate(e,200,.9)}apply(e){const t=this.cur,i=[e.hips,e.spine,e.chest,e.neck,e.head,e.lSh,e.lEl,e.rSh,e.rEl,e.lHip,e.lKnee,e.rHip,e.rKnee];for(let o=0;o<i.length;o++)i[o].rotation.set(t[o*3],t[o*3+1],t[o*3+2]);if(e.hips.rotation.y+=this.spin,e.pivot.position.y=cp+t[vi],e.pivot.rotation.set(t[io],this.roll,t[fp]),this.ikL<=.001&&this.ikR<=.001){e.lFoot.quaternion.identity(),e.rFoot.quaternion.identity();return}e.pivot.updateMatrix(),e.hips.updateMatrix(),Od.multiplyMatrices(e.pivot.matrix,e.hips.matrix),pp.copy(Od).invert(),mp.copy(e.pivot.quaternion).multiply(e.hips.quaternion);const n=Math.abs(e.lHip.position.x)+.035,r=this.gaitW,a=this.gaitOff;za.set(n+a[0]*r,Cd+a[1]*r,.19+a[2]*r+this.stepOff[0]),Gd(e.lHip,e.lKnee,e.lFoot,za,this.ikL,.1),za.set(-n+a[3]*r,Cd+a[4]*r,-.2+a[5]*r+this.stepOff[1]),Gd(e.rHip,e.rKnee,e.rFoot,za,this.ikR,-.45)}}function qM(s,e,t=0){const i=Hr,n=new gp;n.cur.set(i),n.ikL=n.ikR=0,n.apply(s)}const Ha=900,Ga=160,zt=new Ft,Hs=new Te,KM=new L(0,0,1),Vd=new L;function YM(){const s=document.createElement("canvas");s.width=s.height=128;const e=s.getContext("2d"),t=e.createRadialGradient(64,64,0,64,64,64);t.addColorStop(0,"rgba(255,255,255,1)"),t.addColorStop(.18,"rgba(255,255,255,0.85)"),t.addColorStop(.45,"rgba(255,255,255,0.25)"),t.addColorStop(1,"rgba(255,255,255,0)"),e.fillStyle=t,e.fillRect(0,0,128,128),e.globalCompositeOperation="lighter";for(const[n,r]of[[128,6],[6,128]]){const a=e.createLinearGradient(64-n/2,64-r/2,64+n/2,64+r/2);a.addColorStop(0,"rgba(255,255,255,0)"),a.addColorStop(.5,"rgba(255,255,255,0.8)"),a.addColorStop(1,"rgba(255,255,255,0)"),e.fillStyle=a,e.fillRect(64-n/2,64-r/2,n,r)}const i=new lr(s);return i.colorSpace=Kt,i}class $M{group=new lt;inst;streakInst;particles=[];streaks=[];rings=[];flashes=[];flares=[];constructor(){const e=new _i({color:16777215,transparent:!0,blending:er,depthWrite:!1,toneMapped:!1});this.inst=new nr(new Ih(1,0),e,Ha),this.inst.instanceMatrix.setUsage(gu),this.inst.frustumCulled=!1;for(let n=0;n<Ha;n++)zt.scale.setScalar(0),zt.updateMatrix(),this.inst.setMatrixAt(n,zt.matrix),this.inst.setColorAt(n,Hs.set(16777215));const t=new Le(1,1,1);t.translate(0,0,.5),this.streakInst=new nr(t,e.clone(),Ga),this.streakInst.instanceMatrix.setUsage(gu),this.streakInst.frustumCulled=!1;for(let n=0;n<Ga;n++)zt.scale.setScalar(0),zt.updateMatrix(),this.streakInst.setMatrixAt(n,zt.matrix),this.streakInst.setColorAt(n,Hs.set(16777215));this.group.add(this.inst,this.streakInst);for(let n=0;n<24;n++){const r=new Ge(new ta(.8,1,48),_t(16777215,1)),a=r.material;a.side=oi,a.toneMapped=!1,r.visible=!1,this.group.add(r),this.rings.push({mesh:r,life:0,max:1,from:0,to:1,active:!1,flat:!1})}for(let n=0;n<12;n++){const r=new Ge(new Oe(1,16,12),_t(16777215,1));r.material.toneMapped=!1,r.visible=!1,this.group.add(r),this.flashes.push({mesh:r,life:0,max:1,from:0,to:1,active:!1,flat:!0})}const i=YM();for(let n=0;n<12;n++){const r=new Uf(new Ah({map:i,color:16777215,blending:er,depthWrite:!1,transparent:!0,toneMapped:!1}));r.visible=!1,this.group.add(r),this.flares.push({mesh:r,life:0,max:1,from:0,to:1,active:!1,flat:!0})}}clear(){this.particles.length=0,this.streaks.length=0;for(const e of[...this.rings,...this.flashes,...this.flares])e.active=!1,e.mesh.visible=!1}burst(e,t,i,n,r,a,o=.05,l=.004,c=30,h=1){for(let f=0;f<r;f++){this.particles.length>=Ha&&this.particles.shift();const u=Math.random()*Math.PI*2,d=Math.acos(2*Math.random()-1),m=a*(.4+Math.random()*.8);this.particles.push({x:e,y:t,z:i,vx:Math.sin(d)*Math.cos(u)*m,vy:Math.cos(d)*m+a*.3,vz:Math.sin(d)*Math.sin(u)*m,life:c*(.6+Math.random()*.6),max:c,size:o*(.6+Math.random()*.8),color:new Te(n),grav:l,drag:.92,glow:h})}}streakBurst(e,t,i,n,r,a,o,l=10){for(let c=0;c<r;c++){this.streaks.length>=Ga&&this.streaks.shift();const h=Math.random()*Math.PI*2,f=Math.acos(2*Math.random()-1);this.streaks.push({x:e,y:t,z:i,dx:Math.sin(f)*Math.cos(h),dy:Math.cos(f),dz:Math.sin(f)*Math.sin(h),speed:a*(.6+Math.random()*.8),len:o*(.5+Math.random()),life:l*(.7+Math.random()*.5),max:l,color:new Te(n).multiplyScalar(2.2)})}}take(e){return e.find(t=>!t.active)??e[0]}ring(e,t,i,n,r,a,o,l=!1,c=1){const h=this.take(this.rings);h.active=!0,h.life=o,h.max=o,h.from=r,h.to=a,h.mesh.visible=!0,h.mesh.position.set(e,t,i),h.flat=l,h.mesh.rotation.set(l?-Math.PI/2:0,0,0),h.mesh.material.color.set(n).multiplyScalar(c)}flash(e,t,i,n,r,a=8,o=1){const l=this.take(this.flashes);l.active=!0,l.life=a,l.max=a,l.from=r*.4,l.to=r,l.mesh.visible=!0,l.mesh.position.set(e,t,i),l.mesh.material.color.set(n).multiplyScalar(o)}flare(e,t,i,n,r,a=10,o=2){const l=this.take(this.flares);l.active=!0,l.life=a,l.max=a,l.from=r*.5,l.to=r,l.mesh.visible=!0,l.mesh.position.set(e,t,i);const c=l.mesh.material;c.color.set(n).multiplyScalar(o),c.rotation=Math.random()*Math.PI}hitSpark(e,t,i,n,r,a){if(r){this.burst(e,t,i,8965375,10,.06,.04,.001,16,1.8),this.ring(e,t,i,10475775,.1,.7,12,!1,1.6),this.flare(e,t,i,10475775,.7,8,1.4);return}const o=a??(n==="super"?16765440:n==="special"?16747008:n==="heavy"?16757575:16773544),l=n==="light"?12:n==="heavy"?22:n==="special"?26:40,c=n==="light"?.07:n==="heavy"?.1:.12;this.burst(e,t,i,o,l,c,n==="light"?.045:.06,.003,22,2.4),this.burst(e,t,i,16777215,Math.round(l/3),c*1.3,.035,.001,12,3),this.streakBurst(e,t,i,o,n==="light"?6:n==="heavy"?12:18,n==="light"?.12:.2,n==="light"?.25:.5,n==="light"?7:11),this.flash(e,t,i,16777215,n==="light"?.28:.45,6,2),this.flare(e,t,i,o,n==="light"?1:n==="super"?2.6:1.8,n==="light"?8:12,2.5),this.ring(e,t,i,o,.1,n==="light"?.6:n==="super"?1.8:1.1,n==="light"?10:16,!1,2)}update(e,t){const i=Math.min(3,e*60),n=this.particles;for(let l=n.length-1;l>=0;l--){const c=n[l];if(c.life-=i,c.life<=0){n.splice(l,1);continue}c.vy-=c.grav*i;const h=Math.pow(c.drag,i);c.vx*=h,c.vy*=h,c.vz*=h,c.x+=c.vx*i,c.y+=c.vy*i,c.z+=c.vz*i,c.y<.02&&(c.y=.02,c.vy*=-.3)}let r=0;for(const l of n){const c=l.life/l.max;zt.position.set(l.x,l.y,l.z),zt.rotation.set(l.life*.3,l.life*.2,0),zt.scale.setScalar(l.size*(.3+c*.9)),zt.updateMatrix(),this.inst.setMatrixAt(r,zt.matrix),Hs.copy(l.color).multiplyScalar((.4+c)*l.glow),this.inst.setColorAt(r,Hs),r++}for(;r<Ha;r++)zt.scale.setScalar(0),zt.updateMatrix(),this.inst.setMatrixAt(r,zt.matrix);this.inst.instanceMatrix.needsUpdate=!0,this.inst.instanceColor&&(this.inst.instanceColor.needsUpdate=!0);const a=this.streaks;for(let l=a.length-1;l>=0;l--){const c=a[l];if(c.life-=i,c.life<=0){a.splice(l,1);continue}c.x+=c.dx*c.speed*i,c.y+=c.dy*c.speed*i,c.z+=c.dz*c.speed*i,c.speed*=Math.pow(.85,i)}let o=0;for(const l of a){const c=l.life/l.max;zt.position.set(l.x,l.y,l.z),Vd.set(l.dx,l.dy,l.dz),zt.quaternion.setFromUnitVectors(KM,Vd),zt.scale.set(.012+.01*c,.012+.01*c,l.len*(.3+c)),zt.updateMatrix(),this.streakInst.setMatrixAt(o,zt.matrix),Hs.copy(l.color).multiplyScalar(c),this.streakInst.setColorAt(o,Hs),o++}for(;o<Ga;o++)zt.scale.setScalar(0),zt.updateMatrix(),this.streakInst.setMatrixAt(o,zt.matrix);this.streakInst.instanceMatrix.needsUpdate=!0,this.streakInst.instanceColor&&(this.streakInst.instanceColor.needsUpdate=!0);for(const l of[...this.rings,...this.flashes,...this.flares]){if(!l.active)continue;if(l.life-=i,l.life<=0){l.active=!1,l.mesh.visible=!1;continue}const c=1-l.life/l.max;!l.flat&&t&&l.mesh.quaternion.copy(t.quaternion),l.mesh.scale.setScalar(l.from+(l.to-l.from)*(1-(1-c)*(1-c))),l.mesh.material.opacity=1-c}}}function Q(s,e,t,i=[0,0,0],n=[0,0,0],r){const a=new Ge(e,typeof t=="number"?Rt(t):t);return a.position.set(...i),a.rotation.set(...n),r&&a.scale.set(...r),a.castShadow=!0,s.add(a),a}function Va(s,e,t,i,n){const r=document.createElement("canvas");r.width=256,r.height=Math.round(256*n/i);const a=r.getContext("2d");a.fillStyle=t,a.fillRect(0,0,r.width,r.height),a.fillStyle=e,a.font=`bold ${Math.round(r.height*.55)}px Arial, sans-serif`,a.textAlign="center",a.textBaseline="middle",a.fillText(s,r.width/2,r.height/2);const o=new lr(r);return o.colorSpace=Kt,new Ge(new Oi(i,n),new _i({map:o,side:oi}))}const Wa=typeof document<"u";function mo(s,e){const t=new lt;switch(s){case"orb":default:Q(t,new Oe(.22,16,12),_t(e,.9)),Q(t,new Oe(.12,12,10),_t(16777215,1));break;case"ballot":{Q(t,new Le(.4,.34,.34),3895256),Q(t,new Le(.2,.02,.06),1118481,[0,.175,0]),Q(t,new Le(.14,.12,.005),16777215,[0,.24,0],[0,0,.1]);break}case"gavel":{Q(t,new $e(.09,.09,.3,12),8014372,[0,.12,0],[0,0,Math.PI/2]),Q(t,new $e(.025,.025,.4,8),10251067,[0,-.08,0]),Q(t,new $e(.1,.1,.03,12),13934674,[.155,.12,0],[0,0,Math.PI/2]),Q(t,new $e(.1,.1,.03,12),13934674,[-.155,.12,0],[0,0,Math.PI/2]);break}case"book":{Q(t,new Le(.36,.46,.1),e),Q(t,new Le(.34,.44,.08),16117984,[.015,0,0]);break}case"paper":{Q(t,new Le(.34,.44,.01),16777215);for(let i=0;i<5;i++)Q(t,new Le(.24,.02,.012),7829367,[0,.14-i*.07,.002]);Q(t,new Le(.1,.06,.014),e,[.08,-.17,.003]);break}case"coin":case"shekel":{if(Q(t,new $e(.22,.22,.05,20),15909198,[0,0,0],[Math.PI/2,0,0]),Q(t,new Vt(.2,.02,6,20),13934615),Wa){const i=Va("₪","#8a6500","rgba(0,0,0,0)",.28,.28);i.material.transparent=!0,i.position.z=.03,t.add(i)}break}case"mic":{if(Q(t,new Oe(.11,12,10),4473924,[.18,0,0]),Q(t,new $e(.04,.05,.3,10),1118481,[0,0,0],[0,0,Math.PI/2]),Wa){const i=Va("NEWS","#ffffff","#"+e.toString(16).padStart(6,"0"),.14,.07);i.position.set(.05,.07,0),t.add(i)}break}case"tv":{Q(t,new Le(.5,.36,.18),2236962),Q(t,new Oi(.42,.28),_t(e,.9),[0,0,.091]),Q(t,new $e(.008,.008,.25,6),10066329,[.08,.28,0],[0,0,-.5]),Q(t,new $e(.008,.008,.25,6),10066329,[-.08,.28,0],[0,0,.5]);break}case"envelope":{Q(t,new Le(.44,.28,.03),16052193),Q(t,new ti(.22,.14,4),14735552,[0,.06,.02],[Math.PI,Math.PI/4,0],[1.4,1,.1]),Q(t,new $e(.035,.035,.02,12),12066084,[0,0,.02],[Math.PI/2,0,0]);break}case"phone":{Q(t,new Le(.22,.42,.04),1710618),Q(t,new Oi(.19,.36),_t(e,1),[0,0,.021]);break}case"bomb":{Q(t,new Oe(.24,18,14),1710618),Q(t,new $e(.06,.06,.08,10),4473924,[0,.26,0]),Q(t,new $e(.012,.012,.12,6),13148266,[.03,.34,0],[0,0,-.4]),Q(t,new Oe(.04,8,6),_t(16755200,1),[.06,.4,0]),Q(t,new Vt(.245,.02,6,24,Math.PI*.9),16720418,[0,0,0],[0,0,-Math.PI*.1]);break}case"plane":{const i=new fo;i.moveTo(.3,0),i.lineTo(-.25,.2),i.lineTo(-.15,0),i.lineTo(-.25,-.2),i.closePath();const n=Q(t,new Dh(i),new Ut({color:16777215,side:oi}));n.rotation.x=Math.PI/2,Q(t,new Le(.5,.02,.02),14540253,[.02,-.03,0]);break}case"jet":{Q(t,new $e(.06,.08,.6,10),8030873,[0,0,0],[0,0,-Math.PI/2]),Q(t,new ti(.06,.18,10),5595243,[.39,0,0],[0,0,-Math.PI/2]),Q(t,new Le(.28,.02,.6),6978185,[-.04,0,0]),Q(t,new Le(.12,.18,.02),6978185,[-.26,.09,0]),Q(t,new Oe(.06,8,6),_t(16750848,.9),[-.33,0,0]);break}case"tomato":{Q(t,new Oe(.2,16,12),14692398,[0,0,0],[0,0,0],[1,.85,1]),Q(t,new ti(.08,.06,5),3115567,[0,.18,0]);break}case"watermelon":{Q(t,new Oe(.26,18,14),2980397,[0,0,0],[0,0,0],[1.25,1,1]);for(let i=0;i<6;i++)Q(t,new Vt(.262,.012,4,24,Math.PI),1789211,[0,0,0],[0,i/6*Math.PI,Math.PI/2],[1,1.25,1]);break}case"brick":{Q(t,new Le(.44,.2,.22),11879983),Q(t,new Le(.46,.02,.24),13616824,[0,.1,0]);break}case"bin":{if(Q(t,new $e(.2,.16,.42,14),2984527),Q(t,new $e(.22,.22,.04,14),2388031,[0,.23,0]),Wa){const i=Va("♻","#ffffff","rgba(0,0,0,0)",.2,.2);i.material.transparent=!0,i.position.set(0,0,.19),t.add(i)}break}case"cone":{Q(t,new ti(.2,.55,14),16743168,[0,.22,0]),Q(t,new $e(.155,.13,.08,14),16777215,[0,.2,0]),Q(t,new Le(.44,.04,.44),16743168,[0,-.04,0]);break}case"train":{Q(t,new Le(.8,.36,.3),e),Q(t,new Le(.82,.12,.31),14606046,[0,.1,0]);for(let i=0;i<3;i++)Q(t,new Le(.16,.1,.32),_t(10477823,.8),[-.25+i*.25,.1,0]);Q(t,new Oe(.19,12,10),e,[.4,-.02,0],[0,0,0],[.6,.9,.8]),Q(t,new Oe(.035,8,6),_t(16777130,1),[.5,-.06,.1]),Q(t,new Oe(.035,8,6),_t(16777130,1),[.5,-.06,-.1]);break}case"tank":{Q(t,new Le(.7,.2,.42),4936480,[0,-.05,0]),Q(t,new Le(.34,.14,.3),5923880,[-.04,.12,0]),Q(t,new $e(.03,.03,.45,8),3818008,[.3,.14,0],[0,0,Math.PI/2]),Q(t,new Le(.76,.12,.1),2236962,[0,-.15,.2]),Q(t,new Le(.76,.12,.1),2236962,[0,-.15,-.2]);break}case"syringe":{Q(t,new $e(.06,.06,.34,12),new Ut({color:15267839,transparent:!0,opacity:.75}),[0,0,0],[0,0,Math.PI/2]),Q(t,new $e(.05,.05,.24,10),_t(e,.9),[.03,0,0],[0,0,Math.PI/2]),Q(t,new $e(.006,.006,.16,6),13421772,[.25,0,0],[0,0,Math.PI/2]),Q(t,new $e(.02,.02,.12,6),10066329,[-.22,0,0],[0,0,Math.PI/2]);break}case"sign":{if(Q(t,new $e(.02,.02,.6,6),10251067,[0,-.22,0]),Q(t,new Le(.5,.34,.02),16777215,[0,.14,0]),Wa){const i=Va("VOTE!","#"+e.toString(16).padStart(6,"0"),"#ffffff",.46,.3);i.position.set(0,.14,.012),t.add(i)}break}case"megaphone":{Q(t,new $e(.2,.06,.4,14,1,!0),new Ut({color:15921906,side:oi}),[.05,0,0],[0,0,-Math.PI/2]),Q(t,new Vt(.2,.02,6,20),e,[.25,0,0],[0,Math.PI/2,0]),Q(t,new Le(.05,.14,.05),3355443,[-.08,-.1,0]);break}case"chalk":{Q(t,new $e(.035,.035,.26,8),16777215,[0,0,0],[0,0,Math.PI/2]),Q(t,new Oe(.12,8,6),_t(16777215,.35),[-.12,0,0]);break}case"scissors":{Q(t,new Le(.4,.04,.02),13621468,[.1,.02,0],[0,0,.2]),Q(t,new Le(.4,.04,.02),13621468,[.1,-.02,.01],[0,0,-.2]),Q(t,new Vt(.06,.018,6,12),e,[-.14,.07,0]),Q(t,new Vt(.06,.018,6,12),e,[-.14,-.07,0]);break}case"tooth":{Q(t,new Oe(.2,14,10),16777215,[0,.06,0],[0,0,0],[1,.8,.9]),Q(t,new ti(.07,.24,8),16053492,[-.08,-.14,0],[Math.PI,0,.2]),Q(t,new ti(.07,.24,8),16053492,[.08,-.14,0],[Math.PI,0,-.2]);break}case"drill":{Q(t,new Le(.22,.14,.12),2792847),Q(t,new Le(.08,.2,.1),2508371,[-.06,-.14,0]),Q(t,new ti(.035,.24,8),13421772,[.22,0,0],[0,0,-Math.PI/2]);break}case"star":{const i=new fo;for(let n=0;n<10;n++){const r=n%2===0?.26:.11,a=n/10*Math.PI*2+Math.PI/2;n===0?i.moveTo(Math.cos(a)*r,Math.sin(a)*r):i.lineTo(Math.cos(a)*r,Math.sin(a)*r)}i.closePath(),Q(t,new Lh(i,{depth:.06,bevelEnabled:!1}),16766474,[0,0,-.03]);break}case"flag":{Q(t,new $e(.015,.015,.7,6),14540253,[-.2,-.1,0]),Q(t,new Le(.42,.28,.01),16777215,[.02,.1,0]),Q(t,new Le(.42,.04,.012),e,[.02,.2,0]),Q(t,new Le(.42,.04,.012),e,[.02,0,0]);break}case"wave":{Q(t,new Vt(.3,.07,8,20,Math.PI),_t(e,.85),[0,-.05,0],[0,Math.PI/2,0]).scale.set(1,1,1.4),Q(t,new Vt(.2,.05,8,16,Math.PI),_t(16777215,.8),[.05,-.05,0],[0,Math.PI/2,0]);break}case"sound":{for(let i=0;i<3;i++)Q(t,new Vt(.12+i*.07,.022,6,20,Math.PI*.8),_t(e,.9-i*.2),[i*.07,0,0],[0,Math.PI/2,Math.PI*.6]);break}case"dish":{Q(t,new Oe(.24,16,8,0,Math.PI*2,0,Math.PI*.35),new Ut({color:15790320,side:oi}),[0,0,0],[0,0,-Math.PI/2]),Q(t,new $e(.01,.01,.2,6),7829367,[.1,0,0],[0,0,Math.PI/2]),Q(t,new Oe(.04,8,6),_t(e,1),[.2,0,0]);break}case"briefcase":{Q(t,new Le(.46,.32,.12),5978654),Q(t,new Vt(.06,.015,6,12,Math.PI),2759182,[0,.16,0]),Q(t,new Le(.05,.04,.13),13934674,[0,.08,0]);break}case"siren":{Q(t,new $e(.16,.18,.08,14),3355443,[0,-.1,0]),Q(t,new Oe(.15,14,10,0,Math.PI*2,0,Math.PI/2),_t(e,.95),[0,-.06,0]),Q(t,new Oe(.28,12,10),_t(e,.25),[0,0,0]);break}case"tower":{Q(t,new $e(.02,.12,.8,4,1),12568527,[0,.3,0]);for(let i=0;i<3;i++)Q(t,new Vt(.1+i*.07,.012,4,16,Math.PI*.6),_t(e,.9),[0,.7,0],[0,0,Math.PI*.2]);Q(t,new Oe(.04,8,6),_t(16724821,1),[0,.72,0]);break}case"ball":{Q(t,new Oe(.2,16,12),16777215);for(let i=0;i<3;i++)Q(t,new Vt(.2,.012,4,20),1118481,[0,0,0],[0,i*Math.PI/3,0]);break}case"whistle":{Q(t,new $e(.1,.1,.12,12),12632256,[0,0,0],[Math.PI/2,0,0]),Q(t,new Le(.2,.06,.08),11579568,[.12,.05,0]);break}case"fire":{Q(t,new ti(.2,.5,10),_t(e,.9),[0,.05,0],[0,0,-Math.PI/2]),Q(t,new Oe(.2,12,10),_t(16768341,.9),[.1,0,0]),Q(t,new Oe(.1,10,8),_t(16777215,1),[.12,0,0]);break}case"snowflake":{for(let i=0;i<3;i++)Q(t,new Le(.46,.04,.04),_t(e,.95),[0,0,0],[0,0,i*Math.PI/3]);Q(t,new Oe(.2,12,10),_t(16777215,.25));break}case"leaf":{Q(t,new Oe(.22,12,8),5613104,[0,0,0],[0,0,.6],[1,.45,.12]),Q(t,new Le(.4,.015,.02),2849291,[0,0,0],[0,0,.6]);break}case"heart":{Q(t,new Oe(.12,12,10),e,[-.08,.06,0]),Q(t,new Oe(.12,12,10),e,[.08,.06,0]),Q(t,new ti(.17,.24,12),e,[0,-.1,0],[Math.PI,0,0]);break}case"shield":{Q(t,new $e(.25,.25,.04,20),e,[0,0,0],[Math.PI/2,0,0]),Q(t,new Vt(.25,.03,6,20),13934674);break}case"crane":{Q(t,new Le(.06,.8,.06),16759304,[0,.3,0]),Q(t,new Le(.7,.05,.05),16759304,[.2,.68,0]),Q(t,new $e(.005,.005,.3,4),3355443,[.45,.52,0]),Q(t,new Le(.16,.08,.08),11879983,[.45,.35,0]),Q(t,new Le(.36,.06,.36),5592405,[0,-.08,0]);break}case"map":{Q(t,new Le(.5,.02,.36),15326389),Q(t,new ti(.04,.12,8),14034984,[.1,.07,.05],[Math.PI,0,0]),Q(t,new ti(.04,.12,8),1920728,[-.12,.07,-.06],[Math.PI,0,0]),Q(t,new Le(.3,.022,.015),5800279,[0,.005,.02],[0,.4,0]);break}case"clock":{Q(t,new $e(.22,.22,.06,20),16777215,[0,.22,0],[Math.PI/2,0,0]),Q(t,new Vt(.22,.025,6,20),e,[0,.22,0]),Q(t,new Le(.02,.14,.02),1118481,[0,.27,.035]),Q(t,new Le(.1,.02,.02),1118481,[.05,.22,.035]);break}case"chair":{Q(t,new Le(.34,.05,.34),2051993,[0,0,0]),Q(t,new Le(.34,.36,.05),2051993,[0,.2,-.15]);for(const i of[-.14,.14])for(const n of[-.14,.14])Q(t,new $e(.015,.015,.3,6),4473924,[i,-.17,n]);break}case"laptop":{Q(t,new Le(.46,.02,.32),11581376,[0,-.1,0]),Q(t,new Le(.46,.3,.02),11581376,[0,.05,-.16],[-.25,0,0]),Q(t,new Oi(.42,.26),_t(e,1),[0,.05,-.145],[-.25,0,0]);break}}return t}const Tn=Math.PI*2,js=Qs+.3;function xt(s,e,t,i,n=[0,0,0],r=!0){const a=new Ge(new Le(...e),typeof t=="number"?Rt(t):t);return a.position.set(...i),a.rotation.set(...n),a.castShadow=r,a.receiveShadow=!0,s.add(a),a}function Vi(s,e,t,i=[1,1]){const n=document.createElement("canvas");n.width=s,n.height=e,t(n.getContext("2d"),s,e);const r=new lr(n);return r.colorSpace=Kt,r.wrapS=r.wrapT=Wi,r.repeat.set(i[0],i[1]),r.anisotropy=4,r}function Qn(s,e,t,i,n=.08){for(let r=0;r<i;r++){const a=Math.random()>.5?255:0;s.fillStyle=`rgba(${a},${a},${a},${n*Math.random()})`,s.fillRect(Math.random()*e,Math.random()*t,2,2)}}function ia(s,e,t=16777215,i=90){const n=new Ge(new Oi(i,i),new Ut({map:e,color:t,roughness:.85,metalness:.02}));return n.rotation.x=-Math.PI/2,n.receiveShadow=!0,s.add(n),n}function na(s,e,t,i=.12){const n=new Ge(new cr(Qs,72),new _i({color:e,transparent:!0,opacity:i,depthWrite:!1}));n.rotation.x=-Math.PI/2,n.position.y=.004;const r=new Ge(new ta(Qs-.12,Qs,96),new _i({color:t,transparent:!0,opacity:.8,depthWrite:!1}));r.rotation.x=-Math.PI/2,r.position.y=.006,s.add(n,r)}function ur(s,e,t){const i=t.segs??28,n=t.thick??.3,r=2*js*Math.sin(Math.PI/i)+.02,a=typeof t.color=="number"?Rt(t.color):t.color,o=t.top!==void 0?Rt(t.top):null,l=t.posts!==void 0?Rt(t.posts):null;for(let c=0;c<i;c++){const h=c/i*Tn,f=new lt;f.position.set(Math.cos(h)*js,0,Math.sin(h)*js),f.rotation.y=Math.PI/2-h,f.userData.radius=r/2+.3,xt(f,[r,t.h,n],a,[0,t.h/2,0],[0,0,0],!t.glass),o&&xt(f,[r+.02,.08,n+.12],o,[0,t.h+.04,0]),l&&xt(f,[.12,t.h+.2,.12],l,[r/2,(t.h+.2)/2,0]),s.add(f),e.push(f)}}function Bh(s,e,t,i,n=0){i.side=Zt;const r=new Ge(new $e(e,e,t,64,1,!0),i);return r.position.y=n+t/2,r.receiveShadow=!0,s.add(r),r}function To(s,e,t,i){const n=new Oe(120,32,16),r=new Ot({side:Zt,depthWrite:!1,fog:!1,uniforms:{top:{value:new Te(e)},bottom:{value:new Te(t)},horizon:{value:new Te(i??t)}},vertexShader:"varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",fragmentShader:`uniform vec3 top; uniform vec3 bottom; uniform vec3 horizon; varying vec3 vP;
      void main(){ float h = vP.y; vec3 c = h > 0.0 ? mix(horizon, top, pow(h, 0.6)) : mix(horizon, bottom, pow(-h, 0.5));
      gl_FragColor = vec4(c, 1.0); }`}),a=new Ge(n,r);a.renderOrder=-10,s.add(a)}function QM(s,e,t,i=1){const n=e.length;if(!n)return()=>{};const r=new Rn(.22*i,.45*i,4,8),a=new Oe(.16*i,10,8),o=new nr(r,Rt(16777215),n),l=new nr(a,Rt(16777215),n),c=[15845285,15251604,14262908,13012579,9263675],h=new Te,f=[];for(let m=0;m<n;m++)o.setColorAt(m,h.set(t[m%t.length])),l.setColorAt(m,h.set(c[m*7%c.length])),f.push(Math.random()*Math.PI*2);o.castShadow=!1,l.castShadow=!1,s.add(o,l);const u=new Ft,d=m=>{for(let v=0;v<n;v++){const[p,g,y]=e[v],E=Math.max(0,Math.sin(m*5+f[v]))*.08*i;u.position.set(p,g+.45*i+E,y),u.updateMatrix(),o.setMatrixAt(v,u.matrix),u.position.set(p,g+.98*i+E,y),u.updateMatrix(),l.setMatrixAt(v,u.matrix)}o.instanceMatrix.needsUpdate=!0,l.instanceMatrix.needsUpdate=!0};return d(0),d}class dr{constructor(e,t,i=16,n=13){this.n=i;for(let r=0;r<i;r++){const a=(r+.5)/i*Tn,o=new lt;o.position.set(Math.cos(a)*n,0,Math.sin(a)*n),o.userData.radius=0,e.add(o),t.push(o),this.groups.push(o)}}n;groups=[];at(e,t){let i=Math.atan2(t,e);return i<0&&(i+=Tn),this.groups[Math.floor(i/Tn*this.n)%this.n]}grow(e,t,i,n){e.userData.radius=Math.max(e.userData.radius,Math.hypot(t,i)+n)}adopt(e,t=1){for(const i of[...e.children]){const n=this.at(i.position.x,i.position.z);i.position.x-=n.position.x,i.position.z-=n.position.z,n.add(i),this.grow(n,i.position.x,i.position.z,t)}}instanced(e,t,i,n=!1){const r=new Map,a=new L;for(const o of i){a.setFromMatrixPosition(o);const l=this.at(a.x,a.z),c=o.clone();c.elements[12]-=l.position.x,c.elements[14]-=l.position.z,this.grow(l,c.elements[12],c.elements[14],.8);const h=r.get(l)??[];h.push(c),r.set(l,h)}for(const[o,l]of r){const c=new nr(e,t,l.length);l.forEach((h,f)=>c.setMatrixAt(f,h)),c.castShadow=n,c.receiveShadow=!0,o.add(c)}}crowd(e,t,i=1){const n=new Map;for(const[a,o,l]of e){const c=this.at(a,l),h=a-c.position.x,f=l-c.position.z;this.grow(c,h,f,.6);const u=n.get(c)??[];u.push([h,o,f]),n.set(c,u)}const r=[...n].map(([a,o])=>QM(a,o,t,i));return a=>r.forEach(o=>o(a))}}function si(s,e,t,i=0,n=0){for(let r=0;r<s;r++){const a=r/s*Tn;let o=Math.abs(a-i)%Tn;o>Math.PI&&(o=Tn-o),!(n>0&&o<n/2)&&t(Math.cos(a)*e,Math.sin(a)*e,a,r)}}function Oh(s,e,t,i,n=0){const r=new lt,a=new Ut({color:i,metalness:.7,roughness:.35}),o=(l,c,h=[0,0,0])=>{const f=new Ge(l,a);f.position.set(...c),f.rotation.set(...h),f.castShadow=!0,r.add(f)};o(new Le(1.4,.3,.8),[0,.15,0]),o(new $e(.12,.16,3.2,10),[0,1.9,0]);for(let l=1;l<=3;l++){const c=l*.55;o(new Vt(c,.09,8,24,Math.PI),[0,3.4,0],[0,0,Math.PI]);for(const h of[-1,1])o(new $e(.09,.09,1.1+.05*l,8),[h*c,3.4+.55,0])}o(new $e(.09,.09,1.2,8),[0,4,0]);for(let l=-3;l<=3;l++)o(new $e(.13,.08,.14,8),[l*.55,4.6,0]);return r.position.set(...e),r.rotation.y=n,r.scale.setScalar(t),s.add(r),r}function ZM(s,e,t){const i=new lt;for(let n=0;n<8;n++){const r=new Ge(new $e(.13-n*.008,.15-n*.008,t/8,8),Rt(9071172));r.position.set(Math.sin(n*.25)*.15,(n+.5)*(t/8),0),r.castShadow=!0,i.add(r)}for(let n=0;n<7;n++){const r=new Ge(new Oe(.9,8,6),Rt(3112242));r.scale.set(1.3,.12,.35);const a=n/7*Math.PI*2;r.position.set(Math.cos(a)*.8+.3,t+.05,Math.sin(a)*.8),r.rotation.set(0,-a,-.35),r.castShadow=!0,i.add(r)}i.position.set(...e),s.add(i)}function JM(s,e,t,i,n){const r=[];for(let a=0;a<i;a++){const o=a/(i-1),l=e[0]+(t[0]-e[0])*o,c=e[2]+(t[2]-e[2])*o,h=e[1]+(t[1]-e[1])*o-Math.sin(o*Math.PI)*.8,f=new Ge(new Oe(.07,8,6),new _i({color:n[a%n.length]}));f.position.set(l,h,c),s.add(f),r.push(f)}return r}function jM(s,e,t,i,n){return Vi(256,512,(r,a,o)=>{r.fillStyle=n,r.fillRect(0,0,a,o);const l=a/s,c=o/e;for(let h=0;h<e;h++)for(let f=0;f<s;f++)r.fillStyle=Math.random()<.55?t:i,r.fillRect(f*l+3,h*c+3,l-6,c-6)})}const Zr=(s,e)=>Math.atan2(-s,-e);function e_(s){switch(s.kind){case"plenum":return t_();case"plaza":return i_();case"committee":return n_();case"beach":return s_();case"market":return r_();case"rooftop":return a_()}}function t_(){const s=new lt,e=[],t=Vi(256,256,(u,d,m)=>{u.fillStyle="#23407a",u.fillRect(0,0,d,m),u.strokeStyle="rgba(160,190,255,0.18)",u.lineWidth=3;for(let v=0;v<8;v++)u.beginPath(),u.moveTo(0,v*32+16),u.lineTo(d,v*32+16),u.stroke();Qn(u,d,m,3e3,.12)},[20,20]);ia(s,t),na(s,10467583,13936722,.08),ur(s,e,{h:1,color:7031342,top:9071172});const i=Vi(512,256,(u,d,m)=>{u.fillStyle="#d8c7a3",u.fillRect(0,0,d,m),u.strokeStyle="rgba(120,100,70,0.35)";for(let v=0;v<8;v++){const p=v%2*32;for(let g=-1;g<9;g++)u.strokeRect(g*64+p,v*32,64,32)}Qn(u,d,m,4e3,.1)},[14,3]);Bh(s,20,16,new Ut({map:i,roughness:.95}));const n=new dr(s,e,16,13.5),r=[],a=[],o=[],l=new Ft;for(let u=0;u<4;u++){const d=11+u*1.6,m=u*.5;si(Math.round(Tn*d/1.35),d,(v,p,g,y)=>{l.position.set(v,m+.45,p),l.rotation.set(0,Math.PI/2-g,0),l.updateMatrix(),r.push(l.matrix.clone()),l.position.set(v+Math.cos(g)*.7,m+.35,p+Math.sin(g)*.7),l.updateMatrix(),a.push(l.matrix.clone()),(y+u)%3!==0&&o.push([v+Math.cos(g)*.7,m+.1,p+Math.sin(g)*.7])},-Math.PI/2,.7)}n.instanced(new Le(1.1,.9,.55),Rt(8148532),r),n.instanced(new Le(.6,1,.5),Rt(2908088),a);const c=n.crowd(o,[1780298,2961206,1118742,3820126,15921906,5913893]);for(let u=1;u<4;u++){const d=11+u*1.6-.8,m=new Ge(new $e(d,d,u*.5,72,1,!0),Rt(3877404));m.material.side=Zt,m.position.y=u*.5/2,s.add(m);const v=new Ge(new ta(d,d+1.6,72),Rt(2768750));v.rotation.x=-Math.PI/2,v.position.y=u*.5+.005,s.add(v)}const h=new lt;xt(h,[7,1.2,1.6],7031342,[0,.6,-12.5]),xt(h,[5.5,.9,1.2],8148532,[0,1.65,-13.6]),xt(h,[.9,1.4,.6],5913893,[0,1.3,-11.6]),n.adopt(h,2),Oh(s,[0,3,-19.3],.9,13936722);const f=[3895256,14263361,3115626,3895256,14263361,3115626];return si(6,19.6,(u,d,m,v)=>{const p=xt(s,[5,5.5,.1],Rt(f[v]),[u,6,d],[0,Zr(u,d),0],!1);p.castShadow=!1},-Math.PI/2,1.2),si(10,12,(u,d,m)=>{const v=new Ge(new Le(5,.1,.4),new _i({color:16774358}));v.position.set(u,12,d),v.rotation.y=Math.PI/2-m,s.add(v)}),{group:s,occluders:e,update:u=>c(u),lighting:{background:1709072,fog:[1709072,24,60],hemiSky:16773336,hemiGround:2763332,hemiIntensity:1.1,key:16773590,keyIntensity:2.6,keyPos:[4,14,8],rim:7314431,rimIntensity:1.4,env:{top:3813926,horizon:9075296,bottom:1845834,lights:[{dir:[0,1,.2],color:16773590,intensity:6,size:30},{dir:[.8,.5,.4],color:16770232,intensity:3,size:14},{dir:[-.8,.5,-.4],color:10467583,intensity:2,size:14}]},envIntensity:.55,look:{bloom:.38,vignette:.34,saturation:1.06,contrast:1.07}}}}function i_(){const s=new lt,e=[];To(s,3112921,13624567,15266555);const t=Vi(256,256,(h,f,u)=>{h.fillStyle="#d9cdb4",h.fillRect(0,0,f,u),h.strokeStyle="rgba(110,95,70,0.35)",h.lineWidth=2;for(let d=0;d<=4;d++)h.beginPath(),h.moveTo(d*64,0),h.lineTo(d*64,u),h.stroke(),h.beginPath(),h.moveTo(0,d*64),h.lineTo(f,d*64),h.stroke();Qn(h,f,u,3e3,.1)},[30,30]);ia(s,t,16777215,160),na(s,16777215,9075290,.1),ur(s,e,{h:.85,color:13616040,top:15195330,segs:24});const i=Rt(6134586);si(4,17,(h,f)=>xt(s,[9,.1,9],i,[h,.05,f],[0,0,0],!1),Math.PI/4+.001);const n=new lt,r=Rt(15195330);xt(n,[34,1.2,8],r,[0,7.4,0]),xt(n,[32,6.8,6],Rt(3815994),[0,3.4,-.5]);for(let h=0;h<15;h++)xt(n,[1,6.8,1],r,[-14+h*2,3.4,3.2]);xt(n,[36,.6,9],Rt(13616040),[0,.3,0]),n.position.set(0,0,-32),s.add(n),si(18,38,(h,f,u)=>{const d=6+(Math.sin(u*7)+1)/2*9;xt(s,[7,d,7],Rt(14208176),[h,d/2,f],[0,Zr(h,f),0],!1)},-Math.PI/2,1.3);const a=new lt,o=new dr(s,e,16,14);Oh(a,[13,0,-8],.9,723e4,Zr(13,-8)),si(8,12.5,(h,f,u)=>{const d=new lt;xt(d,[.08,7,.08],14540253,[0,3.5,0]);const m=new lt;xt(m,[1.6,1.1,.03],16777215,[.8,0,0],[0,0,0],!1),xt(m,[1.6,.16,.035],2052031,[.8,.38,0],[0,0,0],!1),xt(m,[1.6,.16,.035],2052031,[.8,-.38,0],[0,0,0],!1),m.position.y=6.3,d.add(m),d.position.set(h,0,f),d.rotation.y=Math.PI/2-u,a.add(d)},.2),si(9,16,(h,f)=>{const u=new lt;xt(u,[.3,2.2,.3],6967862,[0,1.1,0]);const d=new Ge(new Oe(1.4,10,8),Rt(8362586));d.scale.set(1.2,.8,1.1),d.position.set(0,2.8,0),d.castShadow=!0,u.add(d),u.position.set(h,0,f),a.add(u)},.35),o.adopt(a,2);const l=[];si(56,10.6,(h,f,u,d)=>l.push([h+Math.cos(u)*(d%2)*.8,0,f+Math.sin(u)*(d%2)*.8]));const c=o.crowd(l,[2052031,16777215,14035001,2961206,15909198,3833156]);return{group:s,occluders:e,update:h=>c(h),lighting:{background:13624567,fog:[14412278,35,110],hemiSky:13625599,hemiGround:9075290,hemiIntensity:1.3,key:16774624,keyIntensity:3,keyPos:[-8,16,10],rim:16777215,rimIntensity:.6,env:{top:3112921,horizon:15266555,bottom:12101768,lights:[{dir:[-.5,.8,.5],color:16774624,intensity:18,size:6}]},envIntensity:.8,exposure:.95,look:{bloom:.3,threshold:.9,vignette:.26,saturation:1.05,contrast:1.05}}}}function n_(){const s=new lt,e=[],t=Vi(256,256,(u,d,m)=>{u.fillStyle="#6a2c2c",u.fillRect(0,0,d,m),u.fillStyle="rgba(255,210,150,0.08)";for(let v=0;v<16;v++)for(let p=0;p<16;p++)(v+p)%2===0&&u.fillRect(v*16,p*16,16,16);Qn(u,d,m,2500,.12)},[20,20]);ia(s,t),na(s,16765088,13936722,.06),ur(s,e,{h:.9,color:4861724,top:6176037,thick:.9,segs:28});const i=Vi(256,256,(u,d,m)=>{u.fillStyle="#6b4a2e",u.fillRect(0,0,d,m);for(let v=0;v<16;v++)u.fillStyle=`rgba(40,20,10,${.08+Math.random()*.12})`,u.fillRect(v*16,0,2,m);Qn(u,d,m,2e3,.1)},[24,2]);Bh(s,17,12,new Ut({map:i,roughness:.8}));const n=new dr(s,e,16,11),r=new lt,a=[],o=Rt(1710618),l=Rt(16053492),c=new Ut({color:10474495,transparent:!0,opacity:.6});si(26,10.6,(u,d,m)=>{xt(r,[.7,1.3,.6],o,[u,.65,d],[0,Math.PI/2-m,0]),a.push([u,.2,d]);const v=Math.cos(m)*(js-.1),p=Math.sin(m)*(js-.1);xt(r,[.25,.02,.3],l,[v,.95,p],[0,Math.PI/2-m,0],!1),xt(r,[.08,.2,.08],c,[v+Math.sin(m)*.3,1,p-Math.cos(m)*.3],[0,0,0],!1)}),n.adopt(r,1);const h=n.crowd(a,[1780298,2961206,1118742,5913893]),f=Vi(512,288,(u,d,m)=>{u.fillStyle="#0b1a2e",u.fillRect(0,0,d,m),u.fillStyle="#9fd3ff",u.font="bold 28px Arial",u.fillText("STATE BUDGET 2026",24,44);const v=["#ffd166","#ef476f","#06d6a0","#118ab2","#f78c6b"];for(let p=0;p<10;p++){const g=40+Math.random()*170;u.fillStyle=v[p%v.length],u.fillRect(30+p*46,m-20-g,32,g)}});return si(5,16.7,(u,d)=>{const m=Zr(u,d);xt(s,[5.4,3.2,.2],1118481,[u,5,d],[0,m,0],!1);const v=new Ge(new Oi(5,2.8),new _i({map:f}));v.position.set(u*.992,5,d*.992),v.rotation.y=m,s.add(v)},-Math.PI/2,1),Oh(s,[0,4.2,-16.7],.55,13936722),{group:s,occluders:e,update:u=>h(u),lighting:{background:1313800,fog:[1313800,20,50],hemiSky:16769728,hemiGround:2759188,hemiIntensity:1,key:16770756,keyIntensity:2.5,keyPos:[3,12,7],rim:16756848,rimIntensity:1.2,env:{top:2759184,horizon:7031342,bottom:3807256,lights:[{dir:[0,1,0],color:16770756,intensity:5,size:24},{dir:[0,.3,-1],color:6990079,intensity:2,size:10}]},envIntensity:.5,look:{bloom:.4,vignette:.38,saturation:1.04,contrast:1.08}}}}function s_(){const s=new lt,e=[];To(s,3817359,3811914,16751194);const t=Vi(256,256,(d,m,v)=>{d.fillStyle="#e6c894",d.fillRect(0,0,m,v),Qn(d,m,v,6e3,.15)},[30,30]);ia(s,t,16777215,160),na(s,16777215,11569232,.08),ur(s,e,{h:.9,color:10516560,top:13279344,thick:.18,segs:28,posts:7031342});const i=new Oi(90,200,30,60),n=new Ge(i,new Ut({color:2781086,roughness:.25,metalness:.3,flatShading:!0}));n.rotation.x=-Math.PI/2,n.position.set(-63,.05,0),s.add(n);const r=new Ge(new cr(6,32),new _i({color:16757594,fog:!1}));r.position.set(-110,7,-10),r.rotation.y=Math.PI/2,s.add(r);for(let d=0;d<22;d++){const m=5+Math.random()*16,v=-40+d*4;xt(s,[3+Math.random()*2,m,3],Rt(4868714),[34+d%3*5,m/2,v],[0,0,0],!1)}const a=new dr(s,e,16,14),o=new lt;si(8,14.5,(d,m)=>ZM(o,[d,0,m],6+Math.random()*2),Math.PI,1.2);const l=new lt;for(const d of[-1,1])for(const m of[-1,1])xt(l,[.15,3,.15],14540253,[d,1.5,m]);xt(l,[2.6,.2,2.6],15921906,[0,3.1,0]),xt(l,[2.4,1.6,2.4],14034984,[0,4,0]),xt(l,[2.8,.2,2.8],16777215,[0,4.9,0]),l.position.set(-13,0,-6),o.add(l),si(6,12,(d,m,v,p)=>{const g=new lt;xt(g,[.08,2.4,.08],15658734,[0,1.2,0]);const y=new Ge(new ti(1.6,.6,12),Rt([16731501,3835647,16766474][p%3]));y.position.set(0,2.5,0),y.castShadow=!0,g.add(y),g.position.set(d,0,m),o.add(g)},.5),a.adopt(o,2.5);const c=[];si(40,11,(d,m,v,p)=>c.push([d+Math.cos(v)*(p%3)*.7,0,m+Math.sin(v)*(p%3)*.7]),Math.PI,1);const h=a.crowd(c,[16731501,3835647,16766474,448160,16053492,8599788]),f=i.getAttribute("position"),u=Float32Array.from(f.array);return{group:s,occluders:e,update:d=>{h(d);for(let m=0;m<f.count;m++){const v=u[m*3],p=u[m*3+1];f.setZ(m,Math.sin(p*.2+d*1.2)*.25+Math.cos(v*.3+d)*.2)}f.needsUpdate=!0},lighting:{background:16751194,fog:[14256746,40,140],hemiSky:16762266,hemiGround:6965866,hemiIntensity:1.2,key:16756848,keyIntensity:3,keyPos:[-10,9,6],rim:16735912,rimIntensity:1.2,env:{top:3817359,horizon:16751194,bottom:13146736,lights:[{dir:[-1,.12,-.1],color:16757594,intensity:14,size:8}]},envIntensity:.75,look:{bloom:.5,threshold:.82,vignette:.3,saturation:1.12,contrast:1.05}}}}function r_(){const s=new lt,e=[];To(s,658464,657930,1710650);const t=Vi(256,256,(u,d,m)=>{u.fillStyle="#6b6258",u.fillRect(0,0,d,m);for(let v=0;v<180;v++)u.fillStyle=`rgba(${150+Math.random()*40},${140+Math.random()*30},${120+Math.random()*30},0.9)`,u.beginPath(),u.ellipse(Math.random()*d,Math.random()*m,8+Math.random()*6,6+Math.random()*4,Math.random()*3,0,Math.PI*2),u.fill()},[22,22]);ia(s,t),na(s,16765066,16756832,.07),ur(s,e,{h:1,color:7031342,top:9071172,thick:.8,segs:24});const i=[15087942,16219904,16766474,5613104,10309341,16748459],n=new dr(s,e,16,11.5),r=new lt;si(24,js,(u,d,m,v)=>{const p=new lt;for(let g=0;g<8;g++){const y=new Ge(new Oe(.13,8,6),Rt(i[(v+g)%i.length]));y.position.set(-.6+g%4*.4,1.12+Math.floor(g/4)*.16,(Math.floor(g/4)-.5)*.3),p.add(y)}p.position.set(u,0,d),p.rotation.y=Math.PI/2-m,r.add(p)}),si(12,11.2,(u,d,m,v)=>{const p=new lt;xt(p,[.1,3.2,.1],3811866,[-1.6,1.6,0]),xt(p,[.1,3.2,.1],3811866,[1.6,1.6,0]);const g=xt(p,[3.8,.08,2.2],Rt(v%2?14034984:16053492),[0,3.1,-.3],[-.25,0,0]);g.castShadow=!1,p.position.set(u,0,d),p.rotation.y=Zr(u,d),r.add(p)}),n.adopt(r,2.5);const a=Vi(512,256,(u,d,m)=>{u.fillStyle="#8a7a64",u.fillRect(0,0,d,m),u.fillStyle="#2a2018";for(let v=0;v<4;v++)u.beginPath(),u.moveTo(v*128+24,m),u.lineTo(v*128+24,m*.45),u.arc(v*128+64,m*.45,40,Math.PI,0),u.lineTo(v*128+104,m),u.fill();Qn(u,d,m,3e3,.1)},[10,1]);Bh(s,17,8,new Ut({map:a,roughness:.95}));const o=[];si(6,14,(u,d)=>o.push(...JM(s,[u,5.6,d],[-u*.2,6.2,-d*.2],18,[16769162,16752474,16773568])));const l=new zc(16756832,30,18,1.6);l.position.set(-5,5,-3);const c=new zc(16756832,30,18,1.6);c.position.set(5,5,3),s.add(l,c);const h=[];si(40,12.3,(u,d,m,v)=>h.push([u+Math.cos(m)*(v%2)*.6,0,d+Math.sin(m)*(v%2)*.6]));const f=n.crowd(h,[2961206,6966419,1671876,9095462,16734558,16763450]);return{group:s,occluders:e,update:u=>{f(u),o.forEach((d,m)=>d.material.color.setHSL(.1,1,.55+.15*Math.sin(u*3+m)))},lighting:{background:658464,fog:[921114,20,55],hemiSky:5925536,hemiGround:2759184,hemiIntensity:.8,key:16766112,keyIntensity:2.2,keyPos:[5,12,8],rim:8031487,rimIntensity:1.5,env:{top:658464,horizon:3811898,bottom:2759184,lights:[{dir:[.5,.6,.5],color:16756832,intensity:6,size:8},{dir:[-.5,.6,-.5],color:16756832,intensity:6,size:8}]},envIntensity:.6,look:{bloom:.6,threshold:.78,vignette:.4,saturation:1.1,contrast:1.08}}}}function a_(){const s=new lt,e=[];To(s,329231,329231,1905984);const t=Vi(1024,1024,(b,S,w)=>{b.fillStyle="#50535a",b.fillRect(0,0,S,w),Qn(b,S,w,16e3,.12),b.strokeStyle="rgba(255,215,0,0.9)",b.lineWidth=14,b.beginPath(),b.arc(S/2,w/2,250,0,Math.PI*2),b.stroke(),b.fillStyle="rgba(255,255,255,0.85)",b.font="bold 300px Arial",b.textAlign="center",b.textBaseline="middle",b.fillText("H",S/2,w/2+14)}),i=new Ge(new cr(12,72),new Ut({map:t,roughness:.9}));i.rotation.x=-Math.PI/2,i.receiveShadow=!0,s.add(i);const n=new Ge(new $e(12,12,1.2,72,1,!0),Rt(3816772));n.position.y=-.6,s.add(n);const r=new Ut({color:10471679,transparent:!0,opacity:.22,roughness:.1,metalness:.2});ur(s,e,{h:1.1,color:r,top:12303291,thick:.06,segs:28,posts:10066329,glass:!0});const a=jM(8,40,"#ffe7a8","#1b2340","#2b3450"),o=new Ut({map:a,emissive:16777215,emissiveMap:a,emissiveIntensity:.6,roughness:.4}),l=new Ge(new $e(4,4,40,32),o);l.position.set(-18,-8,-28);const c=new Ge(new $e(4.6,4.6,36,3),o);c.position.set(20,-10,-24);const h=new Ge(new Le(7,34,7),o);h.position.set(2,-12,-40),s.add(l,c,h),si(14,46,(b,S,w)=>{const x=20+(Math.sin(w*5)+1)/2*24,A=new Ge(new Le(6,x,6),o);A.position.set(b,-30+x/2,S),A.rotation.y=w,s.add(A)},-Math.PI/2,1.4);const f=2e3,u=new It,d=new Float32Array(f*3),m=new Float32Array(f*3),v=new Te;for(let b=0;b<f;b++){const S=Math.random()*Tn,w=25+Math.random()*110;d[b*3]=Math.cos(S)*w,d[b*3+1]=-28-Math.random()*3,d[b*3+2]=Math.sin(S)*w,v.setHSL(.08+Math.random()*.1,.9,.5+Math.random()*.3),m.set([v.r,v.g,v.b],b*3)}u.setAttribute("position",new ri(d,3)),u.setAttribute("color",new ri(m,3)),s.add(new Wu(u,new Uc({size:.5,vertexColors:!0,fog:!1})));const p=new It,g=new Float32Array(600*3);for(let b=0;b<600;b++){const S=Math.random()*Math.PI*2,w=Math.random()*Math.PI*.45;g.set([Math.cos(S)*Math.sin(w)*110,Math.cos(w)*110,Math.sin(S)*Math.sin(w)*110],b*3)}p.setAttribute("position",new ri(g,3)),s.add(new Wu(p,new Uc({size:.35,color:16777215,fog:!1})));const y=new dr(s,e,12,10.8),E=new lt;xt(E,[2,1.2,1.4],9080729,[-7.6,.6,-7.6],[0,Math.PI/4,0]),xt(E,[2,1.2,1.4],9080729,[8,.6,7.2],[0,-Math.PI/4,0]),xt(E,[.15,6,.15],7829367,[7.8,3,-7.8]),y.adopt(E,1.5);const M=new Ge(new Oe(.15,8,6),_t(16720452,1));return M.position.set(7.8,6.1,-7.8),s.add(M),{group:s,occluders:e,update:b=>{M.visible=Math.sin(b*4)>0},lighting:{background:329231,fog:[723742,40,160],hemiSky:6320320,hemiGround:2103344,hemiIntensity:.9,key:13161727,keyIntensity:2.4,keyPos:[6,14,9],rim:16732067,rimIntensity:2,env:{top:329231,horizon:2760016,bottom:3811864,lights:[{dir:[.3,.2,-1],color:16767392,intensity:4,size:16},{dir:[-.9,.3,.2],color:16732067,intensity:3,size:10}]},envIntensity:.7,look:{bloom:.65,threshold:.75,vignette:.42,saturation:1.12,contrast:1.1}}}}function Wd(s){s.group.traverse(e=>{const t=e;t.geometry&&t.geometry.dispose();const i=t.material;Array.isArray(i)?i.forEach(n=>n.dispose()):i&&(i.map?.dispose(),i.dispose())})}const o_={netanyahu:"Benjamin Netanyahu",levin:"Yariv Levin","israel-katz":"Israel Katz",ohana:"Amir Ohana",regev:"Miri Regev",amsalem:"David Amsalem",barkat:"Nir Barkat",gotliv:"Tally Gotliv",karhi:"Shlomo Karhi","may-golan":"May Golan",edelstein:"Yuli Edelstein",saar:"Gideon Sa'ar",dichter:"Avi Dichter",silman:"Idit Silman","ofir-katz":"Ofir Katz",kisch:"Yoav Kisch",lapid:"Yair Lapid","ben-ari":"Meirav Ben-Ari",gantz:"Benny Gantz",eisenkot:"Gadi Eisenkot",tropper:"Hili Tropper","tamano-shata":"Pnina Tamano-Shata",deri:"Aryeh Deri",malchieli:"Michael Malchieli",gafni:"Moshe Gafni",goldknopf:"Yitzhak Goldknopf",smotrich:"Bezalel Smotrich",rothman:"Simcha Rothman",strook:"Orit Strook","ben-gvir":"Itamar Ben-Gvir",fogel:"Zvika Fogel",maoz:"Avi Maoz",lieberman:"Avigdor Lieberman",forer:"Oded Forer","mansour-abbas":"Mansour Abbas",odeh:"Ayman Odeh",tibi:"Ahmad Tibi","touma-sliman":"Aida Touma-Suleiman",kariv:"Gilad Kariv",lazimi:"Naama Lazimi"},vp=s=>`https://${s}/w/api.php`;function l_(s,e,t=640){const i=new URLSearchParams({action:"query",format:"json",formatversion:"2",origin:"*",prop:"pageimages",piprop:"thumbnail|name",pithumbsize:String(t),pilicense:"free",redirects:"1",titles:e.join("|")});return`${vp(s)}?${i}`}function c_(s,e){const t=s.query??{},i=new Map((t.normalized??[]).map(o=>[o.from,o.to])),n=new Map((t.redirects??[]).map(o=>[o.from,o.to])),r=new Map((t.pages??[]).map(o=>[o.title,o])),a={};for(const o of e){let l=i.get(o)??o;for(let h=0;h<3&&n.has(l);h++)l=n.get(l);const c=r.get(l);c&&!c.missing&&c.pageimage&&c.thumbnail?.source&&(a[o]={file:c.pageimage,thumb:c.thumbnail.source,width:c.thumbnail.width,height:c.thumbnail.height,pageTitle:c.title})}return a}function h_(s,e){const t=new URLSearchParams({action:"query",format:"json",formatversion:"2",origin:"*",prop:"imageinfo",iiprop:"extmetadata|url",iiextmetadatafilter:"LicenseShortName|LicenseUrl|Artist|Credit",titles:e.map(i=>`File:${i}`).join("|")});return`${vp(s)}?${t}`}function Ll(s){return s.replace(/<[^>]*>/g," ").replace(/&nbsp;/g," ").replace(/&amp;/g,"&").replace(/&quot;/g,'"').replace(/&#0?39;/g,"'").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/\s+/g," ").trim()}function u_(s){const e={};for(const t of s.query?.pages??[]){const i=t.imageinfo?.[0];if(!i)continue;const n=i.extmetadata??{},r=t.title.replace(/^File:/,"").replace(/ /g,"_");e[r]={license:Ll(n.LicenseShortName?.value??""),licenseUrl:Ll(n.LicenseUrl?.value??""),artist:Ll(n.Artist?.value??n.Credit?.value??"Unknown"),descUrl:i.descriptionurl??""}}return e}function Xd(s){return s.replace(/^File:/,"").replace(/ /g,"_")}function d_(s){const e=s.toLowerCase();return!e||e.includes("nc")||e.includes("nd")||e.includes("fair use")||e.includes("non-free")?!1:e.includes("cc0")||e.includes("public domain")||e.startsWith("pd")||e.includes("cc by")||e.includes("cc-by")||e.includes("attribution")||e.includes("gfdl")}function f_(s,e,t){const i=Math.max(s.height*t,s.width*e*1.1),n=i*1.95/t;return{cx:s.xCenter,cy:s.yCenter-i*.2/t,h:n}}function p_(s,e){const t=s/e;return t<.95?{cx:.5,cy:.32,h:Math.min(.62,.55/t*.8)}:t>1.3?{cx:.5,cy:.36,h:.62}:{cx:.5,cy:.36,h:.64}}function xp(s,e,t){const i=s.h*t,n=i*.8;return{x:s.cx*e-n/2,y:s.cy*t-i/2,w:n,h:i}}function m_(s,e,t){const i=s.h*t*1.35;return{x:s.cx*e-i/2,y:s.cy*t-i*.42,s:i}}const g_="0.4.1646425229",qd=`https://cdn.jsdelivr.net/npm/@mediapipe/face_detection@${g_}/`;let Il=null,Qc=null,Zc="",Kd=Promise.resolve();function v_(s,e){return new Promise((t,i)=>{const n=document.createElement("script");n.src=s,n.crossOrigin="anonymous";const r=setTimeout(()=>i(new Error("timeout")),e);n.onload=()=>{clearTimeout(r),t()},n.onerror=()=>{clearTimeout(r),i(new Error("load failed"))},document.head.appendChild(n)})}function yp(s,e){return Promise.race([s,new Promise((t,i)=>setTimeout(()=>i(new Error("timeout")),e))])}async function x_(){return Il||(Il=(async()=>{try{const s=window;if(s.FaceDetection||await v_(`${qd}face_detection.js`,15e3),!s.FaceDetection)return null;const e=new s.FaceDetection({locateFile:t=>`${qd}${t}`});return e.onResults(t=>{const i=Qc;Qc=null,i?.(t)}),e.setOptions({model:"full",minDetectionConfidence:.4}),Zc="full",await yp(e.initialize(),25e3),e}catch(s){return console.warn("Face detector unavailable, using heuristic crops.",s),null}})()),Il}async function y_(s,e,t){return Zc!==t&&(s.setOptions({model:t,minDetectionConfidence:.45}),Zc=t),(await yp(new Promise(n=>{Qc=n,s.send({image:e}).catch(()=>n({detections:[]}))}),8e3)).detections??[]}function M_(s,e){for(const[t,i]of Object.entries(s))if(!(t==="boundingBox"||t==="landmarks"||!Array.isArray(i)||!i.length)){for(const[n,r]of Object.entries(i[0]))if(n!=="index"&&typeof r=="number"&&r>0&&r<=1)return r}return 1-e*.01}function __(s){let e=null;return s.forEach((t,i)=>{const n=t.boundingBox,r=M_(t,i);(!e||r>e.score)&&(e={xCenter:n.xCenter,yCenter:n.yCenter,width:n.width,height:n.height,score:r})}),e}function S_(s){const e=Kd.then(async()=>{const t=await x_();if(!t)return null;try{return __(await y_(t,s,"full"))}catch{return null}});return Kd=e.catch(()=>null),e}const b_="0.4.1633559619",Yd=`https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@${b_}/`;let Dl=null,Jc=null,$d=Promise.resolve();function A_(s,e){return new Promise((t,i)=>{const n=document.createElement("script");n.src=s,n.crossOrigin="anonymous";const r=setTimeout(()=>i(new Error("timeout")),e);n.onload=()=>{clearTimeout(r),t()},n.onerror=()=>{clearTimeout(r),i(new Error("load failed"))},document.head.appendChild(n)})}function Mp(s,e){return Promise.race([s,new Promise((t,i)=>setTimeout(()=>i(new Error("timeout")),e))])}async function w_(){return Dl||(Dl=(async()=>{try{const s=window;if(s.FaceMesh||await A_(`${Yd}face_mesh.js`,15e3),!s.FaceMesh)return null;const e=new s.FaceMesh({locateFile:t=>`${Yd}${t}`});return e.onResults(t=>{const i=Jc;Jc=null,i?.(t)}),e.setOptions({maxNumFaces:1,refineLandmarks:!1,enableFaceGeometry:!0,minDetectionConfidence:.3,selfieMode:!1}),await Mp(e.initialize(),3e4),e}catch(s){return console.warn("Face mesh unavailable; photo faces stay flat.",s),null}})()),Dl}function E_(s){const e=$d.then(async()=>{const t=await w_();if(!t)return null;try{const i=await Mp(new Promise(l=>{Jc=l,t.send({image:s}).catch(()=>l({}))}),1e4),n=i.multiFaceLandmarks?.[0],r=i.multiFaceGeometry?.[0]?.getMesh().getVertexBufferList();if(!n||n.length<468||!r||r.length<2340)return null;const a=new Float32Array(468*3),o=new Float32Array(468*2);for(let l=0;l<468;l++)a[l*3]=r[l*5],a[l*3+1]=r[l*5+1],a[l*3+2]=r[l*5+2],o[l*2]=n[l].x,o[l*2+1]=n[l].y;return{pos:a,uv:o}}catch{return null}});return $d=e.catch(()=>null),e}function T_(s){const e=new Int16Array(2340);for(let n=0;n<468*3;n++)e[n]=Math.round(Math.max(-327,Math.min(327,s.pos[n]))*100);for(let n=0;n<468*2;n++)e[468*3+n]=Math.round(Math.max(-1,Math.min(1.09,s.uv[n]))*3e4);const t=new Uint8Array(e.buffer);let i="";for(let n=0;n<t.length;n++)i+=String.fromCharCode(t[n]);return btoa(i)}function C_(s){try{const e=atob(s);if(e.length!==468*5*2)return null;const t=new Uint8Array(e.length);for(let a=0;a<e.length;a++)t[a]=e.charCodeAt(a);const i=new Int16Array(t.buffer),n=new Float32Array(468*3),r=new Float32Array(468*2);for(let a=0;a<468*3;a++)n[a]=i[a]/100;for(let a=0;a<468*2;a++)r[a]=i[468*3+a]/3e4;return{pos:n,uv:r}}catch{return null}}const Si=256,Gs=512,Wn=320,Ei=new Map,zh=new Map;let go="photo",jn=0;function Co(s,e){try{const t=localStorage.getItem(s);return t?JSON.parse(t):e}catch{return e}}function xs(s,e){try{localStorage.setItem(s,JSON.stringify(e))}catch{}}const Gr=new Set(Co("skf.faceDisabled",[])),In=Co("skf.faceCrops",{}),kl=Co("skf.faceAutoCrops",{}),Xa=Co("skf.faceMesh.v1",{});function P_(s){go!==s&&(go=s,jn++)}function R_(){return go}function Hh(s){if(!(go!=="photo"||Gr.has(s)))return Ei.get(s)}function qs(s){return Ei.get(s)}function L_(s){const e=Hh(s);return e?(e.texture||(e.texture=new lr(e.head),e.texture.colorSpace=Kt,e.texture.anisotropy=4),e.texture):null}function I_(s){const e=Hh(s);return!e?.mesh||!e.meshCanvas?null:(e.meshTexture||(e.meshTexture=new lr(e.meshCanvas),e.meshTexture.colorSpace=Kt,e.meshTexture.anisotropy=8),{texture:e.meshTexture,mesh:e.mesh,skin:e.skin??14262908})}function D_(s){return Hh(s)?.portrait}function Ul(s){return Gr.has(s)}function _p(s,e){e?Gr.add(s):Gr.delete(s),xs("skf.faceDisabled",[...Gr]),jn++}function k_(){return Ei.size}function U_(){return[...Ei.values()].filter(s=>s.source.kind==="wiki").map(s=>({id:s.id,source:s.source}))}function F_(s,e=15e3){return new Promise((t,i)=>{const n=new Image;n.crossOrigin="anonymous",n.decoding="async";const r=setTimeout(()=>i(new Error("timeout")),e);n.onload=()=>{clearTimeout(r),t(n)},n.onerror=()=>{clearTimeout(r),i(new Error(`failed to load ${s}`))},n.src=s})}function N_(s,e=900){const t=Math.min(1,e/Math.max(s.naturalWidth,s.naturalHeight)),i=document.createElement("canvas");return i.width=Math.max(1,Math.round(s.naturalWidth*t)),i.height=Math.max(1,Math.round(s.naturalHeight*t)),i.getContext("2d").drawImage(s,0,0,i.width,i.height),i}async function Qd(s,e=12e3){const t=new AbortController,i=setTimeout(()=>t.abort(),e);try{const n=await fetch(s,{signal:t.signal});if(!n.ok)throw new Error(`HTTP ${n.status}`);return await n.json()}finally{clearTimeout(i)}}function Sp(s){const t=s.getContext("2d").getImageData(0,0,s.width,1).data;let i=0,n=0,r=0;const a=t.length/4;for(let o=0;o<t.length;o+=4)i+=t[o],n+=t[o+1],r+=t[o+2];return`rgb(${Math.round(i/a)},${Math.round(n/a)},${Math.round(r/a)})`}function Gh(s,e){const t=s.image,i=t.width,n=t.height,r=Sp(t),a=s.head;a.width=Si,a.height=Wn;const o=a.getContext("2d");o.save(),o.clearRect(0,0,Si,Wn),o.fillStyle=r,o.fillRect(0,0,Si,Wn);const l=xp(s.crop,i,n);o.drawImage(t,l.x,l.y,l.w,l.h,0,0,Si,Wn),o.globalCompositeOperation="destination-in",o.translate(Si/2,Wn/2),o.scale(1,Wn/Si);const c=o.createRadialGradient(0,0,Si*.38,0,0,Si*.5);c.addColorStop(0,"rgba(0,0,0,1)"),c.addColorStop(.82,"rgba(0,0,0,1)"),c.addColorStop(1,"rgba(0,0,0,0)"),o.fillStyle=c,o.fillRect(-Si/2,-Si/2,Si,Si),o.restore(),o.save(),o.translate(Si/2,Wn/2),o.beginPath(),o.ellipse(0,0,Si*.465,Wn*.465,0,0,Math.PI*2),o.lineWidth=6,o.strokeStyle="rgba(7,8,12,0.9)",o.stroke(),o.restore();const h=192,f=document.createElement("canvas");f.width=h,f.height=h;const u=f.getContext("2d");u.fillStyle=e?`#${Yn[e.party].color.toString(16).padStart(6,"0")}`:r,u.fillRect(0,0,h,h);const d=m_(s.crop,i,n);u.drawImage(t,d.x,d.y,d.s,d.s,0,0,h,h),s.portrait=f.toDataURL("image/jpeg",.88),s.texture&&(s.texture.needsUpdate=!0)}async function B_(s,e){const t=kl[e];if(t)return{crop:{cx:t.cx,cy:t.cy,h:t.h},detected:t.detected};const i=await S_(s),n=i?{crop:f_(i,s.width,s.height),detected:!0}:{crop:p_(s.width,s.height),detected:!1};return i&&(kl[e]={...n.crop,detected:!0},xs("skf.faceAutoCrops",kl)),n}function O_(s,e){const t=s.width,i=s.height,n=e.h*i*1.15,r=e.cx*t,a=e.cy*i+e.h*i*.08,o=document.createElement("canvas");o.width=Gs,o.height=Gs;const l=o.getContext("2d",{willReadFrequently:!0});return l.fillStyle=Sp(s),l.fillRect(0,0,Gs,Gs),l.drawImage(s,r-n/2,a-n/2,n,n,0,0,Gs,Gs),o}function z_(s,e){const t=s.getContext("2d",{willReadFrequently:!0});let i=0,n=0,r=0,a=0;for(const o of AM){const l=Math.round(e.uv[o*2]*s.width),c=Math.round(e.uv[o*2+1]*s.height),h=t.getImageData(Math.max(0,l-3),Math.max(0,c-3),7,7).data;for(let f=0;f<h.length;f+=4)i+=h[f],n+=h[f+1],r+=h[f+2],a++}return a?Math.round(i/a)<<16|Math.round(n/a)<<8|Math.round(r/a):14262908}async function bp(s){const e=O_(s.image,s.crop),t=s.crop,i=`${s.source.url}|${t.cx.toFixed(3)},${t.cy.toFixed(3)},${t.h.toFixed(3)}`,n=s.source.kind==="wiki";let r=n&&Xa[i]?C_(Xa[i]):null;r||(r=await E_(e),r&&n&&(Xa[i]=T_(r),xs("skf.faceMesh.v1",Xa))),s.meshCanvas=e,s.mesh=r,s.skin=r?z_(e,r):null,s.meshTexture&&(s.meshTexture.image=e,s.meshTexture.needsUpdate=!0)}async function vo(s,e,t){const i=await F_(t),n=N_(i);n.getContext("2d").getImageData(0,0,1,1);const{crop:r,detected:a}=await B_(n,e.url),o=In[s.id],l=o&&o.url===e.url?{cx:o.cx,cy:o.cy,h:o.h}:r,c={id:s.id,image:n,source:e,crop:l,auto:r,detected:a,head:document.createElement("canvas"),portrait:"",texture:null,meshCanvas:null,mesh:null,meshTexture:null,skin:null};return Gh(c,s),await bp(c),c}function Ap(){return new Promise((s,e)=>{const t=indexedDB.open("skf-faces",1);t.onupgradeneeded=()=>t.result.createObjectStore("uploads"),t.onsuccess=()=>s(t.result),t.onerror=()=>e(t.error)})}async function H_(){const s=await Ap();return new Promise((e,t)=>{const i={},r=s.transaction("uploads","readonly").objectStore("uploads").openCursor();r.onsuccess=()=>{const a=r.result;a?(i[String(a.key)]=a.value,a.continue()):e(i)},r.onerror=()=>t(r.error)})}async function wp(s,e){const t=await Ap();return new Promise((i,n)=>{const r=t.transaction("uploads","readwrite"),a=r.objectStore("uploads");e?a.put(e,s):a.delete(s),r.oncomplete=()=>i(),r.onerror=()=>n(r.error)})}async function G_(s){const e=new Map,t=[{host:"en.wikipedia.org",title:n=>o_[n.id]??n.name},{host:"he.wikipedia.org",title:n=>n.nameHe}];for(const{host:n,title:r}of t){const a=s.filter(o=>!e.has(o.id));if(a.length)for(let o=0;o<a.length;o+=45){const l=a.slice(o,o+45),c=l.map(r);try{const h=c_(await Qd(l_(n,c)),c);l.forEach((f,u)=>{const d=h[c[u]];d&&e.set(f.id,{...d,host:n})})}catch(h){console.warn(`Wikipedia lookup failed on ${n}`,h)}}}const i=new Map;for(const n of["en.wikipedia.org","he.wikipedia.org"]){const r=[...new Set([...e.values()].filter(a=>a.host===n).map(a=>a.file))];for(let a=0;a<r.length;a+=45)try{const o=u_(await Qd(h_(n,r.slice(a,a+45))));for(const[l,c]of Object.entries(o))i.set(`${n}:${l}`,c)}catch(o){console.warn("Licence lookup failed",o)}}for(const n of s){const r=e.get(n.id);if(!r)continue;const a=i.get(`${r.host}:${Xd(r.file)}`);a&&a.license&&!d_(a.license)||zh.set(n.id,{kind:"wiki",url:r.thumb,file:r.file,license:a?.license||"Free licence (see file page)",licenseUrl:a?.licenseUrl,artist:a?.artist||"Wikimedia Commons contributor",descUrl:a?.descUrl||`https://${r.host}/wiki/File:${encodeURIComponent(Xd(r.file))}`,pageUrl:`https://${r.host}/wiki/${encodeURIComponent(r.pageTitle.replace(/ /g,"_"))}`})}}async function Ep(s,e){const t=s.length;let i=0,n={};try{n=await H_()}catch{}try{await G_(s)}catch(o){console.warn("Photo lookup failed; using cartoon faces.",o)}const r=[...s],a=async()=>{for(;;){const o=r.shift();if(!o)return;try{const l=n[o.id];if(l){const c=URL.createObjectURL(l);Ei.set(o.id,await vo(o,{kind:"upload",url:`upload:${o.id}`},c))}else{const c=zh.get(o.id);c&&Ei.set(o.id,await vo(o,c,c.url))}}catch(l){console.warn(`No photo face for ${o.id}`,l)}i++,e?.(i,t)}};return await Promise.all([a(),a(),a(),a()]),jn++,Ei.size}function Fl(s,e){const t=Ei.get(s.id);t&&(t.crop={cx:e.cx,cy:e.cy,h:Math.max(.05,Math.min(3,e.h))},In[s.id]={...t.crop,url:t.source.url},xs("skf.faceCrops",In),Gh(t,s),jn++,Tp(t))}const Zd=new Map;function Tp(s){clearTimeout(Zd.get(s.id)),Zd.set(s.id,setTimeout(()=>{bp(s).then(()=>jn++).catch(()=>{})},400))}function V_(s){const e=Ei.get(s.id);e&&(delete In[s.id],xs("skf.faceCrops",In),e.crop={...e.auto},Gh(e,s),jn++,Tp(e))}async function W_(s,e){try{await wp(s.id,e).catch(()=>{});const t=URL.createObjectURL(e);delete In[s.id],xs("skf.faceCrops",In);const i=await vo(s,{kind:"upload",url:`upload:${s.id}:${Date.now()}`},t),n=Ei.get(s.id);return n?.texture&&(i.texture=n.texture,i.texture.image=i.head,i.texture.needsUpdate=!0),Ei.set(s.id,i),_p(s.id,!1),jn++,!0}catch(t){return console.warn("Upload failed",t),!1}}async function X_(s){await wp(s.id,null).catch(()=>{}),delete In[s.id],xs("skf.faceCrops",In);const e=zh.get(s.id),t=Ei.get(s.id);if(Ei.delete(s.id),e)try{const i=await vo(s,e,e.url);t?.texture&&(i.texture=t.texture,i.texture.image=i.head,i.texture.needsUpdate=!0),Ei.set(s.id,i)}catch{}jn++}class q_ extends _o{constructor(){super(),this.name="RoomEnvironment",this.position.y=-3.5;const e=new Le;e.deleteAttribute("uv");const t=new Ut({side:Zt}),i=new Ut,n=new zc(16777215,900,28,2);n.position.set(.418,16.199,.3),this.add(n);const r=new Ge(e,t);r.position.set(-.757,13.219,.717),r.scale.set(31.713,28.305,28.591),this.add(r);const a=new nr(e,i,6),o=new Ft;o.position.set(-10.906,2.009,1.846),o.rotation.set(0,-.195,0),o.scale.set(2.328,7.905,4.651),o.updateMatrix(),a.setMatrixAt(0,o.matrix),o.position.set(-5.607,-.754,-.758),o.rotation.set(0,.994,0),o.scale.set(1.97,1.534,3.955),o.updateMatrix(),a.setMatrixAt(1,o.matrix),o.position.set(6.167,.857,7.803),o.rotation.set(0,.561,0),o.scale.set(3.927,6.285,3.687),o.updateMatrix(),a.setMatrixAt(2,o.matrix),o.position.set(-2.017,.018,6.124),o.rotation.set(0,.333,0),o.scale.set(2.002,4.566,2.064),o.updateMatrix(),a.setMatrixAt(3,o.matrix),o.position.set(2.291,-.756,-2.621),o.rotation.set(0,-.286,0),o.scale.set(1.546,1.552,1.496),o.updateMatrix(),a.setMatrixAt(4,o.matrix),o.position.set(-2.193,-.369,-5.547),o.rotation.set(0,.516,0),o.scale.set(3.875,3.487,2.986),o.updateMatrix(),a.setMatrixAt(5,o.matrix),this.add(a);const l=new Ge(e,Vs(50));l.position.set(-16.116,14.37,8.208),l.scale.set(.1,2.428,2.739),this.add(l);const c=new Ge(e,Vs(50));c.position.set(-16.109,18.021,-8.207),c.scale.set(.1,2.425,2.751),this.add(c);const h=new Ge(e,Vs(17));h.position.set(14.904,12.198,-1.832),h.scale.set(.15,4.265,6.331),this.add(h);const f=new Ge(e,Vs(43));f.position.set(-.462,8.89,14.52),f.scale.set(4.38,5.441,.088),this.add(f);const u=new Ge(e,Vs(20));u.position.set(3.235,11.486,-12.541),u.scale.set(2.5,2,.1),this.add(u);const d=new Ge(e,Vs(100));d.position.set(0,20,0),d.scale.set(1,.1,1),this.add(d)}dispose(){const e=new Set;this.traverse(t=>{t.isMesh&&(e.add(t.geometry),e.add(t.material))});for(const t of e)t.dispose()}}function Vs(s){return new dg({color:0,emissive:16777215,emissiveIntensity:s})}const K_="varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",Y_=`uniform vec3 top; uniform vec3 horizon; uniform vec3 bottom; varying vec3 vP;
  void main(){ float h = vP.y; vec3 c = h > 0.0 ? mix(horizon, top, pow(h, 0.5)) : mix(horizon, bottom, pow(-h, 0.35));
  gl_FragColor = vec4(c, 1.0); }`;class $_{pmrem;cache=new Map;constructor(e){this.pmrem=new Hc(e)}studio(){let e=this.cache.get("studio");if(!e){const t=new q_;e=this.pmrem.fromScene(t,.04).texture,t.traverse(i=>{const n=i;n.geometry?.dispose(),n.material?.dispose()}),this.cache.set("studio",e)}return e}fromSpec(e,t){const i=this.cache.get(e);if(i)return i;const n=new _o,r=new Ge(new Oe(50,32,16),new Ot({side:Zt,uniforms:{top:{value:new Te(t.top)},horizon:{value:new Te(t.horizon)},bottom:{value:new Te(t.bottom)}},vertexShader:K_,fragmentShader:Y_}));n.add(r);for(const o of t.lights??[]){const l=new L(...o.dir).normalize(),c=new Ge(new Oi(o.size,o.size),new _i({color:new Te(o.color).multiplyScalar(o.intensity),side:oi}));c.position.copy(l.multiplyScalar(40)),c.lookAt(0,0,0),n.add(c)}const a=this.pmrem.fromScene(n,.03).texture;return n.traverse(o=>{const l=o;l.geometry?.dispose(),l.material?.dispose()}),this.cache.set(e,a),a}}const ds={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`};class ys{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const Q_=new So(-1,1,1,-1,0,1);class Z_ extends It{constructor(){super(),this.setAttribute("position",new ot([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new ot([0,2,0,0,2,0],2))}}const J_=new Z_;class Po{constructor(e){this._mesh=new Ge(J_,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,Q_)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}}class Cp extends ys{constructor(e,t="tDiffuse"){super(),this.textureID=t,this.uniforms=null,this.material=null,e instanceof Ot?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=rn.clone(e.uniforms),this.material=new Ot({name:e.name!==void 0?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this._fsQuad=new Po(this.material)}render(e,t,i){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=i.texture),this._fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}class Jd extends ys{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,i){const n=e.getContext(),r=e.state;r.buffers.color.setMask(!1),r.buffers.depth.setMask(!1),r.buffers.color.setLocked(!0),r.buffers.depth.setLocked(!0);let a,o;this.inverse?(a=0,o=1):(a=1,o=0),r.buffers.stencil.setTest(!0),r.buffers.stencil.setOp(n.REPLACE,n.REPLACE,n.REPLACE),r.buffers.stencil.setFunc(n.ALWAYS,a,4294967295),r.buffers.stencil.setClear(o),r.buffers.stencil.setLocked(!0),e.setRenderTarget(i),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),r.buffers.color.setLocked(!1),r.buffers.depth.setLocked(!1),r.buffers.color.setMask(!0),r.buffers.depth.setMask(!0),r.buffers.stencil.setLocked(!1),r.buffers.stencil.setFunc(n.EQUAL,1,4294967295),r.buffers.stencil.setOp(n.KEEP,n.KEEP,n.KEEP),r.buffers.stencil.setLocked(!0)}}class j_ extends ys{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}}class eS{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),t===void 0){const i=e.getSize(new le);this._width=i.width,this._height=i.height,t=new ai(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:li}),t.texture.name="EffectComposer.rt1"}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new Cp(ds),this.copyPass.material.blending=ni,this.timer=new yg}swapBuffers(){const e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){const t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){this.timer.update(),e===void 0&&(e=this.timer.getDelta());const t=this.renderer.getRenderTarget();let i=!1;for(let n=0,r=this.passes.length;n<r;n++){const a=this.passes[n];if(a.enabled!==!1){if(a.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(n),a.render(this.renderer,this.writeBuffer,this.readBuffer,e,i),a.needsSwap){if(i){const o=this.renderer.getContext(),l=this.renderer.state.buffers.stencil;l.setFunc(o.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),l.setFunc(o.EQUAL,1,4294967295)}this.swapBuffers()}Jd!==void 0&&(a instanceof Jd?i=!0:a instanceof j_&&(i=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){const t=this.renderer.getSize(new le);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;const i=this._width*this._pixelRatio,n=this._height*this._pixelRatio;this.renderTarget1.setSize(i,n),this.renderTarget2.setSize(i,n);for(let r=0;r<this.passes.length;r++)this.passes[r].setSize(i,n)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}const qa={defines:{PERSPECTIVE_CAMERA:1,SAMPLES:16,NORMAL_VECTOR_TYPE:1,DEPTH_SWIZZLING:"x",SCREEN_SPACE_RADIUS:0,SCREEN_SPACE_RADIUS_SCALE:100,SCENE_CLIP_BOX:0},uniforms:{tNormal:{value:null},tDepth:{value:null},tNoise:{value:null},resolution:{value:new le},cameraNear:{value:null},cameraFar:{value:null},cameraProjectionMatrix:{value:new rt},cameraProjectionMatrixInverse:{value:new rt},cameraWorldMatrix:{value:new rt},radius:{value:.25},distanceExponent:{value:1},thickness:{value:1},distanceFallOff:{value:1},scale:{value:1},sceneBoxMin:{value:new L(-1,-1,-1)},sceneBoxMax:{value:new L(1,1,1)}},vertexShader:`

		varying vec2 vUv;

		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,fragmentShader:`
		varying vec2 vUv;
		uniform highp sampler2D tNormal;
		uniform highp sampler2D tDepth;
		uniform sampler2D tNoise;
		uniform vec2 resolution;
		uniform float cameraNear;
		uniform float cameraFar;
		uniform mat4 cameraProjectionMatrix;
		uniform mat4 cameraProjectionMatrixInverse;
		uniform mat4 cameraWorldMatrix;
		uniform float radius;
		uniform float distanceExponent;
		uniform float thickness;
		uniform float distanceFallOff;
		uniform float scale;
		#if SCENE_CLIP_BOX == 1
			uniform vec3 sceneBoxMin;
			uniform vec3 sceneBoxMax;
		#endif

		#include <common>
		#include <packing>

		#ifndef FRAGMENT_OUTPUT
		#define FRAGMENT_OUTPUT vec4(vec3(ao), 1.)
		#endif

		vec3 getViewPosition( const in vec2 screenPosition, const in float depth ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				vec4 clipSpacePosition = vec4( vec2( screenPosition ) * 2.0 - 1.0, depth, 1.0 );
			#else
				vec4 clipSpacePosition = vec4( vec3( screenPosition, depth ) * 2.0 - 1.0, 1.0 );
			#endif
			vec4 viewSpacePosition = cameraProjectionMatrixInverse * clipSpacePosition;
			return viewSpacePosition.xyz / viewSpacePosition.w;
		}

		float getDepth(const vec2 uv) {
			return textureLod(tDepth, uv.xy, 0.0).DEPTH_SWIZZLING;
		}

		float fetchDepth(const ivec2 uv) {
			return texelFetch(tDepth, uv.xy, 0).DEPTH_SWIZZLING;
		}

		float getViewZ(const in float depth) {
			#if PERSPECTIVE_CAMERA == 1
				return perspectiveDepthToViewZ(depth, cameraNear, cameraFar);
			#else
				return orthographicDepthToViewZ(depth, cameraNear, cameraFar);
			#endif
		}

		vec3 computeNormalFromDepth(const vec2 uv) {
			vec2 size = vec2(textureSize(tDepth, 0));
			ivec2 p = ivec2(uv * size);
			float c0 = fetchDepth(p);
			float l2 = fetchDepth(p - ivec2(2, 0));
			float l1 = fetchDepth(p - ivec2(1, 0));
			float r1 = fetchDepth(p + ivec2(1, 0));
			float r2 = fetchDepth(p + ivec2(2, 0));
			float b2 = fetchDepth(p - ivec2(0, 2));
			float b1 = fetchDepth(p - ivec2(0, 1));
			float t1 = fetchDepth(p + ivec2(0, 1));
			float t2 = fetchDepth(p + ivec2(0, 2));
			float dl = abs((2.0 * l1 - l2) - c0);
			float dr = abs((2.0 * r1 - r2) - c0);
			float db = abs((2.0 * b1 - b2) - c0);
			float dt = abs((2.0 * t1 - t2) - c0);
			vec3 ce = getViewPosition(uv, c0).xyz;
			vec3 dpdx = (dl < dr) ? ce - getViewPosition((uv - vec2(1.0 / size.x, 0.0)), l1).xyz : -ce + getViewPosition((uv + vec2(1.0 / size.x, 0.0)), r1).xyz;
			vec3 dpdy = (db < dt) ? ce - getViewPosition((uv - vec2(0.0, 1.0 / size.y)), b1).xyz : -ce + getViewPosition((uv + vec2(0.0, 1.0 / size.y)), t1).xyz;
			return normalize(cross(dpdx, dpdy));
		}

		vec3 getViewNormal(const vec2 uv) {
			#if NORMAL_VECTOR_TYPE == 2
				return normalize(textureLod(tNormal, uv, 0.).rgb);
			#elif NORMAL_VECTOR_TYPE == 1
				return unpackRGBToNormal(textureLod(tNormal, uv, 0.).rgb);
			#else
				return computeNormalFromDepth(uv);
			#endif
		}

		vec3 getSceneUvAndDepth(vec3 sampleViewPos) {
			vec4 sampleClipPos = cameraProjectionMatrix * vec4(sampleViewPos, 1.);
			vec2 sampleUv = sampleClipPos.xy / sampleClipPos.w * 0.5 + 0.5;
			float sampleSceneDepth = getDepth(sampleUv);
			return vec3(sampleUv, sampleSceneDepth);
		}

		void main() {
			float depth = getDepth(vUv.xy);

			#ifdef USE_REVERSED_DEPTH_BUFFER
				if (depth <= 0.0) {
					discard;
					return;
				}
			#else
				if (depth >= 1.0) {
					discard;
					return;
				}
			#endif
			
			vec3 viewPos = getViewPosition(vUv, depth);
			vec3 viewNormal = getViewNormal(vUv);

			float radiusToUse = radius;
			float distanceFalloffToUse = thickness;
			#if SCREEN_SPACE_RADIUS == 1
				float radiusScale = getViewPosition(vec2(0.5 + float(SCREEN_SPACE_RADIUS_SCALE) / resolution.x, 0.0), depth).x;
				radiusToUse *= radiusScale;
				distanceFalloffToUse *= radiusScale;
			#endif

			#if SCENE_CLIP_BOX == 1
				vec3 worldPos = (cameraWorldMatrix * vec4(viewPos, 1.0)).xyz;
				float boxDistance = length(max(vec3(0.0), max(sceneBoxMin - worldPos, worldPos - sceneBoxMax)));
				if (boxDistance > radiusToUse) {
					discard;
					return;
				}
			#endif

			vec2 noiseResolution = vec2(textureSize(tNoise, 0));
			vec2 noiseUv = vUv * resolution / noiseResolution;
			vec4 noiseTexel = textureLod(tNoise, noiseUv, 0.0);
			vec3 randomVec = noiseTexel.xyz * 2.0 - 1.0;
			vec3 tangent = normalize(vec3(randomVec.xy, 0.));
			vec3 bitangent = vec3(-tangent.y, tangent.x, 0.);
			mat3 kernelMatrix = mat3(tangent, bitangent, vec3(0., 0., 1.));

			const int DIRECTIONS = SAMPLES < 30 ? 3 : 5;
			const int STEPS = (SAMPLES + DIRECTIONS - 1) / DIRECTIONS;
			float ao = 0.0;
			for (int i = 0; i < DIRECTIONS; ++i) {

				float angle = float(i) / float(DIRECTIONS) * PI;
				vec4 sampleDir = vec4(cos(angle), sin(angle), 0., 0.5 + 0.5 * noiseTexel.w);
				sampleDir.xyz = normalize(kernelMatrix * sampleDir.xyz);

				vec3 viewDir = normalize(-viewPos.xyz);
				vec3 sliceBitangent = normalize(cross(sampleDir.xyz, viewDir));
				vec3 sliceTangent = cross(sliceBitangent, viewDir);
				vec3 normalInSlice = normalize(viewNormal - sliceBitangent * dot(viewNormal, sliceBitangent));

				vec3 tangentToNormalInSlice = cross(normalInSlice, sliceBitangent);
				vec2 cosHorizons = vec2(dot(viewDir, tangentToNormalInSlice), dot(viewDir, -tangentToNormalInSlice));

				for (int j = 0; j < STEPS; ++j) {
					vec3 sampleViewOffset = sampleDir.xyz * radiusToUse * sampleDir.w * pow(float(j + 1) / float(STEPS), distanceExponent);

					vec3 sampleSceneUvDepth = getSceneUvAndDepth(viewPos + sampleViewOffset);
					vec3 sampleSceneViewPos = getViewPosition(sampleSceneUvDepth.xy, sampleSceneUvDepth.z);
					vec3 viewDelta = sampleSceneViewPos - viewPos;
					if (abs(viewDelta.z) < thickness) {
						float sampleCosHorizon = dot(viewDir, normalize(viewDelta));
						cosHorizons.x += max(0., (sampleCosHorizon - cosHorizons.x) * mix(1., 2. / float(j + 2), distanceFallOff));
					}

					sampleSceneUvDepth = getSceneUvAndDepth(viewPos - sampleViewOffset);
					sampleSceneViewPos = getViewPosition(sampleSceneUvDepth.xy, sampleSceneUvDepth.z);
					viewDelta = sampleSceneViewPos - viewPos;
					if (abs(viewDelta.z) < thickness) {
						float sampleCosHorizon = dot(viewDir, normalize(viewDelta));
						cosHorizons.y += max(0., (sampleCosHorizon - cosHorizons.y) * mix(1., 2. / float(j + 2), distanceFallOff));
					}
				}

				vec2 sinHorizons = sqrt(1. - cosHorizons * cosHorizons);
				float nx = dot(normalInSlice, sliceTangent);
				float ny = dot(normalInSlice, viewDir);
				float nxb = 1. / 2. * (acos(cosHorizons.y) - acos(cosHorizons.x) + sinHorizons.x * cosHorizons.x - sinHorizons.y * cosHorizons.y);
				float nyb = 1. / 2. * (2. - cosHorizons.x * cosHorizons.x - cosHorizons.y * cosHorizons.y);
				float occlusion = nx * nxb + ny * nyb;
				ao += occlusion;
			}

			ao = clamp(ao / float(DIRECTIONS), 0., 1.);
		#if SCENE_CLIP_BOX == 1
			ao = mix(ao, 1., smoothstep(0., radiusToUse, boxDistance));
		#endif
			ao = pow(ao, scale);

			gl_FragColor = FRAGMENT_OUTPUT;
		}`},Ka={defines:{PERSPECTIVE_CAMERA:1},uniforms:{tDepth:{value:null},cameraNear:{value:null},cameraFar:{value:null}},vertexShader:`
		varying vec2 vUv;

		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,fragmentShader:`
		uniform sampler2D tDepth;
		uniform float cameraNear;
		uniform float cameraFar;
		varying vec2 vUv;

		#include <packing>

		float getLinearDepth( const in vec2 screenPosition ) {
			#if PERSPECTIVE_CAMERA == 1
				float fragCoordZ = texture2D( tDepth, screenPosition ).x;
				float viewZ = perspectiveDepthToViewZ( fragCoordZ, cameraNear, cameraFar );
				return viewZToOrthographicDepth( viewZ, cameraNear, cameraFar );
			#else
				return texture2D( tDepth, screenPosition ).x;
			#endif
		}

		void main() {
			float depth = getLinearDepth( vUv );
			gl_FragColor = vec4( vec3( 1.0 - depth ), 1.0 );

		}`},Nl={uniforms:{tDiffuse:{value:null},intensity:{value:1}},vertexShader:`
		varying vec2 vUv;

		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,fragmentShader:`
		uniform float intensity;
		uniform sampler2D tDiffuse;
		varying vec2 vUv;

		void main() {
			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = vec4(mix(vec3(1.), texel.rgb, intensity), texel.a);
		}`};function tS(s=5){const e=Math.floor(s)%2===0?Math.floor(s)+1:Math.floor(s),t=iS(e),i=t.length,n=new Uint8Array(i*4);for(let a=0;a<i;++a){const o=t[a],l=2*Math.PI*o/i,c=new L(Math.cos(l),Math.sin(l),0).normalize();n[a*4]=(c.x*.5+.5)*255,n[a*4+1]=(c.y*.5+.5)*255,n[a*4+2]=127,n[a*4+3]=255}const r=new ea(n,e,e);return r.wrapS=Wi,r.wrapT=Wi,r.needsUpdate=!0,r}function iS(s){const e=Math.floor(s)%2===0?Math.floor(s)+1:Math.floor(s),t=e*e,i=Array(t).fill(0);let n=Math.floor(e/2),r=e-1;for(let a=1;a<=t;){if(n===-1&&r===e?(r=e-2,n=0):(r===e&&(r=0),n<0&&(n=e-1)),i[n*e+r]!==0){r-=2,n++;continue}else i[n*e+r]=a++;r++,n--}return i}const Ya={defines:{SAMPLES:16,SAMPLE_VECTORS:Pp(16,2,1),NORMAL_VECTOR_TYPE:1,DEPTH_VALUE_SOURCE:0},uniforms:{tDiffuse:{value:null},tNormal:{value:null},tDepth:{value:null},tNoise:{value:null},resolution:{value:new le},cameraProjectionMatrixInverse:{value:new rt},lumaPhi:{value:5},depthPhi:{value:5},normalPhi:{value:5},radius:{value:4},index:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,fragmentShader:`

		varying vec2 vUv;

		uniform sampler2D tDiffuse;
		uniform sampler2D tNormal;
		uniform sampler2D tDepth;
		uniform sampler2D tNoise;
		uniform vec2 resolution;
		uniform mat4 cameraProjectionMatrixInverse;
		uniform float lumaPhi;
		uniform float depthPhi;
		uniform float normalPhi;
		uniform float radius;
		uniform int index;

		#include <common>
		#include <packing>

		#ifndef SAMPLE_LUMINANCE
		#define SAMPLE_LUMINANCE dot(vec3(0.2125, 0.7154, 0.0721), a)
		#endif

		#ifndef FRAGMENT_OUTPUT
		#define FRAGMENT_OUTPUT vec4(denoised, 1.)
		#endif

		float getLuminance(const in vec3 a) {
			return SAMPLE_LUMINANCE;
		}

		const vec3 poissonDisk[SAMPLES] = SAMPLE_VECTORS;

		vec3 getViewPosition( const in vec2 screenPosition, const in float depth ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				vec4 clipSpacePosition = vec4( vec2( screenPosition ) * 2.0 - 1.0, depth, 1.0 );
			#else
				vec4 clipSpacePosition = vec4( vec3( screenPosition, depth ) * 2.0 - 1.0, 1.0 );
			#endif
			vec4 viewSpacePosition = cameraProjectionMatrixInverse * clipSpacePosition;
			return viewSpacePosition.xyz / viewSpacePosition.w;
		}

		float getDepth(const vec2 uv) {
		#if DEPTH_VALUE_SOURCE == 1
			return textureLod(tDepth, uv.xy, 0.0).a;
		#else
			return textureLod(tDepth, uv.xy, 0.0).r;
		#endif
		}

		float fetchDepth(const ivec2 uv) {
			#if DEPTH_VALUE_SOURCE == 1
				return texelFetch(tDepth, uv.xy, 0).a;
			#else
				return texelFetch(tDepth, uv.xy, 0).r;
			#endif
		}

		vec3 computeNormalFromDepth(const vec2 uv) {
			vec2 size = vec2(textureSize(tDepth, 0));
			ivec2 p = ivec2(uv * size);
			float c0 = fetchDepth(p);
			float l2 = fetchDepth(p - ivec2(2, 0));
			float l1 = fetchDepth(p - ivec2(1, 0));
			float r1 = fetchDepth(p + ivec2(1, 0));
			float r2 = fetchDepth(p + ivec2(2, 0));
			float b2 = fetchDepth(p - ivec2(0, 2));
			float b1 = fetchDepth(p - ivec2(0, 1));
			float t1 = fetchDepth(p + ivec2(0, 1));
			float t2 = fetchDepth(p + ivec2(0, 2));
			float dl = abs((2.0 * l1 - l2) - c0);
			float dr = abs((2.0 * r1 - r2) - c0);
			float db = abs((2.0 * b1 - b2) - c0);
			float dt = abs((2.0 * t1 - t2) - c0);
			vec3 ce = getViewPosition(uv, c0).xyz;
			vec3 dpdx = (dl < dr) ?  ce - getViewPosition((uv - vec2(1.0 / size.x, 0.0)), l1).xyz
									: -ce + getViewPosition((uv + vec2(1.0 / size.x, 0.0)), r1).xyz;
			vec3 dpdy = (db < dt) ?  ce - getViewPosition((uv - vec2(0.0, 1.0 / size.y)), b1).xyz
									: -ce + getViewPosition((uv + vec2(0.0, 1.0 / size.y)), t1).xyz;
			return normalize(cross(dpdx, dpdy));
		}

		vec3 getViewNormal(const vec2 uv) {
		#if NORMAL_VECTOR_TYPE == 2
			return normalize(textureLod(tNormal, uv, 0.).rgb);
		#elif NORMAL_VECTOR_TYPE == 1
			return unpackRGBToNormal(textureLod(tNormal, uv, 0.).rgb);
		#else
			return computeNormalFromDepth(uv);
		#endif
		}

		void denoiseSample(in vec3 center, in vec3 viewNormal, in vec3 viewPos, in vec2 sampleUv, inout vec3 denoised, inout float totalWeight) {
			vec4 sampleTexel = textureLod(tDiffuse, sampleUv, 0.0);
			float sampleDepth = getDepth(sampleUv);
			vec3 sampleNormal = getViewNormal(sampleUv);
			vec3 neighborColor = sampleTexel.rgb;
			vec3 viewPosSample = getViewPosition(sampleUv, sampleDepth);

			float normalDiff = dot(viewNormal, sampleNormal);
			float normalSimilarity = pow(max(normalDiff, 0.), normalPhi);
			float lumaDiff = abs(getLuminance(neighborColor) - getLuminance(center));
			float lumaSimilarity = max(1.0 - lumaDiff / lumaPhi, 0.0);
			float depthDiff = abs(dot(viewPos - viewPosSample, viewNormal));
			float depthSimilarity = max(1. - depthDiff / depthPhi, 0.);
			float w = lumaSimilarity * depthSimilarity * normalSimilarity;

			denoised += w * neighborColor;
			totalWeight += w;
		}

		void main() {
			float depth = getDepth(vUv.xy);
			vec3 viewNormal = getViewNormal(vUv);
			if (depth == 1. || dot(viewNormal, viewNormal) == 0.) {
				discard;
				return;
			}
			vec4 texel = textureLod(tDiffuse, vUv, 0.0);
			vec3 center = texel.rgb;
			vec3 viewPos = getViewPosition(vUv, depth);

			vec2 noiseResolution = vec2(textureSize(tNoise, 0));
			vec2 noiseUv = vUv * resolution / noiseResolution;
			vec4 noiseTexel = textureLod(tNoise, noiseUv, 0.0);
      		vec2 noiseVec = vec2(sin(noiseTexel[index % 4] * 2. * PI), cos(noiseTexel[index % 4] * 2. * PI));
    		mat2 rotationMatrix = mat2(noiseVec.x, -noiseVec.y, noiseVec.x, noiseVec.y);

			float totalWeight = 1.0;
			vec3 denoised = texel.rgb;
			for (int i = 0; i < SAMPLES; i++) {
				vec3 sampleDir = poissonDisk[i];
				vec2 offset = rotationMatrix * (sampleDir.xy * (1. + sampleDir.z * (radius - 1.)) / resolution);
				vec2 sampleUv = vUv + offset;
				denoiseSample(center, viewNormal, viewPos, sampleUv, denoised, totalWeight);
			}

			if (totalWeight > 0.) {
				denoised /= totalWeight;
			}
			gl_FragColor = FRAGMENT_OUTPUT;
		}`};function Pp(s,e,t){const i=nS(s,e,t);let n="vec3[SAMPLES](";for(let r=0;r<s;r++){const a=i[r];n+=`vec3(${a.x}, ${a.y}, ${a.z})${r<s-1?",":")"}`}return n}function nS(s,e,t){const i=[];for(let n=0;n<s;n++){const r=2*Math.PI*e*n/s,a=Math.pow(n/(s-1),t);i.push(new L(Math.cos(r),Math.sin(r),a))}return i}class sS{constructor(e=Math){this.grad3=[[1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],[1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],[0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]],this.grad4=[[0,1,1,1],[0,1,1,-1],[0,1,-1,1],[0,1,-1,-1],[0,-1,1,1],[0,-1,1,-1],[0,-1,-1,1],[0,-1,-1,-1],[1,0,1,1],[1,0,1,-1],[1,0,-1,1],[1,0,-1,-1],[-1,0,1,1],[-1,0,1,-1],[-1,0,-1,1],[-1,0,-1,-1],[1,1,0,1],[1,1,0,-1],[1,-1,0,1],[1,-1,0,-1],[-1,1,0,1],[-1,1,0,-1],[-1,-1,0,1],[-1,-1,0,-1],[1,1,1,0],[1,1,-1,0],[1,-1,1,0],[1,-1,-1,0],[-1,1,1,0],[-1,1,-1,0],[-1,-1,1,0],[-1,-1,-1,0]],this.p=[];for(let t=0;t<256;t++)this.p[t]=Math.floor(e.random()*256);this.perm=[];for(let t=0;t<512;t++)this.perm[t]=this.p[t&255];this.simplex=[[0,1,2,3],[0,1,3,2],[0,0,0,0],[0,2,3,1],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,2,3,0],[0,2,1,3],[0,0,0,0],[0,3,1,2],[0,3,2,1],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,3,2,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,2,0,3],[0,0,0,0],[1,3,0,2],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,3,0,1],[2,3,1,0],[1,0,2,3],[1,0,3,2],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,0,3,1],[0,0,0,0],[2,1,3,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,0,1,3],[0,0,0,0],[0,0,0,0],[0,0,0,0],[3,0,1,2],[3,0,2,1],[0,0,0,0],[3,1,2,0],[2,1,0,3],[0,0,0,0],[0,0,0,0],[0,0,0,0],[3,1,0,2],[0,0,0,0],[3,2,0,1],[3,2,1,0]]}noise(e,t){let i,n,r;const a=.5*(Math.sqrt(3)-1),o=(e+t)*a,l=Math.floor(e+o),c=Math.floor(t+o),h=(3-Math.sqrt(3))/6,f=(l+c)*h,u=l-f,d=c-f,m=e-u,v=t-d;let p,g;m>v?(p=1,g=0):(p=0,g=1);const y=m-p+h,E=v-g+h,M=m-1+2*h,b=v-1+2*h,S=l&255,w=c&255,x=this.perm[S+this.perm[w]]%12,A=this.perm[S+p+this.perm[w+g]]%12,C=this.perm[S+1+this.perm[w+1]]%12;let R=.5-m*m-v*v;R<0?i=0:(R*=R,i=R*R*this._dot(this.grad3[x],m,v));let D=.5-y*y-E*E;D<0?n=0:(D*=D,n=D*D*this._dot(this.grad3[A],y,E));let B=.5-M*M-b*b;return B<0?r=0:(B*=B,r=B*B*this._dot(this.grad3[C],M,b)),70*(i+n+r)}noise3d(e,t,i){let n,r,a,o;const c=(e+t+i)*.3333333333333333,h=Math.floor(e+c),f=Math.floor(t+c),u=Math.floor(i+c),d=1/6,m=(h+f+u)*d,v=h-m,p=f-m,g=u-m,y=e-v,E=t-p,M=i-g;let b,S,w,x,A,C;y>=E?E>=M?(b=1,S=0,w=0,x=1,A=1,C=0):y>=M?(b=1,S=0,w=0,x=1,A=0,C=1):(b=0,S=0,w=1,x=1,A=0,C=1):E<M?(b=0,S=0,w=1,x=0,A=1,C=1):y<M?(b=0,S=1,w=0,x=0,A=1,C=1):(b=0,S=1,w=0,x=1,A=1,C=0);const R=y-b+d,D=E-S+d,B=M-w+d,k=y-x+2*d,N=E-A+2*d,G=M-C+2*d,H=y-1+3*d,se=E-1+3*d,V=M-1+3*d,j=h&255,J=f&255,we=u&255,ce=this.perm[j+this.perm[J+this.perm[we]]]%12,ct=this.perm[j+b+this.perm[J+S+this.perm[we+w]]]%12,tt=this.perm[j+x+this.perm[J+A+this.perm[we+C]]]%12,Je=this.perm[j+1+this.perm[J+1+this.perm[we+1]]]%12;let q=.6-y*y-E*E-M*M;q<0?n=0:(q*=q,n=q*q*this._dot3(this.grad3[ce],y,E,M));let te=.6-R*R-D*D-B*B;te<0?r=0:(te*=te,r=te*te*this._dot3(this.grad3[ct],R,D,B));let ee=.6-k*k-N*N-G*G;ee<0?a=0:(ee*=ee,a=ee*ee*this._dot3(this.grad3[tt],k,N,G));let be=.6-H*H-se*se-V*V;return be<0?o=0:(be*=be,o=be*be*this._dot3(this.grad3[Je],H,se,V)),32*(n+r+a+o)}noise4d(e,t,i,n){const r=this.grad4,a=this.simplex,o=this.perm,l=(Math.sqrt(5)-1)/4,c=(5-Math.sqrt(5))/20;let h,f,u,d,m;const v=(e+t+i+n)*l,p=Math.floor(e+v),g=Math.floor(t+v),y=Math.floor(i+v),E=Math.floor(n+v),M=(p+g+y+E)*c,b=p-M,S=g-M,w=y-M,x=E-M,A=e-b,C=t-S,R=i-w,D=n-x,B=A>C?32:0,k=A>R?16:0,N=C>R?8:0,G=A>D?4:0,H=C>D?2:0,se=R>D?1:0,V=B+k+N+G+H+se,j=a[V][0]>=3?1:0,J=a[V][1]>=3?1:0,we=a[V][2]>=3?1:0,ce=a[V][3]>=3?1:0,ct=a[V][0]>=2?1:0,tt=a[V][1]>=2?1:0,Je=a[V][2]>=2?1:0,q=a[V][3]>=2?1:0,te=a[V][0]>=1?1:0,ee=a[V][1]>=1?1:0,be=a[V][2]>=1?1:0,Me=a[V][3]>=1?1:0,Ie=A-j+c,nt=C-J+c,ie=R-we+c,re=D-ce+c,he=A-ct+2*c,ue=C-tt+2*c,xe=R-Je+2*c,Ye=D-q+2*c,We=A-te+3*c,Ve=C-ee+3*c,Qe=R-be+3*c,U=D-Me+3*c,pt=A-1+4*c,st=C-1+4*c,P=R-1+4*c,_=D-1+4*c,O=p&255,z=g&255,Y=y&255,de=E&255,ye=o[O+o[z+o[Y+o[de]]]]%32,Z=o[O+j+o[z+J+o[Y+we+o[de+ce]]]]%32,ne=o[O+ct+o[z+tt+o[Y+Je+o[de+q]]]]%32,Se=o[O+te+o[z+ee+o[Y+be+o[de+Me]]]]%32,Fe=o[O+1+o[z+1+o[Y+1+o[de+1]]]]%32;let _e=.6-A*A-C*C-R*R-D*D;_e<0?h=0:(_e*=_e,h=_e*_e*this._dot4(r[ye],A,C,R,D));let ve=.6-Ie*Ie-nt*nt-ie*ie-re*re;ve<0?f=0:(ve*=ve,f=ve*ve*this._dot4(r[Z],Ie,nt,ie,re));let De=.6-he*he-ue*ue-xe*xe-Ye*Ye;De<0?u=0:(De*=De,u=De*De*this._dot4(r[ne],he,ue,xe,Ye));let ae=.6-We*We-Ve*Ve-Qe*Qe-U*U;ae<0?d=0:(ae*=ae,d=ae*ae*this._dot4(r[Se],We,Ve,Qe,U));let pe=.6-pt*pt-st*st-P*P-_*_;return pe<0?m=0:(pe*=pe,m=pe*pe*this._dot4(r[Fe],pt,st,P,_)),27*(h+f+u+d+m)}_dot(e,t,i){return e[0]*t+e[1]*i}_dot3(e,t,i,n){return e[0]*t+e[1]*i+e[2]*n}_dot4(e,t,i,n,r){return e[0]*t+e[1]*i+e[2]*n+e[3]*r}}class Ji extends ys{constructor(e,t,i=512,n=512,r,a,o){super(),this.width=i,this.height=n,this.clear=!0,this.camera=t,this.scene=e,this.output=0,this._renderGBuffer=!0,this._visibilityCache=[],this.blendIntensity=1,this.pdRings=2,this.pdRadiusExponent=2,this.pdSamples=16,this.gtaoNoiseTexture=tS(),this.pdNoiseTexture=this._generateNoise(),this.gtaoRenderTarget=new ai(this.width,this.height,{type:li,depthBuffer:!1}),this.pdRenderTarget=this.gtaoRenderTarget.clone(),this.gtaoMaterial=new Ot({defines:Object.assign({},qa.defines),uniforms:rn.clone(qa.uniforms),vertexShader:qa.vertexShader,fragmentShader:qa.fragmentShader,blending:ni,depthTest:!1,depthWrite:!1}),this.gtaoMaterial.defines.PERSPECTIVE_CAMERA=this.camera.isPerspectiveCamera?1:0,this.gtaoMaterial.uniforms.tNoise.value=this.gtaoNoiseTexture,this.gtaoMaterial.uniforms.resolution.value.set(this.width,this.height),this.gtaoMaterial.uniforms.cameraNear.value=this.camera.near,this.gtaoMaterial.uniforms.cameraFar.value=this.camera.far,this.normalMaterial=new ug,this.normalMaterial.blending=ni,this.pdMaterial=new Ot({defines:Object.assign({},Ya.defines),uniforms:rn.clone(Ya.uniforms),vertexShader:Ya.vertexShader,fragmentShader:Ya.fragmentShader,depthTest:!1,depthWrite:!1}),this.pdMaterial.uniforms.tDiffuse.value=this.gtaoRenderTarget.texture,this.pdMaterial.uniforms.tNoise.value=this.pdNoiseTexture,this.pdMaterial.uniforms.resolution.value.set(this.width,this.height),this.pdMaterial.uniforms.lumaPhi.value=10,this.pdMaterial.uniforms.depthPhi.value=2,this.pdMaterial.uniforms.normalPhi.value=3,this.pdMaterial.uniforms.radius.value=8,this.depthRenderMaterial=new Ot({defines:Object.assign({},Ka.defines),uniforms:rn.clone(Ka.uniforms),vertexShader:Ka.vertexShader,fragmentShader:Ka.fragmentShader,blending:ni}),this.depthRenderMaterial.uniforms.cameraNear.value=this.camera.near,this.depthRenderMaterial.uniforms.cameraFar.value=this.camera.far,this.copyMaterial=new Ot({uniforms:rn.clone(ds.uniforms),vertexShader:ds.vertexShader,fragmentShader:ds.fragmentShader,transparent:!0,depthTest:!1,depthWrite:!1,blendSrc:$l,blendDst:Lr,blendEquation:nn,blendSrcAlpha:Yl,blendDstAlpha:Lr,blendEquationAlpha:nn}),this.blendMaterial=new Ot({uniforms:rn.clone(Nl.uniforms),vertexShader:Nl.vertexShader,fragmentShader:Nl.fragmentShader,transparent:!0,depthTest:!1,depthWrite:!1,blending:xf,blendSrc:$l,blendDst:Lr,blendEquation:nn,blendSrcAlpha:Yl,blendDstAlpha:Lr,blendEquationAlpha:nn}),this._fsQuad=new Po(null),this._originalClearColor=new Te,this.setGBuffer(r?r.depthTexture:void 0,r?r.normalTexture:void 0),a!==void 0&&this.updateGtaoMaterial(a),o!==void 0&&this.updatePdMaterial(o)}setSize(e,t){this.width=e,this.height=t,this.gtaoRenderTarget.setSize(e,t),this.normalRenderTarget.setSize(e,t),this.pdRenderTarget.setSize(e,t),this.gtaoMaterial.uniforms.resolution.value.set(e,t),this.gtaoMaterial.uniforms.cameraProjectionMatrix.value.copy(this.camera.projectionMatrix),this.gtaoMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse),this.pdMaterial.uniforms.resolution.value.set(e,t),this.pdMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse)}dispose(){this.gtaoNoiseTexture.dispose(),this.pdNoiseTexture.dispose(),this.normalRenderTarget.dispose(),this.gtaoRenderTarget.dispose(),this.pdRenderTarget.dispose(),this.normalMaterial.dispose(),this.pdMaterial.dispose(),this.copyMaterial.dispose(),this.depthRenderMaterial.dispose(),this._fsQuad.dispose()}get gtaoMap(){return this.pdRenderTarget.texture}setGBuffer(e,t){e!==void 0?(this.depthTexture=e,this.normalTexture=t,this._renderGBuffer=!1):(this.depthTexture=new sr,this.depthTexture.format=Kn,this.depthTexture.type=ir,this.normalRenderTarget=new ai(this.width,this.height,{minFilter:Qt,magFilter:Qt,type:li,depthTexture:this.depthTexture}),this.normalTexture=this.normalRenderTarget.texture,this._renderGBuffer=!0);const i=this.normalTexture?1:0,n=this.depthTexture===this.normalTexture?"w":"x";this.gtaoMaterial.defines.NORMAL_VECTOR_TYPE=i,this.gtaoMaterial.defines.DEPTH_SWIZZLING=n,this.gtaoMaterial.uniforms.tNormal.value=this.normalTexture,this.gtaoMaterial.uniforms.tDepth.value=this.depthTexture,this.pdMaterial.defines.NORMAL_VECTOR_TYPE=i,this.pdMaterial.defines.DEPTH_SWIZZLING=n,this.pdMaterial.uniforms.tNormal.value=this.normalTexture,this.pdMaterial.uniforms.tDepth.value=this.depthTexture,this.depthRenderMaterial.uniforms.tDepth.value=this.normalRenderTarget.depthTexture}setSceneClipBox(e){e?(this.gtaoMaterial.needsUpdate=this.gtaoMaterial.defines.SCENE_CLIP_BOX!==1,this.gtaoMaterial.defines.SCENE_CLIP_BOX=1,this.gtaoMaterial.uniforms.sceneBoxMin.value.copy(e.min),this.gtaoMaterial.uniforms.sceneBoxMax.value.copy(e.max)):(this.gtaoMaterial.needsUpdate=this.gtaoMaterial.defines.SCENE_CLIP_BOX===0,this.gtaoMaterial.defines.SCENE_CLIP_BOX=0)}updateGtaoMaterial(e){e.radius!==void 0&&(this.gtaoMaterial.uniforms.radius.value=e.radius),e.distanceExponent!==void 0&&(this.gtaoMaterial.uniforms.distanceExponent.value=e.distanceExponent),e.thickness!==void 0&&(this.gtaoMaterial.uniforms.thickness.value=e.thickness),e.distanceFallOff!==void 0&&(this.gtaoMaterial.uniforms.distanceFallOff.value=e.distanceFallOff,this.gtaoMaterial.needsUpdate=!0),e.scale!==void 0&&(this.gtaoMaterial.uniforms.scale.value=e.scale),e.samples!==void 0&&e.samples!==this.gtaoMaterial.defines.SAMPLES&&(this.gtaoMaterial.defines.SAMPLES=e.samples,this.gtaoMaterial.needsUpdate=!0),e.screenSpaceRadius!==void 0&&(e.screenSpaceRadius?1:0)!==this.gtaoMaterial.defines.SCREEN_SPACE_RADIUS&&(this.gtaoMaterial.defines.SCREEN_SPACE_RADIUS=e.screenSpaceRadius?1:0,this.gtaoMaterial.needsUpdate=!0)}updatePdMaterial(e){let t=!1;e.lumaPhi!==void 0&&(this.pdMaterial.uniforms.lumaPhi.value=e.lumaPhi),e.depthPhi!==void 0&&(this.pdMaterial.uniforms.depthPhi.value=e.depthPhi),e.normalPhi!==void 0&&(this.pdMaterial.uniforms.normalPhi.value=e.normalPhi),e.radius!==void 0&&e.radius!==this.radius&&(this.pdMaterial.uniforms.radius.value=e.radius),e.radiusExponent!==void 0&&e.radiusExponent!==this.pdRadiusExponent&&(this.pdRadiusExponent=e.radiusExponent,t=!0),e.rings!==void 0&&e.rings!==this.pdRings&&(this.pdRings=e.rings,t=!0),e.samples!==void 0&&e.samples!==this.pdSamples&&(this.pdSamples=e.samples,t=!0),t&&(this.pdMaterial.defines.SAMPLES=this.pdSamples,this.pdMaterial.defines.SAMPLE_VECTORS=Pp(this.pdSamples,this.pdRings,this.pdRadiusExponent),this.pdMaterial.needsUpdate=!0)}render(e,t,i){switch(this._renderGBuffer&&(this._overrideVisibility(),this._renderOverride(e,this.normalMaterial,this.normalRenderTarget,7829503,1),this._restoreVisibility()),this.gtaoMaterial.uniforms.cameraNear.value=this.camera.near,this.gtaoMaterial.uniforms.cameraFar.value=this.camera.far,this.gtaoMaterial.uniforms.cameraProjectionMatrix.value.copy(this.camera.projectionMatrix),this.gtaoMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse),this.gtaoMaterial.uniforms.cameraWorldMatrix.value.copy(this.camera.matrixWorld),this._renderPass(e,this.gtaoMaterial,this.gtaoRenderTarget,16777215,1),this.pdMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse),this._renderPass(e,this.pdMaterial,this.pdRenderTarget,16777215,1),this.output){case Ji.OUTPUT.Off:break;case Ji.OUTPUT.Diffuse:this.copyMaterial.uniforms.tDiffuse.value=i.texture,this.copyMaterial.blending=ni,this._renderPass(e,this.copyMaterial,this.renderToScreen?null:t);break;case Ji.OUTPUT.AO:this.copyMaterial.uniforms.tDiffuse.value=this.gtaoRenderTarget.texture,this.copyMaterial.blending=ni,this._renderPass(e,this.copyMaterial,this.renderToScreen?null:t);break;case Ji.OUTPUT.Denoise:this.copyMaterial.uniforms.tDiffuse.value=this.pdRenderTarget.texture,this.copyMaterial.blending=ni,this._renderPass(e,this.copyMaterial,this.renderToScreen?null:t);break;case Ji.OUTPUT.Depth:this.depthRenderMaterial.uniforms.cameraNear.value=this.camera.near,this.depthRenderMaterial.uniforms.cameraFar.value=this.camera.far,this._renderPass(e,this.depthRenderMaterial,this.renderToScreen?null:t);break;case Ji.OUTPUT.Normal:this.copyMaterial.uniforms.tDiffuse.value=this.normalRenderTarget.texture,this.copyMaterial.blending=ni,this._renderPass(e,this.copyMaterial,this.renderToScreen?null:t);break;case Ji.OUTPUT.Default:this.copyMaterial.uniforms.tDiffuse.value=i.texture,this.copyMaterial.blending=ni,this._renderPass(e,this.copyMaterial,this.renderToScreen?null:t),this.blendMaterial.uniforms.intensity.value=this.blendIntensity,this.blendMaterial.uniforms.tDiffuse.value=this.pdRenderTarget.texture,this._renderPass(e,this.blendMaterial,this.renderToScreen?null:t);break;default:console.warn("THREE.GTAOPass: Unknown output type.")}}_renderPass(e,t,i,n,r){e.getClearColor(this._originalClearColor);const a=e.getClearAlpha(),o=e.autoClear;e.setRenderTarget(i),e.autoClear=!1,n!=null&&(e.setClearColor(n),e.setClearAlpha(r||0),e.clear()),this._fsQuad.material=t,this._fsQuad.render(e),e.autoClear=o,e.setClearColor(this._originalClearColor),e.setClearAlpha(a)}_renderOverride(e,t,i,n,r){e.getClearColor(this._originalClearColor);const a=e.getClearAlpha(),o=e.autoClear;e.setRenderTarget(i),e.autoClear=!1,n=t.clearColor||n,r=t.clearAlpha||r,n!=null&&(e.setClearColor(n),e.setClearAlpha(r||0),e.clear()),this.scene.overrideMaterial=t,e.render(this.scene,this.camera),this.scene.overrideMaterial=null,e.autoClear=o,e.setClearColor(this._originalClearColor),e.setClearAlpha(a)}_overrideVisibility(){const e=this.scene,t=this._visibilityCache;e.traverse(function(i){(i.isPoints||i.isLine||i.isLine2)&&i.visible&&(i.visible=!1,t.push(i))})}_restoreVisibility(){const e=this._visibilityCache;for(let t=0;t<e.length;t++)e[t].visible=!0;e.length=0}_generateNoise(e=64){const t=new sS,i=e*e*4,n=new Uint8Array(i);for(let a=0;a<e;a++)for(let o=0;o<e;o++){const l=a,c=o;n[(a*e+o)*4]=(t.noise(l,c)*.5+.5)*255,n[(a*e+o)*4+1]=(t.noise(l+e,c)*.5+.5)*255,n[(a*e+o)*4+2]=(t.noise(l,c+e)*.5+.5)*255,n[(a*e+o)*4+3]=(t.noise(l+e,c+e)*.5+.5)*255}const r=new ea(n,e,e,Li,wi);return r.wrapS=Wi,r.wrapT=Wi,r.needsUpdate=!0,r}}Ji.OUTPUT={Off:-1,Default:0,Diffuse:1,Depth:2,Normal:3,AO:4,Denoise:5};const $a={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
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

		#include <tonemapping_pars_fragment>
		#include <colorspace_pars_fragment>

		varying vec2 vUv;

		void main() {

			gl_FragColor = texture2D( tDiffuse, vUv );

			// tone mapping

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

			// color space

			#ifdef SRGB_TRANSFER

				gl_FragColor = sRGBTransferOETF( gl_FragColor );

			#endif

		}`};class rS extends ys{constructor(){super(),this.isOutputPass=!0,this.uniforms=rn.clone($a.uniforms),this.material=new Yf({name:$a.name,uniforms:this.uniforms,vertexShader:$a.vertexShader,fragmentShader:$a.fragmentShader}),this._fsQuad=new Po(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,t,i){this.uniforms.tDiffuse.value=i.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},gt.getTransfer(this._outputColorSpace)===bt&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===ah?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===oh?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===lh?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===jr?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===hh?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===uh?this.material.defines.NEUTRAL_TONE_MAPPING="":this._toneMapping===ch&&(this.material.defines.CUSTOM_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}class aS extends ys{constructor(e,t,i=null,n=null,r=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=i,this.clearColor=n,this.clearAlpha=r,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this.isRenderPass=!0,this._oldClearColor=new Te}render(e,t,i){const n=e.autoClear;e.autoClear=!1;let r,a;this.overrideMaterial!==null&&(a=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(r=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:i),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(r),this.overrideMaterial!==null&&(this.scene.overrideMaterial=a),e.autoClear=n}}const oS={uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new Te(0)},defaultOpacity:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityThreshold;
		uniform float smoothWidth;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			float v = luminance( texel.xyz );

			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

			gl_FragColor = mix( outputColor, texel, alpha );

		}`};class or extends ys{constructor(e,t=1,i,n){super(),this.strength=t,this.radius=i,this.threshold=n,this.resolution=e!==void 0?new le(e.x,e.y):new le(256,256),this.clearColor=new Te(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let r=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);this.renderTargetBright=new ai(r,a,{type:li,depthBuffer:!1}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let h=0;h<this.nMips;h++){const f=new ai(r,a,{type:li,depthBuffer:!1});f.texture.name="UnrealBloomPass.h"+h,f.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(f);const u=new ai(r,a,{type:li,depthBuffer:!1});u.texture.name="UnrealBloomPass.v"+h,u.texture.generateMipmaps=!1,this.renderTargetsVertical.push(u),r=Math.round(r/2),a=Math.round(a/2)}const o=oS;this.highPassUniforms=rn.clone(o.uniforms),this.highPassUniforms.luminosityThreshold.value=n,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new Ot({uniforms:this.highPassUniforms,vertexShader:o.vertexShader,fragmentShader:o.fragmentShader}),this.separableBlurMaterials=[];const l=[6,10,14,18,22];r=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);for(let h=0;h<this.nMips;h++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(l[h])),this.separableBlurMaterials[h].uniforms.invSize.value=new le(1/r,1/a),r=Math.round(r/2),a=Math.round(a/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=t,this.compositeMaterial.uniforms.bloomRadius.value=.1;const c=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=c,this.bloomTintColors=[new L(1,1,1),new L(1,1,1),new L(1,1,1),new L(1,1,1),new L(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=rn.clone(ds.uniforms),this.blendMaterial=new Ot({uniforms:this.copyUniforms,vertexShader:ds.vertexShader,fragmentShader:ds.fragmentShader,premultipliedAlpha:!0,blending:er,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new Te,this._oldClearAlpha=1,this._basic=new _i,this._fsQuad=new Po(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(e,t){let i=Math.round(e/2),n=Math.round(t/2);this.renderTargetBright.setSize(i,n);for(let r=0;r<this.nMips;r++)this.renderTargetsHorizontal[r].setSize(i,n),this.renderTargetsVertical[r].setSize(i,n),this.separableBlurMaterials[r].uniforms.invSize.value=new le(1/i,1/n),i=Math.round(i/2),n=Math.round(n/2)}render(e,t,i,n,r){e.getClearColor(this._oldClearColor),this._oldClearAlpha=e.getClearAlpha();const a=e.autoClear;e.autoClear=!1,e.setClearColor(this.clearColor,0),r&&e.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=i.texture,e.setRenderTarget(null),e.clear(),this._fsQuad.render(e)),this.highPassUniforms.tDiffuse.value=i.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,e.setRenderTarget(this.renderTargetBright),e.clear(),this._fsQuad.render(e);let o=this.renderTargetBright;for(let l=0;l<this.nMips;l++)this._fsQuad.material=this.separableBlurMaterials[l],this.separableBlurMaterials[l].uniforms.colorTexture.value=o.texture,this.separableBlurMaterials[l].uniforms.direction.value=or.BlurDirectionX,e.setRenderTarget(this.renderTargetsHorizontal[l]),e.clear(),this._fsQuad.render(e),this.separableBlurMaterials[l].uniforms.colorTexture.value=this.renderTargetsHorizontal[l].texture,this.separableBlurMaterials[l].uniforms.direction.value=or.BlurDirectionY,e.setRenderTarget(this.renderTargetsVertical[l]),e.clear(),this._fsQuad.render(e),o=this.renderTargetsVertical[l];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,e.setRenderTarget(this.renderTargetsHorizontal[0]),e.clear(),this._fsQuad.render(e),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,r&&e.state.buffers.stencil.setTest(!0),this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(i),this._fsQuad.render(e)),e.setClearColor(this._oldClearColor,this._oldClearAlpha),e.autoClear=a}_getSeparableBlurMaterial(e){const t=[],i=e/3;for(let a=0;a<e;a++)t.push(.39894*Math.exp(-.5*a*a/(i*i))/i);const n=[],r=[];for(let a=1;a<e;a+=2){const o=t[a],l=a+1<e?t[a+1]:0,c=o+l;n.push((a*o+(a+1)*l)/c),r.push(c)}return new Ot({defines:{KERNEL_PAIRS:n.length},uniforms:{colorTexture:{value:null},invSize:{value:new le(.5,.5)},direction:{value:new le(.5,.5)},centerWeight:{value:t[0]},gaussianOffsets:{value:n},gaussianWeights:{value:r}},vertexShader:`

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,fragmentShader:`

				#include <common>

				varying vec2 vUv;

				uniform sampler2D colorTexture;
				uniform vec2 invSize;
				uniform vec2 direction;
				uniform float centerWeight;
				uniform float gaussianOffsets[KERNEL_PAIRS];
				uniform float gaussianWeights[KERNEL_PAIRS];

				void main() {

					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * centerWeight;

					for ( int i = 0; i < KERNEL_PAIRS; i ++ ) {

						vec2 uvOffset = direction * invSize * gaussianOffsets[ i ];
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;
						diffuseSum += ( sample1 + sample2 ) * gaussianWeights[ i ];

					}

					gl_FragColor = vec4( diffuseSum, 1.0 );

				}`})}_getCompositeMaterial(e){return new Ot({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,fragmentShader:`

				varying vec2 vUv;

				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor( const in float factor ) {

					float mirrorFactor = 1.2 - factor;
					return mix( factor, mirrorFactor, bloomRadius );

				}

				void main() {

					// 3.0 for backwards compatibility with previous alpha-based intensity
					vec3 bloom = 3.0 * bloomStrength * (
						lerpBloomFactor( bloomFactors[ 0 ] ) * bloomTintColors[ 0 ] * texture2D( blurTexture1, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 1 ] ) * bloomTintColors[ 1 ] * texture2D( blurTexture2, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 2 ] ) * bloomTintColors[ 2 ] * texture2D( blurTexture3, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 3 ] ) * bloomTintColors[ 3 ] * texture2D( blurTexture4, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 4 ] ) * bloomTintColors[ 4 ] * texture2D( blurTexture5, vUv ).rgb
					);

					float bloomAlpha = max( bloom.r, max( bloom.g, bloom.b ) );
					gl_FragColor = vec4( bloom, bloomAlpha );

				}`})}}or.BlurDirectionX=new le(1,0);or.BlurDirectionY=new le(0,1);const lS={name:"GradeShader",uniforms:{tDiffuse:{value:null},vignette:{value:.32},saturation:{value:1.08},contrast:{value:1.06},aberration:{value:0},flash:{value:0},flashColor:{value:new Te(1,1,1)}},vertexShader:`
    varying vec2 vUv;
    void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,fragmentShader:`
    uniform sampler2D tDiffuse;
    uniform float vignette, saturation, contrast, aberration, flash;
    uniform vec3 flashColor;
    varying vec2 vUv;
    void main() {
      vec2 d = vUv - 0.5;
      vec2 off = d * aberration * length(d);
      vec3 c = vec3(texture2D(tDiffuse, vUv + off).r, texture2D(tDiffuse, vUv).g, texture2D(tDiffuse, vUv - off).b);
      float l = dot(c, vec3(0.2126, 0.7152, 0.0722));
      c = mix(vec3(l), c, saturation);
      c = (c - 0.5) * contrast + 0.5;
      float v = smoothstep(0.9, 0.25, length(d * vec2(1.0, 0.8)));
      c *= mix(1.0 - vignette, 1.0, v);
      c = mix(c, flashColor, flash);
      gl_FragColor = vec4(clamp(c, 0.0, 1.0), 1.0);
    }`};class cS{composer;renderPass;gtao;bloom;grade;aberration=0;flash=0;constructor(e,t,i){const n=e.getDrawingBufferSize(new le),r=new ai(n.x,n.y,{type:li,samples:4});this.composer=new eS(e,r),this.renderPass=new aS(t,i),this.gtao=new Ji(t,i,n.x,n.y),this.gtao.blendIntensity=.85,this.gtao.updateGtaoMaterial({radius:.35,distanceExponent:1.4,thickness:1.2,scale:1.1,samples:12}),this.gtao.updatePdMaterial({lumaPhi:10,depthPhi:2,normalPhi:3,radius:6,rings:2,samples:12}),this.bloom=new or(new le(n.x,n.y),.42,.38,.86),this.grade=new Cp(lS),this.composer.addPass(this.renderPass),this.composer.addPass(this.gtao),this.composer.addPass(this.bloom),this.composer.addPass(new rS),this.composer.addPass(this.grade)}setQuality(e){this.gtao.enabled=e==="ultra",this.bloom.enabled=e!=="low"}setSize(e,t,i){this.composer.setPixelRatio(i),this.composer.setSize(e,t)}setLook(e){this.bloom.strength=e.bloom??.42,this.bloom.threshold=e.threshold??.86;const t=this.grade.uniforms;t.vignette.value=e.vignette??.32,t.saturation.value=e.saturation??1.08,t.contrast.value=e.contrast??1.06}pulse(e,t=0,i=16777215){this.aberration=Math.max(this.aberration,e),t>this.flash&&(this.flash=t,this.grade.uniforms.flashColor.value.setHex(i))}render(e){const t=Math.pow(.001,e*4);this.aberration*=t,this.flash*=Math.pow(5e-4,e*5),this.grade.uniforms.aberration.value=this.aberration,this.grade.uniforms.flash.value=this.flash,this.composer.render(e)}dispose(){this.composer.dispose()}}const hS={ultra:"high",high:"low",low:null},jd=Math.PI/2-.32,uS=new Set(["cast","grab","charge","whip","beam","counterStance","place","uppercut","summon","stomp","flurry","slamRise"]),jc=16722458,xo=13154458,eh=s=>Math.PI/2-s;class Bl{rig;anim=new gp;shield;stars;prop=null;propStyle=null;whip;auraTimer=0;prevState="";constructor(e){const t=I_(e.id);this.rig=up(e,{photo:t,face:t?null:L_(e.id)}),this.shield=new Ge(new Oe(1.05,24,16),_t(10474495,.22)),this.shield.position.y=.95,this.shield.visible=!1,this.rig.root.add(this.shield),this.stars=new lt;for(let i=0;i<3;i++){const n=mo("star",16766474);n.scale.setScalar(.35),this.stars.add(n)}this.stars.visible=!1,this.rig.root.add(this.stars),this.whip=new Ge(new $e(.018,.018,1,6),new _i({color:3811866})),this.whip.visible=!1,this.rig.root.add(this.whip)}syncFace(e,t,i){const n=this.rig.faceSprite;if(!n)return;const r=n.material;r.rotation=-this.anim.pivotX*t+this.anim.headRoll*.6*t+i,r.color.setRGB(1,1-e*.45,1-e*.5)}setProp(e,t){this.propStyle!==e&&(this.prop&&(this.rig.rHand.remove(this.prop),this.prop=null),this.propStyle=e,e&&(this.prop=mo(e,t),this.prop.scale.setScalar(.7),this.prop.position.set(0,-.12,.05),this.prop.rotation.set(Math.PI/2,0,Math.PI/2),this.rig.rHand.add(this.prop)))}sync(e,t,i,n){const r=this.rig.root;this.anim.update(e,t,i),this.anim.apply(this.rig),r.visible=!this.anim.hidden;let a=e.x,o=e.z;e.flash>0&&t.hitstop>0&&(a+=(Math.random()-.5)*.08,o+=(Math.random()-.5)*.08),r.position.set(a,e.y,o),r.rotation.y=eh(e.yaw);const l=e.flash>0?Math.min(1,e.flash/5)*.7:0,c=e.buffs.find(p=>p.kind!=="shield"&&p.kind!=="reflect"&&p.kind!=="slow"),h=t.ticks/60;for(const p of this.rig.materials)l>0?p.emissive.setRGB(l*.5,l*.42,l*.34):c?p.emissive.setHex(c.color).multiplyScalar(.18+.1*Math.sin(h*8)):e.inRage?p.emissive.setRGB(.16+.08*Math.sin(h*7),.01,0):e.lifelineUsed&&e.health<=1?p.emissive.setRGB(.3+.2*Math.sin(h*10),0,0):p.emissive.setRGB(0,0,0);const f=t.screenRight,u=e.dirX*f.x+e.dirZ*f.z;if(this.syncFace(l,u,e.state==="hitstun"||e.state==="cinematic"?Math.sin(h*40)*.15:0),n){const p=c?.color??(e.state==="attack"&&e.move?.kind==="super"?e.move.color??16765440:e.inRage?jc:e.meter>=100?16765440:null);if(p!==null){this.auraTimer+=i*60;const g=c||e.move?.kind==="super"?2:e.inRage?3:6;for(;this.auraTimer>=g;)this.auraTimer-=g,n.burst(e.x+(Math.random()-.5)*.7,e.y+.1+Math.random()*1.2,e.z+(Math.random()-.5)*.7,p,1,.01,.035,-.0015,34)}e.state!==this.prevState&&e.grounded&&(e.state==="dash"||e.state==="backdash"||e.state==="sidestep"||e.state==="techroll")&&n.burst(e.x,.06,e.z,xo,8,.035,.05,.001,22),e.state==="run"&&e.stateFrame%8===0&&n.burst(e.x,.05,e.z,xo,3,.025,.045,.001,18)}this.prevState=e.state;const d=e.buff("shield")??e.buff("reflect");if(this.shield.visible=!!d,d&&(this.shield.material.color.setHex(d.color),this.shield.material.opacity=.15+.08*Math.sin(h*6)),this.stars.visible=e.state==="dizzy",this.stars.visible){const p=e.crumpled?1.35:1.95;this.stars.children.forEach((g,y)=>{const E=h*4+y*Math.PI*2/3;g.position.set(Math.cos(E)*.35,p,Math.sin(E)*.35),g.rotation.y=E})}const m=e.move;if(e.state==="cinematic"&&t.cinematic?.att===e&&t.cinematic?.prop?this.setProp(t.cinematic.prop,t.cinematic.color):e.state==="attack"&&m?.prop&&uS.has(m.anim)&&m.tag!=="projectile"&&m.tag!=="rain"?this.setProp(m.prop,m.color??16777215):this.setProp(null,0),this.whip.visible=!1,e.state==="attack"&&m?.tag==="pull"){const p=e.moveFrame;p>m.startup-2&&p<=m.startup+m.active+4&&(this.whip.visible=!0,this.whip.scale.set(1,3,1),this.whip.position.set(0,1.25,3/2+.4),this.whip.rotation.set(Math.PI/2,0,0),this.whip.material.color.setHex(m.color??3811866))}}dispose(){dp(this.rig)}}const dS=new Set(["plane","jet","train","tank","fire","syringe","envelope"]);class fS{obj;glow=null;beam=null;core=null;constructor(e){if(this.obj=new lt,e.kind==="beam"||e.kind==="mega"&&e.attach){const t=e.h/2;if(this.beam=new Ge(new $e(t,t,1,20,1,!0),_t(e.color,.55)),this.beam.rotation.z=Math.PI/2,this.core=new Ge(new $e(t*.45,t*.45,1,12,1,!0),_t(16777215,.9)),this.core.rotation.z=Math.PI/2,this.obj.add(this.beam,this.core),e.prop&&e.prop!=="wave"&&e.prop!=="sound"){const i=mo(e.prop,e.color);i.scale.setScalar(1.2),i.userData.src=!0,this.obj.add(i)}}else{const t=mo(e.prop,e.color);t.scale.setScalar(e.scale*(e.kind==="wave"||e.kind==="trap"?1.3:1.2)),this.obj.add(t),this.glow=new Ge(new Oe(.32*e.scale,14,10),_t(e.color,.25)),this.obj.add(this.glow)}}sync(e,t){if(this.obj.position.set(e.x,e.y,e.z),this.obj.rotation.y=-Math.atan2(e.dirZ,e.dirX),this.beam&&this.core){const n=e.w,r=1+.12*Math.sin(t*40);this.beam.scale.set(r,n,r),this.core.scale.set(1,n,1),this.obj.children.forEach(a=>{a.userData.src&&a.position.set(-(n/2-.1),0,0)});return}this.obj.visible=e.age>=e.delay||Math.floor(e.age/4)%2===0;const i=this.obj.children[0];e.kind==="normal"||e.kind==="rain"||e.kind==="mega"?(i.rotation.z=dS.has(e.prop)?0:-e.age*e.spin,(e.prop==="coin"||e.prop==="shekel")&&(i.rotation.y=e.age*.3)):e.kind==="trap"&&(i.position.y=-.25+Math.sin(t*3)*.03),this.glow&&this.glow.scale.setScalar(1+.15*Math.sin(t*20))}}const ef=(s,e,t)=>Math.max(e,Math.min(t,s));class pS{renderer;scene=new _o;camera=new Ai(38,16/9,.1,400);effects=new $M;hemi=new $f(16777215,4473924,1);key=new po(16777215,2.5);rim=new po(8956671,1.2);stage=null;stageId="";views=[];projViews=new Map;showcase=[];camPos=new L(0,1.8,8);camLook=new L(0,1.1,0);shake=0;superFocus=null;time=0;showHitboxes=!1;hitboxGroup=new lt;platform;env;post;quality="ultra";keyOffset=new L(4,12,8);lastRender=0;autoQuality=!0;perf={time:0,frames:0,fightUntil:0};onQualityDrop=null;constructor(e){this.renderer=new ap({canvas:e,antialias:!0,powerPreference:"high-performance"}),this.renderer.setPixelRatio(Math.min(2,window.devicePixelRatio||1)),this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=Fr,this.renderer.toneMapping=jr,this.renderer.toneMappingExposure=1,this.renderer.outputColorSpace=Kt,this.key.castShadow=!0,this.key.shadow.mapSize.set(2048,2048);const t=this.key.shadow.camera;t.left=-8,t.right=8,t.top=8,t.bottom=-8,t.near=1,t.far=60,this.key.shadow.bias=-4e-4,this.key.shadow.normalBias=.025,this.key.shadow.radius=3,this.scene.add(this.hemi,this.key,this.key.target,this.rim,this.rim.target,this.effects.group,this.hitboxGroup),this.platform=new Ge(new $e(1.6,1.8,.2,40),new Ut({color:1778496,metalness:.6,roughness:.3})),this.platform.visible=!1,this.scene.add(this.platform),this.env=new $_(this.renderer),this.scene.environment=this.env.studio(),this.scene.environmentIntensity=.6,this.post=new cS(this.renderer,this.scene,this.camera),this.resize()}get currentQuality(){return this.quality}setQuality(e){this.quality=e;const t=e==="low";this.renderer.shadowMap.enabled=!t,this.key.castShadow=!t,this.post.setQuality(e),this.perf={time:0,frames:0,fightUntil:0},this.scene.traverse(i=>{const n=i.material;n&&(n.needsUpdate=!0)}),this.resize()}pixelRatio(){const e=window.devicePixelRatio||1;return this.quality==="ultra"?Math.min(e,1.5):this.quality==="high"?Math.min(e,1.25):1}resize(){const e=this.renderer.domElement,t=e.clientWidth||window.innerWidth,i=e.clientHeight||window.innerHeight,n=this.pixelRatio();this.renderer.setPixelRatio(n),this.renderer.setSize(t,i,!1),this.post.setSize(t,i,n),this.camera.aspect=t/i,this.camera.updateProjectionMatrix()}setStage(e){if(this.stageId===e.id&&this.stage)return;this.stage&&(this.scene.remove(this.stage.group),Wd(this.stage)),this.stage=e_(e),this.stageId=e.id,this.scene.add(this.stage.group);const t=this.stage.lighting;this.scene.background=new Te(t.background),this.scene.fog=new Sh(t.fog[0],t.fog[1],t.fog[2]),this.hemi.color.setHex(t.hemiSky),this.hemi.groundColor.setHex(t.hemiGround),this.hemi.intensity=t.hemiIntensity*.45,this.key.color.setHex(t.key),this.key.intensity=t.keyIntensity*1.1,this.keyOffset.set(...t.keyPos),this.key.position.copy(this.keyOffset),this.key.target.position.set(0,0,0),this.rim.color.setHex(t.rim),this.rim.intensity=t.rimIntensity*1.3,this.rim.position.set(-4,6,-10),this.scene.environment=this.env.fromSpec(e.id,t.env),this.scene.environmentIntensity=t.envIntensity,this.renderer.toneMappingExposure=t.exposure??1,this.post.setLook(t.look??{})}clearStage(){this.stage&&(this.scene.remove(this.stage.group),Wd(this.stage),this.stage=null,this.stageId=""),this.scene.background=new Te(329485),this.scene.fog=null,this.hemi.color.setHex(14542591),this.hemi.groundColor.setHex(2236979),this.hemi.intensity=1.2,this.key.color.setHex(16777215),this.key.intensity=2.8,this.key.position.set(3,8,8),this.rim.color.setHex(7310335),this.rim.intensity=2.8,this.rim.position.set(-4,5,-6),this.key.target.position.set(0,0,0),this.scene.environment=this.env.studio(),this.scene.environmentIntensity=.6,this.renderer.toneMappingExposure=1,this.post.setLook({bloom:.5,vignette:.45})}setFighters(e){for(const t of this.views)this.scene.remove(t.rig.root),t.dispose();this.views=e.map(t=>{const i=new Bl(t);return this.scene.add(i.rig.root),i});for(const t of this.projViews.values())this.scene.remove(t.obj);this.projViews.clear(),this.effects.clear(),this.superFocus=null}clearFighters(){this.setFighters([])}handleEvent(e,t){const i=this.effects;switch(e.t){case"hit":i.hitSpark(e.x,e.y,e.z,e.spark,e.blocked,e.color),!e.blocked&&(e.spark==="heavy"||e.spark==="super"||e.counter)&&(this.shake=Math.max(this.shake,e.spark==="super"?.18:.08)),e.blocked||(e.counter?this.post.pulse(.05,.1,16773312):e.spark==="super"?this.post.pulse(.06,.16,16769162):(e.spark==="heavy"||e.spark==="special")&&this.post.pulse(.025));break;case"superFlash":{const n=t.fighters[e.fighter];this.superFocus={fighter:e.fighter,frames:48},this.post.pulse(.03,.22,e.color),i.ring(n.x,1.1,n.z,e.color,.3,3.5,30),i.burst(n.x,1.2,n.z,e.color,50,.14,.07,.001,40);break}case"special":{const n=t.fighters[e.fighter];i.burst(n.x,1,n.z,e.color,10,.05,.04,.001,18);break}case"teleport":i.burst(e.fromX,1,e.fromZ,e.color,30,.09,.06,0,26),i.burst(e.toX,1,e.toZ,e.color,30,.09,.06,0,26),i.ring(e.toX,1,e.toZ,e.color,.2,1.6,16);break;case"buff":{const n=t.fighters[e.fighter];i.ring(n.x,.05,n.z,e.color,.3,2.2,24,!0),i.burst(n.x,.8,n.z,e.color,26,.07,.05,-.002,36);break}case"clash":i.burst(e.x,e.y,e.z,16777215,24,.1,.05,.002,20),i.ring(e.x,e.y,e.z,16777215,.2,1.2,14);break;case"tech":i.ring(e.x,e.y,e.z,16777215,.2,1.4,14),i.burst(e.x,e.y,e.z,11195647,20,.09,.05,.001,16);break;case"wallsplat":{const n=t.fighters[e.fighter],r=Math.hypot(n.x,n.z)||1,a=n.x/r*(r+.35),o=n.z/r*(r+.35);i.burst(a,1.1,o,15260868,34,.1,.07,.004,34),i.flash(a,1.1,o,16777215,.8,8),this.shake=Math.max(this.shake,.16);break}case"techroll":{const n=t.fighters[e.fighter];i.burst(n.x,.08,n.z,xo,12,.05,.05,.001,22);break}case"rage":{const n=t.fighters[e.fighter];i.ring(n.x,.05,n.z,jc,.3,2.6,30,!0),i.burst(n.x,1,n.z,jc,40,.1,.06,-.001,40);break}case"lifeline":{const n=t.fighters[e.fighter];i.flash(n.x,1,n.z,16765440,2.5,20),i.burst(n.x,1,n.z,16765440,60,.15,.07,.002,40),this.shake=.2;break}case"land":if(e.hard){const n=t.fighters[e.fighter];i.burst(n.x,.1,n.z,xo,16,.05,.06,.002,26)}break;case"shake":this.shake=Math.max(this.shake,e.amount);break;case"ko":{if(e.loser>=0){const n=t.fighters[e.loser];i.flash(n.x,1,n.z,16777215,3,16)}this.post.pulse(.08,.35);break}}}syncFight(e,t){this.time+=t,this.platform.visible=!1,this.views.forEach((l,c)=>l.sync(e.fighters[c],e,t,this.effects));const i=new Set;for(const l of e.projectiles){i.add(l.id);let c=this.projViews.get(l.id);c||(c=new fS(l),this.projViews.set(l.id,c),this.scene.add(c.obj)),c.sync(l,this.time)}for(const[l,c]of this.projViews)if(!i.has(l)){const h=c.obj.position;this.effects.burst(h.x,h.y,h.z,16777215,8,.05,.035,.002,14),this.scene.remove(c.obj),this.projViews.delete(l)}this.stage?.update(this.time),this.updateFightCamera(e,t),this.effects.update(t,this.camera),this.hideOccluders(),this.drawHitboxes(e);const[n,r]=e.fighters,a=(n.x+r.x)/2,o=(n.z+r.z)/2;this.key.target.position.set(a,0,o),this.key.position.set(a+this.keyOffset.x,this.keyOffset.y,o+this.keyOffset.z),this.rim.position.set(a-e.camN.x*8,5.5,o-e.camN.z*8),this.rim.target.position.set(a,1,o),this.perf.fightUntil=this.time+.5}updateFightCamera(e,t){const[i,n]=e.fighters,r=e.camN,a=new L,o=new L,l=(i.x+n.x)/2,c=(i.z+n.z)/2,h=Math.hypot(i.x-n.x,i.z-n.z),f=Math.max(i.y,n.y),u=Math.atan2(r.z,r.x);if(e.freeze>0&&this.superFocus){const d=e.fighters[this.superFocus.fighter];a.set(d.x+r.x*2.5+d.dirX*.7,1.45,d.z+r.z*2.5+d.dirZ*.7),o.set(d.x+d.dirX*.25,1.35,d.z+d.dirZ*.25),this.lerpCam(a,o,1-Math.exp(-t*12))}else if(e.cinematic){const d=e.cinematic,m=(d.att.x+d.def.x)/2,v=(d.att.z+d.def.z)/2,p=u+d.frame*.02-.6;a.set(m+Math.cos(p)*4.2,1.5+Math.sin(d.frame*.05)*.3,v+Math.sin(p)*4.2),o.set(m,1.1,v),this.lerpCam(a,o,1-Math.exp(-t*5))}else if(e.phase==="intro"){const d=e.phaseFrame<100?i:n;a.set(d.x+d.dirX*2.3+r.x*1.1,1.55,d.z+d.dirZ*2.3+r.z*1.1),o.set(d.x,1.3,d.z),this.lerpCam(a,o,1-Math.exp(-t*3))}else if(e.phase==="ko"&&e.phaseFrame<100&&e.roundWinner!==null){const d=e.fighters.find(p=>p.koed)??i,m=l+(d.x-l)*.5,v=c+(d.z-c)*.5;a.set(m+r.x*5.2,1.5,v+r.z*5.2),o.set(d.x*.6+l*.4,.9,d.z*.6+c*.4),this.lerpCam(a,o,1-Math.exp(-t*2.5))}else if(e.phase==="matchEnd"&&e.matchWinner!==null&&e.matchWinner>=0){const d=e.fighters[e.matchWinner],m=Math.atan2(d.dirZ,d.dirX)+Math.sin(this.time*.3)*.3;a.set(d.x+Math.cos(m)*3.6,1.55,d.z+Math.sin(m)*3.6),o.set(d.x,1.2,d.z),this.lerpCam(a,o,1-Math.exp(-t*2))}else{const d=ef(3.4+h*.72,4.6,9.5);a.set(l+r.x*d,1.5+f*.35+d*.05,c+r.z*d),o.set(l,1.05+f*.3,c),this.lerpCam(a,o,1-Math.exp(-t*7))}this.superFocus&&(this.superFocus.frames--,this.superFocus.frames<=0&&e.freeze<=0&&(this.superFocus=null)),this.applyCamera(t)}hideOccluders(){const e=this.stage?.occluders;if(!e)return;const t=this.camPos.x,i=this.camPos.z,n=this.camLook.x,r=this.camLook.z,a=n-t,o=r-i,l=a*a+o*o||1;for(const c of e){const h=c.position.x,f=c.position.z,u=ef(((h-t)*a+(f-i)*o)/l,0,1),d=t+a*u-h,m=i+o*u-f,v=c.userData.radius??1.5;c.visible=u>=1||d*d+m*m>(v+.6)*(v+.6)}}lerpCam(e,t,i){this.camPos.lerp(e,i),this.camLook.lerp(t,i)}applyCamera(e){this.camera.position.copy(this.camPos),this.shake>.001&&(this.camera.position.x+=(Math.random()-.5)*this.shake,this.camera.position.y+=(Math.random()-.5)*this.shake,this.camera.position.z+=(Math.random()-.5)*this.shake,this.shake*=Math.pow(.86,e*60)),this.camera.lookAt(this.camLook)}drawHitboxes(e){if(this.hitboxGroup.visible=this.showHitboxes,!this.showHitboxes)return;for(;this.hitboxGroup.children.length;){const n=this.hitboxGroup.children.pop();n.geometry.dispose(),n.material.dispose()}const t=n=>new _i({color:n,transparent:!0,opacity:.3,depthTest:!1,depthWrite:!1}),i=(n,r,a,o,l,c=0)=>{const h=new Ge(n,t(r));h.position.set(a,o,l),h.rotation.y=c,h.renderOrder=999,this.hitboxGroup.add(h)};for(const n of e.fighters){for(const a of n.hurtboxes())i(new $e(a.r,a.r,a.h,16,1,!0),3407718,a.x,a.y,a.z);const r=n.activeHitbox();if(r){const a=n.ahead(r.x);i(new Le((r.lw??.26)*2,r.h,r.w),16720452,a.x,n.y+r.y,a.z,eh(n.yaw))}}for(const n of e.projectiles)n.active&&(n.attach?i(new Le(n.h,n.h,n.w),16750882,n.x,n.y,n.z,eh(Math.atan2(n.dirZ,n.dirX))):i(new Oe(n.w/2,12,8),16750882,n.x,n.y,n.z))}setShowcase(e,t=!0){for(const i of this.showcase)i&&(this.scene.remove(i.view.rig.root),i.view.dispose());this.showcase=e.map(i=>{const n=new Bl(i.def);return n.rig.root.position.set(i.x,0,0),this.scene.add(n.rig.root),{view:n,slot:i}}),this.platform.visible=t&&e.length>0,this.views.forEach(i=>i.rig.root.visible=!1)}updateShowcaseSlot(e,t){const i=this.showcase[e];if(i&&t&&i.slot.def.id===t.def.id){i.slot=t;return}if(i&&(this.scene.remove(i.view.rig.root),i.view.dispose()),!t){this.showcase[e]=void 0;return}const n=new Bl(t.def);this.scene.add(n.rig.root),this.showcase[e]={view:n,slot:t}}syncShowcase(e,t){this.time+=e;const i=this.showcaseCount;this.showcase.forEach((r,a)=>{if(!r)return;const{view:o,slot:l}=r;o.anim.showcase(e,this.time,l.pose,l.variant??0,a*1.7),o.anim.apply(o.rig);const c=o.rig.root;c.visible=!0,c.position.set(l.x,this.platform.visible&&i===1?.1:0,0),c.rotation.y=l.facing>0?jd-.5:-jd+.5;for(const h of o.rig.materials)h.emissive.setRGB(0,0,0);o.shield.visible=!1,o.stars.visible=!1}),this.stage?.update(this.time);const n=1-Math.exp(-e*4);this.lerpCam(new L(...t.pos),new L(...t.look),n),this.applyCamera(e),this.effects.update(e,this.camera)}get showcaseCount(){return this.showcase.filter(Boolean).length}get currentStage(){return this.stageId}clearShowcase(){this.setShowcase([],!1)}snapCamera(e,t){this.camPos.set(...e),this.camLook.set(...t)}render(){const e=performance.now(),t=this.lastRender?Math.min(.1,(e-this.lastRender)/1e3):1/60;this.lastRender=e,this.quality==="low"?this.renderer.render(this.scene,this.camera):this.post.render(t),this.trackPerformance(t)}trackPerformance(e){if(!this.autoQuality||this.time>this.perf.fightUntil||(this.perf.time+=e,this.perf.frames++,this.perf.time<4))return;const t=this.perf.frames/this.perf.time;this.perf.time=0,this.perf.frames=0;const i=hS[this.quality];t<42&&i&&(this.setQuality(i),this.onQualityDrop?.(i))}}class mS{canvas;ui;renderer;input=new s0;audio=new jp;settings=h0();screen=null;arcade=null;lastSetup=null;desktop=window.skfDesktop??null;quality=null;acc=0;last=0;fps=0;constructor(){this.canvas=document.getElementById("game"),this.ui=document.getElementById("ui"),this.renderer=new pS(this.canvas),this.applySettings(),window.addEventListener("resize",()=>this.renderer.resize());const e=()=>this.audio.unlock();window.addEventListener("keydown",e),window.addEventListener("pointerdown",e),window.addEventListener("keydown",t=>{t.code==="F11"&&!this.desktop&&(t.preventDefault(),this.toggleFullscreen())})}applySettings(){const e=this.settings;this.audio.volumes={master:e.masterVolume,music:e.musicVolume,sfx:e.sfxVolume},this.audio.announcer=e.announcer,this.audio.applyVolumes(),this.input.rumbleEnabled=e.rumble,this.renderer.showHitboxes=e.showHitboxes,P_(e.faces),this.quality!==e.quality&&(this.quality=e.quality,this.renderer.setQuality(e.quality)),u0(e)}toggleFullscreen(){if(this.desktop){this.desktop.toggleFullscreen();return}document.fullscreenElement?document.exitFullscreen().catch(()=>{}):document.documentElement.requestFullscreen().catch(()=>{})}go(e){this.screen?.exit(),this.ui.innerHTML="",this.screen=e,e.enter()}start(){const e=t=>{const i=this.last?Math.min(.1,(t-this.last)/1e3):1/Fo;this.last=t,this.fps=this.fps*.95+1/Math.max(i,.001)*.05,this.acc+=i;let n=0;for(;this.acc>=1/Fo&&n<5;)this.input.poll(),this.input.anyPressed()&&this.audio.unlock(),this.screen?.tick(),this.acc-=1/Fo,n++;n===5&&(this.acc=0),this.screen?.frame(i),this.renderer.render(),requestAnimationFrame(e)};requestAnimationFrame(e)}glyphStyle(e){const t=this.input.padInfo(e);return!t||this.input.lastDevice[e]!=="pad"?"kb":t.kind==="xbox"?"xbox":"ps"}menuStyle(){const e=this.input.connectedPads();if(!e.length||this.input.lastDevice[0]!=="pad"&&this.input.lastDevice[1]!=="pad")return"kb";const t=this.input.lastDevice[0]==="pad"?0:1;return(this.input.padInfo(t)??e[0]).kind==="xbox"?"xbox":"ps"}glyph(e,t=0,i){const n=i??this.glyphStyle(t);return`<span class="g ${l0(e,n)}">${o0(e,n,t)}</span>`}mg(e){const t=this.menuStyle();if(t==="ps"){const n={confirm:["g-cross","✕"],back:["g-circle","○"],extra:["g-triangle","△"],extra2:["g-square","□"],start:["g-shoulder","OPTIONS"]}[e];return`<span class="g ${n[0]}">${n[1]}</span>`}return t==="xbox"?`<span class="g g-key">${{confirm:"A",back:"B",extra:"Y",extra2:"X",start:"MENU"}[e]}</span>`:`<span class="g g-key">${{confirm:"Enter",back:"Esc",extra:"I",extra2:"O",start:"Esc"}[e]}</span>`}}const ut={light:15845285,fair:15251604,medium:14262908,warm:14921868,olive:13012579,deep:7029808},kt={black:1709330,dark:2827296,brown:4862498,light:11569754,grey:10132122,silver:13158600,salt:7236198},Ae={navy:1780298,charcoal:2961206,black:1118742,slate:3820126,steel:2240831,white:16053492,paleBlue:14674421},At=[{id:"netanyahu",name:"Benjamin Netanyahu",nameHe:"בנימין נתניהו",nick:"Bibi",party:"likud",role:"Prime Minister",bio:"Israel's longest-serving Prime Minister. Has survived more no-confidence motions than anyone can count.",style:"technician",stats:{health:1.05,speed:.96},look:{skin:ut.fair,height:1.03,build:1.14,hair:"side",hairColor:13619151,outfit:"suit",jacket:Ae.navy,shirt:Ae.white,tie:2776496,pants:Ae.navy},specials:[{type:"projectile",name:"Red Line Bomb",prop:"bomb",color:16726843,arc:!0,damage:95,desc:"Lobs a cartoon bomb with a red line drawn on it."},{type:"teleport",name:"Coalition Shuffle",color:5219327,mode:"behind",attack:!0,desc:"Swaps partners, and sides. Reappears behind you with a strike."},{type:"shield",name:"Iron Dome",color:10474495,hits:3,desc:"Intercepts the next three incoming attacks."}],ultimate:{type:"cinematic",name:"Sixth Term",color:2780159,prop:"ballot",damage:390},passive:{id:"lifeline",name:"Political Survivor",desc:"Once per match, survives a knockout blow with 1 HP."},quotes:{intro:"I've been here before. I'll be here after.",win:"They said it was over. It's never over."}},{id:"levin",name:"Yariv Levin",nameHe:"יריב לוין",party:"likud",role:"Deputy PM & Justice Minister",bio:"Architect of the judicial overhaul. Treats every court ruling as a personal challenge.",style:"zoner",stats:{health:1},look:{skin:ut.fair,height:.98,build:1.14,hair:"receding",hairColor:kt.dark,outfit:"suit",jacket:Ae.charcoal,shirt:Ae.white,tie:8003371,pants:Ae.charcoal},specials:[{type:"projectile",name:"Judicial Gavel",prop:"gavel",color:12618302,damage:85},{type:"counter",name:"Reasonableness Clause",color:16765286,damage:150,desc:"Declares the attack unreasonable and strikes back."},{type:"grab",name:"Committee Selection",color:9067775,damage:180,desc:"Appoints you to a very uncomfortable committee."}],ultimate:{type:"megarain",name:"The Overhaul",color:12618302,prop:"gavel"},passive:{id:"chipMaster",name:"Override Clause",desc:"Blocking him still hurts: triple chip damage."},quotes:{intro:"Objection overruled. By me.",win:"The court has been... reformed."}},{id:"israel-katz",name:"Israel Katz",nameHe:'ישראל כ"ץ',party:"likud",role:"Defense Minister",bio:"Former Transport Minister who built roads, rails and interchanges. Now runs defense like a construction project.",style:"brawler",stats:{health:1.1,speed:.9,power:1.05,weight:1.2},look:{skin:ut.warm,height:1.02,build:1.32,hair:"horseshoe",hairColor:kt.silver,outfit:"suit",jacket:2831430,shirt:Ae.white,tie:2052e3,pants:2831430},specials:[{type:"wave",name:"Light Rail Line",prop:"train",color:14034984,damage:80,desc:"Sends a light-rail car along the floor. Block low!"},{type:"rush",name:"Express Train",color:16758531,hits:3,damage:130,armor:!0,prop:"train",desc:"Armored charge like an express train."},{type:"rising",name:"Interchange Uppercut",color:16766474,hits:2,damage:125}],ultimate:{type:"megaprojectile",name:"National Infrastructure Plan",color:16739125,prop:"train"},passive:{id:"heavyArmor",name:"Heavyweight",desc:"Heavy attacks absorb one hit during startup."},quotes:{intro:"Clear the tracks.",win:"Another project completed ahead of schedule."}},{id:"ohana",name:"Amir Ohana",nameHe:"אמיר אוחנה",party:"likud",role:"Speaker of the Knesset",bio:"Runs the plenum with an iron gavel. Order in the house is non-negotiable.",style:"technician",stats:{speed:1.05},look:{skin:ut.medium,height:1,build:.95,hair:"short",hairColor:kt.black,outfit:"suit",jacket:1842982,shirt:Ae.white,tie:3160658,pants:1842982},specials:[{type:"projectile",name:"Order! Order!",prop:"sound",color:16044894,damage:50,effect:{stun:40},desc:"A booming call to order that stuns."},{type:"grab",name:"Removal From the Plenum",color:15087942,damage:160,range:1.4,desc:"Has you escorted out of the chamber. Forcefully."},{type:"rising",name:"Session Adjourned",color:16044894,damage:120}],ultimate:{type:"megarain",name:"Emergency Session",color:4553629,prop:"chair"},passive:{id:"meterBoost",name:"Speaker's Privilege",desc:"Builds Ultimate meter 30% faster."},quotes:{intro:"The member is out of order.",win:"This session is adjourned."}},{id:"regev",name:"Miri Regev",nameHe:"מירי רגב",party:"likud",role:"Transport Minister",bio:"Former IDF spokesperson and Culture Minister. Now controls every road, runway and traffic light.",style:"rushdown",stats:{speed:1.02},look:{skin:ut.medium,height:.94,build:.92,hair:"bob",hairColor:kt.black,outfit:"blazer",jacket:12653087,shirt:1118481,tie:null,pants:1118481,female:!0},specials:[{type:"trap",name:"Traffic Jam",prop:"cone",color:16743168,damage:40,effect:{slow:180},desc:"Drops a traffic cone. Step on it and you're stuck in traffic."},{type:"rush",name:"Highway Rush",color:16759304,hits:2,damage:115,distance:4},{type:"spin",name:"Red Carpet Spin",color:13631488,hits:4,damage:105}],ultimate:{type:"cinematic",name:"Grand Opening Ceremony",color:16764928,prop:"scissors"},passive:{id:"rage",name:"Culture War",desc:"Deals 25% more damage below 30% health."},quotes:{intro:"This road is closed. For you.",win:"Cut the ribbon!"}},{id:"amsalem",name:"David Amsalem",nameHe:"דוד אמסלם",nick:"Dudi",party:"likud",role:"Minister & Likud MK",bio:"Famous for plenum speeches you can hear from Tel Aviv. Volume: maximum.",style:"brawler",stats:{power:1.08,speed:.95,weight:1.15},look:{skin:ut.medium,height:1,build:1.22,hair:"bald",hairColor:3355443,facialHair:"stubble",facialHairColor:3355443,outfit:"open-suit",jacket:Ae.charcoal,shirt:15395562,tie:null,pants:Ae.charcoal},specials:[{type:"beam",name:"Sonic Rant",prop:"sound",color:16765286,length:3.6,damage:120,hits:5,desc:"A point-blank blast of pure volume."},{type:"wave",name:"Plenum Stomp",color:15167313,damage:80},{type:"rising",name:"Table Flip",prop:"chair",color:10506797,damage:130}],ultimate:{type:"megabeam",name:"Ultimate Shouting Match",color:16711790,prop:"sound"},passive:{id:"ironWill",name:"Thick Skull",desc:"Shrugs off hits: 15% shorter hitstun."},quotes:{intro:"Sit down! I have the floor!",win:"Did everyone hear that? Good."}},{id:"barkat",name:"Nir Barkat",nameHe:"ניר ברקת",party:"likud",role:"Economy Minister",bio:"Tech millionaire and former Mayor of Jerusalem. Treats every fight like a startup exit.",style:"balanced",stats:{speed:1.05,jump:1.08},look:{skin:ut.light,height:1.07,build:.95,hair:"receding",hairColor:10129286,outfit:"suit",jacket:Ae.slate,shirt:Ae.paleBlue,tie:1914199,pants:Ae.slate},specials:[{type:"projectile",name:"Startup Pitch",prop:"laptop",color:5032432,damage:80},{type:"dive",name:"Angel Investor Dive",color:5032432,damage:95},{type:"rising",name:"Market Rally",prop:"coin",color:5420936,damage:120,hits:3}],ultimate:{type:"megaprojectile",name:"Unicorn Valuation",color:16766474,prop:"coin"},passive:{id:"deepPockets",name:"Deep Pockets",desc:"Starts every round with half a meter."},quotes:{intro:"Let's disrupt this.",win:"Exit achieved. Acquired for a billion."}},{id:"gotliv",name:"Tally Gotliv",nameHe:"טלי גוטליב",party:"likud",role:"Likud MK",bio:"Criminal lawyer turned firebrand MK. Objects to everything, loudly.",style:"rushdown",stats:{},look:{skin:ut.fair,height:.96,build:.9,hair:"wavy",hairColor:kt.brown,outfit:"blazer",jacket:Ae.black,shirt:Ae.white,tie:null,pants:Ae.black,female:!0},specials:[{type:"projectile",name:"Legal Brief",prop:"paper",color:15858414,count:3,damage:36},{type:"barrage",name:"Cross-Examination",color:15087942,hits:7,damage:120},{type:"counter",name:"Objection!",color:16758531,damage:140}],ultimate:{type:"cinematic",name:"Closing Argument",color:15087942,prop:"book"},passive:{id:"counterPunch",name:"Sustained!",desc:"Counter-hits deal 50% extra damage."},quotes:{intro:"Objection! Your Honor, look at this!",win:"No further questions."}},{id:"karhi",name:"Shlomo Karhi",nameHe:"שלמה קרעי",party:"likud",role:"Communications Minister",bio:"Wants to reform the airwaves, the public broadcaster and possibly your phone plan.",style:"zoner",stats:{},look:{skin:ut.medium,height:1,build:1,hair:"short",hairColor:kt.black,facialHair:"short",facialHairColor:kt.black,headwear:"kippah-knit",headwearColor:2838698,outfit:"open-suit",jacket:Ae.navy,shirt:Ae.white,tie:null,pants:Ae.navy},specials:[{type:"beam",name:"Broadcast Signal",prop:"dish",color:4770532,length:4.5,hits:4,damage:110},{type:"pull",name:"Pull the Plug",prop:"phone",color:9494767,damage:55},{type:"trap",name:"5G Tower",prop:"tower",color:16735631,effect:{stun:45}}],ultimate:{type:"megarain",name:"Media Reform",color:46296,prop:"tv"},passive:{id:"drainer",name:"Frequency Auction",desc:"Every hit drains the opponent's meter."},quotes:{intro:"This channel is now under review.",win:"And we're off the air."}},{id:"may-golan",name:"May Golan",nameHe:"מאי גולן",party:"likud",role:"Minister for Social Equality",bio:"Minister for the Advancement of Women. Advances mostly toward her opponents.",style:"rushdown",stats:{speed:1.03},look:{skin:ut.medium,height:.95,build:.9,hair:"long",hairColor:kt.black,outfit:"blazer",jacket:15921906,shirt:2236962,tie:null,pants:2236962,female:!0},specials:[{type:"projectile",name:"Hot Take",prop:"fire",color:16733184,damage:80,speed:.19},{type:"rush",name:"Spotlight Dash",color:16764928,damage:110,launch:!0},{type:"rising",name:"Headline Kick",color:16711764,damage:120,hits:2}],ultimate:{type:"megarain",name:"Viral Moment",color:16733184,prop:"phone"},passive:{id:"swift",name:"Fast Track",desc:"Moves 18% faster."},quotes:{intro:"You're trending. Not in a good way.",win:"Screenshot that."}},{id:"edelstein",name:"Yuli Edelstein",nameHe:"יולי אדלשטיין",party:"likud",role:"Likud MK, former Speaker",bio:"Former Soviet refusenik, Knesset Speaker and Health Minister who ran the vaccine drive. Unbreakable.",style:"technician",stats:{defense:1.06},look:{skin:ut.light,height:.98,build:1.05,hair:"receding",hairColor:13684944,facialHair:"full",facialHairColor:14211288,glasses:"rect",headwear:"kippah-knit",headwearColor:3158064,outfit:"suit",jacket:Ae.charcoal,shirt:Ae.white,tie:5925772,pants:Ae.charcoal},specials:[{type:"projectile",name:"Booster Shot",prop:"syringe",color:8454107,damage:70,speed:.22,effect:{lifesteal:25},desc:"A fast dart that heals him on hit."},{type:"slam",name:"Speaker's Chair Drop",prop:"chair",color:10322313,damage:120},{type:"heal",name:"Green Pass",color:5420936,amount:90}],ultimate:{type:"megarain",name:"Mass Vaccination Drive",color:8454107,prop:"syringe"},passive:{id:"ironWill",name:"Refusenik",desc:"Unbreakable will: 15% shorter hitstun."},quotes:{intro:"I've faced tougher interrogations.",win:"Next patient, please."}},{id:"saar",name:"Gideon Sa'ar",nameHe:"גדעון סער",party:"likud",role:"Foreign Minister",bio:"Left Likud, founded New Hope, merged back into Likud. Always finds his way home.",style:"zoner",stats:{},look:{skin:ut.fair,height:1.06,build:.98,hair:"bald",hairColor:kt.grey,outfit:"suit",jacket:Ae.steel,shirt:Ae.white,tie:3835647,pants:Ae.steel},specials:[{type:"projectile",name:"Diplomatic Cable",prop:"envelope",color:10670847,damage:75,homing:!0},{type:"grab",name:"Party Merger",color:3835647,damage:175,desc:"Absorbs your party. And you."},{type:"teleport",name:"Return Flight",color:12443902,mode:"behind",attack:!0}],ultimate:{type:"cinematic",name:"Summit Meeting",color:3835647,prop:"flag"},passive:{id:"regen",name:"New Hope",desc:"Recovers part of his lost health when not taking damage."},quotes:{intro:"I left. I came back. Now I'm here for you.",win:"Diplomacy by other means."}},{id:"dichter",name:"Avi Dichter",nameHe:"אבי דיכטר",party:"likud",role:"Agriculture Minister",bio:"Former head of the Shin Bet, now in charge of farms. Knows where you are, and what you ate.",style:"technician",stats:{},look:{skin:ut.fair,height:1,build:1.02,hair:"bald",hairColor:11184810,outfit:"suit",jacket:3881787,shirt:Ae.white,tie:2792847,pants:3881787},specials:[{type:"projectile",name:"Tomato Toss",prop:"tomato",color:15087942,count:2,arc:!0,damage:50},{type:"teleport",name:"Covert Op",color:2829634,mode:"behind",attack:!0},{type:"wave",name:"Harvest Sweep",prop:"leaf",color:8435992,damage:80}],ultimate:{type:"megarain",name:"Agricultural Reform",color:5613104,prop:"watermelon"},passive:{id:"quickRecovery",name:"Shin Bet Training",desc:"Gets up faster, and his backdash is invincible."},quotes:{intro:"We've had a file on you for years.",win:"Harvest season."}},{id:"silman",name:"Idit Silman",nameHe:"עידית סילמן",party:"likud",role:"Environmental Protection Minister",bio:"Brought down a government by crossing the floor. Now she recycles opponents.",style:"balanced",stats:{},look:{skin:ut.fair,height:.94,build:.92,hair:"bob",hairColor:3877407,outfit:"skirt",jacket:2976335,shirt:Ae.white,tie:null,pants:2976335,female:!0},specials:[{type:"projectile",name:"Recycling Bin",prop:"bin",color:2976335,arc:!0,damage:90},{type:"teleport",name:"Crossing the Floor",color:9819570,mode:"behind",attack:!0},{type:"shield",name:"Green Shield",color:7653021,hits:2}],ultimate:{type:"megarain",name:"Coalition Collapse",color:5420936,prop:"brick"},passive:{id:"projectileProof",name:"Sustainable",desc:"Takes half damage from projectiles."},quotes:{intro:"I've switched sides before.",win:"Reduce. Reuse. Defeat."}},{id:"ofir-katz",name:"Ofir Katz",nameHe:"אופיר כץ",party:"likud",role:"Coalition Whip",bio:"Keeps the coalition in line, one late-night vote at a time.",style:"rushdown",stats:{},look:{skin:ut.warm,height:1,build:1.02,hair:"short",hairColor:kt.dark,facialHair:"stubble",facialHairColor:kt.dark,outfit:"suit",jacket:Ae.navy,shirt:Ae.white,tie:2508371,pants:Ae.navy},specials:[{type:"pull",name:"The Whip",color:15320170,damage:60,desc:"Cracks the coalition whip and drags you into line."},{type:"rush",name:"Emergency Vote",color:16032353,hits:2,damage:115},{type:"rising",name:"Party Discipline",color:15167313,damage:120}],ultimate:{type:"cinematic",name:"Coalition Lockdown",color:15320170,prop:"ballot"},passive:{id:"comboMaster",name:"Three-Line Whip",desc:"Combos lose less damage to scaling."},quotes:{intro:"Nobody leaves until the vote passes.",win:"Motion carried."}},{id:"kisch",name:"Yoav Kisch",nameHe:"יואב קיש",party:"likud",role:"Education Minister",bio:"Former combat pilot, now Education Minister. Grades on a curve. A ballistic one.",style:"rushdown",stats:{jump:1.1,speed:1.04},look:{skin:ut.fair,height:1.03,build:.98,hair:"short",hairColor:3877407,outfit:"suit",jacket:2508371,shirt:Ae.white,tie:2792847,pants:2508371},specials:[{type:"projectile",name:"Paper Airplane",prop:"plane",color:15858414,damage:70,speed:.18,homing:!0},{type:"dive",name:"Dive Bomb",color:9358054,damage:95},{type:"rising",name:"Report Card",color:16758531,damage:115,height:1.1}],ultimate:{type:"megarain",name:"Final Exam",color:2203324,prop:"book"},passive:{id:"doubleJump",name:"Top Gun",desc:"Can jump again in mid-air."},quotes:{intro:"Pop quiz. Are you ready?",win:"See me after class."}},{id:"lapid",name:"Yair Lapid",nameHe:"יאיר לפיד",party:"yeshatid",role:"Leader of the Opposition",bio:"Former TV anchor, novelist and Prime Minister. Keeps boxing gloves in the office, just in case.",style:"rushdown",stats:{speed:1.04,power:1.02},look:{skin:ut.fair,height:1.04,build:1,hair:"swept",hairColor:12566463,outfit:"open-suit",jacket:Ae.black,shirt:1381914,tie:null,pants:Ae.black},specials:[{type:"projectile",name:"Breaking News",prop:"mic",color:42747,damage:80},{type:"barrage",name:"Anchorman Combo",color:361162,hits:6,damage:115},{type:"rising",name:"Rotation Agreement",color:42747,hits:3,damage:125}],ultimate:{type:"cinematic",name:"There Is A Future",color:42747,prop:"tv"},passive:{id:"meterBoost",name:"Prime Time",desc:"Builds Ultimate meter 30% faster."},quotes:{intro:"Good evening. Tonight's top story: you, losing.",win:"And that's the news."}},{id:"ben-ari",name:"Merav Ben-Ari",nameHe:"מירב בן ארי",party:"yeshatid",role:"Yesh Atid MK",bio:"Committee veteran who never misses question time.",style:"technician",stats:{},look:{skin:ut.light,height:.95,build:.92,hair:"long",hairColor:kt.light,outfit:"blazer",jacket:30646,shirt:Ae.white,tie:null,pants:Ae.navy,female:!0},specials:[{type:"projectile",name:"Parliamentary Question",prop:"paper",color:9494767,damage:45,effect:{stun:35}},{type:"spin",name:"Spin Kick Motion",color:46296,hits:4},{type:"counter",name:"Point of Clarification",color:4770532,damage:135}],ultimate:{type:"megabeam",name:"Motion to the Agenda",color:38599,prop:"wave"},passive:{id:"counterPunch",name:"Follow-up Question",desc:"Counter-hits deal 50% extra damage."},quotes:{intro:"I have a follow-up question.",win:"Thank you. The committee is satisfied."}},{id:"gantz",name:"Benny Gantz",nameHe:"בני גנץ",party:"nationalunity",role:"Chairman, Blue and White",bio:"Former IDF Chief of Staff. Tall, calm, and has entered and left more governments than anyone.",style:"balanced",stats:{health:1.08,defense:1.04},look:{skin:ut.light,height:1.1,build:1.02,hair:"short",hairColor:11053224,outfit:"suit",jacket:Ae.navy,shirt:Ae.paleBlue,tie:4756975,pants:Ae.navy},specials:[{type:"slam",name:"Paratrooper Drop",color:4756975,damage:125},{type:"rush",name:"Blue & White Charge",color:4415982,armor:!0,damage:115,distance:3.6},{type:"counter",name:"Unity Guard",color:12443902,damage:145}],ultimate:{type:"cinematic",name:"Joint Operation",color:4415982,prop:"flag"},passive:{id:"thickSkin",name:"Chief of Staff",desc:"Takes 14% less damage."},quotes:{intro:"Israel before everything. Including you.",win:"Mission accomplished. For now."}},{id:"eisenkot",name:"Gadi Eisenkot",nameHe:"גדי איזנקוט",party:"yashar",role:"Former IDF Chief of Staff",bio:"Soft-spoken strategist who plans ten moves ahead. Started his own party to say it straight.",style:"technician",stats:{},look:{skin:ut.medium,height:.98,build:1,hair:"buzz",hairColor:9079434,outfit:"suit",jacket:Ae.charcoal,shirt:Ae.white,tie:7107965,pants:Ae.charcoal},specials:[{type:"trap",name:"Battle Plan",prop:"map",color:5800279,effect:{stun:50}},{type:"teleport",name:"Flanking Maneuver",color:3824192,mode:"behind",attack:!0},{type:"beam",name:"Straight Talk",prop:"sound",color:14342093,length:3.2,damage:110,hits:4}],ultimate:{type:"megarain",name:"Chief's Directive",color:5800279,prop:"jet"},passive:{id:"powerSurge",name:"Strategist",desc:"Special moves deal 20% more damage."},quotes:{intro:"I've already planned this fight.",win:"As expected."}},{id:"tropper",name:"Chili Tropper",nameHe:"חילי טרופר",party:"nationalunity",role:"National Unity MK",bio:"Former teacher and Culture & Sport Minister. Delivers a lecture with every punch.",style:"balanced",stats:{},look:{skin:ut.fair,height:1.02,build:.96,hair:"short",hairColor:kt.dark,facialHair:"stubble",facialHairColor:kt.dark,outfit:"open-suit",jacket:Ae.slate,shirt:Ae.white,tie:null,pants:Ae.slate},specials:[{type:"projectile",name:"Chalk Toss",prop:"chalk",color:16777215,count:2,damage:45,speed:.2},{type:"rush",name:"Sports Tackle",prop:"ball",color:16219904,damage:110,launch:!0},{type:"rising",name:"Culture Kick",color:16564041,damage:115,hits:2}],ultimate:{type:"cinematic",name:"Final Whistle",color:16219904,prop:"whistle"},passive:{id:"regen",name:"Team Player",desc:"Recovers part of his lost health when not taking damage."},quotes:{intro:"Class is in session.",win:"Homework: practice more."}},{id:"tamano-shata",name:"Pnina Tamano-Shata",nameHe:"פנינה תמנו-שטה",party:"nationalunity",role:"National Unity MK",bio:"Trailblazing lawyer and former Aliyah Minister. Breaks glass ceilings for a living.",style:"rushdown",stats:{speed:1.04},look:{skin:ut.deep,height:.95,build:.9,hair:"braids",hairColor:1314572,outfit:"blazer",jacket:16758531,shirt:Ae.white,tie:null,pants:Ae.navy,female:!0},specials:[{type:"projectile",name:"Aliyah Flight",prop:"plane",color:9358054,damage:80,speed:.18},{type:"rush",name:"Integration Drive",color:16758531,hits:2,damage:115},{type:"rising",name:"Glass Ceiling Breaker",color:13299960,damage:125,height:1.15,hits:2}],ultimate:{type:"megaprojectile",name:"Trailblazer",color:16758531,prop:"star"},passive:{id:"swift",name:"First Through the Door",desc:"Moves 18% faster."},quotes:{intro:"Nobody gave me a seat at the table. I took one.",win:"Another ceiling, shattered."}},{id:"deri",name:"Aryeh Deri",nameHe:"אריה דרעי",party:"shas",role:"Shas Chairman",bio:"The ultimate political comeback story and dealmaker. Every coalition goes through him.",style:"technician",stats:{},look:{skin:ut.medium,height:.97,build:1.08,hair:"short",hairColor:3815994,facialHair:"full",facialHairColor:9079434,glasses:"rect",headwear:"kippah",headwearColor:1118481,outfit:"suit",jacket:Ae.black,shirt:Ae.white,tie:1914199,pants:Ae.black},specials:[{type:"pull",name:"Coalition Demands",prop:"briefcase",color:1914199,damage:55},{type:"projectile",name:"Budget Allocation",prop:"shekel",color:16765286,count:3,damage:38},{type:"counter",name:"Veteran's Maneuver",color:4553629,damage:150}],ultimate:{type:"megagrab",name:"The Kingmaker",color:16765286},passive:{id:"lifeline",name:"The Comeback",desc:"Once per match, survives a knockout blow with 1 HP."},quotes:{intro:"Let's make a deal.",win:"Every government needs me."}},{id:"malchieli",name:"Michael Malchieli",nameHe:"מיכאל מלכיאלי",party:"shas",role:"Shas MK",bio:"Former Religious Services Minister. Methodical, patient, and very hard to move.",style:"grappler",stats:{health:1.04},look:{skin:ut.medium,height:1,build:1.12,hair:"short",hairColor:kt.black,facialHair:"full",facialHairColor:2763306,headwear:"kippah",headwearColor:1118481,outfit:"suit",jacket:1842982,shirt:Ae.white,tie:2829634,pants:1842982},specials:[{type:"projectile",name:"Ministry Memo",prop:"paper",color:14737885,damage:75},{type:"grab",name:"Bureaucratic Hold",color:4282999,damage:180},{type:"rising",name:"Ascending Motion",color:7835049,damage:120}],ultimate:{type:"megabeam",name:"Ministerial Decree",color:14737885,prop:"paper"},passive:{id:"thickSkin",name:"Steady Hand",desc:"Takes 14% less damage."},quotes:{intro:"Everything in its proper order.",win:"Filed and stamped."}},{id:"gafni",name:"Moshe Gafni",nameHe:"משה גפני",party:"utj",role:"UTJ MK, Finance Committee veteran",bio:"Long-time Finance Committee chair. Controls the budget, and therefore everything.",style:"zoner",stats:{speed:.9,health:1.05},look:{skin:ut.light,height:.96,build:1.1,hair:"short",hairColor:13684944,facialHair:"long",facialHairColor:15790320,glasses:"round",headwear:"black-hat",outfit:"suit",jacket:855311,shirt:Ae.white,tie:null,pants:855311},specials:[{type:"projectile",name:"Funding Freeze",prop:"snowflake",color:11066076,damage:60,effect:{slow:150},desc:"Freezes your funding: you move slower for a while."},{type:"counter",name:"Committee Veto",color:1914199,damage:150},{type:"beam",name:"Budget Cut",prop:"scissors",color:15858414,length:2.8,damage:120,hits:3}],ultimate:{type:"megarain",name:"Final Budget Vote",color:16765286,prop:"coin"},passive:{id:"drainer",name:"Finance Committee",desc:"Every hit drains the opponent's meter."},quotes:{intro:"Let's discuss the budget.",win:"Motion approved. Funds transferred."}},{id:"goldknopf",name:"Yitzhak Goldknopf",nameHe:"יצחק גולדקנופף",party:"utj",role:"UTJ Chairman (Agudat Yisrael)",bio:"Former Housing Minister. Builds fast and hits like a construction crane.",style:"grappler",stats:{health:1.1,power:1.08,speed:.88,weight:1.25},look:{skin:ut.light,height:1,build:1.26,hair:"short",hairColor:kt.salt,facialHair:"long",facialHairColor:10132122,glasses:"rect",headwear:"black-hat",outfit:"suit",jacket:855311,shirt:Ae.white,tie:null,pants:855311},specials:[{type:"projectile",name:"Brick Toss",prop:"brick",color:12339017,arc:!0,damage:95},{type:"grab",name:"Cornerstone Slam",prop:"brick",color:10996055,damage:190},{type:"trap",name:"Housing Tender",prop:"crane",color:16759304,effect:{stun:45}}],ultimate:{type:"megarain",name:"Housing Boom",color:12339017,prop:"brick"},passive:{id:"heavyArmor",name:"Reinforced Concrete",desc:"Heavy attacks absorb one hit during startup."},quotes:{intro:"Permit approved. Construction begins.",win:"Another building. Another floor."}},{id:"smotrich",name:"Bezalel Smotrich",nameHe:"בצלאל סמוטריץ'",party:"rzp",role:"Finance Minister",bio:"Holds the Treasury keys and the coalition's purse strings. Taxes are his combo starter.",style:"zoner",stats:{},look:{skin:ut.fair,height:1.08,build:.96,hair:"short",hairColor:kt.dark,facialHair:"short",facialHairColor:3877407,headwear:"kippah-knit",headwearColor:16053492,outfit:"open-suit",jacket:Ae.charcoal,shirt:Ae.white,tie:null,pants:Ae.charcoal},specials:[{type:"projectile",name:"Tax Hike",prop:"shekel",color:16765286,damage:75,effect:{drain:15},desc:"A coin that steals meter on hit."},{type:"grab",name:"Treasury Lock",prop:"briefcase",color:15167313,damage:175},{type:"rising",name:"Fiscal Surge",color:16032353,damage:125}],ultimate:{type:"megarain",name:"State Budget",color:16765286,prop:"coin"},passive:{id:"deepPockets",name:"Treasury Keys",desc:"Starts every round with half a meter."},quotes:{intro:"Your budget has been... adjusted.",win:"Balanced books."}},{id:"rothman",name:"Simcha Rothman",nameHe:"שמחה רוטמן",party:"rzp",role:"Constitution Committee Chair",bio:"Chairs the Constitution Committee. Drafts bills faster than you can read them.",style:"zoner",stats:{},look:{skin:ut.light,height:1,build:.98,hair:"short",hairColor:3877407,facialHair:"full",facialHairColor:3877407,glasses:"rect",headwear:"kippah-knit",headwearColor:1914199,outfit:"suit",jacket:Ae.charcoal,shirt:Ae.white,tie:7166330,pants:Ae.charcoal},specials:[{type:"projectile",name:"Draft Bill",prop:"book",color:11895693,count:2,damage:48},{type:"trap",name:"Committee Hearing",prop:"clock",color:7166330,effect:{stun:50}},{type:"rising",name:"Second Reading",color:15046811,damage:120}],ultimate:{type:"megabeam",name:"Third Reading",color:7166330,prop:"book"},passive:{id:"chipMaster",name:"Fine Print",desc:"Blocking him still hurts: triple chip damage."},quotes:{intro:"This bill passes in first reading.",win:"Third reading. Passed."}},{id:"strook",name:"Orit Strook",nameHe:"אורית סטרוק",party:"rzp",role:"Minister of National Missions",bio:"Veteran activist who never, ever backs down.",style:"technician",stats:{defense:1.04},look:{skin:ut.light,height:.93,build:.98,hair:"bob",hairColor:9075306,headwear:"hat",headwearColor:4014171,glasses:"round",outfit:"skirt",jacket:4014171,shirt:Ae.white,tie:null,pants:4014171,female:!0},specials:[{type:"projectile",name:"Mission Statement",prop:"paper",color:15912079,damage:75},{type:"rush",name:"National Mission",color:14711391,armor:!0,damage:115},{type:"counter",name:"Unyielding",color:8499866,damage:140}],ultimate:{type:"cinematic",name:"Ministry Takeover",color:14711391,prop:"map"},passive:{id:"projectileProof",name:"Hardliner",desc:"Takes half damage from projectiles."},quotes:{intro:"I don't negotiate.",win:"Mission complete."}},{id:"ben-gvir",name:"Itamar Ben-Gvir",nameHe:"איתמר בן גביר",party:"otzma",role:"National Security Minister",bio:"Resigned, returned, and threatened to resign again. Always arrives with the sirens on.",style:"brawler",stats:{power:1.06,weight:1.1},look:{skin:ut.warm,height:1,build:1.16,hair:"short",hairColor:kt.dark,headwear:"kippah-knit",headwearColor:16053492,outfit:"open-suit",jacket:Ae.charcoal,shirt:Ae.white,tie:null,pants:Ae.charcoal},specials:[{type:"beam",name:"Siren Blast",prop:"siren",color:16720418,length:3.8,damage:110,hits:5},{type:"rush",name:"Police Reform",color:1920728,hits:2,damage:120,armor:!0},{type:"teleport",name:"Resign & Return",color:16766474,mode:"front",attack:!0,desc:"Vanishes from government, then comes right back swinging."}],ultimate:{type:"megarain",name:"National Guard",color:1920728,prop:"siren"},passive:{id:"rage",name:"Comeback Tour",desc:"Deals 25% more damage below 30% health."},quotes:{intro:"Sirens on. Let's go.",win:"Order has been restored. My order."}},{id:"fogel",name:"Zvika Fogel",nameHe:"צביקה פוגל",party:"otzma",role:"Otzma Yehudit MK",bio:"Retired brigadier general. Old school, heavy artillery, zero subtlety.",style:"brawler",stats:{health:1.05,speed:.9},look:{skin:ut.warm,height:1,build:1.12,hair:"buzz",hairColor:13684944,facialHair:"mustache",facialHairColor:13684944,outfit:"open-suit",jacket:5597999,shirt:14211264,tie:null,pants:4147754},specials:[{type:"rain",name:"Artillery Call",prop:"bomb",color:7041116,count:4,damage:34},{type:"rush",name:"Tank Charge",prop:"tank",color:6319160,armor:!0,damage:125,distance:3},{type:"rising",name:"Reserve Duty",color:11109479,damage:120}],ultimate:{type:"megaprojectile",name:"Full Mobilization",color:6319160,prop:"tank"},passive:{id:"heavyArmor",name:"Old General",desc:"Heavy attacks absorb one hit during startup."},quotes:{intro:"In my day we fought without special moves.",win:"Dismissed."}},{id:"maoz",name:"Avi Maoz",nameHe:"אבי מעוז",party:"noam",role:"Noam Chairman",bio:"A one-man faction with a very specific agenda. Fights alone, and likes it.",style:"zoner",stats:{},look:{skin:ut.light,height:.98,build:.98,hair:"short",hairColor:9079434,facialHair:"full",facialHairColor:10132122,glasses:"rect",headwear:"kippah-knit",headwearColor:2236962,outfit:"suit",jacket:Ae.charcoal,shirt:Ae.white,tie:6182030,pants:Ae.charcoal},specials:[{type:"projectile",name:"Pamphlet Barrage",prop:"paper",color:10454720,count:3,damage:36},{type:"shield",name:"One-Man Faction",color:10454720,hits:2},{type:"beam",name:"Agenda Push",prop:"megaphone",color:12490180,length:3.5,hits:4}],ultimate:{type:"megabeam",name:"Single Seat, Full Volume",color:6182030,prop:"megaphone"},passive:{id:"regen",name:"Lone Seat",desc:"Recovers part of his lost health when not taking damage."},quotes:{intro:"I don't need a coalition.",win:"One seat is enough."}},{id:"lieberman",name:"Avigdor Lieberman",nameHe:"אביגדור ליברמן",nick:"Yvet",party:"yb",role:"Yisrael Beiteinu Chairman",bio:"Former nightclub bouncer turned kingmaker. If you're not on the list, you're not getting in.",style:"grappler",stats:{health:1.12,power:1.1,speed:.86,weight:1.3},look:{skin:ut.light,height:1.02,build:1.3,hair:"buzz",hairColor:kt.grey,facialHair:"short",facialHairColor:kt.grey,outfit:"open-suit",jacket:Ae.charcoal,shirt:Ae.white,tie:null,pants:Ae.charcoal},specials:[{type:"grab",name:"Bouncer's Grip",color:1914199,damage:190,range:1.35},{type:"rush",name:"Iron Fist",color:2575479,armor:!0,damage:125},{type:"wave",name:"Political Earthquake",prop:"wave",color:6330042,damage:85}],ultimate:{type:"megagrab",name:"You're Not on the List",color:1914199},passive:{id:"bouncer",name:"Bouncer",desc:"Throws deal 60% more damage and reach further."},quotes:{intro:"Name? You're not on the list.",win:"Next."}},{id:"forer",name:"Oded Forer",nameHe:"עודד פורר",party:"yb",role:"Yisrael Beiteinu MK",bio:"Former Agriculture Minister. Lieberman's right hand, and a pretty good left too.",style:"balanced",stats:{},look:{skin:ut.light,height:1.02,build:.96,hair:"short",hairColor:3877407,outfit:"suit",jacket:2575479,shirt:Ae.white,tie:10735345,pants:2575479},specials:[{type:"projectile",name:"Watermelon Lob",prop:"watermelon",color:3715072,arc:!0,damage:95},{type:"counter",name:"Committee Chair",color:6330042,damage:140},{type:"rising",name:"Rising Question",color:10735345,damage:120}],ultimate:{type:"cinematic",name:"Commission of Inquiry",color:2575479,prop:"book"},passive:{id:"comboMaster",name:"Loyal Lieutenant",desc:"Combos lose less damage to scaling."},quotes:{intro:"The chairman sends his regards.",win:"Fresh from the field."}},{id:"mansour-abbas",name:"Mansour Abbas",nameHe:"מנסור עבאס",party:"raam",role:"Ra'am Chairman",bio:"Dentist by trade and history-maker by profession: led the first Arab party into a governing coalition.",style:"technician",stats:{},look:{skin:ut.olive,height:1,build:1.02,hair:"short",hairColor:kt.black,facialHair:"mustache",facialHairColor:kt.black,outfit:"suit",jacket:Ae.charcoal,shirt:Ae.white,tie:2976335,pants:Ae.charcoal},specials:[{type:"grab",name:"Root Canal",prop:"drill",color:15858414,damage:175},{type:"barrage",name:"Drill Rush",prop:"drill",color:5420936,hits:7,damage:120},{type:"shield",name:"Bridge Builder",color:9819570,hits:2}],ultimate:{type:"megagrab",name:"Painless Extraction",color:16777215,prop:"tooth"},passive:{id:"vampire",name:"Kingmaker",desc:"Heals 12% of the damage he deals."},quotes:{intro:"Open wide. This won't hurt. Much.",win:"Please rinse."}},{id:"odeh",name:"Ayman Odeh",nameHe:"איימן עודה",party:"hadash",role:"Hadash Chairman",bio:"Lawyer and orator who can rally a crowd in two languages.",style:"zoner",stats:{},look:{skin:ut.olive,height:1.02,build:.98,hair:"short",hairColor:kt.black,facialHair:"stubble",facialHairColor:kt.black,outfit:"open-suit",jacket:3815994,shirt:Ae.white,tie:null,pants:3815994},specials:[{type:"beam",name:"Megaphone",prop:"megaphone",color:14034984,length:4,hits:4,damage:110},{type:"wave",name:"Protest March",prop:"sign",color:16219904,damage:80},{type:"rising",name:"Rising Voice",color:16564041,damage:120}],ultimate:{type:"megarain",name:"Mass Rally",color:14034984,prop:"sign"},passive:{id:"meterBoost",name:"Orator",desc:"Builds Ultimate meter 30% faster."},quotes:{intro:"Let me speak!",win:"The crowd has spoken."}},{id:"tibi",name:"Ahmad Tibi",nameHe:"אחמד טיבי",party:"hadash",role:"Ta'al Chairman",bio:"Physician and the Knesset's sharpest wit. His one-liners leave marks.",style:"technician",stats:{},look:{skin:ut.olive,height:1,build:1.05,hair:"receding",hairColor:10526880,facialHair:"mustache",facialHairColor:10132122,glasses:"rect",outfit:"suit",jacket:Ae.charcoal,shirt:Ae.white,tie:7864320,pants:Ae.charcoal},specials:[{type:"projectile",name:"One-Liner",prop:"star",color:16766474,speed:.24,damage:70},{type:"counter",name:"Witty Retort",color:16761600,damage:150},{type:"heal",name:"Doctor's Orders",color:8454107,amount:90}],ultimate:{type:"cinematic",name:"Standing Ovation",color:16766474,prop:"mic"},passive:{id:"counterPunch",name:"Sharpest Wit",desc:"Counter-hits deal 50% extra damage."},quotes:{intro:"Is that your best line?",win:"The doctor is out."}},{id:"touma-sliman",name:"Aida Touma-Sliman",nameHe:"עאידה תומא-סלימאן",party:"hadash",role:"Hadash MK",bio:"Veteran feminist activist and journalist. The first Arab woman to chair a Knesset committee.",style:"balanced",stats:{},look:{skin:ut.medium,height:.94,build:.95,hair:"bob",hairColor:9079434,glasses:"round",outfit:"blazer",jacket:7864320,shirt:1118481,tie:null,pants:1118481,female:!0},specials:[{type:"projectile",name:"Petition Storm",prop:"paper",color:16777215,count:3,damage:38},{type:"rush",name:"Equal Rights Rush",color:12653087,damage:115,hits:2},{type:"rising",name:"Status Check",color:16741775,damage:120}],ultimate:{type:"megarain",name:"Women's March",color:12653087,prop:"sign"},passive:{id:"thickSkin",name:"Seasoned Activist",desc:"Takes 14% less damage."},quotes:{intro:"I've been fighting longer than you've been in politics.",win:"Equality: achieved."}},{id:"kariv",name:"Gilad Kariv",nameHe:"גלעד קריב",party:"democrats",role:"The Democrats MK",bio:"Reform rabbi and legislator. Amends opponents clause by clause.",style:"technician",stats:{},look:{skin:ut.light,height:1,build:1,hair:"short",hairColor:3877407,facialHair:"short",facialHairColor:3877407,glasses:"round",headwear:"kippah-knit",headwearColor:12653087,outfit:"suit",jacket:Ae.charcoal,shirt:Ae.white,tie:12653087,pants:Ae.charcoal},specials:[{type:"projectile",name:"Amendment",prop:"paper",color:15672124,damage:75},{type:"trap",name:"Parliamentary Question",prop:"clock",color:9279918,effect:{stun:45}},{type:"rising",name:"Reform Rising",color:15672124,damage:120}],ultimate:{type:"megabeam",name:"Constitutional Crisis",color:15672124,prop:"book"},passive:{id:"powerSurge",name:"Legislator",desc:"Special moves deal 20% more damage."},quotes:{intro:"I'd like to propose an amendment. To your face.",win:"Amendment adopted."}},{id:"lazimi",name:"Naama Lazimi",nameHe:"נעמה לזימי",party:"democrats",role:"The Democrats MK",bio:"Grassroots social activist. Brings the protest to the plenum, and the plenum to the street.",style:"rushdown",stats:{speed:1.03},look:{skin:ut.fair,height:.94,build:.9,hair:"curly",hairColor:2825492,outfit:"tshirt",jacket:14035001,shirt:14035001,tie:null,pants:2834278,female:!0},specials:[{type:"projectile",name:"Protest Sign",prop:"sign",color:14035001,damage:80},{type:"rush",name:"Kaplan March",color:16731501,hits:3,damage:120},{type:"spin",name:"Social Justice Kick",color:16748451,hits:4,damage:105}],ultimate:{type:"megarain",name:"Mass Protest",color:14035001,prop:"sign"},passive:{id:"swift",name:"Grassroots",desc:"Moves 18% faster."},quotes:{intro:"We're not going home.",win:"The street has spoken."}}],Ol=Object.fromEntries(At.map(s=>[s.id,s]));function gS(s){return{...s,boss:!0,name:s.name,role:`FINAL BOSS · ${s.role}`}}const tn=[{id:"plenum",kind:"plenum",name:"The Plenum",nameHe:"מליאת הכנסת",desc:"The horseshoe of power. Mind the government table.",music:{bpm:138,root:45,mode:"minor",intensity:1}},{id:"plaza",kind:"plaza",name:"Menorah Plaza",nameHe:"רחבת המנורה",desc:"Outside the Knesset, in the shadow of the great Menorah.",music:{bpm:128,root:50,mode:"dorian",intensity:.8}},{id:"committee",kind:"committee",name:"Finance Committee",nameHe:"ועדת הכספים",desc:"Where budgets are born and coalitions are bought.",music:{bpm:120,root:43,mode:"phrygian",intensity:.7}},{id:"beach",kind:"beach",name:"Tel Aviv Beach",nameHe:"חוף תל אביב",desc:"Sunset on Gordon Beach. Matkot players look on.",music:{bpm:124,root:48,mode:"major",intensity:.8}},{id:"market",kind:"market",name:"Mahane Yehuda",nameHe:"שוק מחנה יהודה",desc:"The shuk after dark. Every politician campaigns here eventually.",music:{bpm:132,root:47,mode:"phrygian",intensity:.9}},{id:"rooftop",kind:"rooftop",name:"Azrieli Rooftop",nameHe:"גג עזריאלי",desc:"High above Tel Aviv. Round, square and triangle towers.",music:{bpm:146,root:44,mode:"minor",intensity:1}}],th=Object.fromEntries(tn.map(s=>[s.id,s])),vS=["Backbencher","Committee Member","Minister","Prime Minister","Supreme Court"],tf=[{reaction:30,block:.12,aggression:.3,combo:.1,antiAir:.1,tech:0,interval:26,punish:.05,step:.05,juggle:.1},{reaction:20,block:.35,aggression:.45,combo:.35,antiAir:.3,tech:.2,interval:18,punish:.25,step:.12,juggle:.35},{reaction:13,block:.6,aggression:.55,combo:.6,antiAir:.55,tech:.4,interval:12,punish:.5,step:.22,juggle:.6},{reaction:8,block:.8,aggression:.65,combo:.85,antiAir:.8,tech:.6,interval:8,punish:.75,step:.32,juggle:.85},{reaction:4,block:.93,aggression:.75,combo:1,antiAir:.95,tech:.8,interval:5,punish:.95,step:.42,juggle:1}],nf=new Set(["projectile","beam","wave","rain","trap"]),xS=new Set(["rush","dive","slam","teleport","spin","pull"]),yS=new Set(["grab","barrage"]),sf=new Set(["rising","counter"]),MS=new Set(["buff","heal","shield"]);class zl{lv;plan=[];seed;threatTimer=0;decidedThreat=!1;lastMoveKey="";techTried=!1;wakeDelay=0;punished=-1;juggled=-1;idle=0;constructor(e,t=1234){this.lv=tf[Math.max(0,Math.min(tf.length-1,e))],this.seed=t}rand(){return this.seed=this.seed*1103515245+12345&2147483647,this.seed/2147483647}reset(){this.plan=[],this.threatTimer=0,this.decidedThreat=!1}next(e,t){if(t.phase!=="fight")return this.plan=[],e.noGuard=!1,$t;const i=e.opponent,n=e.facing,r={FWD:n>0?6:4,BACK:n>0?4:6,DBACK:n>0?1:3,DFWD:n>0?3:1,UFWD:n>0?9:7},a=e.distTo(i);if(e.state==="thrown")return!this.techTried&&e.stateFrame>=2&&(this.techTried=!0,this.rand()<this.lv.tech)?{dir:5,held:me.TH,pressed:me.TH}:$t;if(e.state==="juggle")return this.plan=[],!this.techTried&&e.vy<0&&e.y<.35&&(this.techTried=!0,this.rand()<this.lv.tech)?this.press(me.LP,5):$t;if(this.techTried=!1,e.state==="knockdown")return this.plan=[],e.stateFrame===1&&(this.wakeDelay=Math.floor(this.rand()*26)),e.stateFrame>=16+this.wakeDelay?{dir:r.BACK,held:0,pressed:0}:$t;if(e.state==="attack"&&e.move&&e.moveHitConfirmed){const f=`${e.move.id}:${t.frame-e.moveFrame}`;if(f!==this.lastMoveKey&&(this.lastMoveKey=f,e.move.kind==="normal"&&e.move.cancel&&e.move.tag!=="launcher"&&this.rand()<this.lv.combo*.6)){if(this.plan=[],e.meter>=100&&this.ultInRange(e,a)&&this.rand()<.6)return this.press(me.UL,5);const u=this.pickSpecial(e,a,["rush","rising","barrage","spin","projectile","beam","pull","grab"]);if(u>=0)return this.press(me.SP,u===2?2:u===1?r.FWD:5)}}const o=e.actionable||e.state==="blockstun"||e.state==="dash"||e.state==="run";if(i.state==="juggle"&&i.juggleCount<=3&&o&&a<2.6&&i.y>.25&&this.juggled!==i.juggleCount&&(this.juggled=i.juggleCount,this.rand()<this.lv.juggle))return this.plan=this.jugglePlan(a,r),e.noGuard=!1,this.plan.shift();if(i.state!=="juggle"&&(this.juggled=-1),this.plan.length){const f=this.plan.shift();return(e.state==="hitstun"||e.state==="wallsplat")&&(this.plan=[]),f}const l=i.move;if(l&&i.state==="attack"&&i.moveFrame>l.startup+l.active&&this.punished!==t.frame-i.moveFrame){const f=l.startup+l.active+l.recovery-i.moveFrame-(e.state==="blockstun"?e.stun:0);if(f>=10&&a<1.9&&(o||e.state==="blockstun")&&(this.punished=t.frame-i.moveFrame,this.rand()<this.lv.punish))return e.noGuard=!1,this.plan=f>=16&&a<1.4?[this.pressFrame(me.HP,r.DFWD),...this.hold(5,20)]:[this.pressFrame(me.LP,5),...this.hold(5,4),this.pressFrame(me.HP,5),...this.hold(5,14)],this.plan.shift()}if(!o&&e.state!=="air")return $t;const c=t.isThreatened(e);if(c?(this.threatTimer++,this.decidedThreat||(e.noGuard=!0)):(this.threatTimer=0,this.decidedThreat=!1,e.noGuard=!1),c&&this.threatTimer>=this.lv.reaction&&!this.decidedThreat&&e.grounded){this.decidedThreat=!0;const f=i.move?.hit?.guard,u=!!i.move&&!i.move.track&&(i.move.hitbox?.lw??.26)<.5&&!i.move.hit?.tracking,d=this.rand();if(u&&i.moveFrame<(i.move?.startup??0)-6&&d<this.lv.step)return e.noGuard=!1,this.plan=[this.pressFrame(me.SS,this.rand()<.5?2:5),...this.hold(5,12)],this.plan.shift();if(this.rand()<this.lv.block)return e.noGuard=!1,f==="high"&&this.rand()<.35?this.plan=[...this.hold(2,14),this.pressFrame(me.HP,5),...this.hold(5,16)]:this.plan=this.hold(f==="low"?r.DBACK:5,14),this.plan.shift()}if(e.state==="blockstun")return{dir:i.move?.hit?.guard==="low"?r.DBACK:5,held:0,pressed:0};if(e.state==="air")return $t;if(!i.grounded&&(i.state==="air"||i.state==="attack"&&!!i.move?.air)&&a<3&&!this.decidedThreat&&this.rand()<this.lv.antiAir*.2){this.decidedThreat=!0;const f=this.findSpecial(e,sf);return f>=0&&e.moves.specials[f].tag==="rising"?this.press(me.SP,f===2?2:f===1?r.FWD:5):this.press(me.HP,r.DFWD)}return this.idle++,this.idle<this.lv.interval?a>3&&this.rand()<this.lv.aggression?{dir:r.FWD,held:0,pressed:0}:$t:(this.idle=0,this.decide(e,t,a,r),this.plan.shift()??$t)}jugglePlan(e,t){const i=[];e>1.4&&i.push(this.pressFrame(0,t.FWD),...this.hold(5,1),this.pressFrame(0,t.FWD),...this.hold(t.FWD,3));const n=this.rand();return n<.5?i.push(this.pressFrame(me.LP,5),...this.hold(5,6),this.pressFrame(me.LP,5),...this.hold(5,6),this.pressFrame(me.HP,5),...this.hold(5,18)):n<.8?i.push(this.pressFrame(me.LP,5),...this.hold(5,12),this.pressFrame(me.LK,5),...this.hold(5,6),this.pressFrame(me.HK,5),...this.hold(5,22)):i.push(this.pressFrame(me.HP,5),...this.hold(5,6),this.pressFrame(me.LP,5),...this.hold(5,18)),i}decide(e,t,i,n){const r=this.rand(),a=this.lv.aggression;if(e.meter>=100&&this.ultInRange(e,i)&&r<.35){this.plan=[this.pressFrame(me.UL,5)];return}if(i>4.2){const c=this.findSpecial(e,nf,t),h=this.findSpecial(e,MS,t);if(c>=0&&r<.35)return this.useSpecial(c,n.FWD);if(h>=0&&r<.45)return this.useSpecial(h,n.FWD);if(r<.55){this.plan=[this.pressFrame(0,n.FWD),...this.hold(5,1),this.pressFrame(0,n.FWD),...this.hold(n.FWD,16)];return}if(r<.75){this.plan=[this.pressFrame(0,n.FWD),...this.hold(5,1),...this.hold(n.FWD,16),this.pressFrame(me.HP,n.FWD),...this.hold(5,26)];return}this.plan=this.hold(n.FWD,20);return}if(i>2.1){const c=this.findSpecial(e,xS,t),h=this.findSpecial(e,nf,t);if(c>=0&&r<.2*(.5+a))return this.useSpecial(c,n.FWD);if(h>=0&&r<.35)return this.useSpecial(h,n.FWD);if(r<.5){this.plan=[this.pressFrame(0,n.FWD),...this.hold(5,1),this.pressFrame(0,n.FWD),...this.hold(n.FWD,8),this.pressFrame(me.LK,5),...this.hold(5,16)];return}if(r<.62){this.plan=[this.pressFrame(me.SS,this.rand()<.5?2:5),...this.hold(5,14)];return}if(r<.72+a*.1){this.plan=[...this.hold(n.FWD,6),this.pressFrame(me.HK,n.UFWD),...this.hold(5,28)];return}if(r<.88){this.plan=this.hold(n.FWD,14);return}this.plan=[this.pressFrame(0,n.BACK),...this.hold(5,1),this.pressFrame(0,n.BACK),...this.hold(5,12)];return}const o=this.findSpecial(e,yS,t);if(o>=0&&i<1.3&&r<.12)return this.useSpecial(o,n.FWD);if(i<1.05&&r<.18){this.plan=[this.pressFrame(me.TH,5),...this.hold(5,10)];return}const l=this.rand();if(l<.18)this.plan=[this.pressFrame(me.LP,5),...this.hold(5,5),this.pressFrame(me.LP,5),...this.hold(5,5),this.pressFrame(me.HP,5),...this.hold(5,10)];else if(l<.3)this.plan=[this.pressFrame(me.LP,n.DFWD),...this.hold(5,18)];else if(l<.4)this.plan=[this.pressFrame(me.LK,5),...this.hold(5,6),this.pressFrame(me.HK,5),...this.hold(5,22)];else if(l<.5)this.plan=this.rand()<.6?[this.pressFrame(me.HK,2),...this.hold(2,4),...this.hold(5,14)]:[this.pressFrame(me.HK,n.DBACK),...this.hold(5,32)];else if(l<.58)this.plan=[this.pressFrame(me.HP,n.DFWD),...this.hold(5,28)];else if(l<.66)this.plan=[this.pressFrame(me.HP,n.FWD),...this.hold(5,26)];else if(l<.74)this.plan=[this.pressFrame(0,n.BACK),...this.hold(5,1),this.pressFrame(0,n.BACK),...this.hold(5,14)];else if(l<.82)this.plan=[this.pressFrame(me.SS,this.rand()<.5?2:5),...this.hold(5,10)];else if(l<.9)this.plan=this.hold(5,12);else{const c=this.findSpecial(e,sf,t);if(c>=0)return this.useSpecial(c,n.FWD);this.plan=[this.pressFrame(me.LK,2),...this.hold(2,8)]}}ultInRange(e,t){switch(e.moves.ultimate.tag){case"cinematic":return t<3.2;case"megagrab":return t<1.6;default:return!0}}findSpecial(e,t,i){const n=[];return e.moves.specials.forEach((r,a)=>{t.has(r.tag??"")&&(!i||e.canUse(r,i))&&n.push(a)}),n.length?n[Math.floor(this.rand()*n.length)]:-1}pickSpecial(e,t,i){for(const n of i){const r=e.moves.specials.findIndex(a=>a.tag===n);if(r>=0){if((n==="grab"||n==="barrage")&&t>1.4)continue;return r}}return-1}useSpecial(e,t){const i=e===2?2:e===1?t:5;this.plan=[this.pressFrame(me.SP,i),...this.hold(5,12)]}press(e,t){return this.pressFrame(e,t)}pressFrame(e,t){return{dir:t,held:e,pressed:e}}hold(e,t){const i=[];for(let n=0;n<t;n++)i.push({dir:e,held:0,pressed:0});return i}}function _S(s,e,t,i){const n=e.facing;switch(s!=="cpu"&&(e.noGuard=s!=="block"),s){case"stand":return $t;case"crouch":return{dir:2,held:0,pressed:0};case"jump":return{dir:8,held:0,pressed:0};case"block":return{dir:e.opponent.move?.hit?.guard==="low"?n>0?1:3:5,held:0,pressed:0};case"cpu":return i?i.next(e,t):$t}}const ih=new Map;function SS(s){return D_(s)??ih.get(s)}async function bS(s,e){const i=document.createElement("canvas");i.width=192,i.height=192;let n;try{n=new ap({canvas:i,antialias:!0,alpha:!0,preserveDrawingBuffer:!0})}catch{return}n.setSize(192,192,!1),n.outputColorSpace=Kt,n.toneMapping=jr,n.setClearColor(0,0);const r=new _o;r.add(new $f(16777215,4477030,1.5));const a=new po(16777215,2.6);a.position.set(1.5,2.5,3),r.add(a);const o=new po(11193599,1.6);o.position.set(-2,1.5,-2),r.add(o);const l=new Ai(24,1,.1,20);for(let c=0;c<s.length;c++){const h=s[c];if(ih.has(h.id))continue;const f=up(h);qM(f),f.root.rotation.y=.35,r.add(f.root),f.root.updateMatrixWorld(!0);const u=new L;f.head.getWorldPosition(u),u.y+=.1*h.look.height,l.position.set(u.x+.25,u.y+.05,u.z+1.35),l.lookAt(u.x,u.y-.08,u.z);const d=Yn[h.party];n.setClearColor(d.color,1),n.render(r,l),ih.set(h.id,i.toDataURL("image/png")),r.remove(f.root),dp(f),e?.(c+1,s.length),c%4===3&&await new Promise(m=>setTimeout(m,0))}n.dispose(),n.forceContextLoss()}function Ue(s){return s.replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e])}function Ze(s,e="",t=""){const i=document.createElement(s);return e&&(i.className=e),t&&(i.innerHTML=t),i}function Jr(s){return"#"+s.toString(16).padStart(6,"0")}function nh(s){let e=s>>16&255,t=s>>8&255,i=s&255;const n=.299*e+.587*t+.114*i;if(n<140){const a=(140-n)/(255-n+1);e=Math.round(e+(255-e)*a*1.4),t=Math.round(t+(255-t)*a*1.4),i=Math.round(i+(255-i)*a*1.4)}const r=a=>Math.max(0,Math.min(255,a));return`rgb(${r(e)},${r(t)},${r(i)})`}function hn(s,e=""){const t=SS(s.id);if(t)return`<img class="${e}" src="${t}" alt="${Ue(s.name)}" draggable="false">`;const i=s.name.split(" ").map(n=>n[0]).join("").slice(0,2);return`<div class="${e} init" style="background:${Jr(Yn[s.party].color)}">${Ue(i)}</div>`}function Rp(s){const e=Yn[s.party];return`<span class="chip" style="background:${Jr(e.color)};color:#fff">${Ue(e.name)} · <span class="he">${Ue(e.nameHe)}</span></span>`}class fr{constructor(e,t,i={}){this.items=e,this.audio=t,this.el=Ze("div","menu"),i.desc&&(this.descEl=Ze("div","desc")),this.build()}items;audio;el;index=0;descEl=null;itemEls=[];setItems(e){this.items=e,this.index=Math.min(this.index,e.length-1),this.build()}build(){this.el.innerHTML="",this.itemEls=this.items.map((e,t)=>{const i=Ze("div","item");return i.addEventListener("mouseenter",()=>{this.index!==t&&(this.index=t,this.render())}),i.addEventListener("click",()=>{this.index=t,this.activate()}),this.el.appendChild(i),i}),this.descEl&&this.el.appendChild(this.descEl),this.render()}render(){this.items.forEach((e,t)=>{const i=this.itemEls[t],n=e.value?`<span class="val">◀ ${Ue(e.value())} ▶</span>`:"";i.innerHTML=`<span>${Ue(e.label)}</span>${n}`,i.classList.toggle("sel",t===this.index),i.classList.toggle("disabled",!!e.disabled)}),this.descEl&&(this.descEl.textContent=this.items[this.index]?.desc??"")}activate(){const e=this.items[this.index];!e||e.disabled||(e.onSelect?(this.audio.sfx("menuConfirm"),e.onSelect()):e.onRight&&(this.audio.sfx("menuMove"),e.onRight(),this.render()))}handle(e){const t=this.items.length;e.up?(this.index=(this.index-1+t)%t,this.audio.sfx("menuMove"),this.render()):e.down?(this.index=(this.index+1)%t,this.audio.sfx("menuMove"),this.render()):e.left&&this.items[this.index]?.onLeft?(this.items[this.index].onLeft(),this.audio.sfx("menuMove"),this.render()):e.right&&this.items[this.index]?.onRight?(this.items[this.index].onRight(),this.audio.sfx("menuMove"),this.render()):e.confirm&&this.activate()}}const no={qcf:"↓↘→",qcb:"↓↙←",dp:"→↓↘",dqcf:"↓↘→↓↘→"},AS=48;function wS(s){switch(s){case 1:return 3;case 3:return 1;case 4:return 6;case 6:return 4;case 7:return 9;case 9:return 7;default:return s}}function Hl(s,e){return e>=0?s:wS(s)}const os=s=>s===1||s===2||s===3,Qa=s=>s===7||s===8||s===9,rf=s=>s===1||s===4||s===7,Ui=s=>e=>e===s,_n=(...s)=>e=>s.includes(e),ES={qcf:[_n(2,1),Ui(3),_n(6,9)],qcb:[_n(2,3),Ui(1),_n(4,7)],dp:[_n(6,9,3),Ui(2),_n(3,6)],dqcf:[_n(2,1),Ui(3),_n(6,9),Ui(2),Ui(3),_n(6,9)],dashF:[Ui(6),Ui(5),Ui(6)],dashB:[Ui(4),Ui(5),Ui(4)]};class TS{dirs=[];presses=[];consumed=[];push(e,t){this.dirs.push(e),this.presses.push(t),this.consumed.push(0),this.dirs.length>AS&&(this.dirs.shift(),this.presses.shift(),this.consumed.shift())}clear(){this.dirs.length=0,this.presses.length=0,this.consumed.length=0}buffered(e,t=hu){let i=0;const n=this.presses.length;for(let r=Math.max(0,n-t);r<n;r++)i|=this.presses[r]&~this.consumed[r]&e;return i}consume(e,t=hu){const i=this.presses.length;for(let n=Math.max(0,i-t);n<i;n++)this.consumed[n]|=this.presses[n]&e}pressedTogether(e,t,i=3){return(this.buffered(e,i)&e)!==0&&(this.buffered(t,i)&t)!==0}motion(e,t=y0,i=8){const n=ES[e],r=this.dirs,a=r.length,o=e==="dqcf"?t*2:t,l=Math.max(0,a-o);let c=n.length-1,h=a-1,f=!1;for(;h>=Math.max(l,a-i);h--)if(n[c](r[h])){f=!0;break}if(!f)return!1;for(c--,h=h-1;h>=l&&c>=0;h--)n[c](r[h])&&c--;return c<0}dash(e){const t=this.dirs.length;if(t<3)return!1;const i=e?6:4;if(this.dirs[t-1]!==i||this.dirs[t-2]===i)return!1;let n=!1;for(let r=t-2;r>=Math.max(0,t-14);r--){const a=this.dirs[r];if(a===5)n=!0;else{if(a===i&&n)return!0;if(a!==5)return!1}}return!1}}const $i=(s,e,t=.26)=>({x:s,y:1.46,w:e,h:.34,lw:t}),Qi=(s,e,t=.26)=>({x:s,y:1.1,w:e,h:.56,lw:t}),Gl=(s,e,t=.3)=>({x:s,y:.24,w:e,h:.42,lw:t}),Lp=[{id:"jab",name:"Jab",input:"1",anim:"jab",i:10,a:2,r:16,box:$i(.62,.62),dmg:30,hs:24,bs:17,guard:"high",push:.05,strings:{LP:"jab2",HP:"onetwo"},desc:"Fastest move. Beats almost everything up close."},{id:"jab2",name:"Double Jab",input:"1,1",anim:"jab2",i:10,a:2,r:17,box:$i(.62,.62),dmg:30,hs:24,bs:17,guard:"high",push:.06,strings:{HP:"onetwo"}},{id:"onetwo",name:"One-Two",input:"1,2",anim:"straight",i:10,a:3,r:20,box:$i(.7,.7),dmg:45,hs:26,bs:18,guard:"high",push:.1,heavy:!0,desc:"Classic natural combo."},{id:"straight",name:"Right Straight",input:"2",anim:"straight",i:12,a:3,r:20,box:$i(.72,.7),dmg:45,hs:25,bs:17,guard:"high",push:.08,strings:{LP:"hook21"}},{id:"hook21",name:"Straight-Hook",input:"2,1",anim:"hook",i:13,a:3,r:24,box:$i(.66,.7,.4),dmg:55,hs:28,bs:16,guard:"high",push:.16,heavy:!0},{id:"lkick",name:"Left Mid Kick",input:"3",anim:"midKick",i:13,a:3,r:20,box:Qi(.8,.8),dmg:40,hs:24,bs:16,guard:"mid",push:.08,strings:{HK:"kick34"},desc:"Fast mid: forces the opponent to stand."},{id:"kick34",name:"Kick Combo",input:"3,4",anim:"highKick",i:14,a:3,r:26,box:$i(.86,.9,.45),dmg:60,hs:26,bs:14,guard:"high",push:.14,heavy:!0,knockdown:!0,screw:!0},{id:"rkick",name:"Right High Kick",input:"4",anim:"highKick",i:12,a:3,r:22,box:$i(.86,.9,.42),dmg:55,hs:26,bs:16,guard:"high",push:.1,heavy:!0,track:.03,strings:{HK:"kick44"}},{id:"kick44",name:"Double Kick",input:"4,4",anim:"kick2",i:15,a:3,r:26,box:Qi(.9,.9),dmg:60,hs:28,bs:14,guard:"mid",push:.2,heavy:!0,wall:!0},{id:"dfJab",name:"Body Jab",input:"d/f+1",anim:"dfJab",i:13,a:2,r:18,box:Qi(.66,.64),dmg:35,hs:24,bs:17,guard:"mid",push:.06,strings:{HP:"dfJab2"},desc:"Safe mid poke."},{id:"dfJab2",name:"Body Jab-Straight",input:"d/f+1,2",anim:"straight",i:14,a:3,r:22,box:$i(.72,.7),dmg:45,hs:26,bs:16,guard:"high",push:.12,heavy:!0},{id:"launcher",name:"Launcher Uppercut",input:"d/f+2",anim:"launcher",i:15,a:3,r:28,box:{x:.52,y:1.2,w:.7,h:.9,lw:.28},dmg:50,hs:30,bs:14,guard:"mid",push:.04,heavy:!0,launch:.17,desc:"Launches on hit: follow up with a juggle combo. Punishable on block."},{id:"dfKick",name:"Front Kick",input:"d/f+3",anim:"frontKick",i:14,a:3,r:22,box:Qi(.84,.8),dmg:45,hs:24,bs:16,guard:"mid",push:.1},{id:"dfKick4",name:"Side Kick",input:"d/f+4",anim:"kick2",i:14,a:3,r:22,box:Qi(.9,.84),dmg:50,hs:24,bs:16,guard:"mid",push:.14},{id:"power",name:"Power Straight",input:"f+2",anim:"power",i:15,a:3,r:24,box:Qi(.8,.8),dmg:60,hs:28,bs:16,guard:"mid",push:.24,heavy:!0,wall:!0,crumpleCH:!0,motion:[{from:4,to:14,vx:.04}],desc:"Big knockback; crumples on counter hit; wall splats."},{id:"knee",name:"Step-in Knee",input:"f+4",anim:"knee",i:16,a:3,r:24,box:Qi(.62,.66),dmg:60,hs:28,bs:15,guard:"mid",push:.12,heavy:!0,motion:[{from:3,to:15,vx:.05}]},{id:"elbow",name:"Elbow",input:"b+1",anim:"elbow",i:13,a:3,r:20,box:Qi(.56,.6),dmg:45,hs:25,bs:16,guard:"mid",push:.1},{id:"bhook",name:"Heavy Hook",input:"b+2",anim:"bHook",i:15,a:3,r:24,box:$i(.64,.72,.5),dmg:60,hs:28,bs:15,guard:"high",push:.18,heavy:!0,track:.04},{id:"spin4",name:"Spinning Heel",input:"b+4",anim:"spinBack",i:18,a:4,r:26,box:$i(.9,1,.9),dmg:75,hs:30,bs:14,guard:"high",push:.18,heavy:!0,knockdown:!0,screw:!0,track:.08,desc:"Homing: catches sidesteps. Screws juggles."},{id:"dJab",name:"Crouch Jab",input:"d+1",anim:"dJab",i:10,a:2,r:16,box:{x:.6,y:.82,w:.6,h:.3,lw:.26},dmg:20,hs:22,bs:16,guard:"mid",push:.05,low:!0},{id:"dStraight",name:"Crouch Straight",input:"d+2",anim:"dStraight",i:12,a:3,r:20,box:{x:.68,y:.85,w:.7,h:.34,lw:.26},dmg:30,hs:24,bs:16,guard:"mid",push:.08,low:!0},{id:"lowKick",name:"Low Kick",input:"d+3",anim:"lowKick",i:16,a:3,r:24,box:Gl(.82,.8),dmg:30,hs:22,bs:13,guard:"low",push:.06,low:!0,otg:!0},{id:"shin",name:"Shin Kick",input:"d+4",anim:"shin",i:12,a:2,r:20,box:Gl(.78,.74),dmg:20,hs:20,bs:13,guard:"low",push:.05,low:!0,otg:!0,desc:"Fast low. Hits grounded opponents."},{id:"sweep",name:"Sweep",input:"d/b+4",anim:"sweep",i:20,a:4,r:30,box:Gl(.96,1,.6),dmg:60,hs:24,bs:12,guard:"low",push:.1,heavy:!0,low:!0,knockdown:!0,launch:.1,otg:!0,track:.04,desc:"Low knockdown. Very punishable on block."},{id:"ufKnee",name:"Rising Knee",input:"u/f+4",anim:"ufKnee",i:15,a:4,r:28,box:{x:.5,y:1.15,w:.7,h:.8,lw:.28},dmg:50,hs:30,bs:14,guard:"mid",push:.04,heavy:!0,launch:.165,motion:[{from:2,to:16,vx:.04}],desc:"Launcher that hops over lows."},{id:"ws2",name:"Rising Uppercut",input:"WS 2",anim:"wsUpper",i:14,a:3,r:26,box:{x:.52,y:1.2,w:.7,h:1,lw:.28},dmg:50,hs:30,bs:14,guard:"mid",push:.04,heavy:!0,launch:.175,desc:"While standing up from a crouch: launcher."},{id:"ws4",name:"Rising Kick",input:"WS 4",anim:"wsKick",i:12,a:3,r:22,box:Qi(.84,.84),dmg:45,hs:26,bs:15,guard:"mid",push:.14,heavy:!0},{id:"dash2",name:"Dash Punch",input:"f,f+2",anim:"dashPunch",i:16,a:3,r:26,box:Qi(.82,.8),dmg:70,hs:30,bs:14,guard:"mid",push:.3,heavy:!0,wall:!0,motion:[{from:1,to:14,vx:.09}],desc:"Dashing blow: huge knockback, wall splats."},{id:"jPunch",name:"Jumping Punch",input:"jump 1/2",anim:"jPunch",i:8,a:6,r:6,box:{x:.56,y:.8,w:.62,h:.44,lw:.28},dmg:40,hs:22,bs:15,guard:"high",push:.06,air:!0},{id:"jKick",name:"Jumping Kick",input:"jump 3/4",anim:"jKick",i:9,a:6,r:6,box:{x:.7,y:.45,w:.8,h:.5,lw:.3},dmg:55,hs:24,bs:15,guard:"mid",push:.08,heavy:!0,air:!0}],CS=Lp.map(s=>({id:s.id,name:s.name,input:s.input,desc:s.desc,guard:s.guard})),PS={balanced:{startup:0,heavyStartup:0,recovery:0,damage:1,reach:0,hitstun:0},rushdown:{startup:-1,heavyStartup:-1,recovery:0,damage:.94,reach:-.03,hitstun:0},brawler:{startup:0,heavyStartup:1,recovery:1,damage:1.12,reach:0,hitstun:1},grappler:{startup:0,heavyStartup:1,recovery:0,damage:1.05,reach:0,hitstun:0},zoner:{startup:0,heavyStartup:0,recovery:0,damage:.95,reach:.1,hitstun:0},technician:{startup:0,heavyStartup:0,recovery:-1,damage:1,reach:.04,hitstun:1}},Ip={balanced:"All-rounder",rushdown:"Rushdown: fast pokes, fast feet",brawler:"Brawler: slower, hits harder",grappler:"Grappler: huge throws, sturdy",zoner:"Zoner: long reach, keeps you out",technician:"Technician: tight frames, big combos"};function RS(s,e){const t=PS[s],i={};for(const n of Lp){const r=Math.max(6,n.i-1+t.startup+(n.heavy?t.heavyStartup:0)),a=Math.max(4,n.r+t.recovery),o=n.heavy?t.reach:t.reach*.5,l={damage:Math.round(n.dmg*t.damage*e),chip:0,hitstun:n.hs+t.hitstun,blockstun:n.bs,guard:n.guard,pushback:n.push,spark:n.heavy?"heavy":"light",knockdown:n.knockdown,launch:n.launch??(n.knockdown?.12:void 0),launchVx:(n.launch??0)>=so?.012:void 0,meterGain:n.heavy?6:3,screw:n.screw,wall:n.wall,crumpleCH:n.crumpleCH,otg:n.otg,tracking:(n.box.lw??0)>=.8};i[n.id]={id:n.id,name:n.name,kind:"normal",anim:n.anim,startup:r,active:n.a,recovery:a,hitbox:{...n.box,x:n.box.x+o/2,w:n.box.w+o},hit:l,air:n.air,lowProfile:n.low,strings:n.strings,track:n.track,hitRecovery:(n.launch??0)>=so?8:void 0,cancel:["special","super"],motion:n.motion,tag:n.launch&&!n.knockdown?"launcher":n.heavy?"heavy":"light",desc:n.desc}}return i}function LS(s,e){const t=s==="grappler";return{id:"throw",name:"Throw",kind:"throw",anim:"throw",startup:11,active:2,recovery:28,throwRange:1+(t?.2:0)+(e?.25:0),throwDamage:Math.round(120*(t?1.4:1)*(e?1.6:1)),techable:!0,tag:"throw"}}function qt(s,e={}){return{damage:s,chip:Math.round(s*.15),hitstun:22,blockstun:17,guard:"mid",pushback:.12,spark:"special",meterGain:8,...e}}const Xn=(s,e,t)=>e+(t-e)*s.strength,IS={projectile:"Fires a projectile.",rush:"Charges forward with a strike.",rising:"Invincible rising anti-air.",grab:"Unblockable command grab.",counter:"Counter stance: absorbs a strike and retaliates.",buff:"Temporary power-up.",heal:"Recovers health (vulnerable).",teleport:"Vanishes and reappears.",wave:"Ground wave: must be blocked low or jumped.",dive:"Diving kick (also works in the air).",trap:"Places a trap on the floor.",beam:"Short-range multi-hit beam.",pull:"Long reach strike that yanks the opponent in.",slam:"Leaps at the opponent and slams down (overhead).",rain:"Calls objects down on the opponent.",shield:"Raises a barrier.",spin:"Spinning multi-hit advance, passes over lows.",barrage:"Rapid flurry of blows."};function Dp(s){return s.desc??IS[s.type]}function DS(s,e){const t=`sp${e}`,i={id:t,name:s.name,kind:"special",color:s.color,tag:s.type,desc:Dp(s),cancel:["super"]};switch(s.type){case"projectile":{const n=s.count??1,r=s.damage??(n>1?45:80),a=s.size??1,o=`${t}`,l=13,c=7;return{...i,anim:"cast",prop:s.prop,startup:l,active:1+(n-1)*c,recovery:26,canStart:(h,f)=>!f.hasProjectile(h,o),onFrame:(h,f)=>{const u=(f-l)/c;if(f<l||u!==Math.floor(u)||u>=n)return;const d=h.fighter,m=(s.speed??.16)*Xn(h,.85,1.15)*(s.arc?.62:1),v=n>1&&!s.arc?(u-(n-1)/2)*.012:0;h.match.spawnProjectile(d,{...d.ahead(.8),y:s.arc?1.7:1.25,speed:m,vy:s.arc?.14+.03*h.strength:v,gravity:s.arc?.0085:0,w:.5*a,h:.45*a,hit:qt(r,{effect:s.effect,knockdown:r>=100,launch:r>=100?.15:void 0}),prop:s.prop,color:s.color,hits:s.hits??1,rehit:7,life:200,homing:s.homing?1:0,tag:o,scale:a})}}}case"rush":{const n=s.hits??1,r=s.damage??110,a=Math.round(r/n),o=10,l=18;return{...i,anim:"charge",prop:s.prop,startup:o,active:l,recovery:20,hitbox:{x:.62,y:1.1,w:.9,h:1.1,lw:.34},track:.06,hit:qt(a,{pushback:n>1?.03:.16,hitstun:n>1?18:24,knockdown:n===1&&!!s.launch,launch:n===1&&s.launch?.24:void 0}),finalHit:n>1?{pushback:.18,knockdown:!0,launch:s.launch?.24:.12}:void 0,rehit:n>1?5:void 0,maxHits:n,armor:s.armor?{from:1,to:o+l,hits:1}:void 0,onFrame:(c,h)=>{const f=c.fighter;if(h>=o-2&&h<=o+l){const u=(s.distance??3.4)*Xn(c,.8,1.2)/(l+2);f.setForward(f.moveConnected?.01:u)}else h>o+l&&(f.vx=f.vz=0)}}}case"rising":{const n=s.hits??1,r=s.damage??120,a=Math.round(r/n);return{...i,anim:"uppercut",prop:s.prop,startup:4,active:14,recovery:16,airborne:!0,invuln:[{from:1,to:9,kind:"full"}],hitbox:{x:.45,y:1.45,w:.8,h:1.4,lw:.42},hit:qt(a,{launch:n>1?.16:.26,launchVx:.03,knockdown:!0,hitstun:20}),finalHit:{launch:.26},rehit:n>1?4:void 0,maxHits:n,onFrame:(o,l)=>{if(l===4){const c=o.fighter;c.vy=.3*(s.height??1)*Xn(o,.88,1.12),c.setForward(.04)}}}}case"grab":return{...i,anim:"grab",prop:s.prop,startup:6,active:3,recovery:30,throwRange:s.range??1.25,throwDamage:s.damage??170,techable:!1,hit:qt(s.damage??170,{guard:"unblockable",knockdown:!0,effect:s.effect})};case"counter":{const n=s.window??24,r={id:`${t}c`,name:s.name,kind:"special",anim:"counterStrike",color:s.color,startup:3,active:6,recovery:18,hitbox:{x:.8,y:1.1,w:1.8,h:1.8,lw:.7},hit:qt(s.damage??140,{knockdown:!0,launch:.2,guard:"mid",spark:"heavy"}),invuln:[{from:1,to:10,kind:"full"}],cancel:["super"]};return{...i,anim:"counterStance",prop:s.prop,startup:3,active:n,recovery:22,counterWindow:{from:3,to:3+n},counterMove:r}}case"buff":{const n={damage:1.3,speed:1.35,defense:.6,armor:2,regen:.45,meter:.35,shield:2,reflect:1,slow:.6};return{...i,anim:"powerup",startup:18,active:1,recovery:16,cooldown:480,onFrame:(r,a)=>{if(a!==18)return;const o=s.duration??(s.buff==="armor"?480:360);r.fighter.addBuff(s.buff,s.value??n[s.buff]??1,o,s.color,r.match)}}}case"heal":return{...i,anim:"powerup",startup:28,active:1,recovery:18,cooldown:600,onFrame:(n,r)=>{if(r!==28)return;const a=(s.amount??80)*Xn(n,.8,1.2);n.fighter.heal(a),n.match.emit({t:"buff",fighter:n.fighter.index,kind:"regen",color:s.color})}};case"teleport":{const n=!!s.attack,r=10;return{...i,anim:"vanish",startup:n?18:12,active:n?5:1,recovery:n?16:12,invuln:[{from:1,to:r+4,kind:"full"}],hitbox:n?{x:.7,y:1.2,w:.9,h:1,lw:.45}:void 0,hit:n?qt(80,{knockdown:!0,launch:.14}):void 0,cooldown:90,onFrame:(a,o)=>{if(o!==r)return;const l=a.fighter,c=a.opponent;let h=l.x-c.x,f=l.z-c.z;const u=Math.hypot(h,f)||1;h/=u,f/=u;let d;s.mode==="behind"?d={x:c.x-h*1.1,z:c.z-f*1.1}:s.mode==="front"?d={x:c.x+h*1.1,z:c.z+f*1.1}:d=l.ahead(-3.5);const m=a.match.clampPos(d);a.match.emit({t:"teleport",fighter:l.index,fromX:l.x,fromZ:l.z,toX:m.x,toZ:m.z,color:s.color}),l.x=m.x,l.z=m.z,l.faceToward(c.x,c.z)}}}case"wave":{const n=t;return{...i,anim:"stomp",prop:s.prop??"wave",startup:14,active:2,recovery:26,canStart:(r,a)=>!a.hasProjectile(r,n),onFrame:(r,a)=>{if(a!==14)return;const o=r.fighter;r.match.spawnProjectile(o,{...o.ahead(.8),y:.22,speed:(s.speed??.13)*Xn(r,.85,1.15),w:.75,h:.42,hit:qt(s.damage??75,{guard:"low",knockdown:!0,launch:.1}),prop:s.prop??"wave",color:s.color,kind:"wave",life:150,tag:n})}}}case"dive":return{...i,anim:"diveKick",startup:10,active:42,recovery:10,airborne:!0,airOK:!0,hitbox:{x:.45,y:.25,w:.75,h:.65,lw:.36},hit:qt(s.damage??90,{guard:"overhead",hitstun:20}),onStart:r=>{const a=r.fighter;a.grounded?(a.vy=.27,a.setForward(.05),a.y=.01):a.vy=Math.max(a.vy,.04)},onFrame:(r,a)=>{const o=r.fighter;a>=10&&!o.moveConnected&&(o.setForward(.2*Xn(r,.85,1.15)),o.vy=-.24)},onHit:r=>{r.fighter.bounceOff()}};case"trap":{const n=t;return{...i,anim:"place",prop:s.prop,startup:12,active:1,recovery:18,cooldown:240,onFrame:(r,a)=>{if(a!==12)return;const o=r.fighter;r.match.removeProjectiles(o,n),r.match.spawnProjectile(o,{...r.match.clampPos(o.ahead(Xn(r,1.4,2.6))),y:.3,w:.8,h:.6,hit:qt(s.damage??60,{guard:"low",effect:s.effect??{stun:50},hitstun:26,pushback:.02}),prop:s.prop,color:s.color,kind:"trap",life:600,durability:99,tag:n,spin:0})}}}case"beam":{const n=s.hits??4,r=s.length??4.2,a=Math.round((s.damage??110)/n);return{...i,anim:"beam",prop:s.prop,startup:16,active:26,recovery:22,onFrame:(o,l)=>{if(l!==16)return;const c=o.fighter;o.match.spawnProjectile(c,{...c.ahead(.7+r/2),y:1.3,w:r,h:.6,hit:qt(a,{hitstun:16,blockstun:12,pushback:.05,effect:s.effect}),prop:s.prop??"sound",color:s.color,kind:"beam",attach:!0,offsetX:.7+r/2,life:26,hits:n,rehit:6,durability:99})}}}case"pull":return{...i,anim:"whip",prop:s.prop,startup:12,active:6,recovery:22,hitbox:{x:2,y:1.2,w:2.8,h:.5,lw:.3},hit:qt(s.damage??50,{hitstun:36,pushback:0,spark:"special"}),onHit:(n,r)=>{if(r)return;const a=n.fighter,o=n.opponent,l=n.match.clampPos(a.ahead(.95));o.x=l.x,o.z=l.z,o.slideX=o.slideZ=0}};case"slam":return{...i,anim:"slamRise",prop:s.prop,startup:20,active:50,recovery:18,airborne:!0,hitbox:{x:.2,y:.3,w:1.3,h:.9,lw:.8},hit:qt(s.damage??120,{guard:"overhead",knockdown:!0,launch:.14}),onStart:n=>{const r=n.fighter;r.vy=.36,r.y=.01,r.faceOpponent();const a=(n.opponent.x-r.x)/42,o=(n.opponent.z-r.z)/42,l=Math.min(1,.17/Math.max(.001,Math.hypot(a,o)));r.vx=a*l,r.vz=o*l},onLand:n=>{const r=n.fighter;n.match.emit({t:"shake",amount:.25});for(const a of[-1,1]){const o=r.dirX*a,l=r.dirZ*a;n.match.spawnProjectile(r,{x:r.x+o*.6,z:r.z+l*.6,dirX:o,dirZ:l,y:.18,speed:.12,w:.6,h:.35,hit:qt(35,{guard:"low",hitstun:16}),prop:"wave",color:s.color,kind:"wave",life:24})}}};case"rain":{const n=s.count??4;return{...i,anim:"summon",prop:s.prop,startup:18,active:1,recovery:28,cooldown:200,onFrame:(r,a)=>{if(a!==18)return;const o=r.fighter;for(let l=0;l<n;l++)r.match.schedule(l*9,()=>{const c=o.opponent;c&&r.match.spawnProjectile(o,{x:c.x+(r.match.rng()-.5)*1.4,z:c.z+(r.match.rng()-.5)*1.4,y:7.5,vy:-.2,gravity:.004,w:.6,h:.6,hit:qt(s.damage??32,{guard:"overhead",hitstun:18,tracking:!0}),prop:s.prop,color:s.color,kind:"rain",life:120})})}}}case"shield":return{...i,anim:"guardUp",startup:8,active:1,recovery:14,cooldown:480,onFrame:(n,r)=>{r===8&&(s.reflect?n.fighter.addBuff("reflect",1,240,s.color,n.match):n.fighter.addBuff("shield",s.hits??2,300,s.color,n.match))}};case"spin":{const n=s.hits??4,r=Math.round((s.damage??100)/n),a=8,o=30;return{...i,anim:"spinKick",startup:a,active:o,recovery:14,airborne:!0,hover:{from:8,to:a+o},hitbox:{x:.25,y:1.15,w:1.5,h:.75,lw:.6},hit:qt(r,{hitstun:18,pushback:.03}),finalHit:{knockdown:!0,launch:.16,pushback:.15},rehit:7,maxHits:n,onFrame:(l,c)=>{const h=l.fighter;c===3&&(h.vy=.13,h.y=.01),c>=a&&c<=a+o&&h.setForward((s.distance??3)*Xn(l,.8,1.2)/o)}}}case"barrage":{const n=s.hits??6,r=Math.round((s.damage??110)/n);return{...i,anim:"flurry",prop:s.prop,startup:6,active:26,recovery:18,hitbox:{x:.72,y:1.3,w:.9,h:.8,lw:.34},hit:qt(r,{hitstun:16,blockstun:10,pushback:.02}),finalHit:{pushback:.2,knockdown:!0,launch:.14},rehit:4,maxHits:n,motion:[{from:6,to:32,vx:.025}]}}}}const kS={cinematic:"Invincible rush. On hit, a devastating combo.",megabeam:"Invincible full-screen beam.",megarain:"Rains destruction across the arena.",megagrab:"Invincible unblockable super grab.",megaprojectile:"Giant unstoppable projectile."};function kp(s){return s.desc??kS[s.type]}function US(s){const e={id:"ult",name:s.name,kind:"super",color:s.color,meterCost:ql,superFreeze:48,tag:s.type,desc:kp(s),prop:s.prop};switch(s.type){case"cinematic":return{...e,anim:"charge",startup:6,active:16,recovery:28,invuln:[{from:1,to:14,kind:"full"}],hitbox:{x:.7,y:1.1,w:1.1,h:1.5,lw:.55},track:.25,hit:qt(40,{chip:60,blockstun:22,pushback:.2,spark:"super"}),onFrame:(t,i)=>{const n=t.fighter;i>=4&&i<=22?n.setForward(n.moveConnected?0:.25):n.vx=n.vz=0},onHit:(t,i)=>{i||t.match.startCinematic(t.fighter,t.opponent,s.damage??380,s.name,s.color,s.prop)}};case"megabeam":return{...e,anim:"beam",startup:12,active:60,recovery:30,invuln:[{from:1,to:14,kind:"full"}],onFrame:(i,n)=>{if(n!==12)return;const r=i.fighter,a=10;i.match.spawnProjectile(r,{...r.ahead(.7+11/2),y:1.25,w:11,h:1.1,hit:qt(Math.round((s.damage??330)/a),{hitstun:16,blockstun:12,chip:8,pushback:.03,spark:"super",tracking:!0}),prop:s.prop??"wave",color:s.color,kind:"mega",attach:!0,offsetX:.7+11/2,life:60,hits:a,rehit:6,durability:999})}};case"megarain":return{...e,anim:"summon",startup:10,active:1,recovery:36,invuln:[{from:1,to:14,kind:"full"}],onFrame:(t,i)=>{if(i!==10)return;const n=t.fighter;for(let r=0;r<14;r++)t.match.schedule(r*5,()=>{const a=n.opponent;a&&t.match.spawnProjectile(n,{x:a.x+(t.match.rng()-.5)*2,z:a.z+(t.match.rng()-.5)*2,y:8,vy:-.26,gravity:.004,w:.85,h:.85,hit:qt(Math.round((s.damage??380)/14),{guard:"overhead",hitstun:20,chip:6,spark:"super",tracking:!0}),prop:s.prop,color:s.color,kind:"rain",life:120,scale:1.6})})}};case"megagrab":return{...e,anim:"grab",startup:3,active:5,recovery:36,invuln:[{from:1,to:9,kind:"full"}],throwRange:1.75,throwDamage:s.damage??400,techable:!1,grabCinematic:{damage:s.damage??400,name:s.name}};case"megaprojectile":return{...e,anim:"cast",startup:14,active:1,recovery:30,invuln:[{from:1,to:16,kind:"full"}],onFrame:(t,i)=>{if(i!==14)return;const n=t.fighter,r=5;t.match.spawnProjectile(n,{...n.ahead(1.1),y:1.2,speed:.15,w:1.5,h:1.5,hit:qt(Math.round((s.damage??340)/r),{hitstun:18,chip:10,pushback:.04,spark:"super",tracking:!0}),prop:s.prop,color:s.color,kind:"mega",hits:r,rehit:7,durability:999,life:160,scale:3.2})}}}}function Up(s){return{x:s.z,z:-s.x}}function Fp(s){for(;s>Math.PI;)s-=Math.PI*2;for(;s<-Math.PI;)s+=Math.PI*2;return s}function FS(s,e,t){const i=Fp(e-s);return Math.abs(i)<=t?e:s+Math.sign(i)*t}const Np={id:"throwExec",name:"Throw",kind:"throw",anim:"throwExec",startup:0,active:0,recovery:44},NS={...Np,id:"grabExec",anim:"grabExec",kind:"special"},af=new Map;function BS(s){const e=s.id+(s.boss?":boss":"");let t=af.get(e);return t||(t={normals:RS(s.style,s.stats.power??1),throw:LS(s.style,s.passive.id==="bouncer"),specials:s.specials.map((i,n)=>DS(i,n)),ultimate:US(s.ultimate)},af.set(e,t)),t}function Bp(s){const e=s.stats,t=(e.speed??1)*(s.passive.id==="swift"?1.18:1)*(s.style==="rushdown"?1.1:s.style==="grappler"?.88:1),i=e.weight??1;return{maxHealth:Math.round(m0*(e.health??1)*(s.style==="grappler"?1.08:1)*(s.boss?1.5:1)),walk:.042*t,back:.034*t,dash:.15*t,run:.1*t,jumpVy:.3*(e.jump??1),jumpVx:.06*t,gravity:d0*(.94+.06*i),dmgMul:(e.power??1)*(s.boss?1.15:1),defMul:1/(e.defense??1)*(s.passive.id==="thickSkin"?.86:1),meterMul:s.passive.id==="meterBoost"?1.3:1,weight:i}}class of{index;def;moves;stats;opponent=null;x=0;y=0;z=0;vx=0;vy=0;vz=0;slideX=0;slideZ=0;yaw=0;facing=1;state="idle";stateFrame=0;move=null;moveFrame=0;moveStrength=.5;moveHits=0;moveLastHit=-99;moveConnected=!1;moveHitConfirmed=!1;pendingString=null;armorLeft=0;fallMove=null;landLag=0;throwBack=!1;throwExec=null;grabbedBy=null;jumpDir=0;airJumps=0;airAttackUsed=!1;dashDir=0;sideX=0;sideZ=0;sidestepDir=-1;wsFrames=0;crouchEnteredFromStand=!1;health;recoverable=0;lastHurtFrame=-999;meter=0;stun=0;juggleCount=0;juggleInvuln=!1;screwed=!1;comboHits=0;comboDamage=0;invuln=0;lifelineUsed=!1;rageArtUsed=!1;rageAnnounced=!1;koed=!1;pendingDizzy=0;buffs=[];cooldowns=new Map;history=new TS;input=$t;relDir=5;roundsWon=0;noGuard=!1;flash=0;guarding=!1;hitHigh=!0;lastHitHeavy=!1;crumpled=!1;knockdownFrames=No;victoryVariant=0;spin=0;constructor(e,t){this.index=e,this.def=t,this.moves=BS(t),this.stats=Bp(t),this.health=this.stats.maxHealth}get dirX(){return Math.cos(this.yaw)}get dirZ(){return Math.sin(this.yaw)}get dir(){return{x:Math.cos(this.yaw),z:Math.sin(this.yaw)}}ahead(e){return{x:this.x+Math.cos(this.yaw)*e,z:this.z+Math.sin(this.yaw)*e}}setForward(e){this.vx=Math.cos(this.yaw)*e,this.vz=Math.sin(this.yaw)*e}localOf(e,t){const i=e-this.x,n=t-this.z,r=this.dir,a=Up(r);return{f:i*r.x+n*r.z,l:i*a.x+n*a.z}}distTo(e){return Math.hypot(e.x-this.x,e.z-this.z)}yawToward(e,t){return Math.atan2(t-this.z,e-this.x)}turnToOpponent(e){const t=this.opponent;t&&(Math.hypot(t.x-this.x,t.z-this.z)<.05||(this.yaw=FS(this.yaw,this.yawToward(t.x,t.z),e)))}faceToward(e,t=this.z){Math.hypot(e-this.x,t-this.z)>.02&&(this.yaw=this.yawToward(e,t))}faceOpponent(){this.opponent&&this.faceToward(this.opponent.x,this.opponent.z)}offAxis(){const e=this.opponent;return e?Math.abs(Fp(this.yawToward(e.x,e.z)-this.yaw)):0}get grounded(){return this.y<=0&&this.vy<=0}get passive(){return this.def.passive.id}get inRage(){return this.health>0&&this.health<this.stats.maxHealth*g0}get isCrouching(){return!!(this.state==="crouch"||(this.state==="blockstun"||this.state==="hitstun")&&os(this.relDir)&&this.grounded||this.state==="attack"&&this.move?.lowProfile)}get actionable(){return this.state==="idle"||this.state==="walkF"||this.state==="walkB"||this.state==="crouch"}resetForRound(e,t,i){this.x=e,this.z=t,this.y=0,this.vx=this.vy=this.vz=this.slideX=this.slideZ=0,this.yaw=i,this.state="idle",this.stateFrame=0,this.move=null,this.pendingString=null,this.fallMove=null,this.throwExec=null,this.grabbedBy=null,this.health=this.stats.maxHealth,this.recoverable=0,this.stun=0,this.juggleCount=0,this.juggleInvuln=!1,this.screwed=!1,this.comboHits=0,this.comboDamage=0,this.invuln=0,this.rageArtUsed=!1,this.rageAnnounced=!1,this.crumpled=!1,this.buffs=[],this.pendingDizzy=0,this.wsFrames=0,this.spin=0,this.cooldowns.clear(),this.history.clear(),this.flash=0,this.guarding=!1,this.noGuard=!1,this.passive==="deepPockets"&&(this.meter=Math.max(this.meter,50))}setState(e){this.state!==e&&(this.state=e,this.stateFrame=0)}ctx(e){return{fighter:this,opponent:this.opponent,match:e,move:this.move,strength:this.moveStrength}}recordInput(e){this.input=e,this.relDir=Hl(e.dir,this.facing),this.history.push(this.relDir,e.pressed)}addBuff(e,t,i,n,r){this.buffs=this.buffs.filter(a=>a.kind!==e),this.buffs.push({kind:e,value:t,frames:i,color:n}),r?.emit({t:"buff",fighter:this.index,kind:e,color:n})}buff(e){return this.buffs.find(t=>t.kind===e)}speedMul(){let e=1;const t=this.buff("speed");t&&(e*=t.value);const i=this.buff("slow");return i&&(e*=i.value),e}outgoingMul(e){let t=this.stats.dmgMul;const i=this.buff("damage");return i&&(t*=i.value),this.inRage&&(t*=1.1),this.passive==="rage"&&this.health<this.stats.maxHealth*.3&&(t*=1.25),this.passive==="powerSurge"&&(e==="special"||e==="projectile")&&(t*=1.2),t}incomingMul(e){let t=this.stats.defMul;const i=this.buff("defense");return i&&(t*=i.value),e&&this.passive==="projectileProof"&&(t*=.5),t}heal(e){this.health=Math.min(this.stats.maxHealth,this.health+e),this.recoverable=Math.max(0,this.recoverable-e)}gainMeter(e){this.meter=Math.max(0,Math.min(Vr,this.meter+e*this.stats.meterMul))}takeDamage(e,t,i=!0){const n=Math.max(0,Math.round(e));return this.health-n<=0&&i&&this.passive==="lifeline"&&!this.lifelineUsed&&!t.training?(this.lifelineUsed=!0,this.health=1,this.invuln=50,t.emit({t:"lifeline",fighter:this.index,name:this.def.passive.name}),!0):(this.health=Math.max(0,this.health-n),this.passive==="regen"&&(this.recoverable=Math.min(this.stats.maxHealth*.4,this.recoverable+n*.4)),this.lastHurtFrame=t.frame,this.inRage&&!this.rageAnnounced&&(this.rageAnnounced=!0,t.emit({t:"rage",fighter:this.index})),!1)}isInvuln(e){if(this.invuln>0||this.throwExec)return!0;switch(this.state){case"getup":case"techroll":case"ko":case"cinematic":case"thrown":case"intro":case"victory":return!0;case"knockdown":return e!=="strike"}if(this.juggleInvuln||this.state==="backdash"&&this.passive==="quickRecovery"&&this.stateFrame<10)return!0;const t=this.move;if(this.state==="attack"&&t?.invuln){for(const i of t.invuln)if(this.moveFrame>=i.from&&this.moveFrame<=i.to&&(i.kind==="full"||i.kind===e))return!0}return!1}canBlock(){if(!this.grounded||this.noGuard)return!1;switch(this.state){case"idle":case"walkB":case"crouch":case"blockstun":case"backdash":return!0;case"land":return this.stateFrame>1}return!1}blockOK(e){if(e==="unblockable")return!1;const t=this.relDir,i=this.state==="crouch"||t===1||t===2;return e==="low"?i&&(t===1||t===2):i?!1:t===5||rf(t)}isCounterable(){const e=this.move;return this.state==="attack"&&!!e&&this.moveFrame<=e.startup+e.active&&e.kind!=="throw"}inCounterWindow(){const e=this.move?.counterWindow;return this.state==="attack"&&!!e&&this.moveFrame>=e.from&&this.moveFrame<=e.to}hasArmor(){if(this.buff("armor"))return!0;const e=this.move;return this.state!=="attack"||!e||this.armorLeft<=0?!1:!!(e.armor&&this.moveFrame>=e.armor.from&&this.moveFrame<=e.armor.to||this.passive==="heavyArmor"&&e.tag==="heavy"&&this.moveFrame<=e.startup+1)}consumeArmor(){const e=this.buff("armor");if(e){e.value-=1,e.value<=0&&(e.frames=0);return}this.armorLeft--}get radius(){return .28*Math.min(1.3,this.def.look.build)}hurtboxes(){switch(this.state){case"getup":case"techroll":case"ko":case"intro":case"victory":return[];case"knockdown":return[{x:this.x,z:this.z,y:.2,h:.4,r:.5}]}const e=this.def.look.height,t=this.radius,i=[];this.state==="wallsplat"?i.push({x:this.x,z:this.z,y:this.y+.9,h:1.8,r:t}):!this.grounded||this.state==="air"||this.state==="juggle"||this.state==="fall"?i.push({x:this.x,z:this.z,y:this.y+.95*e,h:1.3*e,r:t}):this.isCrouching?i.push({x:this.x,z:this.z,y:.55*e,h:1.1*e,r:t+.04}):i.push({x:this.x,z:this.z,y:.9*e,h:1.8*e,r:t});const n=this.move;if(this.state==="attack"&&n?.hitbox&&n.kind==="normal"&&this.moveFrame>n.startup){const r=this.ahead(n.hitbox.x*.85);i.push({x:r.x,z:r.z,y:this.y+n.hitbox.y,h:n.hitbox.h*.8,r:.16})}return i}activeHitbox(){const e=this.move;if(this.state!=="attack"||!e?.hitbox||!e.hit)return null;const t=this.moveFrame;return t<=e.startup||t>e.startup+e.active||e.maxHits!==void 0&&this.moveHits>=e.maxHits||this.moveHits>0&&(!e.rehit||t-this.moveLastHit<e.rehit)?null:e.hitbox}canUse(e,t){return!(e.meterCost&&this.meter<e.meterCost&&!t.infiniteMeter(this)&&!(e.kind==="super"&&this.inRage&&!this.rageArtUsed)||(this.cooldowns.get(e.id)??0)>0||e.canStart&&!e.canStart(this,t))}update(e){switch(this.stateFrame++,this.invuln>0&&this.invuln--,this.flash>0&&this.flash--,this.wsFrames>0&&this.wsFrames--,this.tickBuffs(e),this.state){case"intro":case"victory":case"ko":case"cinematic":case"thrown":return;case"idle":case"walkF":case"walkB":case"crouch":this.neutral(e);return;case"jumpSquat":this.jumpSquat(e);return;case"air":this.airUpdate(e);return;case"land":this.stateFrame>=this.landLag&&this.toNeutral();return;case"dash":case"run":case"backdash":this.dashUpdate(e);return;case"sidestep":case"sidewalk":this.sidestepUpdate(e);return;case"attack":this.attackUpdate(e);return;case"hitstun":case"blockstun":case"dizzy":this.stun--,this.stun<=0&&(this.crumpled=!1,this.toNeutral());return;case"wallsplat":this.stun--,this.stun<=0&&this.enterJuggle(.02,-this.dirX*.01,-this.dirZ*.01);return;case"knockdown":{const t=this.input.dir!==5||(this.input.pressed&pn)!==0;(this.stateFrame>=v0&&t||this.stateFrame>=this.knockdownFrames)&&this.setState("getup");return}case"getup":this.stateFrame>=vf&&(this.faceOpponent(),this.toNeutral());return;case"techroll":{const t=this.stateFrame/Kl,i=.075*Math.sin(Math.PI*Math.min(1,t));this.vx=this.sideX*i,this.vz=this.sideZ*i,this.stateFrame>=Kl&&(this.vx=this.vz=0,this.faceOpponent(),this.toNeutral());return}case"fall":case"juggle":return}}tickBuffs(e){if(this.buffs.length){for(const t of this.buffs)t.frames--,t.kind==="regen"&&this.heal(t.value),t.kind==="meter"&&this.gainMeter(t.value);this.buffs=this.buffs.filter(t=>t.frames>0)}if(this.cooldowns.size)for(const[t,i]of this.cooldowns)i<=1?this.cooldowns.delete(t):this.cooldowns.set(t,i-1);if(this.passive==="regen"&&this.recoverable>0&&e.frame-this.lastHurtFrame>90&&this.health>0){const t=Math.min(this.recoverable,.35);this.health=Math.min(this.stats.maxHealth,this.health+t),this.recoverable-=t}}toNeutral(){this.move=null,this.pendingString=null,this.fallMove=null,this.throwExec=null,this.comboHits=0,this.comboDamage=0,this.juggleCount=0,this.juggleInvuln=!1,this.screwed=!1,this.airAttackUsed=!1,this.airJumps=0,this.stun=0,this.spin=0,this.grounded?(this.vx=this.vz=0,this.setState(os(this.relDir)?"crouch":"idle")):this.setState("air")}startSidestep(e,t){const i=t.camN,n=e?1:-1;this.sideX=i.x*n,this.sideZ=i.z*n,this.sidestepDir=n,this.setState("sidestep")}neutral(e){this.turnToOpponent(.4),this.relDir=Hl(this.input.dir,this.facing);const t=this.relDir,i=this.history;if(this.state==="crouch"&&!os(t)&&(this.wsFrames=12,t===5&&this.stateFrame<=5&&this.crouchEnteredFromStand&&!i.buffered(pn,3))){this.startSidestep(!0,e);return}if(!this.tryAttack(e,!1)){if(i.buffered(me.SS,3)){i.consume(me.SS,3),this.startSidestep(os(t),e);return}if(i.dash(!0)){this.dashDir=1,this.setState("dash");return}if(i.dash(!1)){this.dashDir=-1,this.setState("backdash");return}if(Qa(t)){this.jumpDir=t===9?1:t===7?-1:0,this.setState("jumpSquat");return}if(os(t)){this.state!=="crouch"&&(this.crouchEnteredFromStand=this.state==="idle"||this.state==="walkF"||this.state==="walkB"),this.setState("crouch"),this.guarding=!this.noGuard&&(t===1||t===2)&&e.isThreatened(this);return}if(t===6){this.setState("walkF"),this.guarding=!1;return}if(t===4){this.setState("walkB"),this.guarding=!this.noGuard&&e.isThreatened(this);return}this.guarding=!this.noGuard&&e.isThreatened(this),this.setState("idle")}}jumpSquat(e){if(this.relDir=Hl(this.input.dir,this.facing),!(this.stateFrame<=5&&this.tryAttack(e,!1))){if(!Qa(this.relDir)&&this.stateFrame<=5){this.startSidestep(!1,e);return}this.stateFrame>=6&&this.takeoff(e)}}takeoff(e){this.vy=this.stats.jumpVy,this.y=.001,this.setForward(this.jumpDir*this.stats.jumpVx*this.speedMul()),this.airAttackUsed=!1,this.airJumps=0,this.setState("air"),e.emit({t:"jump",fighter:this.index})}airUpdate(e){if(!this.airAttackUsed&&this.tryAttack(e,!0)){this.airAttackUsed=!0;return}if(this.passive==="doubleJump"&&this.airJumps<1&&this.stateFrame>6){const t=this.history.dirs,i=t.length;if(i>=2&&Qa(t[i-1])&&!Qa(t[i-2])){this.airJumps++;const n=t[i-1]===9?1:t[i-1]===7?-1:0;this.vy=this.stats.jumpVy*.85,this.setForward(n*this.stats.jumpVx),e.emit({t:"jump",fighter:this.index})}}}dashUpdate(e){const t=this.speedMul();if(this.state==="dash"){if(this.turnToOpponent(.2),this.tryAttack(e,!1))return;const i=14,n=this.stateFrame/i;this.setForward(this.stats.dash*t*Math.sin(Math.PI*Math.min(1,n*.85+.15))),this.stateFrame>=i&&(this.relDir===6||this.relDir===9||this.relDir===3?this.setState("run"):(this.vx=this.vz=0,this.toNeutral()))}else if(this.state==="run"){if(this.turnToOpponent(.1),this.tryAttack(e,!1))return;const i=this.stats.run*t*Math.min(1.35,1+this.stateFrame/40);this.setForward(i);const n=this.opponent;this.relDir!==6&&this.relDir!==9&&this.relDir!==3?(this.vx=this.vz=0,this.toNeutral()):this.distTo(n)<.75&&(this.vx=this.vz=0,this.toNeutral())}else{this.stateFrame>9&&this.history.dash(!1)&&(this.stateFrame=0);const n=this.stateFrame/20;if(this.setForward(-this.stats.dash*.85*t*Math.max(0,1-n)**1.4),this.stateFrame>=8&&this.tryAttack(e,!1))return;this.stateFrame>=20&&(this.vx=this.vz=0,this.toNeutral())}}sidestepUpdate(e){if(this.state==="sidestep"){const i=this.stateFrame/18,n=.1*Math.sin(Math.PI*Math.min(1,i))*this.speedMul();if(this.vx=this.sideX*n,this.vz=this.sideZ*n,this.stateFrame>=8&&this.tryAttack(e,!1))return;this.stateFrame>=18&&(this.input.held&me.SS?this.setState("sidewalk"):(this.vx=this.vz=0,this.toNeutral()))}else{const t=this.opponent,i=this.x-t.x,n=this.z-t.z,r=Math.hypot(i,n)||1,a=-n/r,o=i/r,l=Math.sign(a*this.sideX+o*this.sideZ)||1,c=.045*this.speedMul(),h=c*c/(2*r);if(this.vx=a*l*c-i/r*h,this.vz=o*l*c-n/r*h,this.sideX=a*l,this.sideZ=o*l,this.turnToOpponent(.08),this.tryAttack(e,!1))return;this.input.held&me.SS||(this.vx=this.vz=0,this.toNeutral())}}pickSpecial(e){const t=this.history,i=this.relDir;let n=-1,r=.5;if(t.buffered(me.SP))n=os(i)?2:i===6||i===9?1:0;else{const o=t.buffered(Wl),l=t.buffered(mf);o&&t.motion("dp")?(n=2,r=o&me.HP?1:0):o&&t.motion("qcf")?(n=0,r=o&me.HP?1:0):l&&t.motion("qcb")&&(n=1,r=l&me.HK?1:0)}if(n<0)return null;const a=this.moves.specials[n];return e&&!a.airOK?null:[a,r]}pickNormal(e){const t=this.history.buffered(pn);if(!t)return null;const i=(t&me.LP)!==0,n=(t&me.HP)!==0,r=(t&me.LK)!==0,a=(t&me.HK)!==0;if(e)return r||a?"jKick":"jPunch";const o=this.relDir;if((this.state==="dash"||this.state==="run")&&n)return"dash2";if(this.wsFrames>0&&!os(o)){if(n)return"ws2";if(a)return"ws4"}switch(o){case 3:return a?"dfKick4":n?"launcher":r?"dfKick":"dfJab";case 2:return a?"shin":n?"dStraight":r?"lowKick":"dJab";case 1:return a?"sweep":n?"dStraight":r?"lowKick":"dJab";case 6:return a?"knee":n?"power":r?"lkick":"jab";case 4:return a?"spin4":n?"bhook":r?"lkick":"elbow";case 9:if(a)return"ufKnee";break}return a?"rkick":n?"straight":r?"lkick":i?"jab":null}wantsThrow(){const e=this.history;return e.buffered(me.TH)!==0||e.pressedTogether(me.LP,me.LK)||e.pressedTogether(me.HP,me.HK)}tryUltimate(e){const t=this.history,i=this.moves.ultimate,n=this.inRage&&!this.rageArtUsed;return this.meter<ql&&!e.infiniteMeter(this)&&!n?!1:(t.buffered(me.UL)||t.buffered(Wl)&&t.motion("dqcf"))&&this.canUse(i,e)?(t.consume(me.UL|pn|me.SP),this.meter<ql&&!e.infiniteMeter(this)?(this.rageArtUsed=!0,this.startMove({...i,meterCost:0},1,e)):this.startMove(i,1,e),!0):!1}trySpecial(e,t){const i=this.pickSpecial(t);if(!i)return!1;const[n,r]=i;return this.canUse(n,e)?(this.history.consume(pn|me.SP),this.startMove(n,r,e),!0):!1}tryAttack(e,t){if(!t&&this.tryUltimate(e)||this.trySpecial(e,t))return!0;if(!t&&this.wantsThrow())return this.history.consume(me.TH|pn),this.throwBack=rf(this.relDir),this.startMove(this.moves.throw,.5,e),!0;const i=this.pickNormal(t);return i?(this.history.consume(pn),this.startMove(this.moves.normals[i],.5,e),!0):!1}startMove(e,t,i){this.move=e,this.moveFrame=0,this.moveStrength=t,this.moveHits=0,this.moveLastHit=-99,this.moveConnected=!1,this.moveHitConfirmed=!1,this.pendingString=null,this.fallMove=null,this.armorLeft=e.armor?.hits??(this.passive==="heavyArmor"&&e.tag==="heavy"?1:0),this.guarding=!1,this.setState("attack"),this.stateFrame=0,e.meterCost&&!i.infiniteMeter(this)&&(this.meter=Math.max(0,this.meter-e.meterCost)),e.cooldown&&this.cooldowns.set(e.id,e.cooldown),this.grounded&&!e.air&&(this.vx=this.vz=0),this.grounded&&this.offAxis()<.9&&this.turnToOpponent(.5),e.superFreeze?(this.faceOpponent(),i.superFlash(this,e)):e.kind==="special"?(i.emit({t:"special",fighter:this.index,name:e.name,color:e.color??16777215}),this.gainMeter(2)):(e.kind==="normal"||e.kind==="throw")&&i.emit({t:"whiff",fighter:this.index,heavy:e.tag==="heavy"||e.tag==="launcher"}),e.onStart?.(this.ctx(i))}attackUpdate(e){const t=this.move;if(!t){this.toNeutral();return}this.moveFrame++;const i=this.moveFrame;if(t.track&&i<=t.startup&&this.turnToOpponent(t.track),!t.airborne&&!t.air&&this.grounded&&(this.vx=this.vz=0),t.motion)for(const a of t.motion)i>=a.from&&i<=a.to&&(a.vx!==void 0&&this.setForward(a.vx),a.vy!==void 0&&(this.vy=a.vy));if(t.onFrame?.(this.ctx(e),i),this.move!==t||t.throwRange&&!this.throwExec&&i>t.startup&&i<=t.startup+t.active&&(e.tryGrab(this,t),this.move!==t))return;if(t.strings&&!this.pendingString){const a=this.history;for(const o of["LP","HP","LK","HK"]){const l=t.strings[o];if(l&&a.buffered(me[o],10)){a.consume(me[o],10),this.pendingString=this.moves.normals[l]??null;break}}}if(this.pendingString&&i>=t.startup+t.active){const a=this.pendingString;this.pendingString=null,this.startMove(a,.5,e);return}if(this.moveConnected&&i>=t.startup&&this.tryCancel(e,t))return;const n=this.moveHitConfirmed&&t.hitRecovery!==void 0?t.hitRecovery:t.recovery,r=t.startup+t.active+n;if(t.airborne){i>=t.startup+t.active&&!this.grounded?(this.fallMove=t,this.landLag=t.recovery,this.move=null,this.setState("fall")):i>=r&&this.endMove(e);return}i>=r&&this.endMove(e)}tryCancel(e,t){if(t.kind==="normal"){if(t.cancel?.includes("super")&&this.tryUltimate(e)||t.cancel?.includes("special")&&this.trySpecial(e,!!t.air))return!0}else if(t.kind==="special"&&this.moveHitConfirmed&&t.cancel?.includes("super")&&this.tryUltimate(e))return!0;return!1}endMove(e){const t=this.move;t?.onEnd&&t.onEnd(this.ctx(e)),this.move=null,this.throwExec=null,this.grounded?this.toNeutral():(this.setState(t?.air?"air":"fall"),t?.air&&(this.airAttackUsed=!0),this.landLag=4)}bounceOff(){this.move&&(this.fallMove=null,this.landLag=6,this.move=null),this.setForward(-.07),this.vy=.16,this.setState("fall")}enterHitstun(e,t,i){this.move=null,this.pendingString=null,this.fallMove=null,this.throwExec=null,this.stun=Math.max(1,Math.round(e*(this.passive==="ironWill"?.85:1))),this.hitHigh=t,this.lastHitHeavy=i,this.guarding=!1,this.crumpled=!1,this.state="hitstun",this.stateFrame=0}enterBlockstun(e){this.move=null,this.pendingString=null,this.stun=e,this.guarding=!0,this.state="blockstun",this.stateFrame=0}enterJuggle(e,t,i){this.move=null,this.pendingString=null,this.fallMove=null,this.throwExec=null,this.juggleCount++,this.juggleCount>x0&&(this.juggleInvuln=!0),this.vy=e*$s,this.vx=t*$s,this.vz=i*$s,this.slideX=this.slideZ=0,this.y<=0&&(this.y=.01),this.state="juggle",this.stateFrame=0}enterDizzy(e,t=!1){this.move=null,this.pendingString=null,this.stun=e,this.crumpled=t,this.state="dizzy",this.stateFrame=0}enterWallsplat(e,t){this.move=null,this.vx=this.vz=this.slideX=this.slideZ=0,this.vy=0,this.y=Math.min(Math.max(this.y,.15),1.1),this.stun=e,this.state="wallsplat",this.stateFrame=0,t.emit({t:"wallsplat",fighter:this.index})}physics(e){if(this.state==="thrown"||this.state==="cinematic")return;const t=this.speedMul();switch(this.state){case"walkF":this.setForward(this.stats.walk*t);break;case"walkB":this.setForward(-this.stats.back*t);break;case"idle":case"crouch":case"land":case"blockstun":case"hitstun":case"dizzy":case"knockdown":case"getup":case"jumpSquat":case"intro":case"victory":case"wallsplat":this.grounded&&(this.vx=this.vz=0);break}this.x+=this.vx+this.slideX,this.z+=this.vz+this.slideZ;const i=this.grounded?.84:.95;if(this.slideX*=i,this.slideZ*=i,Math.abs(this.slideX)+Math.abs(this.slideZ)<.002&&(this.slideX=this.slideZ=0),this.state==="wallsplat"){this.y=Math.max(.1,this.y-.006);return}if(this.y>0||this.vy>0){const n=this.move;n?.hover&&this.state==="attack"&&this.moveFrame>=n.hover.from&&this.moveFrame<=n.hover.to?this.vy=0:this.state==="juggle"?this.vy-=f0*(1+.08*this.juggleCount):this.vy-=this.stats.gravity,this.y+=this.vy,this.state==="juggle"&&(this.spin+=this.screwed?.35:0),this.y<=0&&(this.y=0,this.land(e))}}land(e){const t=this.vy;switch(this.vy=0,this.y=0,this.state){case"air":this.vx=this.vz=0,this.landLag=4,this.faceOpponent(),this.setState("land"),e.emit({t:"land",fighter:this.index,hard:!1});break;case"attack":{const i=this.move;if(this.vx=this.vz=0,i?.airborne){if(this.moveFrame<=2)break;i.onLand?.(this.ctx(e)),this.landLag=i.recovery}else this.landLag=i?.air?5:2;this.move=null,this.faceOpponent(),this.setState("land"),e.emit({t:"land",fighter:this.index,hard:!1});break}case"fall":{this.vx=this.vz=0;const i=this.fallMove;i?.onLand&&(this.move=i,i.onLand(this.ctx(e)),this.move=null),this.fallMove=null,this.faceOpponent(),this.setState("land"),e.emit({t:"land",fighter:this.index,hard:!1});break}case"juggle":if(this.vx=this.vz=0,this.spin=0,this.slideX=-this.dirX*.02,this.slideZ=-this.dirZ*.02,this.koed)this.setState("ko");else if(this.pendingDizzy>0)this.enterDizzy(this.pendingDizzy),this.pendingDizzy=0;else if(this.history.buffered(pn,8)&&!this.juggleInvuln){this.history.consume(pn,8);const i=e.camN,n=this.index===0?1:-1;this.sideX=i.x*n,this.sideZ=i.z*n,this.setState("techroll"),e.emit({t:"techroll",fighter:this.index})}else this.knockdownFrames=this.passive==="quickRecovery"?Math.round(No/2):No,this.setState("knockdown");e.emit({t:"land",fighter:this.index,hard:!0}),e.emit({t:"shake",amount:Math.min(.2,Math.abs(t)*.6)});break;case"ko":this.vx=this.vz=0,e.emit({t:"land",fighter:this.index,hard:!0});break;default:this.vx=this.vz=0}}}let OS=1;class zS{id=OS++;owner;x;y;z;vx;vy;vz;dirX;dirZ;w;h;hit;prop;color;kind;hitsLeft;rehit;durability;life;age=0;gravity;attach;offsetX;homing;delay;scale;spin;tag;lastHitAge=-999;dead=!1;reflected=!1;onHit;constructor(e,t){this.owner=e,this.x=t.x,this.y=t.y,this.z=t.z,this.dirX=t.dirX??e.dirX,this.dirZ=t.dirZ??e.dirZ;const i=t.speed??0;this.vx=this.dirX*i,this.vz=this.dirZ*i,this.vy=t.vy??0,this.w=t.w,this.h=t.h,this.hit=t.hit,this.prop=t.prop,this.color=t.color,this.kind=t.kind??"normal",this.hitsLeft=t.hits??1,this.rehit=t.rehit??8,this.durability=t.durability??this.hitsLeft,this.life=t.life??240,this.gravity=t.gravity??0,this.attach=!!t.attach,this.offsetX=t.offsetX??0,this.homing=t.homing??0,this.delay=t.delay??0,this.scale=t.scale??1,this.spin=t.spin??.2,this.tag=t.tag,this.onHit=t.onHit}get active(){return!this.dead&&this.age>=this.delay}get facing(){return this.owner.facing}update(e){if(this.age++,!(this.age<this.delay)){if(this.attach){const t=this.owner;this.dirX=t.dirX,this.dirZ=t.dirZ,this.x=t.x+this.dirX*this.offsetX,this.z=t.z+this.dirZ*this.offsetX,(t.state==="hitstun"||t.state==="juggle"||t.state==="knockdown"||t.state==="thrown")&&(this.dead=!0)}else{if(this.homing>0&&e){const t=e.y+1;this.vy+=Math.sign(t-this.y)*this.homing*.01,this.vy=Math.max(-.08,Math.min(.08,this.vy));const i=Math.hypot(this.vx,this.vz);if(i>0){const n=Math.atan2(e.z-this.z,e.x-this.x),r=Math.atan2(this.vz,this.vx);let a=n-r;for(;a>Math.PI;)a-=Math.PI*2;for(;a<-Math.PI;)a+=Math.PI*2;const o=r+Math.max(-.02,Math.min(.02,a))*this.homing;this.vx=Math.cos(o)*i,this.vz=Math.sin(o)*i,this.dirX=Math.cos(o),this.dirZ=Math.sin(o)}}this.vy-=this.gravity,this.x+=this.vx,this.y+=this.vy,this.z+=this.vz,this.kind==="rain"&&this.y<.2&&(this.dead=!0),this.gravity>0&&this.y<.15&&this.kind!=="rain"&&(this.dead=!0)}this.age>=this.life+this.delay&&(this.dead=!0),Math.hypot(this.x,this.z)>30&&(this.dead=!0)}}overlaps(e){if(Math.abs(this.y-e.y)*2>=this.h+e.h)return!1;if(this.attach){const t=this.owner,i=e.x-t.x,n=e.z-t.z,r=i*this.dirX+n*this.dirZ,a=i*this.dirZ-n*this.dirX;return Math.abs(r-this.offsetX)<=this.w/2+e.r&&Math.abs(a)<=this.h/2+e.r}return Math.hypot(e.x-this.x,e.z-this.z)<=this.w/2+e.r}touches(e){return Math.abs(this.y-e.y)*2>=this.h+e.h?!1:this.attach?this.overlaps({x:e.x,z:e.z,y:e.y,h:e.h,r:e.w/2}):e.attach?e.overlaps({x:this.x,z:this.z,y:this.y,h:this.h,r:this.w/2}):Math.hypot(e.x-this.x,e.z-this.z)<=(this.w+e.w)/2}}function lf(s,e,t){const i=s.dir,n=Up(i),r=t.x-s.x,a=t.z-s.z,o=r*i.x+a*i.z,l=r*n.x+a*n.z;return Math.abs(o-e.x)>e.w/2+t.r||Math.abs(l)>(e.lw??.26)+t.r?!1:Math.abs(s.y+e.y-t.y)*2<e.h+t.h}function cf(s,e,t){return s.hitstop!==void 0?s.hitstop:t?e==="super"?5:7:e==="super"?12:s.spark==="heavy"?10:e==="special"?11:7}class HS{fighters;projectiles=[];events=[];config;frame=0;ticks=0;phase="intro";phaseFrame=0;round=1;timer=0;hitstop=0;freeze=0;freezeOwner=null;slowmo=0;cinematic=null;roundWinner=null;matchWinner=null;perfect=!1;paused=!1;camN={x:0,z:1};scheduled=[];seed;constructor(e){this.config=e,this.seed=e.seed??Math.random()*2**31|0;const t=new of(0,e.p1),i=new of(1,e.p2);t.opponent=i,i.opponent=t,this.fighters=[t,i],t.victoryVariant=this.rngInt(3),i.victoryVariant=this.rngInt(3),this.placeFighters(),this.timer=e.roundTime*60,e.training||e.skipIntro?(this.startRound(),e.training&&(this.phase="fight",this.phaseFrame=0)):(this.phase="intro",t.state="intro",i.state="intro")}get training(){return!!this.config.training}infiniteMeter(e){return!!this.config.training?.infiniteMeter&&e.index>=0}rng(){let e=this.seed+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}rngInt(e){return Math.floor(this.rng()*e)}emit(e){this.events.push(e),this.events.length>400&&this.events.splice(0,this.events.length-400)}drainEvents(){const e=this.events;return this.events=[],e}schedule(e,t){this.scheduled.push({at:this.frame+e,fn:t})}clampPos(e,t=.35){const i=Qs-t,n=Math.hypot(e.x,e.z);return n<=i?{x:e.x,z:e.z}:{x:e.x/n*i,z:e.z/n*i}}atWall(e,t=.45){return Math.hypot(e.x,e.z)>=Qs-t}get screenRight(){return{x:this.camN.z,z:-this.camN.x}}spawnProjectile(e,t){const i=new zS(e,{z:e.z,...t});return this.projectiles.push(i),this.emit({t:"projectile",id:i.id,owner:e.index}),i}hasProjectile(e,t){return this.projectiles.some(i=>i.owner===e&&i.tag===t&&!i.dead)}removeProjectiles(e,t){for(const i of this.projectiles)i.owner===e&&i.tag===t&&(i.dead=!0)}superFlash(e,t){this.freeze=t.superFreeze??40,this.freezeOwner=e,this.emit({t:"superFlash",fighter:e.index,name:t.name,color:t.color??16763904}),this.emit({t:"rumble",fighter:e.index,strong:.4,weak:.8,ms:400})}isThreatened(e){const t=e.opponent,i=e.distTo(t);if(t.state==="attack"&&t.move&&i<3.4&&t.moveFrame<=t.move.startup+t.move.active)return!0;for(const n of this.projectiles){if(n.owner!==t||n.dead)continue;const r=e.x-n.x,a=e.z-n.z,o=Math.hypot(r,a);if(n.kind==="rain"&&o<1.5||o<3.8&&(n.attach||r*n.vx+a*n.vz>0))return!0}return!1}placeFighters(){const[e,t]=this.fighters;e.resetForRound(-2,0,0),t.resetForRound(2,0,Math.PI),this.camN={x:0,z:1},this.updateAxis(1)}skipIntro(){this.phase==="intro"&&this.startRound()}startRound(){this.phase="roundStart",this.phaseFrame=0,this.timer=this.config.roundTime*60,this.projectiles=[],this.scheduled=[],this.cinematic=null,this.hitstop=0,this.freeze=0,this.slowmo=0,this.roundWinner=null,this.perfect=!1,this.placeFighters();for(const e of this.fighters)e.koed=!1}resetPositions(){this.placeFighters(),this.projectiles=[],this.scheduled=[],this.cinematic=null;for(const e of this.fighters)e.koed=!1,this.config.training?.infiniteMeter&&(e.meter=Vr)}updateAxis(e=.12){const[t,i]=this.fighters,n=i.x-t.x,r=i.z-t.z,a=Math.hypot(n,r);if(a>.05){let l=-r/a,c=n/a;l*this.camN.x+c*this.camN.z<0&&(l=-l,c=-c);const h=this.camN.x+(l-this.camN.x)*e,f=this.camN.z+(c-this.camN.z)*e,u=Math.hypot(h,f)||1;this.camN={x:h/u,z:f/u}}const o=this.screenRight;for(const l of this.fighters){const c=l.opponent,h=(c.x-l.x)*o.x+(c.z-l.z)*o.z;Math.abs(h)>.05&&(l.facing=h>0?1:-1)}}tick(e){if(this.ticks++,this.paused)return;const t=this.phase==="fight";if(this.updateAxis(),this.fighters[0].recordInput(t?e[0]:$t),this.fighters[1].recordInput(t?e[1]:$t),this.hitstop>0){this.hitstop--;return}if(this.freeze>0){this.freeze--,this.freeze===0&&(this.freezeOwner=null);return}this.slowmo>0&&(this.slowmo--,this.slowmo%2===1)||(this.phaseFrame++,this.simulate(),this.phaseLogic())}simulate(){if(this.frame++,this.scheduled.length){const e=this.scheduled.filter(t=>t.at<=this.frame);this.scheduled=this.scheduled.filter(t=>t.at>this.frame);for(const t of e)t.fn()}this.cinematic&&this.updateCinematic();for(const e of this.fighters)e.update(this);this.updateThrows();for(const e of this.fighters)e.physics(this);this.resolvePush(),this.checkWalls(),this.updateProjectiles(),this.phase==="fight"&&this.detectHits(),this.config.training&&this.trainingUpkeep()}phaseLogic(){const[e,t]=this.fighters;switch(this.phase){case"intro":this.phaseFrame>=200&&this.startRound();break;case"roundStart":{if(this.phaseFrame===1){const i=e.roundsWon===this.config.roundsToWin-1&&t.roundsWon===this.config.roundsToWin-1;this.emit({t:"round",n:this.round}),this.emit({t:"announce",text:i?"FINAL ROUND":`ROUND ${this.round}`,big:!0,frames:60})}this.phaseFrame===66&&(this.emit({t:"fight"}),this.emit({t:"announce",text:"FIGHT!",big:!0,frames:45})),this.phaseFrame>=76&&(this.phase="fight",this.phaseFrame=0);break}case"fight":{if(this.config.roundTime>0&&!this.training&&!this.cinematic&&(this.timer--,this.timer<=0)){this.timeout();break}if(this.cinematic)break;const i=this.fighters.filter(n=>n.health<=0);i.length&&this.ko(i);break}case"ko":{if(this.phaseFrame>=110)for(const i of this.fighters)!i.koed&&this.roundWinner===i.index&&i.state!=="victory"&&i.grounded&&(i.actionable||this.phaseFrame===110)&&(i.move=null,i.throwExec=null,i.faceOpponent(),i.setState("victory"));this.phaseFrame>=200&&this.endRound();break}case"roundEnd":this.phaseFrame>=30&&(this.round++,this.startRound());break}}ko(e){this.phase="ko",this.phaseFrame=0,this.slowmo=70;for(const i of e)i.koed=!0,i.state!=="juggle"&&i.enterJuggle(.17,-i.dirX*.07,-i.dirZ*.07);this.roundWinner=e.length===2?-1:1-e[0].index;const t=this.roundWinner>=0?this.fighters[this.roundWinner]:null;this.perfect=!!t&&t.health>=t.stats.maxHealth,this.emit({t:"ko",loser:e.length===2?-1:e[0].index,perfect:this.perfect}),this.emit({t:"announce",text:e.length===2?"DOUBLE K.O.":"K.O.",big:!0,frames:100}),this.emit({t:"shake",amount:.35});for(const i of this.fighters)this.emit({t:"rumble",fighter:i.index,strong:1,weak:1,ms:600})}timeout(){this.phase="ko",this.phaseFrame=0;const[e,t]=this.fighters,i=e.health/e.stats.maxHealth,n=t.health/t.stats.maxHealth;this.roundWinner=Math.abs(i-n)<1e-6?-1:i>n?0:1,this.perfect=!1;for(const r of this.fighters)(r.state==="attack"||r.state==="dash"||r.state==="run"||r.state==="walkF"||r.state==="walkB")&&(r.move=null,r.grounded&&r.setState("idle"));this.emit({t:"timeout"}),this.emit({t:"announce",text:"TIME",big:!0,frames:100})}endRound(){const[e,t]=this.fighters;this.roundWinner===-1?(e.roundsWon++,t.roundsWon++):this.roundWinner!==null&&this.fighters[this.roundWinner].roundsWon++;const i=this.config.roundsToWin,n=e.roundsWon>=i,r=t.roundsWon>=i;if(n||r){this.matchWinner=n&&r?-1:n?0:1,this.phase="matchEnd",this.phaseFrame=0;const a=this.matchWinner>=0?this.fighters[this.matchWinner]:null;this.emit({t:"announce",text:a?`${a.def.name.toUpperCase()} WINS`:"DRAW GAME",big:!0,frames:150}),a&&(a.move=null,a.faceOpponent(),a.grounded&&a.setState("victory"))}else this.phase="roundEnd",this.phaseFrame=0}trainingUpkeep(){const e=this.config.training;for(const t of this.fighters)e.infiniteMeter&&(t.meter=Vr),e.infiniteHealth&&(t.health<=0&&(t.health=1),t.actionable&&t.stateFrame>40&&t.health<t.stats.maxHealth&&(t.health=t.stats.maxHealth)),t.koed&&(t.koed=!1)}resolvePush(){const[e,t]=this.fighters;for(const v of this.fighters){const p=this.clampPos(v);v.x=p.x,v.z=p.z}const i=v=>v.state==="thrown"||v.state==="cinematic"||v.koed&&v.state==="ko";if(i(e)||i(t))return;const n=e.y+(e.isCrouching?1.1:1.7),r=t.y+(t.isCrouching?1.1:1.7);if(e.y>=r-.25||t.y>=n-.25)return;let a=t.x-e.x,o=t.z-e.z,l=Math.hypot(a,o);const c=p0*2;if(l>=c)return;l<1e-4?(a=e.dirX,o=e.dirZ,l=1):(a/=l,o/=l);const h=c-Math.min(l,c),f=this.atWall(e,.4),u=this.atWall(t,.4),d=f&&!u?0:u&&!f?h:h/2,m=h-d;e.x-=a*d,e.z-=o*d,t.x+=a*m,t.z+=o*m;for(const v of this.fighters){const p=this.clampPos(v);v.x=p.x,v.z=p.z}}checkWalls(){for(const e of this.fighters){if(!this.atWall(e,.4)||e.koed)continue;const t=Math.hypot(e.vx+e.slideX,e.vz+e.slideZ);e.x*(e.vx+e.slideX)+e.z*(e.vz+e.slideZ)>0&&(e.state==="juggle"&&t>.03&&e.y<1.6||e.state==="hitstun"&&t>.12)&&(e.enterWallsplat(cu,this),this.hitstop=Math.max(this.hitstop,8),this.emit({t:"shake",amount:.18}))}}tryGrab(e,t){const i=e.opponent;if(!i.grounded||i.y>.05||i.isInvuln("throw"))return;switch(i.state){case"hitstun":case"blockstun":case"juggle":case"knockdown":case"getup":case"thrown":case"jumpSquat":case"techroll":case"wallsplat":return}const n=e.localOf(i.x,i.z);if(!(n.f<-.2||n.f>(t.throwRange??1)||Math.abs(n.l)>.55)){if(t.grabCinematic){this.startCinematic(e,i,t.grabCinematic.damage,t.grabCinematic.name,t.color??16763904,t.prop);return}e.throwExec={target:i,frame:0,total:44,damage:(t.throwDamage??120)*e.outgoingMul(t.kind),techable:!!t.techable,back:t.kind==="throw"&&e.throwBack,move:t},e.move=t.kind==="throw"?Np:NS,e.moveFrame=0,e.stateFrame=0,i.move=null,i.throwExec=null,i.setState("thrown"),i.grabbedBy=e,i.guarding=!1,this.emit({t:"sfx",name:"grab"}),t.kind!=="throw"&&this.emit({t:"special",fighter:e.index,name:t.name,color:t.color??16777215})}}updateThrows(){for(const e of this.fighters){const t=e.throwExec;if(!t)continue;const i=t.target;if(i.state!=="thrown"){e.throwExec=null;continue}t.frame++;const n=this.clampPos(e.ahead(.72));if(i.x=n.x,i.z=n.z,i.y=.12+Math.sin(Math.min(1,t.frame/26)*Math.PI)*.35,i.vx=i.vy=i.vz=0,i.yaw=e.yaw+Math.PI,t.techable&&t.frame<=Bo){const r=i.history;if(r.buffered(me.TH|me.LP|me.HP,Bo)){r.consume(me.TH|me.LP|me.HP,Bo),e.throwExec=null,e.move=null,i.grabbedBy=null,i.y=0,e.enterBlockstun(14),i.enterBlockstun(14),e.slideX=-e.dirX*.16,e.slideZ=-e.dirZ*.16,i.slideX=e.dirX*.16,i.slideZ=e.dirZ*.16,this.emit({t:"tech",x:(e.x+i.x)/2,y:1.2,z:(e.z+i.z)/2}),this.emit({t:"announce",text:"THROW BREAK!",frames:30});continue}}if(t.frame===26){let r=e.dirX,a=e.dirZ;if(t.back){const c=this.clampPos(e.ahead(-.8));i.x=c.x,i.z=c.z,r=-r,a=-a}const o=t.damage*i.incomingMul(!1);i.grabbedBy=null,i.y=.3,i.state="juggle",i.takeDamage(o,this),i.comboHits++;const l=t.move.hit?.effect;if(l?.drain){const c=Math.min(i.meter,l.drain);i.meter-=c,e.gainMeter(c)}l?.lifesteal&&e.heal(l.lifesteal),i.enterJuggle(.2,r*.11,a*.11),l?.stun&&i.health>0&&(i.pendingDizzy=l.stun),e.gainMeter(12),i.gainMeter(6),this.hitstop=Math.max(this.hitstop,10),i.flash=10,this.emit({t:"hit",x:i.x,y:1,z:i.z,spark:"heavy",blocked:!1,counter:!1,attacker:e.index,defender:i.index,damage:Math.round(o),color:t.move.color}),this.emit({t:"shake",amount:.2}),this.emit({t:"rumble",fighter:i.index,strong:.9,weak:.5,ms:250}),e.throwExec=null}}}startCinematic(e,t,i,n,r,a){for(const l of this.projectiles)l.owner===t&&(l.dead=!0);e.move=null,e.throwExec=null,e.fallMove=null,e.vx=e.vy=e.vz=e.slideX=e.slideZ=0,e.y=0,e.setState("cinematic"),t.move=null,t.throwExec=null,t.grabbedBy=null,t.vx=t.vy=t.vz=t.slideX=t.slideZ=0,t.y=0,t.setState("cinematic");const o=this.clampPos(e.ahead(.95));t.x=o.x,t.z=o.z,t.yaw=e.yaw+Math.PI,this.cinematic={att:e,def:t,frame:0,total:104,hits:8,damage:i,name:n,color:r,prop:a,scale:Math.max(.5,uu(t.comboHits+1))},this.emit({t:"sfx",name:"cinematic"})}updateCinematic(){const e=this.cinematic;e.frame++;const{att:t,def:i}=e;t.stateFrame=e.frame,i.stateFrame=e.frame;const n=11;if(e.frame%n===0&&e.frame/n<=e.hits){const r=e.frame/n,a=r===e.hits,o=e.damage/e.hits*t.outgoingMul("super")*i.incomingMul(!1)*e.scale*(a?1.4:.943);i.comboHits++,i.takeDamage(o,this,a),i.flash=8;const l=i.ahead(.2);this.emit({t:"hit",x:l.x,y:.9+r*37%7/10,z:l.z,spark:a?"super":"heavy",blocked:!1,counter:!1,attacker:t.index,defender:i.index,damage:Math.round(o),color:e.color}),this.emit({t:"shake",amount:a?.3:.08}),this.emit({t:"rumble",fighter:i.index,strong:a?1:.5,weak:.4,ms:a?400:90}),a&&(this.hitstop=14)}e.frame>=e.total&&(this.cinematic=null,t.state="idle",t.toNeutral(),i.state="idle",i.enterJuggle(.3,t.dirX*.1,t.dirZ*.1),i.juggleInvuln=!0)}detectHits(){const[e,t]=this.fighters,i=e.activeHitbox(),n=t.activeHitbox(),r=e.hurtboxes(),a=t.hurtboxes(),o=i?a.find(c=>lf(e,i,c)):void 0,l=n?r.find(c=>lf(t,n,c)):void 0;o&&i&&this.strike(e,t,i,o),l&&n&&this.strike(t,e,n,l)}strike(e,t,i,n){const r=e.move;if(!r?.hit)return;let a=r.hit;(r.maxHits??1)>1&&r.finalHit&&e.moveHits+1>=(r.maxHits??1)&&(a={...a,...r.finalHit});const l=Math.max(.2,Math.min(i.x+i.w/2,e.distTo(t)-n.r*.6)),c=e.ahead(l),h=Math.max(Math.min(e.y+i.y,n.y+n.h/2-.1),n.y-n.h/2+.1),f=this.resolveHit(e,t,a,{kind:r.kind,x:c.x,y:h,z:c.z});f!=="miss"&&(e.moveHits++,e.moveLastHit=e.moveFrame,f!=="counter"&&(e.moveConnected=!0,(f==="hit"||f==="armor")&&(e.moveHitConfirmed=!0),e.move===r&&r.onHit?.(e.ctx(this),f==="block"||f==="absorb")))}triggerCounter(e,t){const i=e.move.counterMove;t.move=null,t.enterHitstun(34,!0,!0),t.flash=6,e.faceOpponent(),e.startMove(i,.5,this),this.hitstop=Math.max(this.hitstop,12),this.emit({t:"counterHit",fighter:e.index}),this.emit({t:"announce",text:"COUNTER!",frames:40}),this.emit({t:"hit",x:(t.x+e.x)/2,y:1.3,z:(t.z+e.z)/2,spark:"special",blocked:!0,counter:!0,attacker:e.index,defender:t.index,damage:0,color:i.color})}resolveHit(e,t,i,n){const r=n.projectile,a=!!r;if(t.isInvuln(a?"projectile":"strike")||t.state==="knockdown"&&!i.otg)return"miss";if(t.inCounterWindow()&&t.move?.counterMove)return a?(this.emit({t:"clash",x:n.x,y:n.y,z:n.z}),"absorb"):(this.triggerCounter(t,e),"counter");if(a&&t.buff("reflect")&&r.kind!=="mega"&&r.kind!=="beam")return r.owner=t,r.vx=-r.vx,r.vz=-r.vz,r.dirX=-r.dirX,r.dirZ=-r.dirZ,r.reflected=!0,r.age=0,r.lastHitAge=-999,this.emit({t:"clash",x:n.x,y:n.y,z:n.z}),this.emit({t:"sfx",name:"reflect"}),"reflect";const o=t.buff("shield");if(o)return o.value--,o.value<=0&&(o.frames=0),this.hitstop=Math.max(this.hitstop,6),this.emit({t:"hit",x:n.x,y:n.y,z:n.z,spark:"light",blocked:!0,counter:!1,attacker:e.index,defender:t.index,damage:0,color:o.color}),this.emit({t:"sfx",name:"shield"}),"absorb";let l,c;if(a){const w=Math.hypot(r.vx,r.vz);l=w>0?r.vx/w:r.dirX,c=w>0?r.vz/w:r.dirZ}else{const w=t.x-e.x,x=t.z-e.z,A=Math.hypot(w,x);l=A>.01?w/A:e.dirX,c=A>.01?x/A:e.dirZ}const h=a?r.kind==="mega"?"super":"projectile":n.kind,f=i.spark==="heavy"||i.spark==="super"||i.spark==="special";if(t.canBlock()&&t.blockOK(i.guard)){let w=i.chip??0;return e.passive==="chipMaster"&&(w=Math.max(w*3,i.damage*.12)),w>0&&t.takeDamage(w*e.outgoingMul(h==="projectile"?"projectile":n.kind)*t.incomingMul(a),this),t.enterBlockstun(i.blockstun),t.slideX=l*i.pushback*1.15,t.slideZ=c*i.pushback*1.15,!a&&this.atWall(t)&&(e.slideX=-l*i.pushback*.9,e.slideZ=-c*i.pushback*.9),e.gainMeter(3),t.gainMeter(3),this.hitstop=Math.max(this.hitstop,Math.max(4,cf(i,n.kind,a)-3)),this.emit({t:"hit",x:n.x,y:n.y,z:n.z,spark:"light",blocked:!0,counter:!1,attacker:e.index,defender:t.index,damage:0}),this.emit({t:"rumble",fighter:t.index,strong:.15,weak:.3,ms:80}),"block"}const u=!a&&t.isCounterable();let d=i.damage*e.outgoingMul(h);u&&(d*=e.passive==="counterPunch"?1.5:1.2),t.comboHits++;let m=uu(t.comboHits);if(e.passive==="comboMaster"&&(m=Math.max(.4,1-(t.comboHits-1)*.07)),(n.kind==="super"||h==="super")&&(m=Math.max(m,.5)),t.state==="knockdown"&&(m*=.5),d=Math.max(1,Math.round(d*m*t.incomingMul(a))),t.hasArmor())return t.consumeArmor(),t.takeDamage(d,this),t.comboHits=Math.max(0,t.comboHits-1),t.flash=8,this.hitstop=Math.max(this.hitstop,8),this.emit({t:"hit",x:n.x,y:n.y,z:n.z,spark:"heavy",blocked:!1,counter:!1,attacker:e.index,defender:t.index,damage:d,color:16755251}),this.emit({t:"sfx",name:"armor"}),"armor";if(t.throwExec){const w=t.throwExec.target;t.throwExec=null,w.grabbedBy=null,w.enterJuggle(.1,-w.dirX*.05,-w.dirZ*.05)}t.comboDamage+=d;const v=t.takeDamage(d,this),p=i.effect;if(p?.drain){const w=Math.min(t.meter,p.drain);t.meter-=w,e.gainMeter(w)}e.passive==="drainer"&&(t.meter-=Math.min(t.meter,4)),p?.lifesteal&&e.heal(p.lifesteal),e.passive==="vampire"&&e.heal(d*.12),p?.slow&&t.addBuff("slow",.6,p.slow,6719743,this);const g=!t.grounded||t.state==="juggle"||t.state==="air"||t.state==="fall",y=!!i.launch&&(i.launch>=so||n.kind!=="normal"||g),E=Math.sqrt(t.stats.weight),M=i.launchVx??.03;if(v)t.enterJuggle(.2,l*.08,c*.08);else if(t.health<=0)t.enterJuggle(Math.max(.2,i.launch??0),l*.08,c*.08);else if(t.state==="knockdown")t.stateFrame=Math.max(0,t.stateFrame-12);else if(t.state==="wallsplat")t.stun=Math.min(t.stun+14,30),t.y=Math.min(1.1,t.y+.08);else if(g){const w=t.state==="juggle"?t.vy/$s:t.vy;let x=Math.max(w,(y?i.launch*.75:.11)-t.juggleCount*.008);i.screw&&!t.screwed&&(t.screwed=!0,x=Math.max(x,.15),this.emit({t:"announce",text:"SCREW!",frames:24})),t.enterJuggle(x/E,l*(M+i.pushback*.25),c*(M+i.pushback*.25))}else if(y)t.enterJuggle(i.launch/E,l*M,c*M),i.launch>=so&&this.emit({t:"announce",text:"LAUNCH!",frames:22});else if(i.knockdown)t.enterJuggle(.12,l*.045,c*.045);else if(p?.stun)t.enterDizzy(p.stun),t.slideX=l*i.pushback,t.slideZ=c*i.pushback;else if(u&&i.crumpleCH)t.enterDizzy(52,!0),this.emit({t:"announce",text:"CRUMPLE!",frames:30});else{const w=i.guard==="high"||n.y>1.35;t.enterHitstun(i.hitstun+(u?6:0),w,f);const x=i.pushback*(i.wall?1.3:1);t.slideX=l*x/E,t.slideZ=c*x/E,!a&&this.atWall(t)&&(i.wall?t.enterWallsplat(cu,this):(e.slideX=-l*i.pushback*.9,e.slideZ=-c*i.pushback*.9))}e.gainMeter((i.meterGain??5)+d*.03),t.gainMeter(d*.05),this.hitstop=Math.max(this.hitstop,cf(i,n.kind,a)+(u?3:0)),t.flash=5;const b=i.spark??"light";this.emit({t:"hit",x:n.x,y:n.y,z:n.z,spark:b,blocked:!1,counter:u,attacker:e.index,defender:t.index,damage:d,color:r?.color}),u&&(this.emit({t:"counterHit",fighter:e.index}),this.emit({t:"announce",text:"COUNTER HIT",frames:30}));const S=b==="super"?1:f?.7:.35;return this.emit({t:"rumble",fighter:t.index,strong:S,weak:S*.6,ms:f?200:110}),this.emit({t:"rumble",fighter:e.index,strong:S*.3,weak:S*.5,ms:80}),(f||u)&&this.emit({t:"shake",amount:b==="super"?.22:u?.14:.08}),"hit"}updateProjectiles(){const e=this.projectiles;for(const t of e)t.update(t.owner.opponent);for(let t=0;t<e.length;t++){const i=e[t];if(!(!i.active||i.kind==="trap"))for(let n=t+1;n<e.length;n++){const r=e[n];if(!r.active||r.kind==="trap"||r.owner===i.owner||!i.touches(r))continue;const a=i.durability;i.durability-=Math.max(1,Math.min(r.durability,3)),r.durability-=Math.max(1,Math.min(a,3)),i.durability<=0&&(i.dead=!0),r.durability<=0&&(r.dead=!0),this.emit({t:"clash",x:(i.x+r.x)/2,y:(i.y+r.y)/2,z:(i.z+r.z)/2})}}if(this.phase==="fight")for(const t of e){if(!t.active)continue;const i=t.owner.opponent;if(t.kind==="trap"&&!i.grounded||t.age-t.lastHitAge<t.rehit||!i.hurtboxes().find(o=>t.overlaps(o)))continue;let r=t.hit;t.hitsLeft===1&&(t.kind==="mega"||t.durability>1)&&t.hit.damage>0&&(r={...r,knockdown:!0,launch:r.launch??.18});const a=this.resolveHit(t.owner,i,r,{kind:t.kind==="mega"?"super":"special",projectile:t,x:(t.x+i.x)/2,y:Math.max(.3,Math.min(t.y,i.y+1.6)),z:(t.z+i.z)/2});a==="miss"||a==="reflect"||(t.hitsLeft--,t.lastHitAge=t.age,t.onHit?.(i,a==="block"),(t.hitsLeft<=0||a==="absorb")&&(t.dead=!0))}e.some(t=>t.dead)&&(this.projectiles=e.filter(t=>!t.dead))}}const GS={1:"↙",2:"↓",3:"↘",4:"←",5:"•",6:"→",7:"↖",8:"↑",9:"↗"};class VS{constructor(e,t,i){this.app=e,this.root=Ze("div","hud");const n=Ze("div","top");t.fighters.forEach((a,o)=>{const l=o===0?"l":"r",c=Yn[a.def.party],h=Ze("div",`hp-wrap ${l}`);h.innerHTML=`${hn(a.def,"hp-port")}
        <div class="hp-col">
          <div class="hp ${l}"><i class="rec"></i><i class="trail"></i><i class="fill"></i></div>
          <div class="hp-name"><span class="n">${Ue(a.def.nick??a.def.name.split(" ").slice(-1)[0])}</span><span class="he">${Ue(a.def.nameHe)}</span><span class="chip" style="background:${Jr(c.color)}">${Ue(c.name)}</span></div>
          <div class="pips"></div>
        </div>`,this.hp[o]=h.querySelector(".fill"),this.trail[o]=h.querySelector(".trail"),this.rec[o]=h.querySelector(".rec"),this.pips[o]=h.querySelector(".pips"),o===0||(this.timer=Ze("div","timer","99"),n.appendChild(this.timer)),n.appendChild(h)}),this.timer=n.querySelector(".timer"),this.root.appendChild(n);const r=Ze("div","bottom");t.fighters.forEach((a,o)=>{const c=Ze("div",`meter-wrap ${o===0?"l":"r"}`);c.innerHTML='<div class="buffs"></div><div class="meter-label">ULTIMATE</div><div class="meter"><i></i></div>',this.meter[o]=c.querySelector(".meter i"),this.meterBar[o]=c.querySelector(".meter"),this.meterLabel[o]=c.querySelector(".meter-label"),this.buffs[o]=c.querySelector(".buffs"),r.appendChild(c)}),this.root.appendChild(r);for(let a=0;a<2;a++){const o=a===0?"l":"r";this.combo[a]=Ze("div",`combo ${o}`,'<div class="n">0</div><div class="t">HITS</div><div class="d"></div>'),this.special[a]=Ze("div",`special-name ${o}`),this.quote[a]=Ze("div",`quote-bubble ${o}`),this.root.append(this.combo[a],this.special[a],this.quote[a])}this.dim=Ze("div","super-dim"),this.banner=Ze("div","super-banner",'<div class="strip"></div><div class="txt"><div class="who"></div><div class="mv"></div></div>'),this.announceEl=Ze("div","announce"),this.flash=Ze("div","flash"),this.root.prepend(this.dim),this.root.append(this.banner,this.announceEl,this.flash),i.training&&(this.training=Ze("div","training-panel panel"),this.root.appendChild(this.training)),(i.inputDisplay||i.training)&&(this.inputDisp=Ze("div","input-disp"),this.root.appendChild(this.inputDisp)),this.renderPips(t)}app;root;hp=[];trail=[];rec=[];meter=[];meterBar=[];meterLabel=[];lastLabel=["",""];buffs=[];pips=[];timer;announceEl;announceLeft=0;combo=[];comboHold=[0,0];comboBest=[{hits:0,dmg:0},{hits:0,dmg:0}];special=[];specialLeft=[0,0];banner;bannerLeft=0;dim;flash;quote=[];training=null;inputDisp=null;inputLog=[];lastInput="";lastCombo={hits:0,dmg:0};lastHpText=["",""];lastTicks=-1;renderPips(e){e.fighters.forEach((t,i)=>{let n="";for(let r=0;r<e.config.roundsToWin;r++)n+=`<div class="pip ${r<t.roundsWon?"on":""}"></div>`;this.pips[i].innerHTML=e.training?"":n})}showQuote(e,t,i){this.quote[e].textContent=`“${t}”`,this.quote[e].classList.toggle("show",i)}announce(e,t,i){this.announceEl.className="announce",this.announceEl.offsetWidth,this.announceEl.textContent=e,this.announceEl.className=`announce show ${t?"big":"small"}`,this.announceLeft=i}event(e,t){switch(e.t){case"announce":this.announce(e.text,!!e.big,e.frames??50);break;case"special":this.special[e.fighter].textContent=e.name+"!",this.special[e.fighter].style.color=nh(e.color),this.special[e.fighter].classList.add("show"),this.specialLeft[e.fighter]=70;break;case"superFlash":{const i=t.fighters[e.fighter];this.banner.querySelector(".who").textContent=`${i.def.name.toUpperCase()} · ULTIMATE`;const n=this.banner.querySelector(".mv");n.textContent=e.name,n.style.color=nh(e.color),this.banner.querySelector(".txt").style.textAlign=e.fighter===0?"left":"right",this.banner.classList.add("show"),this.dim.classList.add("show"),this.bannerLeft=52,this.doFlash();break}case"lifeline":this.announce(`${e.name}!`,!1,70),this.doFlash();break;case"ko":this.doFlash();break;case"round":this.renderPips(t);break}}doFlash(){this.flash.classList.remove("go"),this.flash.offsetWidth,this.flash.classList.add("go")}update(e,t){const i=this.lastTicks<0?1:Math.max(0,e.ticks-this.lastTicks);this.lastTicks=e.ticks;for(let n=0;n<i;n++)this.countdown();e.fighters.forEach((n,r)=>{const a=Math.max(0,n.health/n.stats.maxHealth*100),o=`${a.toFixed(2)}%`;this.lastHpText[r]!==o&&(this.hp[r].style.width=o,this.trail[r].style.width=o,this.lastHpText[r]=o),this.hp[r].classList.toggle("low",a<25),this.rec[r].style.width=`${Math.min(100,a+n.recoverable/n.stats.maxHealth*100).toFixed(2)}%`;const l=n.meter/Vr*100;this.meter[r].style.width=`${l}%`;const c=n.meter>=Vr;this.meterBar[r].classList.toggle("full",c),this.meterLabel[r].classList.toggle("full",c);const h=n.inRage&&!n.rageArtUsed;this.meterLabel[r].classList.toggle("rage",h&&!c),this.hp[r].classList.toggle("rage",n.inRage);const f=c?`ULTIMATE READY ${this.app.glyph("UL",r)}`:h?`RAGE ART ${this.app.glyph("UL",r)}`:`ULTIMATE ${Math.floor(l)}%`;this.lastLabel[r]!==f&&(this.meterLabel[r].innerHTML=f,this.lastLabel[r]=f);const u=n.buffs.map(m=>m.kind.toUpperCase()).join(" · "),d=n.passive==="lifeline"&&!n.lifelineUsed?"♥ "+n.def.passive.name:"";this.buffs[r].textContent=[u,d].filter(Boolean).join("  ")});for(let n=0;n<2;n++){const r=e.fighters[n],a=1-n;r.comboHits>=2&&(this.comboBest[a]={hits:r.comboHits,dmg:r.comboDamage},this.combo[a].innerHTML=`<div class="n">${r.comboHits}</div><div class="t">HITS</div><div class="d">${r.comboDamage} DMG</div>`,this.combo[a].classList.add("show"),this.comboHold[a]=70,a===0&&(this.lastCombo={hits:r.comboHits,dmg:r.comboDamage})),r.comboHits===1&&a===0&&(this.lastCombo={hits:1,dmg:r.comboDamage})}if(e.training||e.config.roundTime===0)this.timer.textContent="∞";else{const n=Math.max(0,Math.ceil(e.timer/60));this.timer.textContent=String(n),this.timer.classList.toggle("low",n<=10)}if(e.phase==="roundStart"&&e.phaseFrame===2&&this.renderPips(e),e.phase==="matchEnd"&&e.phaseFrame===1&&this.renderPips(e),this.training){const n=e.fighters[1],r=e.config.training?.dummy??"stand";this.training.innerHTML=`<b>TRAINING</b><br>Last combo: ${this.lastCombo.hits} hits · ${this.lastCombo.dmg} dmg<br>
        Dummy: ${r.toUpperCase()}<br>Dummy HP: ${Math.round(n.health)} / ${n.stats.maxHealth}<br>
        ${this.app.glyph("SELECT",0)} reset positions · ${this.app.glyph("START",0)} menu`}if(this.inputDisp&&t){const n=t[0],r=[],a=[[me.LP,"LP"],[me.HP,"HP"],[me.LK,"LK"],[me.HK,"HK"],[me.SP,"SP"],[me.UL,"UL"],[me.TH,"TH"],[me.SS,"SS"]];for(const[l,c]of a)n.pressed&l&&r.push(c);const o=`${n.dir}|${r.join("+")}`;o!==this.lastInput&&(n.dir!==5||r.length)&&(this.inputLog.unshift(`<span class="arrow">${GS[n.dir]}</span> ${r.join("+")}`),this.inputLog.length=Math.min(this.inputLog.length,14)),this.lastInput=o,this.inputDisp.innerHTML=this.inputLog.join("<br>")}}countdown(){for(let e=0;e<2;e++)this.specialLeft[e]>0&&--this.specialLeft[e]===0&&this.special[e].classList.remove("show"),this.comboHold[e]>0&&--this.comboHold[e]===0&&this.combo[e].classList.remove("show");this.bannerLeft>0&&--this.bannerLeft===0&&(this.banner.classList.remove("show"),this.dim.classList.remove("show")),this.announceLeft>0&&--this.announceLeft===0&&this.announceEl.classList.add("hide")}destroy(){this.root.remove()}}const WS=[{motion:no.qcf,btn:"P",dir:""},{motion:no.qcb,btn:"K",dir:"→ +"},{motion:no.dp,btn:"P",dir:"↓ +"}],hf={"d/f":"↘","d/b":"↙","u/f":"↗","u/b":"↖",f:"→",b:"←",d:"↓",u:"↑"},uf={1:"LP",2:"HP",3:"LK",4:"HK"};function XS(s,e){return s.split(/(d\/f|d\/b|u\/f|u\/b|\b[fbdu]\b|[1-4])/).map(t=>hf[t]?`<span class="arrow">${hf[t]}</span>`:uf[t]?e(uf[t]):Ue(t)).join("")}function df(s,e,t,i){return e==="P"?`${s.glyph("LP",t,i)}/${s.glyph("HP",t,i)}`:`${s.glyph("LK",t,i)}/${s.glyph("HK",t,i)}`}function Op(s,e,t=0){const i=s.glyphStyle(t)==="kb"&&s.menuStyle()!=="kb"?s.menuStyle():s.glyphStyle(t),n=l=>s.glyph(l,t,i),r=[];r.push('<tr class="hdr"><td colspan="3">SPECIAL MOVES</td></tr>'),e.specials.forEach((l,c)=>{const h=WS[c];r.push(`<tr><td class="mv" style="color:${nh(l.color)}">${Ue(l.name)}</td>
      <td class="in"><span class="arrow">${h.motion}</span> + ${df(s,h.btn,t,i)}<br><span style="color:var(--muted)">or</span> ${h.dir} ${n("SP")}</td>
      <td class="ds">${Ue(Dp(l))}${l.type==="dive"?" Works in the air.":""}</td></tr>`)}),r.push('<tr class="hdr"><td colspan="3">ULTIMATE (FULL METER)</td></tr>'),r.push(`<tr><td class="mv" style="color:var(--gold)">${Ue(e.ultimate.name)}</td>
    <td class="in"><span class="arrow">${no.dqcf}</span> + ${df(s,"P",t,i)}<br><span style="color:var(--muted)">or</span> ${n("UL")}</td>
    <td class="ds">${Ue(kp(e.ultimate))}</td></tr>`),r.push('<tr class="hdr"><td colspan="3">PASSIVE ABILITY</td></tr>'),r.push(`<tr><td class="mv">${Ue(e.passive.name)}</td><td class="in">Always on</td><td class="ds">${Ue(e.passive.desc)}</td></tr>`),r.push('<tr class="hdr"><td colspan="3">SYSTEM</td></tr>');const a=[["Guard","Stand still / hold ← · hold ↓ or ↙","Tekken guard: standing blocks highs and mids, crouching blocks lows. Highs whiff over crouching opponents."],["Sidestep",`${n("SS")} <span style="color:var(--muted)">or tap</span> ↑ / ↓`,"Step into the background or toward the camera. Linear attacks miss; homing moves track you."],["Sidewalk",`Hold ${n("SS")}`,"Circle around your opponent."],["Dash · Run","→ → (hold →)","Dash in; keep holding to run. Run + 2 is the Dash Punch."],["Backdash","← ← (repeat)","Chain backdashes to escape (Korean backdash)."],["Throw",`${n("TH")} <span style="color:var(--muted)">or</span> ${n("LP")}+${n("LK")}`,"Close range. Hold ← to throw backwards. Break it by pressing throw, 1 or 2 as you are grabbed."],["Launch & juggle",`↘ ${n("HP")} · ↗ ${n("HK")} · WS ${n("HP")}`,"Launchers pop the opponent into the air: follow up with strings before they land. Screw moves extend the juggle."],["Walls","—","Heavy hits near the arena edge cause a wall splat: free follow-up."],["Tech roll · Get up","Any attack as you land · any input","Roll away when you hit the floor, or get up when you choose."],["Rage",`Below 25% health: ${n("UL")}`,"Red aura. Fire your Ultimate as a Rage Art without meter, once per round."],["Cancels",`Normal → Special → ${n("UL")}`,"Normals that connect cancel into specials; specials that hit cancel into the Ultimate."]];for(const[l,c,h]of a)r.push(`<tr><td class="mv">${l}</td><td class="in">${c}</td><td class="ds">${h}</td></tr>`);r.push(`<tr class="hdr"><td colspan="3">COMMAND LIST · ${n("LP")}=1 ${n("HP")}=2 ${n("LK")}=3 ${n("HK")}=4</td></tr>`);const o={high:"High",mid:"Mid",low:"Low",overhead:"Mid",unblockable:"!"};for(const l of CS)r.push(`<tr><td class="mv">${Ue(l.name)} <span style="color:var(--muted);font-size:12px">${o[l.guard]??""}</span></td>
      <td class="in">${XS(l.input,n)}</td><td class="ds">${Ue(l.desc??"")}</td></tr>`);return`<div class="ml-head">${hn(e)}<div><div class="display" style="font-size:40px;line-height:1">${Ue(e.name)}</div>
    <div style="font-size:20px"><span class="he">${Ue(e.nameHe)}</span></div>${Rp(e)}
    <div style="color:var(--muted);margin-top:4px">${Ue(e.role)} · ${Ue(Ip[e.style])}</div>
    <div style="margin-top:6px;max-width:720px">${Ue(e.bio)}</div></div></div>
    <table class="ml-table">${r.join("")}</table>`}class qS{constructor(e,t,i){this.app=e,this.index=t,this.back=i}app;index;back;page;enter(){this.page=Ze("div","page"),this.app.ui.append(this.page,Ze("div","hint",`◀ ▶ Change fighter (${this.index+1}/40) ${this.app.mg("back")} Back`)),this.render()}render(){this.page.innerHTML=Op(this.app,At[this.index],0);const e=this.app.ui.querySelector(".hint");e&&(e.innerHTML=`◀ ▶ Change fighter (${this.index+1}/40) ${this.app.mg("back")} Back`)}exit(){}tick(){const e=this.app.input.menu("any");e.back?(this.app.audio.sfx("menuBack"),this.back()):e.left||e.l1?(this.index=(this.index+At.length-1)%At.length,this.app.audio.sfx("menuMove"),this.render()):e.right||e.r1?(this.index=(this.index+1)%At.length,this.app.audio.sfx("menuMove"),this.render()):e.down?this.page.scrollTop+=80:e.up&&(this.page.scrollTop-=80)}frame(e){this.app.renderer.syncShowcase(e,{pos:[2,1.5,6],look:[0,1.1,0]})}}const KS=[{a:"TH",x:16,y:5,ps:"L2",cls:"g-shoulder"},{a:"SS",x:16,y:15,ps:"L1",cls:"g-shoulder"},{a:"UL",x:84,y:5,ps:"R2",cls:"g-shoulder"},{a:"SP",x:84,y:15,ps:"R1",cls:"g-shoulder"},{a:"MOVE",x:20,y:44,ps:"✚",cls:"g-shoulder"},{a:"HP",x:80,y:30,ps:"△",cls:"g-triangle"},{a:"HK",x:92,y:45,ps:"○",cls:"g-circle"},{a:"LK",x:80,y:60,ps:"✕",cls:"g-cross"},{a:"LP",x:67,y:45,ps:"□",cls:"g-square"},{a:"SELECT",x:34,y:27,ps:"CREATE",cls:"g-shoulder"},{a:"START",x:66,y:27,ps:"OPTIONS",cls:"g-shoulder"}];class YS{constructor(e,t){this.app=e,this.back=t}app;back;menu;status;remap=null;remapOrder=["LP","HP","LK","HK","SP","UL","TH","SS"];enter(){const e=this.app,t=Ze("div","page"),i=KS.map(r=>`<div class="pad-lbl" style="left:${r.x}%;top:${r.y}%"><span class="g ${r.cls}">${r.ps}</span>${r.a==="MOVE"?"Move":Do[r.a]}</div>`).join(""),n=r=>`<span class="g g-key">${Xs(r.UP[0])}${Xs(r.LEFT[0])}${Xs(r.DOWN[0])}${Xs(r.RIGHT[0])}</span><span>Move</span>`+Xl.map(a=>`<span>${r[a].map(o=>`<span class="g g-key">${Xs(o)}</span>`).join(" ")}</span><span>${Do[a]}</span>`).join("");t.innerHTML=`<h1 class="display">Controls</h1>
      <div class="sub">Plug in a PS5 DualSense (USB or Bluetooth) and press any button. Chrome, Edge and the desktop app read it natively.</div>
      <div class="ctrl-grid">
        <div class="panel"><h3>PS5 DualSense</h3><div class="pad-diagram"><div class="pad-body"></div>${i}<div class="pad-lbl" style="left:36%;top:70%">Left stick: Move</div></div>
          <div class="status"></div></div>
        <div class="panel"><h3>Controller setup</h3><div id="menu-slot"></div></div>
        <div class="panel"><h3>Keyboard · Player 1</h3><div class="kv">${n(kr)}</div></div>
        <div class="panel"><h3>Keyboard · Player 2</h3><div class="kv">${n(Ur)}</div></div>
      </div>`,this.status=t.querySelector(".status"),this.menu=new fr([{label:"Swap P1 / P2 controllers",onSelect:()=>{e.input.swapSlots(),this.refresh()}},{label:"Remap P1 buttons",onSelect:()=>this.startRemap(0)},{label:"Remap P2 buttons",onSelect:()=>this.startRemap(1)},{label:"Reset P1 mapping",onSelect:()=>{const r=e.input.slotPad[0];r!==null&&e.input.resetBinding(r),this.refresh()}},{label:"Reset P2 mapping",onSelect:()=>{const r=e.input.slotPad[1];r!==null&&e.input.resetBinding(r),this.refresh()}},{label:"Test rumble",onSelect:()=>{e.input.rumble(0,1,1,400),e.input.rumble(1,1,1,400)}},{label:"Back",onSelect:()=>this.back()}],e.audio),t.querySelector("#menu-slot").appendChild(this.menu.el),e.ui.append(t,Ze("div","hint",`${e.mg("confirm")} Select ${e.mg("back")} Back`)),e.input.onChange=()=>this.refresh(),this.refresh()}refresh(){const e=this.app.input,t=e.connectedPads(),i=r=>{const a=e.padInfo(r);if(!a)return`<div class="status-line">P${r+1}: <b>keyboard only</b></div>`;const o=e.bindingFor(a.index),l=this.remapOrder.map(c=>`${c}=${o[c]}`).join(" ");return`<div class="status-line">P${r+1}: <b>${Ue(a.kind==="dualsense"?"DualSense":a.kind==="dualshock"?"DualShock 4":a.kind==="xbox"?"Xbox controller":"Gamepad")}</b> <span style="color:var(--muted);font-size:12px">#${a.index} · ${Ue(l)}</span></div>`};let n=`<div class="status-line">Controllers connected: <b>${t.length}</b></div>${i(0)}${i(1)}`;if(t.some(r=>!r.standard)&&(n+='<div class="status-line" style="color:#ffb3aa">A controller is in raw mode (non-Chrome browser). If buttons feel wrong, use Remap or play in Chrome / Edge / the desktop app.</div>'),this.remap){const r=this.remapOrder[this.remap.step];n+=`<div class="status-line" style="font-size:20px;margin-top:10px">Press the button for <b>${Do[r]}</b> on P${this.remap.slot+1}'s controller… <span style="color:var(--muted);font-size:13px">(Esc to cancel)</span></div>`}this.status.innerHTML=n}startRemap(e){const t=this.app.input.slotPad[e];if(t===null){this.status.insertAdjacentHTML("beforeend",`<div class="status-line" style="color:#ffb3aa">No controller assigned to P${e+1}.</div>`);return}this.remap={slot:e,step:0,binding:{...this.app.input.bindingFor(t)}},this.refresh(),this.captureNext()}captureNext(){this.app.input.captureNextButton((e,t)=>{const i=this.remap;if(i){if(e!==this.app.input.slotPad[i.slot]){this.captureNext();return}i.binding[this.remapOrder[i.step]]=t,i.step++,this.app.audio.sfx("menuConfirm"),i.step>=this.remapOrder.length?(this.app.input.setBinding(e,i.binding),this.remap=null,this.suppress=20):this.captureNext(),this.refresh()}})}suppress=0;exit(){this.app.input.captureNextButton(null),this.app.input.onChange=null}tick(){if(this.remap){this.app.input.keyPressed("Escape")&&(this.remap=null,this.app.input.captureNextButton(null),this.refresh());return}if(this.suppress>0){this.suppress--;return}const e=this.app.input.menu("any");if(e.back){this.app.audio.sfx("menuBack"),this.back();return}this.menu.handle(e)}frame(e){this.app.renderer.syncShowcase(e,{pos:[2,1.5,6],look:[0,1.1,0]})}}class $S{constructor(e,t,i){this.app=e,this.setup=t,this.winner=i}app;setup;winner;menu;t=0;enter(){const e=this.app,{p1:t,p2:i}=this.setup,n=this.winner===0?t:this.winner===1?i:null;n&&e.renderer.setShowcase([{def:n,x:0,facing:1,pose:"victory",variant:0}],!1),this.menu=new fr([{label:"Rematch",onSelect:()=>e.go(new Wh(e,this.setup))},{label:"Change Stage",onSelect:()=>e.go(new zp(e,this.setup.mode,t,i))},{label:"Character Select",onSelect:()=>e.go(new Ro(e,this.setup.mode))},{label:"Main Menu",onSelect:()=>e.go(new Mi(e))}],e.audio);const r=Ze("div","results"),a=Ze("div","col");a.innerHTML=n?`${hn(n)}<div class="winner display">${Ue(n.name)} wins</div><div class="he" style="font-size:24px">${Ue(n.nameHe)}</div><div class="quote">“${Ue(n.quotes.win)}”</div>`:'<div class="winner display">Draw game</div><div class="quote">A hung parliament. Again.</div>',a.appendChild(this.menu.el),r.appendChild(a),e.ui.append(r,Ze("div","hint",`${e.mg("confirm")} Select`))}exit(){}tick(){this.menu.handle(this.app.input.menu("any"))}frame(e){this.t+=e,this.app.renderer.syncShowcase(e,{pos:[1.6+Math.sin(this.t*.3)*.5,1.4,4.2],look:[-.6,1.2,0]})}}class Vh{constructor(e){this.app=e}app;left=170;enter(){const e=this.app,t=e.arcade,i=t.ladder[t.index];e.renderer.setStage(t.stages[t.index]),e.renderer.clearFighters(),e.renderer.setShowcase([{def:i,x:0,facing:-1,pose:"intro"}],!1);const n=t.ladder.map((a,o)=>`<div class="rung ${o<t.index?"done":""} ${o===t.index?"cur":""} ${a.boss?"boss":""}">${hn(a)}${Ue(a.name.split(" ").slice(-1)[0])}</div>`).join(""),r=Ze("div","results");r.innerHTML=`<div class="col">
      <div class="display" style="font-size:28px;color:var(--muted)">Arcade · Stage ${t.index+1} / ${t.ladder.length}</div>
      <div class="winner display">${i.boss?"Final boss":"Next opponent"}</div>
      <div class="display" style="font-size:44px;color:var(--gold)">${Ue(i.name)}</div>
      <div class="he" style="font-size:22px">${Ue(i.nameHe)}</div>
      <div style="color:var(--muted)">${Ue(i.role)}</div>
      <div class="ladder">${n}</div>
    </div>`,e.ui.append(r,Ze("div","hint",`${e.mg("confirm")} Fight ${e.mg("back")} Quit`)),e.audio.say(i.boss?`Final boss. ${i.name}`:`Next: ${i.name}`)}start(){const e=this.app,t=e.arcade,i={mode:"arcade",p1:t.player,p2:t.ladder[t.index],stage:t.stages[t.index],cpu:[!1,!0]};e.lastSetup=i,e.go(new Wh(e,i,()=>e.go(new sa(e,i))))}exit(){}tick(){const e=this.app.input.menu("any");if(e.back){this.app.go(new Mi(this.app));return}(--this.left<=0||e.confirm)&&this.start()}frame(e){this.app.renderer.syncShowcase(e,{pos:[-1.8,1.4,4.4],look:[.6,1.2,0]})}}class QS{constructor(e){this.app=e}app;left=600;el;enter(){const e=this.app,t=e.arcade,i=t.ladder[t.index];e.renderer.setShowcase([{def:i,x:0,facing:-1,pose:"victory",variant:2}],!1);const n=Ze("div","results");n.innerHTML=`<div class="col"><div class="winner display">Continue?</div>
      <div class="quote">${Ue(i.name)}: “${Ue(i.quotes.win)}”</div>
      <div class="display" style="font-size:120px;color:var(--gold)" id="cd">10</div>
      <div>${e.mg("confirm")} Continue &nbsp; ${e.mg("back")} Give up</div></div>`,e.ui.appendChild(n),this.el=n.querySelector("#cd")}exit(){}tick(){const e=this.app,t=e.input.menu("any");this.left--,this.el.textContent=String(Math.ceil(this.left/60)),t.confirm?(e.arcade.continues++,e.go(new Vh(e))):t.back||this.left<=0?e.go(new Mi(e)):(t.extra||t.extra2)&&(this.left=Math.max(1,this.left-60))}frame(e){this.app.renderer.syncShowcase(e,{pos:[-1.8,1.4,4.4],look:[.6,1.2,0]})}}class ZS{constructor(e){this.app=e}app;t=0;enter(){const e=this.app,t=e.arcade,i=t.player;e.renderer.setShowcase([{def:i,x:0,facing:1,pose:"victory",variant:0}],!1),e.audio.say(`Congratulations, Prime Minister ${i.name}!`);const n=Ze("div","ending");n.innerHTML=`<h1 class="display">Coalition formed!</h1>
      <p>Against all odds, <b>${Ue(i.name)}</b> has survived the plenum, outlasted ${t.ladder.length} rivals and assembled a 61-seat majority${t.continues?` (after ${t.continues} emergency election${t.continues>1?"s":""})`:""}.<br>
      The President has asked ${Ue(i.name.split(" ")[0])} to form the next government. It will last at least… until the next arcade run.</p>
      <div class="defeated">${t.ladder.map(r=>hn(r)).join("")}</div>
      <p style="color:var(--muted);font-size:14px">Street Knesset Fighter · a parody. Thanks for playing!</p>
      <div>${e.mg("confirm")} Main Menu</div>`,e.ui.appendChild(n)}exit(){}tick(){const e=this.app.input.menu("any");this.t>1.5&&(e.confirm||e.start)&&(this.app.arcade=null,Xh(this.app,!0),this.app.go(new Mi(this.app)))}frame(e){this.t+=e;const t=this.t*.25;this.app.renderer.syncShowcase(e,{pos:[Math.sin(t)*4,1.5,Math.cos(t)*4],look:[0,1.2,0]})}}const JS=["zero","one","two","three","four","five","six","seven","eight","nine"],ls=["stand","crouch","jump","block","cpu"];class sa{constructor(e,t){this.app=e,this.setup=t}app;setup;match;hud;cpu=[null,null];dummyCpu=null;paused=!1;pauseEl=null;pauseMenu=null;pauseSub="menu";movesSlot=0;endTimer=0;inputs=[$t,$t];finished=!1;get training(){return this.setup.mode==="training"}enter(){const e=this.app,t=e.settings,{p1:i,p2:n,stage:r}=this.setup;this.match=new HS({p1:i,p2:n,roundsToWin:this.training?1:t.roundsToWin,roundTime:this.training?0:t.roundTime,training:this.training?{infiniteHealth:!0,infiniteMeter:!0,dummy:"stand"}:null}),e.renderer.clearShowcase(),e.renderer.setStage(r),e.renderer.setFighters([i,n]),e.renderer.snapCamera([0,1.8,7.5],[0,1.1,0]);let a=t.difficulty;this.setup.mode==="arcade"&&e.arcade&&(e.arcade.index>=4&&a++,n.boss&&a++),a=Math.max(0,Math.min(4,a)),this.cpu=[this.setup.cpu[0]?new zl(this.setup.mode==="watch"?t.difficulty:a,101):null,this.setup.cpu[1]?new zl(a,202):null],this.dummyCpu=new zl(t.difficulty,303),this.hud=new VS(e,this.match,{training:this.training,inputDisplay:t.inputDisplay}),e.ui.appendChild(this.hud.root),e.audio.playMusic(r.music,r.id.length+i.id.length)}exit(){this.hud?.destroy()}humanSlots(){const e=[];return this.setup.cpu[0]||e.push(0),!this.setup.cpu[1]&&!this.training&&e.push(1),e}openPause(){this.paused=!0,this.match.paused=!0,this.pauseSub="menu",this.app.audio.sfx("menuConfirm"),this.buildPause()}closePause(){this.paused=!1,this.match.paused=!1,this.pauseEl?.remove(),this.pauseEl=null,this.pauseMenu=null}buildPause(){const e=this.app;this.pauseEl?.remove();const t=Ze("div","pause"),i=Ze("div","box panel");if(t.appendChild(i),this.pauseSub==="moves"){const n=this.match.fighters[this.movesSlot];i.style.maxHeight="86vh",i.style.overflow="auto",i.style.width="min(1000px, 92vw)",i.innerHTML=Op(e,n.def,this.movesSlot)+`<div class="hint" style="position:static;margin-top:14px">◀ ▶ Switch fighter ${e.mg("back")} Back</div>`,this.pauseMenu=null}else{i.innerHTML='<h2 class="display">Paused</h2>';const n=this.match.config.training,r=[{label:"Resume",onSelect:()=>this.closePause()},{label:"Move List",onSelect:()=>{this.pauseSub="moves",this.movesSlot=0,this.buildPause()}}];n&&r.push({label:"Dummy",value:()=>n.dummy.toUpperCase(),onLeft:()=>{n.dummy=ls[(ls.indexOf(n.dummy)+ls.length-1)%ls.length]},onRight:()=>{n.dummy=ls[(ls.indexOf(n.dummy)+1)%ls.length]}},{label:"Infinite Meter",value:()=>n.infiniteMeter?"On":"Off",onLeft:()=>{n.infiniteMeter=!n.infiniteMeter},onRight:()=>{n.infiniteMeter=!n.infiniteMeter}},{label:"Show Hitboxes",value:()=>e.renderer.showHitboxes?"On":"Off",onLeft:()=>{e.renderer.showHitboxes=!e.renderer.showHitboxes},onRight:()=>{e.renderer.showHitboxes=!e.renderer.showHitboxes}},{label:"Reset Positions",onSelect:()=>{this.match.resetPositions(),this.closePause()}}),r.push({label:"Restart Match",onSelect:()=>e.go(new sa(e,this.setup))},{label:"Character Select",onSelect:()=>e.go(new Ro(e,this.setup.mode))},{label:"Main Menu",onSelect:()=>e.go(new Mi(e))}),this.pauseMenu=new fr(r,e.audio),i.appendChild(this.pauseMenu.el)}this.pauseEl=t,e.ui.appendChild(t)}tickPause(){const e=this.app.input.menu("any");if(this.pauseSub==="moves"){e.back||e.start?(this.pauseSub="menu",this.app.audio.sfx("menuBack"),this.buildPause()):(e.left||e.right||e.l1||e.r1)&&(this.movesSlot=this.movesSlot===0?1:0,this.app.audio.sfx("menuMove"),this.buildPause());return}if(e.back||e.start){this.closePause();return}this.pauseMenu?.handle(e)}tick(){if(this.paused){this.tickPause();return}const e=this.match,t=this.app,i=this.humanSlots(),n=[$t,$t];for(const a of[0,1])this.cpu[a]?n[a]=this.cpu[a].next(e.fighters[a],e):this.training&&a===1?n[1]=_S(e.config.training.dummy,e.fighters[1],e,this.dummyCpu):n[a]=t.input.player(a);const r=i.length?i:[0,1];for(const a of r)if((this.cpu[a]?t.input.player(a):n[a]).pressed&me.START&&e.phase!=="matchEnd"){this.openPause();return}this.training&&n[0].pressed&me.SELECT&&e.resetPositions(),e.phase==="intro"?(t.input.menu("any").confirm&&e.skipIntro(),this.hud.showQuote(0,e.fighters[0].def.quotes.intro,e.phaseFrame>10&&e.phaseFrame<100),this.hud.showQuote(1,e.fighters[1].def.quotes.intro,e.phaseFrame>=100&&e.phaseFrame<195)):(this.hud.showQuote(0,"",!1),this.hud.showQuote(1,"",!1)),this.inputs=n,e.tick(n);for(const a of e.drainEvents())this.onEvent(a);if(e.phase==="matchEnd"){this.endTimer++;const a=e.matchWinner;this.endTimer===60&&a!==null&&a>=0&&this.hud.showQuote(a,e.fighters[a].def.quotes.win,!0);const o=this.endTimer>90&&t.input.menu("any").confirm;(this.endTimer>=260||o)&&!this.finished&&(this.finished=!0,this.finish(a))}}onEvent(e){const t=this.app,i=this.match;t.renderer.handleEvent(e,i),this.hud.event(e,i);const n=t.audio;switch(e.t){case"hit":e.blocked?n.sfx(e.counter?"counter":"block"):n.sfx(e.spark==="super"?"hitSuper":e.spark==="light"?"hitLight":"hitHeavy",.9+Math.random()*.2);break;case"whiff":n.sfx(e.heavy?"whooshHeavy":"whoosh",.9+Math.random()*.2);break;case"special":n.sfx("special",.8+e.color%7/14);break;case"projectile":n.sfx("projectile",.9+Math.random()*.2);break;case"superFlash":n.sfx("superFlash");break;case"ko":n.sfx("ko"),n.say(e.perfect?"K.O. Perfect!":"K.O.");break;case"announce":{const r=e.text;if(r.startsWith("ROUND"))n.say(`Round ${JS[i.round]??i.round}`);else if(r==="FINAL ROUND")n.say("Final round");else if(r==="FIGHT!")n.say("Fight!");else if(r==="TIME")n.say("Time!");else if(r.endsWith("WINS")){const a=i.matchWinner!==null&&i.matchWinner>=0?i.fighters[i.matchWinner].def.name:"";n.say(`${a} wins!`)}else r==="DRAW GAME"&&n.say("Draw game");(r==="FIGHT!"||r.startsWith("ROUND")||r==="FINAL ROUND")&&n.sfx("round");break}case"jump":n.sfx("jump");break;case"land":n.sfx(e.hard?"landHard":"land");break;case"tech":n.sfx("tech");break;case"buff":n.sfx("buff");break;case"teleport":n.sfx("teleport");break;case"lifeline":n.sfx("lifeline"),n.say(e.name);break;case"clash":n.sfx("clash");break;case"wallsplat":n.sfx("landHard",.8),n.sfx("crowd");break;case"techroll":n.sfx("whoosh",.8);break;case"rage":n.sfx("buff",.7),n.say("Rage!");break;case"counterHit":n.sfx("counter");break;case"sfx":n.sfx(e.name==="cinematic"?"superFlash":e.name);break;case"rumble":this.setup.cpu[e.fighter]||t.input.rumble(e.fighter,e.strong,e.weak,e.ms);break}}finish(e){const t=this.app;if(this.setup.mode==="arcade"&&t.arcade){const i=t.arcade;e===0?(i.index++,i.index>=i.ladder.length?t.go(new ZS(t)):t.go(new Vh(t))):t.go(new QS(t));return}t.go(new $S(t,this.setup,e??-1))}frame(e){this.app.renderer.syncFight(this.match,this.paused?0:e),this.hud.update(this.match,this.inputs)}}const Ws=10;function ff(s){const e=Bp(s);return[["Power",(e.dmgMul-.85)/.4],["Speed",(e.walk/.052-.75)/.6],["Health",(e.maxHealth/1e3-.85)/.4],["Defense",(1/e.defMul-.8)/.45]].map(([i,n])=>`<span>${i}</span><div class="bar"><i style="width:${Math.round(Math.max(.08,Math.min(1,n))*100)}%"></i></div>`).join("")}function jS(s,e,t,i){const n=`<div class="stats">${i?ff(s).replace(/<span>(\w+)<\/span>(<div class="bar">.*?<\/div>)/g,"$2<span>$1</span>"):ff(s)}</div>`;return`<div class="who">${Ue(e)}</div>
    <div class="name display">${Ue(s.name)}${s.nick?` <span style="color:var(--gold)">“${Ue(s.nick)}”</span>`:""}</div>
    <div class="he">${Ue(s.nameHe)}</div>
    ${Rp(s)}
    <div class="role">${Ue(s.role)} · ${Ue(Ip[s.style])}</div>
    <div class="passive"><b>${Ue(s.passive.name)}:</b> ${Ue(s.passive.desc)}</div>
    ${n}
    ${t?'<div class="locked">✔ LOCKED IN</div>':""}`}class Ro{constructor(e,t){this.app=e,this.mode=t}app;mode;cursor=[0,9];locked=[!1,!1];pickingSlot=0;cells=[];info=[];shown=["",""];t=0;leaveIn=-1;get dual(){return this.mode==="versus"}get needsP2(){return this.mode!=="arcade"}enter(){const e=this.app;e.renderer.clearFighters(),e.renderer.clearStage(),e.renderer.setShowcase([],!1),e.renderer.snapCamera([0,1.35,8.8],[0,1.1,0]);const t=e.lastSetup;t&&(this.cursor[0]=Math.max(0,At.findIndex(o=>o.id===t.p1.id)),this.needsP2&&(this.cursor[1]=Math.max(0,At.findIndex(o=>o.id===t.p2.id))));const i={arcade:"Arcade · Choose your candidate",versus:"Versus · Choose your candidates",training:"Training · Choose your fighter",watch:"CPU vs CPU · Choose both fighters"}[this.mode],n=Ze("div","screen");n.innerHTML=`<div class="cs-title display">${Ue(i)}</div>`;const r=Ze("div","cs-grid");this.cells=At.map((o,l)=>{const c=Ze("div","cs-cell");return c.innerHTML=`${hn(o)}<div class="nm">${Ue(o.name.split(" ").slice(-1)[0])}</div>`,c.addEventListener("mouseenter",()=>{const h=this.dual?0:this.pickingSlot;this.locked[h]||(this.cursor[h]=l,this.refresh())}),c.addEventListener("click",()=>{const h=this.dual?0:this.pickingSlot;this.cursor[h]=l,this.lock(h)}),r.appendChild(c),c}),n.appendChild(r),this.info[0]=Ze("div","cs-info left panel"),this.info[1]=Ze("div","cs-info right panel"),n.append(this.info[0]),this.needsP2&&n.append(this.info[1]);const a=Ze("div","hint",`${e.mg("confirm")} Select ${e.mg("back")} Back ${e.mg("extra")} Random`);n.appendChild(a),e.ui.appendChild(n),this.refresh()}exit(){}slotLabel(e){return this.mode==="watch"?e===0?"CPU 1":"CPU 2":this.mode==="training"?e===0?"PLAYER 1":"DUMMY":this.mode==="arcade"||e===0?"PLAYER 1":"PLAYER 2"}refresh(){this.cells.forEach((e,t)=>{const i=this.cursor[0]===t,n=this.needsP2&&this.cursor[1]===t&&(this.dual||this.pickingSlot===1||this.locked[1]);e.classList.toggle("p1",i),e.classList.toggle("p2",n),e.querySelectorAll(".tag").forEach(r=>r.remove()),i&&e.insertAdjacentHTML("beforeend",`<div class="tag t1">${this.mode==="watch"?"C1":"1P"}</div>`),n&&e.insertAdjacentHTML("beforeend",`<div class="tag t2">${this.mode==="training"?"DUM":this.mode==="watch"?"C2":"2P"}</div>`)});for(const e of[0,1]){if(e===1&&!this.needsP2)continue;const t=e===0||this.dual||this.pickingSlot===1||this.locked[1];this.info[e].style.visibility=t?"visible":"hidden";const i=At[this.cursor[e]];this.info[e].innerHTML=jS(i,this.slotLabel(e),this.locked[e],e===1);const n=`${i.id}:${this.locked[e]}:${t}`;this.shown[e]!==n&&(this.shown[e]=n,this.app.renderer.updateShowcaseSlot(e,t?{def:i,x:e===0?-3.7:3.7,facing:e===0?1:-1,pose:this.locked[e]?"victory":"guard",variant:e}:null))}}lock(e){this.locked[e]||(this.locked[e]=!0,this.app.audio.sfx("select"),!this.dual&&e===0&&this.needsP2&&(this.pickingSlot=1,this.cursor[1]===this.cursor[0]&&(this.cursor[1]=(this.cursor[0]+1)%At.length)),this.refresh(),this.locked[0]&&(!this.needsP2||this.locked[1])&&(this.leaveIn=40))}move(e,t,i){const n=At.length,r=Math.ceil(n/Ws);let a=this.cursor[e]%Ws,o=Math.floor(this.cursor[e]/Ws);a=(a+t+Ws)%Ws,o=(o+i+r)%r,this.cursor[e]=Math.min(n-1,o*Ws+a),this.app.audio.sfx("menuMove"),this.refresh()}handleSlot(e,t){if(t.back){if(this.locked[e]){this.locked[e]=!1,this.leaveIn=-1,this.app.audio.sfx("menuBack"),this.refresh();return}if(!this.dual&&e===1){this.pickingSlot=0,this.locked[0]=!1,this.app.audio.sfx("menuBack"),this.refresh();return}this.app.audio.sfx("menuBack"),this.app.go(new Mi(this.app));return}this.locked[e]||(t.left?this.move(e,-1,0):t.right?this.move(e,1,0):t.up?this.move(e,0,-1):t.down&&this.move(e,0,1),t.extra?(this.cursor[e]=Math.floor(Math.random()*At.length),this.lock(e)):t.confirm&&this.lock(e))}tick(){if(this.leaveIn>0){--this.leaveIn===0&&this.finish();const e=this.app.input.menu(this.dual?0:"any");if(e.back&&this.handleSlot(this.dual?0:this.pickingSlot,e),this.dual){const t=this.app.input.menu(1);t.back&&this.handleSlot(1,t)}return}this.dual?(this.handleSlot(0,this.app.input.menu(0)),this.handleSlot(1,this.app.input.menu(1))):this.handleSlot(this.pickingSlot,this.app.input.menu("any"))}finish(){const e=this.app,t=At[this.cursor[0]];if(this.mode==="arcade"){const n=At.filter(l=>l.id!==t.id).sort(()=>Math.random()-.5),r=t.id==="netanyahu"?At.find(l=>l.id==="lapid"):At.find(l=>l.id==="netanyahu"),a=n.filter(l=>l.id!==r.id).slice(0,7);a.push(gS(r));const o=a.map((l,c)=>c===a.length-1?tn[0]:tn[Math.floor(Math.random()*tn.length)]);e.arcade={player:t,ladder:a,stages:o,index:0,continues:0},e.go(new Vh(e));return}const i=At[this.cursor[1]];e.go(new zp(e,this.mode,t,i))}frame(e){this.t+=e,this.app.renderer.syncShowcase(e,{pos:[0,1.35,8.8],look:[0,1.1,0]})}}class zp{constructor(e,t,i,n){this.app=e,this.mode=t,this.p1=i,this.p2=n}app;mode;p1;p2;menu;descEl;t=0;current=-1;enter(){const e=this.app,t=[...tn.map((a,o)=>({label:a.name,onSelect:()=>this.go(tn[o])})),{label:"Random",onSelect:()=>this.go(tn[Math.floor(Math.random()*tn.length)])}];this.menu=new fr(t,e.audio);const i=Ze("div","screen");i.innerHTML='<div class="cs-title display">Choose the arena</div>';const n=Ze("div","ss-list");n.appendChild(this.menu.el),this.descEl=Ze("div","ss-desc panel"),i.append(n,this.descEl,Ze("div","hint",`${e.mg("confirm")} Select ${e.mg("back")} Back`)),e.ui.appendChild(i);const r=e.lastSetup?.stage;r&&(this.menu.index=Math.max(0,tn.findIndex(a=>a.id===r.id))),this.menu.render(),e.renderer.setShowcase([{def:this.p1,x:-1.6,facing:1,pose:"guard"},{def:this.p2,x:1.6,facing:-1,pose:"guard",variant:1}],!1),this.preview()}preview(){const e=this.menu.index;if(e===this.current)return;this.current=e;const t=tn[e];t?(this.app.renderer.setStage(t),this.app.audio.playMusic(t.music,e+1),this.descEl.innerHTML=`<div class="name display">${Ue(t.name)}</div><div class="he" style="font-size:22px">${Ue(t.nameHe)}</div><div style="color:var(--muted);margin-top:6px">${Ue(t.desc)}</div>`):this.descEl.innerHTML='<div class="name display">Random</div><div style="color:var(--muted)">Let the coalition decide.</div>'}go(e){const t={mode:this.mode,p1:this.p1,p2:this.p2,stage:e,cpu:this.mode==="versus"?[!1,!1]:this.mode==="watch"?[!0,!0]:[!1,this.mode!=="training"]};this.app.lastSetup=t,this.app.go(new Wh(this.app,t))}exit(){}tick(){const e=this.app.input.menu("any");if(e.back){this.app.audio.sfx("menuBack"),this.app.go(new Ro(this.app,this.mode));return}this.menu.handle(e),this.preview()}frame(e){this.t+=e;const t=this.t*.12;this.app.renderer.syncShowcase(e,{pos:[Math.sin(t)*8,2.6,Math.cos(t)*8+1],look:[0,1.2,-1]})}}class Wh{constructor(e,t,i){this.app=e,this.setup=t,this.onDone=i}app;setup;onDone;left=200;t=0;enter(){const e=this.app,{p1:t,p2:i,stage:n}=this.setup;e.renderer.setStage(n),e.renderer.setShowcase([{def:t,x:-1.4,facing:1,pose:"intro"},{def:i,x:1.4,facing:-1,pose:"intro"}],!1),e.audio.sfx("superFlash"),e.audio.say(`${t.name}. Versus. ${i.name}.`);const r=Jr(Yn[t.party].color),a=Jr(Yn[i.party].color),o=Ze("div","vs");o.innerHTML=`<div class="band l" style="background:linear-gradient(90deg, ${r}, transparent)"></div>
      <div class="band r" style="background:linear-gradient(270deg, ${a}, transparent)"></div>
      <div class="stagename display">${Ue(n.name)} · <span class="he">${Ue(n.nameHe)}</span></div>
      <div class="side l">${hn(t,"portrait")}<div class="name display">${Ue(t.name)}</div><div class="he" style="font-size:22px">${Ue(t.nameHe)}</div><div class="quote">“${Ue(t.quotes.intro)}”</div></div>
      <div class="side r">${hn(i,"portrait")}<div class="name display">${Ue(i.boss?"BOSS · "+i.name:i.name)}</div><div class="he" style="font-size:22px">${Ue(i.nameHe)}</div><div class="quote">“${Ue(i.quotes.intro)}”</div></div>
      <div class="big display">VS</div>`,e.ui.appendChild(o)}exit(){}tick(){this.left--;const e=this.app.input.menu("any");(this.left<=0||this.left<170&&(e.confirm||e.start))&&(this.onDone?this.onDone():this.app.go(new sa(this.app,this.setup)))}frame(e){this.t+=e,this.app.renderer.syncShowcase(e,{pos:[Math.sin(this.t*.2)*2,1.4,5.2-this.t*.2],look:[0,1.25,0]})}}const pf=8,Ri=440;class Hp{constructor(e,t){this.app=e,this.back=t}app;back;index=0;focus="grid";grid;cells=[];panel;canvas;preview;info;fileInput;drag=null;busy=!1;get def(){return At[this.index]}enter(){const e=this.app,t=Ze("div","page");t.innerHTML=`<h1 class="display">Faces</h1>
      <div class="sub">Photos come from each MK's Wikipedia article (free licences only). Drag to move, scroll to zoom, or upload your own photo.
      ${R_()==="cartoon"?'<br><b style="color:var(--gold)">Faces are set to Cartoon in Options: switch to Photos to see them in game.</b>':""}</div>
      <div class="fe-wrap"><div class="fe-grid"></div><div class="fe-panel panel"></div></div>`,this.grid=t.querySelector(".fe-grid"),this.panel=t.querySelector(".fe-panel"),this.cells=At.map((i,n)=>{const r=Ze("div","cs-cell");return r.addEventListener("click",()=>{this.index=n,this.focus="edit",this.refreshAll()}),this.grid.appendChild(r),r}),this.panel.innerHTML=`<div class="fe-title display"></div><div class="fe-info"></div>
      <div class="fe-row"><canvas width="${Ri}" height="${Ri}" class="fe-canvas"></canvas><div class="fe-preview"></div></div>
      <div class="fe-buttons">
        <button data-a="upload">Upload photo…</button><button data-a="auto">Auto crop</button>
        <button data-a="toggle"></button><button data-a="remove">Remove upload</button>
      </div>
      <div class="fe-keys"></div>`,this.canvas=this.panel.querySelector("canvas"),this.preview=this.panel.querySelector(".fe-preview"),this.info=this.panel.querySelector(".fe-info"),this.fileInput=document.createElement("input"),this.fileInput.type="file",this.fileInput.accept="image/*",this.fileInput.style.display="none",this.fileInput.addEventListener("change",()=>{const i=this.fileInput.files?.[0];i&&this.upload(i),this.fileInput.value=""}),t.appendChild(this.fileInput),this.panel.querySelectorAll("button").forEach(i=>i.addEventListener("click",()=>this.action(i.dataset.a))),this.canvas.addEventListener("pointerdown",i=>{const n=qs(this.def.id);n&&(this.drag={x:i.clientX,y:i.clientY,crop:{...n.crop}},this.canvas.setPointerCapture(i.pointerId))}),this.canvas.addEventListener("pointermove",i=>{const n=qs(this.def.id);if(!this.drag||!n)return;const r=this.fit(n.image).k,a=this.canvas.getBoundingClientRect(),o=Ri/a.width;Fl(this.def,{cx:this.drag.crop.cx-(i.clientX-this.drag.x)*o/(r*n.image.width),cy:this.drag.crop.cy-(i.clientY-this.drag.y)*o/(r*n.image.height),h:this.drag.crop.h}),this.refreshEditor()}),this.canvas.addEventListener("pointerup",()=>{this.drag=null,this.refreshCell(this.index)}),this.canvas.addEventListener("wheel",i=>{i.preventDefault(),this.zoom(i.deltaY>0?1.06:1/1.06)},{passive:!1}),t.addEventListener("dragover",i=>i.preventDefault()),t.addEventListener("drop",i=>{i.preventDefault();const n=i.dataTransfer?.files?.[0];n&&n.type.startsWith("image/")&&this.upload(n)}),e.ui.append(t,Ze("div","hint",`${e.mg("confirm")} Edit ${e.mg("back")} Back`)),this.refreshAll()}fit(e){const t=Math.min(Ri/e.width,Ri/e.height);return{k:t,ox:(Ri-e.width*t)/2,oy:(Ri-e.height*t)/2}}refreshCell(e){const t=At[e],i=this.cells[e],n=Ul(t.id);i.innerHTML=`${hn(t)}<div class="nm">${Ue(t.name.split(" ").slice(-1)[0])}${n?" · 🎨":""}</div>`,i.classList.toggle("p1",e===this.index)}refreshAll(){this.cells.forEach((e,t)=>this.refreshCell(t)),this.refreshEditor()}refreshEditor(){const e=this.def,t=qs(e.id);this.panel.querySelector(".fe-title").textContent=e.name;const i=Ul(e.id);this.panel.querySelector('[data-a="toggle"]').textContent=i?"Use photo":"Use cartoon",this.panel.querySelector('[data-a="remove"]').style.display=t?.source.kind==="upload"?"":"none",this.panel.classList.toggle("focused",this.focus==="edit");const n=t?.source;this.info.innerHTML=t?n?.kind==="upload"?"Your uploaded photo (stored only in this browser).":`Photo: ${Ue(n?.artist??"")} · ${Ue(n?.license??"")} · <a href="${Ue(n?.descUrl??"#")}" target="_blank" rel="noopener">source</a>${t.detected?"":' · <span style="color:var(--gold)">face not auto-detected: check the crop</span>'}`:"No free-licensed photo found (or you are offline). Upload one to use it in game.";const r=this.canvas.getContext("2d");if(r.fillStyle="#0b1020",r.fillRect(0,0,Ri,Ri),this.preview.innerHTML="",!t)r.fillStyle="#9aa6c4",r.font="18px Arial",r.textAlign="center",r.fillText("No photo yet: click Upload or drop an image here",Ri/2,Ri/2);else{const{k:l,ox:c,oy:h}=this.fit(t.image);r.drawImage(t.image,c,h,t.image.width*l,t.image.height*l);const f=xp(t.crop,t.image.width,t.image.height),u=c+(f.x+f.w/2)*l,d=h+(f.y+f.h/2)*l;r.save(),r.beginPath(),r.rect(0,0,Ri,Ri),r.ellipse(u,d,f.w*l*.465,f.h*l*.465,0,0,Math.PI*2),r.fillStyle="rgba(0,0,0,0.55)",r.fill("evenodd"),r.beginPath(),r.ellipse(u,d,f.w*l*.465,f.h*l*.465,0,0,Math.PI*2),r.lineWidth=3,r.strokeStyle="#ffcc33",r.stroke(),r.restore();const m=t.head.cloneNode();m.getContext("2d").drawImage(t.head,0,0),m.className="fe-head",this.preview.appendChild(m),this.preview.insertAdjacentHTML("beforeend",`<img class="fe-portrait" src="${t.portrait}" alt="">`)}const a=this.app.menuStyle(),o=a==="kb"?'<span class="g g-key">H</span>/<span class="g g-key">L</span>':`${this.app.glyph("TH",0,a)}/${this.app.glyph("UL",0,a)}`;this.panel.querySelector(".fe-keys").innerHTML=this.focus==="edit"?`Arrows / stick: move · ${o} zoom · ${this.app.mg("extra")} photo/cartoon · ${this.app.mg("extra2")} auto crop · ${this.app.mg("back")} done`:`Pick an MK, then ${this.app.mg("confirm")} to edit`}zoom(e){const t=qs(this.def.id);t&&(Fl(this.def,{...t.crop,h:t.crop.h*e}),this.refreshEditor(),this.refreshCell(this.index))}nudge(e,t){const i=qs(this.def.id);i&&(Fl(this.def,{cx:i.crop.cx+e*i.crop.h*.05,cy:i.crop.cy+t*i.crop.h*.05,h:i.crop.h}),this.refreshEditor(),this.refreshCell(this.index))}async upload(e){if(this.busy)return;this.busy=!0,this.info.textContent="Processing photo…";const t=await W_(this.def,e);this.busy=!1,t||(this.info.textContent="Could not read that image."),this.refreshAll()}action(e){const t=this.def;this.app.audio.sfx("menuConfirm"),e==="upload"?this.fileInput.click():e==="auto"?V_(t):e==="toggle"?_p(t.id,!Ul(t.id)):e==="remove"&&X_(t).then(()=>this.refreshAll()),this.refreshAll()}exit(){}tick(){if(this.busy)return;const e=this.app.input.menu("any");if(this.focus==="grid"){if(e.back){this.app.audio.sfx("menuBack"),this.back();return}const t=At.length;let i=!1;e.left?(this.index=(this.index+t-1)%t,i=!0):e.right?(this.index=(this.index+1)%t,i=!0):e.up?(this.index=(this.index+t-pf)%t,i=!0):e.down&&(this.index=(this.index+pf)%t,i=!0),i&&(this.app.audio.sfx("menuMove"),this.refreshAll()),e.confirm&&(this.focus="edit",this.app.audio.sfx("menuConfirm"),this.refreshEditor());return}if(e.back){this.focus="grid",this.app.audio.sfx("menuBack"),this.refreshAll();return}e.left&&this.nudge(-1,0),e.right&&this.nudge(1,0),e.up&&this.nudge(0,-1),e.down&&this.nudge(0,1),e.l1&&this.zoom(1.06),e.r1&&this.zoom(1/1.06),e.extra&&this.action("toggle"),e.extra2&&this.action("auto")}frame(e){this.app.renderer.syncShowcase(e,{pos:[2,1.5,6],look:[0,1.1,0]})}}class Gp{constructor(e,t){this.app=e,this.back=t}app;back;enter(){const e=U_(),t=e.map(({id:n,source:r})=>{const a=At.find(o=>o.id===n);return`<tr><td>${hn(a,"cr-img")}</td><td><b>${Ue(a.name)}</b></td>
          <td>${Ue(r.artist??"")}</td><td>${Ue(r.license??"")}${r.licenseUrl?` · <a href="${Ue(r.licenseUrl)}" target="_blank" rel="noopener">licence</a>`:""}</td>
          <td><a href="${Ue(r.descUrl??"#")}" target="_blank" rel="noopener">${Ue(r.file??"file")}</a></td></tr>`}).join(""),i=Ze("div","page");i.innerHTML=`<h1 class="display">Credits</h1>
      <div class="sub">Street Knesset Fighter is a parody. MK photos are loaded live from Wikipedia / Wikimedia Commons under the free licences listed below,
      cropped and used as caricature heads. Photos remain the work of their authors. Photos you upload stay in your browser only.</div>
      ${e.length?`<table class="ml-table cr-table"><tr class="hdr"><td></td><td>MK</td><td>Photographer / author</td><td>Licence</td><td>Source file</td></tr>${t}</table>`:"<p>No photos loaded (offline, blocked, or Faces set to Cartoon).</p>"}
      <p class="sub" style="margin-top:24px">Code: TypeScript + three.js. Face detection: MediaPipe (Apache 2.0). Music, sound and 3D models are generated procedurally.</p>`,this.app.ui.append(i,Ze("div","hint",`${this.app.mg("back")} Back`))}exit(){}tick(){const e=this.app.input.menu("any");(e.back||e.confirm)&&(this.app.audio.sfx("menuBack"),this.back())}frame(e){this.app.renderer.syncShowcase(e,{pos:[2,1.5,6],look:[0,1.1,0]})}}const eb={bpm:108,root:50,mode:"dorian",intensity:.5};function Vl(s){return s[Math.floor(Math.random()*s.length)]}class tb{constructor(e){this.app=e}app;bar;msg;done=!1;photosStarted=0;ticks=0;enter(){const e=Ze("div","loading");e.innerHTML=`<div class="logo"><span class="l1">Street</span><span class="l2">Knesset</span><span class="l3">Fighter</span></div>
      <div class="bar"><i style="width:0%"></i></div><div class="boot-msg" style="color:var(--muted);text-align:center">Drafting 40 members of Knesset…</div>`,this.app.ui.appendChild(e),this.bar=e.querySelector(".bar i"),this.msg=e.querySelector(".boot-msg"),bS(At,(t,i)=>{this.bar.style.width=`${t/i*50}%`}).then(()=>{if(this.app.settings.faces!=="photo"){this.done=!0;return}this.photosStarted=this.ticks,this.msg.textContent="Fetching MK photos from Wikipedia…",Ep(At,(t,i)=>{this.bar.style.width=`${50+t/i*50}%`,this.msg.innerHTML=`Fetching MK photos and scanning faces in 3D… ${t}/${i}<br><span style="font-size:13px">First visit only · press any button to skip</span>`}).then(()=>{this.done=!0})})}exit(){}tick(){this.ticks++;const e=this.photosStarted?this.ticks-this.photosStarted:0,t=this.photosStarted>0&&e>60&&this.app.input.anyPressed();(this.done||t||e>2700)&&this.app.go(new Vp(this.app))}frame(){}}function Xh(s,e=!1){if(!e&&s.renderer.showcaseCount===2&&s.renderer.currentStage==="plenum")return;s.renderer.clearFighters(),s.renderer.setStage(th.plenum);const t=Vl(At);let i=Vl(At);for(;i.id===t.id;)i=Vl(At);s.renderer.setShowcase([{def:t,x:-1.3,facing:1,pose:"guard"},{def:i,x:1.3,facing:-1,pose:"guard"}],!1),s.audio.playMusic(eb,3)}class Vp{constructor(e){this.app=e}app;t=0;enter(){const e=this.app;Xh(e,!0),e.renderer.snapCamera([0,1.6,6.5],[0,1.2,0]);const t=Ze("div","title-wrap");t.innerHTML=`<div class="logo"><span class="l1">Street</span><span class="l2">Knesset</span><span class="l3">Fighter</span><span class="sub"><span class="he">סטריט כנסת פייטר</span> · 40 MKs · ONE PLENUM</span></div>
      <div class="press blink">PRESS ${e.mg("confirm")} / ENTER</div>
      <div class="pads-status"></div>
      <div class="disclaimer">A parody fighting game. All characters are caricatures of public figures; moves and quotes are satire, not real statements.</div>`,t.addEventListener("click",()=>this.next()),e.ui.appendChild(t),this.updatePads(),e.input.onChange=()=>this.updatePads()}updatePads(){const e=this.app.ui.querySelector(".pads-status");if(!e)return;const t=this.app.input.connectedPads();e.innerHTML=t.length?t.map(i=>`<b>${i.kind==="dualsense"?"DualSense":i.kind==="dualshock"?"DualShock":i.kind==="xbox"?"Xbox pad":"Gamepad"}</b> connected${i.standard?"":" (raw mode)"}`).join("<br>"):"No controller detected: press a button on your PS5 controller.<br>Keyboard works too."}next(){this.app.audio.unlock(),this.app.audio.sfx("menuConfirm"),this.app.go(new Mi(this.app))}exit(){this.app.input.onChange=null}tick(){const e=this.app.input.menu("any");(e.confirm||e.start)&&this.next()}frame(e){this.t+=e;const t=this.t*.15;this.app.renderer.syncShowcase(e,{pos:[Math.sin(t)*6.2,1.6+Math.sin(this.t*.4)*.2,Math.cos(t)*6.2],look:[0,1.15,0]})}}class Mi{constructor(e){this.app=e}app;static lastIndex=0;menu;t=0;enter(){const e=this.app,t=a=>()=>e.go(new Ro(e,a)),i=[{label:"Arcade",desc:"Fight through 7 MKs and the final boss to form a government.",onSelect:t("arcade")},{label:"Versus",desc:"Two players, one plenum. Local multiplayer.",onSelect:t("versus")},{label:"Training",desc:"Practice combos against a dummy. Infinite health and meter.",onSelect:t("training")},{label:"CPU vs CPU",desc:"Sit back and watch two CPUs debate.",onSelect:t("watch")},{label:"Move Lists",desc:"Every special move, ultimate and passive for all 40 fighters.",onSelect:()=>e.go(new qS(e,0,()=>e.go(new Mi(e))))},{label:"Controls",desc:"PS5 DualSense and keyboard layouts, controller assignment and remapping.",onSelect:()=>e.go(new YS(e,()=>e.go(new Mi(e))))},{label:"Faces",desc:"Adjust any MK’s photo crop, or upload your own photo.",onSelect:()=>e.go(new Hp(e,()=>e.go(new Mi(e))))},{label:"Credits",desc:"Photo credits and licences.",onSelect:()=>e.go(new Gp(e,()=>e.go(new Mi(e))))},{label:"Options",desc:"Difficulty, rounds, timer, audio and more.",onSelect:()=>e.go(new ib(e,()=>e.go(new Mi(e))))}];e.desktop&&i.push({label:"Quit",desc:"Exit to desktop.",onSelect:()=>e.desktop.quit()}),this.menu=new fr(i,e.audio,{desc:!0}),this.menu.index=Math.min(Mi.lastIndex,i.length-1),this.menu.render();const n=Ze("div","mainmenu");n.innerHTML='<div class="logo"><span class="l1">Street</span><span class="l2">Knesset</span><span class="l3">Fighter</span></div>',n.appendChild(this.menu.el);const r=Ze("div","hint",`${e.mg("confirm")} Select ${e.mg("back")} Back`);e.ui.append(n,r),Xh(e)}exit(){Mi.lastIndex=this.menu.index}tick(){const e=this.app.input.menu("any");if(e.back){this.app.audio.sfx("menuBack"),this.app.go(new Vp(this.app));return}this.menu.handle(e)}frame(e){this.t+=e;const t=.5+Math.sin(this.t*.1)*.3;this.app.renderer.syncShowcase(e,{pos:[Math.sin(t)*6+1.5,1.5,Math.cos(t)*6],look:[1.2,1.1,0]})}}class ib{constructor(e,t){this.app=e,this.back=t}app;back;menu;toggleFaces(){const e=this.app.settings;e.faces=e.faces==="photo"?"cartoon":"photo",this.app.applySettings(),e.faces==="photo"&&k_()===0&&Ep(At)}enter(){const e=this.app,t=e.settings,i=(l,c)=>{t[l]=Math.round(Math.max(0,Math.min(1,t[l]+c))*10)/10,e.applySettings()},n=[30,60,99,0],r=l=>{t.quality=Pr[(Pr.indexOf(t.quality)+l+Pr.length)%Pr.length],e.applySettings()},a=[{label:"CPU Difficulty",value:()=>vS[t.difficulty],onLeft:()=>{t.difficulty=Math.max(0,t.difficulty-1),e.applySettings()},onRight:()=>{t.difficulty=Math.min(4,t.difficulty+1),e.applySettings()},desc:"How tough the CPU opponents are."},{label:"Rounds to Win",value:()=>String(t.roundsToWin),onLeft:()=>{t.roundsToWin=Math.max(1,t.roundsToWin-1),e.applySettings()},onRight:()=>{t.roundsToWin=Math.min(5,t.roundsToWin+1),e.applySettings()}},{label:"Round Time",value:()=>t.roundTime===0?"∞":`${t.roundTime}s`,onLeft:()=>{t.roundTime=n[(n.indexOf(t.roundTime)+n.length-1)%n.length],e.applySettings()},onRight:()=>{t.roundTime=n[(n.indexOf(t.roundTime)+1)%n.length],e.applySettings()}},{label:"Master Volume",value:()=>`${Math.round(t.masterVolume*100)}%`,onLeft:()=>i("masterVolume",-.1),onRight:()=>i("masterVolume",.1)},{label:"Music Volume",value:()=>`${Math.round(t.musicVolume*100)}%`,onLeft:()=>i("musicVolume",-.1),onRight:()=>i("musicVolume",.1)},{label:"SFX Volume",value:()=>`${Math.round(t.sfxVolume*100)}%`,onLeft:()=>i("sfxVolume",-.1),onRight:()=>i("sfxVolume",.1)},{label:"Announcer Voice",value:()=>t.announcer?"On":"Off",onLeft:()=>{t.announcer=!t.announcer,e.applySettings()},onRight:()=>{t.announcer=!t.announcer,e.applySettings()},desc:"Uses your system text-to-speech voice."},{label:"Controller Rumble",value:()=>t.rumble?"On":"Off",onLeft:()=>{t.rumble=!t.rumble,e.applySettings()},onRight:()=>{t.rumble=!t.rumble,e.applySettings()},desc:"DualSense vibration on hits (Chrome / Edge / desktop app)."},{label:"Show Hitboxes",value:()=>t.showHitboxes?"On":"Off",onLeft:()=>{t.showHitboxes=!t.showHitboxes,e.applySettings()},onRight:()=>{t.showHitboxes=!t.showHitboxes,e.applySettings()}},{label:"Input Display",value:()=>t.inputDisplay?"On":"Off",onLeft:()=>{t.inputDisplay=!t.inputDisplay,e.applySettings()},onRight:()=>{t.inputDisplay=!t.inputDisplay,e.applySettings()}},{label:"Faces",value:()=>t.faces==="photo"?"Photos":"Cartoon",onLeft:()=>this.toggleFaces(),onRight:()=>this.toggleFaces(),desc:"Photos: real MK faces from Wikipedia (free-licensed). Cartoon: procedural caricatures."},{label:"Graphics Quality",value:()=>c0[t.quality],onLeft:()=>r(-1),onRight:()=>r(1),desc:"Ultra: ambient occlusion, bloom and anti-aliasing. High: no ambient occlusion. Low: for integrated graphics. Drops automatically if the frame rate suffers."},{label:"Toggle Fullscreen",onSelect:()=>e.toggleFullscreen(),desc:"Or press F11."},{label:"Back",onSelect:()=>this.back()}];this.menu=new fr(a,e.audio,{desc:!0});const o=Ze("div","page");o.innerHTML='<div class="options"><h1 class="display">Options</h1><div class="sub">Settings are saved automatically.</div></div>',o.querySelector(".options").appendChild(this.menu.el),e.ui.append(o,Ze("div","hint",`◀ ▶ Change ${e.mg("confirm")} Select ${e.mg("back")} Back`))}exit(){}tick(){const e=this.app.input.menu("any");if(e.back){this.app.audio.sfx("menuBack"),this.back();return}this.menu.handle(e)}frame(e){this.app.renderer.syncShowcase(e,{pos:[2,1.5,6],look:[0,1.1,0]})}}const Ht=new mS;Ht.go(new tb(Ht));Ht.start();new URLSearchParams(location.search).has("debug")&&(Ht.renderer.autoQuality=!1,window.skfDebug={app:Ht,lineup(s,e="plenum",t="guard",i=1){Ht.renderer.setStage(th[e]),Ht.renderer.setShowcase(s.map((n,r)=>({def:Ol[n],x:(r-(s.length-1)/2)*1.1,facing:i,pose:t})),!1)},camera(s,e){Ht.renderer.snapCamera(s,e),Ht.renderer.camera.position.set(...s),Ht.renderer.camera.lookAt(...e)},quality(s){Ht.renderer.setQuality(s)},fight(s,e,t="plenum",i="watch"){const n={mode:i,p1:Ol[s],p2:Ol[e],stage:th[t],cpu:[i==="watch",i!=="versus"&&i!=="training"]},r=new sa(Ht,n);return Ht.go(r),r},screen:()=>Ht.screen,editor:()=>Hp,credits:()=>Gp,faces:()=>At.map(s=>{const e=qs(s.id);return{id:s.id,loaded:!!e,detected:!!e?.detected,mesh:!!e?.mesh,skin:e?.skin?.toString(16),crop:e?.crop,license:e?.source.license}}),move(s,e){const t=Ht.screen,i=t.match.fighters[s];i.meter=100;const n=e==="ult"?i.moves.ultimate:i.moves.specials[e];(i.actionable||i.state==="attack")&&i.startMove(n,.5,t.match)},place(s,e,t=0,i=0){const n=Ht.screen,[r,a]=n.match.fighters;r.x=s,r.z=t,a.x=e,a.z=i;for(const o of[r,a])o.vx=o.vz=o.slideX=o.slideZ=0,o.faceOpponent()},normal(s,e){const t=Ht.screen,i=t.match.fighters[s],n=i.moves.normals[e];n&&(i.actionable||i.state==="attack")&&i.startMove(n,.5,t.match)},manual(){const s=Ht.screen;s.tick=()=>{},s.frame=()=>{}},step(s=1,e=$t,t=$t){const n=Ht.screen.match;for(let r=0;r<s;r++){n.tick([e,t]);for(const a of n.drainEvents())Ht.renderer.handleEvent(a,n);Ht.renderer.syncFight(n,1/60)}},info(){const s=Ht.screen.match;return{phase:s.phase,camN:s.camN,fighters:s.fighters.map(e=>({x:+e.x.toFixed(2),y:+e.y.toFixed(2),z:+e.z.toFixed(2),yaw:+e.yaw.toFixed(2),state:e.state,hp:e.health,facing:e.facing}))}}});
