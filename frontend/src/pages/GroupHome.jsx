import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const GroupHome = () => {
  const { id } = useParams(); // group ID
  const [group, setGroup] = useState(null);
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGroupDetails = async () => {
      try {
        const resGroup = await fetch(`http://localhost:8080/api/groups/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const groupData = await resGroup.json();
        setGroup(groupData);

        const resPosts = await fetch(`http://localhost:8080/api/groups/${id}/posts`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const postsData = await resPosts.json();
        setPosts(postsData);
      } catch (error) {
        console.error("Failed to load group", error);
      }
    };
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
          <h2 className="text-3xl font-bold mb-2">{group.name}</h2>
          <p className="text-cyan-300">{group.description}</p>
        </div>

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

        {/* Discussion Section */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-4">💬 Group Discussions</h3>

          {/* Add New Post */}
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

        {/* Manage Members */}
        <div className="flex justify-center">
          <button
            onClick={() => navigate(`/group/${id}/manage`)}
            className="text-cyan-300 hover:text-cyan-100 underline mt-6"
          >
            ✏️ Manage Group (invite, pin resources)
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupHome;
