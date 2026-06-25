"use client";

import { useEffect, useRef } from "react";
import { MessageSquareDashed, Loader2 } from "lucide-react";
import { useAppStore } from "@/store/appStore";
import { SUGGESTION_CHIPS } from "@/content/suggestionChips";
import { ReasonedChip } from "./ReasonedChip";

export function ChatThread({
  sectionId,
  onSuggestion,
}: {
  sectionId: string;
  onSuggestion: (text: string) => void;
}) {
  const chat = useAppStore((s) => s.sectionChats[sectionId]);
  const isEditing = useAppStore(
    (s) => s.sectionChats[sectionId]?.isEditing ?? false
  );
  const endRef = useRef<HTMLDivElement>(null);

  const messages = chat?.messages ?? [];
  const chips = SUGGESTION_CHIPS[sectionId] ?? [];

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, isEditing]);

  return (
    <div className="scroll-thin flex-1 space-y-3 overflow-y-auto px-4 py-3">
      {messages.length === 0 && (
        <div className="flex flex-col items-center gap-3 px-4 py-8 text-center">
          <MessageSquareDashed className="h-8 w-8 text-white/25" />
          <p className="text-[13px] text-white/45">
            Ask a question about this section, or tell me how to refine it.
          </p>
          <div className="flex flex-wrap justify-center gap-1.5">
            {chips.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => onSuggestion(c)}
                className="cursor-pointer rounded-full border border-white/10 px-3 py-1.5 text-[11px] text-white/60 transition hover:border-amber/50 hover:text-white"
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      )}

      {messages.map((m, i) =>
        m.role === "user" ? (
          <div key={i} className="flex justify-end">
            <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-white/10 px-4 py-2.5 text-sm text-white">
              {m.content}
            </div>
          </div>
        ) : (
          <div key={i} className="flex justify-start">
            <div className="max-w-[90%] rounded-2xl rounded-tl-sm border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white/90">
              <div className="whitespace-pre-wrap">{m.content}</div>
              {m.reasoningLogId && (
                <div className="mt-2 flex justify-end">
                  <ReasonedChip logId={m.reasoningLogId} />
                </div>
              )}
            </div>
          </div>
        )
      )}

      {isEditing && (
        <div className="flex items-center gap-2 px-1 text-[12px] text-amber/80">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          Thinkingâ€¦
        </div>
      )}

      <div ref={endRef} />
    </div>
  );
}
