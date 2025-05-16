import React from "react";
import { useNavigate } from "react-router-dom";

const Onboarding = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    try {
      navigate(path);
    } catch (err) {
      console.error(`Navigation to ${path} failed:`, err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid slice"
        >
          <pattern id="pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="#14b8a6" />
            <circle cx="10" cy="10" r="1" fill="#14b8a6" />
            <circle cx="18" cy="18" r="1" fill="#14b8a6" />
          </pattern>
          <rect x="0" y="0" width="100%" height="100%" fill="url(#pattern)" />
        </svg>
      </div>

      {/* Main Content */}
      <div
        className="relative z-10 max-w-lg mx-auto bg-gray-50 rounded-xl shadow-sm p-8 text-center space-y-6 animate-fade-in"
        role="region"
        aria-label="SkillHub onboarding screen"
      >
        <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 font-inter">
          SkillHub
        </h1>

        <p className="text-lg font-semibold text-teal-500 tracking-tight font-inter">
          Connect. Create. Collaborate.
        </p>

        <div className="space-y-4">
          <svg
            className="w-16 h-16 mx-auto text-teal-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v2h5v-2M7 20a3 3 0 005.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <p className="text-gray-700 font-inter">
            Join a community to <span className="text-teal-500 font-medium">connect</span>,{" "}
            <span className="text-teal-500 font-medium">create</span>, and{" "}
            <span className="text-teal-500 font-medium">collaborate</span> on your learning journey.
          </p>
        </div>

        <div className="flex justify-center gap-4">
          <button
            onClick={() => handleNavigation("/login")}
            className="inline-flex items-center gap-2 px-6 py-3 bg-teal-500 text-white rounded-lg font-semibold tracking-tight hover:bg-teal-600 hover:scale-105 transition-all duration-200 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
            aria-label="Get started with SkillHub"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
            Get Started
          </button>
          <button
            onClick={() => handleNavigation("/home")}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-300 text-gray-900 rounded-lg font-semibold tracking-tight hover:bg-gray-400 hover:scale-105 transition-all duration-200 focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
            aria-label="Skip onboarding and go to home"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            Skip
          </button>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Onboarding;
