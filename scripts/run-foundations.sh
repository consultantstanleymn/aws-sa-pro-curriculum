#!/usr/bin/env bash
# Usage: run-foundations.sh <day1> <day2> ...
# Adds a "Foundations" section to each day, ONE DAY PER AIDER CALL (multi-day
# batching silently drops all but the first day — see run-batch.sh's note).
set -o pipefail
cd "$(dirname "$0")/.."
RESULTS="C:\Users\stanl\AppData\Local\Temp\foundations_results.log"

for n in "$@"; do
  padded=$(printf "%03d" "$n")
  BRIEF_FILE="C:\Users\stanl\AppData\Local\Temp\foundations_brief_${n}.md"
  node scripts/gen-foundations-brief.js "$n" > "$BRIEF_FILE"

  echo "=== Day $n: starting $(date) ===" | tee -a "$RESULTS"
  PYTHONIOENCODING="utf-8" DEEPSEEK_API_KEY="${DEEPSEEK_API_KEY}" ~/.aider-venv/Scripts/aider.exe \
    --model deepseek/deepseek-chat \
    --edit-format diff \
    --yes-always \
    --no-stream \
    --no-pretty \
    --no-auto-commits \
    --message-file "$BRIEF_FILE" \
    --file "days/day-${padded}.html" \
    >> "C:\Users\stanl\AppData\Local\Temp\foundations_day_${n}_run.log" 2>&1

  if node scripts/verify-foundations.js "$n" | tee -a "$RESULTS"; then
    echo "Day $n: FOUNDATIONS OK" | tee -a "$RESULTS"
  else
    echo "Day $n: FOUNDATIONS FAILED, left for retry" | tee -a "$RESULTS"
  fi
  echo "=== Day $n: finished $(date) ===" | tee -a "$RESULTS"
done
echo "FOUNDATIONS SEQUENCE DONE: $@" | tee -a "$RESULTS"
