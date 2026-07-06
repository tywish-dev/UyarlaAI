import type {
  DifferentiatedTask,
  LessonInput,
  LessonPackage,
  RubricCriterion,
} from "@/types";
import { BLOOM_LABELS } from "@/lib/constants/bloom";
import {
  ENVIRONMENT_LABELS,
  EXPRESSION_LABELS,
  MODALITY_LABELS,
} from "@/lib/constants/learningProfile";

export function buildExportFilename(subject: string, extension: "pdf" | "docx"): string {
  const safeSubject = subject
    .replace(/[^\w\sğüşıöçĞÜŞİÖÇ-]/gi, "")
    .replace(/\s+/g, "_")
    .slice(0, 40);
  const date = new Date().toISOString().slice(0, 10);
  return `UyarlaAI_DersPaketi_${safeSubject || "ders"}_${date}.${extension}`;
}

/** @deprecated Use LessonPackageExportData for full package exports */
export interface ExportData {
  taskInput: LessonInput;
  tasks: DifferentiatedTask[];
  rubrics: RubricCriterion[][];
}

export interface LessonPackageExportData {
  lessonInput: LessonInput;
  lessonPackage: LessonPackage;
  tasks: DifferentiatedTask[];
  taskRubrics: RubricCriterion[][];
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

function formatLearningProfile(input: LessonInput): string {
  const { learningProfile } = input.studentProfile;
  const modalities = learningProfile.modalities
    .map((m) => MODALITY_LABELS[m])
    .join(", ");
  return `Hazırbulunuşluk: ${input.studentProfile.readinessLevel}, İlgi: ${input.studentProfile.interestArea}, Modaliteler: ${modalities}, Ortam: ${ENVIRONMENT_LABELS[learningProfile.environment]}, İfade: ${EXPRESSION_LABELS[learningProfile.expression]}`;
}

function buildRubricTableHtml(rubric: RubricCriterion[]): string {
  if (rubric.length === 0) return "";

  return `<table style="width:100%;border-collapse:collapse;margin-top:8px;font-size:12px;">
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
  </table>`;
}

function buildPrintableHtml(data: LessonPackageExportData): HTMLElement {
  const { lessonInput, lessonPackage, tasks, taskRubrics } = data;
  const { metadata } = lessonPackage;

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

  const sectionHeading = (title: string) =>
    `<h2 style="font-size:18px;font-weight:700;color:#1e3a8a;margin-top:24px;margin-bottom:8px;border-bottom:2px solid #e2e8f0;padding-bottom:4px;">${escapeHtml(title)}</h2>`;

  const lessonFlowHtml = lessonPackage.lessonFlow
    .map(
      (phase) =>
        `<div style="margin-top:8px;padding:12px;border:1px solid #e2e8f0;border-radius:8px;">
          <div style="font-weight:700;">${escapeHtml(phase.phase)} · ${escapeHtml(phase.duration)}</div>
          <div style="margin-top:4px;color:#334155;">${escapeHtml(phase.activity)}</div>
          <div style="margin-top:4px;font-size:12px;color:#64748b;"><strong>Öğretmen:</strong> ${escapeHtml(phase.teacherRole)}</div>
        </div>`
    )
    .join("");

  const teacherGuideHtml = lessonPackage.teacherGuide
    .map(
      (section) =>
        `<div style="margin-top:8px;">
          <div style="font-weight:700;">${escapeHtml(section.section)}</div>
          <div style="margin-top:4px;color:#334155;white-space:pre-line;">${escapeHtml(section.content)}</div>
        </div>`
    )
    .join("");

  const tasksHtml = tasks
    .map((task, index) => {
      const rubric = taskRubrics[index] ?? [];
      return `<div style="margin-top:12px;padding:16px;border:1px solid #e2e8f0;border-radius:8px;page-break-inside:avoid;">
        <div style="font-size:12px;font-weight:700;text-transform:uppercase;color:#2563eb;">${escapeHtml(
          task.dimension
        )} · Zorluk ${task.difficultyLevel}/5</div>
        <div style="font-size:16px;font-weight:700;margin-top:4px;">${escapeHtml(task.title)}</div>
        <div style="margin-top:6px;color:#334155;white-space:pre-line;">${escapeHtml(task.description)}</div>
        ${rubric.length > 0 ? buildRubricTableHtml(rubric) : ""}
      </div>`;
    })
    .join("");

  const worksheetHtml = lessonPackage.studentWorksheet
    .map(
      (section) =>
        `<div style="margin-top:8px;padding:12px;border:1px solid #e2e8f0;border-radius:8px;">
          <div style="font-weight:700;">${escapeHtml(section.section)}</div>
          <div style="margin-top:4px;color:#334155;">${escapeHtml(section.instructions)}</div>
          ${
            section.questions.length > 0
              ? `<ol style="margin-top:8px;padding-left:20px;">${section.questions
                  .map((q) => `<li style="margin-top:4px;">${escapeHtml(q)}</li>`)
                  .join("")}</ol>`
              : ""
          }
        </div>`
    )
    .join("");

  const slidesHtml = lessonPackage.presentationOutline
    .map(
      (slide) =>
        `<div style="margin-top:8px;padding:12px;border:1px solid #e2e8f0;border-radius:8px;">
          <div style="font-weight:700;">Slayt ${slide.slideNumber}: ${escapeHtml(slide.title)}</div>
          <div style="margin-top:4px;color:#334155;">${escapeHtml(slide.content)}</div>
          ${
            slide.notes
              ? `<div style="margin-top:4px;font-size:12px;color:#64748b;"><strong>Not:</strong> ${escapeHtml(slide.notes)}</div>`
              : ""
          }
        </div>`
    )
    .join("");

  const assessmentHtml = lessonPackage.assessmentQuestions
    .map(
      (item, index) =>
        `<div style="margin-top:8px;padding:12px;border:1px solid #e2e8f0;border-radius:8px;">
          <div style="font-size:12px;color:#2563eb;font-weight:700;">${escapeHtml(item.type.replace(/_/g, " "))} · Soru ${index + 1}</div>
          <div style="margin-top:4px;font-weight:600;">${escapeHtml(item.question)}</div>
          ${
            item.options?.length
              ? `<ul style="margin-top:4px;padding-left:20px;">${item.options
                  .map((o) => `<li>${escapeHtml(o)}</li>`)
                  .join("")}</ul>`
              : ""
          }
          ${
            item.answer
              ? `<div style="margin-top:4px;font-size:12px;color:#64748b;"><strong>Yanıt:</strong> ${escapeHtml(item.answer)}</div>`
              : ""
          }
        </div>`
    )
    .join("");

  container.innerHTML = `
    <div style="border-bottom:3px solid #2563eb;padding-bottom:12px;margin-bottom:16px;">
      <div style="font-size:24px;font-weight:800;color:#1e3a8a;">UyarlaAI</div>
      <div style="font-size:13px;color:#64748b;">Ders Hazırlama Paketi</div>
    </div>
    <div style="padding:12px;background:#f8fafc;border-radius:8px;font-size:13px;">
      <div><strong>Kazanım:</strong> ${escapeHtml(lessonInput.learningObjective)}</div>
      <div style="margin-top:4px;"><strong>Ders/Konu:</strong> ${escapeHtml(metadata.subject)} &nbsp;|&nbsp; <strong>Sınıf:</strong> ${escapeHtml(metadata.gradeLevel)} &nbsp;|&nbsp; <strong>Süre:</strong> ${metadata.durationMinutes} dk &nbsp;|&nbsp; <strong>Bloom:</strong> ${escapeHtml(BLOOM_LABELS[metadata.bloomLevel])}</div>
      <div style="margin-top:4px;"><strong>TYMM:</strong> Çıktı: ${escapeHtml(metadata.tymm.learningOutcome)} · Beceri: ${escapeHtml(metadata.tymm.skill)} · Değer: ${escapeHtml(metadata.tymm.value)} · Eğilim: ${escapeHtml(metadata.tymm.disposition)}</div>
      <div style="margin-top:4px;"><strong>Öğrenci Profili:</strong> ${escapeHtml(formatLearningProfile(lessonInput))}</div>
    </div>
    ${sectionHeading("Ders Akışı")}
    ${lessonFlowHtml}
    ${sectionHeading("Öğretmen Yönergesi")}
    ${teacherGuideHtml}
    ${sectionHeading("Farklılaştırılmış Görevler")}
    ${tasksHtml}
    ${sectionHeading("Öğrenci Çalışma Kağıdı")}
    ${worksheetHtml}
    ${sectionHeading("Sunum Önerisi")}
    ${slidesHtml}
    ${sectionHeading("Değerlendirme Rubriği")}
    ${buildRubricTableHtml(lessonPackage.rubric)}
    ${sectionHeading("Ölçme Soruları")}
    ${assessmentHtml}
    <div style="margin-top:20px;font-size:11px;color:#94a3b8;text-align:center;">
      UyarlaAI · Groq AI ile üretilmiştir · ${new Date().toLocaleDateString("tr-TR")}
    </div>
  `;

  return container;
}

export async function exportLessonPackageToPdf(
  data: LessonPackageExportData
): Promise<void> {
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

    pdf.save(buildExportFilename(data.lessonInput.subject, "pdf"));
  } finally {
    document.body.removeChild(element);
  }
}

export async function exportLessonPackageToWord(
  data: LessonPackageExportData
): Promise<void> {
  const [
    { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType },
    { saveAs },
  ] = await Promise.all([import("docx"), import("file-saver")]);

  const { lessonInput, lessonPackage, tasks, taskRubrics } = data;
  const { metadata } = lessonPackage;

  const children: (InstanceType<typeof Paragraph> | InstanceType<typeof Table>)[] = [
    new Paragraph({
      children: [new TextRun({ text: "UyarlaAI", bold: true, size: 40, color: "1E3A8A" })],
    }),
    new Paragraph({
      children: [
        new TextRun({ text: "Ders Hazırlama Paketi", size: 22, color: "64748B" }),
      ],
    }),
    new Paragraph({ text: "" }),
    new Paragraph({
      children: [
        new TextRun({ text: "Kazanım: ", bold: true }),
        new TextRun(lessonInput.learningObjective),
      ],
    }),
    new Paragraph({
      children: [
        new TextRun({ text: "Ders/Konu: ", bold: true }),
        new TextRun(`${metadata.subject}  |  `),
        new TextRun({ text: "Sınıf: ", bold: true }),
        new TextRun(`${metadata.gradeLevel}  |  `),
        new TextRun({ text: "Süre: ", bold: true }),
        new TextRun(`${metadata.durationMinutes} dk  |  `),
        new TextRun({ text: "Bloom: ", bold: true }),
        new TextRun(BLOOM_LABELS[metadata.bloomLevel]),
      ],
    }),
    new Paragraph({
      children: [
        new TextRun({ text: "TYMM: ", bold: true }),
        new TextRun(
          `Çıktı: ${metadata.tymm.learningOutcome} · Beceri: ${metadata.tymm.skill} · Değer: ${metadata.tymm.value} · Eğilim: ${metadata.tymm.disposition}`
        ),
      ],
    }),
    new Paragraph({
      children: [
        new TextRun({ text: "Öğrenci Profili: ", bold: true }),
        new TextRun(formatLearningProfile(lessonInput)),
      ],
    }),
    new Paragraph({ text: "" }),
  ];

  const addHeading = (text: string) => {
    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun({ text, bold: true, color: "1E3A8A" })],
      })
    );
  };

  const addRubricTable = (rubric: RubricCriterion[]) => {
    if (rubric.length === 0) return;
    children.push(
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
  };

  addHeading("Ders Akışı");
  lessonPackage.lessonFlow.forEach((phase) => {
    children.push(
      new Paragraph({
        children: [
          new TextRun({ text: `${phase.phase} · ${phase.duration}`, bold: true }),
        ],
      }),
      new Paragraph(phase.activity),
      new Paragraph({
        children: [
          new TextRun({ text: "Öğretmen: ", bold: true }),
          new TextRun(phase.teacherRole),
        ],
      })
    );
  });

  addHeading("Öğretmen Yönergesi");
  lessonPackage.teacherGuide.forEach((section) => {
    children.push(
      new Paragraph({
        children: [new TextRun({ text: section.section, bold: true })],
      }),
      new Paragraph(section.content)
    );
  });

  addHeading("Farklılaştırılmış Görevler");
  tasks.forEach((task, index) => {
    children.push(
      new Paragraph({
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
      new Paragraph(task.description)
    );
    addRubricTable(taskRubrics[index] ?? []);
    children.push(new Paragraph({ text: "" }));
  });

  addHeading("Öğrenci Çalışma Kağıdı");
  lessonPackage.studentWorksheet.forEach((section) => {
    children.push(
      new Paragraph({
        children: [new TextRun({ text: section.section, bold: true })],
      }),
      new Paragraph(section.instructions)
    );
    section.questions.forEach((q, i) => {
      children.push(new Paragraph(`${i + 1}. ${q}`));
    });
  });

  addHeading("Sunum Önerisi");
  lessonPackage.presentationOutline.forEach((slide) => {
    children.push(
      new Paragraph({
        children: [
          new TextRun({ text: `Slayt ${slide.slideNumber}: ${slide.title}`, bold: true }),
        ],
      }),
      new Paragraph(slide.content)
    );
    if (slide.notes) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: "Not: ", bold: true }),
            new TextRun(slide.notes),
          ],
        })
      );
    }
  });

  addHeading("Değerlendirme Rubriği");
  addRubricTable(lessonPackage.rubric);

  addHeading("Ölçme Soruları");
  lessonPackage.assessmentQuestions.forEach((item, index) => {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `${item.type.replace(/_/g, " ")} · Soru ${index + 1}`,
            bold: true,
            color: "2563EB",
          }),
        ],
      }),
      new Paragraph(item.question)
    );
    item.options?.forEach((option) => {
      children.push(new Paragraph(`• ${option}`));
    });
    if (item.answer) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: "Yanıt: ", bold: true }),
            new TextRun(item.answer),
          ],
        })
      );
    }
  });

  const doc = new Document({ sections: [{ children }] });
  const blob = await Packer.toBlob(doc);
  saveAs(blob, buildExportFilename(lessonInput.subject, "docx"));
}

export async function exportToPdf(data: LessonPackageExportData): Promise<void> {
  return exportLessonPackageToPdf(data);
}

export async function exportToWord(data: LessonPackageExportData): Promise<void> {
  return exportLessonPackageToWord(data);
}
