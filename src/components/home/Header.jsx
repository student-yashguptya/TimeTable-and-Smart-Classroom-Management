// src/components/home/Header.jsx
import React from "react";
import { Link } from "react-router-dom";
import Logo from "../common/Logo";

const Header = () => {
  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-gray-200 dark:border-gray-700 px-4 sm:px-10 py-3">
      <Logo />

      <div className="hidden sm:flex items-center gap-9">
        <a
          href="#features"
          className="text-slate-900 dark:text-gray-300 text-sm font-medium leading-normal hover:text-primary dark:hover:text-primary"
        >
          Features
        </a>
        <Link
          to="/contact"
          className="text-slate-900 dark:text-gray-300 text-sm font-medium leading-normal hover:text-primary dark:hover:text-primary"
        >
          Contact
        </Link>
      </div>
    </header>
  );
};

export default Header;
