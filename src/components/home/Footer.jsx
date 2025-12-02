// src/components/home/Footer.jsx
import React from "react";

const Footer = () => (
  <footer className="mt-auto px-4 sm:px-10 py-8 border-t border-gray-200 dark:border-gray-800">
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        © 2024 Smart Timetable. All rights reserved.
      </p>
      <div className="flex gap-6">
        <a
          className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary"
          href="#"
        >
          Privacy Policy
        </a>
        <a
          className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary"
          href="#"
        >
          Terms of Service
        </a>
      </div>
    </div>
  </footer>
);

export default Footer;
