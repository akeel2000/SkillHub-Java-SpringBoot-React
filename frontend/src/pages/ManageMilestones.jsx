import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ManageMilestones = () => {
  const { id } = useParams(); // Plan ID from URL
  const [milestones, setMilestones] = useState([]); // List of milestones
  const [description, setDescription] = useState(""); // New milestone description
  const [targetDate, setTargetDate] = useState(""); // New milestone target date
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // Fetch milestones for the plan on mount
  useEffect(() => {
    const fetchMilestones = async () => {
      const res = await fetch(`http://localhost:8080/api/plans/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setMilestones(data.milestones || []);
    };
    fetchMilestones();
  }, [id, token]);

  // Add a new milestone to the list
  const addMilestone = () => {
    setMilestones([...milestones, { description, targetDate, completed: false }]);
    setDescription("");
    setTargetDate("");
  };

  // Save all milestones to backend
  const saveMilestones = async () => {
    const res = await fetch(`http://localhost:8080/api/plans/${id}/update-milestones`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(milestones),
    });

    if (res.ok) {
      navigate(`/plan-progress/${id}`); // Redirect to plan progress page
    } else {
      alert("Failed to save milestones");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-cyan-100 p-6">
      {/* Page title */}
      <h1 className="text-2xl mb-6">Manage Milestones</h1>

      {/* List of existing milestones */}
      <div className="space-y-4">
        {milestones.map((m, idx) => (
          <div key={idx} className="border p-4 rounded-xl bg-purple-800/50">
            <p><b>Description:</b> {m.description}</p>
            <p><b>Target Date:</b> {new Date(m.targetDate).toDateString()}</p>
          </div>
        ))}
      </div>

      {/* Form to add a new milestone */}
      <div className="mt-8 space-y-4">
        <input
          type="text"
          placeholder="Milestone Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-3 rounded-xl bg-purple-800/50 border border-cyan-300"
        />
        <input
          type="date"
          value={targetDate}
          onChange={(e) => setTargetDate(e.target.value)}
          className="w-full p-3 rounded-xl bg-purple-800/50 border border-cyan-300"
        />
        {/* Button to add milestone */}
        <button
          onClick={addMilestone}
          className="w-full bg-cyan-500 px-4 py-3 rounded-xl"
        >
          ➕ Add Milestone
        </button>
        {/* Button to save all milestones */}
        <button
          onClick={saveMilestones}
          className="w-full bg-green-500 mt-4 px-4 py-3 rounded-xl"
        >
          ✅ Save All
        </button>
      </div>
    </div>
  );
};

export default ManageMilestones;