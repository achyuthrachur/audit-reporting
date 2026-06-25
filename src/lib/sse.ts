/** Server-Sent Events helpers shared by the generate-report route. */

export type SSEEvent =
  | { type: "run_start"; model: string; fallback: boolean; stepCount: number }
  | { type: "step_start"; id: number; title: string; sourceIds: string[] }
  | { type: "section_delta"; id: number; delta: string }
  | { type: "step_complete"; id: number; usedFallback: boolean }
  | {
      type: "run_complete";
      elapsedSeconds: number;
      sectionCount: number;
      sourceCount: number;
      ranAsFallback: boolean;
    }
  // ---- Phase 2: reasoning trace events (generation + edit) ----
  | { type: "reasoning_delta"; stepId: string; delta: string }
  | {
      type: "reasoning_complete";
      stepId: string;
      reasoning: string;
      tokensIn?: number;
      tokensOut?: number;
      durationMs?: number;
    }
  // ---- Phase 2: edit-section events ----
  | { type: "edit_summary"; stepId: string; summary: string }
  | { type: "edit_complete"; stepId: string; content: string }
  // ---- Phase 2.2: conversational answer (question, not an edit) ----
  | { type: "chat_delta"; stepId: string; delta: string }
  | { type: "chat_complete"; stepId: string; content: string }
  | { type: "error"; message: string };

export function encodeSSE(event: SSEEvent): Uint8Array {
  return new TextEncoder().encode(`data: ${JSON.stringify(event)}\n\n`);
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
