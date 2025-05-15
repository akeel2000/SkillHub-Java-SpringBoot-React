import React, { useState, useRef, useEffect } from "react";

const CreatePost = ({ userId, onPostCreated }) => {
  const [content, setContent] = useState("");
  const [media, setMedia] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  const handleMediaChange = (e) => {
    const files = Array.from(e.target.files);

    const validFiles = files.filter(file => {
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/webm'];
      const maxSize = 10 * 1024 * 1024;

      if (!validTypes.includes(file.type)) {
        setError(`Unsupported file type: ${file.type}`);
        return false;
      }

      if (file.size > maxSize) {
        setError(`File too large (max 10MB): ${file.name}`);
        return false;
      }

      return true;
    });

    if (validFiles.length === 0) return;

    setMedia(validFiles);
    setPreviewUrls(validFiles.map(file => URL.createObjectURL(file)));
    setError(null);
  };

  useEffect(() => {
    return () => {
      previewUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  const handleSubmit = async () => {
    if (!content.trim() && media.length === 0) {
      setError("Please add text or media");
      textareaRef.current?.focus();
      return;
    }

    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("content", content);
    media.forEach((file) => formData.append("media", file));

    setUploading(true);
    setError(null);

    try {
      const res = await fetch("http://localhost:8080/api/posts/create", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) throw new Error(res.statusText);

      const post = await res.json();
      onPostCreated(post);
      setContent("");
      setMedia([]);
      setPreviewUrls([]);
      setIsExpanded(false);
    } catch (err) {
      console.error("Post error:", err);
      setError(err.message || "Failed to create post");
    } finally {
      setUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const removeMedia = (index) => {
    const newMedia = [...media];
    const newUrls = [...previewUrls];

    URL.revokeObjectURL(newUrls[index]);
    newMedia.splice(index, 1);
    newUrls.splice(index, 1);

    setMedia(newMedia);
    setPreviewUrls(newUrls);
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-4 mb-6 transition-all duration-300 ${isExpanded ? 'max-h-[800px]' : 'max-h-[72px] overflow-hidden'}`}>
      <div
        className={`flex items-center space-x-3 cursor-pointer ${isExpanded ? 'hidden' : ''}`}
        onClick={() => {
          setIsExpanded(true);
          setTimeout(() => textareaRef.current?.focus(), 100);
        }}
      >
        <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-blue-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </div>
        <span className="text-gray-500">What's on your mind?</span>
      </div>

      <div className={`space-y-4 ${!isExpanded ? 'hidden' : ''}`}>
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex-shrink-0"></div>
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
            placeholder="Share your thoughts..."
            rows={3}
            aria-label="Post content"
          />
        </div>

        {previewUrls.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 ml-13">
            {previewUrls.map((url, i) => (
              <div key={i} className="relative aspect-square overflow-hidden rounded-lg border border-gray-200 group">
                {url.match(/video/) ? (
                  <video
                    src={url}
                    controls
                    className="w-full h-full object-cover bg-gray-100"
                    aria-label={`Video preview ${i + 1}`}
                  />
                ) : (
                  <img
                    src={url}
                    alt=""
                    className="w-full h-full object-cover bg-gray-100"
                    aria-hidden="true"
                  />
                )}
                <button
                  onClick={() => removeMedia(i)}
                  className="absolute top-2 right-2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center text-gray-700 hover:bg-white transition-colors shadow-sm"
                  aria-label={`Remove media ${i + 1}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="px-4 py-2 bg-red-50 text-red-600 rounded-lg flex items-center ml-13">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        <div className="flex justify-between items-center pt-2 border-t border-gray-100 ml-13">
          <div className="flex space-x-2">
            <button
              onClick={triggerFileInput}
              type="button"
              className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
              aria-label="Add media"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Photo/Video</span>
            </button>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={handleMediaChange}
              className="hidden"
              aria-hidden="true"
            />
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => setIsExpanded(false)}
              className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
              disabled={uploading}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={uploading || (!content.trim() && media.length === 0)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                uploading || (!content.trim() && media.length === 0)
                  ? 'bg-blue-200 text-white cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600 shadow-sm'
              }`}
              aria-busy={uploading}
            >
              {uploading ? (
                <span className="flex items-center">
                  <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
                  Posting...
                </span>
              ) : (
                'Post'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
