// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import ContactPage from "./pages/ContactPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
//import OtpVerificationPage from "./pages/OtpVerificationPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import TeacherDashboardPage from "./pages/TeacherDashboardPage";
import StudentDashboardPage from "./pages/StudentDashboardPage";

import CourseManagementPage from "./pages/courses/CourseManagementPage";
import FacultyManagementPage from "./pages/teachers/FacultyManagementPage";
import RoomManagementPage from "./pages/rooms/RoomManagementPage";
import TimetablePage from "./pages/timetables/TimetablePage";

import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import ProtectedRoute from "./components/routing/ProtectedRoute";
import NotificationsPage from "./pages/admin/NotificationsPage";

const App = () => {
  return (
    <ToastProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />

            {/* Admin + subpages */}
            <Route path="/admin/notifications" element={<NotificationsPage />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={["Admin"]}>
                  <AdminDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/courses"
              element={
                <ProtectedRoute allowedRoles={["Admin"]}>
                  <CourseManagementPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/teachers"
              element={
                <ProtectedRoute allowedRoles={["Admin"]}>
                  <FacultyManagementPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/rooms"
              element={
                <ProtectedRoute allowedRoles={["Admin"]}>
                  <RoomManagementPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/timetables"
              element={
                <ProtectedRoute allowedRoles={["Admin"]}>
                  <TimetablePage />
                </ProtectedRoute>
              }
            />

            {/* Teacher / Student dashboards */}
            <Route
              path="/teacher"
              element={
                <ProtectedRoute allowedRoles={["Teacher"]}>
                  <TeacherDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student"
              element={
                <ProtectedRoute allowedRoles={["Student"]}>
                  <StudentDashboardPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ToastProvider>
  );
};

export default App;
