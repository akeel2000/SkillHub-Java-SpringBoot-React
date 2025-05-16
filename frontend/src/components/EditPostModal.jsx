import React, { useState } from "react";
import { FiX, FiUpload, FiTrash2 } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const EditPostModal = ({ post, onClose, onUpdate }) => {
  const [content, setContent] = useState(post.content || "");
  const [media, setMedia] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleMediaChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => {
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/webm'];
      const maxSize = 10 * 1024 * 1024;
      return validTypes.includes(file.type) && file.size <= maxSize;
    });

    if (validFiles.length === 0) {
      setError("Please upload valid images or videos (max 10MB)");
      return;
    }

    setMedia(validFiles);
    setPreviewUrls(validFiles.map(file => URL.createObjectURL(file)));
    setError(null);
  };

  const handleUpdate = async () => {
    if (!content.trim() && media.length === 0) {
      setError("Please add text or media");
      return;
    }

    const formData = new FormData();
    formData.append("content", content);
    media.forEach((file) => formData.append("media", file));

    try {
      setUploading(true);
      const res = await fetch(`http://localhost:8080/api/posts/${post.id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: formData,
      });

      if (!res.ok) throw new Error("Update failed");
      const updatedPost = await res.json();
      onUpdate(updatedPost);
      onClose();
    } catch (err) {
      setError(err.message || "Error updating post");
    } finally {
      setUploading(false);
    }
  };

  const removeMedia = (index) => {
    URL.revokeObjectURL(previewUrls[index]);
    setMedia(media.filter((_, i) => i !== index));
    setPreviewUrls(previewUrls.filter((_, i) => i !== index));
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/30 backdrop-blur-md z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ type: "spring", damping: 25 }}
          className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800">Edit Post</h2>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Close"
            >
              <FiX className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-5 space-y-4">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-100 outline-none transition-all resize-none"
              placeholder="What would you like to update?"
            />

            {/* Media Previews */}
            {previewUrls.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {previewUrls.map((url, i) => (
                  <div key={i} className="relative aspect-square group">
                    {url.match(/video/) ? (
                      <video
                        src={url}
                        controls
                        className="w-full h-full object-cover rounded-lg bg-gray-100"
                      />
                    ) : (
                      <img
                        src={url}
                        alt=""
                        className="w-full h-full object-cover rounded-lg bg-gray-100"
                      />
                    )}
                    <button
                      onClick={() => removeMedia(i)}
                      className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-white"
                    >
                      <FiTrash2 className="h-4 w-4 text-red-500" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* File Upload */}
            <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-200 rounded-xl hover:border-teal-400 transition-colors">
              <label className="flex flex-col items-center justify-center cursor-pointer">
                <div className="p-3 bg-teal-50 rounded-full mb-3">
                  <FiUpload className="h-6 w-6 text-teal-500" />
                </div>
                <span className="text-sm font-medium text-gray-600 mb-1">
                  {media.length > 0 ? 'Add more files' : 'Upload photos/videos'}
                </span>
                <span className="text-xs text-gray-400">PNG, JPG, MP4 up to 10MB</span>
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleMediaChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-red-50 text-red-600 rounded-lg flex items-start text-sm"
              >
                <FiX className="h-4 w-4 mt-0.5 mr-2 flex-shrink-0" />
                {error}
              </motion.div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 p-5 border-t border-gray-100">
            <button
              onClick={onClose}
              disabled={uploading}
              className="px-5 py-2.5 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdate}
              disabled={uploading || (!content.trim() && media.length === 0)}
              className={`px-5 py-2.5 rounded-lg font-medium transition-all ${
                uploading || (!content.trim() && media.length === 0)
                  ? 'bg-teal-200 text-white cursor-not-allowed'
                  : 'bg-teal-600 text-white hover:bg-teal-700 shadow-md hover:shadow-lg'
              }`}
            >
              {uploading ? (
                <span className="flex items-center justify-center">
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"
                  />
                  Updating...
                </span>
              ) : (
                'Update Post'
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EditPostModal;
