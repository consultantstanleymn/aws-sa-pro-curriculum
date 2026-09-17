#!/usr/bin/env bash
set -o pipefail
# Usage: run-sequence.sh <day1> <day2> ...
# Processes each day ONE AT A TIME (one Aider call per day — multi-day batches
# don't work, the model truncates to one day and asks to "continue next turn").
# Verifies each, marks it detailed:true in data/days.json on pass, logs failures.
cd "$(dirname "$0")/.."
RESULTS="C:\Users\stanl\AppData\Local\Temp\day_sequence_results.log"

for n in "$@"; do
  echo "=== Day $n: starting $(date) ===" | tee -a "$RESULTS"
  DEEPSEEK_API_KEY="${DEEPSEEK_API_KEY}" bash scripts/run-batch.sh "$n" >> "C:\Users\stanl\AppData\Local\Temp\day_${n}_run.log" 2>&1
  if node scripts/verify-day.js "$n" | tee -a "$RESULTS"; then
    node -e "
      const fs=require('fs');
      const days=require('./data/days.json');
      const d=days.find(x=>x.day===$n);
      d.detailed=true;
      fs.writeFileSync('./data/days.json', JSON.stringify(days,null,0).replace(/^\[/,'[\n').replace(/\},\{/g,'},\n{').replace(/\]\$/,'\n]')+'\n');
    "
    echo "Day $n: MARKED DETAILED" | tee -a "$RESULTS"
  else
    echo "Day $n: VERIFICATION FAILED, left unmarked for retry" | tee -a "$RESULTS"
  fi
  echo "=== Day $n: finished $(date) ===" | tee -a "$RESULTS"
done
echo "SEQUENCE DONE: $@" | tee -a "$RESULTS"
