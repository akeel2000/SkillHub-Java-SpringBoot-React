import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AccountSettings = () => {
  const navigate = useNavigate();
  const [oldEmail, setOldEmail] = useState(localStorage.getItem("userEmail"));
  const [newEmail, setNewEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleChangeEmail = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `http://localhost:8080/api/auth/change-email?oldEmail=${oldEmail}&newEmail=${newEmail}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const text = await res.text();
      if (res.ok) {
        alert(text);
        localStorage.setItem("userEmail", newEmail);
        setOldEmail(newEmail);
        setNewEmail("");
      } else {
        alert(text);
      }
    } catch (error) {
      alert("Failed to change email");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `http://localhost:8080/api/auth/change-password?email=${localStorage.getItem(
          "userEmail"
        )}&oldPassword=${oldPassword}&newPassword=${newPassword}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const text = await res.text();
      if (res.ok) {
        alert(text);
        setOldPassword("");
        setNewPassword("");
      } else {
        alert(text);
      }
    } catch (error) {
      alert("Failed to change password");
    }
  };

  const handleLogoutAll = async () => {
    const email = localStorage.getItem("userEmail");
    try {
      const res = await fetch(
        `http://localhost:8080/api/auth/logout-all?email=${email}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const text = await res.text();
      if (res.ok) {
        alert(text);
        localStorage.clear();
        navigate("/login");
      } else {
        alert(text);
      }
    } catch {
      alert("Logout from all devices failed");
    }
  };

  const handleDeleteAccount = async () => {
    if (
      !window.confirm("Are you sure you want to permanently delete your account?")
    )
      return;

    try {
      const res = await fetch(
        `http://localhost:8080/api/auth/delete?email=${localStorage.getItem(
          "userEmail"
        )}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const text = await res.text();
      alert(text);
      localStorage.clear();
      navigate("/signup");
    } catch (err) {
      alert("Failed to delete account");
    }
  };

  const handleDeactivateAccount = async () => {
    const email = localStorage.getItem("userEmail");
    if (!window.confirm("Are you sure you want to deactivate your account?"))
      return;

    try {
      const res = await fetch(
        `http://localhost:8080/api/auth/deactivate?email=${email}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const text = await res.text();
      if (res.ok) {
        alert(text);
        localStorage.clear();
        navigate("/signup");
      } else {
        alert(text);
      }
    } catch (err) {
      alert("Deactivation failed");
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
        <div className="bg-gradient-to-br from-purple-800/50 to-blue-800/50 backdrop-blur-xl border border-cyan-300/20 rounded-3xl shadow-2xl w-full max-w-lg p-8 animate-fadeInUp space-y-8">
          {/* Close Button */}
          <button
            onClick={() => navigate('/profile')}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full border-2 border-cyan-300/20 text-cyan-300 hover:border-cyan-400 hover:text-cyan-400 hover:bg-cyan-400/10 transition-all"
            aria-label="Close"
          >
            ×
          </button>

          <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Account Settings
          </h2>

          {/* Email Update Form */}
          <form onSubmit={handleChangeEmail} className="space-y-6">
            <div className="relative group">
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="New Email Address"
                required
                className="w-full px-4 py-3 bg-purple-900/30 border-2 border-cyan-300/20 rounded-xl text-cyan-100 placeholder-cyan-200/50 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all"
              />
              <div className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-br from-cyan-500 to-blue-600 text-white font-bold py-3 rounded-xl shadow-2xl hover:shadow-3xl transform transition-all duration-300 hover:-translate-y-1 hover:scale-105 active:scale-95"
            >
              Update Email
            </button>
          </form>

          {/* Password Update Form */}
          <form onSubmit={handleChangePassword} className="space-y-6">
            <div className="space-y-4">
              <div className="relative group">
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="Current Password"
                  required
                  className="w-full px-4 py-3 bg-purple-900/30 border-2 border-cyan-300/20 rounded-xl text-cyan-100 placeholder-cyan-200/50 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all"
                />
                <div className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="relative group">
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New Password"
                  required
                  className="w-full px-4 py-3 bg-purple-900/30 border-2 border-cyan-300/20 rounded-xl text-cyan-100 placeholder-cyan-200/50 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all"
                />
                <div className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-br from-cyan-500 to-blue-600 text-white font-bold py-3 rounded-xl shadow-2xl hover:shadow-3xl transform transition-all duration-300 hover:-translate-y-1 hover:scale-105 active:scale-95"
            >
              Update Password
            </button>
          </form>

          {/* Danger Zone */}
          <div className="space-y-6 pt-6 border-t border-cyan-300/20">
            <button
              onClick={handleLogoutAll}
              className="w-full bg-gradient-to-br from-red-500 to-pink-600 text-white font-bold py-3 rounded-xl shadow-2xl hover:shadow-3xl transform transition-all duration-300 hover:-translate-y-1 hover:scale-105 active:scale-95"
            >
              Logout All Devices
            </button>

            <button
              onClick={handleDeactivateAccount}
              className="w-full bg-gradient-to-br from-yellow-600 to-yellow-500 text-white font-bold py-3 rounded-xl shadow-2xl hover:shadow-3xl transform transition-all duration-300 hover:-translate-y-1 hover:scale-105 active:scale-95"
            >
              Temporary Deactivation
            </button>

            <button
              onClick={handleDeleteAccount}
              className="w-full bg-gradient-to-br from-red-700 to-red-500 text-white font-bold py-3 rounded-xl shadow-2xl hover:shadow-3xl transform transition-all duration-300 hover:-translate-y-1 hover:scale-105 active:scale-95"
            >
              Permanent Account Deletion
            </button>
          </div>
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

export default AccountSettings;