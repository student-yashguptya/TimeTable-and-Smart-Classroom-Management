// src/utils/exportTimetable.js
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

// IMPORTANT ⬇️ import TIME_ROWS to get ALL lecture + break rows
import { TIME_ROWS, DAYS } from "./timetableGenerator";

// 💡 Helper to get timetable cell value
const getCellValue = (timetable, day, slotId, type, breakLabel) => {
  if (type === "break") {
    return breakLabel || "— BREAK —";
  }
  return timetable?.[day]?.[slotId] || "";
};

/* ===========================================================
   🔵 EXPORT PDF (Tea Break + Lunch Break INCLUDED)
   =========================================================== */
export const exportTimetablePDF = (timetable) => {
  const doc = new jsPDF();

  const headRow = ["Time", ...DAYS];

  const bodyRows = TIME_ROWS.map((row) => {
    const { id, label, type, breakLabel } = row;

    return [
      label, // time column
      ...DAYS.map((day) =>
        getCellValue(timetable, day, id, type, breakLabel)
      ),
    ];
  });

  doc.text("Generated Timetable", 14, 16);

  autoTable(doc, {
    head: [headRow],
    body: bodyRows,
    startY: 22,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [30, 136, 229] },
  });

  doc.save("timetable.pdf");
};

/* ===========================================================
   🟢 EXPORT EXCEL (Tea Break + Lunch Break INCLUDED)
   =========================================================== */
export const exportTimetableExcel = (timetable) => {
  const header = ["Time", ...DAYS];
  const data = [header];

  TIME_ROWS.forEach((row) => {
    const { id, label, type, breakLabel } = row;

    const rowData = [
      label,
      ...DAYS.map((day) =>
        getCellValue(timetable, day, id, type, breakLabel)
      ),
    ];

    data.push(rowData);
  });

  const worksheet = XLSX.utils.aoa_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Timetable");

  const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  saveAs(new Blob([buffer]), "timetable.xlsx");
};
