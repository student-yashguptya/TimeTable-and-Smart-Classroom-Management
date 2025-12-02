// src/components/auth/LoginRoleSelector.jsx
import React from "react";

const LoginRoleSelector = ({ roles, role, setRole }) => (
  <div>
    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 pb-2">
      I am a...
    </p>
    <div className="flex h-12 bg-gray-100 dark:bg-[#101622] rounded-lg p-1">
      {roles.map((r) => (
        <label
          key={r}
          className={`flex items-center justify-center grow cursor-pointer rounded-md px-2 text-sm ${
            role === r
              ? "bg-white shadow text-gray-900 dark:bg-primary dark:text-white"
              : "text-gray-500 dark:text-gray-400"
          }`}
        >
          {r}
          <input
            type="radio"
            name="role"
            value={r}
            checked={role === r}
            onChange={() => setRole(r)}
            className="hidden"
          />
        </label>
      ))}
    </div>
  </div>
);

export default LoginRoleSelector;
