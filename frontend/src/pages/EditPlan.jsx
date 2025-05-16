import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EditPlan = () => {
  const { id } = useParams();
  const [plan, setPlan] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchPlan();
  }, [id, token, navigate]);

  const fetchPlan = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`http://localhost:8080/api/plans/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(await res.text() || "Failed to load plan");
      const data = await res.json();
      if (!data || !data.title || !data.goal) throw new Error("Invalid plan data");
      setPlan(data);
    } catch (err) {
      setError(err.message || "Error loading plan");
    } finally {
      setIsLoading(false);
    }
  };

  const validateInputs = () => {
    if (!plan.title.trim()) return "Title cannot be empty";
    if (plan.title.length > 100) return "Title cannot exceed 100 characters";
    if (!/^[A-Za-z0-9\s]+$/.test(plan.title)) return "Title must be alphanumeric or spaces";

    if (!plan.goal.trim()) return "Goal cannot be empty";
    if (plan.goal.length > 500) return "Goal cannot exceed 500 characters";
    if (!/^[A-Za-z0-9\s.,!?']+$/.test(plan.goal)) return "Goal contains invalid characters";

    return null;
  };

  const handleUpdate = async () => {
    setError(null);
    setSuccess(null);

    const validationError = validateInputs();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`http://localhost:8080/api/plans/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...plan,
          title: plan.title.trim(),
          goal: plan.goal.trim(),
        }),
      });
      if (!res.ok) throw new Error(await res.text() || "Failed to update plan");
      setSuccess("Plan updated successfully!");
      setTimeout(() => navigate("/learning-plans"), 1000);
    } catch (err) {
      setError(err.message || "Error updating plan");
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

  if (!plan || isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-4xl mx-auto bg-gray-50 rounded-xl shadow-sm p-6">
          <p className="text-center text-teal-500 animate-pulse" aria-live="polite">
            Loading plan...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-gray-50 rounded-xl shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight font-inter">
            Edit Plan
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
                placeholder="Plan Title"
                value={plan.title}
                onChange={(e) => {
                  setPlan({ ...plan, title: e.target.value });
                  setError(null);
                }}
                className={`w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 font-inter focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500 ${
                  error && error.includes("Title") ? "animate-shake border-red-600" : ""
                }`}
                disabled={isLoading}
                aria-label="Plan title"
              />

              <textarea
                placeholder="Learning Goal"
                value={plan.goal}
                onChange={(e) => {
                  setPlan({ ...plan, goal: e.target.value });
                  setError(null);
                }}
                rows={4}
                className={`w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 font-inter focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500 ${
                  error && error.includes("Goal") ? "animate-shake border-red-600" : ""
                }`}
                disabled={isLoading}
                aria-label="Learning goal"
              />

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
                onClick={handleUpdate}
                className={`w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-teal-500 text-white rounded-lg font-semibold tracking-tight hover:bg-teal-600 hover:scale-105 transition-all duration-200 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={isLoading}
                aria-label="Update plan"
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
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                {isLoading ? "Updating..." : "Update Plan"}
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

export default EditPlan;
