import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const CreatePlan = () => {
  const [title, setTitle] = useState("");
  const [goal, setGoal] = useState("");
  const [tags, setTags] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!token || !userId) {
      navigate("/login");
    }
  }, [token, userId, navigate]);

  const validateInputs = () => {
    if (!title.trim()) return "Title cannot be empty";
    if (title.length > 100) return "Title cannot exceed 100 characters";
    if (!/^[A-Za-z0-9\s]+$/.test(title)) return "Title must be alphanumeric or spaces";

    if (!goal.trim()) return "Goal cannot be empty";
    if (goal.length > 500) return "Goal cannot exceed 500 characters";
    if (!/^[A-Za-z0-9\s.,!?']+$/.test(goal)) return "Goal contains invalid characters";

    if (tags.trim()) {
      const tagArray = tags.split(",").map(t => t.trim()).filter(t => t);
      if (tagArray.some(t => t.length > 50)) return "Each tag cannot exceed 50 characters";
      if (tagArray.some(t => !/^[A-Za-z0-9\s]+$/.test(t))) return "Tags must be alphanumeric or spaces";
    }

    if (!startDate) return "Start date cannot be empty";
    const today = new Date().toISOString().split("T")[0];
    if (startDate < today) return "Start date cannot be in the past";

    if (!endDate) return "End date cannot be empty";
    if (endDate < startDate) return "End date must be after start date";

    return null;
  };

  const handleCreate = async () => {
    setError(null);
    setSuccess(null);

    const validationError = validateInputs();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    const body = {
      userId,
      title: title.trim(),
      goal: goal.trim(),
      tags: tags.split(",").map(t => t.trim()).filter(t => t),
      startDate,
      endDate,
      isPublic,
      resources: [],
      milestones: [],
    };

    try {
      const res = await fetch("http://localhost:8080/api/plans", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(await res.text() || "Failed to create plan");
      setSuccess("Plan created successfully!");
      setTimeout(() => navigate("/learning-plans"), 1000);
    } catch (err) {
      setError(err.message || "Error creating plan");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:8080/api/auth/logout", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Logout failed");
    } catch (error) {
      console.warn("Logout API failed, proceeding with local logout");
    }
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-gray-50 rounded-xl shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight font-inter">
            Create New Plan
          </h2>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg font-semibold tracking-tight hover:bg-red-600 hover:scale-105 transition-all duration-200 focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            aria-label="Log out"
            disabled={isLoading}
          >
            Logout
          </button>
        </div>

        <div className="px-6 py-6">
          {/* Back Button */}
          <button
            onClick={() => navigate("/learning-plans")}
            className="inline-flex items-center gap-2 px-4 py-2 bg-teal-500 text-white rounded-lg font-semibold tracking-tight hover:bg-teal-600 hover:scale-105 transition-all duration-200 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 mb-6"
            aria-label="Go back to learning plans"
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back
          </button>

          {/* Form */}
          <div className="bg-white rounded-xl p-6 shadow-sm max-w-xl mx-auto">
            <div className="space-y-6">
              <input
                placeholder="Title"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  setError(null);
                }}
                className={`w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 font-inter focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500 ${
                  error && error.includes("Title") ? "animate-shake border-red-600" : ""
                }`}
                disabled={isLoading}
                aria-label="Plan title"
              />

              <textarea
                placeholder="Goal"
                value={goal}
                onChange={(e) => {
                  setGoal(e.target.value);
                  setError(null);
                }}
                rows={4}
                className={`w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 font-inter focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500 ${
                  error && error.includes("Goal") ? "animate-shake border-red-600" : ""
                }`}
                disabled={isLoading}
                aria-label="Plan goal"
              />

              <input
                placeholder="Tags (comma-separated)"
                value={tags}
                onChange={(e) => {
                  setTags(e.target.value);
                  setError(null);
                }}
                className={`w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 font-inter focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500 ${
                  error && error.includes("Tags") ? "animate-shake border-red-600" : ""
                }`}
                disabled={isLoading}
                aria-label="Plan tags"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    setError(null);
                  }}
                  className={`w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg text-gray-900 font-inter focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500 ${
                    error && error.includes("Start date") ? "animate-shake border-red-600" : ""
                  }`}
                  disabled={isLoading}
                  aria-label="Start date"
                />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                    setError(null);
                  }}
                  className={`w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg text-gray-900 font-inter focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500 ${
                    error && error.includes("End date") ? "animate-shake border-red-600" : ""
                  }`}
                  disabled={isLoading}
                  aria-label="End date"
                />
              </div>

              <label className="flex items-center space-x-3 text-gray-700 font-inter">
                <input
                  type="checkbox"
                  checked={isPublic}
                  onChange={() => setIsPublic(!isPublic)}
                  className="w-5 h-5 bg-gray-100 border-gray-200 rounded-md focus:ring-2 focus:ring-teal-500"
                  disabled={isLoading}
                  aria-label="Make plan public"
                />
                <span>Public</span>
              </label>

              {/* Error/Success Messages */}
              {error && (
                <p
                  className="text-sm text-red-600 bg-red-50 p-3 rounded-md text-center"
                  role="alert"
                  aria-live="polite"
                >
                  {error}
                </p>
              )}
              {success && (
                <p
                  className="text-sm text-teal-500 bg-teal-50 p-3 rounded-md text-center"
                  role="status"
                  aria-live="polite"
                >
                  {success}
                </p>
              )}

              <button
                onClick={handleCreate}
                className={`w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-teal-500 text-white rounded-lg font-semibold tracking-tight hover:bg-teal-600 hover:scale-105 transition-all duration-200 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={isLoading}
                aria-label="Create plan"
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
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                {isLoading ? "Creating..." : "Create Plan"}
              </button>
            </div>
          </div>
        </div>
      </div>

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

export default CreatePlan;
