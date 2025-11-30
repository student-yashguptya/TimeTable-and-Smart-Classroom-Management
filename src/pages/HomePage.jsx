// src/pages/HomePage.jsx
import React from "react";
import { useNavigate, Link } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <div className="font-display">
      <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark group/design-root overflow-x-hidden">
        <div className="layout-container flex h-full grow flex-col">
          <div className="px-4 md:px-20 lg:px-40 flex flex-1 justify-center py-5">
            <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
              {/* HEADER */}
              <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-gray-200 dark:border-gray-700 px-4 sm:px-10 py-3">
                <div className="flex items-center gap-4 text-slate-900 dark:text-white">
                  <div className="size-6 text-primary">
                    <svg
                      fill="none"
                      viewBox="0 0 48 48"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M13.8261 17.4264C16.7203 18.1174 20.2244 18.5217 24 18.5217C27.7756 18.5217 31.2797 18.1174 34.1739 17.4264C36.9144 16.7722 39.9967 15.2331 41.3563 14.1648L24.8486 40.6391C24.4571 41.267 23.5429 41.267 23.1514 40.6391L6.64374 14.1648C8.00331 15.2331 11.0856 16.7722 13.8261 17.4264Z"
                        fill="currentColor"
                      ></path>
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M39.998 12.236C39.9944 12.2537 39.9875 12.2845 39.9748 12.3294C39.9436 12.4399 39.8949 12.5741 39.8346 12.7175C39.8168 12.7597 39.7989 12.8007 39.7813 12.8398C38.5103 13.7113 35.9788 14.9393 33.7095 15.4811C30.9875 16.131 27.6413 16.5217 24 16.5217C20.3587 16.5217 17.0125 16.131 14.2905 15.4811C12.0012 14.9346 9.44505 13.6897 8.18538 12.8168C8.17384 12.7925 8.16216 12.767 8.15052 12.7408C8.09919 12.6249 8.05721 12.5114 8.02977 12.411C8.00356 12.3152 8.00039 12.2667 8.00004 12.2612C8.00004 12.261 8 12.2607 8.00004 12.2612C8.00004 12.2359 8.0104 11.9233 8.68485 11.3686C9.34546 10.8254 10.4222 10.2469 11.9291 9.72276C14.9242 8.68098 19.1919 8 24 8C28.8081 8 33.0758 8.68098 36.0709 9.72276C37.5778 10.2469 38.6545 10.8254 39.3151 11.3686C39.9006 11.8501 39.9857 12.1489 39.998 12.236ZM4.95178 15.2312L21.4543 41.6973C22.6288 43.5809 25.3712 43.5809 26.5457 41.6973L43.0534 15.223C43.0709 15.1948 43.0878 15.1662 43.104 15.1371L41.3563 14.1648C43.104 15.1371 43.1038 15.1374 43.104 15.1371L43.1051 15.135L43.1065 15.1325L43.1101 15.1261L43.1199 15.1082C43.1276 15.094 43.1377 15.0754 43.1497 15.0527C43.1738 15.0075 43.2062 14.9455 43.244 14.8701C43.319 14.7208 43.4196 14.511 43.5217 14.2683C43.6901 13.8679 44 13.0689 44 12.2609C44 10.5573 43.003 9.22254 41.8558 8.2791C40.6947 7.32427 39.1354 6.55361 37.385 5.94477C33.8654 4.72057 29.133 4 24 4C18.867 4 14.1346 4.72057 10.615 5.94478C8.86463 6.55361 7.30529 7.32428 6.14419 8.27911C4.99695 9.22255 3.99999 10.5573 3.99999 12.2609C3.99999 13.1275 4.29264 13.9078 4.49321 14.3607C4.60375 14.6102 4.71348 14.8196 4.79687 14.9689C4.83898 15.0444 4.87547 15.1065 4.9035 15.1529C4.91754 15.1762 4.92954 15.1957 4.93916 15.2111L4.94662 15.223L4.95178 15.2312ZM35.9868 18.996L24 38.22L12.0131 18.996C12.4661 19.1391 12.9179 19.2658 13.3617 19.3718C16.4281 20.1039 20.0901 20.5217 24 20.5217C27.9099 20.5217 31.5719 20.1039 34.6383 19.3718C35.082 19.2658 35.5339 19.1391 35.9868 18.996Z"
                        fill="currentColor"
                      ></path>
                    </svg>
                  </div>
                  <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">
                    Smart Timetable
                  </h2>
                </div>

                <div className="flex flex-1 justify-end gap-8">
                  <div className="hidden sm:flex items-center gap-9">
                    <a
                      className="text-slate-900 dark:text-gray-300 text-sm font-medium leading-normal hover:text-primary dark:hover:text-primary"
                      href="#features"
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
                </div>
              </header>

              {/* MAIN */}
              <main className="flex flex-col gap-10 md:gap-16 lg:gap-20">
                {/* HERO */}
                <div className="@container pt-10">
                  <div className="@[480px]:p-4">
                    <div
                      className="flex min-h-[480px] flex-col gap-6 bg-cover bg-center bg-no-repeat @[480px]:gap-8 @[480px]:rounded-xl items-center justify-center px-4 py-10 @[480px]:px-10 text-center"
                      style={{
                        backgroundImage:
                          'linear-gradient(rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.4) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuD8LuM-X09ieamBZwWTQ2QmyLIxOurRlMNAxdK-IOrYVh2jjJ54IYtr7-5PFrEhdRWs7adKIa0mGyQq8sge1IQhINw1m8ydfBG4bRP1gNcFSTvvF5zrcMTDbIjbCkxLlj7qcDWhtLo4wCVuOVsq-CMsGfumInxoE0uxM0ddIWyO4HByIlvRfwAdEgFIuXTAEiQ7FbkBjxxfEIeCq6e-YO9lpe32Y4yyDroXJi5MLUaal3TRoxBSYG-OAp7j3tbLOZNNjaaDMigE6q4")',
                      }}
                    >
                      <div className="flex flex-col gap-4 max-w-2xl">
                        <h1 className="text-white text-4xl font-bold leading-tight tracking-[-0.033em] @[480px]:text-5xl">
                          Welcome to Smart Timetable
                        </h1>
                        <h2 className="text-gray-200 text-base @[480px]:text-lg">
                          Effortlessly manage schedules, resources, and
                          classrooms with our intelligent system.
                        </h2>
                      </div>

                      <div className="flex w-full justify-center mt-4">
                        <button
                          onClick={handleLoginClick}
                          className="flex w-full sm:w-auto min-w-[140px] max-w-[260px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-primary text-white text-base font-bold tracking-[0.015em] hover:bg-primary/90 transition-colors shadow-md hover:shadow-lg"
                        >
                          <span className="truncate">Login</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* FEATURES */}
                <div
                  id="features"
                  className="flex flex-col gap-10 px-4 py-10 @container"
                >
                  <div className="flex flex-col gap-4 text-center items-center">
                    <h1 className="text-slate-900 dark:text-white text-[32px] font-bold @[480px]:text-4xl max-w-[720px]">
                      Why Choose Our System?
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 max-w-[720px]">
                      Discover the powerful features that make scheduling simple
                      and efficient for everyone.
                    </p>
                  </div>

                  <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4">
                    <FeatureCard
                      icon="event_available"
                      iconClass="text-[#50E3C2] bg-teal-500/10"
                      title="Zero Clash Timetable"
                      description="Our intelligent algorithm automatically resolves scheduling conflicts, ensuring a seamless experience for all users."
                    />
                    <FeatureCard
                      icon="meeting_room"
                      iconClass="text-[#F5A623] bg-orange-500/10"
                      title="Smart Classroom Allocation"
                      description="Optimize the use of your campus resources with our smart allocation system that assigns the best-suited classrooms."
                    />
                    <FeatureCard
                      icon="notifications_active"
                      iconClass="text-primary bg-primary/10"
                      title="Real-time Updates"
                      description="Stay informed with instant notifications for any schedule changes, keeping students and teachers up-to-date."
                    />
                  </div>
                </div>
              </main>

              {/* FOOTER */}
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

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

export default HomePage;
