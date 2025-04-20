import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      const email = localStorage.getItem("userEmail");

      if (!email || !token) {
        navigate("/login");
        return;
      }

      try {
        const res = await fetch(`http://localhost:8080/api/auth/user?email=${email}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          alert("Failed to load user");
          navigate("/login");
        }
      } catch (error) {
        alert("Error fetching user");
        navigate("/login");
      }
    };

    fetchUser();
  }, [navigate]);

  if (!user) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      {/* Cover Image */}
      {user.coverPic && (
        <img
          src={`http://localhost:8080${user.coverPic}`}
          alt="Cover"
          className="w-full h-48 object-cover rounded-xl mb-4"
        />
      )}

      {/* Profile Info */}
      <div className="flex items-center space-x-4">
        {user.profilePic && (
          <img
            src={`http://localhost:8080${user.profilePic}`}
            alt="Profile"
            className="w-20 h-20 rounded-full border-4 border-white shadow-md"
          />
        )}
        <div>
          <h1 className="text-2xl font-bold">Welcome, {user.name}!</h1>
          <p className="text-gray-600">{user.email}</p>
        </div>
      </div>

      {/* Interests */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Your Interests:</h2>
        <ul className="list-disc pl-6 text-gray-700">
          {user.categories?.map((c, i) => (
            <li key={i}>{c}</li>
          ))}
        </ul>
      </div>

      {/* Navigation Buttons */}
      <div className="mt-6 flex space-x-4">
        <button
          onClick={() => navigate("/profile")}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Go to My Profile
        </button>
        <button
          onClick={() => navigate(`/public-profile/${user.id}`)}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          View Public Profile
        </button>
      </div>
    </div>
  );
};

export default Home;
