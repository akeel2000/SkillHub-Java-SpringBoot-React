import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const email = localStorage.getItem("userEmail");
  const token = localStorage.getItem("token");

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:8080/api/auth/logout", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      console.warn("Logout API failed, proceeding with local logout");
    }

    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    navigate("/login");
  };

  useEffect(() => {
    if (!email || !token) {
      navigate("/login");
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/auth/user?email=${email}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to load");
        const data = await res.json();
        setUser(data);
      } catch (err) {
        alert("Failed to load profile");
        localStorage.removeItem("token");
        localStorage.removeItem("userEmail");
        navigate("/login");
      }
    };

    fetchUser();
  }, [email, token, navigate]);

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

      {/* Cover Section - Fixed Visibility */}
      <div className="h-96 min-h-[400px] relative z-10">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/30 to-blue-500/30">
          {user.coverPic && (
            <img
              src={`http://localhost:8080${user.coverPic}`}
              alt="Cover"
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* Profile Picture Container - Enhanced Visibility */}
        <div className="absolute -bottom-20 left-8 z-20">
          <div className="relative group">
            <div className="absolute inset-0 bg-cyan-400/20 blur-xl rounded-full" />
            <div className="w-40 h-40 rounded-full border-4 border-cyan-300/50 shadow-2xl overflow-hidden bg-purple-900/30 backdrop-blur-sm">
              <img
                src={`http://localhost:8080${user.profilePic}`}
                alt="Profile"
                className="w-full h-full object-cover transform transition-transform hover:scale-110"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.classList.add('bg-gradient-to-br', 'from-cyan-500', 'to-purple-600');
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Profile Header */}
      <div className="pt-24 px-8 bg-gradient-to-br from-purple-800/50 to-blue-800/50 backdrop-blur-xl border-b border-cyan-300/20">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                {user.name} {user.lastName}
              </h1>
              <p className="text-cyan-300 mt-2 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12.713l-11.985-9.713h23.97l-11.985 9.713zm0 2.574l-12-9.725v15.438h24v-15.438l-12 9.725z"/>
                </svg>
                {user.email}
              </p>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-4">
              <button className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-xl shadow-2xl hover:shadow-3xl transform transition-all hover:-translate-y-1">
                Add to Story
              </button>
              <button 
                onClick={() => navigate("/update-profile")}
                className="bg-gradient-to-br from-purple-500 to-pink-600 text-white px-6 py-3 rounded-xl shadow-2xl hover:shadow-3xl transform transition-all hover:-translate-y-1"
              >
                Edit Profile
              </button>
              <button
                onClick={handleLogout}
                className="bg-gradient-to-br from-red-500 to-pink-600 text-white px-6 py-3 rounded-xl shadow-2xl hover:shadow-3xl transform transition-all hover:-translate-y-1"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex mt-8 border-b border-cyan-300/20">
            <button className="px-6 py-4 border-b-4 border-cyan-500 text-cyan-400 font-semibold">
              Posts
            </button>
            <button className="px-6 py-4 text-cyan-300 hover:text-cyan-100 transition-colors">
              About
            </button>
            <button className="px-6 py-4 text-cyan-300 hover:text-cyan-100 transition-colors">
              Friends
            </button>
            <button className="px-6 py-4 text-cyan-300 hover:text-cyan-100 transition-colors">
              Photos
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto mt-8 grid grid-cols-4 gap-8 px-8 pb-8">
        {/* Left Column */}
        <div className="col-span-1 space-y-6">
          <div className="bg-gradient-to-br from-purple-800/50 to-blue-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-cyan-300/20">
            <h2 className="text-xl font-bold mb-4 text-cyan-400">Intro</h2>
            <p className="text-cyan-300/80 mb-6">
              {user.bio || "No bio added yet"}
            </p>
            
            {user.categories?.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4 text-cyan-400">Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {user.categories.map((category, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-cyan-500/10 text-cyan-300 rounded-full text-sm hover:bg-cyan-500/20 transition-colors"
                    >
                      #{category}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="col-span-3 space-y-6">
          {/* Create Post */}
          <div className="bg-gradient-to-br from-purple-800/50 to-blue-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-cyan-300/20">
            <div className="flex items-center gap-4">
              <div className="relative group">
                <div className="absolute inset-0 bg-cyan-400/20 blur-xl rounded-full" />
                <div className="w-12 h-12 rounded-full border-2 border-cyan-300/50 overflow-hidden bg-purple-900/30">
                  <img
                    src={`http://localhost:8080${user.profilePic}`}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.classList.add('bg-gradient-to-br', 'from-cyan-500', 'to-purple-600');
                    }}
                  />
                </div>
              </div>
              <input
                type="text"
                placeholder="What's on your mind?"
                className="flex-1 bg-cyan-500/10 text-cyan-300 rounded-full px-6 py-3 placeholder-cyan-300/50 hover:bg-cyan-500/20 transition-colors"
              />
            </div>
          </div>

          {/* Sample Post */}
          <div className="bg-gradient-to-br from-purple-800/50 to-blue-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-cyan-300/20">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full border-2 border-cyan-300/50 overflow-hidden bg-purple-900/30">
                <img
                  src={`http://localhost:8080${user.profilePic}`}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-bold text-cyan-300">{user.name} {user.lastName}</h3>
                <p className="text-cyan-300/70 text-sm">2 hours ago · Public</p>
              </div>
            </div>
            <p className="text-cyan-200 mb-6">
              Just joined this amazing community! Excited to share my skills and learn from others 🚀
            </p>
            <div className="flex gap-6 border-t border-cyan-300/20 pt-4">
              <button className="flex items-center gap-2 text-cyan-300/80 hover:text-cyan-400 transition-all">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                </svg>
                42 Likes
              </button>
              <button className="flex items-center gap-2 text-cyan-300/80 hover:text-cyan-400 transition-all">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                </svg>
                8 Comments
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;