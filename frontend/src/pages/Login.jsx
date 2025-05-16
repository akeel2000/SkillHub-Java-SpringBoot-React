import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isFormActive, setIsFormActive] = useState(true);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (location.pathname === "/login") {
      setEmail(location.state?.email || "");
      setPassword("");
      setIsFormActive(true);
    } else {
      setIsFormActive(false);
    }
  }, [location]);

  const validateInputs = () => {
    if (!email.trim()) return "Email cannot be empty";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Invalid email format";
    if (!password) return "Password cannot be empty";
    if (password.length < 6) return "Password must be at least 6 characters";
    return null;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!isFormActive || window.location.pathname !== "/login") return;

    setError(null);
    const validationError = validateInputs();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:8080/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result = await res.text();
      if (res.ok) {
        localStorage.setItem("token", result);
        localStorage.setItem("userEmail", email);
        navigate("/home");
      } else {
        setError(res.status === 401 ? "Invalid email or password" : "Login failed");
      }
    } catch {
      setError("An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthLogin = () => {
    if (isLoading) return;
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

  const handleSignupRedirect = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    setIsFormActive(false);
    navigate("/signup");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="max-w-md w-full bg-white rounded-xl shadow-sm p-8 space-y-6"
        aria-label="Login form"
        aria-describedby="form-error"
      >
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight font-inter text-center">
          Welcome Back
        </h2>

        {/* Error Message */}
        {error && (
          <p
            className="text-sm text-red-600 bg-red-50 p-3 rounded-md text-center"
            id="form-error"
            role="alert"
            aria-live="polite"
          >
            {error}
          </p>
        )}

        <div className="space-y-4">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError(null);
              }}
              required
              placeholder="Email"
              className={`w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 font-inter focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500 ${
                error && error.includes("email") ? "animate-shake border-red-600" : ""
              }`}
              disabled={isLoading || !isFormActive}
              aria-label="Email address"
            />
          </div>
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(null);
              }}
              required
              placeholder="Password"
              className={`w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 font-inter focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500 ${
                error && error.includes("Password") ? "animate-shake border-red-600" : ""
              }`}
              disabled={isLoading || !isFormActive}
              aria-label="Password"
            />
          </div>
        </div>

        <button
          type="submit"
          className={`w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-teal-500 text-white rounded-lg font-semibold tracking-tight hover:bg-teal-600 hover:scale-105 transition-all duration-200 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 ${
            isLoading || !isFormActive ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={isLoading || !isFormActive}
          aria-label="Sign in"
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
              d="M11 16l-4-4m0 0l4-4m-4 4h14"
            />
          </svg>
          {isLoading ? "Signing in..." : "Sign In"}
        </button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-600 font-inter">
              Or continue with
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleOAuthLogin}
          className={`w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-teal-500 text-white rounded-lg font-semibold tracking-tight hover:bg-teal-600 hover:scale-105 transition-all duration-200 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={isLoading}
          aria-label="Sign in with Google"
        >
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z" />
          </svg>
          Google
        </button>

        <p className="text-center text-gray-600 font-inter">
          Don’t have an account?{" "}
          <button
            onClick={handleSignupRedirect}
            className="text-teal-500 font-semibold hover:text-teal-600 underline-offset-4 hover:underline transition-all"
            aria-label="Navigate to sign up"
            disabled={isLoading}
          >
            Sign Up
          </button>
        </p>
      </form>

      <style jsx global>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          50% { transform: translateX(4px); }
          75% { transform: translateX(-4px); }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default Login;
