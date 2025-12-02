// src/components/timetables/AssignScheduleModal.jsx
import React, { useState } from "react";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const slots = ["9–10", "10–11", "11–12", "1–2", "2–3", "3–4"];

const AssignScheduleModal = ({ open, onClose, onSave }) => {
  const [form, setForm] = useState({
    day: "Monday",
    slot: "9–10",
    course: "",
    teacher: "",
    room: "",
  });

  if (!open) return null;

  const handleChange = (field, value) =>
    setForm({ ...form, [field]: value });

  const handleSubmit = () => {
    if (!form.course || !form.teacher || !form.room) return;
    onSave(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-[#192233] p-6 rounded-xl w-full max-w-md space-y-4">

        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Assign Schedule Manually
        </h2>

        <div className="space-y-3">
          <select
            className="w-full border p-2 rounded-lg"
            value={form.day}
            onChange={(e) => handleChange("day", e.target.value)}
          >
            {days.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>

          <select
            className="w-full border p-2 rounded-lg"
            value={form.slot}
            onChange={(e) => handleChange("slot", e.target.value)}
          >
            {slots.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>

          <input
            placeholder="Course"
            className="w-full border p-2 rounded-lg"
            value={form.course}
            onChange={(e) => handleChange("course", e.target.value)}
          />

          <input
            placeholder="Teacher"
            className="w-full border p-2 rounded-lg"
            value={form.teacher}
            onChange={(e) => handleChange("teacher", e.target.value)}
          />

          <input
            placeholder="Room"
            className="w-full border p-2 rounded-lg"
            value={form.room}
            onChange={(e) => handleChange("room", e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-2 bg-gray-200 rounded-lg">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-primary text-white rounded-lg"
          >
            Save
          </button>
        </div>

      </div>
    </div>
  );
};

export default AssignScheduleModal;
