import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// Debounce utility to limit API calls
const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

/**
 * Header component provides navigation, search, and user profile access.
 * Applies Miller's Law by limiting navigation links to 5-7 items for cognitive ease.
 * Uses a light theme to align with Home, PostCardWithReactions, and AddStory.
 * @param {Object} props - Component props
 * @param {Object} props.user - User data (fullName, profilePic)
 */
const Header = ({ user }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [searchError, setSearchError] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  /**
   * Closes search results when clicking outside the search box.
   */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".search-box")) {
        setResults([]);
        setSearchError(null);
      }
      if (!e.target.closest(".mobile-menu")) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  /**
   * Searches for users via API with debouncing and error handling.
   */
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

  /**
   * Toggles the mobile menu visibility.
   */
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  // Navigation links limited to 5 to adhere to Miller's Law
  const navLinks = [
    { label: "Dashboard", route: "/dashboard" },
    { label: "Home", route: "/home" },
    { label: "Explore", route: "/explore-plans" },
    { label: "Groups", route: "/groups" },
    { label: "My Plans", route: "/learning-plans" },
  ];

  return (
    <nav
      role="navigation"
      className="bg-gray-50 border-b border-gray-200 px-6 py-3 flex justify-between items-center fixed w-full top-0 z-50 shadow-md"
    >
      {/* Logo */}
      <h1
        className="text-2xl font-extrabold text-teal-600 cursor-pointer hover:scale-105 transition-transform"
        onClick={() => navigate("/dashboard")}
        aria-label="Go to Dashboard"
      >
        SkillHub
      </h1>

      {/* Navigation Links and Search */}
      <div className="flex items-center space-x-4 relative mobile-menu">
        {/* Desktop Navigation Links */}
        <div className="hidden md:flex space-x-4">
          {navLinks.map((item, idx) => (
            <button
              key={idx}
              onClick={() => navigate(item.route)}
              className={`text-gray-700 px-4 py-2 rounded-xl hover:bg-teal-100 hover:text-teal-600 transition-all ${
                location.pathname === item.route ? "bg-teal-400 text-white" : ""
              }`}
              aria-label={`Go to ${item.label}`}
              aria-current={location.pathname === item.route ? "page" : undefined}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-gray-700 hover:text-teal-600 p-2 rounded-xl"
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
          aria-expanded={isMobileMenuOpen}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="absolute top-14 right-0 bg-gray-50 rounded-xl shadow-md w-48 z-50 border border-gray-200 md:hidden">
            {navLinks.map((item, idx) => (
              <button
                key={idx}
                onClick={() => {
                  navigate(item.route);
                  setIsMobileMenuOpen(false);
                }}
                className={`block w-full text-left text-gray-700 px-4 py-2 hover:bg-teal-100 hover:text-teal-600 transition-all ${
                  location.pathname === item.route ? "bg-teal-400 text-white" : ""
                }`}
                aria-label={`Go to ${item.label}`}
                aria-current={location.pathname === item.route ? "page" : undefined}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}

        {/* Search Bar */}
        <div className="relative search-box">
          <div className="flex items-center bg-gray-100 border border-gray-200 rounded-xl hover:border-teal-400 transition-all">
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
              className="px-4 py-2 bg-transparent text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-400 w-36 sm:w-48 md:w-64 rounded-xl"
              aria-label="Search users"
            />
            <svg className="w-5 h-5 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {(results.length > 0 || searchError) && (
            <div
              className="absolute top-14 left-0 bg-gray-50 rounded-2xl shadow-md w-64 z-50 max-h-60 overflow-y-auto border border-gray-200"
              aria-live="polite"
            >
              {results.length > 0 ? (
                results.map((u) => (
                  <div
                    key={u.id}
                    className="flex items-center p-3 hover:bg-teal-100 cursor-pointer transition-all"
                    onClick={() => navigate(`/public-profile/${u.id}`)}
                    role="option"
                    aria-selected="false"
                    aria-label={`View profile of ${u.name}`}
                  >
                    <div className="relative mr-3">
                      <img
                        src={`http://localhost:8080${u.profilePic || "/default-avatar.png"}`}
                        alt={u.name}
                        className="w-8 h-8 rounded-full border border-gray-200"
                        onError={(e) => {
                          e.target.src = "/default-avatar.png";
                        }}
                      />
                    </div>
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

        {/* Profile Avatar */}
        {user && (
          <div
            onClick={() => navigate("/profile")}
            className="flex items-center space-x-3 cursor-pointer hover:scale-105 transition-transform"
            aria-label={`View profile of ${user.fullName}`}
            role="button"
          >
            <div className="relative">
              <img
                src={`http://localhost:8080${user.profilePic || "/default-avatar.png"}`}
                alt={user.fullName}
                className="w-10 h-10 rounded-full border-2 border-gray-200 hover:border-teal-400 transition-all"
                onError={(e) => {
                  e.target.src = "/default-avatar.png";
                }}
              />
            </div>
            <span className="hidden md:block text-sm text-teal-600 font-semibold">
              View Profile
            </span>
          </div>
        )}
      </div>

      <style jsx="true">{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(5deg); }
        }
      `}</style>
    </nav>
  );
};

export default Header;
