"use client";

import { useRouter } from "next/navigation";
import { Orbit, RotateCcw } from "lucide-react";
import { Stepper } from "./Stepper";
import { useAppStore } from "@/store/appStore";
import { REPORT_KEY, NOTES_KEY, ROLE_KEY } from "@/lib/persistence";

export function TopNav({ current }: { current: number }) {
  const router = useRouter();
  const role = useAppStore((s) => s.role);

  const roleLabel =
    role === "director"
      ? "Audit Director"
      : role === "manager"
        ? "Audit Manager"
        : "Audit Director";
  const initials = role === "manager" ? "AM" : "AD";

  const goToLogin = () => router.push("/login");

  const startOver = () => {
    // Clear all persisted state.
    try {
      localStorage.removeItem(REPORT_KEY);
      localStorage.removeItem(NOTES_KEY);
      localStorage.removeItem(ROLE_KEY);
    } catch {
      /* SSR / private browsing */
    }
    // Reset Zustand in one shot.
    const s = useAppStore.getState();
    s.setRole(null);
    s.resetGeneration();
    s.resetPhase2();
    s.initSections([]);
    s.setReportStatus("draft");
    s.setGeneratedAt(null);
    s.setSubmittedAt(null);
    s.setReturnNotes(null);
    s.setKbLoaded(false);
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-indigo-dark text-white">
      <div className="flex h-14 items-center gap-4 px-5">
        {/* Brand - clicks back to login to change role */}
        <button
          type="button"
          onClick={goToLogin}
          title="Back to login"
          className="flex items-center gap-2.5"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/crowe-logo-white.svg" alt="Crowe" className="h-7 w-auto" />
          <span className="h-5 w-px bg-white/25" />
          <span className="flex items-center gap-1.5 font-display text-[15px] font-bold tracking-tight">
            <Orbit className="h-4 w-4 text-amber" />
            Helix<span className="text-amber"></span>
          </span>
        </button>

        <span className="hidden h-5 w-px bg-white/15 lg:block" />
        <span className="hidden text-xs font-medium text-white/55 lg:block">
          Meridian National Bank | Internal Audit
        </span>

        {/* Stepper */}
        <div className="ml-auto mr-auto hidden md:block">
          <Stepper current={current} />
        </div>

        {/* Right side: reset + role avatar */}
        <div className="ml-auto flex items-center gap-3 md:ml-0">
          {/* Start-over button */}
          <button
            type="button"
            onClick={startOver}
            title="Clear all data and start over"
            className="flex items-center gap-1.5 rounded-lg border border-white/15 px-2.5 py-1.5 text-[11px] font-semibold text-white/50 transition hover:border-white/35 hover:text-white/80"
          >
            <RotateCcw className="h-3 w-3" />
            Start over
          </button>

          {/* Role avatar - clicks back to login */}
          <button
            type="button"
            onClick={goToLogin}
            title="Switch role"
            className="flex items-center gap-2.5"
          >
            <div className="text-right leading-tight">
              <div className="text-[12px] font-semibold">{roleLabel}</div>
              <div className="text-[10px] text-white/50">Meridian National Bank</div>
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber text-[12px] font-bold text-indigo-dark">
              {initials}
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}
