import React, { useState } from "react";

const PostCardWithReactions = ({ post, userId, userName, token, onUpdate, showControls, onEdit, onDelete }) => {
  const [comment, setComment] = useState("");
  const [isCommenting, setIsCommenting] = useState(false);
  const [commentError, setCommentError] = useState(null);
  const [showComments, setShowComments] = useState(false);
  const reactionOptions = ["❤️", "👍", "😂", "😮", "😢", "😡"];

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
    if (!comment.trim()) {
      setCommentError("Comment cannot be empty");
      return;
    }
    setIsCommenting(true);
    setCommentError(null);
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
      setShowComments(true);
      onUpdate();
    } catch (err) {
      setCommentError("Failed to post comment");
      console.error("Comment error", err);
    } finally {
      setIsCommenting(false);
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
        <div
          key={index}
          className="relative rounded-md overflow-hidden border border-gray-200"
          role="figure"
          aria-label={`Video ${index + 1} for post`}
        >
          <video
            src={fullUrl}
            controls
            className="w-full aspect-[16/9] object-cover bg-gray-100"
            onError={(e) => (e.target.nextSibling.style.display = "block")}
            aria-label="Post video"
          />
          <div className="hidden text-gray-700 text-sm p-2 bg-gray-200">
            Video failed to load
          </div>
        </div>
      ) : (
        <div
          key={index}
          className="relative rounded-md overflow-hidden border border-gray-200"
          role="figure"
          aria-label={`Image ${index + 1} for post`}
        >
          <img
            src={fullUrl}
            alt={`Post ${index + 1}`}
            className="w-full aspect-[16/9] object-cover bg-gray-100"
            onError={(e) => (e.target.nextSibling.style.display = "block")}
          />
          <div className="hidden text-gray-700 text-sm p-2 bg-gray-200">
            Image failed to load
          </div>
        </div>
      );
    });
  };

  return (
    <div
      className="bg-gray-50 border border-gray-200 rounded-xl shadow-md p-6 mb-6 w-full max-w-lg mx-auto sm:max-w-full sm:mx-2 hover:border-teal-300 transition-all"
      role="region"
      aria-label="Post card with reactions"
    >
      {/* Header with Profile Picture and Username */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden">
          <img
            src={`https://ui-avatars.com/api/?name=${userName}&size=40`}
            alt={userName}
            className="w-full h-full object-cover"
          />
        </div>
        <span className="text-gray-900 text-base font-semibold">{userName}</span>
      </div>

      {post.mediaUrls?.length > 0 && (
        <div
          className="bg-white border border-gray-200 rounded-lg p-4 mb-4"
          role="region"
          aria-label="Post media"
        >
          <div className="grid grid-cols-1 gap-4">{renderMedia()}</div>
        </div>
      )}

      {post.content && (
        <div
          className="bg-white border border-gray-200 rounded-lg p-4 mb-4"
          role="region"
          aria-label="Post content"
        >
          <p className="text-gray-900 text-base font-semibold leading-relaxed line-clamp-4">
            {post.content}
          </p>
        </div>
      )}

      <div
        className="bg-white border border-gray-200 rounded-lg p-4 mb-4"
        role="region"
        aria-label="Post reactions"
      >
        <div
          className="flex flex-wrap gap-2 mb-4"
          role="group"
          aria-label="Reaction buttons"
        >
          {reactionOptions.map((emoji) => (
            <button
              key={emoji}
              onClick={() => handleReact(emoji)}
              className="text-lg sm:text-base p-2 hover:scale-125 transition-transform duration-200 hover:text-teal-400"
              aria-label={`React with ${emoji}`}
            >
              {emoji}
            </button>
          ))}
        </div>

        <div
          className="text-sm text-gray-700 flex flex-wrap gap-2"
          aria-live="polite"
        >
          {Object.entries(reactionSummary).map(([emoji, count]) => (
            <div
              key={emoji}
              className="px-3 py-1 bg-gray-100 rounded-full border border-gray-200"
            >
              {emoji} {count}
            </div>
          ))}
        </div>
      </div>

      <div
        className="bg-white border border-gray-200 rounded-lg p-4"
        role="region"
        aria-label="Post comments"
      >
        <button
          onClick={() => setShowComments(!showComments)}
          className="w-full px-4 py-2 bg-teal-400 text-white rounded-md hover:bg-teal-500 hover:scale-105 transition-all mb-4"
          aria-label={showComments ? "Hide comments" : "Show comments"}
          aria-expanded={showComments}
        >
          {showComments ? "Hide Comments" : `Show Comments (${post.comments?.length || 0})`}
        </button>

        {showComments && post.comments?.length > 0 && (
          <div
            className="space-y-2 mb-4"
            role="region"
            aria-label="Comments section"
          >
            {post.comments.map((c, i) => (
              <div
                key={i}
                className="p-3 bg-gray-100 rounded-lg border border-gray-200"
              >
                <strong className="text-teal-600">{c.userName}:</strong>
                <span className="ml-2 text-gray-700">{c.commentText}</span>
              </div>
            ))}
          </div>
        )}

        <div className="pt-3 border-t border-gray-200 space-y-4">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={comment}
                onChange={(e) => {
                  setComment(e.target.value);
                  setCommentError(null);
                }}
                placeholder="Write a comment..."
                className={`w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-teal-400 ${commentError ? "animate-shake border-red-500" : ""
                  }`}
                aria-label="Comment input"
                disabled={isCommenting}
              />
              {commentError && (
                <p className="absolute text-xs text-red-500 mt-1" role="alert">
                  {commentError}
                </p>
              )}
            </div>
            <button
              onClick={handleComment}
              className="px-6 py-2 bg-teal-400 text-white rounded-md hover:bg-teal-500 hover:scale-105 transition-all disabled:opacity-50"
              aria-label="Submit comment"
              disabled={isCommenting}
            >
              {isCommenting ? "Posting..." : "Comment"}
            </button>
          </div>

          {showControls && (
            <div className="flex justify-end gap-3">
              <button
                onClick={onEdit}
                className="text-sm px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 hover:scale-105 transition-transform"
                aria-label="Edit post"
              >
                Edit
              </button>
              <button
                onClick={onDelete}
                className="text-sm px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 hover:scale-105 transition-transform"
                aria-label="Delete post"
              >
                Delete
              </button>
            </div>
          )}

          <p className="text-xs text-gray-500 font-mono mt-2">
            {new Date(post.createdAt).toLocaleString("en-US", {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
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

export default PostCardWithReactions;
