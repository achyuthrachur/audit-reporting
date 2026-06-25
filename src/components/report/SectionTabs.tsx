"use client";

import { useAppStore } from "@/store/appStore";
import { cn } from "@/lib/utils";

const SHORT: Record<number, string> = {
  1: "Exec Summary",
  2: "Scope",
  3: "Rating",
  4: "Scope",
  5: "Actions",
  6: "Validation",
  7: "Appendix",
};

export function SectionTabs() {
  const sections = useAppStore((s) => s.sections);
  const activeSectionId = useAppStore((s) => s.activeSectionId);
  const setActiveSectionId = useAppStore((s) => s.setActiveSectionId);
  const reportSections = useAppStore((s) => s.reportSections);

  return (
    <div className="scroll-thin flex gap-1.5 overflow-x-auto border-b border-white/10 px-3 py-2.5">
      {sections.map((s) => {
        const id = String(s.id);
        const active = id === activeSectionId;
        const edited = reportSections[id]?.edited;
        return (
          <button
            key={id}
            type="button"
            onClick={() => setActiveSectionId(id)}
            className={cn(
              "flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold transition",
              active
                ? "bg-amber text-indigo-dark"
                : "border border-white/10 text-white/55 hover:text-white"
            )}
          >
            {edited && (
              <span
                className={cn(
                  "h-1.5 w-1.5 rounded-full",
                  active ? "bg-indigo-dark/60" : "bg-success"
                )}
              />
            )}
            {SHORT[s.id] ?? `Section ${s.id}`}
          </button>
        );
      })}
    </div>
  );
}
