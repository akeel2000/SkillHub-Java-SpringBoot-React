import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const email = localStorage.getItem("userEmail");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/auth/user?email=${email}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setUser(data);
      } catch (err) {
        alert("Failed to load profile");
      }
    };
    fetchUser();
  }, [email, token]);

  if (!user) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <div className="relative">
        {user.coverPic && (
          <img
            src={`http://localhost:8080${user.coverPic}`}
            alt="Cover"
            className="w-full h-48 object-cover rounded-xl"
          />
        )}
        <div className="absolute -bottom-8 left-6">
          {user.profilePic && (
            <img
              src={`http://localhost:8080${user.profilePic}`}
              alt="Profile"
              className="w-20 h-20 object-cover rounded-full border-4 border-white"
            />
          )}
        </div>
      </div>

      <div className="mt-12 text-center">
        <h2 className="text-xl font-bold">{user.name} {user.lastName}</h2>
        <p className="text-sm text-gray-600">{user.email}</p>
        <p className="mt-2 text-gray-700">Interests: {user.categories?.join(", ")}</p>
      </div>

      <div className="mt-4 text-center">
        <button
          onClick={() => navigate("/update-profile")}
          className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-xl"
        >
          Update Profile
        </button>
      </div>
    </div>
  );
};

export default Profile;
