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
import { mockApi } from "../mock/mockApi";

const AdminDashboardPage = () => {
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
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

    setTimeout(async () => {
      setIsGenerating(false);
      showToast("Timetable generated successfully (demo).", "success");

      try {
        await mockApi.addActivity({
          event: "Timetable generated from dashboard",
          user: user?.email || "Admin",
          date: new Date().toLocaleString(),
          status: "Success",
        });
      } catch (e) {
        console.error(e);
      }
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
    <div className="font-display bg-background-light dark:bg-background-dark min-h-screen">
      <div className="relative flex min-h-screen w-full">
        {/* Sidebar (desktop) */}
        <AdminSidebar />

        {/* Main content */}
        <div className="flex-1 flex flex-col animate-[fadeIn_0.4s_ease-out]">
          <AdminTopbar onLogout={handleLogout} />

          {/* 💡 Responsive container */}
          <div className="px-4 sm:px-6 lg:px-10 py-4 lg:py-8 max-w-7xl w-full mx-auto space-y-8">
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
