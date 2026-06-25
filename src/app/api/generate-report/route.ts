import { NextRequest } from "next/server";
import OpenAI from "openai";
import { REPORT_STEPS } from "@/lib/agent/reportAgent";
import { SYSTEM_PROMPT, withReasoning } from "@/lib/agent/prompts";
import { FALLBACK_SECTIONS } from "@/content/fallbackReport";
import { GENERATION_REASONING } from "@/content/fallbackReasoning";
import { StreamParser, cleanReasoning } from "@/lib/agent/streamParser";
import { encodeSSE, sleep, type SSEEvent } from "@/lib/sse";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

const MODEL = process.env.OPENAI_MODEL || "gpt-5.5";
const PER_CALL_TIMEOUT_MS = 30_000;
const TELEMETRY_LINE_MS = 700; // scripted "Reading..." pacing before the call
const FALLBACK_TOKEN_MS = 18; // simulated streaming cadence in fallback mode

/**
 * Decide whether this run uses fallback content.
 * - DEMO_FALLBACK=true forces fallback globally.
 * - The client may also request fallback (Shift+F) via the request body.
 * - Absence of an API key forces fallback so the demo never hard-fails.
 */
function resolveFallback(reqFallback: boolean): { fallback: boolean; reason: string } {
  if (process.env.DEMO_FALLBACK === "true")
    return { fallback: true, reason: "DEMO_FALLBACK=true" };
  if (reqFallback) return { fallback: true, reason: "client requested fallback" };
  if (!process.env.OPENAI_API_KEY)
    return { fallback: true, reason: "no OPENAI_API_KEY set" };
  return { fallback: false, reason: "live" };
}

export async function POST(req: NextRequest) {
  let reqFallback = false;
  let stepFilter: number[] | null = null;
  let seedSections: { title: string; content: string }[] = [];
  try {
    const body = await req.json().catch(() => ({}));
    reqFallback = Boolean(body?.fallback);
    if (Array.isArray(body?.steps) && body.steps.length > 0) {
      stepFilter = body.steps.map((n: unknown) => Number(n));
    }
    if (Array.isArray(body?.priorSections)) {
      seedSections = body.priorSections;
    }
  } catch {
    /* no body */
  }

  const { fallback, reason } = resolveFallback(reqFallback);
  const startMs = Date.now();

  const steps = stepFilter
    ? REPORT_STEPS.filter((s) => stepFilter!.includes(s.id))
    : REPORT_STEPS;

  const client = !fallback
    ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    : null;

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (e: SSEEvent) => controller.enqueue(encodeSSE(e));
      let ranAsFallback = fallback;

      try {
        send({
          type: "run_start",
          model: MODEL,
          fallback,
          stepCount: steps.length,
        });

        const priorSections: { title: string; content: string }[] = [
          ...seedSections,
        ];

        for (const step of steps) {
          send({
            type: "step_start",
            id: step.id,
            title: step.title,
            sourceIds: step.sourceIds,
          });

          // Scripted "reading" theater before content begins.
          await sleep(TELEMETRY_LINE_MS * step.telemetry.length);

          let sectionText = "";
          let usedFallback = fallback;
          const stepId = String(step.id);
          const callStartMs = Date.now();

          if (!fallback && client) {
            // ---- LIVE OpenAI streaming call ----
            try {
              const userPrompt = step.buildUserPrompt(
                step.includePriorSections ? priorSections : []
              );

              const abort = new AbortController();
              const timer = setTimeout(
                () => abort.abort(),
                PER_CALL_TIMEOUT_MS
              );

              const completion = await client.chat.completions.create(
                {
                  model: MODEL,
                  // gpt-5.5 supports only the default temperature (1); omit it.
                  max_completion_tokens: 1600,
                  stream: true,
                  stream_options: { include_usage: true },
                  messages: [
                    { role: "system", content: withReasoning(SYSTEM_PROMPT) },
                    { role: "user", content: userPrompt },
                  ],
                },
                { signal: abort.signal }
              );

              // Route reasoning vs section tokens through the shared parser.
              const parser = new StreamParser({ detectSummary: false });
              let reasoningDone = false;
              let tokensIn = 0;
              let tokensOut = 0;

              const flushTokens = (
                tokens: ReturnType<StreamParser["push"]>
              ) => {
                for (const t of tokens) {
                  if (t.type === "reasoning") {
                    send({ type: "reasoning_delta", stepId, delta: t.text });
                  } else if (t.type === "section") {
                    // First section token => reasoning is complete.
                    if (!reasoningDone) {
                      reasoningDone = true;
                      send({
                        type: "reasoning_complete",
                        stepId,
                        reasoning: cleanReasoning(parser.reasoning),
                        durationMs: Date.now() - callStartMs,
                      });
                    }
                    sectionText += t.text;
                    send({ type: "section_delta", id: step.id, delta: t.text });
                  }
                }
              };

              for await (const chunk of completion) {
                if (chunk.usage) {
                  tokensIn = chunk.usage.prompt_tokens ?? tokensIn;
                  tokensOut = chunk.usage.completion_tokens ?? tokensOut;
                }
                const delta = chunk.choices?.[0]?.delta?.content || "";
                if (delta) flushTokens(parser.push(delta));
              }
              flushTokens(parser.end());
              clearTimeout(timer);

              // Edge: reasoning-only or no section token observed.
              if (!reasoningDone) {
                send({
                  type: "reasoning_complete",
                  stepId,
                  reasoning: cleanReasoning(parser.reasoning),
                  tokensIn,
                  tokensOut,
                  durationMs: Date.now() - callStartMs,
                });
                reasoningDone = true;
              } else {
                // Augment the already-sent reasoning_complete with token counts.
                send({
                  type: "reasoning_complete",
                  stepId,
                  reasoning: cleanReasoning(parser.reasoning),
                  tokensIn,
                  tokensOut,
                  durationMs: Date.now() - callStartMs,
                });
              }

              if (!sectionText.trim()) {
                throw new Error("empty completion");
              }
            } catch (err) {
              // ---- per-step parachute: silently fall back ----
              console.error(
                `[generate-report] step ${step.id} live call failed, using fallback:`,
                err
              );
              usedFallback = true;
              ranAsFallback = true;
              sectionText = await streamFallback(step, send, callStartMs);
            }
          } else {
            // ---- FALLBACK mode: simulated streaming ----
            sectionText = await streamFallback(step, send, callStartMs);
          }

          priorSections.push({ title: step.title, content: sectionText });
          send({ type: "step_complete", id: step.id, usedFallback });
        }

        const elapsedSeconds = Math.max(
          1,
          Math.round((Date.now() - startMs) / 1000)
        );
        const sourceCount = 8;
        send({
          type: "run_complete",
          elapsedSeconds,
          sectionCount: steps.length,
          sourceCount,
          ranAsFallback,
        });
        console.log(
          `[generate-report] complete in ${elapsedSeconds}s | mode=${reason} | ranAsFallback=${ranAsFallback}`
        );
      } catch (err) {
        console.error("[generate-report] fatal error:", err);
        send({
          type: "error",
          message: "Generation failed. Please retry.",
        });
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

const FALLBACK_REASONING_TOKEN_MS = 12; // reasoning streams a touch faster

function tokenize(s: string): string[] {
  return s.match(/\S+\s*|\s+/g) || (s ? [s] : []);
}

/**
 * Fallback path for a generation step: stream the pre-baked reasoning trace
 * (reasoning_delta -> reasoning_complete), then the pre-baked section content
 * (section_delta), through the SAME SSE machinery as a live run.
 */
async function streamFallback(
  step: { id: number },
  send: (e: SSEEvent) => void,
  callStartMs: number
): Promise<string> {
  const stepId = String(step.id);

  // 1) Reasoning trace.
  const reasoning = GENERATION_REASONING[step.id] || "";
  for (const t of tokenize(reasoning)) {
    send({ type: "reasoning_delta", stepId, delta: t });
    await sleep(FALLBACK_REASONING_TOKEN_MS);
  }
  send({
    type: "reasoning_complete",
    stepId,
    reasoning,
    tokensIn: 3200 + step.id * 180,
    tokensOut: 520 + step.id * 24,
    durationMs: Date.now() - callStartMs,
  });

  // 2) Section content.
  const content = FALLBACK_SECTIONS[step.id] || "";
  for (const t of tokenize(content)) {
    send({ type: "section_delta", id: step.id, delta: t });
    await sleep(FALLBACK_TOKEN_MS);
  }
  return content;
}
