"use client";

import { FileText, Table, Mail, Check } from "lucide-react";
import { motion } from "framer-motion";
import type { KbDocument } from "@/content/documents";
import { cn } from "@/lib/utils";

const ICONS = { FileText, Table, Mail };

export type IngestPhase = "hidden" | "parsing" | "extracting" | "indexed";

export function DocumentCard({
  doc,
  selected,
  phase,
  onClick,
}: {
  doc: KbDocument;
  selected: boolean;
  phase: IngestPhase;
  onClick: () => void;
}) {
  const Icon = ICONS[doc.icon];
  const visible = phase !== "hidden";

  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={false}
      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 6 }}
      transition={{ duration: 0.25 }}
      className={cn(
        "flex w-full items-start gap-3 border-l-2 px-3.5 py-3 text-left transition",
        selected
          ? "border-amber bg-amber/[0.06]"
          : "border-transparent hover:bg-indigo-dark/[0.03]"
      )}
    >
      <span
        className={cn(
          "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md",
          selected
            ? "bg-amber/15 text-[#9a6a00]"
            : "bg-indigo-dark/[0.06] text-indigo-mid"
        )}
      >
        <Icon className="h-4 w-4" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[13px] font-semibold leading-snug text-indigo-dark">
          {doc.title}
        </span>
        <span className="mt-0.5 block text-[11px] text-gray-text">
          {doc.docType} | {doc.date} | {doc.pages}pp
        </span>
        <span className="mt-1.5 block">
          {phase === "indexed" && (
            <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-1.5 py-0.5 text-[10px] font-bold text-success">
              <Check className="h-2.5 w-2.5" strokeWidth={3} /> Indexed
            </span>
          )}
          {phase === "parsing" && (
            <span className="text-[10px] font-semibold text-amber">
              Parsing...
            </span>
          )}
          {phase === "extracting" && (
            <span className="text-[10px] font-semibold text-blue">
              Extracting...
            </span>
          )}
        </span>
      </span>
    </motion.button>
  );
}
