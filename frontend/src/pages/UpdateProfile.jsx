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
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-semibold text-center text-indigo-600 mb-4">Update Profile</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="First Name"
          className="w-full mb-4 p-3 border rounded-xl"
        />
        <input
          name="lastName"
          value={form.lastName}
          onChange={handleChange}
          placeholder="Last Name"
          className="w-full mb-4 p-3 border rounded-xl"
        />
        <div className="mb-4">
          <label>Profile Picture:</label>
          <input type="file" onChange={(e) => setProfilePic(e.target.files[0])} />
        </div>
        <div className="mb-4">
          <label>Cover Picture:</label>
          <input type="file" onChange={(e) => setCoverPic(e.target.files[0])} />
        </div>
        <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-xl">Save Changes</button>
      </form>
    </div>
  );
};

export default UpdateProfile;
