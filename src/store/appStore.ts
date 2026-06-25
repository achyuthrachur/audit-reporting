"use client";

import { create } from "zustand";

export type Role = "director" | "manager" | null;

export type StepStatus = "pending" | "active" | "complete";

export interface ReportSectionState {
  id: number;
  title: string;
  sourceIds: string[];
  status: StepStatus;
  /** scripted telemetry line shown while the step is active */
  telemetry: string;
  /** streamed markdown content */
  content: string;
}

// ===================== Phase 2 - Agent Transparency =====================

export interface ReasoningEntry {
  stepLabel: string;
  calledAt: string;
  durationMs: number;
  tokensIn: number;
  tokensOut: number;
  sources: string[];
  instruction: string;
  reasoning: string; // full REASONING_START...REASONING_END content
  isStreaming: boolean;
  /** discriminates generation steps from chat edits in the log UI */
  kind: "generation" | "edit";
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  reasoningLogId?: string;
}

export interface SectionChat {
  messages: ChatMessage[];
  editCount: number;
  isEditing: boolean;
}

export interface ReportSectionEdit {
  content: string;
  previousContent: string | null;
  edited: boolean;
  coherenceWarning: string | null;
}

const emptyChat = (): SectionChat => ({
  messages: [],
  editCount: 0,
  isEditing: false,
});

interface AppState {
  // ---- auth (fake) ----
  role: Role;
  setRole: (role: Role) => void;

  // ---- knowledge base ----
  kbLoaded: boolean;
  setKbLoaded: (v: boolean) => void;

  // ---- report generation ----
  sections: ReportSectionState[];
  generationStatus: "idle" | "running" | "complete" | "error";
  activeStep: number; // 0-based index of currently running step, -1 when none
  elapsedSeconds: number;
  modelUsed: string;
  ranAsFallback: boolean;

  setGenerationStatus: (s: AppState["generationStatus"]) => void;
  initSections: (sections: ReportSectionState[]) => void;
  setStepStatus: (id: number, status: StepStatus) => void;
  setStepTelemetry: (id: number, telemetry: string) => void;
  appendSectionDelta: (id: number, delta: string) => void;
  setSectionContent: (id: number, content: string) => void;
  setActiveStep: (i: number) => void;
  setElapsedSeconds: (s: number) => void;
  setModelUsed: (m: string) => void;
  setRanAsFallback: (v: boolean) => void;
  resetGeneration: () => void;

  // ---- Phase 2.1: report lifecycle (persisted to localStorage) ----
  reportStatus: "draft" | "submitted" | "approved" | "returned";
  generatedAt: string | null;
  submittedAt: string | null;
  returnNotes: string | null;
  setReportStatus: (s: AppState["reportStatus"]) => void;
  setGeneratedAt: (t: string | null) => void;
  setSubmittedAt: (t: string | null) => void;
  setReturnNotes: (n: string | null) => void;

  // ---- toast ----
  toast: { id: number; message: string; variant: "success" | "info" | "error" } | null;
  showToast: (message: string, variant?: "success" | "info" | "error") => void;
  clearToast: () => void;

  // ---- Phase 2: agent transparency + chat editing (added, not restructured) ----
  reasoningLog: Record<string, ReasoningEntry>;
  sectionChats: Record<string, SectionChat>;
  reportSections: Record<string, ReportSectionEdit>;
  activeSectionId: string;
  reasoningLogOpen: boolean;
  /** id of the reasoning entry whose log row should flash (deep-link target) */
  highlightedLogId: string | null;

  setReasoningLogOpen: (open: boolean) => void;
  upsertReasoningEntry: (id: string, entry: ReasoningEntry) => void;
  updateReasoningEntry: (id: string, partial: Partial<ReasoningEntry>) => void;
  appendReasoningDelta: (id: string, delta: string) => void;
  setActiveSectionId: (id: string) => void;
  setHighlightedLogId: (id: string | null) => void;

  initReportSections: (ids: string[], contentById: Record<string, string>) => void;
  applyEdit: (sectionId: string, newContent: string) => void;
  undoEdit: (sectionId: string) => void;
  setCoherenceWarning: (sectionId: string, warning: string | null) => void;

  addChatMessage: (sectionId: string, message: ChatMessage) => void;
  setSectionEditing: (sectionId: string, editing: boolean) => void;
  resetPhase2: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  role: null,
  setRole: (role) => set({ role }),

  kbLoaded: false,
  setKbLoaded: (kbLoaded) => set({ kbLoaded }),

  sections: [],
  generationStatus: "idle",
  activeStep: -1,
  elapsedSeconds: 0,
  modelUsed: "gpt-5.5",
  ranAsFallback: false,

  setGenerationStatus: (generationStatus) => set({ generationStatus }),
  initSections: (sections) => set({ sections }),
  setStepStatus: (id, status) =>
    set((state) => ({
      sections: state.sections.map((s) =>
        s.id === id ? { ...s, status } : s
      ),
    })),
  setStepTelemetry: (id, telemetry) =>
    set((state) => ({
      sections: state.sections.map((s) =>
        s.id === id ? { ...s, telemetry } : s
      ),
    })),
  appendSectionDelta: (id, delta) =>
    set((state) => ({
      sections: state.sections.map((s) =>
        s.id === id ? { ...s, content: s.content + delta } : s
      ),
    })),
  setSectionContent: (id, content) =>
    set((state) => ({
      sections: state.sections.map((s) =>
        s.id === id ? { ...s, content } : s
      ),
    })),
  setActiveStep: (activeStep) => set({ activeStep }),
  setElapsedSeconds: (elapsedSeconds) => set({ elapsedSeconds }),
  setModelUsed: (modelUsed) => set({ modelUsed }),
  setRanAsFallback: (ranAsFallback) => set({ ranAsFallback }),
  resetGeneration: () =>
    set({
      generationStatus: "idle",
      activeStep: -1,
      elapsedSeconds: 0,
      ranAsFallback: false,
    }),

  // ---- Phase 2.1 report lifecycle ----
  reportStatus: "draft",
  generatedAt: null,
  submittedAt: null,
  returnNotes: null,
  setReportStatus: (reportStatus) => set({ reportStatus }),
  setGeneratedAt: (generatedAt) => set({ generatedAt }),
  setSubmittedAt: (submittedAt) => set({ submittedAt }),
  setReturnNotes: (returnNotes) => set({ returnNotes }),

  // ---- toast ----
  toast: null,
  showToast: (message, variant = "success") =>
    set((state) => ({
      toast: {
        id: (state.toast?.id ?? 0) + 1,
        message,
        variant,
      },
    })),
  clearToast: () => set({ toast: null }),

  // ---- Phase 2 state ----
  reasoningLog: {},
  sectionChats: {},
  reportSections: {},
  activeSectionId: "1",
  reasoningLogOpen: false,
  highlightedLogId: null,

  setReasoningLogOpen: (reasoningLogOpen) => set({ reasoningLogOpen }),
  upsertReasoningEntry: (id, entry) =>
    set((state) => ({
      reasoningLog: { ...state.reasoningLog, [id]: entry },
    })),
  updateReasoningEntry: (id, partial) =>
    set((state) => {
      const existing = state.reasoningLog[id];
      if (!existing) return {};
      return {
        reasoningLog: {
          ...state.reasoningLog,
          [id]: { ...existing, ...partial },
        },
      };
    }),
  appendReasoningDelta: (id, delta) =>
    set((state) => {
      const existing = state.reasoningLog[id];
      if (!existing) return {};
      return {
        reasoningLog: {
          ...state.reasoningLog,
          [id]: { ...existing, reasoning: existing.reasoning + delta },
        },
      };
    }),
  setActiveSectionId: (activeSectionId) => set({ activeSectionId }),
  setHighlightedLogId: (highlightedLogId) => set({ highlightedLogId }),

  initReportSections: (ids, contentById) =>
    set((state) => {
      const reportSections = { ...state.reportSections };
      const sectionChats = { ...state.sectionChats };
      for (const id of ids) {
        reportSections[id] = {
          content: contentById[id] ?? "",
          previousContent: null,
          edited: false,
          coherenceWarning: null,
        };
        if (!sectionChats[id]) sectionChats[id] = emptyChat();
      }
      return { reportSections, sectionChats };
    }),
  applyEdit: (sectionId, newContent) =>
    set((state) => {
      const numId = Number(sectionId);
      const prev =
        state.reportSections[sectionId]?.content ??
        state.sections.find((s) => s.id === numId)?.content ??
        "";
      const chat = state.sectionChats[sectionId] ?? emptyChat();
      return {
        // keep Phase 1 render + export source of truth in sync
        sections: state.sections.map((s) =>
          s.id === numId ? { ...s, content: newContent } : s
        ),
        sectionChats: {
          ...state.sectionChats,
          [sectionId]: { ...chat, editCount: chat.editCount + 1 },
        },
        reportSections: {
          ...state.reportSections,
          [sectionId]: {
            content: newContent,
            previousContent: prev,
            edited: true,
            coherenceWarning:
              state.reportSections[sectionId]?.coherenceWarning ?? null,
          },
        },
      };
    }),
  undoEdit: (sectionId) =>
    set((state) => {
      const entry = state.reportSections[sectionId];
      if (!entry || entry.previousContent === null) return {};
      const numId = Number(sectionId);
      const restored = entry.previousContent;
      return {
        sections: state.sections.map((s) =>
          s.id === numId ? { ...s, content: restored } : s
        ),
        reportSections: {
          ...state.reportSections,
          [sectionId]: {
            ...entry,
            content: restored,
            previousContent: null,
            edited: false,
          },
        },
      };
    }),
  setCoherenceWarning: (sectionId, warning) =>
    set((state) => {
      const entry =
        state.reportSections[sectionId] ??
        ({
          content: "",
          previousContent: null,
          edited: false,
          coherenceWarning: null,
        } as ReportSectionEdit);
      return {
        reportSections: {
          ...state.reportSections,
          [sectionId]: { ...entry, coherenceWarning: warning },
        },
      };
    }),

  addChatMessage: (sectionId, message) =>
    set((state) => {
      const chat = state.sectionChats[sectionId] ?? emptyChat();
      return {
        sectionChats: {
          ...state.sectionChats,
          [sectionId]: { ...chat, messages: [...chat.messages, message] },
        },
      };
    }),
  setSectionEditing: (sectionId, editing) =>
    set((state) => {
      const chat = state.sectionChats[sectionId] ?? emptyChat();
      return {
        sectionChats: {
          ...state.sectionChats,
          [sectionId]: { ...chat, isEditing: editing },
        },
      };
    }),
  resetPhase2: () =>
    set({
      reasoningLog: {},
      sectionChats: {},
      reportSections: {},
      activeSectionId: "1",
      reasoningLogOpen: false,
      highlightedLogId: null,
    }),
}));
