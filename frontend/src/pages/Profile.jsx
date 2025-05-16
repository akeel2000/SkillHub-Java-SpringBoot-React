import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [postText, setPostText] = useState("");
  const [postError, setPostError] = useState(null);
  const [isPosting, setIsPosting] = useState(false);
  const email = localStorage.getItem("userEmail");
  const token = localStorage.getItem("token");

  const handleLogout = async () => {
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
    localStorage.removeItem("userEmail");
    navigate("/login");
  };

  const validatePost = (text) => {
    if (!text.trim()) return "Post cannot be empty";
    if (text.length > 500) return "Post cannot exceed 500 characters";
    // Optional: Add profanity filter or keyword checks if needed
    return null;
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    setPostError(null);

    const validationError = validatePost(postText);
    if (validationError) {
      setPostError(validationError);
      return;
    }

    setIsPosting(true);
    try {
      const res = await fetch("http://localhost:8080/api/posts", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, text: postText.trim() }),
      });
      if (res.ok) {
        setPostText("");
        // Optionally refresh posts or update UI
      } else {
        const text = await res.text();
        throw new Error(text || "Failed to create post");
      }
    } catch (err) {
      setPostError(err.message || "Failed to create post");
    } finally {
      setIsPosting(false);
    }
  };

  useEffect(() => {
    if (!email || !token) {
      navigate("/login");
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await fetch(
          `http://localhost:8080/api/auth/user?email=${email}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || "Failed to load profile");
        }
        const data = await res.json();
        setUser(data);
      } catch (err) {
        setPostError(err.message || "Failed to load profile");
        localStorage.removeItem("token");
        localStorage.removeItem("userEmail");
        navigate("/login");
      }
    };

    fetchUser();
  }, [email, token, navigate]);

  if (!user)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-pulse text-teal-400 text-xl">
          Loading Profile...
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div
        className="bg-gray-50 border border-gray-200 rounded-xl shadow-md p-6 w-full max-w-4xl mx-auto sm:max-w-full sm:mx-2"
        role="region"
        aria-label="User profile"
      >
        {/* Back Button */}
        <button
          onClick={() => navigate("/home")}
          className="mb-4 px-4 py-2 bg-teal-400 text-white rounded-md hover:bg-teal-500 hover:scale-105 transition-all flex items-center gap-2"
          aria-label="Go back to home"
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

        <h2 className="text-2xl font-semibold text-gray-900 text-center mb-6">
          {user.name} {user.lastName}
        </h2>

        {/* Cover Section */}
        <div className="h-48 relative mb-6">
          <div className="bg-gray-100 border border-gray-200 rounded-lg h-full">
            {user.coverPic && (
              <img
                src={`http://localhost:8080${user.coverPic}`}
                alt="Cover"
                className="w-full h-full object-cover rounded-lg"
              />
            )}
          </div>
          <div className="absolute -bottom-16 left-4">
            <div className="w-24 h-24 rounded-full border-2 border-gray-200 overflow-hidden bg-gray-100">
              <img
                src={`http://localhost:8080${user.profilePic}`}
                alt="Profile"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.parentElement.classList.add("bg-gray-200");
                }}
              />
            </div>
          </div>
        </div>

        {/* Profile Header */}
        <div className="pt-12 space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                {user.name} {user.lastName}
              </h3>
              <p className="text-gray-700 flex items-center">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 12.713l-11.985-9.713h23.97l-11.985 9.713zm0 2.574l-12-9.725v15.438h24v-15.438l-12 9.725z" />
                </svg>
                {user.email}
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => navigate("/add-story")}
                className="px-4 py-2 bg-teal-400 text-white rounded-md hover:bg-teal-500 hover:scale-105 transition-all"
              >
                Add to Story
              </button>
              <button
                onClick={() => navigate("/update-profile")}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 hover:scale-105 transition-all"
              >
                Edit Profile
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 hover:scale-105 transition-all"
              >
                Logout
              </button>
              <button
                onClick={() => navigate("/settings")}
                className="px-4 py-2 bg-teal-400 text-white rounded-md hover:bg-teal-500 hover:scale-105 transition-all"
              >
                Settings
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-gray-200">
            <button className="px-4 py-2 border-b-2 border-teal-400 text-teal-600 font-semibold">
              Posts
            </button>
            <button className="px-4 py-2 text-gray-700 hover:text-teal-600 hover:bg-gray-100">
              About
            </button>
            <button className="px-4 py-2 text-gray-700 hover:text-teal-600 hover:bg-gray-100">
              Friends
            </button>
            <button className="px-4 py-2 text-gray-700 hover:text-teal-600 hover:bg-gray-100">
              Photos
            </button>
          </div>
        </div>

        {/* Intro Section */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 mt-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Intro</h4>
          <p className="text-gray-700">{user.bio || "No bio added yet"}</p>
          {user.categories?.length > 0 && (
            <div className="mt-4">
              <h5 className="text-md font-semibold text-gray-900 mb-2">
                Interests
              </h5>
              <div className="flex flex-wrap gap-2">
                {user.categories.map((category, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-teal-100 text-teal-600 rounded-full text-sm"
                  >
                    #{category}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Create Post */}
        <form onSubmit={handlePostSubmit} className="bg-white border border-gray-200 rounded-lg p-4 mt-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full border border-gray-200 overflow-hidden">
              <img
                src={`http://localhost:8080${user.profilePic}`}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <input
              type="text"
              value={postText}
              onChange={(e) => {
                setPostText(e.target.value);
                setPostError(null);
              }}
              placeholder="What's on your mind?"
              className={`flex-1 px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-teal-400 ${
                postError ? "animate-shake border-red-500" : ""
              }`}
              maxLength="500"
              aria-label="Create a new post"
              disabled={isPosting}
            />
          </div>
          {postError && (
            <p className="text-xs text-red-500 mt-2" role="alert" aria-live="polite">
              {postError}
            </p>
          )}
          <button
            type="submit"
            className={`mt-4 px-4 py-2 bg-teal-400 text-white rounded-md hover:bg-teal-500 hover:scale-105 transition-all ${
              isPosting ? "opacity-50 cursor-not-allowed" : ""
            }`}
            aria-label="Submit post"
            disabled={isPosting}
          >
            {isPosting ? "Posting..." : "Post"}
          </button>
        </form>

        {/* Sample Post */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 mt-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-full border border-gray-200 overflow-hidden">
              <img
                src={`http://localhost:8080${user.profilePic}`}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h5 className="font-semibold text-gray-900">
                {user.name} {user.lastName}
              </h5>
              <p className="text-gray-700 text-sm">2 hours ago · Public</p>
            </div>
          </div>
          <p className="text-gray-900 mb-4">
            Just joined this amazing community! Excited to share my skills and learn from others!
          </p>
          <div className="flex gap-4 border-t border-gray-200 pt-4">
            <button className="flex items-center gap-2 text-gray-700 hover:text-teal-600 transition-all">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              42 Likes
            </button>
            <button className="flex items-center gap-2 text-gray-700 hover:text-teal-600 transition-all">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              8 Comments
            </button>
          </div>
        </div>
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

export default Profile;
