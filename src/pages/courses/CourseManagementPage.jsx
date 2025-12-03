// src/pages/courses/CourseManagementPage.jsx
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";

import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { mockApi } from "../../mock/mockApi";
import Spinner from "../../components/ui/Spinner";

const CourseManagementPage = () => {
  const [search, setSearch] = useState("");
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { showToast } = useToast();

  const fileInputRef = useRef(null);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [c, t] = await Promise.all([
        mockApi.getCourses(),
        mockApi.getTeachers(),
      ]);
      setCourses(c);
      setTeachers(t);
    } catch (err) {
      console.error(err);
      showToast("Failed to load courses.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleLogout = () => {
    logout();
    showToast("Logged out successfully.", "info");
    navigate("/login", { replace: true });
  };

  const filteredCourses = courses.filter((course) => {
    const q = search.toLowerCase();
    return (
      course.name.toLowerCase().includes(q) ||
      course.code.toLowerCase().includes(q)
    );
  });

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this course?")) return;
    try {
      const toDelete = courses.find((c) => c.id === id);
      await mockApi.deleteCourse(id);
      showToast("Course deleted.", "success");

      // Log recent activity
      if (toDelete) {
        await mockApi.addActivity({
          event: `Course deleted: ${toDelete.code} - ${toDelete.name}`,
          user: user?.email || "Admin",
          status: "Success",
        });
      }

      loadData();
    } catch (err) {
      showToast("Failed to delete course.", "error");
    }
  };

  /* ---------- EXCEL UPLOAD FEATURE ---------- */

  const handleExcelButtonClick = () => {
    fileInputRef.current?.click();
  };

  const parseExcelToCourses = (file, teachersList) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];

          const json = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

          // Expected columns:
          // Code | Name | Semester | Department | WeeklyHours | TeacherEmail (optional) | TeacherName (optional)
          const mapped = json.map((row, index) => {
            const code = row.Code || row.code || `C-${index + 1}`;
            const name = row.Name || row.name || `Course ${index + 1}`;
            const semester = row.Semester || row.semester || "";
            const department = row.Department || row.department || "";
            const weeklyHours = Number(row.WeeklyHours || row.weeklyHours || 0);

            let teacherId = null;
            const teacherEmail = String(
              row.TeacherEmail || row.teacherEmail || ""
            ).toLowerCase();
            const teacherName = String(
              row.TeacherName || row.teacherName || ""
            ).toLowerCase();

            if (teacherEmail || teacherName) {
              const teacher = teachersList.find((t) => {
                const tEmail = (t.email || "").toLowerCase();
                const tName = (t.name || "").toLowerCase();
                return (
                  (teacherEmail && tEmail === teacherEmail) ||
                  (teacherName && tName === teacherName)
                );
              });
              if (teacher) {
                teacherId = teacher.id;
              }
            }

            return {
              code,
              name,
              semester,
              department,
              weeklyHours,
              teacherId,
            };
          });

          resolve(mapped);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });

  const handleExcelChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const coursesFromExcel = await parseExcelToCourses(file, teachers);

      if (!coursesFromExcel.length) {
        showToast("No course rows found in Excel.", "warning");
      } else {
        await mockApi.bulkAddCourses(coursesFromExcel);

        // Log import as recent activity
        await mockApi.addActivity({
          event: `Imported ${coursesFromExcel.length} courses from Excel`,
          user: user?.email || "Admin",
          status: "Success",
        });

        showToast(
          `Imported ${coursesFromExcel.length} courses from Excel.`,
          "success"
        );
        loadData();
      }
    } catch (err) {
      console.error(err);
      showToast("Failed to import courses from Excel.", "error");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  return (
    <div className="font-display bg-background-light dark:bg-background-dark">
      <div className="relative flex min-h-screen w-full">
        <AdminSidebar />

        <div className="flex-1 flex flex-col">
          {/* 🔹 Topbar now just gets onLogout – no search props */}
          <AdminTopbar onLogout={handleLogout} />

          <div className="p-4 md:p-10 space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                  Courses
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Manage academic courses, assign faculty & weekly lectures, or
                  import via Excel.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                {/* Excel Upload Button */}
                <button
                  onClick={handleExcelButtonClick}
                  disabled={isUploading}
                  className="flex items-center gap-2 h-10 px-4 rounded-lg bg-gray-100 dark:bg-black/30 text-gray-800 dark:text-gray-100 text-xs md:text-sm font-semibold shadow-sm hover:bg-gray-200 dark:hover:bg-black/50 disabled:opacity-60"
                >
                  {isUploading ? (
                    <>
                      <span className="material-symbols-outlined text-sm animate-spin">
                        progress_activity
                      </span>
                      Importing...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-base">
                        upload_file
                      </span>
                      <span>Upload Excel</span>
                    </>
                  )}
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls"
                  className="hidden"
                  onChange={handleExcelChange}
                />

                {/* Add Course Button */}
                <button
                  onClick={() => setIsAddOpen(true)}
                  className="flex items-center gap-2 h-10 px-4 rounded-lg bg-primary text-white text-sm font-semibold shadow-md hover:bg-primary/90 hover:-translate-y-0.5 transition"
                >
                  <span className="material-symbols-outlined text-base">
                    add
                  </span>
                  <span>Add Course</span>
                </button>
              </div>
            </div>

            {/* Local search (since topbar search is gone) */}
            <div className="max-w-sm">
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
                Search Courses
              </label>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by code or name..."
                className="w-full h-10 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#111827] px-3 text-sm text-gray-900 dark:text-white"
              />
            </div>

            {isLoading ? (
              <div className="flex justify-center py-10">
                <Spinner size="40" />
              </div>
            ) : (
              <div className="rounded-xl bg-white dark:bg-[#192131] border border-black/10 dark:border-white/10 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-100 dark:bg-black/20">
                      <tr>
                        <Th>Code</Th>
                        <Th>Name</Th>
                        <Th>Semester</Th>
                        <Th>Department</Th>
                        <Th>Weekly Hours</Th>
                        <Th>Faculty</Th>
                        <Th>Actions</Th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/10 dark:divide-white/10">
                      {filteredCourses.map((course) => {
                        const teacher = teachers.find(
                          (t) => t.id === course.teacherId
                        );
                        return (
                          <tr
                            key={course.id}
                            className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                          >
                            <Td>{course.code}</Td>
                            <Td>{course.name}</Td>
                            <Td muted>{course.semester}</Td>
                            <Td muted>{course.department}</Td>
                            <Td muted>{course.weeklyHours}</Td>
                            <Td muted>{teacher?.name || "—"}</Td>
                            <Td>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => setEditingCourse(course)}
                                  className="px-3 py-1 rounded-lg bg-primary/10 text-primary text-xs hover:bg-primary/20"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDelete(course.id)}
                                  className="px-3 py-1 rounded-lg bg-red-500/10 text-red-500 text-xs hover:bg-red-500/20"
                                >
                                  Delete
                                </button>
                              </div>
                            </Td>
                          </tr>
                        );
                      })}
                      {filteredCourses.length === 0 && (
                        <tr>
                          <Td colSpan={7} muted>
                            No courses found.
                          </Td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modals */}
        {isAddOpen && (
          <CourseModal
            title="Add Course"
            onClose={() => setIsAddOpen(false)}
            onSaved={loadData}
            teachers={teachers}
            initialData={null}
          />
        )}
        {editingCourse && (
          <CourseModal
            title="Edit Course"
            onClose={() => setEditingCourse(null)}
            onSaved={loadData}
            teachers={teachers}
            initialData={editingCourse}
          />
        )}
      </div>
    </div>
  );
};

const Th = ({ children }) => (
  <th className="p-4 text-xs md:text-sm font-semibold text-gray-600 dark:text-[#92a4c9]">
    {children}
  </th>
);

const Td = ({ children, muted, colSpan }) => (
  <td
    colSpan={colSpan}
    className={`p-4 text-xs md:text-sm ${
      muted
        ? "text-gray-500 dark:text-[#92a4c9]"
        : "text-gray-800 dark:text-white"
    }`}
  >
    {children}
  </td>
);

const CourseModal = ({ title, onClose, onSaved, teachers, initialData }) => {
  const isEdit = !!initialData;
  const { showToast } = useToast();

  const [code, setCode] = useState(initialData?.code || "");
  const [name, setName] = useState(initialData?.name || ""); // ✅ fixed
  const [semester, setSemester] = useState(initialData?.semester || "");
  const [department, setDepartment] = useState(initialData?.department || "");
  const [weeklyHours, setWeeklyHours] = useState(
    initialData?.weeklyHours || 4
  );
  const [teacherId, setTeacherId] = useState(initialData?.teacherId || "");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!code || !name) {
      showToast("Code and Name are required.", "error");
      return;
    }
    setSaving(true);
    try {
      if (isEdit) {
        await mockApi.updateCourse(initialData.id, {
          code,
          name,
          semester,
          department,
          weeklyHours: Number(weeklyHours),
          teacherId: teacherId ? Number(teacherId) : null,
        });
        showToast("Course updated.", "success");
      } else {
        await mockApi.addCourse({
          code,
          name,
          semester,
          department,
          weeklyHours: Number(weeklyHours),
          teacherId: teacherId ? Number(teacherId) : null,
        });
        showToast("Course added.", "success");
      }

      await onSaved();
      onClose();
    } catch {
      showToast("Failed to save course.", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white dark:bg-[#192131] rounded-2xl shadow-2xl w-full max-w-lg p-6 sm:p-8 animate-[fadeIn_0.2s_ease-out]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field
              label="Course Code"
              value={code}
              onChange={setCode}
              placeholder="CS101"
            />
            <Field
              label="Course Name"
              value={name}
              onChange={setName}
              placeholder="Intro to Programming"
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field
              label="Semester"
              value={semester}
              onChange={setSemester}
              placeholder="1"
            />
            <Field
              label="Department"
              value={department}
              onChange={setDepartment}
              placeholder="CSE"
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field
              label="Weekly Hours"
              type="number"
              value={weeklyHours}
              onChange={setWeeklyHours}
              placeholder="4"
            />
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
                Assign Faculty (optional)
              </label>
              <select
                value={teacherId}
                onChange={(e) => setTeacherId(e.target.value)}
                className="w-full h-10 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#111827] px-3 text-sm text-gray-900 dark:text-white"
              >
                <option value="">-- None --</option>
                {teachers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="h-10 px-4 rounded-lg bg-gray-100 dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="h-10 px-5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 disabled:opacity-70 flex items-center gap-2"
            >
              {saving && (
                <span className="material-symbols-outlined animate-spin text-sm">
                  progress_activity
                </span>
              )}
              <span>{saving ? "Saving..." : "Save"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Field = ({ label, value, onChange, placeholder, type = "text" }) => (
  <div>
    <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full h-10 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#111827] px-3 text-sm text-gray-900 dark:text-white"
    />
  </div>
);

export default CourseManagementPage;
