// src/pages/courses/CourseManagementPage.jsx
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";

import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { mockApi } from "../../mock/mockApi";

import CourseHeader from "../../components/courses/CourseHeader";
import CourseTable from "../../components/courses/CourseTable";
import CourseModal from "../../components/courses/modals/CourseModal";

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

  /* ------------------------------------------------------------------ */
  /*                         LOAD COURSES + TEACHERS                    */
  /* ------------------------------------------------------------------ */

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

  /* ------------------------------------------------------------------ */
  /*                           AUTH / LOGOUT                            */
  /* ------------------------------------------------------------------ */

  const handleLogout = () => {
    logout();
    showToast("Logged out successfully.", "info");
    navigate("/login", { replace: true });
  };

  /* ------------------------------------------------------------------ */
  /*                          FILTERED COURSES                          */
  /* ------------------------------------------------------------------ */

  const filteredCourses = courses.filter((course) => {
    const q = search.toLowerCase();
    return (
      course.name.toLowerCase().includes(q) ||
      course.code.toLowerCase().includes(q)
    );
  });

  /* ------------------------------------------------------------------ */
  /*                            DELETE COURSE                           */
  /* ------------------------------------------------------------------ */

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

  /* ------------------------------------------------------------------ */
  /*                          EXCEL IMPORT                              */
  /* ------------------------------------------------------------------ */

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

  /* ------------------------------------------------------------------ */
  /*                              RENDER                                */
  /* ------------------------------------------------------------------ */

  return (
    <div className="font-display bg-background-light dark:bg-background-dark">
      <div className="relative flex min-h-screen w-full">
        <AdminSidebar />

        <div className="flex-1 flex flex-col">
          <AdminTopbar onLogout={handleLogout} />

          <div className="p-4 md:p-10 space-y-6">
            <CourseHeader
              search={search}
              onSearchChange={setSearch}
              isUploading={isUploading}
              onExcelClick={handleExcelButtonClick}
              onAddClick={() => setIsAddOpen(true)}
            />

            {/* Hidden Excel input */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              className="hidden"
              onChange={handleExcelChange}
            />

            <CourseTable
              isLoading={isLoading}
              courses={filteredCourses}
              teachers={teachers}
              onEdit={(course) => setEditingCourse(course)}
              onDelete={handleDelete}
            />
          </div>

          {/* Modals */}
          {isAddOpen && (
            <CourseModal
              title="Add Course"
              onClose={() => setIsAddOpen(false)}
              onSaved={loadData}
              teachers={teachers}
              initialData={null}
              currentUserEmail={user?.email}
            />
          )}

          {editingCourse && (
            <CourseModal
              title="Edit Course"
              onClose={() => setEditingCourse(null)}
              onSaved={loadData}
              teachers={teachers}
              initialData={editingCourse}
              currentUserEmail={user?.email}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseManagementPage;
