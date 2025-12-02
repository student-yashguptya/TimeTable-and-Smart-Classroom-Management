// src/components/admin/AdminTopbar.jsx
import React from "react";

const AdminTopbar = ({ search, setSearch, onLogout }) => {
  return (
    <header className="flex items-center justify-between border-b border-black/10 dark:border-white/10 px-4 md:px-10 py-3 sticky top-0 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm z-20">
      {/* Search */}
      <div className="flex flex-1 justify-start">
        <label className="flex flex-col w-full max-w-sm h-10">
          <div className="flex w-full h-full items-stretch rounded-lg overflow-hidden">
            <div className="text-gray-500 dark:text-[#92a4c9] flex bg-gray-200 dark:bg-[#192131] items-center justify-center pl-4">
              <span className="material-symbols-outlined">search</span>
            </div>
            <input
              className="flex-1 border-none bg-gray-200 dark:bg-[#192131] text-gray-800 dark:text-white px-3 text-sm focus:outline-none placeholder:text-gray-500 dark:placeholder:text-[#92a4c9]"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </label>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 ml-4">
        <button className="flex items-center justify-center rounded-lg h-9 w-9 bg-gray-200 dark:bg-[#192131] text-gray-800 dark:text-white hover:scale-105 transition-transform">
          <span className="material-symbols-outlined text-xl">
            notifications
          </span>
        </button>
        <button
          onClick={onLogout}
          className="flex items-center justify-center rounded-lg h-9 w-9 bg-gray-200 dark:bg-[#192131] text-gray-800 dark:text-white hover:scale-105 transition-transform"
        >
          <span className="material-symbols-outlined text-xl">logout</span>
        </button>
        <div
          className="hidden sm:block bg-center bg-cover rounded-full size-9"
          style={{
            backgroundImage:
              'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBZy3AzehZnmw-59l3H47aWd8CTdBGaAYd4eTp_d3ydJ0PbddS8g29tntg6idt5rdsFL0HwXPAMfbXF7s2Gp5j5zPJMf1MzEoFJEWz5deT9EF0bhXK_N-8FTSM2AKhqY1TsJ5OgKE5nm1iqubHI97V3hpBq40pE9TO7tqymO4LDcbmRPoq1aQA8hikmhaVzrwW9t2wCMN_W4vv0iV7SCa5ZKHWU8a3NCiMfy_clsFEuBftJCBRanbSgh3HDKugEjQco-w3QlE7sa-A")',
          }}
        />
      </div>
    </header>
  );
};

export default AdminTopbar;
