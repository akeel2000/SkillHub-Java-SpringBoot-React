// PostList.js
import React, { useState, useEffect } from "react";
import PostCardWithReactions from "./PostCardWithReactions";
import EditPostModal from "./EditPostModal";

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [editingPost, setEditingPost] = useState(null);
  const userId = localStorage.getItem("userId");
  const userName = localStorage.getItem("userName");
  const token = localStorage.getItem("token");

  const fetchPosts = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/posts", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      } else {
        console.error("Failed to fetch posts");
      }
    } catch (err) {
      console.error("Fetch error", err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      const res = await fetch(`http://localhost:8080/api/posts/${postId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        fetchPosts();
      } else {
        alert("Failed to delete post");
      }
    } catch (err) {
      console.error("Delete error", err);
      alert("Error deleting post");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden p-6">
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

      <div className="relative z-10 max-w-3xl mx-auto space-y-6 animate-fadeInUp">
        {posts.length === 0 ? (
          <div className="text-center p-8 bg-gradient-to-br from-purple-800/50 to-blue-800/50 backdrop-blur-xl border border-cyan-300/20 rounded-2xl shadow-2xl">
            <p className="text-cyan-300/80 text-xl">No neural pulses detected</p>
          </div>
        ) : (
          posts.map((post) => (
            <PostCardWithReactions
              key={post.id}
              post={post}
              userId={userId}
              userName={userName}
              token={token}
              onUpdate={fetchPosts}
              onEdit={() => setEditingPost(post)}
              onDelete={() => handleDelete(post.id)}
              showControls={post.userId === userId}
            />
          ))
        )}
      </div>

      {editingPost && (
        <EditPostModal
          post={editingPost}
          onClose={() => setEditingPost(null)}
          onUpdate={(updated) => {
            setEditingPost(null);
            fetchPosts();
          }}
        />
      )}

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

export default PostList;