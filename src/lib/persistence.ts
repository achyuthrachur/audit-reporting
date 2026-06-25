"use client";

/**
 * localStorage persistence for the Capital Planning audit report (no backend).
 *
 * Keys:
 *   crowe-compass:report:capital-planning               -> full report state JSON
 *   crowe-compass:report:capital-planning:return-notes  -> director return notes
 *   crowe-compass-reporting:role                                -> last signed-in role
 */

export type ReportStatus = "draft" | "submitted" | "approved" | "returned";

export interface StoredSection {
  id: number;
  title: string;
  sourceIds: string[];
  content: string;
}

export interface StoredReport {
  sections: StoredSection[];
  generatedAt: string;
  submittedAt: string | null;
  status: ReportStatus;
}

export const REPORT_KEY = "crowe-compass:report:capital-planning";
export const NOTES_KEY = "crowe-compass:report:capital-planning:return-notes";
export const ROLE_KEY = "crowe-compass-reporting:role";

const isBrowser = () => typeof window !== "undefined";

export function saveReport(report: StoredReport): void {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(REPORT_KEY, JSON.stringify(report));
  } catch (e) {
    console.error("[persistence] saveReport failed", e);
  }
}

export function loadReport(): StoredReport | null {
  if (!isBrowser()) return null;
  try {
    const raw = localStorage.getItem(REPORT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredReport;
    if (!parsed?.sections?.length) return null;
    return parsed;
  } catch (e) {
    console.error("[persistence] loadReport failed", e);
    return null;
  }
}

/** Merge a partial update into the stored report (e.g. status change). */
export function patchReport(patch: Partial<StoredReport>): StoredReport | null {
  const cur = loadReport();
  if (!cur) return null;
  const next = { ...cur, ...patch };
  saveReport(next);
  return next;
}

export function saveReturnNotes(notes: string): void {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(NOTES_KEY, notes);
  } catch (e) {
    console.error("[persistence] saveReturnNotes failed", e);
  }
}

export function loadReturnNotes(): string | null {
  if (!isBrowser()) return null;
  return localStorage.getItem(NOTES_KEY);
}

export function clearReturnNotes(): void {
  if (!isBrowser()) return;
  localStorage.removeItem(NOTES_KEY);
}

export function saveRole(role: string): void {
  if (!isBrowser()) return;
  localStorage.setItem(ROLE_KEY, role);
}

export function loadRole(): string | null {
  if (!isBrowser()) return null;
  return localStorage.getItem(ROLE_KEY);
}
