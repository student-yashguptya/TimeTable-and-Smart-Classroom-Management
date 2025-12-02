// src/utils/timetableGenerator.js

export const generateTimetable = () => {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const slots = ["9–10", "10–11", "11–12", "1–2", "2–3", "3–4"];

  const sampleClasses = [
    "CS101 – Dr Smith (A101)",
    "Math102 – Dr Brown (B202)",
    "Physics201 – Dr Alan (Lab 1)",
    "Chem101 – Dr Watson (Lab 3)",
    "AI400 – Dr Ada (C301)",
  ];

  const timetable = {};

  days.forEach((day) => {
    timetable[day] = {};
    slots.forEach((slot) => {
      const random = Math.random();
      timetable[day][slot] =
        random > 0.6 ? sampleClasses[Math.floor(Math.random() * sampleClasses.length)] : "—";
    });
  });

  return timetable;
};
