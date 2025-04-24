import React from "react";

const PostCard = ({ post, onEdit, onDelete }) => {
  const renderMedia = () => {
    return post.mediaUrls?.map((url, index) => {
      const type = post.mediaTypes?.[index] || "image";
      const fullUrl = `http://localhost:8080${url}`;

      return type === "video" ? (
        <div key={index} className="relative group rounded-xl overflow-hidden border border-cyan-300/20 mb-2">
          <video
            src={fullUrl}
            controls
            className="w-full h-40 object-cover bg-purple-900/30"
            onError={(e) => (e.target.style.display = "none")}
          />
        </div>
      ) : (
        <div key={index} className="relative group rounded-xl overflow-hidden border border-cyan-300/20 mb-2">
          <img
            src={fullUrl}
            alt="media"
            className="w-full h-40 object-cover bg-purple-900/30"
            onError={(e) => (e.target.style.display = "none")}
          />
        </div>
      );
    });
  };

  return (
    <div className="bg-gradient-to-br from-purple-800/50 to-blue-800/50 backdrop-blur-xl border border-cyan-300/20 rounded-xl shadow-lg p-4 mb-4 w-full max-w-md mx-auto hover:border-cyan-300/40 transition-all">
      {post.content && (
        <p className="text-cyan-100 text-sm mb-3 leading-snug line-clamp-4">
          {post.content}
        </p>
      )}
      
      {post.mediaUrls?.length > 0 && (
        <div className="grid grid-cols-1 gap-2 mb-3">
          {renderMedia()}
        </div>
      )}

      <div className="pt-2 border-t border-cyan-300/20">
        <p className="text-xs text-cyan-300/60 font-mono">
          {new Date(post.createdAt).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </p>

        {/* Buttons */}
        <div className="flex justify-end gap-2 mt-2">
          <button
            onClick={() => onEdit(post)}
            className="text-xs px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(post.id)}
            className="text-xs px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
