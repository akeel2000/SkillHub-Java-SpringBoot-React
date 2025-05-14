import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

import CreatePost from "../components/CreatePost";
import EditPostModal from "../components/EditPostModal";
import PostCard from "../components/PostCard";
import PostCardWithReactions from "../components/PostCardWithReactions";




const Home = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [stories, setStories] = useState([]);
  const [selectedStory, setSelectedStory] = useState(null);
  const [viewCountUpdated, setViewCountUpdated] = useState(false);
  const [showEditStoryModal, setShowEditStoryModal] = useState(false);
  const [editedText, setEditedText] = useState("");
  const [newImage, setNewImage] = useState(null);
  const navigate = useNavigate();
  const [editingPost, setEditingPost] = useState(null);



  const authFetch = async (url, options = {}) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login"); // redirect if missing
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
        // Remove from UI:
        setPosts(prev => prev.filter(p => p.id !== postId));
      }
    } catch (err) {
      alert("Failed to delete post");
    }
  };
  
  const handleEditPost = (post) => {
    setEditingPost(post); // Only open the EditPostModal
  };




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
        localStorage.clear(); // clear invalid token
        alert("Failed to load user");
        navigate("/login");
      }
    };
  
    fetchUser();
  }, [navigate]);
  
 

 // ✅ Move this OUTSIDE of useEffect
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

// ✅ Use inside useEffect
useEffect(() => {
  fetchPosts();
}, []);

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

  const closeModal = () => {
    setSelectedStory(null);
    setViewCountUpdated(false);
  };

  const handleEditClick = (story) => {
    setSelectedStory(story);
    setEditedText(story.text);
    setShowEditStoryModal(true);
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setNewImage(e.target.files[0]);
    }
  };

  const handleUpdateStory = async () => {
    try {
      const formData = new FormData();
      formData.append("text", editedText);
      formData.append("userId", user.id); // ✅ Add this line!
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
  

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") closeModal();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  if (!user)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="animate-pulse text-cyan-400 text-xl">Loading Profile...</div>
      </div>
    );

  const EditModal = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-gradient-to-br from-purple-800/50 to-blue-800/50 backdrop-blur-xl rounded-2xl border border-cyan-300/20 p-6 max-w-xl w-full mx-4 shadow-2xl">
        <h3 className="text-2xl font-bold mb-4 text-cyan-400">Edit Story</h3>
        
        <div className="space-y-4">
          <textarea
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            className="w-full px-4 py-2 bg-purple-900/30 border-2 border-cyan-300/20 rounded-xl text-cyan-100 placeholder-cyan-200/50 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all"
            rows="4"
            placeholder="Enter your story text..."
          />
          
          <div className="relative group">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-cyan-300/20 rounded-xl cursor-pointer hover:border-cyan-400/40 transition-all">
              <div className="flex flex-col items-center text-cyan-300/80">
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
                alt="Current"
                className="w-full h-32 object-cover rounded-xl border-2 border-cyan-300/20"
              />
              <span className="text-cyan-300 text-sm mt-1">Current Image</span>
            </div>
          )}

          <div className="flex justify-end space-x-4 mt-6">
            <button
              onClick={() => setShowEditStoryModal(false)}
              className="px-6 py-2 bg-red-500/10 text-red-300 rounded-xl hover:bg-red-500/20 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdateStory}
              className="px-6 py-2 bg-gradient-to-br from-cyan-500 to-blue-600 text-white rounded-xl shadow hover:shadow-lg transition-all"
            >
              Update Story
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      <Header user={user} />

      <div className="p-6 max-w-6xl mx-auto mt-12">
        {/* Stories Section */}
        <div className="mt-6 relative z-10">
          <h2 className="text-xl font-bold mb-4 text-cyan-400 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Recent Stories
          </h2>
          <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
            {stories.map((story, index) => (
              <div
                key={index}
                className="w-32 h-56 flex flex-col items-center text-center bg-gradient-to-br from-purple-800/50 to-blue-800/50 backdrop-blur-sm rounded-2xl p-1 border border-cyan-300/20 shadow-2xl transform transition-all duration-300 hover:scale-105 flex-shrink-0 cursor-pointer"
                onClick={() => setSelectedStory(story)}
              >
                <div className="relative h-40 w-full rounded-xl overflow-hidden group">
                  {story.mediaUrl ? (
                    <img
                      src={`http://localhost:8080${story.mediaUrl}`}
                      alt="Story"
                      className="w-full h-full object-cover transform transition-transform group-hover:scale-110"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.classList.add('bg-gradient-to-br', 'from-cyan-500', 'to-purple-600');
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-cyan-300 p-4 text-sm bg-purple-900/30">
                      {story.text}
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-center mt-2">
                  {story.userProfilePic && (
                    <img
                      src={`http://localhost:8080${story.userProfilePic}`}
                      alt="User"
                      className="w-8 h-8 rounded-full border-2 border-white shadow-md object-cover"
                    />
                  )}
                  <p className="text-xs text-cyan-300 font-medium mt-1 truncate w-full">
                    {story.userName}
                  </p>
                  <p className="text-xs text-cyan-400 mt-1">{story.viewedBy?.length || 0} views</p>
                </div>
              </div>
            ))}
            <button
              onClick={() => navigate("/add-story")}
              className="w-32 h-56 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 backdrop-blur-sm rounded-2xl border-2 border-dashed border-cyan-300/30 flex items-center justify-center text-cyan-400 hover:text-cyan-300 transition-all transform hover:scale-105 flex-shrink-0"
            >
              <div className="text-4xl bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                +
              </div>
            </button>
          </div>
        </div>

        {/* Posts Section */}
        <div className="mt-8 relative z-10">
          <h2 className="text-xl font-bold mb-6 text-cyan-400 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Community Posts
          </h2>


          
<CreatePost userId={user.id} onPostCreated={(newPost) => setPosts([newPost, ...posts])} />
          <div className="space-y-6">
            {posts.length > 0 ? (
              posts.map((post) => (
<PostCardWithReactions
  key={post.id}
  post={post}
  userId={user.id}
  userName={user.fullName}
  token={localStorage.getItem("token")}
  onUpdate={fetchPosts}
  onEdit={() => setEditingPost(post)}
  onDelete={() => handleDelete(post.id)}
  showControls={post.userId === user.id}




                  className="bg-gradient-to-br from-purple-800/50 to-blue-800/50 backdrop-blur-sm rounded-2xl border border-cyan-300/20 shadow-2xl transform transition-all hover:scale-[1.01] hover:shadow-3xl"
                />
              ))
            ) : (
              <div className="bg-gradient-to-br from-purple-800/50 to-blue-800/50 backdrop-blur-sm rounded-2xl p-6 border border-cyan-300/20 text-cyan-300 text-center">
                No posts available yet
              </div>
              
            )}
          </div>
        </div>

        
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

      </div>

      {/* Story View Modal */}
      {selectedStory && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
          onClick={closeModal}
        >
          <div 
            className="bg-gradient-to-br from-purple-800/50 to-blue-800/50 backdrop-blur-xl rounded-2xl border border-cyan-300/20 p-6 max-w-2xl w-full mx-4 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-cyan-300 hover:text-cyan-100 text-2xl bg-cyan-500/10 rounded-full w-8 h-8 flex items-center justify-center transition-all hover:bg-cyan-500/20"
            >
              &times;
            </button>

            <div className="relative h-[70vh] w-full rounded-xl overflow-hidden group">
              {selectedStory.mediaUrl ? (
                <img
                  src={`http://localhost:8080${selectedStory.mediaUrl}`}
                  alt="Story"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.classList.add('bg-gradient-to-br', 'from-cyan-500', 'to-purple-600');
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-cyan-300 p-4 text-xl bg-purple-900/30">
                  {selectedStory.text}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-cyan-400/20 blur-xl rounded-full" />
                  <img
                    src={`http://localhost:8080${selectedStory.userProfilePic}`}
                    alt="User"
                    className="w-10 h-10 rounded-full border-2 border-cyan-300/50 relative z-10"
                  />
                </div>
                <div>
                  <p className="text-cyan-100 font-medium">{selectedStory.userName}</p>
                  <p className="text-cyan-400 text-sm">{selectedStory.viewedBy?.length || 0} views</p>
                </div>
              </div>

              {selectedStory.userId === user.id && (
                <div className="flex gap-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditClick(selectedStory);
                    }}
                    className="px-4 py-2 bg-cyan-500/10 text-cyan-300 rounded-lg hover:bg-cyan-500/20 transition-colors"
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
                    className="px-4 py-2 bg-red-500/10 text-red-300 rounded-lg hover:bg-red-500/20 transition-colors"
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