import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";

import SplashScreen from "./pages/SplashScreen";
import Onboarding from "./pages/Onboarding";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import CategorySelect from "./pages/CategorySelect";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import UpdateProfile from "./pages/UpdateProfile";


// ✅ Captures token from URL after Google OAuth login
function TokenHandler() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);
      navigate("/home");
    }
  }, [navigate]);

  return null;
}

export default function App() {
  return (
    <Router>
      <TokenHandler />
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/categories" element={<CategorySelect />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<Navigate to="/" />} />
        <Route path="/update-profile" element={<UpdateProfile />} />

      </Routes>
    </Router>
  );
}
