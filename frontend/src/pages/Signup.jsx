import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(null);
  };

  const validateInputs = () => {
    if (!form.name.trim()) return "First name cannot be empty";
    if (!/^[a-zA-Z\s]+$/.test(form.name)) return "First name must contain only letters";
    if (!form.lastName.trim()) return "Last name cannot be empty";
    if (!/^[a-zA-Z\s]+$/.test(form.lastName)) return "Last name must contain only letters";
    if (!form.email.trim()) return "Email cannot be empty";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return "Invalid email format";
    if (!form.password) return "Password cannot be empty";
    if (form.password.length < 8) return "Password must be at least 8 characters";
    if (!/[a-zA-Z]/.test(form.password) || !/[0-9]/.test(form.password))
      return "Password must include letters and numbers";
    return null;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);
    const validationError = validateInputs();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.text();
      if (res.ok) {
        setShowSuccess(true);
      } else {
        setError(
          res.status === 400 ? data || "Email already registered" : "Registration failed"
        );
      }
    } catch {
      setError("An error occurred during registration");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    if (isLoading) return;
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {/* Success Modal */}
      {showSuccess && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          role="dialog"
          aria-modal="true"
          aria-label="Registration successful"
          aria-describedby="modal-success"
        >
          <div className="max-w-md w-full bg-gray-50 rounded-xl shadow-md p-8 text-center space-y-4">
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
                d="M5 13l4 4L19 7"
              />
            </svg>
            <h2
              id="modal-success"
              className="text-xl font-bold text-gray-900 font-inter"
            >
              Registration Successful!
            </h2>
            <button
              onClick={() => navigate("/login", { state: { email: form.email } })}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-teal-500 text-white rounded-lg font-semibold tracking-tight hover:bg-teal-600 hover:scale-105 transition-all duration-200 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
              aria-label="Continue to login"
              disabled={isLoading}
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
              Continue to Login
            </button>
          </div>
        </div>
      )}

      {/* Signup Form */}
      <form
        onSubmit={handleSignup}
        className="max-w-md w-full bg-white rounded-xl shadow-sm p-8 space-y-6"
        aria-label="Sign up form"
        aria-describedby="form-error"
      >
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight font-inter text-center">
          Join SkillHub
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

        <div className="grid grid-cols-2 gap-4">
          <div>
            <input
              type="text"
              name="name"
              placeholder="First Name"
              value={form.name}
              onChange={handleChange}
              required
              className={`w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 font-inter focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500 ${
                error && error.includes("First name") ? "animate-shake border-red-600" : ""
              }`}
              disabled={isLoading}
              aria-label="First name"
            />
          </div>
          <div>
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={form.lastName}
              onChange={handleChange}
              required
              className={`w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 font-inter focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500 ${
                error && error.includes("Last name") ? "animate-shake border-red-600" : ""
              }`}
              disabled={isLoading}
              aria-label="Last name"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              className={`w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 font-inter focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500 ${
                error && error.includes("email") ? "animate-shake border-red-600" : ""
              }`}
              disabled={isLoading}
              aria-label="Email address"
            />
          </div>
          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className={`w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 font-inter focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500 ${
                error && error.includes("Password") ? "animate-shake border-red-600" : ""
              }`}
              disabled={isLoading}
              aria-label="Password"
            />
          </div>
        </div>

        <button
          type="submit"
          className={`w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-teal-500 text-white rounded-lg font-semibold tracking-tight hover:bg-teal-600 hover:scale-105 transition-all duration-200 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={isLoading}
          aria-label="Create account"
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
              d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
            />
          </svg>
          {isLoading ? "Creating account..." : "Create Account"}
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
          onClick={handleGoogleSignup}
          className={`w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-teal-500 text-white rounded-lg font-semibold tracking-tight hover:bg-teal-600 hover:scale-105 transition-all duration-200 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={isLoading}
          aria-label="Sign up with Google"
        >
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z" />
          </svg>
          Google
        </button>

        <p className="text-center text-gray-600 font-inter">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-teal-500 font-semibold hover:text-teal-600 underline-offset-4 hover:underline transition-all"
            aria-label="Navigate to login"
            disabled={isLoading}
          >
            Log In
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

export default Signup;
