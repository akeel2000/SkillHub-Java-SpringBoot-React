import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import CreatePost from "../components/CreatePost";
import EditPostModal from "../components/EditPostModal";
import PostCard from "../components/PostCard";
import PostCardWithReactions from "../components/PostCardWithReactions";

/**
 * Home component displays the main social media feed with stories, posts, and modals.
 * Integrates PostCardWithReactions for posts with a light theme and user interactions.
 */
const Home = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [stories, setStories] = useState([]);
  const [selectedStory, setSelectedStory] = useState(null);
  const [viewCountUpdated, setViewCountUpdated] = useState(false);
  const [showEditStoryModal, setShowEditStoryModal] = useState(false);
  const [editedText, setEditedText] = useState("");
  const [newImage, setNewImage] = useState(null);
  const [editingPost, setEditingPost] = useState(null);
  const navigate = useNavigate();

  /**
   * Utility for authenticated API requests with token handling.
   * Redirects to login if token is missing.
   */
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

  /**
   * Deletes a post via API and updates the UI.
   * @param {string} postId - ID of the post to delete
   */
  const handleDelete = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      const res = await fetch(`http://localhost:8080/api/posts/${postId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
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

  /**
   * Opens the edit modal for a post.
   * @param {Object} post - Post to edit
   */
  const handleEditPost = (post) => {
    setEditingPost(post);
  };

  /**
   * Updates a single post in the state after reactions/comments.
   * @param {Object} updatedPost - Updated post data
   */
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

  /**
   * Fetches user data on mount and redirects to login if invalid.
   */
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

  /**
   * Fetches all posts on mount.
   */
  const fetchPosts = async () => {
    try {
      const res = await authFetch("http://localhost:8080/api/posts");
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      }
    } catch (error) {
      console.error("Failed to fetch posts", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  /**
   * Fetches stories on mount.
   */
  useEffect(() => {
    const fetchStories = async () => {
      try {
        const res = await authFetch("http://localhost:8080/api/stories");
        if (res.ok) setStories(await res.json());
      } catch (error) {
        console.error("Failed to fetch stories", error);
      }
    };

    fetchStories();
  }, []);

  /**
   * Updates story view count when a story is selected.
   */
  useEffect(() => {
    if (selectedStory && !viewCountUpdated) {
      const updateViewCount = async () => {
        const viewerId = localStorage.getItem("userId");
        await fetch(
          `http://localhost:8080/api/stories/view/${selectedStory.id}?viewerId=${viewerId}`,
          {
            method: "PUT",
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );
        setViewCountUpdated(true);
      };
      updateViewCount();
    }
  }, [selectedStory, viewCountUpdated]);

  /**
   * Closes the story modal and resets view count state.
   */
  const closeModal = () => {
    setSelectedStory(null);
    setViewCountUpdated(false);
  };

  /**
   * Opens the edit story modal with pre-filled data.
   * @param {Object} story - Story to edit
   */
  const handleEditClick = (story) => {
    setSelectedStory(story);
    setEditedText(story.text);
    setShowEditStoryModal(true);
  };

  /**
   * Handles image file selection for story updates.
   */
  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setNewImage(e.target.files[0]);
    }
  };

  /**
   * Updates a story via API with text and optional image.
   */
  const handleUpdateStory = async () => {
    try {
      const formData = new FormData();
      formData.append("text", editedText);
      formData.append("userId", user.id);
      if (newImage) {
        formData.append("media", newImage);
      }

      const res = await fetch(`http://localhost:8080/api/stories/${selectedStory.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      if (res.ok) {
        window.location.reload();
      } else {
        alert("Failed to update story");
      }
    } catch (error) {
      console.error("Update error:", error);
      alert("Error updating story");
    }
  };

  /**
   * Adds Escape key listener to close story modal.
   */
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") closeModal();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  if (!user)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-pulse text-teal-600 text-xl">Loading Profile...</div>
      </div>
    );

  /**
   * Modal for editing a story with text and image inputs.
   */
  const EditModal = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6 max-w-xl w-full mx-4 shadow-md">
        <h3 className="text-2xl font-bold mb-4 text-gray-900">Edit Story</h3>

        <div className="space-y-4">
          <textarea
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            className="w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:border-teal-400"
            rows="4"
            placeholder="Enter your story text..."
          />

          <div className="relative group">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-teal-400 transition-all">
              <div className="flex flex-col items-center text-gray-500">
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
              />
            </label>
          </div>

          {selectedStory?.mediaUrl && !newImage && (
            <div className="relative">
              <img
                src={`http://localhost:8080${selectedStory.mediaUrl}`}
                alt="Current story image"
                className="w-full h-32 object-cover rounded-xl border border-gray-200"
              />
              <span className="text-gray-500 text-sm mt-1">Current Image</span>
            </div>
          )}

          <div className="flex justify-end space-x-4 mt-6">
            <button
              onClick={() => setShowEditStoryModal(false)}
              className="px-6 py-2 bg-gray-200 text-gray-900 rounded-xl hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdateStory}
              className="px-6 py-2 bg-teal-400 text-white rounded-xl hover:bg-teal-500 transition-all"
            >
              Update Story
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 relative overflow-hidden">
      <Header user={user} />

      <main role="main" className="p-6 max-w-6xl mx-auto mt-12">
        {/* Stories Section */}
        <section aria-label="Recent stories">
          <h2 className="text-xl font-bold mb-4 text-gray-900">Recent Stories</h2>
          <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
            {stories.map((story, index) => (
              <div
                key={index}
                className="w-32 h-56 flex flex-col items-center text-center bg-gray-50 rounded-2xl p-1 border border-gray-200 shadow-md hover:scale-105 transition-all flex-shrink-0 cursor-pointer"
                onClick={() => setSelectedStory(story)}
              >
                <div className="relative h-40 w-full rounded-xl overflow-hidden group">
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
                    <div className="w-full h-full flex items-center justify-center text-gray-500 p-4 text-sm bg-gray-100">
                      {story.text}
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-center mt-2">
                  {story.userProfilePic && (
                    <img
                      src={`http://localhost:8080${story.userProfilePic}`}
                      alt={`${story.userName}'s profile picture`}
                      className="w-8 h-8 rounded-full border-2 border-gray-200 shadow-md object-cover"
                    />
                  )}
                  <p className="text-xs text-gray-900 font-medium mt-1 truncate w-full">
                    {story.userName}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{story.viewedBy?.length || 0} views</p>
                </div>
              </div>
            ))}
            <button
              onClick={() => navigate("/add-story")}
              className="w-32 h-56 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center text-teal-400 hover:text-teal-500 transition-all hover:scale-105 flex-shrink-0"
              aria-label="Add a new story"
            >
              <div className="text-4xl">+</div>
            </button>
          </div>
        </section>

        {/* Posts Section */}
        <section aria-label="Community posts" className="mt-8">
          <h2 className="text-xl font-bold mb-6 text-gray-900">Community Posts</h2>
          {/* CreatePost component for adding new posts */}
          <CreatePost userId={user.id} onPostCreated={(newPost) => setPosts([newPost, ...posts])} />
          <div className="space-y-6">
            {posts.length > 0 ? (
              posts.map((post) => (
                <PostCardWithReactions
                  key={post.id}
                  post={{
                    ...post,
                    profilePicUrl: post.profilePicUrl || "https://via.placeholder.com/40", // Fallback for profile picture
                  }}
                  userId={user.id}
                  userName={user.fullName}
                  token={localStorage.getItem("token")}
                  onUpdate={() => handlePostUpdate(post.id)} // Optimized single-post update
                  onEdit={() => handleEditPost(post)}
                  onDelete={() => handleDelete(post.id)}
                  showControls={post.userId === user.id}
                  className="rounded-xl shadow-md" // Minimal styling to complement light theme
                />
              ))
            ) : (
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 text-gray-500 text-center">
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

      {/* Story View Modal */}
      {selectedStory && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
          onClick={closeModal}
        >
          <div
            className="bg-gray-50 rounded-2xl border border-gray-200 p-6 max-w-2xl w-full mx-4 shadow-md"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center transition-all"
              aria-label="Close story modal"
            >
              ×
            </button>

            <div className="relative h-[70vh] w-full rounded-xl overflow-hidden">
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
                <div className="w-full h-full flex items-center justify-center text-gray-500 p-4 text-xl bg-gray-100">
                  {selectedStory.text}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <img
                    src={`http://localhost:8080${selectedStory.userProfilePic || "/default-avatar.png"}`}
                    alt={`${selectedStory.userName}'s profile picture`}
                    className="w-10 h-10 rounded-full border-2 border-gray-200"
                  />
                </div>
                <div>
                  <p className="text-gray-900 font-medium">{selectedStory.userName}</p>
                  <p className="text-gray-500 text-sm">{selectedStory.viewedBy?.length || 0} views</p>
                </div>
              </div>

              {selectedStory.userId === user.id && (
                <div className="flex gap-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditClick(selectedStory);
                    }}
                    className="px-4 py-2 bg-teal-400 text-white rounded-lg hover:bg-teal-500 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={async (e) => {
                      e.stopPropagation();
                      await fetch(
                        `http://localhost:8080/api/stories/${selectedStory.id}?userId=${user.id}`,
                        {
                          method: "DELETE",
                          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                        }
                      );
                      window.location.reload();
                    }}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit Story Modal */}
      {showEditStoryModal && <EditModal />}

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(10deg); }
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default Home;
