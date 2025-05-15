import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * AddStory component allows users to create a new story with text and media.
 * Uses a light theme to align with Home and PostCardWithReactions components.
 */
const AddStory = () => {
  const navigate = useNavigate();
  const [media, setMedia] = useState(null);
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Handles file selection for media (image/video).
   * @param {Event} e - File input change event
   */
  const handleFileChange = (e) => {
    setMedia(e.target.files[0]);
    setError(null);
  };

  /**
   * Submits the story via API with validation and error handling.
   * Requires at least text or media.
   * @param {Event} e - Form submit event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("userEmail");
    const userId = localStorage.getItem("userId");

    if (!userId || !email || !token) {
      alert("User not authenticated");
      navigate("/login");
      return;
    }

    if (!text.trim() && !media) {
      setError("Please add text or media to your story");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const formData = new FormData();
    formData.append("email", email);
    formData.append("userId", userId);
    if (media) formData.append("media", media);
    if (text) formData.append("text", text.trim());

    try {
      const res = await fetch("http://localhost:8080/api/stories", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (res.ok) {
        alert("Story added successfully!");
        navigate("/home");
      } else {
        throw new Error("Failed to add story");
      }
    } catch (err) {
      setError("Error submitting story");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 relative overflow-hidden">
      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
        <div className="bg-gray-50 border border-gray-200 rounded-3xl shadow-md w-full max-w-lg p-8">
          {/* Close Button */}
          <button
            onClick={() => navigate("/home")}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 transition-colors"
            aria-label="Close story creation"
          >
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <h2 className="text-3xl font-bold mb-6 text-center text-gray-900">
            Create Story
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <textarea
                value={text}
                onChange={(e) => {
                  setText(e.target.value);
                  setError(null);
                }}
                placeholder="Share your story..."
                className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400 transition-all resize-none"
                rows="4"
                aria-label="Story text input"
              />
              {error && (
                <p className="text-xs text-red-500 mt-1" aria-live="polite">
                  {error}
                </p>
              )}
            </div>

            <div className="relative">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-teal-400 transition-all">
                <div className="flex flex-col items-center text-gray-500">
                  <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm">
                    {media ? media.name : "Click to upload media"}
                  </span>
                </div>
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleFileChange}
                  className="hidden"
                  aria-label="Upload story media"
                />
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-teal-400 text-white font-bold py-3 rounded-xl hover:bg-teal-500 hover:scale-105 transition-all disabled:opacity-50"
              disabled={isSubmitting}
              aria-label="Publish story"
            >
              {isSubmitting ? "Publishing..." : "Publish Story"}
            </button>
          </form>
        </div>
      </div>

      <style jsx global>{`
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

export default AddStory;
