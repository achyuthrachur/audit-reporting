"use client";

import { Sparkles } from "lucide-react";
import { useAppStore } from "@/store/appStore";

/**
 * â— Reasoned chip on assistant bubbles (Section 4). Clicking opens the
 * reasoning log and deep-links to this call's entry (smooth scroll + flash).
 */
export function ReasonedChip({ logId }: { logId: string }) {
  const setReasoningLogOpen = useAppStore((s) => s.setReasoningLogOpen);
  const setHighlightedLogId = useAppStore((s) => s.setHighlightedLogId);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        setReasoningLogOpen(true);
        // Clear then set so repeated clicks re-trigger the flash effect.
        setHighlightedLogId(null);
        requestAnimationFrame(() => setHighlightedLogId(logId));
      }}
      title="Show the agent's reasoning for this edit"
      className="inline-flex items-center gap-1 rounded-full border border-amber/40 bg-amber/10 px-1.5 py-0.5 text-[10px] font-semibold text-amber-light transition hover:border-amber/70 hover:bg-amber/20"
    >
      <Sparkles className="h-2.5 w-2.5" />
      Reasoned
    </button>
  );
}
