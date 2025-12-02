// src/pages/LoginPage.jsx
import React from "react";
import { useLocation, useNavigate, Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoginLayout from "../components/auth/LoginLayout";

const roles = ["Student", "Teacher", "Admin"];

const LoginPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { role, login } = useAuth();

  // 🔒 If already logged in, don't let user stay on /login
  if (role) {
    if (role === "Admin") return <Navigate to="/admin" replace />;
    if (role === "Teacher") return <Navigate to="/teacher" replace />;
    if (role === "Student") return <Navigate to="/student" replace />;
  }

  const initialRole = location.state?.role || "Student";

  const [selectedRole, setSelectedRole] = React.useState(initialRole);
  const [emailOrId, setEmailOrId] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [errors, setErrors] = React.useState({});

  const validate = () => {
    const newErrors = {};

    if (!emailOrId.trim()) {
      newErrors.emailOrId = "Email or ID is required.";
    } else if (
      emailOrId.includes("@") &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailOrId)
    ) {
      newErrors.emailOrId = "Please enter a valid email address.";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required.";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Store role in auth context (and likely localStorage)
    login(selectedRole);

    if (selectedRole === "Admin") navigate("/admin", { replace: true });
    else if (selectedRole === "Teacher") navigate("/teacher", { replace: true });
    else navigate("/student", { replace: true });
  };

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        {/* Top back header */}
        <header className="flex items-center justify-between px-4 sm:px-10 py-4">
          <Link
            to="/"
            className="flex items-center gap-2 text-sm text-primary font-medium hover:underline"
          >
            <span className="material-symbols-outlined text-base">
              arrow_back
            </span>
            Back to Home
          </Link>
        </header>

        <main className="flex min-h-[calc(100vh-64px)] w-full items-center justify-center px-4 sm:px-6 lg:px-8">
          <LoginLayout
            roles={roles}
            role={selectedRole}
            setRole={setSelectedRole}
            emailOrId={emailOrId}
            setEmailOrId={setEmailOrId}
            password={password}
            setPassword={setPassword}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            errors={errors}
            onSubmit={handleSubmit}
          />
        </main>
      </div>
    </div>
  );
};

export default LoginPage;
