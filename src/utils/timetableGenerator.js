// src/utils/timetableGenerator.js

// 6-day week
const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// 🔹 All rows that will appear in the UI (time column)
const TIME_ROWS = [
  { id: "9-10", type: "lecture", label: "09:00 – 10:00" },
  { id: "10-11", type: "lecture", label: "10:00 – 11:00" },

  // Tea break (20 minutes) – DISPLAY ONLY (no lectures placed here)
  {
    id: "tea-break",
    type: "break",
    label: "11:00 – 11:20",
    breakLabel: "Tea Break",
  },

  { id: "11-12", type: "lecture", label: "11:20 – 12:20" },

  // Lunch break (1 hour) – DISPLAY ONLY (no lectures placed here)
  {
    id: "lunch-break",
    type: "break",
    label: "12:20 – 13:20",
    breakLabel: "Lunch Break",
  },

  { id: "1-2", type: "lecture", label: "13:20 – 14:20" },
  { id: "2-3", type: "lecture", label: "14:20 – 15:20" },
  { id: "3-4", type: "lecture", label: "15:20 – 16:20" },
];

// Only these IDs are used for placing lectures
const LECTURE_SLOTS = TIME_ROWS.filter((r) => r.type === "lecture").map(
  (r) => r.id
);

// 👉 Each teacher can get at most 3 lectures per week total
const MAX_LECTURES_PER_TEACHER = 3;

/**
 * Generate a clash-free timetable grid from admin-uploaded data.
 *
 * @param {Object} params
 * @param {Array} params.courses  - [{ id, code, name, department, weeklyHours, teacherId }]
 * @param {Array} params.teachers - [{ id, name, ... }]
 * @param {Array} params.rooms    - [{ id, name, ... }]
 * @param {string} params.department - optional branch filter ("CSE", "ME", ...)
 *
 * @returns {Object} timetable[day][slotId] = "Subject – Teacher (Room)"
 */
export function generateTimetable({ courses, teachers, rooms, department }) {
  // 1) Filter courses by department (branch) if provided
  let targetCourses = courses;
  if (department && department.trim()) {
    targetCourses = courses.filter(
      (c) => (c.department || "").toLowerCase() === department.toLowerCase()
    );
  }

  // If no courses for this branch, fall back to all courses
  if (!targetCourses.length) {
    targetCourses = courses;
  }

  // 2) Quick maps / helpers
  const teacherById = new Map(teachers.map((t) => [t.id, t]));
  const roomList = rooms.length ? rooms : [{ id: 0, name: "Room-1" }];

  // 3) Empty timetable grid (lecture slots only)
  const timetable = {};
  DAYS.forEach((day) => {
    timetable[day] = {};
    LECTURE_SLOTS.forEach((slotId) => {
      timetable[day][slotId] = "";
    });
  });

  // 4) Clash prevention + teacher load
  const teacherBusy = {};
  const roomBusy = {};
  const teacherLoad = {};

  for (const t of teachers) {
    teacherLoad[t.id] = 0;
  }

  for (const day of DAYS) {
    teacherBusy[day] = {};
    roomBusy[day] = {};
    for (const slotId of LECTURE_SLOTS) {
      teacherBusy[day][slotId] = new Set();
      roomBusy[day][slotId] = new Set();
    }
  }

  // 5) Greedy placement: go over each course
  for (const course of targetCourses) {
    const teacher = course.teacherId ? teacherById.get(course.teacherId) : null;
    const teacherName = teacher ? teacher.name : "TBD";

    // If weeklyHours is missing, default to 3 per subject
    const weeklyHours = Number(course.weeklyHours || 3);

    // Respect teacher max-3 constraint (across all their courses)
    let remainingForTeacher = weeklyHours;
    if (teacher) {
      const used = teacherLoad[teacher.id] || 0;
      const remainingQuota = MAX_LECTURES_PER_TEACHER - used;
      if (remainingQuota <= 0) {
        // Teacher already fully booked
        continue;
      }
      remainingForTeacher = Math.min(weeklyHours, remainingQuota);
    }

    if (remainingForTeacher <= 0) continue;

    let placedCount = 0;

    outerLoop: while (placedCount < remainingForTeacher) {
      let placedThisIteration = false;

      for (const day of DAYS) {
        for (const slotId of LECTURE_SLOTS) {
          // Already filled this slot on this day?
          if (timetable[day][slotId]) continue;

          // Teacher clash at this time?
          if (teacher && teacherBusy[day][slotId].has(course.teacherId)) {
            continue;
          }

          // Find a free room
          const room = roomList.find(
            (r) => !roomBusy[day][slotId].has(r.id)
          );
          if (!room) continue;

          // Human-readable card text: Subject – Teacher (Room)
          const subjectName = course.name || course.code || "Subject";
          timetable[day][slotId] = `${subjectName} – ${teacherName} (${room.name})`;

          // Mark busy
          if (teacher) {
            teacherBusy[day][slotId].add(course.teacherId);
            teacherLoad[teacher.id] = (teacherLoad[teacher.id] || 0) + 1;
          }
          roomBusy[day][slotId].add(room.id);

          placedCount += 1;
          placedThisIteration = true;

          if (placedCount >= remainingForTeacher) {
            break outerLoop;
          }
        }
      }

      // No free slot found in a full pass → stop to avoid infinite loop
      if (!placedThisIteration) {
        console.warn(
          `Could not place all hours for ${
            course.code || course.name
          }, placed ${placedCount}/${remainingForTeacher}`
        );
        break;
      }
    }
  }

  return timetable;
}

// Export for other parts of the app (grid, export, etc.)
export { DAYS, TIME_ROWS, LECTURE_SLOTS };
