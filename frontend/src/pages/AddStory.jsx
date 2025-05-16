import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * AddStory component allows users to create a new story with text and media.
 * Uses a light theme to align with Home, PostCardWithReactions, and AccountSettings components.
 */
const AddStory = () => {
  const navigate = useNavigate();
  const [media, setMedia] = useState(null);
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Validates the story input (text and media).
   * @returns {string|null} Error message if validation fails, null if valid
   */
  const validateStory = () => {
    if (!text.trim() && !media) {
      return "Please add text or media to your story";
    }
    if (text.length > 500) {
      return "Story text cannot exceed 500 characters";
    }
    if (media) {
      const validTypes = ["image/jpeg", "image/png", "video/mp4", "video/webm"];
      if (!validTypes.includes(media.type)) {
        return "Only JPEG/PNG images or MP4/WebM videos are allowed";
      }
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (media.size > maxSize) {
        return "Media file size cannot exceed 10MB";
      }
    }
    return null;
  };

  /**
   * Handles file selection for media (image/video).
   * @param {Event} e - File input change event
   */
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setMedia(file);
    setError(null);
  };

  /**
   * Submits the story via API with validation and error handling.
   * @param {Event} e - Form submit event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("userEmail");
    const userId = localStorage.getItem("userId");

    if (!userId || !email || !token) {
      setError("User not authenticated");
      navigate("/login");
      return;
    }

    const validationError = validateStory();
    if (validationError) {
      setError(validationError);
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
        navigate("/home");
      } else {
        const text = await res.text();
        throw new Error(text || "Failed to add story");
      }
    } catch (err) {
      setError(err.message || "Error submitting story");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div
        className="bg-gray-50 border border-gray-200 rounded-xl shadow-md p-6 w-full max-w-lg mx-auto sm:max-w-full sm:mx-2"
        role="region"
        aria-label="Create story"
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
              className={`w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-teal-400 transition-all resize-none ${
                error ? "animate-shake border-red-500" : ""
              }`}
              rows="4"
              maxLength="500"
              aria-label="Story text input"
            />
            {error && (
              <p className="text-xs text-red-500 mt-1" role="alert" aria-live="polite">
                {error}
              </p>
            )}
          </div>

          <div className="relative">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-200 rounded-lg cursor-pointer hover:border-teal-400 transition-all">
              <div className="flex flex-col items-center text-gray-500">
                <svg
                  className="w-8 h-8 mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-sm">
                  {media ? media.name : "Click to upload image or video"}
                </span>
              </div>
              <input
                type="file"
                accept="image/jpeg,image/png,video/mp4,video/webm"
                onChange={handleFileChange}
                className="hidden"
                aria-label="Upload story media"
                disabled={isSubmitting}
              />
            </label>
          </div>

          <button
            type="submit"
            className={`w-full px-4 py-2 bg-teal-400 text-white rounded-md hover:bg-teal-500 hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
            disabled={isSubmitting}
            aria-label="Publish story"
          >
            {isSubmitting ? "Publishing..." : "Publish Story"}
          </button>
        </form>
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

export default AddStory;
