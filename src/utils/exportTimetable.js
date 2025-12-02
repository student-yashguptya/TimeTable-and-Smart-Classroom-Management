// src/utils/exportTimetable.js
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const exportTimetablePDF = (timetable) => {
  const doc = new jsPDF();
  const days = Object.keys(timetable);
  const slots = Object.keys(timetable[days[0]]);

  const tableData = slots.map((slot) => [
    slot,
    ...days.map((day) => timetable[day][slot]),
  ]);

  doc.text("Generated Timetable", 14, 16);

  doc.autoTable({
    head: [["Time", ...days]],
    body: tableData,
    startY: 20,
  });

  doc.save("timetable.pdf");
};

export const exportTimetableExcel = (timetable) => {
  const days = Object.keys(timetable);
  const slots = Object.keys(timetable[days[0]]);

  const data = [["Time", ...days]];

  slots.forEach((slot) => {
    data.push([slot, ...days.map((d) => timetable[d][slot])]);
  });

  const ws = XLSX.utils.aoa_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Timetable");

  const excelBuffer = XLSX.write(wb, {
    bookType: "xlsx",
    type: "array",
  });

  saveAs(new Blob([excelBuffer]), "timetable.xlsx");
};
