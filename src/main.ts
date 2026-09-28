import './ui/style.css';
import { App } from './ui/app';
import { BootScreen } from './ui/screens/menus';
import { FightScreen } from './ui/screens/fight';
import { ROSTER, ROSTER_BY_ID } from './data/roster';
import { rawFace } from './render/faces';
import { CreditsScreen, FaceEditorScreen } from './ui/screens/faces';
import { STAGE_BY_ID } from './data/stages';
import type { Mode } from './ui/app';
import { NO_INPUT, type PlayerInput } from './game/types';

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
    editor: () => FaceEditorScreen,
    credits: () => CreditsScreen,
    faces: () => ROSTER.map((d) => {
      const f = rawFace(d.id);
      return { id: d.id, loaded: !!f, detected: !!f?.detected, crop: f?.crop, license: f?.source.license };
    }),
    move(i: number, which: number | 'ult') {
      const scr = app.screen as FightScreen;
      const f = scr.match.fighters[i];
      f.meter = 100;
      const mv = which === 'ult' ? f.moves.ultimate : f.moves.specials[which];
      if (f.actionable || f.state === 'attack') f.startMove(mv, 0.5, scr.match);
    },
    place(x0: number, x1: number, z0 = 0, z1 = 0) {
      const scr = app.screen as FightScreen;
      const [a, b] = scr.match.fighters;
      a.x = x0;
      a.z = z0;
      b.x = x1;
      b.z = z1;
      for (const f of [a, b]) {
        f.vx = f.vz = f.slideX = f.slideZ = 0;
        f.faceOpponent();
      }
    },
    normal(i: number, id: string) {
      const scr = app.screen as FightScreen;
      const f = scr.match.fighters[i];
      const mv = (f.moves.normals as Record<string, (typeof f.moves.normals)[keyof typeof f.moves.normals]>)[id];
      if (mv && (f.actionable || f.state === 'attack')) f.startMove(mv, 0.5, scr.match);
    },
    /** Takes over the fight loop so tests can step frame by frame. */
    manual() {
      const scr = app.screen as FightScreen;
      scr.tick = () => {};
      scr.frame = () => {};
    },
    step(n = 1, p1: PlayerInput = NO_INPUT, p2: PlayerInput = NO_INPUT) {
      const scr = app.screen as FightScreen;
      const m = scr.match;
      for (let i = 0; i < n; i++) {
        m.tick([p1, p2]);
        for (const ev of m.drainEvents()) app.renderer.handleEvent(ev, m);
        app.renderer.syncFight(m, 1 / 60);
      }
    },
    info() {
      const m = (app.screen as FightScreen).match;
      return {
        phase: m.phase,
        camN: m.camN,
        fighters: m.fighters.map((f) => ({ x: +f.x.toFixed(2), y: +f.y.toFixed(2), z: +f.z.toFixed(2), yaw: +f.yaw.toFixed(2), state: f.state, hp: f.health, facing: f.facing })),
      };
    },
  };
}
