# Street Knesset Fighter · סטריט כנסת פייטר

A 3D, Street Fighter / Tekken-style **satirical fighting game** starring **40 members of the Knesset**.
Each MK has their own procedurally modelled caricature, fighting style, **3 unique special moves**, an **Ultimate**,
and a **passive special ability**. It runs on PC in Chrome or Edge, or as a desktop app, and supports **PS5 DualSense controllers**
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
It uploads a ready-to-run `Street Knesset Fighter` portable `.exe` as an artifact.

## PS5 DualSense setup

1. Connect the controller with **USB-C**, or pair over **Bluetooth**: hold **PS + Create** until the light bar flashes,
   then add it in Windows *Settings → Bluetooth & devices*.
2. Start the game and **press any button**. The first controller becomes Player 1 and the second becomes Player 2.
3. Chrome, Edge and the desktop app read the DualSense natively with the standard mapping, and **rumble works**.
   Firefox exposes a raw layout that is auto-detected. If a button feels wrong, use **Controls → Remap**.

| DualSense | Action | Keyboard P1 | Keyboard P2 |
|---|---|---|---|
| D-pad / Left stick | Move, jump (↑), crouch (↓), block (hold ←) | W A S D | Arrow keys |
| □ Square | Light Punch | U | Num 4 / Insert |
| △ Triangle | Heavy Punch | I | Num 5 / Home |
| ✕ Cross | Light Kick (menus: confirm) | J | Num 1 / Delete |
| ○ Circle | Heavy Kick (menus: back) | K | Num 2 / End |
| R1 | **Special** (neutral / → / ↓ picks Special 1 / 2 / 3) | O | Num 6 / PgUp |
| R2 | **Ultimate** (full meter) | L | Num 3 / PgDn |
| L2 | Throw | H | Num 0 |
| L1 | Tekken-style sidestep | Space | Num . / Right Shift |
| Options | Pause | Esc / Enter | Num Enter |
| Create | Reset positions (training) | Backspace | Num − |

**Classic motion inputs work too:** `↓↘→ + P` = Special 1, `↓↙← + K` = Special 2, `→↓↘ + P` = Special 3,
`↓↘→↓↘→ + P` = Ultimate. Light and heavy buttons give weaker, faster versions or stronger, farther ones.

## Features

- **40 playable MKs** across 13 parties, each with a unique procedural 3D caricature (hair, beards, kippot, hats, glasses, suits, party pin)
- **3 specials + Ultimate + passive per fighter**, built from 18 special archetypes (projectiles, lobs, beams, rushes,
  invincible uppercuts, command grabs, counters, teleports, traps, ground waves, dive kicks, slams, rains, shields, reflectors,
  buffs, heals, pulls) and 5 Ultimate types, including cinematic multi-hit supers with camera work
- **Real fighting-game engine**: fixed 60 Hz deterministic sim; startup/active/recovery frame data; hitstop; chains and special/super cancels;
  combo scaling; juggles; high/low/overhead blocking; chip damage; throws and throw techs; counter-hits; armor; invincibility;
  knockdowns and wake-up; projectile clashes; corner pushback; Tekken-style sidestep
- **Modes**: Arcade (7 MKs plus a final boss, with continues and an ending), Versus (local 2P), Training (dummy settings, hitboxes, input display),
  CPU vs CPU
- **CPU AI** with 5 difficulty levels (*Backbencher* to *Supreme Court*): blocks, anti-airs, hit-confirms and uses each character's kit sensibly
- **6 stages**: The Plenum, Menorah Plaza, Finance Committee, Tel Aviv Beach, Mahane Yehuda, Azrieli Rooftop
- **Procedural audio**: synthesized hit and whoosh SFX, a per-stage music sequencer, and a speech-synth announcer ("Round one… Fight!")
- Full move list for every fighter, controller remapping, rumble, options saved locally, and a Low graphics mode for integrated GPUs

## The roster

| # | Fighter | Party | Style | Specials (S1 · S2 · S3) | Ultimate | Passive |
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
  game/      Pure-TypeScript fighting engine (no rendering): fighter state machine, frame data,
             specials builder, projectiles, hit resolution, round flow, CPU AI
  data/      Roster (40 characters), parties, stages. Edit these to tweak the game.
  render/    Three.js: procedural character rigs, frame-driven pose animation, props, stages,
             particles, camera direction, portrait renderer
  core/      Input (keyboard + Gamepad API / DualSense), WebAudio synth + music, settings
  ui/        Screens (title, menus, character/stage select, VS, fight + HUD, results, arcade, move list, controls, options)
electron/    Desktop shell
tests/       Headless engine tests: every special for all 40 fighters, full CPU matches, DualSense mapping
```

```bash
npm run typecheck && npm test && npm run build   # or: npm run check
```

### Adding or editing a fighter

Everything about a character lives in one object in `src/data/roster.ts`: `look` for the model, `stats`, `style`,
`specials` (pick any archetype and tune `damage`, `hits`, `speed`, `prop` and `effect`), `ultimate`, `passive` and `quotes`.
The tests automatically exercise every special and ultimate for every fighter.
