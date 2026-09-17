// Generates a per-day content brief for archetype A/B/C/D rewrites.
// Usage: node scripts/gen-day-brief.js <day1> [day2] [day3] ...
// Prints a combined brief for all requested days to stdout.
const days = require('../data/days.json');
const ledger = require('../data/continuity-ledger.json');

function pad(n) { return String(n).padStart(3, '0'); }
function getDay(n) { return days.find(d => d.day === n); }
function getLedger(n) { return ledger.find(d => d.day === n); }

function relationSentence(rel) {
  const map = {
    'none': null,
    'extends': 'extends directly',
    'contrasts with': 'contrasts with',
    'was a prerequisite for': 'was a direct prerequisite for',
    'same trap different service': 'sets up the same kind of trap in a different service',
    'same service opposite failure mode': 'involves the same service family but the opposite failure mode',
    'same lifecycle stage different concern': 'sits at the same point in the lifecycle but a different concern',
    'synthesis': 'is synthesized by',
  };
  return map[rel] || rel;
}

function archetypeABrief(d, led, prevLed, nextLed) {
  const isPhaseClose = (led.thread || '').startsWith('PHASE-CLOSE:');
  const isPhaseOpen = (led.thread || '').startsWith('PHASE-OPEN:');
  let recapInstructions;
  if (d.day === 1) {
    recapInstructions = `**No recap section** — Day 1 has no previous day. Instead open with a short (150-200 word) "Welcome" note (card card-accent, id="welcome") on how to use this curriculum: one topic a day, recap/body/preview structure, ~1hr per day, don't skip the quiz.`;
  } else {
    recapInstructions = `**Recap of yesterday** (id="recap", card card-accent, 150-200 words prose, no bullets): Day ${d.day - 1} was "${getDay(d.day - 1).title}". Its takeaway: "${prevLed.takeaway}" Name at least one of these specific hooks from that day: ${prevLed.hooks.map(h => `"${h}"`).join(', ')}. State an explicit relationship to today using this relation type: **${led.relation}**${relationSentence(led.relation) ? ` (i.e. today ${relationSentence(led.relation)} yesterday's material)` : ''}.${isPhaseOpen ? ' This is a PHASE-OPEN day — briefly frame how the whole previous phase set up this new phase, not just the single prior day.' : ''}`;
  }
  let previewInstructions;
  if (d.day === 70) {
    previewInstructions = `**No "peek into tomorrow"** — Day 70 is the last day. Instead close with a short (150-200 word) exam-day send-off (card card-purple, id="send-off").`;
  } else {
    const nextDay = getDay(d.day + 1);
    previewInstructions = `**Peek into tomorrow** (id="preview", card card-purple, 150-200 words prose, no bullets): Day ${d.day + 1} is "${nextDay.title}". Its takeaway: "${nextLed.takeaway}" Raise a genuine open question today's content leaves unresolved that tomorrow's topic answers — ground it in one of these concrete hooks from tomorrow: ${nextLed.hooks.map(h => `"${h}"`).join(', ')}. Not a table-of-contents sentence.${isPhaseClose ? ' This is a PHASE-CLOSE day — look back over the whole phase you just finished, then frame the premise of the next phase, not just tomorrow\'s single topic.' : ''}`;
  }
  return `
## Day ${d.day}: ${d.title}  [archetype A — service/pattern deep dive]
File: days/day-${pad(d.day)}.html — quiz ID prefix: d${d.day}q
Week ${d.week}, ${d.phase}. Services: ${d.services.join(', ')}.
Existing thin summary (for reference/accuracy baseline, expand far beyond this): "${d.summary}"
Existing lab prompt (for reference, expand into a full ~500-600 word lab): "${d.lab}"

${recapInstructions}

**Nine body subsections** (500-600 words each, id them sensibly in kebab-case, use the section-heading numbering 1-9): apply the nine-job list from the style guide (why-on-exam, mechanism, core-decision-boundary, config-tradeoffs, sizing-limits, failure-modes, sre-angle, gotchas, vs-comparison) to ${d.title}, renaming headings to fit this topic's actual content. If this topic doesn't have a clean "core decision boundary" or "vs-comparison", substitute the nearest equivalent (e.g. a packet-path walkthrough, a scaling-trigger comparison) but keep nine distinct subsections.

**Hands-on lab** (id="lab", card card-green, ~500-600 words): build out the existing lab prompt into a full numbered lab.

**Scenario quiz** (id="quiz", exactly 15 questions, ids opts-d${d.day}q{1-15}/exp-d${d.day}q{1-15}): cover the breadth of the nine subsections above.

${previewInstructions}

**Sources** (id="sources", card, 6-10 real AWS doc / reputable cert-study links, no fabricated URLs).
`;
}

function archetypeBBrief(d, led, prevLed, nextLed) {
  return `
## Day ${d.day}: ${d.title}  [archetype B — synthesis / drill]
File: days/day-${pad(d.day)}.html — quiz ID prefix: d${d.day}q
Week ${d.week}, ${d.phase}. Services covered this week: ${d.services.join(', ')}.
This is a week-synthesis day, not a new-topic day. Less new exposition, more cross-service
decision matrices pulling together the week's material.
Ledger takeaway for this day: "${led.takeaway}"

**Recap** (id="recap", card card-accent, 150-200 words): look back across the WHOLE WEEK
just finished (days ${d.day - 6}-${d.day}), not just the single prior day. Reference at
least 2 specific hooks from the week if you can infer them from the title/services above.

**Body**: ~3,000 words total, structured as cross-service decision matrices and comparison
tables pulling together this week's services (${d.services.join(', ')}) — "when do you pick
X vs Y vs Z" framing, not a re-explanation of any single service. Use 3-5 named subsections,
each opening with 2+ paragraphs of prose before any table/list, same prose-ratio rule as
every other day.

**Mixed scenario quiz** (id="quiz", exactly 25 questions spanning the week's different
services, ids opts-d${d.day}q{1-25}/exp-d${d.day}q{1-25}).

**Preview** (id="preview", card card-purple, 150-200 words): Day ${d.day + 1} is "${getDay(d.day + 1).title}" — takeaway "${nextLed.takeaway}". Frame the shift from synthesis/review back into new material, or into the next phase if this is a phase boundary.

**Sources** (id="sources", card, 4-6 links relevant to the week's services).
`;
}

function archetypeCBrief(d, led, prevLed) {
  return `
## Day ${d.day}: ${d.title}  [archetype C — full-length mock exam sitting]
File: days/day-${pad(d.day)}.html — quiz ID prefix: d${d.day}q
This day's "reading" IS the exam. Keep prose minimal (~800 words total across recap +
sitting-protocol + preview) and put the bulk of the content into a full 75-question exam.

**Recap** (id="recap", card card-accent, 120-150 words): brief note connecting from
yesterday ("${prevLed.takeaway}") into "today you test whether you can retrieve all of
that under time pressure."

**Sitting protocol** (id="protocol", card, ~500 words prose): real timed-exam conditions —
180 minutes, 75 questions (~2.4 min/question average budget), no pausing, no notes, flag-
and-review technique, do not check answers until the full 180 minutes are used or the exam
is complete. Explain why simulating real conditions (not stopping early, not looking things
up) matters for building genuine exam stamina and pacing instinct.

**The exam** (id="exam", exactly 75 scenario questions spanning the FULL curriculum so far
— multi-account governance, networking, compute, databases, SRE/observability, DR,
migration, cost optimization — NOT just recent days. Mix difficulty realistically: mostly
2-4 sentence scenarios, a few short direct-knowledge questions. ids opts-d${d.day}q{1-75}/exp-d${d.day}q{1-75}, revealAnswer('d${d.day}q{i}', {correctIndex}).
IMPORTANT: do NOT reveal-format these as a normal quiz block-by-block during the exam;
each question uses the same scenario-card/scenario-reveal-btn markup as every other day's
quiz (self-check is still per-question via Reveal Answer — this is a take-then-check
practice format, not a submit-all-at-once exam engine).

**Scoring guide** (id="scoring", card, ~150 words): how to compute a rough scaled score
from raw correct count, and what score threshold roughly maps to exam-ready (~72%+ raw is
a reasonable proxy threshold — state this as a rule of thumb, not an official AWS figure).

**Preview** (id="preview", card card-purple, 120-150 words): today's mock exam produces a
raw score and a list of missed domains; tomorrow (Day ${d.day + 1}) is "${getDay(d.day + 1) ? getDay(d.day + 1).title : ''}" which acts on that data directly.
`;
}

function archetypeDBrief(d, led, prevLed) {
  return `
## Day ${d.day}: ${d.title}  [archetype D — distractor analysis / deep review]
File: days/day-${pad(d.day)}.html — quiz ID prefix: d${d.day}q
Ledger takeaway: "${led.takeaway}"

**Recap** (id="recap", card card-accent, 150-200 words): connect from yesterday
("${prevLed.takeaway}", hooks: ${prevLed.hooks.map(h=>`"${h}"`).join(', ')}) using relation "${led.relation}".

**Body** (~3,500 words): structured as 12-18 short "pattern entries", NOT nine long
subsections. Each pattern entry: the tempting-but-wrong answer pattern, why it's tempting,
the specific tell that distinguishes it from the correct answer, and (if this is a
distractor-analysis day following a specific mock exam) how it likely showed up on that
mock. Use <h3 class="sub-heading"> per pattern entry, 150-250 words each, prose before any
list, same rules as every other day.

**Drill quiz** (id="quiz", exactly 15 questions built around the exact distractor patterns
just covered — deliberately include the tempting wrong answer as an option, ids
opts-d${d.day}q{1-15}/exp-d${d.day}q{1-15}).

**Preview** (id="preview", card card-purple, 150-200 words): Day ${d.day + 1} is "${getDay(d.day + 1) ? getDay(d.day + 1).title : '(final day)'}".

**Sources** (id="sources", card, 3-5 links).
`;
}

const nums = process.argv.slice(2).map(n => parseInt(n, 10));
let out = '';
for (const n of nums) {
  const d = getDay(n);
  const led = getLedger(n);
  const prevLed = n > 1 ? getLedger(n - 1) : null;
  const nextLed = n < 70 ? getLedger(n + 1) : null;
  if (d.archetype === 'A') out += archetypeABrief(d, led, prevLed, nextLed);
  else if (d.archetype === 'B') out += archetypeBBrief(d, led, prevLed, nextLed);
  else if (d.archetype === 'C') out += archetypeCBrief(d, led, prevLed);
  else if (d.archetype === 'D') out += archetypeDBrief(d, led, prevLed);
}
console.log(out);
