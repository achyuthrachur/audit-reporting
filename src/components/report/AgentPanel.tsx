"use client";

import { Hexagon, Sparkles } from "lucide-react";
import { AgentStep } from "./AgentStep";
import { ReasoningLivePreview } from "./ReasoningLivePreview";
import { useAppStore } from "@/store/appStore";

export function AgentPanel({
  charCount,
  fallbackActive,
}: {
  charCount: number;
  fallbackActive: boolean;
}) {
  const sections = useAppStore((s) => s.sections);
  const status = useAppStore((s) => s.generationStatus);
  const elapsed = useAppStore((s) => s.elapsedSeconds);
  const model = useAppStore((s) => s.modelUsed);

  const completed = sections.filter((s) => s.status === "complete").length;

  return (
    <aside className="flex h-full flex-col bg-indigo-dark text-white">
      {/* Header */}
      <div className="border-b border-white/10 px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Hexagon className="h-4 w-4 text-amber" fill="currentColor" />
            <span className="font-display text-[15px] font-bold">
              Reporting Agent
            </span>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full border border-amber/30 bg-amber/15 px-2 py-0.5 text-[11px] font-bold text-amber-light">
            <Sparkles className="h-3 w-3" />
            {model.replace(/^gpt-/i, "GPT-")}
          </span>
        </div>
        <p className="mt-1.5 text-[11px] text-white/50">
          {status === "idle" && "Ready to generate Â· 7 sections Â· 8 sources"}
          {status === "running" &&
            `Generating section ${Math.min(completed + 1, 7)} of 7â€¦`}
          {status === "complete" && "Report generation complete"}
          {status === "error" && "Generation error"}
        </p>
        {fallbackActive && (
          <p className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-white/35">
            Demo safe-mode
          </p>
        )}
      </div>

      {/* Steps */}
      <div className="scroll-thin flex-1 overflow-y-auto py-1">
        {sections.map((section) => (
          <AgentStep key={section.id} section={section} />
        ))}
      </div>

      {/* Live reasoning preview â€” below the step list (Section 2.6) */}
      <ReasoningLivePreview />

      {/* Footer telemetry */}
      <div className="border-t border-white/10 px-4 py-3">
        <div className="flex items-center justify-between text-[11px]">
          <span className="font-mono text-white/55">
            {charCount.toLocaleString()} chars drafted
          </span>
          <span className="font-mono tabular-nums text-white/55">
            {elapsed}s elapsed
          </span>
        </div>
        <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full bg-amber transition-all duration-300"
            style={{ width: `${(completed / 7) * 100}%` }}
          />
        </div>
      </div>
    </aside>
  );
}
