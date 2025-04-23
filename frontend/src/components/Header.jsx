import React from "react";
import { useNavigate } from "react-router-dom";

const Header = ({ user }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-br from-purple-800/50 to-blue-800/50 backdrop-blur-xl border-b border-cyan-300/20 px-6 py-3 flex justify-between items-center fixed w-full top-0 z-50 shadow-2xl">
      <h1 
        className="text-2xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent cursor-pointer hover:scale-105 transition-transform"
        onClick={() => navigate("/home")}
      >
        SkillHub
      </h1>
      
      <div className="flex items-center space-x-6">
        <button 
          onClick={() => navigate("/home")}
          className="text-cyan-300 hover:text-cyan-100 px-4 py-2 rounded-xl hover:bg-cyan-500/10 transition-all"
        >
          Home
        </button>
        <button 
          onClick={() => navigate("/notifications")}
          className="text-cyan-300 hover:text-cyan-100 px-4 py-2 rounded-xl hover:bg-cyan-500/10 transition-all"
        >
          Notifications
        </button>
        <button 
          onClick={() => navigate("/friends")}
          className="text-cyan-300 hover:text-cyan-100 px-4 py-2 rounded-xl hover:bg-cyan-500/10 transition-all"
        >
          Friends
        </button>

        {user && (
          <div 
            onClick={() => navigate("/profile")}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-cyan-400/20 blur-xl rounded-full" />
              <img
                src={`http://localhost:8080${user.profilePic}`}
                alt="Profile"
                className="w-10 h-10 rounded-full border-2 border-cyan-300/50 relative z-10 group-hover:border-cyan-400 transition-all"
              />
            </div>
            <span className="text-sm bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent font-semibold group-hover:scale-105 transition-transform">
              View Profile
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;