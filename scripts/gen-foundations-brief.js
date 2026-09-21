// Generates the brief for adding a "Foundations" section to an existing day page.
// Usage: node scripts/gen-foundations-brief.js <day>
const days = require('../data/days.json');
function pad(n) { return String(n).padStart(3, '0'); }

const n = parseInt(process.argv[2], 10);
const d = days.find(x => x.day === n);
if (!d) { console.error('unknown day', n); process.exit(1); }

console.log(`
## Day ${n}: ${d.title} — add a "Foundations" section
File: days/day-${pad(n)}.html (already fully written — you are ENRICHING it, not rewriting it)

The site owner is studying at AWS Cloud Practitioner level (foundational: high-level service
awareness, no hands-on architecture experience) rather than Associate level (SAA-C03: hands-on
VPC design, IAM policy JSON, EC2/networking fundamentals), and is working through this
Professional-level (SAP-C02) curriculum anyway. Every existing day currently assumes
Associate-level prerequisite knowledge without explaining it — e.g. it might casually reference
"the route table," "a security group," "an IAM role's trust policy," or "CIDR blocks" as if the
reader already knows exactly what those are and how they work.

YOUR TASK: read the existing days/day-${pad(n)}.html in full. Identify every prerequisite
concept THIS SPECIFIC DAY leans on that a Cloud Practitioner-level reader would not already
know cold (do not guess generically — base this on what the existing prose in this file
actually assumes). Then insert ONE new section, placed immediately after the existing
id="recap" section (or, on Day 1 only, immediately after the hero content) and before the
first numbered body subsection:

\`\`\`html
<section class="doc-section" id="foundations">
  <h2 class="section-heading">Foundations You'll Need Today</h2>
  <div class="card card-sre">
    ... your content ...
  </div>
</section>
\`\`\`

Content rules:
- Cover 2-5 prerequisite concepts, whichever this specific day actually needs — not a fixed
  count. If the day is genuinely self-contained (rare), 1 is fine; don't pad.
- Each concept gets its own short sub-explanation: a couple of plain-language sentences,
  building from "what problem does this solve" rather than jargon-first definitions. Assume
  zero hands-on experience but reasonable general-tech literacy (the reader knows what a
  server, a network, and a database are in the abstract).
- Use <h3 class="sub-heading"> per concept if there are 3+, otherwise plain paragraphs are fine
  for 1-2 concepts.
- Prose first, same rule as the rest of the site: real sentences building an explanation, not
  bullet-point glossary entries. A short list is fine only if it's genuinely a list (e.g.
  enumerating the parts of a VPC), not a way to avoid writing paragraphs.
- End with one sentence explicitly bridging to today's topic — e.g. "With that grounding,
  here's why Transit Gateway exists and what problem it actually solves."
- Do NOT modify, shorten, or renumber any existing section. Do NOT change the numbered
  headings (e.g. "1. Why This Is On The Exam") even though a new unnumbered section now
  precedes them structurally.
- If this file's sidebar has an "On This Page" ToC list (most don't — only Day 56 currently
  does), add a corresponding "Foundations" link to it in the correct position (after "Recap",
  before the first numbered section link). If there's no such ToC, don't add one — just skip
  this step, it's a separate pre-existing gap, not something to fix here.
- Use only existing CSS classes (card, card-sre, section-heading, sub-heading, doc-section) —
  do not invent new ones or touch assets/style.css.
- Do not touch the quiz, lab, preview, sources, or any other existing section's content.
`);
