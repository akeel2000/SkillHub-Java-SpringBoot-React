import React, { useState } from "react";

const PostCardWithReactions = ({ post, userId, userName, token, onUpdate, showControls, onEdit, onDelete }) => {

  const [comment, setComment] = useState("");
  const reactionOptions = ["👍", "😂", "❤️", "😮", "😢", "😡"];

  const handleReact = async (emoji) => {
    try {
      await fetch(`http://localhost:8080/api/posts/${post.id}/react?userId=${userId}&reaction=${emoji}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      onUpdate();
    } catch (err) {
      console.error("Reaction error", err);
    }
  };

  const handleComment = async () => {
    if (!comment.trim()) return;
    try {
      await fetch(`http://localhost:8080/api/posts/${post.id}/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId,
          userName,
          commentText: comment.trim(),
        }),
      });
      setComment("");
      onUpdate();
    } catch (err) {
      console.error("Comment error", err);
    }
  };

  const getReactionSummary = () => {
    const counts = {};
    if (!post.reactions) return counts;
    for (const user in post.reactions) {
      const emoji = post.reactions[user];
      counts[emoji] = (counts[emoji] || 0) + 1;
    }
    return counts;
  };

  const reactionSummary = getReactionSummary();

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
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-purple-900/50 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      ) : (
        <div key={index} className="relative group rounded-xl overflow-hidden border border-cyan-300/20 mb-2">
          <img 
            src={fullUrl} 
            alt="media" 
            className="w-full h-40 object-cover bg-purple-900/30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-purple-900/50 opacity-0 group-hover:opacity-100 transition-opacity" />
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

      <div className="flex space-x-2 mb-2">
        {reactionOptions.map((emoji) => (
          <button 
            key={emoji} 
            onClick={() => handleReact(emoji)} 
            className="text-xl hover:scale-125 transition-transform duration-200 hover:text-cyan-400"
          >
            {emoji}
          </button>
        ))}
      </div>

      <div className="text-sm text-cyan-300/80 mb-3 flex flex-wrap gap-3">
        {Object.entries(reactionSummary).map(([emoji, count]) => (
          <div 
            key={emoji} 
            className="px-2 py-1 bg-purple-900/30 rounded-full border border-cyan-300/20"
          >
            {emoji} {count}
          </div>
        ))}
      </div>

      <div className="space-y-3 mb-3">
        {post.comments?.map((c, i) => (
          <div 
            key={i} 
            className="p-2 bg-purple-900/30 rounded-lg border border-cyan-300/20"
          >
            <strong className="text-cyan-400">{c.userName}:</strong>
            <span className="ml-2 text-cyan-100">{c.commentText}</span>
          </div>
        ))}
      </div>

      <div className="pt-2 border-t border-cyan-300/20">
        <div className="flex gap-2 mt-2">
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write a comment..."
            className="flex-1 px-3 py-1 bg-purple-900/30 border border-cyan-300/20 rounded-lg text-cyan-100 placeholder-cyan-200/50 focus:outline-none focus:border-cyan-400"
          />
          <button 
            onClick={handleComment} 
            className="px-4 py-1 bg-gradient-to-br from-cyan-500 to-blue-600 text-white rounded-lg hover:shadow-cyan-400/20 transition-all"
          >
            Comment
          </button>
        </div>

        {showControls && (
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onEdit} className="text-sm text-yellow-500 hover:underline">Edit</button>
          <button onClick={onDelete} className="text-sm text-red-500 hover:underline">Delete</button>
        </div>
      )}
        <p className="text-xs text-cyan-300/60 font-mono mt-2">
          {new Date(post.createdAt).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </p>
      </div>
    </div>
  );
};

export default PostCardWithReactions;