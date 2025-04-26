import React, { useState } from "react";

/**
 * AddPost component allows users to create a new post with optional text content and media files.
 * Users can preview selected media before submitting the post.
 */
const AddPost = () => {
  const [content, setContent] = useState(""); // State to store the post's text content
  const [media, setMedia] = useState([]); // State to store selected media files
  const [previewUrls, setPreviewUrls] = useState([]); // State to store preview URLs for media files

  /**
   * Handles file input changes, updates the media state, and generates preview URLs.
   * @param {Event} e - The file input change event.
   */
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setMedia(files);
    setPreviewUrls(files.map(file => URL.createObjectURL(file))); // Generate preview URLs
  };

  /**
   * Submits the post data (content and media) to the server.
   * Sends a POST request with form data including userId, content, and media files.
   */
  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("userId", localStorage.getItem("userId")); // Add userId from localStorage
    formData.append("content", content); // Add post content
    media.forEach(file => formData.append("media", file)); // Add media files

    const res = await fetch("http://localhost:8080/api/posts/create", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}` // Add authorization token
      },
      body: formData
    });

    if (res.ok) {
      alert("Post created!"); // Notify success
      window.location.href = "/home"; // Redirect to home page
    } else {
      alert("Post failed"); // Notify failure
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto mt-20 bg-white rounded-xl shadow-lg space-y-4">
      {/* Textarea for entering post content */}
      <textarea
        placeholder="What's on your mind?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-lg"
        rows="4"
      />

      {/* File input for selecting media files */}
      <input
        type="file"
        multiple
        accept="image/*,video/*"
        onChange={handleFileChange}
      />

      {/* Preview section for selected media files */}
      <div className="flex space-x-2 overflow-x-auto">
        {previewUrls.map((url, i) =>
          url.match(/video/) ? (
            <video key={i} src={url} width={80} controls />
          ) : (
            <img key={i} src={url} alt="preview" className="w-20 h-20 object-cover" />
          )
        )}
      </div>

      {/* Button to submit the post */}
      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
      >
        Share
      </button>
    </div>
  );
};

export default AddPost;
