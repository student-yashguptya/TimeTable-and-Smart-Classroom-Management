// src/components/admin/AdminSidebar.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const currentPath = location.pathname;

  return (
    <aside className="hidden md:flex h-auto min-h-screen w-64 flex-col justify-between bg-[#192131] p-4 text-white">
      <div className="flex flex-col gap-8">
        {/* Brand */}
        <div className="flex items-center gap-2 px-3 py-2">
          <span className="material-symbols-outlined text-3xl text-primary">
            school
          </span>
          <h2 className="text-lg font-bold tracking-[-0.015em]">TimeWise</h2>
        </div>

        {/* Nav items */}
        <div className="flex flex-col gap-2">
          <NavItem
            icon="dashboard"
            label="Dashboard"
            active={currentPath === "/admin"}
            onClick={() => navigate("/admin")}
          />

          <NavItem
            icon="calendar_month"
            label="Timetables"
            active={currentPath === "/admin/timetables"}
            onClick={() => navigate("/admin/timetables")}
          />

          <NavItem
            icon="import_contacts"
            label="Courses"
            active={currentPath === "/admin/courses"}
            onClick={() => navigate("/admin/courses")}
          />

          <NavItem
            icon="group"
            label="Teachers"
            active={currentPath === "/admin/teachers"}
            onClick={() => navigate("/admin/teachers")}
          />

          <NavItem
            icon="meeting_room"
            label="Rooms"
            active={currentPath === "/admin/rooms"}
            onClick={() => navigate("/admin/rooms")}
          />
        </div>
      </div>

      {/* Bottom */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3 px-3 py-2 text-[#92a4c9] hover:text-white cursor-pointer">
          <span className="material-symbols-outlined">settings</span>
          <p className="text-sm font-medium">Settings</p>
        </div>

        <div className="border-t border-white/10 my-2" />

        <div className="flex gap-3 items-center px-1">
          <div
            className="bg-center bg-cover rounded-full size-10"
            style={{
              backgroundImage:
                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuC6S_CMojv6hJSuC_9qVDm6a9Kyz9HX2dGzwhSTxcapDEpKUzj9LHYCJ_KRG3tO8MfAjk1N4SiKJDa-UYzQywIeeGtIjC7Mvrhtbz5A4NZom_dMg0Aa-FM3xjONFXwHYaBtFpeZ1XSAVU5GWmYIg-Ev88CiT4aftQwGmQWOk3mAuy1IlRSIaioL60a_VrVy1gdqtPy0s0REaHBrWTHXd7yT41FjCcyyMj-zuR8_I8fqnj_2Sf-UGGyGPhTzAgQEXeEswxpQZMUpvrk")',
            }}
          />
          <div className="flex flex-col">
            <h1 className="text-base font-medium">Admin</h1>
            <p className="text-xs text-[#92a4c9]">admin@university.edu</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

// NavItem component with navigation support
const NavItem = ({ icon, label, active, onClick }) => (
  <div
    onClick={onClick}
    className={`flex items-center gap-3 px-3 py-2 text-sm font-medium cursor-pointer rounded-lg transition-colors
      ${
        active
          ? "bg-primary/20 text-primary"
          : "text-[#92a4c9] hover:text-white"
      }`}
  >
    <span className="material-symbols-outlined">{icon}</span>
    <p>{label}</p>
  </div>
);

export default AdminSidebar;
