"use client";

import { motion } from "framer-motion";
import { DocumentCard, type IngestPhase } from "./DocumentCard";
import type { KbDocument } from "@/content/documents";

export function DocumentLibrary({
  docs,
  selectedId,
  phases,
  progress,
  indexing,
  onSelect,
}: {
  docs: KbDocument[];
  selectedId: string;
  phases: Record<string, IngestPhase>;
  progress: number; // 0-100
  indexing: boolean;
  onSelect: (id: string) => void;
}) {
  const indexedCount = docs.filter((d) => phases[d.id] === "indexed").length;

  return (
    <aside className="flex w-80 shrink-0 flex-col border-r border-indigo-dark/10 bg-surface">
      {/* Header */}
      <div className="border-b border-indigo-dark/10 px-4 py-3.5">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-base font-bold text-indigo-dark">
            Knowledge Base
          </h2>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-dark/[0.06] px-2 py-0.5 text-[11px] font-bold text-indigo-dark">
            {docs.length} documents
          </span>
        </div>
        <div className="mt-1.5 flex items-center gap-1.5 text-[11px] font-semibold">
          <span
            className={`h-1.5 w-1.5 rounded-full ${indexing ? "bg-amber animate-pulse" : "bg-success"}`}
          />
          <span className={indexing ? "text-amber" : "text-success"}>
            {indexing ? `Indexing ${indexedCount}/${docs.length}...` : "Indexed"}
          </span>
        </div>
        {/* Progress bar */}
        <div className="mt-2 h-1 overflow-hidden rounded-full bg-indigo-dark/[0.08]">
          <motion.div
            className="h-full bg-amber"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: "easeOut", duration: 0.3 }}
          />
        </div>
      </div>

      {/* List */}
      <div className="scroll-thin flex-1 overflow-y-auto py-1">
        {docs.map((doc) => (
          <DocumentCard
            key={doc.id}
            doc={doc}
            selected={doc.id === selectedId}
            phase={phases[doc.id] || "indexed"}
            onClick={() => onSelect(doc.id)}
          />
        ))}
      </div>
    </aside>
  );
}
