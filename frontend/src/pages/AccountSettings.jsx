import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AccountSettings = () => {
  const navigate = useNavigate();
  const [oldEmail, setOldEmail] = useState(localStorage.getItem("userEmail") || "");
  const [newEmail, setNewEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [emailError, setEmailError] = useState(null);
  const [emailSuccess, setEmailSuccess] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [passwordSuccess, setPasswordSuccess] = useState(null);
  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isDeactivating, setIsDeactivating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    if (email.toLowerCase() === oldEmail.toLowerCase()) return "New email must be different from the current email";
    return null;
  };

  const validatePassword = (oldPw, newPw) => {
    const minLength = 8;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!oldPw) return "Current password is required";
    if (!newPw) return "New password is required";
    if (newPw.length < minLength) return `New password must be at least ${minLength} characters`;
    if (!passwordRegex.test(newPw)) {
      return "New password must include at least one uppercase letter, one lowercase letter, one number, and one special character";
    }
    if (newPw === oldPw) return "New password must be different from the current password";
    return null;
  };

  const handleChangeEmail = async (e) => {
    e.preventDefault();
    setEmailError(null);
    setEmailSuccess(null);

    const validationError = validateEmail(newEmail);
    if (validationError) {
      setEmailError(validationError);
      return;
    }

    setIsUpdatingEmail(true);
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
        setEmailSuccess(text || "Email updated successfully");
        localStorage.setItem("userEmail", newEmail);
        setOldEmail(newEmail);
        setNewEmail("");
      } else {
        setEmailError(text || "Failed to change email");
      }
    } catch (error) {
      setEmailError("Failed to change email");
    } finally {
      setIsUpdatingEmail(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    const validationError = validatePassword(oldPassword, newPassword);
    if (validationError) {
      setPasswordError(validationError);
      return;
    }

    setIsUpdatingPassword(true);
    try {
      const res = await fetch(
        `http://localhost:8080/api/auth/change-password?email=${localStorage.getItem("userEmail")}&oldPassword=${oldPassword}&newPassword=${newPassword}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const text = await res.text();
      if (res.ok) {
        setPasswordSuccess(text || "Password updated successfully");
        setOldPassword("");
        setNewPassword("");
      } else {
        setPasswordError(text || "Failed to change password");
      }
    } catch (error) {
      setPasswordError("Failed to change password");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleLogoutAll = async () => {
    if (!window.confirm("Are you sure you want to log out from all devices?")) return;

    setIsLoggingOut(true);
    try {
      const res = await fetch(
        `http://localhost:8080/api/auth/logout-all?email=${localStorage.getItem("userEmail")}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const text = await res.text();
      if (res.ok) {
        localStorage.clear();
        navigate("/login");
      } else {
        setEmailError(text || "Logout from all devices failed");
      }
    } catch {
      setEmailError("Logout from all devices failed");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure you want to permanently delete your account?")) return;

    setIsDeleting(true);
    try {
      const res = await fetch(
        `http://localhost:8080/api/auth/delete?email=${localStorage.getItem("userEmail")}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const text = await res.text();
      if (res.ok) {
        localStorage.clear();
        navigate("/signup");
      } else {
        setEmailError(text || "Failed to delete account");
      }
    } catch {
      setEmailError("Failed to delete account");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeactivateAccount = async () => {
    if (!window.confirm("Are you sure you want to deactivate your account?")) return;

    setIsDeactivating(true);
    try {
      const res = await fetch(
        `http://localhost:8080/api/auth/deactivate?email=${localStorage.getItem("userEmail")}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const text = await res.text();
      if (res.ok) {
        localStorage.clear();
        navigate("/signup");
      } else {
        setEmailError(text || "Deactivation failed");
      }
    } catch {
      setEmailError("Deactivation failed");
    } finally {
      setIsDeactivating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div
        className="bg-gray-50 border border-gray-200 rounded-xl shadow-md p-6 w-full max-w-4xl mx-auto sm:max-w-full sm:mx-2"
        role="region"
        aria-label="Account settings"
      >
        {/* Close Button */}
        <button
          onClick={() => navigate("/profile")}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full border-2 border-gray-200 text-gray-700 hover:border-teal-400 hover:text-teal-400 transition-all"
          aria-label="Close"
        >
          ×
        </button>

        <h2 className="text-2xl font-semibold text-gray-900 text-center mb-6">
          Account Settings
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* First Column (Photography Image) */}
          <div className="col-span-1">
            <div className="bg-white border border-gray-200 rounded-lg p-4 h-full flex items-center justify-center">
              <img
                src="https://images.unsplash.com/phttps://unsplash.com/photos/person-holding-black-dslr-camera-4ZSnI_4xJe4hoto-1502982720700-bfff97cd766d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Photography-themed illustration of a camera"
                className="w-full h-auto object-cover rounded-lg border border-gray-200"
              />
            </div>
          </div>

          {/* Second Column (Input Fields and Danger Zone) */}
          <div className="col-span-1 space-y-6">
            {/* Email Update Form */}
            <form onSubmit={handleChangeEmail} className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Change Email</h3>
              <div className="relative">
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => {
                    setNewEmail(e.target.value);
                    setEmailError(null);
                  }}
                  placeholder="New Email Address"
                  required
                  disabled={isUpdatingEmail}
                  className={`w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-teal-400 ${
                    emailError ? "animate-shake border-red-500" : ""
                  }`}
                />
                {emailError && (
                  <p className="text-xs text-red-500 mt-1" role="alert">
                    {emailError}
                  </p>
                )}
                {emailSuccess && (
                  <p className="text-xs text-teal-400 mt-1" role="status">
                    {emailSuccess}
                  </p>
                )}
              </div>
              <button
                type="submit"
                disabled={isUpdatingEmail}
                className={`w-full px-4 py-2 bg-teal-400 text-white rounded-md hover:bg-teal-500 hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                aria-label="Update email"
              >
                {isUpdatingEmail ? "Updating..." : "Update Email"}
              </button>
            </form>

            {/* Password Update Form */}
            <form onSubmit={handleChangePassword} className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Change Password</h3>
              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="password"
                    value={oldPassword}
                    onChange={(e) => {
                      setOldPassword(e.target.value);
                      setPasswordError(null);
                    }}
                    placeholder="Current Password"
                    required
                    disabled={isUpdatingPassword}
                    className={`w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-teal-400 ${
                      passwordError ? "animate-shake border-red-500" : ""
                    }`}
                  />
                </div>
                <div className="relative">
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      setPasswordError(null);
                    }}
                    placeholder="New Password"
                    required
                    disabled={isUpdatingPassword}
                    className={`w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-teal-400 ${
                      passwordError ? "animate-shake border-red-500" : ""
                    }`}
                  />
                  {passwordError && (
                    <p className="text-xs text-red-500 mt-1" role="alert">
                      {passwordError}
                    </p>
                  )}
                  {passwordSuccess && (
                    <p className="text-xs text-teal-400 mt-1" role="status">
                      {passwordSuccess}
                    </p>
                  )}
                </div>
              </div>
              <button
                type="submit"
                disabled={isUpdatingPassword}
                className={`w-full px-4 py-2 bg-teal-400 text-white rounded-md hover:bg-teal-500 hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                aria-label="Update password"
              >
                {isUpdatingPassword ? "Updating..." : "Update Password"}
              </button>
            </form>

            {/* Danger Zone */}
            <div className="pt-6 border-t border-gray-200 space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Danger Zone</h3>
              <button
                onClick={handleLogoutAll}
                disabled={isLoggingOut}
                className={`w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                aria-label="Logout from all devices"
              >
                {isLoggingOut ? "Logging Out..." : "Logout All Devices"}
              </button>
              <button
                onClick={handleDeactivateAccount}
                disabled={isDeactivating}
                className={`w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                aria-label="Temporarily deactivate account"
              >
                {isDeactivating ? "Deactivating..." : "Temporary Deactivation"}
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className={`w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                aria-label="Permanently delete account"
              >
                {isDeleting ? "Deleting..." : "Permanent Account Deletion"}
              </button>
              {emailError && (
                <p className="text-xs text-red-500 mt-2" role="alert">
                  {emailError}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          50% { transform: translateX(4px); }
          75% { transform: translateX(-4px); }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default AccountSettings;
