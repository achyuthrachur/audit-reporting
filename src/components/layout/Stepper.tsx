"use client";

import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  { label: "Select Audit", href: "/audits" },
  { label: "Knowledge Base", href: "/audits/capital-planning/kb" },
  { label: "Generate Report", href: "/audits/capital-planning/report" },
  { label: "Review & Export", href: "/audits/capital-planning/report" },
];

export function Stepper({ current }: { current: number }) {
  const router = useRouter();

  return (
    <nav className="flex items-center gap-1" aria-label="Progress">
      {STEPS.map((step, i) => {
        const idx = i + 1;
        const isComplete = idx < current;
        const isActive = idx === current;
        const reached = idx <= current;
        return (
          <div key={step.label} className="flex items-center">
            <button
              type="button"
              disabled={!reached}
              onClick={() => reached && router.push(step.href)}
              className={cn(
                "group flex items-center gap-2 rounded-full px-3 py-1.5 text-[13px] font-semibold transition",
                reached ? "cursor-pointer" : "cursor-not-allowed",
                isActive && "bg-amber/15 text-[#9a6a00]",
                isComplete && "text-white/85 hover:text-white",
                !reached && "text-white/35"
              )}
            >
              <span
                className={cn(
                  "flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold",
                  isActive && "bg-amber text-[#011E41]",
                  isComplete && "bg-success text-white",
                  !reached && "bg-white/10 text-white/40",
                  !isActive && !isComplete && reached && "bg-white/20 text-white"
                )}
              >
                {isComplete ? <Check className="h-3 w-3" strokeWidth={3} /> : idx}
              </span>
              <span className={cn(isActive ? "" : "hidden sm:inline")}>
                {step.label}
              </span>
            </button>
            {idx < STEPS.length && (
              <div
                className={cn(
                  "mx-1 h-px w-5",
                  idx < current ? "bg-success/50" : "bg-white/15"
                )}
              />
            )}
          </div>
        );
      })}
    </nav>
  );
}
