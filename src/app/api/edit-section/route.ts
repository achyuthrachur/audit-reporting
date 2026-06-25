import { NextRequest } from "next/server";
import OpenAI from "openai";
import { EDIT_SYSTEM_PROMPT, withReasoning } from "@/lib/agent/prompts";
import { getDocById } from "@/content/documents";
import { REPORT_STEP_META } from "@/lib/agent/stepMeta";
import { getEditFallback, EDIT_FALLBACK } from "@/content/fallbackEdits";
import { StreamParser, cleanReasoning, cleanSummary } from "@/lib/agent/streamParser";
import { encodeSSE, sleep, type SSEEvent } from "@/lib/sse";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 120;

const MODEL = process.env.OPENAI_MODEL || "gpt-5.5";
const PER_CALL_TIMEOUT_MS = 30_000;
const FB_TOKEN_MS = 16;
const FB_REASONING_TOKEN_MS = 10;

/**
 * Deterministic intent classification (no extra LLM call): is the user's
 * message a QUESTION (answer conversationally, leave the section untouched) or
 * an EDIT (rewrite the section)?
 *
 * Rules, in order:
 *  1. Leading imperative edit verb  -> edit
 *  2. Ends with "?"                 -> answer
 *  3. Leading question word         -> answer
 *  4. Otherwise (ambiguous/comment) -> answer  (non-destructive default)
 */
const EDIT_VERBS = [
  "make", "add", "remove", "delete", "rewrite", "revise", "reword", "reorder",
  "re-order", "shorten", "tighten", "expand", "broaden", "narrow", "emphasize",
  "emphasise", "deemphasize", "de-emphasize", "include", "drop", "change",
  "update", "fix", "turn", "convert", "reformat", "re-format", "simplify",
  "strengthen", "soften", "cut", "trim", "merge", "split", "replace", "insert",
  "reduce", "increase", "highlight", "clarify", "condense", "elaborate",
  "sharpen", "elevate", "lower", "raise", "append", "prepend", "restructure",
  "rephrase", "polish", "refine", "adjust", "modify", "edit", "format", "bold",
  "rework", "redo", "swap", "move", "shift",
];
const QUESTION_WORDS = [
  "what", "why", "how", "which", "who", "when", "where", "explain", "describe",
  "summarize", "summarise", "tell", "is", "are", "do", "does", "did", "can",
  "could", "should", "would", "has", "have", "will", "list", "give", "show",
  "define", "compare",
];

function classifyIntent(userMessage: string): "answer" | "edit" {
  const msg = userMessage.trim().toLowerCase();
  // Take the first sentence only (stop at . ? !)
  const firstSentence = msg.split(/[.?!]/)[0] ?? msg;
  const words = firstSentence.split(/[\s,;:]+/).filter(Boolean);
  const firstWord = words[0] ?? "";

  // If ANY word in the first sentence is an edit verb -> edit.
  // This catches "Can you make...", "Please add...", "I want you to revise..."
  if (words.some((w) => EDIT_VERBS.includes(w))) return "edit";

  // Ends with "?" -> answer
  if (msg.endsWith("?")) return "answer";

  // Starts with a question word -> answer
  if (QUESTION_WORDS.includes(firstWord)) return "answer";

  return "answer";
}

interface EditBody {
  sectionId: string;
  currentContent: string;
  userMessage: string;
  conversationHistory?: { role: "user" | "assistant"; content: string }[];
  allSections?: { id: string; label: string; content: string }[];
  logId: string;
  fallback?: boolean;
}

function resolveFallback(reqFallback: boolean): boolean {
  if (process.env.DEMO_FALLBACK === "true") return true;
  if (reqFallback) return true;
  if (!process.env.OPENAI_API_KEY) return true;
  return false;
}

function sourceContextFor(sectionId: string): string {
  const meta = REPORT_STEP_META.find((m) => String(m.id) === sectionId);
  const ids = meta?.sourceIds ?? [];
  return ids
    .map((id) => {
      const d = getDocById(id);
      if (!d) return "";
      return `\n===== SOURCE: ${d.title} (${d.id}) =====\n${d.body}\n===== END ${d.id} =====\n`;
    })
    .join("\n");
}

function tokenize(s: string): string[] {
  return s.match(/\S+\s*|\s+/g) || (s ? [s] : []);
}

export async function POST(req: NextRequest) {
  let body: EditBody;
  try {
    body = (await req.json()) as EditBody;
  } catch {
    return new Response("bad request", { status: 400 });
  }

  const {
    sectionId,
    currentContent,
    userMessage,
    conversationHistory = [],
    allSections = [],
    logId,
  } = body;

  const fallback = resolveFallback(Boolean(body.fallback));
  const callStartMs = Date.now();
  const client = !fallback
    ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    : null;

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (e: SSEEvent) => controller.enqueue(encodeSSE(e));

      try {
        if (!fallback && client) {
          // ---- LIVE edit ----
          try {
            const otherSections = allSections
              .filter((s) => s.id !== sectionId)
              .map((s) => `### ${s.label}\n${s.content}`)
              .join("\n\n");

            // 1) Deterministic intent classification - the model no longer
            //    guesses whether to answer or edit.
            const isAnswerMode = classifyIntent(userMessage) === "answer";

            const modeDirective = isAnswerMode
              ? `MODE: ANSWER. The user is asking a question or requesting information - they do NOT want the section text changed. After your reasoning block, write a concise, conversational answer in plain prose, grounded in the sources and the existing report. Do NOT output or rewrite the section. Do NOT include a SUMMARY line.`
              : `MODE: EDIT. The user wants this section changed. After your reasoning block, output the FULL revised section in markdown (## heading, ### subsections, tables where appropriate), then a final line: SUMMARY: [one-sentence description of what changed].`;

            const userPrompt = `Section under discussion: "${sectionId}".

USER MESSAGE: ${userMessage}

${modeDirective}

----- CURRENT SECTION CONTENT -----
${currentContent}
----- END CURRENT SECTION -----

${sourceContextFor(sectionId)}

----- OTHER REPORT SECTIONS (context; do not rewrite these) -----
${otherSections}
----- END OTHER REPORT SECTIONS -----`;

            const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
              { role: "system", content: withReasoning(EDIT_SYSTEM_PROMPT) },
              ...conversationHistory.map((m) => ({
                role: m.role,
                content: m.content,
              })),
              { role: "user", content: userPrompt },
            ];

            const abort = new AbortController();
            const timer = setTimeout(() => abort.abort(), PER_CALL_TIMEOUT_MS);

            const completion = await client.chat.completions.create(
              {
                model: MODEL,
                max_completion_tokens: 1600,
                stream: true,
                stream_options: { include_usage: true },
                messages,
              },
              { signal: abort.signal }
            );

            // detectSummary only matters in EDIT mode.
            const parser = new StreamParser({ detectSummary: !isAnswerMode });
            let reasoningDone = false;
            let tokensIn = 0;
            let tokensOut = 0;
            let answerText = "";
            let sectionText = "";

            const flush = (tokens: ReturnType<StreamParser["push"]>) => {
              for (const t of tokens) {
                if (t.type === "reasoning") {
                  send({ type: "reasoning_delta", stepId: logId, delta: t.text });
                } else if (t.type === "section") {
                  if (!reasoningDone) {
                    reasoningDone = true;
                    send({
                      type: "reasoning_complete",
                      stepId: logId,
                      reasoning: cleanReasoning(parser.reasoning),
                      durationMs: Date.now() - callStartMs,
                    });
                  }
                  if (isAnswerMode) {
                    answerText += t.text;
                    send({ type: "chat_delta", stepId: logId, delta: t.text });
                  } else {
                    sectionText += t.text;
                    send({ type: "section_delta", id: Number(sectionId), delta: t.text });
                  }
                }
              }
            };

            for await (const chunk of completion) {
              if (chunk.usage) {
                tokensIn = chunk.usage.prompt_tokens ?? tokensIn;
                tokensOut = chunk.usage.completion_tokens ?? tokensOut;
              }
              const delta = chunk.choices?.[0]?.delta?.content || "";
              if (delta) flush(parser.push(delta));
            }
            flush(parser.end());
            clearTimeout(timer);

            send({
              type: "reasoning_complete",
              stepId: logId,
              reasoning: cleanReasoning(parser.reasoning),
              tokensIn,
              tokensOut,
              durationMs: Date.now() - callStartMs,
            });

            if (isAnswerMode) {
              send({
                type: "chat_complete",
                stepId: logId,
                content:
                  answerText.trim() ||
                  "I don't have enough grounded information to answer that.",
              });
            } else {
              if (!sectionText.trim()) throw new Error("empty edit");
              send({
                type: "edit_summary",
                stepId: logId,
                summary:
                  cleanSummary(parser.summary) ||
                  "Section revised per your instruction.",
              });
              send({
                type: "edit_complete",
                stepId: logId,
                content: sectionText.trimEnd(),
              });
            }
          } catch (err) {
            console.error(
              `[edit-section] live edit failed, using fallback:`,
              err
            );
            await streamEditFallback(
              sectionId,
              currentContent,
              userMessage,
              logId,
              callStartMs,
              send
            );
          }
        } else {
          // ---- FALLBACK edit ----
          await streamEditFallback(
            sectionId,
            currentContent,
            userMessage,
            logId,
            callStartMs,
            send
          );
        }
      } catch (err) {
        console.error("[edit-section] fatal:", err);
        send({ type: "error", message: "Edit failed. Please retry." });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}

/** Fallback: stream pre-baked reasoning, the revised content, then SUMMARY. */
async function streamEditFallback(
  sectionId: string,
  currentContent: string,
  userMessage: string,
  logId: string,
  callStartMs: number,
  send: (e: SSEEvent) => void
) {
  const key = `${sectionId}::${userMessage}`;
  const isKnownEdit = key in EDIT_FALLBACK;

  if (!isKnownEdit && classifyIntent(userMessage) === "answer") {
    // Free-text question in safe-mode -> answer conversationally.
    const reasoning = `Instruction interpreted as a question/comment rather than an
edit. In demo safe-mode the live model is not queried, so I provide a grounded,
conversational response without modifying the section.`;
    for (const t of tokenize(reasoning)) {
      send({ type: "reasoning_delta", stepId: logId, delta: t });
      await sleep(FB_REASONING_TOKEN_MS);
    }
    send({
      type: "reasoning_complete",
      stepId: logId,
      reasoning,
      tokensIn: 1800,
      tokensOut: 220,
      durationMs: Date.now() - callStartMs,
    });
    const answer = `This is running in demo safe-mode, so I'm answering from the section as drafted rather than a live model call. This section is grounded in the audit knowledge base (e.g., completed test results, exception log, management responses, validation evidence, and regulatory correspondence) and references F-2026-041, management action plans, and the REG-2025-118 closure conclusion. Ask me to revise it - for example "emphasize the MRA closure conclusion" or "make it more concise" - and I'll update it in place.`;
    for (const t of tokenize(answer)) {
      send({ type: "chat_delta", stepId: logId, delta: t });
      await sleep(FB_TOKEN_MS);
    }
    send({ type: "chat_complete", stepId: logId, content: answer });
    return;
  }

  const fb = getEditFallback(key);

  // 1) Reasoning.
  for (const t of tokenize(fb.reasoning)) {
    send({ type: "reasoning_delta", stepId: logId, delta: t });
    await sleep(FB_REASONING_TOKEN_MS);
  }
  send({
    type: "reasoning_complete",
    stepId: logId,
    reasoning: fb.reasoning,
    tokensIn: 2600,
    tokensOut: 480,
    durationMs: Date.now() - callStartMs,
  });

  // 2) Revised content = current content + a grounded, visible addition.
  const revised = `${currentContent.trimEnd()}\n\n${fb.note}`;
  for (const t of tokenize(revised)) {
    send({ type: "section_delta", id: Number(sectionId), delta: t });
    await sleep(FB_TOKEN_MS);
  }

  // 3) Summary.
  send({ type: "edit_summary", stepId: logId, summary: fb.summary });
  send({ type: "edit_complete", stepId: logId, content: revised });
}
