import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const StudyGroups = () => {
  const [groups, setGroups] = useState([]);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const resCreated = await fetch(`http://localhost:8080/api/groups/created/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const resJoined = await fetch(`http://localhost:8080/api/groups/joined/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const createdGroups = await resCreated.json();
        const joinedGroups = await resJoined.json();

        const mergedGroups = [...createdGroups, ...joinedGroups];
        const uniqueGroups = Array.from(new Map(mergedGroups.map(item => [item.id, item])).values()); // Remove duplicates
        setGroups(uniqueGroups);

      } catch (error) {
        console.error("Failed to load groups", error);
      }
    };

    fetchGroups();
  }, [userId, token]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6 text-cyan-100">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">🎯 My Study Groups</h2>
          <button
            onClick={() => navigate("/create-group")}
            className="bg-cyan-500 py-2 px-5 rounded-xl text-white font-bold hover:scale-105 transition-transform"
          >
            ➕ Create Group
          </button>
        </div>

        {/* Groups List */}
        {groups.length === 0 ? (
          <p className="text-center text-cyan-300 mt-20">
            You have not joined or created any groups yet. Create one now!
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups.map((group) => (
              <div
                key={group.id}
                className="bg-purple-800/40 p-6 rounded-2xl shadow-xl border border-cyan-300/10 hover:border-cyan-400/30 hover:scale-105 transform transition-all cursor-pointer"
                onClick={() => navigate(`/group/${group.id}`)}
              >
                <h3 className="text-xl font-bold mb-2">{group.name}</h3>
                <p className="text-cyan-300 mb-4 line-clamp-2">{group.description}</p>
                <p className="text-sm text-cyan-400/70">Members: {group.memberIds.length}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudyGroups;
