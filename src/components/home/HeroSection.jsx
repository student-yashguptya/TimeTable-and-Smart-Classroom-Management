// src/components/home/HeroSection.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <div className="@container pt-10">
      <div className="@[480px]:p-4">
        <div
          className="flex min-h-[480px] flex-col gap-6 bg-cover bg-center bg-no-repeat @[480px]:gap-8 @[480px]:rounded-xl items-center justify-center px-4 py-10 @[480px]:px-10 text-center"
          style={{
            backgroundImage:
              'linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.4)), url("https://lh3.googleusercontent.com/aida-public/AB6AXuD8LuM-X09ieamBZwWTQ2QmyLIxOurRlMNAxdK-IOrYVh2jjJ54IYtr7-5PFrEhdRWs7adKIa0mGyQq8sge1IQhINw1m8ydfBG4bRP1gNcFSTvvF5zrcMTDbIjbCkxLlj7qcDWhtLo4wCVuOVsq-CMsGfumInxoE0uxM0ddIWyO4HByIlvRfwAdEgFIuXTAEiQ7FbkBjxxfEIeCq6e-YO9lpe32Y4yyDroXJi5MLUaal3TRoxBSYG-OAp7j3tbLOZNNjaaDMigE6q4")',
          }}
        >
          <div className="flex flex-col gap-4 max-w-2xl">
            <h1 className="text-white text-4xl font-bold leading-tight tracking-[-0.033em] @[480px]:text-5xl">
              Welcome to Smart Timetable
            </h1>
            <h2 className="text-gray-200 text-base @[480px]:text-lg">
              Effortlessly manage schedules, resources, and classrooms with our
              intelligent system.
            </h2>
          </div>

          <div className="flex w-full justify-center mt-4">
            <button
              onClick={() => navigate("/login")}
              className="flex w-full sm:w-auto min-w-[140px] max-w-[260px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-primary text-white text-base font-bold tracking-[0.015em] hover:bg-primary/90 transition-colors shadow-md hover:shadow-lg"
            >
              <span className="truncate">Login</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
