import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const LearningPlans = () => {
  const [plans, setPlans] = useState([]);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchPlans = async () => {
      const res = await fetch(`http://localhost:8080/api/plans/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setPlans(data);
    };
    fetchPlans();
  }, [userId, token]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-16 h-16 border-4 border-opacity-10 border-cyan-300 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${10 + i * 2}s infinite linear`,
              transform: `scale(${0.5 + Math.random() * 1.5})`,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-cyan-100">My Learning Plans</h2>
          <button
            onClick={() => navigate("/create-plan")}
            className="bg-cyan-500 text-white px-4 py-2 rounded-xl shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1"
          >
            + Add New Plan
          </button>
        </div>

        <div className="space-y-4">
          {plans.map((plan) => (
            <div 
              key={plan.id}
              className="bg-purple-900/40 border border-cyan-300/20 rounded-xl p-4 backdrop-blur-sm hover:border-cyan-400/40 transition-all"
            >
              <h3 className="text-xl font-semibold text-cyan-100">{plan.title}</h3>
              <p className="text-cyan-200/90 mb-2">{plan.goal}</p>
              <p className="text-sm text-cyan-300/80 font-mono">
                From {plan.startDate} to {plan.endDate}
              </p>
              <div className="mt-2 flex gap-2">
                <button 
                  onClick={() => navigate(`/edit-plan/${plan.id}`)}
                  className="px-3 py-1 border border-yellow-500/50 text-yellow-400 rounded-lg hover:bg-yellow-900/20 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => navigate(`/plan-progress/${plan.id}`)}
                  className="px-3 py-1 border border-cyan-500/50 text-cyan-400 rounded-lg hover:bg-cyan-900/20 transition-colors"
                >
                  Progress
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(10deg); }
        }
      `}</style>
    </div>
  );
};

export default LearningPlans;