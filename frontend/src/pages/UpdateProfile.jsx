import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const UpdateProfile = () => {
  const navigate = useNavigate();
  const email = localStorage.getItem("userEmail");
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    name: "",
    lastName: "",
  });
  const [profilePic, setProfilePic] = useState(null);
  const [coverPic, setCoverPic] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8080/api/auth/user?email=${email}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setForm({ name: data.name, lastName: data.lastName }));
  }, [email, token]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("email", email);
    formData.append("name", form.name);
    formData.append("lastName", form.lastName);
    if (profilePic) formData.append("profilePic", profilePic);
    if (coverPic) formData.append("coverPic", coverPic);

    try {
      const res = await fetch("http://localhost:8080/api/auth/update", {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (res.ok) {
        alert("Profile updated!");
        navigate("/profile");
      } else {
        alert("Update failed");
      }
    } catch (err) {
      alert("Error updating profile");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-16 h-16 border-4 border-opacity-10 border-cyan-300 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${10 + i * 2}s infinite linear`,
              transform: `scale(${0.5 + Math.random() * 1.5})`,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
        <div className="bg-gradient-to-br from-purple-800/50 to-blue-800/50 backdrop-blur-xl border border-cyan-300/20 rounded-3xl shadow-2xl w-full max-w-lg p-8 animate-fadeInUp">
          {/* Close Button */}
          <button
            onClick={() => navigate('/profile')}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full border-2 border-cyan-300/20 text-cyan-300 hover:border-cyan-400 hover:text-cyan-400 hover:bg-cyan-400/10 transition-all"
            aria-label="Close"
          >
            ×
          </button>

          <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Update Profile
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative group">
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="First Name"
                className="w-full px-4 py-3 bg-purple-900/30 border-2 border-cyan-300/20 rounded-xl text-cyan-100 placeholder-cyan-200/50 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all"
              />
              <div className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            <div className="relative group">
              <input
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                placeholder="Last Name"
                className="w-full px-4 py-3 bg-purple-900/30 border-2 border-cyan-300/20 rounded-xl text-cyan-100 placeholder-cyan-200/50 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all"
              />
              <div className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            <div className="relative group">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-cyan-300/20 rounded-xl cursor-pointer hover:border-cyan-400/40 transition-all">
                <div className="flex flex-col items-center text-cyan-300/80">
                  <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm">
                    {profilePic ? profilePic.name : "Upload Profile Picture"}
                  </span>
                </div>
                <input
                  type="file"
                  onChange={(e) => setProfilePic(e.target.files[0])}
                  className="hidden"
                />
              </label>
            </div>

            <div className="relative group">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-cyan-300/20 rounded-xl cursor-pointer hover:border-cyan-400/40 transition-all">
                <div className="flex flex-col items-center text-cyan-300/80">
                  <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm">
                    {coverPic ? coverPic.name : "Upload Cover Photo"}
                  </span>
                </div>
                <input
                  type="file"
                  onChange={(e) => setCoverPic(e.target.files[0])}
                  className="hidden"
                />
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-br from-cyan-500 to-blue-600 text-white font-bold py-3 rounded-xl shadow-2xl hover:shadow-3xl transform transition-all duration-300 hover:-translate-y-1 hover:scale-105 active:scale-95"
            >
              Save Changes
            </button>
          </form>
        </div>
      </div>

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(10deg); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeInUp {
          animation: fadeInUp 1s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default UpdateProfile;