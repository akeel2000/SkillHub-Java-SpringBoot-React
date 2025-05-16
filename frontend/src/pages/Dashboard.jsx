import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const email = localStorage.getItem("userEmail");
  const token = localStorage.getItem("token");

  const cards = [
    {
      title: "My Learning Plans",
      description: "View and manage your personal learning journeys.",
      route: "/learning-plans",
    },
    {
      title: "Explore Public Plans",
      description: "Discover and copy learning plans shared by others.",
      route: "/explore-plans",
    },
    {
      title: "Profile",
      description: "View or update your personal profile.",
      route: "/profile",
    },
    {
      title: "Account Settings",
      description: "Manage your account and preferences.",
      route: "/settings",
    },
  ];

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

  useEffect(() => {
    if (!email || !token) {
      navigate("/login");
    }
  }, [email, token, navigate]);

  const handleCardKeyDown = (e, route) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      navigate(route);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-semibold text-gray-900 text-center">
            Welcome to Your Dashboard
          </h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 hover:scale-105 transition-all"
            aria-label="Log out"
          >
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cards.map((card, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-lg p-4 shadow-md hover:border-teal-400 hover:shadow-lg hover:scale-105 transition-all cursor-pointer focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400"
              onClick={() => navigate(card.route)}
              onKeyDown={(e) => handleCardKeyDown(e, card.route)}
              role="button"
              tabIndex={0}
              aria-label={`Navigate to ${card.title}`}
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-2">{card.title}</h2>
              <p className="text-gray-700">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
