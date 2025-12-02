// src/components/admin/AdminWelcomeSection.jsx
import React from "react";

const AdminWelcomeSection = ({
  onGenerate,
  isGenerating,
  onAddCourse,
  onAddClassroom,
}) => {
  return (
    <div className="flex flex-wrap justify-between items-start gap-4">
      <div className="flex min-w-72 flex-col gap-2">
        <p className="text-gray-900 dark:text-white text-3xl md:text-4xl font-black leading-tight tracking-[-0.03em]">
          Welcome, Admin!
        </p>
        <p className="text-gray-600 dark:text-[#92a4c9] text-sm md:text-base">
          Here's an overview of the system's status.
        </p>
      </div>
      <div className="flex gap-3 flex-wrap">

      
      </div>
    </div>
  );
};

export default AdminWelcomeSection;
