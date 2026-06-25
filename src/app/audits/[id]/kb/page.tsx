"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { TopNav } from "@/components/layout/TopNav";
import { DocumentLibrary } from "@/components/kb/DocumentLibrary";
import { DocumentViewer } from "@/components/kb/DocumentViewer";
import type { IngestPhase } from "@/components/kb/DocumentCard";
import { KB_DOCUMENTS } from "@/content/documents";
import { useAppStore } from "@/store/appStore";
import { loadRole } from "@/lib/persistence";

const ALL_INDEXED: Record<string, IngestPhase> = Object.fromEntries(
  KB_DOCUMENTS.map((d) => [d.id, "indexed" as IngestPhase])
);

export default function KbPage() {
  const router = useRouter();
  const kbLoaded = useAppStore((s) => s.kbLoaded);
  const setKbLoaded = useAppStore((s) => s.setKbLoaded);
  const role = useAppStore((s) => s.role);
  const setRole = useAppStore((s) => s.setRole);

  // Restore role across hard reloads so the CTA reflects the right capability.
  useEffect(() => {
    if (!useAppStore.getState().role) {
      const r = loadRole();
      if (r === "director" || r === "manager") setRole(r);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isDirector = role === "director";

  const [selectedId, setSelectedId] = useState(KB_DOCUMENTS[0].id);
  const [phases, setPhases] = useState<Record<string, IngestPhase>>(
    kbLoaded
      ? ALL_INDEXED
      : Object.fromEntries(KB_DOCUMENTS.map((d) => [d.id, "hidden"]))
  );
  const [indexing, setIndexing] = useState(!kbLoaded);
  const [progress, setProgress] = useState(kbLoaded ? 100 : 0);
  const ran = useRef(false);

  // First-visit ingestion theater (~8s): each doc cycles parsing->extracting->indexed
  useEffect(() => {
    if (kbLoaded || ran.current) return;
    ran.current = true;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const stagger = 850;

    KB_DOCUMENTS.forEach((d, i) => {
      const base = i * stagger + 200;
      timers.push(
        setTimeout(() => setPhase(d.id, "parsing"), base),
        setTimeout(() => setPhase(d.id, "extracting"), base + 320),
        setTimeout(() => {
          setPhase(d.id, "indexed");
          setProgress(Math.round(((i + 1) / KB_DOCUMENTS.length) * 100));
        }, base + 640)
      );
    });

    const total = KB_DOCUMENTS.length * stagger + 900;
    timers.push(
      setTimeout(() => {
        setIndexing(false);
        setKbLoaded(true);
      }, total)
    );

    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function setPhase(id: string, phase: IngestPhase) {
    setPhases((prev) => ({ ...prev, [id]: phase }));
  }

  const selectedDoc =
    KB_DOCUMENTS.find((d) => d.id === selectedId) || KB_DOCUMENTS[0];

  return (
    <div className="flex h-screen flex-col bg-canvas">
      <TopNav current={2} />
      <div className="flex min-h-0 flex-1">
        <DocumentLibrary
          docs={KB_DOCUMENTS}
          selectedId={selectedId}
          phases={phases}
          progress={progress}
          indexing={indexing}
          onSelect={setSelectedId}
        />
        <main className="scroll-thin relative min-w-0 flex-1 overflow-y-auto">
          <DocumentViewer doc={selectedDoc} />

          {/* Sticky CTA */}
          <button
            type="button"
            onClick={() => router.push("/audits/capital-planning/report")}
            className="fixed bottom-6 right-6 z-30 inline-flex items-center gap-2 rounded-xl bg-amber px-5 py-3 text-sm font-bold text-indigo-dark shadow-lift transition hover:-translate-y-0.5 hover:bg-amber-light"
          >
            {isDirector ? "View FY2026 Audit Report" : "Generate FY2026 Audit Report"}
            <ArrowRight className="h-4 w-4" />
          </button>
        </main>
      </div>
    </div>
  );
}
