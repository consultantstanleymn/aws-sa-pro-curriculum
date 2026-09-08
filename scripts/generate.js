// Generates days/day-XXX.html for every entry in data/days.json (except day 56, hand-authored),
// and regenerates the day-by-day table + JS nav list fragments used by index.html.
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const days = require(path.join(ROOT, 'data', 'days.json'));

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function pad(n) { return String(n).padStart(3, '0'); }

function questionsHtml(dayNum, qs) {
  if (!qs || !qs.length) {
    return `<p style="color:var(--text-muted);font-style:italic;">Detailed scenario questions for this day will be added when the curriculum reaches it — see the <a href="day-056.html">Day 56 DMS lesson</a> for the full format this site is building toward.</p>`;
  }
  return qs.map((q, i) => {
    const id = `d${dayNum}q${i}`;
    const opts = q.options.map((o, oi) =>
      `<div class="scenario-option">${String.fromCharCode(65 + oi)}. ${esc(o)}</div>`
    ).join('\n            ');
    return `
      <div class="scenario-card">
        <p class="scenario-question"><strong>Q${i + 1}.</strong> ${esc(q.q)}</p>
        <div class="scenario-options" id="opts-${id}">
            ${opts}
        </div>
        <button class="scenario-reveal-btn" onclick="revealAnswer('${id}', ${q.correct})">Reveal Answer</button>
        <div class="scenario-explanation" id="exp-${id}"><strong>Correct answer: ${String.fromCharCode(65 + q.correct)}.</strong> ${esc(q.explanation)}</div>
      </div>`;
  }).join('\n');
}

function dayTemplate(d, prev, next) {
  const services = d.services.map(s => `<span class="service-tag">${esc(s)}</span>`).join('\n        ');
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Day ${d.day}: ${esc(d.title)} — AWS SA Pro Curriculum</title>
<link rel="stylesheet" href="../assets/style.css">
</head>
<body>
<header class="topbar">
  <div class="brand-group">
    <a href="../index.html" class="brand-logo">AWS SA PRO</a>
    <div class="brand-title">Day ${d.day} of 70 &middot; Week ${d.week}</div>
  </div>
  <button class="mobile-nav-toggle" onclick="toggleTopLinks()">Menu</button>
  <div class="top-links">
    <a href="../index.html">&larr; Full Curriculum</a>
    <a href="https://github.com/consultantstanleymn/aws-sa-pro-curriculum" target="_blank">GitHub &rarr;</a>
  </div>
</header>
<div class="app-container">
  <button class="sidebar-toggle btn btn-outline" onclick="toggleSidebar()" style="margin:12px 16px;">Browse all 70 days</button>
  <aside class="sidebar" id="sidebar">
    <div class="search-box"><input type="text" id="navSearch" class="search-input" placeholder="Search days..." onkeyup="filterNav()"></div>
    <div class="nav-section">
      <div class="nav-section-title">All Days</div>
      ${days.map(x => `<a href="day-${pad(x.day)}.html" class="nav-link" data-day="${x.day}">Day ${x.day}: ${esc(x.title)}</a>`).join('\n      ')}
    </div>
  </aside>
  <main class="main-viewport">
    <div class="content-wrapper">
      <div class="day-meta">
        <span class="pill pill-orange">Day ${d.day} / 70</span>
        <span class="pill pill-blue">Week ${d.week} of 14</span>
        <span class="pill pill-green">${esc(d.phase)}</span>
      </div>
      <h1 class="hero-title">${esc(d.title)}</h1>
      <div class="services-grid">
        ${services}
      </div>
      <div id="tracker"></div>
      <section class="doc-section">
        <h2 class="section-heading">Today's Concept</h2>
        <div class="card card-accent">
          <p>${esc(d.summary)}</p>
        </div>
        <h3 class="sub-heading">Hands-on Lab / Practical Action (45 min)</h3>
        <div class="card">
          <p>${esc(d.lab)}</p>
        </div>
      </section>
      <section class="doc-section">
        <h2 class="section-heading">Scenario Question Drills (20 min)</h2>
        ${questionsHtml(d.day, d.questions)}
      </section>
      <div class="day-nav">
        ${prev ? `<a href="day-${pad(prev.day)}.html">&larr; Day ${prev.day}: ${esc(prev.title)}</a>` : '<span></span>'}
        <button class="btn btn-green" onclick="markComplete(${d.day}, '${next ? `day-${pad(next.day)}.html` : '../index.html'}')">Mark Day ${d.day} Complete &rarr;</button>
        ${next ? `<a href="day-${pad(next.day)}.html">Day ${next.day}: ${esc(next.title)} &rarr;</a>` : '<span></span>'}
      </div>
    </div>
  </main>
</div>
<script src="../assets/app.js"></script>
<script>renderTracker('tracker', ${d.day});</script>
</body>
</html>
`;
}

const daysDir = path.join(ROOT, 'days');
let written = 0;
for (let i = 0; i < days.length; i++) {
  const d = days[i];
  if (d.day === 56) continue; // hand-authored, richer page
  const prev = days[i - 1];
  const next = days[i + 1];
  fs.writeFileSync(path.join(daysDir, `day-${pad(d.day)}.html`), dayTemplate(d, prev, next));
  written++;
}
console.log(`Generated ${written} day pages (day 56 skipped — hand-authored).`);
