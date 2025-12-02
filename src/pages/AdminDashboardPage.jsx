// src/pages/AdminDashboardPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import Spinner from "../components/ui/Spinner";
import AdminSidebar from "../components/admin/AdminSidebar";
import AdminTopbar from "../components/admin/AdminTopbar";
import AdminStatsGrid from "../components/admin/AdminStatsGrid";
import AdminActivityTable from "../components/admin/AdminActivityTable";
import AdminWelcomeSection from "../components/admin/AdminWelcomeSection";

const AdminDashboardPage = () => {
  const [search, setSearch] = useState("");
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  const navigate = useNavigate();
  const { logout } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    // page fade-in
    const t = setTimeout(() => setIsPageLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  const handleLogout = () => {
    logout();
    showToast("Logged out successfully.", "info");
    navigate("/login", { replace: true });
  };

  const handleGenerateTimetable = () => {
    if (isGenerating) return;
    setIsGenerating(true);
    showToast("Generating timetable (demo)...", "info");
    setTimeout(() => {
      setIsGenerating(false);
      showToast("Timetable generated successfully (demo).", "success");
    }, 1200);
  };

  const handleAddCourse = () => {
    navigate("/admin/courses");
  };

  const handleAddClassroom = () => {
    navigate("/admin/rooms");
  };

  if (isPageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
        <Spinner size="40" />
      </div>
    );
  }

  return (
    <div className="font-display bg-background-light dark:bg-background-dark">
      <div className="relative flex min-h-screen w-full">
        {/* Sidebar */}
        <AdminSidebar />

        {/* Main */}
        <div className="flex-1 flex flex-col animate-[fadeIn_0.4s_ease-out]">
          <AdminTopbar
            search={search}
            setSearch={setSearch}
            onLogout={handleLogout}
          />

          <div className="p-4 md:p-10 space-y-8">
            <AdminWelcomeSection
              onGenerate={handleGenerateTimetable}
              isGenerating={isGenerating}
              onAddCourse={handleAddCourse}
              onAddClassroom={handleAddClassroom}
            />

            <AdminStatsGrid />

            <AdminActivityTable />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
