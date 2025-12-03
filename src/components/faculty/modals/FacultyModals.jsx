// src/components/faculty/modals/FacultyModals.jsx
import React, { useEffect, useState } from "react";
import { useToast } from "../../../context/ToastContext";
import { useAuth } from "../../../context/AuthContext";
import { mockApi } from "../../../mock/mockApi";
import Spinner from "../../ui/Spinner";

/* ------------------------------------------------------------------ */
/*                         TEACHER MODAL                              */
/* ------------------------------------------------------------------ */

export const TeacherModal = ({ title, onClose, onSaved, initialData }) => {
  const { showToast } = useToast();
  const { user } = useAuth();

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

/* ------------------------------------------------------------------ */
/*                       ASSIGN SUBJECTS MODAL                         */
/* ------------------------------------------------------------------ */

export const AssignSubjectsModal = ({
  teacher,
  subjects,
  onClose,
  onSaved,
}) => {
  const { showToast } = useToast();

  const teacherDept = (teacher.department || "").toLowerCase();

  // Filter subjects by department (if available)
  const availableSubjects = teacherDept
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
              {/* Show CODE — Name if code exists */}
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

/* ------------------------------------------------------------------ */
/*                       ASSIGN LECTURES MODAL                         */
/* ------------------------------------------------------------------ */

export const AssignLecturesModal = ({ teacher, onClose, onSaved }) => {
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

/* ------------------------------------------------------------------ */
/*                         ACTIVITY MODAL                              */
/* ------------------------------------------------------------------ */

export const ActivityModal = ({ teacher, onClose }) => {
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
            <StatCard
              label="Lectures Taken"
              value={activity.completedLectures}
            />
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

/* ------------------------------------------------------------------ */
/*                      LEAVE REQUESTS MODAL                           */
/* ------------------------------------------------------------------ */

export const LeaveRequestsModal = ({ teacher, onClose }) => {
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

/* ------------------------------------------------------------------ */
/*                   SHARED MODAL/UI HELPERS                          */
/* ------------------------------------------------------------------ */

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

const StatusBadge = ({ status }) => {
  const normalized = (status || "").toLowerCase();

  let label = "Unknown";
  let classes = "bg-gray-500/10 text-gray-500 border border-gray-500/30";

  if (normalized === "present") {
    label = "Present";
    classes =
      "bg-emerald-500/10 text-emerald-500 border border-emerald-500/30";
  } else if (normalized === "absent") {
    label = "Absent";
    classes = "bg-red-500/10 text-red-500 border border-red-500/30";
  } else if (normalized === "on leave" || normalized === "leave") {
    label = "On Leave";
    classes = "bg-amber-500/10 text-amber-500 border border-amber-500/30";
  }

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${classes}`}
    >
      {label}
    </span>
  );
};
