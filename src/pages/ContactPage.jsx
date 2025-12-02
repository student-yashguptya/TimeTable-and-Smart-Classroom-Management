// src/pages/ContactPage.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import ContactLayout from "../components/contact/ContactLayout";

const ContactPage = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("General Inquiry");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const newErrors = {};

    if (!fullName.trim()) {
      newErrors.fullName = "Full name is required.";
    }

    if (!email.trim()) {
      newErrors.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!subject.trim()) {
      newErrors.subject = "Please select a subject.";
    }

    if (!message.trim()) {
      newErrors.message = "Message is required.";
    } else if (message.trim().length < 10) {
      newErrors.message = "Message should be at least 10 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(false);

    if (!validate()) return;

    // Send data to backend or email service here
    console.log({ fullName, email, subject, message });

    setSubmitted(true);
    setFullName("");
    setEmail("");
    setSubject("General Inquiry");
    setMessage("");
    setErrors({});
  };

  return (
    <div className="font-display bg-background-light dark:bg-background-dark">
      <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden">
        <div className="layout-container flex h-full grow flex-col">
          {/* HEADER */}
          <header className="flex items-center justify-between whitespace-nowrap border-b border-zinc-200 dark:border-zinc-800 px-6 md:px-10 py-3 fixed top-0 left-0 right-0 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm z-50">
            <div className="flex items-center gap-4 text-zinc-900 dark:text-white">
              <div className="size-6 text-primary">
                <svg
                  fill="none"
                  viewBox="0 0 48 48"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M24 45.8096C19.6865 45.8096 15.4698 44.5305 11.8832 42.134C8.29667 39.7376 5.50128 36.3314 3.85056 32.3462C2.19985 28.361 1.76794 23.9758 2.60947 19.7452C3.451 15.5145 5.52816 11.6284 8.57829 8.5783C11.6284 5.52817 15.5145 3.45101 19.7452 2.60948C23.9758 1.76795 28.361 2.19986 32.3462 3.85057C36.3314 5.50129 39.7376 8.29668 42.134 11.8833C44.5305 15.4698 45.8096 19.6865 45.8096 24L24 24L24 45.8096Z"
                    fill="currentColor"
                  ></path>
                </svg>
              </div>
              <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]">
                Timetable Manager
              </h2>
            </div>

            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 px-4 h-10 text-sm font-medium text-zinc-900 dark:text-white hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
            >
              <span className="material-symbols-outlined text-xl">
                arrow_back
              </span>
              <span>Back to Home</span>
            </Link>
          </header>

          {/* MAIN */}
          <main className="flex-1 px-4 md:px-10 lg:px-20 pt-28 pb-10">
            <ContactLayout
              fullName={fullName}
              setFullName={setFullName}
              email={email}
              setEmail={setEmail}
              subject={subject}
              setSubject={setSubject}
              message={message}
              setMessage={setMessage}
              errors={errors}
              submitted={submitted}
              onSubmit={handleSubmit}
            />
          </main>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
