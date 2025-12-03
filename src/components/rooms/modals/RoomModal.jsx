// src/components/rooms/modals/RoomModal.jsx
import React, { useState } from "react";
import { useToast } from "../../../context/ToastContext";
import { mockApi } from "../../../mock/mockApi";

const RoomModal = ({
  title,
  onClose,
  onSaved,
  initialData,
  currentUserEmail,
}) => {
  const { showToast } = useToast();
  const isEdit = !!initialData;

  const [name, setName] = useState(initialData?.name || "");
  const [type, setType] = useState(initialData?.type || "");
  const [capacity, setCapacity] = useState(initialData?.capacity || 0);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      showToast("Room name is required.", "error");
      return;
    }

    setSaving(true);

    try {
      if (isEdit) {
        await mockApi.updateRoom(initialData.id, {
          name,
          type,
          capacity: Number(capacity),
        });
        showToast("Room updated.", "success");

        await mockApi.addActivity({
          event: `Room updated: ${name} (${type || "Room"})`,
          user: currentUserEmail || "Admin",
          status: "Success",
        });
      } else {
        await mockApi.addRoom({
          name,
          type,
          capacity: Number(capacity),
        });
        showToast("Room added.", "success");

        await mockApi.addActivity({
          event: `Room added: ${name} (${type || "Room"})`,
          user: currentUserEmail || "Admin",
          status: "Success",
        });
      }

      await onSaved();
      onClose();
    } catch (err) {
      console.error(err);
      showToast("Failed to save room.", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white dark:bg-[#192131] rounded-2xl w-full max-w-lg p-6 sm:p-8 animate-[fadeIn_0.2s_ease] shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <Field label="Room Name" value={name} onChange={setName} />
          <Field
            label="Type (Lecture / Lab / Tutorial)"
            value={type}
            onChange={setType}
          />
          <Field
            label="Capacity"
            type="number"
            value={capacity}
            onChange={setCapacity}
          />

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="h-10 px-4 bg-gray-100 dark:bg-gray-800 text-sm rounded-lg text-gray-800 dark:text-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="h-10 px-5 bg-primary text-white text-sm rounded-lg flex items-center gap-2 enabled:hover:bg-primary/90 disabled:opacity-60"
            >
              {saving && (
                <span className="material-symbols-outlined animate-spin text-sm">
                  progress_activity
                </span>
              )}
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

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

export default RoomModal;
