import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Component for creating a new learning plan
const CreatePlan = () => {
  const [title, setTitle] = useState("");
  const [goal, setGoal] = useState("");
  const [tags, setTags] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const navigate = useNavigate();

  // Function to handle plan creation
  const handleCreate = async () => {
    // Retrieve token and userId from localStorage for authentication
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    // Prepare request body
    const body = {
      userId,
      title,
      goal,
      tags: tags.split(",").map(t => t.trim()), // Convert comma-separated tags to array
      startDate,
      endDate,
      isPublic,
      resources: [],
      milestones: []
    };

    // Send POST request to backend API to create the plan
    const res = await fetch("http://localhost:8080/api/plans", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    // Navigate to learning plans page if successful, else show error
    if (res.ok) {
      navigate("/learning-plans");
    } else {
      alert("Failed to create plan");
    }
  };

  return (
    // Main background container with gradient and floating circles
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden p-6">
      {/* Floating Background Elements for visual effect */}
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

      {/* Main Content Card */}
      <div className="relative z-10 bg-gradient-to-br from-purple-800/50 to-blue-800/50 backdrop-blur-xl border border-cyan-300/20 rounded-2xl shadow-2xl max-w-2xl mx-auto p-8 animate-fadeInUp">
        {/* Page Title */}
        <h2 className="text-3xl font-bold mb-8 text-center text-cyan-100">
          Create New Plan
        </h2>

        {/* Form Fields */}
        <div className="space-y-6">
          {/* Title Input */}
          <div className="relative group">
            <input
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 bg-purple-900/30 border-2 border-cyan-300/20 rounded-xl text-cyan-100 placeholder-cyan-200/50 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all"
            />
          </div>

          {/* Goal Textarea */}
          <div className="relative group">
            <textarea
              placeholder="Goal"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="w-full px-4 py-3 bg-purple-900/30 border-2 border-cyan-300/20 rounded-xl text-cyan-100 placeholder-cyan-200/50 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all"
              rows={4}
            />
          </div>

          {/* Tags Input */}
          <div className="relative group">
            <input
              placeholder="Tags (comma-separated)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full px-4 py-3 bg-purple-900/30 border-2 border-cyan-300/20 rounded-xl text-cyan-100 placeholder-cyan-200/50 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all"
            />
          </div>

          {/* Date Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Start Date */}
            <div className="relative group">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-3 bg-purple-900/30 border-2 border-cyan-300/20 rounded-xl text-cyan-100 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all"
              />
            </div>
            {/* End Date */}
            <div className="relative group">
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-3 bg-purple-900/30 border-2 border-cyan-300/20 rounded-xl text-cyan-100 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all"
              />
            </div>
          </div>

          {/* Public Checkbox */}
          <label className="flex items-center space-x-3 text-cyan-300/90">
            <input
              type="checkbox"
              checked={isPublic}
              onChange={() => setIsPublic(!isPublic)}
              className="w-5 h-5 border-2 border-cyan-300/50 rounded-sm bg-purple-900/30"
            />
            <span>Public</span>
          </label>

          {/* Create Button */}
          <button
            onClick={handleCreate}
            className="w-full bg-cyan-500 text-white font-bold py-3 rounded-xl shadow-2xl hover:shadow-3xl transform transition-all duration-300 hover:-translate-y-1 hover:scale-105 active:scale-95"
          >
            Create Plan
          </button>
        </div>
      </div>

      {/* CSS for floating animation and fade-in effect */}
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

export default CreatePlan;