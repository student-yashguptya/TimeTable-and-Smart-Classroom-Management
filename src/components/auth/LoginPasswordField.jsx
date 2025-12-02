// src/components/auth/LoginPasswordField.jsx
import React from "react";

const LoginPasswordField = ({
  password,
  setPassword,
  showPassword,
  setShowPassword,
  error,
}) => (
  <label className="flex flex-col">
    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 pb-2">
      Password
    </p>

    <div className="relative flex items-center">
      <input
        type={showPassword ? "text" : "password"}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter your password"
        className={`h-12 px-4 pr-10 rounded-lg bg-transparent border text-gray-900 dark:text-white placeholder:text-gray-500
          ${
            error
              ? "border-red-500"
              : "border-gray-300 dark:border-gray-600 focus:border-primary"
          }`}
      />

      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 text-gray-400 hover:text-gray-600"
      >
        <span className="material-symbols-outlined">
          {showPassword ? "visibility_off" : "visibility"}
        </span>
      </button>
    </div>

    {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
  </label>
);

export default LoginPasswordField;
