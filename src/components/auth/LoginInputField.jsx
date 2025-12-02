// src/components/auth/LoginInputField.jsx
import React from "react";

const LoginInputField = ({ label, value, onChange, error, placeholder }) => (
  <label className="flex flex-col">
    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 pb-2">
      {label}
    </p>
    <input
      className={`h-12 px-4 rounded-lg bg-transparent border text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500
        ${
          error
            ? "border-red-500"
            : "border-gray-300 dark:border-gray-600 focus:border-primary"
        }`}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
    {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
  </label>
);

export default LoginInputField;
