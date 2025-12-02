// src/pages/HomePage.jsx
import React from "react";
import Header from "../components/home/Header";
import HeroSection from "../components/home/HeroSection";
import FeaturesSection from "../components/home/FeaturesSection";
import Footer from "../components/home/Footer";

const HomePage = () => {
  return (
    <div className="font-display">
      <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark overflow-x-hidden">
        <div className="layout-container flex h-full grow flex-col">
          {/* This wrapper keeps header, hero, features and footer
              centered and limited to max-w-[960px] just like your
              original single-file version */}
          <div className="px-4 md:px-20 lg:px-40 flex flex-1 justify-center py-5">
            <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
              <Header />

              <main className="flex flex-col gap-10 md:gap-16 lg:gap-20">
                <HeroSection />
                <FeaturesSection />
              </main>

              <Footer />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
