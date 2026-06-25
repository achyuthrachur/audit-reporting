"use client";

import { useState } from "react";
import { Hexagon, Check, Undo2, X, ShieldCheck } from "lucide-react";
import { useAppStore } from "@/store/appStore";
import { patchReport, saveReturnNotes, clearReturnNotes } from "@/lib/persistence";

function fmt(ts: string | null): string {
  if (!ts) return "-";
  try {
    return new Date(ts).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return ts;
  }
}

/**
 * Director review panel (Phase 2.1). Replaces the left panel when the
 * signed-in director is reviewing a submitted report. Provides approve /
 * return-with-notes actions.
 */
export function ReviewPanel() {
  const sections = useAppStore((s) => s.sections);
  const status = useAppStore((s) => s.reportStatus);
  const generatedAt = useAppStore((s) => s.generatedAt);
  const submittedAt = useAppStore((s) => s.submittedAt);
  const returnNotes = useAppStore((s) => s.returnNotes);
  const setReportStatus = useAppStore((s) => s.setReportStatus);
  const setReturnNotes = useAppStore((s) => s.setReturnNotes);
  const showToast = useAppStore((s) => s.showToast);

  const [modalOpen, setModalOpen] = useState(false);
  const [notes, setNotes] = useState("");

  const approve = () => {
    setReportStatus("approved");
    patchReport({ status: "approved" });
    showToast("Report approved", "success");
  };

  const confirmReturn = () => {
    if (!notes.trim()) return;
    setReportStatus("returned");
    setReturnNotes(notes.trim());
    saveReturnNotes(notes.trim());
    patchReport({ status: "returned" });
    setModalOpen(false);
    showToast("Report returned to manager", "info");
  };

  return (
    <aside className="flex h-full flex-col bg-indigo-dark text-white">
      <div className="border-b border-white/10 px-4 py-4">
        <div className="flex items-center gap-2">
          <Hexagon className="h-4 w-4 text-amber" fill="currentColor" />
          <span className="font-display text-[15px] font-bold">Review Panel</span>
        </div>
        <p className="mt-1.5 text-[11px] text-white/50">
          Director approval - Capital Planning
        </p>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
        {/* Metadata */}
        <div className="space-y-2 rounded-lg border border-white/10 bg-white/[0.03] p-3 text-[12px]">
          <Row label="Status" value={statusLabel(status)} />
          <Row label="Generated" value={fmt(generatedAt)} />
          <Row label="Submitted" value={fmt(submittedAt)} />
          <Row label="Sections" value={`${sections.length}`} />
        </div>

        {status === "submitted" && (
          <div className="space-y-2">
            <button
              type="button"
              onClick={approve}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-success px-4 py-2.5 text-sm font-bold text-white transition hover:brightness-110"
            >
              <Check className="h-4 w-4" /> Approve Report
            </button>
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-high/60 px-4 py-2.5 text-sm font-bold text-[#ff8a98] transition hover:bg-high/10"
            >
              <Undo2 className="h-4 w-4" /> Return with Notes
            </button>
          </div>
        )}

        {status === "approved" && (
          <div className="flex items-center gap-2 rounded-lg border border-success/30 bg-success/10 px-3 py-2.5 text-[13px] font-semibold text-success">
            <ShieldCheck className="h-4 w-4" /> Report approved
          </div>
        )}

        {status === "returned" && (
          <div className="space-y-2 rounded-lg border border-high/30 bg-high/10 px-3 py-2.5 text-[12px]">
            <div className="font-bold text-[#ff8a98]">Returned to manager</div>
            {returnNotes && (
              <div className="text-white/70">
                <span className="text-white/40">Your notes:</span> {returnNotes}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Return-with-notes modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-surface p-5 text-indigo-dark shadow-2xl">
            <div className="mb-1 flex items-center justify-between">
              <h3 className="font-display text-base font-bold">
                Return Report with Notes
              </h3>
              <button type="button" onClick={() => setModalOpen(false)}>
                <X className="h-4 w-4 text-gray-text" />
              </button>
            </div>
            <p className="mb-3 text-xs text-gray-text">
              Provide revision notes for the audit manager. This field is
              required.
            </p>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={5}
              placeholder="e.g., Strengthen the MRA closure conclusion and clarify the F-2026-041 action plan"
              className="w-full resize-none rounded-lg border border-indigo-dark/15 bg-canvas p-3 text-sm focus:border-blue focus:outline-none focus:ring-2 focus:ring-blue/20"
            />
            <div className="mt-3 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="rounded-lg border border-indigo-dark/15 px-4 py-2 text-sm font-semibold text-indigo-mid"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmReturn}
                disabled={!notes.trim()}
                className="rounded-lg bg-high px-4 py-2 text-sm font-bold text-white disabled:opacity-40"
              >
                Confirm Return
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-2">
      <span className="text-white/40">{label}</span>
      <span className="text-right font-medium text-white/80">{value}</span>
    </div>
  );
}

function statusLabel(s: string): string {
  return (
    {
      draft: "Draft",
      submitted: "Submitted - Pending Approval",
      approved: "Approved",
      returned: "Returned - Needs Revision",
    }[s] ?? s
  );
}
