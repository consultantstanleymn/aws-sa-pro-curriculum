# AWS Solutions Architect Professional (SAP-C02) & SRE Master Curriculum

Welcome to the comprehensive, self-paced 14-week study curriculum for the AWS Solutions Architect - Professional (SAP-C02) certification and AWS Site Reliability Engineering (SRE) / DevOps competencies.

## Live Study Portal
Access the fully styled, interactive documentation portal live at:
👉 **[http://stanley-n.com/aws-sa-pro-curriculum/](http://stanley-n.com/aws-sa-pro-curriculum/)**

*(This repo has its own GitHub Pages site, built automatically from `main` on every push — no separate mirror step. It previously lived at `stanley-n.com/sa-pro` as a folder inside [consultantstanleymn/consultantstanleymn.github.io](https://github.com/consultantstanleymn/consultantstanleymn.github.io), but was split out into this standalone repo; that portfolio repo now only holds the root portfolio site.)*

## Day-by-Day Study System
Every day of the 14-week / 70-day plan has its own hand-authored page at `days/day-NNN.html`: a recap tying back to the previous day, a full narrative lesson body, a hands-on lab, a scenario quiz, and a preview of the next day. All 70 days are flagged `"detailed": true` in `data/days.json`, which tells `scripts/generate.js` to leave them alone — the generator only fills in a thin placeholder page for a day that doesn't have that flag set yet (there currently aren't any).

Four content archetypes, assigned per day in `data/days.json`'s `archetype` field:
- **A** (51 days) — a full service/pattern deep dive: recap, nine narrative subsections, lab, 15-question quiz, preview, sources.
- **B** (5 days, the weekly syntheses) — cross-service decision matrices over the week just finished, 25-question mixed quiz.
- **C** (5 days, the full-length mock exams) — a sitting protocol plus a genuine 75-question timed practice exam and scoring guide.
- **D** (9 days, distractor analysis / deep review) — 12-18 short "tempting wrong answer / why it's tempting / the tell" pattern entries, 15-question drill.

Cross-day continuity (each day's recap/preview referencing specific, concrete details from its neighbors) is driven by `data/continuity-ledger.json` — a per-day takeaway, a handful of memorable hooks, a narrative thread name, and a recap relationship type, generated once so that days written independently still read as one connected story. `scripts/gen-day-brief.js` turns the ledger plus a day's `data/days.json` entry into that day's generation brief; `scripts/verify-day.js <day>` checks a rewritten day's structure (quiz wiring, nav/tracker preservation, banned boilerplate phrases, word-count floor) before it's trusted.

The homepage and every day page include a local progress tracker (`assets/app.js`, browser `localStorage` only — not shared across devices) defaulting to Day 1.

## Curriculum Architecture
* **Phase 1 (Weeks 1–3):** Multi-Account Governance, Control Tower, Service Control Policies (SCPs) & Advanced Hybrid Networking (Transit Gateway, Direct Connect, Route 53 Resolver, PrivateLink).
* **Phase 2 (Weeks 4–6):** High-Availability Compute (ECS Fargate/EKS), Event-Driven Architectures (EventBridge, SQS FIFO, SNS) & Databases (Aurora Global Database, DynamoDB Global Tables).
* **Phase 3 (Weeks 7–9):** SRE Reliability, Observability (CloudWatch Synthetics, X-Ray), Chaos Engineering (Fault Injection Simulator) & Multi-Region Disaster Recovery (RTO/RPO Patterns).
* **Phase 4 (Weeks 10–12):** Enterprise Migration (Application Migration Service, Database Migration Service, DataSync) & Hybrid Cloud Integration.
* **Phase 5 (Weeks 13–14):** Timed Mock Exam Drills, Distractor Analysis & Exam Technique.

## Offline / Local Usage
Clone this repository and open `index.html` in any web browser:
```bash
git clone https://github.com/consultantstanleymn/aws-sa-pro-curriculum.git
cd aws-sa-pro-curriculum
open index.html
```
