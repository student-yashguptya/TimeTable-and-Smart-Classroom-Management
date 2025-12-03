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

  // Dynamic stats state
  const [stats, setStats] = useState({
    totalClasses: 0,
    registeredTeachers: 0,
    availableRooms: 0,
    timetableStatus: "Not generated",
  });

  const navigate = useNavigate();
  const { logout, user } = useAuth(); // we’ll try to read user.email / user.isActive
  const { showToast } = useToast();

  const loadStats = async () => {
    try {
      const [courses, teachers, rooms, timetable] = await Promise.all([
        mockApi.getCourses(),
        mockApi.getTeachers(),
        mockApi.getRooms(),
        mockApi.getTimetable(),
      ]);

      setStats({
        totalClasses: courses.length,
        registeredTeachers: teachers.length,
        availableRooms: rooms.length,
        timetableStatus:
          timetable && timetable.length > 0 ? "Generated" : "Not generated",
      });
    } catch (err) {
      console.error(err);
      showToast("Failed to load dashboard stats.", "error");
    }
  };

  useEffect(() => {
    const t = setTimeout(() => setIsPageLoading(false), 500);
    loadStats();
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

      // Log this as a recent activity
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

      // Reload stats (timetable status)
      loadStats();
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
          {/* 🔹 Topbar now has NO search bar; only actions/profile */}
          <AdminTopbar onLogout={handleLogout} />

          <div className="p-4 md:p-10 space-y-8">
            <AdminWelcomeSection
              onGenerate={handleGenerateTimetable}
              isGenerating={isGenerating}
              onAddCourse={handleAddCourse}
              onAddClassroom={handleAddClassroom}
            />

            {/* 🔹 Stats now show REAL counts from mockApi */}
            <AdminStatsGrid stats={stats} />

            {/* 🔹 Recent activity now loads from mockApi */}
            <AdminActivityTable />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
