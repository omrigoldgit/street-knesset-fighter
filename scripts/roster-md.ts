// Prints the roster as a Markdown table (used for the README).
import { ROSTER } from '../src/data/roster';
import { PARTIES } from '../src/data/parties';
import { STYLE_INFO } from '../src/game/normals';

const rows = ROSTER.map((c, i) => {
  const sp = c.specials.map((s) => s.name).join(' · ');
  return `| ${i + 1} | **${c.name}** (${c.nameHe}) | ${PARTIES[c.party].name} | ${STYLE_INFO[c.style].split(':')[0]} | ${sp} | ${c.ultimate.name} | ${c.passive.name} |`;
});
console.log('| # | Fighter | Party | Style | Specials (S1 · S2 · S3) | Ultimate | Passive |');
console.log('|---|---|---|---|---|---|---|');
console.log(rows.join('\n'));
