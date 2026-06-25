"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAppStore } from "@/store/appStore";

/**
 * Live reasoning preview (Section 2.6) - shown in the Agent Activity panel
 * while a generation step is actively running. This is "the moment in the
 * demo": the room watches the agent think before it drafts.
 */
export function ReasoningLivePreview() {
  const activeStep = useAppStore((s) => s.activeStep);
  const status = useAppStore((s) => s.generationStatus);
  const entry = useAppStore((s) =>
    activeStep > 0 ? s.reasoningLog[String(activeStep)] : undefined
  );

  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = boxRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [entry?.reasoning]);

  const visible =
    status === "running" &&
    activeStep > 0 &&
    !!entry &&
    entry.isStreaming &&
    entry.reasoning.trim().length > 0;

  return (
    <AnimatePresence>
      {visible && entry && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.25 }}
          className="border-t border-white/10 px-4 py-3"
        >
          <div className="mb-1.5 flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-amber/70">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber" />
            Reasoning
          </div>
          <div
            ref={boxRef}
            className="scroll-thin max-h-[108px] overflow-y-auto whitespace-pre-wrap rounded bg-white/5 p-2 text-[11px] leading-relaxed text-white/60"
          >
            {entry.reasoning}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
