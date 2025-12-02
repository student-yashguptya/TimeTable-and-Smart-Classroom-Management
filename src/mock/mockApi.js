// src/mock/mockApi.js

let courses = [
  {
    id: 1,
    code: "CS101",
    name: "Introduction to Programming",
    semester: "1",
    department: "CSE",
    weeklyHours: 4,
    teacherId: 1,
  },
];

let teachers = [
  {
    id: 1,
    name: "Dr. Alan Turing",
    email: "alan.turing@university.edu",
    department: "CSE",
    totalLectures: 12,
    subjects: ["CS101"],
  },
];

let rooms = [
  {
    id: 1,
    name: "LH-101",
    type: "Lecture Hall",
    capacity: 80,
  },
];

let subjects = [
  { id: "CS101", name: "Introduction to Programming" },
  { id: "CS102", name: "Data Structures" },
  { id: "CS201", name: "Algorithms" },
];

let timetable = [
  {
    id: 1,
    day: "Monday",
    slot: "9:00 - 10:00",
    subject: "CS101",
    room: "LH-101",
    teacher: "Dr. Alan Turing",
  },
];

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

export const mockApi = {
  // COURSES
  async getCourses() {
    await delay(200);
    return [...courses];
  },
  async addCourse(course) {
    await delay(200);
    const newCourse = { id: Date.now(), ...course };
    courses.push(newCourse);
    return newCourse;
  },
  async updateCourse(id, updated) {
    await delay(200);
    courses = courses.map((c) => (c.id === id ? { ...c, ...updated } : c));
    return true;
  },
  async deleteCourse(id) {
    await delay(200);
    courses = courses.filter((c) => c.id !== id);
    return true;
  },

  // TEACHERS
  async getTeachers() {
    await delay(200);
    return [...teachers];
  },
  async addTeacher(teacher) {
    await delay(200);
    const newTeacher = {
      id: Date.now(),
      totalLectures: 0,
      subjects: [],
      ...teacher,
    };
    teachers.push(newTeacher);
    return newTeacher;
  },
  async updateTeacher(id, updated) {
    await delay(200);
    teachers = teachers.map((t) => (t.id === id ? { ...t, ...updated } : t));
    return true;
  },
  async deleteTeacher(id) {
    await delay(200);
    teachers = teachers.filter((t) => t.id !== id);
    return true;
  },
  async assignLectures(teacherId, totalLectures) {
    await delay(200);
    teachers = teachers.map((t) =>
      t.id === teacherId ? { ...t, totalLectures } : t
    );
    return true;
  },
  async assignSubjects(teacherId, subjectIds) {
    await delay(200);
    teachers = teachers.map((t) =>
      t.id === teacherId ? { ...t, subjects: subjectIds } : t
    );
    return true;
  },

  // SUBJECTS
  async getSubjects() {
    await delay(200);
    return [...subjects];
  },

  // ROOMS
  async getRooms() {
    await delay(200);
    return [...rooms];
  },
  async addRoom(room) {
    await delay(200);
    const newRoom = { id: Date.now(), ...room };
    rooms.push(newRoom);
    return newRoom;
  },

  // TIMETABLE
  async getTimetable() {
    await delay(200);
    return [...timetable];
  },
  async generateTimetable() {
    await delay(1200);
    // In real life you'd recalc based on constraints; here we just return existing.
    return [...timetable];
  },
};
