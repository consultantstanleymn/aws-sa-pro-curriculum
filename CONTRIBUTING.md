# Contributing

This is a community-editable 14-week / 70-day AWS Solutions Architect Professional (SAP-C02) study curriculum. Contributions of any size are welcome — fixing a wrong answer, expanding a thin day into a full lesson, adding a source link, or reporting something that's out of date.

## Ways to contribute

- **Discussions** — questions, study-group coordination, "is this still accurate," or general feedback: use the [Discussions tab](https://github.com/consultantstanleymn/aws-sa-pro-curriculum/discussions).
- **Wiki** — longer-form community notes, exam experience reports, and supplementary material that doesn't belong in a day page: use the [Wiki](https://github.com/consultantstanleymn/aws-sa-pro-curriculum/wiki).
- **Issues** — a concrete bug (wrong answer, broken link, outdated AWS behavior) or a specific content request.
- **Pull Requests** — direct edits. See below for how content is structured.

## How the site is structured

- `data/days.json` is the source of truth for each day's metadata: title, services, week/phase, `archetype` (A/B/C/D — see below), and a short `summary`/`lab` pair used as an accuracy baseline, not the actual page content.
- `days/day-NNN.html` pages are hand-authored. All 70 currently have `"detailed": true` in `data/days.json`, which tells `scripts/generate.js` to leave them alone — **do not hand-edit a page and then run `node scripts/generate.js` expecting it to preserve your edits unless that day's entry has `"detailed": true` set.** The generator only exists now to scaffold a brand-new day that hasn't been hand-authored yet (any entry without `"detailed": true`).
- `data/continuity-ledger.json` holds a per-day takeaway, a few concrete "hooks," a narrative thread name, and a recap relationship type, used to keep each day's recap/preview grounded in its neighbors' actual content. Regenerate the affected rows with `scripts/gen-ledger.js` if you materially change a day's topic.
- `assets/style.css` and `assets/app.js` are shared across every page — changes there affect the whole site.
- `index.html` is the homepage; its day-by-day table is **hand-maintained**, not generated — update it directly if you add or retitle a day.

## Content guidelines

- Cite real, current AWS documentation or reputable certification study resources for anything factual — this is exam-prep content people are relying on, so accuracy matters more than polish.
- Match the day's archetype (see `data/days.json`'s `archetype` field): **A** is a full service deep dive (recap → nine narrative subsections → lab → 15-question quiz → preview → sources); **B** is a weekly synthesis (cross-service decision matrices, 25-question mixed quiz); **C** is a full 75-question timed mock exam; **D** is a distractor-analysis/review day (12-18 short pattern entries, 15-question drill). Day 56 (`days/day-056.html`) is a good reference example of archetype A's depth and tone.
- Prose over bullet-stacks: each body subsection should open with at least two full paragraphs of connected prose before any list; at most one list per subsection (tables are fine, they don't count against that limit).
- Scenario questions should mirror real SAP-C02 style: a multi-sentence scenario, 4 plausible options, one correct answer, and an explanation that says why the right answer is right *and* why the others are wrong.
- Quiz markup must use the existing `revealAnswer('d{day}q{i}', {correctIndex})` convention with matching `id="opts-d{day}q{i}"` / `id="exp-d{day}q{i}"` — `scripts/verify-day.js <day>` checks this (and nav/tracker preservation, banned boilerplate phrases, and a word-count floor) before you open a PR.

## Local preview

This is a static site with no build step beyond the generator script — open `index.html` directly in a browser, or serve the folder with any static file server.
