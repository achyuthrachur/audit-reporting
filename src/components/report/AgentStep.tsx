"use client";

import { Check, Loader2, Circle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { ReportSectionState } from "@/store/appStore";
import { cn } from "@/lib/utils";

export function AgentStep({ section }: { section: ReportSectionState }) {
  const { status, title, telemetry, id } = section;

  return (
    <div className="flex gap-3 px-3 py-2.5">
      <div className="mt-0.5 shrink-0">
        {status === "complete" && (
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-success">
            <Check className="h-3 w-3 text-white" strokeWidth={3} />
          </span>
        )}
        {status === "active" && (
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber/20">
            <Loader2 className="h-3.5 w-3.5 animate-spin text-amber" />
          </span>
        )}
        {status === "pending" && (
          <span className="flex h-5 w-5 items-center justify-center">
            <Circle className="h-4 w-4 text-white/25" />
          </span>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div
          className={cn(
            "flex items-center gap-2 text-[13px] font-semibold leading-tight",
            status === "pending" ? "text-white/40" : "text-white"
          )}
        >
          <span className="text-white/30">{id}.</span>
          <span className="truncate">{title}</span>
        </div>
        <AnimatePresence mode="wait">
          {status === "active" && telemetry && (
            <motion.div
              key={telemetry}
              initial={{ opacity: 0, y: -2 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-1 truncate font-mono text-[11px] text-amber"
            >
              {telemetry}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
