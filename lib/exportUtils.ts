import type { DifferentiatedTask, RubricCriterion, TaskInput } from "@/types";

export function buildExportFilename(subject: string, extension: "pdf" | "docx"): string {
  const safeSubject = subject
    .replace(/[^\w\sğüşıöçĞÜŞİÖÇ-]/gi, "")
    .replace(/\s+/g, "_")
    .slice(0, 40);
  const date = new Date().toISOString().slice(0, 10);
  return `UyarlaAI_${safeSubject || "gorev"}_${date}.${extension}`;
}

export interface ExportData {
  taskInput: TaskInput;
  tasks: DifferentiatedTask[];
  rubrics: RubricCriterion[][];
}

const LEVEL_LABELS: Record<number, string> = {
  1: "Başlangıç",
  2: "Gelişmekte",
  3: "Yeterli",
};

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function buildPrintableHtml(data: ExportData): HTMLElement {
  const { taskInput, tasks, rubrics } = data;
  const { studentProfile } = taskInput;

  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.left = "-9999px";
  container.style.top = "0";
  container.style.width = "794px";
  container.style.padding = "40px";
  container.style.backgroundColor = "#ffffff";
  container.style.color = "#0f172a";
  container.style.fontFamily = "Arial, Helvetica, sans-serif";
  container.style.fontSize = "14px";
  container.style.lineHeight = "1.5";

  const tasksHtml = tasks
    .map((task, index) => {
      const rubric = rubrics[index] ?? [];
      const rubricHtml =
        rubric.length > 0
          ? `<table style="width:100%;border-collapse:collapse;margin-top:8px;font-size:12px;">
              <thead>
                <tr>
                  <th style="border:1px solid #cbd5e1;padding:6px;background:#f1f5f9;text-align:left;">Kriter</th>
                  ${[1, 2, 3]
                    .map(
                      (s) =>
                        `<th style="border:1px solid #cbd5e1;padding:6px;background:#f1f5f9;text-align:left;">${LEVEL_LABELS[s]}</th>`
                    )
                    .join("")}
                </tr>
              </thead>
              <tbody>
                ${rubric
                  .map((c) => {
                    const byScore: Record<number, string> = {};
                    c.levels.forEach((l) => {
                      byScore[l.score] = l.description;
                    });
                    return `<tr>
                      <td style="border:1px solid #cbd5e1;padding:6px;font-weight:600;">${escapeHtml(
                        c.criterion
                      )}</td>
                      ${[1, 2, 3]
                        .map(
                          (s) =>
                            `<td style="border:1px solid #cbd5e1;padding:6px;">${escapeHtml(
                              byScore[s] ?? "-"
                            )}</td>`
                        )
                        .join("")}
                    </tr>`;
                  })
                  .join("")}
              </tbody>
            </table>`
          : "";

      return `<div style="margin-top:16px;padding:16px;border:1px solid #e2e8f0;border-radius:8px;page-break-inside:avoid;">
          <div style="font-size:12px;font-weight:700;text-transform:uppercase;color:#2563eb;">${escapeHtml(
            task.dimension
          )} · Zorluk ${task.difficultyLevel}/5</div>
          <div style="font-size:16px;font-weight:700;margin-top:4px;">${escapeHtml(
            task.title
          )}</div>
          <div style="margin-top:6px;color:#334155;white-space:pre-line;">${escapeHtml(
            task.description
          )}</div>
          ${rubricHtml}
        </div>`;
    })
    .join("");

  container.innerHTML = `
    <div style="border-bottom:3px solid #2563eb;padding-bottom:12px;margin-bottom:16px;">
      <div style="font-size:24px;font-weight:800;color:#1e3a8a;">UyarlaAI</div>
      <div style="font-size:13px;color:#64748b;">Farklılaştırılmış BT Görev Raporu</div>
    </div>
    <div style="padding:12px;background:#f8fafc;border-radius:8px;font-size:13px;">
      <div><strong>Kazanım:</strong> ${escapeHtml(taskInput.learningObjective)}</div>
      <div style="margin-top:4px;"><strong>Ders/Konu:</strong> ${escapeHtml(
        taskInput.subject
      )} &nbsp;|&nbsp; <strong>Sınıf:</strong> ${escapeHtml(taskInput.gradeLevel)}</div>
      <div style="margin-top:4px;"><strong>Öğrenci Profili:</strong> Hazırbulunuşluk: ${escapeHtml(
        studentProfile.readinessLevel
      )}, İlgi: ${escapeHtml(studentProfile.interestArea)}, Hız: ${escapeHtml(
    studentProfile.learningPace
  )}</div>
    </div>
    ${tasksHtml}
    <div style="margin-top:20px;font-size:11px;color:#94a3b8;text-align:center;">
      UyarlaAI · Groq AI ile üretilmiştir · ${new Date().toLocaleDateString("tr-TR")}
    </div>
  `;

  return container;
}

export async function exportToPdf(data: ExportData): Promise<void> {
  const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
    import("jspdf"),
    import("html2canvas"),
  ]);

  const element = buildPrintableHtml(data);
  document.body.appendChild(element);

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      backgroundColor: "#ffffff",
      useCORS: true,
    });

    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    const imgData = canvas.toDataURL("image/png");

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position -= pageHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(buildExportFilename(data.taskInput.subject, "pdf"));
  } finally {
    document.body.removeChild(element);
  }
}

export async function exportToWord(data: ExportData): Promise<void> {
  const [
    { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType },
    { saveAs },
  ] = await Promise.all([import("docx"), import("file-saver")]);

  const { taskInput, tasks, rubrics } = data;
  const { studentProfile } = taskInput;

  const children: (InstanceType<typeof Paragraph> | InstanceType<typeof Table>)[] = [
    new Paragraph({
      children: [new TextRun({ text: "UyarlaAI", bold: true, size: 40, color: "1E3A8A" })],
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: "Farklılaştırılmış BT Görev Raporu",
          size: 22,
          color: "64748B",
        }),
      ],
    }),
    new Paragraph({ text: "" }),
    new Paragraph({
      children: [
        new TextRun({ text: "Kazanım: ", bold: true }),
        new TextRun(taskInput.learningObjective),
      ],
    }),
    new Paragraph({
      children: [
        new TextRun({ text: "Ders/Konu: ", bold: true }),
        new TextRun(`${taskInput.subject}  |  `),
        new TextRun({ text: "Sınıf: ", bold: true }),
        new TextRun(taskInput.gradeLevel),
      ],
    }),
    new Paragraph({
      children: [
        new TextRun({ text: "Öğrenci Profili: ", bold: true }),
        new TextRun(
          `Hazırbulunuşluk: ${studentProfile.readinessLevel}, İlgi: ${studentProfile.interestArea}, Hız: ${studentProfile.learningPace}`
        ),
      ],
    }),
    new Paragraph({ text: "" }),
  ];

  tasks.forEach((task, index) => {
    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [
          new TextRun({
            text: `${task.dimension.toUpperCase()} · Zorluk ${task.difficultyLevel}/5`,
            bold: true,
            color: "2563EB",
          }),
        ],
      }),
      new Paragraph({
        children: [new TextRun({ text: task.title, bold: true, size: 26 })],
      }),
      new Paragraph({ children: [new TextRun(task.description)] })
    );

    const rubric = rubrics[index] ?? [];
    if (rubric.length > 0) {
      children.push(
        new Paragraph({
          children: [new TextRun({ text: "Değerlendirme Rubriği", bold: true, italics: true })],
        }),
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  children: [new Paragraph({ children: [new TextRun({ text: "Kriter", bold: true })] })],
                }),
                ...[1, 2, 3].map(
                  (s) =>
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [new TextRun({ text: LEVEL_LABELS[s], bold: true })],
                        }),
                      ],
                    })
                ),
              ],
            }),
            ...rubric.map((c) => {
              const byScore: Record<number, string> = {};
              c.levels.forEach((l) => {
                byScore[l.score] = l.description;
              });
              return new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: c.criterion, bold: true })] })],
                  }),
                  ...[1, 2, 3].map(
                    (s) =>
                      new TableCell({
                        children: [new Paragraph(byScore[s] ?? "-")],
                      })
                  ),
                ],
              });
            }),
          ],
        })
      );
    }

    children.push(new Paragraph({ text: "" }));
  });

  const doc = new Document({
    sections: [{ children }],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, buildExportFilename(taskInput.subject, "docx"));
}
