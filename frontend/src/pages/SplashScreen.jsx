import React from "react";
import { useNavigate } from "react-router-dom";

const SplashScreen = () => {
  const navigate = useNavigate();

  React.useEffect(() => {
    const timer = setTimeout(() => {
      try {
        navigate("/onboarding");
      } catch (err) {
        console.error("Navigation failed:", err);
      }
    }, 4000);

    return () => clearTimeout(timer);
  }, [navigate]);

  const handleSkip = () => {
    try {
      navigate("/onboarding");
    } catch (err) {
      console.error("Skip navigation failed:", err);
    }
  };

  return (
    <div className="relative flex items-center justify-center h-screen bg-gray-100">
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
        className="relative z-10 max-w-md mx-auto bg-gray-50 rounded-xl shadow-sm p-8 text-center space-y-4"
        role="alert"
        aria-label="SkillHub splash screen, redirects to onboarding in 4 seconds"
      >
        <div className="animate-float">
          <h1 className="text-6xl lg:text-7xl font-bold text-gray-900 font-inter">
            SkillHub
          </h1>
        </div>

        <div className="animate-fade-in">
          <p className="text-lg font-semibold text-teal-500 tracking-tight font-inter">
            Connect & Create Together
          </p>
        </div>

        {/* Loading Indicator */}
        <div className="flex justify-center space-x-2 mt-4">
          <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse" />
          <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse delay-100" />
          <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse delay-200" />
        </div>

        {/* Skip Button */}
        <button
          onClick={handleSkip}
          className="inline-flex items-center gap-2 px-4 py-2 bg-teal-500 text-white rounded-lg font-semibold tracking-tight hover:bg-teal-600 hover:scale-105 transition-all duration-200 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
          aria-label="Skip splash screen and go to onboarding"
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
          Skip
        </button>
      </div>

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        .delay-100 {
          animation-delay: 100ms;
        }
        .delay-200 {
          animation-delay: 200ms;
        }
      `}</style>
    </div>
  );
};

export default SplashScreen;
