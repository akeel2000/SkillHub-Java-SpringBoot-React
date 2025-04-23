import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import PostCard from "../components/PostCard";

const Home = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [stories, setStories] = useState([]);
  const navigate = useNavigate();

  const authFetch = async (url, options = {}) => {
    const token = localStorage.getItem("token");
    return fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${token}`,
      },
    });
  };

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      const email = localStorage.getItem("userEmail");

      if (!email || !token) {
        navigate("/login");
        return;
      }

      try {
        const res = await authFetch(`http://localhost:8080/api/auth/user?email=${email}`);
        if (res.ok) {
          const data = await res.json();
          setUser(data);
          localStorage.setItem("userId", data.id);
        } else {
          alert("Failed to load user");
          navigate("/login");
        }
      } catch (error) {
        alert("Error fetching user");
        navigate("/login");
      }
    };

    fetchUser();
  }, [navigate]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await authFetch("http://localhost:8080/api/posts");
        if (res.ok) {
          const data = await res.json();
          setPosts(data);
        }
      } catch (error) {
        console.error("Failed to fetch posts", error);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const res = await authFetch("http://localhost:8080/api/stories");
        if (res.ok) setStories(await res.json());
      } catch (error) {
        console.error("Failed to fetch stories", error);
      }
    };

    fetchStories();
  }, []);

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="animate-pulse text-cyan-400 text-xl">Loading Profile...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Floating Background Elements */}
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

      <Header user={user} />

      <div className="p-6 max-w-6xl mx-auto">
        {/* Stories Section */}
        <div className="mt-6 relative z-10">
          <h2 className="text-xl font-bold mb-4 text-cyan-400 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Recent Stories
          </h2>
          <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
            {stories.map((story, index) => (
              <div 
                key={index} 
                className="w-32 h-48 bg-gradient-to-br from-purple-800/50 to-blue-800/50 backdrop-blur-sm rounded-2xl p-1 border border-cyan-300/20 shadow-2xl transform transition-all duration-300 hover:scale-105 flex-shrink-0"
              >
                <div className="relative h-full rounded-xl overflow-hidden group">
                  {story.mediaUrl ? (
                    <img
                      src={`http://localhost:8080${story.mediaUrl}`}
                      alt="Story"
                      className="w-full h-full object-cover transform transition-transform group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-cyan-300 p-4 text-sm bg-purple-900/30">
                      {story.text}
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                    <p className="text-xs text-cyan-300 font-medium">
                      {story.viewedBy?.length || 0} views
                    </p>
                  </div>
                </div>
              </div>
            ))}
            <button
              onClick={() => navigate("/add-story")}
              className="w-32 h-48 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 backdrop-blur-sm rounded-2xl border-2 border-dashed border-cyan-300/30 flex items-center justify-center text-cyan-400 hover:text-cyan-300 transition-all transform hover:scale-105 flex-shrink-0"
            >
              <div className="text-4xl bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                +
              </div>
            </button>
          </div>
        </div>

        {/* Posts Section */}
        <div className="mt-8 relative z-10">
          <h2 className="text-xl font-bold mb-6 text-cyan-400 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Community Posts
          </h2>
          <div className="space-y-6">
            {posts.length > 0 ? (
              posts.map((post) => (
                <PostCard 
                  key={post.id} 
                  post={post}
                  className="bg-gradient-to-br from-purple-800/50 to-blue-800/50 backdrop-blur-sm rounded-2xl border border-cyan-300/20 shadow-2xl transform transition-all hover:scale-[1.01] hover:shadow-3xl"
                />
              ))
            ) : (
              <div className="bg-gradient-to-br from-purple-800/50 to-blue-800/50 backdrop-blur-sm rounded-2xl p-6 border border-cyan-300/20 text-cyan-300 text-center">
                No posts available yet
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(10deg); }
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default Home;