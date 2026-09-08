# AWS Solutions Architect Professional (SAP-C02) & SRE Master Curriculum

Welcome to the comprehensive, self-paced 14-week study curriculum for the AWS Solutions Architect - Professional (SAP-C02) certification and AWS Site Reliability Engineering (SRE) / DevOps competencies.

## Live Study Portal
Access the fully styled, interactive documentation portal live at:
👉 **[https://stanley-n.com/sa-pro](https://stanley-n.com/sa-pro)**

*(stanley-n.com's root is reserved for a separate portfolio site. This repo is the source of truth for the curriculum and is mirrored into the `/sa-pro/` folder of [consultantstanleymn/consultantstanleymn.github.io](https://github.com/consultantstanleymn/consultantstanleymn.github.io) — re-copy this repo's `index.html`, `assets/`, `days/`, and `data/` into that repo's `sa-pro/` folder whenever this repo is updated, then push.)*

## Day-by-Day Study System
Every day of the 14-week / 70-day plan has its own page at `days/day-NNN.html` — topic summary, hands-on lab, and scenario question drills, generated from `data/days.json` via `scripts/generate.js`. To add or edit a day's content, edit `data/days.json` then run:
```bash
node scripts/generate.js
```
Day 56 (`days/day-056.html`) is hand-authored with full depth as the template for what every other day should eventually become — regenerate it manually if `data/days.json`'s day-56 entry changes.

The homepage and every day page include a local progress tracker (`assets/app.js`, browser `localStorage` only — not shared across devices) defaulting to Day 56.

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
