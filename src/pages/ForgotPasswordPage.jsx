// src/pages/ForgotPasswordPage.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";

const ForgotPasswordPage = () => {
  const [emailOrId, setEmailOrId] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const validate = () => {
    if (!emailOrId.trim()) {
      setError("Email or ID is required.");
      return false;
    }

    if (
      emailOrId.includes("@") &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailOrId)
    ) {
      setError("Please enter a valid email address.");
      return false;
    }

    setError("");
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(false);

    if (!validate()) return;

    // Here you would call your backend API to send reset link
    console.log("Request reset for:", emailOrId);

    setSent(true);
    setEmailOrId("");
  };

  return (
    <div className="font-display">
      <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark group/design-root overflow-x-hidden">
        {/* Header with back-to-home */}
        <header className="absolute top-0 left-0 w-full p-4 sm:p-6">
          <div className="flex items-center justify-end">
            <Link
              to="/"
              className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-gray-700 backdrop-blur-sm transition-colors hover:bg-white/20 dark:text-gray-300 dark:hover:bg-white/10"
            >
              <span className="material-symbols-outlined text-base">
                arrow_back
              </span>
              <span>Back to Home</span>
            </Link>
          </div>
        </header>

        <div className="layout-container flex h-full grow flex-col">
          <main className="flex min-h-screen w-full items-center justify-center px-4">
            <div className="flex w-full max-w-6xl overflow-hidden rounded-xl bg-white shadow-lg dark:bg-[#192233]">
              {/* Left image (desktop) */}
              <div className="hidden lg:block lg:w-1/2">
                <div
                  className="w-full h-full bg-center bg-no-repeat bg-cover"
                  style={{
                    backgroundImage:
                      'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAt7jd-3iMde_HjO3j1xnEG0eI7CwNL6uI6qvqLj1w_mogN_mXEaJcAVGTNSaeQV3pY7ylTnaWGoTNCWBvOoed7zeL9FLzQvT7gKtGQbP1dNv63yDGkE-AUEppzFZ2GVZXrpIXU1hcsHh6Jcpgu-O-RuNXIOhBxsR-FVMU_B6T2dKZ4UgJG053WuLs2oXeQFo5DfXjpbAde9lliKzOyDSIgSRUbpSPtONkofnsx-OhEufud7gb-Fu0okchqrrEel9nQ4hM0FGcn-HA")',
                  }}
                />
              </div>

              {/* Right column: form */}
              <div className="w-full p-8 sm:p-12 lg:w-1/2 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-4">
                  <span className="material-symbols-outlined text-primary text-3xl">
                    grid_view
                  </span>
                  <span className="text-xl font-semibold text-gray-800 dark:text-white">
                    Smart Timetable System
                  </span>
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                  Forgot Your Password?
                </h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  No problem. Enter your email or ID below and we'll send you a
                  link to reset it.
                </p>

                <form
                  onSubmit={handleSubmit}
                  className="mt-8 space-y-6"
                  noValidate
                >
                  {sent && (
                    <div className="rounded-lg border border-green-500/60 bg-green-50/80 dark:bg-green-900/20 px-3 py-2 text-xs sm:text-sm text-green-700 dark:text-green-300">
                      If an account exists with that email/ID, a reset link has
                      been sent. (Demo message)
                    </div>
                  )}

                  <div className="space-y-4">
                    <label className="flex flex-col">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 pb-2">
                        Email or ID
                      </p>
                      <input
                        className={`form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border bg-transparent h-12 placeholder:text-gray-400 dark:placeholder:text-gray-500 px-4 text-base font-normal leading-normal ${
                          error
                            ? "border-red-500 dark:border-red-500"
                            : "border-gray-300 dark:border-gray-600 focus:border-primary/50 dark:focus:border-primary/50"
                        }`}
                        placeholder="Enter your email or ID"
                        value={emailOrId}
                        onChange={(e) => {
                          setEmailOrId(e.target.value);
                          if (error) setError("");
                        }}
                      />
                      {error && (
                        <span className="mt-1 text-xs text-red-500">
                          {error}
                        </span>
                      )}
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="flex h-12 w-full items-center justify-center rounded-lg bg-primary px-6 text-base font-semibold text-white shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary/70"
                  >
                    Send Reset Link
                  </button>

                  <div className="flex items-center justify-center text-sm">
                    <Link
                      to="/login"
                      className="font-medium text-primary hover:underline flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-base">
                        arrow_back
                      </span>
                      <span>Back to Login</span>
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
