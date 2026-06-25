"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronRight, Loader2 } from "lucide-react";
import { useAppStore, type ReasoningEntry as Entry } from "@/store/appStore";
import { cn } from "@/lib/utils";

export function ReasoningEntry({ id, entry }: { id: string; entry: Entry }) {
  const highlightedLogId = useAppStore((s) => s.highlightedLogId);
  const setHighlightedLogId = useAppStore((s) => s.setHighlightedLogId);
  const model = useAppStore((s) => s.modelUsed);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [flash, setFlash] = useState(false);

  // Deep-link target: â— Reasoned chip â†’ scroll here + flash amber 1.5s.
  useEffect(() => {
    if (highlightedLogId === id) {
      setOpen(true);
      ref.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      setFlash(true);
      const t = setTimeout(() => {
        setFlash(false);
        setHighlightedLogId(null);
      }, 1500);
      return () => clearTimeout(t);
    }
  }, [highlightedLogId, id, setHighlightedLogId]);

  const durationLabel =
    entry.durationMs > 0 ? `${(entry.durationMs / 1000).toFixed(1)}s` : "â€”";

  return (
    <div
      ref={ref}
      data-log-id={id}
      className={cn(
        "rounded-lg border transition-colors",
        flash
          ? "border-amber/60 bg-amber/10"
          : "border-white/5 bg-white/[0.02]"
      )}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-2 px-2.5 py-2 text-left"
      >
        <ChevronRight
          className={cn(
            "h-3.5 w-3.5 shrink-0 text-white/40 transition-transform",
            open && "rotate-90"
          )}
        />
        <span className="flex-1 truncate text-[12px] font-semibold text-white/85">
          {entry.kind === "edit" ? "Edit â€” " : ""}
          {entry.stepLabel}
        </span>
        {entry.isStreaming ? (
          <Loader2 className="h-3 w-3 animate-spin text-amber" />
        ) : (
          <span className="font-mono text-[10px] text-white/40">
            {durationLabel}
          </span>
        )}
      </button>

      {open && (
        <div className="space-y-1.5 px-3 pb-3 pt-0.5 text-[11px] text-white/70">
          <Meta label="Model" value={model} />
          <Meta label="Called" value={entry.calledAt || "â€”"} />
          <Meta label="Duration" value={durationLabel} />
          <Meta
            label="Tokens in"
            value={entry.tokensIn ? entry.tokensIn.toLocaleString() : "â€”"}
          />
          <Meta
            label="Tokens out"
            value={entry.tokensOut ? entry.tokensOut.toLocaleString() : "â€”"}
          />
          {entry.sources.length > 0 && (
            <Meta label="Sources" value={entry.sources.join(" Â· ")} />
          )}
          {entry.instruction && (
            <div className="flex gap-2">
              <span className="w-[68px] shrink-0 text-white/40">Instruction</span>
              <span className="flex-1 italic text-white/55">
                â€œ{entry.instruction}â€
              </span>
            </div>
          )}
          <div>
            <div className="mb-1 mt-2 flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-amber/70">
              <span className="h-1 w-1 rounded-full bg-amber" />
              Reasoning
            </div>
            <div className="whitespace-pre-wrap rounded-lg bg-white/5 p-3 font-mono text-[12px] leading-relaxed text-white/70">
              {entry.reasoning || (entry.isStreaming ? "â€¦" : "(no reasoning trace returned)")}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <span className="w-[68px] shrink-0 text-white/40">{label}</span>
      <span className="flex-1 break-words text-white/70">{value}</span>
    </div>
  );
}
