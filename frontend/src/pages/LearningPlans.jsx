import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const LearningPlans = () => {
  const [plans, setPlans] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(null);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!userId || !token) {
      navigate("/login");
      return;
    }
    fetchPlans();
  }, [userId, token, navigate]);

  const fetchPlans = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`http://localhost:8080/api/plans/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Failed to load plans (Status: ${res.status})`);
      }
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await res.json();
        setPlans(Array.isArray(data) ? data : []);
      } else {
        const text = await res.text();
        console.warn("Non-JSON response received:", text);
        setPlans([]);
      }
    } catch (err) {
      setError(err.message || "Error loading plans");
      console.error("Fetch plans error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (planId) => {
    setError(null);
    setSuccess(null);
    setIsLoading(true);
    try {
      const res = await fetch(`http://localhost:8080/api/plans/${planId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(await res.text() || "Failed to delete plan");
      setPlans(plans.filter((plan) => plan.id !== planId));
      setSuccess("Plan deleted successfully!");
      setShowDeleteDialog(null);
    } catch (err) {
      setError(err.message || "Error deleting plan");
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
      <div className="max-w-5xl mx-auto bg-gray-50 rounded-xl shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight font-inter">
            My Learning Plans
          </h2>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/create-plan")}
              className="inline-flex items-center gap-2 px-4 py-2 bg-teal-500 text-white rounded-lg font-semibold tracking-tight hover:bg-teal-600 hover:scale-105 transition-all duration-200 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
              aria-label="Create new learning plan"
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
              Create New Plan
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-lg font-semibold tracking-tight hover:bg-red-600 hover:scale-105 transition-all duration-200 focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              aria-label="Log out"
              disabled={isLoading}
            >
              Logout
            </button>
          </div>
        </div>

        <div className="px-6 py-6">
          {/* Loading State */}
          {isLoading && !plans.length && (
            <p
              className="text-center text-teal-500 animate-pulse"
              aria-live="polite"
            >
              Loading plans...
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

          {/* Plan List */}
          <div className="space-y-6">
            {plans.length === 0 && !isLoading ? (
              <p className="text-center text-gray-600 mt-10 font-inter">
                No plans created yet. Click "Create New Plan" to get started!
              </p>
            ) : (
              plans.map((plan) => (
                <div
                  key={plan.id}
                  className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:bg-teal-50 hover:shadow-md hover:ring-2 hover:ring-teal-200 transition-all duration-200"
                  role="region"
                  aria-label={`Learning plan: ${plan.title}`}
                >
                  <h3 className="text-2xl font-bold text-gray-900 font-inter">
                    {plan.title}
                  </h3>
                  <p className="text-gray-700 font-inter mb-2">{plan.goal}</p>
                  <p className="text-sm text-teal-500 font-medium font-inter">
                    {new Date(plan.startDate).toLocaleDateString()} →{" "}
                    {new Date(plan.endDate).toLocaleDateString()}
                  </p>

                  {/* Action Buttons */}
                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                    <button
                      onClick={() => navigate(`/edit-plan/${plan.id}`)}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-teal-500 text-white rounded-lg font-semibold tracking-tight hover:bg-teal-600 hover:scale-105 transition-all duration-200 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                      aria-label={`Edit plan: ${plan.title}`}
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
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                      Edit
                    </button>
                    <button
                      onClick={() => navigate(`/plan-progress/${plan.id}`)}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-teal-500 text-white rounded-lg font-semibold tracking-tight hover:bg-teal-600 hover:scale-105 transition-all duration-200 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                      aria-label={`View progress for plan: ${plan.title}`}
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
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        />
                      </svg>
                      Progress
                    </button>
                    <button
                      onClick={() => navigate(`/manage-milestones/${plan.id}`)}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-teal-500 text-white rounded-lg font-semibold tracking-tight hover:bg-teal-600 hover:scale-105 transition-all duration-200 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                      aria-label={`Manage milestones for plan: ${plan.title}`}
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
                          d="M9 12l2 2 4-4M7.835 4.697a3.5 3.5 0 105.33 4.606 3.5 3.5 0 10-5.33-4.606z"
                        />
                      </svg>
                      Milestones
                    </button>
                    <button
                      onClick={() => navigate(`/add-resource/${plan.id}`)}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-teal-500 text-white rounded-lg font-semibold tracking-tight hover:bg-teal-600 hover:scale-105 transition-all duration-200 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                      aria-label={`Add resources for plan: ${plan.title}`}
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
                          d="M7 7h.01M7 3h5a1.99 1.99 0 011.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                        />
                      </svg>
                      Resources
                    </button>
                    <button
                      onClick={() => setShowDeleteDialog(plan.id)}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-teal-500 text-white rounded-lg font-semibold tracking-tight hover:bg-teal-600 hover:scale-105 transition-all duration-200 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                      aria-label={`Delete plan: ${plan.title}`}
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
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4a2 2 0 012 2v1H8V5a2 2 0 012-2zm-3 5h6"
                        />
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-50 rounded-xl shadow-md p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold text-gray-900 font-inter mb-4">
              Confirm Delete
            </h3>
            <p className="text-gray-700 font-inter mb-6">
              Are you sure you want to delete this plan? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDeleteDialog(null)}
                className="px-4 py-2 bg-gray-300 text-gray-900 rounded-lg font-semibold tracking-tight hover:bg-gray-400 transition-all duration-200 focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
                aria-label="Cancel delete"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(showDeleteDialog)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg font-semibold tracking-tight hover:bg-red-600 transition-all duration-200 focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                aria-label="Confirm delete"
                disabled={isLoading}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LearningPlans;
