"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Sparkles, Play } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { TopNav } from "@/components/layout/TopNav";
import { AgentPanel } from "@/components/report/AgentPanel";
import { ReportChatPanel } from "@/components/report/ReportChatPanel";
import { ReviewPanel } from "@/components/report/ReviewPanel";
import { AgentReasoningLog } from "@/components/report/AgentReasoningLog";
import { ReportDocument, type DocBanner } from "@/components/report/ReportDocument";
import { ExportBar } from "@/components/report/ExportBar";
import { FileClock } from "lucide-react";
import { REPORT_STEP_META } from "@/lib/agent/stepMeta";
import { STEP_INSTRUCTIONS, editLogId } from "@/lib/agent/reasoningMeta";
import {
  useAppStore,
  type ReportSectionState,
  type ReasoningEntry,
} from "@/store/appStore";
import type { SSEEvent } from "@/lib/sse";
import {
  saveReport,
  loadReport,
  patchReport,
  loadReturnNotes,
  loadRole,
  type StoredReport,
} from "@/lib/persistence";

function nowLabel(): string {
  return new Date().toLocaleTimeString("en-US", { hour12: false });
}

function freshSections(): ReportSectionState[] {
  return REPORT_STEP_META.map((m) => ({
    id: m.id,
    title: m.title,
    sourceIds: m.sourceIds,
    status: "pending",
    telemetry: "",
    content: "",
  }));
}

export default function ReportPage() {
  const store = useAppStore();
  const {
    sections,
    generationStatus,
    initSections,
    resetGeneration,
    setGenerationStatus,
    setStepStatus,
    setStepTelemetry,
    appendSectionDelta,
    setSectionContent,
    setActiveStep,
    setElapsedSeconds,
    setModelUsed,
    setRanAsFallback,
    upsertReasoningEntry,
    appendReasoningDelta,
    updateReasoningEntry,
    setActiveSectionId,
    addChatMessage,
    setSectionEditing,
    applyEdit,
    setReportStatus,
    setGeneratedAt,
    setSubmittedAt,
    setReturnNotes,
    setRole,
  } = store;

  const [fallbackRequested, setFallbackRequested] = useState(false);
  const [regeneratingId, setRegeneratingId] = useState<number | null>(null);

  const telemetryTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const elapsedTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const startMsRef = useRef(0);

  // Initialize once: hydrate a persisted report from localStorage, else scaffold.
  useEffect(() => {
    // Restore role across hard reloads (Zustand resets on full page load).
    if (!useAppStore.getState().role) {
      const r = loadRole();
      if (r === "director" || r === "manager") setRole(r);
    }
    if (sections.length === 0) {
      const stored = loadReport();
      if (stored) {
        // Rehydrate a completed report (reasoning traces are per-session only).
        initSections(
          stored.sections.map((s) => ({
            id: s.id,
            title: s.title,
            sourceIds: s.sourceIds,
            status: "complete" as const,
            telemetry: "",
            content: s.content,
          }))
        );
        const ids = stored.sections.map((s) => String(s.id));
        const contentById = Object.fromEntries(
          stored.sections.map((s) => [String(s.id), s.content])
        );
        useAppStore.getState().initReportSections(ids, contentById);
        setGeneratedAt(stored.generatedAt);
        setSubmittedAt(stored.submittedAt);
        setReportStatus(stored.status);
        setReturnNotes(loadReturnNotes());
        setActiveSectionId("1");
        setGenerationStatus("complete");
      } else {
        resetGeneration();
        initSections(freshSections());
      }
    }
    return () => {
      if (telemetryTimer.current) clearInterval(telemetryTimer.current);
      if (elapsedTimer.current) clearInterval(elapsedTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Shift+F toggles demo safe-mode (only before generation starts).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.shiftKey && (e.key === "F" || e.key === "f")) {
        if (useAppStore.getState().generationStatus === "idle") {
          setFallbackRequested((v) => !v);
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Cycle the scripted telemetry lines for a given step.
  const startTelemetry = useCallback(
    (stepId: number) => {
      if (telemetryTimer.current) clearInterval(telemetryTimer.current);
      const meta = REPORT_STEP_META.find((m) => m.id === stepId);
      if (!meta) return;
      let idx = 0;
      setStepTelemetry(stepId, meta.telemetry[0]);
      telemetryTimer.current = setInterval(() => {
        idx = Math.min(idx + 1, meta.telemetry.length - 1);
        setStepTelemetry(stepId, meta.telemetry[idx]);
      }, 700);
    },
    [setStepTelemetry]
  );

  const stopElapsed = () => {
    if (elapsedTimer.current) {
      clearInterval(elapsedTimer.current);
      elapsedTimer.current = null;
    }
  };

  // Core SSE consumer.
  const consumeStream = useCallback(
    async (
      body: Record<string, unknown>,
      mode: "full" | "regen"
    ): Promise<void> => {
      const res = await fetch("/api/generate-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.body) throw new Error("no stream");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const frames = buffer.split("\n\n");
        buffer = frames.pop() || "";
        for (const frame of frames) {
          const line = frame.split("\n").find((l) => l.startsWith("data: "));
          if (!line) continue;
          const evt = JSON.parse(line.slice(6)) as SSEEvent;
          handleEvent(evt, mode);
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const handleEvent = useCallback(
    (evt: SSEEvent, mode: "full" | "regen") => {
      switch (evt.type) {
        case "run_start":
          setModelUsed(evt.model);
          if (mode === "full") {
            setGenerationStatus("running");
            startMsRef.current = Date.now();
            stopElapsed();
            elapsedTimer.current = setInterval(() => {
              setElapsedSeconds(
                Math.round((Date.now() - startMsRef.current) / 1000)
              );
            }, 1000);
          }
          break;
        case "step_start": {
          setActiveStep(evt.id);
          setStepStatus(evt.id, "active");
          setSectionContent(evt.id, "");
          startTelemetry(evt.id);
          // Open a reasoning-log entry for this generation step.
          const entry: ReasoningEntry = {
            stepLabel: `Step ${evt.id} â€” ${evt.title}`,
            calledAt: nowLabel(),
            durationMs: 0,
            tokensIn: 0,
            tokensOut: 0,
            sources: evt.sourceIds,
            instruction: STEP_INSTRUCTIONS[evt.id] ?? "",
            reasoning: "",
            isStreaming: true,
            kind: "generation",
          };
          upsertReasoningEntry(String(evt.id), entry);
          break;
        }
        case "reasoning_delta":
          appendReasoningDelta(evt.stepId, evt.delta);
          break;
        case "reasoning_complete":
          updateReasoningEntry(evt.stepId, {
            reasoning: evt.reasoning,
            isStreaming: false,
            ...(evt.tokensIn ? { tokensIn: evt.tokensIn } : {}),
            ...(evt.tokensOut ? { tokensOut: evt.tokensOut } : {}),
            ...(evt.durationMs ? { durationMs: evt.durationMs } : {}),
          });
          break;
        case "section_delta":
          appendSectionDelta(evt.id, evt.delta);
          break;
        case "step_complete":
          if (telemetryTimer.current) clearInterval(telemetryTimer.current);
          setStepStatus(evt.id, "complete");
          setStepTelemetry(evt.id, "");
          // Ensure the entry is no longer marked streaming.
          updateReasoningEntry(String(evt.id), { isStreaming: false });
          break;
        case "run_complete":
          if (mode === "full") {
            stopElapsed();
            setElapsedSeconds(evt.elapsedSeconds);
            setRanAsFallback(evt.ranAsFallback);
            setActiveStep(-1);
            setGenerationStatus("complete");
            // Initialize Phase 2 chat-editing state from the generated sections.
            const cur = useAppStore.getState().sections;
            const ids = cur.map((s) => String(s.id));
            const contentById = Object.fromEntries(
              cur.map((s) => [String(s.id), s.content])
            );
            useAppStore.getState().initReportSections(ids, contentById);
            setActiveSectionId("1");

            // Persist the completed report to localStorage (status: draft).
            const generatedAt = new Date().toISOString();
            const storedReport: StoredReport = {
              sections: cur.map((s) => ({
                id: s.id,
                title: s.title,
                sourceIds: s.sourceIds,
                content: s.content,
              })),
              generatedAt,
              submittedAt: null,
              status: "draft",
            };
            saveReport(storedReport);
            setGeneratedAt(generatedAt);
            setSubmittedAt(null);
            setReportStatus("draft");
            setReturnNotes(null);
          }
          break;
        case "error":
          stopElapsed();
          setGenerationStatus("error");
          break;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [startTelemetry]
  );

  const generate = async () => {
    // Generation is a manager-only capability.
    if (useAppStore.getState().role === "director") return;
    resetGeneration();
    initSections(freshSections());
    setGenerationStatus("running");
    try {
      await consumeStream({ fallback: fallbackRequested }, "full");
    } catch (e) {
      console.error(e);
      setGenerationStatus("error");
    }
  };

  const regenerate = async (id: number) => {
    setRegeneratingId(id);
    setStepStatus(id, "active");
    setSectionContent(id, "");
    const prior = useAppStore
      .getState()
      .sections.filter((s) => s.id < id && s.content)
      .map((s) => ({ title: s.title, content: s.content }));
    try {
      await consumeStream(
        { fallback: fallbackRequested, steps: [id], priorSections: prior },
        "regen"
      );
      setStepStatus(id, "complete");
    } catch (e) {
      console.error(e);
      setStepStatus(id, "complete");
    } finally {
      if (telemetryTimer.current) clearInterval(telemetryTimer.current);
      setStepTelemetry(id, "");
      setRegeneratingId(null);
    }
  };

  // ---- Phase 2: section chat edit ----
  const editSection = async (sectionId: string, userMessage: string) => {
    const state = useAppStore.getState();
    const numId = Number(sectionId);
    const section = state.sections.find((s) => s.id === numId);
    if (!section) return;

    const originalContent =
      state.reportSections[sectionId]?.content ?? section.content;
    const editIndex = state.sectionChats[sectionId]?.editCount ?? 0;
    const logId = editLogId(sectionId, editIndex);

    // Record the user's message immediately.
    addChatMessage(sectionId, { role: "user", content: userMessage });
    setSectionEditing(sectionId, true);

    // Open a reasoning-log entry for this edit.
    upsertReasoningEntry(logId, {
      stepLabel: section.title,
      calledAt: nowLabel(),
      durationMs: 0,
      tokensIn: 0,
      tokensOut: 0,
      sources: section.sourceIds,
      instruction: userMessage,
      reasoning: "",
      isStreaming: true,
      kind: "edit",
    });

    // Note: we do NOT clear the section up front. If this turns out to be an
    // EDIT, we clear on the first section_delta; if it's an ANSWER (question),
    // the section is left untouched.
    let summaryText = "";
    let answerText = "";
    let isAnswer = false;
    let clearedForEdit = false;
    let failed = false;
    try {
      const res = await fetch("/api/edit-section", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sectionId,
          currentContent: originalContent,
          userMessage,
          conversationHistory:
            state.sectionChats[sectionId]?.messages.map((m) => ({
              role: m.role,
              content: m.content,
            })) ?? [],
          allSections: state.sections.map((s) => ({
            id: String(s.id),
            label: s.title,
            content: s.content,
          })),
          logId,
          fallback: fallbackRequested,
        }),
      });
      if (!res.body) throw new Error("no stream");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const frames = buffer.split("\n\n");
        buffer = frames.pop() || "";
        for (const frame of frames) {
          const line = frame.split("\n").find((l) => l.startsWith("data: "));
          if (!line) continue;
          const evt = JSON.parse(line.slice(6)) as SSEEvent;
          switch (evt.type) {
            case "reasoning_delta":
              appendReasoningDelta(evt.stepId, evt.delta);
              break;
            case "reasoning_complete":
              updateReasoningEntry(evt.stepId, {
                reasoning: evt.reasoning,
                isStreaming: false,
                ...(evt.tokensIn ? { tokensIn: evt.tokensIn } : {}),
                ...(evt.tokensOut ? { tokensOut: evt.tokensOut } : {}),
                ...(evt.durationMs ? { durationMs: evt.durationMs } : {}),
              });
              break;
            case "section_delta":
              // First edit token â†’ clear the section, then stream in place.
              if (!clearedForEdit) {
                clearedForEdit = true;
                setSectionContent(numId, "");
              }
              appendSectionDelta(numId, evt.delta);
              break;
            case "chat_delta":
              isAnswer = true;
              answerText += evt.delta;
              break;
            case "chat_complete":
              isAnswer = true;
              answerText = evt.content;
              break;
            case "edit_summary":
              summaryText = evt.summary;
              break;
            case "edit_complete": {
              // applyEdit reads prev from reportSections (already holds the
              // pre-edit content), so no need to reset sections first.
              applyEdit(sectionId, evt.content);
              // Persist updated section content (preserve status/timestamps).
              const st = useAppStore.getState();
              patchReport({
                sections: st.sections.map((s) => ({
                  id: s.id,
                  title: s.title,
                  sourceIds: s.sourceIds,
                  content: s.content,
                })),
              });
              break;
            }
            case "error":
              console.error("[edit] stream error");
              break;
          }
        }
      }
    } catch (e) {
      console.error(e);
      failed = true;
      // Restore original content if we had begun replacing it.
      if (clearedForEdit) setSectionContent(numId, originalContent);
    } finally {
      updateReasoningEntry(logId, { isStreaming: false });
      if (failed) {
        addChatMessage(sectionId, {
          role: "assistant",
          content:
            "âš ï¸ That didn't complete â€” the request couldn't reach the server. Please try again.",
        });
        store.showToast("Request failed â€” please retry", "error");
      } else if (isAnswer) {
        // Question / info request â€” show the answer, leave the section as-is.
        addChatMessage(sectionId, {
          role: "assistant",
          content: answerText || "(no answer returned)",
          reasoningLogId: logId,
        });
      } else {
        addChatMessage(sectionId, {
          role: "assistant",
          content: summaryText || "Section revised per your instruction.",
          reasoningLogId: logId,
        });
      }
      setSectionEditing(sectionId, false);
    }
  };

  const charCount = sections.reduce((n, s) => n + s.content.length, 0);
  const isComplete = generationStatus === "complete";

  // ---- role / lifecycle derived view state ----
  // Generation is a MANAGER capability. Anyone who is not explicitly a manager
  // (director, or not-yet-hydrated/unknown) gets the read-only reviewer view â€”
  // this also closes the role-hydration race where the Run button could flash.
  const role = store.role;
  const isManager = role === "manager";
  const isReviewer = !isManager; // director or unknown â†’ review / read-only
  const reportStatus = store.reportStatus;
  const returnNotes = store.returnNotes;
  const reportExists = isComplete;

  const rightEditable =
    isManager && (reportStatus === "draft" || reportStatus === "returned");

  const statusBanner: DocBanner = (() => {
    if (!isComplete) return null;
    if (isReviewer) {
      if (reportStatus === "submitted")
        return { variant: "amber", text: "Submitted for Review â€” read-only" };
      if (reportStatus === "approved") return { variant: "teal", text: "Approved" };
      if (reportStatus === "returned")
        return { variant: "red", text: "Returned to manager â€” Needs Revision" };
      return { variant: "neutral", text: "Draft â€” Not Submitted" };
    }
    if (reportStatus === "returned")
      return { variant: "red", text: "Returned for Revision" };
    if (reportStatus === "submitted")
      return { variant: "amber", text: "Submitted for Review" };
    if (reportStatus === "approved") return { variant: "teal", text: "Approved" };
    return null; // manager draft â†’ default completion banner
  })();

  const directorNotes =
    isManager && reportStatus === "returned" ? returnNotes : null;

  const renderLeftPanel = () => {
    if (isManager) {
      if (isComplete) return <ReportChatPanel key="chat" onSend={editSection} />;
      return (
        <AgentPanel
          key="agent"
          charCount={charCount}
          fallbackActive={fallbackRequested}
        />
      );
    }
    // Reviewer (director / unknown): never generates.
    if (!reportExists)
      return (
        <DirectorEmpty
          key="dir-noplan"
          title="No report generated yet"
          subtitle="The audit manager has not generated a report for this audit."
        />
      );
    if (reportStatus === "draft")
      return (
        <DirectorEmpty
          key="dir-draft"
          title="No report submitted for review yet"
          subtitle="The audit manager is still drafting. You'll be able to review once it is submitted."
        />
      );
    return <ReviewPanel key="review" />;
  };

  return (
    <div className="flex h-screen flex-col bg-canvas">
      <TopNav current={isComplete ? 4 : 3} />
      <div className="flex min-h-0 flex-1">
        {/* Left column â€” active panel + persistent reasoning log */}
        <div className="no-print flex w-96 shrink-0 flex-col bg-indigo-dark">
          <div className="min-h-0 flex-1 overflow-hidden">
            <AnimatePresence mode="wait">{renderLeftPanel()}</AnimatePresence>
          </div>
          <AgentReasoningLog />
        </div>

        <div className="relative flex min-w-0 flex-1 flex-col">
          <ReportDocument
            canEdit
            editable={rightEditable}
            statusBanner={statusBanner}
            directorNotes={directorNotes}
            onRegenerate={regenerate}
            regeneratingId={regeneratingId}
          />

          {/* Idle overlay */}
          {generationStatus === "idle" && (
            <div className="no-print pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="pointer-events-auto flex flex-col items-center gap-3 rounded-2xl border border-indigo-dark/10 bg-canvas px-8 py-7 shadow-lift">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber/15">
                  {isManager ? (
                    <Sparkles className="h-6 w-6 text-amber" />
                  ) : (
                    <FileClock className="h-6 w-6 text-amber" />
                  )}
                </div>
                {!isManager ? (
                  <div className="max-w-xs text-center">
                    <div className="font-display text-lg font-bold text-indigo-dark">
                      Awaiting report
                    </div>
                    <div className="mt-0.5 text-xs text-gray-text">
                      Awaiting report generation by audit manager.
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="text-center">
                      <div className="font-display text-lg font-bold text-indigo-dark">
                        Generate FY2026 Audit Report
                      </div>
                      <div className="mt-0.5 max-w-xs text-xs text-gray-text">
                        The reporting agent will read 8 knowledge-base documents
                        and draft 7 sections via sequential GPT-5.5 calls.
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={generate}
                      className="inline-flex items-center gap-2 rounded-xl bg-amber px-6 py-3 text-sm font-bold text-indigo-dark transition hover:-translate-y-0.5 hover:bg-amber-light"
                    >
                      <Play className="h-4 w-4" fill="currentColor" />
                      Run Reporting Agent
                    </button>
                    {fallbackRequested && (
                      <div className="text-[10px] font-semibold uppercase tracking-wide text-gray-text">
                        Demo safe-mode armed (Shift+F)
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}

          {isComplete && <ExportBar />}
        </div>
      </div>
    </div>
  );
}

function DirectorEmpty({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 bg-indigo-dark px-6 text-center text-white">
      <FileClock className="h-8 w-8 text-white/30" />
      <div className="font-display text-base font-bold text-white/85">
        {title}
      </div>
      <div className="max-w-[16rem] text-[12px] text-white/45">{subtitle}</div>
    </div>
  );
}
