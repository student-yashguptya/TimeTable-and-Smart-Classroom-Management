// src/components/home/FeaturesSection.jsx
import React from "react";
import FeatureCard from "./FeatureCard";

const FeaturesSection = () => (
  <div id="features" className="flex flex-col gap-10 px-4 py-10 @container">
    <div className="flex flex-col gap-4 text-center items-center">
      <h1 className="text-slate-900 dark:text-white text-[32px] font-bold @[480px]:text-4xl max-w-[720px]">
        Why Choose Our System?
      </h1>
      <p className="text-gray-600 dark:text-gray-400 max-w-[720px]">
        Discover the powerful features that make scheduling simple and
        efficient for everyone.
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
);

export default FeaturesSection;
