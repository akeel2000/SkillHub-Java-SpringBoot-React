// PublicProfile.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const PublicProfile = ({ currentUser }) => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [friendStatus, setFriendStatus] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/auth/public-profile/${id}`);
        const data = await res.json();
        setProfile(data);

        if (currentUser?.id && id) {
          const statusRes = await fetch(`http://localhost:8080/api/friends/status?from=${currentUser.id}&to=${id}`);
          const statusText = await statusRes.text();
          setFriendStatus(statusText);
        }
      } catch (error) {
        console.error("Failed to load profile", error);
      }
    };
    fetchProfile();
  }, [id, currentUser]);

  const handleAddFriend = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/friends/request?fromUserId=${currentUser.id}&toUserId=${id}`, {
        method: "POST",
      });
      const msg = await res.text();
      alert(msg);
      setFriendStatus("PENDING");
    } catch (err) {
      console.error("Friend request failed", err);
    }
  };

  if (!profile) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto mt-6 p-4 bg-white shadow-lg rounded-lg">
      {profile.coverPic && (
        <img
          src={`http://localhost:8080${profile.coverPic}`}
          alt="Cover"
          className="w-full h-48 object-cover rounded-lg"
        />
      )}
      <div className="flex items-center space-x-6 mt-[-2.5rem] px-4">
        <img
          src={`http://localhost:8080${profile.profilePic}`}
          alt="Profile"
          className="w-24 h-24 rounded-full border-4 border-white shadow-md"
        />
        <div>
          <h2 className="text-2xl font-bold">{profile.name} {profile.lastName}</h2>
          <p className="text-gray-600">{profile.email}</p>
        </div>
      </div>
      <div className="mt-4 px-4">
        {currentUser?.id !== profile.id && (
          <>
            {friendStatus === "PENDING" && <p className="text-yellow-600 font-semibold">Friend Request Sent</p>}
            {friendStatus === "FRIENDS" && <p className="text-green-600 font-semibold">You are Friends</p>}
            {friendStatus === "NONE" && (
              <button
                onClick={handleAddFriend}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Add Friend
              </button>
            )}
          </>
        )}
      </div>
      <div className="mt-6 px-4">
        <h3 className="text-lg font-semibold">Interests:</h3>
        <ul className="list-disc list-inside text-gray-700">
          {profile.categories?.map((cat, index) => (
            <li key={index}>{cat}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PublicProfile;
