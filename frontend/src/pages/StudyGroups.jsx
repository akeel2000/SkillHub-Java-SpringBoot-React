import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const StudyGroups = () => {
  const [groups, setGroups] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchAllGroups();
  }, [token, navigate]);

  const fetchAllGroups = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`http://localhost:8080/api/groups`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(await res.text() || "Failed to load groups");
      const allGroups = await res.json();
      setGroups(Array.isArray(allGroups) ? allGroups : []);
    } catch (error) {
      setError(error.message || "Failed to load groups");
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

  const handleCardKeyDown = (e, groupId) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      navigate(`/group/${groupId}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-gray-50 rounded-xl shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight font-inter">
            Study Groups
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

        {/* Back Button */}
        <div className="px-6 pt-6">
          <button
            onClick={() => navigate("/dashboard")}
            className="inline-flex items-center gap-2 px-4 py-2 bg-teal-500 text-white rounded-lg font-semibold tracking-tight hover:bg-teal-600 hover:scale-105 transition-all duration-200 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
            aria-label="Go back to dashboard"
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
        </div>

        {/* Create Group Button */}
        <div className="px-6 py-4 flex justify-end">
          <button
            onClick={() => navigate("/create-group")}
            className="inline-flex items-center gap-2 px-4 py-2 bg-teal-500 text-white rounded-lg font-semibold tracking-tight hover:bg-teal-600 hover:scale-105 transition-all duration-200 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
            aria-label="Create a new group"
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
                d="M12 4v16m8-8H4"
              />
            </svg>
            Create Group
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="px-6 pb-4">
            <p
              className="text-sm text-red-600 bg-red-50 p-3 rounded-md text-center"
              role="alert"
              aria-live="polite"
            >
              {error}
            </p>
          </div>
        )}

        {/* Groups List */}
        <div className="px-6 pb-6">
          {isLoading ? (
            <p className="text-center text-teal-500 mt-8 animate-pulse">Loading groups...</p>
          ) : groups.length === 0 ? (
            <p className="text-center text-gray-600 mt-8">
              No groups available yet.{" "}
              <button
                onClick={() => navigate("/create-group")}
                className="text-teal-500 hover:underline font-medium"
                aria-label="Create a new group"
              >
                Create one now!
              </button>
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {groups.map((group) => (
                <div
                  key={group.id}
                  className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:bg-teal-50 hover:shadow-md hover:ring-2 hover:ring-teal-200 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                  onClick={() => navigate(`/group/${group.id}`)}
                  onKeyDown={(e) => handleCardKeyDown(e, group.id)}
                  role="button"
                  tabIndex={0}
                  aria-label={`View details for ${group.name}`}
                >
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 font-inter">
                    {group.name}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3 font-inter">
                    {group.description || "No description available."}
                  </p>
                  <p className="text-sm text-teal-500 font-medium font-inter">
                    Members: {group.memberIds ? group.memberIds.length : 0}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudyGroups;
