import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ManageMilestones = () => {
  const { id } = useParams();
  const [milestones, setMilestones] = useState([]);
  const [description, setDescription] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchMilestones();
  }, [id, token, navigate]);

  const fetchMilestones = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`http://localhost:8080/api/plans/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(await res.text() || "Failed to load milestones");
      const data = await res.json();
      setMilestones(Array.isArray(data.milestones) ? data.milestones : []);
    } catch (err) {
      setError(err.message || "Error loading milestones");
    } finally {
      setIsLoading(false);
    }
  };

  const validateInputs = () => {
    if (!description.trim()) return "Milestone description cannot be empty";
    if (description.length > 200) return "Description cannot exceed 200 characters";
    if (!/^[A-Za-z0-9\s.,!?']+$/.test(description)) return "Description contains invalid characters";

    if (!targetDate) return "Target date cannot be empty";
    const today = new Date().toISOString().split("T")[0];
    if (targetDate < today) return "Target date cannot be in the past";

    return null;
  };

  const addMilestone = () => {
    setError(null);
    const validationError = validateInputs();
    if (validationError) {
      setError(validationError);
      return;
    }

    setMilestones([
      ...milestones,
      { description: description.trim(), targetDate, completed: false },
    ]);
    setDescription("");
    setTargetDate("");
    setSuccess("Milestone added locally! Click Save All to confirm.");
  };

  const saveMilestones = async () => {
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      const res = await fetch(`http://localhost:8080/api/plans/${id}/update-milestones`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(milestones),
      });
      if (!res.ok) throw new Error(await res.text() || "Failed to save milestones");
      setSuccess("Milestones saved successfully!");
      setTimeout(() => navigate(`/plan-progress/${id}`), 1000);
    } catch (err) {
      setError(err.message || "Error saving milestones");
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
            Manage Milestones
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
            onClick={() => navigate(`/plan-progress/${id}`)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-teal-500 text-white rounded-lg font-semibold tracking-tight hover:bg-teal-600 hover:scale-105 transition-all duration-200 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 mb-6"
            aria-label="Go back to plan progress"
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

          {/* Loading State */}
          {isLoading && !milestones.length && (
            <p
              className="text-center text-teal-500 animate-pulse"
              aria-live="polite"
            >
              Loading milestones...
            </p>
          )}

          {/* Error Message */}
          {error && (
            <p
              className="text-sm text-red-600 bg-red-50 p-3 rounded-md text-center mb-6"
              role="alert"
              aria-live="polite"
            >
              {error}
            </p>
          )}

          {/* Success Message */}
          {success && (
            <p
              className="text-sm text-teal-500 bg-teal-50 p-3 rounded-md text-center mb-6"
              role="status"
              aria-live="polite"
            >
              {success}
            </p>
          )}

          {/* Milestone List */}
          {milestones.length > 0 ? (
            <div className="space-y-6 mb-8">
              {milestones.map((m, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:bg-teal-50 hover:shadow-md hover:ring-2 hover:ring-teal-200 transition-all duration-200"
                  role="region"
                  aria-label={`Milestone ${idx + 1}`}
                >
                  <p className="text-gray-800 font-medium font-inter">
                    <span className="font-semibold">Description:</span> {m.description}
                  </p>
                  <p className="text-teal-500 font-medium font-inter mt-2">
                    <span className="font-semibold">Target Date:</span>{" "}
                    {new Date(m.targetDate).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            !isLoading && (
              <p className="text-center text-gray-600 mb-8 font-inter">
                No milestones yet. Add one below!
              </p>
            )
          )}

          {/* Form */}
          <div className="bg-white rounded-xl p-6 shadow-sm max-w-xl mx-auto">
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Milestone Description"
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    setError(null);
                  }}
                  className={`w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 font-inter focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500 ${
                    error && error.includes("Description") ? "animate-shake border-red-600" : ""
                  }`}
                  disabled={isLoading}
                  aria-label="Milestone description"
                />
                <input
                  type="date"
                  value={targetDate}
                  onChange={(e) => {
                    setTargetDate(e.target.value);
                    setError(null);
                  }}
                  className={`w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg text-gray-900 font-inter focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500 ${
                    error && error.includes("Target date") ? "animate-shake border-red-600" : ""
                  }`}
                  disabled={isLoading}
                  aria-label="Target date"
                />
              </div>

              <button
                onClick={addMilestone}
                className={`w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-teal-500 text-white rounded-lg font-semibold tracking-tight hover:bg-teal-600 hover:scale-105 transition-all duration-200 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={isLoading}
                aria-label="Add milestone"
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
                Add Milestone
              </button>

              <button
                onClick={saveMilestones}
                className={`w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-teal-500 text-white rounded-lg font-semibold tracking-tight hover:bg-teal-600 hover:scale-105 transition-all duration-200 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={isLoading}
                aria-label="Save all milestones"
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
                {isLoading ? "Saving..." : "Save All"}
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

export default ManageMilestones;
