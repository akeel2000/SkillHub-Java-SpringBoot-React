import React from "react";
import { useNavigate } from "react-router-dom";

const Onboarding = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 px-6 py-10 overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-16 h-16 border-4 border-opacity-10 border-cyan-300 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${10 + i * 2}s infinite linear`,
              transform: `scale(${0.5 + Math.random() * 1.5})`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 space-y-8 text-center">
        <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 animate-float">
          SkillHub
          <div className="absolute inset-0 transform -skew-y-6 translate-y-6 blur-3xl opacity-30 bg-gradient-to-r from-cyan-400 to-blue-500" />
        </h1>

        <p className="text-xl font-semibold text-cyan-300 animate-fade-in">
          Connect. Create. Collaborate.
        </p>

        <div className="relative max-w-md mx-auto mt-8 animate-float">
          <div className="transform perspective-1000 rotate-x-6 rotate-y-6 transition-all duration-500">
            <div className="bg-gradient-to-br from-purple-800 to-blue-800 p-8 rounded-3xl shadow-2xl">
              <div className="space-y-6 text-cyan-100">
                <div className="flex justify-center items-center space-x-4">
                  <div className="w-12 h-12 bg-cyan-400 rounded-full animate-pulse" />
                  <div className="w-12 h-12 bg-blue-400 rounded-full animate-pulse delay-100" />
                  <div className="w-12 h-12 bg-purple-400 rounded-full animate-pulse delay-200" />
                </div>
                <p className="text-lg">Share your skills</p>
                <div className="h-1 bg-cyan-500/30 rounded-full" />
                <div className="flex justify-center items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-400 rounded-full animate-pulse" />
                  <div className="w-12 h-12 bg-purple-400 rounded-full animate-pulse delay-100" />
                  <div className="w-12 h-12 bg-cyan-400 rounded-full animate-pulse delay-200" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 mt-12 w-full flex justify-center">
        <button
          onClick={() => navigate("/login")}
          className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white text-xl font-bold py-4 px-12 rounded-2xl shadow-2xl hover:shadow-3xl transform transition-all duration-300 hover:-translate-y-1 hover:scale-105 active:scale-95"
        >
          Get Started
        </button>
      </div>

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotateX(10deg) rotateY(10deg); }
          50% { transform: translateY(-20px) rotateX(-10deg) rotateY(-10deg); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.1); opacity: 1; }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-pulse {
          animation: pulse 2s ease-in-out infinite;
        }
        .delay-100 {
          animation-delay: 0.2s;
        }
        .delay-200 {
          animation-delay: 0.4s;
        }
      `}</style>
    </div>
  );
};

export default Onboarding;
