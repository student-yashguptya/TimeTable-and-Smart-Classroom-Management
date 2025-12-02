// src/components/auth/RoleSelector.jsx
import React from "react";

const RoleSelector = ({ roles, role, setRole }) => (
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
);

export default RoleSelector;
