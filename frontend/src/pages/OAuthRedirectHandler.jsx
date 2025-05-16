// src/pages/OAuthRedirectHandler.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Component to handle OAuth redirect and token storage
const OAuthRedirectHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Parse URL parameters to get the token
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      // Store token in localStorage for authentication
      localStorage.setItem("token", token);
      // After saving token, redirect to home page
      navigate("/home");
    } else {
      // If token is missing, show error and redirect to login
      alert("Google login failed. Please try again.");
      navigate("/login");
    }
  }, [navigate]);

  return (
    // Simple loading message with background styling
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-cyan-200 text-xl">
      Logging you in...
    </div>
  );
};

export default OAuthRedirectHandler;