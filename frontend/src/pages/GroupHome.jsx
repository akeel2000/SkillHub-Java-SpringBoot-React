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
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token || !userId) {
      navigate("/login");
      return;
    }
    fetchGroupDetails();
  }, [id, token, userId, navigate]);

  const fetchGroupDetails = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const resGroup = await fetch(`http://localhost:8080/api/groups/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!resGroup.ok) throw new Error(await resGroup.text() || "Failed to load group");
      const groupData = await resGroup.json();
      setGroup(groupData);
      setEditName(groupData.name || "");
      setEditDescription(groupData.description || "");

      const resPosts = await fetch(`http://localhost:8080/api/groups/${id}/posts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!resPosts.ok) throw new Error(await resPosts.text() || "Failed to load posts");
      const postsData = await resPosts.json();
      setPosts(Array.isArray(postsData) ? postsData : []);
    } catch (error) {
      setError(error.message || "Failed to load group");
    } finally {
      setIsLoading(false);
    }
  };

  const validatePost = (content) => {
    if (!content.trim()) return "Post cannot be empty";
    if (content.length > 500) return "Post cannot exceed 500 characters";
    if (!/^[A-Za-z0-9\s.,!?']+$/.test(content)) return "Post contains invalid characters";
    return null;
  };

  const validateEdit = () => {
    if (!editName.trim()) return "Group name cannot be empty";
    if (editName.length > 50) return "Group name cannot exceed 50 characters";
    if (!/^[A-Za-z0-9\s]+$/.test(editName)) return "Group name must be alphanumeric or spaces";
    if (editDescription.length > 500) return "Description cannot exceed 500 characters";
    return null;
  };

  const handleAddPost = async () => {
    setError(null);
    setSuccess(null);

    const validationError = validatePost(newPost);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
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
      if (!res.ok) throw new Error(await res.text() || "Failed to post");
      const newPostObj = await res.json();
      setPosts([...posts, newPostObj]);
      setNewPost("");
      setSuccess("Post added successfully!");
    } catch (err) {
      setError(err.message || "Error posting");
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinGroup = async () => {
    setError(null);
    setSuccess(null);
    setIsLoading(true);
    try {
      const updatedGroup = {
        ...group,
        memberIds: [...(group.memberIds || []), userId],
      };
      const res = await fetch(`http://localhost:8080/api/groups/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedGroup),
      });
      if (!res.ok) throw new Error(await res.text() || "Failed to join group");
      const newGroupData = await res.json();
      setGroup(newGroupData);
      setSuccess("Successfully joined the group!");
    } catch (err) {
      setError(err.message || "Error joining group");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveEdit = async () => {
    setError(null);
    setSuccess(null);

    const validationError = validateEdit();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    try {
      const updatedGroup = {
        ...group,
        name: editName.trim(),
        description: editDescription.trim(),
      };
      const res = await fetch(`http://localhost:8080/api/groups/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedGroup),
      });
      if (!res.ok) throw new Error(await res.text() || "Failed to update group");
      const savedGroup = await res.json();
      setGroup(savedGroup);
      setIsEditing(false);
      setSuccess("Group updated successfully!");
      fetchGroupDetails();
    } catch (err) {
      setError(err.message || "Error updating group");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteGroup = async () => {
    setError(null);
    setSuccess(null);
    if (!window.confirm("Are you sure you want to delete this group?")) return;

    setIsLoading(true);
    try {
      const res = await fetch(`http://localhost:8080/api/groups/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(await res.text() || "Failed to delete group");
      setSuccess("Group deleted successfully!");
      setTimeout(() => navigate("/groups"), 1000);
    } catch (err) {
      setError(err.message || "Error deleting group");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
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
    localStorage.removeItem("userId");
    navigate("/login");
  };

  if (!group || isLoading)
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
        <div className="animate-pulse text-teal-400 text-xl">Loading Group...</div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Group Details</h2>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 hover:scale-105 transition-all"
            aria-label="Log out"
            disabled={isLoading}
          >
            Logout
          </button>
        </div>

        {/* Back Button */}
        <button
          onClick={() => navigate("/groups")}
          className="mb-4 px-4 py-2 bg-teal-400 text-white rounded-md hover:bg-teal-500 hover:scale-105 transition-all flex items-center gap-2"
          aria-label="Go back to groups"
          disabled={isLoading}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back
        </button>

        {/* Group Details */}
        <div className="mb-8 bg-white border border-gray-200 rounded-lg p-4 shadow-md">
          {isEditing ? (
            <>
              <input
                type="text"
                value={editName}
                onChange={(e) => {
                  setEditName(e.target.value);
                  setError(null);
                }}
                placeholder="Group Name"
                className={`w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-teal-400 ${
                  error && error.includes("Group name") ? "animate-shake border-red-500" : ""
                }`}
                disabled={isLoading}
                aria-label="Edit group name"
              />
              <textarea
                value={editDescription}
                onChange={(e) => {
                  setEditDescription(e.target.value);
                  setError(null);
                }}
                rows="3"
                placeholder="Group Description"
                className="w-full mt-4 px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-teal-400"
                disabled={isLoading}
                aria-label="Edit group description"
              />
              <div className="flex justify-center gap-4 mt-4">
                <button
                  onClick={handleSaveEdit}
                  className={`px-4 py-2 bg-teal-400 text-white rounded-md hover:bg-teal-500 hover:scale-105 transition-all ${
                    isLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={isLoading}
                  aria-label="Save group changes"
                >
                  {isLoading ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className={`px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 hover:scale-105 transition-all ${
                    isLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={isLoading}
                  aria-label="Cancel editing"
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{group.name}</h3>
              <p className="text-gray-700">{group.description || "No description available."}</p>
            </>
          )}
        </div>

        {/* Error/Success Messages */}
        {error && (
          <p className="text-xs text-red-500 mb-4 text-center" role="alert" aria-live="polite">
            {error}
          </p>
        )}
        {success && (
          <p className="text-xs text-teal-400 mb-4 text-center" role="status" aria-live="polite">
            {success}
          </p>
        )}

        {/* Join Button */}
        {!group.memberIds?.includes(userId) && (
          <div className="flex justify-center mb-6">
            <button
              onClick={handleJoinGroup}
              className={`px-4 py-2 bg-teal-400 text-white rounded-md hover:bg-teal-500 hover:scale-105 transition-all ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isLoading}
              aria-label="Join group"
            >
              {isLoading ? "Joining..." : "Join Group"}
            </button>
          </div>
        )}

        {/* Pinned Resources */}
        <div className="mb-8 bg-white border border-gray-200 rounded-lg p-4 shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Pinned Resources</h3>
          {group.pinnedResources?.length === 0 ? (
            <p className="text-gray-700">No resources pinned yet.</p>
          ) : (
            <ul className="list-disc list-inside space-y-2">
              {group.pinnedResources.map((res, idx) => (
                <li key={idx}>
                  <a
                    href={res}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-teal-600 hover:text-teal-500 underline"
                  >
                    {res}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Discussion Posts */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Group Discussions</h3>

          {/* New Post */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <input
              type="text"
              value={newPost}
              onChange={(e) => {
                setNewPost(e.target.value);
                setError(null);
              }}
              placeholder="Write a discussion post..."
              className={`flex-grow px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-teal-400 ${
                error && error.includes("Post") ? "animate-shake border-red-500" : ""
              }`}
              disabled={isLoading}
              aria-label="Write a discussion post"
            />
            <button
              onClick={handleAddPost}
              className={`px-6 py-2 bg-teal-400 text-white rounded-md hover:bg-teal-500 hover:scale-105 transition-all ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isLoading}
              aria-label="Submit post"
            >
              {isLoading ? "Posting..." : "Post"}
            </button>
          </div>

          {/* Posts List */}
          {posts.length === 0 ? (
            <p className="text-gray-700">No discussions yet. Start a new one!</p>
          ) : (
            <div className="space-y-6">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white border border-gray-200 rounded-lg p-4 shadow-md hover:border-teal-400 hover:shadow-lg transition-all"
                  role="article"
                  aria-label={`Post by user ${post.userId}`}
                >
                  <p className="text-gray-700">{post.content}</p>
                  <p className="text-sm text-gray-600 mt-2">
                    Posted on{" "}
                    {new Date(post.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}{" "}
                    at{" "}
                    {new Date(post.createdAt).toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Edit + Delete Buttons */}
        {group.creatorId === userId && (
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setIsEditing(true)}
              className="text-teal-600 hover:text-teal-500 underline"
              disabled={isLoading}
              aria-label="Edit group"
            >
              Edit Group
            </button>
            <button
              onClick={handleDeleteGroup}
              className="text-red-600 hover:text-red-500 underline"
              disabled={isLoading}
              aria-label="Delete group"
            >
              Delete Group
            </button>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          50% { transform: translateX(4px); }
          75% { transform: translateX(-4px); }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default GroupHome;
