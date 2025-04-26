import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const GroupHome = () => {
  const { id } = useParams();
  const [group, setGroup] = useState(null);
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  // 👉 Fetch group details and posts
  const fetchGroupDetails = async () => {
    try {
      const resGroup = await fetch(`http://localhost:8080/api/groups/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const groupData = await resGroup.json();
      setGroup(groupData);
      setEditName(groupData.name);
      setEditDescription(groupData.description);

      const resPosts = await fetch(`http://localhost:8080/api/groups/${id}/posts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const postsData = await resPosts.json();
      setPosts(postsData);
    } catch (error) {
      console.error("Failed to load group", error);
    }
  };

  useEffect(() => {
    fetchGroupDetails();
  }, [id, token]);

  const handleAddPost = async () => {
    if (!newPost.trim()) {
      alert("Please enter some content!");
      return;
    }
    try {
      const res = await fetch(`http://localhost:8080/api/groups/${id}/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          groupId: id,
          userId,
          content: newPost.trim(),
        }),
      });
      if (res.ok) {
        const newPostObj = await res.json();
        setPosts([...posts, newPostObj]);
        setNewPost("");
      } else {
        alert("Failed to post");
      }
    } catch (err) {
      console.error(err);
      alert("Error posting");
    }
  };

  const handleJoinGroup = async () => {
    try {
      const updatedGroup = {
        ...group,
        memberIds: [...group.memberIds, userId],
      };
      const res = await fetch(`http://localhost:8080/api/groups/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedGroup),
      });
      if (res.ok) {
        const newGroupData = await res.json();
        setGroup(newGroupData);
        alert("Successfully joined the group!");
      } else {
        alert("Failed to join group");
      }
    } catch (err) {
      console.error(err);
      alert("Error joining group");
    }
  };

  const handleSaveEdit = async () => {
    try {
      const updatedGroup = {
        ...group,
        name: editName,
        description: editDescription,
      };
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
        setIsEditing(false);
        alert("Group updated successfully!");
        // 👉 Update posts and details again if needed
        fetchGroupDetails();
      } else {
        alert("Failed to update group");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating group");
    }
  };
  const handleDeleteGroup = async () => {
    if (window.confirm("Are you sure you want to delete this group?")) {
      try {
        const res = await fetch(`http://localhost:8080/api/groups/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          alert("Group deleted successfully!");
          navigate("/groups"); // ✅ Go to /groups after delete
        } else {
          alert("Failed to delete group");
        }
      } catch (err) {
        console.error(err);
        alert("Error deleting group");
      }
    }
  };
  

  if (!group) return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6 text-cyan-100">
      Loading Group...
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6 text-cyan-100">
      <div className="max-w-5xl mx-auto">

        {/* Group Details */}
        <div className="mb-8">
          {isEditing ? (
            <>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full p-3 mb-4 rounded-xl border-2 border-cyan-300/20 bg-purple-900/30 text-cyan-100"
              />
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                rows="3"
                className="w-full p-3 rounded-xl border-2 border-cyan-300/20 bg-purple-900/30 text-cyan-100"
              />
              <div className="flex justify-center gap-4 mt-4">
                <button
                  onClick={handleSaveEdit}
                  className="bg-cyan-500 py-2 px-5 rounded-xl text-white font-bold hover:scale-105 transition-transform"
                >
                  💾 Save
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-500 py-2 px-5 rounded-xl text-white font-bold hover:scale-105 transition-transform"
                >
                  ✖️ Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-3xl font-bold mb-2">{group.name}</h2>
              <p className="text-cyan-300">{group.description}</p>
            </>
          )}
        </div>

        {/* Join Button */}
        {!group.memberIds.includes(userId) && (
          <div className="flex justify-center mb-6">
            <button
              onClick={handleJoinGroup}
              className="bg-cyan-500 py-2 px-5 rounded-xl text-white font-bold hover:scale-105 transition-transform"
            >
              ➕ Join Group
            </button>
          </div>
        )}

        {/* Pinned Resources */}
        <div className="mb-10">
          <h3 className="text-2xl font-bold mb-4">📌 Pinned Resources</h3>
          {group.pinnedResources.length === 0 ? (
            <p className="text-cyan-300">No resources pinned yet.</p>
          ) : (
            <ul className="list-disc list-inside space-y-2">
              {group.pinnedResources.map((res, idx) => (
                <li key={idx}>
                  <a href={res} target="_blank" rel="noopener noreferrer" className="text-cyan-400 underline hover:text-cyan-200">
                    {res}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Discussion Posts */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-4">💬 Group Discussions</h3>

          {/* New Post */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <input
              type="text"
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="Write a discussion post..."
              className="flex-grow p-3 rounded-xl border-2 border-cyan-300/20 bg-purple-900/30 text-cyan-100 placeholder-cyan-300/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/30"
            />
            <button
              onClick={handleAddPost}
              className="bg-cyan-500 py-3 px-6 rounded-xl text-white font-bold hover:scale-105 transition-all active:scale-95"
            >
              ➕ Post
            </button>
          </div>

          {/* Posts List */}
          {posts.length === 0 ? (
            <p className="text-cyan-300">No discussions yet. Start a new one!</p>
          ) : (
            <div className="space-y-6">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="bg-purple-800/40 p-6 rounded-2xl shadow-xl border border-cyan-300/10 hover:border-cyan-400/30"
                >
                  <p className="text-cyan-100">{post.content}</p>
                  <p className="text-cyan-300 text-sm mt-2">
                    Posted on {new Date(post.createdAt).toLocaleDateString()} at {new Date(post.createdAt).toLocaleTimeString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Edit + Delete Buttons */}
        {group.creatorId === userId && (
          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={() => setIsEditing(true)}
              className="text-cyan-300 hover:text-cyan-100 underline"
            >
              ✏️ Edit Group
            </button>
            <button
              onClick={handleDeleteGroup}
              className="text-red-400 hover:text-red-300 underline"
            >
              ❌ Delete Group
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupHome;
