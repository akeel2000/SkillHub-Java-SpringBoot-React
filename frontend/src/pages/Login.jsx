import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8080/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const token = await res.text();
      if (res.ok) {
        localStorage.setItem("token", token);
        localStorage.setItem("userEmail", email);
        navigate("/home");
      } else {
        alert("Invalid email or password");
      }
    } catch (err) {
      alert("Login failed");
    }
  };

  const handleOAuthLogin = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center text-indigo-600 mb-6">Login to SkillShare</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full mb-4 px-4 py-3 border rounded-xl"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full mb-6 px-4 py-3 border rounded-xl"
        />

        <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 transition">
          Sign In
        </button>

        <button
          type="button"
          onClick={handleOAuthLogin}
          className="w-full mt-4 bg-red-500 text-white py-3 rounded-xl hover:bg-red-600 transition"
        >
          Sign in with Google
        </button>

        <p className="mt-4 text-center text-sm">
          Don’t have an account?{" "}
          <span className="text-indigo-600 cursor-pointer" onClick={() => navigate("/signup")}>
            Sign Up
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;
