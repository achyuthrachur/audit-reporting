"use client";

import { useEffect, useRef } from "react";
import { CheckCircle2 } from "lucide-react";
import { ReportSection } from "./ReportSection";
import { useAppStore } from "@/store/appStore";

export type DocBanner = {
  variant: "amber" | "red" | "teal" | "neutral";
  text: string;
} | null;

export function ReportDocument({
  canEdit,
  onRegenerate,
  regeneratingId,
  editable = true,
  statusBanner = null,
  directorNotes = null,
}: {
  canEdit: boolean;
  onRegenerate: (id: number) => void;
  regeneratingId: number | null;
  editable?: boolean;
  statusBanner?: DocBanner;
  directorNotes?: string | null;
}) {
  const sections = useAppStore((s) => s.sections);
  const status = useAppStore((s) => s.generationStatus);
  const elapsed = useAppStore((s) => s.elapsedSeconds);
  const ranAsFallback = useAppStore((s) => s.ranAsFallback);
  const reportSections = useAppStore((s) => s.reportSections);
  const activeSectionId = useAppStore((s) => s.activeSectionId);
  const setActiveSectionId = useAppStore((s) => s.setActiveSectionId);
  const undoEdit = useAppStore((s) => s.undoEdit);

  const selectable = status === "complete" && editable;

  const scrollRef = useRef<HTMLDivElement>(null);
  const autoScroll = useRef(true);
  const charCount = sections.reduce((n, s) => n + s.content.length, 0);

  // Auto-scroll to streaming edge unless the user scrolled up.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || !autoScroll.current || status !== "running") return;
    el.scrollTop = el.scrollHeight;
  }, [charCount, status]);

  const onScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const nearBottom =
      el.scrollHeight - el.scrollTop - el.clientHeight < 120;
    autoScroll.current = nearBottom;
  };

  const started = status !== "idle";

  return (
    <div
      ref={scrollRef}
      onScroll={onScroll}
      className="scroll-thin print-area h-full overflow-y-auto bg-surface"
    >
      <article className="print-page mx-auto w-full max-w-4xl"
        style={{ minHeight: "100%" }}
      >
        {/* Document header */}
        <div className="border-b-2 border-indigo-dark/10 bg-canvas/50 px-9 py-5">
          <div className="text-[11px] font-bold uppercase tracking-wider text-amber">
            Meridian National Bank - Internal Audit
          </div>
          <h1 className="mt-1 font-display text-xl font-bold leading-tight text-indigo-dark">
            FY2026 Audit Report · Capital Planning &amp; Capital Adequacy
          </h1>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-gray-text">
            <span className="font-mono font-semibold text-indigo-mid">
              IA-RPT-2026-014
            </span>
            <span>Â·</span>
            <span className="font-semibold text-[#9a6a00]">
              Draft - Pending Approval
            </span>
          </div>
        </div>

        {/* Lifecycle status banner (role/status driven) */}
        {statusBanner && (
          <div
            className={`mx-9 mt-6 flex items-center gap-2 rounded-lg border px-4 py-2.5 text-[13px] font-semibold ${
              statusBanner.variant === "red"
                ? "border-high/30 bg-high/[0.08] text-high"
                : statusBanner.variant === "teal"
                  ? "border-success/30 bg-success/[0.08] text-success"
                  : statusBanner.variant === "amber"
                    ? "border-amber/40 bg-amber/10 text-[#9a6a00]"
                    : "border-indigo-dark/15 bg-indigo-dark/[0.04] text-indigo-mid"
            }`}
          >
            {statusBanner.text}
          </div>
        )}

        {/* Director return notes card (manager's returned view) */}
        {directorNotes && (
          <div className="mx-9 mt-3 rounded-lg border border-high/25 bg-high/[0.05] px-4 py-3 text-[13px]">
            <div className="font-bold text-high">Director Notes</div>
            <div className="mt-1 text-indigo-dark/80">{directorNotes}</div>
          </div>
        )}

        {/* Completion banner */}
        {status === "complete" && !statusBanner && (
          <div className="mx-9 mt-6 flex items-center gap-2 rounded-lg border border-success/25 bg-success/[0.07] px-4 py-2.5 text-[13px] font-semibold text-success">
            <CheckCircle2 className="h-4 w-4" />
            Report generated from 8 source documents · 7 sections · {elapsed}s
            {ranAsFallback && (
              <span className="ml-auto text-[10px] font-normal uppercase tracking-wide text-gray-text">
                demo safe-mode
              </span>
            )}
          </div>
        )}

        {/* Sections */}
        <div className="space-y-7 px-9 py-8">
          {!started && (
            <div className="py-20 text-center text-sm text-gray-text">
              Press <span className="font-semibold text-indigo-dark">Generate Report</span> to begin. The agent will read the
              8 knowledge-base documents and draft this report section by section.
            </div>
          )}
          {sections
            .filter((s) => s.content || s.status !== "pending")
            .map((section) => {
              const sid = String(section.id);
              const ps = reportSections[sid];
              return (
                <ReportSection
                  key={section.id}
                  section={section}
                  canEdit={canEdit && status === "complete" && editable}
                  onRegenerate={onRegenerate}
                  regenerating={regeneratingId === section.id}
                  selectable={selectable}
                  selected={selectable && activeSectionId === sid}
                  edited={!!ps?.edited}
                  coherenceWarning={ps?.coherenceWarning ?? null}
                  onSelect={() => setActiveSectionId(sid)}
                  onUndo={() => undoEdit(sid)}
                  onWarningClick={() => setActiveSectionId(sid)}
                />
              );
            })}
        </div>

        <div className="border-t border-indigo-dark/[0.06] px-9 py-4 text-[10px] text-gray-text">
          IA-RPT-2026-014 · Internal Use Only · Draft - Pending Approval Â·
          Synthetic demo · Â© 2026 Crowe LLP
        </div>
      </article>
    </div>
  );
}
