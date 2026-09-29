# Iron Knesset · טורניר כנסת הברזל

A 3D, **Tekken-style satirical fighting game** starring **40 members of the Knesset**: free 3D movement around a
circular arena, sidesteps, launchers and juggles, wall splats and Rage Arts.
Each MK gets a **3D head built from their real photo**, their own fighting stance and signature intro/victory gestures,
**3 unique special moves**, a **Heat Smash**, and a **passive special ability**. It runs on PC in Chrome or Edge, or as a desktop app, and supports **PS5 DualSense controllers**
out of the box. Keyboard works too.

> ⚠️ **Parody.** Every character is a caricature of a public figure. Moves, bios and quotes are affectionate political satire,
> not real statements or factual claims. Roles reflect the 25th Knesset and may be out of date. Edit `src/data/roster.ts` freely.

---

## ▶ Play in your browser

**https://omrigoldgit.github.io/street-knesset-fighter/**. Open it in Chrome or Edge, click once to enable sound,
and press any button on your PS5 controller. Every push to this branch redeploys it automatically.

## Play locally (no install)

Requires only [Node.js](https://nodejs.org) 20+. The prebuilt game is in `dist/`, so there is **no `npm install`**.
That also sidesteps Windows *Smart App Control*, which can block the build tools' native binaries.

**Windows PowerShell: paste once:**

```powershell
$ProgressPreference = 'SilentlyContinue'
$d = "$HOME\Downloads\skf-play"
Remove-Item $d, "$d.zip" -Recurse -Force -ErrorAction SilentlyContinue
Invoke-WebRequest "https://github.com/omrigoldgit/street-knesset-fighter/archive/refs/heads/claude/blissful-cerf-2sdwqh.zip" -OutFile "$d.zip"
Expand-Archive "$d.zip" $d
Set-Location (Get-ChildItem $d -Directory)[0].FullName
node play.mjs
```

Or, from any copy of the repo: `node play.mjs`. It serves the game on http://localhost:5173 and opens your browser (use Chrome or Edge).

## Development

```bash
npm install
npm run dev          # hot-reloading dev server on http://localhost:5173
npm run build        # refreshes dist/ (commit it so `node play.mjs` stays current)
```

### Desktop app (Windows / macOS / Linux)

```bash
npm run desktop      # builds and launches the Electron app
npm run dist:win     # builds a portable .exe + .zip into release/ (run on Windows)
```

No Windows machine handy? Run the **Build** workflow from the repo's GitHub **Actions** tab (`workflow_dispatch`).
It uploads a ready-to-run `Iron Knesset` portable `.exe` as an artifact.

## PS5 DualSense setup

1. Connect the controller with **USB-C**, or pair over **Bluetooth**: hold **PS + Create** until the light bar flashes,
   then add it in Windows *Settings → Bluetooth & devices*.
2. Start the game and **press any button**. The first controller becomes Player 1 and the second becomes Player 2.
3. Chrome, Edge and the desktop app read the DualSense natively with the standard mapping, and **rumble works**.
   Firefox exposes a raw layout that is auto-detected. If a button feels wrong, use **Controls → Remap**.

| DualSense | Action | Keyboard P1 | Keyboard P2 |
|---|---|---|---|
| D-pad / Left stick | Move · tap ↑ / ↓ to sidestep · hold ↑ to jump · ↓ to crouch · stand still or hold ← to guard | W A S D | Arrow keys |
| □ Square | **1** · Left Punch | U | Num 4 / Insert |
| △ Triangle | **2** · Right Punch | I | Num 5 / Home |
| ✕ Cross | **3** · Left Kick (menus: confirm) | J | Num 1 / Delete |
| ○ Circle | **4** · Right Kick (menus: back) | K | Num 2 / End |
| R1 | **Special** (neutral / → / ↓ picks Special 1 / 2 / 3) | O | Num 6 / PgUp |
| R2 | **Heat Smash** (full Heat gauge), or **Rage Art** below 25% health | L | Num 3 / PgDn |
| L2 | Throw | H | Num 0 |
| L1 | Sidestep (hold to sidewalk around the opponent) | Space | Num . / Right Shift |
| Options | Pause | Esc / Enter | Num Enter |
| Create | Reset positions (training) | Backspace | Num − |

## How it plays (Tekken rules)

- **Guard**: standing still (or holding ←) blocks highs and mids; crouching (↓ / ↙) blocks lows. Highs whiff over crouching fighters.
- **3D movement**: the arena is a circle and the camera orbits with the fight. Tap ↑ or ↓ (or L1) to **sidestep**:
  linear attacks miss, while homing moves (b+4 spinning heel, sweeps) track you. Hold L1 to **sidewalk**.
- **Dash & run** with → →, and **Korean backdash** with ← ← ← … Run + 2 is a wall-splatting dash punch.
- **Strings**: 1,1,2 · 2,1 · 3,4 (screw) · 4,4 · d/f+1,2.
- **Launchers**: d/f+2, u/f+4 and WS 2 (release ↓ then 2) pop the opponent into a floaty **juggle**. Follow up before they
  land; screw moves extend the combo.
- **Walls**: heavy hits near the arena edge cause a **wall splat**, a free follow-up.
- **Ground game**: press any attack as you land to **tech roll**, or any input to get up. Some lows hit grounded fighters.
- **Heat**: landing and taking hits fills your Heat gauge. Full Heat + R2 fires your **Heat Smash**.
- **Rage**: below 25% health you glow red and can fire your Heat Smash once as a **Rage Art**, even with an empty gauge.
- Every fighter keeps their unique **3 specials, Heat Smash and passive** on top of the shared Tekken command list.

## Real faces

By default the game loads each MK's **freely licensed lead photo from Wikipedia** (CC BY / CC BY-SA / public domain only)
in your browser. MediaPipe Face Mesh reconstructs a **468-point 3D face** from the photo. That face is wrapped onto a sculpted
skull with fitted hair, ears and headwear, and the body's skin tone is sampled from the photo. The first visit downloads
the face models (~10 MB) and scans all 40 faces once. The results are cached in your browser, so later visits load instantly. Photo credits are in
**Main menu → Credits**. **Main menu → Faces** lets you fix any crop, upload your own photo (kept in your browser only),
or switch a single MK back to the cartoon. **Options → Faces → Cartoon** turns photos off entirely. Offline, the game falls back
to procedural caricatures.

## Features

- **40 playable MKs** across 13 parties, each with a 3D photo-scanned face, fitted hair, beards, kippot, hats, glasses, and a tailored suit or outfit with party pin
- **Graphics**: physically based materials with image-based lighting per stage, a skinned one-piece body mesh with
  painted and normal-mapped cloth (suit weave, lapels, ties, creased trousers), soft shadows, ambient occlusion, HDR bloom, colour grading,
  and hit-flash/chromatic pulses. **Options → Graphics Quality** has Ultra / High / Low, and the game steps down automatically if the frame rate drops
- **Personas**: every MK has a fighting stance (boxer, karate, wrestler, brawler, long guard, MMA, statesman) and their own intro and
  victory gestures (podium speech, salute, phone call, arms crossed, victory V…) with hand poses
- **3 specials + Heat Smash + passive per fighter**, built from 18 special archetypes (projectiles, lobs, beams, rushes,
  invincible uppercuts, command grabs, counters, teleports, traps, ground waves, dive kicks, slams, rains, shields, reflectors,
  buffs, heals, pulls) and 5 Heat Smash types, including cinematic multi-hit supers with camera work
- **Tekken-style 3D engine**: fixed 60 Hz deterministic sim on a circular 3D arena; facing and turn rates, with linear vs
  homing attacks judged by lateral hitbox width; startup/active/recovery frame data; hitstop; strings and special/super cancels;
  launchers, floaty juggles, screws, wall splats, tech rolls; Tekken guard (high/mid/low); throws and throw breaks;
  counter-hits and crumples; armor; invincibility; projectile clashes; Rage and Rage Arts
- **Animation**: spring-driven joints for snap and follow-through, two-bone leg IK with planted feet and a stepping gait,
  and hit reactions that snap the head back on highs and fold the body on mids
- **Modes**: Arcade (7 MKs plus a final boss, with continues and an ending), Versus (local 2P), Training (dummy settings, hitboxes, input display),
  CPU vs CPU
- **CPU AI** with 5 difficulty levels (*Backbencher* to *Supreme Court*): guards, ducks highs, sidesteps linear moves,
  punishes on block, launches and juggles, tech rolls, and uses each character's kit
- **6 360° stages** with walls: The Plenum, Menorah Plaza, Finance Committee, Tel Aviv Beach, Mahane Yehuda, Azrieli Rooftop.
  Scenery between the camera and the fighters is cut away automatically
- **Procedural audio**: synthesized hit and whoosh SFX, a per-stage music sequencer, and a speech-synth announcer ("Round one… Fight!")
- Full move list for every fighter, controller remapping, rumble, and options saved locally

## The roster

| # | Fighter | Party | Style | Specials (S1 · S2 · S3) | Heat Smash | Passive |
|---|---|---|---|---|---|---|
| 1 | **Benjamin Netanyahu** (בנימין נתניהו) | Likud | Technician | Red Line Bomb · Coalition Shuffle · Iron Dome | Sixth Term | Political Survivor |
| 2 | **Yariv Levin** (יריב לוין) | Likud | Zoner | Judicial Gavel · Reasonableness Clause · Committee Selection | The Overhaul | Override Clause |
| 3 | **Israel Katz** (ישראל כ"ץ) | Likud | Brawler | Light Rail Line · Express Train · Interchange Uppercut | National Infrastructure Plan | Heavyweight |
| 4 | **Amir Ohana** (אמיר אוחנה) | Likud | Technician | Order! Order! · Removal From the Plenum · Session Adjourned | Emergency Session | Speaker's Privilege |
| 5 | **Miri Regev** (מירי רגב) | Likud | Rushdown | Traffic Jam · Highway Rush · Red Carpet Spin | Grand Opening Ceremony | Culture War |
| 6 | **David Amsalem** (דוד אמסלם) | Likud | Brawler | Sonic Rant · Plenum Stomp · Table Flip | Ultimate Shouting Match | Thick Skull |
| 7 | **Nir Barkat** (ניר ברקת) | Likud | All-rounder | Startup Pitch · Angel Investor Dive · Market Rally | Unicorn Valuation | Deep Pockets |
| 8 | **Tally Gotliv** (טלי גוטליב) | Likud | Rushdown | Legal Brief · Cross-Examination · Objection! | Closing Argument | Sustained! |
| 9 | **Shlomo Karhi** (שלמה קרעי) | Likud | Zoner | Broadcast Signal · Pull the Plug · 5G Tower | Media Reform | Frequency Auction |
| 10 | **May Golan** (מאי גולן) | Likud | Rushdown | Hot Take · Spotlight Dash · Headline Kick | Viral Moment | Fast Track |
| 11 | **Yuli Edelstein** (יולי אדלשטיין) | Likud | Technician | Booster Shot · Speaker's Chair Drop · Green Pass | Mass Vaccination Drive | Refusenik |
| 12 | **Gideon Sa'ar** (גדעון סער) | Likud | Zoner | Diplomatic Cable · Party Merger · Return Flight | Summit Meeting | New Hope |
| 13 | **Avi Dichter** (אבי דיכטר) | Likud | Technician | Tomato Toss · Covert Op · Harvest Sweep | Agricultural Reform | Shin Bet Training |
| 14 | **Idit Silman** (עידית סילמן) | Likud | All-rounder | Recycling Bin · Crossing the Floor · Green Shield | Coalition Collapse | Sustainable |
| 15 | **Ofir Katz** (אופיר כץ) | Likud | Rushdown | The Whip · Emergency Vote · Party Discipline | Coalition Lockdown | Three-Line Whip |
| 16 | **Yoav Kisch** (יואב קיש) | Likud | Rushdown | Paper Airplane · Dive Bomb · Report Card | Final Exam | Top Gun |
| 17 | **Yair Lapid** (יאיר לפיד) | Yesh Atid | Rushdown | Breaking News · Anchorman Combo · Rotation Agreement | There Is A Future | Prime Time |
| 18 | **Merav Ben-Ari** (מירב בן ארי) | Yesh Atid | Technician | Parliamentary Question · Spin Kick Motion · Point of Clarification | Motion to the Agenda | Follow-up Question |
| 19 | **Benny Gantz** (בני גנץ) | National Unity | All-rounder | Paratrooper Drop · Blue & White Charge · Unity Guard | Joint Operation | Chief of Staff |
| 20 | **Gadi Eisenkot** (גדי איזנקוט) | Yashar! | Technician | Battle Plan · Flanking Maneuver · Straight Talk | Chief's Directive | Strategist |
| 21 | **Chili Tropper** (חילי טרופר) | National Unity | All-rounder | Chalk Toss · Sports Tackle · Culture Kick | Final Whistle | Team Player |
| 22 | **Pnina Tamano-Shata** (פנינה תמנו-שטה) | National Unity | Rushdown | Aliyah Flight · Integration Drive · Glass Ceiling Breaker | Trailblazer | First Through the Door |
| 23 | **Aryeh Deri** (אריה דרעי) | Shas | Technician | Coalition Demands · Budget Allocation · Veteran's Maneuver | The Kingmaker | The Comeback |
| 24 | **Michael Malchieli** (מיכאל מלכיאלי) | Shas | Grappler | Ministry Memo · Bureaucratic Hold · Ascending Motion | Ministerial Decree | Steady Hand |
| 25 | **Moshe Gafni** (משה גפני) | United Torah Judaism | Zoner | Funding Freeze · Committee Veto · Budget Cut | Final Budget Vote | Finance Committee |
| 26 | **Yitzhak Goldknopf** (יצחק גולדקנופף) | United Torah Judaism | Grappler | Brick Toss · Cornerstone Slam · Housing Tender | Housing Boom | Reinforced Concrete |
| 27 | **Bezalel Smotrich** (בצלאל סמוטריץ') | Religious Zionism | Zoner | Tax Hike · Treasury Lock · Fiscal Surge | State Budget | Treasury Keys |
| 28 | **Simcha Rothman** (שמחה רוטמן) | Religious Zionism | Zoner | Draft Bill · Committee Hearing · Second Reading | Third Reading | Fine Print |
| 29 | **Orit Strook** (אורית סטרוק) | Religious Zionism | Technician | Mission Statement · National Mission · Unyielding | Ministry Takeover | Hardliner |
| 30 | **Itamar Ben-Gvir** (איתמר בן גביר) | Otzma Yehudit | Brawler | Siren Blast · Police Reform · Resign & Return | National Guard | Comeback Tour |
| 31 | **Zvika Fogel** (צביקה פוגל) | Otzma Yehudit | Brawler | Artillery Call · Tank Charge · Reserve Duty | Full Mobilization | Old General |
| 32 | **Avi Maoz** (אבי מעוז) | Noam | Zoner | Pamphlet Barrage · One-Man Faction · Agenda Push | Single Seat, Full Volume | Lone Seat |
| 33 | **Avigdor Lieberman** (אביגדור ליברמן) | Yisrael Beiteinu | Grappler | Bouncer's Grip · Iron Fist · Political Earthquake | You're Not on the List | Bouncer |
| 34 | **Oded Forer** (עודד פורר) | Yisrael Beiteinu | All-rounder | Watermelon Lob · Committee Chair · Rising Question | Commission of Inquiry | Loyal Lieutenant |
| 35 | **Mansour Abbas** (מנסור עבאס) | Ra'am | Technician | Root Canal · Drill Rush · Bridge Builder | Painless Extraction | Kingmaker |
| 36 | **Ayman Odeh** (איימן עודה) | Hadash–Ta'al | Zoner | Megaphone · Protest March · Rising Voice | Mass Rally | Orator |
| 37 | **Ahmad Tibi** (אחמד טיבי) | Hadash–Ta'al | Technician | One-Liner · Witty Retort · Doctor's Orders | Standing Ovation | Sharpest Wit |
| 38 | **Aida Touma-Sliman** (עאידה תומא-סלימאן) | Hadash–Ta'al | All-rounder | Petition Storm · Equal Rights Rush · Status Check | Women's March | Seasoned Activist |
| 39 | **Gilad Kariv** (גלעד קריב) | The Democrats | Technician | Amendment · Parliamentary Question · Reform Rising | Constitutional Crisis | Legislator |
| 40 | **Naama Lazimi** (נעמה לזימי) | The Democrats | Rushdown | Protest Sign · Kaplan March · Social Justice Kick | Mass Protest | Grassroots |

## Project layout

```
src/
  game/      Pure-TypeScript fighting engine (no rendering): 3D fighter state machine, Tekken move list
             and frame data, specials builder, projectiles, hit resolution, round flow, CPU AI
  data/      Roster (40 characters), parties, stages. Edit these to tweak the game.
  render/    Three.js: procedural character rigs, spring + leg-IK animation, props, 360° stages,
             particles, orbiting fight camera, portrait renderer, photo faces
  core/      Input (keyboard + Gamepad API / DualSense), WebAudio synth + music, settings
  ui/        Screens (title, menus, character/stage select, VS, fight + HUD, results, arcade, move list, controls, options)
electron/    Desktop shell
tests/       Headless engine tests: every special for all 40 fighters, Tekken mechanics (guard, sidestep vs homing,
             launch → juggle, wall splat, tech roll, camera axis), full CPU matches, DualSense mapping
```

```bash
npm run typecheck && npm test && npm run build   # or: npm run check
```

### Adding or editing a fighter

Everything about a character lives in one object in `src/data/roster.ts`: `look` for the model, `stats`, `style`,
`specials` (pick any archetype and tune `damage`, `hits`, `speed`, `prop` and `effect`), `ultimate`, `passive` and `quotes`.
The tests automatically exercise every special and ultimate for every fighter.
