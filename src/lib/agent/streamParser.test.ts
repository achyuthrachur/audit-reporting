import { test } from "node:test";
import assert from "node:assert/strict";
import {
  StreamParser,
  type ParsedToken,
  type ParsedTokenType,
} from "./streamParser.ts";

/** Feed chunks, return concatenated text per type across push()+end(). */
function run(chunks: string[], detectSummary = false) {
  const p = new StreamParser({ detectSummary });
  const all: ParsedToken[] = [];
  for (const c of chunks) all.push(...p.push(c));
  all.push(...p.end());
  const byType = (t: ParsedTokenType) =>
    all.filter((x) => x.type === t).map((x) => x.text).join("");
  return {
    tokens: all,
    reasoning: byType("reasoning"),
    section: byType("section"),
    summary: byType("summary"),
    acc: { reasoning: p.reasoning, section: p.section, summary: p.summary },
  };
}

const FULL =
  "REASONING_START\nSources: ERM-2026-CAP. Decision: lead with risk.\nREASONING_END\n## Executive Summary\n\nThe FY2026 audit is a priority.";

test("normal flow â€” reasoning and section routed, markers stripped", () => {
  const r = run([FULL]);
  assert.equal(
    r.reasoning.trim(),
    "Sources: ERM-2026-CAP. Decision: lead with risk."
  );
  assert.equal(
    r.section.trim(),
    "## Executive Summary\n\nThe FY2026 audit is a priority."
  );
  // No marker text bleeds into either stream.
  assert.ok(!r.reasoning.includes("REASONING_START"));
  assert.ok(!r.reasoning.includes("REASONING_END"));
  assert.ok(!r.section.includes("REASONING_END"));
  assert.ok(!r.section.includes("REASONING_START"));
});

test("REASONING_START marker split across two chunks", () => {
  const r = run(["REASON", "ING_START\nthinkingâ€¦\nREASONING_END\n## Body"]);
  assert.equal(r.reasoning.trim(), "thinkingâ€¦");
  assert.equal(r.section.trim(), "## Body");
  assert.ok(!r.section.includes("REASON"));
});

test("REASONING_END marker split across two chunks", () => {
  const r = run([
    "REASONING_START\nanalysis here\nREASONING_",
    "END\n## Scope\n\nIn scope.",
  ]);
  assert.equal(r.reasoning.trim(), "analysis here");
  assert.equal(r.section.trim(), "## Scope\n\nIn scope.");
  assert.ok(!r.reasoning.includes("REASONING_"));
});

test("marker split character-by-character", () => {
  const r = run(FULL.split("")); // one char per chunk â€” worst case
  assert.equal(
    r.reasoning.trim(),
    "Sources: ERM-2026-CAP. Decision: lead with risk."
  );
  assert.equal(
    r.section.trim(),
    "## Executive Summary\n\nThe FY2026 audit is a priority."
  );
});

test("model omits REASONING block entirely â€” all section", () => {
  const r = run(["## Executive Summary\n\n", "Straight to content."]);
  assert.equal(r.reasoning, "");
  assert.equal(r.section, "## Executive Summary\n\nStraight to content.");
});

test("omitted reasoning where opening looks like a partial marker then diverges", () => {
  // "REAS" is a valid prefix of REASONING_START, but then diverges.
  const r = run(["REAS", "ONABLE assurance is the goal."]);
  assert.equal(r.reasoning, "");
  assert.equal(r.section, "REASONABLE assurance is the goal.");
});

test("SUMMARY line at end â€” detected (edit mode), stripped from section", () => {
  const r = run(
    [
      "REASONING_START\nrevise tone\nREASONING_END\n## Executive Summary\n\nRevised text here.\nSUMMARY: Sharpened the risk rationale.",
    ],
    true
  );
  assert.equal(r.reasoning.trim(), "revise tone");
  assert.equal(r.section.trim(), "## Executive Summary\n\nRevised text here.");
  assert.equal(r.summary.trim(), "Sharpened the risk rationale.");
  assert.ok(!r.section.includes("SUMMARY:"));
});

test("SUMMARY marker split across chunks", () => {
  const r = run(
    ["## Body\n\nText.\nSUMM", "ARY: Did the thing."],
    true
  );
  assert.equal(r.section.trim(), "## Body\n\nText.");
  assert.equal(r.summary.trim(), "Did the thing.");
});

test("detectSummary=false leaves SUMMARY: in section (generation route)", () => {
  // Generation route never asks for SUMMARY; if the literal appears it stays.
  const r = run(["## Body\n\nText.\nSUMMARY: x"], false);
  assert.ok(r.section.includes("SUMMARY: x"));
  assert.equal(r.summary, "");
});

test("accumulators match emitted token concatenation", () => {
  const r = run([FULL], false);
  assert.equal(r.acc.reasoning, r.reasoning);
  assert.equal(r.acc.section, r.section);
});

test("reasoning with no section content still ends cleanly", () => {
  const r = run(["REASONING_START\njust reasoning\nREASONING_END"]);
  assert.equal(r.reasoning.trim(), "just reasoning");
  assert.equal(r.section.trim(), "");
});
