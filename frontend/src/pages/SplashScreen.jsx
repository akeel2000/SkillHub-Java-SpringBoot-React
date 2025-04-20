import React from "react";
import { useNavigate } from "react-router-dom";

const SplashScreen = () => {
  const navigate = useNavigate();

  React.useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/onboarding");
    }, 3000); // 3 seconds splash delay

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
      <div className="text-center animate-pulse">
        <h1 className="text-4xl font-bold mb-4">SkillShare</h1>
        <p className="text-lg">Learn & Share Skills Instantly</p>
      </div>
    </div>
  );
};

export default SplashScreen;

