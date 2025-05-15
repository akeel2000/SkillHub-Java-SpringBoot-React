import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// PublicProfile component displays another user's profile and allows sending friend requests
const PublicProfile = ({ currentUser }) => {
  const { id } = useParams(); // Get user ID from URL params
  const [profile, setProfile] = useState(null); // State for profile data
  const [friendStatus, setFriendStatus] = useState(""); // State for friendship status

  useEffect(() => {
    // Fetch public profile and friendship status
    const fetchProfile = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/auth/public-profile/${id}`);
        const data = await res.json();
        setProfile(data);

        // Fetch friend status if current user is logged in
        if (currentUser?.id && id) {
          const statusRes = await fetch(`http://localhost:8080/api/friends/status?from=${currentUser.id}&to=${id}`);
          const statusText = await statusRes.text();
          setFriendStatus(statusText);
        }
      } catch (error) {
        console.error("Failed to load profile", error);
      }
    };
    fetchProfile();
  }, [id, currentUser]);

  // Handle sending a friend request
  const handleAddFriend = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/friends/request?fromUserId=${currentUser.id}&toUserId=${id}`, {
        method: "POST",
      });
      const msg = await res.text();
      alert(msg);
      setFriendStatus("PENDING");
    } catch (err) {
      console.error("Friend request failed", err);
    }
  };

  // Show loading state while fetching profile
  if (!profile) return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6 text-cyan-300">
      Loading...
    </div>
  );

  return (
    // Main background and floating elements for visual effect
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden p-6">
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

      {/* Main Content Card */}
      <div className="relative z-10 bg-gradient-to-br from-purple-800/50 to-blue-800/50 backdrop-blur-xl border border-cyan-300/20 rounded-3xl shadow-2xl max-w-4xl mx-auto animate-fadeInUp">
        {/* Cover Photo Section */}
        {profile.coverPic && (
          <div className="h-64 overflow-hidden rounded-t-3xl border-b border-cyan-300/20">
            <img
              src={`http://localhost:8080${profile.coverPic}`}
              alt="Cover"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Profile Header with avatar and basic info */}
        <div className="flex items-center space-x-6 px-8 -mt-16">
          <div className="relative group">
            <img
              src={`http://localhost:8080${profile.profilePic}`}
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-cyan-300/20 shadow-2xl hover:border-cyan-400/40 transition-all"
            />
            <div className="absolute inset-0 rounded-full border-2 border-cyan-300/30 animate-ping opacity-0 group-hover:opacity-40 transition-opacity" />
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              {profile.name} {profile.lastName}
            </h2>
            <p className="text-cyan-300/80 font-mono">{profile.email}</p>
          </div>
        </div>

        {/* Friend Request/Status Section */}
        <div className="px-8 mt-6">
          {currentUser?.id !== profile.id && (
            <div className="flex items-center space-x-4">
              {friendStatus === "PENDING" && (
                <div className="px-4 py-2 border-2 border-yellow-500/30 text-yellow-400 rounded-xl bg-yellow-900/20">
                  Request Pending
                </div>
              )}
              {friendStatus === "FRIENDS" && (
                <div className="px-4 py-2 border-2 border-green-500/30 text-green-400 rounded-xl bg-green-900/20">
                  Connection Established
                </div>
              )}
              {friendStatus === "NONE" && (
                <button
                  onClick={handleAddFriend}
                  className="px-6 py-3 bg-gradient-to-br from-cyan-500 to-blue-600 text-white font-bold rounded-xl shadow-2xl hover:shadow-3xl transform transition-all duration-300 hover:-translate-y-1 hover:scale-105 active:scale-95"
                >
                  Initiate Connection
                </button>
              )}
            </div>
          )}
        </div>

        {/* Interests Section */}
        <div className="p-8 mt-6 border-t border-cyan-300/20">
          <h3 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-4">
            Neural Interests
          </h3>
          <div className="flex flex-wrap gap-3">
            {profile.categories?.map((cat, index) => (
              <div
                key={index}
                className="px-3 py-1.5 border-2 border-cyan-300/20 rounded-full text-cyan-300/90 bg-purple-900/30 hover:border-cyan-400/40 transition-all"
              >
                #{cat}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Animation styles for floating elements and fade-in effect */}
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

export default PublicProfile;
