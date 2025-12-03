// src/mock/mockApi.js

/* ---------- BASE MOCK DATA ---------- */

let courses = [
  
];

let teachers = [
  
];

let rooms = [
 
];

let subjects = [
 
];

// Seed timetable row (demo only)
let timetableSeed = [
];

/* ---------- TEACHER ACTIVITY & LEAVES ---------- */

let teacherActivities = {
 
};

let teacherLeaves = {

};



let activities = []; 



let timetableGrid = null; 
let timetableStatus = "Not Generated";

/* ---------- UTILS ---------- */

const delay = (ms) => new Promise((res) => setTimeout(res, ms));



export const mockApi = {
  /* ---------- COURSES ---------- */

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

  // Used by CourseManagementPage Excel import
  async bulkAddCourses(coursesArray) {
    await delay(300);

    const created = coursesArray.map((c, idx) => {
      const newCourse = {
        id: Date.now() + idx,
        code: c.code || `C-${idx + 1}`,
        name: c.name || `Course ${idx + 1}`,
        semester: c.semester || "",
        department: c.department || "",
        weeklyHours:
          typeof c.weeklyHours === "number" ? c.weeklyHours : 0,
        teacherId: c.teacherId || null,
      };

      courses.push(newCourse);
      return newCourse;
    });

    return created;
  },

  /* ---------- TEACHERS ---------- */

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
      currentStatus: "Present",
      ...teacher,
    };
    teachers.push(newTeacher);

    teacherActivities[newTeacher.id] = {
      totalLectures: newTeacher.totalLectures || 0,
      completedLectures: 0,
      attendancePercentage: 0,
      lastActive: "N/A",
      recent: [],
    };

    teacherLeaves[newTeacher.id] = [];

    return newTeacher;
  },

  // Used by Faculty Excel import
  async bulkAddTeachers(teachersArray) {
    await delay(300);

    const created = teachersArray.map((t, idx) => {
      const id = Date.now() + idx;
      const newTeacher = {
        id,
        name: t.name || `Faculty ${idx + 1}`,
        email: t.email || "",
        department: t.department || "",
        totalLectures: t.totalLectures || 0,
        subjects: t.subjects || [],
        currentStatus: "Present",
      };

      teachers.push(newTeacher);

      teacherActivities[id] = {
        totalLectures: newTeacher.totalLectures,
        completedLectures: 0,
        attendancePercentage: 0,
        lastActive: "N/A",
        recent: [],
      };

      teacherLeaves[id] = [];

      return newTeacher;
    });

    return created;
  },

  async updateTeacher(id, updated) {
    await delay(200);
    teachers = teachers.map((t) => (t.id === id ? { ...t, ...updated } : t));

    if (typeof updated.totalLectures === "number") {
      const act = teacherActivities[id];
      if (act) {
        act.totalLectures = updated.totalLectures;
      }
    }

    return true;
  },

  async deleteTeacher(id) {
    await delay(200);
    teachers = teachers.filter((t) => t.id !== id);
    delete teacherActivities[id];
    delete teacherLeaves[id];
    return true;
  },

  async assignLectures(teacherId, totalLectures) {
    await delay(200);
    teachers = teachers.map((t) =>
      t.id === teacherId ? { ...t, totalLectures } : t
    );

    const act = teacherActivities[teacherId];
    if (act) {
      act.totalLectures = totalLectures;
    }

    return true;
  },

  async assignSubjects(teacherId, subjectIds) {
    await delay(200);
    teachers = teachers.map((t) =>
      t.id === teacherId ? { ...t, subjects: subjectIds } : t
    );
    return true;
  },

  async setTeacherStatus(teacherId, status) {
    await delay(150);
    teachers = teachers.map((t) =>
      t.id === teacherId ? { ...t, currentStatus: status } : t
    );
    return true;
  },

  async getTeacherActivity(teacherId) {
    await delay(250);
    return (
      teacherActivities[teacherId] || {
        totalLectures: 0,
        completedLectures: 0,
        attendancePercentage: 0,
        lastActive: "N/A",
        recent: [],
      }
    );
  },

  async getTeacherLeaves(teacherId) {
    await delay(250);
    return teacherLeaves[teacherId] || [];
  },

  async addTeacherLeave(teacherId, leave) {
    await delay(200);
    const id = Date.now();
    const newLeave = {
      id,
      status: "Pending",
      ...leave,
    };

    if (!teacherLeaves[teacherId]) teacherLeaves[teacherId] = [];
    teacherLeaves[teacherId].push(newLeave);

    teachers = teachers.map((t) =>
      t.id === teacherId ? { ...t, currentStatus: "On Leave" } : t
    );

    return newLeave;
  },

  async updateTeacherLeaveStatus(teacherId, leaveId, status) {
    await delay(200);
    const list = teacherLeaves[teacherId] || [];
    teacherLeaves[teacherId] = list.map((l) =>
      l.id === leaveId ? { ...l, status } : l
    );
    return true;
  },

  /* ---------- GLOBAL ADMIN ACTIVITIES (Dashboard Recent Activity) ---------- */

  async addActivity(activity) {
    await delay(100);
    const entry = {
      id: Date.now(),
      event: activity.event,
      user: activity.user || "Admin",
      date: activity.date || new Date().toLocaleString(),
      status: activity.status || "Success",
    };
    activities.push(entry);
    return entry;
  },

  async getActivities() {
    await delay(200);
    return [...activities].sort((a, b) => b.id - a.id);
  },

/* ---------- SUBJECTS ---------- */

// Build subjects list from courses so it always matches admin-added data
async getSubjects() {
  await delay(200);

  const map = new Map();

  // Each course becomes one subject option
  for (const c of courses) {
    const id = c.code || String(c.id);

    if (!map.has(id)) {
      map.set(id, {
        id,                            // used as subjectId in teacher.subjects
        code: c.code || id,
        name: c.name || c.code || id,
        department: c.department || "",
      });
    }
  }

  // If there are no courses yet, return empty list
  return Array.from(map.values());
},


  /* ---------- ROOMS ---------- */

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

  async updateRoom(id, updated) {
    await delay(200);
    rooms = rooms.map((r) => (r.id === id ? { ...r, ...updated } : r));
    return true;
  },

 // ✅ Room Excel import + single summary activity
async bulkAddRooms(roomsArray, userEmail = "Admin") {
  await delay(300);

  const created = roomsArray.map((r, idx) => {
    const newRoom = {
      id: Date.now() + idx,
      name: r.name || `Room ${idx + 1}`,
      type: r.type || "",
      capacity: Number(r.capacity || 0),
    };

    rooms.push(newRoom);
    return newRoom;
  });

  // 🔹 Log ONE summary entry, same style as courses & faculty
  if (created.length) {
    activities.push({
      id: Date.now(),
      event: `Imported ${created.length} rooms from Excel`,
      user: userEmail || "Admin",
      date: new Date().toLocaleString(),
      status: "Success",
    });
  }

  return created;
},

  /* ---------- TIMETABLE (PERSISTED) ---------- */

  async getTimetable() {
    await delay(200);
    return timetableGrid;
  },

  async saveTimetable(grid, status) {
    await delay(200);
    timetableGrid = grid;
    if (status) {
      timetableStatus = status;
    }
    return timetableGrid;
  },

  async getTimetableStatus() {
    await delay(150);
    return timetableStatus;
  },

  async setTimetableStatus(status) {
    await delay(150);
    timetableStatus = status;
    return timetableStatus;
  },

  // Optional: legacy demo generator
  async generateTimetable() {
    await delay(1200);
    return [...timetableSeed];
  },
};
