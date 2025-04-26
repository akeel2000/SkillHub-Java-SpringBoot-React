import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const AddResource = () => {
  const { id } = useParams();
  const [resource, setResource] = useState("");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleAddResource = async () => {
    const res = await fetch(`http://localhost:8080/api/plans/${id}/add-resource`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(resource),
    });

    if (res.ok) {
      navigate(`/plan-progress/${id}`);
    } else {
      alert("Failed to add resource");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-cyan-100 p-6">
      <h1 className="text-2xl mb-6">Add Resource</h1>
      <input
        type="text"
        placeholder="Enter Resource URL"
        value={resource}
        onChange={(e) => setResource(e.target.value)}
        className="p-4 w-full rounded-xl bg-purple-800/50 border border-cyan-300"
      />
      <button
        onClick={handleAddResource}
        className="mt-4 bg-cyan-500 px-6 py-2 rounded-xl text-white"
      >
        ➕ Add Resource
      </button>
    </div>
  );
};

export default AddResource;
