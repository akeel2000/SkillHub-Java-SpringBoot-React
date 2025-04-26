import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ExplorePlans = () => {
  const [plans, setPlans] = useState([]);
  const [searchTag, setSearchTag] = useState("");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // Fetch all public plans OR by tag
  const fetchPlans = async (tag = "") => {
    const url = tag
      ? `http://localhost:8080/api/plans/tag/${tag}`
      : `http://localhost:8080/api/plans/public`;

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setPlans(data);
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleSearch = () => {
    fetchPlans(searchTag.trim());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6 text-cyan-100">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">🌎 Explore Learning Plans</h2>

        {/* Search Bar */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <input
            type="text"
            placeholder="Search by tag or topic..."
            value={searchTag}
            onChange={(e) => setSearchTag(e.target.value)}
            className="w-2/3 p-3 rounded-xl bg-purple-800 border border-cyan-300/20 placeholder-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
          <button
            onClick={handleSearch}
            className="bg-cyan-500 text-white px-6 py-3 rounded-xl hover:scale-105 transform transition-all"
          >
            🔍 Search
          </button>
        </div>

        {/* Public Plans List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {plans.length === 0 ? (
            <p className="text-center col-span-2 text-cyan-300">
              No plans found. Try searching another tag.
            </p>
          ) : (
            plans.map((plan) => (
              <div
                key={plan.id}
                className="bg-purple-800/40 p-6 rounded-2xl border border-cyan-300/10 hover:border-cyan-400/30 shadow-xl hover:scale-105 transition-all"
              >
                <h3 className="text-xl font-bold mb-2">{plan.title}</h3>
                <p className="text-cyan-200 mb-2">{plan.goal}</p>
                <p className="text-sm text-cyan-400/70">Tags: {plan.tags.join(", ")}</p>
                <p className="text-sm text-cyan-300/70 mt-2">
                  Timeline: {new Date(plan.startDate).toLocaleDateString()} ➔ {new Date(plan.endDate).toLocaleDateString()}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ExplorePlans;

