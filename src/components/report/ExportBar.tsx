"use client";

import { useState } from "react";
import { FileText, Sheet, Printer, Loader2, Send } from "lucide-react";
import { useAppStore } from "@/store/appStore";
import { patchReport, clearReturnNotes } from "@/lib/persistence";

const FINDINGS = [
  ["F-2026-041", "High", "Capital forecast data lineage and reconciliation remain incomplete", "Capital Planning Director", "March 31, 2027"],
  ["F-2026-042", "Moderate", "Stress scenario challenge evidence is inconsistent", "Treasurer", "January 31, 2027"],
  ["F-2026-043", "Moderate", "Contingency trigger monitoring frequency not fully implemented", "Capital Management Committee Secretary", "December 31, 2026"],
  ["F-2026-044", "Low", "CMC minutes do not consistently retain challenge detail", "CMC Secretary", "November 30, 2026"],
];

const MANAGEMENT_ACTIONS = [
  ["F-2026-041", "Capital Planning Director", "Automate the remaining three manual source feeds and evidence interim reconciliation sign-off in Axiom", "March 31, 2027"],
  ["F-2026-042", "Treasurer", "Revise the CMC scenario package to document challenge questions, alternatives considered and disposition", "January 31, 2027"],
  ["F-2026-043", "Capital Management Committee Secretary", "Update the contingency trigger calendar and monthly certification workflow", "December 31, 2026"],
  ["F-2026-044", "CMC Secretary", "Re-train minutes preparers and perform monthly QA over challenge documentation", "November 30, 2026"],
];

export function ExportBar() {
  const sections = useAppStore((s) => s.sections);
  const role = useAppStore((s) => s.role);
  const reportStatus = useAppStore((s) => s.reportStatus);
  const setReportStatus = useAppStore((s) => s.setReportStatus);
  const setSubmittedAt = useAppStore((s) => s.setSubmittedAt);
  const setReturnNotes = useAppStore((s) => s.setReturnNotes);
  const showToast = useAppStore((s) => s.showToast);
  const [busy, setBusy] = useState<string | null>(null);

  const isManager = role !== "director";
  const canSubmit =
    isManager && (reportStatus === "draft" || reportStatus === "returned");

  const submitForApproval = () => {
    const submittedAt = new Date().toISOString();
    setReportStatus("submitted");
    setSubmittedAt(submittedAt);
    setReturnNotes(null);
    clearReturnNotes();
    patchReport({ status: "submitted", submittedAt });
    showToast("Report submitted for director review", "success");
  };

  const exportWord = async () => {
    setBusy("word");
    try {
      const res = await fetch("/api/export/docx", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sections: sections.map((s) => ({
            title: s.title,
            content: s.content,
          })),
        }),
      });
      const blob = await res.blob();
      downloadBlob(blob, "Meridian_FY2026_Capital_Planning_Audit_Report.docx");
    } finally {
      setBusy(null);
    }
  };

  const exportExcel = async () => {
    setBusy("excel");
    try {
      const XLSX = await import("xlsx");
      const wb = XLSX.utils.book_new();

      const summary = [
        ["Section", "Status"],
        ...sections.map((s) => [
          `${s.id}. ${s.title}`,
          s.status === "complete" ? "Complete" : s.status,
        ]),
      ];
      XLSX.utils.book_append_sheet(
        wb,
        XLSX.utils.aoa_to_sheet(summary),
        "Report Summary"
      );

      const findings = [
        ["Finding", "Rating", "Title", "Owner", "Target Date"],
        ...FINDINGS,
      ];
      XLSX.utils.book_append_sheet(
        wb,
        XLSX.utils.aoa_to_sheet(findings),
        "Findings"
      );

      const actions = [
        ["Finding", "Owner", "Management Action", "Target Date"],
        ...MANAGEMENT_ACTIONS,
      ];
      XLSX.utils.book_append_sheet(
        wb,
        XLSX.utils.aoa_to_sheet(actions),
        "Management Action Plans"
      );

      XLSX.writeFile(wb, "Meridian_FY2026_Capital_Planning_Audit_Report.xlsx");
    } finally {
      setBusy(null);
    }
  };

  const exportPdf = () => {
    window.print();
  };

  return (
    <div className="no-print sticky bottom-0 z-30 flex items-center justify-between gap-3 border-t border-indigo-dark/10 bg-surface/95 px-6 py-3 backdrop-blur">
      <div className="flex items-center gap-3">
        <span className="text-xs font-medium text-gray-text">
          Export FY2026 Audit Report
        </span>
        {canSubmit && (
          <button
            type="button"
            onClick={submitForApproval}
            className="inline-flex items-center gap-2 rounded-lg bg-amber px-4 py-2 text-sm font-bold text-indigo-dark transition hover:bg-amber-light"
          >
            <Send className="h-4 w-4" />
            Submit for Approval
          </button>
        )}
        {isManager && reportStatus === "submitted" && (
          <span className="text-xs font-semibold text-blue">
            Submitted - pending director approval
          </span>
        )}
        {isManager && reportStatus === "approved" && (
          <span className="text-xs font-semibold text-success">
            Approved by director
          </span>
        )}
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={exportWord}
          disabled={!!busy}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-dark px-4 py-2 text-sm font-bold text-white transition hover:bg-indigo-mid disabled:opacity-60"
        >
          {busy === "word" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <FileText className="h-4 w-4" />
          )}
          Export Word (.docx)
        </button>
        <button
          type="button"
          onClick={exportExcel}
          disabled={!!busy}
          className="inline-flex items-center gap-2 rounded-lg border border-indigo-dark/15 bg-surface px-4 py-2 text-sm font-bold text-indigo-dark transition hover:bg-canvas disabled:opacity-60"
        >
          {busy === "excel" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Sheet className="h-4 w-4 text-success" />
          )}
          Export Excel (.xlsx)
        </button>
        <button
          type="button"
          onClick={exportPdf}
          disabled={!!busy}
          className="inline-flex items-center gap-2 rounded-lg border border-indigo-dark/15 bg-surface px-4 py-2 text-sm font-bold text-indigo-dark transition hover:bg-canvas disabled:opacity-60"
        >
          <Printer className="h-4 w-4 text-blue" />
          Export PDF
        </button>
      </div>
    </div>
  );
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}