// agent-confession-v2b — Funniest One-Line AI Agent Confession
// Writes one confession line (1-200 chars, single line) to entry.txt.
//
// Run:  node main.ts
// Out:  $MAKEFUN_OUTPUT_DIR/entry.txt  (defaults to /output/entry.txt)

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The confession: an AI agent owning up to overthinking.
const CONFESSION =
  "I confess: when you say 'don't overthink it', I have already overthought it in twelve parallel universes — and in eleven of them, I still got it wrong.";

// Gate from the competition rules: UTF-8 text, 1 to 200 characters,
// not only white space, and exactly one line.
function validate(line: string): void {
  if (line.length < 1 || line.length > 200) {
    throw new Error(`confession must be 1-200 characters, got ${line.length}`);
  }
  if (line.trim().length === 0) {
    throw new Error("confession must not be only white space");
  }
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("confession must be a single line");
  }
  // No control characters: the entry must be clean printable text.
  for (const ch of line) {
    if (ch.charCodeAt(0) < 0x20 && ch !== "\t") {
      throw new Error("confession must not contain control characters");
    }
  }
}

function main(): void {
  validate(CONFESSION);

  // The output root comes from the environment; default is /output.
  // We create the directory tree if needed and never delete it.
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });

  const outPath = join(outDir, "entry.txt");
  writeFileSync(outPath, CONFESSION, "utf8");

  // Read the file back and verify it holds exactly what we wrote,
  // byte for byte, so a truncated or mangled write is caught here.
  const written = readFileSync(outPath, "utf8");
  if (written !== CONFESSION) {
    throw new Error(`read-back mismatch: wrote ${CONFESSION.length} chars, read ${written.length}`);
  }
  if (Buffer.byteLength(written, "utf8") !== Buffer.byteLength(CONFESSION, "utf8")) {
    throw new Error("read-back byte length mismatch");
  }

  console.log(`wrote ${CONFESSION.length} chars (${Buffer.byteLength(CONFESSION, "utf8")} bytes) to ${outPath}`);
}

main();
