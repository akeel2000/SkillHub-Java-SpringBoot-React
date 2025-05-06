// src/pages/OAuthRedirectHandler.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const OAuthRedirectHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);
      // After saving token, redirect to home
      navigate("/home");
    } else {
      alert("Google login failed. Please try again.");
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-cyan-200 text-xl">
      Logging you in...
    </div>
  );
};

export default OAuthRedirectHandler;
