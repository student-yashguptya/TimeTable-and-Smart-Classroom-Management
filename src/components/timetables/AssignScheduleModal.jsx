// src/components/timetables/AssignScheduleModal.jsx
import React, { useEffect, useState } from "react";
import { mockApi } from "../../mock/mockApi";
import Spinner from "../ui/Spinner";
import { useToast } from "../../context/ToastContext";
import { DAYS, TIME_ROWS } from "../../utils/timetableGenerator";

// Only lecture rows can be selected for manual assignment
const LECTURE_ROWS = TIME_ROWS.filter((r) => r.type === "lecture");

const AssignScheduleModal = ({ open, onClose, onSave }) => {
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [rooms, setRooms] = useState([]);

  // Form state
  const [day, setDay] = useState(DAYS[0]);
  const [slot, setSlot] = useState(LECTURE_ROWS[0]?.id || "");
  const [courseId, setCourseId] = useState("");
  const [teacherId, setTeacherId] = useState("");
  const [roomId, setRoomId] = useState("");

  // Load base data (courses / teachers / rooms) when modal opens
  useEffect(() => {
    if (!open) return;

    const load = async () => {
      setLoading(true);
      try {
        const [c, t, r] = await Promise.all([
          mockApi.getCourses(),
          mockApi.getTeachers(),
          mockApi.getRooms(),
        ]);
        setCourses(c);
        setTeachers(t);
        setRooms(r);

        // sensible defaults
        setCourseId(c[0]?.id || "");
        setTeacherId(t[0]?.id || "");
        setRoomId(r[0]?.id || "");
      } catch (err) {
        console.error("Failed to load data for manual assign:", err);
        showToast("Failed to load data for manual assign.", "error");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [open, showToast]);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!day || !slot) {
      showToast("Please select day and time slot.", "error");
      return;
    }
    if (!courseId || !teacherId || !roomId) {
      showToast("Please select course, teacher and room.", "error");
      return;
    }

    const course = courses.find((c) => c.id === Number(courseId));
    const teacher = teachers.find((t) => t.id === Number(teacherId));
    const room = rooms.find((r) => r.id === Number(roomId));

    const courseLabel = course?.name || course?.code || "Subject";
    const teacherLabel = teacher?.name || "Teacher";
    const roomLabel = room?.name || "Room";

    // TimetablePage will merge this into the grid & persist via mockApi.saveTimetable
    onSave({
      day,
      slot,
      course: courseLabel,
      teacher: teacherLabel,
      room: roomLabel,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-40 bg-black/40 flex items-center justify-center">
      <div className="bg-white dark:bg-[#111827] rounded-2xl w-full max-w-lg p-6 sm:p-8 shadow-2xl animate-[fadeIn_0.2s_ease-out]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Assign Schedule Manually
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <Spinner size="32" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Day + Slot */}
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Day">
                <select
                  value={day}
                  onChange={(e) => setDay(e.target.value)}
                  className="w-full h-10 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#020617] px-3 text-sm text-gray-900 dark:text-white"
                >
                  {DAYS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Time Slot">
                <select
                  value={slot}
                  onChange={(e) => setSlot(e.target.value)}
                  className="w-full h-10 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#020617] px-3 text-sm text-gray-900 dark:text-white"
                >
                  {LECTURE_ROWS.map((row) => (
                    <option key={row.id} value={row.id}>
                      {row.label}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            {/* Course */}
            <Field label="Course">
              <select
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
                className="w-full h-10 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#020617] px-3 text-sm text-gray-900 dark:text-white"
              >
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.code ? `${c.code} – ${c.name}` : c.name}
                  </option>
                ))}
              </select>
            </Field>

            {/* Teacher + Room */}
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Teacher">
                <select
                  value={teacherId}
                  onChange={(e) => setTeacherId(e.target.value)}
                  className="w-full h-10 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#020617] px-3 text-sm text-gray-900 dark:text-white"
                >
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Room">
                <select
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  className="w-full h-10 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#020617] px-3 text-sm text-gray-900 dark:text-white"
                >
                  {rooms.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="h-10 px-4 rounded-lg bg-gray-100 dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="h-10 px-5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90"
              >
                Save to Timetable
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

const Field = ({ label, children }) => (
  <div>
    <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
      {label}
    </label>
    {children}
  </div>
);

export default AssignScheduleModal;
