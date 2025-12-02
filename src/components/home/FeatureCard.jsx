// src/components/home/FeatureCard.jsx
import React from "react";

const FeatureCard = ({ icon, iconClass, title, description }) => (
  <div className="flex flex-1 gap-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-background-dark p-4 flex-col hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
    <div className={`${iconClass} p-2 rounded-lg w-fit`}>
      <span className="material-symbols-outlined text-3xl">{icon}</span>
    </div>
    <div className="flex flex-col gap-1">
      <h2 className="text-slate-900 dark:text-white text-base font-bold">
        {title}
      </h2>
      <p className="text-gray-500 dark:text-gray-400 text-sm">
        {description}
      </p>
    </div>
  </div>
);

export default FeatureCard;
