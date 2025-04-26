import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ManageGroup = () => {
  const { id } = useParams(); // groupId
  const [group, setGroup] = useState(null);
  const [inviteEmail, setInviteEmail] = useState("");
  const [newResource, setNewResource] = useState("");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/groups/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setGroup(data);
      } catch (error) {
        console.error("Failed to fetch group", error);
      }
    };
    fetchGroup();
  }, [id, token]);

  const handleAddResource = async () => {
    if (!newResource.trim()) return;
    const updatedGroup = {
      ...group,
      pinnedResources: [...group.pinnedResources, newResource.trim()]
    };
    await saveGroup(updatedGroup);
    setNewResource("");
  };

  const handleRemoveResource = async (resToRemove) => {
    const updatedGroup = {
      ...group,
      pinnedResources: group.pinnedResources.filter((r) => r !== resToRemove)
    };
    await saveGroup(updatedGroup);
  };

  const saveGroup = async (updatedGroup) => {
    try {
      const res = await fetch(`http://localhost:8080/api/groups/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedGroup),
      });

      if (res.ok) {
        const savedGroup = await res.json();
        setGroup(savedGroup);
      } else {
        alert("Failed to update group");
      }
    } catch (error) {
      console.error("Update failed", error);
    }
  };

  const handleInvite = async () => {
    alert("Invite functionality coming soon! (Bonus part 🔥)");
    // Later you can implement GroupInvite logic based on email/userId!
  };

  if (!group) return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6 text-cyan-100">
      Loading Group...
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6 text-cyan-100">
      <div className="max-w-5xl mx-auto">
        {/* Group Title */}
        <h2 className="text-3xl font-bold mb-8 text-center">{group.name} ✏️ Manage Group</h2>

        {/* Pinned Resources Section */}
        <div className="mb-10">
          <h3 className="text-2xl font-bold mb-4">📌 Pinned Resources</h3>

          {/* Add new resource */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <input
              type="text"
              value={newResource}
              onChange={(e) => setNewResource(e.target.value)}
              placeholder="Add resource URL (e.g., PDF, YouTube link)"
              className="flex-grow p-3 rounded-xl border-2 border-cyan-300/20 bg-purple-900/30 text-cyan-100 placeholder-cyan-300/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/30"
            />
            <button
              onClick={handleAddResource}
              className="bg-cyan-500 py-3 px-6 rounded-xl text-white font-bold hover:scale-105 transition-all active:scale-95"
            >
              ➕ Add Resource
            </button>
          </div>

          {/* Existing resources */}
          {group.pinnedResources.length === 0 ? (
            <p className="text-cyan-300">No pinned resources yet.</p>
          ) : (
            <ul className="list-disc list-inside space-y-2">
              {group.pinnedResources.map((res, idx) => (
                <li key={idx} className="flex items-center justify-between">
                  <a href={res} target="_blank" rel="noopener noreferrer" className="text-cyan-400 underline hover:text-cyan-200">
                    {res}
                  </a>
                  <button
                    onClick={() => handleRemoveResource(res)}
                    className="text-red-400 text-xs hover:text-red-300 ml-4"
                  >
                    ❌ Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Invite Members Section (Placeholder for now) */}
        <div className="mb-10">
          <h3 className="text-2xl font-bold mb-4">📩 Invite Members</h3>

          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="Enter user email to invite"
              className="flex-grow p-3 rounded-xl border-2 border-cyan-300/20 bg-purple-900/30 text-cyan-100 placeholder-cyan-300/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/30"
            />
            <button
              onClick={handleInvite}
              className="bg-cyan-500 py-3 px-6 rounded-xl text-white font-bold hover:scale-105 transition-all active:scale-95"
            >
              ➕ Send Invite
            </button>
          </div>
        </div>

        {/* Back to Group */}
        <div className="flex justify-center mt-10">
          <button
            onClick={() => navigate(`/group/${id}`)}
            className="text-cyan-300 hover:text-cyan-100 underline"
          >
            🔙 Back to Group
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageGroup;
