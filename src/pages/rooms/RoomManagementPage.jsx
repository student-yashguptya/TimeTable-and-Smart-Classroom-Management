// src/pages/rooms/RoomManagementPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { mockApi } from "../../mock/mockApi";
import Spinner from "../../components/ui/Spinner";

const RoomManagementPage = () => {
  const [search, setSearch] = useState("");
  const [rooms, setRooms] = useState([]);
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();
  const { logout } = useAuth();
  const { showToast } = useToast();

  const loadRooms = async () => {
    setIsLoading(true);
    try {
      const r = await mockApi.getRooms();
      setRooms(r);
    } catch (err) {
      console.error(err);
      showToast("Failed to load rooms.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRooms();
  }, []);

  const handleLogout = () => {
    logout();
    showToast("Logged out.", "info");
    navigate("/login", { replace: true });
  };

  const filtered = rooms.filter(
    (room) =>
      room.name.toLowerCase().includes(search.toLowerCase()) ||
      room.type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="font-display bg-background-light dark:bg-background-dark">
      <div className="relative flex min-h-screen w-full">
        {/* Sidebar */}
        <AdminSidebar />

        {/* Main */}
        <div className="flex-1 flex flex-col">
          <AdminTopbar
            search={search}
            setSearch={setSearch}
            onLogout={handleLogout}
          />

          <div className="p-4 md:p-10 space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                  Rooms
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Manage lecture halls, labs and tutorial rooms.
                </p>
              </div>

              <button
                onClick={() => setAddModal(true)}
                className="flex items-center gap-2 h-10 px-4 rounded-lg bg-primary text-white text-sm font-semibold shadow-md hover:bg-primary/90"
              >
                <span className="material-symbols-outlined text-base">add</span>
                <span>Add Room</span>
              </button>
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
                        <Th>Name</Th>
                        <Th>Type</Th>
                        <Th>Capacity</Th>
                        <Th>Actions</Th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-black/10 dark:divide-white/10">
                      {filtered.map((room) => (
                        <tr
                          key={room.id}
                          className="hover:bg-gray-50 dark:hover:bg-white/5"
                        >
                          <Td>{room.name}</Td>
                          <Td muted>{room.type}</Td>
                          <Td muted>{room.capacity}</Td>
                          <Td>
                            <div className="flex gap-2">
                              <Btn
                                label="Edit"
                                type="blue"
                                onClick={() => setEditModal(room)}
                              />
                            </div>
                          </Td>
                        </tr>
                      ))}

                      {filtered.length === 0 && (
                        <tr>
                          <Td colSpan={4} muted>
                            No rooms found.
                          </Td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Modals */}
          {addModal && (
            <RoomModal
              title="Add Room"
              onClose={() => setAddModal(false)}
              onSaved={loadRooms}
            />
          )}

          {editModal && (
            <RoomModal
              title="Edit Room"
              initialData={editModal}
              onClose={() => setEditModal(null)}
              onSaved={loadRooms}
            />
          )}
        </div>
      </div>
    </div>
  );
};

/* ---------- small sub components ---------- */

const Th = ({ children }) => (
  <th className="p-4 text-xs md:text-sm font-semibold text-gray-600 dark:text-[#92a4c9]">
    {children}
  </th>
);

const Td = ({ children, muted, colSpan }) => (
  <td
    colSpan={colSpan}
    className={`p-4 text-xs md:text-sm ${
      muted ? "text-gray-500 dark:text-[#92a4c9]" : "text-gray-800 dark:text-white"
    }`}
  >
    {children}
  </td>
);

const Btn = ({ label, onClick, type }) => {
  const colors = {
    blue: "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20",
    red: "bg-red-500/10 text-red-500 hover:bg-red-500/20",
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

/* ---------- Room Modal (Add + Edit) ---------- */

const RoomModal = ({ title, onClose, onSaved, initialData }) => {
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
      } else {
        await mockApi.addRoom({
          name,
          type,
          capacity: Number(capacity),
        });
        showToast("Room added.", "success");
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

export default RoomManagementPage;
