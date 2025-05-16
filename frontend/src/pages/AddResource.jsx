import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const AddResource = () => {
  const { id } = useParams();
  const [resource, setResource] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  const validateResource = () => {
    if (!resource.trim()) return "Resource URL cannot be empty";
    if (resource.length > 500) return "Resource URL cannot exceed 500 characters";
    const urlRegex = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/i;
    if (!urlRegex.test(resource)) return "Please enter a valid URL";
    return null;
  };

  const handleAddResource = async () => {
    setError(null);
    setSuccess(null);

    const validationError = validateResource();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`http://localhost:8080/api/plans/${id}/add-resource`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ resource: resource.trim() }),
      });
      if (!res.ok) throw new Error(await res.text() || "Failed to add resource");
      setSuccess("Resource added successfully!");
      setTimeout(() => navigate(`/plan-progress/${id}`), 1000);
    } catch (err) {
      setError(err.message || "Error adding resource");
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
            Add Resource
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

          {/* Form */}
          <div className="bg-white rounded-xl p-6 shadow-sm max-w-xl mx-auto">
            <div className="space-y-6">
              <input
                type="text"
                placeholder="Enter Resource URL"
                value={resource}
                onChange={(e) => {
                  setResource(e.target.value);
                  setError(null);
                }}
                className={`w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 font-inter focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500 ${
                  error ? "animate-shake border-red-600" : ""
                }`}
                disabled={isLoading}
                aria-label="Resource URL"
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
                onClick={handleAddResource}
                className={`w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-teal-500 text-white rounded-lg font-semibold tracking-tight hover:bg-teal-600 hover:scale-105 transition-all duration-200 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={isLoading}
                aria-label="Add resource"
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
                {isLoading ? "Adding..." : "Add Resource"}
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

export default AddResource;
