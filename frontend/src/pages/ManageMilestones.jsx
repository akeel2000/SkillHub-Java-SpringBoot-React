import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ManageMilestones = () => {
  const { id } = useParams();
  const [milestones, setMilestones] = useState([]);
  const [description, setDescription] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

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

  const addMilestone = () => {
    setMilestones([...milestones, { description, targetDate, completed: false }]);
    setDescription("");
    setTargetDate("");
  };

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
      navigate(`/plan-progress/${id}`);
    } else {
      alert("Failed to save milestones");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-cyan-100 p-6">
      <h1 className="text-2xl mb-6">Manage Milestones</h1>

      <div className="space-y-4">
        {milestones.map((m, idx) => (
          <div key={idx} className="border p-4 rounded-xl bg-purple-800/50">
            <p><b>Description:</b> {m.description}</p>
            <p><b>Target Date:</b> {new Date(m.targetDate).toDateString()}</p>
          </div>
        ))}
      </div>

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
        <button
          onClick={addMilestone}
          className="w-full bg-cyan-500 px-4 py-3 rounded-xl"
        >
          ➕ Add Milestone
        </button>
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
