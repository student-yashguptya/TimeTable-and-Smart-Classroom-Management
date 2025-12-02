// src/components/contact/ContactLayout.jsx
import React from "react";

const ContactLayout = ({
  fullName,
  setFullName,
  email,
  setEmail,
  subject,
  setSubject,
  message,
  setMessage,
  errors,
  submitted,
  onSubmit,
}) => {
  return (
    <div className="mx-auto max-w-5xl">
      {/* Intro */}
      <div className="flex flex-wrap justify-between gap-4 p-4">
        <div className="flex min-w-72 flex-col gap-2">
          <p className="text-zinc-900 dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">
            Get in Touch
          </p>
          <p className="text-zinc-500 dark:text-zinc-400 text-base">
            We'd love to hear from you. Fill out the form below or use our
            contact details to reach out.
          </p>
        </div>
      </div>

      {/* Info + quick links + form */}
      <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-12 p-4">
        {/* Left column: contact info & quick links */}
        <div className="flex flex-col gap-10">
          <div>
            <h2 className="text-zinc-900 dark:text-white text-[22px] font-bold pb-3">
              Contact Information
            </h2>
            <div className="grid grid-cols-[auto_1fr] gap-x-6 border-t border-zinc-200 dark:border-zinc-800">
              <div className="col-span-2 grid grid-cols-subgrid py-5 border-b border-zinc-200 dark:border-zinc-800">
                <p className="text-zinc-500 dark:text-zinc-400 text-sm">
                  Email Us
                </p>
                <a
                  href="mailto:support@timetablemanager.com"
                  className="text-zinc-900 dark:text-white text-sm hover:text-primary dark:hover:text-primary transition-colors"
                >
                  support@timetablemanager.com
                </a>
              </div>
              <div className="col-span-2 grid grid-cols-subgrid py-5 border-b border-zinc-200 dark:border-zinc-800">
                <p className="text-zinc-500 dark:text-zinc-400 text-sm">
                  Call Us
                </p>
                <a
                  href="tel:+15551234567"
                  className="text-zinc-900 dark:text-white text-sm hover:text-primary dark:hover:text-primary transition-colors"
                >
                  +1 (555) 123-4567
                </a>
              </div>
              <div className="col-span-2 grid grid-cols-subgrid py-5">
                <p className="text-zinc-500 dark:text-zinc-400 text-sm">
                  Business Hours
                </p>
                <p className="text-zinc-900 dark:text-white text-sm">
                  Monday - Friday, 9:00 AM - 5:00 PM EST
                </p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-zinc-900 dark:text-white text-[22px] font-bold pb-3">
              Looking for quick answers?
            </h2>
            <div className="flex flex-col gap-4">
              <a
                href="#"
                className="flex items-center justify-between p-4 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-primary/50 dark:hover:border-primary/50 transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center size-10 rounded-lg bg-primary/10 text-primary">
                    <span className="material-symbols-outlined">quiz</span>
                  </div>
                  <div>
                    <p className="font-semibold text-zinc-900 dark:text-white">
                      Visit our FAQ
                    </p>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      Find answers to common questions.
                    </p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-800 dark:group-hover:text-zinc-200 transition-colors">
                  arrow_forward
                </span>
              </a>

              <a
                href="#"
                className="flex items-center justify-between p-4 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-primary/50 dark:hover:border-primary/50 transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center size-10 rounded-lg bg-primary/10 text-primary">
                    <span className="material-symbols-outlined">
                      menu_book
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-zinc-900 dark:text-white">
                      Support Docs
                    </p>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      Read our documentation.
                    </p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-800 dark:group-hover:text-zinc-200 transition-colors">
                  arrow_forward
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* Right column: contact form */}
        <div className="bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-xl border border-zinc-200 dark:border-zinc-800">
          <h2 className="text-zinc-900 dark:text-white text-[22px] font-bold pb-2">
            Send us a Message
          </h2>

          {submitted && (
            <div className="mt-4 mb-2 rounded-lg border border-green-500/60 bg-green-50/70 dark:bg-green-900/20 px-3 py-2 text-xs sm:text-sm text-green-700 dark:text-green-300">
              Thank you! Your message has been submitted (demo only).
            </div>
          )}

          <form
            className="flex flex-col gap-6 mt-6"
            onSubmit={onSubmit}
            noValidate
          >
            {/* Full Name */}
            <div>
              <label
                htmlFor="full-name"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
              >
                Full Name
              </label>
              <input
                id="full-name"
                name="full-name"
                type="text"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={`w-full rounded-lg border bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:border-primary focus:ring-primary h-11 px-3 text-sm ${
                  errors.fullName
                    ? "border-red-500 dark:border-red-500"
                    : "border-zinc-300 dark:border-zinc-700"
                }`}
              />
              {errors.fullName && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.fullName}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full rounded-lg border bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:border-primary focus:ring-primary h-11 px-3 text-sm ${
                  errors.email
                    ? "border-red-500 dark:border-red-500"
                    : "border-zinc-300 dark:border-zinc-700"
                }`}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Subject */}
            <div>
              <label
                htmlFor="subject"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
              >
                Subject
              </label>
              <select
                id="subject"
                name="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className={`w-full rounded-lg border bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white focus:border-primary focus:ring-primary h-11 px-3 text-sm ${
                  errors.subject
                    ? "border-red-500 dark:border-red-500"
                    : "border-zinc-300 dark:border-zinc-700"
                }`}
              >
                <option>General Inquiry</option>
                <option>Technical Support</option>
                <option>Billing Question</option>
                <option>Feedback</option>
              </select>
              {errors.subject && (
                <p className="mt-1 text-xs text-red-500">{errors.subject}</p>
              )}
            </div>

            {/* Message */}
            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                placeholder="Please describe your issue or question..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className={`w-full rounded-lg border bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:border-primary focus:ring-primary px-3 py-2 text-sm resize-none ${
                  errors.message
                    ? "border-red-500 dark:border-red-500"
                    : "border-zinc-300 dark:border-zinc-700"
                }`}
              />
              {errors.message && (
                <p className="mt-1 text-xs text-red-500">{errors.message}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary h-12 px-6 text-base font-bold text-white hover:bg-primary/90 transition-colors"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactLayout;
