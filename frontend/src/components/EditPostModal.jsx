import React, { useState, useEffect } from "react";

const EditPostModal = ({ post, onClose, onUpdate }) => {
  const [content, setContent] = useState(post.content || "");
  const [media, setMedia] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleMediaChange = (e) => {
    setMedia(Array.from(e.target.files));
  };

  const handleUpdate = async () => {
    const formData = new FormData();
    formData.append("content", content);
    if (media.length > 0) {
      media.forEach((file) => formData.append("media", file));
    }

    try {
      setUploading(true);
      const res = await fetch(`http://localhost:8080/api/posts/${post.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      if (res.ok) {
        const updatedPost = await res.json();
        onUpdate(updatedPost);
        onClose();
      } else {
        alert("Failed to update post");
      }
    } catch (err) {
      console.error("Update error", err);
      alert("Error updating post");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
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

      {/* Modal Content */}
      <div className="bg-gradient-to-br from-purple-800/50 to-blue-800/50 backdrop-blur-xl border border-cyan-300/20 rounded-2xl shadow-2xl w-full max-w-lg p-6 relative animate-fadeInUp">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full border-2 border-cyan-300/20 text-cyan-300 hover:border-cyan-400 hover:text-cyan-400 hover:bg-cyan-400/10 transition-all"
          aria-label="Close"
        >
          ×
        </button>

        <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          Edit Spark
        </h2>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          className="w-full px-4 py-3 bg-purple-900/30 border-2 border-cyan-300/20 rounded-xl text-cyan-100 placeholder-cyan-200/50 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all mb-4"
          placeholder="Revise your thoughts..."
        />

        <div className="relative group mb-4">
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-cyan-300/20 rounded-xl cursor-pointer hover:border-cyan-400/40 transition-all">
            <div className="flex flex-col items-center text-cyan-300/80">
              <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-sm">
                {media.length > 0 ? `${media.length} files selected` : "Update media"}
              </span>
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

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-6 py-2 border-2 border-cyan-300/20 text-cyan-300 rounded-xl hover:border-cyan-400 hover:text-cyan-400 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            disabled={uploading}
            className="px-6 py-2 bg-gradient-to-br from-cyan-500 to-blue-600 text-white font-bold rounded-xl shadow-2xl hover:shadow-3xl transform transition-all duration-300 hover:-translate-y-1 hover:scale-105 active:scale-95"
          >
            {uploading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Updating...
              </span>
            ) : (
              "Update Spark"
            )}
          </button>
        </div>
      </div>

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
          animation: fadeInUp 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default EditPostModal;