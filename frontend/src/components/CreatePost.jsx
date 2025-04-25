import React, { useState } from "react";

const CreatePost = ({ userId, onPostCreated }) => {
  const [content, setContent] = useState("");
  const [media, setMedia] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleMediaChange = (e) => {
    const files = Array.from(e.target.files);
    setMedia(files);
    setPreviewUrls(files.map(file => URL.createObjectURL(file)));
  };

  const handleSubmit = async () => {
    if (!content && media.length === 0) return alert("Please add text or media.");

    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("content", content);
    media.forEach((file) => formData.append("media", file));

    setUploading(true);
    try {
      const res = await fetch("http://localhost:8080/api/posts/create", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.ok) {
        const post = await res.json();
        onPostCreated(post);
        setContent("");
        setMedia([]);
        setPreviewUrls([]);
      } else {
        alert("Failed to create post");
      }
    } catch (error) {
      console.error("Post error:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-800/50 to-blue-800/50 backdrop-blur-xl border border-cyan-300/20 rounded-3xl shadow-2xl p-6 mb-6 animate-fadeInUp">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full px-4 py-3 bg-purple-900/30 border-2 border-cyan-300/20 rounded-xl text-cyan-100 placeholder-cyan-200/50 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all mb-4"
        placeholder="What's sparkling in your mind?"
        rows={3}
      />
      
      <div className="relative group mb-4">
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-cyan-300/20 rounded-xl cursor-pointer hover:border-cyan-400/40 transition-all">
          <div className="flex flex-col items-center text-cyan-300/80">
            <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-sm">Upload photos/videos</span>
          </div>
          <input
            type="file"
            multiple
            accept="image/*,video/*"
            onChange={handleMediaChange}
            className="hidden"
          />
        </label>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4">
        {previewUrls.map((url, i) => (
          <div key={i} className="relative aspect-square overflow-hidden rounded-xl border-2 border-cyan-300/20 group">
            {url.match(/\.mp4|\.webm/) ? (
              <video 
                src={url} 
                controls 
                className="w-full h-full object-cover bg-purple-900/30"
              />
            ) : (
              <img 
                src={url} 
                alt="preview" 
                className="w-full h-full object-cover bg-purple-900/30"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-purple-900/50 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        disabled={uploading}
        className="w-full bg-gradient-to-br from-cyan-500 to-blue-600 text-white font-bold py-3 rounded-xl shadow-2xl hover:shadow-3xl transform transition-all duration-300 hover:-translate-y-1 hover:scale-105 active:scale-95"
      >
        {uploading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Posting...
          </span>
        ) : (
          "Spark Post"
        )}
      </button>
    </div>
  );
};

export default CreatePost;