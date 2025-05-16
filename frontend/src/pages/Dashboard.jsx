import React from "react";
import { useNavigate } from "react-router-dom";

// Dashboard component: main landing page after login
const Dashboard = () => {
  const navigate = useNavigate();

  // Card data for dashboard navigation
  const cards = [
    {
      title: " My Learning Plans",
      description: "View and manage your personal learning journeys.",
      route: "/learning-plans",
    },
    {
      title: " Explore Public Plans",
      description: "Discover and copy learning plans shared by others.",
      route: "/explore-plans",
    },
    {
      title: " Profile",
      description: "View or update your personal profile.",
      route: "/profile",
    },
    {
      title: " Account Settings",
      description: "Manage your account and preferences.",
      route: "/settings",
    },
  ];

  return (
    // Main background and dashboard layout
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6 text-cyan-100">
      <div className="max-w-6xl mx-auto text-center">
        {/* Dashboard title */}
        <h1 className="text-4xl font-bold mb-10">🚀 Welcome to Your Dashboard</h1>

        {/* Navigation cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cards.map((card, index) => (
            <div
              key={index}
              className="bg-purple-800/40 border border-cyan-300/20 rounded-2xl p-6 text-left shadow-xl hover:border-cyan-400 hover:shadow-2xl transform hover:scale-105 transition-all cursor-pointer"
              onClick={() => navigate(card.route)}
            >
              <h2 className="text-2xl font-semibold mb-2">{card.title}</h2>
              <p className="text-cyan-200">{card.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Custom animation for floating effect (not currently used) */}
      <style jsx="true">{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(5deg); }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;