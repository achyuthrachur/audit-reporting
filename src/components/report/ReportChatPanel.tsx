"use client";

import { Hexagon, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useAppStore } from "@/store/appStore";
import { SectionTabs } from "./SectionTabs";
import { ChatThread } from "./ChatThread";
import { ChatInput } from "./ChatInput";

export function ReportChatPanel({
  onSend,
}: {
  onSend: (sectionId: string, text: string) => void;
}) {
  const model = useAppStore((s) => s.modelUsed);
  const activeSectionId = useAppStore((s) => s.activeSectionId);
  const sections = useAppStore((s) => s.sections);
  const reportStatus = useAppStore((s) => s.reportStatus);
  const isEditing = useAppStore(
    (s) => s.sectionChats[activeSectionId]?.isEditing ?? false
  );

  const locked = reportStatus === "submitted" || reportStatus === "approved";
  const inputDisabled = isEditing || locked;
  const active = sections.find((s) => String(s.id) === activeSectionId);

  return (
    <motion.aside
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.2 }}
      className="flex h-full flex-col bg-indigo-dark text-white"
    >
      {/* Header */}
      <div className="border-b border-white/10 px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Hexagon className="h-4 w-4 text-amber" fill="currentColor" />
            <span className="font-display text-[15px] font-bold">Report Editor</span>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full border border-amber/30 bg-amber/15 px-2 py-0.5 text-[11px] font-bold text-amber-light">
            <Sparkles className="h-3 w-3" />
            {model.replace(/^gpt-/i, "GPT-")}
          </span>
        </div>
        <p className="mt-1.5 truncate text-[11px] text-white/50">
          Editing: <span className="font-semibold text-white/75">{active?.title ?? "-"}</span>
        </p>
      </div>

      {/* Section tabs */}
      <SectionTabs />

      {/* Thread */}
      <ChatThread
        key={activeSectionId}
        sectionId={activeSectionId}
        onSuggestion={(text) => onSend(activeSectionId, text)}
      />

      {/* Input */}
      {locked ? (
        <div className="border-t border-white/10 p-3 text-center text-[12px] text-white/40">
          {reportStatus === "approved"
            ? "Report approved - editing locked."
            : "Submitted for review - editing locked until returned."}
        </div>
      ) : (
        <ChatInput
          disabled={inputDisabled}
          onSend={(text) => onSend(activeSectionId, text)}
        />
      )}
    </motion.aside>
  );
}
