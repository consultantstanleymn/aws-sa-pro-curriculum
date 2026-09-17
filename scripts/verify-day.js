// Usage: node scripts/verify-day.js <dayNum>
// Exits 0 and prints PASS, or exits 1 and prints FAIL + reasons.
const fs = require('fs');
const path = require('path');
const days = require('../data/days.json');

const n = parseInt(process.argv[2], 10);
const d = days.find(x => x.day === n);
if (!d) { console.log('FAIL: unknown day', n); process.exit(1); }
const pad = String(n).padStart(3, '0');
const file = path.join(__dirname, '..', 'days', `day-${pad}.html`);
if (!fs.existsSync(file)) { console.log('FAIL: file missing', file); process.exit(1); }
const s = fs.readFileSync(file, 'utf8');

const expectedQuiz = { A: 15, B: 25, C: 75, D: 15 }[d.archetype];
const reasons = [];

// quiz count
const scenarioCards = (s.match(/class="scenario-card"/g) || []).length;
if (scenarioCards !== expectedQuiz) reasons.push(`quiz count ${scenarioCards} != expected ${expectedQuiz}`);

const revealIds = new Set((s.match(new RegExp(`revealAnswer\\('d${n}q(\\d+)'`, 'g')) || []).map(m => m));
if (revealIds.size !== expectedQuiz) reasons.push(`unique revealAnswer ids ${revealIds.size} != ${expectedQuiz}`);

const optsIds = (s.match(new RegExp(`id="opts-d${n}q\\d+"`, 'g')) || []).length;
const expIds = (s.match(new RegExp(`id="exp-d${n}q\\d+"`, 'g')) || []).length;
if (optsIds !== expectedQuiz) reasons.push(`opts ids ${optsIds} != ${expectedQuiz}`);
if (expIds !== expectedQuiz) reasons.push(`exp ids ${expIds} != ${expectedQuiz}`);

// nav links preserved
const navLinks = (s.match(/data-day=/g) || []).length;
if (navLinks !== 70) reasons.push(`nav links ${navLinks} != 70`);

// tracker / day-nav preserved
if (!s.includes(`renderTracker('tracker', ${n})`)) reasons.push('renderTracker call missing/wrong');
const nextFile = n < 70 ? `day-${String(n + 1).padStart(3, '0')}.html` : null;
if (n < 70 && !s.includes(`markComplete(${n}, '${nextFile}')`)) reasons.push('markComplete call missing/wrong');

// recap/preview presence rules
if (n !== 1 && !s.includes('id="recap"')) reasons.push('missing id="recap"');
if (n !== 70 && !s.includes('id="preview"')) reasons.push('missing id="preview"');

// banned phrases
const banned = [
  "yesterday we explored", "in today's lesson", "tomorrow we'll dive into",
  "let's get started", "by the end of this day", "in this section, we will"
];
const lower = s.toLowerCase();
for (const b of banned) if (lower.includes(b)) reasons.push(`banned phrase: "${b}"`);

// tag balance (rough)
const secOpen = (s.match(/<section /g) || []).length;
const secClose = (s.match(/<\/section>/g) || []).length;
if (secOpen !== secClose) reasons.push(`section tags unbalanced ${secOpen}/${secClose}`);
const divOpen = (s.match(/<div/g) || []).length;
const divClose = (s.match(/<\/div>/g) || []).length;
if (divOpen !== divClose) reasons.push(`div tags unbalanced ${divOpen}/${divClose}`);

// word count sanity (rough floor, not ceiling)
const wordCount = s.split(/\s+/).length;
const floor = { A: 4000, B: 2500, C: 6000, D: 2500 }[d.archetype];
if (wordCount < floor) reasons.push(`word count ${wordCount} suspiciously low (floor ${floor})`);

if (reasons.length) {
  console.log(`FAIL day ${n}:`, reasons.join('; '));
  process.exit(1);
} else {
  console.log(`PASS day ${n} (archetype ${d.archetype}, ${wordCount} words, ${scenarioCards} questions)`);
  process.exit(0);
}
