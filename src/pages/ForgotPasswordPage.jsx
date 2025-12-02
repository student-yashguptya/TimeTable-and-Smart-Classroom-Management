// src/pages/ForgotPasswordPage.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import ForgotPasswordLayout from "../components/auth/ForgotPasswordLayout";

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

    // backend API call here
    console.log("Request reset for:", emailOrId);

    setSent(true);
    setEmailOrId("");
  };

  return (
    <div className="font-display">
      <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark overflow-x-hidden">
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
            <ForgotPasswordLayout
              emailOrId={emailOrId}
              setEmailOrId={setEmailOrId}
              error={error}
              setError={setError}
              sent={sent}
              onSubmit={handleSubmit}
            />
          </main>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
