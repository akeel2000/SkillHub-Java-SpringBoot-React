import React from "react";
import { useNavigate } from "react-router-dom";

// SplashScreen component displays an animated splash before onboarding
const SplashScreen = () => {
  const navigate = useNavigate();

  // Automatically navigate to onboarding after 4 seconds
  React.useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/onboarding");
    }, 4000);

    // Cleanup timer 
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    // Main splash background with animated spinning circles
    <div className="relative flex items-center justify-center h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 overflow-hidden">
      {/* Animated spinning circles for visual effect */}
      <div className="absolute w-[300%] h-[300%] animate-spin-slow">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-8 h-8 border-2 border-opacity-25 border-cyan-300 rounded-full"
            style={{
              left: `${Math.cos((i * 30 * Math.PI) / 180) * 50 + 50}%`,
              top: `${Math.sin((i * 30 * Math.PI) / 180) * 50 + 50}%`,
              transform: `scale(${0.5 + i * 0.1})`,
            }}
          />
        ))}
      </div>

      {/* Centered logo and tagline */}
      <div className="relative z-10 space-y-8 text-center">
        {/* Animated SkillHub logo */}
        <div className="animate-float">
          <div className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 lg:text-8xl">
            SkillHub
            {/* Blurred gradient shadow behind logo */}
            <div className="absolute inset-0 transform -skew-y-6 translate-y-6 blur-3xl opacity-30 bg-gradient-to-r from-cyan-400 to-blue-500" />
          </div>
        </div>

        {/* Animated tagline */}
        <div className="animate-fade-in">
          <p className="text-xl font-semibold tracking-widest text-cyan-300 uppercase">
            Connect & Create Together
          </p>
        </div>
      </div>

      {/* Custom CSS animations for splash effects */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotateX(20deg) rotateY(20deg); }
          50% { transform: translateY(-20px) rotateX(-20deg) rotateY(-20deg); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 40s linear infinite;
        }
        .animate-fade-in {
          animation: fade-in 1.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default SplashScreen;