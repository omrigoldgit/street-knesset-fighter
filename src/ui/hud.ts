import type { Match } from '../game/match';
import { BTN, type GameEvent, type PlayerInput } from '../game/types';
import { MAX_METER } from '../game/constants';
import { PARTIES } from '../data/parties';
import type { App } from './app';
import { el, esc, hex, portraitHTML, readable } from './dom';

const ARROWS: Record<number, string> = { 1: '↙', 2: '↓', 3: '↘', 4: '←', 5: '•', 6: '→', 7: '↖', 8: '↑', 9: '↗' };

export class Hud {
  root: HTMLElement;
  private hp: HTMLElement[] = [];
  private trail: HTMLElement[] = [];
  private rec: HTMLElement[] = [];
  private meter: HTMLElement[] = [];
  private meterBar: HTMLElement[] = [];
  private meterLabel: HTMLElement[] = [];
  private buffs: HTMLElement[] = [];
  private pips: HTMLElement[] = [];
  private timer: HTMLElement;
  private announceEl: HTMLElement;
  private announceLeft = 0;
  private combo: HTMLElement[] = [];
  private comboHold = [0, 0];
  private comboBest = [{ hits: 0, dmg: 0 }, { hits: 0, dmg: 0 }];
  private special: HTMLElement[] = [];
  private specialLeft = [0, 0];
  private banner: HTMLElement;
  private bannerLeft = 0;
  private dim: HTMLElement;
  private flash: HTMLElement;
  private quote: HTMLElement[] = [];
  private training: HTMLElement | null = null;
  private inputDisp: HTMLElement | null = null;
  private inputLog: string[] = [];
  private lastInput = '';
  private lastCombo = { hits: 0, dmg: 0 };
  private lastHpText = ['', ''];
  private lastTicks = -1;

  constructor(private app: App, m: Match, opts: { training: boolean; inputDisplay: boolean }) {
    this.root = el('div', 'hud');
    const top = el('div', 'top');
    m.fighters.forEach((f, i) => {
      const side = i === 0 ? 'l' : 'r';
      const party = PARTIES[f.def.party];
      const wrap = el('div', `hp-wrap ${side}`);
      wrap.innerHTML = `${portraitHTML(f.def, 'hp-port')}
        <div class="hp-col">
          <div class="hp ${side}"><i class="rec"></i><i class="trail"></i><i class="fill"></i></div>
          <div class="hp-name"><span class="n">${esc(f.def.nick ?? f.def.name.split(' ').slice(-1)[0])}</span><span class="he">${esc(f.def.nameHe)}</span><span class="chip" style="background:${hex(party.color)}">${esc(party.name)}</span></div>
          <div class="pips"></div>
        </div>`;
      this.hp[i] = wrap.querySelector('.fill') as HTMLElement;
      this.trail[i] = wrap.querySelector('.trail') as HTMLElement;
      this.rec[i] = wrap.querySelector('.rec') as HTMLElement;
      this.pips[i] = wrap.querySelector('.pips') as HTMLElement;
      if (i === 0) top.appendChild(wrap);
      else {
        this.timer = el('div', 'timer', '99');
        top.appendChild(this.timer);
        top.appendChild(wrap);
      }
    });
    this.timer = top.querySelector('.timer') as HTMLElement;
    this.root.appendChild(top);

    const bottom = el('div', 'bottom');
    m.fighters.forEach((_, i) => {
      const side = i === 0 ? 'l' : 'r';
      const w = el('div', `meter-wrap ${side}`);
      w.innerHTML = `<div class="buffs"></div><div class="meter-label">ULTIMATE</div><div class="meter"><i></i></div>`;
      this.meter[i] = w.querySelector('.meter i') as HTMLElement;
      this.meterBar[i] = w.querySelector('.meter') as HTMLElement;
      this.meterLabel[i] = w.querySelector('.meter-label') as HTMLElement;
      this.buffs[i] = w.querySelector('.buffs') as HTMLElement;
      bottom.appendChild(w);
    });
    this.root.appendChild(bottom);

    for (let i = 0; i < 2; i++) {
      const side = i === 0 ? 'l' : 'r';
      this.combo[i] = el('div', `combo ${side}`, '<div class="n">0</div><div class="t">HITS</div><div class="d"></div>');
      this.special[i] = el('div', `special-name ${side}`);
      this.quote[i] = el('div', `quote-bubble ${side}`);
      this.root.append(this.combo[i], this.special[i], this.quote[i]);
    }
    this.dim = el('div', 'super-dim');
    this.banner = el('div', 'super-banner', '<div class="strip"></div><div class="txt"><div class="who"></div><div class="mv"></div></div>');
    this.announceEl = el('div', 'announce');
    this.flash = el('div', 'flash');
    this.root.prepend(this.dim);
    this.root.append(this.banner, this.announceEl, this.flash);

    if (opts.training) {
      this.training = el('div', 'training-panel panel');
      this.root.appendChild(this.training);
    }
    if (opts.inputDisplay || opts.training) {
      this.inputDisp = el('div', 'input-disp');
      this.root.appendChild(this.inputDisp);
    }
    this.renderPips(m);
  }

  private renderPips(m: Match): void {
    m.fighters.forEach((f, i) => {
      let h = '';
      for (let k = 0; k < m.config.roundsToWin; k++) h += `<div class="pip ${k < f.roundsWon ? 'on' : ''}"></div>`;
      this.pips[i].innerHTML = m.training ? '' : h;
    });
  }

  showQuote(i: number, text: string, show: boolean): void {
    this.quote[i].textContent = `“${text}”`;
    this.quote[i].classList.toggle('show', show);
  }

  announce(text: string, big: boolean, frames: number): void {
    this.announceEl.className = 'announce';
    void this.announceEl.offsetWidth;
    this.announceEl.textContent = text;
    this.announceEl.className = `announce show ${big ? 'big' : 'small'}`;
    this.announceLeft = frames;
  }

  event(ev: GameEvent, m: Match): void {
    switch (ev.t) {
      case 'announce':
        this.announce(ev.text, !!ev.big, ev.frames ?? 50);
        break;
      case 'special':
        this.special[ev.fighter].textContent = ev.name + '!';
        this.special[ev.fighter].style.color = readable(ev.color);
        this.special[ev.fighter].classList.add('show');
        this.specialLeft[ev.fighter] = 70;
        break;
      case 'superFlash': {
        const f = m.fighters[ev.fighter];
        (this.banner.querySelector('.who') as HTMLElement).textContent = `${f.def.name.toUpperCase()} · ULTIMATE`;
        const mv = this.banner.querySelector('.mv') as HTMLElement;
        mv.textContent = ev.name;
        mv.style.color = readable(ev.color);
        (this.banner.querySelector('.txt') as HTMLElement).style.textAlign = ev.fighter === 0 ? 'left' : 'right';
        this.banner.classList.add('show');
        this.dim.classList.add('show');
        this.bannerLeft = 52;
        this.doFlash();
        break;
      }
      case 'lifeline':
        this.announce(`${ev.name}!`, false, 70);
        this.doFlash();
        break;
      case 'ko':
        this.doFlash();
        break;
      case 'round':
        this.renderPips(m);
        break;
    }
  }

  private doFlash(): void {
    this.flash.classList.remove('go');
    void this.flash.offsetWidth;
    this.flash.classList.add('go');
  }

  update(m: Match, inputs?: [PlayerInput, PlayerInput]): void {
    // Countdowns run on game ticks, not render frames.
    const steps = this.lastTicks < 0 ? 1 : Math.max(0, m.ticks - this.lastTicks);
    this.lastTicks = m.ticks;
    for (let k = 0; k < steps; k++) this.countdown();
    m.fighters.forEach((f, i) => {
      const pct = Math.max(0, (f.health / f.stats.maxHealth) * 100);
      const w = `${pct.toFixed(2)}%`;
      if (this.lastHpText[i] !== w) {
        this.hp[i].style.width = w;
        this.trail[i].style.width = w;
        this.lastHpText[i] = w;
      }
      this.hp[i].classList.toggle('low', pct < 25);
      this.rec[i].style.width = `${Math.min(100, pct + (f.recoverable / f.stats.maxHealth) * 100).toFixed(2)}%`;
      const mp = (f.meter / MAX_METER) * 100;
      this.meter[i].style.width = `${mp}%`;
      const full = f.meter >= MAX_METER;
      this.meterBar[i].classList.toggle('full', full);
      this.meterLabel[i].classList.toggle('full', full);
      this.meterLabel[i].innerHTML = full ? `ULTIMATE READY ${this.app.glyph('UL', i as 0 | 1)}` : `ULTIMATE ${Math.floor(mp)}%`;
      const b = f.buffs.map((x) => x.kind.toUpperCase()).join(' · ');
      const extra = f.passive === 'lifeline' && !f.lifelineUsed ? '♥ ' + f.def.passive.name : '';
      this.buffs[i].textContent = [b, extra].filter(Boolean).join('  ');
    });

    // Combos: shown on the attacker's side.
    for (let d = 0; d < 2; d++) {
      const def = m.fighters[d];
      const a = 1 - d;
      if (def.comboHits >= 2) {
        this.comboBest[a] = { hits: def.comboHits, dmg: def.comboDamage };
        this.combo[a].innerHTML = `<div class="n">${def.comboHits}</div><div class="t">HITS</div><div class="d">${def.comboDamage} DMG</div>`;
        this.combo[a].classList.add('show');
        this.comboHold[a] = 70;
        if (a === 0) this.lastCombo = { hits: def.comboHits, dmg: def.comboDamage };
      }
      if (def.comboHits === 1 && a === 0) this.lastCombo = { hits: 1, dmg: def.comboDamage };
    }


    if (m.training || m.config.roundTime === 0) this.timer.textContent = '∞';
    else {
      const secs = Math.max(0, Math.ceil(m.timer / 60));
      this.timer.textContent = String(secs);
      this.timer.classList.toggle('low', secs <= 10);
    }
    if (m.phase === 'roundStart' && m.phaseFrame === 2) this.renderPips(m);
    if (m.phase === 'matchEnd' && m.phaseFrame === 1) this.renderPips(m);

    if (this.training) {
      const opp = m.fighters[1];
      const mode = m.config.training?.dummy ?? 'stand';
      this.training.innerHTML = `<b>TRAINING</b><br>Last combo: ${this.lastCombo.hits} hits · ${this.lastCombo.dmg} dmg<br>
        Dummy: ${mode.toUpperCase()}<br>Dummy HP: ${Math.round(opp.health)} / ${opp.stats.maxHealth}<br>
        ${this.app.glyph('SELECT', 0)} reset positions · ${this.app.glyph('START', 0)} menu`;
    }
    if (this.inputDisp && inputs) {
      const inp = inputs[0];
      const btns: string[] = [];
      const names: [number, string][] = [[BTN.LP, 'LP'], [BTN.HP, 'HP'], [BTN.LK, 'LK'], [BTN.HK, 'HK'], [BTN.SP, 'SP'], [BTN.UL, 'UL'], [BTN.TH, 'TH'], [BTN.SS, 'SS']];
      for (const [bit, n] of names) if (inp.pressed & bit) btns.push(n);
      const key = `${inp.dir}|${btns.join('+')}`;
      if (key !== this.lastInput && (inp.dir !== 5 || btns.length)) {
        this.inputLog.unshift(`<span class="arrow">${ARROWS[inp.dir]}</span> ${btns.join('+')}`);
        this.inputLog.length = Math.min(this.inputLog.length, 14);
      }
      this.lastInput = key;
      this.inputDisp.innerHTML = this.inputLog.join('<br>');
    }
  }

  private countdown(): void {
    for (let i = 0; i < 2; i++) {
      if (this.specialLeft[i] > 0 && --this.specialLeft[i] === 0) this.special[i].classList.remove('show');
      if (this.comboHold[i] > 0 && --this.comboHold[i] === 0) this.combo[i].classList.remove('show');
    }
    if (this.bannerLeft > 0 && --this.bannerLeft === 0) {
      this.banner.classList.remove('show');
      this.dim.classList.remove('show');
    }
    if (this.announceLeft > 0 && --this.announceLeft === 0) this.announceEl.classList.add('hide');
  }

  destroy(): void {
    this.root.remove();
  }
}
