import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import CreatePost from "../components/CreatePost";
import EditPostModal from "../components/EditPostModal";
import PostCardWithReactions from "../components/PostCardWithReactions";

const Home = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [stories, setStories] = useState([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [isLoadingStories, setIsLoadingStories] = useState(true);
  const [selectedStory, setSelectedStory] = useState(null);
  const [viewCountUpdated, setViewCountUpdated] = useState(false);
  const [showEditStoryModal, setShowEditStoryModal] = useState(false);
  const [editedText, setEditedText] = useState("");
  const [newImage, setNewImage] = useState(null);

  // Post editing state
  const [editingPost, setEditingPost] = useState(null);

  const navigate = useNavigate();

  // Helper for authenticated fetch requests
  const authFetch = async (url, options = {}) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    return fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${token}`,
      },
    });
  };

  // Delete a post by ID
  const handleDelete = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      const res = await authFetch(`http://localhost:8080/api/posts/${postId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        alert("Post deleted");
        setPosts((prev) => prev.filter((p) => p.id !== postId));
      } else {
        throw new Error();
      }
    } catch (err) {
      alert("Failed to delete post");
    }
  };

  // Open post edit modal
  const handleEditPost = (post) => {
    setEditingPost(post);
  };

  // Update a post after editing
  const handlePostUpdate = async (postId) => {
    try {
      const res = await authFetch(`http://localhost:8080/api/posts/${postId}`);
      if (res.ok) {
        const updatedPost = await res.json();
        setPosts((prev) => prev.map((p) => (p.id === updatedPost.id ? updatedPost : p)));
      }
    } catch (error) {
      console.error("Failed to update post", error);
    }
  };

  // Fetch user profile on mount
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      const email = localStorage.getItem("userEmail");
      if (!token || !email) {
        navigate("/login");
        return;
      }
      try {
        const res = await authFetch(`http://localhost:8080/api/auth/user?email=${email}`);
        if (res.ok) {
          const data = await res.json();
          setUser(data);
          localStorage.setItem("userId", data.id);
        } else {
          throw new Error();
        }
      } catch {
        localStorage.clear();
        alert("Failed to load user");
        navigate("/login");
      }
    };
    fetchUser();
  }, [navigate]);

  // Fetch all posts
  const fetchPosts = async () => {
    setIsLoadingPosts(true);
    try {
      const res = await authFetch("http://localhost:8080/api/posts");
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      }
    } catch (error) {
      console.error("Failed to fetch posts", error);
    } finally {
      setIsLoadingPosts(false);
    }
  };

  // Fetch posts on mount
  useEffect(() => {
    fetchPosts();
  }, []);

  // Fetch all stories
  useEffect(() => {
    const fetchStories = async () => {
      setIsLoadingStories(true);
      try {
        const res = await authFetch("http://localhost:8080/api/stories");
        if (res.ok) setStories(await res.json());
      } catch (error) {
        console.error("Failed to fetch stories", error);
      } finally {
        setIsLoadingStories(false);
      }
    };
    fetchStories();
  }, []);

  // Update story view count when a story is selected
  useEffect(() => {
    if (selectedStory && !viewCountUpdated) {
      const updateViewCount = async () => {
        const viewerId = localStorage.getItem("userId");
        await authFetch(
          `http://localhost:8080/api/stories/view/${selectedStory.id}?viewerId=${viewerId}`,
          { method: "PUT" }
        );
        setViewCountUpdated(true);
      };
      updateViewCount();
    }
  }, [selectedStory, viewCountUpdated]);

  // Close story modal
  const closeModal = () => {
    setSelectedStory(null);
    setViewCountUpdated(false);
  };

  // Open edit modal for a story
  const handleEditClick = (story) => {
    setSelectedStory(story);
    setEditedText(story.text);
    setShowEditStoryModal(true);
  };

  // Handle image file change for story edit
  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setNewImage(e.target.files[0]);
    }
  };

  // Update a story with new text/image
  const handleUpdateStory = async () => {
    try {
      const formData = new FormData();
      formData.append("text", editedText);
      formData.append("userId", user.id);
      if (newImage) {
        formData.append("media", newImage);
      }

      const res = await authFetch(`http://localhost:8080/api/stories/${selectedStory.id}`, {
        method: "PUT",
        body: formData,
      });

      if (res.ok) {
        setStories((prev) =>
          prev.map((s) => (s.id === selectedStory.id ? { ...s, text: editedText, mediaUrl: newImage ? URL.createObjectURL(newImage) : s.mediaUrl } : s))
        );
        setShowEditStoryModal(false);
        setNewImage(null);
      } else {
        alert("Failed to update story");
      }
    } catch (error) {
      console.error("Update error:", error);
      alert("Error updating story");
    }
  };

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") closeModal();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  // Show loading state if user is not loaded yet
  if (!user)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse text-teal-600 text-xl">Loading Profile...</div>
      </div>
    );

  // Modal for editing a story
  const EditModal = () => (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Edit story modal"
    >
      <div className="bg-gray-50 border border-gray-200 rounded-xl shadow-md p-6 w-full max-w-md mx-4">
        <h3 className="text-xl font-bold mb-4 text-gray-900">Edit Story</h3>

        <div className="space-y-4">
          {/* Textarea for editing story text */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <textarea
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              className="w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:border-teal-400"
              rows="4"
              placeholder="Enter your story text..."
              aria-label="Edit story text"
            />
          </div>

          {/* Image upload for story */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-200 rounded-md cursor-pointer hover:border-teal-400 transition-all">
              <div className="flex flex-col items-center text-gray-600">
                <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm">
                  {newImage ? newImage.name : "Click to update image"}
                </span>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                aria-hidden="true"
              />
            </label>
            {/* Show current image if exists */}
            {selectedStory?.mediaUrl && !newImage && (
              <div className="mt-2">
                <img
                  src={`http://localhost:8080${selectedStory.mediaUrl}`}
                  alt="Current story image"
                  className="w-full h-32 object-cover rounded-md border border-gray-200"
                />
                <span className="text-gray-500 text-sm mt-1 block">Current Image</span>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowEditStoryModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                aria-label="Cancel edit"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateStory}
                className="px-4 py-2 bg-teal-400 text-white rounded-md hover:bg-teal-500 transition-colors"
                aria-label="Update story"
              >
                Update Story
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50">
      {/* Header with user info */}
      <Header user={user} />

      <div className="min-h-screen ml-0 lg:ml-64 overflow-y-auto z-10">
        <main
          role="main"
          className="p-4 sm:p-6 w-full max-w-4xl mx-auto pt-16 sm:pt-20 pb-12"
        >
          {/* Stories Section */}
          <section aria-label="Recent stories" className="mb-8">
            <div className="bg-white border border-gray-200 rounded-lg p-4 min-h-[200px]">
              <h2 className="text-lg font-bold mb-4 text-gray-900">Recent Stories</h2>
              {isLoadingStories ? (
                // Loading skeleton for stories
                <div
                  className="flex space-x-3 min-h-[120px]"
                  role="status"
                  aria-live="polite"
                  aria-busy="true"
                >
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="w-28 h-48 bg-gray-200 rounded-lg animate-pulse"
                      aria-hidden="true"
                    ></div>
                  ))}
                </div>
              ) : (
                // Stories list
                <div className="flex space-x-3 overflow-x-auto min-h-[120px]">
                  {stories.length > 0 ? (
                    stories.map((story, index) => (
                      <div
                        key={index}
                        className="w-28 h-48 bg-gray-50 rounded-lg p-2 border border-gray-200 shadow-sm hover:scale-105 transition-all flex-shrink-0 cursor-pointer"
                        onClick={() => setSelectedStory(story)}
                        role="button"
                        aria-label={`View story by ${story.userName}`}
                      >
                        <div className="relative h-32 w-full rounded-md overflow-hidden group">
                          {story.mediaUrl ? (
                            <img
                              src={`http://localhost:8080${story.mediaUrl}`}
                              alt={`Story by ${story.userName}`}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                              onError={(e) => {
                                e.target.style.display = "none";
                                e.target.parentElement.classList.add("bg-teal-400");
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-500 p-2 text-xs bg-gray-100 rounded-md">
                              {story.text}
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col items-center mt-2">
                          {story.userProfilePic && (
                            <img
                              src={`http://localhost:8080${story.userProfilePic}`}
                              alt={`${story.userName}'s profile picture`}
                              className="w-6 h-6 rounded-full border border-gray-200"
                            />
                          )}
                          <p className="text-xs text-gray-900 font-medium mt-1 truncate w-full text-center">
                            {story.userName}
                          </p>
                          <p className="text-xs text-gray-500">{story.viewedBy?.length || 0} views</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-500 text-sm py-4">No stories available</div>
                  )}
                  {/* Button to add a new story */}
                  <button
                    onClick={() => navigate("/add-story")}
                    className="w-28 h-48 bg-gray-200 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center text-teal-600 hover:bg-gray-300 transition-all flex-shrink-0"
                    aria-label="Add a new story"
                  >
                    <div className="text-3xl">+</div>
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* Posts Section */}
          <section aria-label="Community posts">
            <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6 min-h-[150px]">
              <h2 className="text-lg font-bold mb-4 text-gray-900">Community Posts</h2>
              {/* Create new post */}
              <CreatePost userId={user.id} onPostCreated={(newPost) => setPosts([newPost, ...posts])} />
            </div>
            <div className="space-y-6" role="region" aria-live="polite">
              {isLoadingPosts ? (
                // Loading skeleton for posts
                <div className="space-y-6" role="status" aria-busy="true">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="bg-white border border-gray-200 rounded-lg p-4 h-96 animate-pulse"
                      aria-hidden="true"
                    ></div>
                  ))}
                </div>
              ) : posts.length > 0 ? (
                // Render each post
                posts.map((post) => (
                  <div key={post.id} className="bg-white border border-gray-200 rounded-lg p-4">
                    <PostCardWithReactions
                      post={{
                        ...post,
                        profilePicUrl: post.profilePicUrl || "https://via.placeholder.com/40",
                      }}
                      userId={user.id}
                      userName={user.fullName}
                      token={localStorage.getItem("token")}
                      onUpdate={() => handlePostUpdate(post.id)}
                      onEdit={() => handleEditPost(post)}
                      onDelete={() => handleDelete(post.id)}
                      showControls={post.userId === user.id}
                      className="rounded-lg"
                    />
                  </div>
                ))
              ) : (
                <div className="bg-white border border-gray-200 rounded-lg p-4 text-gray-500 text-center min-h-[200px] flex items-center justify-center">
                  No posts available yet
                </div>
              )}
            </div>
          </section>

          {/* Edit Post Modal */}
          {editingPost && (
            <EditPostModal
              post={editingPost}
              onClose={() => setEditingPost(null)}
              onUpdate={(updated) => {
                setPosts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
                setEditingPost(null);
              }}
            />
          )}
        </main>
      </div>

      {/* Story View Modal */}
      {selectedStory && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
          aria-label="Story view modal"
        >
          <div
            className="bg-gray-50 border border-gray-200 rounded-xl shadow-md p-6 w-full max-w-md mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all"
              aria-label="Close story modal"
            >
              ×
            </button>

            <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
              <div className="relative h-64 w-full rounded-md overflow-hidden">
                {selectedStory.mediaUrl ? (
                  <img
                    src={`http://localhost:8080${selectedStory.mediaUrl}`}
                    alt={`Story by ${selectedStory.userName}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.parentElement.classList.add("bg-teal-400");
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500 p-4 text-base bg-gray-100 rounded-md">
                    {selectedStory.text}
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img
                    src={`http://localhost:8080${selectedStory.userProfilePic || "/default-avatar.png"}`}
                    alt={`${selectedStory.userName}'s profile picture`}
                    className="w-8 h-8 rounded-full border border-gray-200"
                  />
                  <div>
                    <p className="text-gray-900 font-medium text-sm">{selectedStory.userName}</p>
                    <p className="text-gray-500 text-xs">{selectedStory.viewedBy?.length || 0} views</p>
                  </div>
                </div>

                {/* Edit and Delete buttons for story owner */}
                {selectedStory.userId === user.id && (
                  <div className="flex gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditClick(selectedStory);
                      }}
                      className="px-3 py-1 bg-teal-400 text-white rounded-md hover:bg-teal-500 transition-colors text-sm"
                      aria-label="Edit story"
                    >
                      Edit
                    </button>
                    <button
                      onClick={async (e) => {
                        e.stopPropagation();
                        await authFetch(
                          `http://localhost:8080/api/stories/${selectedStory.id}?userId=${user.id}`,
                          { method: "DELETE" }
                        );
                        setStories((prev) => prev.filter((s) => s.id !== selectedStory.id));
                        closeModal();
                      }}
                      className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm"
                      aria-label="Delete story"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Story Modal */}
      {showEditStoryModal && <EditModal />}

      {/* Global styles for scroll and layout */}
      <style jsx global>{`
        html {
          scroll-behavior: smooth;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        main {
          overscroll-behavior: contain;
        }
      `}</style>
    </div>
  );
};

export default Home;