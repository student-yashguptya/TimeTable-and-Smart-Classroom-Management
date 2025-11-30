// src/pages/LoginPage.jsx
import React from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";

const roles = ["Student", "Teacher", "Admin"];

const LoginPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const initialRole = location.state?.role || "Student";

  const [role, setRole] = React.useState(initialRole);
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

    if (!password) {
      newErrors.password = "Password is required.";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // backend call here
    console.log("Login:", { role, emailOrId, password });

    alert(`Logged in as ${role}! (demo login)`);
    navigate("/");
  };

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark group/design-root overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        {/* Back header */}
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
          <div className="flex w-full max-w-6xl overflow-hidden rounded-xl bg-white shadow-lg dark:bg-[#192233]">
            {/* Left image */}
            <div className="hidden lg:block lg:w-1/2">
              <div
                className="w-full h-full bg-center bg-no-repeat bg-cover min-h-[400px]"
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAt7jd-3iMde_HjO3j1xnEG0eI7CwNL6uI6qvqLj1w_mogN_mXEaJcAVGTNSaeQV3pY7ylTnaWGoTNCWBvOoed7zeL9FLzQvT7gKtGQbP1dNv63yDGkE-AUEppzFZ2GVZXrpIXU1hcsHh6Jcpgu-O-RuNXIOhBxsR-FVMU_B6T2dKZ4UgJG053WuLs2oXeQFo5DfXjpbAde9lliKzOyDSIgSRUbpSPtONkofnsx-OhEufud7gb-Fu0okchqrrEel9nQ4hM0FGcn-HA")',
                }}
              />
            </div>

            {/* Right form */}
            <div className="w-full p-6 sm:p-8 lg:p-12 lg:w-1/2 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-4">
                <span className="material-symbols-outlined text-primary text-3xl">
                  grid_view
                </span>
                <span className="text-xl font-semibold text-gray-800 dark:text-white">
                  Smart Timetable System
                </span>
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                Welcome Back!
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Login to access your dashboard.
              </p>

              <form
                onSubmit={handleSubmit}
                className="mt-8 space-y-6"
                noValidate
              >
                {/* Role selector */}
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 pb-2">
                    I am a...
                  </p>
                  <div className="flex h-12 flex-1 items-center justify-center rounded-lg bg-gray-100 p-1 dark:bg-[#101622]">
                    {roles.map((r) => (
                      <label
                        key={r}
                        className={`flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-md px-2 text-sm font-medium transition-colors text-gray-500 dark:text-gray-400
                          ${
                            role === r
                              ? "bg-white shadow-sm text-gray-900 dark:bg-primary dark:text-white"
                              : ""
                          }`}
                      >
                        <span className="truncate">{r}</span>
                        <input
                          type="radio"
                          name="role-selector"
                          value={r}
                          checked={role === r}
                          onChange={() => setRole(r)}
                          className="invisible w-0"
                        />
                      </label>
                    ))}
                  </div>
                </div>

                {/* Email / ID */}
                <div className="space-y-4">
                  <label className="flex flex-col">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 pb-2">
                      Email or ID
                    </p>
                    <input
                      className={`form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border bg-transparent h-12 placeholder:text-gray-400 dark:placeholder:text-gray-500 px-4 text-base font-normal leading-normal ${
                        errors.emailOrId
                          ? "border-red-500 dark:border-red-500"
                          : "border-gray-300 dark:border-gray-600 focus:border-primary/50 dark:focus:border-primary/50"
                      }`}
                      placeholder="Enter your email or ID"
                      value={emailOrId}
                      onChange={(e) => setEmailOrId(e.target.value)}
                    />
                    {errors.emailOrId && (
                      <span className="mt-1 text-xs text-red-500">
                        {errors.emailOrId}
                      </span>
                    )}
                  </label>

                  {/* Password */}
                  <label className="flex flex-col">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 pb-2">
                      Password
                    </p>
                    <div className="relative flex items-center">
                      <input
                        className={`form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border bg-transparent h-12 placeholder:text-gray-400 dark:placeholder:text-gray-500 px-4 pr-10 text-base font-normal leading-normal ${
                          errors.password
                            ? "border-red-500 dark:border-red-500"
                            : "border-gray-300 dark:border-gray-600 focus:border-primary/50 dark:focus:border-primary/50"
                        }`}
                        placeholder="Enter your password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((p) => !p)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                      >
                        <span className="material-symbols-outlined">
                          {showPassword ? "visibility_off" : "visibility"}
                        </span>
                      </button>
                    </div>
                    {errors.password && (
                      <span className="mt-1 text-xs text-red-500">
                        {errors.password}
                      </span>
                    )}
                  </label>
                </div>

                {/* Login button */}
                <button
                  type="submit"
                  className="flex h-12 w-full items-center justify-center rounded-lg bg-primary px-6 text-base font-semibold text-white shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary/70"
                >
                  Login
                </button>

                {/* Links */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 items-center justify-between text-sm">
                  <Link
                    to="/forgot-password"
                    className="font-medium text-primary hover:underline flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-base">
                      sms_failed
                    </span>
                    <span>Forgot Password?</span>
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default LoginPage;
