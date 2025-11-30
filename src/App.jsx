// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import ContactPage from "./pages/ContactPage.jsx";
import ForgotPasswordPage from "./pages/ForgotPasswordPage.jsx";

const App = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background-light dark:bg-background-dark text-white">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        </Routes>
        <ThemeToggle />
      </div>
    </BrowserRouter>
  );
};

const ThemeToggle = () => {
  const [isDark, setIsDark] = React.useState(
    document.documentElement.classList.contains("dark")
  );

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
    setIsDark(document.documentElement.classList.contains("dark"));
  };

  return (
    <button
      onClick={toggleTheme}
      className="fixed bottom-4 right-4 z-50 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-white shadow-md hover:bg-primary/90"
    >
      {isDark ? "Light Mode" : "Dark Mode"}
    </button>
  );
};

export default App;
