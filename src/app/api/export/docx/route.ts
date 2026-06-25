import { NextRequest } from "next/server";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  AlignmentType,
} from "docx";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const INDIGO = "011E41";
const AMBER = "F5A800";

interface SectionPayload {
  title: string;
  content: string;
}

/** Parse inline **bold** into docx TextRuns. */
function inlineRuns(text: string, opts: { bold?: boolean; size?: number } = {}) {
  const size = opts.size ?? 21; // half-points (10.5pt)
  const parts = text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
  return parts.map((p) => {
    const isBold = p.startsWith("**") && p.endsWith("**");
    return new TextRun({
      text: isBold ? p.slice(2, -2) : p,
      bold: opts.bold || isBold,
      size,
      color: "1c2a3a",
    });
  });
}

function stripMd(text: string): string {
  return text.replace(/\*\*/g, "").replace(/`/g, "").trim();
}

function buildTable(rows: string[][]): Table {
  const header = rows[0];
  const body = rows.slice(1);
  const colCount = header.length;

  const makeCell = (txt: string, isHeader: boolean) =>
    new TableCell({
      width: { size: Math.floor(100 / colCount), type: WidthType.PERCENTAGE },
      shading: isHeader ? { fill: INDIGO } : undefined,
      margins: { top: 60, bottom: 60, left: 100, right: 100 },
      children: [
        new Paragraph({
          children: [
            new TextRun({
              text: stripMd(txt),
              bold: isHeader,
              color: isHeader ? "FFFFFF" : "1c2a3a",
              size: 18,
            }),
          ],
        }),
      ],
    });

  const tableRows = [
    new TableRow({
      tableHeader: true,
      children: header.map((h) => makeCell(h, true)),
    }),
    ...body.map(
      (r) =>
        new TableRow({
          children: Array.from({ length: colCount }, (_, i) =>
            makeCell(r[i] ?? "", false)
          ),
        })
    ),
  ];

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: tableRows,
    borders: {
      top: { style: BorderStyle.SINGLE, size: 2, color: "D5DAE2" },
      bottom: { style: BorderStyle.SINGLE, size: 2, color: "D5DAE2" },
      left: { style: BorderStyle.SINGLE, size: 2, color: "D5DAE2" },
      right: { style: BorderStyle.SINGLE, size: 2, color: "D5DAE2" },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "E4E8EF" },
      insideVertical: { style: BorderStyle.SINGLE, size: 1, color: "E4E8EF" },
    },
  });
}

/** Convert one section's markdown into docx block elements. */
function markdownToBlocks(md: string): (Paragraph | Table)[] {
  const blocks: (Paragraph | Table)[] = [];
  // Drop json sidecar.
  const clean = md.replace(/```json[\s\S]*?```/g, "").replace(/```[\s\S]*?```/g, "");
  const lines = clean.split("\n");

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      i++;
      continue;
    }

    // Table block
    if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
      const tableLines: string[] = [];
      while (
        i < lines.length &&
        lines[i].trim().startsWith("|") &&
        lines[i].trim().endsWith("|")
      ) {
        tableLines.push(lines[i].trim());
        i++;
      }
      const rows = tableLines
        .filter((l) => !/^\|[\s:|-]+\|$/.test(l)) // drop separator row
        .map((l) =>
          l
            .slice(1, -1)
            .split("|")
            .map((c) => c.trim())
        );
      if (rows.length > 0) blocks.push(buildTable(rows));
      blocks.push(new Paragraph({ text: "", spacing: { after: 80 } }));
      continue;
    }

    // Headings
    if (trimmed.startsWith("#### ")) {
      blocks.push(
        new Paragraph({
          spacing: { before: 160, after: 60 },
          children: [
            new TextRun({
              text: stripMd(trimmed.slice(5)).toUpperCase(),
              bold: true,
              size: 19,
              color: INDIGO,
            }),
          ],
        })
      );
    } else if (trimmed.startsWith("### ")) {
      blocks.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_3,
          spacing: { before: 200, after: 80 },
          children: [
            new TextRun({
              text: stripMd(trimmed.slice(4)),
              bold: true,
              size: 24,
              color: "002E62",
            }),
          ],
        })
      );
    } else if (trimmed.startsWith("## ")) {
      blocks.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 260, after: 100 },
          border: {
            bottom: { style: BorderStyle.SINGLE, size: 4, color: "D5DAE2", space: 4 },
          },
          children: [
            new TextRun({
              text: stripMd(trimmed.slice(3)),
              bold: true,
              size: 30,
              color: INDIGO,
            }),
          ],
        })
      );
    } else if (trimmed.startsWith("> ")) {
      blocks.push(
        new Paragraph({
          spacing: { before: 80, after: 80 },
          indent: { left: 240 },
          border: {
            left: { style: BorderStyle.SINGLE, size: 12, color: AMBER, space: 8 },
          },
          children: [
            new TextRun({
              text: stripMd(trimmed.slice(2)),
              italics: true,
              size: 20,
              color: "2a3a4d",
            }),
          ],
        })
      );
    } else if (/^[-*]\s+/.test(trimmed)) {
      blocks.push(
        new Paragraph({
          bullet: { level: 0 },
          spacing: { after: 40 },
          children: inlineRuns(trimmed.replace(/^[-*]\s+/, "")),
        })
      );
    } else if (/^\d+\.\s+/.test(trimmed)) {
      blocks.push(
        new Paragraph({
          numbering: { reference: "num", level: 0 },
          spacing: { after: 40 },
          children: inlineRuns(trimmed.replace(/^\d+\.\s+/, "")),
        })
      );
    } else {
      blocks.push(
        new Paragraph({
          spacing: { after: 120 },
          children: inlineRuns(trimmed),
        })
      );
    }
    i++;
  }
  return blocks;
}

export async function POST(req: NextRequest) {
  const { sections } = (await req.json()) as { sections: SectionPayload[] };

  const children: (Paragraph | Table)[] = [
    new Paragraph({
      alignment: AlignmentType.LEFT,
      children: [
        new TextRun({
          text: "MERIDIAN NATIONAL BANK - INTERNAL AUDIT",
          bold: true,
          size: 18,
          color: AMBER,
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 40 },
      children: [
        new TextRun({
          text: "FY2026 Audit Report - Capital Planning & Capital Adequacy",
          bold: true,
          size: 36,
          color: INDIGO,
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 240 },
      children: [
        new TextRun({
          text: "IA-RPT-2026-014 | Draft - Pending Approval | Internal Use Only",
          size: 18,
          color: "828282",
        }),
      ],
    }),
  ];

  for (const s of sections) {
    children.push(...markdownToBlocks(s.content));
  }

  const doc = new Document({
    numbering: {
      config: [
        {
          reference: "num",
          levels: [
            {
              level: 0,
              format: "decimal",
              text: "%1.",
              alignment: AlignmentType.START,
            },
          ],
        },
      ],
    },
    styles: {
      default: {
        document: { run: { font: "Calibri" } },
      },
    },
    sections: [
      {
        properties: { page: { margin: { top: 1000, bottom: 1000, left: 1080, right: 1080 } } },
        children,
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition":
        'attachment; filename="Meridian_FY2026_Capital_Planning_Audit_Report.docx"',
    },
  });
}
