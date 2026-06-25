"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  RotateCw,
  Pencil,
  Check,
  X,
  Loader2,
  Undo2,
  AlertTriangle,
} from "lucide-react";
import type { ReportSectionState } from "@/store/appStore";
import { useAppStore } from "@/store/appStore";
import { cn } from "@/lib/utils";

/** Strip the fenced ```json sidecar block before display. */
export function stripJsonSidecar(md: string): string {
  return md.replace(/```json[\s\S]*?```/g, "").trimEnd();
}

export function ReportSection({
  section,
  canEdit,
  onRegenerate,
  regenerating,
  selectable,
  selected,
  edited,
  coherenceWarning,
  onSelect,
  onUndo,
  onWarningClick,
}: {
  section: ReportSectionState;
  canEdit: boolean;
  onRegenerate: (id: number) => void;
  regenerating: boolean;
  selectable?: boolean;
  selected?: boolean;
  edited?: boolean;
  coherenceWarning?: string | null;
  onSelect?: () => void;
  onUndo?: () => void;
  onWarningClick?: () => void;
}) {
  const setSectionContent = useAppStore((s) => s.setSectionContent);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");

  const startEdit = () => {
    setDraft(section.content);
    setEditing(true);
  };
  const save = () => {
    setSectionContent(section.id, draft);
    setEditing(false);
  };

  const display = stripJsonSidecar(section.content);

  return (
    <section
      id={`section-${section.id}`}
      onClick={selectable && !editing ? onSelect : undefined}
      className={cn(
        "group relative scroll-mt-6 rounded-lg transition",
        selectable && "cursor-pointer px-4 py-3 -mx-4",
        selected
          ? "border-l-2 border-amber bg-amber/[0.06]"
          : selectable
            ? "border-l-2 border-transparent hover:bg-indigo-dark/[0.02]"
            : ""
      )}
    >
      {/* Coherence warning banner (Section 7) */}
      {coherenceWarning && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onWarningClick?.();
          }}
          className="no-print mb-2 flex w-full items-center gap-2 rounded-lg border border-amber/40 bg-amber/10 px-3 py-2 text-left text-[12px] font-semibold text-[#9a6a00]"
        >
          <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
          <span className="flex-1">Heads up - {coherenceWarning}</span>
          <span className="text-[11px] underline">Review</span>
        </button>
      )}

      {/* Status chips next to heading */}
      <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
        {section.sourceIds.length > 0 && section.content && (
          <>
            {section.sourceIds.map((id) => (
              <span
                key={id}
                className="inline-flex items-center rounded-full border border-amber/35 bg-amber/12 px-2 py-0.5 font-mono text-[10px] font-semibold text-[#9a6a00]"
              >
                {id}
              </span>
            ))}
          </>
        )}
        {selected && (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber/20 px-2 py-0.5 text-[10px] font-bold text-[#9a6a00]">
            <Pencil className="h-2.5 w-2.5" /> Editing
          </span>
        )}
        {edited && (
          <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-bold text-success">
            <Check className="h-2.5 w-2.5" strokeWidth={3} /> Edited
          </span>
        )}
        {edited && onUndo && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onUndo();
            }}
            className="no-print inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-semibold text-gray-text hover:text-indigo-dark"
          >
            <Undo2 className="h-2.5 w-2.5" /> Undo
          </button>
        )}
      </div>

      {/* Phase 1 hover controls (regenerate / inline edit) */}
      {canEdit && !editing && section.status === "complete" && (
        <div className="no-print absolute right-2 top-2 flex gap-1 opacity-0 transition group-hover:opacity-100">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRegenerate(section.id);
            }}
            disabled={regenerating}
            className="inline-flex items-center gap-1 rounded-md border border-indigo-dark/10 bg-surface px-2 py-1 text-[11px] font-semibold text-indigo-mid shadow-sm transition hover:bg-canvas disabled:opacity-50"
          >
            {regenerating ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <RotateCw className="h-3 w-3" />
            )}
            Regenerate
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              startEdit();
            }}
            className="inline-flex items-center gap-1 rounded-md border border-indigo-dark/10 bg-surface px-2 py-1 text-[11px] font-semibold text-indigo-mid shadow-sm transition hover:bg-canvas"
          >
            <Pencil className="h-3 w-3" /> Edit
          </button>
        </div>
      )}

      {editing ? (
        <div className="no-print" onClick={(e) => e.stopPropagation()}>
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className="h-72 w-full rounded-lg border border-indigo-dark/15 bg-canvas p-3 font-mono text-xs leading-relaxed text-indigo-dark focus:border-blue focus:outline-none focus:ring-2 focus:ring-blue/20"
          />
          <div className="mt-2 flex gap-2">
            <button
              type="button"
              onClick={save}
              className="inline-flex items-center gap-1 rounded-md bg-success px-3 py-1.5 text-xs font-bold text-white"
            >
              <Check className="h-3.5 w-3.5" /> Save
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="inline-flex items-center gap-1 rounded-md border border-indigo-dark/15 px-3 py-1.5 text-xs font-semibold text-indigo-mid"
            >
              <X className="h-3.5 w-3.5" /> Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="doc-prose">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{display}</ReactMarkdown>
          {section.status === "active" && (
            <span className="ml-0.5 inline-block h-4 w-1.5 animate-pulse bg-amber align-middle" />
          )}
        </div>
      )}
    </section>
  );
}
