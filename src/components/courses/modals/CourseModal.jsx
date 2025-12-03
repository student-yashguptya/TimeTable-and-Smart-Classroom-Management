// src/components/courses/modals/CourseModal.jsx
import React, { useState } from "react";
import { useToast } from "../../../context/ToastContext";
import { mockApi } from "../../../mock/mockApi";

const CourseModal = ({
  title,
  onClose,
  onSaved,
  teachers,
  initialData,
  currentUserEmail,
}) => {
  const isEdit = !!initialData;
  const { showToast } = useToast();

  const [code, setCode] = useState(initialData?.code || "");
  const [name, setName] = useState(initialData?.name || "");
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

    const payload = {
      code,
      name,
      semester,
      department,
      weeklyHours: Number(weeklyHours),
      teacherId: teacherId ? Number(teacherId) : null,
    };

    try {
      if (isEdit) {
        await mockApi.updateCourse(initialData.id, payload);
        showToast("Course updated.", "success");

        // log activity
        await mockApi.addActivity({
          event: `Course updated: ${code} - ${name}`,
          user: currentUserEmail || "Admin",
          status: "Success",
        });
      } else {
        await mockApi.addCourse(payload);
        showToast("Course added.", "success");

        // log activity
        await mockApi.addActivity({
          event: `Course added: ${code} - ${name}`,
          user: currentUserEmail || "Admin",
          status: "Success",
        });
      }

      await onSaved();
      onClose();
    } catch (err) {
      console.error(err);
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

export default CourseModal;
