"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, FileText, Lock } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/Badge";
import { AUDIT_UNIVERSE, type AuditEntity } from "@/content/auditUniverse";
import { loadReport, type ReportStatus } from "@/lib/persistence";
import { cn } from "@/lib/utils";

function riskBadge(e: AuditEntity) {
  if (e.inherentRisk === "High") return <Badge variant="high">High</Badge>;
  if (e.inherentRisk === "Moderate")
    return <Badge variant="moderate">Moderate</Badge>;
  return <Badge variant="low">Low</Badge>;
}

function ReportStatusChip({ status }: { status: ReportStatus }) {
  const map = {
    draft: { variant: "amber" as const, label: "Draft" },
    submitted: { variant: "blue" as const, label: "Submitted - Pending Approval" },
    approved: { variant: "success" as const, label: "Approved" },
    returned: { variant: "high" as const, label: "Returned - Needs Revision" },
  };
  const { variant, label } = map[status];
  return (
    <Badge variant={variant} className="mt-1 w-fit">
      {label}
    </Badge>
  );
}

export function AuditUniverseTable() {
  const router = useRouter();
  const [reportStatus, setReportStatus] = useState<ReportStatus | null>(null);

  useEffect(() => {
    const report = loadReport();
    setReportStatus(report?.status ?? null);
  }, []);

  return (
    <div className="overflow-hidden rounded-xl border border-indigo-dark/10 bg-surface shadow-card">
      {/* Header row */}
      <div className="grid grid-cols-[2.4fr_1fr_1.4fr_1fr_1.1fr_1.1fr] gap-3 border-b border-indigo-dark/10 bg-canvas px-5 py-3 text-[11px] font-bold uppercase tracking-wide text-gray-text">
        <div>Auditable Entity</div>
        <div>Inherent Risk</div>
        <div>Last Audit</div>
        <div>Open Findings</div>
        <div>Knowledge Base</div>
        <div className="text-right">Action</div>
      </div>

      {AUDIT_UNIVERSE.map((e, i) => (
        <motion.div
          key={e.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: e.active ? 1 : 0.6, y: 0 }}
          transition={{ delay: i * 0.04, duration: 0.3 }}
          onClick={() => e.active && router.push(`/audits/${e.id}/kb`)}
          className={cn(
            "grid grid-cols-[2.4fr_1fr_1.4fr_1fr_1.1fr_1.1fr] items-center gap-3 border-b border-indigo-dark/[0.06] px-5 py-4 text-sm transition",
            e.active
              ? "cursor-pointer hover:bg-amber/[0.04]"
              : "cursor-not-allowed"
          )}
          title={!e.active ? "Available in full deployment." : undefined}
        >
          {/* Entity */}
          <div className="min-w-0">
            <div className="flex items-center gap-2 font-semibold text-indigo-dark">
              {!e.active && <Lock className="h-3.5 w-3.5 text-gray-text" />}
              <span className="truncate">{e.name}</span>
            </div>
            <div className="mt-0.5 text-xs text-gray-text">{e.unit}</div>
            {e.active && reportStatus && <ReportStatusChip status={reportStatus} />}
          </div>

          {/* Risk */}
          <div>{riskBadge(e)}</div>

          {/* Last audit */}
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-indigo-dark">
              {e.lastAudit}
            </span>
            <Badge
              variant={e.opinion === "Satisfactory" ? "success" : "moderate"}
              className="w-fit"
            >
              {e.opinion}
            </Badge>
          </div>

          {/* Findings */}
          <div>
            <span
              className={cn(
                "inline-flex h-6 min-w-6 items-center justify-center rounded-full px-2 text-xs font-bold",
                e.openFindings > 2
                  ? "bg-[#C03546]/10 text-[#C03546]"
                  : "bg-indigo-dark/[0.06] text-indigo-dark"
              )}
            >
              {e.openFindings}
            </span>
          </div>

          {/* KB status */}
          <div>
            {e.kbDocuments > 0 ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-dark">
                <FileText className="h-3.5 w-3.5 text-amber" />
                {e.kbDocuments} documents
              </span>
            ) : (
              <span className="text-xs text-gray-text">Not loaded</span>
            )}
          </div>

          {/* Action */}
          <div className="flex justify-end">
            {e.active ? (
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-amber px-3 py-1.5 text-xs font-bold text-indigo-dark transition group-hover:brightness-105">
                Open <ArrowRight className="h-3.5 w-3.5" />
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-text">
                <Lock className="h-3 w-3" /> Locked in demo
              </span>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
