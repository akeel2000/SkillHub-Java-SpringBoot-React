import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const PlanProgress = () => {
  const { id } = useParams();
  const [milestones, setMilestones] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

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
      setMilestones(Array.isArray(data.milestones) ? data.milestones : []);
    } catch (err) {
      setError(err.message || "Error loading plan progress");
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

  const chartData = milestones.map((m, i) => ({
    name: `M${i + 1}`,
    Completed: m.completed ? 100 : 0,
    description: m.description,
  }));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-4xl mx-auto bg-gray-50 rounded-xl shadow-sm p-6">
          <p className="text-center text-teal-500 animate-pulse" aria-live="polite">
            Loading progress...
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
            Plan Progress
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

          {/* Empty State */}
          {milestones.length === 0 && !error && (
            <p className="text-center text-gray-600 mb-8 font-inter">
              No milestones available. Add milestones to track progress.
            </p>
          )}

          {/* Chart */}
          {milestones.length > 0 && (
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="h-[300px] bg-gray-50 rounded-lg" role="region" aria-label="Progress chart" aria-describedby="chart-desc">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
                    <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      stroke="#4b5563"
                      tick={{ fill: "#6b7280", fontFamily: "Inter, sans-serif" }}
                    />
                    <YAxis
                      stroke="#4b5563"
                      tick={{ fill: "#6b7280", fontFamily: "Inter, sans-serif" }}
                      domain={[0, 100]}
                      unit="%"
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1f2937",
                        border: "1px solid #4b5563",
                        borderRadius: "8px",
                        color: "#f3f4f6",
                        fontFamily: "Inter, sans-serif",
                      }}
                      formatter={(value, name, props) => [
                        `${props.payload.description}: ${value === 100 ? "Completed" : "Not Completed"}`,
                        "Status",
                      ]}
                    />
                    <Line
                      type="monotone"
                      dataKey="Completed"
                      stroke="#14b8a6"
                      strokeWidth={2}
                      dot={{ r: 4, fill: "#14b8a6" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <p id="chart-desc" className="sr-only">
                Line chart showing the completion status of milestones for the plan. Each milestone is represented on the X-axis, and the Y-axis shows completion percentage (0% for not completed, 100% for completed).
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlanProgress;
