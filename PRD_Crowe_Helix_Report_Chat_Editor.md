# PRD - Crowe Helix Report Chat Editor

## Purpose

Provide a section-aware chat editor for the generated audit report. Managers can ask questions about a section or request a grounded rewrite. Directors review submitted reports but do not edit them.

## Behavior

- Question-like prompts return conversational answers and leave the report unchanged.
- Edit-like prompts stream a full revised section and a one-line edit summary.
- Every answer or edit records a reasoning trace in the agent log.
- Safe-mode fallback supports all suggestion chips without calling the model.

## Lifecycle

Draft and returned reports are editable by managers. Submitted and approved reports are locked. Directors can approve or return with notes.