# Contributing

This is a community-editable 14-week / 70-day AWS Solutions Architect Professional (SAP-C02) study curriculum. Contributions of any size are welcome — fixing a wrong answer, expanding a thin day into a full lesson, adding a source link, or reporting something that's out of date.

## Ways to contribute

- **Discussions** — questions, study-group coordination, "is this still accurate," or general feedback: use the [Discussions tab](https://github.com/consultantstanleymn/aws-sa-pro-curriculum/discussions).
- **Wiki** — longer-form community notes, exam experience reports, and supplementary material that doesn't belong in a day page: use the [Wiki](https://github.com/consultantstanleymn/aws-sa-pro-curriculum/wiki).
- **Issues** — a concrete bug (wrong answer, broken link, outdated AWS behavior) or a specific content request.
- **Pull Requests** — direct edits. See below for how content is structured.

## How the site is structured

- `data/days.json` is the single source of truth for all 70 days (title, services, summary, hands-on lab, and scenario questions).
- `days/day-NNN.html` pages are generated from `data/days.json` via `scripts/generate.js` — **do not hand-edit a generated day page**; edit the JSON and regenerate:
  ```bash
  node scripts/generate.js
  ```
- `days/day-056.html` is the exception: it's hand-authored as the depth template every other day should eventually reach (full architecture writeup, decision tables, exam gotchas, sourced references, 15 scenario questions). If you want to bring another day up to that bar, hand-author it the same way and add `"detailed": true` to its `data/days.json` entry so the generator skips it.
- `assets/style.css` and `assets/app.js` are shared across every page — changes there affect the whole site.
- `index.html` is the homepage; its day-by-day table is generated from the same `data/days.json` — see `scripts/generate.js` for how the table markup is produced if you're regenerating it.

## Content guidelines

- Cite real, current AWS documentation or reputable certification study resources for anything factual — this is exam-prep content people are relying on, so accuracy matters more than polish.
- Keep the tone and format consistent with Day 56 (`days/day-056.html`) when expanding a day: overview → core concept sections → hands-on lab → scenario questions → sources.
- Scenario questions should mirror real SAP-C02 style: a multi-sentence scenario, 4 plausible options, one correct answer, and an explanation that says why the right answer is right *and* why the others are wrong.
- Run `node scripts/generate.js` before committing if you touched `data/days.json`, and include the regenerated `days/*.html` files in your PR.

## Local preview

This is a static site with no build step beyond the generator script — open `index.html` directly in a browser, or serve the folder with any static file server.
