import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    lastName: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.text();
      if (res.ok) {
        alert("Registered Successfully! Please login.");
        navigate("/login");
      } else {
        alert(data || "Registration failed");
      }
    } catch (err) {
      alert("Something went wrong");
    }
  };

  const handleGoogleSignup = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form onSubmit={handleSignup} className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center text-indigo-600 mb-6">Create your SkillShare Account</h2>

        <input
          type="text"
          name="name"
          placeholder="First Name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full mb-4 px-4 py-3 border rounded-xl"
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={form.lastName}
          onChange={handleChange}
          required
          className="w-full mb-4 px-4 py-3 border rounded-xl"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full mb-4 px-4 py-3 border rounded-xl"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          className="w-full mb-6 px-4 py-3 border rounded-xl"
        />

        <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 transition">
          Sign Up
        </button>

        <div className="text-center my-4 text-sm text-gray-500">OR</div>

        <button
          type="button"
          onClick={handleGoogleSignup}
          className="w-full bg-red-500 text-white py-3 rounded-xl hover:bg-red-600 transition"
        >
          Sign up with Google
        </button>

        <p className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <span className="text-indigo-600 cursor-pointer" onClick={() => navigate("/login")}>
            Log In
          </span>
        </p>
      </form>
    </div>
  );
};

export default Signup;
