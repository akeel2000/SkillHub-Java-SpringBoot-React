import React, { useState } from "react";

const AddPost = () => {
  const [content, setContent] = useState("");
  const [media, setMedia] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setMedia(files);
    setPreviewUrls(files.map(file => URL.createObjectURL(file)));
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("userId", localStorage.getItem("userId"));
    formData.append("content", content);
    media.forEach(file => formData.append("media", file));

    const res = await fetch("http://localhost:8080/api/posts/create", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: formData
    });

    if (res.ok) {
      alert("Post created!");
      window.location.href = "/home";
    } else {
      alert("Post failed");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto mt-20 bg-white rounded-xl shadow-lg space-y-4">
      <textarea
        placeholder="What's on your mind?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-lg"
        rows="4"
      />
      <input
        type="file"
        multiple
        accept="image/*,video/*"
        onChange={handleFileChange}
      />
      <div className="flex space-x-2 overflow-x-auto">
        {previewUrls.map((url, i) =>
          url.match(/video/) ? (
            <video key={i} src={url} width={80} controls />
          ) : (
            <img key={i} src={url} alt="preview" className="w-20 h-20 object-cover" />
          )
        )}
      </div>
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
