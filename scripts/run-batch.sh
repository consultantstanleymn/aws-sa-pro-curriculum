#!/usr/bin/env bash
# Usage: run-batch.sh <day1> <day2> ...
# Generates the combined brief for the given days and runs one Aider/DeepSeek call
# rewriting all of them in a single session.
set -e
cd "$(dirname "$0")/.."
STYLEGUIDE="C:\Users\stanl\AppData\Local\Temp\claude\C--Users-stanl-Desktop-MassTcs\00280078-fbb1-49d9-9359-9e48f0e6e7e9\scratchpad\content-style-guide.md"
BRIEF_FILE="C:\Users\stanl\AppData\Local\Temp\batch_brief_$$.md"
FILE_ARGS=()
for n in "$@"; do
  padded=$(printf "%03d" "$n")
  FILE_ARGS+=(--file "days/day-${padded}.html")
done

{
  echo "You are rewriting one or more day pages in this AWS SA Pro / SRE study curriculum, following the shared style guide below exactly. Each day listed further down is a SEPARATE file — apply its own brief to its own file only, do not mix content between days."
  echo
  echo "# STYLE GUIDE (applies to every day below)"
  cat "$STYLEGUIDE"
  echo
  echo "# DAY-SPECIFIC BRIEFS"
  node scripts/gen-day-brief.js "$@"
  echo
  echo "After writing, do not commit (--no-auto-commits is set). Do not touch assets/style.css, assets/app.js, scripts/generate.js, or data/*.json. Do not modify any day file not explicitly listed above."
} > "$BRIEF_FILE"

PYTHONIOENCODING="utf-8" DEEPSEEK_API_KEY="${DEEPSEEK_API_KEY}" ~/.aider-venv/Scripts/aider.exe \
  --model deepseek/deepseek-chat \
  --edit-format diff \
  --yes-always \
  --no-stream \
  --no-pretty \
  --no-auto-commits \
  --message-file "$BRIEF_FILE" \
  --read data/days.json \
  --read data/continuity-ledger.json \
  "${FILE_ARGS[@]}"

echo "BATCH DONE: $@"
