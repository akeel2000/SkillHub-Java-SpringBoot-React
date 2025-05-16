import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const UpdateProfile = () => {
  const navigate = useNavigate();
  const email = localStorage.getItem("userEmail");
  const token = localStorage.getItem("token");
  const [form, setForm] = useState({ name: "", lastName: "" });
  const [profilePic, setProfilePic] = useState(null);
  const [coverPic, setCoverPic] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!email || !token) {
      navigate("/login");
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/auth/user?email=${email}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || "Failed to load user data");
        }
        const data = await res.json();
        setForm({ name: data.name || "", lastName: data.lastName || "" });
      } catch (err) {
        setError(err.message || "Failed to load user data");
        localStorage.removeItem("token");
        localStorage.removeItem("userEmail");
        navigate("/login");
      }
    };

    fetchUser();
  }, [email, token, navigate]);

  const validateForm = () => {
    const nameRegex = /^[A-Za-z\s]{1,50}$/;
    if (!form.name.trim()) return "First name is required";
    if (!nameRegex.test(form.name)) return "First name must be 1-50 letters or spaces";
    if (!form.lastName.trim()) return "Last name is required";
    if (!nameRegex.test(form.lastName)) return "Last name must be 1-50 letters or spaces";
    if (profilePic) {
      const validTypes = ["image/jpeg", "image/png"];
      if (!validTypes.includes(profilePic.type)) return "Profile picture must be JPEG or PNG";
      if (profilePic.size > 5 * 1024 * 1024) return "Profile picture must be under 5MB";
    }
    if (coverPic) {
      const validTypes = ["image/jpeg", "image/png"];
      if (!validTypes.includes(coverPic.type)) return "Cover photo must be JPEG or PNG";
      if (coverPic.size > 5 * 1024 * 1024) return "Cover photo must be under 5MB";
    }
    return null;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("email", email);
    formData.append("name", form.name.trim());
    formData.append("lastName", form.lastName.trim());
    if (profilePic) formData.append("profilePic", profilePic);
    if (coverPic) formData.append("coverPic", coverPic);

    try {
      const res = await fetch("http://localhost:8080/api/auth/update", {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (res.ok) {
        setSuccess("Profile updated successfully!");
        setTimeout(() => navigate("/profile"), 1000);
      } else {
        const text = await res.text();
        throw new Error(text || "Update failed");
      }
    } catch (err) {
      setError(err.message || "Error updating profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div
        className="bg-gray-50 border border-gray-200 rounded-xl shadow-md p-6 w-full max-w-lg mx-auto sm:max-w-full sm:mx-2"
        role="region"
        aria-label="Update profile"
      >
        {/* Back Button */}
        <button
          onClick={() => navigate("/profile")}
          className="mb-4 px-4 py-2 bg-teal-400 text-white rounded-md hover:bg-teal-500 hover:scale-105 transition-all flex items-center gap-2"
          aria-label="Go back to profile"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back
        </button>

        <h2 className="text-2xl font-semibold text-gray-900 text-center mb-6">
          Update Profile
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="First Name"
              className={`w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-teal-400 ${
                error && error.includes("First name") ? "animate-shake border-red-500" : ""
              }`}
              disabled={isSubmitting}
              aria-label="First name"
            />
          </div>

          <div className="relative">
            <input
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              placeholder="Last Name"
              className={`w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-teal-400 ${
                error && error.includes("Last name") ? "animate-shake border-red-500" : ""
              }`}
              disabled={isSubmitting}
              aria-label="Last name"
            />
          </div>

          <div className="relative">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-200 rounded-lg cursor-pointer hover:border-teal-400 transition-all">
              <div className="flex flex-col items-center text-gray-500">
                <svg
                  className="w-8 h-8 mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-sm">
                  {profilePic ? profilePic.name : "Upload Profile Picture"}
                </span>
              </div>
              <input
                type="file"
                accept="image/jpeg,image/png"
                onChange={(e) => {
                  setProfilePic(e.target.files[0]);
                  setError(null);
                }}
                className="hidden"
                disabled={isSubmitting}
                aria-label="Upload profile picture"
              />
            </label>
          </div>

          <div className="relative">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-200 rounded-lg cursor-pointer hover:border-teal-400 transition-all">
              <div className="flex flex-col items-center text-gray-500">
                <svg
                  className="w-8 h-8 mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-sm">
                  {coverPic ? coverPic.name : "Upload Cover Photo"}
                </span>
              </div>
              <input
                type="file"
                accept="image/jpeg,image/png"
                onChange={(e) => {
                  setCoverPic(e.target.files[0]);
                  setError(null);
                }}
                className="hidden"
                disabled={isSubmitting}
                aria-label="Upload cover photo"
              />
            </label>
          </div>

          {error && (
            <p className="text-xs text-red-500" role="alert" aria-live="polite">
              {error}
            </p>
          )}
          {success && (
            <p className="text-xs text-teal-400" role="status" aria-live="polite">
              {success}
            </p>
          )}

          <button
            type="submit"
            className={`w-full px-4 py-2 bg-teal-400 text-white rounded-md hover:bg-teal-500 hover:scale-105 transition-all ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isSubmitting}
            aria-label="Save profile changes"
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfile;
