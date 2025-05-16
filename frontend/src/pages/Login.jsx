import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// Login component for user authentication
const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // State for email and password input fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // State to control if the form is active
  const [isFormActive, setIsFormActive] = useState(true);

  // Effect to reset form fields and state when navigating to /login
  useEffect(() => {
    if (location.pathname === "/login") {
      if (location.state?.email) {
        setEmail(location.state.email);
      } else {
        setEmail("");
      }
      setPassword("");
      setIsFormActive(true);
    } else {
      setIsFormActive(false);
    }
  }, [location]);

  // Handle login form submission
  const handleLogin = async (e) => {
    e.preventDefault();
    // Prevent login if form is not active or not on /login route
    if (!isFormActive || window.location.pathname !== "/login") return;

    try {
      // Send login request to backend API
      const res = await fetch("http://localhost:8080/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result = await res.text();
      if (res.ok) {
        // Store token and email in localStorage on successful login
        localStorage.setItem("token", result);
        localStorage.setItem("userEmail", email);
        navigate("/home");
      } else {
        alert("Invalid email or password");
      }
    } catch {
      alert("Login failed");
    }
  };

  // Handle OAuth login with Google
  const handleOAuthLogin = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

  // Redirect to signup page and clear local storage
  const handleSignupRedirect = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    setIsFormActive(false);
    setTimeout(() => navigate("/signup"), 0);
  };

  return (
    // Main container with animated background
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 overflow-hidden">
      {/* Animated Background Circles */}
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

      {/* Login Form Card */}
      <form 
        onSubmit={handleLogin} 
        className="relative z-10 bg-gradient-to-br from-purple-800/50 to-blue-800/50 p-8 rounded-3xl shadow-2xl backdrop-blur-xl border border-cyan-300/20 w-full max-w-md space-y-6 animate-fadeInUp"
      >
        {/* Title */}
        <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 text-center mb-6">
          Welcome Back
          <div className="absolute inset-0 -z-10 blur-2xl opacity-20 bg-gradient-to-r from-cyan-400 to-blue-500" />
        </h2>

        {/* Email and Password Fields */}
        <div className="space-y-4">
          <div className="relative group">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Email"
              className="w-full px-4 py-3 bg-purple-900/30 border-2 border-cyan-300/20 rounded-xl text-cyan-100 placeholder-cyan-200/50 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all"
            />
            <div className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>

          <div className="relative group">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Password"
              className="w-full px-4 py-3 bg-purple-900/30 border-2 border-cyan-300/20 rounded-xl text-cyan-100 placeholder-cyan-200/50 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all"
            />
            <div className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>

        {/* Sign In Button */}
        <button 
          type="submit" 
          className="w-full bg-gradient-to-br from-cyan-500 to-blue-600 text-white font-bold py-3 rounded-xl shadow-2xl hover:shadow-3xl transform transition-all duration-300 hover:-translate-y-1 hover:scale-105 active:scale-95"
        >
          Sign In
        </button>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-cyan-300/20" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-purple-800/50 text-cyan-300">Or continue with</span>
          </div>
        </div>

        {/* Google OAuth Button */}
        <button
          type="button"
          onClick={handleOAuthLogin}
          className="w-full bg-gradient-to-br from-purple-500 to-pink-600 text-white font-bold py-3 rounded-xl shadow-2xl hover:shadow-3xl transform transition-all duration-300 hover:-translate-y-1 hover:scale-105 active:scale-95 group"
        >
          <span className="flex items-center justify-center space-x-2">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"/>
            </svg>
            <span>Google</span>
          </span>
        </button>

        {/* Signup Link */}
        <p className="text-center text-cyan-300/80">
          Don’t have an account?{" "}
          <button 
            onClick={handleSignupRedirect}
            className="text-cyan-400 hover:text-cyan-300 font-semibold underline-offset-4 hover:underline transition-all"
          >
            Sign Up
          </button>
        </p>
      </form>

      {/* CSS for floating animation and fade-in effect */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(10deg); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeInUp {
          animation: fadeInUp 1s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Login;