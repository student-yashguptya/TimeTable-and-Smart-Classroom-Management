// src/components/auth/LoginLayout.jsx
import React from "react";
import { Link } from "react-router-dom";
import AuthBrand from "./AuthBrand";
import RoleSelector from "./RoleSelector";

const LoginLayout = ({
  roles,
  role,
  setRole,
  emailOrId,
  setEmailOrId,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  errors,
  onSubmit,
}) => {
  return (
    <div className="flex w-full max-w-6xl overflow-hidden rounded-xl bg-white shadow-lg dark:bg-[#192233]">
      {/* Left image */}
      <div className="hidden lg:block lg:w-1/2">
        <div
          className="w-full h-full bg-center bg-no-repeat bg-cover min-h-[400px]"
          style={{
            backgroundImage:
              'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAt7jd-3iMde_HjO3j1xnEG0eI7CwNL6uI6qvqLj1w_mogN_mXEaJcAVGTNSaeQV3pY7ylTnaWGoTNCWBvOoed7zeL9FLzQvT7gKtGQbP1dNv63yDGkE-AUEppzFZ2GVZXrpIXU1hcsHh6Jcpgu-O-RuNXIOhBxsR-FVMU_B6T2dKZ4UgJG053WuLs2oXeQFo5DfXjpbAde9lliKzOyDSIgSRUbpSPtONkofnsx-OhEufud7gb-Fu0okchqrrEel9nQ4hM0FGcn-HA")',
          }}
        />
      </div>

      {/* Right form */}
      <div className="w-full p-6 sm:p-8 lg:p-12 lg:w-1/2 flex flex-col justify-center">
        <AuthBrand />

        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          Welcome Back!
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Login to access your dashboard.
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-6" noValidate>
          {/* Role selector */}
          <RoleSelector roles={roles} role={role} setRole={setRole} />

          {/* Email / ID */}
          <div className="space-y-4">
            <label className="flex flex-col">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 pb-2">
                Email or ID
              </p>
              <input
                className={`form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border bg-transparent h-12 placeholder:text-gray-400 dark:placeholder:text-gray-500 px-4 text-base font-normal leading-normal ${
                  errors.emailOrId
                    ? "border-red-500 dark:border-red-500"
                    : "border-gray-300 dark:border-gray-600 focus:border-primary/50 dark:focus:border-primary/50"
                }`}
                placeholder="Enter your email or ID"
                value={emailOrId}
                onChange={(e) => setEmailOrId(e.target.value)}
              />
              {errors.emailOrId && (
                <span className="mt-1 text-xs text-red-500">
                  {errors.emailOrId}
                </span>
              )}
            </label>

            {/* Password */}
            <label className="flex flex-col">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 pb-2">
                Password
              </p>
              <div className="relative flex items-center">
                <input
                  className={`form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border bg-transparent h-12 placeholder:text-gray-400 dark:placeholder:text-gray-500 px-4 pr-10 text-base font-normal leading-normal ${
                    errors.password
                      ? "border-red-500 dark:border-red-500"
                      : "border-gray-300 dark:border-gray-600 focus:border-primary/50 dark:focus:border-primary/50"
                  }`}
                  placeholder="Enter your password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                >
                  <span className="material-symbols-outlined">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
              {errors.password && (
                <span className="mt-1 text-xs text-red-500">
                  {errors.password}
                </span>
              )}
            </label>
          </div>

          {/* Login button */}
          <button
            type="submit"
            className="flex h-12 w-full items-center justify-center rounded-lg bg-primary px-6 text-base font-semibold text-white shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary/70"
          >
            Login
          </button>

          {/* Forgot password link */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 items-center justify-between text-sm">
            <Link
              to="/forgot-password"
              className="font-medium text-primary hover:underline flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-base">
                sms_failed
              </span>
              <span>Forgot Password?</span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginLayout;
