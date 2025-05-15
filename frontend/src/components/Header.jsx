import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FiHome,
  FiCompass,
  FiUsers,
  FiBook,
  FiGrid,
  FiUser,
  FiSearch,
  FiX,
  FiMenu
} from "react-icons/fi";

const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

const Header = ({ user }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [searchError, setSearchError] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".search-box")) {
        setResults([]);
        setSearchError(null);
      }
      if (!e.target.closest(".sidebar") && !e.target.closest(".mobile-toggle")) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleSearch = debounce(async () => {
    if (!searchTerm.trim()) {
      setSearchError("Please enter a search term");
      setResults([]);
      return;
    }

    try {
      const res = await fetch(`http://localhost:8080/api/auth/search?name=${encodeURIComponent(searchTerm.trim())}`);
      if (res.ok) {
        const data = await res.json();
        setResults(data);
        setSearchError(data.length === 0 ? "No results found" : null);
      } else {
        throw new Error("Search failed");
      }
    } catch (error) {
      setSearchError("Failed to search users");
      console.error("Search failed", error);
    }
  }, 300);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const navLinks = [
    { label: "Dashboard", route: "/dashboard", icon: <FiGrid className="mr-3" /> },
    { label: "Home", route: "/home", icon: <FiHome className="mr-3" /> },
    { label: "Explore", route: "/explore-plans", icon: <FiCompass className="mr-3" /> },
    { label: "Groups", route: "/groups", icon: <FiUsers className="mr-3" /> },
    { label: "My Plans", route: "/learning-plans", icon: <FiBook className="mr-3" /> },
  ];

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        className="fixed top-4 left-4 z-50 md:hidden text-gray-700 hover:text-teal-600 p-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition-all mobile-toggle"
        onClick={toggleMobileMenu}
        aria-label="Toggle sidebar menu"
        aria-expanded={isMobileMenuOpen}
      >
        {isMobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen bg-gray-50 border-r border-gray-200 shadow-md z-40 transition-transform duration-300 ${
          isMobileMenuOpen ? "translate-x-0 w-full sm:w-64" : "-translate-x-full md:translate-x-0 md:w-64"
        } sidebar`}
        role="navigation"
        aria-label="Main navigation"
        aria-hidden={!isMobileMenuOpen && "true"}
      >
        <div className="flex flex-col h-full p-6 space-y-4">
          {/* Logo Container */}
          <div
            className="bg-white border border-gray-200 rounded-lg p-4"
            role="region"
            aria-label="Logo"
          >
            <h1
              className="text-2xl font-extrabold text-teal-600 cursor-pointer hover:scale-105 transition-transform"
              onClick={() => {
                navigate("/dashboard");
                setIsMobileMenuOpen(false);
              }}
              aria-label="Go to Dashboard"
            >
              SkillHub
            </h1>
          </div>

          {/* Search Container */}
          <div
            className="bg-white border border-gray-200 rounded-lg p-4 relative search-box"
            role="region"
            aria-label="Search users"
          >
            <div className="flex items-center bg-gray-100 border border-gray-200 rounded-md hover:border-teal-400 transition-all">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  handleSearch();
                }}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                onFocus={handleSearch}
                placeholder="Search users..."
                className="px-4 py-2 bg-transparent text-gray-900 placeholder-gray-500 focus:outline-none w-full rounded-md"
                aria-label="Search users input"
              />
              <FiSearch className="w-5 h-5 mr-3 text-gray-500" />
            </div>

            {(results.length > 0 || searchError) && (
              <div
                className="absolute top-full left-0 mt-2 bg-gray-50 rounded-lg shadow-md w-full max-h-60 overflow-y-auto border border-gray-200 z-50"
                aria-live="polite"
              >
                {results.length > 0 ? (
                  results.map((u) => (
                    <div
                      key={u.id}
                      className="flex items-center p-3 hover:bg-teal-100 cursor-pointer transition-all"
                      onClick={() => {
                        navigate(`/public-profile/${u.id}`);
                        setIsMobileMenuOpen(false);
                      }}
                      role="option"
                      aria-selected="false"
                      aria-label={`View profile of ${u.name}`}
                    >
                      <img
                        src={`http://localhost:8080${u.profilePic || "/default-avatar.png"}`}
                        alt={u.name}
                        className="w-8 h-8 rounded-full border border-gray-200 mr-3"
                        onError={(e) => (e.target.src = "/default-avatar.png")}
                      />
                      <span className="text-gray-900 text-sm font-medium hover:text-teal-600">
                        {u.name}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="p-3 text-gray-500 text-sm">{searchError}</div>
                )}
              </div>
            )}
          </div>

          {/* Navigation Links Container */}
          <div
            className="bg-white border border-gray-200 rounded-lg p-4 flex-1 overflow-y-auto"
            role="region"
            aria-label="Navigation links"
          >
            {navLinks.map((item, idx) => (
              <button
                key={idx}
                onClick={() => {
                  navigate(item.route);
                  setIsMobileMenuOpen(false);
                }}
                className={`flex items-center w-full text-left text-gray-700 px-4 py-2 mb-2 rounded-md hover:bg-gray-300 transition-all ${
                  location.pathname === item.route ? "bg-teal-400 text-white hover:bg-teal-400" : "bg-gray-200"
                }`}
                aria-label={`Go to ${item.label}`}
                aria-current={location.pathname === item.route ? "page" : undefined}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>

          {/* Profile Container */}
          {user && (
            <div
              className="bg-white border border-gray-200 rounded-lg p-4"
              role="region"
              aria-label="User profile"
            >
              <div
                onClick={() => {
                  navigate("/profile");
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center space-x-3 cursor-pointer hover:bg-gray-200 rounded-md p-2 transition-all"
                aria-label={`View profile of ${user.fullName}`}
                role="button"
              >
                <img
                  src={`http://localhost:8080${user.profilePic || "/default-avatar.png"}`}
                  alt={user.fullName}
                  className="w-10 h-10 rounded-full border-2 border-gray-200 hover:border-teal-400 transition-all"
                  onError={(e) => (e.target.src = "/default-avatar.png")}
                />
                <div className="flex items-center">
                  <FiUser className="mr-2" />
                  <span className="text-gray-900 text-sm font-medium">View Profile</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Wrapper */}
      <div className="min-h-screen ml-0 md:ml-64 overflow-y-auto pt-16 md:pt-0 z-10">
        {/* Placeholder for child components */}
      </div>

      {/* Overlay for Mobile Sidebar */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        ></div>
      )}

      <style jsx global>{`
        html {
          scroll-behavior: smooth;
        }
        .sidebar {
          overscroll-behavior: contain;
        }
      `}</style>
    </>
  );
};

export default Header;
