import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Referral, FilterStats } from "../types/referral";
import { formatPhoneNumber } from "./formatPhoneNumber";
import { formatDateToReadable } from "./formatDateToReadable";
import { TREATMENT_OPTIONS } from "../consts/referral";
import { STATUS_OPTIONS } from "../consts/filters";

export const generateReferralsPdf = (
  referrals: Referral[],
  stats: FilterStats,
  isFiltered: boolean
) => {
  const doc = new jsPDF("p", "mm", "a4");


  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, 210, 45, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(255, 255, 255);
  doc.text("Referrals Report", 14, 18);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(148, 163, 184);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 26);
  doc.text(
    isFiltered ? "Filters applied: Active" : "Showing all records",
    14,
    32
  );


  doc.setFillColor(248, 250, 252);
  doc.rect(14, 52, 182, 22, "F");
  doc.setDrawColor(226, 232, 240);
  doc.rect(14, 52, 182, 22, "S");


  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text("TOTAL REFERRALS", 20, 60);
  doc.text("TOTAL VALUE", 65, 60);
  doc.text("ACTIVE REFERRALS", 110, 60);
  doc.text("HIGH PRIORITY", 155, 60);

  doc.setFontSize(13);
  doc.setTextColor(15, 23, 42);
  doc.text(String(stats?.totalReferrals ?? 0), 20, 68);

  doc.setTextColor(22, 101, 52);
  doc.text(`$${stats?.totalValue ?? 0}`, 65, 68);

  doc.setTextColor(15, 23, 42);
  doc.text(String(stats?.activeCount ?? 0), 110, 68);

  doc.setTextColor(153, 27, 27);
  doc.text(String(stats?.highPriorityCount ?? 0), 155, 68);

  const tableData = referrals.map((ref, idx) => {
    const patientDetails = [
      { text: ref.name, isTitleOnly: true },
      ref.age ? { label: "Age: ", value: String(ref.age) } : null,
      ref.phone ? { label: "Phone: ", value: formatPhoneNumber(ref.phone) } : null,
      ref.email ? { label: "Email: ", value: ref.email } : null,
    ].filter(Boolean);

    const referrerName = ref.referredBy?.name || "Unknown Referrer";
    const practiceName =
      ref.referredBy?.practiceName && ref.referredBy?.practiceName !== "Unknown"
        ? ref.referredBy.practiceName
        : "";
    const referralDetails = [
      { label: "Referrer: ", value: referrerName },
      practiceName ? { text: `(${practiceName})`, isSubtext: true } : null,
      { label: "Referred: ", value: formatDateToReadable(ref.createdAt as string, true) },
      ref.scheduledDate
        ? { label: "Scheduled: ", value: formatDateToReadable(ref.scheduledDate as string, true) }
        : null,
    ].filter(Boolean);


    const treatmentLabel =
      TREATMENT_OPTIONS.find((t) => t.key === ref.treatment)?.label ||
      ref.treatment ||
      "N/A";
    const sourceLabel = ref.addedVia || "Direct";
    const treatmentDetails = [
      { label: "Treatment: ", value: treatmentLabel },
      { label: "Source: ", value: sourceLabel },
      ref.appointmentTime ? { label: "Pref. Time: ", value: ref.appointmentTime } : null,
    ].filter(Boolean);


    const statusLabel =
      STATUS_OPTIONS.find((s) => s.value === ref.status)?.label || ref.status;
    const estValStr = ref.estValue ? `$${ref.estValue}` : "";
    const notesStr = ref.reason || ref.notes || "";
    const statusDetails = [
      { label: "Status: ", value: statusLabel },
      ref.priority ? { label: "Priority: ", value: ref.priority } : null,
      estValStr ? { label: "Est. Value: ", value: estValStr } : null,
      notesStr ? { label: "Notes: ", value: notesStr } : null,
    ].filter(Boolean);

    return [
      JSON.stringify(patientDetails),
      JSON.stringify(referralDetails),
      JSON.stringify(treatmentDetails),
      JSON.stringify(statusDetails),
    ];
  });

  autoTable(doc, {
    startY: 82,
    head: [
      [
        "Patient Information",
        "Referral Information",
        "Treatment & Source",
        "Status & Details",
      ],
    ],
    body: tableData,
    theme: "grid",
    rowPageBreak: "avoid",
    headStyles: {
      fillColor: [15, 23, 42],
      textColor: 255,
      fontSize: 10,
      fontStyle: "bold",
    },
    styles: {
      fontSize: 9,
      cellPadding: 4.5,
      valign: "top",
      textColor: [51, 65, 85],
    },
    columnStyles: {
      0: { cellWidth: 45 },
      1: { cellWidth: 50 },
      2: { cellWidth: 42 }, // Treatment & Source
      3: { cellWidth: 45 }, // Status & Details
    },
    margin: { bottom: 20 },
    didParseCell: (data) => {
      if (data.section === "body") {
        try {
          const rawVal = data.cell.raw;
          if (typeof rawVal === "string" && (rawVal.startsWith("[") || rawVal.startsWith("{"))) {
            const parsed = JSON.parse(rawVal);
            if (Array.isArray(parsed)) {
              (data.cell as any).rawContent = parsed;

              // Build plain text lines for height calculation
              const plainLines: string[] = [];
              parsed.forEach((item: any) => {
                if (item.text) {
                  plainLines.push(item.text);
                } else if (item.label && item.value) {
                  plainLines.push(`${item.label}${item.value}`);
                }
              });
              data.cell.text = plainLines;
              data.cell.styles.fontSize = 9.5;
            }
          }
        } catch (e) {
          // Fallback if not JSON (e.g. S.No column)
        }
      }
    },
    willDrawCell: (data) => {
      if (data.section === "body") {
        if ((data.cell as any).rawContent) {
          // Store parsed text lines and clear cell.text so autotable renders an empty cell
          (data.cell as any).rawTextLines = data.cell.text;
          data.cell.text = [];
        }
      }
    },
    didDrawCell: (data) => {
      if (data.section === "body") {
        const rawContent = (data.cell as any).rawContent;
        if (!rawContent) return; // Let default rendering handle S.No column

        const doc = data.doc;
        const cell = data.cell;
        const lines = (cell as any).rawTextLines || [];

        let paddingLeft = 4;
        let paddingTop = 4;
        const padding = cell.styles.cellPadding;
        if (typeof padding === "number") {
          paddingLeft = padding;
          paddingTop = padding;
        } else if (padding && typeof padding === "object") {
          paddingLeft = (padding as any).left ?? 4;
          paddingTop = (padding as any).top ?? 4;
        }
        const cellLeft = cell.x + paddingLeft;
        const availableWidth = cell.width - paddingLeft * 2;
        let currentY = cell.y + paddingTop + 3.5; // +3.5 baseline offset

        rawContent.forEach((item: any) => {
          if (item.isTitleOnly) {
            // First line of cell (e.g. Patient Name): bold and larger
            doc.setFont("helvetica", "bold");
            doc.setFontSize(11);
            doc.setTextColor(15, 23, 42); // slate-900

            const titleLines = doc.splitTextToSize(item.text, availableWidth);
            titleLines.forEach((tLine: string) => {
              doc.text(tLine, cellLeft, currentY);
              currentY += 4.5;
            });
            currentY += 0.5; // padding
          } else if (item.label && item.value) {
            // Mixed bold label + normal value (increased font sizes to 9pt)
            doc.setFont("helvetica", "bold");
            doc.setFontSize(9);
            doc.setTextColor(15, 23, 42); // slate-900
            doc.text(item.label, cellLeft, currentY);

            const labelWidth = doc.getTextWidth(item.label);

            doc.setFont("helvetica", "normal");
            doc.setFontSize(9);
            doc.setTextColor(71, 85, 105); // slate-600

            const valLeft = cellLeft + labelWidth;
            const valAvailableWidth = availableWidth - labelWidth;
            const valLines = doc.splitTextToSize(item.value, valAvailableWidth);

            valLines.forEach((vLine: string, vIdx: number) => {
              if (vIdx === 0) {
                doc.text(vLine, valLeft, currentY);
              } else {
                doc.text(vLine, cellLeft + 4, currentY); // Indent wrapped lines
              }
              currentY += 3.8;
            });
          } else if (item.isSubtext) {
            // Normal subtext (referrer practice name)
            doc.setFont("helvetica", "normal");
            doc.setFontSize(8.5);
            doc.setTextColor(100, 116, 139); // slate-500

            const subtextLines = doc.splitTextToSize(item.text, availableWidth);
            subtextLines.forEach((sLine: string) => {
              doc.text(sLine, cellLeft, currentY);
              currentY += 3.6;
            });
          }
        });
      }
    },
    didDrawPage: (data) => {
      // Footer page numbers
      const pageCount = (doc as any).internal.getNumberOfPages();
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text(
        `Page ${data.pageNumber} of ${pageCount}`,
        14,
        doc.internal.pageSize.height - 10
      );
      doc.text(
        "Referrals Management System",
        doc.internal.pageSize.width - 55,
        doc.internal.pageSize.height - 10
      );
    },
  });

  doc.save("referrals_report.pdf");
};
