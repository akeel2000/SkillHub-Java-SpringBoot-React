import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Header = ({ user }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".search-box")) {
        setResults([]);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleSearch = async () => {
    try {
      const query = searchTerm.trim() || "a";
      const res = await fetch(`http://localhost:8080/api/auth/search?name=${query}`);
      const data = await res.json();
      setResults(data);
    } catch (error) {
      console.error("Search failed", error);
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-800/50 to-blue-800/50 backdrop-blur-xl border-b border-cyan-300/20 px-6 py-3 flex justify-between items-center fixed w-full top-0 z-50 shadow-2xl">
      
      {/* Floating Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        {[...Array(4)].map((_, i) => (
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

      {/* Logo */}
      <h1
        className="text-2xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent cursor-pointer hover:scale-105 transition-transform"
        onClick={() => navigate("/dashboard")}
      >
        SkillHub
      </h1>

      {/* Navigation Links */}
      <div className="flex items-center space-x-6 relative">
        <div className="hidden md:flex space-x-4">
          {[
            { label: "Dashboard", route: "/dashboard" },
            { label: "Home", route: "/home" },
            { label: "Explore", route: "/explore-plans" },
            // { label: "Notifications", route: "/notifications" },
            { label: "groups", route: "/groups" },
            { label: "My Plans", route: "/learning-plans" }
          ].map((item, idx) => (
            <button
              key={idx}
              onClick={() => navigate(item.route)}
              className="text-cyan-300 hover:text-cyan-100 px-4 py-2 rounded-xl hover:bg-cyan-500/10 transition-all group relative"
            >
              <span className="relative z-10">{item.label}</span>
              <div className="absolute inset-0 bg-cyan-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative search-box">
          <div className="flex items-center bg-purple-900/30 backdrop-blur-sm rounded-xl border-2 border-cyan-300/20 hover:border-cyan-400/40 transition-all">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              onFocus={handleSearch}
              placeholder="Search users..."
              className="px-4 py-2 bg-transparent text-cyan-100 placeholder-cyan-300/50 focus:outline-none w-48 md:w-64 rounded-xl"
            />
            <svg className="w-5 h-5 mr-3 text-cyan-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {results.length > 0 && (
            <div className="absolute top-14 left-0 bg-purple-800/50 backdrop-blur-xl rounded-2xl shadow-2xl w-64 z-50 max-h-60 overflow-y-auto border border-cyan-300/20">
              {results.map((u) => (
                <div
                  key={u.id}
                  className="flex items-center p-3 hover:bg-cyan-500/10 cursor-pointer transition-all group"
                  onClick={() => navigate(`/public-profile/${u.id}`)}
                >
                  <div className="relative mr-3">
                    <div className="absolute inset-0 bg-cyan-400/20 blur-xl rounded-full" />
                    <img
                      src={`http://localhost:8080${u.profilePic}`}
                      alt={u.name}
                      className="w-8 h-8 rounded-full border-2 border-cyan-300/50 relative z-10"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.parentElement.classList.add("bg-gradient-to-br", "from-cyan-500", "to-purple-600");
                      }}
                    />
                  </div>
                  <span className="text-cyan-100 text-sm font-medium group-hover:text-cyan-400 transition-colors">
                    {u.name}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Profile Avatar */}
        {user && (
          <div
            onClick={() => navigate("/profile")}
            className="flex items-center space-x-3 cursor-pointer group relative"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-cyan-400/20 blur-xl rounded-full animate-pulse" />
              <img
                src={`http://localhost:8080${user.profilePic}`}
                alt="Profile"
                className="w-10 h-10 rounded-full border-2 border-cyan-300/50 relative z-10 group-hover:border-cyan-400 transition-all"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.parentElement.classList.add('bg-gradient-to-br', 'from-cyan-500', 'to-purple-600');
                }}
              />
            </div>
            <span className="hidden md:block text-sm bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent font-semibold group-hover:scale-105 transition-transform">
              View Profile
            </span>
          </div>
        )}
      </div>

      {/* Background Animation */}
      <style jsx="true">{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(5deg); }
        }
      `}</style>
    </div>
  );
};

export default Header;
