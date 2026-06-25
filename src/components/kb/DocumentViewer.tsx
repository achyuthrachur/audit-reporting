"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { KbDocument } from "@/content/documents";

export function DocumentViewer({ doc }: { doc: KbDocument }) {
  return (
    <div className="flex justify-center px-6 py-8">
      <article className="print-page w-full max-w-3xl rounded-lg bg-surface shadow-paper">
        {/* Letterhead strip */}
        <div className="flex items-start justify-between gap-4 rounded-t-lg border-b-2 border-indigo-dark/10 bg-canvas/60 px-9 py-5">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-amber">
              Meridian National Bank Â· Internal Audit
            </div>
            <div className="mt-1 font-display text-[15px] font-bold leading-tight text-indigo-dark">
              {doc.title}
            </div>
          </div>
          <div className="shrink-0 text-right text-[11px] leading-relaxed text-gray-text">
            <div className="font-mono font-semibold text-indigo-mid">
              {doc.id}
            </div>
            <div>{doc.date}</div>
            <div className="mt-0.5 inline-block rounded bg-indigo-dark/[0.06] px-1.5 py-0.5 font-medium text-indigo-dark">
              {doc.classification}
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="doc-prose px-9 py-8">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{doc.body}</ReactMarkdown>
        </div>

        <div className="border-t border-indigo-dark/[0.06] px-9 py-4 text-[10px] text-gray-text">
          {doc.id} Â· {doc.classification} Â· Synthetic demo document Â· Â© 2026
          Crowe LLP
        </div>
      </article>
    </div>
  );
}
