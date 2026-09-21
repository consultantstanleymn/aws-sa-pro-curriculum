// Usage: node scripts/verify-foundations.js <dayNum>
const fs = require('fs');
const path = require('path');

const n = parseInt(process.argv[2], 10);
const pad = String(n).padStart(3, '0');
const file = path.join(__dirname, '..', 'days', `day-${pad}.html`);
if (!fs.existsSync(file)) { console.log('FAIL: file missing', file); process.exit(1); }
const s = fs.readFileSync(file, 'utf8');
const reasons = [];

if (!s.includes('id="foundations"')) reasons.push('missing id="foundations" section');
const hasToc = /On This Page/.test(s);
if (hasToc && !/href="#foundations"/.test(s)) reasons.push('has a ToC but missing link to #foundations');

// existing structural invariants must still hold — reuse the same checks as verify-day.js
const expectedQuizByArchetype = { A: 15, B: 25, C: 75, D: 15 };
const days = require('../data/days.json');
const d = days.find(x => x.day === n);
const expectedQuiz = expectedQuizByArchetype[d.archetype];
const scenarioCards = (s.match(/class="scenario-card"/g) || []).length;
if (scenarioCards !== expectedQuiz) reasons.push(`quiz count ${scenarioCards} != expected ${expectedQuiz} (existing quiz got disturbed)`);

const navLinks = (s.match(/data-day=/g) || []).length;
if (navLinks !== 70) reasons.push(`nav links ${navLinks} != 70`);

if (!s.includes(`renderTracker('tracker', ${n})`)) reasons.push('renderTracker call missing/wrong');

const secOpen = (s.match(/<section /g) || []).length;
const secClose = (s.match(/<\/section>/g) || []).length;
if (secOpen !== secClose) reasons.push(`section tags unbalanced ${secOpen}/${secClose}`);
const divOpen = (s.match(/<div/g) || []).length;
const divClose = (s.match(/<\/div>/g) || []).length;
if (divOpen !== divClose) reasons.push(`div tags unbalanced ${divOpen}/${divClose}`);

if (reasons.length) {
  console.log(`FAIL day ${n}:`, reasons.join('; '));
  process.exit(1);
} else {
  const wordCount = s.split(/\s+/).length;
  console.log(`PASS day ${n} (${wordCount} words total now)`);
  process.exit(0);
}
