import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddStory = () => {
  const navigate = useNavigate(); // Hook for navigation
  const [media, setMedia] = useState(null); // State to store the selected media file
  const [text, setText] = useState(""); // State to store the story's text content

  /**
   * Handles file input changes and updates the media state.
   * @param {Event} e - The file input change event.
   */
  const handleFileChange = (e) => {
    setMedia(e.target.files[0]); // Store the selected file
  };

  /**
   * Submits the story data (text and media) to the server.
   * Includes user authentication checks and sends a POST request with the story data.
   * Redirects to the login page if the user is not authenticated.
   * @param {Event} e - The form submission event.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("userEmail");
    const userId = localStorage.getItem("userId");

    // Check if the user is authenticated
    if (!userId || !email || !token) {
      alert("User not authenticated");
      navigate("/login"); // Redirect to login page
      return;
    }

    // Prepare the form data for submission
    const formData = new FormData();
    formData.append("email", email);
    formData.append("userId", userId);
    if (media) formData.append("media", media); // Add media if provided
    if (text) formData.append("text", text); // Add text if provided

    try {
      // Send the POST request to the server
      const res = await fetch("http://localhost:8080/api/stories", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }, // Include the authorization token
        body: formData,
      });

      if (res.ok) {
        alert("Story added successfully!"); // Notify success
        navigate("/home"); // Redirect to the home page
      } else {
        alert("Failed to add story"); // Notify failure
      }
    } catch (err) {
      alert("Error submitting story"); // Notify error
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Floating decorative background elements */}
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

      {/* Main content section */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
        <div className="bg-gradient-to-br from-purple-800/50 to-blue-800/50 backdrop-blur-xl border border-cyan-300/20 rounded-3xl shadow-2xl w-full max-w-lg p-8 animate-fadeInUp relative">
          {/* Close button to navigate back to the home page */}
          <button
            onClick={() => navigate("/home")}
            className="absolute top-4 right-4 text-cyan-300 hover:text-cyan-100 transition-colors z-20"
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

          {/* Header for the story creation form */}
          <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Create Story
          </h2>

          {/* Story creation form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Textarea for entering the story text */}
            <div className="relative group">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Share your story..."
                className="w-full px-4 py-3 bg-purple-900/30 border-2 border-cyan-300/20 rounded-xl text-cyan-100 placeholder-cyan-200/50 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all resize-none"
                rows="4"
              />
              <div className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            {/* File input for uploading media */}
            <div className="relative group">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-cyan-300/20 rounded-xl cursor-pointer hover:border-cyan-400/40 transition-all">
                <div className="flex flex-col items-center text-cyan-300/80">
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
                />
              </label>
            </div>

            {/* Submit button to publish the story */}
            <button
              type="submit"
              className="w-full bg-gradient-to-br from-cyan-500 to-blue-600 text-white font-bold py-3 rounded-xl shadow-2xl hover:shadow-3xl transform transition-all duration-300 hover:-translate-y-1 hover:scale-105 active:scale-95"
            >
              Publish Story
            </button>
          </form>
        </div>
      </div>

      {/* Global styles for animations */}
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
          animation: fadeInUp 1s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default AddStory;
