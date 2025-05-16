import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ExplorePlans = () => {
  const [plans, setPlans] = useState([]);
  const [searchTag, setSearchTag] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchPlans();
  }, [token, navigate]);

  const validateSearchTag = (tag) => {
    if (!tag.trim()) return "Search tag cannot be empty";
    if (tag.length > 50) return "Search tag cannot exceed 50 characters";
    if (!/^[A-Za-z0-9\s]+$/.test(tag)) return "Search tag must be alphanumeric or spaces";
    return null;
  };

  const fetchPlans = async (tag = "") => {
    setIsLoading(true);
    setError(null);

    const url = tag
      ? `http://localhost:8080/api/plans/tag/${encodeURIComponent(tag)}`
      : `http://localhost:8080/api/plans/public`;

    try {
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to fetch plans");
      }
      const data = await res.json();
      setPlans(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Failed to fetch plans");
      setPlans([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    const validationError = validateSearchTag(searchTag);
    if (validationError) {
      setError(validationError);
      return;
    }
    fetchPlans(searchTag.trim());
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  const handleLogout = async () => {
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
    localStorage.removeItem("userEmail");
    navigate("/login");
  };

  const handleCardClick = (planId) => {
    navigate(`/plans/${planId}`);
  };

  const handleCardKeyDown = (e, planId) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleCardClick(planId);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 text-center">
            Explore Learning Plans
          </h2>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 hover:scale-105 transition-all"
            aria-label="Log out"
          >
            Logout
          </button>
        </div>

        {/* Back Button */}
        <button
          onClick={() => navigate("/dashboard")}
          className="mb-4 px-4 py-2 bg-teal-400 text-white rounded-md hover:bg-teal-500 hover:scale-105 transition-all flex items-center gap-2"
          aria-label="Go back to dashboard"
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

        {/* Search Bar */}
        <div className="flex items-center gap-4 mb-8">
          <input
            type="text"
            placeholder="Search by tag or topic..."
            value={searchTag}
            onChange={(e) => {
              setSearchTag(e.target.value);
              setError(null);
            }}
            onKeyDown={handleSearchKeyDown}
            className={`flex-1 px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-teal-400 ${
              error ? "animate-shake border-red-500" : ""
            }`}
            disabled={isLoading}
            aria-label="Search plans by tag or topic"
          />
          <button
            onClick={handleSearch}
            className={`px-6 py-2 bg-teal-400 text-white rounded-md hover:bg-teal-500 hover:scale-105 transition-all ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isLoading}
            aria-label="Search plans"
          >
            {isLoading ? "Searching..." : "Search"}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <p className="text-xs text-red-500 mb-4 text-center" role="alert" aria-live="polite">
            {error}
          </p>
        )}

        {/* Public Plans List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {isLoading ? (
            <p className="text-center col-span-2 text-gray-700">Loading plans...</p>
          ) : plans.length === 0 ? (
            <p className="text-center col-span-2 text-gray-700">
              No plans found. Try searching another tag.
            </p>
          ) : (
            plans.map((plan) => (
              <div
                key={plan.id}
                className="bg-white border border-gray-200 rounded-lg p-4 shadow-md hover:border-teal-400 hover:shadow-lg hover:scale-105 transition-all cursor-pointer focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400"
                onClick={() => handleCardClick(plan.id)}
                onKeyDown={(e) => handleCardKeyDown(e, plan.id)}
                role="button"
                tabIndex={0}
                aria-label={`View details for ${plan.title}`}
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{plan.title}</h3>
                <p className="text-gray-700 mb-2">{plan.goal}</p>
                <p className="text-sm text-teal-600">Tags: {plan.tags.join(", ")}</p>
                <p className="text-sm text-gray-600 mt-2">
                  Timeline:{" "}
                  {new Date(plan.startDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}{" "}
                  →{" "}
                  {new Date(plan.endDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            ))
          )}
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

export default ExplorePlans;
