"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useAppStore } from "@/store/appStore";
import { ReasoningEntry } from "./ReasoningEntry";

/**
 * Persistent Agent Reasoning Log (Section 2.2). Lives at the bottom of the
 * left panel across BOTH panel states (generation + chat). Collapsed by
 * default; expands to a scrollable list of per-call reasoning entries.
 */
export function AgentReasoningLog() {
  const open = useAppStore((s) => s.reasoningLogOpen);
  const setOpen = useAppStore((s) => s.setReasoningLogOpen);
  const log = useAppStore((s) => s.reasoningLog);

  // Integer-like keys (generation steps 1-7) sort first, then edit keys in
  // insertion order - exactly the order we want in the log.
  const ids = Object.keys(log);
  const count = ids.length;

  return (
    <div className="shrink-0 border-t border-white/10 bg-indigo-dark">
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="scroll-thin max-h-[40vh] space-y-1.5 overflow-y-auto px-3 py-3">
              {count === 0 ? (
                <p className="px-1 py-2 text-[11px] text-white/35">
                  No reasoning traces yet. They appear here as the agent runs.
                </p>
              ) : (
                ids.map((id) => (
                  <ReasoningEntry key={id} id={id} entry={log[id]} />
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-center gap-1.5 py-2.5 text-[11px] text-white/40 transition hover:text-white/70"
      >
        {open ? (
          <>
            Hide reasoning <ChevronUp className="h-3 w-3" />
          </>
        ) : (
          <>
            Show reasoning
            {count > 0 && (
              <span className="rounded-full bg-white/10 px-1.5 py-0.5 text-[10px] font-semibold text-white/60">
                {count}
              </span>
            )}
            <ChevronDown className="h-3 w-3" />
          </>
        )}
      </button>
    </div>
  );
}
