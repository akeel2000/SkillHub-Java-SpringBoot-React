import React from "react";
import { useNavigate } from "react-router-dom";

const Onboarding = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col justify-between bg-white px-6 py-10">
      <div>
        <h1 className="text-3xl font-bold text-center text-indigo-600">Welcome to SkillShare</h1>
        <p className="text-center mt-4 text-gray-600">
          Discover, share and grow your skills with people around the world.
        </p>
        <img
          src="/assets/onboarding.png"
          alt="Learn and Share"
          className="w-full max-w-md mx-auto mt-8"
        />
      </div>
      <button
        onClick={() => navigate("/login")}
        className="bg-indigo-600 text-white text-lg py-3 rounded-xl shadow-lg hover:bg-indigo-700 transition"
      >
        Get Started
      </button>
    </div>
  );
};

export default Onboarding;
