import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const PlanProgress = () => {
  const { id } = useParams();
  const [milestones, setMilestones] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchPlan = async () => {
      const res = await fetch(`http://localhost:8080/api/plans/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setMilestones(data.milestones || []);
    };
    fetchPlan();
  }, [id, token]);

  const chartData = milestones.map((m, i) => ({
    name: `M${i + 1}`,
    Completed: m.completed ? 100 : 0,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden p-6">
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
      <div className="relative z-10 bg-gradient-to-br from-purple-800/50 to-blue-800/50 backdrop-blur-xl border border-cyan-300/20 rounded-2xl shadow-2xl max-w-4xl mx-auto p-8 animate-fadeInUp">
        <h2 className="text-2xl font-bold mb-6 text-cyan-100">Progress</h2>
        
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis 
                dataKey="name" 
                stroke="#7dd3fc"
                tick={{ fill: '#7dd3fc80' }}
              />
              <YAxis 
                stroke="#7dd3fc"
                tick={{ fill: '#7dd3fc80' }}
                domain={[0, 100]}
              />
              <Tooltip
                contentStyle={{
                  background: '#1e1b4b',
                  border: '2px solid #67e8f9',
                  borderRadius: '8px',
                }}
              />
              <Line 
                type="monotone" 
                dataKey="Completed" 
                stroke="#00FFFF"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(10deg); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default PlanProgress;
