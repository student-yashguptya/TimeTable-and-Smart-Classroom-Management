import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(null);
  const [assignSubjectsModal, setAssignSubjectsModal] = useState(null);
  const [assignLecturesModal, setAssignLecturesModal] = useState(null);

  const navigate = useNavigate();
  const { logout } = useAuth();
  const { showToast } = useToast();

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
      await mockApi.deleteTeacher(id);
      showToast("Teacher deleted.", "success");
      loadData();
    } catch {
      showToast("Failed to delete teacher.", "error");
    }
  };

  return (
    <div className="font-display bg-background-light dark:bg-background-dark">
      <div className="relative flex min-h-screen w-full">
        <AdminSidebar />

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
                  Faculty
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Manage teachers, assign subjects & lecture loads.
                </p>
              </div>

              <button
                onClick={() => setAddModal(true)}
                className="flex items-center gap-2 h-10 px-4 rounded-lg bg-primary text-white text-sm font-semibold shadow-md hover:bg-primary/90"
              >
                <span className="material-symbols-outlined text-base">add</span>
                <span>Add Faculty</span>
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
                        <Th>Email</Th>
                        <Th>Department</Th>
                        <Th>Lectures</Th>
                        <Th>Subjects</Th>
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
                          <Td muted>{t.subjects.join(", ") || "—"}</Td>

                          <Td>
                            <div className="flex flex-wrap gap-2">
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
                          <Td colSpan={6} muted>
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

          {/* Modals */}
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

/* ---------- MODALS ---------- */

// Add + Edit Teacher
const TeacherModal = ({ title, onClose, onSaved, initialData }) => {
  const { showToast } = useToast();

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
      } else {
        await mockApi.addTeacher({
          name,
          email,
          department,
        });
        showToast("Faculty added.", "success");
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

// Assign Subjects
const AssignSubjectsModal = ({ teacher, subjects, onClose, onSaved }) => {
  const { showToast } = useToast();

  const [selected, setSelected] = useState(teacher.subjects);
  const [saving, setSaving] = useState(false);

  const toggle = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSubmit = async () => {
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
        {subjects.map((s) => (
          <label key={s.id} className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={selected.includes(s.id)}
              onChange={() => toggle(s.id)}
            />
            {s.id} — {s.name}
          </label>
        ))}
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

// Assign Lectures
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

export default FacultyManagementPage;
