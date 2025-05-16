import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Component for creating a new study group
const CreateGroup = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();
  // Get userId and token from localStorage for authentication
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  // Function to handle group creation
  const handleCreateGroup = async () => {
    // Validate input fields
    if (!name || !description) {
      alert("Please fill all fields!");
      return;
    }

    // Prepare group data for API request
    const groupData = {
      name,
      description,
      creatorId: userId,
      memberIds: [userId],  
      pinnedResources: []
    };

    try {
      // Send POST request to backend API to create the group
      const res = await fetch("http://localhost:8080/api/groups", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(groupData),
      });

      // Handle response
      if (res.ok) {
        alert("Study Group created successfully!");
        navigate("/groups"); // Go back to group feed
      } else {
        alert("Failed to create group");
      }
    } catch (err) {
      console.error(err);
      alert("Error creating group");
    }
  };

  return (
    // Main container with gradient background and centered content
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6 flex items-center justify-center">
      {/* Card for group creation form */}
      <div className="bg-purple-800/30 backdrop-blur-xl p-8 rounded-2xl shadow-2xl w-full max-w-xl">
        {/* Page title */}
        <h2 className="text-3xl font-bold text-cyan-100 mb-8 text-center">
          🚀 Create New Study Group
        </h2>

        {/* Form fields */}
        <div className="space-y-6">
          {/* Group name input */}
          <input
            type="text"
            placeholder="Group Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 rounded-xl border-2 border-cyan-300/20 bg-purple-900/30 text-cyan-100 placeholder-cyan-300/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/30"
          />

          {/* Group description textarea */}
          <textarea
            placeholder="Group Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="4"
            className="w-full p-3 rounded-xl border-2 border-cyan-300/20 bg-purple-900/30 text-cyan-100 placeholder-cyan-300/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/30"
          />

          {/* Create group button */}
          <button
            onClick={handleCreateGroup}
            className="w-full bg-cyan-500 py-3 rounded-xl text-white font-bold hover:scale-105 transition-all active:scale-95"
          >
            ➕ Create Group
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateGroup;