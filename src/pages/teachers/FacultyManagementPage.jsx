// src/pages/faculty/FacultyManagementPage.jsx
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx"; // 📌 Excel parsing

import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { mockApi } from "../../mock/mockApi";
import Spinner from "../../components/ui/Spinner";

const FacultyManagementPage = () => {
  const [search, setSearch] = useState("");
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(null);
  const [assignSubjectsModal, setAssignSubjectsModal] = useState(null);
  const [assignLecturesModal, setAssignLecturesModal] = useState(null);
  const [activityModal, setActivityModal] = useState(null);
  const [leaveRequestsModal, setLeaveRequestsModal] = useState(null);

  const navigate = useNavigate();
  const { logout, user } = useAuth();          // 🔹 now also using user
  const { showToast } = useToast();

  const fileInputRef = useRef(null);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [t, s] = await Promise.all([
        mockApi.getTeachers(),
        mockApi.getSubjects(),
      ]);
      setTeachers(t);
      setSubjects(s);
    } catch {
      showToast("Failed to load faculty.", "error");
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

  const filtered = teachers.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this teacher?")) return;
    try {
      const toDelete = teachers.find((t) => t.id === id);

      await mockApi.deleteTeacher(id);
      showToast("Teacher deleted.", "success");

      // 🔹 Log delete to Recent Activity
      await mockApi.addActivity({
        event: `Teacher deleted: ${toDelete?.name || "Unknown"}`,
        user: user?.email || "Admin",
        status: "Success",
      });

      loadData();
    } catch {
      showToast("Failed to delete teacher.", "error");
    }
  };

  /* ---------- EXCEL UPLOAD ---------- */

  const handleExcelButtonClick = () => {
    fileInputRef.current?.click();
  };

  const parseExcelToTeachers = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];

          const json = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

          // Expected Excel columns:
          // Name | Email | Department | TotalLectures
          const mapped = json.map((row, index) => ({
            name: row.Name || row.name || `Faculty ${index + 1}`,
            email: row.Email || row.email || "",
            department: row.Department || row.department || "",
            totalLectures: Number(row.TotalLectures || 0),
          }));

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
      const teachersFromExcel = await parseExcelToTeachers(file);

      if (!teachersFromExcel.length) {
        showToast("No faculty rows found in Excel.", "warning");
      } else {
        await mockApi.bulkAddTeachers(teachersFromExcel);

        // 🔹 Log Excel import
        await mockApi.addActivity({
          event: `Imported ${teachersFromExcel.length} faculty from Excel`,
          user: user?.email || "Admin",
          status: "Success",
        });

        showToast(
          `Imported ${teachersFromExcel.length} faculty from Excel.`,
          "success"
        );
        loadData();
      }
    } catch (err) {
      console.error(err);
      showToast("Failed to import Excel file.", "error");
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
          {/* Topbar without search */}
          <AdminTopbar onLogout={handleLogout} />

          <div className="p-4 md:p-10 space-y-6">
            {/* HEADER */}
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                  Faculty
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Manage teachers, import from Excel, track attendance & activity.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                {/* Excel Upload */}
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

                {/* Add Faculty */}
                <button
                  onClick={() => setAddModal(true)}
                  className="flex items-center gap-2 h-10 px-4 rounded-lg bg-primary text-white text-xs md:text-sm font-semibold shadow-md hover:bg-primary/90"
                >
                  <span className="material-symbols-outlined text-base">add</span>
                  <span>Add Faculty</span>
                </button>
              </div>
            </div>

            {/* 🔍 Search Faculty */}
            <div className="max-w-sm">
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
                Search Faculty
              </label>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name..."
                className="w-full h-10 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#111827] px-3 text-sm text-gray-900 dark:text-white"
              />
            </div>

            {/* TABLE */}
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
                        <Th>Name</Th>
                        <Th>Email</Th>
                        <Th>Department</Th>
                        <Th>Lectures</Th>
                        <Th>Subjects</Th>
                        <Th>Status</Th>
                        <Th>Actions</Th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/10 dark:divide-white/10">
                      {filtered.map((t) => (
                        <tr
                          key={t.id}
                          className="hover:bg-gray-50 dark:hover:bg-white/5"
                        >
                          <Td>{t.name}</Td>
                          <Td muted>{t.email}</Td>
                          <Td muted>{t.department}</Td>
                          <Td muted>{t.totalLectures}</Td>
                          <Td muted>{t.subjects?.join(", ") || "—"}</Td>

                          {/* Present / Absent / On Leave */}
                          <Td>
                            <StatusBadge status={t.currentStatus} />
                          </Td>

                          <Td>
                            <div className="flex flex-wrap gap-2">
                              <Btn
                                label="Activity"
                                onClick={() => setActivityModal(t)}
                                type="green"
                              />
                              <Btn
                                label="Leaves"
                                onClick={() => setLeaveRequestsModal(t)}
                                type="purple"
                              />
                              <Btn
                                label="Assign Subjects"
                                onClick={() => setAssignSubjectsModal(t)}
                                type="blue"
                              />
                              <Btn
                                label="Lectures"
                                onClick={() => setAssignLecturesModal(t)}
                              />
                              <Btn
                                label="Edit"
                                onClick={() => setEditModal(t)}
                                type="orange"
                              />
                              <Btn
                                label="Delete"
                                onClick={() => handleDelete(t.id)}
                                type="red"
                              />
                            </div>
                          </Td>
                        </tr>
                      ))}

                      {filtered.length === 0 && (
                        <tr>
                          <Td colSpan={7} muted>
                            No teachers found.
                          </Td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* MODALS */}
          {addModal && (
            <TeacherModal
              title="Add Faculty"
              onClose={() => setAddModal(false)}
              onSaved={loadData}
            />
          )}

          {editModal && (
            <TeacherModal
              title="Edit Faculty"
              initialData={editModal}
              onClose={() => setEditModal(null)}
              onSaved={loadData}
            />
          )}

          {assignSubjectsModal && (
            <AssignSubjectsModal
              teacher={assignSubjectsModal}
              subjects={subjects}
              onClose={() => setAssignSubjectsModal(null)}
              onSaved={loadData}
            />
          )}

          {assignLecturesModal && (
            <AssignLecturesModal
              teacher={assignLecturesModal}
              onClose={() => setAssignLecturesModal(null)}
              onSaved={loadData}
            />
          )}

          {activityModal && (
            <ActivityModal
              teacher={activityModal}
              onClose={() => setActivityModal(null)}
            />
          )}

          {leaveRequestsModal && (
            <LeaveRequestsModal
              teacher={leaveRequestsModal}
              onClose={() => setLeaveRequestsModal(null)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

/* ---------- STATIC TABLE COMPONENTS ---------- */

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

const Btn = ({ label, onClick, type }) => {
  const colors = {
    blue: "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20",
    red: "bg-red-500/10 text-red-500 hover:bg-red-500/20",
    orange: "bg-orange-500/10 text-orange-500 hover:bg-orange-500/20",
    green: "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20",
    purple: "bg-purple-500/10 text-purple-500 hover:bg-purple-500/20",
    default: "bg-primary/10 text-primary hover:bg-primary/20",
  };
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 text-xs rounded-lg ${colors[type] || colors.default}`}
    >
      {label}
    </button>
  );
};

const StatusBadge = ({ status }) => {
  const normalized = (status || "").toLowerCase();

  let label = "Unknown";
  let classes =
    "bg-gray-500/10 text-gray-500 border border-gray-500/30";

  if (normalized === "present") {
    label = "Present";
    classes =
      "bg-emerald-500/10 text-emerald-500 border border-emerald-500/30";
  } else if (normalized === "absent") {
    label = "Absent";
    classes = "bg-red-500/10 text-red-500 border border-red-500/30";
  } else if (normalized === "on leave" || normalized === "leave") {
    label = "On Leave";
    classes =
      "bg-amber-500/10 text-amber-500 border border-amber-500/30";
  }

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${classes}`}
    >
      {label}
    </span>
  );
};

/* ---------- MODALS ---------- */

// Add + Edit Teacher
const TeacherModal = ({ title, onClose, onSaved, initialData }) => {
  const { showToast } = useToast();
  const { user } = useAuth();         // 🔹 access current admin email

  const isEdit = !!initialData;

  const [name, setName] = useState(initialData?.name || "");
  const [email, setEmail] = useState(initialData?.email || "");
  const [department, setDepartment] = useState(initialData?.department || "");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) return showToast("Name is required.", "error");

    setSaving(true);

    try {
      if (isEdit) {
        await mockApi.updateTeacher(initialData.id, {
          name,
          email,
          department,
        });
        showToast("Faculty updated.", "success");

        // 🔹 Log update
        await mockApi.addActivity({
          event: `Faculty updated: ${name}`,
          user: user?.email || "Admin",
          status: "Success",
        });
      } else {
        await mockApi.addTeacher({
          name,
          email,
          department,
        });
        showToast("Faculty added.", "success");

        // 🔹 Log add
        await mockApi.addActivity({
          event: `Faculty added: ${name}`,
          user: user?.email || "Admin",
          status: "Success",
        });
      }

      onSaved();
      onClose();
    } catch {
      showToast("Failed to save.", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ModalWrapper title={title} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Name" value={name} onChange={setName} />
        <Field label="Email" value={email} onChange={setEmail} />
        <Field label="Department" value={department} onChange={setDepartment} />
        <ModalActions saving={saving} onClose={onClose} />
      </form>
    </ModalWrapper>
  );
};



const AssignSubjectsModal = ({ teacher, subjects, onClose, onSaved }) => {
  const { showToast } = useToast();

  // Teacher department (for filtering)
  const teacherDept = (teacher.department || "").toLowerCase();

  // Show only subjects for this department; if no dept, show all
  const availableSubjects =
    teacherDept
      ? subjects.filter(
          (s) => (s.department || "").toLowerCase() === teacherDept
        )
      : subjects;

  const [selected, setSelected] = useState(teacher.subjects || []);
  const [saving, setSaving] = useState(false);

  const toggle = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    if (!selected.length) {
      showToast("Select at least one subject.", "warning");
      return;
    }

    setSaving(true);
    try {
      await mockApi.assignSubjects(teacher.id, selected);
      showToast("Subjects updated.", "success");
      onSaved();
      onClose();
    } catch {
      showToast("Failed to assign subjects.", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ModalWrapper title={`Assign Subjects - ${teacher.name}`} onClose={onClose}>
      <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
        {availableSubjects.length === 0 ? (
          <p className="text-xs text-gray-500 dark:text-gray-400">
            No subjects found for this department. Please add courses first.
          </p>
        ) : (
          availableSubjects.map((s) => (
            <label key={s.id} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={selected.includes(s.id)}
                onChange={() => toggle(s.id)}
              />
              {/* Show CODE — Name, e.g. CS101 — Introduction to Programming */}
              {s.code ? `${s.code} — ${s.name}` : `${s.id} — ${s.name}`}
            </label>
          ))
        )}
      </div>

      <ModalActions
        saving={saving}
        onClose={onClose}
        onSubmit={handleSubmit}
        submitLabel="Save"
      />
    </ModalWrapper>
  );
};


// Assign Lectures (unchanged)
const AssignLecturesModal = ({ teacher, onClose, onSaved }) => {
  const { showToast } = useToast();

  const [lectures, setLectures] = useState(teacher.totalLectures);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    setSaving(true);
    try {
      await mockApi.assignLectures(teacher.id, Number(lectures));
      showToast("Lecture load updated.", "success");
      onSaved();
      onClose();
    } catch {
      showToast("Failed to assign lectures.", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ModalWrapper title={`Assign Lectures - ${teacher.name}`} onClose={onClose}>
      <Field
        label="Total Weekly Lectures"
        type="number"
        value={lectures}
        onChange={setLectures}
      />

      <ModalActions
        onSubmit={handleSubmit}
        saving={saving}
        onClose={onClose}
        submitLabel="Save"
      />
    </ModalWrapper>
  );
};

// Activity / Progress Modal
const ActivityModal = ({ teacher, onClose }) => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [activity, setActivity] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await mockApi.getTeacherActivity(teacher.id);
        setActivity(data);
      } catch {
        showToast("Failed to load activity.", "error");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [teacher.id, showToast]);

  return (
    <ModalWrapper title={`Activity - ${teacher.name}`} onClose={onClose}>
      {loading ? (
        <div className="flex justify-center py-6">
          <Spinner size="32" />
        </div>
      ) : !activity ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          No activity data available.
        </p>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
            <StatCard label="Total Lectures" value={activity.totalLectures} />
            <StatCard label="Lectures Taken" value={activity.completedLectures} />
            <StatCard
              label="Attendance %"
              value={`${activity.attendancePercentage || 0}%`}
            />
            <StatCard
              label="Last Active"
              value={activity.lastActive || "N/A"}
            />
          </div>

          <div>
            <h3 className="text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
              Recent Activity
            </h3>
            {activity.recent && activity.recent.length > 0 ? (
              <ul className="space-y-1 max-h-40 overflow-y-auto pr-1">
                {activity.recent.map((item, idx) => (
                  <li
                    key={idx}
                    className="text-xs text-gray-600 dark:text-gray-300"
                  >
                    • {item}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                No recent logs.
              </p>
            )}
          </div>
        </div>
      )}

      <div className="pt-4 flex justify-end">
        <button
          onClick={onClose}
          className="h-9 px-4 rounded-lg bg-gray-100 dark:bg-gray-800 text-xs sm:text-sm text-gray-700 dark:text-gray-200"
        >
          Close
        </button>
      </div>
    </ModalWrapper>
  );
};

// Leave Requests Modal
const LeaveRequestsModal = ({ teacher, onClose }) => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [leaves, setLeaves] = useState([]);

  const loadLeaves = async () => {
    setLoading(true);
    try {
      const data = await mockApi.getTeacherLeaves(teacher.id);
      setLeaves(data || []);
    } catch {
      showToast("Failed to load leaves.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeaves();
  }, [teacher.id]);

  return (
    <ModalWrapper title={`Leave Requests - ${teacher.name}`} onClose={onClose}>
      {loading ? (
        <div className="flex justify-center py-6">
          <Spinner size="32" />
        </div>
      ) : leaves.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          No leave requests yet.
        </p>
      ) : (
        <div className="space-y-3 max-h-72 overflow-y-auto pr-2 text-xs sm:text-sm">
          {leaves.map((leave) => (
            <div
              key={leave.id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-800 dark:text-gray-100">
                  {leave.type || "Leave"}
                </span>
                <StatusBadge status={leave.status} />
              </div>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                {leave.fromDate} → {leave.toDate}
              </p>
              {leave.reason && (
                <p className="text-[11px] text-gray-600 dark:text-gray-300">
                  {leave.reason}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="pt-4 flex justify-end">
        <button
          onClick={onClose}
          className="h-9 px-4 rounded-lg bg-gray-100 dark:bg-gray-800 text-xs sm:text-sm text-gray-700 dark:text-gray-200"
        >
          Close
        </button>
      </div>
    </ModalWrapper>
  );
};

/* ---------- UNIVERSAL MODAL COMPONENTS ---------- */

const ModalWrapper = ({ title, onClose, children }) => (
  <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
    <div className="bg-white dark:bg-[#192131] rounded-2xl w-full max-w-lg p-6 sm:p-8 animate-[fadeIn_0.2s_ease] shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          {title}
        </h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-white"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>

      {children}
    </div>
  </div>
);

const Field = ({ label, value, onChange, type = "text" }) => (
  <div>
    <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full h-10 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#111827] px-3 text-sm text-gray-900 dark:text-white"
    />
  </div>
);

const ModalActions = ({ saving, onClose, onSubmit, submitLabel = "Save" }) => (
  <div className="flex justify-end gap-3 pt-4">
    <button
      onClick={onClose}
      type="button"
      className="h-10 px-4 text-sm rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200"
    >
      Cancel
    </button>

    <button
      disabled={saving}
      onClick={onSubmit}
      className="h-10 px-5 text-sm rounded-lg bg-primary text-white flex items-center gap-2 enabled:hover:bg-primary/90 disabled:opacity-60"
    >
      {saving && (
        <span className="material-symbols-outlined text-sm animate-spin">
          progress_activity
        </span>
      )}
      {saving ? "Saving..." : submitLabel}
    </button>
  </div>
);

const StatCard = ({ label, value }) => (
  <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-3">
    <p className="text-[11px] text-gray-500 dark:text-gray-400">{label}</p>
    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mt-0.5">
      {value ?? "—"}
    </p>
  </div>
);

export default FacultyManagementPage;
