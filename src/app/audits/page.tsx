"use client";

import { TopNav } from "@/components/layout/TopNav";
import { AuditUniverseTable } from "@/components/audits/AuditUniverseTable";

export default function AuditsPage() {
  return (
    <div className="min-h-screen bg-canvas">
      <TopNav current={1} />
      <main className="mx-auto max-w-6xl px-5 py-8">
        <div className="mb-6">
          <h1 className="font-display text-2xl font-bold text-indigo-dark">
            FY2026 Audit Universe
          </h1>
          <p className="mt-1 text-sm text-gray-text">
            Annual reporting cycle | 9 auditable entities
          </p>
        </div>
        <AuditUniverseTable />
        <p className="mt-4 text-center text-xs text-gray-text">
          Select the <span className="font-semibold text-indigo-dark">Capital Planning &amp; Capital Adequacy</span> audit to open its knowledge base. Other entities are locked in this demo.
        </p>
      </main>
    </div>
  );
}
