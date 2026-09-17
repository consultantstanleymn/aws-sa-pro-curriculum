// One-shot call to DeepSeek to generate the 70-row continuity ledger.
// Run: DEEPSEEK_API_KEY=... node scripts/gen-ledger.js
const https = require('https');
const fs = require('fs');
const allDays = require('../data/days.json');
const [startArg, endArg] = process.argv.slice(2);
const start = startArg ? parseInt(startArg, 10) : 1;
const end = endArg ? parseInt(endArg, 10) : 70;
const days = allDays.filter(d => d.day >= start && d.day <= end);

const input = days.map(d => ({
  day: d.day, week: d.week, phase: d.phase, title: d.title,
  services: d.services, summary: d.summary, archetype: d.archetype
}));

const specialNotes = [];
if (start <= 1 && end >= 1) specialNotes.push('- Day 1: no previous day — relation "none", and takeaway should describe how to use the curriculum itself, not a service.');
if (start <= 70 && end >= 70) specialNotes.push('- Day 70: this is the last day — still give it hooks/takeaway/thread normally (its own preview will separately be a send-off, handled elsewhere).');
[14,28,42,56].forEach(n => { if (n >= start && n <= end) specialNotes.push(`- Day ${n} is a phase-boundary close (last day of a phase) — prefix its thread with "PHASE-CLOSE: ".`); });
[15,29,43,57].forEach(n => { if (n >= start && n <= end) specialNotes.push(`- Day ${n} is a phase-boundary open (first day of the next phase) — prefix its thread with "PHASE-OPEN: ".`); });

const systemPrompt = `You are building a "continuity ledger" for a 70-day AWS SA Pro / SRE study curriculum. This ledger will be handed AS FIXED INPUT to ~15 separate future writing batches (different AI calls, no shared memory) so that each day's "recap of yesterday" and "peek into tomorrow" sections feel like one continuous narrative even though they're written by different, isolated batches.

You are being called once per chunk of the curriculum (this call covers ONLY day ${start} through day ${end} inclusive). The user message below contains the COMPLETE and ONLY real data you have for these days — their actual titles, services, and summaries, taken directly from the curriculum's source file. You have NO reliable knowledge of what the other days in this curriculum contain beyond what general AWS-certification-curriculum patterns might suggest, and general patterns are NOT good enough — do not guess, reconstruct, paraphrase from memory, or invent content for any day. Your output must contain EXACTLY ${end - start + 1} entries, with "day" values exactly ${start}, ${start + 1}, ... ${end} in that order and no others. Do not renumber. Do not add entries for days outside this range under any circumstances, even if you believe you know what they contain.

For each day in your assigned range, output a JSON object with:
- day (number)
- takeaway: 1-2 sentences stating the single thing that day is responsible for landing in the reader's head. Specific, not generic.
- hooks: array of 3-5 SPECIFIC, CONCRETE, MEMORABLE nouns from that day's actual content (real service names, specific settings, specific numbers/thresholds, specific failure modes) that a future day's recap could reference. Never abstractions like "governance" or "resilience" alone — always something a reader would actually remember, e.g. "the FullAWSAccess default SCP", "inline LOB mode at a 64KB threshold", "CDCLatencySource vs CDCLatencyTarget".
- thread: a short name (3-6 words) for the multi-day narrative arc this day belongs to (e.g. "the permission-ceiling thread", "the near-zero-downtime cutover thread", "the multi-region failover thread"). Days on the same thread should reuse the identical thread name string. A day can belong to at most one primary thread.
- relation: for THIS day's recap of the PREVIOUS day, pick one relationship type from this fixed rotation, chosen so it doesn't repeat more than twice in a row across the sequence: ["extends", "contrasts with", "was a prerequisite for", "same trap different service", "same service opposite failure mode", "same lifecycle stage different concern"]. For day 1, use "none" (no previous day). For archetype C/D days (mock exams, reviews), you may use "extends" or a synthesis-appropriate relation, or "synthesis" if genuinely different in kind.

${specialNotes.length ? 'Special cases in this range:\n' + specialNotes.join('\n') + '\n' : ''}
If day 1 is not in your range, its relation logic does not apply to your first entry — just use the normal relation rotation for it relative to the day before it (which you don't have data for, but you can infer a generic plausible relation).

Output ONLY a JSON array of exactly ${end - start + 1} objects covering days ${start}-${end}, in order, no markdown fencing, no commentary, no extra days.`;

const userPrompt = JSON.stringify(input);

const body = JSON.stringify({
  model: 'deepseek-chat',
  messages: [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt }
  ],
  temperature: 0.4,
  max_tokens: 8000
});
const outFile = `./data/continuity-ledger.${start}-${end}.json`;

const req = https.request({
  hostname: 'api.deepseek.com',
  path: '/chat/completions',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
    'Content-Length': Buffer.byteLength(body)
  }
}, res => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => {
    if (res.statusCode !== 200) {
      console.error('HTTP', res.statusCode, data);
      process.exit(1);
    }
    const parsed = JSON.parse(data);
    let content = parsed.choices[0].message.content.trim();
    content = content.replace(/^```json\s*/,'').replace(/^```\s*/,'').replace(/```\s*$/,'');
    let ledger;
    try { ledger = JSON.parse(content); } catch (e) {
      fs.writeFileSync(`./data/continuity-ledger.${start}-${end}.raw.txt`, content);
      console.error(`Could not parse JSON, raw saved to data/continuity-ledger.${start}-${end}.raw.txt:`, e.message);
      process.exit(1);
    }
    const expected = [];
    for (let n = start; n <= end; n++) expected.push(n);
    const actual = ledger.map(r => r.day);
    if (JSON.stringify(actual) !== JSON.stringify(expected)) {
      fs.writeFileSync(`./data/continuity-ledger.${start}-${end}.raw.txt`, content);
      console.error(`Day mismatch. Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}. Raw saved.`);
      process.exit(1);
    }
    fs.writeFileSync(outFile, JSON.stringify(ledger, null, 2) + '\n');
    console.log('Wrote', ledger.length, 'ledger rows to', outFile);
  });
});
req.on('error', e => { console.error(e); process.exit(1); });
req.write(body);
req.end();
