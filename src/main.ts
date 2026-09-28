import './ui/style.css';
import { App } from './ui/app';
import { BootScreen } from './ui/screens/menus';
import { FightScreen } from './ui/screens/fight';
import { ROSTER_BY_ID } from './data/roster';
import { STAGE_BY_ID } from './data/stages';
import type { Mode } from './ui/app';

const app = new App();
app.go(new BootScreen(app));
app.start();

// Test hook, only active with ?debug in the URL.
if (new URLSearchParams(location.search).has('debug')) {
  (window as unknown as Record<string, unknown>).skfDebug = {
    app,
    fight(p1: string, p2: string, stage = 'plenum', mode: Mode = 'watch') {
      const setup = { mode, p1: ROSTER_BY_ID[p1], p2: ROSTER_BY_ID[p2], stage: STAGE_BY_ID[stage], cpu: [mode === 'watch', mode !== 'versus' && mode !== 'training'] as [boolean, boolean] };
      const s = new FightScreen(app, setup);
      app.go(s);
      return s;
    },
    screen: () => app.screen,
    move(i: number, which: number | 'ult') {
      const scr = app.screen as FightScreen;
      const f = scr.match.fighters[i];
      f.meter = 100;
      const mv = which === 'ult' ? f.moves.ultimate : f.moves.specials[which];
      if (f.actionable || f.state === 'attack') f.startMove(mv, 0.5, scr.match);
    },
    place(x0: number, x1: number) {
      const scr = app.screen as FightScreen;
      scr.match.fighters[0].x = x0;
      scr.match.fighters[1].x = x1;
    },
  };
}
