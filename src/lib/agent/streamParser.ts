/**
 * streamParser.ts â€” the most important file in Phase 2.
 *
 * Incrementally parses a model's streamed output and routes tokens to the
 * correct destination based on three markers:
 *
 *   REASONING_START ... REASONING_END   â†’ reasoning trace (shown in the log,
 *                                          NEVER in the report document)
 *   <section content>                   â†’ the report section markdown
 *   SUMMARY: <one line>                 â†’ edit summary (edit route only)
 *
 * The parser is transport-agnostic: it emits `ParsedToken`s. The API routes
 * map those to SSE events. This separation is what makes the routing logic
 * unit-testable in isolation.
 *
 * Correctness requirements (all covered by streamParser.test.ts):
 *  - Markers may be split across chunk boundaries (e.g. "REASON" + "ING_END").
 *  - A marker's characters must never bleed into either output stream.
 *  - The model may omit the REASONING block entirely â†’ all output is section
 *    content, emitted from the first token.
 *  - SUMMARY: detection is opt-in (edit route) so a generated section that
 *    happens to contain the word is never mis-split.
 */

export const REASONING_START = "REASONING_START";
export const REASONING_END = "REASONING_END";
export const SUMMARY_MARKER = "SUMMARY:";

export type ParsedTokenType = "reasoning" | "section" | "summary";

export interface ParsedToken {
  type: ParsedTokenType;
  text: string;
}

type Mode = "preamble" | "reasoning" | "section" | "summary";

export class StreamParser {
  private mode: Mode = "preamble";
  private buf = "";
  private readonly detectSummary: boolean;

  /** Accumulated, marker-free output for convenience / final flush. */
  reasoning = "";
  section = "";
  summary = "";

  constructor(opts: { detectSummary?: boolean } = {}) {
    this.detectSummary = opts.detectSummary ?? false;
  }

  /** Feed a chunk of streamed text; returns any tokens that became routable. */
  push(chunk: string): ParsedToken[] {
    if (!chunk) return [];
    this.buf += chunk;
    const out: ParsedToken[] = [];
    this.process(out, false);
    return out;
  }

  /** Signal end-of-stream; flushes any buffered tail. */
  end(): ParsedToken[] {
    const out: ParsedToken[] = [];
    this.process(out, true);
    return out;
  }

  private record(token: ParsedToken) {
    if (!token.text) return;
    if (token.type === "reasoning") this.reasoning += token.text;
    else if (token.type === "section") this.section += token.text;
    else this.summary += token.text;
  }

  private emit(out: ParsedToken[], type: ParsedTokenType, text: string) {
    if (!text) return;
    const token = { type, text };
    this.record(token);
    out.push(token);
  }

  private process(out: ParsedToken[], isEnd: boolean) {
    // Loop until no further progress can be made without more input.
    // Each branch either advances `this.mode` (and `continue`s) or returns.
    // eslint-disable-next-line no-constant-condition
    while (true) {
      if (this.mode === "preamble") {
        if (!this.handlePreamble(isEnd)) return;
        continue;
      }

      if (this.mode === "reasoning") {
        const res = this.scanForMarker(out, REASONING_END, "reasoning", isEnd);
        if (res === "found") {
          this.mode = "section";
          continue;
        }
        return; // notfound â€” wait for more (or flushed if isEnd)
      }

      if (this.mode === "section") {
        if (this.detectSummary) {
          const res = this.scanForMarker(out, SUMMARY_MARKER, "section", isEnd);
          if (res === "found") {
            this.mode = "summary";
            continue;
          }
          return;
        }
        // No SUMMARY marker to look for: all buffered text is section content.
        this.emit(out, "section", this.buf);
        this.buf = "";
        return;
      }

      // mode === "summary": everything remaining is the summary line.
      this.emit(out, "summary", this.buf);
      this.buf = "";
      return;
    }
  }

  /**
   * Decide whether the stream opens with a REASONING_START marker.
   * Returns true if the mode advanced (caller should loop again), false if it
   * needs more input.
   */
  private handlePreamble(isEnd: boolean): boolean {
    const leadingWs = this.buf.match(/^\s*/)?.[0].length ?? 0;
    const rest = this.buf.slice(leadingWs);

    if (rest.startsWith(REASONING_START)) {
      // Consume leading whitespace + the marker; reasoning content follows.
      this.buf = rest.slice(REASONING_START.length);
      this.mode = "reasoning";
      return true;
    }

    if (rest.length === 0) {
      // Only whitespace so far.
      if (isEnd) {
        this.mode = "section";
        return true;
      }
      return false;
    }

    if (!isEnd && REASONING_START.startsWith(rest)) {
      // `rest` is still a viable prefix of the marker â€” wait for more.
      return false;
    }

    // The opening diverges from REASONING_START â†’ there is no reasoning block.
    // Treat the entire buffer (including any leading whitespace) as section.
    this.mode = "section";
    return true;
  }

  /**
   * In the current buffer, look for `marker`. Content before it is emitted as
   * `type`. If found, the marker is consumed and "found" is returned. If not
   * found, all bytes that cannot possibly be part of a split marker are
   * emitted (the rest is held back unless `isEnd`), and "notfound" is returned.
   */
  private scanForMarker(
    out: ParsedToken[],
    marker: string,
    type: ParsedTokenType,
    isEnd: boolean
  ): "found" | "notfound" {
    const idx = this.buf.indexOf(marker);
    if (idx !== -1) {
      this.emit(out, type, this.buf.slice(0, idx));
      this.buf = this.buf.slice(idx + marker.length);
      return "found";
    }

    if (isEnd) {
      // No marker will ever arrive; flush everything.
      this.emit(out, type, this.buf);
      this.buf = "";
      return "notfound";
    }

    // A partial marker can only live in the trailing (marker.length - 1) chars.
    const safeLen = Math.max(0, this.buf.length - (marker.length - 1));
    if (safeLen > 0) {
      this.emit(out, type, this.buf.slice(0, safeLen));
      this.buf = this.buf.slice(safeLen);
    }
    return "notfound";
  }
}

/** Trim a reasoning trace for storage (drops marker-adjacent whitespace). */
export function cleanReasoning(s: string): string {
  return s.trim();
}

/** Trim an extracted SUMMARY line. */
export function cleanSummary(s: string): string {
  return s.replace(/^\s*/, "").replace(/\s*$/, "");
}
